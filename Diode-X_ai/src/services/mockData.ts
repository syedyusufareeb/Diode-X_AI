import { 
  DashboardStats, 
  ThreatFamilyMetric, 
  SecurityAlert, 
  NetworkFlow, 
  SystemHealthData, 
  AnalyticsData 
} from '../types';

export const initialDashboardStats: DashboardStats = {
  totalFlows: 1284932,
  totalFlowsDelta: '+8.4% from previous period',
  threatsDetected: 1247,
  threatsDetectedDelta: '+3.2% from previous hour',
  criticalAlerts: 23,
  criticalAlertsDelta: '-2 from peak window',
  detectionConfidence: 94.7,
  avgLatencyMs: 142,
  throughputFlowsPerSec: 8742,
  isMonitoringActive: true,
  activeDataDiodeTxRateMbps: 982.4,
};

export const mockThreatFamilies: ThreatFamilyMetric[] = [
  {
    id: 'ddos',
    name: 'DDoS',
    description: 'High-volume SYN/UDP floods, volumetric reflection, and IP spoofing patterns across unidirectional ingest.',
    count: 412,
    percentage: 33.0,
    avgConfidence: 98.2,
    trend: 'up',
    trendValue: '+12.4%',
    severityDistribution: { critical: 14, high: 86, medium: 210, low: 102 },
    keyIndicators: ['High SYN-ACK deficit', 'Entropy collapse in source port distribution', 'Target rate > 250k pps'],
    recentDetectionSample: 'TCP SYN flood targeting sub-service cluster 10.20.4.0/24'
  },
  {
    id: 'c2',
    name: 'C2 Beaconing',
    description: 'Persistent low-and-slow periodic callbacks, jitter analysis, and deterministic inter-arrival timing.',
    count: 289,
    percentage: 23.2,
    avgConfidence: 96.4,
    trend: 'down',
    trendValue: '-4.1%',
    severityDistribution: { critical: 6, high: 94, medium: 142, low: 47 },
    keyIndicators: ['Inter-arrival variance < 12ms', 'Repeated TLS SNI handshake', 'Constant payload byte footprint'],
    recentDetectionSample: 'Periodic heartbeat to domain relay node every 60.02s'
  },
  {
    id: 'dns-tunnel',
    name: 'DNS Tunneling / DGA',
    description: 'High Shannon entropy subdomains, abnormal character n-grams, and encoded data exfiltration over TX port 53.',
    count: 215,
    percentage: 17.2,
    avgConfidence: 94.8,
    trend: 'up',
    trendValue: '+8.7%',
    severityDistribution: { critical: 2, high: 48, medium: 110, low: 55 },
    keyIndicators: ['Query entropy > 4.65 bits', 'Subdomain length > 54 chars', 'Base32/Base64 chunk sequences'],
    recentDetectionSample: 'Encoded hex query burst: q8x92m.tunnel.infra-core.net'
  },
  {
    id: 'encrypted-malware',
    name: 'Encrypted Malware',
    description: 'JA3/JA3S/JA4 cryptographic fingerprint anomaly, TLS 1.3 extension anomalies, and timing-size bursts.',
    count: 164,
    percentage: 13.2,
    avgConfidence: 93.5,
    trend: 'stable',
    trendValue: '+0.5%',
    severityDistribution: { critical: 1, high: 42, medium: 88, low: 33 },
    keyIndicators: ['Known Cobalt Strike JA3 hash', 'Abnormal cipher suite order', 'TLS SNI vs IP mismatch'],
    recentDetectionSample: 'JA3: e7d705a3286e19ea42f587b344ee6865 (AsyncRAT beacon pattern)'
  },
  {
    id: 'recon',
    name: 'Reconnaissance',
    description: 'Mass horizontal fan-out, sequential port scanning, and automated service enumeration without replies.',
    count: 112,
    percentage: 9.0,
    avgConfidence: 95.1,
    trend: 'down',
    trendValue: '-7.2%',
    severityDistribution: { critical: 0, high: 18, medium: 64, low: 30 },
    keyIndicators: ['Fan-out ratio > 45:1', 'TCP NULL / FIN / SYN probes', 'Uniform 40-byte packet lengths'],
    recentDetectionSample: 'Rapid scan sweep across ports 445, 3389, and 8080 from isolated subnet'
  },
  {
    id: 'exfiltration',
    name: 'Exfiltration',
    description: 'Abnormal unidirectional outbound byte ratios, uncharacteristic sustained bursts, and off-hour byte spikes.',
    count: 55,
    percentage: 4.4,
    avgConfidence: 97.0,
    trend: 'up',
    trendValue: '+15.8%',
    severityDistribution: { critical: 0, high: 22, medium: 26, low: 7 },
    keyIndicators: ['Outbound byte ratio > 99.8%', 'Flow duration > 3600s', 'Off-peak transmission anomaly'],
    recentDetectionSample: 'Sustained 4.8 GB outbound chunk stream over non-standard TLS port 8443'
  }
];

export const mockLiveAlerts: SecurityAlert[] = [
  {
    id: 'ALT-8842',
    flowId: 'FLW-8A42C1',
    timestamp: 'Just now',
    threatClass: 'DDoS',
    severity: 'Critical',
    confidence: 98.2,
    sourceIp: '192.168.10.42',
    destinationIp: '10.20.4.18',
    sourcePort: 54102,
    destinationPort: 443,
    protocol: 'TCP',
    byteCount: 8429012,
    packetCount: 124800,
    durationMs: 4200,
    summary: 'Massive SYN flood packet burst with zero ACK completion observed over unidirectional ingest.',
    ruleMatches: ['RULE-DDOS-SYN-BURST-01', 'RULE-ENTROPY-COLLAPSE-09'],
    mlScore: 0.994,
    entropy: 1.12,
    evidence: [
      {
        featureName: 'Packet Rate (pps)',
        observedValue: '29,714 pps',
        baselineValue: '120 pps',
        anomalyScore: 0.98,
        importance: 42,
        description: 'Packet arrival velocity exceeds 247x baseline normal threshold.'
      },
      {
        featureName: 'SYN-to-FIN Ratio',
        observedValue: '100:0',
        baselineValue: '1:1',
        anomalyScore: 0.99,
        importance: 31,
        description: 'Complete absence of bidirectional teardown (strictly passive observation).'
      },
      {
        featureName: 'Payload Size Variance',
        observedValue: '0.00 bytes',
        baselineValue: '482.4 bytes',
        anomalyScore: 0.94,
        importance: 18,
        description: 'Deterministic 64-byte payload padding typical of automated attack script.'
      },
      {
        featureName: 'Fan-in Density',
        observedValue: '84 IPs/sec',
        baselineValue: '1.2 IPs/sec',
        anomalyScore: 0.89,
        importance: 9,
        description: 'Concentrated inbound flood directed at single target VIP.'
      }
    ],
    timeline: [
      { stage: 'Flow Observed', timestamp: '19:42:15.102', detail: 'Raw NetFlow v9 telemetry ingested across optical diode', completed: true },
      { stage: 'Features Extracted', timestamp: '19:42:15.140', detail: 'Calculated timing delta, Shannon entropy (1.12), and SYN deficit', completed: true },
      { stage: 'Detection Performed', timestamp: '19:42:15.195', detail: 'Isolation Forest anomaly score (0.994) + SYN flood heuristic rule fired', completed: true },
      { stage: 'Threat Classified', timestamp: '19:42:15.220', detail: 'Classified as DDoS SYN Flood with 98.2% confidence', completed: true },
      { stage: 'Alert Generated', timestamp: '19:42:15.244', detail: 'Dispatched to SOC Threat Feed API (Zero active response executed)', completed: true }
    ]
  },
  {
    id: 'ALT-8841',
    flowId: 'FLW-92AC81',
    timestamp: '18s ago',
    threatClass: 'C2 Beaconing',
    severity: 'High',
    confidence: 96.4,
    sourceIp: '10.14.22.105',
    destinationIp: '185.220.101.5',
    sourcePort: 49812,
    destinationPort: 8443,
    protocol: 'TCP',
    byteCount: 42180,
    packetCount: 312,
    durationMs: 3600000,
    summary: 'Periodic TLS beaconing with low inter-arrival jitter (9.8ms) directed at suspicious external IP.',
    ruleMatches: ['RULE-C2-PERIODIC-04', 'RULE-JA3-ANOMALY-11'],
    mlScore: 0.962,
    entropy: 4.82,
    ja3Fingerprint: '6734f37431670b3ab4292b8f60f29984',
    evidence: [
      {
        featureName: 'Inter-arrival Regularity',
        observedValue: '60.02s ± 9.8ms',
        baselineValue: '14.2s ± 4200ms',
        anomalyScore: 0.96,
        importance: 38,
        description: 'Extremely rigid periodicity matching software timer loop.'
      },
      {
        featureName: 'Payload Size Consistency',
        observedValue: '135 ± 2 bytes',
        baselineValue: '1240 ± 890 bytes',
        anomalyScore: 0.92,
        importance: 26,
        description: 'Consistent small packet payload size matching encrypted keepalive.'
      },
      {
        featureName: 'JA3 Fingerprint Hash',
        observedValue: '6734f374...9984',
        baselineValue: 'Browser Client Hello',
        anomalyScore: 0.88,
        importance: 22,
        description: 'Matches known headless C2 agent fingerprint signature.'
      },
      {
        featureName: 'Flow Duration',
        observedValue: '60.0 mins',
        baselineValue: '4.2 mins',
        anomalyScore: 0.84,
        importance: 14,
        description: 'Persistent low-volume connection maintained over extended period.'
      }
    ],
    timeline: [
      { stage: 'Flow Observed', timestamp: '19:41:58.410', detail: 'Unidirectional NetFlow record parsed by Stream Processor', completed: true },
      { stage: 'Features Extracted', timestamp: '19:41:58.435', detail: 'Fast Fourier Transform of inter-arrival timing generated periodicity peak', completed: true },
      { stage: 'Detection Performed', timestamp: '19:41:58.502', detail: 'LightGBM model scored 0.962 for beaconing threat profile', completed: true },
      { stage: 'Threat Classified', timestamp: '19:41:58.528', detail: 'C2 Beaconing identified (High Severity)', completed: true },
      { stage: 'Alert Generated', timestamp: '19:41:58.550', detail: 'Standardized security event fused into SOC dashboard store', completed: true }
    ]
  },
  {
    id: 'ALT-8840',
    flowId: 'FLW-71B33D',
    timestamp: '42s ago',
    threatClass: 'DNS Tunneling / DGA',
    severity: 'High',
    confidence: 94.8,
    sourceIp: '10.14.22.88',
    destinationIp: '1.1.1.1',
    sourcePort: 61004,
    destinationPort: 53,
    protocol: 'UDP',
    byteCount: 89400,
    packetCount: 420,
    durationMs: 18400,
    summary: 'High-entropy DNS TXT and NULL queries with Base32 encoded payload chunks.',
    ruleMatches: ['RULE-DNS-ENTROPY-HIGH-02', 'RULE-DGA-NGRAM-05'],
    mlScore: 0.941,
    entropy: 4.88,
    evidence: [
      {
        featureName: 'Shannon Query Entropy',
        observedValue: '4.88 bits/char',
        baselineValue: '2.14 bits/char',
        anomalyScore: 0.95,
        importance: 44,
        description: 'Subdomain character distribution exhibits cryptographic or compression entropy.'
      },
      {
        featureName: 'Subdomain Length',
        observedValue: '58 characters',
        baselineValue: '14 characters',
        anomalyScore: 0.91,
        importance: 28,
        description: 'Unusually long FQDN sub-labels structured for chunked data transport.'
      },
      {
        featureName: 'Query Type Distribution',
        observedValue: 'TXT / NULL (94%)',
        baselineValue: 'A / AAAA (91%)',
        anomalyScore: 0.87,
        importance: 18,
        description: 'Heavy utilization of non-standard record types suitable for data exfiltration.'
      },
      {
        featureName: 'Query Velocity',
        observedValue: '22.8 queries/s',
        baselineValue: '0.8 queries/s',
        anomalyScore: 0.82,
        importance: 10,
        description: 'High frequency DNS resolver query burst.'
      }
    ],
    timeline: [
      { stage: 'Flow Observed', timestamp: '19:41:34.200', detail: 'Passive IPFIX flow with DNS metadata received over diode', completed: true },
      { stage: 'Features Extracted', timestamp: '19:41:34.240', detail: 'N-gram randomness score and character Shannon entropy computed', completed: true },
      { stage: 'Detection Performed', timestamp: '19:41:34.290', detail: 'Supervised Random Forest detected DNS Tunneling signature', completed: true },
      { stage: 'Threat Classified', timestamp: '19:41:34.310', detail: 'DNS Tunneling / DGA classified with 94.8% confidence', completed: true },
      { stage: 'Alert Generated', timestamp: '19:41:34.330', detail: 'Alert emitted for SOC passive investigation', completed: true }
    ]
  },
  {
    id: 'ALT-8839',
    flowId: 'FLW-66DF19',
    timestamp: '1m ago',
    threatClass: 'Encrypted Malware',
    severity: 'Medium',
    confidence: 93.5,
    sourceIp: '192.168.1.18',
    destinationIp: '198.51.100.44',
    sourcePort: 51240,
    destinationPort: 443,
    protocol: 'TCP',
    byteCount: 154000,
    packetCount: 180,
    durationMs: 8200,
    summary: 'Encrypted TLS 1.3 flow matching malicious JA3 fingerprint hash with anomalous packet length progression.',
    ruleMatches: ['RULE-JA3-BLACK-08', 'RULE-SPLT-BURST-03'],
    mlScore: 0.932,
    entropy: 4.12,
    ja3Fingerprint: 'e7d705a3286e19ea42f587b344ee6865',
    ja4Fingerprint: 't13d1516h2_8daaf6152771_b07c827c4b78',
    evidence: [
      {
        featureName: 'JA3 Fingerprint Hash',
        observedValue: 'e7d705a3286e19ea42f587b344ee6865',
        baselineValue: 'Legitimate OS Client',
        anomalyScore: 0.97,
        importance: 46,
        description: 'Corresponds to known threat actor payload loader TLS signature.'
      },
      {
        featureName: 'Packet Length Sequence (SPLT)',
        observedValue: '[517, 1420, 1420, 84]',
        baselineValue: '[Browser Standard]',
        anomalyScore: 0.89,
        importance: 30,
        description: 'Size and Packet Length Sequence profile diverges sharply from legitimate browser traffic.'
      },
      {
        featureName: 'TLS Extension Order',
        observedValue: 'Non-RFC Standard',
        baselineValue: 'Standard IETF',
        anomalyScore: 0.82,
        importance: 24,
        description: 'Custom cryptographic handshake implementation indicating malware loader.'
      }
    ],
    timeline: [
      { stage: 'Flow Observed', timestamp: '19:41:12.110', detail: 'Unidirectional PCAP header extracted at ingest boundary', completed: true },
      { stage: 'Features Extracted', timestamp: '19:41:12.145', detail: 'Extracted JA3/JA4 cryptographic fingerprints and SPLT vectors', completed: true },
      { stage: 'Detection Performed', timestamp: '19:41:12.210', detail: 'Deep neural network flow classifier scored 0.932', completed: true },
      { stage: 'Threat Classified', timestamp: '19:41:12.235', detail: 'Encrypted Malware detected (Medium Severity)', completed: true },
      { stage: 'Alert Generated', timestamp: '19:41:12.260', detail: 'Enriched metadata attached to flow record in SOC store', completed: true }
    ]
  },
  {
    id: 'ALT-8838',
    flowId: 'FLW-5501A2',
    timestamp: '2m ago',
    threatClass: 'Reconnaissance',
    severity: 'Medium',
    confidence: 95.1,
    sourceIp: '10.20.100.7',
    destinationIp: '10.20.4.0/24',
    sourcePort: 43100,
    destinationPort: 445,
    protocol: 'TCP',
    byteCount: 18400,
    packetCount: 460,
    durationMs: 3100,
    summary: 'Mass horizontal fan-out probe targeting SMB and RDP services across 240 endpoints.',
    ruleMatches: ['RULE-FANOUT-HORIZONTAL-03'],
    mlScore: 0.951,
    entropy: 2.10,
    evidence: [
      {
        featureName: 'Fan-Out Ratio',
        observedValue: '240 destinations',
        baselineValue: '2.4 destinations',
        anomalyScore: 0.97,
        importance: 52,
        description: 'Single host initiating connections to 240 distinct hosts within 3.1 seconds.'
      },
      {
        featureName: 'TCP Flag Profile',
        observedValue: 'SYN Only (No ACK)',
        baselineValue: 'SYN-ACK-DATA',
        anomalyScore: 0.92,
        importance: 32,
        description: 'Unilateral connection attempts characteristic of stealth SYN scanning.'
      },
      {
        featureName: 'Port Targeting',
        observedValue: 'Ports 445, 3389, 8080',
        baselineValue: 'Random Ephemeral',
        anomalyScore: 0.85,
        importance: 16,
        description: 'Selective reconnaissance of administrative services.'
      }
    ],
    timeline: [
      { stage: 'Flow Observed', timestamp: '19:40:15.000', detail: 'Passive telemetry flow records aggregated over 3-second window', completed: true },
      { stage: 'Features Extracted', timestamp: '19:40:15.040', detail: 'Fan-out graph node degrees and entropy of destination IPs computed', completed: true },
      { stage: 'Detection Performed', timestamp: '19:40:15.090', detail: 'Graph anomaly detector and rule engine triggered', completed: true },
      { stage: 'Threat Classified', timestamp: '19:40:15.110', detail: 'Reconnaissance / Network Sweep identified', completed: true },
      { stage: 'Alert Generated', timestamp: '19:40:15.130', detail: 'Alert indexed with affected subnet scope', completed: true }
    ]
  },
  {
    id: 'ALT-8837',
    flowId: 'FLW-44919E',
    timestamp: '3m ago',
    threatClass: 'Exfiltration',
    severity: 'High',
    confidence: 97.0,
    sourceIp: '10.14.22.4',
    destinationIp: '91.240.118.12',
    sourcePort: 58900,
    destinationPort: 443,
    protocol: 'TCP',
    byteCount: 48910240,
    packetCount: 34100,
    durationMs: 142000,
    summary: 'High outbound-to-inbound byte asymmetry (99.9% outbound) with continuous maximum packet sizes.',
    ruleMatches: ['RULE-EXFIL-ASYM-01', 'RULE-BYTE-RATIO-07'],
    mlScore: 0.974,
    entropy: 4.91,
    evidence: [
      {
        featureName: 'Outbound Byte Ratio',
        observedValue: '99.92%',
        baselineValue: '48.50%',
        anomalyScore: 0.98,
        importance: 48,
        description: 'Massive unidirectional volume outbound with zero reciprocal response.'
      },
      {
        featureName: 'Mean Packet Size',
        observedValue: '1,434 bytes (near MTU)',
        baselineValue: '340 bytes',
        anomalyScore: 0.94,
        importance: 32,
        description: 'Full-frame data packing sustained over 142 seconds.'
      },
      {
        featureName: 'Payload Shannon Entropy',
        observedValue: '4.91 bits/char',
        baselineValue: '3.10 bits/char',
        anomalyScore: 0.90,
        importance: 20,
        description: 'High entropy indicates pre-encrypted or compressed archive transmission.'
      }
    ],
    timeline: [
      { stage: 'Flow Observed', timestamp: '19:39:10.020', detail: 'Long-running flow session telemetry ingested via NetFlow v9', completed: true },
      { stage: 'Features Extracted', timestamp: '19:39:10.060', detail: 'Calculated byte directional ratio, MTU packing efficiency, and duration', completed: true },
      { stage: 'Detection Performed', timestamp: '19:39:10.120', detail: 'Isolation Forest flagged high outbound volume outlier (0.974 score)', completed: true },
      { stage: 'Threat Classified', timestamp: '19:39:10.145', detail: 'Data Exfiltration classified with 97.0% confidence', completed: true },
      { stage: 'Alert Generated', timestamp: '19:39:10.168', detail: 'High-severity incident staged for forensic evidence export', completed: true }
    ]
  },
  {
    id: 'ALT-8836',
    flowId: 'FLW-33128F',
    timestamp: '5m ago',
    threatClass: 'DDoS',
    severity: 'High',
    confidence: 97.5,
    sourceIp: '172.16.8.99',
    destinationIp: '10.20.4.18',
    sourcePort: 123,
    destinationPort: 58310,
    protocol: 'UDP',
    byteCount: 14209100,
    packetCount: 189000,
    durationMs: 6800,
    summary: 'NTP reflection amplification attack directing 468-byte monlist responses to internal host.',
    ruleMatches: ['RULE-DDOS-NTP-AMP-03'],
    mlScore: 0.978,
    entropy: 1.84,
    evidence: [
      {
        featureName: 'Amplification Factor',
        observedValue: '48.2x multiplier',
        baselineValue: '1.0x',
        anomalyScore: 0.98,
        importance: 45,
        description: 'UDP packet reflection with large response size ratio.'
      },
      {
        featureName: 'Packet Rate',
        observedValue: '27,794 pps',
        baselineValue: '85 pps',
        anomalyScore: 0.97,
        importance: 35,
        description: 'Concentrated UDP burst overwhelming ingress buffers.'
      },
      {
        featureName: 'Port 123 Volume',
        observedValue: '14.2 MB / 6.8s',
        baselineValue: '12 KB / hr',
        anomalyScore: 0.91,
        importance: 20,
        description: 'Massive anomaly in standard time synchronization service traffic.'
      }
    ],
    timeline: [
      { stage: 'Flow Observed', timestamp: '19:37:02.100', detail: 'UDP flow telemetry captured by sFlow collector', completed: true },
      { stage: 'Features Extracted', timestamp: '19:37:02.130', detail: 'Protocol distribution and amplification ratio computed', completed: true },
      { stage: 'Detection Performed', timestamp: '19:37:02.180', detail: 'DDoS amplification model triggered with 0.978 anomaly score', completed: true },
      { stage: 'Threat Classified', timestamp: '19:37:02.200', detail: 'DDoS (NTP Amplification) classified', completed: true },
      { stage: 'Alert Generated', timestamp: '19:37:02.220', detail: 'Alert emitted with target host isolation metrics', completed: true }
    ]
  },
  {
    id: 'ALT-8835',
    flowId: 'FLW-22910B',
    timestamp: '7m ago',
    threatClass: 'C2 Beaconing',
    severity: 'Medium',
    confidence: 92.1,
    sourceIp: '10.14.22.14',
    destinationIp: '194.26.29.112',
    sourcePort: 52140,
    destinationPort: 443,
    protocol: 'TCP',
    byteCount: 28400,
    packetCount: 190,
    durationMs: 1800000,
    summary: 'Low-frequency HTTPS polling observed on exact 120-second interval with uniform TLS ClientHello.',
    ruleMatches: ['RULE-C2-PERIODIC-04'],
    mlScore: 0.919,
    entropy: 4.18,
    ja3Fingerprint: '771f251c5f359194ec74a9d7744aa52a',
    evidence: [
      {
        featureName: 'Beacon Interval',
        observedValue: '120.0s ± 18ms',
        baselineValue: 'Dynamic Web Traffic',
        anomalyScore: 0.94,
        importance: 42,
        description: 'Strict 2-minute cadence detected over 30-minute observation window.'
      },
      {
        featureName: 'Payload Size Regularity',
        observedValue: '148 bytes',
        baselineValue: 'Variable',
        anomalyScore: 0.88,
        importance: 32,
        description: 'Standardized encrypted payload size with minimal padding variation.'
      },
      {
        featureName: 'Domain Entropy',
        observedValue: '3.82 bits',
        baselineValue: '2.40 bits',
        anomalyScore: 0.81,
        importance: 26,
        description: 'SNI domain name exhibits algorithmic generation characteristics.'
      }
    ],
    timeline: [
      { stage: 'Flow Observed', timestamp: '19:35:10.100', detail: 'Unidirectional session metadata ingested over diode', completed: true },
      { stage: 'Features Extracted', timestamp: '19:35:10.135', detail: 'Extracted inter-arrival time intervals and SNI entropy', completed: true },
      { stage: 'Detection Performed', timestamp: '19:35:10.190', detail: 'Beaconing classifier triggered', completed: true },
      { stage: 'Threat Classified', timestamp: '19:35:10.210', detail: 'C2 Beaconing identified', completed: true },
      { stage: 'Alert Generated', timestamp: '19:35:10.230', detail: 'Recorded in SOC incident queue', completed: true }
    ]
  }
];

export const mockNetworkFlows: NetworkFlow[] = [
  {
    id: 'FLW-8A42C1',
    timestamp: '2026-09-11 19:42:15',
    sourceIp: '192.168.10.42',
    destinationIp: '10.20.4.18',
    sourcePort: 54102,
    destinationPort: 443,
    protocol: 'TCP',
    bytes: 8429012,
    packets: 124800,
    duration: 4.2,
    threatScore: 98,
    classification: 'DDoS',
    confidence: 98.2,
    status: 'Flagged',
    entropy: 1.12,
    fanOutRatio: 1.0,
    interArrivalJitterMs: 0.04
  },
  {
    id: 'FLW-92AC81',
    timestamp: '2026-09-11 19:41:58',
    sourceIp: '10.14.22.105',
    destinationIp: '185.220.101.5',
    sourcePort: 49812,
    destinationPort: 8443,
    protocol: 'TCP',
    bytes: 42180,
    packets: 312,
    duration: 3600.0,
    threatScore: 96,
    classification: 'C2 Beaconing',
    confidence: 96.4,
    status: 'Flagged',
    entropy: 4.82,
    interArrivalJitterMs: 9.8,
    ja3: '6734f37431670b3ab4292b8f60f29984'
  },
  {
    id: 'FLW-71B33D',
    timestamp: '2026-09-11 19:41:34',
    sourceIp: '10.14.22.88',
    destinationIp: '1.1.1.1',
    sourcePort: 61004,
    destinationPort: 53,
    protocol: 'UDP',
    bytes: 89400,
    packets: 420,
    duration: 18.4,
    threatScore: 94,
    classification: 'DNS Tunneling / DGA',
    confidence: 94.8,
    status: 'Flagged',
    entropy: 4.88,
    fanOutRatio: 1.2
  },
  {
    id: 'FLW-66DF19',
    timestamp: '2026-09-11 19:41:12',
    sourceIp: '192.168.1.18',
    destinationIp: '198.51.100.44',
    sourcePort: 51240,
    destinationPort: 443,
    protocol: 'TCP',
    bytes: 154000,
    packets: 180,
    duration: 8.2,
    threatScore: 93,
    classification: 'Encrypted Malware',
    confidence: 93.5,
    status: 'Flagged',
    entropy: 4.12,
    ja3: 'e7d705a3286e19ea42f587b344ee6865'
  },
  {
    id: 'FLW-5501A2',
    timestamp: '2026-09-11 19:40:15',
    sourceIp: '10.20.100.7',
    destinationIp: '10.20.4.0',
    sourcePort: 43100,
    destinationPort: 445,
    protocol: 'TCP',
    bytes: 18400,
    packets: 460,
    duration: 3.1,
    threatScore: 95,
    classification: 'Reconnaissance',
    confidence: 95.1,
    status: 'Flagged',
    entropy: 2.10,
    fanOutRatio: 45.2
  },
  {
    id: 'FLW-44919E',
    timestamp: '2026-09-11 19:39:10',
    sourceIp: '10.14.22.4',
    destinationIp: '91.240.118.12',
    sourcePort: 58900,
    destinationPort: 443,
    protocol: 'TCP',
    bytes: 48910240,
    packets: 34100,
    duration: 142.0,
    threatScore: 97,
    classification: 'Exfiltration',
    confidence: 97.0,
    status: 'Flagged',
    entropy: 4.91
  },
  {
    id: 'FLW-33128F',
    timestamp: '2026-09-11 19:37:02',
    sourceIp: '172.16.8.99',
    destinationIp: '10.20.4.18',
    sourcePort: 123,
    destinationPort: 58310,
    protocol: 'UDP',
    bytes: 14209100,
    packets: 189000,
    duration: 6.8,
    threatScore: 97,
    classification: 'DDoS',
    confidence: 97.5,
    status: 'Flagged',
    entropy: 1.84,
    fanOutRatio: 1.0
  },
  {
    id: 'FLW-22910B',
    timestamp: '2026-09-11 19:35:10',
    sourceIp: '10.14.22.14',
    destinationIp: '194.26.29.112',
    sourcePort: 52140,
    destinationPort: 443,
    protocol: 'TCP',
    bytes: 28400,
    packets: 190,
    duration: 1800.0,
    threatScore: 92,
    classification: 'C2 Beaconing',
    confidence: 92.1,
    status: 'Flagged',
    entropy: 4.18,
    interArrivalJitterMs: 18.2,
    ja3: '771f251c5f359194ec74a9d7744aa52a'
  },
  {
    id: 'FLW-10045A',
    timestamp: '2026-09-11 19:34:40',
    sourceIp: '10.10.1.25',
    destinationIp: '142.250.190.46',
    sourcePort: 49152,
    destinationPort: 443,
    protocol: 'QUIC',
    bytes: 124900,
    packets: 142,
    duration: 12.4,
    threatScore: 3,
    classification: 'Benign',
    confidence: 99.4,
    status: 'Baseline',
    entropy: 3.89
  },
  {
    id: 'FLW-10046B',
    timestamp: '2026-09-11 19:34:38',
    sourceIp: '10.10.2.80',
    destinationIp: '10.20.4.1',
    sourcePort: 55432,
    destinationPort: 53,
    protocol: 'UDP',
    bytes: 3840,
    packets: 24,
    duration: 0.12,
    threatScore: 2,
    classification: 'Benign',
    confidence: 99.8,
    status: 'Baseline',
    entropy: 2.10
  },
  {
    id: 'FLW-10047C',
    timestamp: '2026-09-11 19:34:25',
    sourceIp: '192.168.10.15',
    destinationIp: '192.168.10.1',
    sourcePort: 62100,
    destinationPort: 80,
    protocol: 'TCP',
    bytes: 18450,
    packets: 32,
    duration: 0.45,
    threatScore: 1,
    classification: 'Benign',
    confidence: 99.9,
    status: 'Baseline',
    entropy: 1.95
  },
  {
    id: 'FLW-10048D',
    timestamp: '2026-09-11 19:34:10',
    sourceIp: '10.10.3.110',
    destinationIp: '10.20.10.5',
    sourcePort: 51090,
    destinationPort: 443,
    protocol: 'TCP',
    bytes: 849000,
    packets: 840,
    duration: 45.2,
    threatScore: 4,
    classification: 'Benign',
    confidence: 99.2,
    status: 'Baseline',
    entropy: 3.75
  },
  {
    id: 'FLW-10049E',
    timestamp: '2026-09-11 19:33:55',
    sourceIp: '10.14.22.99',
    destinationIp: '8.8.8.8',
    sourcePort: 58210,
    destinationPort: 53,
    protocol: 'UDP',
    bytes: 4200,
    packets: 28,
    duration: 0.18,
    threatScore: 5,
    classification: 'Benign',
    confidence: 98.9,
    status: 'Baseline',
    entropy: 2.22
  },
  {
    id: 'FLW-10050F',
    timestamp: '2026-09-11 19:33:40',
    sourceIp: '192.168.1.100',
    destinationIp: '10.20.4.50',
    sourcePort: 53200,
    destinationPort: 443,
    protocol: 'TCP',
    bytes: 2450000,
    packets: 1980,
    duration: 78.4,
    threatScore: 2,
    classification: 'Benign',
    confidence: 99.6,
    status: 'Baseline',
    entropy: 3.82
  }
];

export const mockSystemHealth: SystemHealthData = {
  apiGateway: {
    name: 'API Gateway',
    role: 'Decoupled REST & Streaming Interface for SOC',
    status: 'Healthy',
    latencyMs: 14,
    throughput: '8,742 flows/sec',
    processedCount: '1,284,932 flows',
    uptime: '99.99%',
    lastHeartbeat: '300ms ago',
    details: 'Endpoints responding within SLA; zero auth dropouts.'
  },
  streamProcessor: {
    name: 'Stream Parser & Ingest',
    role: 'Zero-Copy Ring Buffer Unidirectional Ingestion',
    status: 'Healthy',
    latencyMs: 8,
    throughput: '982.4 Mbps',
    processedCount: '14.8 GB / hr',
    uptime: '100%',
    lastHeartbeat: '100ms ago',
    details: 'Unidirectional optical NIC receiver operating with 0 dropped frames.'
  },
  featureEngine: {
    name: 'Feature Engine',
    role: 'Timing, Entropy, DNS, JA3 & Behavioral Extraction',
    status: 'Healthy',
    latencyMs: 42,
    throughput: '42 features/flow',
    processedCount: '53.9M feature vectors',
    uptime: '99.98%',
    lastHeartbeat: '250ms ago',
    details: 'Shannon entropy & FFT periodicity engines running at optimal concurrency.'
  },
  detectionEngine: {
    name: 'Detection Engine',
    role: 'Hybrid Rule-Based, Supervised ML & Isolation Forest',
    status: 'Healthy',
    latencyMs: 78,
    throughput: '8,742 inferences/sec',
    processedCount: '1,284,932 evaluations',
    uptime: '99.95%',
    lastHeartbeat: '200ms ago',
    details: 'LightGBM model v2.4 + Anomaly Ensemble operating at 94.7% avg confidence.'
  },
  alertFusion: {
    name: 'Alert Fusion & Deduplication',
    role: 'Context Correlation & Threat Fingerprint Deduplication',
    status: 'Healthy',
    latencyMs: 12,
    throughput: '4.2 alerts/sec',
    processedCount: '1,247 alerts generated',
    uptime: '100%',
    lastHeartbeat: '500ms ago',
    details: 'Zero pipeline queue backlog; explainable feature weights attached.'
  },
  streamingConnection: {
    status: 'Connected',
    type: 'WebSocket',
    url: 'ws://diode-x.local/ws/alerts',
    eventsReceived: 18420,
    latencyMs: 18,
    isPassiveDiodeIsolated: true
  },
  hardwareDiode: {
    model: 'Diode-X HW-10G (Galvanically Isolated Optical Diode)',
    state: 'Operational (TX Only)',
    physicalReturnPath: 'Mechanically Severed (0.000 bps RX)',
    lightSource: 'Optical Fiber Transmitter (850nm LED)',
    ingestProtocol: 'Raw PCAP / NetFlow v9 / IPFIX'
  }
};

export const mockAnalyticsData: AnalyticsData = {
  performance: {
    precision: 98.2,
    recall: 96.7,
    f1Score: 97.4,
    prAuc: 0.984,
    falsePositiveRate: 0.12
  },
  confidenceDistribution: [
    { range: '95% - 100%', count: 684, percentage: 54.8 },
    { range: '90% - 94%', count: 372, percentage: 29.8 },
    { range: '85% - 89%', count: 128, percentage: 10.3 },
    { range: '80% - 84%', count: 48, percentage: 3.9 },
    { range: '< 80%', count: 15, percentage: 1.2 }
  ],
  latencyOverTime: [
    { time: '19:00', latency: 138, p95: 162 },
    { time: '19:10', latency: 142, p95: 168 },
    { time: '19:20', latency: 140, p95: 164 },
    { time: '19:30', latency: 148, p95: 174 },
    { time: '19:40', latency: 142, p95: 166 }
  ],
  throughputOverTime: [
    { time: '19:00', flowsPerSec: 8420 },
    { time: '19:10', flowsPerSec: 8610 },
    { time: '19:20', flowsPerSec: 8790 },
    { time: '19:30', flowsPerSec: 8940 },
    { time: '19:40', flowsPerSec: 8742 }
  ],
  threatTrends: [
    { time: '16:00', ddos: 48, c2: 32, dnsTunnel: 22, malware: 18, recon: 14, exfiltration: 6 },
    { time: '17:00', ddos: 62, c2: 41, dnsTunnel: 30, malware: 24, recon: 19, exfiltration: 8 },
    { time: '18:00', ddos: 94, c2: 58, dnsTunnel: 44, malware: 36, recon: 25, exfiltration: 12 },
    { time: '19:00', ddos: 128, c2: 82, dnsTunnel: 64, malware: 48, recon: 31, exfiltration: 18 },
    { time: '20:00', ddos: 80, c2: 76, dnsTunnel: 55, malware: 38, recon: 23, exfiltration: 11 }
  ]
};
