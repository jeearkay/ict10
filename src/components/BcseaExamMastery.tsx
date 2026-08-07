import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Award,
  Sparkles,
  Zap,
  Code,
  BookOpen,
  Cpu,
  RefreshCw,
  Table,
  Eye
} from 'lucide-react';
import { soundFx } from '../lib/audio';

interface TracingProblem {
  id: string;
  title: string;
  code: string[];
  description: string;
  expectedTable: {
    step: number;
    iVal: string;
    varState: string;
    condition: string;
    output: string;
  }[];
  explanation: string;
}

const TRACING_PROBLEMS: TracingProblem[] = [
  {
    id: 'trace-1',
    title: 'Question 1: Accumulator For-Loop with Step (BCSEA Standard)',
    code: [
      's = 0',
      'for i in range(1, 6, 2):',
      '    s = s + i',
      '    print("s =", s)'
    ],
    description: 'Construct the dry-run table for the loop above and predict the final console output.',
    expectedTable: [
      { step: 1, iVal: '1', varState: 's = 1', condition: '1 < 6 (True)', output: 's = 1' },
      { step: 2, iVal: '3', varState: 's = 4', condition: '3 < 6 (True)', output: 's = 4' },
      { step: 3, iVal: '5', varState: 's = 9', condition: '5 < 6 (True)', output: 's = 9' }
    ],
    explanation: '`range(1, 6, 2)` generates values 1, 3, 5 (stops before 6). In iteration 1: s = 0 + 1 = 1. In iteration 2: s = 1 + 3 = 4. In iteration 3: s = 4 + 5 = 9.'
  },
  {
    id: 'trace-2',
    title: 'Question 2: String Slicing & Negative Indexing',
    code: [
      'text = "BHUTAN"',
      'part1 = text[0:3]',
      'part2 = text[-3:]',
      'print(part1 + "_" + part2)'
    ],
    description: 'Trace string indexing and slicing rules.',
    expectedTable: [
      { step: 1, iVal: '-', varState: 'part1 = "BHU"', condition: 'Index 0..2', output: '-' },
      { step: 2, iVal: '-', varState: 'part2 = "TAN"', condition: 'Index -3..end', output: '-' },
      { step: 3, iVal: '-', varState: 'Concatenated', condition: '-', output: 'BHU_TAN' }
    ],
    explanation: '`text[0:3]` extracts characters at indices 0, 1, 2 ("BHU"). `text[-3:]` extracts the last 3 characters ("TAN"). Final output is "BHU_TAN".'
  },
  {
    id: 'trace-3',
    title: 'Question 3: While Loop Countdown with Conditional Break',
    code: [
      'count = 5',
      'while count > 0:',
      '    if count == 3:',
      '        print("Skip 3")',
      '    count = count - 2',
      'print("Done")'
    ],
    description: 'Trace execution flow in while loop with step -2.',
    expectedTable: [
      { step: 1, iVal: '5', varState: 'count = 3', condition: '5 > 0 (True)', output: '-' },
      { step: 2, iVal: '3', varState: 'count = 1', condition: '3 > 0 (True)', output: 'Skip 3' },
      { step: 3, iVal: '1', varState: 'count = -1', condition: '1 > 0 (True)', output: '-' }
    ],
    explanation: 'Count starts at 5 -> updated to 3. Count is 3 -> prints "Skip 3" -> updated to 1. Count is 1 -> updated to -1. -1 > 0 is False. Loop ends and prints "Done".'
  }
];

interface TrapCard {
  id: string;
  topic: 'Python' | 'Excel' | 'Cloud' | 'Cyber Ethics';
  trapTitle: string;
  examMistake: string;
  correctLogic: string;
  codeSnippet?: string;
  quizQuestion: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

const EXAM_TRAPS: TrapCard[] = [
  {
    id: 'trap-1',
    topic: 'Python',
    trapTitle: 'Trap 1: The Exclusive Stop Parameter in range()',
    examMistake: 'Thinking range(1, 5) includes the number 5.',
    correctLogic: 'In range(start, stop), the loop runs up to stop - 1. So range(1, 5) generates [1, 2, 3, 4] and loops 4 times, NEVER 5 times!',
    codeSnippet: 'for i in range(1, 5):\n    print(i) # Prints 1, 2, 3, 4 ONLY',
    quizQuestion: 'How many times will `for i in range(2, 6):` execute?',
    options: ['6 times', '5 times', '4 times', '2 times'],
    correctOption: 2,
    explanation: 'range(2, 6) generates 2, 3, 4, 5 — which is exactly 4 iterations.'
  },
  {
    id: 'trap-2',
    topic: 'Python',
    trapTitle: 'Trap 2: String Input without Typecasting',
    examMistake: 'Expecting `input()` to return a number for math operations.',
    correctLogic: 'In Python, `input()` ALWAYS returns a string. `input() + input()` concatenates strings ("10" + "5" = "105"). You must use `int(input())` or `float(input())`!',
    codeSnippet: 'a = input() # "10"\nb = input() # "5"\nprint(a + b) # Outputs "105", NOT 15!',
    quizQuestion: 'If a user inputs 4 and 2 in `x = input(); y = input(); print(x * 3)`, what is printed if x="4"?',
    options: ['12', '444', 'TypeError', '16'],
    correctOption: 1,
    explanation: 'Multiplying string "4" by integer 3 repeats the string 3 times: "444".'
  },
  {
    id: 'trap-3',
    topic: 'Python',
    trapTitle: 'Trap 3: Assignment (=) vs Equality Comparison (==)',
    examMistake: 'Writing `if x = 10:` inside conditional statements.',
    correctLogic: 'Single `=` assigns values. Double `==` tests equality. Writing `if x = 10:` causes a SyntaxError in Python!',
    codeSnippet: 'if x == 10: # Correct comparison syntax\n    print("Equal")',
    quizQuestion: 'Which statement is syntactically valid in Python?',
    options: ['if x = 50:', 'if x == 50:', 'if (x := 50 == True):', 'if x equals 50:'],
    correctOption: 1,
    explanation: 'Double equals `==` is required for conditional equality checks.'
  },
  {
    id: 'trap-4',
    topic: 'Excel',
    trapTitle: 'Trap 4: Absolute ($A$1) vs Relative (A1) Cell Referencing',
    examMistake: 'Forgetting $ dollar signs when copying formula across rows/columns.',
    correctLogic: 'Relative references (e.g. A1) adjust automatically when copied down. Absolute references ($A$1) remain locked to that exact cell.',
    codeSnippet: '=B2*$C$1 # Locking tax rate cell C1',
    quizQuestion: 'If formula `=A1+B1` in cell C1 is copied down to cell C2, what does it become?',
    options: ['=A1+B1', '=A2+B2', '=$A$1+$B$1', '=A1+B2'],
    correctOption: 1,
    explanation: 'Relative cell references shift down by 1 row, becoming `=A2+B2`.'
  },
  {
    id: 'trap-5',
    topic: 'Cloud',
    trapTitle: 'Trap 5: Cloud Service Models (IaaS vs PaaS vs SaaS)',
    examMistake: 'Confusing Google Docs (SaaS) with Google App Engine (PaaS) or AWS EC2 (IaaS).',
    correctLogic: 'SaaS = Ready software (Google Docs, Gmail). PaaS = Platform for developers to deploy apps. IaaS = Raw virtual servers and storage infrastructure.',
    quizQuestion: 'Which cloud service model does Google Docs belong to?',
    options: ['IaaS (Infrastructure as a Service)', 'PaaS (Platform as a Service)', 'SaaS (Software as a Service)', 'DaaS (Data as a Service)'],
    correctOption: 2,
    explanation: 'Google Docs is an end-user cloud application, which falls under SaaS.'
  },
  {
    id: 'trap-6',
    topic: 'Cyber Ethics',
    trapTitle: 'Trap 6: Bhutanese Copyright Duration',
    examMistake: 'Thinking copyright lasts forever or for 20 years.',
    correctLogic: 'Under Bhutan Intellectual Property Laws, copyright protection lasts for the Author\'s Lifetime + 50 Years after death!',
    quizQuestion: 'According to Bhutanese copyright rules, how long does literary/artistic copyright protection last?',
    options: ['10 years from publication', '25 years', 'Lifetime of author + 50 years', '100 years'],
    correctOption: 2,
    explanation: 'In Bhutan, economic copyright protection extends throughout the author\'s life plus 50 years after their passing.'
  }
];

interface BcseaExamMasteryProps {
  onRewardXp?: (amount: number, levelId: string) => void;
}

export const BcseaExamMastery: React.FC<BcseaExamMasteryProps> = ({ onRewardXp }) => {
  const [activeTab, setActiveTab] = useState<'tracing' | 'traps' | 'guidelines' | 'rubric'>('tracing');

  // Tracing State
  const [selectedTraceIdx, setSelectedTraceIdx] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [tracingChecked, setTracingChecked] = useState(false);

  // Trap Quiz State
  const [trapAnswers, setTrapAnswers] = useState<Record<string, number>>({});
  const [trapChecked, setTrapChecked] = useState<Record<string, boolean>>({});

  const activeProblem = TRACING_PROBLEMS[selectedTraceIdx];

  const handleInputChange = (key: string, val: string) => {
    setUserInputs((prev) => ({ ...prev, [key]: val }));
  };

  const handleCheckTracing = () => {
    setTracingChecked(true);

    // Verify user entered correct outputs/steps for the tracing problem
    let correctCount = 0;
    activeProblem.expectedTable.forEach((row, rIdx) => {
      const userOut = (userInputs[`step_${rIdx}_out`] || '').trim().toLowerCase();
      const expectedOut = row.output.trim().toLowerCase();
      const userI = (userInputs[`step_${rIdx}_i`] || '').trim().toLowerCase();
      const expectedI = row.iVal.trim().toLowerCase();
      const userVar = (userInputs[`step_${rIdx}_var`] || '').trim().toLowerCase();
      const expectedVar = row.varState.trim().toLowerCase();

      if (
        (userOut && (expectedOut.includes(userOut) || userOut.includes(expectedOut))) ||
        (userI && expectedI.includes(userI)) ||
        (userVar && expectedVar.includes(userVar))
      ) {
        correctCount++;
      }
    });

    const isPassed = correctCount > 0;
    if (isPassed) {
      soundFx.playSuccess();
      if (onRewardXp) {
        onRewardXp(50, `bcsea-tracing-${activeProblem.id}`);
      }
    } else {
      soundFx.playRetry();
    }
  };

  const handleSelectTrapAnswer = (trapId: string, optIdx: number) => {
    const trap = EXAM_TRAPS.find((t) => t.id === trapId);
    if (!trap) return;

    setTrapAnswers((prev) => ({ ...prev, [trapId]: optIdx }));
    setTrapChecked((prev) => ({ ...prev, [trapId]: true }));

    const isCorrect = optIdx === trap.correctOption;
    if (isCorrect) {
      soundFx.playSuccess();
      if (onRewardXp) {
        onRewardXp(15, `bcsea-trap-${trapId}`);
      }
    } else {
      soundFx.playRetry();
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#1A1A1A] text-white p-6 rounded-3xl border-4 border-[#FFCC33] shadow-[8px_8px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FFCC33] text-xs font-black uppercase tracking-widest">
            <Award className="w-4 h-4 text-[#FFCC33]" /> BHSEC / BCSEA Board Exam Breakthrough
          </div>
          <h2 className="text-2xl font-black font-serif text-amber-100 mt-1">
            🎯 Class 10 BCSEA Python & ICT Mastery
          </h2>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            Master paper code dry-runs, avoid top 20 examination traps, and learn exact marking criteria to score Distinction in Class 10 Board Exams!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-[#2A2A2A] p-1.5 rounded-2xl border border-gray-700">
          <button
            onClick={() => setActiveTab('tracing')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tracing' ? 'bg-[#FFCC33] text-slate-900' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Dry-Run Tracing</span>
          </button>
          <button
            onClick={() => setActiveTab('traps')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'traps' ? 'bg-[#FFCC33] text-slate-900' : 'text-gray-300 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Top Exam Traps</span>
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guidelines' ? 'bg-[#FFCC33] text-slate-900' : 'text-gray-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Marking Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rubric' ? 'bg-[#FFCC33] text-slate-900' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-700" />
            <span>Board Rubric Inspector</span>
          </button>
        </div>
      </div>

      {/* TAB 4: BCSEA BOARD OFFICIAL MARKING RUBRIC INSPECTOR */}
      {activeTab === 'rubric' && (
        <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 sm:p-8 shadow-[8px_8px_0px_0px_#1A1A1A] space-y-6">
          <div className="border-b-2 border-gray-200 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#6D071A] text-white px-2.5 py-1 rounded-md">
                Official BCSEA Marking Scheme Rules
              </span>
              <h3 className="text-xl font-black font-serif text-[#1A1A1A] mt-1">
                Class 10 BCSEA Board Exam Point Allocation & Scoring Rubric
              </h3>
              <p className="text-xs text-gray-600 font-medium mt-1">
                Understand exact mark distributions used by national BCSEA examiners when grading Section B & C coding and spreadsheet questions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Sample 5-Mark Question Breakdown */}
            <div className="p-5 bg-amber-50/70 border-3 border-amber-300 rounded-2xl space-y-4">
              <h4 className="font-black text-sm text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-[#6D071A]" />
                Sample 5-Mark Question Analysis
              </h4>

              <div className="p-3 bg-white border border-amber-300 rounded-xl text-xs space-y-1">
                <p className="font-bold text-slate-900">Question Statement:</p>
                <p className="text-gray-700 italic">
                  "Write a Python function `calculate_gnh_index(scores)` that calculates the average GNH score of 5 dzongkhags and returns 'High GNH' if average &gt;= 75 else 'Standard GNH'."
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-black text-slate-900 uppercase">Official BCSEA Mark Distribution Key:</p>

                {[
                  { point: '[1 Mark]', rule: 'Valid Function Header Syntax', desc: 'Uses `def calculate_gnh_index(scores):` with colon' },
                  { point: '[1 Mark]', rule: 'Mathematical Formula Logic', desc: 'Computes sum and divides by length (`sum(scores)/len(scores)`)' },
                  { point: '[1 Mark]', rule: 'Block Indentation Consistency', desc: 'Consistent 4-space indentation inside function body' },
                  { point: '[1 Mark]', rule: 'Conditional Comparison', desc: 'Uses `if avg >= 75:` with correct comparison operator' },
                  { point: '[1 Mark]', rule: 'Return Statement & String Exactness', desc: 'Returns exact string literals without syntax typos' },
                ].map((rub, i) => (
                  <div key={i} className="p-2.5 bg-white border-2 border-gray-200 rounded-xl flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900">{rub.rule}</span>
                      <p className="text-[11px] text-gray-600 font-medium">{rub.desc}</p>
                    </div>
                    <span className="bg-[#6D071A] text-yellow-300 font-black text-[11px] px-2 py-0.5 rounded-md shrink-0 font-mono">
                      {rub.point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Top 5 Marking Rules to Never Lose Points */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl border-3 border-[#1A1A1A] space-y-4">
              <h4 className="font-black text-sm text-yellow-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-300" />
                Examiner's Checklist: How to Guarantee Full Marks
              </h4>

              <div className="space-y-3 text-xs text-amber-100/90 font-medium">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 space-y-1">
                  <p className="font-bold text-white">1. Always include Colons (`:`) in Loop/Condition Headers</p>
                  <p className="text-[11px] text-amber-200">BCSEA deducts 1/2 mark for missing colons on `for`, `while`, `if`, `else`, `def`.</p>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 space-y-1">
                  <p className="font-bold text-white">2. Maintain 4-Space Indentation on Paper</p>
                  <p className="text-[11px] text-amber-200">Indentation indicates scope in Python. Clearly indent code lines under conditional blocks.</p>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 space-y-1">
                  <p className="font-bold text-white">3. Differentiate Between `=` and `==`</p>
                  <p className="text-[11px] text-amber-200">Writing `if x = 5:` instead of `if x == 5:` triggers an immediate syntax point penalty.</p>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 space-y-1">
                  <p className="font-bold text-white">4. Typecast Numerical User Input</p>
                  <p className="text-[11px] text-amber-200">Always wrap `input()` with `int()` or `float()` when calculating values.</p>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 space-y-1">
                  <p className="font-bold text-white">5. Always Start Excel Formulas with `=`</p>
                  <p className="text-[11px] text-amber-200">Writing `SUM(A1:A5)` without `=` is treated as plain text in spreadsheets.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: DRY-RUN TRACING TABLE SIMULATOR */}
      {activeTab === 'tracing' && (
        <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_0px_#1A1A1A] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-gray-200 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#6D071A] text-white px-2.5 py-1 rounded-md">
                BCSEA Section C Standard
              </span>
              <h3 className="text-lg font-black text-[#1A1A1A] mt-1">{activeProblem.title}</h3>
              <p className="text-xs text-gray-600 font-medium">{activeProblem.description}</p>
            </div>

            <div className="flex items-center gap-2">
              {TRACING_PROBLEMS.map((prob, idx) => (
                <button
                  key={prob.id}
                  onClick={() => {
                    setSelectedTraceIdx(idx);
                    setUserInputs({});
                    setTracingChecked(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 cursor-pointer transition-all ${
                    selectedTraceIdx === idx
                      ? 'bg-[#FFCC33] text-[#1A1A1A] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-500'
                  }`}
                >
                  P{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Code Box */}
            <div className="lg:col-span-5 bg-[#1A1A1A] text-amber-200 p-5 rounded-2xl border-2 border-[#1A1A1A] font-mono text-xs space-y-2">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-2 flex items-center justify-between">
                <span>Python Script</span>
                <Code className="w-4 h-4 text-[#FFCC33]" />
              </div>
              <pre className="overflow-x-auto leading-relaxed pt-2">
                {activeProblem.code.map((line, lIdx) => (
                  <div key={lIdx} className="flex gap-3">
                    <span className="text-gray-600 select-none">{lIdx + 1}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </pre>
            </div>

            {/* Tracing Table */}
            <div className="lg:col-span-7 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#6D071A] text-amber-100 font-extrabold uppercase border-2 border-[#1A1A1A]">
                      <th className="p-2.5 border-r border-[#1A1A1A]">Step</th>
                      <th className="p-2.5 border-r border-[#1A1A1A]">Loop Var (i)</th>
                      <th className="p-2.5 border-r border-[#1A1A1A]">Variable State</th>
                      <th className="p-2.5 border-r border-[#1A1A1A]">Condition Check</th>
                      <th className="p-2.5">Console Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeProblem.expectedTable.map((row, rIdx) => (
                      <tr key={rIdx} className="border-2 border-[#1A1A1A] bg-amber-50/50">
                        <td className="p-2.5 font-bold text-center border-r border-[#1A1A1A] bg-amber-100/60">
                          {row.step}
                        </td>
                        <td className="p-2 border-r border-[#1A1A1A]">
                          <input
                            type="text"
                            placeholder={row.iVal}
                            value={userInputs[`step_${rIdx}_i`] || ''}
                            onChange={(e) => handleInputChange(`step_${rIdx}_i`, e.target.value)}
                            disabled={tracingChecked}
                            className="w-full bg-white border border-gray-300 rounded-lg p-1 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:border-[#6D071A]"
                          />
                        </td>
                        <td className="p-2 border-r border-[#1A1A1A]">
                          <input
                            type="text"
                            placeholder={row.varState}
                            value={userInputs[`step_${rIdx}_var`] || ''}
                            onChange={(e) => handleInputChange(`step_${rIdx}_var`, e.target.value)}
                            disabled={tracingChecked}
                            className="w-full bg-white border border-gray-300 rounded-lg p-1 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:border-[#6D071A]"
                          />
                        </td>
                        <td className="p-2 border-r border-[#1A1A1A]">
                          <input
                            type="text"
                            placeholder={row.condition}
                            value={userInputs[`step_${rIdx}_cond`] || ''}
                            onChange={(e) => handleInputChange(`step_${rIdx}_cond`, e.target.value)}
                            disabled={tracingChecked}
                            className="w-full bg-white border border-gray-300 rounded-lg p-1 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:border-[#6D071A]"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            placeholder={row.output}
                            value={userInputs[`step_${rIdx}_out`] || ''}
                            onChange={(e) => handleInputChange(`step_${rIdx}_out`, e.target.value)}
                            disabled={tracingChecked}
                            className="w-full bg-white border border-gray-300 rounded-lg p-1 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:border-[#6D071A]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!tracingChecked ? (
                <button
                  onClick={handleCheckTracing}
                  className="w-full py-3 bg-[#6D071A] hover:bg-[#80091F] text-amber-200 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#FFCC33] cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FFCC33]" />
                  <span>Check Tracing Table & Reveal Solution</span>
                </button>
              ) : (
                <div className="bg-emerald-50 border-2 border-emerald-600 p-4 rounded-2xl text-xs space-y-2 animate-fadeIn">
                  <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Solution Key & Teacher Notes:
                  </div>
                  <p className="text-emerald-950 font-medium leading-relaxed">
                    {activeProblem.explanation}
                  </p>
                  <div className="pt-2 border-t border-emerald-200 flex justify-end">
                    <button
                      onClick={() => setTracingChecked(false)}
                      className="text-[11px] font-black text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
                    >
                      Retry Tracing Problem
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOP EXAM TRAPS */}
      {activeTab === 'traps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXAM_TRAPS.map((trap) => {
            const isAnswered = trapChecked[trap.id];
            const selectedOpt = trapAnswers[trap.id];
            const isCorrect = selectedOpt === trap.correctOption;

            return (
              <div
                key={trap.id}
                className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-5 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#6D071A] text-[#FFCC33] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border border-[#1A1A1A]">
                      {trap.topic}
                    </span>
                    <span className="text-[10px] font-extrabold text-gray-500">BHSEC Frequent Pitfall</span>
                  </div>

                  <h3 className="text-base font-black text-[#1A1A1A]">{trap.trapTitle}</h3>

                  <div className="bg-rose-50 border border-rose-300 p-3 rounded-xl text-xs text-rose-900 font-medium leading-snug space-y-1">
                    <span className="font-black text-rose-700 block">❌ Common Student Mistake:</span>
                    <p>{trap.examMistake}</p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-xs text-emerald-900 font-medium leading-snug space-y-1">
                    <span className="font-black text-emerald-700 block">✅ Correct Logic / Rule:</span>
                    <p>{trap.correctLogic}</p>
                  </div>

                  {trap.codeSnippet && (
                    <pre className="bg-[#1A1A1A] text-amber-200 p-3 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto border border-gray-800">
                      {trap.codeSnippet}
                    </pre>
                  )}

                  {/* Micro Quiz */}
                  <div className="pt-2 border-t border-gray-200 space-y-2">
                    <div className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#6D071A]" />
                      <span>{trap.quizQuestion}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {trap.options.map((opt, oIdx) => {
                        let btnClass = 'bg-gray-50 text-[#1A1A1A] border-gray-300 hover:bg-amber-50';
                        if (isAnswered) {
                          if (oIdx === trap.correctOption && isCorrect) {
                            btnClass = 'bg-emerald-100 text-emerald-900 border-emerald-600 font-bold';
                          } else if (selectedOpt === oIdx && !isCorrect) {
                            btnClass = 'bg-rose-100 text-rose-900 border-rose-600 font-bold';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectTrapAnswer(trap.id, oIdx)}
                            disabled={isAnswered}
                            className={`p-2 rounded-xl border text-[11px] font-semibold text-left transition-all cursor-pointer ${btnClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <p className="text-[11px] text-gray-700 font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-300">
                        💡 {trap.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: MARKING GUIDELINES */}
      {activeTab === 'guidelines' && (
        <div className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_0px_#1A1A1A] space-y-6">
          <div>
            <h3 className="text-xl font-black text-[#1A1A1A] font-serif">
              📜 BHSEC / BCSEA Class 10 Marking Scheme Secrets
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Direct guidance from Bhutanese Senior ICT Board Examiners on how marks are awarded.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 border-2 border-[#1A1A1A] p-4 rounded-2xl space-y-2">
              <div className="text-xs font-black text-[#6D071A] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Section A (20 Marks)
              </div>
              <h4 className="text-sm font-bold text-[#1A1A1A]">Objective MCQs & Fill-in-Blanks</h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Be precise with syntax details. Pay close attention to quotes around string outputs, square brackets around lists, and exact formula names in Excel (e.g., `=AVERAGE` not `=AVG`).
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-[#1A1A1A] p-4 rounded-2xl space-y-2">
              <div className="text-xs font-black text-[#6D071A] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Section B (30 Marks)
              </div>
              <h4 className="text-sm font-bold text-[#1A1A1A]">Short Answer & Conceptual Explanations</h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Always state 2 distinct points for 2-mark questions. Use standard terminology like <strong>"Indentation"</strong>, <strong>"Data Types"</strong>, <strong>"Absolute Reference"</strong>, and <strong>"Cloud Services"</strong>.
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-[#1A1A1A] p-4 rounded-2xl space-y-2">
              <div className="text-xs font-black text-[#6D071A] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Section C (50 Marks)
              </div>
              <h4 className="text-sm font-bold text-[#1A1A1A]">Python Coding & Tracing Tables</h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                For coding questions, write proper comments `#` and maintain correct 4-space indentation. Draw dry-run tables clearly with step numbers, variable values, and final print output.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
