import React, { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  Filter,
  List,
  Columns3,
  GripVertical,
  ArrowRight,
  MoreHorizontal,
  Calendar,
  User,
} from 'lucide-react';
import { SignatureBanner } from '../common/SignatureBanner';
import { Avatar } from '../common/Avatar';
import { EmptyState } from '../common/EmptyState';
import { DevelopmentPlan, Employee, DevPlanStatus, DevPlanCategory } from '../../types';

interface DevelopmentPlansScreenProps {
  developmentPlans: DevelopmentPlan[];
  employees: Employee[];
  onAddPlan: (initialStatus?: DevPlanStatus) => void;
  onEditPlan: (plan: DevelopmentPlan) => void;
  onDeletePlan: (planId: string) => void;
  onSelectEmployee: (empId: string) => void;
  onUpdateStatus?: (planId: string, status: DevPlanStatus) => void;
}

export const DevelopmentPlansScreen: React.FC<DevelopmentPlansScreenProps> = ({
  developmentPlans,
  employees,
  onAddPlan,
  onEditPlan,
  onDeletePlan,
  onSelectEmployee,
  onUpdateStatus,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [draggedPlanId, setDraggedPlanId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<DevPlanStatus | null>(null);

  const categories = ['All', 'Leadership', 'Strategic', 'Technical', 'Communication', 'Other'];
  const statuses = ['All', 'In Progress', 'Completed', 'On Hold', 'Not Started'];
  const kanbanColumns: { status: DevPlanStatus; title: string; color: string; dot: string; bg: string; border: string }[] = [
    {
      status: 'Not Started',
      title: 'Not Started',
      color: 'text-slate-700',
      dot: 'bg-slate-400',
      bg: 'bg-slate-50/70',
      border: 'border-slate-200',
    },
    {
      status: 'In Progress',
      title: 'In Progress',
      color: 'text-blue-800',
      dot: 'bg-blue-600',
      bg: 'bg-blue-50/40',
      border: 'border-blue-200',
    },
    {
      status: 'On Hold',
      title: 'On Hold',
      color: 'text-amber-800',
      dot: 'bg-amber-500',
      bg: 'bg-amber-50/40',
      border: 'border-amber-200',
    },
    {
      status: 'Completed',
      title: 'Completed',
      color: 'text-[#064E3B]',
      dot: 'bg-[#047857]',
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-200',
    },
  ];

  // Summary Metrics
  const total = developmentPlans.length;
  const completed = developmentPlans.filter((p) => p.status === 'Completed').length;
  const inProgress = developmentPlans.filter((p) => p.status === 'In Progress').length;
  const overdue = developmentPlans.filter((p) => p.isOverdue).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const filteredPlans = useMemo(() => {
    return developmentPlans.filter((plan) => {
      const matchesSearch =
        plan.goal.toLowerCase().includes(search.toLowerCase()) ||
        plan.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        (plan.mentorName && plan.mentorName.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || plan.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || plan.category === categoryFilter;
      const matchesEmployee = employeeFilter === 'All' || plan.employeeId === employeeFilter;
      const matchesOverdue = !overdueOnly || plan.isOverdue;

      return matchesSearch && matchesStatus && matchesCategory && matchesEmployee && matchesOverdue;
    });
  }, [developmentPlans, search, statusFilter, categoryFilter, employeeFilter, overdueOnly]);

  const getStatusBadge = (status: DevPlanStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'On Hold':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Not Started':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, planId: string) => {
    e.dataTransfer.setData('text/plain', planId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPlanId(planId);
  };

  const handleDragOver = (e: React.DragEvent, status: DevPlanStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== status) {
      setActiveDropColumn(status);
    }
  };

  const handleDragLeave = () => {
    setActiveDropColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: DevPlanStatus) => {
    e.preventDefault();
    const planId = e.dataTransfer.getData('text/plain') || draggedPlanId;
    if (planId && onUpdateStatus) {
      onUpdateStatus(planId, newStatus);
    }
    setDraggedPlanId(null);
    setActiveDropColumn(null);
  };

  return (
    <div className="space-y-6">
      <SignatureBanner
        title="Leadership Development Plans"
        subtitle="Track targeted executive coaching, skill acquisition milestones, and succession readiness trajectories."
        badge="Continuous Bench Development"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAddPlan()}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#047857] hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer focus-ring"
            >
              <Plus className="w-4 h-4 text-[#047857]" />
              <span>New Development Plan</span>
            </button>
          </div>
        }
      />

      {/* Completion-Rate Summary Bar at Top */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Overall Development Completion Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-[#047857] tabular-nums">
                {completionRate}%
              </span>
              <span className="text-xs text-slate-500">
                ({completed} of {total} milestones successfully closed)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-600">In Progress: <strong>{inProgress}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-red-700 font-bold">Overdue: <strong>{overdue}</strong></span>
            </div>
          </div>
        </div>

        {/* Visual progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
          <div
            className="bg-[#047857] h-3 transition-all duration-500"
            style={{ width: `${(completed / total) * 100}%` }}
            title={`Completed: ${completed}`}
          />
          <div
            className="bg-blue-500 h-3 transition-all duration-500"
            style={{ width: `${(inProgress / total) * 100}%` }}
            title={`In Progress: ${inProgress}`}
          />
          <div
            className="bg-[#DC2626] h-3 transition-all duration-500"
            style={{ width: `${(overdue / total) * 100}%` }}
            title={`Overdue: ${overdue}`}
          />
        </div>
      </div>

      {/* Filters, Search, and View Mode Toggle (List vs Kanban) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search goals, leaders, or mentors..."
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
              onClick={() => setOverdueOnly(!overdueOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                overdueOnly
                  ? 'bg-red-500 text-white border-red-600 shadow-xs'
                  : 'bg-white text-slate-700 border-gray-200 hover:border-red-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Overdue Only ({overdue})</span>
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100 text-xs">
          {viewMode === 'list' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filter by Leader
            </label>
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              <option value="All">All Leaders</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {viewMode === 'kanban' && (
            <div className="flex items-end text-slate-500 font-medium pb-1">
              <span>Drag & drop cards to transition workflow status</span>
            </div>
          )}
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const plansInCol = filteredPlans.filter((p) => p.status === col.status);
            const isDragOver = activeDropColumn === col.status;

            return (
              <div
                key={col.status}
                onDragOver={(e) => handleDragOver(e, col.status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.status)}
                className={`rounded-2xl border transition-all ${col.bg} ${
                  isDragOver
                    ? 'border-[#047857] ring-2 ring-[#047857]/40 bg-emerald-50/70 shadow-md'
                    : col.border
                } flex flex-col min-h-[540px]`}
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-inherit flex items-center justify-between bg-white/70 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <h3 className={`text-xs font-bold ${col.color} uppercase tracking-wider`}>
                      {col.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-2xs tabular-nums">
                    {plansInCol.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-3 flex-1 space-y-3 overflow-y-auto">
                  {plansInCol.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-gray-200/80 rounded-xl flex flex-col items-center justify-center p-3 text-center text-slate-400 text-xs">
                      <span>No plans in this stage</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Drop cards here</span>
                    </div>
                  ) : (
                    plansInCol.map((plan) => {
                      const isOverdue = plan.isOverdue;

                      return (
                        <div
                          key={plan.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, plan.id)}
                          className={`bg-white rounded-xl p-4 border transition-all shadow-xs hover:shadow-md cursor-grab active:cursor-grabbing relative group ${
                            isOverdue
                              ? 'border-red-300 ring-1 ring-red-200 bg-red-50/20'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          {/* Top Row: Category and Actions */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {plan.category}
                            </span>
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => onEditPlan(plan)}
                                className="p-1 text-slate-400 hover:text-[#047857] hover:bg-slate-100 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeletePlan(plan.id)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Goal Title */}
                          <h4 className="text-xs font-bold text-[#0B1F18] leading-snug mb-2">
                            {plan.goal}
                          </h4>

                          {/* Target Role & Mentor */}
                          {plan.targetPositionTitle && (
                            <div className="text-[11px] text-slate-500 mb-2 truncate">
                              Target: <strong className="text-slate-800">{plan.targetPositionTitle}</strong>
                            </div>
                          )}

                          {/* Leader info */}
                          <div
                            onClick={() => onSelectEmployee(plan.employeeId)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer mb-2.5"
                          >
                            <Avatar name={plan.employeeName} src={plan.employeeAvatar} size="sm" />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-900 hover:text-[#047857] transition-colors block truncate">
                                {plan.employeeName}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {plan.employeeTitle}
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1 mb-2.5">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-slate-400">Progress</span>
                              <strong className={isOverdue ? 'text-red-700' : 'text-[#047857]'}>
                                {plan.progressPercent}%
                              </strong>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  isOverdue ? 'bg-red-600' : 'bg-[#047857]'
                                }`}
                                style={{ width: `${plan.progressPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Due Date & Overdue Tag */}
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1 font-mono text-slate-500">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span className={isOverdue ? 'text-red-700 font-bold' : ''}>
                                {plan.dueDate}
                              </span>
                            </div>

                            {isOverdue && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#DC2626] bg-red-100 px-1.5 py-0.2 rounded">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Overdue
                              </span>
                            )}
                          </div>

                          {/* Quick Status Shift Controls */}
                          {onUpdateStatus && (
                            <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                              <span className="text-slate-400">Move to:</span>
                              <div className="flex items-center gap-1">
                                {kanbanColumns
                                  .filter((c) => c.status !== plan.status)
                                  .slice(0, 2)
                                  .map((targetCol) => (
                                    <button
                                      key={targetCol.status}
                                      type="button"
                                      onClick={() => onUpdateStatus(plan.id, targetCol.status)}
                                      className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                                    >
                                      {targetCol.title.split(' ')[0]}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom "+ Add Plan in this column" */}
                <div className="p-3 border-t border-inherit bg-white/40 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={() => onAddPlan(col.status)}
                    className="w-full py-1.5 text-xs font-semibold text-slate-600 hover:text-[#047857] hover:bg-white/80 rounded-lg border border-dashed border-gray-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to {col.title}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST / TABLE VIEW */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                  <th className="py-3.5 px-4">Development Goal & Scope</th>
                  <th className="py-3.5 px-4">Target Leader</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status & Progress</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredPlans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8">
                      <EmptyState
                        title="No development plans found"
                        description="Try adjusting active filters or click 'New Development Plan'."
                        actionLabel="Create Plan"
                        onAction={() => onAddPlan()}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((plan) => {
                    const isRedTint = plan.isOverdue;

                    return (
                      <tr
                        key={plan.id}
                        className={`transition-colors ${
                          isRedTint
                            ? 'bg-red-50/70 hover:bg-red-100/60 border-l-4 border-l-[#DC2626]'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Goal */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0B1F18] truncate max-w-sm">
                            {plan.goal}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            {plan.targetPositionTitle && (
                              <span>Target: <strong className="text-slate-700">{plan.targetPositionTitle}</strong></span>
                            )}
                            {plan.mentorName && (
                              <span>&middot; Mentor: {plan.mentorName}</span>
                            )}
                          </div>
                        </td>

                        {/* Employee */}
                        <td className="py-3.5 px-4">
                          <div
                            onClick={() => onSelectEmployee(plan.employeeId)}
                            className="flex items-center gap-2.5 cursor-pointer group"
                          >
                            <Avatar name={plan.employeeName} src={plan.employeeAvatar} size="sm" />
                            <div>
                              <span className="font-semibold text-slate-900 group-hover:text-[#047857] transition-colors block truncate">
                                {plan.employeeName}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {plan.employeeTitle}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {plan.category}
                          </span>
                        </td>

                        {/* Status & Progress */}
                        <td className="py-3.5 px-4 w-44">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                                  plan.status
                                )}`}
                              >
                                {plan.status}
                              </span>
                              <span className="font-mono text-xs font-semibold tabular-nums text-slate-700">
                                {plan.progressPercent}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  isRedTint ? 'bg-red-600' : 'bg-[#047857]'
                                }`}
                                style={{ width: `${plan.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Due Date & Overdue Tag */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span
                              className={`font-mono text-xs font-medium tabular-nums block ${
                                isRedTint ? 'text-red-700 font-bold' : 'text-slate-800'
                              }`}
                            >
                              {plan.dueDate}
                            </span>
                            {isRedTint && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#DC2626] bg-red-100 px-1.5 py-0.2 rounded">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Overdue
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => onEditPlan(plan)}
                              className="p-1.5 text-slate-400 hover:text-[#047857] hover:bg-white rounded transition-colors cursor-pointer"
                              title="Edit Plan"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeletePlan(plan.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Delete Plan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
