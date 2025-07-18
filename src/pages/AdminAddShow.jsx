import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Assuming Navbar component exists
import Footer from "../components/Footer"; // Assuming Footer component exists
import { useNavigate } from "react-router-dom"; // Assuming react-router-dom is installed

const AdminAddShow = () => {
  // State variables to hold data and form inputs
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [form, setForm] = useState({ movieId: "", theaterId: "", date: "", time: "" });
  const [loading, setLoading] = useState(true); // To indicate data fetching status
  const [submitting, setSubmitting] = useState(false); // To indicate form submission status
  const [message, setMessage] = useState(""); // For success messages
  const [error, setError] = useState(""); // For error messages

  const navigate = useNavigate(); // Hook for navigation

  // useEffect to fetch initial data (movies and theaters) and handle role-based access
  useEffect(() => {
    const role = localStorage.getItem("role");
    // Redirect if the user is not an ADMIN
    if (role !== "ADMIN") {
      navigate("/", { replace: true });
      return;
    }

    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const token = localStorage.getItem("token"); // Get auth token from local storage

        // Fetch movies and theaters in parallel for efficiency
        const [moviesRes, theatersRes] = await Promise.all([
          fetch("http://localhost:8080/movies/all", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8080/theaters", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Parse JSON responses
        const moviesData = await moviesRes.json();
        const theatersData = await theatersRes.json();

        // Update state with fetched data
        setMovies(moviesData);
        setTheaters(theatersData);
      } catch (err) {
        // Set error message if fetching fails
        setError("Failed to fetch movies or theaters. Please try again later.");
        console.error("Fetch error:", err); // Log error for debugging
      } finally {
        setLoading(false); // End loading, regardless of success or failure
      }
    };

    fetchData(); // Call the fetch function
  }, [navigate]); // Dependency array: re-run if navigate changes (though it's stable)

  // Handler for form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setSubmitting(true); // Set submitting state to true
    setMessage(""); // Clear previous messages
    setError(""); // Clear previous errors

    try {
      const token = localStorage.getItem("token"); // Get auth token

      // IMPORTANT FIX: Format the time string to HH:MM:SS for java.sql.Time
      // The HTML input type="time" typically provides HH:MM, but java.sql.Time expects HH:MM:SS
      const formattedTime = form.time ? `${form.time}:00` : "";

      // Construct the payload to be sent to the backend
      const payload = {
        movieId: parseInt(form.movieId, 10), // Convert movie ID to integer
        theaterId: parseInt(form.theaterId, 10), // Convert theater ID to integer
        date: form.date, // Date is already in YYYY-MM-DD format from input type="date"
        time: formattedTime // Use the formatted time
      };

      console.log("Sending payload:", payload); // Log the payload for debugging

      // Send the POST request to add the show
      const res = await fetch("http://localhost:8080/shows/addShow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // Include authorization token
        },
        body: JSON.stringify(payload) // Convert payload to JSON string
      });

      // Handle the response
      if (res.ok) {
        setMessage("Show added successfully!"); // Set success message
        // Reset form fields after successful submission
        setForm({ movieId: "", theaterId: "", date: "", time: "" });
      } else {
        // If response is not OK, parse the error message from the backend
        const errorData = await res.text(); // Get raw text response
        setError("Error: " + errorData); // Display the error
        console.error("Backend error response:", errorData); // Log for debugging
      }
    } catch (err) {
      // Handle network or other unexpected errors
      setError("Network error. Please ensure the backend is running and try again.");
      console.error("Fetch error:", err); // Log error for debugging
    } finally {
      setSubmitting(false); // End submitting state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col font-inter">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 border-t-8 border-red-500 mb-10">
          <h2 className="text-3xl font-extrabold mb-8 text-red-600 text-center tracking-tight">Add Show</h2>
          {loading ? (
            <div className="text-center py-10 text-xl font-bold text-pink-600 animate-pulse">Loading movies and theaters...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Movie Selection */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">Select Movie</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movies.length > 0 ? (
                    movies.map(movie => (
                      <div
                        key={movie.id}
                        className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all duration-200 ease-in-out
                          ${form.movieId === String(movie.id) ? 'border-red-500 bg-pink-50 shadow-md' : 'border-gray-200 bg-white hover:shadow-sm'}`}
                        onClick={() => setForm(f => ({ ...f, movieId: String(movie.id) }))}
                      >
                        <img src={movie.imageUrl} alt={movie.movieName} className="w-12 h-16 object-cover rounded shadow border-2 border-pink-100" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/48x64/E0F2F7/000000?text=No+Image`; }} />
                        <div>
                          <div className="font-semibold text-gray-800">{movie.movieName}</div>
                          <div className="text-xs text-gray-500">{movie.genre} | {movie.language}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500">No movies available. Please add movies first.</p>
                  )}
                </div>
              </div>

              {/* Theater Selection */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 mt-6">Select Theater</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {theaters.length > 0 ? (
                    theaters.map(theater => (
                      <div
                        key={theater.id}
                        className={`border rounded-lg p-3 flex flex-col gap-1 cursor-pointer transition-all duration-200 ease-in-out
                          ${form.theaterId === String(theater.id) ? 'border-red-500 bg-pink-50 shadow-md' : 'border-gray-200 bg-white hover:shadow-sm'}`}
                        onClick={() => setForm(f => ({ ...f, theaterId: String(theater.id) }))}
                      >
                        <div className="font-semibold text-gray-800">{theater.name}</div>
                        <div className="text-xs text-gray-500">{theater.address}, {theater.city}</div>
                        <div className="text-xs text-gray-400">Screens: {theater.numberOfScreens}</div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500">No theaters available. Please add theaters first.</p>
                  )}
                </div>
              </div>

              {/* Date and Time Inputs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-bold mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-bold mb-2">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !form.movieId || !form.theaterId || !form.date || !form.time}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:from-pink-600 hover:to-red-600 text-lg transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {submitting ? "Adding Show..." : "Add Show"}
              </button>

              {/* Messages */}
              {message && <div className="text-center mt-4 text-lg font-semibold text-green-600">{message}</div>}
              {error && <div className="text-center mt-4 text-lg font-semibold text-red-600">{error}</div>}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminAddShow;
