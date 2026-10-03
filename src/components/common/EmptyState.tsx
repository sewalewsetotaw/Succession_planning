import React from 'react';
import { LucideIcon, FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = FolderSearch,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 my-4">
      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#047857] flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-[#0B1F18] mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#047857] hover:bg-[#064E3B] rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[#047857]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
