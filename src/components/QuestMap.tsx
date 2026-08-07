import React from 'react';
import { getStudentSyllabusModules } from '../lib/contentManager';
import { QuestModule, QuestLevel, UserStats } from '../types';
import { TaktsangMonasteryIcon, BhutanDragonIcon, PrayerFlagIcon } from './BhutanVisuals';
import { 
  CheckCircle2, Lock, Play, Sparkles, MapPin, Award, Mountain, 
  ChevronRight, Crown, Compass, ArrowUpRight, Check
} from 'lucide-react';

interface QuestMapProps {
  userStats: UserStats;
  onSelectLevel: (module: QuestModule, level: QuestLevel) => void;
}

export const QuestMap: React.FC<QuestMapProps> = ({ userStats, onSelectLevel }) => {
  const modules = getStudentSyllabusModules();
  // Calculate total levels and overall completion count
  const totalLevelsCount = modules.reduce((acc, m) => acc + m.levels.length, 0);
  const completedCount = userStats.completedLevels.length;
  const overallPercent = Math.min(100, Math.round((completedCount / (totalLevelsCount || 1)) * 100));

  // Function to smoothly scroll to a module on click
  const scrollToModule = (chapterNumber: number) => {
    const el = document.getElementById(`module-ch-${chapterNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. MOUNTAIN TRAIL BANNER HEADER USING CSS GRID */}
      <div className="bg-[#6D071A] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-[6px_6px_0px_0px_#1A1A1A] border-3 sm:border-4 border-[#1A1A1A] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Grid Cell: Intro Content */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-[#FFCC33] border-2 border-[#1A1A1A] px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black text-[#1A1A1A] uppercase tracking-wider shadow-[2px_2px_0px_0px_#1A1A1A]">
              <Sparkles className="w-3.5 h-3.5 text-[#6D071A]" /> Class 10 ICT Bhutan Syllabus
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-serif leading-tight">
              The Quest Trail to Paro Taktsang & Thimphu TechPark
            </h2>

            <p className="text-amber-100 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
              Kuzu zangpo, <b className="text-[#FFCC33]">{userStats.studentName}</b>! Ascend through 9 ICT Quests based on the Class 10 Bhutan ICT Curriculum. Earn XP, unlock badges, and test Python scripts & Excel formulas along the mountain trail!
            </p>

            {/* Grid for Quick Stats Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-1 text-xs font-black text-[#1A1A1A]">
              <div className="flex items-center gap-2 bg-[#FFCC33] border-2 border-[#1A1A1A] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A]">
                <MapPin className="w-4 h-4 text-[#6D071A] shrink-0" />
                <span className="truncate">Paro & Thimphu</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FFCC33] border-2 border-[#1A1A1A] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A]">
                <Award className="w-4 h-4 text-[#6D071A] shrink-0" />
                <span className="truncate">+50 XP / Level</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FFCC33] border-2 border-[#1A1A1A] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] col-span-2 sm:col-span-1">
                <Mountain className="w-4 h-4 text-[#6D071A] shrink-0" />
                <span className="truncate">{completedCount}/{totalLevelsCount} Quests Done</span>
              </div>
            </div>
          </div>

          {/* Right Grid Cell: Paro Taktsang Monastery Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border-3 border-[#1A1A1A] overflow-hidden bg-gradient-to-br from-amber-950 via-red-950 to-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] p-4 sm:p-5 text-white flex flex-col justify-between min-h-[220px]">
              {/* Background Taktsang Image */}
              <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop" 
                  alt="Paro Taktsang Tiger's Nest Monastery Bhutan" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#FFCC33] border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A]">
                    <TaktsangMonasteryIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider">Summit Elevation</div>
                    <div className="font-serif font-black text-sm text-white">Paro Taktsang (3,120m)</div>
                  </div>
                </div>
                <span className="bg-[#FFCC33] text-[#1A1A1A] border-2 border-[#1A1A1A] text-[10px] font-black px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_0px_#1A1A1A]">
                  {overallPercent}% Ascended
                </span>
              </div>

              {/* Trail Progress Graphic */}
              <div className="relative z-10 my-3 space-y-2">
                <div className="flex justify-between text-xs font-black text-amber-200">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#FFCC33]" /> Base Camp
                  </span>
                  <span className="flex items-center gap-1 text-[#FFCC33]">
                    <Crown className="w-3.5 h-3.5" /> Tiger's Nest Summit
                  </span>
                </div>

                <div className="w-full bg-black/40 h-3 rounded-full border-2 border-white/30 overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-amber-400 via-[#FFCC33] to-amber-200 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,204,51,0.5)]"
                    style={{ width: `${Math.max(5, overallPercent)}%` }}
                  />
                </div>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-bold text-amber-100/90 pt-1 border-t border-white/20">
                <span>9 Curriculum Modules</span>
                <span className="text-[#FFCC33] font-black">27 ICT Skill Quests</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. PARO TAKTSANG TRAIL PATH (PROPORTIONAL CSS GRID MAP) */}
      <div className="bg-white border-3 sm:border-4 border-[#1A1A1A] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1A1A1A] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFCC33] border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] font-black shadow-[2px_2px_0px_0px_#1A1A1A]">
              <Mountain className="w-5 h-5 text-[#6D071A]" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-[#1A1A1A] font-serif leading-tight">
                Paro Taktsang Trail Ascent Path
              </h3>
              <p className="text-xs text-gray-600 font-medium">
                Tap any chapter checkpoint below to jump directly to its ICT Quests.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-black">
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-400 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-700" /> Cleared
            </span>
            <span className="bg-amber-100 text-amber-900 border border-amber-400 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Available
            </span>
          </div>
        </div>

        {/* Proportional CSS Grid for Trail Checkpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-3 sm:gap-4 pt-1">
          {modules.map((module) => {
            const moduleLevels = module.levels;
            const completedInModule = moduleLevels.filter((l) => userStats.completedLevels.includes(l.id)).length;
            const isFullyCleared = completedInModule === moduleLevels.length;
            const isStarted = completedInModule > 0;

            return (
              <button
                key={module.id}
                onClick={() => scrollToModule(module.chapterNumber)}
                className={`group relative p-3.5 sm:p-4 rounded-2xl border-2 sm:border-3 border-[#1A1A1A] text-left transition-all cursor-pointer flex flex-col justify-between shadow-[3px_3px_0px_0px_#1A1A1A] hover:-translate-y-1 ${
                  isFullyCleared
                    ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-900'
                    : isStarted
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-900'
                    : 'bg-[#FDFCF0] hover:bg-white'
                }`}
              >
                {/* Node Top Header */}
                <div className="flex items-center justify-between mb-2 w-full">
                  <span className="text-[10px] font-black uppercase text-gray-700 font-mono tracking-wider">
                    Chapter {module.chapterNumber}
                  </span>

                  {isFullyCleared ? (
                    <span className="w-6 h-6 rounded-full bg-[#FFCC33] text-[#1A1A1A] flex items-center justify-center border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]" title="Chapter Fully Cleared">
                      <PrayerFlagIcon className="w-3.5 h-3.5" />
                    </span>
                  ) : isStarted ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFCC33] text-[#1A1A1A] flex items-center justify-center border border-[#1A1A1A] font-black text-[10px] shadow-[1px_1px_0px_0px_#1A1A1A]">
                      {completedInModule}/{moduleLevels.length}
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center border border-gray-400 font-bold text-[10px]">
                      {module.chapterNumber}
                    </span>
                  )}
                </div>

                {/* Node Title & Icon */}
                <div className="space-y-1.5 my-1">
                  <div className="text-2xl leading-none">{module.icon}</div>
                  <div className="font-black text-xs sm:text-sm text-[#1A1A1A] font-serif line-clamp-2 group-hover:text-[#6D071A] transition-colors leading-snug">
                    {module.title}
                  </div>
                </div>

                {/* Node Footer: Region Tag */}
                <div className="pt-2 border-t border-gray-200/80 mt-2 text-[10px] font-bold text-gray-600 truncate flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 shrink-0 text-[#6D071A]" />
                  <span className="truncate">{module.bhutanRegion}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SYLLABUS MODULES & QUEST LEVELS GRID */}
      <div className="space-y-8">
        {modules.map((module) => (
          <div
            key={module.id}
            id={`module-ch-${module.chapterNumber}`}
            className="bg-white border-3 sm:border-4 border-[#1A1A1A] rounded-2xl sm:rounded-3xl shadow-[5px_5px_0px_0px_#1A1A1A] sm:shadow-[7px_7px_0px_0px_#1A1A1A] overflow-hidden transition-all scroll-mt-20"
          >
            {/* Module Banner */}
            <div className="bg-[#FFCC33] p-4 sm:p-5 border-b-3 sm:border-b-4 border-[#1A1A1A] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white text-[#1A1A1A] font-black text-xl sm:text-2xl flex items-center justify-center shadow-[2px_2px_0px_0px_#1A1A1A] font-serif border-2 border-[#1A1A1A] shrink-0">
                  {module.icon}
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-black uppercase text-[#6D071A] tracking-wider">
                    Chapter {module.chapterNumber} • {module.bhutanRegion}
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-[#1A1A1A] font-serif leading-snug">
                    {module.title}
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/85 font-medium mt-0.5 max-w-3xl leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="text-xs font-black text-[#1A1A1A] bg-white border-2 border-[#1A1A1A] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] shrink-0">
                {module.levels.length} Interactive Quests
              </div>
            </div>

            {/* Levels CSS Grid */}
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
              {module.levels.map((level) => {
                const isCompleted = userStats.completedLevels.includes(level.id);
                return (
                  <div
                    key={level.id}
                    onClick={() => onSelectLevel(module, level)}
                    className={`group relative p-5 rounded-2xl border-3 sm:border-4 border-[#1A1A1A] transition-all cursor-pointer flex flex-col justify-between shadow-[4px_4px_0px_0px_#1A1A1A] hover:-translate-y-1 ${
                      isCompleted
                        ? 'bg-emerald-100 hover:bg-emerald-200'
                        : 'bg-[#FDFCF0] hover:bg-amber-50'
                    }`}
                  >
                    <div>
                      {/* Level Badge Header */}
                      <div className="flex items-center justify-between mb-2.5 gap-2">
                        <span className="text-[10px] font-black uppercase text-[#1A1A1A] bg-white border-2 border-[#1A1A1A] px-2.5 py-0.5 rounded-lg font-mono truncate">
                          Level {level.levelNumber} • Unit {level.levelNumber}
                        </span>
                        {isCompleted ? (
                          <span className="flex items-center gap-1.5 text-emerald-900 bg-emerald-200 border border-[#1A1A1A] text-xs font-black px-2.5 py-1 rounded-full shrink-0 shadow-[1px_1px_0px_0px_#1A1A1A]">
                            <PrayerFlagIcon className="w-4 h-4 text-amber-700" />
                            <span>Cleared</span>
                          </span>
                        ) : (
                          <span className="text-xs font-black text-[#6D071A] bg-[#FFCC33] border-2 border-[#1A1A1A] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-[2px_2px_0px_0px_#1A1A1A] shrink-0">
                            <Sparkles className="w-3 h-3" /> +{level.xpReward} XP
                          </span>
                        )}
                      </div>

                      <h4 className="font-black text-sm sm:text-base text-[#1A1A1A] mb-2 font-serif group-hover:text-[#6D071A] transition-colors leading-snug">
                        {level.title}
                      </h4>

                      <p className="text-xs text-[#1A1A1A]/80 font-medium line-clamp-2 leading-relaxed mb-3">
                        {level.summary}
                      </p>

                      <div className="p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl text-[11px] text-[#6D071A] font-bold italic mb-4 shadow-[2px_2px_0px_0px_#1A1A1A] leading-relaxed">
                        🏔️ "{level.bhutanAnalogy}"
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLevel(module, level);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] ${
                        isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-[#6D071A] hover:bg-red-900 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span className="truncate">{isCompleted ? 'Revisit Quest' : 'Start Quest with Guna'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
