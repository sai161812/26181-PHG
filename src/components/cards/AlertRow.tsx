import React from 'react';
import { Alert } from '../../domain/types';
import { StatusBadge } from '../common/StatusBadge';
import { Clock } from 'lucide-react';

export interface AlertRowProps {
  alert: Alert | {
    id: string;
    severity: Alert['severity'];
    title: string;
    reason: string;
    timestamp?: string;
    createdAt?: number;
  };
  onClick?: () => void;
}

export const AlertRow: React.FC<AlertRowProps> = ({ alert, onClick }) => {
  const timeStr = (alert as any).timestamp 
    ? (alert as any).timestamp 
    : (alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now');

  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--canvas)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color var(--transition-fast)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StatusBadge tone={alert.severity} label={alert.severity.toUpperCase()} size="sm" />
          <span style={{ fontSize: '13px', fontWeight: 650, color: 'var(--text)' }}>
            {alert.title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
          <Clock size={12} />
          <span>{timeStr}</span>
        </div>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
        {alert.reason}
      </p>
    </div>
  );
};
