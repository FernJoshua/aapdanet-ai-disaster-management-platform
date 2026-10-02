import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Menu,
  X,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ShieldAlert,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  Clock
} from 'lucide-react';
import { INDIAN_LANGUAGES, getTranslation } from '../utils/translations';

export default function Navbar({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  theme,
  setTheme,
  highContrast,
  setHighContrast,
  fontSize,
  setFontSize,
  isSpeaking,
  onToggleSpeech,
  isSirenActive,
  onToggleSiren,
  onOpenSOSModal,
  onToggleSidebar = () => {},
  regionScope = 'maharashtra',
  setRegionScope = () => {}
}) {
  const t = (key) => getTranslation(lang, key);

  // Live IST Clock matching reference screenshot ("09:58:51 IST")
  const [timeStr, setTimeStr] = useState(() =>
    new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' IST'
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' IST'
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

  const langRef = useRef(null);
  const settingsRef = useRef(null);

  const activeLanguages = INDIAN_LANGUAGES.filter((l) => l.status === 'active');
  const currentLangObj =
    INDIAN_LANGUAGES.find((l) => l.code === lang) || INDIAN_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#090c10] border-b border-[#1a2230] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-xs">
      {/* Left: Mobile Sidebar Toggle + Brand Identity (for mobile) / Breadcrumb (for desktop) */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-[#111620] border border-[#1a2230] text-slate-300 hover:text-white cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Brand identity on mobile, or context breadcrumb on desktop */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black lg:hidden">
            <Activity className="w-4 h-4 text-[#090c10]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold tracking-tight text-white truncate flex items-center gap-2">
              <span>AapdaNet AI</span>
              <span className="hidden md:inline text-[11px] text-[#637286] font-normal">/</span>
              <span className="hidden md:inline text-[11px] text-[#8e9bae] font-medium capitalize">
                {activeTab === 'home'
                  ? 'Command Center'
                  : activeTab === 'overview'
                  ? 'Operations Map'
                  : activeTab === 'predictor'
                  ? 'Risk Predictions'
                  : activeTab === 'optimizer'
                  ? 'Dispatch & Fleet'
                  : activeTab}
              </span>
            </div>
            <div className="text-[9px] text-[#637286] font-mono tracking-wider uppercase hidden sm:block">
              State Disaster Management Command Center
            </div>
          </div>
        </div>
      </div>

      {/* Center: System Status Pill & Region Scope Switcher (matches screenshot) */}
      <div className="hidden md:flex items-center gap-4">
        {/* System Operational Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111620] border border-[#1a2230] text-xs font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-emerald-400 tracking-wider">SYSTEM OPERATIONAL</span>
        </div>

        {/* Scope Toggle: [ MAHARASHTRA | NATIONAL ] matching screenshot */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-[#111620] border border-[#1a2230] text-xs">
          <button
            onClick={() => setRegionScope('maharashtra')}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              regionScope === 'maharashtra'
                ? 'bg-white text-black shadow-xs'
                : 'text-[#8e9bae] hover:text-white'
            }`}
          >
            MAHARASHTRA
          </button>
          <button
            onClick={() => setRegionScope('national')}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              regionScope === 'national'
                ? 'bg-white text-black shadow-xs'
                : 'text-[#8e9bae] hover:text-white'
            }`}
          >
            NATIONAL
          </button>
        </div>
      </div>

      {/* Right Controls: Real-Time Clock + Language + Display + SOS */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Live IST Clock (matches screenshot "09:58:51 IST") */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111620] border border-[#1a2230] text-[11px] font-mono text-[#8e9bae]">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-white font-semibold">{timeStr}</span>
        </div>

        {/* Language Picker Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111620] hover:bg-[#161c28] border border-[#1a2230] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{currentLangObj.name}</span>
            <span className="sm:hidden uppercase">{currentLangObj.code}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#111620] border border-[#1a2230] shadow-2xl py-1.5 z-50">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#637286] border-b border-[#1a2230]">
                Select Language
              </div>
              {activeLanguages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left hover:bg-[#161c28] transition-colors cursor-pointer ${
                    lang === l.code ? 'text-white font-bold bg-[#1a2230]' : 'text-slate-300'
                  }`}
                >
                  <span>{l.native}</span>
                  <span className="text-[10px] text-slate-400 uppercase">{l.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Display / Accessibility Dropdown */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setSettingsDropdownOpen((prev) => !prev)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#111620] hover:bg-[#161c28] border border-[#1a2230] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Display & Audio Settings"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {settingsDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111620] border border-[#1a2230] shadow-2xl p-3 z-50 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#637286] border-b border-[#1a2230] pb-1.5">
                Display & Audio
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Theme</span>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="px-2.5 py-1 rounded-md bg-[#1a2230] hover:bg-[#222a3a] text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                  <span className="capitalize">{theme}</span>
                </button>
              </div>

              {/* Text Size */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Text Size</span>
                <div className="flex items-center gap-1 bg-[#1a2230] rounded-md p-0.5">
                  {['normal', 'large', 'xl'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                        fontSize === sz ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Briefing */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1a2230]">
                <span className="text-slate-300">Audio Briefing</span>
                <button
                  onClick={onToggleSpeech}
                  className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                    isSpeaking ? 'bg-amber-600 text-white' : 'bg-[#1a2230] text-slate-300'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SOS Rapid Report Trigger Button (Restrained Alert Red) */}
        <button
          onClick={onOpenSOSModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#dc2626] hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          title="Send Emergency Distress Signal"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SOS</span>
        </button>
      </div>
    </header>
  );
}
