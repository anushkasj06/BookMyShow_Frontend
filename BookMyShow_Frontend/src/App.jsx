import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MovieDetails from "./pages/MovieDetails";
import BookTickets from "./pages/BookTickets";
import SeatSelection from "./pages/SeatSelection";
import BookingSummary from "./pages/BookingSummary";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/movie/:id/book" element={<BookTickets />} />
        <Route path="/movie/:id/book/seats" element={<SeatSelection />} />
        <Route path="/booking-summary" element={<BookingSummary />} />
      </Routes>
    </Router>
  );
}

export default App;
