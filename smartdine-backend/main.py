from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from models import User, ChatHistory, RecommendationFeedback
from schemas import UserCreate, UserLogin, TokenResponse, FeedbackCreate
from utils import hash_password, verify_password, create_token, decode_token
from typing import Optional
from datetime import datetime
import json



app = FastAPI(title="SmartDine Auth API")

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# --------------------------
# Signup
# --------------------------
@app.post("/signup")
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password=hash_password(payload.password),
    )

    db.add(user)
    db.commit()
    return {"message": "Signup successful"}

# --------------------------
# Login
# --------------------------
@app.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "token": create_token(user.id),
        "user_id": user.id,
        "username": user.full_name, 
        "message": "Login successful",
    }

# --------------------------
# /me (SINGLE SOURCE)
# --------------------------
@app.get("/me")
def me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.split(" ")[1]
    payload = decode_token(token)

    user = db.query(User).filter(User.id == payload.get("user_id")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"id": user.id, "full_name": user.full_name, "email": user.email}

# ============================================================
# CHAT HISTORY
# ============================================================

@app.post("/history/add")
def add_history(item: dict, db: Session = Depends(get_db)):
    try:
        user_id = item.get("user_id") or item.get("userId")
        if not user_id:
            raise HTTPException(status_code=400, detail="Missing user_id")

        entry = ChatHistory(
            user_id=user_id,
            query_text=item.get("query_text", ""),
            ai_response=item.get("ai_response", ""),
            restaurants_json=json.dumps(item.get("restaurants", [])),
            timestamp=datetime.utcnow(),
        )

        db.add(entry)
        db.commit()
        db.refresh(entry)

        return {"success": True}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{user_id}")
def get_history(user_id: int, db: Session = Depends(get_db)):
    history = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .order_by(ChatHistory.timestamp.desc())
        .all()
    )

    return [
        {
            "id": h.id,
            "user_id": h.user_id,
            "query_text": h.query_text,
            "ai_response": h.ai_response,
            "restaurants_json": h.restaurants_json,
            "timestamp": h.timestamp.isoformat(),
        }
        for h in history
    ]

# ============================================================
# FEEDBACK API
# ============================================================

@app.post("/feedback")
def submit_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    feedback = RecommendationFeedback(
        user_id=payload.user_id,
        restaurant_id=payload.restaurant_id,
        query_text=payload.query_text,
        feedback=payload.feedback,
    )

    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return {"message": "Feedback recorded"}

@app.get("/feedback/score")
def feedback_score(restaurant_id: str, db: Session = Depends(get_db)):
    up = db.query(RecommendationFeedback).filter(
        RecommendationFeedback.restaurant_id == restaurant_id,
        RecommendationFeedback.feedback == "up",
    ).count()

    down = db.query(RecommendationFeedback).filter(
        RecommendationFeedback.restaurant_id == restaurant_id,
        RecommendationFeedback.feedback == "down",
    ).count()

    return {"score": (0.2 * up) - (0.3 * down)}

@app.post("/feedback/batch")
def batch_feedback(data: dict, db: Session = Depends(get_db)):
    names = data.get("restaurants", [])

    result = {}
    for name in names:
        up = db.query(RecommendationFeedback).filter(
            RecommendationFeedback.restaurant_id == name,
            RecommendationFeedback.feedback == "up"
        ).count()

        down = db.query(RecommendationFeedback).filter(
            RecommendationFeedback.restaurant_id == name,
            RecommendationFeedback.feedback == "down"
        ).count()

        result[name] = (0.2 * up) - (0.3 * down)

    return result

@app.delete("/history/clear/{user_id}")
def clear_history(user_id: int, db: Session = Depends(get_db)):
    db.query(ChatHistory).filter(ChatHistory.user_id == user_id).delete()
    db.commit()
    return {"message": "History cleared"}
