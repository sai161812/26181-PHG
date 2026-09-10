import React from 'react';
import { DestinationScaffold } from '../../components/common/DestinationScaffold';
import { Settings } from 'lucide-react';

export const ProfileScaffold: React.FC = () => {
  return (
    <DestinationScaffold
      title="User Profile & Companion Settings"
      subtitle="Demographic configuration, resting HR provenance, and emergency contact details"
      phaseTarget="Phase 6"
      plannedTabs={['Personal profile', 'Emergency contact', 'Accessibility & display']}
      plannedFeatures={[
        'Profile editing for Ravi, 62 with explicit Save/Cancel validation',
        'Manual resting HR input provenance (user-provided takes precedence until recalculation)',
        'Emergency caregiver contact validation and phone number masking (+91 98XXX XXXXX)',
        'Initial 4-step onboarding wizard replay option and accessibility preferences',
        'Demo defaults restoration shortcut without losing persistent consents'
      ]}
      icon={<Settings size={24} />}
    />
  );
};
