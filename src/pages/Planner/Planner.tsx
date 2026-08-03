import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Brain, MessageSquare, Play, Clock, MoreHorizontal, CheckCircle2, ChevronLeft, ChevronRight, Zap, Plus, Trash2, Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function Planner() {
  const navigate = useNavigate();
  const { user, addToast } = useAppStore();

  const [tasks, setTasks] = useState<any[]>([
    { id: 'default-1', title: 'Rotational Dynamics - Torque & Equilibrium', subject: 'Physics', time: '08:00 - 10:00 AM', completed: false },
    { id: 'default-2', title: 'Organic Chemistry - Reaction Mechanisms', subject: 'Chemistry', time: '10:30 - 12:30 PM', completed: false },
    { id: 'default-3', title: 'Mathematics - Calculus & Integration', subject: 'Mathematics', time: '14:00 - 16:00 PM', completed: false },
    { id: 'default-4', title: 'Physics - Electrostatics & Capacitance', subject: 'Physics', time: '16:30 - 18:30 PM', completed: false },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics'>('Physics');
  const [newTaskTime, setNewTaskTime] = useState('18:00 - 19:30 PM');

  // Realtime Firestore sync for user tasks
  useEffect(() => {
    if (!user?.id) return;
    const q = query(collection(db, 'planner_tasks'), where('userId', '==', user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreTasks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setTasks(firestoreTasks);
      }
    }, (error) => {
      console.warn("Firestore snapshot warning:", error);
    });
    return () => unsubscribe();
  }, [user?.id]);

  const handleToggleTask = async (task: any) => {
    const newStatus = !task.completed;
    if (task.id.startsWith('default-')) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: newStatus } : t));
    } else {
      try {
        await updateDoc(doc(db, 'planner_tasks', task.id), { completed: newStatus });
      } catch (err) {
        console.error("Error updating task:", err);
      }
    }
    addToast(newStatus ? 'Task marked complete!' : 'Task reopened', newStatus ? 'success' : 'info');
  };

  const handleDeleteTask = async (task: any) => {
    if (task.id.startsWith('default-')) {
      setTasks(prev => prev.filter(t => t.id !== task.id));
    } else {
      try {
        await deleteDoc(doc(db, 'planner_tasks', task.id));
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
    addToast('Task deleted', 'info');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      userId: user?.id || 'guest',
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      time: newTaskTime,
      status: 'pending',
      completed: false,
      createdAt: new Date().toISOString()
    };

    if (user?.id) {
      try {
        await addDoc(collection(db, 'planner_tasks'), newTask);
        addToast('Mission task added to Firestore!', 'success');
      } catch (err) {
        console.error("Error creating task in firestore:", err);
        setTasks(prev => [{ id: `local-${Date.now()}`, ...newTask }, ...prev]);
        addToast('Mission task added!', 'success');
      }
    } else {
      setTasks(prev => [{ id: `local-${Date.now()}`, ...newTask }, ...prev]);
      addToast('Mission task added!', 'success');
    }

    setNewTaskTitle('');
    setIsAddModalOpen(false);
  };

  const handleReschedule = () => {
    addToast('Re-balancing your schedule with AI...', 'info');
    setTimeout(() => {
      addToast('Schedule optimized successfully!', 'success');
    }, 1500);
  };

  const handleMoreOptions = () => {
    addToast('Opening chat options...', 'info');
  };

  const handleAskQuestion = () => {
    navigate('/nexus-ai');
    addToast('How can I help you with your schedule?', 'info');
  };

  const handleViewRoadmap = () => {
    addToast('Generating full roadmap view...', 'info');
  };

  const handleScrollLeft = () => {
    addToast('Viewing previous days', 'info');
  };

  const handleScrollRight = () => {
    addToast('Viewing future days', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">Plan Your Victory</h1>
            <p className="text-[#94A3B8] text-sm md:text-base font-medium">Mission Planner AI: Intelligent Roadmap</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="inline-block p-[1px] rounded-2xl bg-gradient-to-r from-[#3B82F6]/50 to-[#8B5CF6]/50 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <div className="bg-[#0F172A]/90 backdrop-blur-xl px-8 py-5 rounded-2xl border border-white/5 flex flex-col items-center">
              <span className="text-[#94A3B8] text-[11px] uppercase tracking-widest font-bold mb-1">Days to JEE Main</span>
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#3B82F6]">
                148 DAYS, 07:34:15
              </div>
            </div>
          </motion.div>
        </div>

        {/* Today's Focus Card */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:w-[420px] bg-[#0F172A]/60 backdrop-blur-md rounded-[24px] border border-white/5 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-[40px]"></div>
          <h3 className="text-white font-bold text-xl mb-4 relative z-10">Today's Focus</h3>
          <div className="flex items-start gap-4 relative z-10">
            <div className="flex-1">
              <p className="text-[14px] text-white font-medium mb-3 leading-relaxed">
                Focus Area: <span className="text-[#22D3EE]">Rotational Dynamics</span> & <span className="text-[#3B82F6]">Organic Chemistry</span>
              </p>
              <p className="text-[13px] text-[#94A3B8] leading-relaxed">
                Based on recent performance, these are your key areas for improvement. I've prioritised organic chemistry because your Battleground accuracy dropped by 12% in that area last week.
              </p>
            </div>
            <div className="w-16 h-16 shrink-0 relative">
              <div className="absolute inset-0 bg-[#8B5CF6]/20 blur-xl rounded-full"></div>
              <Brain className="w-full h-full text-[#8B5CF6] relative z-10 opacity-80" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Daily Mission Timeline */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">AI Daily Mission</h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] hover:bg-[#22D3EE]/20 transition-all rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
          
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#3B82F6] before:via-[#8B5CF6]/30 before:to-transparent">
            {tasks.map((task, idx) => (
              <motion.div 
                key={task.id || idx} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }} 
                className="relative group"
              >
                <div className={`absolute -left-[29px] top-4 w-3 h-3 rounded-full z-10 transition-colors ${
                  task.completed ? 'bg-[#10B981] shadow-[0_0_10px_#10B981]' : 'bg-[#22D3EE] shadow-[0_0_10px_#22D3EE]'
                }`} />
                <div className={`bg-[#0F172A]/80 backdrop-blur-xl border rounded-[20px] p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden transition-colors ${
                  task.completed ? 'border-[#10B981]/30 opacity-70' : 'border-[#3B82F6]/30'
                }`}>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-4 h-4 text-[#94A3B8]" />
                      <span className="text-[13px] font-semibold text-[#94A3B8]">{task.time || 'Today'}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-[#60A5FA] border border-white/10">
                        {task.subject}
                      </span>
                    </div>
                    <h4 className={`text-[16px] font-bold text-white mb-2 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleToggleTask(task)}
                      className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                        task.completed 
                          ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                      }`}
                      title="Toggle Complete"
                    >
                      <Check className="w-4 h-4" /> {task.completed ? 'Done' : 'Complete'}
                    </button>

                    <Link 
                      to="/focus" 
                      onClick={() => addToast('Starting mission...', 'info')} 
                      className="px-4 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold rounded-xl text-xs hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all text-center"
                    >
                      Focus
                    </Link>

                    <button
                      onClick={() => handleDeleteTask(task)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-[#EF4444] transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Coach Sidebar */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-white mb-2">AI Coach Sidebar</h3>
          
          <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden flex-1 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] p-[2px]">
                  <div className="w-full h-full bg-[#0F172A] rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Nexus AI Coach</h4>
                  <span className="text-[10px] text-[#10B981] flex items-center gap-1 font-medium"><div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div> Online</span>
                </div>
              </div>
              <button onClick={handleMoreOptions} className="text-[#94A3B8] hover:text-white p-1"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            
            {/* Chat Tabs */}
            <div className="flex border-b border-white/5">
              <button className="flex-1 py-3 text-[13px] font-semibold text-white border-b-2 border-[#3B82F6]">Chat</button>
              <button onClick={() => addToast('Viewing quick links', 'info')} className="flex-1 py-3 text-[13px] font-medium text-[#94A3B8] hover:text-white">Quick Links</button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-5 space-y-5 overflow-y-auto max-h-[300px]">
              <div className="text-center text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Nexus AI</div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#3B82F6]/20 flex items-center justify-center shrink-0 mt-1">
                  <Brain className="w-3.5 h-3.5 text-[#3B82F6]" />
                </div>
                <div className="bg-[#1E293B]/80 rounded-2xl rounded-tl-sm p-3.5 text-[13px] text-white/90 leading-relaxed">
                  Welcome back, Alex. I've compiled your plan for today. I've prioritised Organic Chemistry because your Battleground accuracy dropped by 12% in that area last week. Let's focus on mastering those reaction mechanisms.
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <div className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 mr-1">Alex</div>
                <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13px] font-medium inline-block shadow-md">
                  Got it, Nexus. Let's start.
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="p-4 bg-black/20 border-t border-white/5 space-y-2">
              <Link to="/insights" onClick={() => addToast('Opening Performance Insights...', 'info')} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/5">
                <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#8B5CF6]" /> Performance Insights</span>
              </Link>
              <button onClick={handleAskQuestion} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/5">
                <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#22D3EE]" /> Ask a Question</span>
              </button>
              <button onClick={handleViewRoadmap} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/5">
                <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#3B82F6]" /> View Full Roadmap</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Roadmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-8">
        <h3 className="text-xl font-bold text-white mb-6">Weekly Roadmap</h3>
        
        <div className="flex items-center gap-3 relative">
          <button onClick={handleScrollLeft} className="w-8 h-8 rounded-full bg-[#0F172A] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/5 shrink-0 z-10 absolute left-0 -ml-4">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex gap-4 overflow-x-auto pb-4 hide-scrollbar px-6">
            
            {/* Day Cards */}
            {[
              { day: 'Mon, 25 Oct', progress: 85, active: true, icon: 'science' },
              { day: 'Tue, 26 Oct', progress: 65, icon: 'flask' },
              { day: 'Wed, 27 Oct', progress: 42, icon: 'math' },
              { day: 'Thu, 28 Oct', progress: 0, icon: 'science' },
              { day: 'Fri, 29 Oct', progress: 0, icon: 'science' },
              { day: 'Sat, 30 Oct', progress: 0, icon: 'flask' },
              { day: 'Sun, 31 Oct', progress: 0, icon: 'flask' },
            ].map((item, idx) => (
              <div key={idx} onClick={() => addToast(`Viewing plan for ${item.day}`, 'info')} className={`shrink-0 w-[140px] rounded-[20px] p-4 flex flex-col items-center border transition-all cursor-pointer ${item.active ? 'bg-[#0F172A] border-[#22D3EE]/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'bg-[#0F172A]/50 border-white/5 hover:bg-white/5'}`}>
                <span className={`text-[12px] font-semibold mb-4 ${item.active ? 'text-white' : 'text-[#94A3B8]'}`}>{item.day}</span>
                <div className="relative w-14 h-14 mb-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                    {item.progress > 0 && (
                      <path strokeDasharray={`${item.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={item.active ? '#22D3EE' : '#8B5CF6'} strokeWidth="3" strokeLinecap="round" />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {item.icon === 'science' && <Brain className={`w-5 h-5 ${item.active ? 'text-[#22D3EE]' : 'text-[#8B5CF6]'}`} />}
                    {item.icon === 'flask' && <Zap className={`w-5 h-5 ${item.active ? 'text-[#22D3EE]' : 'text-[#8B5CF6]'}`} />}
                    {item.icon === 'math' && <MoreHorizontal className={`w-5 h-5 ${item.active ? 'text-[#22D3EE]' : 'text-[#8B5CF6]'}`} />}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-[13px] font-bold ${item.active ? 'text-white' : 'text-white/80'}`}>{item.progress}%</div>
                  <div className="text-[9px] text-[#94A3B8] uppercase font-bold tracking-wider">Goal Completion</div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleScrollRight} className="w-8 h-8 rounded-full bg-[#0F172A] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/5 shrink-0 z-10 absolute right-0 -mr-4">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Reschedule Button Floating */}
        <div className="flex justify-center mt-6">
           <button onClick={handleReschedule} className="flex items-center gap-3 px-6 py-3 bg-[#0F172A] border border-[#22D3EE]/30 rounded-xl hover:bg-[#22D3EE]/10 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.1)] group">
             <div className="w-8 h-8 rounded-full bg-[#22D3EE]/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-[#22D3EE]" />
             </div>
             <div className="text-left">
               <div className="text-sm font-bold text-white group-hover:text-[#22D3EE] transition-colors">Reschedule</div>
               <div className="text-[10px] text-[#94A3B8]">Re-balance your week instantly with AI</div>
             </div>
           </button>
        </div>

      </motion.div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#22D3EE]" /> Add Mission Task
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Task Title / Topic</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g., Electromagnetic Waves & Optics Practice"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22D3EE]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
                    <select
                      value={newTaskSubject}
                      onChange={(e) => setNewTaskSubject(e.target.value as any)}
                      className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#22D3EE]"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time Slot</label>
                    <input
                      type="text"
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value)}
                      placeholder="e.g., 08:00 - 10:00 AM"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#22D3EE]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white text-xs font-bold hover:shadow-lg transition-all"
                  >
                    Save Mission
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
