import React from 'react';
import { 
  Activity, 
  HeartPulse, 
  BrainCircuit, 
  CloudSun, 
  Bell, 
  Radio, 
  AlertTriangle, 
  ShieldCheck, 
  Settings 
} from 'lucide-react';

export interface NavDestination {
  id: string;
  label: string;
  shortDescription: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  phaseTarget: string;
}

export const NAVIGATION_DESTINATIONS: NavDestination[] = [
  {
    id: 'overview',
    label: 'Overview',
    shortDescription: 'Workstation status, risk score, key vitals, belt summary and recent alerts',
    icon: Activity,
    phaseTarget: 'Phase 1'
  },
  {
    id: 'health',
    label: 'Health',
    shortDescription: 'Live vitals monitoring, personal baseline comparison, and 6 trend analytics',
    icon: HeartPulse,
    phaseTarget: 'Phase 3'
  },
  {
    id: 'ai-analysis',
    label: 'AI Analysis',
    shortDescription: '5-stage local inference breakdown, contributing factor weights, and category scores',
    icon: BrainCircuit,
    phaseTarget: 'Phase 3'
  },
  {
    id: 'environment',
    label: 'Environment',
    shortDescription: 'Hazard safety cards for Heat, Air Quality, Flood, Cyclone, and advisories',
    icon: CloudSun,
    phaseTarget: 'Phase 4'
  },
  {
    id: 'alerts',
    label: 'Alerts',
    shortDescription: 'Deduplicated alert lifecycle, frozen input snapshots, and acknowledgement',
    icon: Bell,
    phaseTarget: 'Phase 4'
  },
  {
    id: 'devices',
    label: 'Devices',
    shortDescription: 'Belt schematic, 10 component statuses, connection controls, and protection timeline',
    icon: Radio,
    phaseTarget: 'Phase 5'
  },
  {
    id: 'emergency',
    label: 'Emergency',
    shortDescription: 'SOS check-in, 20s demo escalation countdown, and consent-filtered prepared payload',
    icon: AlertTriangle,
    phaseTarget: 'Phase 5'
  },
  {
    id: 'privacy',
    label: 'Privacy',
    shortDescription: 'Local workstation processing disclosure, field sharing choices, and data deletion',
    icon: ShieldCheck,
    phaseTarget: 'Phase 6'
  },
  {
    id: 'profile-settings',
    label: 'Profile & Settings',
    shortDescription: 'Profile editing, baseline HR provenance, contact setup, and accessibility choices',
    icon: Settings,
    phaseTarget: 'Phase 6'
  }
];
