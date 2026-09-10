/**
 * DEMONSTRATION RISK ENGINE FACTOR RULES
 * 
 * IMPORTANT NON-CLINICAL DISCLAIMER:
 * The mathematical weights and factor conditions defined below are deliberately 
 * arbitrary demonstration values crafted for the SIH26181 interactive laptop prototype.
 * They ARE NOT clinical thresholds, medical diagnostics, or validated physiological rules,
 * and MUST NEVER be reused for real medical diagnosis or life-critical patient monitoring.
 */

import { RiskSeverity } from '../types';

export const BASE_CATEGORY_SCORE = 18;

export const RISK_BANDS = {
  LOW: { min: 0, max: 30, label: 'Low Risk', severity: 'low' as RiskSeverity },
  MODERATE: { min: 31, max: 60, label: 'Moderate Risk', severity: 'moderate' as RiskSeverity },
  HIGH: { min: 61, max: 80, label: 'High Risk', severity: 'high' as RiskSeverity },
  CRITICAL: { min: 81, max: 100, label: 'Critical Risk', severity: 'critical' as RiskSeverity }
};

export function getSeverityForScore(score: number): RiskSeverity {
  if (score <= 30) return 'low';
  if (score <= 60) return 'moderate';
  if (score <= 80) return 'high';
  return 'critical';
}

export function getLabelForSeverity(severity: RiskSeverity): string {
  switch (severity) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Critical Risk';
  }
}

export const FACTOR_WEIGHTS = {
  // Heat Stress Factors
  HEAT_AMBIENT_HOT: 15,       // Ambient >= 38°C
  HEAT_HUMIDITY_HIGH: 10,     // Humidity >= 75%
  HEAT_HR_ELEVATED: 10,       // HR >= 35% above resting baseline
  HEAT_BODY_TEMP_HIGH: 10,    // Body temp >= baseline + 0.8°C
  HEAT_ACTIVITY_HIGH: 5,      // Activity high
  HEAT_EXPOSURE_30MIN: 10,    // Exposure >= 30 min
  HEAT_EXPOSURE_90MIN: 15,    // Exposure >= 90 min (in addition to 30 min)

  // Respiratory Factors
  RESP_AQI_ELEVATED: 20,      // AQI >= 150
  RESP_SPO2_DROP: 25,         // SpO2 >= 3 percentage points below baseline
  RESP_OUTDOOR_ACTIVITY: 5,   // Outdoor activity present

  // Fatigue Factors
  FATIGUE_SLEEP_DEFICIT: 20,  // Sleep at least 120 min below baseline
  FATIGUE_ACTIVITY_HIGH: 10,  // Accumulated active minutes >= 120
  FATIGUE_HR_ELEVATED: 10,    // HR >= 25% above baseline

  // Cardiovascular Pattern Factors
  CARDIO_UNEXPLAINED_HR: 35,  // Low/resting activity AND HR >= 35% above baseline
  CARDIO_PERSISTENT_HR: 15    // Same unexplained HR deviation across 3 samples
};
