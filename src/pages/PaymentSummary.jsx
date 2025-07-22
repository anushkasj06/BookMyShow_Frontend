import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // bookingDetails will be passed in the location state from the seat selection page
    const [bookingDetails, setBookingDetails] = useState(location.state || {});
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // Destructure details with default values for safety
    const {
        movieName = 'N/A',
        theaterName = 'N/A',
        showTime = 'N/A',
        selectedSeats = [],
        totalAmount = 0,
        ticketEntryDto = {} // This object contains what your backend /ticket/book endpoint needs
    } = bookingDetails;

    // Redirect if essential booking info is missing
    useEffect(() => {
        if (!location.state || !totalAmount || selectedSeats.length === 0) {
            console.error("Booking details are incomplete. Redirecting to home.");
            navigate('/');
        }
    }, [location, navigate, totalAmount, selectedSeats]);

    const handlePayment = async () => {
        setIsLoading(true);
        setStatusMessage('Initiating payment...');

        try {
            // Step 1: Create Razorpay Order
            const orderResponse = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/payment/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount }),
            });

            if (!orderResponse.ok) throw new Error('Failed to create payment order.');
            const orderData = await orderResponse.json();

            // Step 2: Configure Razorpay Checkout
            const options = {
                key: 'YOUR_KEY_ID', // **IMPORTANT**: Replace with your Razorpay Key ID
                amount: orderData.amount,
                currency: 'INR',
                name: 'BookMyShow Clone',
                description: `Tickets for ${movieName}`,
                order_id: orderData.id,
                
                // Step 3: Define payment handler
                handler: async function (response) {
                    setStatusMessage('Verifying payment...');
                    const verificationPayload = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        ticketEntryDto: ticketEntryDto, // Send booking data to backend for booking
                    };

                    console.log('[Payment] Verification payload:', verificationPayload);

                    const verificationResponse = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/payment/verify-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(verificationPayload),
                    });

                    const resultMessage = await verificationResponse.text();
                    if (verificationResponse.ok) {
                        setStatusMessage('Payment Successful! Your ticket is booked.');
                        // Optionally redirect to a success page after a delay
                        // setTimeout(() => navigate('/profile'), 3000); 
                    } else {
                        setStatusMessage(`Payment Failed: ${resultMessage}`);
                    }
                },
                prefill: {
                    name: 'Test User',
                    email: 'test.user@example.com',
                },
                theme: {
                    color: '#F94263',
                },
            };
            
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            paymentObject.on('payment.failed', function (response) {
                setStatusMessage(`Payment Failed: ${response.error.description}`);
            });
        } catch (error) {
            setStatusMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirm Your Booking</h1>
                <div className="space-y-4 my-6">
                    <div className="flex justify-between"><span className="font-semibold text-gray-600">Movie:</span><span className="font-medium text-right">{movieName}</span></div>
                    <div className="flex justify-between"><span className="font-semibold text-gray-600">Theater:</span><span className="font-medium text-right">{theaterName}</span></div>
                    <div className="flex justify-between"><span className="font-semibold text-gray-600">Show Time:</span><span className="font-medium">{showTime}</span></div>
                    <div className="flex justify-between"><span className="font-semibold text-gray-600">Seats:</span><span className="font-medium">{selectedSeats.join(', ')}</span></div>
                    <hr className="my-2"/>
                    <div className="flex justify-between text-xl"><span className="font-bold">Total:</span><span className="font-bold text-red-500">₹{totalAmount}</span></div>
                </div>

                {statusMessage && (
                    <div className={`p-3 rounded-md mb-4 text-center text-sm font-medium ${statusMessage.includes('Successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {statusMessage}
                    </div>
                )}

                <button
                    onClick={handlePayment}
                    disabled={isLoading || statusMessage.includes('Successful')}
                    className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition disabled:bg-gray-400"
                >
                    {isLoading ? 'Processing...' : `Pay ₹${totalAmount}`}
                </button>
            </div>
        </div>
    );
};

export default PaymentSummary;