import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const AdminTheaterList = () => {
  const [theaters, setTheaters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", address: "", city: "", numberOfScreens: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/", { replace: true });
    } else {
      fetchTheaters();
    }
    // eslint-disable-next-line
  }, []);

  const fetchTheaters = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/theaters", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch theaters");
      const data = await res.json();
      setTheaters(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!search) {
      setFiltered(theaters);
    } else {
      setFiltered(
        theaters.filter(
          t => t.name.toLowerCase().includes(search.toLowerCase()) || t.city.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, theaters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this theater?")) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/theaters/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete theater");
      setSuccess("Theater deleted successfully.");
      setTheaters(theaters.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (theater) => {
    setEditId(theater.id);
    setEditForm({
      name: theater.name,
      address: theater.address,
      city: theater.city,
      numberOfScreens: theater.numberOfScreens
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/theaters/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          address: editForm.address,
          city: editForm.city,
          numberOfScreens: parseInt(editForm.numberOfScreens, 10)
        })
      });
      if (!res.ok) throw new Error("Failed to update theater");
      setSuccess("Theater updated successfully.");
      setEditId(null);
      fetchTheaters();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 border-t-8 border-red-500 mb-10">
          <h2 className="text-3xl font-extrabold mb-8 text-red-600 text-center tracking-tight">Theater List</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 w-full sm:w-80"
            />
            <button
              onClick={() => navigate("/admin/add-theater")}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-6 rounded-xl shadow hover:from-pink-600 hover:to-red-600 text-lg transition"
            >
              Add Theater
            </button>
          </div>
          {loading ? (
            <div className="text-center py-10 text-xl font-bold text-pink-600 animate-pulse">Loading theaters...</div>
          ) : error ? (
            <div className="text-center py-4 text-lg font-semibold text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pink-200">
                <thead>
                  <tr className="bg-pink-100">
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-700 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-700 uppercase">Address</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-700 uppercase">City</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-pink-700 uppercase">Screens</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-pink-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-6 text-gray-500">No theaters found.</td></tr>
                  ) : filtered.map(theater => (
                    <tr key={theater.id} className="hover:bg-pink-50 transition">
                      {editId === theater.id ? (
                        <>
                          <td className="px-4 py-2"><input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                          <td className="px-4 py-2"><input type="text" name="address" value={editForm.address} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                          <td className="px-4 py-2"><input type="text" name="city" value={editForm.city} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                          <td className="px-4 py-2"><input type="number" name="numberOfScreens" value={editForm.numberOfScreens} onChange={handleEditChange} min="1" className="border px-2 py-1 rounded w-full" /></td>
                          <td className="px-4 py-2 flex gap-2 justify-center">
                            <button onClick={() => handleUpdate(theater.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Save</button>
                            <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2 font-semibold text-gray-800">{theater.name}</td>
                          <td className="px-4 py-2">{theater.address}</td>
                          <td className="px-4 py-2">{theater.city}</td>
                          <td className="px-4 py-2 text-center">{theater.numberOfScreens}</td>
                          <td className="px-4 py-2 flex gap-2 justify-center">
                            <button onClick={() => startEdit(theater)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                            <button onClick={() => handleDelete(theater.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                            <button onClick={() => navigate(`/admin/theaters/${theater.id}/seats`)} className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600">Manage Seats</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {success && <div className="text-center mt-4 text-lg font-semibold text-green-600">{success}</div>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminTheaterList; 