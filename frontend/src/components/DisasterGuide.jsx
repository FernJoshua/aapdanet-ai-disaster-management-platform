import React, { useState } from 'react';
import {
  ShieldCheck,
  Waves,
  Wind,
  Activity,
  Mountain,
  Sun,
  Flame,
  Zap,
  AlertOctagon,
  CheckCircle2,
  Volume2,
  Search,
  Package,
  MapPin,
  PhoneCall
} from 'lucide-react';
import { getTranslation, translatePhrase } from '../utils/translations';

export default function DisasterGuide({ lang, onSpeakText }) {
  const t = (key) => getTranslation(lang, key);
  const tp = (phrase) => translatePhrase(lang, phrase);

  const [activeCategory, setActiveCategory] = useState('fire');
  const [selectedRegion, setSelectedRegion] = useState('coastal');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedItems, setCheckedItems] = useState({ 0: true, 1: true });

  const regions = [
    {
      id: 'coastal',
      name: 'Coastal & Metropolitan Belt',
      cities: 'Mumbai, Thane, Navi Mumbai, Ratnagiri, Alibag',
      geography: 'Low-lying coastal plains, tidal creeks, high-density high-rise towers & humid marine climate'
    },
    {
      id: 'ghats',
      name: 'Western Ghats & River Valleys',
      cities: 'Pune, Satara, Kolhapur, Mahad, Chiplun, Lonavala',
      geography: 'Steep basalt hill slopes, major dam reservoirs, ghat highways & river floodplains'
    },
    {
      id: 'inland',
      name: 'Inland Dry Plateau & High-Heat Zone',
      cities: 'Nagpur, Nashik, Solapur, Chhatrapati Sambhajinagar, Akola',
      geography: 'Semi-arid continental plains, extreme summer temperatures (44°C–48°C), industrial & dry forest belts'
    }
  ];

  const guides = [
    {
      id: 'fire',
      title: 'Fire Emergencies (Building, Electrical, LPG & Wildfire)',
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-950/40 border-orange-800/60',
      helpline: '101 (Fire Brigade) / 112',
      summary:
        'Fires spread exponentially within minutes due to toxic smoke inhalation, electrical short-circuits, LPG leaks, or dry summer brush.',
      regionalNotes: {
        coastal:
          'Mumbai / Thane High-Rise & Dense Ward Protocol: Never use elevators during a high-rise fire. Seal AC ducts with wet towels if trapped. Keep society fire-hydrant riser valves unobstructed by parked cars so 101 snorkel ladders can enter.',
        ghats:
          'Pune / Satara / Hill Slope Protocol: Dry grass on hill slopes ignites rapidly in summer. Create a 10-meter cleared firebreak around hillside homes and resorts. If a forest fire approaches, move downhill against the wind—never uphill ahead of flames.',
        inland:
          'Nagpur / Vidarbha High-Heat Fire Protocol: Extreme 45°C+ summer heat overloads electrical transformers and AC units. Switch off heavy appliances during peak afternoon voltage fluctuations and store flammable materials away from tin roofs.'
      },
      before: [
        'Install smoke detectors and keep an ABC-rated Dry Chemical Powder fire extinguisher near the kitchen and main electrical board.',
        'Inspect LPG rubber hoses every 6 months and always turn off the cylinder regulator knob every night.',
        'Avoid overloading a single wall socket with multiple high-wattage appliances (ACs, heaters, irons).',
        'Know at least two unobstructed emergency exit staircases in your apartment or office building.'
      ],
      during: [
        'Immediately dial 101. Crawl LOW under smoke—toxic carbon monoxide rises, and breathable air stays within 12–24 inches of the floor.',
        'For Electrical Fires: NEVER throw water! Switch off the main MCB breaker and use a CO2 or dry powder extinguisher.',
        'For LPG / Kitchen Oil Fires: Smother the pan with a wet cotton blanket or metal lid; never pour water on burning oil.',
        'If your clothes catch fire: STOP, DROP to the ground, and ROLL to smother the flames.'
      ],
      after: [
        'Do not re-enter a fire-damaged building until Fire Brigade officers (101) certify structural stability and clear toxic fumes.',
        'Have a licensed electrician inspect all melted wiring before restoring the main electrical supply.',
        'Treat minor burns by running cool tap water for 15 minutes—never apply ice, butter, or toothpaste to burns.'
      ]
    },
    {
      id: 'heatwaves',
      title: 'Extreme Heatwaves & Severe Hot Weather',
      icon: Sun,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-800/60',
      helpline: '108 (Medical Emergency) / 104',
      summary:
        'Severe hot weather and high wet-bulb humidity prevent the human body from cooling via sweat, leading rapidly to heat exhaustion and fatal heatstroke.',
      regionalNotes: {
        coastal:
          'Coastal Humid Heat (Mumbai / Konkan): Even at 36°C–38°C, 80% coastal humidity creates a lethal "Feels Like" Heat Index above 47°C (Wet-Bulb effect). Sweat does not evaporate easily—use cross-ventilation, dehumidifiers/fans, and ORS.',
        ghats:
          'Valley & Urban Heat Island (Pune / Kolhapur): Concrete road surfaces trap afternoon radiation. Avoid two-wheeler travel between 12:30 PM and 3:30 PM and carry electrolyte water.',
        inland:
          'Extreme Dry Heatwave Zone (Nagpur / Vidarbha / Marathwada): Daytime temperatures regularly cross 45°C–47°C with hot "Loo" winds. Apply white lime/solar-reflective paint or wet gunny mats (khas) on roofs and coolers.'
      },
      before: [
        'Stock Oral Rehydration Salts (ORS), lemon, buttermilk (taak), coconut water, and glucose packets at home.',
        'Install bamboo blinds, khus curtains, or reflective sun-films on west- and south-facing windows.',
        'Schedule outdoor construction, agricultural, or delivery work for early morning (6 AM–11 AM) or late evening.'
      ],
      during: [
        'Drink water every 30–45 minutes even if you do not feel thirsty; avoid alcohol, fizzy sodas, and excess caffeine.',
        'Wear loose, breathable, light-colored cotton clothes and always carry an umbrella, cap, and sunglasses outdoors.',
        'NEVER leave children, elderly persons, or pets inside a parked vehicle—cabin temperatures exceed 60°C in 10 minutes.',
        'Heatstroke Emergency Sign: If someone has hot red dry skin (no sweat), dizziness, or unconsciousness, move them to shade, sponge with ice/cold water in armpits and neck, and call 108 immediately.'
      ],
      after: [
        'Continue electrolyte hydration for 24 hours after prolonged sun exposure.',
        'Check on elderly neighbors living alone and leave bowls of cool water in shaded spots for birds and street animals.'
      ]
    },
    {
      id: 'floods',
      title: 'Floods, Urban Cloudbursts & Tidal Inundation',
      icon: Waves,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/40 border-blue-800/60',
      helpline: '1916 / 1077 / 112',
      summary:
        'Flash floods and river overflows occur when intense rainfall exceeds drainage capacity or coincides with sea high tides and dam releases.',
      regionalNotes: {
        coastal:
          'Coastal High-Tide Backflow (Mumbai / Thane / Ratnagiri): When >65mm/hr rain coincides with a >4.2m Arabian Sea high tide, storm drains lock. Avoid subways (Andheri, Milan, Hindmata, Kurla) and never open manhole covers.',
        ghats:
          'River Basin & Dam Spillway Zone (Chiplun / Kolhapur / Sangli / Pune): Watch CWC alerts for Koyna, Khadakwasla, and Almatti dam releases. River levels can rise 2 meters within an hour even if local rain pauses.',
        inland:
          'Inland Flash Runoff (Nagpur / Nashik): Sudden cloudbursts cause dry nallahs and causeways to overflow rapidly. Never cross a submerged low-level bridge on a two-wheeler or car.'
      },
      before: [
        'Know your locality flood mark and locate the nearest elevated municipal school or relief camp on the AapdaNet GIS map.',
        'Seal important documents (Aadhaar, property papers, medicines) in waterproof zip-lock bags.',
        'Keep a charged power bank, emergency torch, whistle, and 4 days of dry ration and clean drinking water ready.'
      ],
      during: [
        'Turn off the main electricity switchboard and LPG gas cylinder valve immediately if water starts entering your ground floor.',
        'Never walk through moving water deeper than 6 inches or drive through 12 inches of water—cars float and stall.',
        'Stay away from submerged electric poles, street-light junction boxes, and transformer cabins to prevent electrocution.',
        'Move to the 1st/2nd floor or open terrace and transmit your GPS location via the AapdaNet SOS button.'
      ],
      after: [
        'Boil all drinking water or use chlorine tablets until authorities certify municipal pipelines are safe.',
        'Check inside shoes, cupboards, and corners with a stick for snakes or insects displaced by floodwaters.',
        'Request 1912 electricians to dry and test your meter box before switching power back on.'
      ]
    },
    {
      id: 'cyclones',
      title: 'Cyclones & Severe Coastal Storm Surges',
      icon: Wind,
      color: 'text-teal-400',
      bgColor: 'bg-teal-950/40 border-teal-800/60',
      helpline: '1554 (Coast Guard) / 1070 / 112',
      summary:
        'Cyclonic storms bring destructive winds (>100 km/h), flying debris, uprooted trees, and coastal sea-water surges.',
      regionalNotes: {
        coastal:
          'Konkan & Mumbai Coastline: Fishermen must return to harbor 48 hours before landfall. Residents within 1 km of sea/creeks in kaccha or tin-roofed houses must evacuate to concrete cyclone shelters.',
        ghats:
          'Ghat Crest Wind Tunnel: Cyclonic remnants crossing the Sahyadri ridge produce violent wind gusts and torrential rain—avoid ghat driving.',
        inland:
          'Inland Post-Cyclone Squalls: Deep depressions moving inland bring 60–80 km/h wind squalls and unseasonal heavy rain; secure agricultural sheds and solar panels.'
      },
      before: [
        'Trim dead tree branches overhanging roofs and power lines; secure loose tin sheets, water tanks, and dish antennas.',
        'Close storm shutters or board up large glass windows; keep curtains drawn to catch any flying glass.',
        'Fully charge all mobile phones, emergency lanterns, and keep a battery radio ready.'
      ],
      during: [
        'Stay inside the strongest central hallway or windowless room of your home away from glass doors.',
        'Beware the "Eye of the Cyclone": If winds suddenly go calm, DO NOT step outside—violent winds from the opposite direction will resume within minutes.',
        'Unplug television antennas, routers, and heavy appliances.'
      ],
      after: [
        'Do not touch fallen power lines or walk through water pooled near snapped wires (call 1912).',
        'Avoid sightseeing near seafronts or damaged jetties until the storm surge warning is officially lifted.'
      ]
    },
    {
      id: 'landslides',
      title: 'Landslides, Rockfalls & Ghat Mudflows',
      icon: Mountain,
      color: 'text-yellow-400',
      bgColor: 'bg-amber-950/40 border-amber-800/60',
      helpline: '1077 / 112',
      summary:
        'Continuous heavy rain saturates hill soil, causing sudden mudslides and boulder falls along steep slopes and ghat highways.',
      regionalNotes: {
        coastal:
          'Hilly Slums & Quarry Slopes (Mumbai — Antop Hill, Bhandup, Vikroli, Kalwa): Watch for retaining wall cracks during heavy monsoon spells and move to municipal transit camps immediately.',
        ghats:
          'Sahyadri Ghat Corridors (Mahad, Poladpur, Malshej, Tamhini, Amba, Koyna): Avoid night travel on ghat highways during Red/Orange rainfall alerts. Watch for muddy water suddenly seeping from rock faces.',
        inland:
          'Foothill & Embankment Cuts: Stay clear of steep river embankments and open-cast mine slopes during heavy downpours.'
      },
      before: [
        'Watch for early geological warning signs: new cracks in hillside soil, tilting trees/poles, or doors/windows suddenly jamming.',
        'Ensure hillside drainage channels (weep holes) in retaining walls are cleared of plastic and silt before monsoon.'
      ],
      during: [
        'If you hear rumbling or cracking trees on a slope, run sideways (perpendicular) to the path of the debris flow—never straight downhill.',
        'Never stop your vehicle under overhanging ghat cliffs or waterfalls during heavy rain.',
        'If trapped indoors with no time to escape, shelter under a heavy table on the uphill side of the structure.'
      ],
      after: [
        'Stay away from the slide zone—secondary mudslides frequently occur hours after the main collapse.',
        'Alert 1077 / NDRF immediately with exact highway milestone markers.'
      ]
    },
    {
      id: 'earthquakes',
      title: 'Earthquakes & Structural Tremors',
      icon: Activity,
      color: 'text-red-400',
      bgColor: 'bg-red-950/40 border-red-800/60',
      helpline: '112 / 1070',
      summary:
        'Seismic tremors strike without prior warning. Immediate Drop-Cover-Hold action prevents injury from falling masonry and fixtures.',
      regionalNotes: {
        coastal:
          'Reclaimed Land & High-Rises (Mumbai / Navi Mumbai): High-rise buildings are engineered to sway slightly. Stay indoors away from glass facades; never rush into staircases while shaking is active.',
        ghats:
          'Reservoir Seismicity Belt (Koyna / Satara / Patan — Seismic Zone IV): Anchor heavy cupboards to walls and avoid sleeping directly beneath heavy unreinforced beams.',
        inland:
          'Marathwada & Inland Masonry (Latur / Killari / Nanded): Reinforce stone/brick walls with lintel bands and move to open courtyards only after shaking stops.'
      },
      before: [
        'Bolt tall wardrobes, bookshelves, geysers, and heavy mirrors securely to wall studs.',
        'Practice the DROP, COVER, and HOLD ON drill with all family members.'
      ],
      during: [
        'DROP to your hands and knees, take COVER under a sturdy table or against an interior load-bearing wall, and HOLD ON.',
        'NEVER use elevators. Stay away from glass windows, chandeliers, and outer walls.',
        'If outdoors, move to an open clearing away from buildings, trees, flyovers, and electric wires.'
      ],
      after: [
        'Be prepared for aftershocks. Evacuate calmly via stairs once shaking stops.',
        'If you smell leaking LPG gas, open windows, turn off the cylinder knob, and DO NOT switch on/off any electrical switches.'
      ]
    },
    {
      id: 'lightning',
      title: 'Lightning, Thunderstorms & Wind Squalls',
      icon: Zap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/40 border-purple-800/60',
      helpline: '108 / 112',
      summary:
        'Pre-monsoon and monsoon convective thunderstorms generate lethal cloud-to-ground lightning strikes and sudden 70 km/h downdraft gusts.',
      regionalNotes: {
        coastal:
          'Beaches & Open Creeks: Exit sea water and open beaches (Juhu, Girgaon, Alibag) immediately when thunder is heard.',
        ghats:
          'Trekking & Hill Forts (Sahyadri Forts): Exposed rocky peaks attract lightning. Descend from ridge tops before afternoon storm clouds build.',
        inland:
          'Open Agricultural Fields (Vidarbha / Marathwada / Nashik): Lightning is a leading cause of rural casualties—never shelter under isolated tall trees in open farms.'
      },
      before: [
        'Follow the 30-30 Rule: If thunder follows a lightning flash in less than 30 seconds, seek indoor shelter immediately.',
        'Install lightning arresters on tall rural structures and apartment terraces.'
      ],
      during: [
        'Move inside a fully enclosed concrete building or a metal-topped car (with windows rolled up).',
        'NEVER stand under an isolated tree, near wire fences, electric poles, or on open rooftops.',
        'Stay away from corded phones, plumbing taps, and metal window frames indoors.'
      ],
      after: [
        'Wait 30 minutes after the last clap of thunder before resuming outdoor activity.',
        'Note: A lightning strike victim does NOT carry residual electric charge—administer CPR immediately and call 108.'
      ]
    },
    {
      id: 'chemical',
      title: 'Industrial Gas Leaks & Chemical Hazards',
      icon: AlertOctagon,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40 border-emerald-800/60',
      helpline: '101 / 108 / 112',
      summary:
        'Accidental chemical releases (ammonia, chlorine, LPG tankers) in industrial belts or highways require immediate upwind evacuation and respiratory protection.',
      regionalNotes: {
        coastal:
          'Chembur / Trombay / Taloja / Thane-Belapur MIDC Belt: Observe factory wind-socks and move cross-wind or upwind if chemical odor or yellow/white vapor plume is seen.',
        ghats:
          'Mumbai-Pune Expressway & Ghat Tanker Corridors: Stay at least 500m upwind from overturned chemical or LPG tankers; never smoke or start engines near a leak.',
        inland:
          'Aurangabad / Nagpur / Nashik Industrial Estates: Close all windows, turn off air-conditioners, and cover nose/mouth with a damp cloth.'
      },
      before: [
        'Identify industrial hazard zones near your workplace or residence and know the prevailing wind direction.',
        'Keep N95 masks, eye-wash saline, and cotton cloths in your home emergency kit.'
      ],
      during: [
        'Move UPWIND and UPHILL (most toxic industrial gases are heavier than air and settle in low areas).',
        'Breathe through a wet cloth or towel held over your nose and mouth.',
        'If sheltering in place: Close all windows, switch off exhaust fans and ACs, and seal door gaps with wet towels.'
      ],
      after: [
        'Remove exposed outer clothing, wash eyes and skin thoroughly with clean running water for 15 minutes, and seek medical care (108).'
      ]
    }
  ];

  const goBagItems = [
    '4 Liters of Drinking Water per person + Chlorine tablets & ORS packets',
    'Non-perishable high-energy dry food (chikki, roasted gram, biscuits, baby food)',
    'First-Aid Kit, prescription medicines (insulin, BP, inhaler), antiseptic & bandages',
    'Waterproof folder with Aadhaar, PAN, Insurance, Bank & Property copies',
    'LED Torch with extra batteries, Power Bank (20,000mAh) & charging cables',
    'Loud Emergency Whistle, Swiss knife, rope & waterproof matchboxes',
    'Cash in small denominations (ATMs may be offline during power cuts)',
    'N95 masks, sanitizer, soap, sanitary pads & a warm blanket/rain poncho'
  ];

  const currentGuide = guides.find((g) => g.id === activeCategory) || guides[0];
  const currentRegionObj = regions.find((r) => r.id === selectedRegion) || regions[0];

  const filteredGuides =
    searchQuery.trim() === ''
      ? guides
      : guides.filter(
          (g) =>
            g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.summary.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <div className="space-y-8 pb-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('guideTitle')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {t('guideSubtitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1">
              {t('guideDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                onSpeakText(
                  `${currentGuide.title} for ${currentRegionObj.name}. ${currentGuide.summary}. Regional protocol: ${currentGuide.regionalNotes[selectedRegion]}. Key survival rule: ${currentGuide.during[0]}`
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
                placeholder="Search fire, heatwave, flood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 w-56"
              />
            </div>
          </div>
        </div>

        {/* STEP 1: Select Geographic Region / City Context */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            Step 1: Select Your Geographic Region & City (Tailors Protocols to Local Terrain & Climate):
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedRegion === reg.id
                    ? 'bg-cyan-950 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-xs text-white flex items-center justify-between">
                  <span>{reg.name}</span>
                  {selectedRegion === reg.id && (
                    <span className="keep-white px-2 py-0.5 rounded bg-cyan-600 text-white text-[9px]">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-cyan-300 font-semibold mt-0.5">{reg.cities}</div>
                <div className="text-[10px] text-slate-400 mt-1">{reg.geography}</div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2: Select Disaster Hazard Type (8 Categories) */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 block">
            Step 2: Select Disaster Type (8 Major Hazards Covered):
          </span>
          <div className="flex flex-wrap gap-2">
            {filteredGuides.map((g) => {
              const Icon = g.icon;
              return (
                <button
                  key={g.id}
                  onClick={() => setActiveCategory(g.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    activeCategory === g.id
                      ? 'bg-cyan-600 text-white keep-white border-cyan-500 shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeCategory === g.id ? 'text-white' : g.color}`} />
                  <span>{g.title.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Guide Detailed Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3.5 rounded-2xl ${currentGuide.bgColor} border`}>
              <currentGuide.icon className={`w-8 h-8 ${currentGuide.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">{currentGuide.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {currentGuide.summary}
              </p>
            </div>
          </div>

          <a
            href={`tel:${currentGuide.helpline.split(' ')[0]}`}
            className="keep-white px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Helpline: {currentGuide.helpline}</span>
          </a>
        </div>

        {/* Region-Specific & City-Specific Geography Directive Banner */}
        <div className="bg-cyan-950/50 border-l-4 border-cyan-400 border border-cyan-800/60 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>
              City & Geography Specific Protocol — {currentRegionObj.name} ({currentRegionObj.cities})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
            {currentGuide.regionalNotes[selectedRegion]}
          </p>
        </div>

        {/* 3-Phase Survival Cards: Before, During, After */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 1: Before */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <span className="keep-white w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-white text-sm">
                {tp('Before the Disaster (Preparedness)')}
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              {currentGuide.before.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 2: During */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-red-900/50 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <span className="keep-white w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-white text-sm">
                {tp('During the Emergency (Survival)')}
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-200 leading-relaxed">
              {currentGuide.during.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 3: After */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-900/50 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <span className="keep-white w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-white text-sm">
                {tp('After the Disaster (Recovery)')}
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              {currentGuide.after.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive 72-Hour Emergency Go-Bag Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-lg font-extrabold text-white">
                Interactive 72-Hour Family Emergency Go-Bag Checklist
              </h3>
              <p className="text-xs text-slate-400">
                Tick off items your household has packed and ready for rapid evacuation
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            Ready: {Object.values(checkedItems).filter(Boolean).length} / {goBagItems.length} Packed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {goBagItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }))}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                checkedItems[idx]
                  ? 'bg-emerald-950/40 border-emerald-600/60 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  checkedItems[idx] ? 'text-emerald-400' : 'text-slate-600'
                }`}
              />
              <span className={checkedItems[idx] ? 'line-through opacity-80' : ''}>{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
