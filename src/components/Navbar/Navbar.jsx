import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b bg-white/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-green-600 text-2xl font-bold">&#10003;</span>
        <span className="text-xl font-semibold">HealthHub</span>
      </div>
      <div className="flex gap-8 items-center">
        <Link
          to="/"
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <span>&#10003;</span> Home
        </Link>
        <Link to="/bmi" className="flex items-center gap-1 text-gray-700">
          <span>&#128202;</span> BMI Calculator
        </Link>
        <Link to="/diet" className="flex items-center gap-1 text-gray-700">
          <span>&#127860;</span> Diet Plans
        </Link>
        <Link to="/exercise" className="flex items-center gap-1 text-gray-700">
          <span>&#129504;</span> Exercise
        </Link>
      </div>
    </nav>
  );
}
