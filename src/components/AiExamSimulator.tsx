import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  Clock,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Zap,
  BarChart2,
  Cpu,
  Layers,
  Check
} from 'lucide-react';
import { soundFx } from '../lib/audio';
import { getApiBaseUrl } from '../lib/api';
import { QuestCardSkeleton } from './Skeleton';
import { getCachedQuestContent, cacheQuestContent } from '../lib/idbCache';
import { CodeFormattedText } from './CodeFormattedText';
import { randomizeQuestions } from '../lib/questionRandomizer';

export interface SimulatedQuestion {
  id: string;
  section: string;
  topic: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

// Pre-seeded 20 BHSEC standard questions as offline fallback
const FALLBACK_20_QUESTIONS: SimulatedQuestion[] = [
  // Section A: Objective MCQs (1-8)
  {
    id: 'f1',
    section: 'Section A',
    topic: 'Python Programming',
    question: 'What is the output of print(type("Bhutan")) in Python?',
    options: ["<class 'str'>", "<class 'int'>", "<class 'list'>", "String"],
    correctOptionIndex: 0,
    explanation: 'In Python, literal text wrapped in quotes represents a string of type `<class \'str\'>`.'
  },
  {
    id: 'f2',
    section: 'Section A',
    topic: 'Python Programming',
    question: 'Which of the following is a valid variable name in Python?',
    options: ['2_dzong', 'student_name', 'class-10', 'if'],
    correctOptionIndex: 1,
    explanation: 'Python variable names cannot start with numbers, cannot contain hyphens, and cannot use reserved keywords like `if`. `student_name` uses valid underscore syntax.'
  },
  {
    id: 'f3',
    section: 'Section A',
    topic: 'MS Excel',
    question: 'Which Excel function counts cells containing numerical values in a range A1:A20?',
    options: ['=COUNT(A1:A20)', '=COUNTA(A1:A20)', '=COUNTIF(A1:A20)', '=SUM(A1:A20)'],
    correctOptionIndex: 0,
    explanation: '`=COUNT(A1:A20)` counts only cells containing numbers. `=COUNTA` counts non-empty cells.'
  },
  {
    id: 'f4',
    section: 'Section A',
    topic: 'Cloud Services',
    question: 'Which Cloud Service model delivers infrastructure such as virtual servers and storage over the internet?',
    options: ['SaaS (Software as a Service)', 'PaaS (Platform as a Service)', 'IaaS (Infrastructure as a Service)', 'DaaS (Data as a Service)'],
    correctOptionIndex: 2,
    explanation: 'IaaS provides raw virtual hardware, storage, and network infrastructure.'
  },
  {
    id: 'f5',
    section: 'Section A',
    topic: 'Google Workspace',
    question: 'Which permission in Google Drive allows a user to comment on a file without changing content?',
    options: ['Editor', 'Viewer', 'Commenter', 'Owner'],
    correctOptionIndex: 2,
    explanation: 'The "Commenter" access role allows students to add suggestions and comments while keeping original content locked.'
  },
  {
    id: 'f6',
    section: 'Section A',
    topic: 'Cyber Ethics & Copyright',
    question: 'What citation format is most commonly used in technical and ICT academic works?',
    options: ['APA 7th Edition', 'MLA 9th Edition', 'IEEE Reference Style', 'Chicago Manual'],
    correctOptionIndex: 2,
    explanation: 'IEEE citation style is the standard numerical reference format used in computer science and ICT technical papers.'
  },
  {
    id: 'f7',
    section: 'Section A',
    topic: 'Python Programming',
    question: 'What value does range(3) generate in a Python loop?',
    options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '1, 2'],
    correctOptionIndex: 1,
    explanation: '`range(3)` generates numbers starting at 0 up to stop-1 (3-1 = 2): 0, 1, 2.'
  },
  {
    id: 'f8',
    section: 'Section A',
    topic: 'MS Excel',
    question: 'What symbol is placed before column and row references to make them absolute (e.g., $B$5)?',
    options: ['#', '%', '$', '&'],
    correctOptionIndex: 2,
    explanation: 'The `$` dollar sign locks cell references when formulas are dragged or copied in Excel.'
  },

  // Section B: Conceptual & Application (9-14)
  {
    id: 'f9',
    section: 'Section B',
    topic: 'Python Programming',
    question: 'What is the value of x after executing x = 15 % 4 in Python?',
    options: ['3', '3.75', '1', '0'],
    correctOptionIndex: 0,
    explanation: 'The modulo operator `%` calculates the remainder of division. 15 divided by 4 is 3 with a remainder of 3.'
  },
  {
    id: 'f10',
    section: 'Section B',
    topic: 'MS Excel',
    question: 'In cell C2, formula `=IF(B2>=50, "Pass", "Fail")` is entered. If B2 contains 50, what is displayed?',
    options: ['Fail', 'Pass', 'TRUE', '#VALUE!'],
    correctOptionIndex: 1,
    explanation: 'Since 50 is greater than or equal to 50 (`>=`), the IF condition evaluates to True, returning "Pass".'
  },
  {
    id: 'f11',
    section: 'Section B',
    topic: 'Cloud Services',
    question: 'Google Docs and Gmail belong to which cloud deployment delivery model?',
    options: ['SaaS (Software as a Service)', 'PaaS (Platform as a Service)', 'IaaS (Infrastructure as a Service)', 'Private On-Premise'],
    correctOptionIndex: 0,
    explanation: 'Google Docs and Gmail are ready-to-use software applications hosted on the cloud, which falls under SaaS.'
  },
  {
    id: 'f12',
    section: 'Section B',
    topic: 'Cyber Ethics & Copyright',
    question: 'What is the main purpose of Creative Commons (CC) licenses?',
    options: [
      'To completely abolish author copyright ownership',
      'To allow creators to share works publicly under standardized reuse conditions',
      'To charge fees for all digital downloads',
      'To prevent any school or student from using online photos'
    ],
    correctOptionIndex: 1,
    explanation: 'Creative Commons provides flexible public licenses allowing authors to grant specific usage rights while maintaining attribution.'
  },
  {
    id: 'f13',
    section: 'Section B',
    topic: 'Python Programming',
    question: 'Which statement immediately exits a loop regardless of the loop condition?',
    options: ['continue', 'pass', 'break', 'return'],
    correctOptionIndex: 2,
    explanation: 'The `break` statement terminates the nearest enclosing `for` or `while` loop prematurely.'
  },
  {
    id: 'f14',
    section: 'Section B',
    topic: 'Google Workspace',
    question: 'In Google Workspace, what feature records every revision made to a document over time?',
    options: ['Version History', 'Undo Manager', 'Cloud Backup', 'Auto-Format'],
    correctOptionIndex: 0,
    explanation: 'Version History logs all user additions, deletions, and timestamps, allowing documents to be restored to earlier states.'
  },

  // Section C: Python Tracing & Output Prediction (15-20)
  {
    id: 'f15',
    section: 'Section C',
    topic: 'Python Programming',
    question: 'Trace the output:\ns = 0\nfor i in range(1, 4):\n    s = s + i\nprint(s)',
    options: ['6', '10', '4', '3'],
    correctOptionIndex: 0,
    explanation: '`range(1, 4)` iterates i = 1, 2, 3. Accumulator s becomes: 0+1=1 -> 1+2=3 -> 3+3=6. Final print is 6.'
  },
  {
    id: 'f16',
    section: 'Section C',
    topic: 'Python Programming',
    question: 'Predict the output:\ntext = "BHUTAN"\nprint(text[1:4])',
    options: ['HUT', 'BHU', 'HUTA', 'BHUT'],
    correctOptionIndex: 0,
    explanation: 'Index slicing `[1:4]` takes characters from index 1 up to index 3 (excluding 4). Character at index 1 is "H", 2 is "U", 3 is "T" -> "HUT".'
  },
  {
    id: 'f17',
    section: 'Section C',
    topic: 'Python Programming',
    question: 'What will be printed?\nnumbers = [10, 20, 30]\nnumbers.append(40)\nprint(numbers[2])',
    options: ['30', '40', '20', '10'],
    correctOptionIndex: 0,
    explanation: '`append(40)` adds 40 to the end, making list `[10, 20, 30, 40]`. `numbers[2]` accesses index 2, which remains 30.'
  },
  {
    id: 'f18',
    section: 'Section C',
    topic: 'Python Programming',
    question: 'Trace this while loop:\nx = 4\nwhile x > 1:\n    x = x - 2\nprint(x)',
    options: ['0', '1', '2', '-1'],
    correctOptionIndex: 0,
    explanation: 'Iteration 1: x = 4 -> x becomes 2. Iteration 2: 2 > 1 is True -> x becomes 0. Iteration 3: 0 > 1 is False -> loop terminates. Output is 0.'
  },
  {
    id: 'f19',
    section: 'Section C',
    topic: 'Python Programming',
    question: 'Predict the return value of recursion function:\ndef solve(n):\n    if n == 1:\n        return 1\n    return n + solve(n-1)\nprint(solve(3))',
    options: ['6', '3', '5', '1'],
    correctOptionIndex: 0,
    explanation: '`solve(3)` returns 3 + `solve(2)`. `solve(2)` returns 2 + `solve(1)`. Base case `solve(1)` returns 1. Result: 3 + 2 + 1 = 6.'
  },
  {
    id: 'f20',
    section: 'Section C',
    topic: 'Python Programming',
    question: 'What is the output of print("10" + "20") in Python?',
    options: ['1020', '30', 'TypeError', '10 20'],
    correctOptionIndex: 0,
    explanation: 'When `+` is applied to two string literals `"10"` and `"20"`, it performs string concatenation, yielding `"1020"`.'
  }
];

interface AiExamSimulatorProps {
  onRewardXp?: (amount: number, levelId: string) => void;
}

export const AiExamSimulator: React.FC<AiExamSimulatorProps> = ({ onRewardXp }) => {
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(false);
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<SimulatedQuestion[]>(() => randomizeQuestions(FALLBACK_20_QUESTIONS));
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [examFinished, setExamFinished] = useState<boolean>(false);

  const handleGenerateExam = async () => {
    setLoading(true);
    const cacheKey = `exam_questions_${topicFilter}`;
    try {
      // Check IndexedDB cache first for instant offline/cached performance
      const cachedQuestions = await getCachedQuestContent(cacheKey);
      if (cachedQuestions && Array.isArray(cachedQuestions) && cachedQuestions.length > 0) {
        setQuestions(randomizeQuestions(cachedQuestions));
        setLoading(false);
        setExamStarted(true);
        setCurrentIdx(0);
        setSelectedAnswers({});
        setRevealed({});
        setExamFinished(false);
        soundFx.playSuccess();
        return;
      }

      const apiUrl = getApiBaseUrl();
      const res = await fetch(`${apiUrl}/api/exam-simulator/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicFilter })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          const randomized = randomizeQuestions(data.questions);
          setQuestions(randomized);
          await cacheQuestContent(cacheKey, randomized);
        } else {
          setQuestions(randomizeQuestions(FALLBACK_20_QUESTIONS));
        }
      } else {
        setQuestions(randomizeQuestions(FALLBACK_20_QUESTIONS));
      }
    } catch (err) {
      console.error('Failed to generate AI exam, falling back to pre-seeded exam', err);
      setQuestions(randomizeQuestions(FALLBACK_20_QUESTIONS));
    } finally {
      setLoading(false);
      setExamStarted(true);
      setCurrentIdx(0);
      setSelectedAnswers({});
      setRevealed({});
      setExamFinished(false);
      soundFx.playSuccess();
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (revealed[currentIdx]) return; // Already answered

    const currentQ = questions[currentIdx];
    const isCorrect = optionIndex === currentQ.correctOptionIndex;

    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optionIndex }));
    setRevealed((prev) => ({ ...prev, [currentIdx]: true }));

    if (isCorrect) {
      soundFx.playSuccess();
      if (onRewardXp) {
        const qId = currentQ.id ? currentQ.id : `q-${currentQ.question.replace(/\s+/g, '-').slice(0, 30)}`;
        onRewardXp(10, `ai-exam-${qId}`);
      }
    }
  };

  const currentQ = questions[currentIdx];
  const isAnswered = revealed[currentIdx];
  const selectedOpt = selectedAnswers[currentIdx];

  // Score Calculation
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(revealed).length;
  const correctCount = Object.keys(selectedAnswers).filter(
    (idx) => selectedAnswers[Number(idx)] === questions[Number(idx)].correctOptionIndex
  ).length;

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  const getBhsecGrade = (pct: number) => {
    if (pct >= 90) return { label: 'Distinction (Outstanding)', color: 'text-[#FFCC33]', badge: '🏆' };
    if (pct >= 75) return { label: 'Merit (High Competency)', color: 'text-emerald-400', badge: '🌟' };
    if (pct >= 50) return { label: 'Pass (Satisfactory)', color: 'text-amber-300', badge: '✅' };
    return { label: 'Needs Revision (Practice Required)', color: 'text-rose-400', badge: '📘' };
  };

  const gradeInfo = getBhsecGrade(scorePercentage);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1A1A1A] text-white p-6 rounded-3xl border-4 border-[#FFCC33] shadow-[8px_8px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[#FFCC33] text-xs font-black uppercase tracking-widest bg-[#6D071A] px-3 py-1 rounded-full border border-[#FFCC33] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCC33]" /> BHSEC AI Board Exam Simulator
          </div>
          <h2 className="text-2xl font-black font-serif text-amber-100">
            ⚡ Gemini AI 20-Question Exam Generator
          </h2>
          <p className="text-xs text-amber-200/90 mt-1 max-w-xl leading-relaxed">
            Generate unlimited, randomized 20-question Class 10 BHSEC ICT Board Exams with instant step-by-step marking rationale!
          </p>
        </div>

        {!examStarted && (
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="bg-[#2A2A2A] text-amber-100 border-2 border-[#FFCC33] px-3 py-2 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="All">🎯 All Syllabus Topics</option>
              <option value="Python Programming">🐍 Python Programming</option>
              <option value="MS Excel">📊 MS Excel Formulas</option>
              <option value="Cloud Services">☁️ Cloud Services</option>
              <option value="Cyber Ethics & Copyright">⚖️ Citations & Copyright</option>
            </select>

            <button
              onClick={handleGenerateExam}
              disabled={loading}
              className="py-3 px-5 bg-[#FFCC33] hover:bg-[#ffe066] text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] cursor-pointer transition-all active:translate-y-0.5 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#1A1A1A]" />
                  <span>Generating AI Exam...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-[#1A1A1A]" />
                  <span>Start 20-Question Exam</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="space-y-6">
          <div className="bg-[#FFCC33]/20 border-3 border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 shadow-[4px_4px_0px_0px_#1A1A1A]">
            <RefreshCw className="w-5 h-5 animate-spin text-[#6D071A] shrink-0" />
            <div>
              <h4 className="text-sm font-black text-[#1A1A1A]">Consulting BHSEC Examination Board & Gemini AI...</h4>
              <p className="text-[11px] font-semibold text-gray-700">Structuring 20 randomized Class 10 ICT questions (Objective, Conceptual, Python Tracing)...</p>
            </div>
          </div>
          <QuestCardSkeleton />
          <QuestCardSkeleton />
        </div>
      )}

      {/* ACTIVE EXAM INTERACTIVE VIEW */}
      {examStarted && !loading && !examFinished && (
        <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_0px_#1A1A1A] space-y-6">
          {/* Exam Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#6D071A] text-amber-200 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border border-[#FFCC33]">
                {currentQ.section}
              </span>
              <span className="bg-amber-100 text-[#1A1A1A] px-3 py-1 rounded-xl text-xs font-extrabold border border-amber-300">
                {currentQ.topic}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-[#1A1A1A]">
                Question {currentIdx + 1} of {totalQuestions}
              </span>

              <button
                onClick={() => setExamFinished(true)}
                className="px-3 py-1.5 bg-rose-100 text-rose-800 hover:bg-rose-200 font-extrabold text-xs rounded-xl border border-rose-300 cursor-pointer"
              >
                End Exam & See Score
              </button>
            </div>
          </div>

          {/* Question Matrix Jump Drawer */}
          <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-2xl border border-gray-200">
            {questions.map((q, idx) => {
              const answered = revealed[idx];
              const isCurr = idx === currentIdx;
              const wasCorrect = selectedAnswers[idx] === q.correctOptionIndex;

              let btnStyle = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
              if (answered) {
                btnStyle = wasCorrect ? 'bg-emerald-500 text-white font-black' : 'bg-rose-500 text-white font-black';
              }
              if (isCurr) {
                btnStyle += ' ring-2 ring-[#6D071A] ring-offset-2 scale-105';
              }

              return (
                <button
                  key={q.id || idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all cursor-pointer ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          <div className="space-y-4">
            <div className="text-lg font-black text-[#1A1A1A] leading-snug">
              <CodeFormattedText text={currentQ.question} />
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                let optStyle = 'bg-gray-50 hover:bg-amber-50 border-gray-300 text-[#1A1A1A]';

                if (isAnswered) {
                  if (oIdx === currentQ.correctOptionIndex) {
                    optStyle = 'bg-emerald-100 border-emerald-600 text-emerald-950 font-black shadow-[2px_2px_0px_0px_#059669]';
                  } else if (selectedOpt === oIdx) {
                    optStyle = 'bg-rose-100 border-rose-600 text-rose-950 font-black';
                  } else {
                    optStyle = 'bg-gray-100 text-gray-400 border-gray-200 opacity-60';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    disabled={isAnswered}
                    className={`p-4 rounded-2xl border-2 text-xs font-bold text-left transition-all cursor-pointer flex items-start gap-3 ${optStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-amber-200 flex items-center justify-center text-[10px] font-mono shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="mt-0.5 leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Step-by-Step Marking Explanation Box */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border-2 border-[#1A1A1A] p-4 rounded-2xl space-y-2 mt-4"
              >
                <div className="text-xs font-black text-[#6D071A] flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> BHSEC Official Marking Key & Explanation:
                </div>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  {currentQ.explanation}
                </p>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-[#1A1A1A] font-extrabold text-xs rounded-xl border border-gray-300 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentIdx < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  className="px-5 py-2.5 bg-[#6D071A] hover:bg-[#80091F] text-amber-200 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FFCC33] cursor-pointer transition-all active:translate-y-0.5 flex items-center gap-1"
                >
                  Next Question <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setExamFinished(true)}
                  className="px-5 py-2.5 bg-[#FFCC33] hover:bg-[#ffe066] text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer transition-all active:translate-y-0.5 flex items-center gap-1"
                >
                  View Final Results 🏆
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FINAL EXAM RESULTS CARD */}
      {examFinished && (
        <div className="bg-[#1A1A1A] text-white rounded-3xl border-4 border-[#FFCC33] p-8 shadow-[10px_10px_0px_0px_#1A1A1A] space-y-6 animate-fadeIn">
          <div className="text-center space-y-3">
            <div className="text-5xl">{gradeInfo.badge}</div>
            <h3 className="text-3xl font-black font-serif text-amber-100">
              BHSEC Board Exam Result
            </h3>
            <p className={`text-lg font-black uppercase tracking-wide ${gradeInfo.color}`}>
              {gradeInfo.label}
            </p>
          </div>

          {/* Score Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="bg-[#2A2A2A] p-4 rounded-2xl border-2 border-amber-500/30 text-center space-y-1">
              <span className="text-[10px] text-gray-400 font-black uppercase">Total Score</span>
              <div className="text-2xl font-black text-amber-200">
                {correctCount} / {totalQuestions}
              </div>
            </div>

            <div className="bg-[#2A2A2A] p-4 rounded-2xl border-2 border-amber-500/30 text-center space-y-1">
              <span className="text-[10px] text-gray-400 font-black uppercase">Percentage</span>
              <div className="text-2xl font-black text-amber-200">{scorePercentage}%</div>
            </div>

            <div className="bg-[#2A2A2A] p-4 rounded-2xl border-2 border-amber-500/30 text-center space-y-1">
              <span className="text-[10px] text-gray-400 font-black uppercase">XP Earned</span>
              <div className="text-2xl font-black text-[#FFCC33]">+{correctCount * 10} XP</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-gray-800">
            <button
              onClick={() => {
                setExamFinished(false);
                setCurrentIdx(0);
              }}
              className="py-3 px-6 bg-gray-800 hover:bg-gray-700 text-amber-200 font-extrabold text-xs rounded-2xl border border-gray-600 cursor-pointer"
            >
              Review Question Answers
            </button>

            <button
              onClick={handleGenerateExam}
              className="py-3 px-6 bg-[#FFCC33] hover:bg-[#ffe066] text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] cursor-pointer transition-all active:translate-y-0.5 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-[#1A1A1A]" />
              Generate New 20-Question AI Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
