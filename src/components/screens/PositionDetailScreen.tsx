import React, { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Users,
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Plus,
  UserCheck,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { CriticalityBadge } from '../common/CriticalityBadge';
import { ReadinessChip } from '../common/ReadinessChip';
import { RiskBadge } from '../common/RiskBadge';
import { ScoreBar } from '../common/ScoreBar';
import { Position, SuccessionPlan, Employee, ActiveScreen } from '../../types';

interface PositionDetailScreenProps {
  position: Position;
  successionPlans: SuccessionPlan[];
  employees: Employee[];
  onBack: () => void;
  onSelectEmployee: (empId: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onAddSuccessor: () => void;
  onOpenMethodology: () => void;
}

export const PositionDetailScreen: React.FC<PositionDetailScreenProps> = ({
  position,
  successionPlans,
  employees,
  onBack,
  onSelectEmployee,
  onNavigate,
  onAddSuccessor,
  onOpenMethodology,
}) => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'methodology' | 'readiness'>('candidates');

  // Candidates nominated for this position
  const candidates = successionPlans.filter((sp) => sp.positionId === position.id);

  const readyNowCount = candidates.filter((c) => c.readiness === 'Ready Now').length;
  const oneToTwoCount = candidates.filter((c) => c.readiness === '1-2 Years').length;
  const threeToFiveCount = candidates.filter((c) => c.readiness === '3-5 Years').length;

  const isCriticalGap = position.successorsCount === 0;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumbs & Back Nav */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#047857] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Critical Positions</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAddSuccessor}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#047857] hover:bg-[#064E3B] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nominate Successor</span>
          </button>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              <CriticalityBadge level={position.criticality} score={position.criticalityScore} size="md" />
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {position.department} Department
              </span>
              {isCriticalGap && (
                <span className="text-xs font-bold text-[#DC2626] bg-red-100 px-2.5 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" /> Zero Successors - Immediate Vulnerability
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F18] tracking-tight">
              {position.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {position.description}
            </p>
          </div>

          {/* Incumbent Leader Callout */}
          <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl shrink-0 min-w-64">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Current Incumbent
            </span>
            <div
              onClick={() => onSelectEmployee(position.incumbentId)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Avatar name={position.incumbentName} src={position.incumbentAvatar} size="lg" />
              <div>
                <h4 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                  {position.incumbentName}
                </h4>
                <span className="text-[11px] text-slate-500 block">Current Role Holder</span>
                <span className="text-[10px] text-[#047857] font-semibold mt-0.5 inline-block group-hover:underline">
                  View Full Profile &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row: Bench Depth, Ready Now, Time to Readiness */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Successor Depth
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-mono text-3xl font-bold tabular-nums ${
                position.successorsCount === 0 ? 'text-[#DC2626]' : 'text-[#0B1F18]'
              }`}
            >
              {position.successorsCount}
            </span>
            <span className="text-xs text-slate-500">
              candidates (min target: {position.minSuccessorsRequired})
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Ready Now (&lt;6 Months)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-[#047857] tabular-nums">
              {readyNowCount}
            </span>
            <span className="text-xs text-slate-500">immediate emergency replacement</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Avg Time to Readiness
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-slate-800 tabular-nums">
              {position.avgTimeToReadinessMonths}
            </span>
            <span className="text-xs text-slate-500">months development window</span>
          </div>
        </div>
      </div>

      {/* Tabs: Successor Nominees, Critical Position Method, Readiness Horizon */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="flex items-center border-b border-gray-200 bg-slate-50/70 px-4 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('candidates')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'candidates'
                ? 'border-[#047857] text-[#047857] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Successor Nominees ({candidates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('methodology')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'methodology'
                ? 'border-[#047857] text-[#047857] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Critical Position Method (7 Weighted Factors)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('readiness')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'readiness'
                ? 'border-[#047857] text-[#047857] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Readiness Horizon Breakdown</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Candidate List */}
          {activeTab === 'candidates' && (
            <div className="space-y-4">
              {candidates.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-red-50/50 border border-red-200">
                  <ShieldAlert className="w-10 h-10 text-[#DC2626] mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-red-950 mb-1">
                    No Designated Successors Identified
                  </h4>
                  <p className="text-xs text-red-800 max-w-md mx-auto mb-4">
                    This critical role currently lacks an emergency backfill or long-term pipeline candidate. Vacancy presents an immediate threat to operational continuity.
                  </p>
                  <button
                    type="button"
                    onClick={onAddSuccessor}
                    className="px-4 py-2 bg-[#DC2626] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Nominate First Candidate
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {candidates.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => onSelectEmployee(plan.candidateId)}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 rounded-xl px-3 -mx-3 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar name={plan.candidateName} src={plan.candidateAvatar} size="lg" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors">
                              {plan.candidateName}
                            </h4>
                            <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                              Tier {plan.ranking}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {plan.candidateTitle}
                          </p>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic">
                            "{plan.notes}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 pl-16 md:pl-0">
                        <div className="space-y-1 w-32 hidden sm:block">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Perf:</span>
                            <span className="font-mono font-bold text-slate-700 tabular-nums">
                              {plan.performanceScore.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Pot:</span>
                            <span className="font-mono font-bold text-[#047857] tabular-nums">
                              {plan.potentialScore.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Flight Risk</span>
                          <RiskBadge level={plan.flightRisk} size="sm" />
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Horizon</span>
                          <ReadinessChip readiness={plan.readiness} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Critical Position Method Panel */}
          {activeTab === 'methodology' && (
            <div className="space-y-6">
              {/* Definition */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1.5">
                <h4 className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                  Critical Position Definition
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  A role whose vacancy, underperformance, or sudden departure would immediately jeopardize
                  strategic objectives, revenue generation, operational viability, or regulatory standing within
                  90 days. Every critical position requires a minimum of 2 evaluated candidates with at least one "Ready Now" successor.
                </p>
              </div>

              {/* 7 Weighted Factors Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  The 7 Weighted Factors Formula
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">1. Strategic Impact (25%)</span>
                      <span className="font-mono text-[#047857]">{position.criticalityFactors.strategicImpact}/100</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Direct leverage over multi-year corporate goals and enterprise positioning.</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">2. Operational Continuity (20%)</span>
                      <span className="font-mono text-[#047857]">{position.criticalityFactors.operationalContinuity}/100</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Degree to which core day-to-day delivery ceases upon vacancy.</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">3. Customer & Revenue Exposure (15%)</span>
                      <span className="font-mono text-[#047857]">{position.criticalityFactors.customerRevenue}/100</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Immediate financial downside, contract renewals, or client churn risk.</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">4. Talent Scarcity in Market (15%)</span>
                      <span className="font-mono text-[#047857]">{position.criticalityFactors.scarcity}/100</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Difficulty, duration, and premium cost of recruiting external executive talent.</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">5. Regulatory & Reputational Risk (10%)</span>
                      <span className="font-mono text-[#047857]">{position.criticalityFactors.regulatoryReputational}/100</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Compliance mandates, SEC filings, audit fiduciary duties, and brand trust.</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">6. Time-to-Competence (10%)</span>
                      <span className="font-mono text-[#047857]">{position.criticalityFactors.timeToCompetence}/100</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Months required for an experienced newcomer to achieve full output velocity.</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-1 md:col-span-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">7. Vacancy Exposure Duration (5%)</span>
                      <span className="font-mono text-[#047857]">{position.criticalityFactors.vacancyExposure}/100</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Calculated buffer before severe degradation manifests across downstream teams.</p>
                  </div>
                </div>
              </div>

              {/* Score Bands Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Criticality Score Bands & Required Coverage
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Band</th>
                        <th className="p-3">Score Range</th>
                        <th className="p-3">Succession Coverage Mandate</th>
                        <th className="p-3">Review Frequency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className={position.criticalityScore >= 80 ? 'bg-red-50/40 font-semibold' : ''}>
                        <td className="p-3 text-red-700 font-bold">Critical</td>
                        <td className="p-3 font-mono">80 - 100</td>
                        <td className="p-3">&ge;2 named successors, at least 1 "Ready Now"</td>
                        <td className="p-3">Quarterly Board Audit</td>
                      </tr>
                      <tr className={position.criticalityScore >= 60 && position.criticalityScore < 80 ? 'bg-orange-50/40 font-semibold' : ''}>
                        <td className="p-3 text-orange-700 font-bold">High</td>
                        <td className="p-3 font-mono">60 - 79</td>
                        <td className="p-3">&ge;1 successor within 1-2 Years</td>
                        <td className="p-3">Bi-Annual Calibration</td>
                      </tr>
                      <tr className={position.criticalityScore >= 40 && position.criticalityScore < 60 ? 'bg-amber-50/40 font-semibold' : ''}>
                        <td className="p-3 text-amber-700 font-bold">Medium</td>
                        <td className="p-3 font-mono">40 - 59</td>
                        <td className="p-3">Identified talent pool pipeline</td>
                        <td className="p-3">Annual Review</td>
                      </tr>
                      <tr className={position.criticalityScore < 40 ? 'bg-slate-50 font-semibold' : ''}>
                        <td className="p-3 text-slate-600 font-bold">Monitor</td>
                        <td className="p-3 font-mono">0 - 39</td>
                        <td className="p-3">Standard HR replacement cycle</td>
                        <td className="p-3">As Needed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 text-xs text-slate-600">
                Governed by Meridian Global Executive Succession Policy &amp; Board Audit Cadence
              </div>
            </div>
          )}

          {/* Tab 3: Readiness Timeline */}
          {activeTab === 'readiness' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Ready Now Band */}
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                      Ready Now (&lt;6 Mos)
                    </span>
                    <span className="font-mono text-xs font-bold text-[#064E3B]">
                      {readyNowCount} Nominees
                    </span>
                  </div>
                  {candidates.filter((c) => c.readiness === 'Ready Now').map((c) => (
                    <div key={c.id} className="p-3 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Avatar name={c.candidateName} src={c.candidateAvatar} size="sm" />
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-900 block truncate">{c.candidateName}</span>
                          <span className="text-[10px] text-slate-500 truncate block">{c.candidateTitle}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {readyNowCount === 0 && (
                    <p className="text-xs text-red-600 font-medium italic">No immediate successor ready.</p>
                  )}
                </div>

                {/* 1-2 Years Band */}
                <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      1 - 2 Years
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {oneToTwoCount} Nominees
                    </span>
                  </div>
                  {candidates.filter((c) => c.readiness === '1-2 Years').map((c) => (
                    <div key={c.id} className="p-3 bg-white rounded-lg border border-gray-200 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Avatar name={c.candidateName} src={c.candidateAvatar} size="sm" />
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-900 block truncate">{c.candidateName}</span>
                          <span className="text-[10px] text-slate-500 truncate block">{c.candidateTitle}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3-5 Years Band */}
                <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      3 - 5 Years
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {threeToFiveCount} Nominees
                    </span>
                  </div>
                  {candidates.filter((c) => c.readiness === '3-5 Years').map((c) => (
                    <div key={c.id} className="p-3 bg-white rounded-lg border border-gray-200 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Avatar name={c.candidateName} src={c.candidateAvatar} size="sm" />
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-900 block truncate">{c.candidateName}</span>
                          <span className="text-[10px] text-slate-500 truncate block">{c.candidateTitle}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
