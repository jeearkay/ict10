import React from 'react';
import { ActiveTab } from '../types';
import { Map, Code2, Table2, MessageSquareCode, Zap } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenFlowcharts: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenFlowcharts
}) => {
  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex justify-around items-center shadow-[0_-4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)] transition-all duration-300"
      aria-label="Mobile primary navigation"
    >
      {/* Quests */}
      <button
        type="button"
        onClick={() => onSelectTab('map')}
        aria-label="Open Quests"
        className={`min-h-11 flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'map'
            ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-bold scale-105'
            : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        <Map className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">Quests</span>
      </button>

      {/* Python IDE */}
      <button
        type="button"
        onClick={() => onSelectTab('python')}
        aria-label="Open Python IDE"
        className={`min-h-11 flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'python'
            ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-bold scale-105'
            : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        <Code2 className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">IDE</span>
      </button>

      {/* Flowcharts */}
      <button
        type="button"
        onClick={onOpenFlowcharts}
        aria-label="Open Flowchart Builder"
        className="min-h-11 flex flex-col items-center justify-center py-1 px-3.5 rounded-xl text-amber-600 hover:bg-slate-100 dark:text-amber-400 dark:hover:bg-slate-900 transition-all cursor-pointer"
      >
        <Zap className="w-5 h-5 text-amber-500" />
        <span className="text-[10px] font-bold mt-1">Flowchart</span>
      </button>

      {/* MS Excel */}
      <button
        type="button"
        onClick={() => onSelectTab('excel')}
        aria-label="Open Excel Lab"
        className={`min-h-11 flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'excel'
            ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-bold scale-105'
            : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        <Table2 className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">Excel</span>
      </button>

      {/* Guna AI Tutor */}
      <button
        type="button"
        onClick={() => onSelectTab('tutor')}
        aria-label="Open AI Tutor"
        className={`min-h-11 flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'tutor'
            ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-bold scale-105'
            : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        <MessageSquareCode className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">AI Tutor</span>
      </button>
    </nav>
  );
};
