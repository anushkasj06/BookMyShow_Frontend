import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const AdminShowList = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ movieId: "", theaterId: "", date: "", time: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/", { replace: true });
      return;
    }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const [showsRes, moviesRes, theatersRes] = await Promise.all([
        fetch("http://localhost:8080/shows/getAllShows", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:8080/movies/all", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:8080/theaters", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const showsData = await showsRes.json();
      const moviesData = await moviesRes.json();
      const theatersData = await theatersRes.json();
      setShows(showsData);
      setMovies(moviesData);
      setTheaters(theatersData);
    } catch (err) {
      setError("Failed to fetch shows, movies, or theaters.");
    } finally {
      setLoading(false);
    }
  };

  const getMovie = (id) => movies.find(m => m.id === id) || {};
  const getTheater = (id) => theaters.find(t => t.id === id) || {};

  const handleEdit = (show) => {
    setEditId(show.showId);
    setEditForm({
      movieId: show.movie?.id ? String(show.movie.id) : "",
      theaterId: show.theatre?.id ? String(show.theatre.id) : "",
      date: show.date ? show.date : "",
      time: show.time ? show.time.slice(0,5) : ""
    });
    setMessage("");
    setError("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const formattedTime = editForm.time ? `${editForm.time}:00` : "";
      const payload = {
        movieId: parseInt(editForm.movieId, 10),
        theaterId: parseInt(editForm.theaterId, 10),
        date: editForm.date,
        time: formattedTime
      };
      const res = await fetch(`http://localhost:8080/shows/updateShow/${editId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setMessage("Show updated successfully!");
        setEditId(null);
        fetchAll();
      } else {
        const errorData = await res.text();
        setError("Error: " + errorData);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (showId) => {
    if (!window.confirm("Are you sure you want to delete this show?")) return;
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/shows/deleteShow/${showId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessage("Show deleted successfully!");
        fetchAll();
      } else {
        const errorData = await res.text();
        setError("Error: " + errorData);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter shows based on search
  const filteredShows = shows.filter(show => {
    const movie = show.movie || getMovie(show.movie?.id);
    const theater = show.theatre || getTheater(show.theatre?.id);
    const searchLower = search.toLowerCase();
    return (
      (movie.movieName && movie.movieName.toLowerCase().includes(searchLower)) ||
      (theater.name && theater.name.toLowerCase().includes(searchLower)) ||
      (show.date && show.date.includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col font-inter">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 border-t-8 border-red-500 mb-10">
          <h2 className="text-3xl font-extrabold mb-8 text-red-600 text-center tracking-tight">Show List</h2>
          <div className="mb-6 flex justify-end">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by movie, theater, or date..."
              className="w-full sm:w-96 px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          {loading ? (
            <div className="text-center py-10 text-xl font-bold text-pink-600 animate-pulse">Loading shows...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-600 font-semibold mb-4">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pink-200">
                <thead>
                  <tr className="bg-pink-100">
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-700 uppercase">Movie</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-700 uppercase">Theater</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-700 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-700 uppercase">Time</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-pink-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShows.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-6 text-gray-500">No shows found.</td></tr>
                  ) : filteredShows.map(show => {
                    const movie = show.movie || getMovie(show.movie?.id);
                    const theater = show.theatre || getTheater(show.theatre?.id);
                    return (
                      <tr key={show.showId} className="hover:bg-pink-50 transition">
                        <td className="px-4 py-2 flex items-center gap-3">
                          <img src={movie.imageUrl} alt={movie.movieName} className="w-12 h-16 object-cover rounded shadow border-2 border-pink-100" onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/48x64/E0F2F7/000000?text=No+Image`; }} />
                          <div>
                            <div className="font-semibold text-gray-800">{movie.movieName}</div>
                            <div className="text-xs text-gray-500">{movie.genre} | {movie.language}</div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-semibold text-gray-800">{theater.name}</div>
                          <div className="text-xs text-gray-500">{theater.address}, {theater.city}</div>
                        </td>
                        <td className="px-4 py-2">{show.date}</td>
                        <td className="px-4 py-2">{show.time ? show.time.slice(0,5) : ""}</td>
                        <td className="px-4 py-2 flex gap-2 justify-center">
                          {editId === show.showId ? (
                            <form onSubmit={handleEditSubmit} className="flex flex-col gap-2 w-64">
                              <select name="movieId" value={editForm.movieId} onChange={handleEditChange} required className="border px-2 py-1 rounded">
                                <option value="">Select Movie</option>
                                {movies.map(m => <option key={m.id} value={m.id}>{m.movieName}</option>)}
                              </select>
                              <select name="theaterId" value={editForm.theaterId} onChange={handleEditChange} required className="border px-2 py-1 rounded">
                                <option value="">Select Theater</option>
                                {theaters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                              </select>
                              <input type="date" name="date" value={editForm.date} onChange={handleEditChange} required className="border px-2 py-1 rounded" />
                              <input type="time" name="time" value={editForm.time} onChange={handleEditChange} required className="border px-2 py-1 rounded" />
                              <div className="flex gap-2 mt-2">
                                <button type="submit" disabled={submitting} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Save</button>
                                <button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(show)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                              <button onClick={() => handleDelete(show.showId)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                              <button onClick={() => navigate(`/admin/shows/${show.showId}/seats`)} className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600">Manage Seats</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {message && <div className="text-center mt-4 text-lg font-semibold text-green-600">{message}</div>}
              {error && <div className="text-center mt-4 text-lg font-semibold text-red-600">{error}</div>}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminShowList; 