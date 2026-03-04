'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { Activity, Zap, AlertTriangle, CheckCircle, Search, FileText, Cpu, Shield } from 'lucide-react';

interface Vehicle {
  id: number;
  license_plate: string;
  model: string;
}

interface Report {
  id: number;
  category: string;
  severity: string;
  recommendation: string;
  created_at: string;
  data: string;
}

export default function DiagnosticsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [scanning, setScanning] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/vehicles').then(res => res.json()).then(setVehicles);
  }, []);

  const fetchReports = async (vid: string) => {
    const res = await fetch(`/api/diagnostics?vehicle_id=${vid}`);
    setReports(await res.json());
  };

  useEffect(() => {
    if (selectedVehicle) {
      fetchReports(selectedVehicle);
      setLastResult(null);
    }
  }, [selectedVehicle]);

  const runScan = async (category: string) => {
    setScanning(true);
    setLastResult(null);
    
    // Simulate scan time
    await new Promise(r => setTimeout(r, 2000));
    
    const session = document.cookie.split('; ').find(row => row.startsWith('user_session='));
    const userData = JSON.parse(decodeURIComponent(session?.split('=')[1] || '{}'));

    const res = await fetch('/api/diagnostics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicle_id: parseInt(selectedVehicle),
        category,
        userId: userData.id
      }),
    });
    
    const data = await res.json();
    setLastResult(data);
    setScanning(false);
    fetchReports(selectedVehicle);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ระบบวินิจฉัยอัจฉริยะ</h1>
          <p className="text-slate-500 text-sm mt-1">ตรวจสอบความผิดปกติของระบบรถยนต์ด้วย AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm h-fit">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              Select Vehicle
            </h3>
            <select 
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 mb-6"
            >
              <option value="">เลือกรถยนต์...</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.model} ({v.license_plate})</option>
              ))}
            </select>

            {selectedVehicle && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Available Scans</p>
                <button 
                  onClick={() => runScan('Engine')}
                  disabled={scanning}
                  className="w-full py-3 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-xl text-sm font-bold text-slate-600 transition-all flex items-center justify-between px-4 group"
                >
                  <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> Engine System</span>
                  {scanning && <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>}
                </button>
                <button 
                  onClick={() => runScan('Electrical')}
                  disabled={scanning}
                  className="w-full py-3 bg-slate-50 hover:bg-yellow-50 hover:text-yellow-600 rounded-xl text-sm font-bold text-slate-600 transition-all flex items-center justify-between px-4"
                >
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Electrical</span>
                </button>
                <button 
                  onClick={() => runScan('Brake')}
                  disabled={scanning}
                  className="w-full py-3 bg-slate-50 hover:bg-slate-200 hover:text-slate-800 rounded-xl text-sm font-bold text-slate-600 transition-all flex items-center justify-between px-4"
                >
                  <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Brake & ABS</span>
                </button>
                <button 
                  onClick={() => runScan('Suspension')}
                  disabled={scanning}
                  className="w-full py-3 bg-slate-50 hover:bg-slate-200 hover:text-slate-800 rounded-xl text-sm font-bold text-slate-600 transition-all flex items-center justify-between px-4"
                >
                  <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> Suspension</span>
                </button>
                <button 
                  onClick={() => runScan('Exhaust')}
                  disabled={scanning}
                  className="w-full py-3 bg-slate-50 hover:bg-slate-200 hover:text-slate-800 rounded-xl text-sm font-bold text-slate-600 transition-all flex items-center justify-between px-4"
                >
                  <span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Exhaust & Emission</span>
                </button>
                <button 
                  onClick={() => runScan('Safety')}
                  disabled={scanning}
                  className="w-full py-3 bg-slate-50 hover:bg-slate-200 hover:text-slate-800 rounded-xl text-sm font-bold text-slate-600 transition-all flex items-center justify-between px-4"
                >
                  <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Safety Systems</span>
                </button>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 space-y-6">
            {scanning && (
              <div className="bg-slate-900 text-white p-8 rounded-[32px] flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold animate-pulse">Running Diagnostics...</h3>
                <p className="text-slate-400 text-sm mt-2">Connecting to ECU via OBD Gateway</p>
              </div>
            )}

            {!scanning && lastResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-[32px] border ${
                  lastResult.severity === 'CRITICAL' ? 'bg-red-50 border-red-100' : 
                  lastResult.severity === 'WARNING' ? 'bg-orange-50 border-orange-100' : 'bg-emerald-50 border-emerald-100'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className={`text-2xl font-bold ${
                      lastResult.severity === 'CRITICAL' ? 'text-red-700' : 
                      lastResult.severity === 'WARNING' ? 'text-orange-700' : 'text-emerald-700'
                    }`}>
                      Scan Complete: {lastResult.severity}
                    </h3>
                    <p className="text-slate-600 mt-1">{lastResult.recommendation}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    lastResult.severity === 'CRITICAL' ? 'bg-red-200 text-red-700' : 
                    lastResult.severity === 'WARNING' ? 'bg-orange-200 text-orange-700' : 'bg-emerald-200 text-emerald-700'
                  }`}>
                    {lastResult.severity === 'CRITICAL' ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                  </div>
                </div>

                <div className="bg-white/60 rounded-2xl p-4">
                  <h4 className="font-bold text-sm mb-2">Detected Codes (DTC)</h4>
                  <div className="space-y-2">
                    {lastResult.issues.map((issue: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm border-b border-black/5 pb-2 last:border-0 last:pb-0">
                        <span className="font-mono font-bold">{issue.code}</span>
                        <span className="text-slate-600">{issue.desc}</span>
                      </div>
                    ))}
                    {lastResult.issues.length === 0 && <p className="text-slate-500 italic">No issues detected.</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* History */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Scan History
              </h3>
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">No scan history for this vehicle.</p>
                ) : (
                  reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="font-bold text-sm">{report.category} Scan</p>
                        <p className="text-xs text-slate-400">{new Date(report.created_at).toLocaleString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        report.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 
                        report.severity === 'WARNING' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {report.severity}
                      </span>
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
