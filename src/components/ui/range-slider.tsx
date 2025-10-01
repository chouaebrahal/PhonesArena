'use client';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

export function RangeSlider({ min, max, value, onChange, step = 1 }: RangeSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const newValue = Number(e.target.value);
    const newValues: [number, number] = [...value] as [number, number];
    newValues[index] = newValue;

    // Ensure min <= max
    if (index === 0 && newValue > value[1]) {
      newValues[1] = newValue;
    } else if (index === 1 && newValue < value[0]) {
      newValues[0] = newValue;
    }

    onChange(newValues);
  };

  return (
    <div className="relative pt-6">
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-full bg-indigo-600 rounded-full"
          style={{
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((value[1] - min) / (max - min)) * 100}%`
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value[0]}
        step={step}
        onChange={e => handleChange(e, 0)}
        className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value[1]}
        step={step}
        onChange={e => handleChange(e, 1)}
        className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
      />
    </div>
  );
}
