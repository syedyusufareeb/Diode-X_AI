import React from 'react';
import clsx from 'clsx';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  accentColor?: 'blue' | 'cyan' | 'violet' | 'rose' | 'amber' | 'emerald';
  subtitle?: string;
  apiProvided?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  delta,
  deltaType = 'neutral',
  icon,
  accentColor = 'blue',
  subtitle,
  apiProvided = true
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200/70',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200/70',
    violet: 'bg-violet-50 text-violet-600 border-violet-200/70',
    rose: 'bg-rose-50 text-rose-600 border-rose-200/70',
    amber: 'bg-amber-50 text-amber-600 border-amber-200/70',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
  }[accentColor];

  const deltaColor = {
    positive: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    negative: 'text-rose-700 bg-rose-50 border-rose-200',
    neutral: 'text-slate-600 bg-slate-100 border-slate-200'
  }[deltaType];

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200/80 relative flex flex-col justify-between group">
      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className={clsx('w-9 h-9 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105', colorMap)}>
          {icon}
        </div>
      </div>

      {/* Main Value */}
      <div className="my-3">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
          {value}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>

      {/* Footer info & Delta */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        {delta ? (
          <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-md font-medium text-[11px] border', deltaColor)}>
            {delta}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">Continuous telemetry</span>
        )}
        {apiProvided && (
          <span className="text-[10px] text-slate-400 font-mono tracking-tight bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
            API Ingest
          </span>
        )}
      </div>
    </div>
  );
};
