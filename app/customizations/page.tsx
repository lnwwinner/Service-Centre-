'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  Settings, 
  Key, 
  Cpu, 
  ShieldCheck, 
  RefreshCcw, 
  Plus, 
  Trash2,
  Zap,
  Lock,
  Smartphone
} from 'lucide-react';

export default function CustomizationsPage() {
  const [activeTab, setActiveTab] = useState('devices');

  const tabs = [
    { id: 'devices', label: 'Device Registration', icon: Smartphone },
    { id: 'keys', label: 'Immobilizer Keys', icon: Key },
    { id: 'injectors', label: 'Injector Registration', icon: Zap },
    { id: 'srs', label: 'SRS Reset', icon: ShieldCheck },
    { id: 'customize', label: 'Customize Functions', icon: Settings },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Device & Customization</h1>
          <p className="text-slate-500 text-sm mt-1">จัดการอุปกรณ์เสริมและปรับแต่งฟังก์ชันพิเศษของรถยนต์</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm min-h-[400px]">
          {activeTab === 'devices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Registered Diagnostic Devices</h3>
                <button className="bg-red-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Register New Device
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { sn: 'TDP-8829-X1', model: 'OBD-II Pro V3', status: 'Online' },
                  { sn: 'TDP-1102-B2', model: 'CAN-Bus Analyzer', status: 'Offline' },
                ].map((device) => (
                  <div key={device.sn} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                        <Smartphone className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{device.model}</p>
                        <p className="text-[10px] text-slate-400 font-mono uppercase">{device.sn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                        device.status === 'Online' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                      }`}>{device.status}</span>
                      <button className="text-slate-300 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="max-w-2xl space-y-8">
              <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <Lock className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900">Immobilizer Key Management</h4>
                  <p className="text-sm text-blue-700 mt-1">เพิ่มหรือลบกุญแจรีโมทออกจากระบบ Immobilizer ของรถยนต์ การกระทำนี้ต้องใช้สิทธิ์ Admin และจะถูกบันทึกลงใน Audit Logs ทันที</p>
                </div>
              </div>
              <div className="space-y-4">
                <button className="w-full p-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all">
                  <Plus className="w-5 h-5" /> Add New Smart Key
                </button>
                <button className="w-full p-4 border border-red-200 text-red-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-red-50 transition-all">
                  <RefreshCcw className="w-5 h-5" /> Reset All Keys (Emergency)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'injectors' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Injector Registration</h3>
              <p className="text-slate-500 text-sm">ลงทะเบียนรหัสหัวฉีดใหม่ (Injector Compensation Code) เพื่อปรับจูนการจ่ายน้ำมันให้แม่นยำ</p>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cylinder #{num}</label>
                    <input 
                      type="text" 
                      placeholder="Code..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono focus:ring-2 focus:ring-red-500/20 outline-none"
                    />
                  </div>
                ))}
              </div>
              <button className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all">
                Write Codes to ECU
              </button>
            </div>
          )}

          {activeTab === 'srs' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
                <ShieldCheck className="w-12 h-12 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">SRS Airbag Reset</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">รีเซ็ตระบบถุงลมหลังการซ่อมบำรุงหรือเปลี่ยนเซ็นเซอร์ใหม่ เพื่อล้างประวัติความผิดพลาดในระบบความปลอดภัย</p>
              </div>
              <button className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                Execute SRS Reset
              </button>
            </div>
          )}

          {activeTab === 'customize' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-bold">User Customization</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Auto Door Lock', options: ['On Shift to D', 'On Speed > 20km/h', 'Off'] },
                    { label: 'Welcome Lighting', options: ['30s', '60s', 'Off'] },
                    { label: 'Seatbelt Buzzer', options: ['On', 'Off'] },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">{item.label}</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-red-500/20">
                        {item.options.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-all">
                  Save Customizations
                </button>
              </div>
              <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-400" />
                  System Note
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  การปรับแต่งฟังก์ชันเหล่านี้เป็นการเปลี่ยนค่าใน ECU โดยตรง 
                  กรุณาตรวจสอบความต้องการของลูกค้าให้ชัดเจนก่อนดำเนินการ 
                  ค่าเดิมจะถูกสำรองไว้ในระบบ Backup อัตโนมัติ
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
