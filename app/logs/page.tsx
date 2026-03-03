'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { ShieldCheck, Clock, User, Info, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface Log {
  id: number;
  action: string;
  username: string;
  details: string;
  timestamp: string;
  ip_address: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN': return 'text-blue-600 bg-blue-50';
      case 'CREATE_CUSTOMER': return 'text-emerald-600 bg-emerald-50';
      case 'DELETE': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Audit Logs (Immutable)</h1>
            <p className="text-slate-500 text-sm mt-1">ประวัติการใช้งานระบบที่ไม่สามารถแก้ไขหรือลบได้</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="ค้นหา Log..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">User</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Action</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Details</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : logs.map((log) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={log.id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium">
                          {format(new Date(log.timestamp), 'dd MMM yyyy HH:mm:ss', { locale: th })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {log.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold">{log.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                        {log.details}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-400">{log.ip_address}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {!loading && logs.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">ไม่พบข้อมูล Log ในขณะนี้</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h4 className="font-bold text-blue-900">Security Note</h4>
            <p className="text-sm text-blue-700 mt-1">
              Logs เหล่านี้ถูกบันทึกโดยตรงลงในฐานข้อมูลผ่าน Gate Layer และไม่สามารถแก้ไขได้โดยผู้ใช้งานทั่วไป 
              ข้อมูลนี้ใช้สำหรับการตรวจสอบย้อนหลัง (Auditing) และความปลอดภัยของระบบ
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
