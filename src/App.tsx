import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAppStore } from './store/useAppStore';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Battleground from './pages/Battleground/Battleground';
import TestArena from './pages/Battleground/TestArena';
import Driller from './pages/Driller/Driller';
import NexusAI from './pages/NexusAI/NexusAI';
import Planner from './pages/Planner/Planner';
import Insights from './pages/Insights/Insights';
import Focus from './pages/Focus/Focus';
import Vault from './pages/Vault/Vault';
import Login from './pages/Login/Login';

export default function App() {
  const { setUser } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner',
          email: firebaseUser.email || 'learner@neurolearn.ai',
          role: 'student',
          avatarUrl: firebaseUser.photoURL || undefined,
        });

        // Ensure doc exists in Firestore
        try {
          const uRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(uRef);
          if (!snap.exists()) {
            await setDoc(uRef, {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Learner',
              email: firebaseUser.email || '',
              role: 'student',
              targetYear: '2026',
              streakDays: 1,
              totalFocusMinutes: 0,
              questionsSolved: 0,
              accuracyRate: 0,
              createdAt: new Date().toISOString()
            });
          }
        } catch (e) {
          console.error("User doc init error:", e);
        }
      } else {
        // Fallback to local guest user if anonymous auth is restricted or unavailable
        setUser({
          id: 'guest-scholar',
          name: 'Guest Scholar',
          email: 'guest@neurolearn.ai',
          role: 'student',
        });
        // Attempt anonymous auth if enabled on Firebase console, fail silently if restricted
        signInAnonymously(auth).catch(() => {
          // Anonymous authentication is restricted in Firebase console; guest fallback is active
        });
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/battleground" element={<Battleground />} />
          <Route path="/battleground/test" element={<TestArena />} />
          <Route path="/driller" element={<Driller />} />
          <Route path="/nexus-ai" element={<NexusAI />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/mission-control" element={<Navigate to="/" replace />} />
          <Route path="/profile" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Profile (Coming Soon)</h2></div>} />
          <Route path="/settings" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Settings (Coming Soon)</h2></div>} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
