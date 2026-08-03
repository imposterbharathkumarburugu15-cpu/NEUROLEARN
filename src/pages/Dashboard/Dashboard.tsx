import React, { useState } from 'react';
import { Play, Compass, Target, BookOpen, Brain, Atom, FlaskConical, Sigma, Hexagon, Check, Lock, Zap, ArrowRight, Mic, ScanText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { LearningStreaks } from '../../components/LearningStreaks';
import { PYQScannerModal } from '../../components/PYQScannerModal';

export default function Dashboard() {
  const { user, addToast } = useAppStore();
  const navigate = useNavigate();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="px-4 md:px-10 max-w-[1400px] mx-auto pb-24">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row gap-8 items-start mb-8">
        <div className="flex-1 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1E293B]/50 border border-white/5 rounded-full">
            <span className="w-2 h-2 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-[11px] text-[#E2E8F0] uppercase tracking-widest font-semibold">NeuroVerse Active</span>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-[#22D3EE]">{user?.name || 'Guest'}</span>
            </h2>
            <p className="text-[#94A3B8] text-[15px] max-w-2xl leading-relaxed">
              Your neural pathways are primed. You've completed 84% of your weekly goal.<br/>Ready to master the forces of nature?
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button onClick={() => navigate('/battleground')} className="px-6 py-3.5 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-semibold rounded-xl flex items-center gap-3 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300">
              <Play className="w-5 h-5 fill-current" />
              Continue Learning: Electrostatics
            </button>
            <button onClick={() => navigate('/vault')} className="px-6 py-3.5 bg-transparent border border-white/10 text-white font-semibold rounded-xl flex items-center gap-3 hover:bg-white/5 transition-all duration-300">
              <Compass className="w-5 h-5 text-[#22D3EE]" />
              Explore Universe
            </button>
          </div>
        </div>

        {/* Side Panel: Today's Target */}
        <div className="w-full lg:w-[340px] bg-[#0F172A]/80 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[13px] tracking-widest uppercase text-white">Today's Target</h3>
            <Target className="text-[#3B82F6] w-5 h-5" />
          </div>
          
          <div className="space-y-5">
            <div className="p-4 bg-[#050816]/50 rounded-xl border border-white/5">
              <div className="flex justify-between text-[13px] font-medium mb-3">
                <span className="text-white">Daily Focus</span>
                <span className="text-white">45/60 <span className="text-[#94A3B8]">min</span></span>
              </div>
              <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6]" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div onClick={() => { navigate('/driller'); addToast('Loading Electrostatics PYQs...', 'info'); }} className="flex items-center gap-4 px-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center border border-white/5 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <BookOpen className="text-[#8B5CF6] w-5 h-5" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-white mb-0.5">12 PYQs Remaining</p>
                <p className="text-[12px] text-[#94A3B8]">Electrostatics & Coulomb's Law</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Streaks Component */}
      <section className="mb-8">
        <LearningStreaks />
      </section>

      {/* Nexus AI Centerpiece */}
      <section className="mb-8">
        <div className="bg-[#0F172A]/60 border border-[#3B82F6]/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl shadow-[inset_0_0_40px_rgba(59,130,246,0.05)]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#3B82F6]/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div onClick={() => navigate('/nexus-ai')} className="relative shrink-0 cursor-pointer group">
              <div className="absolute inset-0 bg-[#22D3EE] rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity"></div>
              <div className="w-20 h-20 rounded-full border border-[#22D3EE]/30 bg-[#050816] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <div className="w-16 h-16 rounded-full border border-[#22D3EE]/20 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-[#22D3EE]" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-bold text-white mb-2">Nexus Intelligence</h4>
              <p className="text-[#94A3B8] text-[15px] leading-relaxed max-w-3xl">
                "{user?.name || 'Guest'}, your performance in Coulomb's Law is exceptional, but your integration steps in <span className="text-[#22D3EE]">Continuous Charge Distributions</span> need attention. Focus on <span className="text-[#22D3EE]">Electrostatics</span> to improve accuracy by <span className="text-[#22D3EE] font-semibold">+7%</span>."
              </p>
            </div>
            
            <div className="shrink-0 flex flex-col items-center justify-center px-6 py-4 bg-[#050816]/50 border border-white/5 rounded-xl min-w-[140px]">
              <p className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-semibold mb-1">Focus Velocity</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] text-transparent bg-clip-text">1.2x</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Layout: Learning Universes & Roadmap */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Learning Universes */}
        <div className="xl:col-span-8 space-y-5">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-lg font-bold text-white">Learning Universes</h3>
            <button onClick={() => navigate('/battleground')} className="text-[#3B82F6] text-[13px] font-semibold flex items-center gap-1 hover:text-[#22D3EE] transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Physics Card */}
            <div onClick={() => navigate('/battleground')} className="cursor-pointer bg-[#0F172A]/80 border border-white/5 rounded-2xl p-6 hover:border-[#22D3EE]/30 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center border border-[#22D3EE]/20 group-hover:scale-110 transition-transform duration-300">
                  <Atom className="w-6 h-6 text-[#22D3EE]" />
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#1E293B]" strokeWidth="3"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#22D3EE]" strokeWidth="3" strokeDasharray="100" strokeDashoffset="28" strokeLinecap="round"></circle>
                  </svg>
                  <span className="absolute text-[11px] font-bold text-white">72%</span>
                </div>
              </div>
              <h4 className="text-[17px] font-bold text-white mb-1">Physics</h4>
              <p className="text-[#94A3B8] text-[13px] mb-5">Electric Fields & Potentials</p>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#1E293B]/80 rounded text-[11px] text-[#94A3B8] font-medium border border-white/5">Mastery: 840</span>
                <span className="px-2.5 py-1 bg-[#22D3EE]/10 rounded text-[11px] text-[#22D3EE] font-medium border border-[#22D3EE]/20">Level 12</span>
              </div>
            </div>

            {/* Chemistry Card */}
            <div onClick={() => navigate('/battleground')} className="cursor-pointer bg-[#0F172A]/80 border border-white/5 rounded-2xl p-6 hover:border-[#10B981]/30 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20 group-hover:scale-110 transition-transform duration-300">
                  <FlaskConical className="w-6 h-6 text-[#10B981]" />
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#1E293B]" strokeWidth="3"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#10B981]" strokeWidth="3" strokeDasharray="100" strokeDashoffset="55" strokeLinecap="round"></circle>
                  </svg>
                  <span className="absolute text-[11px] font-bold text-white">45%</span>
                </div>
              </div>
              <h4 className="text-[17px] font-bold text-white mb-1">Chemistry</h4>
              <p className="text-[#94A3B8] text-[13px] mb-5">Chemical Bonding & Hybridization</p>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#1E293B]/80 rounded text-[11px] text-[#94A3B8] font-medium border border-white/5">Mastery: 320</span>
                <span className="px-2.5 py-1 bg-[#10B981]/10 rounded text-[11px] text-[#10B981] font-medium border border-[#10B981]/20">Level 05</span>
              </div>
            </div>

            {/* Mathematics Card */}
            <div onClick={() => navigate('/battleground')} className="cursor-pointer bg-[#0F172A]/80 border border-white/5 rounded-2xl p-6 hover:border-[#8B5CF6]/30 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20 group-hover:scale-110 transition-transform duration-300">
                  <Sigma className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#1E293B]" strokeWidth="3"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#8B5CF6]" strokeWidth="3" strokeDasharray="100" strokeDashoffset="10" strokeLinecap="round"></circle>
                  </svg>
                  <span className="absolute text-[11px] font-bold text-white">90%</span>
                </div>
              </div>
              <h4 className="text-[17px] font-bold text-white mb-1">Mathematics</h4>
              <p className="text-[#94A3B8] text-[13px] mb-5">Calculus & Vector Algebra</p>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#1E293B]/80 rounded text-[11px] text-[#94A3B8] font-medium border border-white/5">Mastery: 910</span>
                <span className="px-2.5 py-1 bg-[#8B5CF6]/10 rounded text-[11px] text-[#8B5CF6] font-medium border border-[#8B5CF6]/20">Level 15</span>
              </div>
            </div>

            {/* Organic Chemistry Card */}
            <div onClick={() => navigate('/battleground')} className="cursor-pointer bg-[#0F172A]/80 border border-white/5 rounded-2xl p-6 hover:border-[#F59E0B]/30 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center border border-[#F59E0B]/20 group-hover:scale-110 transition-transform duration-300">
                  <Hexagon className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#1E293B]" strokeWidth="3"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#F59E0B]" strokeWidth="3" strokeDasharray="100" strokeDashoffset="40" strokeLinecap="round"></circle>
                  </svg>
                  <span className="absolute text-[11px] font-bold text-white">60%</span>
                </div>
              </div>
              <h4 className="text-[17px] font-bold text-white mb-1">Organic Chemistry</h4>
              <p className="text-[#94A3B8] text-[13px] mb-5">Hydrocarbons & Mechanisms</p>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#1E293B]/80 rounded text-[11px] text-[#94A3B8] font-medium border border-white/5">Mastery: 450</span>
                <span className="px-2.5 py-1 bg-[#F59E0B]/10 rounded text-[11px] text-[#F59E0B] font-medium border border-[#F59E0B]/20">Level 08</span>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Roadmap */}
        <div className="xl:col-span-4 space-y-5">
          <h3 className="text-lg font-bold text-white mb-2">Roadmap</h3>
          <div className="bg-[#0F172A]/80 border border-white/5 rounded-2xl p-8 relative min-h-[460px]">
            <div className="absolute left-[45px] top-12 bottom-12 w-[2px] bg-gradient-to-b from-[#3B82F6] via-[#1E293B] to-[#1E293B]"></div>
            
            <div className="space-y-10 relative">
              {/* Node 1 */}
              <div className="flex items-center gap-5">
                <div className="w-[26px] h-[26px] rounded-full bg-[#3B82F6] flex items-center justify-center border-[4px] border-[#0F172A] z-10 shrink-0">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="font-bold text-white text-[14px]">Mechanics</p>
                  <p className="text-[12px] text-[#94A3B8] mt-0.5">Completed 12/12</p>
                </div>
              </div>
              
              {/* Node 2 */}
              <div className="flex items-center gap-5">
                <div className="w-[26px] h-[26px] rounded-full bg-[#3B82F6] flex items-center justify-center border-[4px] border-[#0F172A] z-10 shrink-0">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="font-bold text-white text-[14px]">Kinematics</p>
                  <p className="text-[12px] text-[#94A3B8] mt-0.5">Completed 08/08</p>
                </div>
              </div>
              
              {/* Node 3 (Active) */}
              <div onClick={() => { navigate('/battleground'); addToast('Opening Laws of Motion unit...', 'info'); }} className="flex items-center gap-5 cursor-pointer group">
                <div className="relative shrink-0 flex items-center justify-center w-[26px] h-[26px]">
                  <div className="absolute w-8 h-8 rounded-full bg-[#3B82F6]/30 animate-ping"></div>
                  <div className="w-[26px] h-[26px] rounded-full bg-[#3B82F6] border-[4px] border-[#0F172A] z-10 shadow-[0_0_15px_rgba(59,130,246,0.6)] shrink-0"></div>
                </div>
                <div>
                  <p className="font-bold text-[#8B5CF6] text-[15px] group-hover:text-[#A78BFA] transition-colors">Laws of Motion</p>
                  <p className="text-[12px] text-[#94A3B8] mt-0.5">In Progress 05/10</p>
                </div>
              </div>
              
              {/* Node 4 */}
              <div className="flex items-center gap-5">
                <div className="w-[26px] h-[26px] rounded-full bg-[#1E293B] flex items-center justify-center border-[4px] border-[#0F172A] z-10 shrink-0">
                  <Lock className="w-3 h-3 text-[#94A3B8]" />
                </div>
                <div className="opacity-50">
                  <p className="font-bold text-white text-[14px]">Work, Power & Energy</p>
                  <p className="text-[12px] text-[#94A3B8] mt-0.5">Pending</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-6 right-6 flex items-center gap-3">
              <button 
                onClick={() => setIsScannerOpen(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] hover:bg-[#3B82F6]/20 border border-white/10 hover:border-[#3B82F6]/50 text-white rounded-xl text-[13px] font-semibold transition-all shadow-lg active:scale-95"
              >
                <ScanText className="w-4 h-4 text-[#22D3EE]" />
                Scan PYQ
              </button>
              <button onClick={() => { navigate('/nexus-ai'); addToast('Voice Assistant active in Nexus AI!', 'info'); }} className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:scale-105 transition-transform active:scale-95" title="Voice Assistant">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PYQ Scanner Modal */}
      <PYQScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
      />
    </div>
  );
}
