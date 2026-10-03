import React from 'react';

interface GaugeScoreProps {
  label: string;
  score: number; // 1.0 to 5.0
  maxScore?: number;
  descriptor?: string;
  color?: 'emerald' | 'mint' | 'amber';
}

export const GaugeScore: React.FC<GaugeScoreProps> = ({
  label,
  score,
  maxScore = 5.0,
  descriptor,
  color = 'emerald',
}) => {
  const percentage = (score / maxScore) * 100;
  const strokeColor = color === 'emerald' ? '#047857' : color === 'mint' ? '#4EC69A' : '#D97706';

  // SVG circular arc (180 degree semi-circle)
  const radius = 42;
  const circumference = Math.PI * radius; // half circle circumference
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200 shadow-xs text-center">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </span>
      
      <div className="relative w-28 h-16 flex items-end justify-center overflow-hidden">
        <svg viewBox="0 0 100 55" className="w-full h-full">
          {/* Background Arc */}
          <path
            d="M 8 50 A 42 42 0 0 1 92 50"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Filled Arc */}
          <path
            d="M 8 50 A 42 42 0 0 1 92 50"
            fill="none"
            stroke={strokeColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute bottom-0 inset-x-0 flex flex-col items-center">
          <span className="font-mono text-2xl font-bold text-[#0B1F18] leading-none tabular-nums">
            {score.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">/ {maxScore.toFixed(1)}</span>
        </div>
      </div>

      {descriptor && (
        <span className="mt-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          {descriptor}
        </span>
      )}
    </div>
  );
};
