import React from 'react';
import { ReadinessLevel } from '../../types';

interface ReadinessChipProps {
  readiness: ReadinessLevel;
  size?: 'sm' | 'md';
}

export const ReadinessChip: React.FC<ReadinessChipProps> = ({
  readiness,
  size = 'md',
}) => {
  // Ready Now gets mint highlight #4EC69A
  const styles: Record<ReadinessLevel, { container: string; dot: string }> = {
    'Ready Now': {
      container: 'bg-[#4EC69A]/20 text-[#064E3B] border border-[#4EC69A] font-bold shadow-xs',
      dot: 'bg-[#047857]',
    },
    '1-2 Years': {
      container: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium',
      dot: 'bg-emerald-500',
    },
    '3-5 Years': {
      container: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
      dot: 'bg-slate-400',
    },
  };

  const current = styles[readiness] || styles['3-5 Years'];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md ${current.container} ${sizeClasses} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} shrink-0`} />
      <span>{readiness}</span>
    </span>
  );
};
