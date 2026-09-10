import React from 'react';
import { Alert } from '../../domain/types';
import { AlertRow } from './AlertRow';
import { ArrowRight, Bell } from 'lucide-react';

export interface RecentAlertsPanelProps {
  alerts: Alert[];
  onViewAllAlerts: () => void;
}

export const RecentAlertsPanel: React.FC<RecentAlertsPanelProps> = ({
  alerts,
  onViewAllAlerts
}) => {
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
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--teal-700)" />
            <h3 style={{ fontSize: '16px', fontWeight: 650, color: 'var(--text)', margin: 0 }}>
              Recent Alerts & Events
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Showing last {Math.min(3, alerts.length)} events
          </span>
        </div>

        {alerts.length === 0 ? (
          <div
            style={{
              padding: '24px 16px',
              backgroundColor: 'var(--canvas)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: '13px'
            }}
          >
            No active alert episodes recorded. All metrics nominal.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.slice(0, 3).map((a) => (
              <AlertRow key={a.id} alert={a} onClick={onViewAllAlerts} />
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
        <button
          onClick={onViewAllAlerts}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--teal-700)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>Open complete alerts workspace ({alerts.length})</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
