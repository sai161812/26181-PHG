import React from 'react';
import { PrototypeRiskAssessment } from '../../types/domain';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { ArrowRight, Info } from 'lucide-react';

export interface RiskSummaryProps {
  assessment: PrototypeRiskAssessment;
  onViewAnalysis: () => void;
}

export const RiskSummary: React.FC<RiskSummaryProps> = ({
  assessment,
  onViewAnalysis
}) => {
  // Score track color based on severity
  const trackColors = {
    low: 'var(--risk-low)',
    moderate: 'var(--risk-moderate)',
    high: 'var(--risk-high)',
    critical: 'var(--risk-critical)'
  };

  const currentTrackColor = trackColors[assessment.severity];

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 650, color: 'var(--text)', margin: 0 }}>
              Personal Risk Status
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Prototype AI Risk Score • Rule-based demonstration
            </div>
          </div>
          <StatusBadge tone={assessment.severity} label={assessment.label} pulse />
        </div>

        {/* Score and Bar Indicator */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {assessment.overallScore}
          </span>
          <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            / 100
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: currentTrackColor, marginLeft: '8px' }}>
            {assessment.severity.toUpperCase()}
          </span>
        </div>

        {/* Thin Horizontal Score Track */}
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'var(--surface-muted)',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, assessment.overallScore))}%`,
              height: '100%',
              backgroundColor: currentTrackColor,
              borderRadius: '3px',
              transition: 'width var(--transition-normal)'
            }}
          />
        </div>

        {/* One-Line Interpretation */}
        <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.45, marginBottom: '16px', margin: '0 0 16px' }}>
          {assessment.interpretation}
        </p>

        {/* Contributing Factors List (Up to 3) */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Contributing factors:
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {assessment.topFactors.slice(0, 3).map((f) => (
              <li key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text)' }}>• {f.label}</span>
                <span style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                  {f.observedValue} (ref: {f.baselineRef})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Actions & Disclosures */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          <Info size={14} />
          <span>{assessment.confidenceDisclosure}</span>
        </div>
        <Button variant="secondary" size="sm" onClick={onViewAnalysis} icon={<ArrowRight size={14} />}>
          View analysis
        </Button>
      </div>
    </div>
  );
};
