import React from 'react';
import { AlertTriangle, Volume2, ShieldCheck, ArrowRight, PhoneCall } from 'lucide-react';
import { getTranslation, translatePhrase } from '../utils/translations';

export default function LiveAlertBanner({ alerts, lang, onSelectAlert, onSpeakAlert, onOpenContacts }) {
  const t = (key) => getTranslation(lang, key);
  const tr = (text) => translatePhrase(lang, text);

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-emerald-950/40 border-y border-emerald-800/40 px-4 py-2 text-xs flex items-center justify-between text-emerald-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t('noActiveAlerts')}</span>
        </div>
      </div>
    );
  }

  const primaryAlert = alerts[0];

  return (
    <aside 
      aria-label="Emergency Broadcast Banner"
      className="bg-red-950/85 border-b border-red-800/60 px-4 py-2.5 text-xs text-slate-100 shadow-inner"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 font-extrabold text-white text-[11px] tracking-wider animate-pulse shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
            {tr(primaryAlert.severity)} ALERT
          </span>
          <div className="text-xs leading-relaxed text-slate-200">
            <span className="font-bold text-amber-300 mr-1.5">[{tr(primaryAlert.district)}] {tr(primaryAlert.title)}:</span>
            <span>{tr(primaryAlert.description)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenContacts && (
            <button
              onClick={onOpenContacts}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/70 hover:bg-red-800 text-red-100 text-xs font-bold transition-colors border border-red-500/40"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">101 / 108 / 112</span>
            </button>
          )}
          <button
            onClick={() => onSpeakAlert(tr(primaryAlert.title) + ". " + tr(primaryAlert.description))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition-colors border border-amber-500/30"
            title="Read this alert aloud"
            aria-label="Listen to active alert"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t('listenBtn')}</span>
          </button>

          <button
            onClick={() => onSelectAlert(primaryAlert)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <span>{t('viewMapBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
