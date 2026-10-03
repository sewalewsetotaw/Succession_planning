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
    <aside className="w-64 bg-white flex flex-col shrink-0 min-h-screen border-r border-gray-100 select-none">
      {/* Brand Header */}
      <div className="pt-8 pb-6 px-6 flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-[#147B5A]" />
        <h2 className="text-xl font-bold tracking-tight text-[#147B5A] truncate">
          Succession
        </h2>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 py-2 overflow-y-auto space-y-1">
        {mainNavItems.map((item) => {
          const active = isNavActive(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-[90%] flex items-center justify-between pl-6 pr-4 py-3 rounded-r-full text-sm font-medium transition-all duration-150 group cursor-pointer ${
                active
                  ? 'bg-[#147B5A] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    active
                      ? 'bg-white text-[#147B5A]'
                      : item.badgeAlert
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-500'
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
