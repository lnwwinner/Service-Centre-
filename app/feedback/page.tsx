'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MessageSquare, Star, User, Plus, Quote } from 'lucide-react';
import { motion } from 'motion/react';

interface Feedback {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Customer {
  id: number;
  name: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [customerId, setCustomerId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchData = useCallback(async () => {
    const [feedRes, custRes] = await Promise.all([
      fetch('/api/feedback'),
      fetch('/api/customers')
    ]);
    setFeedbacks(await feedRes.json());
    setCustomers(await custRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = document.cookie.split('; ').find(row => row.startsWith('user_session='));
    const userData = JSON.parse(decodeURIComponent(session?.split('=')[1] || '{}'));

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: parseInt(customerId),
        rating,
        comment,
        userId: userData.id
      }),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchData();
      setCustomerId('');
      setRating(5);
      setComment('');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">คำติชมลูกค้า (Feedback)</h1>
            <p className="text-slate-500 text-sm mt-1">คะแนนความพึงพอใจและข้อเสนอแนะเพื่อการปรับปรุง</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20"
          >
            <Plus className="w-5 h-5" />
            บันทึกคำติชม
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="col-span-3 text-center text-slate-400">Loading feedback...</p>
          ) : feedbacks.length === 0 ? (
            <div className="col-span-3 text-center py-10 bg-white rounded-[32px] border border-slate-200">
              <Star className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">ยังไม่มีข้อมูลคำติชม</p>
            </div>
          ) : (
            feedbacks.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm relative overflow-hidden">
                <Quote className="absolute top-4 right-4 w-10 h-10 text-slate-100 rotate-180" />
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400">({item.rating}/5)</span>
                </div>
                <p className="text-slate-600 text-sm mb-6 relative z-10">&quot;{item.comment}&quot;</p>
                <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.customer_name || 'Anonymous'}</p>
                    <p className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-[32px] p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">บันทึกคำติชม</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">ลูกค้า</label>
                <select 
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-yellow-500/20"
                >
                  <option value="">ไม่ระบุ (Anonymous)</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">คะแนน (Rating)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl transition-all ${rating >= star ? 'text-yellow-400 bg-yellow-50' : 'text-slate-300 bg-slate-50'}`}
                    >
                      <Star className={`w-8 h-8 ${rating >= star ? 'fill-yellow-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">ข้อเสนอแนะ</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-yellow-500/20 h-32 resize-none"
                  placeholder="รายละเอียด..."
                  required
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
                  className="flex-1 py-4 bg-yellow-500 text-white font-bold rounded-2xl hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
