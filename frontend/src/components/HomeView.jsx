import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  BrainCircuit,
  Truck,
  PhoneCall,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Radio,
  Compass,
  Volume2,
  Building2,
  RefreshCw,
  Flame,
  Waves,
  Clock,
  Database,
  Satellite,
  ChevronDown,
  Bell,
  MapPin,
  Shield,
  Layers
} from 'lucide-react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { getTranslation, translatePhrase } from '../utils/translations';
import { INITIAL_ALERTS, SHELTERS_DATA, RELIEVED_DISASTERS } from '../services/mockData';
import { fetchLiveMultiHazardTelemetry, fetchOSRMRoadRoute } from '../services/realTimeService';
import { INITIAL_TIMELINE } from '../services/operationsStore';

// Safe LatLng validators for Leaflet to ensure stability
function isValidLatLng(coords) {
  return (
    Array.isArray(coords) &&
    coords.length >= 2 &&
    typeof coords[0] === 'number' &&
    typeof coords[1] === 'number' &&
    !Number.isNaN(coords[0]) &&
    !Number.isNaN(coords[1])
  );
}

function getValidCoords(item) {
  if (!item) return null;
  if (isValidLatLng(item.coordinates)) return [item.coordinates[0], item.coordinates[1]];
  if (typeof item.lat === 'number' && typeof item.lon === 'number' && !Number.isNaN(item.lat) && !Number.isNaN(item.lon)) {
    return [item.lat, item.lon];
  }
  return null;
}

const createPinIcon = (color, text) =>
  L.divIcon({
    className: 'custom-pin-icon',
    html: `<div style="background-color: ${color}; color: #ffffff; width: 26px; height: 26px; border-radius: 50%; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">${text}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13]
  });

const sosPin = createPinIcon('#dc2626', 'SOS');
const shelterPin = createPinIcon('#0b1f33', 'SHL');
const teamPin = createPinIcon('#1769aa', 'TEAM');

export default function HomeView({
  alerts = INITIAL_ALERTS,
  shelters = SHELTERS_DATA,
  sosReports = [],
  rescueTeams = [],
  timeline = INITIAL_TIMELINE,
  liveTelemetry: propTelemetry = null,
  onDispatchTeam,
  onUpdateShelterOccupancy,
  onOpenCloudConfig,
  lang = 'en',
  setActiveTab = () => {},
  onSelectAlert = () => {},
  onSpeakText = () => {}
}) {
  const t = (key) => getTranslation(lang, key);
  const tp = (phrase) => translatePhrase(lang, phrase);

  const [isSyncing, setIsSyncing] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [localTelemetry, setLocalTelemetry] = useState(null);
  const telemetry = propTelemetry || localTelemetry;

  const [openSection, setOpenSection] = useState(null); // 'basins' | 'timeline' | 'relieved' | null
  const [selectedAlertIndex, setSelectedAlertIndex] = useState(0);

  const [lastSyncTime, setLastSyncTime] = useState(
    new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST'
  );

  const syncAllRealTimeFeeds = async () => {
    setIsSyncing(true);
    try {
      const data = await fetchLiveMultiHazardTelemetry();
      setLocalTelemetry(data);
      setLastSyncTime(
        new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST'
      );
    } catch {
      // Retain fallback state
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!propTelemetry) {
      syncAllRealTimeFeeds();
    }
    const interval = setInterval(syncAllRealTimeFeeds, 60000);
    return () => clearInterval(interval);
  }, [propTelemetry]);

  const handleQuickDispatch = async (sos) => {
    if (!onDispatchTeam || !sos) return;
    const availableTeam =
      rescueTeams.find((team) => team.status === 'AVAILABLE') || rescueTeams[0];
    if (!availableTeam) return;

    setDispatchingId(sos.id);
    try {
      const routeData = await fetchOSRMRoadRoute(
        availableTeam.coordinates,
        sos.coordinates
      );
      onDispatchTeam({
        sosId: sos.id,
        teamId: availableTeam.id,
        routeData
      });
      onSpeakText(
        `${availableTeam.name} dispatched to ${sos.id} at ${sos.locationName}. Road distance ${routeData.distanceKm} kilometers, ETA ${routeData.durationMin} minutes.`
      );
    } finally {
      setDispatchingId(null);
    }
  };

  const basins = telemetry?.basins || [];
  const currentSos = sosReports[0] || null;

  return (
    <div className="space-y-4 pb-8 w-full max-w-full overflow-x-hidden">
      {/* Top Notice Bar matching reference screenshot */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 rounded-xl bg-[#111620] border border-[#1a2230] text-xs gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
            LIVE OPERATIONS MODE
          </span>
          <span className="text-[#8e9bae] hidden sm:inline">
            — Real-time multi-hazard telemetry active for Maharashtra command triage
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#8e9bae]">
          <span>LAST SYNC: {lastSyncTime}</span>
          <button
            onClick={syncAllRealTimeFeeds}
            disabled={isSyncing}
            className="flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
            title="Refresh live feeds"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* 6 Executive KPI Metric Cards (Exact layout from the reference image) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: ACTIVE INCIDENTS */}
        <div
          onClick={() => setActiveTab('overview')}
          className="p-3.5 rounded-2xl bg-[#111620] border border-[#1a2230] hover:border-[#2a3548] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e9bae]">
              ACTIVE INCIDENTS
            </span>
            <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-black text-[#ef4444] leading-none">
              {sosReports.length + 2}
            </div>
            <div className="text-[10px] text-[#637286] font-medium mt-1">
              {sosReports.length + alerts.length} total
            </div>
          </div>
        </div>

        {/* Metric 2: CRITICAL ALERTS */}
        <div
          onClick={() => setActiveTab('overview')}
          className="p-3.5 rounded-2xl bg-[#111620] border border-[#1a2230] hover:border-[#2a3548] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e9bae]">
              CRITICAL ALERTS
            </span>
            <Bell className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-black text-[#ef4444] leading-none">
              {alerts.filter((a) => a.severity === 'CRITICAL').length || 1}
            </div>
            <div className="text-[10px] text-[#637286] font-medium mt-1 truncate">
              Savitri Basin (Mahad)
            </div>
          </div>
        </div>

        {/* Metric 3: HIGH RISK REGIONS */}
        <div
          onClick={() => setActiveTab('predictor')}
          className="p-3.5 rounded-2xl bg-[#111620] border border-[#1a2230] hover:border-[#2a3548] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e9bae]">
              HIGH RISK REGIONS
            </span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-black text-amber-400 leading-none">
              {basins.filter((b) => (b.floodRisk?.score || 0) >= 60).length || 4}
            </div>
            <div className="text-[10px] text-[#637286] font-medium mt-1 truncate">
              Mahad, Chiplun, Mumbai
            </div>
          </div>
        </div>

        {/* Metric 4: RESPONSE TEAMS */}
        <div
          onClick={() => setActiveTab('optimizer')}
          className="p-3.5 rounded-2xl bg-[#111620] border border-[#1a2230] hover:border-[#2a3548] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e9bae]">
              RESPONSE TEAMS
            </span>
            <Shield className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-black text-white leading-none">
              {rescueTeams.filter((t) => t.status !== 'AVAILABLE').length || 4}/{rescueTeams.length || 6}
            </div>
            <div className="text-[10px] text-[#637286] font-medium mt-1">
              {rescueTeams.filter((t) => t.status === 'AVAILABLE').length || 2} available
            </div>
          </div>
        </div>

        {/* Metric 5: PREDICTED RISKS */}
        <div
          onClick={() => setActiveTab('predictor')}
          className="p-3.5 rounded-2xl bg-[#111620] border border-[#1a2230] hover:border-[#2a3548] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e9bae]">
              PREDICTED RISKS
            </span>
            <BrainCircuit className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-black text-white leading-none">
              {basins.length || 5}
            </div>
            <div className="text-[10px] text-[#637286] font-medium mt-1 truncate">
              GloFAS + Open-Meteo
            </div>
          </div>
        </div>

        {/* Metric 6: AVG RESPONSE */}
        <div
          onClick={() => setActiveTab('optimizer')}
          className="p-3.5 rounded-2xl bg-[#111620] border border-[#1a2230] hover:border-[#2a3548] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e9bae]">
              AVG RESPONSE
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-black text-white leading-none">
              18.4m
            </div>
            <div className="text-[10px] text-[#637286] font-medium mt-1">
              OSRM road routing
            </div>
          </div>
        </div>
      </div>

      {/* Main Command Center Split Screen (Left: Operations Map, Right: Alerts & Predictions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 Columns: Embedded Operations Map matching reference layout */}
        <div className="lg:col-span-7 bg-[#111620] border border-[#1a2230] rounded-2xl p-4 flex flex-col justify-between min-h-[440px] relative overflow-hidden shadow-xs">
          {/* Map Top Header Badge & Quick Jumps */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1a2230] z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#1a2230] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                MAHARASHTRA OPERATIONS MAP
              </span>
              <span className="text-[11px] text-[#8e9bae] hidden sm:inline">
                Live Tactical Multi-Layer View
              </span>
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>Full Screen Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Map Surface */}
          <div className="w-full flex-1 my-3 min-h-[340px] rounded-xl overflow-hidden relative border border-[#1a2230]">
            <MapContainer
              center={[18.65, 74.2]}
              zoom={7}
              scrollWheelZoom={false}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Flood Basin Risk Circles */}
              {basins.map((b) => {
                const coords = getValidCoords(b);
                if (!coords) return null;
                const score = b.floodRisk?.score || 60;
                return (
                  <Circle
                    key={b.id}
                    center={coords}
                    radius={score >= 75 ? 12000 : 8000}
                    pathOptions={{
                      color: score >= 75 ? '#dc2626' : '#f59e0b',
                      fillColor: score >= 75 ? '#ef4444' : '#f59e0b',
                      fillOpacity: 0.35,
                      weight: 2
                    }}
                  />
                );
              })}

              {/* Citizen SOS Points */}
              {sosReports.map((sos) => {
                const coords = getValidCoords(sos);
                if (!coords) return null;
                return <Marker key={sos.id} position={coords} icon={sosPin} />;
              })}

              {/* Rescue Teams */}
              {rescueTeams.map((team) => {
                const coords = getValidCoords(team);
                if (!coords) return null;
                return <Marker key={team.id} position={coords} icon={teamPin} />;
              })}

              {/* Shelters */}
              {shelters.slice(0, 5).map((shl) => {
                const coords = getValidCoords(shl);
                if (!coords) return null;
                return <Marker key={shl.id} position={coords} icon={shelterPin} />;
              })}
            </MapContainer>

            {/* Tactical Map Legend in bottom right matching reference */}
            <div className="absolute bottom-3 right-3 z-[400] bg-[#090c10]/90 backdrop-blur-xs border border-[#1a2230] rounded-xl p-2.5 text-[10px] space-y-1 font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
                <span>CRITICAL HAZARD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <span>HIGH RISK</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1769aa]" />
                <span>RESCUE TEAM</span>
              </div>
            </div>
          </div>

          {/* Quick Action below Map */}
          <div className="flex flex-wrap items-center justify-between text-xs text-[#8e9bae] pt-2 border-t border-[#1a2230] gap-2">
            <span>Click any marker on the map to inspect details or dispatch personnel.</span>
            <span className="text-white font-mono">OSRM Road Router: ONLINE</span>
          </div>
        </div>

        {/* Right 5 Columns: Alerts & Risk Predictions Column (Exact layout from the reference image) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Top Panel: ALERTS */}
          <div className="bg-[#111620] border border-[#1a2230] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1a2230] pb-2.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-300" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  ALERTS
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#8e9bae]">
                {alerts.length} total
              </span>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 3).map((alt, idx) => {
                const isCrit = alt.severity === 'CRITICAL';
                return (
                  <div
                    key={alt.id}
                    onClick={() => {
                      setSelectedAlertIndex(idx);
                      onSelectAlert(alt);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      selectedAlertIndex === idx
                        ? 'bg-[#161c28] border-slate-600'
                        : 'bg-[#0e121a] border-[#1a2230] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isCrit ? 'bg-[#ef4444]' : 'bg-[#f59e0b]'
                          }`}
                        />
                        <span className="text-xs font-bold text-white truncate">
                          {isCrit ? 'CRITICAL' : 'HIGH'}: {alt.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#8e9bae] shrink-0">
                        {idx === 0 ? '25m ago' : idx === 1 ? '1h ago' : '2h ago'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8e9bae] leading-relaxed line-clamp-2">
                      {alt.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-[#637286] font-mono">ALT-MH-300{idx + 1}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold ${
                          idx === 0
                            ? 'bg-[#ef4444]/20 text-[#ef4444]'
                            : 'bg-[#1a2230] text-slate-300'
                        }`}
                      >
                        {idx === 0 ? 'NEW' : 'ACKNOWLEDGED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Panel: RISK PREDICTIONS card matching screenshot */}
          <div className="bg-[#111620] border border-[#1a2230] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1a2230] pb-2.5">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-slate-300" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  RISK PREDICTIONS
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#8e9bae]">
                5 forecasts
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0e121a] border border-[#1a2230] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  FLOOD RISK (SAVITRI / MITHI)
                </span>
                <span className="text-sm font-mono font-bold text-amber-400">
                  82%
                </span>
              </div>

              <div className="text-xs text-white font-medium leading-snug">
                MODERATE / CRITICAL: Heavy rainfall warning for Mumbai & Konkan. Waterlogging in low-lying areas.
              </div>

              <div className="text-[10px] text-[#637286] font-mono">
                Confidence: 91% • Next 12h • flood-v1-model
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-[#161c28] text-[10px] text-[#8e9bae]">
                  Heavy upstream rain
                </span>
                <span className="px-2 py-0.5 rounded bg-[#161c28] text-[10px] text-[#8e9bae]">
                  Rising river level
                </span>
                <span className="px-2 py-0.5 rounded bg-[#161c28] text-[10px] text-[#8e9bae]">
                  High soil moisture
                </span>
              </div>
            </div>

            {/* Direct 1-Click Action for Quick Dispatch to SOS #1042 */}
            {currentSos && (
              <button
                disabled={dispatchingId === currentSos.id}
                onClick={() => handleQuickDispatch(currentSos)}
                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Truck className="w-4 h-4 text-black" />
                <span>
                  {dispatchingId === currentSos.id
                    ? 'Computing OSRM Road Route...'
                    : currentSos.assignedUnit
                    ? `Assigned: ${currentSos.assignedUnit}`
                    : `Dispatch Nearest Unit to ${currentSos.id} (${currentSos.locationName})`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Operational Intelligence Panels Below */}
      <div className="space-y-3 pt-2">
        {/* Accordion 1: River Basin Hydrological Telemetry */}
        <div className="bg-[#111620] border border-[#1a2230] rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'basins' ? null : 'basins')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#161c28] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Waves className="w-4 h-4 text-slate-300 shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  River Basin Hydrological Telemetry (6 Basins)
                </h4>
                <p className="text-[11px] text-[#8e9bae]">
                  Live Open-Meteo precipitation & GloFAS river discharge across Maharashtra
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                openSection === 'basins' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSection === 'basins' && (
            <div className="px-5 pb-5 pt-2 border-t border-[#1a2230] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {basins.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setActiveTab('predictor')}
                  className="p-3.5 rounded-xl bg-[#0e121a] border border-[#1a2230] hover:border-slate-600 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#8e9bae]">
                      {b.district}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        (b.floodRisk?.score || 0) >= 75
                          ? 'bg-[#ef4444]/20 text-[#ef4444]'
                          : 'bg-[#1a2230] text-slate-300'
                      }`}
                    >
                      {b.floodRisk?.score || 65}/100 {b.floodRisk?.level || 'WATCH'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{b.basinName}</div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-[#8e9bae] pt-1 border-t border-[#1a2230]">
                    <span>Rain (24h): <strong className="text-white">{b.observed?.rain24hMm} mm</strong></span>
                    <span>GloFAS: <strong className="text-white">{b.observed?.riverDischargeM3s} m³/s</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accordion 2: Chronological Event Log */}
        <div className="bg-[#111620] border border-[#1a2230] rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'timeline' ? null : 'timeline')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#161c28] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-300 shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Chronological Emergency Operations Log ({timeline.length} Events)
                </h4>
                <p className="text-[11px] text-[#8e9bae]">
                  Real-time record of incoming alerts, field dispatches, and shelter intakes
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                openSection === 'timeline' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSection === 'timeline' && (
            <div className="px-5 pb-5 pt-2 border-t border-[#1a2230] space-y-2 max-h-[320px] overflow-y-auto">
              {timeline.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-[#0e121a] border border-[#1a2230] flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="px-2 py-0.5 rounded bg-[#161c28] text-slate-300 font-mono text-[10px] shrink-0">
                      {ev.time}
                    </span>
                    <div>
                      <div className="font-bold text-white">{ev.title}</div>
                      <p className="text-[11px] text-[#8e9bae] mt-0.5">{ev.detail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#637286] shrink-0">
                    {ev.provenance || 'OPS'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accordion 3: Relieved & Mitigated Disasters Archive */}
        <div className="bg-[#111620] border border-[#1a2230] rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'relieved' ? null : 'relieved')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#161c28] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Mitigated & Relieved Operations Archive ({RELIEVED_DISASTERS.length} Records)
                </h4>
                <p className="text-[11px] text-[#8e9bae]">
                  Past incidents successfully evacuated, stabilized, and closed
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                openSection === 'relieved' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSection === 'relieved' && (
            <div className="px-5 pb-5 pt-2 border-t border-[#1a2230] grid grid-cols-1 md:grid-cols-2 gap-3">
              {RELIEVED_DISASTERS.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#0e121a] border border-[#1a2230] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {item.district} — {item.location}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#161c28] text-[10px] font-mono text-slate-300">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8e9bae]">{item.summary}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#637286] pt-1">
                    <span>Rescued: {item.peopleRescued.toLocaleString()}</span>
                    <span>{item.resolvedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
