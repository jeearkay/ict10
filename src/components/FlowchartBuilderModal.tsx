import React, { useState, useEffect, useRef } from 'react';
import { FlowchartNode, FlowchartTemplate } from '../types';
import { 
  X, Play, ArrowDown, Code2, Sparkles, Check, Copy, Terminal, Zap, BookOpen, ChevronDown, CheckCircle2, XCircle, GitBranch
} from 'lucide-react';
import mermaid from 'mermaid';
import { getStudentFlowcharts, subscribeToContentChanges } from '../lib/contentManager';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis'
  }
});

interface FlowchartBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInIde?: (codeSnippet: string) => void;
}

const BACKUP_TEMPLATES: FlowchartTemplate[] = [
  {
    id: 'bhutan_voting',
    title: '1. Bhutanese Voting Eligibility Checker (Nested Decision)',
    description: 'Check Nationality (Bhutanese?) -> If Yes, check Age (>= 18?) -> Output Eligibility',
    category: 'BCSEA Exam Standard',
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
    title: '3. Multiplication Table Loop (1 to 9)',
    description: 'Input N -> i=1 -> Check i<=9 -> Loop Body -> Increment -> Exit',
    category: 'BCSEA Exam Standard',
    explanation: 'Demonstrates a counting loop with explicit loop exit decision arrows. The algorithm inputs N, sets `i = 1`, and enters a diamond decision `If i <= 9`. If YES, it computes `2xi = 2 * i`, increments `i`, and loops back via arrow. If NO, the loop exits via explicit No branch to End.',
    mermaidCode: `graph TD
    Start([Start]) --> InN[/Read N/]
    InN --> Init[i = 1]
    Init --> Check{i <= 9?}
    Check -- Yes --> Calc[2xi = 2 * i & Print]
    Calc --> Inc[i = i + 1]
    Inc --> Check
    Check -- No --> End([End])
    
    style Check fill:#FEF3C7,stroke:#D97706,stroke-width:3px
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

// Mermaid Component Renderer
const MermaidRenderer: React.FC<{ chartCode: string }> = ({ chartCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        setError(null);
        const id = 'mermaid-' + Math.random().toString(36).substring(2, 9);
        const { svg } = await mermaid.render(id, chartCode);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setError(err?.message || 'Failed to render flowchart diagram');
        }
      }
    };
    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chartCode]);

  if (error) {
    return (
      <div className="p-4 bg-rose-50 text-rose-800 rounded-xl border border-rose-300 text-xs font-mono">
        ⚠️ Flowchart Rendering Notice: {error}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full flex items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-amber-300 dark:border-slate-700 shadow-inner overflow-auto min-h-[350px]"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export const FlowchartBuilderModal: React.FC<FlowchartBuilderModalProps> = ({
  isOpen,
  onClose,
  onOpenInIde
}) => {
  const [templates, setTemplates] = useState<FlowchartTemplate[]>(() => getStudentFlowcharts());
  const [selectedTemplate, setSelectedTemplate] = useState<FlowchartTemplate>(() => {
    const list = getStudentFlowcharts();
    return list[0] || BACKUP_TEMPLATES[0];
  });
  const [testInputValue, setTestInputValue] = useState<string>('Bhutanese, 20');
  const [tracingLog, setTracingLog] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'mermaid' | 'blocks'>('mermaid');

  useEffect(() => {
    if (!isOpen) return;
    const load = () => {
      const list = getStudentFlowcharts();
      setTemplates(list);
      setSelectedTemplate(current => {
        const found = list.find(t => t.id === current?.id);
        return found || list[0] || current;
      });
    };
    load();
    return subscribeToContentChanges(load);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTraceFlowchart = () => {
    if (selectedTemplate && selectedTemplate.evaluateTrace) {
      try {
        const logs = selectedTemplate.evaluateTrace(testInputValue);
        setTracingLog(logs);
      } catch (err) {
        console.warn('Trace warning:', err);
        setTracingLog(['⚠️ Automatic tracing simulation failed for this customized structure.', 'Please trace it manually in the Step-by-Step tab.']);
      }
    } else if (selectedTemplate) {
      setTracingLog(['⚙️ Custom Flowchart trace simulation initiated.', `Tracing inputs: ${testInputValue}`]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTemplate.pythonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="bg-white dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl max-w-6xl w-full max-h-[94vh] flex flex-col shadow-[8px_8px_0px_0px_#6D071A] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Flowchart builder"
      >
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#6D071A] via-amber-900 to-slate-900 text-white p-4 sm:p-5 border-b-4 border-[#FFCC33] flex flex-col md:flex-row md:items-center justify-between items-start gap-4 shrink-0">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#FFCC33] text-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] shrink-0 mt-1 md:mt-0">
              <Zap className="w-6 h-6 text-[#6D071A]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif font-black text-lg sm:text-xl text-yellow-300 leading-tight">
                  BCSEA Curriculum Exam Flowcharts & Python Lab
                </h2>
                <span className="inline-block bg-[#FFCC33] text-[#1A1A1A] text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Explicit Yes/No Arrows & Branch Routing
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium mt-1">
                Rendered with official directed graph connections for true Yes/True and No/False conditional decision routing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-200 hover:text-white rounded-xl border border-amber-400/50 cursor-pointer transition-all shrink-0 self-end md:self-auto"
            aria-label="Close flowchart builder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DROPDOWN SELECTOR BAR */}
        <div className="p-3.5 bg-amber-50 dark:bg-slate-800/90 border-b border-amber-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-black uppercase text-[#6D071A] dark:text-amber-300 tracking-wider whitespace-nowrap">
              Select Flowchart:
            </span>
            <div className="relative flex-1 sm:w-[420px]">
              <select
                value={selectedTemplate.id}
                onChange={(e) => {
                  const found = templates.find(t => t.id === e.target.value);
                  if (found) {
                    setSelectedTemplate(found);
                    setTracingLog([]);
                    if (found.id === 'bhutan_voting') setTestInputValue('Bhutanese, 20');
                    else if (found.id === 'smallest_two') setTestInputValue('25, 10');
                    else if (found.id === 'multiplication_table') setTestInputValue('5');
                    else if (found.id === 'stream_selection') setTestInputValue('65, 60');
                    else setTestInputValue('5');
                  }
                }}
                aria-label="Select Curriculum Algorithm"
                className="w-full bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
              >
                {templates.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-amber-200/70 dark:bg-slate-700 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('mermaid')}
                className={`px-3 py-1 text-xs font-black rounded-lg cursor-pointer transition-all ${activeTab === 'mermaid' ? 'bg-[#6D071A] text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:text-black'}`}
              >
                Mermaid Diagram (Yes/No Arrows)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('blocks')}
                className={`px-3 py-1 text-xs font-black rounded-lg cursor-pointer transition-all ${activeTab === 'blocks' ? 'bg-[#6D071A] text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:text-black'}`}
              >
                Step-by-Step Blocks
              </button>
            </div>
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-2.5 py-1 bg-white dark:bg-slate-900 rounded-lg border border-amber-200 dark:border-slate-700 hidden sm:block">
              Standard: <span className="text-amber-600 dark:text-amber-400">{selectedTemplate.category}</span>
            </div>
          </div>
        </div>

        {/* EDUCATIONAL EXPLANATION BANNER */}
        {selectedTemplate.explanation && (
          <div className="bg-amber-100/80 dark:bg-amber-950/50 px-4 py-3 border-b border-amber-200 dark:border-slate-800 flex items-start gap-2.5 shrink-0">
            <BookOpen className="w-5 h-5 text-[#6D071A] dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-900 dark:text-amber-200 leading-relaxed font-medium">
              <strong className="font-black text-[#6D071A] dark:text-amber-300 uppercase tracking-wide block mb-0.5 text-xs">
                📖 Learner Guide: Decision Routing & Flow Line Rules
              </strong>
              {selectedTemplate.explanation}
            </div>
          </div>
        )}

        {/* MAIN BODY: SPLIT VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-amber-200 dark:divide-slate-800">
          
          {/* LEFT: FLOWCHART DIAGRAM (MERMAID OR BLOCKS) */}
          <div className="lg:col-span-7 p-5 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-amber-600" />
                {activeTab === 'mermaid' ? 'Connected Directed Flowchart (Mermaid.js)' : 'Geometric Block Stack'}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-300">
                ✓ Explicit Yes/No Branch Arrows
              </span>
            </div>

            {activeTab === 'mermaid' ? (
              <div className="w-full flex-1 flex flex-col justify-center">
                <MermaidRenderer chartCode={selectedTemplate.mermaidCode} />
                <div className="mt-3 p-3 bg-amber-100/80 dark:bg-slate-900 border border-amber-300 dark:border-slate-700 rounded-xl text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="font-black text-[#6D071A] dark:text-amber-300 uppercase tracking-wider">How to read this flowchart:</div>
                  <ul className="list-disc list-inside space-y-0.5 font-medium">
                    <li><strong>Diamonds</strong> represent conditions with distinct <span className="text-emerald-700 dark:text-emerald-400 font-bold">{`-- Yes -->`}</span> and <span className="text-rose-700 dark:text-rose-400 font-bold">{`-- No -->`}</span> directional paths.</li>
                    <li><strong>Parallelograms</strong> handle input and print output operations.</li>
                    <li><strong>Rectangles</strong> represent process assignment statements.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-lg space-y-3 flex flex-col items-center py-3">
                {selectedTemplate.nodes.map((node, index) => (
                  <React.Fragment key={node.id}>
                    {(node.type === 'start' || node.type === 'end') && (
                      <div className="w-72 py-3 px-6 bg-[#FFCC33] text-[#1A1A1A] border-3 border-[#1A1A1A] rounded-[999px] shadow-[4px_4px_0px_0px_#1A1A1A] text-center">
                        <div className="text-[9px] uppercase font-mono tracking-widest opacity-75 mb-0.5">Terminator</div>
                        <div className="text-sm font-black whitespace-pre-line">{node.text}</div>
                      </div>
                    )}
                    {(node.type === 'input' || node.type === 'output') && (
                      <div className="w-72 py-3.5 px-6 bg-sky-100 dark:bg-sky-950 text-sky-950 dark:text-sky-200 border-3 border-sky-500 shadow-[4px_4px_0px_0px_#1A1A1A] text-center transform -skew-x-12">
                        <div className="text-[9px] uppercase font-mono tracking-widest opacity-75 mb-0.5 transform skew-x-12">
                          {node.type === 'input' ? 'Input Data' : 'Output / Print'}
                        </div>
                        <div className="text-xs sm:text-sm font-black transform skew-x-12 whitespace-pre-line">{node.text}</div>
                      </div>
                    )}
                    {node.type === 'process' && (
                      <div className="w-72 py-3.5 px-6 bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-200 border-3 border-emerald-600 shadow-[4px_4px_0px_0px_#1A1A1A] text-center rounded-md">
                        <div className="text-[9px] uppercase font-mono tracking-widest opacity-75 mb-0.5">Process Assignment</div>
                        <div className="text-xs sm:text-sm font-black whitespace-pre-line">{node.text}</div>
                      </div>
                    )}
                    {node.type === 'decision' && (
                      <div className="w-full flex flex-col items-center my-3 space-y-2">
                        <div className="relative w-96 h-40 flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full drop-shadow-[4px_4px_0px_#1A1A1A]" viewBox="0 0 380 140">
                            <polygon points="190,4 372,70 190,136 8,70" className="fill-amber-100 dark:fill-amber-950 stroke-amber-600 stroke-[3]" />
                          </svg>
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-rose-600 text-white font-black text-[10px] px-2 py-1 rounded shadow-xs border border-slate-900 z-20 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> NO / FALSE
                          </div>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-600 text-white font-black text-[10px] px-2 py-1 rounded shadow-xs border border-slate-900 z-20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> YES / TRUE
                          </div>
                          <div className="relative z-10 px-16 py-3 text-center max-w-[240px]">
                            <div className="text-[9px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-300 font-black mb-0.5">Decision Diamond</div>
                            <div className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-100 leading-tight">{node.text}</div>
                          </div>
                        </div>
                        {(node.trueOutcome || node.falseOutcome) && (
                          <div className="w-80 grid grid-cols-2 gap-2 text-[10px] font-bold">
                            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 p-2 rounded-xl text-center">
                              <span className="block font-black text-rose-700 dark:text-rose-400 uppercase mb-0.5">If No ❌</span>
                              {node.falseOutcome}
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 p-2 rounded-xl text-center">
                              <span className="block font-black text-emerald-700 dark:text-emerald-400 uppercase mb-0.5">If Yes ✅</span>
                              {node.trueOutcome}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {index < selectedTemplate.nodes.length - 1 && node.type !== 'decision' && (
                      <div className="flex flex-col items-center justify-center text-amber-600 dark:text-amber-400 py-1">
                        <div className="w-0.5 h-6 bg-amber-500"></div>
                        <ArrowDown className="w-4 h-4 -mt-1.5 animate-bounce font-black" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: LIVE STEPPER TRACER & PYTHON CODE GENERATOR */}
          <div className="lg:col-span-5 p-5 overflow-y-auto space-y-4 bg-white dark:bg-slate-900">
            
            {/* TRACING & INPUTS */}
            <div className="bg-amber-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border-2 border-amber-300 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center gap-2 font-serif font-black text-xs sm:text-sm text-[#1A1A1A] dark:text-amber-300">
                <Play className="w-4 h-4 text-[#6D071A] dark:text-amber-400" />
                <span>Test & Trace Algorithm Execution</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  Test Inputs:
                </label>
                <input
                  type="text"
                  value={testInputValue}
                  onChange={(e) => setTestInputValue(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-950 border-2 border-[#1A1A1A] dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  placeholder="e.g. Bhutanese, 20 or 25, 10"
                />
                <button
                  type="button"
                  onClick={handleTraceFlowchart}
                  className="px-3 py-1.5 bg-[#FFCC33] text-[#1A1A1A] hover:bg-yellow-400 rounded-xl font-black text-xs border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer"
                >
                  Run Trace
                </button>
              </div>

              {/* Execution Tracing Output Box */}
              {tracingLog.length > 0 && (
                <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1.5 leading-relaxed max-h-44 overflow-y-auto">
                  {tracingLog.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              )}
            </div>

            {/* AUTO-GENERATED PYTHON CODE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-500" />
                  Python 3 Code Implementation
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-lg text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                  {onOpenInIde && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenInIde(selectedTemplate.pythonCode);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-[#FFCC33] text-[#1A1A1A] hover:bg-yellow-400 font-black text-[11px] rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Open in IDE</span>
                    </button>
                  )}
                </div>
              </div>

              <pre className="p-3.5 bg-slate-950 text-emerald-400 rounded-2xl border-2 border-slate-800 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-56">
                {selectedTemplate.pythonCode}
              </pre>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="p-3 bg-amber-50 dark:bg-slate-800 border-t border-amber-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Official Mermaid.js graph rendering with explicit Yes/No arrow routing and conditional decision branching.</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1A1A1A] text-white hover:bg-slate-800 rounded-xl font-bold text-xs cursor-pointer"
          >
            Close Flowchart Builder
          </button>
        </div>

      </div>
    </div>
  );
};
