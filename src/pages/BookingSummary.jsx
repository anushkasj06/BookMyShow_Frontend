import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const BookingSummary = () => {
  const query = useQuery();
  const { id } = useParams(); // movie id from URL params
  const movie = query.get("movie") || "Sitaare Zameen Par";
  const theatre = query.get("theatre") || "Cinepolis: Seasons Mall, Pune";
  const time = query.get("time") || "08:00 PM";
  const seats = query.get("seats") ? query.get("seats").split(",") : [];
  const amount = query.get("amount") || "0";
  const navigate = useNavigate();
  
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get movie ID from URL params or try to extract from movie name
        let movieId = id;
        
        // If no ID in params, try to get from localStorage or use a default
        if (!movieId) {
          // Try to get from localStorage if available
          const storedMovieId = localStorage.getItem('lastMovieId');
          if (storedMovieId) {
            movieId = storedMovieId;
          } else {
            // Use a default movie ID for demo purposes
            movieId = "1"; // You can change this to a valid movie ID
          }
        }

        console.log("Fetching movie data for ID:", movieId);
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/movies/id/${movieId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });
        
        console.log("Movie data received:", response.data);
        setMovieData(response.data);
        
        // Store the movie ID for future use
        localStorage.setItem('lastMovieId', movieId);
        
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setError("Failed to load movie poster");
        
        // Create a fallback movie data object
        setMovieData({
          movieName: movie,
          imageUrl: "https://via.placeholder.com/256x384/cccccc/666666?text=Movie+Poster",
          rating: "8.5",
          genre: "Action",
          language: "Hindi",
          duration: 150
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, movie]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-200 opacity-20 rounded-full blur-2xl animate-pulse"></div>
      </div>
      
      <Navbar />
      
      {/* Hero Section with Movie Background */}
      <div className="relative w-full" style={{ minHeight: "400px" }}>
        {/* Blurred, darkened background */}
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: movieData?.imageUrl ? `url(${movieData.imageUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(15px)",
            opacity: 0.8,
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 w-full h-full z-10 bg-black bg-opacity-70" />
        
        {/* Success Content */}
        <div className="relative z-20 flex flex-col items-center justify-center px-8 py-16 w-full" style={{ minHeight: "400px" }}>
          <div className="text-center">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white p-8 rounded-full shadow-2xl mb-6 animate-pulse inline-block">
              <span className="text-6xl">🎉</span>
            </div>
            <h1 className="text-5xl font-extrabold mb-4 text-white tracking-tight drop-shadow-lg">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-white/90 mb-8">Your tickets are ready. Enjoy the show!</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full py-12 px-4 relative z-10">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/30 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-15 blur-2xl"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-15 blur-xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <span className="bg-gradient-to-br from-pink-500 to-red-500 text-white p-2 rounded-xl">
                🎫
              </span>
              Booking Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-4 border border-pink-200/50">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-500 text-white p-3 rounded-xl">
                    <span className="text-xl">🎬</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Movie</p>
                    <p className="text-sm text-gray-600">{movieData?.movieName || movie}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200/50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 text-white p-3 rounded-xl">
                    <span className="text-xl">🏢</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Theatre</p>
                    <p className="text-sm text-gray-600">{theatre}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200/50">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500 text-white p-3 rounded-xl">
                    <span className="text-xl">🕐</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Showtime</p>
                    <p className="text-sm text-gray-600">{time}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 text-white p-3 rounded-xl">
                    <span className="text-xl">💺</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Seats</p>
                    <p className="text-sm text-gray-600">{seats.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total Amount */}
            <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl p-6 border border-emerald-200/50 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 text-white p-3 rounded-xl">
                    <span className="text-xl">💰</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Total Amount</p>
                    <p className="text-xs text-gray-600">Payment completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-700">₹{amount}</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl transform hover:scale-105 hover:from-pink-600 hover:to-red-600"
                onClick={() => navigate("/profile")}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🎫</span>
                  View My Tickets
                  <span>📱</span>
                </span>
              </button>
              
              <button
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl transform hover:scale-105 hover:from-blue-600 hover:to-purple-600"
                onClick={() => navigate("/")}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🏠</span>
                  Back to Home
                  <span>🎬</span>
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Additional Info Section */}
        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/30 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-15 blur-xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-2 rounded-xl">
                  ℹ️
                </span>
                Important Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4 border border-green-200/50">
                    <div className="text-3xl mb-2">🎫</div>
                    <h4 className="font-semibold text-gray-700 mb-1">Digital Ticket</h4>
                    <p className="text-sm text-gray-600">Show this page at the theatre entrance</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-4 border border-blue-200/50">
                    <div className="text-3xl mb-2">⏰</div>
                    <h4 className="font-semibold text-gray-700 mb-1">Arrive Early</h4>
                    <p className="text-sm text-gray-600">Reach 15 minutes before showtime</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-2xl p-4 border border-pink-200/50">
                    <div className="text-3xl mb-2">📞</div>
                    <h4 className="font-semibold text-gray-700 mb-1">Need Help?</h4>
                    <p className="text-sm text-gray-600">Call 1800-123-4567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingSummary; 