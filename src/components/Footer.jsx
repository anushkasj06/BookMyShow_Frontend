import React from "react";

const Footer = () => (
  <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-gray-600 text-sm">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
      <div>
        &copy; {new Date().getFullYear()} BookMyShow Clone. All rights reserved.
      </div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-red-500">ListYourShow</a>
        <a href="#" className="hover:text-red-500">Corporates</a>
        <a href="#" className="hover:text-red-500">Offers</a>
        <a href="#" className="hover:text-red-500">Gift Cards</a>
      </div>
    </div>
  </footer>
);

export default Footer; 