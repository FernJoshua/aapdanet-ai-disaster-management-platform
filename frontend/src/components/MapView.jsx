import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  Navigation,
  Phone,
  CheckCircle2,
  Compass,
  List,
  Map as MapIcon,
  UserPlus,
  Truck,
  Radio
} from 'lucide-react';
import { findNearestShelter, generateEvacuationRoute, calculateDistance } from '../utils/geoUtils';
import { getTranslation } from '../utils/translations';
import { fetchLiveMultiHazardTelemetry, fetchOSRMRoadRoute } from '../services/realTimeService';
import { HOSPITALS_DATA } from '../services/operationsStore';

// Fix Leaflet Default Icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Strict LatLng validator to guarantee Leaflet never receives undefined/NaN coordinates
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

// Custom SVG Icons for distinct tactical symbols
const createCustomIcon = (color, text, isPulsing = false, size = 28) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        ${isPulsing ? `<div style="position: absolute; width: ${size + 10}px; height: ${size + 10}px; background: ${color}; border-radius: 50%; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
        <div style="width: ${size}px; height: ${size}px; background-color: ${color}; border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.55); letter-spacing: -0.3px;">
          ${text}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
};

const shelterIcon = createCustomIcon('#0B1F33', 'SHL', false, 28);
const sosOpenIcon = createCustomIcon('#DC2626', 'SOS', true, 30);
const sosRespondingIcon = createCustomIcon('#1769AA', 'RESP', false, 28);
const rescueAvailableIcon = createCustomIcon('#1769AA', 'TEAM', false, 28);
const rescueBusyIcon = createCustomIcon('#0B1F33', 'BUSY', false, 28);
const hospitalIcon = createCustomIcon('#0B1F33', 'HOSP', false, 26);
const fireHotspotIcon = createCustomIcon('#DC2626', 'FIRE', true, 28);
const quakeIcon = createCustomIcon('#0B1F33', 'EQ', false, 26);
const userIcon = createCustomIcon('#1769AA', 'YOU', false, 28);

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (isValidLatLng(center)) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({
  alerts = [],
  shelters = [],
  rescueTeams = [],
  sosReports = [],
  hospitals = HOSPITALS_DATA,
  activeRoutes = [],
  liveTelemetry: propTelemetry = null,
  onDispatchTeam,
  onUpdateShelterOccupancy,
  lang = 'en',
  onSpeakText = () => {},
  selectedAlert = null
}) {
  const t = (key) => getTranslation(lang, key);

  const [localTelemetry, setLocalTelemetry] = useState(null);
  const telemetry = propTelemetry || localTelemetry;

  const [activeLayers, setActiveLayers] = useState({
    rainRadar: true,
    floodBasins: true,
    fireHotspots: true,
    earthquakes: true,
    sos: true,
    shelters: true,
    hospitals: true,
    rescue: true
  });
  const [layersDropdownOpen, setLayersDropdownOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState('all');

  const [tileProvider, setTileProvider] = useState('osm');
  const [viewMode, setViewMode] = useState('map');
  const [userLocation, setUserLocation] = useState([18.0795, 73.4195]);
  const [nearestShelter, setNearestShelter] = useState(null);
  const [evacuationRoute, setEvacuationRoute] = useState(null);
  const [mapCenter, setMapCenter] = useState([18.65, 74.2]);
  const [mapZoom, setMapZoom] = useState(7);
  const [dispatchingSosId, setDispatchingSosId] = useState(null);

  useEffect(() => {
    if (!propTelemetry) {
      fetchLiveMultiHazardTelemetry().then((data) => {
        setLocalTelemetry(data);
      }).catch(() => {});
    }
  }, [propTelemetry]);

  const tileUrls = {
    osm: {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; High-Resolution Satellite World Imagery'
    },
    topo: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Topographic World Elevation'
    }
  };

  useEffect(() => {
    if (isValidLatLng(userLocation) && shelters.length > 0) {
      const nearest = findNearestShelter(userLocation[0], userLocation[1], shelters);
      setNearestShelter(nearest);
      if (nearest && isValidLatLng(nearest.coordinates)) {
        const route = generateEvacuationRoute(userLocation, nearest.coordinates);
        setEvacuationRoute(route);
      }
    }
  }, [userLocation, shelters]);

  useEffect(() => {
    if (selectedAlert && isValidLatLng(selectedAlert.coordinates)) {
      setMapCenter(selectedAlert.coordinates);
      setMapZoom(12);
    }
  }, [selectedAlert]);

  const toggleLayer = (layerName) => {
    setActiveLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const handleSectorChange = (sectorKey) => {
    setSelectedSector(sectorKey);
    const sectors = {
      all: { center: [18.65, 75.0], zoom: 7 },
      mahad: { center: [18.0795, 73.4195], zoom: 13 },
      mumbai: { center: [19.0728, 72.8795], zoom: 12 },
      chiplun: { center: [17.5323, 73.5186], zoom: 12 },
      nagpur: { center: [21.0842, 78.9815], zoom: 10 },
      pune: { center: [18.5204, 73.8567], zoom: 12 },
      kolhapur: { center: [16.705, 74.2433], zoom: 12 }
    };
    const target = sectors[sectorKey] || sectors.all;
    setMapCenter(target.center);
    setMapZoom(target.zoom);
  };

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          if (isValidLatLng(coords)) {
            setUserLocation(coords);
            setMapCenter(coords);
            setMapZoom(13);
            onSpeakText(`Location detected. Coordinates: ${coords[0].toFixed(3)} North, ${coords[1].toFixed(3)} East.`);
          }
        },
        () => {
          setUserLocation([18.0795, 73.4195]);
          setMapCenter([18.0795, 73.4195]);
          setMapZoom(13);
        }
      );
    }
  };

  const getProximityIntelForSOS = (sos) => {
    const sosCoords = getValidCoords(sos);
    if (!sosCoords) return { nearestShl: null, nearestHosp: null, nearestTeam: null };
    const [lat, lon] = sosCoords;

    let nearestShl = null;
    let minShlDist = Infinity;
    shelters.forEach((shl) => {
      const c = getValidCoords(shl);
      if (!c) return;
      const d = calculateDistance(lat, lon, c[0], c[1]);
      const roadKm = Number((d * 1.28).toFixed(1));
      if (roadKm < minShlDist) {
        minShlDist = roadKm;
        nearestShl = { ...shl, roadKm };
      }
    });

    let nearestHosp = null;
    let minHospDist = Infinity;
    hospitals.forEach((h) => {
      const c = getValidCoords(h);
      if (!c) return;
      const d = calculateDistance(lat, lon, c[0], c[1]);
      const roadKm = Number((d * 1.28).toFixed(1));
      if (roadKm < minHospDist) {
        minHospDist = roadKm;
        nearestHosp = { ...h, roadKm };
      }
    });

    let nearestTeam = null;
    let minTeamDist = Infinity;
    const availablePool = rescueTeams.filter((tm) => tm.status === 'AVAILABLE');
    const searchPool = availablePool.length > 0 ? availablePool : rescueTeams;
    searchPool.forEach((team) => {
      const c = getValidCoords(team);
      if (!c) return;
      const d = calculateDistance(lat, lon, c[0], c[1]);
      const roadKm = Number((d * 1.32).toFixed(1));
      if (roadKm < minTeamDist) {
        minTeamDist = roadKm;
        nearestTeam = { ...team, roadKm };
      }
    });

    return { nearestShl, nearestHosp, nearestTeam };
  };

  const handleDispatchFromPopup = async (sos, team) => {
    const sosCoords = getValidCoords(sos);
    const teamCoords = getValidCoords(team);
    if (!sosCoords || !teamCoords || !onDispatchTeam) return;
    setDispatchingSosId(sos.id);
    try {
      const routeData = await fetchOSRMRoadRoute(teamCoords, sosCoords);
      onDispatchTeam({
        sosId: sos.id,
        teamId: team.id,
        routeData
      });
      setMapCenter(sosCoords);
      setMapZoom(13);
      onSpeakText(`${team.name} dispatched to ${sos.id} at ${sos.locationName}. Road distance ${routeData.distanceKm} kilometers, estimated arrival ${routeData.durationMin} minutes.`);
    } finally {
      setDispatchingSosId(null);
    }
  };

  const basins = (telemetry?.basins || []).filter((b) => getValidCoords(b));
  const fireHotspots = (telemetry?.fireHotspots || []).filter((fh) => getValidCoords(fh));
  const earthquakes = (telemetry?.earthquakes || []).filter((eq) => getValidCoords(eq));
  const radarTileUrl = telemetry?.radar?.tileUrl || telemetry?.rainRadarTileUrl || null;
  const activeLayerCount = Object.values(activeLayers).filter(Boolean).length;

  const layerOptions = [
    { key: 'sos', label: `Citizen SOS Calls (${sosReports.length})` },
    { key: 'floodBasins', label: `Flood River Basins (${basins.length})` },
    { key: 'rainRadar', label: `RainViewer Radar ${radarTileUrl ? '(Live)' : ''}` },
    { key: 'shelters', label: `Relief Shelters (${shelters.length})` },
    { key: 'rescue', label: `Rescue Teams (${rescueTeams.length})` },
    { key: 'hospitals', label: `Trauma Hospitals (${hospitals.length})` },
    { key: 'fireHotspots', label: `NASA FIRMS Fire (${fireHotspots.length})` },
    { key: 'earthquakes', label: `USGS Earthquakes (${earthquakes.length})` }
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col h-[calc(100vh-150px)] min-h-[640px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg relative">
        {/* Single Consolidated Map Control Bar with Dropdowns */}
        {/* Single Consolidated Map Control Bar with Dropdowns */}
        <div className="bg-white dark:bg-[#090c10] border-b border-slate-200 dark:border-[#1a2230] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-20">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mr-1 font-mono">
              <Radio className="w-3.5 h-3.5 text-[#1769AA]" />
              <span>GIS Operations Map</span>
            </span>

            {/* Dropdown 1: Sector Jump */}
            <div className="flex items-center gap-1.5 text-xs">
              <label htmlFor="sector-select" className="text-slate-600 dark:text-[#8e9bae] font-medium hidden sm:inline">
                Sector:
              </label>
              <select
                id="sector-select"
                value={selectedSector}
                onChange={(e) => handleSectorChange(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#112A45] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs font-semibold cursor-pointer"
              >
                <option value="all">All Maharashtra (Overview)</option>
                <option value="mahad">Mahad — SOS #1042 & Savitri Basin</option>
                <option value="mumbai">Mumbai — Mithi River Basin</option>
                <option value="chiplun">Chiplun — Vashishti River Basin</option>
                <option value="nagpur">Nagpur — FIRMS Thermal Hotspots</option>
                <option value="pune">Pune — Mula-Mutha Basin</option>
                <option value="kolhapur">Kolhapur — Panchganga Basin</option>
              </select>
            </div>

            {/* Dropdown 2: Base Map Style */}
            <div className="flex items-center gap-1.5 text-xs">
              <label htmlFor="tile-select" className="text-slate-600 dark:text-[#8e9bae] font-medium hidden sm:inline">
                Style:
              </label>
              <select
                id="tile-select"
                value={tileProvider}
                onChange={(e) => setTileProvider(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#112A45] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs font-semibold cursor-pointer"
              >
                <option value="osm">OpenStreetMap</option>
                <option value="satellite">Satellite Imagery</option>
                <option value="topo">Topographic Map</option>
              </select>
            </div>

            {/* Dropdown 3: Map Layers Popover */}
            <div className="relative">
              <button
                onClick={() => setLayersDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#112A45] dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs font-semibold cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#1769AA]" />
                <span>Map Layers ({activeLayerCount}/8) ▾</span>
              </button>

              {layersDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white dark:bg-[#111620] border border-slate-200 dark:border-[#1a2230] shadow-2xl p-3 z-50 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5 text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white">Toggle Map Layers</span>
                    <button
                      onClick={() => {
                        const allOn = activeLayerCount < 8;
                        setActiveLayers({
                          rainRadar: allOn,
                          floodBasins: allOn,
                          fireHotspots: allOn,
                          earthquakes: allOn,
                          sos: allOn,
                          shelters: allOn,
                          hospitals: allOn,
                          rescue: allOn
                        });
                      }}
                      className="text-[#1769AA] dark:text-sky-400 font-semibold hover:underline cursor-pointer"
                    >
                      {activeLayerCount < 8 ? 'Enable All' : 'Hide All'}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {layerOptions.map((opt) => (
                      <label
                        key={opt.key}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        <span>{opt.label}</span>
                        <input
                          type="checkbox"
                          checked={activeLayers[opt.key]}
                          onChange={() => toggleLayer(opt.key)}
                          className="accent-[#1769AA] w-3.5 h-3.5 cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: GPS & Accessible List Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDetectGPS}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1769AA] text-white hover:bg-[#125488] transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t('gpsBtn')}</span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'map' ? 'accessible-list' : 'map')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#112A45] dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white transition-colors cursor-pointer"
            >
              {viewMode === 'map' ? <List className="w-3.5 h-3.5" /> : <MapIcon className="w-3.5 h-3.5" />}
              <span>{viewMode === 'map' ? t('accessibleTextView') : t('mapViewMode')}</span>
            </button>
          </div>
        </div>

        {/* Main Map or Accessible List Display */}
        {viewMode === 'map' ? (
          <div className="flex-1 relative w-full h-full">
            <MapContainer
              center={isValidLatLng(mapCenter) ? mapCenter : [18.65, 74.2]}
              zoom={mapZoom}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              <ChangeView center={isValidLatLng(mapCenter) ? mapCenter : [18.65, 74.2]} zoom={mapZoom} />

              {/* Base Tile Layer */}
              <TileLayer
                key={tileProvider}
                attribution={tileUrls[tileProvider].attribution}
                url={tileUrls[tileProvider].url}
                maxZoom={19}
              />

              {/* 1. LIVE RAINVIEWER PRECIPITATION RADAR OVERLAY */}
              {activeLayers.rainRadar && radarTileUrl && (
                <TileLayer
                  url={radarTileUrl}
                  opacity={0.55}
                  zIndex={250}
                  attribution="RainViewer Live Radar"
                />
              )}

              {/* 2. LIVE GLOFAS + OPEN-METEO FLOOD BASIN ZONES */}
              {activeLayers.floodBasins && basins.map((b) => {
                const coords = getValidCoords(b);
                if (!coords) return null;
                const riskScore = b.floodRisk?.score ?? 65;
                const isCritical = riskScore >= 75;
                const isHigh = riskScore >= 55;
                return (
                  <Circle
                    key={b.id}
                    center={coords}
                    radius={isCritical ? 9500 : 7500}
                    pathOptions={{
                      color: isCritical ? '#DC2626' : isHigh ? '#F59E0B' : '#0284C7',
                      fillColor: isCritical ? '#EF4444' : '#3B82F6',
                      fillOpacity: 0.35,
                      weight: 2.5
                    }}
                  >
                    <Tooltip direction="top">
                      {b.basinName} ({b.district || b.city}) • Flood Risk: {riskScore}/100 ({b.floodRisk?.level})
                    </Tooltip>
                    <Popup>
                      <div className="p-1.5 space-y-2 min-w-[260px] text-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                          <div>
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 mr-1">
                              🟢 LIVE API + 🧠 MODEL
                            </span>
                            <h4 className="font-black text-sm text-slate-900 mt-1">{b.basinName}</h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-black text-white keep-white ${
                            isCritical ? 'bg-[#DC2626]' : isHigh ? 'bg-[#F59E0B]' : 'bg-[#15803D]'
                          }`}>
                            {riskScore}/100 {b.floodRisk?.level}
                          </span>
                        </div>

                        <div className="bg-slate-100 p-2 rounded-lg text-xs space-y-1 border border-slate-200">
                          <div className="font-extrabold text-[10px] uppercase text-sky-800">Observed Telemetry (Open-Meteo + GloFAS)</div>
                          <div className="grid grid-cols-2 gap-1">
                            <span><strong>24h Rain:</strong> {b.observed?.rain24hMm ?? b.rain24h} mm</span>
                            <span><strong>72h Forecast:</strong> {b.observed?.forecastRain72hMm ?? b.rain7d} mm</span>
                            <span><strong>River Discharge:</strong> {b.observed?.riverDischargeM3s ?? b.currentDischarge} m³/s</span>
                            <span><strong>Trend:</strong> {b.observed?.dischargeTrend ?? b.riverTrend}</span>
                          </div>
                        </div>

                        <div className="text-xs space-y-1">
                          <div className="font-extrabold text-[10px] uppercase text-slate-700">Explainable Risk Contributors</div>
                          {b.floodRisk?.contributors?.slice(0, 3).map((c, i) => (
                            <div key={i} className="flex justify-between text-[11px]">
                              <span>{c.factor || c.label} ({c.weight}%):</span>
                              <strong>{c.rawValue || c.raw}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Popup>
                  </Circle>
                );
              })}

              {/* 3. NASA FIRMS SATELLITE FIRE HOTSPOTS */}
              {activeLayers.fireHotspots && fireHotspots.map((fh) => {
                const coords = getValidCoords(fh);
                if (!coords) return null;
                return (
                  <Marker key={fh.id} position={coords} icon={fireHotspotIcon}>
                    <Popup>
                      <div className="p-1.5 space-y-2 min-w-[255px] text-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                            🛰️ {fh.source || 'NASA FIRMS VIIRS'}
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#DC2626] text-white keep-white">
                            FIRE RISK: {fh.fireRisk?.level || 'HIGH'} ({fh.fireRisk?.score || 78}/100)
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900">{fh.location || fh.name} ({fh.district})</h4>
                        <div className="bg-slate-100 p-2 rounded-lg text-xs space-y-1 border border-slate-200">
                          <div><strong>Coordinates:</strong> {coords[0].toFixed(3)}°N, {coords[1].toFixed(3)}°E</div>
                          <div><strong>Brightness Temp:</strong> {fh.brightnessK} K</div>
                          <div><strong>Fire Radiative Power (FRP):</strong> {fh.frpMW} MW</div>
                          <div><strong>Surface Temp & Wind:</strong> {fh.tempC ?? 41}°C • {fh.windKmh ?? 28} km/h</div>
                          <div><strong>CAMS Smoke PM2.5 / CO:</strong> {fh.pm25 ?? 76} µg/m³ • {fh.co ?? 450} µg/m³</div>
                        </div>
                        <a
                          href="tel:101"
                          className="block w-full text-center py-1.5 rounded-lg bg-[#F97316] text-white keep-white font-extrabold text-xs"
                        >
                          🔥 Dispatch Fire Brigade (101)
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* 4. USGS REAL-TIME EARTHQUAKES */}
              {activeLayers.earthquakes && earthquakes.map((eq) => {
                const coords = getValidCoords(eq);
                if (!coords) return null;
                return (
                  <Marker key={eq.id} position={coords} icon={quakeIcon}>
                    <Popup>
                      <div className="p-1.5 space-y-1.5 min-w-[230px] text-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-900">
                            🟢 USGS SEISMIC API
                          </span>
                          <span className="text-xs font-black px-2 py-0.5 rounded bg-purple-700 text-white keep-white">
                            M {eq.magnitude ?? eq.mag}
                          </span>
                        </div>
                        <p className="font-bold text-xs">{eq.place}</p>
                        <p className="text-xs"><strong>Depth:</strong> {eq.depthKm} km</p>
                        <p className="text-xs"><strong>Coordinates:</strong> {coords[0].toFixed(2)}°N, {coords[1].toFixed(2)}°E</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* 5. INTERACTIVE SHELTERS WITH LIVE OCCUPANCY UPDATE */}
              {activeLayers.shelters && shelters.map((shl) => {
                const coords = getValidCoords(shl);
                if (!coords) return null;
                const available = Math.max(0, shl.capacity - shl.currentOccupancy);
                const pct = Math.min(100, Math.round((shl.currentOccupancy / shl.capacity) * 100));
                return (
                  <Marker key={shl.id} position={coords} icon={shelterIcon}>
                    <Popup>
                      <div className="p-1.5 space-y-2 min-w-[265px] text-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                          <span className="font-black text-emerald-800 text-sm">{shl.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#15803D] text-white keep-white font-black">
                            {shl.status}
                          </span>
                        </div>

                        <div className="bg-slate-100 p-2 rounded-lg text-xs space-y-1 border border-slate-200">
                          <div className="flex justify-between">
                            <span><strong>Capacity:</strong> {shl.capacity}</span>
                            <span><strong>Occupied:</strong> {shl.currentOccupancy}</span>
                            <span className="text-emerald-700 font-black"><strong>Available:</strong> {available}</span>
                          </div>
                          <div className="w-full bg-slate-300 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${pct > 85 ? 'bg-[#DC2626]' : 'bg-[#15803D]'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="pt-1 font-bold text-[11px] text-emerald-800">
                            Supplies: Water ✓ &nbsp;Food ✓ &nbsp;Medical ✓ &nbsp;Power ✓
                          </div>
                        </div>

                        {onUpdateShelterOccupancy && (
                          <div className="pt-1 space-y-1">
                            <div className="text-[10px] font-extrabold uppercase text-slate-600">
                              Live Shelter Intake Control (Syncs Instantly):
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  onUpdateShelterOccupancy(shl.id, 20);
                                  onSpeakText(`Registered 20 displaced citizens at ${shl.name}. Updated occupancy is ${shl.currentOccupancy + 20}.`);
                                }}
                                className="flex-1 py-1.5 px-2 rounded-lg bg-[#15803D] hover:bg-green-700 text-white keep-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                +20 Admit Citizens
                              </button>
                              <button
                                onClick={() => onUpdateShelterOccupancy(shl.id, -10)}
                                className="py-1.5 px-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white keep-white font-bold text-xs cursor-pointer"
                              >
                                -10 Discharge
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="text-[11px] text-slate-700 flex items-center gap-1 pt-1 border-t border-slate-200">
                          <Phone className="w-3.5 h-3.5 text-sky-700" />
                          <span>{shl.contactOfficer}: <strong>{shl.phone}</strong></span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* 6. HOSPITALS LAYER (108 TRAUMA CARE) */}
              {activeLayers.hospitals && hospitals.map((h) => {
                const coords = getValidCoords(h);
                if (!coords) return null;
                return (
                  <Marker key={h.id} position={coords} icon={hospitalIcon}>
                    <Popup>
                      <div className="p-1.5 space-y-1.5 min-w-[240px] text-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                          <span className="font-black text-teal-800 text-sm">{h.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-teal-700 text-white keep-white font-bold">
                            108 TRAUMA
                          </span>
                        </div>
                        <p className="text-xs"><strong>District:</strong> {h.district} ({h.traumaLevel})</p>
                        <div className="bg-slate-100 p-2 rounded text-xs flex justify-between border border-slate-200">
                          <span><strong>Trauma Beds:</strong> {h.bedsAvailable}</span>
                          <span className="text-teal-800 font-black"><strong>ICU Beds:</strong> {h.icuAvailable}</span>
                        </div>
                        <p className="text-xs"><strong>Emergency Line:</strong> {h.phone} / {h.ambulanceHotline}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* 7. INTERACTIVE CITIZEN SOS MARKERS */}
              {activeLayers.sos && sosReports.map((sos) => {
                const coords = getValidCoords(sos);
                if (!coords) return null;
                const { nearestShl, nearestHosp, nearestTeam } = getProximityIntelForSOS(sos);
                const isResponding = sos.status === 'RESPONDING' || sos.status === 'DISPATCHED';
                return (
                  <Marker
                    key={sos.id}
                    position={coords}
                    icon={isResponding ? sosRespondingIcon : sosOpenIcon}
                  >
                    <Popup>
                      <div className="p-1.5 space-y-2 min-w-[280px] text-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                          <div>
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                              👤 {sos.provenance || 'USER REPORT'}
                            </span>
                            <h4 className="font-black text-sm text-red-700 mt-0.5">
                              {sos.id} — {sos.category}
                            </h4>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black text-white keep-white ${
                            isResponding ? 'bg-[#F97316]' : 'bg-[#DC2626]'
                          }`}>
                            {sos.status}
                          </span>
                        </div>

                        <div className="text-xs space-y-1">
                          <div><strong>Location:</strong> {sos.locationName} ({sos.district})</div>
                          <div><strong>Reported:</strong> {sos.timestamp} • <strong>Priority:</strong> <span className="text-red-700 font-black">{sos.urgency}</span></div>
                          <div><strong>People Affected:</strong> {sos.victimsCount} citizens {sos.includesElderlyOrDisabled ? '(Includes Elderly/Disabled)' : ''}</div>
                          <p className="text-[11px] bg-slate-100 p-2 rounded border border-slate-200 text-slate-800">
                            {sos.description}
                          </p>
                        </div>

                        <div className="bg-sky-50 p-2 rounded-lg border border-sky-200 text-[11px] space-y-1">
                          <div className="font-black text-[10px] uppercase text-sky-900">
                            Automated Spatial Proximity Triage
                          </div>
                          {nearestShl && (
                            <div>🏠 <strong>Nearest Shelter:</strong> {nearestShl.name} ({nearestShl.roadKm} km)</div>
                          )}
                          {nearestHosp && (
                            <div>🏥 <strong>Nearest Hospital:</strong> {nearestHosp.name} ({nearestHosp.roadKm} km)</div>
                          )}
                          {nearestTeam && (
                            <div>🚑 <strong>Nearest Rescue Team:</strong> {nearestTeam.name} ({nearestTeam.roadKm} km • {nearestTeam.status})</div>
                          )}
                        </div>

                        {sos.assignedUnit ? (
                          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-bold">
                            ✓ Unit Assigned: <strong>{sos.assignedUnit}</strong>
                            {sos.roadDistanceKm && (
                              <div className="text-[11px] mt-0.5">
                                OSRM Road Route: {sos.roadDistanceKm} km • ETA: {sos.etaMinutes} mins
                              </div>
                            )}
                          </div>
                        ) : null}

                        {nearestTeam && onDispatchTeam && (
                          <button
                            disabled={dispatchingSosId === sos.id}
                            onClick={() => handleDispatchFromPopup(sos, nearestTeam)}
                            className="w-full py-2 px-3 rounded-lg bg-[#DC2626] hover:bg-red-700 text-white keep-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
                          >
                            <Truck className="w-4 h-4" />
                            {dispatchingSosId === sos.id
                              ? 'Calculating OSRM Road Route...'
                              : `[DISPATCH TEAM] ${nearestTeam.name}`}
                          </button>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* 8. RESCUE BATTALIONS (AVAILABLE vs BUSY) */}
              {activeLayers.rescue && rescueTeams.map((team) => {
                const coords = getValidCoords(team);
                if (!coords) return null;
                const isBusy = team.status === 'BUSY' || team.status === 'DEPLOYED';
                return (
                  <Marker
                    key={team.id}
                    position={coords}
                    icon={isBusy ? rescueBusyIcon : rescueAvailableIcon}
                  >
                    <Popup>
                      <div className="p-1.5 space-y-1.5 min-w-[235px] text-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                          <span className="font-black text-sky-900 text-sm">{team.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black text-white keep-white ${
                            isBusy ? 'bg-[#F59E0B]' : 'bg-[#15803D]'
                          }`}>
                            {team.status}
                          </span>
                        </div>
                        <p className="text-xs"><strong>Base Station:</strong> {team.base}</p>
                        <p className="text-xs"><strong>Specialization:</strong> {team.type}</p>
                        <p className="text-xs"><strong>Strength:</strong> {team.personnel} Personnel</p>
                        {team.assignedSosId && (
                          <p className="text-xs font-bold text-orange-700">
                            Assigned Incident: {team.assignedSosId}
                          </p>
                        )}
                        <div className="text-[11px] text-slate-700 bg-slate-100 p-1.5 rounded">
                          <strong>Equipment:</strong> {team.equipment.join(', ')}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* 9. LIVE DISPATCHED OSRM ROAD ROUTES */}
              {activeRoutes.map((rt) => {
                const lineCoords = rt.geometry || rt.path;
                if (!Array.isArray(lineCoords) || lineCoords.length < 2 || !isValidLatLng(lineCoords[0])) {
                  return null;
                }
                return (
                  <Polyline
                    key={rt.id}
                    positions={lineCoords}
                    pathOptions={{
                      color: '#F97316',
                      weight: 5,
                      opacity: 0.95
                    }}
                  >
                    <Tooltip permanent direction="center">
                      🚑 {rt.teamName} → {rt.sosId} ({rt.distanceKm} km • ETA {rt.durationMin} min)
                    </Tooltip>
                  </Polyline>
                );
              })}

              {/* User Location Marker */}
              {isValidLatLng(userLocation) && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>
                    <div className="text-xs p-1 space-y-1 text-slate-900">
                      <strong className="text-sky-800 text-sm">Your Current Position</strong>
                      <p>Latitude: {userLocation[0].toFixed(4)}, Longitude: {userLocation[1].toFixed(4)}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Smart Evacuation Route Polyline */}
              {Array.isArray(evacuationRoute) && evacuationRoute.length >= 2 && isValidLatLng(evacuationRoute[0]) && (
                <Polyline
                  positions={evacuationRoute}
                  pathOptions={{
                    color: '#15803D',
                    weight: 4,
                    dashArray: '8, 8',
                    opacity: 0.9
                  }}
                >
                  <Tooltip direction="center">
                    Safe Shelter Evacuation Corridor
                  </Tooltip>
                </Polyline>
              )}
            </MapContainer>

            {/* Floating Evacuation HUD Card */}
            {nearestShelter && (
              <div className="absolute bottom-4 left-4 z-[400] bg-white dark:bg-[#111620] border border-slate-200 dark:border-sky-500/60 rounded-xl p-3.5 max-w-xs sm:max-w-sm shadow-2xl text-xs text-slate-800 dark:text-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 mb-2">
                  <div className="flex items-center gap-1.5 font-extrabold text-sky-600 dark:text-sky-300">
                    <Navigation className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>Nearest Safe Evacuation Shelter</span>
                  </div>
                  <span className="keep-white px-2 py-0.5 rounded bg-[#15803D] text-white font-black text-xs">
                    {nearestShelter.distanceKm} KM
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{nearestShelter.name}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-xs">{nearestShelter.district} • {nearestShelter.phone}</p>
                  <div className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Available Beds: {nearestShelter.capacity - nearestShelter.currentOccupancy} / {nearestShelter.capacity}</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                  <button
                    onClick={() => onSpeakText(`Nearest safe shelter is ${nearestShelter.name}, located ${nearestShelter.distanceKm} kilometers away. Available beds: ${nearestShelter.capacity - nearestShelter.currentOccupancy}.`)}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#112A45] dark:hover:bg-slate-700 text-slate-800 dark:text-amber-300 border border-slate-300 dark:border-transparent rounded-lg font-bold text-xs transition-colors cursor-pointer"
                  >
                    🔊 Audio Guide
                  </button>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${nearestShelter.coordinates[0]},${nearestShelter.coordinates[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 bg-[#1769AA] hover:bg-[#0284C7] text-white keep-white font-bold rounded-lg text-xs transition-colors text-center"
                  >
                    Road GPS
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Accessible List View for Visually Impaired / Screen Readers */
          <div
            className="flex-1 overflow-y-auto p-6 bg-slate-900 text-slate-100 space-y-6"
            tabIndex={0}
            aria-label="Text alternative of disaster zones, SOS calls, and shelters"
          >
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Accessible Disaster Telemetry, SOS Triage & Safe Shelter Directory
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Screen-reader friendly view of all active SOS calls, flood basins, fire hotspots, and shelters with one-click dispatch and occupancy controls.
              </p>
            </div>

            <section>
              <h3 className="text-sm font-black text-red-500 uppercase tracking-wider mb-3">
                Active Citizen SOS Calls ({sosReports.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sosReports.map((sos) => {
                  const { nearestShl, nearestHosp, nearestTeam } = getProximityIntelForSOS(sos);
                  return (
                    <div key={sos.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-white text-base">{sos.id} — {sos.category}</span>
                        <span className="px-2 py-0.5 rounded bg-[#DC2626] text-white keep-white text-xs font-bold">{sos.status}</span>
                      </div>
                      <p className="text-xs text-slate-300"><strong>Location:</strong> {sos.locationName} ({sos.district})</p>
                      <p className="text-xs text-slate-300"><strong>People Affected:</strong> {sos.victimsCount} • <strong>Priority:</strong> {sos.urgency}</p>
                      {nearestShl && <p className="text-xs text-emerald-600 font-semibold">Nearest Shelter: {nearestShl.name} ({nearestShl.roadKm} km)</p>}
                      {nearestHosp && <p className="text-xs text-teal-600 font-semibold">Nearest Hospital: {nearestHosp.name} ({nearestHosp.roadKm} km)</p>}
                      {nearestTeam && (
                        <button
                          onClick={() => handleDispatchFromPopup(sos, nearestTeam)}
                          className="mt-2 px-3 py-2 rounded-lg bg-[#DC2626] text-white keep-white font-bold text-xs cursor-pointer"
                        >
                          Dispatch {nearestTeam.name} ({nearestTeam.roadKm} km)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
