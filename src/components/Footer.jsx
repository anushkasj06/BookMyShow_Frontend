import React from "react";

const Footer = () => (
  <footer className="backdrop-blur-md bg-white/70 border-t border-red-100/40 mt-5 py-8 px-4 text-center text-gray-600 text-sm shadow-2xl rounded-t-2xl">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="font-semibold text-gray-700 tracking-wide">
        &copy; {new Date().getFullYear()} <span className="text-red-500 font-bold">BookMyShow Clone</span>. All rights reserved.
      </div>
      <div className="flex gap-6">
        <a href="#" className="hover:text-red-500 hover:underline underline-offset-4 transition-colors font-medium px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300">ListYourShow</a>
        <a href="#" className="hover:text-red-500 hover:underline underline-offset-4 transition-colors font-medium px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300">Corporates</a>
        <a href="#" className="hover:text-red-500 hover:underline underline-offset-4 transition-colors font-medium px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300">Offers</a>
        <a href="#" className="hover:text-red-500 hover:underline underline-offset-4 transition-colors font-medium px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300">Gift Cards</a>
      </div>
    </div>
  </footer>
);

export default Footer; 