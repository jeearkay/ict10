import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Cpu, Award, CheckCircle2, XCircle, RotateCcw, 
  ChevronRight, Sparkles, Timer, Lock, Unlock, Play, Check, 
  Flame, HelpCircle, GraduationCap, ChevronLeft, ArrowRight
} from 'lucide-react';
import { HOMEWORK_SHEETS, HomeworkSheet, HomeworkQuestion } from '../data/homeworkData';
import { UserStats } from '../types';
import { ParticleConfetti } from './ParticleConfetti';
import { randomizeQuestions } from '../lib/questionRandomizer';
import { CodeFormattedText } from './CodeFormattedText';
import { getStudentHomeworkSheets, useContentRefresh } from '../lib/contentManager';



// Generates highly contextual, syllabus-aligned hints based on keywords within the board exam questions
export const getQuestionHint = (question: HomeworkQuestion): string => {
  const qText = question.question.toLowerCase();
  
  if (qText.includes('saas') || qText.includes('bakery')) {
    return "Focus on the model that offers a ready-made, cloud-hosted application where you don't write any server-side code or deploy servers.";
  }
  if (qText.includes('hybrid') || qText.includes('hospital') || qText.includes('visiting hours')) {
    return "Think of combining private servers for secure, critical database records with a public hosting provider for public website pages.";
  }
  if (qText.includes('scalability') || qText.includes('game company') || qText.includes('players')) {
    return "Scalability is about servers expanding and contracting on demand, and cost efficiency is paying only for active virtual machines.";
  }
  if (qText.includes('dependency') || qText.includes('wi-fi') || qText.includes('risk')) {
    return "Consider what happens to cloud-connected software or notes if the local internet or power line goes down during a heavy monsoon.";
  }
  if (qText.includes('lock-in') || qText.includes('vendor')) {
    return "Think about how proprietary backup standards, custom file extensions, or huge transfer volumes make changing platforms extremely painful.";
  }
  if (qText.includes('fair use') || qText.includes('criticism') || qText.includes('educational')) {
    return "Recall that limited copying of creative files for commentary, reporting, parody, or teaching is protected under Fair Use without needing permission.";
  }
  if (qText.includes('creative commons') || qText.includes('cc-by') || qText.includes('license')) {
    return "CC licenses define how creators share material. 'BY' stands for Attribution, meaning credit MUST be given to the author.";
  }
  if (qText.includes('excel') || qText.includes('formula') || qText.includes('cell')) {
    return "Formulas in Excel always begin with an `=` (equal sign) and refer to row/column intersection identifiers like `A1` or `B2`.";
  }
  if (qText.includes('print') || qText.includes('input')) {
    return "The `input()` function in Python always reads human typed values and returns them as a String data type, requiring type-casting like `int()`.";
  }
  if (qText.includes('variable')) {
    return "Python variable names can only start with letters or underscores, are case-sensitive, and cannot be reserved words like `class` or `import`.";
  }
  if (qText.includes('operator') || qText.includes('%') || qText.includes('modulo')) {
    return "The `%` (modulo) returns the division remainder, `//` computes the floor division quotient, and `**` is for exponents.";
  }
  if (qText.includes('slicing') || qText.includes('string')) {
    return "Slicing syntax is `string[start:stop:step]`. Note that the `stop` boundary is exclusive, so it stops just before that index.";
  }
  if (qText.includes('loop') || qText.includes('while') || qText.includes('for')) {
    return "`break` exits the loop entirely. `continue` skips the rest of the current iteration to start the next cycle immediately.";
  }
  if (qText.includes('dictionary') || qText.includes('list') || qText.includes('tuple')) {
    return "Lists are mutable, Tuples are immutable (cannot be altered once defined), and Dictionaries use unique Key-Value pairs.";
  }
  if (qText.includes('recursive') || qText.includes('recursion')) {
    return "A recursive function calls itself, so it MUST have an explicit 'base case' to terminate the loop and prevent a Stack Overflow error.";
  }

  // Fallback intelligent hint parsed from explanation
  if (question.explanation) {
    const sentences = question.explanation.split('.');
    return `Think about how ${sentences[0].replace(/is\s+correct/gi, 'works').toLowerCase()}.`;
  }
  
  return "Review the core terminology and code definitions of this Class 10 computer science curriculum topic.";
};

interface HomeworkPortalProps {
  userStats: UserStats;
  onRewardXp: (amount: number, levelId: string) => void;
  selectedSheetId?: string;
  onSelectSheet?: (sheetId: string) => void;
}

export const HomeworkPortal: React.FC<HomeworkPortalProps> = ({
  userStats,
  onRewardXp,
  selectedSheetId,
  onSelectSheet
}) => {
  const contentVersion = useContentRefresh();
  const allSheets = getStudentHomeworkSheets();

  // Find initial sheet based on prop or first sheet
  const initialSheet = useMemo(() => {
    const s = allSheets.find(s => s.id === selectedSheetId) || allSheets[0];
    return { ...s, questions: randomizeQuestions(s.questions) };
  }, [selectedSheetId, contentVersion, allSheets]);
  const [activeSheet, setActiveSheet] = useState<HomeworkSheet>(initialSheet);

  // Sync state if parent changes selectedSheetId or content version
  useEffect(() => {
    const sheets = getStudentHomeworkSheets();
    const sheet = sheets.find(s => s.id === (selectedSheetId || activeSheet.id)) || sheets[0];
    if (sheet) {
      setActiveSheet({ ...sheet, questions: randomizeQuestions(sheet.questions) });
    }
  }, [selectedSheetId, contentVersion]);

  // Track state of answers and score mechanics
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  
  // Interactive question type states
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [selectedDragOption, setSelectedDragOption] = useState<string | null>(null);
  const [selectedLeftMatch, setSelectedLeftMatch] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [sheetDone, setSheetDone] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, { selected: number; correct: boolean }>>({});
  
  // Game mechanic states
  const [lives, setLives] = useState<number>(3);
  const [hintsUnlocked, setHintsUnlocked] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [confirmUnlockId, setConfirmUnlockId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'info' | 'warning' | 'success' | 'error' }>>([]);

  // Confetti triggering state
  const [triggerConfetti, setTriggerConfetti] = useState<boolean>(false);

  // Helper to show modern in-app toasts
  const showToast = (message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Central state reset for sheets
  const resetSheetStates = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setTypedAnswer('');
    setSelectedDragOption(null);
    setSelectedLeftMatch(null);
    setMatchedPairs({});
    setIsChecked(false);
    setFeedbackMessage('');
    setIsCorrect(false);
    setSheetDone(false);
    setAnswers({});
    setLives(3);
    setHintsUnlocked({});
    setAttempts({});
    setPointsEarned(0);
    setConfirmUnlockId(null);
    setTriggerConfetti(false);
  };

  // Track completed sheets directly from userStats completed levels (user-isolated)
  const completedSheetIds = useMemo(() => {
    return (userStats.completedLevels || [])
      .filter(l => l.startsWith('homework-'))
      .map(l => l.replace('homework-', ''));
  }, [userStats.completedLevels]);

  const currentQuestion = activeSheet.questions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isChecked) return; // Cannot change selection once checked
    setSelectedOptionIndex(index);
    setFeedbackMessage('');
  };

  const handleCheckAnswer = () => {
    let isAnsCorrect = false;
    
    if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'boolean') {
      if (selectedOptionIndex === null) return;
      isAnsCorrect = selectedOptionIndex === (currentQuestion.correctAnswer as number);
    } else if (currentQuestion.type === 'fill-in-the-blank') {
      if (!typedAnswer.trim()) return;
      const typedClean = typedAnswer.trim().toLowerCase();
      const correctClean = String(currentQuestion.correctAnswer).trim().toLowerCase();
      const clean = (s: string) => s.replace(/[()"'.,]/g, '').trim().toLowerCase();
      const parts = correctClean.split(/\b(?:or|\/)\b|\(|\)/).map((p) => clean(p)).filter(Boolean);
      isAnsCorrect = typedClean === correctClean || clean(typedClean) === clean(correctClean) || parts.some((part) => part === clean(typedClean));
    } else if (currentQuestion.type === 'drag-drop') {
      if (!selectedDragOption) return;
      const selectedClean = selectedDragOption.trim().toLowerCase();
      const correctClean = String(currentQuestion.correctAnswer).trim().toLowerCase();
      isAnsCorrect = selectedClean === correctClean;
    } else if (currentQuestion.type === 'match-following') {
      const leftLength = currentQuestion.leftItems?.length || 0;
      if (Object.keys(matchedPairs).length < leftLength) return;
      const correctMatches = currentQuestion.correctAnswer as Record<string, string>;
      const leftItems = currentQuestion.leftItems || [];
      isAnsCorrect = leftItems.every(left => {
        const selectedMatch = matchedPairs[left] || '';
        const correctMatch = correctMatches[left] || '';
        return selectedMatch.trim().toLowerCase() === correctMatch.trim().toLowerCase();
      });
    }

    // Get attempts count for this question
    const currentAttempts = (attempts[currentQuestion.id] || 0) + 1;
    setAttempts(prev => ({ ...prev, [currentQuestion.id]: currentAttempts }));

    setIsCorrect(isAnsCorrect);
    setIsChecked(true);

    if (isAnsCorrect) {
      // Points allocation: 10 on first or second attempt, 5 on subsequent attempts
      const basePoints = currentQuestion.points || 10;
      const earned = currentAttempts <= 2 ? basePoints : Math.round(basePoints / 2);
      
      setPointsEarned(prev => prev + earned);
      
      setFeedbackMessage(
        `Tashi Delek! Correct answer! 🎉 Earned +${earned} Points. ${currentQuestion.explanation}`
      );
      showToast(`Correct Answer! +${earned} Points!`, 'success');

      // Save answer
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          selected: selectedOptionIndex !== null ? selectedOptionIndex : -1,
          correct: true
        }
      }));
    } else {
      // Handle incorrect response: deduct life or deduct points ONLY after the second attempt (so on 3rd attempt or later)
      let lifeDeducted = false;
      let pointsDeducted = 0;

      if (currentAttempts >= 3) {
        if (lives > 0) {
          setLives(prev => prev - 1);
          lifeDeducted = true;
        } else {
          setPointsEarned(prev => {
            const nextPoints = Math.max(0, prev - 5);
            pointsDeducted = prev - nextPoints;
            return nextPoints;
          });
        }
      }

      setFeedbackMessage(
        `Not quite correct. ${currentQuestion.explanation}`
      );

      if (currentAttempts === 1) {
        showToast(`Incorrect! First attempt free - no lives lost. Try again!`, 'info');
      } else if (currentAttempts === 2) {
        showToast(`Incorrect! Second attempt free - no lives lost. Try again!`, 'info');
      } else {
        if (lifeDeducted) {
          showToast(`Incorrect! Lost 1 Life ❤️ (Remaining: ${lives - 1})`, 'warning');
        } else if (pointsDeducted > 0) {
          showToast(`Incorrect with 0 Lives! Deducted 5 Points! ⚠️`, 'error');
        } else {
          showToast(`Incorrect answer! Try again.`, 'error');
        }
      }

      // Save answer as incorrect
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          selected: selectedOptionIndex !== null ? selectedOptionIndex : -1,
          correct: false
        }
      }));
    }
  };

  // Allow student to retry the current question
  const handleRetryQuestion = () => {
    setSelectedOptionIndex(null);
    setTypedAnswer('');
    setSelectedDragOption(null);
    setSelectedLeftMatch(null);
    setMatchedPairs({});
    setIsChecked(false);
    setFeedbackMessage('');
    setIsCorrect(false);
    setConfirmUnlockId(null);
    showToast(`Try again! Choose another option.`, 'info');
  };

  // Handle unlocking hints with life or point deduction
  const handleUnlockHint = () => {
    if (hintsUnlocked[currentQuestion.id]) return;

    let lifeDeducted = false;
    let pointsDeducted = 0;

    if (lives > 0) {
      setLives(prev => prev - 1);
      lifeDeducted = true;
    } else {
      setPointsEarned(prev => {
        const nextPoints = Math.max(0, prev - 5);
        pointsDeducted = prev - nextPoints;
        return nextPoints;
      });
    }

    setHintsUnlocked(prev => ({ ...prev, [currentQuestion.id]: true }));
    setConfirmUnlockId(null);

    if (lifeDeducted) {
      showToast(`Hint Unlocked! 1 Life ❤️ spent.`, 'info');
    } else if (pointsDeducted > 0) {
      showToast(`Hint Unlocked! 0 lives left: Deducted 5 Points! ⚠️`, 'warning');
    } else {
      showToast(`Hint Unlocked!`, 'success');
    }
  };

  const handleNextQuestion = () => {
    // Reset selection and checked state for next question
    setSelectedOptionIndex(null);
    setTypedAnswer('');
    setSelectedDragOption(null);
    setSelectedLeftMatch(null);
    setMatchedPairs({});
    setIsChecked(false);
    setFeedbackMessage('');
    setConfirmUnlockId(null);
    
    if (currentQuestionIndex < activeSheet.questions.length - 1) {
      // Step-by-step progression: proceed to next index
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Sheet completed!
      setSheetDone(true);
      const isAlreadyCompleted = completedSheetIds.includes(activeSheet.id);
      
      const earnedPercentage = pointsEarned / (activeSheet.questions.length * 10);
      const finalXpAwarded = Math.max(15, Math.round(activeSheet.xpReward * (earnedPercentage || 0.5)));

      if (!isAlreadyCompleted) {
        // Award scaled proportional XP and sync to profile
        onRewardXp(finalXpAwarded, `homework-${activeSheet.id}`);
      }

      setTriggerConfetti(true);
    }
  };

  const handleRetrySheet = () => {
    resetSheetStates();
  };

  const handleSelectSheet = (sheet: HomeworkSheet) => {
    setActiveSheet(sheet);
    resetSheetStates();
    if (onSelectSheet) {
      onSelectSheet(sheet.id);
    }
  };

  // Get total progress stats
  const totalSheets = HOMEWORK_SHEETS.length;
  const completedCount = completedSheetIds.length;
  const percentCompleted = Math.round((completedCount / totalSheets) * 100);

  // Motivational level statement based on completion
  let motivationText = "Kuzuzangpo la! Begin your board exam prep sheets.";
  if (percentCompleted > 0 && percentCompleted < 40) {
    motivationText = "Off to a strong start! Keep writing clean code and learning.";
  } else if (percentCompleted >= 40 && percentCompleted < 80) {
    motivationText = "Excellent progress! Bhutanese computer science scholars approve.";
  } else if (percentCompleted >= 80 && percentCompleted < 100) {
    motivationText = "Almost a National Mastery Scholar! Just a few sheets remaining.";
  } else if (percentCompleted === 100) {
    motivationText = "Tashi Delek! You have mastered all Class 10 ICT Board Exam prep sheets! 🐉🥇";
  }

  // Determine if the answer is empty depending on the question type
  const isAnswerEmpty = (() => {
    if (!currentQuestion) return true;
    if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'boolean') {
      return selectedOptionIndex === null;
    }
    if (currentQuestion.type === 'fill-in-the-blank') {
      return typedAnswer.trim() === '';
    }
    if (currentQuestion.type === 'drag-drop') {
      return selectedDragOption === null;
    }
    if (currentQuestion.type === 'match-following') {
      const leftLength = currentQuestion.leftItems?.length || 0;
      return Object.keys(matchedPairs).length < leftLength;
    }
    return true;
  })();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-[7px] pb-2" id="homework-portal-root">
      {/* Particle Confetti Celebration Effect */}
      <ParticleConfetti 
        isActive={triggerConfetti} 
        rewardXp={activeSheet.xpReward} 
        levelTitle={activeSheet.title}
        onClose={() => setTriggerConfetti(false)}
      />

      {/* Header Motivation & Overall Progress Dashboard */}
      <div className="bg-white border-4 border-[#1A1A1A] rounded-3xl p-3.5 sm:p-4 mb-4 shadow-[5px_5px_0px_0px_#1A1A1A] transition-all">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#FFCC33] border-2 border-[#1A1A1A] rounded-xl text-lg shadow-[1.5px_1.5px_0px_0px_#1A1A1A]">
                📚
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-[#1A1A1A]">
                Homework Portal
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-600">
              {motivationText}
            </p>
          </div>
          <div className="w-full md:w-auto bg-[#FDFCF0] border-2 border-[#1A1A1A] p-2.5 rounded-2xl shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-3 shrink-0">
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
              {/* Circular progress bar simulation */}
              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-500"
                  strokeWidth="3.5"
                  strokeDasharray={`${percentCompleted}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="text-[11px] font-black text-[#1A1A1A]">{percentCompleted}%</span>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Overall Progress</div>
              <div className="text-xs sm:text-sm font-black text-[#1A1A1A]">
                {completedCount} of {totalSheets} Sheets Finished
              </div>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar for Visual Reinforcement */}
        <div className="mt-3 w-full bg-gray-100 border-2 border-[#1A1A1A] rounded-full h-3 overflow-hidden shadow-inner flex">
          <div 
            className="bg-emerald-400 border-r-2 border-[#1A1A1A] h-full transition-all duration-500"
            style={{ width: `${percentCompleted}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        {/* Left Sidebar - Sequential Sheet Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border-4 border-[#1A1A1A] rounded-3xl p-3 shadow-[3px_3px_0px_0px_#1A1A1A]">
            <div className="pb-2 mb-2 border-b-2 border-gray-100 flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#6D071A]">
                Class 10 Homework Sheets
              </h3>
              <span className="bg-[#6D071A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Syllabus Linked
              </span>
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {allSheets.map((sheet, index) => {
                const isCompleted = completedSheetIds.includes(sheet.id);
                const isActive = sheet.id === activeSheet.id;
                
                // Allow clicking any sheet (since we want students to explore, but enforce sequential questions *inside* the sheet)
                return (
                  <button
                    key={sheet.id}
                    onClick={() => handleSelectSheet(sheet)}
                    className={`w-full text-left p-2 rounded-xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-[#FFCC33] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] -translate-y-0.5'
                        : isCompleted
                        ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 hover:border-emerald-500 text-gray-800'
                        : 'bg-white hover:bg-amber-50/50 border-[#1A1A1A] text-gray-800'
                    }`}
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center font-black shrink-0 shadow-[1px_1px_0px_0px_#1A1A1A] ${
                        isActive 
                          ? 'bg-[#6D071A] text-yellow-300 border-[#1A1A1A] text-xs' 
                          : isCompleted 
                          ? 'bg-emerald-400 text-[#1A1A1A] border-emerald-600 text-xs' 
                          : 'bg-amber-100 text-[#1A1A1A] border-[#1A1A1A] text-xs'
                      }`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black truncate">{sheet.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-bold text-gray-500 flex items-center gap-0.5">
                            <Timer className="w-2.5 h-2.5" /> {sheet.estimatedMinutes}m
                          </span>
                          <span className="text-[9px] font-bold text-gray-500">•</span>
                          <span className="text-[9px] font-extrabold text-emerald-600">+{sheet.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Panel - Active Interactive Homework Sheet */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!sheetDone ? (
              <motion.div
                key={activeSheet.id + '-' + currentQuestionIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white border-4 border-[#1A1A1A] rounded-3xl p-3.5 sm:p-4 shadow-[5px_5px_0px_0px_#1A1A1A]"
              >
                {/* Active Sheet Card Header */}
                <div className="border-b-2 border-gray-100 pb-2 mb-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#6D071A] bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                        Sheet {HOMEWORK_SHEETS.indexOf(activeSheet) + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                        {activeSheet.title}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 ${
                      activeSheet.difficulty === 'Beginner' 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : activeSheet.difficulty === 'Intermediate'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}>
                      {activeSheet.difficulty}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-500 mt-1">
                    {activeSheet.description}
                  </p>
                </div>

                {/* Sequential Question Progress Tracker (Visual Step-by-Step dots) */}
                <div className="flex items-center justify-between gap-2 bg-[#FDFCF0] border-2 border-[#1A1A1A] p-2 rounded-xl mb-3 shadow-[1.5px_1.5px_0px_0px_#1A1A1A]">
                  <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    {activeSheet.questions.map((q, idx) => {
                      const isQuestionAttempted = !!answers[q.id];
                      const isQuestionCorrect = answers[q.id]?.correct;
                      const isCurrent = idx === currentQuestionIndex;
                      
                      // Enforce sequential locks: Unlocked if it is current or previous was attempted
                      const isLocked = idx > currentQuestionIndex;

                      return (
                        <div key={q.id} className="flex items-center gap-1.5 shrink-0">
                          <button
                            disabled={isLocked}
                            onClick={() => {
                              setCurrentQuestionIndex(idx);
                              setSelectedOptionIndex(answers[q.id]?.selected ?? null);
                              setIsChecked(!!answers[q.id]);
                              setFeedbackMessage(answers[q.id] 
                                ? answers[q.id].correct 
                                  ? `Tashi Delek! Correct! 🎉 ${q.explanation}`
                                  : `Not quite correct. Let's learn: ${q.explanation}`
                                : ''
                              );
                              setIsCorrect(answers[q.id]?.correct ?? false);
                            }}
                            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-[10px] font-black shadow-[1px_1px_0px_0px_#1A1A1A] transition-all ${
                              isCurrent
                                ? 'bg-[#FFCC33] text-[#1A1A1A] border-[#1A1A1A]'
                                : isQuestionAttempted
                                ? isQuestionCorrect
                                  ? 'bg-emerald-400 text-[#1A1A1A] border-emerald-600'
                                  : 'bg-rose-400 text-white border-rose-600'
                                : 'bg-white text-gray-400 border-gray-200'
                            }`}
                            title={`Question ${idx + 1}`}
                          >
                            {isLocked ? <Lock className="w-3 h-3 text-gray-300" /> : idx + 1}
                          </button>
                          {idx < activeSheet.questions.length - 1 && (
                            <div className="w-2.5 h-0.5 bg-gray-200" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-xs font-black text-[#6D071A] shrink-0">
                    Q: {currentQuestionIndex + 1} of {activeSheet.questions.length}
                  </div>
                </div>

                {/* Game Engine: Lives and Point-Score Metrics Header */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#FDFCF0] border-2 border-[#1A1A1A] p-2 rounded-xl mb-3 shadow-[1.5px_1.5px_0px_0px_#1A1A1A] text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-gray-400">Your Lives:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((heart) => {
                        const isFilled = heart <= lives;
                        return (
                          <motion.span
                            key={heart}
                            animate={isFilled ? { scale: 1 } : { scale: [1, 1.4, 0.9] }}
                            className="text-base inline-block"
                          >
                            {isFilled ? '❤️' : '🤍'}
                          </motion.span>
                        );
                      })}
                      {lives === 0 && (
                        <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 uppercase tracking-tight animate-pulse ml-1">
                          No Lives! Hints/Failures: -5 Pts
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center sm:justify-end gap-2">
                    <span className="text-[10px] font-black uppercase text-gray-400">Score Earned:</span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-lg">
                      🏆 {pointsEarned} Points
                    </span>
                  </div>
                </div>

                {/* Current Question Block */}
                <div className="space-y-3.5 text-left">
                  <div className="bg-[#6D071A]/5 border-2 border-[#1A1A1A] p-3 rounded-xl relative shadow-[1.5px_1.5px_0px_0px_#1A1A1A]">
                    <div className="flex items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-1.5 mb-2">
                      <div className="flex items-center gap-1 text-[#6D071A]">
                        <HelpCircle className="w-4 h-4 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Board Question</span>
                      </div>

                      {/* Hint Trigger Module */}
                      <div className="relative z-10">
                        {hintsUnlocked[currentQuestion.id] ? (
                          <span className="bg-amber-100 text-[#6D071A] text-[10px] font-black px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1 shadow-sm">
                            💡 Hint Unlocked
                          </span>
                        ) : confirmUnlockId === currentQuestion.id ? (
                          <div className="flex items-center gap-1 bg-white border-2 border-amber-400 rounded-xl p-1 shadow-md">
                            <span className="text-[9px] font-bold text-gray-500 mr-1">Cost: 1 Life ❤️</span>
                            <button
                              onClick={handleUnlockHint}
                              className="bg-[#6D071A] hover:bg-red-950 text-yellow-300 text-[9px] font-black px-1.5 py-0.5 rounded border border-[#1A1A1A] transition-colors cursor-pointer"
                            >
                              Unlock
                            </button>
                            <button
                              onClick={() => setConfirmUnlockId(null)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-300 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmUnlockId(currentQuestion.id)}
                            className="bg-[#FFCC33] hover:bg-amber-300 text-[#1A1A1A] text-[9px] font-black px-2 py-0.5 border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] hover:translate-y-[-1px] active:translate-y-[0px] transition-all flex items-center gap-1 cursor-pointer"
                            title="Costs 1 Life"
                          >
                            💡 Need Hint?
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-sm font-bold text-gray-800 leading-relaxed pt-0.5">
                      <CodeFormattedText text={currentQuestion.question} />
                    </div>

                    {currentQuestion.codeSnippet && (
                      <pre className="bg-gray-900 border border-slate-700 text-slate-100 p-2.5 rounded-lg font-mono text-xs overflow-x-auto mt-2 shadow-inner">
                        <code>{currentQuestion.codeSnippet}</code>
                      </pre>
                    )}

                    {/* Hint Content Reveal block */}
                    <AnimatePresence>
                      {hintsUnlocked[currentQuestion.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 p-2 bg-amber-50 border border-dashed border-amber-300 rounded-lg text-xs font-bold text-amber-900 leading-relaxed"
                        >
                          <span className="font-extrabold text-[#6D071A] mr-1">💡 HINT:</span>
                          <CodeFormattedText text={getQuestionHint(currentQuestion)} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Options List / Inputs rendering depending on Question Type */}
                  <div className="space-y-3">
                    {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'boolean') && (
                      <div className="space-y-1.5">
                        {currentQuestion.options.map((option, idx) => {
                          const letter = String.fromCharCode(65 + idx); // A, B, C, D
                          const isSelected = selectedOptionIndex === idx;
                          const showCorrectStyles = isChecked && isCorrect && idx === (currentQuestion.correctAnswer as number);
                          const showIncorrectStyles = isChecked && isSelected && !isCorrect;

                          return (
                            <button
                              key={idx}
                              disabled={isChecked}
                              onClick={() => handleSelectOption(idx)}
                              className={`w-full text-left p-2.5 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                                showCorrectStyles
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-[1.5px_1.5px_0px_0px_#10B981]'
                                  : showIncorrectStyles
                                  ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-[1.5px_1.5px_0px_0px_#EF4444]'
                                  : isSelected
                                  ? 'bg-[#FFCC33]/10 border-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_#1A1A1A]'
                                  : 'bg-white hover:bg-amber-50/30 border-[#1A1A1A] text-gray-700'
                              }`}
                            >
                              <div className={`w-5.5 h-5.5 rounded-md border-2 flex items-center justify-center text-xs font-black shrink-0 ${
                                showCorrectStyles
                                  ? 'bg-emerald-400 border-emerald-600 text-[#1A1A1A]'
                                  : showIncorrectStyles
                                  ? 'bg-rose-400 border-rose-600 text-white'
                                  : isSelected
                                  ? 'bg-[#FFCC33] border-[#1A1A1A] text-[#1A1A1A]'
                                  : 'bg-gray-100 border-[#1A1A1A] text-gray-600'
                              }`}>
                                {letter}
                              </div>
                              <span className="text-xs sm:text-sm font-bold leading-relaxed">
                                <CodeFormattedText text={option} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {currentQuestion.type === 'fill-in-the-blank' && (
                      <div className="space-y-3">
                        <div className="p-3.5 bg-amber-50 border-2 border-[#1A1A1A] rounded-xl text-xs sm:text-sm font-bold text-gray-800 shadow-[2px_2px_0px_0px_#1A1A1A]">
                          <span className="text-[#6D071A] font-black uppercase text-[10px] block mb-1">💡 Fill in the Blank Instruction:</span>
                          {(currentQuestion.blankSentence || (currentQuestion.question.includes('______') ? currentQuestion.question : `Complete the statement: ${currentQuestion.question} ______`)).split('______').map((part, index, arr) => (
                            <React.Fragment key={index}>
                              <span>{part}</span>
                              {index < arr.length - 1 && (
                                <span className="px-2.5 py-0.5 bg-yellow-300 border-2 border-[#1A1A1A] rounded font-black mx-1.5 text-xs inline-block text-amber-950 shadow-[1px_1px_0px_0px_#1A1A1A]">
                                  ______
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-500">
                          Your Answer:
                        </label>
                        <input
                          type="text"
                          disabled={isChecked}
                          value={typedAnswer}
                          onChange={(e) => setTypedAnswer(e.target.value)}
                          placeholder="Type the exact term or formula..."
                          className={`w-full px-3.5 py-2.5 border-2 rounded-xl text-xs sm:text-sm font-black transition-all shadow-[1.5px_1.5px_0px_0px_#1A1A1A] focus:outline-none ${
                            isChecked
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-[1.5px_1.5px_0px_0px_#10B981]'
                                : 'bg-rose-50 border-rose-500 text-rose-900 shadow-[1.5px_1.5px_0px_0px_#EF4444]'
                              : 'bg-white border-[#1A1A1A] text-gray-800 focus:bg-amber-50/10'
                          }`}
                        />
                        {isChecked && (
                          <div className="text-xs font-bold mt-1 text-gray-500">
                            Correct Answer: <span className="font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-extrabold">{String(currentQuestion.correctAnswer)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {currentQuestion.type === 'drag-drop' && (
                      <div className="space-y-2.5">
                        <span className="block text-[11px] font-black uppercase tracking-wider text-gray-500">
                          Complete the statement below:
                        </span>
                        
                        <div className={`p-3.5 border-2 rounded-xl text-center min-h-[50px] flex items-center justify-center transition-all ${
                          isChecked
                            ? isCorrect
                              ? 'bg-emerald-50/50 border-emerald-400 text-emerald-950'
                              : 'bg-rose-50/50 border-rose-400 text-rose-950'
                            : 'bg-[#FDFCF0] border-dashed border-[#1A1A1A]/30'
                        }`}>
                          <div className="text-sm font-bold text-gray-700 flex flex-wrap items-center justify-center gap-2">
                            {currentQuestion.blankSentence?.split('______').map((part, index, arr) => (
                              <React.Fragment key={index}>
                                <span>{part}</span>
                                {index < arr.length - 1 && (
                                  <span className={`px-3 py-1.5 border-2 rounded-lg text-xs font-black min-w-[100px] inline-block text-center transition-all ${
                                    selectedDragOption 
                                      ? isChecked
                                        ? isCorrect
                                          ? 'bg-emerald-400 border-emerald-600 text-emerald-950 shadow-[1px_1px_0px_0px_#047857]'
                                          : 'bg-rose-400 border-rose-600 text-white shadow-[1px_1px_0px_0px_#B91C1C]'
                                        : 'bg-[#FFCC33] border-[#1A1A1A] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]'
                                      : 'bg-white border-dashed border-gray-300 text-gray-400'
                                  }`}>
                                    {selectedDragOption || 'Drop Here'}
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        {!isChecked && (
                          <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                            {currentQuestion.dragOptions?.map((opt, idx) => {
                              const isSelected = selectedDragOption === opt;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedDragOption(opt)}
                                  className={`px-3 py-1.5 border-2 rounded-lg text-xs font-black transition-all shadow-[1px_1px_0px_0px_#1A1A1A] hover:translate-y-[-1px] active:translate-y-[0px] cursor-pointer ${
                                    isSelected 
                                      ? 'bg-[#6D071A] border-[#1A1A1A] text-yellow-300 translate-y-[1px] shadow-[1.5px_1.5px_0px_0px_#1A1A1A]' 
                                      : 'bg-white hover:bg-amber-50/20 border-[#1A1A1A] text-gray-800'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {isChecked && !isCorrect && (
                          <div className="text-xs text-center font-bold text-gray-500">
                            Correct Answer: <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-black">{String(currentQuestion.correctAnswer)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {currentQuestion.type === 'match-following' && (
                      <div className="space-y-2.5">
                        <span className="block text-[11px] font-black uppercase tracking-wider text-gray-500">
                          Link the items together (Click a Term, then its matching Definition):
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Left Column - Terms */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Terms</span>
                            {currentQuestion.leftItems?.map((left) => {
                              const pairedRight = matchedPairs[left];
                              const isSelected = selectedLeftMatch === left;
                              
                              return (
                                <button
                                  key={left}
                                  disabled={isChecked}
                                  onClick={() => setSelectedLeftMatch(left)}
                                  className={`w-full p-2 border-2 rounded-xl text-xs sm:text-sm font-black text-left flex items-center justify-between transition-all cursor-pointer ${
                                    isChecked
                                      ? 'bg-gray-50 border-gray-300 text-gray-500'
                                      : isSelected
                                      ? 'bg-[#FFCC33]/20 border-[#FFCC33] shadow-[1.5px_1.5px_0px_0px_#D97706]'
                                      : pairedRight
                                      ? 'bg-emerald-50/60 border-emerald-400 text-emerald-900'
                                      : 'bg-white border-[#1A1A1A] hover:bg-amber-50/10'
                                  }`}
                                >
                                  <span className="truncate mr-2">{left}</span>
                                  {pairedRight && (
                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-300 shrink-0">
                                      Linked
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Right Column - Definitions */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Definitions</span>
                            {currentQuestion.rightItems?.map((right) => {
                              // Find which left item this right item is matched to
                              const matchedLeft = Object.keys(matchedPairs).find(key => matchedPairs[key] === right);
                              
                              return (
                                <button
                                  key={right}
                                  disabled={isChecked || !selectedLeftMatch}
                                  onClick={() => {
                                    if (!selectedLeftMatch) return;
                                    setMatchedPairs(prev => {
                                      const updated = { ...prev };
                                      // Clear previous matches for this right item to avoid duplicate mappings
                                      Object.keys(updated).forEach(k => {
                                        if (updated[k] === right) {
                                          delete updated[k];
                                        }
                                      });
                                      updated[selectedLeftMatch] = right;
                                      return updated;
                                    });
                                    setSelectedLeftMatch(null);
                                  }}
                                  className={`w-full p-2 border-2 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all ${
                                    matchedLeft
                                      ? 'bg-emerald-50/60 border-emerald-400 text-emerald-950 font-black'
                                      : selectedLeftMatch
                                      ? 'bg-amber-50 hover:bg-amber-100 border-[#1A1A1A] cursor-pointer text-gray-700'
                                      : 'bg-white border-dashed border-gray-300 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  <span className="mr-2 text-xs leading-tight">{right}</span>
                                  {matchedLeft && (
                                    <span className="bg-[#6D071A] text-yellow-300 text-[9px] font-black px-2 py-0.5 rounded border border-[#1A1A1A] shrink-0 max-w-[120px] truncate">
                                      {matchedLeft}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {Object.keys(matchedPairs).length > 0 && (
                          <div className="bg-amber-50/50 dark:bg-slate-900/30 border-2 border-dashed border-[#1A1A1A] rounded-2xl p-3.5 space-y-2 mt-4 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-1">
                                🔗 Your Linked Pairs ({Object.keys(matchedPairs).length} / {currentQuestion.leftItems?.length || 0}):
                              </span>
                              {!isChecked && (
                                <button
                                  onClick={() => {
                                    setMatchedPairs({});
                                    setSelectedLeftMatch(null);
                                  }}
                                  className="text-[10px] font-black bg-rose-100 hover:bg-rose-200 text-rose-800 px-2 py-1 rounded-md border border-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  Reset All Pairs ↺
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {Object.entries(matchedPairs).map(([left, right]) => (
                                <div key={left} className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-xl text-xs shadow-[1.5px_1.5px_0px_0px_#1A1A1A]">
                                  <div className="truncate flex-1">
                                    <span className="font-black text-[#6D071A] dark:text-yellow-300">{left}</span>
                                    <span className="mx-1 text-gray-400">➔</span>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{right}</span>
                                  </div>
                                  {!isChecked && (
                                    <button
                                      onClick={() => {
                                        setMatchedPairs(prev => {
                                          const updated = { ...prev };
                                          delete updated[left];
                                          return updated;
                                        });
                                      }}
                                      className="text-rose-500 hover:text-rose-700 font-black px-1.5 py-0.5 rounded hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                                      title="Unlink pair"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {isChecked && (
                          <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl mt-3 text-xs font-bold text-emerald-950">
                            <span className="block font-black mb-1.5 uppercase text-emerald-800 tracking-wider">Correct Pairings:</span>
                            <div className="space-y-1">
                              {Object.entries(currentQuestion.correctAnswer as Record<string, string>).map(([left, right]) => (
                                <div key={left} className="flex items-start gap-1">
                                  <span className="font-black text-[#6D071A] shrink-0">{left}</span>
                                  <span className="text-gray-400">➔</span>
                                  <span>{right}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t-2 border-gray-100">
                    <div className="text-[10px] font-bold text-gray-500 flex flex-col gap-0.5 text-left">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> First Try: <span className="font-extrabold text-emerald-600">10 Pts</span></span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Retries: <span className="font-extrabold text-amber-600">5 Pts</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isChecked ? (
                        <button
                          disabled={isAnswerEmpty}
                          onClick={handleCheckAnswer}
                          className={`px-4 py-2 rounded-xl border-2 font-black text-xs shadow-[2px_2px_0px_0px_#1A1A1A] transition-all flex items-center gap-2 cursor-pointer ${
                            !isAnswerEmpty
                              ? 'bg-emerald-400 hover:bg-emerald-300 text-[#1A1A1A] border-[#1A1A1A]'
                              : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed shadow-none'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" /> Check Answer
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          {/* Offer Retry Option on Incorrect Answers */}
                          {!isCorrect && (
                            <button
                              onClick={handleRetryQuestion}
                              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-lg font-black text-xs transition-all flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#1A1A1A] cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 shrink-0" /> Retry Question (5 Pts max)
                            </button>
                          )}

                          {isCorrect && (
                            <button
                              onClick={handleNextQuestion}
                              className="px-4 py-2 bg-[#6D071A] hover:bg-red-900 text-yellow-300 border-2 border-[#1A1A1A] rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#1A1A1A] transition-all flex items-center gap-2 cursor-pointer"
                            >
                              {currentQuestionIndex < activeSheet.questions.length - 1 ? (
                                <>
                                  Next Question <ChevronRight className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  Submit Sheet <Award className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feedback Message Block with Transition */}
                  <AnimatePresence>
                    {feedbackMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-3 border-2 rounded-xl flex items-start gap-3 mt-3 shadow-sm ${
                          isCorrect 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                            : 'bg-rose-50 border-rose-300 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div className="text-xs sm:text-sm font-bold leading-relaxed">
                          <CodeFormattedText text={feedbackMessage} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              // Sheet Completion Screen
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white border-4 border-[#1A1A1A] rounded-3xl p-6 sm:p-8 text-center shadow-[8px_8px_0px_0px_#1A1A1A] space-y-6 text-left"
              >
                <div className="inline-block p-4 bg-[#FFCC33] border-4 border-[#1A1A1A] rounded-full shadow-[4px_4px_0px_0px_#1A1A1A] animate-bounce mx-auto">
                  🐉
                </div>

                <div className="space-y-2 text-center">
                  <h3 className="text-xl sm:text-2xl font-black font-serif text-[#1A1A1A]">
                    Tashi Delek! Sheet Completed!
                  </h3>
                  <p className="text-sm font-bold text-[#6D071A]">
                    You have completed the "{activeSheet.title}" Board Prep Sheet
                  </p>
                </div>

                <div className="max-w-md mx-auto grid grid-cols-3 gap-3">
                  <div className="bg-[#FDFCF0] border-2 border-[#1A1A1A] p-3 rounded-2xl shadow-[3px_3px_0px_0px_#1A1A1A] text-center">
                    <div className="text-[9px] font-black uppercase text-gray-500">Score Earned</div>
                    <div className="text-base sm:text-lg font-black text-[#6D071A] mt-1">
                      🏆 {pointsEarned} Pts
                    </div>
                  </div>
                  <div className="bg-[#FDFCF0] border-2 border-[#1A1A1A] p-3 rounded-2xl shadow-[3px_3px_0px_0px_#1A1A1A] text-center">
                    <div className="text-[9px] font-black uppercase text-gray-500">XP Awarded</div>
                    <div className="text-base sm:text-lg font-black text-emerald-600 flex items-center justify-center gap-0.5 mt-1">
                      <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" /> +{Math.max(15, Math.round(activeSheet.xpReward * (pointsEarned / (activeSheet.questions.length * 10) || 0.5)))} XP
                    </div>
                  </div>
                  <div className="bg-[#FDFCF0] border-2 border-[#1A1A1A] p-3 rounded-2xl shadow-[3px_3px_0px_0px_#1A1A1A] text-center">
                    <div className="text-[9px] font-black uppercase text-gray-500">Lives Left</div>
                    <div className="text-base sm:text-lg font-black text-rose-600 mt-1">
                      ❤️ {lives} / 3
                    </div>
                  </div>
                </div>

                {/* Score Review Table of this Attempt */}
                <div className="max-w-md mx-auto border-2 border-[#1A1A1A] rounded-2xl overflow-hidden shadow-[2px_2px_0px_0px_#1A1A1A]">
                  <div className="bg-[#6D071A] text-yellow-300 px-4 py-2 font-black text-xs text-left uppercase tracking-wider">
                    Question Performance Review
                  </div>
                  <div className="divide-y divide-gray-100 text-left">
                    {activeSheet.questions.map((q, idx) => {
                      const ans = answers[q.id];
                      return (
                        <div key={q.id} className="p-3 flex items-start justify-between gap-4 text-xs bg-white">
                          <div className="font-bold text-gray-700 leading-relaxed max-w-[280px]">
                            <span className="text-[#6D071A] font-extrabold mr-1">Q{idx + 1}:</span>
                            <CodeFormattedText text={q.question} />
                          </div>
                          {ans?.correct ? (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" /> Pass
                            </span>
                          ) : (
                            <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Retry
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleRetrySheet}
                    className="px-5 py-2.5 bg-amber-100 hover:bg-[#FFCC33] text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#1A1A1A] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" /> Retry This Sheet
                  </button>

                  {HOMEWORK_SHEETS.indexOf(activeSheet) < HOMEWORK_SHEETS.length - 1 ? (
                    <button
                      onClick={() => {
                        const nextSheet = HOMEWORK_SHEETS[HOMEWORK_SHEETS.indexOf(activeSheet) + 1];
                        handleSelectSheet(nextSheet);
                      }}
                      className="px-5 py-2.5 bg-[#6D071A] hover:bg-red-900 text-yellow-300 border-2 border-[#1A1A1A] rounded-xl font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#1A1A1A] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      Next Homework Sheet <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="text-sm font-black text-emerald-600 flex items-center gap-1">
                      🥇 All Board Homework Sheets completed! Outstanding work.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Toasts Notification Center */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`p-4 rounded-2xl border-2 shadow-xl flex items-start gap-3 pointer-events-auto bg-white ${
                toast.type === 'success' ? 'border-emerald-500 text-emerald-950 shadow-emerald-100' :
                toast.type === 'warning' ? 'border-amber-500 text-amber-950 shadow-amber-100' :
                toast.type === 'error' ? 'border-rose-500 text-rose-950 shadow-rose-100' :
                'border-blue-500 text-blue-950 shadow-blue-100'
              }`}
            >
              <span className="text-base shrink-0 mt-0.5">
                {toast.type === 'success' ? '🎉' :
                 toast.type === 'warning' ? '⚠️' :
                 toast.type === 'error' ? '💥' : '💡'}
              </span>
              <div className="text-xs sm:text-sm font-bold leading-relaxed">{toast.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
