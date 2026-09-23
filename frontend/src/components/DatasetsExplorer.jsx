import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Globe, 
  Server,
  Code
} from 'lucide-react';
import { getTranslation } from '../utils/translations';

export default function DatasetsExplorer({ lang, onSpeakText }) {
  const t = (key) => getTranslation(lang, key);

  const [activeDataset, setActiveDataset] = useState('ibm');

  const datasets = [
    {
      id: 'ibm',
      name: "IBM Call for Code & Weather Company Disaster Datasets",
      org: "IBM / The Weather Company",
      type: "Severe Weather & Flood Inundation",
      size: "4.2 GB",
      records: "1.8 Million Weather Observations",
      desc: "Historical storm trajectories, hourly precipitation indices, and flood vulnerability grids. Powers our hydrologic runoff models and environmental feature engineering.",
      format: "NetCDF / CSV / GeoJSON",
      features: ["Hourly AWS Rainfall", "Soil Moisture Index", "Barometric Depression Tracks", "Surface Runoff Ratios"],
      url: "https://developer.ibm.com/callforcode/",
      sample: [
        { station_id: "IBM_MH_MUM_01", lat: 19.076, lon: 72.877, precip_mm_hr: 68.5, wind_kmh: 42.0, soil_sat_pct: 88.0 },
        { station_id: "IBM_MH_RGD_02", lat: 18.082, lon: 73.418, precip_mm_hr: 110.2, wind_kmh: 58.0, soil_sat_pct: 95.0 },
        { station_id: "IBM_MH_RTN_03", lat: 17.532, lon: 73.518, precip_mm_hr: 92.4, wind_kmh: 62.0, soil_sat_pct: 91.5 }
      ]
    },
    {
      id: 'xbd',
      name: "xBD Satellite Building Damage Assessment Dataset",
      org: "Humanitarian OpenStreetMap / Defense Innovation Unit",
      type: "Computer Vision & Optical Satellite",
      size: "32.0 GB (High Resolution Imagery)",
      records: "850,000+ Building Polygons",
      desc: "World standard benchmark dataset containing pre- and post-disaster satellite imagery across natural disasters (earthquakes, floods, tsunamis) labeled across 4 structural damage tiers. Powers Model 2.",
      format: "GeoTIFF & JSON Polygons",
      features: ["Pre/Post Dual-Temporal Imagery", "Building Footprint Polygon Masks", "Damage Labels (No Damage, Minor, Major, Destroyed)"],
      url: "https://xview2.org/dataset",
      sample: [
        { building_id: "BLD_CHIP_001", damage_label: "destroyed", iou_score: 0.91, roof_condition: "collapsed" },
        { building_id: "BLD_CHIP_002", damage_label: "major_damage", iou_score: 0.88, roof_condition: "submerged_water" },
        { building_id: "BLD_CHIP_003", damage_label: "no_damage", iou_score: 0.94, roof_condition: "intact_elevated" }
      ]
    },
    {
      id: 'imd',
      name: "IMD (India Meteorological Department) Historical Rainfall & Cyclone Atlas",
      org: "Ministry of Earth Sciences, Govt of India",
      type: "Official Government Meteorological Records",
      size: "1.2 GB",
      records: "120-Year Maharashtra Historical Observations",
      desc: "Contains 100-year rainfall extremes for Mumbai, Pune, Konkan, and Vidarbha, high-tide Arabian Sea calendars, and Arabian Sea Cyclone tracks (e.g. Cyclone Nisarga 2020, Tauktae 2021).",
      format: "CSV / Shapefiles",
      features: ["Daily District Rainfall (mm)", "Extreme Weather Records", "Cyclone Eye Coordinates", "Storm Surge Forecasts"],
      url: "https://mausam.imd.gov.in/",
      sample: [
        { cyclone_name: "Nisarga", year: 2020, landfall: "Raigad (Shrivardhan)", max_wind_kmh: 110, central_pressure_hpa: 984 },
        { cyclone_name: "Tauktae", year: 2021, landfall: "Saurashtra Coast / Mumbai Skirt", max_wind_kmh: 185, central_pressure_hpa: 950 }
      ]
    },
    {
      id: 'cwc',
      name: "Central Water Commission (CWC) River Gauge & Hydrology Telemetry",
      org: "Ministry of Jal Shakti, Govt of India",
      type: "River Water Gauge & Dam Spillway Discharge",
      size: "650 MB",
      records: "140 Hydrological Stations",
      desc: "River discharge, reservoir levels (Koyna, Bhatsa, Vaitarna, Khadakwasla), and flood warning levels for the Mithi, Vashishti, Krishna, and Godavari river basins.",
      format: "JSON / REST API",
      features: ["Gauge Water Level (m)", "Spillway Discharge (cusecs)", "Danger Warning Mark (m)", "Rate of Ingress"],
      url: "http://cwc.gov.in/",
      sample: [
        { river_name: "Mithi River", gauge_station: "Kurla Bridge", danger_mark_m: 3.5, current_level_m: 3.88, status: "DANGER" },
        { river_name: "Vashishti River", gauge_station: "Chiplun Market", danger_mark_m: 4.0, current_level_m: 4.25, status: "DANGER" },
        { river_name: "Panchganga", gauge_station: "Shirol Kolhapur", danger_mark_m: 43.0, current_level_m: 41.5, status: "WARNING" }
      ]
    },
    {
      id: 'sdma',
      name: "Maharashtra SDMA & BMC Disaster Cell Shelter Registry",
      org: "Maharashtra State Disaster Management Authority",
      type: "Civic Infrastructure & Relief Shelters",
      size: "180 MB",
      records: "1,450 Verified Safe Shelters",
      desc: "Complete geospatial database of municipal schools, indoor stadiums, and exhibition grounds designated as emergency relief camps with capacity, water/medical access, and liaison officer details.",
      format: "GeoJSON / SQLite",
      features: ["GPS Coordinates", "Capacity & Live Occupancy", "Accessibility Features", "Contact Officers"],
      url: "https://rfd.maharashtra.gov.in/",
      sample: [
        { shelter_id: "SHL_MH_01", name: "Kurla Municipal Camp", capacity: 1200, occupancy: 840, accessible_wheelchair: true },
        { shelter_id: "SHL_MH_02", name: "BKC Exhibition Ground", capacity: 3500, occupancy: 1450, accessible_wheelchair: true },
        { shelter_id: "SHL_MH_03", name: "Mahad High School", capacity: 800, occupancy: 610, accessible_wheelchair: false }
      ]
    }
  ];

  const currentDataset = datasets.find(d => d.id === activeDataset) || datasets[0];

  const handleDownloadSample = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentDataset.sample, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentDataset.id}_sample_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">
              <Database className="w-5 h-5" />
              <span>Grounded Open Intelligence & Datasets</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Integrated Disaster Datasets, Satellite Repositories & Real-Time Streams
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Answering exactly what data drives this platform: IBM Call for Code, IMD meteorological records, xBD satellite damage models, CWC river discharge telemetry, and Maharashtra SDMA shelter inventories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSpeakText(`Datasets Overview: This platform utilizes 5 primary datasets including IBM Call for Code weather observations, xBD Satellite building damage imagery with 850,000 buildings, India Meteorological Department historical cyclone atlas, and Central Water Commission river discharge telemetry.`)}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors"
            >
              Audio Readout
            </button>
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Sample JSON</span>
            </button>
          </div>
        </div>

        {/* Dataset Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
          {datasets.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDataset(d.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeDataset === d.id
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-md'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {d.name.split(' ')[0]} ({d.org.split('/')[0].trim()})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Dataset Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Specs & Features (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">{currentDataset.type}</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{currentDataset.name}</h3>
              <p className="text-xs text-slate-400">Maintained by: <strong className="text-slate-200">{currentDataset.org}</strong></p>
            </div>
            <a
              href={currentDataset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold px-2 py-1 rounded bg-slate-800"
            >
              <span>Repository</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentDataset.desc}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">DATA VOLUME / SIZE</span>
              <div className="font-mono font-bold text-white">{currentDataset.size}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">RECORDS / POLAR TILES</span>
              <div className="font-mono font-bold text-white">{currentDataset.records}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">FILE SPECIFICATION</span>
              <div className="font-mono font-bold text-cyan-300">{currentDataset.format}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">INTEGRATION STATUS</span>
              <div className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active in Models
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300">Extracted Features & Variables:</span>
            <div className="flex flex-wrap gap-1.5">
              {currentDataset.features.map((feat, idx) => (
                <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-700">
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive JSON Preview (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-cyan-400" />
              Live Dataset Telemetry Structure (JSON Preview)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Sample Records: {currentDataset.sample.length}</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[360px] scrollbar-thin">
            <pre>{JSON.stringify(currentDataset.sample, null, 2)}</pre>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Directly ingested into FastAPI backend (`/api/predict`)</span>
            <button
              onClick={handleDownloadSample}
              className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
            >
              Export JSON format
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
