import React, { useState } from "react";
import { Link } from "react-router-dom";
import LocationModal from "./LocationModal";

const Navbar = () => {
  const [city, setCity] = useState("Pune");
  const [showLocationModal, setShowLocationModal] = useState(false);

  return (
    <>
      <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-black">
            book<span className="text-red-600">my</span>show
          </Link>
          <input
            type="text"
            placeholder="Search for Movies, Events, Plays, Sports and Activities"
            className="ml-6 px-4 py-2 rounded border w-96 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <span
            className="text-gray-700 cursor-pointer hover:text-red-500"
            onClick={() => setShowLocationModal(true)}
          >
            {city} ▼
          </span>
          <Link to="/login" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Login</Link>
          <Link to="/signup" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">Sign Up</Link>
          <button className="ml-2 text-2xl">&#9776;</button>
        </div>
      </nav>
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectCity={(selected) => {
          setCity(selected);
          setShowLocationModal(false);
        }}
      />
    </>
  );
};

export default Navbar;