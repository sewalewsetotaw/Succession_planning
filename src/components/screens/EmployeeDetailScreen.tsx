import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Briefcase,
  Layers,
  Calendar,
  AlertTriangle,
  GitBranch,
  Target,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { RiskBadge } from '../common/RiskBadge';
import { ReadinessChip } from '../common/ReadinessChip';
import { GaugeScore } from '../common/GaugeScore';
import { ScoreBar } from '../common/ScoreBar';
import {
  Employee,
  SuccessionPlan,
  DevelopmentPlan,
  CandidateRating,
  Competency,
} from '../../types';

interface EmployeeDetailScreenProps {
  employee: Employee;
  allEmployees: Employee[];
  successionPlans: SuccessionPlan[];
  developmentPlans: DevelopmentPlan[];
  candidateRating?: CandidateRating;
  competencies: Competency[];
  onBack: () => void;
  onSelectEmployee: (empId: string) => void;
  onSelectPosition: (posId: string) => void;
  onEditCompetency: (candidateRating: CandidateRating, comp: Competency) => void;
}

export const EmployeeDetailScreen: React.FC<EmployeeDetailScreenProps> = ({
  employee,
  allEmployees,
  successionPlans,
  developmentPlans,
  candidateRating,
  competencies,
  onBack,
  onSelectEmployee,
  onSelectPosition,
  onEditCompetency,
}) => {
  const [activeTab, setActiveTab] = useState<'succession' | 'devPlans' | 'competencies'>('succession');

  // Related succession plans where this employee is the candidate
  const candidacies = successionPlans.filter((sp) => sp.candidateId === employee.id);

  // Related development plans
  const employeeDevPlans = developmentPlans.filter((dp) => dp.employeeId === employee.id);

  const manager = employee.managerId
    ? allEmployees.find((e) => e.id === employee.managerId)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#047857] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Talent Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">9-Box Classification:</span>
          <span className="text-xs font-bold text-[#047857] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            {employee.boxGridPosition}
          </span>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs relative overflow-hidden">
        {/* Subtle decorative mint tint in corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <Avatar name={employee.name} src={employee.avatar} size="xl" />
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-extrabold text-[#0B1F18] tracking-tight">
                  {employee.name}
                </h1>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {employee.level}
                </span>
                {employee.isKeyTalent && (
                  <span className="text-[11px] font-bold bg-[#4EC69A]/20 text-[#064E3B] border border-[#4EC69A]/40 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#047857]" />
                    Key Talent
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-700">{employee.title}</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employee.department}</span>
                </div>
                <span>&middot;</span>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${employee.email}`} className="hover:underline text-slate-600">
                    {employee.email}
                  </a>
                </div>
                <span>&middot;</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employee.yearsExperience} Years Exp</span>
                </div>
              </div>

              {/* Reporting Manager link */}
              {manager && (
                <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="text-slate-400">Reports to:</span>
                  <button
                    type="button"
                    onClick={() => onSelectEmployee(manager.id)}
                    className="font-bold text-[#047857] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{manager.name}</span>
                    <span className="text-slate-400 font-normal">({manager.title})</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Gauges (1-5) & Risk Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Performance Gauge */}
        <GaugeScore
          label="Performance Rating"
          score={employee.performanceScore}
          maxScore={5.0}
          descriptor={employee.performanceScore >= 4.5 ? 'Exceptional Exceeds' : 'Strong Performer'}
          color="emerald"
        />

        {/* Potential Gauge */}
        <GaugeScore
          label="Leadership Potential"
          score={employee.potentialScore}
          maxScore={5.0}
          descriptor={employee.potentialScore >= 4.5 ? 'Executive Ready' : 'High Potential'}
          color="mint"
        />

        {/* Flight Risk Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Flight Risk
              </span>
              <RiskBadge level={employee.flightRisk} size="sm" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {employee.flightRiskRationale || 'Tenure and retention compensation remain within normal executive bounds.'}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-slate-400">
            Last retention review: Q3 2026
          </div>
        </div>

        {/* Retirement Risk Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Retirement Horizon
              </span>
              <RiskBadge level={employee.retirementRisk} size="sm" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {employee.retireYears
                ? `Projected retirement eligibility within approximately ${employee.retireYears} years. Backfill grooming active.`
                : 'Long-term active tenure projected with no immediate retirement risk.'}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-slate-400 font-mono">
            {employee.retireYears ? `~${employee.retireYears} Years Remaining` : 'Low Horizon Risk'}
          </div>
        </div>
      </div>

      {/* Tabs: Succession Candidacies, Active Development Plans, Competencies */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Tab navigation headers */}
        <div className="flex items-center border-b border-gray-200 bg-slate-50/70 px-4 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('succession')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'succession'
                ? 'border-[#047857] text-[#047857] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Succession Candidacies ({candidacies.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('devPlans')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'devPlans'
                ? 'border-[#047857] text-[#047857] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Active Development Plans ({employeeDevPlans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('competencies')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'competencies'
                ? 'border-[#047857] text-[#047857] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Executive Competencies (10)</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="p-6">
          {/* Section 1: Succession Candidacies */}
          {activeTab === 'succession' && (
            <div className="space-y-4">
              {candidacies.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  This employee is not currently nominated as a designated successor for any tracked position.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidacies.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => onSelectPosition(plan.positionId)}
                      className="p-5 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Target Position
                          </span>
                          <h4 className="text-sm font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                            {plan.positionTitle}
                          </h4>
                          <span className="text-xs text-slate-500">{plan.department} Department</span>
                        </div>
                        <ReadinessChip readiness={plan.readiness} />
                      </div>

                      <div className="py-2 flex items-center gap-3 text-xs border-y border-gray-100 my-2">
                        <span className="text-slate-500">
                          Priority: <strong className="text-slate-800">Tier {plan.ranking} Successor</strong>
                        </span>
                        <span>&middot;</span>
                        <span className="text-slate-500">
                          Reviewed: <strong className="font-mono text-slate-800">{plan.lastReviewed}</strong>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {plan.notes}
                      </p>

                      <div className="mt-3 pt-2 flex items-center justify-between text-xs text-[#047857] font-semibold">
                        <span>View Position Bench</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 2: Development Plans */}
          {activeTab === 'devPlans' && (
            <div className="space-y-4">
              {employeeDevPlans.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No active development plans on record for this leader.
                </div>
              ) : (
                <div className="space-y-3">
                  {employeeDevPlans.map((dp) => (
                    <div
                      key={dp.id}
                      className={`p-4 rounded-xl border transition-all ${
                        dp.isOverdue
                          ? 'border-red-300 bg-red-50/60'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0B1F18]">{dp.goal}</span>
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {dp.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {dp.isOverdue && (
                            <span className="text-[11px] font-bold text-[#DC2626] bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Overdue
                            </span>
                          )}
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                              dp.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : dp.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {dp.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 mb-2">
                        <div>
                          <span className="text-slate-400">Target Role: </span>
                          <strong className="text-slate-800">{dp.targetPositionTitle || 'Executive General'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Mentor / Sponsor: </span>
                          <strong className="text-slate-800">{dp.mentorName || 'Executive Committee'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Due Date: </span>
                          <strong className="font-mono text-slate-800">{dp.dueDate}</strong>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${dp.isOverdue ? 'bg-red-600' : 'bg-[#047857]'}`}
                            style={{ width: `${dp.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-800 tabular-nums">
                          {dp.progressPercent}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 3: Competencies & Gap Bars */}
          {activeTab === 'competencies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>
                  Comparing current capability vs target requirements for {candidateRating?.targetPositionTitle || 'Executive Benchmark'}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">Click competency to edit rating</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {competencies.map((comp) => {
                  const rating = candidateRating?.ratings[comp.id] || { current: 3, target: 4, assessed: false };
                  const gap = rating.current - rating.target;

                  return (
                    <div
                      key={comp.id}
                      onClick={() => candidateRating && onEditCompetency(candidateRating, comp)}
                      className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                            {comp.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                            {comp.category}
                          </span>
                        </div>

                        {/* Gap badge */}
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            gap >= 0
                              ? 'bg-emerald-100 text-[#16A34A]'
                              : gap === -1
                              ? 'bg-amber-100 text-[#D97706]'
                              : gap === -2
                              ? 'bg-orange-100 text-[#EA580C]'
                              : 'bg-red-100 text-[#DC2626]'
                          }`}
                        >
                          {gap > 0 ? `+${gap}` : gap} Gap
                        </span>
                      </div>

                      {/* Current vs Target Bars */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-16 text-[11px] text-slate-500 font-medium">Current:</span>
                          <ScoreBar value={rating.current} max={5} color="emerald" size="sm" />
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-16 text-[11px] text-slate-500 font-medium">Target:</span>
                          <ScoreBar value={rating.target} max={5} color="mint" size="sm" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
