import React, { useState } from 'react';
import { 
  Binary, 
  Satellite, 
  Camera, 
  CheckCircle2, 
  AlertOctagon, 
  Layers, 
  Scan, 
  Eye, 
  Sparkles,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { getTranslation } from '../utils/translations';

export default function DamageAssessment({ lang, onSpeakText }) {
  const t = (key) => getTranslation(lang, key);

  const [activeView, setActiveView] = useState('post'); // 'pre', 'post', 'split'
  const [showDetections, setShowDetections] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSector, setSelectedSector] = useState('chiplun');

  // Simulated sectors in Maharashtra for satellite inspection
  const sectors = {
    chiplun: {
      name: "Chiplun Urban Basin (Vashishti River Flood Damage)",
      date: "Post-Monsoon Aerial Reconnaissance",
      stats: {
        totalBuildings: 142,
        destroyed: 28,
        majorDamage: 44,
        minorDamage: 38,
        intact: 32,
        overallDamagePercent: 62.4,
        estimatedDisplaced: "4,600 citizens"
      },
      detections: [
        { id: 1, x: 22, y: 35, w: 12, h: 14, status: 'destroyed', label: 'Commercial Warehouse: Collapsed' },
        { id: 2, x: 42, y: 48, w: 14, h: 16, status: 'major', label: 'Residential Block: 3m Submerged' },
        { id: 3, x: 65, y: 28, w: 16, h: 18, status: 'destroyed', label: 'Market Shed: Roof Swept Away' },
        { id: 4, x: 30, y: 68, w: 15, h: 14, status: 'major', label: 'Civic Dispensary: Flooded' },
        { id: 5, x: 75, y: 65, w: 13, h: 15, status: 'intact', label: 'High School: Elevated / Safe' },
        { id: 6, x: 55, y: 15, w: 14, h: 12, status: 'minor', label: 'Substation: Structural Intact' }
      ]
    },
    mahad: {
      name: "Mahad Hill Slope & Debris Footprint (Raigad)",
      date: "Landslide Impact Optical Run",
      stats: {
        totalBuildings: 88,
        destroyed: 34,
        majorDamage: 22,
        minorDamage: 18,
        intact: 14,
        overallDamagePercent: 71.8,
        estimatedDisplaced: "2,200 citizens"
      },
      detections: [
        { id: 1, x: 35, y: 40, w: 18, h: 22, status: 'destroyed', label: 'Hamlet Cluster: Mudslide Buried' },
        { id: 2, x: 60, y: 55, w: 14, h: 14, status: 'major', label: 'Bridge Approach: Severed' },
        { id: 3, x: 20, y: 25, w: 12, h: 14, status: 'intact', label: 'Forest Post: Stable Ridge' }
      ]
    }
  };

  const currentSector = sectors[selectedSector];

  const handleRunInference = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowDetections(true);
    }, 900);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'destroyed': return 'border-red-500 bg-red-500/20 text-red-300';
      case 'major': return 'border-amber-500 bg-amber-500/20 text-amber-300';
      case 'minor': return 'border-yellow-500 bg-yellow-500/20 text-yellow-300';
      case 'intact': return 'border-emerald-500 bg-emerald-500/20 text-emerald-300';
      default: return 'border-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">
              <Binary className="w-5 h-5" />
              <span>{t('damageTitle')}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              {t('damageSubtitle')}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              {t('damageDesc')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSpeakText(`Damage Assessment for ${currentSector.name}. Total buildings evaluated: ${currentSector.stats.totalBuildings}. Overall damage score is ${currentSector.stats.overallDamagePercent}%. Destroyed structures: ${currentSector.stats.destroyed}. Major damage: ${currentSector.stats.majorDamage}. Estimated displaced population: ${currentSector.stats.estimatedDisplaced}.`)}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors"
            >
              Audio Readout
            </button>

            <button
              onClick={handleRunInference}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Running CNN...' : t('damageRunBtn')}</span>
            </button>
          </div>
        </div>

        {/* Sector Selection & View Mode Toggles */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Target Sector:</span>
            <button
              onClick={() => setSelectedSector('chiplun')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                selectedSector === 'chiplun'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Chiplun Floods (Ratnagiri)
            </button>
            <button
              onClick={() => setSelectedSector('mahad')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                selectedSector === 'mahad'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Mahad Landslide (Raigad)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs font-medium">
              <button
                onClick={() => setActiveView('pre')}
                className={`px-3 py-1 rounded ${activeView === 'pre' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                {t('damagePre')}
              </button>
              <button
                onClick={() => setActiveView('post')}
                className={`px-3 py-1 rounded ${activeView === 'post' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                {t('damagePost')}
              </button>
            </div>

            <button
              onClick={() => setShowDetections(!showDetections)}
              className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${
                showDetections
                  ? 'bg-red-950/70 border-red-500 text-red-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {showDetections ? t('damageHideBoxes') : t('damageShowBoxes')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Imagery Viewer & Analytics Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Satellite Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center text-xs">
            <span className="font-mono text-cyan-400 flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5" />
              {currentSector.name} — {activeView.toUpperCase()} PASS
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Resolution: 0.5m GSD Multi-Spectral (xBD Standard)</span>
          </div>

          {/* Visual Canvas Representation */}
          <div className="relative w-full h-[460px] bg-slate-950 flex items-center justify-center overflow-hidden group select-none">
            {/* Synthetic Satellite Background Imagery with procedural terrain/grid */}
            <div 
              className={`absolute inset-0 transition-all duration-500 ${
                activeView === 'pre'
                  ? 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-900'
                  : 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950'
              }`}
            >
              {/* Procedural river / flood channel rendering */}
              <div 
                className={`absolute top-0 bottom-0 left-1/3 w-28 -rotate-12 transition-all duration-700 ${
                  activeView === 'pre' 
                    ? 'bg-blue-900/40 border-x border-blue-500/20' 
                    : 'bg-amber-900/70 border-x-4 border-amber-600/60 shadow-[0_0_50px_rgba(239,68,68,0.3)]'
                }`}
              />

              {/* Urban Grid Pattern */}
              <div className="absolute inset-0 opacity-20 pointer-events-none border border-cyan-500/30 grid grid-cols-6 grid-rows-6" />

              {/* Status Watermark */}
              <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded text-[11px] font-mono text-slate-300 backdrop-blur-sm">
                Layer: <strong className={activeView === 'post' ? 'text-red-400' : 'text-emerald-400'}>
                  {activeView === 'post' ? 'CRITICAL DISASTER OVERPASS' : 'NOMINAL BASELINE'}
                </strong>
              </div>
            </div>

            {/* CNN Bounding Boxes Overlay */}
            {showDetections && activeView === 'post' && currentSector.detections.map((box) => (
              <div
                key={box.id}
                style={{
                  position: 'absolute',
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.w}%`,
                  height: `${box.h}%`
                }}
                className={`border-2 rounded transition-all duration-300 cursor-pointer ${getStatusColor(box.status)} hover:scale-105 hover:z-20`}
                title={`${box.label} (${box.status.toUpperCase()})`}
              >
                <span className="absolute -top-5 left-0 px-1 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-black/80 text-white whitespace-nowrap">
                  {box.status}
                </span>
              </div>
            ))}

            {/* Radar scan-line animation effect */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 animate-pulse" />
          </div>

          {/* Legend */}
          <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-500 border border-white" />
                <span className="text-slate-300">Destroyed / Collapsed (28)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 border border-white" />
                <span className="text-slate-300">Major Structural Damage (44)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 border border-white" />
                <span className="text-slate-300">Structurally Intact (32)</span>
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">Intersection over Union (IoU): 0.88</span>
          </div>
        </div>

        {/* Right Column: Damage Summary KPI Metrics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Composite Score Card */}
          <div className="bg-slate-900 border border-red-900/60 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                  Sector Structural Impairment
                </span>
                <h3 className="text-3xl font-black text-red-400 mt-1">
                  {currentSector.stats.overallDamagePercent}%
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-700 flex items-center justify-center">
                <AlertOctagon className="w-6 h-6 text-red-400" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Structures Screened:</span>
                <strong className="font-mono text-white">{currentSector.stats.totalBuildings}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Completely Destroyed:</span>
                <strong className="font-mono text-red-400">{currentSector.stats.destroyed}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Submerged / Severely Compromised:</span>
                <strong className="font-mono text-amber-400">{currentSector.stats.majorDamage}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Estimated Citizen Displacement:</span>
                <strong className="font-mono text-cyan-300">{currentSector.stats.estimatedDisplaced}</strong>
              </div>
            </div>
          </div>

          {/* Action Recommendations for Relief Corps */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2 text-slate-300 shadow-xl">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-cyan-400 uppercase tracking-wider text-[11px]">
              <CheckCircle2 className="w-4 h-4" />
              Actionable Dispatch Directives
            </h4>
            <p className="text-slate-300">
              High density of collapsed roofs identified along riverbank strip. Deploy hydraulic cutters and shoring gear immediately.
            </p>
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                NDRF CSSR Required
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-amber-300">
                Drone Recon Queued
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
