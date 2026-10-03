import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { StarRating } from '../common/StarRating';
import { Competency, CandidateRating } from '../../types';

interface EditCompetencyRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidateId: string, competencyId: string, current: number, target: number) => void;
  candidateRating: CandidateRating | null;
  competency: Competency | null;
}

export const EditCompetencyRatingModal: React.FC<EditCompetencyRatingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  candidateRating,
  competency,
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(3);
  const [targetLevel, setTargetLevel] = useState<number>(4);

  useEffect(() => {
    if (candidateRating && competency) {
      const existing = candidateRating.ratings[competency.id];
      if (existing) {
        setCurrentLevel(existing.current);
        setTargetLevel(existing.target);
      } else {
        setCurrentLevel(3);
        setTargetLevel(4);
      }
    }
  }, [candidateRating, competency, isOpen]);

  if (!candidateRating || !competency) return null;

  const gap = currentLevel - targetLevel;

  // Semantic color for gap:
  // Green (>=0), Amber (-1), Orange (-2), Red (-3 or worse)
  const getGapBadge = (g: number) => {
    if (g >= 0) {
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-[#16A34A]',
        text: g === 0 ? 'Exact Match (0)' : `Surplus (+${g})`,
        descriptor: 'Meets or exceeds executive role benchmark',
      };
    }
    if (g === -1) {
      return {
        bg: 'bg-amber-50 border-amber-200 text-[#D97706]',
        text: 'Minor Gap (-1)',
        descriptor: 'Can be closed with targeted executive mentoring / 6-12 mos',
      };
    }
    if (g === -2) {
      return {
        bg: 'bg-orange-50 border-orange-200 text-[#EA580C]',
        text: 'Significant Gap (-2)',
        descriptor: 'Requires active development plan and rotation exposure / 1-2 yrs',
      };
    }
    return {
      bg: 'bg-red-50 border-red-200 text-[#DC2626]',
      text: `Critical Gap (${g})`,
      descriptor: 'High risk factor; requires comprehensive development or external recruitment',
    };
  };

  const gapInfo = getGapBadge(gap);

  const handleSave = () => {
    onSave(candidateRating.candidateId, competency.id, currentLevel, targetLevel);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Competency Rating"
      subtitle={`Evaluate readiness for target position: ${candidateRating.targetPositionTitle}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Candidate & Competency Context */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Candidate</span>
            <span className="text-xs font-bold text-[#0B1F18]">{candidateRating.candidateName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Target Role</span>
            <span className="text-xs font-semibold text-[#047857]">{candidateRating.targetPositionTitle}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
            <span className="text-xs text-slate-500 font-medium">Competency</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0B1F18]">{competency.name}</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-[#064E3B] px-2 py-0.5 rounded">
                {competency.category}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic pt-1">
            "{competency.description}"
          </p>
        </div>

        {/* Current Level Input (1-5 Stars) */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Current Assessed Level
            </label>
            <span className="text-xs text-slate-500">
              Demonstrated capability in current responsibilities
            </span>
          </div>
          <div className="flex items-center gap-3">
            <StarRating
              value={currentLevel}
              onChange={setCurrentLevel}
              size="md"
            />
            <span className="font-mono text-sm font-bold text-[#0B1F18] w-7 text-right tabular-nums">
              {currentLevel}/5
            </span>
          </div>
        </div>

        {/* Target Level Input (1-5 Stars) */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Target Position Benchmark
            </label>
            <span className="text-xs text-slate-500">
              Expected capability required for successful succession
            </span>
          </div>
          <div className="flex items-center gap-3">
            <StarRating
              value={targetLevel}
              onChange={setTargetLevel}
              size="md"
            />
            <span className="font-mono text-sm font-bold text-[#047857] w-7 text-right tabular-nums">
              {targetLevel}/5
            </span>
          </div>
        </div>

        {/* Live Gap Preview */}
        <div className={`p-4 rounded-xl border ${gapInfo.bg} transition-all`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">
              Calculated Competency Gap
            </span>
            <span className="font-mono text-base font-bold tabular-nums">
              {gapInfo.text}
            </span>
          </div>
          <p className="text-xs opacity-90 leading-snug">
            {gapInfo.descriptor}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs font-mono">
            <span>Score formula: Current ({currentLevel}) - Target ({targetLevel}) =</span>
            <span className="font-bold underline">{gap > 0 ? `+${gap}` : gap}</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#047857] hover:bg-[#064E3B] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Save Competency Rating
          </button>
        </div>
      </div>
    </Modal>
  );
};
