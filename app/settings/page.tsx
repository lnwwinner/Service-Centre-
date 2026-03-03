'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  Settings, 
  Database, 
  Download, 
  Upload, 
  Shield, 
  FileText, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleBackup = async () => {
    setLoading(true);
    // Simulate backup process
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSuccessMsg('Database backup created successfully. Download starting...');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configuration, Backup & Recovery, and Security Policies</p>
        </div>

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl mb-6 flex items-center gap-2 font-bold text-sm border border-emerald-100"
          >
            <CheckCircle2 className="w-5 h-5" />
            {successMsg}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Backup & Recovery */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Backup & Recovery
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-700">Full Database Backup</span>
                  <span className="text-xs text-slate-400">Last backup: 2 hours ago</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Creates a complete snapshot of customers, vehicles, and service history.</p>
                <button 
                  onClick={handleBackup}
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download Backup (.sql)
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-700">Restore from File</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Restore system state from a previous backup file. Warning: This will overwrite current data.</p>
                <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Select Backup File
                </button>
              </div>
            </div>
          </div>

          {/* System Configuration */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" />
                General Configuration
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><Shield className="w-4 h-4 text-slate-500" /></div>
                    <div>
                      <p className="font-bold text-sm">Security Policies (RBAC)</p>
                      <p className="text-xs text-slate-400">Manage roles and permissions</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600">Configure</span>
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><FileText className="w-4 h-4 text-slate-500" /></div>
                    <div>
                      <p className="font-bold text-sm">Audit Logs Retention</p>
                      <p className="text-xs text-slate-400">Set log archival period</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600">30 Days</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-lg">
              <h3 className="font-bold text-lg mb-2">System Info</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <p>Version: <span className="text-white">v1.2.0 (Stable)</span></p>
                <p>Environment: <span className="text-white">Production</span></p>
                <p>Database: <span className="text-white">SQLite (Encrypted)</span></p>
                <p>Gate Layer: <span className="text-emerald-400">Active</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
