import React from 'react';
import { DeviceStatus } from '../../domain/types';

interface BeltSchematicProps {
  deviceStatus: DeviceStatus;
  onSelectComponent?: (componentId: string) => void;
  selectedComponentId?: string | null;
}

export const BeltSchematic: React.FC<BeltSchematicProps> = ({
  deviceStatus,
  onSelectComponent,
  selectedComponentId
}) => {
  const isDeployed = deviceStatus.protectionState === 'deployed';
  const isDisconnected = deviceStatus.connection === 'disconnected';

  // Primary palette tokens
  const strapColor = isDisconnected ? '#94A3B8' : '#1E293B';
  const deployedRed = '#DC2626';

  return (
    <div className="relative w-full bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm overflow-hidden">
      {/* Schematic Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-[#0E6B62] uppercase tracking-wider">
            Hardware Architecture Blueprint
          </span>
          <h3 className="text-base font-bold text-[#111827]">
            Integrated Health Belt — Waist Schematic
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isDeployed && (
            <span className="px-3 py-1 bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] font-semibold text-xs rounded-full animate-pulse">
              Airbags Deployed (Simulation)
            </span>
          )}
          {isDisconnected && (
            <span className="px-3 py-1 bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B] font-semibold text-xs rounded-full">
              Belt Offline / Disconnected
            </span>
          )}
          {!isDeployed && !isDisconnected && (
            <span className="px-3 py-1 bg-[#E6F4F1] border border-[#A7D7CF] text-[#0E6B62] font-semibold text-xs rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0E6B62] animate-ping" />
              Protection Ready & Armed
            </span>
          )}
        </div>
      </div>

      {/* SVG Belt Illustration */}
      <div className="relative w-full flex justify-center items-center py-4 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
        <svg
          viewBox="0 0 900 380"
          className="w-full max-w-4xl h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Linear and Radial Gradients for schematic aesthetics */}
            <linearGradient id="strapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={strapColor} stopOpacity="0.85" />
              <stop offset="50%" stopColor={strapColor} stopOpacity="1" />
              <stop offset="100%" stopColor={strapColor} stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="housingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="airbagReadyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6F4F1" />
              <stop offset="100%" stopColor="#C4E7E1" />
            </linearGradient>

            <radialGradient id="airbagDeployedGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEE2E2" />
              <stop offset="70%" stopColor="#FCA5A5" />
              <stop offset="100%" stopColor="#EF4444" />
            </radialGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND WAIST CONTOUR REFERENCE */}
          <path
            d="M 120 190 Q 450 140 780 190"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="48"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* MAIN ERGONOMIC BELT STRAP */}
          <path
            d="M 100 190 Q 450 145 800 190"
            fill="none"
            stroke="url(#strapGrad)"
            strokeWidth="36"
            strokeLinecap="round"
          />

          {/* FLEXIBLE INTERNAL BUS TRACES */}
          <path
            d="M 160 190 Q 450 152 740 190"
            fill="none"
            stroke={isDisconnected ? '#CBD5E1' : '#38BDF8'}
            strokeWidth="2.5"
            strokeDasharray={isDisconnected ? '4,4' : 'none'}
            opacity="0.75"
          />

          {/* ================= LEFT AIRBAG CHAMBER (HIP) ================= */}
          <g 
            className="cursor-pointer transition-all duration-300"
            onClick={() => onSelectComponent && onSelectComponent('airbag')}
          >
            {isDeployed ? (
              // DEPLOYED EXPANDED AIRBAG (LEFT)
              <g filter="url(#glow)">
                <ellipse
                  cx="210"
                  cy="175"
                  rx="75"
                  ry="55"
                  fill="url(#airbagDeployedGrad)"
                  stroke={deployedRed}
                  strokeWidth="3.5"
                />
                <circle cx="210" cy="175" r="35" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6,4" opacity="0.8" />
                <text x="210" y="172" textAnchor="middle" fill="#991B1B" fontSize="13" fontWeight="bold">
                  LEFT CUSHION
                </text>
                <text x="210" y="188" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="600">
                  INFLATED (CO₂)
                </text>
              </g>
            ) : (
              // READY FOLDED POD (LEFT)
              <g>
                <rect
                  x="160"
                  y="160"
                  width="95"
                  height="60"
                  rx="10"
                  fill="url(#airbagReadyGrad)"
                  stroke={selectedComponentId === 'airbag' ? '#0E6B62' : '#94A3B8'}
                  strokeWidth={selectedComponentId === 'airbag' ? '3' : '1.5'}
                />
                <text x="207" y="188" textAnchor="middle" fill="#0E6B62" fontSize="11" fontWeight="bold">
                  LEFT AIRBAG
                </text>
                <text x="207" y="204" textAnchor="middle" fill="#475569" fontSize="9">
                  Folded Hip Cushion
                </text>
              </g>
            )}
          </g>

          {/* ================= RIGHT AIRBAG CHAMBER (HIP) ================= */}
          <g 
            className="cursor-pointer transition-all duration-300"
            onClick={() => onSelectComponent && onSelectComponent('airbag')}
          >
            {isDeployed ? (
              // DEPLOYED EXPANDED AIRBAG (RIGHT)
              <g filter="url(#glow)">
                <ellipse
                  cx="690"
                  cy="175"
                  rx="75"
                  ry="55"
                  fill="url(#airbagDeployedGrad)"
                  stroke={deployedRed}
                  strokeWidth="3.5"
                />
                <circle cx="690" cy="175" r="35" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6,4" opacity="0.8" />
                <text x="690" y="172" textAnchor="middle" fill="#991B1B" fontSize="13" fontWeight="bold">
                  RIGHT CUSHION
                </text>
                <text x="690" y="188" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="600">
                  INFLATED (CO₂)
                </text>
              </g>
            ) : (
              // READY FOLDED POD (RIGHT)
              <g>
                <rect
                  x="645"
                  y="160"
                  width="95"
                  height="60"
                  rx="10"
                  fill="url(#airbagReadyGrad)"
                  stroke={selectedComponentId === 'airbag' ? '#0E6B62' : '#94A3B8'}
                  strokeWidth={selectedComponentId === 'airbag' ? '3' : '1.5'}
                />
                <text x="692" y="188" textAnchor="middle" fill="#0E6B62" fontSize="11" fontWeight="bold">
                  RIGHT AIRBAG
                </text>
                <text x="692" y="204" textAnchor="middle" fill="#475569" fontSize="9">
                  Folded Hip Cushion
                </text>
              </g>
            )}
          </g>

          {/* ================= CO2 CYLINDER & SOLENOID MODULE ================= */}
          <g 
            className="cursor-pointer"
            onClick={() => onSelectComponent && onSelectComponent('cartridge')}
          >
            {/* 16g Cylinder Silhouette */}
            <rect
              x="290"
              y="165"
              width="60"
              height="35"
              rx="6"
              fill={isDeployed ? '#F87171' : '#E2E8F0'}
              stroke="#64748B"
              strokeWidth="2"
            />
            {/* Valve Tip */}
            <rect x="350" y="174" width="12" height="17" fill="#475569" rx="2" />
            <text x="320" y="187" textAnchor="middle" fill="#1E293B" fontSize="9" fontWeight="bold">
              16g CO₂
            </text>
          </g>

          {/* ================= SOLENOID VALVE & 5V RELAY ================= */}
          <g 
            className="cursor-pointer"
            onClick={() => onSelectComponent && onSelectComponent('solenoid')}
          >
            <rect
              x="368"
              y="163"
              width="36"
              height="39"
              rx="4"
              fill={isDeployed ? '#FEE2E2' : '#FFFFFF'}
              stroke={isDeployed ? '#DC2626' : '#0E6B62'}
              strokeWidth="1.5"
            />
            <text x="386" y="181" textAnchor="middle" fill="#0E6B62" fontSize="8" fontWeight="bold">
              VALVE
            </text>
            <text x="386" y="193" textAnchor="middle" fill="#64748B" fontSize="7">
              12V/5V
            </text>
          </g>

          {/* ================= CENTRAL BUCKLE HOUSING: ESP32 + BATTERY ================= */}
          <g 
            className="cursor-pointer"
            onClick={() => onSelectComponent && onSelectComponent('esp32')}
          >
            {/* Outer Buckle Enclosure */}
            <rect
              x="415"
              y="125"
              width="145"
              height="115"
              rx="14"
              fill="url(#housingGrad)"
              stroke={selectedComponentId === 'esp32' ? '#38BDF8' : '#475569'}
              strokeWidth={selectedComponentId === 'esp32' ? '3' : '2'}
            />

            {/* Inner PCB Window */}
            <rect
              x="425"
              y="135"
              width="125"
              height="65"
              rx="8"
              fill="#064E3B"
              stroke="#047857"
              strokeWidth="1.5"
            />

            {/* Microcontroller Silicon Die & Shield */}
            <rect x="445" y="145" width="48" height="45" rx="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
            <text x="469" y="168" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
              ESP32
            </text>
            <text x="469" y="179" textAnchor="middle" fill="#34D399" fontSize="7">
              240 MHz
            </text>

            {/* Indicator Status LEDs */}
            {/* LED 1: Power */}
            <circle cx="505" cy="149" r="4" fill={isDisconnected ? '#64748B' : '#22C55E'} />
            <text x="513" y="152" fill="#E2E8F0" fontSize="7">PWR</text>
            {/* LED 2: BLE Link */}
            <circle cx="505" cy="165" r="4" fill={isDisconnected ? '#64748B' : '#38BDF8'} />
            <text x="513" y="168" fill="#E2E8F0" fontSize="7">BLE</text>
            {/* LED 3: Protection Arm */}
            <circle cx="505" cy="181" r="4" fill={isDeployed ? '#DC2626' : (isDisconnected ? '#64748B' : '#F59E0B')} />
            <text x="513" y="184" fill="#E2E8F0" fontSize="7">ARM</text>

            {/* Battery Level Bar in Buckle */}
            <rect x="428" y="208" width="119" height="22" rx="4" fill="#1E293B" />
            <text x="440" y="222" fill="#94A3B8" fontSize="8" fontWeight="bold">BATTERY</text>
            <text x="532" y="222" textAnchor="end" fill={isDisconnected ? '#94A3B8' : '#34D399'} fontSize="9" fontWeight="bold">
              {deviceStatus.batteryPct}%
            </text>
          </g>

          {/* ================= MPU6050 MOTION NODE ================= */}
          <g 
            className="cursor-pointer"
            onClick={() => onSelectComponent && onSelectComponent('motion')}
          >
            <rect
              x="575"
              y="163"
              width="48"
              height="45"
              rx="6"
              fill={isDeployed ? '#FEE2E2' : '#FFFFFF'}
              stroke={selectedComponentId === 'motion' ? '#0E6B62' : '#94A3B8'}
              strokeWidth="1.5"
            />
            <text x="599" y="182" textAnchor="middle" fill="#0E6B62" fontSize="9" fontWeight="bold">
              MPU6050
            </text>
            <text x="599" y="196" textAnchor="middle" fill="#64748B" fontSize="8">
              6-Axis IMU
            </text>
          </g>

          {/* ================= CALLOUT ANNOTATION POINTERS ================= */}
          {/* Callout: Solenoid & Cylinder */}
          <line x1="330" y1="165" x2="330" y2="105" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,3" />
          <text x="330" y="95" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600">
            16g CO₂ Actuator Unit
          </text>

          {/* Callout: Left Airbag */}
          <line x1="207" y1="160" x2="207" y2="70" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,3" />
          <text x="207" y="60" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600">
            Lateral Hip Protection Chamber (L)
          </text>

          {/* Callout: Central Buckle */}
          <line x1="487" y1="125" x2="487" y2="45" stroke="#0E6B62" strokeWidth="1.5" />
          <text x="487" y="35" textAnchor="middle" fill="#0E6B62" fontSize="11" fontWeight="bold">
            Central ESP32 Processing Buckle & Power
          </text>

          {/* Callout: Right Airbag */}
          <line x1="692" y1="160" x2="692" y2="70" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,3" />
          <text x="692" y="60" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600">
            Lateral Hip Protection Chamber (R)
          </text>

          {/* Callout: MPU6050 */}
          <line x1="599" y1="208" x2="599" y2="275" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,3" />
          <text x="599" y="290" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600">
            MPU6050 Motion Impact Node
          </text>
        </svg>
      </div>

      {/* Schematic legend footer */}
      <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-4 text-xs text-[#64748B]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#0E6B62]" /> Optical Bio-Cluster
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#38BDF8]" /> FPC Data Traces
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded ${isDeployed ? 'bg-[#DC2626]' : 'bg-[#C4E7E1]'}`} /> Hip Airbag Cushion
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#E2E8F0] border border-[#64748B]" /> 16g CO₂ Gas Cylinder
          </span>
        </div>
        <div className="font-mono text-[11px] text-[#94A3B8]">
          Form Factor: Waist-Worn Wearable (Non-Wrist)
        </div>
      </div>
    </div>
  );
};
