'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  History,
  Tag,
  Layers
} from 'lucide-react';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const res = await fetch('/api/inventory');
    const data = await res.json();
    setInventory(data);
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventory & Spare Parts</h1>
            <p className="text-slate-500 text-sm mt-1">จัดการสต็อกอะไหล่และวัสดุอุปกรณ์แบบเรียลไทม์</p>
          </div>
          <button className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20">
            <Plus className="w-4 h-4" /> เพิ่มอะไหล่ใหม่
          </button>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 text-white p-6 rounded-[32px] relative overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Items</p>
            <p className="text-3xl font-bold">1,284</p>
            <Package className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Low Stock Alerts</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-orange-600">12</p>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Out of Stock</p>
            <p className="text-3xl font-bold text-red-600">3</p>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Inventory Value</p>
            <p className="text-xl font-bold">฿1.4M</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่ออะไหล่, SKU, หรือหมวดหมู่..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
              <Tag className="w-4 h-4" /> หมวดหมู่
            </button>
            <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
              <History className="w-4 h-4" /> ประวัติการรับเข้า
            </button>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : inventory.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400 font-medium">ไม่พบข้อมูลอะไหล่ในคลัง</div>
          ) : (
            inventory.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                    <Layers className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    item.quantity <= item.threshold ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.quantity <= item.threshold ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1">{item.part_name}</h3>
                <p className="text-xs text-slate-400 font-mono uppercase mb-4">{item.sku}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Quantity</p>
                    <p className="text-xl font-bold">{item.quantity}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Price</p>
                    <p className="text-xl font-bold">฿{item.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <ArrowUpRight className="w-3 h-3" /> รับเข้า
                  </button>
                  <button className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <ArrowDownRight className="w-3 h-3" /> เบิกจ่าย
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
