import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const BookingSummary = () => {
  const query = useQuery();
  const movie = query.get("movie") || "Sitaare Zameen Par";
  const theatre = query.get("theatre") || "Cinepolis: Seasons Mall, Pune";
  const time = query.get("time") || "08:00 PM";
  const seats = query.get("seats") ? query.get("seats").split(",") : [];
  const amount = query.get("amount") || "0";
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto w-full bg-white rounded-lg shadow mt-12 p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Booking Successful!</h2>
        <div className="w-full mb-6">
          <div className="mb-2 flex justify-between">
            <span className="font-semibold">Movie:</span>
            <span>{movie}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="font-semibold">Theatre:</span>
            <span>{theatre}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="font-semibold">Showtime:</span>
            <span>{time}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="font-semibold">Seats:</span>
            <span>{seats.join(", ")}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="font-semibold">Total Paid:</span>
            <span className="text-green-700 font-bold">₹{amount}</span>
          </div>
        </div>
        <div className="bg-green-100 border border-green-400 rounded-lg px-6 py-4 mb-6 w-full text-center">
          <div className="text-lg font-semibold text-green-700 mb-2">Enjoy your show!</div>
          <div className="text-sm text-green-600">Show this page at the theatre entrance as your ticket.</div>
        </div>
        <button
          className="bg-pink-500 text-white px-8 py-2 rounded-lg font-bold text-lg hover:bg-pink-600 transition"
          onClick={() => navigate("/profile")}
        >
          Show your Booked Tickets
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default BookingSummary; 