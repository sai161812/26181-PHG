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
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-center justify-center text-[#DC2626] shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#DC2626] uppercase tracking-wider">
                  Assistance & Escalation Workspace
                </span>
                <span className="text-[11px] font-mono text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                  Demonstration Protocol
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#111827]">
                Emergency Assistance & SOS Dispatch
              </h1>
              <p className="text-sm text-[#4B5563] mt-0.5">
                Consent-filtered emergency dispatch preparation with contact verification, location provenance, and payload inspection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#475569]">
              <Clock className="w-3.5 h-3.5 text-[#0E6B62]" />
              <span>Prepared Records: {preparedSOSList.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary SOS Action Card */}
      <div className="bg-gradient-to-r from-[#FEF2F2] via-[#FFF7ED] to-[#FEF2F2] border-2 border-[#FCA5A5] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 bg-[#DC2626] text-white text-[11px] font-bold uppercase rounded-full">
                Primary Action
              </span>
              <span className="text-xs font-semibold text-[#991B1B]">
                Immediate Caregiver Alert Sequence
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#111827]">
              Request Emergency Assistance (SOS)
            </h2>
            <p className="text-xs text-[#4B5563] max-w-xl leading-relaxed">
              Initiates the emergency dispatch sequence. In this laptop demonstration, confirming prepares a local, consent-filtered record containing your vital signs, location, and risk assessment for your configured caregiver.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={handleOpenConfirm}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5 animate-pulse" />
              Send SOS (Demo)
            </Button>
          </div>
        </div>

        {errorReason && (
          <div className="mt-4 p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorReason}</span>
          </div>
        )}
      </div>

      {/* 3 Key Operational Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Registered Emergency Contact */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#0E6B62] uppercase tracking-wider">
              Caregiver Contact
            </span>
            {isContactConfigured ? (
              <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[10px] font-bold rounded-full">
                Configured
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#991B1B] text-[10px] font-bold rounded-full">
                Missing
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#0E6B62]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111827]">
                {profile.emergencyContact.name || 'No Contact Defined'}
              </h4>
              <p className="text-xs text-[#64748B] font-mono">
                {profile.emergencyContact.phone || 'Phone missing'}
              </p>
            </div>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Relationship: <strong>{profile.emergencyContact.relationship || 'Primary Caregiver'}</strong>. Form validation prevents misleading success states if empty.
          </p>
        </div>

        {/* Card 2: Location State & Provenance */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#0E6B62] uppercase tracking-wider">
              Location Provenance
            </span>
            <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] text-[10px] font-mono font-bold rounded-full">
              {isLocationPermitted ? 'Demo GPS' : 'Not Shared'}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111827]">
                {isLocationPermitted ? 'Chennai, Adyar Corridor' : 'Location Hidden'}
              </h4>
              <p className="text-xs text-[#64748B] font-mono">
                {isLocationPermitted ? '13.0827° N, 80.2707° E' : 'Omitted per consent'}
              </p>
            </div>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Source: <strong>Demo location</strong>. Coordinates are simulated locally to protect privacy and function without third-party map APIs.
          </p>
        </div>

        {/* Card 3: Consent Filter Summary */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#0E6B62] uppercase tracking-wider">
              Consent Filtering
            </span>
            <span className="px-2 py-0.5 bg-[#E6F4F1] text-[#0E6B62] text-[10px] font-bold rounded-full">
              Privacy Enforced
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#475569]">Share Location:</span>
              <span className={`font-semibold ${isLocationPermitted ? 'text-[#16A34A]' : 'text-[#94A3B8]'}`}>
                {isLocationPermitted ? 'Permitted' : 'Excluded'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#475569]">Share Vitals Snapshot:</span>
              <span className={`font-semibold ${isVitalsPermitted ? 'text-[#16A34A]' : 'text-[#94A3B8]'}`}>
                {isVitalsPermitted ? 'Permitted' : 'Excluded'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#475569]">Share Risk Assessment:</span>
              <span className={`font-semibold ${isRiskPermitted ? 'text-[#16A34A]' : 'text-[#94A3B8]'}`}>
                {isRiskPermitted ? 'Permitted' : 'Excluded'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#64748B] mt-2.5 pt-2 border-t border-[#F1F5F9]">
            Payload fields reflect these toggles directly; excluded fields are omitted.
          </p>
        </div>
      </div>

      {/* Prepared SOS Payload History & JSON Inspector */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-semibold text-[#0E6B62] uppercase tracking-wider">
              Audit & Verification
            </span>
            <h3 className="text-base font-bold text-[#111827]">
              Prepared SOS Dispatch Payloads
            </h3>
          </div>
          {preparedSOSList.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearPreparedSOS}
              className="text-xs text-[#DC2626] border-[#FCA5A5] hover:bg-[#FEF2F2]"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear Prepared Records
            </Button>
          )}
        </div>

        {preparedSOSList.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-[#E2E8F0] rounded-xl">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8]">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#334155]">No SOS Payloads Prepared Yet</h4>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1">
              Click "Send SOS (Demo)" or trigger the Fall scenario countdown to simulate emergency dispatch payload preparation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Records List Column */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold text-[#475569] uppercase tracking-wider block">
                Recorded Incidents ({preparedSOSList.length})
              </span>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {preparedSOSList.map((rec) => {
                  const isSelected = activeRecordToInspect?.id === rec.id;
                  const dateStr = new Date(rec.preparedAt).toLocaleTimeString();
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRecord(rec)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-[#0E6B62] bg-[#E6F4F1]/40 shadow-sm' 
                          : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-[#0E6B62] font-bold">
                          {rec.incidentId}
                        </span>
                        <span className="text-[#64748B] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dateStr}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#334155]">
                          To: <strong>{rec.contact.name}</strong>
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-[#FEF2F2] text-[#DC2626]">
                          {rec.triggerType || 'manual'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payload JSON Inspector Column */}
            <div className="lg:col-span-7 bg-[#0F172A] rounded-xl p-5 text-white font-mono text-xs overflow-hidden border border-[#334155]">
              {activeRecordToInspect ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#334155] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                      <span className="text-[#E2E8F0] text-xs font-bold font-sans">
                        Local Payload Record Viewer
                      </span>
                    </div>
                    <span className="text-[11px] bg-[#DC2626] text-white px-2 py-0.5 rounded font-sans font-bold">
                      Prepared — Demonstration Only
                    </span>
                  </div>

                  <div className="text-[11px] text-[#38BDF8]">
                    // Explicit Contract: Local demonstration payload only. Zero SMS or cell transmission.
                  </div>

                  <pre className="max-h-[300px] overflow-y-auto text-[#A5F3FC] leading-relaxed select-all">
                    {JSON.stringify(activeRecordToInspect, null, 2)}
                  </pre>

                  <div className="pt-2 border-t border-[#334155] flex flex-wrap items-center justify-between gap-2 text-[11px] font-sans text-[#94A3B8]">
                    <span>Status: <strong>prepared_demonstration_only</strong></span>
                    <span>Nothing dispatched to external networks</span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-[#64748B]">
                  Select an incident from the left to inspect its consent-filtered payload.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Non-Diagnostic Disclaimer Card */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 text-center">
        <p className="text-xs text-[#475569] leading-relaxed max-w-3xl mx-auto">
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
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-[#991B1B]">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed space-y-1">
              <p className="font-bold">
                Confirm Emergency Demonstration Dispatch
              </p>
              <p>
                This will prepare a demonstration SOS payload containing your vital signs and permitted location details for <strong>{profile.emergencyContact.name} ({profile.emergencyContact.phone})</strong>.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#475569] bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
            <div className="font-semibold text-[#111827] mb-1">
              Payload Snapshot Includes:
            </div>
            <div>• Recipient: {profile.emergencyContact.name} ({profile.emergencyContact.phone})</div>
            <div>• Location: {isLocationPermitted ? 'Permitted (Chennai Demo GPS)' : 'Not shared (Filtered by privacy settings)'}</div>
            <div>• Vitals: {isVitalsPermitted ? 'Permitted (Current HR/SpO₂/Temp)' : 'Not shared (Filtered by privacy settings)'}</div>
            <div>• Risk Assessment: {isRiskPermitted ? 'Permitted (Prototype Score & Severity)' : 'Not shared (Filtered by privacy settings)'}</div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              variant="outline"
              onClick={() => setIsSOSConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSendDemoSOS}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold"
            >
              Send SOS (demo)
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
