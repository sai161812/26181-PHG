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
