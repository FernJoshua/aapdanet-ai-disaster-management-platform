import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import LiveAlertBanner from './components/LiveAlertBanner';
import MapView from './components/MapView';
import LiveWeatherAndCyclone from './components/LiveWeatherAndCyclone';
import DisasterGuide from './components/DisasterGuide';
import DisasterPredictor from './components/DisasterPredictor';
import DamageAssessment from './components/DamageAssessment';
import ResourceOptimizer from './components/ResourceOptimizer';
import CitizenPortal from './components/CitizenPortal';
import DatasetsExplorer from './components/DatasetsExplorer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ResearchShowcase from './components/ResearchShowcase';
import { 
  INITIAL_ALERTS, 
  SHELTERS_DATA, 
  RESCUE_TEAMS, 
  CITIZEN_SOS_REPORTS 
} from './services/mockData';
import { getTranslation } from './utils/translations';
import { ShieldAlert, X, Volume2, Mic, Send } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [lang, setLang] = useState('mr'); // Default to Marathi
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'normal', 'large', 'xl'

  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState(INITIAL_ALERTS[0]);
  const [shelters, setShelters] = useState(SHELTERS_DATA);
  const [rescueTeams, setRescueTeams] = useState(RESCUE_TEAMS);
  const [sosReports, setSosReports] = useState(CITIZEN_SOS_REPORTS);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

  // Web Audio Context for Acoustic Emergency Siren Beacon
  const audioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);

  const t = (key) => getTranslation(lang, key);

  // Global Font Sizing Engine (Accurately scales root rem font-size for entire DOM)
  useEffect(() => {
    if (fontSize === 'xl') {
      document.documentElement.style.fontSize = '125%';
    } else if (fontSize === 'large') {
      document.documentElement.style.fontSize = '112.5%';
    } else {
      document.documentElement.style.fontSize = '100%';
    }
  }, [fontSize]);

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
  }, [alerts, isSpeaking]);

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
    
    // Choose appropriate voice tag based on selected language
    if (lang === 'mr') utterance.lang = 'mr-IN';
    else if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'gu') utterance.lang = 'gu-IN';
    else if (lang === 'bn') utterance.lang = 'bn-IN';
    else if (lang === 'ta') utterance.lang = 'ta-IN';
    else if (lang === 'te') utterance.lang = 'te-IN';
    else if (lang === 'ur') utterance.lang = 'ur-PK';
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
      const summary = alerts.length > 0
        ? `Disaster Operations Alert Broadcast. ${alerts[0].severity} alert in ${alerts[0].district}. ${alerts[0].description}. Press Alt plus S to transmit emergency SOS.`
        : "All disaster sectors are currently nominal.";
      speakText(summary);
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
    <div className={`min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col ${highContrast ? 'high-contrast' : ''}`}>
      {/* Accessible Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-yellow-400 focus:text-black focus:font-bold focus:p-3 focus:rounded-lg focus:shadow-2xl"
      >
        Skip directly to Main Disaster Content (Screen Reader)
      </a>

      {/* Top Navbar & Accessibility Toolbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        fontSize={fontSize}
        setFontSize={setFontSize}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
        isSirenActive={isSirenActive}
        onToggleSiren={toggleSiren}
        onOpenSOSModal={() => setIsSOSModalOpen(true)}
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
      />

      {/* Main Content Viewport */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6" role="main">
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

        {activeTab === 'research' && (
          <ResearchShowcase
            lang={lang}
            onSpeakText={speakText}
          />
        )}
      </main>

      {/* Clean Footer Without Personal or Institutional Names */}
      <footer className="bg-slate-950 border-t border-slate-900 px-4 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div>
            <span className="text-slate-400 font-semibold">{t('title')} — {t('badge')}</span>
            <p className="text-[11px] text-slate-600">Integrated Multi-Hazard Disaster Intelligence & Early Warning Network</p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span className="text-cyan-400">22 Indian Languages Active</span>
            <span>•</span>
            <span className="text-emerald-400">Zero-Key Map Architecture</span>
          </div>
        </div>
      </footer>

      {/* Global Quick SOS Modal (Alt+S) */}
      {isSOSModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-600 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-red-900/60 pb-3">
              <div className="flex items-center gap-2 text-red-500 font-black text-lg">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
                <span>QUICK EMERGENCY SOS (Alt+S)</span>
              </div>
              <button
                onClick={() => setIsSOSModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Transmit immediate distress coordinates to Emergency Police 112, Disaster Rescue Battalions, and Municipal Cells.
            </p>

            <div className="space-y-3">
              <a
                href="tel:112"
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
              >
                {t('call112')}
              </a>

              <button
                onClick={() => {
                  setIsSOSModalOpen(false);
                  setActiveTab('citizen');
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-700/60"
              >
                Open Full Voice and Text SOS Reporting Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
