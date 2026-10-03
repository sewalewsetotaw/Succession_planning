import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showDot = true,
}) => {
  // Semantic risk colors: Critical = Red #DC2626, High = Orange #EA580C, Medium = Amber #D97706, Low = Green #16A34A, Not assessed = Grey #9CA3AF
  const stylesMap: Record<RiskLevel, { bg: string; text: string; dot: string; border: string }> = {
    Critical: {
      bg: 'bg-red-50 text-red-700',
      text: 'text-red-700 font-semibold',
      dot: 'bg-[#DC2626]',
      border: 'border-red-200',
    },
    High: {
      bg: 'bg-orange-50 text-orange-800',
      text: 'text-orange-800 font-semibold',
      dot: 'bg-[#EA580C]',
      border: 'border-orange-200',
    },
    Medium: {
      bg: 'bg-amber-50 text-amber-800',
      text: 'text-amber-800 font-semibold',
      dot: 'bg-[#D97706]',
      border: 'border-amber-200',
    },
    Low: {
      bg: 'bg-emerald-50 text-emerald-800',
      text: 'text-emerald-800 font-semibold',
      dot: 'bg-[#16A34A]',
      border: 'border-emerald-200',
    },
    'Not assessed': {
      bg: 'bg-gray-50 text-gray-600',
      text: 'text-gray-600 font-medium',
      dot: 'bg-[#9CA3AF]',
      border: 'border-gray-200',
    },
  };

  const style = stylesMap[level] || stylesMap['Not assessed'];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${style.border} ${style.bg} ${sizeClasses} whitespace-nowrap`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />}
      <span className={style.text}>{level}</span>
    </span>
  );
};
