import React, { useState } from 'react';
import { useCompanionStore } from '../../store/companionStore';
import { BaselineManager } from '../../domain/managers/baselineManager';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Dialog } from '../../components/common/Dialog';
import { 
  generateDeterministicTodayHistory, 
  generateDeterministic30DayHistory, 
  deriveTrendInsights,
  TrendDataPoint 
} from '../../data/historyGenerator';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  Moon, 
  ShieldAlert, 
  RefreshCw, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Radio, 
  Sliders, 
  BarChart2, 
  Cpu
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';

export const HealthPage: React.FC = () => {
  const activeTab = useCompanionStore(s => s.activeHealthTab);
  const setActiveTab = useCompanionStore(s => s.setActiveHealthTab);
  const selectedMetric = useCompanionStore(s => s.selectedTrendMetric);
  const setSelectedMetric = useCompanionStore(s => s.setSelectedTrendMetric);

  const baseline = useCompanionStore(s => s.baseline);
  const currentReading = useCompanionStore(s => s.currentReading);
  const deviceStatus = useCompanionStore(s => s.deviceStatus);
  const liveBufferHR = useCompanionStore(s => s.liveBufferHR);
  const liveBufferSpO2 = useCompanionStore(s => s.liveBufferSpO2);
  const demoState = useCompanionStore(s => s.demoState);

  const recalculateBaseline = useCompanionStore(s => s.recalculateBaseline);
  const setManualRestingHR = useCompanionStore(s => s.setManualRestingHR);
  const togglePause = useCompanionStore(s => s.togglePause);

  // Local state for timeframes and manual edit dialog
  const [trendTimeframe, setTrendTimeframe] = useState<'today' | '7d' | '30d'>('7d');
  const [isManualHRDialogOpen, setIsManualHRDialogOpen] = useState<boolean>(false);
  const [manualHRInput, setManualHRInput] = useState<string>(baseline.restingHR.toString());
  const [recalcFeedback, setRecalcFeedback] = useState<string | null>(null);

  // Calculated live deviations
  const hrVal = currentReading.hr ?? baseline.restingHR;
  const hrDeviationPct = BaselineManager.calculateHRDeviationPct(hrVal, baseline.restingHR);
  const hrTone = hrDeviationPct > 35 ? 'critical' : hrDeviationPct > 20 ? 'warning' : 'neutral';

  const spo2Val = currentReading.spo2 ?? baseline.spo2;
  const spo2DiffPp = BaselineManager.calculateSpO2DiffPp(spo2Val, baseline.spo2);
  const spo2Tone = spo2DiffPp >= 3 ? 'critical' : 'neutral';

  const tempVal = currentReading.bodyTemperatureC ?? baseline.bodyTemperatureC;
  const tempDelta = BaselineManager.calculateTempDelta(tempVal, baseline.bodyTemperatureC);
  const tempTone = tempDelta >= 0.8 ? 'warning' : 'neutral';

  // Deterministic historical series generation
  const thirtyDayHistory = generateDeterministic30DayHistory(baseline);
  const todayHistory = generateDeterministicTodayHistory(baseline, currentReading.hr, currentReading.spo2);

  // Select appropriate dataset based on timeframe
  const activeDataset = trendTimeframe === 'today'
    ? todayHistory
    : trendTimeframe === '7d'
      ? thirtyDayHistory.slice(-7)
      : thirtyDayHistory;

  // Map active dataset into TrendDataPoint series for Recharts
  const currentSeries: TrendDataPoint[] = activeDataset.map(pt => {
    let value = pt.hrAvg;
    let baselineVal = baseline.restingHR;

    if (selectedMetric === 'spo2') {
      value = pt.spo2Avg;
      baselineVal = baseline.spo2;
    } else if (selectedMetric === 'temp') {
      value = pt.tempAvg;
      baselineVal = baseline.bodyTemperatureC;
    } else if (selectedMetric === 'activity') {
      value = pt.activeMin;
      baselineVal = 30; // standard daily baseline target
    } else if (selectedMetric === 'sleep') {
      value = Math.round((pt.sleepMin / 60) * 10) / 10;
      baselineVal = Math.round((baseline.sleepMinutes / 60) * 10) / 10;
    } else if (selectedMetric === 'risk') {
      value = pt.riskScore;
      baselineVal = 18;
    }

    return {
      timeLabel: pt.dateStr,
      timestamp: pt.timestamp,
      value,
      baselineVal
    };
  });

  const insights = deriveTrendInsights(selectedMetric, trendTimeframe, currentSeries, baseline);

  // Handle baseline recalculation
  const handleRecalculate = (resetManual: boolean = false) => {
    recalculateBaseline(resetManual);
    if (baseline.isManualRestingHR && !resetManual) {
      setRecalcFeedback('Recalculated from 30-day history medians. Protected manual resting HR was preserved.');
    } else {
      setRecalcFeedback('Recalculated all baseline medians from 30-day history.');
    }
    setTimeout(() => setRecalcFeedback(null), 5000);
  };

  // Handle manual HR save
  const handleSaveManualHR = () => {
    const val = parseInt(manualHRInput, 10);
    if (!isNaN(val) && val >= 40 && val <= 180) {
      setManualRestingHR(val);
      setIsManualHRDialogOpen(false);
      setRecalcFeedback(`Manual resting heart rate locked to ${val} BPM (User-defined).`);
      setTimeout(() => setRecalcFeedback(null), 5000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Workspace Header & Segmented Sub-Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text)', margin: 0 }}>
              Health Monitoring Workspace
            </h2>
            <StatusBadge tone="neutral" label="Biometric Suite" />
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Continuous vital telemetry, personalized physiological baseline bounds, and longitudinal trend analysis
          </p>
        </div>

        {/* 3 Top Sub-Tabs */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--surface-muted)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            gap: '4px'
          }}
        >
          <button
            onClick={() => setActiveTab('live')}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: activeTab === 'live' ? 600 : 500,
              backgroundColor: activeTab === 'live' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'live' ? 'var(--teal-700)' : 'var(--text-secondary)',
              border: activeTab === 'live' ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Radio size={14} />
            <span>Live Monitoring</span>
          </button>

          <button
            onClick={() => setActiveTab('baseline')}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: activeTab === 'baseline' ? 600 : 500,
              backgroundColor: activeTab === 'baseline' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'baseline' ? 'var(--teal-700)' : 'var(--text-secondary)',
              border: activeTab === 'baseline' ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Sliders size={14} />
            <span>Personal Baseline</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: activeTab === 'trends' ? 600 : 500,
              backgroundColor: activeTab === 'trends' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'trends' ? 'var(--teal-700)' : 'var(--text-secondary)',
              border: activeTab === 'trends' ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <BarChart2 size={14} />
            <span>Longitudinal Trends</span>
          </button>
        </div>
      </div>

      {/* Recalculation / Status Notification Banner */}
      {recalcFeedback && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'var(--teal-50)',
            border: '1px solid var(--teal-200)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--teal-800)',
            fontSize: '13px'
          }}
        >
          <CheckCircle2 size={16} color="var(--teal-700)" />
          <span>{recalcFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: LIVE MONITORING */}
      {/* ========================================================================= */}
      {activeTab === 'live' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Signal & Stream Condition Banners */}
          {demoState.isPaused && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--amber-50)',
                border: '1px solid var(--amber-300)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--amber-900)',
                fontSize: '13px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} color="var(--amber-700)" />
                <span><strong>Stream Paused:</strong> Live sensor sampling paused from Demo Controls. Telemetry is static.</span>
              </div>
              <Button size="sm" variant="outline" onClick={togglePause}>
                Resume Telemetry
              </Button>
            </div>
          )}

          {deviceStatus.connection === 'disconnected' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: 'var(--rose-50)',
                border: '1px solid var(--rose-200)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--rose-800)',
                fontSize: '13px'
              }}
            >
              <AlertTriangle size={16} color="var(--rose-600)" />
              <span><strong>Belt Disconnected:</strong> Telemetry connection lost. Awaiting automatic Bluetooth reconnect from ESP32.</span>
            </div>
          )}

          {currentReading.quality < 50 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: 'var(--amber-50)',
                border: '1px solid var(--amber-300)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--amber-900)',
                fontSize: '13px'
              }}
            >
              <AlertTriangle size={16} color="var(--amber-700)" />
              <span><strong>Partial Data Quality ({currentReading.quality}%):</strong> Optical artifact detected. Fall and core motion algorithms remain active.</span>
            </div>
          )}

          {/* Top Live Stats Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            {/* Live HR Card */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Heart Rate
                </span>
                <Heart size={16} color="var(--rose-500)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                  {hrVal}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>BPM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Baseline: {baseline.restingHR} BPM</span>
                <span style={{ 
                  fontWeight: 600, 
                  color: hrTone === 'critical' ? 'var(--rose-600)' : hrTone === 'warning' ? 'var(--amber-700)' : 'var(--teal-700)' 
                }}>
                  {hrDeviationPct >= 0 ? `+${hrDeviationPct}%` : `${hrDeviationPct}%`}
                </span>
              </div>
            </div>

            {/* Live SpO2 Card */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  SpO₂ Blood Oxygen
                </span>
                <Wind size={16} color="var(--teal-600)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                  {spo2Val}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Baseline: {baseline.spo2}%</span>
                <span style={{ 
                  fontWeight: 600, 
                  color: spo2Tone === 'critical' ? 'var(--rose-600)' : 'var(--teal-700)' 
                }}>
                  {spo2DiffPp === 0 ? 'Nominal' : `-${spo2DiffPp} pp drop`}
                </span>
              </div>
            </div>

            {/* Live Body Temp Card */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Body Temperature
                </span>
                <Thermometer size={16} color="var(--amber-600)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                  {tempVal.toFixed(1)}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>°C</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Baseline: {baseline.bodyTemperatureC}°C</span>
                <span style={{ 
                  fontWeight: 600, 
                  color: tempTone === 'warning' ? 'var(--amber-700)' : 'var(--teal-700)' 
                }}>
                  {tempDelta === 0 ? 'Nominal' : `+${tempDelta.toFixed(1)}°C`}
                </span>
              </div>
            </div>

            {/* Live Activity Card */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Active Movement
                </span>
                <Activity size={16} color="var(--teal-700)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                  {currentReading.activityMinutes}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>min</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>State: {currentReading.activity.toUpperCase()}</span>
                <span style={{ fontWeight: 600, color: 'var(--teal-700)' }}>
                  {currentReading.motion}
                </span>
              </div>
            </div>
          </div>

          {/* Dual Real-Time Buffer Charts */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}
          >
            {/* Real-time HR Chart */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                    Continuous Heart Rate Stream (2s Ticks)
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Rolling buffer • Reference line shows {baseline.restingHR} BPM baseline
                  </span>
                </div>
                <StatusBadge tone="neutral" label="ESP32 PPG" />
              </div>

              <div style={{ height: '200px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={liveBufferHR.slice(-30)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px'
                      }}
                    />
                    <ReferenceLine y={baseline.restingHR} stroke="var(--teal-600)" strokeDasharray="4 4" label={{ value: 'Baseline', fill: 'var(--teal-700)', fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Heart Rate (BPM)"
                      stroke="var(--rose-500)"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Real-time SpO2 Chart */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                    Continuous Oxygen Saturation (SpO₂)
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Rolling buffer • Clinical reference floor: 95%
                  </span>
                </div>
                <StatusBadge tone="neutral" label="Pulse-Oximeter" />
              </div>

              <div style={{ height: '200px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={liveBufferSpO2.slice(-30)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                    <YAxis domain={[90, 100]} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px'
                      }}
                    />
                    <ReferenceLine y={95} stroke="var(--rose-400)" strokeDasharray="4 4" label={{ value: 'Clinical Concern', fill: 'var(--rose-600)', fontSize: 11 }} />
                    <ReferenceLine y={baseline.spo2} stroke="var(--teal-600)" strokeDasharray="4 4" label={{ value: 'Baseline', fill: 'var(--teal-700)', fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="SpO₂ (%)"
                      stroke="var(--teal-600)"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Telemetry Hardware Link Diagnostics */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="var(--teal-700)" />
              <span><strong>Hardware Link:</strong> {currentReading.source}</span>
            </div>
            <div>
              Packet Sequence: <strong style={{ color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>#{currentReading.sequence}</strong>
            </div>
            <div>
              Signal Quality: <strong style={{ color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>{currentReading.quality}% SNR</strong>
            </div>
            <div>
              Sampling Rate: <strong style={{ color: 'var(--text)' }}>0.5 Hz (Display stream)</strong>
            </div>
            <div>
              Freshness: <strong style={{ color: 'var(--teal-700)' }}>{demoState.isPaused ? 'Paused' : 'Fresh (<2s)'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PERSONAL BASELINE */}
      {/* ========================================================================= */}
      {activeTab === 'baseline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Hero Baseline Governance Banner */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 650, color: 'var(--text)' }}>
                  Personal Physiological Baseline
                </h3>
                <StatusBadge tone="low" label="Active Model" />
              </div>
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Source: <strong>{baseline.source}</strong> • Window: <strong>{baseline.timeWindow}</strong> • Sample count: <strong>{baseline.sampleCount}</strong>
              </p>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Computed: {baseline.computedAt}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsManualHRDialogOpen(true)}
              >
                <Edit3 size={15} style={{ marginRight: '6px' }} />
                Edit Resting HR
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => handleRecalculate(false)}
              >
                <RefreshCw size={15} style={{ marginRight: '6px' }} />
                Recalculate from History
              </Button>
            </div>
          </div>

          {/* Resting HR Override Transparency Card */}
          <div
            style={{
              backgroundColor: baseline.isManualRestingHR ? 'var(--amber-50)' : 'var(--surface)',
              border: baseline.isManualRestingHR ? '1px solid var(--amber-300)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Heart size={24} color={baseline.isManualRestingHR ? 'var(--amber-700)' : 'var(--rose-500)'} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text)' }}>
                    Resting Heart Rate Baseline
                  </span>
                  {baseline.isManualRestingHR ? (
                    <StatusBadge tone="moderate" label="User Defined (Protected)" />
                  ) : (
                    <StatusBadge tone="neutral" label="Computed Medians" />
                  )}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {baseline.isManualRestingHR
                    ? 'This value was manually provided. Recalculations will not silently overwrite your manual setting.'
                    : 'Computed from 30-day resting medians during stable morning hours.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                  {baseline.restingHR} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>BPM</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  Current live: {hrVal} BPM ({hrDeviationPct >= 0 ? `+${hrDeviationPct}%` : `${hrDeviationPct}%`})
                </div>
              </div>

              {baseline.isManualRestingHR && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRecalculate(true)}
                  title="Remove manual lock and reset to computed median"
                >
                  Reset to Computed
                </Button>
              )}
            </div>
          </div>

          {/* Comprehensive 4-Metric Baseline Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}
          >
            {/* SpO2 Baseline Card */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Normal Oxygen Saturation
                </span>
                <Wind size={16} color="var(--teal-700)" />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                {baseline.spo2}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Clinical boundary: 95% • Current live: {spo2Val}% ({spo2DiffPp} pp delta)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Threshold: ≥3 pp drop triggers respiratory risk factor
              </div>
            </div>

            {/* Body Temperature Baseline Card */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Core Body Temperature
                </span>
                <Thermometer size={16} color="var(--amber-600)" />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                {baseline.bodyTemperatureC.toFixed(1)}°C
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Current live: {tempVal.toFixed(1)}°C ({tempDelta >= 0 ? `+${tempDelta.toFixed(1)}°C` : `${tempDelta.toFixed(1)}°C`})
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Threshold: ≥0.8°C elevation triggers heat stress factor
              </div>
            </div>

            {/* Daily Physical Activity Baseline Card */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Daily Activity Target
                </span>
                <Activity size={16} color="var(--teal-700)" />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                30 min
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Current recorded: {currentReading.activityMinutes} min active ({currentReading.activity})
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Pacing: Measured by MPU6050 belt accelerometer
              </div>
            </div>

            {/* Rest & Sleep Baseline Card */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Restorative Sleep Target
                </span>
                <Moon size={16} color="var(--teal-700)" />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                {Math.round((baseline.sleepMinutes / 60) * 10) / 10} hrs
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Target: {baseline.sleepMinutes} min • Deficit: {Math.max(0, baseline.sleepMinutes - currentReading.sleepMinutes)} min
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Deficit ≥120 min activates Fatigue & Cognitive Risk factor (+20 pts)
              </div>
            </div>
          </div>

          {/* Explanatory Clinical Architecture Context */}
          <div
            style={{
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}
          >
            <strong>Why personal baselines matter:</strong> Unlike generic fitness trackers that evaluate vitals against population medians, the SIH26181 companion compares sensor telemetry directly against your individual baseline. A resting heart rate of 108 BPM indicates significant cardiovascular stress (+50%) for someone with a 72 BPM baseline, whereas it might be normal for a high-intensity athlete during recovery.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LONGITUDINAL TRENDS */}
      {/* ========================================================================= */}
      {activeTab === 'trends' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Seeded History Illustrative Disclaimer Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={15} color="var(--teal-700)" />
              <span>
                <strong>Illustrative Seeded History (Demo Seed 26181):</strong> Deterministic 30-day history generated locally to demonstrate multi-scale longitudinal analysis without cloud dependencies.
              </span>
            </div>
            <StatusBadge tone="neutral" label="Deterministic Seed" />
          </div>

          {/* Top Controls: Timeframe Selector & Metric Pills */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 18px'
            }}
          >
            {/* Metric Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '4px' }}>
                Metric:
              </span>
              {[
                { id: 'hr', label: 'Heart Rate', unit: 'BPM', icon: <Heart size={14} /> },
                { id: 'spo2', label: 'SpO₂ Saturation', unit: '%', icon: <Wind size={14} /> },
                { id: 'temp', label: 'Temperature', unit: '°C', icon: <Thermometer size={14} /> },
                { id: 'activity', label: 'Activity', unit: 'min', icon: <Activity size={14} /> },
                { id: 'sleep', label: 'Sleep', unit: 'hrs', icon: <Moon size={14} /> },
                { id: 'risk', label: 'Prototype Risk', unit: '0-100', icon: <ShieldAlert size={14} /> }
              ].map(m => {
                const isSelected = selectedMetric === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMetric(m.id as any)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontWeight: isSelected ? 600 : 500,
                      backgroundColor: isSelected ? 'var(--teal-50)' : 'transparent',
                      color: isSelected ? 'var(--teal-800)' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid var(--teal-300)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Timeframe Buttons (Today / 7 Days / 30 Days) */}
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: 'var(--surface-muted)',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                gap: '2px'
              }}
            >
              {(['today', '7d', '30d'] as const).map(tf => {
                const isSelected = trendTimeframe === tf;
                const label = tf === 'today' ? 'Today' : tf === '7d' ? '7 Days' : '30 Days';
                return (
                  <button
                    key={tf}
                    onClick={() => setTrendTimeframe(tf)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '12px',
                      fontWeight: isSelected ? 600 : 500,
                      backgroundColor: isSelected ? 'var(--surface)' : 'transparent',
                      color: isSelected ? 'var(--teal-700)' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid var(--border)' : '1px solid transparent',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Trend Chart Panel */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 650, color: 'var(--text)' }}>
                  {selectedMetric === 'hr' && 'Heart Rate Longitudinal Profile'}
                  {selectedMetric === 'spo2' && 'SpO₂ Blood Oxygen Longitudinal Profile'}
                  {selectedMetric === 'temp' && 'Core Body Temperature Diurnal Profile'}
                  {selectedMetric === 'activity' && 'Daily Active Exertion Profile'}
                  {selectedMetric === 'sleep' && 'Nightly Restorative Sleep Profile'}
                  {selectedMetric === 'risk' && 'Prototype AI Risk Score Historical Profile'}
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Aggregation: {trendTimeframe === 'today' ? '2-hour sample averages' : 'Daily resting medians'} • Baseline reference: {insights.baselineVal}
                </span>
              </div>

              <StatusBadge tone="low" label={`Status: ${insights.statusLabel}`} />
            </div>

            {/* Recharts Area / Line Chart */}
            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--teal-600)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--teal-600)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="timeLabel" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                  <YAxis 
                    domain={
                      selectedMetric === 'spo2' ? [90, 100] :
                      selectedMetric === 'temp' ? [35.5, 39.0] :
                      selectedMetric === 'risk' ? [0, 100] :
                      selectedMetric === 'sleep' ? [0, 10] :
                      ['auto', 'auto']
                    } 
                    tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px'
                    }}
                  />
                  {/* Baseline Reference Line */}
                  <ReferenceLine
                    y={insights.baselineVal}
                    stroke="var(--teal-700)"
                    strokeDasharray="4 4"
                    label={{ value: `Baseline (${insights.baselineVal})`, fill: 'var(--teal-700)', fontSize: 11, position: 'right' }}
                  />
                  {selectedMetric === 'spo2' && (
                    <ReferenceLine y={95} stroke="var(--rose-400)" strokeDasharray="4 4" label={{ value: 'Clinical Floor', fill: 'var(--rose-600)', fontSize: 11 }} />
                  )}
                  {selectedMetric === 'risk' && (
                    <>
                      <ReferenceLine y={30} stroke="var(--teal-600)" strokeDasharray="2 2" label={{ value: 'Low (0-30)', fill: 'var(--teal-700)', fontSize: 10 }} />
                      <ReferenceLine y={60} stroke="var(--amber-500)" strokeDasharray="2 2" label={{ value: 'Moderate (31-60)', fill: 'var(--amber-700)', fontSize: 10 }} />
                      <ReferenceLine y={80} stroke="var(--rose-500)" strokeDasharray="2 2" label={{ value: 'High (61-80)', fill: 'var(--rose-700)', fontSize: 10 }} />
                    </>
                  )}
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--teal-700)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#metricGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Derived Insights Box & Statistical Summary Chips */}
            <div
              style={{
                backgroundColor: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Statistical Chips */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Minimum: <strong style={{ color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>{insights.min}</strong>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Maximum: <strong style={{ color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>{insights.max}</strong>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Window Average: <strong style={{ color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>{insights.avg}</strong>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Baseline Offset: <strong style={{ color: 'var(--teal-700)', fontFeatureSettings: '"tnum"' }}>
                    {insights.deltaFromBaseline >= 0 ? `+${insights.deltaFromBaseline}` : `${insights.deltaFromBaseline}`}
                  </strong>
                </div>
              </div>

              {/* Truthful Narrative Derived from Displayed Series */}
              <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
                <strong>Longitudinal Observation:</strong> {insights.summaryText}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Resting HR Edit Dialog */}
      <Dialog
        isOpen={isManualHRDialogOpen}
        onClose={() => setIsManualHRDialogOpen(false)}
        title="Edit Manual Resting Heart Rate"
        subtitle="Enter your clinically confirmed resting heart rate. This baseline value will be preserved against automatic recalculation."
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="outline" size="sm" onClick={() => setIsManualHRDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveManualHR}>
              Save Manual Baseline
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
              Resting Heart Rate (BPM)
            </label>
            <input
              type="number"
              min="40"
              max="180"
              value={manualHRInput}
              onChange={(e) => setManualHRInput(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              Recommended nominal resting range: 55–85 BPM.
            </span>
          </div>

          <div
            style={{
              padding: '10px',
              backgroundColor: 'var(--surface-muted)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}
          >
            <strong>Note:</strong> Manually entered resting HR will be tagged as <em>(User Defined)</em> and protected from silent overwrite when baseline recalculations run.
          </div>
        </div>
      </Dialog>
    </div>
  );
};
