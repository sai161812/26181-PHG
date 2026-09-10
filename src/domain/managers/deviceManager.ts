import { DeviceStatus } from '../types';

export class DeviceManager {
  public static createDefaultDeviceStatus(): DeviceStatus {
    return {
      id: 'belt-dev-01',
      name: 'Integrated Health Belt — Demo Sensor',
      source: 'DemoSensorAdapter (ESP32-sim)',
      connection: 'connected',
      batteryPct: 84,
      lastSeenAt: Date.now(),
      motionStatus: 'Upright / Resting',
      protectionState: 'ready',
      components: [
        { id: 'motion', name: 'Motion / MPU6050', status: 'active', details: '6-axis IMU nominal, ±0.02g baseline variance' },
        { id: 'hr', name: 'Heart Rate Channel', status: 'ready', details: 'Optoelectronic sensor streaming (model TBD in future HW)' },
        { id: 'spo2', name: 'SpO₂ Saturation Channel', status: 'ready', details: 'Red/Infrared pulse oximetry channel (model TBD)' },
        { id: 'temp', name: 'Body Temperature Channel', status: 'ready', details: 'Infrared contact thermopile (model TBD)' },
        { id: 'esp32', name: 'ESP32 Controller', status: 'ready', details: 'Dual-core 240MHz, edge inference loop active (2s)' },
        { id: 'buzzer', name: 'Piezo Acoustic Buzzer', status: 'standby', details: 'Audible feedback transducer on standby' },
        { id: 'gps', name: 'GPS Module', status: 'ready', details: 'Simulated demo coordinates (Chennai Adyar corridor)' },
        { id: 'battery', name: 'LiPo Battery System', status: 'ready', details: '84% remaining (3.7V 1200mAh nominal)' },
        { id: 'relay', name: '5V Protection Relay', status: 'ready', details: 'Optocoupled circuit armed, standby mode' },
        { id: 'solenoid', name: '12V Solenoid Valve', status: 'ready', details: 'Spring-return high-pressure release valve closed' },
        { id: 'cartridge', name: 'CO₂ Gas Cartridge', status: 'ready', details: '16g threaded cylinder sealed and pressurized' },
        { id: 'airbag', name: 'Inflatable Airbag Cushions', status: 'ready', details: 'Bilateral hip cushions folded in ready position' }
      ],
      timeline: []
    };
  }

  public static triggerFallProtectionSequence(status: DeviceStatus): DeviceStatus {
    const now = Date.now();
    return {
      ...status,
      motionStatus: 'Impact Acceleration Spike / Inactive',
      protectionState: 'deployed',
      components: status.components.map(c => {
        if (c.id === 'motion') return { ...c, status: 'warning', details: 'Impact vector spike >3.2g registered' };
        if (c.id === 'relay') return { ...c, status: 'warning', details: 'Relay energized (5V circuit closed)' };
        if (c.id === 'solenoid') return { ...c, status: 'warning', details: 'Valve actuated — gas manifold opened' };
        if (c.id === 'cartridge') return { ...c, status: 'warning', details: '16g CO₂ cylinder pierced & discharged' };
        if (c.id === 'airbag') return { ...c, status: 'warning', details: 'Deployed (Simulation) — hip cushions inflated' };
        if (c.id === 'buzzer') return { ...c, status: 'active', details: 'Audible emergency alert tone pulsing' };
        return c;
      }),
      timeline: [
        { timestamp: now, title: 'MPU6050 Motion Event Received', details: 'Abrupt vertical impact acceleration spike (>3.2g) registered.', stage: 'motion' },
        { timestamp: now + 65, title: 'ESP32 Fall Classification', details: 'Edge heuristic algorithm confirmed unrecovered rapid descent pattern.', stage: 'fall_detected' },
        { timestamp: now + 110, title: '5V Relay & Solenoid Triggered', details: 'Protection relay energized; 12V solenoid valve opened for high-speed gas discharge.', stage: 'solenoid_relay' },
        { timestamp: now + 180, title: 'Airbag Deployed (Simulation)', details: '16g CO₂ gas cylinder discharged into dual lateral hip cushions (~200ms simulated latency).', stage: 'airbag_deployed' },
        { timestamp: now + 250, title: 'Inspection & Reset Required', details: 'Hardware in post-deployment demonstration state. Cartridge inspection required.', stage: 'inspection' }
      ]
    };
  }

  public static resetProtectionSequence(status: DeviceStatus): DeviceStatus {
    return {
      ...status,
      motionStatus: 'Upright / Resting',
      protectionState: 'ready',
      components: status.components.map(c => {
        if (['motion', 'relay', 'solenoid', 'cartridge', 'airbag', 'buzzer'].includes(c.id)) {
          return {
            ...c,
            status: c.id === 'motion' ? 'active' : (c.id === 'buzzer' ? 'standby' : 'ready'),
            details: c.id === 'motion' 
              ? '6-axis IMU nominal, ±0.02g baseline variance'
              : (c.id === 'cartridge' ? 'New 16g cylinder simulated & pressurized' : 'Ready / armed')
          };
        }
        return c;
      }),
      timeline: []
    };
  }

  public static setConnectionStatus(status: DeviceStatus, connection: 'connected' | 'disconnected' | 'paused'): DeviceStatus {
    const isConn = connection === 'connected';
    return {
      ...status,
      connection,
      lastSeenAt: Date.now(),
      motionStatus: isConn ? 'Upright / Resting' : (connection === 'paused' ? 'Telemetry Paused' : 'Disconnected / Offline'),
      components: status.components.map(c => ({
        ...c,
        status: isConn ? (c.id === 'buzzer' ? 'standby' : (c.id === 'motion' ? 'active' : 'ready')) : 'standby',
        details: isConn ? c.details : 'Link severed — waiting for BLE/serial reconnection'
      }))
    };
  }
}
