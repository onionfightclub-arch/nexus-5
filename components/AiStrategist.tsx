
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService.ts';
import { ChatMessage } from '../types.ts';
import { Bot, Send, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AiStrategist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "I'm Nexus Alpha. Need a strategic edge for your brand?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const advice = await geminiService.getMarketingAdvice(input);
    setMessages(prev => [...prev, { role: 'assistant', content: advice }]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 bg-white text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center gap-2 group"
        aria-label="Open AI Strategist"
      >
        <MessageSquare size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-semibold hidden md:inline-block ml-2">AI Strategist</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 md:bottom-28 right-4 md:right-8 z-50 w-[calc(100%-2rem)] md:w-full max-w-[400px] h-[70vh] md:h-[500px] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-lg"
          >
            <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">Nexus Alpha</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 p-2"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600' : 'bg-white/10'}`}>{m.content}</div>
                </div>
              ))}
              {isLoading && <div className="text-xs text-white/30 italic">Nexus Alpha is thinking...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about strategy..." className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none" />
              <button onClick={handleSend} disabled={isLoading} className="bg-indigo-600 p-2 rounded-full"><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
