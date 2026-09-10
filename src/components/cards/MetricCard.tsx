import React from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  subtext?: string;
  deltaText?: string;
  deltaTone?: 'neutral' | 'positive' | 'warning' | 'critical';
  sparkline?: number[];
  onClick?: () => void;
  flex?: number | string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtext,
  deltaText,
  deltaTone = 'neutral',
  sparkline,
  onClick,
  flex = 1
}) => {
  // Simple clean SVG sparkline
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min === 0 ? 1 : max - min;
    const height = 28;
    const width = 80;
    
    const points = sparkline.map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <polyline
          fill="none"
          stroke="var(--teal-600)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const deltaColors = {
    neutral: 'var(--text-secondary)',
    positive: 'var(--risk-low)',
    warning: 'var(--risk-moderate)',
    critical: 'var(--risk-critical)'
  };

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
        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        minWidth: '180px',
        position: 'relative'
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '8px', minWidth: 0 }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </span>
        {deltaText && (
          <span style={{ fontSize: '11px', fontWeight: 600, color: deltaColors[deltaTone], textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {deltaText}
          </span>
        )}
      </div>

      {/* Main Measurement Row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '32px', fontWeight: 650, color: 'var(--text)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            {unit}
          </span>
        </div>
        {renderSparkline()}
      </div>

      {/* Subtext Footer */}
      {subtext && (
        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '10px' }}>
          {subtext}
        </div>
      )}
    </div>
  );
};
