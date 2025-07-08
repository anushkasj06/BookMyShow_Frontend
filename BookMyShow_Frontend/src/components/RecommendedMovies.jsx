import React from "react";
import MovieCard from "./MovieCard";

const movies = [
  {
    title: "Jurassic World",
    poster: "https://m.media-amazon.com/images/I/A1P7N8O3OwL._UF1000,1000_QL80_.jpg"
  },
  {
    title: "Metro In Dino",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/6/64/Metro..._In_Dino_poster.jpg/250px-Metro..._In_Dino_poster.jpg"
  },
  {
    title: "Taare Zameen Par",
    poster: "https://miro.medium.com/v2/resize:fit:736/1*SB0FRxOlWv_Tz9nH3BWueQ.jpeg"
  },
  {
    title: "Formula 1",
    poster: "https://upload.wikimedia.org/wikipedia/en/4/44/F1_The_Movie_Theatrical_Poster.jpg"
  },
  {
    title: "Adipurush",
    poster: "https://m.media-amazon.com/images/M/MV5BMjA2ODRkMGUtNzUxNC00MmM5LTk3YjQtNTkxNTFlNzFiMjNiXkEyXkFqcGc@._V1_.jpg"
  },
  {
    title: "Oppenheimer",
    poster: "https://resizing.flixster.com/dV1vfa4w_dB4wzk7A_VzThWUWw8=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzEyZDMyYjZmLThmNzAtNDliNC1hMjFmLTA2ZWY4M2UyMjJhMi5qcGc="
  },
  {
    title: "Avengers: Endgame",
    poster: "https://www.themoviedb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
  },
  {
    title: "Barbie",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1bAgxczN489AATU6yZQquEbLwLgcXzRSSXQ&s"
  },
  {
    title: "12th Fail",
    poster: "https://m.media-amazon.com/images/M/MV5BNTE3OTIxZDYtNjA0NC00N2YxLTg1NGQtOTYxNmZkMDkwOWNjXkEyXkFqcGc@._V1_.jpg"
  },
  {
    title: "Animal",
    poster: "https://m.media-amazon.com/images/I/61OmlO9stnL._UF1000,1000_QL80_.jpg"
  }
];

const RecommendedMovies = () => (
  <section className="px-8 py-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Recommended Movies</h2>
      <a href="#" className="text-red-500 font-medium">See All &gt;</a>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie, idx) => (
        <MovieCard key={idx} {...movie} />
      ))}
    </div>
  </section>
);

export default RecommendedMovies;
