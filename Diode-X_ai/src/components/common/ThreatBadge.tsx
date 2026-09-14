import React from 'react';
import clsx from 'clsx';
import { ThreatFamily } from '../../types';
import { Activity, Radio, Globe, Lock, Search, UploadCloud } from 'lucide-react';

interface ThreatBadgeProps {
  threat: ThreatFamily | 'Benign';
  size?: 'sm' | 'md';
}

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({ threat, size = 'sm' }) => {
  const config = {
    DDoS: {
      label: 'DDoS',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <Activity className="w-3.5 h-3.5 text-rose-600" />
    },
    'C2 Beaconing': {
      label: 'C2 Beaconing',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Radio className="w-3.5 h-3.5 text-amber-600" />
    },
    'DNS Tunneling / DGA': {
      label: 'DNS Tunneling',
      color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      icon: <Globe className="w-3.5 h-3.5 text-cyan-600" />
    },
    'Encrypted Malware': {
      label: 'Encrypted Malware',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: <Lock className="w-3.5 h-3.5 text-purple-600" />
    },
    Reconnaissance: {
      label: 'Reconnaissance',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <Search className="w-3.5 h-3.5 text-blue-600" />
    },
    Exfiltration: {
      label: 'Exfiltration',
      color: 'bg-violet-50 text-violet-800 border-violet-200',
      icon: <UploadCloud className="w-3.5 h-3.5 text-violet-600" />
    },
    Benign: {
      label: 'Normal Flow',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <span className="w-2 h-2 rounded-full bg-emerald-500" />
    }
  }[threat];

  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-0.5 gap-1.5' : 'text-sm px-3 py-1 gap-2';

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-lg font-medium border',
        config.color,
        sizeClass
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
