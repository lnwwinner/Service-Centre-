'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Thermometer, 
  Gauge, 
  AlertTriangle,
  Zap,
  ShieldAlert,
  Settings2,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

const categories = [
  { id: 'engine', label: 'Engine', icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'electrical', label: 'Electrical', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'brake', label: 'Brake System', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'suspension', label: 'Suspension', icon: Settings2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'exhaust', label: 'Exhaust & Emission', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'safety', label: 'Safety Systems', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function DiagnosticsPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const startScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        status: Math.random() > 0.7 ? 'Warning' : 'Healthy',
        details: selectedCategory.id === 'engine' ? 'P0171: System Too Lean detected.' : 'All sensors within normal range.',
        severity: Math.random() > 0.7 ? 'Critical' : 'Info'
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Diagnostic System</h1>
          <p className="text-slate-500 text-sm mt-1">วิเคราะห์ระบบรถยนต์แยกตามหมวดหมู่ (OBD-II & CAN Bus Integration)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category List */}
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                  selectedCategory.id === cat.id 
                    ? 'bg-white border-red-200 shadow-md shadow-red-500/5' 
                    : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${cat.bg} rounded-xl`}>
                    <cat.icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <span className={`font-bold text-sm ${selectedCategory.id === cat.id ? 'text-slate-900' : 'text-slate-500'}`}>
                    {cat.label}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedCategory.id === cat.id ? 'text-red-500' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>

          {/* Diagnostic View */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`p-4 ${selectedCategory.bg} rounded-[24px]`}>
                    <selectedCategory.icon className={`w-8 h-8 ${selectedCategory.color}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedCategory.label} Diagnostics</h2>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Active Monitoring Layer</p>
                  </div>
                </div>
                <button 
                  onClick={startScan}
                  disabled={isScanning}
                  className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {isScanning ? 'Scanning...' : 'Start Full Scan'}
                </button>
              </div>

              {isScanning ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium animate-pulse">กำลังดึงข้อมูลจาก CAN Bus...</p>
                </div>
              ) : scanResult ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-6 rounded-3xl border ${
                    scanResult.status === 'Healthy' ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {scanResult.status === 'Healthy' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-bold ${scanResult.status === 'Healthy' ? 'text-emerald-900' : 'text-orange-900'}`}>
                          Scan Result: {scanResult.status}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          scanResult.severity === 'Critical' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {scanResult.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{scanResult.details}</p>
                      <div className="bg-white/50 p-4 rounded-2xl border border-white/20">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Service Recommendation</h5>
                        <p className="text-sm font-medium">
                          {scanResult.status === 'Healthy' 
                            ? 'No immediate action required. Continue regular maintenance.' 
                            : 'Recommended to check Fuel Injectors and Air Intake system for leaks.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium">เลือกหมวดหมู่และกดปุ่มเพื่อเริ่มการวินิจฉัย</p>
                </div>
              )}
            </div>

            {/* Category Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Live Sensor Values
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Battery Voltage', value: '14.2V', status: 'Normal' },
                    { label: 'O2 Sensor Level', value: '0.85V', status: 'Normal' },
                    { label: 'Tire Pressure (FL)', value: '32 PSI', status: 'Warning' },
                  ].map((sensor) => (
                    <div key={sensor.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-medium text-slate-600">{sensor.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">{sensor.value}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          sensor.status === 'Normal' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                        }`}>{sensor.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-[28px] relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold mb-4">Integration Layer</h3>
                  <p className="text-slate-400 text-xs mb-6">ข้อมูลการวินิจฉัยจะถูกส่งผ่าน Gate Layer และบันทึกลงใน Service History อัตโนมัติเมื่อยืนยันผล</p>
                  <button className="w-full py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors">
                    Sync with Service History
                  </button>
                </div>
                <ShieldAlert className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
