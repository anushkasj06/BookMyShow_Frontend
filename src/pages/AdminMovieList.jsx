import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const genres = [
  "DRAMA", "THRILLER", "ACTION", "ROMANTIC", "COMEDY", "HISTORICAL", "ANIMATION", "SPORTS", "SOCIAL", "WAR"
];
const languages = [
  "ENGLISH", "HINDI", "MARATHI", "TAMIL", "TELUGU", "KANNADA", "BENGALI", "PUNJABI"
];

const AdminMovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [editMovie, setEditMovie] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [updateMsg, setUpdateMsg] = useState("");
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/movies/all`);
        setMovies(res.data);
      } catch (err) {
        setError("Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    setDeleteMsg("");
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_API}/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
      setDeleteMsg("Movie deleted successfully.");
    } catch (err) {
      setDeleteMsg("Failed to delete movie.");
    }
  };

  const openEditModal = (movie) => {
    setEditMovie(movie);
    setEditForm({
      movieName: movie.movieName,
      duration: movie.duration,
      rating: movie.rating,
      releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : "",
      genre: movie.genre,
      language: movie.language,
      imageUrl: movie.imageUrl,
    });
    setUpdateMsg("");
  };

  const closeEditModal = () => {
    setEditMovie(null);
    setEditForm(null);
    setUpdateMsg("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMsg("");
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/movies/${editMovie.id}`,
        {
          ...editForm,
          duration: Number(editForm.duration),
          rating: Number(editForm.rating),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMovies((prev) =>
        prev.map((m) => (m.id === editMovie.id ? { ...m, ...editForm } : m))
      );
      setUpdateMsg("Movie updated successfully.");
      setTimeout(() => closeEditModal(), 1200);
    } catch (err) {
      setUpdateMsg("Failed to update movie.");
    } finally {
      setUpdating(false);
    }
  };

  // Filter movies by search
  const filteredMovies = movies.filter((movie) =>
    movie.movieName.toLowerCase().includes(search.toLowerCase())
  );

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow p-10 text-center border-t-8 border-red-500">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Unauthorized</h2>
            <p className="text-gray-700">You do not have permission to view this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-blue-50">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full py-10 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border-l-8 border-red-500 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <h2 className="text-3xl font-extrabold text-red-600 tracking-tight">All Movies</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-end items-end">
              <input
                type="text"
                placeholder="Search by movie name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm transition"
              />
              <button
                onClick={() => window.location.href = '/admin/add-movie'}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-6 rounded-xl shadow hover:from-pink-600 hover:to-red-600 text-lg transition"
              >
                Add Movie
              </button>
            </div>
          </div>
          {deleteMsg && <div className={`mb-4 text-center font-semibold ${deleteMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>{deleteMsg}</div>}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-red-100 to-pink-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-red-600 uppercase tracking-wider">Poster</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-red-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-red-600 uppercase tracking-wider">Genre</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-red-600 uppercase tracking-wider">Language</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-red-600 uppercase tracking-wider">Release</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-red-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredMovies.map((movie) => (
                    <tr key={movie.id} className="hover:bg-pink-50 transition">
                      <td className="px-4 py-3">
                        <img src={movie.imageUrl} alt={movie.movieName} className="w-16 h-24 object-cover rounded shadow-md border-2 border-pink-100" />
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{movie.movieName}</td>
                      <td className="px-4 py-3 text-gray-700">{movie.genre}</td>
                      <td className="px-4 py-3 text-gray-700">{movie.language}</td>
                      <td className="px-4 py-3 text-gray-700">{movie.releaseDate}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => openEditModal(movie)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold shadow transition">Update</button>
                        <button onClick={() => handleDelete(movie.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Edit Movie Modal */}
        {editMovie && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative border-t-8 border-yellow-400">
              <button onClick={closeEditModal} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
              <h3 className="text-2xl font-bold mb-4 text-yellow-500 text-center">Update Movie</h3>
              {updateMsg && <div className={`mb-2 text-center font-semibold ${updateMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>{updateMsg}</div>}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Movie Name</label>
                  <input type="text" name="movieName" value={editForm.movieName} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-semibold mb-1 text-gray-700">Duration (minutes)</label>
                    <input type="number" name="duration" value={editForm.duration} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold mb-1 text-gray-700">Rating</label>
                    <input type="number" step="0.1" name="rating" value={editForm.rating} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-yellow-400" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Release Date</label>
                  <input type="date" name="releaseDate" value={editForm.releaseDate} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-semibold mb-1 text-gray-700">Genre</label>
                    <select name="genre" value={editForm.genre} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-yellow-400">
                      <option value="">Select Genre</option>
                      {genres.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold mb-1 text-gray-700">Language</label>
                    <select name="language" value={editForm.language} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-yellow-400">
                      <option value="">Select Language</option>
                      {languages.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Image URL</label>
                  <input type="text" name="imageUrl" value={editForm.imageUrl} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-yellow-400" />
                </div>
                <button type="submit" disabled={updating} className="w-full bg-yellow-400 text-white font-bold py-3 rounded-xl shadow hover:bg-yellow-500 transition disabled:opacity-60">{updating ? "Updating..." : "Update Movie"}</button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminMovieList; 