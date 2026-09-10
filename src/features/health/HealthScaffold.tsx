import React from 'react';
import { DestinationScaffold } from '../../components/common/DestinationScaffold';
import { HeartPulse } from 'lucide-react';

export const HealthScaffold: React.FC = () => {
  return (
    <DestinationScaffold
      title="Health Monitoring Workspace"
      subtitle="Continuous vital stream observation, personalized baseline bounds, and multi-scale longitudinal trend charts"
      phaseTarget="Phase 3"
      plannedTabs={['Live monitoring', 'Personal baseline', 'Trends']}
      plannedFeatures={[
        '6-minute live window with selectable metric, signal quality, and stale/disconnected indicators',
        'Personal baseline comparison showing HR % deviation and SpO₂ percentage-point differences',
        'Six analytical trend charts: HR, SpO₂, body temp, activity, sleep, and prototype risk',
        'Segmented time controls: Today, 7 Days, 30 Days based on deterministic illustrative history',
        'Manual resting HR override preservation and explicit recalculation workflow'
      ]}
      icon={<HeartPulse size={24} />}
    />
  );
};
