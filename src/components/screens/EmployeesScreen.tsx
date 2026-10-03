import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  UserPlus,
  ChevronRight,
  ShieldAlert,
  List,
  Columns3,
  Layers,
  Sparkles,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  GripVertical,
} from 'lucide-react';
import { SignatureBanner } from '../common/SignatureBanner';
import { Avatar } from '../common/Avatar';
import { RiskBadge } from '../common/RiskBadge';
import { ScoreBar } from '../common/ScoreBar';
import { EmptyState } from '../common/EmptyState';
import { Employee, RiskLevel } from '../../types';

interface EmployeesScreenProps {
  employees: Employee[];
  onSelectEmployee: (empId: string) => void;
  onUpdateEmployee?: (empId: string, updates: Partial<Employee>) => void;
  searchQuery?: string;
}

type KanbanGroupBy = 'flightRisk' | 'level' | 'boxGrid' | 'department';

export const EmployeesScreen: React.FC<EmployeesScreenProps> = ({
  employees,
  onSelectEmployee,
  onUpdateEmployee,
  searchQuery: externalSearchQuery = '',
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [kanbanGroupBy, setKanbanGroupBy] = useState<KanbanGroupBy>('flightRisk');
  const [internalSearch, setInternalSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [flightRiskFilter, setFlightRiskFilter] = useState('All');
  const [retireRiskFilter, setRetireRiskFilter] = useState('All');
  const [sortField, setSortField] = useState<'name' | 'performance' | 'potential' | 'flightRisk'>('performance');
  const [sortAsc, setSortAsc] = useState(false);
  const [draggedEmpId, setDraggedEmpId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<string | null>(null);

  const activeSearch = externalSearchQuery || internalSearch;

  const departments = ['All', 'Executive', 'Engineering', 'Operations', 'Product', 'Sales', 'Finance', 'People & Culture'];
  const levels = ['All', 'L10', 'L9', 'L8', 'L7', 'L6'];
  const riskOptions = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesSearch =
          emp.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
          emp.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
          emp.email.toLowerCase().includes(activeSearch.toLowerCase());
        const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
        const matchesLevel = levelFilter === 'All' || emp.level === levelFilter;
        const matchesFlightRisk = flightRiskFilter === 'All' || emp.flightRisk === flightRiskFilter;
        const matchesRetireRisk = retireRiskFilter === 'All' || emp.retirementRisk === retireRiskFilter;

        return matchesSearch && matchesDept && matchesLevel && matchesFlightRisk && matchesRetireRisk;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortField === 'performance') {
          comparison = a.performanceScore - b.performanceScore;
        } else if (sortField === 'potential') {
          comparison = a.potentialScore - b.potentialScore;
        } else if (sortField === 'flightRisk') {
          const riskWeight: Record<RiskLevel, number> = {
            Critical: 4,
            High: 3,
            Medium: 2,
            Low: 1,
            'Not assessed': 0,
          };
          comparison = riskWeight[a.flightRisk] - riskWeight[b.flightRisk];
        }
        return sortAsc ? comparison : -comparison;
      });
  }, [
    employees,
    activeSearch,
    deptFilter,
    levelFilter,
    flightRiskFilter,
    retireRiskFilter,
    sortField,
    sortAsc,
  ]);

  const toggleSort = (field: 'name' | 'performance' | 'potential' | 'flightRisk') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Kanban Columns definitions based on selected grouping
  const getKanbanColumns = () => {
    if (kanbanGroupBy === 'flightRisk') {
      return [
        { id: 'Critical', title: 'Critical Flight Risk', dot: 'bg-[#DC2626]', bg: 'bg-red-50/50', border: 'border-red-300', badge: 'bg-[#DC2626] text-white', desc: 'Active flight alerts requiring executive retention intervention' },
        { id: 'High', title: 'High Flight Risk', dot: 'bg-[#EA580C]', bg: 'bg-orange-50/40', border: 'border-orange-200', badge: 'bg-[#EA580C] text-white', desc: 'Key talent under external recruiter outreach' },
        { id: 'Medium', title: 'Medium Risk', dot: 'bg-[#D97706]', bg: 'bg-amber-50/40', border: 'border-amber-200', badge: 'bg-[#D97706] text-white', desc: 'Standard monitoring with bi-annual compensation calibration' },
        { id: 'Low', title: 'Low Flight Risk', dot: 'bg-[#16A34A]', bg: 'bg-emerald-50/40', border: 'border-emerald-200', badge: 'bg-[#047857] text-white', desc: 'Strong company engagement and long-term vesting equity' },
      ];
    }
    if (kanbanGroupBy === 'level') {
      return [
        { id: 'L10', title: 'L10 C-Suite', dot: 'bg-emerald-800', bg: 'bg-emerald-50/50', border: 'border-emerald-300', badge: 'bg-emerald-900 text-white', desc: 'Enterprise officers & board fiduciary leaders' },
        { id: 'L9', title: 'L9 Vice Presidents', dot: 'bg-[#047857]', bg: 'bg-emerald-50/40', border: 'border-emerald-200', badge: 'bg-[#047857] text-white', desc: 'Functional division executives' },
        { id: 'L8', title: 'L8 Senior Directors', dot: 'bg-teal-600', bg: 'bg-teal-50/40', border: 'border-teal-200', badge: 'bg-teal-700 text-white', desc: 'Multi-group leaders and operational owners' },
        { id: 'L7', title: 'L7 Directors', dot: 'bg-blue-600', bg: 'bg-blue-50/40', border: 'border-blue-200', badge: 'bg-blue-700 text-white', desc: 'Domain and department leaders' },
        { id: 'L6', title: 'L6 Lead / Staff', dot: 'bg-slate-500', bg: 'bg-slate-50/70', border: 'border-slate-200', badge: 'bg-slate-700 text-white', desc: 'Principal individual contributors and technical strategists' },
      ];
    }
    if (kanbanGroupBy === 'department') {
      return [
        { id: 'Executive', title: 'Executive', dot: 'bg-[#047857]', bg: 'bg-emerald-50/40', border: 'border-emerald-200', badge: 'bg-[#047857] text-white', desc: 'Enterprise governance & strategic direction' },
        { id: 'Engineering', title: 'Engineering', dot: 'bg-sky-600', bg: 'bg-sky-50/40', border: 'border-sky-200', badge: 'bg-sky-700 text-white', desc: 'Architecture, cloud infrastructure, AI platform' },
        { id: 'Operations', title: 'Operations', dot: 'bg-amber-600', bg: 'bg-amber-50/40', border: 'border-amber-200', badge: 'bg-amber-700 text-white', desc: 'Global supply chain & operational continuity' },
        { id: 'Product', title: 'Product', dot: 'bg-purple-600', bg: 'bg-purple-50/40', border: 'border-purple-200', badge: 'bg-purple-700 text-white', desc: 'Product portfolio, roadmap & UX design' },
        { id: 'Sales', title: 'Sales & GTM', dot: 'bg-rose-600', bg: 'bg-rose-50/40', border: 'border-rose-200', badge: 'bg-rose-700 text-white', desc: 'Global enterprise revenue & customer growth' },
        { id: 'Finance', title: 'Finance', dot: 'bg-emerald-600', bg: 'bg-emerald-50/40', border: 'border-emerald-200', badge: 'bg-emerald-800 text-white', desc: 'Capital allocation, audit & investor relations' },
        { id: 'People & Culture', title: 'People & Culture', dot: 'bg-pink-600', bg: 'bg-pink-50/40', border: 'border-pink-200', badge: 'bg-pink-700 text-white', desc: 'Talent succession, leadership development & HR' },
      ];
    }
    // 9-Box groupings
    return [
      { id: 'Star', title: 'Stars / Future Leaders', dot: 'bg-[#047857]', bg: 'bg-[#4EC69A]/20', border: 'border-[#4EC69A]', badge: 'bg-[#047857] text-white', desc: 'High Performance & High Potential' },
      { id: 'High Potential', title: 'High Potential', dot: 'bg-teal-600', bg: 'bg-teal-50/40', border: 'border-teal-200', badge: 'bg-teal-700 text-white', desc: 'Medium Performance & High Potential' },
      { id: 'Solid Performer', title: 'Solid Performers', dot: 'bg-emerald-600', bg: 'bg-emerald-50/40', border: 'border-emerald-200', badge: 'bg-emerald-700 text-white', desc: 'High Performance & Medium Potential' },
      { id: 'Core', title: 'Core & Specialists', dot: 'bg-slate-600', bg: 'bg-slate-50/70', border: 'border-slate-200', badge: 'bg-slate-700 text-white', desc: 'Core operational backbone & trusted domain experts' },
      { id: 'Risk', title: 'Talent Risk / Action Needed', dot: 'bg-[#DC2626]', bg: 'bg-red-50/50', border: 'border-red-200', badge: 'bg-[#DC2626] text-white', desc: 'Inconsistent performers requiring performance plan or PIP' },
    ];
  };

  const kanbanColumns = getKanbanColumns();

  // Helper to filter employee by Kanban column
  const matchesKanbanCol = (emp: Employee, colId: string): boolean => {
    if (kanbanGroupBy === 'flightRisk') return emp.flightRisk === colId;
    if (kanbanGroupBy === 'level') return emp.level === colId;
    if (kanbanGroupBy === 'department') return emp.department === colId;
    if (kanbanGroupBy === 'boxGrid') {
      if (colId === 'Star') return emp.boxGridPosition.includes('Star');
      if (colId === 'High Potential') return emp.boxGridPosition.includes('High Potential');
      if (colId === 'Solid Performer') return emp.boxGridPosition.includes('Solid Performer');
      if (colId === 'Core') return emp.boxGridPosition.includes('Core') || emp.boxGridPosition.includes('Specialist') || emp.boxGridPosition.includes('Contributor') || emp.boxGridPosition.includes('Rough Diamond');
      if (colId === 'Risk') return emp.boxGridPosition.includes('Inconsistent') || emp.boxGridPosition.includes('Underperformer');
    }
    return false;
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, empId: string) => {
    e.dataTransfer.setData('text/plain', empId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedEmpId(empId);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== colId) {
      setActiveDropColumn(colId);
    }
  };

  const handleDragLeave = () => {
    setActiveDropColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    const empId = e.dataTransfer.getData('text/plain') || draggedEmpId;
    if (empId && onUpdateEmployee) {
      if (kanbanGroupBy === 'flightRisk') {
        onUpdateEmployee(empId, { flightRisk: targetColId as RiskLevel });
      } else if (kanbanGroupBy === 'level') {
        onUpdateEmployee(empId, { level: targetColId });
      } else if (kanbanGroupBy === 'department') {
        onUpdateEmployee(empId, { department: targetColId });
      } else if (kanbanGroupBy === 'boxGrid') {
        if (targetColId === 'Star') {
          onUpdateEmployee(empId, { performanceScore: 4.8, potentialScore: 4.8, boxGridPosition: 'Star / Future C-Suite Leader' });
        } else if (targetColId === 'High Potential') {
          onUpdateEmployee(empId, { performanceScore: 4.2, potentialScore: 4.7, boxGridPosition: 'High Potential / Growth Star' });
        } else if (targetColId === 'Solid Performer') {
          onUpdateEmployee(empId, { performanceScore: 4.7, potentialScore: 4.2, boxGridPosition: 'Solid Performer / High Impact' });
        } else if (targetColId === 'Core') {
          onUpdateEmployee(empId, { performanceScore: 4.2, potentialScore: 4.2, boxGridPosition: 'Core Employee / Key Backbone' });
        } else if (targetColId === 'Risk') {
          onUpdateEmployee(empId, { performanceScore: 3.4, potentialScore: 3.4, boxGridPosition: 'Underperformer / Talent Risk' });
        }
      }
    }
    setDraggedEmpId(null);
    setActiveDropColumn(null);
  };

  return (
    <div className="space-y-6">
      <SignatureBanner
        title="Leadership Talent Directory"
        subtitle="Search, evaluate performance mini-bars, assess flight risks, and drill down into individual profiles."
        badge="Talent Pool Management"
      />

      {/* Filter, Search, and View Mode Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, executive title, or email..."
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
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

            {/* In Kanban Mode: Column Grouping Selector */}
            {viewMode === 'kanban' && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 hidden lg:inline">Group By:</span>
                <select
                  value={kanbanGroupBy}
                  onChange={(e) => setKanbanGroupBy(e.target.value as KanbanGroupBy)}
                  className="p-1.5 bg-slate-50 border border-gray-200 rounded-lg font-bold text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
                >
                  <option value="flightRisk">Flight Risk</option>
                  <option value="boxGrid">9-Box Classification</option>
                  <option value="level">Seniority Level</option>
                  <option value="department">Department</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 text-xs">
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
              Seniority Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Flight Risk
            </label>
            <select
              value={flightRiskFilter}
              onChange={(e) => setFlightRiskFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              {riskOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Retirement Risk
            </label>
            <select
              value={retireRiskFilter}
              onChange={(e) => setRetireRiskFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              {riskOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="space-y-4">
          {/* Quick Kanban Stats Strip */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-slate-500">
                Board Talent: <strong className="text-slate-900 font-mono tabular-nums">{filteredEmployees.length}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">
                Key Talent: <strong className="text-[#047857] font-mono tabular-nums">{filteredEmployees.filter((e) => e.isKeyTalent).length}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">
                Avg Perf:{' '}
                <strong className="text-slate-900 font-mono tabular-nums">
                  {(
                    filteredEmployees.reduce((acc, e) => acc + e.performanceScore, 0) /
                    (filteredEmployees.length || 1)
                  ).toFixed(1)}{' '}
                  / 5.0
                </strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1 text-red-600 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  High/Critical Flight Risk:{' '}
                  <strong className="font-mono tabular-nums">
                    {filteredEmployees.filter((e) => e.flightRisk === 'Critical' || e.flightRisk === 'High').length}
                  </strong>
                </span>
              </span>
            </div>

            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
              <GripVertical className="w-3.5 h-3.5 text-[#047857]" />
              <span>Drag cards across columns to reclassify</span>
            </div>
          </div>

          <div
            className={`grid gap-4 items-start ${
              kanbanColumns.length === 7
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7'
                : kanbanColumns.length === 5
                ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {kanbanColumns.map((col) => {
              const employeesInCol = filteredEmployees.filter((emp) => matchesKanbanCol(emp, col.id));
              const isDragOver = activeDropColumn === col.id;

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`rounded-2xl border transition-all ${col.bg} ${
                    isDragOver
                      ? 'border-[#047857] ring-2 ring-[#047857]/40 bg-emerald-50/80 shadow-md'
                      : col.border
                  } flex flex-col min-h-[580px] shadow-xs`}
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-inherit bg-white/85 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.dot} shrink-0`} />
                      <h3 className="text-xs font-extrabold text-[#0B1F18] uppercase tracking-wider truncate">
                        {col.title}
                      </h3>
                    </div>
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${col.badge} tabular-nums shrink-0`}>
                      {employeesInCol.length}
                    </span>
                  </div>

                  {/* Column Description Subtitle */}
                  <div className="px-3.5 py-1.5 bg-white/40 border-b border-inherit text-[10px] text-slate-500 line-clamp-1">
                    {col.desc}
                  </div>

                  {/* Cards Container */}
                  <div className="p-3 flex-1 space-y-3 overflow-y-auto">
                    {employeesInCol.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-3 text-center text-slate-400 text-xs">
                        No leaders in this column
                      </div>
                    ) : (
                      employeesInCol.map((emp) => (
                        <div
                          key={emp.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, emp.id)}
                          onClick={() => onSelectEmployee(emp.id)}
                          className="bg-white rounded-xl p-3.5 border border-gray-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-grab active:cursor-grabbing group relative"
                        >
                          {/* Drag handle & top bar */}
                          <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 min-w-0">
                              <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0" />
                              <Avatar name={emp.name} src={emp.avatar} size="md" />
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                                  {emp.name}
                                </h4>
                                <span className="text-[11px] text-slate-500 truncate block">
                                  {emp.title}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded shrink-0">
                              {emp.level}
                            </span>
                          </div>

                        {/* Department & Experience */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                          <span className="font-medium text-slate-700 truncate">{emp.department}</span>
                          <span className="font-mono">{emp.yearsExperience} yrs exp</span>
                        </div>

                        {/* Performance & Potential Mini Bars */}
                        <div className="space-y-1.5 py-1 mb-2 bg-slate-50 p-2 rounded-lg">
                          <ScoreBar label="Perf" value={emp.performanceScore} color="emerald" size="sm" />
                          <ScoreBar label="Pot" value={emp.potentialScore} color="mint" size="sm" />
                        </div>

                        {/* Badges: Risk & 9-Box */}
                        <div className="flex items-center justify-between gap-1 pt-1 text-[11px]">
                          <RiskBadge level={emp.flightRisk} size="sm" />
                          {emp.isKeyTalent && (
                            <span className="text-[10px] font-bold text-[#064E3B] bg-[#4EC69A]/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-[#047857]" />
                              Key
                            </span>
                          )}
                        </div>

                        {/* Footer action */}
                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="truncate max-w-28">{emp.boxGridPosition.split('/')[0]}</span>
                          <span className="text-[#047857] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            <span>Profile</span>
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
      </div>
    ) : (
        /* SORTABLE LIST / TABLE VIEW */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                  <th
                    onClick={() => toggleSort('name')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-800"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Leader & Role</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Department & Level</th>
                  <th
                    onClick={() => toggleSort('performance')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-800 w-36"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Performance (1-5)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('potential')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-800 w-36"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Potential (1-5)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('flightRisk')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-800"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Flight Risk</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Retirement Horizon</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8">
                      <EmptyState
                        title="No matching leaders found"
                        description="Try adjusting your search criteria, clearing active filters, or selecting a different department."
                        actionLabel="Reset All Filters"
                        onAction={() => {
                          setInternalSearch('');
                          setDeptFilter('All');
                          setLevelFilter('All');
                          setFlightRiskFilter('All');
                          setRetireRiskFilter('All');
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      onClick={() => onSelectEmployee(emp.id)}
                      className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Leader & Role */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={emp.name} src={emp.avatar} size="md" />
                          <div className="min-w-0">
                            <div className="font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                              {emp.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {emp.title}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department & Level */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span className="font-medium text-slate-800">{emp.department}</span>
                        <span className="text-[11px] text-slate-400 block font-mono">
                          {emp.level} &middot; {emp.yearsExperience} yrs exp
                        </span>
                      </td>

                      {/* Performance Mini-Bar */}
                      <td className="py-3.5 px-4">
                        <ScoreBar value={emp.performanceScore} color="emerald" size="sm" />
                      </td>

                      {/* Potential Mini-Bar */}
                      <td className="py-3.5 px-4">
                        <ScoreBar value={emp.potentialScore} color="mint" size="sm" />
                      </td>

                      {/* Flight Risk Badge */}
                      <td className="py-3.5 px-4">
                        <RiskBadge level={emp.flightRisk} size="sm" />
                      </td>

                      {/* Retirement Risk */}
                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        {emp.retireYears ? (
                          <div className="flex items-center gap-1.5">
                            <RiskBadge level={emp.retirementRisk} size="sm" />
                            <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                              (~{emp.retireYears} yrs)
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Not assessed</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEmployee(emp.id);
                          }}
                          className="p-1.5 text-slate-400 group-hover:text-[#047857] group-hover:bg-white rounded-lg transition-all cursor-pointer"
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
