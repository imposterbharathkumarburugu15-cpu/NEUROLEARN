import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, Target, Activity, CheckCircle2, ChevronRight, Play, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { MPCProficiencyRadar } from '../../components/MPCProficiencyRadar';

export default function Insights() {
  const navigate = useNavigate();
  const { user, addToast } = useAppStore();

  const handleStartVideo = () => {
    addToast('Starting Redox Video...', 'success');
  };

  const handlePracticeNow = () => {
    navigate('/driller');
    addToast('Opening Driller practice...', 'info');
  };

  const handleScheduleTest = () => {
    addToast('Mini-test scheduled successfully.', 'success');
  };

  const handleMoreOptions = () => {
    addToast('Opening more options...', 'info');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Brain className="w-6 h-6 text-[#3B82F6]" />
        <h1 className="text-xl font-bold text-white tracking-wide">NeuroLearn <span className="text-[#3B82F6]">AI</span></h1>
        <div className="h-4 w-px bg-white/20 mx-2"></div>
        <span className="text-white/80 font-medium">Neural Insights: AI Intelligence Center</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
           <h2 className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight mb-4">Neural Insights for {user?.name || 'Guest'}</h2>
           
           {/* MPC Proficiency Radar Chart */}
           <MPCProficiencyRadar />
           
           {/* AI Performance DNA */}
           <div className="relative h-[400px] flex items-center justify-center">
              {/* Fake Neural branches */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-64 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] [mask-image:radial-gradient(ellipse_at_left,_black_10%,_transparent_70%)] pointer-events-none"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-64 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] [mask-image:radial-gradient(ellipse_at_right,_black_10%,_transparent_70%)] pointer-events-none"></div>
              
              {/* Concentric Rings */}
              <div className="relative w-72 h-72">
                 <div className="absolute inset-0 rounded-full border border-white/5 shadow-[0_0_50px_rgba(34,211,238,0.05)]"></div>
                 <div className="absolute inset-4 rounded-full border-2 border-[#3B82F6]/30 border-r-transparent rotate-45 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                 <div className="absolute inset-10 rounded-full border border-[#22D3EE]/40 border-b-transparent -rotate-12 shadow-[0_0_20px_rgba(34,211,238,0.2)]"></div>
                 <div className="absolute inset-16 rounded-full border-2 border-[#EAB308]/40 border-l-transparent rotate-90 shadow-[0_0_15px_rgba(234,179,8,0.2)]"></div>
                 
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-sm font-semibold text-[#94A3B8] tracking-widest uppercase mb-1">AI</div>
                    <div className="text-xl font-bold text-white leading-tight">Performance</div>
                    <div className="text-xl font-bold text-white leading-tight">DNA</div>
                 </div>
              </div>

              {/* Connecting lines & Stats */}
              <div className="absolute left-10 top-1/3 text-right">
                 <div className="flex items-center gap-3 mb-1 justify-end">
                    <span className="text-white font-semibold">Mastery</span>
                    <span className="text-[#3B82F6] font-bold">88%</span>
                 </div>
                 <div className="flex gap-1 justify-end mb-6">
                    <div className="w-8 h-1 bg-[#3B82F6] rounded-full shadow-[0_0_8px_#3B82F6]"></div>
                    <div className="w-3 h-1 bg-[#3B82F6]/50 rounded-full"></div>
                 </div>
                 
                 <div className="flex items-center gap-3 mb-1 justify-end">
                    <span className="text-white font-semibold">Mastery</span>
                    <span className="text-[#22D3EE] font-bold">79%</span>
                 </div>
                 <div className="flex gap-1 justify-end">
                    <div className="w-10 h-1 bg-[#22D3EE] rounded-full shadow-[0_0_8px_#22D3EE]"></div>
                    <div className="w-2 h-1 bg-[#22D3EE]/50 rounded-full"></div>
                 </div>
              </div>
              
              <div className="absolute right-10 top-1/4">
                 <div className="flex items-center gap-3 mb-1">
                    <span className="text-[#EAB308] font-bold">92%</span>
                    <span className="text-white font-semibold">Velocity</span>
                 </div>
                 <div className="flex gap-1 mb-6">
                    <div className="w-12 h-1 bg-[#EAB308] rounded-full shadow-[0_0_8px_#EAB308]"></div>
                    <div className="w-2 h-1 bg-[#EAB308]/50 rounded-full"></div>
                 </div>
              </div>
              
              <div className="absolute right-10 bottom-1/4">
                 <div className="flex items-center gap-3 mb-1">
                    <span className="text-[#EAB308] font-bold">79%</span>
                    <span className="text-white font-semibold">Accuracy</span>
                 </div>
                 <div className="flex gap-1">
                    <div className="w-8 h-1 bg-[#EAB308] rounded-full shadow-[0_0_8px_#EAB308]"></div>
                    <div className="w-2 h-1 bg-[#EAB308]/50 rounded-full"></div>
                    <div className="w-2 h-1 bg-[#EAB308]/50 rounded-full"></div>
                 </div>
              </div>
           </div>
           
           {/* AI Summary Card (Left Version) */}
           <div className="relative mt-8 p-[1px] rounded-2xl bg-gradient-to-b from-[#3B82F6]/30 to-transparent">
             <div className="bg-[#0F172A]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#3B82F6]/20 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_0_60px_rgba(59,130,246,0.1)] text-center">
                <h3 className="text-[#94A3B8] text-[13px] font-bold tracking-widest uppercase mb-4">AI Intelligence Summary of Nexus AI</h3>
                <p className="text-2xl font-medium text-white leading-relaxed mb-6">
                  Your Calculus efficiency has peaked, but <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 underline decoration-[#EAB308]/50 decoration-2 underline-offset-4">Organic Chemistry reaction speed</span> is a bottleneck.
                </p>
                <div className="text-[#94A3B8] font-medium">
                  Predicted JEE Rank: <span className="text-white font-bold ml-1">1,428</span>
                </div>
             </div>
           </div>

           {/* Weak Concept Heatmap Header (for bottom scroll logic) */}
           <div className="mt-8">
             <div className="bg-[#0F172A]/50 border border-white/5 rounded-t-2xl p-4 flex items-center justify-between">
               <h3 className="text-white font-bold">Weak Concept Heatmap</h3>
             </div>
           </div>

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
           
           {/* Top Stats Row */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0F172A]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 relative overflow-hidden flex flex-col items-center justify-center">
                 <div className="absolute top-4 left-4 text-[#94A3B8] text-[12px] font-bold tracking-widest uppercase">Predicted Rank</div>
                 <button onClick={handleMoreOptions} className="absolute top-4 right-4"><MoreHorizontal className="w-4 h-4 text-[#94A3B8] hover:text-white" /></button>
                 
                 <div className="relative w-32 h-32 mt-6 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                       <path d="M 10 50 A 40 40 0 1 1 90 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" strokeLinecap="round" />
                       <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    </svg>
                    <div className="text-3xl font-bold text-white flex items-center gap-1">
                      1,428 <TrendingUp className="w-4 h-4 text-[#10B981]" />
                    </div>
                 </div>
              </div>
              
              <div className="bg-[#0F172A]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 relative overflow-hidden flex flex-col items-center justify-center">
                 <div className="absolute top-4 left-4 text-[#94A3B8] text-[12px] font-bold tracking-widest uppercase">Confidence Score</div>
                 <button onClick={handleMoreOptions} className="absolute top-4 right-4"><MoreHorizontal className="w-4 h-4 text-[#94A3B8] hover:text-white" /></button>
                 
                 <div className="relative w-32 h-32 mt-6 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                       <circle cx="50" cy="50" r="40" fill="none" stroke="#EAB308" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset={251.2 * 0.15} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                    </svg>
                    <div className="flex flex-col items-center">
                       <div className="text-3xl font-bold text-white">85%</div>
                       <div className="text-[12px] font-bold text-[#10B981]">High</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* AI Intelligence Summary (Right Version) - Duplicate of left or combined in original image, let's keep it clean here */}
           <div className="bg-[#0F172A]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6">
              <h3 className="text-[#94A3B8] text-[13px] font-bold tracking-widest uppercase mb-4">AI Intelligence Summary</h3>
              <p className="text-lg font-medium text-white leading-relaxed mb-4">
                Your Calculus efficiency has peaked, but Organic Chemistry reaction speed is a bottleneck.
              </p>
              <div className="text-[#94A3B8] text-sm font-medium">
                Predicted JEE Rank: <span className="text-[#EAB308] font-bold ml-1">1,428</span>
              </div>
           </div>

           {/* Time Intelligence & Heatmap Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Weak Concept Heatmap Mini */}
              <div className="bg-[#0F172A]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 flex flex-col relative h-[300px]">
                 <h3 className="text-white font-bold mb-6">Weak Concept Heatmap</h3>
                 <div className="flex-1 relative">
                    {/* Simulated Network Graph */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 150">
                       <line x1="100" y1="75" x2="40" y2="40" stroke="rgba(239,68,68,0.3)" strokeWidth="2" />
                       <line x1="100" y1="75" x2="40" y2="110" stroke="rgba(239,68,68,0.3)" strokeWidth="2" />
                       <line x1="100" y1="75" x2="160" y2="40" stroke="rgba(59,130,246,0.3)" strokeWidth="2" />
                       <line x1="100" y1="75" x2="160" y2="110" stroke="rgba(239,68,68,0.3)" strokeWidth="2" />
                    </svg>
                    
                    <div onClick={() => addToast('Viewing Concept: Coordination Compounds', 'info')} className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-[#EF4444] to-[#B91C1C] border-2 border-white/20 shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center text-center z-10 cursor-pointer group hover:scale-105 transition-transform">
                       <span className="text-white text-[11px] font-bold leading-tight">Coordination<br/>Compounds</span>
                       
                       <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-32 bg-[#0F172A]/95 border border-[#EF4444]/30 rounded-lg p-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="text-[#94A3B8]">Error Rate: <span className="text-[#EF4444] font-bold">38%</span></div>
                          <div className="text-[#94A3B8]">Avg Time: <span className="text-[#EF4444] font-bold">2m 28s</span></div>
                       </div>
                    </div>
                    
                    <div onClick={() => addToast('Viewing Concept: Redox Reactions', 'info')} className="absolute top-[10%] left-[10%] w-14 h-14 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-center cursor-pointer hover:bg-[#EF4444]/30 transition-colors">
                       <span className="text-white/80 text-[8px] font-bold leading-tight">Redox<br/>Reactions</span>
                    </div>
                    
                    <div onClick={() => addToast('Viewing Concept: Chemical Bonding', 'info')} className="absolute top-[70%] left-[10%] w-16 h-16 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-center cursor-pointer hover:bg-[#EF4444]/30 transition-colors">
                       <span className="text-white/80 text-[9px] font-bold leading-tight">Chemical<br/>Bonding</span>
                    </div>
                    
                    <div onClick={() => addToast('Viewing Concept: Chemical Kinetics', 'info')} className="absolute top-[10%] right-[10%] w-12 h-12 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center text-center cursor-pointer hover:bg-[#3B82F6]/30 transition-colors">
                       <span className="text-white/80 text-[8px] font-bold leading-tight">Chemical<br/>Kinetics</span>
                    </div>
                 </div>
              </div>

              {/* Time Intelligence */}
              <div className="bg-[#0F172A]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 h-[300px] flex flex-col">
                 <h3 className="text-white font-bold mb-4">Time Intelligence</h3>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-sm"></div><span className="text-[11px] text-[#94A3B8] font-bold uppercase">Your Time</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#EAB308] rounded-sm"></div><span className="text-[11px] text-[#94A3B8] font-bold uppercase">Topper Time</span></div>
                 </div>
                 
                 <div className="flex-1 space-y-4">
                    {/* Easy */}
                    <div>
                       <div className="text-[12px] text-white font-medium mb-2">Easy</div>
                       <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                             <div className="h-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-full w-[80%] relative">
                                <span className="absolute right-[-45px] top-1/2 -translate-y-1/2 text-[11px] text-white font-medium">1m 15s</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="h-4 bg-gradient-to-r from-[#EAB308] to-[#CA8A04] rounded-full w-[40%] relative">
                                <span className="absolute right-[-35px] top-1/2 -translate-y-1/2 text-[11px] text-[#94A3B8] font-medium">45s</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    {/* Medium */}
                    <div>
                       <div className="text-[12px] text-white font-medium mb-2">Medium</div>
                       <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                             <div className="h-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-full w-[95%] relative">
                                <span className="absolute right-[-50px] top-1/2 -translate-y-1/2 text-[11px] text-white font-medium">2m 30s</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="h-4 bg-gradient-to-r from-[#EAB308] to-[#CA8A04] rounded-full w-[60%] relative">
                                <span className="absolute right-[-45px] top-1/2 -translate-y-1/2 text-[11px] text-[#94A3B8] font-medium">1m 10s</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Improvement Timeline */}
           <div className="bg-[#0F172A]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 mt-2">
              <h3 className="text-white font-bold mb-1">Improvement Timeline</h3>
              <p className="text-[#94A3B8] text-sm mb-8">AI Prescription</p>
              
              <div className="relative">
                 {/* Connecting Line */}
                 <div className="absolute top-[28px] left-[30px] right-[30px] h-0.5 bg-gradient-to-r from-[#3B82F6] via-[#EAB308] to-white/10 z-0"></div>
                 
                 <div className="grid grid-cols-3 gap-4 relative z-10">
                    
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center">
                       <div className="w-14 h-14 rounded-full bg-[#0F172A] border-2 border-[#3B82F6] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                          <Play className="w-6 h-6 text-[#3B82F6] fill-current ml-1" />
                       </div>
                       <h4 className="text-[12px] font-bold text-white mb-3">1. Watch Redox Video - 15 min</h4>
                       <button onClick={handleStartVideo} className="px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-lg text-[12px] font-bold w-full max-w-[140px] flex items-center justify-center gap-1.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all">
                         <Play className="w-3 h-3 fill-current" /> Start
                       </button>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center opacity-70 hover:opacity-100 transition-opacity">
                       <div className="w-14 h-14 rounded-full bg-[#0F172A] border-2 border-[#EAB308] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                          <Target className="w-6 h-6 text-[#EAB308]" />
                       </div>
                       <h4 className="text-[12px] font-bold text-white/90 mb-3">2. Driller Practice - 30 Questions</h4>
                       <button onClick={handlePracticeNow} className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-[12px] font-bold w-full max-w-[140px] hover:bg-white/10 transition-all">
                         Practice Now
                       </button>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center opacity-50 hover:opacity-100 transition-opacity">
                       <div className="w-14 h-14 rounded-full bg-[#0F172A] border-2 border-white/20 flex items-center justify-center mb-4">
                          <Activity className="w-6 h-6 text-white/70" />
                       </div>
                       <h4 className="text-[12px] font-bold text-white/90 mb-3">3. Retake Mini-test - 45 min</h4>
                       <button onClick={handleScheduleTest} className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-[12px] font-bold w-full max-w-[140px] hover:bg-white/10 transition-all">
                         Schedule
                       </button>
                    </div>

                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
