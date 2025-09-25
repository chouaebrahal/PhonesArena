'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Phone, PhoneImage } from "@/lib/types";
import { useEffect, useState } from "react";

export default function ImageCarousel({ gallery, name,colors }: Phone) {
   

  const [currentSlide, setCurrentSlide] = useState(0);
    const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index:number) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);



    console.log(gallery);
    console.log(colors);
    let slides : PhoneImage [] = [];
    if(colors && gallery){
      const colorImages = colors.map(c => c.imageUrl); // extract image URLs from colors
      slides = gallery.filter(g => !colorImages.includes(g.url));
      console.log(colorImages);
    }
    
    console.log(slides);
  
  return (
       <div className="relative w-full h-screen overflow-hidden">
      {/* Slides container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`flex-shrink-0 w-full h-full bg-blue-400/30 flex flex-col items-center justify-center text-black relative`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${slide.url})` }}
            ></div>
            
            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                {slide.description}
              </h1>
              {/* <p className="text-xl md:text-2xl text-gray-300 font-light">
                {slide.subtitle}
              </p> */}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[var(--primary)] hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 z-20"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[var(--primary)] hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 z-20"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

