import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const ViewTicketModel = ({ isOpen, onClose, ticket, userdata }) => {
  if (!isOpen) return null;

  const [downloadText, setDownloadText] = useState("Download Ticket");

  const qrticketData = `
Ticket ID: ${ticket.ticketId}, 
Movie: ${ticket.movie.movieName}, 
Theater: ${ticket.theater.name}, 
Date: ${new Date(ticket.date).toLocaleDateString()}, 
Time: ${ticket.time}, 
Seat Number: ${ticket.seatNo}, 
Fare: ₹${ticket.fare}, 
User Name: ${userdata?.name}, 
User Email: ${userdata?.email}, 
User Phone Number: ${userdata?.phoneNumber}, 
User Gender: ${userdata?.gender}, 
User Age: ${userdata?.age} \n\n
© 2025 BookMyShow - Booked At:${new Date(ticket.bookedAt).toLocaleDateString()}`

  const handleDownload = () => {
    setDownloadText("Downloading...");
    const ticketElement = document.getElementById('ticket-to-download');
    if (ticketElement) {
      html2canvas(ticketElement, { scale: 4, useCORS: true }) // Using scale for better resolution and enabling CORS
        .then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
          });
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`ticket-${ticket.ticketId}.pdf`);
        });
    }
    setTimeout(() => {
      setDownloadText("Download Ticket");
    }, 3000);
  };

  return (
    // Virtual ticket with download option

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg relative border-2 border-blue-400">
        <button
          className="absolute top-2 right-4 text-3xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Your Ticket</h2>
          <div id="ticket-to-download" className="border-2 border-gray-400 rounded-lg p-6 w-full mb-6 bg-gradient-to-br from-blue-100 to-blue-100 relative">
            {/* Header Section */}
            <div className="absolute inset-0" style={{ backgroundImage: `url(${ticket.movie.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }}></div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col items-start">
                <img src={ticket.movie.imageUrl} alt="Movie Poster" className="h-48 w-32 object-cover rounded-lg shadow-md" crossOrigin="anonymous" />
              </div>
              <div className="text-right bg-white p-4 rounded-lg shadow-md w-fit h-fit ml-2">
                <p className="text-2xl font-bold text-green-800">{ticket.movie.movieName}</p>
                <p className="text-md text-gray-700">{ticket.theater.name}</p>
                <p className="text-sm font-bold text-gray-600">Show Date: {new Date(ticket.date).toLocaleDateString()}</p>
                <p className="text-sm font-bold text-gray-600">Show Time: {ticket.time}</p>
              </div>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-2 gap-4 mb-4 bg-white p-4 rounded-lg shadow-md">
              <div><span className="text-sm font-medium text-gray-600">Name:</span> <span className="text-sm">{userdata?.name}</span></div>
              <div><span className="text-sm font-medium text-gray-600">Seat:</span> <span className="font-semibold">{ticket.seatNo}</span></div>
              <div><span className="text-sm font-medium text-gray-600">Ticket ID:</span> <span className="text-sm">{ticket.ticketId}</span></div>
              <div><span className="text-sm font-medium text-gray-600">Price:</span> <span className="text-lg font-bold text-green-700">₹{ticket.fare}</span></div>
            </div>
            <div className='flex flex-row items-center justify-center gap-4 mt-4'>
            <div className="flex bg-white p-1 rounded-lg shadow-md w-fit h-fit border-4 border-blue-700">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrticketData}`} alt="QR Code" className="w-30 h-30 rounded-md" />
            </div>
            <div className="bg-green-100 border border-green-400 rounded-lg px-4 py-4 w-fit text-center">
              <div className="text-md font-semibold text-green-700 mb-2">Enjoy your show!</div>
              <div className="text-sm text-green-600">Show this ticket at the theatre entrance as your ticket.</div>
              
            </div>
            </div>
            {/* Copyright */}
            <p className="text-xs text-gray-500 mt-4 text-center">© 2025 BookMyShow - Booked At: {new Date(ticket.bookedAt).toLocaleDateString()}</p>
          </div>
          <button
            className="w-full bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition text-lg"
            onClick={handleDownload}
          >
            {downloadText}
          </button>
        </div>
      </div>
    </div>
  );
};


export default function Profile() {
  const username = localStorage.getItem("username") || "Guest";
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [bookedTickets, setBookedTickets] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/signup/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate('/login');
        } else {
          setError('Error fetching user data. Please try again later.');
        }
      }
    };

    fetchUserData();
  }, [username, navigate]);

  useEffect(() => {
    const fetchBookedTickets = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/ticket/user/${userData?.id}/active`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBookedTickets(response.data);
        //reverse the array
        setBookedTickets(response.data.reverse());
      } catch (error) {
        console.error("Error fetching booked tickets:", error);
      }
    };
    fetchBookedTickets();
  }, [userData]);



  if (!userData && !error && !bookedTickets) {
    return (
      <div className="bg-gradient-to-br from-pink-100 to-blue-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-16 py-12">
        <div className="w-full max-w-5xl">
          {/* Profile Header */}
          <div className="flex items-center gap-8 mb-12 border-b-4 border-pink-200 pb-8">
            {/* Profile Avatar */}
            <div className="w-32 h-32 rounded-full bg-pink-500 flex items-center justify-center text-white text-6xl font-extrabold shadow-lg border-4 border-white">
              {userData?.name ? userData.name[0].toUpperCase() : username[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-red-600 mb-2">{userData?.name || username}</h1>
              <p className="text-lg text-gray-600">Welcome to your BookMyShow profile!</p>
            </div>
          </div>
          {/* Profile Details */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {userData && (
            <div className="grid grid-cols-3 gap-8 mb-16">
              <div className="p-6 rounded-xl bg-pink-50 border-2 border-pink-200 shadow">
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-xl font-bold text-red-600">{userData.username}</p>
              </div>
              <div className="p-6 rounded-xl bg-pink-50 border-2 border-pink-200 shadow">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-xl font-bold text-red-600">{userData.email}</p>
              </div>
              <div className="p-6 rounded-xl bg-pink-50 border-2 border-pink-200 shadow">
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="text-xl font-bold text-red-600">{userData.phoneNumber}</p>
              </div>
              <div className="p-6 rounded-xl bg-pink-50 border-2 border-pink-200 shadow">
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="text-xl font-bold text-red-600 capitalize">{userData.gender}</p>
              </div>
              <div className="p-6 rounded-xl bg-pink-50 border-2 border-pink-200 shadow">
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="text-xl font-bold text-red-600">{userData.age}</p>
              </div>
            </div>
          )}
          {/* Booked Tickets */}
          {bookedTickets && (
            <div className="mt-8">
              <h2 className="text-2xl font-extrabold mb-8 text-red-600 flex items-center gap-2">
                <span className="text-3xl">🎟️</span> Your Booked Tickets
              </h2>
              {bookedTickets.length > 0 ? (
                <div className="grid grid-cols-2 gap-8">
                  {bookedTickets.map((ticket) => (
                    <div key={ticket.ticketId} className="bg-white p-6 rounded-2xl shadow-xl border-2 border-pink-200 hover:scale-[1.01] transition-transform duration-200 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                      <div className="flex flex-col gap-2">
                        <p className="text-xl font-bold text-red-600">{ticket.movie.movieName}</p>
                        <p className="text-base text-gray-600">{ticket.theater.name}</p>
                        <p className="text-base text-gray-600">Show Date: {new Date(ticket.date).toLocaleDateString()}</p>
                        <p className="text-base text-gray-600">Show Time: {ticket.time}</p>
                        <p className="text-base text-gray-600">Seat Number: {ticket.seatNo}</p>
                        <p className="text-base text-gray-600">Fare: ₹{ticket.fare}</p>
                        <p className="text-base text-gray-600">Booked At: {new Date(ticket.bookedAt).toLocaleDateString()}</p>
                      </div>
                      <button className="mt-4 text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded shadow font-bold hover:from-pink-500 hover:to-red-500 transition-all">View Ticket</button>
                    </div>))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No active tickets found.</p>
              )}
            </div>
          )}
        </div>
        {selectedTicket && (
          <ViewTicketModel
            isOpen={!!selectedTicket}
            onClose={() => setSelectedTicket(null)}
            ticket={selectedTicket}
            userdata={userData}
          />
        )}
      </div>
      <Footer />
    </div>
  )
}