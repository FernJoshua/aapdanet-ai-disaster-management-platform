// Real-Time Operations Store & Event Bus (Phase 2)
// Supports:
// 1. Zero-Config Instant Cross-Window Sync via BroadcastChannel('aapdanet_realtime_bus') + localStorage
// 2. Plug-and-Play Cloud PostgreSQL + Realtime Sync via Supabase REST API (when URL + Anon Key are configured)

import { INITIAL_ALERTS, SHELTERS_DATA, RESCUE_TEAMS, CITIZEN_SOS_REPORTS } from './mockData';

export const HOSPITALS_DATA = [
  {
    id: 'HOSP-01',
    name: 'KEM Hospital & Trauma Care Centre',
    district: 'Mumbai',
    coordinates: [19.0025, 72.8424],
    bedsAvailable: 48,
    icuAvailable: 9,
    traumaLevel: 'Level-1 Apex Trauma',
    phone: '022-24107000',
    ambulanceHotline: '108'
  },
  {
    id: 'HOSP-02',
    name: 'Sub-District Rural Trauma Hospital, Mahad',
    district: 'Raigad',
    coordinates: [18.0762, 73.4218],
    bedsAvailable: 26,
    icuAvailable: 5,
    traumaLevel: '24x7 Flood & Landslide Emergency',
    phone: '02145-222126',
    ambulanceHotline: '108'
  },
  {
    id: 'HOSP-03',
    name: 'B.K.L. Walawalkar Charitable Hospital, Chiplun',
    district: 'Ratnagiri',
    coordinates: [17.4685, 73.4792],
    bedsAvailable: 42,
    icuAvailable: 8,
    traumaLevel: 'Tertiary Coastal Trauma Center',
    phone: '02355-264137',
    ambulanceHotline: '108'
  },
  {
    id: 'HOSP-04',
    name: 'Sassoon General Hospital (BJMC)',
    district: 'Pune',
    coordinates: [18.5263, 73.8712],
    bedsAvailable: 64,
    icuAvailable: 14,
    traumaLevel: 'Level-1 Regional Referral',
    phone: '020-26128000',
    ambulanceHotline: '108'
  },
  {
    id: 'HOSP-05',
    name: 'Government Medical College & Hospital (GMCH)',
    district: 'Nagpur',
    coordinates: [21.1312, 79.0956],
    bedsAvailable: 55,
    icuAvailable: 12,
    traumaLevel: 'Burn, Heatstroke & Trauma Unit',
    phone: '0712-2744671',
    ambulanceHotline: '108'
  },
  {
    id: 'HOSP-06',
    name: 'Chhatrapati Pramila Raje (CPR) Civil Hospital',
    district: 'Kolhapur',
    coordinates: [16.7018, 74.2281],
    bedsAvailable: 34,
    icuAvailable: 7,
    traumaLevel: 'District Flood Medical Hub',
    phone: '0231-2641583',
    ambulanceHotline: '108'
  }
];

export const ENHANCED_INITIAL_SOS = [
  {
    id: 'SOS #1042',
    name: 'Suresh Jadhav & Family',
    phone: '+91 94218 44102',
    locationName: 'Dasgaon - Savitri River Bank, Mahad',
    district: 'Raigad',
    category: 'Flood',
    urgency: 'P1 - HIGH',
    victimsCount: 6,
    includesElderlyOrDisabled: true,
    description: 'Savitri River backwater entered ground floor rapidly after heavy ghat downpour. 6 people including 2 elderly citizens stranded on terrace.',
    coordinates: [18.0795, 73.4195],
    timestamp: 'Just now • 12 mins ago',
    status: 'OPEN',
    assignedUnit: null,
    provenance: 'USER REPORT'
  },
  ...CITIZEN_SOS_REPORTS.map(r => ({
    ...r,
    provenance: 'USER REPORT'
  }))
];

export const ENHANCED_INITIAL_TEAMS = [
  {
    id: 'TEAM-ALPHA-01',
    name: 'Rescue Team Alpha (SDRF Mahad Unit)',
    base: 'Mahad NH-66 Forward Operating Base',
    type: 'Flood Boat & Rope Rescue',
    personnel: 32,
    equipment: ['4 Inflatable Motor Boats', 'Life Jackets', 'Thermal Drone', 'Medical Trauma Kit'],
    coordinates: [18.0890, 73.4110],
    status: 'AVAILABLE',
    assignedSosId: null
  },
  {
    id: 'TEAM-BRAVO-02',
    name: 'Rescue Team Bravo (NDRF 5th Bn Kurla)',
    base: 'BKC - Kurla Mithi Basin Forward Post',
    type: 'Urban Flood & High-Water Rescue',
    personnel: 45,
    equipment: ['6 Inflatable Motor Boats', 'Deep Water Sonar', 'Dewatering Pumps'],
    coordinates: [19.0680, 72.8710],
    status: 'AVAILABLE',
    assignedSosId: null
  },
  ...RESCUE_TEAMS.map((t, idx) => ({
    ...t,
    status: idx === 0 ? 'BUSY' : 'AVAILABLE',
    assignedSosId: idx === 0 ? 'SOS-701' : null
  }))
];

export const ENHANCED_INITIAL_SHELTERS = SHELTERS_DATA.map((s) => {
  if (s.id === 'SHL-03') {
    return {
      ...s,
      name: 'Mahad High School Relief Shelter',
      capacity: 500,
      currentOccupancy: 347,
      suppliesStatus: { water: true, food: true, medical: true, power: true }
    };
  }
  return {
    ...s,
    suppliesStatus: { water: true, food: true, medical: true, power: true }
  };
});

function formatISTTime(offsetMinutes = 0) {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  });
}

export const INITIAL_TIMELINE = [
  {
    id: 'TL-101',
    time: formatISTTime(-15),
    title: 'Heavy rainfall detected in Raigad & Konkan Ghats',
    detail: 'Open-Meteo & rain radar telemetry logged intense convective band over Mahad-Poladpur.',
    category: 'WEATHER',
    provenance: 'LIVE API'
  },
  {
    id: 'TL-102',
    time: formatISTTime(-9),
    title: 'Savitri River discharge increasing (GloFAS Hydrological Watch)',
    detail: 'Basin runoff model shows rising discharge trend across Savitri & Vashishti catchments.',
    category: 'FLOOD',
    provenance: 'LIVE API'
  },
  {
    id: 'TL-103',
    time: formatISTTime(-5),
    title: 'SOS #1042 received from Mahad (6 citizens affected)',
    detail: 'High-priority flood distress beacon logged at Dasgaon - Savitri River Bank (18.0795, 73.4195).',
    category: 'SOS',
    provenance: 'USER REPORT'
  },
  {
    id: 'TL-104',
    time: formatISTTime(-3),
    title: 'NDRF 5th Bn Alpha dispatched to Kurla Mithi Basin',
    detail: 'Responding to SOS-701 with inflatable motor boats and life-support kits.',
    category: 'DISPATCH',
    provenance: 'LIVE OPS'
  },
  {
    id: 'TL-105',
    time: formatISTTime(-1),
    title: 'Shelter occupancy verified at Mahad High School (347 / 500)',
    detail: '153 beds available • Water ✓ Food ✓ Medical ✓ Power Backup ✓',
    category: 'SHELTER',
    provenance: 'LIVE OPS'
  }
];

export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor to enable Cloud Multi-Device Sync:
create table if not exists sos_reports (
  id text primary key,
  name text,
  phone text,
  location_name text,
  district text,
  category text,
  urgency text,
  victims_count int default 1,
  description text,
  coordinates jsonb,
  status text default 'OPEN',
  assigned_unit text,
  created_at timestamptz default now()
);

create table if not exists shelters (
  id text primary key,
  name text,
  district text,
  capacity int,
  current_occupancy int,
  status text default 'OPEN',
  updated_at timestamptz default now()
);

create table if not exists timeline_events (
  id text primary key,
  time text,
  title text,
  detail text,
  category text,
  provenance text,
  created_at timestamptz default now()
);

alter publication supabase_realtime add table sos_reports, shelters, timeline_events;`;

const STORAGE_KEYS = {
  SOS: 'aapdanet_rt_sos_v3',
  SHELTERS: 'aapdanet_rt_shelters_v3',
  TEAMS: 'aapdanet_rt_teams_v3',
  ALERTS: 'aapdanet_rt_alerts_v3',
  TIMELINE: 'aapdanet_rt_timeline_v3',
  ROUTES: 'aapdanet_rt_routes_v3'
};

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
}

// Optional Supabase REST Push helper when user configures URL + Anon Key
async function pushToSupabaseIfConfigured(table, record) {
  if (typeof window === 'undefined') return false;
  const url = localStorage.getItem('cfg_supabase_url');
  const key = localStorage.getItem('cfg_supabase_key');
  if (!url || !key) return false;
  try {
    const cleanUrl = url.replace(/\/$/, '');
    await fetch(`${cleanUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify(record)
    });
    return true;
  } catch {
    return false;
  }
}

export function createOperationsStore(onStateChange) {
  const rawRoutes = readStorage(STORAGE_KEYS.ROUTES, []);
  const validRoutes = Array.isArray(rawRoutes)
    ? rawRoutes.filter((r) => Array.isArray(r?.geometry) && r.geometry.length >= 2)
    : [];

  let state = {
    sosReports: readStorage(STORAGE_KEYS.SOS, ENHANCED_INITIAL_SOS),
    shelters: readStorage(STORAGE_KEYS.SHELTERS, ENHANCED_INITIAL_SHELTERS),
    rescueTeams: readStorage(STORAGE_KEYS.TEAMS, ENHANCED_INITIAL_TEAMS),
    alerts: readStorage(STORAGE_KEYS.ALERTS, INITIAL_ALERTS),
    timeline: readStorage(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE),
    activeRoutes: validRoutes,
    hospitals: HOSPITALS_DATA
  };

  let channel = null;
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      channel = new BroadcastChannel('aapdanet_realtime_bus');
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'SYNC_STATE') {
          state = {
            ...state,
            ...event.data.payload
          };
          onStateChange({ ...state });
        }
      };
    } catch {
      channel = null;
    }
  }

  const broadcastAndPersist = (partialState) => {
    state = { ...state, ...partialState };
    if (partialState.sosReports) writeStorage(STORAGE_KEYS.SOS, state.sosReports);
    if (partialState.shelters) writeStorage(STORAGE_KEYS.SHELTERS, state.shelters);
    if (partialState.rescueTeams) writeStorage(STORAGE_KEYS.TEAMS, state.rescueTeams);
    if (partialState.alerts) writeStorage(STORAGE_KEYS.ALERTS, state.alerts);
    if (partialState.timeline) writeStorage(STORAGE_KEYS.TIMELINE, state.timeline);
    if (partialState.activeRoutes) writeStorage(STORAGE_KEYS.ROUTES, state.activeRoutes);

    if (channel) {
      try {
        channel.postMessage({
          type: 'SYNC_STATE',
          payload: partialState
        });
      } catch {
        // ignore channel errors
      }
    }
    onStateChange({ ...state });
  };

  const addTimelineEvent = (title, detail, category = 'OPS', provenance = 'LIVE OPS') => {
    const newEvent = {
      id: `TL-${Date.now().toString().slice(-5)}`,
      time: formatISTTime(0),
      title,
      detail,
      category,
      provenance
    };
    const nextTimeline = [newEvent, ...state.timeline].slice(0, 30);
    broadcastAndPersist({ timeline: nextTimeline });
    pushToSupabaseIfConfigured('timeline_events', newEvent);
    return newEvent;
  };

  const addSOSReport = (report) => {
    const formattedReport = {
      ...report,
      id: report.id || `SOS #${Math.floor(1043 + Math.random() * 8900)}`,
      status: report.status || 'OPEN',
      provenance: 'USER REPORT',
      timestamp: 'Live • Just now'
    };
    const nextSos = [formattedReport, ...state.sosReports];
    const tlEvent = {
      id: `TL-${Date.now().toString().slice(-5)}`,
      time: formatISTTime(0),
      title: `${formattedReport.id} received from ${formattedReport.locationName}`,
      detail: `${formattedReport.category} • ${formattedReport.victimsCount || 1} people affected • Priority: ${formattedReport.urgency}`,
      category: 'SOS',
      provenance: 'USER REPORT'
    };
    const nextTimeline = [tlEvent, ...state.timeline].slice(0, 30);
    broadcastAndPersist({ sosReports: nextSos, timeline: nextTimeline });
    pushToSupabaseIfConfigured('sos_reports', {
      id: formattedReport.id,
      name: formattedReport.name,
      phone: formattedReport.phone,
      location_name: formattedReport.locationName,
      district: formattedReport.district,
      category: formattedReport.category,
      urgency: formattedReport.urgency,
      victims_count: formattedReport.victimsCount || 1,
      description: formattedReport.description,
      coordinates: formattedReport.coordinates,
      status: formattedReport.status
    });
    return formattedReport;
  };

  const dispatchTeamToSOS = ({ sosId, teamId, routeData }) => {
    const targetSos = state.sosReports.find((s) => s.id === sosId);
    const targetTeam = state.rescueTeams.find((t) => t.id === teamId);
    if (!targetSos || !targetTeam) return null;

    const nextTeams = state.rescueTeams.map((t) =>
      t.id === teamId
        ? { ...t, status: 'BUSY', assignedSosId: sosId }
        : t
    );

    const nextSos = state.sosReports.map((s) =>
      s.id === sosId
        ? {
            ...s,
            status: 'RESPONDING',
            assignedUnit: targetTeam.name,
            etaMinutes: routeData?.durationMin || 14,
            roadDistanceKm: routeData?.distanceKm || 4.2
          }
        : s
    );

    const newRouteRecord = routeData
      ? {
          id: `RT-${sosId}-${teamId}`,
          sosId,
          teamId,
          teamName: targetTeam.name,
          sosLocation: targetSos.locationName,
          distanceKm: routeData.distanceKm,
          durationMin: routeData.durationMin,
          geometry: routeData.geometry,
          isOsrmLive: routeData.isOsrmLive
        }
      : null;

    const nextRoutes = newRouteRecord
      ? [newRouteRecord, ...state.activeRoutes.filter((r) => r.sosId !== sosId)]
      : state.activeRoutes;

    const tlEvent = {
      id: `TL-${Date.now().toString().slice(-5)}`,
      time: formatISTTime(0),
      title: `${targetTeam.name} dispatched to ${sosId}`,
      detail: `Target: ${targetSos.locationName} • Road Distance: ${routeData?.distanceKm || 4.2} km • ETA: ${routeData?.durationMin || 14} mins (${routeData?.isOsrmLive ? 'OSRM Live Route' : 'Calculated Route'})`,
      category: 'DISPATCH',
      provenance: 'LIVE OPS'
    };

    const nextTimeline = [tlEvent, ...state.timeline].slice(0, 30);

    broadcastAndPersist({
      rescueTeams: nextTeams,
      sosReports: nextSos,
      activeRoutes: nextRoutes,
      timeline: nextTimeline
    });

    return { nextTeams, nextSos, newRouteRecord };
  };

  const updateShelterOccupancy = (shelterId, deltaPeople) => {
    let updatedShelter = null;
    let prevOcc = 0;
    const nextShelters = state.shelters.map((s) => {
      if (s.id !== shelterId) return s;
      prevOcc = s.currentOccupancy;
      const nextOcc = Math.max(0, Math.min(s.capacity, s.currentOccupancy + deltaPeople));
      updatedShelter = {
        ...s,
        currentOccupancy: nextOcc,
        status: nextOcc >= s.capacity ? 'FULL' : 'OPEN'
      };
      return updatedShelter;
    });

    if (!updatedShelter) return null;

    const tlEvent = {
      id: `TL-${Date.now().toString().slice(-5)}`,
      time: formatISTTime(0),
      title: `Shelter occupancy updated: ${updatedShelter.name}`,
      detail: `Occupancy changed ${prevOcc} → ${updatedShelter.currentOccupancy} / ${updatedShelter.capacity} (${updatedShelter.capacity - updatedShelter.currentOccupancy} beds available)`,
      category: 'SHELTER',
      provenance: 'LIVE OPS'
    };

    const nextTimeline = [tlEvent, ...state.timeline].slice(0, 30);
    broadcastAndPersist({
      shelters: nextShelters,
      timeline: nextTimeline
    });
    pushToSupabaseIfConfigured('shelters', {
      id: updatedShelter.id,
      name: updatedShelter.name,
      district: updatedShelter.district,
      capacity: updatedShelter.capacity,
      current_occupancy: updatedShelter.currentOccupancy,
      status: updatedShelter.status
    });
    return updatedShelter;
  };

  const resetOperationsDemo = () => {
    broadcastAndPersist({
      sosReports: ENHANCED_INITIAL_SOS,
      shelters: ENHANCED_INITIAL_SHELTERS,
      rescueTeams: ENHANCED_INITIAL_TEAMS,
      alerts: INITIAL_ALERTS,
      timeline: INITIAL_TIMELINE,
      activeRoutes: []
    });
  };

  return {
    getState: () => state,
    addSOSReport,
    dispatchTeamToSOS,
    updateShelterOccupancy,
    addTimelineEvent,
    resetOperationsDemo,
    destroy: () => {
      if (channel) channel.close();
    }
  };
}
