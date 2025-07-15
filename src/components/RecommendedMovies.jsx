import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import axios from "axios";

const RecommendedMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // You'll need to create this API endpoint in your backend (e.g., GET /api/movies)
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/movies/all`);
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching recommended movies:", error);
      }
    };

    fetchMovies();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  return (
    <section className="px-8 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recommended Movies</h2>
        <a href="#" className="text-red-500 font-medium">See All &gt;</a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-10">
        {movies.map((movie) => (
          // Assuming the API response provides an 'id' for each movie
          // Mapping database fields (movie_name, image_url) to component props (title, poster)
          <MovieCard key={movie.id} id={movie.id} title={movie.movieName} poster={movie.imageUrl} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedMovies;
