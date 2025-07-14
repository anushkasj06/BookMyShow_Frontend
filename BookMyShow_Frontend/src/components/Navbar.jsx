import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LocationModal from "./LocationModal";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [city, setCity] = useState("Pune");
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUsername("");
    setIsLoggedIn(false);
    window.location.href = "/";
  };
  const handleProfile = () => {
    if (isLoggedIn) {
      if (username) {
        navigate("/profile");
      } else {
        alert("Please log in to view your profile.");
      }
    } else {
      navigate("/login");
    }
  };

  return (isLoggedIn) ? (
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
          <span onClick={handleProfile} className="text-gray-700 cursor-pointer hover:text-red-500">{username}</span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Logout</button>
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
  ) : (
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