import React, { useState } from 'react';
import { Sidebar } from './app/Sidebar';
import { TopBar } from './app/TopBar';
import { OverviewPage } from './features/overview/OverviewPage';
import { HealthScaffold } from './features/health/HealthScaffold';
import { AnalysisScaffold } from './features/analysis/AnalysisScaffold';
import { EnvironmentScaffold } from './features/environment/EnvironmentScaffold';
import { AlertsScaffold } from './features/alerts/AlertsScaffold';
import { DevicesScaffold } from './features/devices/DevicesScaffold';
import { EmergencyScaffold } from './features/emergency/EmergencyScaffold';
import { PrivacyScaffold } from './features/privacy/PrivacyScaffold';
import { ProfileScaffold } from './features/profile/ProfileScaffold';
import { DemoControlsDrawer } from './features/demo/DemoControlsDrawer';
import { ScenarioType } from './types/domain';

export const App: React.FC = () => {
  const [activeDestination, setActiveDestination] = useState<string>('overview');
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('normal');
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState<boolean>(false);

  // Router for destinations
  const renderCurrentView = () => {
    switch (activeDestination) {
      case 'overview':
        return <OverviewPage onNavigate={(dest) => setActiveDestination(dest)} />;
      case 'health':
        return <HealthScaffold />;
      case 'ai-analysis':
        return <AnalysisScaffold />;
      case 'environment':
        return <EnvironmentScaffold />;
      case 'alerts':
        return <AlertsScaffold />;
      case 'devices':
        return <DevicesScaffold />;
      case 'emergency':
        return <EmergencyScaffold />;
      case 'privacy':
        return <PrivacyScaffold />;
      case 'profile-settings':
        return <ProfileScaffold />;
      default:
        return <OverviewPage onNavigate={(dest) => setActiveDestination(dest)} />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--canvas)'
      }}
    >
      {/* Fixed 216px Left Sidebar */}
      <Sidebar
        activeDestination={activeDestination}
        onSelectDestination={(id) => setActiveDestination(id)}
      />

      {/* Main Workstation Viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Top Status Bar (~64px) */}
        <TopBar
          activeDestination={activeDestination}
          activeScenario={activeScenario}
          onOpenDemoControls={() => setIsDemoControlsOpen(true)}
        />

        {/* Scrollable Workstation Content Container */}
        <main
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            maxWidth: 'var(--content-max-width)',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {renderCurrentView()}
        </main>
      </div>

      {/* SIH Demo Controls Drawer */}
      <DemoControlsDrawer
        isOpen={isDemoControlsOpen}
        onClose={() => setIsDemoControlsOpen(false)}
        activeScenario={activeScenario}
        onSelectScenario={(sc) => setActiveScenario(sc)}
      />
    </div>
  );
};
