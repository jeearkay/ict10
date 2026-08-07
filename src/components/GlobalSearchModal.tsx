import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Code2, Map, GraduationCap, ChevronRight, Sparkles, Terminal } from 'lucide-react';
import { getStudentSyllabusModules } from '../lib/contentManager';
import { ActiveTab } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab, subTarget?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut Ctrl+K or Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Gather search results
  const q = query.trim().toLowerCase();

  const results: Array<{
    id: string;
    title: string;
    subtitle: string;
    category: string;
    tab: ActiveTab;
    icon: React.ReactNode;
  }> = [];

  if (q.length > 0) {
    // Search syllabus modules & levels
    getStudentSyllabusModules().forEach((mod) => {
      if (mod.title.toLowerCase().includes(q) || mod.description.toLowerCase().includes(q)) {
        results.push({
          id: `mod-${mod.id}`,
          title: `Chapter ${mod.chapterNumber}: ${mod.title}`,
          subtitle: mod.description,
          category: 'Syllabus Chapter',
          tab: 'map',
          icon: <Map className="w-4 h-4 text-emerald-600" />
        });
      }
      mod.levels.forEach((lvl) => {
        if (
          lvl.title.toLowerCase().includes(q) ||
          lvl.summary.toLowerCase().includes(q) ||
          lvl.keyConcepts.some((c) => c.toLowerCase().includes(q)) ||
          lvl.exerciseQuestion.toLowerCase().includes(q)
        ) {
          results.push({
            id: `lvl-${lvl.id}`,
            title: `Quest Level: ${lvl.title}`,
            subtitle: lvl.summary,
            category: 'Quest & Curriculum',
            tab: 'curriculum',
            icon: <BookOpen className="w-4 h-4 text-[#6D071A]" />
          });
        }
      });
    });

    // Add some common Python / IT search matches
    const pythonKeywords = [
      { name: 'print() function', desc: 'Outputs text or variables to the console.', syntax: 'print("Hello Bhutan")' },
      { name: 'Variables & Assignment', desc: 'Storing data values in memory using = operator.', syntax: 'score = 100' },
      { name: 'If-Else Conditional Statements', desc: 'Branching logic based on boolean conditions.', syntax: 'if mark >= 50: print("Pass")' },
      { name: 'For & While Loops', desc: 'Repeating code blocks.', syntax: 'for i in range(10): print(i)' },
      { name: 'Lists & Dictionaries', desc: 'Collections of ordered or key-value items.', syntax: 'dzongs = ["Thimphu", "Paro"]' },
      { name: 'Functions (def)', desc: 'Reusable blocks of code.', syntax: 'def calculate_grade(marks): ...' },
      { name: 'Cloud Computing (IaaS, PaaS, SaaS)', desc: 'Cloud service models.', syntax: 'SaaS is fully hosted.' },
      { name: 'Python Recursive Functions', desc: 'Self-calling functions with base case.', syntax: 'def factorial(n): ...' }
    ];

    pythonKeywords.forEach((pk, idx) => {
      if (pk.name.toLowerCase().includes(q) || pk.desc.toLowerCase().includes(q) || pk.syntax.toLowerCase().includes(q)) {
        results.push({
          id: `pykw-${idx}`,
          title: pk.name,
          subtitle: `${pk.desc} (${pk.syntax})`,
          category: 'Python & Syntax',
          tab: 'pythonref',
          icon: <Code2 className="w-4 h-4 text-blue-600" />
        });
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in"
      onClick={onClose}
      aria-hidden="true"
    >
      <div 
        className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] w-full max-w-2xl rounded-3xl shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        {/* Search Input Header */}
        <div className="p-4 border-b-3 border-[#1A1A1A] flex items-center gap-3 bg-white dark:bg-slate-800">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, quest levels, Python syntax, cloud concepts..."
            className="w-full bg-transparent text-[#1A1A1A] dark:text-white font-medium text-base focus:outline-none placeholder-gray-400"
          />
          {query && (
            <button 
              type="button"
              onClick={() => setQuery('')}
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 font-bold"
            >
              Clear
            </button>
          )}
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 transition-colors"
            aria-label="Close global search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {q.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFCC33]/30 border-2 border-[#1A1A1A] flex items-center justify-center text-xl">
                🔍
              </div>
              <h4 className="font-serif font-black text-lg text-[#1A1A1A] dark:text-white">Bhutan ICT Global Search</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Type keywords like <span className="font-bold text-[#6D071A]">"Python"</span>, <span className="font-bold text-[#6D071A]">"Cloud"</span>, <span className="font-bold text-[#6D071A]">"Variables"</span>, or <span className="font-bold text-[#6D071A]">"Functions"</span> to instantly jump to the syllabus handbook or code reference.
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {['Python', 'Cloud', 'Excel', 'Loops', 'IaaS'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1 bg-amber-100 dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-xl font-bold hover:bg-[#FFCC33] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-black text-gray-700 dark:text-gray-300">No matching topics found for "{query}"</p>
              <p className="text-xs text-gray-500">Try searching for broader terms like "python", "cloud", or "exam"</p>
            </div>
          ) : (
            results.map((res) => (
              <div
                key={res.id}
                onClick={() => {
                  onNavigate(res.tab);
                  onClose();
                }}
                className="group p-3.5 bg-white dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-2xl shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-slate-700 border border-[#1A1A1A] shrink-0 mt-0.5">
                    {res.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFCC33]/40 border border-[#1A1A1A] text-[#1A1A1A]">
                        {res.category}
                      </span>
                    </div>
                    <h4 className="font-serif font-black text-sm text-[#1A1A1A] dark:text-white truncate mt-1">
                      {res.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                      {res.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#6D071A] shrink-0 ml-2 transition-colors" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-50 dark:bg-slate-800 border-t-2 border-[#1A1A1A] flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-[#1A1A1A] rounded font-mono text-[10px]">ESC</kbd> to close</span>
          <span>{results.length} result{results.length === 1 ? '' : 's'} found</span>
        </div>
      </div>
    </div>
  );
};
