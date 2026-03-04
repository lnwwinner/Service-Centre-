'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { Send, Bot, User, Sparkles, Car, History, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  audioUrl?: string;
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your AI Service Advisor. I am analyzing your vehicle data for proactive maintenance...', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Proactive Analysis on Load
  useEffect(() => {
    const runProactiveAnalysis = async () => {
      try {
        const [vRes, sRes] = await Promise.all([
          fetch('/api/vehicles'),
          fetch('/api/services')
        ]);
        const vehicles = await vRes.json();
        const services = await sRes.json();

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) throw new Error("API Key not found");

        const ai = new GoogleGenAI({ apiKey });
        const model = ai.models.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

        const prompt = `
          You are an expert automotive service advisor. 
          Analyze the following vehicle and service history data to provide proactive maintenance reminders.
          
          Vehicles: ${JSON.stringify(vehicles)}
          Service History: ${JSON.stringify(services)}
          
          Provide a concise, friendly summary of upcoming needs or potential risks. 
          Focus on things like oil changes, brake inspections, or tire rotations based on the last service date and mileage.
          If no data is available, just give general maintenance tips.
          
          Keep it under 100 words.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text;

        setMessages([{ 
          role: 'model', 
          text: responseText || "I've analyzed your data. You're all set for now, but don't forget to check your tire pressure!", 
          timestamp: new Date() 
        }]);
      } catch (error) {
        console.error("Proactive Analysis Error:", error);
        setMessages([{ role: 'model', text: "Hello! I'm ready to help. How can I assist you with your vehicle today?", timestamp: new Date() }]);
      }
    };

    runProactiveAnalysis();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      const model = ai.models.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(input);
      const responseText = result.response.text;

      setMessages(prev => [...prev, { role: 'model', text: responseText || "I'm not sure how to answer that. Could you rephrase?", timestamp: new Date() }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the service network. Please try again.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const speakMessage = async (text: string, index: number) => {
    if (isSpeaking === index) {
      audioRef.current?.pause();
      setIsSpeaking(null);
      return;
    }

    setIsSpeaking(index);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioUrl = `data:audio/wav;base64,${base64Audio}`;
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          audioRef.current.onended = () => setIsSpeaking(null);
        }
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Customer Advisor</h1>
              <p className="text-slate-500 text-xs">Virtual Assistant & Personalized Service Plans</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-indigo-600">
              <History className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-indigo-600">
              <Car className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8F9FA]">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
                msg.role === 'user' 
                  ? 'bg-white text-slate-800 rounded-tr-none' 
                  : 'bg-indigo-50 text-indigo-900 rounded-tl-none border border-indigo-100'
              }`}>
                {msg.text}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] opacity-50">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {msg.role === 'model' && (
                    <button 
                      onClick={() => speakMessage(msg.text, idx)}
                      className="p-1 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600"
                    >
                      {isSpeaking === idx ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl rounded-tl-none border border-indigo-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about maintenance, service plans, or vehicle issues..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-14 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </DashboardLayout>
  );
}

