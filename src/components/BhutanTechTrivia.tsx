import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Sparkles, CheckCircle2, XCircle, RotateCcw, ChevronRight, 
  BookOpen, Volume2, Globe, Flag, Cpu, ShieldCheck, Milestone,
  History, Award, ArrowRight, Lightbulb, Zap
} from 'lucide-react';
import { soundFx } from '../lib/audio';
import { speakText, stopSpeech } from '../lib/speech';
import { CodeFormattedText } from './CodeFormattedText';
import { randomizeQuestions } from '../lib/questionRandomizer';
import { getStudentTriviaQuestions, useContentRefresh } from '../lib/contentManager';
import { TriviaQuestion, DIGITAL_MILESTONES } from '../data/triviaData';

export type { TriviaQuestion };

interface BhutanTechTriviaProps {
  onAddXp?: (amount: number) => void;
}

export const BhutanTechTrivia: React.FC<BhutanTechTriviaProps> = ({ onAddXp }) => {
  const contentVersion = useContentRefresh();
  const [activeSubTab, setActiveSubTab] = useState<'quiz' | 'timeline' | 'facts'>('quiz');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Quiz State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: number | string; selected: number; isCorrect: boolean }[]>([]);

  const allTriviaQuestions = getStudentTriviaQuestions();

  // Filter questions by category and randomize options
  const filteredQuestions = React.useMemo(() => {
    const raw = selectedCategory === 'All' 
      ? allTriviaQuestions 
      : allTriviaQuestions.filter(q => q.category === selectedCategory);
    return randomizeQuestions(raw);
  }, [selectedCategory, contentVersion, allTriviaQuestions]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleOptionClick = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;
    setUserAnswers(prev => [...prev, { questionId: currentQ.id, selected: selectedOption, isCorrect }]);

    if (isCorrect) {
      soundFx.playSuccess();
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      if (onAddXp) onAddXp(20);
    } else {
      soundFx.playRetry();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      stopSpeech();
    } else {
      setQuizFinished(true);
      soundFx.playLevelUp();
      if (onAddXp && score > 0) {
        onAddXp(score * 15);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setQuizFinished(false);
    setUserAnswers([]);
    stopSpeech();
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    handleRestartQuiz();
  };

  // Quick Random Fact
  const [factIndex, setFactIndex] = useState<number>(0);
  const getRandomFact = () => {
    const nextIdx = (factIndex + 1) % DIGITAL_MILESTONES.length;
    setFactIndex(nextIdx);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#6D071A] via-amber-900 to-[#1A1A1A] text-white p-6 sm:p-8 rounded-3xl border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-15 text-8xl pointer-events-none select-none">
          🇧🇹
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#FFCC33] text-[#1A1A1A] font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-[#1A1A1A]">
            <Flag className="w-3.5 h-3.5" /> Bhutanese ICT Heritage & Milestones
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-[#FFCC33] flex items-center gap-2">
            <span>Bhutan Tech History & Trivia</span>
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Test your knowledge on Bhutan's digital transformation—from the 1999 Internet launch and Dzongkha Unicode standard to Bhutan NDI blockchain identity and modern AI education!
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeSubTab === 'quiz'
                ? 'bg-[#FFCC33] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 text-[#6D071A]" />
            <span>Interactive Quiz</span>
          </button>

          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeSubTab === 'timeline'
                ? 'bg-[#FFCC33] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4 text-emerald-600" />
            <span>Milestone Timeline</span>
          </button>

          <button
            onClick={() => setActiveSubTab('facts')}
            className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeSubTab === 'facts'
                ? 'bg-[#FFCC33] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Did You Know?</span>
          </button>
        </div>

        {activeSubTab === 'quiz' && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-slate-700">
            <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
              Streak: <span className="font-black text-emerald-600 dark:text-emerald-400">{streak} 🔥</span>
            </span>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: INTERACTIVE QUIZ */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'Pioneer Era', 'National Projects', 'Digital Identity & Future', 'Dzongkha Tech'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer transition-all border ${
                  selectedCategory === cat
                    ? 'bg-[#6D071A] text-white border-[#1A1A1A] shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                {cat === 'All' ? '🌟 All Topics' : cat}
              </button>
            ))}
          </div>

          {!quizFinished ? (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] space-y-6">
              {/* Question Top Progress Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-amber-300 dark:border-amber-800">
                    {currentQ.category} {currentQ.yearMilestone ? `• ${currentQ.yearMilestone}` : ''}
                  </span>
                  <h2 className="text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400">
                    Question {currentIndex + 1} of {filteredQuestions.length}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">Current Score</span>
                  <div className="text-lg font-black text-[#6D071A] dark:text-[#FFCC33] flex items-center gap-1 justify-end">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>{score} pts</span>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-lg sm:text-xl font-serif font-black text-slate-900 dark:text-white leading-relaxed">
                    <CodeFormattedText text={currentQ.question} />
                  </div>
                  <button
                    onClick={() => speakText(currentQ.question)}
                    className="p-2 text-slate-400 hover:text-amber-500 transition-colors shrink-0 cursor-pointer"
                    title="Read question aloud"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-amber-50 hover:border-amber-300';
                  
                  if (selectedOption === idx) {
                    btnStyle = 'bg-amber-100 dark:bg-amber-950/80 border-[#FFCC33] text-amber-950 dark:text-amber-100 font-bold';
                  }

                  if (isAnswerSubmitted) {
                    const isUserCorrect = selectedOption === currentQ.correctAnswer;
                    if (idx === currentQ.correctAnswer && isUserCorrect) {
                      btnStyle = 'bg-emerald-100 dark:bg-emerald-950/90 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-extrabold';
                    } else if (selectedOption === idx && !isUserCorrect) {
                      btnStyle = 'bg-red-100 dark:bg-red-950/90 border-red-500 text-red-950 dark:text-red-100 font-extrabold';
                    } else {
                      btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 border-transparent';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      disabled={isAnswerSubmitted}
                      className={`p-4 rounded-2xl border-2 text-left text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-[#1A1A1A] text-white font-black text-xs flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>
                      {isAnswerSubmitted && idx === currentQ.correctAnswer && selectedOption === currentQ.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && selectedOption !== currentQ.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box after answer */}
              {isAnswerSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-[#FFCC33] space-y-2 text-xs text-slate-800 dark:text-amber-100"
                >
                  <div className="flex items-center gap-2 font-extrabold text-[#6D071A] dark:text-[#FFCC33] text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Explanation & Cultural Insight:</span>
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                  {currentQ.culturalContext && (
                    <p className="italic text-slate-600 dark:text-amber-200/80 pt-1 border-t border-amber-200/50 dark:border-amber-800/50">
                      💡 <strong>GNH & Heritage Context:</strong> {currentQ.culturalContext}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={selectedOption === null}
                    className={`px-6 py-3 rounded-2xl font-black text-sm border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer transition-all ${
                      selectedOption !== null
                        ? 'bg-[#FFCC33] text-[#1A1A1A] hover:bg-amber-400'
                        : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                    }`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 rounded-2xl font-black text-sm bg-[#6D071A] text-white hover:bg-red-900 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>{currentIndex < filteredQuestions.length - 1 ? 'Next Question' : 'View Results'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Results Summary Card */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-3 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] text-center space-y-6 max-w-xl mx-auto"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FFCC33] border-3 border-[#1A1A1A] flex items-center justify-center text-4xl shadow-[3px_3px_0px_0px_#1A1A1A]">
                🏆
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
                  Bhutan Tech Trivia Complete!
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  You scored <span className="font-black text-[#6D071A] dark:text-[#FFCC33]">{score}</span> out of{' '}
                  <span className="font-black">{filteredQuestions.length}</span>!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-[#1A1A1A]">
                  <span className="text-xs text-slate-500 font-bold block">XP Earned</span>
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">+{score * 35} XP</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800 border-2 border-[#1A1A1A]">
                  <span className="text-xs text-slate-500 font-bold block">Accuracy</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {Math.round((score / filteredQuestions.length) * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="px-6 py-3 rounded-2xl font-black text-xs bg-[#FFCC33] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-2 cursor-pointer hover:bg-amber-400"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => setActiveSubTab('timeline')}
                  className="px-6 py-3 rounded-2xl font-black text-xs bg-[#6D071A] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-2 cursor-pointer hover:bg-red-900"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Study Milestone Timeline</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: MILESTONE TIMELINE */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]">
            <h2 className="text-xl font-serif font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Milestone className="w-5 h-5 text-[#6D071A] dark:text-[#FFCC33]" />
              <span>Chronological Timeline of Bhutan's Digital Journey</span>
            </h2>

            <div className="relative border-l-3 border-[#1A1A1A] dark:border-slate-700 ml-4 pl-6 sm:pl-8 space-y-8">
              {DIGITAL_MILESTONES.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-[#FFCC33] border-2 border-[#1A1A1A] flex items-center justify-center text-sm shadow-xs font-black">
                    {item.icon}
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border-2 border-[#1A1A1A] space-y-2 hover:border-[#6D071A] transition-all shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#6D071A] text-white font-black text-xs border border-[#1A1A1A]">
                        {item.year}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Milestone #{idx + 1}</span>
                    </div>

                    <h3 className="text-base font-serif font-black text-slate-900 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-amber-900 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{item.significance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DID YOU KNOW? FACTS */}
      {activeSubTab === 'facts' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950 border-2 border-[#1A1A1A] flex items-center justify-center text-3xl">
            💡
          </div>

          <div className="space-y-3">
            <span className="bg-[#FFCC33] text-[#1A1A1A] font-black text-xs px-3 py-1 rounded-full uppercase border border-[#1A1A1A]">
              Bhutan Tech Fact #{factIndex + 1}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 dark:text-white">
              {DIGITAL_MILESTONES[factIndex].title} ({DIGITAL_MILESTONES[factIndex].year})
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed max-w-lg mx-auto">
              {DIGITAL_MILESTONES[factIndex].description}
            </p>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 text-xs text-amber-950 dark:text-amber-200 font-medium max-w-lg mx-auto border border-amber-200 dark:border-slate-700">
              🇧🇹 <strong>National Impact:</strong> {DIGITAL_MILESTONES[factIndex].significance}
            </div>
          </div>

          <button
            onClick={getRandomFact}
            className="px-6 py-3 rounded-2xl font-black text-xs bg-[#FFCC33] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-amber-400 cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#6D071A]" />
            <span>Next Random Fact</span>
          </button>
        </div>
      )}
    </div>
  );
};
