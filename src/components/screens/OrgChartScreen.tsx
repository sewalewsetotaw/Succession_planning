import React, { useState, useMemo } from 'react';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowRightLeft,
  ArrowUpDown,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Users,
  Star,
  Maximize2,
  Minimize2,
  Eye,
  SlidersHorizontal,
  Flame,
  Info,
  Layers,
} from 'lucide-react';
import { SignatureBanner } from '../common/SignatureBanner';
import { Avatar } from '../common/Avatar';
import { RiskBadge } from '../common/RiskBadge';
import { OrgNode, Employee, Position, ActiveScreen } from '../../types';

interface OrgChartScreenProps {
  rootNode: OrgNode;
  employees?: Employee[];
  positions?: Position[];
  onSelectEmployee: (empId: string) => void;
  onSelectPosition?: (posId: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export type OrgColorMode = 'succession' | 'flightRisk' | 'department' | 'minimal';

export const OrgChartScreen: React.FC<OrgChartScreenProps> = ({
  rootNode,
  employees = [],
  positions = [],
  onSelectEmployee,
  onSelectPosition,
  onNavigate,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [colorMode, setColorMode] = useState<OrgColorMode>('succession');
  const [highlightFilter, setHighlightFilter] = useState<'all' | 'zeroSuccessors' | 'highRisk' | 'keyTalent'>('all');
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<OrgNode | null>(null);

  // Quick lookup map for employees
  const employeeMap = useMemo(() => {
    const map = new Map<string, Employee>();
    employees.forEach((e) => map.set(e.id, e));
    return map;
  }, [employees]);

  // Quick lookup map for positions by title or department
  const positionMap = useMemo(() => {
    const map = new Map<string, Position>();
    positions.forEach((p) => map.set(p.title.toLowerCase(), p));
    return map;
  }, [positions]);

  const toggleCollapse = (id: string) => {
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => setCollapsedNodes({});

  const collapseToExecutives = () => {
    const newCollapsed: Record<string, boolean> = {};
    const traverse = (node: OrgNode, depth: number) => {
      if (depth >= 2 && node.children && node.children.length > 0) {
        newCollapsed[node.id] = true;
      }
      if (node.children) {
        node.children.forEach((child) => traverse(child, depth + 1));
      }
    };
    traverse(rootNode, 1);
    setCollapsedNodes(newCollapsed);
  };

  // Harmonious Department Color Palette (Enterprise grade, balanced saturation)
  const departmentThemes: Record<string, { border: string; accent: string; badge: string; text: string }> = {
    Executive: {
      border: 'border-emerald-400',
      accent: 'bg-[#047857]',
      badge: 'bg-emerald-50 text-[#064E3B] border-emerald-200',
      text: 'text-[#064E3B]',
    },
    Engineering: {
      border: 'border-sky-400',
      accent: 'bg-sky-600',
      badge: 'bg-sky-50 text-sky-800 border-sky-200',
      text: 'text-sky-700',
    },
    Operations: {
      border: 'border-amber-400',
      accent: 'bg-amber-600',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      text: 'text-amber-800',
    },
    Product: {
      border: 'border-purple-400',
      accent: 'bg-purple-600',
      badge: 'bg-purple-50 text-purple-800 border-purple-200',
      text: 'text-purple-700',
    },
    Sales: {
      border: 'border-rose-400',
      accent: 'bg-rose-600',
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      text: 'text-rose-700',
    },
    Finance: {
      border: 'border-teal-400',
      accent: 'bg-teal-600',
      badge: 'bg-teal-50 text-teal-800 border-teal-200',
      text: 'text-teal-700',
    },
    'People & Culture': {
      border: 'border-pink-400',
      accent: 'bg-pink-600',
      badge: 'bg-pink-50 text-pink-800 border-pink-200',
      text: 'text-pink-700',
    },
  };

  // Node coloring logic according to active colorMode
  const getNodeColorStyles = (node: OrgNode, emp?: Employee) => {
    const successorsCount = node.totalSuccessors ?? 0;
    const flightRisk = emp?.flightRisk || 'Low';

    if (colorMode === 'succession') {
      // SUCCESSION COVERAGE MODE (Refined, calm executive tones)
      if (successorsCount === 0) {
        return {
          cardBorder: 'border-rose-300 hover:border-rose-400',
          topAccent: 'bg-rose-500',
          bgTint: 'bg-white hover:bg-rose-50/30',
          statusBadge: 'bg-rose-50 text-rose-700 border-rose-200',
          statusIcon: <AlertTriangle className="w-3 h-3 text-rose-600" />,
          statusLabel: 'Critical Gap (0 Cover)',
          colorName: '0 Successors',
        };
      }
      if (successorsCount === 1) {
        return {
          cardBorder: 'border-amber-300 hover:border-amber-400',
          topAccent: 'bg-amber-500',
          bgTint: 'bg-white hover:bg-amber-50/30',
          statusBadge: 'bg-amber-50 text-amber-800 border-amber-200',
          statusIcon: <AlertTriangle className="w-3 h-3 text-amber-600" />,
          statusLabel: '1 Successor (Single Point)',
          colorName: '1 Successor',
        };
      }
      if (successorsCount === 2) {
        return {
          cardBorder: 'border-emerald-300 hover:border-emerald-400',
          topAccent: 'bg-[#047857]',
          bgTint: 'bg-white hover:bg-emerald-50/30',
          statusBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          statusIcon: <CheckCircle2 className="w-3 h-3 text-[#047857]" />,
          statusLabel: '2 Successors (Target)',
          colorName: '2 Successors',
        };
      }
      // 3+ Successors
      return {
        cardBorder: 'border-teal-300 hover:border-teal-400',
        topAccent: 'bg-teal-600',
        bgTint: 'bg-white hover:bg-teal-50/30',
        statusBadge: 'bg-teal-50 text-teal-800 border-teal-200',
        statusIcon: <ShieldCheck className="w-3 h-3 text-teal-600" />,
        statusLabel: `${successorsCount} Successors (Deep Bench)`,
        colorName: '3+ Successors',
      };
    }

    if (colorMode === 'flightRisk') {
      // FLIGHT RISK FOCUS MODE
      if (flightRisk === 'Critical') {
        return {
          cardBorder: 'border-red-400 hover:border-red-500',
          topAccent: 'bg-[#DC2626]',
          bgTint: 'bg-white hover:bg-red-50/30',
          statusBadge: 'bg-red-50 text-red-700 border-red-200',
          statusIcon: <Flame className="w-3 h-3 text-red-600" />,
          statusLabel: 'Critical Flight Risk',
          colorName: 'Critical Risk',
        };
      }
      if (flightRisk === 'High') {
        return {
          cardBorder: 'border-rose-300 hover:border-rose-400',
          topAccent: 'bg-rose-500',
          bgTint: 'bg-white hover:bg-rose-50/30',
          statusBadge: 'bg-rose-50 text-rose-800 border-rose-200',
          statusIcon: <AlertTriangle className="w-3 h-3 text-rose-600" />,
          statusLabel: 'High Flight Risk',
          colorName: 'High Risk',
        };
      }
      if (flightRisk === 'Medium') {
        return {
          cardBorder: 'border-amber-300 hover:border-amber-400',
          topAccent: 'bg-amber-500',
          bgTint: 'bg-white hover:bg-amber-50/30',
          statusBadge: 'bg-amber-50 text-amber-800 border-amber-200',
          statusIcon: <span className="w-2 h-2 rounded-full bg-amber-500" />,
          statusLabel: 'Medium Flight Risk',
          colorName: 'Medium Risk',
        };
      }
      // Low Risk
      return {
        cardBorder: 'border-emerald-200 hover:border-emerald-300',
        topAccent: 'bg-emerald-600',
        bgTint: 'bg-white hover:bg-emerald-50/20',
        statusBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        statusIcon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
        statusLabel: 'Stable (Low Risk)',
        colorName: 'Low Risk',
      };
    }

    if (colorMode === 'department') {
      // DEPARTMENT CODING MODE
      const theme = departmentThemes[node.department] || {
        border: 'border-slate-300',
        accent: 'bg-slate-600',
        badge: 'bg-slate-50 text-slate-700 border-slate-200',
        text: 'text-slate-700',
      };
      return {
        cardBorder: `${theme.border} hover:shadow-md`,
        topAccent: theme.accent,
        bgTint: 'bg-white',
        statusBadge: theme.badge,
        statusIcon: <span className={`w-2 h-2 rounded-full ${theme.accent}`} />,
        statusLabel: node.department,
        colorName: node.department,
      };
    }

    // MINIMAL / CLEAN EXECUTIVE MODE
    return {
      cardBorder: 'border-gray-200 hover:border-emerald-400',
      topAccent: 'bg-[#064E3B]',
      bgTint: 'bg-white',
      statusBadge: 'bg-slate-100 text-slate-700 border-slate-200',
      statusIcon: <ShieldCheck className="w-3 h-3 text-[#047857]" />,
      statusLabel: node.totalSuccessors > 0 ? `${node.totalSuccessors} Successors` : 'No Cover',
      colorName: 'Executive Minimal',
    };
  };

  // Determine if node matches active filter
  const isNodeDimmed = (node: OrgNode, emp?: Employee) => {
    if (highlightFilter === 'all') return false;
    if (highlightFilter === 'zeroSuccessors') return (node.totalSuccessors ?? 0) > 0;
    if (highlightFilter === 'highRisk') return emp?.flightRisk !== 'Critical' && emp?.flightRisk !== 'High';
    if (highlightFilter === 'keyTalent') return !emp?.isKeyTalent;
    return false;
  };

  // Recursive Node renderer
  const renderNode = (node: OrgNode) => {
    const isCollapsed = collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const emp = employeeMap.get(node.id);
    const styles = getNodeColorStyles(node, emp);
    const dimmed = isNodeDimmed(node, emp);

    // Performance & Potential ratings (from emp or mock fallback)
    const perfScore = emp?.performanceScore ?? 4.2;
    const potScore = emp?.potentialScore ?? 4.0;
    const flightRisk = emp?.flightRisk ?? 'Low';
    const isCEO = node.level === 1;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Card */}
        <div
          onClick={() => {
            setSelectedNodeDetails(node);
          }}
          className={`relative rounded-2xl border bg-white shadow-xs hover:shadow-lg transition-all duration-200 p-4 w-72 text-left cursor-pointer group z-10 ${
            styles.cardBorder
          } ${styles.bgTint} ${
            dimmed ? 'opacity-30 filter grayscale scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Top colored accent stripe (Sleek 3.5px bar replacing loud 3px all-around border) */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${styles.topAccent} transition-colors`}
          />

          {/* Header Row: Department Badge + Flight Risk Indicator */}
          <div className="flex items-center justify-between gap-1.5 pt-0.5 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                {node.department}
              </span>
              {isCEO && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-[#064E3B] border border-emerald-300">
                  CEO / L10
                </span>
              )}
            </div>

            {/* Flight Risk Badge (Elegant, non-clashing) */}
            <div className="flex items-center">
              {flightRisk === 'Critical' || flightRisk === 'High' ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                  <span>{flightRisk} Risk</span>
                </span>
              ) : flightRisk === 'Medium' ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Med Risk</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Stable</span>
                </span>
              )}
            </div>
          </div>

          {/* Identity: Avatar + Name + Title */}
          <div className="flex items-start gap-3 mb-3">
            <div className="relative shrink-0">
              <Avatar name={node.name} src={node.avatar || emp?.avatar} size="lg" />
              {emp?.isKeyTalent && (
                <span
                  title="Key Talent"
                  className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 border border-white rounded-full flex items-center justify-center text-amber-950 text-[9px] shadow-2xs"
                >
                  ★
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate leading-snug">
                {node.name}
              </h4>
              <p className="text-xs text-slate-500 truncate leading-tight mt-0.5">
                {node.title}
              </p>
              {emp?.level && (
                <span className="inline-block text-[10px] font-mono font-medium text-slate-400 mt-1">
                  Grade {emp.level} &middot; {emp.yearsExperience || 10}+ yrs
                </span>
              )}
            </div>
          </div>

          {/* Performance & Potential Dual Score Meters (Harmonious executive styling) */}
          <div className="bg-slate-50/80 rounded-xl p-2.5 mb-3 border border-slate-100 space-y-1.5">
            {/* Performance (P) Meter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-600 w-3">P</span>
              <div className="flex-1 bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#047857] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(perfScore / 5) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-[#047857] tabular-nums">
                {perfScore.toFixed(1)}
              </span>
            </div>

            {/* Potential (V) Meter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-600 w-3">V</span>
              <div className="flex-1 bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(potScore / 5) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-700 tabular-nums">
                {potScore.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Bottom Successor Coverage Status Pill (Refined, informative) */}
          <div className="flex items-center justify-between pt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${styles.statusBadge}`}
            >
              {styles.statusIcon}
              <span>{styles.statusLabel}</span>
            </span>

            {node.successorsReadyNow > 0 && (
              <span className="text-[10px] font-bold text-[#047857] bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-200">
                {node.successorsReadyNow} Ready Now
              </span>
            )}
          </div>

          {/* Expand / Collapse toggle pill if node has children */}
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(node.id);
              }}
              className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white border border-gray-300 shadow-xs flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-[#047857] hover:border-emerald-300 transition-all z-20 cursor-pointer"
              title={isCollapsed ? 'Expand reports' : 'Collapse reports'}
            >
              <span>{node.children!.length}</span>
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          )}
        </div>

        {/* Children connector lines */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col items-center w-full">
            {/* Vertical stem from parent */}
            <div className="w-0.5 h-7 bg-slate-300" />

            {/* Horizontal branch bar */}
            <div className="relative flex justify-center">
              {node.children!.length > 1 && (
                <div
                  className="absolute top-0 h-0.5 bg-slate-300"
                  style={{
                    left: '50%',
                    right: '50%',
                    width: `calc(100% - ${288 / node.children!.length}px)`,
                    transform: 'translateX(-50%)',
                  }}
                />
              )}

              {/* Children nodes container */}
              <div
                className={`flex gap-8 pt-7 ${
                  orientation === 'horizontal' ? 'flex-col' : 'flex-row'
                }`}
              >
                {node.children!.map((child) => renderNode(child))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Signature Banner */}
      <SignatureBanner
        title="Enterprise Succession Hierarchy"
        subtitle="Reporting relationships, designated bench depth, and continuity exposure mapped across leadership."
        badge="Organizational Architecture"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('talent-risk')}
              className="px-3.5 py-1.5 bg-white text-[#047857] hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer focus-ring"
            >
              Audit Bench Risks
            </button>
            <button
              type="button"
              onClick={() => onNavigate('positions')}
              className="px-3.5 py-1.5 bg-[#064E3B] text-emerald-100 hover:text-white rounded-lg text-xs font-semibold transition-all border border-emerald-600/50 cursor-pointer focus-ring"
            >
              Positions Registry
            </button>
          </div>
        }
      />

      {/* Main Controls Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        {/* Top Row: Title + Color Mode Selector + Zoom Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0B1F18] tracking-tight">
              Org Chart
            </h2>
            <p className="font-mono text-xs font-bold tracking-widest text-slate-500 uppercase mt-0.5">
              REPORTING HIERARCHY &amp; SUCCESSION DEPTH
            </p>
          </div>

          {/* Color Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Color By:
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setColorMode('succession')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  colorMode === 'succession'
                    ? 'bg-white text-[#064E3B] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Succession Depth
              </button>
              <button
                type="button"
                onClick={() => setColorMode('flightRisk')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  colorMode === 'flightRisk'
                    ? 'bg-white text-rose-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flight Risk
              </button>
              <button
                type="button"
                onClick={() => setColorMode('department')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  colorMode === 'department'
                    ? 'bg-white text-[#047857] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Department
              </button>
              <button
                type="button"
                onClick={() => setColorMode('minimal')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  colorMode === 'minimal'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Executive Clean
              </button>
            </div>
          </div>

          {/* Zoom and Tree Controls */}
          <div className="flex items-center gap-2">
            {/* Tree Orientation */}
            <button
              type="button"
              onClick={() => setOrientation(orientation === 'vertical' ? 'horizontal' : 'vertical')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
              title="Toggle tree orientation"
            >
              {orientation === 'vertical' ? (
                <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className="hidden sm:inline">
                {orientation === 'vertical' ? 'Horizontal' : 'Vertical'}
              </span>
            </button>

            {/* Expand / Collapse All */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                type="button"
                onClick={expandAll}
                className="px-2 py-1 text-slate-600 hover:text-slate-900 rounded font-medium cursor-pointer"
                title="Expand All Nodes"
              >
                Expand
              </button>
              <button
                type="button"
                onClick={collapseToExecutives}
                className="px-2 py-1 text-slate-600 hover:text-slate-900 rounded font-medium border-l border-slate-200 cursor-pointer"
                title="Collapse to C-Suite"
              >
                Collapse
              </button>
            </div>

            {/* Zoom Widget */}
            <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-0.5">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200/60 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="font-mono text-xs px-2 text-slate-700 font-bold tabular-nums hover:text-[#047857] cursor-pointer"
                title="Reset to 100%"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.5, +(z + 0.1).toFixed(1)))}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200/60 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1.2)}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200/60 border-l border-slate-200 cursor-pointer"
                title="Fit View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Color Legend + Quick Spotlight Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Active Legend Swatches */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {colorMode === 'succession'
                ? 'Succession Coverage:'
                : colorMode === 'flightRisk'
                ? 'Flight Risk Scale:'
                : colorMode === 'department'
                ? 'Department Colors:'
                : 'Node Legend:'}
            </span>

            {colorMode === 'succession' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                  <span className="font-semibold text-rose-800">No Successors (Gap)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                  <span className="font-semibold text-amber-800">1 Successor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#047857] ring-2 ring-emerald-200" />
                  <span className="font-semibold text-emerald-800">2 Successors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 ring-2 ring-teal-200" />
                  <span className="font-semibold text-teal-800">3+ Successors</span>
                </div>
              </>
            )}

            {colorMode === 'flightRisk' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-red-200" />
                  <span className="font-semibold text-red-800">Critical Risk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                  <span className="font-semibold text-rose-800">High Risk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                  <span className="font-semibold text-amber-800">Medium Risk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-200" />
                  <span className="font-semibold text-emerald-800">Low Risk (Stable)</span>
                </div>
              </>
            )}

            {colorMode === 'department' && (
              <>
                {Object.entries(departmentThemes).map(([dept, theme]) => (
                  <div key={dept} className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-xs ${theme.accent}`} />
                    <span className="text-slate-600 font-medium">{dept}</span>
                  </div>
                ))}
              </>
            )}

            {colorMode === 'minimal' && (
              <span className="text-slate-500">
                Sleek slate cards with unified executive typography and status tags.
              </span>
            )}
          </div>

          {/* Quick Spotlight Filters */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-400">Filter:</span>
            <button
              type="button"
              onClick={() => setHighlightFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                highlightFilter === 'all'
                  ? 'bg-[#064E3B] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setHighlightFilter('zeroSuccessors')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                highlightFilter === 'zeroSuccessors'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              ⚠️ Gaps (0 Cover)
            </button>
            <button
              type="button"
              onClick={() => setHighlightFilter('highRisk')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                highlightFilter === 'highRisk'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              🔥 High Flight Risk
            </button>
            <button
              type="button"
              onClick={() => setHighlightFilter('keyTalent')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                highlightFilter === 'keyTalent'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              ★ Key Talent
            </button>
          </div>
        </div>

        {/* Sub-Legend Guide: Explaining Meters & Indicators */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 font-medium">
              <span className="font-mono font-bold text-[#047857]">P</span> = Performance Rating (1–5)
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="font-mono font-bold text-indigo-700">V</span> = Potential Score (1–5)
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Low Flight Risk
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Medium Flight Risk
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> High Flight Risk
            </span>
          </div>

          <span className="italic text-slate-400">
            Click any leader card to open the Succession &amp; Talent Dossier
          </span>
        </div>
      </div>

      {/* Interactive Org Canvas with Pan/Zoom */}
      <div className="bg-slate-50/70 rounded-2xl border border-gray-200 p-8 shadow-xs overflow-x-auto min-h-[640px] flex justify-center relative">
        <div
          className="transition-transform duration-200 origin-top flex justify-center pb-12"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {renderNode(rootNode)}
        </div>
      </div>

      {/* Quick Node Details Dossier Modal */}
      {selectedNodeDetails && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  name={selectedNodeDetails.name}
                  src={selectedNodeDetails.avatar || employeeMap.get(selectedNodeDetails.id)?.avatar}
                  size="xl"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#0B1F18]">
                    {selectedNodeDetails.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedNodeDetails.title} &middot;{' '}
                    <span className="font-semibold text-slate-700">
                      {selectedNodeDetails.department}
                    </span>
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 mt-1">
                    Grade L{selectedNodeDetails.level} &middot; {selectedNodeDetails.totalSuccessors} Designated Successors
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNodeDetails(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Performance (P)
                </span>
                <span className="text-xl font-extrabold font-mono text-[#047857] tabular-nums">
                  {(employeeMap.get(selectedNodeDetails.id)?.performanceScore ?? 4.2).toFixed(1)}
                  <span className="text-xs font-normal text-slate-400">/5</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Potential (V)
                </span>
                <span className="text-xl font-extrabold font-mono text-indigo-700 tabular-nums">
                  {(employeeMap.get(selectedNodeDetails.id)?.potentialScore ?? 4.0).toFixed(1)}
                  <span className="text-xs font-normal text-slate-400">/5</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Flight Risk
                </span>
                <RiskBadge
                  level={employeeMap.get(selectedNodeDetails.id)?.flightRisk || 'Low'}
                  size="sm"
                />
              </div>
            </div>

            {/* Successor Coverage Status */}
            <div className="rounded-xl border border-gray-200 p-4 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Succession Pipeline Depth</span>
                <span
                  className={
                    selectedNodeDetails.totalSuccessors === 0
                      ? 'text-rose-700 font-bold'
                      : 'text-[#047857] font-bold'
                  }
                >
                  {selectedNodeDetails.totalSuccessors === 0
                    ? '0 Identified Candidates (Critical Gap)'
                    : `${selectedNodeDetails.totalSuccessors} Identified Candidates`}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedNodeDetails.totalSuccessors === 0
                  ? 'This position represents a single point of failure without active designated successors in the pipeline.'
                  : `${selectedNodeDetails.successorsReadyNow} candidate is classified as Ready Now (<6 months), providing immediate business continuity.`}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const empId = selectedNodeDetails.id;
                  setSelectedNodeDetails(null);
                  onSelectEmployee(empId);
                }}
                className="flex-1 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>View Full Employee Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedNodeDetails(null);
                  onNavigate('succession-plans');
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Succession Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
