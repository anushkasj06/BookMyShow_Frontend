import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";

const ADMIN_SIDEBAR_LINKS = [
  { label: "Dashboard", icon: "🏠", path: "/admin/dashboard" },
  { label: "Movies", icon: "🎬", path: "/admin/movies" },
  { label: "Add Movie", icon: "➕", path: "/admin/add-movie" },
  { label: "Theaters", icon: "🏢", path: "/admin/theaters" },
  { label: "Add Theater", icon: "➕", path: "/admin/add-theater" },
  { label: "Shows", icon: "🕒", path: "/admin/shows" },
  { label: "Add Show", icon: "➕", path: "/admin/add-show" },
];

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
  const [admin, setAdmin] = useState({ name: "", role: "" });
  const location = useLocation();
  const navigate = useNavigate();

  // --- NEW: State for Associate Seats Modal ---
  const [showSeatPriceModal, setShowSeatPriceModal] = useState(false);
  const [seatPricesForm, setSeatPricesForm] = useState({
    showId: null,
    priceOfPremiumSeat: "",
    priceOfClassicPlusSeat: "",
    priceOfClassicSeat: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("username") || "Admin";
    setAdmin({ name, role: role || "ADMIN" });
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

  // --- NEW: Handlers for Seat Association ---
  const handleAssociateClick = (showId) => {
    setSeatPricesForm({ ...seatPricesForm, showId });
    setShowSeatPriceModal(true);
    setMessage("");
    setError("");
  };

  const handleSeatPriceChange = (e) => {
    setSeatPricesForm({ ...seatPricesForm, [e.target.name]: parseInt(e.target.value) || "" });
  };

  const handleAssociateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/shows/associateShowSeats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(seatPricesForm),
      });

      if (res.ok) {
        const resultText = await res.text();
        setMessage(resultText);
        setShowSeatPriceModal(false);
        setSeatPricesForm({
          showId: null,
          priceOfPremiumSeat: "",
          priceOfClassicPlusSeat: "",
          priceOfClassicSeat: "",
        });
        fetchAll();
      } else {
        const errorText = await res.text();
        setError("Error: " + errorText);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-blue-200 flex flex-col relative">
      {/* Animated/floating background shapes */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-yellow-100 opacity-20 rounded-full blur-2xl animate-pulse"></div>
      </div>
      <Navbar />
      <div className="flex flex-1 w-full max-w-8xl mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 min-h-full py-10 px-4 bg-white/70 backdrop-blur-md border-r border-gray-200 shadow-2xl rounded-tr-3xl rounded-br-3xl mt-8 mb-8 mr-6">
          <div className="flex flex-col items-center mb-10">
            <span className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white text-2xl font-extrabold border-2 border-pink-200 shadow-lg mb-2">
              {admin.name[0]}
            </span>
            <div className="font-bold text-lg text-gray-800">{admin.name}</div>
            <div className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded mt-1 font-bold uppercase inline-block">{admin.role}</div>
          </div>
          <nav className="flex flex-col gap-2 w-full">
            {ADMIN_SIDEBAR_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-gray-700 hover:bg-pink-100 hover:text-pink-600 ${location.pathname === link.path ? 'bg-pink-500/20 text-pink-600 font-bold shadow' : ''}`}
              >
                <span className="text-lg">{link.icon}</span> {link.label}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 py-12 px-2 md:px-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-pink-600 text-center tracking-tight drop-shadow-lg">Show List</h2>
          <div className="rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl p-10 border-l-8 border-pink-500 mb-10 relative overflow-hidden min-h-[60vh] flex flex-col">
            {/* Decorative shapes */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-200 opacity-20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 opacity-10 rounded-full blur-2xl pointer-events-none"></div>
            {loading ? (
              <div className="text-center py-10 text-xl font-bold text-pink-600 animate-pulse">Loading shows...</div>
            ) : error ? (
              <div className="text-center text-lg text-red-600 font-semibold mb-4">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6 flex-1">
                {shows.length === 0 ? (
                  <div className="col-span-full text-center py-6 text-gray-500">No shows found.</div>
                ) : shows.map(show => {
                  const movie = show.movie || getMovie(show.movie?.id);
                  const theater = show.theatre || getTheater(show.theatre?.id);
                  return (
                    <div key={show.showId} className="relative rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl p-6 flex flex-col items-center group hover:scale-105 transition-all duration-300 border-t-4 border-pink-400 min-h-[260px] w-full">
                      {editId === show.showId ? (
                        <form onSubmit={handleEditSubmit} className="w-full flex flex-col gap-3">
                          <select name="movieId" value={editForm.movieId} onChange={handleEditChange} required className="border px-3 py-2 rounded-xl w-full bg-white/60">
                            <option value="">Select Movie</option>
                            {movies.map(m => <option key={m.id} value={m.id}>{m.movieName}</option>)}
                          </select>
                          <select name="theaterId" value={editForm.theaterId} onChange={handleEditChange} required className="border px-3 py-2 rounded-xl w-full bg-white/60">
                            <option value="">Select Theater</option>
                            {theaters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                          <input type="date" name="date" value={editForm.date} onChange={handleEditChange} required className="border px-3 py-2 rounded-xl w-full bg-white/60" />
                          <input type="time" name="time" value={editForm.time} onChange={handleEditChange} required className="border px-3 py-2 rounded-xl w-full bg-white/60" />
                          <div className="flex gap-2 mt-2 justify-center">
                            <button type="submit" disabled={submitting} className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-green-600">Save</button>
                            <button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-gray-500">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <img src={movie.imageUrl} alt={movie.movieName} className="w-16 h-20 object-cover rounded shadow border-2 border-pink-100 mb-2" onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/48x64/E0F2F7/000000?text=No+Image`; }} />
                          <div className="font-extrabold text-lg text-gray-800 mb-1 text-center truncate w-full">{movie.movieName}</div>
                          <div className="text-sm text-gray-600 mb-1 text-center">{theater.name}</div>
                          <div className="flex flex-wrap gap-2 justify-center mb-2">
                            <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full text-xs font-semibold">{show.date}</span>
                            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-semibold">{show.time ? show.time.slice(0,5) : ""}</span>
                          </div>
                          <div className="flex gap-3 mt-4 w-full justify-center">
                            <button onClick={() => handleEdit(show)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl font-semibold shadow transition-all">Edit</button>
                            <button onClick={() => handleDelete(show.showId)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-all">Delete</button>
                            <button onClick={() => handleAssociateClick(show.showId)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-all" disabled={submitting}>Associate Seats</button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {message && <div className="text-center mt-4 text-lg font-semibold text-green-600">{message}</div>}
            {error && <div className="text-center mt-4 text-lg font-semibold text-red-600">{error}</div>}
          </div>
          {/* --- NEW: Seat Price Association Modal --- */}
          {showSeatPriceModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Set Seat Prices</h3>
                <form onSubmit={handleAssociateSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="priceOfPremiumSeat">
                      Premium Seat Price
                    </label>
                    <input
                      type="number"
                      id="priceOfPremiumSeat"
                      name="priceOfPremiumSeat"
                      value={seatPricesForm.priceOfPremiumSeat}
                      onChange={handleSeatPriceChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="priceOfClassicPlusSeat">
                      Classic Plus Seat Price
                    </label>
                    <input
                      type="number"
                      id="priceOfClassicPlusSeat"
                      name="priceOfClassicPlusSeat"
                      value={seatPricesForm.priceOfClassicPlusSeat}
                      onChange={handleSeatPriceChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="priceOfClassicSeat">
                      Classic Seat Price
                    </label>
                    <input
                      type="number"
                      id="priceOfClassicSeat"
                      name="priceOfClassicSeat"
                      value={seatPricesForm.priceOfClassicSeat}
                      onChange={handleSeatPriceChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowSeatPriceModal(false)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      disabled={submitting}
                    >
                      {submitting ? "Associating..." : "Associate Seats"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminShowList;