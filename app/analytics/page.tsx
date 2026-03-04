'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, Package, Sparkles, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  
  // Mock Data for Visualization
  const data = [
    { name: 'Mon', services: 12, revenue: 2400 },
    { name: 'Tue', services: 19, revenue: 3800 },
    { name: 'Wed', services: 15, revenue: 3000 },
    { name: 'Thu', services: 22, revenue: 4400 },
    { name: 'Fri', services: 28, revenue: 5600 },
    { name: 'Sat', services: 35, revenue: 7000 },
    { name: 'Sun', services: 10, revenue: 2000 },
  ];

  const generateInsights = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      const model = ai.models.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Analyze this automotive service center data and provide strategic insights.
        Data: ${JSON.stringify(data)}
        
        Provide:
        1. Revenue trends and peak days.
        2. Staffing recommendations based on volume.
        3. Predicted parts usage (tires, oil, filters) based on volume.
        4. Customer behavior analysis.
        
        Format as Markdown.
      `;

      const result = await model.generateContent(prompt);
      setInsights(result.response.text());

      // Log action
      const session = document.cookie.split('; ').find(row => row.startsWith('user_session='));
      const userData = JSON.parse(decodeURIComponent(session?.split('=')[1] || '{}'));
      
      if (userData.id) {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.id,
            action: 'AI_ANALYTICS_GENERATION',
            details: 'Generated business insights'
          })
        });
      }
    } catch (error) {
      console.error("Analytics failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Analytics & Insights</h1>
            <p className="text-slate-500 text-sm mt-1">Predictive analysis for business growth</p>
          </div>
          <button 
            onClick={generateInsights}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate AI Insights
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Weekly Revenue
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Service Volume
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="services" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        {insights && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 p-8 rounded-[32px] border border-indigo-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-900">Strategic AI Analysis</h2>
                <p className="text-indigo-600/70 text-sm">Generated by Gemini 2.5 Flash</p>
              </div>
            </div>
            
            <div className="prose prose-indigo max-w-none">
              <div className="whitespace-pre-wrap font-sans text-indigo-900 leading-relaxed">
                {insights}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
