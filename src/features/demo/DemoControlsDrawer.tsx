import React from 'react';
import { useCompanionStore } from '../../store/companionStore';
import { Drawer } from '../../components/common/Drawer';
import { Button } from '../../components/common/Button';
import { Toggle } from '../../components/common/FormControls';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Wind, 
  BatteryLow, 
  AlertOctagon, 
  Waves, 
  CloudLightning, 
  CheckCircle2 
} from 'lucide-react';
import { ScenarioType } from '../../domain/types';

export interface DemoControlsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScenarioOption {
  id: ScenarioType;
  title: string;
  expectedScore: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  tone: 'low' | 'moderate' | 'high' | 'critical';
}

const SCENARIO_OPTIONS: ScenarioOption[] = [
  {
    id: 'normal',
    title: 'Normal (Baseline)',
    expectedScore: 'Score: 18 (Low)',
    description: 'Resting vitals nominal (HR 72, SpO₂ 98%), ambient 30°C, AQI 60.',
    icon: CheckCircle2,
    tone: 'low'
  },
  {
    id: 'heat_wave',
    title: 'Heat Wave Exposure',
    expectedScore: 'Score: 78 (High)',
    description: 'Ambient 40°C, 78% humidity, HR +50% (108 BPM), body temp 37.7°C.',
    icon: Flame,
    tone: 'high'
  },
  {
    id: 'pollution',
    title: 'Pollution Event',
    expectedScore: 'Score: 68 (High)',
    description: 'AQI 185 (severe), SpO₂ drops 4 percentage points to 94% outdoor.',
    icon: Wind,
    tone: 'high'
  },
  {
    id: 'fatigue',
    title: 'Fatigue & Sleep Deficit',
    expectedScore: 'Score: 58 (Moderate)',
    description: '240m sleep (3h 20m deficit), 180 min accumulated high activity.',
    icon: BatteryLow,
    tone: 'moderate'
  },
  {
    id: 'fall',
    title: 'Possible Fall Incident',
    expectedScore: 'Protection Event',
    description: 'Scripted motion spike followed by zero movement, 20s check-in.',
    icon: AlertOctagon,
    tone: 'critical'
  },
  {
    id: 'flood',
    title: 'Flood Warning Advisory',
    expectedScore: 'Disaster Context',
    description: 'Normal vitals, official flood bulletin cached, guidance active.',
    icon: Waves,
    tone: 'high'
  },
  {
    id: 'cyclone',
    title: 'Cyclone Warning Advisory',
    expectedScore: 'Disaster Context',
    description: 'Normal vitals, high cyclone warning cached, preparedness active.',
    icon: CloudLightning,
    tone: 'high'
  }
];

export const DemoControlsDrawer: React.FC<DemoControlsDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const activeScenario = useCompanionStore(s => s.demoState.scenarioId);
  const isPaused = useCompanionStore(s => s.demoState.isPaused);
  const isSimulatedOffline = useCompanionStore(s => s.settings.simulatedOffline);
  const setScenario = useCompanionStore(s => s.setScenario);
  const togglePause = useCompanionStore(s => s.togglePause);
  const resetDemo = useCompanionStore(s => s.resetDemo);
  const setSimulatedOffline = useCompanionStore(s => s.setSimulatedOffline);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Demo Controls"
      subtitle="Evaluator presentation triggers & real-time simulation orchestrator"
      width="460px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Active Engine State Banner */}
        <div
          style={{
            backgroundColor: 'var(--canvas)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            lineHeight: 1.45
          }}
        >
          <strong style={{ color: 'var(--text)' }}>Reactive Root Simulator Active:</strong> 2-second stream drives personal risk engine, baseline deviations, alerts, and belt telemetry in real time.
        </div>

        {/* Global Simulator State Controls */}
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 650, color: 'var(--text)', marginBottom: '12px' }}>
            Simulation Engine Controls
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <Button
              variant={isPaused ? 'primary' : 'outline'}
              size="sm"
              icon={isPaused ? <Play size={14} /> : <Pause size={14} />}
              onClick={togglePause}
              style={{ flex: 1 }}
            >
              {isPaused ? 'Resume simulator' : 'Pause simulator'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw size={14} />}
              onClick={resetDemo}
              style={{ flex: 1 }}
            >
              Reset to Normal
            </Button>
          </div>

          <Toggle
            label="Simulate offline mode"
            description="Switches environmental snapshot to cached mode while local monitoring continues"
            checked={isSimulatedOffline}
            onChange={setSimulatedOffline}
          />
        </div>

        {/* Scenarios Selection List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 650, color: 'var(--text)' }}>
              Evaluation Scenarios
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
              7 Prescribed Scenarios
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SCENARIO_OPTIONS.map((sc) => {
              const Icon = sc.icon;
              const isSelected = activeScenario === sc.id;

              return (
                <div
                  key={sc.id}
                  onClick={() => setScenario(sc.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setScenario(sc.id);
                    }
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--teal-700)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--teal-100)' : 'var(--surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={16} color={isSelected ? 'var(--teal-700)' : 'var(--text-secondary)'} />
                      <span style={{ fontSize: '13px', fontWeight: 650, color: 'var(--text)' }}>
                        {sc.title}
                      </span>
                    </div>
                    <StatusBadge tone={sc.tone} label={sc.expectedScore} size="sm" />
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0', lineHeight: 1.35 }}>
                    {sc.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
