import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  FastForward,
  Rewind,
  Sparkles,
  Terminal,
  Code,
  Box,
  Cpu,
  Zap,
  Edit3,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface ExecutionStep {
  lineNumber: number;
  explanation: string;
  variables: Record<string, any>;
  variableTypes: Record<string, string>;
  changedVars: string[];
  output: string[];
  callStack: string[];
  isWaitingForInput?: boolean;
  inputPromptText?: string;
  inputVarName?: string;
  inputType?: 'str' | 'int' | 'float';
  inputStepId?: string;
  hasError?: boolean;
  errorMessage?: string;
}

export interface PresetProgram {
  id: string;
  title: string;
  chapter: string;
  code: string[];
  steps: ExecutionStep[];
}

export const PRESET_PROGRAMS: PresetProgram[] = [
  {
    id: 'variables-calc',
    title: '1. Variables & Data Types - Area Calculation',
    chapter: 'Topic 1: Variables & Data Types',
    code: [
      '# ICT Python - Circle Area Calculation',
      'pi = 3.14159',
      'radius = 7.0',
      'area = pi * (radius ** 2)',
      'circumference = 2 * pi * radius',
      'print("Radius:", radius)',
      'print("Area of Circle:", area)',
      'print("Circumference:", circumference)'
    ],
    steps: [
      {
        lineNumber: 1,
        explanation: 'Line 1 is a comment starting with #. Comments are ignored by the Python interpreter.',
        variables: {},
        variableTypes: {},
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 2,
        explanation: 'Assigning float value 3.14159 to variable "pi".',
        variables: { pi: 3.14159 },
        variableTypes: { pi: 'float' },
        changedVars: ['pi'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'Assigning float value 7.0 to variable "radius".',
        variables: { pi: 3.14159, radius: 7.0 },
        variableTypes: { pi: 'float', radius: 'float' },
        changedVars: ['radius'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 4,
        explanation: 'Calculating area = pi * (radius ** 2) -> 3.14159 * 49.0 = 153.93791. Stored in "area".',
        variables: { pi: 3.14159, radius: 7.0, area: 153.93791 },
        variableTypes: { pi: 'float', radius: 'float', area: 'float' },
        changedVars: ['area'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 5,
        explanation: 'Calculating circumference = 2 * pi * radius -> 2 * 3.14159 * 7.0 = 43.98226. Stored in "circumference".',
        variables: { pi: 3.14159, radius: 7.0, area: 153.93791, circumference: 43.98226 },
        variableTypes: { pi: 'float', radius: 'float', area: 'float', circumference: 'float' },
        changedVars: ['circumference'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 6,
        explanation: 'Executing print("Radius:", radius). Evaluates radius to 7.0 and prints line to console.',
        variables: { pi: 3.14159, radius: 7.0, area: 153.93791, circumference: 43.98226 },
        variableTypes: { pi: 'float', radius: 'float', area: 'float', circumference: 'float' },
        changedVars: [],
        output: ['Radius: 7.0'],
        callStack: ['<main>']
      },
      {
        lineNumber: 7,
        explanation: 'Executing print("Area of Circle:", area). Outputs 153.93791 to console.',
        variables: { pi: 3.14159, radius: 7.0, area: 153.93791, circumference: 43.98226 },
        variableTypes: { pi: 'float', radius: 'float', area: 'float', circumference: 'float' },
        changedVars: [],
        output: ['Radius: 7.0', 'Area of Circle: 153.93791'],
        callStack: ['<main>']
      },
      {
        lineNumber: 8,
        explanation: 'Executing print("Circumference:", circumference). Program execution completed!',
        variables: { pi: 3.14159, radius: 7.0, area: 153.93791, circumference: 43.98226 },
        variableTypes: { pi: 'float', radius: 'float', area: 'float', circumference: 'float' },
        changedVars: [],
        output: ['Radius: 7.0', 'Area of Circle: 153.93791', 'Circumference: 43.98226'],
        callStack: ['<main>']
      }
    ]
  },
  {
    id: 'if-elif-grade',
    title: '2. Conditional Statements - If-Elif-Else Grade Classifier',
    chapter: 'Topic 2: Control Structures & Decisions',
    code: [
      '# ICT Python - Marks Grade Classifier',
      'marks = 85',
      'if marks >= 90:',
      '    grade = "A+ (Outstanding)"',
      'elif marks >= 75:',
      '    grade = "A (Very Good)"',
      'elif marks >= 60:',
      '    grade = "B (Good)"',
      'else:',
      '    grade = "C (Needs Work)"',
      'print("Student Marks:", marks)',
      'print("Assigned Grade:", grade)'
    ],
    steps: [
      {
        lineNumber: 1,
        explanation: 'Comment line ignored by interpreter.',
        variables: {},
        variableTypes: {},
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 2,
        explanation: 'Assigning integer 85 to variable "marks".',
        variables: { marks: 85 },
        variableTypes: { marks: 'int' },
        changedVars: ['marks'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'Evaluating "if marks >= 90:" -> 85 >= 90 -> False. Skipping IF block.',
        variables: { marks: 85 },
        variableTypes: { marks: 'int' },
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 5,
        explanation: 'Evaluating "elif marks >= 75:" -> 85 >= 75 -> True! Branching into this ELIF block.',
        variables: { marks: 85 },
        variableTypes: { marks: 'int' },
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 6,
        explanation: 'Executing ELIF block: Assigning string "A (Very Good)" to variable "grade".',
        variables: { marks: 85, grade: 'A (Very Good)' },
        variableTypes: { marks: 'int', grade: 'str' },
        changedVars: ['grade'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 11,
        explanation: 'Skipped remaining ELIF and ELSE blocks. Executing print("Student Marks:", marks).',
        variables: { marks: 85, grade: 'A (Very Good)' },
        variableTypes: { marks: 'int', grade: 'str' },
        changedVars: [],
        output: ['Student Marks: 85'],
        callStack: ['<main>']
      },
      {
        lineNumber: 12,
        explanation: 'Executing print("Assigned Grade:", grade). Outputs "A (Very Good)" to console.',
        variables: { marks: 85, grade: 'A (Very Good)' },
        variableTypes: { marks: 'int', grade: 'str' },
        changedVars: [],
        output: ['Student Marks: 85', 'Assigned Grade: A (Very Good)'],
        callStack: ['<main>']
      }
    ]
  },
  {
    id: 'while-loop-counter',
    title: '3. While Loops - Rocket Countdown',
    chapter: 'Topic 3: Iteration & Loops',
    code: [
      '# ICT Python - While Loop Countdown',
      'count = 3',
      'while count > 0:',
      '    print("Countdown:", count)',
      '    count = count - 1',
      'print("🚀 Blast Off!")'
    ],
    steps: [
      {
        lineNumber: 1,
        explanation: 'Comment header line ignored.',
        variables: {},
        variableTypes: {},
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 2,
        explanation: 'Initializing loop counter variable "count" = 3.',
        variables: { count: 3 },
        variableTypes: { count: 'int' },
        changedVars: ['count'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'WHILE LOOP Condition Check: count > 0 -> 3 > 0 -> True. Entering loop body.',
        variables: { count: 3 },
        variableTypes: { count: 'int' },
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 4,
        explanation: 'Loop iteration 1: Executing print("Countdown:", 3).',
        variables: { count: 3 },
        variableTypes: { count: 'int' },
        changedVars: [],
        output: ['Countdown: 3'],
        callStack: ['<main>']
      },
      {
        lineNumber: 5,
        explanation: 'Decrementing count = 3 - 1 -> 2.',
        variables: { count: 2 },
        variableTypes: { count: 'int' },
        changedVars: ['count'],
        output: ['Countdown: 3'],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'WHILE LOOP Condition Check: count > 0 -> 2 > 0 -> True. Continuing loop.',
        variables: { count: 2 },
        variableTypes: { count: 'int' },
        changedVars: [],
        output: ['Countdown: 3'],
        callStack: ['<main>']
      },
      {
        lineNumber: 4,
        explanation: 'Loop iteration 2: Executing print("Countdown:", 2).',
        variables: { count: 2 },
        variableTypes: { count: 'int' },
        changedVars: [],
        output: ['Countdown: 3', 'Countdown: 2'],
        callStack: ['<main>']
      },
      {
        lineNumber: 5,
        explanation: 'Decrementing count = 2 - 1 -> 1.',
        variables: { count: 1 },
        variableTypes: { count: 'int' },
        changedVars: ['count'],
        output: ['Countdown: 3', 'Countdown: 2'],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'WHILE LOOP Condition Check: count > 0 -> 1 > 0 -> True. Continuing loop.',
        variables: { count: 1 },
        variableTypes: { count: 'int' },
        changedVars: [],
        output: ['Countdown: 3', 'Countdown: 2'],
        callStack: ['<main>']
      },
      {
        lineNumber: 4,
        explanation: 'Loop iteration 3: Executing print("Countdown:", 1).',
        variables: { count: 1 },
        variableTypes: { count: 'int' },
        changedVars: [],
        output: ['Countdown: 3', 'Countdown: 2', 'Countdown: 1'],
        callStack: ['<main>']
      },
      {
        lineNumber: 5,
        explanation: 'Decrementing count = 1 - 1 -> 0.',
        variables: { count: 0 },
        variableTypes: { count: 'int' },
        changedVars: ['count'],
        output: ['Countdown: 3', 'Countdown: 2', 'Countdown: 1'],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'WHILE LOOP Condition Check: count > 0 -> 0 > 0 -> False! Loop terminates.',
        variables: { count: 0 },
        variableTypes: { count: 'int' },
        changedVars: [],
        output: ['Countdown: 3', 'Countdown: 2', 'Countdown: 1'],
        callStack: ['<main>']
      },
      {
        lineNumber: 6,
        explanation: 'Executing post-loop line: print("🚀 Blast Off!").',
        variables: { count: 0 },
        variableTypes: { count: 'int' },
        changedVars: [],
        output: ['Countdown: 3', 'Countdown: 2', 'Countdown: 1', '🚀 Blast Off!'],
        callStack: ['<main>']
      }
    ]
  },
  {
    id: 'for-range-sum',
    title: '4. For Loops & range() - Accumulator Sum',
    chapter: 'Topic 3: Iteration & Loops',
    code: [
      '# ICT Python - Sum of First N Numbers',
      'total = 0',
      'for i in range(1, 4):',
      '    total = total + i',
      '    print("Added", i, "| Running Total:", total)',
      'print("Final Sum:", total)'
    ],
    steps: [
      {
        lineNumber: 1,
        explanation: 'Comment line header.',
        variables: {},
        variableTypes: {},
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 2,
        explanation: 'Initializing accumulator variable "total" = 0.',
        variables: { total: 0 },
        variableTypes: { total: 'int' },
        changedVars: ['total'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'FOR LOOP range(1, 4) starts. Generates sequence [1, 2, 3]. Iteration 1 setting i = 1.',
        variables: { total: 0, i: 1 },
        variableTypes: { total: 'int', i: 'int' },
        changedVars: ['i'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 4,
        explanation: 'Adding i to total: total = 0 + 1 -> 1.',
        variables: { total: 1, i: 1 },
        variableTypes: { total: 'int', i: 'int' },
        changedVars: ['total'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 5,
        explanation: 'Printing iteration 1 summary to console.',
        variables: { total: 1, i: 1 },
        variableTypes: { total: 'int', i: 'int' },
        changedVars: [],
        output: ['Added 1 | Running Total: 1'],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'FOR LOOP range(1, 4) Iteration 2: setting i = 2.',
        variables: { total: 1, i: 2 },
        variableTypes: { total: 'int', i: 'int' },
        changedVars: ['i'],
        output: ['Added 1 | Running Total: 1'],
        callStack: ['<main>']
      },
      {
        lineNumber: 4,
        explanation: 'Adding i to total: total = 1 + 2 -> 3.',
        variables: { total: 3, i: 2 },
        variableTypes: { total: 'int', i: 'int' },
        changedVars: ['total'],
        output: ['Added 1 | Running Total: 1'],
        callStack: ['<main>']
      },
      {
        lineNumber: 5,
        explanation: 'Printing iteration 2 summary to console.',
        variables: { total: 3, i: 2 },
        variableTypes: { total: 'int', i: 'int' },
        changedVars: [],
        output: ['Added 1 | Running Total: 1', 'Added 2 | Running Total: 3'],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'FOR LOOP range(1, 4) Iteration 3: setting i = 3.',
        variables: { total: 3, i: 3 },
        variableTypes: { total: 'int', i: 'int' },
        changedVars: ['i'],
        output: ['Added 1 | Running Total: 1', 'Added 2 | Running Total: 3'],
        callStack: ['<main>']
      },
      {
        lineNumber: 4,
        explanation: 'Adding i to total: total = 3 + 3 -> 6.',
        variables: { total: 6, i: 3 },
        variableTypes: { total: 'int', i: 'int' },
        changedVars: ['total'],
        output: ['Added 1 | Running Total: 1', 'Added 2 | Running Total: 3'],
        callStack: ['<main>']
      },
      {
        lineNumber: 5,
        explanation: 'Printing iteration 3 summary to console.',
        variables: { total: 6, i: 3 },
        variableTypes: { total: 'int', i: 'int' },
        changedVars: [],
        output: ['Added 1 | Running Total: 1', 'Added 2 | Running Total: 3', 'Added 3 | Running Total: 6'],
        callStack: ['<main>']
      },
      {
        lineNumber: 6,
        explanation: 'Loop finishes (range stop at 4 reached). Printing final result.',
        variables: { total: 6, i: 3 },
        variableTypes: { total: 'int', i: 'int' },
        changedVars: [],
        output: ['Added 1 | Running Total: 1', 'Added 2 | Running Total: 3', 'Added 3 | Running Total: 6', 'Final Sum: 6'],
        callStack: ['<main>']
      }
    ]
  },
  {
    id: 'list-operations',
    title: '5. Python Lists & Methods - Append & Length',
    chapter: 'Topic 4: Data Structures (Lists)',
    code: [
      '# ICT Python - List Append & Length',
      'dzongkhags = ["Thimphu", "Punakha"]',
      'print("Initial List:", dzongkhags)',
      'dzongkhags.append("Paro")',
      'count = len(dzongkhags)',
      'print("Updated List:", dzongkhags)',
      'print("Total Count:", count)'
    ],
    steps: [
      {
        lineNumber: 1,
        explanation: 'Comment header ignored.',
        variables: {},
        variableTypes: {},
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 2,
        explanation: 'Creating list variable "dzongkhags" with 2 initial elements.',
        variables: { dzongkhags: ['Thimphu', 'Punakha'] },
        variableTypes: { dzongkhags: 'list' },
        changedVars: ['dzongkhags'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'Printing initial list content to console.',
        variables: { dzongkhags: ['Thimphu', 'Punakha'] },
        variableTypes: { dzongkhags: 'list' },
        changedVars: [],
        output: ["Initial List: ['Thimphu', 'Punakha']"],
        callStack: ['<main>']
      },
      {
        lineNumber: 4,
        explanation: 'Executing dzongkhags.append("Paro"). Appends "Paro" to the end of the list.',
        variables: { dzongkhags: ['Thimphu', 'Punakha', 'Paro'] },
        variableTypes: { dzongkhags: 'list' },
        changedVars: ['dzongkhags'],
        output: ["Initial List: ['Thimphu', 'Punakha']"],
        callStack: ['<main>']
      },
      {
        lineNumber: 5,
        explanation: 'Executing count = len(dzongkhags). Evaluates list length (3 elements) and assigns to "count".',
        variables: { dzongkhags: ['Thimphu', 'Punakha', 'Paro'], count: 3 },
        variableTypes: { dzongkhags: 'list', count: 'int' },
        changedVars: ['count'],
        output: ["Initial List: ['Thimphu', 'Punakha']"],
        callStack: ['<main>']
      },
      {
        lineNumber: 6,
        explanation: 'Printing updated list to console.',
        variables: { dzongkhags: ['Thimphu', 'Punakha', 'Paro'], count: 3 },
        variableTypes: { dzongkhags: 'list', count: 'int' },
        changedVars: [],
        output: ["Initial List: ['Thimphu', 'Punakha']", "Updated List: ['Thimphu', 'Punakha', 'Paro']"],
        callStack: ['<main>']
      },
      {
        lineNumber: 7,
        explanation: 'Printing total count to console.',
        variables: { dzongkhags: ['Thimphu', 'Punakha', 'Paro'], count: 3 },
        variableTypes: { dzongkhags: 'list', count: 'int' },
        changedVars: [],
        output: ["Initial List: ['Thimphu', 'Punakha']", "Updated List: ['Thimphu', 'Punakha', 'Paro']", "Total Count: 3"],
        callStack: ['<main>']
      }
    ]
  },
  {
    id: 'string-methods',
    title: '6. Strings - Slicing & Upper Case Methods',
    chapter: 'Topic 4: Strings & Formatting',
    code: [
      '# ICT Python - String Operations',
      'name = "Karma Wangchuk"',
      'length = len(name)',
      'upper_name = name.upper()',
      'first_char = name[0]',
      'print("Original:", name)',
      'print("Uppercase:", upper_name)',
      'print("First Initial:", first_char)'
    ],
    steps: [
      {
        lineNumber: 1,
        explanation: 'Comment header line.',
        variables: {},
        variableTypes: {},
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 2,
        explanation: 'Assigning string "Karma Wangchuk" to variable "name".',
        variables: { name: 'Karma Wangchuk' },
        variableTypes: { name: 'str' },
        changedVars: ['name'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'Calculating len("Karma Wangchuk") -> 14 characters. Stored in "length".',
        variables: { name: 'Karma Wangchuk', length: 14 },
        variableTypes: { name: 'str', length: 'int' },
        changedVars: ['length'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 4,
        explanation: 'Calling name.upper() -> "KARMA WANGCHUK". Stored in "upper_name".',
        variables: { name: 'Karma Wangchuk', length: 14, upper_name: 'KARMA WANGCHUK' },
        variableTypes: { name: 'str', length: 'int', upper_name: 'str' },
        changedVars: ['upper_name'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 5,
        explanation: 'Index lookup name[0] -> "K". Stored in "first_char".',
        variables: { name: 'Karma Wangchuk', length: 14, upper_name: 'KARMA WANGCHUK', first_char: 'K' },
        variableTypes: { name: 'str', length: 'int', upper_name: 'str', first_char: 'str' },
        changedVars: ['first_char'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 6,
        explanation: 'Printing original name.',
        variables: { name: 'Karma Wangchuk', length: 14, upper_name: 'KARMA WANGCHUK', first_char: 'K' },
        variableTypes: { name: 'str', length: 'int', upper_name: 'str', first_char: 'str' },
        changedVars: [],
        output: ['Original: Karma Wangchuk'],
        callStack: ['<main>']
      },
      {
        lineNumber: 7,
        explanation: 'Printing uppercase string.',
        variables: { name: 'Karma Wangchuk', length: 14, upper_name: 'KARMA WANGCHUK', first_char: 'K' },
        variableTypes: { name: 'str', length: 'int', upper_name: 'str', first_char: 'str' },
        changedVars: [],
        output: ['Original: Karma Wangchuk', 'Uppercase: KARMA WANGCHUK'],
        callStack: ['<main>']
      },
      {
        lineNumber: 8,
        explanation: 'Printing initial character.',
        variables: { name: 'Karma Wangchuk', length: 14, upper_name: 'KARMA WANGCHUK', first_char: 'K' },
        variableTypes: { name: 'str', length: 'int', upper_name: 'str', first_char: 'str' },
        changedVars: [],
        output: ['Original: Karma Wangchuk', 'Uppercase: KARMA WANGCHUK', 'First Initial: K'],
        callStack: ['<main>']
      }
    ]
  },
  {
    id: 'functions-callstack',
    title: '7. User Defined Functions - Call Stack Frame',
    chapter: 'Topic 5: Functions & Modular Programming',
    code: [
      '# ICT Python - Factorial Function Call',
      'def calc_factorial(n):',
      '    if n == 1:',
      '        return 1',
      '    return n * calc_factorial(n - 1)',
      '',
      'num = 3',
      'result = calc_factorial(num)',
      'print("Factorial of 3 is:", result)'
    ],
    steps: [
      {
        lineNumber: 1,
        explanation: 'Comment header line.',
        variables: {},
        variableTypes: {},
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 2,
        explanation: 'Defining function "calc_factorial(n)". Function registered in global memory scope.',
        variables: { calc_factorial: '<function>' },
        variableTypes: { calc_factorial: 'function' },
        changedVars: ['calc_factorial'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 7,
        explanation: 'Assigning integer 3 to variable "num".',
        variables: { calc_factorial: '<function>', num: 3 },
        variableTypes: { calc_factorial: 'function', num: 'int' },
        changedVars: ['num'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 8,
        explanation: 'Calling calc_factorial(3). Creating Stack Frame: calc_factorial(n=3).',
        variables: { calc_factorial: '<function>', num: 3, 'calc_factorial(n=3).n': 3 },
        variableTypes: { calc_factorial: 'function', num: 'int', 'calc_factorial(n=3).n': 'int' },
        changedVars: ['calc_factorial(n=3).n'],
        output: [],
        callStack: ['<main>', 'calc_factorial(n=3)']
      },
      {
        lineNumber: 3,
        explanation: 'In calc_factorial(n=3): Evaluating "if n == 1:" -> 3 == 1 -> False.',
        variables: { calc_factorial: '<function>', num: 3, 'calc_factorial(n=3).n': 3 },
        variableTypes: { calc_factorial: 'function', num: 'int', 'calc_factorial(n=3).n': 'int' },
        changedVars: [],
        output: [],
        callStack: ['<main>', 'calc_factorial(n=3)']
      },
      {
        lineNumber: 5,
        explanation: 'In calc_factorial(n=3): Returning 3 * calc_factorial(2). Recursive call!',
        variables: { calc_factorial: '<function>', num: 3, 'calc_factorial(n=3).n': 3, 'calc_factorial(n=2).n': 2 },
        variableTypes: { calc_factorial: 'function', num: 'int', 'calc_factorial(n=3).n': 'int', 'calc_factorial(n=2).n': 'int' },
        changedVars: ['calc_factorial(n=2).n'],
        output: [],
        callStack: ['<main>', 'calc_factorial(n=3)', 'calc_factorial(n=2)']
      },
      {
        lineNumber: 3,
        explanation: 'In calc_factorial(n=2): Evaluating "if n == 1:" -> 2 == 1 -> False.',
        variables: { calc_factorial: '<function>', num: 3, 'calc_factorial(n=3).n': 3, 'calc_factorial(n=2).n': 2 },
        variableTypes: { calc_factorial: 'function', num: 'int', 'calc_factorial(n=3).n': 'int', 'calc_factorial(n=2).n': 'int' },
        changedVars: [],
        output: [],
        callStack: ['<main>', 'calc_factorial(n=3)', 'calc_factorial(n=2)']
      },
      {
        lineNumber: 5,
        explanation: 'In calc_factorial(n=2): Returning 2 * calc_factorial(1). Calling base case!',
        variables: { calc_factorial: '<function>', num: 3, 'calc_factorial(n=3).n': 3, 'calc_factorial(n=2).n': 2, 'calc_factorial(n=1).n': 1 },
        variableTypes: { calc_factorial: 'function', num: 'int', 'calc_factorial(n=3).n': 'int', 'calc_factorial(n=2).n': 'int', 'calc_factorial(n=1).n': 'int' },
        changedVars: ['calc_factorial(n=1).n'],
        output: [],
        callStack: ['<main>', 'calc_factorial(n=3)', 'calc_factorial(n=2)', 'calc_factorial(n=1)']
      },
      {
        lineNumber: 3,
        explanation: 'In calc_factorial(n=1): Base case reached! "if n == 1:" -> True.',
        variables: { calc_factorial: '<function>', num: 3, 'calc_factorial(n=3).n': 3, 'calc_factorial(n=2).n': 2, 'calc_factorial(n=1).n': 1 },
        variableTypes: { calc_factorial: 'function', num: 'int', 'calc_factorial(n=3).n': 'int', 'calc_factorial(n=2).n': 'int', 'calc_factorial(n=1).n': 'int' },
        changedVars: [],
        output: [],
        callStack: ['<main>', 'calc_factorial(n=3)', 'calc_factorial(n=2)', 'calc_factorial(n=1)']
      },
      {
        lineNumber: 4,
        explanation: 'calc_factorial(1) returns 1. Frame popped from call stack!',
        variables: { calc_factorial: '<function>', num: 3, 'calc_factorial(n=3).n': 3, 'calc_factorial(n=2).n': 2, ret1: 1 },
        variableTypes: { calc_factorial: 'function', num: 'int', 'calc_factorial(n=3).n': 'int', 'calc_factorial(n=2).n': 'int', ret1: 'int' },
        changedVars: ['ret1'],
        output: [],
        callStack: ['<main>', 'calc_factorial(n=3)', 'calc_factorial(n=2)']
      },
      {
        lineNumber: 5,
        explanation: 'calc_factorial(2) returns 2 * 1 = 2. Frame popped from call stack!',
        variables: { calc_factorial: '<function>', num: 3, 'calc_factorial(n=3).n': 3, ret2: 2 },
        variableTypes: { calc_factorial: 'function', num: 'int', 'calc_factorial(n=3).n': 'int', ret2: 'int' },
        changedVars: ['ret2'],
        output: [],
        callStack: ['<main>', 'calc_factorial(n=3)']
      },
      {
        lineNumber: 5,
        explanation: 'calc_factorial(3) returns 3 * 2 = 6. Result assigned to "result" in main scope.',
        variables: { calc_factorial: '<function>', num: 3, result: 6 },
        variableTypes: { calc_factorial: 'function', num: 'int', result: 'int' },
        changedVars: ['result'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 9,
        explanation: 'Executing print statement. Outputs "Factorial of 3 is: 6" to console.',
        variables: { calc_factorial: '<function>', num: 3, result: 6 },
        variableTypes: { calc_factorial: 'function', num: 'int', result: 'int' },
        changedVars: [],
        output: ['Factorial of 3 is: 6'],
        callStack: ['<main>']
      }
    ]
  },
  {
    id: 'try-except-handling',
    title: '8. Exception Handling - Try-Except Safe Division',
    chapter: 'Topic 6: Error & Exception Handling',
    code: [
      '# ICT Python - Division Error Handling',
      'a = 10',
      'b = 0',
      'try:',
      '    print("Attempting division:", a, "/", b)',
      '    result = a / b',
      'except ZeroDivisionError:',
      '    result = "Error: Division by zero is not allowed!"',
      'print("Execution Status:", result)'
    ],
    steps: [
      {
        lineNumber: 1,
        explanation: 'Comment line ignored.',
        variables: {},
        variableTypes: {},
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 2,
        explanation: 'Assigning 10 to variable "a".',
        variables: { a: 10 },
        variableTypes: { a: 'int' },
        changedVars: ['a'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 3,
        explanation: 'Assigning 0 to variable "b".',
        variables: { a: 10, b: 0 },
        variableTypes: { a: 'int', b: 'int' },
        changedVars: ['b'],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 4,
        explanation: 'Entering TRY block to guard risky code against potential crashes.',
        variables: { a: 10, b: 0 },
        variableTypes: { a: 'int', b: 'int' },
        changedVars: [],
        output: [],
        callStack: ['<main>']
      },
      {
        lineNumber: 5,
        explanation: 'Executing print statement inside TRY block.',
        variables: { a: 10, b: 0 },
        variableTypes: { a: 'int', b: 'int' },
        changedVars: [],
        output: ['Attempting division: 10 / 0'],
        callStack: ['<main>']
      },
      {
        lineNumber: 6,
        explanation: 'Evaluating 10 / 0. ZeroDivisionError raised! Python intercepts crash and jumps to EXCEPT handler.',
        variables: { a: 10, b: 0 },
        variableTypes: { a: 'int', b: 'int' },
        changedVars: [],
        output: ['Attempting division: 10 / 0'],
        callStack: ['<main>']
      },
      {
        lineNumber: 7,
        explanation: 'Caught ZeroDivisionError! Executing EXCEPT recovery block.',
        variables: { a: 10, b: 0 },
        variableTypes: { a: 'int', b: 'int' },
        changedVars: [],
        output: ['Attempting division: 10 / 0'],
        callStack: ['<main>']
      },
      {
        lineNumber: 8,
        explanation: 'Assigning fallback error message string to "result".',
        variables: { a: 10, b: 0, result: 'Error: Division by zero is not allowed!' },
        variableTypes: { a: 'int', b: 'int', result: 'str' },
        changedVars: ['result'],
        output: ['Attempting division: 10 / 0'],
        callStack: ['<main>']
      },
      {
        lineNumber: 9,
        explanation: 'Executing print statement following error recovery.',
        variables: { a: 10, b: 0, result: 'Error: Division by zero is not allowed!' },
        variableTypes: { a: 'int', b: 'int', result: 'str' },
        changedVars: [],
        output: ['Attempting division: 10 / 0', 'Execution Status: Error: Division by zero is not allowed!'],
        callStack: ['<main>']
      }
    ]
  }
];

// Helper to split Python arguments safely respecting quoted strings
function splitPythonArgs(argStr: string): string[] {
  const result: string[] = [];
  let current = '';
  let inDouble = false;
  let inSingle = false;

  for (let i = 0; i < argStr.length; i++) {
    const ch = argStr[i];
    if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "'" && !inDouble) inSingle = !inSingle;

    if (ch === ',' && !inDouble && !inSingle) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) {
    result.push(current.trim());
  }
  return result;
}

// Helper to evaluate Python expressions with variable lookup
function evaluatePythonExpr(expr: string, vars: Record<string, any>): { value?: any; error?: string } {
  let trimmed = expr.trim();

  if (!trimmed) return { value: '' };

  // String literal
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return { value: trimmed.slice(1, -1) };
  }

  // Number literal
  if (!isNaN(Number(trimmed)) && trimmed !== '') {
    return { value: Number(trimmed) };
  }

  // Boolean literal
  if (trimmed === 'True') return { value: true };
  if (trimmed === 'False') return { value: false };

  // List literal [1, 2, 3]
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return { value: [] };
    const elements = splitPythonArgs(inner);
    const parsedList: any[] = [];
    for (const el of elements) {
      const res = evaluatePythonExpr(el, vars);
      if (res.error) return res;
      parsedList.push(res.value);
    }
    return { value: parsedList };
  }

  // len(...) call
  if (trimmed.startsWith('len(') && trimmed.endsWith(')')) {
    const arg = trimmed.slice(4, -1).trim();
    const res = evaluatePythonExpr(arg, vars);
    if (res.error) return res;
    const val = res.value;
    if (typeof val === 'string' || Array.isArray(val)) {
      return { value: val.length };
    }
    return { error: `TypeError: object of type '${typeof val}' has no len()` };
  }

  // int(...) or float(...) or str(...) wrapper
  if ((trimmed.startsWith('int(') || trimmed.startsWith('float(') || trimmed.startsWith('str(')) && trimmed.endsWith(')')) {
    const fn = trimmed.slice(0, trimmed.indexOf('('));
    const arg = trimmed.slice(trimmed.indexOf('(') + 1, -1).trim();
    const res = evaluatePythonExpr(arg, vars);
    if (res.error) return res;
    const val = res.value;

    if (fn === 'int') {
      const strVal = String(val).trim();
      if (/^-?\d+$/.test(strVal)) {
        return { value: parseInt(strVal, 10) };
      }
      return { error: `ValueError: invalid literal for int() with base 10: '${val}'` };
    }
    if (fn === 'float') {
      const strVal = String(val).trim();
      if (strVal !== '' && !isNaN(Number(strVal))) {
        return { value: parseFloat(strVal) };
      }
      return { error: `ValueError: could not convert string to float: '${val}'` };
    }
    if (fn === 'str') {
      return { value: String(val) };
    }
  }

  // Direct variable lookup
  if (vars[trimmed] !== undefined) {
    return { value: vars[trimmed] };
  }

  // Check division by zero
  if (/\/\s*0(?!\d)/.test(trimmed) || /\/\/\s*0(?!\d)/.test(trimmed) || /%\s*0(?!\d)/.test(trimmed)) {
    return { error: `ZeroDivisionError: division by zero` };
  }

  // Math expression evaluation with variable replacement
  let jsExpr = trimmed;
  const varNames = Object.keys(vars).sort((a, b) => b.length - a.length);

  for (const v of varNames) {
    const val = vars[v];
    const regex = new RegExp(`\\b${v}\\b`, 'g');
    if (typeof val === 'number') {
      jsExpr = jsExpr.replace(regex, String(val));
    } else if (typeof val === 'string') {
      jsExpr = jsExpr.replace(regex, JSON.stringify(val));
    } else if (typeof val === 'boolean') {
      jsExpr = jsExpr.replace(regex, String(val));
    }
  }

  // Integer division //
  jsExpr = jsExpr.replace(/(\d+(?:\.\d+)?)\s*\/\/\s*(\d+(?:\.\d+)?)/g, 'Math.floor($1 / $2)');

  try {
    if (/^[0-9\s+\-*/().%^" 'truefalseNaN]+$/i.test(jsExpr)) {
      const result = Function(`"use strict"; return (${jsExpr})`)();
      if (typeof result === 'number') {
        if (!isFinite(result)) {
          return { error: `ZeroDivisionError: division by zero` };
        }
        return { value: result };
      }
      if (typeof result === 'string' || typeof result === 'boolean') {
        return { value: result };
      }
    }
  } catch (err: any) {
    if (jsExpr.includes('+') && /"[^"]*"\s*\+\s*\d+|\d+\s*\+\s*"[^"]*"/.test(jsExpr)) {
      return { error: `TypeError: can only concatenate str (not "int") to str` };
    }
  }

  return { value: trimmed };
}

// Helper parser to simulate custom user code step-by-step
function parseCustomPythonCode(
  rawCode: string,
  providedInputs: Record<string, string> = {}
): { codeLines: string[]; steps: ExecutionStep[]; pendingInputStepId?: string } {
  const codeLines = rawCode.split('\n');
  const steps: ExecutionStep[] = [];

  const currentVars: Record<string, any> = {};
  const varTypes: Record<string, string> = {};
  let currentOutput: string[] = [];
  let inputCounter = 0;

  for (let i = 0; i < codeLines.length; i++) {
    const rawLine = codeLines[i];
    const line = rawLine.trim();
    const lineNum = i + 1;

    if (!line) continue; // blank line

    if (line.startsWith('#')) {
      steps.push({
        lineNumber: lineNum,
        explanation: `Line ${lineNum} is a comment: "${line}". Ignored by Python interpreter.`,
        variables: JSON.parse(JSON.stringify(currentVars)),
        variableTypes: { ...varTypes },
        changedVars: [],
        output: [...currentOutput],
        callStack: ['<main>']
      });
      continue;
    }

    // Check if line contains input() call
    if (line.includes('input(')) {
      let varName = '';
      let rightHand = line;

      if (line.includes('=') && !line.startsWith('if') && !line.startsWith('elif') && !line.startsWith('while')) {
        const parts = line.split('=');
        varName = parts[0].trim();
        rightHand = parts.slice(1).join('=').trim();
      }

      let inputType: 'str' | 'int' | 'float' = 'str';
      if (rightHand.startsWith('int(') || rightHand.includes('int(input(')) inputType = 'int';
      else if (rightHand.startsWith('float(') || rightHand.includes('float(input(')) inputType = 'float';

      // Extract prompt text inside input("...")
      const promptMatch = line.match(/input\s*\(\s*["'](.*?)["']\s*\)/);
      const promptText = promptMatch ? promptMatch[1] : '';

      const inputStepId = `input_line_${lineNum}_${inputCounter}`;
      inputCounter++;

      const providedVal = providedInputs[inputStepId];

      if (providedVal === undefined) {
        // Paused waiting for user input
        const displayPrompt = promptText ? `${promptText}` : '';
        const pendingOutput = displayPrompt ? [...currentOutput, displayPrompt] : [...currentOutput];

        steps.push({
          lineNumber: lineNum,
          explanation: `⏸️ Program paused on Line ${lineNum}: Waiting for user input in Standard Console ${varName ? `for variable "${varName}"` : ''}...`,
          variables: JSON.parse(JSON.stringify(currentVars)),
          variableTypes: { ...varTypes },
          changedVars: [],
          output: pendingOutput,
          callStack: ['<main>'],
          isWaitingForInput: true,
          inputPromptText: promptText,
          inputVarName: varName,
          inputType,
          inputStepId
        });

        // We pause execution here until user enters input in the console
        return { codeLines, steps, pendingInputStepId: inputStepId };
      } else {
        // Input was supplied by user! Validate type conversion matching Python IDLE
        let isValid = true;
        let errorMsg = '';
        let parsedVal: any = providedVal;

        if (inputType === 'int') {
          const trimmed = providedVal.trim();
          if (/^-?\d+$/.test(trimmed)) {
            parsedVal = parseInt(trimmed, 10);
          } else {
            isValid = false;
            errorMsg = `ValueError: invalid literal for int() with base 10: '${providedVal}'`;
          }
        } else if (inputType === 'float') {
          const trimmed = providedVal.trim();
          if (trimmed !== '' && !isNaN(Number(trimmed))) {
            parsedVal = parseFloat(trimmed);
          } else {
            isValid = false;
            errorMsg = `ValueError: could not convert string to float: '${providedVal}'`;
          }
        }

        if (!isValid) {
          const echoLine = promptText ? `${promptText}${providedVal}` : `> ${providedVal}`;
          currentOutput.push(echoLine);
          currentOutput.push(`Traceback (most recent call last):`);
          currentOutput.push(`  File "<stdin>", line ${lineNum}, in <module>`);
          currentOutput.push(`    ${line}`);
          currentOutput.push(errorMsg);

          steps.push({
            lineNumber: lineNum,
            explanation: `❌ Runtime Error (${errorMsg.split(':')[0]}) on Line ${lineNum}: ${errorMsg}. Program execution halted!`,
            variables: JSON.parse(JSON.stringify(currentVars)),
            variableTypes: { ...varTypes },
            changedVars: [],
            output: [...currentOutput],
            callStack: ['<main>'],
            isWaitingForInput: false,
            hasError: true,
            errorMessage: errorMsg
          });

          return { codeLines, steps };
        }

        if (varName) {
          currentVars[varName] = parsedVal;
          varTypes[varName] = inputType;
        }

        const echoLine = promptText ? `${promptText}${providedVal}` : `> ${providedVal}`;
        currentOutput.push(echoLine);

        steps.push({
          lineNumber: lineNum,
          explanation: `Received user input "${providedVal}". ${varName ? `Evaluated as ${inputType} (${parsedVal}) and stored in variable "${varName}".` : 'Processed input.'}`,
          variables: JSON.parse(JSON.stringify(currentVars)),
          variableTypes: { ...varTypes },
          changedVars: varName ? [varName] : [],
          output: [...currentOutput],
          callStack: ['<main>'],
          isWaitingForInput: false,
          inputPromptText: promptText,
          inputVarName: varName,
          inputType,
          inputStepId
        });

        continue;
      }
    }

    let explanation = `Executing line ${lineNum}: ${line}`;
    let changedVars: string[] = [];

    // Assignment
    if (line.includes('=') && !line.startsWith('if') && !line.startsWith('while') && !line.startsWith('elif')) {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const varName = parts[0].trim();
        const expr = parts.slice(1).join('=').trim();

        const evalRes = evaluatePythonExpr(expr, currentVars);
        if (evalRes.error) {
          currentOutput.push(`Traceback (most recent call last):`);
          currentOutput.push(`  File "<stdin>", line ${lineNum}, in <module>`);
          currentOutput.push(`    ${line}`);
          currentOutput.push(evalRes.error);

          steps.push({
            lineNumber: lineNum,
            explanation: `❌ Runtime Error (${evalRes.error.split(':')[0]}) on Line ${lineNum}: ${evalRes.error}. Execution halted!`,
            variables: JSON.parse(JSON.stringify(currentVars)),
            variableTypes: { ...varTypes },
            changedVars: [],
            output: [...currentOutput],
            callStack: ['<main>'],
            isWaitingForInput: false,
            hasError: true,
            errorMessage: evalRes.error
          });

          return { codeLines, steps };
        }

        const computedVal = evalRes.value;
        currentVars[varName] = computedVal;

        if (Array.isArray(computedVal)) varTypes[varName] = 'list';
        else if (typeof computedVal === 'number') varTypes[varName] = Number.isInteger(computedVal) ? 'int' : 'float';
        else if (typeof computedVal === 'boolean') varTypes[varName] = 'bool';
        else varTypes[varName] = 'str';

        explanation = `Evaluated expression "${expr}" -> ${Array.isArray(computedVal) ? `[${computedVal.join(', ')}]` : String(computedVal)}. Stored in variable "${varName}".`;
        changedVars = [varName];
      }
    } else if (line.startsWith('print(')) {
      const inner = line.slice(6, line.lastIndexOf(')')).trim();
      const argTokens = splitPythonArgs(inner);
      const printedParts: string[] = [];
      let printError = '';

      for (const tok of argTokens) {
        const evalRes = evaluatePythonExpr(tok, currentVars);
        if (evalRes.error) {
          printError = evalRes.error;
          break;
        }
        const val = evalRes.value;
        printedParts.push(Array.isArray(val) ? `[${val.join(', ')}]` : String(val));
      }

      if (printError) {
        currentOutput.push(`Traceback (most recent call last):`);
        currentOutput.push(`  File "<stdin>", line ${lineNum}, in <module>`);
        currentOutput.push(`    ${line}`);
        currentOutput.push(printError);

        steps.push({
          lineNumber: lineNum,
          explanation: `❌ Runtime Error (${printError.split(':')[0]}) on Line ${lineNum}: ${printError}. Execution halted!`,
          variables: JSON.parse(JSON.stringify(currentVars)),
          variableTypes: { ...varTypes },
          changedVars: [],
          output: [...currentOutput],
          callStack: ['<main>'],
          isWaitingForInput: false,
          hasError: true,
          errorMessage: printError
        });

        return { codeLines, steps };
      }

      const printedStr = printedParts.join(' ');
      currentOutput.push(printedStr);
      explanation = `Executing print statement. Outputs: "${printedStr}" to standard console.`;
    } else if (line.includes('.append(')) {
      const [varName, rest] = line.split('.append(');
      const rawArg = rest.slice(0, rest.lastIndexOf(')')).trim();
      const evalRes = evaluatePythonExpr(rawArg, currentVars);
      if (evalRes.error) {
        currentOutput.push(`Traceback (most recent call last):`);
        currentOutput.push(`  File "<stdin>", line ${lineNum}, in <module>`);
        currentOutput.push(`    ${line}`);
        currentOutput.push(evalRes.error);

        steps.push({
          lineNumber: lineNum,
          explanation: `❌ Runtime Error (${evalRes.error.split(':')[0]}) on Line ${lineNum}: ${evalRes.error}. Execution halted!`,
          variables: JSON.parse(JSON.stringify(currentVars)),
          variableTypes: { ...varTypes },
          changedVars: [],
          output: [...currentOutput],
          callStack: ['<main>'],
          isWaitingForInput: false,
          hasError: true,
          errorMessage: evalRes.error
        });

        return { codeLines, steps };
      }
      const appItem = evalRes.value;
      const vKey = varName.trim();
      if (Array.isArray(currentVars[vKey])) {
        currentVars[vKey].push(appItem);
        explanation = `Appended "${appItem}" to list "${vKey}".`;
        changedVars = [vKey];
      }
    } else if (line.startsWith('if ') || line.startsWith('elif ')) {
      explanation = `Evaluating conditional statement: ${line}. Python checks condition against memory state.`;
    } else if (line.startsWith('else:')) {
      explanation = `Executing else branch if prior conditions evaluated to False.`;
    } else if (line.startsWith('for ') || line.startsWith('while ')) {
      explanation = `Loop structure line: ${line}. Controls repeated execution flow.`;
    } else if (line.startsWith('def ')) {
      explanation = `Defined function in global scope: ${line}.`;
    }

    steps.push({
      lineNumber: lineNum,
      explanation,
      variables: JSON.parse(JSON.stringify(currentVars)),
      variableTypes: { ...varTypes },
      changedVars,
      output: [...currentOutput],
      callStack: ['<main>']
    });
  }

  if (steps.length === 0) {
    steps.push({
      lineNumber: 1,
      explanation: 'Empty program or code. Type code lines above to visualize execution!',
      variables: {},
      variableTypes: {},
      changedVars: [],
      output: [],
      callStack: ['<main>']
    });
  }

  return { codeLines, steps };
}

export const PythonVisualizer: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('variables-calc');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(true);
  const [customCodeInput, setCustomCodeInput] = useState<string>(
    `# Write your own Class 10 Python code with input()!

student_name = "Tashi"
math_marks = int(input("Enter Math Marks: "))
english_marks = int(input("Enter English Marks: "))

total = math_marks + english_marks
average = total / 2

print("Student:", student_name)
print("Total Marks:", total)
print("Average:", average)`
  );

  const [providedInputs, setProvidedInputs] = useState<Record<string, string>>({});
  const [activeConsoleInputValue, setActiveConsoleInputValue] = useState<string>('');
  const consoleInputRef = useRef<HTMLInputElement>(null);

  const initialParsed = parseCustomPythonCode(
    `student_name = "Tashi"\nmath_marks = int(input("Enter Math Marks: "))\nenglish_marks = int(input("Enter English Marks: "))\ntotal = math_marks + english_marks\naverage = total / 2\nprint("Student:", student_name)\nprint("Total Marks:", total)\nprint("Average:", average)`,
    {}
  );

  const [activeProgramCode, setActiveProgramCode] = useState<string[]>(initialParsed.codeLines);
  const [activeProgramSteps, setActiveProgramSteps] = useState<ExecutionStep[]>(initialParsed.steps);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wasAutoPlayActiveRef = useRef<boolean>(false);

  // Load preset selection
  const handleSelectPreset = (presetId: string) => {
    setIsCustomMode(false);
    setSelectedPresetId(presetId);
    setProvidedInputs({});
    setActiveConsoleInputValue('');
    const prog = PRESET_PROGRAMS.find((p) => p.id === presetId) || PRESET_PROGRAMS[0];
    setActiveProgramCode(prog.code);
    setActiveProgramSteps(prog.steps);
    setCurrentStepIndex(0);
    wasAutoPlayActiveRef.current = false;
    setIsPlaying(false);
  };

  // Parse and visualize custom code
  const handleVisualizeCustomCode = (inputsMap: Record<string, string> = {}) => {
    setProvidedInputs(inputsMap);
    setActiveConsoleInputValue('');
    const { codeLines, steps, pendingInputStepId } = parseCustomPythonCode(customCodeInput, inputsMap);
    setActiveProgramCode(codeLines);
    setActiveProgramSteps(steps);

    if (pendingInputStepId) {
      const pendingIdx = steps.findIndex((s) => s.inputStepId === pendingInputStepId);
      if (pendingIdx !== -1) {
        setCurrentStepIndex(pendingIdx);
      } else {
        setCurrentStepIndex(0);
      }
    } else {
      setCurrentStepIndex(0);
    }
    wasAutoPlayActiveRef.current = false;
    setIsPlaying(false);
  };

  const currentStep = activeProgramSteps[currentStepIndex] || activeProgramSteps[0];

  // Auto focus and auto-pause when a step requires input
  useEffect(() => {
    if (currentStep?.isWaitingForInput) {
      setIsPlaying(false);
      setTimeout(() => {
        if (consoleInputRef.current) {
          consoleInputRef.current.focus();
        }
      }, 100);
    }
  }, [currentStepIndex, currentStep?.isWaitingForInput]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep?.isWaitingForInput || currentStep?.hasError) {
        setIsPlaying(false);
        if (currentStep?.hasError) {
          wasAutoPlayActiveRef.current = false;
        }
        return;
      }

      timerRef.current = setTimeout(() => {
        if (currentStepIndex < activeProgramSteps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          wasAutoPlayActiveRef.current = false;
        }
      }, playbackSpeed);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, activeProgramSteps, playbackSpeed, currentStep?.isWaitingForInput, currentStep?.hasError]);

  const handleNextStep = () => {
    wasAutoPlayActiveRef.current = false;
    if (currentStepIndex < activeProgramSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    wasAutoPlayActiveRef.current = false;
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    wasAutoPlayActiveRef.current = false;
    setIsPlaying(false);
    setProvidedInputs({});
    setActiveConsoleInputValue('');
    if (isCustomMode) {
      const { codeLines, steps } = parseCustomPythonCode(customCodeInput, {});
      setActiveProgramCode(codeLines);
      setActiveProgramSteps(steps);
    }
    setCurrentStepIndex(0);
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      // If at start (step 0) or at the end of execution, start fresh with new inputs
      if (currentStepIndex === 0 || currentStepIndex >= activeProgramSteps.length - 1) {
        setProvidedInputs({});
        setActiveConsoleInputValue('');
        if (isCustomMode) {
          const { codeLines, steps } = parseCustomPythonCode(customCodeInput, {});
          setActiveProgramCode(codeLines);
          setActiveProgramSteps(steps);
        }
        setCurrentStepIndex(0);
      }
      wasAutoPlayActiveRef.current = true;
      setIsPlaying(true);
    } else {
      wasAutoPlayActiveRef.current = false;
      setIsPlaying(false);
    }
  };

  const handleSubmitInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentStep?.inputStepId || activeConsoleInputValue === '') return;

    const valToSubmit = activeConsoleInputValue;
    const newInputs = {
      ...providedInputs,
      [currentStep.inputStepId]: valToSubmit
    };
    setProvidedInputs(newInputs);
    setActiveConsoleInputValue('');

    const { codeLines, steps } = parseCustomPythonCode(customCodeInput, newInputs);
    setActiveProgramCode(codeLines);
    setActiveProgramSteps(steps);

    // Advance to next step after providing input
    const currentIdx = currentStepIndex;
    const nextIdx = currentIdx < steps.length - 1 ? currentIdx + 1 : currentIdx;
    setCurrentStepIndex(nextIdx);

    // If auto-play was active, automatically resume auto-play!
    if (wasAutoPlayActiveRef.current) {
      const nextStep = steps[nextIdx];
      if (nextStep && nextStep.hasError) {
        wasAutoPlayActiveRef.current = false;
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }
    }
  };

  const handleClearInputs = () => {
    wasAutoPlayActiveRef.current = false;
    setProvidedInputs({});
    setActiveConsoleInputValue('');
    const { codeLines, steps } = parseCustomPythonCode(customCodeInput, {});
    setActiveProgramCode(codeLines);
    setActiveProgramSteps(steps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Banner */}
      <div className="bg-[#1A1A1A] text-white p-6 rounded-3xl border-4 border-[#FFCC33] shadow-[8px_8px_0px_0px_#1A1A1A] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FFCC33] text-xs font-black uppercase tracking-widest mb-1">
            <Cpu className="w-4 h-4" />
            <span>Class 10 ICT Syllabus • Step-by-Step Code Execution Visualizer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-100 flex items-center gap-2">
            🐍 Python Code Execution Engine
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Watch how the Python interpreter executes code line-by-line, allocates RAM memory for variables, evaluates logic, and pauses for user input via <code className="text-[#FFCC33] bg-black/40 px-1 rounded">input()</code>.
          </p>
        </div>

        {/* Mode Toggle & Preset Dropdown */}
        <div className="w-full md:w-auto flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-[#2A2A2A] p-1.5 rounded-xl border border-gray-700">
            <button
              onClick={() => {
                setIsCustomMode(false);
                handleSelectPreset(selectedPresetId);
              }}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                !isCustomMode ? 'bg-[#FFCC33] text-slate-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              📚 Curriculum Topics
            </button>
            <button
              onClick={() => {
                setIsCustomMode(true);
                handleVisualizeCustomCode({});
              }}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                isCustomMode ? 'bg-[#FFCC33] text-slate-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>✏️ Custom Code</span>
            </button>
          </div>

          {!isCustomMode && (
            <div>
              <label className="text-[10px] uppercase font-bold text-amber-300 block mb-1">Select Topic Example:</label>
              <select
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="w-full bg-[#2A2A2A] text-amber-200 border-2 border-amber-500 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#FFCC33] cursor-pointer"
              >
                {PRESET_PROGRAMS.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Custom Code Input Section if in Custom Mode */}
      {isCustomMode && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border-4 border-[#1A1A1A] dark:border-slate-800 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-sm uppercase text-slate-900 dark:text-white">
                Write & Visualize Custom Python Code
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {Object.keys(providedInputs).length > 0 && (
                <button
                  onClick={handleClearInputs}
                  className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Clear Console Inputs
                </button>
              )}
              <button
                onClick={() => handleVisualizeCustomCode({})}
                className="bg-[#FFCC33] hover:bg-amber-300 text-slate-900 border-2 border-[#1A1A1A] px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A] active:scale-95 transition-transform"
              >
                <Zap className="w-4 h-4" />
                <span>Parse & Visualize Custom Code</span>
              </button>
            </div>
          </div>

          <textarea
            value={customCodeInput}
            onChange={(e) => setCustomCodeInput(e.target.value)}
            rows={8}
            className="w-full bg-[#1E1E1E] text-emerald-300 font-mono text-xs sm:text-sm p-4 rounded-2xl border-2 border-gray-700 focus:outline-none focus:border-[#FFCC33] leading-relaxed resize-y"
            placeholder="Type your Python code here..."
          />

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 font-medium">
            <span className="font-bold text-amber-600">Quick Code Templates:</span>
            <button
              onClick={() => {
                const newCode = `student_name = "Tashi"\nmath_marks = int(input("Enter Math Marks: "))\nenglish_marks = int(input("Enter English Marks: "))\ntotal = math_marks + english_marks\naverage = total / 2\nprint("Student:", student_name)\nprint("Total Marks:", total)\nprint("Average:", average)`;
                setCustomCodeInput(newCode);
                setProvidedInputs({});
                const parsed = parseCustomPythonCode(newCode, {});
                setActiveProgramCode(parsed.codeLines);
                setActiveProgramSteps(parsed.steps);
                setCurrentStepIndex(0);
              }}
              className="px-2.5 py-1 bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-200 rounded-lg border border-amber-300 hover:bg-amber-200 cursor-pointer font-bold"
            >
              ⌨️ Marks & Average (input())
            </button>
            <button
              onClick={() => {
                const newCode = `user_name = input("Enter your name: ")\nprint("Kuzuzangpo,", user_name)\nage = int(input("Enter your age: "))\nprint("Age next year will be:", age + 1)`;
                setCustomCodeInput(newCode);
                setProvidedInputs({});
                const parsed = parseCustomPythonCode(newCode, {});
                setActiveProgramCode(parsed.codeLines);
                setActiveProgramSteps(parsed.steps);
                setCurrentStepIndex(0);
              }}
              className="px-2.5 py-1 bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-200 rounded-lg border border-amber-300 hover:bg-amber-200 cursor-pointer font-bold"
            >
              👋 Interactive Greeting
            </button>
            <button
              onClick={() => {
                const newCode = `num1 = 25\nnum2 = 15\nsum_val = num1 + num2\nprint("Sum is:", sum_val)`;
                setCustomCodeInput(newCode);
                setProvidedInputs({});
                const parsed = parseCustomPythonCode(newCode, {});
                setActiveProgramCode(parsed.codeLines);
                setActiveProgramSteps(parsed.steps);
                setCurrentStepIndex(0);
              }}
              className="px-2.5 py-1 bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-200 rounded-lg border border-amber-300 hover:bg-amber-200 cursor-pointer font-bold"
            >
              Add 2 Static Numbers
            </button>
            <button
              onClick={() => {
                const newCode = `names = ["Passang", "Sonam", "Dechen"]\nnames.append("Kinley")\nprint("Names List:", names)`;
                setCustomCodeInput(newCode);
                setProvidedInputs({});
                const parsed = parseCustomPythonCode(newCode, {});
                setActiveProgramCode(parsed.codeLines);
                setActiveProgramSteps(parsed.steps);
                setCurrentStepIndex(0);
              }}
              className="px-2.5 py-1 bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-200 rounded-lg border border-amber-300 hover:bg-amber-200 cursor-pointer font-bold"
            >
              List Append
            </button>
          </div>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-[#1A1A1A] dark:border-slate-800 shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-amber-100 dark:bg-slate-800 hover:bg-amber-200 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-200 border-2 border-[#1A1A1A] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
            title="Reset and start fresh execution with new inputs"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Start (New Run)</span>
          </button>

          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className={`p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs flex items-center gap-1 transition-transform active:scale-95 ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer'
            }`}
            title="Step Backward"
          >
            <SkipBack className="w-4 h-4" />
            <span className="hidden sm:inline">Step Back</span>
          </button>

          <button
            onClick={handlePlayPause}
            className={`px-4 py-2.5 rounded-xl border-2 border-[#1A1A1A] font-black text-xs flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A] ${
              isPlaying ? 'bg-amber-400 text-slate-900' : 'bg-[#FFCC33] hover:bg-amber-300 text-slate-900'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            onClick={handleNextStep}
            disabled={currentStepIndex === activeProgramSteps.length - 1}
            className={`p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs flex items-center gap-1 transition-transform active:scale-95 ${
              currentStepIndex === activeProgramSteps.length - 1
                ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-emerald-200 hover:bg-emerald-300 text-emerald-950 cursor-pointer'
            }`}
            title="Step Forward"
          >
            <span className="hidden sm:inline">Step Forward</span>
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentStepIndex(activeProgramSteps.length - 1)}
            disabled={currentStepIndex === activeProgramSteps.length - 1}
            className={`p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs flex items-center gap-1 transition-transform active:scale-95 ${
              currentStepIndex === activeProgramSteps.length - 1
                ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-sky-100 hover:bg-sky-200 text-sky-900 cursor-pointer'
            }`}
            title="Jump to End"
          >
            <span className="hidden sm:inline">End</span>
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Counter & Speed */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-slate-700">
            Step <span className="text-amber-600 dark:text-amber-400 font-extrabold">{currentStepIndex + 1}</span> /{' '}
            {activeProgramSteps.length}
          </div>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-300 dark:border-slate-700">
            <span className="text-[10px] text-gray-500 uppercase px-1">Speed:</span>
            <button
              onClick={() => setPlaybackSpeed(1500)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black cursor-pointer ${
                playbackSpeed === 1500 ? 'bg-[#FFCC33] text-slate-900' : 'text-gray-500'
              }`}
            >
              0.5x
            </button>
            <button
              onClick={() => setPlaybackSpeed(1000)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black cursor-pointer ${
                playbackSpeed === 1000 ? 'bg-[#FFCC33] text-slate-900' : 'text-gray-500'
              }`}
            >
              1.0x
            </button>
            <button
              onClick={() => setPlaybackSpeed(500)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black cursor-pointer ${
                playbackSpeed === 500 ? 'bg-[#FFCC33] text-slate-900' : 'text-gray-500'
              }`}
            >
              2.0x
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Code Editor on Left, Memory & Stack on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Editor & Explanation */}
        <div className="lg:col-span-7 space-y-4">
          {/* Code Viewer Panel */}
          <div className="bg-[#1E1E1E] text-gray-100 rounded-3xl border-4 border-[#1A1A1A] overflow-hidden shadow-[6px_6px_0px_0px_#1A1A1A]">
            <div className="bg-[#2D2D2D] px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs font-mono font-bold text-gray-300 ml-2">script.py</span>
              </div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {isCustomMode ? 'Custom User Program' : PRESET_PROGRAMS.find((p) => p.id === selectedPresetId)?.chapter}
              </span>
            </div>

            {/* Code Lines */}
            <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto">
              {activeProgramCode.map((lineText, idx) => {
                const lineNumber = idx + 1;
                const isCurrentLine = currentStep.lineNumber === lineNumber;
                const isErrorLine = isCurrentLine && currentStep.hasError;

                return (
                  <div
                    key={idx}
                    className={`flex items-center px-2 py-1 rounded-lg transition-all ${
                      isErrorLine
                        ? 'bg-red-500/30 text-red-200 border-l-4 border-red-500 font-bold pl-3'
                        : isCurrentLine
                        ? 'bg-amber-500/30 text-amber-200 border-l-4 border-[#FFCC33] font-bold pl-3'
                        : 'hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    {/* Line Pointer Indicator */}
                    <div className="w-8 shrink-0 text-right pr-3 text-gray-500 font-bold select-none text-xs">
                      {isErrorLine ? (
                        <span className="text-red-400 animate-pulse flex items-center justify-end gap-1 font-black">
                          ❌ {lineNumber}
                        </span>
                      ) : isCurrentLine ? (
                        <span className="text-[#FFCC33] animate-pulse flex items-center justify-end gap-1">
                          👉 {lineNumber}
                        </span>
                      ) : (
                        lineNumber
                      )}
                    </div>

                    {/* Code Text */}
                    <div className="flex-1 whitespace-pre">
                      {lineText.startsWith('#') ? (
                        <span className="text-emerald-400 italic">{lineText}</span>
                      ) : lineText.includes('def ') || lineText.includes('return ') ? (
                        <span className="text-purple-300">{lineText}</span>
                      ) : lineText.includes('if ') || lineText.includes('else:') || lineText.includes('for ') ? (
                        <span className="text-amber-300">{lineText}</span>
                      ) : lineText.includes('print(') ? (
                        <span className="text-sky-300">{lineText}</span>
                      ) : lineText.includes('input(') ? (
                        <span className="text-[#FFCC33] font-bold">{lineText}</span>
                      ) : (
                        lineText
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Line Execution Explanation Card */}
          <div
            className={`p-5 rounded-3xl border-2 shadow-sm flex items-start gap-3 transition-colors ${
              currentStep.hasError
                ? 'bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-800'
                : 'bg-amber-50 dark:bg-slate-800 border-amber-300 dark:border-slate-700'
            }`}
          >
            <div
              className={`p-2 rounded-xl font-black shrink-0 mt-0.5 ${
                currentStep.hasError ? 'bg-red-500 text-white' : 'bg-amber-400 text-slate-900'
              }`}
            >
              {currentStep.hasError ? <AlertCircle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            </div>
            <div>
              <h4
                className={`text-xs font-black uppercase tracking-wider ${
                  currentStep.hasError ? 'text-red-700 dark:text-red-400' : 'text-amber-900 dark:text-amber-300'
                }`}
              >
                {currentStep.hasError ? 'Python Runtime Error' : `Step ${currentStepIndex + 1} Action Explanation`}{' '}
                (Line {currentStep.lineNumber})
              </h4>
              <p
                className={`text-xs sm:text-sm mt-1 leading-relaxed font-medium ${
                  currentStep.hasError ? 'text-red-900 dark:text-red-200' : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                {currentStep.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Memory Stack & Console Output */}
        <div className="lg:col-span-5 space-y-4">
          {/* Variables Memory Panel */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border-4 border-[#1A1A1A] dark:border-slate-800 shadow-[6px_6px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm uppercase tracking-wide text-slate-900 dark:text-white">
                  RAM Memory (Variables State)
                </h3>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                {Object.keys(currentStep.variables).length} active
              </span>
            </div>

            {Object.keys(currentStep.variables).length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs italic">
                Memory is currently empty. Step forward to assign variables!
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {Object.entries(currentStep.variables).map(([varName, val]) => {
                  const isChanged = currentStep.changedVars.includes(varName);
                  const varType = currentStep.variableTypes[varName] || typeof val;

                  return (
                    <div
                      key={varName}
                      className={`p-3 rounded-2xl border-2 transition-all ${
                        isChanged
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-[#FFCC33] scale-[1.01]'
                          : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-extrabold text-slate-900 dark:text-amber-200">{varName}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold uppercase">
                            {varType}
                          </span>
                        </div>
                        {isChanged && (
                          <span className="bg-amber-500 text-slate-900 text-[9px] font-black uppercase px-1.5 py-0.2 rounded">
                            Updated!
                          </span>
                        )}
                      </div>

                      <div className="mt-1 font-mono text-xs text-amber-800 dark:text-amber-300 font-black break-all">
                        {Array.isArray(val) ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {val.map((item, i) => (
                              <span
                                key={i}
                                className="bg-white dark:bg-slate-900 border border-amber-400 px-2 py-0.5 rounded-lg text-[11px]"
                              >
                                [{i}]: "{item}"
                              </span>
                            ))}
                          </div>
                        ) : typeof val === 'object' ? (
                          JSON.stringify(val)
                        ) : (
                          String(val)
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Terminal Standard Output */}
          <div className="bg-[#0D0D0D] text-emerald-400 rounded-3xl border-4 border-[#1A1A1A] p-4 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800 text-xs font-mono text-gray-400 font-bold">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Standard Output (Console)</span>
              </div>
              {Object.keys(providedInputs).length > 0 && (
                <button
                  onClick={handleClearInputs}
                  className="text-[10px] text-amber-400 hover:underline font-bold cursor-pointer"
                >
                  Clear Inputs & Restart
                </button>
              )}
            </div>

            <div className="font-mono text-xs space-y-1.5 min-h-24 max-h-48 overflow-y-auto">
              {currentStep.output.length === 0 ? (
                <span className="text-gray-600 italic">[ Standard output is empty ]</span>
              ) : (
                currentStep.output.map((line, idx) => {
                  const isTraceback =
                    line.startsWith('Traceback') ||
                    line.startsWith('  File') ||
                    line.includes('Error:') ||
                    line.includes('ValueError') ||
                    line.includes('TypeError') ||
                    line.includes('ZeroDivisionError');

                  return (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-gray-600 select-none">&gt;</span>
                      <span className={isTraceback ? 'text-red-400 font-bold font-mono' : 'text-emerald-300 font-bold font-mono'}>
                        {line}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Interactive Input Form in Console when program is paused for input */}
            {currentStep.isWaitingForInput && (
              <form onSubmit={handleSubmitInput} className="pt-3 border-t border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 p-2 rounded-xl text-xs font-bold">
                  <span className="animate-ping w-2 h-2 rounded-full bg-amber-400" />
                  <span>
                    ⏸️ Program paused on line {currentStep.lineNumber}. Waiting for input{' '}
                    {currentStep.inputVarName ? `for variable "${currentStep.inputVarName}"` : ''}:
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#FFCC33] font-mono font-black text-sm select-none">&gt;</span>
                  <input
                    ref={consoleInputRef}
                    type="text"
                    value={activeConsoleInputValue}
                    onChange={(e) => setActiveConsoleInputValue(e.target.value)}
                    placeholder={
                      currentStep.inputPromptText
                        ? `Type value for ${currentStep.inputPromptText}...`
                        : `Type input value here and press Enter...`
                    }
                    className="flex-1 bg-[#1A1A1A] text-amber-200 font-mono text-xs p-2.5 rounded-xl border-2 border-[#FFCC33] focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="bg-[#FFCC33] hover:bg-amber-300 text-slate-900 px-3.5 py-2.5 rounded-xl font-black text-xs cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A] active:scale-95 transition-transform"
                  >
                    Submit ↵
                  </button>
                </div>
              </form>
            )}

            {/* Completion / Error Banner with Re-run Button */}
            {currentStepIndex === activeProgramSteps.length - 1 && !currentStep.isWaitingForInput && (
              <div className="pt-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-2">
                {currentStep.hasError ? (
                  <span className="text-red-400 font-mono text-xs font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Program execution halted on error!</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Program execution finished!</span>
                  </span>
                )}
                <button
                  onClick={handleReset}
                  className="bg-[#FFCC33] hover:bg-amber-300 text-slate-900 px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Run Again (New Inputs)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
