import React, { useState } from 'react';
import { useCompanionStore } from '../../store/companionStore';
import { BeltSchematic } from './BeltSchematic';
import { StatusBadge, BadgeTone } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Dialog } from '../../components/common/Dialog';
import { 
  Radio, 
  BatteryCharging, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw, 
  Wifi, 
  WifiOff, 
  Cpu, 
  Activity, 
  Navigation, 
  Volume2, 
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const deviceStatus = useCompanionStore(s => s.deviceStatus);
  const connectDemoBelt = useCompanionStore(s => s.connectDemoBelt);
  const disconnectDemoBelt = useCompanionStore(s => s.disconnectDemoBelt);
  const resetProtectionSequence = useCompanionStore(s => s.resetProtectionSequence);
  const isPairingInProgress = useCompanionStore(s => s.isPairingInProgress);

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const isConnected = deviceStatus.connection === 'connected';
  const isDeployed = deviceStatus.protectionState === 'deployed';

  const handleOpenConnect = () => {
    setIsConnectModalOpen(true);
  };

  const handleConfirmConnect = async () => {
    await connectDemoBelt();
    setIsConnectModalOpen(false);
  };

  const handleDisconnect = async () => {
    await disconnectDemoBelt();
  };

  const getComponentIcon = (id: string) => {
    switch (id) {
      case 'motion': return <Activity className="w-4 h-4 text-[#0E6B62]" />;
      case 'hr': return <Activity className="w-4 h-4 text-[#EA580C]" />;
      case 'spo2': return <Activity className="w-4 h-4 text-[#0284C7]" />;
      case 'temp': return <Flame className="w-4 h-4 text-[#D97706]" />;
      case 'esp32': return <Cpu className="w-4 h-4 text-[#475569]" />;
      case 'buzzer': return <Volume2 className="w-4 h-4 text-[#64748B]" />;
      case 'gps': return <Navigation className="w-4 h-4 text-[#0E6B62]" />;
      case 'battery': return <BatteryCharging className="w-4 h-4 text-[#16A34A]" />;
      case 'relay': return <Layers className="w-4 h-4 text-[#D97706]" />;
      case 'solenoid': return <Layers className="w-4 h-4 text-[#DC2626]" />;
      case 'cartridge': return <ShieldCheck className="w-4 h-4 text-[#64748B]" />;
      case 'airbag': return <ShieldCheck className="w-4 h-4 text-[#0E6B62]" />;
      default: return <Radio className="w-4 h-4 text-[#64748B]" />;
    }
  };

  const getBadgeToneForStatus = (status: string): BadgeTone => {
    switch (status) {
      case 'active': return 'teal';
      case 'ready': return 'low';
      case 'warning': return 'critical';
      case 'standby': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }}>
      {/* Page Title & Status Header */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border)',
          padding: '24px',
          boxShadow: 'var(--shadow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--teal-50)',
              border: '1px solid var(--teal-300)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--teal-700)',
              flexShrink: 0
            }}
          >
            <Radio size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--teal-700)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Hardware Identity & Device Telemetry
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-tertiary)', backgroundColor: 'var(--surface-muted)', padding: '2px 6px', borderRadius: '4px' }}>
                SIH26181
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: '4px 0 0' }}>
              Integrated Health Belt — Demo Sensor
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Waist-worn active belt with bilateral hip airbags, MPU6050 motion classification, and ESP32 edge telemetry.
            </p>
          </div>
        </div>

        {/* Quick Header Status & Action Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          {/* Connection badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'var(--canvas)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text)'
            }}
          >
            {isConnected ? (
              <>
                <Wifi size={14} color="var(--risk-low)" />
                <span>BLE Connected</span>
              </>
            ) : (
              <>
                <WifiOff size={14} color="var(--risk-critical)" />
                <span>Belt Disconnected</span>
              </>
            )}
          </div>

          {/* Battery status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'var(--canvas)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text)'
            }}
          >
            <BatteryCharging size={14} color="var(--risk-low)" />
            <span className="tabular-nums">{deviceStatus.batteryPct}% LiPo</span>
          </div>

          {/* Protection status badge */}
          {isDeployed ? (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: 'var(--risk-critical-bg)',
                border: '1px solid var(--risk-critical)',
                color: 'var(--risk-critical)',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)'
              }}
            >
              <AlertTriangle size={14} />
              Airbag Deployed
            </span>
          ) : (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: 'var(--teal-50)',
                border: '1px solid var(--teal-300)',
                color: 'var(--teal-700)',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)'
              }}
            >
              <ShieldCheck size={14} />
              Armed & Ready
            </span>
          )}

          {/* Actions: Connect / Disconnect / Reset Airbag */}
          {isDeployed && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetProtectionSequence}
              style={{
                borderColor: 'var(--risk-critical)',
                color: 'var(--risk-critical)',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={14} />
              Reset Airbag Simulation
            </Button>
          )}

          {isConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              style={{
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <WifiOff size={14} />
              Disconnect Belt
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenConnect}
              style={{
                backgroundColor: 'var(--teal-700)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Wifi size={14} />
              Connect Demo Belt
            </Button>
          )}
        </div>
      </div>

      {/* SVG Belt Blueprint Schematic */}
      <BeltSchematic
        deviceStatus={deviceStatus}
        selectedComponentId={selectedComponentId}
        onSelectComponent={(id) => setSelectedComponentId(id === selectedComponentId ? null : id)}
      />

      {/* Protection Telemetry Timeline (when deployed or post-fall) */}
      {deviceStatus.timeline.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-card)',
            padding: '24px',
            border: '1px solid var(--risk-critical)',
            boxShadow: 'var(--shadow)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--risk-critical-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--risk-critical)'
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                  Simulated Protection Telemetry Timeline
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  Chronological event log of hardware protection sequence (~200ms latency simulation).
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetProtectionSequence}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--risk-critical)',
                borderColor: 'var(--risk-critical)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={14} />
              Reset Demonstration State
            </Button>
          </div>

          <div style={{ position: 'relative', borderLeft: '2px solid var(--risk-critical)', marginLeft: '16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '16px', margin: '12px 0' }}>
            {deviceStatus.timeline.map((step, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-31px',
                    top: '4px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--risk-critical)',
                    border: '2px solid var(--surface)'
                  }}
                />
                <div
                  style={{
                    backgroundColor: '#FFF7ED',
                    border: '1px solid #FFEDD5',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontWeight: 700, color: '#9A3412' }}>
                      Stage {idx + 1}: {step.title}
                    </span>
                    <span className="tabular-nums" style={{ fontFamily: 'monospace', color: '#C2410C' }}>
                      +{idx * 60}ms offset
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#7C2D12', margin: '4px 0 0' }}>
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #FEE2E2', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--risk-critical)' }}>
            <span>Status: Inspection / Reset Required — Demonstration State.</span>
            <span>Only an explicit simulation reset restores ready illustration.</span>
          </div>
        </div>
      )}

      {/* 12-Component Telemetry Matrix */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border)',
          padding: '24px',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--teal-700)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Component Registry
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', margin: '4px 0 0' }}>
              Integrated Component Telemetry (12 Channels)
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Synchronized at 2.0s loop rate
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px'
          }}
        >
          {deviceStatus.components.map((comp) => {
            const isSelected = selectedComponentId === comp.id;
            return (
              <div
                key={comp.id}
                onClick={() => setSelectedComponentId(isSelected ? null : comp.id)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '1px solid var(--teal-700)' : '1px solid var(--border)',
                  backgroundColor: isSelected ? 'var(--teal-50)' : 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--surface-muted)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getComponentIcon(comp.id)}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                      {comp.name}
                    </span>
                  </div>
                  <StatusBadge 
                    label={comp.status === 'warning' ? 'Alert' : (comp.status === 'active' ? 'Active' : (comp.status === 'ready' ? 'Ready' : 'Standby'))}
                    tone={getBadgeToneForStatus(comp.status)}
                    size="sm"
                  />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0, paddingLeft: '32px' }}>
                  {comp.details}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Future Qualcomm Snapdragon NPU & Hardware Architecture Callout */}
      <div
        style={{
          background: 'linear-gradient(90deg, #F0FDF4 0%, var(--canvas) 50%, #F0FDF4 100%)',
          border: '1px solid #BBF7D0',
          borderRadius: 'var(--radius-card)',
          padding: '24px',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
              flexShrink: 0
            }}
          >
            <Sparkles size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Future Integration Boundary
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                Qualcomm Snapdragon NPU
              </span>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              On-Device Inference & Wearable Ecosystem Roadmap
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              In production, lightweight quantized edge models will execute on the <strong>Qualcomm Snapdragon Neural Processing Unit (NPU)</strong> via Qualcomm AI Hub ONNX runtime for sub-50ms fall detection. The belt communicates over low-energy <strong>Bluetooth Low Energy (BLE 5.2 GATT)</strong> with the companion application, supporting sensor fusion with commercial smartwatches and medical ECG patches.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingTop: '4px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              <span>• ESP32 240MHz telemetry bus</span>
              <span>• Dual-core FreeRTOS event dispatcher</span>
              <span>• Zero cloud dependency for fall protection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Demo Belt Modal */}
      <Dialog
        isOpen={isConnectModalOpen}
        onClose={() => !isPairingInProgress && setIsConnectModalOpen(false)}
        title="Connect Integrated Health Belt"
        maxWidth="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--surface-muted)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>Device Identifier:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--teal-700)', fontWeight: 700 }}>ESP32-BELT-26181</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span>Interface Protocol:</span>
              <span>Bluetooth Low Energy 5.2 (Simulated)</span>
            </div>
          </div>

          {isPairingInProgress ? (
            <div style={{ padding: '24px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid var(--teal-700)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                Pairing with ESP32-BELT-26181...
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Establishing simulated BLE telemetry subscription and sensor stream.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                Connect to the simulated Integrated Health Belt to stream live heart rate, SpO₂, body temperature, motion vectors, and battery telemetry.
              </p>

              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  color: '#92400E'
                }}
              >
                <span style={{ fontWeight: 700 }}>Hardware Note:</span> This connects to the internal software-defined sensor adapter. Physical Bluetooth pairing with live hardware is scheduled for Phase 9 hardware trials.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px' }}>
                <Button
                  variant="outline"
                  onClick={() => setIsConnectModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmConnect}
                  style={{
                    backgroundColor: 'var(--teal-700)',
                    color: '#FFFFFF'
                  }}
                >
                  Connect Demo Belt
                </Button>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};
