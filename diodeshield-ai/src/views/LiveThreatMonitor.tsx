import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Pause, 
  Play, 
  Trash2, 
  Filter, 
  Activity, 
  ArrowRight, 
  Zap, 
  ShieldAlert, 
  Layers, 
  Search,
  SlidersHorizontal,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { GlassCard } from '../components/common/GlassCard';
import { MetricCard } from '../components/common/MetricCard';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { ThreatBadge } from '../components/common/ThreatBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { SecurityAlert, SeverityLevel, ThreatFamily } from '../types';
import { getLiveAlerts } from '../services/api';
import { streamService } from '../services/streamService';

interface LiveThreatMonitorProps {
  onInvestigateAlert: (alertId: string) => void;
}

export const LiveThreatMonitor: React.FC<LiveThreatMonitorProps> = ({ onInvestigateAlert }) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [threatFilter, setThreatFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live telemetry state
  const [telemetry, setTelemetry] = useState({
    flowsPerSec: 8742,
    totalFlows: 1284932,
    threatsDetected: 1247,
    confidence: 94.7,
    anomalyScore: 0.284
  });

  // Real-time flow waveform chart points
  const [flowHistory, setFlowHistory] = useState<{ time: string; rate: number }[]>([
    { time: '19:40:00', rate: 8400 },
    { time: '19:40:10', rate: 8550 },
    { time: '19:40:20', rate: 8680 },
    { time: '19:40:30', rate: 8720 },
    { time: '19:40:40', rate: 8610 },
    { time: '19:40:50', rate: 8742 }
  ]);

  useEffect(() => {
    // Initial fetch
    getLiveAlerts(12).then(al => setAlerts(al));

    // Telemetry updates
    const unsubTelemetry = streamService.subscribeTelemetry(t => {
      setTelemetry(t);
      setFlowHistory(prev => {
        const now = new Date().toTimeString().substring(0, 8);
        const next = [...prev.slice(1), { time: now, rate: t.flowsPerSec }];
        return next;
      });
    });

    // Incoming live alerts
    const unsubAlerts = streamService.subscribeAlerts(newAlert => {
      if (!isPaused) {
        setAlerts(prev => [newAlert, ...prev.slice(0, 49)]); // keep top 50 in buffer
      }
    });

    return () => {
      unsubTelemetry();
      unsubAlerts();
    };
  }, [isPaused]);

  const handleTogglePause = () => {
    if (isPaused) {
      streamService.resume();
      setIsPaused(false);
    } else {
      streamService.pause();
      setIsPaused(true);
    }
  };

  const handleClear = () => {
    setAlerts([]);
  };

  // Filter alerts
  const filteredAlerts = alerts.filter(al => {
    if (severityFilter !== 'ALL' && al.severity !== severityFilter) return false;
    if (threatFilter !== 'ALL' && al.threatClass !== threatFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchIp = al.sourceIp.includes(q) || al.destinationIp.includes(q);
      const matchId = al.flowId.toLowerCase().includes(q) || al.id.toLowerCase().includes(q);
      const matchType = al.threatClass.toLowerCase().includes(q);
      if (!matchIp && !matchId && !matchType) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Live Threat Monitor
            </h2>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              LIVE TELEMETRY STREAM
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time passive packet/flow ingestion analysis via zero-copy data diode tap
          </p>
        </div>

        {/* Status badges required by prompt */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge type="read-only" />
          <StatusBadge type="no-return-path" />
          <StatusBadge type="diode-isolated" />
        </div>
      </div>

      {/* 5 Real-Time Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Flow Counter"
          value={telemetry.totalFlows.toLocaleString()}
          delta="Incrementing"
          deltaType="positive"
          icon={<Layers className="w-5 h-5" />}
          accentColor="blue"
          subtitle="Cumulative optical frames"
        />
        <MetricCard
          label="Throughput"
          value={`${telemetry.flowsPerSec.toLocaleString()} /s`}
          delta="Dynamic"
          deltaType="neutral"
          icon={<Zap className="w-5 h-5" />}
          accentColor="cyan"
          subtitle="Ingestion velocity"
        />
        <MetricCard
          label="Threat Detection Rate"
          value={`${telemetry.threatsDetected.toLocaleString()}`}
          delta="Passive matches"
          deltaType="negative"
          icon={<Activity className="w-5 h-5" />}
          accentColor="rose"
          subtitle="ML + Signature hits"
        />
        <MetricCard
          label="Anomaly Score"
          value={telemetry.anomalyScore.toFixed(3)}
          delta="Cluster density"
          deltaType="neutral"
          icon={<Sparkles className="w-5 h-5" />}
          accentColor="violet"
          subtitle="Isolation Forest gauge"
        />
        <MetricCard
          label="Active Stream Alerts"
          value={filteredAlerts.length}
          delta={isPaused ? 'STREAM PAUSED' : 'LIVE'}
          deltaType={isPaused ? 'negative' : 'positive'}
          icon={<ShieldAlert className="w-5 h-5" />}
          accentColor="amber"
          subtitle="Buffer window"
        />
      </div>

      {/* Large Real-Time Ingestion Velocity Waveform */}
      <GlassCard
        title="Live Ingestion Velocity Waveform"
        subtitle="Unidirectional flows/sec arriving across hardware receiver"
        icon={<Zap className="w-5 h-5 text-cyan-600" />}
      >
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={flowHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="liveWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 500', 'dataMax + 500']} tickLine={false} />
              <Tooltip
                formatter={(val: any) => [`${val} flows/s`, 'Rate']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#0891b2"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#liveWaveGrad)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Stream Controls & Live Stream List */}
      <GlassCard
        title="Live Event Stream"
        subtitle="Incoming security alerts detected by passive inference pipeline"
        icon={<Radio className="w-5 h-5 text-blue-600" />}
        headerAction={
          <div className="flex flex-wrap items-center gap-2">
            {/* Pause / Resume Button */}
            <button
              onClick={handleTogglePause}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isPaused
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume Stream' : 'Pause Stream'}</span>
            </button>

            {/* Clear Stream */}
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all"
              title="Clear current stream buffer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        }
      >
        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by IP, Flow ID, or Threat..."
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 sm:w-64"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Severity:</span>
              <select
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium"
              >
                <option value="ALL">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Threat Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Threat:</span>
              <select
                value={threatFilter}
                onChange={e => setThreatFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium"
              >
                <option value="ALL">All Threat Families</option>
                <option value="DDoS">DDoS</option>
                <option value="C2 Beaconing">C2 Beaconing</option>
                <option value="DNS Tunneling / DGA">DNS Tunneling / DGA</option>
                <option value="Encrypted Malware">Encrypted Malware</option>
                <option value="Reconnaissance">Reconnaissance</option>
                <option value="Exfiltration">Exfiltration</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing <strong className="text-slate-800">{filteredAlerts.length}</strong> alerts in stream
          </div>
        </div>

        {/* Live Stream List Rows */}
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium">No alerts matching current filters.</p>
            <p className="text-xs text-slate-400 mt-1">Live alerts will appear as new threats are detected.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left: Severity + Threat + Flow */}
                <div className="flex items-start sm:items-center gap-3">
                  <SeverityBadge severity={alert.severity} size="sm" />
                  <ThreatBadge threat={alert.threatClass} />
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
                      <span className="font-semibold text-slate-900">{alert.sourceIp}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-semibold text-slate-900">{alert.destinationIp}</span>
                      <span className="text-slate-400 text-[10px]">({alert.protocol}:{alert.destinationPort})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-xl">
                      {alert.summary}
                    </p>
                  </div>
                </div>

                {/* Right: Confidence, Timestamp, and Inspect Button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-slate-800">
                      {alert.confidence}% Conf
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {alert.timestamp}
                    </div>
                  </div>

                  <button
                    onClick={() => onInvestigateAlert(alert.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                  >
                    <span>Inspect Flow</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};