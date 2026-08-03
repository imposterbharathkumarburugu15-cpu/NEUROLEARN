import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { db } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { X, Calculator, FileText, Maximize2 } from 'lucide-react';

export default function TestArena() {
  const navigate = useNavigate();
  const { user, addToast } = useAppStore();

  const [currentSubject, setCurrentSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics'>('Physics');
  const [currentQIndex, setCurrentQIndex] = useState(16); // 1-indexed, Q17
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({ 16: 'C' });
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    for (let i = 0; i < 75; i++) {
      if (i < 5) init[i] = 'answered';
      else if (i === 5 || i === 10) init[i] = 'marked_review';
      else if (i > 5 && i < 10) init[i] = 'not_answered';
      else if (i === 16) init[i] = 'review';
      else init[i] = 'not_visited';
    }
    return init;
  });

  const [selectedOption, setSelectedOption] = useState<string | null>('C');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showRoughWork, setShowRoughWork] = useState(false);
  const [roughNotes, setRoughNotes] = useState('');
  const [calcInput, setCalcInput] = useState('');

  const questionsData: Record<number, { text: string; options: { label: string; text: string }[]; correct: string }> = {
    16: {
      text: "A point charge +q is placed at the centre of a cubic Gaussian surface of side 'a'. The electric flux passing through one of the faces of the cube is:",
      options: [
        { label: 'A', text: 'q / ε₀' },
        { label: 'B', text: 'q / 2ε₀' },
        { label: 'C', text: 'q / 6ε₀' },
        { label: 'D', text: 'q / 3ε₀' },
      ],
      correct: 'C'
    },
    0: {
      text: "Two point charges +4e and +e are fixed at a distance 'a' apart. Where should a third charge q be placed so that the entire system is in equilibrium?",
      options: [
        { label: 'A', text: 'a / 3 from +e' },
        { label: 'B', text: '2a / 3 from +e' },
        { label: 'C', text: 'a / 4 from +4e' },
        { label: 'D', text: 'a / 2 from +e' },
      ],
      correct: 'A'
    }
  };

  const currentQ = questionsData[currentQIndex] || {
    text: `[Question ${currentQIndex + 1} - ${currentSubject}] Calculate the net force or potential differential for the system described in topic module.`,
    options: [
      { label: 'A', text: '2.5 × 10⁻¹⁹ J' },
      { label: 'B', text: '4.8 × 10⁻¹⁹ J' },
      { label: 'C', text: '1.6 × 10⁻¹⁹ J' },
      { label: 'D', text: 'Zero J' },
    ],
    correct: 'B'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'not_answered': return 'bg-[#EF4444]/20 border-[#EF4444]/50 text-[#EF4444]';
      case 'marked_review': return 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#8B5CF6]';
      case 'review': return 'bg-[#3B82F6]/20 border-[#3B82F6]/50 text-[#3B82F6]';
      default: return 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10';
    }
  };

  const handleSelectOption = (optLabel: string) => {
    setSelectedOption(optLabel);
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optLabel }));
  };

  const handleSaveAndNext = () => {
    if (selectedOption) {
      setQuestionStatuses(prev => ({ ...prev, [currentQIndex]: 'answered' }));
    } else {
      setQuestionStatuses(prev => ({ ...prev, [currentQIndex]: 'not_answered' }));
    }

    if (currentQIndex < 74) {
      const nextIndex = currentQIndex + 1;
      setCurrentQIndex(nextIndex);
      setSelectedOption(userAnswers[nextIndex] || null);
    } else {
      addToast('End of test reached', 'info');
    }
  };

  const handleMarkReview = () => {
    setQuestionStatuses(prev => ({ ...prev, [currentQIndex]: 'marked_review' }));
    if (currentQIndex < 74) {
      const nextIndex = currentQIndex + 1;
      setCurrentQIndex(nextIndex);
      setSelectedOption(userAnswers[nextIndex] || null);
    }
  };

  const handleClearResponse = () => {
    setSelectedOption(null);
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQIndex];
      return copy;
    });
    setQuestionStatuses(prev => ({ ...prev, [currentQIndex]: 'not_answered' }));
  };

  const handleJumpToQ = (idx: number) => {
    setCurrentQIndex(idx);
    setSelectedOption(userAnswers[idx] || null);
  };

  const handleFinalSubmitTest = async () => {
    let correctCount = 0;
    let attemptedCount = Object.keys(userAnswers).length;

    Object.entries(userAnswers).forEach(([qIdxStr, ans]) => {
      const idx = Number(qIdxStr);
      const q = questionsData[idx] || { correct: 'B' };
      if (ans === q.correct) correctCount++;
    });

    const score = correctCount * 4 - (attemptedCount - correctCount);

    if (user?.id) {
      try {
        await addDoc(collection(db, 'test_results'), {
          userId: user.id,
          testTitle: 'Physics Grand Test',
          subject: 'Physics',
          score,
          totalMarks: 300,
          correctCount,
          incorrectCount: attemptedCount - correctCount,
          unattemptedCount: 75 - attemptedCount,
          accuracy: attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0,
          timestamp: new Date().toISOString()
        });

        // Update user stats
        await updateDoc(doc(db, 'users', user.id), {
          questionsSolved: increment(attemptedCount)
        }).catch(() => {});
      } catch (err) {
        console.error("Error saving test result to firestore:", err);
      }
    }

    addToast(`Test Submitted! Score: ${score}/300 (${correctCount} Correct)`, 'success');
    setIsSubmitModalOpen(false);
    navigate('/battleground');
  };

  return (
    <div className="absolute inset-0 z-[100] bg-[#050816] text-[#F8FAFC] flex flex-col overflow-hidden h-screen w-screen">
      {/* Top Bar */}
      <header className="h-auto md:h-16 py-3 md:py-0 bg-[#0F172A] border-b border-white/10 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between shrink-0 gap-3 md:gap-0">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={() => navigate('/battleground')} className="text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-white flex-1 md:flex-initial truncate">Physics Grand Test</h1>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6 justify-between w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Time Left:</span>
            <span className="text-lg md:text-xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">02:43:12</span>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-full flex items-center justify-center text-[#22D3EE] font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'C'}
            </div>
            <div className="text-xs hidden sm:block">
              <p className="font-bold text-white truncate max-w-[120px]">{user?.name || 'Candidate'}</p>
              <p className="text-slate-400">Target: Top 100</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        {/* Main Question Area */}
        <div className="flex-1 flex flex-col md:border-r border-white/10 overflow-hidden">
          {/* Subject Tabs */}
          <div className="flex border-b border-white/10 shrink-0 overflow-x-auto no-scrollbar">
            {(['Physics', 'Chemistry', 'Mathematics'] as const).map(subj => (
              <button 
                key={subj}
                onClick={() => {
                  setCurrentSubject(subj);
                  addToast(`Switched to ${subj}`, 'info');
                }}
                className={`flex-1 min-w-[120px] py-3 text-center font-bold text-sm transition-colors ${
                  currentSubject === subj ? 'bg-[#3B82F6]/20 text-[#22D3EE] border-b-2 border-[#22D3EE]' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Q. {currentQIndex + 1}</h2>
                <span className="px-3 py-1 bg-[#3B82F6]/20 text-[#22D3EE] rounded-md text-xs font-bold border border-[#3B82F6]/30">Single Correct</span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-md text-xs font-bold border border-amber-500/30">Medium (+4 / -1)</span>
              </div>
              
              <p className="text-base md:text-lg leading-relaxed text-slate-200">
                {currentQ.text}
              </p>

              <div className="space-y-3 pt-2 pb-24 md:pb-0">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOption === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectOption(opt.label)}
                      className={`w-full text-left p-3 md:p-4 rounded-xl border flex items-center gap-3 md:gap-4 transition-all ${
                        isSelected 
                          ? 'border-[#22D3EE] bg-[#22D3EE]/10 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                          : 'border-white/10 bg-[#0F172A]/80 hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#22D3EE]' : 'border-slate-500'
                      }`}>
                        <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${isSelected ? 'bg-[#22D3EE]' : 'bg-transparent'}`} />
                      </div>
                      <span className="font-mono font-bold w-5 text-center text-slate-400">{opt.label}</span>
                      <span className="text-sm md:text-base flex-1">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Bottom Actions */}
          <div className="h-auto md:h-20 py-3 md:py-0 border-t border-white/10 bg-[#0F172A] px-4 md:px-8 flex flex-wrap items-center justify-between gap-3 shrink-0 fixed md:static bottom-0 left-0 right-0 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-none pb-0">
            <button 
              onClick={() => {
                if (currentQIndex > 0) {
                  const prevIdx = currentQIndex - 1;
                  setCurrentQIndex(prevIdx);
                  setSelectedOption(userAnswers[prevIdx] || null);
                }
              }}
              disabled={currentQIndex === 0}
              className="px-4 md:px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 font-bold text-sm text-slate-300 disabled:opacity-40 flex-1 md:flex-initial"
            >
              <span className="material-symbols-outlined text-sm hidden md:inline">chevron_left</span> <span className="md:hidden">Prev</span><span className="hidden md:inline">Previous</span>
            </button>
            
            <div className="flex gap-2 md:gap-3 flex-[2] md:flex-initial justify-end">
              <button 
                onClick={handleMarkReview}
                className="px-3 md:px-5 py-2.5 rounded-xl border border-[#8B5CF6]/40 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-colors font-bold text-xs md:text-sm text-center flex-1 md:flex-initial"
              >
                <span className="md:hidden">Review</span><span className="hidden md:inline">Mark for Review</span>
              </button>
              <button 
                onClick={handleClearResponse}
                className="px-3 md:px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors font-bold text-xs md:text-sm hidden sm:block"
              >
                Clear
              </button>
              <button 
                onClick={handleSaveAndNext}
                className="px-4 md:px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-bold text-xs md:text-sm shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-105 transition-all flex-1 md:flex-initial"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar - Question Palette */}
        <div className="w-[320px] bg-[#0F172A] flex-col shrink-0 hidden lg:flex">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Question Palette (75)</h3>
            <span className="text-xs text-[#22D3EE] font-mono">{Object.keys(userAnswers).length} Attempted</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 75 }).map((_, index) => {
                const status = questionStatuses[index] || 'not_visited';
                const isCurrent = index === currentQIndex;
                return (
                  <button 
                    key={index}
                    onClick={() => handleJumpToQ(index)}
                    className={`w-10 h-10 rounded-lg border text-xs font-mono font-bold flex items-center justify-center transition-all ${
                      isCurrent ? 'ring-2 ring-white scale-105 z-10' : ''
                    } ${getStatusColor(status)}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 border-t border-white/10 space-y-4 text-xs font-medium shrink-0 bg-black/20">
            <div className="grid grid-cols-2 gap-y-2.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500/50" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-[#3B82F6]/20 border border-[#3B82F6]/50" />
                <span>Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-[#EF4444]/20 border border-[#EF4444]/50" />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-white/5 border border-white/10" />
                <span>Not Visited</span>
              </div>
            </div>
            
            <div className="pt-2 space-y-2 border-t border-white/10">
              <button 
                onClick={() => setShowCalculator(prev => !prev)}
                className="w-full py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
              >
                <Calculator className="w-4 h-4 text-[#22D3EE]" /> Calculator
              </button>
              <button 
                onClick={() => setShowRoughWork(prev => !prev)}
                className="w-full py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
              >
                <FileText className="w-4 h-4 text-[#8B5CF6]" /> Rough Work Pad
              </button>
            </div>
            
            <div className="pt-1">
              <button 
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[#EF4444] text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:bg-[#DC2626] transition-all text-sm"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Calculator Overlay */}
      {showCalculator && (
        <div className="fixed bottom-24 right-80 z-50 bg-[#0F172A] border border-white/20 p-4 rounded-2xl shadow-2xl w-64">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-[#22D3EE] flex items-center gap-1.5"><Calculator className="w-4 h-4" /> Scientific Calc</span>
            <button onClick={() => setShowCalculator(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <input 
            type="text" 
            readOnly 
            value={calcInput || '0'} 
            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-right font-mono text-emerald-400 text-lg mb-3"
          />
          <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
            {['C', '(', ')', '/'].map(b => (
              <button key={b} onClick={() => b === 'C' ? setCalcInput('') : setCalcInput(prev => prev + b)} className="p-2 bg-white/5 rounded hover:bg-white/10">{b}</button>
            ))}
            {['7', '8', '9', '*'].map(b => (
              <button key={b} onClick={() => setCalcInput(prev => prev + b)} className="p-2 bg-white/5 rounded hover:bg-white/10">{b}</button>
            ))}
            {['4', '5', '6', '-'].map(b => (
              <button key={b} onClick={() => setCalcInput(prev => prev + b)} className="p-2 bg-white/5 rounded hover:bg-white/10">{b}</button>
            ))}
            {['1', '2', '3', '+'].map(b => (
              <button key={b} onClick={() => setCalcInput(prev => prev + b)} className="p-2 bg-white/5 rounded hover:bg-white/10">{b}</button>
            ))}
            {['0', '.', '^', '='].map(b => (
              <button 
                key={b} 
                onClick={() => {
                  if (b === '=') {
                    try { setCalcInput(eval(calcInput.replace('^', '**')).toString()); } catch { setCalcInput('Error'); }
                  } else setCalcInput(prev => prev + b);
                }} 
                className={`p-2 rounded ${b === '=' ? 'bg-[#3B82F6] text-white font-bold' : 'bg-white/5 hover:bg-white/10'}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Rough Work Overlay */}
      {showRoughWork && (
        <div className="fixed bottom-24 right-80 z-50 bg-[#0F172A] border border-white/20 p-4 rounded-2xl shadow-2xl w-80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#8B5CF6] flex items-center gap-1.5"><FileText className="w-4 h-4" /> Rough Work Scratchpad</span>
            <button onClick={() => setShowRoughWork(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <textarea 
            value={roughNotes}
            onChange={(e) => setRoughNotes(e.target.value)}
            placeholder="Type equations or scratchpad notes here..."
            className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#8B5CF6] resize-none"
          />
        </div>
      )}

      {/* Submit Test Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Submit Physics Grand Test?</h3>
            <p className="text-sm text-slate-300">
              You have attempted <strong className="text-[#22D3EE]">{Object.keys(userAnswers).length}</strong> out of <strong>75</strong> questions.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white font-semibold text-xs"
              >
                Resume Test
              </button>
              <button 
                onClick={handleFinalSubmitTest}
                className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-lg transition-all"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
