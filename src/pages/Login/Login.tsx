import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Cpu, Sparkles, UserCheck } from 'lucide-react';
import { AuroraShader } from '../../components/AuroraShader';
import { NexusOrb3D } from '../../components/NexusOrb3D';
import { auth, db } from '../../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAppStore } from '../../store/useAppStore';

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useAppStore();
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const syncUserDoc = async (uid: string, name: string, userEmail: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          uid,
          name: name || userEmail.split('@')[0] || 'NeuroLearner',
          email: userEmail,
          role: 'student',
          targetYear: '2026',
          streakDays: 1,
          totalFocusMinutes: 0,
          questionsSolved: 0,
          accuracyRate: 0,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Error creating user doc:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          // Attempt to create user if not existing
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw err;
        }
      }
      if (userCredential?.user) {
        await syncUserDoc(userCredential.user.uid, userCredential.user.displayName || email.split('@')[0], email);
        addToast('Signed in successfully!', 'success');
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Authentication failed. Please check credentials.');
      addToast('Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      if (res.user) {
        await syncUserDoc(res.user.uid, res.user.displayName || 'Google User', res.user.email || '');
        addToast(`Welcome, ${res.user.displayName || 'Learner'}!`, 'success');
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Google sign in failed');
      addToast('Google Sign in failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const res = await signInAnonymously(auth);
      if (res.user) {
        await syncUserDoc(res.user.uid, 'Guest Scholar', 'guest@neurolearn.ai');
      }
    } catch (err: any) {
      console.warn("Anonymous auth disabled or restricted, using guest session fallback:", err?.message);
    } finally {
      setIsLoading(false);
      addToast('Signed in as Guest Scholar', 'info');
      navigate('/');
    }
  };

  return (
    <div className="bg-[#050816] text-[#F8FAFC] font-body-md overflow-hidden h-screen w-screen selection:bg-[#3B82F6]/30">
      <main className="flex h-full w-full relative">
        {/* Left Side: AI Ecosystem (Hidden on Mobile) */}
        <section className="hidden lg:flex flex-1 relative bg-black overflow-hidden items-center justify-center p-[48px]">
          {/* Deep Aurora Background Shader */}
          <div className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen">
            <AuroraShader />
          </div>

          {/* Nexus AI Orb 3D Scene */}
          <div className="absolute inset-0 w-full h-full z-10 mix-blend-screen opacity-90">
            <NexusOrb3D />
          </div>

          {/* Floating Animated Symbols Overlay */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <motion.span 
              animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute text-[#22D3EE]/30 pointer-events-none font-code-sm text-2xl" 
              style={{ top: '15%', left: '10%' }}
            >
              π
            </motion.span>
            <motion.span 
              animate={{ y: [15, -15, 15], rotate: [0, -10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute text-[#8B5CF6]/30 pointer-events-none font-code-sm text-3xl" 
              style={{ top: '70%', left: '15%' }}
            >
              ∫
            </motion.span>
            <motion.span 
              animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="material-symbols-outlined absolute text-[#3B82F6]/20 pointer-events-none" 
              style={{ top: '25%', right: '15%', fontSize: '40px' }}
            >
              science
            </motion.span>
            <motion.span 
              animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="material-symbols-outlined absolute text-[#22D3EE]/20 pointer-events-none" 
              style={{ bottom: '20%', right: '10%', fontSize: '48px' }}
            >
              hub
            </motion.span>
          </div>

          {/* Soft Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent pointer-events-none z-25"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050816]/40 to-[#050816] pointer-events-none z-25"></div>

          {/* Left Content Bottom */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-[48px] left-[48px] z-30 max-w-lg"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md">
              <span className="w-2 h-2 bg-[#22D3EE] rounded-full animate-pulse shadow-[0_0_8px_#22D3EE]"></span>
              <span className="font-label-sm text-[#94A3B8] text-[11px] uppercase tracking-widest">Neural Network Online</span>
            </div>
            <h2 className="font-headline-lg text-white leading-[1.1] opacity-90 text-[32px] md:text-[56px] font-bold tracking-tight">
              The Future of Cognition.<br />
              <span className="bg-gradient-to-r from-[#3B82F6] via-[#22D3EE] to-[#8B5CF6] text-transparent bg-clip-text">Personalized.</span>
            </h2>
          </motion.div>
        </section>

        {/* Right Side: Authentication Panel */}
        <section className="flex-1 flex items-center justify-center p-4 md:p-[48px] relative z-40 bg-[#050816]">
          {/* Subtle background noise/gradient for right side */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
             <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/10 blur-[120px]"></div>
             <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#3B82F6]/10 blur-[120px]"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[480px] rounded-3xl p-8 md:p-10 flex flex-col gap-8 relative overflow-hidden"
            style={{
              background: '#0F172A',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            {/* Top glass reflection */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Header */}
            <header className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] p-[1px]">
                  <div className="w-full h-full bg-[#0F172A] rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/20 to-[#8B5CF6]/20"></div>
                    <Cpu className="w-5 h-5 text-[#F8FAFC] relative z-10" />
                  </div>
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full blur-[8px] opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative px-4 py-1.5 rounded-full bg-[#0F172A] border border-[rgba(255,255,255,0.1)] text-[#22D3EE] font-label-md text-[13px] flex items-center gap-2 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                  </motion.div>
                  <span className="font-semibold tracking-wide">Powered by Nexus AI</span>
                  <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[200%] transition-all duration-1000 ease-out"></div>
                </div>
              </motion.div>
            </header>

            {/* Headline & Subtitle */}
            <div className="flex flex-col gap-2.5">
              <h1 className="font-headline-lg text-[32px] font-bold text-[#F8FAFC] tracking-tight">
                Welcome to your Neural Workspace
              </h1>
              <p className="font-body-md text-[16px] text-[#94A3B8] leading-relaxed">
                Experience precision learning driven by world-class artificial intelligence.
              </p>
            </div>

            {/* Error banner if auth failed */}
            {authError && (
              <div className="bg-[#EF4444]/20 border border-[#EF4444]/40 p-3 rounded-xl text-xs text-[#FCA5A5] font-medium">
                {authError}
              </div>
            )}

            {/* Google Auth & Guest Auth */}
            <div className="flex flex-col gap-2">
              <motion.button 
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-[48px] flex items-center justify-center gap-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] transition-all duration-300 relative overflow-hidden group"
              >
                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="font-label-md text-[#F8FAFC] text-[14px] font-medium relative z-10">Sign in with Google</span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(34,211,238,0.1)' }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full h-[48px] flex items-center justify-center gap-2 rounded-xl border border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE] hover:bg-[#22D3EE]/20 transition-all font-medium text-[14px]"
              >
                <UserCheck className="w-4 h-4" />
                <span>Continue as Guest Scholar</span>
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[rgba(255,255,255,0.08)]"></div>
              <span className="flex-shrink mx-4 text-[#94A3B8] font-label-md text-[11px] uppercase tracking-widest">or continue with neural key</span>
              <div className="flex-grow border-t border-[rgba(255,255,255,0.08)]"></div>
            </div>

            {/* Auth Form */}
            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="group flex flex-col gap-1.5 relative">
                <motion.label 
                  animate={{ y: emailFocused ? -2 : 0 }}
                  className="text-[#94A3B8] font-label-md text-[13px] ml-1 transition-colors group-focus-within:text-[#22D3EE]"
                >
                  Email address
                </motion.label>
                <div 
                  className="flex items-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 h-[52px] transition-all duration-300 relative overflow-hidden"
                  style={{
                    borderColor: emailFocused ? 'rgba(34,211,238,0.5)' : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: emailFocused ? '0 0 0 1px rgba(34,211,238,0.5), 0 0 15px rgba(34,211,238,0.1)' : 'none',
                    background: emailFocused ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)'
                  }}
                >
                  <Mail className={`w-5 h-5 mr-3 transition-colors duration-300 ${emailFocused ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`} />
                  <input 
                    className="bg-transparent border-none focus:ring-0 focus:outline-none w-full font-body-md text-[#F8FAFC] placeholder:text-[#94A3B8]/50" 
                    placeholder="name@company.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    required
                  />
                  
                  <AnimatePresence>
                    {emailFocused && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] w-full"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Password Field */}
              <div className="group flex flex-col gap-1.5 relative">
                <div className="flex justify-between items-center ml-1">
                  <motion.label 
                    animate={{ y: passFocused ? -2 : 0 }}
                    className="text-[#94A3B8] font-label-md text-[13px] transition-colors group-focus-within:text-[#8B5CF6]"
                  >
                    Security Key
                  </motion.label>
                  <a className="text-[#94A3B8] text-[13px] hover:text-[#8B5CF6] hover:underline transition-all" href="#">Forgot?</a>
                </div>
                <div 
                  className="flex items-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 h-[52px] transition-all duration-300 relative overflow-hidden"
                  style={{
                    borderColor: passFocused ? 'rgba(139,92,246,0.5)' : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: passFocused ? '0 0 0 1px rgba(139,92,246,0.5), 0 0 15px rgba(139,92,246,0.1)' : 'none',
                    background: passFocused ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)'
                  }}
                >
                  <Lock className={`w-5 h-5 mr-3 transition-colors duration-300 ${passFocused ? 'text-[#8B5CF6]' : 'text-[#94A3B8]'}`} />
                  <input 
                    className="bg-transparent border-none focus:ring-0 focus:outline-none w-full font-body-md text-[#F8FAFC] placeholder:text-[#94A3B8]/50" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPassFocused(true)}
                    onBlur={() => setPassFocused(false)}
                    required
                  />
                  <button 
                    className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors focus:outline-none" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>

                  <AnimatePresence>
                    {passFocused && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] w-full"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-3 group cursor-pointer w-fit ml-1 mt-1">
                <div className="relative flex items-center justify-center">
                  <input className="peer w-5 h-5 rounded border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] text-[#3B82F6] focus:ring-[#3B82F6]/30 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer appearance-none checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-all" type="checkbox" />
                  <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-[#94A3B8] font-label-md text-[13px] select-none group-hover:text-[#F8FAFC] transition-colors">Stay synced on this device</span>
              </label>

              {/* CTA */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full h-[56px] rounded-xl text-white font-semibold text-[16px] flex items-center justify-center gap-2 mt-4 relative overflow-hidden group shadow-[0_10px_25px_-5px_rgba(59,130,246,0.4)]"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #22D3EE 50%, #8B5CF6 100%)',
                  backgroundSize: '200% 200%',
                }}
              >
                {/* Animated gradient background */}
                <motion.div 
                  animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 z-0 opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #22D3EE 50%, #8B5CF6 100%)',
                    backgroundSize: '200% 200%',
                  }}
                />
                
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full relative z-10"
                  />
                ) : (
                  <>
                    <span className="relative z-10 tracking-wide">Continue Learning</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                
                {/* Glare effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out z-10"></div>
              </motion.button>
            </form>

            {/* Footer Links */}
            <footer className="mt-auto pt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 border-t border-[rgba(255,255,255,0.08)]">
              <a className="text-[#94A3B8] opacity-80 hover:opacity-100 hover:text-[#22D3EE] transition-all font-label-md text-[12px]" href="#">Privacy Policy</a>
              <a className="text-[#94A3B8] opacity-80 hover:opacity-100 hover:text-[#22D3EE] transition-all font-label-md text-[12px]" href="#">Terms of Service</a>
              <a className="text-[#94A3B8] opacity-80 hover:opacity-100 hover:text-[#22D3EE] transition-all font-label-md text-[12px]" href="#">Help Center</a>
            </footer>
          </motion.div>

        </section>
      </main>
    </div>
  );
}
