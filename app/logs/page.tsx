'use client';
import DashboardLayout from '@/components/DashboardLayout';
import { ShieldCheck, Lock } from 'lucide-react';

export default function LogsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-slate-500 text-sm mt-1">บันทึกกิจกรรมระบบเพื่อความปลอดภัย (Immutable Logs)</p>
        </div>

        <div className="bg-slate-900 text-emerald-400 p-8 rounded-[32px] font-mono text-xs overflow-hidden relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <div className="space-y-2 mt-4">
            <p>[SYSTEM] Audit Log Service Initialized...</p>
            <p>[AUTH] User 'admin' logged in via IP 127.0.0.1</p>
            <p>[DB] Schema validation passed</p>
            <p className="animate-pulse">_</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
