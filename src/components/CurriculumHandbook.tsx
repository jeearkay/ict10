import React, { useState } from 'react';
import { getMergedSyllabusModules } from '../lib/contentManager';
import { UserStats } from '../types';
import { BookOpen, Search, Code, CheckCircle, HelpCircle, Save, FileText, ChevronRight } from 'lucide-react';

interface CurriculumHandbookProps {
  userStats: UserStats;
  onUpdateNotes: (chapterId: string, noteText: string) => void;
}

export const CurriculumHandbook: React.FC<CurriculumHandbookProps> = ({ userStats, onUpdateNotes }) => {
  const modules = getMergedSyllabusModules();
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0]?.id || 'cloud-services');
  const [searchQuery, setSearchSearchQuery] = useState<string>('');
  const [activeNoteText, setActiveNoteText] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});

  const activeModule = modules.find((m) => m.id === selectedModuleId) || modules[0];

  const handleSelectModule = (id: string) => {
    setSelectedModuleId(id);
    setActiveNoteText(userStats.notes[id] || '');
  };

  const handleSaveNote = () => {
    onUpdateNotes(selectedModuleId, activeNoteText);
  };

  const toggleAnswer = (levelId: string) => {
    setShowAnswer((prev) => ({ ...prev, [levelId]: !prev[levelId] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Handbook Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-red-950 text-white p-6 rounded-2xl border border-yellow-500/50 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" /> Official Class 10 ICT Reference Guide
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-yellow-300">
            Information Communication & Technology - Class X
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 mt-1">
            Karma Academy • 38 Core Topics & Interactive Exercises
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchSearchQuery(e.target.value)}
            placeholder="Search keywords (e.g. IaaS, APA, =IF, loop)..."
            className="w-full bg-amber-950/80 border border-amber-600/60 rounded-xl pl-9 pr-3 py-2 text-xs text-amber-100 placeholder-amber-400/70 focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Chapter List */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-3 px-2">
            Table of Contents (Modules 1 - 9)
          </h3>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {modules.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelectModule(mod.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-bold border-yellow-300 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{mod.icon}</span>
                    <div>
                      <div className="font-serif leading-tight">Ch. {mod.chapterNumber}: {mod.title}</div>
                      <div className="text-[10px] opacity-80 font-mono mt-0.5">
                        {mod.levels.length} Sub-topics
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail Panel: Sub-topics & Exercises */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-6 shadow-md space-y-6">
            {/* Header */}
            <div className="border-b border-amber-200 dark:border-amber-800/60 pb-4">
              <div className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase">
                Chapter {activeModule.chapterNumber} • {activeModule.bhutanRegion}
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-amber-100 font-serif mt-1">
                {activeModule.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {activeModule.description}
              </p>
            </div>

            {/* Sub-levels */}
            <div className="space-y-6">
              {activeModule.levels.map((lvl) => (
                <div
                  key={lvl.id}
                  className="bg-amber-50/50 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-amber-200 dark:border-slate-700 pb-2">
                    <h4 className="font-bold text-sm text-amber-950 dark:text-yellow-300 font-serif flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Level {lvl.levelNumber}: {lvl.title}
                    </h4>
                    <span className="text-[11px] font-mono bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
                      Unit {lvl.levelNumber}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                    {lvl.summary}
                  </p>

                  {/* Key Concepts bullets */}
                  <div className="space-y-1 bg-white dark:bg-slate-900 p-3 rounded-lg border border-amber-100 dark:border-slate-800 text-xs">
                    <span className="font-bold text-amber-900 dark:text-amber-400 block mb-1">
                      💻 Core Syllabus Concepts:
                    </span>
                    {lvl.keyConcepts.map((kc, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{kc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Sample Formula / Code if available */}
                  {lvl.sampleCodeOrFormula && (
                    <div className="bg-slate-950 text-emerald-300 font-mono text-xs p-3 rounded-lg border border-slate-800 overflow-x-auto">
                      <span className="text-amber-400 text-[10px] font-sans font-bold block mb-1">
                        💻 Core Formula / Code Syntax:
                      </span>
                      <pre className="whitespace-pre-wrap">{lvl.sampleCodeOrFormula}</pre>
                    </div>
                  )}

                  {/* Bhutan Analogy */}
                  <div className="p-3 bg-amber-100/60 dark:bg-amber-950/40 border-l-4 border-amber-500 rounded-r-lg text-xs italic text-amber-900 dark:text-amber-200">
                    <b>Bhutan Analogy:</b> "{lvl.bhutanAnalogy}"
                  </div>

                  {/* Exercise Question & Hint Reveal */}
                  <div className="mt-2 pt-2 border-t border-amber-200 dark:border-slate-700">
                    <div className="text-xs font-bold text-slate-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-600" /> Practice Exercise Question:
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic mb-2">
                      "{lvl.exerciseQuestion}"
                    </p>

                    <button
                      onClick={() => toggleAnswer(lvl.id)}
                      className="text-[11px] font-bold text-amber-700 dark:text-yellow-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {showAnswer[lvl.id] ? 'Hide Solution Guide' : 'Reveal Answer & Solution Guide'}
                    </button>

                    {showAnswer[lvl.id] && (
                      <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs text-emerald-900 dark:text-emerald-200">
                        <b>Solution Guide:</b> Solve this scenario using the concepts outlined in Level {lvl.levelNumber}! Practice writing your full answer in the AI Tutor Chat tab for instant +50 XP validation!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Notebook / Student Revision Notes */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-amber-950/30 border border-yellow-300 dark:border-yellow-800/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-900 dark:text-amber-300 font-serif flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" /> My Personal Study Notes for Chapter {activeModule.chapterNumber}
                </label>
                <button
                  onClick={handleSaveNote}
                  className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Note
                </button>
              </div>
              <textarea
                value={activeNoteText}
                onChange={(e) => setActiveNoteText(e.target.value)}
                placeholder="Write your custom notes, revision formula reminders, or code snippets for this quest..."
                className="w-full h-24 bg-white dark:bg-slate-900 border border-amber-300 dark:border-slate-700 rounded-lg p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
