'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  ListOrdered, 
  Play, 
  CheckCircle2, 
  Clock, 
  User, 
  Car, 
  Wrench,
  ChevronRight,
  LayoutGrid,
  LayoutList
} from 'lucide-react';

export default function QueuePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchQueue = async () => {
    const res = await fetch('/api/queue');
    const data = await res.json();
    setQueue(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-blue-600 text-white';
      case 'TESTING': return 'bg-purple-600 text-white';
      case 'READY': return 'bg-emerald-600 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workshop Management System</h1>
            <p className="text-slate-500 text-sm mt-1">ติดตามสถานะงานซ่อมและจัดการช่องซ่อม (Bay Allocation)</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-red-600' : 'text-slate-400'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-red-600' : 'text-slate-400'}`}
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workshop Bays Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Bay 01', 'Bay 02', 'Bay 03', 'Bay 04', 'Bay 05', 'Bay 06', 'Bay 07', 'Bay 08'].map((bay) => {
            const job = queue.find(q => q.bay_id === bay);
            return (
              <div key={bay} className={`p-6 rounded-[32px] border transition-all ${
                job ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{bay}</span>
                  {job && (
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  )}
                </div>
                
                {job ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{job.license_plate}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{job.service_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-3 h-3" />
                      <span>ช่าง: {job.technician_name}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>45m</span>
                      </div>
                      <button className="text-red-600 hover:text-red-700 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center justify-center text-slate-300">
                    <Wrench className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold uppercase tracking-widest">Available</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Job Queue Table */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-lg">รายการงานซ่อมทั้งหมด</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest">In Progress: 3</span>
              <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest">Waiting: 5</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-bottom border-slate-100">
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Job ID</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehicle</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Technician</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Timeline</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <div className="w-8 h-8 border-2 border-slate-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : queue.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-slate-400 font-medium">ไม่มีงานซ่อมในคิว</td>
                  </tr>
                ) : (
                  queue.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6">
                        <span className="font-mono text-xs font-bold text-slate-400">#JOB-{job.id.toString().padStart(4, '0')}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Car className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{job.license_plate}</p>
                            <p className="text-[10px] text-slate-400 uppercase">{job.service_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-[10px] font-bold text-red-600">
                            {job.technician_name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">{job.technician_name}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-600 w-2/3"></div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Started: {new Date(job.start_time).toLocaleTimeString()}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-blue-600">
                            <Play className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
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
