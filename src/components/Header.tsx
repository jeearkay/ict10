import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, UserStats } from '../types';
import { StudentProfile } from '../lib/firebase';
import { useLanguage } from '../lib/LanguageContext';
import { INITIAL_BADGES } from '../data/syllabus';
import { Logo } from './Logo';
import { 
  Flame, Trophy, Map, MessageSquareCode, Code2, Table2, BookOpen, FileCode,
  Sparkles, Cpu, GraduationCap, Users, ChevronDown, Check, Menu, X, User, KeyRound, Sun, Moon,
  Wifi, WifiOff, History, Flag, Globe, LogOut, Search, Zap, Landmark
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userStats: UserStats;
  currentUser: StudentProfile | null;
  onOpenAuthModal: () => void;
  onOpenProfileSettings?: () => void;
  onOpenStudyRoom?: () => void;
  onOpenGlossary: () => void;
  onOpenFlowcharts?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout?: () => void;
  onSelectHomeworkSheet?: (sheetId: string) => void;
}

const getNameInitials = (name?: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  return parts.map((p) => p.charAt(0).toUpperCase()).join('');
};

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  desc: string;
}

interface NavCategory {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    title: 'Quests & AI',
    icon: <Map className="w-4 h-4 text-emerald-700" />,
    items: [
      { id: 'map', label: 'Quests Trail', icon: <Map className="w-4 h-4 text-emerald-600" />, desc: 'Class 10 Syllabus Quest Map' },
      { id: 'tutor', label: 'Guna AI Tutor', icon: <MessageSquareCode className="w-4 h-4 text-[#6D071A]" />, desc: '24/7 Bhutanese ICT AI Assistant' }
    ]
  },
  {
    title: 'Practical Labs',
    icon: <Code2 className="w-4 h-4 text-blue-700" />,
    items: [
      { id: 'python', label: 'Python IDE', icon: <Code2 className="w-4 h-4 text-emerald-600" />, desc: 'Write & Execute Python Code' },
      { id: 'pythonref', label: 'Python Syntax Reference', icon: <FileCode className="w-4 h-4 text-[#6D071A]" />, desc: 'Class 10 Syntax Cheat Sheet & Rules' },
      { id: 'pythonvisualizer', label: 'Python Step Visualizer', icon: <Cpu className="w-4 h-4 text-amber-600" />, desc: 'Line-by-Line Memory Visualizer' },
      { id: 'excel', label: 'MS Excel Lab', icon: <Table2 className="w-4 h-4 text-blue-600" />, desc: 'Spreadsheet Practice' },
      { id: 'flowcharts', label: 'Algorithm Flowcharts', icon: <Zap className="w-4 h-4 text-amber-500" />, desc: 'Build Algorithm Flowcharts' }
    ]
  },
  {
    title: 'Study & Exams',
    icon: <GraduationCap className="w-4 h-4 text-purple-700" />,
    items: [
      { id: 'examprep', label: 'Exam Prep & Flashcards', icon: <GraduationCap className="w-4 h-4 text-[#6D071A]" />, desc: 'MCQs, Past Papers & Quizzes' },
      { id: 'bhutantrivia', label: 'Bhutan Tech History Trivia', icon: <History className="w-4 h-4 text-amber-600" />, desc: '1999–Present Digital Milestones Quiz' },
      { id: 'curriculum', label: 'Curriculum Handbook', icon: <BookOpen className="w-4 h-4 text-emerald-600" />, desc: 'Syllabus Chapter Guides' }
    ]
  },
  {
    title: 'Portal & Stats',
    icon: <Users className="w-4 h-4 text-amber-800" />,
    items: [
      { id: 'leaderboard', label: 'Class Leaderboard', icon: <Trophy className="w-4 h-4 text-amber-500" />, desc: 'Rankings & Top Scholars' },
      { id: 'teacher', label: 'Teacher Portal & Notes', icon: <Users className="w-4 h-4 text-[#6D071A]" />, desc: 'Lesson Plans & Class Records' },
      { id: 'profile', label: 'Profile & Badges', icon: <Sparkles className="w-4 h-4 text-amber-500" />, desc: 'XP Statistics & Achievements' }
    ]
  },
  {
    title: 'Homework',
    icon: <BookOpen className="w-4 h-4 text-emerald-700" />,
    items: [
      { id: 'homework-cloud', label: '1. Cloud & Workspace', icon: <Cpu className="w-4 h-4 text-emerald-600" />, desc: 'SaaS, Hybrid Cloud, and Workspace collaboration' },
      { id: 'homework-copyright', label: '2. Ownership & Copyright', icon: <FileCode className="w-4 h-4 text-[#6D071A]" />, desc: 'Fair Use, CC licenses, and citations' },
      { id: 'homework-python-basics', label: '3. Python Basics & Input', icon: <Code2 className="w-4 h-4 text-amber-600" />, desc: 'print(), input() function and variables' },
      { id: 'homework-operators', label: '4. Operators & Math', icon: <Table2 className="w-4 h-4 text-blue-600" />, desc: 'Arithmetic, comparison, and circle formulas' },
      { id: 'homework-strings', label: '5. Strings & Slicing', icon: <MessageSquareCode className="w-4 h-4 text-emerald-600" />, desc: 'Slicing syntax and string methods' },
      { id: 'homework-conditionals', label: '6. If-Else Decisions', icon: <Users className="w-4 h-4 text-[#6D071A]" />, desc: 'Comparison logic and palindrome checking' },
      { id: 'homework-nested', label: '7. Nested Conditionals', icon: <Trophy className="w-4 h-4 text-amber-500" />, desc: 'Stream eligibility and voting checks' },
      { id: 'homework-loops', label: '8. For & While Loops', icon: <Sparkles className="w-4 h-4 text-amber-500" />, desc: 'Iterators, break, continue and patterns' },
      { id: 'homework-collections', label: '9. Lists, Sets & Dicts', icon: <Map className="w-4 h-4 text-[#6D071A]" />, desc: 'Slicing, mutations, and comprehensions' },
      { id: 'homework-functions', label: '10. Functions & Recursion', icon: <GraduationCap className="w-4 h-4 text-[#6D071A]" />, desc: 'Recursive factorials and variable scope' },
    ]
  },
  {
    title: 'ICT Glossary',
    icon: <BookOpen className="w-4 h-4 text-amber-300" />,
    items: [
      { id: 'glossary', label: 'Class 10 ICT Glossary', icon: <BookOpen className="w-4 h-4 text-[#6D071A]" />, desc: '38 Authorized Concepts & Definitions' }
    ]
  }
];

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  userStats, 
  currentUser, 
  onOpenAuthModal,
  onOpenProfileSettings,
  onOpenStudyRoom,
  onOpenGlossary,
  onOpenFlowcharts,
  theme,
  onToggleTheme,
  onLogout,
  onSelectHomeworkSheet
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const navRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Monitor network online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenCategoryIndex(null);
      }

      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'flowcharts') {
      onOpenFlowcharts?.();
      setOpenCategoryIndex(null);
      setIsMobileMenuOpen(false);
      return;
    }
    if (tab === 'glossary') {
      onOpenGlossary();
      setOpenCategoryIndex(null);
      setIsMobileMenuOpen(false);
      return;
    }
    if (tab.startsWith('homework-')) {
      if (onSelectHomeworkSheet) {
        onSelectHomeworkSheet(tab);
      }
      setActiveTab('homework');
      setOpenCategoryIndex(null);
      setIsMobileMenuOpen(false);
      return;
    }
    setActiveTab(tab);
    setOpenCategoryIndex(null);
    setIsMobileMenuOpen(false);
  };

  // Filter navigation categories based on user role (Teacher Portal only visible to teachers)
  const visibleNavCategories = NAV_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => {
      if (item.id === 'teacher') {
        return currentUser?.role === 'teacher';
      }
      return true;
    })
  })).filter((cat) => cat.items.length > 0);

  // Find active category
  const activeCategory = visibleNavCategories.find((cat) =>
    cat.items.some((item) => item.id === activeTab)
  );  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all duration-300">
      {/* Top Banner with Stats & Profile */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-end gap-3">
        {/* Consolidated Header Controls */}
        <div className="flex items-center gap-2.5 shrink min-w-0 justify-end w-full">
          {/* Consolidated Student Stats Pill (XP, Streak, Badges) - Animated XP & Streak Indicators */}
          <div className="flex items-center gap-3 h-10 bg-amber-50/80 dark:bg-slate-900 border border-amber-300/70 dark:border-slate-800 px-4 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-sm hover:shadow transition-all duration-300 hover:border-amber-400/60 backdrop-blur-sm">
            <button 
              onClick={() => handleSelectTab('profile')}
              className="flex items-center gap-1.5 hover:opacity-100 transition-all cursor-pointer group text-amber-900 dark:text-amber-400 font-bold"
              title="View XP Progress"
            >
              <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
              <span className="font-mono tracking-tight">{userStats.totalXp} XP</span>
            </button>
            <span className="text-amber-300/50 dark:text-slate-700 font-light">|</span>
            <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 font-bold" title="Daily Learning Streak">
              <div className="relative">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500/10 animate-pulse" />
              </div>
              <span className="font-mono tracking-tight">{userStats.streakDays}d Streak</span>
            </div>
            <span className="text-amber-300/50 dark:text-slate-700 font-light">|</span>
            <button 
              onClick={() => handleSelectTab('profile')}
              className="flex items-center gap-1.5 hover:opacity-100 transition-all cursor-pointer group text-emerald-800 dark:text-emerald-400 font-bold"
              title="View Badges & Achievements"
            >
              <Trophy className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="font-mono tracking-tight">{userStats.unlockedBadges.length}/{INITIAL_BADGES.length} Badges</span>
            </button>
          </div>

          {/* Quick Action: GNH & EdTech */}
          <button
            onClick={() => handleSelectTab('gnhedtech')}
            className={`hidden sm:flex items-center gap-2 h-10 px-4 border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer font-bold text-xs ${
              activeTab === 'gnhedtech'
                ? 'bg-amber-500/10 text-amber-950 dark:text-amber-300 border-amber-500/30'
                : 'bg-slate-50 hover:bg-amber-50/50 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-amber-300/40 dark:hover:border-amber-500/30'
            }`}
            title="GNH & EdTech Value Quest"
          >
            <Landmark className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="hidden xl:inline">GNH Quest</span>
          </button>

          {/* Quick Action: ICT History Trivia */}
          <button
            onClick={() => handleSelectTab('bhutantrivia')}
            className={`hidden sm:flex items-center gap-2 h-10 px-4 border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer font-bold text-xs ${
              activeTab === 'bhutantrivia'
                ? 'bg-amber-500/10 text-amber-950 dark:text-amber-300 border-amber-500/30'
                : 'bg-slate-50 hover:bg-amber-50/50 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-amber-300/40 dark:hover:border-amber-500/30'
            }`}
            title="Bhutan Tech History & Trivia Quiz"
          >
            <History className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="hidden xl:inline">Trivia</span>
          </button>

          {/* Quick Action: Live Study Room */}
          {onOpenStudyRoom && (
            <button
              onClick={onOpenStudyRoom}
              className="hidden sm:flex items-center gap-2 h-10 px-4 bg-emerald-50 hover:bg-emerald-100/85 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700/60 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer font-bold text-xs"
              title="Open Class 10 Virtual Study Room"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="hidden xl:inline">Study Room</span>
            </button>
          )}



          {/* System Utilities Group (Online, Language, Theme, Logout) */}
          <div className="hidden sm:flex items-center gap-1.5">
            {/* Network Indicator Dot */}
            <div 
              className={`h-10 px-3.5 rounded-xl border font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                isOnline 
                  ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300' 
                  : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/50 animate-pulse'
              }`}
              title={isOnline ? 'Online Sync Active' : 'Offline Mode Active (Cached)'}
            >
              {isOnline ? (
                <>
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="hidden lg:inline text-xs font-bold text-slate-600 dark:text-slate-400">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-rose-500 shrink-0 animate-bounce" />
                  <span className="text-xs font-bold">Offline</span>
                </>
              )}
            </div>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 font-bold text-xs shrink-0"
              title={t.switchLanguage}
            >
              <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-xs font-bold">
                {language === 'en' ? 'EN' : 'རྫོང་ཁ།'}
              </span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-amber-500" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-indigo-950 fill-indigo-900/10" />
              )}
            </button>

            {currentUser && onLogout ? (
              <div className="relative shrink-0" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="h-10 px-3 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all font-bold text-xs"
                  title="Open profile menu"
                >
                  <div className="w-5.5 h-5.5 rounded-full border border-emerald-500 overflow-hidden bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold uppercase shrink-0 shadow-inner">
                    {currentUser.profilePhotoDataUrl ? (
                      <img src={currentUser.profilePhotoDataUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      getNameInitials(currentUser.name)
                    )}
                  </div>
                  <span className="truncate max-w-[80px]">{currentUser.studentId}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-500 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenProfileSettings?.();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-4 h-4 text-[#6D071A] dark:text-amber-400" /> Profile Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="h-10 px-3.5 flex items-center gap-2 rounded-xl border border-amber-300/60 dark:border-amber-500/40 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all font-bold text-xs shrink-0"
                title="Student Login / Save Progress"
              >
                <KeyRound className="w-4 h-4 shrink-0" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden h-10 w-10 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-700 dark:text-slate-300 font-bold cursor-pointer active:scale-95 transition-transform flex items-center justify-center shrink-0"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Bar with Category Sub-menus */}
      <div className="bg-[#5C0614] border-t border-amber-500/25 px-2 sm:px-4 py-2 shadow-xl relative z-40" ref={navRef}>
        {/* Responsive Category Navigation (Flex-wrap centered so submenus pop out without clipping) */}
        <nav className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-7xl mx-auto py-1 px-1 relative">
          {visibleNavCategories.map((cat, idx) => {
            const isCategoryActive = cat.items.some((item) => item.id === activeTab);
            const isOpen = openCategoryIndex === idx;

            return (
              <div key={cat.title} className="relative shrink-0">
                <button
                  onClick={() => setOpenCategoryIndex(isOpen ? null : idx)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border whitespace-nowrap ${
                    isCategoryActive
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-transparent shadow-[0_2px_10px_rgba(245,158,11,0.25)]'
                      : isOpen
                      ? 'bg-white/20 text-white border-white/30 shadow-md'
                      : 'bg-transparent text-amber-100/90 hover:text-white hover:bg-white/10 border-transparent'
                  }`}
                >
                  <span className={`${isCategoryActive ? 'text-slate-950' : 'text-amber-400'}`}>
                    {cat.icon}
                  </span>
                  <span>{cat.title}</span>

                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-75 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Submenu Dropdown Panel */}
                {isOpen && (
                  <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-[999] animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>{cat.title} Menu</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[9px]">{cat.items.length} options</span>
                    </div>

                    <div className="space-y-1 mt-1.5 max-h-72 overflow-y-auto">
                      {cat.items.map((item) => {
                        const isSelected = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              handleSelectTab(item.id);
                              setOpenCategoryIndex(null);
                            }}
                            className={`w-full text-left p-2 rounded-xl border transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500/30 font-bold text-amber-950 dark:text-amber-300'
                                : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 border-transparent text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shrink-0 mt-0.5">
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold truncate">{item.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />}
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Accordion Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden space-y-2.5 py-3 animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Mobile System Utilities */}
            <div className="flex sm:hidden items-center justify-between bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-md mb-3.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{isOnline ? 'Online Sync' : 'Offline Mode'}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenProfileSettings?.();
                    }}
                    className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 font-bold text-[10px]"
                  >
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    Profile
                  </button>
                )}
                <button
                  onClick={toggleLanguage}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 font-bold text-[10px]"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-500" />
                  {language === 'en' ? 'EN' : 'DZ'}
                </button>
                <button
                  onClick={onToggleTheme}
                  className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-900" />}
                </button>
                {currentUser && onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="h-8 w-8 rounded-lg border border-rose-200 dark:border-rose-950/40 bg-rose-50 dark:bg-rose-950/20 text-rose-700 flex items-center justify-center"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {visibleNavCategories.map((cat, idx) => {
              const isCategoryActive = cat.items.some((item) => item.id === activeTab);
              const isOpen = openCategoryIndex === idx;

              return (
                <div key={cat.title} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenCategoryIndex(isOpen ? null : idx)}
                    className={`w-full flex items-center justify-between p-3.5 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors ${
                      isCategoryActive 
                        ? 'bg-amber-400 text-slate-950' 
                        : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`${isCategoryActive ? 'text-slate-950' : 'text-amber-500'}`}>
                        {cat.icon}
                      </span>
                      <span>{cat.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      {cat.items.map((item) => {
                        const isSelected = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectTab(item.id)}
                            className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500/30 font-bold text-amber-950 dark:text-amber-300'
                                : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-amber-500">{item.icon}</span>
                              <span className="text-xs font-bold">{item.label}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

