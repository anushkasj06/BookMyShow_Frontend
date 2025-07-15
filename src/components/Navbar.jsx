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
  const [city, setCity] = useState("Pune");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [searchError, setSearchError] = useState(""); // State for displaying search errors

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
      setSearchError("Please enter a movie name to search.");
      return;
    }

    try {
      // Assuming your backend has an endpoint like /movies/search?name=QUERY
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/movies/search?name=${searchQuery.trim()}`,
        // Add Authorization header if movie search also requires authentication
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // }
      );
      // Navigate to a search results page, passing the results via state
      navigate(`/movies/search-results?query=${searchQuery.trim()}`, { state: { searchResults: response.data, searchQuery: searchQuery.trim() } });
      setSearchQuery(""); // Clear search query after submission
      setSearchError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error searching for movies:", error);
      setSearchError("Failed to search movies. Please try again or check the movie name.");
    }
  };

  return isLoggedIn ? (
    <>
      <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-black">
            book<span className="text-red-600">my</span>show
          </Link>
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search for Movies..."
              className="ml-6 px-4 py-2 rounded border w-96 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="ml-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition">Search</button>
            {searchError && (
              <p className="absolute left-6 top-full mt-1 text-sm text-red-600">{searchError}</p>
            )}
          </form>
        </div>
        <div className="flex items-center gap-4">
          {userRole === "ADMIN" && (
            <>
              <Link to="/admin/dashboard" className="text-gray-700 cursor-pointer hover:text-red-500 font-semibold">
                Dashboard
              </Link>
            </>
          )}
          <span
            className="text-gray-700 cursor-pointer hover:text-red-500"
            onClick={() => setShowLocationModal(true)}
          >
            {city} ▼
          </span>
          <span onClick={handleProfile} className="text-gray-700 cursor-pointer hover:text-red-500">
            {username}
          </span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
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
      <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-black">
            book<span className="text-red-600">my</span>show
          </Link>
          {/* Search Bar for logged out users */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search for Movies..."
              className="ml-6 px-4 py-2 rounded border w-96 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="ml-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition">Search</button>
            {searchError && (
              <p className="absolute left-6 top-full mt-1 text-sm text-red-600">{searchError}</p>
            )}
          </form>
        </div>
        <div className="flex items-center gap-4">
          <span
            className="text-gray-700 cursor-pointer hover:text-red-500"
            onClick={() => setShowLocationModal(true)}
          >
            {city} ▼
          </span>
          <Link to="/login" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Login
          </Link>
          <Link to="/signup" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">
            Sign Up
          </Link>
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
