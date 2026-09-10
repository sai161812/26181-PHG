import { 
  RiskAssessment, 
  CategoryResult, 
  RiskFactorMatch, 
  AnomalyCategory 
} from '../types';
import { RiskInput, RiskEngine } from '../interfaces';
import { 
  BASE_CATEGORY_SCORE, 
  FACTOR_WEIGHTS, 
  getSeverityForScore, 
  getLabelForSeverity 
} from './factorRules';

export class RuleBasedRiskEngine implements RiskEngine {
  private version = '1.0.0-demo-rules';
  private consecutiveElevatedHRSamples = 0;

  public evaluate(input: RiskInput): RiskAssessment {
    const { reading, baseline, environment } = input;
    const allFactors: RiskFactorMatch[] = [];
    const guidanceIds: string[] = [];

    // 1. Evaluate Heat Stress Category
    const heatResult = this.evaluateHeatStress(reading, baseline, environment);
    if (heatResult.status === 'available') {
      allFactors.push(...heatResult.factors);
      if (heatResult.score >= 61) guidanceIds.push('heat_cooling_break');
    }

    // 2. Evaluate Respiratory Category
    const respResult = this.evaluateRespiratory(reading, baseline, environment);
    if (respResult.status === 'available') {
      allFactors.push(...respResult.factors);
      if (respResult.score >= 61) guidanceIds.push('reduce_outdoor_strenuous');
    }

    // 3. Evaluate Fatigue Category
    const fatigueResult = this.evaluateFatigue(reading, baseline);
    if (fatigueResult.status === 'available') {
      allFactors.push(...fatigueResult.factors);
      if (fatigueResult.score >= 55) guidanceIds.push('rest_and_recovery');
    }

    // 4. Evaluate Cardiovascular Pattern Category
    const cardioResult = this.evaluateCardiovascular(reading, baseline);
    if (cardioResult.status === 'available') {
      allFactors.push(...cardioResult.factors);
      if (cardioResult.score >= 61) guidanceIds.push('unexplained_hr_check');
    }

    // 5. Evaluate Fall / Motion Category (Event-based)
    const fallResult = this.evaluateFall(reading);
    if (fallResult.status === 'available') {
      allFactors.push(...fallResult.factors);
      if (fallResult.severity === 'critical') guidanceIds.push('fall_check_in');
    }

    const categoryResults: Record<AnomalyCategory, CategoryResult> = {
      heat: heatResult,
      respiratory: respResult,
      fatigue: fatigueResult,
      cardiovascular: cardioResult,
      fall: fallResult
    };

    // Calculate Overall Score: Maximum of available physiological category scores (never an arbitrary sum!)
    const physiologicalScores = [
      heatResult.status === 'available' ? heatResult.score : null,
      respResult.status === 'available' ? respResult.score : null,
      fatigueResult.status === 'available' ? fatigueResult.score : null,
      cardioResult.status === 'available' ? cardioResult.score : null
    ].filter((s): s is number => s !== null);

    let overallScore = BASE_CATEGORY_SCORE;
    let status: RiskAssessment['status'] = 'full_assessment';

    if (physiologicalScores.length === 0) {
      status = 'insufficient_data';
      overallScore = BASE_CATEGORY_SCORE;
    } else {
      overallScore = Math.max(...physiologicalScores);
      if (physiologicalScores.length < 4) {
        status = 'partial_assessment';
      }
    }

    const severity = getSeverityForScore(overallScore);
    const label = getLabelForSeverity(severity);

    // Synthesis explanation
    let interpretation = 'All vital metrics and environmental parameters are within your personal baseline bounds.';
    if (fallResult.severity === 'critical') {
      interpretation = 'Possible fall detected — immediate check-in needed. Protection event logged.';
    } else if (severity === 'high' || severity === 'critical') {
      const topFactor = allFactors[0]?.label || 'Deviations from baseline detected';
      interpretation = `${topFactor}. Environmental and physiological stressors are contributing.`;
    } else if (severity === 'moderate') {
      interpretation = 'Moderate stress or fatigue indicators observed compared to normal baseline.';
    }

    return {
      id: `eval-${reading.sequence}-${Date.now()}`,
      computedAt: Date.now(),
      inputReadingId: reading.id,
      environmentId: environment.id,
      engineVersion: this.version,
      categoryResults,
      overallScore,
      severity,
      label,
      factors: allFactors,
      topFactors: allFactors.slice(0, 3),
      guidanceIds,
      confidence: null, // Null per demonstration honesty contract
      confidenceText: 'Confidence: not estimated by this demo engine.',
      confidenceDisclosure: 'Confidence: not estimated by this demo engine.',
      status,
      interpretation
    };
  }

  private evaluateHeatStress(reading: RiskInput['reading'], baseline: RiskInput['baseline'], environment: RiskInput['environment']): CategoryResult {
    const missing: string[] = [];
    if (reading.hr === null) missing.push('hr');
    if (reading.bodyTemperatureC === null) missing.push('bodyTemperatureC');
    if (environment.ambientC === null) missing.push('ambientC');
    if (environment.humidityPct === null) missing.push('humidityPct');

    if (missing.length > 0) {
      return {
        category: 'heat',
        score: BASE_CATEGORY_SCORE,
        severity: 'low',
        status: 'insufficient_data',
        factors: [],
        missingInputs: missing
      };
    }

    let score = BASE_CATEGORY_SCORE;
    const factors: RiskFactorMatch[] = [];

    // Condition 1: Ambient >= 38°C (+15)
    if (environment.ambientC >= 38) {
      score += FACTOR_WEIGHTS.HEAT_AMBIENT_HOT;
      factors.push({
        id: 'heat-ambient',
        label: 'Ambient temperature exceeds 38°C',
        category: 'heat',
        observedValue: `${environment.ambientC}°C`,
        baselineRef: '< 38°C',
        contribution: FACTOR_WEIGHTS.HEAT_AMBIENT_HOT
      });
    }

    // Condition 2: Humidity >= 75% (+10)
    if (environment.humidityPct >= 75) {
      score += FACTOR_WEIGHTS.HEAT_HUMIDITY_HIGH;
      factors.push({
        id: 'heat-humidity',
        label: 'High relative humidity inhibits cooling',
        category: 'heat',
        observedValue: `${environment.humidityPct}%`,
        baselineRef: '< 75%',
        contribution: FACTOR_WEIGHTS.HEAT_HUMIDITY_HIGH
      });
    }

    // Condition 3: HR >= 35% above resting baseline (+10)
    const hrDeviationPct = ((reading.hr! - baseline.restingHR) / baseline.restingHR) * 100;
    if (hrDeviationPct >= 35) {
      score += FACTOR_WEIGHTS.HEAT_HR_ELEVATED;
      factors.push({
        id: 'heat-hr',
        label: `Heart rate is ${Math.round(hrDeviationPct)}% above resting baseline`,
        category: 'heat',
        observedValue: `${reading.hr} BPM`,
        baselineRef: `${baseline.restingHR} BPM (+35%)`,
        contribution: FACTOR_WEIGHTS.HEAT_HR_ELEVATED
      });
    }

    // Condition 4: Body temp >= baseline + 0.8°C (+10)
    const tempDelta = reading.bodyTemperatureC! - baseline.bodyTemperatureC;
    if (tempDelta >= 0.8) {
      score += FACTOR_WEIGHTS.HEAT_BODY_TEMP_HIGH;
      factors.push({
        id: 'heat-temp',
        label: `Body temperature is ${tempDelta.toFixed(1)}°C above baseline`,
        category: 'heat',
        observedValue: `${reading.bodyTemperatureC}°C`,
        baselineRef: `${baseline.bodyTemperatureC}°C (+0.8°C)`,
        contribution: FACTOR_WEIGHTS.HEAT_BODY_TEMP_HIGH
      });
    }

    // Condition 5: Activity high (+5)
    if (reading.activity === 'high') {
      score += FACTOR_WEIGHTS.HEAT_ACTIVITY_HIGH;
      factors.push({
        id: 'heat-activity',
        label: 'High physical exertion in warm environment',
        category: 'heat',
        observedValue: 'High',
        baselineRef: 'Resting / Moderate',
        contribution: FACTOR_WEIGHTS.HEAT_ACTIVITY_HIGH
      });
    }

    // Condition 6: Exposure >= 30 min (+10)
    if (environment.exposureMinutes >= 30) {
      score += FACTOR_WEIGHTS.HEAT_EXPOSURE_30MIN;
      factors.push({
        id: 'heat-exposure-30',
        label: 'Continuous heat exposure exceeds 30 minutes',
        category: 'heat',
        observedValue: `${environment.exposureMinutes} min`,
        baselineRef: '< 30 min',
        contribution: FACTOR_WEIGHTS.HEAT_EXPOSURE_30MIN
      });
    }

    // Condition 7: Exposure >= 90 min (+15 in addition)
    if (environment.exposureMinutes >= 90) {
      score += FACTOR_WEIGHTS.HEAT_EXPOSURE_90MIN;
      factors.push({
        id: 'heat-exposure-90',
        label: 'Prolonged extreme heat exposure (≥90 minutes)',
        category: 'heat',
        observedValue: `${environment.exposureMinutes} min`,
        baselineRef: '< 90 min',
        contribution: FACTOR_WEIGHTS.HEAT_EXPOSURE_90MIN
      });
    }

    const finalScore = Math.min(100, Math.max(0, score));
    return {
      category: 'heat',
      score: finalScore,
      severity: getSeverityForScore(finalScore),
      status: 'available',
      factors
    };
  }

  private evaluateRespiratory(reading: RiskInput['reading'], baseline: RiskInput['baseline'], environment: RiskInput['environment']): CategoryResult {
    const missing: string[] = [];
    if (reading.spo2 === null) missing.push('spo2');
    if (environment.aqi === null) missing.push('aqi');

    if (missing.length > 0) {
      return {
        category: 'respiratory',
        score: BASE_CATEGORY_SCORE,
        severity: 'low',
        status: 'insufficient_data',
        factors: [],
        missingInputs: missing
      };
    }

    let score = BASE_CATEGORY_SCORE;
    const factors: RiskFactorMatch[] = [];

    // Condition 1: AQI >= 150 (+20)
    if (environment.aqi >= 150) {
      score += FACTOR_WEIGHTS.RESP_AQI_ELEVATED;
      factors.push({
        id: 'resp-aqi',
        label: 'Severe ambient air pollution (AQI ≥ 150)',
        category: 'respiratory',
        observedValue: `${environment.aqi} AQI`,
        baselineRef: '< 150 AQI',
        contribution: FACTOR_WEIGHTS.RESP_AQI_ELEVATED
      });
    }

    // Condition 2: SpO2 >= 3 percentage points below baseline (+25)
    const spo2Drop = baseline.spo2 - reading.spo2!;
    if (spo2Drop >= 3) {
      score += FACTOR_WEIGHTS.RESP_SPO2_DROP;
      factors.push({
        id: 'resp-spo2',
        label: `SpO₂ oxygen saturation dropped ${spo2Drop} percentage points below baseline`,
        category: 'respiratory',
        observedValue: `${reading.spo2}%`,
        baselineRef: `${baseline.spo2}% (-3 pp)`,
        contribution: FACTOR_WEIGHTS.RESP_SPO2_DROP
      });
    }

    // Condition 3: Outdoor activity present (+5)
    if (environment.outdoor) {
      score += FACTOR_WEIGHTS.RESP_OUTDOOR_ACTIVITY;
      factors.push({
        id: 'resp-outdoor',
        label: 'Active outdoor respiratory exposure',
        category: 'respiratory',
        observedValue: 'Outdoor',
        baselineRef: 'Indoor',
        contribution: FACTOR_WEIGHTS.RESP_OUTDOOR_ACTIVITY
      });
    }

    const finalScore = Math.min(100, Math.max(0, score));
    return {
      category: 'respiratory',
      score: finalScore,
      severity: getSeverityForScore(finalScore),
      status: 'available',
      factors
    };
  }

  private evaluateFatigue(reading: RiskInput['reading'], baseline: RiskInput['baseline']): CategoryResult {
    const missing: string[] = [];
    if (reading.hr === null) missing.push('hr');

    if (missing.length > 0) {
      return {
        category: 'fatigue',
        score: BASE_CATEGORY_SCORE,
        severity: 'low',
        status: 'insufficient_data',
        factors: [],
        missingInputs: missing
      };
    }

    let score = BASE_CATEGORY_SCORE;
    const factors: RiskFactorMatch[] = [];

    // Condition 1: Sleep at least 120 minutes below baseline (+20)
    const sleepDeficit = baseline.sleepMinutes - reading.sleepMinutes;
    if (sleepDeficit >= 120) {
      score += FACTOR_WEIGHTS.FATIGUE_SLEEP_DEFICIT;
      factors.push({
        id: 'fatigue-sleep',
        label: `Sleep deficit of ${Math.round(sleepDeficit / 60)} hours below normal`,
        category: 'fatigue',
        observedValue: `${reading.sleepMinutes} min`,
        baselineRef: `${baseline.sleepMinutes} min`,
        contribution: FACTOR_WEIGHTS.FATIGUE_SLEEP_DEFICIT
      });
    }

    // Condition 2: Accumulated active minutes >= 120 (+10)
    if (reading.activityMinutes >= 120) {
      score += FACTOR_WEIGHTS.FATIGUE_ACTIVITY_HIGH;
      factors.push({
        id: 'fatigue-active-time',
        label: `High accumulated physical activity (${reading.activityMinutes} min)`,
        category: 'fatigue',
        observedValue: `${reading.activityMinutes} min`,
        baselineRef: '< 120 min',
        contribution: FACTOR_WEIGHTS.FATIGUE_ACTIVITY_HIGH
      });
    }

    // Condition 3: HR >= 25% above baseline (+10)
    const hrDeviationPct = ((reading.hr! - baseline.restingHR) / baseline.restingHR) * 100;
    if (hrDeviationPct >= 25) {
      score += FACTOR_WEIGHTS.FATIGUE_HR_ELEVATED;
      factors.push({
        id: 'fatigue-hr',
        label: `Elevated cardiovascular strain (${Math.round(hrDeviationPct)}% above baseline)`,
        category: 'fatigue',
        observedValue: `${reading.hr} BPM`,
        baselineRef: `${baseline.restingHR} BPM (+25%)`,
        contribution: FACTOR_WEIGHTS.FATIGUE_HR_ELEVATED
      });
    }

    const finalScore = Math.min(100, Math.max(0, score));
    return {
      category: 'fatigue',
      score: finalScore,
      severity: getSeverityForScore(finalScore),
      status: 'available',
      factors
    };
  }

  private evaluateCardiovascular(reading: RiskInput['reading'], baseline: RiskInput['baseline']): CategoryResult {
    if (reading.hr === null) {
      return {
        category: 'cardiovascular',
        score: BASE_CATEGORY_SCORE,
        severity: 'low',
        status: 'insufficient_data',
        factors: [],
        missingInputs: ['hr']
      };
    }

    let score = BASE_CATEGORY_SCORE;
    const factors: RiskFactorMatch[] = [];
    const hrDeviationPct = ((reading.hr - baseline.restingHR) / baseline.restingHR) * 100;

    // Condition 1: Low/resting activity AND HR >= 35% above baseline (+35)
    if (reading.activity === 'low' && hrDeviationPct >= 35) {
      score += FACTOR_WEIGHTS.CARDIO_UNEXPLAINED_HR;
      factors.push({
        id: 'cardio-unexplained',
        label: `Unexplained tachycardia at rest (${Math.round(hrDeviationPct)}% above baseline)`,
        category: 'cardiovascular',
        observedValue: `${reading.hr} BPM`,
        baselineRef: `${baseline.restingHR} BPM (+35%)`,
        contribution: FACTOR_WEIGHTS.CARDIO_UNEXPLAINED_HR
      });
      this.consecutiveElevatedHRSamples++;
    } else {
      this.consecutiveElevatedHRSamples = 0;
    }

    // Condition 2: Same unexplained HR deviation persists across three valid samples (+15)
    if (this.consecutiveElevatedHRSamples >= 3) {
      score += FACTOR_WEIGHTS.CARDIO_PERSISTENT_HR;
      factors.push({
        id: 'cardio-persistent',
        label: 'Persistent unexplained resting tachycardia over 3 consecutive samples',
        category: 'cardiovascular',
        observedValue: `${this.consecutiveElevatedHRSamples} samples`,
        baselineRef: '< 3 samples',
        contribution: FACTOR_WEIGHTS.CARDIO_PERSISTENT_HR
      });
    }

    const finalScore = Math.min(100, Math.max(0, score));
    return {
      category: 'cardiovascular',
      score: finalScore,
      severity: getSeverityForScore(finalScore),
      status: 'available',
      factors
    };
  }

  private evaluateFall(reading: RiskInput['reading']): CategoryResult {
    const isFall = reading.motion === 'erratic_fall' || reading.motion === 'inactive_post_fall';
    const factors: RiskFactorMatch[] = [];

    if (isFall) {
      factors.push({
        id: 'fall-motion',
        label: 'Abrupt acceleration spike followed by zero movement',
        category: 'fall',
        observedValue: 'Impact vector detected',
        baselineRef: 'Upright / Resting',
        contribution: 0
      });
    }

    return {
      category: 'fall',
      score: isFall ? 95 : BASE_CATEGORY_SCORE,
      severity: isFall ? 'critical' : 'low',
      status: 'available',
      factors
    };
  }
}
