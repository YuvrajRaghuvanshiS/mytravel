import React, { useState, useEffect } from "react";
import "../styles/home.css";

const slides = [
  {
    image: "images/carousel3.jpg",
    caption: "Travel seamlessly with our platform",
  },
  {
    image: "images/carousel4.jpg",
    caption: "Book flights, trains, and buses in seconds",
  },
  {
    image: "images/carousel2.jpg",
    caption: "Climb the Great Wall of China with us",
  },
  {
    image: "images/carousel5.jpg",
    caption: "Soak all the sun and salt of beaches",
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className="hero-carousel">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`carousel-slide${idx === current ? " active" : ""}`}
          style={{
            backgroundImage: `url(${slide.image})`,
          }}
        >
          {idx === current && (
            <div className="carousel-caption">{slide.caption}</div>
          )}
        </div>
      ))}
      <div className="carousel-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`carousel-dot${idx === current ? " active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
