'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ShieldCheck, Search, Clock, User, Activity, Filter } from 'lucide-react';

interface LogEntry {
  id: number;
  username: string;
  action: string;
  details: string;
  timestamp: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.details.toLowerCase().includes(filter.toLowerCase()) ||
    (log.username && log.username.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs (Immutable)</h1>
          <p className="text-slate-500 text-sm mt-1">บันทึกกิจกรรมระบบเพื่อความปลอดภัยและการตรวจสอบ</p>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter logs..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-slate-500/20 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200">
                <Filter className="w-3 h-3" />
                Last 100 Records
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-600">Live Logging Active</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left font-mono">
              <thead className="text-xs text-slate-500 uppercase bg-slate-900 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider w-48">Timestamp</th>
                  <th className="px-6 py-4 font-bold tracking-wider w-32">User</th>
                  <th className="px-6 py-4 font-bold tracking-wider w-48">Action</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400">Loading logs...</td></tr>
                ) : filteredLogs.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400">No logs found</td></tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3 text-slate-500 text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-2 font-bold text-slate-700">
                          <User className="w-3 h-3 text-slate-400" />
                          {log.username || 'System'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          log.action.includes('LOGIN') ? 'bg-emerald-100 text-emerald-700' :
                          log.action.includes('DELETE') ? 'bg-red-100 text-red-700' :
                          log.action.includes('UPDATE') ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-600 truncate max-w-md" title={log.details}>
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
