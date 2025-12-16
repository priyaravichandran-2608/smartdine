import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import { Button, Loader, Modal } from "@mantine/core";
import SpinWheel from "./SpinWheel";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";
import {
  Utensils,
  Leaf,
  Briefcase,
  Soup,
  Wine,
  Sandwich,
} from "lucide-react";


export default function SearchPage() {
  const location = useLocation();
  const [selectedMood, setSelectedMood] = useState(null);

  const params = new URLSearchParams(location.search);
  const initialCity = params.get("city") || "";

  const [city, setCity] = useState(initialCity);
  const [query, setQuery] = useState("");
  const finalAnswerRef = useRef("");
  const historySavedRef = useRef(false);
  
  useEffect(() => {
  if (query || city) {
    setSelectedMood(null);
  }
}, [query, city]);



  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  const [wheelOpen, setWheelOpen] = useState(false);

  const resultRef = useRef(null);
 useEffect(() => {
  if (answer && resultRef.current) {
    const yOffset = -120; // navbar height
    const y =
      resultRef.current.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }
}, [answer]);



 const renderStars = (rating) => {
  if (!rating) return "";

  // extract number like 4 or 4.5 from "4.5🌟"
  const match = String(rating).match(/[\d.]+/);
  if (!match) return "";

  const num = Math.round(parseFloat(match[0]));
  return "⭐".repeat(num);
};

const getUserFromStorage = () => {
  const id = localStorage.getItem("userId");
  if (!id) return null;
  return { id: Number(id) };
};

const [historySaved, setHistorySaved] = useState(false);


  const ensureCity = () => {
    if (!city) {
      alert("Please select a city.");
      return false;
    }
    return true;
  };
  
  const extractRating = (value) => {
  if (!value) return null;
  const match = String(value).match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
};

const sendFeedback = async (restaurantName, type) => {
  const user = getUserFromStorage();
  if (!user) return;

  await fetch("http://localhost:8000/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      user_id: user.id,
      restaurant_id: restaurantName,
      query_text: query,
      feedback: type, // "up" | "down"
    }),
  });
};


  // -------------------- SEARCH --------------------
  const runSearch = async (forcedQuery) => {
    const finalQuery = forcedQuery || query; // ← FIX HERE
    
    finalAnswerRef.current = "";
    historySavedRef.current = false;


    if (!ensureCity()) return;
    if (!finalQuery.trim()) return;

    setHistorySaved(false);
    setLoading(true);
    setAnswer("");
    setRestaurants([]);

    const response = await fetch("http://localhost:5001/rag_stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: finalQuery, city }),
    });

    if (!response.ok) {
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop();

      chunks.forEach((msg) => {
        if (!msg.startsWith("data:")) return;

        let json;
        try {
          json = JSON.parse(msg.replace("data:", "").trim());
        } catch {
          return;
        }

        if (json.type === "results") {
  const filtered = json.restaurants
    .filter(
      (rest) =>
        rest.rating &&
        rest.rating !== "NA" &&
        rest.rating !== "" &&
        rest.rating !== 0
    )
    .sort(
      (a, b) => Number(b.rating) - Number(a.rating)
    );

  setRestaurants(filtered);
}


        if (json.type === "delta") {
  finalAnswerRef.current += json.text;
  setAnswer(prev => prev + json.text);
}


       if (json.type === "done") {
  setLoading(false);

  if (!historySavedRef.current) {
    const user = getUserFromStorage();

if (user && !historySavedRef.current) {
  fetch("http://localhost:8000/history/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      user_id: user.id,          // ✅ FIXED (explicit)
      query_text: finalQuery,
      ai_response: finalAnswerRef.current,
      restaurants: restaurants,
    }),
  }).then(() => {
    historySavedRef.current = true;
  });
}


    historySavedRef.current = true;
    setHistorySaved(true);
  }
}

   

      });
    }
  };

  // -------------------- MOOD SELECTOR --------------------
  const moods = [
    { label: "Casual Dining", icon: Utensils },
    { label: "Healthy Choices", icon: Leaf },
    { label: "Work / Study Mode", icon: Briefcase },
    { label: "Comfort Food", icon: Soup },
    { label: "Fine Dining", icon: Wine },
    { label: "Quick Bites", icon: Sandwich },
  ];

  const handleMoodSelect = (moodLabel) => {
     setSelectedMood(moodLabel);
    setQuery(moodLabel);
    runSearch(moodLabel); // ← FIX HERE
  };

  // -------------------- SPIN WHEEL --------------------
  const handleCategorySelected = (category) => {
    setSelectedMood(null);
    setWheelOpen(false);
    setQuery(category);
    runSearch(category); // ← FIX HERE
  };

  return (
    <div className="min-h-screen text-white pb-0">
     <Navbar />
      {/* SEARCH SECTION */}
      <section className="pt-28 pb-10 px-6 text-center">

        <h1 className="text-4xl font-bold" style={{ fontFamily: "Sentient, serif" }}>
          Discover your food instantly!
        </h1>

        {/* SEARCH BAR */}
        <div className="flex flex-col md:flex-row gap-4 mt-10 max-w-3xl mx-auto">

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-[52px] w-full md:w-56 bg-white text-black rounded-xl px-4 shadow-md text-lg outline-none"
          >
            <option value="">Choose City</option>
            <option value="chennai">Chennai</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
          </select>
          

          <input
            className="h-[52px] w-full md:w-96 bg-white text-black rounded-xl px-4 shadow-md text-lg outline-none"
            placeholder="Search for restaurants, items or cuisines"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Button
            onClick={() => runSearch()}
            radius="md"
            size="lg"
            variant="filled"
            color="dark"
            className="h-[52px] px-10 text-lg font-semibold shadow-md hover:bg-black"
            style={{ fontFamily: "Sentient, serif", backgroundColor: "black" }}
          >
            {loading ? <Loader size="sm" color="white" /> : "Search"}
          </Button>

        </div>

        {/* SURPRISE ME BUTTON */}
        <Button
          onClick={() => setWheelOpen(true)}
          radius="md"
          size="lg"
          variant="filled"
          color="dark"
          className="mt-6 px-10 py-3 text-lg font-semibold shadow-md hover:bg-black"
          style={{ fontFamily: "Sentient, serif", backgroundColor: "black" }}
        >
          Surprise Me
        </Button>

        {/* MOOD SELECTOR */}
        <div className="mt-16 max-w-6xl mx-auto relative">

          <h3
            className="text-3xl font-bold mb-6 text-white text-center"
            style={{ fontFamily: "Sentient, serif" }}
          >
            Explore by Dining Style
          </h3>
       <div className="w-24 h-1 bg-orange-500 mx-auto mb-8 rounded-full opacity-80"></div>

          {/* LEFT ARROW */}
          <button
            onClick={() => {
              document.getElementById("moodScroll").scrollBy({
                left: -250,
                behavior: "smooth",
              });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/4 z-10
               bg-white/80 border border-white/60 
               text-black font-bold px-3 py-3 rounded-full shadow-md
               hover:bg-white transition active:scale-90"
          >
            ‹
          </button>

          {/* SCROLL AREA */}
          <div
            id="moodScroll"
            className="flex gap-6 overflow-x-auto pb-4 px-10 scroll-smooth no-scrollbar"
          >
           {moods.map((m, i) => (
  <button
    key={i}
    onClick={() => handleMoodSelect(m.label)}
    className={`
      group min-w-[200px] px-7 py-6 rounded-2xl 
      backdrop-blur-xl
      border border-transparent
      shadow-xl
      font-semibold
      transition-all duration-300
      hover:-translate-y-1 hover:scale-[1.04]
      hover:shadow-2xl
      hover:border-2 hover:border-orange-300
      ${
        selectedMood === m.label
          ? "bg-orange-500 text-white scale-[1.05]"
          : "bg-white/90 text-black"
      }
    `}
    style={{
      fontFamily: "Sentient, serif",
      letterSpacing: "0.3px",
    }}
  >
    <div className="mb-3 flex justify-center">
      <m.icon
        size={32}
        className={`transition ${
          selectedMood === m.label
            ? "text-white"
            : "opacity-80 group-hover:opacity-100"
        }`}
      />
    </div>

    <div className="text-lg">{m.label}</div>
  </button>
))}

          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={() => {
              document.getElementById("moodScroll").scrollBy({
                left: 250,
                behavior: "smooth",
              });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/4 z-10
               bg-white/80 border border-white/60
               text-black font-bold px-3 py-3 rounded-full shadow-md
               hover:bg-white transition active:scale-90"
          >
            ›
          </button>

        </div>

      </section>

      {/* AI RESPONSE */}
 <div ref={resultRef} className="scroll-mt-28">
  {answer && (
    <div className="max-w-5xl mx-auto bg-white text-black p-6 rounded-2xl shadow-xl text-lg mb-10 border-t-4 border-orange-500">
      
      {/* Label */}
      <div className="text-sm font-semibold text-orange-500 mb-3 tracking-wide">
        🤖 SmartDine Recommendation
      </div>

      {/* AI Text */}
      <div className="leading-relaxed">
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>

    </div>
  )}
</div>


      {/* RESTAURANT RESULTS */}
      {restaurants.length > 0 && (
        <section className="bg-white text-[#3d4152] px-10 py-16 rounded-t-3xl">

          <h2 className="text-3xl font-bold mb-8">Top Recommendations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {restaurants.map((r, i) => (
    <div
      key={i}
      className="
        group bg-white rounded-2xl p-6
        border border-[#ececec]
        shadow-sm hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-1
      "
    >
      {/* Restaurant Name */}
      <h3 className="text-xl font-bold text-[#1c1c1c] mb-1">
        {r.name}
      </h3>

      {/* Area */}
      <p className="text-sm text-gray-500 mb-2">
        📍 {r.area}
      </p>

  <p className="text-[#7e808c] text-sm">
  {String(r.cuisines)
    .split(" ")
    .reduce((acc, word, i) => {
      if (i % 2 === 0) acc.push(word);
      else acc[acc.length - 1] += " " + word;
      return acc;
    }, [])
    .join(", ")}
</p>



      {/* Rating */}
 <p className="mt-2 font-semibold text-[#3d4152]">
  ⭐ {r.rating}
</p>

  <div className="flex items-center justify-between mt-4">

  <span className="text-xs font-semibold text-orange-500">
    Top Pick
  </span>

  {/* 👍 👎 FEEDBACK */}
  <div className="flex gap-3">
    <button
      onClick={() => sendFeedback(r.name, "up")}
      className="text-xl hover:scale-110 transition"
      title="Helpful"
    >
      👍
    </button>

    <button
      onClick={() => sendFeedback(r.name, "down")}
      className="text-xl hover:scale-110 transition"
      title="Not helpful"
    >
      👎
    </button>
  </div>

</div>

</div>

    
  ))}
</div>

        </section>
      )}

      {/* SPIN WHEEL MODAL */}
      <Modal opened={wheelOpen} onClose={() => setWheelOpen(false)} centered>
        <h2 className="text-center text-2xl font-bold text-black mb-4">
          Spin the Wheel
        </h2>

        <SpinWheel onCategorySelected={handleCategorySelected} />
      </Modal>

      <Footer />
    </div>
  );
}
