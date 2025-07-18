import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";

const AdminShowSeats = () => {
  const { showId } = useParams();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ price: "", isAvailable: true, isFoodContains: false });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSeats();
    // eslint-disable-next-line
  }, [showId]);

  const fetchSeats = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/seats/show/${showId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch show seats");
      const data = await res.json();
      setSeats(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const startEdit = (seat) => {
    setEditId(seat.id);
    setEditForm({
      price: seat.price,
      isAvailable: seat.isAvailable,
      isFoodContains: seat.isFoodContains
    });
    setMessage("");
    setError("");
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEditSubmit = async (id) => {
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      // Only allow updating price, isAvailable, isFoodContains
      const payload = {
        price: parseInt(editForm.price, 10),
        isAvailable: editForm.isAvailable,
        isFoodContains: editForm.isFoodContains
      };
      const res = await fetch(`http://localhost:8080/seats/id/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setMessage("Seat updated successfully!");
        setEditId(null);
        fetchSeats();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col font-inter">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 border-t-8 border-purple-500 mb-10">
          <h2 className="text-3xl font-extrabold mb-8 text-purple-600 text-center tracking-tight">Manage Show Seats</h2>
          {loading ? (
            <div className="text-center py-10 text-xl font-bold text-purple-600 animate-pulse">Loading show seats...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-600 font-semibold mb-4">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-200">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Seat No</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Price</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">Available</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">Food Contains</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seats.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-6 text-gray-500">No seats found.</td></tr>
                  ) : seats.map(seat => (
                    <tr key={seat.id} className="hover:bg-purple-50 transition">
                      <td className="px-4 py-2 font-semibold text-gray-800">{seat.seatNo}</td>
                      <td className="px-4 py-2">{seat.seatType}</td>
                      {editId === seat.id ? (
                        <>
                          <td className="px-4 py-2"><input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="border px-2 py-1 rounded w-24" min="0" /></td>
                          <td className="px-4 py-2 text-center"><input type="checkbox" name="isAvailable" checked={editForm.isAvailable} onChange={handleEditChange} /></td>
                          <td className="px-4 py-2 text-center"><input type="checkbox" name="isFoodContains" checked={editForm.isFoodContains} onChange={handleEditChange} /></td>
                          <td className="px-4 py-2 flex gap-2 justify-center">
                            <button onClick={() => handleEditSubmit(seat.id)} disabled={submitting} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Save</button>
                            <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2">{seat.price}</td>
                          <td className="px-4 py-2 text-center">{seat.isAvailable ? "Yes" : "No"}</td>
                          <td className="px-4 py-2 text-center">{seat.isFoodContains ? "Yes" : "No"}</td>
                          <td className="px-4 py-2 flex gap-2 justify-center">
                            <button onClick={() => startEdit(seat)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
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

export default AdminShowSeats; 