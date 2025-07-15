import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [submit, setSubmit] = useState("Login");

  const validateForm = () => {
    if (!username || !password) {
      alert("Username and password are required");
      return false;
    }
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("error").innerText = "";
    if (submit === "Logging In...") return;
    setSubmit("Logging In...");
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/signup/login`,
        null,
        {
          auth: { username, password },
        }
      );
      if (response.status === 200) {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("token", response.data.token);
        const roleresponse = await axios.get(`${import.meta.env.VITE_BACKEND_API}/signup/profile`, {
          headers: {
            'Authorization': `Bearer ${response.data.token}`,
          },
        });
        localStorage.setItem("role", roleresponse.data.roles[0]);
        document.getElementById("error").innerText = "Login successful! Redirecting...";
        // alert(`Logged in as ${username}`);
        window.location.href = "/";
      } else {
        document.getElementById("error").innerText = response.data || "Error logging in";
      }
    } catch (error) {
      document.getElementById("error").innerText = "Error logging in";
    } finally {
      setSubmit("Login");
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 to-blue-100 min-h-screen flex flex-col min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] flex-1">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 w-96 flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold mb-2 text-center text-pink-600">Login</h2>
          <div className="mb-2">
            <label className="block mb-1 font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 rounded-lg font-bold text-lg shadow hover:from-pink-600 hover:to-red-600 transition">{submit}</button>
          {/* Error */}
          <p id="error" className="text-red-500 text-center mt-2"></p>
          <p className="text-center text-gray-600 mt-4">Don't have an account? <a href="/signup" className="text-pink-600 hover:underline">Sign Up</a></p>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login; 