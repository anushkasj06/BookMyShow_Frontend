import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdminAddTheater = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    numberOfScreens: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    // Step 1: Retrieve the token from localStorage
    const token = localStorage.getItem("token"); 
  
    // Step 2: Check if the token exists
    if (!token) {
      setMessage("Authentication token not found. Please log in again.");
      setLoading(false);
      navigate("/login", { replace: true }); // Redirect to login page
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/theaters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Step 3: Add the Authorization header with the JWT
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          city: form.city,
          numberOfScreens: parseInt(form.numberOfScreens, 10)
        })
      });
      
      // ... (rest of the try/catch block)
      if (response.ok) {
        setMessage("Theater added successfully!");
        setForm({ name: "", address: "", city: "", numberOfScreens: "" });
      } else {
        const data = await response.text();
        setMessage("Error: " + data);
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 border-t-8 border-red-500 mb-10">
          <h2 className="text-3xl font-extrabold mb-8 text-red-600 text-center tracking-tight">Add Theater</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Number of Screens</label>
              <input type="number" name="numberOfScreens" value={form.numberOfScreens} onChange={handleChange} required min="1" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow hover:from-pink-600 hover:to-red-600 text-lg transition disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Adding..." : "Add Theater"}
            </button>
            {message && <div className="text-center mt-4 text-lg font-semibold text-pink-600">{message}</div>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminAddTheater; 