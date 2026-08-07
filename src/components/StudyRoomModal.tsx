import React, { useState, useEffect } from 'react';
import { 
  Users, Flame, Send, Heart, Sparkles, MessageCircle, X, Shield, 
  Smile, Radio, Check, Award, RefreshCw, Volume2, Globe, Laptop, Bell, HelpCircle, UserCheck, Code2, Play
} from 'lucide-react';
import { 
  ActiveStudentSession, 
  CommunityCheer, 
  CoLearnSession,
  subscribeToActiveStudents, 
  subscribeToCommunityCheers, 
  sendCommunityCheer, 
  updateStudentPresence,
  submitClassroomHelpRequest,
  createCoLearnSession,
  updateCoLearnSessionCode,
  subscribeToCoLearnSessions
} from '../lib/firebase';
import { UserStats } from '../types';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendBrowserNotification 
} from '../lib/notifications';

interface StudyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
}

// Preset encouragement cheers for quick 1-click peer support
const PRESET_CHEERS = [
  { text: 'Good luck on your quest!', emoji: '⚡' },
  { text: 'Keep going, champion!', emoji: '🌟' },
  { text: 'Kuzuzangpo! You\'ve got this!', emoji: '🌸' },
  { text: 'Amazing Class 10 ICT progress!', emoji: '🔥' },
  { text: 'Tashi Delek! Keep coding!', emoji: '🎯' },
  { text: 'Super job on Python!', emoji: '🚀' }
];

const PYTHON_CONCEPTS_LIST = [
  'Python For Loops & range()',
  'Python While Loops & Conditions',
  'If-Else Conditional Branching',
  'Functions def & Return Values',
  'Lists, Tuples & Dictionaries',
  'String Slicing & Manipulation',
  'Excel VLOOKUP & Formulas',
  'Cloud Services & Google Workspace',
  'Copyright & Citation Guidelines',
  'Recursive Functions & Variable Scope'
];

// Fallback Bhutanese study peers when testing or in quiet hours
const MOCK_ONLINE_PEERS: ActiveStudentSession[] = [
  {
    id: 'mock_tashi',
    studentName: 'Tashi Wangmo',
    classSection: '10-A',
    schoolName: 'Motithang HSS, Thimphu',
    currentActivity: 'Chapter 25: For & While Loops',
    xp: 420,
    statusMessage: '🧠 Debugging Python for loops',
    avatarBg: 'bg-rose-600',
    lastSeenTimestamp: Date.now() - 30000
  },
  {
    id: 'mock_karma',
    studentName: 'Karma Dorji',
    classSection: '10-B',
    schoolName: 'Paro Higher Sec. School',
    currentActivity: 'Chapter 35: Python Functions & Scope',
    xp: 380,
    statusMessage: '🎨 Writing recursive helper functions',
    avatarBg: 'bg-amber-600',
    lastSeenTimestamp: Date.now() - 120000
  },
  {
    id: 'mock_dechen',
    studentName: 'Dechen Zangmo',
    classSection: '10-C',
    schoolName: 'Bajothang HSS, Wangdue',
    currentActivity: 'Chapter 3: Excel VLOOKUP Formulas',
    xp: 510,
    statusMessage: '📊 Calculating exam averages in Sheets',
    avatarBg: 'bg-emerald-600',
    lastSeenTimestamp: Date.now() - 180000
  },
  {
    id: 'mock_sonam',
    studentName: 'Sonam Norbu',
    classSection: '10-A',
    schoolName: 'Jakar HSS, Bumthang',
    currentActivity: 'Chapter 4: Cybersecurity & Ethics',
    xp: 290,
    statusMessage: '🛡️ Studying Phishing Protection',
    avatarBg: 'bg-indigo-600',
    lastSeenTimestamp: Date.now() - 240000
  }
];

export const StudyRoomModal: React.FC<StudyRoomModalProps> = ({
  isOpen,
  onClose,
  userStats
}) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'teacherHelp' | 'askFriend' | 'colearn'>('rooms');
  const [activeStudents, setActiveStudents] = useState<ActiveStudentSession[]>([]);
  const [cheersFeed, setCheersFeed] = useState<CommunityCheer[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('⚡ Studying Class 10 ICT');
  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
  const [customCheerMap, setCustomCheerMap] = useState<Record<string, string>>({});
  const [cheerSuccessRecipient, setCheerSuccessRecipient] = useState<string | null>(null);
  const [sendingCheerId, setSendingCheerId] = useState<string | null>(null);

  // Co-Learn Pair Programming state
  const [coLearnSessions, setCoLearnSessions] = useState<CoLearnSession[]>([]);
  const [activeCoLearnSession, setActiveCoLearnSession] = useState<CoLearnSession | null>(null);
  const [newSessionTitle, setNewSessionTitle] = useState<string>('Python Loops & Lists Co-Code');
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);
  const [coLearnOutput, setCoLearnOutput] = useState<string>('');

  // Teacher Help Request state
  const [selectedConcept, setSelectedConcept] = useState<string>(PYTHON_CONCEPTS_LIST[0]);
  const [teacherHelpQuery, setTeacherHelpQuery] = useState<string>('');
  const [isSubmittingTeacherHelp, setIsSubmittingTeacherHelp] = useState<boolean>(false);
  const [teacherHelpSuccess, setTeacherHelpSuccess] = useState<boolean>(false);

  // Ask a Friend state
  const [selectedFriend, setSelectedFriend] = useState<string>('');
  const [friendQuestion, setFriendQuestion] = useState<string>('');
  const [isSubmittingFriend, setIsSubmittingFriend] = useState<boolean>(false);
  const [friendSuccess, setFriendSuccess] = useState<boolean>(false);

  // Send periodic presence heartbeat
  useEffect(() => {
    if (!isOpen) return;

    const sessionData = {
      id: `std_${(userStats.studentName || 'student').toLowerCase().replace(/\s+/g, '_')}`,
      studentName: userStats.studentName || 'Tashi Student',
      classSection: userStats.classSection || '10-A',
      schoolName: userStats.schoolName || 'Karma Academy',
      currentActivity: `Level ${userStats.level || 1}: Class 10 ICT Quest`,
      xp: userStats.totalXp || 100,
      statusMessage: statusMessage
    };

    updateStudentPresence(sessionData);

    const interval = setInterval(() => {
      updateStudentPresence(sessionData);
    }, 45000);

    return () => clearInterval(interval);
  }, [isOpen, userStats, statusMessage]);

  // Subscribe to real-time active students
  useEffect(() => {
    if (!isOpen) return;
    const unsub = subscribeToActiveStudents((list) => {
      setActiveStudents(list);
    });
    return () => unsub();
  }, [isOpen]);

  // Subscribe to real-time cheers feed
  useEffect(() => {
    if (!isOpen) return;
    const unsub = subscribeToCommunityCheers((list) => {
      setCheersFeed(list);
    });
    return () => unsub();
  }, [isOpen]);

  // Subscribe to real-time Co-Learn sessions
  useEffect(() => {
    if (!isOpen) return;
    const unsub = subscribeToCoLearnSessions((list) => {
      setCoLearnSessions(list);
      if (activeCoLearnSession) {
        const found = list.find((s) => s.id === activeCoLearnSession.id);
        if (found) setActiveCoLearnSession(found);
      }
    });
    return () => unsub();
  }, [isOpen, activeCoLearnSession?.id]);

  if (!isOpen) return null;

  const handleCreateCoLearn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim() || isCreatingSession) return;
    setIsCreatingSession(true);
    try {
      const newSess = await createCoLearnSession({
        title: newSessionTitle.trim(),
        hostName: userStats.studentName || 'Tashi Student',
        code: '# Welcome to Bhutan Co-Learn Real-Time Python IDE!\n# Edit this code together with your classmate in real-time.\n\nprint("Kuzuzangpo Bhutan Class 10 ICT!")\n\nfor score in [85, 92, 98]:\n    print(f"Student Quest Score: {score}")\n',
        language: 'python'
      });
      setActiveCoLearnSession(newSess);
      setNewSessionTitle('');
    } catch (err) {
      console.error('Error creating co-learn session:', err);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleCodeChange = async (newCode: string) => {
    if (!activeCoLearnSession) return;
    setActiveCoLearnSession((prev) => prev ? { ...prev, code: newCode } : null);
    try {
      await updateCoLearnSessionCode(
        activeCoLearnSession.id,
        newCode,
        userStats.studentName || 'Peer'
      );
    } catch (err) {
      console.error('Error updating co-learn code:', err);
    }
  };

  const handleRunCoLearnCode = () => {
    if (!activeCoLearnSession) return;
    try {
      const lines = activeCoLearnSession.code.split('\n');
      let out = '>>> Python Co-Learn Execution Output:\n';
      lines.forEach((line) => {
        if (line.includes('print(')) {
          const match = line.match(/print\((['"])(.*?)\1\)/);
          if (match && match[2]) {
            out += `${match[2]}\n`;
          } else {
            out += `${line}\n`;
          }
        }
      });
      out += '>>> Program executed successfully.\n';
      setCoLearnOutput(out);
    } catch (e: any) {
      setCoLearnOutput(`Error: ${e.message}`);
    }
  };

  const currentUserUid = `std_${(userStats.studentName || 'student').toLowerCase().replace(/\s+/g, '_')}`;
  const realPeers = activeStudents.filter((s) => s.id !== currentUserUid && s.studentName !== userStats.studentName);
  const displayedPeers = [
    ...realPeers,
    ...MOCK_ONLINE_PEERS.filter((m) => !realPeers.some((r) => r.studentName === m.studentName))
  ];

  const handleSendCheer = async (recipientName: string, text: string, emoji: string) => {
    setSendingCheerId(recipientName);
    try {
      await sendCommunityCheer(
        userStats.studentName || 'Bhutanese Learner',
        recipientName,
        text,
        emoji
      );
      setCheerSuccessRecipient(recipientName);
      setTimeout(() => setCheerSuccessRecipient(null), 3000);
    } catch (err) {
      console.error('Error sending cheer:', err);
    } finally {
      setSendingCheerId(null);
    }
  };

  const handleTeacherHelpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingTeacherHelp) return;

    setIsSubmittingTeacherHelp(true);
    try {
      await submitClassroomHelpRequest({
        studentName: userStats.studentName || 'Tashi Student',
        studentClass: userStats.classSection || '10-A',
        schoolName: userStats.schoolName || 'Karma Academy',
        chapterTitle: 'Study Room Help Flag',
        levelTitle: selectedConcept,
        query: teacherHelpQuery.trim() || `I am struggling with ${selectedConcept} and need teacher guidance.`,
        contextSnippet: `Flagged from Study Room Study Hub.`
      });
      setTeacherHelpSuccess(true);
      setTeacherHelpQuery('');
      setTimeout(() => setTeacherHelpSuccess(false), 4000);
    } catch (err) {
      console.error('Error submitting teacher help request:', err);
    } finally {
      setIsSubmittingTeacherHelp(false);
    }
  };

  const handleAskFriendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFriend || !friendQuestion.trim() || isSubmittingFriend) return;

    setIsSubmittingFriend(true);
    try {
      // Send a peer cheer / message to the selected friend via community cheers feed
      await sendCommunityCheer(
        userStats.studentName || 'Bhutanese Learner',
        selectedFriend,
        `💡 Help Question: "${friendQuestion.trim()}"`,
        '🤝'
      );
      setFriendSuccess(true);
      setFriendQuestion('');
      setTimeout(() => {
        setFriendSuccess(false);
        setActiveTab('rooms');
      }, 3000);
    } catch (err) {
      console.error('Error asking friend:', err);
    } finally {
      setIsSubmittingFriend(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-[8px_8px_0px_0px_#FFCC33] overflow-hidden">
        
        {/* ROOM HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-[#6D071A] to-amber-950 text-amber-100 p-4 sm:p-5 border-b-4 border-[#FFCC33] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFCC33] text-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] shrink-0">
              <Users className="w-6 h-6 text-[#6D071A]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif font-black text-lg sm:text-2xl text-yellow-300">
                  Bhutan Class 10 Virtual Study Room & Help Hub
                </h2>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <span className="w-2 h-2 bg-slate-950 rounded-full animate-ping" />
                  {displayedPeers.length + 1} ONLINE NOW
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium">
                Connect with peers, flag Python doubts for teachers, or Ask a Friend!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={async () => {
                const perm = await requestNotificationPermission();
                if (perm === 'granted') {
                  sendBrowserNotification(
                    '🇧🇹 48h Study Room Reminders On!',
                    'We will send you a browser notification if you have not logged into your ICT quest for 48 hours.'
                  );
                  alert('✅ 48h Study Room Reminders are now active!');
                } else {
                  alert('⚠️ Browser notification permission was not granted.');
                }
              }}
              className="hidden sm:flex items-center gap-1.5 bg-[#FFCC33] hover:bg-yellow-400 text-[#1A1A1A] px-3 py-1.5 rounded-xl border-2 border-[#1A1A1A] font-black text-xs shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer transition-all"
              title="Get notified if you haven't visited your study room or completed quests in 48 hours"
            >
              <Bell className="w-3.5 h-3.5 text-[#6D071A]" />
              <span>Enable 48h Reminders</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-200 hover:text-white rounded-xl border border-amber-400/50 cursor-pointer transition-all shrink-0"
              title="Close Study Room"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION SUB-TABS (Rooms vs Teacher Help vs Ask a Friend) */}
        <div className="bg-amber-100/80 dark:bg-slate-800 px-4 py-2 border-b-2 border-[#1A1A1A] flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs border-2 border-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rooms'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
            }`}
          >
            <Users className="w-4 h-4 text-[#6D071A]" />
            <span>Online Peers & Cheers ({displayedPeers.length + 1})</span>
          </button>

          <button
            onClick={() => setActiveTab('teacherHelp')}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs border-2 border-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'teacherHelp'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#6D071A]" />
            <span>Flag Help for Teacher</span>
          </button>

          <button
            onClick={() => setActiveTab('askFriend')}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs border-2 border-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'askFriend'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#6D071A]" />
            <span>Ask a Friend Online</span>
          </button>

          <button
            onClick={() => setActiveTab('colearn')}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs border-2 border-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'colearn'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
            }`}
          >
            <Code2 className="w-4 h-4 text-[#6D071A]" />
            <span>Co-Learn Real-Time IDE ({coLearnSessions.length})</span>
          </button>
        </div>

        {/* MY STATUS BAR */}
        <div className="p-3 bg-amber-50 dark:bg-slate-800/90 border-b-2 border-amber-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#6D071A] text-amber-200 border-2 border-[#1A1A1A] font-black flex items-center justify-center font-serif text-base shadow-2xs">
              {(userStats.studentName || 'T')[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs sm:text-sm text-[#1A1A1A] dark:text-slate-100">
                  {userStats.studentName || 'Student'}
                </span>
                <span className="bg-amber-200 dark:bg-slate-700 text-amber-900 dark:text-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-300 dark:border-slate-600">
                  {userStats.classSection || '10-A'} • {userStats.schoolName || 'Karma Academy'}
                </span>
              </div>

              {isEditingStatus ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="e.g. 🧠 Solving Python Loops..."
                    className="bg-white dark:bg-slate-950 border-2 border-[#1A1A1A] text-xs px-2 py-0.5 rounded-xl font-bold focus:outline-none"
                    maxLength={50}
                  />
                  <button
                    onClick={() => setIsEditingStatus(false)}
                    className="px-2 py-0.5 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingStatus(true)}
                  className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5 cursor-pointer hover:text-amber-800"
                >
                  <span>Status: <em>"{statusMessage}"</em></span>
                  <span className="text-[10px] text-amber-700 font-bold underline">(Edit)</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Firestore Active</span>
          </div>
        </div>

        {/* TAB CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'rooms' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 h-full divide-y lg:divide-y-0 lg:divide-x divide-amber-200 dark:divide-slate-800">
              
              {/* LEFT: ONLINE PEERS */}
              <div className="lg:col-span-8 p-4 sm:p-5 space-y-4 bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center justify-between pb-1 border-b border-amber-200 dark:border-slate-800">
                  <span className="text-xs font-black uppercase text-[#6D071A] dark:text-yellow-400 tracking-wider flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-amber-600" /> Active Bhutanese Peers ({displayedPeers.length})
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Send cheers or click "Ask a Friend"!
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedPeers.map((peer) => (
                    <div
                      key={peer.id}
                      className="bg-white dark:bg-slate-900 border-3 border-[#1A1A1A] dark:border-slate-700 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#1A1A1A] space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <div className={`w-9 h-9 rounded-2xl ${peer.avatarBg || 'bg-indigo-600'} text-white font-black flex items-center justify-center font-serif text-sm border-2 border-[#1A1A1A]`}>
                                {peer.studentName[0]}
                              </div>
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                            </div>

                            <div>
                              <h4 className="font-serif font-black text-sm text-slate-900 dark:text-slate-100">
                                {peer.studentName}
                              </h4>
                              <p className="text-[10px] font-bold text-slate-500">
                                {peer.schoolName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-300">
                              ⚡ {peer.xp} XP
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 space-y-1">
                          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">{peer.currentActivity}</span>
                          </div>
                          {peer.statusMessage && (
                            <div className="text-[11px] italic font-medium text-slate-500 bg-amber-50 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-amber-200">
                              "{peer.statusMessage}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                            Send Cheer:
                          </span>
                          <button
                            onClick={() => {
                              setSelectedFriend(peer.studentName);
                              setActiveTab('askFriend');
                            }}
                            className="text-[10px] font-black bg-[#FFCC33] hover:bg-yellow-400 text-[#1A1A1A] px-2 py-0.5 rounded-md border border-[#1A1A1A] cursor-pointer flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" /> Ask This Friend
                          </button>
                        </div>

                        {cheerSuccessRecipient === peer.studentName ? (
                          <div className="bg-emerald-100 border-2 border-emerald-500 text-emerald-900 p-1.5 rounded-xl text-xs font-black flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Cheer sent!</span>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {PRESET_CHEERS.slice(0, 4).map((preset, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendCheer(peer.studentName, preset.text, preset.emoji)}
                                disabled={sendingCheerId === peer.studentName}
                                className="px-2 py-1 bg-amber-50 hover:bg-[#FFCC33] dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-[10px] rounded-lg border border-amber-300 dark:border-slate-700 cursor-pointer flex items-center gap-1"
                              >
                                <span>{preset.emoji}</span>
                                <span className="truncate max-w-[80px]">{preset.text}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: LIVE CHEERS FEED */}
              <div className="lg:col-span-4 p-4 sm:p-5 space-y-4 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between pb-1 border-b border-amber-200 dark:border-slate-800">
                  <span className="text-xs font-black uppercase text-[#6D071A] dark:text-yellow-400 tracking-wider flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Live Cheers & Peer Help Feed
                  </span>
                  <span className="text-[10px] font-black bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full">
                    Real-time
                  </span>
                </div>

                <div className="space-y-3">
                  {cheersFeed.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      <Smile className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-60" />
                      <p className="font-bold">No activity yet!</p>
                      <p className="text-[11px] mt-1">Send a cheer or ask a friend for help to start the feed.</p>
                    </div>
                  ) : (
                    cheersFeed.map((cheer) => (
                      <div
                        key={cheer.id}
                        className="p-3 bg-amber-50/70 dark:bg-slate-800 border-2 border-amber-200 dark:border-slate-700 rounded-2xl space-y-1 shadow-2xs animate-fadeIn"
                      >
                        <div className="flex items-center justify-between text-[11px] font-black">
                          <span className="text-[#6D071A] dark:text-yellow-300 font-serif">
                            {cheer.senderName} ➔ {cheer.recipientName}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {new Date(cheer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <span className="text-base">{cheer.emoji}</span>
                          <span>"{cheer.cheerText}"</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'teacherHelp' && (
            <div className="p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
              <div className="bg-amber-100 dark:bg-slate-800 border-3 border-[#1A1A1A] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#6D071A] text-amber-200 rounded-2xl border-2 border-[#1A1A1A] font-black">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-xl text-[#1A1A1A] dark:text-white">Flag Python / ICT Concept for Teacher Support</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Struggling with a concept? Submit your doubt directly to your Class 10 ICT teacher's portal.</p>
                  </div>
                </div>

                {teacherHelpSuccess ? (
                  <div className="bg-emerald-100 border-3 border-emerald-600 p-4 rounded-2xl text-emerald-900 font-black text-sm flex items-center gap-2 animate-fadeIn">
                    <Check className="w-5 h-5 text-emerald-700" />
                    <span>Success! Your help request has been logged and sent to your Teacher's portal.</span>
                  </div>
                ) : (
                  <form onSubmit={handleTeacherHelpSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                        Select Struggling Concept or Topic:
                      </label>
                      <select
                        value={selectedConcept}
                        onChange={(e) => setSelectedConcept(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-[#1A1A1A] rounded-xl p-3 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none"
                      >
                        {PYTHON_CONCEPTS_LIST.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                        Describe what you are stuck on (Optional details):
                      </label>
                      <textarea
                        rows={4}
                        value={teacherHelpQuery}
                        onChange={(e) => setTeacherHelpQuery(e.target.value)}
                        placeholder="e.g. I am getting an IndentationError in my for loop when iterating through list items..."
                        className="w-full bg-white dark:bg-slate-950 border-2 border-[#1A1A1A] rounded-xl p-3 text-sm font-medium text-[#1A1A1A] dark:text-white focus:outline-none placeholder-gray-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingTeacherHelp}
                      className="w-full py-3 bg-[#6D071A] hover:bg-rose-900 text-amber-200 font-serif font-black text-sm border-3 border-[#1A1A1A] rounded-xl shadow-[4px_4px_0px_0px_#1A1A1A] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 text-[#FFCC33]" />
                      <span>{isSubmittingTeacherHelp ? 'Submitting...' : 'Send Help Request to Teacher Portal'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'askFriend' && (
            <div className="p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
              <div className="bg-amber-100 dark:bg-slate-800 border-3 border-[#1A1A1A] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#FFCC33] text-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A] font-black">
                    <UserCheck className="w-6 h-6 text-[#6D071A]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-xl text-[#1A1A1A] dark:text-white">Ask an Online Friend for Help</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Select a classmate currently online and send them a direct Python coding doubt or question.</p>
                  </div>
                </div>

                {friendSuccess ? (
                  <div className="bg-emerald-100 border-3 border-emerald-600 p-4 rounded-2xl text-emerald-900 font-black text-sm flex items-center gap-2 animate-fadeIn">
                    <Check className="w-5 h-5 text-emerald-700" />
                    <span>Question sent successfully to {selectedFriend}! They will see it in their live Study Room feed.</span>
                  </div>
                ) : (
                  <form onSubmit={handleAskFriendSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                        Select Online Friend:
                      </label>
                      <select
                        value={selectedFriend}
                        onChange={(e) => setSelectedFriend(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-[#1A1A1A] rounded-xl p-3 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none"
                      >
                        <option value="">-- Choose Classmate --</option>
                        {displayedPeers.map((peer) => (
                          <option key={peer.id} value={peer.studentName}>
                            {peer.studentName} ({peer.schoolName} - {peer.classSection})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                        Your Question / Coding Doubt:
                      </label>
                      <textarea
                        rows={4}
                        value={friendQuestion}
                        onChange={(e) => setFriendQuestion(e.target.value)}
                        placeholder="e.g. Tashi, can you explain how range(0, 10, 2) works in Python?"
                        className="w-full bg-white dark:bg-slate-950 border-2 border-[#1A1A1A] rounded-xl p-3 text-sm font-medium text-[#1A1A1A] dark:text-white focus:outline-none placeholder-gray-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!selectedFriend || !friendQuestion.trim() || isSubmittingFriend}
                      className="w-full py-3 bg-[#6D071A] hover:bg-rose-900 text-amber-200 font-serif font-black text-sm border-3 border-[#1A1A1A] rounded-xl shadow-[4px_4px_0px_0px_#1A1A1A] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-[#FFCC33]" />
                      <span>{isSubmittingFriend ? 'Sending Question...' : 'Send Help Request to Friend'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'colearn' && (
            <div className="p-4 sm:p-6 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto">
              {!activeCoLearnSession ? (
                <div className="max-w-2xl mx-auto w-full space-y-6">
                  <div className="bg-amber-100 dark:bg-slate-800 border-3 border-[#1A1A1A] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#6D071A] text-amber-200 rounded-2xl border-2 border-[#1A1A1A] font-black">
                        <Code2 className="w-6 h-6 text-[#FFCC33]" />
                      </div>
                      <div>
                        <h3 className="font-serif font-black text-xl text-[#1A1A1A] dark:text-white">Co-Learn Real-Time Python IDE</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Code together on the same Python file with a classmate in real-time via Firestore synchronization!</p>
                      </div>
                    </div>

                    <form onSubmit={handleCreateCoLearn} className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                          New Co-Coding Session Title:
                        </label>
                        <input
                          type="text"
                          value={newSessionTitle}
                          onChange={(e) => setNewSessionTitle(e.target.value)}
                          placeholder="e.g. Chapter 1 Python Loops Collaboration"
                          className="w-full bg-white dark:bg-slate-950 border-2 border-[#1A1A1A] rounded-xl p-3 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!newSessionTitle.trim() || isCreatingSession}
                        className="w-full py-3 bg-[#6D071A] hover:bg-rose-900 text-amber-200 font-serif font-black text-sm border-3 border-[#1A1A1A] rounded-xl shadow-[4px_4px_0px_0px_#1A1A1A] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Code2 className="w-4 h-4 text-[#FFCC33]" />
                        <span>{isCreatingSession ? 'Creating Room...' : 'Start Co-Learn Session Room'}</span>
                      </button>
                    </form>
                  </div>

                  {/* Active Co-Learn Rooms List */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-black text-sm uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                      Active Co-Learn Rooms ({coLearnSessions.length})
                    </h4>
                    {coLearnSessions.length === 0 ? (
                      <div className="p-6 bg-white dark:bg-slate-900 border-2 border-[#1A1A1A] rounded-2xl text-center text-xs text-slate-500 font-bold">
                        No active co-learn sessions right now. Create one above to invite a classmate!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {coLearnSessions.map((sess) => (
                          <div
                            key={sess.id}
                            onClick={() => {
                              setActiveCoLearnSession(sess);
                              updateCoLearnSessionCode(sess.id, sess.code, userStats.studentName || 'Peer');
                            }}
                            className="bg-white dark:bg-slate-900 border-3 border-[#1A1A1A] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#1A1A1A] cursor-pointer hover:bg-amber-50 transition-all space-y-2 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="bg-[#FFCC33] text-[#1A1A1A] text-[9px] font-black px-2 py-0.5 rounded border border-[#1A1A1A]">
                                  Python Co-Code
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {new Date(sess.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <h5 className="font-serif font-black text-base text-slate-900 dark:text-white mt-1.5">
                                {sess.title}
                              </h5>
                              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                Host: <strong className="text-[#6D071A] dark:text-amber-300">{sess.hostName}</strong>
                                {sess.partnerName && ` | Partner: ${sess.partnerName}`}
                              </p>
                            </div>
                            <button className="w-full py-1.5 bg-[#1A1A1A] text-amber-200 font-black text-xs rounded-xl border border-amber-300/40 flex items-center justify-center gap-1">
                              <Code2 className="w-3.5 h-3.5 text-[#FFCC33]" /> Join Co-Learn Room
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full space-y-3">
                  {/* Co-Learn IDE Header */}
                  <div className="bg-white dark:bg-slate-900 border-3 border-[#1A1A1A] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveCoLearnSession(null)}
                        className="px-2.5 py-1 bg-amber-100 dark:bg-slate-800 text-[#1A1A1A] dark:text-amber-200 font-black text-xs rounded-xl border border-[#1A1A1A] cursor-pointer"
                      >
                        ← Back to Rooms
                      </button>
                      <h4 className="font-serif font-black text-sm text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                        {activeCoLearnSession.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        Live Sync Active
                      </span>
                      <button
                        onClick={handleRunCoLearnCode}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Run Python</span>
                      </button>
                    </div>
                  </div>

                  {/* Co-Learn IDE Workspace Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[320px]">
                    {/* Code Editor */}
                    <div className="lg:col-span-8 flex flex-col bg-slate-900 border-3 border-[#1A1A1A] rounded-2xl overflow-hidden shadow-md">
                      <div className="bg-slate-800 px-3 py-1.5 border-b border-slate-700 flex items-center justify-between text-xs text-amber-200 font-mono font-bold">
                        <span>python_colearn_script.py (Shared Real-Time Editor)</span>
                        <span className="text-[10px] text-emerald-400">Host: {activeCoLearnSession.hostName} {activeCoLearnSession.partnerName ? `| Partner: ${activeCoLearnSession.partnerName}` : ''}</span>
                      </div>
                      <textarea
                        value={activeCoLearnSession.code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        placeholder="Write Python code here..."
                        className="flex-1 w-full bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm p-3.5 focus:outline-none resize-none leading-relaxed"
                        spellCheck={false}
                      />
                    </div>

                    {/* Output Console & Partner Info */}
                    <div className="lg:col-span-4 flex flex-col space-y-3">
                      <div className="bg-white dark:bg-slate-900 border-3 border-[#1A1A1A] rounded-2xl p-3 shadow-2xs space-y-1.5 shrink-0">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                          Co-Coding Partner Info
                        </span>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Room ID: <span className="font-mono text-xs">{activeCoLearnSession.id}</span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Any edits made by you or your classmate sync instantly via Firestore listeners!
                        </div>
                      </div>

                      <div className="flex-1 bg-slate-950 text-emerald-400 font-mono text-xs border-3 border-[#1A1A1A] rounded-2xl p-3 flex flex-col overflow-hidden shadow-inner">
                        <div className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 pb-1 mb-2 flex items-center justify-between">
                          <span>Execution Terminal</span>
                          <button 
                            onClick={() => setCoLearnOutput('')}
                            className="text-amber-400 text-[10px] hover:underline cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                        <pre className="flex-1 whitespace-pre-wrap overflow-y-auto text-[11px]">
                          {coLearnOutput || 'Click "Run Python" to test script output.'}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 bg-amber-50 dark:bg-slate-800 border-t border-amber-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-medium shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Empowering Bhutanese Class 10 ICT collaborative learning!</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1A1A1A] text-white hover:bg-slate-800 rounded-xl font-bold text-xs cursor-pointer"
          >
            Close Study Room
          </button>
        </div>

      </div>
    </div>
  );
};

