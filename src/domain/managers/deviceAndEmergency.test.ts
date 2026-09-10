import { describe, it, expect, beforeEach } from 'vitest';
import { useCompanionStore } from '../../store/companionStore';
import { EmergencyManager } from './emergencyManager';
import { DeviceManager } from './deviceManager';
import { DEMO_PROFILE } from '../../data/fixtures';
import { SensorReading, EnvironmentSnapshot, RiskAssessment } from '../types';

describe('Phase 5 Belt Telemetry & DeviceManager Rules', () => {
  it('creates default device status with all 12 component telemetry channels', () => {
    const status = DeviceManager.createDefaultDeviceStatus();
    expect(status.name).toBe('Integrated Health Belt — Demo Sensor');
    expect(status.batteryPct).toBe(84);
    expect(status.connection).toBe('connected');
    expect(status.protectionState).toBe('ready');
    expect(status.components.length).toBe(12);

    const componentIds = status.components.map(c => c.id);
    expect(componentIds).toContain('motion');
    expect(componentIds).toContain('hr');
    expect(componentIds).toContain('spo2');
    expect(componentIds).toContain('temp');
    expect(componentIds).toContain('esp32');
    expect(componentIds).toContain('buzzer');
    expect(componentIds).toContain('gps');
    expect(componentIds).toContain('battery');
    expect(componentIds).toContain('relay');
    expect(componentIds).toContain('solenoid');
    expect(componentIds).toContain('cartridge');
    expect(componentIds).toContain('airbag');
  });

  it('triggers fall protection sequence and logs chronological 5-stage timeline', () => {
    const initial = DeviceManager.createDefaultDeviceStatus();
    const deployed = DeviceManager.triggerFallProtectionSequence(initial);

    expect(deployed.protectionState).toBe('deployed');
    expect(deployed.motionStatus).toContain('Impact');
    expect(deployed.timeline.length).toBe(5);

    expect(deployed.timeline[0].stage).toBe('motion');
    expect(deployed.timeline[1].stage).toBe('fall_detected');
    expect(deployed.timeline[2].stage).toBe('solenoid_relay');
    expect(deployed.timeline[3].stage).toBe('airbag_deployed');
    expect(deployed.timeline[4].stage).toBe('inspection');

    const airbagComp = deployed.components.find(c => c.id === 'airbag');
    expect(airbagComp?.status).toBe('warning');
    expect(airbagComp?.details).toContain('Deployed (Simulation)');
  });

  it('resets protection sequence back to ready without affecting other components', () => {
    const initial = DeviceManager.createDefaultDeviceStatus();
    const deployed = DeviceManager.triggerFallProtectionSequence(initial);
    const reset = DeviceManager.resetProtectionSequence(deployed);

    expect(reset.protectionState).toBe('ready');
    expect(reset.timeline.length).toBe(0);

    const airbagComp = reset.components.find(c => c.id === 'airbag');
    expect(airbagComp?.status).toBe('ready');
  });

  it('handles disconnect and reconnect with coherent component status changes', () => {
    const initial = DeviceManager.createDefaultDeviceStatus();
    const disconnected = DeviceManager.setConnectionStatus(initial, 'disconnected');

    expect(disconnected.connection).toBe('disconnected');
    expect(disconnected.motionStatus).toContain('Disconnected');
    expect(disconnected.components.every(c => c.status === 'standby')).toBe(true);

    const reconnected = DeviceManager.setConnectionStatus(disconnected, 'connected');
    expect(reconnected.connection).toBe('connected');
    expect(reconnected.motionStatus).toBe('Upright / Resting');
  });
});

describe('Phase 5 Fall Check-In & Countdown Lifecycle in Store', () => {
  beforeEach(() => {
    useCompanionStore.getState().resetDemo();
  });

  it('scenario switch to "fall" arms 20s countdown and deploys protection', () => {
    const store = useCompanionStore.getState();
    store.setScenario('fall');

    const updated = useCompanionStore.getState();
    expect(updated.fallCheckIn.isOpen).toBe(true);
    expect(updated.fallCheckIn.userResponse).toBe('pending');
    expect(updated.fallCheckIn.deadline).not.toBeNull();
    expect(updated.deviceStatus.protectionState).toBe('deployed');
  });

  it('I\'m OK stops escalation but preserves the belt protection record', () => {
    const store = useCompanionStore.getState();
    store.setScenario('fall');
    store.respondFallCheckIn('ok');

    const updated = useCompanionStore.getState();
    expect(updated.fallCheckIn.isOpen).toBe(false);
    expect(updated.fallCheckIn.userResponse).toBe('ok');
    expect(updated.fallCheckIn.deadline).toBeNull();
    // Belt protection record MUST remain deployed
    expect(updated.deviceStatus.protectionState).toBe('deployed');
    expect(updated.deviceStatus.timeline.length).toBe(5);
  });

  it('Need Help stops countdown and immediately prepares SOS record', () => {
    const store = useCompanionStore.getState();
    store.setScenario('fall');
    const incidentId = useCompanionStore.getState().fallCheckIn.incidentId!;

    store.respondFallCheckIn('need_help');

    const updated = useCompanionStore.getState();
    expect(updated.fallCheckIn.isOpen).toBe(false);
    expect(updated.fallCheckIn.userResponse).toBe('need_help');
    expect(updated.preparedSOSList.length).toBeGreaterThan(0);
    expect(updated.preparedSOSList[0].incidentId).toBe(incidentId);
    expect(updated.preparedSOSList[0].triggerType).toBe('fall_checkin_escalation');
  });

  it('Timeout without response prepares one demo SOS payload', () => {
    const store = useCompanionStore.getState();
    store.setScenario('fall');
    const incidentId = useCompanionStore.getState().fallCheckIn.incidentId!;

    store.handleFallTimeout();

    const updated = useCompanionStore.getState();
    expect(updated.fallCheckIn.isOpen).toBe(false);
    expect(updated.fallCheckIn.userResponse).toBe('timeout');
    expect(updated.preparedSOSList.length).toBeGreaterThan(0);
    expect(updated.preparedSOSList[0].incidentId).toBe(incidentId);
    expect(updated.preparedSOSList[0].triggerType).toBe('fall_checkin_timeout');
  });

  it('switching away from fall scenario cancels pending check-in', () => {
    const store = useCompanionStore.getState();
    store.setScenario('fall');
    expect(useCompanionStore.getState().fallCheckIn.isOpen).toBe(true);

    store.setScenario('normal');
    expect(useCompanionStore.getState().fallCheckIn.isOpen).toBe(false);
  });
});

describe('Phase 5 Emergency Manager & Consent-Filtered Payloads', () => {
  const dummyReading: SensorReading = {
    id: 'rdg-test',
    sequence: 1,
    observedAt: Date.now(),
    source: 'Demo',
    hr: 104,
    spo2: 95,
    bodyTemperatureC: 37.2,
    activity: 'low',
    activityMinutes: 10,
    sleepMinutes: 440,
    motion: 'resting',
    quality: 100
  };

  const dummyEnv: EnvironmentSnapshot = {
    id: 'env-test',
    ambientC: 32,
    humidityPct: 65,
    aqi: 75,
    locationLabel: 'Demo residence, Chennai',
    outdoor: false,
    exposureMinutes: 10,
    source: 'Demo',
    observedAt: Date.now(),
    validUntil: Date.now() + 10000
  };

  const dummyAssessment: RiskAssessment = {
    id: 'eval-test',
    computedAt: Date.now(),
    inputReadingId: 'rdg-test',
    environmentId: 'env-test',
    engineVersion: '1.0.0-demo',
    categoryResults: {} as any,
    overallScore: 65,
    severity: 'high',
    label: 'High Risk',
    factors: [],
    topFactors: [],
    guidanceIds: [],
    confidence: null,
    confidenceText: 'Confidence: not estimated by this demo engine.',
    confidenceDisclosure: 'Confidence: not estimated by this demo engine.',
    status: 'full_assessment',
    interpretation: 'Demo interpretation'
  };

  it('validates emergency contacts accurately', () => {
    expect(EmergencyManager.isContactValid({ name: 'Caregiver', phone: '+91 98400 12345' })).toBe(true);
    expect(EmergencyManager.isContactValid({ name: '', phone: '+91 98400 12345' })).toBe(false);
    expect(EmergencyManager.isContactValid({ name: 'Caregiver', phone: '' })).toBe(false);
    expect(EmergencyManager.isContactValid({ name: 'Caregiver', phone: '123' })).toBe(false); // <7 digits
  });

  it('prepares SOS payload with status "prepared_demonstration_only" and explicit location provenance', () => {
    const payload = EmergencyManager.prepareSOSPayload(
      DEMO_PROFILE,
      { shareLocation: true, shareVitals: true, shareRiskAssessment: true },
      dummyReading,
      dummyEnv,
      dummyAssessment
    );

    expect(payload.status).toBe('prepared_demonstration_only');
    expect(payload.contact.name).toBe(DEMO_PROFILE.emergencyContact.name);
    expect(payload.location).toContain('Demo residence, Chennai');
    expect(payload.locationProvenance).toBe('Demo location');
    expect(payload.vitalsSnapshot).not.toBeNull();
    expect(payload.vitalsSnapshot?.hr).toBe(104);
    expect(payload.riskScore).toBe(65);
    expect(payload.severity).toBe('high');
  });

  it('strictly enforces privacy consent filtering by omitting excluded fields', () => {
    const payload = EmergencyManager.prepareSOSPayload(
      DEMO_PROFILE,
      { shareLocation: false, shareVitals: false, shareRiskAssessment: false },
      dummyReading,
      dummyEnv,
      dummyAssessment
    );

    expect(payload.location).toBeNull();
    expect(payload.locationProvenance).toBe('Not shared');
    expect(payload.vitalsSnapshot).toBeNull();
    expect(payload.riskScore).toBeNull();
    expect(payload.severity).toBeNull();
    expect(payload.contact.name).toBe(DEMO_PROFILE.emergencyContact.name);
  });

  it('deduplicates manual SOS calls preventing multiple records for same incident', () => {
    const store = useCompanionStore.getState();
    store.resetDemo();

    const res1 = store.prepareManualSOS('inc-fixed-1');
    expect(res1.success).toBe(true);
    expect(useCompanionStore.getState().preparedSOSList.length).toBe(1);

    // Repeated confirmation with the same incident ID must NOT create duplicate rows
    const res2 = store.prepareManualSOS('inc-fixed-1');
    expect(res2.success).toBe(true);
    expect(useCompanionStore.getState().preparedSOSList.length).toBe(1);
  });

  it('fails safely when emergency contact is missing without creating false payload', () => {
    const store = useCompanionStore.getState();
    store.resetDemo();
    store.updateProfile({
      emergencyContact: { name: '', phone: '', relationship: '' }
    });

    const res = store.prepareManualSOS();
    expect(res.success).toBe(false);
    expect(res.reason).toContain('missing or invalid');
    expect(useCompanionStore.getState().preparedSOSList.length).toBe(0);
  });

  it('fall check-in dismissal (Cancel) stops countdown without preparing SOS record', () => {
    const store = useCompanionStore.getState();
    store.resetDemo();
    store.setScenario('fall');
    expect(useCompanionStore.getState().fallCheckIn.isOpen).toBe(true);

    store.cancelFallCheckIn();

    const updated = useCompanionStore.getState();
    expect(updated.fallCheckIn.isOpen).toBe(false);
    expect(updated.fallCheckIn.userResponse).toBe('pending');
    expect(updated.preparedSOSList.length).toBe(0);
  });

  it('connectDemoBelt and disconnectDemoBelt toggle sensor stream and device connection state', async () => {
    const store = useCompanionStore.getState();
    store.resetDemo();

    await store.disconnectDemoBelt();
    expect(useCompanionStore.getState().deviceStatus.connection).toBe('disconnected');
    expect(useCompanionStore.getState().deviceStatus.motionStatus).toContain('Disconnected');

    await store.connectDemoBelt();
    expect(useCompanionStore.getState().deviceStatus.connection).toBe('connected');
    expect(useCompanionStore.getState().deviceStatus.motionStatus).toBe('Upright / Resting');
  });
});
