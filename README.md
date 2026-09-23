# AapdaNet AI — Integrated Multi-Hazard Disaster Decision Support System

An advanced, inclusive, AI-powered disaster management platform combining multi-hazard forecasting, satellite damage assessment with computer vision, operational resource optimization, and emergency citizen assistance.

---

## 🌟 Key Features & Innovations

1. **Inclusive & Differently-Abled Accessibility**:
   - **Voice SOS Incident Reporting**: Dictate emergency distress calls via microphone using Web Speech recognition.
   - **Text-to-Speech (TTS) Emergency Audio Broadcaster**: Automated voice readouts of live alert warnings, evacuation steps, and nearest shelter directions.
   - **Accessible Alternative Text View**: Direct tabular and structured text directory replacing complex GIS maps for screen readers (`aria-live="assertive"` compliant).
   - **Global Font Scaling**: Dynamic rem scaling (Standard 100%, Large 115%, Extra Large 130%) that resizes every single typography element across the DOM.
   - **High-Contrast (HC) Mode**: High-visibility yellow-on-black interface for low-vision and visually impaired users.
   - **Acoustic Emergency Siren Beacon**: Modulated frequency siren generated directly via the Web Audio API for low-visibility orientation.
   - **Keyboard Shortcuts**: `Alt + S` (Instant SOS Dialog), `Alt + A` (Read Status Aloud), `Alt + C` (Toggle Contrast).

2. **Multilingual Architecture (All 22 Official Indian Languages)**:
   - Full-sentence complete translations covering Marathi, Hindi, English, Gujarati, Konkani, Sindhi (سنڌي / सिंधी), Urdu, Bengali, Tamil, Telugu, and all Eighth Schedule languages.
   - Every single component, form label, button, and description translates dynamically without truncated text or ellipsis.

3. **Multi-Hazard AI Models**:
   - **Model 1: Predictive Simulation Engine (LSTM / XGBoost)**: Interactive What-If simulator evaluating rainfall rate, river gauge level, wind speed, terrain slope angle, soil saturation, and tremor magnitude.
   - **Model 2: Optical Satellite Damage Assessment (CNN)**: Dual-temporal pre- vs. post-disaster satellite imagery inspector with bounding-box structural damage detection and sector impairment scoring.
   - **Model 3: Emergency Resource Optimization Matrix (MILP Solver)**: Linear Programming solver allocating rescue boats, ambulances, emergency teams, and food supplies to maximize lives saved.

4. **Live Weather, Rainfall Warnings & Cyclone Tracking**:
   - Real-time meteorological telemetry powered by the free Open-Meteo public API (temperature, precipitation, wind speed, humidity, and pressure).
   - Official IMD Heavy Rainfall color alerts (Red Alert, Orange Alert, Yellow Alert).
   - Active Arabian Sea Cyclonic Storm tracking radar with eye coordinates, storm surge estimates, and maritime advisories.

5. **Disaster Safety & Preparedness Guides**:
   - In-depth, actionable survival protocols for **Floods**, **Cyclones**, **Earthquakes**, **Landslides**, and **Extreme Heatwaves**.
   - Universal 72-Hour Emergency Go-Bag checklist.

6. **100% Free Zero-Key Map Architecture**:
   - Uses OpenStreetMap Global, Esri High-Resolution Satellite Aerials, and Esri Topographic elevation layers.
   - Absolutely no paid API keys or tokens required to function.

---

## 🚀 How to Deploy to Vercel (Live Website)

The platform is pre-configured with root and frontend `vercel.json` configurations for instant zero-configuration deployment.

### Deploy via GitHub & Vercel Dashboard (1-Click)
1. Go to [vercel.com/new](https://vercel.com/new) and log in.
2. Select your repository: **`FernJoshua/aapdanet-ai-disaster-management-platform`**.
3. **Root Directory**:
   - Both `./` (default) and `frontend` are fully supported out-of-the-box!
   - If deploying from root (`./`), the root `vercel.json` automatically triggers `cd frontend && npm install && npm run build` and outputs to `frontend/dist`.
   - Alternatively, you can click **Edit** next to **Root Directory** and select `frontend`.
4. Click **Deploy**!
5. Within ~30 seconds, your site will be live at `https://aapdanet-ai-disaster-management-platform.vercel.app` (or your assigned Vercel URL).

### Deploy via Vercel CLI (Alternative)
```bash
# 1. Open your terminal in the frontend directory
cd frontend

# 2. Run the Vercel deploy command
npx vercel --prod
```

---

## 💻 Local Development

### Run the Frontend Locally:
```bash
cd disaster-management-platform/frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run the Python FastAPI Backend (Optional):
```bash
cd disaster-management-platform/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).
