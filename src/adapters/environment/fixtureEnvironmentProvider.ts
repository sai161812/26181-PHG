import { EnvironmentProvider } from '../../domain/interfaces';
import { EnvironmentSnapshot, ScenarioType } from '../../domain/types';
import { SCENARIO_SETPOINTS } from '../../data/scenarios';

export class FixtureEnvironmentProvider implements EnvironmentProvider {
  private currentSnapshot: EnvironmentSnapshot;
  private isOffline = false;
  private cachedExternalSnapshot: EnvironmentSnapshot | null = null;
  private isSyntheticOfflineInjection = false;

  constructor(initialScenario: ScenarioType = 'normal') {
    this.currentSnapshot = this.buildSnapshotForScenario(initialScenario);
  }

  public async getSnapshot(): Promise<EnvironmentSnapshot> {
    const now = Date.now();

    if (this.isOffline) {
      // Offline: retain frozen timestamps without advancing update timestamp
      const isExpired = now > this.currentSnapshot.validUntil;
      const sourceLabel = this.isSyntheticOfflineInjection
        ? 'Synthetic demo context (Simulated locally)'
        : (isExpired 
            ? 'Outdated — current conditions unavailable' 
            : (this.currentSnapshot.source.includes('Cached') 
                ? this.currentSnapshot.source 
                : `${this.currentSnapshot.source} (Cached)`));

      return {
        ...this.currentSnapshot,
        source: sourceLabel
      };
    }

    // Online: update observedAt and validUntil
    return {
      ...this.currentSnapshot,
      observedAt: now,
      validUntil: now + 15 * 60 * 1000
    };
  }

  public setSimulatedScenario(snapshot: EnvironmentSnapshot): void {
    this.currentSnapshot = { ...snapshot };
  }

  public setScenario(scenario: ScenarioType): void {
    const newSnapshot = this.buildSnapshotForScenario(scenario);
    if (this.isOffline) {
      // Section 8: "A scenario triggered while offline can inject synthetic demo context so judges can still explore the UI. Label it 'Simulated locally'; do not claim a new real disaster bulletin arrived without a network."
      this.isSyntheticOfflineInjection = true;
      this.currentSnapshot = {
        ...newSnapshot,
        source: 'Synthetic demo context (Simulated locally)'
      };
    } else {
      this.isSyntheticOfflineInjection = false;
      this.currentSnapshot = newSnapshot;
    }
  }

  public setOffline(offline: boolean): void {
    if (offline && !this.isOffline) {
      // Freezing current external snapshot
      this.cachedExternalSnapshot = { ...this.currentSnapshot };
      this.isSyntheticOfflineInjection = false;
    } else if (!offline && this.isOffline) {
      // Restoring connectivity: advance observedAt
      this.isSyntheticOfflineInjection = false;
      this.cachedExternalSnapshot = null;
    }
    this.isOffline = offline;
  }

  public getIsOffline(): boolean {
    return this.isOffline;
  }

  public getCachedExternalSnapshot(): EnvironmentSnapshot | null {
    return this.cachedExternalSnapshot;
  }

  public isSyntheticInjection(): boolean {
    return this.isSyntheticOfflineInjection;
  }

  private buildSnapshotForScenario(scenario: ScenarioType): EnvironmentSnapshot {
    const sp = SCENARIO_SETPOINTS[scenario].environment;
    const now = Date.now();
    return {
      id: `env-${scenario}-${now}`,
      ambientC: sp.ambientC,
      humidityPct: sp.humidityPct,
      aqi: sp.aqi,
      locationLabel: sp.locationLabel,
      outdoor: sp.outdoor,
      exposureMinutes: sp.exposureMinutes,
      source: sp.source,
      observedAt: now,
      validUntil: now + 15 * 60 * 1000,
      disasterType: sp.disasterType,
      disasterSeverity: sp.disasterSeverity
    };
  }
}
