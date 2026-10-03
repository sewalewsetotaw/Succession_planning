import React from 'react';
import { CriticalityLevel } from '../../types';

interface CriticalityBadgeProps {
  level: CriticalityLevel;
  score?: number;
  size?: 'sm' | 'md';
}

export const CriticalityBadge: React.FC<CriticalityBadgeProps> = ({
  level,
  score,
  size = 'md',
}) => {
  const styles: Record<CriticalityLevel, { bg: string; text: string; border: string }> = {
    Critical: {
      bg: 'bg-red-50 text-[#DC2626]',
      text: 'text-[#DC2626] font-bold',
      border: 'border-red-200',
    },
    High: {
      bg: 'bg-orange-50 text-[#EA580C]',
      text: 'text-[#EA580C] font-semibold',
      border: 'border-orange-200',
    },
    Medium: {
      bg: 'bg-amber-50 text-[#D97706]',
      text: 'text-[#D97706] font-semibold',
      border: 'border-amber-200',
    },
  };

  const current = styles[level] || styles.Medium;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${current.border} ${current.bg} ${sizeClasses} whitespace-nowrap`}
    >
      <span className={current.text}>{level}</span>
      {score !== undefined && (
        <span className="font-mono text-[11px] opacity-80 pl-1 border-l border-current/25 tabular-nums">
          {score}
        </span>
      )}
    </span>
  );
};
