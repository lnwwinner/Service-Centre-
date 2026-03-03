'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, Car, Plus, CheckCircle2, XCircle } from 'lucide-react';

interface Appointment {
  id: number;
  customer_name: string;
  license_plate: string;
  model: string;
  appointment_date: string;
  time_slot: string;
  service_type: string;
  status: string;
}

interface Customer {
  id: number;
  name: string;
}

interface Vehicle {
  id: number;
  license_plate: string;
  model: string;
  customer_id: number;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [notes, setNotes] = useState('');

  const fetchData = async () => {
    const [apptRes, custRes, vehRes] = await Promise.all([
      fetch('/api/appointments'),
      fetch('/api/customers'),
      fetch('/api/vehicles')
    ]);
    
    setAppointments(await apptRes.json());
    setCustomers(await custRes.json());
    setVehicles(await vehRes.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredVehicles = vehicles.filter(v => v.customer_id === parseInt(customerId));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = document.cookie.split('; ').find(row => row.startsWith('user_session='));
    const userData = JSON.parse(decodeURIComponent(session?.split('=')[1] || '{}'));

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: parseInt(customerId),
        vehicle_id: parseInt(vehicleId),
        date,
        time,
        service_type: serviceType,
        notes,
        userId: userData.id
      }),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchData();
      // Reset
      setCustomerId('');
      setVehicleId('');
      setDate('');
      setTime('');
      setServiceType('');
      setNotes('');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">นัดหมายลูกค้า</h1>
            <p className="text-slate-500 text-sm mt-1">จัดการตารางนัดหมายและคิวบริการล่วงหน้า</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" />
            สร้างนัดหมายใหม่
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View Placeholder */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm min-h-[400px]">
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-lg flex items-center gap-2">
                 <CalendarIcon className="w-5 h-5 text-blue-600" />
                 Upcoming Schedule
               </h3>
               <div className="flex gap-2">
                 <button className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">Day</button>
                 <button className="px-3 py-1 bg-blue-50 rounded-lg text-xs font-bold text-blue-600">Week</button>
                 <button className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">Month</button>
               </div>
             </div>
             
             <div className="space-y-4">
               {loading ? (
                 <p className="text-center text-slate-400 py-10">Loading schedule...</p>
               ) : appointments.length === 0 ? (
                 <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                   <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                   <p className="text-slate-500 font-medium">No appointments scheduled</p>
                 </div>
               ) : (
                 appointments.map((appt) => (
                   <div key={appt.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group cursor-pointer">
                     <div className="flex flex-col items-center justify-center bg-white w-16 h-16 rounded-xl border border-slate-200 shadow-sm shrink-0">
                       <span className="text-xs font-bold text-slate-400 uppercase">{new Date(appt.appointment_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                       <span className="text-xl font-bold text-slate-900">{new Date(appt.appointment_date).getDate()}</span>
                     </div>
                     <div className="flex-1">
                       <div className="flex justify-between items-start">
                         <h4 className="font-bold text-slate-900">{appt.service_type}</h4>
                         <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                           appt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-600' : 
                           appt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'
                         }`}>
                           {appt.status}
                         </span>
                       </div>
                       <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                         <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {appt.time_slot}</span>
                         <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {appt.customer_name}</span>
                         <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" /> {appt.license_plate}</span>
                       </div>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-blue-600 text-white p-6 rounded-[32px] shadow-lg shadow-blue-600/20 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Today's Appointments</p>
                <h3 className="text-4xl font-bold mt-2">{appointments.filter(a => new Date(a.appointment_date).toDateString() === new Date().toDateString()).length}</h3>
                <div className="mt-4 flex gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">3 Pending</span>
                  <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">2 Confirmed</span>
                </div>
              </div>
              <CalendarIcon className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-[32px] p-10 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">สร้างนัดหมายใหม่</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">ลูกค้า (Customer)</label>
                <select 
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">เลือกลูกค้า...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">รถยนต์ (Vehicle)</label>
                <select 
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                  disabled={!customerId}
                >
                  <option value="">เลือกรถยนต์...</option>
                  {filteredVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.model} ({v.license_plate})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">วันที่</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">เวลา</label>
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">ประเภทบริการ</label>
                <select 
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">เลือกบริการ...</option>
                  <option value="General Service">เช็คระยะทั่วไป</option>
                  <option value="Oil Change">เปลี่ยนถ่ายน้ำมันเครื่อง</option>
                  <option value="Brake Service">ระบบเบรก</option>
                  <option value="Engine Diagnostic">ตรวจเช็คเครื่องยนต์</option>
                  <option value="Tire Service">ยางและช่วงล่าง</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">หมายเหตุ</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 h-24 resize-none"
                  placeholder="รายละเอียดเพิ่มเติม..."
                />
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
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  ยืนยันนัดหมาย
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
