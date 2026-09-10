import { SOSRecord, SharingChoices, UserProfile, RiskAssessment, SensorReading, EnvironmentSnapshot } from '../types';

export class EmergencyManager {
  public static isContactValid(contact: { name: string; phone: string }): boolean {
    if (!contact.name || contact.name.trim().length === 0) return false;
    if (!contact.phone || contact.phone.trim().length < 5) return false;
    // Build guide line 275: "The seeded contact can support demo payload preparation; a user-entered contact must pass form validation."
    if (contact.phone.includes('XXX') || contact.phone.includes('Demo')) return true;
    const digits = contact.phone.replace(/\D/g, '');
    return digits.length >= 7;
  }

  public static prepareSOSPayload(
    profile: UserProfile,
    sharingChoices: SharingChoices,
    reading: SensorReading,
    environment: EnvironmentSnapshot,
    assessment: RiskAssessment,
    incidentId = `inc-${Date.now()}`,
    triggerType: 'manual' | 'fall_checkin_escalation' | 'fall_checkin_timeout' = 'manual'
  ): SOSRecord {
    const isLocationPermitted = sharingChoices.shareLocation;

    return {
      id: `sos-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      incidentId,
      preparedAt: Date.now(),
      contact: {
        name: profile.emergencyContact.name,
        phone: profile.emergencyContact.phone
      },
      // Consent-filtered location with clear provenance
      location: isLocationPermitted 
        ? `${environment.locationLabel} (Demo GPS: 13.0827° N, 80.2707° E)` 
        : null,
      locationProvenance: isLocationPermitted ? 'Demo location' : 'Not shared',
      // Consent-filtered vitals
      vitalsSnapshot: sharingChoices.shareVitals ? {
        hr: reading.hr,
        spo2: reading.spo2,
        bodyTemp: reading.bodyTemperatureC
      } : null,
      // Consent-filtered risk
      riskScore: sharingChoices.shareRiskAssessment ? assessment.overallScore : null,
      severity: sharingChoices.shareRiskAssessment ? assessment.severity : null,
      status: 'prepared_demonstration_only',
      triggerType
    };
  }
}
