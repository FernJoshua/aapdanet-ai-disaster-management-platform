import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Users, 
  Clock, 
  TrendingUp, 
  Radio, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { IOT_TELEMETRY, MAHARASHTRA_DISTRICTS } from '../services/mockData';
import { getTranslation } from '../utils/translations';

// 24-Hour Rainfall & River Level telemetry trend data (Mumbai & Konkan)
const timeSeriesData = [
  { time: '00:00', rainfall: 22, mithiLevel: 1.8, vashishtiLevel: 1.5 },
  { time: '04:00', rainfall: 35, mithiLevel: 2.1, vashishtiLevel: 1.9 },
  { time: '08:00', rainfall: 68, mithiLevel: 2.9, vashishtiLevel: 2.6 },
  { time: '12:00', rainfall: 110, mithiLevel: 3.6, vashishtiLevel: 3.8 },
  { time: '14:00', rainfall: 125, mithiLevel: 3.88, vashishtiLevel: 4.2 },
  { time: '16:00', rainfall: 95, mithiLevel: 3.82, vashishtiLevel: 4.0 },
  { time: '18:00 (Now)', rainfall: 78, mithiLevel: 3.75, vashishtiLevel: 3.9 }
];

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

export default function AnalyticsDashboard({ lang, onSpeakText }) {
  const t = (key) => getTranslation(lang, key);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">
              <Activity className="w-5 h-5" />
              <span>Objective 3: Integrated Analytics & Telemetry Command</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Real-Time Maharashtra Disaster Telemetry & Model Analytics
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Consolidated situational telemetry fusing hydrological IoT stream data, automated AI inference performance metrics, and district-level risk distribution across 36 Maharashtra administrative districts.
            </p>
          </div>

          <button
            onClick={() => onSpeakText("Analytics Summary: Active critical alerts: 4 districts. Highest rainfall recorded at Santacruz AWS with 68.5 millimeters per hour. Mithi river gauge level is 3.88 meters, exceeding danger threshold. Total sheltered citizens: 28,450. AI inference latency: 14 milliseconds.")}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors"
          >
            Audio Readout of Analytics
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Citizens Sheltered</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-black text-white mt-1">28,450</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Across 42 designated relief camps</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Critical Alert Districts</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-mono font-black text-red-400 mt-1">4 Sectors</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Mumbai, Raigad, Ratnagiri, Satara</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Rescue Units Mobilized</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-black text-cyan-400 mt-1">174 Personnel</div>
          <div className="text-[11px] text-slate-400 mt-0.5">NDRF 5th Bn & Maharashtra SDRF</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>AI Decision Latency</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-black text-amber-400 mt-1">14.2 ms</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Sub-second emergency triage</div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rainfall & Water Gauge Hydrograph (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-sm">Hydrological Time-Series Inundation Runoff</h3>
              <p className="text-[11px] text-slate-400">Rainfall rate (mm/hr) vs. Mithi and Vashishti River levels (meters)</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Live IoT Ingest
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMithi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Area type="monotone" dataKey="rainfall" name="Rainfall (mm/hr)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRain)" />
                <Area type="monotone" dataKey="mithiLevel" name="Mithi River Level (m)" stroke="#ef4444" fillOpacity={1} fill="url(#colorMithi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Risk Comparison Bar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-sm">District Vulnerability Index</h3>
              <p className="text-[11px] text-slate-400">Comparative hazard risk scores across priority districts</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MAHARASHTRA_DISTRICTS.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Bar dataKey="floodRisk" name="Flood %" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="landslideRisk" name="Landslide %" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live IoT Sensor Telemetry Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            Live Environmental & Hydrological IoT Sensor Feeds
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Stream: MQTT / WebSockets Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Sensor Station ID</th>
                <th className="py-3 px-4">Location & Facility</th>
                <th className="py-3 px-4">Parameter Monitored</th>
                <th className="py-3 px-4">Live Reading</th>
                <th className="py-3 px-4">Critical Threshold</th>
                <th className="py-3 px-4">Rate Trend</th>
                <th className="py-3 px-4">Alert Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {IOT_TELEMETRY.map((sensor) => (
                <tr key={sensor.sensorId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">{sensor.sensorId}</td>
                  <td className="py-3 px-4 font-semibold text-white">{sensor.name}</td>
                  <td className="py-3 px-4 text-slate-400">{sensor.parameter}</td>
                  <td className="py-3 px-4 font-mono font-bold text-white">{sensor.value}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{sensor.threshold}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">{sensor.trend}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                      sensor.status === 'CRITICAL' ? 'bg-red-950 text-red-400 animate-pulse border border-red-800' :
                      sensor.status === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {sensor.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
