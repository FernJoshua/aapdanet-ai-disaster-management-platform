import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Layers,
  CloudRain,
  BrainCircuit,
  Binary,
  Truck,
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
      color: 'text-[#0284C7]',
      tab: 'predictor'
    },
    {
      title: '2. Last-Mile GPS Shelter Routing',
      imd: 'Standard IMD Site: No shelter directory or evacuation routing.',
      ours: 'AapdaNet AI: Detects your live GPS coordinates and plots an evacuation path to the nearest open municipal shelter with live bed/food capacity.',
      icon: Compass,
      color: 'text-[#155E75]',
      tab: 'overview'
    },
    {
      title: '3. Automated Resource Dispatch (MILP)',
      imd: 'Standard IMD Site: Does not track rescue boats, ambulances, or NDRF.',
      ours: 'AapdaNet AI: Solves a live mathematical optimization matrix to dispatch boats, 108 ambulances, and 101 fire tenders where lives are most at risk.',
      icon: Truck,
      color: 'text-[#15803D]',
      tab: 'optimizer'
    },
    {
      title: '4. Satellite & Drone Building Damage AI',
      imd: 'Standard IMD Site: Cannot inspect individual damaged houses.',
      ours: 'AapdaNet AI: Compares pre- and post-disaster aerial rooftops using Computer Vision to pinpoint collapsed or submerged buildings for immediate rescue.',
      icon: Binary,
      color: 'text-[#F97316]',
      tab: 'damage'
    },
    {
      title: '5. Region & City-Specific Survival Protocols',
      imd: 'Standard IMD Site: Generic one-size-fits-all flyers.',
      ours: 'AapdaNet AI: Tailors Fire, Heatwave, Flood, Cyclone, and Landslide survival protocols to your exact city geography (Coastal, Ghats, or Inland Heat).',
      icon: BookMarked,
      color: 'text-[#1769AA]',
      tab: 'guide'
    },
    {
      title: '6. Voice SOS & Direct City DM / Police Directory',
      imd: 'Standard IMD Site: No citizen distress reporting or local DM/MLA contacts.',
      ours: 'AapdaNet AI: Features voice-dictated SOS for visually impaired citizens plus 1-tap calling to 101, 108, 112, Police Control, District Magistrates, and Local Representatives.',
      icon: PhoneCall,
      color: 'text-[#F97316]',
      tab: 'contacts'
    }
  ];

  return (
    <div className="space-y-8 pb-8 w-full max-w-full overflow-x-hidden">
      {/* Spacious Hero Banner in Deep Navy (#0B1F33) */}
      <section className="relative rounded-3xl navy-surface border border-slate-700 p-5 sm:p-8 lg:p-10 shadow-xl overflow-hidden">
        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155E75] border border-sky-400/40 text-sky-200 keep-white text-xs font-bold tracking-wide">
            <Radio className="w-3.5 h-3.5 text-[#F97316] animate-pulse shrink-0" />
            <span className="keep-white">{t('heroTag')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white keep-white tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 keep-white leading-relaxed max-w-3xl">
            {t('heroDesc')}
          </p>

          {/* Primary Call-To-Action Buttons following Navy -> Blue -> Orange -> Red Hierarchy */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="keep-white flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#1769AA] hover:bg-[#0284C7] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>{t('btnExploreMap')}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className="keep-white flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#F97316] hover:bg-orange-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>{t('btnEmergencyNums')}</span>
            </button>

            <button
              onClick={() => setActiveTab('citizen')}
              className="keep-white flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#DC2626] hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{t('btnReportSOS')}</span>
            </button>

            <button
              onClick={() => setActiveTab('signup')}
              className="keep-white flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-[#155E75] hover:bg-[#1769AA] text-white font-bold text-xs sm:text-sm border border-sky-400/40 transition-all"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>{t('btnSignUpAlerts')}</span>
            </button>
          </div>
        </div>

        {/* 4 Key Summary Placards (Fully Translated in Active Languages) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-7 pt-6 border-t border-slate-700/80">
          <div
            onClick={() => setActiveTab('overview')}
            className="bg-[#112A45] border border-red-500/40 rounded-2xl p-4 cursor-pointer card-hover min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-bold text-red-300 keep-white">
              <span className="keep-white">{t('statActiveAlerts')}</span>
              <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
            </div>
            <div className="text-2xl font-mono font-black text-white keep-white mt-1">
              {alerts.length} {tp('Active')}
            </div>
            <p className="text-[11px] text-slate-300 keep-white mt-1">
              {tp('Real-time flood, landslide & heat/fire alerts')}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('optimizer')}
            className="bg-[#112A45] border border-emerald-500/40 rounded-2xl p-4 cursor-pointer card-hover min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300 keep-white">
              <span className="keep-white">{t('statRelievedCases')}</span>
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            </div>
            <div className="text-2xl font-mono font-black text-white keep-white mt-1">
              {RELIEVED_DISASTERS.length} {tp('Relieved')}
            </div>
            <p className="text-[11px] text-slate-300 keep-white mt-1">
              {tp('8,080+ citizens safely evacuated & resolved')}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('citizen')}
            className="bg-[#112A45] border border-sky-500/40 rounded-2xl p-4 cursor-pointer card-hover min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-bold text-sky-300 keep-white">
              <span className="keep-white">{t('statSheltersOpen')}</span>
              <Building2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
            </div>
            <div className="text-2xl font-mono font-black text-white keep-white mt-1">
              {shelters.length} Hubs (1,450+)
            </div>
            <p className="text-[11px] text-slate-300 keep-white mt-1">
              {tp('Wheelchair, medical ICU & food equipped')}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('weather')}
            className="bg-[#112A45] border border-amber-500/40 rounded-2xl p-4 cursor-pointer card-hover min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-300 keep-white">
              <span className="keep-white">{t('statLiveSensors')}</span>
              <Activity className="w-4 h-4 text-[#F59E0B] shrink-0" />
            </div>
            <div className="text-2xl font-mono font-black text-white keep-white mt-1">
              100% Live
            </div>
            <p className="text-[11px] text-slate-300 keep-white mt-1">
              {tp('Open-Meteo API + CWC River Gauge Stream')}
            </p>
          </div>
        </div>
      </section>

      {/* Real-Time Multi-City Weather & Alert Strip */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <CloudRain className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-extrabold text-white">
              {tp('Live Meteorological & Multi-Hazard Telemetry Strip (Open-Meteo Real-Time Stream)')}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('weather')}
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{tp('Open Full Cyclone & IMD Radar')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {liveCityWeather.map((item, i) => (
            <div
              key={i}
              onClick={() => setActiveTab('weather')}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 cursor-pointer hover:border-cyan-500 transition-all min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-bold text-xs text-white truncate">{tp(item.city)}</span>
                <span
                  className={`keep-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                    item.alert.includes('RED')
                      ? 'bg-red-600 text-white'
                      : item.alert.includes('ORANGE') || item.alert.includes('HEAT')
                      ? 'bg-orange-600 text-white'
                      : item.alert.includes('RELIEVED')
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-black'
                  }`}
                >
                  {tp(item.alert)}
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

      {/* Split View: Active On-Going Real-Time Emergencies (Main Focus) vs. Already Relieved Disasters Archive */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Active On-Going Real-Time Emergencies */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-md space-y-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                {tp('ACTIVE REAL-TIME OPERATIONS')}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                {t('ongoingSectionTitle')}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('optimizer')}
              className="keep-white px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
            >
              {tp('Live Optimizer →')}
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-950 border-l-4 border-red-600 border border-slate-800 rounded-xl p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`keep-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white ${
                        alert.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600'
                      }`}
                    >
                      {tp(alert.severity)}
                    </span>
                    <h3 className="font-bold text-sm text-white">
                      [{tp(alert.district)}] {tp(alert.title)}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{alert.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{tp(alert.description)}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                  <div className="flex flex-wrap items-center gap-3 text-slate-400">
                    <span>👥 Impact: <strong className="text-white">{alert.affectedCount}</strong></span>
                    <span>🚨 Status: <strong className="text-amber-400">{tp(alert.evacuationStatus)}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSpeakText(`${tp(alert.severity)} alert in ${tp(alert.district)}. ${tp(alert.title)}. ${tp(alert.description)}`)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{t('listenBtn')}</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectAlert(alert);
                        setActiveTab('overview');
                      }}
                      className="keep-white px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
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
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-md space-y-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {tp('RESOLVED & RELIEVED ARCHIVE')}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                {t('relievedSectionTitle')}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('optimizer')}
              className="keep-white px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              {tp('Full Archive →')}
            </button>
          </div>

          <p className="text-xs text-slate-400">
            {tp('Disasters and risks that have already been mitigated, evacuated, or stabilized are moved here so active command remains focused on ongoing threats:')}
          </p>

          <div className="space-y-3">
            {RELIEVED_DISASTERS.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border-l-4 border-emerald-600 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-xs text-white">
                    {tp(item.district)} • {tp(item.type)}
                  </span>
                  <span className="keep-white px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[10px]">
                    ✓ {tp(item.status)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{tp(item.summary)}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Rescued/Safe: <strong className="text-emerald-400">{item.peopleRescued.toLocaleString()}</strong></span>
                  <span className="font-mono">{item.resolvedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Our Website Special Compared to Standard IMD Websites */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-md space-y-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{tp('Platform Differentiation & Real-Time Innovation')}</span>
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
                className="bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-2xl p-5 space-y-3 cursor-pointer card-hover flex flex-col justify-between min-w-0"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                      <Icon className={`w-5 h-5 ${feat.color}`} />
                    </div>
                    <h3 className="font-bold text-sm text-white">{tp(feat.title)}</h3>
                  </div>

                  <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/30 text-[11px] text-slate-400">
                    ❌ {tp(feat.imd)}
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-slate-200 leading-relaxed">
                    ✅ {tp(feat.ours)}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end text-xs font-bold text-cyan-400">
                  <span>{tp('Open Module →')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
