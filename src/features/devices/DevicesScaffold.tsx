import React from 'react';
import { DestinationScaffold } from '../../components/common/DestinationScaffold';
import { Radio } from 'lucide-react';

export const DevicesScaffold: React.FC = () => {
  return (
    <DestinationScaffold
      title="Integrated Health Belt & Hardware Telemetry"
      subtitle="Waist-worn belt schematic, 10 component statuses, connection controls, and protection timeline"
      phaseTarget="Phase 5"
      plannedTabs={['Belt schematic & telemetry', 'Protection event timeline', 'Pairing & connectivity']}
      plannedFeatures={[
        'SVG waist-belt illustration with sensor nodes, ESP32 controller, and dual airbag pods',
        'Component telemetry: MPU6050, HR/SpO2/Temp, ESP32, buzzer, GPS, battery, relay, solenoid, CO2, airbag',
        'Connect demo belt flow with simulated pairing feedback, disconnect, and reconnect',
        'Simulated protection timeline: Motion event → Fall classified → Solenoid activated → Airbag deployed',
        'Inspection/reset required state: only explicit demo reset restores ready status'
      ]}
      icon={<Radio size={24} />}
    />
  );
};
