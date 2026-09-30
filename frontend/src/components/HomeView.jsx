import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Layers,
  BrainCircuit,
  Truck,
  PhoneCall,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Radio,
  Compass,
  Volume2,
  Building2,
  RefreshCw,
  Flame,
  Waves,
  Clock,
  Database,
  Satellite,
  ChevronDown
} from 'lucide-react';
import { getTranslation, translatePhrase } from '../utils/translations';
import { INITIAL_ALERTS, SHELTERS_DATA, RELIEVED_DISASTERS } from '../services/mockData';
import { fetchLiveMultiHazardTelemetry, fetchOSRMRoadRoute } from '../services/realTimeService';
import { INITIAL_TIMELINE } from '../services/operationsStore';

export default function HomeView({
  alerts = INITIAL_ALERTS,
  shelters = SHELTERS_DATA,
  sosReports = [],
  rescueTeams = [],
  timeline = INITIAL_TIMELINE,
  liveTelemetry: propTelemetry = null,
  onDispatchTeam,
  onUpdateShelterOccupancy,
  onOpenCloudConfig,
  lang = 'en',
  setActiveTab = () => {},
  onSelectAlert = () => {},
  onSpeakText = () => {}
}) {
  const t = (key) => getTranslation(lang, key);
  const tp = (phrase) => translatePhrase(lang, phrase);

  const [isSyncing, setIsSyncing] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [localTelemetry, setLocalTelemetry] = useState(null);
  const telemetry = propTelemetry || localTelemetry;

  // Collapsible accordion state - keeps the page uncluttered by default
  const [openAccordion, setOpenAccordion] = useState('basins');
  const [selectedBasinId, setSelectedBasinId] = useState('ALL');

  const [lastSyncTime, setLastSyncTime] = useState(
    new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST'
  );

  const syncAllRealTimeFeeds = async () => {
    setIsSyncing(true);
    try {
      const data = await fetchLiveMultiHazardTelemetry();
      setLocalTelemetry(data);
      setLastSyncTime(
        new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST'
      );
    } catch {
      // Keep fallback state
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!propTelemetry) {
      syncAllRealTimeFeeds();
    }
    const interval = setInterval(syncAllRealTimeFeeds, 60000);
    return () => clearInterval(interval);
  }, [propTelemetry]);

  const handleQuickDispatch = async (sos) => {
    if (!onDispatchTeam || !sos) return;
    const availableTeam =
      rescueTeams.find((team) => team.status === 'AVAILABLE') || rescueTeams[0];
    if (!availableTeam) return;

    setDispatchingId(sos.id);
    try {
      const routeData = await fetchOSRMRoadRoute(
        availableTeam.coordinates,
        sos.coordinates
      );
      onDispatchTeam({
        sosId: sos.id,
        teamId: availableTeam.id,
        routeData
      });
      onSpeakText(
        `${availableTeam.name} dispatched to ${sos.id} at ${sos.locationName}. Road distance ${routeData.distanceKm} kilometers, ETA ${routeData.durationMin} minutes.`
      );
    } finally {
      setDispatchingId(null);
    }
  };

  const basins = telemetry?.basins || [];
  const filteredBasins =
    selectedBasinId === 'ALL'
      ? basins.slice(0, 3)
      : basins.filter((b) => b.id === selectedBasinId);

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const uspFeatures = [
    {
      title: '1. Live Weather + GloFAS → Explainable Risk',
      imd: 'Standard Weather Site: Shows raw rainfall (mm) or static maps only.',
      ours: 'AapdaNet AI: Combines live Open-Meteo rainfall + GloFAS river discharge + elevation into an explainable 0–100 Flood & Fire score.',
      icon: BrainCircuit,
      tab: 'predictor'
    },
    {
      title: '2. Interactive SOS → OSRM Road Dispatch',
      imd: 'Standard Weather Site: No citizen SOS triage or rescue routing.',
      ours: 'AapdaNet AI: Select any SOS call to find the nearest available team, compute the OSRM road route, and dispatch in 1 click.',
      icon: Truck,
      tab: 'overview'
    },
    {
      title: '3. Live Shelter Occupancy & Supply Tracking',
      imd: 'Standard Weather Site: No shelter capacity or bed tracking.',
      ours: 'AapdaNet AI: Tracks live shelter occupancy and Water/Food/Medical/Power availability with instant cross-tab sync.',
      icon: Building2,
      tab: 'citizen'
    },
    {
      title: '4. NASA FIRMS Thermal Fire + CAMS Smoke',
      imd: 'Standard Weather Site: Does not combine satellite fire data with air quality.',
      ours: 'AapdaNet AI: Plots NASA FIRMS satellite thermal anomalies alongside CAMS PM2.5 and Carbon Monoxide levels.',
      icon: Flame,
      tab: 'overview'
    },
    {
      title: '5. RainViewer Live Radar + Basin Monitoring',
      imd: 'Standard Weather Site: Static radar images isolated from river basins.',
      ours: 'AapdaNet AI: Overlays live RainViewer radar tiles directly over Savitri, Vashishti, and Mithi flood basins.',
      icon: Compass,
      tab: 'overview'
    },
    {
      title: '6. Voice SOS & Direct City DM / Police Directory',
      imd: 'Standard Weather Site: No direct District Magistrate or 112/101/108 dialer.',
      ours: 'AapdaNet AI: Voice-guided SOS plus 1-tap calling to 112, 101, 108, and District Collectors.',
      icon: PhoneCall,
      tab: 'contacts'
    }
  ];

  return (
    <div className="space-y-6 pb-8 w-full max-w-full overflow-x-hidden">
      {/* Clean, Restrained Hero Banner in Deep Navy (#0B1F33) */}
      <section className="relative rounded-2xl navy-surface border border-slate-700 p-5 sm:p-7 shadow-sm overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#112A45] border border-slate-600 text-white keep-white text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="keep-white">{t('heroTag')}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#112A45] border border-slate-600 text-slate-200 keep-white text-[11px] font-medium">
              7 Live Data Streams • Maharashtra Operations
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white keep-white tracking-tight leading-snug">
            {t('heroTitle')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 keep-white leading-relaxed max-w-3xl">
            {t('heroDesc')}
          </p>

          {/* Restrained Call-To-Action Buttons (Ocean Blue primary, Clean Slate secondary, Red SOS) */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('overview')}
              className="keep-white flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1769AA] hover:bg-[#125488] text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>{t('btnExploreMap')}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              onClick={() => setActiveTab('citizen')}
              className="keep-white flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{t('btnReportSOS')}</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className="keep-white flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#112A45] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm border border-slate-600 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>{t('btnEmergencyNums')}</span>
            </button>

            {onOpenCloudConfig && (
              <button
                onClick={onOpenCloudConfig}
                className="keep-white flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#112A45] hover:bg-slate-800 text-slate-200 font-medium text-xs border border-slate-600 transition-all cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span>API & Cloud Keys</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Clean Summary Placards with Uniform Slate Styling */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/80">
          <div
            onClick={() => setActiveTab('overview')}
            className="bg-[#112A45] border border-slate-700 rounded-xl p-3.5 cursor-pointer hover:border-slate-500 transition-colors min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-medium text-slate-300 keep-white">
              <span className="keep-white">{t('statActiveAlerts')}</span>
              <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
            </div>
            <div className="text-xl font-mono font-bold text-white keep-white mt-1">
              {sosReports.length} SOS • {alerts.length} Alerts
            </div>
            <p className="text-[11px] text-slate-300 keep-white mt-0.5 truncate">
              Mahad #1042 & Mithi Basin
            </p>
          </div>

          <div
            onClick={() => setActiveTab('predictor')}
            className="bg-[#112A45] border border-slate-700 rounded-xl p-3.5 cursor-pointer hover:border-slate-500 transition-colors min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-medium text-slate-300 keep-white">
              <span className="keep-white">Monitored Basins</span>
              <Waves className="w-4 h-4 text-sky-400 shrink-0" />
            </div>
            <div className="text-xl font-mono font-bold text-white keep-white mt-1">
              6 River Basins
            </div>
            <p className="text-[11px] text-slate-300 keep-white mt-0.5 truncate">
              Savitri, Vashishti, Mithi, Mutha
            </p>
          </div>

          <div
            onClick={() => setActiveTab('citizen')}
            className="bg-[#112A45] border border-slate-700 rounded-xl p-3.5 cursor-pointer hover:border-slate-500 transition-colors min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-medium text-slate-300 keep-white">
              <span className="keep-white">{t('statSheltersOpen')}</span>
              <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
            </div>
            <div className="text-xl font-mono font-bold text-white keep-white mt-1">
              {shelters.length} Relief Shelters
            </div>
            <p className="text-[11px] text-slate-300 keep-white mt-0.5 truncate">
              Live bed & supply tracking
            </p>
          </div>

          <div
            onClick={() => setActiveTab('overview')}
            className="bg-[#112A45] border border-slate-700 rounded-xl p-3.5 cursor-pointer hover:border-slate-500 transition-colors min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-medium text-slate-300 keep-white">
              <span className="keep-white">Telemetry Feeds</span>
              <Satellite className="w-4 h-4 text-sky-400 shrink-0" />
            </div>
            <div className="text-xl font-mono font-bold text-white keep-white mt-1">
              7 Live APIs
            </div>
            <p className="text-[11px] text-slate-300 keep-white mt-0.5 truncate">
              Synced at {lastSyncTime}
            </p>
          </div>
        </div>
      </section>

      {/* PRIMARY WORKSPACE: Active Alerts (Left) + Quick Dispatch & Shelter Control (Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Active Emergency Alerts */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                {tp('ACTIVE OPERATIONS')}
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                {t('ongoingSectionTitle')}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('optimizer')}
              className="keep-white px-3 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#125488] text-white text-xs font-semibold cursor-pointer"
            >
              {tp('Dispatch Board →')}
            </button>
          </div>

          <div className="space-y-2.5">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`keep-white px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                        alert.severity === 'CRITICAL' ? 'bg-[#DC2626]' : 'bg-[#0B1F33]'
                      }`}
                    >
                      {tp(alert.severity)}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm text-white">
                      [{tp(alert.district)}] {tp(alert.title)}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{alert.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{tp(alert.description)}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                  <div className="flex flex-wrap items-center gap-3 text-slate-400">
                    <span>Impact: <strong className="text-white">{alert.affectedCount}</strong></span>
                    <span>Status: <strong className="text-white">{tp(alert.evacuationStatus)}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onSpeakText(
                          `${tp(alert.severity)} alert in ${tp(alert.district)}. ${tp(alert.title)}.`
                        )
                      }
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{t('listenBtn')}</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectAlert(alert);
                        setActiveTab('overview');
                      }}
                      className="keep-white px-2.5 py-1 rounded bg-[#1769AA] hover:bg-[#125488] text-white font-semibold cursor-pointer"
                    >
                      {t('viewMapBtn')} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Quick Field Actions & Latest 3 Events */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  FIELD ACTIONS & RESPONSE
                </span>
                <h2 className="text-base font-bold text-white mt-0.5">
                  Quick Dispatch & Shelter Intake
                </h2>
              </div>
              <button
                onClick={syncAllRealTimeFeeds}
                disabled={isSyncing}
                className="keep-white px-2.5 py-1.5 rounded-lg bg-[#0B1F33] hover:bg-[#1769AA] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>

            {/* Action 1: Dispatch Team to SOS #1042 */}
            {sosReports[0] && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">
                    {sosReports[0].id} • {sosReports[0].district}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#DC2626] text-white keep-white font-bold">
                    {sosReports[0].status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {sosReports[0].locationName} ({sosReports[0].victimsCount} people affected)
                </p>
                <button
                  disabled={dispatchingId === sosReports[0].id}
                  onClick={() => handleQuickDispatch(sosReports[0])}
                  className="w-full py-2 px-3 rounded-lg bg-[#1769AA] hover:bg-[#125488] text-white keep-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>
                    {dispatchingId === sosReports[0].id
                      ? 'Computing OSRM Road Route...'
                      : sosReports[0].assignedUnit
                      ? `Assigned: ${sosReports[0].assignedUnit}`
                      : 'Dispatch Nearest Team (OSRM Route)'}
                  </span>
                </button>
              </div>
            )}

            {/* Action 2: Update Shelter Occupancy */}
            {shelters[2] && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white truncate">
                    {shelters[2].name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#0B1F33] text-white keep-white font-mono font-bold shrink-0">
                    {shelters[2].currentOccupancy} / {shelters[2].capacity} Beds
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Available: {shelters[2].capacity - shelters[2].currentOccupancy} beds • Water, Food & Medical Ready
                </p>
                <button
                  onClick={() =>
                    onUpdateShelterOccupancy && onUpdateShelterOccupancy(shelters[2].id, 20)
                  }
                  className="w-full py-2 px-3 rounded-lg bg-[#0B1F33] hover:bg-[#1769AA] text-white keep-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>
                    Register +20 Evacuees ({shelters[2].currentOccupancy} →{' '}
                    {Math.min(shelters[2].capacity, shelters[2].currentOccupancy + 20)})
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Compact Recent Activity Log (Top 2 items) */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold uppercase">Recent Operations Log</span>
              <button
                onClick={() => toggleAccordion('telemetry')}
                className="text-[#1769AA] font-semibold hover:underline cursor-pointer"
              >
                View All ({timeline.length}) ▾
              </button>
            </div>
            {timeline.slice(0, 2).map((ev) => (
              <div
                key={ev.id}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs"
              >
                <div className="truncate">
                  <span className="font-mono text-[10px] text-slate-400 mr-2">{ev.time}</span>
                  <span className="font-semibold text-white">{ev.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLAPSIBLE DROPDOWN SECTIONS FOR SECONDARY MODULES */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Detailed Modules & Archives (Click any section below to expand)
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="home-section-jump" className="text-slate-400 font-medium">
              Open Section:
            </label>
            <select
              id="home-section-jump"
              value={openAccordion || ''}
              onChange={(e) => setOpenAccordion(e.target.value || null)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold cursor-pointer"
            >
              <option value="basins">River Basin Flood Intelligence (6 Basins)</option>
              <option value="telemetry">Live Data Sources & Incident Timeline ({timeline.length})</option>
              <option value="relieved">Resolved & Relieved Disasters Archive ({RELIEVED_DISASTERS.length})</option>
              <option value="capabilities">Platform Capabilities vs. Standard Weather Sites</option>
              <option value="">Collapse All Sections</option>
            </select>
          </div>
        </div>

        {/* ACCORDION 1: River Basin Flood Intelligence */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleAccordion('basins')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Waves className="w-4 h-4 text-[#1769AA] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  River Basin Flood Intelligence (Observed vs. Predicted)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Live Open-Meteo rainfall & GloFAS river discharge across 6 Maharashtra basins
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                openAccordion === 'basins' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openAccordion === 'basins' && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Filter Basin:</span>
                  <select
                    value={selectedBasinId}
                    onChange={(e) => setSelectedBasinId(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    <option value="ALL">Top 3 Priority Basins</option>
                    {basins.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.district} — {b.basinName} ({b.floodRisk?.score}/100)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setActiveTab('predictor')}
                  className="keep-white px-3 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#125488] text-white text-xs font-semibold cursor-pointer"
                >
                  Open Risk Predictor →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {filteredBasins.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setActiveTab('predictor')}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-xl p-4 space-y-3 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {b.district}
                        </span>
                        <h4 className="font-bold text-sm text-white">{b.basinName}</h4>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold text-white keep-white ${
                          b.floodRisk?.score >= 75 ? 'bg-[#DC2626]' : 'bg-[#0B1F33]'
                        }`}
                      >
                        {b.floodRisk?.score}/100 {b.floodRisk?.level}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Rain (24h):</span>
                        <strong className="text-white font-mono">{b.observed?.rain24hMm} mm</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Forecast (72h):</span>
                        <strong className="text-white font-mono">{b.observed?.forecastRain72hMm} mm</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">River Discharge:</span>
                        <strong className="text-white font-mono">{b.observed?.riverDischargeM3s} m³/s</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Trend:</span>
                        <strong className="text-white font-mono">{b.observed?.dischargeTrend}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 2: Live Data Sources Status & Incident Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleAccordion('telemetry')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#1769AA] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Live Data Sources Status & Full Incident Timeline ({timeline.length} Events)
                </h3>
                <p className="text-[11px] text-slate-400">
                  7 connected API feeds and chronological operational event log
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                openAccordion === 'telemetry' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openAccordion === 'telemetry' && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 7 Data Sources */}
              <div className="lg:col-span-5 space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400">
                  Connected Data Sources (Synced {lastSyncTime})
                </h4>
                {[
                  { name: 'Open-Meteo Weather', detail: 'Rain, Temp, Wind, 72h Forecast' },
                  { name: 'GloFAS River Discharge', detail: 'm³/s Basin Flood Telemetry' },
                  { name: 'USGS Earthquakes', detail: 'Real-time Seismic GeoJSON' },
                  { name: 'CAMS Air Quality', detail: 'PM2.5, CO Smoke & UV Index' },
                  { name: 'NASA FIRMS Fire Hotspots', detail: 'VIIRS / MODIS Thermal FRP' },
                  { name: 'RainViewer Precipitation', detail: 'Live Rain Radar Map Tiles' },
                  { name: 'Citizen SOS & Shelter Store', detail: 'Cross-Tab + Cloud Sync' }
                ].map((src, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{src.name}</div>
                      <div className="text-[10px] text-slate-400">{src.detail}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#0B1F33] text-white keep-white text-[10px] font-mono font-semibold">
                      ONLINE
                    </span>
                  </div>
                ))}
              </div>

              {/* Chronological Incident Log */}
              <div className="lg:col-span-7 space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400">
                  Chronological Operations Timeline
                </h4>
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {timeline.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="px-2 py-0.5 rounded bg-[#0B1F33] text-white keep-white font-mono text-[10px] shrink-0">
                          {ev.time}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-white">{ev.title}</div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{ev.detail}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {ev.provenance || 'OPS'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 3: Resolved & Relieved Disasters Archive */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleAccordion('relieved')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#1769AA] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {t('relievedSectionTitle')} ({RELIEVED_DISASTERS.length} Mitigated Cases)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Past emergencies that have been evacuated, stabilized, and closed
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                openAccordion === 'relieved' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openAccordion === 'relieved' && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {RELIEVED_DISASTERS.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-white">
                      {tp(item.district)} • {tp(item.type)}
                    </span>
                    <span className="keep-white px-2 py-0.5 rounded bg-[#0B1F33] text-white font-semibold text-[10px]">
                      {tp(item.status)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{tp(item.summary)}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>People Assisted: <strong className="text-white">{item.peopleRescued.toLocaleString()}</strong></span>
                    <span className="font-mono">{item.resolvedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACCORDION 4: Platform Capabilities */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleAccordion('capabilities')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-4 h-4 text-[#1769AA] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {t('whySpecialTitle')}
                </h3>
                <p className="text-[11px] text-slate-400">
                  How AapdaNet AI differs from standard weather forecast websites
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                openAccordion === 'capabilities' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openAccordion === 'capabilities' && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uspFeatures.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTab(feat.tab)}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-xl p-4 space-y-2.5 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#1769AA] shrink-0" />
                        <h4 className="font-bold text-xs text-white">{tp(feat.title)}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400">{tp(feat.imd)}</p>
                      <p className="text-xs text-white leading-relaxed">{tp(feat.ours)}</p>
                    </div>
                    <div className="pt-1 text-right text-[11px] font-semibold text-[#1769AA]">
                      {tp('Open Module →')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
