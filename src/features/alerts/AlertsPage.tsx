import React, { useState } from 'react';
import { useCompanionStore } from '../../store/companionStore';
import { Alert } from '../../domain/types';
import { StatusBadge, BadgeTone } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Drawer } from '../../components/common/Drawer';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Check, 
  ArrowRight, 
  ShieldAlert, 
  RotateCcw,
  Camera,
  Activity,
  Wind,
  Flame,
  Moon,
  AlertOctagon,
  Cpu
} from 'lucide-react';

export interface AlertsPageProps {
  onNavigate?: (dest: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigate }) => {
  const alerts = useCompanionStore(s => s.alerts);
  const acknowledgeAlert = useCompanionStore(s => s.acknowledgeAlert);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Filter logic
  const filteredAlerts = alerts.filter(alert => {
    // Status filter
    if (statusFilter === 'active' && (alert.acknowledgedAt !== null || alert.resolvedAt !== null)) {
      return false;
    }
    if (statusFilter === 'acknowledged' && (alert.acknowledgedAt === null || alert.resolvedAt !== null)) {
      return false;
    }
    if (statusFilter === 'resolved' && alert.resolvedAt === null) {
      return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && alert.category !== categoryFilter) {
      return false;
    }

    // Severity filter
    if (severityFilter !== 'all' && alert.severity !== severityFilter) {
      return false;
    }

    return true;
  });

  // Calculate summary counts
  const activeCount = alerts.filter(a => a.resolvedAt === null && a.acknowledgedAt === null).length;
  const ackCount = alerts.filter(a => a.acknowledgedAt !== null && a.resolvedAt === null).length;
  const resolvedCount = alerts.filter(a => a.resolvedAt !== null).length;

  const handleClearFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setSeverityFilter('all');
  };

  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || severityFilter !== 'all';

  const getAlertStatusLabel = (a: Alert): { label: string; tone: BadgeTone } => {
    if (a.resolvedAt) return { label: 'Resolved', tone: 'neutral' };
    if (a.acknowledgedAt) return { label: 'Acknowledged', tone: 'teal' };
    return { label: 'Active Episode', tone: a.severity };
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'heat': return <Flame size={14} color="var(--amber-600)" />;
      case 'respiratory': return <Wind size={14} color="var(--teal-700)" />;
      case 'cardiovascular': return <Activity size={14} color="var(--rose-600)" />;
      case 'fatigue': return <Moon size={14} color="var(--teal-800)" />;
      case 'fall': return <AlertOctagon size={14} color="var(--rose-600)" />;
      default: return <Cpu size={14} color="var(--text-secondary)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text)', margin: 0 }}>
              Alerts & Event Lifecycle Management
            </h2>
            <StatusBadge tone="neutral" label="Local Event Engine" />
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Deduplicated anomaly episodes, two-sample qualification rules, and frozen physiological input snapshots
          </p>
        </div>

        {/* Top Summary Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setStatusFilter('active')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: statusFilter === 'active' ? 'var(--rose-100)' : 'var(--surface)',
              border: statusFilter === 'active' ? '1px solid var(--rose-400)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--rose-800)',
              cursor: 'pointer'
            }}
          >
            <AlertTriangle size={14} color="var(--rose-600)" />
            <span>Active: {activeCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('acknowledged')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: statusFilter === 'acknowledged' ? 'var(--teal-100)' : 'var(--surface)',
              border: statusFilter === 'acknowledged' ? '1px solid var(--teal-400)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--teal-900)',
              cursor: 'pointer'
            }}
          >
            <Check size={14} color="var(--teal-700)" />
            <span>Acknowledged: {ackCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('resolved')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: statusFilter === 'resolved' ? 'var(--surface-muted)' : 'var(--surface)',
              border: statusFilter === 'resolved' ? '1px solid var(--text-tertiary)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <CheckCircle2 size={14} color="var(--teal-600)" />
            <span>Resolved: {resolvedCount}</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS TOOLBAR */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Status Tabs */}
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
            {(['all', 'active', 'acknowledged', 'resolved'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: statusFilter === tab ? 600 : 500,
                  backgroundColor: statusFilter === tab ? 'var(--surface)' : 'transparent',
                  color: statusFilter === tab ? 'var(--teal-700)' : 'var(--text-secondary)',
                  border: statusFilter === tab ? '1px solid var(--border)' : '1px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                fontSize: '12px',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Categories</option>
              <option value="heat">Heat Stress</option>
              <option value="respiratory">Respiratory</option>
              <option value="cardiovascular">Cardiovascular</option>
              <option value="fatigue">Fatigue</option>
              <option value="fall">Fall Anomaly</option>
              <option value="disaster">Disaster Advisory</option>
              <option value="system">System / Device</option>
            </select>
          </div>

          {/* Severity Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Severity:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                fontSize: '12px',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button size="sm" variant="outline" onClick={handleClearFilters}>
            <RotateCcw size={13} style={{ marginRight: '6px' }} />
            Clear Filters
          </Button>
        )}
      </div>

      {/* ALERTS LIST / TABLE */}
      {filteredAlerts.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Bell size={36} color="var(--text-tertiary)" />
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 650, color: 'var(--text)' }}>
            No Alerts Found
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
            {hasActiveFilters
              ? 'No alert episodes match the current filter configuration. Try selecting a different status or category.'
              : 'All vital telemetry and environmental parameters are within safe baseline limits. No active alerts present.'}
          </p>
          {hasActiveFilters && (
            <Button size="sm" variant="primary" onClick={handleClearFilters} style={{ marginTop: '8px' }}>
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-muted)', borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Severity & Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Event Title</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Trigger Reason</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Timeline</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert, idx) => {
                const statusMeta = getAlertStatusLabel(alert);
                const timeLabel = new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <tr
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--surface-muted)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                        <StatusBadge tone={alert.severity} label={alert.severity.toUpperCase()} size="sm" />
                        <StatusBadge tone={statusMeta.tone} label={statusMeta.label} size="sm" />
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {getCategoryIcon(alert.category)}
                        <span style={{ fontWeight: 650, color: 'var(--text)' }}>
                          {alert.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px', display: 'block' }}>
                        Episode: {alert.episodeId} • {alert.consecutiveSamples} consecutive samples
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', maxWidth: '340px' }}>
                      <p style={{ margin: 0, lineHeight: 1.4, fontSize: '12px' }}>
                        {alert.reason}
                      </p>
                    </td>

                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} color="var(--text-tertiary)" />
                        <span>{timeLabel}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        Last seen: {new Date(alert.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {!alert.acknowledgedAt && !alert.resolvedAt && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              acknowledgeAlert(alert.id);
                            }}
                          >
                            <Check size={13} style={{ marginRight: '4px' }} />
                            Acknowledge
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAlert(alert);
                          }}
                        >
                          Details <ArrowRight size={13} style={{ marginLeft: '4px' }} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL DRAWER FOR SELECTED ALERT */}
      {selectedAlert && (
        <Drawer
          isOpen={selectedAlert !== null}
          onClose={() => setSelectedAlert(null)}
          title={selectedAlert.title}
          subtitle={`Episode: ${selectedAlert.episodeId} • Category: ${selectedAlert.category.toUpperCase()}`}
          width="480px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '16px 0' }}>
            {/* Status & Severity Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <StatusBadge tone={selectedAlert.severity} label={`${selectedAlert.severity.toUpperCase()} SEVERITY`} />
                <StatusBadge 
                  tone={getAlertStatusLabel(selectedAlert).tone} 
                  label={getAlertStatusLabel(selectedAlert).label} 
                />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                {selectedAlert.consecutiveSamples} samples qualified
              </span>
            </div>

            {/* FROZEN INPUT SNAPSHOT (The Proof of Trigger) */}
            <div
              style={{
                backgroundColor: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={15} color="var(--teal-700)" />
                <span style={{ fontSize: '13px', fontWeight: 650, color: 'var(--text)' }}>
                  Frozen Input Snapshot at Trigger Time
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ backgroundColor: 'var(--surface)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Heart Rate</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                    {selectedAlert.inputSnapshot.hr ? `${selectedAlert.inputSnapshot.hr} BPM` : 'N/A'}
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--surface)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>SpO₂ Saturation</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                    {selectedAlert.inputSnapshot.spo2 ? `${selectedAlert.inputSnapshot.spo2}%` : 'N/A'}
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--surface)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Body Temp</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                    {selectedAlert.inputSnapshot.bodyTemp ? `${selectedAlert.inputSnapshot.bodyTemp.toFixed(1)}°C` : 'N/A'}
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--surface)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Ambient Temp</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                    {selectedAlert.inputSnapshot.ambientC ? `${selectedAlert.inputSnapshot.ambientC}°C` : 'N/A'}
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--surface)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Humidity</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                    {selectedAlert.inputSnapshot.humidity ? `${selectedAlert.inputSnapshot.humidity}%` : 'N/A'}
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--surface)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>AQI Index</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                    {selectedAlert.inputSnapshot.aqi ? selectedAlert.inputSnapshot.aqi : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* TRIGGER REASON */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Mathematical Trigger Criteria
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
                {selectedAlert.reason}
              </p>
            </div>

            {/* RECOMMENDED ACTION */}
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'var(--teal-50)',
                border: '1px solid var(--teal-200)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--teal-900)',
                fontSize: '13px',
                lineHeight: 1.5
              }}
            >
              <strong>Recommended Action:</strong> {selectedAlert.recommendedAction}
            </div>

            {/* TIMELINE LIFECYCLE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
              <div>Created: <strong style={{ color: 'var(--text)' }}>{new Date(selectedAlert.createdAt).toLocaleString()}</strong></div>
              <div>Last Seen: <strong style={{ color: 'var(--text)' }}>{new Date(selectedAlert.lastSeenAt).toLocaleString()}</strong></div>
              <div>
                Acknowledged: <strong style={{ color: 'var(--text)' }}>
                  {selectedAlert.acknowledgedAt ? new Date(selectedAlert.acknowledgedAt).toLocaleString() : 'Pending'}
                </strong>
              </div>
              <div>
                Resolved: <strong style={{ color: 'var(--text)' }}>
                  {selectedAlert.resolvedAt ? new Date(selectedAlert.resolvedAt).toLocaleString() : 'Active episode'}
                </strong>
              </div>
            </div>

            {/* INTERACTIVE ACTIONS IN DRAWER */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              {!selectedAlert.acknowledgedAt && !selectedAlert.resolvedAt && (
                <Button
                  variant="primary"
                  onClick={() => {
                    acknowledgeAlert(selectedAlert.id);
                    setSelectedAlert(prev => prev ? { ...prev, acknowledgedAt: Date.now() } : null);
                  }}
                >
                  <Check size={15} style={{ marginRight: '6px' }} />
                  Acknowledge Episode
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedAlert(null);
                  if (onNavigate) onNavigate('ai-analysis');
                }}
              >
                <ShieldAlert size={15} style={{ marginRight: '6px' }} />
                View AI Factor Decomposition
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedAlert(null);
                  if (onNavigate) onNavigate('emergency');
                }}
              >
                <AlertTriangle size={15} style={{ marginRight: '6px' }} />
                Open Emergency Assistance / SOS
              </Button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
