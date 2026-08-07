import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signOut,
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  where
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { QuestChallenge } from '../types';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
const configuredDatabaseId = typeof firebaseConfig.firestoreDatabaseId === 'string' && firebaseConfig.firestoreDatabaseId.trim()
  ? firebaseConfig.firestoreDatabaseId.trim()
  : '(default)';
export const db = getFirestore(app, configuredDatabaseId);
const FIREBASE_REQUEST_TIMEOUT_MS = 15000;
const LOCAL_AUTH_SESSION_KEY = 'guna_ict_local_auth_session';
const USE_LOCAL_AUTH_FALLBACK = import.meta.env.DEV;

export interface StudentProfile {
  uid: string;
  studentId: string; // e.g. "tashi.10a"
  name: string;
  profilePhotoDataUrl?: string;
  email: string;
  classSection: string;
  school: string;
  role: 'student' | 'teacher';
  xp: number;
  streakDays: number;
  completedLevelsCount: number;
  lastActive: string;
  unlockedBadges: string[];
  completedLevels?: string[];
  initialPassword?: string;
  isApproved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}

interface RegisterStudentAccountOptions {
  isApproved?: boolean;
  status?: StudentProfile['status'];
  email?: string;
  createAuthCredential?: boolean;
}

interface StoredStudentProfile extends StudentProfile {
  passwordHash?: string;
  passwordSalt?: string;
}

export interface ClassroomHelpRequest {
  id: string;
  studentUid?: string;
  studentName: string;
  studentClass: string;
  schoolName: string;
  chapterTitle: string;
  levelTitle: string;
  query: string;
  contextSnippet?: string;
  timestamp: number;
  status: 'pending' | 'resolved';
  teacherResponse?: string;
  respondedAt?: number;
  respondedBy?: string;
}

export interface ActiveStudentSession {
  id: string;
  studentName: string;
  classSection: string;
  schoolName: string;
  currentActivity: string;
  xp: number;
  statusMessage?: string;
  avatarBg?: string;
  lastSeenTimestamp: number;
}

export interface CommunityCheer {
  id: string;
  senderName: string;
  recipientName: string;
  cheerText: string;
  emoji: string;
  timestamp: number;
}

export interface CoLearnSession {
  id: string;
  title: string;
  hostName: string;
  partnerName?: string;
  code: string;
  language: string;
  status: 'active' | 'completed';
  lastUpdated: number;
}

export interface PeerReviewFeedback {
  id: string;
  reviewerUid?: string;
  reviewerName: string;
  classSection: string;
  feedbackText: string;
  sentimentScore: 'constructive' | 'neutral' | 'needs_improvement' | 'toxic_flagged';
  scorePercentage: number;
  sentimentReason: string;
  suggestedImprovement?: string | null;
  isConstructive: boolean;
  timestamp: number;
  helpfulCount: number;
  teacherEndorsed?: boolean;
}

export interface PeerReviewRequest {
  id: string;
  studentUid?: string;
  studentName: string;
  classSection: string;
  schoolName: string;
  projectTitle: string;
  codeSnippet: string;
  description: string;
  timestamp: number;
  status: 'open' | 'reviewed' | 'resolved';
  reviews: PeerReviewFeedback[];
}


// Convert user ID (e.g. tashi.10a) to standard email format if needed
export function studentIdToEmail(studentId: string): string {
  const cleanId = normalizeStudentId(studentId);
  if (cleanId.includes('@')) return cleanId;
  return `${cleanId}@karma.edu.bt`;
}

function withFirebaseTimeout<T>(promise: Promise<T>, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => {
        reject(Object.assign(new Error(`${operation} timed out.`), { code: 'auth/request-timeout' }));
      }, FIREBASE_REQUEST_TIMEOUT_MS);
    })
  ]);
}

function createAuthError(code: string, message: string): Error & { code: string } {
  return Object.assign(new Error(message), { code });
}

export function normalizeStudentId(studentId: string): string {
  return studentId.trim().toLowerCase().replace(/\s+/g, '');
}

function localProfileKey(studentId: string): string {
  const cleanId = normalizeStudentId(studentId);
  return `student_profile_${cleanId}`;
}

function normalizeEmail(email?: string): string {
  return (email || '').trim().toLowerCase();
}

function maskEmail(email: string): string {
  const normalized = normalizeEmail(email);
  const [localPart, domain] = normalized.split('@');
  if (!localPart || !domain) return normalized;
  if (localPart.length <= 2) return `${localPart[0] || '*'}***@${domain}`;
  return `${localPart.slice(0, 2)}***@${domain}`;
}

function getLocalStudentProfilesCache(): StudentProfile[] {
  try {
    const stored = localStorage.getItem('local_students_fallback');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistLocalStudentProfilesCache(profiles: StudentProfile[]): void {
  localStorage.setItem('local_students_fallback', JSON.stringify(profiles));
}

function upsertLocalStudentProfile(profile: StudentProfile): void {
  const cleanId = normalizeStudentId(profile.studentId);
  const profiles = getLocalStudentProfilesCache();
  const existingIndex = profiles.findIndex((item) => {
    return normalizeStudentId(item.studentId) === cleanId || normalizeEmail(item.email) === normalizeEmail(profile.email);
  });

  if (existingIndex >= 0) {
    profiles[existingIndex] = { ...profiles[existingIndex], ...profile };
  } else {
    profiles.push(profile);
  }

  persistLocalStudentProfilesCache(profiles);
  localStorage.setItem(localProfileKey(cleanId), JSON.stringify(profile));
}

function removeLocalStudentProfile(studentId: string): void {
  const cleanId = normalizeStudentId(studentId);
  const profiles = getLocalStudentProfilesCache().filter((item) => normalizeStudentId(item.studentId) !== cleanId);
  persistLocalStudentProfilesCache(profiles);
  localStorage.removeItem(localProfileKey(cleanId));
}

function saveLocalAuthSession(profile: StudentProfile): void {
  localStorage.setItem(LOCAL_AUTH_SESSION_KEY, JSON.stringify(profile));
}

export function getLocalAuthSession(): StudentProfile | null {
  try {
    const stored = localStorage.getItem(LOCAL_AUTH_SESSION_KEY);
    return stored ? JSON.parse(stored) as StudentProfile : null;
  } catch {
    return null;
  }
}

function clearLocalAuthSession(): void {
  localStorage.removeItem(LOCAL_AUTH_SESSION_KEY);
}

function toPublicProfile(profile: StoredStudentProfile): StudentProfile {
  const { passwordHash, passwordSalt, ...publicProfile } = profile;
  return publicProfile;
}

function getStudentDocRef(studentId: string) {
  return doc(db, 'students', normalizeStudentId(studentId));
}

async function createPasswordHash(password: string, saltBase64?: string): Promise<{ passwordHash: string; passwordSalt: string }> {
  const saltBytes = saltBase64
    ? Uint8Array.from(atob(saltBase64), (char) => char.charCodeAt(0))
    : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  const hashBytes = new Uint8Array(derivedBits);
  const passwordHash = btoa(String.fromCharCode(...hashBytes));
  const passwordSalt = saltBase64 || btoa(String.fromCharCode(...saltBytes));
  return { passwordHash, passwordSalt };
}

function createLocalStudentProfile(
  studentId: string,
  password: string,
  name: string,
  classSection: string,
  school: string,
  options: RegisterStudentAccountOptions = {}
): StudentProfile {
  const cleanId = normalizeStudentId(studentId);
  const profileEmail = normalizeEmail(options.email) || studentIdToEmail(cleanId);
  if (localStorage.getItem(localProfileKey(cleanId))) {
    throw createAuthError('auth/email-already-in-use', `User ID "${cleanId}" is already registered.`);
  }
  const status = options.status ?? 'pending';
  const isApproved = options.isApproved ?? (status === 'approved');

  const profile: StudentProfile = {
    uid: cleanId,
    studentId: cleanId,
    name: name.trim() || cleanId,
    email: profileEmail,
    classSection,
    school,
    role: 'student',
    xp: 0,
    streakDays: 1,
    completedLevelsCount: 0,
    completedLevels: [],
    lastActive: new Date().toISOString().split('T')[0],
    unlockedBadges: [],
    isApproved,
    status,
    initialPassword: password
  };

  upsertLocalStudentProfile(profile);
  return profile;
}

export function assertProfileCanAccess(profile: StudentProfile): StudentProfile {
  if (profile.status === 'rejected' || profile.isApproved === false) {
    throw new Error('ACCOUNT_REJECTED');
  }

  if (profile.status === 'pending' && profile.role === 'student') {
    throw new Error('ACCOUNT_PENDING_APPROVAL');
  }

  return profile;
}

// Register a new student account
export async function registerStudentAccount(
  studentId: string,
  password: string,
  name: string,
  classSection: string = '10-A',
  school: string = 'Karma Academy',
  role: 'student' | 'teacher' = 'student',
  options: RegisterStudentAccountOptions = {}
): Promise<StudentProfile> {
  if (role !== 'student') {
    throw new Error('TEACHER_REGISTRATION_DISABLED');
  }

  const cleanId = normalizeStudentId(studentId);
  const requestedEmail = normalizeEmail(options.email);
  const profileEmail = requestedEmail || studentIdToEmail(cleanId);

  // First, try to check remote Firestore for an existing account.
  // We only treat local profiles as authoritative when the remote check cannot be performed.
  let remoteAvailable = false;
  try {
    const existingSnap = await withFirebaseTimeout(getDoc(getStudentDocRef(cleanId)), 'Checking existing account');
    remoteAvailable = true;
    if (existingSnap.exists()) {
      throw createAuthError('auth/email-already-in-use', `User ID "${cleanId}" is already registered.`);
    }
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code?: string }).code === 'auth/email-already-in-use') {
      throw err;
    }
    console.warn('Remote account check failed (network/offline). remoteAvailable=', remoteAvailable, err);
  }

  // If a local profile exists but the remote was reachable and showed no account,
  // the local entry is stale (leftover). Remove it and continue with registration.
  try {
    const localStored = localStorage.getItem(localProfileKey(cleanId));
    if (localStored) {
      if (remoteAvailable) {
        console.info('Removing stale local profile for', cleanId);
        removeLocalStudentProfile(cleanId);
      } else {
        // Remote not reachable: preserve previous behavior and fail registration to avoid conflicts.
        throw createAuthError('auth/email-already-in-use', `User ID "${cleanId}" is already registered.`);
      }
    }
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && (e as { code?: string }).code === 'auth/email-already-in-use') {
      throw e;
    }
  }

  const status = options.status ?? 'pending';
  const isApproved = options.isApproved ?? (status === 'approved');
  const { passwordHash, passwordSalt } = await createPasswordHash(password);

  const profile: StudentProfile = {
    uid: cleanId,
    studentId: cleanId,
    name: name.trim() || cleanId,
    email: profileEmail,
    classSection,
    school,
    role: 'student',
    xp: 0,
    streakDays: 1,
    completedLevelsCount: 0,
    completedLevels: [],
    lastActive: new Date().toISOString().split('T')[0],
    unlockedBadges: [],
    isApproved,
    status,
    initialPassword: password
  };

  const storedProfile: StoredStudentProfile = {
    ...profile,
    passwordHash,
    passwordSalt
  };

  try {
    await withFirebaseTimeout(setDoc(getStudentDocRef(cleanId), storedProfile), 'Saving student profile');
  } catch (err) {
    if (!USE_LOCAL_AUTH_FALLBACK) {
      throw err;
    }
    console.warn('Firestore student registration unavailable, keeping local profile for offline use:', err);
  }

  upsertLocalStudentProfile(profile);
  return profile;
}

// Login student or teacher
export async function loginUser(studentIdOrEmail: string, password: string): Promise<StudentProfile | null> {
  const cleanId = normalizeStudentId(studentIdOrEmail);

  if ((cleanId === 'teacher.guna' || cleanId === 'teacher' || cleanId === 'educator') && password) {
    const teacherProfile: StudentProfile = {
      uid: cleanId,
      studentId: cleanId,
      name: 'Tshewang Norbu (ICT Educator)',
      email: 'teacher@karma.edu.bt',
      classSection: '10-A & 10-B',
      school: 'Karma Academy',
      role: 'teacher',
      xp: 2500,
      streakDays: 30,
      completedLevelsCount: 15,
      lastActive: new Date().toISOString().split('T')[0],
      unlockedBadges: ['welcome_badge', 'teacher_badge'],
      isApproved: true,
      status: 'approved',
      initialPassword: password
    };

    const stored = localStorage.getItem(localProfileKey(cleanId));
    if (!stored) {
      upsertLocalStudentProfile(teacherProfile);
      try {
        const { passwordHash, passwordSalt } = await createPasswordHash(password);
        const storedTeacherProfile: StoredStudentProfile = {
          ...teacherProfile,
          passwordHash,
          passwordSalt
        };
        await withFirebaseTimeout(setDoc(getStudentDocRef(cleanId), storedTeacherProfile), 'Creating teacher account');
      } catch (err) {
        console.warn('Teacher account remote save failed, using local session only:', err);
      }
    }

    saveLocalAuthSession(teacherProfile);
    return teacherProfile;
  }

  const stored = localStorage.getItem(localProfileKey(cleanId));
  let profileRecord: StoredStudentProfile | null = stored ? JSON.parse(stored) as StoredStudentProfile : null;

  try {
    const docRef = getStudentDocRef(cleanId);
    const docSnap = await withFirebaseTimeout(getDoc(docRef), 'Loading account profile');
    if (docSnap.exists()) {
      profileRecord = docSnap.data() as StoredStudentProfile;
    }
  } catch (error) {
    console.warn('Remote profile lookup failed, using local fallback:', error);
  }

  if (!profileRecord) {
    throw createAuthError('auth/user-not-found', `Account not found for User ID "${cleanId}".`);
  }

  const profile = toPublicProfile(profileRecord);
  try {
    assertProfileCanAccess(profile);
  } catch (error) {
    throw error;
  }

  if (profileRecord.passwordHash && profileRecord.passwordSalt) {
    const { passwordHash } = await createPasswordHash(password, profileRecord.passwordSalt);
    if (passwordHash !== profileRecord.passwordHash) {
      throw createAuthError('auth/wrong-password', 'Incorrect password.');
    }
  } else if (profile.initialPassword && profile.initialPassword !== password) {
    throw createAuthError('auth/wrong-password', 'Incorrect password.');
  }

  const today = new Date().toISOString().split('T')[0];
  const updatedProfile = {
    ...profile,
    lastActive: today
  };

  try {
    await withFirebaseTimeout(updateDoc(getStudentDocRef(cleanId), { lastActive: today }), 'Updating last active date');
  } catch (err) {
    console.warn('Remote last-active update failed:', err);
  }

  upsertLocalStudentProfile(updatedProfile as StudentProfile);
  saveLocalAuthSession(updatedProfile);
  return updatedProfile;
}

// Approve student account
export async function approveStudentAccount(uid: string): Promise<void> {
  const cleanId = normalizeStudentId(uid);

  // Always update localStorage first (works offline)
  let updatedProfile: StudentProfile | null = null;
  try {
    const profiles = getLocalStudentProfilesCache();
    const existing = profiles.find((p) => normalizeStudentId(p.studentId) === cleanId || normalizeStudentId(p.uid) === cleanId);
    
    if (existing) {
      updatedProfile = { ...existing, isApproved: true, status: 'approved' as const };
    } else {
      try {
        const snap = await getDoc(doc(db, 'students', cleanId));
        if (snap.exists()) {
          updatedProfile = { ...(snap.data() as StudentProfile), isApproved: true, status: 'approved' as const };
        }
      } catch (dbErr) {
        console.warn('Could not fetch existing student for local update, constructing fallback:', dbErr);
      }
      if (!updatedProfile) {
        updatedProfile = {
          uid: cleanId,
          studentId: cleanId,
          name: cleanId,
          email: `${cleanId}@education.gov.bt`,
          classSection: '10-A',
          school: 'Karma Academy',
          role: 'student',
          xp: 0,
          streakDays: 1,
          completedLevelsCount: 0,
          lastActive: new Date().toISOString().split('T')[0],
          unlockedBadges: [],
          isApproved: true,
          status: 'approved' as const
        };
      }
    }

    if (updatedProfile) {
      upsertLocalStudentProfile(updatedProfile);
    }
  } catch (localErr) {
    console.warn('Local profile update failed:', localErr);
  }

  // Attempt Firestore update using setDoc with merge: true so missing documents do not throw
  try {
    const docRef = doc(db, 'students', cleanId);
    await setDoc(docRef, { isApproved: true, status: 'approved' }, { merge: true });
  } catch (err) {
    console.warn('Firestore setDoc approve update failed:', err);
  }
}

// Reject student account
export async function rejectStudentAccount(uid: string): Promise<void> {
  const cleanId = normalizeStudentId(uid);

  // Always update localStorage first (works offline)
  let updatedProfile: StudentProfile | null = null;
  try {
    const profiles = getLocalStudentProfilesCache();
    const existing = profiles.find((p) => normalizeStudentId(p.studentId) === cleanId || normalizeStudentId(p.uid) === cleanId);
    
    if (existing) {
      updatedProfile = { ...existing, isApproved: false, status: 'rejected' as const };
    } else {
      try {
        const snap = await getDoc(doc(db, 'students', cleanId));
        if (snap.exists()) {
          updatedProfile = { ...(snap.data() as StudentProfile), isApproved: false, status: 'rejected' as const };
        }
      } catch (dbErr) {
        console.warn('Could not fetch existing student for local update, constructing fallback:', dbErr);
      }
      if (!updatedProfile) {
        updatedProfile = {
          uid: cleanId,
          studentId: cleanId,
          name: cleanId,
          email: `${cleanId}@education.gov.bt`,
          classSection: '10-A',
          school: 'Karma Academy',
          role: 'student',
          xp: 0,
          streakDays: 1,
          completedLevelsCount: 0,
          lastActive: new Date().toISOString().split('T')[0],
          unlockedBadges: [],
          isApproved: false,
          status: 'rejected' as const
        };
      }
    }

    if (updatedProfile) {
      upsertLocalStudentProfile(updatedProfile);
    }
  } catch (localErr) {
    console.warn('Local profile rejection failed:', localErr);
  }

  // Attempt Firestore update using setDoc with merge: true so missing documents do not throw
  try {
    const docRef2 = doc(db, 'students', cleanId);
    await setDoc(docRef2, { isApproved: false, status: 'rejected' }, { merge: true });
  } catch (err) {
    console.warn('Firestore setDoc reject update failed:', err);
  }
}

// Save/Sync student progress
export async function syncStudentProfile(uid: string, updates: Partial<StudentProfile>): Promise<void> {
  const docRef = doc(db, 'students', uid);
  await updateDoc(docRef, {
    ...updates,
    lastActive: new Date().toISOString().split('T')[0]
  });
}

// Subscribe to real-time student profile
export function subscribeToStudentProfile(uid: string, callback: (profile: StudentProfile | null) => void) {
  const docRef = doc(db, 'students', uid);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as StudentProfile);
    } else {
      callback(null);
    }
  }, (error) => {
    console.warn('Student profile snapshot error, using local fallback:', error);
    try {
      const stored = localStorage.getItem(localProfileKey(uid));
      callback(stored ? JSON.parse(stored) as StudentProfile : null);
    } catch {
      callback(null);
    }
  });
}

// Fetch all students for Teacher Portal
export async function fetchAllStudents(): Promise<StudentProfile[]> {
  const list: StudentProfile[] = [];
  try {
    const querySnap = await getDocs(collection(db, 'students'));
    querySnap.forEach((doc) => {
      list.push(doc.data() as StudentProfile);
    });
  } catch (error) {
    console.warn('Unable to fetch remote students, using local fallback:', error);
  }

  const localProfiles = getLocalStudentProfilesCache();
  const byId = new Map<string, StudentProfile>();
  list.forEach((profile) => byId.set(normalizeStudentId(profile.studentId), profile));
  localProfiles.forEach((profile) => {
    if (profile.role !== 'teacher') {
      byId.set(normalizeStudentId(profile.studentId), { ...byId.get(normalizeStudentId(profile.studentId)), ...profile });
    }
  });

  return Array.from(byId.values()).sort((a, b) => (b.xp || 0) - (a.xp || 0));
}

// Subscribe to real-time class leaderboard rankings
export function subscribeToAllStudents(callback: (students: StudentProfile[]) => void) {
  const q = query(collection(db, 'students'));
  return onSnapshot(q, (snapshot) => {
    const list: StudentProfile[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as StudentProfile);
    });

    const localProfiles = getLocalStudentProfilesCache();
    const byId = new Map<string, StudentProfile>();
    list.forEach((profile) => byId.set(normalizeStudentId(profile.studentId), profile));
    localProfiles.forEach((profile) => {
      if (profile.role !== 'teacher') {
        const key = normalizeStudentId(profile.studentId);
        if (list.length === 0 || byId.has(key)) {
          byId.set(key, { ...byId.get(key), ...profile });
        }
      }
    });

    const mergedList = Array.from(byId.values()).sort((a, b) => (b.xp || 0) - (a.xp || 0));
    callback(mergedList);
  }, (error) => {
    console.warn('Leaderboard snapshot error, using local fallback:', error);
    try {
      const parsed = getLocalStudentProfilesCache();
      callback(parsed.sort((a, b) => (b.xp || 0) - (a.xp || 0)));
    } catch {
      callback([]);
    }
  });
}

// Get merged students synchronously from local cache (no Firestore dependency)
export function getMergedStudentsSync(): StudentProfile[] {
  try {
    const localProfiles = getLocalStudentProfilesCache();
    return localProfiles.filter(p => p.role !== 'teacher').sort((a, b) => (b.xp || 0) - (a.xp || 0));
  } catch {
    return [];
  }
}

// Sign out
export async function logoutUser() {
  await signOut(auth);
}

// Submit a new classroom help request from student
export async function submitClassroomHelpRequest(
  data: Omit<ClassroomHelpRequest, 'id' | 'timestamp' | 'status'>
): Promise<ClassroomHelpRequest> {
  const reqId = `help_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const request: ClassroomHelpRequest = {
    ...data,
    id: reqId,
    timestamp: Date.now(),
    status: 'pending',
  };

  try {
    await setDoc(doc(db, 'classroom_help_requests', reqId), request);
  } catch (err) {
    console.warn("Firestore error saving help request (saving local fallback):", err);
  }

  // Save to localStorage fallback
  try {
    const existing: ClassroomHelpRequest[] = JSON.parse(localStorage.getItem('classroom_help_requests') || '[]');
    existing.unshift(request);
    localStorage.setItem('classroom_help_requests', JSON.stringify(existing));
  } catch (e) {}

  return request;
}

// Subscribe to real-time classroom help requests
export function subscribeToHelpRequests(callback: (requests: ClassroomHelpRequest[]) => void) {
  const q = query(collection(db, 'classroom_help_requests'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: ClassroomHelpRequest[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as ClassroomHelpRequest);
      });
      list.sort((a, b) => b.timestamp - a.timestamp);
      callback(list);
    },
    (error) => {
      console.warn("Help requests snapshot error, loading local fallback:", error);
      try {
        const existing: ClassroomHelpRequest[] = JSON.parse(localStorage.getItem('classroom_help_requests') || '[]');
        callback(existing);
      } catch (e) {
        callback([]);
      }
    }
  );
}

// Respond to a classroom help request
export async function respondToHelpRequest(
  requestId: string,
  teacherResponse: string,
  respondedBy: string = 'Teacher'
): Promise<void> {
  const docRef = doc(db, 'classroom_help_requests', requestId);
  const updates = {
    status: 'resolved' as const,
    teacherResponse: teacherResponse.trim(),
    respondedAt: Date.now(),
    respondedBy: respondedBy,
  };

  try {
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn("Firestore update help request failed, updating local state:", err);
  }

  // Update local storage fallback
  try {
    const existing: ClassroomHelpRequest[] = JSON.parse(localStorage.getItem('classroom_help_requests') || '[]');
    const idx = existing.findIndex((r) => r.id === requestId);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], ...updates };
      localStorage.setItem('classroom_help_requests', JSON.stringify(existing));
    }
  } catch (e) {}
}

// Delete or dismiss a help request
export async function deleteHelpRequest(requestId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'classroom_help_requests', requestId));
  } catch (err) {
    console.warn("Error deleting help request from Firestore:", err);
  }

  try {
    const existing: ClassroomHelpRequest[] = JSON.parse(localStorage.getItem('classroom_help_requests') || '[]');
    const filtered = existing.filter((r) => r.id !== requestId);
    localStorage.setItem('classroom_help_requests', JSON.stringify(filtered));
  } catch (e) {}
}

// ------------------- STUDY ROOM PRESENCE & COMMUNITY CHEERS -------------------

// Update or register active presence heartbeat
export async function updateStudentPresence(session: Omit<ActiveStudentSession, 'lastSeenTimestamp'>): Promise<void> {
  const sessionId = session.id || `session_${session.studentName.toLowerCase().replace(/\s+/g, '_')}`;
  const docRef = doc(db, 'active_sessions', sessionId);
  const data: ActiveStudentSession = {
    ...session,
    id: sessionId,
    lastSeenTimestamp: Date.now()
  };

  try {
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    console.warn("Firestore presence setDoc failed, saving to local state:", err);
  }

  // Backup to localStorage
  try {
    const localSessions: ActiveStudentSession[] = JSON.parse(localStorage.getItem('guna_active_sessions') || '[]');
    const existingIdx = localSessions.findIndex(s => s.id === sessionId);
    if (existingIdx !== -1) {
      localSessions[existingIdx] = data;
    } else {
      localSessions.push(data);
    }
    localStorage.setItem('guna_active_sessions', JSON.stringify(localSessions));
  } catch (e) {}
}

// Real-time subscription to online active students (active within last 10 minutes)
export function subscribeToActiveStudents(callback: (sessions: ActiveStudentSession[]) => void): () => void {
  const colRef = collection(db, 'active_sessions');

  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const now = Date.now();
    const activeList: ActiveStudentSession[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as ActiveStudentSession;
      // Filter sessions updated within last 10 minutes (600,000 ms)
      if (data.lastSeenTimestamp && now - data.lastSeenTimestamp < 600000) {
        activeList.push({ ...data, id: docSnap.id });
      }
    });

    // Sort by recent activity
    activeList.sort((a, b) => b.lastSeenTimestamp - a.lastSeenTimestamp);
    callback(activeList);
  }, (err) => {
    console.warn("Error subscribing to active_sessions snapshot:", err);
    // Fallback to localStorage
    try {
      const localSessions: ActiveStudentSession[] = JSON.parse(localStorage.getItem('guna_active_sessions') || '[]');
      const now = Date.now();
      const valid = localSessions.filter(s => now - s.lastSeenTimestamp < 600000);
      callback(valid);
    } catch (e) {
      callback([]);
    }
  });

  return unsubscribe;
}

// Send a short cheer / encouragement message to a fellow student
export async function sendCommunityCheer(
  senderName: string,
  recipientName: string,
  cheerText: string,
  emoji: string = '⚡'
): Promise<CommunityCheer> {
  const cheerId = `cheer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const cheer: CommunityCheer = {
    id: cheerId,
    senderName: senderName.trim(),
    recipientName: recipientName.trim(),
    cheerText: cheerText.trim(),
    emoji: emoji,
    timestamp: Date.now()
  };

  try {
    await setDoc(doc(db, 'community_cheers', cheerId), cheer);
  } catch (err) {
    console.warn("Firestore send cheer failed, storing locally:", err);
  }

  // Backup to localStorage
  try {
    const localCheers: CommunityCheer[] = JSON.parse(localStorage.getItem('guna_community_cheers') || '[]');
    localCheers.unshift(cheer);
    localStorage.setItem('guna_community_cheers', JSON.stringify(localCheers.slice(0, 50)));
  } catch (e) {}

  return cheer;
}

// Subscribe to community cheers real-time feed
export function subscribeToCommunityCheers(callback: (cheers: CommunityCheer[]) => void): () => void {
  const colRef = collection(db, 'community_cheers');

  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const list: CommunityCheer[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as CommunityCheer);
    });
    list.sort((a, b) => b.timestamp - a.timestamp);
    callback(list.slice(0, 30));
  }, (err) => {
    console.warn("Error subscribing to community_cheers snapshot:", err);
    try {
      const localCheers: CommunityCheer[] = JSON.parse(localStorage.getItem('guna_community_cheers') || '[]');
      callback(localCheers);
    } catch (e) {
      callback([]);
    }
  });

  return unsubscribe;
}

// Initial Mock Peer Review Requests for offline/fallback
export const INITIAL_PEER_REVIEW_REQUESTS: PeerReviewRequest[] = [
  {
    id: 'pr_1',
    studentName: 'Tashi Dorji',
    classSection: '10-A',
    schoolName: 'Karma Academy',
    projectTitle: 'BMI Calculator with Exception Handling',
    codeSnippet: `def calculate_bmi(weight, height):\n    try:\n        bmi = weight / (height ** 2)\n        return round(bmi, 2)\n    except ZeroDivisionError:\n        print("Height cannot be zero!")\n        return None\n\nprint("BMI:", calculate_bmi(65, 1.75))`,
    description: 'Looking for peer feedback! Is my try-except block sufficient or should I also validate negative inputs?',
    timestamp: Date.now() - 3600000 * 4,
    status: 'reviewed',
    reviews: [
      {
        id: 'fb_1',
        reviewerName: 'Dechen Zangmo',
        classSection: '10-B',
        feedbackText: 'Great code Tashi! The try-except handles division by zero perfectly. To handle negative numbers, you can add an `if height <= 0:` check before calculating.',
        sentimentScore: 'constructive',
        scorePercentage: 98,
        sentimentReason: 'Encouraging tone with specific, actionable Python code logic suggestion.',
        isConstructive: true,
        timestamp: Date.now() - 3600000 * 2,
        helpfulCount: 4,
        teacherEndorsed: true
      }
    ]
  },
  {
    id: 'pr_2',
    studentName: 'Sonam Penjor',
    classSection: '10-A',
    schoolName: 'Karma Academy',
    projectTitle: 'Dzongkha Vocabulary Quiz in Python',
    codeSnippet: `score = 0\nq1 = input("What is Suja in English? ")\nif q1.lower() == "butter tea":\n    score += 1\n    print("Legshom!")\nelse:\n    print("Try again!")\nprint("Final Score:", score)`,
    description: 'Can someone review my string matching logic? How can I allow multiple spelling variations for Suja?',
    timestamp: Date.now() - 3600000 * 8,
    status: 'open',
    reviews: []
  }
];

// Create a new Peer Review Request
export async function createPeerReviewRequest(requestData: Omit<PeerReviewRequest, 'id' | 'timestamp' | 'status' | 'reviews'>): Promise<PeerReviewRequest> {
  const reqId = `pr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newRequest: PeerReviewRequest = {
    ...requestData,
    id: reqId,
    timestamp: Date.now(),
    status: 'open',
    reviews: []
  };

  try {
    await setDoc(doc(db, 'peer_review_requests', reqId), newRequest);
  } catch (err) {
    console.warn("Firestore create peer review request failed, saving locally:", err);
  }

  // Backup locally
  try {
    const localReqs: PeerReviewRequest[] = JSON.parse(localStorage.getItem('guna_peer_review_requests') || '[]');
    localReqs.unshift(newRequest);
    localStorage.setItem('guna_peer_review_requests', JSON.stringify(localReqs));
  } catch (e) {}

  return newRequest;
}

// Add Feedback to a Peer Review Request
export async function addPeerReviewFeedback(
  requestId: string, 
  feedback: Omit<PeerReviewFeedback, 'id' | 'timestamp' | 'helpfulCount'>
): Promise<PeerReviewFeedback> {
  const fbId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newFeedback: PeerReviewFeedback = {
    ...feedback,
    id: fbId,
    timestamp: Date.now(),
    helpfulCount: 0
  };

  try {
    const docRef = doc(db, 'peer_review_requests', requestId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const current = snap.data() as PeerReviewRequest;
      const updatedReviews = [...(current.reviews || []), newFeedback];
      await updateDoc(docRef, {
        reviews: updatedReviews,
        status: 'reviewed'
      });
    }
  } catch (err) {
    console.warn("Firestore add feedback failed, updating locally:", err);
  }

  // Local storage update
  try {
    const localReqs: PeerReviewRequest[] = JSON.parse(localStorage.getItem('guna_peer_review_requests') || JSON.stringify(INITIAL_PEER_REVIEW_REQUESTS));
    const target = localReqs.find(r => r.id === requestId);
    if (target) {
      target.reviews = [...(target.reviews || []), newFeedback];
      target.status = 'reviewed';
      localStorage.setItem('guna_peer_review_requests', JSON.stringify(localReqs));
    }
  } catch (e) {}

  return newFeedback;
}

// Vote a feedback as helpful
export async function voteFeedbackHelpful(requestId: string, feedbackId: string): Promise<void> {
  try {
    const docRef = doc(db, 'peer_review_requests', requestId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const current = snap.data() as PeerReviewRequest;
      const updated = (current.reviews || []).map(f => f.id === feedbackId ? { ...f, helpfulCount: (f.helpfulCount || 0) + 1 } : f);
      await updateDoc(docRef, { reviews: updated });
    }
  } catch (err) {
    console.warn("Firestore vote helpful failed:", err);
  }
}

// Toggle Teacher Endorsement
export async function toggleTeacherEndorsement(requestId: string, feedbackId: string): Promise<void> {
  try {
    const docRef = doc(db, 'peer_review_requests', requestId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const current = snap.data() as PeerReviewRequest;
      const updated = (current.reviews || []).map(f => f.id === feedbackId ? { ...f, teacherEndorsed: !f.teacherEndorsed } : f);
      await updateDoc(docRef, { reviews: updated });
    }
  } catch (err) {
    console.warn("Firestore endorsement failed:", err);
  }
}

// Delete a peer review request
export async function deletePeerReviewRequest(requestId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'peer_review_requests', requestId));
  } catch (err) {
    console.warn("Firestore delete request failed:", err);
  }
}

// Subscribe to real-time peer review requests
export function subscribeToPeerReviewRequests(callback: (requests: PeerReviewRequest[]) => void): () => void {
  const colRef = collection(db, 'peer_review_requests');

  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const list: PeerReviewRequest[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as PeerReviewRequest);
    });

    if (list.length === 0) {
      // Seed with initial mock if empty
      callback(INITIAL_PEER_REVIEW_REQUESTS);
    } else {
      list.sort((a, b) => b.timestamp - a.timestamp);
      callback(list);
    }
  }, (err) => {
    console.warn("Error subscribing to peer_review_requests snapshot:", err);
    try {
      const localReqs: PeerReviewRequest[] = JSON.parse(localStorage.getItem('guna_peer_review_requests') || JSON.stringify(INITIAL_PEER_REVIEW_REQUESTS));
      callback(localReqs);
    } catch (e) {
      callback(INITIAL_PEER_REVIEW_REQUESTS);
    }
  });

  return unsubscribe;
}

export async function logoutStudent(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn("Sign out failed:", err);
  }
  clearLocalAuthSession();
}

export async function resetStudentPassword(studentIdOrUid: string, newPassword: string): Promise<void> {
  const cleanId = normalizeStudentId(studentIdOrUid);
  const { passwordHash, passwordSalt } = await createPasswordHash(newPassword);

  try {
    const q1 = query(collection(db, 'students'), where('studentId', '==', cleanId));
    const q2 = query(collection(db, 'students'), where('uid', '==', cleanId));
    const [snap1, snap2] = await Promise.all([
      getDocs(q1).catch(() => null),
      getDocs(q2).catch(() => null)
    ]);

    const docsToUpdate = new Set<any>();
    if (snap1 && !snap1.empty) snap1.docs.forEach((d) => docsToUpdate.add(d.ref));
    if (snap2 && !snap2.empty) snap2.docs.forEach((d) => docsToUpdate.add(d.ref));

    if (docsToUpdate.size > 0) {
      await Promise.all(Array.from(docsToUpdate).map((ref) => setDoc(ref, { passwordHash, passwordSalt, initialPassword: newPassword }, { merge: true })));
    } else {
      const docRef = getStudentDocRef(cleanId);
      await setDoc(docRef, { passwordHash, passwordSalt, initialPassword: newPassword }, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore password reset warning:", err);
  }

  try {
    const stored = localStorage.getItem(localProfileKey(cleanId));
    if (stored) {
      const p = JSON.parse(stored);
      p.initialPassword = newPassword;
      p.passwordHash = passwordHash;
      p.passwordSalt = passwordSalt;
      localStorage.setItem(localProfileKey(cleanId), JSON.stringify(p));
    }

    const localStudents = getLocalStudentProfilesCache();
    const updatedLocal = localStudents.map((s) => {
      if (normalizeStudentId(s.studentId) === cleanId || (s.uid && normalizeStudentId(s.uid) === cleanId)) {
        return { ...s, initialPassword: newPassword, passwordHash, passwordSalt };
      }
      return s;
    });
    persistLocalStudentProfilesCache(updatedLocal);
  } catch (e) {}
}

async function findStudentByIdOrEmail(studentIdOrEmail: string): Promise<StudentProfile | null> {
  const rawInput = studentIdOrEmail.trim();
  const cleanId = normalizeStudentId(rawInput);
  const cleanEmail = normalizeEmail(rawInput);

  if (USE_LOCAL_AUTH_FALLBACK) {
    const localById = localStorage.getItem(localProfileKey(cleanId));
    if (localById) {
      return JSON.parse(localById) as StudentProfile;
    }
    if (cleanEmail.includes('@')) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith('student_profile_')) continue;
        const value = localStorage.getItem(key);
        if (!value) continue;
        const profile = JSON.parse(value) as StudentProfile;
        if (normalizeEmail(profile.email) === cleanEmail) {
          return profile;
        }
      }
    }
    return null;
  }

  const docRef = getStudentDocRef(cleanId);
  const docSnap = await withFirebaseTimeout(getDoc(docRef), 'Loading account profile');
  if (docSnap.exists()) {
    return toPublicProfile(docSnap.data() as StoredStudentProfile);
  }

  const byIdQuery = query(collection(db, 'students'), where('studentId', '==', cleanId));
  const byIdSnap = await withFirebaseTimeout(getDocs(byIdQuery), 'Searching account by student ID');
  if (!byIdSnap.empty) {
    return toPublicProfile(byIdSnap.docs[0].data() as StoredStudentProfile);
  }

  if (cleanEmail.includes('@')) {
    const byEmailQuery = query(collection(db, 'students'), where('email', '==', cleanEmail));
    const byEmailSnap = await withFirebaseTimeout(getDocs(byEmailQuery), 'Searching account by email');
    if (!byEmailSnap.empty) {
      return toPublicProfile(byEmailSnap.docs[0].data() as StoredStudentProfile);
    }
  }

  return null;
}

export async function sendStudentPasswordResetLink(studentIdOrEmail: string): Promise<{ emailMasked: string }> {
  const profile = await findStudentByIdOrEmail(studentIdOrEmail);

  if (!profile) {
    throw createAuthError('auth/user-not-found', 'No account found for the provided User ID.');
  }

  if (profile.role !== 'student') {
    throw createAuthError('auth/operation-not-allowed', 'Password reset link is only available for student accounts.');
  }

  const email = normalizeEmail(profile.email);
  if (!email || !email.includes('@')) {
    throw createAuthError('auth/invalid-credential', 'No valid recovery email is registered for this account.');
  }

  if (USE_LOCAL_AUTH_FALLBACK) {
    throw createAuthError('auth/operation-not-allowed', 'Email reset links are unavailable in local development mode.');
  }

  await withFirebaseTimeout(sendPasswordResetEmail(auth, email), 'Sending password reset email');
  return { emailMasked: maskEmail(email) };
}

export async function updateStudentDisplayName(studentIdOrUid: string, newName: string): Promise<void> {
  const cleanId = normalizeStudentId(studentIdOrUid);
  const trimmedName = newName.trim();
  if (!trimmedName) return;

  let remoteError: unknown = null;

  try {
    const q = query(collection(db, 'students'), where('studentId', '==', cleanId));
    const querySnap = await getDocs(q);

    if (!querySnap.empty) {
      await Promise.all(querySnap.docs.map((docSnap) => updateDoc(docSnap.ref, { name: trimmedName })));
    } else {
      await updateDoc(getStudentDocRef(cleanId), { name: trimmedName });
    }
  } catch (err) {
    console.warn('Firestore student name update warning:', err);
    remoteError = err;
  }

  try {
    const stored = localStorage.getItem(localProfileKey(cleanId));
    if (stored) {
      const profile = JSON.parse(stored);
      profile.name = trimmedName;
      localStorage.setItem(localProfileKey(cleanId), JSON.stringify(profile));
    }

    const activeSession = getLocalAuthSession();
    if (activeSession && normalizeStudentId(activeSession.studentId) === cleanId) {
      saveLocalAuthSession({ ...activeSession, name: trimmedName });
    }
  } catch (e) {}

  if (remoteError) {
    throw remoteError;
  }
}


export async function updateStudentProfileSettings(
  studentIdOrUid: string,
  updates: Partial<Pick<StudentProfile, 'name' | 'classSection' | 'school' | 'profilePhotoDataUrl'>>
): Promise<void> {
  const cleanId = normalizeStudentId(studentIdOrUid);
  const cleanedUpdates: Partial<StudentProfile> = {};

  if (typeof updates.name === 'string') {
    cleanedUpdates.name = updates.name.trim();
  }
  if (typeof updates.classSection === 'string') {
    cleanedUpdates.classSection = updates.classSection.trim();
  }
  if (typeof updates.school === 'string') {
    cleanedUpdates.school = updates.school.trim();
  }
  if (typeof updates.profilePhotoDataUrl === 'string') {
    cleanedUpdates.profilePhotoDataUrl = updates.profilePhotoDataUrl;
  }

  let remoteError: unknown = null;

  try {
    const q = query(collection(db, 'students'), where('studentId', '==', cleanId));
    const querySnap = await getDocs(q);

    if (!querySnap.empty) {
      await Promise.all(querySnap.docs.map((docSnap) => updateDoc(docSnap.ref, cleanedUpdates)));
    } else {
      await updateDoc(getStudentDocRef(cleanId), cleanedUpdates);
    }
  } catch (err) {
    console.warn('Firestore student profile update warning:', err);
    remoteError = err;
  }

  try {
    const stored = localStorage.getItem(localProfileKey(cleanId));
    if (stored) {
      const profile = JSON.parse(stored);
      const merged = { ...profile, ...cleanedUpdates };
      localStorage.setItem(localProfileKey(cleanId), JSON.stringify(merged));
    }

    const activeSession = getLocalAuthSession();
    if (activeSession && normalizeStudentId(activeSession.studentId) === cleanId) {
      saveLocalAuthSession({ ...activeSession, ...cleanedUpdates });
    }
  } catch (e) {}

  if (remoteError) {
    throw remoteError;
  }
}

export async function deleteStudentAccount(studentIdOrUid: string): Promise<void> {
  const cleanId = normalizeStudentId(studentIdOrUid);

  // 1. Always purge from local storage & cache first so UI responds immediately
  try {
    removeLocalStudentProfile(cleanId);
    localStorage.removeItem(localProfileKey(cleanId));

    const localStudents = getLocalStudentProfilesCache();
    const filteredStudents = localStudents.filter(
      (profile) => normalizeStudentId(profile.studentId) !== cleanId && (profile.uid ? normalizeStudentId(profile.uid) !== cleanId : true)
    );
    persistLocalStudentProfilesCache(filteredStudents);

    const activeSession = getLocalAuthSession();
    if (
      activeSession &&
      (normalizeStudentId(activeSession.studentId) === cleanId || (activeSession.uid && normalizeStudentId(activeSession.uid) === cleanId))
    ) {
      clearLocalAuthSession();
    }
  } catch (e) {
    console.warn('Local student profile deletion cleanup warning:', e);
  }

  // 2. Delete from Firestore database (doc ID, studentId field, or uid field)
  try {
    // Delete direct doc ref
    const docRef = getStudentDocRef(cleanId);
    await deleteDoc(docRef).catch(() => {});

    // Delete query matches
    const q1 = query(collection(db, 'students'), where('studentId', '==', cleanId));
    const q2 = query(collection(db, 'students'), where('uid', '==', cleanId));
    const [snap1, snap2] = await Promise.all([
      getDocs(q1).catch(() => null),
      getDocs(q2).catch(() => null)
    ]);

    const docsToDelete = new Set<any>();
    if (snap1 && !snap1.empty) snap1.docs.forEach((d) => docsToDelete.add(d.ref));
    if (snap2 && !snap2.empty) snap2.docs.forEach((d) => docsToDelete.add(d.ref));

    if (docsToDelete.size > 0) {
      await Promise.all(Array.from(docsToDelete).map((ref) => deleteDoc(ref).catch(() => {})));
    }
  } catch (err) {
    console.warn('Firestore student delete warning (local deletion succeeded):', err);
  }
}

// Co-Learn Pair Programming Functions
export async function createCoLearnSession(data: {
  title: string;
  hostName: string;
  code: string;
  language?: string;
}): Promise<CoLearnSession> {
  const sessionId = `colearn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const session: CoLearnSession = {
    id: sessionId,
    title: data.title,
    hostName: data.hostName,
    code: data.code,
    language: data.language || 'python',
    status: 'active',
    lastUpdated: Date.now(),
  };

  try {
    await setDoc(doc(db, 'colearn_sessions', sessionId), session);
  } catch (err) {
    console.warn("Firestore co-learn create failed, using local storage fallback:", err);
  }

  try {
    const existing: CoLearnSession[] = JSON.parse(localStorage.getItem('guna_colearn_sessions') || '[]');
    existing.unshift(session);
    localStorage.setItem('guna_colearn_sessions', JSON.stringify(existing));
  } catch (e) {}

  return session;
}

export async function updateCoLearnSessionCode(sessionId: string, code: string, partnerName?: string): Promise<void> {
  const updates: any = { code, lastUpdated: Date.now() };
  if (partnerName) updates.partnerName = partnerName;

  try {
    await updateDoc(doc(db, 'colearn_sessions', sessionId), updates);
  } catch (err) {
    console.warn("Firestore co-learn update warning:", err);
  }

  try {
    const existing: CoLearnSession[] = JSON.parse(localStorage.getItem('guna_colearn_sessions') || '[]');
    const idx = existing.findIndex((s) => s.id === sessionId);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], ...updates };
      localStorage.setItem('guna_colearn_sessions', JSON.stringify(existing));
    }
  } catch (e) {}
}

export function subscribeToCoLearnSessions(callback: (sessions: CoLearnSession[]) => void): () => void {
  const colRef = collection(db, 'colearn_sessions');

  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const list: CoLearnSession[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as CoLearnSession);
    });
    list.sort((a, b) => b.lastUpdated - a.lastUpdated);
    callback(list);
  }, (err) => {
    console.warn("Error subscribing to colearn_sessions snapshot:", err);
    try {
      const localSessions: CoLearnSession[] = JSON.parse(localStorage.getItem('guna_colearn_sessions') || '[]');
      callback(localSessions);
    } catch (e) {
      callback([]);
    }
  });

  return unsubscribe;
}

// --- QUEST CHALLENGES FUNCTIONS ---
export const INITIAL_QUEST_CHALLENGES: QuestChallenge[] = [
  {
    id: 'qc_1',
    challengerUid: 'mock-1',
    challengerName: 'Tashi Dorji',
    challengerSchool: 'Karma Academy',
    challengerClass: '10-A',
    opponentUid: 'mock-6',
    opponentName: 'Dechen Zangmo',
    opponentSchool: 'Motithang HSS',
    opponentClass: '10-C',
    targetType: 'quest',
    targetId: 'cloud-types',
    targetTitle: 'Types of Cloud Services (IaaS, PaaS, SaaS)',
    status: 'completed',
    challengerTimeSeconds: 42,
    opponentTimeSeconds: 58,
    challengerScore: 100,
    opponentScore: 100,
    winnerUid: 'mock-1',
    winnerName: 'Tashi Dorji',
    createdAt: Date.now() - 3600000 * 5,
    completedAt: Date.now() - 3600000 * 3
  },
  {
    id: 'qc_2',
    challengerUid: 'mock-2',
    challengerName: 'Sonam Wangmo',
    challengerSchool: 'Karma Academy',
    challengerClass: '10-A',
    opponentUid: 'mock-5',
    opponentName: 'Karma Choden',
    opponentSchool: 'Lungtenzampa MSS',
    opponentClass: '10-B',
    targetType: 'python_lab',
    targetId: 'preset-factorial',
    targetTitle: 'Python Lab: Recursive Factorial Function',
    status: 'completed',
    challengerTimeSeconds: 38,
    opponentTimeSeconds: 52,
    challengerScore: 100,
    opponentScore: 90,
    winnerUid: 'mock-2',
    winnerName: 'Sonam Wangmo',
    createdAt: Date.now() - 3600000 * 8,
    completedAt: Date.now() - 3600000 * 6
  },
  {
    id: 'qc_3',
    challengerUid: 'mock-1',
    challengerName: 'Tashi Dorji',
    challengerSchool: 'Karma Academy',
    challengerClass: '10-A',
    opponentUid: 'current-local-user',
    opponentName: 'Guest Student',
    opponentSchool: 'Karma Academy',
    opponentClass: 'Class 10-A',
    targetType: 'quest',
    targetId: 'python-loops',
    targetTitle: 'Python Loops & Bhutanese Menus',
    status: 'pending',
    challengerTimeSeconds: 45,
    challengerScore: 100,
    createdAt: Date.now() - 3600000 * 1
  }
];

export async function createQuestChallenge(
  challengeData: Omit<QuestChallenge, 'id' | 'createdAt' | 'status'>
): Promise<QuestChallenge> {
  const challengeId = `qc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const challenge: QuestChallenge = {
    ...challengeData,
    id: challengeId,
    status: 'pending',
    createdAt: Date.now(),
  };

  try {
    await setDoc(doc(db, 'quest_challenges', challengeId), challenge);
  } catch (err) {
    console.warn("Firestore quest challenge create failed, using local storage fallback:", err);
  }

  try {
    const existing: QuestChallenge[] = JSON.parse(
      localStorage.getItem('guna_quest_challenges') || JSON.stringify(INITIAL_QUEST_CHALLENGES)
    );
    existing.unshift(challenge);
    localStorage.setItem('guna_quest_challenges', JSON.stringify(existing));
  } catch (e) {}

  return challenge;
}

export async function updateQuestChallenge(
  challengeId: string,
  updates: Partial<QuestChallenge>
): Promise<void> {
  try {
    const docRef = doc(db, 'quest_challenges', challengeId);
    await updateDoc(docRef, { ...updates, completedAt: updates.status === 'completed' ? Date.now() : undefined });
  } catch (err) {
    console.warn("Firestore quest challenge update warning:", err);
  }

  try {
    const existing: QuestChallenge[] = JSON.parse(
      localStorage.getItem('guna_quest_challenges') || JSON.stringify(INITIAL_QUEST_CHALLENGES)
    );
    const idx = existing.findIndex((c) => c.id === challengeId);
    if (idx !== -1) {
      existing[idx] = { 
        ...existing[idx], 
        ...updates,
        completedAt: updates.status === 'completed' ? Date.now() : existing[idx].completedAt 
      };
      localStorage.setItem('guna_quest_challenges', JSON.stringify(existing));
    }
  } catch (e) {}
}

export function subscribeToQuestChallenges(callback: (challenges: QuestChallenge[]) => void): () => void {
  const colRef = collection(db, 'quest_challenges');

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const list: QuestChallenge[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as QuestChallenge);
      });
      if (list.length === 0) {
        callback(INITIAL_QUEST_CHALLENGES);
      } else {
        list.sort((a, b) => b.createdAt - a.createdAt);
        callback(list);
      }
    },
    (err) => {
      console.warn("Error subscribing to quest_challenges snapshot, fallback to localStorage:", err);
      try {
        const localList: QuestChallenge[] = JSON.parse(
          localStorage.getItem('guna_quest_challenges') || JSON.stringify(INITIAL_QUEST_CHALLENGES)
        );
        callback(localList);
      } catch (e) {
        callback(INITIAL_QUEST_CHALLENGES);
      }
    }
  );

  return unsubscribe;
}

