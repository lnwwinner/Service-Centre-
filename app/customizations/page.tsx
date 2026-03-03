'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Settings, ToggleLeft, ToggleRight, Save } from 'lucide-react';

export default function CustomizationsPage() {
  const [settings, setSettings] = useState({
    autoLock: true,
    daytimeLights: true,
    ecoMode: false,
    laneAssist: true,
    parkingSensors: true,
    welcomeLight: false
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ปรับแต่งอุปกรณ์ (ECU Coding)</h1>
            <p className="text-slate-500 text-sm mt-1">ตั้งค่าฟังก์ชันพิเศษของรถยนต์ผ่านระบบ OBD</p>
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20">
            <Save className="w-4 h-4" />
            Flash ECU
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${value ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  <p className="text-xs text-slate-400">{value ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              <button onClick={() => toggle(key as keyof typeof settings)} className={`transition-colors ${value ? 'text-blue-600' : 'text-slate-300'}`}>
                {value ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
