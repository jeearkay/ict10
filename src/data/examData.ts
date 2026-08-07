export interface ExamPrepQuestion {
  id: number | string;
  chapter: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  status?: 'published' | 'draft';
}

export interface TracingStep {
  step: number;
  iVal: string;
  varState: string;
  condition: string;
  output: string;
}

export interface TracingProblem {
  id: string;
  title: string;
  code: string[];
  description: string;
  expectedTable: TracingStep[];
  explanation: string;
  status?: 'published' | 'draft';
}

export const DEFAULT_MOCK_EXAM_QUESTIONS: ExamPrepQuestion[] = [
  {
    id: 1,
    chapter: 'Python Programming',
    question: 'What will be the output of print(len([10, 20, "Bhutan", 40])) in Python?',
    options: ['3', '4', '5', 'TypeError'],
    correctAnswer: 1,
    explanation: 'The len() function returns the total number of items in a list. Here the list contains 4 elements: 10, 20, "Bhutan", and 40.'
  },
  {
    id: 2,
    chapter: 'Python Programming',
    question: 'Which Python keyword is used to start a conditional branch execution?',
    options: ['for', 'def', 'if', 'while'],
    correctAnswer: 2,
    explanation: 'The `if` keyword evaluates a boolean expression to conditionally execute code.'
  },
  {
    id: 3,
    chapter: 'MS Excel & Data Analysis',
    question: 'Which formula calculates the average of cell range A1 through A10 in MS Excel?',
    options: ['=MEAN(A1:A10)', '=AVERAGE(A1:A10)', '=AVG(A1..A10)', '=SUM(A1:A10)/10'],
    correctAnswer: 1,
    explanation: '=AVERAGE(A1:A10) is the standard built-in MS Excel formula for arithmetic mean.'
  },
  {
    id: 4,
    chapter: 'Google Workspace & Cloud',
    question: 'What feature in Google Docs allows multiple students to edit the same file simultaneously in real-time?',
    options: ['Local Save', 'Real-Time Co-authoring / Cloud Collaboration', 'File Transfer Protocol', 'Offline Sync'],
    correctAnswer: 1,
    explanation: 'Cloud storage and Google Docs enable live multi-user concurrent editing and commenting across devices.'
  },
  {
    id: 5,
    chapter: 'Cyber Ethics & Copyright',
    question: 'Under Bhutanese copyright awareness, what is the illegal copy and distribution of software or digital media called?',
    options: ['Open Source', 'Software Piracy', 'Creative Commons', 'Public Domain'],
    correctAnswer: 1,
    explanation: 'Software piracy refers to unauthorized copying, distribution, or commercial use of copyrighted software.'
  },
  {
    id: 6,
    chapter: 'Python Functions & Scope',
    question: 'What essential condition must every recursive function possess to prevent infinite recursion?',
    options: ['Infinite loop', 'Base case', 'Global variable', 'Typecast statement'],
    correctAnswer: 1,
    explanation: 'A base case is a stopping condition that terminates the recursive calls and prevents a call stack overflow error.'
  }
];

export const DEFAULT_TRACING_PROBLEMS: TracingProblem[] = [
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
