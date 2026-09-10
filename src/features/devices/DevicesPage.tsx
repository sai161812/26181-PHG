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
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Title & Status Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E6F4F1] border border-[#A7D7CF] flex items-center justify-center text-[#0E6B62] shrink-0">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#0E6B62] uppercase tracking-wider">
                  Hardware Identity & Device Telemetry
                </span>
                <span className="text-[11px] font-mono text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                  SIH26181
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#111827]">
                Integrated Health Belt — Demo Sensor
              </h1>
              <p className="text-sm text-[#4B5563] mt-0.5">
                Waist-worn active belt with bilateral hip airbags, MPU6050 motion classification, and ESP32 edge telemetry.
              </p>
            </div>
          </div>

          {/* Quick Header Status & Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Connection badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#334155]">
              {isConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>BLE Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Belt Disconnected</span>
                </>
              )}
            </div>

            {/* Battery status */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#334155]">
              <BatteryCharging className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>{deviceStatus.batteryPct}% LiPo</span>
            </div>

            {/* Protection status badge */}
            {isDeployed ? (
              <span className="px-3 py-1.5 bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] font-semibold text-xs rounded-xl flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Airbag Deployed
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-[#E6F4F1] border border-[#A7D7CF] text-[#0E6B62] font-semibold text-xs rounded-xl flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Armed & Ready
              </span>
            )}

            {/* Actions: Connect / Disconnect / Reset Airbag */}
            {isDeployed && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetProtectionSequence}
                className="border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset Airbag Simulation
              </Button>
            )}

            {isConnected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="text-xs font-medium text-[#475569] hover:text-[#DC2626] hover:border-[#DC2626]"
              >
                <WifiOff className="w-3.5 h-3.5 mr-1.5" />
                Disconnect Belt
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenConnect}
                className="bg-[#0E6B62] hover:bg-[#094842] text-white text-xs font-semibold"
              >
                <Wifi className="w-3.5 h-3.5 mr-1.5" />
                Connect Demo Belt
              </Button>
            )}
          </div>
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
        <div className="bg-white rounded-2xl p-6 border border-[#FCA5A5] shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  Simulated Protection Telemetry Timeline
                </h3>
                <p className="text-xs text-[#64748B]">
                  Chronological event log of hardware protection sequence (~200ms latency simulation).
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetProtectionSequence}
              className="text-xs font-semibold text-[#DC2626] border-[#FCA5A5] hover:bg-[#FEF2F2]"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Demonstration State
            </Button>
          </div>

          <div className="relative border-l-2 border-[#FCA5A5] ml-4 pl-6 space-y-4 my-3">
            {deviceStatus.timeline.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#DC2626] border-2 border-white" />
                <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#9A3412]">
                      Stage {idx + 1}: {step.title}
                    </span>
                    <span className="font-mono text-[#C2410C]">
                      +{idx * 60}ms offset
                    </span>
                  </div>
                  <p className="text-xs text-[#7C2D12] mt-1">
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#FEE2E2] flex items-center justify-between text-[11px] text-[#991B1B]">
            <span>Status: Inspection / Reset Required — Demonstration State.</span>
            <span>Only an explicit simulation reset restores ready illustration.</span>
          </div>
        </div>
      )}

      {/* 12-Component Telemetry Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-[#0E6B62] uppercase tracking-wider">
              Component Registry
            </span>
            <h3 className="text-base font-bold text-[#111827]">
              Integrated Component Telemetry (12 Channels)
            </h3>
          </div>
          <span className="text-xs text-[#64748B]">
            Synchronized at 2.0s loop rate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {deviceStatus.components.map((comp) => {
            const isSelected = selectedComponentId === comp.id;
            return (
              <div
                key={comp.id}
                onClick={() => setSelectedComponentId(isSelected ? null : comp.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-[#0E6B62] bg-[#E6F4F1]/30 shadow-sm' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                      {getComponentIcon(comp.id)}
                    </div>
                    <span className="text-xs font-bold text-[#111827]">
                      {comp.name}
                    </span>
                  </div>
                  <StatusBadge 
                    label={comp.status === 'warning' ? 'Alert' : (comp.status === 'active' ? 'Active' : (comp.status === 'ready' ? 'Ready' : 'Standby'))}
                    tone={getBadgeToneForStatus(comp.status)}
                    size="sm"
                  />
                </div>
                <p className="text-xs text-[#475569] leading-relaxed mt-2 pl-8">
                  {comp.details}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Future Qualcomm Snapdragon NPU & Hardware Architecture Callout */}
      <div className="bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
                Future Integration Boundary
              </span>
              <span className="text-[11px] font-mono text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                Qualcomm Snapdragon NPU
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#111827]">
              On-Device Inference & Wearable Ecosystem Roadmap
            </h4>
            <p className="text-xs text-[#475569] leading-relaxed">
              In production, lightweight quantized edge models will execute on the <strong>Qualcomm Snapdragon Neural Processing Unit (NPU)</strong> via Qualcomm AI Hub ONNX runtime for sub-50ms fall detection. The belt communicates over low-energy <strong>Bluetooth Low Energy (BLE 5.2 GATT)</strong> with the companion application, supporting sensor fusion with commercial smartwatches and medical ECG patches.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-[#64748B]">
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
        <div className="space-y-4">
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#334155]">Device Identifier:</span>
              <span className="font-mono text-xs text-[#0E6B62] font-semibold">ESP32-BELT-26181</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span>Interface Protocol:</span>
              <span>Bluetooth Low Energy 5.2 (Simulated)</span>
            </div>
          </div>

          {isPairingInProgress ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-10 h-10 mx-auto border-3 border-[#0E6B62] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-[#111827]">
                Pairing with ESP32-BELT-26181...
              </p>
              <p className="text-xs text-[#64748B]">
                Establishing simulated BLE telemetry subscription and sensor stream.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Connect to the simulated Integrated Health Belt to stream live heart rate, SpO₂, body temperature, motion vectors, and battery telemetry.
              </p>

              <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-xs text-[#92400E]">
                <span className="font-bold">Hardware Note:</span> This connects to the internal software-defined sensor adapter. Physical Bluetooth pairing with live hardware is scheduled for Phase 9 hardware trials.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsConnectModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmConnect}
                  className="bg-[#0E6B62] text-white hover:bg-[#094842]"
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
