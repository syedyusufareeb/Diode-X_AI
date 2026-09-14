export type ThreatFamily = 
  | 'DDoS'
  | 'C2 Beaconing'
  | 'DNS Tunneling / DGA'
  | 'Encrypted Malware'
  | 'Reconnaissance'
  | 'Exfiltration';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface AlertEvidence {
  featureName: string;
  observedValue: string | number;
  baselineValue: string | number;
  anomalyScore: number;
  importance: number; // SHAP % contribution (0 to 100)
  description: string;
}

export interface SecurityAlert {
  id: string;
  flowId: string;
  timestamp: string;
  threatClass: ThreatFamily;
  severity: SeverityLevel;
  confidence: number; // e.g. 98.2 (%)
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'QUIC' | 'DNS';
  byteCount: number;
  packetCount: number;
  durationMs: number;
  summary: string;
  evidence: AlertEvidence[];
  ruleMatches: string[];
  mlScore: number; // 0.0 to 1.0
  entropy: number;
  ja3Fingerprint?: string;
  ja4Fingerprint?: string;
  timeline: {
    stage: string;
    timestamp: string;
    detail: string;
    completed: boolean;
  }[];
}

export interface NetworkFlow {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'QUIC';
  bytes: number;
  packets: number;
  duration: number; // in seconds
  threatScore: number; // 0 to 100
  classification: ThreatFamily | 'Benign';
  confidence: number; // percentage
  status: 'Flagged' | 'Inspected' | 'Baseline';
  entropy: number;
  fanOutRatio?: number;
  interArrivalJitterMs?: number;
  ja3?: string;
}

export interface DashboardStats {
  totalFlows: number;
  totalFlowsDelta: string;
  threatsDetected: number;
  threatsDetectedDelta: string;
  criticalAlerts: number;
  criticalAlertsDelta: string;
  detectionConfidence: number;
  avgLatencyMs: number;
  throughputFlowsPerSec: number;
  isMonitoringActive: boolean;
  activeDataDiodeTxRateMbps: number;
}

export interface ThreatFamilyMetric {
  id: string;
  name: ThreatFamily;
  description: string;
  count: number;
  percentage: number;
  avgConfidence: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  severityDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  keyIndicators: string[];
  recentDetectionSample: string;
}

export interface ComponentHealth {
  name: string;
  role: string;
  status: 'Healthy' | 'Degraded' | 'Critical';
  latencyMs: number;
  throughput: string;
  processedCount: string;
  uptime: string;
  lastHeartbeat: string;
  details: string;
}

export interface SystemHealthData {
  apiGateway: ComponentHealth;
  streamProcessor: ComponentHealth;
  featureEngine: ComponentHealth;
  detectionEngine: ComponentHealth;
  alertFusion: ComponentHealth;
  streamingConnection: {
    status: 'Connected' | 'Reconnecting' | 'Disconnected';
    type: 'WebSocket' | 'SSE' | 'Polling Fallback';
    url: string;
    eventsReceived: number;
    latencyMs: number;
    isPassiveDiodeIsolated: boolean;
  };
  hardwareDiode: {
    model: string;
    state: 'Operational (TX Only)';
    physicalReturnPath: 'Mechanically Severed (0.000 bps RX)';
    lightSource: 'Optical Fiber Transmitter (850nm LED)';
    ingestProtocol: 'Raw PCAP / NetFlow v9 / IPFIX';
  };
}

export interface AnalyticsData {
  performance: {
    precision: number;
    recall: number;
    f1Score: number;
    prAuc: number;
    falsePositiveRate: number;
  };
  confidenceDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  latencyOverTime: {
    time: string;
    latency: number;
    p95: number;
  }[];
  throughputOverTime: {
    time: string;
    flowsPerSec: number;
  }[];
  threatTrends: {
    time: string;
    ddos: number;
    c2: number;
    dnsTunnel: number;
    malware: number;
    recon: number;
    exfiltration: number;
  }[];
}