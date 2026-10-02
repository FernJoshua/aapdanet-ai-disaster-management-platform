import React from 'react';
import {
  LayoutGrid,
  Activity,
  BrainCircuit,
  Map as MapIcon,
  Bell,
  ShieldAlert,
  Truck,
  Package,
  BarChart3,
  Settings,
  PhoneCall,
  CloudRain,
  BookOpen,
  Building2,
  Database,
  X
} from 'lucide-react';
import { getTranslation } from '../utils/translations';

export default function Sidebar({
  activeTab = 'home',
  setActiveTab = () => {},
  lang = 'en',
  isOpen = false,
  onClose = () => {},
  onOpenCloudConfig = () => {},
  alertCount = 4,
  sosCount = 3
}) {
  const t = (key) => getTranslation(lang, key);

  // Nav items organized into clear, structured sections matching the Trinetra design
  const navSections = [
    {
      label: 'Core Operations',
      items: [
        { id: 'home', label: 'Command Center', icon: LayoutGrid, count: null },
        { id: 'overview', label: 'Operations Map', icon: MapIcon, count: null },
        { id: 'predictor', label: 'Risk Predictions', icon: BrainCircuit, count: null },
        { id: 'optimizer', label: 'Dispatch & Fleet', icon: Truck, count: null }
      ]
    },
    {
      label: 'Emergency Response',
      items: [
        { id: 'citizen', label: 'Citizen SOS & Shelters', icon: ShieldAlert, count: sosCount > 0 ? sosCount : null },
        { id: 'contacts', label: '112 / 101 / 108 Helplines', icon: PhoneCall, count: null }
      ]
    },
    {
      label: 'Intelligence & Tools',
      items: [
        { id: 'weather', label: 'Weather & Radar', icon: CloudRain, count: null },
        { id: 'damage', label: 'Damage Assessment', icon: Building2, count: null },
        { id: 'guide', label: 'Survival Guides', icon: BookOpen, count: null },
        { id: 'analytics', label: 'Analytics & Logs', icon: BarChart3, count: null },
        { id: 'datasets', label: 'Datasets & Sources', icon: Database, count: null }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Navigation Rail */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#090c10] border-r border-[#1a2230] flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Top: Logo & Title (matches screenshot) */}
          <div className="px-5 py-4 border-b border-[#1a2230] flex items-center justify-between">
            <div
              onClick={() => {
                setActiveTab('home');
                onClose();
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black shadow-xs">
                <Activity className="w-5 h-5 text-[#090c10]" />
              </div>
              <div>
                <div className="text-sm font-black tracking-widest text-white uppercase leading-none font-mono">
                  AAPDANET
                </div>
                <div className="text-[9px] text-[#8e9bae] tracking-wider uppercase font-semibold mt-1">
                  PREDICT • MONITOR • RESPOND
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161c28] cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items grouped by section */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
            {navSections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#637286]">
                  {sec.label}
                </div>
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-black shadow-sm font-bold'
                            : 'text-[#8e9bae] hover:text-white hover:bg-[#121722]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-[#8e9bae]'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.count && (
                          <span
                            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                              isActive ? 'bg-black text-white' : 'bg-[#1e2533] text-white'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer: System Status & Cloud Settings trigger */}
          <div className="p-3 border-t border-[#1a2230] space-y-2 bg-[#090c10]">
            <button
              onClick={() => {
                onOpenCloudConfig();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#8e9bae] hover:text-white hover:bg-[#121722] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-[#8e9bae]" />
                <span>Settings & API Keys</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            {/* Status indicator pill matching reference bottom left */}
            <div className="px-3 py-2 rounded-xl bg-[#111620] border border-[#1a2230] flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-300">System Live</span>
              </div>
              <span className="text-[10px] font-mono text-[#8e9bae]">7 Feeds</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
