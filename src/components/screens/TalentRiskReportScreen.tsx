import React from 'react';
import {
  AlertTriangle,
  Download,
  ShieldAlert,
  Users,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SignatureBanner } from '../common/SignatureBanner';
import { Avatar } from '../common/Avatar';
import { RiskBadge } from '../common/RiskBadge';
import { ReadinessChip } from '../common/ReadinessChip';
import { CriticalityBadge } from '../common/CriticalityBadge';
import {
  Position,
  Employee,
  DevelopmentPlan,
  SuccessionPlan,
  ActiveScreen,
} from '../../types';

interface TalentRiskReportScreenProps {
  positions: Position[];
  employees: Employee[];
  developmentPlans: DevelopmentPlan[];
  successionPlans: SuccessionPlan[];
  onSelectPosition: (posId: string) => void;
  onSelectEmployee: (empId: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const TalentRiskReportScreen: React.FC<TalentRiskReportScreenProps> = ({
  positions,
  employees,
  developmentPlans,
  successionPlans,
  onSelectPosition,
  onSelectEmployee,
  onNavigate,
}) => {
  // Severity sections
  const criticalZeroSuccessorPositions = positions.filter((p) => p.successorsCount === 0);
  const highFlightRiskEmployees = employees.filter(
    (e) => e.flightRisk === 'Critical' || e.flightRisk === 'High'
  );
  const stalledOrOverduePlans = developmentPlans.filter(
    (p) => p.isOverdue || p.status === 'On Hold'
  );
  const coveredPositions = positions.filter((p) => p.successorsCount > 0);

  // CSV Export logic
  const handleExportCSV = () => {
    const headers = [
      'Report Section',
      'Entity Name',
      'Title / Description',
      'Department',
      'Criticality / Risk Level',
      'Successor Count / Progress',
      'Status / Rationale',
    ];

    const rows: string[][] = [];

    // Section 1
    criticalZeroSuccessorPositions.forEach((p) => {
      rows.push([
        'Critical Positions With 0 Successors',
        p.title,
        `Incumbent: ${p.incumbentName}`,
        p.department,
        p.criticality,
        '0 Successors',
        `Criticality Score: ${p.criticalityScore}/100`,
      ]);
    });

    // Section 2
    highFlightRiskEmployees.forEach((e) => {
      rows.push([
        'High Flight Risk Talent',
        e.name,
        e.title,
        e.department,
        `Flight Risk: ${e.flightRisk}`,
        `Performance: ${e.performanceScore}, Potential: ${e.potentialScore}`,
        e.flightRiskRationale || 'Under executive recruitment target',
      ]);
    });

    // Section 3
    stalledOrOverduePlans.forEach((dp) => {
      rows.push([
        'Stalled Or Overdue Development Plans',
        dp.employeeName,
        dp.goal,
        dp.category,
        dp.isOverdue ? 'Overdue' : 'On Hold',
        `${dp.progressPercent}% Completed`,
        `Due: ${dp.dueDate}`,
      ]);
    });

    // Section 4
    coveredPositions.forEach((p) => {
      rows.push([
        'Covered Positions',
        p.title,
        `Incumbent: ${p.incumbentName}`,
        p.department,
        p.criticality,
        `${p.successorsCount} Successors`,
        `Avg Readiness: ${p.avgTimeToReadinessMonths} months`,
      ]);
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(','))].join(
        '\n'
      );

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Talent_Risk_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <SignatureBanner
        title="Comprehensive Talent Risk Audit"
        subtitle="Executive audit report triaged by severity: zero-depth critical roles, flight risks, and overdue milestones."
        badge="Executive Risk Assessment"
        actions={
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#047857] hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer focus-ring"
          >
            <Download className="w-4 h-4 text-[#047857]" />
            <span>Export CSV Audit</span>
          </button>
        }
      />

      {/* Summary Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-red-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-red-700 font-semibold mb-1">
            <span>Critical 0-Successor Gaps</span>
            <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
          </div>
          <span className="font-mono text-3xl font-extrabold text-[#DC2626] tabular-nums">
            {criticalZeroSuccessorPositions.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Requires immediate board notice</p>
        </div>

        <div className="bg-white rounded-xl border border-orange-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-orange-800 font-semibold mb-1">
            <span>High Flight-Risk Leaders</span>
            <AlertTriangle className="w-4 h-4 text-[#EA580C]" />
          </div>
          <span className="font-mono text-3xl font-extrabold text-[#EA580C] tabular-nums">
            {highFlightRiskEmployees.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Single point dependency risk</p>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
            <span>Stalled / Overdue Plans</span>
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <span className="font-mono text-3xl font-extrabold text-[#D97706] tabular-nums">
            {stalledOrOverduePlans.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Milestone deadlines elapsed</p>
        </div>

        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
            <span>Covered Positions</span>
            <ShieldCheck className="w-4 h-4 text-[#047857]" />
          </div>
          <span className="font-mono text-3xl font-extrabold text-[#047857] tabular-nums">
            {coveredPositions.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">
            {Math.round((coveredPositions.length / positions.length) * 100)}% coverage ratio
          </p>
        </div>
      </div>

      {/* SECTION 1: Critical Positions with Zero Successors (Immediate Alert) */}
      <div className="bg-white rounded-2xl border border-red-300 shadow-xs overflow-hidden">
        <div className="bg-red-50/80 px-6 py-4 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-pulse" />
            <h3 className="text-sm font-bold text-red-950">
              1. Critical Positions With Zero Designated Successors (Immediate Priority)
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
            {criticalZeroSuccessorPositions.length} Positions at Risk
          </span>
        </div>

        <div className="p-6 divide-y divide-red-100">
          {criticalZeroSuccessorPositions.map((pos) => (
            <div
              key={pos.id}
              onClick={() => onSelectPosition(pos.id)}
              className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#0B1F18] group-hover:text-[#DC2626] transition-colors">
                    {pos.title}
                  </h4>
                  <CriticalityBadge level={pos.criticality} score={pos.criticalityScore} size="sm" />
                </div>
                <p className="text-xs text-slate-600 max-w-xl">
                  {pos.description}
                </p>
                <div className="text-xs text-slate-500 pt-0.5">
                  Incumbent: <strong>{pos.incumbentName}</strong> &middot; Department: {pos.department}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-md">
                  No Backup Named
                </span>
                <span className="text-xs font-semibold text-[#047857] flex items-center gap-1">
                  <span>Take Action</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: High Flight-Risk Key Leaders */}
      <div className="bg-white rounded-2xl border border-orange-200 shadow-xs overflow-hidden">
        <div className="bg-orange-50/70 px-6 py-4 border-b border-orange-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
            <h3 className="text-sm font-bold text-orange-950">
              2. High Flight-Risk Leaders & Key Talent Exposure
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
            {highFlightRiskEmployees.length} Leaders Flagged
          </span>
        </div>

        <div className="p-6 divide-y divide-gray-100">
          {highFlightRiskEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => onSelectEmployee(emp.id)}
              className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <Avatar name={emp.name} src={emp.avatar} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                      {emp.name}
                    </h4>
                    <RiskBadge level={emp.flightRisk} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{emp.title} &middot; {emp.department}</p>
                  <p className="text-xs text-orange-900 mt-1 bg-orange-50/80 px-2.5 py-1 rounded border border-orange-100">
                    Rationale: {emp.flightRiskRationale}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-600 shrink-0">
                <div>Perf: <strong>{emp.performanceScore.toFixed(1)}</strong></div>
                <div>Pot: <strong className="text-[#047857]">{emp.potentialScore.toFixed(1)}</strong></div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#047857]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Stalled / Overdue Development Plans */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-xs overflow-hidden">
        <div className="bg-amber-50/70 px-6 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
            <h3 className="text-sm font-bold text-amber-950">
              3. Stalled / Overdue Development Milestones
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
            {stalledOrOverduePlans.length} Plans Delayed
          </span>
        </div>

        <div className="p-6 divide-y divide-gray-100">
          {stalledOrOverduePlans.map((dp) => (
            <div
              key={dp.id}
              onClick={() => onNavigate('development-plans')}
              className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                    {dp.goal}
                  </h4>
                  <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    {dp.isOverdue ? 'Overdue' : dp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Leader: <strong>{dp.employeeName}</strong> &middot; Target Role: {dp.targetPositionTitle || 'Executive General'} &middot; Mentor: {dp.mentorName || 'Unassigned'}
                </p>
                {dp.notes && (
                  <p className="text-xs text-slate-600 italic mt-1">"{dp.notes}"</p>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0">
                <div className="font-mono">
                  <span className="text-slate-400 block text-[10px]">Due Date</span>
                  <strong className="text-red-700">{dp.dueDate}</strong>
                </div>
                <div className="font-mono text-right">
                  <span className="text-slate-400 block text-[10px]">Progress</span>
                  <strong className="text-slate-800">{dp.progressPercent}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Adequately Covered Positions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="bg-emerald-50/50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            <h3 className="text-sm font-bold text-emerald-950">
              4. Adequately Covered Positions with Verified Bench Depth
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-[#047857] bg-emerald-100 px-2 py-0.5 rounded">
            {coveredPositions.length} Roles Healthy
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {coveredPositions.map((pos) => (
            <div
              key={pos.id}
              onClick={() => onSelectPosition(pos.id)}
              className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                    {pos.title}
                  </h4>
                  <span className="text-[11px] text-slate-500">{pos.department}</span>
                </div>
                <CriticalityBadge level={pos.criticality} score={pos.criticalityScore} size="sm" />
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Incumbent: <strong>{pos.incumbentName}</strong>
                </span>
                <span className="font-mono font-bold text-[#047857]">
                  {pos.successorsCount} Nominees
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
