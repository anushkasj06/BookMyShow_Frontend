import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ poster, title }) => (
  <Link to="/movie/1" className="w-48 flex-shrink-0 block hover:scale-105 transition-transform">
    <img
      src={poster}
      alt={title}
      className="rounded-lg w-full h-72 object-cover shadow"
    />
    <div className="mt-2 text-center font-semibold">{title}</div>
  </Link>
);

export default MovieCard;
