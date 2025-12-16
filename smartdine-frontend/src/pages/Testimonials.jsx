import React from "react";

export default function Testimonials() {
  const reviews = [
    {
      comment:
        "SmartDine recommends food with impressive accuracy. The suggestions feel thoughtful and personalized.",
      author: "Rahul, Chennai",
    },
    {
      comment:
        "The browsing experience is extremely smooth and the interface is elegant. Everything feels well refined.",
      author: "Ananya, Bangalore",
    },
    {
      comment:
        "This platform helped me discover new places instantly. The overall feel is modern and professional.",
      author: "Siddharth, Hyderabad",
    },
    {
      comment:
        "Highly impressed with the minimalist design and fast responses. Very useful and enjoyable to use.",
      author: "Meera, Mumbai",
    },
  ];

  const loop = [...reviews, ...reviews]; // duplicates for infinite scroll

  return (
    <div className="testimonials-section">
      <h2 className="testimonials-title">Words from our users</h2>

      <div className="scroll-mask">
        <div className="scroll-track">
          {loop.map((r, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-text">“{r.comment}”</p>
              <p className="testimonial-author">— {r.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
