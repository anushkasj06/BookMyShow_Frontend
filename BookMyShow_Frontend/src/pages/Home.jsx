import React from "react";
import Navbar from "../components/Navbar";
import BannerCarousel from "../components/BannerCarousel";
import RecommendedMovies from "../components/RecommendedMovies";
import Footer from "../components/Footer";

const Home = () => (
  <div className="bg-gray-100 min-h-screen flex flex-col min-h-screen">
    <Navbar />
    <BannerCarousel />
    <RecommendedMovies />
    <Footer />
  </div>
);

export default Home;