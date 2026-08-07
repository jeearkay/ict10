import { useEffect, useState } from 'react';
import { QuestModule, QuestLevel, PythonPreset, ExcelTemplate, FlowchartTemplate, FlowchartNode } from '../types';
import { SYLLABUS_MODULES } from '../data/syllabus';
import { EXPLICIT_QUESTIONS, InteractiveQuestion, getQuestionsForLevel } from '../data/predefinedQuestions';
import { DEFAULT_TRIVIA_QUESTIONS, TriviaQuestion } from '../data/triviaData';
import { HOMEWORK_SHEETS, HomeworkSheet } from '../data/homeworkData';
import { DEFAULT_MOCK_EXAM_QUESTIONS, DEFAULT_TRACING_PROBLEMS, ExamPrepQuestion, TracingProblem } from '../data/examData';
import { ICT_GLOSSARY_TERMS, ICTGlossaryTerm } from './ictGlossary';
import { randomizeQuestions } from './questionRandomizer';
import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const SYLLABUS_STORAGE_KEY = 'guna_custom_syllabus_modules';
const QUESTIONS_STORAGE_KEY = 'guna_custom_explicit_questions';
const TRIVIA_STORAGE_KEY = 'guna_custom_trivia_questions';
const HOMEWORK_STORAGE_KEY = 'guna_custom_homework_sheets';
const EXAM_QUESTIONS_STORAGE_KEY = 'guna_custom_exam_questions';
const TRACING_PROBLEMS_STORAGE_KEY = 'guna_custom_tracing_problems';
const GLOSSARY_STORAGE_KEY = 'guna_custom_glossary_terms';
const PYTHON_PRESETS_STORAGE_KEY = 'guna_custom_python_presets';
const EXCEL_TEMPLATES_STORAGE_KEY = 'guna_custom_excel_templates';
const FLOWCHARTS_STORAGE_KEY = 'guna_custom_flowcharts';

export const DEFAULT_PYTHON_PRESETS: PythonPreset[] = [
  {
    id: 'preset-cypress',
    title: '1. Cypress Tree Pattern',
    status: 'published',
    code: `# Exercise 1: Cypress tree pattern using print()
print("     *     ")
print("    ***    ")
print("   ******* ")
print("  *********")
print("     |||   ")
print("     |||   ")
print("    /   \\  ")
print("|||||||||||")`
  },
  {
    id: 'preset-area',
    title: '2. Area of Circle & Input',
    status: 'published',
    code: `# Exercise 3: Area of Circle with radius
import math

radius_str = input("Enter radius in meters: ")
radius = float(radius_str)
pi = math.pi

area = pi * (radius ** 2)
circumference = 2 * pi * radius

print(f"Radius: {radius}m")
print(f"Area of Circle: {area:.2f} sq.m")
print(f"Circumference: {circumference:.2f}m")`
  },
  {
    id: 'preset-leap',
    title: '3. Leap Year & If-Else',
    status: 'published',
    code: `# Example 5: Check Leap Year in Bhutan
year = 2028

if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print(f"Year {year} is a LEAP YEAR! 🐉")
else:
    print(f"Year {year} is not a leap year.")`
  },
  {
    id: 'preset-dishes',
    title: '4. Bhutanese Dishes & List Loops',
    status: 'published',
    code: `# Example 2 & 3: Bhutanese Menu Traversal
dishes = ["Ema Datshi", "Jasha Maroo", "Phaksha Paa", "Kewa Datshi"]

print("----- Karma Academy Canteen Menu -----")
for index, dish in enumerate(dishes, start=1):
    print(f"Dish {index}: {dish}")

print("\\nDishes count:", len(dishes))`
  },
  {
    id: 'preset-biodata',
    title: '5. Dictionary Biodata',
    status: 'published',
    code: `# Example 6: Student Biodata Dictionary
student = {
    "name": "Pema Dorji",
    "class": "X-A",
    "age": 16,
    "school": "Karma Academy",
    "subjects": ["English", "Dzongkha", "ICT", "Maths"]
}

print(f"Student Name: {student.get('name')}")
print(f"First Subject: {student['subjects'][0]}")
print("Keys present:", list(student.keys()))`
  },
  {
    id: 'preset-factorial',
    title: '6. Recursive Factorial Function',
    status: 'published',
    code: `# Example 4: Recursive Factorial
def factorial(n):
    if n == 0 or n == 1:  # Base Case
        return 1
    else:  # Recursive Case
        return n * factorial(n - 1)


number = 5
result = factorial(number)
print(f"The factorial of {number}! is: {result}")`
  }
];

export const DEFAULT_EXCEL_TEMPLATES: ExcelTemplate[] = [
  {
    id: 'stationery',
    name: 'Stationery Store & Sales Invoice',
    subtitle: 'Page 35, 38, 39: Relative (=C2*D2) & Absolute Reference ($F$2 Tax)',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    rows: [1, 2, 3, 4, 5, 6, 7, 8],
    defaultChart: 'column',
    status: 'published',
    cells: {
      A1: 'SL', B1: 'Item Name', C1: 'Price (Nu)', D1: 'Qty', E1: 'Subtotal', F1: 'Tax Rate', G1: 'Total Cost',
      A2: '1', B2: 'Pen', C2: '30', D2: '2', E2: '=C2*D2', F2: '0.07', G2: '=E2*(1+$F$2)',
      A3: '2', B3: 'Pencil', C3: '5', D3: '3', E3: '=C3*D3', F3: '', G3: '=E3*(1+$F$2)',
      A4: '3', B4: 'Ruler', C4: '40', D4: '2', E4: '=C4*D4', F4: '', G4: '=E4*(1+$F$2)',
      A5: '4', B5: 'Sharpener', C5: '20', D5: '1', E5: '=C5*D5', F5: '', G5: '=E5*(1+$F$2)',
      A6: '5', B6: 'Notebook', C6: '70', D6: '2', E6: '=C6*D6', F6: '', G6: '=E6*(1+$F$2)',
      A7: 'Total', B7: '', C7: '=SUM(C2:C6)', D7: '=SUM(D2:D6)', E7: '=SUM(E2:E6)', F7: '', G7: '=SUM(G2:G6)',
      A8: 'Average', B8: '', C8: '=AVERAGE(C2:C6)', D8: '=AVERAGE(D2:D6)', E8: '', F8: '', G8: '=AVERAGE(G2:G6)'
    }
  },
  {
    id: 'marksheet',
    name: 'Class 10 Examination Marksheet & Rank Analysis',
    subtitle: 'Page 37, 44, 46: SUM, AVERAGE, IF, RANK, MAX, MIN & COUNTIF',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    rows: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    defaultChart: 'bar',
    status: 'published',
    cells: {
      A1: 'Roll', B1: 'Student Name', C1: 'English', D1: 'Dzongkha', E1: 'Math', F1: 'ICT', G1: 'Total', H1: 'Percentage', I1: 'Result', J1: 'Rank',
      A2: '101', B2: 'Tenzin Norbu', C2: '85', D2: '78', E2: '92', F2: '95', G2: '=SUM(C2:F2)', H2: '=AVERAGE(C2:F2)', I2: '=IF(H2>=40, "PASS", "FAIL")', J2: '=RANK(G2, G2:G6)',
      A3: '102', B3: 'Pema Dechen', C3: '62', D3: '70', E3: '58', F3: '80', G3: '=SUM(C3:F3)', H3: '=AVERAGE(C3:F3)', I3: '=IF(H3>=40, "PASS", "FAIL")', J3: '=RANK(G3, G2:G6)',
      A4: '103', B4: 'Dorji Gyeltshen', C4: '35', D4: '38', E4: '32', F4: '39', G4: '=SUM(C4:F4)', H4: '=AVERAGE(C4:F4)', I4: '=IF(H4>=40, "PASS", "FAIL")', J4: '=RANK(G4, G2:G6)',
      A5: '104', B5: 'Sonam Choden', C5: '90', D5: '88', E5: '95', F5: '98', G5: '=SUM(C5:F5)', H5: '=AVERAGE(C5:F5)', I5: '=IF(H5>=40, "PASS", "FAIL")', J5: '=RANK(G5, G2:G6)',
      A6: '105', B6: 'Karma Wangdi', C6: '75', D6: '82', E6: '68', F6: '88', G6: '=SUM(C6:F6)', H6: '=AVERAGE(C6:F6)', I6: '=IF(H6>=40, "PASS", "FAIL")', J6: '=RANK(G6, G2:G6)',
      A7: 'Class High', B7: '', C7: '=MAX(C2:C6)', D7: '=MAX(D2:D6)', E7: '=MAX(E2:E6)', F7: '=MAX(F2:F6)', G7: '', H7: '', I7: '', J7: '',
      A8: 'Class Low', B8: '', C8: '=MIN(C2:C6)', D8: '=MIN(D2:D6)', E8: '=MIN(E2:E6)', F8: '=MIN(F2:F6)', G8: '', H8: '', I8: '', J8: '',
      A9: 'Passed Count', B9: '', C9: '=COUNTIF(C2:C6, ">=40")', D9: '=COUNTIF(D2:D6, ">=40")', E9: '=COUNTIF(E2:E6, ">=40")', F9: '=COUNTIF(F2:F6, ">=40")', G9: '', H9: '', I9: '', J9: ''
    }
  },
  {
    id: 'commission',
    name: 'Sales Outlets & Commission Calculator',
    subtitle: 'Page 44-45: IF Condition with Absolute Reference ($G$6)',
    cols: ['A', 'B', 'C', 'D', 'E'],
    rows: [1, 2, 3, 4, 5, 6, 7],
    defaultChart: 'column',
    status: 'published',
    cells: {
      A1: 'Sales Outlet', B1: 'Sales (Nu)', C1: 'Target (Nu)', D1: 'Comm Rate', E1: 'Commission (Nu)',
      A2: 'Thimphu Main', B2: '30000', C2: '20000', D2: '=IF(B2>=C2, "30%", "1%")', E2: '=IF(B2>=C2, B2*0.3, B2*0.01)',
      A3: 'Paro Branch', B3: '19999', C3: '20000', D3: '=IF(B3>=C3, "30%", "1%")', E3: '=IF(B3>=C3, B3*0.3, B3*0.01)',
      A4: 'Punakha Hub', B4: '25000', C4: '20000', D4: '=IF(B4>=C4, "30%", "1%")', E4: '=IF(B4>=C4, B4*0.3, B4*0.01)',
      A5: 'Phuntsholing', B5: '33300', C5: '20000', D5: '=IF(B5>=C5, "30%", "1%")', E5: '=IF(B5>=C5, B5*0.3, B5*0.01)',
      A6: 'Total Sales', B6: '=SUM(B2:B5)', C6: '', D6: 'Total Comm', E6: '=SUM(E2:E5)',
      A7: 'Qualified Count', B7: '=COUNTIF(B2:B5, ">=20000")', C7: '', D7: 'High Comm Count', E7: '=COUNTIFS(B2:B5, ">=25000", E2:E5, ">=7000")'
    }
  },
  {
    id: 'master_functions',
    name: 'Master Excel Functions Showcase (All 22 Functions)',
    subtitle: 'Interactive Testing Ground for Every Function in Class 10 Syllabus',
    cols: ['A', 'B', 'C', 'D'],
    rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    defaultChart: 'line',
    status: 'published',
    cells: {
      A1: 'Function', B1: 'Input Data / Parameters', C1: 'Excel Formula', D1: 'Evaluated Result',
      A2: 'SUM', B2: '10, 20, 30', C2: '=SUM(10, 20, 30)', D2: '=SUM(10, 20, 30)',
      A3: 'AVERAGE', B3: '10, 20, 30', C3: '=AVERAGE(10, 20, 30)', D3: '=AVERAGE(10, 20, 30)',
      A4: 'MIN', B4: '5, 12, 100', C4: '=MIN(5, 12, 100)', D4: '=MIN(5, 12, 100)',
      A5: 'MAX', B5: '5, 12, 100', C5: '=MAX(5, 12, 100)', D5: '=MAX(5, 12, 100)',
      A6: 'COUNT', B6: '1, 2, "Pen", 4', C6: '=COUNT(1, 2, 4)', D6: '=COUNT(1, 2, 4)',
      A7: 'COUNTA', B7: 'A1:D6 Filled Cells', C7: '=COUNTA(A1:D6)', D7: '=COUNTA(A1:D6)',
      A8: 'MEDIAN', B8: '10, 20, 30, 40, 50', C8: '=MEDIAN(10, 20, 30, 40, 50)', D8: '=MEDIAN(10, 20, 30, 40, 50)',
      A9: 'MODE', B9: '2, 3, 2, 1, 2', C9: '=MODE(2, 3, 2, 1, 2)', D9: '=MODE(2, 3, 2, 1, 2)',
      A10: 'RANK', B10: 'Rank 80 in [50, 80, 90]', C10: '=RANK(80, B2:B6)', D10: '=RANK(80, B2:B6)',
      A11: 'IF', B11: 'Condition 10 > 5', C11: '=IF(10>5, "Pass", "Fail")', D11: '=IF(10>5, "Pass", "Fail")',
      A12: 'AND', B12: '10>5 AND 20>10', C12: '=AND(10>5, 20>10)', D12: '=AND(10>5, 20>10)',
      A13: 'OR', B13: '10>5 OR 5>100', C13: '=OR(10>5, 5>100)', D13: '=OR(10>5, 5>100)',
      A14: 'NOT', B14: 'Invert 5 > 10', C14: '=NOT(5>10)', D14: '=NOT(5>10)',
      A15: 'LOWER', B15: '"BHUTAN ICT"', C15: '=LOWER("BHUTAN ICT")', D15: '=LOWER("BHUTAN ICT")',
      A16: 'UPPER', B16: '"karma academy"', C16: '=UPPER("karma academy")', D16: '=UPPER("karma academy")',
      A17: 'CONCATENATE', B17: '"Bhutan" + " " + "2026"', C17: '=CONCATENATE("Bhutan", " ", "2026")', D17: '=CONCATENATE("Bhutan", " ", "2026")',
      A18: 'DATE', B18: 'Year 2026, Month 7, Day 28', C18: '=DATE(2026, 7, 28)', D18: '=DATE(2026, 7, 28)',
      A19: 'TODAY', B19: 'System Date', C19: '=TODAY()', D19: '=TODAY()',
      A20: 'NOW', B20: 'System Timestamp', C20: '=NOW()', D20: '=NOW()',
      A21: 'VLOOKUP', B21: 'Find Roll 101 Name', C21: '=VLOOKUP(101, A2:B6, 2, FALSE)', D21: '=VLOOKUP(101, A2:B6, 2, FALSE)'
    }
  }
];

export const DEFAULT_FLOWCHARTS: FlowchartTemplate[] = [
  {
    id: 'bhutan_voting',
    title: '1. Bhutanese Voting Eligibility Checker (Nested Decision)',
    description: 'Check Nationality (Bhutanese?) -> If Yes, check Age (>= 18?) -> Output Eligibility',
    category: 'BCSEA Exam Standard',
    status: 'published',
    explanation: 'This flowchart demonstrates nested decision-making with explicit Yes/No flow arrows. First, the program verifies if the citizen is Bhutanese in a diamond decision. If NO: prints "Sorry, only Bhutanese are eligible to vote" and ends. If YES: proceeds to input age and evaluates a second decision "Age >= 18?". If YES: prints "You are eligible to vote". If NO: prints "You are not eligible to vote".',
    mermaidCode: `graph TD
    Start([Start]) --> InputNat[/Enter nationality/]
    InputNat --> IsBhutanese{Is Bhutanese?}
    IsBhutanese -- No --> OutNoNat[/Print: Sorry, only Bhutanese are eligible/] --> EndNo([End])
    IsBhutanese -- Yes --> InputAge[/Enter age/]
    InputAge --> IsAdult{Age >= 18?}
    IsAdult -- No --> OutNoAge[/Print: You are not eligible to vote/] --> EndAge([End])
    IsAdult -- Yes --> OutYesAge[/Print: You are eligible to vote 🗳️/] --> EndYes([End])
    
    style IsBhutanese fill:#FEF3C7,stroke:#D97706,stroke-width:3px
    style IsAdult fill:#FEF3C7,stroke:#D97706,stroke-width:3px
    style Start fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px
    style EndNo fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px
    style EndAge fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px
    style EndYes fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px`,
    nodes: [
      { id: '1', type: 'start', text: 'Start' },
      { id: '2', type: 'input', text: 'Enter your nationality', variableName: 'nationality' },
      { 
        id: '3', 
        type: 'decision', 
        text: 'Is Bhutanese?', 
        condition: 'nationality == "Bhutanese"',
        trueOutcome: 'Proceeds to enter age & check voting eligibility',
        falseOutcome: 'Prints "Sorry, only Bhutanese are eligible to vote" -> End'
      },
      { id: '4', type: 'output', text: 'Print "Sorry, only Bhutanese are eligible to vote"' },
      { id: '5', type: 'input', text: 'Enter your age', variableName: 'age' },
      { 
        id: '6', 
        type: 'decision', 
        text: 'Age >= 18?', 
        condition: 'age >= 18',
        trueOutcome: 'Prints "You are eligible to vote" 🗳️',
        falseOutcome: 'Prints "You are not eligible to vote"'
      },
      { id: '7', type: 'output', text: 'Print "You are not eligible to vote"' },
      { id: '8', type: 'output', text: 'Print "You are eligible to vote"' },
      { id: '9', type: 'end', text: 'End' },
    ],
    pythonCode: `# BCSEA Exam Algorithm: Bhutanese Voting Eligibility Checker
nationality = input("Enter your nationality: ").strip()

if nationality.lower() == "bhutanese":
    age = int(input("Enter your age: "))
    if age >= 18:
        print("You are eligible to vote")
    else:
        print("You are not eligible to vote")
else:
    print("Sorry, only Bhutanese are eligible to vote")`,
    evaluateTrace: (valStr) => {
      const parts = valStr.split(',').map(s => s.trim());
      const nat = parts[0] || 'Bhutanese';
      const age = parseInt(parts[1]) || 19;
      const isBhutanese = nat.toLowerCase() === 'bhutanese';
      const logs = [
        `🚀 Starting Bhutanese Voting Eligibility Flowchart...`,
        `🟢 Step [Start]: Algorithm initiated.`,
        `📥 Step [Input]: Entered nationality = "${nat}"`,
        `❓ Diamond [Is Bhutanese?]: Evaluated -> ${isBhutanese ? 'YES / TRUE' : 'NO / FALSE'}`
      ];
      if (!isBhutanese) {
        logs.push(`❌ [NO / FALSE Flow]: Since nationality is not Bhutanese, flow jumps via No branch to Output: "Sorry, only Bhutanese are eligible to vote" -> END.`);
      } else {
        logs.push(`✅ [YES / TRUE Flow]: Nationality is Bhutanese! Proceeding via Yes branch to enter age.`);
        logs.push(`📥 Step [Input]: Entered age = ${age}`);
        logs.push(`❓ Diamond [Age >= 18?]: Evaluated -> ${age >= 18 ? 'YES / TRUE' : 'NO / FALSE'}`);
        if (age >= 18) {
          logs.push(`✅ [YES / TRUE Flow]: Output via Yes branch -> Print "You are eligible to vote" 🗳️ -> END.`);
        } else {
          logs.push(`❌ [NO / FALSE Flow]: Output via No branch -> Print "You are not eligible to vote" -> END.`);
        }
      }
      return logs;
    }
  },
  {
    id: 'smallest_two',
    title: '2. Find Smallest of Two Numbers (If-Else Decision)',
    description: 'Input num1, num2 -> Check num1 < num2 -> Output Smallest with Yes/No branches',
    category: 'BCSEA Exam Standard',
    status: 'published',
    explanation: 'Compares two numbers with clear conditional decision branches. The diamond decision checks "IF NUM 1 < NUM 2". If YES (True), the right branch flows to print num 1. If NO (False), the left branch flows to print num 2.',
    mermaidCode: `graph TD
    Start([START]) --> In1[/INPUT num1/]
    In1 --> In2[/INPUT num2/]
    In2 --> Cond{num1 < num2?}
    Cond -- Yes --> Out1[/PRINT Smallest is num1/] --> Stop([STOP])
    Cond -- No --> Out2[/PRINT Smallest is num2/] --> Stop
    
    style Cond fill:#FEF3C7,stroke:#D97706,stroke-width:3px
    style Start fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px
    style Stop fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px`,
    nodes: [
      { id: '1', type: 'start', text: 'START' },
      { id: '2', type: 'input', text: 'INPUT VALUE OF NUM 1', variableName: 'num1' },
      { id: '3', type: 'input', text: 'INPUT VALUE OF NUM 2', variableName: 'num2' },
      { 
        id: '4', 
        type: 'decision', 
        text: 'IF NUM 1 < NUM 2', 
        condition: 'num1 < num2',
        trueOutcome: 'Takes RIGHT branch -> PRINT SMALLEST IS NUM 1',
        falseOutcome: 'Takes LEFT branch -> PRINT SMALLEST IS NUM 2'
      },
      { id: '5', type: 'output', text: 'PRINT SMALLEST IS NUM 2' },
      { id: '6', type: 'output', text: 'PRINT SMALLEST IS NUM 1' },
      { id: '7', type: 'end', text: 'STOP' },
    ],
    pythonCode: `# BCSEA Exam Algorithm: Find Smallest of Two Numbers
num1 = float(input("Input value of num 1: "))
num2 = float(input("Input value of num 2: "))

if num1 < num2:
    print("Smallest is num 1")
else:
    print("Smallest is num 2")`,
    evaluateTrace: (valStr) => {
      const parts = valStr.split(',').map(s => parseFloat(s.trim()) || 0);
      const n1 = parts[0] ?? 25;
      const n2 = parts[1] ?? 10;
      const isSmaller = n1 < n2;
      return [
        `🚀 Starting Smallest Number Flowchart...`,
        `🟢 Step [START]: Algorithm initiated.`,
        `📥 Step [Input]: NUM 1 = ${n1}, NUM 2 = ${n2}`,
        `❓ Diamond [IF NUM 1 < NUM 2?]: ${isSmaller ? 'YES / TRUE' : 'NO / FALSE'}`,
        isSmaller ? `✅ [YES / TRUE Branch]: Flow routes right -> PRINT SMALLEST IS NUM 1 (${n1}) -> STOP` : `❌ [NO / FALSE Branch]: Flow routes left -> PRINT SMALLEST IS NUM 2 (${n2}) -> STOP`
      ];
    }
  },
  {
    id: 'multiplication_table',
    title: '3. Multiplication Sequence Generator (While Loop)',
    description: 'Output first 9 multiples of a given multiplier with a dynamic tracing sequence',
    category: 'BCSEA Exam Standard',
    status: 'published',
    explanation: 'A structured loop flowchart utilizing a counter variable `i` incremented on each cycle. The diamond decision `i <= 9` acts as the loop condition, guiding flow back to the start of the loop.',
    mermaidCode: `graph TD
    Start([Start]) --> InputVal[/Read multiplier N/]
    InputVal --> InitVar[i = 1]
    InitVar --> CheckCond{i <= 9?}
    CheckCond -- Yes --> CalcVal[2xi = 2 * i] --> PrintVal[/Print 2 x i = result/] --> IncVar[i = i + 1] --> CheckCond
    CheckCond -- No --> End([End])
    
    style CheckCond fill:#FEF3C7,stroke:#D97706,stroke-width:3px
    style Start fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px
    style End fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px`,
    nodes: [
      { id: '1', type: 'start', text: 'Start' },
      { id: '2', type: 'input', text: 'Print "Enter n"\nRead N', variableName: 'n' },
      { id: '3', type: 'process', text: 'i = 1' },
      { 
        id: '4', 
        type: 'decision', 
        text: 'If i <= 9', 
        condition: 'i <= 9',
        trueOutcome: 'YES Flow: Compute 2xi = 2 * i, increment i, and loop back',
        falseOutcome: 'NO Flow: Exit loop and proceed to End'
      },
      { id: '5', type: 'process', text: '2xi = 2 * i' },
      { id: '6', type: 'process', text: 'i = i + 1' },
      { id: '7', type: 'end', text: 'End' },
    ],
    pythonCode: `# BCSEA Exam Algorithm: Multiplication Loop
n = int(input("Enter n: "))
i = 1

while i <= 9:
    ans = 2 * i
    print(f"2 x {i} = {ans}")
    i = i + 1

print("End of multiplication sequence")`,
    evaluateTrace: (valStr) => {
      const n = parseInt(valStr) || 5;
      const logs = [
        `🚀 Starting Multiplication Loop Flowchart...`,
        `🟢 Step [Start]: Initialized.`,
        `📥 Step [Input]: Read N = ${n}`,
        `⚙️ Process: i = 1`
      ];
      for (let i = 1; i <= 9; i++) {
        logs.push(`❓ Diamond [If i <= 9]: i = ${i} -> YES / TRUE (Loops back to calculate 2xi = 2 * ${i})`);
      }
      logs.push(`❓ Diamond [If i <= 9]: i = 10 -> NO / FALSE (Exits loop via No branch to End)`);
      logs.push(`🔴 Step [End]: Program completed.`);
      return logs;
    }
  },
  {
    id: 'stream_selection',
    title: '4. Higher Secondary Stream Selection (Multi-Condition)',
    description: 'Check Maths & Science marks against multiple decision branches',
    category: 'BCSEA Exam Standard',
    status: 'published',
    explanation: 'A multi-branched decision flowchart with nested diamond conditions. First checks `Maths >= 40 and Science >= 40`. If NO, routes to "Not eligible". If YES, checks further science and arts thresholds with explicit Yes/No connector lines.',
    mermaidCode: `graph TD
    Start([Start]) --> InMarks[/Enter Maths & Science/]
    InMarks --> Cond1{Maths >= 40 and Science >= 40?}
    Cond1 -- No --> OutNone[/Print: Not eligible for any stream/] --> End([End])
    Cond1 -- Yes --> Cond2{Maths >= 50 and Science >= 50?}
    Cond2 -- Yes --> OutAll[/Print: Science, Commerce or Arts/] --> End
    Cond2 -- No --> Cond3{Maths >= 50?}
    Cond3 -- Yes --> OutComm[/Print: Commerce or Arts/] --> End
    Cond3 -- No --> OutArts[/Print: Eligible for Arts/] --> End
    
    style Cond1 fill:#FEF3C7,stroke:#D97706,stroke-width:3px
    style Cond2 fill:#FEF3C7,stroke:#D97706,stroke-width:3px
    style Cond3 fill:#FEF3C7,stroke:#D97706,stroke-width:3px
    style Start fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px
    style End fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px`,
    nodes: [
      { id: '1', type: 'start', text: 'Start' },
      { id: '2', type: 'input', text: 'Enter Maths marks\nEnter Science Marks', variableName: 'maths, science' },
      { 
        id: '3', 
        type: 'decision', 
        text: 'Maths >= 40 and Science >= 40?', 
        condition: 'maths >= 40 and science >= 40',
        trueOutcome: 'YES: Proceeds to check Science & Commerce eligibility',
        falseOutcome: 'NO: Print "Not eligible for any stream" -> End'
      },
      { id: '4', type: 'output', text: 'Print "Not eligible for any stream"' },
      { 
        id: '5', 
        type: 'decision', 
        text: 'Maths >= 50 and Science >= 50?', 
        condition: 'maths >= 50 and science >= 50',
        trueOutcome: 'YES: Eligible for Science, Commerce or Arts Stream',
        falseOutcome: 'NO: Checks Maths >= 50'
      },
      { id: '6', type: 'output', text: 'Print "Eligible for Science, Commerce or Arts Stream"' },
      { 
        id: '7', 
        type: 'decision', 
        text: 'Maths >= 50?', 
        condition: 'maths >= 50',
        trueOutcome: 'YES: Eligible for Commerce or Arts',
        falseOutcome: 'NO: Eligible for Arts'
      },
      { id: '8', type: 'output', text: 'Print "Eligible for Commerce or Arts"' },
      { id: '9', type: 'output', text: 'Print "Eligible for Arts"' },
      { id: '10', type: 'end', text: 'End' },
    ],
    pythonCode: `# BCSEA Exam Algorithm: Stream Selection
maths = float(input("Enter Maths marks: "))
science = float(input("Enter Science marks: "))

if maths >= 40 and science >= 40:
    if maths >= 50 and science >= 50:
        print("Eligible for Science, Commerce or Arts Stream")
    elif maths >= 50:
        print("Eligible for Commerce or Arts")
    else:
        print("Eligible for Arts")
else:
    print("Not eligible for any stream")`,
    evaluateTrace: (valStr) => {
      const parts = valStr.split(',').map(s => parseFloat(s.trim()) || 0);
      const m = parts[0] ?? 65;
      const s = parts[1] ?? 60;
      const logs = [
        `🚀 Starting Stream Selection Trace...`,
        `🟢 Step [Start]: Initialized.`,
        `📥 Step [Input]: Maths = ${m}, Science = ${s}`,
        `❓ Diamond [Maths >= 40 and Science >= 40?]: ${m >= 40 && s >= 40 ? 'YES / TRUE' : 'NO / FALSE'}`
      ];
      if (!(m >= 40 && s >= 40)) {
        logs.push(`❌ [NO Flow]: Print "Not eligible for any stream" via No branch -> END`);
      } else {
        logs.push(`✅ [YES Flow]: Checked higher cutoffs.`);
        if (m >= 50 && s >= 50) {
          logs.push(`✅ [YES Flow]: Print "Eligible for Science, Commerce or Arts Stream" -> END`);
        } else if (m >= 50) {
          logs.push(`✅ [YES Flow]: Print "Eligible for Commerce or Arts" -> END`);
        } else {
          logs.push(`❌ [NO Flow]: Print "Eligible for Arts" -> END`);
        }
      }
      return logs;
    }
  },
  {
    id: 'nested_star_loop',
    title: '5. Nested Loop Star Pattern Generator',
    description: 'Row loop nested with Column loop printing stars with explicit loop branches',
    category: 'BCSEA Exam Standard',
    status: 'published',
    explanation: 'Advanced nested loop algorithm with decision diamonds for both outer row and inner column loops. Explicit Yes/No arrows control row continuation and star printing.',
    mermaidCode: `graph TD
    Start([Start]) --> InitRow[row = 1]
    InitRow --> CheckRow{row <= 5?}
    CheckRow -- Yes --> InitCol[col = 1]
    InitCol --> CheckCol{col <= row?}
    CheckCol -- Yes --> PrintStar[Print '*'] --> IncCol[col = col + 1] --> CheckCol
    CheckCol -- No --> PrintNL[Print newline] --> IncRow[row = row + 1] --> CheckRow
    CheckRow -- No --> Stop([Stop])
    
    style CheckRow fill:#FEF3C7,stroke:#D97706,stroke-width:3px
    style CheckCol fill:#FEF3C7,stroke:#D97706,stroke-width:3px
    style Start fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px
    style Stop fill:#FFCC33,stroke:#1A1A1A,stroke-width:3px`,
    nodes: [
      { id: '1', type: 'start', text: 'Start' },
      { id: '2', type: 'process', text: 'row = 1' },
      { 
        id: '3', 
        type: 'decision', 
        text: 'while row <= 5', 
        condition: 'row <= 5',
        trueOutcome: 'YES: Enter inner column loop',
        falseOutcome: 'NO: Stop algorithm'
      },
      { id: '4', type: 'process', text: 'Col = 1' },
      { 
        id: '5', 
        type: 'decision', 
        text: 'while col <= row', 
        condition: 'col <= row',
        trueOutcome: 'YES: Print "*"',
        falseOutcome: 'NO: Print newline & increment row'
      },
      { id: '6', type: 'output', text: 'Print "*"' },
      { id: '7', type: 'process', text: 'col = col + 1' },
      { id: '8', type: 'output', text: 'print newline' },
      { id: '9', type: 'process', text: 'row = row + 1' },
      { id: '10', type: 'end', text: 'Stop' },
    ],
    pythonCode: `# BCSEA Exam Algorithm: Nested Loop Star Pattern
row = 1
while row <= 5:
    col = 1
    line = ""
    while col <= row:
        line += "*"
        col = col + 1
    print(line)
    row = row + 1`,
    evaluateTrace: (valStr) => {
      return [
        `🚀 Starting Nested Star Loop Trace...`,
        `🟢 Step [Start]: Initialized nested loop.`,
        `⚙️ row = 1 -> Diamond [row <= 5?]: YES (Enters loop)`,
        `⚙️ Col = 1 -> Diamond [col <= row?]: YES -> Print "*"`,
        `⚙️ row = 2 -> Prints "**"`,
        `⚙️ row = 3 -> Prints "***"`,
        `⚙️ row = 4 -> Prints "****"`,
        `⚙️ row = 5 -> Prints "*****"`,
        `❌ Diamond [row <= 5?]: row = 6 -> NO (Exits via No branch to Stop)`,
        `🔴 Step [Stop]: Star pattern completed.`
      ];
    }
  }
];


// Subscriber listeners for live UI reactivity
type ContentChangeListener = () => void;
const listeners: Set<ContentChangeListener> = new Set();

export function subscribeToContentChanges(listener: ContentChangeListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyContentChanged() {
  listeners.forEach((fn) => fn());
}

export function useContentRefresh(): number {
  const [contentVersion, setContentVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToContentChanges(() => {
      setContentVersion((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  return contentVersion;
}

// ==========================================
// 1. SYLLABUS MODULES (Chapters & Level Topics)
// ==========================================
export function getMergedSyllabusModules(): QuestModule[] {
  if (typeof window === 'undefined') return SYLLABUS_MODULES;
  try {
    const raw = localStorage.getItem(SYLLABUS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse custom syllabus modules from localStorage:', e);
  }
  return SYLLABUS_MODULES;
}

export function getStudentSyllabusModules(): QuestModule[] {
  const modules = getMergedSyllabusModules();
  return modules
    .filter((m) => m.status !== 'draft')
    .map((m) => ({
      ...m,
      levels: (m.levels || []).filter((l) => l.status !== 'draft'),
    }));
}

export function saveSyllabusModules(modules: QuestModule[], snapshotLabel?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(modules));
    recordCMSVersionSnapshot('syllabus', snapshotLabel || 'Updated syllabus modules & topics', modules);
    notifyContentChanged();

    if (db) {
      const docRef = doc(db, 'app_content', 'syllabus');
      setDoc(docRef, { modules, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore syllabus sync notice:', err?.message || err);
      });
    }
  } catch (e) {
    console.error('Failed to save custom syllabus modules:', e);
  }
}

export function resetSyllabusModulesToDefault(): void {
  if (typeof window === 'undefined') return;
  recordCMSVersionSnapshot('syllabus', 'Reset syllabus modules to default baseline', SYLLABUS_MODULES);
  localStorage.removeItem(SYLLABUS_STORAGE_KEY);
  notifyContentChanged();
  if (db) {
    const docRef = doc(db, 'app_content', 'syllabus');
    setDoc(docRef, { modules: SYLLABUS_MODULES, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
  }
}

// ==========================================
// 2. EXPLICIT LEVEL PRACTICE QUESTIONS
// ==========================================
export function getMergedQuestionsMap(): Record<string, InteractiveQuestion[]> {
  if (typeof window === 'undefined') return EXPLICIT_QUESTIONS;
  try {
    const raw = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...EXPLICIT_QUESTIONS, ...parsed };
      }
    }
  } catch (e) {
    console.error('Failed to parse custom questions from localStorage:', e);
  }
  return EXPLICIT_QUESTIONS;
}

export function getStudentQuestionsMap(): Record<string, InteractiveQuestion[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse student questions from localStorage:', e);
  }
  return {};
}

export function getStudentQuestionsForLevel(
  levelId: string,
  levelData?: QuestLevel,
  randomize: boolean = true
): InteractiveQuestion[] {
  const allQ = getMergedQuestionsForLevel(levelId, levelData, false);
  const published = allQ.filter((q) => q.status !== 'draft');
  return randomize ? randomizeQuestions(published) : published;
}

export function getMergedQuestionsForLevel(
  levelId: string,
  levelData?: QuestLevel,
  randomize: boolean = true
): InteractiveQuestion[] {
  const map = getMergedQuestionsMap();
  let questions: InteractiveQuestion[] = [];
  if (map[levelId] && map[levelId].length > 0) {
    questions = map[levelId];
  } else if (EXPLICIT_QUESTIONS[levelId] && EXPLICIT_QUESTIONS[levelId].length > 0) {
    questions = EXPLICIT_QUESTIONS[levelId];
  } else {
    questions = getQuestionsForLevel(levelId, levelData);
  }
  return randomize ? randomizeQuestions(questions) : questions;
}

export function saveQuestionsForLevel(levelId: string, questions: InteractiveQuestion[], snapshotLabel?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const currentMap = getStudentQuestionsMap();
    const updatedMap = {
      ...currentMap,
      [levelId]: questions,
    };
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updatedMap));
    recordCMSVersionSnapshot('questions', snapshotLabel || `Updated practice questions for level ${levelId}`, updatedMap);
    notifyContentChanged();

    if (db) {
      const docRef = doc(db, 'app_content', 'questions');
      setDoc(docRef, { questionsMap: updatedMap, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore questions sync notice:', err?.message || err);
      });
    }
  } catch (e) {
    console.error('Failed to save questions for level:', e);
  }
}

export function resetQuestionsToDefault(): void {
  if (typeof window === 'undefined') return;
  recordCMSVersionSnapshot('questions', 'Reset level practice questions map to default baseline', EXPLICIT_QUESTIONS);
  localStorage.removeItem(QUESTIONS_STORAGE_KEY);
  notifyContentChanged();
  if (db) {
    const docRef = doc(db, 'app_content', 'questions');
    setDoc(docRef, { questionsMap: EXPLICIT_QUESTIONS, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
  }
}

// ==========================================
// 3. BHUTAN TECH TRIVIA
// ==========================================
export function getMergedTriviaQuestions(): TriviaQuestion[] {
  if (typeof window === 'undefined') return DEFAULT_TRIVIA_QUESTIONS;
  try {
    const raw = localStorage.getItem(TRIVIA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse trivia questions from localStorage:', e);
  }
  return DEFAULT_TRIVIA_QUESTIONS;
}

export function saveTriviaQuestions(questions: TriviaQuestion[], snapshotLabel?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRIVIA_STORAGE_KEY, JSON.stringify(questions));
    recordCMSVersionSnapshot('trivia', snapshotLabel || 'Updated Bhutan tech trivia questions', questions);
    notifyContentChanged();

    if (db) {
      const docRef = doc(db, 'app_content', 'trivia');
      setDoc(docRef, { questions, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore trivia sync notice:', err?.message || err);
      });
    }
  } catch (e) {
    console.error('Failed to save trivia questions:', e);
  }
}

export function resetTriviaQuestionsToDefault(): void {
  if (typeof window === 'undefined') return;
  recordCMSVersionSnapshot('trivia', 'Reset Bhutan tech trivia to default baseline', DEFAULT_TRIVIA_QUESTIONS);
  localStorage.removeItem(TRIVIA_STORAGE_KEY);
  notifyContentChanged();
  if (db) {
    const docRef = doc(db, 'app_content', 'trivia');
    setDoc(docRef, { questions: DEFAULT_TRIVIA_QUESTIONS, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
  }
}

// ==========================================
// 4. HOMEWORK PORTAL / QUEST SHEETS
// ==========================================
export function getMergedHomeworkSheets(): HomeworkSheet[] {
  if (typeof window === 'undefined') return HOMEWORK_SHEETS;
  try {
    const raw = localStorage.getItem(HOMEWORK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse homework sheets from localStorage:', e);
  }
  return HOMEWORK_SHEETS;
}

export function saveHomeworkSheets(sheets: HomeworkSheet[], snapshotLabel?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(sheets));
    recordCMSVersionSnapshot('homework', snapshotLabel || 'Updated homework quest sheets', sheets);
    notifyContentChanged();

    if (db) {
      const docRef = doc(db, 'app_content', 'homework');
      setDoc(docRef, { sheets, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore homework sheets sync notice:', err?.message || err);
      });
    }
  } catch (e) {
    console.error('Failed to save homework sheets:', e);
  }
}

export function resetHomeworkSheetsToDefault(): void {
  if (typeof window === 'undefined') return;
  recordCMSVersionSnapshot('homework', 'Reset homework quest sheets to default baseline', HOMEWORK_SHEETS);
  localStorage.removeItem(HOMEWORK_STORAGE_KEY);
  notifyContentChanged();
  if (db) {
    const docRef = doc(db, 'app_content', 'homework');
    setDoc(docRef, { sheets: HOMEWORK_SHEETS, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
  }
}

// ==========================================
// 5. BCSEA BOARD EXAM PREP & TRACING PROBLEMS
// ==========================================
export function getMergedExamQuestions(): ExamPrepQuestion[] {
  if (typeof window === 'undefined') return DEFAULT_MOCK_EXAM_QUESTIONS;
  try {
    const raw = localStorage.getItem(EXAM_QUESTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse exam questions from localStorage:', e);
  }
  return DEFAULT_MOCK_EXAM_QUESTIONS;
}

export function saveExamQuestions(questions: ExamPrepQuestion[], snapshotLabel?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EXAM_QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    recordCMSVersionSnapshot('examprep', snapshotLabel || 'Updated BCSEA exam prep questions', questions);
    notifyContentChanged();

    if (db) {
      const docRef = doc(db, 'app_content', 'examprep');
      setDoc(docRef, { questions, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore exam questions sync notice:', err?.message || err);
      });
    }
  } catch (e) {
    console.error('Failed to save exam questions:', e);
  }
}

export function getMergedTracingProblems(): TracingProblem[] {
  if (typeof window === 'undefined') return DEFAULT_TRACING_PROBLEMS;
  try {
    const raw = localStorage.getItem(TRACING_PROBLEMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse tracing problems from localStorage:', e);
  }
  return DEFAULT_TRACING_PROBLEMS;
}

export function saveTracingProblems(problems: TracingProblem[], snapshotLabel?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRACING_PROBLEMS_STORAGE_KEY, JSON.stringify(problems));
    recordCMSVersionSnapshot('tracing', snapshotLabel || 'Updated code tracing problems', problems);
    notifyContentChanged();

    if (db) {
      const docRef = doc(db, 'app_content', 'examprep_tracing');
      setDoc(docRef, { problems, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore tracing problems sync notice:', err?.message || err);
      });
    }
  } catch (e) {
    console.error('Failed to save tracing problems:', e);
  }
}

export function resetExamPrepToDefault(): void {
  if (typeof window === 'undefined') return;
  recordCMSVersionSnapshot('examprep', 'Reset exam prep questions to default baseline', DEFAULT_MOCK_EXAM_QUESTIONS);
  recordCMSVersionSnapshot('tracing', 'Reset code tracing problems to default baseline', DEFAULT_TRACING_PROBLEMS);
  localStorage.removeItem(EXAM_QUESTIONS_STORAGE_KEY);
  localStorage.removeItem(TRACING_PROBLEMS_STORAGE_KEY);
  notifyContentChanged();
  if (db) {
    const docRef = doc(db, 'app_content', 'examprep');
    setDoc(docRef, { questions: DEFAULT_MOCK_EXAM_QUESTIONS, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    const docRef2 = doc(db, 'app_content', 'examprep_tracing');
    setDoc(docRef2, { problems: DEFAULT_TRACING_PROBLEMS, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
  }
}

// ==========================================
// 6. ICT GLOSSARY TERMS
// ==========================================
export function getMergedGlossaryTerms(): ICTGlossaryTerm[] {
  if (typeof window === 'undefined') return ICT_GLOSSARY_TERMS;
  try {
    const raw = localStorage.getItem(GLOSSARY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse glossary terms from localStorage:', e);
  }
  return ICT_GLOSSARY_TERMS;
}

export function saveGlossaryTerms(terms: ICTGlossaryTerm[], snapshotLabel?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GLOSSARY_STORAGE_KEY, JSON.stringify(terms));
    recordCMSVersionSnapshot('glossary', snapshotLabel || 'Updated ICT glossary terms', terms);
    notifyContentChanged();

    if (db) {
      const docRef = doc(db, 'app_content', 'glossary');
      setDoc(docRef, { terms, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore glossary terms sync notice:', err?.message || err);
      });
    }
  } catch (e) {
    console.error('Failed to save glossary terms:', e);
  }
}

export function resetGlossaryTermsToDefault(): void {
  if (typeof window === 'undefined') return;
  recordCMSVersionSnapshot('glossary', 'Reset ICT glossary terms to default baseline', ICT_GLOSSARY_TERMS);
  localStorage.removeItem(GLOSSARY_STORAGE_KEY);
  notifyContentChanged();
  if (db) {
    const docRef = doc(db, 'app_content', 'glossary');
    setDoc(docRef, { terms: ICT_GLOSSARY_TERMS, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
  }
}

// ==========================================
// 7. PYTHON IDE PRESETS
// ==========================================
export function getMergedPythonPresets(): PythonPreset[] {
  if (typeof window === 'undefined') return DEFAULT_PYTHON_PRESETS;
  try {
    const raw = localStorage.getItem(PYTHON_PRESETS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse python presets from localStorage:', e);
  }
  return DEFAULT_PYTHON_PRESETS;
}

export function savePythonPresets(presets: PythonPreset[], snapshotLabel?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PYTHON_PRESETS_STORAGE_KEY, JSON.stringify(presets));
    recordCMSVersionSnapshot('python_presets', snapshotLabel || 'Updated Python IDE presets', presets);
    notifyContentChanged();

    if (db) {
      const docRef = doc(db, 'app_content', 'python_presets');
      setDoc(docRef, { presets, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore python presets sync notice:', err?.message || err);
      });
    }
  } catch (e) {
    console.error('Failed to save python presets:', e);
  }
}

export function resetPythonPresetsToDefault(): void {
  if (typeof window === 'undefined') return;
  recordCMSVersionSnapshot('python_presets', 'Reset Python presets to default baseline', DEFAULT_PYTHON_PRESETS);
  localStorage.removeItem(PYTHON_PRESETS_STORAGE_KEY);
  notifyContentChanged();
  if (db) {
    const docRef = doc(db, 'app_content', 'python_presets');
    setDoc(docRef, { presets: DEFAULT_PYTHON_PRESETS, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
  }
}

// ==========================================
// 8. EXCEL LAB TEMPLATES
// ==========================================
export function getMergedExcelTemplates(): ExcelTemplate[] {
  if (typeof window === 'undefined') return DEFAULT_EXCEL_TEMPLATES;
  try {
    const raw = localStorage.getItem(EXCEL_TEMPLATES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse excel templates from localStorage:', e);
  }
  return DEFAULT_EXCEL_TEMPLATES;
}

export function saveExcelTemplates(templates: ExcelTemplate[], snapshotLabel?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EXCEL_TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    recordCMSVersionSnapshot('excel_templates', snapshotLabel || 'Updated Excel templates', templates);
    notifyContentChanged();

    if (db) {
      const docRef = doc(db, 'app_content', 'excel_templates');
      setDoc(docRef, { templates, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore excel templates sync notice:', err?.message || err);
      });
    }
  } catch (e) {
    console.error('Failed to save excel templates:', e);
  }
}

export function resetExcelTemplatesToDefault(): void {
  if (typeof window === 'undefined') return;
  recordCMSVersionSnapshot('excel_templates', 'Reset Excel templates to default baseline', DEFAULT_EXCEL_TEMPLATES);
  localStorage.removeItem(EXCEL_TEMPLATES_STORAGE_KEY);
  notifyContentChanged();
  if (db) {
    const docRef = doc(db, 'app_content', 'excel_templates');
    setDoc(docRef, { templates: DEFAULT_EXCEL_TEMPLATES, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
  }
}

// ==========================================
// 9. FLOWCHART LAB TEMPLATES
// ==========================================
export function getMergedFlowcharts(): FlowchartTemplate[] {
  if (typeof window === 'undefined') return DEFAULT_FLOWCHARTS;
  try {
    const raw = localStorage.getItem(FLOWCHARTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Re-inject the original static evaluateTrace functions for default presets if missing after JSON parse
        return parsed.map((item) => {
          const matchedDefault = DEFAULT_FLOWCHARTS.find((def) => def.id === item.id);
          if (matchedDefault && matchedDefault.evaluateTrace) {
            return { ...item, evaluateTrace: matchedDefault.evaluateTrace };
          }
          return item;
        });
      }
    }
  } catch (e) {
    console.error('Failed to parse flowchart templates from localStorage:', e);
  }
  return DEFAULT_FLOWCHARTS;
}

export function saveFlowcharts(templates: FlowchartTemplate[], snapshotLabel?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FLOWCHARTS_STORAGE_KEY, JSON.stringify(templates));
    recordCMSVersionSnapshot('flowcharts', snapshotLabel || 'Updated Flowchart templates', templates);
    notifyContentChanged();

    if (db) {
      const docRef = doc(db, 'app_content', 'flowcharts');
      setDoc(docRef, { templates, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore flowcharts sync notice:', err?.message || err);
      });
    }
  } catch (e) {
    console.error('Failed to save flowchart templates:', e);
  }
}

export function resetFlowchartsToDefault(): void {
  if (typeof window === 'undefined') return;
  recordCMSVersionSnapshot('flowcharts', 'Reset Flowchart templates to default baseline', DEFAULT_FLOWCHARTS);
  localStorage.removeItem(FLOWCHARTS_STORAGE_KEY);
  notifyContentChanged();
  if (db) {
    const docRef = doc(db, 'app_content', 'flowcharts');
    setDoc(docRef, { templates: DEFAULT_FLOWCHARTS, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
  }
}

// ==========================================
// STUDENT FILTERED CONTENT GETTERS (Only Published)
// ==========================================
export function getStudentTriviaQuestions(): TriviaQuestion[] {
  return getMergedTriviaQuestions().filter((t) => t.status !== 'draft');
}

export function getStudentHomeworkSheets(): HomeworkSheet[] {
  return getMergedHomeworkSheets().filter((s) => s.status !== 'draft');
}

export function getStudentExamQuestions(): ExamPrepQuestion[] {
  return getMergedExamQuestions().filter((q) => q.status !== 'draft');
}

export function getStudentTracingProblems(): TracingProblem[] {
  return getMergedTracingProblems().filter((p) => p.status !== 'draft');
}

export function getStudentGlossaryTerms(): ICTGlossaryTerm[] {
  return getMergedGlossaryTerms().filter((t) => t.status !== 'draft');
}

export function getStudentPythonPresets(): PythonPreset[] {
  return getMergedPythonPresets().filter((p) => p.status !== 'draft');
}

export function getStudentExcelTemplates(): ExcelTemplate[] {
  return getMergedExcelTemplates().filter((t) => t.status !== 'draft');
}

export function getStudentFlowcharts(): FlowchartTemplate[] {
  return getMergedFlowcharts().filter((f) => f.status !== 'draft');
}


// ==========================================
// REMOTE FIRESTORE LOAD & SNAPSHOT LISTENERS
// ==========================================
async function loadRemoteContentOnce(): Promise<void> {
  if (!db || typeof window === 'undefined') return;

  const loaders = [
    { key: SYLLABUS_STORAGE_KEY, docPath: 'syllabus', field: 'modules' },
    { key: QUESTIONS_STORAGE_KEY, docPath: 'questions', field: 'questionsMap' },
    { key: TRIVIA_STORAGE_KEY, docPath: 'trivia', field: 'questions' },
    { key: HOMEWORK_STORAGE_KEY, docPath: 'homework', field: 'sheets' },
    { key: EXAM_QUESTIONS_STORAGE_KEY, docPath: 'examprep', field: 'questions' },
    { key: TRACING_PROBLEMS_STORAGE_KEY, docPath: 'examprep_tracing', field: 'problems' },
    { key: GLOSSARY_STORAGE_KEY, docPath: 'glossary', field: 'terms' },
    { key: PYTHON_PRESETS_STORAGE_KEY, docPath: 'python_presets', field: 'presets' },
    { key: EXCEL_TEMPLATES_STORAGE_KEY, docPath: 'excel_templates', field: 'templates' },
    { key: FLOWCHARTS_STORAGE_KEY, docPath: 'flowcharts', field: 'templates' },
  ];

  for (const item of loaders) {
    try {
      const docRef = doc(db, 'app_content', item.docPath);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && data[item.field]) {
          localStorage.setItem(item.key, JSON.stringify(data[item.field]));
        }
      }
    } catch (e) {
      console.warn(`Failed to load remote ${item.docPath} content once:`, e);
    }
  }
  notifyContentChanged();
}

export function initContentSyncListeners(): void {
  if (!db) return;
  try {
    loadRemoteContentOnce().catch((err) => {
      console.warn('Failed to load remote content on startup:', err);
    });

    const collectionsToListen = [
      { key: SYLLABUS_STORAGE_KEY, docPath: 'syllabus', field: 'modules' },
      { key: QUESTIONS_STORAGE_KEY, docPath: 'questions', field: 'questionsMap' },
      { key: TRIVIA_STORAGE_KEY, docPath: 'trivia', field: 'questions' },
      { key: HOMEWORK_STORAGE_KEY, docPath: 'homework', field: 'sheets' },
      { key: EXAM_QUESTIONS_STORAGE_KEY, docPath: 'examprep', field: 'questions' },
      { key: TRACING_PROBLEMS_STORAGE_KEY, docPath: 'examprep_tracing', field: 'problems' },
      { key: GLOSSARY_STORAGE_KEY, docPath: 'glossary', field: 'terms' },
      { key: PYTHON_PRESETS_STORAGE_KEY, docPath: 'python_presets', field: 'presets' },
      { key: EXCEL_TEMPLATES_STORAGE_KEY, docPath: 'excel_templates', field: 'templates' },
      { key: FLOWCHARTS_STORAGE_KEY, docPath: 'flowcharts', field: 'templates' },
    ];

    collectionsToListen.forEach((col) => {
      const docRef = doc(db!, 'app_content', col.docPath);
      onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data && data[col.field]) {
              localStorage.setItem(col.key, JSON.stringify(data[col.field]));
              notifyContentChanged();
            }
          }
        },
        (err) => {
          console.warn(`Snapshot listener notice for ${col.docPath}:`, err);
        }
      );
    });
  } catch (e) {
    console.warn('Could not initialize cloud content snapshot listeners:', e);
  }
}

// ==========================================
// 7. CMS VERSION HISTORY ENGINE
// ==========================================
export type CMSContentType = 'syllabus' | 'questions' | 'homework' | 'trivia' | 'examprep' | 'tracing' | 'glossary' | 'python_presets' | 'excel_templates' | 'flowcharts';

export interface CMSVersionEntry {
  id: string;
  timestamp: string; // ISO string
  contentType: CMSContentType;
  label: string;
  author: string;
  itemCount: number;
  data: any; // snapshot payload
}

const HISTORY_STORAGE_KEY = 'guna_cms_version_history';

function getItemCount(contentType: CMSContentType, data: any): number {
  if (!data) return 0;
  if (Array.isArray(data)) return data.length;
  if (typeof data === 'object' && data !== null) {
    if (contentType === 'questions') {
      return Object.values(data).reduce<number>((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
    }
    return Object.keys(data).length;
  }
  return 1;
}

export function getCMSVersionHistory(contentType?: CMSContentType | 'all'): CMSVersionEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    let history: CMSVersionEntry[] = raw ? JSON.parse(raw) : [];

    // Seed baseline initial versions if empty
    if (!history || history.length === 0) {
      history = seedInitialCMSHistory();
    }

    if (!contentType || contentType === 'all') {
      return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    return history
      .filter((h) => h.contentType === contentType)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (e) {
    console.error('Failed to parse CMS version history:', e);
    return [];
  }
}

function seedInitialCMSHistory(): CMSVersionEntry[] {
  const now = new Date().toISOString();
  const initialEntries: CMSVersionEntry[] = [
    {
      id: 'v-init-syllabus',
      timestamp: now,
      contentType: 'syllabus',
      label: 'Baseline Initial Syllabus & Chapter Topics',
      author: 'System (Default)',
      itemCount: SYLLABUS_MODULES.length,
      data: SYLLABUS_MODULES
    },
    {
      id: 'v-init-questions',
      timestamp: now,
      contentType: 'questions',
      label: 'Baseline Initial Practice Questions Map',
      author: 'System (Default)',
      itemCount: getItemCount('questions', EXPLICIT_QUESTIONS),
      data: EXPLICIT_QUESTIONS
    },
    {
      id: 'v-init-homework',
      timestamp: now,
      contentType: 'homework',
      label: 'Baseline Initial Homework Quest Sheets',
      author: 'System (Default)',
      itemCount: HOMEWORK_SHEETS.length,
      data: HOMEWORK_SHEETS
    },
    {
      id: 'v-init-trivia',
      timestamp: now,
      contentType: 'trivia',
      label: 'Baseline Initial Tech Trivia Bank',
      author: 'System (Default)',
      itemCount: DEFAULT_TRIVIA_QUESTIONS.length,
      data: DEFAULT_TRIVIA_QUESTIONS
    },
    {
      id: 'v-init-examprep',
      timestamp: now,
      contentType: 'examprep',
      label: 'Baseline Initial BCSEA Exam Prep Questions',
      author: 'System (Default)',
      itemCount: DEFAULT_MOCK_EXAM_QUESTIONS.length,
      data: DEFAULT_MOCK_EXAM_QUESTIONS
    },
    {
      id: 'v-init-tracing',
      timestamp: now,
      contentType: 'tracing',
      label: 'Baseline Initial Code Tracing Challenges',
      author: 'System (Default)',
      itemCount: DEFAULT_TRACING_PROBLEMS.length,
      data: DEFAULT_TRACING_PROBLEMS
    },
    {
      id: 'v-init-glossary',
      timestamp: now,
      contentType: 'glossary',
      label: 'Baseline Initial ICT Glossary Terms',
      author: 'System (Default)',
      itemCount: ICT_GLOSSARY_TERMS.length,
      data: ICT_GLOSSARY_TERMS
    },
    {
      id: 'v-init-python-presets',
      timestamp: now,
      contentType: 'python_presets',
      label: 'Baseline Initial Python IDE Presets',
      author: 'System (Default)',
      itemCount: DEFAULT_PYTHON_PRESETS.length,
      data: DEFAULT_PYTHON_PRESETS
    },
    {
      id: 'v-init-excel-templates',
      timestamp: now,
      contentType: 'excel_templates',
      label: 'Baseline Initial Excel Lab Templates',
      author: 'System (Default)',
      itemCount: DEFAULT_EXCEL_TEMPLATES.length,
      data: DEFAULT_EXCEL_TEMPLATES
    },
    {
      id: 'v-init-flowcharts',
      timestamp: now,
      contentType: 'flowcharts',
      label: 'Baseline Initial Flowchart Templates',
      author: 'System (Default)',
      itemCount: DEFAULT_FLOWCHARTS.length,
      data: DEFAULT_FLOWCHARTS
    }
  ];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(initialEntries));
    } catch (e) {
      console.error('Failed to save initial CMS history:', e);
    }
  }
  return initialEntries;
}

export function recordCMSVersionSnapshot(
  contentType: CMSContentType,
  label: string,
  data: any,
  author = 'Teacher (CMS Admin)'
): CMSVersionEntry {
  if (typeof window === 'undefined') {
    return {
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString(),
      contentType,
      label,
      author,
      itemCount: getItemCount(contentType, data),
      data
    };
  }

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    let history: CMSVersionEntry[] = raw ? JSON.parse(raw) : seedInitialCMSHistory();

    const newEntry: CMSVersionEntry = {
      id: `v-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      contentType,
      label,
      author,
      itemCount: getItemCount(contentType, data),
      data: JSON.parse(JSON.stringify(data))
    };

    history = [newEntry, ...history];

    if (history.length > 80) {
      history = history.slice(0, 80);
    }

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));

    if (db) {
      const docRef = doc(db, 'app_content_history', newEntry.id);
      setDoc(docRef, newEntry).catch((err) => {
        console.warn('Firestore version history sync notice:', err?.message || err);
      });
    }

    return newEntry;
  } catch (e) {
    console.error('Failed to record CMS version snapshot:', e);
    return {
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString(),
      contentType,
      label,
      author,
      itemCount: getItemCount(contentType, data),
      data
    };
  }
}

function getCurrentStateForContentType(contentType: CMSContentType): any {
  switch (contentType) {
    case 'syllabus':
      return getMergedSyllabusModules();
    case 'questions':
      return getStudentQuestionsMap();
    case 'homework':
      return getMergedHomeworkSheets();
    case 'trivia':
      return getMergedTriviaQuestions();
    case 'examprep':
      return getMergedExamQuestions();
    case 'tracing':
      return getMergedTracingProblems();
    case 'glossary':
      return getMergedGlossaryTerms();
    case 'python_presets':
      return getMergedPythonPresets();
    case 'excel_templates':
      return getMergedExcelTemplates();
    case 'flowcharts':
      return getMergedFlowcharts();
    default:
      return null;
  }
}

export function revertToCMSVersion(versionId: string): { success: boolean; label: string; contentType: CMSContentType } {
  if (typeof window === 'undefined') return { success: false, label: 'Window not available', contentType: 'syllabus' };

  try {
    const history = getCMSVersionHistory('all');
    const target = history.find((item) => item.id === versionId);

    if (!target) {
      return { success: false, label: 'Version ID not found in history', contentType: 'syllabus' };
    }

    // Auto-backup current state before restoring
    const currentState = getCurrentStateForContentType(target.contentType);
    if (currentState) {
      recordCMSVersionSnapshot(
        target.contentType,
        `Auto-backup before restoring ${target.id.slice(0, 12)} (${target.label})`,
        currentState,
        'System (Auto-Backup)'
      );
    }

    switch (target.contentType) {
      case 'syllabus':
        localStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(target.data));
        if (db) {
          const docRef = doc(db, 'app_content', 'syllabus');
          setDoc(docRef, { modules: target.data, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
        }
        break;

      case 'questions':
        localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(target.data));
        if (db) {
          const docRef = doc(db, 'app_content', 'questions');
          setDoc(docRef, { questionsMap: target.data, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
        }
        break;

      case 'homework':
        localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(target.data));
        if (db) {
          const docRef = doc(db, 'app_content', 'homework');
          setDoc(docRef, { sheets: target.data, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
        }
        break;

      case 'trivia':
        localStorage.setItem(TRIVIA_STORAGE_KEY, JSON.stringify(target.data));
        if (db) {
          const docRef = doc(db, 'app_content', 'trivia');
          setDoc(docRef, { questions: target.data, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
        }
        break;

      case 'examprep':
        localStorage.setItem(EXAM_QUESTIONS_STORAGE_KEY, JSON.stringify(target.data));
        if (db) {
          const docRef = doc(db, 'app_content', 'examprep');
          setDoc(docRef, { questions: target.data, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
        }
        break;

      case 'tracing':
        localStorage.setItem(TRACING_PROBLEMS_STORAGE_KEY, JSON.stringify(target.data));
        if (db) {
          const docRef = doc(db, 'app_content', 'examprep_tracing');
          setDoc(docRef, { problems: target.data, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
        }
        break;

      case 'glossary':
        localStorage.setItem(GLOSSARY_STORAGE_KEY, JSON.stringify(target.data));
        if (db) {
          const docRef = doc(db, 'app_content', 'glossary');
          setDoc(docRef, { terms: target.data, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
        }
        break;

      case 'python_presets':
        localStorage.setItem(PYTHON_PRESETS_STORAGE_KEY, JSON.stringify(target.data));
        if (db) {
          const docRef = doc(db, 'app_content', 'python_presets');
          setDoc(docRef, { presets: target.data, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
        }
        break;

      case 'excel_templates':
        localStorage.setItem(EXCEL_TEMPLATES_STORAGE_KEY, JSON.stringify(target.data));
        if (db) {
          const docRef = doc(db, 'app_content', 'excel_templates');
          setDoc(docRef, { templates: target.data, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
        }
        break;

      case 'flowcharts':
        localStorage.setItem(FLOWCHARTS_STORAGE_KEY, JSON.stringify(target.data));
        if (db) {
          const docRef = doc(db, 'app_content', 'flowcharts');
          setDoc(docRef, { templates: target.data, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
        }
        break;
    }

    notifyContentChanged();
    return { success: true, label: target.label, contentType: target.contentType };
  } catch (e) {
    console.error('Error during version revert:', e);
    return { success: false, label: 'An error occurred during revert', contentType: 'syllabus' };
  }
}

export function deleteCMSVersionEntry(versionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const history: CMSVersionEntry[] = JSON.parse(raw);
      const filtered = history.filter((item) => item.id !== versionId);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
      notifyContentChanged();
    }
  } catch (e) {
    console.error('Failed to delete CMS version entry:', e);
  }
}

export function clearCMSVersionHistory(contentType?: CMSContentType | 'all'): void {
  if (typeof window === 'undefined') return;
  try {
    if (!contentType || contentType === 'all') {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } else {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) {
        const history: CMSVersionEntry[] = JSON.parse(raw);
        const filtered = history.filter((item) => item.contentType !== contentType);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
      }
    }
    notifyContentChanged();
  } catch (e) {
    console.error('Failed to clear CMS version history:', e);
  }
}

