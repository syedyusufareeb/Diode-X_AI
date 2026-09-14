import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, AppView } from './components/layout/Sidebar';
import { OverviewDashboard } from './views/OverviewDashboard';
import { LiveThreatMonitor } from './views/LiveThreatMonitor';
import { ThreatIntelligence } from './views/ThreatIntelligence';
import { FlowExplorer } from './views/FlowExplorer';
import { AlertDetails } from './views/AlertDetails';
import { Analytics } from './views/Analytics';
import { SystemHealth } from './views/SystemHealth';
import { Settings } from './views/Settings';
import { ThreatFamily } from './types';
import { getConnectionStatus, checkBackendHealth, setApiMode, ConnectionStatus } from './services/api';
import { streamService } from './services/streamService';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [connection, setConnection] = useState<ConnectionStatus>(getConnectionStatus());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [selectedAlertId, setSelectedAlertId] = useState<string>('ALT-8841');
  const [flowSearchFilter, setFlowSearchFilter] = useState<string>('');
  const [pendingAlertCount, setPendingAlertCount] = useState<number>(3);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check connection status on mount
  useEffect(() => {
    checkBackendHealth().then(status => setConnection(status));

    // Listen for live alerts to increment counter
    const unsub = streamService.subscribeAlerts(() => {
      setPendingAlertCount(c => c + 1);
    });

    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleDemoMode = () => {
    const next = !isDemoMode;
    setIsDemoMode(next);
    setApiMode(next);
    checkBackendHealth().then(st => setConnection(st));
    showToast(next ? 'Switched to Demo Simulation Mode' : 'Switched to Real Backend API Ingest');
  };

  const handleRefreshConnection = () => {
    checkBackendHealth().then(st => {
      setConnection(st);
      showToast(`Connection checked: ${st.message}`);
    });
  };

  // Navigations
  const handleInvestigateAlert = (alertId: string) => {
    setSelectedAlertId(alertId);
    setCurrentView('alert-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInvestigateThreatFamily = (threatName: ThreatFamily) => {
    setFlowSearchFilter(threatName);
    setCurrentView('flow-explorer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white relative">
      {/* Ambient background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      {/* Top Navigation Bar */}
      <Navbar
        connection={connection}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        activeAlertCount={pendingAlertCount}
        onNavigateToAlerts={() => {
          setCurrentView('live-monitor');
          setPendingAlertCount(0);
        }}
      />

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-card px-4 py-2.5 rounded-2xl shadow-xl border border-blue-200 text-xs font-semibold text-slate-800 flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex relative z-10">
        {/* Left Persistent Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic View Content Area */}
        <main className="flex-1 p-4 lg:p-7 max-w-7xl mx-auto w-full min-w-0">
          {currentView === 'overview' && (
            <OverviewDashboard
              onInvestigateAlert={handleInvestigateAlert}
              onViewAllAlerts={() => setCurrentView('live-monitor')}
            />
          )}

          {currentView === 'live-monitor' && (
            <LiveThreatMonitor
              onInvestigateAlert={handleInvestigateAlert}
            />
          )}

          {currentView === 'threat-intel' && (
            <ThreatIntelligence
              onInvestigateThreatFamily={handleInvestigateThreatFamily}
            />
          )}

          {currentView === 'flow-explorer' && (
            <FlowExplorer
              initialThreatFilter={flowSearchFilter}
              onInspectAlert={handleInvestigateAlert}
            />
          )}

          {currentView === 'alert-details' && (
            <AlertDetails
              selectedAlertId={selectedAlertId}
              onBackToOverview={() => setCurrentView('overview')}
              onSelectAnotherAlert={handleInvestigateAlert}
            />
          )}

          {currentView === 'analytics' && (
            <Analytics />
          )}

          {currentView === 'system-health' && (
            <SystemHealth />
          )}

          {currentView === 'settings' && (
            <Settings
              currentConnection={connection}
              onRefreshConnection={handleRefreshConnection}
              isDemoMode={isDemoMode}
              onToggleDemoMode={handleToggleDemoMode}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;