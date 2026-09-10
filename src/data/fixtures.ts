// Centralized Typed Fixture Data for Phase 1 Desktop Visual Foundation
import { 
  UserProfile, 
  Baseline, 
  VitalMetric, 
  EnvironmentMetrics, 
  PrototypeRiskAssessment, 
  BeltStatus, 
  AlertItem, 
  ChartDataPoint 
} from '../types/domain';

export const DEMO_PROFILE: UserProfile = {
  id: 'usr-ravi-62',
  name: 'Ravi',
  age: 62,
  gender: 'Male',
  restingHR: 72,
  emergencyContact: {
    name: 'Demo caregiver',
    relationship: 'Family Member',
    phone: '+91 98XXX XXXXX'
  },
  profileOrigin: 'demo_seed'
};

export const DEMO_BASELINE: Baseline = {
  restingHR: 72,
  spo2: 98,
  bodyTemperatureC: 36.7,
  activity: 'Moderate',
  sleepMinutes: 440, // 7h 20m
  sampleCount: 1440,
  timeWindow: '30-day rolling baseline',
  source: 'Illustrative demo history (resting medians)',
  computedAt: 'Today, 06:00 AM'
};

export const CURRENT_VITALS: Record<string, VitalMetric> = {
  hr: {
    id: 'hr',
    name: 'Heart rate',
    value: 72,
    unit: 'BPM',
    baseline: 72,
    deltaText: '0% from baseline',
    trend: 'stable',
    sparkline: [71, 72, 73, 72, 71, 72, 72, 73, 72],
    status: 'normal'
  },
  spo2: {
    id: 'spo2',
    name: 'SpO₂ oxygen',
    value: 98,
    unit: '%',
    baseline: 98,
    deltaText: '0 pp from baseline',
    trend: 'stable',
    sparkline: [98, 98, 97, 98, 98, 98, 99, 98, 98],
    status: 'normal'
  },
  temp: {
    id: 'temp',
    name: 'Body temperature',
    value: 36.7,
    unit: '°C',
    baseline: 36.7,
    deltaText: 'Nominal',
    trend: 'stable',
    sparkline: [36.6, 36.7, 36.7, 36.6, 36.7, 36.7, 36.7],
    status: 'normal'
  },
  activity: {
    id: 'activity',
    name: 'Daily activity',
    value: 42,
    unit: 'min',
    baseline: 45,
    deltaText: 'Moderate movement',
    trend: 'stable',
    sparkline: [10, 15, 22, 28, 32, 38, 42],
    status: 'normal'
  }
};

export const CURRENT_ENVIRONMENT: EnvironmentMetrics = {
  ambientC: 30,
  humidityPct: 60,
  aqi: 60,
  locationLabel: 'Demo residence, Chennai',
  outdoor: false,
  exposureMinutes: 10,
  source: 'Demo environmental feed',
  observedAt: 'Just now',
  validUntil: 'Valid for 15m'
};

export const CURRENT_RISK_ASSESSMENT: PrototypeRiskAssessment = {
  overallScore: 18,
  severity: 'low',
  label: 'Low Risk',
  interpretation: 'All vital metrics and environmental parameters are within your personal baseline bounds.',
  topFactors: [
    {
      id: 'f-hr-nominal',
      label: 'Resting heart rate in baseline range',
      category: 'cardiovascular',
      observedValue: '72 BPM',
      baselineRef: '72 BPM',
      contribution: 0
    },
    {
      id: 'f-spo2-nominal',
      label: 'SpO₂ oxygen saturation optimal',
      category: 'respiratory',
      observedValue: '98%',
      baselineRef: '98%',
      contribution: 0
    },
    {
      id: 'f-env-nominal',
      label: 'Ambient conditions within comfortable limits',
      category: 'heat',
      observedValue: '30°C / 60% RH',
      baselineRef: '< 38°C',
      contribution: 0
    }
  ],
  confidenceDisclosure: 'Confidence: not estimated by this demo engine.',
  computedAt: 'Just now'
};

export const CURRENT_BELT_STATUS: BeltStatus = {
  deviceName: 'Integrated Health Belt — Demo Sensor',
  connectionState: 'connected',
  batteryPct: 84,
  motionStatus: 'Upright / Resting',
  protectionState: 'ready',
  components: [
    { id: 'mpu', name: 'Motion (MPU6050)', status: 'active', details: 'Normal posture, ±0.02g variance' },
    { id: 'vitals', name: 'HR / SpO₂ / Temp sensors', status: 'ready', details: 'Optoelectronic feed active' },
    { id: 'controller', name: 'ESP32 controller', status: 'ready', details: 'Edge loop synchronized (2s)' },
    { id: 'protection', name: 'Airbag & CO₂ module', status: 'ready', details: 'Solenoid valve armed, pressurized' }
  ]
};

export const RECENT_ALERTS: AlertItem[] = [
  {
    id: 'alt-01',
    severity: 'low',
    title: 'Daily baseline calibration verified',
    category: 'System',
    reason: '30-day resting heart rate and SpO₂ medians synchronized with demo profile.',
    timestamp: 'Today, 08:30 AM',
    acknowledged: true
  },
  {
    id: 'alt-02',
    severity: 'low',
    title: 'Integrated belt connected successfully',
    category: 'Device',
    reason: 'Simulated MPU6050 motion channel and ESP32 telemetry feed established.',
    timestamp: 'Today, 08:15 AM',
    acknowledged: true
  },
  {
    id: 'alt-03',
    severity: 'low',
    title: 'Environmental context refreshed',
    category: 'Environment',
    reason: 'Ambient temperature 30°C, humidity 60%, AQI 60 (satisfactory air quality).',
    timestamp: 'Today, 08:00 AM',
    acknowledged: true
  }
];

export const LIVE_CHART_DATA: ChartDataPoint[] = [
  { time: '10:48', value: 71, baseline: 72 },
  { time: '10:49', value: 72, baseline: 72 },
  { time: '10:50', value: 73, baseline: 72 },
  { time: '10:51', value: 72, baseline: 72 },
  { time: '10:52', value: 71, baseline: 72 },
  { time: '10:53', value: 72, baseline: 72 },
  { time: '10:54', value: 73, baseline: 72 },
  { time: '10:55', value: 72, baseline: 72 },
  { time: '10:56', value: 72, baseline: 72 },
  { time: '10:57', value: 73, baseline: 72 },
  { time: '10:58', value: 71, baseline: 72 },
  { time: '10:59', value: 72, baseline: 72 }
];
