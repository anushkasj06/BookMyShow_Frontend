import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const seatRows = [
  { label: "J", price: 250, count: 12, type: "PREMIUM" },
  { label: "I", price: 250, count: 8, type: "PREMIUM" },
  { label: "H", price: 250, count: 8, type: "PREMIUM" },
  { label: "G", price: 230, count: 8, type: "EXECUTIVE" },
  { label: "F", price: 230, count: 8, type: "EXECUTIVE" },
  { label: "E", price: 230, count: 8, type: "EXECUTIVE" },
  { label: "D", price: 230, count: 8, type: "EXECUTIVE" },
  { label: "C", price: 230, count: 8, type: "NORMAL" },
  { label: "B", price: 230, count: 8, type: "NORMAL" },
  { label: "A", price: 230, count: 8, type: "NORMAL" },
];

const bestsellerSeats = [
  "J12", "J13", "J14", "J15", "J16", "J17", "J18", "J19", "J20", "J21",
  "G7", "G8", "G9", "G10", "G15", "G16", "G17", "G18", "G19",
  "F7", "F8", "F9", "F10", "F15", "F16", "F17", "F18", "F19",
  "C7", "C8", "C9", "C10", "C15", "C16", "C17", "C18", "C19"
];

const soldSeats = ["J6", "I5", "H5", "G5", "F5", "E5", "D5", "C5", "B5", "A5"];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentModal = ({ isOpen, onClose, onPay, amount }) => {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm relative border-2 border-green-400">
        <button
          className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="text-5xl mb-2 text-green-500">💳</div>
          <h2 className="text-xl font-bold mb-4 text-center">Payment</h2>
          <div className="mb-4 text-center text-2xl font-semibold text-green-700">Total: ₹{amount}</div>
          <button
            className="w-full bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600 transition text-lg"
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                onPay();
              }, 1500);
            }}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, seats, amount, onDone }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm relative border-2 border-blue-400 flex flex-col items-center">
        <button
          className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-5xl mb-2 text-blue-500">🎟️</div>
        <h2 className="text-xl font-bold mb-4">Booking Confirmed!</h2>
        <div className="mb-2">Your seats:</div>
        <div className="mb-4 font-semibold text-lg">{seats.join(", ")}</div>
        <div className="mb-4">Total Paid: <span className="font-bold text-green-700">₹{amount}</span></div>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition text-lg"
          onClick={onDone}
        >
          View Ticket
        </button>
      </div>
    </div>
  );
};

const SeatSelection = () => {
  const query = useQuery();
  const count = parseInt(query.get("count")) || 1;
  const theatre = query.get("theatre") || "Cinepolis: Seasons Mall, Pune";
  const time = query.get("time") || "08:00 PM";
  const movie = "Sitaare Zameen Par";
  const [selected, setSelected] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (row, num) => {
    const seatId = row + num;
    if (selected.includes(seatId)) {
      setSelected(selected.filter((s) => s !== seatId));
    } else if (selected.length < count) {
      setSelected([...selected, seatId]);
    }
  };

  // Calculate total amount
  const total = selected.reduce((sum, seatId) => {
    const row = seatRows.find((r) => r.label === seatId[0]);
    return sum + (row ? row.price : 0);
  }, 0);

  const handleDone = () => {
    setShowConfirmation(false);
    // Redirect to booking summary with all details
    navigate(
      `/booking-summary?movie=${encodeURIComponent(movie)}&theatre=${encodeURIComponent(theatre)}&time=${encodeURIComponent(time)}&seats=${selected.join(",")}&amount=${total}`
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full bg-white rounded-lg shadow mt-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{movie}</h2>
          <div className="text-sm">{selected.length} / {count} Tickets</div>
        </div>
        <div className="overflow-x-auto">
          {seatRows.map((row) => (
            <div key={row.label} className="flex items-center mb-2">
              <span className="w-8 font-bold text-gray-700">{row.label}</span>
              <div className="flex gap-2">
                {Array.from({ length: row.count }, (_, i) => {
                  const seatId = row.label + (i + 1);
                  const isSold = soldSeats.includes(seatId);
                  const isBestseller = bestsellerSeats.includes(seatId);
                  const isSelected = selected.includes(seatId);
                  return (
                    <button
                      key={seatId}
                      disabled={isSold}
                      onClick={() => handleSelect(row.label, i + 1)}
                      className={`w-8 h-8 border rounded flex items-center justify-center text-xs font-semibold
                        ${isSold ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed" : ""}
                        ${isBestseller ? "border-yellow-400 text-yellow-600" : ""}
                        ${isSelected ? "bg-green-500 text-white border-green-600" : ""}
                        ${!isSold && !isSelected && !isBestseller ? "border-green-500 text-green-700" : ""}
                        hover:scale-110 transition-transform`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <span className="ml-4 text-xs text-gray-500">Rs. {row.price} {row.type}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-6 text-xs">
          <span className="inline-flex items-center"><span className="w-4 h-4 border border-yellow-400 bg-yellow-100 mr-1"></span> Bestseller</span>
          <span className="inline-flex items-center"><span className="w-4 h-4 border border-green-500 bg-white mr-1"></span> Available</span>
          <span className="inline-flex items-center"><span className="w-4 h-4 border border-green-600 bg-green-500 mr-1"></span> Selected</span>
          <span className="inline-flex items-center"><span className="w-4 h-4 border border-gray-300 bg-gray-200 mr-1"></span> Sold</span>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            className={`bg-pink-500 text-white px-8 py-2 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={selected.length !== count}
            onClick={() => setShowPayment(true)}
          >
            Proceed
          </button>
        </div>
      </div>
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPay={() => {
          setShowPayment(false);
          setShowConfirmation(true);
        }}
        amount={total}
      />
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        seats={selected}
        amount={total}
        onDone={handleDone}
      />
      <Footer />
    </div>
  );
};

export default SeatSelection; 