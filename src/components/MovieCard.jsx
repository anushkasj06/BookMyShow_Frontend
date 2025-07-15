import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ id, poster, title }) => (
  <Link
    to={`/movie/${id}`}
    className="w-50 flex-shrink-0 block transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
  >
    <div className="relative rounded-xl overflow-hidden shadow-lg">
      <img
        src={poster}
        alt={title}
        className="w-full h-72 object-cover transition-transform duration-300 hover:scale-110"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-2 text-white text-center font-semibold text-lg">
        {title}
      </div>
    </div>
  </Link>
);

export default MovieCard;
