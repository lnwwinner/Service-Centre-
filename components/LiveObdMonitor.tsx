'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Gauge, Thermometer, Zap, Navigation, BarChart3, X } from 'lucide-react';

interface ObdData {
  timestamp: string;
  metrics: {
    rpm: number;
    speed: number;
    temp: number;
    load: number;
    voltage: string;
    throttle: number;
  };
}

export default function LiveObdMonitor({ deviceId, onClose }: { deviceId: string; onClose: () => void }) {
  const [data, setData] = useState<ObdData | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`/api/obd/stream?deviceId=${deviceId}`);

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setData(parsedData);
    };

    eventSource.onerror = () => {
      setConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [deviceId]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 w-full max-w-4xl rounded-[40px] p-8 border border-white/10 shadow-2xl overflow-hidden relative"
      >
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Live OBD Stream</h2>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Device ID: {deviceId}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* RPM Gauge */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <Activity className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Engine RPM</span>
              </div>
              <div className="text-4xl font-mono font-bold text-white mb-1">
                {data?.metrics.rpm || 0}
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500"
                  animate={{ width: `${((data?.metrics.rpm || 0) / 8000) * 100}%` }}
                />
              </div>
            </div>

            {/* Speed */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <Gauge className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Vehicle Speed</span>
              </div>
              <div className="text-4xl font-mono font-bold text-white mb-1">
                {data?.metrics.speed || 0} <span className="text-lg text-slate-500">km/h</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500"
                  animate={{ width: `${((data?.metrics.speed || 0) / 240) * 100}%` }}
                />
              </div>
            </div>

            {/* Temp */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-orange-400">
                <Thermometer className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Coolant Temp</span>
              </div>
              <div className="text-4xl font-mono font-bold text-white mb-1">
                {data?.metrics.temp || 0} <span className="text-lg text-slate-500">°C</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-orange-500"
                  animate={{ width: `${((data?.metrics.temp || 0) / 120) * 100}%` }}
                />
              </div>
            </div>

            {/* Load */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-purple-400">
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Engine Load</span>
              </div>
              <div className="text-4xl font-mono font-bold text-white mb-1">
                {data?.metrics.load || 0}%
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-purple-500"
                  animate={{ width: `${data?.metrics.load || 0}%` }}
                />
              </div>
            </div>

            {/* Voltage */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-yellow-400">
                <Zap className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Battery Voltage</span>
              </div>
              <div className="text-4xl font-mono font-bold text-white mb-1">
                {data?.metrics.voltage || '0.0'} <span className="text-lg text-slate-500">V</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-yellow-500"
                  animate={{ width: `${((parseFloat(data?.metrics.voltage || '0') - 10) / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Throttle */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-indigo-400">
                <Navigation className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Throttle Pos</span>
              </div>
              <div className="text-4xl font-mono font-bold text-white mb-1">
                {data?.metrics.throttle || 0}%
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-500"
                  animate={{ width: `${data?.metrics.throttle || 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center">
            <p className="text-slate-500 text-xs font-mono animate-pulse">
              STREAMING DATA PACKETS... {data?.timestamp}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
