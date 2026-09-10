import { SensorAdapter } from '../../domain/interfaces';
import { SensorReading, ScenarioType } from '../../domain/types';
import { SCENARIO_SETPOINTS } from '../../data/scenarios';

export class DemoSensorAdapter implements SensorAdapter {
  private connected = true;
  private paused = false;
  private subscribers: Set<(reading: SensorReading) => void> = new Set();
  private timer: any = null;
  private sequence = 1;

  // Active interpolation state
  private currentHR = 72;
  private currentSpO2 = 98;
  private currentTemp = 36.7;
  private targetHR = 72;
  private targetSpO2 = 98;
  private targetTemp = 36.7;
  private targetActivity: 'low' | 'moderate' | 'high' = 'moderate';
  private targetActiveMin = 30;
  private targetSleepMin = 440;
  private targetMotion: 'resting' | 'moderate' | 'erratic_fall' | 'inactive_post_fall' = 'resting';

  constructor() {
    this.startLoop();
  }

  public async connect(): Promise<void> {
    this.connected = true;
    this.startLoop();
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
    this.stopLoop();
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public isPaused(): boolean {
    return this.paused;
  }

  public setScenario(scenario: ScenarioType): void {
    const target = SCENARIO_SETPOINTS[scenario].sensor;
    this.targetHR = target.hr ?? 72;
    this.targetSpO2 = target.spo2 ?? 98;
    this.targetTemp = target.bodyTemperatureC ?? 36.7;
    this.targetActivity = target.activity;
    this.targetActiveMin = target.activityMinutes;
    this.targetSleepMin = target.sleepMinutes;
    this.targetMotion = target.motion;
  }

  public resetToNormal(): void {
    this.setScenario('normal');
    this.currentHR = 72;
    this.currentSpO2 = 98;
    this.currentTemp = 36.7;
    this.paused = false;
    this.connected = true;
  }

  public subscribe(onReading: (reading: SensorReading) => void): () => void {
    this.subscribers.add(onReading);
    return () => {
      this.subscribers.delete(onReading);
    };
  }

  private startLoop(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      if (!this.connected || this.paused) return;
      this.tick();
    }, 2000);
  }

  private stopLoop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick(): void {
    this.sequence++;

    // Smooth transition towards targets (~3 ticks / 6 seconds transition)
    this.currentHR += (this.targetHR - this.currentHR) * 0.45;
    this.currentSpO2 += (this.targetSpO2 - this.currentSpO2) * 0.45;
    this.currentTemp += (this.targetTemp - this.currentTemp) * 0.45;

    // Small bounded noise when settled (±1 bpm, ±0.1°C)
    const isSettled = Math.abs(this.targetHR - this.currentHR) < 1;
    const hrNoise = isSettled ? (Math.random() > 0.5 ? 0.4 : -0.4) : 0;
    const tempNoise = isSettled ? (Math.random() > 0.5 ? 0.03 : -0.03) : 0;

    const settledHR = Math.round(this.currentHR + hrNoise);
    const settledSpO2 = Math.round(this.currentSpO2);
    const settledTemp = Math.round((this.currentTemp + tempNoise) * 10) / 10;

    const reading: SensorReading = {
      id: `rdg-${this.sequence}-${Date.now()}`,
      sequence: this.sequence,
      observedAt: Date.now(),
      source: 'DemoSensorAdapter (ESP32-sim)',
      hr: settledHR,
      spo2: settledSpO2,
      bodyTemperatureC: settledTemp,
      activity: this.targetActivity,
      activityMinutes: this.targetActiveMin,
      sleepMinutes: this.targetSleepMin,
      motion: this.targetMotion,
      quality: this.connected ? 100 : 0
    };

    this.subscribers.forEach(sub => sub(reading));
  }

  public getCurrentReading(): SensorReading {
    return {
      id: `rdg-${this.sequence}-${Date.now()}`,
      sequence: this.sequence,
      observedAt: Date.now(),
      source: 'DemoSensorAdapter (ESP32-sim)',
      hr: Math.round(this.currentHR),
      spo2: Math.round(this.currentSpO2),
      bodyTemperatureC: Math.round(this.currentTemp * 10) / 10,
      activity: this.targetActivity,
      activityMinutes: this.targetActiveMin,
      sleepMinutes: this.targetSleepMin,
      motion: this.targetMotion,
      quality: this.connected ? 100 : 0
    };
  }
}
