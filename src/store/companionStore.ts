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
  ChartDataPoint
} from '../domain/types';
import { DemoSensorAdapter } from '../adapters/sensors/demoSensorAdapter';
import { FixtureEnvironmentProvider } from '../adapters/environment/fixtureEnvironmentProvider';
import { RuleBasedRiskEngine } from '../domain/risk/ruleEngine';
import { AlertManager } from '../domain/managers/alertManager';
import { DeviceManager } from '../domain/managers/deviceManager';
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
}

// Singletons for root-owned execution
const sensorAdapter = new DemoSensorAdapter();
const environmentProvider = new FixtureEnvironmentProvider('normal');
const riskEngine = new RuleBasedRiskEngine();
const alertManager = new AlertManager();
const repository = new LocalStorageRepository();

let isSimulatorSubscribed = false;

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
    alerts: [],
    deviceStatus: DeviceManager.createDefaultDeviceStatus(),
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
          deviceStatus: persisted.deviceStatus || DeviceManager.createDefaultDeviceStatus()
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
            lastUpdated: Date.now()
          });
        });
      }
    },

    setScenario: (scenario: ScenarioType) => {
      const state = get();

      // Reset active episodes when scenario changes
      alertManager.clearAllEpisodes();

      sensorAdapter.setScenario(scenario);
      environmentProvider.setScenario(scenario);

      // If scenario is fall, trigger protection timeline
      let nextDeviceStatus = state.deviceStatus;
      if (scenario === 'fall') {
        nextDeviceStatus = DeviceManager.triggerFallProtectionSequence(state.deviceStatus);
      } else if (state.deviceStatus.protectionState !== 'ready') {
        nextDeviceStatus = DeviceManager.resetProtectionSequence(state.deviceStatus);
      }

      set({
        deviceStatus: nextDeviceStatus,
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
        const nextProfile = { ...state.profile, ...updates };
        let nextBaseline = state.baseline;

        // If user manually changed restingHR, it takes precedence and provenance is user_configured
        if (updates.restingHR && updates.restingHR !== state.profile.restingHR) {
          nextBaseline = {
            ...state.baseline,
            restingHR: updates.restingHR,
            source: 'User-entered resting HR'
          };
        }

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
    }
  };
});
