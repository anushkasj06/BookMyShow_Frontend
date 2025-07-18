import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MovieDetails from "./pages/MovieDetails";
import BookTickets from "./pages/BookTickets";
import SeatSelection from "./pages/SeatSelection";
import BookingSummary from "./pages/BookingSummary";
import Profile from "./pages/Profile";
import AdminSignup from "./pages/AdminSignup";
import AdminAddMovie from "./pages/AdminAddMovie";
import SearchResults from "./components/SearchResults"
import AdminMovieList from "./pages/AdminMovieList";
import AdminDashboard from "./pages/AdminDashboard";
import axios from "axios";

export const UserContext = createContext();
export const AdminContext = createContext();
import AdminAddTheater from "./pages/AdminAddTheater";
import AdminTheaterList from "./pages/AdminTheaterList";
import AdminTheaterSeats from "./pages/AdminTheaterSeats";
import AdminAddShow from "./pages/AdminAddShow";
import AdminShowList from "./pages/AdminShowList";
import AssociateShowSeats from "./components/AssociateShowSeats";



function App() {

  const ProtectedRoute = ({ element, ...rest }) => {
    return (localStorage.getItem("token")) ? element : <Navigate to="/login" />
  }

  const AdminProtectedRoute = ({ element, ...rest }) => {
    if(localStorage.getItem("role") == "USER"){
      alert("You are not an admin!");
      return <Navigate to="/" />
    }
    return (localStorage.getItem("role") == "ADMIN") ? element : <Navigate to="/login" />
  }

  const ReloginProtectedRoute = ({ element, ...rest }) => {
    return (localStorage.getItem("token")) ? <Navigate to="/" /> : element
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);


  return (
    <UserContext.Provider value={[null, null]}>
      <AdminContext.Provider value={[null, null]} >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<ReloginProtectedRoute element = {<Login />} />} />
            <Route path="/signup" element={<ReloginProtectedRoute element = {<Signup />} />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/movie/:id/book" element={<ProtectedRoute element = {<BookTickets />} />} />
            <Route path="/movie/:id/book/seats" element={<ProtectedRoute element = {<SeatSelection />} />} />
            <Route path="/booking-summary" element={<ProtectedRoute element = {<BookingSummary />} />} />
            <Route path="/profile" element={<ProtectedRoute element = {<Profile />}/>} />
            <Route path="/admin/signup" element={<AdminProtectedRoute element = {<AdminSignup />} /> } />
            <Route path="/admin/add-movie" element={<AdminProtectedRoute element = {<AdminAddMovie />}/>} />
            <Route path="/admin/movies" element={<AdminProtectedRoute element = {<AdminMovieList />} />} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute element = {<AdminDashboard />} />} />
            <Route path="/admin/add-theater" element={<AdminProtectedRoute element = {<AdminAddTheater/>} />} />
            <Route path="/admin/theaters" element={<AdminProtectedRoute element = {<AdminTheaterList/>} />} />
            <Route path="/admin/theaters/:theaterId/seats" element={<AdminProtectedRoute element = {<AdminTheaterSeats/>} />} />
            <Route path="/admin/add-show" element={<AdminProtectedRoute element = {<AdminAddShow/>} />} />
            <Route path="/admin/shows" element={<AdminProtectedRoute element = {<AdminShowList/>} />} />
            <Route path="/movies/search-results" element={<SearchResults />} /> 
            <Route path="/admin/show-list" element={<AdminProtectedRoute element = {<AdminShowList/>} />} />
            <Route path="/admin/associate-seats/:showId" element={<AdminProtectedRoute element = {<AssociateShowSeats/>} />} /> {/* New Route */}
          </Routes>
        </Router>
      </AdminContext.Provider>
    </UserContext.Provider>
  );
}

export default App;


/**

SAMPLE MOVIES INSERTION SQL:   (NOTES: Movie Description, Reviews - attributes needed)

INSERT INTO movies (movie_name, image_url, genre, language, duration, rating, release_date) VALUES
('Jurassic World', 'https://m.media-amazon.com/images/I/A1P7N8O3OwL._UF1000,1000_QL80_.jpg', 'ACTION', 'ENGLISH', 124, 7.8, '2015-06-12'),
('Metro In Dino', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/64/Metro..._In_Dino_poster.jpg/250px-Metro..._In_Dino_poster.jpg', 'ROMANTIC', 'HINDI', 145, 7.5, '2024-11-29'),
('Taare Zameen Par', 'https://miro.medium.com/v2/resize:fit:736/1*SB0FRxOlWv_Tz9nH3BWueQ.jpeg', 'DRAMA', 'HINDI', 165, 8.4, '2007-12-21'),
('Formula 1', 'https://upload.wikimedia.org/wikipedia/en/4/44/F1_The_Movie_Theatrical_Poster.jpg', 'SPORTS', 'ENGLISH', 130, 8.0, '2025-06-25'),
('Adipurush', 'https://m.media-amazon.com/images/M/MV5BMjA2ODRkMGUtNzUxNC00MmM5LTk3YjQtNTkxNTFlNzFiMjNiXkEyXkFqcGc@._V1_.jpg', 'HISTORICAL', 'HINDI', 179, 3.1, '2023-06-16'),
('Oppenheimer', 'https://resizing.flixster.com/dV1vfa4w_dB4wzk7A_VzThWUWw8=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzEyZDMyYjZmLThmNzAtNDliNC1hMjFmLTA2ZWY4M2UyMjJhMi5qcGc=', 'DRAMA', 'ENGLISH', 180, 8.6, '2023-07-21'),
('Avengers: Endgame', 'https://www.themoviedb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg', 'ACTION', 'ENGLISH', 181, 8.4, '2019-04-26'),
('Barbie', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1bAgxczN489AATU6yZQquEbLwLgcXzRSSXQ&s', 'COMEDY', 'ENGLISH', 114, 6.9, '2023-07-21'),
('12th Fail', 'https://m.media-amazon.com/images/M/MV5BNTE3OTIxZDYtNjA0NC00N2YxLTg1NGQtOTYxNmZkMDkwOWNjXkEyXkFqcGc@._V1_.jpg', 'SOCIAL', 'HINDI', 147, 9.2, '2023-10-27'),
('Animal', 'https://m.media-amazon.com/images/I/61OmlO9stnL._UF1000,1000_QL80_.jpg', 'ACTION', 'HINDI', 201, 6.5, '2023-12-01');



 Theater MYSQL DATABASE CODE: ()

 INSERT INTO Theaters(name, address, city, number_of_screens) VALUES
 ("INOX Megaplex: Phoenix Mall of the Millennium", "Phoenix Mall, Viman Nagar, Pune", "Pune", 10),
 ("City Pride: Kothrud", "Kothrud, Pune", "Pune", 5),
 ("Cinepolis: Seasons Mall, Pune", "Seasons Mall, Magarpatta City, Pune", "Pune", 8),
 ("PVR: Phoenix Market City, Pune", "Phoenix Market City, Viman Nagar, Pune", "Pune", 12);



 Shows MYSQL DATABASE CODE: (NOTES: Ticket Cancellable - attribute needed)

 INSERT INTO Shows(movie_id, theatre_id, date, time) VALUES
 (3, 5, '2025-07-20', '19:15:00'),
 (3, 5, '2025-07-20', '20:15:00'),
 (3, 5, '2025-07-20', '21:30:00'),
 (3, 5, '2025-07-20', '22:30:00'),
 (3, 5, '2025-07-20', '23:30:00'),
 (3, 2, '2025-07-20', '18:45:00'),
 (3, 2, '2025-07-20', '22:15:00'),
 (3, 3, '2025-07-20', '18:45:00'),
 (3, 3, '2025-07-20', '20:00:00'),
 (3, 3, '2025-07-20', '22:00:00'),
 (3, 4, '2025-07-20', '18:45:00'),
 (3, 4, '2025-07-20', '20:00:00'),
 (3, 4, '2025-07-20', '22:00:00'),
 (3, 4, '2025-07-20', '23:15:00'),
 (4, 5, '2025-07-19', '19:15:00'),
 (4, 5, '2025-07-19', '20:15:00'),
 (4, 5, '2025-07-19', '21:30:00'),
 (4, 5, '2025-07-19', '22:30:00'),
 (4, 5, '2025-07-19', '23:30:00'),
 (4, 2, '2025-07-19', '18:45:00'),
 (4, 2, '2025-07-19', '22:15:00'),
 (4, 3, '2025-07-19', '18:45:00'),
 (4, 3, '2025-07-19', '20:00:00'),
 (4, 3, '2025-07-19', '22:00:00'),
 (4, 4, '2025-07-19', '18:45:00'),
 (4, 4, '2025-07-19', '20:00:00'),
 (4, 4, '2025-07-19', '22:00:00'),
 (4, 4, '2025-07-19', '23:15:00');



 Theater-seats MSQL:

 INSERT INTO theater_seats(theater_id, row_label, seat_count, seat_type) VALUES
 (5, 'J', 12, 'PREMIUM'),
 (5, 'I', 8, 'PREMIUM'),
 (5, 'H', 8, 'PREMIUM'),
 (5, 'G', 8, 'CLASSICPLUS'),
 (5, 'F', 8, 'CLASSICPLUS'),
 (5, 'E', 8, 'CLASSICPLUS'),
 (5, 'D', 8, 'CLASSICPLUS'),
 (5, 'C', 8, 'CLASSIC'),
 (5, 'B', 8, 'CLASSIC'),
 (5, 'A', 8, 'CLASSIC');


 FOR Show-seats call shows/associateShowSeats API with the following data:
 {
 "showId": 1,
 "priceOfPremiumSeat": 300,
 "priceOfClassicPlusSeat": 250,
 "priceOfClassicSeat": 200
}
 */