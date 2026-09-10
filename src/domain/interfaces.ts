// Replaceable Architectural Boundaries (SIH26181 Section 5)
import { 
  SensorReading, 
  EnvironmentSnapshot, 
  Baseline, 
  RiskAssessment,
  UserProfile,
  Settings,
  Alert,
  DeviceStatus
} from './types';

export interface RiskInput {
  reading: SensorReading;
  baseline: Baseline;
  environment: EnvironmentSnapshot;
  // NOTE: scenarioId is strictly forbidden as an input to the RiskEngine!
}

export interface SensorAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  pause(): void;
  resume(): void;
  subscribe(onReading: (reading: SensorReading) => void): () => void;
  isConnected(): boolean;
  isPaused(): boolean;
}

export interface RiskEngine {
  evaluate(input: RiskInput): RiskAssessment;
}

export interface EnvironmentProvider {
  getSnapshot(): Promise<EnvironmentSnapshot>;
  setSimulatedScenario(snapshot: EnvironmentSnapshot): void;
  setOffline(offline: boolean): void;
}

export interface PersistedState {
  version: number;
  profile: UserProfile;
  baseline: Baseline;
  settings: Settings;
  recentAlerts: Alert[];
  deviceStatus: DeviceStatus;
  preparedSOS?: import('./types').SOSRecord[];
  lastUpdated: number;
}

export interface LocalRepository {
  load(): Promise<PersistedState | null>;
  save(state: PersistedState): Promise<void>;
  clear(): Promise<void>;
}
