import { Alert, RiskAssessment, RiskSeverity } from '../types';

export class AlertManager {
  private activeEpisodeByCategory: Map<string, Alert> = new Map();
  private consecutiveHighSamplesByCategory: Map<string, number> = new Map();
  private consecutiveNormalSamplesByCategory: Map<string, number> = new Map();

  public processAssessment(
    assessment: RiskAssessment, 
    inputSnapshot: Alert['inputSnapshot'], 
    currentAlerts: Alert[]
  ): Alert[] {
    let updatedAlerts = [...currentAlerts];

    // Evaluate each physiological category for alerts (threshold: score >= 61 High)
    const categoriesToTrack = ['heat', 'respiratory', 'fatigue', 'cardiovascular'] as const;

    for (const cat of categoriesToTrack) {
      const catResult = assessment.categoryResults[cat];
      const isHigh = catResult.status === 'available' && (catResult.severity === 'high' || catResult.severity === 'critical');
      const currentHighCount = this.consecutiveHighSamplesByCategory.get(cat) || 0;
      const currentNormalCount = this.consecutiveNormalSamplesByCategory.get(cat) || 0;
      const activeEpisode = this.activeEpisodeByCategory.get(cat);

      if (isHigh) {
        const nextHighCount = currentHighCount + 1;
        this.consecutiveHighSamplesByCategory.set(cat, nextHighCount);
        this.consecutiveNormalSamplesByCategory.set(cat, 0);

        // 2 consecutive qualifying samples trigger or update active alert
        if (nextHighCount >= 2) {
          if (!activeEpisode) {
            // Create new deduplicated active episode
            const newAlert: Alert = {
              id: `alt-${cat}-${Date.now()}`,
              episodeId: `ep-${cat}-${Date.now()}`,
              category: cat,
              severity: catResult.severity,
              title: this.getTitleForCategory(cat, catResult.severity),
              reason: catResult.factors.map(f => f.label).join('. ') || 'Elevated physiological strain detected.',
              recommendedAction: this.getActionForCategory(cat),
              inputSnapshot: { ...inputSnapshot },
              createdAt: Date.now(),
              lastSeenAt: Date.now(),
              consecutiveSamples: nextHighCount,
              acknowledgedAt: null,
              resolvedAt: null
            };

            this.activeEpisodeByCategory.set(cat, newAlert);
            updatedAlerts = [newAlert, ...updatedAlerts.slice(0, 199)]; // Bounded to 200 alerts
          } else {
            // Update existing episode lastSeenAt and severity escalation if higher
            activeEpisode.lastSeenAt = Date.now();
            activeEpisode.consecutiveSamples = nextHighCount;
            if (this.severityRank(catResult.severity) > this.severityRank(activeEpisode.severity)) {
              activeEpisode.severity = catResult.severity;
            }
            updatedAlerts = updatedAlerts.map(a => a.episodeId === activeEpisode.episodeId ? { ...activeEpisode } : a);
          }
        }
      } else {
        // Sample is normal or low
        this.consecutiveHighSamplesByCategory.set(cat, 0);
        const nextNormalCount = currentNormalCount + 1;
        this.consecutiveNormalSamplesByCategory.set(cat, nextNormalCount);

        // 3 consecutive normal samples resolve the active episode
        if (nextNormalCount >= 3 && activeEpisode) {
          activeEpisode.resolvedAt = Date.now();
          this.activeEpisodeByCategory.delete(cat);
          updatedAlerts = updatedAlerts.map(a => a.episodeId === activeEpisode.episodeId ? { ...activeEpisode } : a);
        }
      }
    }

    return updatedAlerts;
  }

  public acknowledgeAlert(alertId: string, currentAlerts: Alert[]): Alert[] {
    return currentAlerts.map(a => {
      if (a.id === alertId) {
        const updated = { ...a, acknowledgedAt: Date.now() };
        if (this.activeEpisodeByCategory.has(a.category)) {
          this.activeEpisodeByCategory.set(a.category, updated);
        }
        return updated;
      }
      return a;
    });
  }

  public clearAllEpisodes(): void {
    this.activeEpisodeByCategory.clear();
    this.consecutiveHighSamplesByCategory.clear();
    this.consecutiveNormalSamplesByCategory.clear();
  }

  private severityRank(s: RiskSeverity): number {
    switch (s) {
      case 'low': return 1;
      case 'moderate': return 2;
      case 'high': return 3;
      case 'critical': return 4;
    }
  }

  private getTitleForCategory(cat: string, sev: RiskSeverity): string {
    const sevLabel = sev === 'critical' ? 'Critical' : 'High';
    switch (cat) {
      case 'heat': return `${sevLabel} Heat Stress Early Warning`;
      case 'respiratory': return `${sevLabel} Respiratory Strain Alert`;
      case 'fatigue': return `${sevLabel} Physical Fatigue Alert`;
      case 'cardiovascular': return `${sevLabel} Cardiovascular Anomaly Detected`;
      default: return `${sevLabel} Health Warning`;
    }
  }

  private getActionForCategory(cat: string): string {
    switch (cat) {
      case 'heat': return 'Move to a cooler area, pause physical exertion, and hydrate with water.';
      case 'respiratory': return 'Move indoors away from vehicular pollution and avoid strenuous outdoor exercise.';
      case 'fatigue': return 'Sit down in a safe location, rest, and allow your resting heart rate to stabilize.';
      case 'cardiovascular': return 'Remain resting seated and verify pulse reading.';
      default: return 'Rest and check in with your caregiver if symptoms persist.';
    }
  }
}
