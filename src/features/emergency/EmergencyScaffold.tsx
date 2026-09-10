import React from 'react';
import { DestinationScaffold } from '../../components/common/DestinationScaffold';
import { AlertTriangle } from 'lucide-react';

export const EmergencyScaffold: React.FC = () => {
  return (
    <DestinationScaffold
      title="Emergency Assistance & SOS Preparation"
      subtitle="Restrained emergency triggers, human check-in countdown, and consent-filtered payload"
      phaseTarget="Phase 5"
      plannedTabs={['Emergency assistance', 'Caregiver contact', 'Prepared payload history']}
      plannedFeatures={[
        'Possible Fall "Are you okay?" check-in with 20-second demo escalation timer',
        'Large accessible SOS button with confirmation modal ("Send SOS - demo")',
        'Consent-filtered local SOS payload preparation with contact, timestamp, location, and vitals',
        'Explicit status: SOS notification prepared — demonstration only; nothing sent',
        'Payload inspection viewer verifying excluded fields are truthfully omitted'
      ]}
      icon={<AlertTriangle size={24} />}
    />
  );
};
