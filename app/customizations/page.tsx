'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  Settings, 
  Key, 
  Zap, 
  ShieldAlert, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';

export default function CustomizationsPage() {
  const [activeTab, setActiveTab] = useState('coding');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // ECU Coding State
  const [settings, setSettings] = useState({
    autoLock: true,
    daytimeLights: true,
    ecoMode: false,
    laneAssist: true,
    parkingSensors: true,
    welcomeLight: false
  });

  // Immobilizer State
  const [keys, setKeys] = useState([
    { id: 'KEY-001', status: 'ACTIVE', registered: '2024-01-15' },
    { id: 'KEY-002', status: 'ACTIVE', registered: '2024-02-20' }
  ]);

  // Injector State
  const [injectors, setInjectors] = useState(['INJ-A123', 'INJ-B456', 'INJ-C789', 'INJ-D012']);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAction = async (action: string) => {
    setLoading(true);
    setSuccessMsg('');
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    
    setLoading(false);
    setSuccessMsg(`${action} completed successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Device & Customization</h1>
          <p className="text-slate-500 text-sm mt-1">Manage ECU coding, immobilizer keys, and advanced service functions.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'coding', label: 'ECU Coding', icon: Settings },
            { id: 'immobilizer', label: 'Immobilizer', icon: Key },
            { id: 'injector', label: 'Injector Coding', icon: Zap },
            { id: 'srs', label: 'SRS Reset', icon: ShieldAlert },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl mb-6 flex items-center gap-2 font-bold text-sm border border-emerald-100"
            >
              <CheckCircle2 className="w-5 h-5" />
              {successMsg}
            </motion.div>
          )}

          {activeTab === 'coding' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${value ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                      <Settings className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <p className="text-xs text-slate-400">{value ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleSetting(key as keyof typeof settings)} className={`transition-colors ${value ? 'text-blue-600' : 'text-slate-300'}`}>
                    {value ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                  </button>
                </div>
              ))}
              <div className="col-span-full flex justify-end mt-4">
                <button 
                  onClick={() => handleAction('ECU Flash')}
                  disabled={loading}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Apply Changes & Flash ECU
                </button>
              </div>
            </div>
          )}

          {activeTab === 'immobilizer' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Registered Keys</h3>
                <button 
                  onClick={() => handleAction('Key Registration')}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all"
                >
                  + Add New Key
                </button>
              </div>
              <div className="space-y-4">
                {keys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <Key className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{key.id}</p>
                        <p className="text-xs text-slate-500">Registered: {key.registered}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-bold">{key.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h4>
                <button 
                  onClick={() => handleAction('Immobilizer Reset')}
                  disabled={loading}
                  className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-all border border-red-200"
                >
                  Reset Immobilizer System
                </button>
              </div>
            </div>
          )}

          {activeTab === 'injector' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-6">Injector Calibration Codes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {injectors.map((code, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Cylinder {index + 1}</label>
                    <input 
                      type="text" 
                      defaultValue={code}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => handleAction('Injector Coding')}
                  disabled={loading}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Write Injector Codes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'srs' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">SRS Airbag System Reset</h3>
              <p className="text-slate-500 max-w-md mb-8">
                This function will clear crash data and reset the Airbag Control Module. 
                Ensure all safety components have been inspected or replaced before proceeding.
              </p>
              <button 
                onClick={() => handleAction('SRS Reset')}
                disabled={loading}
                className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                Confirm SRS Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
