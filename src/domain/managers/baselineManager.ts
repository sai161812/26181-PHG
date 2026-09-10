import { Baseline } from '../types';

export class BaselineManager {
  public static calculateHRDeviationPct(currentHR: number, baselineHR: number): number {
    if (baselineHR <= 0) return 0;
    return Math.round(((currentHR - baselineHR) / baselineHR) * 100);
  }

  public static calculateSpO2DiffPp(currentSpO2: number, baselineSpO2: number): number {
    return baselineSpO2 - currentSpO2; // Difference in percentage points
  }

  public static calculateTempDelta(currentTemp: number, baselineTemp: number): number {
    return Math.round((currentTemp - baselineTemp) * 10) / 10;
  }

  public static recalculateFromHistory(
    history: Array<{ hrAvg: number; spo2Avg: number; tempAvg: number; sleepMin: number }>,
    currentBaseline?: Baseline
  ): Partial<Baseline> {
    if (history.length === 0) return {};
    
    // Sort for median calculation
    const hrs = [...history.map(h => h.hrAvg)].sort((a, b) => a - b);
    const spo2s = [...history.map(h => h.spo2Avg)].sort((a, b) => a - b);
    const temps = [...history.map(h => h.tempAvg)].sort((a, b) => a - b);
    const sleeps = [...history.map(h => h.sleepMin)].sort((a, b) => a - b);

    const mid = Math.floor(hrs.length / 2);
    const isManual = currentBaseline?.isManualRestingHR ?? false;

    return {
      restingHR: isManual && currentBaseline ? currentBaseline.restingHR : hrs[mid],
      spo2: spo2s[mid],
      bodyTemperatureC: temps[mid],
      sleepMinutes: sleeps[mid],
      isManualRestingHR: isManual,
      source: isManual 
        ? '30-day medians (Manual resting HR preserved)' 
        : 'Recalculated from 30-day illustrative history medians',
      computedAt: 'Just now'
    };
  }
}
