import React, { useState, useMemo } from 'react';
import {
  Clock,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Briefcase,
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

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
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

      {/* Three Horizontal Bands */}
      <div className="space-y-6">
        {/* Band 1: Ready Now (Mint highlight #4EC69A) */}
        {(selectedBand === 'All' || selectedBand === 'Ready Now') && (
          <div className="bg-white rounded-2xl border-2 border-[#4EC69A] shadow-xs overflow-hidden">
            {/* Band Header */}
            <div className="bg-[#4EC69A]/20 px-6 py-4 border-b border-[#4EC69A]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#047857] text-white flex items-center justify-center font-bold text-xs">
                  NOW
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#064E3B] tracking-tight">
                    Horizon 1: Ready Now (&lt;6 Months / Immediate)
                  </h3>
                  <p className="text-xs text-[#064E3B]/80 font-medium">
                    Candidates cleared by board executive calibration for immediate assumption of duties.
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold bg-[#047857] text-white px-2.5 py-1 rounded-md">
                {getGroupedByPositionInBand('Ready Now').reduce((acc, [, g]) => acc + g.plans.length, 0)} Nominees
              </span>
            </div>

            {/* Position Groups in Band */}
            <div className="p-6 space-y-4">
              {getGroupedByPositionInBand('Ready Now').length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No candidates in this horizon.</p>
              ) : (
                getGroupedByPositionInBand('Ready Now').map(([posId, group]) => (
                  <div key={posId} className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-100">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#047857]" />
                        <h4
                          onClick={() => onSelectPosition(posId)}
                          className="text-xs font-bold text-[#0B1F18] hover:text-[#047857] transition-colors cursor-pointer"
                        >
                          Target Role: {group.positionTitle}
                        </h4>
                        <span className="text-[10px] text-slate-500">({group.department})</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#064E3B]">
                        {group.plans.length} Ready Successor{group.plans.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.plans.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelectEmployee(p.candidateId)}
                          className="p-3 bg-white rounded-lg border border-[#4EC69A] shadow-xs hover:border-[#047857] transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={p.candidateName} src={p.candidateAvatar} size="md" />
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                                  {p.candidateName}
                                </h5>
                                <span className="text-[10px] text-slate-500 truncate block">
                                  {p.candidateTitle}
                                </span>
                              </div>
                            </div>
                            <ReadinessChip readiness={p.readiness} size="sm" />
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-2 border-t border-gray-100">
                            <span>Tier {p.ranking} Successor</span>
                            <div className="flex items-center gap-2">
                              <span>Perf: <strong>{p.performanceScore.toFixed(1)}</strong></span>
                              <span>Pot: <strong className="text-[#047857]">{p.potentialScore.toFixed(1)}</strong></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Band 2: 1-2 Years */}
        {(selectedBand === 'All' || selectedBand === '1-2 Years') && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  1-2 Y
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0B1F18]">
                    Horizon 2: 1 - 2 Years (Mid-Term Succession Bench)
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-trajectory leaders in final phase of executive development and operational grooming.
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md">
                {getGroupedByPositionInBand('1-2 Years').reduce((acc, [, g]) => acc + g.plans.length, 0)} Nominees
              </span>
            </div>

            <div className="p-6 space-y-4">
              {getGroupedByPositionInBand('1-2 Years').length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No candidates in this horizon.</p>
              ) : (
                getGroupedByPositionInBand('1-2 Years').map(([posId, group]) => (
                  <div key={posId} className="p-4 bg-slate-50/70 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-600" />
                        <h4
                          onClick={() => onSelectPosition(posId)}
                          className="text-xs font-bold text-[#0B1F18] hover:text-[#047857] transition-colors cursor-pointer"
                        >
                          Target Role: {group.positionTitle}
                        </h4>
                        <span className="text-[10px] text-slate-500">({group.department})</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">
                        {group.plans.length} Candidate{group.plans.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.plans.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelectEmployee(p.candidateId)}
                          className="p-3 bg-white rounded-lg border border-gray-200 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={p.candidateName} src={p.candidateAvatar} size="md" />
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                                  {p.candidateName}
                                </h5>
                                <span className="text-[10px] text-slate-500 truncate block">
                                  {p.candidateTitle}
                                </span>
                              </div>
                            </div>
                            <ReadinessChip readiness={p.readiness} size="sm" />
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-2 border-t border-gray-100">
                            <span>Tier {p.ranking}</span>
                            <div className="flex items-center gap-2">
                              <span>Perf: <strong>{p.performanceScore.toFixed(1)}</strong></span>
                              <span>Pot: <strong className="text-[#047857]">{p.potentialScore.toFixed(1)}</strong></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Band 3: 3-5 Years */}
        {(selectedBand === 'All' || selectedBand === '3-5 Years') && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-500 text-white flex items-center justify-center font-bold text-xs">
                  3-5 Y
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0B1F18]">
                    Horizon 3: 3 - 5 Years (Strategic Pipeline)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Emerging high-potential leaders building functional foundations and domain mastery.
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md">
                {getGroupedByPositionInBand('3-5 Years').reduce((acc, [, g]) => acc + g.plans.length, 0)} Nominees
              </span>
            </div>

            <div className="p-6 space-y-4">
              {getGroupedByPositionInBand('3-5 Years').length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No candidates in this horizon.</p>
              ) : (
                getGroupedByPositionInBand('3-5 Years').map(([posId, group]) => (
                  <div key={posId} className="p-4 bg-slate-50/70 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-600" />
                        <h4
                          onClick={() => onSelectPosition(posId)}
                          className="text-xs font-bold text-[#0B1F18] hover:text-[#047857] transition-colors cursor-pointer"
                        >
                          Target Role: {group.positionTitle}
                        </h4>
                        <span className="text-[10px] text-slate-500">({group.department})</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">
                        {group.plans.length} Candidate{group.plans.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.plans.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelectEmployee(p.candidateId)}
                          className="p-3 bg-white rounded-lg border border-gray-200 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={p.candidateName} src={p.candidateAvatar} size="md" />
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                                  {p.candidateName}
                                </h5>
                                <span className="text-[10px] text-slate-500 truncate block">
                                  {p.candidateTitle}
                                </span>
                              </div>
                            </div>
                            <ReadinessChip readiness={p.readiness} size="sm" />
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-2 border-t border-gray-100">
                            <span>Tier {p.ranking}</span>
                            <div className="flex items-center gap-2">
                              <span>Perf: <strong>{p.performanceScore.toFixed(1)}</strong></span>
                              <span>Pot: <strong className="text-[#047857]">{p.potentialScore.toFixed(1)}</strong></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
