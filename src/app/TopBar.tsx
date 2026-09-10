import React from 'react';
import { useCompanionStore } from '../store/companionStore';
import { Button } from '../components/common/Button';
import { SlidersHorizontal, Wifi, WifiOff, Radio, Database, Globe, AlertCircle } from 'lucide-react';
import { NAVIGATION_DESTINATIONS } from '../data/navigation';
import { ScenarioType } from '../domain/types';
import { useConnectivityAndPWA } from '../hooks/useConnectivityAndPWA';

export interface TopBarProps {
  activeDestination: string;
  onOpenDemoControls: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeDestination,
  onOpenDemoControls
}) => {
  const currentNav = NAVIGATION_DESTINATIONS.find(n => n.id === activeDestination);
  const activeScenario = useCompanionStore(s => s.demoState.scenarioId);
  const deviceStatus = useCompanionStore(s => s.deviceStatus);
  const isDemoOffline = useCompanionStore(s => s.settings.simulatedOffline);
  const isPaused = useCompanionStore(s => s.demoState.isPaused);

  const { isBrowserOnline, isAppCacheReady, storageError, clearStorageError } = useConnectivityAndPWA();

  const scenarioDisplayLabels: Record<ScenarioType, string> = {
    normal: 'Normal (Baseline)',
    heat_wave: 'Heat Wave Exposure',
    pollution: 'Pollution Event',
    fatigue: 'Fatigue & Sleep Deficit',
    fall: 'Possible Fall Incident',
    flood: 'Flood Warning Advisory',
    cyclone: 'Cyclone Warning Advisory'
  };

  const isConnected = deviceStatus.connection === 'connected';

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        minHeight: 'var(--topbar-height)',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        boxSizing: 'border-box'
      }}
    >
      {/* Destination Title & Scenario Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 650, color: 'var(--text)', margin: 0 }}>
          {currentNav?.label || 'Overview'}
        </h1>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: activeScenario === 'normal' ? 'var(--risk-low-bg)' : 'var(--risk-high-bg)',
            color: activeScenario === 'normal' ? 'var(--risk-low)' : 'var(--risk-high)'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: activeScenario === 'normal' ? 'var(--risk-low)' : 'var(--risk-high)'
            }}
          />
          <span>Scenario: {scenarioDisplayLabels[activeScenario]}</span>
        </div>

        {isPaused && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: 'var(--risk-moderate-bg)',
              color: 'var(--risk-moderate)'
            }}
          >
            SIMULATOR PAUSED
          </span>
        )}

        {/* Storage failure feedback indicator */}
        {storageError && (
          <div
            onClick={clearStorageError}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: 'var(--risk-critical-bg)',
              color: 'var(--risk-critical)',
              cursor: 'pointer'
            }}
            title="Click to dismiss storage alert"
          >
            <AlertCircle size={12} />
            <span>Storage Warning: {storageError}</span>
          </div>
        )}
      </div>

      {/* Right Controls & Four Distinct Section 8 Status Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* 1. Belt Telemetry Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--canvas)',
            border: '1px solid var(--border)',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}
          title={`Integrated Belt Telemetry: ${isConnected ? 'Connected' : 'Disconnected'}`}
        >
          <Radio size={13} color={isConnected ? 'var(--risk-low)' : 'var(--risk-critical)'} />
          <span>
            Belt:{' '}
            <strong style={{ color: isConnected ? 'var(--risk-low)' : 'var(--risk-critical)' }}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </strong>
          </span>
        </div>

        {/* 2. Demo Offline Selection Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--canvas)',
            border: '1px solid var(--border)',
            fontSize: '12px',
            color: isDemoOffline ? 'var(--risk-moderate)' : 'var(--text-secondary)'
          }}
          title="Demo Offline Selection (Presenter Simulation)"
        >
          {isDemoOffline ? <WifiOff size={13} color="var(--risk-moderate)" /> : <Wifi size={13} color="var(--teal-700)" />}
          <span>
            Demo:{' '}
            <strong style={{ color: isDemoOffline ? 'var(--risk-moderate)' : 'var(--teal-700)' }}>
              {isDemoOffline ? 'Offline (Cached)' : 'Live'}
            </strong>
          </span>
        </div>

        {/* 3. Browser Connectivity Hint Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--canvas)',
            border: '1px solid var(--border)',
            fontSize: '12px',
            color: isBrowserOnline ? 'var(--text-secondary)' : 'var(--risk-critical)'
          }}
          title="Browser network connectivity hint (navigator.onLine)"
        >
          <Globe size={13} color={isBrowserOnline ? 'var(--teal-700)' : 'var(--risk-critical)'} />
          <span>
            Network:{' '}
            <strong style={{ color: isBrowserOnline ? 'var(--risk-low)' : 'var(--risk-critical)' }}>
              {isBrowserOnline ? 'Online' : 'Offline'}
            </strong>
          </span>
        </div>

        {/* 4. PWA App-Cache Readiness Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--canvas)',
            border: '1px solid var(--border)',
            fontSize: '12px',
            color: isAppCacheReady ? 'var(--teal-700)' : 'var(--text-tertiary)'
          }}
          title={isAppCacheReady ? 'PWA Service Worker Cache Active — Safe for Offline Reload' : 'PWA Cache Initializing'}
        >
          <Database size={13} color={isAppCacheReady ? 'var(--teal-700)' : 'var(--text-tertiary)'} />
          <span>
            Cache:{' '}
            <strong style={{ color: isAppCacheReady ? 'var(--teal-700)' : 'var(--text-secondary)' }}>
              {isAppCacheReady ? 'Ready' : 'Local'}
            </strong>
          </span>
        </div>

        {/* SIH Demo Controls Drawer Button */}
        <Button
          variant="primary"
          size="sm"
          icon={<SlidersHorizontal size={14} />}
          onClick={onOpenDemoControls}
        >
          SIH Demo Controls
        </Button>
      </div>
    </header>
  );
};
