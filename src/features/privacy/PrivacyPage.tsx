import React, { useState } from 'react';
import { useCompanionStore } from '../../store/companionStore';
import { 
  ShieldCheck, 
  Lock, 
  HardDrive, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  ServerOff,
  Database
} from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { 
    settings, 
    profile, 
    currentReading, 
    environment, 
    riskAssessment, 
    updateSharingChoices, 
    resetDemo, 
    clearLocalData 
  } = useCompanionStore();

  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [confirmDeletionChecked, setConfirmDeletionChecked] = useState<boolean>(false);
  const [demoResetNotice, setDemoResetNotice] = useState<boolean>(false);

  // Helper for live SOS payload preview
  const previewPayload = {
    incidentId: 'preview-sample-01',
    preparedAt: new Date().toISOString(),
    contact: {
      name: profile.emergencyContact.name,
      phone: profile.emergencyContact.phone
    },
    location: settings.sharingChoices.shareLocation 
      ? `${environment.locationLabel} (Demo GPS: 13.0827° N, 80.2707° E)` 
      : null,
    locationProvenance: settings.sharingChoices.shareLocation ? 'Demo location' : 'Not shared (User opted out)',
    vitalsSnapshot: settings.sharingChoices.shareVitals ? {
      hr: currentReading.hr,
      spo2: currentReading.spo2,
      bodyTemp: currentReading.bodyTemperatureC
    } : null,
    riskScore: settings.sharingChoices.shareRiskAssessment ? riskAssessment.overallScore : null,
    severity: settings.sharingChoices.shareRiskAssessment ? riskAssessment.severity : null,
    status: 'prepared_demonstration_only'
  };

  const handleResetDemo = () => {
    resetDemo();
    setDemoResetNotice(true);
    setTimeout(() => setDemoResetNotice(false), 3500);
  };

  const handleExecuteClear = async () => {
    if (!confirmDeletionChecked) return;
    setIsClearModalOpen(false);
    setConfirmDeletionChecked(false);
    await clearLocalData();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1080px', margin: '0 auto' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', margin: '0 0 6px 0' }}>
          Privacy & Data Governance Center
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Strict local edge processing guarantees, granular emergency sharing disclosures, and confirmed data deletion.
        </p>
      </div>

      {/* Demo Reset Temporary Feedback Banner */}
      {demoResetNotice && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            backgroundColor: 'var(--teal-100)',
            border: '1px solid var(--teal-700)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--teal-700)',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={18} />
          <span>Demo scenario reset to Normal. User profile and privacy choices were preserved.</span>
        </div>
      )}

      {/* SECTION 1: Edge Architecture & Cloud Isolation */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          padding: '24px',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--teal-100)',
              color: 'var(--teal-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Architecture & Edge Isolation Guarantees
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Zero external dependencies, local-only evaluation, and verified air-gapped design.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Guarantee 1: Local Laptop Processing */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <HardDrive size={18} color="var(--teal-700)" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                100% Local Laptop Edge
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.45' }}>
              All physiological trend analysis, baseline recalculations, and multi-factor risk assessments execute exclusively on this laptop.
            </p>
          </div>

          {/* Guarantee 2: Cloud Upload Permanently Disabled */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ServerOff size={18} color="var(--risk-critical)" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                Cloud Upload: Disabled
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.45' }}>
              No cloud storage or remote inference servers exist in this prototype. Health data cannot be synced or leaked to external endpoints.
            </p>
          </div>

          {/* Guarantee 3: No Remote Trackers or Analytics */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Lock size={18} color="var(--teal-700)" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                Zero Telemetry & Tracking
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.45' }}>
              Zero third-party trackers, ad cookies, or diagnostic beacon pings. Data lives only in memory and sandboxed browser storage.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Granular Emergency Sharing Choices & Live Payload Preview */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          padding: '24px',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--teal-100)',
              color: 'var(--teal-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Eye size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Granular Emergency Sharing Choices
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Control exactly which data fields are included when an emergency SOS payload is prepared.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Sharing Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Toggle 1: Location */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="var(--teal-700)" />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                    Share Simulated Location
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Includes demo GPS coordinates ({environment.locationLabel}) in the caregiver emergency dispatch record.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.sharingChoices.shareLocation}
                onChange={e => updateSharingChoices({ shareLocation: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--teal-700)', cursor: 'pointer' }}
              />
            </div>

            {/* Toggle 2: Biometric Vitals */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={16} color="var(--teal-700)" />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                    Share Biometric Vitals Snapshot
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Includes real-time heart rate, SpO₂, and body temperature measurements at the moment of escalation.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.sharingChoices.shareVitals}
                onChange={e => updateSharingChoices({ shareVitals: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--teal-700)', cursor: 'pointer' }}
              />
            </div>

            {/* Toggle 3: Risk Assessment */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="var(--teal-700)" />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                    Share AI Risk Assessment & Severity
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Includes multi-factor risk score and anomaly category severity in the prepared payload.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.sharingChoices.shareRiskAssessment}
                onChange={e => updateSharingChoices({ shareRiskAssessment: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--teal-700)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Live SOS Payload Structure Preview */}
          <div
            style={{
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: '#1E292B',
              color: '#DCEFEA',
              padding: '16px',
              fontFamily: 'monospace',
              fontSize: '12px',
              overflowX: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #32494B',
                paddingBottom: '8px',
                marginBottom: '10px',
                color: '#7AC4BA',
                fontWeight: 700
              }}
            >
              <span>Live Prepared SOS Payload Preview</span>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#A0B4B2' }}>Demonstration</span>
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
              {JSON.stringify(previewPayload, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* SECTION 3: Phase 7 PWA Cache & Offline Readiness Placeholder */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          padding: '24px',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--teal-100)',
              color: 'var(--teal-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Database size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Phase 7 App-Shell & Offline Cache Readiness
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Local storage state and service worker offline caching pipeline status.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            backgroundColor: 'var(--surface-muted)',
            borderRadius: '10px',
            padding: '16px',
            border: '1px solid var(--border)'
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
              Browser LocalStorage
            </div>
            <div style={{ fontSize: '12px', color: 'var(--teal-700)', fontWeight: 700, marginTop: '2px' }}>
              ● Operational (Schema Version 1)
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Key: <code>sih26181_companion_state_v1</code>. Stores profile, baseline, alerts, and sharing choices locally.
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
              Service Worker & CacheStorage
            </div>
            <div style={{ fontSize: '12px', color: 'var(--risk-moderate)', fontWeight: 700, marginTop: '2px' }}>
              ◐ Bound for Phase 7 Activation
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Offline PWA caching and static asset pre-caching will be fully activated in Phase 7 implementation.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Data Management & Confirmed Deletion */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          padding: '24px',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--teal-100)',
              color: 'var(--teal-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RotateCcw size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Data Management & Reset Controls
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Distinction between non-destructive demo reset and complete data deletion.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          {/* Card A: Reset Demo Scenario */}
          <div
            style={{
              padding: '18px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface-muted)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                Reset Demo Scenario
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--teal-700)', marginBottom: '6px' }}>
                Non-Destructive • Preserves Profile & Consents
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.45' }}>
                Resets sensor simulator to Normal scenario, resolves active alert episodes, and resets the fall protection timeline. Preserves your name, contact info, and sharing settings.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetDemo}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--teal-700)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={15} />
              Reset Demo Scenario
            </button>
          </div>

          {/* Card B: Confirmed Clear Local Data */}
          <div
            style={{
              padding: '18px',
              borderRadius: '10px',
              border: '1px solid var(--risk-critical)',
              backgroundColor: 'var(--risk-critical-bg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--risk-critical)', marginBottom: '4px' }}>
                Clear Local Data & Erase Everything
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--risk-critical)', marginBottom: '6px' }}>
                Permanent Deletion • Return to Onboarding
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text)', margin: 0, lineHeight: '1.45' }}>
                Stops simulator timers, purges browser LocalStorage, erases profile and alerts, and returns to the initial Onboarding Wizard without silently reseeding demo data.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsClearModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--risk-critical)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Trash2 size={15} />
              Clear Local Data & Erase Everything...
            </button>
          </div>
        </div>
      </div>

      {/* Confirmed Data Deletion Modal */}
      {isClearModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(22, 43, 43, 0.8)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '540px',
              backgroundColor: 'var(--surface)',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--risk-critical-bg)',
                  color: 'var(--risk-critical)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                  Confirm Complete Data Deletion
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Irreversible action: erases all local data and returns to onboarding.
                </p>
              </div>
            </div>

            <div
              style={{
                fontSize: '13px',
                color: 'var(--text)',
                lineHeight: '1.5',
                backgroundColor: 'var(--surface-muted)',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border)'
              }}
            >
              This action will permanently purge:
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>Personal baseline calibrations & resting HR provenance</li>
                <li>Emergency caregiver contact details</li>
                <li>All active and historical alert records</li>
                <li>Prepared SOS payloads</li>
                <li>Browser LocalStorage cache</li>
              </ul>
              <div style={{ marginTop: '8px', color: 'var(--risk-critical)', fontWeight: 600 }}>
                Active timers will stop and you will be returned to the Initial Onboarding Wizard.
              </div>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={confirmDeletionChecked}
                onChange={e => setConfirmDeletionChecked(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--risk-critical)', cursor: 'pointer' }}
              />
              <span>I confirm that I want to permanently erase all local data.</span>
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsClearModalOpen(false);
                  setConfirmDeletionChecked(false);
                }}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!confirmDeletionChecked}
                onClick={handleExecuteClear}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: confirmDeletionChecked ? 'var(--risk-critical)' : 'var(--border)',
                  color: confirmDeletionChecked ? '#FFFFFF' : 'var(--text-tertiary)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: confirmDeletionChecked ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s ease'
                }}
              >
                Permanently Erase All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
