import React from 'react';

interface ScoreBarProps {
  label?: string;
  value: number; // 0 to 5, or 0 to 100
  max?: number;
  showValue?: boolean;
  color?: 'emerald' | 'mint' | 'amber' | 'blue' | 'red';
  size?: 'sm' | 'md';
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  label,
  value,
  max = 5,
  showValue = true,
  color = 'emerald',
  size = 'sm',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorClasses = {
    emerald: 'bg-[#047857]',
    mint: 'bg-[#4EC69A]',
    amber: 'bg-[#D97706]',
    blue: 'bg-blue-600',
    red: 'bg-[#DC2626]',
  }[color];

  const heightClasses = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="w-full flex items-center gap-2">
      {label && <span className="text-xs text-slate-500 font-medium shrink-0 min-w-14">{label}</span>}
      <div className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${heightClasses}`}>
        <div
          className={`${heightClasses} ${colorClasses} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="font-mono text-xs font-semibold text-[#0B1F18] tabular-nums shrink-0 w-7 text-right">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};
