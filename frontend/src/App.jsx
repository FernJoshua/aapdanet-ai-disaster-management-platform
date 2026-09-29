import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
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
  INITIAL_ALERTS, 
  SHELTERS_DATA, 
  RESCUE_TEAMS, 
  CITIZEN_SOS_REPORTS 
} from './services/mockData';
import { getTranslation, translatePhrase, getFullAudioBriefing } from './utils/translations';
import { ShieldAlert, X, PhoneCall, Flame, HeartHandshake, Shield } from 'lucide-react';

export default function App() {
  // Default tab is Home ('home'), default language is English ('en'), default theme is Clean Navy/Light ('light')
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('light');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'normal', 'large', 'xl'
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aapdanet_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [alerts] = useState(INITIAL_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState(INITIAL_ALERTS[0]);
  const [shelters] = useState(SHELTERS_DATA);
  const [rescueTeams] = useState(RESCUE_TEAMS);
  const [sosReports, setSosReports] = useState(CITIZEN_SOS_REPORTS);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

  const audioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);

  const t = (key) => getTranslation(lang, key);
  const tr = (text) => translatePhrase(lang, text);

  // Sync Clean Light Palette (default) vs Dark Mode on root <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    } else {
      root.classList.remove('dark-mode');
      root.classList.add('light-mode');
    }
  }, [theme]);

  // Global Font Sizing Engine
  useEffect(() => {
    if (fontSize === 'xl') {
      document.documentElement.style.fontSize = '120%';
    } else if (fontSize === 'large') {
      document.documentElement.style.fontSize = '110%';
    } else {
      document.documentElement.style.fontSize = '100%';
    }
  }, [fontSize]);

  // Scroll to top on tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Keyboard accessibility shortcuts (Alt+S = SOS, Alt+A = Audio, Alt+C = Contrast)
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
        setHighContrast(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [alerts, isSpeaking, lang, activeTab]);

  // Web Speech API Text-to-Speech Engine
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }
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

  // Comprehensive Multi-Language Audio Briefing (Reads all active alerts, open shelters, and emergency numbers)
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const fullBriefing = getFullAudioBriefing(lang, activeTab, alerts, shelters);
      speakText(fullBriefing);
    }
  };

  // Acoustic Emergency Siren Beacon for low visibility
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
        console.error("Audio beacon error:", err);
      }
    }
  };

  const handleAddSOS = (newReport) => {
    setSosReports(prev => [newReport, ...prev]);
  };

  return (
    <div className={`min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col w-full max-w-full overflow-x-hidden transition-colors duration-200 ${highContrast ? 'high-contrast' : ''}`}>
      {/* Accessible Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-yellow-400 focus:text-black focus:font-bold focus:p-3 focus:rounded-lg focus:shadow-2xl"
      >
        Skip directly to Main Disaster Content (Screen Reader)
      </a>

      {/* Top Deep Navy (#0B1F33) Navbar with 3-Dash Menu Drawer */}
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
        currentUser={currentUser}
      />

      {/* Live Emergency Alert Ticker */}
      <LiveAlertBanner
        alerts={alerts}
        lang={lang}
        onSelectAlert={(alt) => {
          setSelectedAlert(alt);
          setActiveTab('overview');
        }}
        onSpeakAlert={speakText}
        onOpenContacts={() => setActiveTab('contacts')}
      />

      {/* Spacious, Fully Responsive Main Content Viewport */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 md:py-8 overflow-x-hidden" role="main">
        {activeTab === 'home' && (
          <HomeView
            alerts={alerts}
            shelters={shelters}
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
            alerts={alerts}
            shelters={shelters}
            rescueTeams={rescueTeams}
            sosReports={sosReports}
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
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenPortal
            shelters={shelters}
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

      {/* Deep Navy (#0B1F33) Website Footer */}
      <footer className="navy-surface border-t border-slate-700 px-4 sm:px-6 lg:px-8 py-8 text-xs text-slate-300 mt-10 w-full max-w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-slate-700">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-sky-400" />
                <span className="text-white keep-white font-black text-base tracking-tight">{t('title')}</span>
              </div>
              <p className="text-xs text-slate-300 keep-white leading-relaxed">
                {t('subtitle')}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-300 keep-white">{tr('Navigation')}</h4>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => setActiveTab('home')} className="text-left text-slate-300 keep-white hover:text-sky-300 transition-colors">{t('navHome')}</button>
                <button onClick={() => setActiveTab('overview')} className="text-left text-slate-300 keep-white hover:text-sky-300 transition-colors">{t('tabOverview')}</button>
                <button onClick={() => setActiveTab('weather')} className="text-left text-slate-300 keep-white hover:text-sky-300 transition-colors">{t('tabWeather')}</button>
                <button onClick={() => setActiveTab('guide')} className="text-left text-slate-300 keep-white hover:text-sky-300 transition-colors">{t('navGuides')}</button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-300 keep-white">{tr('AI & Public Services')}</h4>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => setActiveTab('predictor')} className="text-left text-slate-300 keep-white hover:text-sky-300 transition-colors">{t('tabPredictor')}</button>
                <button onClick={() => setActiveTab('damage')} className="text-left text-slate-300 keep-white hover:text-sky-300 transition-colors">{t('tabDamage')}</button>
                <button onClick={() => setActiveTab('optimizer')} className="text-left text-slate-300 keep-white hover:text-sky-300 transition-colors">{t('tabOptimizer')}</button>
                <button onClick={() => setActiveTab('contacts')} className="text-left text-slate-300 keep-white hover:text-sky-300 transition-colors">{t('navContacts')}</button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-300 keep-white">24/7 Toll-Free Helplines</h4>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a href="tel:112" className="keep-white px-2.5 py-2 rounded-lg bg-[#DC2626] hover:bg-red-500 text-white font-bold flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 shrink-0" /> 112 SOS
                </a>
                <a href="tel:101" className="keep-white px-2.5 py-2 rounded-lg bg-[#F97316] hover:bg-orange-500 text-white font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 shrink-0" /> 101 Fire
                </a>
                <a href="tel:108" className="keep-white px-2.5 py-2 rounded-lg bg-[#15803D] hover:bg-green-600 text-white font-bold flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 shrink-0" /> 108 EMS
                </a>
                <button onClick={() => setActiveTab('contacts')} className="keep-white px-2.5 py-2 rounded-lg bg-[#1769AA] hover:bg-[#0284C7] text-white font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 shrink-0" /> City DMs
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-400 keep-white">
            <div className="flex flex-wrap items-center gap-4">
              <span className="keep-white">© {new Date().getFullYear()} {t('title')}</span>
              <button onClick={() => setActiveTab('about')} className="keep-white hover:text-white underline">{t('navAbout')}</button>
              <button onClick={() => setActiveTab('contact')} className="keep-white hover:text-white underline">{t('navContact')}</button>
              <button onClick={() => setActiveTab('signup')} className="keep-white hover:text-white underline">{t('navSignUp')}</button>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-slate-300 keep-white">
              <span className="keep-white">WCAG 2.1 AA Accessible</span>
              <span className="keep-white">•</span>
              <span className="text-sky-300 keep-white">Zero-Key Maps & Live Open-Meteo Telemetry</span>
            </div>
          </div>
        </div>
      </footer>

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
