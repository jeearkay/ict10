import React, { useState } from 'react';
import { INITIAL_BADGES } from '../data/syllabus';
import { UserStats, Badge } from '../types';
import { Logo } from './Logo';
import {
  Trophy,
  Flame,
  Sparkles,
  User,
  GraduationCap,
  School,
  CheckCircle2,
  Lock,
  RefreshCw,
  Award,
  Bell,
  BellRing,
  Clock,
  Send,
  Zap,
  AlertCircle,
  Calendar,
  Target,
  ShieldCheck,
  Filter,
  Info,
  X,
  Share2,
  Medal,
  Star
} from 'lucide-react';
import { BhutanDragonIcon } from './BhutanVisuals';
import {
  getNotificationPermission,
  requestNotificationPermission,
  checkInactivityStatus,
  sendBrowserNotification,
  simulateInactivity,
  recordUserActivity
} from '../lib/notifications';

interface ProfileProps {
  userStats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const ProfileModal: React.FC<ProfileProps> = ({ userStats, onUpdateStats }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userStats.studentName);
  const [school, setSchool] = useState(userStats.schoolName);
  const [section, setSection] = useState(userStats.classSection);

  // Badge filters and modal state
  const [badgeFilter, setBadgeFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeMobileTooltipId, setActiveMobileTooltipId] = useState<string | null>(null);
  const [selectedBadgeModal, setSelectedBadgeModal] = useState<Badge | null>(null);

  // Notification states
  const [notifPermission, setNotifPermission] = useState(getNotificationPermission());
  const [inactivityInfo, setInactivityInfo] = useState(() => checkInactivityStatus(48));
  const [testNotifMessage, setTestNotifMessage] = useState<string | null>(null);

  const handleRequestNotifications = async () => {
    const permission = await requestNotificationPermission();
    setNotifPermission(permission);
    setInactivityInfo(checkInactivityStatus(48));
    if (permission === 'granted') {
      sendBrowserNotification(
        '🔔 Study Reminders Enabled!',
        'You will now receive reminders if you have not logged in for 48 hours to continue your ICT quests.'
      );
      setTestNotifMessage('✅ Browser notifications enabled & test reminder sent!');
    } else if (permission === 'denied') {
      setTestNotifMessage('⚠️ Notifications were blocked in browser settings.');
    }
  };

  const handleSendTestNotification = () => {
    const success = sendBrowserNotification(
      '🇧🇹 Class 10 ICT Quest Reminder (Test)',
      'This is a test notification! It has been 48 hours since your last ICT quest. Your study room peers are waiting!'
    );
    if (success) {
      setTestNotifMessage('🚀 Test reminder notification sent to your browser!');
    } else {
      setTestNotifMessage('⚠️ Unable to send notification. Check if browser permissions are allowed.');
    }
  };

  const handleSimulateInactivity = () => {
    simulateInactivity(49); // set last active to 49 hours ago
    const newStatus = checkInactivityStatus(48);
    setInactivityInfo(newStatus);
    setTestNotifMessage('⏳ Inactivity simulated to 49 hours! Triggering 48h reminder check...');

    sendBrowserNotification(
      '🇧🇹 Class 10 ICT Quest Reminder!',
      `It's been 49 hours since your last ICT quest! Check your Study Room & resume your Python practice.`
    );
  };

  const handleResetActivity = () => {
    recordUserActivity();
    setInactivityInfo(checkInactivityStatus(48));
    setTestNotifMessage('✨ Activity timestamp refreshed to now.');
  };

  const handleSaveProfile = () => {
    onUpdateStats({ studentName: name, schoolName: school, classSection: section });
    setIsEditing(false);
  };

  const getUnlockDateString = (badgeId: string): string => {
    if (!userStats.unlockedBadges.includes(badgeId)) return '';
    if (userStats.badgeUnlockDates && userStats.badgeUnlockDates[badgeId]) {
      return userStats.badgeUnlockDates[badgeId];
    }
    if (userStats.lastActiveDate) {
      return userStats.lastActiveDate;
    }
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const unlockedCount = userStats.unlockedBadges.length;
  const totalBadgesCount = INITIAL_BADGES.length;
  const unlockPercentage = Math.round((unlockedCount / totalBadgesCount) * 100);

  const categories = ['ALL', ...Array.from(new Set(INITIAL_BADGES.map((b) => b.category)))];

  const filteredBadges = INITIAL_BADGES.filter((badge) => {
    const isUnlocked = userStats.unlockedBadges.includes(badge.id);
    if (badgeFilter === 'UNLOCKED' && !isUnlocked) return false;
    if (badgeFilter === 'LOCKED' && isUnlocked) return false;
    if (selectedCategory !== 'ALL' && badge.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Student ID Card */}
      <div className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-red-950 text-white p-6 sm:p-8 rounded-3xl border-2 border-yellow-500/70 shadow-2xl overflow-hidden">
        <div className="absolute right-4 top-4 opacity-20 pointer-events-none">
          <BhutanDragonIcon className="w-48 h-48 text-yellow-400" />
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-white shadow-lg border-2 border-yellow-400">
              <Logo />
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-2 max-w-xs">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-amber-950/80 border border-yellow-400 rounded px-2.5 py-1 text-sm text-yellow-200 font-bold"
                  />
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="bg-amber-950/80 border border-yellow-400 rounded px-2.5 py-1 text-xs text-yellow-200"
                  />
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="bg-amber-950/80 border border-yellow-400 rounded px-2.5 py-1 text-xs text-yellow-200"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="px-3 py-1 bg-yellow-500 text-amber-950 font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-yellow-300 font-serif">{userStats.studentName}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-amber-300 underline cursor-pointer"
                    >
                      (Edit)
                    </button>
                  </div>
                  <p className="text-xs text-amber-200 font-semibold mt-1">
                    {userStats.schoolName} • {userStats.classSection}
                  </p>
                  <p className="text-[11px] text-amber-300/80 mt-0.5 font-mono">
                    Kingdom of Bhutan Class 10 ICT Syllabus
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-amber-950/70 border border-yellow-500/50 p-3.5 rounded-2xl text-center">
              <Sparkles className="w-5 h-5 text-yellow-400 mx-auto mb-1 animate-pulse" />
              <div className="text-xs uppercase text-yellow-200 font-bold">Total XP</div>
              <div className="text-xl font-black text-yellow-300 font-mono">{userStats.totalXp}</div>
            </div>

            <div className="bg-amber-950/70 border border-orange-500/50 p-3.5 rounded-2xl text-center">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1 fill-orange-400/20" />
              <div className="text-xs uppercase text-orange-200 font-bold">Daily Streak</div>
              <div className="text-xl font-black text-orange-300 font-mono">{userStats.streakDays} Days</div>
            </div>

            <div className="bg-amber-950/70 border border-red-500/50 p-3.5 rounded-2xl text-center col-span-2 sm:col-span-1">
              <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-xs uppercase text-red-200 font-bold">Levels Cleared</div>
              <div className="text-xl font-black text-yellow-300 font-mono">
                {userStats.completedLevels.length} / 22
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Unlocked & Achievements Section */}
      <div className="bg-white dark:bg-slate-900 border-3 border-[#1A1A1A] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-[#1A1A1A] dark:text-amber-100 font-serif flex items-center gap-2">
              <Award className="w-6 h-6 text-[#FFCC33]" /> Badges Unlocked & Achievements
            </h3>
            <p className="text-xs font-semibold text-gray-600 dark:text-slate-300">
              Hover over or tap any badge to view its unlock date, category credentials, and required criteria!
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="bg-amber-50 dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-2xl p-3 flex flex-col justify-center min-w-[220px] shadow-[2px_2px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between text-xs font-black text-[#1A1A1A] dark:text-amber-200 mb-1.5">
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-[#FFCC33]" /> Badges Earned
              </span>
              <span className="font-mono text-xs bg-[#FFCC33] text-[#1A1A1A] px-2 py-0.5 rounded-full border border-[#1A1A1A]">
                {unlockedCount} / {totalBadgesCount} ({unlockPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden border border-[#1A1A1A]">
              <div
                className="bg-[#6D071A] dark:bg-[#FFCC33] h-full transition-all duration-500 rounded-full"
                style={{ width: `${unlockPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 dark:bg-slate-800/60 p-3 rounded-2xl border-2 border-[#1A1A1A]">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setBadgeFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase transition-all cursor-pointer border ${
                badgeFilter === 'ALL'
                  ? 'bg-[#6D071A] text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-700 hover:bg-gray-100'
              }`}
            >
              All Badges ({INITIAL_BADGES.length})
            </button>
            <button
              onClick={() => setBadgeFilter('UNLOCKED')}
              className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase transition-all cursor-pointer border flex items-center gap-1 ${
                badgeFilter === 'UNLOCKED'
                  ? 'bg-emerald-600 text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-700 hover:bg-gray-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setBadgeFilter('LOCKED')}
              className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase transition-all cursor-pointer border flex items-center gap-1 ${
                badgeFilter === 'LOCKED'
                  ? 'bg-slate-800 text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-700 hover:bg-gray-100'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> Locked ({totalBadgesCount - unlockedCount})
            </button>
          </div>

          {/* Category Dropdown/Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold cursor-pointer transition-all border ${
                  selectedCategory === cat
                    ? 'bg-[#FFCC33] text-[#1A1A1A] border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-amber-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid with Hover Effect & Tap Tooltip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBadges.length === 0 ? (
            <div className="col-span-full bg-amber-50/50 dark:bg-slate-800/40 border-2 border-dashed border-gray-300 dark:border-slate-700 p-8 rounded-2xl text-center space-y-2">
              <Award className="w-10 h-10 text-gray-400 mx-auto" />
              <div className="font-serif font-black text-sm text-[#1A1A1A] dark:text-amber-200">
                No badges match the selected filter
              </div>
              <p className="text-xs text-gray-500">
                Try switching filters to 'All Badges' or select a different syllabus category.
              </p>
            </div>
          ) : (
            filteredBadges.map((badge) => {
              const isUnlocked = userStats.unlockedBadges.includes(badge.id);
              const unlockDate = getUnlockDateString(badge.id);
              const isMobileActive = activeMobileTooltipId === badge.id;

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    // Toggle tooltip on mobile tap, or open certificate modal
                    setActiveMobileTooltipId(isMobileActive ? null : badge.id);
                    setSelectedBadgeModal(badge);
                  }}
                  className={`group relative p-5 rounded-2xl border-3 border-[#1A1A1A] transition-all cursor-pointer flex flex-col justify-between text-center select-none ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-amber-50 to-amber-100/80 dark:from-amber-950/60 dark:to-slate-900 shadow-[4px_4px_0px_0px_#1A1A1A] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1A1A1A] hover:border-[#6D071A]'
                      : 'bg-gray-50 dark:bg-slate-800/40 opacity-75 shadow-[2px_2px_0px_0px_#1A1A1A] hover:opacity-100 hover:bg-amber-50/30'
                  }`}
                >
                  {/* Badge Icon & Sparkle */}
                  <div className="relative mb-3">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl border-2 border-[#1A1A1A] flex items-center justify-center text-3xl shadow-[2px_2px_0px_0px_#1A1A1A] transition-transform duration-300 group-hover:scale-110 ${
                        isUnlocked
                          ? 'bg-[#FFCC33] text-[#1A1A1A]'
                          : 'bg-gray-200 dark:bg-slate-700 text-gray-400 grayscale'
                      }`}
                    >
                      {badge.icon}
                    </div>

                    {isUnlocked && (
                      <span className="absolute top-0 right-1/4 bg-[#6D071A] text-[#FFCC33] p-1 rounded-full border border-[#1A1A1A] animate-pulse">
                        <Sparkles className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[10px] font-black uppercase text-amber-900 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-950 px-2 py-0.5 rounded-md inline-block border border-amber-300 dark:border-amber-700">
                      {badge.category}
                    </div>

                    <h4 className="font-serif font-black text-sm text-[#1A1A1A] dark:text-amber-100 leading-tight">
                      {badge.name}
                    </h4>

                    <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-slate-700 px-2.5 py-1 rounded-xl border border-gray-300">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </div>

                  {/* HOVER / TAP TOOLTIP POPOVER WITH UNLOCK DATE & CRITERIA */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-[#1A1A1A] text-white rounded-2xl border-2 border-[#FFCC33] shadow-2xl z-30 pointer-events-none transition-all duration-200 text-left space-y-2.5 ${
                      isMobileActive
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto'
                    }`}
                  >
                    {/* Tooltip Header */}
                    <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                      <span className="text-[10px] font-black uppercase text-[#FFCC33] tracking-wider flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#FFCC33]" /> {badge.name}
                      </span>
                      <span className="text-[9px] bg-amber-950 text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-500">
                        +50 XP
                      </span>
                    </div>

                    {/* Unlock Date */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase text-amber-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-400" />
                        {isUnlocked ? 'Unlocked Date:' : 'Status:'}
                      </div>
                      <div className="text-xs font-bold text-gray-100">
                        {isUnlocked ? unlockDate || 'Completed during Class 10 Quest' : '🔒 Not Yet Earned'}
                      </div>
                    </div>

                    {/* Criteria Details */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase text-amber-300 flex items-center gap-1">
                        <Target className="w-3 h-3 text-yellow-400" /> Required Criteria:
                      </div>
                      <p className="text-[11px] font-medium text-gray-200 leading-snug">
                        {badge.criteria || 'Complete the associated Class 10 Bhutan ICT syllabus quest and quiz.'}
                      </p>
                    </div>

                    <div className="text-[9px] font-bold text-amber-400 text-center pt-1 border-t border-gray-800">
                      👉 Click card to open Official Certificate Preview
                    </div>

                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1A1A1A]" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* DETAILED BADGE CERTIFICATE MODAL ON CLICK */}
      {selectedBadgeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-[10px_10px_0px_0px_#1A1A1A]">
            <button
              onClick={() => setSelectedBadgeModal(null)}
              className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-slate-800 text-[#1A1A1A] dark:text-white rounded-full hover:bg-gray-300 cursor-pointer border border-[#1A1A1A]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-200 dark:border-slate-800 pb-4">
              <div className="w-20 h-20 mx-auto bg-[#FFCC33] text-[#1A1A1A] border-3 border-[#1A1A1A] rounded-3xl flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_#1A1A1A]">
                {selectedBadgeModal.icon}
              </div>

              <div className="text-[10px] font-black uppercase tracking-widest text-[#6D071A] dark:text-amber-300">
                Kingdom of Bhutan • Class 10 ICT Syllabus
              </div>

              <h3 className="text-2xl font-black font-serif text-[#1A1A1A] dark:text-amber-100">
                {selectedBadgeModal.name}
              </h3>

              <div className="inline-block bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold text-xs px-3 py-1 rounded-full border border-amber-300">
                {selectedBadgeModal.category} Credential
              </div>
            </div>

            {/* Credential Specs */}
            <div className="space-y-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-[#1A1A1A] dark:text-amber-200">Achievement Overview</div>
                  <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed mt-0.5">
                    {selectedBadgeModal.description}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-100 dark:border-slate-700 pt-3">
                <Target className="w-5 h-5 text-[#6D071A] dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-[#1A1A1A] dark:text-amber-200">Unlock Criteria</div>
                  <p className="text-xs text-gray-700 dark:text-slate-200 font-medium leading-relaxed mt-0.5">
                    {selectedBadgeModal.criteria || 'Complete the associated Class 10 Bhutan ICT syllabus quest and quiz.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-100 dark:border-slate-700 pt-3">
                <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-[#1A1A1A] dark:text-amber-200">Status & Timestamp</div>
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {userStats.unlockedBadges.includes(selectedBadgeModal.id)
                      ? `Unlocked on ${getUnlockDateString(selectedBadgeModal.id)}`
                      : '🔒 Currently Locked'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedBadgeModal(null)}
                className="flex-1 py-3 bg-[#FFCC33] hover:bg-amber-400 text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#6D071A]" /> Close Credential View
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 48-Hour Inactivity & Study Room Reminder System */}
      <div className="bg-[#FDFCF0] dark:bg-slate-900 border-3 border-[#1A1A1A] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFCC33] border-2 border-[#1A1A1A] rounded-2xl shadow-[2px_2px_0px_0px_#1A1A1A]">
              <BellRing className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1A1A1A] dark:text-amber-200 font-serif flex items-center gap-2">
                48h Inactivity & Study Room Reminders
              </h3>
              <p className="text-xs font-semibold text-gray-700 dark:text-amber-100/70 mt-0.5">
                Automatically notifies you if you haven't engaged in a quest or visited the study room for over 48 hours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] ${
              notifPermission === 'granted'
                ? 'bg-emerald-400 text-[#1A1A1A]'
                : notifPermission === 'denied'
                ? 'bg-rose-400 text-white'
                : 'bg-amber-300 text-[#1A1A1A]'
            }`}>
              Status: {notifPermission.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Current Activity & Status Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-amber-100/70 dark:bg-slate-800/80 border-2 border-[#1A1A1A] rounded-2xl space-y-1">
            <div className="text-[10px] font-black uppercase text-amber-900 dark:text-amber-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Inactivity Tracking:
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-amber-100">
              {inactivityInfo.inactiveHours} Hours Since Last Quest
            </div>
            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              {inactivityInfo.isInactive 
                ? '🚨 Inactive for 48+ hours! Reminder notification triggered.'
                : '✅ Active within last 48 hours.'}
            </p>
          </div>

          <div className="p-4 bg-amber-100/70 dark:bg-slate-800/80 border-2 border-[#1A1A1A] rounded-2xl space-y-1">
            <div className="text-[10px] font-black uppercase text-amber-900 dark:text-amber-300 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" /> Browser Permission:
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-amber-100">
              {notifPermission === 'granted' ? 'Notifications Active' : 'Permission Required'}
            </div>
            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              Receive background desktop / mobile notifications on 48h idle.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {notifPermission !== 'granted' && (
            <button
              onClick={handleRequestNotifications}
              className="px-4 py-2.5 bg-[#FFCC33] hover:bg-yellow-400 text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-2"
            >
              <Bell className="w-4 h-4" /> Enable Browser Notifications
            </button>
          )}

          <button
            onClick={handleSendTestNotification}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Send Test Notification
          </button>

          <button
            onClick={handleSimulateInactivity}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-2"
            title="Sets last active timestamp to 49 hours ago to test 48h idle reminder trigger"
          >
            <Zap className="w-4 h-4 text-amber-300" /> Simulate 48h Inactivity
          </button>

          <button
            onClick={handleResetActivity}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-amber-200 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Activity
          </button>
        </div>

        {testNotifMessage && (
          <div className="p-3 bg-amber-100 dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-xl text-xs font-bold text-slate-900 dark:text-amber-200 animate-in fade-in">
            {testNotifMessage}
          </div>
        )}
      </div>
    </div>
  );
};
