import React from 'react';
import clsx from 'clsx';
import { ArrowRight, Eye, ShieldCheck, Zap } from 'lucide-react';

interface StatusBadgeProps {
  type: 'read-only' | 'no-return-path' | 'active-monitoring' | 'demo-mode' | 'diode-isolated';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, className }) => {
  const config = {
    'read-only': {
      label: 'READ-ONLY STREAM',
      desc: 'Passive observation only',
      icon: <Eye className="w-3 h-3 text-sky-600" />,
      style: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    'no-return-path': {
      label: 'NO RETURN PATH',
      desc: 'Hardware severed RX',
      icon: <ArrowRight className="w-3 h-3 text-violet-600" />,
      style: 'bg-violet-50 text-violet-700 border-violet-200'
    },
    'active-monitoring': {
      label: 'MONITORING ACTIVE',
      desc: 'Live telemetry ingestion',
      icon: <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />,
      style: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    'demo-mode': {
      label: 'DEMO DATA',
      desc: 'Simulated passive telemetry',
      icon: <Zap className="w-3 h-3 text-amber-600" />,
      style: 'bg-amber-50 text-amber-800 border-amber-300'
    },
    'diode-isolated': {
      label: 'DATA DIODE ACTIVE',
      desc: 'Optical Tx isolation',
      icon: <ShieldCheck className="w-3 h-3 text-blue-600" />,
      style: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  }[type];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider border shadow-2xs select-none',
        config.style,
        className
      )}
      title={config.desc}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
