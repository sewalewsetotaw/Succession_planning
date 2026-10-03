import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  ShieldAlert,
  ArrowUpDown,
  ChevronRight,
  Plus,
  Info,
  List,
  Columns3,
  Users,
} from 'lucide-react';
import { SignatureBanner } from '../common/SignatureBanner';
import { CriticalityBadge } from '../common/CriticalityBadge';
import { Avatar } from '../common/Avatar';
import { EmptyState } from '../common/EmptyState';
import { Position, CriticalityLevel, ActiveScreen } from '../../types';

interface PositionsScreenProps {
  positions: Position[];
  onSelectPosition: (posId: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenMethodology: () => void;
}

export const PositionsScreen: React.FC<PositionsScreenProps> = ({
  positions,
  onSelectPosition,
  onNavigate,
  onOpenMethodology,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [critFilter, setCritFilter] = useState('All');
  const [zeroOnly, setZeroOnly] = useState(false);

  const departments = ['All', 'Executive', 'Engineering', 'Operations', 'Product', 'Sales', 'Finance', 'People & Culture'];
  const criticalityOptions = ['All', 'Critical', 'High', 'Medium'];

  const kanbanColumns: { level: CriticalityLevel; title: string; scoreBand: string; bg: string; border: string; badge: string; dot: string }[] = [
    {
      level: 'Critical',
      title: 'Critical Band',
      scoreBand: 'Score 80 - 100',
      bg: 'bg-red-50/40',
      border: 'border-red-200',
      badge: 'bg-[#DC2626] text-white',
      dot: 'bg-[#DC2626]',
    },
    {
      level: 'High',
      title: 'High Band',
      scoreBand: 'Score 60 - 79',
      bg: 'bg-orange-50/40',
      border: 'border-orange-200',
      badge: 'bg-[#EA580C] text-white',
      dot: 'bg-[#EA580C]',
    },
    {
      level: 'Medium',
      title: 'Medium Band',
      scoreBand: 'Score 40 - 59',
      bg: 'bg-amber-50/40',
      border: 'border-amber-200',
      badge: 'bg-[#D97706] text-white',
      dot: 'bg-[#D97706]',
    },
  ];

  const filteredPositions = useMemo(() => {
    return positions.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.incumbentName.toLowerCase().includes(search.toLowerCase()) ||
        p.department.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === 'All' || p.department === deptFilter;
      const matchesCrit = critFilter === 'All' || p.criticality === critFilter;
      const matchesZero = !zeroOnly || p.successorsCount === 0;

      return matchesSearch && matchesDept && matchesCrit && matchesZero;
    });
  }, [positions, search, deptFilter, critFilter, zeroOnly]);

  const zeroCount = positions.filter((p) => p.successorsCount === 0).length;

  return (
    <div className="space-y-6">
      <SignatureBanner
        title="Key & Critical Positions"
        subtitle="Successor depth tracking, 7-factor criticality scoring, and bench vulnerability registry."
        badge="Enterprise Risk Governance"
        actions={
          <button
            type="button"
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#047857] hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer focus-ring"
          >
            <Info className="w-4 h-4 text-[#047857]" />
            <span>Critical Position Method</span>
          </button>
        }
      />

      {/* Filter, Search and View Mode Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search key roles or incumbent leaders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle: List vs Kanban */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#047857] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-[#047857] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setZeroOnly(!zeroOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                zeroOnly
                  ? 'bg-red-500 text-white border-red-600 shadow-xs'
                  : 'bg-white text-slate-700 border-gray-200 hover:border-red-300'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-current" />
              <span>Zero Successors Only ({zeroCount})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Criticality Band
            </label>
            <select
              value={critFilter}
              onChange={(e) => setCritFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              {criticalityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end justify-between sm:justify-end pb-1 text-slate-500 font-medium">
            <span>Showing <strong className="font-mono text-slate-900 tabular-nums">{filteredPositions.length}</strong> of {positions.length} critical roles</span>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {kanbanColumns.map((col) => {
            const positionsInCol = filteredPositions.filter((p) => p.criticality === col.level);

            return (
              <div
                key={col.level}
                className={`rounded-2xl border ${col.border} ${col.bg} flex flex-col min-h-[580px] shadow-xs`}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-inherit bg-white/85 rounded-t-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <div>
                      <h3 className="text-xs font-extrabold text-[#0B1F18] uppercase tracking-wider">
                        {col.title}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono">{col.scoreBand}</span>
                    </div>
                  </div>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${col.badge} tabular-nums`}>
                    {positionsInCol.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-3.5 flex-1 space-y-3 overflow-y-auto">
                  {positionsInCol.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-3 text-center text-slate-400 text-xs">
                      No roles in this criticality tier
                    </div>
                  ) : (
                    positionsInCol.map((pos) => {
                      const isZero = pos.successorsCount === 0;

                      return (
                        <div
                          key={pos.id}
                          onClick={() => onSelectPosition(pos.id)}
                          className={`bg-white rounded-xl p-4 border transition-all shadow-xs hover:shadow-md cursor-pointer group ${
                            isZero
                              ? 'border-red-300 ring-1 ring-red-200'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          {/* Role Title and Criticality Score */}
                          <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                            <div>
                              <h4 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors leading-snug">
                                {pos.title}
                              </h4>
                              <span className="text-[10px] text-slate-500">{pos.department}</span>
                            </div>
                            <span className="font-mono text-xs font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                              {pos.criticalityScore}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-[11px] text-slate-600 line-clamp-2 mb-3">
                            {pos.description}
                          </p>

                          {/* Incumbent Leader */}
                          <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-2 mb-3">
                            <Avatar name={pos.incumbentName} src={pos.incumbentAvatar} size="sm" />
                            <div className="min-w-0">
                              <span className="text-[10px] text-slate-400 block">Current Incumbent</span>
                              <span className="text-xs font-semibold text-slate-800 truncate block">
                                {pos.incumbentName}
                              </span>
                            </div>
                          </div>

                          {/* Bench Depth & Alert */}
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                            {isZero ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#DC2626] bg-red-100 px-2 py-0.5 rounded animate-pulse">
                                <ShieldAlert className="w-3 h-3" />
                                No Successors
                              </span>
                            ) : (
                              <span className="font-mono font-bold text-[#047857]">
                                {pos.successorsCount} Nominees
                              </span>
                            )}

                            <span className="text-xs font-bold text-[#047857] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              <span>Bench</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                  <th className="py-3.5 px-4">Position Title & Scope</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Criticality (0-100)</th>
                  <th className="py-3.5 px-4">Incumbent Leader</th>
                  <th className="py-3.5 px-4">Successor Bench Depth</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredPositions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8">
                      <EmptyState
                        title="No matching positions found"
                        description="Adjust your search filters or check all criticality tiers."
                        actionLabel="Reset Filters"
                        onAction={() => {
                          setSearch('');
                          setDeptFilter('All');
                          setCritFilter('All');
                          setZeroOnly(false);
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredPositions.map((pos) => {
                    const isZero = pos.successorsCount === 0;

                    return (
                      <tr
                        key={pos.id}
                        onClick={() => onSelectPosition(pos.id)}
                        className={`transition-colors cursor-pointer group ${
                          isZero ? 'bg-red-50/30 hover:bg-red-50/60' : 'hover:bg-emerald-50/40'
                        }`}
                      >
                        {/* Title */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                            {pos.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">
                            {pos.description}
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-800">{pos.department}</span>
                        </td>

                        {/* Criticality */}
                        <td className="py-3.5 px-4">
                          <CriticalityBadge
                            level={pos.criticality}
                            score={pos.criticalityScore}
                            size="md"
                          />
                        </td>

                        {/* Incumbent */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={pos.incumbentName} src={pos.incumbentAvatar} size="sm" />
                            <span className="font-semibold text-slate-800">{pos.incumbentName}</span>
                          </div>
                        </td>

                        {/* Successor Depth Indicator with Prominent Red Badge on Zero */}
                        <td className="py-3.5 px-4">
                          {isZero ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DC2626] text-white text-[11px] font-bold shadow-xs animate-pulse">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>No Successors</span>
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 font-mono font-bold text-xs">
                                <span
                                  className={`px-2 py-0.5 rounded ${
                                    pos.successorsCount >= 2
                                      ? 'bg-emerald-100 text-[#047857]'
                                      : 'bg-amber-100 text-[#D97706]'
                                  }`}
                                >
                                  {pos.successorsCount} Nominees
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 hidden lg:inline">
                                (Avg {pos.avgTimeToReadinessMonths} mos)
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPosition(pos.id);
                            }}
                            className="p-1.5 text-slate-400 group-hover:text-[#047857] group-hover:bg-white rounded-lg transition-all cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
