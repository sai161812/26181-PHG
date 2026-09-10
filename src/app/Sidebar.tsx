import React from 'react';
import { NAVIGATION_DESTINATIONS } from '../data/navigation';
import { APP_CONFIG } from '../config/appConfig';
import { HeartPulse, Laptop } from 'lucide-react';

export interface SidebarProps {
  activeDestination: string;
  onSelectDestination: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeDestination,
  onSelectDestination
}) => {
  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        minWidth: 'var(--sidebar-width)',
        height: '100%',
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
        boxSizing: 'border-box'
      }}
      aria-label="Companion Navigation"
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--teal-700)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <HeartPulse size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 650, fontSize: '15px', color: 'var(--text)', lineHeight: 1.2 }}>
            {APP_CONFIG.appName}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            {APP_CONFIG.problemStatementId} • {APP_CONFIG.teamName}
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 650,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '4px 10px 10px'
          }}
        >
          Workstation
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {NAVIGATION_DESTINATIONS.map((dest) => {
            const Icon = dest.icon;
            const isActive = activeDestination === dest.id;

            return (
              <li key={dest.id}>
                <button
                  onClick={() => onSelectDestination(dest.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: isActive ? 650 : 500,
                    color: isActive ? 'var(--teal-700)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--teal-100)' : 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color var(--transition-fast), color var(--transition-fast)'
                  }}
                >
                  <Icon size={18} color={isActive ? 'var(--teal-700)' : 'var(--text-secondary)'} />
                  <span>{dest.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Viewport Target Indicator */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--canvas)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <Laptop size={14} color="var(--teal-700)" />
          <span style={{ fontWeight: 600 }}>Desktop 1366×768</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
          SIH Prototype v0.1 • Phase 1
        </div>
      </div>
    </aside>
  );
};
