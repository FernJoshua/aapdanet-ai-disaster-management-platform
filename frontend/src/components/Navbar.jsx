import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  Globe,
  Eye,
  Volume2,
  VolumeX,
  BellRing,
  Radio,
  PhoneCall,
  Activity,
  Layers,
  BrainCircuit,
  Binary,
  Truck,
  HeartPulse,
  CloudRain,
  Database,
  BookMarked,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  Home,
  Info,
  Mail,
  UserPlus,
  Phone,
  Sparkles,
  CheckCircle2
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

  const [opsDropdownOpen, setOpsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [a11yDropdownOpen, setA11yDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [futureScopeLangNotice, setFutureScopeLangNotice] = useState(null);

  const opsRef = useRef(null);
  const langRef = useRef(null);
  const a11yRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (opsRef.current && !opsRef.current.contains(e.target)) setOpsDropdownOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangDropdownOpen(false);
      if (a11yRef.current && !a11yRef.current.contains(e.target)) setA11yDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLanguages = INDIAN_LANGUAGES.filter((l) => l.status === 'active');
  const futureLanguages = INDIAN_LANGUAGES.filter((l) => l.status === 'future');
  const currentLangObj = INDIAN_LANGUAGES.find((l) => l.code === lang) || activeLanguages[0];

  const operationsMenuItems = [
    {
      id: 'overview',
      label: t('tabOverview'),
      desc: 'Live interactive map, flood zones, GPS shelter routing & SOS pins',
      icon: Layers,
      color: 'text-cyan-400'
    },
    {
      id: 'weather',
      label: t('tabWeather'),
      desc: 'Open-Meteo live city telemetry, IMD Red/Orange/Yellow alerts & cyclone radar',
      icon: CloudRain,
      color: 'text-blue-400'
    },
    {
      id: 'predictor',
      label: t('tabPredictor'),
      desc: 'Real-time multi-hazard AI risk simulator synced with live city weather',
      icon: BrainCircuit,
      color: 'text-purple-400'
    },
    {
      id: 'damage',
      label: t('tabDamage'),
      desc: 'Visual pre/post-disaster aerial building inspection & rescue triage',
      icon: Binary,
      color: 'text-amber-400'
    },
    {
      id: 'optimizer',
      label: t('tabOptimizer'),
      desc: 'Live MILP rescue allocation + Relieved & Resolved Disasters Archive',
      icon: Truck,
      color: 'text-emerald-400'
    },
    {
      id: 'analytics',
      label: t('tabAnalytics'),
      desc: 'Real-time hydrological charts, multi-city weather graphs & IoT streams',
      icon: Activity,
      color: 'text-rose-400'
    },
    {
      id: 'datasets',
      label: t('tabDatasets'),
      desc: 'How live IMD/Open-Meteo feeds combine with IBM & xBD trained models',
      icon: Database,
      color: 'text-indigo-400'
    }
  ];

  const isOperationsTab = operationsMenuItems.some((item) => item.id === activeTab);

  const handleLanguageSelect = (item) => {
    if (item.status === 'future') {
      setFutureScopeLangNotice(item);
      setLangDropdownOpen(false);
    } else {
      setLang(item.code);
      setFutureScopeLangNotice(null);
      setLangDropdownOpen(false);
    }
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setOpsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg transition-colors">
      {/* Top Emergency & Quick Helpline Strip */}
      <div className="bg-gradient-to-r from-red-950/90 via-slate-900 to-amber-950/80 px-4 py-1.5 border-b border-red-900/30 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-semibold text-amber-400">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-500 shrink-0" />
              <span className="truncate sm:whitespace-normal">{t('stateEmergencyBar')}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <a
              href="tel:112"
              className="keep-white flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold transition-colors shadow-sm"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{t('call112')}</span>
            </a>
            <a
              href="tel:101"
              className="keep-white hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors"
            >
              <span>🔥 {t('fire101')}</span>
            </a>
            <a
              href="tel:108"
              className="keep-white hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
            >
              <span>🚑 {t('ambulance108')}</span>
            </a>
            <button
              onClick={() => handleNavClick('contacts')}
              className="text-cyan-300 hover:text-cyan-200 underline font-semibold ml-1"
            >
              All City & DM Numbers →
            </button>
          </div>
        </div>
      </div>

      {/* Future Scope Language Notification Banner (if a Future Scope language was clicked) */}
      {futureScopeLangNotice && (
        <div className="bg-amber-950/90 border-b border-amber-700 px-4 py-2.5 text-xs text-amber-200">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{futureScopeLangNotice.label} ({futureScopeLangNotice.name}) — Future Scope Notice:</strong> Complete end-to-end neural translation for <strong>{futureScopeLangNotice.label}</strong> is currently under development as part of our <strong>Future Scope</strong> roadmap. Please choose from our 6 fully translated languages (English, Hindi, Marathi, Gujarati, Tamil, Bengali) for 100% translated placards and guides.
              </span>
            </div>
            <button
              onClick={() => setFutureScopeLangNotice(null)}
              className="px-2.5 py-1 rounded bg-amber-800/80 hover:bg-amber-700 text-white font-bold text-[11px]"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Main Spacious Website Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => handleNavClick('home')}
        >
          <div className="keep-white relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 shadow-lg shadow-red-600/20">
            <ShieldAlert className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                {t('title')}
              </span>
              <span className="hidden xl:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                LIVE AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {t('badge')}
            </p>
          </div>
        </div>

        {/* Desktop Primary Menu Links (Home, Live Operations Dropdown, Guides, Contacts, SOS, About, Contact) */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-semibold">
          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'home'
                ? 'bg-cyan-600 text-white keep-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t('navHome')}</span>
          </button>

          {/* Live Operations Dropdown Menu */}
          <div className="relative" ref={opsRef}>
            <button
              onClick={() => setOpsDropdownOpen(!opsDropdownOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                isOperationsTab
                  ? 'bg-cyan-600 text-white keep-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t('navOperations').replace(' ▾', '')}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${opsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {opsDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 grid grid-cols-1 gap-1">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  Real-Time Command & AI Modules
                </div>
                {operationsMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-950/90 border border-cyan-500/50 text-white'
                          : 'hover:bg-slate-800/80 text-slate-200'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0 mt-0.5">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{item.label}</span>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('guide')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'guide'
                ? 'bg-cyan-600 text-white keep-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>{t('navGuides')}</span>
          </button>

          <button
            onClick={() => handleNavClick('contacts')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'contacts'
                ? 'bg-cyan-600 text-white keep-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>{t('navContacts')}</span>
          </button>

          <button
            onClick={() => handleNavClick('citizen')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'citizen'
                ? 'bg-cyan-600 text-white keep-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span>{t('navCitizen')}</span>
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`px-3 py-2 rounded-lg transition-all ${
              activeTab === 'about'
                ? 'bg-cyan-600 text-white keep-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            {t('navAbout')}
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`px-3 py-2 rounded-lg transition-all ${
              activeTab === 'contact'
                ? 'bg-cyan-600 text-white keep-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            {t('navContact')}
          </button>
        </nav>

        {/* Right Side Controls: Separate Language Dropdown, Light/Dark Mode, Accessibility Popover, Sign Up & SOS */}
        <div className="flex items-center gap-2">
          {/* 1. Separate Dedicated Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition-colors"
              title="Select Website Language"
              aria-label="Select Website Language"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{currentLangObj.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 max-h-[420px] overflow-y-auto">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-1 flex items-center justify-between">
                  <span>100% Translated Languages</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="grid grid-cols-1 gap-1 mt-1">
                  {activeLanguages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => handleLanguageSelect(item)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        lang === item.code
                          ? 'bg-emerald-600 text-white keep-white'
                          : 'hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <span>{item.name} ({item.label})</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                        Active
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-1 flex items-center justify-between">
                    <span>Future Scope (In Development)</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <p className="text-[10px] text-slate-400 px-2 mb-1.5">
                    Additional Eighth Schedule languages planned for upcoming neural NLP release:
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {futureLanguages.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => handleLanguageSelect(item)}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] bg-slate-800/50 hover:bg-slate-800 text-slate-400 border border-slate-800 text-left"
                      >
                        <span className="truncate">{item.label}</span>
                        <span className="text-[9px] text-amber-400 font-mono ml-1 shrink-0">Soon</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Light Mode / Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Light and Dark Mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline">{t('navThemeLight')}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                <span className="hidden xl:inline">{t('navThemeDark')}</span>
              </>
            )}
          </button>

          {/* 3. Accessibility & Voice Tools Popover (Un-cramps the header) */}
          <div className="relative" ref={a11yRef}>
            <button
              onClick={() => setA11yDropdownOpen(!a11yDropdownOpen)}
              className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold border transition-colors ${
                isSpeaking || highContrast || isSirenActive
                  ? 'bg-amber-500 text-black border-amber-400 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Accessibility, Voice Readout & Font Size Controls"
              aria-label="Accessibility Controls"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline">A11y</span>
            </button>

            {a11yDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                <div className="text-xs font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span>{t('a11yTitle')}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">WCAG AAA</span>
                </div>

                {/* Voice Readout */}
                <button
                  onClick={onToggleSpeech}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSpeaking
                      ? 'bg-amber-500 text-black animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                    {isSpeaking ? t('voiceStop') : t('voiceReadout')}
                  </span>
                  <span className="text-[10px] opacity-75">Alt+A</span>
                </button>

                {/* Siren Beacon */}
                <button
                  onClick={onToggleSiren}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSirenActive
                      ? 'bg-red-600 text-white keep-white animate-bounce'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-red-400" />
                    {t('sirenBtn')}
                  </span>
                  <span className="text-[10px] opacity-75">{isSirenActive ? 'ON' : 'OFF'}</span>
                </button>

                {/* High Contrast */}
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    highContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <span>{t('highContrast')}</span>
                  <span className="text-[10px] opacity-75">Alt+C</span>
                </button>

                {/* Global Font Size */}
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400 block mb-1.5 font-semibold">{t('textSize')}:</span>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                    <button
                      onClick={() => setFontSize('normal')}
                      className={`py-1.5 text-xs rounded-lg font-bold ${
                        fontSize === 'normal' ? 'bg-cyan-600 text-white keep-white' : 'text-slate-300'
                      }`}
                    >
                      A (100%)
                    </button>
                    <button
                      onClick={() => setFontSize('large')}
                      className={`py-1.5 text-xs rounded-lg font-bold ${
                        fontSize === 'large' ? 'bg-cyan-600 text-white keep-white' : 'text-slate-300'
                      }`}
                    >
                      A+ (112%)
                    </button>
                    <button
                      onClick={() => setFontSize('xl')}
                      className={`py-1.5 text-xs rounded-lg font-bold ${
                        fontSize === 'xl' ? 'bg-cyan-600 text-white keep-white' : 'text-slate-300'
                      }`}
                    >
                      A++ (125%)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Sign Up / User Portal Button */}
          <button
            onClick={() => handleNavClick('signup')}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeTab === 'signup'
                ? 'bg-indigo-600 text-white keep-white border-indigo-500'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-cyan-700/50'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{currentUser ? currentUser.name.split(' ')[0] : t('navSignUp')}</span>
          </button>

          {/* 5. Instant SOS Trigger */}
          <button
            onClick={onOpenSOSModal}
            className="keep-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-1.5 border border-red-400/40"
            title="Press Alt+S anytime to open SOS Broadcast"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden md:inline">SOS</span>
          </button>

          {/* 6. Mobile Hamburger Button (iOS / Android / Tablet) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Responsive Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${
                activeTab === 'home' ? 'bg-cyan-600 text-white keep-white' : 'bg-slate-800 text-slate-200'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t('navHome')}</span>
            </button>
            <button
              onClick={() => handleNavClick('guide')}
              className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${
                activeTab === 'guide' ? 'bg-cyan-600 text-white keep-white' : 'bg-slate-800 text-slate-200'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              <span>{t('navGuides')}</span>
            </button>
            <button
              onClick={() => handleNavClick('contacts')}
              className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${
                activeTab === 'contacts' ? 'bg-cyan-600 text-white keep-white' : 'bg-slate-800 text-slate-200'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>{t('navContacts')}</span>
            </button>
            <button
              onClick={() => handleNavClick('citizen')}
              className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${
                activeTab === 'citizen' ? 'bg-cyan-600 text-white keep-white' : 'bg-slate-800 text-slate-200'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span>{t('navCitizen')}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              {t('navOperations')}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {operationsMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-left ${
                      activeTab === item.id
                        ? 'bg-cyan-950 border border-cyan-500 text-white'
                        : 'bg-slate-800/70 text-slate-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleNavClick('about')}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{t('navAbout')}</span>
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t('navContact')}</span>
            </button>
            <button
              onClick={() => handleNavClick('signup')}
              className="keep-white p-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('navSignUp')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
