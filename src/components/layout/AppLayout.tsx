import { ReactNode, useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { auth } from '../../lib/firebase';
import { LayoutDashboard, GraduationCap, LineChart, FolderOpen, Bell, Search, Zap, HelpCircle, LogOut, Flame, Target, X, CheckCircle, Info, AlertTriangle, Cpu, Sparkles, Check, Trash2, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface AppLayoutProps {
  children: ReactNode;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'streak' | 'ai' | 'test' | 'resource';
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: '🔥 7-Day Streak Active!',
    description: 'You maintained a 7-day learning momentum. Claim your streak reward now!',
    time: '10m ago',
    unread: true,
    type: 'streak',
    link: '/'
  },
  {
    id: '2',
    title: '🤖 Nexus AI Analysis Ready',
    description: 'Your Physics PYQ scan solution and breakdown have been generated.',
    time: '1h ago',
    unread: true,
    type: 'ai',
    link: '/nexus-ai'
  },
  {
    id: '3',
    title: '⚡ New Practice Drill Available',
    description: 'Targeted Organic Chemistry drill set unlocked in Driller mode.',
    time: '3h ago',
    unread: true,
    type: 'test',
    link: '/driller'
  },
  {
    id: '4',
    title: '📚 New Formulas Added to Vault',
    description: 'JEE Advanced Electrostatics formula quick-sheets added to Resources.',
    time: '1d ago',
    unread: false,
    type: 'resource',
    link: '/vault'
  }
];

export function AppLayout({ children }: AppLayoutProps) {
  const { user, toasts, removeToast, addToast } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    addToast('All notifications marked as read', 'info');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    addToast('Notifications cleared', 'info');
  };

  const markSingleAsRead = (id: string, link?: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    if (link) {
      setShowNotifications(false);
      navigate(link);
    }
  };

  if (isLogin) {
     return (
       <>
         {children}
         <ToastContainer toasts={toasts} removeToast={removeToast} />
       </>
     );
  }

  return (
    <div className="bg-[#050816] text-[#F8FAFC] min-h-screen font-body-md selection:bg-[#3B82F6]/30">
      {/* Side Navigation (Desktop) */}
      <aside className="fixed left-0 top-0 h-full w-[260px] z-40 bg-[#050816] border-r border-white/5 flex flex-col py-6 px-4 hidden md:flex">
        {/* Brand Logo */}
        <Link to="/" className="mb-10 px-3 flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4] p-[1.5px] shadow-[0_0_20px_rgba(139,92,246,0.35)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-300">
            <div className="w-full h-full bg-[#070B19] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/20 to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Cpu className="w-6 h-6 text-[#22D3EE] group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <h1 className="text-[19px] font-extrabold tracking-tight text-white leading-tight flex items-center gap-1">
              NEUROLEARN <span className="bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6] text-transparent bg-clip-text">AI</span>
            </h1>
            <p className="text-[10px] text-[#94A3B8] tracking-widest uppercase font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#22D3EE]" /> Intelligence Platform
            </p>
          </div>
        </Link>
        
        <nav className="flex-1 space-y-1.5">
          <NavLink to="/" className={({isActive}) => `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out font-medium text-[15px] ${isActive ? 'text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/nexus-ai" className={({isActive}) => `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out font-medium text-[15px] ${isActive ? 'text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}>
            <Zap className="w-5 h-5" />
            <span>Nexus AI</span>
          </NavLink>
          <NavLink to="/battleground" className={({isActive}) => `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out font-medium text-[15px] ${isActive ? 'text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}>
            <GraduationCap className="w-5 h-5" />
            <span>Courses</span>
          </NavLink>
          <NavLink to="/driller" className={({isActive}) => `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out font-medium text-[15px] ${isActive ? 'text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}>
            <Flame className="w-5 h-5" />
            <span>Driller</span>
          </NavLink>
          <NavLink to="/planner" className={({isActive}) => `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out font-medium text-[15px] ${isActive ? 'text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}>
            <Target className="w-5 h-5" />
            <span>Mission Planner</span>
          </NavLink>
          <NavLink to="/insights" className={({isActive}) => `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out font-medium text-[15px] ${isActive ? 'text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}>
            <LineChart className="w-5 h-5" />
            <span>Analytics</span>
          </NavLink>
          <NavLink to="/vault" className={({isActive}) => `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out font-medium text-[15px] ${isActive ? 'text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}>
            <FolderOpen className="w-5 h-5" />
            <span>Resources</span>
          </NavLink>
        </nav>
        
        <div className="mt-auto pt-6 space-y-2">
          <NavLink to="/focus" className="w-full h-12 mb-4 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300">
            <Zap className="w-4 h-4 fill-current" />
            Start Focus Session
          </NavLink>
          <button onClick={() => addToast('Opening Help & Support...', 'info')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-xl text-[14px] transition-all">
            <HelpCircle className="w-5 h-5" />
            <span>Help & Support</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="relative z-10 md:ml-[260px] min-h-screen pb-32 md:pb-12 bg-[#050816]">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 h-20 px-6 md:px-10 flex items-center justify-between bg-[#050816]/90 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Logo */}
            <Link to="/" className="md:hidden flex items-center gap-2.5 text-base font-bold text-white shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] p-[1px] shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                <div className="w-full h-full bg-[#070B19] rounded-[11px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-[#22D3EE]" />
                </div>
              </div>
              <span className="text-sm font-extrabold tracking-tight">NEUROLEARN <span className="text-[#22D3EE]">AI</span></span>
            </Link>
            <div className="relative w-full max-w-[420px] hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] w-5 h-5" />
              <input 
                className="w-full bg-[#0F172A]/80 border border-white/5 rounded-full pl-12 pr-4 py-3 text-[14px] text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6]/50 focus:bg-[#0F172A] transition-all" 
                placeholder="Search the NeuroVerse..." 
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addToast(`Searching for: ${e.currentTarget.value}`, 'info');
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 relative" ref={notifRef}>
            {/* Notifications Button */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className={`text-[#94A3B8] hover:text-white transition-colors relative p-2 rounded-xl border border-transparent ${showNotifications ? 'bg-white/10 text-white border-white/10' : 'hover:bg-white/5'}`} 
              title="Notifications"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] border-2 border-[#050816] text-[9px] font-bold text-white flex items-center justify-center rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Drawer */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-14 w-[340px] sm:w-[380px] bg-[#0F172A] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden backdrop-blur-2xl"
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#22D3EE]" />
                      <h3 className="font-bold text-sm text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead} 
                          className="text-[11px] font-medium text-[#94A3B8] hover:text-[#22D3EE] flex items-center gap-1 transition-colors"
                          title="Mark all as read"
                        >
                          <Check className="w-3 h-3" /> Read all
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearAllNotifications} 
                          className="text-[11px] font-medium text-[#94A3B8] hover:text-[#EF4444] transition-colors p-1"
                          title="Clear all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5 no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-[#94A3B8]">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-xs font-medium">No notifications right now</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => markSingleAsRead(notif.id, notif.link)}
                          className={`p-4 hover:bg-white/5 transition-all cursor-pointer flex items-start gap-3 relative ${notif.unread ? 'bg-[#3B82F6]/5' : ''}`}
                        >
                          {notif.unread && (
                            <span className="absolute left-1.5 top-5 w-2 h-2 rounded-full bg-[#22D3EE]" />
                          )}
                          <div className={`p-2 rounded-xl shrink-0 ${
                            notif.type === 'streak' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                            notif.type === 'ai' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' :
                            notif.type === 'test' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                            'bg-[#10B981]/10 text-[#10B981]'
                          }`}>
                            {notif.type === 'streak' && <Flame className="w-4 h-4" />}
                            {notif.type === 'ai' && <Zap className="w-4 h-4" />}
                            {notif.type === 'test' && <Target className="w-4 h-4" />}
                            {notif.type === 'resource' && <FolderOpen className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-semibold text-white truncate">{notif.title}</h4>
                              <span className="text-[10px] text-[#94A3B8] shrink-0">{notif.time}</span>
                            </div>
                            <p className="text-[12px] text-[#94A3B8] mt-1 leading-snug line-clamp-2">{notif.description}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Link */}
            <Link to="/login" title="Account / Sign In" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[#0F172A] border border-[#3B82F6]/30 text-[#22D3EE] font-semibold hover:bg-[#3B82F6]/20 transition-colors text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Link>

            {/* Sign Out Button */}
            <button 
              onClick={async () => {
                try {
                  await auth.signOut();
                } catch (e) {
                  console.error(e);
                }
                useAppStore.getState().setUser(null);
                addToast('Signed out successfully', 'info');
                navigate('/login');
              }} 
              title="Sign Out" 
              className="text-[#94A3B8] hover:text-[#EF4444] transition-colors p-1"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="py-6 pt-24 md:pt-6 min-h-[calc(100vh-5rem)]">
          {children}
        </div>
      </main>

      {/* Mobile Navigation (Mobile Only) */}
      <nav className="fixed top-20 left-0 right-0 w-full bg-[#0F172A]/95 backdrop-blur-3xl border-b border-white/10 z-40 flex justify-around items-center h-16 px-2 md:hidden">
        <NavLink to="/" className={({isActive}) => `flex flex-col items-center justify-center transition-all ${isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8] hover:text-white'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Explore</span>
        </NavLink>
        <NavLink to="/vault" className={({isActive}) => `flex flex-col items-center justify-center transition-all ${isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8] hover:text-white'}`}>
          <FolderOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Resources</span>
        </NavLink>
        <NavLink to="/nexus-ai" className="flex items-center justify-center bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white rounded-full w-12 h-12 shadow-[0_0_20px_rgba(139,92,246,0.5)] scale-90">
          <Zap className="w-5 h-5 fill-current" />
        </NavLink>
        <NavLink to="/driller" className={({isActive}) => `flex flex-col items-center justify-center transition-all ${isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8] hover:text-white'}`}>
          <Flame className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Driller</span>
        </NavLink>
        <NavLink to="/planner" className={({isActive}) => `flex flex-col items-center justify-center transition-all ${isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8] hover:text-white'}`}>
          <Target className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Planner</span>
        </NavLink>
      </nav>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

function ToastContainer({ toasts, removeToast }: { toasts: any[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md min-w-[280px]
              ${toast.type === 'success' ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]' : 
                toast.type === 'error' ? 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]' : 
                'bg-[#3B82F6]/10 border-[#3B82F6]/30 text-[#3B82F6]'}`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium text-white flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="text-white/50 hover:text-white transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

