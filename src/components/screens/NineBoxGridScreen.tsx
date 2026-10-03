import React, { useState, useMemo } from 'react';
import {
  Grid3X3,
  Filter,
  Users,
  ExternalLink,
  ChevronRight,
  Info,
  Search,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Move,
  ShieldAlert,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  Download,
  BookOpen,
  Table,
  Flame,
  Palette,
  Layers,
  X,
} from 'lucide-react';
import { SignatureBanner } from '../common/SignatureBanner';
import { Avatar } from '../common/Avatar';
import { RiskBadge } from '../common/RiskBadge';
import { Modal } from '../common/Modal';
import { Employee, ActiveScreen } from '../../types';

interface NineBoxGridScreenProps {
  employees: Employee[];
  onSelectEmployee: (empId: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onUpdateEmployee?: (empId: string, updates: Partial<Employee>) => void;
}

export type StrategicTier = 'all' | 'growth' | 'core' | 'risk';
export type ColorSchemeMode = 'standard' | 'traffic-light' | 'heatmap';
export type ViewMode = 'cards' | 'compact' | 'table';

export interface BoxDefinition {
  id: string;
  name: string;
  shortName: string;
  tier: 'growth' | 'core' | 'risk';
  x: 'Low' | 'Medium' | 'High'; // Performance
  y: 'High' | 'Medium' | 'Low'; // Potential
  minPerf: number;
  maxPerf: number;
  minPot: number;
  maxPot: number;
  targetPerfScore: number;
  targetPotScore: number;
  tagline: string;
  recommendation: string;
  // Standard 3-Tier styling
  bgStandard: string;
  borderStandard: string;
  badgeStandard: string;
  accentStandard: string;
  // Traffic-Light styling
  bgTraffic: string;
  borderTraffic: string;
  badgeTraffic: string;
  accentTraffic: string;
  icon?: React.ElementType;
}

export const NineBoxGridScreen: React.FC<NineBoxGridScreenProps> = ({
  employees,
  onSelectEmployee,
  onNavigate,
  onUpdateEmployee,
}) => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedTier, setSelectedTier] = useState<StrategicTier>('all');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [colorScheme, setColorScheme] = useState<ColorSchemeMode>('standard');
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);
  const [draggedEmpId, setDraggedEmpId] = useState<string | null>(null);
  const [activeDropBoxId, setActiveDropBoxId] = useState<string | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [tableSortField, setTableSortField] = useState<'name' | 'perf' | 'pot' | 'tier'>('perf');
  const [tableSortAsc, setTableSortAsc] = useState(false);

  const departments = ['All', 'Executive', 'Engineering', 'Operations', 'Product', 'Sales', 'Finance', 'People & Culture'];
  const levels = ['All', 'L10', 'L9', 'L8', 'L7', 'L6'];

  const departmentColors: Record<string, string> = {
    Executive: '#047857', // emerald
    Engineering: '#0284C7', // sky
    Operations: '#D97706', // amber
    Product: '#7C3AED', // purple
    Sales: '#E11D48', // rose
    Finance: '#059669', // emerald
    'People & Culture': '#DB2777', // pink
  };

  const getDeptColor = (dept: string) => departmentColors[dept] || '#4B5563';

  // Standard HR 9-Box Architecture (ordered by row: High Potential, Medium Potential, Low Potential)
  const boxes: BoxDefinition[] = [
    // Top Row: Potential = High
    {
      id: 'rough-diamond',
      name: 'Rough Diamond / Enigma',
      shortName: 'Rough Diamond',
      tier: 'core',
      x: 'Low',
      y: 'High',
      minPerf: 1.0,
      maxPerf: 3.9,
      minPot: 4.5,
      maxPot: 5.0,
      targetPerfScore: 3.8,
      targetPotScore: 4.8,
      tagline: 'High strategic potential with inconsistent day-to-day execution.',
      recommendation: 'Targeted operational coaching, skill scaffolding, and verified role fit calibration.',
      bgStandard: 'bg-indigo-50/45',
      borderStandard: 'border-indigo-200',
      badgeStandard: 'bg-indigo-100 text-indigo-900 border border-indigo-300',
      accentStandard: 'text-indigo-900',
      bgTraffic: 'bg-amber-50/50',
      borderTraffic: 'border-amber-200',
      badgeTraffic: 'bg-amber-100 text-amber-900 border border-amber-300',
      accentTraffic: 'text-amber-900',
      icon: Sparkles,
    },
    {
      id: 'high-potential',
      name: 'High Potential / Growth Star',
      shortName: 'High Potential',
      tier: 'growth',
      x: 'Medium',
      y: 'High',
      minPerf: 4.0,
      maxPerf: 4.4,
      minPot: 4.5,
      maxPot: 5.0,
      targetPerfScore: 4.3,
      targetPotScore: 4.7,
      tagline: 'Strong reliable delivery with high runway for enterprise scope.',
      recommendation: 'Stretch cross-functional initiatives, executive mentorship, and tier-1 succession backfill.',
      bgStandard: 'bg-teal-50/50',
      borderStandard: 'border-teal-200',
      badgeStandard: 'bg-teal-100 text-teal-900 border border-teal-300',
      accentStandard: 'text-teal-900',
      bgTraffic: 'bg-emerald-50/60',
      borderTraffic: 'border-emerald-300',
      badgeTraffic: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      accentTraffic: 'text-emerald-900',
      icon: Sparkles,
    },
    {
      id: 'star-leader',
      name: 'Star / Future C-Suite Leader',
      shortName: 'Star Leader',
      tier: 'growth',
      x: 'High',
      y: 'High',
      minPerf: 4.5,
      maxPerf: 5.0,
      minPot: 4.5,
      maxPot: 5.0,
      targetPerfScore: 4.9,
      targetPotScore: 4.9,
      tagline: 'Top 5-10% enterprise performers demonstrating visionary execution.',
      recommendation: 'Fast-track promotion, immediate board visibility, long-term equity retention incentives.',
      bgStandard: 'bg-[#4EC69A]/15',
      borderStandard: 'border-[#4EC69A]',
      badgeStandard: 'bg-[#047857] text-white shadow-xs',
      accentStandard: 'text-[#064E3B]',
      bgTraffic: 'bg-emerald-100/40',
      borderTraffic: 'border-emerald-400',
      badgeTraffic: 'bg-[#047857] text-white shadow-xs',
      accentTraffic: 'text-[#064E3B]',
      icon: Star,
    },

    // Middle Row: Potential = Medium
    {
      id: 'inconsistent-player',
      name: 'Inconsistent Player / Dilemma',
      shortName: 'Inconsistent Player',
      tier: 'risk',
      x: 'Low',
      y: 'Medium',
      minPerf: 1.0,
      maxPerf: 3.9,
      minPot: 4.0,
      maxPot: 4.4,
      targetPerfScore: 3.7,
      targetPotScore: 4.1,
      tagline: 'Unsteady delivery; potential to reach core status with proper support.',
      recommendation: 'Targeted performance plan, obstacle discovery, and 90-day progress check-in.',
      bgStandard: 'bg-amber-50/50',
      borderStandard: 'border-amber-200',
      badgeStandard: 'bg-amber-100 text-amber-900 border border-amber-300',
      accentStandard: 'text-amber-900',
      bgTraffic: 'bg-orange-50/50',
      borderTraffic: 'border-orange-200',
      badgeTraffic: 'bg-orange-100 text-orange-900 border border-orange-300',
      accentTraffic: 'text-orange-900',
      icon: AlertTriangle,
    },
    {
      id: 'core-employee',
      name: 'Core Employee / Key Backbone',
      shortName: 'Core Backbone',
      tier: 'core',
      x: 'Medium',
      y: 'Medium',
      minPerf: 4.0,
      maxPerf: 4.4,
      minPot: 4.0,
      maxPot: 4.4,
      targetPerfScore: 4.2,
      targetPotScore: 4.2,
      tagline: 'Reliable day-to-day organizational pillar with dependable contribution.',
      recommendation: 'Maintain high engagement, recognize consistent delivery, explore lateral breadth.',
      bgStandard: 'bg-slate-50',
      borderStandard: 'border-slate-200',
      badgeStandard: 'bg-slate-200 text-slate-800 border border-slate-300',
      accentStandard: 'text-slate-800',
      bgTraffic: 'bg-amber-50/40',
      borderTraffic: 'border-amber-200',
      badgeTraffic: 'bg-amber-100 text-amber-800 border border-amber-200',
      accentTraffic: 'text-amber-800',
      icon: Users,
    },
    {
      id: 'solid-performer',
      name: 'Solid Performer / High Impact',
      shortName: 'Solid Performer',
      tier: 'growth',
      x: 'High',
      y: 'Medium',
      minPerf: 4.5,
      maxPerf: 5.0,
      minPot: 4.0,
      maxPot: 4.4,
      targetPerfScore: 4.7,
      targetPotScore: 4.3,
      tagline: 'Exceptional individual execution master; steady growth velocity.',
      recommendation: 'Broaden managerial exposure, project leadership, and retain as critical expert.',
      bgStandard: 'bg-emerald-50/50',
      borderStandard: 'border-emerald-200',
      badgeStandard: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      accentStandard: 'text-emerald-900',
      bgTraffic: 'bg-emerald-50/50',
      borderTraffic: 'border-emerald-200',
      badgeTraffic: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      accentTraffic: 'text-emerald-900',
      icon: CheckCircle2,
    },

    // Bottom Row: Potential = Low
    {
      id: 'underperformer',
      name: 'Underperformer / Talent Risk',
      shortName: 'Talent Risk',
      tier: 'risk',
      x: 'Low',
      y: 'Low',
      minPerf: 1.0,
      maxPerf: 3.9,
      minPot: 1.0,
      maxPot: 3.9,
      targetPerfScore: 3.2,
      targetPotScore: 3.2,
      tagline: 'Low execution output and limited capacity for increased complexity.',
      recommendation: 'Formal Performance Improvement Plan (PIP), role reassignment, or exit protocol.',
      bgStandard: 'bg-red-50/50',
      borderStandard: 'border-red-200',
      badgeStandard: 'bg-red-100 text-red-900 border border-red-300',
      accentStandard: 'text-red-900',
      bgTraffic: 'bg-red-50/60',
      borderTraffic: 'border-red-300',
      badgeTraffic: 'bg-[#DC2626] text-white',
      accentTraffic: 'text-red-900',
      icon: ShieldAlert,
    },
    {
      id: 'solid-contributor',
      name: 'Solid Contributor / Effective',
      shortName: 'Solid Contributor',
      tier: 'core',
      x: 'Medium',
      y: 'Low',
      minPerf: 4.0,
      maxPerf: 4.4,
      minPot: 1.0,
      maxPot: 3.9,
      targetPerfScore: 4.1,
      targetPotScore: 3.6,
      tagline: 'Consistently meets role objectives; low desire or readiness for mobility.',
      recommendation: 'Keep motivated in current scope; support steady execution excellence.',
      bgStandard: 'bg-slate-50/70',
      borderStandard: 'border-slate-200',
      badgeStandard: 'bg-slate-200 text-slate-700 border border-slate-300',
      accentStandard: 'text-slate-700',
      bgTraffic: 'bg-slate-50',
      borderTraffic: 'border-slate-200',
      badgeTraffic: 'bg-slate-200 text-slate-700 border border-slate-300',
      accentTraffic: 'text-slate-700',
      icon: Users,
    },
    {
      id: 'specialist-expert',
      name: 'Specialist / Trusted Authority',
      shortName: 'Specialist Expert',
      tier: 'core',
      x: 'High',
      y: 'Low',
      minPerf: 4.5,
      maxPerf: 5.0,
      minPot: 1.0,
      maxPot: 3.9,
      targetPerfScore: 4.7,
      targetPotScore: 3.7,
      tagline: 'Irreplaceable domain authority; technical rather than executive trajectory.',
      recommendation: 'Dual-ladder technical mastery track, patent bonuses, knowledge transfer coaching.',
      bgStandard: 'bg-sky-50/50',
      borderStandard: 'border-sky-200',
      badgeStandard: 'bg-sky-100 text-sky-900 border border-sky-300',
      accentStandard: 'text-sky-900',
      bgTraffic: 'bg-sky-50/50',
      borderTraffic: 'border-sky-200',
      badgeTraffic: 'bg-sky-100 text-sky-900 border border-sky-300',
      accentTraffic: 'text-sky-900',
      icon: ShieldCheck,
    },
  ];

  // Helper to categorize employee into 1 of 9 boxes
  const getEmployeeBoxId = (emp: Employee): string => {
    const perfTier = emp.performanceScore >= 4.5 ? 'High' : emp.performanceScore >= 4.0 ? 'Medium' : 'Low';
    const potTier = emp.potentialScore >= 4.5 ? 'High' : emp.potentialScore >= 4.0 ? 'Medium' : 'Low';

    if (potTier === 'High' && perfTier === 'High') return 'star-leader';
    if (potTier === 'High' && perfTier === 'Medium') return 'high-potential';
    if (potTier === 'High' && perfTier === 'Low') return 'rough-diamond';

    if (potTier === 'Medium' && perfTier === 'High') return 'solid-performer';
    if (potTier === 'Medium' && perfTier === 'Medium') return 'core-employee';
    if (potTier === 'Medium' && perfTier === 'Low') return 'inconsistent-player';

    if (potTier === 'Low' && perfTier === 'High') return 'specialist-expert';
    if (potTier === 'Low' && perfTier === 'Medium') return 'solid-contributor';
    return 'underperformer';
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchDept = selectedDept === 'All' || emp.department === selectedDept;
      const matchLevel = selectedLevel === 'All' || emp.level === selectedLevel;
      const matchSearch =
        searchQuery.trim() === '' ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchLevel && matchSearch;
    });
  }, [employees, selectedDept, selectedLevel, searchQuery]);

  // Distribution Statistics
  const stats = useMemo(() => {
    const total = filteredEmployees.length || 1;
    const growthCount = filteredEmployees.filter((e) => {
      const boxId = getEmployeeBoxId(e);
      return boxId === 'star-leader' || boxId === 'high-potential' || boxId === 'solid-performer';
    }).length;
    const coreCount = filteredEmployees.filter((e) => {
      const boxId = getEmployeeBoxId(e);
      return boxId === 'rough-diamond' || boxId === 'core-employee' || boxId === 'specialist-expert' || boxId === 'solid-contributor';
    }).length;
    const riskCount = filteredEmployees.filter((e) => {
      const boxId = getEmployeeBoxId(e);
      return boxId === 'inconsistent-player' || boxId === 'underperformer';
    }).length;

    const growthPct = Math.round((growthCount / total) * 100);
    const corePct = Math.round((coreCount / total) * 100);
    const riskPct = Math.round((riskCount / total) * 100);

    return {
      growthCount,
      growthPct,
      coreCount,
      corePct,
      riskCount,
      riskPct,
      totalCount: filteredEmployees.length,
    };
  }, [filteredEmployees]);

  // Dynamic box styling based on colorScheme mode
  const getBoxStyles = (box: BoxDefinition, count: number) => {
    if (colorScheme === 'traffic-light') {
      return {
        bg: box.bgTraffic,
        border: box.borderTraffic,
        badge: box.badgeTraffic,
        accent: box.accentTraffic,
      };
    }
    if (colorScheme === 'heatmap') {
      // Density based shading
      if (count >= 3) {
        return {
          bg: 'bg-emerald-100/60',
          border: 'border-emerald-400',
          badge: 'bg-[#047857] text-white',
          accent: 'text-[#064E3B]',
        };
      }
      if (count >= 1) {
        return {
          bg: 'bg-emerald-50/40',
          border: 'border-emerald-200',
          badge: 'bg-emerald-100 text-[#064E3B] border border-emerald-300',
          accent: 'text-[#064E3B]',
        };
      }
      return {
        bg: 'bg-slate-50/50',
        border: 'border-slate-200',
        badge: 'bg-slate-100 text-slate-500 border border-slate-200',
        accent: 'text-slate-600',
      };
    }
    // Standard HR 3-tier styling
    return {
      bg: box.bgStandard,
      border: box.borderStandard,
      badge: box.badgeStandard,
      accent: box.accentStandard,
    };
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, empId: string) => {
    e.dataTransfer.setData('text/plain', empId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedEmpId(empId);
  };

  const handleDragOver = (e: React.DragEvent, boxId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropBoxId !== boxId) {
      setActiveDropBoxId(boxId);
    }
  };

  const handleDragLeave = () => {
    setActiveDropBoxId(null);
  };

  const handleDrop = (e: React.DragEvent, targetBoxId: string) => {
    e.preventDefault();
    const empId = e.dataTransfer.getData('text/plain') || draggedEmpId;
    const targetBox = boxes.find((b) => b.id === targetBoxId);

    if (empId && targetBox && onUpdateEmployee) {
      onUpdateEmployee(empId, {
        performanceScore: targetBox.targetPerfScore,
        potentialScore: targetBox.targetPotScore,
        boxGridPosition: targetBox.name,
      });
    }

    setDraggedEmpId(null);
    setActiveDropBoxId(null);
  };

  // Recalibrate from popover or table select
  const handleRecalibrate = (empId: string, targetBoxId: string) => {
    if (!onUpdateEmployee) return;
    const targetBox = boxes.find((b) => b.id === targetBoxId);
    if (targetBox) {
      onUpdateEmployee(empId, {
        performanceScore: targetBox.targetPerfScore,
        potentialScore: targetBox.targetPotScore,
        boxGridPosition: targetBox.name,
      });
      if (activeEmployee && activeEmployee.id === empId) {
        setActiveEmployee({
          ...activeEmployee,
          performanceScore: targetBox.targetPerfScore,
          potentialScore: targetBox.targetPotScore,
          boxGridPosition: targetBox.name,
        });
      }
    }
  };

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = [
      'Name',
      'Title',
      'Department',
      'Seniority Level',
      '9-Box Placement',
      'Performance Score',
      'Potential Score',
      'Flight Risk',
      'Retirement Risk',
      'Key Talent',
      'Recommended Action',
    ];

    const rows = filteredEmployees.map((emp) => {
      const boxId = getEmployeeBoxId(emp);
      const box = boxes.find((b) => b.id === boxId);
      return [
        `"${emp.name}"`,
        `"${emp.title}"`,
        `"${emp.department}"`,
        `"${emp.level}"`,
        `"${emp.boxGridPosition}"`,
        emp.performanceScore.toFixed(1),
        emp.potentialScore.toFixed(1),
        `"${emp.flightRisk}"`,
        `"${emp.retirementRisk}"`,
        emp.isKeyTalent ? 'Yes' : 'No',
        `"${box?.recommendation || ''}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Talent_Calibration_9Box_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <SignatureBanner
        title="9-Box Performance & Potential Matrix"
        subtitle="Standardized executive calibration suite: evaluate bench readiness, detect talent gaps, and plan succession tracks."
        badge="Executive Talent Calibration"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGuideModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-800/80 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer border border-emerald-600/40"
              title="Review 9-box calibration guide and standard color coding rationale"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Color & Rating Guide</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-white text-[#047857] hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer focus-ring"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {/* Strategic Tier Distribution & Benchmark Calibration Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Executive Talent Distribution & Benchmark Curve
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {stats.totalCount} leaders assessed
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Calibrated against enterprise target curve (Target: ~15-20% Growth &middot; ~65-75% Core &middot; ~10-15% Risk)
            </span>
          </div>

          {/* Quick Strategic Tier Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTier(selectedTier === 'growth' ? 'all' : 'growth')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedTier === 'growth'
                  ? 'bg-[#047857] text-white shadow-xs ring-2 ring-[#047857]/40'
                  : 'bg-emerald-50 text-[#064E3B] hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Growth / Stars ({stats.growthCount} &middot; {stats.growthPct}%)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier(selectedTier === 'core' ? 'all' : 'core')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedTier === 'core'
                  ? 'bg-slate-800 text-white shadow-xs ring-2 ring-slate-800/40'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Core Backbone ({stats.coreCount} &middot; {stats.corePct}%)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier(selectedTier === 'risk' ? 'all' : 'risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedTier === 'risk'
                  ? 'bg-[#DC2626] text-white shadow-xs ring-2 ring-red-600/40'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Action Needed ({stats.riskCount} &middot; {stats.riskPct}%)</span>
            </button>

            {selectedTier !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedTier('all')}
                className="px-2 py-1 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                title="Clear Tier Filter"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Visual Multi-Segment Distribution Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex shadow-inner">
            <div
              className="bg-[#047857] h-3 transition-all duration-500"
              style={{ width: `${stats.growthPct}%` }}
              title={`Growth / Stars: ${stats.growthCount} leaders (${stats.growthPct}%)`}
            />
            <div
              className="bg-slate-500 h-3 transition-all duration-500"
              style={{ width: `${stats.corePct}%` }}
              title={`Core Backbone: ${stats.coreCount} leaders (${stats.corePct}%)`}
            />
            <div
              className="bg-[#DC2626] h-3 transition-all duration-500"
              style={{ width: `${stats.riskPct}%` }}
              title={`Action Needed: ${stats.riskCount} leaders (${stats.riskPct}%)`}
            />
          </div>

          {/* Benchmark comparison footnotes */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
            <span className="flex items-center gap-1.5 text-[#064E3B]">
              <span className="w-2 h-2 rounded-full bg-[#047857]" />
              <strong>Growth Tier:</strong> {stats.growthPct}% vs 15-20% target{' '}
              <span className="text-[10px] text-slate-400 font-normal">
                {stats.growthPct >= 15 ? '(Optimal Bench Strength)' : '(Succession Pipeline Building Required)'}
              </span>
            </span>

            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <strong>Core Backbone:</strong> {stats.corePct}% vs 65-75% target{' '}
              <span className="text-[10px] text-slate-400 font-normal">(Organizational Stability Engine)</span>
            </span>

            <span className="flex items-center gap-1.5 text-red-700">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              <strong>Talent Risk:</strong> {stats.riskPct}% vs 10-15% target{' '}
              <span className="text-[10px] text-slate-400 font-normal">
                {stats.riskPct <= 15 ? '(Low Risk Concentration)' : '(Active PIP Interventions Required)'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Department, Level, Color Scheme, and View Mode Toggle */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search leader */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leader by name, executive title, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                &times;
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Department Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] hidden sm:inline">Dept:</span>
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

            {/* Seniority Level Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] hidden sm:inline">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Standard Color Scheme Mode Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] hidden xl:inline">Palette:</span>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value as ColorSchemeMode)}
                className="p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
                title="Select 9-box color coding model"
              >
                <option value="standard">Standard HR 3-Tier (Emerald/Slate/Red)</option>
                <option value="traffic-light">Executive Traffic Light (Green/Amber/Red)</option>
                <option value="heatmap">Talent Density Heatmap</option>
              </select>
            </div>

            {/* View Mode Toggle: Cards vs Compact Dots vs Calibration Table */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-[#047857] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Spacious Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  viewMode === 'compact'
                    ? 'bg-[#047857] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Compact Avatars / Dots View"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dots</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#047857] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Calibration Table View"
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legend Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Department Border:
            </span>
            {Object.entries(departmentColors).map(([dept, color]) => (
              <div key={dept} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-slate-600 font-medium text-[11px]">{dept}</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <Move className="w-3 h-3 text-[#047857]" />
            <span>Drag leaders between boxes to recalibrate scores & placement</span>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1 & 2: 9-BOX MATRIX GRID WITH EXPLICIT DUAL AXES */}
      {viewMode !== 'table' ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs relative">
          <div className="flex flex-col">
            {/* Top Growth Banner / Vector Label */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#064E3B] uppercase tracking-wider flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4 text-[#047857]" />
                  Executive Leadership Trajectory
                </span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">
                  (Optimal Succession Vector: Bottom-Left &rarr; Top-Right)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Palette Mode:</span>
                <span className="text-[11px] font-semibold text-[#047857] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {colorScheme === 'standard' ? 'Standard HR 3-Tier' : colorScheme === 'traffic-light' ? 'Traffic-Light' : 'Talent Density Heatmap'}
                </span>
              </div>
            </div>

            {/* Grid Layout with Y-Axis column on left */}
            <div className="flex gap-4">
              {/* Y-Axis Label Bar on Left */}
              <div className="w-14 sm:w-16 flex flex-col justify-between py-8 text-center text-slate-500 border-r border-gray-200/80 pr-2 shrink-0 select-none">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider block">
                    High Pot.
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block">4.5 - 5.0</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Med Pot.
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block">4.0 - 4.4</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Low Pot.
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block">&lt;4.0</span>
                </div>
              </div>

              {/* 3x3 Grid Matrix */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {boxes.map((box) => {
                  const boxEmployees = filteredEmployees.filter((e) => getEmployeeBoxId(e) === box.id);
                  const isDragOver = activeDropBoxId === box.id;
                  const isTierDimmed = selectedTier !== 'all' && box.tier !== selectedTier;
                  const IconComponent = box.icon;
                  const boxStyles = getBoxStyles(box, boxEmployees.length);

                  return (
                    <div
                      key={box.id}
                      onDragOver={(e) => handleDragOver(e, box.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, box.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 min-h-64 flex flex-col justify-between relative ${
                        boxStyles.bg
                      } ${
                        isDragOver
                          ? 'border-[#047857] ring-3 ring-[#047857]/40 shadow-lg bg-emerald-50 scale-[1.01]'
                          : boxStyles.border
                      } ${isTierDimmed ? 'opacity-35 grayscale-20' : 'opacity-100'} shadow-xs`}
                    >
                      {/* Box Header */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {IconComponent && (
                              <IconComponent className={`w-3.5 h-3.5 ${boxStyles.accent}`} />
                            )}
                            <h4 className={`text-xs font-extrabold ${boxStyles.accent} tracking-tight`}>
                              {box.name}
                            </h4>
                          </div>
                          <span
                            className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded-full shrink-0 tabular-nums ${boxStyles.badge}`}
                          >
                            {boxEmployees.length}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-500 leading-tight mb-2">
                          {box.tagline}
                        </p>
                      </div>

                      {/* Drop Zone Callout when dragging over */}
                      {isDragOver && (
                        <div className="my-2 p-2 bg-emerald-100/80 border border-dashed border-[#047857] rounded-lg text-center text-xs font-bold text-[#064E3B] animate-pulse">
                          Drop to calibrate ({box.targetPerfScore.toFixed(1)} P &middot; {box.targetPotScore.toFixed(1)} Pot)
                        </div>
                      )}

                      {/* Employee Cards or Dots Container */}
                      <div className={`py-2 flex-1 space-y-2 ${viewMode === 'compact' ? 'overflow-visible' : 'overflow-y-auto'}`}>
                        {boxEmployees.length === 0 ? (
                          <div className="h-24 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-2 text-slate-400 text-[11px]">
                            <span>No leaders in this band</span>
                            <span className="text-[9px] text-slate-400 mt-0.5">Drop candidate to calibrate</span>
                          </div>
                        ) : viewMode === 'compact' ? (
                          /* Compact Dots View */
                          <div className="flex flex-wrap gap-2.5 items-center p-1.5">
                            {boxEmployees.map((emp) => {
                              const isSearchHit =
                                searchQuery.trim() !== '' &&
                                (emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  emp.title.toLowerCase().includes(searchQuery.toLowerCase()));

                              return (
                                <div
                                  key={emp.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, emp.id)}
                                  onClick={() => setActiveEmployee(emp)}
                                  className={`relative cursor-pointer group transition-all duration-150 hover:z-50 ${
                                    isSearchHit ? 'scale-125 ring-2 ring-[#047857] rounded-full' : ''
                                  }`}
                                >
                                  <div
                                    className="p-0.5 rounded-full border-2 transition-transform transform group-hover:scale-115 shadow-2xs bg-white"
                                    style={{ borderColor: getDeptColor(emp.department) }}
                                  >
                                    <Avatar name={emp.name} src={emp.avatar} size="sm" />
                                  </div>

                                  {/* Tooltip preview with elevated z-index, structured typography, and arrow */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-50 pointer-events-none">
                                    <div className="bg-[#0B1F18] text-white rounded-xl p-2.5 shadow-2xl border border-emerald-500/40 w-52 text-left relative backdrop-blur-md">
                                      <div className="flex items-center justify-between gap-1.5 mb-1">
                                        <div className="font-bold text-xs text-white truncate leading-tight">
                                          {emp.name}
                                        </div>
                                        <span className="text-[9px] font-mono font-bold bg-white/15 text-emerald-300 px-1.5 py-0.5 rounded shrink-0">
                                          {emp.level}
                                        </span>
                                      </div>

                                      <div className="text-emerald-300 text-[10px] font-medium leading-snug truncate mb-1">
                                        {emp.title}
                                      </div>

                                      <div className="text-[10px] text-slate-300 leading-tight mb-2 flex items-center justify-between">
                                        <span>{emp.department}</span>
                                        <span
                                          className={`font-semibold text-[9px] ${
                                            emp.flightRisk === 'Critical' || emp.flightRisk === 'High'
                                              ? 'text-rose-400'
                                              : emp.flightRisk === 'Medium'
                                              ? 'text-amber-400'
                                              : 'text-emerald-400'
                                          }`}
                                        >
                                          {emp.flightRisk} Risk
                                        </span>
                                      </div>

                                      <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                                        <span className="text-slate-300">
                                          P: <strong className="text-emerald-400 font-bold">{emp.performanceScore.toFixed(1)}</strong>
                                        </span>
                                        <span className="text-slate-300">
                                          Pot: <strong className="text-indigo-300 font-bold">{emp.potentialScore.toFixed(1)}</strong>
                                        </span>
                                      </div>

                                      {/* Downward pointer arrow */}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-[#0B1F18]" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Expanded Cards View */
                          <div className="space-y-2">
                            {boxEmployees.map((emp) => {
                              const isSearchHit =
                                searchQuery.trim() !== '' &&
                                (emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  emp.title.toLowerCase().includes(searchQuery.toLowerCase()));

                              return (
                                <div
                                  key={emp.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, emp.id)}
                                  onClick={() => setActiveEmployee(emp)}
                                  className={`bg-white rounded-lg p-2.5 border transition-all shadow-2xs hover:shadow-md cursor-grab active:cursor-grabbing group ${
                                    isSearchHit
                                      ? 'border-[#047857] ring-2 ring-[#047857]/30 bg-emerald-50/50'
                                      : 'border-gray-200 hover:border-emerald-300'
                                  }`}
                                  style={{ borderLeftWidth: '4px', borderLeftColor: getDeptColor(emp.department) }}
                                >
                                  <div className="flex items-center justify-between gap-1.5 mb-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Avatar name={emp.name} src={emp.avatar} size="sm" />
                                      <div className="min-w-0">
                                        <h5 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                                          {emp.name}
                                        </h5>
                                        <span className="text-[10px] text-slate-500 truncate block">
                                          {emp.title}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded shrink-0">
                                      {emp.level}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-600 border-t border-gray-100">
                                    <div className="flex items-center gap-1.5">
                                      <span>P: <strong>{emp.performanceScore.toFixed(1)}</strong></span>
                                      <span>Pot: <strong className="text-[#047857]">{emp.potentialScore.toFixed(1)}</strong></span>
                                    </div>
                                    <RiskBadge level={emp.flightRisk} size="sm" showDot={false} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Box Footer: HR Strategic Action note */}
                      <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                        <span className="truncate max-w-44" title={box.recommendation}>
                          Action: {box.recommendation.split(',')[0]}
                        </span>
                        <span className="font-bold text-slate-400">
                          {box.x}/{box.y}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom X-Axis Label Bar with Tick Markers */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center">
              <div className="w-14 sm:w-16 shrink-0" />
              <div className="flex-1 grid grid-cols-3 text-center text-slate-500 text-xs select-none">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Low Performance
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block">&lt;4.0 Score</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Medium Performance
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block">4.0 - 4.4 Score</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider block">
                    High Performance
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block">4.5 - 5.0 Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE 3: CALIBRATION TABLE VIEW */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-slate-50/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0B1F18]">Talent Calibration Register</h3>
              <p className="text-xs text-slate-500">
                Quickly adjust 9-box placement, performance scores, and potential levels for executive calibration.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Showing {filteredEmployees.length} leaders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Leader & Title</th>
                  <th className="py-3 px-4">Department & Level</th>
                  <th className="py-3 px-4">Perf Score (1-5)</th>
                  <th className="py-3 px-4">Pot Score (1-5)</th>
                  <th className="py-3 px-4">Current 9-Box Placement</th>
                  <th className="py-3 px-4">Flight Risk</th>
                  <th className="py-3 px-4 text-right">Recalibrate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((emp) => {
                  const currentBoxId = getEmployeeBoxId(emp);
                  const currentBox = boxes.find((b) => b.id === currentBoxId);

                  return (
                    <tr key={emp.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={emp.name} src={emp.avatar} size="sm" />
                          <div>
                            <span className="font-bold text-[#0B1F18] block">{emp.name}</span>
                            <span className="text-[11px] text-slate-500">{emp.title}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: getDeptColor(emp.department) }}
                          />
                          <span className="font-medium text-slate-700">{emp.department}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Level {emp.level} &middot; {emp.yearsExperience} yrs exp
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {emp.performanceScore.toFixed(1)}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-[#047857]">
                        {emp.potentialScore.toFixed(1)}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${currentBox?.badgeStandard}`}>
                          {emp.boxGridPosition.split('/')[0]}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <RiskBadge level={emp.flightRisk} size="sm" showDot />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={currentBoxId}
                            onChange={(e) => handleRecalibrate(emp.id, e.target.value)}
                            className="p-1.5 bg-slate-50 border border-gray-300 rounded text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
                          >
                            {boxes.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setActiveEmployee(emp)}
                            className="p-1.5 text-slate-400 hover:text-[#047857] hover:bg-slate-100 rounded cursor-pointer"
                            title="Open Dossier"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POPUP / CALIBRATION DOSSIER MODAL WITH MINI 3X3 GRID LOCATOR */}
      {activeEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 max-w-lg w-full animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar name={activeEmployee.name} src={activeEmployee.avatar} size="lg" />
                <div>
                  <h3 className="text-base font-bold text-[#0B1F18]">{activeEmployee.name}</h3>
                  <p className="text-xs text-slate-500">{activeEmployee.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: getDeptColor(activeEmployee.department) }}
                    >
                      {activeEmployee.department}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      {activeEmployee.level} &middot; {activeEmployee.yearsExperience} yrs exp
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveEmployee(null)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Current 9-Box Placement Callout with Mini 3x3 Grid */}
            <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Calibrated 9-Box Placement
                </span>
                <span className="text-xs font-extrabold text-[#064E3B] bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  {activeEmployee.boxGridPosition}
                </span>
              </div>

              {/* Mini 3x3 Matrix Locator */}
              <div className="flex items-center justify-between gap-4 p-2.5 bg-white rounded-lg border border-emerald-100">
                <div className="text-xs space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Matrix Coordinate Locator
                  </span>
                  <div className="font-mono text-xs">
                    Perf: <strong className="text-slate-900">{activeEmployee.performanceScore.toFixed(1)}</strong> / 5.0
                    {' '}&middot;{' '}
                    Pot: <strong className="text-[#047857]">{activeEmployee.potentialScore.toFixed(1)}</strong> / 5.0
                  </div>
                </div>

                {/* 3x3 Grid Graphic */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded border border-slate-200 shrink-0">
                  {boxes.map((b) => {
                    const isCurrent = getEmployeeBoxId(activeEmployee) === b.id;
                    return (
                      <div
                        key={b.id}
                        className={`w-4 h-4 rounded-xs transition-all ${
                          isCurrent
                            ? 'bg-[#047857] ring-2 ring-[#4EC69A] shadow-xs'
                            : b.tier === 'growth'
                            ? 'bg-emerald-200'
                            : b.tier === 'core'
                            ? 'bg-slate-300'
                            : 'bg-red-200'
                        }`}
                        title={b.name}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Strategic Recommendation */}
              <div className="pt-2 border-t border-emerald-200/60 text-xs">
                <span className="text-[10px] font-bold text-[#064E3B] uppercase tracking-wider block mb-0.5">
                  HR Executive Recommendation
                </span>
                <p className="text-slate-700">
                  {boxes.find((b) => b.id === getEmployeeBoxId(activeEmployee))?.recommendation ||
                    'Continue quarterly performance calibration and alignment with succession target.'}
                </p>
              </div>
            </div>

            {/* Flight & Retirement Risk */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-gray-200 text-xs mb-4">
              <div>
                <span className="text-slate-400 block text-[10px]">Flight Risk</span>
                <RiskBadge level={activeEmployee.flightRisk} size="sm" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Retirement Risk</span>
                <RiskBadge level={activeEmployee.retirementRisk} size="sm" />
              </div>
              {activeEmployee.isKeyTalent && (
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Talent Tier</span>
                  <span className="text-xs font-bold text-[#064E3B]">Designated Key Talent</span>
                </div>
              )}
            </div>

            {/* Quick Recalibrate Dropdown */}
            {onUpdateEmployee && (
              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 mb-4 text-xs">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Quick Recalibrate Box Position
                </label>
                <select
                  value={getEmployeeBoxId(activeEmployee)}
                  onChange={(e) => handleRecalibrate(activeEmployee.id, e.target.value)}
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#047857]"
                >
                  {boxes.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Perf: {b.x} &middot; Pot: {b.y})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveEmployee(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = activeEmployee.id;
                  setActiveEmployee(null);
                  onSelectEmployee(id);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#047857] hover:bg-[#064E3B] rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Full Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HR 9-BOX CALIBRATION & COLOR CODING GUIDE MODAL */}
      <Modal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        title="Standard 9-Box Calibration & Color Coding Guide"
        subtitle="Executive governance principles for talent tiering, color coding architecture, and curve calibration."
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs text-slate-700">
          {/* Executive Overview */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <h4 className="font-bold text-[#064E3B] text-sm mb-1">Standard HR 9-Box Governance Architecture</h4>
            <p className="text-slate-700 leading-relaxed">
              The 9-Box Matrix calibrates leadership talent across two independent axes: <strong>Current Performance</strong> (demonstrated results and KPI delivery) and <strong>Leadership Potential</strong> (cognitive headroom, adaptability, and capacity to lead at +1 or +2 scope).
            </p>
          </div>

          {/* Color Coding Rationale */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#0B1F18] uppercase tracking-wider text-[11px]">
              Standard 3-Tier Color Hierarchy
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-300 space-y-1">
                <div className="flex items-center gap-1.5 text-[#064E3B] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#047857]" />
                  <span>Tier 1: Growth / Stars</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Color: Emerald & Mint Green (#047857, #4EC69A). Top-priority bench for board exposure, expedited scope, and equity retention.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <span>Tier 2: Core Backbone</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Color: Slate, Ocean Blue & Violet. The dependable heartbeat and irreplaceable technical specialists powering daily continuity.
                </p>
              </div>

              <div className="p-3 bg-red-50/60 rounded-xl border border-red-300 space-y-1">
                <div className="flex items-center gap-1.5 text-red-900 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                  <span>Tier 3: Risk & Action</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Color: Warm Amber (#D97706) & Crimson (#DC2626). Immediate 90-day performance review, structured coaching, or exit protocol.
                </p>
              </div>
            </div>
          </div>

          {/* Target Distribution Curve */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-2">
            <h4 className="font-bold text-[#0B1F18] uppercase tracking-wider text-[11px]">
              Recommended Enterprise Talent Curve Targets
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="text-[10px] text-slate-400 block uppercase">Growth Bench</span>
                <strong className="text-[#047857] text-sm">15% - 20%</strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="text-[10px] text-slate-400 block uppercase">Core Backbone</span>
                <strong className="text-slate-800 text-sm">65% - 75%</strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="text-[10px] text-slate-400 block uppercase">Action Needed</span>
                <strong className="text-red-600 text-sm">10% - 15%</strong>
              </div>
            </div>
          </div>

          {/* Action Close */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setIsGuideModalOpen(false)}
              className="px-4 py-2 bg-[#047857] text-white font-bold rounded-lg hover:bg-[#064E3B] cursor-pointer text-xs"
            >
              Understood
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
