import { describe, it, expect } from 'vitest';
import { FixtureEnvironmentProvider } from '../../adapters/environment/fixtureEnvironmentProvider';
import { LocalStorageRepository } from '../../storage/localRepository';
import { EmergencyManager } from './emergencyManager';
import { DEMO_PROFILE, DEMO_BASELINE } from '../../data/fixtures';
import { SensorReading, RiskAssessment } from '../types';

describe('Phase 7: Offline Operation & Architecture Contracts', () => {
  const dummyReading: SensorReading = {
    id: 'rdg-phase7-01',
    sequence: 1,
    observedAt: 1720000000000,
    source: 'DemoSensorAdapter (ESP32-sim)',
    hr: 74,
    spo2: 98,
    bodyTemperatureC: 36.7,
    activity: 'moderate',
    activityMinutes: 30,
    sleepMinutes: 440,
    motion: 'resting',
    quality: 100
  };

  const dummyAssessment: RiskAssessment = {
    id: 'risk-phase7-01',
    computedAt: 1720000000000,
    inputReadingId: 'rdg-phase7-01',
    environmentId: 'env-phase7-01',
    engineVersion: '2.0-deterministic',
    categoryResults: {} as any,
    overallScore: 18,
    severity: 'low',
    label: 'Nominal physiological baseline',
    factors: [],
    topFactors: [],
    guidanceIds: [],
    confidence: null,
    confidenceText: 'Null for demonstration',
    confidenceDisclosure: 'Rule-based demonstration',
    status: 'full_assessment',
    interpretation: 'All vitals within normal range.'
  };

  describe('1. Environmental Provider Offline Caching & Synthetic Context', () => {
    it('freezes observedAt timestamp when in simulated offline mode without advancing it', async () => {
      const provider = new FixtureEnvironmentProvider('normal');
      const initialSnapshot = await provider.getSnapshot();

      // Enter offline mode
      provider.setOffline(true);
      expect(provider.getIsOffline()).toBe(true);

      const cachedSnapshot = await provider.getSnapshot();
      expect(cachedSnapshot.source).toContain('Cached');
      // Observed timestamp remains frozen
      expect(cachedSnapshot.observedAt).toBe(initialSnapshot.observedAt);
    });

    it('labels scenario switching while offline as synthetic demo context, not a real bulletin', async () => {
      const provider = new FixtureEnvironmentProvider('normal');
      provider.setOffline(true);

      // Presenter switches scenario to heat_wave while offline
      provider.setScenario('heat_wave');
      const syntheticSnapshot = await provider.getSnapshot();

      // Must be marked simulated locally per Section 8
      expect(syntheticSnapshot.source).toBe('Synthetic demo context (Simulated locally)');
      expect(syntheticSnapshot.ambientC).toBe(40);
    });

    it('identifies expired snapshots when validUntil has elapsed', async () => {
      const provider = new FixtureEnvironmentProvider('normal');
      const expiredSnapshot = {
        id: 'env-expired',
        ambientC: 32,
        humidityPct: 60,
        aqi: 60,
        locationLabel: 'Demo residence, Chennai',
        outdoor: false,
        exposureMinutes: 10,
        source: 'Municipal Meteorological Bureau',
        observedAt: Date.now() - 3600000, // 1 hour ago
        validUntil: Date.now() - 1800000 // Expired 30 mins ago
      };

      provider.setSimulatedScenario(expiredSnapshot);
      provider.setOffline(true);

      const result = await provider.getSnapshot();
      expect(result.source).toBe('Outdated — current conditions unavailable');
    });
  });

  describe('2. Local Emergency SOS Offline Isolation', () => {
    it('prepares SOS offline with zero cloud queues or real transmission', () => {
      const provider = new FixtureEnvironmentProvider('normal');
      provider.setOffline(true);

      const choices = {
        shareLocation: true,
        shareVitals: true,
        shareRiskAssessment: true
      };

      const environment = {
        id: 'env-cached-01',
        ambientC: 30,
        humidityPct: 60,
        aqi: 55,
        locationLabel: 'Demo residence, Chennai',
        outdoor: false,
        exposureMinutes: 15,
        source: 'Cached environmental context',
        observedAt: Date.now() - 60000,
        validUntil: Date.now() + 600000
      };

      const sos = EmergencyManager.prepareSOSPayload(
        DEMO_PROFILE,
        choices,
        dummyReading,
        environment,
        dummyAssessment,
        'inc-offline-test',
        'manual'
      );

      // Must be marked prepared demonstration only
      expect(sos.status).toBe('prepared_demonstration_only');
      expect(sos.contact.name).toBe(DEMO_PROFILE.emergencyContact.name);
      expect(sos.location).toContain('Demo GPS: 13.0827° N, 80.2707° E');
    });
  });

  describe('3. Local Storage Persistence & Integrity', () => {
    it('loads and saves without error in storage repository', async () => {
      const repo = new LocalStorageRepository();
      expect(repo.getLastError()).toBeNull();

      const testState = {
        version: 1,
        profile: { ...DEMO_PROFILE },
        baseline: { ...DEMO_BASELINE },
        settings: {
          schemaVersion: 1,
          onboardingComplete: true,
          sharingChoices: { shareLocation: true, shareVitals: true, shareRiskAssessment: true },
          notificationPreference: 'in_app_only' as const,
          simulatedOffline: true,
          accessibilityChoices: { reducedMotion: false, highContrast: false }
        },
        recentAlerts: [],
        deviceStatus: {
          id: 'dev-01',
          name: 'Demo Belt',
          source: 'Sim',
          connection: 'connected' as const,
          batteryPct: 84,
          lastSeenAt: Date.now(),
          motionStatus: 'Stationary',
          protectionState: 'ready' as const,
          components: [],
          timeline: []
        },
        lastUpdated: Date.now()
      };

      await repo.save(testState);
      repo.flushSync();

      const loaded = await repo.load();
      expect(loaded).not.toBeNull();
      expect(loaded?.profile.name).toBe(DEMO_PROFILE.name);
      expect(loaded?.settings.simulatedOffline).toBe(true);
    });
  });
});
