import React from 'react';
import { useCompanionStore } from '../../store/companionStore';
import { BaselineManager } from '../../domain/managers/baselineManager';
import { RiskSummary } from '../../components/cards/RiskSummary';
import { BeltSummaryCard } from '../../components/cards/BeltSummaryCard';
import { MetricCard } from '../../components/cards/MetricCard';
import { EnvironmentClusterCard } from '../../components/cards/EnvironmentClusterCard';
import { ChartPanel } from '../../components/cards/ChartPanel';
import { RecentAlertsPanel } from '../../components/cards/RecentAlertsPanel';
import { StatusBadge } from '../../components/common/StatusBadge';
import { APP_CONFIG } from '../../config/appConfig';
import { Clock, Cpu } from 'lucide-react';

export interface OverviewPageProps {
  onNavigate: (destinationId: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  // Bind directly to unified reactive Zustand store
  const profile = useCompanionStore(s => s.profile);
  const baseline = useCompanionStore(s => s.baseline);
  const currentReading = useCompanionStore(s => s.currentReading);
  const environment = useCompanionStore(s => s.environment);
  const riskAssessment = useCompanionStore(s => s.riskAssessment);
  const deviceStatus = useCompanionStore(s => s.deviceStatus);
  const alerts = useCompanionStore(s => s.alerts);
  const liveBufferHR = useCompanionStore(s => s.liveBufferHR);
  const liveBufferSpO2 = useCompanionStore(s => s.liveBufferSpO2);
  const demoState = useCompanionStore(s => s.demoState);

  // Compute live deviations
  const hrVal = currentReading.hr ?? baseline.restingHR;
  const hrDeviationPct = BaselineManager.calculateHRDeviationPct(hrVal, baseline.restingHR);
  const hrDeltaText = hrDeviationPct === 0 
    ? '0% from baseline' 
    : `${hrDeviationPct > 0 ? '+' : ''}${hrDeviationPct}% from baseline`;
  const hrTone = hrDeviationPct > 35 ? 'critical' : hrDeviationPct > 20 ? 'warning' : 'neutral';

  const spo2Val = currentReading.spo2 ?? baseline.spo2;
  const spo2DiffPp = BaselineManager.calculateSpO2DiffPp(spo2Val, baseline.spo2);
  const spo2DeltaText = spo2DiffPp === 0
    ? '0 pp from baseline'
    : `${spo2DiffPp > 0 ? '-' : '+'}${Math.abs(spo2DiffPp)} pp from baseline`;
  const spo2Tone = spo2DiffPp >= 3 ? 'critical' : 'neutral';

  const tempVal = currentReading.bodyTemperatureC ?? baseline.bodyTemperatureC;
  const tempDelta = BaselineManager.calculateTempDelta(tempVal, baseline.bodyTemperatureC);
  const tempDeltaText = tempDelta === 0 
    ? 'Nominal' 
    : `${tempDelta > 0 ? '+' : ''}${tempDelta.toFixed(1)}°C from baseline`;
  const tempTone = tempDelta >= 0.8 ? 'warning' : 'neutral';

  const activityMin = currentReading.activityMinutes ?? 30;

  // Extract recent sparkline arrays from live buffers
  const hrSparkline = liveBufferHR.slice(-10).map(p => p.value);
  const spo2Sparkline = liveBufferSpO2.slice(-10).map(p => p.value);

  // System status tone based on overall score
  const systemTone = riskAssessment.severity;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ROW 1: Safety Context & Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text)', margin: 0, lineHeight: 1.2 }}>
            Good evening, {profile.name}
          </h2>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Monitoring from {deviceStatus.name} • {deviceStatus.connection === 'connected' ? 'Streaming' : 'Disconnected'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}
          >
            <Cpu size={14} color="var(--teal-700)" />
            <span>Local demo engine</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}
          >
            <Clock size={14} color="var(--text-tertiary)" />
            <span>Last reading: {demoState.isPaused ? 'Paused' : 'Just now'}</span>
          </div>

          <StatusBadge 
            tone={systemTone} 
            label={systemTone === 'low' ? 'System Nominal' : `${systemTone.toUpperCase()} RISK`} 
            pulse 
          />
        </div>
      </div>

      {/* ROW 2: Primary Decision Area (7/5 Column Balance) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)',
          gap: '20px',
          alignItems: 'stretch'
        }}
      >
        <RiskSummary
          assessment={riskAssessment}
          onViewAnalysis={() => onNavigate('ai-analysis')}
        />

        <BeltSummaryCard
          beltStatus={{
            deviceName: deviceStatus.name,
            connectionState: deviceStatus.connection,
            batteryPct: deviceStatus.batteryPct,
            motionStatus: deviceStatus.motionStatus,
            protectionState: deviceStatus.protectionState,
            components: deviceStatus.components
          }}
          onOpenDevices={() => onNavigate('devices')}
        />
      </div>

      {/* ROW 3: Current Measurements (Unequal Compact Information Cards) */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'stretch'
        }}
      >
        {/* Heart Rate Card */}
        <MetricCard
          title="Heart rate"
          value={hrVal}
          unit="BPM"
          subtext={`Baseline: ${baseline.restingHR} BPM (${baseline.source})`}
          deltaText={hrDeltaText}
          deltaTone={hrTone}
          sparkline={hrSparkline.length > 1 ? hrSparkline : [71, 72, 73, 72, hrVal]}
          onClick={() => onNavigate('health')}
          flex={1}
        />

        {/* SpO2 Card */}
        <MetricCard
          title="SpO₂ oxygen"
          value={spo2Val}
          unit="%"
          subtext={`Baseline: ${baseline.spo2}% optimal`}
          deltaText={spo2DeltaText}
          deltaTone={spo2Tone}
          sparkline={spo2Sparkline.length > 1 ? spo2Sparkline : [98, 98, 97, 98, spo2Val]}
          onClick={() => onNavigate('health')}
          flex={1}
        />

        {/* Body Temp Card */}
        <MetricCard
          title="Body temperature"
          value={tempVal.toFixed(1)}
          unit="°C"
          subtext={`Baseline: ${baseline.bodyTemperatureC}°C`}
          deltaText={tempDeltaText}
          deltaTone={tempTone}
          sparkline={[36.6, 36.7, 36.7, tempVal]}
          onClick={() => onNavigate('health')}
          flex={1}
        />

        {/* Daily Activity Card */}
        <MetricCard
          title="Daily activity"
          value={activityMin}
          unit="min"
          subtext={`State: ${currentReading.activity.toUpperCase()}`}
          deltaText={`${currentReading.activity} exertion`}
          deltaTone="neutral"
          sparkline={[10, 20, 25, activityMin]}
          onClick={() => onNavigate('health')}
          flex={1}
        />

        {/* Environment Cluster Card (Wider) */}
        <EnvironmentClusterCard
          metrics={environment}
          onClick={() => onNavigate('environment')}
          flex={1.4}
        />
      </div>

      {/* ROW 4: Interpretation and History */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '20px',
          alignItems: 'stretch'
        }}
      >
        {/* Left: Clean Live Chart with real buffers */}
        <ChartPanel 
          onOpenTrends={() => onNavigate('health')}
          bufferHR={liveBufferHR}
          bufferSpO2={liveBufferSpO2}
        />

        {/* Right: Recent Alerts */}
        <RecentAlertsPanel
          alerts={alerts}
          onViewAllAlerts={() => onNavigate('alerts')}
        />
      </div>

      {/* Non-Diagnostic Medical Disclaimer */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          fontStyle: 'italic',
          borderTop: '1px solid var(--border)',
          paddingTop: '12px',
          marginTop: '4px'
        }}
      >
        {APP_CONFIG.disclaimer}
      </div>
    </div>
  );
};
