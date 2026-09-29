// Comprehensive Regional & National Disaster Intelligence Data
// Includes Active On-Going Real-Time Alerts, Relieved Disasters Archive, National Helplines (101, 108, 112), and City-Wise DM/Police/Representative Directory

export const MAHARASHTRA_CENTER = [18.9878, 73.8567];
export const MUMBAI_COORDS = [19.0760, 72.8777];

// 1. ACTIVE ON-GOING REAL-TIME EMERGENCIES (Main Focus)
export const INITIAL_ALERTS = [
  {
    id: "ALT-LIVE-01",
    district: "Mumbai Suburban",
    location: "Mithi River Basin (Kurla - BKC Belt)",
    type: "Flash Flood",
    severity: "CRITICAL",
    color: "#ef4444",
    title: "Mithi River Danger Water Level Warning",
    description: "Water level crossed 3.85m (Warning mark 3.5m) coupled with 4.2m Arabian Sea High Tide. Inundation alert active for Kurla West, Kranti Nagar and Bail Bazar.",
    timestamp: "Live • 8 mins ago",
    affectedCount: "14,200 citizens",
    evacuationStatus: "Mandatory Evacuation Ongoing",
    coordinates: [19.0728, 72.8795],
    audioText: "Critical Alert: Flash Flood warning at Mithi River Basin, Kurla and BKC. High tide approaching. Evacuate low-lying areas immediately."
  },
  {
    id: "ALT-LIVE-02",
    district: "Raigad",
    location: "Mahad - Poladpur Ghat Corridor (NH-66)",
    type: "Landslide & Heavy Rain",
    severity: "HIGH",
    color: "#f59e0b",
    title: "Ghat Section Slope Instability & Heavy Rainfall Alert",
    description: "Continuous 190mm rainfall in last 18 hours triggered soil destabilization on NH-66 and Mahad link roads. SDRF deployed with heavy earthmovers and dewatering units.",
    timestamp: "Live • 24 mins ago",
    affectedCount: "3,800 commuters & residents",
    evacuationStatus: "Traffic Diverted & Relief Active",
    coordinates: [18.0827, 73.4188],
    audioText: "High Alert: Landslide risk in Mahad and Poladpur Ghat section due to heavy rain. Avoid National Highway 66."
  },
  {
    id: "ALT-LIVE-03",
    district: "Ratnagiri",
    location: "Chiplun (Vashishti River Basin)",
    type: "Riverine Flood",
    severity: "HIGH",
    color: "#f59e0b",
    title: "Vashishti River Discharge & Coastal Surge Watch",
    description: "Reservoir spillway discharge at 45,000 cusecs. Market yard and low-elevation wards in Chiplun experiencing water ingress. 11 rescue boats deployed.",
    timestamp: "Live • 45 mins ago",
    affectedCount: "8,500 citizens",
    evacuationStatus: "Relief Camps Open & Active",
    coordinates: [17.5323, 73.5186],
    audioText: "Warning: Vashishti River in Chiplun rising due to dam discharge. Move to designated municipal shelters."
  },
  {
    id: "ALT-LIVE-04",
    district: "Nagpur",
    location: "Nagpur Urban & MIDC Industrial Belt",
    type: "Extreme Heatwave & Fire Risk",
    severity: "MODERATE",
    color: "#f97316",
    title: "Severe Thermal Stress & Urban Fire Advisory",
    description: "Daytime surface temperature anomaly +4.6°C above normal with low relative humidity (22%). High transformer and dry-brush fire risk across industrial wards.",
    timestamp: "Live • 1 hour ago",
    affectedCount: "22,000 outdoor workers",
    evacuationStatus: "Cooling Centers & Fire Tenders Ready",
    coordinates: [21.1458, 79.0882],
    audioText: "Advisory: Severe heatwave and dry fire risk in Nagpur sector. Stay hydrated and avoid peak afternoon sun."
  }
];

// 2. ALREADY RELIEVED & RESOLVED DISASTERS ARCHIVE (Completed Operations)
export const RELIEVED_DISASTERS = [
  {
    id: "REL-2026-01",
    district: "Kolhapur",
    location: "Shirol & Panchganga River Belt",
    type: "Riverine Flood",
    previousSeverity: "CRITICAL",
    status: "RELIEVED & RESOLVED",
    resolvedTime: "Relieved 6 hours ago",
    summary: "Panchganga water level receded below 38.2ft safe mark after controlled Almatti outflow. All 4,200 evacuated citizens safely returned or settled; highways reopened.",
    peopleRescued: 4210,
    unitsDeployed: "NDRF 5th Bn (4 Boats, 6 Ambulances)",
    recoveryNote: "Sanitation, chlorination, and medical camps completed across 14 villages."
  },
  {
    id: "REL-2026-02",
    district: "Thane",
    location: "Bhiwandi Warehouse & MIDC Sector",
    type: "Industrial Structure Fire",
    previousSeverity: "HIGH",
    status: "RELIEVED & CONTAINED",
    resolvedTime: "Relieved Yesterday",
    summary: "Grade-3 chemical and textile warehouse fire completely extinguished by 12 Fire Tenders (101) and foam units within 3.5 hours. Zero casualties recorded.",
    peopleRescued: 380,
    unitsDeployed: "12 Fire Engines (101), 4 ALS Ambulances (108)",
    recoveryNote: "Air quality index (AQI) restored to normal; structural cooling completed."
  },
  {
    id: "REL-2026-03",
    district: "Pune",
    location: "Ekta Nagar & Sinhagad Road (Mutha Basin)",
    type: "Urban Waterlogging",
    previousSeverity: "HIGH",
    status: "RELIEVED & CLEARED",
    resolvedTime: "Relieved 18 hours ago",
    summary: "Khadakwasla spillway release reduced from 35,000 to 8,000 cusecs. High-capacity PMC dewatering pumps cleared all basement and street inundation.",
    peopleRescued: 1650,
    unitsDeployed: "PMC Disaster Cell, 8 Dewatering Pumps, 3 Boats",
    recoveryNote: "Power supply restored by MSEDCL after transformer safety inspection."
  },
  {
    id: "REL-2026-04",
    district: "Satara",
    location: "Koyna Hydroelectric Zone & Patan",
    type: "Minor Seismic Tremor (M 3.6)",
    previousSeverity: "MODERATE",
    status: "RELIEVED • ALL SAFE",
    resolvedTime: "Relieved 2 days ago",
    summary: "Comprehensive dam instrumentation and structural telemetry confirmed zero cracks or seepage following minor M 3.6 tremor. Normal operations resumed.",
    peopleRescued: 1200,
    unitsDeployed: "Geological Survey & Dam Safety Rapid Inspection Team",
    recoveryNote: "All 28 piezometers and accelerometers reading nominal baseline."
  },
  {
    id: "REL-2026-05",
    district: "Alibag / Raigad Coast",
    location: "Mandwa - Rewas Coastal Belt",
    type: "Cyclonic Squall & High Swell",
    previousSeverity: "HIGH",
    status: "RELIEVED & SAFE",
    resolvedTime: "Relieved 3 days ago",
    summary: "Offshore low-pressure trough dissipated westward. All 142 fishing trawlers guided safely back to harbor via Coast Guard & Fisheries radio beacon.",
    peopleRescued: 640,
    unitsDeployed: "Indian Coast Guard, Marine Police & District Control 1077",
    recoveryNote: "Maritime fishing and Ro-Ro ferry services fully resumed."
  }
];

// 3. NATIONAL EMERGENCY HELPLINE NUMBERS (101, 108, 112, etc.)
export const NATIONAL_HELPLINES = [
  {
    number: "112",
    title: "National All-in-One Emergency",
    category: "Police • Fire • Ambulance",
    desc: "Single pan-India emergency response number connecting immediately to Police, Fire, and Medical dispatch.",
    color: "bg-red-600",
    badge: "24x7 TOLL-FREE"
  },
  {
    number: "101",
    title: "Fire Brigade & Rescue Services",
    category: "Fire • Gas Leak • Building Collapse",
    desc: "Direct line to Municipal Fire & Emergency Services for urban fires, LPG leaks, chemical hazards, and rescue.",
    color: "bg-orange-600",
    badge: "FIRE EMERGENCY"
  },
  {
    number: "108",
    title: "Emergency Ambulance & Medical (MEMS)",
    category: "Critical Care • Trauma • Flood Injury",
    desc: "Free Advanced Life Support (ALS) and Basic Life Support (BLS) emergency ambulance dispatch across all districts.",
    color: "bg-emerald-600",
    badge: "MEDICAL / ICU"
  },
  {
    number: "100",
    title: "Police Control Room",
    category: "Law & Order • Missing Persons • Traffic",
    desc: "Immediate police assistance, highway traffic clearance during disasters, and crowd safety management.",
    color: "bg-blue-600",
    badge: "POLICE HQ"
  },
  {
    number: "1070",
    title: "State Disaster Control Room (SEOC)",
    category: "State Emergency Operations Center",
    desc: "Mantralaya State Disaster Management Control Room for inter-district flood, cyclone, and NDRF requisition.",
    color: "bg-cyan-600",
    badge: "STATE SEOC"
  },
  {
    number: "1077",
    title: "District Collector Disaster Control (DEOC)",
    category: "District Magistrate / Collectorate",
    desc: "Direct toll-free connection to your local District Collector / District Magistrate (DM) emergency control room.",
    color: "bg-indigo-600",
    badge: "DISTRICT DM"
  },
  {
    number: "1916",
    title: "Municipal Civic & Flood Helpline",
    category: "Urban Flooding • Tree Fall • Water",
    desc: "Dedicated municipal disaster control helpline (BMC / Urban Corporations) for waterlogging and civic hazards.",
    color: "bg-teal-600",
    badge: "CIVIC CONTROL"
  },
  {
    number: "1912",
    title: "Electricity Emergency & Live Wire Hazard",
    category: "Power Outage • Fallen Electric Poles",
    desc: "24x7 Power Distribution (MSEDCL / BEST / Tata) emergency line to cut power to submerged transformers or live wires.",
    color: "bg-amber-600",
    badge: "POWER SAFETY"
  },
  {
    number: "1091",
    title: "Women Safety & Distress Helpline",
    category: "Women Protection & Safe Transit",
    desc: "Priority emergency protection and safe shelter escort for women in distress.",
    color: "bg-pink-600",
    badge: "WOMEN SAFETY"
  },
  {
    number: "1098",
    title: "Childline India Emergency",
    category: "Separated / Vulnerable Children",
    desc: "24-hour toll-free emergency phone outreach for children separated or in distress during disasters.",
    color: "bg-purple-600",
    badge: "CHILD CARE"
  },
  {
    number: "1554",
    title: "Indian Coast Guard Maritime Rescue",
    category: "Cyclone • Sea Surge • Fishermen SOS",
    desc: "Search and rescue coordination for fishermen and coastal vessels caught in Arabian Sea storms.",
    color: "bg-sky-600",
    badge: "MARITIME SAR"
  },
  {
    number: "011-24363260",
    title: "NDRF National Control Room",
    category: "National Disaster Response Force HQ",
    desc: "24x7 NDRF command desk for specialized Collapsed Structure Search & Rescue (CSSR) and flood battalions.",
    color: "bg-rose-700",
    badge: "NDRF COMMAND"
  }
];

// 4. CITY-WISE IMPORTANT NUMBERS (Police, DM/Collector, Fire, Municipal & Key Elected Representatives / Politicians)
export const CITY_EMERGENCY_DIRECTORY = [
  {
    city: "Mumbai (City & Suburban)",
    region: "Konkan Coastal Metropolis",
    dmOffice: {
      title: "District Collector & Magistrate (Mumbai City / Suburban)",
      officer: "Office of the District Collector, Old Custom House / Bandra East",
      phone: "022-22664232",
      altPhone: "022-26556799"
    },
    policeControl: {
      title: "Mumbai Police Commissionerate Control Room",
      office: "Crawford Market HQ & Bandra Control",
      phone: "022-22621855",
      altPhone: "100 / 112"
    },
    municipalDisaster: {
      title: "BMC Disaster Management Cell (24x7 War Room)",
      office: "BMC Headquarters, CSMT, Mumbai",
      phone: "022-22694725",
      altPhone: "1916"
    },
    fireMedical: {
      title: "Mumbai Fire Brigade & EMS Command",
      office: "Byculla Command Center",
      phone: "022-23085991",
      altPhone: "101 / 108"
    },
    publicRepresentatives: [
      {
        role: "Chief Minister's Relief & Public Grievance Cell (Mantralaya)",
        office: "Mantralaya 6th Floor, Madam Cama Road, Mumbai",
        phone: "022-22025151",
        coverage: "Statewide & Mumbai Metropolitan Emergency Relief"
      },
      {
        role: "Guardian Minister Office — Mumbai City & Suburban",
        office: "District Guardian Minister Public Emergency Desk, Mantralaya",
        phone: "022-22024832",
        coverage: "Constituency Flood & Civic Relief Coordination"
      },
      {
        role: "Mayor / Municipal Administrator Citizen Desk (BMC)",
        office: "BMC Central Public Grievance & Ward MLA Coordination Cell",
        phone: "022-22620251",
        coverage: "All 24 Municipal Wards (A to T Wards)"
      }
    ]
  },
  {
    city: "Pune (City & Pimpri-Chinchwad)",
    region: "Western Maharashtra / Sahyadri Foothills",
    dmOffice: {
      title: "District Magistrate & Collector Office, Pune",
      officer: "Collectorate Compound, Finance Road, Shivajinagar, Pune",
      phone: "020-26114949",
      altPhone: "020-26123371 (1077)"
    },
    policeControl: {
      title: "Pune City & Rural Police Commissionerate Control",
      office: "Sadhu Vaswani Road, Camp, Pune",
      phone: "020-26126296",
      altPhone: "020-26122880"
    },
    municipalDisaster: {
      title: "PMC & PCMC Disaster Management Cell",
      office: "Shivajinagar PMC Main Building, Pune",
      phone: "020-25501269",
      altPhone: "020-25506800"
    },
    fireMedical: {
      title: "Pune Central Fire Brigade & NDRF 5th Bn Base",
      office: "Mahatma Phule Peth / Sudumbare NDRF HQ",
      phone: "020-26451707",
      altPhone: "02114-247010 (NDRF)"
    },
    publicRepresentatives: [
      {
        role: "Guardian Minister Office — Pune District",
        office: "Council Hall / Divisional Commissionerate Public Desk, Pune",
        phone: "020-26122114",
        coverage: "Pune Urban, Maval, Mulshi & Dam Discharge Coordination"
      },
      {
        role: "Divisional Commissioner & MP/MLA Emergency Coordination Cell",
        office: "Vidhan Bhavan, Camp, Pune",
        phone: "020-26126612",
        coverage: "Constituency Relief Camps & Public Works"
      }
    ]
  },
  {
    city: "Nagpur",
    region: "Vidarbha Inland & High-Heat Zone",
    dmOffice: {
      title: "District Magistrate & Collector Office, Nagpur",
      officer: "Civil Lines, Ravindra Nath Tagore Marg, Nagpur",
      phone: "0712-2564973",
      altPhone: "0712-2562668 (1077)"
    },
    policeControl: {
      title: "Nagpur City Police Commissionerate Control",
      office: "Police Bhavan, Civil Lines, Nagpur",
      phone: "0712-2561222",
      altPhone: "0712-2560200"
    },
    municipalDisaster: {
      title: "Nagpur Municipal Corporation (NMC) Fire & Emergency",
      office: "Civil Lines NMC HQ, Nagpur",
      phone: "0712-2567029",
      altPhone: "0712-2567777"
    },
    fireMedical: {
      title: "NMC Fire Brigade & Heatstroke Trauma Control",
      office: "Cotton Market / Civil Lines Fire Station",
      phone: "0712-2540101",
      altPhone: "101 / 108"
    },
    publicRepresentatives: [
      {
        role: "Chief Minister / Deputy CM Secretariat (Hyderabad House, Nagpur)",
        office: "Civil Lines, Nagpur Public Grievance & Emergency Desk",
        phone: "0712-2565599",
        coverage: "Vidarbha Regional Flood, Heatwave & Industrial Relief"
      },
      {
        role: "Guardian Minister & Parliamentary Constituency Helpdesk — Nagpur",
        office: "Collectorate Public Representative Cell, Civil Lines",
        phone: "0712-2523034",
        coverage: "Nagpur Urban & Rural Constituencies"
      }
    ]
  },
  {
    city: "Thane, Navi Mumbai & Kalyan",
    region: "MMR Coastal & Creek Belt",
    dmOffice: {
      title: "District Collector & Magistrate Office, Thane",
      officer: "Collectorate Court Naka, Thane West",
      phone: "022-25344041",
      altPhone: "022-25345130 (1077)"
    },
    policeControl: {
      title: "Thane & Navi Mumbai Police Commissionerate",
      office: "Police Commissioner Office, Thane West / CBD Belapur",
      phone: "022-25443636",
      altPhone: "022-27572209"
    },
    municipalDisaster: {
      title: "TMC & NMMC Regional Disaster Management Cell (RDMC)",
      office: "Panchpakhadi TMC HQ / Belapur NMMC HQ",
      phone: "022-25371010",
      altPhone: "1800-222-108"
    },
    fireMedical: {
      title: "Thane Fire & Industrial Chemical Hazard Response",
      office: "Wagle Estate / Vashi Fire Command",
      phone: "022-25391600",
      altPhone: "101 / 108"
    },
    publicRepresentatives: [
      {
        role: "Guardian Minister & Elected Representatives Relief Cell — Thane",
        office: "District Planning & Public Representatives Desk, Thane",
        phone: "022-25344522",
        coverage: "Thane, Kalyan-Dombivli, Ulhasnagar, Bhiwandi & Navi Mumbai"
      }
    ]
  },
  {
    city: "Raigad (Alibag, Mahad & Panvel)",
    region: "Konkan Coast & Sahyadri Ghat Zone",
    dmOffice: {
      title: "District Magistrate & Collector Office, Raigad (Alibag)",
      officer: "District Collectorate, Alibag, Dist. Raigad",
      phone: "02141-222118",
      altPhone: "02141-222097 (1077)"
    },
    policeControl: {
      title: "Raigad District Superintendent of Police (SP) Control",
      office: "SP Office, Alibag & Mahad Highway Post",
      phone: "02141-222100",
      altPhone: "02145-222133 (Mahad)"
    },
    municipalDisaster: {
      title: "Raigad District Flood & Landslide Control Room",
      office: "Collectorate Disaster Wing, Alibag",
      phone: "02141-221155",
      altPhone: "8275152363 (WhatsApp SOS)"
    },
    fireMedical: {
      title: "Mahad & Alibag Civil Hospital & Fire Rescue",
      office: "District Civil Hospital Alibag / Mahad",
      phone: "02141-222026",
      altPhone: "108 / 101"
    },
    publicRepresentatives: [
      {
        role: "Guardian Minister & Local MLA Emergency Relief Office — Raigad",
        office: "District Collectorate Public Liaison Desk, Alibag / Mahad",
        phone: "02141-222310",
        coverage: "Alibag, Mahad, Poladpur, Shrivardhan & Panvel"
      }
    ]
  },
  {
    city: "Ratnagiri & Chiplun",
    region: "South Konkan Coastal & River Basin",
    dmOffice: {
      title: "District Magistrate & Collector Office, Ratnagiri",
      officer: "Collectorate Compound, Jaystambh, Ratnagiri",
      phone: "02352-222301",
      altPhone: "02352-222233 (1077)"
    },
    policeControl: {
      title: "Ratnagiri SP Control Room & Chiplun Sub-Division",
      office: "District Police HQ, Ratnagiri",
      phone: "02352-222222",
      altPhone: "02355-252333 (Chiplun)"
    },
    municipalDisaster: {
      title: "Chiplun Municipal Council Flood Control Cell",
      office: "Chiplun Nagar Parishad War Room",
      phone: "02355-252028",
      altPhone: "02352-226248"
    },
    fireMedical: {
      title: "Coast Guard & District Medical Emergency",
      office: "Ratnagiri Civil Hospital & Port Control",
      phone: "02352-222364",
      altPhone: "108 / 1554"
    },
    publicRepresentatives: [
      {
        role: "Guardian Minister & Constituency Relief Desk — Ratnagiri & Chiplun",
        office: "District Public Grievance & Relief Office, Ratnagiri",
        phone: "02352-222102",
        coverage: "Chiplun, Khed, Dapoli, Ratnagiri & Rajapur"
      }
    ]
  },
  {
    city: "Kolhapur & Sangli",
    region: "Panchganga & Krishna River Basin",
    dmOffice: {
      title: "District Magistrate & Collector Office, Kolhapur",
      officer: "New Palace Road, Nagala Park, Kolhapur",
      phone: "0231-2654811",
      altPhone: "0231-2659232 (1077)"
    },
    policeControl: {
      title: "Kolhapur District Police Control Room",
      office: "SP Office, Kasaba Bawada Road, Kolhapur",
      phone: "0231-2662333",
      altPhone: "100 / 112"
    },
    municipalDisaster: {
      title: "KMC Disaster Cell & Panchganga Flood Monitoring",
      office: "Bhausingji Road, Kolhapur Municipal Corporation",
      phone: "0231-2540291",
      altPhone: "0231-2541170"
    },
    fireMedical: {
      title: "Kolhapur Fire Brigade & CPR Hospital Trauma",
      office: "CPR Hospital & Central Fire Brigade",
      phone: "0231-2653991",
      altPhone: "101 / 108"
    },
    publicRepresentatives: [
      {
        role: "Guardian Minister & MP/MLA Flood Relief Coordination — Kolhapur",
        office: "Collectorate Public Representative Cell, Kolhapur",
        phone: "0231-2654812",
        coverage: "Karvir, Shirol, Hatkanangale, Panhala & Riverfront Wards"
      }
    ]
  },
  {
    city: "Nashik & Chhatrapati Sambhajinagar",
    region: "Godavari Basin & Marathwada Inland",
    dmOffice: {
      title: "District Collector & Magistrate Office, Nashik",
      officer: "Old Agra Road, Collectorate, Nashik",
      phone: "0253-2578500",
      altPhone: "0240-2331200 (Sambhajinagar DM)"
    },
    policeControl: {
      title: "Nashik & Sambhajinagar Police Control Rooms",
      office: "Police Commissionerate HQ",
      phone: "0253-2305233",
      altPhone: "0240-2240500"
    },
    municipalDisaster: {
      title: "NMC Godavari Flood & Heatwave Control Room",
      office: "Rajiv Gandhi Bhavan, Sharanpur Road, Nashik",
      phone: "0253-2571872",
      altPhone: "1077"
    },
    fireMedical: {
      title: "Shingada Talao Fire HQ & Civil Hospital",
      office: "Central Fire & Medical Command",
      phone: "0253-2571454",
      altPhone: "101 / 108"
    },
    publicRepresentatives: [
      {
        role: "Divisional & Guardian Minister Public Emergency Desk",
        office: "Divisional Commissionerate, Nashik Road / Delhi Gate",
        phone: "0253-2461909",
        coverage: "Godavari Riverfront, Trimbakeshwar, Niphad & Marathwada"
      }
    ]
  }
];

export const SHELTERS_DATA = [
  {
    id: "SHL-01",
    name: "Kurla Bhabha Municipal Relief Camp",
    district: "Mumbai Suburban",
    coordinates: [19.0657, 72.8833],
    capacity: 1200,
    currentOccupancy: 840,
    facilities: ["Clean Water", "Medical Station", "Cooked Meals", "Power Backup", "Wheelchair Access"],
    contactOfficer: "K. R. Jadhav (Disaster Management Cell)",
    phone: "+91 22 2650 0144",
    isAccessible: true,
    status: "OPEN"
  },
  {
    id: "SHL-02",
    name: "Bandra BKC Exhibition Ground Emergency Camp",
    district: "Mumbai Suburban",
    coordinates: [19.0607, 72.8644],
    capacity: 3500,
    currentOccupancy: 1450,
    facilities: ["Helipad", "Mobile ICU", "Clean Water", "Dormitories", "Braille & Audio Assistance"],
    contactOfficer: "Dr. Ananya Sen (Medical Superintendent)",
    phone: "+91 22 2659 0000",
    isAccessible: true,
    status: "OPEN"
  },
  {
    id: "SHL-03",
    name: "Mahad Municipal High School Shelter",
    district: "Raigad",
    coordinates: [18.0835, 73.4250],
    capacity: 800,
    currentOccupancy: 610,
    facilities: ["Ration Kits", "First Aid", "Sleeping Mats", "Satellite Phone"],
    contactOfficer: "Sanjay Deshmukh (Tahsildar)",
    phone: "+91 2145 222105",
    isAccessible: true,
    status: "OPEN"
  },
  {
    id: "SHL-04",
    name: "Chiplun United English School Relief Centre",
    district: "Ratnagiri",
    coordinates: [17.5350, 73.5220],
    capacity: 1500,
    currentOccupancy: 950,
    facilities: ["Boats Docking", "Dry Food", "Sanitation", "Generators"],
    contactOfficer: "Prashant Patil (Sub-Divisional Officer)",
    phone: "+91 2355 252028",
    isAccessible: true,
    status: "OPEN"
  },
  {
    id: "SHL-05",
    name: "Pune Shivajinagar Police Grounds Shelter",
    district: "Pune",
    coordinates: [18.5314, 73.8446],
    capacity: 2500,
    currentOccupancy: 320,
    facilities: ["SDRF Base", "Ambulance Hub", "Food Packaging", "Medical Ward"],
    contactOfficer: "Inspector V. V. More",
    phone: "+91 20 2553 6263",
    isAccessible: true,
    status: "OPEN"
  }
];

export const RESCUE_TEAMS = [
  {
    id: "NDRF-05-A",
    name: "NDRF 5th Battalion - Alpha Team",
    base: "Sudumbare, Pune / Forward Base Kurla",
    type: "Flood Rescue & Inundation",
    personnel: 45,
    equipment: ["6 Inflatable Motor Boats", "Lifejackets", "Deep Water Sonar", "Cutting Tools"],
    coordinates: [19.0680, 72.8710],
    status: "DEPLOYED"
  },
  {
    id: "NDRF-05-B",
    name: "NDRF 5th Battalion - Bravo Team",
    base: "Mahad Forward Operating Post",
    type: "Landslide & Collapsed Structure SAR (CSSR)",
    personnel: 38,
    equipment: ["Victim Locating Devices", "Canine Squad", "Hydraulic Spreaders"],
    coordinates: [18.0810, 73.4150],
    status: "DEPLOYED"
  },
  {
    id: "SDRF-MH-01",
    name: "State SDRF Coastal & River Unit",
    base: "Chiplun / Ratnagiri Forward Base",
    type: "Water Rescue & Evacuation",
    personnel: 30,
    equipment: ["4 Jet Rescue Craft", "Drones with Thermal Optics", "Medical Litters"],
    coordinates: [17.5300, 73.5200],
    status: "DEPLOYED"
  },
  {
    id: "BMC-DMC-01",
    name: "Municipal Fire & Quick Response Team (101)",
    base: "Municipal HQ, Fort, Mumbai",
    type: "Urban Fire, Dewatering & Triage",
    personnel: 60,
    equipment: ["High-Capacity De-watering Pumps", "Fire Tenders", "Tree Cutters"],
    coordinates: [18.9400, 72.8350],
    status: "ACTIVE"
  }
];

export const CITIZEN_SOS_REPORTS = [
  {
    id: "SOS-701",
    name: "Ramesh Pawar",
    phone: "+91 98201 XXXXX",
    locationName: "Kranti Nagar, Near Mithi River, Kurla West",
    district: "Mumbai",
    category: "Flood Inundation - Trapped on 1st Floor",
    urgency: "P1 - CRITICAL",
    victimsCount: 5,
    includesElderlyOrDisabled: true,
    description: "Ground floor submerged under 4.5 feet water. Electric supply cut off. Two senior citizens with us. Need rescue boat.",
    coordinates: [19.0735, 72.8810],
    timestamp: "14 mins ago",
    status: "DISPATCHED",
    assignedUnit: "NDRF 5th Battalion - Alpha Team"
  },
  {
    id: "SOS-702",
    name: "Sunita Gokhale",
    phone: "+91 97664 XXXXX",
    locationName: "Poladpur Market Link Road, Raigad",
    district: "Raigad",
    category: "Landslide Debris Blocked Exit",
    urgency: "P2 - HIGH",
    victimsCount: 3,
    includesElderlyOrDisabled: false,
    description: "Mud and boulders slid down behind the building. Road impassable for vehicles. Need clearance and escort.",
    coordinates: [17.9830, 73.4730],
    timestamp: "38 mins ago",
    status: "ACKNOWLEDGED",
    assignedUnit: "SDRF Mahad Quick Team"
  },
  {
    id: "SOS-703",
    name: "Vinayak Kadam",
    phone: "+91 94220 XXXXX",
    locationName: "Markandi Ward, Chiplun",
    district: "Ratnagiri",
    category: "Medical Emergency / Insulin Needed",
    urgency: "P1 - CRITICAL",
    victimsCount: 1,
    includesElderlyOrDisabled: true,
    description: "Diabetic patient marooned due to waist-deep water in street. Evacuated safely by 108 boat-ambulance.",
    coordinates: [17.5310, 73.5150],
    timestamp: "Relieved 1 hour ago",
    status: "RESOLVED",
    assignedUnit: "Chiplun Medical Ambulance 108"
  }
];

export const IOT_TELEMETRY = [
  {
    sensorId: "IOT-MUM-01",
    name: "Mithi River Gauge (Kranti Nagar)",
    parameter: "Water Level",
    value: "3.88 m",
    threshold: "3.50 m (Danger)",
    status: "CRITICAL",
    trend: "+0.15 m / hr"
  },
  {
    sensorId: "IOT-MUM-02",
    name: "Santacruz AWS Rain Gauge",
    parameter: "Precipitation Rate",
    value: "68.5 mm/hr",
    threshold: "50 mm/hr (Heavy)",
    status: "CRITICAL",
    trend: "+12 mm / hr"
  },
  {
    sensorId: "IOT-RGD-03",
    name: "Mahad Ghat Piezometer",
    parameter: "Soil Pore Pressure",
    value: "94.2 %",
    threshold: "85 % (Slide Risk)",
    status: "CRITICAL",
    trend: "+4.1 % / hr"
  },
  {
    sensorId: "IOT-RTN-04",
    name: "Vashishti Barrage Telemetry",
    parameter: "River Level",
    value: "4.18 m",
    threshold: "4.00 m (Danger)",
    status: "HIGH",
    trend: "+0.08 m / hr"
  },
  {
    sensorId: "IOT-NGP-05",
    name: "Nagpur MIDC Thermal & Air Sensor",
    parameter: "Surface Temp / Fire Index",
    value: "43.8 °C",
    threshold: "42.0 °C (Heatwave)",
    status: "HIGH",
    trend: "+1.2 °C / hr"
  },
  {
    sensorId: "IOT-PUN-06",
    name: "Khadakwasla Spillway Sensor",
    parameter: "Outflow Discharge",
    value: "11,400 cusecs",
    threshold: "25,000 cusecs",
    status: "NOMINAL",
    trend: "-2,100 cusecs/hr"
  },
  {
    sensorId: "IOT-KOL-07",
    name: "Panchganga Rajaram Weir",
    parameter: "River Gauge",
    value: "36.4 ft",
    threshold: "43.0 ft (Danger)",
    status: "NOMINAL",
    trend: "-0.4 ft / hr (Relieved)"
  }
];

export const MAHARASHTRA_DISTRICTS = [
  { name: "Mumbai", floodRisk: 92, landslideRisk: 35, cycloneRisk: 85, fireRisk: 68, heatwaveRisk: 48, status: "CRITICAL" },
  { name: "Raigad", floodRisk: 86, landslideRisk: 94, cycloneRisk: 88, fireRisk: 42, heatwaveRisk: 45, status: "CRITICAL" },
  { name: "Ratnagiri", floodRisk: 84, landslideRisk: 82, cycloneRisk: 90, fireRisk: 38, heatwaveRisk: 44, status: "HIGH" },
  { name: "Nagpur", floodRisk: 38, landslideRisk: 15, cycloneRisk: 20, fireRisk: 86, heatwaveRisk: 95, status: "HIGH" },
  { name: "Pune", floodRisk: 64, landslideRisk: 72, cycloneRisk: 35, fireRisk: 62, heatwaveRisk: 58, status: "MODERATE" },
  { name: "Thane", floodRisk: 78, landslideRisk: 48, cycloneRisk: 72, fireRisk: 75, heatwaveRisk: 54, status: "HIGH" },
  { name: "Kolhapur", floodRisk: 52, landslideRisk: 58, cycloneRisk: 30, fireRisk: 35, heatwaveRisk: 46, status: "RELIEVED" },
  { name: "Satara", floodRisk: 48, landslideRisk: 76, cycloneRisk: 32, fireRisk: 40, heatwaveRisk: 50, status: "MODERATE" }
];
