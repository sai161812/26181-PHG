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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(17, 24, 39, 0.65)',
        backdropFilter: 'blur(4px)'
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="fall-checkin-title"
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Urgent header bar */}
        <div style={{ backgroundColor: '#FFF7ED', padding: '16px 24px', borderBottom: '1px solid #FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C2410C' }}>
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Safety Check-In & Protection Sequence
            </span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#9A3412', backgroundColor: '#FFEDD5', padding: '4px 10px', borderRadius: '9999px' }}>
            Belt Incident Active
          </span>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '50%', backgroundColor: '#FFF7ED', border: '2px solid #F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C' }}>
              <AlertTriangle className="w-8 h-8 animate-bounce" />
            </div>
            <h2 id="fall-checkin-title" style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Possible Fall Detected — Are you okay?
            </h2>
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '8px 0 0' }}>
              The integrated health belt’s MPU6050 motion sensor registered an abrupt acceleration impact vector followed by prolonged inactivity.
            </p>
          </div>

          {/* Labeled 20-Second Demo Escalation Countdown */}
          <div style={{ backgroundColor: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <Clock className="w-4 h-4 text-[#F97316]" />
                <span>Demo Escalation Countdown</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: secondsRemaining <= 5 ? '#DC2626' : '#EA580C', fontVariantNumeric: 'tabular-nums' }}>
                {secondsRemaining}s
              </span>
            </div>

            {/* Countdown progress track */}
            <div style={{ width: '100%', backgroundColor: 'var(--border)', height: '10px', borderRadius: '9999px', overflow: 'hidden' }}>
              <div 
                style={{
                  height: '100%',
                  background: 'linear-gradient(to right, #F97316, #EA580C)',
                  width: `${progressPct}%`,
                  transition: 'width 0.3s linear'
                }}
              />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px', margin: '8px 0 0' }}>
              If no confirmation is chosen within 20 seconds, a local demo emergency SOS dispatch payload will be prepared for your registered caregiver.
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <Button
              variant="outline"
              size="lg"
              style={{ width: '100%', justifyContent: 'center', borderWidth: '2px', borderColor: 'var(--teal-700)', color: 'var(--teal-700)', fontWeight: 600, fontSize: '15px', padding: '12px' }}
              onClick={handleImOk}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              I'm OK
            </Button>
            <Button
              variant="primary"
              size="lg"
              style={{ width: '100%', justifyContent: 'center', backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: 600, fontSize: '15px', padding: '12px' }}
              onClick={handleNeedHelp}
            >
              <ShieldAlert className="w-5 h-5 mr-2" />
              Need Help
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
            <span>Simulation ID: {fallCheckIn.incidentId || 'inc-active'}</span>
            <button 
              onClick={cancelFallCheckIn}
              style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
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
