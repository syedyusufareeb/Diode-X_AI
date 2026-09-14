import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Download, 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  Network, 
  FileCode, 
  Activity,
  Layers,
  HelpCircle,
  Share2,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { ThreatBadge } from '../components/common/ThreatBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Timeline } from '../components/common/Timeline';
import { FeatureImportanceChart } from '../components/common/FeatureImportanceChart';
import { SecurityAlert } from '../types';
import { getAlertDetails, getLiveAlerts } from '../services/api';

interface AlertDetailsProps {
  selectedAlertId?: string;
  onBackToOverview: () => void;
  onSelectAnotherAlert: (alertId: string) => void;
}

export const AlertDetails: React.FC<AlertDetailsProps> = ({
  selectedAlertId = 'ALT-8841',
  onBackToOverview,
  onSelectAnotherAlert
}) => {
  const [alert, setAlert] = useState<SecurityAlert | null>(null);
  const [allAlerts, setAllAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAlertDetails(selectedAlertId),
      getLiveAlerts(6)
    ]).then(([detail, list]) => {
      setAlert(detail);
      setAllAlerts(list);
      setLoading(false);
    });
  }, [selectedAlertId]);

  const handleExportJson = () => {
    if (!alert) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(alert, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `diode-x_incident_${alert.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  if (loading || !alert) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />
        <p className="text-sm font-semibold">Loading alert investigation dossier...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToOverview}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Back to Overview"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Alert Investigation
              </h2>
              <span className="font-mono text-sm font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
                {alert.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Explainable AI decision ledger & metadata forensics for unidirectional session
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{exportSuccess ? 'Exported JSON!' : 'Export Incident JSON'}</span>
          </button>
          <StatusBadge type="read-only" />
        </div>
      </div>

      {/* Strict Passive Architecture Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-slate-50 border border-blue-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Strict Passive Monitoring Guarantee (SIH 26145 / NTRO)
            </h4>
            <p className="text-xs text-blue-800/80 mt-0.5 leading-relaxed">
              This detection was produced solely by passive telemetry inspection across a hardware data diode. 
              <strong> Zero active probe packets, handshake terminations, TCP resets, or quarantine commands</strong> have been or will be dispatched to the monitored network.
            </p>
          </div>
        </div>
        <StatusBadge type="no-return-path" className="shrink-0 self-start sm:self-center" />
      </div>

      {/* Incident Summary Card */}
      <GlassCard padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Threat Classification
            </span>
            <div className="mt-1.5">
              <ThreatBadge threat={alert.threatClass} size="md" />
            </div>
            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
              {alert.summary}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Severity Level
            </span>
            <div className="mt-1.5">
              <SeverityBadge severity={alert.severity} size="md" />
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-2">
              Rule Matches: {alert.ruleMatches.length} heuristic rules
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Model Confidence
            </span>
            <div className="text-2xl font-bold font-mono text-blue-600 mt-1">
              {alert.confidence}%
            </div>
            <div className="w-28 h-1.5 rounded-full bg-slate-200 mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                style={{ width: `${alert.confidence}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Flow Identifier
            </span>
            <div className="text-base font-bold font-mono text-slate-800 mt-1">
              {alert.flowId}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Observed: {alert.timestamp}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Anomaly Score
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {alert.mlScore.toFixed(3)}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Entropy: {alert.entropy.toFixed(2)} bits
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Main Analysis Grid: Evidence & ML Explainability (Left 2 cols) vs Metadata & Timeline (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Detection Evidence & ML Explainability */}
        <div className="lg:col-span-2 space-y-6">
          {/* Explainable Detection Evidence */}
          <GlassCard
            title="Detection Evidence (Explainable Features)"
            subtitle="Extracted passive features compared against baseline normal distribution"
            icon={<Sparkles className="w-5 h-5 text-violet-600" />}
          >
            <FeatureImportanceChart evidence={alert.evidence} />
          </GlassCard>

          {/* ML Analysis & Heuristic Rules */}
          <GlassCard
            title="Machine Learning & Rule Fusion Analysis"
            subtitle="Hybrid ensemble combining deterministic heuristics with supervised ML classifiers"
            icon={<Layers className="w-5 h-5 text-blue-600" />}
          >
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Deterministic Heuristic Rule Triggers
                </span>
                <div className="flex flex-wrap gap-2">
                  {alert.ruleMatches.map((rule, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {rule}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-semibold text-slate-800">
                  Ensemble Decision Rationale:
                </div>
                <p className="text-slate-600 leading-relaxed">
                  The LightGBM gradient-boosted decision tree scored this flow at{' '}
                  <strong className="text-slate-900 font-mono">{alert.mlScore}</strong> probability of matching{' '}
                  <strong className="text-blue-600">{alert.threatClass}</strong>. 
                  Concurrently, the Isolation Forest detected an anomaly density collapse in the inter-arrival and byte ratio subspaces, satisfying multiple independent criteria for standardized alert emission.
                </p>
              </div>

              {alert.ja3Fingerprint && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    TLS JA3 Cryptographic Fingerprint
                  </span>
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs break-all shadow-2xs">
                    {alert.ja3Fingerprint}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right 1 Col: Network Metadata & Timeline */}
        <div className="space-y-6">
          {/* Network Metadata */}
          <GlassCard
            title="Network Metadata"
            subtitle="Passive NetFlow v9/IPFIX attributes"
            icon={<Network className="w-5 h-5 text-sky-600" />}
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block">SOURCE ENDPOINT</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {alert.sourceIp}
                </div>
                <span className="text-slate-500 text-[11px]">Port: {alert.sourcePort}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block">DESTINATION ENDPOINT</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {alert.destinationIp}
                </div>
                <span className="text-slate-500 text-[11px]">Port: {alert.destinationPort}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">PROTOCOL</span>
                  <span className="font-bold text-blue-600">{alert.protocol}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">DURATION</span>
                  <span className="font-bold text-slate-800">{(alert.durationMs / 1000).toFixed(1)}s</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">TOTAL BYTES</span>
                  <span className="font-bold text-slate-800">{alert.byteCount.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">PACKET COUNT</span>
                  <span className="font-bold text-slate-800">{alert.packetCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Explainable Detection Pipeline Timeline */}
          <GlassCard
            title="Inference Progression Timeline"
            subtitle="Flow ingestion to alert fusion lifecycle"
            icon={<Clock className="w-5 h-5 text-emerald-600" />}
          >
            <Timeline stages={alert.timeline} />
          </GlassCard>

          {/* Quick Switch to Related Alerts */}
          <GlassCard
            title="Other Incident Dossiers"
            subtitle="Select to review explainability"
            padding="sm"
          >
            <div className="space-y-1.5">
              {allAlerts.map(item => (
                <button
                  key={item.id}
                  onClick={() => onSelectAnotherAlert(item.id)}
                  className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                    item.id === alert.id
                      ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px]">{item.flowId}</span>
                    <span className="text-slate-500 font-normal">{item.threatClass}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{item.confidence}%</span>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};