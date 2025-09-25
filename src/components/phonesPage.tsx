"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Eye, 
  Zap, 
  Calendar, 
  DollarSign, 
  ChevronRight,
  Star,
  Smartphone
} from "lucide-react";
import { Phone } from "@/lib/types";

// Modern PhoneCard component with animations
const PhoneCard = ({ phone }: { phone: Phone }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const { id, name, slug, releaseDate, launchPrice, brand, primaryImage, colors, ratings, viewCount } = phone;

  // Generate gradient background from phone colors
  const getGradient = () => {
    
    if (!colors || colors.length === 0) {
      return 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)';
    }
   
    const color1 = colors[0].hexCode;
    const color2 = colors.length > 1 ? colors[1].hexCode : '#ffffff';
    
    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
  };

  const gradientStyle = {
    background: getGradient(),
  };
  if(colors){
  console.log("from phone:"+colors[0].hexCode + colors[1].hexCode);
  }
  

  // Format price with currency symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div 
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient background with shine effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.2) 100%)",
          transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
          transition: "transform 0.7s ease-in-out"
        }}
      />
      
      {/* Card content */}
      <Link href={`/phones/${id}-${slug}`} className="block">
        {/* Image container with gradient background */}
        <div 
          className="relative h-50 overflow-hidden flex items-center justify-center p-6"
          style={gradientStyle}
        >
          {/* Phone image with loading animation */}
          <div className="relative w-full h-25 transition-all duration-700 group-hover:scale-110">
            <img
              alt={name}
              src={primaryImage ?? "/next.svg"}
              width={200}
              className={`object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
            )}
          </div>
          
          {/* Status badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {phone.status === 'UPCOMING' && (
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                Upcoming
              </div>
            )}
            {phone.status === 'DISCONTINUED' && (
              <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                Discontinued
              </div>
            )}
          </div>
          
          {/* View count badge */}
          <div className="absolute bottom-3 right-3 flex items-center bg-[var(--primary)] text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:bg-black/90">
            <Eye className="w-3.5 h-3.5 mr-1" />
            <span>{viewCount?.toLocaleString() || 0}</span>
          </div>
        </div>
        
        {/* Content section */}
        <div className="p-5">
          {/* Brand name */}
          <div className="flex items-center mb-2">
            {brand?.logo && (
              <div className="relative w-10 h-10 mr-2">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{height:"35px"}}
                  className="object-cover"
                />
              </div>
            )}
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {brand?.name}
            </span>
          </div>
          
          {/* Phone name */}
          <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </h3>
          
          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 w-full">
            <div className="flex items-center justify-start text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-1.5 text-pink-600" />
              <span>{formatDate(releaseDate)}</span>
            </div>
            
            <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-300">
              <DollarSign className="w-4 h-4 mr-1.5 text-pink-600" />
              <span>{launchPrice ? launchPrice : 'TBA'}</span>
            </div>
            
            {ratings && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 mr-1.5 text-yellow-500 fill-yellow-500" />
                <span>{ratings.value}/5</span>
              </div>
            )}
          </div>
          
          {/* CTA button with slide animation */}
          <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View details</span>
              <div className="relative w-5 h-5">
                <ChevronRight className="w-5 h-5 text-pink-600 transition-all duration-300 group-hover:translate-x-6 group-hover:opacity-0" />
                <ChevronRight className="absolute top-0 -left-6 w-5 h-5 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:translate-x-6" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Phones grid component with filtering capabilities
const Phones = ({ phones, isLoading = false }: { phones: Phone[], isLoading?: boolean }) => {
  const [displayedPhones, setDisplayedPhones] = useState<Phone[]>([]);
  
  // Animation for loading new phones
  useEffect(() => {
    if (phones.length > 0) {
      setDisplayedPhones(phones);
    }
  }, [phones]);

  // Skeleton loading cards
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="h-64 bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-5 space-y-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!displayedPhones || displayedPhones.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No phones found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Latest Phones <span className="text-blue-600">({displayedPhones.length})</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {displayedPhones.map((phone, index) => (
          <div 
            key={phone.id} 
            className="transition-all duration-500 ease-out"
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
            }}
          >
            <PhoneCard phone={phone} />
          </div>
        ))}
      </div>
      
      {/* CSS animations */}
      {/* <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style> */}
    </div>
  );
};

export { PhoneCard, Phones };