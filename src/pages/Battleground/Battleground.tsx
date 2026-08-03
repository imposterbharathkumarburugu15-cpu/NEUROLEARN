import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export default function Battleground() {
  const { user, addToast } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="px-4 md:px-10 pt-4 md:pt-8 max-w-7xl mx-auto space-y-6 md:space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 fade-in-up">
        <div>
          <h2 className="text-4xl font-bold font-headline-h1 text-text-primary mb-2">Battleground Home: <span className="text-primary">The Arena</span></h2>
          <p className="text-text-secondary text-lg">Real Exam. Real Competition.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Active Test Card */}
        <div className="lg:col-span-2 glass-card p-8 bg-gradient-to-br from-surface-glass to-primary/10 border-primary/30 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-colors"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase border border-white/10">Today's Live Tests</span>
              <div className="text-right">
                <p className="text-xs text-text-secondary uppercase tracking-widest font-bold mb-1">Starts in</p>
                <p className="text-3xl font-mono-technical font-bold text-error">01:20:35</p>
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-4">Physics Grand Test</h3>
            
            <div className="flex items-center gap-4 mb-8 text-sm font-medium">
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-primary">format_list_numbered</span> 75 Questions</span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-tertiary">sports_score</span> 300 Marks</span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-secondary">schedule</span> 180 Min</span>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-text-secondary text-sm">By: Mr. Raghavendra</p>
              <div className="flex items-center gap-3">
                <button onClick={() => addToast('Loading Physics Grand Test Details...', 'info')} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10 text-sm">
                  View Details
                </button>
                <Link to="/battleground/test" className="px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] text-sm">
                  Enter Test Arena
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tests Card */}
        <div className="glass-card p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs text-text-secondary font-bold tracking-widest uppercase mb-4 block">Upcoming Tests</span>
            <h3 className="text-xl font-bold mb-2">Chemistry Unit Test</h3>
            <p className="text-text-secondary text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Tomorrow, 09:00 AM
            </p>
          </div>
          <button onClick={() => addToast('Loading Chemistry Unit Test Details...', 'info')} className="w-full mt-6 px-6 py-2.5 glass-panel hover:bg-white/5 text-text-primary font-bold rounded-xl transition-colors border border-white/10">
            View Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
        {/* Completed Tests */}
        <div className="glass-card p-6">
          <span className="text-xs text-text-secondary font-bold tracking-widest uppercase mb-4 block">Completed Tests</span>
          <h3 className="text-2xl font-bold mb-6">JEE Mock Test 08</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-text-secondary">Score:</span>
              <span className="font-bold font-mono-technical">92 / 300</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-text-secondary">Percentile:</span>
              <span className="font-bold font-mono-technical text-primary">98.73</span>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs text-text-secondary font-bold tracking-widest uppercase">Leaderboard (Batch)</span>
            <button onClick={() => addToast('Opening Full Leaderboard...', 'info')} className="text-sm text-primary hover:underline">View Full Leaderboard</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center gap-4 py-2">
              <span className="w-6 text-center text-text-secondary font-mono-technical">1</span>
              <div className="w-8 h-8 rounded-full bg-surface-container"></div>
              <span className="font-medium flex-1">Aryan R.</span>
            </div>
            <div className="flex items-center gap-4 py-2">
              <span className="w-6 text-center text-text-secondary font-mono-technical">2</span>
              <div className="w-8 h-8 rounded-full bg-surface-container"></div>
              <span className="font-medium flex-1">Srikanth P.</span>
            </div>
            <div className="flex items-center gap-4 py-2">
              <span className="w-6 text-center text-text-secondary font-mono-technical">3</span>
              <div className="w-8 h-8 rounded-full bg-surface-container"></div>
              <span className="font-medium flex-1">Meera K.</span>
            </div>
            <div className="flex items-center gap-4 py-2 bg-primary/10 rounded-lg px-2 -mx-2 border border-primary/20">
              <span className="w-6 text-center text-primary font-bold font-mono-technical">4</span>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">You</div>
              <span className="font-bold text-primary flex-1">{user?.name || 'Guest'}</span>
              <span className="font-mono-technical text-primary text-sm font-bold">98.73</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Announcements */}
      <div className="glass-card p-6 flex items-center justify-between fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined">campaign</span>
          </div>
          <div>
            <span className="text-[10px] text-text-secondary font-bold tracking-widest uppercase mb-1 block">Announcements</span>
            <p className="text-sm font-medium">All the Best for today's Physics Grand Test! Give your best and stay focused.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => addToast('No previous announcements.', 'info')} className="p-2 rounded-full hover:bg-white/5 text-text-secondary transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button onClick={() => addToast('No next announcements.', 'info')} className="p-2 rounded-full hover:bg-white/5 text-text-secondary transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
