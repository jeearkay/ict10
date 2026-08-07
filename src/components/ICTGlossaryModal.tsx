import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, X, Code2, Copy, Check, Sparkles, Terminal, 
  Lightbulb, ChevronRight, Globe, Layers, ArrowUpRight,
  Volume2, RotateCw, CheckCircle2, XCircle, Award
} from 'lucide-react';
import { ICT_GLOSSARY_TERMS, ICTGlossaryTerm } from '../lib/ictGlossary';
import { DZONGKHA_GLOSSARY, DzongkhaTerm } from '../lib/dzongkhaDictionary';
import { getStudentGlossaryTerms, useContentRefresh } from '../lib/contentManager';
import { speakText } from '../lib/speech';

interface ICTGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
  onOpenInIde?: (codeSnippet: string) => void;
}

export const ICTGlossaryModal: React.FC<ICTGlossaryModalProps> = ({
  isOpen,
  onClose,
  initialTerm,
  onOpenInIde
}) => {
  const contentVersion = useContentRefresh();
  const allTerms = getStudentGlossaryTerms();
  const [viewMode, setViewMode] = useState<'glossary' | 'flashcards' | 'dzongkha'>('glossary');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTerm, setSelectedTerm] = useState<ICTGlossaryTerm>(() => allTerms[0] || ICT_GLOSSARY_TERMS[0]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Flashcards state
  const [cardIdx, setCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredTermIds, setMasteredTermIds] = useState<string[]>([]);

  // Sync initial search or term when opened
  useEffect(() => {
    if (initialTerm) {
      setSearchQuery(initialTerm);
      const matched = allTerms.find(
        (t) =>
          t.term.toLowerCase().includes(initialTerm.toLowerCase()) ||
          t.id.toLowerCase() === initialTerm.toLowerCase() ||
          t.keywords.some((k) => k.toLowerCase() === initialTerm.toLowerCase())
      );
      if (matched) {
        setSelectedTerm(matched);
      }
    }
  }, [initialTerm, isOpen, contentVersion]);

  if (!isOpen) return null;

  const categories = ['All', 'Python', 'Algorithms', 'Cloud & Workspace', 'Copyright & Ethics', 'Excel & Data'];

  // Filter terms by search query and category
  const filteredTerms = allTerms.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      item.term.toLowerCase().includes(q) ||
      item.dzongkha.includes(q) ||
      item.phonetic.toLowerCase().includes(q) ||
      item.simplifiedDefinition.toLowerCase().includes(q) ||
      item.bhutanContext.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="bg-white dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-[8px_8px_0px_0px_#6D071A] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="ICT glossary"
      >
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#6D071A] via-amber-900 to-slate-900 text-amber-100 p-4 sm:p-5 border-b-4 border-[#FFCC33] flex flex-col md:flex-row md:items-center justify-between items-start gap-4 shrink-0">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#FFCC33] text-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] shrink-0 mt-1 md:mt-0">
              <BookOpen className="w-6 h-6 text-[#6D071A]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif font-black text-lg sm:text-xl text-yellow-300 leading-tight">
                  Class 10 ICT Glossary & Terminology
                </h2>
                <span className="inline-block bg-[#FFCC33] text-[#1A1A1A] text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Bhutan Curriculum
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium mt-1">
                Simplified technical definitions, Dzongkha translations, Bhutanese contexts & code examples
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <div className="flex bg-slate-800 p-1 rounded-xl border border-amber-400/30 flex-1 md:flex-none justify-center">
              <button
                onClick={() => setViewMode('glossary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'glossary'
                    ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Glossary</span>
              </button>
              <button
                onClick={() => setViewMode('dzongkha')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'dzongkha'
                    ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Dzongkha Terms</span>
              </button>
              <button
                onClick={() => setViewMode('flashcards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'flashcards'
                    ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Flashcards</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-200 hover:text-white rounded-xl border border-amber-400/50 cursor-pointer transition-all shrink-0"
              title="Close Glossary"
              aria-label="Close glossary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW MODE: DZONGKHA TECHNICAL TERMS */}
        {viewMode === 'dzongkha' && (
          <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-900 text-white">
            <div className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border-2 border-amber-400/40">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-yellow-300" />
                <div>
                  <h3 className="font-serif font-black text-sm sm:text-base text-yellow-300">
                    Dzongkha Technical Terminology Glossary ({DZONGKHA_GLOSSARY.length} Terms)
                  </h3>
                  <p className="text-xs text-amber-200/80">
                    Official Bhutanese technical vocabulary for ICT curriculum and coding.
                  </p>
                </div>
              </div>
              <div className="relative w-64 hidden sm:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Dzongkha or English..."
                  className="w-full bg-slate-950 border border-slate-700 pl-9 pr-3 py-1.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {DZONGKHA_GLOSSARY.filter((term) => {
                const q = searchQuery.toLowerCase().trim();
                if (!q) return true;
                return (
                  term.english.toLowerCase().includes(q) ||
                  term.dzongkha.includes(q) ||
                  term.phonetic.toLowerCase().includes(q) ||
                  term.definition.toLowerCase().includes(q) ||
                  term.category.toLowerCase().includes(q)
                );
              }).map((term, tIdx) => (
                <div
                  key={tIdx}
                  className="bg-slate-800/90 border-2 border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl shadow-md space-y-2 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-300 mb-1">
                      <span>{term.category}</span>
                      <button
                        onClick={() => speakText(`${term.english}. Dzongkha: ${term.dzongkha}`)}
                        className="text-amber-400 hover:text-white cursor-pointer p-1"
                        title="Pronounce Dzongkha"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-base font-black font-serif text-yellow-300">
                      {term.dzongkha}
                    </div>
                    <div className="text-xs font-bold text-amber-100">
                      {term.english} <span className="font-mono font-normal text-slate-400 text-[11px]">({term.phonetic})</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {term.definition}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW MODE: FLASHCARDS SPACED REPETITION */}
        {viewMode === 'flashcards' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col items-center justify-center bg-slate-900 text-white">
            {/* Mastery Header Bar */}
            <div className="w-full max-w-xl flex items-center justify-between text-xs font-black text-amber-300 bg-slate-800 p-3 rounded-2xl border-2 border-amber-400/40">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-yellow-300" />
                Spaced Repetition Mastery: {masteredTermIds.length} / {ICT_GLOSSARY_TERMS.length} Terms
              </span>
              <span>Card {cardIdx + 1} of {ICT_GLOSSARY_TERMS.length}</span>
            </div>

            {/* Interactive Flip Flashcard */}
            {ICT_GLOSSARY_TERMS[cardIdx] && (() => {
              const currentCard = ICT_GLOSSARY_TERMS[cardIdx];
              const isMastered = masteredTermIds.includes(currentCard.id);

              return (
                <div className="w-full max-w-xl space-y-4">
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`min-h-[260px] p-6 sm:p-8 rounded-3xl border-4 border-[#FFCC33] shadow-[8px_8px_0px_0px_#6D071A] cursor-pointer transition-all flex flex-col justify-between ${
                      isFlipped
                        ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 text-amber-100'
                        : 'bg-gradient-to-br from-[#6D071A] to-amber-950 text-white'
                    }`}
                  >
                    {/* Card Front Top */}
                    <div className="flex items-center justify-between">
                      <span className="bg-[#FFCC33] text-[#1A1A1A] font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                        {currentCard.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(`${currentCard.term}. Dzongkha: ${currentCard.dzongkha}. ${currentCard.simplifiedDefinition}`);
                        }}
                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-yellow-300 cursor-pointer"
                        title="Pronounce Term"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Card Body */}
                    {!isFlipped ? (
                      <div className="text-center py-6 space-y-2">
                        <h3 className="text-3xl font-black font-serif text-yellow-300">
                          {currentCard.term}
                        </h3>
                        <p className="text-sm font-bold text-amber-200">
                          Dzongkha: {currentCard.dzongkha} ({currentCard.phonetic})
                        </p>
                        <p className="text-[11px] text-gray-400 mt-4 animate-pulse">
                          👉 Click card or button below to reveal definition & example
                        </p>
                      </div>
                    ) : (
                      <div className="py-2 space-y-3">
                        <h4 className="font-black text-lg text-yellow-300 border-b border-white/10 pb-1">
                          {currentCard.term} — Simplified Definition:
                        </h4>
                        <p className="text-xs sm:text-sm font-medium leading-relaxed text-amber-100">
                          {currentCard.simplifiedDefinition}
                        </p>
                        <div className="p-2.5 bg-white/10 rounded-xl text-[11px] text-amber-200/90 font-mono">
                          🇧🇹 <strong>Bhutan Context:</strong> {currentCard.bhutanContext}
                        </div>
                      </div>
                    )}

                    {/* Card Footer Status */}
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-300/80 pt-2 border-t border-white/10">
                      <span>{isMastered ? '🟢 Mastered Term' : '🟡 Learning in Progress'}</span>
                      <span className="flex items-center gap-1 text-yellow-300">
                        <RotateCw className="w-3.5 h-3.5" /> Tap to Flip
                      </span>
                    </div>
                  </div>

                  {/* Rating Action Controls */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setMasteredTermIds((prev) => prev.filter((id) => id !== currentCard.id));
                        setIsFlipped(false);
                        setCardIdx((prev) => (prev + 1) % ICT_GLOSSARY_TERMS.length);
                      }}
                      className="flex-1 py-3 bg-rose-900 hover:bg-rose-800 text-rose-100 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-rose-500 cursor-pointer flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_#1A1A1A]"
                    >
                      <XCircle className="w-4 h-4 text-rose-300" />
                      <span>Needs Practice</span>
                    </button>

                    <button
                      onClick={() => {
                        if (!masteredTermIds.includes(currentCard.id)) {
                          setMasteredTermIds((prev) => [...prev, currentCard.id]);
                        }
                        setIsFlipped(false);
                        setCardIdx((prev) => (prev + 1) % ICT_GLOSSARY_TERMS.length);
                      }}
                      className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-emerald-400 cursor-pointer flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_#1A1A1A]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Mastered!</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* SEARCH BAR & CATEGORY TABS */}
        <div className="p-4 bg-amber-50 dark:bg-slate-800/90 border-b border-amber-200 dark:border-slate-700 space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-amber-700 dark:text-amber-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search term (e.g. Variable, Function, Loop, Excel, VLOOKUP, Copyright, Dzongkha term)..."
              className="w-full bg-white dark:bg-slate-950 border-2 border-[#1A1A1A] dark:border-slate-700 pl-10 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs font-bold bg-gray-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <span className="text-[11px] font-black text-amber-900 dark:text-amber-200 shrink-0 uppercase tracking-wider mr-1">
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#6D071A] text-amber-200 border border-[#FFCC33] shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-slate-700 hover:bg-amber-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA: SPLIT VIEW (TERM LIST + DETAIL VIEW) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-amber-200 dark:divide-slate-800">
          
          {/* LEFT COLUMN: TERM LIST */}
          <div className="lg:col-span-5 p-3 overflow-y-auto max-h-[300px] lg:max-h-none space-y-2 bg-slate-50 dark:bg-slate-950">
            <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider px-1 pb-1 flex items-center justify-between">
              <span>Matching Terms ({filteredTerms.length})</span>
              <span>Class 10 ICT</span>
            </div>

            {filteredTerms.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No terms matching "{searchQuery}". Try searching "Variable", "Loop", or "Recursion".
              </div>
            ) : (
              filteredTerms.map((t) => {
                const isSelected = selectedTerm.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTerm(t)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFCC33] text-[#1A1A1A] border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] font-extrabold'
                        : 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-black font-sans">{t.term}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? 'bg-[#6D071A] text-amber-200 border-[#1A1A1A]'
                            : 'bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-slate-700'
                        }`}
                      >
                        {t.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] mt-1 opacity-90">
                      <span className="font-serif font-bold">{t.dzongkha} ({t.phonetic})</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT COLUMN: TERM DETAIL VIEW */}
          <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto space-y-5 bg-white dark:bg-slate-900">
            {selectedTerm ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Term Header */}
                <div className="bg-amber-50 dark:bg-slate-800/80 p-4 rounded-3xl border-2 border-amber-300 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="bg-[#6D071A] text-amber-200 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase border border-[#FFCC33]">
                      {selectedTerm.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      ICT ID: {selectedTerm.id}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black font-serif text-[#1A1A1A] dark:text-yellow-300">
                    {selectedTerm.term}
                  </h3>

                  <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-slate-700 w-fit">
                    <Globe className="w-4 h-4 text-amber-600" />
                    <span>Dzongkha: <strong>{selectedTerm.dzongkha}</strong></span>
                    <span className="text-xs text-slate-500">({selectedTerm.phonetic})</span>
                  </div>
                </div>

                {/* Simplified Definition Box */}
                <div className="space-y-1.5">
                  <div className="text-xs font-black uppercase text-[#6D071A] dark:text-amber-300 tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-yellow-500" /> Simplified Definition
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border-2 border-[#1A1A1A] dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                    {selectedTerm.simplifiedDefinition}
                  </div>
                </div>

                {/* Bhutanese Curriculum Context Box */}
                <div className="space-y-1.5">
                  <div className="text-xs font-black uppercase text-amber-900 dark:text-yellow-400 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Bhutanese Class 10 Curriculum Context
                  </div>
                  <div className="p-4 bg-amber-500/10 border-2 border-amber-400/60 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-amber-200 leading-relaxed">
                    {selectedTerm.bhutanContext}
                  </div>
                </div>

                {/* Practical Example / Code Snippet */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-emerald-500" /> Practical Example & Code Snippet
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(selectedTerm.exampleCode)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-lg text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                      {onOpenInIde && (
                        <button
                          onClick={() => {
                            onOpenInIde(selectedTerm.exampleCode);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-[#FFCC33] text-[#1A1A1A] hover:bg-yellow-400 font-extrabold text-[11px] rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Try in Python IDE</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <pre className="p-4 bg-slate-950 text-emerald-400 rounded-2xl border-2 border-slate-800 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {selectedTerm.exampleCode}
                  </pre>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select a term on the left to view its definition and Bhutanese curriculum examples.
              </div>
            )}
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 bg-amber-50 dark:bg-slate-800 border-t border-amber-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-medium shrink-0">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Click any highlighted term in GunaTutorChat anytime to view this glossary!</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1A1A1A] text-white hover:bg-slate-800 rounded-xl font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
