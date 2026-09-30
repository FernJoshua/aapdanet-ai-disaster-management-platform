import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Volume2, ShieldCheck, ChevronDown } from 'lucide-react';
import { getTranslation, translatePhrase } from '../utils/translations';

export default function LiveAlertBanner({ alerts, lang, onSelectAlert, onSpeakAlert }) {
  const t = (key) => getTranslation(lang, key);
  const tr = (text) => translatePhrase(lang, text);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 text-xs flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t('noActiveAlerts')}</span>
        </div>
      </div>
    );
  }

  const primaryAlert = alerts[0];

  return (
    <aside
      aria-label="Active Alert Bar"
      className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-2 text-xs text-slate-200 w-full max-w-full relative z-30"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="keep-white inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#DC2626] font-bold text-white text-[10px] uppercase shrink-0">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span className="keep-white">{tr(primaryAlert.severity)}</span>
          </span>
          <div className="text-xs text-white truncate">
            <strong className="mr-1.5">[{tr(primaryAlert.district)}] {tr(primaryAlert.title)}</strong>
            <span className="text-slate-400 hidden md:inline">— {tr(primaryAlert.description)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() =>
              onSpeakAlert(
                `${tr(primaryAlert.severity)} Alert in ${tr(primaryAlert.district)}. ${tr(primaryAlert.title)}. ${tr(primaryAlert.description)}`
              )
            }
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Listen</span>
          </button>

          {/* Dropdown to view all active alerts without cluttering the page */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="keep-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1769AA] hover:bg-[#0284C7] text-white text-xs font-semibold cursor-pointer"
            >
              <span>All Alerts ({alerts.length})</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {dropdownOpen && (
              <div className="fixed sm:absolute right-2 sm:right-0 top-28 sm:top-full mt-1.5 w-[calc(100vw-16px)] max-w-md rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Active Maharashtra Advisories ({alerts.length})
                </div>
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => {
                      onSelectAlert(alt);
                      setDropdownOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 cursor-pointer space-y-1 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">
                        [{tr(alt.district)}] {tr(alt.title)}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">{alt.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{tr(alt.description)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
