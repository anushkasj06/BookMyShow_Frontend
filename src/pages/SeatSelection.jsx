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
    const { state } = useLocation();
    const query = useQuery();
    const navigate = useNavigate();
    const { id: movieId } = useParams();

    // --- MODE DETERMINATION (BOOKING VS. UPDATING) ---
    const isUpdateMode = state?.isUpdateMode || false;
    const originalTicketId = state?.originalTicketId || null;
    const originalFare = state?.originalFare || 0;

    // --- STATE MANAGEMENT ---
    const count = isUpdateMode ? 1 : parseInt(query.get("count"));
    const theaterId = isUpdateMode ? state.theaterId : parseInt(query.get("theatre"));
    const showId = isUpdateMode ? state.newShowId : parseInt(query.get("showId"));
    const time = isUpdateMode ? state.time : query.get("time");

    const [allShowSeats, setAllShowSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [userId, setUserId] = useState(null);
    const [movie, setMovie] = useState("");
    const [theatre, setTheatre] = useState("");
    const [seatRows, setSeatRows] = useState(null);
    const [soldSeats, setSoldSeats] = useState([]);
    const [lockedSeats, setLockedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    // --- Data Fetching Hooks ---
    useEffect(() => {
        const fetchSeatData = async () => {
            setLoading(true);
            try {
                const [theaterSeatsResponse, seatsPriceResponse, bookedSeatsResponse, allSeatsResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_API}/theater-seats/theater/${theaterId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
                    axios.get(`${import.meta.env.VITE_BACKEND_API}/shows/seat/prices/${showId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
                    axios.get(`${import.meta.env.VITE_BACKEND_API}/seats/show/${showId}/booked`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
                    axios.get(`${import.meta.env.VITE_BACKEND_API}/seats/show/${showId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
                ]);
                
                setAllShowSeats(allSeatsResponse.data);

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
        if (theaterId && showId) fetchSeatData();
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
                setStatusMessage("Could not authenticate user.");
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
        if (movieId && theaterId) fetchMovieAndTheatreDetails();
    }, [movieId, theaterId]);

    // --- SEAT SELECTION LOGIC ---
    const handleSelectSeat = async (row, num) => {
        const seatNo = row + num;
        const token = localStorage.getItem("token");
        if (!token || !userId) {
            setStatusMessage("Please log in to select seats.");
            return;
        }

        const seatObject = allShowSeats.find(seat => seat.seatNo === seatNo);
        if (!seatObject) {
            console.error(`Seat data for ${seatNo} not found.`);
            setStatusMessage("An error occurred. Please refresh the page.");
            return;
        }

        // Deselecting a seat
        if (selectedSeats.includes(seatNo)) {
            try {
                setIsProcessing(true);
                setStatusMessage(`Unlocking seat ${seatNo}...`);
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_API}/seats/unlockSeat`,
                    { seatId: seatObject.id, userId },
                    { headers: { "Authorization": `Bearer ${token}` } }
                );
                setSelectedSeats(selectedSeats.filter((s) => s !== seatNo));
                setLockedSeats(lockedSeats.filter((s) => s !== seatNo));
                setIsProcessing(false);
                setStatusMessage("");
            } catch (error) {
                console.error(`Error unlocking seat ${seatNo}:`, error);
                setStatusMessage(error.response?.data?.message || `Failed to unlock seat ${seatNo}.`);
                setIsProcessing(false);
            }
        }
        // Selecting a seat
        else if (selectedSeats.length < count) {
            try {
                setIsProcessing(true);
                setStatusMessage(`Locking seat ${seatNo}...`);
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_API}/seats/lockSeat`,
                    { seatId: seatObject.id, userId },
                    { headers: { "Authorization": `Bearer ${token}` } }
                );
                setSelectedSeats([...selectedSeats, seatNo]);
                setLockedSeats([...lockedSeats, seatNo]);
                setIsProcessing(false);
                setStatusMessage("");
            } catch (error) {
                console.error(`Error locking seat ${seatNo}:`, error);
                setStatusMessage(error.response?.data?.message || `Failed to lock seat ${seatNo}. It may already be taken.`);
                setIsProcessing(false);
            }
        } else {
            setStatusMessage(`You can only select ${count} seat(s).`);
        }
    };

    // --- TOTAL CALCULATION ---
    const newSeatPrice = selectedSeats.reduce((sum, seatId) => {
        const rowLabel = seatId.match(/[A-Z]+/)[0];
        const row = seatRows?.find((r) => r.label === rowLabel);
        return sum + (row ? row.price : 0);
    }, 0);

    const UPDATE_FEE = 20;
    const fareDifference = isUpdateMode ? (newSeatPrice + UPDATE_FEE - originalFare) : 0;
    const amountToPay = isUpdateMode ? Math.max(0, fareDifference) : newSeatPrice;

    const handleUnlockSeats = async (seatsToUnlock) => {
        const token = localStorage.getItem("token");
        if (!token || !userId || seatsToUnlock.length === 0) return;

        const seatObjectsToUnlock = seatsToUnlock.map(seatNo => allShowSeats.find(s => s.seatNo === seatNo)).filter(Boolean);

        const unlockPromises = seatObjectsToUnlock.map(seat =>
            axios.post(
                `${import.meta.env.VITE_BACKEND_API}/seats/unlockSeat`,
                { seatId: seat.id, userId },
                { headers: { "Authorization": `Bearer ${token}` } }
            ).catch(e => {
                console.error(`Failed to unlock seat ${seat.seatNo}:`, e);
            })
        );
        await Promise.allSettled(unlockPromises);
        setLockedSeats([]);
        setSelectedSeats([]);
    };

    // --- TICKET UPDATE LOGIC ---
    const handleTicketUpdate = async () => {
        if (selectedSeats.length !== 1) {
            setStatusMessage("Please select exactly one new seat to update.");
            return;
        }
        setIsProcessing(true);
        setStatusMessage("Processing ticket update...");

        const ticketUpdateDto = {
            originalTicketId,
            newShowId: showId,
            newSeatNo: selectedSeats[0],
            userId,
        };

        const finalUpdateStep = async () => {
            try {
                setStatusMessage("Finalizing update...");
                await axios.put(`${import.meta.env.VITE_BACKEND_API}/ticket/update`, ticketUpdateDto, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                setStatusMessage("Ticket Updated Successfully! Redirecting...");
                await handleUnlockSeats(lockedSeats);
                setTimeout(() => navigate('/profile'), 3000);
            } catch (updateError) {
                console.error("Failed to update ticket:", updateError);
                setStatusMessage(updateError.response?.data?.message || "Failed to update ticket.");
            } finally {
                setIsProcessing(false);
            }
        };

        if (amountToPay > 0) {
            try {
                const orderResponse = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/payment/create-order`, { amount: amountToPay }, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
                const orderData = orderResponse.data;
                const options = {
                    key: 'rzp_test_4DotYCe9Ux9uOT',
                    amount: orderData.amount,
                    currency: "INR",
                    name: "BookMyShow Clone - Ticket Update",
                    description: `Update fee and fare difference`,
                    order_id: orderData.id,
                    handler: async function (response) {
                        await finalUpdateStep();
                    },
                    prefill: { name: "Test User", email: "test.user@example.com" },
                };
                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
                setIsProcessing(false);
            } catch (orderError) {
                console.error("Failed to create payment order for update:", orderError);
                setStatusMessage("Could not initiate payment for the update.");
                setIsProcessing(false);
            }
        } else {
            await finalUpdateStep();
        }
    };

    // --- ORIGINAL PAYMENT LOGIC ---
    const handleProceedToPayment = async () => {
        if (selectedSeats.length !== count) {
            setStatusMessage(`Please select exactly ${count} seats.`);
            return;
        }
        setIsProcessing(true);
        setStatusMessage("Creating your order...");

        const ticketEntryDto = {
            showId: showId,
            userId: userId,
            requestSeats: selectedSeats,
        };

        try {
            const orderResponse = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/payment/create-order`, { amount: amountToPay }, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
            const orderData = orderResponse.data;
            const options = {
                key: 'rzp_test_4DotYCe9Ux9uOT',
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
                        await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/payment/verify-payment`, verificationPayload, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
                        setStatusMessage("Booking Confirmed! Redirecting...");
                        await handleUnlockSeats(lockedSeats);
                        setTimeout(() => navigate(`/profile`), 3000);
                    } catch (verificationError) {
                        console.error("Payment verification failed:", verificationError);
                        setStatusMessage("Payment verification failed. Please contact support.");
                        await handleUnlockSeats(lockedSeats);
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: { name: "Test User", email: "test.user@example.com" },
                theme: { color: "#F94263" },
            };
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            paymentObject.on('payment.failed', async function (response) {
                console.error("Razorpay payment failed:", response.error);
                setStatusMessage(`Payment Failed: ${response.error.description}`);
                setIsProcessing(false);
                await handleUnlockSeats(lockedSeats);
            });
        } catch (error) {
            console.error("Order creation failed:", error);
            setStatusMessage("Could not initiate payment. Please try again.");
            setIsProcessing(false);
        }
    };

    // --- UNIVERSAL HANDLER ---
    const handleProceed = () => {
        if (isUpdateMode) {
            handleTicketUpdate();
        } else {
            handleProceedToPayment();
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

    const isBestsellerSeat = (rowLabel, seatNumber) => ["A", "B", "C"].includes(rowLabel) && seatNumber <= 2;

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
                            {isUpdateMode ? "Select 1 New Seat" : `${selectedSeats.length} / ${count} Tickets`}
                        </div>
                    </div>

                    <div className="overflow-x-auto pb-6">
                        {seatRows && seatRows.map((row) => (
                            <div key={row.label} className="flex items-center mb-6">
                                <span className="w-12 font-black text-xl text-gray-700 drop-shadow-sm flex-shrink-0">{row.label}</span>
                                <div className="flex flex-wrap gap-3 ml-4 flex-1 justify-center">
                                    {Array.from({ length: row.count }, (_, i) => {
                                        const seatNo = row.label + (i + 1);
                                        
                                        // CHANGE: Define seat status based on the full data from allShowSeats
                                        const seatObject = allShowSeats.find(s => s.seatNo === seatNo);
                                        const isSold = seatObject ? !seatObject.isAvailable : soldSeats.includes(seatNo);
                                        const isLockedByOther = seatObject ? (seatObject.lockedByUserId && seatObject.lockedByUserId !== userId) : false;
                                        
                                        const isSelected = selectedSeats.includes(seatNo);
                                        const isBestseller = isBestsellerSeat(row.label, i + 1);

                                        let seatClasses = "w-10 h-10 border-2 rounded-lg flex items-center justify-center text-base font-bold transition-all duration-200 shadow-md relative";
                                        
                                        // CHANGE: Update the styling logic to make seats locked by others appear grey
                                        if (isSold || isLockedByOther) {
                                            seatClasses += " bg-gray-400 text-gray-700 cursor-not-allowed border-gray-400";
                                        } else if (isSelected) {
                                            seatClasses += " bg-gradient-to-br from-green-400 to-green-600 text-white scale-110 border-green-600 z-10";
                                        } else if (isBestseller) {
                                            seatClasses += " bg-yellow-300 text-yellow-900 border-yellow-500 hover:bg-yellow-400 animate-pulse";
                                        } else {
                                            seatClasses += " bg-gray-100 hover:bg-pink-200 border-gray-300 hover:border-pink-400";
                                        }
                                        
                                        // CHANGE: Disable the button if it's sold OR locked by another user
                                        const isDisabled = isSold || isLockedByOther || isProcessing;

                                        return (
                                            <button key={seatNo} disabled={isDisabled} onClick={() => handleSelectSeat(row.label, i + 1)} className={seatClasses}>
                                                {i + 1}
                                                {isBestseller && !isSold && !isLockedByOther &&(
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

                    <div className="mt-10 p-6 bg-white/70 rounded-2xl text-base flex flex-wrap gap-8 justify-center shadow border border-white/30">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-lg border-2 border-green-600"></span><span className="font-semibold text-gray-700">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-400 rounded-lg border-2 border-gray-400"></span><span className="font-semibold text-gray-700">Sold / Locked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-yellow-300 rounded-lg border-2 border-yellow-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-yellow-900" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
                            </span><span className="font-semibold text-gray-700">Bestseller</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-100 rounded-lg border-2 border-gray-300"></span><span className="font-semibold text-gray-700">Available</span>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col items-end gap-4">
                        {statusMessage && (
                            <div className={`p-4 rounded-xl text-center font-semibold w-full max-w-md shadow-lg border-2 ${statusMessage.includes('Confirmed') || statusMessage.includes('Updated') ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                                {statusMessage}
                            </div>
                        )}
                        <button
                            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-12 py-5 rounded-2xl font-extrabold text-2xl transition-all duration-300 shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
                            disabled={selectedSeats.length !== count || isProcessing || statusMessage.includes('Confirmed') || statusMessage.includes('Updated')}
                            onClick={handleProceed}
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                    Processing...
                                </div>
                            ) : (
                                isUpdateMode ? `Update & Pay ₹${amountToPay}` : `Pay ₹${amountToPay}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SeatSelection;