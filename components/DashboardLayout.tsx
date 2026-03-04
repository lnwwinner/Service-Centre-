'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  History, 
  ShieldCheck, 
  MessageSquare, 
  LogOut,
  Settings,
  Activity,
  Calendar,
  ListOrdered,
  Package,
  Bell,
  Search,
  Menu,
  X,
  Cpu,
  Bot,
  TrendingUp
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  // ... (useEffect remains same)

  // ... (handleLogout remains same)

  // ... (loading check remains same)

  if (!user) return null;

  const menuItems = [
    { id: 'dashboard', label: 'แผงควบคุม', icon: LayoutDashboard, path: '/', roles: ['Admin', 'Staff'] },
    { id: 'appointments', label: 'นัดหมายลูกค้า', icon: Calendar, path: '/appointments', roles: ['Admin', 'Staff'] },
    { id: 'queue', label: 'คิวงานซ่อม', icon: ListOrdered, path: '/queue', roles: ['Admin', 'Staff'] },
    { id: 'inventory', label: 'คลังอะไหล่', icon: Package, path: '/inventory', roles: ['Admin', 'Staff'] },
    { id: 'customers', label: 'ลูกค้า', icon: Users, path: '/customers', roles: ['Admin', 'Staff'] },
    { id: 'vehicles', label: 'ข้อมูลรถยนต์', icon: Car, path: '/vehicles', roles: ['Admin', 'Staff'] },
    { id: 'diagnostics', label: 'วินิจฉัยระบบ', icon: Activity, path: '/diagnostics', roles: ['Admin', 'Staff'] },
    { id: 'obd', label: 'OBD Integration', icon: Cpu, path: '/obd', roles: ['Admin', 'Staff'] },
    { id: 'customizations', label: 'Device & Customization', icon: Settings, path: '/customizations', roles: ['Admin', 'Staff'] },
    { id: 'advisor', label: 'AI Advisor', icon: Bot, path: '/advisor', roles: ['Admin', 'Staff'] },
    { id: 'analytics', label: 'AI Analytics', icon: TrendingUp, path: '/analytics', roles: ['Admin'] },
    { id: 'services', label: 'ประวัติการซ่อม', icon: History, path: '/services', roles: ['Admin', 'Staff'] },
    { id: 'monitoring', label: 'Monitoring', icon: Activity, path: '/monitoring', roles: ['Admin'] },
    { id: 'logs', label: 'Audit Logs', icon: ShieldCheck, path: '/logs', roles: ['Admin', 'Auditor'] },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', roles: ['Admin'] },
    { id: 'feedback', label: 'คำติชม', icon: MessageSquare, path: '/feedback', roles: ['Admin', 'Staff'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-slate-900">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        <div className="h-20 flex items-center justify-center border-b border-slate-100 relative">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
              <span className="font-bold text-lg tracking-tight">Toyota Pro</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
          )}
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-400 hover:text-slate-600"
          >
            {isSidebarOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                router.pathname === item.path 
                  ? 'bg-red-50 text-red-600 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${router.pathname === item.path ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {isSidebarOpen && <span>{item.label}</span>}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.username}</p>
                <p className="text-xs text-slate-400 truncate">{user.role}</p>
              </div>
            )}
            {isSidebarOpen && (
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full max-w-xl">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาข้อมูลลูกค้า, ทะเบียนรถ, หรือรหัสอะไหล่..." 
              className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
