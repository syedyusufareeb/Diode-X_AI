import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Server, 
  Cpu, 
  Activity, 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowDown, 
  ArrowRight, 
  Lock, 
  RefreshCw,
  Zap,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { SystemHealthData, ComponentHealth } from '../types';
import { getSystemHealth, checkBackendHealth } from '../services/api';

export const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<SystemHealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [checking, setChecking] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSystemHealth();
      setHealth(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setChecking(true);
    await checkBackendHealth();
    await loadData();
    setChecking(false);
  };

  if (loading || !health) {
    return (
      <div className="p-12 text-center text-slate-400">
        <HeartPulse className="w-8 h-8 animate-pulse mx-auto text-blue-500 mb-2" />
        <p className="text-sm">Polling technical infrastructure telemetry...</p>
      </div>
    );
  }

  const components: ComponentHealth[] = [
    health.apiGateway,
    health.streamProcessor,
    health.featureEngine,
    health.detectionEngine,
    health.alertFusion
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              System Health & Architecture
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Status of decoupled microservices, optical diode receiver, and real-time streaming buses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={checking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Probing...' : 'Run Diagnostics'}</span>
          </button>
          <StatusBadge type="read-only" />
        </div>
      </div>

      {/* Hardware Data Diode Assurance Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-violet-50/90 via-blue-50/70 to-slate-50 border border-violet-200/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {health.hardwareDiode.model}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-100 text-violet-800 border border-violet-200">
                  {health.hardwareDiode.state}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Optical physical barrier: <strong>{health.hardwareDiode.physicalReturnPath}</strong>. 
                Utilizes {health.hardwareDiode.lightSource} for strictly one-way fiber transmission.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge type="no-return-path" />
            <StatusBadge type="diode-isolated" />
          </div>
        </div>
      </div>

      {/* 6 Component Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {components.map((comp, idx) => (
          <GlassCard key={idx} padding="md" hoverEffect>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{comp.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{comp.role}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {comp.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-slate-100 font-mono text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Latency</span>
                <span className="font-bold text-slate-800">{comp.latencyMs}ms</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Throughput</span>
                <span className="font-bold text-blue-600 text-[11px]">{comp.throughput}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Uptime</span>
                <span className="font-bold text-emerald-600">{comp.uptime}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              {comp.details}
            </p>
          </GlassCard>
        ))}

        {/* WebSocket Stream Ingestion Card */}
        <GlassCard padding="md" hoverEffect>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Streaming Stream Bus</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{health.streamingConnection.type} Dispatcher</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              {health.streamingConnection.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-slate-100 font-mono text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Latency</span>
              <span className="font-bold text-slate-800">{health.streamingConnection.latencyMs}ms</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Events</span>
              <span className="font-bold text-blue-600">{health.streamingConnection.eventsReceived}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Isolation</span>
              <span className="font-bold text-violet-600">PASSIVE</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-mono truncate">
            {health.streamingConnection.url}
          </p>
        </GlassCard>
      </div>

      {/* Visual Unidirectional Architecture Pipeline Diagram */}
      <GlassCard
        title="Unidirectional Passive Monitoring Pipeline Architecture"
        subtitle="End-to-end data flow: Hardware Optical Diode to AI-Powered SOC Dashboard"
        icon={<Cpu className="w-5 h-5 text-blue-600" />}
      >
        <div className="py-6 px-2">
          {/* Architecture Pipeline Flow */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center relative">
            {/* Step 1 */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center relative group">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center mx-auto mb-2">
                1
              </span>
              <h5 className="font-bold text-xs text-slate-800 uppercase tracking-tight">ONE-WAY INGEST</h5>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">PCAP / NetFlow / IPFIX / sFlow</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-300">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-50 to-blue-50 border-2 border-violet-300/80 shadow-xs text-center relative group">
              <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
                2
              </span>
              <h5 className="font-bold text-xs text-violet-900 uppercase tracking-tight">DATA DIODE</h5>
              <p className="text-[10px] text-violet-700 mt-1 font-bold">Physical Optical TX (No RX)</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-300">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center relative group">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center mx-auto mb-2">
                3
              </span>
              <h5 className="font-bold text-xs text-slate-800 uppercase tracking-tight">FEATURE ENGINE</h5>
              <p className="text-[10px] text-slate-500 mt-1">Entropy, Timing, JA3, Fan-out</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-300">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 shadow-2xs text-center relative group">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
                4
              </span>
              <h5 className="font-bold text-xs text-blue-900 uppercase tracking-tight">DETECTION LAYER</h5>
              <p className="text-[10px] text-blue-700 mt-1 font-semibold">Rules + LightGBM + IsoForest</p>
            </div>
          </div>

          {/* Sub Row Flow */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 text-xs">
              <Layers className="w-4 h-4 text-violet-600" />
              <span className="font-bold text-slate-800">ALERT FUSION</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-500">Deduplication & SHAP Feature Attribution</span>
            </div>

            <ArrowRight className="hidden md:block w-4 h-4 text-slate-300" />

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>SOC DASHBOARD (Diode-X)</span>
              <span className="text-[10px] bg-blue-700/80 px-2 py-0.5 rounded-full">REST / WebSocket API</span>
            </div>
          </div>
        </div>

        {/* Footer Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700">
            🔒 <strong>Monitoring Only:</strong> Zero network actuation
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700">
            👁️ <strong>Read-Only Ingest:</strong> Zero packet injection
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700">
            🛡️ <strong>No Return Path:</strong> Mechanically enforced by diode
          </div>
        </div>
      </GlassCard>
    </div>
  );
};