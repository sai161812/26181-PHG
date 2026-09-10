import React, { useState } from 'react';
import { useCompanionStore } from '../../store/companionStore';
import { DEMO_PROFILE } from '../../data/fixtures';
import { EmergencyManager } from '../../domain/managers/emergencyManager';
import { 
  ShieldCheck, 
  User, 
  PhoneCall, 
  FileCheck2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  HardDrive,
  Activity
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { settings, completeOnboarding } = useCompanionStore();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('Male');
  const [restingHR, setRestingHR] = useState<string>('72');

  const [contactName, setContactName] = useState<string>('');
  const [contactRelationship, setContactRelationship] = useState<string>('Family Member');
  const [contactPhone, setContactPhone] = useState<string>('');

  const [shareLocation, setShareLocation] = useState<boolean>(true);
  const [shareVitals, setShareVitals] = useState<boolean>(true);
  const [shareRiskAssessment, setShareRiskAssessment] = useState<boolean>(true);

  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fast-track: "Use demo profile" (Ravi, 62)
  const handleUseDemoProfile = () => {
    setName(DEMO_PROFILE.name);
    setAge(DEMO_PROFILE.age.toString());
    setGender(DEMO_PROFILE.gender || 'Male');
    setRestingHR(DEMO_PROFILE.restingHR.toString());

    setContactName(DEMO_PROFILE.emergencyContact.name);
    setContactRelationship(DEMO_PROFILE.emergencyContact.relationship);
    setContactPhone(DEMO_PROFILE.emergencyContact.phone);

    setShareLocation(true);
    setShareVitals(true);
    setShareRiskAssessment(true);
    setDisclaimerAccepted(true);
    setErrors({});
    setCurrentStep(4); // Jump to review summary
  };

  // Step 2 Validation: Profile
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      newErrors.age = 'Please enter a valid age between 18 and 120.';
    }
    const hrNum = parseInt(restingHR, 10);
    if (isNaN(hrNum) || hrNum < 40 || hrNum > 120) {
      newErrors.restingHR = 'Resting heart rate must be between 40 and 120 BPM.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 3 Validation: Emergency Contact
  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!contactName.trim()) {
      newErrors.contactName = 'Caregiver contact name is required.';
    }
    if (!EmergencyManager.isContactValid({ name: contactName, phone: contactPhone })) {
      newErrors.contactPhone = 'Please enter a valid phone number (at least 7 digits or demo format).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 2) {
      if (!validateStep2()) return;
    } else if (currentStep === 3) {
      if (!validateStep3()) return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = () => {
    if (!disclaimerAccepted) return;

    completeOnboarding(
      {
        name: name.trim() || 'Ravi',
        age: parseInt(age, 10) || 62,
        gender: gender || 'Male',
        restingHR: parseInt(restingHR, 10) || 72,
        emergencyContact: {
          name: contactName.trim() || 'Demo caregiver',
          relationship: contactRelationship || 'Family Member',
          phone: contactPhone.trim() || '+91 98XXX XXXXX'
        },
        profileOrigin: name === DEMO_PROFILE.name ? 'demo_seed' : 'user_configured'
      },
      {
        shareLocation,
        shareVitals,
        shareRiskAssessment
      }
    );
  };

  // If onboarding is already completed, do not show wizard
  if (settings.onboardingComplete) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(22, 43, 43, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Wizard Header & Progress Bar */}
        <div
          style={{
            padding: '24px 32px 20px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--surface-muted)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--teal-100)',
                  color: 'var(--teal-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                  SIH26181 Health Companion Setup
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Integrated Health Belt & Local Edge-AI Monitoring Workstation
                </p>
              </div>
            </div>

            {/* Use Demo Profile Fast-Track */}
            {currentStep < 4 && (
              <button
                type="button"
                onClick={handleUseDemoProfile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--teal-700)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Quickly fill with default Ravi, 62 demonstration profile"
              >
                <Sparkles size={14} />
                Use demo profile (Ravi, 62)
              </button>
            )}
          </div>

          {/* Stepper Indicator */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { num: 1, label: 'Welcome', icon: ShieldCheck },
              { num: 2, label: 'Profile & Vitals', icon: User },
              { num: 3, label: 'Caregiver & Consents', icon: PhoneCall },
              { num: 4, label: 'Review & Verify', icon: FileCheck2 }
            ].map(step => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div
                  key={step.num}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isCurrent 
                      ? 'var(--surface)' 
                      : isDone 
                        ? 'var(--teal-100)' 
                        : 'transparent',
                    border: isCurrent ? '1px solid var(--teal-700)' : '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: isDone ? 'var(--teal-700)' : isCurrent ? 'var(--teal-700)' : 'var(--border)',
                      color: isDone || isCurrent ? '#FFFFFF' : 'var(--text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    {isDone ? '✓' : step.num}
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? 'var(--teal-700)' : isDone ? 'var(--teal-700)' : 'var(--text-secondary)'
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Scrollable Content Body */}
        <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
          {/* STAGE 1: Welcome & Mission Overview */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: '0 0 6px 0' }}>
                  Welcome to Your Personal Health Companion
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Designed for proactive well-being, heat stress mitigation, and physical fall protection via the Integrated Health Belt.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  marginTop: '8px'
                }}
              >
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-muted)'
                  }}
                >
                  <div style={{ color: 'var(--teal-700)', marginBottom: '8px' }}>
                    <HardDrive size={22} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                    100% Local Laptop Edge
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    All sensor analysis, risk scoring, and rule processing execute locally on this laptop. No health data ever leaves your device.
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-muted)'
                  }}
                >
                  <div style={{ color: 'var(--teal-700)', marginBottom: '8px' }}>
                    <Activity size={22} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                    Transparent AI Scoring
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Transparent multi-factor physiological and environmental hazard analysis. Every risk score displays its contributing factors.
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-muted)'
                  }}
                >
                  <div style={{ color: 'var(--teal-700)', marginBottom: '8px' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                    Fall & Emergency Safety
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Simulated MPU6050 fall telemetry with a 20-second escalation countdown, I'm OK check-in, and local caregiver SOS preparation.
                  </div>
                </div>
              </div>

              {/* Mandatory Non-Diagnostic Disclosure */}
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--surface-muted)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <AlertCircle size={18} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                  <strong style={{ color: 'var(--text)' }}>Prototype Demonstration Only:</strong> This system is developed for the Smart India Hackathon (SIH 26181). It is not a medical device and is not certified for clinical diagnosis, critical life-support, or emergency 911 dispatch.
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: Personal Profile & Resting HR */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px 0' }}>
                  Step 2: Personal Health Profile
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  Enter basic calibration details. We only request resting heart rate to establish baseline comparisons. No intrusive health questionnaires are required.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Full Name <span style={{ color: 'var(--risk-critical)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ravi"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: errors.name ? '1px solid var(--risk-critical)' : '1px solid var(--border)',
                      fontSize: '14px',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text)',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errors.name && (
                    <span style={{ fontSize: '12px', color: 'var(--risk-critical)', marginTop: '4px', display: 'block' }}>
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Age (Years) <span style={{ color: 'var(--risk-critical)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={120}
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g. 62"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: errors.age ? '1px solid var(--risk-critical)' : '1px solid var(--border)',
                      fontSize: '14px',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text)',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errors.age && (
                    <span style={{ fontSize: '12px', color: 'var(--risk-critical)', marginTop: '4px', display: 'block' }}>
                      {errors.age}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Gender (Optional)
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      fontSize: '14px',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text)',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Resting Heart Rate (BPM) <span style={{ color: 'var(--risk-critical)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={120}
                    value={restingHR}
                    onChange={e => setRestingHR(e.target.value)}
                    placeholder="e.g. 72"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: errors.restingHR ? '1px solid var(--risk-critical)' : '1px solid var(--border)',
                      fontSize: '14px',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text)',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errors.restingHR ? (
                    <span style={{ fontSize: '12px', color: 'var(--risk-critical)', marginTop: '4px', display: 'block' }}>
                      {errors.restingHR}
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                      Typical resting pulse (40–120 BPM) used as personal baseline reference.
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--teal-100)',
                  border: '1px solid var(--border)',
                  fontSize: '12px',
                  color: 'var(--teal-700)',
                  lineHeight: '1.4'
                }}
              >
                <strong>Provenance Guarantee:</strong> Setting your resting heart rate here assigns <em>User-defined</em> provenance. It will never be silently overwritten by automated historical rolling averages.
              </div>
            </div>
          )}

          {/* STAGE 3: Emergency Contact & Permissions */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px 0' }}>
                  Step 3: Caregiver Contact & Permissions
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  Designate an emergency caregiver contact and configure what information is shared during an emergency SOS event.
                </p>
              </div>

              {/* Caregiver Contact Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Caregiver Name <span style={{ color: 'var(--risk-critical)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="e.g. Demo caregiver or Dr. Sunita"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: errors.contactName ? '1px solid var(--risk-critical)' : '1px solid var(--border)',
                      fontSize: '14px',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text)',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errors.contactName && (
                    <span style={{ fontSize: '12px', color: 'var(--risk-critical)', marginTop: '4px', display: 'block' }}>
                      {errors.contactName}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Relationship
                  </label>
                  <select
                    value={contactRelationship}
                    onChange={e => setContactRelationship(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      fontSize: '14px',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text)',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Family Member">Family Member</option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="Physician">Physician</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                  Caregiver Telephone Number <span style={{ color: 'var(--risk-critical)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 98XXX XXXXX or 9876543210"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: errors.contactPhone ? '1px solid var(--risk-critical)' : '1px solid var(--border)',
                    fontSize: '14px',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text)',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.contactPhone ? (
                  <span style={{ fontSize: '12px', color: 'var(--risk-critical)', marginTop: '4px', display: 'block' }}>
                    {errors.contactPhone}
                  </span>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                    Demo masked numbers (+91 98XXX XXXXX) or numbers with ≥ 7 digits are accepted.
                  </span>
                )}
              </div>

              {/* Granular Emergency Sharing Permissions */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                  Granular SOS Payload Permissions
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  All notifications are strictly in-app. Default location is simulated locally. No browser OS permission prompts are invoked.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={shareLocation}
                      onChange={e => setShareLocation(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--teal-700)' }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                      Include simulated GPS coordinates in prepared caregiver SOS payload
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={shareVitals}
                      onChange={e => setShareVitals(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--teal-700)' }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                      Include biometric snapshot (HR, SpO₂, body temperature) in emergency record
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={shareRiskAssessment}
                      onChange={e => setShareRiskAssessment(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--teal-700)' }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                      Include AI composite risk score and category severity in emergency record
                    </span>
                  </label>
                </div>

                {/* "Not now" quick toggle to disable all sharing */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShareLocation(false);
                      setShareVitals(false);
                      setShareRiskAssessment(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Opt out of all payload sharing (Not now)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: Review & Non-Diagnostic Agreement */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px 0' }}>
                  Step 4: Review & Final Verification
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  Please review your personal baseline calibration and emergency settings before activating the workstation.
                </p>
              </div>

              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-muted)'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--teal-700)', marginBottom: '8px' }}>
                    Personal Baseline
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text)' }}>
                    <div><strong>Name:</strong> {name || DEMO_PROFILE.name}</div>
                    <div><strong>Age:</strong> {age || DEMO_PROFILE.age} years ({gender})</div>
                    <div><strong>Resting HR:</strong> {restingHR || DEMO_PROFILE.restingHR} BPM</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Provenance: User-entered resting HR
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-muted)'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--teal-700)', marginBottom: '8px' }}>
                    Emergency Caregiver
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text)' }}>
                    <div><strong>Contact:</strong> {contactName || DEMO_PROFILE.emergencyContact.name}</div>
                    <div><strong>Role:</strong> {contactRelationship || DEMO_PROFILE.emergencyContact.relationship}</div>
                    <div><strong>Phone:</strong> {contactPhone || DEMO_PROFILE.emergencyContact.phone}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Location sharing: {shareLocation ? 'Enabled (Simulated)' : 'Excluded'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Governance & Isolation Box */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <HardDrive size={20} color="var(--teal-700)" />
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <strong style={{ color: 'var(--text)' }}>Edge Isolation:</strong> Storage is saved strictly in your browser's LocalStorage. Cloud upload is permanently disabled. No telemetry or analytics exist in this prototype.
                </div>
              </div>

              {/* Mandatory Non-Diagnostic Disclaimer Checkbox */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '10px',
                  border: disclaimerAccepted ? '1px solid var(--teal-700)' : '1px solid var(--risk-moderate)',
                  backgroundColor: disclaimerAccepted ? 'var(--teal-100)' : 'var(--risk-moderate-bg)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={e => setDisclaimerAccepted(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--teal-700)', marginTop: '2px', cursor: 'pointer' }}
                />
                <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: '1.45' }}>
                  <strong>Mandatory Prototype Disclaimer:</strong> I acknowledge that SIH26181 Health Companion is an experimental prototype created for demonstration purposes. It does not provide medical diagnosis, clinical triage, or real-world emergency dispatch services.
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div
          style={{
            padding: '18px 32px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--surface-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
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
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Step 1 of 4: Setup & Architecture
              </span>
            )}
          </div>

          <div>
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--teal-700)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Continue
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={!disclaimerAccepted}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: disclaimerAccepted ? 'var(--teal-700)' : 'var(--border)',
                  color: disclaimerAccepted ? '#FFFFFF' : 'var(--text-tertiary)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: disclaimerAccepted ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s ease'
                }}
              >
                <CheckCircle2 size={16} />
                Complete Setup & Launch Workstation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
