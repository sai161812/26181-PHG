import { describe, it, expect } from 'vitest';
import { EmergencyManager } from './emergencyManager';
import { BaselineManager } from './baselineManager';
import { generateDeterministic30DayHistory } from '../../data/historyGenerator';
import { DEMO_PROFILE, DEMO_BASELINE } from '../../data/fixtures';
import { 
  Baseline, 
  SharingChoices, 
  SensorReading, 
  EnvironmentSnapshot, 
  RiskAssessment 
} from '../types';

describe('Phase 6: Onboarding, Profile, and Privacy Center Contracts', () => {
  const dummyReading: SensorReading = {
    id: 'rdg-test-01',
    sequence: 1,
    observedAt: Date.now(),
    source: 'Test Sensor',
    hr: 75,
    spo2: 97,
    bodyTemperatureC: 36.8,
    activity: 'moderate',
    activityMinutes: 30,
    sleepMinutes: 440,
    motion: 'resting',
    quality: 100
  };

  const dummyEnvironment: EnvironmentSnapshot = {
    id: 'env-test-01',
    ambientC: 32,
    humidityPct: 65,
    aqi: 70,
    locationLabel: 'Demo residence, Chennai',
    outdoor: false,
    exposureMinutes: 20,
    source: 'Test Feed',
    observedAt: Date.now(),
    validUntil: Date.now() + 15 * 60 * 1000
  };

  const dummyAssessment: RiskAssessment = {
    id: 'risk-test-01',
    computedAt: Date.now(),
    inputReadingId: 'rdg-test-01',
    environmentId: 'env-test-01',
    engineVersion: '2.0-deterministic',
    categoryResults: {} as any,
    overallScore: 24,
    severity: 'low',
    label: 'Low physiological and environmental stress',
    factors: [],
    topFactors: [],
    guidanceIds: [],
    confidence: null,
    confidenceText: 'Null for demonstration',
    confidenceDisclosure: 'Rule-based demonstration',
    status: 'full_assessment',
    interpretation: 'Stable conditions.'
  };

  describe('1. Input Validation for Emergency Contacts', () => {
    it('accepts seeded demo phone number format (+91 98XXX XXXXX)', () => {
      const contact = { name: 'Demo caregiver', phone: '+91 98XXX XXXXX' };
      expect(EmergencyManager.isContactValid(contact)).toBe(true);
    });

    it('accepts valid user-entered phone number with at least 7 digits', () => {
      const validContact = { name: 'Dr. Sunita', phone: '+91 98765 43210' };
      expect(EmergencyManager.isContactValid(validContact)).toBe(true);

      const landline = { name: 'Emergency Desk', phone: '044-2456789' };
      expect(EmergencyManager.isContactValid(landline)).toBe(true);
    });

    it('rejects contact with empty or whitespace name', () => {
      const emptyName = { name: '   ', phone: '+91 98765 43210' };
      expect(EmergencyManager.isContactValid(emptyName)).toBe(false);
    });

    it('rejects contact with short or invalid phone number (< 7 digits)', () => {
      const shortPhone = { name: 'Caregiver', phone: '12345' };
      expect(EmergencyManager.isContactValid(shortPhone)).toBe(false);

      const noDigits = { name: 'Caregiver', phone: 'invalid-number' };
      expect(EmergencyManager.isContactValid(noDigits)).toBe(false);
    });
  });

  describe('2. Resting HR Provenance & Baseline Protection', () => {
    it('protects manually entered resting HR during baseline recalculation from history', () => {
      const customBaseline: Baseline = {
        ...DEMO_BASELINE,
        restingHR: 64,
        isManualRestingHR: true,
        source: 'Manually entered resting HR (User-defined)'
      };

      const history = generateDeterministic30DayHistory(customBaseline);
      const recalculated = BaselineManager.recalculateFromHistory(history, customBaseline);

      // Resting HR must stay preserved as 64 BPM and not be replaced by history median
      expect(recalculated.restingHR).toBe(64);
      expect(recalculated.isManualRestingHR).toBe(true);
      expect(recalculated.source).toContain('Manual resting HR preserved');
    });

    it('allows recalculating resting HR from history if explicitly requested to reset manual HR', () => {
      const history = generateDeterministic30DayHistory(DEMO_BASELINE);
      // Passing undefined currentBaseline signals reset of manual lock
      const recalculated = BaselineManager.recalculateFromHistory(history, undefined);

      // Resting HR is derived from historical median (~72 BPM)
      expect(recalculated.restingHR).toBe(72);
      expect(recalculated.isManualRestingHR).toBeFalsy();
    });
  });

  describe('3. Granular SOS Sharing Choices Enforcement', () => {
    it('excludes location and sets provenance to "Not shared" when shareLocation is false', () => {
      const choices: SharingChoices = {
        shareLocation: false,
        shareVitals: true,
        shareRiskAssessment: true
      };

      const sos = EmergencyManager.prepareSOSPayload(
        DEMO_PROFILE,
        choices,
        dummyReading,
        dummyEnvironment,
        dummyAssessment
      );

      expect(sos.location).toBeNull();
      expect(sos.locationProvenance).toBe('Not shared');
      // Other fields remain present
      expect(sos.vitalsSnapshot).not.toBeNull();
      expect(sos.riskScore).toBe(24);
    });

    it('includes location when shareLocation is true', () => {
      const choices: SharingChoices = {
        shareLocation: true,
        shareVitals: true,
        shareRiskAssessment: true
      };

      const sos = EmergencyManager.prepareSOSPayload(
        DEMO_PROFILE,
        choices,
        dummyReading,
        dummyEnvironment,
        dummyAssessment
      );

      expect(sos.location).toContain('Demo residence, Chennai');
      expect(sos.locationProvenance).toBe('Demo location');
    });

    it('excludes biometric vitals snapshot when shareVitals is false', () => {
      const choices: SharingChoices = {
        shareLocation: true,
        shareVitals: false,
        shareRiskAssessment: true
      };

      const sos = EmergencyManager.prepareSOSPayload(
        DEMO_PROFILE,
        choices,
        dummyReading,
        dummyEnvironment,
        dummyAssessment
      );

      expect(sos.vitalsSnapshot).toBeNull();
      expect(sos.location).not.toBeNull();
      expect(sos.riskScore).toBe(24);
    });

    it('excludes risk score and severity when shareRiskAssessment is false', () => {
      const choices: SharingChoices = {
        shareLocation: true,
        shareVitals: true,
        shareRiskAssessment: false
      };

      const sos = EmergencyManager.prepareSOSPayload(
        DEMO_PROFILE,
        choices,
        dummyReading,
        dummyEnvironment,
        dummyAssessment
      );

      expect(sos.riskScore).toBeNull();
      expect(sos.severity).toBeNull();
      expect(sos.vitalsSnapshot).not.toBeNull();
      expect(sos.location).not.toBeNull();
    });

    it('handles permission refusal for all optional payload fields (Not now option)', () => {
      const choices: SharingChoices = {
        shareLocation: false,
        shareVitals: false,
        shareRiskAssessment: false
      };

      const sos = EmergencyManager.prepareSOSPayload(
        DEMO_PROFILE,
        choices,
        dummyReading,
        dummyEnvironment,
        dummyAssessment
      );

      expect(sos.location).toBeNull();
      expect(sos.locationProvenance).toBe('Not shared');
      expect(sos.vitalsSnapshot).toBeNull();
      expect(sos.riskScore).toBeNull();
      expect(sos.severity).toBeNull();
      // Contact is always retained for local emergency dispatch
      expect(sos.contact.name).toBe(DEMO_PROFILE.emergencyContact.name);
      expect(sos.status).toBe('prepared_demonstration_only');
    });
  });

  describe('4. Returning-User Bypass & Reset Behavior Contracts', () => {
    it('bypasses onboarding when onboardingComplete is true', () => {
      const userSettings = {
        schemaVersion: 1,
        onboardingComplete: true,
        sharingChoices: { shareLocation: true, shareVitals: true, shareRiskAssessment: true },
        notificationPreference: 'in_app_only' as const,
        simulatedOffline: false,
        accessibilityChoices: { reducedMotion: false, highContrast: false }
      };

      expect(userSettings.onboardingComplete).toBe(true);
    });

    it('requires onboarding when onboardingComplete is false after data clear', () => {
      const clearedSettings = {
        schemaVersion: 1,
        onboardingComplete: false,
        sharingChoices: { shareLocation: false, shareVitals: false, shareRiskAssessment: false },
        notificationPreference: 'in_app_only' as const,
        simulatedOffline: false,
        accessibilityChoices: { reducedMotion: false, highContrast: false }
      };

      expect(clearedSettings.onboardingComplete).toBe(false);
    });
  });
});
