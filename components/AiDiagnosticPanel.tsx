'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, X, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AiDiagnosticPanelProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosticData: any;
  vehicleInfo: any;
}

export default function AiDiagnosticPanel({ isOpen, onClose, diagnosticData, vehicleInfo }: AiDiagnosticPanelProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runAiAnalysis = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      const model = ai.models.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are an expert automotive diagnostic AI. Analyze the following vehicle data and provide a detailed report.
        
        Vehicle: ${JSON.stringify(vehicleInfo)}
        Diagnostic Scan Results: ${JSON.stringify(diagnosticData)}
        
        Please provide:
        1. A plain-language explanation of the issues.
        2. Potential root causes (ranked by probability).
        3. Recommended repair steps.
        4. Proactive maintenance suggestions based on this data.
        5. Estimated urgency (Low/Medium/High).
        
        Format the output as Markdown.
      `;

      const result = await model.generateContent(prompt);
      const analysisText = result.response.text();
      setAnalysis(analysisText);

      // Log action
      const session = document.cookie.split('; ').find(row => row.startsWith('user_session='));
      const userData = JSON.parse(decodeURIComponent(session?.split('=')[1] || '{}'));
      
      if (userData.id) {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.id,
            action: 'AI_DIAGNOSTIC_ANALYSIS',
            details: `Analyzed vehicle ${vehicleInfo?.license_plate}`
          })
        });
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setAnalysis("Failed to generate AI analysis. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">AI Diagnostic Engine</h2>
              <p className="text-slate-500 text-sm">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {!analysis && !loading && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Analyze</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              The AI will analyze the DTC codes, sensor data, and vehicle history to provide expert insights and repair recommendations.
            </p>
            <button 
              onClick={runAiAnalysis}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              Start AI Analysis
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-lg font-bold text-indigo-900 animate-pulse">Analyzing Vehicle Data...</h3>
            <p className="text-slate-500 text-sm mt-2">Consulting knowledge base and service manuals</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div className="prose prose-slate prose-sm max-w-none bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {/* Simple Markdown rendering replacement since we might not have a markdown component installed/configured perfectly yet */}
              <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                {analysis}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                Print Report
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
