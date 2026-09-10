import React from 'react';
import { EnvironmentMetrics } from '../../types/domain';

export interface EnvironmentClusterCardProps {
  metrics: EnvironmentMetrics;
  onClick?: () => void;
  flex?: number | string;
}

export const EnvironmentClusterCard: React.FC<EnvironmentClusterCardProps> = ({
  metrics,
  onClick,
  flex = 1.4
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        flex,
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        minWidth: '260px'
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Environment cluster
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
          {metrics.source}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '6px' }}>
        {/* Ambient Temp */}
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Ambient</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
              {metrics.ambientC}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>°C</span>
          </div>
        </div>

        {/* Humidity */}
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Humidity</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
              {metrics.humidityPct}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>%</span>
          </div>
        </div>

        {/* AQI */}
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>AQI</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
              {metrics.aqi}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>index</span>
          </div>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '10px' }}>
        Location: {metrics.locationLabel}
      </div>
    </div>
  );
};
