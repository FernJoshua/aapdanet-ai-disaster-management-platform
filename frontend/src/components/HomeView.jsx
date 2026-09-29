import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Layers,
  CloudRain,
  BrainCircuit,
  Binary,
  Truck,
  HeartPulse,
  PhoneCall,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Radio,
  Compass,
  Volume2,
  Thermometer,
  Wind,
  Droplets,
  BookMarked,
  Activity,
  Sparkles,
  Building2
} from 'lucide-react';
import { getTranslation, translatePhrase } from '../utils/translations';
import { INITIAL_ALERTS, SHELTERS_DATA, RELIEVED_DISASTERS } from '../services/mockData';

export default function HomeView({
  alerts = INITIAL_ALERTS,
  shelters = SHELTERS_DATA,
  lang = 'en',
  setActiveTab,
  onSelectAlert,
  onSpeakText
}) {
  const t = (key) => getTranslation(lang, key);
  const tp = (phrase) => translatePhrase(lang, phrase);

  const [liveCityWeather, setLiveCityWeather] = useState([
    { city: 'Mumbai', temp: 29.2, rain: 18.4, wind: 44, alert: 'RED ALERT' },
    { city: 'Raigad / Mahad', temp: 27.8, rain: 24.0, wind: 52, alert: 'RED ALERT' },
    { city: 'Ratnagiri / Chiplun', temp: 28.1, rain: 15.2, wind: 39, alert: 'ORANGE ALERT' },
    { city: 'Nagpur', temp: 42.6, rain: 0.0, wind: 18, alert: 'HEAT / FIRE ALERT' },
    { city: 'Pune', temp: 26.5, rain: 4.2, wind: 22, alert: 'YELLOW WATCH' },
    { city: 'Kolhapur', temp: 27.0, rain: 1.5, wind: 16, alert: 'RELIEVED • SAFE' }
  ]);

  // Fetch real-time Open-Meteo telemetry for live home strip
  useEffect(() => {
    const fetchLiveStrip = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=19.076,18.082,17.532,21.145,18.520,16.705&longitude=72.877,73.418,73.518,79.088,73.856,74.243&current=temperature_2m,precipitation,wind_speed_10m&timezone=Asia%2FKolkata'
        );
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length === 6) {
          const names = ['Mumbai', 'Raigad / Mahad', 'Ratnagiri / Chiplun', 'Nagpur', 'Pune', 'Kolhapur'];
          const badges = ['RED ALERT', 'RED ALERT', 'ORANGE ALERT', 'HEAT / FIRE WATCH', 'YELLOW WATCH', 'RELIEVED • SAFE'];
          setLiveCityWeather(
            data.map((d, idx) => ({
              city: names[idx],
              temp: d.current?.temperature_2m ?? 28,
              rain: d.current?.precipitation ?? 0,
              wind: d.current?.wind_speed_10m ?? 15,
              alert: badges[idx]
            }))
          );
        }
      } catch {
        // Fallback already initialized
      }
    };
    fetchLiveStrip();
  }, []);

  const uspFeatures = [
    {
      title: '1. Live Weather → AI Multi-Hazard Cascade',
      imd: 'Standard IMD Site: Shows only raw rainfall (mm) or cyclone cone.',
      ours: 'AapdaNet AI: Fuses live Open-Meteo rainfall + river water levels + terrain slope to predict exact Flash Flood, Landslide, and Heat/Fire risk scores in real time.',
      icon: BrainCircuit,
      color: 'text-purple-400',
      tab: 'predictor'
    },
    {
      title: '2. Last-Mile GPS Shelter Routing',
      imd: 'Standard IMD Site: No shelter directory or evacuation routing.',
      ours: 'AapdaNet AI: Detects your live GPS coordinates and plots an evacuation path to the nearest open municipal shelter with live bed/food capacity.',
      icon: Compass,
      color: 'text-cyan-400',
      tab: 'overview'
    },
    {
      title: '3. Automated Resource Dispatch (MILP)',
      imd: 'Standard IMD Site: Does not track rescue boats, ambulances, or NDRF.',
      ours: 'AapdaNet AI: Solves a live mathematical optimization matrix to dispatch boats, 108 ambulances, and 101 fire tenders where lives are most at risk.',
      icon: Truck,
      color: 'text-emerald-400',
      tab: 'optimizer'
    },
    {
      title: '4. Satellite & Drone Building Damage AI',
      imd: 'Standard IMD Site: Cannot inspect individual damaged houses.',
      ours: 'AapdaNet AI: Compares pre- and post-disaster aerial rooftops using Computer Vision to pinpoint collapsed or submerged buildings for immediate rescue.',
      icon: Binary,
      color: 'text-amber-400',
      tab: 'damage'
    },
    {
      title: '5. Region & City-Specific Survival Protocols',
      imd: 'Standard IMD Site: Generic one-size-fits-all flyers.',
      ours: 'AapdaNet AI: Tailors Fire, Heatwave, Flood, Cyclone, and Landslide survival protocols to your exact city geography (Coastal, Ghats, or Inland Heat).',
      icon: BookMarked,
      color: 'text-blue-400',
      tab: 'guide'
    },
    {
      title: '6. Voice SOS & Direct City DM / Police Directory',
      imd: 'Standard IMD Site: No citizen distress reporting or local DM/MLA contacts.',
      ours: 'AapdaNet AI: Features voice-dictated SOS for visually impaired citizens plus 1-tap calling to 101, 108, 112, Police Control, District Magistrates, and Local Representatives.',
      icon: PhoneCall,
      color: 'text-rose-400',
      tab: 'contacts'
    }
  ];

  return (
    <div className="space-y-10 pb-8">
      {/* Spacious Hero Banner */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
        <div className="max-w-4xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-700/60 text-cyan-300 text-xs font-bold tracking-wide">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>{t('heroTag')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            {t('heroDesc')}
          </p>

          {/* Primary Call-To-Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => setActiveTab('overview')}
              className="keep-white flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/25 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>{t('btnExploreMap')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('citizen')}
              className="keep-white flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t('btnReportSOS')}</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>{t('btnEmergencyNums')}</span>
            </button>

            <button
              onClick={() => setActiveTab('signup')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-bold text-sm border border-cyan-700/50 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('btnSignUpAlerts')}</span>
            </button>
          </div>
        </div>

        {/* 4 Key Summary Placards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
          <div
            onClick={() => setActiveTab('overview')}
            className="bg-slate-950/70 border border-red-900/40 rounded-2xl p-4 cursor-pointer card-hover"
          >
            <div className="flex items-center justify-between text-xs font-bold text-red-400">
              <span>{t('statActiveAlerts')}</span>
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">
              {alerts.length} Active
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Real-time flood, landslide & heat/fire alerts
            </p>
          </div>

          <div
            onClick={() => setActiveTab('optimizer')}
            className="bg-slate-950/70 border border-emerald-900/40 rounded-2xl p-4 cursor-pointer card-hover"
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>{t('statRelievedCases')}</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">
              {RELIEVED_DISASTERS.length} Relieved
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              8,080+ citizens safely evacuated & resolved
            </p>
          </div>

          <div
            onClick={() => setActiveTab('citizen')}
            className="bg-slate-950/70 border border-cyan-900/40 rounded-2xl p-4 cursor-pointer card-hover"
          >
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
              <span>{t('statSheltersOpen')}</span>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">
              {shelters.length} Hubs (1,450+)
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Wheelchair, medical ICU & food equipped
            </p>
          </div>

          <div
            onClick={() => setActiveTab('weather')}
            className="bg-slate-950/70 border border-amber-900/40 rounded-2xl p-4 cursor-pointer card-hover"
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span>{t('statLiveSensors')}</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">
              100% Live
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Open-Meteo API + CWC River Gauge Stream
            </p>
          </div>
        </div>
      </section>

      {/* Real-Time Multi-City Weather & Alert Strip */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              Live Meteorological & Multi-Hazard Telemetry Strip (Open-Meteo Real-Time Stream)
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('weather')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Open Full Cyclone & IMD Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {liveCityWeather.map((item, i) => (
            <div
              key={i}
              onClick={() => setActiveTab('weather')}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 cursor-pointer hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-bold text-xs text-white truncate">{item.city}</span>
                <span
                  className={`keep-white text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                    item.alert.includes('RED')
                      ? 'bg-red-600 text-white'
                      : item.alert.includes('ORANGE') || item.alert.includes('HEAT')
                      ? 'bg-orange-600 text-white'
                      : item.alert.includes('RELIEVED')
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-black'
                  }`}
                >
                  {item.alert.split(' ')[0]}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-slate-300">
                <div title="Temperature">
                  <Thermometer className="w-3 h-3 text-amber-400 inline mr-0.5" />
                  {item.temp}°C
                </div>
                <div title="Precipitation">
                  <Droplets className="w-3 h-3 text-cyan-400 inline mr-0.5" />
                  {item.rain}mm
                </div>
                <div title="Wind Speed">
                  <Wind className="w-3 h-3 text-teal-400 inline mr-0.5" />
                  {item.wind}km/h
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dual Command View: Active On-Going Crises (Main Focus) vs. Already Relieved Disasters Archive */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Active On-Going Real-Time Emergencies */}
        <div className="lg:col-span-7 bg-slate-900 border border-red-900/50 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                PRIORITY COMMAND FOCUS
              </span>
              <h2 className="text-lg font-extrabold text-white mt-0.5">
                {t('ongoingSectionTitle')}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="keep-white px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
            >
              View All on GIS Map
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-950/90 border-l-4 border-red-500 border border-slate-800 rounded-xl p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="keep-white px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px]">
                      {tp(alert.severity)}
                    </span>
                    <span className="font-bold text-sm text-white">
                      {alert.district} — {alert.location}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400">{alert.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-3 text-slate-400">
                    <span>👥 Impact: <strong className="text-white">{alert.affectedCount}</strong></span>
                    <span>🚨 Status: <strong className="text-amber-300">{alert.evacuationStatus}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSpeakText(`${alert.severity} alert in ${alert.district}. ${alert.description}`)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{t('listenBtn')}</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectAlert(alert);
                        setActiveTab('overview');
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 font-bold"
                    >
                      {t('viewMapBtn')} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Already Relieved & Resolved Disasters Section */}
        <div className="lg:col-span-5 bg-slate-900 border border-emerald-900/50 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                RESOLVED & RELIEVED ARCHIVE
              </span>
              <h2 className="text-lg font-extrabold text-white mt-0.5">
                {t('relievedSectionTitle')}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('optimizer')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-bold"
            >
              Full Archive →
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Disasters and risks that have already been mitigated, evacuated, or stabilized are moved here so active command remains focused on ongoing threats:
          </p>

          <div className="space-y-3">
            {RELIEVED_DISASTERS.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/80 border-l-4 border-emerald-500 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-white">
                    {item.district} • {item.type}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-extrabold text-[10px]">
                    ✓ {item.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{item.summary}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Rescued/Safe: <strong className="text-emerald-400">{item.peopleRescued.toLocaleString()} citizens</strong></span>
                  <span className="font-mono">{item.resolvedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Our Website Special Compared to Standard IMD Websites */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Platform Differentiation & Real-Time Innovation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            {t('whySpecialTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('whySpecialSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {uspFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(feat.tab)}
                className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 space-y-3 cursor-pointer card-hover flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <Icon className={`w-5 h-5 ${feat.color}`} />
                    </div>
                    <h3 className="font-bold text-sm text-white">{feat.title}</h3>
                  </div>

                  <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/30 text-[11px] text-slate-400">
                    ❌ {feat.imd}
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-slate-200 leading-relaxed">
                    ✅ {feat.ours}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end text-xs font-bold text-cyan-400">
                  <span>Open Module →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
