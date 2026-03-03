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
  CheckCircle2,
  TrendingUp,
  Zap,
  ShieldCheck,
  History as HistoryIcon
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Mock Diagnostic Data
const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    rpm: 800 + Math.random() * 2000,
    temp: 85 + Math.random() * 10,
    load: 20 + Math.random() * 40,
  }));
};

export default function DashboardPage() {
  const [data, setData] = useState(generateData());
  const [stats, setStats] = useState({
    rpm: 1250,
    temp: 92,
    voltage: 14.2,
    fuelTrim: 2.4
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          rpm: 800 + Math.random() * 2000,
          temp: 85 + Math.random() * 10,
          load: 20 + Math.random() * 40,
        }];
        return newData;
      });
      
      setStats({
        rpm: Math.floor(800 + Math.random() * 2000),
        temp: Math.floor(85 + Math.random() * 15),
        voltage: parseFloat((13.8 + Math.random() * 0.8).toFixed(1)),
        fuelTrim: parseFloat((Math.random() * 5 - 2).toFixed(1))
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const diagnosticCards = [
    { label: 'Engine RPM', value: stats.rpm, unit: 'RPM', icon: Gauge, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Coolant Temp', value: stats.temp, unit: '°C', icon: Thermometer, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Battery Voltage', value: stats.voltage, unit: 'V', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Fuel Trim (ST)', value: stats.fuelTrim, unit: '%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ระบบวินิจฉัยอัจฉริยะ (OBD-II Simulator)</h1>
            <p className="text-slate-500 text-sm mt-1">ติดตามสถานะเครื่องยนต์และเซนเซอร์แบบเรียลไทม์</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
            ระบบทำงานปกติ: GATE LAYER ACTIVE
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {diagnosticCards.map((card, idx) => (
            <motion.div 
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${card.bg} rounded-2xl`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{card.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{card.value}</span>
                <span className="text-slate-400 text-sm font-medium">{card.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg">Engine Performance Graph</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> RPM
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div> Temp
                </span>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="rpm" stroke="#2563eb" fillOpacity={1} fill="url(#colorRpm)" strokeWidth={3} />
                  <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-bold text-lg mb-6">DTC Status (รหัสปัญหา)</h3>
            <div className="flex-1 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">No Active DTCs</p>
                  <p className="text-xs text-slate-500 mt-0.5">ระบบเครื่องยนต์ทำงานปกติ ไม่พบรหัสข้อผิดพลาด</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">VVT System Check</p>
                  <p className="text-xs text-slate-500 mt-0.5">ระบบวาล์วแปรผันทำงานในช่วงที่กำหนด</p>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-4 opacity-50">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">P0171 (System Too Lean)</p>
                  <p className="text-xs text-slate-500 mt-0.5">ประวัติ: เคยพบส่วนผสมบางเมื่อ 2 วันก่อน</p>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors">
              สแกนระบบทั้งหมด
            </button>
          </div>
        </div>

        {/* System Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 text-white p-8 rounded-[32px] overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Security Layer: Active</h3>
              <p className="text-slate-400 text-sm mb-6">ระบบตรวจสอบสิทธิ์และบันทึก Log ทำงานอยู่เบื้องหลังเพื่อความปลอดภัยสูงสุด</p>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Encryption</span>
                  <span className="text-sm font-mono">AES-256-GCM</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Logs</span>
                  <span className="text-sm font-mono">IMMUTABLE</span>
                </div>
              </div>
            </div>
            <ShieldCheck className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-[32px] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Backup & Recovery</h3>
              <p className="text-slate-500 text-sm">สำรองข้อมูลล่าสุดเมื่อ: 10 นาทีที่แล้ว</p>
              <button className="mt-4 px-6 py-2 border border-slate-200 rounded-full text-xs font-bold hover:bg-slate-50 transition-colors">
                จัดการการสำรองข้อมูล
              </button>
            </div>
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
              <HistoryIcon className="w-8 h-8 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
