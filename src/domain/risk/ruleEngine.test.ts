import { describe, it, expect } from 'vitest';
import { RuleBasedRiskEngine } from './ruleEngine';
import { getSeverityForScore } from './factorRules';
import { BaselineManager } from '../managers/baselineManager';
import { EmergencyManager } from '../managers/emergencyManager';
import { SCENARIO_SETPOINTS } from '../../data/scenarios';
import { DEMO_BASELINE, DEMO_PROFILE } from '../../data/fixtures';
import { SensorReading, EnvironmentSnapshot } from '../types';

describe('RuleBasedRiskEngine Settlement Scores', () => {
  const engine = new RuleBasedRiskEngine();

  it('evaluates Normal settled state to exactly score 18 (Low)', () => {
    const sp = SCENARIO_SETPOINTS.normal;
    const reading: SensorReading = {
      id: 'rdg-test-normal',
      sequence: 1,
      observedAt: Date.now(),
      ...sp.sensor
    };
    const env: EnvironmentSnapshot = {
      id: 'env-test-normal',
      observedAt: Date.now(),
      validUntil: Date.now() + 15 * 60 * 1000,
      ...sp.environment
    };

    const result = engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });
    expect(result.overallScore).toBe(18);
    expect(result.severity).toBe('low');
    expect(result.confidence).toBeNull();
    expect(result.status).toBe('full_assessment');
  });

  it('evaluates Heat Wave settled state to exactly score 78 (High)', () => {
    const sp = SCENARIO_SETPOINTS.heat_wave;
    const reading: SensorReading = {
      id: 'rdg-test-heat',
      sequence: 1,
      observedAt: Date.now(),
      ...sp.sensor
    };
    const env: EnvironmentSnapshot = {
      id: 'env-test-heat',
      observedAt: Date.now(),
      validUntil: Date.now() + 15 * 60 * 1000,
      ...sp.environment
    };

    const result = engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });
    expect(result.overallScore).toBe(78);
    expect(result.severity).toBe('high');
    expect(result.categoryResults.heat.score).toBe(78);
    expect(result.categoryResults.heat.factors.length).toBe(6); // Ambient, humidity, HR, temp, activity, 30m exposure
  });

  it('evaluates Extreme Heat with 90 min exposure to score 93 (Critical)', () => {
    const sp = SCENARIO_SETPOINTS.heat_wave;
    const reading: SensorReading = {
      id: 'rdg-test-heat-90',
      sequence: 1,
      observedAt: Date.now(),
      ...sp.sensor
    };
    const env: EnvironmentSnapshot = {
      id: 'env-test-heat-90',
      observedAt: Date.now(),
      validUntil: Date.now() + 15 * 60 * 1000,
      ...sp.environment,
      exposureMinutes: 95 // >= 90 min
    };

    const result = engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });
    expect(result.overallScore).toBe(93);
    expect(result.severity).toBe('critical');
    expect(result.categoryResults.heat.score).toBe(93);
  });

  it('evaluates Pollution Event settled state to exactly score 68 (High)', () => {
    const sp = SCENARIO_SETPOINTS.pollution;
    const reading: SensorReading = {
      id: 'rdg-test-pollution',
      sequence: 1,
      observedAt: Date.now(),
      ...sp.sensor
    };
    const env: EnvironmentSnapshot = {
      id: 'env-test-pollution',
      observedAt: Date.now(),
      validUntil: Date.now() + 15 * 60 * 1000,
      ...sp.environment
    };

    const result = engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });
    expect(result.overallScore).toBe(68);
    expect(result.severity).toBe('high');
    expect(result.categoryResults.respiratory.score).toBe(68);
  });

  it('evaluates Fatigue settled state to exactly score 58 (Moderate)', () => {
    const sp = SCENARIO_SETPOINTS.fatigue;
    const reading: SensorReading = {
      id: 'rdg-test-fatigue',
      sequence: 1,
      observedAt: Date.now(),
      ...sp.sensor
    };
    const env: EnvironmentSnapshot = {
      id: 'env-test-fatigue',
      observedAt: Date.now(),
      validUntil: Date.now() + 15 * 60 * 1000,
      ...sp.environment
    };

    const result = engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });
    expect(result.overallScore).toBe(58);
    expect(result.severity).toBe('moderate');
    expect(result.categoryResults.fatigue.score).toBe(58);
  });
});

describe('Risk Band Boundary Edge Cases', () => {
  it('correctly maps 30 (Low) and 31 (Moderate)', () => {
    expect(getSeverityForScore(30)).toBe('low');
    expect(getSeverityForScore(31)).toBe('moderate');
  });

  it('correctly maps 60 (Moderate) and 61 (High)', () => {
    expect(getSeverityForScore(60)).toBe('moderate');
    expect(getSeverityForScore(61)).toBe('high');
  });

  it('correctly maps 80 (High) and 81 (Critical)', () => {
    expect(getSeverityForScore(80)).toBe('high');
    expect(getSeverityForScore(81)).toBe('critical');
  });
});

describe('Missing Data & Stale Input Handling', () => {
  const engine = new RuleBasedRiskEngine();

  it('marks category insufficient_data and overall partial_assessment when HR is missing', () => {
    const reading: SensorReading = {
      id: 'rdg-missing',
      sequence: 1,
      observedAt: Date.now(),
      source: 'Demo',
      hr: null, // Missing HR
      spo2: 98,
      bodyTemperatureC: 36.7,
      activity: 'low',
      activityMinutes: 10,
      sleepMinutes: 440,
      motion: 'resting',
      quality: 50
    };
    const env: EnvironmentSnapshot = {
      id: 'env-normal',
      ambientC: 30,
      humidityPct: 60,
      aqi: 60,
      locationLabel: 'Demo',
      outdoor: false,
      exposureMinutes: 10,
      source: 'Demo',
      observedAt: Date.now(),
      validUntil: Date.now() + 10000
    };

    const result = engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });
    expect(result.categoryResults.heat.status).toBe('insufficient_data');
    expect(result.categoryResults.heat.missingInputs).toContain('hr');
    expect(result.status).toBe('partial_assessment');
  });
});

describe('Baseline Provenance & Deviation Calculations', () => {
  it('calculates resting HR relative percentage deviation correctly', () => {
    expect(BaselineManager.calculateHRDeviationPct(72, 72)).toBe(0);
    expect(BaselineManager.calculateHRDeviationPct(108, 72)).toBe(50);
    expect(BaselineManager.calculateHRDeviationPct(104, 72)).toBe(44);
  });

  it('calculates SpO2 percentage-point difference correctly', () => {
    expect(BaselineManager.calculateSpO2DiffPp(98, 98)).toBe(0);
    expect(BaselineManager.calculateSpO2DiffPp(94, 98)).toBe(4); // 4 percentage points drop
  });
});

describe('Emergency Manager Consent Filtering', () => {
  it('omits location from SOS payload when shareLocation is false', () => {
    const reading: SensorReading = {
      id: 'rdg-1',
      sequence: 1,
      observedAt: Date.now(),
      source: 'Demo',
      hr: 72,
      spo2: 98,
      bodyTemperatureC: 36.7,
      activity: 'low',
      activityMinutes: 10,
      sleepMinutes: 440,
      motion: 'resting',
      quality: 100
    };
    const env: EnvironmentSnapshot = {
      id: 'env-1',
      ambientC: 30,
      humidityPct: 60,
      aqi: 60,
      locationLabel: 'Secret Residence, Room 102',
      outdoor: false,
      exposureMinutes: 10,
      source: 'Demo',
      observedAt: Date.now(),
      validUntil: Date.now() + 10000
    };

    const engine = new RuleBasedRiskEngine();
    const assessment = engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });

    const payload = EmergencyManager.prepareSOSPayload(
      DEMO_PROFILE,
      { shareLocation: false, shareVitals: true, shareRiskAssessment: true },
      reading,
      env,
      assessment
    );

    expect(payload.location).toBeNull();
    expect(payload.vitalsSnapshot).not.toBeNull();
    expect(payload.status).toBe('prepared_demonstration_only');
  });
});
