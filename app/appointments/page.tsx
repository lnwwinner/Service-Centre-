'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    setAppointments(data);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700';
      case 'PENDING': return 'bg-blue-100 text-blue-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'COMPLETED': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Appointment & Queue Management</h1>
            <p className="text-slate-500 text-sm mt-1">จัดการนัดหมายและคิวการเข้ารับบริการของลูกค้า</p>
          </div>
          <button className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20">
            <Plus className="w-4 h-4" /> สร้างนัดหมายใหม่
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อลูกค้า, ทะเบียนรถ, หรือรหัสนัดหมาย..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" /> ตัวกรอง
            </button>
            <button className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors">
              <CalendarIcon className="w-4 h-4" /> เลือกวันที่
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-bottom border-slate-100">
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Customer & Vehicle</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date & Time</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Service Type</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="w-8 h-8 border-2 border-slate-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-slate-400 font-medium">ไม่พบข้อมูลการนัดหมาย</td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                            {apt.customer_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{apt.customer_name}</p>
                            <p className="text-xs text-slate-400 font-mono">{apt.license_plate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <CalendarIcon className="w-3 h-3 text-slate-400" />
                            {apt.appointment_date}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {apt.time_slot}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-sm font-medium">{apt.service_type}</span>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-red-600">
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400">
                            <MoreVertical className="w-4 h-4" />
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[28px] border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">นัดหมายวันนี้</p>
              <p className="text-xl font-bold">12 รายการ</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[28px] border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ยืนยันแล้ว</p>
              <p className="text-xl font-bold">8 รายการ</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[28px] border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">รอดำเนินการ</p>
              <p className="text-xl font-bold">4 รายการ</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
