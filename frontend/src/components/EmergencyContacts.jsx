import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  Building2,
  Landmark,
  Users,
  Search,
  Volume2,
  MapPin,
  Flame,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { NATIONAL_HELPLINES, CITY_EMERGENCY_DIRECTORY } from '../services/mockData';
import { getTranslation, translatePhrase } from '../utils/translations';

const OFFICIAL_CITY_PORTALS = {
  "Mumbai (City & Suburban)": {
    dmUrl: "https://mumbaisuburban.gov.in/helpline/",
    policeUrl: "https://mumbaipolice.gov.in/",
    civicUrl: "https://portal.mcgm.gov.in/"
  },
  "Pune": {
    dmUrl: "https://pune.gov.in/helpline/",
    policeUrl: "https://punepolice.gov.in/",
    civicUrl: "https://www.pmc.gov.in/"
  },
  "Nagpur": {
    dmUrl: "https://nagpur.gov.in/helpline/",
    policeUrl: "https://nagpurpolice.gov.in/",
    civicUrl: "https://www.nmcnagpur.gov.in/"
  },
  "Thane & Navi Mumbai": {
    dmUrl: "https://thane.nic.in/helpline/",
    policeUrl: "https://thanepolice.gov.in/",
    civicUrl: "https://thanecity.gov.in/"
  },
  "Raigad (Alibag & Mahad)": {
    dmUrl: "https://raigad.gov.in/helpline/",
    policeUrl: "https://raigadpolice.gov.in/",
    civicUrl: "https://raigad.gov.in/"
  },
  "Ratnagiri & Chiplun": {
    dmUrl: "https://ratnagiri.gov.in/helpline/",
    policeUrl: "https://ratnagiripolice.gov.in/",
    civicUrl: "https://ratnagiri.gov.in/"
  },
  "Kolhapur & Sangli": {
    dmUrl: "https://kolhapur.gov.in/helpline/",
    policeUrl: "https://kolhapurpolice.gov.in/",
    civicUrl: "https://kolhapur.gov.in/"
  },
  "Nashik & Chhatrapati Sambhajinagar": {
    dmUrl: "https://nashik.gov.in/helpline/",
    policeUrl: "https://nashikcitypolice.gov.in/",
    civicUrl: "https://nmc.gov.in/"
  }
};

export default function EmergencyContacts({ lang = 'en', onSpeakText }) {
  const t = (key) => getTranslation(lang, key);
  const tp = (phrase) => translatePhrase(lang, phrase);

  const [selectedCityIdx, setSelectedCityIdx] = useState(0);
  const [showAllCities, setShowAllCities] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(null);

  const handleCopyPhone = (phone) => {
    try {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2000);
    } catch {
      // Fallback
    }
  };

  const filteredHelplines = NATIONAL_HELPLINES.filter(
    (h) =>
      h.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const citiesToDisplay = showAllCities
    ? CITY_EMERGENCY_DIRECTORY.filter((c) =>
        c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [CITY_EMERGENCY_DIRECTORY[selectedCityIdx] || CITY_EMERGENCY_DIRECTORY[0]];

  return (
    <div className="space-y-8 pb-8 w-full max-w-full overflow-x-hidden">
      {/* Top Navy Header Banner */}
      <div className="navy-surface border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2 text-amber-400 keep-white font-bold text-xs tracking-wider uppercase">
              <PhoneCall className="w-4 h-4 animate-pulse shrink-0" />
              <span className="keep-white">24x7 Verified Emergency, DM, Police & Public Representative Directory</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white keep-white">
              {t('contactsTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 keep-white">
              {t('contactsDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                const c = citiesToDisplay[0];
                onSpeakText(
                  `Emergency Directory. National All-in-One Emergency: 1 1 2. Fire Brigade: 1 0 1. Ambulance: 1 0 8. Police: 1 0 0. District Collector Control Room: 1 0 7 7. Currently viewing ${c.city}. District Magistrate phone is ${c.dmOffice.phone}. Police Control is ${c.policeControl.phone}. Municipal Disaster Cell is ${c.municipalDisaster.phone}. Fire HQ is ${c.fireMedical.phone}.`
                );
              }}
              className="keep-white flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1769AA] hover:bg-[#0284C7] text-white font-bold text-xs shadow-md"
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>{t('listenBtn')}</span>
            </button>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search City, DM, 101, 108..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-xl pl-9 pr-4 py-2 text-xs text-white keep-white placeholder-slate-400 focus:outline-none focus:border-sky-400 w-56 sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1 (RIGHT AT TOP): City-Wise Police Control, District Magistrate (DM), Fire & Public Representative Directory */}
      <section id="city-dm-directory" className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg space-y-6">
        <div className="border-b border-slate-800 pb-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>CITY & DISTRICT COMMAND DIRECTORY (DIRECT NUMBERS & OFFICIAL PORTALS)</span>
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                1. City-Wise District Magistrate (DM / Collector), Police Control, Fire HQ & Local Representatives
              </h2>
            </div>

            <button
              onClick={() => setShowAllCities(!showAllCities)}
              className={`keep-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                showAllCities
                  ? 'bg-[#F97316] text-white'
                  : 'bg-[#1769AA] hover:bg-[#0284C7] text-white'
              }`}
            >
              {showAllCities ? 'Show Single Selected City' : `View All ${CITY_EMERGENCY_DIRECTORY.length} Cities Together`}
            </button>
          </div>

          {/* City Selector Pills */}
          {!showAllCities && (
            <div className="flex flex-wrap gap-2">
              {CITY_EMERGENCY_DIRECTORY.map((c, idx) => (
                <button
                  key={c.city}
                  onClick={() => setSelectedCityIdx(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedCityIdx === idx
                      ? 'bg-cyan-600 text-white keep-white border-cyan-500 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {c.city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Render Selected City (or All Cities) */}
        <div className="space-y-8">
          {citiesToDisplay.map((cityData) => {
            const portals = OFFICIAL_CITY_PORTALS[cityData.city] || {
              dmUrl: "https://maharashtra.gov.in/",
              policeUrl: "https://mahapolice.gov.in/",
              civicUrl: "https://maharashtra.gov.in/"
            };

            return (
              <div key={cityData.city} className="space-y-5 bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800">
                {/* City Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">{cityData.city}</h3>
                    <p className="text-xs text-cyan-400 font-semibold">
                      Geographic Zone: {cityData.region}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button
                      onClick={() =>
                        onSpeakText(
                          `${cityData.city} Emergency Numbers. District Magistrate and Collector Office: ${cityData.dmOffice.phone}. Police Control Room: ${cityData.policeControl.phone}. Municipal Disaster Cell: ${cityData.municipalDisaster.phone}. Fire Brigade HQ: ${cityData.fireMedical.phone}.`
                        )
                      }
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold flex items-center gap-1.5 border border-slate-700"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Read {cityData.city.split(' ')[0]} Numbers Aloud</span>
                    </button>

                    <a
                      href={portals.dmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="keep-white px-3.5 py-2 rounded-xl bg-[#1769AA] hover:bg-[#0284C7] text-white font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Official District DM Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={portals.policeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="keep-white px-3.5 py-2 rounded-xl bg-[#155E75] hover:bg-[#1769AA] text-white font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Official Police Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 4 Administration Cards: DM, Police, Municipal Disaster, Fire/Medical */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. District Magistrate (DM) / Collector Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 shrink-0" />
                        <span>DISTRICT MAGISTRATE (DM) / COLLECTOR</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                        Shortcode: 1077
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white">{cityData.dmOffice.title}</h4>
                    <p className="text-xs text-slate-400">{cityData.dmOffice.officer}</p>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-mono text-base font-black text-white">
                        📞 {cityData.dmOffice.phone}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        Alternate / Toll-Free: <strong>{cityData.dmOffice.altPhone}</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={`tel:${cityData.dmOffice.phone.replace(/[^0-9+]/g, '')}`}
                        className="keep-white flex-1 py-2 px-3 rounded-xl bg-[#1769AA] hover:bg-[#0284C7] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Dial DM ({cityData.dmOffice.phone})</span>
                      </a>
                      <button
                        onClick={() => handleCopyPhone(cityData.dmOffice.phone)}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedPhone === cityData.dmOffice.phone ? '✓ Copied!' : 'Copy'}</span>
                      </button>
                      <a
                        href={portals.dmUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-1 border border-slate-700"
                        title="Open Official Collectorate Helpline Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Website</span>
                      </a>
                    </div>
                  </div>

                  {/* 2. Police Control Room Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>POLICE COMMISSIONER / SP CONTROL ROOM</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 shrink-0">
                        Dial 100 / 112
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white">{cityData.policeControl.title}</h4>
                    <p className="text-xs text-slate-400">{cityData.policeControl.office}</p>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-mono text-base font-black text-white">
                        📞 {cityData.policeControl.phone}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        Direct Control Room: <strong>{cityData.policeControl.altPhone}</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={`tel:${cityData.policeControl.phone.replace(/[^0-9+]/g, '')}`}
                        className="keep-white flex-1 py-2 px-3 rounded-xl bg-[#1769AA] hover:bg-[#0284C7] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Dial Police ({cityData.policeControl.phone})</span>
                      </a>
                      <button
                        onClick={() => handleCopyPhone(cityData.policeControl.phone)}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedPhone === cityData.policeControl.phone ? '✓ Copied!' : 'Copy'}</span>
                      </button>
                      <a
                        href={portals.policeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-1 border border-slate-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Website</span>
                      </a>
                    </div>
                  </div>

                  {/* 3. Municipal Corporation Disaster War Room */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span>MUNICIPAL CORPORATION DISASTER CELL</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                        Civic Control
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white">{cityData.municipalDisaster.title}</h4>
                    <p className="text-xs text-slate-400">{cityData.municipalDisaster.office}</p>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-mono text-base font-black text-white">
                        📞 {cityData.municipalDisaster.phone}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        Backup Line: <strong>{cityData.municipalDisaster.altPhone}</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={`tel:${cityData.municipalDisaster.phone.replace(/[^0-9+]/g, '')}`}
                        className="keep-white flex-1 py-2 px-3 rounded-xl bg-[#1769AA] hover:bg-[#0284C7] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Dial Civic ({cityData.municipalDisaster.phone})</span>
                      </a>
                      <button
                        onClick={() => handleCopyPhone(cityData.municipalDisaster.phone)}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedPhone === cityData.municipalDisaster.phone ? '✓ Copied!' : 'Copy'}</span>
                      </button>
                      <a
                        href={portals.civicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-1 border border-slate-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Portal</span>
                      </a>
                    </div>
                  </div>

                  {/* 4. City Fire Brigade & Trauma EMS */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 shrink-0" />
                        <span>CITY FIRE BRIGADE HQ & TRAUMA EMS</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800 shrink-0">
                        101 / 108
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white">{cityData.fireMedical.title}</h4>
                    <p className="text-xs text-slate-400">{cityData.fireMedical.office}</p>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-mono text-base font-black text-white">
                        📞 {cityData.fireMedical.phone}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        Direct Control: <strong>{cityData.fireMedical.altPhone}</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={`tel:${cityData.fireMedical.phone.replace(/[^0-9+]/g, '')}`}
                        className="keep-white flex-1 py-2 px-3 rounded-xl bg-[#F97316] hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Dial Fire/EMS ({cityData.fireMedical.phone})</span>
                      </a>
                      <button
                        onClick={() => handleCopyPhone(cityData.fireMedical.phone)}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedPhone === cityData.fireMedical.phone ? '✓ Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Key Elected Representatives / Guardian Minister / Local Politicians Relief Desks */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Users className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-white">
                        Key Elected Representatives, Guardian Minister & Constituency Public Emergency Offices ({cityData.city})
                      </h4>
                      <p className="text-xs text-slate-400">
                        Direct public grievance and emergency relief coordination desks for local representatives and ministers in the area
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cityData.publicRepresentatives.map((rep, i) => (
                      <div
                        key={i}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 min-w-0"
                      >
                        <div className="space-y-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Public Relief Desk
                          </span>
                          <h5 className="font-bold text-sm text-white">{rep.role}</h5>
                          <p className="text-xs text-slate-400">{rep.office}</p>
                          <p className="text-[11px] text-cyan-400 font-medium">Coverage: {rep.coverage}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-800 space-y-2">
                          <div className="font-mono font-black text-sm text-white">📞 {rep.phone}</div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${rep.phone.replace(/[^0-9+]/g, '')}`}
                              className="keep-white flex-1 py-1.5 px-3 rounded-lg bg-[#15803D] hover:bg-[#16A34A] text-white text-xs font-bold text-center"
                            >
                              Dial Desk
                            </a>
                            <button
                              onClick={() => handleCopyPhone(rep.phone)}
                              className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
                            >
                              {copiedPhone === rep.phone ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: National & State Rapid-Dial Helplines (112, 101, 108, 100, 1070, 1077, etc.) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>2. National & State Toll-Free Emergency Numbers (112, 101 Fire, 108 Ambulance, 100 Police)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Click Dial or Copy on any card below for immediate 24x7 toll-free emergency response
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredHelplines.map((item) => (
            <div
              key={item.number}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4 card-hover min-w-0"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`keep-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white ${item.color}`}
                  >
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">{tp(item.category)}</span>
                </div>

                <div className="text-3xl font-mono font-black text-white tracking-tight pt-1">
                  {item.number}
                </div>

                <h3 className="font-bold text-sm text-white">{tp(item.title)}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tp(item.desc)}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${item.number.replace(/[^0-9+]/g, '')}`}
                  className={`keep-white flex-1 py-2.5 px-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-sm transition-opacity hover:opacity-95 ${item.color}`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Dial {item.number}</span>
                </a>
                <button
                  onClick={() => handleCopyPhone(item.number)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
                >
                  {copiedPhone === item.number ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
