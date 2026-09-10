import React from 'react';
import { Button } from '../components/common/Button';
import { SlidersHorizontal, Wifi, Radio } from 'lucide-react';
import { NAVIGATION_DESTINATIONS } from '../data/navigation';
import { ScenarioType } from '../types/domain';

export interface TopBarProps {
  activeDestination: string;
  activeScenario: ScenarioType;
  onOpenDemoControls: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeDestination,
  activeScenario,
  onOpenDemoControls
}) => {
  const currentNav = NAVIGATION_DESTINATIONS.find(n => n.id === activeDestination);

  const scenarioDisplayLabels: Record<ScenarioType, string> = {
    normal: 'Normal (Baseline)',
    heat_wave: 'Heat Wave Exposure',
    pollution: 'Pollution Event',
    fatigue: 'Fatigue & Sleep Deficit',
    fall: 'Possible Fall Incident',
    flood: 'Flood Warning Advisory',
    cyclone: 'Cyclone Warning Advisory'
  };

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
      </div>

      {/* Right Controls & Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Belt Telemetry Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--canvas)',
            border: '1px solid var(--border)',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}
        >
          <Radio size={14} color="var(--teal-700)" />
          <span>Integrated Belt: <strong style={{ color: 'var(--risk-low)' }}>Connected</strong></span>
        </div>

        {/* Offline / Local Ready */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--canvas)',
            border: '1px solid var(--border)',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}
        >
          <Wifi size={14} color="var(--teal-700)" />
          <span>Offline ready</span>
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
