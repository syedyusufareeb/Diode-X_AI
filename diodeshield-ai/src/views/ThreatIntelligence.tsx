import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Search, 
  Radio, 
  Activity, 
  X, 
  ArrowRight,
  Info,
  ChevronRight
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { ThreatBadge } from '../components/common/ThreatBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ThreatFamilyMetric, ThreatFamily } from '../types';
import { getThreatDistribution } from '../services/api';

interface ThreatIntelligenceProps {
  onInvestigateThreatFamily: (threatName: ThreatFamily) => void;
}

export const ThreatIntelligence: React.FC<ThreatIntelligenceProps> = ({ onInvestigateThreatFamily }) => {
  const [threats, setThreats] = useState<ThreatFamilyMetric[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatFamilyMetric | null>(null);

  useEffect(() => {
    getThreatDistribution().then(data => setThreats(data));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Threat Intelligence Knowledge Base
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              6 Core Families (SIH 26145)
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Taxonomy and detection heuristics modeled for passive metadata evaluation across unidirectional IP telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge type="read-only" />
          <StatusBadge type="no-return-path" />
        </div>
      </div>

      {/* 6 Threat Family Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {threats.map(t => {
          const totalSeverity = t.severityDistribution.critical + t.severityDistribution.high + t.severityDistribution.medium + t.severityDistribution.low;
          const critPct = (t.severityDistribution.critical / totalSeverity) * 100;
          const highPct = (t.severityDistribution.high / totalSeverity) * 100;
          const medPct = (t.severityDistribution.medium / totalSeverity) * 100;
          const lowPct = (t.severityDistribution.low / totalSeverity) * 100;

          return (
            <div
              key={t.id}
              onClick={() => setSelectedThreat(t)}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200/90 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header: Badge + Trend */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <ThreatBadge threat={t.name} size="md" />
                  <div className="flex items-center gap-1 text-xs font-semibold">
                    {t.trend === 'up' && (
                      <span className="flex items-center gap-0.5 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <TrendingUp className="w-3 h-3" /> {t.trendValue}
                      </span>
                    )}
                    {t.trend === 'down' && (
                      <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <TrendingDown className="w-3 h-3" /> {t.trendValue}
                      </span>
                    )}
                    {t.trend === 'stable' && (
                      <span className="flex items-center gap-0.5 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        <Minus className="w-3 h-3" /> {t.trendValue}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>

                {/* Core Metrics: Count & Confidence */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50/90 border border-slate-100 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Detections
                    </span>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                      {t.count.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {t.percentage}% of all threats
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Avg Confidence
                    </span>
                    <div className="text-xl font-bold font-mono text-blue-600 mt-0.5">
                      {t.avgConfidence}%
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Ensemble verified
                    </span>
                  </div>
                </div>

                {/* Severity Breakdown Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Severity Distribution</span>
                    <span className="font-mono text-[10px]">
                      {t.severityDistribution.critical} Crit / {t.severityDistribution.high} High
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                    <div style={{ width: `${critPct}%` }} className="h-full bg-rose-500" title={`Critical: ${t.severityDistribution.critical}`} />
                    <div style={{ width: `${highPct}%` }} className="h-full bg-amber-500" title={`High: ${t.severityDistribution.high}`} />
                    <div style={{ width: `${medPct}%` }} className="h-full bg-yellow-400" title={`Medium: ${t.severityDistribution.medium}`} />
                    <div style={{ width: `${lowPct}%` }} className="h-full bg-sky-400" title={`Low: ${t.severityDistribution.low}`} />
                  </div>
                </div>

                {/* Key Behavioral Indicators */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Passive Indicators:
                  </span>
                  {t.keyIndicators.slice(0, 2).map((ind, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span className="truncate">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Click for deep profile</span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Intelligence <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Threat Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="glass-card rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <ThreatBadge threat={selectedThreat.name} size="md" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedThreat.name} Profile
                  </h3>
                  <p className="text-xs text-slate-500">
                    Passive Unidirectional Ingest Heuristics (SIH PS 26145)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedThreat(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Threat Family Overview
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {selectedThreat.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Incidents</span>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                    {selectedThreat.count}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Confidence</span>
                  <div className="text-lg font-bold font-mono text-blue-600 mt-0.5">
                    {selectedThreat.avgConfidence}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Trend</span>
                  <div className="text-sm font-bold font-mono text-slate-800 mt-1">
                    {selectedThreat.trendValue}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Share</span>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                    {selectedThreat.percentage}%
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Unidirectional Telemetry Indicators
                </h4>
                <div className="space-y-2">
                  {selectedThreat.keyIndicators.map((ind, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Representative Telemetry Sample
                </h4>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                  <code>{selectedThreat.recentDetectionSample}</code>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                <strong>Passive Architecture Reminder:</strong> Diode-X observes unidirectional flow sessions without active return responses, SYN-ACK injection, or packet dropping.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedThreat(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close Profile
              </button>
              <button
                onClick={() => {
                  const name = selectedThreat.name;
                  setSelectedThreat(null);
                  onInvestigateThreatFamily(name);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <span>Filter Flows for {selectedThreat.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};