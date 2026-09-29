import React, { useState } from 'react';
import {
  Binary,
  Satellite,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Volume2,
  MapPin,
  Users,
  ShieldAlert,
  Building2,
  HelpCircle,
  Eye,
  Truck
} from 'lucide-react';
import { getTranslation } from '../utils/translations';

export default function DamageAssessment({ lang, onSpeakText }) {
  const t = (key) => getTranslation(lang, key);

  const [activeView, setActiveView] = useState('post'); // 'pre', 'post'
  const [showDetections, setShowDetections] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSector, setSelectedSector] = useState('chiplun');
  const [selectedBuildingId, setSelectedBuildingId] = useState(1);
  const [dispatchedBuildings, setDispatchedBuildings] = useState({});

  const sectors = {
    chiplun: {
      name: 'Chiplun Riverfront & Market Basin (Ratnagiri)',
      hazard: 'Vashishti River Flash Flood & Bank Overflow',
      stats: {
        totalBuildings: 142,
        destroyed: 28,
        majorDamage: 44,
        minorDamage: 38,
        intact: 32,
        overallDamagePercent: 62.4,
        estimatedDisplaced: '4,600 citizens'
      },
      detections: [
        {
          id: 1,
          x: 14,
          y: 26,
          w: 16,
          h: 18,
          status: 'destroyed',
          name: 'Riverfront Grain Warehouse',
          type: 'Commercial Storage',
          coords: '17.5328° N, 73.5174° E',
          integrity: '18% (Roof Collapsed)',
          occupants: '12 workers reported',
          preCondition: 'Intact corrugated steel roof, dry loading dock',
          postCondition: 'Central roof truss collapsed under flood surge; 2.8m water ingress',
          action: 'Priority 1: NDRF Boat & Life-Detector Scan'
        },
        {
          id: 2,
          x: 38,
          y: 44,
          w: 17,
          h: 18,
          status: 'major',
          name: 'Bazar Peth Residential Complex',
          type: '4-Storey Apartment Block',
          coords: '17.5334° N, 73.5189° E',
          integrity: '54% (Ground Floor Submerged)',
          occupants: '48 residents on 2nd/3rd floors',
          preCondition: 'Dry compound, clear road access',
          postCondition: 'Ground floor submerged under 2.2m floodwater; families marooned on terrace',
          action: 'Priority 1: Inflatable Boat Evacuation'
        },
        {
          id: 3,
          x: 62,
          y: 22,
          w: 17,
          h: 18,
          status: 'destroyed',
          name: 'Old Market Timber Shed & Shops',
          type: 'Retail Market Cluster',
          coords: '17.5341° N, 73.5195° E',
          integrity: '12% (Swept by Current)',
          occupants: 'Evacuated prior to crest',
          preCondition: 'Dense shopfronts along river bend',
          postCondition: 'Structural walls breached by high-velocity river current',
          action: 'Cordoned off; structural debris clearance'
        },
        {
          id: 4,
          x: 20,
          y: 64,
          w: 16,
          h: 17,
          status: 'major',
          name: 'Primary Civic Health Dispensary',
          type: 'Medical Facility',
          coords: '17.5319° N, 73.5181° E',
          integrity: '61% (Waterlogged Access)',
          occupants: '9 staff & 6 patients',
          preCondition: 'Operational outpatient clinic',
          postCondition: 'Approach road flooded 1.4m; generator backup running',
          action: '108 Boat-Ambulance Medical Transfer'
        },
        {
          id: 5,
          x: 70,
          y: 62,
          w: 18,
          h: 18,
          status: 'intact',
          name: 'United High School Relief Complex',
          type: 'Designated Safe Shelter',
          coords: '17.5350° N, 73.5220° E',
          integrity: '98% (Elevated Ridge — Safe)',
          occupants: '620 sheltered citizens',
          preCondition: 'Elevated concrete campus +14m above river datum',
          postCondition: 'Completely dry and structurally sound; active relief camp',
          action: 'Safe Zone — Route evacuees here'
        },
        {
          id: 6,
          x: 48,
          y: 14,
          w: 12,
          h: 14,
          status: 'minor',
          name: 'MSEDCL 33kV Electrical Substation',
          type: 'Critical Utility',
          coords: '17.5345° N, 73.5184° E',
          integrity: '82% (Perimeter Water)',
          occupants: '4 engineers',
          preCondition: 'Normal grid operation',
          postCondition: 'Minor boundary wall waterlogging; transformers elevated',
          action: 'Deploy dewatering pump (1912)'
        }
      ]
    },
    mahad: {
      name: 'Mahad — Taliye Hill Slope Sector (Raigad)',
      hazard: 'Western Ghats Heavy Rain Landslide & Debris Flow',
      stats: {
        totalBuildings: 88,
        destroyed: 34,
        majorDamage: 22,
        minorDamage: 18,
        intact: 14,
        overallDamagePercent: 71.8,
        estimatedDisplaced: '2,200 citizens'
      },
      detections: [
        {
          id: 1,
          x: 26,
          y: 32,
          w: 20,
          h: 22,
          status: 'destroyed',
          name: 'Foothill Hamlet North Cluster',
          type: 'Residential Houses',
          coords: '18.0812° N, 73.4165° E',
          integrity: '9% (Mudslide Impact)',
          occupants: 'Urgent SAR Zone',
          preCondition: 'Terraced hillside homes below steep basalt scarp',
          postCondition: 'Direct debris chute impact; heavy mud and boulder deposition',
          action: 'Priority 1: NDRF Canine & Acoustic SAR Squad'
        },
        {
          id: 2,
          x: 54,
          y: 48,
          w: 17,
          h: 16,
          status: 'major',
          name: 'Ghat Link Culvert & Bridge Approach',
          type: 'Transport Infrastructure',
          coords: '18.0825° N, 73.4188° E',
          integrity: '45% (Blocked by Boulders)',
          occupants: 'Highway corridor',
          preCondition: 'Two-lane asphalt highway bridge',
          postCondition: 'Eastern embankment covered in 3m landslide scree; vehicle passage blocked',
          action: 'Deploy JCB earthmovers & SDRF clearance'
        },
        {
          id: 3,
          x: 68,
          y: 20,
          w: 16,
          h: 16,
          status: 'intact',
          name: 'Hilltop Gram Panchayat & School',
          type: 'Safe Assembly Point',
          coords: '18.0840° N, 73.4210° E',
          integrity: '96% (Stable Plateau)',
          occupants: '310 evacuees',
          preCondition: 'Reinforced concrete building on stable ridge',
          postCondition: 'Unaffected by slope failure; serving as forward medical post',
          action: 'Safe Zone — Helicopter landing & triage'
        }
      ]
    }
  };

  const currentSector = sectors[selectedSector];
  const selectedBuilding =
    currentSector.detections.find((b) => b.id === selectedBuildingId) ||
    currentSector.detections[0];

  const handleRunInference = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowDetections(true);
    }, 600);
  };

  const handleDispatchToBuilding = (b) => {
    setDispatchedBuildings((prev) => ({ ...prev, [`${selectedSector}-${b.id}`]: true }));
    onSpeakText(`NDRF and 108 Rescue Unit dispatched to ${b.name} at coordinates ${b.coords}.`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'destroyed':
        return {
          box: 'border-red-500 bg-red-500/25 text-white',
          pill: 'bg-red-600 text-white keep-white',
          label: 'DESTROYED / COLLAPSED'
        };
      case 'major':
        return {
          box: 'border-amber-500 bg-amber-500/25 text-white',
          pill: 'bg-amber-600 text-white keep-white',
          label: 'MAJOR FLOOD / DAMAGE'
        };
      case 'minor':
        return {
          box: 'border-yellow-400 bg-yellow-400/20 text-white',
          pill: 'bg-yellow-500 text-black',
          label: 'MINOR PERIMETER DAMAGE'
        };
      case 'intact':
      default:
        return {
          box: 'border-emerald-400 bg-emerald-500/20 text-white',
          pill: 'bg-emerald-600 text-white keep-white',
          label: 'INTACT / SAFE REFUGE'
        };
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-wider uppercase">
              <Satellite className="w-4 h-4" />
              <span>{t('damageTitle')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {t('damageSubtitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1">
              {t('damageDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() =>
                onSpeakText(
                  `Satellite Damage AI for ${currentSector.name}. Currently inspecting ${selectedBuilding.name}, status is ${selectedBuilding.status}, structural integrity ${selectedBuilding.integrity}. ${selectedBuilding.postCondition}.`
                )
              }
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t('voiceReadout')}</span>
            </button>

            <button
              onClick={handleRunInference}
              disabled={isProcessing}
              className="keep-white flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Scanning Rooftops...' : t('damageRunBtn')}</span>
            </button>
          </div>
        </div>

        {/* HOW IT WORKS: 4-Step Visual Explainer so anyone immediately understands the boxes */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-400 mb-2.5">
            <HelpCircle className="w-4 h-4" />
            <span>HOW THIS SATELLITE AI WORKS (4 SIMPLE STEPS):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <strong className="text-white block">Step 1: Satellite Overpass</strong>
              <span className="text-slate-400 text-[11px]">
                Sentinel-2 / Drone captures overhead imagery of the town <strong>Before</strong> and <strong>After</strong> the flood or landslide.
              </span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <strong className="text-white block">Step 2: AI Rooftop Detection</strong>
              <span className="text-slate-400 text-[11px]">
                Each colored rectangle on the map outlines a real building footprint (warehouse, apartment, hospital, school).
              </span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <strong className="text-white block">Step 3: Color-Coded Severity</strong>
              <span className="text-slate-400 text-[11px]">
                <strong className="text-red-400">Red</strong> = Collapsed, <strong className="text-amber-400">Orange</strong> = Flooded/Marooned, <strong className="text-emerald-400">Green</strong> = Safe Elevated Shelter.
              </span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <strong className="text-white block">Step 4: Click Any Building Box</strong>
              <span className="text-slate-400 text-[11px]">
                Click any building on the aerial map below to view its damage blueprint and dispatch NDRF rescue teams!
              </span>
            </div>
          </div>
        </div>

        {/* Controls Bar: Sector Selection & Pre/Post Switcher */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Select Disaster Sector:</span>
            <button
              onClick={() => {
                setSelectedSector('chiplun');
                setSelectedBuildingId(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSector === 'chiplun'
                  ? 'bg-cyan-600 text-white keep-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🌊 Chiplun River Flood Basin (6 Buildings)
            </button>
            <button
              onClick={() => {
                setSelectedSector('mahad');
                setSelectedBuildingId(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSector === 'mahad'
                  ? 'bg-cyan-600 text-white keep-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⛰️ Mahad Hill Landslide Zone (3 Structures)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setActiveView('pre')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'pre'
                    ? 'bg-emerald-600 text-white keep-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {t('damagePre')}
              </button>
              <button
                onClick={() => setActiveView('post')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'post'
                    ? 'bg-red-600 text-white keep-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {t('damagePost')}
              </button>
            </div>

            <button
              onClick={() => setShowDetections(!showDetections)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                showDetections
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {showDetections ? t('damageHideBoxes') : t('damageShowBoxes')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Aerial Satellite Scene (7 cols) + Right Interactive Building Inspector (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Visual Aerial Satellite Town & Riverbank Scene */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
            <span className="font-mono font-bold text-cyan-400 flex items-center gap-1.5">
              <Satellite className="w-4 h-4" />
              {currentSector.name}
            </span>
            <span
              className={`keep-white px-2.5 py-0.5 rounded font-bold text-[10px] ${
                activeView === 'post' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {activeView === 'post' ? 'POST-DISASTER IMPACT IMAGERY' : 'PRE-DISASTER NORMAL BASELINE'}
            </span>
          </div>

          {/* Realistic SVG Aerial Satellite Map with River, Roads, Bridges, Trees & Building Rooftops */}
          <div
            className="relative w-full h-[460px] select-none overflow-hidden"
            style={{ backgroundColor: activeView === 'pre' ? '#14261c' : '#1c2226' }}
          >
            <svg
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              {/* Terrain Vegetation / Land Blocks */}
              <rect width="1000" height="600" fill={activeView === 'pre' ? '#193222' : '#23272a'} />
              <rect x="620" y="340" width="360" height="240" rx="20" fill="#1e3a29" opacity="0.8" />

              {/* Town Road Network */}
              <path
                d="M 0 320 L 1000 320 M 480 0 L 480 600 M 180 0 L 180 600 M 760 0 L 760 600"
                stroke="#334155"
                strokeWidth="26"
                fill="none"
              />
              <path
                d="M 0 320 L 1000 320 M 480 0 L 480 600"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="12,12"
                fill="none"
              />

              {/* River / Landslide Channel */}
              {selectedSector === 'chiplun' ? (
                <>
                  {/* Pre-disaster normal river channel */}
                  <path
                    d="M 0 110 Q 350 160 650 95 T 1000 130"
                    stroke={activeView === 'pre' ? '#0284c7' : '#854d0e'}
                    strokeWidth={activeView === 'pre' ? '75' : '155'}
                    fill="none"
                  />
                  {/* Post-disaster flood inundation zone spreading over town blocks */}
                  {activeView === 'post' && (
                    <path
                      d="M 0 60 Q 380 240 680 140 T 1000 190 L 1000 440 L 0 490 Z"
                      fill="#78350f"
                      opacity="0.58"
                    />
                  )}
                </>
              ) : (
                <>
                  {/* Mahad Hill Ridge & Landslide Debris Fan */}
                  <polygon points="0,0 550,0 420,260 0,320" fill="#292524" />
                  {activeView === 'post' && (
                    <polygon
                      points="180,20 460,90 660,430 220,410"
                      fill="#78350f"
                      opacity="0.8"
                    />
                  )}
                </>
              )}

              {/* Trees & Urban Greenery */}
              {[
                [100, 180],
                [850, 480],
                [880, 510],
                [820, 520],
                [640, 450],
                [920, 260],
                [120, 520]
              ].map(([cx, cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="18" fill="#15803d" opacity="0.7" />
              ))}
            </svg>

            {/* Physical Building Rooftops + AI Bounding Boxes */}
            {currentSector.detections.map((b) => {
              const badge = getStatusBadge(b.status);
              const isSelected = selectedBuilding.id === b.id;
              const isDispatched = dispatchedBuildings[`${selectedSector}-${b.id}`];

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBuildingId(b.id)}
                  style={{
                    position: 'absolute',
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: `${b.w}%`,
                    height: `${b.h}%`
                  }}
                  className={`group cursor-pointer transition-all duration-200 rounded-lg flex flex-col justify-between p-1.5 ${
                    showDetections
                      ? `border-2 ${
                          activeView === 'pre'
                            ? 'border-emerald-400 bg-emerald-500/15'
                            : badge.box
                        }`
                      : 'border border-slate-500/40'
                  } ${isSelected ? 'ring-4 ring-cyan-400 scale-105 z-30' : 'hover:scale-105 z-20'}`}
                >
                  {/* Visual Building Roof Structure Inside the Footprint */}
                  <div className="w-full h-full bg-slate-800/90 border border-slate-600 rounded flex flex-col items-center justify-center p-1 relative overflow-hidden shadow-inner">
                    {/* Roof ridge line */}
                    <div className="w-full border-t border-slate-500/50 absolute top-1/2" />
                    <Building2 className="w-4 h-4 text-slate-300 relative z-10" />
                    <span className="text-[9px] font-bold text-white text-center leading-tight line-clamp-1 relative z-10 mt-0.5">
                      #{b.id} {b.name.split(' ')[0]}
                    </span>

                    {/* Show flood/collapse visual damage texture in post mode */}
                    {activeView === 'post' && b.status === 'destroyed' && (
                      <div className="absolute inset-0 bg-red-600/40 flex items-center justify-center">
                        <span className="keep-white text-[8px] font-black uppercase bg-red-700 text-white px-1 rounded">
                          COLLAPSED
                        </span>
                      </div>
                    )}
                    {activeView === 'post' && b.status === 'major' && (
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-amber-600/45 flex items-end justify-center">
                        <span className="keep-white text-[8px] font-black uppercase bg-amber-700 text-white px-1 rounded">
                          FLOODED
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Top AI Label Tag */}
                  {showDetections && (
                    <span
                      className={`keep-white absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider shadow whitespace-nowrap ${
                        activeView === 'pre' ? 'bg-emerald-600 text-white' : badge.pill
                      }`}
                    >
                      {activeView === 'pre' ? 'PRE: INTACT' : `${b.status.toUpperCase()}`}
                      {isDispatched ? ' • 🚑 SENT' : ''}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Bottom Overlay Hint */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 border border-slate-800 px-3.5 py-2 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Click any numbered building (#1 to #{currentSector.detections.length}) on the aerial view to inspect its structural condition.
              </span>
              <span className="font-mono text-cyan-400">Selected: #{selectedBuilding.id} {selectedBuilding.name}</span>
            </div>
          </div>

          {/* Color Legend Footer */}
          <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <span className="w-3 h-3 rounded bg-red-600 inline-block" />
                Red: Collapsed / Destroyed ({currentSector.stats.destroyed})
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                Orange: Major Flood / Roof Damage ({currentSector.stats.majorDamage})
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <span className="w-3 h-3 rounded bg-yellow-400 inline-block" />
                Yellow: Minor ({currentSector.stats.minorDamage})
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                Green: Intact Safe Shelter ({currentSector.stats.intact})
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Selected Building Deep Inspector + Sector Triage List */}
        <div className="lg:col-span-5 space-y-5">
          {/* Selected Building Blueprint Card */}
          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">
                  BUILDING FOOTPRINT #{selectedBuilding.id} • {selectedBuilding.type}
                </span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">
                  {selectedBuilding.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {selectedBuilding.coords}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                  getStatusBadge(selectedBuilding.status).pill
                }`}
              >
                {getStatusBadge(selectedBuilding.status).label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">STRUCTURAL INTEGRITY</span>
                <strong className="text-white font-mono text-sm">{selectedBuilding.integrity}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ESTIMATED OCCUPANTS</span>
                <strong className="text-amber-300 font-mono text-sm flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {selectedBuilding.occupants}
                </strong>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                <strong className="text-emerald-400 block text-[11px]">Before Disaster (Baseline):</strong>
                <span className="text-slate-300">{selectedBuilding.preCondition}</span>
              </div>
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40">
                <strong className="text-red-400 block text-[11px]">After Disaster (AI Satellite Finding):</strong>
                <span className="text-slate-200">{selectedBuilding.postCondition}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              {dispatchedBuildings[`${selectedSector}-${selectedBuilding.id}`] ? (
                <div className="keep-white w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>NDRF & 108 Rescue Unit Dispatched to Building #{selectedBuilding.id}</span>
                </div>
              ) : (
                <button
                  onClick={() => handleDispatchToBuilding(selectedBuilding)}
                  className="keep-white w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <Truck className="w-4 h-4" />
                  <span>Dispatch NDRF / Rescue Team to #{selectedBuilding.id}</span>
                </button>
              )}
            </div>
          </div>

          {/* All Detected Buildings List (Click to Inspect) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="font-bold text-white text-sm">
              All Scanned Buildings in Sector (Click to Inspect)
            </h4>
            <div className="space-y-2 max-h-[230px] overflow-y-auto pr-1">
              {currentSector.detections.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBuildingId(b.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                    selectedBuilding.id === b.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white">
                      #{b.id} {b.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{b.integrity}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      getStatusBadge(b.status).pill
                    }`}
                  >
                    {b.status.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
