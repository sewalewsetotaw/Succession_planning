import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GitBranch,
  Target,
  Grid3X3,
  Network,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ActiveScreen } from '../../types';

interface SidebarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  zeroSuccessorsCount: number;
  highFlightRiskCount: number;
  overduePlansCount: number;
}

interface NavItem {
  id: ActiveScreen;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeAlert?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  zeroSuccessorsCount,
  highFlightRiskCount,
  overduePlansCount,
}) => {
  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'positions', label: 'Positions', icon: Briefcase, badge: zeroSuccessorsCount > 0 ? zeroSuccessorsCount : undefined, badgeAlert: true },
    { id: 'succession-plans', label: 'Succession Plans', icon: GitBranch },
    { id: 'development-plans', label: 'Development Plans', icon: Target, badge: overduePlansCount > 0 ? overduePlansCount : undefined, badgeAlert: true },
    { id: 'nine-box', label: '9-Box Grid', icon: Grid3X3 },
    { id: 'org-chart', label: 'Org Chart', icon: Network },
    { id: 'talent-risk', label: 'Talent Risk Report', icon: AlertTriangle, badge: zeroSuccessorsCount + highFlightRiskCount, badgeAlert: true },
    { id: 'readiness-timeline', label: 'Readiness Timeline', icon: Clock },
    { id: 'competency-heatmap', label: 'Competency Heatmap', icon: Sparkles },
  ];

  const isNavActive = (id: ActiveScreen) => {
    if (currentScreen === id) return true;
    if (id === 'employees' && currentScreen === 'employee-detail') return true;
    if (id === 'positions' && currentScreen === 'position-detail') return true;
    return false;
  };

  return (
    <aside className="w-64 bg-[#064E3B] text-white flex flex-col shrink-0 min-h-screen border-r border-emerald-900/40 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-emerald-800/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4EC69A] to-emerald-400 flex items-center justify-center text-[#064E3B] font-extrabold shadow-sm shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#064E3B]" />
        </div>
        <div className="overflow-hidden">
          <h2 className="text-sm font-bold tracking-tight text-white truncate">
            Succession Planning
          </h2>
          <p className="text-[11px] text-emerald-200/70 font-medium truncate">
            Meridian Global Tech
          </p>
        </div>
      </div>

      {/* Main Navigation Items (10 modules) */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
          Executive Modules
        </div>

        {mainNavItems.map((item) => {
          const active = isNavActive(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                active
                  ? 'bg-[#4EC69A] text-[#064E3B] font-bold shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    active ? 'text-[#064E3B]' : 'text-emerald-300 group-hover:scale-105'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    active
                      ? 'bg-[#064E3B] text-white'
                      : item.badgeAlert
                      ? 'bg-[#DC2626] text-white'
                      : 'bg-emerald-800 text-emerald-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
