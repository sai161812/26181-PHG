import React from 'react';
import { 
  DEMO_PROFILE, 
  CURRENT_VITALS, 
  CURRENT_ENVIRONMENT, 
  CURRENT_RISK_ASSESSMENT, 
  CURRENT_BELT_STATUS, 
  RECENT_ALERTS 
} from '../../data/fixtures';
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
            Good evening, {DEMO_PROFILE.name}
          </h2>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Monitoring from {CURRENT_BELT_STATUS.deviceName}
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
            <span>Local laptop engine</span>
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
            <span>Last reading: Just now</span>
          </div>

          <StatusBadge tone="low" label="System Nominal" pulse />
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
          assessment={CURRENT_RISK_ASSESSMENT}
          onViewAnalysis={() => onNavigate('ai-analysis')}
        />

        <BeltSummaryCard
          beltStatus={CURRENT_BELT_STATUS}
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
          title={CURRENT_VITALS.hr.name}
          value={CURRENT_VITALS.hr.value}
          unit={CURRENT_VITALS.hr.unit}
          subtext="Baseline: 72 BPM (resting median)"
          deltaText={CURRENT_VITALS.hr.deltaText}
          deltaTone="neutral"
          sparkline={CURRENT_VITALS.hr.sparkline}
          onClick={() => onNavigate('health')}
          flex={1}
        />

        {/* SpO2 Card */}
        <MetricCard
          title={CURRENT_VITALS.spo2.name}
          value={CURRENT_VITALS.spo2.value}
          unit={CURRENT_VITALS.spo2.unit}
          subtext="Baseline: 98% optimal"
          deltaText={CURRENT_VITALS.spo2.deltaText}
          deltaTone="neutral"
          sparkline={CURRENT_VITALS.spo2.sparkline}
          onClick={() => onNavigate('health')}
          flex={1}
        />

        {/* Body Temp Card */}
        <MetricCard
          title={CURRENT_VITALS.temp.name}
          value={CURRENT_VITALS.temp.value}
          unit={CURRENT_VITALS.temp.unit}
          subtext="Baseline: 36.7°C (constant)"
          deltaText={CURRENT_VITALS.temp.deltaText}
          deltaTone="neutral"
          sparkline={CURRENT_VITALS.temp.sparkline}
          onClick={() => onNavigate('health')}
          flex={1}
        />

        {/* Daily Activity Card */}
        <MetricCard
          title={CURRENT_VITALS.activity.name}
          value={CURRENT_VITALS.activity.value}
          unit={CURRENT_VITALS.activity.unit}
          subtext="Goal: 45 min moderate movement"
          deltaText={CURRENT_VITALS.activity.deltaText}
          deltaTone="neutral"
          sparkline={CURRENT_VITALS.activity.sparkline}
          onClick={() => onNavigate('health')}
          flex={1}
        />

        {/* Environment Cluster Card (Wider) */}
        <EnvironmentClusterCard
          metrics={CURRENT_ENVIRONMENT}
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
        {/* Left: Clean Live Chart */}
        <ChartPanel onOpenTrends={() => onNavigate('health')} />

        {/* Right: Recent Alerts */}
        <RecentAlertsPanel
          alerts={RECENT_ALERTS}
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
