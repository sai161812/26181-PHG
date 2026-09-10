import React, { useState, useEffect } from 'react';
import { useCompanionStore } from '../../store/companionStore';
import { ShieldAlert, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '../../components/common/Button';

interface FallCheckInModalProps {
  onNavigateToEmergency?: () => void;
}

export const FallCheckInModal: React.FC<FallCheckInModalProps> = ({ onNavigateToEmergency }) => {
  const fallCheckIn = useCompanionStore(s => s.fallCheckIn);
  const respondFallCheckIn = useCompanionStore(s => s.respondFallCheckIn);
  const handleFallTimeout = useCompanionStore(s => s.handleFallTimeout);
  const cancelFallCheckIn = useCompanionStore(s => s.cancelFallCheckIn);

  const [secondsRemaining, setSecondsRemaining] = useState<number>(20);

  useEffect(() => {
    if (!fallCheckIn.isOpen || !fallCheckIn.deadline) return;

    const updateTimer = () => {
      const now = Date.now();
      const left = Math.max(0, Math.ceil((fallCheckIn.deadline! - now) / 1000));
      setSecondsRemaining(left);

      if (left <= 0) {
        handleFallTimeout();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 250);

    return () => clearInterval(interval);
  }, [fallCheckIn.isOpen, fallCheckIn.deadline, handleFallTimeout]);

  if (!fallCheckIn.isOpen) return null;

  const handleImOk = () => {
    respondFallCheckIn('ok');
  };

  const handleNeedHelp = () => {
    respondFallCheckIn('need_help');
    if (onNavigateToEmergency) {
      onNavigateToEmergency();
    }
  };

  const progressPct = Math.max(0, Math.min(100, (secondsRemaining / 20) * 100));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/60 backdrop-blur-sm animate-fadeIn"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="fall-checkin-title"
    >
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#F97316]/30 overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.25)'
        }}
      >
        {/* Urgent header bar */}
        <div className="bg-[#FFF7ED] px-6 py-4 border-b border-[#FFEDD5] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#C2410C]">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Safety Check-In & Protection Sequence
            </span>
          </div>
          <span className="text-xs font-medium text-[#9A3412] bg-[#FFEDD5] px-2.5 py-1 rounded-full">
            Belt Incident Active
          </span>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFF7ED] border-2 border-[#F97316] flex items-center justify-center text-[#EA580C]">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
            </div>
            <h2 id="fall-checkin-title" className="text-2xl font-bold text-[#111827]">
              Possible Fall Detected — Are you okay?
            </h2>
            <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">
              The integrated health belt’s MPU6050 motion sensor registered an abrupt acceleration impact vector followed by prolonged inactivity.
            </p>
          </div>

          {/* Labeled 20-Second Demo Escalation Countdown */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#475569]">
                <Clock className="w-4 h-4 text-[#F97316]" />
                <span>Demo Escalation Countdown</span>
              </div>
              <span className={`text-lg font-bold font-mono ${secondsRemaining <= 5 ? 'text-[#DC2626] animate-pulse' : 'text-[#EA580C]'}`}>
                {secondsRemaining}s
              </span>
            </div>

            {/* Countdown progress track */}
            <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[11px] text-[#64748B] mt-2">
              If no confirmation is chosen within 20 seconds, a local demo emergency SOS dispatch payload will be prepared for your registered caregiver.
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center border-2 border-[#0E6B62] text-[#0E6B62] hover:bg-[#E6F4F1] font-semibold text-base py-3"
              onClick={handleImOk}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              I'm OK
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-base py-3 shadow-md"
              onClick={handleNeedHelp}
            >
              <ShieldAlert className="w-5 h-5 mr-2" />
              Need Help
            </Button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-[11px] text-[#64748B]">
            <span>Simulation ID: {fallCheckIn.incidentId || 'inc-active'}</span>
            <button 
              onClick={cancelFallCheckIn}
              className="hover:underline text-[#475569]"
            >
              Dismiss (Demo)
            </button>
          </div>
        </div>

        {/* Truthful non-clinical disclaimer */}
        <div className="bg-[#F8FAFC] px-6 py-2.5 border-t border-[#E2E8F0] text-center">
          <p className="text-[11px] text-[#64748B]">
            <span className="font-semibold text-[#334155]">Demonstration Sequence:</span> Local evaluation only; no actual sirens, cellular signals, or emergency responders are summoned.
          </p>
        </div>
      </div>
    </div>
  );
};
