import { describe, it, expect } from 'vitest';
import { AlertManager } from './alertManager';
import { RuleBasedRiskEngine } from '../risk/ruleEngine';
import { SCENARIO_SETPOINTS } from '../../data/scenarios';
import { DEMO_BASELINE } from '../../data/fixtures';
import { SensorReading, EnvironmentSnapshot, Alert, RiskAssessment } from '../types';

describe('AlertManager Section 6 Rules', () => {
  const engine = new RuleBasedRiskEngine();

  const createDummySnapshot = (): Alert['inputSnapshot'] => ({
    hr: 108,
    spo2: 97,
    bodyTemp: 37.7,
    ambientC: 40,
    humidity: 78,
    aqi: 60
  });

  const getHeatAssessment = (severity: 'high' | 'critical' = 'high'): RiskAssessment => {
    const sp = SCENARIO_SETPOINTS.heat_wave;
    const reading: SensorReading = {
      id: 'rdg-heat',
      sequence: 1,
      observedAt: Date.now(),
      ...sp.sensor
    };
    const env: EnvironmentSnapshot = {
      id: 'env-heat',
      observedAt: Date.now(),
      validUntil: Date.now() + 15 * 60 * 1000,
      ...sp.environment,
      exposureMinutes: severity === 'critical' ? 95 : 45
    };
    return engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });
  };

  const getNormalAssessment = (): RiskAssessment => {
    const sp = SCENARIO_SETPOINTS.normal;
    const reading: SensorReading = {
      id: 'rdg-normal',
      sequence: 2,
      observedAt: Date.now(),
      ...sp.sensor
    };
    const env: EnvironmentSnapshot = {
      id: 'env-normal',
      observedAt: Date.now(),
      validUntil: Date.now() + 15 * 60 * 1000,
      ...sp.environment
    };
    return engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });
  };

  it('does NOT trigger an alert on 1 qualifying high sample', () => {
    const manager = new AlertManager();
    const heatAssessment = getHeatAssessment('high');
    const snapshot = createDummySnapshot();

    const alertsAfter1Sample = manager.processAssessment(heatAssessment, snapshot, []);
    expect(alertsAfter1Sample.length).toBe(0);
  });

  it('triggers an active alert episode on 2 consecutive qualifying high samples', () => {
    const manager = new AlertManager();
    const heatAssessment = getHeatAssessment('high');
    const snapshot = createDummySnapshot();

    // Sample 1
    const alerts1 = manager.processAssessment(heatAssessment, snapshot, []);
    expect(alerts1.length).toBe(0);

    // Sample 2 (qualifies!)
    const alerts2 = manager.processAssessment(heatAssessment, snapshot, alerts1);
    expect(alerts2.length).toBe(1);
    expect(alerts2[0].category).toBe('heat');
    expect(alerts2[0].severity).toBe('high');
    expect(alerts2[0].consecutiveSamples).toBe(2);
    expect(alerts2[0].resolvedAt).toBeNull();
  });

  it('deduplicates alerts: sustained high samples do not create duplicate rows', () => {
    const manager = new AlertManager();
    const heatAssessment = getHeatAssessment('high');
    const snapshot = createDummySnapshot();

    let alerts: Alert[] = [];
    // 5 consecutive high samples
    for (let i = 1; i <= 5; i++) {
      alerts = manager.processAssessment(heatAssessment, snapshot, alerts);
    }

    // Exactly 1 alert row exists, with consecutiveSamples tracked and updated timestamp
    expect(alerts.length).toBe(1);
    expect(alerts[0].consecutiveSamples).toBe(5);
    expect(alerts[0].category).toBe('heat');
    expect(alerts[0].resolvedAt).toBeNull();
  });

  it('resolves active episode only after 3 consecutive normal samples', () => {
    const manager = new AlertManager();
    const heatAssessment = getHeatAssessment('high');
    const normalAssessment = getNormalAssessment();
    const snapshot = createDummySnapshot();

    // Trigger heat episode (2 samples)
    let alerts = manager.processAssessment(heatAssessment, snapshot, []);
    alerts = manager.processAssessment(heatAssessment, snapshot, alerts);
    expect(alerts.length).toBe(1);
    expect(alerts[0].resolvedAt).toBeNull();

    // Normal sample 1 -> still active
    alerts = manager.processAssessment(normalAssessment, snapshot, alerts);
    expect(alerts[0].resolvedAt).toBeNull();

    // Normal sample 2 -> still active
    alerts = manager.processAssessment(normalAssessment, snapshot, alerts);
    expect(alerts[0].resolvedAt).toBeNull();

    // Normal sample 3 -> resolves!
    alerts = manager.processAssessment(normalAssessment, snapshot, alerts);
    expect(alerts[0].resolvedAt).not.toBeNull();
    expect(typeof alerts[0].resolvedAt).toBe('number');
  });

  it('triggers fall immediately on 1 sample (critical airbag sequence)', () => {
    const manager = new AlertManager();
    const sp = SCENARIO_SETPOINTS.fall;
    const reading: SensorReading = {
      id: 'rdg-fall',
      sequence: 1,
      observedAt: Date.now(),
      ...sp.sensor
    };
    const env: EnvironmentSnapshot = {
      id: 'env-fall',
      observedAt: Date.now(),
      validUntil: Date.now() + 15 * 60 * 1000,
      ...sp.environment
    };

    const fallAssessment = engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });
    const snapshot = createDummySnapshot();

    // 1 sample is sufficient for fall
    const alerts = manager.processAssessment(fallAssessment, snapshot, []);
    expect(alerts.length).toBe(1);
    expect(alerts[0].category).toBe('fall');
    expect(alerts[0].severity).toBe('critical');
    expect(alerts[0].title).toContain('Airbag Protection Sequence Armed');
  });

  it('escalates severity if condition worsens from high to critical', () => {
    const manager = new AlertManager();
    const heatHigh = getHeatAssessment('high');
    const heatCritical = getHeatAssessment('critical');
    const snapshot = createDummySnapshot();

    // Trigger at high (2 samples)
    let alerts = manager.processAssessment(heatHigh, snapshot, []);
    alerts = manager.processAssessment(heatHigh, snapshot, alerts);
    expect(alerts[0].severity).toBe('high');

    // Condition worsens to critical
    alerts = manager.processAssessment(heatCritical, snapshot, alerts);
    expect(alerts.length).toBe(1);
    expect(alerts[0].severity).toBe('critical');
  });

  it('resolves superseded episodes on demo scenario switch with annotation', () => {
    const manager = new AlertManager();
    const heatHigh = getHeatAssessment('high');
    const snapshot = createDummySnapshot();

    // Trigger heat alert
    let alerts = manager.processAssessment(heatHigh, snapshot, []);
    alerts = manager.processAssessment(heatHigh, snapshot, alerts);
    expect(alerts[0].resolvedAt).toBeNull();

    // Switch scenario to Fatigue
    const supersededAlerts = manager.resolveSupersededEpisodes(alerts, 'Fatigue & Sleep Deficit');
    expect(supersededAlerts.length).toBe(1);
    expect(supersededAlerts[0].resolvedAt).not.toBeNull();
    expect(supersededAlerts[0].reason).toContain('(Superseded: Demo switched to Fatigue & Sleep Deficit)');
  });

  it('acknowledges an active alert without resolving it prematurely', () => {
    const manager = new AlertManager();
    const heatHigh = getHeatAssessment('high');
    const snapshot = createDummySnapshot();

    // Trigger heat alert
    let alerts = manager.processAssessment(heatHigh, snapshot, []);
    alerts = manager.processAssessment(heatHigh, snapshot, alerts);
    const alertId = alerts[0].id;

    // Acknowledge
    const ackAlerts = manager.acknowledgeAlert(alertId, alerts);
    expect(ackAlerts[0].acknowledgedAt).not.toBeNull();
    expect(ackAlerts[0].resolvedAt).toBeNull();
  });
});

describe('Disaster Warning Physiological Score Independence', () => {
  const engine = new RuleBasedRiskEngine();

  it('evaluates Flood scenario to exactly score 18 (Low) despite active municipal advisory', () => {
    const sp = SCENARIO_SETPOINTS.flood;
    const reading: SensorReading = {
      id: 'rdg-flood',
      sequence: 1,
      observedAt: Date.now(),
      ...sp.sensor
    };
    const env: EnvironmentSnapshot = {
      id: 'env-flood',
      observedAt: Date.now(),
      validUntil: Date.now() + 15 * 60 * 1000,
      ...sp.environment
    };

    const result = engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });
    expect(result.overallScore).toBe(18);
    expect(result.severity).toBe('low');
    expect(env.disasterType).toBe('flood');
    expect(env.disasterSeverity).toBe('warning');
  });

  it('evaluates Cyclone scenario to exactly score 18 (Low) despite active municipal advisory', () => {
    const sp = SCENARIO_SETPOINTS.cyclone;
    const reading: SensorReading = {
      id: 'rdg-cyclone',
      sequence: 1,
      observedAt: Date.now(),
      ...sp.sensor
    };
    const env: EnvironmentSnapshot = {
      id: 'env-cyclone',
      observedAt: Date.now(),
      validUntil: Date.now() + 15 * 60 * 1000,
      ...sp.environment
    };

    const result = engine.evaluate({ reading, baseline: DEMO_BASELINE, environment: env });
    expect(result.overallScore).toBe(18);
    expect(result.severity).toBe('low');
    expect(env.disasterType).toBe('cyclone');
    expect(env.disasterSeverity).toBe('warning');
  });
});
