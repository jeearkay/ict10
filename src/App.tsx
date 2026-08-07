import React, { useState, useEffect } from 'react';
import { ActiveTab, QuestModule, QuestLevel, UserStats } from './types';
import { SYLLABUS_MODULES, INITIAL_BADGES } from './data/syllabus';
import { 
  initContentSyncListeners, 
  getStudentSyllabusModules, 
  useContentRefresh 
} from './lib/contentManager';
import { getInitialUserStats, saveUserStats, profileToUserStats, createDefaultStats } from './lib/storage';
import { 
  assertProfileCanAccess,
  getLocalAuthSession,
  subscribeToStudentProfile, 
  syncStudentProfile, 
  StudentProfile,
  logoutStudent
} from './lib/firebase';
import { QuestMap } from './components/QuestMap';
import { GunaTutorChat } from './components/GunaTutorChat';
import { PythonIDE } from './components/PythonIDE';
import { ExcelSimulator } from './components/ExcelSimulator';
import { CurriculumHandbook } from './components/CurriculumHandbook';
import { ProfileModal } from './components/ProfileModal';
import { PythonVisualizer } from './components/PythonVisualizer';
import { PythonReference } from './components/PythonReference';
import { ExamPrepSuite } from './components/ExamPrepSuite';
import { TeacherPortal } from './components/TeacherPortal';
import { ClassLeaderboard } from './components/ClassLeaderboard';
import { BhutanTechTrivia } from './components/BhutanTechTrivia';
import { AuthModal } from './components/AuthModal';
import { CelebrationModal } from './components/CelebrationModal';
import { StudyRoomModal } from './components/StudyRoomModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ICTGlossaryModal } from './components/ICTGlossaryModal';
import { FlowchartBuilderModal } from './components/FlowchartBuilderModal';
import { GnhEdTechGame } from './components/GnhEdTechGame';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer, ToastMessage } from './components/Toast';
import { HomeworkPortal } from './components/HomeworkPortal';
import { QuestChallengeModal } from './components/QuestChallengeModal';
import { ChallengeSpeedrunBanner } from './components/ChallengeSpeedrunBanner';
import { TopBanner } from './components/TopBanner';
import { Header } from './components/Header';
import { QuestChallenge } from './types';
import { subscribeToAllStudents, updateQuestChallenge } from './lib/firebase';
import { WifiOff, CheckCircle2, Bell, X, Search } from 'lucide-react';
import { 
  recordUserActivity, 
  checkInactivityStatus, 
  checkAndTrigger48hReminder 
} from './lib/notifications';
import { QuestCardSkeleton } from './components/Skeleton';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';

const VALID_TABS: string[] = [
  'map',
  'tutor',
  'python',
  'pythonref',
  'pythonvisualizer',
  'excel',
  'flowcharts',
  'examprep',
  'curriculum',
  'teacher',
  'profile',
  'leaderboard',
  'bhutantrivia',
  'gnhedtech',
  'glossary',
  'homework',
  'homework-cloud',
  'homework-workspace',
  'homework-copyright',
  'homework-python-basics',
  'homework-operators',
  'homework-strings',
  'homework-conditionals',
  'homework-nested',
  'homework-loops',
  'homework-collections',
  'homework-functions'
];

function getInitialTabFromUrlOrStorage(): ActiveTab {
  try {
    const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
    const cleanHash = hash.split('?')[0].split('/')[0];
    if (cleanHash && VALID_TABS.includes(cleanHash)) {
      if (cleanHash.startsWith('homework-')) {
        return 'homework';
      }
      return cleanHash as ActiveTab;
    }
    const saved = localStorage.getItem('guna_ict_active_tab') as ActiveTab;
    if (saved && (VALID_TABS.includes(saved) || saved.startsWith('homework-'))) {
      if (saved.startsWith('homework-')) {
        return 'homework';
      }
      return saved as ActiveTab;
    }
  } catch (e) {
    console.warn('Error reading initial tab:', e);
  }
  return 'map';
}

function getInitialHomeworkSheetFromUrlOrStorage(): string {
  try {
    const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
    const cleanHash = hash.split('?')[0].split('/')[0];
    if (cleanHash && cleanHash.startsWith('homework-')) {
      return cleanHash;
    }
    const savedSheet = localStorage.getItem('guna_ict_selected_homework_sheet');
    if (savedSheet) {
      return savedSheet;
    }
  } catch (e) {
    console.warn('Error reading initial homework sheet:', e);
  }
  return 'homework-cloud';
}

export default function App() {
  const contentVersion = useContentRefresh();

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => getInitialTabFromUrlOrStorage());
  const [selectedHomeworkSheetId, setSelectedHomeworkSheetId] = useState<string>(() => getInitialHomeworkSheetFromUrlOrStorage());
  const [userStats, setUserStats] = useState<UserStats>(() => getInitialUserStats());

  // Firebase User State
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isStudyRoomOpen, setIsStudyRoomOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isFlowchartOpen, setIsFlowchartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Quest Challenge & Speedrun State
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [challengeOpponent, setChallengeOpponent] = useState<StudentProfile | null>(null);
  const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);
  const [activeSpeedrunChallenge, setActiveSpeedrunChallenge] = useState<QuestChallenge | null>(null);
  const [speedrunElapsedSeconds, setSpeedrunElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    const unsubStudents = subscribeToAllStudents((list) => {
      setAllStudents(list);
    });
    return () => unsubStudents();
  }, []);

  // Timer interval for active speedrun challenge
  useEffect(() => {
    if (!activeSpeedrunChallenge) return;
    const interval = setInterval(() => {
      setSpeedrunElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSpeedrunChallenge]);

  const handleStartSpeedrun = (challenge: QuestChallenge) => {
    setActiveSpeedrunChallenge(challenge);
    setSpeedrunElapsedSeconds(0);
    if (challenge.targetType === 'python_lab') {
      setActiveTab('python');
    } else {
      setActiveTab('tutor');
    }
  };

  const handleFinishSpeedrun = async (completedScore: number = 100) => {
    if (!activeSpeedrunChallenge) return;

    const timeInSec = speedrunElapsedSeconds;
    const myUid = currentUser?.uid || 'current-local-user';
    const myName = currentUser?.name || userStats.studentName;
    const isChallenger = activeSpeedrunChallenge.challengerUid === myUid ||
                         activeSpeedrunChallenge.challengerName === myName;

    let updates: Partial<QuestChallenge> = {};

    if (isChallenger) {
      updates = {
        challengerTimeSeconds: timeInSec,
        challengerScore: completedScore,
      };
      if (activeSpeedrunChallenge.opponentTimeSeconds) {
        updates.status = 'completed';
        const opponentTime = activeSpeedrunChallenge.opponentTimeSeconds;
        if (timeInSec <= opponentTime) {
          updates.winnerUid = myUid;
          updates.winnerName = myName;
        } else {
          updates.winnerUid = activeSpeedrunChallenge.opponentUid;
          updates.winnerName = activeSpeedrunChallenge.opponentName;
        }
      }
    } else {
      updates = {
        opponentTimeSeconds: timeInSec,
        opponentScore: completedScore,
      };
      if (activeSpeedrunChallenge.challengerTimeSeconds) {
        updates.status = 'completed';
        const challengerTime = activeSpeedrunChallenge.challengerTimeSeconds;
        if (timeInSec <= challengerTime) {
          updates.winnerUid = myUid;
          updates.winnerName = myName;
        } else {
          updates.winnerUid = activeSpeedrunChallenge.challengerUid;
          updates.winnerName = activeSpeedrunChallenge.challengerName;
        }
      }
    }

    await updateQuestChallenge(activeSpeedrunChallenge.id, updates);

    const isWinner = updates.winnerUid === myUid || (updates.status === 'completed' && updates.winnerName === myName);
    const bonusXp = isWinner ? 50 : 20;

    setUserStats((prev) => {
      const newXp = prev.totalXp + bonusXp;
      const updated = {
        ...prev,
        totalXp: newXp,
        level: Math.floor(newXp / 100) + 1,
      };
      saveUserStats(updated);
      if (currentUser) {
        syncStudentProfile(currentUser.uid, { xp: newXp }).catch(() => {});
      }
      return updated;
    });

    setCelebrationState({
      isOpen: true,
      title: isWinner ? '🏆 SPEEDRUN CHAMPION!' : '⚡ SPEEDRUN COMPLETED!',
      subtitle: isWinner
        ? `You completed the challenge in ${Math.floor(timeInSec / 60)}m ${timeInSec % 60}s and beat your classmate!`
        : `Completed in ${Math.floor(timeInSec / 60)}m ${timeInSec % 60}s! Excellent speed!`,
      xpAwarded: bonusXp,
      badgeName: isWinner ? 'Speedrun Champion' : 'Speed Demon',
      badgeIcon: '⚡'
    });

    setActiveSpeedrunChallenge(null);
  };

  // Theme State (Bhutanese Paper vs Late-Night Dark Mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('guna_ict_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('guna_ict_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    await logoutStudent();
    setCurrentUser(null);
    setUserStats(createDefaultStats());
    setIsProfileSettingsOpen(false);
  };

  const handleProfileUpdated = (updates: Partial<StudentProfile>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : prev));
    setUserStats((prev) => ({
      ...prev,
      studentName: updates.name || prev.studentName,
      classSection: updates.classSection || prev.classSection,
      schoolName: updates.school || prev.schoolName
    }));
  };

  // Sync activeTab to URL hash & localStorage
  useEffect(() => {
    try {
      const targetHash = activeTab === 'homework' && selectedHomeworkSheetId ? selectedHomeworkSheetId : activeTab;
      localStorage.setItem('guna_ict_active_tab', activeTab);
      const currentHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      if (currentHash !== targetHash) {
        window.history.replaceState(null, '', `#${targetHash}`);
      }
    } catch (e) {
      console.warn('Error syncing activeTab to hash:', e);
    }
  }, [activeTab, selectedHomeworkSheetId]);

  // Sync selectedHomeworkSheetId to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guna_ict_selected_homework_sheet', selectedHomeworkSheetId);
    } catch (e) {
      console.warn('Error saving homework sheet:', e);
    }
  }, [selectedHomeworkSheetId]);

  // Listen for browser navigation (back/forward or URL hash change)
  useEffect(() => {
    const handleHashChange = () => {
      const tabFromUrl = getInitialTabFromUrlOrStorage();
      if (tabFromUrl) {
        setActiveTab(tabFromUrl);
      }
      const sheetFromUrl = getInitialHomeworkSheetFromUrlOrStorage();
      if (sheetFromUrl) {
        setSelectedHomeworkSheetId(sheetFromUrl);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Active module and level state with persistence
  const [selectedModule, setSelectedModule] = useState<QuestModule>(() => {
    const merged = getStudentSyllabusModules();
    try {
      const savedModId = localStorage.getItem('guna_ict_selected_module_id');
      if (savedModId) {
        const found = merged.find((m) => m.id === savedModId);
        if (found) return found;
      }
    } catch (e) {}
    return merged[0] || SYLLABUS_MODULES[0];
  });

  const [selectedLevel, setSelectedLevel] = useState<QuestLevel>(() => {
    const merged = getStudentSyllabusModules();
    try {
      const savedModId = localStorage.getItem('guna_ict_selected_module_id');
      const savedLvlId = localStorage.getItem('guna_ict_selected_level_id');
      const mod = (savedModId && merged.find((m) => m.id === savedModId)) || merged[0] || SYLLABUS_MODULES[0];
      if (savedLvlId && mod) {
        const lvl = mod.levels.find((l) => l.id === savedLvlId);
        if (lvl) return lvl;
      }
      return mod?.levels[0] || SYLLABUS_MODULES[0].levels[0];
    } catch (e) {}
    return merged[0]?.levels[0] || SYLLABUS_MODULES[0].levels[0];
  });

  // Save selectedModule and selectedLevel when changed
  useEffect(() => {
    try {
      if (selectedModule?.id) {
        localStorage.setItem('guna_ict_selected_module_id', selectedModule.id);
      }
      if (selectedLevel?.id) {
        localStorage.setItem('guna_ict_selected_level_id', selectedLevel.id);
      }
    } catch (e) {}
  }, [selectedModule?.id, selectedLevel?.id]);

  const [activeIdeCode, setActiveIdeCode] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Subscribe to content updates and synchronize active selection with merged list
  useEffect(() => {
    const merged = getStudentSyllabusModules();
    const matchingMod = merged.find(m => m.id === selectedModule.id) || merged[0];
    if (matchingMod) {
      setSelectedModule(matchingMod);
      const matchingLvl = matchingMod.levels.find(l => l.id === selectedLevel.id) || matchingMod.levels[0];
      if (matchingLvl) {
        setSelectedLevel(matchingLvl);
      }
    }
  }, [contentVersion]);

  // 48-Hour Inactivity Notification & Banner State
  const [inactivityBanner, setInactivityBanner] = useState<{ isVisible: boolean; hours: number }>({
    isVisible: false,
    hours: 0,
  });

  // Check 48h inactivity & trigger browser notification & init CMS listeners on mount
  useEffect(() => {
    initContentSyncListeners();
    const status = checkInactivityStatus(48);
    if (status.isInactive) {
      setInactivityBanner({ isVisible: true, hours: status.inactiveHours });
      checkAndTrigger48hReminder(48);
    }
    // Update active timestamp as student has now returned
    recordUserActivity();
  }, []);

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

  // Restore session from local storage
  useEffect(() => {
    const localSession = getLocalAuthSession();
    if (localSession) {
      try {
        const approvedProfile = assertProfileCanAccess(localSession);
        setCurrentUser(approvedProfile);
        setUserStats(profileToUserStats(approvedProfile));
      } catch (error) {
        setCurrentUser(null);
        setUserStats(createDefaultStats());
        logoutStudent().catch(console.error);
      }
    } else {
      setCurrentUser(null);
      setUserStats(createDefaultStats());
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribeProfile = subscribeToStudentProfile(currentUser.uid, (profile) => {
      if (!profile) return;
      try {
        const approvedProfile = assertProfileCanAccess(profile);
        setCurrentUser(approvedProfile);
        setUserStats(profileToUserStats(approvedProfile));
      } catch (error) {
        setCurrentUser(null);
        setUserStats(createDefaultStats());
        logoutStudent().catch(console.error);
      }
    });

    return () => unsubscribeProfile();
  }, [currentUser?.uid]);

  // Persist userStats whenever changed, and sync to Firestore if logged in
  useEffect(() => {
    saveUserStats(userStats, currentUser?.uid);
    if (currentUser?.uid && !currentUser.uid.startsWith('local_')) {
      const xpDiff = userStats.totalXp !== currentUser.xp;
      const streakDiff = userStats.streakDays !== currentUser.streakDays;
      const nameDiff = userStats.studentName !== currentUser.name;
      const schoolDiff = userStats.schoolName !== currentUser.school;
      const classDiff = userStats.classSection !== currentUser.classSection;
      
      const remoteBadges = currentUser.unlockedBadges || [];
      const badgesDiff = userStats.unlockedBadges.length !== remoteBadges.length ||
        !userStats.unlockedBadges.every(b => remoteBadges.includes(b));
        
      const remoteCompleted = currentUser.completedLevels || [];
      const completedDiff = userStats.completedLevels.length !== remoteCompleted.length ||
        !userStats.completedLevels.every(lvl => remoteCompleted.includes(lvl));

      if (xpDiff || streakDiff || nameDiff || schoolDiff || classDiff || badgesDiff || completedDiff) {
        syncStudentProfile(currentUser.uid, {
          xp: userStats.totalXp,
          streakDays: userStats.streakDays,
          unlockedBadges: userStats.unlockedBadges,
          completedLevels: userStats.completedLevels,
          completedLevelsCount: userStats.completedLevels.length,
          name: userStats.studentName,
          school: userStats.schoolName,
          classSection: userStats.classSection
        }).catch(console.error);
      }
    }
  }, [userStats, currentUser]);

  const handleSelectLevel = (mod: QuestModule, lvl: QuestLevel) => {
    setSelectedModule(mod);
    setSelectedLevel(lvl);
    setActiveTab('tutor');
  };

  // Celebration Modal State
  const [celebrationState, setCelebrationState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    badgeName?: string;
    badgeIcon?: string;
    xpAwarded?: number;
  }>({
    isOpen: false,
    title: '',
    subtitle: ''
  });

  const handleRewardXp = (amount: number, levelId: string) => {
    setUserStats((prev) => {
      const isNewCompletion = !prev.completedLevels.includes(levelId);
      const newCompleted = isNewCompletion ? [...prev.completedLevels, levelId] : prev.completedLevels;
      // Retrying a completed quest awards 0 XP (as requested by user)
      const addedXp = isNewCompletion ? amount : 0;
      const newXp = prev.totalXp + addedXp;

      // Check badge unlocks
      const newBadges = [...prev.unlockedBadges];
      const newUnlockDates = { ...(prev.badgeUnlockDates || {}) };
      let newlyUnlockedBadgeName = '';
      let newlyUnlockedBadgeIcon = '';

      const checkUnlock = (badgeId: string, badgeName: string, icon: string) => {
        if (!newBadges.includes(badgeId)) {
          newBadges.push(badgeId);
          newlyUnlockedBadgeName = badgeName;
          newlyUnlockedBadgeIcon = icon;
          newUnlockDates[badgeId] = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        }
      };

      if (levelId.startsWith('cloud')) {
        checkUnlock('badge-paro-cloud', 'Paro Cloud Architect', '☁️');
      }
      if (levelId.startsWith('workspace')) {
        checkUnlock('badge-workspace-hero', 'Thimphu Workspace Hero', '📁');
      }
      if (levelId.startsWith('website') || levelId.startsWith('citation') || levelId.startsWith('academic') || levelId.startsWith('copyright')) {
        checkUnlock('badge-copyright-sentinel', 'Bhutan Digital Citizen', '⚖️');
      }
      if (levelId.startsWith('excel')) {
        checkUnlock('badge-excel-grandmaster', 'Centenary Excel Master', '📊');
      }
      if (levelId.startsWith('python-intro')) {
        checkUnlock('badge-python-coder', 'Karma Academy Coder', '🐍');
      }
      if (levelId.startsWith('python-variables') || levelId.startsWith('python-conditionals') || levelId.startsWith('python-loops') || levelId.startsWith('python-while')) {
        checkUnlock('badge-logic-guru', 'Taktsang Logic Guru', '⚡');
      }
      if (levelId.startsWith('python-list') || levelId.startsWith('python-dict') || levelId.startsWith('python-set') || levelId.startsWith('python-tuple')) {
        checkUnlock('badge-collections-king', 'Pachu Collection King', '📦');
      }
      if (levelId.startsWith('python-user') || levelId.startsWith('python-scope') || levelId.startsWith('python-recursive')) {
        checkUnlock('badge-recursion-legend', 'Himalayan Recursion Legend', '🔁');
      }

      // Trigger Celebration Modal if new XP awarded or badge unlocked
      if (addedXp > 0 || newlyUnlockedBadgeName) {
        setTimeout(() => {
          setCelebrationState({
            isOpen: true,
            title: newlyUnlockedBadgeName ? `Badge Unlocked: ${newlyUnlockedBadgeName}!` : `Quest Level Completed!`,
            subtitle: newlyUnlockedBadgeName 
              ? `Tashi Delek! You earned a official Class 10 Bhutan ICT Badge!` 
              : `Great job! You gained +${addedXp} XP towards your BCSEA National Mastery.`,
            badgeName: newlyUnlockedBadgeName || undefined,
            badgeIcon: newlyUnlockedBadgeIcon || '🌟',
            xpAwarded: addedXp
          });
        }, 200);
      }

      return {
        ...prev,
        totalXp: newXp,
        completedLevels: newCompleted,
        unlockedBadges: newBadges,
        badgeUnlockDates: newUnlockDates,
      };
    });
  };

  const handleDeductXp = (amount: number) => {
    setUserStats((prev) => ({
      ...prev,
      totalXp: Math.max(0, prev.totalXp - amount),
    }));
  };

  const handleUpdateNotes = (chapterId: string, noteText: string) => {
    setUserStats((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [chapterId]: noteText,
      },
    }));
  };

  const handleUpdateStats = (newFields: Partial<UserStats>) => {
    setUserStats((prev) => ({ ...prev, ...newFields }));
  };

  const handleUnlockBadge = (badgeId: string) => {
    setUserStats((prev) => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;
      
      const badge = INITIAL_BADGES.find(b => b.id === badgeId);
      if (badge) {
        setTimeout(() => {
          setCelebrationState({
            isOpen: true,
            title: `Badge Unlocked: ${badge.name}!`,
            subtitle: `Tashi Delek! You earned an official Class 10 Bhutan ICT Badge!`,
            badgeName: badge.name,
            badgeIcon: badge.icon || '🌟',
            xpAwarded: 0
          });
        }, 200);
      }

      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId],
        badgeUnlockDates: {
          ...prev.badgeUnlockDates,
          [badgeId]: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        }
      };
    });
  };

  // Find next/prev level in sequence
  const allLevelsWithModules = React.useMemo(() => {
    const levels: { module: QuestModule; level: QuestLevel }[] = [];
    getStudentSyllabusModules().forEach((m) => {
      m.levels.forEach((l) => {
        levels.push({ module: m, level: l });
      });
    });
    return levels;
  }, [contentVersion]);

  const currentIndex = React.useMemo(() => {
    return allLevelsWithModules.findIndex(
      (item) => item.level.id === selectedLevel.id
    );
  }, [allLevelsWithModules, selectedLevel.id]);

  const handleNextLevel = () => {
    if (currentIndex >= 0 && currentIndex < allLevelsWithModules.length - 1) {
      const next = allLevelsWithModules[currentIndex + 1];
      setSelectedModule(next.module);
      setSelectedLevel(next.level);
    }
  };

  const handlePrevLevel = () => {
    if (currentIndex > 0) {
      const prev = allLevelsWithModules[currentIndex - 1];
      setSelectedModule(prev.module);
      setSelectedLevel(prev.level);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center p-6 space-y-6 max-w-xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-block p-3 bg-[#FFCC33] border-2 border-[#1A1A1A] rounded-2xl shadow-[3px_3px_0px_0px_#1A1A1A] mb-2 animate-bounce">
            🐉
          </div>
          <h2 className="text-xl font-black font-serif text-[#1A1A1A]">Loading Guna: Class 10 ICT Quest...</h2>
          <p className="text-xs font-semibold text-gray-600">Preparing Bhutanese curriculum syllabus and student profile session...</p>
        </div>
        <div className="w-full space-y-4">
          <QuestCardSkeleton />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#6D071A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Paro Taktsang Aesthetic Background Image */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}hero-paro.png')` }}
        />
        <div className="relative z-10 w-full max-w-md">
          <AuthModal
            isOpen={true}
            onClose={() => {}}
            currentUser={null}
            isMandatory={true}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setUserStats(profileToUserStats(user));
            }}
            onLogout={handleLogout}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col overflow-x-hidden transition-colors duration-350">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Top Banner */}
      <TopBanner />

      {/* Header with Stats, Navigation, and Controls */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userStats={userStats}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenFlowcharts={() => setIsFlowchartOpen(true)}
        onOpenStudyRoom={() => setIsStudyRoomOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenProfileSettings={() => setIsProfileSettingsOpen(true)}
        onLogout={() => {
          logoutStudent();
          setCurrentUser(null);
        }}
        onToggleTheme={toggleTheme}
        theme={theme}
      />

      {/* Global Search Bar (Separated below navigation bar with premium tactile design) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 pb-3 w-full">
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label="Open global search"
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-amber-400 dark:hover:border-amber-500 px-4 py-3 rounded-2xl shadow-sm hover:shadow transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer group"
        >
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-amber-100 transition-colors min-w-0">
            <Search className="w-4.5 h-4.5 text-amber-500 shrink-0 group-hover:scale-105 transition-transform" />
            <span className="text-xs sm:text-sm font-semibold text-left truncate leading-tight">
              Search Class 10 ICT syllabus, Python code snippets, Cloud services, and exam topics...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[10px] font-bold text-slate-600 dark:text-amber-300">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Offline Mode Alert Banner for Remote Bhutanese Schools */}
      {!isOnline && (
        <div className="bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 border-b border-amber-500/20 px-4 py-2 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <WifiOff className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> You are currently disconnected. All Class 10 ICT Quest syllabus maps, Python IDE labs, Excel simulators, and curriculum handbooks are fully accessible offline!
            </span>
          </div>
        </div>
      )}

      {/* 48-Hour Inactivity Returning Student Alert Banner */}
      {inactivityBanner.isVisible && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 text-xs font-semibold">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />
              <span className="text-slate-700 dark:text-slate-300">
                <strong>🇧🇹 Welcome back!</strong> You haven't engaged in a quest for <strong>{inactivityBanner.hours} hours</strong>. Check your Virtual Study Room or continue your pending quest to keep your streak!
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setIsStudyRoomOpen(true);
                  setInactivityBanner({ isVisible: false, hours: 0 });
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Open Study Room
              </button>
              <button
                onClick={() => {
                  setActiveTab('map');
                  setInactivityBanner({ isVisible: false, hours: 0 });
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Resume Quest
              </button>
              <button
                onClick={() => setInactivityBanner({ isVisible: false, hours: 0 })}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded cursor-pointer transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Challenge Speedrun Banner */}
      {activeSpeedrunChallenge && (
        <ChallengeSpeedrunBanner
          challenge={activeSpeedrunChallenge}
          elapsedSeconds={speedrunElapsedSeconds}
          onFinishSpeedrun={(score) => handleFinishSpeedrun(score)}
          onCancelSpeedrun={() => setActiveSpeedrunChallenge(null)}
        />
      )}

      {/* Main Tab Views */}

      <main id="main-content" className="flex-1 pb-20 sm:pb-12 w-full min-w-0 overflow-x-hidden" tabIndex={-1}>
        {activeTab === 'map' && (
          <QuestMap userStats={userStats} onSelectLevel={handleSelectLevel} />
        )}

        {activeTab === 'tutor' && (
          <GunaTutorChat
            currentModule={selectedModule}
            currentLevel={selectedLevel}
            userStats={userStats}
            onRewardXp={handleRewardXp}
            onDeductXp={handleDeductXp}
            onSelectNextLevel={currentIndex < allLevelsWithModules.length - 1 ? handleNextLevel : undefined}
            onSelectPrevLevel={currentIndex > 0 ? handlePrevLevel : undefined}
            onOpenIdeWithCode={(codeSnippet) => {
              setActiveIdeCode(codeSnippet);
              setActiveTab('python');
            }}
          />
        )}

        {activeTab === 'python' && (
          <PythonIDE
            initialCode={activeIdeCode}
            onSendToTutor={(codeSnippet) => {
              setActiveTab('tutor');
            }}
          />
        )}

        {activeTab === 'pythonref' && (
          <PythonReference
            onCopyToIde={(snippet) => {
              setActiveIdeCode(snippet);
              setActiveTab('python');
            }}
          />
        )}

        {activeTab === 'excel' && <ExcelSimulator />}

        {activeTab === 'pythonvisualizer' && <PythonVisualizer />}

        {activeTab === 'examprep' && <ExamPrepSuite onRewardXp={handleRewardXp} />}

        {activeTab === 'bhutantrivia' && (
          <BhutanTechTrivia onAddXp={(amount) => handleRewardXp(amount, 'bhutantrivia')} />
        )}

        {activeTab === 'gnhedtech' && (
          <GnhEdTechGame
            userStats={userStats}
            onAwardXp={(amount, reason) => handleRewardXp(amount, 'gnhedtech')}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumHandbook userStats={userStats} onUpdateNotes={handleUpdateNotes} />
        )}

        {activeTab === 'teacher' && (
          <TeacherPortal 
            userStats={userStats} 
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'leaderboard' && (
          <ClassLeaderboard
            userStats={userStats}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenChallengeModal={(opponent) => {
              setChallengeOpponent(opponent || null);
              setIsChallengeModalOpen(true);
            }}
            onAcceptChallenge={(challenge) => {
              handleStartSpeedrun(challenge);
            }}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileModal userStats={userStats} onUpdateStats={handleUpdateStats} />
        )}

        {activeTab === 'homework' && (
          <HomeworkPortal
            userStats={userStats}
            onRewardXp={handleRewardXp}
            selectedSheetId={selectedHomeworkSheetId}
            onSelectSheet={(sheetId) => setSelectedHomeworkSheetId(sheetId)}
          />
        )}
      </main>

      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md px-4 py-4 mb-16 sm:mb-0 text-center" role="contentinfo" aria-label="Site footer">
        <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-[0.04em]">
          Copyright (c) Guna Raj Kuikel - {new Date().getFullYear()} | Version 1
        </p>
      </footer>

      {/* Firebase Cloud Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setUserStats(profileToUserStats(user));
          if (user.role === 'teacher') {
            setActiveTab('teacher');
          }
        }}
        onLogout={handleLogout}
      />

      <ProfileSettingsModal
        isOpen={isProfileSettingsOpen}
        currentUser={currentUser}
        onClose={() => setIsProfileSettingsOpen(false)}
        onProfileUpdated={handleProfileUpdated}
        onLogout={handleLogout}
      />

      {/* Celebration & Badge Unlock Modal */}
      <CelebrationModal
        isOpen={celebrationState.isOpen}
        onClose={() => setCelebrationState((prev) => ({ ...prev, isOpen: false }))}
        title={celebrationState.title}
        subtitle={celebrationState.subtitle}
        badgeName={celebrationState.badgeName}
        badgeIcon={celebrationState.badgeIcon}
        xpAwarded={celebrationState.xpAwarded}
      />

      {/* Virtual Study Room & Online Peer Cheers Modal */}
      <StudyRoomModal
        isOpen={isStudyRoomOpen}
        onClose={() => setIsStudyRoomOpen(false)}
        userStats={userStats}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* ICT Glossary Modal */}
      <ICTGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Quest Challenge Creation & Speedrun Launcher Modal */}
      <QuestChallengeModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        currentUser={currentUser}
        studentName={userStats.studentName}
        allStudents={allStudents}
        preselectedOpponent={challengeOpponent}
        onStartSpeedrunNow={(challenge) => {
          handleStartSpeedrun(challenge);
        }}
      />

      {/* Class 10 Algorithm Flowchart Builder Modal */}
      <FlowchartBuilderModal
        isOpen={isFlowchartOpen}
        onClose={() => setIsFlowchartOpen(false)}
        onOpenInIde={(codeSnippet) => {
          setActiveIdeCode(codeSnippet);
          setActiveTab('python');
          addToast({
            type: 'success',
            title: '⚡ Code Exported to Python IDE',
            description: 'Flowchart algorithm logic loaded into Python IDE!'
          });
        }}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenFlowcharts={() => setIsFlowchartOpen(true)}
      />

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
