import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Compass, FileText, FileSignature, Bookmark, Download, 
  Brain, Clock, Target, Box, Sparkles, Filter, Upload, Plus, Star, Eye, ScanText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { REAL_DOCUMENTS, DocumentItem } from '../../data/documents';
import { DocumentViewerModal } from '../../components/documents/DocumentViewerModal';
import { PYQScannerModal } from '../../components/PYQScannerModal';

export default function Vault() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Physics' | 'Chemistry' | 'Mathematics'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocument, setActiveDocument] = useState<DocumentItem | null>(null);
  const [userUploadedDocs, setUserUploadedDocs] = useState<DocumentItem[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { addToast } = useAppStore();
  const navigate = useNavigate();

  const allDocsList = [...REAL_DOCUMENTS, ...userUploadedDocs];

  // Filter logic
  const filteredDocs = allDocsList.filter((doc) => {
    // Category tab filter
    if (activeTab === 'pyqs' && doc.category !== 'pyqs') return false;
    if (activeTab === 'notes' && doc.category !== 'notes') return false;
    if (activeTab === 'formulae' && doc.category !== 'formulae') return false;
    if (activeTab === 'bookmarks' && !doc.isBookmarked) return false;
    if (activeTab === 'downloads' && !doc.isDownloaded) return false;

    // Subject filter
    if (selectedSubject !== 'All' && doc.subject !== selectedSubject) return false;

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(query);
      const matchSubject = doc.subject.toLowerCase().includes(query);
      const matchSummary = doc.summary.toLowerCase().includes(query);
      const matchTags = doc.tags.some(t => t.toLowerCase().includes(query));
      return matchTitle || matchSubject || matchSummary || matchTags;
    }

    return true;
  });

  const handleOpenDoc = (doc: DocumentItem) => {
    setActiveDocument(doc);
    addToast(`Opening "${doc.title}"...`, 'info');
  };

  const handleUploadNewDoc = () => {
    const title = prompt('Enter Document Name (e.g., Electrostatics Quick Notes):');
    if (!title) return;
    const subjectChoice = prompt('Enter Subject (Physics / Chemistry / Mathematics):') || 'Physics';

    const newDoc: DocumentItem = {
      id: `doc-user-${Date.now()}`,
      title,
      subject: (['Physics', 'Chemistry', 'Mathematics'].includes(subjectChoice) ? subjectChoice : 'Physics') as any,
      category: 'notes',
      pagesCount: 3,
      fileSize: '1.8 MB',
      author: 'User Created',
      year: '2026',
      rating: 5.0,
      downloads: 1,
      coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
      badge: 'Personal',
      isBookmarked: true,
      isDownloaded: true,
      summary: 'Custom notes uploaded into your personal Vault.',
      tags: ['Personal Notes', subjectChoice],
      tableOfContents: [
        { title: '1. Summary & Key Formulas', page: 1 },
        { title: '2. Practice Questions', page: 2 }
      ],
      pages: [
        {
          pageNumber: 1,
          title: 'Custom Notes Overview',
          content: `### Personal Study Notes: ${title}\nUploaded directly to your NeuroLearn Vault on ${new Date().toLocaleDateString()}.\n\n* Key Concept 1: Revise high-weightage topics daily.\n* Key Concept 2: Pay special attention to vector algebra and sign conventions.\n* Key Concept 3: Practice minimum 30 PYQs per topic.`,
          keyFormulas: ['Formula 1: E = kq/r²', 'Formula 2: V = kq/r']
        }
      ]
    };

    setUserUploadedDocs([newDoc, ...userUploadedDocs]);
    setActiveDocument(newDoc);
    addToast(`Successfully added "${title}" to your Vault!`, 'success');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-6rem)] pb-0 relative">
      {/* Vault Sub-navigation */}
      <div className="w-full md:w-20 lg:w-28 flex md:flex-col items-center justify-start md:justify-start py-4 md:py-8 gap-4 md:gap-8 border-b md:border-b-0 md:border-r border-white/5 shrink-0 bg-[#070B14]/60 overflow-x-auto no-scrollbar px-4 md:px-0">
        {[
          { id: 'all', icon: Compass, label: 'All Resources' },
          { id: 'pyqs', icon: Box, label: 'PYQs' },
          { id: 'notes', icon: FileText, label: 'Notes' },
          { id: 'formulae', icon: FileSignature, label: 'Formulae' },
          { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks' },
          { id: 'downloads', icon: Download, label: 'Downloads' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
            }}
            className={`flex flex-col items-center gap-2 transition-colors min-w-[64px] ${
              activeTab === item.id 
                ? 'text-[#22D3EE] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <div className={`p-3 rounded-2xl ${activeTab === item.id ? 'bg-[#22D3EE]/10 border border-[#22D3EE]/30' : 'bg-transparent border border-transparent'}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-center leading-tight hidden md:block">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 md:px-6 lg:px-12 py-4 md:py-8 max-w-6xl mx-auto w-full relative">
        
        {/* Top Controls: Search Bar & Upload Button */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className="relative flex-1 group"
          >
            <div className="absolute inset-0 bg-[#22D3EE]/15 rounded-full blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-[#0F172A]/80 backdrop-blur-xl border-2 border-[#22D3EE]/40 rounded-full px-6 py-3.5 shadow-[0_0_30px_rgba(34,211,238,0.15)] focus-within:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-shadow">
              <Search className="w-5 h-5 text-[#22D3EE] mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Search real study materials, PYQs, formulas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white text-base placeholder:text-[#94A3B8]"
              />
            </div>
          </motion.div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 md:px-5 py-3 md:py-3.5 bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] text-white font-bold rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-105 transition-transform text-xs md:text-sm cursor-pointer whitespace-nowrap"
            >
              <ScanText className="w-4 h-4" /> Scan PYQ
            </button>
            <button
              onClick={handleUploadNewDoc}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 md:px-5 py-3 md:py-3.5 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-bold rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform text-xs md:text-sm cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-4 h-4" /> Upload Doc
            </button>
          </div>
        </div>

        {/* Subject Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Subject:
          </span>
          {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedSubject === subject
                  ? 'bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                  : 'bg-[#0F172A] border-white/10 text-[#94A3B8] hover:text-white'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Smart Collections Section (Shown when viewing 'all' and no active search) */}
        {activeTab === 'all' && !searchQuery && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h3 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4">Featured Collections</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* High Weightage PYQs */}
              <div 
                onClick={() => handleOpenDoc(REAL_DOCUMENTS[2])} 
                className="bg-gradient-to-br from-[#1E3A8A]/40 to-[#0F172A] border border-[#3B82F6]/50 rounded-[24px] p-6 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/20 rounded-full blur-[40px] group-hover:bg-[#3B82F6]/30 transition-colors"></div>
                <div className="absolute right-4 top-4 p-2 bg-[#3B82F6]/20 rounded-xl border border-[#3B82F6]/30">
                  <Brain className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-6 w-2/3 leading-tight group-hover:text-[#60A5FA] transition-colors">
                  High Weightage Calculus PYQs
                </h4>
                <p className="text-[12px] text-[#94A3B8] font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#3B82F6]" /> 85+ Solved Exam Problems
                </p>
              </div>

              {/* Last Minute Formula Revision */}
              <div 
                onClick={() => handleOpenDoc(REAL_DOCUMENTS[0])} 
                className="bg-gradient-to-br from-[#0891B2]/40 to-[#0F172A] border border-[#22D3EE]/50 rounded-[24px] p-6 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#22D3EE]/20 rounded-full blur-[40px] group-hover:bg-[#22D3EE]/30 transition-colors"></div>
                <div className="absolute right-4 top-4 p-2 bg-[#22D3EE]/20 rounded-xl border border-[#22D3EE]/30">
                  <Clock className="w-6 h-6 text-[#22D3EE]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-6 w-2/3 leading-tight group-hover:text-[#67E8F9] transition-colors">
                  Physics Formula Handbook
                </h4>
                <p className="text-[12px] text-[#94A3B8] font-medium flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-[#22D3EE]" /> 6 Pages • Complete Equations
                </p>
              </div>

              {/* Organic Chem Mechanisms */}
              <div 
                onClick={() => handleOpenDoc(REAL_DOCUMENTS[1])} 
                className="bg-gradient-to-br from-[#7C3AED]/40 via-[#9D174D]/30 to-[#0F172A] border border-[#F43F5E]/50 rounded-[24px] p-6 hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F43F5E]/20 rounded-full blur-[40px] group-hover:bg-[#F43F5E]/30 transition-colors"></div>
                <div className="absolute right-4 top-4 p-2 bg-[#F43F5E]/20 rounded-xl border border-[#F43F5E]/30">
                  <Target className="w-6 h-6 text-[#F43F5E]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-6 w-2/3 leading-tight group-hover:text-[#FDA4AF] transition-colors">
                  Organic Reaction Map
                </h4>
                <p className="text-[12px] text-[#94A3B8] font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#F43F5E]" /> SN1/SN2 Matrix & Aldol
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Real Documents Grid */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-widest">
              Available Documents ({filteredDocs.length})
            </h3>
          </div>

          {filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => handleOpenDoc(doc)}
                  className="bg-[#0F172A] border border-white/10 hover:border-[#22D3EE]/50 rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all"
                >
                  {/* Top Image Banner */}
                  <div className="h-32 rounded-2xl overflow-hidden relative mb-4">
                    <img 
                      src={doc.coverImage} 
                      alt={doc.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent"></div>
                    
                    {/* Badge */}
                    {doc.badge && (
                      <span className="absolute top-3 left-3 bg-[#3B82F6]/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/20">
                        {doc.badge}
                      </span>
                    )}

                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-[#22D3EE] text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#22D3EE]/30">
                      <Star className="w-3 h-3 fill-current text-amber-400" /> {doc.rating}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 text-[11px] text-[#94A3B8]">
                      <span className="font-bold text-[#60A5FA] uppercase">{doc.subject}</span>
                      <span>•</span>
                      <span>{doc.pagesCount} Pages</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-[#22D3EE] transition-colors line-clamp-2 mb-2 leading-snug">
                      {doc.title}
                    </h4>

                    <p className="text-xs text-[#94A3B8] line-clamp-2 mb-4 leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>

                  {/* Tags & Read Action */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-auto">
                    <div className="flex gap-1 overflow-hidden">
                      {doc.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-white/5 text-[#94A3B8] px-2 py-0.5 rounded-md truncate max-w-[90px]">
                          {t}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-[#22D3EE] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#0F172A]/50 rounded-3xl border border-white/10 text-[#94A3B8]">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#22D3EE]" />
              <p className="text-base font-semibold text-white">No documents found matching your filter.</p>
              <p className="text-xs mt-1">Try switching subject tabs or clearing your search query.</p>
            </div>
          )}
        </motion.div>
        
        {/* Floating AI Assistant Widget */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed right-6 bottom-20 md:bottom-12 flex items-end gap-3 z-30"
        >
          {/* Chat Bubble */}
          <div className="hidden sm:block bg-[#1E293B]/90 backdrop-blur-md border border-white/10 rounded-2xl rounded-br-sm p-4 w-64 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative">
             <div className="text-[11px] font-bold text-[#94A3B8] mb-1 flex items-center gap-1.5">
               <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" /> Nexus AI Assistant
             </div>
             <p className="text-[12px] text-white/90 leading-relaxed">
               Click any document above to read, search formulas, run self-tests, or ask me questions!
             </p>
          </div>
          
          {/* Glowing Orb */}
          <div onClick={() => navigate('/nexus-ai')} className="w-14 h-14 relative shrink-0 cursor-pointer group">
             <div className="absolute inset-0 bg-[#22D3EE] rounded-full blur-[20px] opacity-40 group-hover:opacity-70 transition-opacity"></div>
             <div className="absolute inset-1 bg-gradient-to-br from-white via-[#22D3EE] to-[#3B82F6] rounded-full shadow-[inset_0_0_15px_rgba(255,255,255,0.8)] flex items-center justify-center">
               <Sparkles className="w-6 h-6 text-white" />
             </div>
             <div className="absolute inset-0 border-2 border-[#22D3EE]/50 rounded-full animate-ping opacity-50"></div>
          </div>
        </motion.div>

      </div>

      {/* Interactive Document Viewer Modal */}
      <DocumentViewerModal 
        document={activeDocument} 
        onClose={() => setActiveDocument(null)} 
      />

      {/* PYQ Scanner Modal */}
      <PYQScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
      />
    </div>
  );
}
