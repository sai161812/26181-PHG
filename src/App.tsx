import React, { useState, useEffect } from 'react';
import { useCompanionStore } from './store/companionStore';
import { Sidebar } from './app/Sidebar';
import { TopBar } from './app/TopBar';
import { OverviewPage } from './features/overview/OverviewPage';
import { HealthPage } from './features/health/HealthPage';
import { AnalysisPage } from './features/analysis/AnalysisPage';
import { EnvironmentPage } from './features/environment/EnvironmentPage';
import { AlertsPage } from './features/alerts/AlertsPage';
import { DevicesPage } from './features/devices/DevicesPage';
import { EmergencyPage } from './features/emergency/EmergencyPage';
import { FallCheckInModal } from './features/emergency/FallCheckInModal';
import { PrivacyPage } from './features/privacy/PrivacyPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { OnboardingModal } from './features/onboarding/OnboardingModal';
import { DemoControlsDrawer } from './features/demo/DemoControlsDrawer';

export const App: React.FC = () => {
  const [activeDestination, setActiveDestination] = useState<string>('overview');
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState<boolean>(false);

  // Initialize store and root simulator on mount
  useEffect(() => {
    useCompanionStore.getState().init();
  }, []);

  // Router for destinations
  const renderCurrentView = () => {
    switch (activeDestination) {
      case 'overview':
        return <OverviewPage onNavigate={(dest) => setActiveDestination(dest)} />;
      case 'health':
        return <HealthPage />;
      case 'ai-analysis':
        return <AnalysisPage />;
      case 'environment':
        return <EnvironmentPage />;
      case 'alerts':
        return <AlertsPage onNavigate={(dest) => setActiveDestination(dest)} />;
      case 'devices':
        return <DevicesPage />;
      case 'emergency':
        return <EmergencyPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'profile-settings':
        return <ProfilePage />;
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
      />

      {/* Global Fall Check-In Modal ("Are you okay?" 20-second escalation countdown) */}
      <FallCheckInModal
        onNavigateToEmergency={() => setActiveDestination('emergency')}
      />

      {/* Four-Step Onboarding Wizard Modal */}
      <OnboardingModal />
    </div>
  );
};
