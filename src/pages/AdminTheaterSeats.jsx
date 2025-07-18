import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const seatTypes = ["CLASSIC", "PREMIUM"];

const AdminTheaterSeats = () => {
  const { theaterId } = useParams();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addForm, setAddForm] = useState({ seatNo: "", seatType: "CLASSIC" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ seatNo: "", seatType: "CLASSIC" });
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkRows, setBulkRows] = useState("");
  const [bulkSeatsPerRow, setBulkSeatsPerRow] = useState("");
  const [bulkSeatType, setBulkSeatType] = useState("CLASSIC");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/", { replace: true });
    } else {
      fetchSeats();
    }
    // eslint-disable-next-line
  }, [theaterId]);

  const fetchSeats = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/theater-seats/theater/${theaterId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch seats");
      const data = await res.json();
      setSeats(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSeat = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/theater-seats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          seatNo: addForm.seatNo,
          seatType: addForm.seatType,
          theaterId: parseInt(theaterId, 10)
        })
      });
      if (!res.ok) throw new Error("Failed to add seat");
      setSuccess("Seat added successfully.");
      setAddForm({ seatNo: "", seatType: "CLASSIC" });
      fetchSeats();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (seat) => {
    setEditId(seat.id);
    setEditForm({ seatNo: seat.seatNo, seatType: seat.seatType });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSeat = async (id) => {
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/theater-seats/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          seatNo: editForm.seatNo,
          seatType: editForm.seatType,
          theaterId: parseInt(theaterId, 10)
        })
      });
      if (!res.ok) throw new Error("Failed to update seat");
      setSuccess("Seat updated successfully.");
      setEditId(null);
      fetchSeats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSeat = async (id) => {
    if (!window.confirm("Are you sure you want to delete this seat?")) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/theater-seats/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete seat");
      setSuccess("Seat deleted successfully.");
      fetchSeats();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 border-t-8 border-purple-500 mb-10">
          <h2 className="text-3xl font-extrabold mb-8 text-purple-600 text-center tracking-tight">Manage Seats</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-end">
            <form onSubmit={handleAddSeat} className="flex flex-1 flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-gray-700 font-bold mb-2">Seat Number</label>
                <input type="text" name="seatNo" value={addForm.seatNo} onChange={handleAddChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 font-bold mb-2">Seat Type</label>
                <select name="seatType" value={addForm.seatType} onChange={handleAddChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                  {seatTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl shadow hover:from-pink-600 hover:to-purple-600 text-lg transition">Add Seat</button>
            </form>
            <button
              type="button"
              onClick={() => setShowBulkModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow hover:from-purple-600 hover:to-pink-600 text-lg transition"
            >
              Bulk Add Seats
            </button>
          </div>
          {error && <div className="text-center mb-4 text-lg font-semibold text-red-600">{error}</div>}
          {success && <div className="text-center mb-4 text-lg font-semibold text-green-600">{success}</div>}
          {loading ? (
            <div className="text-center py-10 text-xl font-bold text-purple-600 animate-pulse">Loading seats...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-200">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Seat No</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Type</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seats.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-6 text-gray-500">No seats found.</td></tr>
                  ) : seats.map(seat => (
                    <tr key={seat.id} className="hover:bg-purple-50 transition">
                      {editId === seat.id ? (
                        <>
                          <td className="px-4 py-2"><input type="text" name="seatNo" value={editForm.seatNo} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                          <td className="px-4 py-2">
                            <select name="seatType" value={editForm.seatType} onChange={handleEditChange} className="border px-2 py-1 rounded w-full">
                              {seatTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2 flex gap-2 justify-center">
                            <button onClick={() => handleUpdateSeat(seat.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Save</button>
                            <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2 font-semibold text-gray-800">{seat.seatNo}</td>
                          <td className="px-4 py-2">{seat.seatType}</td>
                          <td className="px-4 py-2 flex gap-2 justify-center">
                            <button onClick={() => startEdit(seat)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                            <button onClick={() => handleDeleteSeat(seat.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative border-t-8 border-pink-500">
            <button onClick={() => { setShowBulkModal(false); setBulkResult(""); }} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-pink-500 text-center">Bulk Add Seats</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setBulkLoading(true);
              setBulkResult("");
              // Parse rows (A-D or A,B,C)
              let rows = [];
              const input = bulkRows.trim().toUpperCase();
              if (input.includes("-")) {
                // Range, e.g., A-D
                const [start, end] = input.split("-");
                if (start && end && start.length === 1 && end.length === 1) {
                  for (let c = start.charCodeAt(0); c <= end.charCodeAt(0); c++) {
                    rows.push(String.fromCharCode(c));
                  }
                }
              } else {
                // Comma-separated
                rows = input.split(",").map(r => r.trim()).filter(Boolean);
              }
              const seatsPerRow = parseInt(bulkSeatsPerRow, 10);
              if (!rows.length || !seatsPerRow || seatsPerRow < 1) {
                setBulkResult("Invalid input. Please check rows and seats per row.");
                setBulkLoading(false);
                return;
              }
              // Generate seat numbers
              const seatNumbers = [];
              rows.forEach(row => {
                for (let i = 1; i <= seatsPerRow; i++) {
                  seatNumbers.push(`${row}${i}`);
                }
              });
              // Send POST requests for each seat
              const token = localStorage.getItem("token");
              let successCount = 0, failCount = 0;
              for (let seatNo of seatNumbers) {
                try {
                  const res = await fetch("http://localhost:8080/theater-seats", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      seatNo,
                      seatType: bulkSeatType,
                      theaterId: parseInt(theaterId, 10)
                    })
                  });
                  if (res.ok) successCount++;
                  else failCount++;
                } catch {
                  failCount++;
                }
              }
              setBulkResult(`Added ${successCount} seats. ${failCount ? failCount + ' failed.' : ''}`);
              setBulkLoading(false);
              fetchSeats();
            }} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Rows (A-D or A,B,C)</label>
                <input type="text" value={bulkRows} onChange={e => setBulkRows(e.target.value)} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-pink-400" placeholder="A-D or A,B,C" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Seats per Row</label>
                <input type="number" value={bulkSeatsPerRow} onChange={e => setBulkSeatsPerRow(e.target.value)} required min="1" className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-pink-400" placeholder="10" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Seat Type</label>
                <select value={bulkSeatType} onChange={e => setBulkSeatType(e.target.value)} required className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-pink-400">
                  {seatTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <button type="submit" disabled={bulkLoading} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-xl shadow hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-60">{bulkLoading ? "Adding..." : "Add Seats"}</button>
              {bulkResult && <div className="text-center mt-2 text-lg font-semibold text-pink-600">{bulkResult}</div>}
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AdminTheaterSeats; 