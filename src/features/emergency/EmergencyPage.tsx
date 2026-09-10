import React, { useState } from 'react';
import { useCompanionStore } from '../../store/companionStore';
import { SOSRecord } from '../../domain/types';
import { Button } from '../../components/common/Button';
import { Dialog } from '../../components/common/Dialog';
import { 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  Clock, 
  FileText, 
  UserCheck,
  Trash2
} from 'lucide-react';

export const EmergencyPage: React.FC = () => {
  const profile = useCompanionStore(s => s.profile);
  const settings = useCompanionStore(s => s.settings);
  const preparedSOSList = useCompanionStore(s => s.preparedSOSList);
  const prepareManualSOS = useCompanionStore(s => s.prepareManualSOS);
  const clearPreparedSOS = useCompanionStore(s => s.clearPreparedSOS);

  const [isSOSConfirmOpen, setIsSOSConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SOSRecord | null>(null);
  const [errorReason, setErrorReason] = useState<string | null>(null);

  const sharingChoices = settings.sharingChoices;
  const isLocationPermitted = sharingChoices.shareLocation;
  const isVitalsPermitted = sharingChoices.shareVitals;
  const isRiskPermitted = sharingChoices.shareRiskAssessment;

  const isContactConfigured = Boolean(
    profile.emergencyContact.name && 
    profile.emergencyContact.phone && 
    profile.emergencyContact.phone.trim().length >= 7
  );

  const handleOpenConfirm = () => {
    setErrorReason(null);
    setIsSOSConfirmOpen(true);
  };

  const handleSendDemoSOS = () => {
    const result = prepareManualSOS();
    setIsSOSConfirmOpen(false);

    if (result.success && result.record) {
      setSelectedRecord(result.record);
    } else {
      setErrorReason(result.reason || 'Failed to prepare emergency payload.');
    }
  };

  // Inspect the latest record by default if none selected
  const activeRecordToInspect = selectedRecord || preparedSOSList[0] || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border)',
          padding: '24px',
          boxShadow: 'var(--shadow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--risk-critical-bg)',
              border: '1px solid var(--risk-critical)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--risk-critical)',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--risk-critical)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Assistance & Escalation Workspace
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-tertiary)', backgroundColor: 'var(--surface-muted)', padding: '2px 6px', borderRadius: '4px' }}>
                Demonstration Protocol
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: '4px 0 0' }}>
              Emergency Assistance & SOS Dispatch
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Consent-filtered emergency dispatch preparation with contact verification, location provenance, and payload inspection.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'var(--canvas)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}
          >
            <Clock size={14} color="var(--teal-700)" />
            <span>Prepared Records: <strong>{preparedSOSList.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Primary SOS Action Card */}
      <div
        style={{
          backgroundColor: 'var(--risk-critical-bg)',
          border: '2px solid var(--risk-critical)',
          borderRadius: 'var(--radius-card)',
          padding: '24px',
          boxShadow: 'var(--shadow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ padding: '2px 8px', backgroundColor: 'var(--risk-critical)', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', borderRadius: '9999px' }}>
                Primary Action
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--risk-critical)' }}>
                Immediate Caregiver Alert Sequence
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>
              Request Emergency Assistance (SOS)
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              Initiates the emergency dispatch sequence. In this laptop demonstration, confirming prepares a local, consent-filtered record containing your vital signs, location, and risk assessment for your configured caregiver.
            </p>
          </div>

          <div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleOpenConfirm}
              style={{
                backgroundColor: 'var(--risk-critical)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                padding: '14px 28px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PhoneCall size={18} />
              Send SOS (Demo)
            </Button>
          </div>
        </div>

        {errorReason && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--risk-critical)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: 'var(--risk-critical)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertTriangle size={14} />
            <span>{errorReason}</span>
          </div>
        )}
      </div>

      {/* 3 Key Operational Context Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Card 1: Registered Emergency Contact */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-card)',
            padding: '20px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--teal-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Caregiver Contact
            </span>
            {isContactConfigured ? (
              <span style={{ padding: '2px 8px', backgroundColor: 'var(--risk-low-bg)', color: 'var(--risk-low)', fontSize: '10px', fontWeight: 700, borderRadius: '9999px' }}>
                Configured
              </span>
            ) : (
              <span style={{ padding: '2px 8px', backgroundColor: 'var(--risk-critical-bg)', color: 'var(--risk-critical)', fontSize: '10px', fontWeight: 700, borderRadius: '9999px' }}>
                Missing
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--teal-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--teal-700)',
                flexShrink: 0
              }}
            >
              <UserCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                {profile.emergencyContact.name || 'No Contact Defined'}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace', margin: '2px 0 0' }}>
                {profile.emergencyContact.phone || 'Phone missing'}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
            Relationship: <strong>{profile.emergencyContact.relationship || 'Primary Caregiver'}</strong>. Form validation prevents misleading success states if empty.
          </p>
        </div>

        {/* Card 2: Location State & Provenance */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-card)',
            padding: '20px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--teal-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Location Provenance
            </span>
            <span style={{ padding: '2px 8px', backgroundColor: 'var(--surface-muted)', color: 'var(--text-secondary)', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, borderRadius: '9999px' }}>
              {isLocationPermitted ? 'Demo GPS' : 'Not Shared'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
                flexShrink: 0
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                {isLocationPermitted ? 'Chennai, Adyar Corridor' : 'Location Hidden'}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace', margin: '2px 0 0' }}>
                {isLocationPermitted ? '13.0827° N, 80.2707° E' : 'Omitted per consent'}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
            Source: <strong>Demo location</strong>. Coordinates are simulated locally to protect privacy and function without third-party map APIs.
          </p>
        </div>

        {/* Card 3: Consent Filter Summary */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-card)',
            padding: '20px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--teal-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Consent Filtering
            </span>
            <span style={{ padding: '2px 8px', backgroundColor: 'var(--teal-50)', color: 'var(--teal-700)', fontSize: '10px', fontWeight: 700, borderRadius: '9999px' }}>
              Privacy Enforced
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Share Location:</span>
              <span style={{ fontWeight: 600, color: isLocationPermitted ? 'var(--risk-low)' : 'var(--text-tertiary)' }}>
                {isLocationPermitted ? 'Permitted' : 'Excluded'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Share Vitals Snapshot:</span>
              <span style={{ fontWeight: 600, color: isVitalsPermitted ? 'var(--risk-low)' : 'var(--text-tertiary)' }}>
                {isVitalsPermitted ? 'Permitted' : 'Excluded'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Share Risk Assessment:</span>
              <span style={{ fontWeight: 600, color: isRiskPermitted ? 'var(--risk-low)' : 'var(--text-tertiary)' }}>
                {isRiskPermitted ? 'Permitted' : 'Excluded'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border)', margin: '10px 0 0' }}>
            Payload fields reflect these toggles directly; excluded fields are omitted.
          </p>
        </div>
      </div>

      {/* Prepared SOS Payload History & JSON Inspector */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border)',
          padding: '24px',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--teal-700)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Audit & Verification
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', margin: '4px 0 0' }}>
              Prepared SOS Dispatch Payloads
            </h3>
          </div>
          {preparedSOSList.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearPreparedSOS}
              style={{
                fontSize: '12px',
                color: 'var(--risk-critical)',
                borderColor: 'var(--risk-critical)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Trash2 size={14} />
              Clear Prepared Records
            </Button>
          )}
        </div>

        {preparedSOSList.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-muted)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 12px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-tertiary)'
              }}
            >
              <FileText size={24} />
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              No SOS Payloads Prepared Yet
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '380px', margin: '4px auto 0' }}>
              Click "Send SOS (Demo)" or trigger the Fall scenario countdown to simulate emergency dispatch payload preparation.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 5fr) minmax(320px, 7fr)',
              gap: '20px'
            }}
          >
            {/* Records List Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Recorded Incidents ({preparedSOSList.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                {preparedSOSList.map((rec) => {
                  const isSelected = activeRecordToInspect?.id === rec.id;
                  const dateStr = new Date(rec.preparedAt).toLocaleTimeString();
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRecord(rec)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '1px solid var(--teal-700)' : '1px solid var(--border)',
                        backgroundColor: isSelected ? 'var(--teal-50)' : 'var(--surface)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'monospace', color: 'var(--teal-800)', fontWeight: 700 }}>
                          {rec.incidentId}
                        </span>
                        <span style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                          <Clock size={12} />
                          {dateStr}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text)' }}>
                          To: <strong>{rec.contact.name}</strong>
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '9999px',
                            backgroundColor: 'var(--risk-critical-bg)',
                            color: 'var(--risk-critical)'
                          }}
                        >
                          {rec.triggerType || 'manual'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payload JSON Inspector Column */}
            <div
              style={{
                backgroundColor: '#0F172A',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                color: '#FFFFFF',
                fontFamily: 'monospace',
                fontSize: '12px',
                border: '1px solid #334155',
                overflow: 'hidden'
              }}
            >
              {activeRecordToInspect ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                      <span style={{ color: '#E2E8F0', fontSize: '12px', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
                        Local Payload Record Viewer
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', backgroundColor: 'var(--risk-critical)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}>
                      Prepared — Demonstration Only
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#38BDF8' }}>
                    // Explicit Contract: Local demonstration payload only. Zero SMS or cell transmission.
                  </div>

                  <pre style={{ maxHeight: '280px', overflowY: 'auto', color: '#A5F3FC', lineHeight: 1.45, userSelect: 'all', margin: 0 }}>
                    {JSON.stringify(activeRecordToInspect, null, 2)}
                  </pre>

                  <div style={{ paddingTop: '10px', borderTop: '1px solid #334155', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '11px', fontFamily: 'system-ui, sans-serif', color: '#94A3B8' }}>
                    <span>Status: <strong>prepared_demonstration_only</strong></span>
                    <span>Nothing dispatched to external networks</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center', color: '#64748B' }}>
                  Select an incident from the left to inspect its consent-filtered payload.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Non-Diagnostic Disclaimer Card */}
      <div
        style={{
          backgroundColor: 'var(--canvas)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          padding: '16px 20px',
          textAlign: 'center'
        }}
      >
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '750px', margin: '0 auto' }}>
          <strong>Mandatory Non-Diagnostic Disclaimer:</strong> This prototype provides wellness and early-risk awareness and is not a medical diagnostic device. Emergency features prepare local records for demonstration only and do not dispatch real ambulances, SMS alerts, or civil defense teams. Seek professional medical advice when necessary.
        </p>
      </div>

      {/* Confirmation Dialog: "Emergency Assistance — Do you need help?" */}
      <Dialog
        isOpen={isSOSConfirmOpen}
        onClose={() => setIsSOSConfirmOpen(false)}
        title="Emergency Assistance — Do you need help?"
        maxWidth="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'var(--risk-critical-bg)',
              border: '1px solid var(--risk-critical)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--risk-critical)'
            }}
          >
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p style={{ fontWeight: 700, margin: 0 }}>
                Confirm Emergency Demonstration Dispatch
              </p>
              <p style={{ margin: 0, color: 'var(--text)' }}>
                This will prepare a demonstration SOS payload containing your vital signs and permitted location details for <strong>{profile.emergencyContact.name} ({profile.emergencyContact.phone})</strong>.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--surface-muted)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
              Payload Snapshot Includes:
            </div>
            <div>• Recipient: {profile.emergencyContact.name} ({profile.emergencyContact.phone})</div>
            <div>• Location: {isLocationPermitted ? 'Permitted (Chennai Demo GPS)' : 'Not shared (Filtered by privacy settings)'}</div>
            <div>• Vitals: {isVitalsPermitted ? 'Permitted (Current HR/SpO₂/Temp)' : 'Not shared (Filtered by privacy settings)'}</div>
            <div>• Risk Assessment: {isRiskPermitted ? 'Permitted (Prototype Score & Severity)' : 'Not shared (Filtered by privacy settings)'}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '12px' }}>
            <Button
              variant="outline"
              onClick={() => setIsSOSConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSendDemoSOS}
              style={{
                backgroundColor: 'var(--risk-critical)',
                color: '#FFFFFF',
                fontWeight: 600
              }}
            >
              Send SOS (demo)
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
