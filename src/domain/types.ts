// Domain Contracts and Core Records (SIH26181 Health Companion)

export type RiskSeverity = 'low' | 'moderate' | 'high' | 'critical';

export type AnomalyCategory = 
  | 'cardiovascular' 
  | 'respiratory' 
  | 'heat' 
  | 'fatigue' 
  | 'fall';

export type ScenarioType = 
  | 'normal' 
  | 'heat_wave' 
  | 'pollution' 
  | 'fatigue' 
  | 'fall' 
  | 'flood' 
  | 'cyclone';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender?: string;
  restingHR: number;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  profileOrigin: 'demo_seed' | 'user_configured';
}

export interface Baseline {
  restingHR: number;
  spo2: number;
  bodyTemperatureC: number;
  activity: string;
  sleepMinutes: number;
  sampleCount: number;
  timeWindow: string;
  source: string;
  computedAt: string;
  isManualRestingHR?: boolean;
}

export interface SensorReading {
  id: string;
  sequence: number;
  observedAt: number; // epoch ms
  source: string;
  hr: number | null;
  spo2: number | null;
  bodyTemperatureC: number | null;
  activity: 'low' | 'moderate' | 'high';
  activityMinutes: number;
  sleepMinutes: number;
  motion: 'resting' | 'moderate' | 'erratic_fall' | 'inactive_post_fall';
  quality: number; // 0..100
}

export interface EnvironmentSnapshot {
  id: string;
  ambientC: number;
  humidityPct: number;
  aqi: number;
  locationLabel: string;
  outdoor: boolean;
  exposureMinutes: number;
  source: string;
  observedAt: number; // epoch ms
  validUntil: number; // epoch ms
  disasterType?: 'flood' | 'cyclone' | 'none';
  disasterSeverity?: 'warning' | 'advisory' | 'none';
}

export interface RiskFactorMatch {
  id: string;
  label: string;
  category: AnomalyCategory;
  observedValue: string;
  baselineRef: string;
  contribution: number;
}

export interface CategoryResult {
  category: AnomalyCategory;
  score: number;
  severity: RiskSeverity;
  status: 'available' | 'insufficient_data';
  factors: RiskFactorMatch[];
  missingInputs?: string[];
}

export interface RiskAssessment {
  id: string;
  computedAt: number;
  inputReadingId: string;
  environmentId: string;
  engineVersion: string;
  categoryResults: Record<AnomalyCategory, CategoryResult>;
  overallScore: number;
  severity: RiskSeverity;
  label: string;
  factors: RiskFactorMatch[];
  topFactors: RiskFactorMatch[];
  guidanceIds: string[];
  confidence: number | null; // Null per demonstration honesty contract
  confidenceText: string;
  confidenceDisclosure: string;
  status: 'full_assessment' | 'partial_assessment' | 'insufficient_data';
  interpretation: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  baseline: number;
}

export interface Alert {
  id: string;
  episodeId: string;
  category: AnomalyCategory | 'disaster' | 'system' | 'device';
  severity: RiskSeverity;
  title: string;
  reason: string;
  recommendedAction: string;
  inputSnapshot: {
    hr: number | null;
    spo2: number | null;
    bodyTemp: number | null;
    ambientC: number | null;
    humidity: number | null;
    aqi: number | null;
  };
  createdAt: number;
  lastSeenAt: number;
  consecutiveSamples: number;
  acknowledgedAt: number | null;
  resolvedAt: number | null;
}

export interface BeltComponentState {
  id: string;
  name: string;
  status: 'ready' | 'active' | 'warning' | 'standby';
  details: string;
}

export interface DeviceStatus {
  id: string;
  name: string;
  source: string;
  connection: 'connected' | 'paused' | 'disconnected';
  batteryPct: number;
  lastSeenAt: number;
  motionStatus: string;
  protectionState: 'ready' | 'deployed' | 'inspection_required';
  components: BeltComponentState[];
  timeline: Array<{
    timestamp: number;
    title: string;
    details: string;
    stage: 'motion' | 'fall_detected' | 'solenoid_relay' | 'airbag_deployed' | 'inspection';
  }>;
}

export interface SharingChoices {
  shareLocation: boolean;
  shareVitals: boolean;
  shareRiskAssessment: boolean;
}

export interface SOSRecord {
  id: string;
  incidentId: string;
  preparedAt: number;
  contact: {
    name: string;
    phone: string;
  };
  location: string | null;
  vitalsSnapshot: {
    hr: number | null;
    spo2: number | null;
    bodyTemp: number | null;
  } | null;
  riskScore: number | null;
  severity: RiskSeverity | null;
  status: 'prepared_demonstration_only';
}

export interface Settings {
  schemaVersion: number;
  onboardingComplete: boolean;
  sharingChoices: SharingChoices;
  notificationPreference: 'in_app_only';
  simulatedOffline: boolean;
  accessibilityChoices: {
    reducedMotion: boolean;
    highContrast: boolean;
  };
}

export interface DemoState {
  scenarioId: ScenarioType;
  scenarioRunId: string;
  seed: number;
  running: boolean;
  isPaused: boolean;
  transitionProgress: number; // 0.0 .. 1.0
  demoClock: number;
  lastTickAt: number;
}
