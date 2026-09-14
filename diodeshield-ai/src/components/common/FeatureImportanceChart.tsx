import React from 'react';
import { AlertEvidence } from '../../types';

interface FeatureImportanceProps {
  evidence: AlertEvidence[];
}

export const FeatureImportanceChart: React.FC<FeatureImportanceProps> = ({ evidence }) => {
  return (
    <div className="space-y-3.5">
      {evidence.map((ev, idx) => (
        <div key={idx} className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-800 tracking-tight">{ev.featureName}</span>
            <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              +{ev.importance}% Influence
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, ev.importance * 1.8))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] mt-2 text-slate-500">
            <span>
              Observed: <strong className="text-slate-800 font-mono">{ev.observedValue}</strong>
            </span>
            <span>
              Baseline: <span className="text-slate-500 font-mono">{ev.baselineValue}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 italic leading-tight">{ev.description}</p>
        </div>
      ))}
    </div>
  );
};
