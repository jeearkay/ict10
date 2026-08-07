import { UserStats } from '../types';
import { StudentProfile } from './firebase';

export function getStorageKey(userId?: string): string {
  return userId ? `guna_ict_user_stats_${userId}` : 'guna_ict_class10_guest_stats';
}

export function getInitialUserStats(userId?: string): UserStats {
  if (typeof window === 'undefined') {
    return createDefaultStats();
  }

  try {
    const key = getStorageKey(userId);
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...createDefaultStats(),
        ...parsed,
        completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
        unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
      };
    }
  } catch (e) {
    console.error('Failed to load user stats:', e);
  }

  return createDefaultStats();
}

export function saveUserStats(stats: UserStats, userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save user stats:', e);
  }
}

export function createDefaultStats(
  studentName = 'Guest Student',
  schoolName = 'Karma Academy',
  classSection = 'Class 10-A'
): UserStats {
  const today = new Date().toISOString().split('T')[0];
  return {
    studentName,
    schoolName,
    classSection,
    totalXp: 0,
    level: 1,
    streakDays: 1,
    lastActiveDate: today,
    completedLevels: [],
    unlockedBadges: [],
    notes: {},
  };
}

export function profileToUserStats(profile: StudentProfile): UserStats {
  const completedLevels = Array.isArray(profile.completedLevels) ? profile.completedLevels : [];
  const unlockedBadges = Array.isArray(profile.unlockedBadges) ? profile.unlockedBadges : [];
  const totalXp = typeof profile.xp === 'number' ? profile.xp : 0;
  return {
    studentName: profile.name || profile.studentId || 'Student',
    schoolName: profile.school || 'Karma Academy',
    classSection: profile.classSection || 'Class 10-A',
    totalXp,
    level: Math.max(1, Math.floor(totalXp / 100) + 1),
    streakDays: profile.streakDays || 1,
    lastActiveDate: profile.lastActive || new Date().toISOString().split('T')[0],
    completedLevels,
    unlockedBadges,
    notes: {},
  };
}
