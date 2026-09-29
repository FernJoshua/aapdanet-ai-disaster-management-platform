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
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { INDIAN_LANGUAGES, getTranslation, translatePhrase } from '../utils/translations';

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
  const tp = (phrase) => translatePhrase(lang, phrase);

  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [futureLangNotice, setFutureLangNotice] = useState(null);

  const langRef = useRef(null);

  const activeLanguages = INDIAN_LANGUAGES.filter((l) => l.status === 'active');
  const futureLanguages = INDIAN_LANGUAGES.filter((l) => l.status === 'future');
  const currentLangObj = INDIAN_LANGUAGES.find((l) => l.code === lang) || INDIAN_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainPages = [
    { id: 'home', label: t('navHome'), icon: Home, badge: 'Main' },
    { id: 'contacts', label: t('navContacts'), icon: PhoneCall, badge: '101 / 108 / DM' },
    { id: 'guide', label: t('navGuides'), icon: BookOpen, badge: '8 Guides' },
    { id: 'citizen', label: t('navCitizen'), icon: HeartPulse, badge: 'Voice SOS' },
    { id: 'signup', label: currentUser ? currentUser.name.split(' ')[0] : t('navSignUp'), icon: UserPlus, badge: 'Portal' },
    { id: 'about', label: t('navAbout'), icon: Info },
    { id: 'contact', label: t('navContact'), icon: Mail }
  ];

  const operationModules = [
    { id: 'overview', label: t('tabOverview'), icon: Layers, color: 'text-sky-400' },
    { id: 'weather', label: t('tabWeather'), icon: CloudRain, color: 'text-sky-400' },
    { id: 'predictor', label: t('tabPredictor'), icon: BrainCircuit, color: 'text-sky-400' },
    { id: 'damage', label: t('tabDamage'), icon: Binary, color: 'text-amber-400' },
    { id: 'optimizer', label: t('tabOptimizer'), icon: Truck, color: 'text-emerald-400' },
    { id: 'analytics', label: t('tabAnalytics'), icon: BarChart3, color: 'text-sky-400' },
    { id: 'datasets', label: t('tabDatasets'), icon: Database, color: 'text-teal-400' }
  ];

  const handleSelectLanguage = (l) => {
    if (l.status === 'future') {
      setFutureLangNotice(l);
      setLang('en');
    } else {
      setFutureLangNotice(null);
      setLang(l.code);
    }
    setLangDropdownOpen(false);
  };

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    setMenuDrawerOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 navy-surface border-b border-slate-700/80 shadow-lg w-full max-w-full">
      {/* Top Status Strip (#0B1F33 Deep Navy with Pure White Text) */}
      <div className="bg-[#071524] border-b border-slate-800 px-3 sm:px-6 py-1.5 text-[11px] text-white keep-white" style={{ color: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-bold text-white keep-white min-w-0" style={{ color: '#FFFFFF' }}>
            <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A] shrink-0 animate-pulse" />
            <span className="truncate text-white keep-white" style={{ color: '#FFFFFF' }}>{t('stateEmergencyBar')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => handleNavigate('contacts')}
              className="keep-white flex items-center gap-1 bg-[#1769AA] hover:bg-[#0284C7] text-white px-2.5 py-0.5 rounded-full font-bold transition-colors text-[10px] sm:text-[11px]"
            >
              <PhoneCall className="w-3 h-3" />
              <span>City DM & Police Directory</span>
            </button>
            <a
              href="tel:101"
              className="keep-white flex items-center gap-1 bg-[#F97316] hover:bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold transition-colors text-[10px] sm:text-[11px]"
            >
              <span>{t('fire101')}</span>
            </a>
            <a
              href="tel:108"
              className="keep-white flex items-center gap-1 bg-[#15803D] hover:bg-[#16A34A] text-white px-2 py-0.5 rounded-full font-bold transition-colors text-[10px] sm:text-[11px]"
            >
              <span>{t('ambulance108')}</span>
            </a>
            <a
              href="tel:112"
              className="keep-white flex items-center gap-1 bg-[#DC2626] hover:bg-red-500 text-white px-2.5 py-0.5 rounded-full font-bold transition-colors text-[10px] sm:text-[11px]"
            >
              <span>112 SOS</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (#0B1F33 Deep Navy) — Clean 3-Dash Menu Architecture */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
        {/* Left: 3-Dash Hamburger Menu Button + Brand Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={() => setMenuDrawerOpen(!menuDrawerOpen)}
            className="keep-white flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1769AA] hover:bg-[#0284C7] text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
            aria-label="Open main navigation menu"
            aria-expanded={menuDrawerOpen}
          >
            {menuDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span>Menu</span>
          </button>

          <div
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          >
            <div className="p-2 rounded-xl bg-[#155E75]/60 border border-[#0284C7]/50 group-hover:border-[#0284C7] transition-all shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#38BDF8]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white keep-white truncate">
                  {t('title')}
                </span>
                <span className="hidden md:inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#155E75] text-sky-200 keep-white border border-sky-500/40 font-bold shrink-0">
                  {t('badge')}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 keep-white hidden sm:block truncate max-w-md">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls (Language, Audio Readout, Emergency Numbers, Theme) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Emergency Numbers Button */}
          <button
            onClick={() => handleNavigate('contacts')}
            className={`keep-white hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'contacts'
                ? 'bg-[#F97316] text-white shadow-md'
                : 'bg-[#155E75] hover:bg-[#1769AA] text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t('navContacts')}</span>
          </button>

          {/* Dedicated Separate Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="keep-white flex items-center gap-1.5 bg-[#155E75]/80 hover:bg-[#1769AA] text-white text-xs font-bold rounded-xl px-2.5 sm:px-3 py-2 border border-sky-400/30 transition-colors"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span className="max-w-[72px] sm:max-w-none truncate">{currentLangObj.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            </button>

            {langDropdownOpen && (
              <div className="fixed sm:absolute right-2 sm:right-0 top-24 sm:top-full mt-1 w-[calc(100vw-16px)] max-w-xs sm:w-80 max-h-[420px] overflow-y-auto rounded-2xl bg-[#0B1F33] border border-slate-600 shadow-2xl p-3 z-50 space-y-3 text-white">
                <div className="px-2 py-1 border-b border-slate-700">
                  <div className="text-xs font-extrabold text-sky-300 keep-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Fully Active Languages (Complete UI)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 keep-white">
                    100% translated across all placards, alerts & guides
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {activeLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleSelectLanguage(l)}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                        lang === l.code
                          ? 'bg-[#1769AA] text-white keep-white shadow-md'
                          : 'bg-slate-800/80 text-slate-200 keep-white hover:bg-slate-700'
                      }`}
                    >
                      <div>
                        <div className="keep-white">{l.name}</div>
                        <div className="text-[10px] opacity-80 keep-white">{l.label}</div>
                      </div>
                      {lang === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="px-2 pt-2 pb-1 border-t border-slate-700">
                  <div className="text-xs font-extrabold text-amber-400 keep-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Future Scope (In Development — 17 Languages)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 keep-white">
                    Scheduled for upcoming neural translation rollout
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {futureLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleSelectLanguage(l)}
                      className="px-2.5 py-1.5 rounded-lg text-left text-[11px] bg-slate-900/90 hover:bg-slate-800 text-slate-300 keep-white border border-slate-700 flex items-center justify-between"
                    >
                      <span className="truncate keep-white">{l.name} ({l.label})</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 keep-white border border-amber-700/40 shrink-0">
                        Soon
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audio Briefing Button (Reads Complete Multi-Hazard & Helpline Briefing) */}
          <button
            onClick={onToggleSpeech}
            className={`keep-white flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isSpeaking
                ? 'bg-[#F97316] text-white animate-pulse shadow-md'
                : 'bg-[#155E75]/80 text-white hover:bg-[#1769AA] border border-sky-400/30'
            }`}
            title="Listen to complete live disaster and helpline audio briefing"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            <span className="hidden md:inline">{isSpeaking ? t('voiceStop') : t('listenBtn')}</span>
          </button>

          {/* Theme Switcher (Default Clean Light vs Dark Mode) */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="keep-white flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-slate-600 transition-colors"
            title="Switch between Clean Light Mode and Dark Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-sky-300" />
            )}
          </button>
        </div>
      </div>

      {/* Future Scope Language Notification Banner */}
      {futureLangNotice && (
        <div className="bg-amber-950 border-t border-amber-700/70 px-4 py-2 text-xs text-amber-200 keep-white">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="keep-white">
                <strong className="keep-white">{futureLangNotice.name} ({futureLangNotice.label})</strong> is currently under our <strong>Future Scope Neural Translation Pipeline</strong>. Showing verified English interface or select Hindi, Marathi, Gujarati, Tamil, or Bengali.
              </span>
            </div>
            <button
              onClick={() => setFutureLangNotice(null)}
              className="text-amber-300 hover:text-white keep-white font-bold underline text-[11px]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 3-Dash (☰) Slide-Out / Dropdown Navigation Menu (Works on Both Laptop & Phone!) */}
      {menuDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuDrawerOpen(false)}
            className="fixed inset-0 top-[88px] bg-black/50 backdrop-blur-xs z-40"
          />

          {/* Slide-Out / Dropdown Panel in Deep Navy (#0B1F33) */}
          <div className="fixed left-0 top-[88px] bottom-0 w-full max-w-md navy-surface border-r border-slate-700 shadow-2xl z-50 overflow-y-auto p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400 keep-white">
                  {tp('Platform Navigation Menu')}
                </span>
                <h3 className="text-base font-extrabold text-white keep-white">
                  AapdaNet AI — Command & Public Portal
                </h3>
              </div>
              <button
                onClick={() => setMenuDrawerOpen(false)}
                className="keep-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Main Public Pages */}
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300 keep-white px-1">
                1. Main Website Pages
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {mainPages.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`keep-white w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#1769AA] text-white shadow-md border border-sky-400/50'
                          : 'bg-slate-800/70 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-sky-300 shrink-0" />
                        <span className="keep-white">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="keep-white text-[10px] px-2 py-0.5 rounded-full bg-[#0B1F33] text-sky-300 border border-sky-500/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Live Operations, GIS & AI Engines */}
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 keep-white px-1">
                2. Live Operations, GIS & AI Modules
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {operationModules.map((op) => {
                  const Icon = op.icon;
                  const isActive = activeTab === op.id;
                  return (
                    <button
                      key={op.id}
                      onClick={() => handleNavigate(op.id)}
                      className={`keep-white w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                        isActive
                          ? 'bg-[#1769AA] text-white shadow-md border border-sky-400/50'
                          : 'bg-slate-800/70 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${op.color}`} />
                      <span className="keep-white">{op.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Accessibility, Font Size & Siren Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-700">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 keep-white px-1">
                3. {t('a11yTitle')}
              </div>

              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 keep-white flex items-center gap-1.5">
                    <Type className="w-4 h-4 text-sky-400" />
                    {t('textSize')}
                  </span>
                  <div className="flex items-center gap-1">
                    {['normal', 'large', 'xl'].map((sz, i) => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz)}
                        className={`keep-white px-2.5 py-1 rounded-lg text-xs font-bold ${
                          fontSize === sz
                            ? 'bg-[#1769AA] text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {i === 0 ? 'A' : i === 1 ? 'A+' : 'A++'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`keep-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                      highContrast
                        ? 'bg-yellow-400 text-black'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('highContrast')}</span>
                  </button>

                  <button
                    onClick={onToggleSiren}
                    className={`keep-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                      isSirenActive
                        ? 'bg-[#DC2626] text-white animate-bounce'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5 text-orange-400" />
                    <span>{t('sirenBtn')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
