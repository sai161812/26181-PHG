// Domain and UI Types for SIH26181 Health Companion

export type RiskSeverity = 'low' | 'moderate' | 'high' | 'critical';

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
}

export interface VitalMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  baseline: number;
  deltaText: string;
  trend: 'stable' | 'up' | 'down';
  sparkline: number[];
  status: 'normal' | 'elevated' | 'warning';
}

export interface EnvironmentMetrics {
  ambientC: number;
  humidityPct: number;
  aqi: number;
  locationLabel: string;
  outdoor: boolean;
  exposureMinutes: number;
  source: string;
  observedAt: string;
  validUntil: string;
}

export interface RiskFactor {
  id: string;
  label: string;
  category: 'cardiovascular' | 'respiratory' | 'heat' | 'fatigue' | 'fall';
  observedValue: string;
  baselineRef: string;
  contribution: number;
}

export interface PrototypeRiskAssessment {
  overallScore: number;
  severity: RiskSeverity;
  label: string;
  interpretation: string;
  topFactors: RiskFactor[];
  confidenceDisclosure: string;
  computedAt: string;
}

export interface BeltComponentState {
  id: string;
  name: string;
  status: 'ready' | 'active' | 'warning' | 'standby';
  details: string;
}

export interface BeltStatus {
  deviceName: string;
  connectionState: 'connected' | 'paused' | 'disconnected';
  batteryPct: number;
  motionStatus: string;
  protectionState: 'ready' | 'deployed' | 'inspection_required';
  components: BeltComponentState[];
}

export interface AlertItem {
  id: string;
  severity: RiskSeverity;
  title: string;
  category: string;
  reason: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  baseline: number;
}

export type ScenarioType = 
  | 'normal' 
  | 'heat_wave' 
  | 'pollution' 
  | 'fatigue' 
  | 'fall' 
  | 'flood' 
  | 'cyclone';
