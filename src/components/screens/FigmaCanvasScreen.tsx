import React, { useState } from 'react';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Eye,
  CheckCircle2,
  GitBranch,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';
import { ActiveScreen } from '../../types';
import { KpiCard } from '../common/KpiCard';
import { RiskBadge } from '../common/RiskBadge';
import { ReadinessChip } from '../common/ReadinessChip';
import { CriticalityBadge } from '../common/CriticalityBadge';
import { ScoreBar } from '../common/ScoreBar';
import { GaugeScore } from '../common/GaugeScore';
import { StarRating } from '../common/StarRating';
import { Avatar } from '../common/Avatar';
import { SignatureBanner } from '../common/SignatureBanner';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

interface FigmaCanvasScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
  onSwitchToApp: () => void;
}

export const FigmaCanvasScreen: React.FC<FigmaCanvasScreenProps> = ({
  onNavigate,
  onSwitchToApp,
}) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'components' | 'connections'>('canvas');
  const [zoom, setZoom] = useState(0.85);
  const [showAutoLayoutGuides, setShowAutoLayoutGuides] = useState(true);
  const [showWireNoodles, setShowWireNoodles] = useState(true);

  const screensList: { id: ActiveScreen; name: string; category: string; description: string }[] = [
    { id: 'dashboard', name: 'Dashboard Screen', category: 'Executive Suite', description: 'KPI cards, depth distribution, readiness donut, mini 9-box, zero-successor alert strip' },
    { id: 'employees', name: 'Talent Directory Screen', category: 'Talent Management', description: 'Dual List & Kanban modes (by Flight Risk / Seniority / 9-Box), search, multi-facet filter bar, sortable table, performance & potential mini-bars' },
    { id: 'employee-detail', name: 'Employee Detail Screen', category: 'Talent Management', description: 'Profile header, 1-5 gauges, flight & retirement cards, candidacies & dev plan tabs' },
    { id: 'positions', name: 'Critical Positions Screen', category: 'Succession Core', description: 'Dual List & Kanban modes, criticality badges, 7-factor scores, bench depth, prominent red No Successors badges' },
    { id: 'position-detail', name: 'Position Bench Screen', category: 'Succession Core', description: 'Incumbent card, candidate tiers, 7 weighted factors methodology formula, readiness timeline' },
    { id: 'succession-plans', name: 'Succession Plans Screen', category: 'Succession Core', description: 'Dual List & Kanban modes (by Ready Now / 1-2Y / 3-5Y), readiness chips, flight risk, notes, nomination modal' },
    { id: 'development-plans', name: 'Development Plans Screen', category: 'Continuous Growth', description: 'Dual List & Kanban Board (by workflow status), drag-and-drop cards, overdue red tinting, completion rate progress' },
    { id: 'nine-box', name: '9-Box Matrix Screen', category: 'Executive Calibration', description: '3x3 performance vs potential grid, department colored dots, count badges, interactive popover' },
    { id: 'org-chart', name: 'Org Hierarchy Screen', category: 'Executive Calibration', description: 'Top-down organizational tree, zoom & pan controls, horizontal/vertical toggle, successor tags' },
    { id: 'talent-risk', name: 'Talent Risk Report Screen', category: 'Risk & Compliance', description: 'Triage audit header, CSV export generator, 4 sorted severity risk sections' },
    { id: 'readiness-timeline', name: 'Readiness Timeline Screen', category: 'Risk & Compliance', description: '3 horizontal temporal bands, Ready Now mint highlight, target position clusters' },
    { id: 'competency-heatmap', name: 'Competency Heatmap Screen', category: 'Evaluation Engine', description: 'Candidates x 10 competencies matrix, rotated headers, pinned avg gap row, rating modal' },
    { id: 'brd-governance', name: 'BRD & Governance Screen', category: 'Policy & Standards', description: 'Document reference v2.4, 7-factor methodology formula, score bands, exception rules' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Figma Workspace Toolbar */}
      <div className="bg-[#0B1F18] text-white rounded-2xl p-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#047857] flex items-center justify-center font-extrabold text-sm text-white">
            <Layers className="w-4 h-4 text-[#4EC69A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-white">
                Figma Design Canvas & Component Library
              </h2>
              <span className="text-[10px] font-mono bg-[#4EC69A]/20 text-[#4EC69A] border border-[#4EC69A]/40 px-2 py-0.5 rounded">
                1440px Grid & Auto Layout
              </span>
            </div>
            <p className="text-xs text-emerald-200/70">
              12 Connected Artboards &middot; Reusable Design System &middot; Interactive Prototype Links
            </p>
          </div>
        </div>

        {/* View Mode Tabs in Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-white/10 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer ${
                activeTab === 'canvas' ? 'bg-[#047857] text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Multi-Screen Canvas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('components')}
              className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer ${
                activeTab === 'components' ? 'bg-[#047857] text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Component Library
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('connections')}
              className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer ${
                activeTab === 'connections' ? 'bg-[#047857] text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Screen Connection Map
            </button>
          </div>

          {/* Quick Zoom & Layout Toggles */}
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
              className="p-1 text-slate-300 hover:text-white rounded cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs px-1.5 font-bold text-emerald-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
              className="p-1 text-slate-300 hover:text-white rounded cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(0.85)}
              className="p-1 text-slate-300 hover:text-white rounded ml-1 border-l border-white/20 cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onSwitchToApp}
            className="px-3.5 py-1.5 text-xs font-bold bg-[#4EC69A] text-[#064E3B] hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            Launch Interactive App
          </button>
        </div>
      </div>

      {/* TAB 1: Multi-Screen Artboard Canvas */}
      {activeTab === 'canvas' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Click any artboard card to jump directly into that live interactive screen.
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAutoLayoutGuides}
                  onChange={(e) => setShowAutoLayoutGuides(e.target.checked)}
                  className="rounded text-[#047857] focus:ring-[#047857]"
                />
                <span>Show Auto-Layout Frames</span>
              </label>
            </div>
          </div>

          {/* Grid of Artboards */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-transform origin-top"
            style={{ transform: `scale(${zoom})` }}
          >
            {screensList.map((screen, idx) => (
              <div
                key={screen.id}
                onClick={() => onNavigate(screen.id)}
                className={`bg-white rounded-2xl border ${
                  showAutoLayoutGuides ? 'border-dashed border-[#047857]/50' : 'border-gray-200'
                } shadow-sm hover:shadow-xl hover:border-[#047857] transition-all cursor-pointer group overflow-hidden flex flex-col justify-between`}
              >
                {/* Artboard Frame Header (Figma style) */}
                <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-[#4EC69A]" />
                    <span className="font-bold truncate">#{idx + 1} {screen.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">1440 &times; 960</span>
                </div>

                {/* Simulated Screen Preview Wireframe */}
                <div className="p-5 space-y-3 bg-[#F7F5EF] flex-1">
                  {/* Signature Emerald Header Banner miniature */}
                  <div className="h-14 rounded-lg bg-[#047857] p-2 text-white relative overflow-hidden flex flex-col justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#4EC69A] absolute -top-3 -right-3 opacity-40 blur-xs" />
                    <span className="text-[9px] uppercase tracking-wider text-emerald-100 font-bold">
                      {screen.category}
                    </span>
                    <span className="text-xs font-bold truncate text-white">
                      {screen.name.replace(' Screen', '')}
                    </span>
                  </div>

                  {/* Wireframe layout elements */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="h-9 bg-white rounded border border-gray-200 p-1 flex flex-col justify-center">
                        <span className="text-[8px] text-slate-400">Status</span>
                        <span className="text-[9px] font-bold text-[#047857]">Active</span>
                      </div>
                      <div className="h-9 bg-white rounded border border-gray-200 p-1 flex flex-col justify-center">
                        <span className="text-[8px] text-slate-400">Score</span>
                        <span className="text-[9px] font-mono font-bold text-slate-800">4.8</span>
                      </div>
                      <div className="h-9 bg-white rounded border border-gray-200 p-1 flex flex-col justify-center">
                        <span className="text-[8px] text-slate-400">Risk</span>
                        <span className="text-[9px] font-bold text-emerald-700">Low</span>
                      </div>
                    </div>

                    <div className="h-16 bg-white rounded border border-gray-200 p-2 flex flex-col justify-between">
                      <div className="h-1.5 bg-slate-200 rounded w-3/4" />
                      <div className="h-1.5 bg-emerald-200 rounded w-1/2" />
                      <div className="h-1.5 bg-slate-100 rounded w-2/3" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {screen.description}
                  </p>
                </div>

                {/* Footer with click action */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] font-mono">Frame Auto-Layout</span>
                  <span className="text-xs font-bold text-[#047857] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Open Live Screen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Reusable Component Library & Design System */}
      {activeTab === 'components' && (
        <div className="space-y-8">
          {/* 1. Design Tokens: Colors & Typography */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#0B1F18]">
              Design System Tokens & Semantic Color Palette
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-xl border border-emerald-200 bg-white">
                <div className="w-full h-10 rounded-lg bg-[#047857] mb-2" />
                <span className="text-xs font-bold text-slate-900 block">Primary Emerald</span>
                <span className="font-mono text-[11px] text-slate-500">#047857</span>
              </div>
              <div className="p-3 rounded-xl border border-emerald-200 bg-white">
                <div className="w-full h-10 rounded-lg bg-[#064E3B] mb-2" />
                <span className="text-xs font-bold text-slate-900 block">Sidebar Emerald</span>
                <span className="font-mono text-[11px] text-slate-500">#064E3B</span>
              </div>
              <div className="p-3 rounded-xl border border-emerald-200 bg-white">
                <div className="w-full h-10 rounded-lg bg-[#4EC69A] mb-2" />
                <span className="text-xs font-bold text-slate-900 block">Mint Accent</span>
                <span className="font-mono text-[11px] text-slate-500">#4EC69A</span>
              </div>
              <div className="p-3 rounded-xl border border-gray-200 bg-white">
                <div className="w-full h-10 rounded-lg bg-[#0B1F18] mb-2" />
                <span className="text-xs font-bold text-slate-900 block">Dark Text</span>
                <span className="font-mono text-[11px] text-slate-500">#0B1F18</span>
              </div>
              <div className="p-3 rounded-xl border border-gray-200 bg-white">
                <div className="w-full h-10 rounded-lg bg-[#F7F5EF] border border-gray-300 mb-2" />
                <span className="text-xs font-bold text-slate-900 block">Warm Off-White</span>
                <span className="font-mono text-[11px] text-slate-500">#F7F5EF</span>
              </div>
              <div className="p-3 rounded-xl border border-red-200 bg-white">
                <div className="w-full h-10 rounded-lg bg-[#DC2626] mb-2" />
                <span className="text-xs font-bold text-red-700 block">Critical Risk</span>
                <span className="font-mono text-[11px] text-slate-500">#DC2626</span>
              </div>
            </div>
          </div>

          {/* 2. Component Gallery: Badges, Chips, Gauges */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-[#0B1F18]">
              Reusable Component Gallery
            </h3>

            {/* Risk Badges */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                1. Semantic Risk Badges
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <RiskBadge level="Critical" />
                <RiskBadge level="High" />
                <RiskBadge level="Medium" />
                <RiskBadge level="Low" />
                <RiskBadge level="Not assessed" />
              </div>
            </div>

            {/* Readiness Chips */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                2. Readiness Horizon Chips (Ready Now with Mint Highlight)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <ReadinessChip readiness="Ready Now" />
                <ReadinessChip readiness="1-2 Years" />
                <ReadinessChip readiness="3-5 Years" />
              </div>
            </div>

            {/* Criticality Badges */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                3. Criticality Badges with Weighted Scores
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <CriticalityBadge level="Critical" score={96} />
                <CriticalityBadge level="High" score={78} />
                <CriticalityBadge level="Medium" score={54} />
              </div>
            </div>

            {/* Score Bars & Gauges */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                4. Mini-Score Bars & Circular Gauges
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                  <ScoreBar label="Perf" value={4.8} color="emerald" />
                  <ScoreBar label="Pot" value={4.6} color="mint" />
                  <ScoreBar label="Risk" value={2.5} color="amber" />
                </div>
                <GaugeScore label="Executive Potential" score={4.8} descriptor="Executive Ready" color="mint" />
                <GaugeScore label="Performance Mastery" score={4.6} descriptor="Exceeds Benchmark" color="emerald" />
              </div>
            </div>

            {/* Star Rating Component */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                5. Star Rating (1-5 Competency Inputs)
              </span>
              <div className="flex items-center gap-4">
                <StarRating value={4} size="md" />
                <span className="text-xs text-slate-500">Interactive hover & keyboard accessible</span>
              </div>
            </div>

            {/* Loading Skeletons & Empty States */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                6. Loading Skeletons & State Resilience
              </span>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Screen Connection Map & User Journeys */}
      {activeTab === 'connections' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#0B1F18]">
            Connected Screen Transition Map
          </h3>
          <p className="text-xs text-slate-600">
            All 12 modules link dynamically based on candidate profile clicks, position bench reviews, risk alerts, and modal workflows.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { from: 'Dashboard Alert Strip', action: 'On Click', to: 'Talent Risk Report', trigger: 'Zero Successors & Flight Risks' },
              { from: 'Dashboard Depth Chart', action: 'On Click', to: 'Positions Registry', trigger: 'Filter by successor depth' },
              { from: 'Dashboard Readiness Donut', action: 'On Click', to: 'Readiness Timeline', trigger: 'Explore 3 temporal horizons' },
              { from: 'Dashboard 9-Box Mini', action: 'On Click', to: '9-Box Performance Grid', trigger: 'Inspect talent distribution' },
              { from: 'Employees Directory Table Row', action: 'On Row Click', to: 'Employee Detail Profile', trigger: 'Inspect candidacies, dev plans, competencies' },
              { from: 'Positions Registry Table Row', action: 'On Row Click', to: 'Position Bench Detail', trigger: 'View incumbent, successors, 7-factor method' },
              { from: 'Position Bench Screen', action: 'On Click', to: 'BRD & Governance Reference', trigger: 'Audit policy & methodology formula' },
              { from: 'Competency Heatmap Matrix Cell', action: 'On Cell Click', to: 'Edit Rating Modal', trigger: 'Live gap preview & rating stars' },
              { from: 'Succession Plans Cards', action: 'On Nominate Button', to: 'Add/Edit Succession Plan Modal', trigger: 'Create / edit nomination' },
              { from: 'Development Plans Table', action: 'On New Plan Button', to: 'Add/Edit Development Plan Modal', trigger: 'Create / edit milestone' },
            ].map((conn, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{conn.from}</span>
                  <span className="text-[#047857] font-mono text-[11px]">&rarr; {conn.action} &rarr;</span>
                  <strong className="text-[#047857]">{conn.to}</strong>
                </div>
                <span className="text-[11px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                  {conn.trigger}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
