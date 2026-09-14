import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Layers, 
  Clock, 
  Zap, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { GlassCard } from '../components/common/GlassCard';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { AnalyticsData, ThreatFamilyMetric } from '../types';
import { getThreatAnalytics, getThreatDistribution } from '../services/api';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [threatDistribution, setThreatDistribution] = useState<ThreatFamilyMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      getThreatAnalytics(),
      getThreatDistribution()
    ]).then(([an, dist]) => {
      setData(an);
      setThreatDistribution(dist);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-2" />
        <p className="text-sm">Loading AI model metrics & analytics...</p>
      </div>
    );
  }

  // Format comparison data for bar chart
  const comparisonData = threatDistribution.map(t => ({
    name: t.name,
    incidents: t.count,
    confidence: t.avgConfidence,
    critical: t.severityDistribution.critical,
    high: t.severityDistribution.high
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Model Analytics & Benchmark Performance
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Evaluated on NTRO Testbed
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Quantitative evaluation of supervised LightGBM, Random Forest, and Isolation Forest models on unidirectional telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge type="read-only" />
          <StatusBadge type="no-return-path" />
        </div>
      </div>

      {/* 5 Detection Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Precision"
          value={`${data.performance.precision}%`}
          delta="+0.4% vs baseline"
          deltaType="positive"
          icon={<Award className="w-5 h-5" />}
          accentColor="blue"
          subtitle="True positive precision"
        />
        <MetricCard
          label="Recall"
          value={`${data.performance.recall}%`}
          delta="+0.6% vs benchmark"
          deltaType="positive"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="cyan"
          subtitle="Threat coverage sensitivity"
        />
        <MetricCard
          label="F1 Score"
          value={`${data.performance.f1Score}%`}
          delta="Harmonic mean"
          deltaType="positive"
          icon={<ShieldCheck className="w-5 h-5" />}
          accentColor="violet"
          subtitle="Overall model accuracy"
        />
        <MetricCard
          label="PR-AUC"
          value={data.performance.prAuc.toFixed(3)}
          delta="Precision-Recall curve"
          deltaType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="emerald"
          subtitle="Imbalanced class AUC"
        />
        <MetricCard
          label="False Positive Rate"
          value={`${data.performance.falsePositiveRate}%`}
          delta="< 0.15% target"
          deltaType="positive"
          icon={<Clock className="w-5 h-5" />}
          accentColor="rose"
          subtitle="Minimal SOC fatigue"
        />
      </div>

      {/* Threat Trends Over Time (Stacked Area Chart) */}
      <GlassCard
        title="Threat Trends Over Time"
        subtitle="Hourly incident volume broken down across the 6 SIH threat families"
        icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
      >
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.threatTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="c_ddos" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                <linearGradient id="c_c2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                <linearGradient id="c_dns" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient>
                <linearGradient id="c_mal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="ddos" stroke="#f43f5e" fill="url(#c_ddos)" name="DDoS" />
              <Area type="monotone" dataKey="c2" stroke="#f59e0b" fill="url(#c_c2)" name="C2 Beaconing" />
              <Area type="monotone" dataKey="dnsTunnel" stroke="#06b6d4" fill="url(#c_dns)" name="DNS Tunneling" />
              <Area type="monotone" dataKey="malware" stroke="#8b5cf6" fill="url(#c_mal)" name="Encrypted Malware" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Threat Comparison & Confidence Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Comparison Bar Chart */}
        <GlassCard
          title="Threat Family Comparison"
          subtitle="Volume vs Average Confidence across the 6 threat categories"
          icon={<Layers className="w-5 h-5 text-violet-600" />}
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="incidents" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Detections" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Confidence Distribution Histogram */}
        <GlassCard
          title="Confidence Distribution"
          subtitle="Frequency histogram of model confidence buckets"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.confidenceDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} alerts (${item.payload.percentage}%)`,
                    'Count'
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} name="Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Detection Latency & Ingestion Throughput */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Latency Chart */}
        <GlassCard
          title="Inference & Detection Latency (ms)"
          subtitle="Mean vs P95 latency from optical frame arrival to alert emission"
          icon={<Clock className="w-5 h-5 text-cyan-600" />}
        >
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.latencyOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[100, 200]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={2.5} name="Mean Latency (ms)" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="p95" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="3 3" name="P95 Latency (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Throughput Chart */}
        <GlassCard
          title="Ingestion Throughput (flows/sec)"
          subtitle="Passive unidirectional intake sustained over continuous testing"
          icon={<Zap className="w-5 h-5 text-emerald-600" />}
        >
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.throughputOverTime} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="tpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[7000, 10000]} tickLine={false} />
                <Tooltip
                  formatter={(v: any) => [`${v} flows/s`, 'Rate']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="flowsPerSec" stroke="#10b981" strokeWidth={2.5} fill="url(#tpGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};