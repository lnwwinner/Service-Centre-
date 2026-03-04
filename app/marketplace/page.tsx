'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Star, 
  Download, 
  ShieldCheck, 
  Zap, 
  Palette, 
  Lock,
  Search,
  Filter
} from 'lucide-react';

const marketplaceItems = [
  {
    id: 1,
    name: 'Dynamic Ambient Lighting Pro',
    category: 'Customization',
    price: '฿1,200',
    rating: 4.9,
    downloads: '2.4k',
    icon: Palette,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    description: 'Unlock 64-color dynamic ambient lighting with rhythm sync.'
  },
  {
    id: 2,
    name: 'Performance Stage 1 Tune',
    category: 'Engine',
    price: '฿4,500',
    rating: 4.8,
    downloads: '1.1k',
    icon: Zap,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    description: 'Optimize fuel mapping and throttle response for better torque.'
  },
  {
    id: 3,
    name: 'Smart Security Pack',
    category: 'Security',
    price: '฿800',
    rating: 5.0,
    downloads: '3.8k',
    icon: ShieldCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    description: 'Enhanced immobilizer features and remote tracking alerts.'
  },
  {
    id: 4,
    name: 'Auto-Lock Comfort Entry',
    category: 'Comfort',
    price: '฿500',
    rating: 4.7,
    downloads: '5.2k',
    icon: Lock,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    description: 'Automatically lock/unlock doors based on proximity.'
  }
];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customization Marketplace</h1>
            <p className="text-slate-500 text-sm mt-1">Unlock premium features and digital upgrades for your vehicle</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search upgrades..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketplaceItems.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col group"
            >
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color} w-fit mb-6`}>
                <item.icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.category}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">{item.rating}</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{item.description}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="text-lg font-bold text-slate-900">{item.price}</div>
                <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Banner */}
        <div className="bg-slate-900 rounded-[40px] p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <div className="flex items-center gap-2 text-indigo-400 mb-4">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Featured Upgrade</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">AI Smart Driving Assistant</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Upgrade your vehicle with the latest AI-powered driving assistance. 
              Includes lane departure warnings, traffic sign recognition, and adaptive cruise optimization.
            </p>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-xl">
              Learn More & Install
            </button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-indigo-500/20 to-transparent"></div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full"></div>
        </div>
      </div>
    </DashboardLayout>
  );
}
