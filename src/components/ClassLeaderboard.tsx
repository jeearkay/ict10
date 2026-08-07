import React, { useState, useEffect } from 'react';
import { 
  Trophy, Flame, Sparkles, Medal, Award, Search, Users, 
  Crown, ArrowUpRight, CheckCircle2, ShieldCheck, Zap, KeyRound,
  Swords, Clock, Play, Plus, RefreshCw, UserCheck
} from 'lucide-react';
import { UserStats, QuestChallenge } from '../types';
import { StudentProfile, subscribeToAllStudents, subscribeToQuestChallenges, INITIAL_QUEST_CHALLENGES } from '../lib/firebase';

interface ClassLeaderboardProps {
  userStats: UserStats;
  currentUser: StudentProfile | null;
  onOpenAuthModal: () => void;
  onNavigateTab: (tab: any) => void;
  onOpenChallengeModal?: (opponent?: StudentProfile | null) => void;
  onAcceptChallenge?: (challenge: QuestChallenge) => void;
}

const DEFAULT_BHUTAN_STUDENTS: StudentProfile[] = [
  {
    uid: 'mock-1',
    studentId: 'tashi.10a',
    name: 'Tashi Dorji',
    email: 'tashi.10a@karma.edu.bt',
    classSection: '10-A',
    school: 'Karma Academy',
    role: 'student',
    xp: 920,
    streakDays: 14,
    completedLevelsCount: 9,
    lastActive: '2026-07-25',
    unlockedBadges: ['welcome_badge', 'python_basics', 'excel_pro', 'top_scholar']
  },
  {
    uid: 'mock-2',
    studentId: 'sonam.10a',
    name: 'Sonam Wangmo',
    email: 'sonam.10a@karma.edu.bt',
    classSection: '10-A',
    school: 'Karma Academy',
    role: 'student',
    xp: 850,
    streakDays: 11,
    completedLevelsCount: 8,
    lastActive: '2026-07-25',
    unlockedBadges: ['welcome_badge', 'python_basics', 'flowchart_master']
  },
  {
    uid: 'mock-3',
    studentId: 'jigme.10b',
    name: 'Jigme Singye',
    email: 'jigme.10b@yonten.edu.bt',
    classSection: '10-B',
    school: 'Yonten Kuenjung HSS',
    role: 'student',
    xp: 780,
    streakDays: 9,
    completedLevelsCount: 7,
    lastActive: '2026-07-24',
    unlockedBadges: ['welcome_badge', 'excel_pro']
  },
  {
    uid: 'mock-4',
    studentId: 'pema.10a',
    name: 'Pema Lhamo',
    email: 'pema.10a@karma.edu.bt',
    classSection: '10-A',
    school: 'Karma Academy',
    role: 'student',
    xp: 720,
    streakDays: 8,
    completedLevelsCount: 7,
    lastActive: '2026-07-25',
    unlockedBadges: ['welcome_badge', 'python_basics']
  },
  {
    uid: 'mock-5',
    studentId: 'karma.10b',
    name: 'Karma Choden',
    email: 'karma.10b@lungten.edu.bt',
    classSection: '10-B',
    school: 'Lungtenzampa MSS',
    role: 'student',
    xp: 640,
    streakDays: 6,
    completedLevelsCount: 6,
    lastActive: '2026-07-23',
    unlockedBadges: ['welcome_badge']
  },
  {
    uid: 'mock-6',
    studentId: 'dechen.10c',
    name: 'Dechen Zangmo',
    email: 'dechen.10c@motithang.edu.bt',
    classSection: '10-C',
    school: 'Motithang HSS',
    role: 'student',
    xp: 590,
    streakDays: 5,
    completedLevelsCount: 5,
    lastActive: '2026-07-24',
    unlockedBadges: ['welcome_badge']
  },
  {
    uid: 'mock-7',
    studentId: 'kinley.10a',
    name: 'Kinley Tshering',
    email: 'kinley.10a@karma.edu.bt',
    classSection: '10-A',
    school: 'Karma Academy',
    role: 'student',
    xp: 520,
    streakDays: 4,
    completedLevelsCount: 5,
    lastActive: '2026-07-22',
    unlockedBadges: ['welcome_badge']
  },
  {
    uid: 'mock-8',
    studentId: 'dawa.10b',
    name: 'Dawa Norbu',
    email: 'dawa.10b@yangchen.edu.bt',
    classSection: '10-B',
    school: 'Yangchenphug HSS',
    role: 'student',
    xp: 460,
    streakDays: 3,
    completedLevelsCount: 4,
    lastActive: '2026-07-21',
    unlockedBadges: ['welcome_badge']
  }
];

export const ClassLeaderboard: React.FC<ClassLeaderboardProps> = ({
  userStats,
  currentUser,
  onOpenAuthModal,
  onNavigateTab,
  onOpenChallengeModal,
  onAcceptChallenge
}) => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [challenges, setChallenges] = useState<QuestChallenge[]>(INITIAL_QUEST_CHALLENGES);
  const [mainSubTab, setMainSubTab] = useState<'rankings' | 'challenges'>('rankings');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSort, setActiveSort] = useState<'xp' | 'streak' | 'levels'>('xp');
  const [challengeFilter, setChallengeFilter] = useState<'ALL' | 'PENDING' | 'MY_CHALLENGES' | 'COMPLETED'>('ALL');
  const [challengeToast, setChallengeToast] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to Firebase students
    const unsubscribe = subscribeToAllStudents((dbStudents) => {
      if (dbStudents.length > 0) {
        setStudents(dbStudents);
      } else {
        setStudents(DEFAULT_BHUTAN_STUDENTS);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubChallenges = subscribeToQuestChallenges((dbChallenges) => {
      if (dbChallenges.length > 0) {
        setChallenges(dbChallenges);
      }
    });
    return () => unsubChallenges();
  }, []);

  // Merge current local user into student list if not present
  const currentStudentProfile: StudentProfile = currentUser || {
    uid: 'current-local-user',
    studentId: userStats.studentName.toLowerCase().replace(/\s+/g, '.'),
    name: userStats.studentName,
    email: `${userStats.studentName.toLowerCase().replace(/\s+/g, '.')}@karma.edu.bt`,
    classSection: userStats.classSection || '10-A',
    school: userStats.schoolName || 'Karma Academy',
    role: 'student',
    xp: userStats.totalXp,
    streakDays: userStats.streakDays,
    completedLevelsCount: userStats.completedLevels.length,
    lastActive: userStats.lastActiveDate,
    unlockedBadges: userStats.unlockedBadges
  };

  // Ensure current user is in the displayed list with updated stats
  const combinedStudents = React.useMemo(() => {
    let list = [...students];
    const existingIndex = list.findIndex(
      (s) => s.uid === currentStudentProfile.uid || s.studentId === currentStudentProfile.studentId
    );

    if (existingIndex >= 0) {
      // Update with current local stats if higher
      list[existingIndex] = {
        ...list[existingIndex],
        xp: Math.max(list[existingIndex].xp || 0, userStats.totalXp),
        streakDays: Math.max(list[existingIndex].streakDays || 0, userStats.streakDays),
        completedLevelsCount: Math.max(list[existingIndex].completedLevelsCount || 0, userStats.completedLevels.length)
      };
    } else {
      list.push(currentStudentProfile);
    }

    return list;
  }, [students, currentUser, userStats, currentStudentProfile]);

  // Filtering & Sorting
  const filteredStudents = React.useMemo(() => {
    return combinedStudents
      .filter((s) => {
        const matchesSection = selectedSection === 'ALL' || s.classSection === selectedSection;
        const matchesSearch = 
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.school.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSection && matchesSearch;
      })
      .sort((a, b) => {
        if (activeSort === 'streak') return (b.streakDays || 0) - (a.streakDays || 0);
        if (activeSort === 'levels') return (b.completedLevelsCount || 0) - (a.completedLevelsCount || 0);
        return (b.xp || 0) - (a.xp || 0);
      });
  }, [combinedStudents, selectedSection, searchQuery, activeSort]);

  // Current user's rank
  const userRankIndex = filteredStudents.findIndex(
    (s) => s.uid === currentStudentProfile.uid || s.studentId === currentStudentProfile.studentId
  );
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : filteredStudents.length + 1;

  // Podium top 3
  const top1 = filteredStudents[0];
  const top2 = filteredStudents[1];
  const top3 = filteredStudents[2];

  // Stats summary
  const totalXPAcc = filteredStudents.reduce((acc, curr) => acc + (curr.xp || 0), 0);
  const avgXP = filteredStudents.length > 0 ? Math.round(totalXPAcc / filteredStudents.length) : 0;

  const myUid = currentUser?.uid || 'current-local-user';
  const myName = currentUser?.name || userStats.studentName;
  const pendingCount = challenges.filter(
    (c) => c.status === 'pending' && (c.opponentUid === myUid || c.opponentName === myName)
  ).length;

  const handleChallenge = (studentName: string) => {
    setChallengeToast(`⚔️ Challenge issued to ${studentName}! Jump to Exam Prep to test your score!`);
    setTimeout(() => setChallengeToast(null), 4000);
  };

  const renderMatchesGrid = () => {
    const filtered = challenges.filter((c) => {
      if (challengeFilter === 'PENDING') {
        return c.status === 'pending';
      }
      if (challengeFilter === 'MY_CHALLENGES') {
        return (
          c.challengerUid === myUid ||
          c.opponentUid === myUid ||
          c.challengerName === myName ||
          c.opponentName === myName
        );
      }
      if (challengeFilter === 'COMPLETED') {
        return c.status === 'completed';
      }
      return true;
    });

    if (filtered.length === 0) {
      return (
        <div className="col-span-full bg-white border-3 border-[#1A1A1A] rounded-2xl p-8 text-center space-y-3 shadow-[4px_4px_0px_0px_#1A1A1A]">
          <Swords className="w-12 h-12 text-[#6D071A] mx-auto opacity-40" />
          <h4 className="text-lg font-black font-serif text-[#1A1A1A]">No challenges found</h4>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            Be the first to issue a Speedrun Challenge to your classmates!
          </p>
          {onOpenChallengeModal && (
            <button
              onClick={() => onOpenChallengeModal(null)}
              className="inline-flex items-center gap-2 bg-[#FFCC33] text-[#1A1A1A] border-2 border-[#1A1A1A] px-4 py-2 rounded-xl font-black text-xs uppercase shadow-[2px_2px_0px_0px_#1A1A1A] mt-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Issue Challenge Now
            </button>
          )}
        </div>
      );
    }

    return filtered.map((c) => {
      const isMyTurn = c.status === 'pending' && (c.opponentUid === myUid || c.opponentName === myName);
      const formatSeconds = (sec?: number) => (sec ? `${Math.floor(sec / 60)}m ${sec % 60}s` : 'Pending');

      return (
        <div
          key={c.id}
          className={`bg-white border-3 sm:border-4 border-[#1A1A1A] rounded-2xl p-5 shadow-[5px_5px_0px_0px_#1A1A1A] flex flex-col justify-between space-y-4 relative overflow-hidden ${
            isMyTurn ? 'ring-4 ring-[#FFCC33] bg-amber-50/40' : ''
          }`}
        >
          {/* Badge header */}
          <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
            <span className="text-[10px] font-black uppercase text-[#6D071A] bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#6D071A]" />
              {c.targetType === 'quest' ? 'Chapter Quiz Quest' : 'Python IDE Speedrun'}
            </span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                c.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                  : 'bg-amber-100 text-amber-800 border-amber-400'
              }`}
            >
              {c.status === 'completed' ? '🏁 RACE FINISHED' : '⚡ PENDING CHALLENGE'}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-sm font-black font-serif text-[#1A1A1A] leading-tight">{c.targetTitle}</h4>

          {/* Matchup vs Times */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 border-2 border-[#1A1A1A] p-3 rounded-xl">
            {/* Challenger */}
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase text-gray-500">Challenger</div>
              <div className="text-xs font-extrabold text-[#1A1A1A] truncate">{c.challengerName}</div>
              <div className="font-mono text-xs font-black text-[#6D071A] flex items-center gap-1">
                ⚡ {formatSeconds(c.challengerTimeSeconds)}
              </div>
            </div>

            {/* Opponent */}
            <div className="space-y-1 border-l-2 border-gray-200 pl-3">
              <div className="text-[10px] font-black uppercase text-gray-500">Opponent</div>
              <div className="text-xs font-extrabold text-[#1A1A1A] truncate">{c.opponentName}</div>
              <div className="font-mono text-xs font-black text-[#00B0FF] flex items-center gap-1">
                ⚡ {formatSeconds(c.opponentTimeSeconds)}
              </div>
            </div>
          </div>

          {/* Winner Banner or Accept Action */}
          {c.status === 'completed' ? (
            <div className="bg-[#6D071A] text-white p-2.5 rounded-xl border-2 border-[#1A1A1A] text-xs font-extrabold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#FFCC33]" />
                Winner: <strong>{c.winnerName || c.challengerName}</strong>
              </span>
              <span className="text-[10px] text-[#FFCC33] bg-black/40 px-2 py-0.5 rounded font-mono">
                +50 XP Awarded
              </span>
            </div>
          ) : isMyTurn ? (
            <button
              onClick={() => onAcceptChallenge && onAcceptChallenge(c)}
              className="w-full py-2.5 bg-[#FFCC33] hover:bg-amber-400 text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center justify-center gap-2 animate-bounce cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#6D071A]" />
              Accept & Start Speedrun Now!
            </button>
          ) : (
            <div className="text-[11px] font-bold text-gray-500 text-center italic py-1">
              Waiting for opponent to complete run...
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Toast Notification */}
      {challengeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6D071A] text-white border-3 border-[#1A1A1A] px-4 py-3 rounded-2xl shadow-[5px_5px_0px_0px_#1A1A1A] font-bold text-sm flex items-center gap-2 animate-bounce">
          <Zap className="w-5 h-5 text-[#FFCC33]" />
          <span>{challengeToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative bg-[#6D071A] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[6px_6px_0px_0px_#1A1A1A] border-3 sm:border-4 border-[#1A1A1A] overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FFCC33] border-2 border-[#1A1A1A] px-3 py-1 rounded-xl text-xs font-black text-[#1A1A1A] uppercase tracking-wider shadow-[2px_2px_0px_0px_#1A1A1A]">
            <Trophy className="w-4 h-4 text-[#6D071A]" /> Bhutan ICT Class Rankings
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-serif leading-tight">
            Class 10 Scholar Leaderboard
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm font-medium leading-relaxed">
            Compete with classmates across Class 10! Earn XP by mastering Python scripts, formulas, and curriculum quests. Real-time stats are synchronized via Cloud Authentication.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-black text-[#1A1A1A]">
            <span className="flex items-center gap-1.5 bg-[#FFCC33] border-2 border-[#1A1A1A] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A]">
              <Users className="w-4 h-4 text-[#6D071A]" /> {filteredStudents.length} Active Scholars
            </span>
            <span className="flex items-center gap-1.5 bg-[#FFCC33] border-2 border-[#1A1A1A] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A]">
              <Sparkles className="w-4 h-4 text-[#6D071A]" /> {totalXPAcc.toLocaleString()} Total Class XP
            </span>
            <span className="flex items-center gap-1.5 bg-[#FFCC33] border-2 border-[#1A1A1A] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A]">
              <Award className="w-4 h-4 text-[#6D071A]" /> Avg: {avgXP} XP / Scholar
            </span>
          </div>
        </div>
      </div>

      {/* Cloud Sync Callout / User Rank Status Card */}
      <div className="bg-white border-3 sm:border-4 border-[#1A1A1A] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[5px_5px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFCC33] border-3 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] font-black text-xl shadow-[3px_3px_0px_0px_#1A1A1A]">
            #{userRank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-[#6D071A] tracking-wider">Your Position</span>
              {currentUser ? (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-400 px-2 py-0.5 rounded-full font-extrabold">
                  <ShieldCheck className="w-3 h-3" /> Cloud Synced
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 border border-amber-400 px-2 py-0.5 rounded-full font-extrabold">
                  Local Guest Mode
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#1A1A1A] font-serif">
              {currentStudentProfile.name} ({currentStudentProfile.studentId})
            </h3>
            <p className="text-xs font-bold text-gray-600">
              Ranked #{userRank} among {filteredStudents.length} students • {userStats.totalXp} Total XP • {userStats.streakDays} Day Streak 🔥
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!currentUser ? (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 bg-[#FFCC33] text-[#1A1A1A] border-3 border-[#1A1A1A] px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_#1A1A1A] font-black text-xs hover:opacity-95 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Login with Student ID</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateTab('examprep')}
              className="flex items-center gap-1.5 bg-[#6D071A] text-white border-3 border-[#1A1A1A] px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_#1A1A1A] font-black text-xs hover:opacity-95 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#FFCC33]" />
              <span>Earn More XP</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 3 Scholar Podium Cards */}
      {filteredStudents.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
          {/* #2 Silver Podium */}
          {top2 && (
            <div className="order-2 md:order-1 bg-slate-50 border-3 sm:border-4 border-[#1A1A1A] rounded-2xl p-5 shadow-[5px_5px_0px_0px_#1A1A1A] relative flex flex-col items-center text-center">
              <div className="absolute -top-4 bg-slate-300 text-[#1A1A1A] border-2 border-[#1A1A1A] font-black text-xs px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#1A1A1A] uppercase tracking-wider flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-slate-700" /> #2 Thunder Scholar
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-200 border-3 border-[#1A1A1A] flex items-center justify-center font-black text-2xl text-slate-800 font-serif mt-2 mb-3 shadow-[3px_3px_0px_0px_#1A1A1A]">
                🥈
              </div>
              <h4 className="font-black text-base text-[#1A1A1A] font-serif truncate max-w-full">
                {top2.name}
              </h4>
              <p className="text-xs font-bold text-slate-600 mb-2">@{top2.studentId} • {top2.school}</p>
              <div className="bg-slate-200 border-2 border-[#1A1A1A] px-3 py-1 rounded-xl font-mono font-black text-sm text-[#1A1A1A]">
                {top2.xp} XP
              </div>
              <div className="text-[11px] font-extrabold text-slate-600 mt-2 flex items-center gap-2">
                <span>🔥 {top2.streakDays}d Streak</span>
                <span>•</span>
                <span>🏆 {top2.completedLevelsCount} Quests</span>
              </div>
            </div>
          )}

          {/* #1 Gold Champion Podium */}
          {top1 && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-[#FFFDF0] to-[#FFF3C4] border-4 border-[#1A1A1A] rounded-2xl p-6 shadow-[7px_7px_0px_0px_#1A1A1A] relative flex flex-col items-center text-center -translate-y-0 sm:-translate-y-2">
              <div className="absolute -top-5 bg-[#FFCC33] text-[#1A1A1A] border-3 border-[#1A1A1A] font-black text-xs px-3.5 py-1 rounded-full shadow-[3px_3px_0px_0px_#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#6D071A] fill-amber-400" /> #1 Druk ICT Champion
              </div>
              <div className="w-20 h-20 rounded-full bg-[#FFCC33] border-4 border-[#1A1A1A] flex items-center justify-center font-black text-3xl text-[#1A1A1A] font-serif mt-3 mb-3 shadow-[4px_4px_0px_0px_#1A1A1A] animate-pulse">
                👑
              </div>
              <h4 className="font-black text-lg sm:text-xl text-[#1A1A1A] font-serif truncate max-w-full">
                {top1.name}
              </h4>
              <p className="text-xs font-black text-[#6D071A] mb-3">@{top1.studentId} • {top1.school}</p>
              <div className="bg-[#6D071A] text-white border-2 border-[#1A1A1A] px-4 py-1.5 rounded-xl font-mono font-black text-base shadow-[2px_2px_0px_0px_#1A1A1A]">
                {top1.xp} XP
              </div>
              <div className="text-xs font-black text-[#1A1A1A] mt-3 flex items-center gap-3 bg-white/80 border border-[#1A1A1A] px-3 py-1 rounded-lg">
                <span>🔥 {top1.streakDays}d Streak</span>
                <span>•</span>
                <span>🏆 {top1.completedLevelsCount} Quests Done</span>
              </div>
            </div>
          )}

          {/* #3 Bronze Podium */}
          {top3 && (
            <div className="order-3 bg-amber-50/70 border-3 sm:border-4 border-[#1A1A1A] rounded-2xl p-5 shadow-[5px_5px_0px_0px_#1A1A1A] relative flex flex-col items-center text-center">
              <div className="absolute -top-4 bg-amber-200 text-[#1A1A1A] border-2 border-[#1A1A1A] font-black text-xs px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#1A1A1A] uppercase tracking-wider flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-amber-800" /> #3 ICT Pioneer
              </div>
              <div className="w-16 h-16 rounded-full bg-amber-200 border-3 border-[#1A1A1A] flex items-center justify-center font-black text-2xl text-amber-900 font-serif mt-2 mb-3 shadow-[3px_3px_0px_0px_#1A1A1A]">
                🥉
              </div>
              <h4 className="font-black text-base text-[#1A1A1A] font-serif truncate max-w-full">
                {top3.name}
              </h4>
              <p className="text-xs font-bold text-amber-900 mb-2">@{top3.studentId} • {top3.school}</p>
              <div className="bg-amber-200 border-2 border-[#1A1A1A] px-3 py-1 rounded-xl font-mono font-black text-sm text-[#1A1A1A]">
                {top3.xp} XP
              </div>
              <div className="text-[11px] font-extrabold text-amber-900 mt-2 flex items-center gap-2">
                <span>🔥 {top3.streakDays}d Streak</span>
                <span>•</span>
                <span>🏆 {top3.completedLevelsCount} Quests</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-tab Navigation (Overall Leaderboard vs Quest Speedrun Challenges) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 border-3 sm:border-4 border-[#1A1A1A] rounded-2xl shadow-[4px_4px_0px_0px_#1A1A1A]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMainSubTab('rankings')}
            className={`px-4 py-2.5 rounded-xl border-2 border-[#1A1A1A] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              mainSubTab === 'rankings'
                ? 'bg-[#6D071A] text-white shadow-[3px_3px_0px_0px_#1A1A1A]'
                : 'bg-gray-100 text-[#1A1A1A] hover:bg-gray-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-[#FFCC33]" />
            Overall XP Rankings
          </button>

          <button
            onClick={() => setMainSubTab('challenges')}
            className={`px-4 py-2.5 rounded-xl border-2 border-[#1A1A1A] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer relative ${
              mainSubTab === 'challenges'
                ? 'bg-[#6D071A] text-white shadow-[3px_3px_0px_0px_#1A1A1A]'
                : 'bg-gray-100 text-[#1A1A1A] hover:bg-gray-200'
            }`}
          >
            <Swords className="w-4 h-4 text-[#FFCC33]" />
            Quest Speedrun Challenges
            {pendingCount > 0 && (
              <span className="bg-[#FFCC33] text-[#1A1A1A] border border-[#1A1A1A] px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                {pendingCount} NEW
              </span>
            )}
          </button>
        </div>

        {onOpenChallengeModal && (
          <button
            onClick={() => onOpenChallengeModal(null)}
            className="bg-[#FFCC33] text-[#1A1A1A] hover:bg-amber-400 border-2 border-[#1A1A1A] px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#6D071A]" />
            Send New Challenge
          </button>
        )}
      </div>

      {/* RENDER QUEST SPEEDRUN CHALLENGES TAB */}
      {mainSubTab === 'challenges' ? (
        <div className="space-y-6">
          {/* Challenge Filter Bar */}
          <div className="bg-white border-3 sm:border-4 border-[#1A1A1A] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-black uppercase text-[#1A1A1A] mr-1">Filter Matches:</span>
              {(['ALL', 'PENDING', 'MY_CHALLENGES', 'COMPLETED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setChallengeFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl border-2 border-[#1A1A1A] font-black text-xs uppercase transition-all cursor-pointer whitespace-nowrap ${
                    challengeFilter === filter
                      ? 'bg-[#6D071A] text-white shadow-[2px_2px_0px_0px_#1A1A1A]'
                      : 'bg-gray-100 text-[#1A1A1A] hover:bg-gray-200'
                  }`}
                >
                  {filter === 'ALL' && 'All Matches'}
                  {filter === 'PENDING' && 'Pending Requests'}
                  {filter === 'MY_CHALLENGES' && 'My Challenges'}
                  {filter === 'COMPLETED' && 'Completed Races'}
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFCC33]" />
              Showing {challenges.length} active speedrun challenges
            </div>
          </div>

          {/* Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderMatchesGrid()}
          </div>

          {/* Speedrun Hall of Fame Table */}
          <div className="bg-white border-3 sm:border-4 border-[#1A1A1A] rounded-2xl p-5 shadow-[5px_5px_0px_0px_#1A1A1A] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#FFCC33] text-[#1A1A1A] rounded-xl border-2 border-[#1A1A1A]">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-serif text-[#1A1A1A]">Class 10 Speedrun Hall of Fame</h3>
                  <p className="text-xs text-gray-600 font-medium">Fastest verified completion times across Bhutan Class 10 ICT quests</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-[#1A1A1A] text-[#1A1A1A] font-black uppercase tracking-wider text-[10px] bg-amber-50">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Quest / Exercise</th>
                    <th className="p-3">Record Holder</th>
                    <th className="p-3">Record Time</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-bold text-[#1A1A1A]">
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-3 font-black text-[#6D071A]">🥇 1st</td>
                    <td className="p-3 font-serif">Types of Cloud Services (IaaS, PaaS, SaaS)</td>
                    <td className="p-3">Tashi Dorji (Class 10-A)</td>
                    <td className="p-3 font-mono font-black text-emerald-600">⚡ 00:42s</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px]">Verified</span></td>
                  </tr>
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-3 font-black text-slate-700">🥈 2nd</td>
                    <td className="p-3 font-serif">Python Lab: Recursive Factorial Function</td>
                    <td className="p-3">Sonam Wangmo (Class 10-A)</td>
                    <td className="p-3 font-mono font-black text-emerald-600">⚡ 00:38s</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px]">Verified</span></td>
                  </tr>
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-3 font-black text-amber-800">🥉 3rd</td>
                    <td className="p-3 font-serif">Python Loops & Bhutanese Menus</td>
                    <td className="p-3">Dechen Zangmo (Class 10-C)</td>
                    <td className="p-3 font-mono font-black text-emerald-600">⚡ 00:51s</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px]">Verified</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {/* RENDER OVERALL RANKINGS TABLE */}
      {mainSubTab === 'rankings' && (
        <>
          {/* Controls Bar: Section Filter, Search & Sort */}
      <div className="bg-white border-3 sm:border-4 border-[#1A1A1A] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-3">
        {/* Class Section Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full md:w-auto">
          <span className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider mr-1 hidden sm:inline">Section:</span>
          {['ALL', '10-A', '10-B', '10-C'].map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-3 py-1.5 rounded-xl border-2 border-[#1A1A1A] font-black text-xs transition-all cursor-pointer whitespace-nowrap ${
                selectedSection === section
                  ? 'bg-[#6D071A] text-white shadow-[2px_2px_0px_0px_#1A1A1A]'
                  : 'bg-gray-100 text-[#1A1A1A] hover:bg-gray-200'
              }`}
            >
              {section === 'ALL' ? 'All Sections' : `Class ${section}`}
            </button>
          ))}
        </div>

        {/* Sort Tabs & Search Input */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Sort selection */}
          <div className="flex items-center bg-gray-100 border-2 border-[#1A1A1A] rounded-xl p-0.5 text-xs font-black">
            <button
              onClick={() => setActiveSort('xp')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeSort === 'xp' ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]' : 'text-gray-600'
              }`}
            >
              ⭐ XP Rank
            </button>
            <button
              onClick={() => setActiveSort('streak')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeSort === 'streak' ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]' : 'text-gray-600'
              }`}
            >
              🔥 Streak
            </button>
            <button
              onClick={() => setActiveSort('levels')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeSort === 'levels' ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]' : 'text-gray-600'
              }`}
            >
              🏆 Quests
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scholar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-2 border-[#1A1A1A] rounded-xl pl-8 pr-3 py-1.5 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Main Leaderboard Table / Cards */}
      <div className="bg-white border-3 sm:border-4 border-[#1A1A1A] rounded-2xl sm:rounded-3xl shadow-[6px_6px_0px_0px_#1A1A1A] overflow-hidden">
        <div className="bg-[#FFCC33] p-4 border-b-3 sm:border-b-4 border-[#1A1A1A] flex items-center justify-between">
          <h3 className="font-black text-base sm:text-lg text-[#1A1A1A] font-serif flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#6D071A]" />
            Full Class Standings ({filteredStudents.length} Students)
          </h3>
          <span className="text-xs font-black text-[#1A1A1A] bg-white border-2 border-[#1A1A1A] px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_0px_#1A1A1A]">
            Class 10 Syllabus
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-bold text-sm">
            No students found matching your search criteria.
          </div>
        ) : (
          <div className="divide-y-2 divide-[#1A1A1A]">
            {filteredStudents.map((student, idx) => {
              const rank = idx + 1;
              const isCurrentUser = 
                student.uid === currentStudentProfile.uid || student.studentId === currentStudentProfile.studentId;
              const maxXP = top1 ? top1.xp : 1000;
              const xpPercent = Math.min(100, Math.round(((student.xp || 0) / (maxXP || 1)) * 100));

              return (
                <div
                  key={student.uid || student.studentId}
                  className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                    isCurrentUser ? 'bg-amber-50/90 border-l-8 border-l-[#6D071A]' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Rank Badge + Student Info */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Rank Circle */}
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-[#1A1A1A] font-black text-xs sm:text-sm flex items-center justify-center shrink-0 font-serif ${
                      rank === 1 ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]' :
                      rank === 2 ? 'bg-slate-200 text-slate-800' :
                      rank === 3 ? 'bg-amber-200 text-amber-900' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </div>

                    {/* Student Name & Class */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-xs sm:text-base text-[#1A1A1A] truncate font-serif">
                          {student.name}
                        </span>
                        {isCurrentUser && (
                          <span className="bg-[#6D071A] text-white border border-[#1A1A1A] text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                            YOU
                          </span>
                        )}
                        <span className="text-[10px] font-extrabold text-gray-600 bg-gray-100 border border-gray-300 px-1.5 py-0.2 rounded">
                          {student.classSection}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-500 truncate">
                        @{student.studentId} • {student.school}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar & Stats */}
                  <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    {/* XP Progress relative to leader */}
                    <div className="hidden md:block w-32">
                      <div className="flex justify-between text-[10px] font-extrabold text-gray-600 mb-1">
                        <span>{student.xp} XP</span>
                        <span>{xpPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden border border-[#1A1A1A]">
                        <div 
                          className="bg-[#FFCC33] h-full" 
                          style={{ width: `${xpPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Badges / Stats Quick View */}
                    <div className="hidden sm:flex items-center gap-3 text-xs font-black text-gray-700">
                      <span className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-lg">
                        🔥 {student.streakDays}d
                      </span>
                      <span className="flex items-center gap-1 bg-purple-100 border border-purple-300 px-2 py-0.5 rounded-lg">
                        🏆 {student.completedLevelsCount} Quests
                      </span>
                    </div>

                    {/* XP Badge */}
                    <div className="bg-[#FFCC33] text-[#1A1A1A] border-2 border-[#1A1A1A] px-2.5 py-1 rounded-xl font-mono font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_#1A1A1A] shrink-0">
                      {student.xp} XP
                    </div>

                    {/* Challenge Button */}
                    {!isCurrentUser && (
                      <button
                        onClick={() => {
                          if (onOpenChallengeModal) {
                            onOpenChallengeModal(student);
                          } else {
                            handleChallenge(student.name);
                          }
                        }}
                        className="flex items-center gap-1 bg-[#FFCC33] hover:bg-amber-400 border-2 border-[#1A1A1A] px-2 py-1 rounded-lg text-xs font-black transition-colors cursor-pointer text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]"
                        title={`Send Quest Challenge to ${student.name}`}
                      >
                        <Swords className="w-3.5 h-3.5 text-[#6D071A]" />
                        <span className="hidden sm:inline">Challenge</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
