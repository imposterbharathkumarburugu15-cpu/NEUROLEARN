import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Calendar, Clock, TrendingUp, Shield, Trophy, Play, FlaskConical, Lightbulb, Brain, Bookmark, ArrowLeft } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAppStore } from '../../store/useAppStore';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';

function Fraction({ num, den }: { num: React.ReactNode, den: React.ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-sm">
      <span className="border-b border-white/30 px-1 leading-none pb-0.5">{num}</span>
      <span className="leading-none pt-1 px-1">{den}</span>
    </span>
  );
}

function MathVar({ children }: { children: React.ReactNode }) {
  return <span className="font-serif italic mr-[1px]">{children}</span>;
}

function Vector({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-0.5 leading-none">
      <span className="text-[8px] leading-none mb-[-2px]">→</span>
      <span className="font-bold font-serif">{children}</span>
    </span>
  );
}

function DiagramSVG() {
  return (
    <svg width="240" height="180" viewBox="0 0 240 180" className="relative z-10 text-white/80 overflow-visible">
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill="currentColor" opacity="0.4"/>
        </marker>
        <marker id="arrowhead-cyan" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill="#22D3EE"/>
        </marker>
      </defs>
      
      {/* Axes */}
      <line x1="40" y1="140" x2="220" y2="140" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" markerEnd="url(#arrowhead)"/>
      <line x1="40" y1="160" x2="40" y2="10" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" markerEnd="url(#arrowhead)"/>
      
      {/* Field Lines from q to -2q (approx) */}
      <path d="M 45 140 Q 115 60 185 140" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7"/>
      <path d="M 45 140 Q 115 100 185 140" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7"/>
      <path d="M 45 140 Q 115 140 185 140" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7"/>
      <path d="M 45 140 Q 115 180 185 140" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7"/>
      <path d="M 45 140 Q 115 220 185 140" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7"/>

      {/* Point P Vector */}
      <line x1="40" y1="50" x2="40" y2="15" stroke="#22D3EE" strokeWidth="2" markerEnd="url(#arrowhead-cyan)"/>
      <line x1="40" y1="50" x2="80" y2="50" stroke="#22D3EE" strokeWidth="2" markerEnd="url(#arrowhead-cyan)"/>
      <line x1="40" y1="50" x2="70" y2="25" stroke="#22D3EE" strokeWidth="2" markerEnd="url(#arrowhead-cyan)"/>
      
      <circle cx="40" cy="50" r="3" fill="#F8FAFC" />
      <text x="25" y="55" fill="currentColor" fontSize="12" fontStyle="italic">P</text>
      <text x="25" y="95" fill="currentColor" fontSize="12" fontStyle="italic">y</text>
      
      {/* Charges */}
      <circle cx="40" cy="140" r="6" fill="#3B82F6" />
      <text x="36" y="158" fill="#3B82F6" fontSize="12" fontStyle="italic">q</text>
      
      <circle cx="190" cy="140" r="8" fill="#8B5CF6" />
      <text x="180" y="158" fill="#8B5CF6" fontSize="12" fontStyle="italic">-2q</text>
      
      {/* Distances */}
      <line x1="40" y1="175" x2="190" y2="175" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="40" y1="170" x2="40" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="190" y1="170" x2="190" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <text x="110" y="172" fill="currentColor" fontSize="12" fontStyle="italic">d</text>
      
      {/* Vector Labels */}
      <text x="50" y="15" fill="#22D3EE" fontSize="10">E₁</text>
      <text x="80" y="20" fill="#22D3EE" fontSize="10">E</text>
      <text x="85" y="55" fill="#22D3EE" fontSize="10">E₂</text>
    </svg>
  );
}

function OptionCard({ option, isSelected, isCorrect, hasSubmitted, children, onClick }: { option: string, isSelected?: boolean, isCorrect?: boolean, hasSubmitted?: boolean, children: React.ReactNode, onClick: () => void }) {
  let bgColor = 'bg-[#0F172A]/50 hover:bg-[#0F172A]/80';
  let borderColor = 'border-white/5 hover:border-white/20';
  let shadow = '';

  if (hasSubmitted) {
    if (isCorrect) {
      bgColor = 'bg-[#10B981]/10';
      borderColor = 'border-[#10B981]/50';
      shadow = 'shadow-[0_0_20px_rgba(16,185,129,0.15)]';
    } else if (isSelected && !isCorrect) {
      bgColor = 'bg-[#EF4444]/10';
      borderColor = 'border-[#EF4444]/50';
      shadow = 'shadow-[0_0_20px_rgba(239,68,68,0.15)]';
    }
  } else if (isSelected) {
    bgColor = 'bg-[#3B82F6]/10';
    borderColor = 'border-[#3B82F6]/50';
    shadow = 'shadow-[0_0_20px_rgba(59,130,246,0.15)]';
  }

  return (
    <div 
      onClick={onClick}
      className={`relative px-6 py-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 ${bgColor} ${borderColor} ${shadow}`}
    >
      {isSelected && !hasSubmitted && <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/10 to-[#3B82F6]/0 blur-md pointer-events-none rounded-2xl"></div>}
      <span className={`text-lg font-bold shrink-0 ${isSelected || (hasSubmitted && isCorrect) ? 'text-white' : 'text-[#94A3B8]'}`}>{option})</span>
      <div className={`text-sm font-serif flex items-center flex-wrap gap-y-2 ${isSelected || (hasSubmitted && isCorrect) ? 'text-white' : 'text-[#94A3B8]'}`}>
        {children}
      </div>
    </div>
  );
}

function ToolbarBtn({ icon: Icon, label, isActive }: { icon: React.ElementType, label: string, isActive?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-start gap-1.5 w-[72px] h-[64px] p-2 rounded-xl cursor-pointer transition-all relative group ${isActive ? 'bg-[rgba(59,130,246,0.15)]' : 'hover:bg-white/5'}`}>
      {isActive && <div className="absolute inset-0 bg-gradient-to-b from-[#22D3EE]/20 to-transparent rounded-xl opacity-50 blur-[2px]"></div>}
      <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8] group-hover:text-white'}`} />
      <span className={`text-[9px] text-center font-medium leading-[1.2] relative z-10 ${isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-[#E2E8F0]'}`}>
        {label}
      </span>
    </div>
  );
}

export default function Driller() {
  const { user, addToast } = useAppStore();
  const [isDrilling, setIsDrilling] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [mastery, setMastery] = useState(72);
  const [streak, setStreak] = useState(18);

  const correctAnswer = 'A';

  const handleOptionClick = (opt: string) => {
    if (!hasSubmitted) {
      setSelectedOption(opt);
    }
  };

  const handleSubmit = async () => {
    if (selectedOption && !hasSubmitted) {
      setHasSubmitted(true);
      const isCorrect = selectedOption === correctAnswer;
      if (isCorrect) {
        setMastery(prev => Math.min(100, prev + 2));
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }

      // Save question response to Firestore
      if (user?.id) {
        try {
          await addDoc(collection(db, 'test_results'), {
            userId: user.id,
            testTitle: 'Driller Electrostatics Question ' + currentQuestion,
            subject: 'Physics',
            selectedOption,
            correctAnswer,
            isCorrect,
            score: isCorrect ? 4 : -1,
            timestamp: new Date().toISOString()
          });

          // Update user metrics
          const userRef = doc(db, 'users', user.id);
          await updateDoc(userRef, {
            questionsSolved: increment(1),
            streakDays: isCorrect ? increment(0) : 1
          }).catch(() => {});
        } catch (e) {
          console.error("Error saving driller response to Firestore:", e);
        }
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < 20) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    } else {
      setIsDrilling(false);
      setCurrentQuestion(1);
      setSelectedOption(null);
      setHasSubmitted(false);
    }
  };

  const OptionAContent = (
    <>
      <MathVar>E_P</MathVar> = 
      <Fraction num={<span><MathVar>kq</MathVar></span>} den={<span><MathVar>y</MathVar>²</span>} />
      <span className="mx-1 text-xl leading-none font-light">(</span>
      1 - 
      <Fraction num={<span>2<MathVar>d</MathVar>³</span>} den={<span>(<MathVar>d</MathVar>² + <MathVar>y</MathVar>²)<sup className="text-[10px]">3/2</sup></span>} />
      <span className="mx-1 text-xl leading-none font-light">)</span>
      <Vector>j</Vector>
      <span className="mx-2">-</span>
      <Fraction num={<span>2<MathVar>kdy</MathVar></span>} den={<span>(<MathVar>d</MathVar>² + <MathVar>y</MathVar>²)<sup className="text-[10px]">3/2</sup></span>} />
      <Vector>i</Vector>
    </>
  );

  const OptionBContent = (
    <>
      <MathVar>E_P</MathVar> = 
      <Fraction num={<span><MathVar>kq</MathVar></span>} den={<span><MathVar>y</MathVar>²</span>} />
      <Vector>j</Vector>
      <span className="mx-2">-</span>
      <Fraction num={<span>2<MathVar>kqd</MathVar></span>} den={<span>(<MathVar>d</MathVar>² + <MathVar>y</MathVar>²)<sup className="text-[10px]">3/2</sup></span>} />
      <Vector>i</Vector>
    </>
  );

  const OptionCContent = (
    <>
      <MathVar>E_P</MathVar> = 
      <Fraction num={<span><MathVar>kq</MathVar></span>} den={<span><MathVar>y</MathVar>²</span>} />
      <Vector>j</Vector>
      <span className="mx-2">-</span>
      <Fraction num={<span>2<MathVar>kqd</MathVar></span>} den={<span>(<MathVar>d</MathVar>² + <MathVar>y</MathVar>²)<sup className="text-[10px]">3/2</sup></span>} />
      <Vector>i</Vector>
      <span className="mx-2">-</span>
      <Fraction num={<span>2<MathVar>kqy</MathVar></span>} den={<span>(<MathVar>d</MathVar>² + <MathVar>y</MathVar>²)<sup className="text-[10px]">3/2</sup></span>} />
      <Vector>j</Vector>
    </>
  );

  const OptionDContent = (
    <>
      <MathVar>E_P</MathVar> = 
      <Fraction num={<span><MathVar>kq</MathVar></span>} den={<span><MathVar>y</MathVar>²</span>} />
      <Vector>j</Vector>
      <span className="mx-2">+</span>
      <Fraction num={<span>2<MathVar>kqd</MathVar></span>} den={<span>(<MathVar>d</MathVar>² + <MathVar>y</MathVar>²)<sup className="text-[10px]">3/2</sup></span>} />
      <Vector>i</Vector>
    </>
  );

  if (isDrilling) {
    return (
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-32 relative">
        {/* Back Button (Mobile mainly, or desktop) */}
        <button 
          onClick={() => setIsDrilling(false)}
          className="absolute -top-12 left-6 text-[#94A3B8] hover:text-white flex items-center gap-2 transition-colors text-sm font-medium md:hidden"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Top Progress Bar */}
        <div className="flex items-center justify-between w-full bg-[#0F172A]/80 border border-white/5 rounded-2xl px-6 py-4 mb-6 backdrop-blur-md shadow-lg">
          <div className="text-[#94A3B8] font-medium text-sm flex-shrink-0 whitespace-nowrap">Question <span className="text-white font-bold text-base ml-1">{currentQuestion}</span> <span className="text-white/40 hidden sm:inline">/ 20</span></div>
          <div className="flex-1 max-w-xl mx-4 sm:mx-8 h-1.5 bg-[#1E293B] rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] rounded-full transition-all duration-300" style={{ width: `${(currentQuestion / 20) * 100}%` }}>
               <div className="absolute top-0 right-0 w-8 h-full bg-white/40 blur-[4px]"></div>
            </div>
          </div>
          <div className="text-[#94A3B8] font-medium text-sm flex-shrink-0">Mastery: <span className="text-[#22D3EE] font-bold ml-1">{mastery}%</span></div>
        </div>

        {/* Question Panel */}
        <div className="bg-gradient-to-b from-[#0F172A]/90 to-[#0F172A]/60 border border-white/5 rounded-3xl p-6 sm:p-8 mb-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-8">
            <div className="flex-1">
              <p className="text-white/90 text-[16px] sm:text-[17px] leading-[1.7] mb-8 font-medium">
                Consider a point charge <MathVar>q</MathVar> located at the origin in free space. A second point charge <MathVar>-2q</MathVar> is placed at a distance <MathVar>d</MathVar> on the <MathVar>x</MathVar>-axis. Determine the magnitude and direction of the electric field <MathVar>E</MathVar> at a point <MathVar>P(0, y)</MathVar> on the <MathVar>y</MathVar>-axis, where <MathVar>y {'>'} 0</MathVar>. Express your answer in terms of <MathVar>q, d, y</MathVar>, and the permittivity of free space, <MathVar>ε₀</MathVar>.
              </p>
              
              {/* Central Equation */}
              <div className="flex flex-wrap items-center justify-center my-10 text-xl md:text-2xl font-serif text-white/90 gap-y-4">
                <MathVar>E_P</MathVar> = <MathVar>k</MathVar>
                <Fraction num={<MathVar>q</MathVar>} den={<span><MathVar>y</MathVar>²</span>} />
                <Vector>j</Vector>
                <span className="mx-3">-</span>
                <MathVar>k</MathVar>
                <Fraction num={<span>2<MathVar>q</MathVar></span>} den={<span><MathVar>d</MathVar>² + <MathVar>y</MathVar>²</span>} />
                <span className="mx-2">·</span>
                <Fraction 
                  num={<span><MathVar>d</MathVar>·<Vector>i</Vector> + <MathVar>y</MathVar>·<Vector>j</Vector></span>} 
                  den={<span>√(<MathVar>d</MathVar>² + <MathVar>y</MathVar>²)</span>} 
                />
              </div>
            </div>
            
            {/* Diagram SVG */}
            <div className="w-[280px] sm:w-[300px] shrink-0 border border-white/5 bg-black/20 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden self-center lg:self-start">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-[#8B5CF6]/5"></div>
              <DiagramSVG />
            </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-10">
           {['A', 'B', 'C', 'D'].map(opt => (
             <OptionCard 
               key={opt}
               option={opt} 
               isSelected={selectedOption === opt} 
               isCorrect={opt === correctAnswer}
               hasSubmitted={hasSubmitted}
               onClick={() => handleOptionClick(opt)}
             >
               {opt === 'A' ? OptionAContent : opt === 'B' ? OptionBContent : opt === 'C' ? OptionCContent : OptionDContent}
             </OptionCard>
           ))}
        </div>

        {/* Floating Toolbar & Popover */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
           
           {/* Popover */}
           <AnimatePresence>
             {hasSubmitted && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="absolute bottom-[calc(100%+20px)] left-1/2 md:translate-x-[20%] -translate-x-1/2 w-[340px] md:w-[380px] bg-[#0F172A]/95 backdrop-blur-3xl border border-[#22D3EE]/30 rounded-2xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(34,211,238,0.15)] origin-bottom z-50"
               >
                  {/* Triangle pointer */}
                  <div className="absolute -bottom-[8px] left-[50%] md:left-[30%] w-4 h-4 bg-[#0F172A] border-b border-r border-[#22D3EE]/30 rotate-45 transform -translate-x-1/2"></div>
                  
                  <h4 className={`font-bold text-[17px] mb-3 ${selectedOption === correctAnswer ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {selectedOption === correctAnswer ? 'Correct! AI Explanation' : 'Incorrect. AI Explanation'}
                  </h4>
                  <p className="text-[13.5px] text-white/90 leading-relaxed mb-3">
                    {selectedOption === correctAnswer ? 'Excellent work! ' : 'Not quite. '}
                    To find the net electric field at P, calculate the individual fields from charges q and -2q.
                  </p>
                  <p className="text-[13.5px] text-white/90 leading-relaxed mb-4">
                    The field from q is directed along the positive y-axis. The field from -2q is directed towards the charge. By resolving the components of the field from -2q and adding vectorially to the field from q, you arrive at option A.
                  </p>
                  <p className="text-[13px] text-[#94A3B8] leading-relaxed mb-5">
                    <span className="text-[#22D3EE] font-bold">Shortcut Trick:</span> Recognize that the y-component is dominated by the charge q, but reduced by the y-component of the field from -2q. The x-component is solely due to the field from -2q.
                  </p>
                  <div className="text-[12px] text-[#94A3B8] font-medium border-t border-white/10 pt-4 flex items-center justify-between">
                    <span>Time Taken: <span className="text-white font-bold ml-1">42s</span></span>
                    {selectedOption === correctAnswer && (
                      <span className="text-[#10B981] font-bold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" /> +2 Mastery
                      </span>
                    )}
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Toolbar */}
           <div className="flex items-center gap-3 px-4 py-3 bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative z-40">
              {!hasSubmitted ? (
                <>
                  <ToolbarBtn icon={FlaskConical} label="Formula Sheet" />
                  <ToolbarBtn icon={Lightbulb} label="Hint" />
                  <div className="w-px h-8 bg-white/10 mx-2"></div>
                  <button 
                    onClick={handleSubmit}
                    disabled={!selectedOption}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${selectedOption ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-[#94A3B8] cursor-not-allowed'}`}
                  >
                    Submit Answer
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleNext}
                  className="px-8 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-105"
                >
                  {currentQuestion < 20 ? 'Next Question' : 'Finish Drill'}
                </button>
              )}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 md:px-6 relative w-full max-w-5xl mx-auto pb-20">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-[#22D3EE]/10 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full flex flex-col items-center text-center space-y-12 z-10 relative mt-10"
      >
        
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-4">
             <div className="relative">
               <div className="absolute inset-0 bg-[#3B82F6] blur-[20px] opacity-40 rounded-full"></div>
               <div className="relative w-16 h-16 rounded-full flex items-center justify-center text-white border border-[#3B82F6]/30 bg-[#0F172A]">
                  <Flame className="w-8 h-8 text-[#22D3EE] drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
               </div>
             </div>
             <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] drop-shadow-sm pb-1">
                Driller
             </h1>
          </div>
          <h2 className="text-white text-2xl md:text-3xl font-semibold tracking-wide">AI Adaptive Practice</h2>
        </div>

        {/* Main Drill Card & AI Briefing */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-4xl">
          
          {/* Action Card */}
          <div className="bg-[#0F172A]/80 backdrop-blur-2xl border border-[#3B82F6]/30 p-8 md:p-10 flex-1 flex flex-col justify-between relative overflow-hidden rounded-[32px] shadow-[0_0_50px_rgba(59,130,246,0.15)] group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-50"></div>
            
            <div className="relative z-10 text-left">
              <h3 className="text-[28px] font-bold mb-8 text-white">Today's Drill: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8FAFC] to-[#94A3B8]">Electrostatics</span></h3>
              
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[14px] font-medium text-[#94A3B8] border border-white/10">
                  <Calendar className="w-4 h-4" />
                  20 Questions
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[14px] font-medium text-[#94A3B8] border border-white/10">
                  <Clock className="w-4 h-4" />
                  25 Mins
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 rounded-xl text-[14px] font-medium border border-[#3B82F6]/30 text-[#3B82F6]">
                  <TrendingUp className="w-4 h-4" />
                  Adaptive Difficulty
                </span>
              </div>
              
              <button 
                onClick={() => setIsDrilling(true)}
                className="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-bold rounded-2xl flex items-center justify-center gap-3 text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 relative overflow-hidden group/btn"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Drilling
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </div>
          </div>
          
          {/* AI Briefing */}
          <div className="bg-[#0F172A]/70 backdrop-blur-xl p-6 md:w-[320px] rounded-[24px] border border-[#22D3EE]/20 flex flex-col justify-center relative shadow-[0_0_30px_rgba(34,211,238,0.1)]">
             <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-[#0F172A] hidden md:block"></div>
             
             <p className="text-[14px] text-[#94A3B8] leading-relaxed mb-6">
               <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Nexus AI Briefing:</span> Based on your last three sessions, focusing on Electric Potential today.
             </p>
             <p className="text-[14px] font-medium text-white">
               Expected Accuracy Gain: <span className="text-[#22D3EE] font-bold ml-1">+8%</span>
             </p>
          </div>
          
        </div>

        {/* Stats Row */}
        <div className="bg-[#0F172A]/80 backdrop-blur-md px-8 py-4 flex flex-wrap justify-center gap-x-10 gap-y-4 rounded-2xl border border-white/5">
           <div className="flex items-center gap-3">
             <Flame className="w-5 h-5 text-[#F59E0B]" />
             <span className="text-[#94A3B8] text-[14px] font-medium">Current Streak <span className="text-white font-bold ml-1">({streak})</span></span>
           </div>
           <div className="w-px h-6 bg-white/10 hidden md:block"></div>
           <div className="flex items-center gap-3">
             <Shield className="w-5 h-5 text-[#3B82F6]" />
             <span className="text-[#94A3B8] text-[14px] font-medium">Mastery <span className="text-white font-bold ml-1">({mastery}%)</span></span>
           </div>
           <div className="w-px h-6 bg-white/10 hidden md:block"></div>
           <div className="flex items-center gap-3">
             <Trophy className="w-5 h-5 text-[#EAB308]" />
             <span className="text-[#94A3B8] text-[14px] font-medium">Best Streak <span className="text-white font-bold ml-1">({Math.max(42, streak)})</span></span>
           </div>
        </div>

      </motion.div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
