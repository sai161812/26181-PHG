import React from 'react';
import { RiskSeverity } from '../../types/domain';

export type BadgeTone = RiskSeverity | 'neutral' | 'teal';

export interface StatusBadgeProps {
  tone?: BadgeTone;
  label: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  tone = 'neutral',
  label,
  icon,
  size = 'md',
  pulse = false
}) => {
  const toneStyles: Record<BadgeTone, { bg: string; text: string; dot: string }> = {
    low: { bg: 'var(--risk-low-bg)', text: 'var(--risk-low)', dot: 'var(--risk-low)' },
    moderate: { bg: 'var(--risk-moderate-bg)', text: 'var(--risk-moderate)', dot: 'var(--risk-moderate)' },
    high: { bg: 'var(--risk-high-bg)', text: 'var(--risk-high)', dot: 'var(--risk-high)' },
    critical: { bg: 'var(--risk-critical-bg)', text: 'var(--risk-critical)', dot: 'var(--risk-critical)' },
    neutral: { bg: 'var(--surface-muted)', text: 'var(--text-secondary)', dot: 'var(--text-tertiary)' },
    teal: { bg: 'var(--teal-100)', text: 'var(--teal-700)', dot: 'var(--teal-700)' }
  };

  const currentTone = toneStyles[tone];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: currentTone.bg,
        color: currentTone.text,
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: size === 'sm' ? '12px' : '13px',
        fontWeight: 600,
        lineHeight: 1.2,
        whiteSpace: 'nowrap'
      }}
    >
      {pulse && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: currentTone.dot
          }}
        />
      )}
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
