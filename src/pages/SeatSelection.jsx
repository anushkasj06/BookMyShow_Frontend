import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

// const seatRows = [
//   { label: "J", price: 250, count: 12, type: "PREMIUM" },
//   { label: "I", price: 250, count: 8, type: "PREMIUM" },
//   { label: "H", price: 250, count: 8, type: "PREMIUM" },
//   { label: "G", price: 230, count: 8, type: "EXECUTIVE" },
//   { label: "F", price: 230, count: 8, type: "EXECUTIVE" },
//   { label: "E", price: 230, count: 8, type: "EXECUTIVE" },
//   { label: "D", price: 230, count: 8, type: "EXECUTIVE" },
//   { label: "C", price: 230, count: 8, type: "NORMAL" },
//   { label: "B", price: 230, count: 8, type: "NORMAL" },
//   { label: "A", price: 230, count: 8, type: "NORMAL" },
// ];

const bestsellerSeatsSample = [
  "J12", "J13", "J14", "J15", "J16", "J17", "J18", "J19", "J20", "J21",
  "G7", "G8", "G9", "G10", "G15", "G16", "G17", "G18", "G19",
  "F7", "F8", "F9", "F10", "F15", "F16", "F17", "F18", "F19",
  "C7", "C8", "C9", "C10", "C15", "C16", "C17", "C18", "C19"
];

// const soldSeats = ["J6", "I5", "H5", "G5", "F5", "E5", "D5", "C5", "B5", "A5"];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentModal = ({ isOpen, onClose, onPay, amount }) => {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-sm relative border-2 border-green-400/50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-15 blur-xl"></div>
        
        <button
          className="absolute top-4 right-6 text-2xl text-gray-400 hover:text-gray-700 transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center relative z-10">
          <div className="text-6xl mb-4 animate-pulse">💳</div>
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Payment Gateway</h2>
          <div className="mb-6 text-center">
            <div className="text-3xl font-bold text-green-700 mb-2">₹{amount}</div>
            <div className="text-sm text-gray-500">Total Amount</div>
          </div>
          <button
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50"
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                onPay();
              }, 1500);
            }}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Processing...
              </div>
            ) : (
              "Pay Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const TicketBookingFailedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-sm relative border-2 border-red-400/50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-red-400 to-pink-400 rounded-full opacity-20 blur-2xl"></div>
        
        <button
          className="absolute top-4 right-6 text-2xl text-gray-400 hover:text-gray-700 transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center relative z-10">
          <div className="text-6xl mb-4 animate-bounce">❌</div>
          <h2 className="text-2xl font-bold mb-4 text-center text-red-600">Booking Failed!</h2>
          <p className="text-center mb-8 text-gray-600">There was an issue processing your request. Please try again.</p>
          <button
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg transform hover:scale-105"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, seats, amount, onDone }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-sm relative border-2 border-blue-400/50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-15 blur-xl"></div>
        
        <button
          className="absolute top-4 right-6 text-2xl text-gray-400 hover:text-gray-700 transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center relative z-10">
          <div className="text-6xl mb-4 animate-pulse">🎟️</div>
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Booking Confirmed!</h2>
          <div className="mb-4 text-center">
            <div className="text-sm text-gray-600 mb-2">Your seats:</div>
            <div className="font-bold text-lg text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl border border-blue-200/50">
              {seats.join(", ")}
            </div>
          </div>
          <div className="mb-6 text-center">
            <div className="text-sm text-gray-600 mb-1">Total Paid:</div>
            <div className="text-2xl font-bold text-green-700">₹{amount}</div>
          </div>
        <button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg transform hover:scale-105"
          onClick={onDone}
        >
          View Ticket
        </button>
        </div>
      </div>
    </div>
  );
};

const SeatSelection = () => {
  const query = useQuery();
  const count = parseInt(query.get("count"));
  const theaterId = parseInt(query.get("theatre"));
  const showId = parseInt(query.get("showId"));

  const time = query.get("time");
  const { id } = useParams(); //movie id
  const movieid = id;
  const [selected, setSelected] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ticketBookingFailed, setTicketBookingFailed] = useState(false);
  const [movie, setMovie] = useState("");
  const [theatre, setTheatre] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);

  const [seatRows, setSeatRows] = useState(null);
  const [soldSeats, setSoldSeats] = useState(null);
  const [bestsellerSeats, setBestsellerSeats] = useState(bestsellerSeatsSample);

  // Simulate fetching seat data
  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        setLoading(true);
        const theaterSeatsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_API}/theater-seats/theater/${theaterId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });
        const seatsPriceResponse = await axios.get(`${import.meta.env.VITE_BACKEND_API}/shows/seat/prices/${showId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });
        const bookedSeatsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_API}/seats/show/${showId}/booked`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });
        if (theaterSeatsResponse.status === 200 && seatsPriceResponse.status === 200 && bookedSeatsResponse.status === 200) {
          const theaterSeats = theaterSeatsResponse.data;
          const formatShowSeatRows = [];
          for (const row of theaterSeats) {
            formatShowSeatRows.push({
              label: row.rowLabel,
              price: row.seatType === "PREMIUM" ? seatsPriceResponse.data["PREMIUM"] : row.seatType === "CLASSICPLUS" ? seatsPriceResponse.data["CLASSICPLUS"] : seatsPriceResponse.data["CLASSIC"],
              count: row.seatCount,
              type: row.seatType
            });
          }
          setSeatRows(formatShowSeatRows);
          const bookedSeatNos = bookedSeatsResponse.data.map(seat => seat.seatNo);
          setSoldSeats(bookedSeatNos);
        }
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
      setLoading(false);
    };
    fetchSeatData();
  }, [theaterId, showId]);

  //fetch movie and theater from ids
  useEffect(() => {
    const fetchMovieAndTheatre = async () => {
      setLoading2(true);
      try {
        const movieResponse = await axios.get(`${import.meta.env.VITE_BACKEND_API}/movies/id/${movieid}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });
        const theaterResponse = await axios.get(`${import.meta.env.VITE_BACKEND_API}/theaters/id/${theaterId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });
        if (movieResponse.status === 200 && theaterResponse.status === 200) {
          setMovie(movieResponse.data.movieName);
          setTheatre(theaterResponse.data.name);
        }
      } catch (error) {
        console.error("Error fetching movie and theater data:", error);
      }
      setLoading2(false);
    };
    fetchMovieAndTheatre();
  }, []);

  const handleSelect = (row, num) => {
    const seatId = row + num;
    if (selected.includes(seatId)) {
      setSelected(selected.filter((s) => s !== seatId));
    } else if (selected.length < count) {
      setSelected([...selected, seatId]);
    }
  };

  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/signup/profile`, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json"
        }
        });
        if (response.status === 200) {
          setUserId(response.data.id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  const handleTicketBooking = async () => {
    try {
      // console.log("Selected seats:", selected);
      // console.log("Show ID:", showId);
      // console.log("User ID:", userId);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/ticket/book`, {
        showId: showId,
        userId: userId,
        requestSeats: selected
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        console.log("Ticket booked successfully:", response.data);
      }
      // console.log("Ticket booking response:", response.data);
      return true;
    } catch (error) {
      console.error("Error booking ticket:", error);
    }
    return false;
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-200 opacity-20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-yellow-200 opacity-15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full py-8 px-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/30 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-15 blur-xl"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-pink-500 to-red-500 text-white p-3 rounded-2xl shadow-lg">
                <span className="text-2xl">🎬</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{movie}</h2>
                <p className="text-gray-600 text-sm">{theatre} • {time}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
              {selected.length} / {count} Tickets
            </div>
        </div>
          
          <div className="flex justify-center mt-8">
            <div className="overflow-x-auto flex-row">
              {(seatRows) ? (seatRows.map((row) => (
                <div key={row.label} className="flex items-center mb-4">
                  <span className="w-12 font-bold text-gray-700 text-lg bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-2 rounded-xl border border-gray-300/50">{row.label}</span>
                  <div className="inline-block w-xl ml-4">
                    <div className="flex gap-3 justify-center">
                      {Array.from({ length: row.count }, (_, i) => {
                        const seatId = row.label + (i + 1);
                        const isSold = soldSeats.includes(seatId);
                        const isBestseller = bestsellerSeats.includes(seatId);
                        const isSelected = selected.includes(seatId);
                        
                        // Enhanced seat styling with glassmorphism and marble effects
                        let seatClasses = "w-12 h-12 border-2 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 transform hover:scale-110 ";
                        
                        if (isSold) {
                          seatClasses += "bg-gradient-to-br from-gray-400 to-gray-600 text-gray-300 border-gray-500 cursor-not-allowed shadow-inner opacity-60";
                        } else if (isBestseller) {
                          seatClasses += "bg-gradient-to-br from-yellow-300 via-orange-300 to-yellow-400 text-orange-900 border-orange-400 shadow-lg hover:shadow-xl hover:from-yellow-400 hover:via-orange-400 hover:to-yellow-500 font-extrabold";
                        } else if (isSelected) {
                          seatClasses += "bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-500 text-white border-emerald-600 shadow-xl scale-110 animate-pulse font-extrabold";
                        } else {
                          seatClasses += "bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 text-indigo-700 border-indigo-300 shadow-md hover:shadow-lg hover:from-blue-200 hover:via-indigo-200 hover:to-purple-200";
                        }
                        
                        return (
                          <button
                            key={seatId}
                            disabled={isSold}
                            onClick={() => handleSelect(row.label, i + 1)}
                            className={seatClasses}
                            style={{
                              backdropFilter: 'blur(10px)',
                              backgroundImage: isBestseller ? 
                                'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.2))' : 
                                isSelected ?
                                'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))' :
                                isSold ?
                                'linear-gradient(135deg, rgba(156, 163, 175, 0.3), rgba(107, 114, 128, 0.2))' :
                                'linear-gradient(135deg, rgba(147, 197, 253, 0.2), rgba(167, 139, 250, 0.1))'
                            }}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <span className="ml-6 text-sm text-gray-600 bg-white/60 px-3 py-2 rounded-xl border border-white/30 backdrop-blur-sm">
                    ₹{row.price} <span className="font-semibold">{row.type}</span>
                  </span>
                </div>
              ))) : (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
                  <span className="ml-4 text-gray-600 font-semibold">Loading seats...</span>
                </div>
              )}

              {/* Enhanced Screen */}
              <div className="flex justify-center mt-12 mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 h-6 w-96 mx-auto flex items-center justify-center rounded-3xl shadow-2xl border-2 border-slate-300/50 relative overflow-hidden">
                    {/* Screen reflection effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <p className="text-white text-sm font-bold relative z-10">🎬 ALL EYES HERE 🎬</p>
                  </div>
                  {/* Screen glow effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Legend */}
          <div className="flex gap-6 mt-8 text-sm justify-center flex-wrap">
            <span className="inline-flex items-center bg-gradient-to-br from-yellow-100 to-orange-100 px-4 py-2 rounded-xl border border-orange-300/50">
              <span className="w-4 h-4 border-2 border-orange-400 bg-gradient-to-br from-yellow-300 to-orange-400 rounded mr-2 shadow-sm"></span> 
              Bestseller
            </span>
            <span className="inline-flex items-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4 py-2 rounded-xl border border-indigo-300/50">
              <span className="w-4 h-4 border-2 border-indigo-400 bg-gradient-to-br from-blue-200 to-indigo-300 rounded mr-2 shadow-sm"></span> 
              Available
            </span>
            <span className="inline-flex items-center bg-gradient-to-br from-emerald-100 to-green-100 px-4 py-2 rounded-xl border border-emerald-300/50">
              <span className="w-4 h-4 border-2 border-emerald-500 bg-gradient-to-br from-emerald-400 to-green-500 rounded mr-2 shadow-sm"></span> 
              Selected
            </span>
            <span className="inline-flex items-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-2 rounded-xl border border-gray-300/50">
              <span className="w-4 h-4 border-2 border-gray-500 bg-gradient-to-br from-gray-400 to-gray-600 rounded mr-2 shadow-sm opacity-60"></span> 
              Sold
            </span>
        </div>
          
        <div className="mt-8 flex justify-end">
          <button
              className={`bg-gradient-to-r from-pink-500 to-red-500 text-white px-10 py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            disabled={selected.length !== count}
            onClick={() => setShowPayment(true)}
          >
              {selected.length === count ? (
                <span className="flex items-center gap-2">
                  <span>🎟️</span>
                  Proceed to Payment
                  <span>💳</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>⏳</span>
                  Select {count - selected.length} More Seat{count - selected.length !== 1 ? 's' : ''}
                </span>
              )}
          </button>
          </div>
        </div>
      </div>
      
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPay={async () => {
          setShowPayment(false);
          if(await handleTicketBooking()){
            setShowConfirmation(true);
          }
          else{
            setTicketBookingFailed(true);
          }
        }}
        amount={total}
      />

      <TicketBookingFailedModal
        isOpen={ticketBookingFailed}
        onClose={() => setTicketBookingFailed(false)}
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