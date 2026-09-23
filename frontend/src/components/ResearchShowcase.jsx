import React from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  FileText, 
  ExternalLink, 
  GitMerge, 
  CheckCircle2,
  Workflow,
  Cpu,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { RESEARCH_PAPERS } from '../services/mockData';
import { getTranslation } from '../utils/translations';

export default function ResearchShowcase({ lang, onSpeakText }) {
  const t = (key) => getTranslation(lang, key);

  return (
    <div className="space-y-6">
      {/* Platform Architecture & Research Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-xl p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              <span>National Disaster Decision Intelligence Architecture</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              AI-Powered Disaster Management & Decision Support Platform
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              An engineering initiative bridging multi-source data integration, deep learning flood and landslide forecasting, satellite computer vision damage assessment, and operational resource dispatch optimization.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-slate-400">Division: </span>
                <strong className="text-white">Applied AI & Geoinformatics Research Group</strong>
              </div>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-slate-400">Architecture: </span>
                <strong className="text-white">Multi-Source End-to-End Decision Support System</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onSpeakText("Project Overview: AI-Powered Disaster Management Platform. The platform integrates multi-hazard prediction, satellite damage assessment with convolutional neural networks, and resource optimization based on open queueing networks.")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/40"
            >
              Audio Readout of Literature Review
            </button>
          </div>
        </div>
      </div>

      {/* Identified Research Gaps */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2 text-cyan-400">
          <GitMerge className="w-4 h-4" />
          Identification of Research Gaps (From Literature Review)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-amber-400 text-sm">GAP 1: Fragmented Systems</div>
            <p className="text-slate-300 leading-relaxed">Existing solutions address hazard forecasting, damage assessment, and rescue resource allocation in completely isolated operational silos.</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 text-sm">GAP 2: Multi-Source Fusion</div>
            <p className="text-slate-300 leading-relaxed">Disparate meteorological radars, hydrological water gauges, and citizen crowdsourced reports lack dynamic unified ingestion.</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-rose-400 text-sm">GAP 3: Prediction-to-Action Gap</div>
            <p className="text-slate-300 leading-relaxed">Models generate risk predictions, but fail to directly convert them into actionable evacuation routes and optimal equipment dispatch.</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400 text-sm">GAP 4: Inclusive Accessibility</div>
            <p className="text-slate-300 leading-relaxed">Conventional portals lack accessibility for visually impaired citizens, voice SOS reporting, and multi-lingual regional language support.</p>
          </div>
        </div>
      </div>

      {/* Literature Review Catalog */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 text-indigo-400">
            <BookOpen className="w-4 h-4" />
            Curated Literature Review & Methodologies Catalog (15 Research Papers)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Foundation References</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESEARCH_PAPERS.map((paper) => (
            <div key={paper.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-white text-xs leading-snug">
                  [{paper.id}] {paper.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold shrink-0">
                  Paper #{paper.id}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Focus & Methods:</strong> {paper.focus} — {paper.methods}
              </p>
              <div className="text-xs text-cyan-300 bg-slate-900/80 p-2.5 rounded border border-slate-800 leading-relaxed">
                <strong>Relevance to Platform:</strong> {paper.relevance}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
