'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { History, Search, FileText, Wrench, User, Calendar, DollarSign } from 'lucide-react';

interface ServiceRecord {
  id: number;
  license_plate: string;
  model: string;
  customer_name: string;
  description: string;
  mileage: number;
  cost: number;
  technician_name: string;
  service_date: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      });
  }, []);

  const filteredServices = services.filter(s => 
    s.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ประวัติการซ่อม (Service History)</h1>
            <p className="text-slate-500 text-sm mt-1">รายการซ่อมบำรุงและประวัติการรับบริการทั้งหมด</p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="ค้นหาทะเบียนรถ หรือ ชื่อลูกค้า..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Vehicle</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Service Details</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Technician</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading history...</td></tr>
                ) : filteredServices.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">No service records found</td></tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(service.service_date).toLocaleDateString('th-TH')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-900">{service.license_plate}</p>
                          <p className="text-xs text-slate-500">{service.model}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <User className="w-3 h-3" /> {service.customer_name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{service.description}</p>
                          <p className="text-xs text-slate-500 mt-1">Mileage: {service.mileage.toLocaleString()} km</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Wrench className="w-4 h-4 text-slate-400" />
                          {service.technician_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-slate-900">฿{service.cost.toLocaleString()}</span>
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
