'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  Activity, 
  Users, 
  Car, 
  Wrench, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', jobs: 12, revenue: 45000 },
  { name: 'Tue', jobs: 18, revenue: 62000 },
  { name: 'Wed', jobs: 15, revenue: 51000 },
  { name: 'Thu', jobs: 22, revenue: 78000 },
  { name: 'Fri', jobs: 25, revenue: 85000 },
  { name: 'Sat', jobs: 30, revenue: 110000 },
  { name: 'Sun', jobs: 10, revenue: 35000 },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">ภาพรวมประสิทธิภาพศูนย์บริการประจำวันนี้</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm flex flex-col justify-between h-40">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Jobs</p>
              <h3 className="text-3xl font-bold mt-1">24</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm flex flex-col justify-between h-40">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-purple-50 rounded-2xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> +5%
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">New Customers</p>
              <h3 className="text-3xl font-bold mt-1">8</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm flex flex-col justify-between h-40">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-orange-50 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                <Activity className="w-3 h-3" /> Urgent
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Critical Alerts</p>
              <h3 className="text-3xl font-bold mt-1">3</h3>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-[28px] shadow-lg flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="relative z-10">
              <div className="p-3 bg-white/10 rounded-2xl w-fit mb-4">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Revenue</p>
                <h3 className="text-3xl font-bold mt-1">฿466K</h3>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10">
              <Activity className="w-32 h-32" />
            </div>
          </div>
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg">Weekly Performance</h3>
              <select className="bg-slate-50 border-none text-sm font-bold text-slate-500 rounded-xl px-4 py-2 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <Area type="monotone" dataKey="revenue" stroke="#DC2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { title: 'New Appointment', desc: 'Toyota Camry (1กข 8829)', time: '10m ago', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: 'Job Completed', desc: 'Brake Pad Replacement', time: '45m ago', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { title: 'Low Stock Alert', desc: 'Oil Filter (Toyota Genuine)', time: '2h ago', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
                { title: 'OBD Scan Connected', desc: 'Vgate iCar Pro - Bay 03', time: '3h ago', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${item.bg} shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
