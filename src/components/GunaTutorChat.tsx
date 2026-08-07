import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Markdown from 'react-markdown';
import { ChatMessage, AppData, QuestModule, QuestLevel, UserStats } from '../types';
import { soundFx } from '../lib/audio';
import { MermaidDiagram } from './MermaidDiagram';
import { ArcheryBowIcon, BhutanDragonIcon, TaktsangMonasteryIcon } from './BhutanVisuals';
import { ParticleConfetti } from './ParticleConfetti';
import { speakText } from '../lib/speech';
import { DZONGKHA_GLOSSARY } from '../lib/dzongkhaDictionary';
import { useLanguage } from '../lib/LanguageContext';
import { Logo } from './Logo';
import { getApiBaseUrl } from '../lib/api';
import { 
  Send, Sparkles, RefreshCw, RotateCcw, AlertCircle, Award, CheckCircle2, ChevronRight, 
  HelpCircle, ArrowLeft, ArrowRight, Volume2, Globe, LifeBuoy, MessageSquare, Clock, X, Check, BookOpen
} from 'lucide-react';
import { 
  submitClassroomHelpRequest, 
  subscribeToHelpRequests, 
  ClassroomHelpRequest 
} from '../lib/firebase';
import { ICTGlossaryModal } from './ICTGlossaryModal';
import { ICT_GLOSSARY_TERMS } from '../lib/ictGlossary';
import { subscribeToContentChanges, getStudentQuestionsForLevel } from '../lib/contentManager';
import { CodeFormattedText } from './CodeFormattedText';

interface GunaTutorChatProps {
  currentModule: QuestModule;
  currentLevel: QuestLevel;
  userStats: UserStats;
  onRewardXp: (amount: number, levelId: string) => void;
  onDeductXp: (amount: number) => void;
  onSelectNextLevel?: () => void;
  onSelectPrevLevel?: () => void;
  onOpenIdeWithCode?: (code: string) => void;
}

export const GunaTutorChat: React.FC<GunaTutorChatProps> = ({
  currentModule,
  currentLevel,
  userStats,
  onRewardXp,
  onDeductXp,
  onSelectNextLevel,
  onSelectPrevLevel,
  onOpenIdeWithCode,
}) => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [completedRewardXp, setCompletedRewardXp] = useState<number>(50);
  const [showStuckModal, setShowStuckModal] = useState<boolean>(false);
  const [stuckQuery, setStuckQuery] = useState<string>('');
  const [isSubmittingHelp, setIsSubmittingHelp] = useState<boolean>(false);
  const [helpSubmittedSuccess, setHelpSubmittedSuccess] = useState<boolean>(false);
  const [myHelpRequests, setMyHelpRequests] = useState<ClassroomHelpRequest[]>([]);
  const [showHelpLogsDrawer, setShowHelpLogsDrawer] = useState<boolean>(false);
  const [showIctGlossaryModal, setShowIctGlossaryModal] = useState<boolean>(false);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string>('');
  const [simplifyingMsgId, setSimplifyingMsgId] = useState<string | null>(null);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to Classroom Help Requests for real-time updates
  useEffect(() => {
    const unsub = subscribeToHelpRequests((list) => {
      const filtered = list.filter(
        (r) => r.studentName.toLowerCase() === userStats.studentName.toLowerCase() || !r.studentName
      );
      setMyHelpRequests(filtered.length > 0 ? filtered : list);
    });
    return () => unsub();
  }, [userStats.studentName]);

  // Create instant zero-latency level briefing directly from syllabus data
  const createInstantLevelBriefing = (level: QuestLevel, module: QuestModule): ChatMessage => {
    const analogy = level.bhutanAnalogy || 'Think of this concept like constructing a traditional Bhutanese Dzong step-by-step with master artisans!';
    const summary = level.summary || 'Explore core Class 10 ICT concepts strictly from the Bhutanese BHSEC syllabus.';
    const question = level.exerciseQuestion || 'How would you apply this concept in a Class 10 ICT scenario?';
    const mermaid = level.mermaidDiagram || `flowchart TD\n  A["Start Quest: ${level.title}"] --> B["Input & Rules"]\n  B --> C["Processing & Logic"]\n  C --> D["Output & Level Mastery"]`;

    const text = `Kuzuzangpo la! 🙏 Welcome to **Chapter ${module.chapterNumber}: ${module.title}**!
Level ${level.levelNumber}: **${level.title}**

### 🏔️ Bhutanese Learning Analogy:
${analogy}

### 💻 Core Syllabus Concepts:
${level.keyConcepts ? level.keyConcepts.map((c) => `* ${c}`).join('\n') : `* ${summary}`}

\`\`\`mermaid
${mermaid}
\`\`\`

---
### 🏹 Quest Challenge Question:
**Challenge for ${level.title}:**
${question}

*Tip: Type your answer below, complete code, or click an option to earn +50 XP and level up!*`;

    return {
      id: `msg-instant-${level.id}`,
      role: 'assistant',
      text,
      timestamp: Date.now(),
      appData: {
        xpAwarded: 0,
        xpDeducted: 0,
        questStatus: 'in_progress',
        currentTopic: level.title,
        levelComplete: false,
        navigationOptions: ['🔄 Retry Challenge', '➡️ Next Quest'],
        briefingData: {
          chapterNumber: module.chapterNumber,
          chapterTitle: module.title,
          levelNumber: level.levelNumber,
          levelTitle: level.title,
          analogy,
          keyConcepts: level.keyConcepts || [summary],
          mermaid,
          question,
        }
      },
    };
  };

  const handleSimplifyMessage = async (msgId: string, textToSimplify: string) => {
    if (simplifyingMsgId) return;
    setSimplifyingMsgId(msgId);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for LLM

      const apiUrl = getApiBaseUrl();
      const res = await fetch(`${apiUrl}/api/simplify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          explanationText: textToSimplify,
          topic: currentLevel.title,
        }),
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.simplifiedText) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, simplifiedText: data.simplifiedText } : m))
        );
        soundFx.playSuccess();
        setTimeout(() => {
          const el = document.getElementById(`msg-${msgId}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      } else {
        throw new Error('No simplified text returned');
      }
    } catch (err) {
      console.warn('Fallback simplify explanation:', err);
      const fallbackText = `Kuzuzangpo la! Let me make this super simple for you 🐉:\n\nThink of **${currentLevel.title}** like preparing traditional Bhutanese Suja (Butter Tea):\n* **Step 1 (Input):** Gather tea leaves, mountain water, and churning vessel (Yangdam).\n* **Step 2 (Processing):** Churn vigorously to blend butter and tea thoroughly.\n* **Step 3 (Output):** Pour warm, comforting Suja into a wooden cup (Dapa)!\n\nSimilarly, computers take input, process logic step-by-step, and produce output for Class 10 students!`;
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, simplifiedText: fallbackText } : m))
      );
      setTimeout(() => {
        const el = document.getElementById(`msg-${msgId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    } finally {
      setSimplifyingMsgId(null);
    }
  };

  const handleOpenStuckModal = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.text || input;
    setStuckQuery(
      lastUserMsg || `I need help with Chapter ${currentModule.chapterNumber}, Level ${currentLevel.levelNumber}: ${currentLevel.title}.`
    );
    setShowStuckModal(true);
  };

  const handleSubmitStuckQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stuckQuery.trim() || isSubmittingHelp) return;

    setIsSubmittingHelp(true);
    try {
      await submitClassroomHelpRequest({
        studentName: userStats.studentName || 'Student',
        studentClass: userStats.classSection || '10-A',
        schoolName: userStats.schoolName || 'Karma Academy',
        chapterTitle: `Chapter ${currentModule.chapterNumber}: ${currentModule.title}`,
        levelTitle: `Level ${currentLevel.levelNumber}: ${currentLevel.title}`,
        query: stuckQuery.trim(),
        contextSnippet: currentLevel.exerciseQuestion,
      });

      setHelpSubmittedSuccess(true);
      setTimeout(() => {
        setHelpSubmittedSuccess(false);
        setShowStuckModal(false);
      }, 2000);

      // Add system confirmation message in chat
      setMessages((prev) => [
        ...prev,
        {
          id: `help-notif-${Date.now()}`,
          role: 'assistant',
          text: `🚨 **Classroom Help Logged!**\n\nI have sent your query to your Class 10 ICT teacher's portal:\n> "${stuckQuery.trim()}"\n\nYour teacher can view and respond directly in the **Teacher Portal**. You can also check status anytime under **Teacher Replies**!`,
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      console.error('Failed to submit help request:', err);
    } finally {
      setIsSubmittingHelp(false);
    }
  };

  const [quizRefreshKey, setQuizRefreshKey] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = subscribeToContentChanges(() => {
      setQuizRefreshKey((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  // Load CMS-approved questions for the current level only
  const quizQuestions = React.useMemo(() => {
    return getStudentQuestionsForLevel(currentLevel.id);
  }, [currentLevel.id, quizRefreshKey]);

  // Active quiz states
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedMcOption, setSelectedMcOption] = useState<number | null>(null);
  const [fillBlankInput, setFillBlankInput] = useState<string>('');
  const [draggedPill, setDraggedPill] = useState<string | null>(null);
  const [dragPlacedPill, setDragPlacedPill] = useState<string | null>(null);
  
  // Matching game states
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [tempMatchedPairs, setTempMatchedPairs] = useState<Record<string, string>>({});

  // Question submission feedback & navigation
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [questionStates, setQuestionStates] = useState<Record<number, {
    selectedMcOption: number | null;
    fillBlankInput: string;
    dragPlacedPill: string | null;
    tempMatchedPairs: Record<string, string>;
    isAnswerChecked: boolean;
    isAnswerCorrect: boolean;
  }>>({});

  // Reset quiz states when changing levels
  useEffect(() => {
    setCurrentQuizIndex(0);
    setSelectedMcOption(null);
    setFillBlankInput('');
    setDraggedPill(null);
    setDragPlacedPill(null);
    setLeftSelected(null);
    setTempMatchedPairs({});
    setIsAnswerChecked(false);
    setIsAnswerCorrect(false);
    setQuizScore(0);
    setQuizCompleted(false);
    setCompletedIndices([]);
    setQuestionStates({});
  }, [currentLevel.id]);

  useEffect(() => {
    if (quizQuestions.length > 0 && completedIndices.length === quizQuestions.length) {
      setQuizCompleted(true);
    }
  }, [completedIndices, quizQuestions.length]);

  // Auto scroll - Scroll to bottom during chat, scroll window to top when starting a new level
  const scrollToBottom = () => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Instant briefing initialization (0ms waiting time)
  useEffect(() => {
    const instantMsg = createInstantLevelBriefing(currentLevel, currentModule);
    setMessages([instantMsg]);
    setIsLoading(false);
  }, [currentModule.id, currentLevel.id]);

  // Parse app-data codeblock from response text
  const parseResponseAppData = (rawText: string): { cleanText: string; appData?: AppData } => {
    let cleanText = rawText;
    let appData: AppData | undefined = undefined;

    const match = rawText.match(/```app-data\s*([\s\S]*?)\s*```/i);
    if (match) {
      try {
        appData = JSON.parse(match[1]);
        cleanText = rawText.replace(/```app-data\s*([\s\S]*?)\s*```/i, '').trim();
      } catch (e) {
        console.warn('Failed to parse app-data json:', e);
      }
    }

    return { cleanText, appData };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText || isLoading) return;

    // Prevent submitting the exact challenge question to chat unless quiz is already completed
    const isQuizDone = quizCompleted || userStats.completedLevels.includes(currentLevel.id);
    if (!isQuizDone && currentLevel.exerciseQuestion && messageText.toLowerCase().trim() === currentLevel.exerciseQuestion.toLowerCase().trim()) {
      soundFx.playRetry();
      setPasteError("Unlocked only after completing the quiz");
      setTimeout(() => setPasteError(null), 4000);
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: messageText,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Format chat history for backend proxy
      const historyPayload = newHistory.map((m) => ({
        role: m.role,
        parts: m.text,
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s fast timeout

      const apiUrl = getApiBaseUrl();
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          history: historyPayload,
          userMessage: messageText,
          currentQuestTopic: currentModule.title,
          levelTopic: currentLevel.title,
        }),
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      const textToUse = data.text || `Kuzuzangpo la! 🙏

Great question about **${currentLevel.title}**! Let's continue practicing this Class 10 ICT topic.

\`\`\`app-data
{
  "xpAwarded": 25,
  "xpDeducted": 0,
  "questStatus": "in_progress",
  "currentTopic": "${currentLevel.title}",
  "levelComplete": false,
  "navigationOptions": ["⬅️ Previous Quest", "🔄 Retry", "➡️ Next Quest"]
}
\`\`\``;

      const { cleanText, appData } = parseResponseAppData(textToUse);

      // Handle XP rewards / deductions
      if (appData) {
        if (appData.xpAwarded > 0 || appData.levelComplete || appData.questStatus === 'completed') {
          const isFirstCompletion = !userStats.completedLevels.includes(currentLevel.id);
          const reward = isFirstCompletion ? (appData.xpAwarded > 0 ? appData.xpAwarded : (currentLevel.xpReward || 50)) : 0;
          onRewardXp(reward, currentLevel.id);
          soundFx.playSuccess();
          setCompletedRewardXp(reward);
          setShowConfetti(true);
        } else if (appData.xpDeducted > 0) {
          onDeductXp(appData.xpDeducted);
          soundFx.playRetry();
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: cleanText,
          appData,
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: `Kuzuzangpo la! 🙏\n\nI received your message! Let me help you review **${currentLevel.title}** according to the Class 10 BHSEC syllabus!`,
          appData: {
            xpAwarded: 10,
            xpDeducted: 0,
            questStatus: 'in_progress',
            currentTopic: currentLevel.title,
            levelComplete: false,
            navigationOptions: ['🔄 Retry Challenge', '➡️ Next Quest'],
          },
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentQuestionState = (idx: number) => {
    setQuestionStates((prev) => ({
      ...prev,
      [idx]: {
        selectedMcOption,
        fillBlankInput,
        dragPlacedPill,
        tempMatchedPairs,
        isAnswerChecked,
        isAnswerCorrect,
      },
    }));
  };

  const handleJumpToQuestion = (targetIdx: number) => {
    if (targetIdx === currentQuizIndex) return;
    saveCurrentQuestionState(currentQuizIndex);
    setCurrentQuizIndex(targetIdx);

    const targetState = questionStates[targetIdx];
    if (targetState) {
      setSelectedMcOption(targetState.selectedMcOption);
      setFillBlankInput(targetState.fillBlankInput);
      setDraggedPill(null);
      setDragPlacedPill(targetState.dragPlacedPill);
      setLeftSelected(null);
      setTempMatchedPairs(targetState.tempMatchedPairs || {});
      setIsAnswerChecked(targetState.isAnswerChecked);
      setIsAnswerCorrect(targetState.isAnswerCorrect);
    } else {
      setSelectedMcOption(null);
      setFillBlankInput('');
      setDraggedPill(null);
      setDragPlacedPill(null);
      setLeftSelected(null);
      setTempMatchedPairs({});
      setIsAnswerChecked(false);
      setIsAnswerCorrect(false);
    }
  };

  const handleCheckQuizAnswer = () => {
    if (isAnswerChecked) return;

    const currentQuestion = quizQuestions[currentQuizIndex];
    if (!currentQuestion) return;
    let correct = false;

    if (currentQuestion.type === 'multiple-choice') {
      correct = selectedMcOption === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'fill-in-the-blank') {
      const formattedInput = fillBlankInput.trim().toLowerCase();
      const formattedAnswer = String(currentQuestion.correctAnswer).trim().toLowerCase();
      if (!formattedInput) {
        correct = false;
      } else if (formattedInput === formattedAnswer) {
        correct = true;
      } else {
        const clean = (s: string) => s.replace(/[()"'.,]/g, '').trim().toLowerCase();
        if (clean(formattedInput) === clean(formattedAnswer)) {
          correct = true;
        } else {
          const parts = formattedAnswer.split(/\b(?:or|\/)\b|\(|\)/).map((p) => clean(p)).filter(Boolean);
          correct = parts.some((part) => part === clean(formattedInput));
        }
      }
    } else if (currentQuestion.type === 'drag-drop') {
      correct = String(dragPlacedPill).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();
    } else if (currentQuestion.type === 'match-following') {
      const expected = currentQuestion.correctAnswer as Record<string, string>;
      correct = true;
      for (const key of Object.keys(expected)) {
        if (tempMatchedPairs[key] !== expected[key]) {
          correct = false;
          break;
        }
      }
    }

    setIsAnswerCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      soundFx.playSuccess();
      if (!completedIndices.includes(currentQuizIndex)) {
        setQuizScore((prev) => prev + 1);
        setCompletedIndices((prev) => [...prev, currentQuizIndex]);
        onRewardXp(10, `${currentLevel.id}-quiz-${currentQuizIndex}`);
      }
    } else {
      soundFx.playRetry();
    }

    saveCurrentQuestionState(currentQuizIndex);
  };

  const handleTryAgain = () => {
    setIsAnswerChecked(false);
    setIsAnswerCorrect(false);
    setSelectedMcOption(null);
    setFillBlankInput('');
    setDraggedPill(null);
    setDragPlacedPill(null);
    setLeftSelected(null);
    setTempMatchedPairs({});
    setCompletedIndices((prev) => prev.filter((i) => i !== currentQuizIndex));
    saveCurrentQuestionState(currentQuizIndex);
  };

  const handleNextQuizQuestion = () => {
    saveCurrentQuestionState(currentQuizIndex);
    if (currentQuizIndex < quizQuestions.length - 1) {
      handleJumpToQuestion(currentQuizIndex + 1);
    } else {
      setQuizCompleted(true);
      soundFx.playSuccess();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
      // Complete level bonus
      onRewardXp(10, currentLevel.id);
    }
  };

  const leftItems = quizQuestions[currentQuizIndex]?.leftItems || [];
  const rightItems = quizQuestions[currentQuizIndex]?.rightItems || [];

  const handleLeftClick = (item: string) => {
    if (isAnswerChecked) return;
    setLeftSelected(item);
  };

  const handleRightClick = (item: string) => {
    if (isAnswerChecked || !leftSelected) return;
    setTempMatchedPairs((prev) => ({
      ...prev,
      [leftSelected]: item,
    }));
    setLeftSelected(null);
  };

  const renderInteractiveQuiz = () => {
    if (quizCompleted) {
      return (
        <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 border-4 border-emerald-500/60 text-white p-6 rounded-3xl shadow-xl text-center space-y-4 relative overflow-hidden animate-fadeIn">
          <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12 select-none pointer-events-none">
            <BhutanDragonIcon className="w-32 h-32 text-white" />
          </div>
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce">
            🏆
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-serif text-emerald-200">Quest Challenge Mastered!</h3>
          <p className="text-xs sm:text-sm text-emerald-100 font-sans max-w-md mx-auto">
            Amazing job! You have successfully answered all 5 interactive questions for <strong className="text-yellow-300">{currentLevel.title}</strong>!
          </p>
          <div className="bg-emerald-900/30 p-4 rounded-2xl border border-emerald-500/20 inline-block text-xs font-bold">
            Score: <span className="text-yellow-300 font-black">{quizScore} / {quizQuestions.length}</span> | XP Gained: <span className="text-yellow-300 font-black">+{quizScore * 10 + 10} XP!</span>
          </div>
          <div className="flex justify-center gap-3 mt-2">
            {onSelectNextLevel ? (
              <button
                onClick={onSelectNextLevel}
                className="px-6 py-2.5 bg-[#FFCC33] hover:bg-yellow-400 text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl font-black text-xs transition-all shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-1.5"
              >
                <span>Proceed to Next Quest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-yellow-300 font-black text-xs">🎉 You have cleared the final level in this chapter!</div>
            )}
          </div>
        </div>
      );
    }

      if (quizQuestions.length === 0) {
      return (
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white border-2 border-amber-500/40 p-6 rounded-3xl shadow-xl space-y-4 text-center">
          <div className="text-4xl">📭</div>
          <h3 className="text-xl sm:text-2xl font-black">No approved CMS quiz questions yet</h3>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto">
            This topic does not have any student-facing questions from the CMS yet. Please check back after your teacher publishes the approved quiz content.
          </p>
          <div className="text-xs sm:text-sm text-yellow-200/90 bg-white/5 border border-white/10 rounded-2xl p-4">
            Student quiz content is strictly served from the CMS. Generated or default syllabus questions are not shown in this mode.
          </div>
        </div>
      );
    }

    const q = quizQuestions[currentQuizIndex];
    if (!q) return null;

    return (
      <div className="bg-gradient-to-br from-[#40030C] to-[#200004] text-white border-2 border-yellow-500/40 p-5 sm:p-6 rounded-3xl shadow-lg space-y-5 relative overflow-hidden">
        {/* Header with Progress */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-yellow-500/10 rounded-lg text-yellow-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase text-yellow-400 tracking-wider">
              Interactive Quiz • Question {currentQuizIndex + 1} of {quizQuestions.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {quizQuestions.map((_, idx) => {
              const isCompleted = completedIndices.includes(idx);
              const isCurrent = idx === currentQuizIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleJumpToQuestion(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-yellow-400 scale-125 ring-2 ring-yellow-400/35'
                      : isCompleted
                      ? 'bg-emerald-400 hover:bg-emerald-300 ring-1 ring-emerald-500/50'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  title={`Question ${idx + 1} ${isCompleted ? '(Completed - Click to Review/Retry)' : '(Click to Jump)'}`}
                />
              );
            })}
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-2 text-left">
          <span className="text-[10px] font-black uppercase text-amber-300/80 tracking-widest font-mono">
            {q.type.toUpperCase().replace('-', ' ')}
          </span>
          <div className="text-sm sm:text-base font-black leading-snug text-amber-50">
            <CodeFormattedText text={q.question} />
          </div>
        </div>

        {/* Interaction Area based on Question Type */}
        <div className="space-y-3">
          {/* Multiple Choice */}
          {q.type === 'multiple-choice' && q.options && (
            <div className="grid grid-cols-1 gap-2.5 text-left">
              {q.options.map((opt, oIdx) => {
                const isSelected = selectedMcOption === oIdx;
                const isCorrectOption = oIdx === q.correctAnswer;
                let btnStyle = 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-100';
                
                if (isAnswerChecked) {
                  const userGotItRight = selectedMcOption === q.correctAnswer;
                  if (isCorrectOption && userGotItRight) {
                    btnStyle = 'border-emerald-500/60 bg-emerald-500/20 text-emerald-200';
                  } else if (isSelected && !userGotItRight) {
                    btnStyle = 'border-rose-500/60 bg-rose-500/20 text-rose-200';
                  } else {
                    btnStyle = 'border-white/5 bg-white/2 opacity-40 text-slate-400';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-yellow-400 bg-yellow-400/10 text-yellow-300';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => !isAnswerChecked && setSelectedMcOption(oIdx)}
                    disabled={isAnswerChecked}
                    className={`px-4 py-3 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all text-left flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-black/25 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="flex-1"><CodeFormattedText text={opt} /></span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill in the blank */}
          {q.type === 'fill-in-the-blank' && (
            <div className="space-y-3 text-left">
              <div className="text-xs sm:text-sm bg-black/30 p-4 rounded-2xl border-2 border-yellow-400/40 leading-relaxed font-medium text-slate-100 shadow-inner">
                <span className="text-[#FFCC33] font-black uppercase text-[10px] block mb-1.5 tracking-wider">💡 Fill in the Blank Instruction:</span>
                {(q.blankSentence || (q.question.includes('______') ? q.question : `Complete the statement: ${q.question} ______`)).split('______').map((part, pIdx, arr) => (
                  <React.Fragment key={pIdx}>
                    <CodeFormattedText text={part} />
                    {pIdx < arr.length - 1 && (
                      <span className="inline-block px-2.5 py-0.5 mx-1.5 bg-yellow-400/20 border-2 border-yellow-400 text-yellow-300 rounded font-black text-center text-xs shadow-sm">
                        ______
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type your answer here..."
                value={fillBlankInput}
                onChange={(e) => !isAnswerChecked && setFillBlankInput(e.target.value)}
                disabled={isAnswerChecked}
                className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 focus:bg-white/10 border-2 border-white/10 focus:border-yellow-400 rounded-xl text-xs sm:text-sm text-white focus:outline-none transition-all font-bold"
              />
            </div>
          )}

          {/* Drag and Drop */}
          {q.type === 'drag-drop' && (
            <div className="space-y-4 text-left">
              <div className="text-xs sm:text-sm bg-black/25 p-4 rounded-2xl border border-white/5 leading-relaxed font-medium">
                {(q.blankSentence || (q.question.includes('______') ? q.question : `Complete the statement: ${q.question} ______`)).split('______').map((part, pIdx, arr) => (
                  <React.Fragment key={pIdx}>
                    <CodeFormattedText text={part} />
                    {pIdx < arr.length - 1 && (
                      <span className={`inline-block px-3 py-1 mx-1.5 rounded-lg border-2 font-black ${
                        dragPlacedPill 
                          ? 'bg-yellow-400/10 border-yellow-400 text-yellow-300' 
                          : 'bg-black/40 border-dashed border-white/20 text-transparent min-w-16 text-center'
                      }`}>
                        {dragPlacedPill || '______'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {!isAnswerChecked && q.dragOptions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {q.dragOptions.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => setDragPlacedPill(opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                        dragPlacedPill === opt
                          ? 'bg-yellow-400 text-[#1A1A1A] border-[#1A1A1A]'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                  {dragPlacedPill && (
                    <button
                      onClick={() => setDragPlacedPill(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#FFCC33] hover:bg-white/5 cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Match Following */}
          {q.type === 'match-following' && (
            <div className="space-y-4 text-left">
              <p className="text-[11px] text-yellow-300/80 font-bold">
                💡 Click a Concept on the left, then click its corresponding Definition on the right!
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-white/50 tracking-wider">Concept</span>
                  {leftItems.map((leftItem, lIdx) => {
                    const isSelected = leftSelected === leftItem;
                    const matchedRight = tempMatchedPairs[leftItem];
                    
                    return (
                      <button
                        key={lIdx}
                        onClick={() => handleLeftClick(leftItem)}
                        disabled={isAnswerChecked}
                        className={`w-full text-left px-3 py-2.5 rounded-xl border-2 text-[11px] font-black transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                            : matchedRight
                            ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300/80'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                        }`}
                      >
                        <span>{leftItem}</span>
                        {matchedRight && (
                          <span className="text-[9px] text-gray-400 mt-1.5 flex items-center gap-1 border-t border-white/5 pt-1 font-sans">
                            Linked to: <span className="text-yellow-400 font-extrabold">{matchedRight.slice(0, 18)}...</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-white/50 tracking-wider">Definition</span>
                  {rightItems.map((rightItem, rIdx) => {
                    const isPaired = Object.values(tempMatchedPairs).includes(rightItem);
                    const pairingLeft = Object.keys(tempMatchedPairs).find(k => tempMatchedPairs[k] === rightItem);
                    
                    return (
                      <button
                        key={rIdx}
                        onClick={() => handleRightClick(rightItem)}
                        disabled={isAnswerChecked || !leftSelected || isPaired}
                        className={`w-full text-left px-3 py-2.5 rounded-xl border-2 text-[11px] font-bold transition-all cursor-pointer ${
                          isPaired
                            ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300/60'
                            : leftSelected
                            ? 'border-yellow-400/30 bg-yellow-400/5 hover:bg-yellow-400/10 text-white animate-pulse'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                        }`}
                      >
                        <span>{rightItem}</span>
                        {pairingLeft && (
                          <span className="text-[9px] text-emerald-400/75 mt-1 block border-t border-white/5 pt-1">
                            ✓ Paired
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {Object.keys(tempMatchedPairs).length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2 mt-3 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                      🔗 Linked Pairs ({Object.keys(tempMatchedPairs).length} / {leftItems.length}):
                    </span>
                    {!isAnswerChecked && (
                      <button
                        onClick={() => {
                          setTempMatchedPairs({});
                          setLeftSelected(null);
                        }}
                        className="text-[9px] font-black bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30 transition-colors cursor-pointer"
                      >
                        Reset All Pairs
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(tempMatchedPairs).map(([left, right]) => (
                      <div key={left} className="flex items-center justify-between gap-2 p-2 bg-black/20 border border-white/10 rounded-xl text-xs">
                        <div className="truncate flex-1 text-slate-300 text-[11px]">
                          <span className="font-black text-amber-300">{left}</span>
                          <span className="mx-1 text-gray-500">➔</span>
                          <span className="text-white/80">{right}</span>
                        </div>
                        {!isAnswerChecked && (
                          <button
                            onClick={() => {
                              setTempMatchedPairs(prev => {
                                const updated = { ...prev };
                                delete updated[left];
                                return updated;
                              });
                            }}
                            className="text-rose-400 hover:text-rose-300 font-black px-1 rounded transition-all cursor-pointer"
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
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isAnswerChecked ? (
            <div className={`p-4 rounded-2xl border-2 space-y-3 text-left animate-fadeIn ${
              isAnswerCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-100'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{isAnswerCorrect ? '🎉' : '❌'}</span>
                <span className={`text-xs sm:text-sm font-black uppercase ${
                  isAnswerCorrect ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  {isAnswerCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                </span>
                <span className="ml-auto text-[10px] font-bold bg-black/25 px-2 py-0.5 rounded-full text-yellow-300">
                  {isAnswerCorrect ? '+10 XP Earned!' : 'Keep learning'}
                </span>
              </div>
              <p className="text-xs font-sans leading-relaxed text-slate-200">
                {q.explanation}
              </p>
              {isAnswerCorrect ? (
                currentQuizIndex < quizQuestions.length - 1 && (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="w-full py-2.5 bg-white text-[#1A1A1A] hover:bg-amber-100 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )
              ) : (
                <button
                  onClick={handleTryAgain}
                  className="w-full py-2.5 bg-[#FFCC33] hover:bg-yellow-400 text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleCheckQuizAnswer}
              disabled={
                (q.type === 'multiple-choice' && selectedMcOption === null) ||
                (q.type === 'fill-in-the-blank' && !fillBlankInput.trim()) ||
                (q.type === 'drag-drop' && !dragPlacedPill) ||
                (q.type === 'match-following' && Object.keys(tempMatchedPairs).length < leftItems.length)
              }
              className="w-full py-3 bg-[#FFCC33] hover:bg-yellow-400 disabled:opacity-40 text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check Answer</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render a highly-styled, interactive custom briefing view instead of plain markdown
  const renderLevelBriefing = (briefing: NonNullable<AppData['briefingData']>, msgId: string) => {
    return (
      <div className="space-y-5 text-slate-800 dark:text-slate-100" id={`briefing-container-${msgId}`}>
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 dark:border-slate-700 pb-3" id={`briefing-header-${msgId}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] sm:text-xs font-black uppercase bg-gradient-to-r from-amber-50 to-amber-100/60 dark:from-amber-950/60 dark:to-amber-900/30 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-xl shadow-2xs">
              🐉 Chapter {briefing.chapterNumber}: {briefing.chapterTitle}
            </span>
            <span className="text-[10px] sm:text-xs font-black uppercase bg-[#6D071A] text-yellow-300 border-2 border-[#1A1A1A] px-3 py-1 rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A]">
              Level {briefing.levelNumber}
            </span>
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-amber-700 dark:text-yellow-400 font-mono">
            Syllabus Unit {briefing.chapterNumber}.{briefing.levelNumber}
          </div>
        </div>

        {/* Welcome Greeting */}
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed font-sans flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
          <span>Kuzuzangpo la! 🙏 Welcome to the active quest. Here is your curriculum briefing:</span>
        </div>

        {/* Bhutanese Learning Analogy Section */}
        <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/30 dark:from-slate-900/40 dark:to-slate-900/20 border border-amber-200/60 dark:border-slate-800/80 rounded-2xl p-4.5 space-y-2.5 transition-all hover:border-amber-400/60 shadow-xs" id={`briefing-analogy-${msgId}`}>
          <div className="flex items-center gap-2.5 text-amber-950 dark:text-amber-200">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300/50 flex items-center justify-center shrink-0 shadow-2xs">
              <TaktsangMonasteryIcon className="w-5 h-5 text-amber-800 dark:text-amber-300 shrink-0" />
            </div>
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider font-serif text-amber-950 dark:text-amber-100">
              🏔️ Bhutanese Learning Analogy
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
            {briefing.analogy}
          </p>
        </div>

        {/* Core Syllabus Concepts */}
        <div className="space-y-3" id={`briefing-concepts-${msgId}`}>
          <div className="flex items-center gap-2.5 text-amber-950 dark:text-amber-200">
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/50 dark:border-red-900/40 flex items-center justify-center shrink-0 shadow-2xs">
              <BookOpen className="w-4 h-4 text-[#6D071A] dark:text-yellow-400" />
            </div>
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider font-serif text-amber-950 dark:text-amber-100">
              💻 Core Syllabus Concepts
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {briefing.keyConcepts.map((concept, idx) => {
              const colonIndex = concept.indexOf(':');
              let title = '';
              let desc = concept;
              if (colonIndex > 0) {
                title = concept.slice(0, colonIndex).trim();
                desc = concept.slice(colonIndex + 1).trim();
              }
              return (
                <div 
                  key={idx} 
                  className="flex flex-col gap-1.5 bg-white dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/80 p-3.5 rounded-2xl shadow-2xs hover:shadow-xs hover:border-amber-300/80 dark:hover:border-slate-700 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center text-[10px] font-black shrink-0">
                      ✓
                    </span>
                    {title ? (
                      <h5 className="text-xs sm:text-sm font-black text-[#6D071A] dark:text-yellow-400 tracking-tight font-serif">
                        {title}
                      </h5>
                    ) : (
                      <h5 className="text-xs sm:text-sm font-black text-[#6D071A] dark:text-yellow-400 tracking-tight font-serif">
                        Concept {idx + 1}
                      </h5>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium pl-7.5">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Flowchart / Diagram Section */}
        {briefing.mermaid && (
          <div className="space-y-2 border border-amber-200/50 dark:border-slate-800 p-4 rounded-2xl bg-white/60 dark:bg-slate-950/20 shadow-2xs" id={`briefing-flowchart-${msgId}`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2 mb-2">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                📊 Lesson Flow Diagram
              </span>
              <span className="text-[9px] font-bold text-amber-700 dark:text-yellow-400">Interactive Visualization</span>
            </div>
            <MermaidDiagram chart={briefing.mermaid} />
          </div>
        )}

        {/* Interactive Practice Quiz Section */}
        {renderInteractiveQuiz()}
      </div>
    );
  };

  // Helper to render Markdown + Mermaid diagrams
  const renderFormattedMessageText = (text: string) => {
    const parts = text.split(/(```mermaid[\s\S]*?```|```python[\s\S]*?```|```[\s\S]*?```)/i);

    return parts.map((part, index) => {
      if (part.toLowerCase().startsWith('```mermaid')) {
        const chartCode = part.replace(/```mermaid/i, '').replace(/```$/, '').trim();
        return <MermaidDiagram key={index} chart={chartCode} />;
      }

      if (part.toLowerCase().startsWith('```python')) {
        const codeSnippet = part.replace(/```python/i, '').replace(/```$/, '').trim();
        return (
          <div key={index} className="my-3 bg-slate-950 text-emerald-300 font-mono text-xs p-3.5 rounded-2xl border-2 border-slate-800 overflow-x-auto shadow-md">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800 font-sans">
              <span className="text-amber-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <span>🐍</span> Python Code Example
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(codeSnippet);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer transition-all"
                  title="Copy code to clipboard"
                >
                  <Check className="w-3 h-3 text-emerald-400" /> Copy
                </button>
                {onOpenIdeWithCode && (
                  <button
                    type="button"
                    onClick={() => onOpenIdeWithCode(codeSnippet)}
                    className="px-2.5 py-1 bg-[#FFCC33] hover:bg-amber-400 text-[#1A1A1A] font-black text-[10px] rounded-lg border border-[#1A1A1A] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                    title="Open this code directly in Python IDE and execute"
                  >
                    <span>🚀 Run in Python IDE</span>
                  </button>
                )}
              </div>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">{codeSnippet}</pre>
          </div>
        );
      }

      if (part.startsWith('```')) {
        const codeSnippet = part.replace(/```[a-z]*/i, '').replace(/```$/, '').trim();
        return (
          <div key={index} className="my-2 bg-slate-900 text-amber-200 font-mono text-xs p-3 rounded-xl border border-slate-800 overflow-x-auto">
            <pre className="whitespace-pre-wrap">{codeSnippet}</pre>
          </div>
        );
      }

      // Paragraph / Markdown formatting
      return (
        <div key={index} className="markdown-body space-y-2 leading-relaxed text-xs sm:text-sm">
          <Markdown>{part}</Markdown>
        </div>
      );
    });
  };

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
  const isQuizDone = quizCompleted || userStats.completedLevels.includes(currentLevel.id);
  const rawNavOptions = lastAssistantMsg?.appData?.navigationOptions || ['⬅️ Previous Quest', '➡️ Next Quest'];
  const navOptions = rawNavOptions.filter((opt) => {
    const isRetry = opt.toLowerCase().includes('retry');
    const isNextQuest = opt.toLowerCase().includes('next quest');
    if (isRetry) return false;
    if (isNextQuest && quizCompleted) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 pt-[5px] pb-6 flex flex-col min-h-[calc(100vh-140px)]">
      {/* Active Quest Banner Header - Premium Royal Bhutanese Aesthetic */}
      <div className="bg-gradient-to-br from-[#50030E] via-[#3C0109] to-[#220004] text-white p-5 sm:p-6 rounded-3xl border-2 border-yellow-500/40 shadow-[0_12px_40px_rgba(109,7,26,0.15)] mb-5 flex flex-wrap items-center justify-between gap-5 shrink-0 transition-all duration-300">
        <div className="flex items-center gap-4 min-w-0 flex-1 sm:flex-initial">
          <div className="p-2.5 bg-yellow-500/10 rounded-2xl border border-yellow-400/30 shrink-0 shadow-inner">
            <TaktsangMonasteryIcon className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs font-black text-yellow-400 uppercase tracking-widest flex flex-wrap items-center gap-2">
              <span>Chapter {currentModule.chapterNumber} • Level {currentLevel.levelNumber}</span>
              {userStats.completedLevels.includes(currentLevel.id) ? (
                <span className="text-[9px] sm:text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/45 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 tracking-wider uppercase">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Cleared (0 XP)
                </span>
              ) : (
                <span className="text-[9px] sm:text-[10px] bg-amber-500/20 text-yellow-300 border border-amber-400/35 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 tracking-wider uppercase shadow-2xs">
                  <Sparkles className="w-3 h-3 text-yellow-400 shrink-0" /> +{currentLevel.xpReward} XP
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-black font-serif text-amber-50 leading-tight tracking-tight mt-1 truncate">
              {currentLevel.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto shrink-0">
          <button
            onClick={handleOpenStuckModal}
            className="px-3.5 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/45 rounded-xl text-[11px] font-black tracking-wide transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            title="Ask your Class 10 Teacher for help on this exercise"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Stuck?</span>
          </button>

          <button
            onClick={() => setShowHelpLogsDrawer(!showHelpLogsDrawer)}
            className={`px-3.5 py-2 rounded-xl border text-[11px] font-black tracking-wide transition-all cursor-pointer flex items-center gap-1.5 relative ${
              showHelpLogsDrawer
                ? 'bg-[#FFCC33] text-[#1A1A1A] border-[#1A1A1A] shadow-inner'
                : 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-600/40 text-amber-200'
            }`}
            title="View your submitted help requests & teacher responses"
          >
            <MessageSquare className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>Teacher Replies</span>
            {myHelpRequests.length > 0 && (
              <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none shrink-0 min-w-4 text-center">
                {myHelpRequests.length}
              </span>
            )}
          </button>

          {onSelectPrevLevel && (
            <button
              onClick={onSelectPrevLevel}
              className="p-2 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/40 rounded-xl text-amber-200 hover:text-white transition-all cursor-pointer"
              title="Previous Level"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Teacher Replies Drawer */}
      {showHelpLogsDrawer && (
        <div className="bg-[#1A1A1A] text-white p-4 rounded-2xl border-2 border-[#FFCC33] mb-4 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-3">
            <span className="text-xs font-black text-[#FFCC33] uppercase flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-400" /> My Classroom Help Requests & Teacher Replies ({myHelpRequests.length})
            </span>
            <button
              onClick={() => setShowHelpLogsDrawer(false)}
              className="text-xs text-gray-400 hover:text-white cursor-pointer"
            >
              Close ✕
            </button>
          </div>

          {myHelpRequests.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-400">
              You haven't submitted any help requests yet. Click <strong className="text-rose-400">Stuck?</strong> anytime to log a query for your teacher!
            </div>
          ) : (
            <div className="space-y-3 max-h-56 overflow-y-auto scrollbar-thin pr-1">
              {myHelpRequests.map((req) => (
                <div key={req.id} className="bg-[#2A2A2A] p-3 rounded-xl border border-gray-700 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] flex-wrap gap-1">
                    <span className="font-extrabold text-amber-300">{req.chapterTitle} • {req.levelTitle}</span>
                    {req.status === 'resolved' ? (
                      <span className="bg-emerald-900/90 text-emerald-300 border border-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Teacher Replied
                      </span>
                    ) : (
                      <span className="bg-amber-900/90 text-amber-200 border border-amber-500 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                  </div>

                  <div className="bg-[#1A1A1A] p-2 rounded-lg border border-gray-800 text-gray-200 italic">
                    "{req.query}"
                  </div>

                  {req.teacherResponse && (
                    <div className="bg-emerald-950/90 border border-emerald-500/80 p-2.5 rounded-lg text-emerald-200 space-y-1">
                      <div className="text-[10px] font-black text-yellow-300 uppercase flex items-center gap-1">
                        <span>👩‍🏫 {req.respondedBy || 'Teacher'} Response:</span>
                      </div>
                      <p className="font-medium">{req.teacherResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 space-y-4 p-4 md:p-5 bg-amber-50/40 dark:bg-slate-900/60 rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            id={`msg-${msg.id}`}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            {msg.role === 'assistant' ? (
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-white border border-amber-300 shadow-sm">
                <Logo />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-slate-800 text-amber-300 font-extrabold text-xs flex items-center justify-center shadow-md shrink-0 border border-slate-700">
                🎓
              </div>
            )}

            {/* Bubble Content */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm text-xs sm:text-sm font-sans ${
                msg.role === 'user'
                  ? 'bg-amber-800 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-amber-200/80 dark:border-slate-700 rounded-tl-none'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center justify-between font-serif text-amber-800 dark:text-yellow-400 font-extrabold text-xs mb-2 border-b border-amber-100 dark:border-slate-700 pb-1.5">
                  <span className="flex items-center gap-1">
                    <span>Guna ICT Online Tutor</span>
                    <span className="text-[10px] font-normal text-amber-600 dark:text-amber-300 font-sans">
                      (Class 10 ICT)
                    </span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakText(msg.text)}
                      className="p-1 text-amber-800 hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-100 transition-colors cursor-pointer"
                      title="Read Aloud Voice Tutor"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    {msg.appData && (
                      <div className="flex items-center gap-2 font-sans font-bold">
                        {msg.appData.xpAwarded > 0 && (
                          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                            <Award className="w-3 h-3" /> +{msg.appData.xpAwarded} XP
                          </span>
                        )}
                        {msg.appData.xpDeducted > 0 && (
                          <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full text-[10px]">
                            -{msg.appData.xpDeducted} XP
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {msg.appData?.briefingData ? (
                renderLevelBriefing(msg.appData.briefingData, msg.id)
              ) : (
                renderFormattedMessageText(msg.text)
              )}

              {msg.simplifiedText && (
                <div className="mt-3.5 p-3.5 bg-amber-50/90 dark:bg-amber-950/40 border-2 border-[#FFCC33] dark:border-amber-700 rounded-2xl space-y-2 text-xs shadow-md">
                  <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-800/80 pb-1.5 font-serif font-black text-amber-950 dark:text-amber-200">
                    <span className="flex items-center gap-1.5">
                      <span>🐉</span> Simplified Explanation (Bhutanese Analogy)
                    </span>
                    <button
                      type="button"
                      onClick={() => speakText(msg.simplifiedText!)}
                      className="p-1 text-amber-900 dark:text-amber-300 hover:text-amber-600 transition-colors cursor-pointer"
                      title="Read simplified explanation aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-slate-800 dark:text-amber-100 font-sans leading-relaxed">
                    {renderFormattedMessageText(msg.simplifiedText)}
                  </div>
                </div>
              )}


            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFCC33] text-[#1A1A1A] font-bold text-sm flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] animate-bounce shrink-0">
              🐉
            </div>
            <div className="bg-[#FDFCF0] dark:bg-slate-800 p-3 rounded-2xl border-2 border-[#1A1A1A] text-xs text-[#1A1A1A] dark:text-amber-200 font-bold flex flex-wrap items-center justify-between gap-3 shadow-[3px_3px_0px_0px_#1A1A1A] max-w-lg">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#6D071A] shrink-0" />
                <span>Guna is preparing your Class 10 ICT response...</span>
              </div>
              <button
                onClick={() => {
                  setIsLoading(false);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `instant-hint-${Date.now()}`,
                      role: 'assistant',
                      text: `Kuzuzangpo la! 🙏 Here is an instant hint for **${currentLevel.title}**:\n\n* **Key Concept**: ${currentLevel.summary}\n* **Bhutanese Analogy**: ${currentLevel.bhutanAnalogy}\n\n**Challenge**: ${currentLevel.exerciseQuestion}`,
                      timestamp: Date.now(),
                      appData: {
                        xpAwarded: 25,
                        xpDeducted: 0,
                        questStatus: 'in_progress',
                        currentTopic: currentLevel.title,
                        levelComplete: false,
                        navigationOptions: ['🔄 Retry Challenge', '➡️ Next Quest'],
                      },
                    },
                  ]);
                }}
                className="px-2.5 py-1 bg-[#FFCC33] hover:bg-yellow-400 text-[#1A1A1A] rounded-lg border border-[#1A1A1A] text-[10px] font-black cursor-pointer shadow-[1px_1px_0px_0px_#1A1A1A]"
              >
                ⚡ Get Instant Answer
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Quick Navigation & Practice Option Pills */}
      {navOptions.length > 0 && !isLoading && (
        <div className="py-2.5 flex items-center gap-2.5 overflow-x-auto scrollbar-none shrink-0">
          {navOptions.map((opt, i) => {
            const isNextQuest = opt.includes('Next Quest');
            const isUnlocked = !isNextQuest || quizCompleted || userStats.completedLevels.includes(currentLevel.id);
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (isNextQuest) {
                    if (isUnlocked && onSelectNextLevel) {
                      onSelectNextLevel();
                    }
                  } else if (opt.includes('Previous Quest') && onSelectPrevLevel) {
                    onSelectPrevLevel();
                  } else {
                    handleSendMessage(opt);
                  }
                }}
                disabled={isNextQuest && !isUnlocked}
                className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
                  isNextQuest
                    ? isUnlocked
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-y-[-1px] cursor-pointer'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-75'
                    : 'bg-amber-100 dark:bg-slate-800 hover:bg-yellow-400 hover:text-amber-950 border border-amber-300 dark:border-slate-700 text-amber-900 dark:text-amber-200 cursor-pointer shadow-xs'
                }`}
                title={isNextQuest && !isUnlocked ? 'Complete the interactive quiz above to unlock Next Quest' : 'Proceed to Next Quest'}
              >
                <span>{opt}</span>
                {isNextQuest && !isUnlocked && (
                  <span className="text-[10px] font-normal opacity-75 bg-slate-300 dark:bg-slate-700 px-1.5 py-0.5 rounded-md">Locked</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-2 flex flex-col gap-1 shrink-0"
      >
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 border border-amber-300 dark:border-amber-800/80 rounded-2xl shadow-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPaste={(e) => {
              if (!isQuizDone) {
                e.preventDefault();
                soundFx.playRetry();
                setPasteError("Unlocked only after completing the quiz");
                setTimeout(() => setPasteError(null), 4000);
              }
            }}
            placeholder={isQuizDone ? "Type your answer, ask Guna a question, or request a hint..." : "Type your answer manually (pasting locked)..."}
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
          />

          <button
            type="button"
            onClick={handleOpenStuckModal}
            className="px-3 py-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1 shrink-0"
            title="Ask your teacher for help"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">Stuck?</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
          >
            <span>Submit</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {pasteError ? (
          <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/25 rounded-lg text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{pasteError}</span>
          </div>
        ) : !isQuizDone ? (
          <div className="px-3 py-1 bg-amber-500/5 border border-amber-500/10 rounded-lg text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Unlocked only after completing the quiz</span>
          </div>
        ) : null}
      </form>

      {/* Stuck Modal Overlay */}
      {showStuckModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-6 max-w-lg w-full shadow-[8px_8px_0px_0px_#6D071A] space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-black text-sm uppercase tracking-wider">
                <LifeBuoy className="w-5 h-5 text-yellow-500" />
                <span>Classroom Help Request</span>
              </div>
              <button
                onClick={() => setShowStuckModal(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border-2 border-amber-300 dark:border-slate-700 text-xs space-y-1">
              <div className="font-extrabold text-[#6D071A] dark:text-amber-300">
                📍 {currentModule.title}
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Level {currentLevel.levelNumber}: {currentLevel.title}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-slate-400">
                Student: <strong>{userStats.studentName}</strong> ({userStats.classSection} • {userStats.schoolName})
              </div>
            </div>

            {helpSubmittedSuccess ? (
              <div className="bg-emerald-100 border-2 border-emerald-500 text-emerald-900 p-4 rounded-2xl text-xs font-bold text-center space-y-1 animate-fadeIn">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-black">Help Request Submitted to Teacher Portal!</p>
                <p className="text-[11px] text-emerald-800 font-medium">Your Class 10 ICT teacher can view and respond directly in the Teacher Portal.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitStuckQuery} className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 dark:text-amber-200 mb-1">
                    Describe what you are stuck on or need help with:
                  </label>
                  <textarea
                    value={stuckQuery}
                    onChange={(e) => setStuckQuery(e.target.value)}
                    placeholder="e.g. I am confused about how nested loops work in Python or how to write this function..."
                    className="w-full h-28 bg-slate-50 dark:bg-slate-950 border-2 border-[#1A1A1A] dark:border-slate-700 p-3 rounded-2xl text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowStuckModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-gray-300 dark:border-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingHelp || !stuckQuery.trim()}
                    className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FFCC33] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingHelp ? 'Submitting...' : 'Send to Teacher Log'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Searchable ICT Glossary Modal */}
      <ICTGlossaryModal
        isOpen={showIctGlossaryModal}
        onClose={() => setShowIctGlossaryModal(false)}
        initialTerm={selectedGlossaryTerm}
      />

      {/* Particle Confetti Celebration Effect */}
      <ParticleConfetti
        isActive={showConfetti}
        rewardXp={completedRewardXp}
        levelTitle={currentLevel.title}
        onClose={() => setShowConfetti(false)}
      />
    </div>
  );
};
