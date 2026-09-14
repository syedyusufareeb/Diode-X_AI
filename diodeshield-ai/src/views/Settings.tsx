import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Server, 
  Radio, 
  Zap, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Sparkles,
  Info,
  Terminal,
  Database
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { config, checkBackendHealth, setApiMode, ConnectionStatus } from '../services/api';
import { streamService } from '../services/streamService';

interface SettingsProps {
  currentConnection: ConnectionStatus;
  onRefreshConnection: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  currentConnection,
  onRefreshConnection,
  isDemoMode,
  onToggleDemoMode
}) => {
  const [apiUrl, setApiUrl] = useState<string>(config.baseUrl);
  const [wsUrl, setWsUrl] = useState<string>(config.wsUrl);
  const [intervalMs, setIntervalMs] = useState<number>(2200);
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<ConnectionStatus | null>(null);
  const [burstSuccess, setBurstSuccess] = useState<string | null>(null);

  const handleSaveApi = () => {
    config.baseUrl = apiUrl;
    config.wsUrl = wsUrl;
    onRefreshConnection();
  };

  const handleTestHealth = async () => {
    setTesting(true);
    const result = await checkBackendHealth();
    setTestResult(result);
    setTesting(false);
    onRefreshConnection();
  };

  const handleIntervalChange = (ms: number) => {
    setIntervalMs(ms);
    streamService.setIntervalMs(ms);
  };

  const handleTriggerBurst = (threatType: 'DDoS' | 'DNS Tunneling / DGA' | 'C2 Beaconing') => {
    streamService.triggerBurst(threatType);
    setBurstSuccess(`Simulated ${threatType} alert dispatched to live feed!`);
    setTimeout(() => setBurstSuccess(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              System Settings & Demo Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              API Service Configuration
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configure decoupled backend endpoints, telemetry generation frequency, and hackathon presentation modes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge type="read-only" />
          <StatusBadge type="no-return-path" />
        </div>
      </div>

      {burstSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{burstSuccess}</span>
          </div>
          <button onClick={() => setBurstSuccess(null)} className="text-emerald-600 hover:text-emerald-800">Dismiss</button>
        </div>
      )}

      {/* Backend API Service Layer Configuration */}
      <GlassCard
        title="Backend API Configuration Layer"
        subtitle="Decoupled REST & Streaming Interface (Configurable via VITE_API_BASE_URL)"
        icon={<Server className="w-5 h-5 text-blue-600" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* API Base URL */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                API Base URL (VITE_API_BASE_URL)
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                placeholder="http://localhost:8080/api/v1"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>

            {/* WebSocket Stream URL */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Streaming Stream URL (VITE_WS_URL)
              </label>
              <input
                type="text"
                value={wsUrl}
                onChange={e => setWsUrl(e.target.value)}
                placeholder="ws://localhost:8080/ws/alerts"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          {/* Mode Switch: Mock vs Real API */}
          <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">Operation Ingestion Mode:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isDemoMode ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isDemoMode ? 'SIMULATED MOCK API' : 'PRODUCTION BACKEND API'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                When Demo Mode is enabled, the UI generates realistic passive telemetry without requiring an active backend server.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleDemoMode}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 shadow-2xs transition-all"
              >
                Switch to {isDemoMode ? 'Real API' : 'Demo Simulation'}
              </button>
              <button
                onClick={handleTestHealth}
                disabled={testing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>
          </div>

          {/* Health Probe Feedback */}
          {testResult && (
            <div className={`p-3 rounded-xl text-xs border font-mono ${
              testResult.isOnline 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              <strong>Probe Result:</strong> {testResult.message} ({testResult.latencyMs}ms latency)
            </div>
          )}
        </div>
      </GlassCard>

      {/* Presentation & Demo Simulation Engine */}
      <GlassCard
        title="Live Demo Simulation Engine (Hackathon Presentation)"
        subtitle="Trigger controlled threat bursts to demonstrate explainable detection live"
        icon={<Sparkles className="w-5 h-5 text-amber-600" />}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Live Telemetry Stream Interval: <strong className="text-slate-800 font-mono">{(intervalMs / 1000).toFixed(1)}s</strong>
            </label>
            <div className="flex items-center gap-3">
              {[1000, 2200, 4000].map(ms => (
                <button
                  key={ms}
                  onClick={() => handleIntervalChange(ms)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    intervalMs === ms
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {ms === 1000 ? 'Fast (1.0s)' : ms === 2200 ? 'Normal (2.2s)' : 'Slow (4.0s)'}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Burst Buttons */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Inject Live Threat Event (Instant SOC Dispatch)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleTriggerBurst('DDoS')}
                className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-left hover:bg-rose-100/80 transition-all group"
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Trigger DDoS SYN Flood</span>
                  <Zap className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-[11px] text-rose-700/80 mt-1">
                  High-volume SYN flood with 0 ACK completion (Critical)
                </p>
              </button>

              <button
                onClick={() => handleTriggerBurst('C2 Beaconing')}
                className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-left hover:bg-amber-100/80 transition-all group"
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Trigger C2 Beacon</span>
                  <Zap className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-[11px] text-amber-700/80 mt-1">
                  Periodic heartbeat timing with 9.8ms jitter (High)
                </p>
              </button>

              <button
                onClick={() => handleTriggerBurst('DNS Tunneling / DGA')}
                className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-left hover:bg-cyan-100/80 transition-all group"
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Trigger DNS Tunnel</span>
                  <Zap className="w-3.5 h-3.5 text-cyan-600 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-[11px] text-cyan-700/80 mt-1">
                  4.88-bit Shannon entropy TXT chunk queries (High)
                </p>
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Project & Problem Statement Metadata */}
      <GlassCard
        title="Project & Organization Metadata"
        subtitle="Smart India Hackathon 2026 Technical Credentials"
        icon={<Info className="w-5 h-5 text-slate-600" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">PROJECT TITLE</span>
            <div className="font-bold text-slate-900 font-sans text-sm">Diode-X</div>
            <p className="text-[11px] text-slate-600 font-sans">
              AI-Based Detection of Cyber Threats in Unidirectional IP Traffic
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">ORGANIZATION</span>
            <div className="font-bold text-slate-900 font-sans text-sm">National Technical Research Organisation (NTRO)</div>
            <p className="text-[11px] text-slate-600 font-sans">
              Problem Statement ID: <strong>SIH 26145</strong>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">DATA DIODE ARCHITECTURE</span>
            <div className="text-slate-800">Physical Optical Severance (TX-Only)</div>
            <div className="text-slate-500 text-[11px]">Strict passive observation — 0.000 bps reverse return path</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">AI INFERENCE ENGINE</span>
            <div className="text-slate-800">LightGBM v2.4 + Isolation Forest Ensemble</div>
            <div className="text-slate-500 text-[11px]">42 extracted flow features with SHAP explainability</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};