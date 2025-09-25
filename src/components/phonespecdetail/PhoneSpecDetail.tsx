'use client';

import React, { useState, useMemo, useCallback, useEffect } from "react";
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
import { Phone,PhoneImage } from "@/lib/types";
import { PhoneColor } from "@/lib/types";

// Constants
const PRIMARY = "#FF2D55";
const SECONDARY = "#E3F2FD";
const BG_ALT = "#FBFBFD";

const transitionFast = "transition-all duration-800 ease-in-out";
const transitionSlow = "transition-all duration-1000 ease-in-out";

const PhoneSpecDetail: React.FC<Phone> = ({ specifications,gallery ,colors}) => {
  // Animation State
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isContainerVisible, setIsContainerVisible] = useState(false);
  const [areColorsVisible, setAreColorsVisible] = useState(false);
  const [isImageComponentVisible, setIsImageComponentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isRevealed) {
      const timer1 = setTimeout(() => setIsContainerVisible(true), 0); // Image container
      const timer2 = setTimeout(() => setAreColorsVisible(true), 300); // Colors
      const timer3 = setTimeout(() => setIsImageComponentVisible(true), 500); // Image itself
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isRevealed]);

  // UI State
  const [openSpecKey, setOpenSpecKey] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState<PhoneColor | undefined>(() => {
    return colors?.find(color => color.isDefault) || colors?.[0];
  });

  // Memoized values
  const availableColors = useMemo(() => {
    return colors?.filter(color => color.name && color.hexCode).map(color => ({ name: color.name, hexCode: color.hexCode }));
  }, [colors]);

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

  // Callbacks
  const getSpecIcon = useCallback((key: string) => {
    const foundIcon = Object.keys(iconMap).find(k => key.includes(k));
    return foundIcon ? iconMap[foundIcon] : iconMap.default;
  }, [iconMap]);

  const handleColorChange = useCallback((colorOriginal: string) => {
    const newColor = colors?.find(color => color.name === colorOriginal);
    if (newColor) {
      setActiveColor(newColor);
    }
  }, [colors]);

  const toggleSpec = useCallback((key: string) => {
    if (!isRevealed) {
      setIsRevealed(true);
    }
    setOpenSpecKey(prev => (prev === key ? null : key));
  }, [isRevealed]);

  // Early returns and data preparation
  if (!specifications || specifications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG_ALT }}>
        <div className="text-center text-gray-600"><Info className="w-12 h-12 mx-auto mb-4 text-gray-400" /><p className="text-lg">No specifications available.</p></div>
      </div>
    );
  }

  const filteredSpecifications = specifications.filter(spec => !spec.key.toLowerCase().includes('colors'));
  const middleIndex = Math.ceil(filteredSpecifications.length / 2);
  const leftSpecs = filteredSpecifications.slice(0, middleIndex);
  const rightSpecs = filteredSpecifications.slice(middleIndex);

  const renderSpecItem = (spec: typeof leftSpecs[0], index: number, delayOffset = 0) => {
    const Icon = getSpecIcon(spec.key);
    const expanded = openSpecKey === spec.key;
    return (
      <div 
        key={spec.id} 
        className={`transition-all duration-500 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: `${delayOffset + index * 100}ms` }}
      >
        <div className="transition-colors">
          <button onClick={() => toggleSpec(spec.key)} aria-expanded={expanded} className={`w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 group ${transitionFast}`}>
            <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
              <div className={`p-2 md:p-3 rounded-xl transition-colors duration-200 ease-in flex-shrink-0 ${expanded ? "text-black" : "text-white"}`} style={{ backgroundColor: expanded ? SECONDARY : PRIMARY }}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className={`font-semibold text-sm md:text-base ${expanded ? "text-blue-900 font-extrabold" : ""}`} style={{ color: !expanded ? PRIMARY : undefined }}>{spec.key}</div>
                <div className="text-xs md:text-sm text-gray-900 font-bold truncate">{spec.value} {spec.unit}</div>
              </div>
            </div>
            <div className={`${transitionFast} flex-shrink-0 ml-2`}>{expanded ? <ChevronUp className="w-5 h-5" style={{ color: PRIMARY }} /> : <ChevronDown className="w-5 h-5 text-gray-400" />}</div>
          </button>
          <div className={`overflow-hidden ${transitionSlow}`} style={{ maxHeight: expanded ? 500 : 0, opacity: expanded ? 1 : 0 }}>
            <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2">
              <div className="bg-gray-50/80 rounded-xl p-3 md:p-4 mb-4"><p className="text-gray-950 text-xs md:text-sm leading-relaxed">{spec.description}</p></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: BG_ALT, color: "#111" }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className={`lg:grid ${isRevealed ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-6 lg:gap-10 items-start`}>
          
          {/* --- Left Specs Column --- */}
          <div className={`space-y-4 w-full ${isRevealed ? 'lg:order-1' : 'lg:order-1'}`}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-950 p-4 md:p-6 pb-2">Specifications</h3>
              <div className="divide-y divide-gray-100">
                {leftSpecs.map((spec, index) => renderSpecItem(spec, index))}
              </div> 
            </div>
          </div>

          {/* --- Center Image Column (conditionally rendered) --- */}
          {isRevealed && (
            <div className="lg:sticky lg:top-8 space-y-4 md:space-y-6 order-first lg:order-2 w-full lg:col-span-2">
              <div className={`relative rounded-3xl overflow-hidden bg-white shadow-lg aspect-square flex items-center justify-center transition-opacity duration-700 ease-in-out ${isContainerVisible ? 'opacity-100' : 'opacity-0'}`} style={{ minHeight: 320 }}>
                {activeColor && (
                  <div className={`transition-all duration-1000 ease-in-out ${isImageComponentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{width: '100%', height: '100%'}}>
                    <Image src={activeColor.imageUrl} alt={activeColor.name || 'Phone Image'} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
                  </div>
                )}
              </div>
              {availableColors && availableColors.length > 0 && (
                <div className={`bg-white p-4 md:p-6 rounded-2xl shadow-lg transition-opacity duration-700 ease-in-out ${areColorsVisible ? 'opacity-100' : 'opacity-0'}`} style={{transitionDelay: '300ms'}}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Colors</h4>
                  <div className="flex flex-wrap justify-center gap-3">
                    {availableColors.map((color) => {
                      const isSelected = activeColor?.name === color.name;
                      return (
                        <div key={color.name} className="flex flex-col items-center">
                          <button onClick={() => handleColorChange(color.name)} aria-pressed={isSelected} title={color.name} className={`relative w-6 h-6 md:w-8 md:h-8 rounded-full border-2 transition-transform ${isSelected ? "scale-110 ring-2 md:ring-4 ring-offset-1 md:ring-offset-2" : "hover:scale-105"}`} style={{ background: color.hexCode ? color.hexCode : "transparent", borderColor: isSelected ? PRIMARY : "white" }} />
                          <span className="text-xs mt-1 md:mt-2 font-medium text-center max-w-16 truncate" style={{ color: isSelected ? PRIMARY : undefined }}>{color.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- Right Specs Column --- */}
          <div className={`space-y-4 w-full ${isRevealed ? 'lg:order-3' : 'lg:order-2'}`}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <h3 className={`text-lg font-semibold text-gray-950 p-4 md:p-6 pb-2 ${isRevealed ? 'invisible' : ''}`}>Specifications</h3>
              <div className="divide-y divide-gray-100">
                {rightSpecs.map((spec, index) => renderSpecItem(spec, index, leftSpecs.length))}
              </div> 
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default React.memo(PhoneSpecDetail);