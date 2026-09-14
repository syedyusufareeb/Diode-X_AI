import React from 'react';
import { CheckCircle2, Radio, Sparkles } from 'lucide-react';

interface TimelineStage {
  stage: string;
  timestamp: string;
  detail: string;
  completed: boolean;
}

interface TimelineProps {
  stages: TimelineStage[];
}

export const Timeline: React.FC<TimelineProps> = ({ stages }) => {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-400 before:via-violet-400 before:to-emerald-400">
      {stages.map((st, idx) => (
        <div key={idx} className="relative group">
          {/* Node dot */}
          <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shadow-xs">
            {idx === stages.length - 1 ? (
              <Sparkles className="w-3 h-3 text-violet-600 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            )}
          </div>

          {/* Content */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 transition-all group-hover:bg-white group-hover:shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800 tracking-tight flex items-center gap-1.5">
                {st.stage}
                {idx === 0 && <span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded font-mono">Diode Ingest</span>}
                {idx === 2 && <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.2 rounded font-mono">LightGBM/Rules</span>}
              </span>
              <span className="text-[11px] font-mono text-slate-400">{st.timestamp}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-normal leading-relaxed">{st.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
