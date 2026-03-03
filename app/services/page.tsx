'use client';
import DashboardLayout from '@/components/DashboardLayout';
import { History, Wrench } from 'lucide-react';

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ประวัติการซ่อม</h1>
          <p className="text-slate-500 text-sm mt-1">ประวัติการเข้ารับบริการทั้งหมด</p>
        </div>
        
        <div className="bg-white p-10 rounded-[32px] border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">ยังไม่มีประวัติการซ่อม</h3>
          <p className="text-slate-500 mt-2">ประวัติจะปรากฏเมื่อมีการปิดงานซ่อมเสร็จสิ้น</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
