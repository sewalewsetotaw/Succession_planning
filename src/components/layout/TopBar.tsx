import React from 'react';
import {
  Search,
  AlertOctagon,
} from 'lucide-react';
import { ActiveScreen } from '../../types';
import { Avatar } from '../common/Avatar';

interface TopBarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  zeroSuccessorsCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  onNavigate,
  searchQuery,
  onSearchChange,
  zeroSuccessorsCount,
}) => {
  const getScreenTitle = (screen: ActiveScreen) => {
    switch (screen) {
      case 'dashboard':
        return 'Executive Overview';
      case 'employees':
        return 'Talent Directory';
      case 'employee-detail':
        return 'Employee Profile & Candidacy';
      case 'positions':
        return 'Key & Critical Positions';
      case 'position-detail':
        return 'Position Bench & Successors';
      case 'succession-plans':
        return 'Succession Nominations';
      case 'development-plans':
        return 'Leadership Development Plans';
      case 'nine-box':
        return '9-Box Performance & Potential Matrix';
      case 'org-chart':
        return 'Enterprise Succession Hierarchy';
      case 'talent-risk':
        return 'Comprehensive Talent Risk Audit';
      case 'readiness-timeline':
        return 'Succession Readiness Horizons';
      case 'competency-heatmap':
        return 'Executive Competency Gap Heatmap';
      default:
        return 'Succession Planning';
    }
  };

  return (
    <header className="h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      {/* Zone 1: Breadcrumb & Title */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
          Succession Planning
        </span>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <h1 className="text-sm sm:text-base font-bold text-[#0B1F18] truncate">
          {getScreenTitle(currentScreen)}
        </h1>
      </div>

      {/* Zone 2: Search, Alerts, & Account */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search leaders, titles..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857] transition-all"
          />
        </div>

        {/* Critical alert trigger button */}
        {zeroSuccessorsCount > 0 && (
          <button
            type="button"
            onClick={() => onNavigate('talent-risk')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 text-xs font-bold transition-colors cursor-pointer"
            title={`${zeroSuccessorsCount} critical positions have zero successors`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-[#DC2626] animate-pulse" />
            <span className="font-mono tabular-nums">{zeroSuccessorsCount}</span>
            <span className="hidden xl:inline text-[11px] font-medium">Critical Gaps</span>
          </button>
        )}

        {/* Current user profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <Avatar
            name="Robert Henderson"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
            size="sm"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-[#0B1F18] leading-tight">R. Henderson</div>
            <div className="text-[10px] text-slate-400 font-medium">CEO / Board Sponsor</div>
          </div>
        </div>
      </div>
    </header>
  );
};
