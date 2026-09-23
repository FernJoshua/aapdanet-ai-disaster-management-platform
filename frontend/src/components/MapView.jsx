import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  Navigation, 
  Home, 
  ShieldAlert, 
  Users, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  Compass,
  List,
  Map as MapIcon,
  Maximize2,
  Info
} from 'lucide-react';
import { findNearestShelter, generateEvacuationRoute, calculateDistance } from '../utils/geoUtils';
import { getTranslation } from '../utils/translations';

// Fix Leaflet Default Icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG Icons for distinct tactical symbols
const createCustomIcon = (color, text, isPulsing = false) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        ${isPulsing ? `<div style="position: absolute; width: 34px; height: 34px; background: ${color}; border-radius: 50%; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
        <div style="width: 26px; height: 26px; background-color: ${color}; border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);">
          ${text}
        </div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
};

const shelterIcon = createCustomIcon('#10b981', 'S');
const sosIcon = createCustomIcon('#ef4444', 'SOS', true);
const rescueIcon = createCustomIcon('#06b6d4', 'R');
const userIcon = createCustomIcon('#f59e0b', 'YOU', true);

// Component to dynamically pan/zoom map when target changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ 
  alerts, 
  shelters, 
  rescueTeams, 
  sosReports, 
  lang,
  onSpeakText,
  selectedAlert
}) {
  const t = (key) => getTranslation(lang, key);

  const [activeLayers, setActiveLayers] = useState({
    flood: true,
    landslide: true,
    earthquake: true,
    shelters: true,
    sos: true,
    rescue: true
  });

  // Zero-Key Free Tile Provider Options (Dark tactical completely removed!)
  const [tileProvider, setTileProvider] = useState('osm'); // 'osm', 'satellite', 'topo'
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'accessible-list'
  const [userLocation, setUserLocation] = useState([19.0728, 72.8795]); // Mithi River, Kurla
  const [nearestShelter, setNearestShelter] = useState(null);
  const [evacuationRoute, setEvacuationRoute] = useState(null);
  const [mapCenter, setMapCenter] = useState([19.0760, 72.8777]);
  const [mapZoom, setMapZoom] = useState(11);

  const tileUrls = {
    osm: {
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; High-Resolution Satellite World Imagery'
    },
    topo: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Topographic World Elevation'
    }
  };

  // Auto-recalculate nearest shelter when location changes
  useEffect(() => {
    if (userLocation && shelters.length > 0) {
      const nearest = findNearestShelter(userLocation[0], userLocation[1], shelters);
      setNearestShelter(nearest);
      if (nearest) {
        const route = generateEvacuationRoute(userLocation, nearest.coordinates);
        setEvacuationRoute(route);
      }
    }
  }, [userLocation, shelters]);

  // Center on alert if selected from banner
  useEffect(() => {
    if (selectedAlert && selectedAlert.coordinates) {
      setMapCenter(selectedAlert.coordinates);
      setMapZoom(13);
    }
  }, [selectedAlert]);

  const toggleLayer = (layerName) => {
    setActiveLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  // User GPS detect
  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          setMapCenter(coords);
          setMapZoom(13);
          onSpeakText(`Location detected. Coordinates: ${coords[0].toFixed(3)} North, ${coords[1].toFixed(3)} East.`);
        },
        () => {
          setUserLocation([19.0600, 72.8800]);
          setMapCenter([19.0600, 72.8800]);
        }
      );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[620px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* Map Control Toolbar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'accessible-list' : 'map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'accessible-list'
                ? 'bg-yellow-400 text-black border-2 border-yellow-200'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="Alternative accessible text list of all map locations for screen readers"
          >
            {viewMode === 'map' ? <List className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
            <span>{viewMode === 'map' ? t('accessibleTextView') : t('mapViewMode')}</span>
          </button>

          <button
            onClick={handleDetectGPS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 hover:bg-cyan-900 transition-colors"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>{t('gpsBtn')}</span>
          </button>

          {/* Clean 100% Free Map Layer Picker (Dark tactical removed!) */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setTileProvider('osm')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${tileProvider === 'osm' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white'}`}
              title="OpenStreetMap Standard Layer (100% Free, Zero Key)"
            >
              OpenStreetMap
            </button>
            <button
              onClick={() => setTileProvider('satellite')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${tileProvider === 'satellite' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white'}`}
              title="Esri High-Resolution Satellite Imagery"
            >
              Satellite Aerial
            </button>
            <button
              onClick={() => setTileProvider('topo')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${tileProvider === 'topo' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white'}`}
              title="Topographic Elevation Map"
            >
              Topographic
            </button>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-xs font-semibold flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5" />
            Layers:
          </span>

          <button
            onClick={() => toggleLayer('flood')}
            className={`px-2.5 py-1 rounded text-xs font-bold border ${
              activeLayers.flood
                ? 'bg-blue-600/30 text-blue-300 border-blue-500'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            🌊 Flood Zones
          </button>

          <button
            onClick={() => toggleLayer('landslide')}
            className={`px-2.5 py-1 rounded text-xs font-bold border ${
              activeLayers.landslide
                ? 'bg-amber-600/30 text-amber-300 border-amber-500'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            ⛰️ Landslide
          </button>

          <button
            onClick={() => toggleLayer('shelters')}
            className={`px-2.5 py-1 rounded text-xs font-bold border ${
              activeLayers.shelters
                ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            🏠 Shelters
          </button>

          <button
            onClick={() => toggleLayer('sos')}
            className={`px-2.5 py-1 rounded text-xs font-bold border ${
              activeLayers.sos
                ? 'bg-red-600/30 text-red-300 border-red-500 animate-pulse'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            🚨 SOS Calls
          </button>

          <button
            onClick={() => toggleLayer('rescue')}
            className={`px-2.5 py-1 rounded text-xs font-bold border ${
              activeLayers.rescue
                ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            🚑 Rescue Teams
          </button>
        </div>
      </div>

      {/* Free Zero-Key Status Indicator */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 text-xs flex justify-between items-center text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Active Map Layer: <strong>{tileProvider === 'osm' ? 'OpenStreetMap Global' : tileProvider === 'satellite' ? 'Esri High-Resolution Satellite' : 'Esri Topographic'}</strong> (100% Free and Unmetered — No API Key Required)
        </span>
        <span className="hidden sm:inline text-slate-400">
          Click any shelter or SOS marker on the map to view complete details
        </span>
      </div>

      {/* Main Map or Accessible List Display */}
      {viewMode === 'map' ? (
        <div className="flex-1 relative w-full h-full">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />

            {/* Selected Zero-Key Tile Layer */}
            <TileLayer
              key={tileProvider}
              attribution={tileUrls[tileProvider].attribution}
              url={tileUrls[tileProvider].url}
              maxZoom={19}
            />

            {/* Simulated Flood Inundation Polygons / Circles */}
            {activeLayers.flood && (
              <>
                {/* Mithi River Inundation Zone */}
                <Circle
                  center={[19.0728, 72.8795]}
                  radius={1800}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.45,
                    weight: 2
                  }}
                >
                  <Tooltip permanent direction="top">
                    Mithi Basin Danger Inundation Zone
                  </Tooltip>
                </Circle>

                {/* Chiplun Vashishti River Basin */}
                <Circle
                  center={[17.5323, 73.5186]}
                  radius={3200}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#2563eb',
                    fillOpacity: 0.4,
                    weight: 2
                  }}
                >
                  <Tooltip permanent direction="top">
                    Vashishti River Flash Inundation Zone
                  </Tooltip>
                </Circle>

                {/* Panchganga River Kolhapur */}
                <Circle
                  center={[16.7050, 74.2433]}
                  radius={2500}
                  pathOptions={{
                    color: '#f59e0b',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.35,
                    weight: 2
                  }}
                >
                  <Tooltip direction="top">
                    Panchganga Warning Flood Level
                  </Tooltip>
                </Circle>
              </>
            )}

            {/* Landslide Hazard Zones */}
            {activeLayers.landslide && (
              <>
                <Circle
                  center={[18.0827, 73.4188]}
                  radius={2800}
                  pathOptions={{
                    color: '#b45309',
                    fillColor: '#d97706',
                    fillOpacity: 0.45,
                    weight: 2,
                    dashArray: '5, 5'
                  }}
                >
                  <Tooltip direction="top">
                    Mahad-Poladpur Slope Instability Corridor
                  </Tooltip>
                </Circle>
              </>
            )}

            {/* Relief Shelters Markers */}
            {activeLayers.shelters && shelters.map((shl) => (
              <Marker key={shl.id} position={shl.coordinates} icon={shelterIcon}>
                <Popup>
                  <div className="p-1 space-y-2 min-w-[240px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                      <span className="font-bold text-emerald-400 text-sm">{shl.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                        {shl.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      <strong>District:</strong> {shl.district}
                    </p>
                    <div className="text-xs">
                      <strong>Occupancy:</strong> {shl.currentOccupancy} of {shl.capacity} persons accommodated
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-1.5 rounded-full" 
                          style={{ width: `${(shl.currentOccupancy / shl.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Facilities:</strong> {shl.facilities.join(', ')}
                    </div>
                    {shl.isAccessible && (
                      <span className="inline-block px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 text-xs font-bold">
                        Differently-Abled Accessible
                      </span>
                    )}
                    <div className="text-xs text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-800">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{shl.contactOfficer}: {shl.phone}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Active Citizen SOS Markers */}
            {activeLayers.sos && sosReports.map((sos) => (
              <Marker key={sos.id} position={sos.coordinates} icon={sosIcon}>
                <Popup>
                  <div className="p-1 space-y-2 min-w-[240px]">
                    <div className="flex items-center justify-between border-b border-red-900/60 pb-1">
                      <span className="font-bold text-red-400 text-sm">{sos.category}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold animate-pulse">
                        {sos.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      <strong>Caller:</strong> {sos.name} ({sos.phone})
                    </p>
                    <p className="text-xs text-slate-300">
                      <strong>Victims in Danger:</strong> {sos.victimsCount} individuals {sos.includesElderlyOrDisabled ? '(Accompanied by Elderly or Disabled persons)' : ''}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-2 rounded border border-slate-800">
                      {sos.description}
                    </p>
                    <div className="text-xs text-amber-300 pt-1 border-t border-slate-800">
                      Current Status: <strong>{sos.status}</strong> — Unit: {sos.assignedUnit}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Rescue Battalions */}
            {activeLayers.rescue && rescueTeams.map((team) => (
              <Marker key={team.id} position={team.coordinates} icon={rescueIcon}>
                <Popup>
                  <div className="p-1 space-y-1.5 min-w-[220px]">
                    <span className="font-bold text-cyan-400 text-sm">{team.name}</span>
                    <p className="text-xs text-slate-300"><strong>Base Station:</strong> {team.base}</p>
                    <p className="text-xs text-slate-300"><strong>Specialization:</strong> {team.type}</p>
                    <p className="text-xs text-slate-300"><strong>Force Strength:</strong> {team.personnel} Personnel</p>
                    <div className="text-xs text-cyan-300">
                      Equipment: {team.equipment.join(', ')}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* User Location Marker */}
            {userLocation && (
              <Marker position={userLocation} icon={userIcon}>
                <Popup>
                  <div className="text-xs p-1 space-y-1">
                    <strong className="text-amber-400 text-sm">Your Current Position</strong>
                    <p className="text-slate-300">Latitude: {userLocation[0].toFixed(4)}, Longitude: {userLocation[1].toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Smart Evacuation Route Polyline */}
            {evacuationRoute && (
              <Polyline
                positions={evacuationRoute}
                pathOptions={{
                  color: '#10b981',
                  weight: 4,
                  dashArray: '8, 8',
                  opacity: 0.9
                }}
              >
                <Tooltip permanent direction="center">
                  Recommended Safe Evacuation Route
                </Tooltip>
              </Polyline>
            )}
          </MapContainer>

          {/* Floating Evacuation HUD Card */}
          {nearestShelter && (
            <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/95 border border-cyan-800/80 rounded-xl p-4 max-w-sm backdrop-blur-md shadow-2xl text-xs text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
                <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>Nearest Safe Evacuation Shelter</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-extrabold text-xs">
                  {nearestShelter.distanceKm} KM
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-white text-sm">{nearestShelter.name}</p>
                <p className="text-slate-400 text-xs">{nearestShelter.district} • Contact: {nearestShelter.phone}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Available Capacity: {nearestShelter.capacity - nearestShelter.currentOccupancy} seats remaining</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => onSpeakText(`Nearest safe shelter is ${nearestShelter.name}, located ${nearestShelter.distanceKm} kilometers away. Available slots: ${nearestShelter.capacity - nearestShelter.currentOccupancy}. Emergency phone: ${nearestShelter.phone}. Proceed along green designated corridor.`)}
                  className="flex-1 py-2 px-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <span>Listen Directions</span>
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${nearestShelter.coordinates[0]},${nearestShelter.coordinates[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition-colors text-center"
                >
                  Turn-by-Turn GPS
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Accessible List View for Visually Impaired / Blind Users */
        <div 
          className="flex-1 overflow-y-auto p-6 bg-slate-900 text-slate-100 space-y-6"
          tabIndex={0}
          aria-label="Text alternative of disaster zones and shelters"
        >
          <div className="bg-slate-800/80 p-5 rounded-xl border border-yellow-400/50">
            <h2 className="text-lg font-bold text-yellow-300 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-yellow-400" />
              Accessible Disaster Telemetry & Safe Shelter Directory
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              This text-based view is formatted for screen readers and high contrast. It lists all active danger zones, nearest shelters, and SOS distress locations without requiring visual map interaction.
            </p>
          </div>

          {/* Critical Hazard Zones */}
          <section aria-labelledby="active-hazards-heading">
            <h3 id="active-hazards-heading" className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">
              Active Hazard Inundation and Danger Zones ({alerts.length})
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-slate-950 rounded-lg border border-red-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-base">[{alert.severity}] {alert.title}</span>
                    <button
                      onClick={() => onSpeakText(`${alert.severity} alert in ${alert.district}. ${alert.description}`)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs rounded-lg font-bold"
                    >
                      Read Aloud
                    </button>
                  </div>
                  <p className="text-xs text-slate-300"><strong>District:</strong> {alert.district} ({alert.location})</p>
                  <p className="text-xs text-slate-300 leading-relaxed"><strong>Details:</strong> {alert.description}</p>
                  <p className="text-xs text-red-400"><strong>Evacuation Status:</strong> {alert.evacuationStatus}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Shelters Directory */}
          <section aria-labelledby="shelters-heading">
            <h3 id="shelters-heading" className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">
              Designated Relief Shelters ({shelters.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shelters.map((shelter) => (
                <div key={shelter.id} className="p-4 bg-slate-950 rounded-lg border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-base">{shelter.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">{shelter.status}</span>
                  </div>
                  <p className="text-xs text-slate-300"><strong>District:</strong> {shelter.district}</p>
                  <p className="text-xs text-slate-300">
                    <strong>Capacity:</strong> {shelter.currentOccupancy} of {shelter.capacity} citizens accommodated ({shelter.capacity - shelter.currentOccupancy} available)
                  </p>
                  <p className="text-xs text-slate-400"><strong>Facilities:</strong> {shelter.facilities.join(', ')}</p>
                  <p className="text-xs text-cyan-300"><strong>Emergency Officer:</strong> {shelter.contactOfficer} ({shelter.phone})</p>
                  <div className="pt-2">
                    <button
                      onClick={() => onSpeakText(`Shelter: ${shelter.name} in ${shelter.district}. Total capacity: ${shelter.capacity}. Available slots: ${shelter.capacity - shelter.currentOccupancy}. Phone: ${shelter.phone}`)}
                      className="px-3 py-1 bg-slate-800 text-amber-300 text-xs rounded-lg font-semibold"
                    >
                      Speak Shelter Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
