'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Server, 
  Wifi, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  HardDrive
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    dbConnections: 0,
    uptime: '0h 0m',
    status: 'HEALTHY'
  });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCpu = Math.floor(Math.random() * 30) + 10;
      const newMem = Math.floor(Math.random() * 40) + 20;
      const newConns = Math.floor(Math.random() * 10) + 5;
      
      setMetrics(prev => ({
        cpu: newCpu,
        memory: newMem,
        dbConnections: newConns,
        uptime: '24h 15m',
        status: newCpu > 80 ? 'WARNING' : 'HEALTHY'
      }));

      setChartData(prev => [
        ...prev.slice(-20),
        { time: new Date().toLocaleTimeString(), cpu: newCpu, memory: newMem }
      ]);

      if (Math.random() > 0.9) {
        setAlerts(prev => [
          { id: Date.now(), type: 'WARNING', message: 'High CPU Usage detected', time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 4)
        ]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Monitoring</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time infrastructure health & performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">CPU Load</p>
                <h3 className="text-2xl font-bold">{metrics.cpu}%</h3>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${metrics.cpu > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                style={{ width: `${metrics.cpu}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memory Usage</p>
                <h3 className="text-2xl font-bold">{metrics.memory}%</h3>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                style={{ width: `${metrics.memory}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">DB Connections</p>
                <h3 className="text-2xl font-bold">{metrics.dbConnections}</h3>
              </div>
            </div>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active
            </p>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Uptime</p>
                <h3 className="text-2xl font-bold">{metrics.uptime}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-bold">Since last reboot</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Resource Usage History</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'}}
                  />
                  <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="memory" stroke="#A855F7" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts & Status */}
          <div className="space-y-6">
            <div className={`p-6 rounded-[32px] border ${
              metrics.status === 'HEALTHY' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
            }`}>
              <h3 className={`font-bold text-lg mb-2 ${
                metrics.status === 'HEALTHY' ? 'text-emerald-700' : 'text-red-700'
              }`}>
                System Status: {metrics.status}
              </h3>
              <p className="text-sm opacity-80">All services operational. Gate layer active.</p>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm h-full max-h-[300px] overflow-y-auto">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Recent Alerts
              </h3>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">No active alerts</p>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{alert.message}</p>
                        <p className="text-xs text-slate-400">{alert.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
