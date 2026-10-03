import React from 'react';
import {
  Users,
  GitBranch,
  Target,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import { SignatureBanner } from '../common/SignatureBanner';
import { KpiCard } from '../common/KpiCard';
import { RiskBadge } from '../common/RiskBadge';
import { ReadinessChip } from '../common/ReadinessChip';
import { CriticalityBadge } from '../common/CriticalityBadge';
import { Avatar } from '../common/Avatar';
import {
  Employee,
  Position,
  SuccessionPlan,
  DevelopmentPlan,
  ActiveScreen,
} from '../../types';

interface DashboardScreenProps {
  employees: Employee[];
  positions: Position[];
  successionPlans: SuccessionPlan[];
  developmentPlans: DevelopmentPlan[];
  onNavigate: (screen: ActiveScreen) => void;
  onSelectEmployee: (empId: string) => void;
  onSelectPosition: (posId: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  employees,
  positions,
  successionPlans,
  developmentPlans,
  onNavigate,
  onSelectEmployee,
  onSelectPosition,
}) => {
  // Calculations
  const totalHeadcount = employees.length;
  const criticalPositionsCount = positions.filter((p) => p.criticality === 'Critical').length;
  const coveredPositionsCount = positions.filter((p) => p.successorsCount > 0).length;
  const plansInProgressCount = developmentPlans.filter((p) => p.status === 'In Progress').length;
  const totalPlans = successionPlans.length;
  const totalDevPlans = developmentPlans.length;
  const activeCompetenciesCount = 10;

  // Zero successors positions & critical flight risk
  const zeroSuccessorPositions = positions.filter((p) => p.successorsCount === 0);
  const highFlightRiskEmployees = employees.filter(
    (e) => e.flightRisk === 'Critical' || e.flightRisk === 'High'
  );

  // System KPI: Average bench strength
  const totalSuccessors = positions.reduce((acc, p) => acc + p.successorsCount, 0);
  const avgBenchStrength = (totalSuccessors / (positions.length || 1)).toFixed(1);

  // Succession depth breakdown
  const depthBreakdown = {
    zero: positions.filter((p) => p.successorsCount === 0).length,
    one: positions.filter((p) => p.successorsCount === 1).length,
    two: positions.filter((p) => p.successorsCount === 2).length,
    threePlus: positions.filter((p) => p.successorsCount >= 3).length,
  };

  // Readiness distribution
  const readinessCounts = {
    readyNow: successionPlans.filter((p) => p.readiness === 'Ready Now').length,
    oneToTwo: successionPlans.filter((p) => p.readiness === '1-2 Years').length,
    threeToFive: successionPlans.filter((p) => p.readiness === '3-5 Years').length,
  };
  const totalReadinessNominees =
    readinessCounts.readyNow + readinessCounts.oneToTwo + readinessCounts.threeToFive || 1;

  // Flight Risk Distribution (Critical, High, Medium, Low)
  const flightRiskCounts = {
    critical: employees.filter((e) => e.flightRisk === 'Critical').length,
    high: employees.filter((e) => e.flightRisk === 'High').length,
    medium: employees.filter((e) => e.flightRisk === 'Medium').length,
    low: employees.filter((e) => e.flightRisk === 'Low').length,
  };
  const totalEmployeesCount = employees.length || 1;

  // Mini 9-box summary counts
  const starsCount = employees.filter((e) => e.boxGridPosition.includes('Star')).length;
  const highPotCount = employees.filter((e) => e.boxGridPosition.includes('High Potential')).length;
  const solidPerfCount = employees.filter((e) => e.boxGridPosition.includes('Solid Performer')).length;
  const coreCount = employees.filter((e) => e.boxGridPosition.includes('Core Employee')).length;
  const specialistCount = employees.filter((e) => e.boxGridPosition.includes('Specialist')).length;
  const otherCount = employees.length - (starsCount + highPotCount + solidPerfCount + coreCount + specialistCount);

  return (
    <div className="space-y-6">
      {/* Signature full-width emerald header banner */}
      <SignatureBanner
        title="Admin Dashboard"
        subtitle="Company-wide workforce insights, leadership bench health, and department continuity analytics."
        badge="Executive Talent Intelligence"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('talent-risk')}
              className="px-4 py-2 bg-white text-[#047857] hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer focus-ring"
            >
              Run Risk Audit
            </button>
            <button
              type="button"
              onClick={() => onNavigate('positions')}
              className="px-4 py-2 bg-[#064E3B] text-emerald-100 hover:text-white rounded-lg text-xs font-semibold transition-all border border-emerald-600/50 cursor-pointer focus-ring"
            >
              Positions Registry
            </button>
          </div>
        }
      />

      {/* Red Alert Strip for Zero Successors & High Flight Risks */}
      {(zeroSuccessorPositions.length > 0 || highFlightRiskEmployees.length > 0) && (
        <div className="rounded-xl border border-red-300 bg-red-50/90 p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-lg bg-red-600 text-white shrink-0 mt-0.5 sm:mt-0">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-red-950">
                  Critical Succession Vulnerability Alert
                </h4>
                <p className="text-xs text-red-800">
                  <strong>{zeroSuccessorPositions.length} critical positions</strong> have zero identified successors, and{' '}
                  <strong>{highFlightRiskEmployees.length} key leaders</strong> present high flight risks.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('talent-risk')}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DC2626] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer focus-ring"
            >
              <span>View Vulnerabilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ORGANIZATION HEALTH OVERVIEW (Pixel-perfect matching design specification) */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F18] tracking-tight">
            Dashboard
          </h2>
          <p className="font-mono text-xs font-bold tracking-widest text-slate-500 uppercase">
            ORGANIZATION HEALTH OVERVIEW
          </p>
        </div>

        {/* 4 Core KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Employees */}
          <div
            onClick={() => onNavigate('employees')}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex items-start justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1 group-hover:text-blue-700 transition-colors">
                Total Employees
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0B1F18] tracking-tight tabular-nums">
                {totalHeadcount}
              </span>
            </div>
            <div className="bg-blue-50/80 text-blue-600 p-3 rounded-xl border border-blue-100/80 shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* 2. Critical Positions */}
          <div
            onClick={() => onNavigate('positions')}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md hover:border-red-300 transition-all cursor-pointer group flex items-start justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1 group-hover:text-red-600 transition-colors">
                Critical Positions
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0B1F18] tracking-tight tabular-nums">
                {criticalPositionsCount}
              </span>
            </div>
            <div className="bg-red-50/80 text-red-600 p-3 rounded-xl border border-red-100/80 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          {/* 3. Covered Positions */}
          <div
            onClick={() => onNavigate('positions')}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex items-start justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1 group-hover:text-[#047857] transition-colors">
                Covered Positions
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0B1F18] tracking-tight tabular-nums">
                {coveredPositionsCount}
              </span>
            </div>
            <div className="bg-emerald-50/80 text-[#16A34A] p-3 rounded-xl border border-emerald-100/80 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* 4. Plans In Progress */}
          <div
            onClick={() => onNavigate('development-plans')}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group flex items-start justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1 group-hover:text-amber-600 transition-colors">
                Plans In Progress
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0B1F18] tracking-tight tabular-nums">
                {plansInProgressCount}
              </span>
            </div>
            <div className="bg-amber-50/80 text-[#D97706] p-3 rounded-xl border border-amber-100/80 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 2 Bottom Cards: Readiness Breakdown & System KPI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Readiness Breakdown Card */}
          <div
            onClick={() => onNavigate('readiness-timeline')}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                Readiness Breakdown
              </h3>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#047857] transition-transform group-hover:translate-x-1" />
            </div>

            <div className="space-y-4">
              {/* Ready Now */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800">Ready Now</span>
                  <span className="font-mono font-bold text-slate-800 tabular-nums">
                    {readinessCounts.readyNow}
                  </span>
                </div>
                <div className="w-full bg-[#E5E7EB]/70 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#10B981] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(readinessCounts.readyNow / totalReadinessNominees) * 100}%` }}
                  />
                </div>
              </div>

              {/* 1-2 Years */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800">1-2 Years</span>
                  <span className="font-mono font-bold text-slate-800 tabular-nums">
                    {readinessCounts.oneToTwo}
                  </span>
                </div>
                <div className="w-full bg-[#E5E7EB]/70 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#2563EB] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(readinessCounts.oneToTwo / totalReadinessNominees) * 100}%` }}
                  />
                </div>
              </div>

              {/* 3-5 Years */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800">3-5 Years</span>
                  <span className="font-mono font-bold text-slate-800 tabular-nums">
                    {readinessCounts.threeToFive}
                  </span>
                </div>
                <div className="w-full bg-[#E5E7EB]/70 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#475569] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(readinessCounts.threeToFive / totalReadinessNominees) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System KPI Card */}
          <div
            onClick={() => onNavigate('positions')}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                System KPI
              </h3>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#047857] transition-transform group-hover:translate-x-1" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-6">
              <span className="text-6xl sm:text-7xl font-extrabold font-mono text-[#0B1F18] tracking-tight group-hover:text-[#047857] transition-colors tabular-nums">
                {avgBenchStrength}
              </span>
              <span className="font-mono text-xs font-bold tracking-widest text-slate-500 uppercase mt-2">
                AVG BENCH STRENGTH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mid-Row: Succession Depth Bar Chart & Readiness Donut & Mini 9-Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Succession Depth Bar Chart */}
        <div
          onClick={() => onNavigate('positions')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                Succession Depth Distribution
              </h3>
              <p className="text-xs text-slate-500">Positions categorized by successor count</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#047857] transition-transform group-hover:translate-x-1" />
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-red-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626]" /> 0 Successors (Critical Gap)
                </span>
                <span className="font-mono font-bold text-red-700 tabular-nums">
                  {depthBreakdown.zero} positions
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#DC2626] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(depthBreakdown.zero / positions.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]" /> 1 Successor (Single Point)
                </span>
                <span className="font-mono font-bold text-amber-700 tabular-nums">
                  {depthBreakdown.one} positions
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#D97706] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(depthBreakdown.one / positions.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" /> 2 Successors (Target Bench)
                </span>
                <span className="font-mono font-bold text-emerald-800 tabular-nums">
                  {depthBreakdown.two} positions
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#16A34A] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(depthBreakdown.two / positions.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#047857] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#047857]" /> 3+ Successors (Deep Bench)
                </span>
                <span className="font-mono font-bold text-[#047857] tabular-nums">
                  {depthBreakdown.threePlus} positions
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#047857] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(depthBreakdown.threePlus / positions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
            <span>Criticality benchmark: &ge;2 named candidates</span>
            <span className="font-bold text-[#047857]">View Position Registry &rarr;</span>
          </div>
        </div>

        {/* Talent Flight Risk & Retention Exposure (Deduplicated replacement) */}
        <div
          onClick={() => onNavigate('talent-risk')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-red-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B1F18] group-hover:text-red-600 transition-colors">
                Talent Flight Risk Distribution
              </h3>
              <p className="text-xs text-slate-500">Retention vulnerability breakdown</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-transform group-hover:translate-x-1" />
          </div>

          {/* Donut Chart representation */}
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Low Risk Segment (Green #10B981) */}
                <path
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeDasharray={`${(flightRiskCounts.low / totalEmployeesCount) * 100}, 100`}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* High + Critical Risk Segment (Red #DC2626) */}
                <path
                  stroke="#DC2626"
                  strokeWidth="4.5"
                  strokeDasharray={`${((flightRiskCounts.critical + flightRiskCounts.high) / totalEmployeesCount) * 100}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl font-extrabold text-red-600 tabular-nums">
                  {flightRiskCounts.critical + flightRiskCounts.high}
                </span>
                <span className="text-[10px] text-red-700 font-bold uppercase">At Risk</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs flex-1">
              <div className="flex items-center justify-between p-1.5 rounded bg-red-50/80 border border-red-200">
                <span className="font-bold text-red-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626]" /> Critical Risk
                </span>
                <span className="font-mono font-bold text-red-700 tabular-nums">
                  {flightRiskCounts.critical}
                </span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-amber-50">
                <span className="font-semibold text-amber-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]" /> High Risk
                </span>
                <span className="font-mono font-bold text-amber-800 tabular-nums">
                  {flightRiskCounts.high}
                </span>
              </div>
              <div className="flex items-center justify-between p-1 rounded">
                <span className="font-medium text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> Medium Risk
                </span>
                <span className="font-mono font-bold text-slate-700 tabular-nums">
                  {flightRiskCounts.medium}
                </span>
              </div>
              <div className="flex items-center justify-between p-1 rounded">
                <span className="font-medium text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Low Risk
                </span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  {flightRiskCounts.low}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {flightRiskCounts.critical + flightRiskCounts.high} leaders flagged with retention risk
            </span>
            <span className="font-bold text-red-600 group-hover:text-red-700">Audit Risk Report &rarr;</span>
          </div>
        </div>

        {/* Mini 9-Box Summary */}
        <div
          onClick={() => onNavigate('nine-box')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                9-Box Talent Calibration
              </h3>
              <p className="text-xs text-slate-500">Distribution across performance & potential</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#047857] transition-transform group-hover:translate-x-1" />
          </div>

          {/* Mini 3x3 Grid Matrix Preview */}
          <div className="grid grid-cols-3 gap-1.5 py-1">
            <div className="bg-emerald-50 p-2 rounded-lg text-center border border-emerald-100">
              <span className="text-[10px] text-emerald-800 font-semibold block truncate">Rough Diam.</span>
              <span className="font-mono text-sm font-bold text-[#047857] tabular-nums">1</span>
            </div>
            <div className="bg-emerald-100/70 p-2 rounded-lg text-center border border-emerald-200">
              <span className="text-[10px] text-emerald-900 font-semibold block truncate">High Pot.</span>
              <span className="font-mono text-sm font-bold text-[#047857] tabular-nums">{highPotCount}</span>
            </div>
            <div className="bg-[#4EC69A]/30 p-2 rounded-lg text-center border border-[#4EC69A]">
              <span className="text-[10px] text-[#064E3B] font-extrabold block truncate">★ Star / Leader</span>
              <span className="font-mono text-sm font-extrabold text-[#064E3B] tabular-nums">{starsCount}</span>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
              <span className="text-[10px] text-slate-600 font-medium block truncate">Inconsist.</span>
              <span className="font-mono text-sm font-bold text-slate-700 tabular-nums">0</span>
            </div>
            <div className="bg-emerald-50/60 p-2 rounded-lg text-center border border-emerald-100">
              <span className="text-[10px] text-emerald-800 font-semibold block truncate">Core</span>
              <span className="font-mono text-sm font-bold text-emerald-800 tabular-nums">{coreCount}</span>
            </div>
            <div className="bg-emerald-100/50 p-2 rounded-lg text-center border border-emerald-200">
              <span className="text-[10px] text-emerald-900 font-semibold block truncate">Solid Perf.</span>
              <span className="font-mono text-sm font-bold text-[#047857] tabular-nums">{solidPerfCount}</span>
            </div>

            <div className="bg-red-50/50 p-2 rounded-lg text-center border border-red-100">
              <span className="text-[10px] text-red-700 font-medium block truncate">Underperf.</span>
              <span className="font-mono text-sm font-bold text-red-700 tabular-nums">0</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
              <span className="text-[10px] text-slate-600 font-medium block truncate">Contrib.</span>
              <span className="font-mono text-sm font-bold text-slate-700 tabular-nums">1</span>
            </div>
            <div className="bg-slate-100 p-2 rounded-lg text-center border border-slate-200">
              <span className="text-[10px] text-slate-700 font-semibold block truncate">Specialist</span>
              <span className="font-mono text-sm font-bold text-slate-800 tabular-nums">{specialistCount}</span>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
            <span>Stars & High Potentials: {starsCount + highPotCount} leaders</span>
            <span className="font-bold text-[#047857]">Explore 9-Box Grid &rarr;</span>
          </div>
        </div>
      </div>

      {/* Bottom Lists: Recently Added Employees & Recent Succession Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Added Employees */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0B1F18]">Key Leadership Talent Pool</h3>
              <p className="text-xs text-slate-500">Assessed leaders and executives</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('employees')}
              className="text-xs font-semibold text-[#047857] hover:text-[#064E3B] flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({employees.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {employees.slice(0, 5).map((emp) => (
              <div
                key={emp.id}
                onClick={() => onSelectEmployee(emp.id)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={emp.name} src={emp.avatar} size="md" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                      {emp.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {emp.title} &middot; <span className="font-medium text-slate-700">{emp.department}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <RiskBadge level={emp.flightRisk} size="sm" />
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 block font-medium">9-Box</span>
                    <span className="text-[11px] font-semibold text-[#047857] truncate max-w-28 block">
                      {emp.boxGridPosition.split('/')[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Succession Plans */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0B1F18]">Active Succession Plans</h3>
              <p className="text-xs text-slate-500">Designated candidate nominations</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('succession-plans')}
              className="text-xs font-semibold text-[#047857] hover:text-[#064E3B] flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({successionPlans.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {successionPlans.slice(0, 5).map((plan) => (
              <div
                key={plan.id}
                onClick={() => onSelectPosition(plan.positionId)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={plan.candidateName} src={plan.candidateAvatar} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                        {plan.candidateName}
                      </h4>
                      <span className="text-[10px] text-slate-400">&rarr;</span>
                      <span className="text-xs font-semibold text-[#047857] truncate">
                        {plan.positionTitle}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Tier {plan.ranking} Successor &middot; {plan.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ReadinessChip readiness={plan.readiness} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
