'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Wifi, RefreshCw, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function AiDeviceOptimizer() {
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runOptimization = async () => {
    setOptimizing(true);
    try {
      // Simulate fetching logs
      const mockLogs = [
        { device: "Scanner A1", type: "BLUETOOTH", signal: -85, drops: 3, duration: 1200 },
        { device: "Scanner B2", type: "WIFI", signal: -60, drops: 0, duration: 3400 },
        { device: "Scanner C3", type: "USB", signal: 0, drops: 0, duration: 5000 },
      ];

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      const model = ai.models.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Analyze these OBD connection logs and suggest optimizations.
        Logs: ${JSON.stringify(mockLogs)}
        
        Provide:
        1. Best performing connection type.
        2. Specific device recommendations.
        3. Firmware update suggestions (simulate if needed).
        
        Format as JSON: { "bestConnection": string, "recommendations": string[], "firmwareUpdates": string[] }
      `;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      // Clean up markdown code blocks if present
      const jsonStr = text.replace(/```json|```/g, '').trim();
      setResult(JSON.parse(jsonStr));

      // Log action
      const session = document.cookie.split('; ').find(row => row.startsWith('user_session='));
      const userData = JSON.parse(decodeURIComponent(session?.split('=')[1] || '{}'));
      
      if (userData.id) {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.id,
            action: 'AI_DEVICE_OPTIMIZATION',
            details: 'Ran connection optimization analysis'
          })
        });
      }
    } catch (error) {
      console.error("Optimization failed", error);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Wifi className="w-32 h-32" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          AI Connection Optimizer
        </h3>
        <p className="text-indigo-200 mb-8 max-w-md">
          Analyze connection stability, detect interference, and recommend firmware updates for optimal OBD performance.
        </p>

        {!result ? (
          <button 
            onClick={runOptimization}
            disabled={optimizing}
            className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2"
          >
            {optimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
            Analyze Connections
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              Optimization Complete
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold">Best Connection</p>
                <p className="font-mono text-lg">{result.bestConnection}</p>
              </div>
              
              <div>
                <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold mb-1">Recommendations</p>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                  {result.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {result.firmwareUpdates.length > 0 && (
                <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30">
                  <p className="text-xs text-indigo-200 font-bold flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-3 h-3" /> Firmware Updates Available
                  </p>
                  <p className="text-xs text-slate-300">{result.firmwareUpdates.join(', ')}</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setResult(null)}
              className="mt-6 text-xs text-indigo-300 hover:text-white underline"
            >
              Run New Analysis
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
