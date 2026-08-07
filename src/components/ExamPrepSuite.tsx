import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Award, CheckCircle2, XCircle, RotateCcw, ChevronRight, HelpCircle, BookOpen, Sparkles, Volume2, Globe } from 'lucide-react';
import { speakText, stopSpeech } from '../lib/speech';
import { DZONGKHA_GLOSSARY } from '../lib/dzongkhaDictionary';
import { CodeFormattedText } from './CodeFormattedText';
import { getStudentExamQuestions, useContentRefresh } from '../lib/contentManager';
import { DEFAULT_MOCK_EXAM_QUESTIONS } from '../data/examData';
import { BcseaExamMastery } from './BcseaExamMastery';
import { AiExamSimulator } from './AiExamSimulator';

interface Question {
  id: number | string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  chapter: string;
}

interface Flashcard {
  id: string;
  category: 'Python' | 'Excel' | 'Cloud' | 'Cyber' | 'Workspace';
  title: string;
  front: string;
  back: string;
  codeSnippet?: string;
  dzongkhaTerm?: string;
}

const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 'f1',
    category: 'Python',
    title: 'Python List Append',
    front: 'How do you add an element to the end of a list in Python?',
    back: 'Use `.append(value)`. Example: `students.append("Sonam")`.',
    codeSnippet: 'fruits = ["Apple", "Mango"]\nfruits.append("Banana")\n# fruits is now ["Apple", "Mango", "Banana"]',
    dzongkhaTerm: 'འགྱུར་ཅན། (List Data Structure)'
  },
  {
    id: 'f2',
    category: 'Python',
    title: 'Python Indentation Rule',
    front: 'Why is indentation mandatory in Python code?',
    back: 'Python uses 4 spaces (indentation) instead of curly braces {} to define blocks of code inside functions, loops, and conditionals.',
    dzongkhaTerm: 'གནས་སྟངས་རྩིས་ཞིབ། (Block Scope)'
  },
  {
    id: 'f3',
    category: 'Excel',
    title: 'VLOOKUP Function',
    front: 'What are the 4 arguments required by Excel VLOOKUP?',
    back: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]). It searches vertically down the leftmost column.',
    codeSnippet: '=VLOOKUP(101, A2:D50, 2, FALSE)',
    dzongkhaTerm: 'ཤོག་ཁྲམ། (Spreadsheet Formula)'
  },
  {
    id: 'f4',
    category: 'Cloud',
    title: 'Cloud vs Local Storage',
    front: 'Name 2 distinct advantages of Cloud Storage over Local Hard Drives.',
    back: '1. Accessibility from any internet-connected device.\n2. Automated backup and seamless multi-user collaboration.',
    dzongkhaTerm: 'སྤྲིན་ཕུང་གནས་སྡུད། (Trinpung Nedue)'
  },
  {
    id: 'f5',
    category: 'Cyber',
    title: 'Creative Commons License',
    front: 'What is a Creative Commons (CC) license?',
    back: 'A public copyright license that enables creators to grant the public permission to share and use their creative work under specific conditions.',
    dzongkhaTerm: 'པར་དབང་དང་ཡ་རབས། (Parwang dang Yarab)'
  },
  {
    id: 'f6',
    category: 'Python',
    title: 'Python Recursive Function',
    front: 'What defines a recursive function in Python?',
    back: 'A function that calls itself to solve smaller instances of a problem, requiring a base case to terminate execution.',
    dzongkhaTerm: 'རང་འཁོར་ལས་ཐབས། (Rangkhor Lethab)'
  }
];

interface ExamPrepSuiteProps {
  onRewardXp?: (amount: number, levelId: string) => void;
}

export const ExamPrepSuite: React.FC<ExamPrepSuiteProps> = ({ onRewardXp }) => {
  const contentVersion = useContentRefresh();
  const mockQuestions = getStudentExamQuestions();
  const [activeTab, setActiveTab] = useState<'ai-simulator' | 'exam' | 'flashcards' | 'bcsea'>('ai-simulator');

  // Exam State
  const [examStarted, setExamStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Flashcards State
  const [cardCategory, setCardCategory] = useState<string>('All');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [dzongkhaMode, setDzongkhaMode] = useState(false);

  // Exam Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && !examSubmitted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setExamSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examSubmitted, timeRemaining]);

  const handleStartExam = () => {
    setExamStarted(true);
    setExamSubmitted(false);
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeRemaining(600);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (examSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [currentQIndex]: optionIndex }));
  };

  const handleNextQ = () => {
    if (currentQIndex < mockQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePrevQ = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    // Calculate score
    let score = 0;
    mockQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) score++;
    });

    if (score >= 4 && onRewardXp) {
      onRewardXp(score * 20, 'quick-practice-mock-exam');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCardFlip = (cardId: string) => {
    setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const filteredCards =
    cardCategory === 'All'
      ? FLASHCARDS_DATA
      : FLASHCARDS_DATA.filter((c) => c.category === cardCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#6D071A] text-white p-6 rounded-3xl border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FFCC33] text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> BCSEA Class 10 ICT Examination Standard
          </div>
          <h2 className="text-2xl font-black font-serif text-amber-100 mt-1">
            📝 Exam Prep & Practice Suite
          </h2>
          <p className="text-xs text-amber-200/80 mt-1 max-w-xl">
            Prepare for Class 10 Board Examinations with timed chapter mock exams, step-by-step answer key explanations, and interactive revision flashcards!
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-[#1A1A1A] p-1.5 rounded-2xl border-2 border-[#FFCC33]">
          <button
            onClick={() => setActiveTab('ai-simulator')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai-simulator'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFCC33] fill-[#FFCC33]" />
            <span>AI 20-Q Exam Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('bcsea')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'bcsea'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            🎯 BHSEC Traps & Tracing
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'exam'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            ⏱️ Quick Practice Quiz
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            🎴 Flashcards
          </button>
        </div>
      </div>

      {/* TAB 0: AI 20-QUESTION EXAM SIMULATOR */}
      {activeTab === 'ai-simulator' && <AiExamSimulator onRewardXp={onRewardXp} />}

      {/* TAB 1: MOCK EXAM */}
      {activeTab === 'exam' && (
        <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 sm:p-8 shadow-[8px_8px_0px_0px_#1A1A1A]">
          {!examStarted ? (
            <div className="text-center py-10 max-w-xl mx-auto space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FFCC33] border-4 border-[#1A1A1A] flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_#1A1A1A]">
                📋
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#1A1A1A] font-serif">
                  Class 10 ICT Full Syllabus Mock Exam
                </h3>
                <p className="text-xs font-medium text-gray-600 mt-2 leading-relaxed">
                  Test your mastery across Python, MS Excel, Cloud Workspace, Cyber Ethics, and Web Development. Standard 10-minute timer with instant score report and step-by-step logic breakdowns.
                </p>
              </div>

              <div className="bg-amber-50 border-2 border-[#1A1A1A] p-4 rounded-2xl text-left text-xs space-y-2">
                <div className="font-extrabold text-[#6D071A]">Exam Guidelines:</div>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>6 Multiple Choice & Code Tracing Questions</li>
                  <li>10-Minute Countdown Timer</li>
                  <li>Earn up to +120 XP for passing scores (70% or higher)</li>
                </ul>
              </div>

              <button
                onClick={handleStartExam}
                className="w-full py-4 bg-[#6D071A] hover:bg-[#80091F] text-amber-200 font-black text-sm uppercase tracking-wider border-4 border-[#1A1A1A] rounded-2xl shadow-[5px_5px_0px_0px_#FFCC33] cursor-pointer transition-transform active:translate-y-0.5"
              >
                Start Timed Exam Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Exam Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#6D071A] text-white px-3 py-1 rounded-xl text-xs font-black uppercase border border-[#1A1A1A]">
                    Q{currentQIndex + 1} of {mockQuestions.length}
                  </span>
                  <span className="text-xs font-extrabold text-gray-500">
                    Category: {mockQuestions[currentQIndex]?.chapter || 'General'}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#FFCC33] px-4 py-2 rounded-2xl border-2 border-[#1A1A1A] text-xs font-black font-mono shadow-[3px_3px_0px_0px_#1A1A1A]">
                  <Timer className="w-4 h-4 text-[#1A1A1A]" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              </div>

              {/* Question Body */}
              <div className="space-y-4">
                <div className="text-lg font-black text-[#1A1A1A]">
                  <CodeFormattedText text={mockQuestions[currentQIndex]?.question || ''} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(mockQuestions[currentQIndex]?.options || []).map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQIndex] === optIdx;
                    const isCorrect = optIdx === mockQuestions[currentQIndex]?.correctAnswer;

                    let btnStyle = 'bg-white text-[#1A1A1A] border-[#1A1A1A] hover:bg-amber-50';

                    if (examSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-600 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-100 text-rose-900 border-rose-600 font-bold';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-[#6D071A] text-amber-200 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#FFCC33]';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(optIdx)}
                        className={`p-4 rounded-2xl border-2 text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {examSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {examSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box on submission */}
                {examSubmitted && (
                  <div className="bg-amber-50 border-2 border-[#1A1A1A] p-4 rounded-2xl text-xs space-y-1.5 animate-fadeIn">
                    <div className="font-black text-[#6D071A] flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" /> Explanation:
                    </div>
                    <p className="text-gray-700 font-medium">
                      {mockQuestions[currentQIndex]?.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                <button
                  onClick={handlePrevQ}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 bg-gray-100 disabled:opacity-40 text-[#1A1A1A] font-extrabold text-xs rounded-xl border-2 border-[#1A1A1A] cursor-pointer"
                >
                  Previous
                </button>

                {currentQIndex < mockQuestions.length - 1 ? (
                  <button
                    onClick={handleNextQ}
                    className="px-5 py-2 bg-[#FFCC33] text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer"
                  >
                    Next Question
                  </button>
                ) : (
                  !examSubmitted && (
                    <button
                      onClick={handleSubmitExam}
                      className="px-6 py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer"
                    >
                      Submit Exam
                    </button>
                  )
                )}
              </div>

              {/* Score Summary Modal upon Submit */}
              {examSubmitted && (
                <div className="bg-[#1A1A1A] text-white p-6 rounded-3xl border-4 border-[#FFCC33] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black font-serif text-[#FFCC33]">
                      🎉 Exam Evaluation Scorecard
                    </h4>
                    <button
                      onClick={handleStartExam}
                      className="px-3 py-1.5 bg-[#FFCC33] text-[#1A1A1A] font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retake
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-[#2D2D2D] p-3 rounded-2xl border border-gray-700 text-center">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Total Correct</span>
                      <div className="text-2xl font-black text-emerald-400 font-mono">
                        {
                          Object.entries(userAnswers).filter(
                            ([qIdx, ans]) => mockQuestions[Number(qIdx)]?.correctAnswer === ans
                          ).length
                        }{' '}
                        / {mockQuestions.length}
                      </div>
                    </div>

                    <div className="bg-[#2D2D2D] p-3 rounded-2xl border border-gray-700 text-center">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Score Percentage</span>
                      <div className="text-2xl font-black text-[#FFCC33] font-mono">
                        {Math.round(
                          (Object.entries(userAnswers).filter(
                            ([qIdx, ans]) => mockQuestions[Number(qIdx)]?.correctAnswer === ans
                          ).length /
                            (mockQuestions.length || 1)) *
                            100
                        )}
                        %
                      </div>
                    </div>

                    <div className="bg-[#2D2D2D] p-3 rounded-2xl border border-gray-700 text-center col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">XP Awarded</span>
                      <div className="text-2xl font-black text-amber-300 font-mono flex items-center justify-center gap-1">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span>
                          +
                          {Object.entries(userAnswers).filter(
                            ([qIdx, ans]) => mockQuestions[Number(qIdx)]?.correctAnswer === ans
                          ).length * 20}{' '}
                          XP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BHSEC EXAM BREAKTHROUGH & TRACING */}
      {activeTab === 'bcsea' && <BcseaExamMastery onRewardXp={onRewardXp} />}

      {/* TAB 3: REVISION FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-black uppercase text-[#6D071A]">Category:</span>
              {['All', 'Python', 'Excel', 'Cloud', 'Cyber', 'Workspace'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCardCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-[#1A1A1A] cursor-pointer transition-all ${
                    cardCategory === cat
                      ? 'bg-[#6D071A] text-[#FFCC33]'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setDzongkhaMode(!dzongkhaMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 border-[#1A1A1A] flex items-center gap-1.5 cursor-pointer ${
                dzongkhaMode ? 'bg-[#FFCC33] text-[#1A1A1A]' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Dzongkha Terms: {dzongkhaMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Flashcard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => {
              const isFlipped = !!flippedCards[card.id];

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardFlip(card.id)}
                  className="h-72 cursor-pointer perspective"
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="w-full h-full relative preserve-3d"
                  >
                    {/* FRONT SIDE */}
                    <div className="absolute inset-0 bg-white border-4 border-[#1A1A1A] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#1A1A1A] backface-hidden flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-[#FFCC33] text-[#1A1A1A] border border-[#1A1A1A] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                            {card.category}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(card.front);
                            }}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 border border-[#1A1A1A] rounded-lg text-[#6D071A]"
                            title="Listen Read Aloud"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-base font-black text-[#1A1A1A] font-serif mb-2">
                          {card.title}
                        </h4>
                        <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                          {card.front}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-black text-[#6D071A]">
                        <span>Click card to reveal answer 🔄</span>
                        {card.dzongkhaTerm && dzongkhaMode && (
                          <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                            {card.dzongkhaTerm}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* BACK SIDE */}
                    <div className="absolute inset-0 bg-[#1A1A1A] text-white border-4 border-[#FFCC33] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#6D071A] backface-hidden rotate-y-180 flex flex-col justify-between overflow-y-auto scrollbar-thin">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#FFCC33] text-[10px] font-black uppercase tracking-wider">
                            Answer Key
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(card.back);
                            }}
                            className="p-1.5 bg-[#2A2A2A] hover:bg-[#333] border border-amber-400 rounded-lg text-amber-300"
                            title="Listen Read Aloud"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs text-amber-100 font-medium leading-relaxed whitespace-pre-line mb-3">
                          {card.back}
                        </p>

                        {card.codeSnippet && (
                          <pre className="bg-[#000] border border-gray-700 p-2.5 rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto">
                            {card.codeSnippet}
                          </pre>
                        )}
                      </div>

                      <div className="text-center text-[10px] font-bold text-[#FFCC33] uppercase tracking-widest pt-2">
                        Click again to flip back
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
