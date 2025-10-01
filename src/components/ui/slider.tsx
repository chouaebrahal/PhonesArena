'use client';

import { useEffect, useRef, useState } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export function Slider({ min, max, step = 1, value, onChange, className = '' }: SliderProps) {
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    setIsDragging(index);
    e.preventDefault();
  };

  const calculateValue = (clientX: number): number => {
    const track = trackRef.current;
    if (!track) return 0;

    const rect = track.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percent * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    
    return Math.max(min, Math.min(max, steppedValue));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging === null) return;

      const newValue = calculateValue(e.clientX);
      const newValues: [number, number] = [...value];
      newValues[isDragging] = newValue;

      // Ensure min <= max
      if (isDragging === 0 && newValue > value[1]) {
        newValues[1] = newValue;
      } else if (isDragging === 1 && newValue < value[0]) {
        newValues[0] = newValue;
      }

      onChange(newValues);
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, step, value, onChange]);

  const leftPercent = ((value[0] - min) / (max - min)) * 100;
  const rightPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full h-2 ${className}`}>
      <div
        ref={trackRef}
        className="absolute w-full h-full bg-gray-200 rounded-full"
      >
        <div
          className="absolute h-full bg-indigo-600 rounded-full"
          style={{
            left: `${leftPercent}%`,
            right: `${100 - rightPercent}%`
          }}
        />
        {[0, 1].map((index) => (
          <div
            key={index}
            className="absolute top-1/2 w-4 h-4 -mt-2 -ml-2 bg-white border-2 border-indigo-600 rounded-full cursor-pointer"
            style={{ left: `${index === 0 ? leftPercent : rightPercent}%` }}
            onMouseDown={(e) => handleMouseDown(index, e)}
          />
        ))}
      </div>
    </div>
  );
}
