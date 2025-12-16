import React, { useState } from "react";
import { Button } from "@mantine/core";

// MINIMAL & ELEGANT COLORS
const categories = [
  { label: "Top Rated", color: "#FF9F9F" },
  { label: "Budget Friendly", color: "#FFD59E" },
  { label: "Trending Today", color: "#A7C7FF" },
  { label: "Student Favorites", color: "#B6F2A3" },
  { label: "Signature Dishes", color: "#D2C6FF" },
  { label: "Chef Specials", color: "#FFB7A6" }
];

export default function SpinWheel({ onCategorySelected }) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const sliceAngle = 360 / categories.length;

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const randomIndex = Math.floor(Math.random() * categories.length);
    const fullSpins = 360 * 5;
    const finalDeg = fullSpins - (randomIndex * sliceAngle + sliceAngle / 2);

    setRotation(finalDeg);

    setTimeout(() => {
      onCategorySelected(categories[randomIndex].label);
      setIsSpinning(false);
    }, 3500);
  };

  const createSlice = (index, color, label) => {
    const startAngle = sliceAngle * index;
    const endAngle = startAngle + sliceAngle;

    const start = polarToCartesian(150, 150, 140, endAngle);
    const end = polarToCartesian(150, 150, 140, startAngle);

    return (
      <g key={index}>
        {/* Slice */}
        <path
          d={`M150 150 L ${start.x} ${start.y} A 140 140 0 0 0 ${end.x} ${end.y} Z`}
          fill={color}
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Label */}
        <text
          x="150"
          y="150"
          transform={`rotate(${startAngle + sliceAngle / 2} 150 150) translate(0 -95)`}
          textAnchor="middle"
          fill="#222"
          fontWeight="600"
          fontSize="12"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-white/20">
      
      {/* Elegant pointer */}
      <div className="relative">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 
                        w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px]
                        border-transparent border-b-black drop-shadow-md"></div>

        {/* Wheel */}
        <svg
          width="300"
          height="300"
          className="rounded-full shadow-xl"
          style={{
            transition: "transform 3.5s cubic-bezier(0.33, 1, 0.68, 1)",
            transform: `rotate(${rotation}deg)`
          }}
        >
          {categories.map((cat, i) => createSlice(i, cat.color, cat.label))}
        </svg>
      </div>

      <Button
        onClick={spin}
        disabled={isSpinning}
        radius="xl"
        size="lg"
        color="black"
        className="font-bold px-8 shadow-lg hover:shadow-xl transition-all"
      >
        {isSpinning ? "Spinning..." : "Surprise Me 🎡"}
      </Button>
    </div>
  );
}

function polarToCartesian(cx, cy, radius, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad)
  };
}
