import { DeviceStatus } from '../types';

export class DeviceManager {
  public static createDefaultDeviceStatus(): DeviceStatus {
    return {
      id: 'belt-dev-01',
      name: 'Integrated Health Belt — Demo Sensor',
      source: 'DemoSensorAdapter',
      connection: 'connected',
      batteryPct: 84,
      lastSeenAt: Date.now(),
      motionStatus: 'Upright / Resting',
      protectionState: 'ready',
      components: [
        { id: 'mpu', name: 'Motion / MPU6050', status: 'active', details: 'Normal posture, ±0.02g variance' },
        { id: 'vitals', name: 'HR / SpO₂ / Temp sensors', status: 'ready', details: 'Optoelectronic feed streaming' },
        { id: 'controller', name: 'ESP32 controller', status: 'ready', details: 'Edge loop synchronized (2s)' },
        { id: 'buzzer_bat', name: 'Buzzer & Battery', status: 'ready', details: '84% remaining, buzzer standby' },
        { id: 'protection', name: 'Relay, Solenoid, CO₂, Airbag', status: 'ready', details: 'Solenoid armed, cylinder pressurized' }
      ],
      timeline: []
    };
  }

  public static triggerFallProtectionSequence(status: DeviceStatus): DeviceStatus {
    const now = Date.now();
    return {
      ...status,
      motionStatus: 'Impact / Inactive',
      protectionState: 'deployed',
      components: status.components.map(c => 
        c.id === 'protection' 
          ? { ...c, status: 'warning', details: 'Deployed — CO₂ released, airbag inflated' }
          : c
      ),
      timeline: [
        { timestamp: now, title: 'Impact Acceleration Spike', details: 'MPU6050 recorded >3.2g vertical acceleration vector', stage: 'motion' },
        { timestamp: now + 80, title: 'Fall Pattern Classified', details: 'ESP32 edge classification confirmed unrecovered descent', stage: 'fall_detected' },
        { timestamp: now + 120, title: 'Relay & Solenoid Actuated', details: '5V relay energized; solenoid valve opened for gas release', stage: 'solenoid_relay' },
        { timestamp: now + 200, title: 'Airbag Deployed (Simulation)', details: 'CO₂ cartridge discharged; hip cushions inflated', stage: 'airbag_deployed' },
        { timestamp: now + 300, title: 'Inspection Required', details: 'Manual hardware inspection and cartridge replacement required', stage: 'inspection' }
      ]
    };
  }

  public static resetProtectionSequence(status: DeviceStatus): DeviceStatus {
    return {
      ...status,
      motionStatus: 'Upright / Resting',
      protectionState: 'ready',
      components: status.components.map(c => 
        c.id === 'protection' 
          ? { ...c, status: 'ready', details: 'Solenoid armed, cylinder pressurized' }
          : c
      ),
      timeline: []
    };
  }
}
