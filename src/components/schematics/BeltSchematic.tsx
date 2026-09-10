import React from 'react';

export interface BeltSchematicProps {
  protectionState?: 'ready' | 'deployed' | 'inspection_required';
  width?: number | string;
  height?: number | string;
}

export const BeltSchematic: React.FC<BeltSchematicProps> = ({
  protectionState = 'ready',
  width = '100%',
  height = '80px'
}) => {
  const isDeployed = protectionState === 'deployed';
  const airbagFill = isDeployed ? 'var(--risk-high)' : 'var(--teal-100)';
  const airbagStroke = isDeployed ? 'var(--risk-high)' : 'var(--teal-600)';

  return (
    <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 420 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', maxHeight: '100px' }}
      >
        {/* Belt Straps (Ergonomic curved waist harness) */}
        <path
          d="M 20 50 C 70 30, 140 40, 170 50 L 170 65 C 140 55, 70 45, 20 65 Z"
          fill="#E2EAE7"
          stroke="#C5D3CE"
          strokeWidth="1.5"
        />
        <path
          d="M 400 50 C 350 30, 280 40, 250 50 L 250 65 C 280 55, 350 45, 400 65 Z"
          fill="#E2EAE7"
          stroke="#C5D3CE"
          strokeWidth="1.5"
        />

        {/* Left Airbag Deployment Pod */}
        <rect
          x="70"
          y="35"
          width="70"
          height="35"
          rx="6"
          fill={airbagFill}
          stroke={airbagStroke}
          strokeWidth="1.5"
        />
        <text x="105" y="57" fill="var(--teal-700)" fontSize="10" fontWeight="600" textAnchor="middle">
          {isDeployed ? 'DEPLOYED' : 'AIRBAG POD L'}
        </text>

        {/* Right Airbag Deployment Pod */}
        <rect
          x="280"
          y="35"
          width="70"
          height="35"
          rx="6"
          fill={airbagFill}
          stroke={airbagStroke}
          strokeWidth="1.5"
        />
        <text x="315" y="57" fill="var(--teal-700)" fontSize="10" fontWeight="600" textAnchor="middle">
          {isDeployed ? 'DEPLOYED' : 'AIRBAG POD R'}
        </text>

        {/* Center Control Unit (ESP32 + Sensors + CO2 Valve Module) */}
        <rect
          x="160"
          y="25"
          width="100"
          height="55"
          rx="8"
          fill="#FFFFFF"
          stroke="var(--teal-700)"
          strokeWidth="2"
        />

        {/* Sensor Housing Indicator */}
        <circle cx="180" cy="45" r="4" fill="var(--teal-700)" />
        <circle cx="195" cy="45" r="4" fill="var(--risk-low)" />
        <circle cx="210" cy="45" r="4" fill="var(--teal-600)" />

        {/* ESP32 Chip Accent */}
        <rect x="225" y="40" width="22" height="18" rx="2" fill="#EEF3F1" stroke="#BFDDD6" strokeWidth="1" />
        <text x="236" y="52" fill="#58706E" fontSize="7" fontWeight="700" textAnchor="middle">MCU</text>

        {/* Integrated Belt Label */}
        <text x="210" y="70" fill="var(--text)" fontSize="8" fontWeight="600" textAnchor="middle">
          ESP32 • MPU6050
        </text>
      </svg>
    </div>
  );
};
