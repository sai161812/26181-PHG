import React, { useState, useEffect } from 'react';
import { useCompanionStore } from '../../store/companionStore';
import { EmergencyManager } from '../../domain/managers/emergencyManager';
import { 
  User, 
  Heart, 
  PhoneCall, 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  Save, 
  X,
  Sparkles,
  Info
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { 
    profile, 
    baseline, 
    settings, 
    updateProfile, 
    updateAccessibilityChoices, 
    relaunchOnboarding,
    resetToDemoProfile 
  } = useCompanionStore();

  // Local Form State
  const [name, setName] = useState<string>(profile.name);
  const [age, setAge] = useState<string>(profile.age ? profile.age.toString() : '');
  const [gender, setGender] = useState<string>(profile.gender || 'Male');
  const [restingHR, setRestingHR] = useState<string>(profile.restingHR ? profile.restingHR.toString() : '72');

  const [contactName, setContactName] = useState<string>(profile.emergencyContact.name);
  const [contactRelationship, setContactRelationship] = useState<string>(profile.emergencyContact.relationship);
  const [contactPhone, setContactPhone] = useState<string>(profile.emergencyContact.phone);

  // Status & Feedback
  const [isPristine, setIsPristine] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Sync state if store updates from outside (e.g. demo reset)
  useEffect(() => {
    setName(profile.name);
    setAge(profile.age ? profile.age.toString() : '');
    setGender(profile.gender || 'Male');
    setRestingHR(profile.restingHR ? profile.restingHR.toString() : '72');
    setContactName(profile.emergencyContact.name);
    setContactRelationship(profile.emergencyContact.relationship);
    setContactPhone(profile.emergencyContact.phone);
    setIsPristine(true);
    setErrors({});
  }, [profile]);

  // Track changes to form
  const checkDirty = (
    nextName: string,
    nextAge: string,
    nextGender: string,
    nextHR: string,
    nextCName: string,
    nextCRel: string,
    nextCPhone: string
  ) => {
    const dirty = 
      nextName !== profile.name ||
      nextAge !== (profile.age ? profile.age.toString() : '') ||
      nextGender !== (profile.gender || 'Male') ||
      nextHR !== (profile.restingHR ? profile.restingHR.toString() : '72') ||
      nextCName !== profile.emergencyContact.name ||
      nextCRel !== profile.emergencyContact.relationship ||
      nextCPhone !== profile.emergencyContact.phone;
    setIsPristine(!dirty);
    setSaveSuccess(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name cannot be empty.';
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      newErrors.age = 'Age must be between 18 and 120.';
    }

    const hrNum = parseInt(restingHR, 10);
    if (isNaN(hrNum) || hrNum < 40 || hrNum > 120) {
      newErrors.restingHR = 'Resting heart rate must be between 40 and 120 BPM.';
    }

    if (!contactName.trim()) {
      newErrors.contactName = 'Caregiver contact name is required.';
    }

    if (!EmergencyManager.isContactValid({ name: contactName, phone: contactPhone })) {
      newErrors.contactPhone = 'Valid telephone number is required (at least 7 digits or demo format).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ageNum = parseInt(age, 10);
    const hrNum = parseInt(restingHR, 10);

    updateProfile({
      name: name.trim(),
      age: ageNum,
      gender,
      restingHR: hrNum,
      emergencyContact: {
        name: contactName.trim(),
        relationship: contactRelationship,
        phone: contactPhone.trim()
      },
      profileOrigin: 'user_configured'
    });

    setIsPristine(true);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleCancel = () => {
    setName(profile.name);
    setAge(profile.age ? profile.age.toString() : '');
    setGender(profile.gender || 'Male');
    setRestingHR(profile.restingHR ? profile.restingHR.toString() : '72');
    setContactName(profile.emergencyContact.name);
    setContactRelationship(profile.emergencyContact.relationship);
    setContactPhone(profile.emergencyContact.phone);
    setIsPristine(true);
    setErrors({});
    setSaveSuccess(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1080px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', margin: '0 0 6px 0' }}>
            Profile & Settings
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Manage personal baseline metrics, emergency caregiver contacts, and interface accessibility preferences.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={resetToDemoProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--teal-700)',
              cursor: 'pointer'
            }}
            title="Restore default Ravi, 62 demo parameters"
          >
            <Sparkles size={15} />
            Reset to Demo Profile (Ravi, 62)
          </button>

          <button
            type="button"
            onClick={relaunchOnboarding}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text)',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={15} />
            Replay Onboarding
          </button>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {saveSuccess && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            backgroundColor: 'var(--risk-low-bg)',
            border: '1px solid var(--risk-low)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--risk-low)',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={18} />
          <span>Profile changes and baseline resting HR saved and persisted locally.</span>
        </div>
      )}

      {/* Main Form Form Container */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* SECTION 1: Personal Demographic & Vitals Calibration */}
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
              <User size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                Personal Demographics & Vitals Calibration
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Core user parameters used for physiological anomaly detection and risk scoring.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Full Name <span style={{ color: 'var(--risk-critical)' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  checkDirty(e.target.value, age, gender, restingHR, contactName, contactRelationship, contactPhone);
                }}
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

            {/* Age */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Age (Years) <span style={{ color: 'var(--risk-critical)' }}>*</span>
              </label>
              <input
                type="number"
                min={18}
                max={120}
                value={age}
                onChange={e => {
                  setAge(e.target.value);
                  checkDirty(name, e.target.value, gender, restingHR, contactName, contactRelationship, contactPhone);
                }}
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

            {/* Gender */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Gender
              </label>
              <select
                value={gender}
                onChange={e => {
                  setGender(e.target.value);
                  checkDirty(name, age, e.target.value, restingHR, contactName, contactRelationship, contactPhone);
                }}
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

            {/* Resting Heart Rate */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Resting Heart Rate (BPM) <span style={{ color: 'var(--risk-critical)' }}>*</span>
              </label>
              <input
                type="number"
                min={40}
                max={120}
                value={restingHR}
                onChange={e => {
                  setRestingHR(e.target.value);
                  checkDirty(name, age, gender, e.target.value, contactName, contactRelationship, contactPhone);
                }}
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
              {errors.restingHR && (
                <span style={{ fontSize: '12px', color: 'var(--risk-critical)', marginTop: '4px', display: 'block' }}>
                  {errors.restingHR}
                </span>
              )}
            </div>
          </div>

          {/* Resting HR Provenance Badge & Truthful Disclosure */}
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={16} color="var(--teal-700)" />
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                Baseline Resting HR Status: <strong>{baseline.restingHR} BPM</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: baseline.isManualRestingHR ? 'var(--teal-100)' : 'var(--border)',
                  color: baseline.isManualRestingHR ? 'var(--teal-700)' : 'var(--text-secondary)'
                }}
              >
                {baseline.isManualRestingHR ? 'User Defined (Protected)' : 'Seeded Demo Baseline'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Source: {baseline.source}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Emergency Contact & Caregiver Details */}
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
              <PhoneCall size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                Emergency Caregiver Contact
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Designated contact for simulated fall escalations and local emergency payload preparation.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            {/* Caregiver Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Contact Name <span style={{ color: 'var(--risk-critical)' }}>*</span>
              </label>
              <input
                type="text"
                value={contactName}
                onChange={e => {
                  setContactName(e.target.value);
                  checkDirty(name, age, gender, restingHR, e.target.value, contactRelationship, contactPhone);
                }}
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

            {/* Relationship */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Relationship
              </label>
              <select
                value={contactRelationship}
                onChange={e => {
                  setContactRelationship(e.target.value);
                  checkDirty(name, age, gender, restingHR, contactName, e.target.value, contactPhone);
                }}
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

            {/* Telephone Number */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Telephone Number <span style={{ color: 'var(--risk-critical)' }}>*</span>
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => {
                  setContactPhone(e.target.value);
                  checkDirty(name, age, gender, restingHR, contactName, contactRelationship, e.target.value);
                }}
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
                  Demo format (+91 98XXX XXXXX) or standard numbers (≥ 7 digits).
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: Form Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPristine}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: isPristine ? 'var(--text-tertiary)' : 'var(--text)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isPristine ? 'not-allowed' : 'pointer',
              opacity: isPristine ? 0.6 : 1
            }}
          >
            <X size={15} />
            Cancel Changes
          </button>

          <button
            type="submit"
            disabled={isPristine}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isPristine ? 'var(--border)' : 'var(--teal-700)',
              color: isPristine ? 'var(--text-tertiary)' : '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: isPristine ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Save size={15} />
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* SECTION 4: Accessibility & Interface Preferences */}
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
            <Sliders size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Interface & Accessibility Preferences
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Adjust motion dynamics, contrast enhancements, and delivery notification channels.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Reduced Motion Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)'
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                Reduced Motion
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Minimizes real-time sensor waveform and transition animations for calmer viewing.
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.accessibilityChoices.reducedMotion}
              onChange={e => updateAccessibilityChoices({ reducedMotion: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--teal-700)', cursor: 'pointer' }}
            />
          </div>

          {/* High Contrast Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)'
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                High Contrast Elements
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Increases border weights and text contrast ratios across analytical panels.
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.accessibilityChoices.highContrast}
              onChange={e => updateAccessibilityChoices({ highContrast: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--teal-700)', cursor: 'pointer' }}
            />
          </div>

          {/* Notification Channel Pill */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)'
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                Alert Notification Channel
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Standard delivery channel for physiological anomalies and hazard advisories.
              </div>
            </div>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                backgroundColor: 'var(--teal-100)',
                color: 'var(--teal-700)',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              In-app notifications only (Local prototype)
            </span>
          </div>
        </div>
      </div>

      {/* Non-Diagnostic Disclaimer Footer */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: '10px',
          backgroundColor: 'var(--surface-muted)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <Info size={16} color="var(--text-secondary)" />
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          <strong>Prototype Disclaimer:</strong> Settings and profile adjustments are stored exclusively in your local browser storage. This workstation does not upload medical telemetry to external servers and is not certified for clinical diagnostic use.
        </div>
      </div>
    </div>
  );
};
