import { SecurityAlert } from '../types';
import { mockLiveAlerts } from './mockData';

export type StreamSubscriber = (alert: SecurityAlert) => void;
export type TelemetrySubscriber = (telemetry: {
  flowsPerSec: number;
  totalFlows: number;
  threatsDetected: number;
  confidence: number;
  anomalyScore: number;
}) => void;

class RealTimeStreamService {
  private alertSubscribers: Set<StreamSubscriber> = new Set();
  private telemetrySubscribers: Set<TelemetrySubscriber> = new Set();
  private intervalId: any = null;
  private isPaused: boolean = false;
  private alertCounter: number = 8843;
  private currentFlowCount: number = 1284932;
  private currentThreatCount: number = 1247;
  private currentFlowsPerSec: number = 8742;
  private currentConfidence: number = 94.7;
  private intervalMs: number = 2200;

  constructor() {
    this.startStreaming();
  }

  public subscribeAlerts(cb: StreamSubscriber): () => void {
    this.alertSubscribers.add(cb);
    return () => this.alertSubscribers.delete(cb);
  }

  public subscribeTelemetry(cb: TelemetrySubscriber): () => void {
    this.telemetrySubscribers.add(cb);
    return () => this.telemetrySubscribers.delete(cb);
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public setIntervalMs(ms: number): void {
    this.intervalMs = ms;
    this.restartStreaming();
  }

  private restartStreaming(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.startStreaming();
  }

  private startStreaming(): void {
    this.intervalId = setInterval(() => {
      if (this.isPaused) return;

      // 1. Jitter telemetry numbers realistically
      const jitter = (Math.random() - 0.48) * 180;
      this.currentFlowsPerSec = Math.max(6800, Math.min(9900, Math.round(this.currentFlowsPerSec + jitter)));
      this.currentFlowCount += Math.round(this.currentFlowsPerSec * (this.intervalMs / 1000));
      
      const confJitter = (Math.random() - 0.5) * 0.4;
      this.currentConfidence = Math.max(91.5, Math.min(98.8, parseFloat((this.currentConfidence + confJitter).toFixed(1))));

      const anomalyScore = parseFloat((0.15 + Math.random() * 0.4).toFixed(3));

      // Emit telemetry update
      this.telemetrySubscribers.forEach(sub => sub({
        flowsPerSec: this.currentFlowsPerSec,
        totalFlows: this.currentFlowCount,
        threatsDetected: this.currentThreatCount,
        confidence: this.currentConfidence,
        anomalyScore
      }));

      // 2. Occasionally generate a realistic incoming alert (35% probability per tick)
      if (Math.random() < 0.35) {
        this.emitSimulatedAlert();
      }
    }, this.intervalMs);
  }

  public triggerBurst(threatType: 'DDoS' | 'DNS Tunneling / DGA' | 'C2 Beaconing'): void {
    this.emitSimulatedAlert(threatType, true);
  }

  private emitSimulatedAlert(forcedType?: string, isBurst = false): void {
    this.alertCounter++;
    this.currentThreatCount++;

    const templates = [
      {
        threatClass: 'DDoS' as const,
        severity: isBurst ? ('Critical' as const) : ('High' as const),
        confidence: 98.4,
        sourceIp: `192.168.10.${Math.floor(Math.random() * 180 + 10)}`,
        destinationIp: '10.20.4.18',
        sourcePort: Math.floor(Math.random() * 20000 + 40000),
        destinationPort: 443,
        protocol: 'TCP' as const,
        bytes: Math.floor(Math.random() * 6000000 + 1500000),
        packets: Math.floor(Math.random() * 90000 + 20000),
        durationMs: 3800,
        summary: 'Synchronous SYN packet avalanche observed across unidirectional optical diode.',
        ruleMatches: ['RULE-DDOS-SYN-BURST-01'],
        mlScore: 0.992,
        entropy: 1.15
      },
      {
        threatClass: 'C2 Beaconing' as const,
        severity: 'High' as const,
        confidence: 96.1,
        sourceIp: `10.14.22.${Math.floor(Math.random() * 200 + 10)}`,
        destinationIp: '185.220.101.9',
        sourcePort: Math.floor(Math.random() * 15000 + 45000),
        destinationPort: 8443,
        protocol: 'TCP' as const,
        bytes: 38400,
        packets: 280,
        durationMs: 3600000,
        summary: 'Periodic keepalive timing signature detected with < 8ms inter-arrival jitter.',
        ruleMatches: ['RULE-C2-PERIODIC-04'],
        mlScore: 0.965,
        entropy: 4.79
      },
      {
        threatClass: 'DNS Tunneling / DGA' as const,
        severity: 'High' as const,
        confidence: 95.3,
        sourceIp: `10.14.22.${Math.floor(Math.random() * 120 + 20)}`,
        destinationIp: '1.1.1.1',
        sourcePort: Math.floor(Math.random() * 10000 + 50000),
        destinationPort: 53,
        protocol: 'UDP' as const,
        bytes: 94200,
        packets: 480,
        durationMs: 14200,
        summary: 'High-entropy TXT records exceeding 52 chars observed during passive diode collection.',
        ruleMatches: ['RULE-DNS-ENTROPY-HIGH-02'],
        mlScore: 0.952,
        entropy: 4.92
      },
      {
        threatClass: 'Encrypted Malware' as const,
        severity: 'Medium' as const,
        confidence: 94.1,
        sourceIp: `192.168.1.${Math.floor(Math.random() * 80 + 10)}`,
        destinationIp: '198.51.100.77',
        sourcePort: 54120,
        destinationPort: 443,
        protocol: 'TCP' as const,
        bytes: 182000,
        packets: 210,
        durationMs: 7800,
        summary: 'JA3 signature match: Known remote access trojan cryptographic initialization sequence.',
        ruleMatches: ['RULE-JA3-BLACK-08'],
        mlScore: 0.938,
        entropy: 4.15
      },
      {
        threatClass: 'Reconnaissance' as const,
        severity: 'Medium' as const,
        confidence: 95.8,
        sourceIp: `10.20.100.${Math.floor(Math.random() * 50 + 5)}`,
        destinationIp: '10.20.4.0/24',
        sourcePort: 42190,
        destinationPort: 445,
        protocol: 'TCP' as const,
        bytes: 14200,
        packets: 390,
        durationMs: 2900,
        summary: 'Elevated fan-out ratio: Horizontal port scan targeting TCP/445 SMB.',
        ruleMatches: ['RULE-FANOUT-HORIZONTAL-03'],
        mlScore: 0.954,
        entropy: 2.18
      },
      {
        threatClass: 'Exfiltration' as const,
        severity: 'High' as const,
        confidence: 97.2,
        sourceIp: `10.14.22.${Math.floor(Math.random() * 20 + 2)}`,
        destinationIp: '91.240.118.45',
        sourcePort: 59100,
        destinationPort: 443,
        protocol: 'TCP' as const,
        bytes: 52140000,
        packets: 36200,
        durationMs: 160000,
        summary: 'Outbound byte volume asymmetry: 99.9% directional egress ratio observed.',
        ruleMatches: ['RULE-EXFIL-ASYM-01'],
        mlScore: 0.976,
        entropy: 4.93
      }
    ];

    let chosen = templates[Math.floor(Math.random() * templates.length)];
    if (forcedType) {
      const match = templates.find(t => t.threatClass === forcedType);
      if (match) chosen = match;
    }

    const flowHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const newAlert: SecurityAlert = {
      id: `ALT-${this.alertCounter}`,
      flowId: `FLW-${flowHex}`,
      timestamp: 'Just now',
      threatClass: chosen.threatClass,
      severity: chosen.severity,
      confidence: chosen.confidence,
      sourceIp: chosen.sourceIp,
      destinationIp: chosen.destinationIp,
      sourcePort: chosen.sourcePort,
      destinationPort: chosen.destinationPort,
      protocol: chosen.protocol,
      byteCount: chosen.bytes,
      packetCount: chosen.packets,
      durationMs: chosen.durationMs,
      summary: chosen.summary,
      ruleMatches: chosen.ruleMatches,
      mlScore: chosen.mlScore,
      entropy: chosen.entropy,
      evidence: [
        {
          featureName: 'Primary Behavioral Outlier',
          observedValue: `${chosen.entropy} bits / ${chosen.bytes.toLocaleString()} bytes`,
          baselineValue: 'Normal Baseline (Ensemble)',
          anomalyScore: chosen.mlScore,
          importance: 48,
          description: 'Unidirectional telemetry metadata scored significantly outside historical density bounds.'
        },
        {
          featureName: 'Flow Directionality',
          observedValue: '100% Ingress via Optical Diode',
          baselineValue: 'Passive Diode Channel',
          anomalyScore: 0.91,
          importance: 32,
          description: 'Verified passive unidirectional observation with zero packet injection or response path.'
        }
      ],
      timeline: [
        { stage: 'Flow Observed', timestamp: new Date().toISOString().substring(11, 23), detail: 'Optical sensor ingested raw flow frame', completed: true },
        { stage: 'Features Extracted', timestamp: new Date().toISOString().substring(11, 23), detail: 'Extracted entropy, timing, and rate features', completed: true },
        { stage: 'Detection Performed', timestamp: new Date().toISOString().substring(11, 23), detail: `Ensemble model scored ${chosen.mlScore}`, completed: true },
        { stage: 'Threat Classified', timestamp: new Date().toISOString().substring(11, 23), detail: `Identified as ${chosen.threatClass}`, completed: true },
        { stage: 'Alert Generated', timestamp: new Date().toISOString().substring(11, 23), detail: 'Pushed to SOC threat feed (Read-Only)', completed: true }
      ]
    };

    this.alertSubscribers.forEach(sub => sub(newAlert));
  }
}

export const streamService = new RealTimeStreamService();
