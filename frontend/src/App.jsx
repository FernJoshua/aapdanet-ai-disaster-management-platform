import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LiveAlertBanner from './components/LiveAlertBanner';
import HomeView from './components/HomeView';
import MapView from './components/MapView';
import LiveWeatherAndCyclone from './components/LiveWeatherAndCyclone';
import DisasterGuide from './components/DisasterGuide';
import DisasterPredictor from './components/DisasterPredictor';
import DamageAssessment from './components/DamageAssessment';
import ResourceOptimizer from './components/ResourceOptimizer';
import CitizenPortal from './components/CitizenPortal';
import DatasetsExplorer from './components/DatasetsExplorer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import EmergencyContacts from './components/EmergencyContacts';
import AuthPortal from './components/AuthPortal';
import AboutContactView from './components/AboutContactView';
import {
  createOperationsStore,
  SUPABASE_SQL_SCHEMA,
  HOSPITALS_DATA
} from './services/operationsStore';
import { fetchLiveMultiHazardTelemetry } from './services/realTimeService';
import { getTranslation, translatePhrase, getFullAudioBriefing } from './utils/translations';
import { ShieldAlert, X, PhoneCall, Flame, HeartHandshake, Shield, Database, Copy, CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [regionScope, setRegionScope] = useState('maharashtra');
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('light');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aapdanet_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Real-Time Operations Store State
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createOperationsStore((nextState) => {
      setOpsState({ ...nextState });
    });
  }

  const [opsState, setOpsState] = useState(() => storeRef.current.getState());
  const [selectedAlert, setSelectedAlert] = useState(() => opsState.alerts[0]);
  const [liveTelemetry, setLiveTelemetry] = useState(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isCloudConfigOpen, setIsCloudConfigOpen] = useState(false);

  // Optional Cloud Config Inputs (Supabase + NASA FIRMS)
  const [supabaseUrl, setSupabaseUrl] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('cfg_supabase_url') || '' : ''
  );
  const [supabaseKey, setSupabaseKey] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('cfg_supabase_key') || '' : ''
  );
  const [firmsKey, setFirmsKey] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('cfg_firms_key') || '' : ''
  );
  const [copiedSchema, setCopiedSchema] = useState(false);

  const audioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);

  const t = (key) => getTranslation(lang, key);
  const tr = (text) => translatePhrase(lang, text);

  // Sync live multi-hazard telemetry on mount and every 60 seconds
  useEffect(() => {
    let mounted = true;
    const loadTelemetry = async () => {
      try {
        const data = await fetchLiveMultiHazardTelemetry();
        if (mounted) setLiveTelemetry(data);
      } catch {
        // fallback handled inside service
      }
    };
    loadTelemetry();
    const timer = setInterval(loadTelemetry, 60000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-mode');
      root.classList.add('dark');
      root.classList.remove('light-mode');
    } else {
      root.classList.remove('dark-mode');
      root.classList.remove('dark');
      root.classList.add('light-mode');
    }
  }, [theme]);

  useEffect(() => {
    if (fontSize === 'xl') {
      document.documentElement.style.fontSize = '120%';
    } else if (fontSize === 'large') {
      document.documentElement.style.fontSize = '110%';
    } else {
      document.documentElement.style.fontSize = '100%';
    }
  }, [fontSize]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setIsSOSModalOpen(true);
      } else if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleToggleSpeech();
      } else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setHighContrast((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [opsState.alerts, isSpeaking, lang, activeTab]);

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (lang === 'mr') utterance.lang = 'mr-IN';
    else if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'gu') utterance.lang = 'gu-IN';
    else if (lang === 'bn') utterance.lang = 'bn-IN';
    else if (lang === 'ta') utterance.lang = 'ta-IN';
    else utterance.lang = 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const fullBriefing = getFullAudioBriefing(lang, activeTab, opsState.alerts, opsState.shelters);
      speakText(fullBriefing);
    }
  };

  const toggleSiren = () => {
    if (isSirenActive) {
      if (sirenOscRef.current) {
        sirenOscRef.current.stop();
        sirenOscRef.current.disconnect();
        sirenOscRef.current = null;
      }
      setIsSirenActive(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(650, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(950, audioCtxRef.current.currentTime + 0.5);

        gain.gain.setValueAtTime(0.15, audioCtxRef.current.currentTime);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start();
        sirenOscRef.current = osc;
        setIsSirenActive(true);
      } catch (err) {
        console.error('Audio beacon error:', err);
      }
    }
  };

  const handleAddSOS = (newReport) => {
    storeRef.current.addSOSReport(newReport);
  };

  const handleDispatchTeam = ({ sosId, teamId, routeData }) => {
    storeRef.current.dispatchTeamToSOS({ sosId, teamId, routeData });
  };

  const handleUpdateShelterOccupancy = (shelterId, deltaPeople) => {
    storeRef.current.updateShelterOccupancy(shelterId, deltaPeople);
  };

  const handleSaveCloudConfig = () => {
    try {
      localStorage.setItem('cfg_supabase_url', supabaseUrl.trim());
      localStorage.setItem('cfg_supabase_key', supabaseKey.trim());
      localStorage.setItem('cfg_firms_key', firmsKey.trim());
      storeRef.current.addTimelineEvent(
        'Cloud Database & NASA FIRMS configuration updated',
        supabaseUrl ? 'Supabase PostgreSQL + Realtime endpoint connected' : 'Running on BroadcastChannel + Local Persistence Bus',
        'CONFIG',
        'LIVE OPS'
      );
      setIsCloudConfigOpen(false);
    } catch {
      setIsCloudConfigOpen(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#090c10] text-slate-100 flex flex-col w-full max-w-full overflow-x-hidden transition-colors duration-200 ${highContrast ? 'high-contrast' : ''}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-yellow-400 focus:text-black focus:font-bold focus:p-3 focus:rounded-lg focus:shadow-2xl"
      >
        Skip directly to Main Disaster Content (Screen Reader)
      </a>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        fontSize={fontSize}
        setFontSize={setFontSize}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
        isSirenActive={isSirenActive}
        onToggleSiren={toggleSiren}
        onOpenSOSModal={() => setIsSOSModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        regionScope={regionScope}
        setRegionScope={setRegionScope}
        currentUser={currentUser}
      />

      {activeTab !== 'home' && (
        <LiveAlertBanner
          alerts={opsState.alerts}
          lang={lang}
          onSelectAlert={(alt) => {
            setSelectedAlert(alt);
            setActiveTab('overview');
          }}
          onSpeakAlert={speakText}
          onOpenContacts={() => setActiveTab('contacts')}
        />
      )}

      {/* Main Workspace: Left Sidebar Rail + Right Operational Viewport */}
      <div className="flex flex-1 w-full max-w-full overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenCloudConfig={() => setIsCloudConfigOpen(true)}
          alertCount={opsState.alerts.length}
          sosCount={opsState.sosReports.length}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main id="main-content" className="flex-1 w-full max-w-[1600px] mx-auto p-3 sm:p-5 lg:p-6" role="main">
        {activeTab === 'home' && (
          <HomeView
            alerts={opsState.alerts}
            shelters={opsState.shelters}
            sosReports={opsState.sosReports}
            rescueTeams={opsState.rescueTeams}
            timeline={opsState.timeline}
            liveTelemetry={liveTelemetry}
            onDispatchTeam={handleDispatchTeam}
            onUpdateShelterOccupancy={handleUpdateShelterOccupancy}
            onOpenCloudConfig={() => setIsCloudConfigOpen(true)}
            lang={lang}
            setActiveTab={setActiveTab}
            onSpeakText={speakText}
            onSelectAlert={(alt) => {
              setSelectedAlert(alt);
              setActiveTab('overview');
            }}
          />
        )}

        {activeTab === 'overview' && (
          <MapView
            alerts={opsState.alerts}
            shelters={opsState.shelters}
            rescueTeams={opsState.rescueTeams}
            sosReports={opsState.sosReports}
            hospitals={opsState.hospitals || HOSPITALS_DATA}
            activeRoutes={opsState.activeRoutes}
            liveTelemetry={liveTelemetry}
            onDispatchTeam={handleDispatchTeam}
            onUpdateShelterOccupancy={handleUpdateShelterOccupancy}
            lang={lang}
            onSpeakText={speakText}
            selectedAlert={selectedAlert}
          />
        )}

        {activeTab === 'weather' && (
          <LiveWeatherAndCyclone
            lang={lang}
            onSpeakText={speakText}
          />
        )}

        {activeTab === 'guide' && (
          <DisasterGuide
            lang={lang}
            onSpeakText={speakText}
          />
        )}

        {activeTab === 'predictor' && (
          <DisasterPredictor
            lang={lang}
            onSpeakText={speakText}
            liveTelemetry={liveTelemetry}
          />
        )}

        {activeTab === 'damage' && (
          <DamageAssessment
            lang={lang}
            onSpeakText={speakText}
          />
        )}

        {activeTab === 'optimizer' && (
          <ResourceOptimizer
            lang={lang}
            onSpeakText={speakText}
            sosReports={opsState.sosReports}
            rescueTeams={opsState.rescueTeams}
            shelters={opsState.shelters}
            onDispatchTeam={handleDispatchTeam}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenPortal
            shelters={opsState.shelters}
            lang={lang}
            onSubmitSOS={handleAddSOS}
            onSpeakText={speakText}
          />
        )}

        {activeTab === 'datasets' && (
          <DatasetsExplorer
            lang={lang}
            onSpeakText={speakText}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            lang={lang}
            onSpeakText={speakText}
          />
        )}

        {activeTab === 'contacts' && (
          <EmergencyContacts
            lang={lang}
            onSpeakText={speakText}
          />
        )}

        {activeTab === 'signup' && (
          <AuthPortal
            lang={lang}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'about' && (
          <AboutContactView
            mode="about"
            lang={lang}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'contact' && (
          <AboutContactView
            mode="contact"
            lang={lang}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* High-Contrast Dual-Theme Footer */}
      <footer className="bg-white dark:bg-[#090c10] border-t border-slate-200 dark:border-[#1a2230] px-4 sm:px-6 lg:px-8 py-8 text-xs text-slate-700 dark:text-slate-300 mt-10 w-full max-w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-slate-200 dark:border-[#1a2230]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span className="text-slate-900 dark:text-white font-black text-base tracking-tight">{t('title')}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('subtitle')}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-sky-400">{tr('Navigation')}</h4>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => setActiveTab('home')} className="text-left text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">{t('navHome')}</button>
                <button onClick={() => setActiveTab('overview')} className="text-left text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">{t('tabOverview')}</button>
                <button onClick={() => setActiveTab('weather')} className="text-left text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">{t('tabWeather')}</button>
                <button onClick={() => setActiveTab('guide')} className="text-left text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">{t('navGuides')}</button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-sky-400">{tr('AI & Public Services')}</h4>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => setActiveTab('predictor')} className="text-left text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">{t('tabPredictor')}</button>
                <button onClick={() => setActiveTab('damage')} className="text-left text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">{t('tabDamage')}</button>
                <button onClick={() => setActiveTab('optimizer')} className="text-left text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">{t('tabOptimizer')}</button>
                <button onClick={() => setActiveTab('contacts')} className="text-left text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">{t('navContacts')}</button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-sky-400">{tr('24/7 Toll-Free Helplines')}</h4>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a href="tel:112" className="keep-white px-2.5 py-2 rounded-lg bg-[#DC2626] hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-xs">
                  <PhoneCall className="w-3.5 h-3.5 shrink-0" /> 112 SOS
                </a>
                <a href="tel:101" className="keep-white px-2.5 py-2 rounded-lg bg-[#F97316] hover:bg-orange-600 text-white font-bold flex items-center gap-1.5 shadow-xs">
                  <Flame className="w-3.5 h-3.5 shrink-0" /> 101 Fire
                </a>
                <a href="tel:108" className="keep-white px-2.5 py-2 rounded-lg bg-[#15803D] hover:bg-green-700 text-white font-bold flex items-center gap-1.5 shadow-xs">
                  <HeartHandshake className="w-3.5 h-3.5 shrink-0" /> 108 EMS
                </a>
                <button onClick={() => setActiveTab('contacts')} className="keep-white px-2.5 py-2 rounded-lg bg-[#1769AA] hover:bg-[#0284C7] text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <Shield className="w-3.5 h-3.5 shrink-0" /> City DMs
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-slate-800 dark:text-slate-200 font-medium">© {new Date().getFullYear()} {t('title')}</span>
              <button onClick={() => setActiveTab('about')} className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white underline cursor-pointer">{t('navAbout')}</button>
              <button onClick={() => setActiveTab('contact')} className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white underline cursor-pointer">{t('navContact')}</button>
              <button onClick={() => setIsCloudConfigOpen(true)} className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white underline cursor-pointer">{tr('Cloud DB & API Config')}</button>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-slate-500 dark:text-slate-400">
              <span>{tr('WCAG 2.1 AA Accessible')}</span>
              <span>•</span>
              <span className="text-sky-600 dark:text-sky-400 font-medium">Open-Meteo • GloFAS • USGS • CAMS • FIRMS • RainViewer • OSRM</span>
            </div>
          </div>
        </div>
      </footer>
        </div>
      </div>

      {/* Cloud DB (Supabase) & NASA FIRMS Key Modal */}
      {isCloudConfigOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="navy-surface border-2 border-[#0284C7] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-white keep-white my-8">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-sky-300 keep-white font-black text-lg">
                <Database className="w-5 h-5" />
                <span className="keep-white">Real-Time Cloud Database (Supabase) & NASA FIRMS Configuration</span>
              </div>
              <button onClick={() => setIsCloudConfigOpen(false)} className="text-slate-300 keep-white hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 keep-white leading-relaxed">
              Out of the box, AapdaNet uses <strong>BroadcastChannel + LocalStorage</strong> for instant multi-window sync and public <strong>Open-Meteo, GloFAS, USGS, CAMS, RainViewer & OSRM</strong> feeds. To enable multi-device cloud persistence across different computers/phones, paste your free <strong>Supabase Project URL & Anon Key</strong> below:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-sky-300 keep-white mb-1">Supabase Project URL (Optional):</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white keep-white font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-sky-300 keep-white mb-1">Supabase Public Anon Key (Optional):</label>
                <input
                  type="text"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white keep-white font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-orange-300 keep-white mb-1">NASA FIRMS MAP_KEY (Optional — uses public VIIRS feed if blank):</label>
                <input
                  type="text"
                  value={firmsKey}
                  onChange={(e) => setFirmsKey(e.target.value)}
                  placeholder="Optional NASA FIRMS 32-char MAP_KEY"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white keep-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 keep-white">Ready-to-Run Supabase PostgreSQL Schema:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                    setCopiedSchema(true);
                    setTimeout(() => setCopiedSchema(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white keep-white flex items-center gap-1 text-[11px] font-bold"
                >
                  {copiedSchema ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 keep-white max-h-36 overflow-y-auto">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-slate-700">
              <button
                onClick={() => {
                  storeRef.current.resetOperationsDemo();
                  setIsCloudConfigOpen(false);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 keep-white font-bold text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo SOS / Shelters</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsCloudConfigOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white keep-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCloudConfig}
                  className="px-4 py-2 rounded-xl bg-[#15803D] hover:bg-green-600 text-white keep-white font-extrabold text-xs"
                >
                  Save & Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Quick SOS Modal (Alt+S) */}
      {isSOSModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="navy-surface border-2 border-[#F97316] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-[#F97316] keep-white font-black text-lg">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
                <span className="keep-white">QUICK EMERGENCY SOS (Alt+S)</span>
              </div>
              <button
                onClick={() => setIsSOSModalOpen(false)}
                className="text-slate-300 keep-white hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 keep-white leading-relaxed">
              Transmit immediate distress coordinates to National Emergency Response (112), Fire Brigade (101), Ambulance (108), or view City District Magistrate (DM) & Police Control numbers.
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              <a
                href="tel:112"
                className="keep-white py-3 bg-[#DC2626] hover:bg-red-500 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1 shadow-md"
              >
                <span className="text-base font-black keep-white">112</span>
                <span className="keep-white">All-in-One SOS</span>
              </a>
              <a
                href="tel:101"
                className="keep-white py-3 bg-[#F97316] hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1 shadow-md"
              >
                <span className="text-base font-black keep-white">101</span>
                <span className="keep-white">Fire & Rescue</span>
              </a>
              <a
                href="tel:108"
                className="keep-white py-3 bg-[#15803D] hover:bg-green-600 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1 shadow-md"
              >
                <span className="text-base font-black keep-white">108</span>
                <span className="keep-white">Ambulance</span>
              </a>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setIsSOSModalOpen(false);
                  setActiveTab('citizen');
                }}
                className="keep-white w-full py-2.5 bg-[#1769AA] hover:bg-[#0284C7] text-white font-bold text-xs rounded-xl"
              >
                Open Full GPS & Voice SOS Reporting Form
              </button>
              <button
                onClick={() => {
                  setIsSOSModalOpen(false);
                  setActiveTab('contacts');
                }}
                className="keep-white w-full py-2.5 bg-[#155E75] hover:bg-[#1769AA] text-white font-bold text-xs rounded-xl border border-sky-400/40"
              >
                Open City-Wise Police, DM / Collector & Public Representative Numbers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
