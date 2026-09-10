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
import { useConnectivityAndPWA } from './hooks/useConnectivityAndPWA';
import { ScenarioType } from './domain/types';

export const App: React.FC = () => {
  // Parse route and evaluation parameters from hash/URL
  const parseRouteAndParams = () => {
    if (typeof window === 'undefined') return { dest: 'overview', scenario: null, offline: null };
    const hash = window.location.hash.replace('#', '');
    const [routePart, queryPart] = hash.split('?');
    const params = new URLSearchParams(queryPart || window.location.search);
    const rawScenario = params.get('scenario');
    const scenario = rawScenario === 'heat' ? 'heat_wave' : (rawScenario as ScenarioType | null);
    return {
      dest: routePart || 'overview',
      scenario,
      offline: params.has('offline') ? params.get('offline') === 'true' : null
    };
  };

  const [activeDestination, setActiveDestination] = useState<string>(() => {
    return parseRouteAndParams().dest;
  });
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState<boolean>(false);
  const { needRefresh, updateApp } = useConnectivityAndPWA();
  const [dismissUpdateBanner, setDismissUpdateBanner] = useState<boolean>(false);
  const accessibilityChoices = useCompanionStore((state) => state.settings.accessibilityChoices);

  // Initialize store and root simulator on mount
  useEffect(() => {
    useCompanionStore.getState().init();
  }, []);

  // Hash & URL evaluation parameters sync
  useEffect(() => {
    const applyUrlState = () => {
      const { dest, scenario, offline } = parseRouteAndParams();
      if (dest) {
        setActiveDestination(dest);
      }
      if (scenario) {
        useCompanionStore.getState().setScenario(scenario);
      }
      if (offline !== null) {
        useCompanionStore.getState().setSimulatedOffline(offline);
      }
    };

    applyUrlState();
    window.addEventListener('hashchange', applyUrlState);
    return () => window.removeEventListener('hashchange', applyUrlState);
  }, []);

  const handleNavigate = (dest: string) => {
    setActiveDestination(dest);
    if (typeof window !== 'undefined') {
      window.location.hash = dest;
    }
  };

  // Sync accessibility options to document root attributes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (accessibilityChoices?.reducedMotion) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
      } else {
        document.documentElement.removeAttribute('data-reduced-motion');
      }

      if (accessibilityChoices?.highContrast) {
        document.documentElement.setAttribute('data-high-contrast', 'true');
      } else {
        document.documentElement.removeAttribute('data-high-contrast');
      }
    }
  }, [accessibilityChoices]);

  // Router for destinations
  const renderCurrentView = () => {
    switch (activeDestination) {
      case 'overview':
        return <OverviewPage onNavigate={handleNavigate} />;
      case 'health':
        return <HealthPage />;
      case 'ai-analysis':
        return <AnalysisPage />;
      case 'environment':
        return <EnvironmentPage />;
      case 'alerts':
        return <AlertsPage onNavigate={handleNavigate} />;
      case 'devices':
        return <DevicesPage />;
      case 'emergency':
        return <EmergencyPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'profile-settings':
        return <ProfilePage />;
      default:
        return <OverviewPage onNavigate={handleNavigate} />;
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
        onSelectDestination={handleNavigate}
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

      {/* Demo Controls Drawer */}
      <DemoControlsDrawer
        isOpen={isDemoControlsOpen}
        onClose={() => setIsDemoControlsOpen(false)}
      />

      {/* Global Fall Check-In Modal ("Are you okay?" 20-second escalation countdown) */}
      <FallCheckInModal
        onNavigateToEmergency={() => handleNavigate('emergency')}
      />

      {/* Four-Step Onboarding Wizard Modal */}
      <OnboardingModal />

      {/* User-Controlled Presentation Update Banner (Prevents surprise reloads during live demo) */}
      {needRefresh && !dismissUpdateBanner && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9000,
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--teal-700)',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ fontSize: '13px', color: 'var(--text)' }}>
            <strong>Workstation Update Cached:</strong> Ready to apply.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={updateApp}
              style={{
                padding: '6px 12px',
                backgroundColor: 'var(--teal-700)',
                color: '#FFFFFF',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reload When Ready
            </button>
            <button
              type="button"
              onClick={() => setDismissUpdateBanner(true)}
              style={{
                padding: '6px 10px',
                backgroundColor: 'var(--surface-muted)',
                color: 'var(--text-secondary)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
