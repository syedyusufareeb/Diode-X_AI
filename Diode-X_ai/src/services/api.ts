import {
  DashboardStats,
  ThreatFamilyMetric,
  SecurityAlert,
  NetworkFlow,
  SystemHealthData,
  AnalyticsData
} from '../types';
import {
  initialDashboardStats,
  mockThreatFamilies,
  mockLiveAlerts,
  mockNetworkFlows,
  mockSystemHealth,
  mockAnalyticsData
} from './mockData';

export interface ApiConfig {
  baseUrl: string;
  useMock: boolean;
  wsUrl: string;
  pollingIntervalMs: number;
}

// Configurable via environment or runtime settings
export const config: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  useMock: true, // Default to true for resilient hackathon presentation
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws/alerts',
  pollingIntervalMs: 3000
};

export interface ConnectionStatus {
  isOnline: boolean;
  isMock: boolean;
  latencyMs: number;
  message: string;
  lastChecked: Date;
}

let connectionStatus: ConnectionStatus = {
  isOnline: true,
  isMock: true,
  latencyMs: 14,
  message: 'Operating with High-Fidelity Simulation Telemetry (Demo Mode)',
  lastChecked: new Date()
};

export const getConnectionStatus = (): ConnectionStatus => ({ ...connectionStatus });

export const setApiMode = (useMock: boolean, customUrl?: string): void => {
  config.useMock = useMock;
  if (customUrl) config.baseUrl = customUrl;
  connectionStatus.isMock = useMock;
};

// Check backend connectivity
export const checkBackendHealth = async (): Promise<ConnectionStatus> => {
  if (config.useMock) {
    connectionStatus = {
      isOnline: true,
      isMock: true,
      latencyMs: 12 + Math.floor(Math.random() * 8),
      message: 'Demo Data: Passive telemetry simulation active',
      lastChecked: new Date()
    };
    return connectionStatus;
  }

  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(`${config.baseUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const latency = Math.round(performance.now() - start);
    if (response.ok) {
      connectionStatus = {
        isOnline: true,
        isMock: false,
        latencyMs: latency,
        message: 'Connected to Diode Ingest API Gateway',
        lastChecked: new Date()
      };
    } else {
      connectionStatus = {
        isOnline: false,
        isMock: false,
        latencyMs: latency,
        message: `Backend returned status ${response.status}`,
        lastChecked: new Date()
      };
    }
  } catch (error: any) {
    const latency = Math.round(performance.now() - start);
    connectionStatus = {
      isOnline: false,
      isMock: false,
      latencyMs: latency,
      message: 'Backend connection unavailable (check VITE_API_BASE_URL)',
      lastChecked: new Date()
    };
  }

  return connectionStatus;
};

// Centralized API calls
export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (config.useMock) {
    await new Promise(r => setTimeout(r, 60)); // Micro delay for realism
    return { ...initialDashboardStats };
  }
  try {
    const res = await fetch(`${config.baseUrl}/dashboard/stats`);
    if (!res.ok) throw new Error(`Failed to fetch dashboard stats: ${res.statusText}`);
    return await res.json();
  } catch {
    return { ...initialDashboardStats };
  }
};

export const getThreatDistribution = async (): Promise<ThreatFamilyMetric[]> => {
  if (config.useMock) {
    await new Promise(r => setTimeout(r, 80));
    return [...mockThreatFamilies];
  }
  try {
    const res = await fetch(`${config.baseUrl}/threats/distribution`);
    if (!res.ok) throw new Error(`Failed to fetch threat distribution: ${res.statusText}`);
    return await res.json();
  } catch {
    return [...mockThreatFamilies];
  }
};

export const getLiveAlerts = async (limit = 20): Promise<SecurityAlert[]> => {
  if (config.useMock) {
    await new Promise(r => setTimeout(r, 70));
    return mockLiveAlerts.slice(0, limit);
  }
  try {
    const res = await fetch(`${config.baseUrl}/alerts?limit=${limit}`);
    if (!res.ok) throw new Error(`Failed to fetch live alerts: ${res.statusText}`);
    return await res.json();
  } catch {
    return mockLiveAlerts.slice(0, limit);
  }
};

export const getAlertDetails = async (alertId: string): Promise<SecurityAlert | null> => {
  if (config.useMock) {
    await new Promise(r => setTimeout(r, 90));
    const found = mockLiveAlerts.find(a => a.id === alertId || a.flowId === alertId);
    return found || mockLiveAlerts[0];
  }
  try {
    const res = await fetch(`${config.baseUrl}/alerts/${alertId}`);
    if (!res.ok) throw new Error(`Failed to fetch alert details: ${res.statusText}`);
    return await res.json();
  } catch {
    return mockLiveAlerts.find(a => a.id === alertId || a.flowId === alertId) || mockLiveAlerts[0];
  }
};

export const getFlows = async (options?: {
  search?: string;
  threatOnly?: boolean;
  protocol?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ flows: NetworkFlow[]; total: number }> => {
  if (config.useMock) {
    await new Promise(r => setTimeout(r, 80));
    let filtered = [...mockNetworkFlows];

    if (options?.threatOnly) {
      filtered = filtered.filter(f => f.classification !== 'Benign');
    }
    if (options?.protocol && options.protocol !== 'ALL') {
      filtered = filtered.filter(f => f.protocol === options.protocol);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(f => 
        f.sourceIp.includes(q) ||
        f.destinationIp.includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.classification.toLowerCase().includes(q)
      );
    }

    const page = options?.page || 1;
    const pageSize = options?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      flows: paginated,
      total: filtered.length
    };
  }

  try {
    const query = new URLSearchParams();
    if (options?.search) query.append('search', options.search);
    if (options?.threatOnly) query.append('threatOnly', 'true');
    if (options?.protocol) query.append('protocol', options.protocol);
    if (options?.page) query.append('page', options.page.toString());
    if (options?.pageSize) query.append('pageSize', options.pageSize.toString());

    const res = await fetch(`${config.baseUrl}/flows?${query.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch flows: ${res.statusText}`);
    return await res.json();
  } catch {
    return {
      flows: mockNetworkFlows.slice(0, 10),
      total: mockNetworkFlows.length
    };
  }
};

export const getThreatAnalytics = async (): Promise<AnalyticsData> => {
  if (config.useMock) {
    await new Promise(r => setTimeout(r, 60));
    return { ...mockAnalyticsData };
  }
  try {
    const res = await fetch(`${config.baseUrl}/analytics/overview`);
    if (!res.ok) throw new Error(`Failed to fetch analytics: ${res.statusText}`);
    return await res.json();
  } catch {
    return { ...mockAnalyticsData };
  }
};

export const getSystemHealth = async (): Promise<SystemHealthData> => {
  if (config.useMock) {
    await new Promise(r => setTimeout(r, 50));
    return { ...mockSystemHealth };
  }
  try {
    const res = await fetch(`${config.baseUrl}/system/health`);
    if (!res.ok) throw new Error(`Failed to fetch system health: ${res.statusText}`);
    return await res.json();
  } catch {
    return { ...mockSystemHealth };
  }
};

export const getMetrics = async () => {
  return getDashboardStats();
};
