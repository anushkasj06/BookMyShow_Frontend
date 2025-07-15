import React from "react";

const banners = [
  "https://img.freepik.com/free-vector/online-cinema-banner-with-open-clapper-board-film-strip_1419-2242.jpg?semt=ais_hybrid&w=740",
  "https://collider.com/wp-content/uploads/the-avengers-movie-poster-banners-04.jpg",
  
  "https://dynamic.brandcrowd.com/template/preview/design/0a09f46f-b5d9-4f5f-8eaf-4db0426646ac?v=4&designTemplateVersion=1&size=design-preview-standalone-1x"

];

const BannerCarousel = () => (
  <div className="w-full overflow-x-auto flex gap-4 py-4 px-2">
    {banners.map((url, idx) => (
      <img
        key={idx}
        src={url}
        alt={`Banner ${idx + 1}`}
        className="rounded-lg w-[610px] h-[200px] object-cover flex-shrink-0"
      />
    ))}
  </div>
);

export default BannerCarousel;