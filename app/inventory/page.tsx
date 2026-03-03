'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { Package, Search, Plus, AlertCircle, Tag, DollarSign, Archive } from 'lucide-react';

interface InventoryItem {
  id: number;
  part_name: string;
  sku: string;
  quantity: number;
  threshold: number;
  price: number;
  category: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [partName, setPartName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const fetchInventory = async () => {
    const res = await fetch('/api/inventory');
    setInventory(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = document.cookie.split('; ').find(row => row.startsWith('user_session='));
    const userData = JSON.parse(decodeURIComponent(session?.split('=')[1] || '{}'));

    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        part_name: partName,
        sku,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        category,
        userId: userData.id
      }),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchInventory();
      setPartName('');
      setSku('');
      setQuantity('');
      setPrice('');
      setCategory('');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">คลังอะไหล่</h1>
            <p className="text-slate-500 text-sm mt-1">จัดการสต็อกอะไหล่และอุปกรณ์</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-5 h-5" />
            เพิ่มอะไหล่ใหม่
          </button>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="ค้นหาชื่ออะไหล่ หรือ SKU..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> In Stock
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <div className="w-2 h-2 rounded-full bg-red-500"></div> Low Stock
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
            {loading ? (
              <p className="col-span-4 text-center text-slate-400">Loading inventory...</p>
            ) : inventory.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 p-6 rounded-[28px] hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-500">
                    <Package className="w-6 h-6" />
                  </div>
                  {item.quantity <= item.threshold && (
                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Low Stock
                    </span>
                  )}
                </div>
                
                <h3 className="font-bold text-lg mb-1 truncate" title={item.part_name}>{item.part_name}</h3>
                <p className="text-xs text-slate-400 font-mono mb-4">SKU: {item.sku}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1"><Archive className="w-3.5 h-3.5" /> Stock</span>
                    <span className={`font-bold ${item.quantity <= item.threshold ? 'text-red-600' : 'text-slate-900'}`}>{item.quantity} units</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Price</span>
                    <span className="font-bold text-slate-900">฿{item.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-1 rounded text-slate-500">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Inventory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-[32px] p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">เพิ่มสินค้าใหม่</h2>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">ชื่ออะไหล่</label>
                <input 
                  type="text" 
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">SKU</label>
                  <input 
                    type="text" 
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">หมวดหมู่</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  >
                    <option value="">เลือกหมวดหมู่...</option>
                    <option value="Engine">เครื่องยนต์</option>
                    <option value="Brake">เบรก</option>
                    <option value="Suspension">ช่วงล่าง</option>
                    <option value="Electrical">ไฟฟ้า</option>
                    <option value="Body">ตัวถัง</option>
                    <option value="Fluids">ของเหลว</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">จำนวน (Units)</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">ราคา (THB)</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-emerald-500/20"
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
                  className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  บันทึกสินค้า
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
