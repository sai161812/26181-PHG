import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Calendar, CheckCircle2 } from 'lucide-react';

export interface DestinationScaffoldProps {
  title: string;
  subtitle: string;
  phaseTarget: string;
  plannedFeatures: string[];
  plannedTabs?: string[];
  icon: React.ReactNode;
}

export const DestinationScaffold: React.FC<DestinationScaffoldProps> = ({
  title,
  subtitle,
  phaseTarget,
  plannedFeatures,
  plannedTabs,
  icon
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--teal-100)',
                color: 'var(--teal-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {icon}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 650, color: 'var(--text)', margin: 0 }}>
                  {title}
                </h2>
                <StatusBadge tone="teal" label={phaseTarget} />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px', margin: 0 }}>
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Planned Tabs Preview */}
        {plannedTabs && plannedTabs.length > 0 && (
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            {plannedTabs.map((tab, i) => (
              <span
                key={tab}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: i === 0 ? 650 : 500,
                  backgroundColor: i === 0 ? 'var(--teal-100)' : 'var(--canvas)',
                  color: i === 0 ? 'var(--teal-700)' : 'var(--text-secondary)',
                  border: '1px solid var(--border)'
                }}
              >
                {tab}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Planned Feature Deliverables */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Calendar size={18} color="var(--teal-700)" />
          <h3 style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text)', margin: 0 }}>
            Planned Deliverables for {phaseTarget}
          </h3>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {plannedFeatures.map((feat) => (
            <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text)' }}>
              <CheckCircle2 size={16} color="var(--teal-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ lineHeight: 1.45 }}>{feat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
