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
  HeartPulse,
  CheckCircle2
} from 'lucide-react';
import { NATIONAL_HELPLINES, CITY_EMERGENCY_DIRECTORY } from '../services/mockData';
import { getTranslation } from '../utils/translations';

export default function EmergencyContacts({ lang, onSpeakText }) {
  const t = (key) => getTranslation(lang, key);

  const [selectedCityIdx, setSelectedCityIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHelplines = NATIONAL_HELPLINES.filter(
    (h) =>
      h.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCity = CITY_EMERGENCY_DIRECTORY[selectedCityIdx] || CITY_EMERGENCY_DIRECTORY[0];

  return (
    <div className="space-y-8 pb-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs tracking-wider uppercase">
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>24x7 Verified Emergency Directory</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {t('contactsTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              {t('contactsDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                onSpeakText(
                  `Emergency Directory. For all-in-one national emergency dial 1 1 2. For Fire Brigade dial 1 0 1. For Ambulance dial 1 0 8. For Police dial 1 0 0. For District Collector Control Room dial 1 0 7 7. Currently viewing ${currentCity.city}. District Magistrate phone is ${currentCity.dmOffice.phone}. Police Control is ${currentCity.policeControl.phone}.`
                )
              }
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t('voiceReadout')}</span>
            </button>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search 101, 108, Police, DM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 w-60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: National & State Rapid-Dial Helplines (112, 101, 108, 100, 1070, 1077, etc.) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>1. National & State Toll-Free Emergency Numbers (One-Tap Dial)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Click any card on mobile or desktop to immediately place an emergency call
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredHelplines.map((item) => (
            <div
              key={item.number}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 card-hover"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`keep-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white ${item.color}`}
                  >
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">{item.category}</span>
                </div>

                <div className="text-3xl font-mono font-black text-white tracking-tight pt-1">
                  {item.number}
                </div>

                <h3 className="font-bold text-sm text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              <a
                href={`tel:${item.number.replace(/[^0-9+]/g, '')}`}
                className={`keep-white w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-md transition-opacity hover:opacity-95 ${item.color}`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Dial {item.number} Now</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: City-Wise Important Numbers (Police, District Magistrate / DM, Fire, & Important Politicians / Representatives) */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                CITY & DISTRICT COMMAND DIRECTORY
              </span>
              <h2 className="text-xl font-extrabold text-white mt-0.5">
                2. City-Wise Police Control, District Magistrate (DM) & Public Representative Offices
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              Verified Direct Landlines & Control Rooms
            </span>
          </div>

          {/* City Selector Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {CITY_EMERGENCY_DIRECTORY.map((c, idx) => (
              <button
                key={c.city}
                onClick={() => setSelectedCityIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedCityIdx === idx
                    ? 'bg-cyan-600 text-white keep-white border-cyan-500 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {c.city}
              </button>
            ))}
          </div>
        </div>

        {/* Selected City Details Grid */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-lg font-extrabold text-white">{currentCity.city}</h3>
              <p className="text-xs text-cyan-400 font-medium">
                Geographic Zone: {currentCity.region}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <a
                href={`tel:${currentCity.dmOffice.phone.replace(/[^0-9+]/g, '')}`}
                className="keep-white px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call DM Office ({currentCity.dmOffice.phone})</span>
              </a>
              <a
                href={`tel:${currentCity.policeControl.phone.replace(/[^0-9+]/g, '')}`}
                className="keep-white px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Police HQ ({currentCity.policeControl.phone})</span>
              </a>
            </div>
          </div>

          {/* 4 Administration Cards: DM, Police, Municipal Disaster, Fire/Medical */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* DM / District Collector Card */}
            <div className="bg-slate-950 border border-indigo-900/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4" />
                  DISTRICT MAGISTRATE (DM) / COLLECTOR
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Toll-Free: 1077
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{currentCity.dmOffice.title}</h4>
              <p className="text-xs text-slate-400">{currentCity.dmOffice.officer}</p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
                <div className="font-mono text-sm font-bold text-white">
                  📞 {currentCity.dmOffice.phone}
                  <span className="text-xs text-slate-400 ml-2">({currentCity.dmOffice.altPhone})</span>
                </div>
                <a
                  href={`tel:${currentCity.dmOffice.phone.replace(/[^0-9+]/g, '')}`}
                  className="keep-white px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Call DM Office
                </a>
              </div>
            </div>

            {/* Police Control Room Card */}
            <div className="bg-slate-950 border border-blue-900/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  POLICE COMMISSIONER / SP CONTROL ROOM
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Dial 100 / 112
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{currentCity.policeControl.title}</h4>
              <p className="text-xs text-slate-400">{currentCity.policeControl.office}</p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
                <div className="font-mono text-sm font-bold text-white">
                  📞 {currentCity.policeControl.phone}
                  <span className="text-xs text-slate-400 ml-2">({currentCity.policeControl.altPhone})</span>
                </div>
                <a
                  href={`tel:${currentCity.policeControl.phone.replace(/[^0-9+]/g, '')}`}
                  className="keep-white px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Call Police Control
                </a>
              </div>
            </div>

            {/* Municipal Corporation Disaster Cell */}
            <div className="bg-slate-950 border border-cyan-900/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  MUNICIPAL CORPORATION DISASTER WAR ROOM
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Civic Control
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{currentCity.municipalDisaster.title}</h4>
              <p className="text-xs text-slate-400">{currentCity.municipalDisaster.office}</p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
                <div className="font-mono text-sm font-bold text-white">
                  📞 {currentCity.municipalDisaster.phone}
                  <span className="text-xs text-slate-400 ml-2">({currentCity.municipalDisaster.altPhone})</span>
                </div>
                <a
                  href={`tel:${currentCity.municipalDisaster.phone.replace(/[^0-9+]/g, '')}`}
                  className="keep-white px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                >
                  Call Civic Cell
                </a>
              </div>
            </div>

            {/* Fire Brigade & Emergency Medical */}
            <div className="bg-slate-950 border border-orange-900/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  CITY FIRE BRIGADE HQ & TRAUMA EMS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
                  101 / 108
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{currentCity.fireMedical.title}</h4>
              <p className="text-xs text-slate-400">{currentCity.fireMedical.office}</p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
                <div className="font-mono text-sm font-bold text-white">
                  📞 {currentCity.fireMedical.phone}
                  <span className="text-xs text-slate-400 ml-2">({currentCity.fireMedical.altPhone})</span>
                </div>
                <a
                  href={`tel:${currentCity.fireMedical.phone.replace(/[^0-9+]/g, '')}`}
                  className="keep-white px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold"
                >
                  Call Fire / EMS
                </a>
              </div>
            </div>
          </div>

          {/* Public Representatives / Guardian Minister / Local Politicians Relief Offices */}
          <div className="bg-slate-950 border border-emerald-900/60 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-base font-extrabold text-white">
                    Key Elected Representatives, Guardian Minister & Constituency Public Emergency Offices ({currentCity.city})
                  </h4>
                  <p className="text-xs text-slate-400">
                    Direct public grievance and emergency relief coordination desks for local representatives and ministers in the area
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentCity.publicRepresentatives.map((rep, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Public Relief Desk
                    </span>
                    <h5 className="font-bold text-sm text-white">{rep.role}</h5>
                    <p className="text-xs text-slate-400">{rep.office}</p>
                    <p className="text-[11px] text-cyan-400">Coverage: {rep.coverage}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-white">📞 {rep.phone}</span>
                    <a
                      href={`tel:${rep.phone.replace(/[^0-9+]/g, '')}`}
                      className="keep-white px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                    >
                      Call Desk
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
