import React, { useState } from 'react';
import clsx from 'clsx';
import { 
  ShieldCheck, 
  Bell, 
  Radio, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Server, 
  Menu,
  X
} from 'lucide-react';
import { ConnectionStatus } from '../../services/api';

interface NavbarProps {
  connection: ConnectionStatus;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenMobileMenu: () => void;
  activeAlertCount: number;
  onNavigateToAlerts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  connection,
  isDemoMode,
  onToggleDemoMode,
  onOpenMobileMenu,
  activeAlertCount,
  onNavigateToAlerts
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-nav border-b border-slate-200/80 px-4 lg:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-600 to-violet-600 text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 bg-clip-text text-transparent">
                  DIODE-<span className="text-blue-600 font-black">X</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  SIH 26145
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  NTRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-normal">
                Passive AI-Based Threat Intelligence for Unidirectional IP Traffic
              </p>
            </div>
          </div>
        </div>

        {/* Center: Real-time Status Badges */}
        <div className="hidden xl:flex items-center gap-2.5">
          {/* Active Monitoring */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Monitoring Active</span>
          </div>

          {/* Unidirectional Diode Badge */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200/80 shadow-2xs"
            title="Physical optical hardware diode prevents any packet transmission back to monitored network"
          >
            <ArrowRight className="w-3.5 h-3.5 text-violet-600" />
            <span>Unidirectional Diode (No Return Path)</span>
          </div>

          {/* Read-Only Ingest */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs">
            <Radio className="w-3.5 h-3.5 text-sky-600" />
            <span>Read-Only Ingest</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Demo Mode Toggle */}
          <button
            onClick={onToggleDemoMode}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
              isDemoMode 
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            )}
            title="Toggle between Simulated Live Telemetry and Production REST Gateway"
          >
            <Sparkles className={clsx('w-3.5 h-3.5', isDemoMode ? 'text-amber-600 animate-spin' : 'text-slate-400')} />
            <span className="hidden sm:inline">{isDemoMode ? 'Demo Mode Active' : 'Real API Ingest'}</span>
            <span className={clsx('w-2 h-2 rounded-full', isDemoMode ? 'bg-amber-500' : 'bg-blue-600')} />
          </button>

          {/* Connection Status Pill */}
          <div
            className={clsx(
              'hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border',
              connection.isOnline
                ? 'bg-slate-50 text-slate-700 border-slate-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            )}
            title={connection.message}
          >
            <Server className="w-3 h-3 text-slate-400" />
            <span>{connection.latencyMs}ms</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {activeAlertCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {activeAlertCount > 9 ? '9+' : activeAlertCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-slate-800">SOC Real-Time Dispatch</h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {activeAlertCount} pending
                  </span>
                </div>

                <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                  <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs">
                    <div className="flex items-center justify-between text-rose-800 font-semibold">
                      <span>Critical: DDoS SYN Burst</span>
                      <span className="font-mono text-[10px]">Just now</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">
                      192.168.10.42 → 10.20.4.18 (98.2% conf). No return path response initiated.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs">
                    <div className="flex items-center justify-between text-amber-800 font-semibold">
                      <span>High: C2 Beaconing Detected</span>
                      <span className="font-mono text-[10px]">18s ago</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">
                      10.14.22.105: Jitter 9.8ms to external relay. Passive metadata enriched.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-cyan-50/70 border border-cyan-100 text-xs">
                    <div className="flex items-center justify-between text-cyan-800 font-semibold">
                      <span>High: DNS Entropy Outlier</span>
                      <span className="font-mono text-[10px]">42s ago</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">
                      10.14.22.88: Base32 chunk query (4.88 bits entropy).
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateToAlerts();
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Open Live Threat Feed <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              NT
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">SOC Analyst</div>
              <div className="text-[10px] text-slate-400 font-mono">Read-Only Session</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};