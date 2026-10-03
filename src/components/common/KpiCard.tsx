import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  highlightAlert?: boolean;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  highlightAlert = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`w-full text-left bg-white border ${
        highlightAlert ? 'border-red-300 ring-1 ring-red-200' : 'border-[#E5E7EB]'
      } rounded-[16px] p-5 shadow-xs transition-all duration-200 ${
        onClick
          ? 'hover:shadow-md hover:border-emerald-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#047857]'
          : 'cursor-default'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div
            className={`p-2 rounded-lg shrink-0 ${
              highlightAlert ? 'bg-red-50 text-[#DC2626]' : 'bg-emerald-50 text-[#047857]'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span
          className={`font-mono text-3xl font-bold tracking-tight tabular-nums ${
            highlightAlert ? 'text-[#DC2626]' : 'text-[#0B1F18]'
          }`}
        >
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium inline-flex items-center gap-0.5 ${
              trend.direction === 'up'
                ? 'text-emerald-700'
                : trend.direction === 'down'
                ? 'text-red-700'
                : 'text-slate-500'
            }`}
          >
            <span>{trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '•'}</span>
            <span>{trend.label}</span>
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 line-clamp-1">
          {subtitle}
        </p>
      )}
    </button>
  );
};
