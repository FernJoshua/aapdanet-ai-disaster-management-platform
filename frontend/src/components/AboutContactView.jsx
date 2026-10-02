import React, { useState } from 'react';
import {
  Info,
  Mail,
  PhoneCall,
  MapPin,
  ShieldCheck,
  Radio,
  Cpu,
  Globe,
  Eye,
  Send,
  CheckCircle2,
  Database,
  Layers
} from 'lucide-react';

export default function AboutContactView({ mode = 'about', setActiveTab }) {
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    city: 'Mumbai',
    subject: 'General Inquiry / Partnership',
    message: ''
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSent(true);
  };

  if (mode === 'contact') {
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>24x7 Command Desk & Public Liaison</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Contact Us & Emergency Operations Coordination
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Reach out to our operations support team, report civic infrastructure vulnerabilities, or connect with district control rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            {contactSent ? (
              <div className="text-center py-8 space-y-4">
                <div className="keep-white w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-white">Message Received by Operations Desk</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you, <strong>{contactForm.name}</strong>. Your inquiry has been logged and routed to the {contactForm.city} Regional Coordination Desk.
                </p>
                <button
                  onClick={() => setContactSent(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">
                  Send a Direct Message to Trinetra AI Coordination Desk
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Full Name"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">City / District</label>
                    <input
                      type="text"
                      value={contactForm.city}
                      onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Category</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option>General Inquiry / Feedback</option>
                      <option>Register New Relief Shelter</option>
                      <option>Municipality / NGO Integration</option>
                      <option>Report Broken Weather / River Sensor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="How can our disaster coordination team assist you?"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="keep-white px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 text-xs">
            <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">
              Direct Emergency & Control Room Channels
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-red-400 font-bold uppercase text-[10px]">Immediate Life-Threatening Crisis</span>
                <div className="text-base font-extrabold text-white">Dial 112 / 101 (Fire) / 108 (Ambulance)</div>
                <p className="text-slate-400">Available 24x7 toll-free across all mobile and landline networks.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold uppercase text-[10px]">State & District Control Rooms</span>
                <div className="text-base font-extrabold text-white">SEOC: 1070 • District DM: 1077</div>
                <p className="text-slate-400">Direct connection to State and District Collectorate Emergency Operations Centers.</p>
              </div>

              <button
                onClick={() => setActiveTab('contacts')}
                className="keep-white w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>View Full City-Wise Police, DM & Politicians Directory</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ABOUT US VIEW
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>About Trinetra AI Platform</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Bridging Real-Time Weather Intelligence with Last-Mile Crisis Rescue
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          <strong>Trinetra AI</strong> is an integrated, public-facing Multi-Hazard Disaster Management & Decision Support Platform. While conventional meteorological websites only display raw weather bulletins, Trinetra AI translates live atmospheric and river telemetry into actionable ground response: automated evacuation routing, AI multi-hazard risk prediction, computer-vision building damage triage, and mathematical resource dispatch.
        </p>
      </div>

      {/* How Our Real-Time Pipeline Works */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2.5">
          <Radio className="w-6 h-6 text-red-400" />
          <h3 className="font-bold text-sm text-white">1. Live Data Ingestion</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Streams real-time temperature, rainfall, wind gusts, and barometric pressure via the Open-Meteo API alongside IMD color alerts and CWC river gauge thresholds.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2.5">
          <Cpu className="w-6 h-6 text-purple-400" />
          <h3 className="font-bold text-sm text-white">2. AI Risk & Damage Triage</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Combines trained models (IBM Weather, xBD Satellite building polygons, CWC flood hydrographs) with live sensor inputs to predict floods, landslides, fires, and heatwaves.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2.5">
          <Layers className="w-6 h-6 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">3. Active vs. Relieved Tracking</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Separates ongoing real-time emergencies that require immediate boat/ambulance dispatch from already relieved and resolved disasters for clear situational awareness.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2.5">
          <Eye className="w-6 h-6 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">4. Universal Accessibility</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Built from the ground up for visually impaired, elderly, and differently-abled citizens with Voice SOS dictation, screen-reader lists, high contrast, and multilingual support.
          </p>
        </div>
      </div>
    </div>
  );
}
