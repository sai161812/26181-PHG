import React from 'react';
import { DestinationScaffold } from '../../components/common/DestinationScaffold';
import { Bell } from 'lucide-react';

export const AlertsScaffold: React.FC = () => {
  return (
    <DestinationScaffold
      title="Alerts & Event Lifecycle Management"
      subtitle="Deduplicated active alerts, historical episodes, and frozen input snapshots"
      phaseTarget="Phase 4"
      plannedTabs={['All events', 'Active episodes (0)', 'Acknowledged (3)', 'Resolved']}
      plannedFeatures={[
        'Two consecutive qualifying samples triggering; three normal samples resolution',
        'Single episode per category to prevent tick-by-tick duplication',
        'Right detail drawer with frozen vitals snapshot and recommended user actions',
        'Offline-capable acknowledgement without mutating underlying physiological risk',
        'Demonstration recovery entries when switching scenarios'
      ]}
      icon={<Bell size={24} />}
    />
  );
};
