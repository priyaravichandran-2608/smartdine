import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);


  const token = localStorage.getItem("token");

 const userId = localStorage.getItem("userId");

const clearHistory = async () => {
  await fetch(`http://localhost:8000/history/clear/${userId}`, {
    method: "DELETE",
  });

  setHistory([]);
};



  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/history/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        // 🔹 ensure safe parsing
        const parsed = data.map(item => ({
          ...item,
          restaurants: item.restaurants_json
            ? JSON.parse(item.restaurants_json)
            : [],
        }));

        setHistory(parsed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, token]);

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">

  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold">Your Search History</h2>

    {!loading && history.length > 0 && (
      <button
        onClick={clearHistory}
        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm font-semibold"
      >
        Clear History
      </button>
    )}
  </div>


        {history.map(h => (
          <div
            key={h.id}
            className="bg-black/50 p-5 rounded-xl mb-5 shadow-lg"
          >
            <p className="text-orange-400 font-semibold">Query</p>
            <p className="mb-2">{h.query_text}</p>

            <p className="text-orange-400 font-semibold mt-3">AI Response</p>
            <p className="whitespace-pre-line">{h.ai_response}</p>

            {h.restaurants.length > 0 && (
              <>
                <p className="text-orange-400 font-semibold mt-3">
                  Recommended Restaurants
                </p>
                <ul className="list-disc list-inside opacity-90">
                  {h.restaurants.map((r, i) => (
                    <li key={i}>{r.name}</li>
                  ))}
                </ul>
              </>
            )}

            <p className="text-xs opacity-60 mt-3">
              {new Date(h.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
