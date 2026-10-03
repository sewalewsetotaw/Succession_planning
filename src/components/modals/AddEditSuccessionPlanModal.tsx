import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { SuccessionPlan, Employee, Position, ReadinessLevel } from '../../types';
import { ReadinessChip } from '../common/ReadinessChip';
import { RiskBadge } from '../common/RiskBadge';

interface AddEditSuccessionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Partial<SuccessionPlan>) => void;
  planToEdit?: SuccessionPlan | null;
  initialReadiness?: ReadinessLevel;
  employees: Employee[];
  positions: Position[];
}

export const AddEditSuccessionPlanModal: React.FC<AddEditSuccessionPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  planToEdit,
  initialReadiness,
  employees,
  positions,
}) => {
  const [positionId, setPositionId] = useState(positions[0]?.id || '');
  const [candidateId, setCandidateId] = useState(employees[1]?.id || employees[0]?.id || '');
  const [readiness, setReadiness] = useState<ReadinessLevel>('1-2 Years');
  const [ranking, setRanking] = useState<number>(1);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (planToEdit) {
        setPositionId(planToEdit.positionId || positions[0]?.id || '');
        setCandidateId(planToEdit.candidateId || employees[0]?.id || '');
        setReadiness(planToEdit.readiness || '1-2 Years');
        setRanking(planToEdit.ranking || 1);
        setNotes(planToEdit.notes || '');
      } else {
        setPositionId(positions[0]?.id || '');
        setCandidateId(employees[1]?.id || employees[0]?.id || '');
        setReadiness(initialReadiness || '1-2 Years');
        setRanking(1);
        setNotes('');
      }
    }
  }, [isOpen, planToEdit, initialReadiness, positions, employees]);

  const selectedCandidate = employees.find((e) => e.id === candidateId) || employees[0];
  const selectedPosition = positions.find((p) => p.id === positionId) || positions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !selectedPosition) return;

    onSave({
      id: planToEdit?.id,
      positionId: selectedPosition.id,
      positionTitle: selectedPosition.title,
      department: selectedPosition.department,
      candidateId: selectedCandidate.id,
      candidateName: selectedCandidate.name,
      candidateTitle: selectedCandidate.title,
      candidateAvatar: selectedCandidate.avatar,
      readiness,
      ranking: Number(ranking),
      performanceScore: selectedCandidate.performanceScore,
      potentialScore: selectedCandidate.potentialScore,
      flightRisk: selectedCandidate.flightRisk,
      notes,
      lastReviewed: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={planToEdit ? 'Edit Succession Nomination' : 'Create Succession Nomination'}
      subtitle="Nominate a candidate and establish readiness horizon for a key position."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target Position Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Target Position
          </label>
          <select
            value={positionId}
            onChange={(e) => setPositionId(e.target.value)}
            className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
          >
            {positions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.department}) - {p.criticality} Criticality
              </option>
            ))}
          </select>
        </div>

        {/* Candidate Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Successor Candidate
          </label>
          <select
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {e.title} ({e.department})
              </option>
            ))}
          </select>
        </div>

        {/* Candidate Stats Snapshot */}
        {selectedCandidate && (
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Current Flight Risk: </span>
              <RiskBadge level={selectedCandidate.flightRisk} size="sm" />
            </div>
            <div className="flex items-center gap-3 font-mono text-slate-700">
              <span>Perf: <strong>{selectedCandidate.performanceScore.toFixed(1)}</strong></span>
              <span>Pot: <strong>{selectedCandidate.potentialScore.toFixed(1)}</strong></span>
            </div>
          </div>
        )}

        {/* Readiness Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Readiness Horizon
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Ready Now', '1-2 Years', '3-5 Years'] as ReadinessLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setReadiness(level)}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  readiness === level
                    ? 'border-[#047857] bg-emerald-50 text-[#047857] ring-1 ring-[#047857]'
                    : 'border-gray-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ReadinessChip readiness={level} size="sm" />
              </button>
            ))}
          </div>
        </div>

        {/* Priority Ranking */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Successor Priority Tier
          </label>
          <select
            value={ranking}
            onChange={(e) => setRanking(Number(e.target.value))}
            className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857]"
          >
            <option value={1}>Tier 1 (Primary Designated Successor)</option>
            <option value={2}>Tier 2 (Secondary Successor / Emergency Backup)</option>
            <option value={3}>Tier 3 (Pipeline Development Track)</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Executive Calibration Notes & Transition Context
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document rationale, gaps to close, and executive sponsor comments..."
            className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#047857]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#047857] hover:bg-[#064E3B] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {planToEdit ? 'Save Changes' : 'Confirm Nomination'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
