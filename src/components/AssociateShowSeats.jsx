// File: src/pages/AssociateShowSeats.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AssociateShowSeats = () => {
  // useParams() is used to get the dynamic showId from the URL
  const { showId } = useParams(); 
  const navigate = useNavigate();

  const [seatPrices, setSeatPrices] = useState({
    priceOfPremiumSeat: "",
    priceOfClassicPlusSeat: "",
    priceOfClassicSeat: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showId) {
      setError("Show ID is missing. Please select a show from the list.");
    }
  }, [showId]);

  const handlePriceChange = (e) => {
    // The parseInt is to ensure the value is a number for the API payload
    setSeatPrices({ ...seatPrices, [e.target.name]: parseInt(e.target.value) || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Simple validation
    if (!seatPrices.priceOfPremiumSeat || !seatPrices.priceOfClassicPlusSeat || !seatPrices.priceOfClassicSeat) {
      setError("Please enter a price for all seat types.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        showId: parseInt(showId),
        ...seatPrices,
      };

      const res = await fetch("http://localhost:8080/shows/associateShowSeats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const resultText = await res.text();
        setMessage(resultText);
        // Navigate back to the show list after a short delay
        setTimeout(() => navigate("/admin/show-list"), 2000);
      } else {
        const errorText = await res.text();
        setError("Error: " + errorText);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col font-inter">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 border-t-8 border-green-500">
          <h2 className="text-3xl font-extrabold mb-4 text-green-600 text-center tracking-tight">
            Set Seat Prices for Show {showId}
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Enter the price for each seat type for this show.
          </p>

          {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center mb-4">{message}</div>}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Premium Seat Price</label>
              <input
                type="number"
                name="priceOfPremiumSeat"
                value={seatPrices.priceOfPremiumSeat}
                onChange={handlePriceChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Classic Plus Seat Price</label>
              <input
                type="number"
                name="priceOfClassicPlusSeat"
                value={seatPrices.priceOfClassicPlusSeat}
                onChange={handlePriceChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Classic Seat Price</label>
              <input
                type="number"
                name="priceOfClassicSeat"
                value={seatPrices.priceOfClassicSeat}
                onChange={handlePriceChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/show-list")}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                disabled={loading}
              >
                {loading ? "Associating..." : "Associate Seats"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssociateShowSeats;