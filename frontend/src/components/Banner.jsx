import React, { useState, useEffect } from 'react';

const Banner = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative">
      <img
        src={images[currentImageIndex]}
        alt="Banner"
        className="w-full h-80"
      />
    </div>
  );
};

export default Banner;
