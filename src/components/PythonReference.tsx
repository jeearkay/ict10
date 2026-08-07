import React, { useState } from 'react';
import { motion } from 'motion/react';
import { highlightPython } from './PythonIDE';
import {
  BookOpen,
  Search,
  Code2,
  Copy,
  Check,
  Zap,
  Sparkles,
  AlertCircle,
  Hash,
  Terminal,
  Cpu,
  Bookmark,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { soundFx } from '../lib/audio';

interface CheatSection {
  id: string;
  category: 'datatypes' | 'keywords' | 'functions' | 'strings' | 'collections' | 'modules' | 'exam_tips';
  categoryTitle: string;
  title: string;
  syntax: string;
  description: string;
  bhutanExample: string;
  outputPreview?: string;
  examAlert?: string;
}

const PYTHON_CHEAT_SHEET: CheatSection[] = [
  // DATATYPES
  {
    id: 'dt-int',
    category: 'datatypes',
    categoryTitle: 'Data Types & Literals',
    title: 'Integer (int)',
    syntax: 'x = 10',
    description: 'Whole numbers without decimal points. Used for counting items or loop indices.',
    bhutanExample: 'dzongs_count = 20\nprint(type(dzongs_count))',
    outputPreview: "<class 'int'>",
    examAlert: 'BHSEC Tip: Memory size grows dynamically in Python 3.'
  },
  {
    id: 'dt-float',
    category: 'datatypes',
    categoryTitle: 'Data Types & Literals',
    title: 'Floating Point (float)',
    syntax: 'price = 150.50',
    description: 'Numbers containing a decimal point. Used for precise measurements or currency.',
    bhutanExample: 'pass_percentage = 89.5\nradius = 7.0',
    outputPreview: "<class 'float'>"
  },
  {
    id: 'dt-str',
    category: 'datatypes',
    categoryTitle: 'Data Types & Literals',
    title: 'String (str)',
    syntax: 'name = "BHUTAN"',
    description: 'Sequence of characters enclosed in single (\') or double (") quotes.',
    bhutanExample: 'capital = "Thimphu"\ngreeting = "Kuzuzangpo la"',
    outputPreview: "Thimphu"
  },
  {
    id: 'dt-bool',
    category: 'datatypes',
    categoryTitle: 'Data Types & Literals',
    title: 'Boolean (bool)',
    syntax: 'is_passed = True',
    description: 'Logical truth values: exactly `True` or `False` (capitalized in Python!).',
    bhutanExample: 'has_submitted_assignment = True\nif has_submitted_assignment:\n    print("Grade: Distinction")',
    outputPreview: "Grade: Distinction",
    examAlert: 'BHSEC Trap: Writing `true` or `false` in lowercase causes NameError.'
  },
  {
    id: 'dt-casting',
    category: 'datatypes',
    categoryTitle: 'Data Types & Literals',
    title: 'Type Casting Functions',
    syntax: 'int("10"), float("5.5"), str(100)',
    description: 'Converts values from one data type to another.',
    bhutanExample: 'age_str = input("Enter age: ")  # returns string "16"\nage = int(age_str)  # converted to integer 16',
    outputPreview: '16 (int)',
    examAlert: 'BHSEC Trap: `input()` ALWAYS returns a string. You must use `int(input())` for math calculations.'
  },

  // KEYWORDS
  {
    id: 'kw-if-else',
    category: 'keywords',
    categoryTitle: 'Keywords & Control Flow',
    title: 'if ... elif ... else',
    syntax: 'if condition:\n    # code\nelif other_cond:\n    # code\nelse:\n    # code',
    description: 'Conditional decision-making structure based on boolean logic.',
    bhutanExample: 'marks = 85\nif marks >= 90:\n    print("Outstanding")\nelif marks >= 75:\n    print("Merit")\nelse:\n    print("Pass")',
    outputPreview: 'Merit',
    examAlert: 'Always use exactly 4 spaces for indentation. Forgetting colons `:` causes SyntaxError.'
  },
  {
    id: 'kw-for',
    category: 'keywords',
    categoryTitle: 'Keywords & Control Flow',
    title: 'for Loop & in Keyword',
    syntax: 'for item in sequence:\n    # code',
    description: 'Iterates over items in a sequence (range, list, string, tuple).',
    bhutanExample: 'valleys = ["Paro", "Punakha", "Bumthang"]\nfor valley in valleys:\n    print("Dzong in:", valley)',
    outputPreview: 'Dzong in: Paro\nDzong in: Punakha\nDzong in: Bumthang'
  },
  {
    id: 'kw-while',
    category: 'keywords',
    categoryTitle: 'Keywords & Control Flow',
    title: 'while Loop',
    syntax: 'while condition:\n    # code',
    description: 'Repeats a code block continuously as long as condition evaluates to True.',
    bhutanExample: 'counter = 3\nwhile counter > 0:\n    print("Tashi Delek!", counter)\n    counter = counter - 1',
    outputPreview: 'Tashi Delek! 3\nTashi Delek! 2\nTashi Delek! 1'
  },
  {
    id: 'kw-def-return',
    category: 'keywords',
    categoryTitle: 'Keywords & Control Flow',
    title: 'def & return (Functions)',
    syntax: 'def func_name(param1, param2):\n    return result',
    description: 'Defines a reusable block of code with optional parameters and output return value.',
    bhutanExample: 'def calculate_total_marks(english, ict):\n    return english + ict\n\n\ntotal = calculate_total_marks(88, 95)\nprint("Total:", total)',
    outputPreview: 'Total: 183'
  },
  {
    id: 'kw-logical',
    category: 'keywords',
    categoryTitle: 'Keywords & Control Flow',
    title: 'and, or, not (Logical Operators)',
    syntax: 'cond1 and cond2 | cond1 or cond2 | not cond1',
    description: 'Combines multiple boolean conditions.',
    bhutanExample: 'has_id = True\npassed_exam = True\nif has_id and passed_exam:\n    print("Admitted to Class 11")',
    outputPreview: 'Admitted to Class 11'
  },

  // BUILT-IN FUNCTIONS
  {
    id: 'fn-print',
    category: 'functions',
    categoryTitle: 'Standard Built-in Functions',
    title: 'print(*objects, sep=" ", end="\\n")',
    syntax: 'print("Hello", "World", sep="-")',
    description: 'Outputs text or variable states to the standard console window.',
    bhutanExample: 'print("Ema", "Datshi", sep=" + ", end=" = Spicy!\\n")',
    outputPreview: 'Ema + Datshi = Spicy!'
  },
  {
    id: 'fn-input',
    category: 'functions',
    categoryTitle: 'Standard Built-in Functions',
    title: 'input(prompt)',
    syntax: 'name = input("Enter name: ")',
    description: 'Prompts user for input from console and returns it as a string.',
    bhutanExample: 'dzongkhag = input("Your Dzongkhag: ")\nprint("Welcome student from", dzongkhag)',
    outputPreview: 'Welcome student from Wangdue'
  },
  {
    id: 'fn-len',
    category: 'functions',
    categoryTitle: 'Standard Built-in Functions',
    title: 'len(sequence)',
    syntax: 'length = len([1, 2, 3])',
    description: 'Returns the number of items in a list, tuple, dictionary, or string length.',
    bhutanExample: 'school = "Karma Academy"\nprint("Character length:", len(school))',
    outputPreview: 'Character length: 13'
  },
  {
    id: 'fn-range',
    category: 'functions',
    categoryTitle: 'Standard Built-in Functions',
    title: 'range(start, stop, step)',
    syntax: 'range(1, 10, 2)',
    description: 'Generates a sequence of integers from start up to stop - 1 with specified step increment.',
    bhutanExample: '# Generates odd numbers: 1, 3, 5, 7, 9\nfor i in range(1, 10, 2):\n    print(i, end=" ")',
    outputPreview: '1 3 5 7 9',
    examAlert: 'Crucial BHSEC Rule: `range(1, 5)` stops at 4, NEVER includes 5!'
  },
  {
    id: 'fn-min-max-sum',
    category: 'functions',
    categoryTitle: 'Standard Built-in Functions',
    title: 'min(), max(), sum()',
    syntax: 'min(list), max(list), sum(list)',
    description: 'Returns smallest value, largest value, or sum total of a numerical collection.',
    bhutanExample: 'marks = [85, 92, 78, 95]\nprint("Top Mark:", max(marks))\nprint("Average:", sum(marks) / len(marks))',
    outputPreview: 'Top Mark: 95\nAverage: 87.5'
  },

  // STRINGS & SLICING
  {
    id: 'str-slicing',
    category: 'strings',
    categoryTitle: 'Strings & Slicing Rules',
    title: 'String Slicing [start:stop:step]',
    syntax: 'text[start:stop:step]',
    description: 'Extracts a substring starting at index start up to stop-1.',
    bhutanExample: 'word = "BHUTAN"\nprint(word[0:3])  # "BHU"\nprint(word[-3:])  # "TAN"\nprint(word[::-1])  # "NATUHB" (Reversed)',
    outputPreview: 'BHU\nTAN\nNATUHB',
    examAlert: 'Negative index `-1` represents the last character of any string!'
  },
  {
    id: 'str-methods',
    category: 'strings',
    categoryTitle: 'Strings & Slicing Rules',
    title: 'String Methods (.upper, .lower, .replace)',
    syntax: 'str.upper(), str.lower(), str.replace(old, new)',
    description: 'Built-in methods for formatting and transforming strings.',
    bhutanExample: 'motto = " gross national happiness "\nprint(motto.strip().title())\nprint(motto.replace("gross", "pure"))',
    outputPreview: 'Gross National Happiness\n pure national happiness '
  },
  {
    id: 'str-fstring',
    category: 'strings',
    categoryTitle: 'Strings & Slicing Rules',
    title: 'f-Strings (Formatted String Literals)',
    syntax: 'f"Hello {variable}"',
    description: 'Embeds Python expressions directly inside string literals using `{}` curly braces.',
    bhutanExample: 'student = "Dechen"\nscore = 98\nprint(f"Student {student} scored {score}% in Class 10 ICT!")',
    outputPreview: 'Student Dechen scored 98% in Class 10 ICT!'
  },

  // COLLECTIONS
  {
    id: 'col-list',
    category: 'collections',
    categoryTitle: 'Lists & Dictionaries',
    title: 'Lists [a, b, c]',
    syntax: 'my_list = [10, 20, 30]\nmy_list.append(40)',
    description: 'Ordered, mutable (changeable) collection allowing duplicate elements.',
    bhutanExample: 'fruits = ["Apple", "Banana"]\nfruits.append("Mango")  # Add to end\nfruits.insert(0, "Peach")  # Insert at index 0\nprint(fruits)',
    outputPreview: "['Peach', 'Apple', 'Banana', 'Mango']"
  },
  {
    id: 'col-dict',
    category: 'collections',
    categoryTitle: 'Lists & Dictionaries',
    title: 'Dictionaries {key: value}',
    syntax: 'student = {"name": "Pema", "age": 16}',
    description: 'Unordered collection of key-value pairs. Keys must be unique.',
    bhutanExample: 'capital_map = {"Bhutan": "Thimphu", "Nepal": "Kathmandu"}\nprint(capital_map["Bhutan"])\nprint("Keys:", list(capital_map.keys()))',
    outputPreview: 'Thimphu\nKeys: [\'Bhutan\', \'Nepal\']'
  },

  // MODULES
  {
    id: 'mod-math',
    category: 'modules',
    categoryTitle: 'Standard Modules (math & random)',
    title: 'math Module',
    syntax: 'import math\nmath.sqrt(16), math.pi',
    description: 'Provides mathematical functions such as square root, power, pi, floor, and ceil.',
    bhutanExample: 'import math\nradius = 5\narea = math.pi * math.pow(radius, 2)\nprint("Circle Area:", round(area, 2))\nprint("Sqrt of 81:", math.sqrt(81))',
    outputPreview: 'Circle Area: 78.54\nSqrt of 81: 9.0'
  },
  {
    id: 'mod-random',
    category: 'modules',
    categoryTitle: 'Standard Modules (math & random)',
    title: 'random Module',
    syntax: 'import random\nrandom.randint(1, 6)',
    description: 'Generates pseudo-random numbers and random choices.',
    bhutanExample: 'import random\ndice = random.randint(1, 6)  # Inclusive 1 to 6\nhouses = ["Druk", "Choling", "Tag", "Seng"]\nassigned_house = random.choice(houses)\nprint("House assigned:", assigned_house)',
    outputPreview: 'House assigned: Druk'
  },

  // EXAM TIPS
  {
    id: 'tip-indentation',
    category: 'exam_tips',
    categoryTitle: 'BHSEC Exam Pitfalls & Syntax Rules',
    title: '1. Python Indentation Rule',
    syntax: 'if True:\n    # 4 spaces indentation required!',
    description: 'Python uses whitespace/indentation to define code blocks, unlike C++ or Java which use `{}` curly braces.',
    bhutanExample: '# CORRECT:\nmarks = 75\nif marks >= 50:\n    print("Pass")\n\n# INCORRECT (Causes IndentationError):\n# if marks >= 50:\n# print("Pass")',
    examAlert: 'Always indent 4 spaces or 1 Tab for statements inside loops, functions, and if-else conditions.'
  },
  {
    id: 'tip-equal',
    category: 'exam_tips',
    categoryTitle: 'BHSEC Exam Pitfalls & Syntax Rules',
    title: '2. Assignment (=) vs Equality (==)',
    syntax: 'x = 10 (Assignment)\nx == 10 (Comparison)',
    description: 'Single `=` assigns a value to a variable. Double `==` compares whether two values are equal.',
    bhutanExample: 'x = 5  # Assign 5 to variable x\nif x == 5:  # Check if x equals 5\n    print("Equal")',
    examAlert: 'Writing `if x = 5:` in an exam answer is a severe SyntaxError!'
  }
];

interface PythonReferenceProps {
  onCopyToIde?: (codeSnippet: string) => void;
  isSidebarMode?: boolean;
  onCloseSidebar?: () => void;
}

export const PythonReference: React.FC<PythonReferenceProps> = ({
  onCopyToIde,
  isSidebarMode = false,
  onCloseSidebar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    soundFx.playSuccess();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = PYTHON_CHEAT_SHEET.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.syntax.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bhutanExample.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const categories = [
    { id: 'all', label: 'All Syntax' },
    { id: 'datatypes', label: 'Data Types' },
    { id: 'keywords', label: 'Keywords & Control' },
    { id: 'functions', label: 'Built-in Functions' },
    { id: 'strings', label: 'Strings & Slicing' },
    { id: 'collections', label: 'Lists & Dicts' },
    { id: 'modules', label: 'Math & Random' },
    { id: 'exam_tips', label: 'BHSEC Exam Pitfalls' }
  ];

  return (
    <div className={`space-y-6 ${isSidebarMode ? 'p-4 bg-[#FDFCF0]' : ''}`}>
      {/* Header Banner */}
      <div className="bg-[#1A1A1A] text-white p-6 rounded-3xl border-4 border-[#FFCC33] shadow-[8px_8px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[#FFCC33] text-xs font-black uppercase tracking-widest bg-[#6D071A] px-3 py-1 rounded-full border border-[#FFCC33] mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#FFCC33]" /> Class 10 BHSEC Official Reference Sheet
          </div>
          <h2 className="text-2xl font-black font-serif text-amber-100">
            🐍 Class 10 Python Syntax Cheat Sheet
          </h2>
          <p className="text-xs text-amber-200/90 mt-1 max-w-xl leading-relaxed">
            Essential keywords, standard built-ins, slicing rules, data types, and examination tips tailored for Bhutanese ICT students.
          </p>
        </div>

        {isSidebarMode && onCloseSidebar && (
          <button
            onClick={onCloseSidebar}
            className="px-3 py-1.5 bg-[#FFCC33] text-[#1A1A1A] font-black text-xs rounded-xl border border-[#1A1A1A] cursor-pointer"
          >
            Close Reference
          </button>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-3xl border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords, syntax (e.g. range, input, slicing, len, dict)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border-2 border-[#1A1A1A] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:bg-amber-50 focus:border-[#6D071A] transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-[#6D071A] text-amber-200 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FFCC33]'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-amber-100 hover:text-[#1A1A1A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border-4 border-[#1A1A1A] p-5 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 border-b-2 border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#6D071A] text-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#FFCC33]">
                    {item.categoryTitle}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {onCopyToIde && (
                    <button
                      onClick={() => onCopyToIde(item.bhutanExample)}
                      className="p-1.5 bg-amber-100 hover:bg-amber-200 text-[#1A1A1A] rounded-lg border border-[#1A1A1A] text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      title="Load code snippet in Python IDE"
                    >
                      <Terminal className="w-3.5 h-3.5 text-[#6D071A]" />
                      <span>Try in IDE</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopyCode(item.id, item.bhutanExample)}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg border border-gray-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    title="Copy snippet to clipboard"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Title & Syntax */}
              <div>
                <h3 className="text-base font-black text-[#1A1A1A] font-serif">{item.title}</h3>
                <div className="bg-amber-100/70 border border-amber-300 px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-[#6D071A] inline-block mt-1">
                  {item.syntax}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {item.description}
              </p>

              {/* Code Example Box */}
              <div className="bg-[#1A1A1A] text-amber-200 p-3.5 rounded-2xl border-2 border-[#1A1A1A] font-mono text-xs space-y-2 overflow-x-auto">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1 flex items-center justify-between">
                  <span>Bhutan Context Code Snippet</span>
                  <Code2 className="w-3.5 h-3.5 text-[#FFCC33]" />
                </div>
                <pre
                  className="leading-relaxed pt-1 text-[11px]"
                  dangerouslySetInnerHTML={{ __html: highlightPython(item.bhutanExample) }}
                />

                {item.outputPreview && (
                  <div className="pt-2 border-t border-gray-800 text-[10px] text-emerald-400 font-mono">
                    <span className="text-gray-500">Output: </span>
                    <span>{item.outputPreview}</span>
                  </div>
                )}
              </div>

              {/* Exam Alert Note */}
              {item.examAlert && (
                <div className="bg-rose-50 border border-rose-300 p-2.5 rounded-xl text-[11px] text-rose-900 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{item.examAlert}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white p-8 rounded-3xl border-4 border-[#1A1A1A] text-center space-y-2">
          <Info className="w-8 h-8 text-[#6D071A] mx-auto" />
          <h4 className="text-base font-black text-[#1A1A1A]">No syntax match found</h4>
          <p className="text-xs text-gray-600">
            Try searching for common terms like "range", "input", "slice", "dict", or "if".
          </p>
        </div>
      )}
    </div>
  );
};
