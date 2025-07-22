import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

// Helper to get URL query parameters
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

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

    // New state variables to manage the payment flow and UI feedback
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

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

    // --- RENDER LOGIC ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent"></div>
            </div>
        );
    }

    // Function to determine if a seat is a bestseller (deterministic: first 2 seats in rows A, B, C)
    const isBestsellerSeat = (rowLabel, seatNumber) => {
        if (["A", "B", "C"].includes(rowLabel) && seatNumber <= 2) {
            return true;
        }
        return false;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-blue-100 to-purple-200 flex flex-col font-sans">
            <Navbar />
            <div className="flex-1 max-w-5xl mx-auto w-full py-10 px-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/40">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-800 drop-shadow-lg">{movie}</h2>
                            <p className="text-gray-600 text-base font-medium mt-1">{theatre} • {time}</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg text-lg">
                            {selectedSeats.length} / {count} Tickets
                        </div>
                    </div>

                    <div className="overflow-x-auto pb-6">
                        {seatRows.map((row) => (
                            <div key={row.label} className="flex items-center mb-6">
                                <span className="w-12 font-black text-xl text-gray-700 drop-shadow-sm flex-shrink-0">{row.label}</span>
                                <div className="flex flex-wrap gap-3 ml-4 flex-1">
                                    {Array.from({ length: row.count }, (_, i) => {
                                        const seatId = row.label + (i + 1);
                                        const isSold = soldSeats.includes(seatId);
                                        const isSelected = selectedSeats.includes(seatId);
                                        const isBestseller = isBestsellerSeat(row.label, i + 1);

                                        let seatClasses = "w-10 h-10 border-2 rounded-lg flex items-center justify-center text-base font-bold transition-all duration-200 shadow-md relative";
                                        if (isSold) seatClasses += " bg-gray-400 text-gray-700 cursor-not-allowed border-gray-400";
                                        else if (isSelected) seatClasses += " bg-gradient-to-br from-green-400 to-green-600 text-white scale-110 border-green-600 z-10";
                                        else if (isBestseller) seatClasses += " bg-yellow-300 text-yellow-900 border-yellow-500 hover:bg-yellow-400 animate-pulse";
                                        else seatClasses += " bg-gray-100 hover:bg-pink-200 border-gray-300 hover:border-pink-400";

                                        return (
                                            <button
                                                key={seatId}
                                                disabled={isSold}
                                                onClick={() => handleSelectSeat(row.label, i + 1)}
                                                className={seatClasses}
                                                style={{ position: "relative" }}
                                            >
                                                {i + 1}
                                                {isBestseller && !isSold && (
                                                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow"></span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="ml-6 flex flex-col items-end flex-shrink-0 gap-1">
                                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xs font-bold shadow">{row.type}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold shadow border border-pink-200 mt-1">₹{row.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center my-10">
                        <div className="h-3 bg-gradient-to-r from-pink-400 to-red-400 w-full max-w-lg mx-auto rounded-full relative shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-40 blur-md"></div>
                            <p className="absolute -bottom-7 w-full text-gray-700 font-extrabold tracking-widest text-base drop-shadow">SCREEN THIS WAY</p>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-10 p-6 bg-white/70 rounded-2xl text-base flex flex-wrap gap-8 justify-center shadow border border-white/30">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-lg border-2 border-green-600"></span>
                            <span className="font-semibold text-gray-700">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-400 rounded-lg border-2 border-gray-400"></span>
                            <span className="font-semibold text-gray-700">Sold</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-yellow-300 rounded-lg border-2 border-yellow-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-yellow-900" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/></svg>
                            </span>
                            <span className="font-semibold text-gray-700">Bestseller</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-100 rounded-lg border-2 border-gray-300"></span>
                            <span className="font-semibold text-gray-700">Available</span>
                        </div>
                    </div>

                    {/* Status Message and Pay Button */}
                    <div className="mt-10 flex flex-col items-end gap-4">
                        {statusMessage && (
                            <div className={`p-4 rounded-xl text-center font-semibold w-full max-w-md shadow-lg border-2 ${statusMessage.includes('Confirmed') ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                                {statusMessage}
                            </div>
                        )}
                        <button
                            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-12 py-5 rounded-2xl font-extrabold text-2xl transition-all duration-300 shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
                            disabled={selectedSeats.length !== count || isProcessingPayment || statusMessage.includes('Confirmed')}
                            onClick={handleProceedToPayment}
                        >
                            {isProcessingPayment
                                ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                        Processing...
                                    </div>
                                )
                                : `Pay ₹${totalAmount}`
                            }
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SeatSelection;