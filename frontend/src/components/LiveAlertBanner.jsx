import React from 'react';
import { AlertTriangle, Volume2, ShieldCheck, ArrowRight, PhoneCall } from 'lucide-react';
import { getTranslation, translatePhrase } from '../utils/translations';

export default function LiveAlertBanner({ alerts, lang, onSelectAlert, onSpeakAlert, onOpenContacts }) {
  const t = (key) => getTranslation(lang, key);
  const tr = (text) => translatePhrase(lang, text);

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-[#15803D] px-4 py-2 text-xs flex items-center justify-between text-white keep-white">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span className="keep-white">{t('noActiveAlerts')}</span>
        </div>
      </div>
    );
  }

  const primaryAlert = alerts[0];

  return (
    <aside 
      aria-label="Emergency Broadcast Banner"
      className="bg-[#0B1F33] border-b-2 border-[#F97316] px-3 sm:px-6 py-2.5 text-xs text-white keep-white shadow-sm w-full max-w-full"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 flex-1 min-w-0">
          <span className="keep-white inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DC2626] font-extrabold text-white text-[10px] sm:text-[11px] tracking-wider shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="keep-white">{tr(primaryAlert.severity)} ALERT</span>
          </span>
          <div className="text-xs leading-relaxed text-slate-100 keep-white min-w-0 break-words">
            <span className="font-bold text-[#F59E0B] keep-white mr-1.5">
              [{tr(primaryAlert.district)}] {tr(primaryAlert.title)}:
            </span>
            <span className="text-slate-200 keep-white">{tr(primaryAlert.description)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onOpenContacts && (
            <button
              onClick={onOpenContacts}
              className="keep-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F97316] hover:bg-orange-500 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span>101 / 108 / DM</span>
            </button>
          )}
          <button
            onClick={() =>
              onSpeakAlert(
                `${tr(primaryAlert.severity)} Alert in ${tr(primaryAlert.district)}. ${tr(primaryAlert.title)}. ${tr(primaryAlert.description)}. For emergency help dial 1 1 2, Fire 1 0 1, Ambulance 1 0 8, or District Collector 1 0 7 7.`
              )
            }
            className="keep-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#155E75] hover:bg-[#1769AA] text-white text-xs font-semibold transition-colors border border-sky-400/30"
            title="Read this alert aloud"
            aria-label="Listen to active alert"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{t('listenBtn')}</span>
          </button>

          <button
            onClick={() => onSelectAlert(primaryAlert)}
            className="keep-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#0284C7] text-white text-xs font-bold transition-colors shadow-xs"
          >
            <span>{t('viewMapBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
}
