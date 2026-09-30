import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Waves,
  RefreshCw,
  Volume2,
  Flame,
  ChevronDown
} from 'lucide-react';
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
  const [openSection, setOpenSection] = useState(null);

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

  const [liveSyncStatus, setLiveSyncStatus] = useState(
    'Live Open-Meteo + GloFAS + CAMS + NASA FIRMS telemetry active'
  );
  const [isSyncingLive, setIsSyncingLive] = useState(false);

  useEffect(() => {
    if (!propTelemetry) {
      fetchLiveMultiHazardTelemetry()
        .then((data) => {
          setLocalTelemetry(data);
        })
        .catch(() => {});
    }
  }, [propTelemetry]);

  const explainableFlood = calculateExplainableFloodRisk({
    rainfallMm: params.rainfall,
    riverDischargeM3s: params.riverDischargeM3s,
    floodThresholdM3s: params.floodThresholdM3s,
    elevationM: params.elevationM,
    historicalExposure: params.historicalExposure,
    soilImperviousness: params.soilImperviousness
  });

  const explainableFire = calculateExplainableFireRisk({
    frpMW: params.frpMW,
    tempC: params.tempC,
    windSpeedKmh: params.windSpeed,
    pm25: params.pm25
  });

  const basins = telemetry?.basins || [];
  const fireHotspots = telemetry?.fireHotspots || [];
  const currentBasin =
    basins.find((b) => b.id === selectedBasinId) || basins[0] || null;

  const handleSelectBasin = (basin) => {
    if (!basin) return;
    setSelectedBasinId(basin.id);
    const obsRain = Math.max(
      25,
      Math.round(
        (basin.observed?.rain24hMm || 45) +
          (basin.observed?.forecastRain72hMm || 60) * 0.35
      )
    );
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
      `Loaded Basin: ${basin.basinName} (${basin.district}) • GloFAS Discharge ${basin.observed?.riverDischargeM3s} m³/s`
    );
  };

  const handleRefreshAllLive = async () => {
    setIsSyncingLive(true);
    try {
      const fresh = await fetchLiveMultiHazardTelemetry();
      setLocalTelemetry(fresh);
      const activeBasin =
        fresh.basins.find((b) => b.id === selectedBasinId) || fresh.basins[0];
      if (activeBasin) handleSelectBasin(activeBasin);
      setLiveSyncStatus(
        `Synced live APIs at ${new Date().toLocaleTimeString('en-IN')}`
      );
    } finally {
      setIsSyncingLive(false);
    }
  };

  const handleParamChange = (field, value) => {
    setParams((prev) => ({ ...prev, [field]: parseFloat(value) }));
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Clean Top Header with Basin Selector Dropdown */}
      <div className="navy-surface border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 keep-white">
              OBSERVED TELEMETRY + EXPLAINABLE RISK ENGINE
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white keep-white mt-0.5">
              River Basin & Multi-Hazard Risk Predictor
            </h1>
            <p className="text-xs text-slate-300 keep-white max-w-2xl mt-1">
              Separates observed sensor data (Open-Meteo, GloFAS River Discharge, NASA FIRMS, CAMS) from weighted model risk scores (0–100).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Basin Selector Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="basin-select" className="text-xs text-slate-300 keep-white font-medium">
                Select Basin:
              </label>
              <select
                id="basin-select"
                value={selectedBasinId}
                onChange={(e) => {
                  const found = basins.find((b) => b.id === e.target.value);
                  if (found) handleSelectBasin(found);
                }}
                className="px-3 py-2 rounded-xl bg-[#112A45] border border-slate-600 text-white keep-white text-xs font-semibold cursor-pointer"
              >
                {basins.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#0B1F33] text-white">
                    {b.district} — {b.basinName} ({b.floodRisk?.score}/100)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRefreshAllLive}
              disabled={isSyncingLive}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1769AA] hover:bg-[#125488] text-white keep-white font-semibold text-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin' : ''}`} />
              <span>Sync APIs</span>
            </button>

            <button
              onClick={() =>
                onSpeakText(
                  `Risk Report: Flood Risk is ${explainableFlood.level} at ${explainableFlood.score} out of 100. Fire Risk is ${explainableFire.level} at ${explainableFire.score} out of 100.`
                )
              }
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#112A45] hover:bg-slate-800 text-white keep-white font-semibold text-xs border border-slate-600 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Audio</span>
            </button>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-300 keep-white bg-[#112A45] px-3.5 py-2 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-2">
          <span className="keep-white">Status: {liveSyncStatus}</span>
          <span className="text-sky-300 keep-white font-semibold">
            Model: Weighted Multi-Factor Scoring
          </span>
        </div>
      </div>

      {/* PRIMARY VIEW: Selected Basin Observed Data + Explainable Flood Model (Left) & What-If Sliders (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Observed Basin Telemetry + Flood Risk Weight Breakdown */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
          {/* Selected Basin Observed Summary */}
          {currentBasin && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    SELECTED BASIN TELEMETRY ({currentBasin.district})
                  </span>
                  <h2 className="text-base font-bold text-white mt-0.5">
                    {currentBasin.basinName}
                  </h2>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white keep-white ${
                    explainableFlood.score >= 75 ? 'bg-[#DC2626]' : 'bg-[#0B1F33]'
                  }`}
                >
                  Flood Score: {explainableFlood.score}/100 ({explainableFlood.level})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">24h Rainfall</span>
                  <strong className="text-white font-mono">{currentBasin.observed?.rain24hMm} mm</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">72h Forecast</span>
                  <strong className="text-white font-mono">{currentBasin.observed?.forecastRain72hMm} mm</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">GloFAS Discharge</span>
                  <strong className="text-white font-mono">{currentBasin.observed?.riverDischargeM3s} m³/s</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">River Trend</span>
                  <strong className="text-white font-mono">{currentBasin.observed?.dischargeTrend}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Explainable Flood Risk Contributors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Explainable Flood Risk Contributors (100% Total Weight)
              </h3>
              <span className="text-xs font-mono font-bold text-white">
                {explainableFlood.score} / 100
              </span>
            </div>

            {explainableFlood.contributors.map((c, idx) => (
              <div
                key={idx}
                className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800"
              >
                <div className="flex flex-wrap justify-between items-center text-xs gap-1">
                  <span className="font-semibold text-white">
                    {c.factor} <span className="text-slate-400 font-mono">({c.weight}% weight)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">
                      {c.provenance}: {c.rawValue}
                    </span>
                    <span className="font-bold font-mono text-white">{c.subScore}/100</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-300 bg-[#1769AA]"
                    style={{ width: `${c.subScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Clean What-If Simulation Sliders */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1769AA]" />
                <span>What-If Simulation Sliders</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#0B1F33] text-white keep-white font-semibold">
                Live Recalculation
              </span>
            </div>

            {/* Rainfall */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">24h + Forecast Rainfall (mm)</span>
                <span className="font-mono font-bold text-white">{params.rainfall} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={params.rainfall}
                onChange={(e) => handleParamChange('rainfall', e.target.value)}
                className="w-full accent-[#1769AA] h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* River Discharge */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">GloFAS River Discharge (m³/s)</span>
                <span className="font-mono font-bold text-white">{params.riverDischargeM3s} m³/s</span>
              </div>
              <input
                type="range"
                min="100"
                max="3500"
                step="50"
                value={params.riverDischargeM3s}
                onChange={(e) => handleParamChange('riverDischargeM3s', e.target.value)}
                className="w-full accent-[#1769AA] h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* NASA FIRMS FRP */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">NASA FIRMS Fire Power (MW)</span>
                <span className="font-mono font-bold text-white">{params.frpMW} MW</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="2"
                value={params.frpMW}
                onChange={(e) => handleParamChange('frpMW', e.target.value)}
                className="w-full accent-[#1769AA] h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Surface Temp & Wind */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Temp (°C)</span>
                  <span className="font-mono font-bold text-white">{params.tempC}°C</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="48"
                  step="1"
                  value={params.tempC}
                  onChange={(e) => handleParamChange('tempC', e.target.value)}
                  className="w-full accent-[#1769AA] h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Wind (km/h)</span>
                  <span className="font-mono font-bold text-white">{params.windSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={params.windSpeed}
                  onChange={(e) => handleParamChange('windSpeed', e.target.value)}
                  className="w-full accent-[#1769AA] h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* CAMS Smoke PM2.5 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">CAMS Particulate PM2.5 (µg/m³)</span>
                <span className="font-mono font-bold text-white">{params.pm25} µg/m³</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={params.pm25}
                onChange={(e) => handleParamChange('pm25', e.target.value)}
                className="w-full accent-[#1769AA] h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Summary Box of Both Models */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">FLOOD MODEL SCORE</span>
              <strong className="text-sm font-mono text-white">
                {explainableFlood.score}/100 ({explainableFlood.level})
              </strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">FIRE MODEL SCORE</span>
              <strong className="text-sm font-mono text-white">
                {explainableFire.score}/100 ({explainableFire.level})
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* COLLAPSIBLE DROPDOWN ACCORDIONS FOR ALL 6 BASINS & FIRE RISK MODEL */}
      <div className="space-y-3">
        {/* Accordion 1: Compare All 6 River Basins */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpenSection((prev) => (prev === 'all-basins' ? null : 'all-basins'))}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Waves className="w-4 h-4 text-[#1769AA] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Compare All 6 Monitored Maharashtra River Basins
                </h3>
                <p className="text-[11px] text-slate-400">
                  Click any basin card inside to load its live values into the calculator
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                openSection === 'all-basins' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSection === 'all-basins' && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {basins.map((b) => {
                const isSelected = selectedBasinId === b.id;
                const risk = b.floodRisk || { score: 72, level: 'HIGH' };
                return (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBasin(b)}
                    className={`rounded-xl p-4 border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-[#1769AA] bg-slate-950'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {b.district} • {b.riverName}
                        </span>
                        <h4 className="font-bold text-sm text-white">{b.basinName}</h4>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold text-white keep-white shrink-0 ${
                          risk.score >= 75 ? 'bg-[#DC2626]' : 'bg-[#0B1F33]'
                        }`}
                      >
                        {risk.score}/100
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                      <span>24h Rain: <strong className="text-white">{b.observed?.rain24hMm} mm</strong></span>
                      <span>72h Forecast: <strong className="text-white">{b.observed?.forecastRain72hMm} mm</strong></span>
                      <span>Discharge: <strong className="text-white">{b.observed?.riverDischargeM3s} m³/s</strong></span>
                      <span>Trend: <strong className="text-white">{b.observed?.dischargeTrend}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Accordion 2: Fire Risk Breakdown & NASA FIRMS Thermal Hotspots */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpenSection((prev) => (prev === 'fire-model' ? null : 'fire-model'))}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Flame className="w-4 h-4 text-[#1769AA] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Fire & Thermal Anomaly Risk Breakdown ({explainableFire.score}/100) + NASA FIRMS Hotspots ({fireHotspots.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Satellite Fire Radiative Power (FRP), surface temperature, wind speed, and CAMS PM2.5 smoke analysis
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                openSection === 'fire-model' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSection === 'fire-model' && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Fire Risk Contributors */}
              <div className="lg:col-span-7 space-y-2.5">
                <h4 className="text-xs font-bold uppercase text-slate-400">
                  Fire Risk Contributors ({explainableFire.level} — {explainableFire.score}/100)
                </h4>
                {explainableFire.contributors.map((c, idx) => (
                  <div
                    key={idx}
                    className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800"
                  >
                    <div className="flex flex-wrap justify-between items-center text-xs gap-1">
                      <span className="font-semibold text-white">
                        {c.factor} <span className="text-slate-400 font-mono">({c.weight}% weight)</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">
                          {c.provenance}: {c.rawValue}
                        </span>
                        <span className="font-bold font-mono text-white">{c.subScore}/100</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-300 bg-[#1769AA]"
                        style={{ width: `${c.subScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Active NASA FIRMS Hotspots */}
              <div className="lg:col-span-5 space-y-2.5">
                <h4 className="text-xs font-bold uppercase text-slate-400">
                  Active NASA FIRMS Hotspots ({fireHotspots.length})
                </h4>
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
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-600 cursor-pointer transition-all text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-white">{fh.location}</strong>
                      <span className="px-2 py-0.5 rounded bg-[#0B1F33] text-white keep-white text-[10px] font-mono font-semibold">
                        FRP {fh.frpMW} MW • {fh.brightnessK} K
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex flex-wrap gap-3">
                      <span>Coords: {fh.lat.toFixed(2)}, {fh.lon.toFixed(2)}</span>
                      <span>PM2.5: {fh.pm25} µg/m³</span>
                      <span>Risk: <strong className="text-white">{fh.fireRisk?.score || 76}/100</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
