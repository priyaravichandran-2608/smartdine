import os
import json
import faiss
import numpy as np
import pickle
import torch
torch.set_num_threads(4)
torch.set_num_interop_threads(1)
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sentence_transformers import SentenceTransformer
from openai import OpenAI
import requests
from dotenv import load_dotenv
import os

load_dotenv()   # 👈 THIS IS REQUIRED


# ---------------------------------------
# CONFIG
# ---------------------------------------
INDEX_DIR = "indexes"
EMBED_MODEL_PATH = "fine_tuned_embeddings"
FEEDBACK_API_URL = "http://localhost:8000/feedback/score"
FEEDBACK_CACHE = {}

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set")

client = OpenAI(api_key=OPENAI_API_KEY)

# ---------------------------------------
# LOAD EMBEDDING MODEL
# ---------------------------------------

print("🔄 Loading embedding model at startup...")
embed_model = SentenceTransformer(
    EMBED_MODEL_PATH,
    device="cpu"   # explicit
)
print("✅ Embedding model ready")


# ---------------------------------------
# LOAD FAISS INDEXES & METADATA
# ---------------------------------------
city_indexes = {}
city_meta = {}

print("Loading FAISS indexes...")

for file in os.listdir(INDEX_DIR):
    if file.endswith(".faiss"):
        city = file.replace(".faiss", "")
        index = faiss.read_index(os.path.join(INDEX_DIR, file))
        city_indexes[city] = index

        with open(os.path.join(INDEX_DIR, f"meta_{city}.pkl"), "rb") as f:
            city_meta[city] = pickle.load(f)

print("Loaded cities:", list(city_indexes.keys()))

for idx in city_indexes.values():
    if hasattr(idx, "nprobe"):
        idx.nprobe = 4

# ---------------------------------------
# FASTAPI SETUP
# ---------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------
# UTILS
# ---------------------------------------



def extract_name(rag_text: str):
    try:
        return rag_text.split("Restaurant:")[1].split(".")[0].strip()
    except:
        return "Unknown"


def sse(data):
    return f"data: {json.dumps(data)}\n\n"

def safe_float(value):
    try:
        return float(value)
    except:
        return None

def clean_cuisines(value):
    if not value:
        return "NA"
    if isinstance(value, list):
        return ", ".join(value)
    return (
        str(value)
        .replace("[", "")
        .replace("]", "")
        .replace("'", "")
        .replace('"', "")
        .replace("•", ",")
        .strip()
    )
    
def get_feedback_scores(names: list[str]):
    try:
        res = requests.post(
            "http://localhost:8000/feedback/batch",
            json={"restaurants": names},
            timeout=1.5
        )
        if res.status_code == 200:
            return res.json()
    except:
        pass
    return {}


# ---------------------------------------
# RAG RETRIEVAL
# ---------------------------------------
def retrieve(query, city, k=3):
    # 1️⃣ City safety check
    if city not in city_indexes:
        return []

    index = city_indexes[city]
    df = city_meta[city]

    # 2️⃣ Encode query (model already loaded globally)
    qv = embed_model.encode(
    query,
    convert_to_numpy=True,
    normalize_embeddings=True
).reshape(1, -1).astype("float32")


    # 3️⃣ FAISS search
    D, I = index.search(qv, k)

    results = []

    # 4️⃣ Build results (NO network calls here)
    for idx, dist in zip(I[0], D[0]):
        r = df.iloc[idx].to_dict()

        name = extract_name(r.get("rag_text", ""))

        results.append({
            "name": name,
            "cuisines": " • ".join(str(r.get("cuisines", "")).split(",")),
            "area": r.get("area", "NA"),
            "rating": safe_float(r.get("avgrating")),
            "budget": r.get("price_level", "NA"),
            "address": r.get("address", "NA"),
            "delivery": r.get("deliverytime", "NA"),
            "rag_text": r.get("rag_text", ""),
            "_score": -dist   # FAISS similarity score
        })

    # 5️⃣ Sort by FAISS relevance
    results.sort(key=lambda x: x["_score"], reverse=True)

    # 6️⃣ Cleanup internal score
    for r in results:
        r.pop("_score", None)

    return results



# ---------------------------------------
# BUILD CONTEXT FOR LLM
# ---------------------------------------
def build_context(restaurants):
    lines = []
    for r in restaurants:
        lines.append(
            f"Name: {r['name']}. Area: {r['area']}. Cuisine: {r['cuisines']}. "
            f"Budget: {r['budget']}. Rating: {r['rating']}. "
            f"Address: {r['address']}. Delivery: {r['delivery']}."
        )
    return "\n".join(lines)


# ---------------------------------------
# PREVENT MULTIPLE REPEATED SEARCHES
# ---------------------------------------
LAST_QUERY = None
LAST_RESULT = None


# ---------------------------------------
# MAIN RAG STREAM ENDPOINT
# ---------------------------------------
@app.post("/rag_stream")
async def rag_stream(request: Request):

    global LAST_QUERY, LAST_RESULT

    body = await request.json()
    query = body.get("query", "").strip()
    city = body.get("city", "").strip()

    if not query:
        async def empty_stream():
            yield sse({"type": "error", "message": "Empty query"})
            yield sse({"type": "done"})
        return StreamingResponse(empty_stream(), media_type="text/event-stream")

    query_key = f"{city}:{query}"

    # 🔁 CACHE HIT
    if query_key == LAST_QUERY:
        async def cached():
            yield sse({"type": "results", "restaurants": LAST_RESULT})
            yield sse({"type": "delta", "text": "Here are your results again!"})
            yield sse({"type": "done"})
        return StreamingResponse(cached(), media_type="text/event-stream")

    # 🔍 FAST FAISS SEARCH
    restaurants = retrieve(query, city, k=5)
    LAST_QUERY = query_key
    LAST_RESULT = restaurants

    context = build_context(restaurants[:2])  # ⬅️ smaller = faster

    prompt = f"""
You are SmartDine — an intelligent restaurant recommendation expert.
Your job is to understand the user's food craving, mood, budget, area,
and intent from the query and recommend ONLY from the provided restaurant list.

🚫 STRICT RULES (must follow):
* NEVER invent restaurants, dishes, prices, areas, or facts.
* NEVER hallucinate. Only use information from the list.
* If a restaurant is not in the list, you CANNOT mention it.
* If no restaurant fits well, give the closest match and explain why.

🎯 YOUR GOAL:
* Understand the user's intent (craving, emotion, budget, area).
* Match it with the best restaurants from the list.
* Give short, friendly, helpful guidance.
* Highlight WHY each restaurant fits the query.

💡 HOW TO ANSWER:
* Start with a warm, conversational line.
* Recommend 1 restaurant (based on context quality) if the user didnt mention how many recommendation is he/she needs.
* If he/she mention the no of restaurants the user needs for recommendation then return that number of restaurants
* For each: explain in 1–2 lines why it fits the user's request.
 
User Query:
{query}

Available Restaurants (use ONLY these):
{context}

Now give the best possible recommendation in a friendly tone.
"""

    async def event_stream():

        # ✅ 1. SEND RESULTS INSTANTLY
        yield sse({"type": "results", "restaurants": restaurants})
    
        # ✅ 2. FAST NON-STREAMING AI CALL
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Recommend restaurants only from given list."},
                    {"role": "user", "content": prompt},
                ],
                timeout=8,   # ⬅️ VERY IMPORTANT
            )

            text = response.choices[0].message.content
            yield sse({"type": "delta", "text": text})

        except Exception:
            yield sse({
                "type": "delta",
                "text": "Here are the best matches based on rating and popularity."
            })

        yield sse({"type": "done"})

    return StreamingResponse(event_stream(), media_type="text/event-stream")


    
 

             
# ---------------------------------------
# SURPRISE ME ENDPOINT
# ---------------------------------------
@app.get("/surprise")
async def surprise(city: str):

    df = city_meta.get(city)
    if df is None:
        return {"error": "Invalid city"}

    row = df.sample(1).iloc[0].to_dict()

    result = {
        "name": extract_name(row.get("rag_text", "")),
        "cuisines": " • ".join(row["cuisines"]),
        "area": row.get("area", "NA"),
        "rating": safe_float(row.get("avgrating")),
        "budget": row.get("price_level", "NA"),
        "address": row.get("address", "NA"),
        "delivery": row.get("deliverytime", "NA"),
        "rag_text": row.get("rag_text", "")
    }

    return {"result": result}
