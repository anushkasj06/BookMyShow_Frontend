import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";


const movie = {
  title: "Sitaare Zameen Par",
  poster: "https://m.media-amazon.com/images/M/MV5BMjA2ODRkMGUtNzUxNC00MmM5LTk3YjQtNTkxNTFlNzFiMjNiXkEyXkFqcGc@._V1_.jpg",
  rating: 8.5,
  votes: "67.1K",
  languages: ["Hindi", "Telugu", "Tamil"],
  genres: ["Comedy", "Drama", "Sports"],
  duration: "2h 39m",
  certificate: "UA13+",
  releaseDate: "20 Jun, 2025",
  description:
    "Sitaare Zameen Par is an entertaining and heartwarming film filled with joy, laughter, and happiness. It follows Gulshan, a smug basketball coach sentenced to community service after a drunk driving incident. Assigned to train a team of Neurodivergent adults, he starts off with prejudice and condescension-only to discover that they’re the ones teaching him how to truly live.",
};



const MovieDetails = () => {
  const { id } = useParams(); // inside your component
  return (
  <div className="bg-gray-100 min-h-screen flex flex-col min-h-screen">
    <Navbar />
    <div className="bg-gray-900 text-white py-10 px-4 flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
      <img
        src={movie.poster}
        alt={movie.title}
        className="rounded-xl w-64 h-96 object-cover shadow-lg border-4 border-white"
      />
      <div className="flex-1 max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg text-lg font-semibold">
            <span className="text-pink-400 mr-2">★</span>
            {movie.rating}/10 <span className="ml-2 text-gray-400">({movie.votes} Votes)</span>
          </div>
          <button className="bg-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-600">Rate now</button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-gray-800 px-2 py-1 rounded text-sm">2D</span>
          {movie.languages.map((lang) => (
            <span key={lang} className="bg-gray-800 px-2 py-1 rounded text-sm">{lang}</span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-300">
          <span>{movie.duration}</span>
          <span>{movie.genres.join(", ")}</span>
          <span>{movie.certificate}</span>
          <span>{movie.releaseDate}</span>
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
      <p className="text-gray-700 text-lg mb-8">{movie.description}</p>
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