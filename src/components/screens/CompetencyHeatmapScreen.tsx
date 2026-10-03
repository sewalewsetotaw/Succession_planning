import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Filter,
  ArrowUpDown,
  Edit2,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SignatureBanner } from '../common/SignatureBanner';
import { Avatar } from '../common/Avatar';
import { Competency, CandidateRating } from '../../types';

interface CompetencyHeatmapScreenProps {
  competencies: Competency[];
  candidateRatings: CandidateRating[];
  onEditRating: (candidate: CandidateRating, comp: Competency) => void;
  onSelectEmployee: (empId: string) => void;
}

export const CompetencyHeatmapScreen: React.FC<CompetencyHeatmapScreenProps> = ({
  competencies,
  candidateRatings,
  onEditRating,
  onSelectEmployee,
}) => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [sortBy, setSortBy] = useState<'gaps' | 'name'>('gaps');

  const departments = ['All', 'Executive', 'Engineering', 'Operations', 'Product', 'Sales'];
  const categories = ['All', 'Leadership', 'Strategic', 'Technical', 'Communication'];

  // Extract unique positions from candidateRatings
  const positionOptions = useMemo(() => {
    const set = new Set<string>();
    candidateRatings.forEach((c) => set.add(c.targetPositionTitle));
    return ['All', ...Array.from(set)];
  }, [candidateRatings]);

  // Filter columns (competencies)
  const filteredCompetencies = useMemo(() => {
    return selectedCategory === 'All'
      ? competencies
      : competencies.filter((c) => c.category === selectedCategory);
  }, [competencies, selectedCategory]);

  // Helper to compute overall gap for a candidate
  const computeOverallStats = (candidate: CandidateRating) => {
    let totalGap = 0;
    let assessedCount = 0;
    let criticalGaps = 0;

    competencies.forEach((comp) => {
      const r = candidate.ratings[comp.id];
      if (r && r.assessed) {
        const gap = r.current - r.target;
        totalGap += gap;
        assessedCount++;
        if (gap <= -2) criticalGaps++;
      }
    });

    const avgGap = assessedCount > 0 ? (totalGap / assessedCount) : 0;
    return { totalGap, avgGap, assessedCount, criticalGaps };
  };

  // Filter and sort candidates
  const processedCandidates = useMemo(() => {
    const list = candidateRatings.filter((c) => {
      const matchDept = selectedDept === 'All' || c.department === selectedDept;
      const matchPos = selectedPosition === 'All' || c.targetPositionTitle === selectedPosition;
      return matchDept && matchPos;
    });

    return list.sort((a, b) => {
      if (sortBy === 'gaps') {
        const statsA = computeOverallStats(a);
        const statsB = computeOverallStats(b);
        // Most negative gap first
        return statsA.totalGap - statsB.totalGap;
      }
      return a.candidateName.localeCompare(b.candidateName);
    });
  }, [candidateRatings, selectedDept, selectedPosition, sortBy]);

  // Overall Bench Summary Metrics
  const summaryMetrics = useMemo(() => {
    let totalAssessments = 0;
    let totalGapSum = 0;
    let criticalGapsTotal = 0;

    candidateRatings.forEach((c) => {
      const stats = computeOverallStats(c);
      totalAssessments += stats.assessedCount;
      totalGapSum += stats.totalGap;
      criticalGapsTotal += stats.criticalGaps;
    });

    const benchStrengthScore = totalAssessments > 0
      ? Math.max(0, Math.round(100 + (totalGapSum / totalAssessments) * 20))
      : 80;

    return {
      totalCandidates: candidateRatings.length,
      totalAssessments,
      criticalGapsTotal,
      benchStrengthScore,
    };
  }, [candidateRatings]);

  // Pinned Bottom Row: Average Gap per Competency
  const competencyAverages = useMemo(() => {
    const map: Record<string, { sumGap: number; count: number }> = {};
    competencies.forEach((c) => {
      map[c.id] = { sumGap: 0, count: 0 };
    });

    processedCandidates.forEach((cand) => {
      competencies.forEach((comp) => {
        const r = cand.ratings[comp.id];
        if (r && r.assessed) {
          map[comp.id].sumGap += (r.current - r.target);
          map[comp.id].count += 1;
        }
      });
    });

    const result: Record<string, number> = {};
    competencies.forEach((comp) => {
      const info = map[comp.id];
      result[comp.id] = info.count > 0 ? (info.sumGap / info.count) : 0;
    });
    return result;
  }, [processedCandidates, competencies]);

  // Cell coloring helper
  const getCellStyles = (gap: number | null, assessed: boolean) => {
    if (!assessed || gap === null) {
      return {
        bg: 'bg-gray-100 text-gray-500',
        border: 'border-gray-200',
        text: 'N/A',
      };
    }
    if (gap >= 0) {
      return {
        bg: 'bg-emerald-100/80 text-emerald-900 font-bold',
        border: 'border-emerald-300',
        text: gap === 0 ? '0' : `+${gap}`,
      };
    }
    if (gap === -1) {
      return {
        bg: 'bg-amber-100/90 text-amber-900 font-bold',
        border: 'border-amber-300',
        text: '-1',
      };
    }
    if (gap === -2) {
      return {
        bg: 'bg-orange-100 text-orange-950 font-bold',
        border: 'border-orange-300',
        text: '-2',
      };
    }
    // -3 or worse
    return {
      bg: 'bg-red-100 text-red-950 font-bold',
      border: 'border-red-300',
      text: `${gap}`,
    };
  };

  return (
    <div className="space-y-6">
      <SignatureBanner
        title="Executive Competency Gap Heatmap"
        subtitle="Cross-functional capability matrix measuring candidate readiness against target leadership benchmarks."
        badge="Competency Architecture"
      />

      {/* Summary Bar at Top */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Evaluated Leaders
          </span>
          <span className="font-mono text-3xl font-extrabold text-[#0B1F18] tabular-nums">
            {summaryMetrics.totalCandidates}
          </span>
          <span className="text-xs text-slate-500 block">Across 10 key vectors</span>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Overall Bench Strength
          </span>
          <span className="font-mono text-3xl font-extrabold text-[#047857] tabular-nums">
            {summaryMetrics.benchStrengthScore}%
          </span>
          <span className="text-xs text-slate-500 block">Readiness index</span>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Critical Gap Points (&le;-2)
          </span>
          <span className="font-mono text-3xl font-extrabold text-[#DC2626] tabular-nums">
            {summaryMetrics.criticalGapsTotal}
          </span>
          <span className="text-xs text-slate-500 block">Require targeted development</span>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Assessment Coverage
          </span>
          <span className="font-mono text-3xl font-extrabold text-blue-600 tabular-nums">
            100%
          </span>
          <span className="text-xs text-slate-500 block">All nominated candidates evaluated</span>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="p-2 bg-slate-50 border border-gray-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Target Position
            </label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="p-2 bg-slate-50 border border-gray-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              {positionOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 bg-slate-50 border border-gray-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort and Color Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sort:
            </span>
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setSortBy('gaps')}
                className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer ${
                  sortBy === 'gaps' ? 'bg-white text-[#047857] shadow-xs' : 'text-slate-600'
                }`}
              >
                Most Gaps First
              </button>
              <button
                type="button"
                onClick={() => setSortBy('name')}
                className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer ${
                  sortBy === 'name' ? 'bg-white text-[#047857] shadow-xs' : 'text-slate-600'
                }`}
              >
                A - Z Candidate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Heatmap Legend bar */}
        <div className="p-3 bg-slate-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 font-medium">
            Click any cell to edit assessment rating and view live gap calculations.
          </span>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              &ge;0 Surplus/Match
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              -1 Minor Gap
            </span>
            <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-950 border border-orange-300">
              -2 Significant
            </span>
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-950 border border-red-300">
              &le;-3 Critical
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50/90 text-[11px] font-bold text-slate-600">
                {/* Candidate Column */}
                <th className="py-4 px-4 min-w-56 sticky left-0 bg-slate-50 z-20 border-r border-gray-200 shadow-xs">
                  <div className="uppercase tracking-wider">Candidate & Target Role</div>
                </th>

                {/* Overall Gap Column */}
                <th className="py-4 px-3 w-28 text-center bg-slate-100/80 border-r border-gray-200">
                  <div className="uppercase tracking-wider">Overall Gap</div>
                </th>

                {/* Rotated / Compact Competency Headers */}
                {filteredCompetencies.map((comp) => (
                  <th key={comp.id} className="py-4 px-2 w-28 text-center border-r border-gray-200/80 last:border-none">
                    <div className="flex flex-col items-center justify-between h-20">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mb-1">
                        {comp.category}
                      </span>
                      <span className="text-[11px] font-bold text-slate-800 leading-tight px-1 text-center line-clamp-2">
                        {comp.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-xs">
              {processedCandidates.map((cand) => {
                const stats = computeOverallStats(cand);
                const overallGapColor =
                  stats.avgGap >= 0
                    ? 'bg-emerald-100 text-[#16A34A] border-emerald-300'
                    : stats.avgGap > -1.2
                    ? 'bg-amber-100 text-[#D97706] border-amber-300'
                    : stats.avgGap > -2.0
                    ? 'bg-orange-100 text-[#EA580C] border-orange-300'
                    : 'bg-red-100 text-[#DC2626] border-red-300';

                return (
                  <tr key={cand.candidateId} className="hover:bg-slate-50/70 transition-colors">
                    {/* Candidate Info (Sticky left) */}
                    <td className="py-3 px-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-gray-200">
                      <div
                        onClick={() => onSelectEmployee(cand.candidateId)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <Avatar name={cand.candidateName} src={cand.candidateAvatar} size="sm" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#0B1F18] group-hover:text-[#047857] transition-colors truncate">
                            {cand.candidateName}
                          </h4>
                          <span className="text-[10px] text-slate-500 truncate block">
                            Target: <strong className="text-slate-700">{cand.targetPositionTitle}</strong>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Overall Gap Column */}
                    <td className="py-3 px-2 text-center bg-slate-50/50 border-r border-gray-200">
                      <div className="flex flex-col items-center justify-center font-mono">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${overallGapColor} tabular-nums`}>
                          {stats.totalGap > 0 ? `+${stats.totalGap}` : stats.totalGap}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">
                          Avg: {stats.avgGap.toFixed(1)}
                        </span>
                      </div>
                    </td>

                    {/* Heatmap Matrix Cells */}
                    {filteredCompetencies.map((comp) => {
                      const r = cand.ratings[comp.id] || { current: 3, target: 4, assessed: false };
                      const gap = r.assessed ? r.current - r.target : null;
                      const cellStyle = getCellStyles(gap, r.assessed);

                      return (
                        <td
                          key={comp.id}
                          onClick={() => onEditRating(cand, comp)}
                          className="py-2 px-1.5 text-center border-r border-gray-100 last:border-none cursor-pointer group"
                        >
                          <div
                            className={`p-2 rounded-lg border ${cellStyle.border} ${cellStyle.bg} transition-all transform group-hover:scale-105 group-hover:shadow-xs`}
                          >
                            <div className="font-mono text-xs font-extrabold leading-none tabular-nums">
                              {cellStyle.text}
                            </div>
                            <div className="text-[9px] opacity-75 font-mono mt-1">
                              {r.assessed ? `${r.current}/${r.target}` : 'N/A'}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Pinned Bottom Row: Average Gap */}
              <tr className="bg-slate-100 font-bold border-t-2 border-gray-300">
                <td className="py-3 px-4 sticky left-0 bg-slate-100 z-10 border-r border-gray-300">
                  <div className="text-xs font-extrabold text-[#0B1F18] uppercase tracking-wider">
                    Avg Benchmark Gap
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">
                    Across {processedCandidates.length} evaluated leaders
                  </span>
                </td>

                <td className="py-3 px-2 text-center border-r border-gray-300 font-mono text-xs text-slate-700">
                  &mdash;
                </td>

                {filteredCompetencies.map((comp) => {
                  const avg = competencyAverages[comp.id] || 0;
                  const avgColor =
                    avg >= 0
                      ? 'text-[#16A34A]'
                      : avg > -1.0
                      ? 'text-[#D97706]'
                      : avg > -1.8
                      ? 'text-[#EA580C]'
                      : 'text-[#DC2626]';

                  return (
                    <td key={comp.id} className="py-3 px-2 text-center border-r border-gray-200 last:border-none font-mono">
                      <span className={`text-xs font-extrabold ${avgColor} tabular-nums block`}>
                        {avg > 0 ? `+${avg.toFixed(1)}` : avg.toFixed(1)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
