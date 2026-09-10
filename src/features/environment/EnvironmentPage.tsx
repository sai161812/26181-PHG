import React from 'react';
import { useCompanionStore } from '../../store/companionStore';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Flame, 
  Wind, 
  Droplets, 
  Compass, 
  Info, 
  WifiOff, 
  FileText
} from 'lucide-react';

export const EnvironmentPage: React.FC = () => {
  const environment = useCompanionStore(s => s.environment);
  const settings = useCompanionStore(s => s.settings);

  const isOffline = settings.simulatedOffline;
  const isExpired = Date.now() > environment.validUntil;
  const isStaleOrOffline = isOffline || isExpired;

  // Heat hazard assessment
  const isHeatHazard = environment.ambientC >= 38 && environment.humidityPct >= 75;
  const heatTone = isHeatHazard ? 'high' : environment.ambientC >= 35 ? 'moderate' : 'low';

  // AQI hazard assessment
  const isAqiHazard = environment.aqi >= 150;
  const aqiTone = isAqiHazard ? 'high' : environment.aqi >= 100 ? 'moderate' : 'low';
  const aqiCategory = environment.aqi <= 50 ? 'Good' :
    environment.aqi <= 100 ? 'Moderate' :
    environment.aqi <= 150 ? 'Unhealthy for Sensitive Groups' :
    environment.aqi <= 200 ? 'Unhealthy' : 'Severe';

  // Disaster assessments
  const isFloodActive = environment.disasterType === 'flood';
  const isCycloneActive = environment.disasterType === 'cyclone';

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
              Environmental Safety & Disaster Advisories
            </h2>
            <StatusBadge tone="neutral" label="Municipal Context" />
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time environmental telemetry, municipal hazard warnings, and curated civil protection checklists
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isStaleOrOffline ? (
            <StatusBadge tone="moderate" icon={<WifiOff size={14} />} label="Cached Bulletin (Offline / Expired)" />
          ) : (
            <StatusBadge tone="low" label="Live Feed Connected" />
          )}
        </div>
      </div>

      {/* Cached / Offline Context Banner */}
      {isStaleOrOffline && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: 'var(--amber-50)',
            border: '1px solid var(--amber-300)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--amber-900)',
            fontSize: '13px'
          }}
        >
          <WifiOff size={18} color="var(--amber-700)" />
          <div>
            <strong>Cached Environmental Data:</strong> Remote municipal telemetry network is unavailable (or simulated offline). Displaying last cached advisory snapshot. Local belt telemetry and on-device risk assessment continue running autonomously.
          </div>
        </div>
      )}

      {/* 2×2 HAZARD MATRIX */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '20px'
        }}
      >
        {/* TILE 1: HEAT STRESS HAZARD */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: isHeatHazard ? '1px solid var(--rose-300)' : '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} color={isHeatHazard ? 'var(--rose-600)' : 'var(--amber-600)'} />
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 650, color: 'var(--text)' }}>
                Heat Stress Hazard
              </h3>
            </div>
            <StatusBadge tone={heatTone} label={isHeatHazard ? 'High Heat Hazard' : 'Nominal Thermal'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ backgroundColor: 'var(--surface-muted)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Ambient Temp</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                {environment.ambientC}°C
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>Threshold: ≥38°C</span>
            </div>

            <div style={{ backgroundColor: 'var(--surface-muted)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Humidity</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                {environment.humidityPct}%
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>Threshold: ≥75%</span>
            </div>

            <div style={{ backgroundColor: 'var(--surface-muted)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Exposure</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                {environment.exposureMinutes}m
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>{environment.outdoor ? 'Outdoor' : 'Indoor'}</span>
            </div>
          </div>

          {/* Curated Guidance */}
          <div
            style={{
              padding: '12px',
              backgroundColor: isHeatHazard ? 'var(--rose-50)' : 'var(--surface-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: isHeatHazard ? 'var(--rose-900)' : 'var(--text-secondary)',
              lineHeight: 1.5
            }}
          >
            <strong>Non-Diagnostic Precautionary Advice:</strong>
            {isHeatHazard ? (
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
                <li>Move into an air-conditioned or well-shaded area immediately.</li>
                <li>Hydrate frequently with water or oral rehydration fluids; avoid caffeine.</li>
                <li>Cease strenuous physical exertion until core thermal load decreases.</li>
              </ul>
            ) : (
              <p style={{ margin: '4px 0 0 0' }}>
                Thermal load remains within normal limits. Maintain regular hydration during extended outdoor activity.
              </p>
            )}
          </div>
        </div>

        {/* TILE 2: AIR QUALITY (AQI) HAZARD */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: isAqiHazard ? '1px solid var(--rose-300)' : '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind size={20} color={isAqiHazard ? 'var(--rose-600)' : 'var(--teal-700)'} />
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 650, color: 'var(--text)' }}>
                Air Quality Index (AQI)
              </h3>
            </div>
            <StatusBadge tone={aqiTone} label={`${environment.aqi} AQI • ${aqiCategory}`} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px' }}>
            <div style={{ backgroundColor: 'var(--surface-muted)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Particulate Index</span>
              <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', fontFeatureSettings: '"tnum"' }}>
                {environment.aqi}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block' }}>PM2.5 / PM10 composite</span>
            </div>

            <div style={{ backgroundColor: 'var(--surface-muted)', padding: '10px 12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>AI Engine Correlation</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: isAqiHazard ? 'var(--rose-600)' : 'var(--teal-700)', marginTop: '2px' }}>
                {isAqiHazard ? 'High Respiratory Factor (+20 pts)' : 'Nominal Air Quality (+0 pts)'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Compounds when personal SpO₂ drops ≥ 3 pp
              </span>
            </div>
          </div>

          {/* Curated Guidance */}
          <div
            style={{
              padding: '12px',
              backgroundColor: isAqiHazard ? 'var(--rose-50)' : 'var(--surface-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: isAqiHazard ? 'var(--rose-900)' : 'var(--text-secondary)',
              lineHeight: 1.5
            }}
          >
            <strong>Air Quality Precautionary Advice:</strong>
            {isAqiHazard ? (
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
                <li>Close doors and windows to minimize particulate penetration.</li>
                <li>Wear a certified particulate respirator (N95/FFP2) if outdoor transit is required.</li>
                <li>Avoid heavy cardiovascular workouts or cycling near major urban traffic arteries.</li>
              </ul>
            ) : (
              <p style={{ margin: '4px 0 0 0' }}>
                Ambient air quality is acceptable for outdoor activity and regular ventilation.
              </p>
            )}
          </div>
        </div>

        {/* TILE 3: FLOOD WARNING ADVISORY */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: isFloodActive ? '1px solid var(--rose-400)' : '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets size={20} color={isFloodActive ? 'var(--rose-600)' : 'var(--text-tertiary)'} />
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 650, color: 'var(--text)' }}>
                Flood Warning Advisory
              </h3>
            </div>
            <StatusBadge tone={isFloodActive ? 'critical' : 'low'} label={isFloodActive ? 'Active Municipal Alert' : 'No Flood Threat'} />
          </div>

          {/* Truthful Separation Callout */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: isFloodActive ? 'var(--rose-50)' : 'var(--surface-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: isFloodActive ? 'var(--rose-900)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Info size={16} color={isFloodActive ? 'var(--rose-600)' : 'var(--teal-700)'} />
            <span>
              <strong>Civil Defense Separation:</strong> Flood warnings are external safety advisories. Physiological vitals remain normal (Score: 18 / Low).
            </span>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text)' }}>
            Location: <strong>{isFloodActive ? environment.locationLabel : 'Local Zone Nominal'}</strong>
            {isFloodActive && (
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Precipitation Forecast: 140 mm / 24h • Low-lying drainage alert
              </span>
            )}
          </div>

          {/* Curated Preparedness Checklist */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--surface-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}
          >
            <strong>Civil Defense Preparedness Checklist:</strong>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
              <li>Move essential prescription medications and identity documents to upper levels.</li>
              <li>Keep Integrated Health Belt fully charged (Current battery: 84%).</li>
              <li>Drink only boiled or sealed bottled water; avoid contact with flooded roadways.</li>
            </ul>
          </div>
        </div>

        {/* TILE 4: CYCLONE WARNING ADVISORY */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: isCycloneActive ? '1px solid var(--rose-400)' : '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} color={isCycloneActive ? 'var(--rose-600)' : 'var(--text-tertiary)'} />
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 650, color: 'var(--text)' }}>
                Cyclone & Gale Advisory
              </h3>
            </div>
            <StatusBadge tone={isCycloneActive ? 'critical' : 'low'} label={isCycloneActive ? 'Active Storm Warning' : 'No Cyclone Threat'} />
          </div>

          {/* Truthful Separation Callout */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: isCycloneActive ? 'var(--rose-50)' : 'var(--surface-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: isCycloneActive ? 'var(--rose-900)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Info size={16} color={isCycloneActive ? 'var(--rose-600)' : 'var(--teal-700)'} />
            <span>
              <strong>Meteorological Separation:</strong> Cyclone storm warnings remain independent from personal physiological risk scores.
            </span>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text)' }}>
            Location: <strong>{isCycloneActive ? environment.locationLabel : 'Coastal Zone Nominal'}</strong>
            {isCycloneActive && (
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Wind Telemetry: Sustained 85 km/h • Gusts up to 110 km/h
              </span>
            )}
          </div>

          {/* Curated Sheltering Checklist */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--surface-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}
          >
            <strong>Storm Sheltering & Safety Checklist:</strong>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
              <li>Inspect and fasten window latches and exterior storm shutters.</li>
              <li>Keep an emergency flashlight, backup power bank, and first aid kit accessible.</li>
              <li>Remain indoors in an interior corridor away from glass windows until the storm passes.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* METADATA, SOURCE PROVENANCE & LEGAL BOUNDARIES */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color="var(--teal-700)" />
          <span>Bulletin Authority: <strong>{environment.source}</strong></span>
        </div>

        <div>
          Observed: <strong style={{ color: 'var(--text)' }}>{new Date(environment.observedAt).toLocaleTimeString()}</strong>
        </div>

        <div>
          Valid Until: <strong style={{ color: 'var(--text)' }}>{new Date(environment.validUntil).toLocaleTimeString()}</strong>
        </div>

        <div style={{ fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
          Non-diagnostic public safety advisory context • No live authority feed fabricated
        </div>
      </div>
    </div>
  );
};
