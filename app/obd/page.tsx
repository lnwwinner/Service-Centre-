'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  Wifi, 
  Bluetooth, 
  Usb, 
  Cloud, 
  RefreshCw, 
  Plus, 
  Terminal, 
  Activity,
  CheckCircle2,
  XCircle,
  Cpu
} from 'lucide-react';

export default function OBDIntegrationPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [activeDevice, setActiveDevice] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const res = await fetch('/api/obd/devices');
    const data = await res.json();
    setDevices(data);
  };

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      // Simulate finding a new device
      const types = ['BLUETOOTH', 'WIFI', 'USB'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      addLog(`Detected new ${randomType} device: OBD-II Scanner (${Math.random().toString(36).substring(7)})`);
    }, 3000);
  };

  const connectDevice = async (device: any) => {
    addLog(`Attempting to connect to ${device.name} via ${device.type}...`);
    
    // Simulate connection delay
    setTimeout(async () => {
      await fetch('/api/obd/devices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: device.id, status: 'CONNECTED', userId: 1 }) // Mock User ID
      });
      
      setActiveDevice(device);
      addLog(`Successfully connected to ${device.name}`);
      fetchDevices();
      startDataStream();
    }, 1500);
  };

  const startDataStream = () => {
    const interval = setInterval(() => {
      const rpm = Math.floor(Math.random() * (3000 - 800) + 800);
      const speed = Math.floor(Math.random() * 120);
      const temp = Math.floor(Math.random() * (110 - 80) + 80);
      addLog(`[DATA STREAM] RPM: ${rpm} | Speed: ${speed}km/h | Temp: ${temp}°C`);
    }, 2000);
    
    // Clear interval on unmount or disconnect (simplified for demo)
    return () => clearInterval(interval);
  };

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 50));
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">OBD Scan Integration</h1>
            <p className="text-slate-500 text-sm mt-1">จัดการการเชื่อมต่ออุปกรณ์ OBD-II หลายรูปแบบ (USB, Bluetooth, Wi-Fi, Cloud)</p>
          </div>
          <button 
            onClick={simulateScan}
            disabled={scanning}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-50"
          >
            {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {scanning ? 'Scanning...' : 'Scan for Devices'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Device List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600" />
                Available Devices
              </h3>
              <div className="space-y-4">
                {devices.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <p>No devices found. Click scan to detect.</p>
                    {/* Mock devices for demo if empty */}
                    <button 
                      onClick={() => setDevices([
                        { id: 1, name: 'Vgate iCar Pro', type: 'BLUETOOTH', status: 'DISCONNECTED' },
                        { id: 2, name: 'OBDLink EX', type: 'USB', status: 'DISCONNECTED' },
                        { id: 3, name: 'Cloud Gateway #882', type: 'CLOUD', status: 'CONNECTED' },
                      ])}
                      className="text-xs text-blue-500 underline mt-2"
                    >
                      Load Demo Devices
                    </button>
                  </div>
                ) : (
                  devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          device.status === 'CONNECTED' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 border border-slate-200'
                        }`}>
                          {getIcon(device.type)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{device.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{device.type} • {device.status}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => connectDevice(device)}
                        disabled={device.status === 'CONNECTED'}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          device.status === 'CONNECTED' 
                            ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {device.status === 'CONNECTED' ? 'Active' : 'Connect'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Connection Topology */}
            <div className="bg-slate-900 text-white p-8 rounded-[32px] relative overflow-hidden min-h-[200px] flex items-center justify-center">
              <div className="text-center z-10">
                <Cloud className="w-16 h-16 mx-auto mb-4 text-blue-400 opacity-80" />
                <h3 className="font-bold text-lg">Cloud OBD Gateway</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-md">
                  ระบบรองรับการเชื่อมต่อแบบ Hybrid: ข้อมูลจาก USB/Bluetooth จะถูกส่งผ่าน Gateway ขึ้น Cloud เพื่อประมวลผลและบันทึกลง Immutable Logs
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
            </div>
          </div>

          {/* Live Terminal */}
          <div className="bg-[#1E1E1E] p-6 rounded-[32px] border border-slate-800 font-mono text-xs flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="w-4 h-4" />
                <span className="font-bold">OBD Stream Log</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
              {logs.length === 0 && <p className="text-slate-600 italic">Waiting for connection...</p>}
              {logs.map((log, i) => (
                <p key={i} className="text-emerald-400 break-all border-l-2 border-slate-700 pl-2">
                  {log}
                </p>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <input 
                type="text" 
                placeholder="> Send AT Command..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-slate-300 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
