import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Trophy, Swords, X, UserCheck, Clock, CheckCircle2, 
  Flame, Award, Play, ChevronRight, Search, Target, Sparkles
} from 'lucide-react';
import { StudentProfile, createQuestChallenge } from '../lib/firebase';
import { QuestChallenge } from '../types';
import { getMergedSyllabusModules } from '../lib/contentManager';

interface QuestChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentProfile | null;
  studentName: string;
  allStudents: StudentProfile[];
  preselectedOpponent?: StudentProfile | null;
  onChallengeCreated?: (challenge: QuestChallenge) => void;
  onStartSpeedrunNow?: (challenge: QuestChallenge) => void;
}

export const PRESET_SPEEDRUN_LABS = [
  {
    id: 'preset-cypress',
    title: 'Python Lab: Cypress Tree Pattern',
    type: 'python_lab' as const,
    category: 'Python Basics'
  },
  {
    id: 'preset-circle',
    title: 'Python Lab: Area of Circle & Input',
    type: 'python_lab' as const,
    category: 'Variables & Operators'
  },
  {
    id: 'preset-leapyear',
    title: 'Python Lab: Leap Year & Conditionals',
    type: 'python_lab' as const,
    category: 'Conditionals'
  },
  {
    id: 'preset-menu',
    title: 'Python Lab: Bhutanese Menu & List Loops',
    type: 'python_lab' as const,
    category: 'Loops & Lists'
  },
  {
    id: 'preset-factorial',
    title: 'Python Lab: Recursive Factorial Function',
    type: 'python_lab' as const,
    category: 'Functions'
  }
];

export const QuestChallengeModal: React.FC<QuestChallengeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  studentName,
  allStudents,
  preselectedOpponent,
  onChallengeCreated,
  onStartSpeedrunNow
}) => {
  const [selectedOpponent, setSelectedOpponent] = useState<StudentProfile | null>(
    preselectedOpponent || null
  );
  const [targetCategory, setTargetCategory] = useState<'quest' | 'python_lab'>('quest');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('cloud-types');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Available quest levels extracted from syllabus
  const allQuestLevels = React.useMemo(() => {
    const levels: { id: string; title: string; chapter: string }[] = [];
    getMergedSyllabusModules().forEach(mod => {
      mod.levels.forEach(lvl => {
        levels.push({
          id: lvl.id,
          title: `Ch ${mod.chapterNumber}: ${lvl.title}`,
          chapter: mod.title
        });
      });
    });
    return levels;
  }, []);

  // Filter students for opponent selection
  const candidateOpponents = React.useMemo(() => {
    const myUid = currentUser?.uid || 'current-local-user';
    const myName = currentUser?.name || studentName;
    
    return allStudents.filter(s => {
      const isNotMe = s.uid !== myUid && s.name.toLowerCase() !== myName.toLowerCase();
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.classSection.toLowerCase().includes(searchQuery.toLowerCase());
      return isNotMe && matchesSearch;
    });
  }, [allStudents, currentUser, studentName, searchQuery]);

  if (!isOpen) return null;

  const handleSendChallenge = async (launchNow: boolean) => {
    if (!selectedOpponent) return;

    setIsSubmitting(true);
    let targetTitle = '';
    if (targetCategory === 'quest') {
      const found = allQuestLevels.find(l => l.id === selectedTargetId);
      targetTitle = found ? found.title : 'ICT Chapter Quest';
    } else {
      const found = PRESET_SPEEDRUN_LABS.find(l => l.id === selectedTargetId);
      targetTitle = found ? found.title : 'Python IDE Lab';
    }

    const challengerUid = currentUser?.uid || 'current-local-user';
    const challengerName = currentUser?.name || studentName || 'Guest Student';
    const challengerSchool = currentUser?.school || 'Karma Academy';
    const challengerClass = currentUser?.classSection || 'Class 10-A';

    try {
      const newChallenge = await createQuestChallenge({
        challengerUid,
        challengerName,
        challengerSchool,
        challengerClass,
        opponentUid: selectedOpponent.uid,
        opponentName: selectedOpponent.name,
        opponentSchool: selectedOpponent.school,
        opponentClass: selectedOpponent.classSection,
        targetType: targetCategory,
        targetId: selectedTargetId,
        targetTitle,
      });

      if (onChallengeCreated) onChallengeCreated(newChallenge);

      if (launchNow && onStartSpeedrunNow) {
        onStartSpeedrunNow(newChallenge);
        onClose();
      } else {
        setSuccessMessage(`⚔️ Challenge successfully sent to ${selectedOpponent.name}!`);
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 1800);
      }
    } catch (e) {
      console.error("Failed to send challenge:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] max-w-lg w-full overflow-hidden text-[#1A1A1A]"
        >
          {/* Header */}
          <div className="bg-[#6D071A] text-white p-5 border-b-4 border-[#1A1A1A] flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2.5 bg-[#FFCC33] text-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black font-serif text-white flex items-center gap-2">
                  Send Quest Challenge
                </h3>
                <p className="text-xs text-[#FFCC33] font-medium">
                  Challenge a classmate to a speedrun competition!
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {successMessage ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-[#00B0FF] text-white rounded-full mx-auto flex items-center justify-center border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black font-serif text-[#6D071A]">
                  {successMessage}
                </h4>
                <p className="text-sm font-medium text-gray-600">
                  When your classmate accepts, both your speedrun completion times will be logged on the Leaderboard!
                </p>
              </div>
            ) : (
              <>
                {/* Step 1: Select Opponent */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase text-[#6D071A] tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#FFCC33]" /> 1. Select Classmate Opponent
                  </label>

                  {selectedOpponent ? (
                    <div className="flex items-center justify-between bg-amber-50 border-2 border-[#1A1A1A] p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_#1A1A1A]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#6D071A] text-white font-black flex items-center justify-center border-2 border-[#1A1A1A]">
                          {selectedOpponent.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#1A1A1A]">{selectedOpponent.name}</div>
                          <div className="text-xs text-gray-600 font-medium">
                            {selectedOpponent.classSection} • {selectedOpponent.school}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedOpponent(null)}
                        className="text-xs font-bold text-[#6D071A] underline hover:text-[#00B0FF]"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search classmate name or school..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-xs font-bold border-2 border-[#1A1A1A] rounded-xl focus:ring-2 focus:ring-[#6D071A] outline-none"
                        />
                      </div>
                      <div className="max-h-36 overflow-y-auto border-2 border-[#1A1A1A] rounded-2xl divide-y-2 divide-gray-100 bg-gray-50">
                        {candidateOpponents.length === 0 ? (
                          <div className="p-4 text-center text-xs text-gray-500 font-medium">
                            No other classmates found. Pick from default list!
                          </div>
                        ) : (
                          candidateOpponents.map((st) => (
                            <button
                              key={st.uid}
                              onClick={() => setSelectedOpponent(st)}
                              className="w-full p-2.5 text-left hover:bg-amber-100 transition-colors flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-[#FFCC33] text-[#1A1A1A] font-black text-xs flex items-center justify-center border border-[#1A1A1A]">
                                  {st.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#6D071A]">
                                    {st.name}
                                  </div>
                                  <div className="text-[10px] text-gray-500 font-medium">
                                    {st.classSection} • {st.school}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs font-bold text-[#00B0FF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Select <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Select Challenge Category */}
                <div className="space-y-2 pt-2 border-t-2 border-gray-100">
                  <label className="block text-xs font-black uppercase text-[#6D071A] tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#FFCC33]" /> 2. Challenge Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setTargetCategory('quest');
                        setSelectedTargetId('cloud-types');
                      }}
                      className={`p-3 rounded-2xl border-2 border-[#1A1A1A] text-left transition-all ${
                        targetCategory === 'quest'
                          ? 'bg-[#6D071A] text-white shadow-[3px_3px_0px_0px_#1A1A1A]'
                          : 'bg-gray-50 text-[#1A1A1A] hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-[#FFCC33]" /> Chapter Quiz Quest
                      </div>
                      <p className="text-[10px] opacity-80 mt-1">
                        Compete on syllabus chapter quiz accuracy and speed!
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setTargetCategory('python_lab');
                        setSelectedTargetId('preset-cypress');
                      }}
                      className={`p-3 rounded-2xl border-2 border-[#1A1A1A] text-left transition-all ${
                        targetCategory === 'python_lab'
                          ? 'bg-[#6D071A] text-white shadow-[3px_3px_0px_0px_#1A1A1A]'
                          : 'bg-gray-50 text-[#1A1A1A] hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-[#FFCC33]" /> Python IDE Lab
                      </div>
                      <p className="text-[10px] opacity-80 mt-1">
                        Speedrun writing and executing Python code exercises!
                      </p>
                    </button>
                  </div>
                </div>

                {/* Step 3: Select Target Activity */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase text-[#6D071A] tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#FFCC33]" /> 3. Target Level / Exercise
                  </label>

                  {targetCategory === 'quest' ? (
                    <select
                      value={selectedTargetId}
                      onChange={(e) => setSelectedTargetId(e.target.value)}
                      className="w-full p-3 text-xs font-bold border-2 border-[#1A1A1A] rounded-2xl bg-amber-50/50 outline-none focus:ring-2 focus:ring-[#6D071A]"
                    >
                      {allQuestLevels.map((lvl) => (
                        <option key={lvl.id} value={lvl.id}>
                          {lvl.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={selectedTargetId}
                      onChange={(e) => setSelectedTargetId(e.target.value)}
                      className="w-full p-3 text-xs font-bold border-2 border-[#1A1A1A] rounded-2xl bg-amber-50/50 outline-none focus:ring-2 focus:ring-[#6D071A]"
                    >
                      {PRESET_SPEEDRUN_LABS.map((lab) => (
                        <option key={lab.id} value={lab.id}>
                          {lab.title} ({lab.category})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Challenge Summary Box */}
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#1A1A1A] rounded-2xl shadow-[3px_3px_0px_0px_#1A1A1A] space-y-2">
                  <div className="text-xs font-black text-[#6D071A] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FFCC33]" /> Quest Matchup Summary
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#1A1A1A]">
                    <span>{studentName || 'You'}</span>
                    <span className="text-[#6D071A] font-black text-sm">VS</span>
                    <span>{selectedOpponent ? selectedOpponent.name : 'Choose Classmate'}</span>
                  </div>
                  <div className="text-[11px] text-gray-600 font-medium text-center bg-white/80 p-2 rounded-xl border border-gray-200">
                    🏆 Winner gets <strong>+50 Bonus XP</strong> & bragging rights on the Leaderboard!
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    disabled={!selectedOpponent || isSubmitting}
                    onClick={() => handleSendChallenge(false)}
                    className="w-full py-3 px-4 bg-white text-[#1A1A1A] hover:bg-gray-100 disabled:opacity-50 border-3 border-[#1A1A1A] rounded-2xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center justify-center gap-2 transition-all"
                  >
                    <Swords className="w-4 h-4 text-[#6D071A]" />
                    Send Challenge
                  </button>

                  <button
                    disabled={!selectedOpponent || isSubmitting}
                    onClick={() => handleSendChallenge(true)}
                    className="w-full py-3 px-4 bg-[#FFCC33] text-[#1A1A1A] hover:bg-amber-400 disabled:opacity-50 border-3 border-[#1A1A1A] rounded-2xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center justify-center gap-2 transition-all"
                  >
                    <Play className="w-4 h-4 text-[#6D071A]" />
                    Send & Run Now!
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
