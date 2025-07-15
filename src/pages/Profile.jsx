import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
    const username = localStorage.getItem("username") || "Guest";
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

    if (!userData && !error) {
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
      <div className="bg-gradient-to-br from-pink-100 to-blue-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 text-pink-600">Profile</h1>
            <p className="text-center text-gray-600 mb-8">Welcome, {userData?.name || username}!</p>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {userData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="p-4 border rounded-lg bg-gray-50 transition-shadow hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-lg font-semibold text-gray-800">{userData.name}</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-50 transition-shadow hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500">Username</p>
                    <p className="text-lg font-semibold text-gray-800">{userData.username}</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-50 transition-shadow hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg font-semibold text-gray-800">{userData.email}</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-50 transition-shadow hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-800">{userData.phoneNumber}</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-50 transition-shadow hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="text-lg font-semibold text-gray-800 capitalize">{userData.gender}</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-50 transition-shadow hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500">Age</p>
                    <p className="text-lg font-semibold text-gray-800">{userData.age}</p>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    )
}
