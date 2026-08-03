import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, BookOpen, Download, Bookmark, Search, ZoomIn, ZoomOut, 
  ChevronLeft, ChevronRight, Share2, Sparkles, CheckCircle, 
  HelpCircle, MessageSquare, Send, FileText, Check, Copy, Printer
} from 'lucide-react';
import { DocumentItem } from '../../data/documents';
import { useAppStore } from '../../store/useAppStore';

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document, onClose }) => {
  const { addToast } = useAppStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(document?.isBookmarked || false);
  const [activeTab, setActiveTab] = useState<'read' | 'quiz' | 'ai'>('read');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  
  // Nexus AI Chat state for this document
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: document 
        ? `Hello! I am your AI Study Assistant for "${document.title}". Ask me any questions, formula derivations, or practice problems related to this document!` 
        : ''
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!document) return null;

  const pageData = document.pages.find((p) => p.pageNumber === currentPage) || document.pages[0];
  const totalPages = document.pagesCount || document.pages.length;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDownload = () => {
    // Generate simulated downloadable file content
    const fullText = `
DOCUMENT: ${document.title}
AUTHOR: ${document.author}
SUBJECT: ${document.subject}
YEAR: ${document.year || '2026'}
==================================================

${document.pages.map(p => `--- PAGE ${p.pageNumber}: ${p.title} ---\n\n${p.content}\n\nKey Formulas:\n${p.keyFormulas ? p.keyFormulas.join('\n') : 'N/A'}\n\n`).join('\n')}
    `;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.title.replace(/\s+/g, '_')}_NeuroLearn.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast(`Downloaded "${document.title}" successfully!`, 'success');
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    addToast(
      !isBookmarked ? `Saved "${document.title}" to Bookmarks` : `Removed from Bookmarks`,
      !isBookmarked ? 'success' : 'info'
    );
  };

  const handleAiSend = () => {
    if (!aiQuery.trim()) return;
    const userMsg = aiQuery.trim();
    setAiChat((prev) => [...prev, { role: 'user', text: userMsg }]);
    setAiQuery('');
    setIsAiLoading(true);

    setTimeout(() => {
      let response = `Based on Page ${currentPage} of "${document.title}":\n\n`;
      if (userMsg.toLowerCase().includes('formula') || userMsg.toLowerCase().includes('equation')) {
        response += `Key formulas on this page include:\n` + (pageData.keyFormulas ? pageData.keyFormulas.map(f => `• ${f}`).join('\n') : `Refer to section 1 of the page text for full equation derivations.`);
      } else if (userMsg.toLowerCase().includes('example') || userMsg.toLowerCase().includes('solve')) {
        response += `Here is a step-by-step breakdown of the example:\nFirst identify the given parameters, apply the governing equation, and compute vector components carefully.`;
      } else {
        response += `The primary concept on this page is "${pageData.title}". It emphasizes understanding boundary conditions, sign conventions, and high-yield JEE Advanced trick applications. Let me know if you would like a targeted quiz on this section!`;
      }
      setAiChat((prev) => [...prev, { role: 'ai', text: response }]);
      setIsAiLoading(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-7xl h-[92vh] bg-[#0A0F1D] border border-white/15 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#0F172A]/90 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-2.5 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/30">
                    {document.subject}
                  </span>
                  <span className="text-[10px] font-medium text-[#94A3B8]">
                    {document.fileSize} • {totalPages} Pages • {document.author}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white truncate max-w-lg mt-0.5">{document.title}</h2>
              </div>
            </div>

            {/* Actions & Tab Switchers */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center bg-[#1E293B] p-1 rounded-xl border border-white/10 text-xs font-semibold">
                <button 
                  onClick={() => setActiveTab('read')} 
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'read' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' : 'text-[#94A3B8] hover:text-white'}`}
                >
                  <FileText className="w-3.5 h-3.5" /> Read
                </button>
                <button 
                  onClick={() => setActiveTab('quiz')} 
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'quiz' ? 'bg-[#8B5CF6]/20 text-[#A78BFA]' : 'text-[#94A3B8] hover:text-white'}`}
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Self-Test
                </button>
                <button 
                  onClick={() => setActiveTab('ai')} 
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'ai' ? 'bg-[#EC4899]/20 text-[#F472B6]' : 'text-[#94A3B8] hover:text-white'}`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Ask AI
                </button>
              </div>

              <button 
                onClick={handleBookmarkToggle} 
                className={`p-2.5 rounded-xl border transition-colors ${isBookmarked ? 'bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#F59E0B]' : 'bg-[#1E293B] border-white/10 text-[#94A3B8] hover:text-white'}`}
                title="Bookmark Document"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button 
                onClick={handleDownload} 
                className="p-2.5 rounded-xl bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#60A5FA] hover:bg-[#3B82F6]/30 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Download Document"
              >
                <Download className="w-4 h-4" /> <span className="hidden md:inline">Download</span>
              </button>

              <button 
                onClick={onClose} 
                className="p-2.5 rounded-xl bg-[#1E293B] border border-white/10 text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Control Toolbar */}
          <div className="flex items-center justify-between px-6 py-2.5 bg-[#0A0F1D] border-b border-white/5 text-xs text-[#94A3B8] shrink-0">
            {/* Page Navigation */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg bg-[#1E293B] border border-white/10 disabled:opacity-40 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-white">
                Page {currentPage} <span className="text-[#94A3B8]">of {totalPages}</span>
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg bg-[#1E293B] border border-white/10 disabled:opacity-40 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="hidden md:flex items-center gap-2 bg-[#1E293B]/60 border border-white/10 rounded-xl px-3 py-1.5 w-64 focus-within:border-[#22D3EE]/50">
              <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
              <input 
                type="text" 
                placeholder="Find in document..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white placeholder:text-[#94A3B8] w-full"
              />
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button onClick={() => setZoomLevel(prev => Math.max(80, prev - 10))} className="p-1.5 rounded-lg bg-[#1E293B] border border-white/10 hover:text-white">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-10 text-center">{zoomLevel}%</span>
              <button onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))} className="p-1.5 rounded-lg bg-[#1E293B] border border-white/10 hover:text-white">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Body Layout */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* Table of Contents Sidebar */}
            <div className="hidden lg:flex w-64 border-r border-white/10 bg-[#0F172A]/50 flex-col py-4 px-3 shrink-0 overflow-y-auto">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] px-3 mb-3">Contents</h4>
              <div className="space-y-1">
                {document.tableOfContents.map((toc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(toc.page)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      currentPage === toc.page 
                        ? 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30' 
                        : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{toc.title}</span>
                    <span className="text-[10px] font-mono opacity-60">p.{toc.page}</span>
                  </button>
                ))}
              </div>

              {/* Document Info Box */}
              <div className="mt-auto p-4 bg-[#1E293B]/40 rounded-2xl border border-white/5 text-xs text-[#94A3B8] space-y-2">
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="text-amber-400 font-bold">★ {document.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span className="text-white font-semibold">{document.downloads.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Edition:</span>
                  <span className="text-white font-semibold">{document.year || '2026'}</span>
                </div>
              </div>
            </div>

            {/* Document Content Reader Canvas */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#070B14] flex justify-center">
              <div 
                className="w-full max-w-3xl bg-[#0F172A] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-slate-200 font-sans transition-all duration-300"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                {/* Page Header Badge */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 text-xs text-[#94A3B8]">
                  <span className="font-bold text-[#22D3EE] tracking-wide uppercase">{document.subject} • SECTION {currentPage}</span>
                  <span>{document.title}</span>
                </div>

                {/* Page Title */}
                <h3 className="text-2xl font-extrabold text-white mb-6 leading-snug">
                  {pageData?.title || document.title}
                </h3>

                {/* Main Markdown / Text Content */}
                <div className="prose prose-invert max-w-none text-sm leading-relaxed space-y-4 text-slate-300">
                  {pageData?.content ? (
                    pageData.content.split('\n\n').map((paragraph, i) => (
                      <div key={i} className="mb-4">
                        {paragraph.startsWith('###') ? (
                          <h4 className="text-base font-bold text-[#38BDF8] mt-6 mb-2 border-l-2 border-[#38BDF8] pl-3">
                            {paragraph.replace('###', '').trim()}
                          </h4>
                        ) : paragraph.startsWith('* ') ? (
                          <ul className="list-disc pl-5 space-y-1 text-slate-300">
                            {paragraph.split('\n').map((li, idx) => (
                              <li key={idx}>{li.replace('* ', '').trim()}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{paragraph}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No content available for this page.</p>
                  )}
                </div>

                {/* Key Formulas Section */}
                {pageData?.keyFormulas && pageData.keyFormulas.length > 0 && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-[#1E3A8A]/30 to-[#0F172A] border border-[#3B82F6]/40 rounded-2xl shadow-inner">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#60A5FA] mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#60A5FA]" /> High-Yield Formula Summary
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pageData.keyFormulas.map((formula, idx) => (
                        <div key={idx} className="bg-[#0F172A]/80 border border-[#3B82F6]/20 px-3.5 py-2.5 rounded-xl font-mono text-xs text-[#93C5FD]">
                          {formula}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Solved Examples Section */}
                {pageData?.solvedExamples && pageData.solvedExamples.length > 0 && (
                  <div className="mt-10 space-y-6 border-t border-white/10 pt-8">
                    <h5 className="text-sm font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Solved Problem Application
                    </h5>
                    {pageData.solvedExamples.map((ex, i) => (
                      <div key={i} className="bg-[#064E3B]/20 border border-[#10B981]/30 rounded-2xl p-6 space-y-4">
                        <p className="text-sm font-semibold text-white">{ex.question}</p>
                        {ex.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif text-slate-300">
                            {ex.options.map((opt, oIdx) => (
                              <div key={oIdx} className="bg-[#0F172A]/60 px-3 py-2 rounded-lg border border-white/5">
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="pt-2 border-t border-[#10B981]/20 text-xs">
                          <span className="font-bold text-[#34D399]">Answer: </span>
                          <span className="text-white font-mono">{ex.answer}</span>
                          <p className="mt-2 text-[#94A3B8] italic">{ex.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Page Branding */}
                <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span>NeuroLearn AI Studio Verified Document</span>
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
              </div>
            </div>

            {/* AI Assistant Right Panel */}
            {activeTab === 'ai' && (
              <div className="w-80 md:w-96 border-l border-white/10 bg-[#0F172A]/90 backdrop-blur-xl flex flex-col shrink-0">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1E293B]/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F472B6]" />
                    <span className="text-xs font-bold text-white">Nexus AI Document Tutor</span>
                  </div>
                  <button onClick={() => setActiveTab('read')} className="text-[#94A3B8] hover:text-white text-xs">
                    Close
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {aiChat.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                        msg.role === 'user'
                          ? 'bg-[#3B82F6] text-white ml-auto rounded-br-xs'
                          : 'bg-[#1E293B] border border-white/10 text-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="bg-[#1E293B] p-3 rounded-2xl text-xs text-[#94A3B8] flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-[#F472B6]" />
                      Analyzing page content...
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-[#0A0F1D] flex gap-2">
                  <input 
                    type="text"
                    placeholder="Ask about this page..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                    className="flex-1 bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#94A3B8] outline-none focus:border-[#F472B6]/50"
                  />
                  <button 
                    onClick={handleAiSend} 
                    className="p-2 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white hover:opacity-90"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Self-Test Quiz Panel */}
            {activeTab === 'quiz' && (
              <div className="w-80 md:w-96 border-l border-white/10 bg-[#0F172A]/90 backdrop-blur-xl flex flex-col shrink-0 p-5 overflow-y-auto">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Quick Self-Test (Page {currentPage})
                  </span>
                  <button onClick={() => setActiveTab('read')} className="text-[#94A3B8] text-xs">Back to Read</button>
                </div>

                {pageData?.solvedExamples && pageData.solvedExamples.length > 0 ? (
                  <div className="space-y-6">
                    {pageData.solvedExamples.map((ex, idx) => (
                      <div key={idx} className="bg-[#1E293B]/70 border border-white/10 p-4 rounded-2xl space-y-3">
                        <p className="text-xs font-semibold text-white">{ex.question}</p>
                        {ex.options?.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setUserAnswers(prev => ({ ...prev, [idx]: opt }))}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-serif border transition-all ${
                              userAnswers[idx] === opt
                                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white'
                                : 'bg-[#0F172A] border-white/5 text-[#94A3B8] hover:text-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                        <button
                          onClick={() => setSubmittedAnswers(prev => ({ ...prev, [idx]: true }))}
                          disabled={!userAnswers[idx]}
                          className="w-full py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-bold disabled:opacity-40 transition-colors mt-2"
                        >
                          Check Answer
                        </button>

                        {submittedAnswers[idx] && (
                          <div className={`p-3 rounded-xl text-xs border ${
                            userAnswers[idx] === ex.answer 
                              ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#34D399]' 
                              : 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#FCA5A5]'
                          }`}>
                            <p className="font-bold">{userAnswers[idx] === ex.answer ? '✓ Correct!' : '✗ Incorrect'}</p>
                            <p className="mt-1 text-[11px] opacity-90">{ex.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#94A3B8] text-xs">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No interactive test questions assigned to this page yet. Use the "Ask AI" tab to generate a custom quiz!
                  </div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
