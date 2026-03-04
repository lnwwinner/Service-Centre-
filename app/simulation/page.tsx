'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  Play, 
  Square, 
  AlertOctagon, 
  Zap, 
  Cpu, 
  Settings, 
  History,
  Activity,
  Terminal
} from 'lucide-react';

interface Session {
  id: number;
  name: string;
  status: string;
  config: string;
  created_at: string;
}

export default function SimulationPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const fetchSessions = async () => {
    const res = await fetch('/api/simulation');
    const data = await res.json();
    setSessions(data);
    const running = data.find((s: Session) => s.status === 'RUNNING');
    if (running) setActiveSession(running);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const startSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'START_SESSION', config: { type: 'VIRTUAL_OBD' } })
      });
      const data = await res.json();
      setActiveSession(data);
      addLog('Virtual OBD Simulation started.');
      fetchSessions();
    } catch (e) {
      addLog('Error starting simulation.');
    } finally {
      setLoading(false);
    }
  };

  const stopSimulation = async () => {
    if (!activeSession) return;
    setLoading(true);
    try {
      await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'STOP_SESSION', sessionId: activeSession.id })
      });
      setActiveSession(null);
      addLog('Simulation stopped.');
      fetchSessions();
    } catch (e) {
      addLog('Error stopping simulation.');
    } finally {
      setLoading(false);
    }
  };

  const injectError = async (type: string) => {
    if (!activeSession) return;
    try {
      await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'INJECT_ERROR', sessionId: activeSession.id, errorType: type })
      });
      addLog(`Injected error: ${type}`);
    } catch (e) {
      addLog('Failed to inject error.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">OBD Simulation Layer</h1>
            <p className="text-slate-500 text-sm mt-1">Virtual device testing and error injection environment</p>
          </div>
          <div className="flex gap-3">
            {!activeSession ? (
              <button 
                onClick={startSimulation}
                disabled={loading}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
              >
                <Play className="w-4 h-4" />
                Start Simulation
              </button>
            ) : (
              <button 
                onClick={stopSimulation}
                disabled={loading}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
              >
                <Square className="w-4 h-4" />
                Stop Simulation
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" />
                Simulation Controls
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => injectError('P0300')}
                  disabled={!activeSession}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-red-50 hover:border-red-100 transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl text-red-500 shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all">
                      <AlertOctagon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Inject Misfire (P0300)</p>
                      <p className="text-[10px] text-slate-400">Random cylinder misfire simulation</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => injectError('P0117')}
                  disabled={!activeSession}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-orange-50 hover:border-orange-100 transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl text-orange-500 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Coolant Sensor Drift</p>
                      <p className="text-[10px] text-slate-400">Simulate sensor calibration error</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => injectError('VOLTAGE_DROP')}
                  disabled={!activeSession}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-yellow-50 hover:border-yellow-100 transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl text-yellow-500 shadow-sm group-hover:bg-yellow-500 group-hover:text-white transition-all">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Voltage Instability</p>
                      <p className="text-[10px] text-slate-400">Simulate battery/alternator issues</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => injectError('CAN_BUS_FLOOD')}
                  disabled={!activeSession}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-100 transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl text-indigo-500 shadow-sm group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">CAN Bus Flood</p>
                      <p className="text-[10px] text-slate-400">Performance stress test simulation</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[32px] border border-white/10 shadow-xl">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white">
                <Terminal className="w-5 h-5 text-emerald-500" />
                Live Simulation Log
              </h3>
              <div className="bg-black/50 rounded-2xl p-6 h-[300px] overflow-y-auto font-mono text-xs space-y-2">
                {logs.length === 0 ? (
                  <p className="text-slate-600 italic">Waiting for simulation events...</p>
                ) : (
                  logs.map((log, i) => (
                    <p key={i} className="text-emerald-500/80">
                      <span className="text-slate-500 mr-2">➜</span>
                      {log}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" />
                Recent Sessions
              </h3>
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div key={s.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm text-slate-900">{s.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        s.status === 'RUNNING' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {new Date(s.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
