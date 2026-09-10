import { create } from 'zustand';
import { 
  UserProfile, 
  Baseline, 
  SensorReading, 
  EnvironmentSnapshot, 
  RiskAssessment, 
  Alert, 
  DeviceStatus, 
  Settings, 
  DemoState, 
  ScenarioType,
  ChartDataPoint,
  SOSRecord,
  FallCheckInState
} from '../domain/types';
import { DemoSensorAdapter } from '../adapters/sensors/demoSensorAdapter';
import { FixtureEnvironmentProvider } from '../adapters/environment/fixtureEnvironmentProvider';
import { RuleBasedRiskEngine } from '../domain/risk/ruleEngine';
import { AlertManager } from '../domain/managers/alertManager';
import { DeviceManager } from '../domain/managers/deviceManager';
import { EmergencyManager } from '../domain/managers/emergencyManager';
import { BaselineManager } from '../domain/managers/baselineManager';
import { LocalStorageRepository } from '../storage/localRepository';
import { generateDeterministic30DayHistory } from '../data/historyGenerator';
import { DEMO_PROFILE, DEMO_BASELINE } from '../data/fixtures';
import { SCENARIO_SETPOINTS } from '../data/scenarios';

export interface CompanionState {
  // Domain records
  profile: UserProfile;
  baseline: Baseline;
  currentReading: SensorReading;
  liveBufferHR: ChartDataPoint[];
  liveBufferSpO2: ChartDataPoint[];
  environment: EnvironmentSnapshot;
  riskAssessment: RiskAssessment;
  alerts: Alert[];
  deviceStatus: DeviceStatus;
  settings: Settings;
  demoState: DemoState;
  isHydrated: boolean;

  activeHealthTab: 'live' | 'baseline' | 'trends';
  selectedTrendMetric: 'hr' | 'spo2' | 'temp' | 'activity' | 'sleep' | 'risk';

  // Phase 5 State: Fall Check-In, SOS & Devices
  fallCheckIn: FallCheckInState;
  preparedSOSList: SOSRecord[];
  isPairingInProgress: boolean;

  // Actions
  init: () => void;
  setActiveHealthTab: (tab: 'live' | 'baseline' | 'trends') => void;
  setSelectedTrendMetric: (metric: 'hr' | 'spo2' | 'temp' | 'activity' | 'sleep' | 'risk') => void;
  setScenario: (scenario: ScenarioType) => void;
  togglePause: () => void;
  setSimulatedOffline: (offline: boolean) => void;
  resetDemo: () => void;
  resetEverything: () => void;
  acknowledgeAlert: (alertId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateBaseline: (updates: Partial<Baseline>) => void;
  recalculateBaseline: (resetManualHR?: boolean) => void;
  setManualRestingHR: (hr: number) => void;
  updateSharingChoices: (choices: Partial<Settings['sharingChoices']>) => void;

  // Phase 5 Actions
  respondFallCheckIn: (response: 'ok' | 'need_help') => void;
  handleFallTimeout: () => void;
  cancelFallCheckIn: () => void;
  prepareManualSOS: (incidentId?: string) => { success: boolean; reason?: string; record?: SOSRecord };
  connectDemoBelt: () => Promise<void>;
  disconnectDemoBelt: () => Promise<void>;
  resetProtectionSequence: () => void;
  clearPreparedSOS: () => void;

  // Phase 6 Actions
  completeOnboarding: (profileUpdates: Partial<UserProfile>, choices: Partial<Settings['sharingChoices']>) => void;
  clearLocalData: () => Promise<void>;
  relaunchOnboarding: () => void;
  updateAccessibilityChoices: (choices: Partial<Settings['accessibilityChoices']>) => void;
  resetToDemoProfile: () => void;
}

// Singletons for root-owned execution
const sensorAdapter = new DemoSensorAdapter();
const environmentProvider = new FixtureEnvironmentProvider('normal');
const riskEngine = new RuleBasedRiskEngine();
const alertManager = new AlertManager();
const repository = new LocalStorageRepository();

let isSimulatorSubscribed = false;

const INITIAL_DEMO_ALERTS: Alert[] = [
  {
    id: 'alt-init-01',
    episodeId: 'ep-init-01',
    category: 'system',
    severity: 'low',
    title: 'Daily baseline calibration verified',
    reason: '30-day resting heart rate (72 BPM) and SpO₂ (98%) medians synchronized with personal baseline.',
    recommendedAction: 'No action required. Personal baseline active.',
    inputSnapshot: {
      hr: 72,
      spo2: 98,
      bodyTemp: 36.7,
      ambientC: 30,
      humidity: 60,
      aqi: 60
    },
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    lastSeenAt: Date.now() - 2 * 60 * 60 * 1000,
    consecutiveSamples: 3,
    acknowledgedAt: Date.now() - 110 * 60 * 1000,
    resolvedAt: Date.now() - 100 * 60 * 1000
  },
  {
    id: 'alt-init-02',
    episodeId: 'ep-init-02',
    category: 'device',
    severity: 'low',
    title: 'Integrated belt connected successfully',
    reason: 'Simulated MPU6050 motion channel and ESP32 telemetry feed established.',
    recommendedAction: 'Verify comfortable belt strap fit around waist.',
    inputSnapshot: {
      hr: 72,
      spo2: 98,
      bodyTemp: 36.7,
      ambientC: 30,
      humidity: 60,
      aqi: 60
    },
    createdAt: Date.now() - 3 * 60 * 60 * 1000,
    lastSeenAt: Date.now() - 3 * 60 * 60 * 1000,
    consecutiveSamples: 3,
    acknowledgedAt: Date.now() - 170 * 60 * 1000,
    resolvedAt: null
  }
];

export const useCompanionStore = create<CompanionState>((set, get) => {
  // Initial synchronous default assessment
  const initialReading = sensorAdapter.getCurrentReading();
  const initialEnv: EnvironmentSnapshot = {
    id: 'env-normal-init',
    ambientC: 30,
    humidityPct: 60,
    aqi: 60,
    locationLabel: 'Demo residence, Chennai',
    outdoor: false,
    exposureMinutes: 10,
    source: 'Demo environmental feed',
    observedAt: Date.now(),
    validUntil: Date.now() + 15 * 60 * 1000,
    disasterType: 'none',
    disasterSeverity: 'none'
  };

  const initialAssessment = riskEngine.evaluate({
    reading: initialReading,
    baseline: DEMO_BASELINE,
    environment: initialEnv
  });

  return {
    profile: { ...DEMO_PROFILE },
    baseline: { ...DEMO_BASELINE },
    currentReading: initialReading,
    liveBufferHR: [{ time: '10:50', value: 72, baseline: 72 }],
    liveBufferSpO2: [{ time: '10:50', value: 98, baseline: 98 }],
    environment: initialEnv,
    riskAssessment: initialAssessment,
    alerts: INITIAL_DEMO_ALERTS,
    deviceStatus: DeviceManager.createDefaultDeviceStatus(),
    fallCheckIn: {
      isOpen: false,
      incidentId: null,
      deadline: null,
      userResponse: 'pending'
    },
    preparedSOSList: [],
    isPairingInProgress: false,
    settings: {
      schemaVersion: 1,
      onboardingComplete: true,
      sharingChoices: {
        shareLocation: true,
        shareVitals: true,
        shareRiskAssessment: true
      },
      notificationPreference: 'in_app_only',
      simulatedOffline: false,
      accessibilityChoices: {
        reducedMotion: false,
        highContrast: false
      }
    },
    demoState: {
      scenarioId: 'normal',
      scenarioRunId: `run-${Date.now()}`,
      seed: 26181,
      running: true,
      isPaused: false,
      transitionProgress: 1.0,
      demoClock: Date.now(),
      lastTickAt: Date.now()
    },
    isHydrated: false,
    activeHealthTab: 'live',
    selectedTrendMetric: 'hr',

    init: async () => {
      // 1. Hydrate first from LocalStorage
      const persisted = await repository.load();
      if (persisted) {
        set({
          profile: persisted.profile,
          baseline: persisted.baseline,
          settings: persisted.settings,
          alerts: persisted.recentAlerts || [],
          deviceStatus: persisted.deviceStatus || DeviceManager.createDefaultDeviceStatus(),
          preparedSOSList: persisted.preparedSOS || []
        });
      }
      set({ isHydrated: true });

      // 2. Subscribe to root sensor adapter once
      if (!isSimulatorSubscribed) {
        isSimulatorSubscribed = true;

        sensorAdapter.subscribe(async (reading: SensorReading) => {
          const state = get();
          if (!state.isHydrated) return;

          // Fetch fresh environment
          const env = await environmentProvider.getSnapshot();

          // Evaluate risk engine with reading, baseline, environment (NEVER scenarioId)
          const assessment = riskEngine.evaluate({
            reading,
            baseline: state.baseline,
            environment: env
          });

          // Process alerts
          const updatedAlerts = alertManager.processAssessment(
            assessment,
            {
              hr: reading.hr,
              spo2: reading.spo2,
              bodyTemp: reading.bodyTemperatureC,
              ambientC: env.ambientC,
              humidity: env.humidityPct,
              aqi: env.aqi
            },
            state.alerts
          );

          // Update live chart buffers (keep max 180 points)
          const dateObj = new Date(reading.observedAt);
          const timeLabel = `${dateObj.getMinutes()}:${dateObj.getSeconds().toString().padStart(2, '0')}`;

          const newHRPoint: ChartDataPoint = {
            time: timeLabel,
            value: reading.hr ?? state.baseline.restingHR,
            baseline: state.baseline.restingHR
          };

          const newSpO2Point: ChartDataPoint = {
            time: timeLabel,
            value: reading.spo2 ?? state.baseline.spo2,
            baseline: state.baseline.spo2
          };

          const updatedBufferHR = [...state.liveBufferHR.slice(-179), newHRPoint];
          const updatedBufferSpO2 = [...state.liveBufferSpO2.slice(-179), newSpO2Point];

          // Save state updates
          set({
            currentReading: reading,
            environment: env,
            riskAssessment: assessment,
            alerts: updatedAlerts,
            liveBufferHR: updatedBufferHR,
            liveBufferSpO2: updatedBufferSpO2,
            demoState: {
              ...state.demoState,
              demoClock: Date.now(),
              lastTickAt: Date.now()
            }
          });

          // Debounced save
          repository.save({
            version: 1,
            profile: state.profile,
            baseline: state.baseline,
            settings: state.settings,
            recentAlerts: updatedAlerts,
            deviceStatus: state.deviceStatus,
            preparedSOS: state.preparedSOSList,
            lastUpdated: Date.now()
          });
        });
      }
    },

    setScenario: (scenario: ScenarioType) => {
      const state = get();

      // Resolve superseded active episodes when demo scenario changes
      const updatedAlerts = alertManager.resolveSupersededEpisodes(
        state.alerts, 
        SCENARIO_SETPOINTS[scenario]?.name || scenario
      );

      sensorAdapter.setScenario(scenario);
      environmentProvider.setScenario(scenario);

      // If scenario is fall, trigger protection timeline and open "Are you okay?" check-in
      let nextDeviceStatus = state.deviceStatus;
      let nextFallCheckIn = state.fallCheckIn;

      if (scenario === 'fall') {
        nextDeviceStatus = DeviceManager.triggerFallProtectionSequence(state.deviceStatus);
        nextFallCheckIn = {
          isOpen: true,
          incidentId: `inc-fall-${Date.now()}`,
          deadline: Date.now() + 20000, // 20-second demo escalation countdown
          userResponse: 'pending'
        };
      } else {
        // Switching away cancels pending check-in and restores ready protection
        nextFallCheckIn = {
          isOpen: false,
          incidentId: null,
          deadline: null,
          userResponse: 'pending'
        };
        if (state.deviceStatus.protectionState !== 'ready') {
          nextDeviceStatus = DeviceManager.resetProtectionSequence(state.deviceStatus);
        }
      }

      set({
        alerts: updatedAlerts,
        deviceStatus: nextDeviceStatus,
        fallCheckIn: nextFallCheckIn,
        demoState: {
          ...state.demoState,
          scenarioId: scenario,
          scenarioRunId: `run-${Date.now()}`
        }
      });
    },

    togglePause: () => {
      const isCurrentlyPaused = sensorAdapter.isPaused();
      if (isCurrentlyPaused) {
        sensorAdapter.resume();
      } else {
        sensorAdapter.pause();
      }
      set(state => ({
        demoState: {
          ...state.demoState,
          isPaused: !isCurrentlyPaused
        }
      }));
    },

    setSimulatedOffline: (offline: boolean) => {
      environmentProvider.setOffline(offline);
      set(state => ({
        settings: {
          ...state.settings,
          simulatedOffline: offline
        }
      }));
    },

    resetDemo: () => {
      // Deterministic Reset Demo: resets simulator and inputs to Normal, clears fall and alert episodes,
      // but PRESERVES user profile and privacy choices!
      alertManager.clearAllEpisodes();
      sensorAdapter.resetToNormal();
      environmentProvider.setScenario('normal');

      const normalSensor = SCENARIO_SETPOINTS.normal.sensor;
      const normalEnv = SCENARIO_SETPOINTS.normal.environment;

      const resetReading: SensorReading = {
        id: `rdg-reset-${Date.now()}`,
        sequence: 1,
        observedAt: Date.now(),
        source: 'DemoSensorAdapter (ESP32-sim)',
        hr: normalSensor.hr,
        spo2: normalSensor.spo2,
        bodyTemperatureC: normalSensor.bodyTemperatureC,
        activity: normalSensor.activity,
        activityMinutes: normalSensor.activityMinutes,
        sleepMinutes: normalSensor.sleepMinutes,
        motion: normalSensor.motion,
        quality: 100
      };

      const resetEnv: EnvironmentSnapshot = {
        id: `env-reset-${Date.now()}`,
        ambientC: normalEnv.ambientC,
        humidityPct: normalEnv.humidityPct,
        aqi: normalEnv.aqi,
        locationLabel: normalEnv.locationLabel,
        outdoor: normalEnv.outdoor,
        exposureMinutes: normalEnv.exposureMinutes,
        source: normalEnv.source,
        observedAt: Date.now(),
        validUntil: Date.now() + 15 * 60 * 1000,
        disasterType: 'none',
        disasterSeverity: 'none'
      };

      const resetAssessment = riskEngine.evaluate({
        reading: resetReading,
        baseline: get().baseline,
        environment: resetEnv
      });

      set(state => ({
        currentReading: resetReading,
        environment: resetEnv,
        riskAssessment: resetAssessment,
        alerts: [],
        deviceStatus: DeviceManager.createDefaultDeviceStatus(),
        fallCheckIn: {
          isOpen: false,
          incidentId: null,
          deadline: null,
          userResponse: 'pending'
        },
        preparedSOSList: [],
        demoState: {
          ...state.demoState,
          scenarioId: 'normal',
          isPaused: false,
          scenarioRunId: `run-${Date.now()}`
        }
      }));
    },

    resetEverything: async () => {
      await repository.clear();
      get().resetDemo();
      set({
        profile: { ...DEMO_PROFILE },
        baseline: { ...DEMO_BASELINE }
      });
    },

    acknowledgeAlert: (alertId: string) => {
      const state = get();
      const updated = alertManager.acknowledgeAlert(alertId, state.alerts);
      set({ alerts: updated });
    },

    updateProfile: (updates: Partial<UserProfile>) => {
      set(state => {
        const nextProfile: UserProfile = { 
          ...state.profile, 
          ...updates,
          profileOrigin: 'user_configured'
        };
        let nextBaseline = state.baseline;

        // If user manually changed restingHR, it takes precedence and provenance is user_configured
        if (updates.restingHR !== undefined) {
          nextBaseline = {
            ...state.baseline,
            restingHR: updates.restingHR,
            isManualRestingHR: true,
            source: 'Manually entered resting HR (User-defined)'
          };
        }

        repository.save({
          version: 1,
          profile: nextProfile,
          baseline: nextBaseline,
          settings: state.settings,
          recentAlerts: state.alerts,
          deviceStatus: state.deviceStatus,
          preparedSOS: state.preparedSOSList,
          lastUpdated: Date.now()
        });

        return {
          profile: nextProfile,
          baseline: nextBaseline
        };
      });
    },

    updateBaseline: (updates: Partial<Baseline>) => {
      set(state => ({
        baseline: { ...state.baseline, ...updates }
      }));
    },

    setActiveHealthTab: (tab: 'live' | 'baseline' | 'trends') => {
      set({ activeHealthTab: tab });
    },

    setSelectedTrendMetric: (metric: 'hr' | 'spo2' | 'temp' | 'activity' | 'sleep' | 'risk') => {
      set({ selectedTrendMetric: metric });
    },

    recalculateBaseline: (resetManualHR?: boolean) => {
      const state = get();
      const history = generateDeterministic30DayHistory(state.baseline);
      const updatedBaseline = BaselineManager.recalculateFromHistory(
        history,
        resetManualHR ? undefined : state.baseline
      );
      set(s => ({
        baseline: {
          ...s.baseline,
          ...updatedBaseline,
          isManualRestingHR: resetManualHR ? false : s.baseline.isManualRestingHR
        }
      }));
    },

    setManualRestingHR: (hr: number) => {
      set(s => ({
        baseline: {
          ...s.baseline,
          restingHR: hr,
          isManualRestingHR: true,
          source: 'Manually entered resting HR (User-defined)'
        },
        profile: {
          ...s.profile,
          restingHR: hr,
          profileOrigin: 'user_configured'
        }
      }));
    },

    updateSharingChoices: (choices: Partial<Settings['sharingChoices']>) => {
      set(state => ({
        settings: {
          ...state.settings,
          sharingChoices: { ...state.settings.sharingChoices, ...choices }
        }
      }));
    },

    // Phase 5 Actions
    respondFallCheckIn: (response: 'ok' | 'need_help') => {
      const state = get();
      if (!state.fallCheckIn.isOpen) return;

      if (response === 'ok') {
        // "I'm OK cancels the timer and records user acknowledgement. It does not erase the belt protection event."
        set({
          fallCheckIn: {
            ...state.fallCheckIn,
            isOpen: false,
            userResponse: 'ok',
            deadline: null
          }
        });
      } else {
        // "Need Help opens the SOS confirmation immediately / prepares SOS payload"
        const incidentId = state.fallCheckIn.incidentId || `inc-fall-${Date.now()}`;
        const isContactValid = EmergencyManager.isContactValid(state.profile.emergencyContact);

        if (isContactValid) {
          const sosRecord = EmergencyManager.prepareSOSPayload(
            state.profile,
            state.settings.sharingChoices,
            state.currentReading,
            state.environment,
            state.riskAssessment,
            incidentId,
            'fall_checkin_escalation'
          );
          const filtered = state.preparedSOSList.filter(s => s.incidentId !== incidentId);
          set({
            fallCheckIn: {
              ...state.fallCheckIn,
              isOpen: false,
              userResponse: 'need_help',
              deadline: null
            },
            preparedSOSList: [sosRecord, ...filtered]
          });
        } else {
          set({
            fallCheckIn: {
              ...state.fallCheckIn,
              isOpen: false,
              userResponse: 'need_help',
              deadline: null
            }
          });
        }
      }
    },

    handleFallTimeout: () => {
      const state = get();
      if (!state.fallCheckIn.isOpen) return;
      const incidentId = state.fallCheckIn.incidentId || `inc-fall-${Date.now()}`;

      const isContactValid = EmergencyManager.isContactValid(state.profile.emergencyContact);
      if (isContactValid) {
        const sosRecord = EmergencyManager.prepareSOSPayload(
          state.profile,
          state.settings.sharingChoices,
          state.currentReading,
          state.environment,
          state.riskAssessment,
          incidentId,
          'fall_checkin_timeout'
        );
        const filtered = state.preparedSOSList.filter(s => s.incidentId !== incidentId);
        set({
          fallCheckIn: {
            ...state.fallCheckIn,
            isOpen: false,
            userResponse: 'timeout',
            deadline: null
          },
          preparedSOSList: [sosRecord, ...filtered]
        });
      } else {
        set({
          fallCheckIn: {
            ...state.fallCheckIn,
            isOpen: false,
            userResponse: 'timeout',
            deadline: null
          }
        });
      }
    },

    cancelFallCheckIn: () => {
      set({
        fallCheckIn: {
          isOpen: false,
          incidentId: null,
          deadline: null,
          userResponse: 'pending'
        }
      });
    },

    prepareManualSOS: (customIncidentId?: string) => {
      const state = get();
      const isContactValid = EmergencyManager.isContactValid(state.profile.emergencyContact);
      if (!isContactValid) {
        return {
          success: false,
          reason: 'Emergency contact name or telephone number is missing or invalid. Please update your profile.'
        };
      }

      const incidentId = customIncidentId || `inc-manual-${Date.now()}`;
      const record = EmergencyManager.prepareSOSPayload(
        state.profile,
        state.settings.sharingChoices,
        state.currentReading,
        state.environment,
        state.riskAssessment,
        incidentId,
        'manual'
      );

      const filtered = state.preparedSOSList.filter(s => s.incidentId !== incidentId);
      set({
        preparedSOSList: [record, ...filtered]
      });

      return { success: true, record };
    },

    connectDemoBelt: async () => {
      set({ isPairingInProgress: true });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await sensorAdapter.connect();
      set(state => ({
        isPairingInProgress: false,
        deviceStatus: DeviceManager.setConnectionStatus(state.deviceStatus, 'connected')
      }));
    },

    disconnectDemoBelt: async () => {
      await sensorAdapter.disconnect();
      set(state => ({
        deviceStatus: DeviceManager.setConnectionStatus(state.deviceStatus, 'disconnected')
      }));
    },

    resetProtectionSequence: () => {
      set(state => ({
        deviceStatus: DeviceManager.resetProtectionSequence(state.deviceStatus)
      }));
    },

    clearPreparedSOS: () => {
      set({ preparedSOSList: [] });
    },

    // Phase 6 Actions
    completeOnboarding: (profileUpdates: Partial<UserProfile>, choices: Partial<Settings['sharingChoices']>) => {
      const state = get();
      const updatedProfile: UserProfile = {
        ...state.profile,
        ...profileUpdates,
        profileOrigin: profileUpdates.profileOrigin || 'user_configured'
      };

      let updatedBaseline = state.baseline;
      if (profileUpdates.restingHR !== undefined) {
        updatedBaseline = {
          ...state.baseline,
          restingHR: profileUpdates.restingHR,
          isManualRestingHR: true,
          source: 'Manually entered resting HR (User-defined)'
        };
      }

      const updatedSettings: Settings = {
        ...state.settings,
        onboardingComplete: true,
        sharingChoices: {
          ...state.settings.sharingChoices,
          ...choices
        }
      };

      set({
        profile: updatedProfile,
        baseline: updatedBaseline,
        settings: updatedSettings
      });

      // Synchronously flush state to LocalStorage repository
      repository.save({
        version: 1,
        profile: updatedProfile,
        baseline: updatedBaseline,
        settings: updatedSettings,
        recentAlerts: state.alerts,
        deviceStatus: state.deviceStatus,
        preparedSOS: state.preparedSOSList,
        lastUpdated: Date.now()
      });
      repository.flushSync();

      // Ensure simulator is active
      if (sensorAdapter.isPaused()) {
        sensorAdapter.resume();
        set(s => ({ demoState: { ...s.demoState, isPaused: false } }));
      }
    },

    clearLocalData: async () => {
      // 1. Halt sensor simulator timer and persistence
      sensorAdapter.pause();

      // 2. Erase persisted records
      await repository.clear();

      // 3. Clear alert engine active episodes
      alertManager.clearAllEpisodes();

      // 4. Return to unconfigured blank profile without silently reseeding
      const blankProfile: UserProfile = {
        id: 'usr-unconfigured',
        name: '',
        age: 0,
        gender: '',
        restingHR: 70,
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        },
        profileOrigin: 'user_configured'
      };

      const blankBaseline: Baseline = {
        restingHR: 70,
        spo2: 98,
        bodyTemperatureC: 36.7,
        activity: 'Moderate',
        sleepMinutes: 420,
        sampleCount: 0,
        timeWindow: 'Default baseline',
        source: 'Uncalibrated baseline',
        computedAt: 'Pending calibration',
        isManualRestingHR: false
      };

      const freshSettings: Settings = {
        schemaVersion: 1,
        onboardingComplete: false,
        sharingChoices: {
          shareLocation: false,
          shareVitals: false,
          shareRiskAssessment: false
        },
        notificationPreference: 'in_app_only',
        simulatedOffline: false,
        accessibilityChoices: {
          reducedMotion: false,
          highContrast: false
        }
      };

      set(state => ({
        profile: blankProfile,
        baseline: blankBaseline,
        settings: freshSettings,
        alerts: [],
        preparedSOSList: [],
        deviceStatus: DeviceManager.createDefaultDeviceStatus(),
        fallCheckIn: {
          isOpen: false,
          incidentId: null,
          deadline: null,
          userResponse: 'pending'
        },
        demoState: {
          ...state.demoState,
          isPaused: true,
          scenarioId: 'normal'
        }
      }));
    },

    relaunchOnboarding: () => {
      set(state => ({
        settings: {
          ...state.settings,
          onboardingComplete: false
        }
      }));
    },

    updateAccessibilityChoices: (choices: Partial<Settings['accessibilityChoices']>) => {
      set(state => {
        const nextSettings: Settings = {
          ...state.settings,
          accessibilityChoices: {
            ...state.settings.accessibilityChoices,
            ...choices
          }
        };
        repository.save({
          version: 1,
          profile: state.profile,
          baseline: state.baseline,
          settings: nextSettings,
          recentAlerts: state.alerts,
          deviceStatus: state.deviceStatus,
          preparedSOS: state.preparedSOSList,
          lastUpdated: Date.now()
        });
        return { settings: nextSettings };
      });
    },

    resetToDemoProfile: () => {
      const state = get();
      set({
        profile: { ...DEMO_PROFILE },
        baseline: { ...DEMO_BASELINE }
      });
      repository.save({
        version: 1,
        profile: { ...DEMO_PROFILE },
        baseline: { ...DEMO_BASELINE },
        settings: state.settings,
        recentAlerts: state.alerts,
        deviceStatus: state.deviceStatus,
        preparedSOS: state.preparedSOSList,
        lastUpdated: Date.now()
      });
    }
  };
});
