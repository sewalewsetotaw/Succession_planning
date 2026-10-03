import React from 'react';
import { Modal } from '../common/Modal';
import { ShieldCheck, Scale } from 'lucide-react';
import { ActiveScreen } from '../../types';

interface CriticalPositionMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (screen: ActiveScreen) => void;
}

export const CriticalPositionMethodModal: React.FC<CriticalPositionMethodModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Critical Position Methodology & 7-Factor Model"
      subtitle="Standardized fiduciary framework for assessing leadership criticality and bench risk."
      maxWidth="2xl"
    >
      <div className="space-y-5">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#064E3B] uppercase tracking-wider">
            <Scale className="w-4 h-4 text-[#047857]" />
            <span>Fiduciary Criticality Definition</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Critical positions are defined through an objective, multi-factor weighting formula rather than executive title alone. Any role scoring &ge;80 mandates a minimum of two evaluated successors with at least one immediate "Ready Now" replacement.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            The 7 Weighted Factors
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg">
              <span className="font-bold text-slate-900 block">1. Strategic Impact (25%)</span>
              <span className="text-[11px] text-slate-500">Degree of leverage over 3-year enterprise objectives and market positioning.</span>
            </div>
            <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg">
              <span className="font-bold text-slate-900 block">2. Operational Continuity (20%)</span>
              <span className="text-[11px] text-slate-500">Immediate disruption severity if day-to-day operations and processes freeze.</span>
            </div>
            <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg">
              <span className="font-bold text-slate-900 block">3. Customer & Revenue Exposure (15%)</span>
              <span className="text-[11px] text-slate-500">Direct financial loss, customer churn, or key contract vulnerability.</span>
            </div>
            <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg">
              <span className="font-bold text-slate-900 block">4. Talent Scarcity (15%)</span>
              <span className="text-[11px] text-slate-500">Market availability and time required to recruit specialized executive capability.</span>
            </div>
            <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg">
              <span className="font-bold text-slate-900 block">5. Regulatory & Reputational (10%)</span>
              <span className="text-[11px] text-slate-500">Legal exposure, fiduciary compliance, public disclosures, and brand damage.</span>
            </div>
            <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg">
              <span className="font-bold text-slate-900 block">6. Time-to-Competence (10%)</span>
              <span className="text-[11px] text-slate-500">Ramp time in months required for an incumbent replacement to achieve full velocity.</span>
            </div>
            <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg sm:col-span-2">
              <span className="font-bold text-slate-900 block">7. Vacancy Exposure Duration (5%)</span>
              <span className="text-[11px] text-slate-500">Maximum allowable interim vacancy before systemic operational harm occurs.</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Score Bands & Governance Cadence
          </h4>
          <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Band</th>
                  <th className="p-2.5">Score</th>
                  <th className="p-2.5">Required Coverage</th>
                  <th className="p-2.5">Audit Cadence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-red-50/30">
                  <td className="p-2.5 font-bold text-red-700">Critical</td>
                  <td className="p-2.5 font-mono">80-100</td>
                  <td className="p-2.5">&ge;2 successors (1 Ready Now)</td>
                  <td className="p-2.5">Quarterly Board Audit</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-orange-700">High</td>
                  <td className="p-2.5 font-mono">60-79</td>
                  <td className="p-2.5">&ge;1 successor within 1-2 Yrs</td>
                  <td className="p-2.5">Bi-Annual Calibration</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-700">Medium</td>
                  <td className="p-2.5 font-mono">40-59</td>
                  <td className="p-2.5">Identified pipeline bench</td>
                  <td className="p-2.5">Annual Review</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-600">Monitor</td>
                  <td className="p-2.5 font-mono">0-39</td>
                  <td className="p-2.5">Normal requisition cycle</td>
                  <td className="p-2.5">As Needed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#047857] text-white text-xs font-bold rounded-lg hover:bg-[#064E3B] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
