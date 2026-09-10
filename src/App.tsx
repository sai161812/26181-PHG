import React from 'react';
import { 
  Activity, 
  HeartPulse, 
  BrainCircuit, 
  CloudSun, 
  Bell, 
  Radio, 
  AlertTriangle, 
  ShieldCheck, 
  Settings, 
  SlidersHorizontal,
  Laptop
} from 'lucide-react';
import { APP_CONFIG } from './config/appConfig';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'health', label: 'Health', icon: HeartPulse },
  { id: 'ai-analysis', label: 'AI Analysis', icon: BrainCircuit },
  { id: 'environment', label: 'Environment', icon: CloudSun },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'devices', label: 'Devices', icon: Radio },
  { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
  { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
  { id: 'profile-settings', label: 'Profile & Settings', icon: Settings },
];

export const App: React.FC = () => {
  const [activeNav, setActiveNav] = React.useState('overview');

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'var(--bg-page)' }}>
      {/* Fixed Left Sidebar (~216px) */}
      <aside 
        style={{
          width: 'var(--sidebar-width)',
          minWidth: 'var(--sidebar-width)',
          height: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10
        }}
        aria-label="Desktop Navigation"
      >
        {/* Brand Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--accent-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HeartPulse size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.2 }}>
              {APP_CONFIG.appName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {APP_CONFIG.problemStatementId} • {APP_CONFIG.teamName}
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 12px 4px' }}>
            Workstation Views
          </div>
          <ul style={{ listStyle: 'none' }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <li key={item.id} style={{ marginBottom: '4px' }}>
                  <button
                    onClick={() => setActiveNav(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--accent-surface)' : 'transparent',
                      textAlign: 'left',
                      transition: 'background-color var(--transition-fast)'
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop Viewport Indicator */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-page)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Laptop size={14} color="var(--accent-primary)" />
          <span>Desktop-First: 1366×768 Target</span>
        </div>
      </aside>

      {/* Main App Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Global Top Bar (~64px) */}
        <header style={{
          height: 'var(--topbar-height)',
          minHeight: 'var(--topbar-height)',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 5
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
              {NAV_ITEMS.find(n => n.id === activeNav)?.label || 'Overview'}
            </h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: 'var(--risk-low-bg)',
              color: 'var(--risk-low)'
            }}>
              Active Scenario: Normal (Baseline)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-page)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-low)' }} />
              <span>Belt Simulator: Ready</span>
            </div>

            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 500,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              title="SIH Demo Controls Drawer (Configured in Phase 1 & 2)"
            >
              <SlidersHorizontal size={15} />
              <span>SIH Demo Controls</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          maxWidth: 'var(--content-max-width)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--accent-primary)',
                  letterSpacing: '0.05em',
                  marginBottom: '4px'
                }}>
                  Phase 0 Complete • Foundation & Contract Initialized
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Personal Health Companion — Desktop Workstation Shell
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Integrated AI Health Belt for Personal Health Monitoring and Safety (SIH26181).
                </p>
              </div>
              <span style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-surface)',
                color: 'var(--accent-primary)',
                fontSize: '12px',
                fontWeight: 600
              }}>
                Phase 0 Verified
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginTop: '16px'
            }}>
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>PROJECT FOUNDATION</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>Vite 6 + React 19 + TypeScript</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Desktop-first layout configured with CSS variables and design tokens.</div>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>GOVERNANCE & DOCS</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>Traceability & Decisions Logged</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>R1–R28 mapped, PDF belt/airbag features recorded, 15h phases sequenced.</div>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>NEXT MILESTONE</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '4px' }}>Phase 1: Desktop Foundation</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Polished Overview, design primitives, and Demo Controls drawer layout.</div>
              </div>
            </div>
          </div>

          {/* Boundaries & Architecture Notice */}
          <div style={{
            backgroundColor: '#FAFAF9',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '20px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            <strong style={{ color: 'var(--text-main)' }}>Demonstration Boundaries Contract:</strong> This frontend application executes local simulation and deterministic rule-based evaluation. Real hardware communication (ESP32/MPU6050/solenoid actuation), real emergency dispatch (SMS/calling), backend databases, user authentication, and clinical ML models are designated future integrations. All risk analysis is transparently labeled as a rule-based demonstration.
          </div>

          {/* Medical Disclaimer */}
          <div style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '12px'
          }}>
            {APP_CONFIG.disclaimer}
          </div>
        </main>
      </div>
    </div>
  );
};
