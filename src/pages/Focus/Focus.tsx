import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Settings, Brain, Zap, Maximize, Activity, LineChart, Target, Calendar, MoreHorizontal } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { db } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';

export default function Focus() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(1965); // 32:45
  const { user, addToast } = useAppStore();

  useEffect(() => {
    let interval: any = null;
    if (isPlaying && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isPlaying) {
      setIsPlaying(false);
      addToast('Focus session complete! Excellent work!', 'success');
      logFocusSession(25, 'Advanced Neural Networks');
    }
    return () => clearInterval(interval);
  }, [isPlaying, secondsLeft]);

  const logFocusSession = async (durationMinutes: number, topic: string) => {
    if (user?.id) {
      try {
        await addDoc(collection(db, 'focus_sessions'), {
          userId: user.id,
          topic,
          durationMinutes,
          timestamp: new Date().toISOString()
        });

        await updateDoc(doc(db, 'users', user.id), {
          studyHours: increment(durationMinutes / 60)
        }).catch(() => {});
      } catch (e) {
        console.error("Error logging focus session:", e);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      addToast('Focus session started', 'success');
    } else {
      addToast('Focus session paused', 'info');
      logFocusSession(Math.max(1, Math.round((1965 - secondsLeft) / 60)), 'Advanced Neural Networks');
    }
  };

  const handleSkip = () => {
    setSecondsLeft(1500); // 25 mins
    addToast('Session skipped to next interval', 'info');
  };

  const handleExtend = () => {
    setSecondsLeft(prev => prev + 300);
    addToast('Session extended by 5 minutes', 'success');
  };

  const handleSettings = () => {
    addToast('Opening focus settings...', 'info');
  };

  const handleMaximize = () => {
    addToast('Entering full screen mode...', 'info');
  };

  const handlePrepare = () => {
    addToast('Preparing for mock test...', 'success');
  };

  const handleReview = () => {
    addToast('Review materials loaded', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 pb-24 h-full flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-6 h-6 text-[#8B5CF6]" />
            <span className="text-[#8B5CF6] font-bold tracking-wide">Mission Planner AI</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Focus & Insights</h1>
          <p className="text-[#94A3B8] text-sm md:text-base font-medium">AI-powered student operating system - Immersive Tracking View</p>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 bg-[#0F172A]/80 border border-white/5 rounded-2xl backdrop-blur-md">
          <button className="px-5 py-2 text-[13px] font-bold text-[#22D3EE] bg-[#22D3EE]/10 rounded-xl" onClick={() => addToast('Switched to Day view', 'info')}>DAY</button>
          <button className="px-5 py-2 text-[13px] font-medium text-[#94A3B8] hover:text-white transition-colors" onClick={() => addToast('Switched to Week view', 'info')}>WEEK</button>
          <button className="px-5 py-2 text-[13px] font-medium text-[#94A3B8] hover:text-white transition-colors" onClick={() => addToast('Switched to Month view', 'info')}>MONTH</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Column: Focus Session */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#0F172A]/40 border border-white/5 rounded-[32px] p-8 relative overflow-hidden backdrop-blur-sm min-h-[500px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[400px] max-h-[400px] bg-[#3B82F6]/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <h2 className="text-[#94A3B8] text-[13px] font-bold tracking-[0.2em] uppercase mb-12 relative z-10">Focus Session</h2>
          
          {/* Circular Timer Display */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-12 flex items-center justify-center">
            {/* Outer Progress Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <circle cx="50" cy="50" r="46" fill="none" stroke="#22D3EE" strokeWidth="4" strokeDasharray="289" strokeDashoffset="80" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              {/* Tick marks */}
              {Array.from({ length: 24 }).map((_, i) => (
                <line key={i} x1="50" y1="2" x2="50" y2="6" stroke={i < 18 ? "#3B82F6" : "rgba(255,255,255,0.1)"} strokeWidth="1.5" transform={`rotate(${i * 15} 50 50)`} />
              ))}
            </svg>
            
            {/* Central Bubble */}
            <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-[#8B5CF6]/40 via-[#3B82F6]/30 to-[#22D3EE]/20 backdrop-blur-md border border-white/20 shadow-[inset_0_0_40px_rgba(255,255,255,0.1),0_0_40px_rgba(59,130,246,0.3)] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer z-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50"></div>
              
              <div className="text-5xl sm:text-6xl font-bold text-white mb-2 tracking-tight drop-shadow-lg relative z-10 font-mono">
                {formatTime(secondsLeft)}
              </div>
              <div className="text-[11px] text-[#94A3B8] font-bold tracking-widest uppercase mb-4 relative z-10">Remaining</div>
              
              <div className="text-center px-6 relative z-10">
                <div className="text-[12px] text-white/70 mb-1">Focusing on:</div>
                <div className="text-[14px] text-white font-semibold leading-tight">Advanced Neural Networks</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-12 relative z-10">
            <button onClick={handleSkip} className="text-[#94A3B8] hover:text-white text-[13px] font-semibold tracking-wider flex items-center gap-2 transition-colors">
              <span className="text-lg leading-none mb-[2px]">→</span> SKIP
            </button>
            <button 
              onClick={handlePlayPause}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-white flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button onClick={handleExtend} className="text-[#94A3B8] hover:text-white text-[13px] font-semibold tracking-wider flex items-center gap-2 transition-colors">
              EXTEND <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Ambient Soundscape */}
          <div className="w-full max-w-[320px] relative z-10 flex flex-col items-center">
            <div className="flex items-center justify-center gap-1 mb-4 h-4">
               {Array.from({length: 15}).map((_, i) => (
                 <motion.div 
                   key={i} 
                   className="w-1 bg-[#8B5CF6]/50 rounded-full" 
                   animate={isPlaying ? { height: ['20%', '100%', '30%', '80%', '20%'] } : { height: '20%' }}
                   transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                 />
               ))}
            </div>
            <div className="text-[13px] font-bold text-white mb-3">Ambient Neural Soundscapes</div>
            <div className="flex items-center gap-3 w-full bg-[#0F172A]/80 border border-white/10 rounded-xl p-2 pl-4">
              <span className="text-sm text-[#94A3B8] flex-1">Deep Focus Binaural Beats</span>
              <button onClick={() => addToast('Changed ambient sound', 'info')} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                <Play className="w-3.5 h-3.5 text-white fill-current" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-[#10B981]">
               <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]"></div>
               AI-Enhanced Concentration Active
            </div>
          </div>
          
          <button onClick={handleSettings} className="absolute bottom-6 left-6 text-[#94A3B8] hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={handleMaximize} className="absolute bottom-6 right-6 text-[#94A3B8] hover:text-white">
            <Maximize className="w-5 h-5" />
          </button>
        </div>

        {/* Right Column: Insights */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Study Heatmap */}
          <div className="bg-[#0F172A]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[13px] font-bold text-white tracking-widest uppercase">Study Heatmap: Last 30 Days</h3>
              <button onClick={() => addToast('More heatmap options', 'info')}><MoreHorizontal className="w-5 h-5 text-[#94A3B8] hover:text-white transition-colors" /></button>
            </div>
            
            <div className="flex-1 relative mb-6">
              {/* Heatmap Grid Fake */}
              <div className="grid grid-cols-10 gap-2 h-32 relative z-10 opacity-80">
                {Array.from({length: 30}).map((_, i) => {
                   const rand = Math.random();
                   let color = 'bg-[#1E293B]'; // empty
                   let shadow = '';
                   if (rand > 0.8) { color = 'bg-[#C084FC]'; shadow = 'shadow-[0_0_15px_rgba(192,132,252,0.6)]'; } // High (Purple)
                   else if (rand > 0.5) { color = 'bg-[#3B82F6]'; shadow = 'shadow-[0_0_10px_rgba(59,130,246,0.4)]'; } // Moderate (Blue)
                   else if (rand > 0.3) { color = 'bg-[#3B82F6]/40'; } // Low
                   
                   return <div key={i} className={`rounded-md ${color} ${shadow} w-full h-full`}></div>
                })}
              </div>
              
              {/* Trend Line Overlay */}
              <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M 0,80 Q 20,40 40,60 T 80,40 T 100,20" fill="none" stroke="#C084FC" strokeWidth="2" />
              </svg>
            </div>
            
            <div className="flex items-center gap-6 text-[12px] font-medium">
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#C084FC] rounded-sm"></div> <span className="text-[#94A3B8]">High Consistency <span className="text-[#C084FC]">(Purple)</span></span></div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-sm"></div> <span className="text-[#94A3B8]">Moderate <span className="text-[#3B82F6]">(Blue)</span></span></div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#1E293B] rounded-sm"></div> <span className="text-[#94A3B8]">Low <span className="text-[#94A3B8]">(Dim Blue)</span></span></div>
            </div>
          </div>

          {/* Monthly Goal Tracker */}
          <div className="bg-[#0F172A]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[13px] font-bold text-white tracking-widest uppercase">Monthly Goal Tracker: Subject Mastery</h3>
              <button onClick={() => addToast('More goal tracker options', 'info')}><MoreHorizontal className="w-5 h-5 text-[#94A3B8] hover:text-white transition-colors" /></button>
            </div>
            
            <div className="flex items-center justify-around">
               {[
                 { label: 'Machine Learning', val: 78, color: '#C084FC', icon: Brain },
                 { label: 'Data Structures', val: 65, color: '#3B82F6', icon: Activity },
                 { label: 'Quantum Computing', val: 42, color: '#22D3EE', icon: Zap }
               ].map((item, idx) => (
                 <div key={idx} className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" onClick={() => addToast(`Viewed details for ${item.label}`, 'info')}>
                   <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                     <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke={item.color} strokeWidth="6" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * item.val) / 100} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${item.color}80)` }} />
                     </svg>
                     <div className="flex flex-col items-center justify-center z-10 text-center">
                        <item.icon className="w-4 h-4 mb-1 text-white/80" />
                        <div className="text-xl font-bold text-white leading-none">{item.val}%</div>
                     </div>
                   </div>
                   <div className="text-[12px] font-medium text-[#94A3B8] text-center max-w-[100px] leading-tight">
                     {item.label}: <span className="text-white">{item.val}%</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* AI Smart Feed */}
          <div className="bg-[#0F172A]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[13px] font-bold text-white tracking-widest uppercase">AI Smart Feed: Recommendations</h3>
              <button onClick={() => addToast('More smart feed options', 'info')}><MoreHorizontal className="w-5 h-5 text-[#94A3B8] hover:text-white transition-colors" /></button>
            </div>
            
            <div className="space-y-3">
               <div className="bg-[#1E293B]/50 hover:bg-[#1E293B] transition-colors border border-white/5 rounded-xl p-4 flex items-center gap-4 group cursor-pointer" onClick={handlePrepare}>
                 <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-[#3B82F6]" />
                 </div>
                 <div className="flex-1">
                    <h4 className="text-[14px] font-semibold text-white mb-1">Upcoming Mock Test: Machine Learning Basics (In 2 days) - <span className="text-[#EF4444]">High Priority</span></h4>
                 </div>
                 <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[12px] font-semibold rounded-lg transition-colors shrink-0">Prepare</button>
               </div>
               
               <div className="bg-[#1E293B]/50 hover:bg-[#1E293B] transition-colors border border-white/5 rounded-xl p-4 flex items-center gap-4 group cursor-pointer" onClick={handleReview}>
                 <div className="w-10 h-10 rounded-lg bg-[#C084FC]/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#C084FC]" />
                 </div>
                 <div className="flex-1">
                    <h4 className="text-[14px] font-semibold text-white/90 mb-1">Auto-Scheduled Revision: Low Confidence Topic - Linear Algebra (Tomorrow 10 AM)</h4>
                 </div>
                 <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[12px] font-semibold rounded-lg transition-colors shrink-0">Review</button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
