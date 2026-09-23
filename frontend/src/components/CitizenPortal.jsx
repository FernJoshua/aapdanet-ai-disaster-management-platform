import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Mic, 
  MicOff, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  AlertCircle,
  Home,
  Navigation,
  FileText,
  LifeBuoy,
  Users
} from 'lucide-react';
import { getTranslation } from '../utils/translations';
import { findNearestShelter } from '../utils/geoUtils';

export default function CitizenPortal({ 
  shelters, 
  lang, 
  onSubmitSOS, 
  onSpeakText 
}) {
  const t = (key) => getTranslation(lang, key);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: 'Mumbai Suburban',
    locationName: '',
    category: 'Flood Water Inundation (Trapped)',
    victimsCount: 2,
    hasDisabledOrElderly: false,
    description: ''
  });

  const [isRecording, setIsRecording] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [userCoords, setUserCoords] = useState([19.0728, 72.8795]);
  const [nearestShelter, setNearestShelter] = useState(shelters[0]);

  // Handle Voice Dictation using SpeechRecognition
  const handleVoiceSOS = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      onSpeakText("Listening for your SOS details. Please speak your location and emergency.");
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        description: prev.description ? `${prev.description} ${speechToText}` : speechToText
      }));
      setIsRecording(false);
      onSpeakText(`Recorded: ${speechToText}`);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleAutoGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserCoords(coords);
          setFormData(prev => ({ ...prev, locationName: `GPS Lat: ${coords[0].toFixed(4)}, Lon: ${coords[1].toFixed(4)}` }));
          const nearest = findNearestShelter(coords[0], coords[1], shelters);
          setNearestShelter(nearest);
          onSpeakText(`Location acquired. Nearest shelter is ${nearest.name}, approximately ${nearest.distanceKm} kilometers away.`);
        },
        () => {
          onSpeakText("Could not automatically acquire GPS. Defaulted to Mumbai Central corridor.");
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please provide at least your Name and Phone Number.");
      return;
    }

    const newTicket = {
      id: `SOS-MH-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      coordinates: userCoords,
      timestamp: "Just now",
      urgency: formData.hasDisabledOrElderly ? "P1 - CRITICAL" : "P2 - HIGH",
      status: "DISPATCHED",
      assignedUnit: "NDRF / SDRF Rapid Unit"
    };

    onSubmitSOS(newTicket);
    setSubmittedTicket(newTicket);
    onSpeakText(`Emergency SOS Transmitted successfully. Your tracking ticket is ${newTicket.id}. State Disaster Rescue Unit has been notified and dispatched.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm tracking-wider uppercase">
              <LifeBuoy className="w-5 h-5" />
              <span>{t('sosTitle')}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              {t('sosSubtitle')}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Direct telemetry link to Maharashtra SEOC Command Center. Designed for rapid emergency reporting by text or voice dictation, tailored for all citizens including visually impaired and elderly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:112"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-red-600/30"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t('sosCallBtn')}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SOS Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-red-950/80 rounded-xl p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              <span>{t('sosTransmitBtn')}</span>
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
              Direct Police & NDRF Link
            </span>
          </div>

          {submittedTicket ? (
            <div className="bg-emerald-950/60 border border-emerald-700/80 rounded-xl p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Emergency SOS Broadcast Active!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your report has been prioritized as <strong className="text-red-400">{submittedTicket.urgency}</strong> and assigned to <strong className="text-cyan-300">{submittedTicket.assignedUnit}</strong>.
              </p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 inline-block font-mono text-xs text-slate-300">
                Tracking Ticket ID: <strong className="text-yellow-400 text-sm">{submittedTicket.id}</strong>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-bold"
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t('sosName')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t('sosPhone')}</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98XXXXXXXX"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t('sosDistrict')}</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="Mumbai Suburban">Mumbai Suburban (Kurla/Bandra/Andheri)</option>
                    <option value="Mumbai City">Mumbai City (South Mumbai)</option>
                    <option value="Raigad">Raigad (Mahad/Poladpur/Alibag)</option>
                    <option value="Ratnagiri">Ratnagiri (Chiplun/Khed)</option>
                    <option value="Pune">Pune</option>
                    <option value="Kolhapur">Kolhapur (Shirol/Panchganga)</option>
                    <option value="Satara">Satara (Koyna)</option>
                    <option value="Thane">Thane</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex justify-between">
                    <span>{t('sosAddress')}</span>
                    <button
                      type="button"
                      onClick={handleAutoGPS}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" /> Auto-GPS
                    </button>
                  </label>
                  <input
                    type="text"
                    value={formData.locationName}
                    onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                    placeholder="Near Kranti Nagar Bridge, Kurla West"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t('sosNature')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="Flood Water Inundation (Trapped)">Flood Water Inundation (Trapped)</option>
                    <option value="Landslide Debris & Road Cutoff">Landslide Debris & Road Cutoff</option>
                    <option value="Building Collapse / Structural Cracks">Building Collapse / Structural Cracks</option>
                    <option value="Critical Medical / Oxygen / Dialysis Required">Critical Medical / Medication Needed</option>
                    <option value="Severe Tree Fall / High Tension Wire">Severe Tree Fall / Electrocution Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t('sosPeopleCount')}</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.victimsCount}
                    onChange={(e) => setFormData({ ...formData, victimsCount: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Vulnerable Citizens Checkbox */}
              <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-lg flex items-center gap-3">
                <input
                  type="checkbox"
                  id="vulnerable-check"
                  checked={formData.hasDisabledOrElderly}
                  onChange={(e) => setFormData({ ...formData, hasDisabledOrElderly: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <label htmlFor="vulnerable-check" className="text-slate-200 cursor-pointer select-none">
                  <strong>Priority Condition:</strong> {t('sosVulnerableCheck')}
                </label>
              </div>

              {/* Description + Voice SOS Dictate Button */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold">Incident Details / Situation</label>
                  <button
                    type="button"
                    onClick={handleVoiceSOS}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all ${
                      isRecording
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecording ? 'Listening (Speak Now)...' : t('sosDictateBtn')}</span>
                  </button>
                </div>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Water rising above waist height on ground floor. Electricity disconnected. Please send inflatable boat."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 border border-red-400/40 transition-all uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>{t('sosTransmitBtn')}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Nearest Shelter & Survival Guidelines (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Nearest Shelter Card */}
          {nearestShelter && (
            <div className="bg-slate-900 border border-emerald-800/80 rounded-xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Home className="w-4 h-4" />
                  {t('sosNearestShelterTitle')}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">
                  {nearestShelter.status}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{nearestShelter.name}</h4>
                <p className="text-slate-400 text-xs">{nearestShelter.district}</p>
                <div className="mt-2 text-xs text-slate-300 space-y-1">
                  <div><strong>Available Capacity:</strong> {nearestShelter.capacity - nearestShelter.currentOccupancy} seats</div>
                  <div><strong>Facilities:</strong> {nearestShelter.facilities.join(', ')}</div>
                  <div><strong>Helpline Officer:</strong> {nearestShelter.contactOfficer} ({nearestShelter.phone})</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => onSpeakText(`Assigned shelter is ${nearestShelter.name}, located in ${nearestShelter.district}. Call officer at ${nearestShelter.phone}. Facilities include water, medicine and meals.`)}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs rounded font-semibold text-center"
                >
                  Listen Directions
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${nearestShelter.coordinates[0]},${nearestShelter.coordinates[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded font-bold text-center"
                >
                  Navigate on GPS
                </a>
              </div>
            </div>
          )}

          {/* Quick Offline Survival Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              Essential Safety Protocols
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-800/60 rounded-lg border-l-2 border-blue-500">
                <strong className="text-white">Flood / Cloudburst:</strong> Switch off main electric circuit breakers. Never walk through moving water over 6 inches.
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-lg border-l-2 border-amber-500">
                <strong className="text-white">Landslide / Ghats:</strong> If rocks clatter or soil cracks, immediately move perpendicular away from slope path.
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-lg border-l-2 border-red-500">
                <strong className="text-white">Earthquake:</strong> Drop, Cover and Hold under a sturdy desk. Stay clear of glass windows and overhead facades.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
