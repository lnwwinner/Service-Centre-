'use client';
import DashboardLayout from '@/components/DashboardLayout';
import { MessageSquare, Star } from 'lucide-react';

export default function FeedbackPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">คำติชมลูกค้า</h1>
          <p className="text-slate-500 text-sm mt-1">คะแนนความพึงพอใจและข้อเสนอแนะ</p>
        </div>

        <div className="bg-white p-10 rounded-[32px] border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">ยังไม่มีคำติชม</h3>
          <p className="text-slate-500 mt-2">ข้อมูลจะปรากฏเมื่อลูกค้าทำแบบประเมินหลังการบริการ</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
