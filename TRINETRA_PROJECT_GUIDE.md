# Trinetra AI — Simple Project Guide

This guide explains Trinetra AI from start to finish. It uses plain English so anyone can read and present it.

---

## 1. What is Trinetra AI?

Trinetra AI is a crisis rescue tool. It protects lives in storms, floods, and heatwaves. In Sanskrit, Trinetra means the third eye. It stands for foresight, vision, and safety.

Normal weather sites show plain numbers like rain or heat. They do not tell you where to run. They do not tell officers how many boats to send.

Trinetra AI fixes this gap:
1. It reads live rain and river water.
2. It scores flood, slide, and fire risks.
3. It guides people to the nearest safe camp.
4. It helps rescue chiefs send boats, vans, and fire trucks to the spots of greatest harm.

---

## 2. Live Data, AI Data, and Demo Data (For Your Pitch)

Use this table to answer questions about data sources during your demo.

| Part | Data Type | Source | Cost | What It Does |
| :--- | :--- | :--- | :--- | :--- |
| **Live Weather** | Real Time | Open-Meteo API | Free | Reads live rain, heat, wind speed, air pressure, and air wetness every hour. Needs no paid key. |
| **River Water Levels** | Real Time | GloFAS and CWC | Free | Reads water flow in cubic meters per second for six river basins: Godavari, Krishna, Mithi, Savitri, Tapi, and Vashishti. |
| **Road Escape Paths** | Real Time | OSRM Engine | Free | Finds open road paths. Tells you trip length in kilometers and drive time in minutes between GPS points. |
| **Live Rain Cloud Radar** | Real Time | RainViewer API | Free | Puts live rain cloud radar maps right on the screen. |
| **Earth Tremor Points** | Real Time | USGS and EMSC Feeds | Free | Reads real earth quake spots, depth, and size. |
| **Roof Damage Vision AI** | Pre-Trained AI Data | xBD Satellite Dataset | Free Research | Uses a vision model trained on satellite photos to spot broken roofs after a storm. |
| **River Flood Predictor** | Pre-Trained AI Data | Old Flood Rain Records | Free Science Data | Uses a memory model (LSTM) trained on monsoon rains to predict river rise. |
| **Safe Relief Camps** | Demo Sample Data | City Camp Directory | Built-In Sample | Lists six safe relief camps with live bed counts, food crates, and wheel chair ramps. |
| **Active Crisis Alerts** | Demo Sample Data | State Crisis Mock Alerts | Built-In Sample | Four active alerts (Mumbai flood, Raigad slide, Ratnagiri storm, Nagpur heat) and four closed cases. |
| **Phone Help Lines** | Real Public Directory | State Help Desk Records | Real Public Numbers | Real phone numbers for 112, 101, 108, Police, District Heads, and ward staff. |

---

## 3. How the System Works

Trinetra AI has two main parts: the web front and the app server.

### Web Front
- **Tool**: React with Vite.
- **Look**: Tailwind CSS with light mode and dark mode.
- **Maps**: Leaflet with OpenStreetMap, satellite photos, and hill terrain.
- **Charts**: Recharts for speed and case graphs.
- **Sync**: Browser event bus and local cache for live sync across browser tabs.
- **Cloud Sync**: Optional free Supabase link to share data across phones and laptops.

### App Server
- **Tool**: FastAPI in Python.
- **AI Models**:
  - Hazard Model: Scores flood, slide, and fire threat from weather inputs.
  - Damage Model: Grades roof harm in four clear steps.
  - Resource Model: Solves a math plan to send rescue vans to high risk zones.

---

## 4. Tour of All Web Pages and Parts

### 1. Top Bar and State Alert Strip
- Shows top alerts across the state in bold red.
- Gives fast call buttons for 112, 101, and 108.
- Switches language across six Indian tongues.
- Toggles dark and light mode.
- Changes text size between Small, Normal, and Large.
- Plays live voice speech briefs.

### 2. Command Center (Main Screen)
- **Live Leaflet Map**: Shows risk pins, open camps, and rescue vans.
- **Escape Card**: Finds your nearest open camp and marks the path.
- **Crisis Cards**: Lists active events with river levels and wind speeds.
- **Risk Box**: Shows flood and slide threat percentages.
- **River Basin Gauges**: Displays live water flow in six rivers.
- **Closed Archive**: Stores past solved cases.

### 3. Full Map View
- Full screen map for field work.
- Lets you switch between street maps, satellite photos, and hill terrain.
- Color rings mark danger zones near rivers and steep hills.
- Pins show open camps and field teams.

### 4. AI Hazard Risk Predictor
- Lets officers test What-If ideas with drag bars.
- Change rain rate, river height, wind speed, ground slope, and tremor size.
- Shows three live risk scores:
  - Flash Flood Risk
  - Landslide Risk
  - Fire and Heat Risk
- Gives clear action steps for field teams.

### 5. Satellite Damage Vision AI
- Uses computer vision on top-down aerial photos.
- Compares pre-storm and post-storm photos of roofs.
- Grades harm into four simple bins:
  1. No Harm (Green)
  2. Minor Harm (Yellow)
  3. Major Harm (Orange)
  4. Collapsed (Red)
- Gives GPS spots for search crews.

### 6. Rescue Resource Dispatch Solver
- Solves a resource math plan.
- Checks available boats, vans, and fire trucks.
- Assigns teams to areas where people face the greatest risk.
- Cuts travel delay and stops waste of supplies.

### 7. Citizen SOS and Safe Camp Finder
- Simple screen for people in danger.
- **One-Tap SOS**: Sends your GPS spot and medical needs.
- **Voice SOS**: Speak into the mic to file an alert without typing.
- **Nearest Camp Card**: Measures distance to safe shelters and maps the way.

### 8. Live Weather, Radar, and Storm Tracker
- Reads live weather from Open-Meteo for your city.
- Shows temperature, rain, wind, air pressure, and air moisture.
- Shows live rain cloud radar from RainViewer.
- Maps sea cyclones with eye spots and storm wind belts.

### 9. Disaster Safety Handbooks
- Plain step guides for five big hazards:
  1. Floods and river spills
  2. Coastal storms and gales
  3. Earthquakes and falling walls
  4. Landslides and hill mud
  5. Heatwaves and fire
- Breaks advice into three time steps:
  - Step 1: Before the event (Prep)
  - Step 2: During the strike (Survive)
  - Step 3: After the pass (Safe return)
- Gives a checklist for a 72-hour food and tool pack.

### 10. Phone Directory
- Fast phone links for Fire (101), Ambulance (108), and Police (100 / 112).
- Real phone numbers for District Heads, City Chiefs, and ward leaders.
- Tap any number on a phone to call.

### 11. Tactical Charts and Trends
- Bar and line charts show rescue pace and open bed counts.
- Helps chiefs judge rescue speed.

### 12. Citizen and Volunteer Sign-Up
- Citizens, doctors, and youth sign up with their city ward.
- Sends advance warnings 3 to 6 hours before rivers spill into homes.

### 13. Cloud Sync Box
- Pop-up box where teams can paste a free Supabase web link and key.
- Connects field phones and central screens without code changes.

---

## 5. Ease of Access for All People

Trinetra AI helps all citizens:
1. **Voice SOS**: People with vision loss speak distress calls into the mic.
2. **Speech Broadcaster**: Reads warnings, escape paths, and numbers out loud.
3. **High-Contrast Theme**: Clean yellow on black helps low-vision users.
4. **Font Sizing**: Pick Small, Normal, or Large text in one tap.
5. **Sound Siren**: Plays a loud sound tone to help rescue teams find people.
6. **Plain Text View**: Screen readers can use a simple text list instead of maps.
7. **Keys**:
   - Alt + S: Open SOS box
   - Alt + A: Play voice brief
   - Alt + C: Toggle high contrast

---

## 6. How to Give Your 3-Minute Demo

Follow this simple script in your presentation.

### Minute 1: The Problem and Our Solution (First 60 Seconds)
- "Judges, normal weather sites show plain rain numbers, but they leave citizens in the dark when rivers rise. They do not tell you where to run. They do not tell officers how many boats to send."
- "We built Trinetra AI — a full disaster command and rescue tool."
- "Trinetra combines live weather and river water flow with AI models to predict threats and guide citizens to safe camps."

### Minute 2: The Live Walk (Next 60 Seconds)
1. **Show the Map**:
   - Point to the live map: "Here you see active alerts in Mumbai and Raigad."
   - Click the shelter pin to show the green escape path.
2. **Show the AI Predictor**:
   - Click the **AI Risk** tab.
   - Drag the rain bar to 180.
   - Point to the flood gauge: "Notice how the risk score jumps and gives action rules."
3. **Show Voice SOS**:
   - Open the **Citizen SOS** tab.
   - Click the mic: "Trapped on rooftop due to flood water."
   - Show how the tool grabs GPS points and finds the nearest open camp with free beds.

### Minute 3: Provenance and Value (Final 60 Seconds)
- "Judges often ask: Is this data real?"
- "Yes. Our weather data streams live from the free Open-Meteo API. Our rain radar streams live from RainViewer. Our road paths calculate live with the OSRM engine."
- "Our roof damage vision model runs on the global xBD benchmark dataset."
- "The platform needs zero paid keys, runs in six Indian languages, and helps people with disabilities through voice and high contrast."
- "Thank you. We look forward to your questions."

---

## 7. Answers to Common Judge Questions

### Q1: Is the weather data real or mock?
**Answer**:
The weather data is real. The app makes live web calls to the free Open-Meteo API for heat, rain, wind, and air pressure. The radar layer pulls live rain cloud tiles from RainViewer. The escape routes calculate live road paths with the OSRM engine.

### Q2: What AI models do you use?
**Answer**:
We use three models:
1. **Flood and Slide Risk Model**: Uses river levels, rain rates, and ground slope to predict flood and slide danger.
2. **Roof Damage Vision Model**: Uses satellite photos from the xBD benchmark dataset to detect broken roofs.
3. **Resource Solver Model**: Uses a math rule to assign rescue boats and vans to zones of greatest need.

### Q3: Does this need paid Google Maps keys?
**Answer**:
No. Trinetra AI uses a free, zero-key map stack. It runs on Leaflet, OpenStreetMap, and public satellite maps. Road paths run on the free OSRM engine. You can clone and run it with zero cost.

### Q4: How does it help people who cannot see?
**Answer**:
The app has full voice readouts. Press Alt + A to hear the live status in your language. People with vision loss can file an SOS with their voice. High contrast and large text help low-vision users.

### Q5: Can this connect across multiple rescue posts?
**Answer**:
Yes. The app shares state across open browser windows right away. For multi-device use, teams can paste a free Supabase cloud link in the settings box to link phones and laptops.
