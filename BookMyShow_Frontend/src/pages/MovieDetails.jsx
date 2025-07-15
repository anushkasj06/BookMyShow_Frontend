import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

// Helper function to format duration from minutes to "Xh Ym"
const formatDuration = (minutes) => {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  let durationString = "";
  if (hours > 0) {
    durationString += `${hours}h `;
  }
  if (mins > 0) {
    durationString += `${mins}m`;
  }
  return durationString.trim();
};

// Helper function to format date from "YYYY-MM-DD" to "DD Mon, YYYY"
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        // Assuming the endpoint for a single movie is /movies/{id}
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/movies/id/${id}`);
        setMovie(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch movie details. Please try again later.");
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xl">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xl text-red-500">{error}</div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xl">Movie not found.</div>
        <Footer />
      </div>
    );
  }

  return (
  <div className="bg-gray-100 min-h-screen flex flex-col min-h-screen">
    <Navbar />
    <div className="bg-gray-900 text-white py-10 px-4 flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
      <img
        src={movie.imageUrl}
        alt={movie.movieName}
        className="rounded-xl w-64 h-96 object-cover shadow-lg border-4 border-white"
      />
      <div className="flex-1 max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">{movie.movieName}</h1>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg text-lg font-semibold">
            <span className="text-pink-400 mr-2">★</span>
            {movie.rating}/10
          </div>
          <button className="bg-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-600">Rate now</button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-gray-800 px-2 py-1 rounded text-sm">2D</span>
          <span className="bg-gray-800 px-2 py-1 rounded text-sm">{movie.language}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-300">
          <span>{formatDuration(movie.duration)}</span>
          <span>{movie.genre}</span>
          <span>{formatDate(movie.releaseDate)}</span>
        </div>
        <Link
          to={`/movie/${id}/book`}
          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-bold text-lg mt-2 inline-block text-center"
        >
          Book tickets
        </Link>
      </div>
    </div>
    <div className="bg-white max-w-4xl mx-auto p-8 rounded-lg shadow mt-8 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">About the movie</h2>
      <p className="text-gray-700 text-lg mb-8">{movie.description || "Description not available."}</p>
    </div>
    {/* Review Section Start */}
    <div className="bg-white max-w-4xl mx-auto p-8 rounded-lg shadow mb-8">
      <h3 className="text-xl font-bold mb-6 text-pink-600 flex items-center gap-2">
        <span className="text-2xl">💬</span> Reviews
      </h3>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl p-6 shadow flex gap-4 border border-pink-100">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white text-xl font-bold">A</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-800">Amit Sharma</span>
              <span className="text-xs text-gray-400">2024-06-01</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < 5 ? "text-yellow-400" : "text-gray-300"}>★</span>
              ))}
            </div>
            <div className="text-gray-700 text-sm">Absolutely loved the movie! Heartwarming story and brilliant performances. A must-watch for everyone!</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl p-6 shadow flex gap-4 border border-pink-100">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white text-xl font-bold">P</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-800">Priya Desai</span>
              <span className="text-xs text-gray-400">2024-06-02</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"}>★</span>
              ))}
            </div>
            <div className="text-gray-700 text-sm">Great direction and screenplay. The message is powerful and the cast did a fantastic job.</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl p-6 shadow flex gap-4 border border-pink-100">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white text-xl font-bold">R</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-800">Rahul Verma</span>
              <span className="text-xs text-gray-400">2024-06-03</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < 5 ? "text-yellow-400" : "text-gray-300"}>★</span>
              ))}
            </div>
            <div className="text-gray-700 text-sm">One of the best movies I've seen this year. Emotional, funny, and inspiring!</div>
          </div>
        </div>
      </div>
    </div>
    {/* Review Section End */}
    <Footer />
  </div>
  );
};

export default MovieDetails;