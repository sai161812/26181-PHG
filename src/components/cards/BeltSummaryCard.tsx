import React from 'react';
import { BeltStatus } from '../../types/domain';
import { BeltSchematic } from '../schematics/BeltSchematic';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { BatteryCharging, ArrowRight, Shield } from 'lucide-react';

export interface BeltSummaryCardProps {
  beltStatus: BeltStatus;
  onOpenDevices: () => void;
}

export const BeltSummaryCard: React.FC<BeltSummaryCardProps> = ({
  beltStatus,
  onOpenDevices
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div>
        {/* Top Title & Battery Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 650, color: 'var(--text)', margin: 0 }}>
              Integrated Health Belt
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Hardware Category • ESP32 + MPU6050
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <BatteryCharging size={15} color="var(--teal-700)" />
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{beltStatus.batteryPct}%</span>
            </div>
            <StatusBadge tone="low" label="Connected" pulse />
          </div>
        </div>

        {/* Vector Belt Schematic */}
        <div style={{ margin: '8px 0 14px', padding: '8px', backgroundColor: 'var(--canvas)', borderRadius: 'var(--radius-md)' }}>
          <BeltSchematic protectionState={beltStatus.protectionState} />
        </div>

        {/* Status Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Motion status:</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{beltStatus.motionStatus}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>MPU6050 channel:</span>
            <span style={{ color: 'var(--teal-700)', fontWeight: 500 }}>Active telemetry</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Airbag readiness:</span>
            <span style={{ color: 'var(--risk-low)', fontWeight: 600 }}>Armed • Solenoid ready</span>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          <Shield size={14} />
          <span>Protection module standby</span>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenDevices} icon={<ArrowRight size={14} />}>
          Open device status
        </Button>
      </div>
    </div>
  );
};
