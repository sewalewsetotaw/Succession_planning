import React, { useState, useMemo } from 'react';
import {
  Clock,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Briefcase,
  List,
  Columns3,
  ArrowUpDown,
} from 'lucide-react';
import { SignatureBanner } from '../common/SignatureBanner';
import { Avatar } from '../common/Avatar';
import { ReadinessChip } from '../common/ReadinessChip';
import { RiskBadge } from '../common/RiskBadge';
import { EmptyState } from '../common/EmptyState';
import { SuccessionPlan, Position, Employee, ReadinessLevel } from '../../types';

interface ReadinessTimelineScreenProps {
  successionPlans: SuccessionPlan[];
  positions: Position[];
  employees: Employee[];
  onSelectEmployee: (empId: string) => void;
  onSelectPosition: (posId: string) => void;
}

export const ReadinessTimelineScreen: React.FC<ReadinessTimelineScreenProps> = ({
  successionPlans,
  positions,
  employees,
  onSelectEmployee,
  onSelectPosition,
}) => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedBand, setSelectedBand] = useState<'All' | ReadinessLevel>('All');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const departments = ['All', 'Executive', 'Engineering', 'Operations', 'Product', 'Sales', 'Finance', 'People & Culture'];
  const bands: ReadinessLevel[] = ['Ready Now', '1-2 Years', '3-5 Years'];

  const filteredPlans = useMemo(() => {
    return successionPlans.filter((p) => {
      const matchDept = selectedDept === 'All' || p.department === selectedDept;
      const matchBand = selectedBand === 'All' || p.readiness === selectedBand;
      return matchDept && matchBand;
    });
  }, [successionPlans, selectedDept, selectedBand]);

  // Counts
  const readyNowCount = successionPlans.filter((p) => p.readiness === 'Ready Now').length;
  const oneToTwoCount = successionPlans.filter((p) => p.readiness === '1-2 Years').length;
  const threeToFiveCount = successionPlans.filter((p) => p.readiness === '3-5 Years').length;

  // Group plans in a band by target position
  const getGroupedByPositionInBand = (band: ReadinessLevel) => {
    const plansInBand = filteredPlans.filter((p) => p.readiness === band);
    const posMap = new Map<string, { positionTitle: string; department: string; plans: SuccessionPlan[] }>();

    plansInBand.forEach((p) => {
      if (!posMap.has(p.positionId)) {
        posMap.set(p.positionId, {
          positionTitle: p.positionTitle,
          department: p.department,
          plans: [],
        });
      }
      posMap.get(p.positionId)!.plans.push(p);
    });

    return Array.from(posMap.entries());
  };

  return (
    <div className="space-y-6">
      <SignatureBanner
        title="Succession Readiness Timeline"
        subtitle="Three temporal horizons mapping immediate replacements, mid-term bench talent, and strategic long-range leaders."
        badge="Talent Pipeline Horizons"
      />

      {/* Pipeline Depth Summary Bar at Top */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Enterprise Pipeline Depth Summary
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-extrabold text-[#0B1F18] tabular-nums">
                {successionPlans.length}
              </span>
              <span className="text-xs text-slate-500">
                active candidate nominations across 12 critical roles
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
                <span className="hidden lg:inline">List</span>
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
                <span className="hidden lg:inline">Kanban</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 hidden xl:inline">Filter Dept:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="p-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards for the 3 Bands */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setSelectedBand(selectedBand === 'Ready Now' ? 'All' : 'Ready Now')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedBand === 'Ready Now'
                ? 'bg-[#4EC69A]/20 border-[#4EC69A] ring-2 ring-[#4EC69A]'
                : 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                1. Ready Now (&lt;6 Months)
              </span>
              <span className="font-mono text-lg font-bold text-[#047857] tabular-nums">
                {readyNowCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              Immediate replacement ready upon sudden transition
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedBand(selectedBand === '1-2 Years' ? 'All' : '1-2 Years')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedBand === '1-2 Years'
                ? 'bg-emerald-100/50 border-emerald-400 ring-2 ring-emerald-300'
                : 'bg-slate-50 border-gray-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Horizon 1 - 2 Years
              </span>
              <span className="font-mono text-lg font-bold text-slate-800 tabular-nums">
                {oneToTwoCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              Closing targeted competencies and executive shadowing
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedBand(selectedBand === '3-5 Years' ? 'All' : '3-5 Years')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedBand === '3-5 Years'
                ? 'bg-slate-200 border-slate-400 ring-2 ring-slate-300'
                : 'bg-slate-50 border-gray-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Horizon 3 - 5 Years
              </span>
              <span className="font-mono text-lg font-bold text-slate-800 tabular-nums">
                {threeToFiveCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              High-potential pipeline developing managerial breadth
            </p>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {viewMode === 'kanban' ? (
        <div className="grid gap-4 items-start grid-cols-1 md:grid-cols-3">
          {bands.map((band) => {
            // Determine column styling
            let colDot = '';
            let colBg = '';
            let colBorder = '';
            let colBadge = '';
            let colTitle = '';
            let colDesc = '';

            if (band === 'Ready Now') {
              colDot = 'bg-[#047857]';
              colBg = 'bg-[#4EC69A]/20';
              colBorder = 'border-[#4EC69A]';
              colBadge = 'bg-[#047857] text-white';
              colTitle = 'Ready Now (<6 Months)';
              colDesc = 'Immediate replacement ready upon transition';
            } else if (band === '1-2 Years') {
              colDot = 'bg-teal-600';
              colBg = 'bg-teal-50/40';
              colBorder = 'border-teal-200';
              colBadge = 'bg-teal-700 text-white';
              colTitle = '1 - 2 Years (Mid-Term)';
              colDesc = 'Closing targeted competencies';
            } else {
              colDot = 'bg-slate-500';
              colBg = 'bg-slate-50/70';
              colBorder = 'border-slate-200';
              colBadge = 'bg-slate-700 text-white';
              colTitle = '3 - 5 Years (Long-Term)';
              colDesc = 'Building functional foundations';
            }

            const plansInBand = filteredPlans.filter((p) => p.readiness === band);
            
            if (selectedBand !== 'All' && selectedBand !== band) {
              return null; // Hide if not selected
            }

            return (
              <div
                key={band}
                className={`rounded-2xl border transition-all ${colBg} ${colBorder} flex flex-col min-h-[580px] shadow-xs`}
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-inherit bg-white/85 rounded-t-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2.5 h-2.5 rounded-full ${colDot} shrink-0`} />
                    <h3 className="text-xs font-extrabold text-[#0B1F18] uppercase tracking-wider truncate">
                      {colTitle}
                    </h3>
                  </div>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${colBadge} tabular-nums shrink-0`}>
                    {plansInBand.length}
                  </span>
                </div>

                {/* Column Description Subtitle */}
                <div className="px-3.5 py-1.5 bg-white/40 border-b border-inherit text-[10px] text-slate-500 line-clamp-1">
                  {colDesc}
                </div>

                {/* Cards Container */}
                <div className="p-3 flex-1 space-y-3 overflow-y-auto">
                  {plansInBand.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-3 text-center text-slate-400 text-xs">
                      No candidates in this horizon
                    </div>
                  ) : (
                    plansInBand.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => onSelectEmployee(p.candidateId)}
                        className="bg-white rounded-xl p-3.5 border border-gray-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
                      >
                        {/* Target Role Tag */}
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                          <div 
                            className="flex items-center gap-1.5 text-[#047857] hover:text-emerald-700 font-semibold text-[10px] uppercase tracking-wider truncate"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPosition(p.positionId);
                            }}
                          >
                            <Briefcase className="w-3 h-3" />
                            <span className="truncate">{p.positionTitle}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded shrink-0">
                            Tier {p.ranking}
                          </span>
                        </div>

                        {/* Candidate Info */}
                        <div className="flex items-center gap-2.5 mb-2">
                          <Avatar name={p.candidateName} src={p.candidateAvatar} size="md" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                              {p.candidateName}
                            </h4>
                            <span className="text-[11px] text-slate-500 truncate block">
                              {p.candidateTitle}
                            </span>
                          </div>
                        </div>

                        {/* Department */}
                        <div className="text-[11px] text-slate-500 mb-2 truncate">
                          {p.department}
                        </div>

                        {/* Scores & Actions */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span>Perf: <strong>{p.performanceScore.toFixed(1)}</strong></span>
                            <span>Pot: <strong className="text-[#047857]">{p.potentialScore.toFixed(1)}</strong></span>
                          </div>
                          <span className="text-[#047857] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            <span>View</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* SORTABLE LIST / TABLE VIEW */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                  <th className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">Target Role</div>
                  </th>
                  <th className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">Candidate</div>
                  </th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Department</th>
                  <th className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">Readiness Horizon</div>
                  </th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Tier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredPlans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8">
                      <EmptyState
                        title="No matching succession plans"
                        description="Try adjusting your filter criteria."
                        actionLabel="Reset Filters"
                        onAction={() => {
                          setSelectedDept('All');
                          setSelectedBand('All');
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => onSelectEmployee(p.candidateId)}
                      className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Target Role */}
                      <td className="py-3.5 px-4">
                        <div 
                          className="flex items-center gap-1.5 text-slate-800 hover:text-[#047857] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPosition(p.positionId);
                          }}
                        >
                          <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-[#047857]" />
                          <span className="font-semibold">{p.positionTitle}</span>
                        </div>
                      </td>

                      {/* Candidate */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={p.candidateName} src={p.candidateAvatar} size="sm" />
                          <div className="min-w-0">
                            <div className="font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                              {p.candidateName}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {p.candidateTitle}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span className="text-slate-600">{p.department}</span>
                      </td>

                      {/* Readiness */}
                      <td className="py-3.5 px-4">
                        <ReadinessChip readiness={p.readiness} size="sm" />
                      </td>

                      {/* Tier */}
                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        <span className="font-mono text-slate-600">Tier {p.ranking}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEmployee(p.candidateId);
                          }}
                          className="p-1.5 text-slate-400 group-hover:text-[#047857] group-hover:bg-white rounded-lg transition-all cursor-pointer inline-flex"
                          title="View Leader Profile"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
