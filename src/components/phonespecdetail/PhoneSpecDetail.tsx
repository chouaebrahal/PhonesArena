'use client';

import React, { useState, useMemo, useCallback } from "react";
import {
  Monitor,
  Calendar,
  Cpu,
  HardDrive,
  Camera,
  DollarSign,
  Zap,
  Info,
  Battery,
  Palette,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

// Types
export interface PhoneImageType {
  id: string;
  url: string;
  color: string | null;
  isPrimary: boolean;
}

export interface SpecificationType {
  id: string;
  key: string;
  value: string;
}

interface PhoneSpecDetailProps {
  specifications: SpecificationType[];
  images: PhoneImageType[];
}

// Constants
const PRIMARY = "#FF2D55";
const SECONDARY = "#E3F2FD";
const BG_ALT = "#FBFBFD";

const transitionFast = "transition-all duration-800 ease-in-out";
const transitionSlow = "transition-all duration-1000 ease-in-out";

const PhoneSpecDetail: React.FC<PhoneSpecDetailProps> = ({ specifications, images }) => {
  // State
  const [openSpecKey, setOpenSpecKey] = useState<string | null>(
    specifications?.[0]?.key || null
  );
  const [activeImage, setActiveImage] = useState<PhoneImageType >(() => {
    return images?.find(img => img.isPrimary) || images?.[0] ;
  });

  // Memoized values
  const availableColors = useMemo(() => {
    return images?.filter(img => img.color).map(img => img.color!) || [];
  }, [images]);

  const iconMap = useMemo<Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>>(() => ({
    Display: Monitor,
    Processor: Cpu,
    'Main Camera': Camera,
    'Front Camera': Camera,
    Storage: HardDrive,
    Battery: Battery,
    OS: Zap,
    ReleaseDate: Calendar,
    Price: DollarSign,
    Colors: Palette,
    default: Info,
  }), []);

  function splitColor(str:string | null):{name:string,hex:string}{
  if(!str){
    return {name:"no color",hex:"no hex"};
  }
  const [name, hex] = str.split(":");
  return { name, hex };
}
  // Callbacks
  const getSpecIcon = useCallback((key: string) => {
    const foundIcon = Object.keys(iconMap).find(k => key.includes(k));
    return foundIcon ? iconMap[foundIcon] : iconMap.default;
  }, [iconMap]);

  const handleColorChange = useCallback((colorOriginal: string) => {
    const newImage = images?.find(img => img.color === colorOriginal);
    if (newImage) {
      setActiveImage(newImage);
    }
  }, [images]);

  const toggleSpec = useCallback((key: string) => {
    setOpenSpecKey(prev => (prev === key ? null : key));
  }, []);

  // Early returns
  if (!specifications || specifications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG_ALT }}>
        <div className="text-center text-gray-600">
          <Info className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">No specifications available.</p>
        </div>
      </div>
    );
  }

  // Create a specification entry for colors to show in the accordion
  const colorSpec = availableColors.length > 0 ? {
    id: 'colors-spec',
    key: 'Colors',
    value: availableColors.map(color => splitColor(color).name).join(', ')
  } : null;

  // Filter out any existing color specification from the main specifications
  const filteredSpecifications = specifications.filter(spec => 
    !spec.key.toLowerCase().includes('color')
  );

  return (
    <div className="min-h-screen" style={{ background: BG_ALT, color: "#111" }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          {/* Left — Accordion */}
          <div className="space-y-4 order-2 lg:order-1 w-full">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-950 p-4 md:p-6 pb-2">
                Specifications
              </h3>
              <div className="divide-y divide-gray-100">
                {/* Render color specification in accordion for large screens */}
                {colorSpec && (
                  <div className="hidden lg:block transition-colors">
                    <button
                      onClick={() => toggleSpec(colorSpec.key)}
                      aria-expanded={openSpecKey === colorSpec.key}
                      className={`w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 group ${transitionFast}`}
                    >
                      <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                        <div 
                          className={`p-2 md:p-3 rounded-xl transition-colors duration-200 ease-in flex-shrink-0 ${
                            openSpecKey === colorSpec.key 
                              ? "text-black" 
                              : "text-white"
                          }`}
                          style={{ 
                            backgroundColor: openSpecKey === colorSpec.key ? SECONDARY : PRIMARY 
                          }}
                        >
                          <Palette className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <div 
                            className={`font-semibold text-sm md:text-base ${
                              openSpecKey === colorSpec.key 
                                ? "text-blue-900 font-extrabold" 
                                : ""
                            }`}
                            style={{ color: openSpecKey !== colorSpec.key ? PRIMARY : undefined }}
                          >
                            {colorSpec.key}
                          </div>
                          <div className="text-xs md:text-sm text-gray-900 font-bold truncate">
                            {colorSpec.value}
                          </div>
                        </div>
                      </div>
                      <div className={`${transitionFast} flex-shrink-0 ml-2`}>
                        {openSpecKey === colorSpec.key ? (
                          <ChevronUp className="w-5 h-5" style={{ color: PRIMARY }} />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    <div 
                      className={`overflow-hidden ${transitionSlow}`} 
                      style={{ 
                        maxHeight: openSpecKey === colorSpec.key ? 500 : 0, 
                        opacity: openSpecKey === colorSpec.key ? 1 : 0 
                      }}
                    >
                      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2">
                        <div className="bg-gray-50/80 rounded-xl p-3 md:p-4 mb-4">
                          <div className="flex flex-wrap justify-center gap-3">
                            {availableColors.map((color) => {
                              const isSelected = activeImage?.color === color;
                              return (
                                <div key={color} className="flex flex-col items-center">
                                  <button
                                    onClick={() => handleColorChange(color)}
                                    aria-pressed={isSelected}
                                    title={color}
                                    className={`relative w-8 h-8 rounded-full border-2 transition-transform ${
                                      isSelected 
                                        ? "scale-110 ring-2 ring-4 ring-offset-1 ring-offset-2" 
                                        : "hover:scale-105"
                                    }`}
                                    style={{ 
                                      background: splitColor(color).hex ? splitColor(color).hex : "transparent", 
                                      borderColor: isSelected ? PRIMARY : "white",
                                    }}
                                  />
                                  <span 
                                    className="text-xs mt-2 font-medium text-center max-w-16 truncate"
                                    style={{ color: isSelected ? PRIMARY : undefined }}
                                  >
                                    {splitColor(color).name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {filteredSpecifications.map((spec) => {
                  const Icon = getSpecIcon(spec.key);
                  const expanded = openSpecKey === spec.key;
                  
                  return (
                    <div key={spec.id} className="transition-colors">
                      <button
                        onClick={() => toggleSpec(spec.key)}
                        aria-expanded={expanded}
                        className={`w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 group ${transitionFast}`}
                      >
                        <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                          <div 
                            className={`p-2 md:p-3 rounded-xl transition-colors duration-200 ease-in flex-shrink-0 ${
                              expanded 
                                ? "text-black" 
                                : "text-white"
                            }`}
                            style={{ 
                              backgroundColor: expanded ? SECONDARY : PRIMARY 
                            }}
                          >
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <div className="text-left min-w-0 flex-1">
                            <div 
                              className={`font-semibold text-sm md:text-base ${
                                expanded 
                                  ? "text-blue-900 font-extrabold" 
                                  : ""
                              }`}
                              style={{ color: !expanded ? PRIMARY : undefined }}
                            >
                              {spec.key}
                            </div>
                            <div className="text-xs md:text-sm text-gray-900 font-bold truncate">
                              {spec.value}
                            </div>
                          </div>
                        </div>
                        <div className={`${transitionFast} flex-shrink-0 ml-2`}>
                          {expanded ? (
                            <ChevronUp className="w-5 h-5" style={{ color: PRIMARY }} />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>
                      
                      <div 
                        className={`overflow-hidden ${transitionSlow}`} 
                        style={{ 
                          maxHeight: expanded ? 500 : 0, 
                          opacity: expanded ? 1 : 0 
                        }}
                      >
                        <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2">
                          <div className="bg-gray-50/80 rounded-xl p-3 md:p-4 mb-4">
                            <p className="text-gray-950 text-xs md:text-sm leading-relaxed">
                              {spec.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right — Main Image & Quick Overview */}
          <div className="lg:sticky lg:top-8 space-y-4 md:space-y-6 order-1 lg:order-2 w-full">
            <div 
              className="relative rounded-3xl overflow-hidden bg-white shadow-lg aspect-square flex items-center justify-center"
              style={{ minHeight: 320 }}
            >
              {activeImage ? (
                <Image 
                  src={activeImage.url} 
                  alt={splitColor(activeImage.color).name || 'Phone Image'} 
                  fill 
                  className="object-conver rotate-[-1] " 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Monitor className="w-16 h-16 mx-auto mb-2" />
                  <p>No image available</p>
                </div>
              )}
            </div>
            
            {/* Show color selector under image for small screens, hide on large screens */}
            {availableColors.length > 0 && (
              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg lg:hidden">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Available Colors
                </h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {availableColors.map((color) => {
                    const isSelected = activeImage?.color === color;
                    return (
                      <div key={color} className="flex flex-col items-center">
                        <button
                          onClick={() => handleColorChange(color)}
                          aria-pressed={isSelected}
                          title={color}
                          className={`relative w-6 h-6 md:w-8 md:h-8 rounded-full border-2 transition-transform ${
                            isSelected 
                              ? "scale-110 ring-2 md:ring-4 ring-offset-1 md:ring-offset-2" 
                              : "hover:scale-105"
                          }`}
                          style={{ 
                            background: splitColor(color).hex ? splitColor(color).hex : "transparent", 
                            borderColor: isSelected ? PRIMARY : "white",
                          }}
                        />
                        <span 
                          className="text-xs mt-1 md:mt-2 font-medium text-center max-w-16 truncate"
                          style={{ color: isSelected ? PRIMARY : undefined }}
                        >
                          {splitColor(color).name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PhoneSpecDetail);