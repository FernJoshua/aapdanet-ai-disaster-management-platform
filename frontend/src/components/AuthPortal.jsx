import React, { useState } from 'react';
import {
  UserPlus,
  LogIn,
  ShieldCheck,
  Bell,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  HeartPulse,
  Award,
  LogOut
} from 'lucide-react';
import { getTranslation } from '../utils/translations';

export default function AuthPortal({ lang, currentUser, setCurrentUser, onSpeakText }) {
  const t = (key) => getTranslation(lang, key);

  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [role, setRole] = useState('Citizen'); // 'Citizen', 'Volunteer', 'Official'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    ward: '',
    password: '',
    smsAlerts: true,
    whatsappAlerts: true,
    voiceCallAlerts: false,
    skills: []
  });

  const skillOptions = [
    'First Aid / CPR Certified',
    'Swimming & Water Rescue',
    'Fire Safety & Extinguisher Ops',
    'Amateur / Ham Radio Operator',
    'Medical Doctor / Paramedic',
    '4x4 Vehicle / Supply Transport'
  ];

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userObj = {
      id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
      name: formData.name || 'Registered Citizen',
      email: formData.email,
      phone: formData.phone || '+91 98XXXXXXXX',
      city: formData.city,
      ward: formData.ward || 'Central Ward',
      role,
      skills: formData.skills,
      registeredAt: new Date().toLocaleDateString()
    };
    localStorage.setItem('aapdanet_user', JSON.stringify(userObj));
    setCurrentUser(userObj);
    onSpeakText(
      `Welcome ${userObj.name}. Your ${role} profile for ${userObj.city} is now active for real-time disaster alerts.`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('aapdanet_user');
    setCurrentUser(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <UserPlus className="w-4 h-4" />
          <span>Citizen & Responder Network</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
          {t('authTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {t('authSubtitle')}
        </p>
      </div>

      {currentUser ? (
        /* Logged In User Digital Preparedness Card */
        <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-4">
              <div className="keep-white w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-lg">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white">{currentUser.name}</h2>
                  <span className="keep-white px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                    ✓ Verified {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Digital ID: {currentUser.id} • Zone: {currentUser.city} ({currentUser.ward})
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 text-xs font-bold border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold">Subscribed Alert Zone</span>
              <div className="text-base font-bold text-white">{currentUser.city}</div>
              <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live SMS & WhatsApp Broadcast Active
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold">Registered Contact</span>
              <div className="text-base font-bold text-white">{currentUser.phone}</div>
              <span className="text-cyan-400 text-[11px]">{currentUser.email}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold">Emergency Priority Status</span>
              <div className="text-base font-bold text-amber-400">Instant GPS SOS Linked</div>
              <span className="text-slate-400 text-[11px]">Connected to 112 / 1077 Control</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Sign Up / Login Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Mode Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  mode === 'signup'
                    ? 'bg-cyan-600 text-white keep-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create New Account (Sign Up)</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  mode === 'login'
                    ? 'bg-cyan-600 text-white keep-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Existing Member Sign In</span>
              </button>
            </div>

            {/* Role Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Select Registration Role:</label>
              <div className="grid grid-cols-3 gap-2.5">
                {['Citizen', 'Volunteer', 'Official'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      role === r
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {r === 'Citizen' && '🏠 Citizen'}
                    {r === 'Volunteer' && '🤝 Volunteer'}
                    {r === 'Official' && '🛡️ Official'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Mobile Number (For SMS/SOS) *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">City / District *</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Mumbai">Mumbai (City & Suburban)</option>
                        <option value="Pune">Pune & Pimpri-Chinchwad</option>
                        <option value="Nagpur">Nagpur</option>
                        <option value="Thane">Thane & Navi Mumbai</option>
                        <option value="Raigad">Raigad (Alibag / Mahad)</option>
                        <option value="Ratnagiri">Ratnagiri & Chiplun</option>
                        <option value="Kolhapur">Kolhapur & Sangli</option>
                        <option value="Nashik">Nashik</option>
                        <option value="Satara">Satara</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Locality / Ward / Pincode</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="e.g. Kurla West / Ward L / 400070"
                          value={formData.ward}
                          onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {role === 'Volunteer' && (
                    <div className="space-y-2 pt-2">
                      <label className="block text-slate-300 font-bold">
                        Select Your Emergency Response Skills:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {skillOptions.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between ${
                              formData.skills.includes(skill)
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                : 'bg-slate-800/60 border-slate-700 text-slate-400'
                            }`}
                          >
                            <span>{skill}</span>
                            {formData.skills.includes(skill) && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-white block">Real-Time Early Warning Preferences:</span>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.smsAlerts}
                        onChange={(e) => setFormData({ ...formData, smsAlerts: e.target.checked })}
                        className="rounded accent-cyan-500"
                      />
                      <span>Receive Instant SMS Flood, Cyclone, Fire & Heatwave Alerts</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.whatsappAlerts}
                        onChange={(e) => setFormData({ ...formData, whatsappAlerts: e.target.checked })}
                        className="rounded accent-cyan-500"
                      />
                      <span>Receive Evacuation Map & Nearest Shelter Links on WhatsApp</span>
                    </label>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="keep-white w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-lg shadow-cyan-600/25 transition-all"
              >
                {mode === 'signup' ? `Complete ${role} Sign Up` : 'Sign In to Portal'}
              </button>
            </form>
          </div>

          {/* Right 5 Cols: Benefits of Signing Up */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <h3 className="text-lg font-extrabold text-white">
              Why Register on AapdaNet AI?
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Hyper-Local Ward & Pin-Code Warnings</h4>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Get notified 3–6 hours before river overflow, high tide waterlogging, or extreme heatwave peaks in your specific neighborhood.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <HeartPulse className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">1-Click Family & Senior Citizen SOS</h4>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Pre-save medical needs (insulin, oxygen, wheelchair access) so 108 ambulances and NDRF boats arrive prepared.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Verified Civil Defence Volunteer Badge</h4>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Registered volunteers coordinate directly with District Collector (1077) and Municipal Ward Officers during relief drives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
