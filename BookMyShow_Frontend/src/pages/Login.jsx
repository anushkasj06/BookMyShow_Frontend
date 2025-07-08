import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    alert(`Logged in as ${email}`);
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 to-blue-100 min-h-screen flex flex-col min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] flex-1">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 w-96 flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold mb-2 text-center text-pink-600">Login</h2>
          <div className="mb-2">
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 rounded-lg font-bold text-lg shadow hover:from-pink-600 hover:to-red-600 transition">Login</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login; 