import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("username") || "Admin";
    const role = localStorage.getItem("role") || "ADMIN";
    setAdmin({ name, role });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 border-t-8 border-red-500 mb-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white text-4xl font-bold border-4 border-pink-200">
              {admin.name[0]}
            </div>
            <div>
              <div className="font-bold text-2xl text-gray-800">{admin.name}</div>
              <div className="text-sm font-medium uppercase tracking-wider bg-pink-100 text-pink-600 px-4 py-1 rounded mt-2 inline-block shadow">{admin.role}</div>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-8 text-red-600 text-center tracking-tight">Admin Dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <button onClick={() => navigate("/admin/add-movie")}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-6 rounded-xl shadow hover:from-pink-600 hover:to-red-600 text-xl transition">
              Add Movie
            </button>
            <button onClick={() => navigate("/admin/movies")}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-6 rounded-xl shadow hover:from-pink-600 hover:to-red-600 text-xl transition">
              See Movie List
            </button>
            <button onClick={() => navigate("/admin/add-theater")}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-6 rounded-xl shadow hover:from-pink-600 hover:to-red-600 text-xl transition">
              Add Theater
            </button>
            <button onClick={() => navigate("/admin/theaters")}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-6 rounded-xl shadow hover:from-pink-600 hover:to-red-600 text-xl transition">
              See Theater List
            </button>
            <button onClick={() => navigate("/admin/add-show")}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-6 rounded-xl shadow hover:from-pink-600 hover:to-red-600 text-xl transition">
              Add Show
            </button>
            <button onClick={() => navigate("/admin/shows")}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-6 rounded-xl shadow hover:from-pink-600 hover:to-red-600 text-xl transition">
              Show List
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard; 