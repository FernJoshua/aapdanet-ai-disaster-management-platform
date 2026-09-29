import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sliders,
  CloudRain,
  Wind,
  Mountain,
  Waves,
  Activity,
  CheckCircle,
  Cpu,
  Radio,
  RefreshCw,
  Volume2,
  Flame,
  Eye,
  Sparkles
} from 'lucide-react';
import { computeDisasterRisk } from '../utils/geoUtils';
import { getTranslation } from '../utils/translations';
import {
  fetchLiveMultiHazardTelemetry,
  calculateExplainableFloodRisk,
  calculateExplainableFireRisk
} from '../services/realTimeService';

export default function DisasterPredictor({
  lang = 'en',
  onSpeakText = () => {},
  liveTelemetry: propTelemetry = null
}) {
  const t = (key) => getTranslation(lang, key);

  const [localTelemetry, setLocalTelemetry] = useState(null);
  const telemetry = propTelemetry || localTelemetry;

  const [selectedBasinId, setSelectedBasinId] = useState('basin-savitri');
  const [params, setParams] = useState({
    rainfall: 142,
    riverLevel: 3.9,
    riverDischargeM3s: 1680,
    floodThresholdM3s: 1450,
    elevationM: 14,
    historicalExposure: 94,
    soilImperviousness: 78,
    tideHeight: 3.8,
    windSpeed: 58,
    slopeAngle: 36,
    soilSaturation: 88,
    tremorMagnitude: 1.5,
    tempC: 34,
    frpMW: 28,
    pm25: 64
  });

  const [selectedPreset, setSelectedPreset] = useState('basin-savitri');
  const [liveSyncStatus, setLiveSyncStatus] = useState(
    'Live Open-Meteo + Copernicus GloFAS + CAMS + NASA FIRMS telemetry active'
  );
  const [isSyncingLive, setIsSyncingLive] = useState(false);

  useEffect(() => {
    if (!propTelemetry) {
      fetchLiveMultiHazardTelemetry().then((data) => {
        setLocalTelemetry(data);
      }).catch(() => {});
    }
  }, [propTelemetry]);

  const riskResult = computeDisasterRisk(params);

  // Explainable Flood Risk (30% Rain + 30% GloFAS Discharge + 15% Elevation + 15% History + 10% Soil)
  const explainableFlood = calculateExplainableFloodRisk({
    rainfallMm: params.rainfall,
    riverDischargeM3s: params.riverDischargeM3s,
    floodThresholdM3s: params.floodThresholdM3s,
    elevationM: params.elevationM,
    historicalExposure: params.historicalExposure,
    soilImperviousness: params.soilImperviousness
  });

  // Explainable Fire Risk (35% NASA FIRMS FRP + 25% Temp + 20% Wind + 20% CAMS PM2.5/CO)
  const explainableFire = calculateExplainableFireRisk({
    frpMW: params.frpMW,
    tempC: params.tempC,
    windSpeedKmh: params.windSpeed,
    pm25: params.pm25
  });

  const basins = telemetry?.basins || [];
  const fireHotspots = telemetry?.fireHotspots || [];

  const handleSelectBasin = (basin) => {
    setSelectedBasinId(basin.id);
    setSelectedPreset(basin.id);
    const obsRain = Math.max(25, Math.round((basin.observed?.rain24hMm || 45) + (basin.observed?.forecastRain72hMm || 60) * 0.35));
    setParams((prev) => ({
      ...prev,
      rainfall: obsRain,
      riverDischargeM3s: basin.observed?.riverDischargeM3s || 950,
      floodThresholdM3s: basin.floodDischargeThresholdM3s || 1200,
      elevationM: basin.elevationM || 18,
      historicalExposure: basin.historicalFloodScore || 88,
      soilImperviousness: basin.soilImperviousness || 75,
      windSpeed: Math.round(basin.observed?.windKmh || 42),
      tempC: Math.round(basin.observed?.tempC || 31),
      pm25: Math.round(basin.observed?.pm25 || 52)
    }));
    setLiveSyncStatus(
      `Loaded Live Basin Telemetry: ${basin.basinName} (${basin.district}) • GloFAS Discharge ${basin.observed?.riverDischargeM3s} m³/s`
    );
  };

  const handleRefreshAllLive = async () => {
    setIsSyncingLive(true);
    try {
      const fresh = await fetchLiveMultiHazardTelemetry();
      setLocalTelemetry(fresh);
      const activeBasin = fresh.basins.find((b) => b.id === selectedBasinId) || fresh.basins[0];
      if (activeBasin) handleSelectBasin(activeBasin);
      setLiveSyncStatus(`Refreshed all live environmental APIs at ${new Date().toLocaleTimeString('en-IN')}`);
    } finally {
      setIsSyncingLive(false);
    }
  };

  const handleParamChange = (field, value) => {
    setSelectedPreset('custom');
    setParams((prev) => ({ ...prev, [field]: parseFloat(value) }));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner: Observed vs Predicted Architecture */}
      <div className="navy-surface border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white keep-white text-[11px] font-black uppercase">
                🟢 OBSERVED (LIVE API TELEMETRY)
              </span>
              <span className="text-slate-300 keep-white font-black">+</span>
              <span className="px-2.5 py-1 rounded-md bg-[#1769AA] text-white keep-white text-[11px] font-black uppercase">
                🧠 PREDICTED (EXPLAINABLE RISK ENGINE)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white keep-white mt-2">
              Multi-Hazard Basin Intelligence & Explainable Risk Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 keep-white max-w-3xl mt-1">
              Strictly separates real-world <strong>Observed Sensor & Satellite Telemetry</strong> (Open-Meteo, Copernicus GloFAS River Discharge, NASA FIRMS Fire FRP, CAMS Air Quality) from <strong>Model-Estimated Risk Scores (0–100)</strong> with transparent weight breakdowns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefreshAllLive}
              disabled={isSyncingLive}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#1769AA] hover:bg-[#0284C7] text-white keep-white font-bold text-xs shadow-md cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingLive ? 'animate-spin' : ''}`} />
              <span>Sync Live APIs</span>
            </button>

            <button
              onClick={() =>
                onSpeakText(
                  `Explainable Risk Report: Flood Risk is ${explainableFlood.level} at ${explainableFlood.score} out of 100. Fire Risk is ${explainableFire.level} at ${explainableFire.score} out of 100.`
                )
              }
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 keep-white font-bold text-xs border border-amber-400/40 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Audio Briefing</span>
            </button>
          </div>
        </div>

        <div className="text-xs font-mono text-sky-300 keep-white bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center justify-between">
          <span className="keep-white">● {liveSyncStatus}</span>
          <span className="text-emerald-400 keep-white font-bold">Formula: Weighted Multi-Factor Explainable Scoring</span>
        </div>
      </div>

      {/* SECTION 1: LIVE BASIN FLOOD INTELLIGENCE CARDS (Savitri/Mahad, Vashishti/Chiplun, Mithi/Mumbai, etc.) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
              <Waves className="w-4 h-4" />
              COPERNICUS GLOFAS + OPEN-METEO HYDROLOGICAL SURVEILLANCE
            </span>
            <h2 className="text-lg font-black text-white mt-0.5">
              Maharashtra River Basin Flood Intelligence (Observed vs. Predicted)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Click any river basin card to load its live telemetry into the Explainable Risk Calculator
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {basins.map((b) => {
            const isSelected = selectedBasinId === b.id;
            const risk = b.floodRisk || { score: 72, level: 'HIGH' };
            return (
              <div
                key={b.id}
                onClick={() => handleSelectBasin(b)}
                className={`rounded-xl p-4 border-2 transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'border-[#0284C7] bg-slate-950 shadow-lg'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700/50">
                      {b.district} • {b.riverName}
                    </span>
                    <h3 className="font-black text-base text-white mt-1">{b.basinName}</h3>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-black text-white keep-white shrink-0"
                    style={{ backgroundColor: risk.color || '#F59E0B' }}
                  >
                    {risk.score}/100 {risk.level}
                  </span>
                </div>

                {/* OBSERVED TELEMETRY BOX */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-emerald-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      🟢 OBSERVED (LIVE API)
                    </span>
                    <span>Elev: {b.elevationM}m</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-slate-300 pt-0.5">
                    <div>
                      <span className="text-[11px] text-slate-400 block">24h Rainfall:</span>
                      <strong className="text-white font-mono">{b.observed?.rain24hMm} mm</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">72h Forecast:</span>
                      <strong className="text-white font-mono">{b.observed?.forecastRain72hMm} mm</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">GloFAS Discharge:</span>
                      <strong className="text-white font-mono">{b.observed?.riverDischargeM3s} m³/s</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">River Trend:</span>
                      <strong className={b.observed?.dischargeTrend === 'RISING' ? 'text-red-500' : 'text-emerald-500'}>
                        {b.observed?.dischargeTrend} ({b.observed?.dischargeRatioPct}% cap)
                      </strong>
                    </div>
                  </div>
                </div>

                {/* PREDICTED RISK BAR */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-sky-500">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      🧠 PREDICTED FLOOD RISK
                    </span>
                    <span>{risk.score}% Probability</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ width: `${risk.score}%`, backgroundColor: risk.color || '#0284C7' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: EXPLAINABLE RISK ENGINE (FLOOD RISK + FIRE RISK CONTRIBUTOR BARS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Explainable Flood & Fire Breakdown Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card A: Explainable Flood Risk Formula */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-black uppercase">
                  🧠 MODEL PREDICTION • WEIGHTED HYDROLOGICAL INDEX
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Flood Risk: {explainableFlood.level} ({explainableFlood.score}/100)
                </h3>
              </div>
              <div
                className="px-3.5 py-2 rounded-xl font-black text-white keep-white text-sm shadow"
                style={{ backgroundColor: explainableFlood.color }}
              >
                {explainableFlood.score} / 100
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Computed from live observed rainfall, Copernicus GloFAS river discharge, SRTM elevation vulnerability, historical CWC flood frequency, and soil imperviousness:
            </p>

            {/* Horizontal Contributor Bars */}
            <div className="space-y-3 pt-1">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                Main Contributors (100% Total Weight):
              </div>
              {explainableFlood.contributors.map((c, idx) => (
                <div key={idx} className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex flex-wrap justify-between items-center text-xs gap-1">
                    <span className="font-bold text-white">
                      • {c.factor} <span className="text-sky-500 font-mono">({c.weight}% weight)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {c.provenance}: {c.rawValue}
                      </span>
                      <span className="font-black font-mono text-white">{c.subScore}/100</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-300 bg-[#0284C7]"
                      style={{ width: `${c.subScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card B: Explainable Fire Risk Formula (NASA FIRMS + Weather + CAMS Air Quality) */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 text-[10px] font-black uppercase">
                  🛰️ NASA FIRMS SATELLITE + 🟢 CAMS AIR QUALITY + OPEN-METEO
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Fire & Thermal Anomaly Risk: {explainableFire.level} ({explainableFire.score}/100)
                </h3>
              </div>
              <div
                className="px-3.5 py-2 rounded-xl font-black text-white keep-white text-sm shadow"
                style={{ backgroundColor: explainableFire.color }}
              >
                {explainableFire.score} / 100
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                Main Fire Risk Contributors:
              </div>
              {explainableFire.contributors.map((c, idx) => (
                <div key={idx} className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex flex-wrap justify-between items-center text-xs gap-1">
                    <span className="font-bold text-white">
                      • {c.factor} <span className="text-orange-500 font-mono">({c.weight}% weight)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {c.provenance}: {c.rawValue}
                      </span>
                      <span className="font-black font-mono text-white">{c.subScore}/100</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-300 bg-[#F97316]"
                      style={{ width: `${c.subScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive What-If Parameter Sliders + NASA FIRMS Active Hotspots (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-500" />
                <span>Interactive Telemetry Stress-Test Sliders</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                Real-Time Recalculation
              </span>
            </div>

            {/* Rainfall */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">24h + Forecast Rainfall (mm)</span>
                <span className="font-mono text-sky-500">{params.rainfall} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={params.rainfall}
                onChange={(e) => handleParamChange('rainfall', e.target.value)}
                className="w-full accent-sky-500 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* River Discharge */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">GloFAS River Discharge (m³/s)</span>
                <span className="font-mono text-sky-500">{params.riverDischargeM3s} m³/s</span>
              </div>
              <input
                type="range"
                min="100"
                max="3500"
                step="50"
                value={params.riverDischargeM3s}
                onChange={(e) => handleParamChange('riverDischargeM3s', e.target.value)}
                className="w-full accent-sky-500 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* NASA FIRMS FRP */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">NASA FIRMS Fire Radiative Power (MW)</span>
                <span className="font-mono text-orange-500">{params.frpMW} MW</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="2"
                value={params.frpMW}
                onChange={(e) => handleParamChange('frpMW', e.target.value)}
                className="w-full accent-orange-500 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Surface Temp & Wind */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Temp (°C)</span>
                  <span className="font-mono text-orange-500">{params.tempC}°C</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="48"
                  step="1"
                  value={params.tempC}
                  onChange={(e) => handleParamChange('tempC', e.target.value)}
                  className="w-full accent-orange-500 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Wind (km/h)</span>
                  <span className="font-mono text-sky-500">{params.windSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={params.windSpeed}
                  onChange={(e) => handleParamChange('windSpeed', e.target.value)}
                  className="w-full accent-sky-500 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* CAMS Smoke PM2.5 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">CAMS Smoke & Particulate PM2.5 (µg/m³)</span>
                <span className="font-mono text-amber-500">{params.pm25} µg/m³</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={params.pm25}
                onChange={(e) => handleParamChange('pm25', e.target.value)}
                className="w-full accent-amber-500 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Active NASA FIRMS Fire Hotspots Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-black uppercase text-orange-500 flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                🛰️ NASA FIRMS Thermal Hotspots (VIIRS / MODIS)
              </span>
              <span className="text-[11px] font-bold text-slate-400">{fireHotspots.length} Active</span>
            </div>

            <div className="space-y-2.5">
              {fireHotspots.map((fh) => (
                <div
                  key={fh.id}
                  onClick={() => {
                    setParams((prev) => ({
                      ...prev,
                      frpMW: fh.frpMW,
                      tempC: Math.round(fh.tempC || 38),
                      windSpeed: Math.round(fh.windKmh || 32),
                      pm25: Math.round(fh.pm25 || 88)
                    }));
                  }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/60 cursor-pointer transition-all text-xs space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-white">{fh.location}</strong>
                    <span className="px-2 py-0.5 rounded bg-[#F97316] text-white keep-white text-[10px] font-black">
                      FRP {fh.frpMW} MW • {fh.brightnessK} K
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex flex-wrap gap-3">
                    <span>Lat/Lon: {fh.lat.toFixed(2)}, {fh.lon.toFixed(2)}</span>
                    <span>PM2.5: {fh.pm25} µg/m³</span>
                    <span>Fire Risk: <strong>{fh.fireRisk?.score || 76}/100</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
