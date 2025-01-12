import React, { useEffect, useRef, useState } from 'react';
import './ProjectCarousel.css';

function ProjectCarousel({ images }) {
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollInterval;

    if (carousel && !isPaused) {
      scrollInterval = setInterval(() => {
        carousel.scrollLeft += 1; 
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0; 
        }
      }, 20); 
    }

    return () => clearInterval(scrollInterval);
  }, [isPaused]);

  const infiniteImages = [...images, ...images];

  return (
    <div
      className="carousel"
      ref={carouselRef}
      onMouseEnter={() => setIsPaused(true)} 
      onMouseLeave={() => setIsPaused(false)} 
    >
      <div className="carousel-content">
        {infiniteImages.map((image, index) => (
          <div className="carousel-slide" key={index}>
            <img src={image} alt={`Slide ${index + 1}`} className="carousel-image" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectCarousel;
