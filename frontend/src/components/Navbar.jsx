import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Volume2,
  VolumeX,
  Eye,
  Type,
  PhoneCall,
  Radio,
  Layers,
  BrainCircuit,
  Binary,
  Truck,
  HeartPulse,
  Database,
  BarChart3,
  CloudRain,
  BookOpen,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  UserPlus,
  Home,
  Info,
  Mail,
  Globe,
  CheckCircle2,
  SlidersHorizontal
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
  currentUser
}) {
  const t = (key) => getTranslation(lang, key);

  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

  const moreRef = useRef(null);
  const langRef = useRef(null);
  const settingsRef = useRef(null);

  const activeLanguages = INDIAN_LANGUAGES.filter((l) => l.status === 'active');
  const currentLangObj = INDIAN_LANGUAGES.find((l) => l.code === lang) || INDIAN_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
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

  const primaryTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'overview', label: 'GIS Map', icon: Layers },
    { id: 'predictor', label: 'Risk Predictor', icon: BrainCircuit },
    { id: 'optimizer', label: 'Dispatch', icon: Truck },
    { id: 'contacts', label: 'Helplines', icon: PhoneCall }
  ];

  const moreModules = [
    { id: 'citizen', label: 'Citizen SOS & Shelters', icon: HeartPulse },
    { id: 'weather', label: 'Live Weather & Radar', icon: CloudRain },
    { id: 'damage', label: 'Building Damage Check', icon: Binary },
    { id: 'guide', label: 'Survival Guides', icon: BookOpen },
    { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'datasets', label: 'Datasets & Sources', icon: Database },
    { id: 'about', label: 'About Platform', icon: Info },
    { id: 'contact', label: 'Contact Control Room', icon: Mail },
    { id: 'signup', label: currentUser ? `Account (${currentUser.name.split(' ')[0]})` : 'Sign In / Alerts', icon: UserPlus }
  ];

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    setMenuDrawerOpen(false);
    setMoreDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 navy-surface border-b border-slate-700/80 shadow-sm w-full max-w-full">
      {/* Minimal Top Status Bar — Calm Navy, Pure White Text, Zero Rainbow Clutter */}
      <div className="bg-[#071524] border-b border-slate-800 px-3 sm:px-6 py-1 text-[11px] text-white keep-white">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-semibold text-white keep-white min-w-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate text-white keep-white">{t('stateEmergencyBar')}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-300 keep-white">
            <a href="tel:112" className="keep-white hover:text-white font-semibold">112 Emergency</a>
            <span className="text-slate-600 keep-white">•</span>
            <a href="tel:101" className="keep-white hover:text-white font-semibold">101 Fire</a>
            <span className="text-slate-600 keep-white">•</span>
            <a href="tel:108" className="keep-white hover:text-white font-semibold">108 Ambulance</a>
            <span className="text-slate-600 keep-white hidden sm:inline">•</span>
            <button
              onClick={() => handleNavigate('contacts')}
              className="keep-white hidden sm:inline hover:text-white underline font-semibold cursor-pointer"
            >
              City DM & Police Directory
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar — Clean, Uncluttered with Dropdowns */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Menu Drawer Button + Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setMenuDrawerOpen(!menuDrawerOpen)}
            className="keep-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-600 transition-colors shrink-0 cursor-pointer"
            aria-label="Open navigation drawer"
          >
            {menuDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="hidden sm:inline">Menu</span>
          </button>

          <div
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2 cursor-pointer min-w-0"
          >
            <div className="p-1.5 rounded-lg bg-[#1769AA] text-white keep-white shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-base font-bold tracking-tight text-white keep-white truncate">
              {t('title')}
            </span>
          </div>
        </div>

        {/* Center: Primary Navigation Tabs + "More Modules ▾" Dropdown (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`keep-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1769AA] text-white'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* More Modules Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`keep-white flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                moreModules.some((m) => m.id === activeTab)
                  ? 'bg-[#1769AA] text-white'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>More Modules</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {moreDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-60 rounded-xl navy-surface border border-slate-700 shadow-xl p-1.5 z-50 space-y-0.5">
                {moreModules.map((m) => {
                  const Icon = m.icon;
                  const isActive = activeTab === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleNavigate(m.id)}
                      className={`keep-white w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                        isActive ? 'bg-[#1769AA] text-white' : 'text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                      <span className="keep-white">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Language Dropdown + Display/Audio Settings Dropdown + Single SOS Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="keep-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg px-2.5 py-1.5 border border-slate-600 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span className="max-w-[64px] truncate">{currentLangObj.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-300 shrink-0" />
            </button>

            {langDropdownOpen && (
              <div className="fixed sm:absolute right-2 sm:right-0 top-20 sm:top-full mt-1.5 w-56 rounded-xl navy-surface border border-slate-700 shadow-xl p-2 z-50 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 keep-white">
                  Select Language
                </div>
                {activeLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`keep-white w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium flex items-center justify-between cursor-pointer ${
                      lang === l.code ? 'bg-[#1769AA] text-white' : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="keep-white">{l.name} ({l.label})</span>
                    {lang === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Display & Audio Settings Dropdown (Consolidates Theme, Font Size, Contrast, Voice & Siren) */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
              className="keep-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg px-2.5 py-1.5 border border-slate-600 transition-colors cursor-pointer"
              title="Display, Theme, Font Size & Audio Settings"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">Display & Audio</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {settingsDropdownOpen && (
              <div className="fixed sm:absolute right-2 sm:right-0 top-20 sm:top-full mt-1.5 w-64 rounded-xl navy-surface border border-slate-700 shadow-xl p-3 z-50 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 keep-white font-medium">Color Theme</span>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="keep-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold cursor-pointer"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-200 keep-white font-medium flex items-center gap-1">
                    <Type className="w-3.5 h-3.5" /> Text Size
                  </span>
                  <div className="flex items-center gap-1">
                    {['normal', 'large', 'xl'].map((sz, i) => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz)}
                        className={`keep-white px-2 py-1 rounded text-xs font-bold cursor-pointer ${
                          fontSize === sz ? 'bg-[#1769AA] text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {i === 0 ? 'A' : i === 1 ? 'A+' : 'A++'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700 space-y-1.5">
                  <button
                    onClick={onToggleSpeech}
                    className="keep-white w-full py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 keep-white">
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      Audio Briefing
                    </span>
                    <span className="text-[10px] text-sky-300 keep-white">{isSpeaking ? 'Stop' : 'Play'}</span>
                  </button>

                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className="keep-white w-full py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 keep-white">
                      <Eye className="w-3.5 h-3.5" /> High Contrast
                    </span>
                    <span className="text-[10px] text-sky-300 keep-white">{highContrast ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={onToggleSiren}
                    className="keep-white w-full py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 keep-white">
                      <Radio className="w-3.5 h-3.5" /> Acoustic Siren
                    </span>
                    <span className="text-[10px] text-sky-300 keep-white">{isSirenActive ? 'ACTIVE' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Single Reserved Red Action Button: SOS */}
          <button
            onClick={onOpenSOSModal}
            className="keep-white px-3 py-1.5 rounded-lg bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            SOS
          </button>
        </div>
      </div>

      {/* Slide-Out Navigation Drawer (When Menu is clicked) */}
      {menuDrawerOpen && (
        <>
          <div
            onClick={() => setMenuDrawerOpen(false)}
            className="fixed inset-0 top-[76px] bg-black/40 z-40"
          />
          <div className="fixed left-0 top-[76px] bottom-0 w-full max-w-xs navy-surface border-r border-slate-700 shadow-2xl z-50 overflow-y-auto p-4 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 keep-white">
                All Platform Sections
              </span>
              <button
                onClick={() => setMenuDrawerOpen(false)}
                className="keep-white p-1 rounded-lg bg-slate-800 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {[...primaryTabs, ...moreModules].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`keep-white w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#1769AA] text-white'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-sky-300 shrink-0" />
                    <span className="keep-white">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
