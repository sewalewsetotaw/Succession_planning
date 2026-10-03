import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number; // 1 to 5
  onChange?: (val: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  readOnly = false,
  size = 'md',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="inline-flex items-center gap-1" role="radiogroup">
      {Array.from({ length: max }, (_, i) => {
        const starNum = i + 1;
        const isFilled = starNum <= displayValue;

        if (readOnly) {
          return (
            <Star
              key={starNum}
              className={`${starSizeClasses} ${
                isFilled
                  ? 'fill-[#047857] text-[#047857]'
                  : 'text-slate-200 fill-slate-50'
              }`}
            />
          );
        }

        return (
          <button
            key={starNum}
            type="button"
            onClick={() => onChange?.(starNum)}
            onMouseEnter={() => setHoverValue(starNum)}
            onMouseLeave={() => setHoverValue(null)}
            className="p-0.5 rounded transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#047857]"
            title={`Rate ${starNum} out of ${max}`}
          >
            <Star
              className={`${starSizeClasses} ${
                isFilled
                  ? 'fill-[#047857] text-[#047857]'
                  : 'text-slate-300 fill-transparent hover:text-slate-400'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
