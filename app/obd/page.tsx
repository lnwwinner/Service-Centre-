'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { Cpu, Wifi, Bluetooth, Usb, Cloud, Plus, RefreshCw, CheckCircle2, Activity } from 'lucide-react';
import AiDeviceOptimizer from '@/components/AiDeviceOptimizer';
import LiveObdMonitor from '@/components/LiveObdMonitor';

interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  last_seen: string;
}

export default function OBDIntegrationPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monitoringDevice, setMonitoringDevice] = useState<string | null>(null);
  
  // Form
  const [name, setName] = useState('');
  const [type, setType] = useState('BLUETOOTH');
  const [connectionString, setConnectionString] = useState('');

  const fetchDevices = async () => {
    const res = await fetch('/api/obd/devices');
    setDevices(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = document.cookie.split('; ').find(row => row.startsWith('user_session='));
    const userData = JSON.parse(decodeURIComponent(session?.split('=')[1] || '{}'));

    await fetch('/api/obd/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, connection_string: connectionString, userId: userData.id }),
    });
    
    setIsModalOpen(false);
    fetchDevices();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'WIFI': return <Wifi className="w-5 h-5" />;
      case 'BLUETOOTH': return <Bluetooth className="w-5 h-5" />;
      case 'USB': return <Usb className="w-5 h-5" />;
      case 'CLOUD': return <Cloud className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">OBD Integration & Device Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage diagnostic tools and connectivity</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            <Plus className="w-5 h-5" />
            Register Device
          </button>
        </div>

        <AiDeviceOptimizer />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div key={device.id} className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                {getIcon(device.type)}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl ${
                  device.status === 'CONNECTED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  {getIcon(device.type)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{device.name}</h3>
                  <p className="text-xs text-slate-500">{device.type}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                  device.status === 'CONNECTED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {device.status}
                </span>
                
                {device.status === 'CONNECTED' && (
                  <button 
                    onClick={() => setMonitoringDevice(device.id.toString())}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <Activity className="w-3 h-3" /> Monitor Live
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {monitoringDevice && (
        <LiveObdMonitor 
          deviceId={monitoringDevice} 
          onClose={() => setMonitoringDevice(null)} 
        />
      )}

      {/* Register Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-[32px] p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Register OBD Device</h2>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Device Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Scanner A1"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Connection Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="BLUETOOTH">Bluetooth</option>
                  <option value="WIFI">Wi-Fi</option>
                  <option value="USB">USB</option>
                  <option value="CLOUD">Cloud Gateway</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Connection String / MAC / IP</label>
                <input 
                  type="text" 
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="00:11:22:33:44:55"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                >
                  Register
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
