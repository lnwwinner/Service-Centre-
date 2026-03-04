'use client';

import { useState, useEffect } from 'react';
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
  ToggleRight,
  Car,
  AlertTriangle
} from 'lucide-react';

interface Vehicle {
  id: number;
  license_plate: string;
  model: string;
}

export default function CustomizationsPage() {
  const [activeTab, setActiveTab] = useState('coding');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Vehicle Selection
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');

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
  const [keys, setKeys] = useState<any[]>([]);

  // Injector State
  const [injectors, setInjectors] = useState(['', '', '', '']);

  useEffect(() => {
    fetch('/api/vehicles').then(res => res.json()).then(setVehicles);
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      fetchData(selectedVehicle);
    }
  }, [selectedVehicle]);

  const fetchData = async (vid: string) => {
    const res = await fetch(`/api/customizations?vehicleId=${vid}`);
    const data = await res.json();
    
    // Parse Customizations
    const newSettings = { ...settings };
    data.customizations.forEach((c: any) => {
      if (c.feature === 'INJECTOR_CODES') {
        setInjectors(JSON.parse(c.value));
      } else if (newSettings.hasOwnProperty(c.feature)) {
        // @ts-ignore
        newSettings[c.feature] = c.value === 'true';
      }
    });
    setSettings(newSettings);
    setKeys(data.keys);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAction = async (actionType: string, payload: any = {}) => {
    if (!selectedVehicle) return alert('Please select a vehicle first');
    
    setLoading(true);
    setSuccessMsg('');
    
    const session = document.cookie.split('; ').find(row => row.startsWith('user_session='));
    const userData = JSON.parse(decodeURIComponent(session?.split('=')[1] || '{}'));

    try {
      const res = await fetch('/api/customizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          vehicle_id: selectedVehicle,
          userId: userData.id,
          ...payload
        }),
      });

      if (!res.ok) throw new Error('Action failed');

      setSuccessMsg('Operation completed successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchData(selectedVehicle); // Refresh data
    } catch (error) {
      alert('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    for (const [key, value] of Object.entries(settings)) {
      await handleAction('UPDATE_FEATURE', { feature: key, value: String(value) });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Device & Customization</h1>
            <p className="text-slate-500 text-sm mt-1">Manage ECU coding, immobilizer keys, and advanced service functions.</p>
          </div>
          
          {/* Vehicle Selector */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center gap-2 shadow-sm">
            <div className="p-2 bg-slate-100 rounded-xl">
              <Car className="w-5 h-5 text-slate-500" />
            </div>
            <select 
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="bg-transparent outline-none text-sm font-bold text-slate-700 min-w-[200px]"
            >
              <option value="">Select Vehicle...</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.model} ({v.license_plate})</option>
              ))}
            </select>
          </div>
        </div>

        {!selectedVehicle ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-slate-200 border-dashed">
            <Car className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">Please select a vehicle to begin customization</h3>
          </div>
        ) : (
          <>
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
                      onClick={saveSettings}
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
                      onClick={() => {
                        const keyId = prompt('Enter Key ID (e.g., KEY-XXX):');
                        if (keyId) handleAction('KEY_REGISTRATION', { key_id: keyId });
                      }}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all"
                    >
                      + Add New Key
                    </button>
                  </div>
                  <div className="space-y-4">
                    {keys.length === 0 ? <p className="text-slate-400 text-center py-4">No keys registered</p> : keys.map((key) => (
                      <div key={key.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-xl border border-slate-200">
                            <Key className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{key.key_id}</p>
                            <p className="text-xs text-slate-500">Registered: {new Date(key.registered_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          key.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                        }`}>{key.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Danger Zone
                    </h4>
                    <button 
                      onClick={() => {
                        if(confirm('Are you sure you want to reset the immobilizer system? This will revoke all keys.')) {
                          handleAction('IMMOBILIZER_RESET');
                        }
                      }}
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
                          value={code}
                          onChange={(e) => {
                            const newInjectors = [...injectors];
                            newInjectors[index] = e.target.value;
                            setInjectors(newInjectors);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm"
                          placeholder="Enter Code"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={() => handleAction('INJECTOR_CODING', { codes: injectors })}
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
                    onClick={() => {
                      if(confirm('Confirm SRS Reset? Ensure all safety protocols are met.')) {
                        handleAction('SRS_RESET');
                      }
                    }}
                    disabled={loading}
                    className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                    Confirm SRS Reset
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
