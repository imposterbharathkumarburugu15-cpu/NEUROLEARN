import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Brain, Award, Target, Zap, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

interface SubjectSkillData {
  userId: string;
  subject: string;
  userScore: number;
  topperScore: number;
  fullMark: number;
  category: 'Math' | 'Physics' | 'Chemistry' | 'General';
  filterType: 'overall' | 'math' | 'physics' | 'chemistry';
}

type SeedSubjectData = Omit<SubjectSkillData, 'userId' | 'filterType'>;

const OVERALL_MPC_DATA: SeedSubjectData[] = [
  { subject: 'Math: Calculus', userScore: 88, topperScore: 92, fullMark: 100, category: 'Math' },
  { subject: 'Math: Algebra & Vectors', userScore: 82, topperScore: 90, fullMark: 100, category: 'Math' },
  { subject: 'Physics: Mechanics', userScore: 85, topperScore: 88, fullMark: 100, category: 'Physics' },
  { subject: 'Physics: Electrodynamics', userScore: 78, topperScore: 86, fullMark: 100, category: 'Physics' },
  { subject: 'Chem: Organic Reactions', userScore: 64, topperScore: 85, fullMark: 100, category: 'Chemistry' },
  { subject: 'Chem: Physical & Kinetics', userScore: 76, topperScore: 84, fullMark: 100, category: 'Chemistry' },
];

const MATH_DEEP_DIVE: SeedSubjectData[] = [
  { subject: 'Differential Calculus', userScore: 90, topperScore: 94, fullMark: 100, category: 'Math' },
  { subject: 'Integral Calculus', userScore: 86, topperScore: 90, fullMark: 100, category: 'Math' },
  { subject: 'Coordinate Geometry', userScore: 80, topperScore: 88, fullMark: 100, category: 'Math' },
  { subject: 'Vectors & 3D', userScore: 84, topperScore: 92, fullMark: 100, category: 'Math' },
  { subject: 'Matrices & Determinants', userScore: 92, topperScore: 95, fullMark: 100, category: 'Math' },
  { subject: 'Trigonometry', userScore: 78, topperScore: 85, fullMark: 100, category: 'Math' },
];

const PHYSICS_DEEP_DIVE: SeedSubjectData[] = [
  { subject: 'Rotational Motion', userScore: 82, topperScore: 89, fullMark: 100, category: 'Physics' },
  { subject: 'Electrostatics & Optics', userScore: 76, topperScore: 88, fullMark: 100, category: 'Physics' },
  { subject: 'Thermodynamics', userScore: 88, topperScore: 90, fullMark: 100, category: 'Physics' },
  { subject: 'Modern Physics', userScore: 90, topperScore: 92, fullMark: 100, category: 'Physics' },
  { subject: 'Magnetism & EMI', userScore: 80, topperScore: 85, fullMark: 100, category: 'Physics' },
  { subject: 'Fluids & Waves', userScore: 74, topperScore: 82, fullMark: 100, category: 'Physics' },
];

const CHEM_DEEP_DIVE: SeedSubjectData[] = [
  { subject: 'General Organic Chem (GOC)', userScore: 68, topperScore: 88, fullMark: 100, category: 'Chemistry' },
  { subject: 'Coordination Compounds', userScore: 62, topperScore: 86, fullMark: 100, category: 'Chemistry' },
  { subject: 'Chemical Kinetics', userScore: 78, topperScore: 84, fullMark: 100, category: 'Chemistry' },
  { subject: 'Thermodynamics & Equilibrium', userScore: 82, topperScore: 89, fullMark: 100, category: 'Chemistry' },
  { subject: 'Electrochemistry', userScore: 75, topperScore: 83, fullMark: 100, category: 'Chemistry' },
  { subject: 'p-Block & d-Block', userScore: 70, topperScore: 85, fullMark: 100, category: 'Chemistry' },
];

export function MPCProficiencyRadar() {
  const [activeFilter, setActiveFilter] = useState<'overall' | 'math' | 'physics' | 'chemistry'>('overall');
  const [chartData, setChartData] = useState<SubjectSkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, addToast } = useAppStore();

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      setLoading(true);

      try {
        const profRef = collection(db, 'users', user.id, 'proficiency');
        const q = query(profRef, where('filterType', '==', activeFilter));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          // Seed the database with our seed data if empty
          let seedData: SeedSubjectData[] = [];
          switch (activeFilter) {
            case 'math': seedData = MATH_DEEP_DIVE; break;
            case 'physics': seedData = PHYSICS_DEEP_DIVE; break;
            case 'chemistry': seedData = CHEM_DEEP_DIVE; break;
            default: seedData = OVERALL_MPC_DATA; break;
          }
          
          const promises = seedData.map(async (item) => {
            const newDocId = `${activeFilter}-${item.subject.replace(/[^a-zA-Z0-9]/g, '')}`;
            const fullItem: SubjectSkillData = {
              ...item,
              userId: user.id,
              filterType: activeFilter
            };
            await setDoc(doc(profRef, newDocId), fullItem);
            return fullItem;
          });
          
          const createdData = await Promise.all(promises);
          setChartData(createdData);
        } else {
          const loadedData = snapshot.docs.map(doc => doc.data() as SubjectSkillData);
          setChartData(loadedData);
        }
      } catch (error) {
        console.error("Error loading proficiency data:", error);
        addToast("Failed to load proficiency data", "error");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.id, activeFilter, addToast]);

  // Calculate averages safely
  const avgUser = chartData.length > 0 ? Math.round(chartData.reduce((acc, curr) => acc + curr.userScore, 0) / chartData.length) : 0;
  const avgTopper = chartData.length > 0 ? Math.round(chartData.reduce((acc, curr) => acc + curr.topperScore, 0) / chartData.length) : 0;

  const handleFilterChange = (filter: 'overall' | 'math' | 'physics' | 'chemistry') => {
    setActiveFilter(filter);
    addToast(`Switched radar view to ${filter.toUpperCase()} analytics`, 'info');
  };

  if (loading || chartData.length === 0) {
    return (
      <div className="bg-[#0F172A]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex items-center justify-center h-[500px]">
        <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
        <span className="ml-3 text-slate-300 font-medium">Loading proficiency data...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#0F172A]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#3B82F6]/10 via-[#8B5CF6]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight">
              MPC Subject Proficiency Radar
            </h3>
            <span className="px-2.5 py-0.5 bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6] text-[11px] font-bold rounded-full uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Analytics
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Visualizing question-solving accuracy & velocity across Mathematics, Physics, and Chemistry
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-[#1E293B] p-1 rounded-xl border border-white/10 self-stretch md:self-auto">
          {(['overall', 'math', 'physics', 'chemistry'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeFilter === filter
                  ? 'bg-[#3B82F6] text-white shadow-lg'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Top Benchmark Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 relative z-10">
        <div className="bg-[#050816]/60 border border-white/5 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">Your Avg Score</span>
          <span className="text-xl font-extrabold text-[#3B82F6]">{avgUser}%</span>
        </div>
        <div className="bg-[#050816]/60 border border-white/5 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">Topper Benchmark</span>
          <span className="text-xl font-extrabold text-[#EAB308]">{avgTopper}%</span>
        </div>
        <div className="bg-[#050816]/60 border border-white/5 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">Strongest Area</span>
          <span className="text-xs font-bold text-[#10B981] truncate block mt-1">
            {chartData.length > 0 ? chartData.reduce((prev, curr) => (curr.userScore > prev.userScore ? curr : prev)).subject : '-'}
          </span>
        </div>
        <div className="bg-[#050816]/60 border border-white/5 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">Growth Focus</span>
          <span className="text-xs font-bold text-[#EF4444] truncate block mt-1">
            {chartData.length > 0 ? chartData.reduce((prev, curr) => (curr.userScore < prev.userScore ? curr : prev)).subject : '-'}
          </span>
        </div>
      </div>

      {/* Radar Chart Area */}
      <div className="w-full h-[360px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.15)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#CBD5E1', fontSize: 11, fontWeight: 600 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#64748B', fontSize: 9 }} 
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as SubjectSkillData;
                  return (
                    <div className="bg-[#0F172A] border border-white/20 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                      <p className="font-bold text-white mb-1">{data.subject}</p>
                      <p className="text-[#3B82F6] font-semibold">Your Proficiency: {data.userScore}%</p>
                      <p className="text-[#EAB308] font-semibold">Topper Score: {data.topperScore}%</p>
                      <p className="text-[#94A3B8] text-[10px]">Gap: {data.topperScore - data.userScore}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} 
              formatter={(value) => <span className="text-slate-300 font-semibold">{value}</span>}
            />
            <Radar
              name="Your Performance"
              dataKey="userScore"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.45}
            />
            <Radar
              name="JEE Topper Benchmark"
              dataKey="topperScore"
              stroke="#EAB308"
              fill="#EAB308"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
