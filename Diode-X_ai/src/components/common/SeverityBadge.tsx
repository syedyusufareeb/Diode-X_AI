import React from 'react';
import clsx from 'clsx';
import { SeverityLevel } from '../../types';
import { AlertCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'sm',
  showIcon = true
}) => {
  const config = {
    Critical: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/90 shadow-sm shadow-rose-100',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
    },
    High: {
      bg: 'bg-amber-50 text-amber-800 border-amber-300/80 shadow-sm shadow-amber-50',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
    },
    Medium: {
      bg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-yellow-600" />
    },
    Low: {
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: <Info className="w-3.5 h-3.5 text-sky-600" />
    },
    Info: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: <Info className="w-3.5 h-3.5 text-slate-500" />
    }
  }[severity];

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  }[size];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium border tracking-wide uppercase',
        config.bg,
        sizeClasses
      )}
    >
      {showIcon && config.icon}
      <span>{severity}</span>
    </span>
  );
};
