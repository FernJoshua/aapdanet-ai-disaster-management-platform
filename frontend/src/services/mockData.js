// Comprehensive Maharashtra Regional Disaster Data & System Intelligence

export const MAHARASHTRA_CENTER = [18.9878, 73.8567]; // Maharashtra focus point
export const MUMBAI_COORDS = [19.0760, 72.8777];

export const INITIAL_ALERTS = [
  {
    id: "ALT-MH-01",
    district: "Mumbai Suburban",
    location: "Mithi River Basin (Kurla - BKC Belt)",
    type: "Flash Flood",
    severity: "CRITICAL",
    color: "#ef4444",
    title: "Mithi River Danger Water Level Warning",
    description: "Water level crossed 3.85m (Warning mark 3.5m) coupled with 4.2m Arabian Sea High Tide at 16:30 hrs. Inundation alert issued for Kurla West, Kranti Nagar and Bail Bazar.",
    timestamp: "12 mins ago",
    affectedCount: "14,200 citizens",
    evacuationStatus: "Mandatory Evacuation Ongoing",
    coordinates: [19.0728, 72.8795],
    audioText: "Critical Alert: Flash Flood warning at Mithi River Basin, Kurla and BKC. High tide approaching. Evacuate low-lying areas immediately."
  },
  {
    id: "ALT-MH-02",
    district: "Raigad",
    location: "Mahad - Poladpur Ghat Corridor",
    type: "Landslide",
    severity: "HIGH",
    color: "#f59e0b",
    title: "Ghat Section Slope Failure & Landslide Alert",
    description: "Continuous 190mm rainfall in last 18 hours triggered soil destabilization on NH-66 and Mahad link roads. SDRF deployed with heavy earthmovers.",
    timestamp: "35 mins ago",
    affectedCount: "3,800 commuters & residents",
    evacuationStatus: "Advisory Issued",
    coordinates: [18.0827, 73.4188],
    audioText: "High Alert: Landslide risk in Mahad and Poladpur Ghat section due to heavy rain. Avoid National Highway 66."
  },
  {
    id: "ALT-MH-03",
    district: "Ratnagiri",
    location: "Chiplun (Vashishti River Basin)",
    type: "Riverine Flood",
    severity: "HIGH",
    color: "#f59e0b",
    title: "Vashishti River Discharge & Overflow",
    description: "Koyna reservoir spillway discharge increased to 45,000 cusecs. Market yard and low-elevation wards in Chiplun experiencing reverse water ingress.",
    timestamp: "1 hour ago",
    affectedCount: "8,500 citizens",
    evacuationStatus: "Relief Camps Active",
    coordinates: [17.5323, 73.5186],
    audioText: "Warning: Vashishti River in Chiplun rising due to dam discharge. Move to designated municipal shelters."
  },
  {
    id: "ALT-MH-04",
    district: "Satara",
    location: "Koyna Dam Epicenter Zone",
    type: "Earthquake",
    severity: "MODERATE",
    color: "#3b82f6",
    title: "Minor Seismic Tremor Detected",
    description: "Seismograph recorded Magnitude 3.8 at 10km depth. No structural breach reported at Koyna Dam hydroelectric complex. Inspection teams on standby.",
    timestamp: "2 hours ago",
    affectedCount: "1,200 residents notified",
    evacuationStatus: "Monitoring Mode",
    coordinates: [17.3970, 73.7490],
    audioText: "Advisory: Minor seismic tremor of magnitude 3.8 recorded near Koyna. Hydroelectric structures safe."
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
    isAccessible: false,
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
    name: "Maharashtra SDRF Kolhapur Unit",
    base: "Panchganga Barrage Station",
    type: "Water Rescue & Evacuation",
    personnel: 30,
    equipment: ["4 Jet Rescue Craft", "Drones with Thermal Optics", "Medical Litters"],
    coordinates: [16.7050, 74.2433],
    status: "STANDBY"
  },
  {
    id: "BMC-DMC-01",
    name: "BMC Disaster Quick Response Team",
    base: "Municipal HQ, Fort, Mumbai",
    type: "Urban Dewatering & Triage",
    personnel: 60,
    equipment: ["High-Capacity De-watering Pumps", "Rescue Vans", "Tree Cutters"],
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
    description: "Ground floor completely submerged under 5 feet water. Electric supply cut off. Two senior citizens with us. Need rescue boat.",
    coordinates: [19.0735, 72.8810],
    timestamp: "18 mins ago",
    status: "DISPATCHED",
    assignedUnit: "NDRF 5th Battalion - Alpha Team"
  },
  {
    id: "SOS-702",
    name: "Sunita Gokhale",
    phone: "+91 97664 XXXXX",
    locationName: "Poladpur Market, Raigad",
    district: "Raigad",
    category: "Landslide Debris Blocked Exit",
    urgency: "P2 - HIGH",
    victimsCount: 3,
    includesElderlyOrDisabled: false,
    description: "Mud and boulders slid down behind the shop. Road impassable for vehicles. Safe for now but fear further sliding.",
    coordinates: [17.9830, 73.4730],
    timestamp: "42 mins ago",
    status: "ACKNOWLEDGED",
    assignedUnit: "SDRF Mahad Quick Team"
  },
  {
    id: "SOS-703",
    name: "Vinayak Kadam",
    phone: "+91 94220 XXXXX",
    locationName: "Markandi, Chiplun",
    district: "Ratnagiri",
    category: "Medical Emergency / Insulin Needed",
    urgency: "P1 - CRITICAL",
    victimsCount: 1,
    includesElderlyOrDisabled: true,
    description: "Diabetic patient marooned due to waist-deep water in street. Needs refrigerated medication and evacuation to hospital.",
    coordinates: [17.5310, 73.5150],
    timestamp: "1 hour ago",
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
    sensorId: "IOT-RGD-01",
    name: "Mahad Hill Inclinometer",
    parameter: "Slope Displacement",
    value: "14.2 mm",
    threshold: "10.0 mm (Alert)",
    status: "HIGH",
    trend: "Accelerating"
  },
  {
    sensorId: "IOT-SAT-01",
    name: "Koyna Seismological Observatory",
    parameter: "Peak Ground Accel (PGA)",
    value: "0.045 g",
    threshold: "0.10 g (Severe)",
    status: "NORMAL",
    trend: "Stable"
  }
];

// Literature Review Papers from Slides 3, 4, 5, 16
export const RESEARCH_PAPERS = [
  {
    id: 1,
    title: "A systematic review of artificial intelligence frameworks for holistic disaster management",
    focus: "AI across preparedness, response & recovery",
    methods: "Review and analysis of 96 AI studies",
    relevance: "Supports the need for an integrated end-to-end AI platform combining prediction and response."
  },
  {
    id: 2,
    title: "Trustworthy AI Applications in Natural Disasters",
    focus: "Review of 108 studies on AI/ML, XAI and data fusion",
    methods: "Categorization of trustworthy AI techniques",
    relevance: "Guides our explainable AI risk scoring and transparent confidence metrics."
  },
  {
    id: 3,
    title: "Disaster Management Technology & Approaches: Heterogeneous Systems",
    focus: "Integration of AI with IoT, remote sensing and multi-agent systems",
    methods: "Multi-technology interoperability analysis",
    relevance: "Validates our multi-source data integration architecture (IoT + GIS + Satellite)."
  },
  {
    id: 4,
    title: "Real-time Probabilistic Inundation Forecasts using LSTM",
    focus: "LSTM-based hydrologic runoff modeling",
    methods: "Long Short-Term Memory neural network on time-series rainfall data",
    relevance: "Directly informs our flood prediction engine and inundation risk calculator."
  },
  {
    id: 5,
    title: "AI for Flood Risk Management: State-of-the-art Review & Future Directions",
    focus: "Scalable flood risk solutions and ML architectures",
    methods: "Comparative evaluation of hydrologic ML algorithms",
    relevance: "Assists in selecting ensemble ML models (XGBoost, Random Forest)."
  },
  {
    id: 6,
    title: "Earthquake Transformer — Attentive Deep Learning for Phase Picking",
    focus: "Attention-based DL model for seismic event detection",
    methods: "Self-attention neural networks on waveform data",
    relevance: "Useful for real-time tremor characterization and epicenter severity calculation."
  },
  {
    id: 7,
    title: "Automated Building Damage Assessment Using Satellite Imagery & Deep Learning",
    focus: "Large-scale post-disaster structural damage mapping",
    methods: "Pre/post optical satellite imagery with Convolutional Neural Networks (CNN)",
    relevance: "Powers our Satellite Damage Inspection module with bounding box damage segmentation."
  },
  {
    id: 8,
    title: "Multi-Modal Attention for Automated Disaster Damage Assessment",
    focus: "Combining satellite imagery, GIS vectors, and remote sensing",
    methods: "Cross-modal attention fusion",
    relevance: "Improves precision by cross-referencing building footprints with inundation maps."
  },
  {
    id: 9,
    title: "Resource Allocation Optimization for Disaster Medical Systems based on BCMP Networks",
    focus: "Emergency dispatch optimization during surges",
    methods: "Linear Programming (LP) and open queueing network optimization",
    relevance: "Underpins our Resource Optimization Matrix for NDRF/ambulance allocation."
  },
  {
    id: 10,
    title: "Landslide Susceptibility Mapping Using Tree-based ML Classifiers",
    focus: "Western Ghats terrain and rainfall threshold models",
    methods: "Random Forest & Gradient Boosting on DEM and geomorphology",
    relevance: "Directly applied to our Mahad and Konkan landslide risk index."
  }
];

// District Risk Profiles for Maharashtra (36 districts)
export const MAHARASHTRA_DISTRICTS = [
  { name: "Mumbai Suburban", floodRisk: 92, landslideRisk: 30, cycloneRisk: 85, seismicRisk: 42, overall: "CRITICAL" },
  { name: "Mumbai City", floodRisk: 88, landslideRisk: 15, cycloneRisk: 85, seismicRisk: 40, overall: "HIGH" },
  { name: "Raigad", floodRisk: 82, landslideRisk: 95, cycloneRisk: 80, seismicRisk: 55, overall: "CRITICAL" },
  { name: "Ratnagiri", floodRisk: 85, landslideRisk: 88, cycloneRisk: 84, seismicRisk: 60, overall: "CRITICAL" },
  { name: "Sindhudurg", floodRisk: 70, landslideRisk: 75, cycloneRisk: 78, seismicRisk: 50, overall: "HIGH" },
  { name: "Pune", floodRisk: 65, landslideRisk: 60, cycloneRisk: 25, seismicRisk: 48, overall: "MODERATE" },
  { name: "Kolhapur", floodRisk: 89, landslideRisk: 55, cycloneRisk: 15, seismicRisk: 62, overall: "HIGH" },
  { name: "Satara", floodRisk: 60, landslideRisk: 72, cycloneRisk: 10, seismicRisk: 75, overall: "HIGH" },
  { name: "Thane", floodRisk: 78, landslideRisk: 45, cycloneRisk: 70, seismicRisk: 42, overall: "HIGH" },
  { name: "Palghar", floodRisk: 72, landslideRisk: 50, cycloneRisk: 75, seismicRisk: 68, overall: "HIGH" },
  { name: "Nashik", floodRisk: 58, landslideRisk: 42, cycloneRisk: 10, seismicRisk: 40, overall: "MODERATE" },
  { name: "Nagpur", floodRisk: 45, landslideRisk: 10, cycloneRisk: 5, seismicRisk: 25, overall: "LOW" },
  { name: "Amravati", floodRisk: 40, landslideRisk: 12, cycloneRisk: 5, seismicRisk: 22, overall: "LOW" },
  { name: "Aurangabad (Chh. Sambhajinagar)", floodRisk: 38, landslideRisk: 15, cycloneRisk: 5, seismicRisk: 35, overall: "LOW" }
];
