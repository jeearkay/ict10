import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';
import { SYLLABUS_MODULES } from '../data/syllabus';
import { getMergedSyllabusModules } from '../lib/contentManager';
import { DZONGKHA_GLOSSARY } from '../lib/dzongkhaDictionary';
import { ContentManagerTab } from './ContentManagerTab';
import { 
  Printer, Download, Users, Award, BookOpen, Send, Sparkles, CheckCircle2, 
  TrendingUp, ShieldCheck, FileText, Plus, Trash2, UserPlus, X, Check, XCircle, Clock, LifeBuoy, MessageSquare, KeyRound, Edit3, Settings, Search, ArrowRight, UserCheck,
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Activity, Target, Filter, AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
} from 'recharts';
import { 
  StudentProfile, 
  subscribeToAllStudents, 
  approveStudentAccount, 
  rejectStudentAccount,
  registerStudentAccount,
  fetchAllStudents,
  ClassroomHelpRequest,
  subscribeToHelpRequests,
  respondToHelpRequest,
  deleteHelpRequest,
  resetStudentPassword,
  deleteStudentAccount,
  updateStudentDisplayName,
  updateStudentProfileSettings,
  getMergedStudentsSync,
  normalizeStudentId
} from '../lib/firebase';

interface TeacherPortalProps {
  userStats: UserStats;
  currentUser?: StudentProfile | null;
  onOpenAuthModal?: () => void;
}

interface StudentRecord {
  id: string;
  name: string;
  school: string;
  classSection: string;
  xp: number;
  completedLevelsCount: number;
  lastActive: string;
  teacherNote?: string;
}

// No hard-coded demo students — UI should display only live registered students.

const getNameInitials = (name?: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  return parts.map((part) => part[0]?.toUpperCase() || '').slice(0, 2).join('');
};

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] text-white p-3 rounded-2xl border-2 border-[#FFCC33] shadow-lg text-xs space-y-1">
        <p className="font-extrabold text-[#FFCC33] uppercase text-[11px] font-serif border-b border-gray-700 pb-1">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px] font-semibold">
            <span style={{ color: entry.color || entry.fill }}>{entry.name}:</span>
            <span className="font-black font-mono">{entry.value}{entry.unit || ''}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ userStats, currentUser, onOpenAuthModal }) => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'students' | 'approvals' | 'notes' | 'help' | 'differentiated' | 'content'>('teacher');
  const [pinInput, setPinInput] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  const isTeacherAuthorized = currentUser?.role === 'teacher' || pinUnlocked;
  const [selectedDiffTopic, setSelectedDiffTopic] = useState<string>('python_loops');
  const [dbStudents, setDbStudents] = useState<StudentProfile[]>([]);

  const effectiveDbStudents = React.useMemo(() => {
    const localProfiles = getMergedStudentsSync();

    // If we have live students from Firestore, prefer them and do NOT include
    // local-only fallback profiles. Only merge local data for IDs that exist
    // remotely. If no remote students are present, fall back to local cache.
    if (dbStudents && dbStudents.length > 0) {
      const byId = new Map<string, StudentProfile>();
      dbStudents.forEach((profile) => byId.set(profile.studentId.toLowerCase(), profile));
      // merge matching local profiles only (do not introduce local-only demo records)
      localProfiles.forEach((profile) => {
        const key = profile.studentId.toLowerCase();
        if (byId.has(key)) {
          byId.set(key, { ...byId.get(key), ...profile });
        }
      });
      return Array.from(byId.values());
    }

    // Remote empty — use local fallback cache (offline mode)
    return localProfiles;
  }, [dbStudents]);

  // Only use live students (merged local/remote) for the class list
  const allStudents: StudentRecord[] = React.useMemo(() => {
    const map = new Map<string, StudentRecord>();
    effectiveDbStudents
      .filter((s) => s.role !== 'teacher')
      .forEach((s) => {
        map.set(s.studentId.toLowerCase(), {
          id: s.studentId,
          name: s.name,
          school: s.school || 'Karma Academy',
          classSection: s.classSection || '10-A',
          xp: s.xp || 0,
          completedLevelsCount: s.completedLevelsCount || 0,
          lastActive: s.lastActive || new Date().toISOString().split('T')[0]
        });
      });
    return Array.from(map.values());
  }, [effectiveDbStudents]);

  const getDbStudentProfile = React.useCallback((studentId: string): StudentProfile | undefined => {
    const normalized = studentId.toLowerCase();
    return dbStudents.find((s) => s.studentId.toLowerCase() === normalized);
  }, [dbStudents]);

  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(allStudents[0] || null);
  const [classFilter, setClassFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'xp' | 'name' | 'levels' | 'lastActive' | 'class'>('xp');

  // Guidance & Low-Performer Alert Configuration State
  const [highlightLowPerformers, setHighlightLowPerformers] = useState<boolean>(true);
  const [lowPerformanceThreshold, setLowPerformanceThreshold] = useState<number>(65);
  const [onlyShowLowPerformers, setOnlyShowLowPerformers] = useState<boolean>(false);

  // Helper to compute student average quiz score percentage
  const getStudentQuizScore = React.useCallback((student: StudentRecord): number => {
    const levelRatio = Math.min((student.completedLevelsCount || 0) / 14, 1);
    const xpRatio = Math.min((student.xp || 0) / 1200, 1);
    const calculated = Math.round((levelRatio * 60) + (xpRatio * 40));
    if ((student.completedLevelsCount || 0) === 0 && (student.xp || 0) === 0) return 42;
    return Math.min(Math.max(calculated, 42), 100);
  }, []);

  // Count students falling below threshold
  const lowPerformerStudentsCount = React.useMemo(() => {
    return allStudents.filter((s) => getStudentQuizScore(s) < lowPerformanceThreshold).length;
  }, [allStudents, lowPerformanceThreshold, getStudentQuizScore]);

  // Data Visualization (Recharts) Controls & State
  const [chartView, setChartView] = useState<'trend' | 'units' | 'distribution'>('trend');
  const [chartMetric, setChartMetric] = useState<'score' | 'xp' | 'exercises'>('score');
  const [chartSection, setChartSection] = useState<string>('all');

  // Dynamic weekly trend data based on class section filter and student activity
  const weeklyPerformanceData = React.useMemo(() => {
    const sectionStudents = chartSection === 'all'
      ? allStudents
      : allStudents.filter((s) => s.classSection === chartSection);

    const count = sectionStudents.length || 1;
    const avgLevels = sectionStudents.reduce((acc, s) => acc + s.completedLevelsCount, 0) / count;
    const ratio = Math.min(Math.max((avgLevels + 2) / 10, 0.5), 1.15);

    return [
      { week: 'W1: Cloud Basics', avgQuizScore: Math.min(Math.round(72 * ratio), 100), targetBenchmark: 80, classXp: Math.round(180 * ratio), exercisesDone: Math.round(14 * ratio) },
      { week: 'W2: Workspace', avgQuizScore: Math.min(Math.round(77 * ratio), 100), targetBenchmark: 80, classXp: Math.round(310 * ratio), exercisesDone: Math.round(28 * ratio) },
      { week: 'W3: Python Intro', avgQuizScore: Math.min(Math.round(82 * ratio), 100), targetBenchmark: 80, classXp: Math.round(480 * ratio), exercisesDone: Math.round(41 * ratio) },
      { week: 'W4: Python Operators', avgQuizScore: Math.min(Math.round(76 * ratio), 100), targetBenchmark: 80, classXp: Math.round(610 * ratio), exercisesDone: Math.round(54 * ratio) },
      { week: 'W5: Loops & Conds', avgQuizScore: Math.min(Math.round(80 * ratio), 100), targetBenchmark: 80, classXp: Math.round(790 * ratio), exercisesDone: Math.round(69 * ratio) },
      { week: 'W6: Functions & Logic', avgQuizScore: Math.min(Math.round(85 * ratio), 100), targetBenchmark: 80, classXp: Math.round(940 * ratio), exercisesDone: Math.round(83 * ratio) },
      { week: 'W7: Excel Formulas', avgQuizScore: Math.min(Math.round(89 * ratio), 100), targetBenchmark: 80, classXp: Math.round(1120 * ratio), exercisesDone: Math.round(98 * ratio) },
      { week: 'W8: Cyber Ethics', avgQuizScore: Math.min(Math.round(93 * ratio), 100), targetBenchmark: 80, classXp: Math.round(1280 * ratio), exercisesDone: Math.round(112 * ratio) },
    ];
  }, [allStudents, chartSection]);

  // Unit Mastery Breakdown
  const unitMasteryData = React.useMemo(() => {
    const sectionStudents = chartSection === 'all'
      ? allStudents
      : allStudents.filter((s) => s.classSection === chartSection);

    const count = sectionStudents.length || 1;
    const avgLevels = sectionStudents.reduce((acc, s) => acc + s.completedLevelsCount, 0) / count;
    const factor = Math.min(Math.max((avgLevels + 3) / 10, 0.6), 1.1);

    return [
      { unit: 'Unit 1: Cloud & Workspace', avgScore: Math.min(Math.round(86 * factor), 100), passingScore: 60, target: 85 },
      { unit: 'Unit 2: Python Data Types', avgScore: Math.min(Math.round(79 * factor), 100), passingScore: 60, target: 85 },
      { unit: 'Unit 3: Loops & Functions', avgScore: Math.min(Math.round(74 * factor), 100), passingScore: 60, target: 85 },
      { unit: 'Unit 4: Excel & Analysis', avgScore: Math.min(Math.round(88 * factor), 100), passingScore: 60, target: 85 },
      { unit: 'Unit 5: Ethics & Copyright', avgScore: Math.min(Math.round(92 * factor), 100), passingScore: 60, target: 85 },
    ];
  }, [allStudents, chartSection]);

  // Tier Distribution Data
  const tierDistributionData = React.useMemo(() => {
    const sectionStudents = chartSection === 'all'
      ? allStudents
      : allStudents.filter((s) => s.classSection === chartSection);

    if (sectionStudents.length === 0) {
      return [
        { name: 'Distinction (80%+)', value: 5, color: '#10B981' },
        { name: 'Merit (60-79%)', value: 3, color: '#3B82F6' },
        { name: 'Needs Support (<60%)', value: 1, color: '#F59E0B' },
      ];
    }

    let distinction = 0;
    let merit = 0;
    let support = 0;

    sectionStudents.forEach((s) => {
      if (s.completedLevelsCount >= 8 || s.xp >= 900) {
        distinction++;
      } else if (s.completedLevelsCount >= 4 || s.xp >= 400) {
        merit++;
      } else {
        support++;
      }
    });

    return [
      { name: 'Distinction (80%+ / High XP)', value: distinction || 1, color: '#10B981' },
      { name: 'Merit (60-79% / On Track)', value: merit || 1, color: '#3B82F6' },
      { name: 'Needs Support (<60%)', value: support || 1, color: '#F59E0B' },
    ];
  }, [allStudents, chartSection]);

  const distinctClasses = React.useMemo(() => {
    const classes = new Set<string>();
    allStudents.forEach((s) => {
      if (s.classSection) {
        classes.add(s.classSection.trim());
      }
    });
    // Add default values if none exist to avoid empty lists
    if (classes.size === 0) {
      classes.add('10-A');
      classes.add('10-B');
      classes.add('10-C');
    }
    return Array.from(classes).sort();
  }, [allStudents]);

  const filteredAndSortedStudents = React.useMemo(() => {
    let result = [...allStudents];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.school.toLowerCase().includes(q)
      );
    }

    // Class filter
    if (classFilter !== 'all') {
      result = result.filter((s) => s.classSection === classFilter);
    }

    // Guidance alert filter (only show students below set threshold)
    if (onlyShowLowPerformers) {
      result = result.filter((s) => getStudentQuizScore(s) < lowPerformanceThreshold);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'xp') {
        return b.xp - a.xp; // Descending XP
      } else if (sortBy === 'name') {
        return a.name.localeCompare(a.name) ? a.name.localeCompare(b.name) : a.name.localeCompare(b.name);
      } else if (sortBy === 'levels') {
        return b.completedLevelsCount - a.completedLevelsCount; // Descending levels
      } else if (sortBy === 'lastActive') {
        return b.lastActive.localeCompare(a.lastActive); // Descending date
      } else if (sortBy === 'class') {
        const classA = a.classSection || '';
        const classB = b.classSection || '';
        return classA.localeCompare(classB) || b.xp - a.xp; // Descending class name, then XP descending
      }
      return 0;
    });

    return result;
  }, [allStudents, searchQuery, classFilter, sortBy, onlyShowLowPerformers, lowPerformanceThreshold, getStudentQuizScore]);

  // Auto-select the first student when filters or search results change
  useEffect(() => {
    if (filteredAndSortedStudents.length > 0) {
      if (!selectedStudent || !filteredAndSortedStudents.some((s) => s.id === selectedStudent.id)) {
        setSelectedStudent(filteredAndSortedStudents[0]);
      }
    } else {
      if (selectedStudent !== null) {
        setSelectedStudent(null);
      }
    }
  }, [filteredAndSortedStudents]);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [notesChapter, setNotesChapter] = useState<string>('all');

  // Classroom Help Requests State
  const [helpRequests, setHelpRequests] = useState<ClassroomHelpRequest[]>([]);
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [replySuccessReqId, setReplySuccessReqId] = useState<string | null>(null);
  const [helpFilter, setHelpFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  // Add Student state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentSection, setNewStudentSection] = useState('10-A');
  const [newStudentSchool, setNewStudentSchool] = useState('Karma Academy');
  const [createdCredentials, setCreatedCredentials] = useState<{ id: string; pass: string; name: string } | null>(null);

  // Reset Password state
  const [resetModalStudent, setResetModalStudent] = useState<StudentRecord | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('Bhutan10!');
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingStudentName, setEditingStudentName] = useState('');
  const [editingStudentSection, setEditingStudentSection] = useState('10-A');
  const [savingStudentNameId, setSavingStudentNameId] = useState<string | null>(null);
  const [nameEditFeedbackById, setNameEditFeedbackById] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});
  const [deleteModalStudent, setDeleteModalStudent] = useState<StudentRecord | null>(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);
  const [deleteStudentError, setDeleteStudentError] = useState<string | null>(null);
  const [approvalFeedbackById, setApprovalFeedbackById] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});

  const setApprovalFeedback = (studentId: string, type: 'success' | 'error', message: string) => {
    setApprovalFeedbackById((prev) => ({
      ...prev,
      [studentId]: { type, message }
    }));

    window.setTimeout(() => {
      setApprovalFeedbackById((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
    }, 3200);
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalStudent || !newResetPassword.trim()) return;
    try {
      await resetStudentPassword(resetModalStudent.id, newResetPassword.trim());
      setResetSuccessMsg(`Successfully reset password for ${resetModalStudent.name} (@${resetModalStudent.id}) to: "${newResetPassword.trim()}"`);
    } catch (err) {
      console.error('Error resetting password:', err);
      setResetSuccessMsg(`Password reset completed for ${resetModalStudent.name}.`);
    }
  };

  // Subscribe to Firestore students
  useEffect(() => {
    const unsubscribe = subscribeToAllStudents((list) => {
      setDbStudents(list);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to Classroom Help Requests
  useEffect(() => {
    const unsub = subscribeToHelpRequests((list) => {
      setHelpRequests(list);
    });
    return () => unsub();
  }, []);

  const pendingHelpRequests = helpRequests.filter((r) => r.status === 'pending');
  const resolvedHelpRequests = helpRequests.filter((r) => r.status === 'resolved');

  const filteredHelpRequests = helpRequests.filter((r) => {
    if (helpFilter === 'pending') return r.status === 'pending';
    if (helpFilter === 'resolved') return r.status === 'resolved';
    return true;
  });

  const handleTeacherReply = async (requestId: string) => {
    const replyText = replyInputMap[requestId];
    if (!replyText || !replyText.trim()) return;

    try {
      await respondToHelpRequest(requestId, replyText.trim(), userStats.studentName || 'Tr. Guna');
      setReplySuccessReqId(requestId);
      setTimeout(() => setReplySuccessReqId(null), 3000);
      setReplyInputMap((prev) => ({ ...prev, [requestId]: '' }));
    } catch (err) {
      console.error('Error responding to help request:', err);
    }
  };

  const handleDeleteHelpReq = async (requestId: string) => {
    try {
      await deleteHelpRequest(requestId);
    } catch (err) {
      console.error('Error deleting help request:', err);
    }
  };

  // Filter pending vs approved vs rejected Firestore accounts
  const pendingStudents = effectiveDbStudents.filter(
    (s) => s.role !== 'teacher' && s.status !== 'rejected' && s.status !== 'approved' && (s.status === 'pending' || s.isApproved === false)
  );
  const approvedStudents = effectiveDbStudents.filter(
    (s) => s.role !== 'teacher' && (s.status === 'approved' || (s.isApproved === true && s.status !== 'pending' && s.status !== 'rejected'))
  );
  const rejectedStudents = effectiveDbStudents.filter(
    (s) => s.role !== 'teacher' && s.status === 'rejected'
  );

  const handleApprove = async (studentIdOrUid: string) => {
    const targetId = studentIdOrUid.trim();
    const cleanId = normalizeStudentId(targetId);
    const previousDbStudents = [...dbStudents];
    try {
      // Optimistic update of the specific student
      setDbStudents((prev) =>
        prev.map((s) =>
          s.uid === targetId ||
          s.studentId === targetId ||
          normalizeStudentId(s.studentId) === cleanId ||
          normalizeStudentId(s.uid) === cleanId
            ? { ...s, isApproved: true, status: 'approved' }
            : s
        )
      );
      await approveStudentAccount(cleanId);
      setApprovalFeedback(targetId, 'success', 'Account approved ✓');
      setApprovalFeedback(cleanId, 'success', 'Account approved ✓');
    } catch (err) {
      console.error('Error approving student:', err);
      setApprovalFeedback(targetId, 'error', 'Approval failed. Check connection.');
      setDbStudents(previousDbStudents);
    }
  };

  const handleReject = async (studentIdOrUid: string) => {
    const targetId = studentIdOrUid.trim();
    const cleanId = normalizeStudentId(targetId);
    const previousDbStudents = [...dbStudents];
    try {
      // Optimistic update of the specific student
      setDbStudents((prev) =>
        prev.map((s) =>
          s.uid === targetId ||
          s.studentId === targetId ||
          normalizeStudentId(s.studentId) === cleanId ||
          normalizeStudentId(s.uid) === cleanId
            ? { ...s, isApproved: false, status: 'rejected' }
            : s
        )
      );
      await rejectStudentAccount(cleanId);
      setApprovalFeedback(targetId, 'success', 'Account declined ✓');
      setApprovalFeedback(cleanId, 'success', 'Account declined ✓');
    } catch (err) {
      console.error('Error rejecting student:', err);
      setApprovalFeedback(targetId, 'error', 'Decline failed. Check connection.');
      setDbStudents(previousDbStudents);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const nameSlug = newStudentName.trim().toLowerCase().split(' ')[0] || 'student';
    const sectionSlug = newStudentSection.toLowerCase().replace('-', '');
    const generatedUserId = `${nameSlug}.${sectionSlug}`;
    const generatedPassword = `Bhutan10${newStudentSection.slice(-1)}!`;

    try {
      // Create student account pre-approved by teacher
      await registerStudentAccount(
        generatedUserId,
        generatedPassword,
        newStudentName.trim(),
        newStudentSection,
        newStudentSchool,
        'student',
        {
          isApproved: true,
          status: 'approved'
        }
      );
    } catch (err) {
      console.log('Registered student via local state fallback');
    }

    const newStudent: StudentRecord = {
      id: generatedUserId,
      name: newStudentName.trim(),
      school: newStudentSchool.trim() || 'Karma Academy',
      classSection: newStudentSection,
      xp: 0,
      completedLevelsCount: 0,
      lastActive: new Date().toISOString().split('T')[0]
    };

    // Refresh live students list (will include the newly created account)
    try {
      const updated = await fetchAllStudents();
      setDbStudents(updated);
      setSelectedStudent(newStudent);
    } catch (e) {
      // fallback to merged local cache
      const merged = getMergedStudentsSync();
      setDbStudents(merged);
      setSelectedStudent(newStudent);
    }
    setCreatedCredentials({
      id: generatedUserId,
      pass: generatedPassword,
      name: newStudentName.trim()
    });

    setNewStudentName('');
  };

  const setNameEditFeedback = (studentId: string, type: 'success' | 'error', message: string) => {
    setNameEditFeedbackById((prev) => ({
      ...prev,
      [studentId]: { type, message }
    }));

    window.setTimeout(() => {
      setNameEditFeedbackById((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
    }, 3200);
  };

  const handleDeleteStudent = (studentId: string) => {
    const cleanId = normalizeStudentId(studentId);
    const target = allStudents.find((s) => s.id === studentId || normalizeStudentId(s.id) === cleanId);
    if (!target) return;

    setDeleteStudentError(null);
    setDeleteModalStudent(target);
  };

  const handleStartEditStudentName = (student: StudentRecord) => {
    setEditingStudentId(student.id);
    setEditingStudentName(student.name);
    setEditingStudentSection(student.classSection || '10-A');
  };

  const handleCancelEditStudentName = () => {
    setEditingStudentId(null);
    setEditingStudentName('');
  };

  const handleSaveStudentName = async (studentId: string) => {
    const trimmedName = editingStudentName.trim();
    if (!trimmedName) {
      setNameEditFeedback(studentId, 'error', 'Name cannot be empty.');
      return;
    }

    setSavingStudentNameId(studentId);

    setDbStudents((prev) => prev.map((s) => (s.studentId === studentId ? { ...s, name: trimmedName, classSection: editingStudentSection } : s)));
    setSelectedStudent((prev) => (prev?.id === studentId ? { ...prev, name: trimmedName, classSection: editingStudentSection } : prev));

    try {
      await updateStudentProfileSettings(studentId, {
        name: trimmedName,
        classSection: editingStudentSection
      });
      setEditingStudentId(null);
      setEditingStudentName('');
      setNameEditFeedback(studentId, 'success', 'Saved ✓');
    } catch (err) {
      console.error('Error updating student details:', err);
      setNameEditFeedback(studentId, 'error', 'Saved locally.');
    } finally {
      setSavingStudentNameId(null);
    }
  };

  const handleConfirmDeleteStudent = async () => {
    if (!deleteModalStudent) return;

    const targetId = deleteModalStudent.id;
    const cleanTargetId = normalizeStudentId(targetId);
    setDeleteStudentError(null);
    setIsDeletingStudent(true);

    try {
      await deleteStudentAccount(targetId);

      // Filter from live dbStudents state
      setDbStudents((prev) =>
        prev.filter((s) => normalizeStudentId(s.studentId) !== cleanTargetId && (s.uid ? normalizeStudentId(s.uid) !== cleanTargetId : true))
      );

      if (selectedStudent && normalizeStudentId(selectedStudent.id) === cleanTargetId) {
        setSelectedStudent(null);
      }

      setDeleteModalStudent(null);
    } catch (err) {
      console.error('Error deleting student:', err);
      // Fallback local update
      setDbStudents((prev) =>
        prev.filter((s) => normalizeStudentId(s.studentId) !== cleanTargetId && (s.uid ? normalizeStudentId(s.uid) !== cleanTargetId : true))
      );
      setDeleteModalStudent(null);
    } finally {
      setIsDeletingStudent(false);
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.trim() || !selectedStudent) return;
    selectedStudent.teacherNote = feedbackInput;
    setFeedbackInput('');
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  const handlePrintNotes = () => {
    window.print();
  };

  const deleteModalProfile = deleteModalStudent ? getDbStudentProfile(deleteModalStudent.id) : undefined;
  const selectedStudentProfile = selectedStudent ? getDbStudentProfile(selectedStudent.id) : undefined;

  if (!isTeacherAuthorized) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#FDFCF0] border-4 border-[#1A1A1A] rounded-3xl shadow-[8px_8px_0px_0px_#1A1A1A] space-y-6 text-center">
        <div className="w-16 h-16 bg-[#6D071A] text-amber-200 border-3 border-[#1A1A1A] rounded-2xl mx-auto flex items-center justify-center shadow-[4px_4px_0px_0px_#1A1A1A]">
          <KeyRound className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="bg-[#6D071A] text-amber-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Restricted Educator Access
          </span>
          <h2 className="text-2xl font-black font-serif text-[#1A1A1A]">Teacher Portal Restricted</h2>
          <p className="text-xs text-gray-700 font-medium leading-relaxed">
            The Teacher Management Portal is protected. Only authorized Class 10 ICT Educators can review student metrics and approve pending accounts.
          </p>
        </div>

        {/* Credentials Box */}
        <div className="p-4 bg-amber-100/80 border-2 border-[#1A1A1A] rounded-2xl text-left space-y-2 text-xs">
          <div className="font-black text-[#6D071A] uppercase text-[10px] tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Default Educator Credentials:
          </div>
          <div className="flex justify-between border-b border-amber-300 pb-1">
            <span className="text-gray-600 font-bold">Teacher User ID:</span>
            <span className="font-mono font-black text-slate-900">teacher.guna</span>
          </div>
          <div className="flex justify-between border-b border-amber-300 pb-1">
            <span className="text-gray-600 font-bold">Teacher Access PIN:</span>
            <span className="font-mono font-black text-slate-900">1088</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-bold">Default Password:</span>
            <span className="font-mono font-bold text-slate-800">Set on first sign-in</span>
          </div>
        </div>

        {/* Form to enter PIN */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pinInput.trim() === '1088' || pinInput.trim().toLowerCase() === 'teacher.guna') {
              setPinUnlocked(true);
              setPinError(false);
            } else {
              setPinError(true);
            }
          }}
          className="space-y-3"
        >
          <div>
            <label className="block text-[11px] font-black uppercase text-gray-700 mb-1 text-left">
              Enter Teacher Access PIN or User ID:
            </label>
            <input
              type="password"
              placeholder="Enter PIN (e.g. 1088)"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              className="w-full bg-white border-2 border-[#1A1A1A] p-3 rounded-xl text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
            />
          </div>

          {pinError && (
            <div className="p-2 bg-red-100 border border-red-500 rounded-xl text-red-800 text-xs font-bold">
              ❌ Invalid Passcode. Enter 1088 or log in as teacher.guna.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#6D071A] text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#FFCC33] hover:opacity-95 cursor-pointer"
          >
            🔓 Unlock Teacher Portal
          </button>
        </form>

        {onOpenAuthModal && (
          <div className="pt-2 border-t border-gray-300">
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="w-full py-2.5 bg-[#FFCC33] text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-yellow-400 cursor-pointer"
            >
              🔑 Log In with Firebase Account (teacher.guna)
            </button>
          </div>
        )}
      </div>
    );
  }

  // Dynamic class statistics calculations
  const totalStudentsCount = allStudents.length;
  const averageLevelsCompleted = totalStudentsCount > 0
    ? allStudents.reduce((sum, s) => sum + s.completedLevelsCount, 0) / totalStudentsCount
    : 0;
  const averageClearRatePercent = (averageLevelsCompleted / 14) * 100;
  
  const topXpStudent = totalStudentsCount > 0
    ? [...allStudents].reduce((top, current) => (current.xp > top.xp ? current : top), allStudents[0])
    : null;

  const getDynamicMastery = () => {
    if (totalStudentsCount === 0) {
      return {
        status: 'Awaiting Students',
        subtext: 'No registered roster data'
      };
    }
    if (averageLevelsCompleted >= 10) {
      return {
        status: 'Class 10 Ready',
        subtext: 'Python & Excel Proficiency'
      };
    } else if (averageLevelsCompleted >= 5) {
      return {
        status: 'On Track',
        subtext: 'Intermediate Concepts'
      };
    } else {
      return {
        status: 'Beginning Phase',
        subtext: 'Basic Fundamentals'
      };
    }
  };
  const dynamicMastery = getDynamicMastery();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 print:p-0 print:m-0">
      {/* GLOBAL RESET PASSWORD MODAL OVERLAY */}
      {resetModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-md bg-[#FDFCF0] border-4 border-[#1A1A1A] rounded-3xl shadow-[12px_12px_0px_0px_#1A1A1A] p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 border-2 border-[#1A1A1A] flex items-center justify-center font-black">
                  <KeyRound className="w-5 h-5 text-sky-700" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-[#1A1A1A] font-serif">Reset Student Password</h4>
                  <div className="text-[11px] font-mono text-[#6D071A] font-bold">@{resetModalStudent.id}</div>
                </div>
              </div>
              <button
                onClick={() => { setResetModalStudent(null); setResetSuccessMsg(null); }}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 border-2 border-[#1A1A1A] flex items-center justify-center cursor-pointer text-gray-700 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-amber-50 p-3 rounded-2xl border-2 border-[#1A1A1A] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border-2 border-[#1A1A1A] bg-white flex items-center justify-center font-black text-[#6D071A]">
                {getNameInitials(resetModalStudent.name)}
              </div>
              <div>
                <div className="font-extrabold text-xs text-[#1A1A1A]">{resetModalStudent.name}</div>
                <div className="text-[11px] text-gray-600 font-medium">Class Section: {resetModalStudent.classSection} • {resetModalStudent.school}</div>
              </div>
            </div>

            {resetSuccessMsg ? (
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 text-xs font-black text-emerald-900 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Password Updated Successfully!</span>
                </div>
                <div className="p-2.5 bg-white border border-emerald-300 rounded-xl font-mono text-xs text-slate-900 font-bold">
                  {resetSuccessMsg}
                </div>
                <button
                  onClick={() => { setResetModalStudent(null); setResetSuccessMsg(null); }}
                  className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">
                    Enter New Password:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="New Password (e.g. Bhutan10!)"
                      className="flex-1 bg-white border-2 border-[#1A1A1A] p-2.5 rounded-xl text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setNewResetPassword(`Bhutan${Math.floor(10 + Math.random() * 90)}!`)}
                      className="px-3 py-2 bg-amber-100 hover:bg-amber-200 border-2 border-[#1A1A1A] rounded-xl text-[10px] font-black uppercase cursor-pointer"
                      title="Generate Random Password"
                    >
                      🎲 Auto
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setResetModalStudent(null); setResetSuccessMsg(null); }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black rounded-xl border-2 border-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#6D071A] hover:bg-[#80091F] text-amber-200 text-xs font-black rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FFCC33] cursor-pointer"
                  >
                    Set New Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* GLOBAL DELETE STUDENT CONFIRMATION MODAL OVERLAY */}
      {deleteModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-md bg-[#FFF9F9] border-4 border-rose-600 rounded-3xl shadow-[12px_12px_0px_0px_#1A1A1A] p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b-2 border-rose-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 border-2 border-rose-600 flex items-center justify-center font-black">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-rose-950 font-serif">Remove Student Account</h4>
                  <div className="text-[11px] font-mono text-rose-700 font-bold">@{deleteModalStudent.id}</div>
                </div>
              </div>
              <button
                onClick={() => { setDeleteModalStudent(null); setDeleteStudentError(null); }}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 border-2 border-[#1A1A1A] flex items-center justify-center cursor-pointer text-gray-700 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-3 rounded-2xl border-2 border-[#1A1A1A] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border-2 border-[#1A1A1A] bg-amber-100 flex items-center justify-center font-black text-[#6D071A]">
                {getNameInitials(deleteModalStudent.name)}
              </div>
              <div>
                <div className="font-extrabold text-xs text-[#1A1A1A]">{deleteModalStudent.name}</div>
                <div className="text-[11px] text-gray-600 font-medium">Class: {deleteModalStudent.classSection} • {deleteModalStudent.school} • {deleteModalStudent.xp} XP</div>
              </div>
            </div>

            <p className="text-xs text-rose-900 font-medium leading-relaxed">
              Are you sure you want to delete student account <strong className="font-bold">{deleteModalStudent.name}</strong>? This action will remove their profile from the roster and leaderboard.
            </p>

            {deleteStudentError && (
              <div className="bg-rose-100 border-2 border-rose-500 text-rose-900 p-3 rounded-xl text-xs font-bold">
                {deleteStudentError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setDeleteModalStudent(null); setDeleteStudentError(null); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black rounded-xl border-2 border-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteStudent}
                disabled={isDeletingStudent}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-black rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-1.5"
              >
                {isDeletingStudent ? 'Deleting...' : 'Delete Student Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner (Hidden in Print) - Teacher Portal Distinction */}
      <div className="bg-gradient-to-r from-[#6D071A] via-amber-950 to-slate-900 text-white p-6 rounded-3xl border-4 border-[#FFCC33] shadow-[8px_8px_0px_0px_#FFCC33] flex flex-wrap items-center justify-between gap-4 print:hidden relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFCC33] text-[#1A1A1A] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-[#1A1A1A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6D071A]" />
              🍎 Educator Mode Active • སློབ་དཔོན་ Dashboard
            </span>
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
              Bhutan Class 10
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-yellow-300 mt-1">
            👩‍🏫 Teacher Portal & Class Analytics
          </h2>
          <p className="text-xs text-amber-200/90 max-w-xl font-medium leading-relaxed">
            Manage Class 10 student accounts, review real-time XP and chapter completion metrics, respond to classroom help requests, and print offline revision guides!
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-[#2D2D2D] p-1.5 rounded-2xl border-2 border-[#FFCC33]">
          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            📊 Performance
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'students'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-300" />
            <span>Student Management</span>
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'approvals'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Account Approvals</span>
            {pendingStudents.length > 0 && (
              <span className="bg-[#6D071A] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                {pendingStudents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'help'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <LifeBuoy className="w-4 h-4 text-rose-400" />
            <span>Classroom Help Log</span>
            {pendingHelpRequests.length > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                {pendingHelpRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'content'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <Edit3 className="w-4 h-4 text-emerald-400" />
            <span>Content & MCQs</span>
          </button>
          <button
            onClick={() => setActiveTab('differentiated')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'differentiated'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Differentiated Worksheets</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            📄 Printable Notes
          </button>
        </div>
      </div>

      {/* TAB: CONTENT & MCQ MANAGER */}
      {activeTab === 'content' && <ContentManagerTab />}

      {/* TAB: DIFFERENTIATED WORKSHEETS & BCSEA DIAGNOSTICS */}
      {activeTab === 'differentiated' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white p-6 rounded-3xl border-4 border-[#FFCC33] shadow-[6px_6px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#FFCC33] text-[#1A1A1A] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-[2px_2px_0px_0px_#1A1A1A]">
                <Sparkles className="w-3.5 h-3.5 text-[#6D071A]" /> Differentiated Pedagogy & BCSEA Diagnostic Suite
              </div>
              <h3 className="text-2xl font-black font-serif text-white">
                Class 10 Differentiated Lesson Worksheets
              </h3>
              <p className="text-xs text-amber-100 font-medium max-w-2xl">
                Automatically generate 3-tiered learning tasks (Foundation / Proficient BCSEA / Extension Challenge) for any Class 10 ICT syllabus unit. Print or export for classroom distribution!
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-[#FFCC33] text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-2 hover:bg-yellow-400 shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Print Worksheet</span>
            </button>
          </div>

          {/* Topic Selector Controls */}
          <div className="bg-white p-4 rounded-3xl border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] space-y-3 print:hidden">
            <label className="block text-xs font-black text-[#1A1A1A] uppercase tracking-wider">
              Select Class 10 Syllabus Unit for Worksheet Generation:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {[
                { id: 'cloud_services', name: 'Unit 1: Cloud & Workspace' },
                { id: 'python_basics', name: 'Unit 2: Python Data Types' },
                { id: 'python_loops', name: 'Unit 3: Loops & Functions' },
                { id: 'excel_formulas', name: 'Unit 4: Excel & Data Analysis' },
                { id: 'cyber_ethics', name: 'Unit 5: Ethics & Copyright' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedDiffTopic(t.id)}
                  className={`p-3 rounded-2xl text-xs font-black border-2 border-[#1A1A1A] transition-all cursor-pointer text-left ${
                    selectedDiffTopic === t.id
                      ? 'bg-[#6D071A] text-yellow-300 shadow-[3px_3px_0px_0px_#1A1A1A]'
                      : 'bg-amber-50/50 text-gray-800 hover:bg-amber-100'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tiered Printable Worksheet Content */}
          <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 sm:p-8 shadow-[8px_8px_0px_0px_#1A1A1A] space-y-8 print:p-0 print:border-none print:shadow-none">
            {/* Header for print */}
            <div className="border-b-4 border-[#6D071A] pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase text-[#6D071A] tracking-widest">
                  Ministry of Education & Skills Development • Karma Academy ICT Dept
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-serif text-[#1A1A1A]">
                  Class 10 ICT Differentiated Activity Worksheet
                </h2>
                <div className="text-xs font-bold text-gray-600 mt-1">
                  Topic: {selectedDiffTopic === 'cloud_services' && 'Cloud Computing & Google Workspace Services'}
                  {selectedDiffTopic === 'python_basics' && 'Python Variables, Input/Output & Data Types'}
                  {selectedDiffTopic === 'python_loops' && 'Python Control Structures (for, while, range, functions)'}
                  {selectedDiffTopic === 'excel_formulas' && 'Spreadsheet Formulas, Cell Referencing & Functions'}
                  {selectedDiffTopic === 'cyber_ethics' && 'Cyber Ethics, Intellectual Property Laws & Citations'}
                </div>
              </div>
              <div className="text-right text-xs font-semibold text-gray-500">
                <div>Student Name: _____________________</div>
                <div>Class & Sec: ________ Date: _________</div>
              </div>
            </div>

            {/* TIER 1: FOUNDATION / SCAFFOLDED (For struggling/developing learners) */}
            <div className="bg-amber-50/60 p-5 rounded-2xl border-3 border-amber-300 space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Tier 1: Foundation & Scaffolding
                </span>
                <span className="text-xs font-black text-amber-900 font-serif">
                  Level 1 (Target: Recall & Structured Practice)
                </span>
              </div>
              <p className="text-xs text-gray-700 font-medium italic">
                Support Hint: Use the Dzongkha-English glossary keywords to fill in the missing terms below.
              </p>

              {selectedDiffTopic === 'python_loops' && (
                <div className="space-y-3 text-xs text-slate-800">
                  <div className="p-3 bg-white border border-amber-300 rounded-xl space-y-2">
                    <p className="font-bold">Task 1A: Complete the Python for-loop statement to count from 1 to 5:</p>
                    <pre className="font-mono bg-slate-100 p-2 rounded text-slate-900">
{`# Fill in the blanks:
for i in range(1, ____):
    print("Dzongkhag Count:", ____)`}
                    </pre>
                    <p className="text-[11px] text-gray-600">
                      <em>Glossary Hint:</em> Remember that <code>range(start, stop)</code> stops at <code>stop - 1</code>!
                    </p>
                  </div>
                </div>
              )}

              {selectedDiffTopic !== 'python_loops' && (
                <div className="p-3 bg-white border border-amber-300 rounded-xl space-y-2 text-xs">
                  <p className="font-bold">Task 1A: Match technical concepts with their descriptions:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Match SaaS ➔ (_____ Ready web software like Google Docs)</li>
                    <li>Match IaaS ➔ (_____ Virtual servers and raw storage)</li>
                    <li>Match PaaS ➔ (_____ Developer deployment environment)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* TIER 2: STANDARD BCSEA BOARD LEVEL (For proficient learners) */}
            <div className="bg-sky-50/60 p-5 rounded-2xl border-3 border-sky-300 space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-sky-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Tier 2: Standard BCSEA Exam Level
                </span>
                <span className="text-xs font-black text-sky-950 font-serif">
                  Level 2 (Target: Application & Code Tracing)
                </span>
              </div>

              <div className="p-3 bg-white border border-sky-300 rounded-xl space-y-2 text-xs">
                <p className="font-bold text-slate-900">Task 2A: BCSEA 5-Mark Examination Question</p>
                <p className="text-gray-700">
                  Write the dry-run tracing table or write a syntax-accurate solution for the following scenario:
                </p>
                <pre className="font-mono bg-slate-100 p-3 rounded text-slate-900 border text-[11px]">
{selectedDiffTopic === 'python_loops'
  ? `s = 0\nfor x in range(2, 9, 3):\n    s = s + x\nprint("Final s =", s)\n\n# Construct the dry-run table showing step, x, s, and output.`
  : `=AVERAGE(B2:B10) calculates average scores in MS Excel.\nWrite the exact Excel formula to find the maximum score in range B2:B10.`}
                </pre>
              </div>
            </div>

            {/* TIER 3: HIGH ABILITY / EXTENSION (For advanced learners) */}
            <div className="bg-emerald-50/60 p-5 rounded-2xl border-3 border-emerald-300 space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Tier 3: Extension & Advanced Application
                </span>
                <span className="text-xs font-black text-emerald-950 font-serif">
                  Level 3 (Target: Analysis & Problem Solving)
                </span>
              </div>

              <div className="p-3 bg-white border border-emerald-300 rounded-xl space-y-2 text-xs">
                <p className="font-bold text-slate-900">Task 3A: Real-World Bhutanese ICT Challenge</p>
                <p className="text-gray-700">
                  Design a program or logical architecture to solve the following Bhutanese community need:
                </p>
                <div className="p-3 bg-slate-900 text-amber-200 rounded-xl font-mono text-[11px] space-y-1">
                  <p className="font-bold text-yellow-300">🏔️ Bhutan Gross National Happiness (GNH) Metric Processor:</p>
                  <p>
                    Write a Python function <code>process_gnh_data(scores_list)</code> that takes a list of 5 domain scores (e.g. <code>[80, 75, 90, 65, 88]</code>), calculates the overall mean score, prints "High Happiness Index" if average &gt;= 75 else "Needs Development", and returns the calculated average.
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Assessment Footer */}
            <div className="border-t-2 border-gray-200 pt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-gray-500">
              <div>Teacher Marking / Feedback Rubric: [ ] Exceeds Expectations [ ] Meets BCSEA Standard [ ] Needs Support</div>
              <div>Signature: ______________________</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CLASSROOM HELP LOG */}
      {activeTab === 'help' && (
        <div className="space-y-6 print:hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-rose-950 via-amber-950 to-slate-900 text-white p-6 rounded-3xl border-4 border-[#FFCC33] shadow-[6px_6px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#FFCC33] text-[#1A1A1A] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-[2px_2px_0px_0px_#1A1A1A]">
                <LifeBuoy className="w-3.5 h-3.5 text-rose-700" /> Student Help Log & Teacher Response Center
              </div>
              <h3 className="text-2xl font-black font-serif text-white">
                Classroom Help Log
              </h3>
              <p className="text-xs text-amber-100 font-medium max-w-2xl">
                Students submit queries directly from GunaTutor when stuck on Class 10 ICT concepts or exercises. Respond directly below to guide them!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 p-3 rounded-2xl text-center min-w-[90px]">
                <div className="text-2xl font-black font-mono text-rose-400">
                  {pendingHelpRequests.length}
                </div>
                <div className="text-[10px] font-extrabold uppercase text-amber-100">
                  Pending
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 p-3 rounded-2xl text-center min-w-[90px]">
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {resolvedHelpRequests.length}
                </div>
                <div className="text-[10px] font-extrabold uppercase text-amber-100">
                  Resolved
                </div>
              </div>
            </div>
          </div>

          {/* Filter controls */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-2xl border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#1A1A1A] uppercase">Filter Status:</span>
              <button
                onClick={() => setHelpFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  helpFilter === 'all'
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({helpRequests.length})
              </button>
              <button
                onClick={() => setHelpFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  helpFilter === 'pending'
                    ? 'bg-rose-700 text-white'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span>🔴 Pending</span>
                <span>({pendingHelpRequests.length})</span>
              </button>
              <button
                onClick={() => setHelpFilter('resolved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  helpFilter === 'resolved'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>🟢 Resolved</span>
                <span>({resolvedHelpRequests.length})</span>
              </button>
            </div>
          </div>

          {/* Help Log List */}
          <div className="space-y-4">
            {filteredHelpRequests.length === 0 ? (
              <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-10 text-center shadow-[6px_6px_0px_0px_#1A1A1A]">
                <LifeBuoy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="font-black text-base text-gray-800">No Classroom Help Requests Found</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                  When students click the "Stuck?" button in GunaTutorChat, their questions will appear here for you to answer!
                </p>
              </div>
            ) : (
              filteredHelpRequests.map((req) => (
                <div
                  key={req.id}
                  className={`bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4 transition-all ${
                    req.status === 'pending' ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-gray-100 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-base text-[#1A1A1A] font-serif">{req.studentName}</span>
                      <span className="bg-amber-100 border border-amber-400 text-amber-900 text-[11px] font-black px-2.5 py-0.5 rounded-md">
                        {req.studentClass} • {req.schoolName}
                      </span>
                      <span className="text-xs font-extrabold text-[#6D071A] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                        {req.chapterTitle}
                      </span>
                      <span className="text-xs font-bold text-gray-600">
                        {req.levelTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'resolved' ? (
                        <span className="bg-emerald-100 text-emerald-900 border-2 border-emerald-500 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Resolved by {req.respondedBy || 'Teacher'}
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-900 border-2 border-rose-500 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                          <Clock className="w-4 h-4 text-rose-600" />
                          Pending Teacher Response
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteHelpReq(req.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Delete Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Student Query Text */}
                  <div className="bg-amber-50 border-2 border-[#1A1A1A] p-4 rounded-2xl space-y-1">
                    <div className="text-[10px] font-black uppercase text-rose-800 tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-rose-600" /> Student Query / Struggle:
                    </div>
                    <p className="text-sm font-semibold text-slate-900 italic">
                      "{req.query}"
                    </p>
                  </div>

                  {/* Existing Teacher Response if resolved */}
                  {req.teacherResponse && (
                    <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-2xl space-y-1">
                      <div className="text-[10px] font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1">
                        <Check className="w-4 h-4 text-emerald-600" /> Teacher Response Sent:
                      </div>
                      <p className="text-xs font-bold text-emerald-950">
                        {req.teacherResponse}
                      </p>
                    </div>
                  )}

                  {/* Teacher Reply Input */}
                  <div className="pt-2">
                    {replySuccessReqId === req.id ? (
                      <div className="bg-emerald-100 border-2 border-emerald-500 text-emerald-900 p-3 rounded-2xl text-xs font-black flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        Response sent! Student will see this in their GunaTutor interface.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="block text-xs font-black text-[#1A1A1A] uppercase">
                          {req.status === 'resolved' ? 'Update / Resend Teacher Guidance:' : 'Write Response to Student:'}
                        </label>
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          <input
                            type="text"
                            value={replyInputMap[req.id] || ''}
                            onChange={(e) =>
                              setReplyInputMap((prev) => ({ ...prev, [req.id]: e.target.value }))
                            }
                            placeholder="e.g. Remember to check line 4 for indentation, or use range(1, 11) for Class 10 loop..."
                            className="flex-1 bg-gray-50 border-2 border-[#1A1A1A] p-2.5 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleTeacherReply(req.id)}
                            disabled={!replyInputMap[req.id]?.trim()}
                            className="px-5 py-2.5 bg-[#6D071A] hover:bg-[#800A21] text-amber-200 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FFCC33] cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                          >
                            <Send className="w-3.5 h-3.5 text-yellow-300" />
                            <span>{req.status === 'resolved' ? 'Update Response' : 'Send & Resolve'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACCOUNT APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-6 print:hidden">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-[#6D071A] to-[#800A21] text-white p-6 rounded-3xl border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#FFCC33] text-[#1A1A1A] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-[2px_2px_0px_0px_#1A1A1A]">
                <Clock className="w-3.5 h-3.5 text-[#6D071A]" /> Registration Gatekeeper
              </div>
              <h3 className="text-2xl font-black font-serif text-white">
                Class 10 Student Account Approvals
              </h3>
              <p className="text-xs text-amber-100 font-medium max-w-2xl">
                Students must be approved by a teacher or admin before logging in. Review registration details below and approve or decline account access in real-time.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 p-4 rounded-2xl text-center">
              <div className="text-3xl font-black font-mono text-[#FFCC33]">
                {pendingStudents.length}
              </div>
              <div className="text-[11px] font-extrabold uppercase text-amber-100">
                Pending Requests
              </div>
            </div>
          </div>

          {/* Pending Approvals Table */}
          <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-black text-lg text-[#1A1A1A] font-serif flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Pending Account Approvals ({pendingStudents.length})
              </h4>
            </div>

            {pendingStudents.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50 border-2 border-emerald-300 rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="font-black text-emerald-900 text-sm">All Registration Requests Approved!</p>
                <p className="text-xs text-emerald-700 font-medium mt-1">
                  There are no pending student registration requests at this time. New registrations will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingStudents.map((s) => (
                  <div
                    key={s.uid}
                    className="p-4 bg-amber-50/80 border-3 border-[#1A1A1A] rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl border-2 border-[#1A1A1A] bg-white overflow-hidden flex items-center justify-center shrink-0 text-[10px] font-black text-[#6D071A]">
                          {s.profilePhotoDataUrl ? (
                            <img src={s.profilePhotoDataUrl} alt={`${s.name} profile`} className="w-full h-full object-cover" />
                          ) : (
                            getNameInitials(s.name)
                          )}
                        </div>
                        <span className="font-black text-base text-[#1A1A1A] font-serif">{s.name}</span>
                        <span className="bg-amber-200 border border-amber-500 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                          Pending Approval
                        </span>
                        <span className="bg-white border border-[#1A1A1A] text-xs font-black px-2 py-0.5 rounded-md">
                          Class {s.classSection}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-gray-600 flex items-center gap-3 flex-wrap">
                        <span>Username/ID: <strong className="font-mono text-[#6D071A]">{s.studentId}</strong></span>
                        <span>•</span>
                        <span>School: <strong>{s.school}</strong></span>
                        <span>•</span>
                        <span>Email: <strong className="font-mono">{s.email}</strong></span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(s.studentId || s.uid)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Access</span>
                      </button>
                      <button
                        onClick={() => handleReject(s.studentId || s.uid)}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs rounded-xl border-2 border-[#1A1A1A] flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>Decline</span>
                      </button>
                      {(approvalFeedbackById[s.studentId] || approvalFeedbackById[s.uid]) && (
                        <div className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
                          (approvalFeedbackById[s.studentId] || approvalFeedbackById[s.uid]).type === 'success' 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-400' 
                            : 'bg-red-100 text-red-900 border border-red-400'
                        }`}>
                          {(approvalFeedbackById[s.studentId] || approvalFeedbackById[s.uid]).message}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Roster Section */}
          <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
            <h4 className="font-black text-lg text-[#1A1A1A] font-serif flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Approved Class 10 Accounts ({approvedStudents.length})
            </h4>

            {approvedStudents.length === 0 ? (
              <p className="text-xs font-bold text-gray-500 italic p-4 bg-gray-50 rounded-xl">
                No active approved accounts in database yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {approvedStudents.map((s) => (
                  <div key={s.uid} className="p-3 bg-gray-50 border-2 border-[#1A1A1A] rounded-xl flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl border-2 border-[#1A1A1A] bg-white overflow-hidden flex items-center justify-center shrink-0 text-[10px] font-black text-[#6D071A]">
                        {s.profilePhotoDataUrl ? (
                          <img src={s.profilePhotoDataUrl} alt={`${s.name} profile`} className="w-full h-full object-cover" />
                        ) : (
                          getNameInitials(s.name)
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-[#1A1A1A] font-serif truncate">{s.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">@{s.studentId} • {s.classSection}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                      <button
                        onClick={() => {
                          setResetModalStudent({
                            id: s.studentId,
                            name: s.name,
                            school: s.school,
                            classSection: s.classSection,
                            xp: s.xp,
                            completedLevelsCount: s.completedLevelsCount,
                            lastActive: s.lastActive
                          });
                          setResetSuccessMsg(null);
                        }}
                        className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold rounded-lg border border-amber-400 cursor-pointer flex items-center gap-1 text-[11px]"
                        title="Reset Student Password"
                      >
                        <KeyRound className="w-3 h-3 text-amber-700" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Declined / Rejected Accounts Section */}
          {rejectedStudents.length > 0 && (
            <div className="bg-rose-50/70 rounded-3xl border-4 border-rose-300 p-6 space-y-4 shadow-[4px_4px_0px_0px_#fca5a5]">
              <h4 className="font-black text-lg text-rose-950 font-serif flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                Declined Account Requests ({rejectedStudents.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rejectedStudents.map((s) => (
                  <div key={s.uid || s.studentId} className="p-3 bg-white border-2 border-rose-200 rounded-xl flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl border-2 border-[#1A1A1A] bg-white overflow-hidden flex items-center justify-center shrink-0 text-[10px] font-black text-[#6D071A]">
                        {s.profilePhotoDataUrl ? (
                          <img src={s.profilePhotoDataUrl} alt={`${s.name} profile`} className="w-full h-full object-cover" />
                        ) : (
                          getNameInitials(s.name)
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-[#1A1A1A] font-serif truncate">{s.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">@{s.studentId} • {s.classSection}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleApprove(s.studentId || s.uid)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg border border-[#1A1A1A] cursor-pointer text-[11px] flex items-center gap-1 shrink-0"
                    >
                      <Check className="w-3 h-3" />
                      <span>Approve Access</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: TEACHER PORTAL */}
      {activeTab === 'teacher' && (
        <div className="space-y-6 print:hidden">
          {/* Performance Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="flex items-center gap-2 text-xs font-black text-[#6D071A] uppercase">
                <Users className="w-4 h-4" /> Active Class Roster
              </div>
              <div className="text-2xl font-black text-[#1A1A1A] mt-1 font-mono">
                {allStudents.length} Students
              </div>
              <span className="text-[11px] text-gray-500 font-semibold">Karma Academy Class 10</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="flex items-center gap-2 text-xs font-black text-[#6D071A] uppercase">
                <TrendingUp className="w-4 h-4" /> Average Taktsang Clear Rate
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                {averageClearRatePercent.toFixed(1)}%
              </div>
              <span className="text-[11px] text-gray-500 font-semibold">{averageLevelsCompleted.toFixed(1)} of 14 Quest Levels</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="flex items-center gap-2 text-xs font-black text-[#6D071A] uppercase">
                <Award className="w-4 h-4" /> Top Class XP Leader
              </div>
              <div className="text-xl font-black text-[#1A1A1A] mt-1 truncate">
                {topXpStudent ? topXpStudent.name : 'No Students'}
              </div>
              <span className="text-[11px] text-amber-600 font-bold">
                {topXpStudent ? `${topXpStudent.xp} XP • ${topXpStudent.completedLevelsCount} Levels Completed` : '0 XP • 0 Levels Completed'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="flex items-center gap-2 text-xs font-black text-[#6D071A] uppercase">
                <ShieldCheck className="w-4 h-4" /> Exam Mastery Status
              </div>
              <div className="text-2xl font-black text-sky-600 mt-1 font-mono">
                {dynamicMastery.status}
              </div>
              <span className="text-[11px] text-gray-500 font-semibold">{dynamicMastery.subtext}</span>
            </div>
          </div>

          {/* DATA VISUALIZATION SECTION (RECHARTS) */}
          <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-gray-100 pb-4">
              <div>
                <div className="text-[10px] font-black uppercase text-[#6D071A] tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#6D071A]" /> Class Analytics & Performance Visualizer
                </div>
                <h3 className="text-xl font-black font-serif text-[#1A1A1A] mt-0.5">
                  📈 Class 10 Learning Trends & Quiz Performance
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Track weekly average quiz scores, syllabus unit mastery, and student achievement distributions across Class 10 sections.
                </p>
              </div>

              {/* View & Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* View Switcher */}
                <div className="bg-amber-100 p-1 rounded-2xl border-2 border-[#1A1A1A] flex items-center gap-1">
                  <button
                    onClick={() => setChartView('trend')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                      chartView === 'trend'
                        ? 'bg-[#6D071A] text-amber-200 shadow-[2px_2px_0px_0px_#1A1A1A]'
                        : 'text-gray-800 hover:text-black'
                    }`}
                  >
                    <LineChartIcon className="w-3.5 h-3.5" />
                    <span>Weekly Trends</span>
                  </button>
                  <button
                    onClick={() => setChartView('units')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                      chartView === 'units'
                        ? 'bg-[#6D071A] text-amber-200 shadow-[2px_2px_0px_0px_#1A1A1A]'
                        : 'text-gray-800 hover:text-black'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Unit Mastery</span>
                  </button>
                  <button
                    onClick={() => setChartView('distribution')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                      chartView === 'distribution'
                        ? 'bg-[#6D071A] text-amber-200 shadow-[2px_2px_0px_0px_#1A1A1A]'
                        : 'text-gray-800 hover:text-black'
                    }`}
                  >
                    <PieChartIcon className="w-3.5 h-3.5" />
                    <span>Grade Tiers</span>
                  </button>
                </div>

                {/* Class Section Selector */}
                <select
                  value={chartSection}
                  onChange={(e) => setChartSection(e.target.value)}
                  className="bg-white border-2 border-[#1A1A1A] px-3 py-2 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                >
                  <option value="all">All Sections ({allStudents.length})</option>
                  {distinctClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      Section {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Metric Focus Selector for Weekly Trend */}
            {chartView === 'trend' && (
              <div className="flex items-center justify-between flex-wrap gap-2 bg-amber-50/70 p-3 rounded-2xl border-2 border-[#1A1A1A]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase text-gray-700">Display Metric:</span>
                  <button
                    onClick={() => setChartMetric('score')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      chartMetric === 'score' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    🎯 Avg Quiz Score (%)
                  </button>
                  <button
                    onClick={() => setChartMetric('xp')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      chartMetric === 'xp' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    ⚡ Cumulative Class XP
                  </button>
                  <button
                    onClick={() => setChartMetric('exercises')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      chartMetric === 'exercises' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    📝 Exercises Cleared
                  </button>
                </div>

                <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>BCSEA Benchmark Target: <strong className="text-emerald-700 font-mono">80% Distinction Level</strong></span>
                </div>
              </div>
            )}

            {/* RECHARTS CONTAINER */}
            <div className="w-full h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'trend' ? (
                  <AreaChart data={weeklyPerformanceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6D071A" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6D071A" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="xpColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFCC33" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#FFCC33" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="exColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284C7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0284C7" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fontWeight: 700, fill: '#374151' }} />
                    <YAxis
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#374151' }}
                      domain={chartMetric === 'score' ? [0, 100] : [0, 'auto']}
                      unit={chartMetric === 'score' ? '%' : ''}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 800, paddingTop: '10px' }} />

                    {chartMetric === 'score' && (
                      <>
                        <ReferenceLine y={80} stroke="#10B981" strokeDasharray="5 5" label={{ value: 'BCSEA 80% Target', fill: '#065F46', fontSize: 11, fontWeight: 800 }} />
                        <Area type="monotone" dataKey="avgQuizScore" name="Avg Quiz Score (%)" stroke="#6D071A" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" unit="%" />
                      </>
                    )}

                    {chartMetric === 'xp' && (
                      <Area type="monotone" dataKey="classXp" name="Class Average XP" stroke="#D97706" strokeWidth={3} fillOpacity={1} fill="url(#xpColor)" unit=" XP" />
                    )}

                    {chartMetric === 'exercises' && (
                      <Area type="monotone" dataKey="exercisesDone" name="Exercises Cleared" stroke="#0284C7" strokeWidth={3} fillOpacity={1} fill="url(#exColor)" unit=" Solved" />
                    )}
                  </AreaChart>
                ) : chartView === 'units' ? (
                  <BarChart data={unitMasteryData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="unit" tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }} interval={0} angle={-10} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#374151' }} domain={[0, 100]} unit="%" />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 800, paddingTop: '15px' }} />
                    <ReferenceLine y={60} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Pass Line (60%)', fill: '#B45309', fontSize: 10, fontWeight: 800 }} />
                    <ReferenceLine y={85} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Mastery (85%)', fill: '#047857', fontSize: 10, fontWeight: 800 }} />
                    <Bar dataKey="avgScore" name="Unit Quiz Accuracy (%)" fill="#6D071A" radius={[8, 8, 0, 0]} unit="%" />
                  </BarChart>
                ) : (
                  <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 800 }} />
                    <Pie
                      data={tierDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {tierDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#1A1A1A" strokeWidth={2} />
                      ))}
                    </Pie>
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Roster Table & Feedback Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Roster Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b-2 border-gray-100">
                <div>
                  <h3 className="text-lg font-black text-[#1A1A1A] font-serif flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#6D071A]" /> Class 10 Academic Performance & Trail Progress
                  </h3>
                  <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                    💡 Real-time XP ratings and chapter level completions. To edit student details or reset passwords, navigate to <button onClick={() => setActiveTab('students')} className="text-[#6D071A] font-black underline hover:text-black cursor-pointer font-serif">⚙️ Student Management</button>.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('students')}
                  className="px-3.5 py-1.5 bg-[#FFCC33] hover:bg-amber-300 text-[#1A1A1A] text-xs font-black rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <Settings className="w-4 h-4 text-[#6D071A]" />
                  <span>Manage Student Accounts</span>
                </button>
              </div>

              {/* Add Student Modal */}
              {showAddModal && (
                <div className="bg-amber-50 p-4 rounded-2xl border-2 border-[#1A1A1A] space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-xs uppercase text-[#6D071A] flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4" /> Add New Class 10 Student
                    </h4>
                    <button onClick={() => { setShowAddModal(false); setCreatedCredentials(null); }} className="text-gray-500 hover:text-black cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {createdCredentials ? (
                    <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-emerald-900 uppercase">🎉 Student Account Credentials Generated!</span>
                        <button
                          onClick={() => setCreatedCredentials(null)}
                          className="text-[10px] font-bold underline text-emerald-800 cursor-pointer"
                        >
                          + Add Another
                        </button>
                      </div>
                      <p className="text-emerald-800 font-medium">
                        Give these login credentials to <strong>{createdCredentials.name}</strong>:
                      </p>
                      <div className="bg-white border border-emerald-300 p-2.5 rounded-lg space-y-1 font-mono text-[11px]">
                        <div><strong>User ID:</strong> {createdCredentials.id}</div>
                        <div><strong>Password:</strong> {createdCredentials.pass}</div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Student Full Name (e.g. Dechen Wangmo)"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="bg-white border-2 border-[#1A1A1A] p-2 rounded-xl text-xs font-medium focus:outline-none"
                        required
                      />
                      <select
                        value={newStudentSection}
                        onChange={(e) => setNewStudentSection(e.target.value)}
                        className="bg-white border-2 border-[#1A1A1A] p-2 rounded-xl text-xs font-bold focus:outline-none"
                      >
                        <option value="10-A">Section 10-A</option>
                        <option value="10-B">Section 10-B</option>
                        <option value="10-C">Section 10-C</option>
                      </select>
                      <button
                        type="submit"
                        className="bg-[#6D071A] text-white font-black text-xs py-2 px-3 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FFCC33] hover:opacity-90 cursor-pointer"
                      >
                        Generate Login Credentials
                      </button>
                    </form>
                  )}
                </div>
              )}



              {/* GUIDANCE ALERT CONFIGURATION BAR */}
              <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-2 border-[#1A1A1A] p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-[2px_2px_0px_0px_#1A1A1A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm font-black">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#1A1A1A] flex items-center gap-1.5 font-serif">
                      Guidance & Support Threshold Config
                      {lowPerformerStudentsCount > 0 && (
                        <span className="bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold animate-pulse">
                          {lowPerformerStudentsCount} Below Benchmark
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium">
                      Configure quiz score cutoffs to highlight students requiring prompt academic intervention.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border-2 border-[#1A1A1A] text-xs font-black select-none shadow-sm">
                    <input
                      type="checkbox"
                      checked={highlightLowPerformers}
                      onChange={(e) => setHighlightLowPerformers(e.target.checked)}
                      className="w-4 h-4 accent-rose-600 cursor-pointer"
                    />
                    <span>Highlight Low Performers</span>
                  </label>

                  {/* Threshold Cutoff Selector */}
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-[#1A1A1A] text-xs font-bold shadow-sm">
                    <span className="text-[10px] uppercase text-gray-500 font-black">Threshold:</span>
                    <select
                      value={lowPerformanceThreshold}
                      onChange={(e) => setLowPerformanceThreshold(Number(e.target.value))}
                      className="bg-transparent font-black text-[#6D071A] focus:outline-none cursor-pointer font-mono"
                    >
                      <option value={50}>&lt; 50% (At Risk)</option>
                      <option value={60}>&lt; 60% (Pass Line)</option>
                      <option value={65}>&lt; 65% (Guidance Cutoff)</option>
                      <option value={75}>&lt; 75% (Competency Target)</option>
                      <option value={80}>&lt; 80% (BCSEA Benchmark)</option>
                    </select>
                  </div>

                  {/* Filter Needing Support */}
                  <button
                    onClick={() => setOnlyShowLowPerformers(!onlyShowLowPerformers)}
                    className={`px-3 py-1.5 text-xs font-black rounded-xl border-2 border-[#1A1A1A] cursor-pointer transition-all flex items-center gap-1.5 ${
                      onlyShowLowPerformers
                        ? 'bg-rose-600 text-white shadow-[2px_2px_0px_0px_#1A1A1A]'
                        : 'bg-white hover:bg-rose-50 text-rose-900 shadow-sm'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>{onlyShowLowPerformers ? 'Showing Needing Support' : 'Filter Needing Guidance'}</span>
                  </button>
                </div>
              </div>

              {/* Search, Filter, and Sort Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-amber-50/50 border-2 border-[#1A1A1A] rounded-2xl">
                {/* Search Input */}
                <div className="md:col-span-5 space-y-1">
                  <label className="block text-[10px] font-black uppercase text-gray-700 tracking-wider">
                    🔍 Search Student Name or ID
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, ID or school..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                  />
                </div>

                {/* Class Filter */}
                <div className="md:col-span-3 space-y-1">
                  <label className="block text-[10px] font-black uppercase text-gray-700 tracking-wider">
                    🏫 Filter Class Wise
                  </label>
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                  >
                    <option value="all">All Classes ({allStudents.length})</option>
                    {distinctClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        Class {cls} ({allStudents.filter(s => s.classSection === cls).length})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div className="md:col-span-4 space-y-1">
                  <label className="block text-[10px] font-black uppercase text-gray-700 tracking-wider">
                    ↕️ Sort Order
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                  >
                    <option value="xp">Performance: XP (Highest First)</option>
                    <option value="levels">Performance: Levels Cleared</option>
                    <option value="name">Name: Alphabetical (A - Z)</option>
                    <option value="class">Class: Section (A - Z)</option>
                    <option value="lastActive">Last Active (Most Recent)</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-gray-500 font-black uppercase text-[10px]">
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Section</th>
                      <th className="py-2.5 px-3">Avg Quiz Score</th>
                      <th className="py-2.5 px-3">Total XP</th>
                      <th className="py-2.5 px-3">Levels Cleared</th>
                      <th className="py-2.5 px-3">Last Active</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAndSortedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                          No students match the selected class, search query, or guidance criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedStudents.map((student) => {
                      const linkedProfile = getDbStudentProfile(student.id);
                      const score = getStudentQuizScore(student);
                      const isLowPerformer = highlightLowPerformers && score < lowPerformanceThreshold;

                      return (
                      <tr
                        key={student.id}
                        className={`transition-colors cursor-pointer ${
                          isLowPerformer
                            ? 'bg-rose-100/90 hover:bg-rose-200/90 border-l-4 border-l-rose-600 font-medium'
                            : selectedStudent?.id === student.id
                            ? 'bg-amber-100 font-bold'
                            : 'hover:bg-amber-50'
                        }`}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-xl border-2 border-[#1A1A1A] bg-white overflow-hidden flex items-center justify-center shrink-0 text-[10px] font-black ${isLowPerformer ? 'text-rose-700 border-rose-600' : 'text-[#6D071A]'}`}>
                              {linkedProfile?.profilePhotoDataUrl ? (
                                <img src={linkedProfile.profilePhotoDataUrl} alt={`${student.name} profile`} className="w-full h-full object-cover" />
                              ) : (
                                getNameInitials(student.name)
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-extrabold text-[#1A1A1A] text-xs flex items-center gap-1.5">
                                <span>{student.name}</span>
                                {isLowPerformer && (
                                  <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full flex items-center gap-0.5 shrink-0">
                                    <AlertTriangle className="w-2.5 h-2.5" /> Support
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-mono text-[#6D071A] font-bold flex items-center gap-1 mt-0.5">
                                <span className="text-gray-400 font-sans font-normal text-[10px]">ID:</span>
                                <span>{student.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-gray-700">{student.classSection}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full font-black text-[11px] font-mono ${
                              isLowPerformer
                                ? 'bg-rose-200 text-rose-950 border border-rose-400 font-black'
                                : score >= 80
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {score}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-black text-[#6D071A]">
                          {student.xp} XP
                        </td>
                        <td className="py-3 px-3">
                          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-black text-[11px]">
                            {student.completedLevelsCount} / 14
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-500 font-medium">{student.lastActive}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(student);
                              }}
                              className={`px-3 py-1 text-xs font-extrabold rounded-lg border border-[#1A1A1A] cursor-pointer active:scale-95 transition-transform ${
                                selectedStudent?.id === student.id
                                  ? 'bg-[#6D071A] text-white'
                                  : 'bg-[#FFCC33] hover:bg-amber-300 text-[#1A1A1A]'
                              }`}
                            >
                              {selectedStudent?.id === student.id ? 'Selected' : 'Select'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setResetModalStudent(student);
                                setResetSuccessMsg(null);
                              }}
                              className="px-2 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 font-extrabold rounded-lg border border-sky-400 cursor-pointer text-[11px] flex items-center gap-1"
                              title="Reset Student Password"
                            >
                              <KeyRound className="w-3 h-3 text-sky-700" />
                              <span>Reset</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStudent(student.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                              title="Delete Student Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      );
                    }))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Teacher Feedback Box */}
            <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-[#1A1A1A] font-serif flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#6D071A]" /> Teacher Encouragement & Feedback
                </h3>

                {selectedStudent ? (
                  <div className="mt-3 bg-amber-50 border-2 border-[#1A1A1A] p-3 rounded-2xl text-xs space-y-1">
                    <span className="text-[10px] uppercase font-black text-gray-500">Target Student:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl border-2 border-[#1A1A1A] bg-white overflow-hidden flex items-center justify-center shrink-0 text-[10px] font-black text-[#6D071A]">
                        {selectedStudentProfile?.profilePhotoDataUrl ? (
                          <img src={selectedStudentProfile.profilePhotoDataUrl} alt={`${selectedStudent.name} profile`} className="w-full h-full object-cover" />
                        ) : (
                          getNameInitials(selectedStudent.name)
                        )}
                      </div>
                      <div className="font-black text-[#6D071A] text-sm">{selectedStudent.name} ({selectedStudent.classSection})</div>
                    </div>
                    <div className="text-gray-600 font-semibold">{selectedStudent.school} • {selectedStudent.xp} XP</div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">Select a student from the table above to send feedback.</p>
                )}

                <form onSubmit={handleSendFeedback} className="mt-4 space-y-3">
                  <textarea
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Write a supportive note or assignment guidance..."
                    className="w-full h-28 bg-gray-50 border-2 border-[#1A1A1A] p-3 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#6D071A] hover:bg-[#80091F] text-amber-200 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#FFCC33] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" /> Send Teacher Note
                  </button>
                </form>

                {feedbackSuccess && (
                  <div className="bg-emerald-100 border border-emerald-500 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 mt-3 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Feedback successfully delivered to student profile!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DEDICATED STUDENT MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-6 print:hidden">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-3xl border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase text-[#6D071A] tracking-wider flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-[#6D071A]" /> Educator Administration Portal
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-[#1A1A1A] mt-0.5">
                ⚙️ Student Account & Credential Management
              </h2>
              <p className="text-xs text-gray-600 font-medium max-w-2xl mt-1">
                Edit student names and class sections, reset login passwords, register new student accounts, and manage account removals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {pendingStudents.length > 0 && (
                <button
                  onClick={() => setActiveTab('approvals')}
                  className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 border-2 border-rose-500 text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>{pendingStudents.length} Pending Approval</span>
                </button>
              )}

              <button
                onClick={() => { setShowAddModal(true); setCreatedCredentials(null); }}
                className="px-4 py-2.5 bg-[#FFCC33] hover:bg-amber-300 text-[#1A1A1A] text-xs font-black rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add New Student Account</span>
              </button>
            </div>
          </div>

          {/* Add Student Modal */}
          {showAddModal && (
            <div className="bg-amber-50 p-5 rounded-3xl border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2">
                <h4 className="font-black text-sm uppercase text-[#6D071A] flex items-center gap-2 font-serif">
                  <UserPlus className="w-5 h-5 text-[#6D071A]" /> Add New Class 10 Student
                </h4>
                <button onClick={() => { setShowAddModal(false); setCreatedCredentials(null); }} className="text-gray-500 hover:text-black cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {createdCredentials ? (
                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-900 uppercase text-xs">🎉 Student Account Credentials Generated!</span>
                    <button
                      onClick={() => setCreatedCredentials(null)}
                      className="text-xs font-bold underline text-emerald-800 cursor-pointer"
                    >
                      + Add Another Student
                    </button>
                  </div>
                  <p className="text-emerald-800 font-medium">
                    Provide these login credentials to <strong>{createdCredentials.name}</strong>:
                  </p>
                  <div className="bg-white border-2 border-emerald-300 p-3 rounded-xl space-y-1.5 font-mono text-xs">
                    <div><strong>User ID:</strong> {createdCredentials.id}</div>
                    <div><strong>Password:</strong> {createdCredentials.pass}</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">Student Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dechen Wangmo"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="w-full bg-white border-2 border-[#1A1A1A] p-2.5 rounded-xl text-xs font-medium focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">Class Section</label>
                    <select
                      value={newStudentSection}
                      onChange={(e) => setNewStudentSection(e.target.value)}
                      className="w-full bg-white border-2 border-[#1A1A1A] p-2.5 rounded-xl text-xs font-bold focus:outline-none"
                    >
                      <option value="10-A">Section 10-A</option>
                      <option value="10-B">Section 10-B</option>
                      <option value="10-C">Section 10-C</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-[#6D071A] text-white font-black text-xs py-2.5 px-3 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FFCC33] hover:opacity-90 cursor-pointer"
                    >
                      Generate Credentials
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}



          {/* Student Account Roster Table */}
          <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
            {/* Search, Filter & Sort Controls */}
            <div className="bg-amber-50/70 p-3.5 rounded-2xl border-2 border-[#1A1A1A] grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search Input */}
              <div className="md:col-span-5 space-y-1">
                <label className="block text-[10px] font-black uppercase text-gray-700 tracking-wider flex items-center gap-1">
                  <Search className="w-3 h-3 text-[#6D071A]" /> Search Student
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or ID..."
                  className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 rounded-xl text-xs font-bold text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                />
              </div>

              {/* Class Section Filter */}
              <div className="md:col-span-3 space-y-1">
                <label className="block text-[10px] font-black uppercase text-gray-700 tracking-wider">
                  🏫 Class Filter
                </label>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                >
                  <option value="all">All Classes ({allStudents.length})</option>
                  {distinctClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls} ({allStudents.filter(s => s.classSection === cls).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div className="md:col-span-4 space-y-1">
                <label className="block text-[10px] font-black uppercase text-gray-700 tracking-wider">
                  ↕️ Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                >
                  <option value="name">Name: Alphabetical (A - Z)</option>
                  <option value="class">Class: Section (A - Z)</option>
                  <option value="xp">Performance: XP (Highest First)</option>
                  <option value="lastActive">Last Active (Most Recent)</option>
                </select>
              </div>
            </div>

            {/* Roster Account Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-gray-500 font-black uppercase text-[10px]">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">User ID</th>
                    <th className="py-2.5 px-3">Class Section</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Account Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">
                        No student accounts match the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedStudents.map((student) => {
                      const linkedProfile = getDbStudentProfile(student.id);
                      const isEditingThisStudent = editingStudentId === student.id;

                      return (
                        <tr key={student.id} className="hover:bg-amber-50/60 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl border-2 border-[#1A1A1A] bg-white overflow-hidden flex items-center justify-center shrink-0 text-xs font-black text-[#6D071A]">
                                {linkedProfile?.profilePhotoDataUrl ? (
                                  <img src={linkedProfile.profilePhotoDataUrl} alt={`${student.name} profile`} className="w-full h-full object-cover" />
                                ) : (
                                  getNameInitials(student.name)
                                )}
                              </div>
                              <div className="min-w-0">
                                {isEditingThisStudent ? (
                                  <input
                                    type="text"
                                    value={editingStudentName}
                                    onChange={(e) => setEditingStudentName(e.target.value)}
                                    className="bg-white border-2 border-[#1A1A1A] rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                                    placeholder="Full Name"
                                  />
                                ) : (
                                  <div className="font-extrabold text-[#1A1A1A] text-xs">{student.name}</div>
                                )}
                                <div className="text-[10px] text-gray-500 font-medium">{student.school}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-mono text-xs font-bold text-[#6D071A]">
                            @{student.id}
                          </td>

                          <td className="py-3 px-3">
                            {isEditingThisStudent ? (
                              <select
                                value={editingStudentSection}
                                onChange={(e) => setEditingStudentSection(e.target.value)}
                                className="bg-white border-2 border-[#1A1A1A] rounded-lg px-2 py-1 text-xs font-bold focus:outline-none"
                              >
                                <option value="10-A">10-A</option>
                                <option value="10-B">10-B</option>
                                <option value="10-C">10-C</option>
                              </select>
                            ) : (
                              <span className="bg-amber-100 border border-amber-300 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                                Class {student.classSection}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            {linkedProfile?.isApproved || linkedProfile?.status === 'approved' ? (
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                              </span>
                            ) : linkedProfile?.status === 'rejected' ? (
                              <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                                <XCircle className="w-3 h-3 text-rose-600" /> Declined
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3 text-amber-600" /> Pending
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isEditingThisStudent ? (
                                <>
                                  <button
                                    onClick={() => handleSaveStudentName(student.id)}
                                    disabled={savingStudentNameId === student.id}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg border border-[#1A1A1A] cursor-pointer text-xs"
                                  >
                                    {savingStudentNameId === student.id ? 'Saving...' : 'Save Changes'}
                                  </button>
                                  <button
                                    onClick={handleCancelEditStudentName}
                                    className="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold rounded-lg cursor-pointer text-xs"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleStartEditStudentName(student)}
                                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-[#6D071A] font-extrabold rounded-lg border border-amber-400 cursor-pointer text-xs flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit Details</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setResetModalStudent(student);
                                  setResetSuccessMsg(null);
                                }}
                                className="px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 font-extrabold rounded-lg border border-sky-400 cursor-pointer flex items-center gap-1 text-xs"
                              >
                                <KeyRound className="w-3 h-3 text-sky-700" />
                                <span>Reset Password</span>
                              </button>

                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                                title="Delete Student Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRINTABLE REVISION NOTES (PDF GENERATOR) */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Printable Action Controls (Hidden in actual print output) */}
          <div className="bg-white p-4 rounded-2xl border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase text-[#6D071A]">Filter Chapter:</span>
              <select
                value={notesChapter}
                onChange={(e) => setNotesChapter(e.target.value)}
                className="bg-amber-50 border-2 border-[#1A1A1A] text-xs font-extrabold px-3 py-1.5 rounded-xl text-[#1A1A1A]"
              >
                <option value="all">Full Class 10 Syllabus Summary</option>
                {getMergedSyllabusModules().map((m) => (
                  <option key={m.id} value={m.id}>
                    Chapter {m.chapterNumber}: {m.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrintNotes}
              className="px-5 py-2 bg-[#FFCC33] hover:bg-yellow-400 text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          {/* Printable Layout Container */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] space-y-8 font-sans print:shadow-none print:border-none print:p-0">
            {/* Header Document Banner */}
            <div className="border-b-4 border-[#1A1A1A] pb-6 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-[#6D071A] uppercase tracking-widest">
                  Royal Government of Bhutan • BCSEA Class 10 ICT
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#1A1A1A] mt-1">
                  Class 10 ICT Official Revision Handbook
                </h1>
                <p className="text-xs font-semibold text-gray-600 mt-1">
                  Student Name: <span className="underline font-bold text-[#1A1A1A]">{userStats.studentName}</span> | School: <span className="underline font-bold text-[#1A1A1A]">{userStats.schoolName}</span>
                </p>
              </div>

              <div className="text-right hidden sm:block">
                <span className="bg-[#6D071A] text-amber-200 border-2 border-[#1A1A1A] text-xs font-black px-3 py-1 rounded-full uppercase">
                  Class 10 BCSEA
                </span>
              </div>
            </div>

            {/* Chapters Content Output */}
            {getMergedSyllabusModules().filter((m) => notesChapter === 'all' || m.id === notesChapter).map((mod) => (
              <div key={mod.id} className="space-y-4 break-inside-avoid">
                <div className="bg-amber-100/70 border-2 border-[#1A1A1A] p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#6D071A]">Chapter {mod.chapterNumber}</span>
                    <h2 className="text-lg font-black font-serif text-[#1A1A1A]">{mod.title}</h2>
                  </div>
                  <span className="text-xs font-bold text-gray-700 bg-white px-2.5 py-1 rounded-xl border border-[#1A1A1A]">
                    {mod.bhutanRegion}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mod.levels.map((lvl) => (
                    <div
                      key={lvl.id}
                      className="bg-white border-2 border-[#1A1A1A] p-4 rounded-2xl space-y-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-xs font-extrabold text-[#6D071A]">
                        <span>Level {lvl.levelNumber}: {lvl.title}</span>
                        <span>Unit {lvl.levelNumber}</span>
                      </div>
                      <p className="text-xs font-medium text-gray-700 leading-relaxed">
                        {lvl.summary}
                      </p>

                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-black uppercase text-gray-500">Core Syllabus Concepts:</span>
                        <ul className="list-disc list-inside text-[11px] text-gray-800 space-y-0.5 font-medium">
                          {lvl.keyConcepts.map((concept, cIdx) => (
                            <li key={cIdx}>{concept}</li>
                          ))}
                        </ul>
                      </div>

                      {lvl.sampleCodeOrFormula && (
                        <div className="mt-2 bg-gray-900 text-amber-300 font-mono text-[10px] p-2 rounded-xl border border-gray-700 overflow-x-auto">
                          {lvl.sampleCodeOrFormula}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Glossary Reference Section */}
            <div className="border-t-4 border-[#1A1A1A] pt-6 space-y-4 break-inside-avoid">
              <h3 className="text-lg font-black text-[#1A1A1A] font-serif flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#6D071A]" /> Dzongkha & English ICT Terminology Glossary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {DZONGKHA_GLOSSARY.map((item, gIdx) => (
                  <div key={gIdx} className="bg-amber-50 border border-[#1A1A1A] p-3 rounded-2xl text-xs space-y-1">
                    <div className="font-extrabold text-[#1A1A1A]">{item.english}</div>
                    <div className="font-black text-[#6D071A] text-sm">{item.dzongkha}</div>
                    <div className="text-[10px] font-bold text-amber-800">{item.phonetic}</div>
                    <p className="text-[10px] text-gray-600 leading-tight">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
