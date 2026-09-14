import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Clock, 
  Zap, 
  ArrowUpRight, 
  Filter, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Radio,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { MetricCard } from '../components/common/MetricCard';
import { GlassCard } from '../components/common/GlassCard';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { ThreatBadge } from '../components/common/ThreatBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { DashboardStats, ThreatFamilyMetric, SecurityAlert } from '../types';
import { getDashboardStats, getThreatDistribution, getLiveAlerts } from '../services/api';
import { streamService } from '../services/streamService';

interface OverviewDashboardProps {
  onInvestigateAlert: (alertId: string) => void;
  onViewAllAlerts: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onInvestigateAlert,
  onViewAllAlerts
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [threatDistribution, setThreatDistribution] = useState<ThreatFamilyMetric[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [timeRange, setTimeRange] = useState<'15m' | '1h' | '6h' | '24h'>('1h');
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const load = async () => {
      try {
        const [st, dist, al] = await Promise.all([
          getDashboardStats(),
          getThreatDistribution(),
          getLiveAlerts(7)
        ]);
        setStats(st);
        setThreatDistribution(dist);
        setAlerts(al);
      } finally {
        setLoading(false);
      }
    };
    load();

    // Subscribe to real-time incoming alerts
    const unsubAlerts = streamService.subscribeAlerts(newAlert => {
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    });

    // Subscribe to real-time live telemetry changes
    const unsubTelemetry = streamService.subscribeTelemetry(t => {
      setStats(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          totalFlows: t.totalFlows,
          threatsDetected: t.threatsDetected,
          throughputFlowsPerSec: t.flowsPerSec,
          detectionConfidence: t.confidence
        };
      });
    });

    return () => {
      unsubAlerts();
      unsubTelemetry();
    };
  }, []);

  // Time-series mock data based on selected filter
  const getTimeSeriesData = () => {
    switch (timeRange) {
      case '15m':
        return [
          { time: '19:35', totalFlows: 8200, threats: 14, critical: 1 },
          { time: '19:38', totalFlows: 8450, threats: 18, critical: 2 },
          { time: '19:41', totalFlows: 8900, threats: 28, critical: 4 },
          { time: '19:44', totalFlows: 8650, threats: 22, critical: 2 },
          { time: '19:47', totalFlows: 8800, threats: 24, critical: 3 },
          { time: '19:50', totalFlows: 8742, threats: 23, critical: 2 }
        ];
      case '1h':
        return [
          { time: '18:50', totalFlows: 7900, threats: 15, critical: 2 },
          { time: '19:05', totalFlows: 8200, threats: 19, critical: 1 },
          { time: '19:20', totalFlows: 8600, threats: 29, critical: 4 },
          { time: '19:35', totalFlows: 8400, threats: 21, critical: 2 },
          { time: '19:50', totalFlows: 8742, threats: 23, critical: 2 }
        ];
      case '6h':
        return [
          { time: '14:00', totalFlows: 6900, threats: 12, critical: 1 },
          { time: '15:30', totalFlows: 7400, threats: 16, critical: 2 },
          { time: '17:00', totalFlows: 8300, threats: 34, critical: 5 },
          { time: '18:30', totalFlows: 8600, threats: 28, critical: 3 },
          { time: '19:50', totalFlows: 8742, threats: 23, critical: 2 }
        ];
      case '24h':
        return [
          { time: '00:00', totalFlows: 5200, threats: 8, critical: 0 },
          { time: '06:00', totalFlows: 6100, threats: 11, critical: 1 },
          { time: '12:00', totalFlows: 8800, threats: 38, critical: 6 },
          { time: '18:00', totalFlows: 8400, threats: 29, critical: 4 },
          { time: '20:00', totalFlows: 8742, threats: 23, critical: 2 }
        ];
    }
  };

  const chartData = getTimeSeriesData();

  // Donut chart colors matching the 6 threat families
  const threatColors: { [key: string]: string } = {
    DDoS: '#f43f5e',
    'C2 Beaconing': '#f59e0b',
    'DNS Tunneling / DGA': '#06b6d4',
    'Encrypted Malware': '#8b5cf6',
    Reconnaissance: '#3b82f6',
    Exfiltration: '#6366f1'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Security Operations Overview
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Monitoring Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Passive AI-driven monitoring of unidirectional IP traffic for isolated critical infrastructure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge type="read-only" />
          <StatusBadge type="no-return-path" />
        </div>
      </div>

      {/* 6 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          label="Total Flows"
          value={stats?.totalFlows.toLocaleString() || '1,284,932'}
          delta="+8.4% vs period"
          deltaType="positive"
          icon={<Layers className="w-5 h-5" />}
          accentColor="blue"
          subtitle="Processed via diode"
        />
        <MetricCard
          label="Threats Detected"
          value={stats?.threatsDetected.toLocaleString() || '1,247'}
          delta="+3.2% vs hour"
          deltaType="negative"
          icon={<Activity className="w-5 h-5" />}
          accentColor="rose"
          subtitle="Rule + ML matches"
        />
        <MetricCard
          label="Critical Alerts"
          value={stats?.criticalAlerts || 23}
          delta="-2 from peak"
          deltaType="positive"
          icon={<ShieldAlert className="w-5 h-5" />}
          accentColor="rose"
          subtitle="Immediate triage"
        />
        <MetricCard
          label="Detection Confidence"
          value={`${stats?.detectionConfidence || 94.7}%`}
          delta="Ensemble avg"
          deltaType="neutral"
          icon={<ShieldCheck className="w-5 h-5" />}
          accentColor="violet"
          subtitle="Model certainty"
        />
        <MetricCard
          label="Avg Latency"
          value={`${stats?.avgLatencyMs || 142} ms`}
          delta="End-to-end"
          deltaType="positive"
          icon={<Clock className="w-5 h-5" />}
          accentColor="cyan"
          subtitle="Ingest to classification"
        />
        <MetricCard
          label="Throughput"
          value={`${stats?.throughputFlowsPerSec.toLocaleString() || '8,742'}/s`}
          delta="Unidirectional"
          deltaType="neutral"
          icon={<Zap className="w-5 h-5" />}
          accentColor="emerald"
          subtitle="Current ingestion rate"
        />
      </div>

      {/* Threat Activity Graph + Threat Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Time Series Chart (2 cols) */}
        <div className="lg:col-span-2">
          <GlassCard
            title="Threat Activity"
            subtitle="Real-time multi-series flow ingestion & threat volume across passive optical receiver"
            icon={<BarChart2 className="w-5 h-5" />}
            headerAction={
              <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
                {(['15m', '1h', '6h', '24h'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      timeRange === range
                        ? 'bg-white text-blue-600 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            }
          >
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalFlows"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#flowGrad)"
                    name="Flows/sec"
                  />
                  <Area
                    type="monotone"
                    dataKey="threats"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#threatGrad)"
                    name="Threat Detections"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend & Details */}
            <div className="flex flex-wrap items-center justify-between text-xs pt-3 mt-2 border-t border-slate-100 text-slate-500">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full bg-blue-500" />
                  Total Flows (Scale: 1000s)
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full bg-rose-500" />
                  Threats Detected
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Data diode ingest rate: 982.4 Mbps (TX-Only)
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Threat Distribution Donut (1 col) */}
        <div>
          <GlassCard
            title="Threat Distribution"
            subtitle="SIH 26145 - 6 Threat Families"
            icon={<Layers className="w-5 h-5" />}
          >
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {threatDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={threatColors[entry.name] || '#3b82f6'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, item: any) => [
                      `${value} incidents (${item.payload.percentage}%)`,
                      name
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Micro Breakdown List */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              {threatDistribution.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs py-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: threatColors[item.name] }}
                    />
                    <span className="text-slate-700 font-medium truncate max-w-[130px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-900 font-bold">{item.count}</span>
                    <span className="text-slate-400">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Live Threat Feed Table */}
      <GlassCard
        title="Live Threat Feed"
        subtitle="Standardized alerts arriving through backend API with explainable evidence"
        icon={<Radio className="w-5 h-5 text-rose-600 animate-pulse" />}
        headerAction={
          <button
            onClick={onViewAllAlerts}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            Live Monitor View <ChevronRight className="w-3.5 h-3.5" />
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="pb-3 pl-2">Severity</th>
                <th className="pb-3">Threat Type</th>
                <th className="pb-3">Flow Transmission (Passive)</th>
                <th className="pb-3">Flow ID</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => onInvestigateAlert(alert.id)}
                >
                  <td className="py-3 pl-2">
                    <SeverityBadge severity={alert.severity} size="sm" />
                  </td>
                  <td className="py-3 font-semibold text-slate-800">
                    <ThreatBadge threat={alert.threatClass} />
                  </td>
                  <td className="py-3 font-mono text-slate-600">
                    <span className="text-slate-900 font-medium">{alert.sourceIp}</span>
                    <span className="text-slate-400 mx-1.5">→</span>
                    <span className="text-slate-900 font-medium">{alert.destinationIp}</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">({alert.protocol}:{alert.destinationPort})</span>
                  </td>
                  <td className="py-3 font-mono text-slate-500 font-medium">
                    {alert.flowId}
                  </td>
                  <td className="py-3 font-mono font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${alert.confidence}%` }}
                        />
                      </div>
                      <span>{alert.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-400 font-mono">
                    {alert.timestamp}
                  </td>
                  <td className="py-3 text-right pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInvestigateAlert(alert.id);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                    >
                      Inspect <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};