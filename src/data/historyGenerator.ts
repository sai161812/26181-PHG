import { Baseline } from '../domain/types';

export interface HistoricalAggregate {
  timestamp: number;
  dateStr: string;
  hrAvg: number;
  spo2Avg: number;
  tempAvg: number;
  activeMin: number;
  sleepMin: number;
  riskScore: number;
}

// Simple deterministic pseudo-random generator (Linear Congruential Generator)
class SeededPRNG {
  private seed: number;
  constructor(seed = 26181) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }
  public next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
  public range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

export interface TrendDataPoint {
  timeLabel: string;
  timestamp: number;
  value: number;
  baselineVal: number;
  min?: number;
  max?: number;
}

export interface MetricInsights {
  min: number;
  max: number;
  avg: number;
  baselineVal: number;
  deltaFromBaseline: number;
  statusLabel: string;
  summaryText: string;
}

export function generateDeterministicTodayHistory(
  baseline: Baseline, 
  currentHR?: number | null, 
  currentSpO2?: number | null
): HistoricalAggregate[] {
  const prng = new SeededPRNG(26181 + 7);
  const points: HistoricalAggregate[] = [];
  const now = new Date();
  
  // 12 points spaced every 2 hours: 00:00, 02:00 ... 22:00
  const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  
  hours.forEach((h, idx) => {
    const isNight = h < 6 || h >= 22;
    // Diurnal variations: night HR is lower, active midday HR is slightly higher
    const hrDiurnal = isNight ? -4 : (h >= 10 && h <= 18 ? 5 : 0);
    const hrNoise = Math.round(prng.range(-2, 2));
    
    // Last point incorporates live current reading if available
    const isCurrentTimeSlot = idx === hours.length - 1;
    const finalHR = isCurrentTimeSlot && currentHR ? currentHR : (baseline.restingHR + hrDiurnal + hrNoise);
    const finalSpO2 = isCurrentTimeSlot && currentSpO2 ? currentSpO2 : Math.min(100, Math.max(95, baseline.spo2 + Math.round(prng.range(-1, 1))));
    
    const timeStr = `${h.toString().padStart(2, '0')}:00`;
    
    points.push({
      timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), h).getTime(),
      dateStr: timeStr,
      hrAvg: finalHR,
      spo2Avg: finalSpO2,
      tempAvg: Math.round((baseline.bodyTemperatureC + (isNight ? -0.2 : 0.1) + prng.range(-0.1, 0.1)) * 10) / 10,
      activeMin: isNight ? 0 : Math.round(prng.range(5, 12)),
      sleepMin: isNight ? 110 : 0,
      riskScore: 18
    });
  });

  return points;
}

export function generateDeterministic30DayHistory(baseline: Baseline): HistoricalAggregate[] {
  const prng = new SeededPRNG(26181);
  const aggregates: HistoricalAggregate[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 29; i >= 0; i--) {
    const dayTimestamp = now - i * dayMs;
    const dateObj = new Date(dayTimestamp);
    const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

    // Seeded variations around baseline medians (72 bpm, 98% SpO2, 36.7°C, 440m sleep)
    // Keep variation symmetrical so calculated medians stay exactly at baseline
    const hrNoise = Math.round(prng.range(-2, 2));
    const spo2Noise = Math.round(prng.range(-1, 1));
    const tempNoise = Math.round(prng.range(-0.1, 0.1) * 10) / 10;
    const activeNoise = Math.round(prng.range(-5, 8));
    const sleepNoise = Math.round(prng.range(-15, 20));

    aggregates.push({
      timestamp: dayTimestamp,
      dateStr,
      hrAvg: baseline.restingHR + hrNoise,
      spo2Avg: Math.min(100, Math.max(95, baseline.spo2 + spo2Noise)),
      tempAvg: Math.round((baseline.bodyTemperatureC + tempNoise) * 10) / 10,
      activeMin: Math.max(20, 42 + activeNoise),
      sleepMin: Math.max(360, baseline.sleepMinutes + sleepNoise),
      riskScore: 18 // Base low prototype score
    });
  }

  return aggregates;
}

export function deriveTrendInsights(
  metricId: 'hr' | 'spo2' | 'temp' | 'activity' | 'sleep' | 'risk',
  timeframe: 'today' | '7d' | '30d',
  dataPoints: TrendDataPoint[],
  baseline: Baseline
): MetricInsights {
  if (dataPoints.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      baselineVal: 0,
      deltaFromBaseline: 0,
      statusLabel: 'No data',
      summaryText: 'Insufficient historical data points available in this window.'
    };
  }

  const values = dataPoints.map(p => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const sum = values.reduce((acc, v) => acc + v, 0);
  const avg = Math.round((sum / values.length) * 10) / 10;
  
  let baselineVal = baseline.restingHR;
  let unit = 'BPM';
  if (metricId === 'spo2') {
    baselineVal = baseline.spo2;
    unit = '%';
  } else if (metricId === 'temp') {
    baselineVal = baseline.bodyTemperatureC;
    unit = '°C';
  } else if (metricId === 'activity') {
    baselineVal = 30; // standard daily target
    unit = 'min';
  } else if (metricId === 'sleep') {
    baselineVal = Math.round((baseline.sleepMinutes / 60) * 10) / 10;
    unit = 'hrs';
  } else if (metricId === 'risk') {
    baselineVal = 18;
    unit = 'pts';
  }

  const deltaFromBaseline = Math.round((avg - baselineVal) * 10) / 10;

  let statusLabel = 'Nominal';
  let summaryText = '';

  const tfLabel = timeframe === 'today' ? 'today' : timeframe === '7d' ? 'over the last 7 days' : 'across the 30-day baseline window';

  switch (metricId) {
    case 'hr':
      statusLabel = avg > 85 ? 'Elevated' : avg < 55 ? 'Bradycardia' : 'Stable';
      summaryText = `Heart rate averaged ${avg} ${unit} ${tfLabel} (min ${min}, max ${max}). Comparison against the personal resting baseline of ${baselineVal} ${unit} demonstrates stable sinus rhythm with zero sustained tachycardic events.`;
      break;
    case 'spo2':
      statusLabel = avg < 95 ? 'Hypoxic Concern' : 'Optimal';
      summaryText = `Oxygen saturation averaged ${avg}${unit} ${tfLabel} (range ${min}%–${max}%). Consistently preserved above the 95% threshold, aligned with the personal baseline of ${baselineVal}%.`;
      break;
    case 'temp':
      statusLabel = avg >= 37.8 ? 'Febrile' : 'Normothermic';
      summaryText = `Core body temperature averaged ${avg}${unit} ${tfLabel} (range ${min}°C–${max}°C). Demonstrates expected diurnal thermal regulation around the personal baseline of ${baselineVal}°C.`;
      break;
    case 'activity':
      statusLabel = avg >= 30 ? 'Target Met' : 'Sedentary';
      summaryText = `Active physical exertion recorded an average of ${avg} ${unit}/period ${tfLabel}. Cumulative daily movement satisfies personal baseline targets with normal pacing.`;
      break;
    case 'sleep':
      statusLabel = avg >= 7.0 ? 'Restorative' : 'Sleep Deficit';
      summaryText = `Nightly sleep averaged ${avg} ${unit} ${tfLabel} (min ${min}h, max ${max}h). Shows solid circadian continuity relative to the personal target of ${baselineVal} ${unit}.`;
      break;
    case 'risk':
      statusLabel = avg <= 30 ? 'Low Risk' : avg <= 60 ? 'Moderate Risk' : 'Elevated Risk';
      summaryText = `Prototype AI Risk Score averaged ${avg} / 100 ${tfLabel}. Baseline evaluation confirmed low overall physiological stress during regular daily activity.`;
      break;
  }

  return {
    min,
    max,
    avg,
    baselineVal,
    deltaFromBaseline,
    statusLabel,
    summaryText
  };
}
