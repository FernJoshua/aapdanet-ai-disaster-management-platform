import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Waves, 
  Wind, 
  Activity, 
  Mountain, 
  Sun, 
  AlertOctagon, 
  CheckCircle2, 
  Volume2, 
  Search, 
  Package, 
  HelpCircle,
  FileDown
} from 'lucide-react';
import { getTranslation } from '../utils/translations';

export default function DisasterGuide({ lang, onSpeakText }) {
  const t = (key) => getTranslation(lang, key);

  const [activeCategory, setActiveCategory] = useState('floods');
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      id: 'floods',
      title: "Floods & Flash Inundations",
      icon: Waves,
      color: "text-blue-400",
      bgColor: "bg-blue-950/40 border-blue-800/60",
      summary: "Floods are the most frequent natural catastrophe. Rapid rising waters in lowlands, rivers, and coastal streets require swift precautionary action.",
      before: [
        "Identify the elevation of your residence and know the nearest municipal relief shelter.",
        "Keep sandbags, emergency battery torches, and a first-aid kit readily accessible.",
        "Elevate critical household appliances, documents, and electrical wiring above flood waterline.",
        "Store sufficient drinking water in clean, sealed containers for at least four days."
      ],
      during: [
        "Turn off the main electrical circuit breaker and LPG gas cylinder valve before water enters.",
        "Never walk or drive through moving flood waters; just six inches of fast-moving water can knock an adult down, and twelve inches will float a car.",
        "Do not touch electrical equipment or submerged power poles to prevent electrocution.",
        "If trapped on upper floors, signal for rescue from the balcony using a bright cloth or whistle. Do not climb into enclosed attics without roof exits."
      ],
      after: [
        "Do not drink tap water until authorities certify the municipal water line is free of contamination; boil all drinking water thoroughly.",
        "Watch out for snakes, rodents, and other animals that may have taken refuge inside homes.",
        "Inspect foundations, walls, and ceiling beams for structural settlement cracks before re-entering."
      ]
    },
    {
      id: 'cyclones',
      title: "Cyclones & Severe Coastal Storm Surges",
      icon: Wind,
      color: "text-teal-400",
      bgColor: "bg-teal-950/40 border-teal-800/60",
      summary: "Severe cyclonic storms bring violent sustained winds exceeding 100 kilometers per hour, torrential rainfall, and coastal ocean surges.",
      before: [
        "Trim overgrown tree branches close to house roofs, electric cables, and window panes.",
        "Secure or remove loose corrugated iron sheets, tin hoardings, and solar panels from terraces.",
        "Do not tape glass windows; taping does not prevent breakage and only produces larger, more dangerous glass shards.",
        "Keep battery-powered radios tuned to meteorological disaster broadcasts for landfall updates."
      ],
      during: [
        "Remain strictly indoors in the strongest, windowless central room of your residence.",
        "Stay away from windows, balconies, and glass exterior facades.",
        "Do not venture out during the lull or calm when the eye of the cyclone passes overhead; violent winds from the reverse direction will resume abruptly within minutes."
      ],
      after: [
        "Strictly avoid dangling, damaged, or fallen electrical power cables and report them to authorities.",
        "Clear stagnant water pools around your home to prevent dengue and malaria outbreaks.",
        "Cooperate with civic sanitation teams clearing uprooted trees and road debris."
      ]
    },
    {
      id: 'earthquakes',
      title: "Earthquakes & Structural Tremors",
      icon: Activity,
      color: "text-red-400",
      bgColor: "bg-red-950/40 border-red-800/60",
      summary: "Ground shaking strikes abruptly without meteorological advance warning. Immediate protective instinct saves lives.",
      before: [
        "Fasten heavy furniture, cupboards, water heaters, and overhead ceiling fans securely to walls.",
        "Identify safe interior spots in every room: under sturdy wooden desks, heavy tables, or interior doorframes.",
        "Conduct periodic earthquake family drills so everyone knows the Drop, Cover, and Hold sequence."
      ],
      during: [
        "DROP to your hands and knees. COVER your head and neck under a sturdy table or desk. HOLD ON until shaking ceases.",
        "If inside a high-rise building, stay inside. Do not dash for staircases and never use elevators during tremor.",
        "If outdoors in open streets, move directly away from high-rise buildings, flyovers, brick walls, and utility wires."
      ],
      after: [
        "Expect aftershocks. Be prepared to repeat the Drop, Cover, and Hold On sequence if secondary tremors occur.",
        "Check yourself and nearby persons for injuries and administer first aid before moving.",
        "Smell for LPG gas leaks. If gas odor is detected, open windows and evacuate immediately without operating electric switches."
      ]
    },
    {
      id: 'landslides',
      title: "Landslides & Hill Slope Mudflows",
      icon: Mountain,
      color: "text-amber-400",
      bgColor: "bg-amber-950/40 border-amber-800/60",
      summary: "Steep slopes and ghat roads destabilized by saturated rainfall can collapse with immense momentum and burying force.",
      before: [
        "Learn whether your locality has recorded historic landslide activity or geological slope instability.",
        "Watch for telltale warning signs: new surface cracks in hill soil, tilted utility poles, leaning trees, or suddenly stuck doors.",
        "Install surface drainage channels around hillsides to divert water runoff away from fragile slopes."
      ],
      during: [
        "If hillside rocks begin clattering or soil breaks loose, run immediately perpendicular to the downhill slide path.",
        "Never seek shelter in natural valleys, stream beds, or ravines where debris flows concentrate.",
        "If caught without an escape route, curl into a tight ball and cover your head with your arms to protect vital organs."
      ],
      after: [
        "Stay clear of the landslide footprint; secondary slope failures often follow initial landslides.",
        "Alert rescue authorities to search for trapped residents using specialized victim location equipment.",
        "Check for severed water pipes, broken gas connections, and compromised road culverts."
      ]
    },
    {
      id: 'heatwaves',
      title: "Extreme Heatwaves & Thermal Stress",
      icon: Sun,
      color: "text-orange-400",
      bgColor: "bg-orange-950/40 border-orange-800/60",
      summary: "Prolonged periods of excessively hot temperatures cause severe dehydration, heat cramps, heat exhaustion, and fatal heatstroke.",
      before: [
        "Stock up on Oral Rehydration Salts, glucose, electral packets, and lemon water at home.",
        "Keep curtains, blinds, and window shutters closed on sun-facing sides during daytime peak hours."
      ],
      during: [
        "Avoid stepping outdoors into direct sunlight between twelve noon and three-thirty in the afternoon.",
        "Drink water frequently throughout the day, even if you do not feel thirsty, to prevent dehydration.",
        "Wear loose, lightweight, light-colored cotton clothing and cover your head with a cloth or umbrella when outside.",
        "If anyone displays hot dry skin, confusion, or loss of consciousness, move them immediately to a shaded spot, cool their body with cold water towels, and call emergency ambulance services."
      ],
      after: [
        "Continue hydration and rest in ventilated rooms.",
        "Ensure elderly family members and pets have adequate cool water and shaded resting environments."
      ]
    }
  ];

  const currentGuide = guides.find(g => g.id === activeCategory) || guides[0];

  const filteredGuides = searchQuery.trim() === ''
    ? guides
    : guides.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{t('guideTitle')}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              {t('guideSubtitle')}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              {t('guideDesc')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSpeakText(`Safety Guidelines for ${currentGuide.title}. ${currentGuide.summary}. Key during-disaster rule: ${currentGuide.during[0]}`)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Read Guide Aloud</span>
            </button>
          </div>
        </div>

        {/* Search & Category Pills */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {guides.map((g) => {
              const Icon = g.icon;
              return (
                <button
                  key={g.id}
                  onClick={() => setActiveCategory(g.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                    activeCategory === g.id
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${g.color}`} />
                  <span>{g.title}</span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search emergency safety tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-56"
            />
          </div>
        </div>
      </div>

      {/* Main Guide Content Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${currentGuide.bgColor} border`}>
              <currentGuide.icon className={`w-8 h-8 ${currentGuide.color}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{currentGuide.title}</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {currentGuide.summary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              Certified Safety Protocol
            </span>
          </div>
        </div>

        {/* 3 Step Protocol Cards: Before, During, After */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Phase 1: Before */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500">
                1
              </span>
              <h4 className="font-bold text-white text-sm">Before the Disaster (Preparedness)</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {currentGuide.before.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 2: During */}
          <div className="bg-slate-950 p-5 rounded-xl border border-red-900/60 space-y-3">
            <div className="flex items-center gap-2 border-b border-red-900/60 pb-2">
              <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 font-bold text-xs flex items-center justify-center border border-red-500">
                2
              </span>
              <h4 className="font-bold text-white text-sm text-red-400">During the Emergency (Survival)</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
              {currentGuide.during.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-0.5">•</span>
                  <span className="font-medium">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 3: After */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500">
                3
              </span>
              <h4 className="font-bold text-white text-sm text-emerald-400">After the Disaster (Recovery)</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {currentGuide.after.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency Go-Bag Checklist Box */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2 text-amber-400">
              <Package className="w-4 h-4" />
              <span>Universal Emergency Go-Bag Checklist (72-Hour Survival Kit)</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Pack in waterproof backpack</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <strong className="text-white block">Water Supply</strong>
              <p className="text-[11px] text-slate-400 leading-normal">Three liters per person per day sealed in clean bottles.</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <strong className="text-white block">Dry Food</strong>
              <p className="text-[11px] text-slate-400 leading-normal">Ready-to-eat dry fruits, energy biscuits, and canned food.</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <strong className="text-white block">First Aid Kit</strong>
              <p className="text-[11px] text-slate-400 leading-normal">Bandages, antiseptic lotion, pain relievers, and prescription medicines.</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <strong className="text-white block">Torch & Radio</strong>
              <p className="text-[11px] text-slate-400 leading-normal">Battery-powered flashlight, extra cells, and power bank.</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <strong className="text-white block">Essential Papers</strong>
              <p className="text-[11px] text-slate-400 leading-normal">Identity cards, property deeds, and cash in plastic zip bags.</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <strong className="text-white block">Whistle & Mask</strong>
              <p className="text-[11px] text-slate-400 leading-normal">N95 dust mask and signaling whistle for attracting rescuers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
