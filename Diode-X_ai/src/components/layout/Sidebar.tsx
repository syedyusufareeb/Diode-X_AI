import React from 'react';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Radio,
  BrainCircuit,
  Network,
  AlertTriangle,
  BarChart3,
  HeartPulse,
  Settings,
  Shield,
  CheckCircle2,
  X
} from 'lucide-react';

export type AppView = 
  | 'overview'
  | 'live-monitor'
  | 'threat-intel'
  | 'flow-explorer'
  | 'alert-details'
  | 'analytics'
  | 'system-health'
  | 'settings';

interface SidebarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  threatCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isMobileOpen,
  onCloseMobile,
  threatCount = 1247
}) => {
  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Overview Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'live-monitor',
      label: 'Live Threat Monitor',
      icon: <Radio className="w-4 h-4" />,
      badge: 'LIVE'
    },
    {
      id: 'threat-intel',
      label: 'Threat Intelligence',
      icon: <BrainCircuit className="w-4 h-4" />
    },
    {
      id: 'flow-explorer',
      label: 'Flow Explorer',
      icon: <Network className="w-4 h-4" />
    },
    {
      id: 'alert-details',
      label: 'Alert Investigation',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: 'FLW-92A'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'system-health',
      label: 'System Health',
      icon: <HeartPulse className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4">
      {/* Top Nav List */}
      <div>
        <div className="px-3 pb-3 mb-2 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            SOC Console
          </span>
          <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-medium">
            v2.4
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={clsx(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={clsx(
                    'transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                  )}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={clsx(
                      'text-[10px] font-bold px-1.5 py-0.2 rounded-md font-mono',
                      isActive
                        ? 'bg-blue-700 text-blue-100'
                        : item.badge === 'LIVE'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info Card: Passive Diode Constraint */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/60 border border-blue-100/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-800 text-xs font-bold">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Unidirectional Security</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Operating behind an optical data diode. Telemetry is purely received; no packets or signals can ever exit back to the source.
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold text-blue-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>SIH 26145 Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 glass-sidebar shrink-0 min-h-[calc(100vh-61px)] sticky top-[61px]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 glass-sidebar shadow-2xl z-10 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Diode-X</span>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};