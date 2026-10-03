import React, { useState, useMemo } from 'react';
import {
  GitBranch,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Search,
  User,
  Briefcase,
  ChevronRight,
  List,
  Columns3,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { SignatureBanner } from '../common/SignatureBanner';
import { Avatar } from '../common/Avatar';
import { ReadinessChip } from '../common/ReadinessChip';
import { RiskBadge } from '../common/RiskBadge';
import { CriticalityBadge } from '../common/CriticalityBadge';
import { EmptyState } from '../common/EmptyState';
import {
  SuccessionPlan,
  Position,
  Employee,
  ReadinessLevel,
  ActiveScreen,
} from '../../types';

interface SuccessionPlansScreenProps {
  successionPlans: SuccessionPlan[];
  positions: Position[];
  employees: Employee[];
  onAddPlan: (initialReadiness?: ReadinessLevel) => void;
  onEditPlan: (plan: SuccessionPlan) => void;
  onDeletePlan: (planId: string) => void;
  onSelectEmployee: (empId: string) => void;
  onSelectPosition: (posId: string) => void;
  onUpdateReadiness?: (planId: string, newReadiness: ReadinessLevel) => void;
}

export const SuccessionPlansScreen: React.FC<SuccessionPlansScreenProps> = ({
  successionPlans,
  positions,
  employees,
  onAddPlan,
  onEditPlan,
  onDeletePlan,
  onSelectEmployee,
  onSelectPosition,
  onUpdateReadiness,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [groupBy, setGroupBy] = useState<'position' | 'candidate'>('position');
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState('All');
  const [readinessFilter, setReadinessFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [draggedPlanId, setDraggedPlanId] = useState<string | null>(null);
  const [activeDropHorizon, setActiveDropHorizon] = useState<ReadinessLevel | null>(null);

  const departments = ['All', 'Executive', 'Engineering', 'Operations', 'Product', 'Sales', 'Finance', 'People & Culture'];
  const readinessOptions = ['All', 'Ready Now', '1-2 Years', '3-5 Years'];

  const kanbanHorizons: { level: ReadinessLevel; title: string; subtitle: string; bg: string; border: string; badge: string }[] = [
    {
      level: 'Ready Now',
      title: 'Ready Now (<6 Months)',
      subtitle: 'Immediate emergency & planned succession candidates',
      bg: 'bg-[#4EC69A]/15',
      border: 'border-[#4EC69A]',
      badge: 'bg-[#047857] text-white',
    },
    {
      level: '1-2 Years',
      title: '1 - 2 Years',
      subtitle: 'Mid-term talent acquiring targeted executive competencies',
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-800 text-white',
    },
    {
      level: '3-5 Years',
      title: '3 - 5 Years',
      subtitle: 'Long-term strategic bench developing leadership depth',
      bg: 'bg-slate-50/70',
      border: 'border-slate-200',
      badge: 'bg-slate-700 text-white',
    },
  ];

  const filteredPlans = useMemo(() => {
    return successionPlans.filter((plan) => {
      const matchesSearch =
        plan.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        plan.positionTitle.toLowerCase().includes(search.toLowerCase()) ||
        plan.notes.toLowerCase().includes(search.toLowerCase());
      const matchesPos = posFilter === 'All' || plan.positionId === posFilter;
      const matchesReadiness = readinessFilter === 'All' || plan.readiness === readinessFilter;
      const matchesDept = deptFilter === 'All' || plan.department === deptFilter;

      return matchesSearch && matchesPos && matchesReadiness && matchesDept;
    });
  }, [successionPlans, search, posFilter, readinessFilter, deptFilter]);

  // Grouping by position (List view)
  const plansByPosition = useMemo(() => {
    const map = new Map<string, { position: Position | undefined; plans: SuccessionPlan[] }>();
    filteredPlans.forEach((plan) => {
      if (!map.has(plan.positionId)) {
        const pos = positions.find((p) => p.id === plan.positionId);
        map.set(plan.positionId, { position: pos, plans: [] });
      }
      map.get(plan.positionId)!.plans.push(plan);
    });
    return Array.from(map.entries());
  }, [filteredPlans, positions]);

  // Grouping by candidate (List view)
  const plansByCandidate = useMemo(() => {
    const map = new Map<string, { employee: Employee | undefined; plans: SuccessionPlan[] }>();
    filteredPlans.forEach((plan) => {
      if (!map.has(plan.candidateId)) {
        const emp = employees.find((e) => e.id === plan.candidateId);
        map.set(plan.candidateId, { employee: emp, plans: [] });
      }
      map.get(plan.candidateId)!.plans.push(plan);
    });
    return Array.from(map.entries());
  }, [filteredPlans, employees]);

  // Drag & drop handlers for Kanban readiness board
  const handleDragStart = (e: React.DragEvent, planId: string) => {
    e.dataTransfer.setData('text/plain', planId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPlanId(planId);
  };

  const handleDragOver = (e: React.DragEvent, horizon: ReadinessLevel) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropHorizon !== horizon) {
      setActiveDropHorizon(horizon);
    }
  };

  const handleDragLeave = () => {
    setActiveDropHorizon(null);
  };

  const handleDrop = (e: React.DragEvent, newHorizon: ReadinessLevel) => {
    e.preventDefault();
    const planId = e.dataTransfer.getData('text/plain') || draggedPlanId;
    if (planId && onUpdateReadiness) {
      onUpdateReadiness(planId, newHorizon);
    }
    setDraggedPlanId(null);
    setActiveDropHorizon(null);
  };

  return (
    <div className="space-y-6">
      <SignatureBanner
        title="Succession Plans & Nominations"
        subtitle="Manage named successors, readiness horizons, and candidate pipelines across enterprise roles."
        badge="Succession Nominations"
        actions={
          <button
            type="button"
            onClick={() => onAddPlan()}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#047857] hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer focus-ring"
          >
            <Plus className="w-4 h-4 text-[#047857]" />
            <span>Nominate Successor</span>
          </button>
        }
      />

      {/* Filter and View Mode / Group Toggle Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidate, role, or transition notes..."
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
                <span>List / Groups</span>
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

            {/* In List View: Position vs Candidate toggle */}
            {viewMode === 'list' && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 hidden lg:inline">Group:</span>
                <div className="flex items-center p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setGroupBy('position')}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      groupBy === 'position'
                        ? 'bg-white text-[#047857] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase className="w-3 h-3" />
                    <span>Role</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroupBy('candidate')}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      groupBy === 'candidate'
                        ? 'bg-white text-[#047857] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span>Candidate</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filter by Position
            </label>
            <select
              value={posFilter}
              onChange={(e) => setPosFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              <option value="All">All Positions</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Readiness Horizon
            </label>
            <select
              value={readinessFilter}
              onChange={(e) => setReadinessFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              {readinessOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

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
        </div>
      </div>

      {/* KANBAN BOARD VIEW (Grouped by Readiness Horizons) */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {kanbanHorizons.map((col) => {
            const plansInHorizon = filteredPlans.filter((p) => p.readiness === col.level);
            const isDragOver = activeDropHorizon === col.level;

            return (
              <div
                key={col.level}
                onDragOver={(e) => handleDragOver(e, col.level)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.level)}
                className={`rounded-2xl border transition-all ${col.bg} ${
                  isDragOver
                    ? 'border-[#047857] ring-2 ring-[#047857]/40 bg-emerald-50/80 shadow-md'
                    : col.border
                } flex flex-col min-h-[580px]`}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-inherit bg-white/80 rounded-t-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold text-[#0B1F18] uppercase tracking-wider flex items-center gap-1.5">
                      {col.level === 'Ready Now' && <Sparkles className="w-3.5 h-3.5 text-[#047857]" />}
                      <span>{col.title}</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{col.subtitle}</p>
                  </div>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${col.badge} tabular-nums`}>
                    {plansInHorizon.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-3.5 flex-1 space-y-3 overflow-y-auto">
                  {plansInHorizon.length === 0 ? (
                    <div className="h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-3 text-center text-slate-400 text-xs">
                      <span>No candidates in this horizon</span>
                      <span className="text-[10px] text-slate-400 mt-1">Drag candidates here to update readiness</span>
                    </div>
                  ) : (
                    plansInHorizon.map((plan) => (
                      <div
                        key={plan.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, plan.id)}
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-grab active:cursor-grabbing group"
                      >
                        {/* Target Role & Criticality */}
                        <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                              Target Position
                            </span>
                            <h4
                              onClick={() => onSelectPosition(plan.positionId)}
                              className="text-xs font-bold text-[#0B1F18] hover:text-[#047857] transition-colors cursor-pointer truncate"
                            >
                              {plan.positionTitle}
                            </h4>
                            <span className="text-[10px] text-slate-500">{plan.department}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            Tier {plan.ranking}
                          </span>
                        </div>

                        {/* Candidate info */}
                        <div
                          onClick={() => onSelectEmployee(plan.candidateId)}
                          className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer mb-2"
                        >
                          <Avatar name={plan.candidateName} src={plan.candidateAvatar} size="md" />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 hover:text-[#047857] transition-colors block truncate">
                              {plan.candidateName}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {plan.candidateTitle}
                            </span>
                          </div>
                        </div>

                        {/* Scores & Flight Risk */}
                        <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between text-[11px] font-mono mb-2">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 text-[10px]">Flight:</span>
                            <RiskBadge level={plan.flightRisk} size="sm" />
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <span>P: <strong>{plan.performanceScore.toFixed(1)}</strong></span>
                            <span>Pot: <strong className="text-[#047857]">{plan.potentialScore.toFixed(1)}</strong></span>
                          </div>
                        </div>

                        {/* Notes */}
                        {plan.notes && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 italic mb-2">
                            "{plan.notes}"
                          </p>
                        )}

                        {/* Quick Move and Card Actions */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onEditPlan(plan)}
                              className="p-1 text-slate-400 hover:text-[#047857] hover:bg-slate-100 rounded transition-colors"
                              title="Edit Nomination"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeletePlan(plan.id)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Remove Nomination"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {onUpdateReadiness && (
                            <div className="flex items-center gap-1">
                              {kanbanHorizons
                                .filter((h) => h.level !== plan.readiness)
                                .map((targetH) => (
                                  <button
                                    key={targetH.level}
                                    type="button"
                                    onClick={() => onUpdateReadiness(plan.id, targetH.level)}
                                    className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-[#047857] transition-colors"
                                  >
                                    &rarr; {targetH.level.split(' ')[0]}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Add in this horizon */}
                <div className="p-3 border-t border-inherit bg-white/60 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={() => onAddPlan(col.level)}
                    className="w-full py-1.5 text-xs font-semibold text-slate-600 hover:text-[#047857] hover:bg-white rounded-lg border border-dashed border-gray-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nominate for {col.level}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST / GROUPED CARDS VIEW */
        <>
          {groupBy === 'position' && (
            <div className="space-y-6">
              {plansByPosition.length === 0 ? (
                <EmptyState
                  title="No succession plans match filters"
                  description="Clear filters or click 'Nominate Successor' to add candidates."
                  actionLabel="Nominate Successor"
                  onAction={() => onAddPlan()}
                />
              ) : (
                plansByPosition.map(([posId, group]) => {
                  const pos = group.position;
                  return (
                    <div key={posId} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                      {/* Position Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-50 text-[#047857]">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3
                                onClick={() => pos && onSelectPosition(pos.id)}
                                className="text-base font-bold text-[#0B1F18] hover:text-[#047857] transition-colors cursor-pointer"
                              >
                                {pos?.title || group.plans[0].positionTitle}
                              </h3>
                              {pos && (
                                <CriticalityBadge level={pos.criticality} score={pos.criticalityScore} size="sm" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500">
                              {pos?.department} &middot; Current Incumbent: <strong>{pos?.incumbentName}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                            {group.plans.length} Successor{group.plans.length === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>

                      {/* Candidate Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                        {group.plans.map((plan) => (
                          <div
                            key={plan.id}
                            className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all relative flex flex-col justify-between"
                          >
                            <div>
                              {/* Card top */}
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div
                                  onClick={() => onSelectEmployee(plan.candidateId)}
                                  className="flex items-center gap-2.5 cursor-pointer group"
                                >
                                  <Avatar name={plan.candidateName} src={plan.candidateAvatar} size="md" />
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                                      {plan.candidateName}
                                    </h4>
                                    <span className="text-[11px] text-slate-500 truncate block">
                                      {plan.candidateTitle}
                                    </span>
                                  </div>
                                </div>

                                <ReadinessChip readiness={plan.readiness} size="sm" />
                              </div>

                              {/* Scores & Risk */}
                              <div className="p-2 bg-white rounded-lg border border-gray-100 flex items-center justify-between text-[11px] mb-3 font-mono">
                                <div>
                                  <span className="text-slate-400">Flight: </span>
                                  <RiskBadge level={plan.flightRisk} size="sm" />
                                </div>
                                <div className="flex items-center gap-2 text-slate-700">
                                  <span>P: <strong>{plan.performanceScore.toFixed(1)}</strong></span>
                                  <span>Pot: <strong className="text-[#047857]">{plan.potentialScore.toFixed(1)}</strong></span>
                                </div>
                              </div>

                              {/* Notes */}
                              <p className="text-xs text-slate-600 line-clamp-2 italic mb-3">
                                "{plan.notes}"
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-slate-400">
                              <span>Tier {plan.ranking} &middot; {plan.lastReviewed}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => onEditPlan(plan)}
                                  className="p-1 text-slate-400 hover:text-[#047857] hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                  title="Edit Nomination"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeletePlan(plan.id)}
                                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Remove Nomination"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {groupBy === 'candidate' && (
            <div className="space-y-6">
              {plansByCandidate.length === 0 ? (
                <EmptyState
                  title="No succession nominations found"
                  description="Try adjusting filters or nominate new successors."
                  actionLabel="Nominate Successor"
                  onAction={() => onAddPlan()}
                />
              ) : (
                plansByCandidate.map(([empId, group]) => {
                  const emp = group.employee;
                  return (
                    <div key={empId} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                      {/* Candidate Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div
                          onClick={() => emp && onSelectEmployee(emp.id)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <Avatar name={emp?.name || group.plans[0].candidateName} src={emp?.avatar} size="lg" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                                {emp?.name || group.plans[0].candidateName}
                              </h3>
                              {emp && <RiskBadge level={emp.flightRisk} size="sm" />}
                            </div>
                            <p className="text-xs text-slate-500">
                              {emp?.title} &middot; {emp?.department}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
                          <span>Performance: <strong>{emp?.performanceScore.toFixed(1)}</strong></span>
                          <span>&middot;</span>
                          <span>Potential: <strong className="text-[#047857]">{emp?.potentialScore.toFixed(1)}</strong></span>
                        </div>
                      </div>

                      {/* Target Position Candidacies Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                        {group.plans.map((plan) => (
                          <div
                            key={plan.id}
                            className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all relative flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Target Role
                                  </span>
                                  <h4
                                    onClick={() => onSelectPosition(plan.positionId)}
                                    className="text-xs font-bold text-[#0B1F18] hover:text-[#047857] transition-colors cursor-pointer"
                                  >
                                    {plan.positionTitle}
                                  </h4>
                                  <span className="text-[11px] text-slate-500">{plan.department}</span>
                                </div>
                                <ReadinessChip readiness={plan.readiness} size="sm" />
                              </div>

                              <p className="text-xs text-slate-600 line-clamp-2 italic mb-3">
                                "{plan.notes}"
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-slate-400">
                              <span>Tier {plan.ranking} &middot; {plan.lastReviewed}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => onEditPlan(plan)}
                                  className="p-1 text-slate-400 hover:text-[#047857] hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeletePlan(plan.id)}
                                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
