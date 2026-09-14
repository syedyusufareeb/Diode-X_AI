import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  SlidersHorizontal, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Activity, 
  FileSpreadsheet, 
  FileText,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { ThreatBadge } from '../components/common/ThreatBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { NetworkFlow } from '../types';
import { getFlows } from '../services/api';

interface FlowExplorerProps {
  initialThreatFilter?: string;
  onInspectAlert: (flowId: string) => void;
}

export const FlowExplorer: React.FC<FlowExplorerProps> = ({ 
  initialThreatFilter, 
  onInspectAlert 
}) => {
  const [flows, setFlows] = useState<NetworkFlow[]>([]);
  const [totalFlows, setTotalFlows] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [threatOnly, setThreatOnly] = useState<boolean>(false);
  const [protocol, setProtocol] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<keyof NetworkFlow>('timestamp');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [selectedFlow, setSelectedFlow] = useState<NetworkFlow | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialThreatFilter) {
      setSearch(initialThreatFilter);
    }
  }, [initialThreatFilter]);

  const fetchFlowsData = async () => {
    setLoading(true);
    try {
      const res = await getFlows({
        search,
        threatOnly,
        protocol,
        page,
        pageSize
      });
      setFlows(res.flows);
      setTotalFlows(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowsData();
  }, [search, threatOnly, protocol, page]);

  // Client-side sort on loaded page
  const sortedFlows = [...flows].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc 
      ? String(valA).localeCompare(String(valB)) 
      : String(valB).localeCompare(String(valA));
  });

  const handleSort = (field: keyof NetworkFlow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Timestamp', 'Flow ID', 'Source IP', 'Dest IP', 'Src Port', 'Dst Port',
      'Protocol', 'Bytes', 'Packets', 'Duration (s)', 'Threat Score', 'Classification', 'Confidence'
    ];
    const rows = sortedFlows.map(f => [
      f.timestamp, f.id, f.sourceIp, f.destinationIp, f.sourcePort, f.destinationPort,
      f.protocol, f.bytes, f.packets, f.duration, f.threatScore, f.classification, `${f.confidence}%`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `diode-x_flows_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.max(1, Math.ceil(totalFlows / pageSize));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Flow Explorer
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Passive Session Ledger
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Deep inspection of unidirectional IP sessions, timing delta, entropy, and cryptographic fingerprints
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all"
            title="Export filtered flows to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <StatusBadge type="read-only" />
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <GlassCard padding="sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by IP, Flow ID, or Threat..."
                className="pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 sm:w-80"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Protocol Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Protocol:</span>
              <select
                value={protocol}
                onChange={e => {
                  setProtocol(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium"
              >
                <option value="ALL">All Protocols</option>
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="QUIC">QUIC</option>
                <option value="ICMP">ICMP</option>
              </select>
            </div>

            {/* Threat-Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={threatOnly}
                onChange={e => {
                  setThreatOnly(e.target.checked);
                  setPage(1);
                }}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span>Threat Flows Only</span>
            </label>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {totalFlows} flows recorded
          </div>
        </div>
      </GlassCard>

      {/* 13-Column Flow Table */}
      <GlassCard padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-100/60 border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <th onClick={() => handleSort('timestamp')} className="py-3 px-3.5 cursor-pointer hover:text-slate-800">
                  <div className="flex items-center gap-1">
                    Timestamp <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('id')} className="py-3 px-3 cursor-pointer hover:text-slate-800">
                  <div className="flex items-center gap-1">
                    Flow ID <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Source IP : Port</th>
                <th className="py-3 px-3">Destination IP : Port</th>
                <th onClick={() => handleSort('protocol')} className="py-3 px-2 cursor-pointer hover:text-slate-800">
                  <div className="flex items-center gap-1">
                    Proto <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('bytes')} className="py-3 px-3 text-right cursor-pointer hover:text-slate-800">
                  <div className="flex items-center justify-end gap-1">
                    Bytes <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('packets')} className="py-3 px-3 text-right cursor-pointer hover:text-slate-800">
                  <div className="flex items-center justify-end gap-1">
                    Packets <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('duration')} className="py-3 px-3 text-right cursor-pointer hover:text-slate-800">
                  <div className="flex items-center justify-end gap-1">
                    Duration <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('threatScore')} className="py-3 px-3 text-center cursor-pointer hover:text-slate-800">
                  <div className="flex items-center justify-center gap-1">
                    Score <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Classification</th>
                <th onClick={() => handleSort('confidence')} className="py-3 px-3 text-right cursor-pointer hover:text-slate-800">
                  <div className="flex items-center justify-end gap-1">
                    Confidence <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 pr-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedFlows.map(flow => {
                const isAnomaly = flow.classification !== 'Benign';
                return (
                  <tr
                    key={flow.id}
                    onClick={() => setSelectedFlow(flow)}
                    className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${
                      selectedFlow?.id === flow.id ? 'bg-blue-50/80 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-3.5 font-mono text-slate-500 text-[11px]">
                      {flow.timestamp}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {flow.id}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {flow.sourceIp}:{flow.sourcePort}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {flow.destinationIp}:{flow.destinationPort}
                    </td>
                    <td className="py-3 px-2 font-mono text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
                        {flow.protocol}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-slate-700">
                      {flow.bytes.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-slate-700">
                      {flow.packets.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-slate-500">
                      {flow.duration}s
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                          flow.threatScore >= 90
                            ? 'bg-rose-100 text-rose-700'
                            : flow.threatScore >= 50
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {flow.threatScore}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <ThreatBadge threat={flow.classification} />
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-slate-800 font-semibold">
                      {flow.confidence}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          flow.status === 'Flagged'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {flow.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      {isAnomaly ? (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onInspectAlert(flow.id);
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                        >
                          Investigate
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Baseline</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Slide-Over Side Inspection Drawer */}
      {selectedFlow && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-lg h-full glass-card border-l border-slate-200 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right">
            <div>
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 font-mono">
                      {selectedFlow.id}
                    </h3>
                    <ThreatBadge threat={selectedFlow.classification} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Observed at {selectedFlow.timestamp} across Optical Diode
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFlow(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="py-4 space-y-4">
                {/* Connection Tuple Card */}
                <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">SOURCE:</span>
                    <span className="font-bold text-slate-900">{selectedFlow.sourceIp}:{selectedFlow.sourcePort}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">DESTINATION:</span>
                    <span className="font-bold text-slate-900">{selectedFlow.destinationIp}:{selectedFlow.destinationPort}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-400">PROTOCOL:</span>
                    <span className="text-blue-600 font-bold">{selectedFlow.protocol}</span>
                  </div>
                </div>

                {/* Behavioral Metadata Attributes */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Extracted Flow Telemetry
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[11px]">Volume</span>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {selectedFlow.bytes.toLocaleString()} bytes
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[11px]">Packets</span>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {selectedFlow.packets.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[11px]">Duration</span>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {selectedFlow.duration} seconds
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[11px]">Shannon Entropy</span>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {selectedFlow.entropy.toFixed(2)} bits/char
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional JA3 / Cryptographic Fingerprint */}
                {selectedFlow.ja3 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      TLS JA3 Cryptographic Fingerprint
                    </h4>
                    <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] break-all">
                      {selectedFlow.ja3}
                    </div>
                  </div>
                )}

                {/* Unidirectional Security Notice */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
                  <strong>Passive Audit Notice:</strong> Flow inspected in memory via read-only parser. In accordance with NTRO unidirectional architecture, no probing packets or handshake validations were initiated.
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedFlow(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close Panel
              </button>
              {selectedFlow.classification !== 'Benign' && (
                <button
                  onClick={() => {
                    const id = selectedFlow.id;
                    setSelectedFlow(null);
                    onInspectAlert(id);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  Open Investigation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};