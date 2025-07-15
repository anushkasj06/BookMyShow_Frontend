import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [ageStr, setAgeStr] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [submit, setSubmit] = useState("Sign Up");
  
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateAge = (age) => {
    const ageNum = parseInt(age, 10);
    return !isNaN(ageNum) && ageNum > 0;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(String(email).toLowerCase());
  };
  const validatePhoneNumber = (phone) => {
    const re = /^\d{10}$/; // Simple validation for 10-digit phone numbers
    return re.test(phone);
  };
  const validateForm = () => {
    if (!username || !password || !name || !email || !gender || !ageStr || !phoneNumber) {
      alert("All fields are required");
      return false;
    }
    if (!validateAge(ageStr)) {
      alert("Please enter a valid age");
      return false;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return false;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      alert("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("error").innerText = "";
    if (submit === "Signing Up...") return;
    setSubmit("Signing Up...");
    if (!validateForm()) return;
    if(password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try{
      const response = await axios.post(import.meta.env.VITE_BACKEND_API + "/signup/register", {
        username,
        password,
        name,
        gender,
        age: ageStr,
        phoneNumber,
        email
      });
      document.getElementById("error").innerText = response.data;
      if (response.status === 201) {
        alert("Account created successfully! Redirecting to login...");
        window.location.href = "/login";
      } else {
        document.getElementById("error").innerText = response.data || "Error creating account";
      }
    } catch (error) {
      document.getElementById("error").innerText = "Error creating account";
      return;
    }
    finally {
      setSubmit("Sign Up");
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 to-blue-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] flex-1 mt-10">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold mb-2 text-center text-pink-600">Sign Up</h2>
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
          <div className="mb-2">
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>
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
          <div className="mb-2">
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={ageStr}
              onChange={(e) => setAgeStr(e.target.value.toString())}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>
          <button id="submit" type="submit" className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 rounded-lg font-bold text-lg shadow hover:from-pink-600 hover:to-red-600 transition">{submit}</button>

          {/* Error */}
          <p id="error" className="text-red-500 text-center mt-2"></p>

          <p className="text-center text-gray-600 mt-4">
            Already have an account? <a href="/login" className="text-pink-600 hover:underline">Login</a>
          </p>

        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Signup; 