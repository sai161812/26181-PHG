import React from 'react';
import { DestinationScaffold } from '../../components/common/DestinationScaffold';
import { CloudSun } from 'lucide-react';

export const EnvironmentScaffold: React.FC = () => {
  return (
    <DestinationScaffold
      title="Environmental Safety & Disaster Advisories"
      subtitle="2×2 hazard matrix covering Heat, Air Quality, Flood, and Cyclone context with non-clinical precautions"
      phaseTarget="Phase 4"
      plannedTabs={['Hazard matrix', 'Disaster advisories', 'Exposure history']}
      plannedFeatures={[
        'Heat, AQI, Flood, and Cyclone hazard tiles with source timestamps and data freshness',
        'Curated non-diagnostic preparedness advice based on CDC and official safety guidelines',
        'Clean separation: flood and cyclone warnings do not fabricate vital anomalies',
        'Cached snapshot management, synthetic offline context indicators, and expiry labels',
        'AQI numeric scale transparently linked to respiratory factor contribution'
      ]}
      icon={<CloudSun size={24} />}
    />
  );
};
