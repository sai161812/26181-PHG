import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { LIVE_CHART_DATA } from '../../data/fixtures';

export interface ChartPanelProps {
  onOpenTrends?: () => void;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({ onOpenTrends }) => {
  const [selectedMetric, setSelectedMetric] = useState<'hr' | 'spo2'>('hr');

  const metricConfig = {
    hr: {
      label: 'Heart rate',
      unit: 'BPM',
      color: 'var(--teal-600)',
      baseline: 72,
      baselineLabel: 'Resting baseline (72 BPM)',
      domain: [60, 90]
    },
    spo2: {
      label: 'SpO₂ oxygen saturation',
      unit: '%',
      color: 'var(--risk-low)',
      baseline: 98,
      baselineLabel: 'Typical SpO₂ (98%)',
      domain: [90, 100]
    }
  };

  const current = metricConfig[selectedMetric];

  // Prepare data with the selected metric
  const data = LIVE_CHART_DATA.map(d => ({
    time: d.time,
    value: selectedMetric === 'hr' ? d.value : 98,
    baseline: current.baseline
  }));

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Chart Header & Metric Selectors */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 650, color: 'var(--text)', margin: 0 }}>
            Live Vitals Stream
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            6-minute continuous observation window • 20s interval
          </div>
        </div>

        {/* Metric Segmented Control */}
        <div style={{ display: 'flex', backgroundColor: 'var(--canvas)', borderRadius: 'var(--radius-md)', padding: '3px', gap: '4px' }}>
          <button
            onClick={() => setSelectedMetric('hr')}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: selectedMetric === 'hr' ? 600 : 500,
              backgroundColor: selectedMetric === 'hr' ? 'var(--surface)' : 'transparent',
              color: selectedMetric === 'hr' ? 'var(--teal-700)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: selectedMetric === 'hr' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer'
            }}
          >
            Heart rate (BPM)
          </button>
          <button
            onClick={() => setSelectedMetric('spo2')}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: selectedMetric === 'spo2' ? 600 : 500,
              backgroundColor: selectedMetric === 'spo2' ? 'var(--surface)' : 'transparent',
              color: selectedMetric === 'spo2' ? 'var(--teal-700)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: selectedMetric === 'spo2' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer'
            }}
          >
            SpO₂ (%)
          </button>
        </div>
      </div>

      {/* Plot Surface */}
      <div style={{ flex: 1, minHeight: '200px', width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#EEF3F1" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
            />
            <YAxis
              domain={current.domain}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
              unit={` ${current.unit}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow)',
                fontSize: '12px'
              }}
              formatter={(val: any) => [`${val} ${current.unit}`, current.label]}
              labelFormatter={(label: any) => `Time: ${label}`}
            />
            <ReferenceLine
              y={current.baseline}
              stroke="var(--teal-700)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Baseline ${current.baseline} ${current.unit}`,
                fill: 'var(--teal-700)',
                fontSize: 11,
                position: 'insideTopRight'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={current.color}
              strokeWidth={2.5}
              dot={{ fill: current.color, r: 3 }}
              activeDot={{ r: 5 }}
              name={current.label}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Navigation Link */}
      {onOpenTrends && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
          <button
            onClick={onOpenTrends}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--teal-700)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Open comprehensive trend analytics & baseline comparison →
          </button>
        </div>
      )}
    </div>
  );
};
