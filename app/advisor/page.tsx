'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { Send, Bot, User, Sparkles, Car, History } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your AI Service Advisor. How can I assist you with your vehicle today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const model = ai.models.getGenerativeModel({ model: "gemini-2.5-flash" });

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
      const responseText = result.response.text();

      setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: new Date() }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the service network. Please try again.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
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
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-white text-slate-800 rounded-tr-none' 
                  : 'bg-indigo-50 text-indigo-900 rounded-tl-none border border-indigo-100'
              }`}>
                {msg.text}
                <p className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
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
    </DashboardLayout>
  );
}
