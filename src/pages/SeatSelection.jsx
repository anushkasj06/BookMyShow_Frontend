import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

// Helper to get URL query parameters
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

// --- MODIFICATION START ---
// The old modals (PaymentModal, ConfirmationModal, TicketBookingFailedModal) are no longer needed
// and have been removed. The Razorpay checkout will serve as the payment modal.
// --- MODIFICATION END ---

const SeatSelection = () => {
    const query = useQuery();
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const count = parseInt(query.get("count"));
    const theaterId = parseInt(query.get("theatre"));
    const showId = parseInt(query.get("showId"));
    const time = query.get("time");
    const { id: movieId } = useParams();

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [userId, setUserId] = useState(null);
    const [movie, setMovie] = useState("");
    const [theatre, setTheatre] = useState("");
    
    // Data fetching states
    const [seatRows, setSeatRows] = useState(null);
    const [soldSeats, setSoldSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- MODIFICATION START ---
    // New state variables to manage the payment flow and UI feedback
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    // --- MODIFICATION END ---

    // --- DATA FETCHING (useEffect hooks are unchanged) ---
    useEffect(() => {
        const fetchSeatData = async () => {
            setLoading(true);
            try {
                const [theaterSeatsResponse, seatsPriceResponse, bookedSeatsResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_API}/theater-seats/theater/${theaterId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
                    axios.get(`${import.meta.env.VITE_BACKEND_API}/shows/seat/prices/${showId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
                    axios.get(`${import.meta.env.VITE_BACKEND_API}/seats/show/${showId}/booked`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
                ]);

                const theaterSeats = theaterSeatsResponse.data;
                const prices = seatsPriceResponse.data;
                const bookedSeats = bookedSeatsResponse.data.map(seat => seat.seatNo);

                const formattedSeatRows = theaterSeats.map(row => ({
                    label: row.rowLabel,
                    price: prices[row.seatType] || 0,
                    count: row.seatCount,
                    type: row.seatType
                }));

                setSeatRows(formattedSeatRows);
                setSoldSeats(bookedSeats);
            } catch (error) {
                console.error("Error fetching seat data:", error);
                setStatusMessage("Failed to load seat information.");
            }
            setLoading(false);
        };
        fetchSeatData();
    }, [theaterId, showId]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/signup/profile`, {
                    headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
                });
                setUserId(response.data.id);
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };
        fetchUserDetails();
    }, []);

    useEffect(() => {
        const fetchMovieAndTheatreDetails = async () => {
            try {
                const [movieResponse, theaterResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_API}/movies/id/${movieId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
                    axios.get(`${import.meta.env.VITE_BACKEND_API}/theaters/id/${theaterId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
                ]);
                setMovie(movieResponse.data.movieName);
                setTheatre(theaterResponse.data.name);
            } catch (error) {
                console.error("Error fetching movie and theater data:", error);
            }
        };
        fetchMovieAndTheatreDetails();
    }, [movieId, theaterId]);

    // --- SEAT SELECTION LOGIC (Unchanged) ---
    const handleSelectSeat = (row, num) => {
        const seatId = row + num;
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
        } else if (selectedSeats.length < count) {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    // --- TOTAL CALCULATION (Unchanged) ---
    const totalAmount = selectedSeats.reduce((sum, seatId) => {
        const rowLabel = seatId.match(/[A-Z]+/)[0];
        const row = seatRows?.find((r) => r.label === rowLabel);
        return sum + (row ? row.price : 0);
    }, 0);

    // --- MODIFICATION START ---
    // This is the new, integrated payment and booking handler.
    const handleProceedToPayment = async () => {
        if (selectedSeats.length !== count) {
            setStatusMessage(`Please select exactly ${count} seats.`);
            return;
        }
        setIsProcessingPayment(true);
        setStatusMessage("Creating your order...");

        // Construct the DTO your backend needs for the /ticket/book endpoint
        const ticketEntryDto = {
            showId: showId,
            userId: userId,
             requestSeats: selectedSeats, // Make sure your backend DTO expects 'seatNos'
        };

        try {
            // Step 1: Create Razorpay Order from your backend
            const orderResponse = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/payment/create-order`, 
                { amount: totalAmount },
                { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
            );

            const orderData = orderResponse.data;

            // Step 2: Configure and open Razorpay Checkout
            const options = {
                key: 'rzp_test_4DotYCe9Ux9uOT', // **IMPORTANT**: Replace with your Razorpay Key ID
                amount: orderData.amount,
                currency: "INR",
                name: "BookMyShow Clone",
                description: `Ticket for ${movie}`,
                order_id: orderData.id,
                handler: async function (response) {
                    setStatusMessage("Verifying payment...");
                    const verificationPayload = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        ticketEntryDto: ticketEntryDto,
                    };

                    try {
                        const verificationResponse = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/payment/verify-payment`, 
                            verificationPayload,
                            { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
                        );
                        setStatusMessage("Booking Confirmed! Redirecting...");
                        setTimeout(() => {
                           navigate(`/profile`); // Navigate to a profile or ticket history page
                        }, 3000);
                    } catch (verificationError) {
                        console.error("Payment verification failed:", verificationError);
                        setStatusMessage("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: "Test User",
                    email: "test.user@example.com",
                },
                theme: {
                    color: "#F94263",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            paymentObject.on('payment.failed', function (response) {
                console.error("Razorpay payment failed:", response.error);
                setStatusMessage(`Payment Failed: ${response.error.description}`);
            });
        } catch (error) {
            console.error("Order creation failed:", error);
            setStatusMessage("Could not initiate payment. Please try again.");
        } finally {
            setIsProcessingPayment(false);
        }
    };
    // --- MODIFICATION END ---

    // --- RENDER LOGIC ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100 flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-6xl mx-auto w-full py-8 px-4">
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/30">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{movie}</h2>
                            <p className="text-gray-600 text-sm">{theatre} • {time}</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
                            {selectedSeats.length} / {count} Tickets
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {seatRows.map((row) => (
                            <div key={row.label} className="flex items-center mb-4">
                                <span className="w-12 font-bold text-gray-700">{row.label}</span>
                                <div className="flex gap-3 ml-4">
                                    {Array.from({ length: row.count }, (_, i) => {
                                        const seatId = row.label + (i + 1);
                                        const isSold = soldSeats.includes(seatId);
                                        const isSelected = selectedSeats.includes(seatId);
                                        let seatClasses = "w-10 h-10 border-2 rounded-lg flex items-center justify-center font-bold transition-all duration-200";
                                        if (isSold) seatClasses += " bg-gray-400 cursor-not-allowed";
                                        else if (isSelected) seatClasses += " bg-green-500 text-white scale-110";
                                        else seatClasses += " bg-gray-200 hover:bg-green-200";
                                        return (
                                            <button key={seatId} disabled={isSold} onClick={() => handleSelectSeat(row.label, i + 1)} className={seatClasses}>
                                                {i + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center my-6">
                        <div className="h-2 bg-gray-300 w-full max-w-md mx-auto rounded-full relative">
                           <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-50 blur-md"></div>
                           <p className="absolute -bottom-6 w-full text-gray-600 font-bold">SCREEN THIS WAY</p>
                        </div>
                    </div>

                    {/* --- MODIFICATION START --- */}
                    {/* Display Status Message and updated Pay Button */}
                    <div className="mt-8 flex flex-col items-end gap-4">
                        {statusMessage && (
                            <div className={`p-3 rounded-lg text-center font-semibold w-full max-w-md ${statusMessage.includes('Confirmed') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {statusMessage}
                            </div>
                        )}
                        <button
                            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-10 py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={selectedSeats.length !== count || isProcessingPayment || statusMessage.includes('Confirmed')}
                            onClick={handleProceedToPayment}
                        >
                            {isProcessingPayment 
                                ? "Processing..." 
                                : `Pay ₹${totalAmount}`
                            }
                        </button>
                    </div>
                    {/* --- MODIFICATION END --- */}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SeatSelection;