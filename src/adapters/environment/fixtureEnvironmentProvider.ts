import { EnvironmentProvider } from '../../domain/interfaces';
import { EnvironmentSnapshot, ScenarioType } from '../../domain/types';
import { SCENARIO_SETPOINTS } from '../../data/scenarios';

export class FixtureEnvironmentProvider implements EnvironmentProvider {
  private currentSnapshot: EnvironmentSnapshot;
  private isOffline = false;

  constructor(initialScenario: ScenarioType = 'normal') {
    this.currentSnapshot = this.buildSnapshotForScenario(initialScenario);
  }

  public async getSnapshot(): Promise<EnvironmentSnapshot> {
    if (this.isOffline) {
      return {
        ...this.currentSnapshot,
        source: 'Cached environmental context (Offline mode)'
      };
    }
    return { ...this.currentSnapshot, observedAt: Date.now() };
  }

  public setSimulatedScenario(snapshot: EnvironmentSnapshot): void {
    this.currentSnapshot = { ...snapshot };
  }

  public setScenario(scenario: ScenarioType): void {
    this.currentSnapshot = this.buildSnapshotForScenario(scenario);
  }

  public setOffline(offline: boolean): void {
    this.isOffline = offline;
  }

  public getIsOffline(): boolean {
    return this.isOffline;
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
