import { SOSRecord, SharingChoices, UserProfile, RiskAssessment, SensorReading, EnvironmentSnapshot } from '../types';

export class EmergencyManager {
  public static prepareSOSPayload(
    profile: UserProfile,
    sharingChoices: SharingChoices,
    reading: SensorReading,
    environment: EnvironmentSnapshot,
    assessment: RiskAssessment,
    incidentId = `inc-${Date.now()}`
  ): SOSRecord {
    return {
      id: `sos-${Date.now()}`,
      incidentId,
      preparedAt: Date.now(),
      contact: {
        name: profile.emergencyContact.name,
        phone: profile.emergencyContact.phone
      },
      // Consent-filtered location
      location: sharingChoices.shareLocation ? environment.locationLabel : null,
      // Consent-filtered vitals
      vitalsSnapshot: sharingChoices.shareVitals ? {
        hr: reading.hr,
        spo2: reading.spo2,
        bodyTemp: reading.bodyTemperatureC
      } : null,
      // Consent-filtered risk
      riskScore: sharingChoices.shareRiskAssessment ? assessment.overallScore : null,
      severity: sharingChoices.shareRiskAssessment ? assessment.severity : null,
      status: 'prepared_demonstration_only'
    };
  }
}
