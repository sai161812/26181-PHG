import { ScenarioType, SensorReading, EnvironmentSnapshot } from '../domain/types';

export interface ScenarioSetpoint {
  id: ScenarioType;
  name: string;
  expectedScore: number;
  expectedSeverity: 'low' | 'moderate' | 'high' | 'critical';
  sensor: Omit<SensorReading, 'id' | 'sequence' | 'observedAt'>;
  environment: Omit<EnvironmentSnapshot, 'id' | 'observedAt' | 'validUntil'>;
  description: string;
}

export const SCENARIO_SETPOINTS: Record<ScenarioType, ScenarioSetpoint> = {
  normal: {
    id: 'normal',
    name: 'Normal (Baseline)',
    expectedScore: 18,
    expectedSeverity: 'low',
    sensor: {
      source: 'DemoSensorAdapter (ESP32-sim)',
      hr: 72,
      spo2: 98,
      bodyTemperatureC: 36.7,
      activity: 'moderate',
      activityMinutes: 30,
      sleepMinutes: 440, // 7h 20m
      motion: 'resting',
      quality: 100
    },
    environment: {
      ambientC: 30,
      humidityPct: 60,
      aqi: 60,
      locationLabel: 'Demo residence, Chennai',
      outdoor: false,
      exposureMinutes: 10,
      source: 'Demo environmental feed',
      disasterType: 'none',
      disasterSeverity: 'none'
    },
    description: 'Resting physiological signals nominal. No environmental or motion anomalies present.'
  },

  heat_wave: {
    id: 'heat_wave',
    name: 'Heat Wave Exposure',
    expectedScore: 78,
    expectedSeverity: 'high',
    sensor: {
      source: 'DemoSensorAdapter (ESP32-sim)',
      hr: 108, // +50% above 72 baseline (exceeds >=35%)
      spo2: 97,
      bodyTemperatureC: 37.7, // +1.0°C above 36.7 (exceeds >=0.8°C)
      activity: 'high',
      activityMinutes: 90,
      sleepMinutes: 440,
      motion: 'moderate',
      quality: 98
    },
    environment: {
      ambientC: 40, // >= 38°C
      humidityPct: 78, // >= 75%
      aqi: 60,
      locationLabel: 'Outdoor worksite, Chennai',
      outdoor: true,
      exposureMinutes: 45, // >= 30 min
      source: 'Demo environmental feed',
      disasterType: 'none',
      disasterSeverity: 'none'
    },
    description: 'High heat stress: Ambient 40°C, 78% humidity, body temp +1.0°C and HR elevated by 50%.'
  },

  pollution: {
    id: 'pollution',
    name: 'Pollution Event',
    expectedScore: 68,
    expectedSeverity: 'high',
    sensor: {
      source: 'DemoSensorAdapter (ESP32-sim)',
      hr: 82,
      spo2: 94, // 4 pp drop below 98 baseline (exceeds >= 3 pp)
      bodyTemperatureC: 36.7,
      activity: 'moderate',
      activityMinutes: 30,
      sleepMinutes: 440,
      motion: 'moderate',
      quality: 95
    },
    environment: {
      ambientC: 30,
      humidityPct: 60,
      aqi: 185, // Severe (>= 150)
      locationLabel: 'Urban corridor, Chennai',
      outdoor: true,
      exposureMinutes: 30,
      source: 'Demo environmental feed',
      disasterType: 'none',
      disasterSeverity: 'none'
    },
    description: 'Elevated respiratory risk: AQI 185, SpO₂ dropped 4 percentage points outdoor.'
  },

  fatigue: {
    id: 'fatigue',
    name: 'Fatigue & Sleep Deficit',
    expectedScore: 58,
    expectedSeverity: 'moderate',
    sensor: {
      source: 'DemoSensorAdapter (ESP32-sim)',
      hr: 94, // +30.5% above 72 baseline (exceeds >= 25%)
      spo2: 97,
      bodyTemperatureC: 36.8,
      activity: 'high',
      activityMinutes: 180, // >= 120 min accumulated
      sleepMinutes: 240, // 4 hours (200 min deficit below 440 baseline, exceeds >= 120)
      motion: 'moderate',
      quality: 97
    },
    environment: {
      ambientC: 30,
      humidityPct: 60,
      aqi: 60,
      locationLabel: 'Demo residence, Chennai',
      outdoor: false,
      exposureMinutes: 10,
      source: 'Demo environmental feed',
      disasterType: 'none',
      disasterSeverity: 'none'
    },
    description: 'Moderate fatigue: 3h 20m sleep deficit, 3 hours accumulated high exertion, elevated resting HR.'
  },

  fall: {
    id: 'fall',
    name: 'Possible Fall Incident',
    expectedScore: 18, // Physiological vitals remain baseline normal! Fall is event-based.
    expectedSeverity: 'low',
    sensor: {
      source: 'DemoSensorAdapter (ESP32-sim)',
      hr: 74,
      spo2: 98,
      bodyTemperatureC: 36.7,
      activity: 'low',
      activityMinutes: 30,
      sleepMinutes: 440,
      motion: 'erratic_fall', // Abrupt spike
      quality: 90
    },
    environment: {
      ambientC: 30,
      humidityPct: 60,
      aqi: 60,
      locationLabel: 'Indoor hallway, Chennai',
      outdoor: false,
      exposureMinutes: 10,
      source: 'Demo environmental feed',
      disasterType: 'none',
      disasterSeverity: 'none'
    },
    description: 'Simulated fall: MPU6050 vector spike followed by zero movement. Protection timeline armed.'
  },

  flood: {
    id: 'flood',
    name: 'Flood Warning Advisory',
    expectedScore: 18, // Physiological vitals remain baseline normal!
    expectedSeverity: 'low',
    sensor: {
      source: 'DemoSensorAdapter (ESP32-sim)',
      hr: 72,
      spo2: 98,
      bodyTemperatureC: 36.7,
      activity: 'moderate',
      activityMinutes: 30,
      sleepMinutes: 440,
      motion: 'resting',
      quality: 100
    },
    environment: {
      ambientC: 28,
      humidityPct: 85,
      aqi: 50,
      locationLabel: 'Adyar basin, Chennai',
      outdoor: false,
      exposureMinutes: 15,
      source: 'Demo environmental feed (NDMA advisory)',
      disasterType: 'flood',
      disasterSeverity: 'warning'
    },
    description: 'Official flood bulletin active. Vitals normal; emergency preparedness guidance active.'
  },

  cyclone: {
    id: 'cyclone',
    name: 'Cyclone Warning Advisory',
    expectedScore: 18, // Physiological vitals remain baseline normal!
    expectedSeverity: 'low',
    sensor: {
      source: 'DemoSensorAdapter (ESP32-sim)',
      hr: 72,
      spo2: 98,
      bodyTemperatureC: 36.7,
      activity: 'moderate',
      activityMinutes: 30,
      sleepMinutes: 440,
      motion: 'resting',
      quality: 100
    },
    environment: {
      ambientC: 26,
      humidityPct: 90,
      aqi: 40,
      locationLabel: 'Coastal Chennai',
      outdoor: false,
      exposureMinutes: 20,
      source: 'Demo environmental feed (IMD cyclone warning)',
      disasterType: 'cyclone',
      disasterSeverity: 'warning'
    },
    description: 'High cyclone warning active. Vitals normal; sheltering and battery checklist active.'
  }
};
