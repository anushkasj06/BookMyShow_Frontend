import React from "react";

const cities = [
  { name: "Mumbai", icon: "🏙️" },
  { name: "Delhi-NCR", icon: "🏛️" },
  { name: "Bengaluru", icon: "🏢" },
  { name: "Hyderabad", icon: "🏯" },
  { name: "Chandigarh", icon: "🏰" },
  { name: "Ahmedabad", icon: "🏟️" },
  { name: "Chennai", icon: "🏗️" },
  { name: "Pune", icon: "🏯", highlight: true },
  { name: "Kolkata", icon: "🏛️" },
  { name: "Kochi", icon: "🏝️" },
];

const LocationModal = ({ isOpen, onClose, onSelectCity }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
        <button
          className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <input
          type="text"
          placeholder="Search for your city"
          className="w-full border px-4 py-2 rounded mb-4 focus:outline-none"
        />
        <div className="text-red-500 flex items-center gap-2 mb-4 cursor-pointer">
          <span className="text-xl">📍</span> Detect my location
        </div>
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1">
            <div className="font-semibold mb-2">Popular Cities</div>
            <div className="flex flex-wrap gap-6">
              {cities.map((city) => (
                <div
                  key={city.name}
                  className={`flex flex-col items-center cursor-pointer ${city.highlight ? "text-cyan-600" : "text-gray-700"}`}
                  onClick={() => onSelectCity(city.name)}
                >
                  <span className="text-4xl mb-1">{city.icon}</span>
                  <span className="text-sm font-medium">{city.name}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <button className="text-pink-600 font-medium hover:underline">View All Cities</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal; 