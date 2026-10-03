import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { DevelopmentPlan, Employee, Position, DevPlanCategory, DevPlanStatus } from '../../types';

interface AddEditDevelopmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Partial<DevelopmentPlan>) => void;
  planToEdit?: DevelopmentPlan | null;
  initialStatus?: DevPlanStatus;
  employees: Employee[];
  positions: Position[];
}

export const AddEditDevelopmentPlanModal: React.FC<AddEditDevelopmentPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  planToEdit,
  initialStatus,
  employees,
  positions,
}) => {
  const [goal, setGoal] = useState('');
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  const [category, setCategory] = useState<DevPlanCategory>('Leadership');
  const [status, setStatus] = useState<DevPlanStatus>('In Progress');
  const [dueDate, setDueDate] = useState('2026-12-31');
  const [progressPercent, setProgressPercent] = useState<number>(25);
  const [targetPositionId, setTargetPositionId] = useState(positions[0]?.id || '');
  const [mentorName, setMentorName] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (planToEdit) {
        setGoal(planToEdit.goal || '');
        setEmployeeId(planToEdit.employeeId || employees[0]?.id || '');
        setCategory(planToEdit.category || 'Leadership');
        setStatus(planToEdit.status || 'In Progress');
        setDueDate(planToEdit.dueDate || '2026-12-31');
        setProgressPercent(planToEdit.progressPercent || 25);
        setTargetPositionId(planToEdit.targetPositionId || positions[0]?.id || '');
        setMentorName(planToEdit.mentorName || '');
        setNotes(planToEdit.notes || '');
      } else {
        setGoal('');
        setEmployeeId(employees[0]?.id || '');
        setCategory('Leadership');
        setStatus(initialStatus || 'In Progress');
        setDueDate('2026-12-31');
        setProgressPercent(initialStatus === 'Completed' ? 100 : initialStatus === 'Not Started' ? 0 : 25);
        setTargetPositionId(positions[0]?.id || '');
        setMentorName('');
        setNotes('');
      }
    }
  }, [isOpen, planToEdit, initialStatus, employees, positions]);

  const selectedEmployee = employees.find((e) => e.id === employeeId) || employees[0];
  const selectedPosition = positions.find((p) => p.id === targetPositionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !selectedEmployee) return;

    const isOverdue = new Date(dueDate) < new Date('2026-10-03') && status !== 'Completed';

    onSave({
      id: planToEdit?.id,
      goal,
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      employeeTitle: selectedEmployee.title,
      employeeAvatar: selectedEmployee.avatar,
      category,
      status,
      dueDate,
      isOverdue,
      progressPercent,
      targetPositionId: selectedPosition?.id,
      targetPositionTitle: selectedPosition?.title,
      mentorName,
      notes,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={planToEdit ? 'Edit Development Plan' : 'New Leadership Development Plan'}
      subtitle="Establish targeted competencies, milestones, and mentors to prepare successors."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Development Goal & Objective *
          </label>
          <input
            type="text"
            required
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Board Executive Presence & Investor Relations Simulation"
            className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#047857]"
          />
        </div>

        {/* Employee */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Leader / Employee *
          </label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857]"
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {e.title} ({e.department})
              </option>
            ))}
          </select>
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Competency Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DevPlanCategory)}
              className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              <option value="Leadership">Leadership</option>
              <option value="Strategic">Strategic</option>
              <option value="Technical">Technical</option>
              <option value="Communication">Communication</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Execution Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DevPlanStatus)}
              className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Target Position & Mentor */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Succession Target Role
            </label>
            <select
              value={targetPositionId}
              onChange={(e) => setTargetPositionId(e.target.value)}
              className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857]"
            >
              <option value="">None / General Leadership</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Executive Mentor / Sponsor
            </label>
            <input
              type="text"
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
              placeholder="e.g. Sarah Lin, CTO"
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#047857]"
            />
          </div>
        </div>

        {/* Due Date & Progress Slider */}
        <div className="grid grid-cols-2 gap-3 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Completion Date
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Progress
              </label>
              <span className="font-mono text-xs font-bold text-[#047857]">{progressPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progressPercent}
              onChange={(e) => setProgressPercent(Number(e.target.value))}
              className="w-full accent-[#047857] cursor-pointer"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Action Items & Milestone Criteria
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Specific deliverables, executive shadowing schedule, or coursework..."
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
            {planToEdit ? 'Update Plan' : 'Create Plan'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
