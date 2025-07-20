import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LocationModal from "./LocationModal";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for making API calls

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || ""); // New state for user role
  const [city, setCity] = useState(localStorage.getItem("city") || "Pune");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [searchError, setSearchError] = useState(""); // State for displaying search errors
  const [searchType, setSearchType] = useState("movie"); // New state for search type (movie or theater)

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role"); // Get stored role

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserRole(storedRole); // Set role from localStorage immediately

      // Fetch profile to ensure role is always up-to-date from backend
      // This is good practice to confirm the token and user's current status
      fetch(`${import.meta.env.VITE_BACKEND_API}/signup/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            // If token is invalid or expired, log out
            if (response.status === 401) {
              handleLogout();
              throw new Error("Unauthorized - Token expired or invalid.");
            }
            throw new Error("Failed to fetch user profile.");
          }
          return response.json();
        })
        .then((data) => {
          // Assuming data.roles is an array of strings, like ["ADMIN"] or ["USER"]
          const fetchedRole = data.roles && data.roles.length > 0 ? data.roles[0] : "";
          localStorage.setItem("role", fetchedRole);
          setUserRole(fetchedRole); // Update role in state
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // Optionally, handle specific errors (e.g., if token is truly invalid)
          // handleLogout(); // Uncomment this if you want to force logout on any profile fetch error
        });
    } else {
      setIsLoggedIn(false);
      setUsername("");
      setUserRole("");
    }
  }, []); // Run once on component mount

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUsername("");
    setUserRole("");
    setIsLoggedIn(false);
    navigate("/"); // Use navigate for smoother routing
  };

  const handleProfile = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSearchError(""); // Clear error when user types
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (searchQuery.trim() === "") {
      setSearchError("Please enter a search term.");
      return;
    }

    try {
      let searchResults = [];
      let searchTypeLabel = "";

      if (searchType === "movie") {
        // Search for movies
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/movies/search?name=${searchQuery.trim()}`
        );
        searchResults = response.data;
        searchTypeLabel = "movies";
      } else {
        // Search for theaters
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/theaters`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // Filter theaters by name (client-side filtering since no theater search API exists)
        const allTheaters = response.data;
        searchResults = allTheaters.filter(theater =>
          theater.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          theater.city.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
        searchTypeLabel = "theaters";
      }

      // Navigate to search results page with both movie and theater results
      navigate(`/search-results?query=${searchQuery.trim()}&type=${searchType}`, { 
        state: { 
          searchResults, 
          searchQuery: searchQuery.trim(),
          searchType: searchType,
          searchTypeLabel
        } 
      });
      setSearchQuery(""); // Clear search query after submission
      setSearchError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error searching:", error);
      setSearchError(`Failed to search ${searchType}. Please try again.`);
    }
  };

  return isLoggedIn ? (
    <>
      <nav className="backdrop-blur-md bg-white/70 shadow-xl px-8 py-4 flex items-center justify-between rounded-b-2xl border-b border-red-100/40 transition-all duration-300">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-3xl font-extrabold text-black tracking-tight drop-shadow-sm hover:scale-105 transition-transform">
            book<span className="text-red-600">my</span>show
          </Link>
          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white/80 shadow-sm focus-within:ring-2 focus-within:ring-red-400">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 text-sm focus:outline-none focus:bg-red-50 transition-colors"
              >
                <option value="movie">Movies</option>
                <option value="theater">Theaters</option>
              </select>
              <input
                type="text"
                placeholder={`Search for ${searchType === 'movie' ? 'Movies' : 'Theaters'}...`}
                className="px-4 py-2 w-80 bg-transparent focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <button type="submit" className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2 rounded-xl shadow-md hover:from-pink-500 hover:to-red-500 hover:scale-105 transition-all font-semibold">
              Search
            </button>
            {searchError && (
              <p className="absolute left-0 top-full mt-1 text-sm text-red-600 animate-pulse">{searchError}</p>
            )}
          </form>
        </div>
        <div className="flex items-center gap-6">
          {userRole === "ADMIN" && (
            <>
              <Link to="/admin/dashboard" className="text-gray-700 cursor-pointer hover:text-red-500 font-semibold transition-colors underline underline-offset-4">
                Dashboard
              </Link>
            </>
          )}
          <span
            className="text-gray-700 cursor-pointer hover:text-red-500 font-medium px-3 py-1 rounded-lg bg-white/60 shadow-sm transition-all border border-gray-100"
            onClick={() => setShowLocationModal(true)}
          >
            {city} <span className="ml-1">▼</span>
          </span>
          <span onClick={handleProfile} className="text-gray-700 cursor-pointer hover:text-red-500 font-semibold px-3 py-1 rounded-lg transition-colors bg-white/60 shadow-sm border border-gray-100">
            {username}
          </span>
          <button onClick={handleLogout} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2 rounded-xl shadow-md hover:from-pink-500 hover:to-red-500 hover:scale-105 transition-all font-semibold">
            Logout
          </button>
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
      <nav className="backdrop-blur-md bg-white/70 shadow-xl px-8 py-4 flex items-center justify-between rounded-b-2xl border-b border-red-100/40 transition-all duration-300">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-3xl font-extrabold text-black tracking-tight drop-shadow-sm hover:scale-105 transition-transform">
            book<span className="text-red-600">my</span>show
          </Link>
          {/* Enhanced Search Bar for logged out users */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white/80 shadow-sm focus-within:ring-2 focus-within:ring-red-400">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 text-sm focus:outline-none focus:bg-red-50 transition-colors"
              >
                <option value="movie">Movies</option>
                <option value="theater">Theaters</option>
              </select>
              <input
                type="text"
                placeholder={`Search for ${searchType === 'movie' ? 'Movies' : 'Theaters'}...`}
                className="px-4 py-2 w-80 bg-transparent focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <button type="submit" className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2 rounded-xl shadow-md hover:from-pink-500 hover:to-red-500 hover:scale-105 transition-all font-semibold">
              Search
            </button>
            {searchError && (
              <p className="absolute left-0 top-full mt-1 text-sm text-red-600 animate-pulse">{searchError}</p>
            )}
          </form>
        </div>
        <div className="flex items-center gap-6">
          <span
            className="text-gray-700 cursor-pointer hover:text-red-500 font-medium px-3 py-1 rounded-lg bg-white/60 shadow-sm transition-all border border-gray-100"
            onClick={() => setShowLocationModal(true)}
          >
            {city} <span className="ml-1">▼</span>
          </span>
          <Link to="/login" className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2 rounded-xl shadow-md hover:from-pink-500 hover:to-red-500 hover:scale-105 transition-all font-semibold">
            Login
          </Link>
          <Link to="/signup" className="bg-gray-100 text-gray-800 px-5 py-2 rounded-xl shadow-md hover:bg-gray-200 hover:scale-105 transition-all font-semibold">
            Sign Up
          </Link>
          <button className="ml-2 text-2xl text-gray-700 hover:text-red-500 transition-colors">&#9776;</button>
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
