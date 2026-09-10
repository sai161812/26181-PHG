import React from 'react';
import { DestinationScaffold } from '../../components/common/DestinationScaffold';
import { ShieldCheck } from 'lucide-react';

export const PrivacyScaffold: React.FC = () => {
  return (
    <DestinationScaffold
      title="Privacy Center & Local Workstation Controls"
      subtitle="Local workstation execution guarantee, selective sharing toggles, and confirmed data deletion"
      phaseTarget="Phase 6"
      plannedTabs={['Local processing', 'Emergency sharing choices', 'Data management']}
      plannedFeatures={[
        'Health processing: 100% on this laptop — local demo engine; cloud upload permanently disabled',
        'Granular emergency sharing toggles (location, vitals, risk level) enforced in SOS payloads',
        'Confirmed data deletion flow: halts timers and returns to onboarding without auto-reseeding',
        'Truthful transparency: demo storage is not encrypted medical record storage',
        'Clear distinction between in-app offline toggle, browser connectivity hint, and PWA cache'
      ]}
      icon={<ShieldCheck size={24} />}
    />
  );
};
