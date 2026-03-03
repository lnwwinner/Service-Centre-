'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { ListOrdered, Car, User, Clock, CheckCircle2, PlayCircle, PauseCircle, Plus } from 'lucide-react';

interface QueueItem {
  id: number;
  license_plate: string;
  model: string;
  service_type: string;
  status: string;
  bay_id: string;
  technician_name: string;
  start_time: string;
}

interface Vehicle {
  id: number;
  license_plate: string;
  model: string;
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [vehicleId, setVehicleId] = useState('');
  const [bayId, setBayId] = useState('');
  const [technician, setTechnician] = useState('');

  const fetchData = async () => {
    const [queueRes, vehRes] = await Promise.all([
      fetch('/api/queue'),
      fetch('/api/vehicles')
    ]);
    setQueue(await queueRes.json());
    setVehicles(await vehRes.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const session = document.cookie.split('; ').find(row => row.startsWith('user_session='));
    const userData = JSON.parse(decodeURIComponent(session?.split('=')[1] || '{}'));

    await fetch('/api/queue', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus, userId: userData.id }),
    });
    fetchData();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = document.cookie.split('; ').find(row => row.startsWith('user_session='));
    const userData = JSON.parse(decodeURIComponent(session?.split('=')[1] || '{}'));

    const res = await fetch('/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicle_id: parseInt(vehicleId),
        bay_id: bayId,
        technician_name: technician,
        userId: userData.id
      }),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchData();
      setVehicleId('');
      setBayId('');
      setTechnician('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING': return 'bg-slate-100 text-slate-500';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-600';
      case 'TESTING': return 'bg-yellow-100 text-yellow-600';
      case 'READY': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">คิวงานซ่อม</h1>
            <p className="text-slate-500 text-sm mt-1">ติดตามสถานะงานซ่อมในแต่ละช่องบริการ (Bay)</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
          >
            <Plus className="w-5 h-5" />
            เพิ่มงานเข้าคิว
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {['WAITING', 'IN_PROGRESS', 'TESTING'].map((status) => (
            <div key={status} className="bg-slate-50 p-4 rounded-[32px] border border-slate-200">
              <h3 className="font-bold text-slate-500 mb-4 px-2 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  status === 'WAITING' ? 'bg-slate-400' : 
                  status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-yellow-500'
                }`}></div>
                {status}
              </h3>
              <div className="space-y-4">
                {queue.filter(item => item.status === status).map((item) => (
                  <motion.div 
                    layoutId={`card-${item.id}`}
                    key={item.id} 
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">Bay {item.bay_id}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {status === 'WAITING' && (
                          <button onClick={() => handleStatusChange(item.id, 'IN_PROGRESS')} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><PlayCircle className="w-4 h-4" /></button>
                        )}
                        {status === 'IN_PROGRESS' && (
                          <button onClick={() => handleStatusChange(item.id, 'TESTING')} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"><Clock className="w-4 h-4" /></button>
                        )}
                        {status === 'TESTING' && (
                          <button onClick={() => handleStatusChange(item.id, 'READY')} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><CheckCircle2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900">{item.license_plate}</h4>
                    <p className="text-xs text-slate-500 mb-2">{item.model}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-50 pt-2">
                      <User className="w-3 h-3" /> {item.technician_name}
                    </div>
                  </motion.div>
                ))}
                {queue.filter(item => item.status === status).length === 0 && (
                  <div className="text-center py-8 text-slate-300 text-sm italic">No jobs</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-[32px] p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">เพิ่มงานเข้าคิว</h2>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">รถยนต์ (Vehicle)</label>
                <select 
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-purple-500/20"
                  required
                >
                  <option value="">เลือกรถยนต์...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.model} ({v.license_plate})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">ช่องบริการ (Bay)</label>
                  <input 
                    type="text" 
                    value={bayId}
                    onChange={(e) => setBayId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Bay 01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">ช่างผู้รับผิดชอบ</label>
                  <input 
                    type="text" 
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="ชื่อช่าง"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
                >
                  ยืนยัน
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
