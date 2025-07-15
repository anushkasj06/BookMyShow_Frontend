import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


const initialState = {
  movieName: "",
  duration: "",
  rating: "",
  releaseDate: "",
  genre: "",
  language: "",
  imageUrl: "",
};
const genres = [
  "DRAMA",
  "THRILLER",
  "ACTION",
  "ROMANTIC",
  "COMEDY",
  "HISTORICAL",
  "ANIMATION",
  "SPORTS",
  "SOCIAL",
  "WAR"
];
const languages = [
  "ENGLISH", "HINDI", "MARATHI", "TAMIL", "TELUGU", "KANNADA", "BENGALI", "PUNJABI"
];

const AdminAddMovie = () => {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState({ name: "", role: "" });

  useEffect(() => {
    // Get admin details from localStorage
    const name = localStorage.getItem("username") || "Admin";
    const role = localStorage.getItem("role") || "ADMIN";
    setAdmin({ name, role });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/movies/add`,
        {
          ...form,
          duration: Number(form.duration),
          rating: Number(form.rating),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("Movie added successfully!");
      setForm(initialState);
    } catch (err) {
      setError(err.response?.data || "Failed to add movie");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar/>
      <div className="max-w-6xl mx-auto w-full mt-10 mb-8">
        {/* Admin Info Card */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow p-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-red-500 border-4 border-pink-200">
            {admin.name[0]}
          </div>
          <div>
            <div className="font-bold text-lg">{admin.name}</div>
            <div className="text-sm font-medium uppercase tracking-wider bg-white text-pink-600 px-3 py-1 rounded mt-1 inline-block shadow">{admin.role}</div>
          </div>
        </div>
        {/* Add Movie Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-8 border-red-500">
          <h2 className="text-3xl font-extrabold mb-6 text-red-600 text-center tracking-tight">Add New Movie</h2>
          {message && <div className="text-green-600 mb-2 text-center font-semibold">{message}</div>}
          {error && <div className="text-red-600 mb-2 text-center font-semibold">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Movie Name</label>
              <input type="text" name="movieName" value={form.movieName} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-red-400" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1 text-gray-700">Duration (minutes)</label>
                <input type="number" name="duration" value={form.duration} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-red-400" />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1 text-gray-700">Rating</label>
                <input type="number" step="0.1" name="rating" value={form.rating} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-red-400" />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Release Date</label>
              <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-red-400" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1 text-gray-700">Genre</label>
                <select name="genre" value={form.genre} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-red-400">
                  <option value="">Select Genre</option>
                  {genres.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1 text-gray-700">Language</label>
                <select name="language" value={form.language} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-red-400">
                  <option value="">Select Language</option>
                  {languages.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Image URL</label>
              <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-red-400" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow hover:from-pink-500 hover:to-red-500 transition">Add Movie</button>
          </form>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default AdminAddMovie; 