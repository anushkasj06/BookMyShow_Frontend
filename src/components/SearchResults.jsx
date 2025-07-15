import React from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from './MovieCard';
import Navbar from './Navbar';
import Footer from './Footer';
import RecommendedMovies from './RecommendedMovies';

const SearchResults = () => {
  const location = useLocation();
  const { searchResults, searchQuery } = location.state || { searchResults: [], searchQuery: '' };

  return (
    <div className="min-h-screen from-pink-100 to-blue-100 bg-gradient-to-br flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-12xl mx-auto w-full py-10 px-4">
        <div className="rounded-xl bg-white shadow-xl p-8 mb-10 border-t-8">
          <h2 className="text-3xl font-extrabold mb-6 text-red-500 text-center tracking-tight">
            Search Results for "{searchQuery}"
          </h2>
          {searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.movieName}
                  poster={movie.imageUrl}
                  rating={movie.rating}
                  genre={movie.genre}
                />
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-600 text-center">No movies found matching "{searchQuery}". Please try a different search term.</p>
          )}
        </div>
        {/* Related/Recommended Movies Section */}
        <div className="mt-12">
          <RecommendedMovies />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
