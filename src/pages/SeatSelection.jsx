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

const TicketBookingFailedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm relative border-2 border-red-400">
        <button
          className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="text-5xl mb-2 text-red-500">❌</div>
          <h2 className="text-xl font-bold mb-4 text-center">Booking Failed!</h2>
          <p className="text-center mb-6">There was an issue processing your request. Please try again.</p>
          <button
            className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition text-lg"
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
    <div className="bg-gray-100 min-h-screen flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full bg-white rounded-lg shadow mt-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{movie}</h2>
          <div className="text-sm">{selected.length} / {count} Tickets</div>
        </div>
        <center>
          <div className="flex justify-center mt-4">
            <div className="overflow-x-auto flex-row">
              {(seatRows) ? (seatRows.map((row) => (
                <div key={row.label} className="flex items-center mb-2">
                  <span className="w-8 font-bold text-gray-700">{row.label}</span>
                  <div className="inline-block w-xl">
                    <div className="flex gap-2 justify-center">
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
                  </div>
                  <span className="ml-4 text-xs text-gray-500">Rs. {row.price} {row.type}</span>
                </div>
              ))) : (
                <p>Loading...</p>
              )}

              {/* All eyes here */}
              <div className="flex justify-items-center">
                {/* screen */}
                <div className="bg-slate-400 h-4 w-3xl mx-auto flex items-center rounded-2xl justify-center mt-8">
                  <p className="text-white text-xs">All eyes here</p>
                </div>

              </div>

            </div>
          </div>
        </center>
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