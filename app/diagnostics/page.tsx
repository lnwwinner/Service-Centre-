'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { Activity, Zap, AlertTriangle, CheckCircle, Search, FileText, Cpu, Shield, Sparkles } from 'lucide-react';
import AiDiagnosticPanel from '@/components/AiDiagnosticPanel';

interface Vehicle {
  id: number;
  license_plate: string;
  model: string;
}
// ... (interfaces remain same)

export default function DiagnosticsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [scanning, setScanning] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [lastResult, setLastResult] = useState<any>(null);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  // ... (useEffect and fetchReports remain same)

  // ... (runScan remains same)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ... (Header remains same) */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ... (Control Panel remains same) */}
          
          {/* Results Area */}
          <div className="lg:col-span-2 space-y-6">
            {scanning && (
              // ... (Scanning UI remains same)
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

                <div className="bg-white/60 rounded-2xl p-4 mb-6">
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

                <button 
                  onClick={() => setIsAiPanelOpen(true)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze with AI Engine
                </button>
              </motion.div>
            )}

            {/* History */}
            {/* ... (History UI remains same) */}
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

      <AiDiagnosticPanel 
        isOpen={isAiPanelOpen} 
        onClose={() => setIsAiPanelOpen(false)} 
        diagnosticData={lastResult}
        vehicleInfo={vehicles.find(v => v.id === parseInt(selectedVehicle))}
      />
    </DashboardLayout>
  );
}
