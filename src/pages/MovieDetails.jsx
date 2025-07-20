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
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      {/* Movie Banner with Blurred Background */}
      <div className="relative w-full" style={{ minHeight: "480px" }}>
        {/* Blurred, darkened background */}
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: movie?.imageUrl ? `url(${movie.imageUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(12px)",
            opacity: 0.7,
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 w-full h-full z-10 bg-black bg-opacity-60" />
        {/* Main content row */}
        <div className="relative z-20 flex flex-row items-start justify-center gap-16 px-16 py-12 w-full" style={{ minHeight: "480px" }}>
          {/* Movie Poster */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white" style={{ minWidth: 320, minHeight: 480 }}>
            <img
              src={movie.imageUrl}
              alt={movie.movieName}
              className="w-80 h-[32rem] object-cover"
            />
          </div>
          {/* Movie Details */}
          <div className="flex flex-col justify-center max-w-2xl">
            <h1 className="text-5xl font-extrabold mb-6 text-white tracking-tight drop-shadow-lg">{movie.movieName}</h1>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center bg-pink-500/90 px-6 py-3 rounded-lg text-2xl font-bold text-white shadow">
                <span className="text-white mr-3">★</span>
                {movie.rating}/10
              </div>
              <button className="bg-white px-6 py-3 rounded-lg font-bold text-pink-600 shadow-lg hover:bg-pink-100 transition">Rate now</button>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-white/80 px-4 py-2 rounded text-base text-pink-600 font-semibold shadow">2D</span>
              <span className="bg-white/80 px-4 py-2 rounded text-base text-pink-600 font-semibold shadow">{movie.language}</span>
            </div>
            <div className="flex flex-wrap items-center gap-8 mb-8 text-white font-medium text-lg">
              <span>{formatDuration(movie.duration)}</span>
              <span>{movie.genre}</span>
              <span>{formatDate(movie.releaseDate)}</span>
            </div>
            <Link
              to={`/movie/${id}/book`}
              className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-4 rounded-xl font-extrabold text-2xl mt-2 inline-block text-center shadow-xl transition-all duration-200 hover:scale-105 border-2 border-white"
            >
              Book tickets
            </Link>
          </div>
        </div>
      </div>
      {/* About Section */}
      <div className="w-full px-16 py-12 bg-white flex flex-col items-center border-b-2 border-pink-100">
        <div className="w-full max-w-5xl">
          <h2 className="text-3xl font-extrabold mb-6 text-red-600 border-b pb-2 border-pink-200">About the Movie</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            <span className="font-semibold text-pink-600">{movie.movieName}</span> is a captivating {movie.genre.toLowerCase()} film delivered in {movie.language}. With a compelling storyline, powerful performances, and stunning visuals, it keeps audiences hooked from start to finish. Whether you're a fan of intense drama, thrilling suspense, or heartfelt emotion—this film delivers an unforgettable experience.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The film spans {formatDuration(movie.duration)} of entertainment, skillfully balancing pace and emotion. Its direction and cinematography have been praised by critics, and audiences have rated it <span className="text-pink-500 font-bold">{movie.rating}/10</span>.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Released on <span className="font-medium text-red-600">{formatDate(movie.releaseDate)}</span>, the movie continues to draw crowds and receive positive reviews. Book your tickets now to enjoy it on the big screen!
          </p>
        </div>
      </div>
      {/* Review Section Start */}
      <div className="w-full px-16 py-12 bg-pink-50 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <h3 className="text-2xl font-extrabold mb-8 text-red-600 flex items-center gap-2">
            <span className="text-3xl">💬</span> Reviews
          </h3>
          <div className="space-y-8">
            {/* Review Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl flex gap-8 border-2 border-pink-200 items-center hover:scale-[1.01] transition-transform duration-200">
              <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">A</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-red-700">Amit Sharma</span>
                  <span className="text-xs text-gray-400">2024-06-01</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < 5 ? "text-pink-400" : "text-gray-300"}>★</span>
                  ))}
                </div>
                <div className="text-gray-700 text-base font-medium">Absolutely loved the movie! Heartwarming story and brilliant performances. A must-watch for everyone!</div>
              </div>
            </div>
            {/* Review Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl flex gap-8 border-2 border-pink-200 items-center hover:scale-[1.01] transition-transform duration-200">
              <div className="w-16 h-16 rounded-full bg-red-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">P</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-red-700">Priya Desai</span>
                  <span className="text-xs text-gray-400">2024-06-02</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < 4 ? "text-pink-400" : "text-gray-300"}>★</span>
                  ))}
                </div>
                <div className="text-gray-700 text-base font-medium">Great direction and screenplay. The message is powerful and the cast did a fantastic job.</div>
              </div>
            </div>
            {/* Review Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl flex gap-8 border-2 border-pink-200 items-center hover:scale-[1.01] transition-transform duration-200">
              <div className="w-16 h-16 rounded-full bg-pink-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">R</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-red-700">Rahul Verma</span>
                  <span className="text-xs text-gray-400">2024-06-03</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < 5 ? "text-pink-400" : "text-gray-300"}>★</span>
                  ))}
                </div>
                <div className="text-gray-700 text-base font-medium">One of the best movies I've seen this year. Emotional, funny, and inspiring!</div>
              </div>
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