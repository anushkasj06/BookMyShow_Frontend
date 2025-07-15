import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const cinemas = [
  {
    name: "INOX Megaplex: Phoenix Mall of the Millennium",
    showtimes: ["07:15 PM", "08:15 PM", "09:30 PM", "10:30 PM", "11:30 PM"],
    info: "Cancellation available",
  },
  {
    name: "City Pride: Kothrud",
    showtimes: ["06:45 PM", "10:15 PM"],
    info: "Cancellation available",
  },
  {
    name: "Cinepolis: Seasons Mall, Pune",
    showtimes: ["06:45 PM", "08:00 PM", "10:00 PM"],
    info: "Non-cancellable",
  },
  {
    name: "PVR: Phoenix Market City, Pune",
    showtimes: ["06:45 PM", "08:00 PM", "10:00 PM", "11:15 PM"],
    info: "Cancellation available",
  },
];

const dates = [
  { day: "MON", date: "07", month: "JUL" },
  { day: "TUE", date: "08", month: "JUL" },
  { day: "WED", date: "09", month: "JUL" },
  { day: "THU", date: "10", month: "JUL" },
  { day: "FRI", date: "11", month: "JUL" },
  { day: "SAT", date: "12", month: "JUL" },
  { day: "SUN", date: "13", month: "JUL" },
];

const SelectSeatsModal = ({ isOpen, onClose, onSelect, theatre, time }) => {
  const [count, setCount] = useState(1);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative">
        <button
          className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4 text-center">Select Number of Seats</h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            className="text-2xl px-3 py-1 border rounded"
            onClick={() => setCount((c) => Math.max(1, c - 1))}
          >
            -
          </button>
          <span className="text-xl font-semibold">{count}</span>
          <button
            className="text-2xl px-3 py-1 border rounded"
            onClick={() => setCount((c) => Math.min(10, c + 1))}
          >
            +
          </button>
        </div>
        <button
          className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition"
          onClick={() => onSelect(count)}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const BookTickets = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState({ open: false, theatre: null, time: null });

  const handleShowtimeClick = (theatre, time) => {
    setModal({ open: true, theatre, time });
  };

  const handleSelectSeats = (count) => {
    setModal({ open: false, theatre: null, time: null });
    navigate(`/movie/${id}/book/seats?theatre=${encodeURIComponent(modal.theatre)}&time=${encodeURIComponent(modal.time)}&count=${count}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full bg-white rounded-lg shadow mt-8 p-6">
        <h1 className="text-2xl font-bold mb-2">Sitaare Zameen Par - (Hindi)</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-200 px-2 py-1 rounded text-xs">UA13+</span>
          <span className="bg-gray-200 px-2 py-1 rounded text-xs">Comedy</span>
          <span className="bg-gray-200 px-2 py-1 rounded text-xs">Drama</span>
          <span className="bg-gray-200 px-2 py-1 rounded text-xs">Sports</span>
        </div>
        {/* Date selection */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {dates.map((d, i) => (
            <div
              key={i}
              className={`flex flex-col items-center px-4 py-2 rounded cursor-pointer border ${
                i === 0
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              <span className="font-bold">{d.day}</span>
              <span className="text-lg">{d.date}</span>
              <span className="text-xs">{d.month}</span>
            </div>
          ))}
        </div>
        {/* Cinema list */}
        <div>
          {cinemas.map((cinema, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <div className="font-semibold text-gray-800">{cinema.name}</div>
                <div className="text-xs text-gray-500">{cinema.info}</div>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {cinema.showtimes.map((time, i) => (
                  <button
                    key={i}
                    className="border border-green-500 text-green-700 px-4 py-2 rounded font-semibold hover:bg-green-50 transition"
                    onClick={() => handleShowtimeClick(cinema.name, time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-4">
          <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded mr-2">AVAILABLE</span>
          <span className="inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded mr-2">FAST FILLING</span>
          <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded">SUBTITLES LANGUAGE</span>
        </div>
      </div>
      <SelectSeatsModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, theatre: null, time: null })}
        onSelect={handleSelectSeats}
        theatre={modal.theatre}
        time={modal.time}
      />
      <Footer />
    </div>
  );
};

export default BookTickets;