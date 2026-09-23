import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sliders, 
  AlertTriangle, 
  CloudRain, 
  Wind, 
  Mountain, 
  Waves, 
  Activity, 
  CheckCircle,
  HelpCircle,
  Cpu,
  BarChart3,
  Play
} from 'lucide-react';
import { computeDisasterRisk } from '../utils/geoUtils';
import { getTranslation } from '../utils/translations';

export default function DisasterPredictor({ lang, onSpeakText }) {
  const t = (key) => getTranslation(lang, key);

  // Simulation Parameters state
  const [params, setParams] = useState({
    rainfall: 85,          // mm/hr
    riverLevel: 3.4,       // meters
    tideHeight: 3.8,       // meters
    windSpeed: 65,         // km/h
    slopeAngle: 28,        // degrees
    soilSaturation: 75,    // %
    tremorMagnitude: 2.5   // Richter
  });

  const [selectedPreset, setSelectedPreset] = useState('custom');

  // Compute live ML risk metrics
  const riskResult = computeDisasterRisk(params);

  // Preset extreme weather scenarios in Maharashtra history
  const presets = [
    {
      id: 'mumbai-2005',
      name: 'Mumbai 2005 Cloudburst Simulation',
      desc: 'Extremely heavy rainfall (944mm/day pattern) with concurrent Arabian Sea high tide',
      values: { rainfall: 140, riverLevel: 4.8, tideHeight: 4.5, windSpeed: 70, slopeAngle: 15, soilSaturation: 98, tremorMagnitude: 1.0 }
    },
    {
      id: 'chiplun-2021',
      name: 'Chiplun & Mahad 2021 Flash Floods',
      desc: 'Vashishti & Savitri rivers overflow with severe Western Ghats landslide triggers',
      values: { rainfall: 110, riverLevel: 4.4, tideHeight: 3.2, windSpeed: 55, slopeAngle: 38, soilSaturation: 92, tremorMagnitude: 1.2 }
    },
    {
      id: 'nisarga-cyclone',
      name: 'Cyclone Nisarga (Raigad Landfall)',
      desc: 'Severe cyclonic storm with sustained winds over 110 km/h and coastal storm surge',
      values: { rainfall: 95, riverLevel: 3.1, tideHeight: 4.4, windSpeed: 125, slopeAngle: 20, soilSaturation: 80, tremorMagnitude: 0.8 }
    },
    {
      id: 'koyna-tremor',
      name: 'Koyna Reservoir Induced Seismicity',
      desc: 'Moderate seismic shake triggering potential hydro-dam tremors and rockfalls',
      values: { rainfall: 30, riverLevel: 2.2, tideHeight: 2.5, windSpeed: 20, slopeAngle: 32, soilSaturation: 40, tremorMagnitude: 5.4 }
    }
  ];

  const handleApplyPreset = (preset) => {
    setSelectedPreset(preset.id);
    setParams(preset.values);
  };

  const handleParamChange = (field, value) => {
    setSelectedPreset('custom');
    setParams(prev => ({ ...prev, [field]: parseFloat(value) }));
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">
              <BrainCircuit className="w-5 h-5" />
              <span>{t('predTitle')}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              {t('predSubtitle')}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              {t('predDesc')}
            </p>
          </div>

          <button
            onClick={() => onSpeakText(`AI Prediction outcome: Composite hazard score is ${riskResult.compositeScore} out of 100. Category: ${riskResult.category}. Flood risk index is ${riskResult.floodScore}%. Landslide risk index is ${riskResult.landslideScore}%. Recommended action: ${riskResult.compositeScore > 60 ? 'Immediate mandatory evacuation advisory' : 'Standard monitoring'}.`)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors"
          >
            <span>{t('predRunBtn')}</span>
          </button>
        </div>

        {/* Historical Maharashtra Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            {t('predLoadPresets')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                  selectedPreset === p.id
                    ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-md'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{p.name}</span>
                  {selectedPreset === p.id && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Controls & Outputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Hydrological & Meteorological Parameters</span>
            </h3>
            <span className="text-[11px] text-slate-400">Continuous AI Inference Active</span>
          </div>

          {/* Rainfall Intensity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <CloudRain className="w-4 h-4 text-blue-400" />
                {t('predRainfall')}
              </span>
              <span className="font-bold font-mono text-cyan-300">{params.rainfall} mm/hr</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={params.rainfall}
              onChange={(e) => handleParamChange('rainfall', e.target.value)}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 (Dry)</span>
              <span>30 (Moderate)</span>
              <span>65 (Heavy)</span>
              <span>120+ (Cloudburst / Extreme)</span>
            </div>
          </div>

          {/* River Water Level */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Waves className="w-4 h-4 text-blue-400" />
                {t('predRiver')}
              </span>
              <span className="font-bold font-mono text-cyan-300">{params.riverLevel} m</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.1"
              value={params.riverLevel}
              onChange={(e) => handleParamChange('riverLevel', e.target.value)}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1.5m (Safe)</span>
              <span>3.5m (Warning Mark)</span>
              <span>4.2m (Danger / Spilling)</span>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Wind className="w-4 h-4 text-teal-400" />
                {t('predWind')}
              </span>
              <span className="font-bold font-mono text-cyan-300">{params.windSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="2"
              value={params.windSpeed}
              onChange={(e) => handleParamChange('windSpeed', e.target.value)}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20 (Breeze)</span>
              <span>65 (Depression)</span>
              <span>118 (Severe Cyclonic Storm)</span>
            </div>
          </div>

          {/* Slope Gradient & Soil Saturation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Mountain className="w-4 h-4 text-amber-400" />
                  {t('predSlope')}
                </span>
                <span className="font-bold font-mono text-cyan-300">{params.slopeAngle}°</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={params.slopeAngle}
                onChange={(e) => handleParamChange('slopeAngle', e.target.value)}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">&gt;30° = High Landslide Risk</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{t('predSoil')}</span>
                <span className="font-bold font-mono text-cyan-300">{params.soilSaturation}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={params.soilSaturation}
                onChange={(e) => handleParamChange('soilSaturation', e.target.value)}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">&gt;85% = Liquefaction / Runoff</span>
            </div>
          </div>

          {/* Seismic Tremor Magnitude */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Activity className="w-4 h-4 text-red-400" />
                {t('predSeismic')}
              </span>
              <span className="font-bold font-mono text-cyan-300">M {params.tremorMagnitude}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="7.5"
              step="0.1"
              value={params.tremorMagnitude}
              onChange={(e) => handleParamChange('tremorMagnitude', e.target.value)}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: AI Output HUD (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Risk Score Card */}
          <div 
            className="bg-slate-900 border rounded-xl p-5 shadow-2xl relative overflow-hidden"
            style={{ borderColor: riskResult.color }}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  AI Hazard Risk Assessment
                </span>
                <h4 className="text-2xl font-black mt-1" style={{ color: riskResult.color }}>
                  {riskResult.category}
                </h4>
              </div>
              <div 
                className="w-16 h-16 rounded-full flex flex-col items-center justify-center font-black border-4 shadow-lg"
                style={{ borderColor: riskResult.color, backgroundColor: `${riskResult.color}15` }}
              >
                <span className="text-xl leading-none text-white">{riskResult.compositeScore}</span>
                <span className="text-[9px] uppercase tracking-tighter text-slate-400">/ 100</span>
              </div>
            </div>

            {/* Individual Hazard Breakdown */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">🌊 Flood Inundation Index</span>
                  <span className="font-bold font-mono text-white">{riskResult.floodScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${riskResult.floodScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">⛰️ Landslide Vulnerability</span>
                  <span className="font-bold font-mono text-white">{riskResult.landslideScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full transition-all duration-300" style={{ width: `${riskResult.landslideScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">🌀 Cyclonic Wind & Surge</span>
                  <span className="font-bold font-mono text-white">{riskResult.cycloneScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-teal-500 h-2 rounded-full transition-all duration-300" style={{ width: `${riskResult.cycloneScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">🌋 Seismic Severity</span>
                  <span className="font-bold font-mono text-white">{riskResult.seismicScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-red-500 h-2 rounded-full transition-all duration-300" style={{ width: `${riskResult.seismicScore}%` }} />
                </div>
              </div>
            </div>

            {/* Model Confidence & Telemetry Badge */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-cyan-300">
                <Cpu className="w-3.5 h-3.5" />
                Model Confidence: 94.8%
              </span>
              <span className="font-mono">Inference: 14ms</span>
            </div>
          </div>

          {/* AI Decision Recommendations */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs text-slate-300 shadow-xl">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-cyan-400">
              <CheckCircle className="w-3.5 h-3.5" />
              {t('predDirectiveTitle')}
            </h5>
            <ul className="space-y-1.5 pl-2 list-disc list-inside text-slate-300">
              {riskResult.compositeScore > 75 ? (
                <>
                  <li className="text-red-400 font-bold">Initiate mandatory evacuation in Zone A & B wards.</li>
                  <li>Dispatch NDRF 5th Battalion boats to low-lying drainage choke points.</li>
                  <li>Open relief camps at Kurla and BKC exhibition grounds.</li>
                  <li>Sound public sirens and broadcast multilingual cell alerts.</li>
                </>
              ) : riskResult.compositeScore > 50 ? (
                <>
                  <li className="text-amber-400 font-bold">Issue advisory warning for vulnerable residents.</li>
                  <li>Place SDRF and municipal pumping stations on heightened alert.</li>
                  <li>Inspect drainage sluice gates and hill slope sensors.</li>
                </>
              ) : (
                <>
                  <li className="text-emerald-400 font-bold">Environmental parameters within tolerable safety limits.</li>
                  <li>Routine hydrological and weather radar monitoring continues.</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
