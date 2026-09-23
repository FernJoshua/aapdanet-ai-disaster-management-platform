import React from 'react';
import { 
  ShieldAlert, 
  Globe, 
  Eye, 
  Volume2, 
  VolumeX, 
  Type, 
  BellRing, 
  Radio, 
  PhoneCall,
  Activity,
  Layers,
  BrainCircuit,
  Binary,
  Truck,
  HeartPulse,
  BookOpen,
  CloudRain,
  Database,
  LifeBuoy,
  BookMarked
} from 'lucide-react';
import { INDIAN_LANGUAGES, getTranslation } from '../utils/translations';

export default function Navbar({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  highContrast,
  setHighContrast,
  fontSize,
  setFontSize,
  isSpeaking,
  onToggleSpeech,
  isSirenActive,
  onToggleSiren,
  onOpenSOSModal
}) {
  const t = (key) => getTranslation(lang, key);

  const tabs = [
    { id: 'overview', label: t('tabOverview'), icon: Layers },
    { id: 'weather', label: t('tabWeather'), icon: CloudRain },
    { id: 'guide', label: t('tabGuide'), icon: BookMarked },
    { id: 'predictor', label: t('tabPredictor'), icon: BrainCircuit },
    { id: 'damage', label: t('tabDamage'), icon: Binary },
    { id: 'optimizer', label: t('tabOptimizer'), icon: Truck },
    { id: 'citizen', label: t('tabCitizen'), icon: HeartPulse },
    { id: 'datasets', label: t('tabDatasets'), icon: Database },
    { id: 'analytics', label: t('tabAnalytics'), icon: Activity },
    { id: 'research', label: t('tabResearch'), icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0c121e]/95 backdrop-blur-md border-b border-[#1e293b] shadow-xl">
      {/* Top Banner: Emergency Operations Bar */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/70 px-4 py-1.5 border-b border-red-900/40 text-xs flex flex-wrap justify-between items-center text-slate-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-amber-400">
            <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
            {t('stateEmergencyBar')}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden lg:inline text-slate-400">
            National Disaster Decision Support Network
          </span>
          <a 
            href="tel:112" 
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-extrabold transition-colors shadow-sm"
            title="Statewide Emergency Response Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            {t('call112')}
          </a>
        </div>
      </div>

      {/* Main Bar: Logo, Navigation, Accessibility Bar & Language Picker */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap justify-between items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 shadow-lg shadow-red-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                {t('title')}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                {t('badge')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Accessibility & Inclusive Tools Bar (Designed for Blind & Differently-Abled) */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-lg border border-slate-700/60 shadow-inner">
          <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">A11y:</span>
          </span>

          {/* Voice Audio Readout */}
          <button
            onClick={onToggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded font-medium transition-all ${
              isSpeaking
                ? 'bg-amber-500 text-black font-bold animate-pulse'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
            title="Read out current alerts and emergency status via text-to-speech"
            aria-label="Text to speech audio announcer"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden md:inline">{isSpeaking ? t('voiceStop') : t('voiceReadout')}</span>
          </button>

          {/* Audio Siren Beacon */}
          <button
            onClick={onToggleSiren}
            className={`p-1.5 rounded text-xs transition-all ${
              isSirenActive
                ? 'bg-red-600 text-white animate-bounce'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Emergency Audio Beacon for low visibility"
            aria-label="Toggle audible beacon"
          >
            <BellRing className="w-3.5 h-3.5" />
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-2.5 py-1 text-xs rounded font-bold transition-all ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-200'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Switch between high-contrast yellow/black and standard dark UI"
            aria-label="Toggle High Contrast Mode"
          >
            HC
          </button>

          {/* Font Scaling (Globally scales html root size) */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 text-xs rounded font-semibold transition-colors ${
                fontSize === 'normal' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Standard Font Size (100%)"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 text-xs rounded font-semibold transition-colors ${
                fontSize === 'large' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Large Font Size (115%)"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`px-2 py-0.5 text-xs rounded font-semibold transition-colors ${
                fontSize === 'xl' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Extra Large Font Size (130%)"
            >
              A++
            </button>
          </div>

          {/* 22 Indian Languages Switcher */}
          <div className="relative flex items-center pl-1 border-l border-slate-700">
            <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-slate-800 text-slate-100 text-xs py-1.5 px-2.5 rounded-lg border border-slate-600 focus:outline-none focus:border-cyan-400 font-medium cursor-pointer"
              aria-label="Select Official Indian Language"
            >
              {INDIAN_LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name} ({item.label})
                </option>
              ))}
            </select>
          </div>

          {/* Emergency SOS Transmit Button */}
          <button
            onClick={onOpenSOSModal}
            className="ml-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-lg shadow-lg shadow-red-600/30 flex items-center gap-1.5 border border-red-400/40 animate-pulse"
            title="Press Alt+S anytime to open SOS Broadcast"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SOS (Alt+S)</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none flex gap-1 border-t border-slate-800/80 pt-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? 'bg-slate-800/90 text-cyan-400 border-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
