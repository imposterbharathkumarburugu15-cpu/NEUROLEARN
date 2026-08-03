import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { useAppStore } from '../../store/useAppStore';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function NexusAI() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, addToast } = useAppStore();
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setIsLoading(true);

    if (user?.id) {
      try {
        await addDoc(collection(db, 'ai_chats'), {
          userId: user.id,
          role: 'user',
          content: userMsg,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Failed to persist user chat:", err);
      }
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Server error generating AI response.');
      }

      const aiReply = data.reply || 'Sorry, I could not process that query.';
      setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);

      if (user?.id) {
        try {
          await addDoc(collection(db, 'ai_chats'), {
            userId: user.id,
            role: 'ai',
            content: aiReply,
            timestamp: new Date().toISOString()
          });
        } catch (err) {
          console.warn("Failed to persist AI chat:", err);
        }
      }
    } catch (error: any) {
      console.error(error);
      const errText = error.message ? `AI Error: ${error.message}` : 'Error connecting to Nexus AI. Please ensure GEMINI_API_KEY is configured in Settings.';
      setMessages(prev => [...prev, { role: 'ai', text: errText }]);
      addToast('Failed to reach Nexus AI', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text: string) => {
    setQuery(text);
  };

  return (
    <div className="relative z-10 px-4 md:px-10 max-w-7xl mx-auto flex flex-col items-center min-h-[calc(100vh-6rem)] justify-center pb-24 md:pb-12 pt-8 md:pt-0">
      {/* Background Shader */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)'
      }}></div>

      <div className="w-full flex flex-col items-center text-center space-y-8 fade-in-up z-10 relative">
        {messages.length === 0 ? (
          <>
            {/* Nexus Orb */}
            <div className="w-48 h-48 md:w-64 md:h-64 relative mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full shadow-[0_0_100px_rgba(124,58,237,0.3)] animate-pulse"></div>
              <motion.div 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-surface-container-lowest border border-white/10 flex items-center justify-center relative z-10 overflow-hidden"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.4),transparent_60%)]"></div>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(124,58,237,0.4),transparent_60%)]"></div>
              </motion.div>
            </div>

            {/* Greeting */}
            <h1 className="font-headline-h1-mobile md:font-headline-h1 font-bold tracking-tight">
              Hi {user?.name || 'Guest'} <span className="inline-block animate-[wave_2s_ease-in-out_infinite]">👋</span><br/>
              <span className="text-text-secondary mt-2 block font-headline-h2 text-2xl md:text-4xl">What would you like to master today?</span>
            </h1>
          </>
        ) : (
          <div className="w-full max-w-3xl flex-1 max-h-[60vh] overflow-y-auto space-y-6 text-left p-4 no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary-container text-white' : 'bg-secondary-container text-white'}`}>
                    {msg.role === 'user' ? (user?.name?.[0] || 'G').toUpperCase() : <span className="material-symbols-outlined text-sm">psychology</span>}
                 </div>
                 <div className={`p-4 rounded-[20px] max-w-[80%] ${msg.role === 'user' ? 'bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-white' : 'bg-[#0F172A] border border-white/10 text-slate-200'}`}>
                    <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                 </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-secondary-container text-white">
                    <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                 </div>
                 <div className="p-4 rounded-[20px] bg-surface-glass border border-border-glass text-text-secondary">
                    Processing your neural query...
                 </div>
              </div>
            )}
          </div>
        )}

        {/* Main Input */}
        <div className="w-full max-w-3xl glass-panel p-2 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-primary-container/50 focus-within:bg-white/5 mt-8">
          <div className="pl-4 text-text-secondary">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/50 py-4 font-body-lg focus:ring-0" 
            placeholder="Ask Nexus anything..." 
          />
          <div className="flex gap-2 pr-2">
            <button onClick={() => { addToast('Opening Image Upload...', 'info'); setQuery('Analyze image: '); }} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-text-secondary hover:text-primary" title="Attach Image">
              <span className="material-symbols-outlined">image</span>
            </button>
            <button 
              onClick={handleSend}
              disabled={isLoading || !query.trim()}
              className="p-3 rounded-full bg-gradient-to-r from-primary-container to-secondary-container text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              title="Send Message"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid (Hide when chatting) */}
      {messages.length === 0 && (
        <div className="w-full max-w-5xl mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 fade-in-up delay-100">
          <button onClick={() => handleQuickAction('Explain Electrostatics concepts in detail.')} className="glass-panel p-5 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group">
            <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">lightbulb</span>
            <span className="font-label-md">Explain Concept</span>
          </button>
          <button onClick={() => handleQuickAction('Generate a 5-question quiz on Physics.')} className="glass-panel p-5 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group">
            <span className="material-symbols-outlined text-secondary text-3xl group-hover:scale-110 transition-transform">quiz</span>
            <span className="font-label-md">Generate Quiz</span>
          </button>
          <button onClick={() => handleQuickAction('Solve this JEE Advanced integration problem.')} className="glass-panel p-5 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group">
            <span className="material-symbols-outlined text-tertiary text-3xl group-hover:scale-110 transition-transform">calculate</span>
            <span className="font-label-md">Solve Question</span>
          </button>
          <button onClick={() => handleQuickAction('Analyze my latest mock test score and suggest improvements.')} className="glass-panel p-5 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group">
            <span className="material-symbols-outlined text-primary-fixed text-3xl group-hover:scale-110 transition-transform">analytics</span>
            <span className="font-label-md">Analyze Mock</span>
          </button>
        </div>
      )}
      
    </div>
  );
}
