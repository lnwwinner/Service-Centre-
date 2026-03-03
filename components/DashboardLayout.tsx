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
  Bell,
  Search,
  Menu,
  X
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser(data.user);
            setLoading(false);
            return;
          }
        }
        router.push('/login');
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { id: 'dashboard', label: 'แผงควบคุม', icon: LayoutDashboard, path: '/', roles: ['Admin', 'Staff'] },
    { id: 'customers', label: 'ลูกค้า', icon: Users, path: '/customers', roles: ['Admin', 'Staff'] },
    { id: 'vehicles', label: 'ข้อมูลรถยนต์', icon: Car, path: '/vehicles', roles: ['Admin', 'Staff'] },
    { id: 'diagnostics', label: 'วินิจฉัยระบบ', icon: Activity, path: '/diagnostics', roles: ['Admin', 'Staff'] },
    { id: 'customizations', label: 'ปรับแต่งอุปกรณ์', icon: Settings, path: '/customizations', roles: ['Admin', 'Staff'] },
    { id: 'services', label: 'ประวัติการซ่อม', icon: History, path: '/services', roles: ['Admin', 'Staff'] },
    { id: 'logs', label: 'Audit Logs', icon: ShieldCheck, path: '/logs', roles: ['Admin', 'Auditor'] },
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
        <div className="p-6 flex items-center gap-3 border-bottom border-slate-100">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">TDP Pro</span>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <item.icon className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium text-sm">ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="ค้นหาข้อมูล..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user.username}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
