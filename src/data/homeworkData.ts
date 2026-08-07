export interface HomeworkQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'boolean' | 'drag-drop' | 'match-following';
  options: string[];
  correctAnswer: string | number | Record<string, string>; // index for MC, string for blank/drag-drop, or pairings for match-following
  explanation: string;
  points: number;
  blankSentence?: string;
  dragOptions?: string[];
  leftItems?: string[];
  rightItems?: string[];
}

export interface HomeworkSheet {
  id: string;
  title: string;
  description: string;
  badgeId?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  xpReward: number;
  questions: HomeworkQuestion[];
  status?: 'published' | 'draft';
}

export const HOMEWORK_SHEETS: HomeworkSheet[] = [
  {
    id: 'homework-cloud',
    title: 'Cloud Services & Workspace Collab',
    description: 'Master Cloud Models (SaaS, PaaS, IaaS), Public/Private clouds, and real-time collaboration features of Google Workspace.',
    badgeId: 'badge-paro-cloud',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    xpReward: 50,
    questions: [
      {
        id: 'cloud-q1',
        question: 'Charro Bakery in Paro town wants to start taking custom cake orders online. They do not have an IT department and just want a ready-to-use program where customers can fill out forms and pay. Which Cloud Service Model should the bakery use, and why?',
        type: 'multiple-choice',
        options: [
          'SaaS (Software as a Service) - because they need a finished, ready-to-use product without writing code.',
          'PaaS (Platform as a Service) - because they need a platform to deploy their customized Java codebase.',
          'IaaS (Infrastructure as a Service) - because they want to provision virtual machines and configure network firewalls.'
        ],
        correctAnswer: 0,
        explanation: 'SaaS is perfect for businesses without an IT department as it provides fully managed, ready-to-use software applications over the internet (e.g., website builders, Shopify, online order forms).',
        points: 10
      },
      {
        id: 'cloud-q2',
        question: 'A JDWNRH Hospital needs to store highly confidential patient medical records safely. However, they also need a basic, public website where citizens can look up visiting hours and doctor directories. Explain how the hospital could use a Hybrid Cloud approach to manage both needs.',
        type: 'multiple-choice',
        options: [
          'Store patient records on a Public Cloud and host the basic website on a Private Cloud.',
          'Store patient records on a Private Cloud for security, and host the basic website on a Public Cloud to keep costs low. Linking these together creates a Hybrid Cloud.',
          'Host both patient records and the public website on an IaaS container without any encryption.'
        ],
        correctAnswer: 1,
        explanation: 'A Hybrid Cloud links Private Cloud (for secure, sensitive data like confidential health records) and Public Cloud (for public-facing, cost-efficient hosting like doctor schedules).',
        points: 10
      },
      {
        id: 'cloud-q-blank-1',
        question: 'What cloud service model allows developers to deploy their applications without managing underlying operating systems or hardware servers?',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: 'PaaS',
        explanation: 'Platform as a Service (PaaS) provides a ready environment to deploy and run code (such as Heroku, Google App Engine) without server maintenance.',
        points: 10
      },
      {
        id: 'cloud-q-drag-1',
        question: 'Complete the sentence about Cloud Service models:',
        type: 'drag-drop',
        options: [],
        blankSentence: 'Google Drive is an example of ______ where ready-to-use software is delivered over the internet.',
        dragOptions: ['SaaS', 'PaaS', 'IaaS'],
        correctAnswer: 'SaaS',
        explanation: 'SaaS delivers fully-functional, ready-to-use web applications like Google Drive, Gmail, or Microsoft 365.',
        points: 10
      },
      {
        id: 'cloud-q-match-1',
        question: 'Match each cloud deployment type with its primary environment scope:',
        type: 'match-following',
        options: [],
        leftItems: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud'],
        rightItems: ['Shared internet servers (e.g. AWS)', 'Single-organization internal secure network', 'Combination of both public and private systems'],
        correctAnswer: {
          'Public Cloud': 'Shared internet servers (e.g. AWS)',
          'Private Cloud': 'Single-organization internal secure network',
          'Hybrid Cloud': 'Combination of both public and private systems'
        },
        explanation: 'Public clouds are shared, private clouds are dedicated to single organizations, and hybrid clouds link both for security and cost efficiency.',
        points: 10
      }
    ]
  },
  {
    id: 'homework-workspace',
    title: 'Google Workspace in Education',
    description: 'Explore the educational benefits of Google Classroom, Docs real-time co-authoring, and Google Ecosystem tools like Lens and Gemini.',
    badgeId: 'badge-workspace-hero',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    xpReward: 50,
    questions: [
      {
        id: 'workspace-q1',
        question: 'Jigme is at home, Riwang is at the library, and Kabir is in a taxi with only a tablet. They are working on a joint Geography presentation. How does Google Workspace solve their problem of working together from different locations?',
        type: 'multiple-choice',
        options: [
          'Google Workspace automatically merges separate PowerPoint files via email attachments.',
          'Because Google Workspace is cloud-based, the presentation is stored online. All three students can access and edit the exact same file simultaneously in real-time.',
          'They have to wait until they meet in person because mobile devices do not support cloud editing.'
        ],
        correctAnswer: 1,
        explanation: 'Real-time co-authoring allows multiple users to edit the same online document concurrently. Everyone sees updates instantly, eliminating the need to email multiple file versions.',
        points: 10
      },
      {
        id: 'workspace-q2',
        question: 'Ms. Karma, a Class 10 teacher, wants to go "paperless" and easily track who has submitted assignments. Which specific version of Google Workspace and tool should her school implement?',
        type: 'multiple-choice',
        options: [
          'Google Workspace for Education & Google Classroom as a digital hub to distribute/collect assignments digitally.',
          'Google Workspace for Retail & Google Ads to advertise her class rules.',
          'Google Workspace Basic & Gmail threads without any assignment tracking.'
        ],
        correctAnswer: 0,
        explanation: 'Google Workspace for Education includes Google Classroom, which acts as a secure digital hub where teachers can assign work, students submit papers digitally, and grading is streamlined without paper.',
        points: 10
      },
      {
        id: 'workspace-q-blank-1',
        question: 'To join a secure video conference hosted by teachers in Google Workspace, students click a unique meeting link inside Google ______.',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: 'Meet',
        explanation: 'Google Meet is the real-time video collaboration tool in Google Workspace used for virtual classes and lectures.',
        points: 10
      },
      {
        id: 'workspace-q-drag-1',
        question: 'Complete the sentence on Google Ecosystem applications:',
        type: 'drag-drop',
        options: [],
        blankSentence: 'To scan a printed paragraph from a printed document and translate it instantly, we use Google ______.',
        dragOptions: ['Docs', 'Lens', 'Sheets', 'Drive'],
        correctAnswer: 'Lens',
        explanation: 'Google Lens uses machine learning and computer vision to extract, read, and translate physical text using your device camera.',
        points: 10
      }
    ]
  },
  {
    id: 'homework-copyright',
    title: 'Intellectual Property & Citation Standards',
    description: 'Understand credibility indicators, APA/MLA/IEEE citations, automatic copyright rules, and Creative Commons licenses.',
    badgeId: 'badge-copyright-sentinel',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    xpReward: 50,
    questions: [
      {
        id: 'copyright-q1',
        question: 'Tenzin finds two websites for a history report on Zhabdrung Ngawang Namgyel: (1) www.bhutanculturalheritage.com (anonymous travel blog) and (2) www.library.gov.bt (official website of National Library of Bhutan). Which should Tenzin prioritize and why?',
        type: 'multiple-choice',
        options: [
          'The anonymous blog, because travel blogs are more colorful and interesting.',
          'The official www.library.gov.bt site, because the .gov.bt domain indicates government-verified credibility, and the National Library is an authorized historical archive.',
          'Both are equally credible since they are on the internet.'
        ],
        correctAnswer: 1,
        explanation: 'Official government domains (.gov) and institutional ownership (National Library) are major indicators of research credibility compared to anonymous blogs.',
        points: 10
      },
      {
        id: 'copyright-q2',
        question: 'Pema downloads a stunning photo of Tiger’s Nest (Paro Taktsang) from an artist’s Instagram and prints it as the cover of her school magazine without permission or citation. Is this "Fair and Responsible Use"?',
        type: 'multiple-choice',
        options: [
          'Yes, because it is for a school magazine and Instagram photos are free to take.',
          'No. The photographer owns the intellectual property. Pema is violating their rights by not seeking permission or citing the source, violating good digital citizenship.',
          'Yes, because Tiger’s Nest is a national monument so anyone can use photos of it without credit.'
        ],
        correctAnswer: 1,
        explanation: 'Even in educational projects, downloading and republishing someone else’s creative photography without citation or permission violates copyright. Good digital citizenship requires proper attribution.',
        points: 10
      },
      {
        id: 'copyright-q-blank-1',
        question: 'Bhutanese copyright law protects original works immediately as soon as they are fixed in a ______ medium.',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: 'tangible',
        explanation: 'Copyright protection is automatic once a creative idea is captured in a tangible form (such as paper, audio recording, digital file, or painted canvas).',
        points: 10
      },
      {
        id: 'copyright-q-match-1',
        question: 'Match the Creative Commons (CC) license components with their legal rules:',
        type: 'match-following',
        options: [],
        leftItems: ['BY', 'SA', 'NC', 'ND'],
        rightItems: ['Credit must be given to the author', 'Modified work must use the same license', 'No commercial sales/use allowed', 'No modified versions (derivatives) allowed'],
        correctAnswer: {
          'BY': 'Credit must be given to the author',
          'SA': 'Modified work must use the same license',
          'NC': 'No commercial sales/use allowed',
          'ND': 'No modified versions (derivatives) allowed'
        },
        explanation: 'BY is Attribution, SA is ShareAlike, NC is Non-Commercial, and ND is NoDerivatives. Together they form Creative Commons licensing combinations.',
        points: 10
      }
    ]
  },
  {
    id: 'homework-excel',
    title: 'Microsoft Excel Formulas & Cell References',
    description: 'Master cell math, relative vs absolute referencing ($A$1), and basic functional operations in spreadsheets.',
    badgeId: 'badge-excel-master',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    xpReward: 50,
    questions: [
      {
        id: 'excel-q1',
        question: 'In Microsoft Excel, what must every formula or function begin with in order for Excel to evaluate it as calculation rather than plain text?',
        type: 'multiple-choice',
        options: [
          'A dollar sign ($)',
          'An equal sign (=)',
          'An hashtag (#)',
          'An @ symbol'
        ],
        correctAnswer: 1,
        explanation: 'Every Excel formula must start with an equal sign (=). If omitted, Excel treats the entry as literal text.',
        points: 10
      },
      {
        id: 'excel-q2',
        question: 'Explain the difference between a Relative Reference (like A1) and an Absolute Reference (like $B$4) when copying formulas down a column.',
        type: 'multiple-choice',
        options: [
          'A1 changes dynamically relative to the new row index, while $B$4 stays locked on cell B4.',
          '$B$4 changes dynamically, while A1 remains permanently locked.',
          'Absolute references are used for text only, while relative references are used for numbers.'
        ],
        correctAnswer: 0,
        explanation: 'Relative cell references (A1) adjust automatically when copied. Adding dollar signs ($B$4) creates an absolute reference that remains locked on B4.',
        points: 10
      },
      {
        id: 'excel-q-blank-1',
        question: 'To find the sum of all cell values in row 1 from cell A1 to E1 in Excel, we write the formula: ______',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: '=SUM(A1:E1)',
        explanation: '=SUM(A1:E1) adds up the complete range from cell A1 through cell E1.',
        points: 10
      },
      {
        id: 'excel-q-drag-1',
        question: 'Complete the sentence about Excel cell reference types:',
        type: 'drag-drop',
        options: [],
        blankSentence: 'The reference C$12 is an example of a ______ cell reference because only the row is locked.',
        dragOptions: ['Relative', 'Absolute', 'Mixed'],
        correctAnswer: 'Mixed',
        explanation: 'A mixed reference has only one part locked (either the row, like C$12, or the column, like $C12).',
        points: 10
      },
      {
        id: 'excel-q-match-1',
        question: 'Match the Excel formulas with their mathematical operations:',
        type: 'match-following',
        options: [],
        leftItems: ['=SUM(A1:A5)', '=AVERAGE(B1:B5)', '=COUNT(C1:C5)'],
        rightItems: ['Add values of cells together', 'Calculate the mathematical mean', 'Count cells containing numbers'],
        correctAnswer: {
          '=SUM(A1:A5)': 'Add values of cells together',
          '=AVERAGE(B1:B5)': 'Calculate the mathematical mean',
          '=COUNT(C1:C5)': 'Count cells containing numbers'
        },
        explanation: 'SUM adds values, AVERAGE calculates the mean, and COUNT tracks the number of numerical inputs in the specified cell range.',
        points: 10
      }
    ]
  },
  {
    id: 'homework-python-basics',
    title: 'Python Print, Input & Variables',
    description: 'Learn the difference between Interactive and Script mode, variable assignments, and using print() / input() with proper typecasting.',
    badgeId: 'badge-python-coder',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    xpReward: 50,
    questions: [
      {
        id: 'python-basics-q1',
        question: 'Identify the logic error in this program:\n```python\nlength = input("Enter length: ")\nwidth = input("Enter width: ")\narea = length * width\nprint(area)\n```',
        type: 'multiple-choice',
        options: [
          'Variables cannot be named "length" or "width" in Python.',
          '`input()` always returns a string. Multiplying two strings (`length * width`) causes a TypeError! You must typecast them using `float()` or `int()`.',
          'The `print(area)` function is capitalized incorrectly.'
        ],
        correctAnswer: 1,
        explanation: 'The input() function always reads keyboard values as text (strings). To perform mathematical operations like area multiplication, you must cast them using float(input()) or int(input()).',
        points: 10
      },
      {
        id: 'python-basics-q2',
        question: 'How do you swap the values of two variables `x` and `y` in a single line of Python code without using a temporary third variable?',
        type: 'multiple-choice',
        options: [
          '`x = y`',
          '`x, y = y, x` - Python evaluates the right-hand expressions and unpacks them into variables.',
          '`swap(x, y)`'
        ],
        correctAnswer: 1,
        explanation: 'Python supports tuple assignment unpacking: writing `x, y = y, x` swaps both variable contents simultaneously in one elegant operation.',
        points: 10
      },
      {
        id: 'python-basics-q-blank-1',
        question: 'What is the function used in Python to display output text onto the console or terminal screen?',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: 'print()',
        explanation: 'The print() function evaluates parameters and writes them to standard console output.',
        points: 10
      },
      {
        id: 'python-basics-q-drag-1',
        question: 'Complete the sentence about variable standards:',
        type: 'drag-drop',
        options: [],
        blankSentence: 'In Python, a variable identifier name must never start with a ______.',
        dragOptions: ['letter', 'number', 'underscore'],
        correctAnswer: 'number',
        explanation: 'According to Python syntax and PEP 8 guidelines, identifiers must start with a letter or underscore, never a numeric digit.',
        points: 10
      }
    ]
  },
  {
    id: 'homework-operators',
    title: 'Arithmetic Operators & Math Formulas',
    description: 'Solve board-exam math formulas including circles, cylinders, simple interest, and integer floor division / modulus operations.',
    badgeId: 'badge-logic-guru',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    xpReward: 50,
    questions: [
      {
        id: 'operators-q1',
        question: 'Which block of Python code correctly calculates the Area of a Circle given user input for radius?',
        type: 'multiple-choice',
        options: [
          '```python\nradius = float(input("Radius: "))\npi = 3.14159\narea = pi * (radius ** 2)\nprint("Area:", area)\n```',
          '```python\nradius = input("Radius: ")\narea = 3.14 * radius * 2\nprint(area)\n```',
          '```python\nradius = float(input("Radius: "))\narea = pi * radius * radius\n```'
        ],
        correctAnswer: 0,
        explanation: 'The area of a circle is calculated as $\pi r^2$. The exponent operator in Python is `**`, so `radius ** 2` squares the radius. The radius must also be converted to a float.',
        points: 10
      },
      {
        id: 'operators-q2',
        question: 'What do the floor division operator `//` and modulus operator `%` return respectively when calculating `17 // 5` and `17 % 5`?',
        type: 'multiple-choice',
        options: [
          '`3.4` and `2`',
          '`3` (quotient of integer division) and `2` (the remainder left over).',
          '`3` and `3`'
        ],
        correctAnswer: 1,
        explanation: 'Floor division `//` discards the decimal part and returns the whole quotient (3). Modulus `%` returns the mathematical remainder of the division (2).',
        points: 10
      },
      {
        id: 'operators-q-blank-1',
        question: 'In Python, what is the exponential operator used to raise a number to a power (e.g. $2^3$)?',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: '**',
        explanation: 'The double asterisk ** is the exponentiation operator in Python. For example, 2 ** 3 outputs 8.',
        points: 10
      },
      {
        id: 'operators-q-drag-1',
        question: 'Complete the sentence on integer math operations:',
        type: 'drag-drop',
        options: [],
        blankSentence: 'To get only the remainder of division in a program, we use the ______ operator.',
        dragOptions: ['/', '//', '%', '*'],
        correctAnswer: '%',
        explanation: 'The modulo operator % calculates and returns the remainder when one number is divided by another.',
        points: 10
      }
    ]
  },
  {
    id: 'homework-strings',
    title: 'Python Strings & Slicing Syntax',
    description: 'Master index-based character access, string repetitions, substring replacements, and Python slice notation.',
    badgeId: 'badge-collections-king',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    xpReward: 50,
    questions: [
      {
        id: 'strings-q1',
        question: 'Given `student = "Wangmo"`, what index is required to access the first character "W" and what will `student[-1]` return?',
        type: 'multiple-choice',
        options: [
          '`student[1]` returns "W" and `student[-1]` returns "W".',
          '`student[0]` returns "W" (zero-based index) and `student[-1]` returns "o" (last character via negative indexing).',
          '`student[0]` returns "W" and `student[-1]` causes an IndexError.'
        ],
        correctAnswer: 1,
        explanation: 'Python utilizes 0-based indexing for positive indices. Negative indexing counts backward from the end, where `-1` represents the final character.',
        points: 10
      },
      {
        id: 'strings-q2',
        question: 'Given the variable `School = "Modern High School"`, which slicing code properly extracts "Modern School" (removing the word "High ")?',
        type: 'multiple-choice',
        options: [
          '`School[0:6] + School[11:]` - combines index 0-5 ("Modern") and index 11 to end ("School").',
          '`School[0:7] + School[12:]`',
          '`School.replace("High", "")`'
        ],
        correctAnswer: 0,
        explanation: 'Slicing `School[0:6]` gets "Modern" (including trailing space) and `School[11:]` gets "School", combining them perfectly into "Modern School".',
        points: 10
      },
      {
        id: 'strings-q-blank-1',
        question: 'If a string variable is defined as `txt = "Bhutan"`, what is the output of the slice code `txt[1:4]`?',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: 'hut',
        explanation: 'The slice starts at index 1 ("h") and goes up to index 4 exclusive (meaning index 1, 2, and 3: "hut").',
        points: 10
      },
      {
        id: 'strings-q-drag-1',
        question: 'Complete the sentence about string slice parameters:',
        type: 'drag-drop',
        options: [],
        blankSentence: 'To reverse an entire string using slice notation, we can write `txt[______]`.',
        dragOptions: ['::1', '::-1', '0:-1', '1:0:-1'],
        correctAnswer: '::-1',
        explanation: 'The slice stride syntax [::-1] walks through the string with a step size of -1, producing a reversed string.',
        points: 10
      }
    ]
  },
  {
    id: 'homework-conditionals',
    title: 'Conditional Branches & Palindromes',
    description: 'Write clean If, If-Else, and If-Elif-Else structures to check numbers, text inputs, and word structures.',
    badgeId: 'badge-logic-guru',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    xpReward: 50,
    questions: [
      {
        id: 'conditionals-q1',
        question: 'Identify the syntax error in this conditional statement:\n```python\nmarks = int(input("Enter marks: "))\nif marks >= 40\n    print("Pass")\n```',
        type: 'multiple-choice',
        options: [
          'There is a missing colon `:` at the end of the `if` conditional line.',
          'The `print` block is not in capital letters.',
          'You cannot use `int()` with `input()` on the same line.'
        ],
        correctAnswer: 0,
        explanation: 'In Python, header statements for compound blocks (like `if`, `else`, `elif`, `for`, `while`, and `def`) must always end with a colon `:` character.',
        points: 10
      },
      {
        id: 'conditionals-q-blank-1',
        question: 'In Python, what is the comparison operator used to check if two values are exactly equal to each other?',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: '==',
        explanation: 'The double equal sign (==) checks for equality between two expressions, whereas a single equal sign (=) is for variable assignment.',
        points: 10
      },
      {
        id: 'conditionals-q-drag-1',
        question: 'Complete the sentence about multi-way branches in Python:',
        type: 'drag-drop',
        options: [],
        blankSentence: 'In Python, we check multiple alternative branches in a conditional block using the ______ keyword.',
        dragOptions: ['else if', 'elif', 'elseif', 'switch'],
        correctAnswer: 'elif',
        explanation: 'The keyword `elif` is short for "else if" and is standard Python syntax to check additional conditions after an initial `if`.',
        points: 10
      }
    ]
  },
  {
    id: 'homework-nested',
    title: 'Nested Conditionals & Eligible Streams',
    description: 'Examine multi-layered logical checks, stream eligibility parameters, and citizenship voting rules.',
    badgeId: 'badge-logic-guru',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    xpReward: 50,
    questions: [
      {
        id: 'nested-q1',
        question: 'A school stream admission code check requires: Math >= 50 and Science >= 55 for Science stream; Math >= 50 for Commerce; Else Arts stream unless both marks are under 40 (Not Eligible). What stream is a student with Math = 48 and Science = 60 eligible for?',
        type: 'multiple-choice',
        options: [
          'Science Stream',
          'Commerce Stream',
          'Arts Stream - because they scored above 40 but did not meet the Math requirement of 50 for Science or Commerce.',
          'Not eligible for any stream'
        ],
        correctAnswer: 2,
        explanation: 'With Math=48 (under 50), the student does not qualify for Science or Commerce. Since at least one mark is 40 or higher, they are eligible for the Arts stream.',
        points: 10
      },
      {
        id: 'nested-q-blank-1',
        question: 'In a program, placing one `if` statement completely inside another `if` statement block is referred to as a ______ conditional statement.',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: 'nested',
        explanation: 'Placing any block structure inside another is referred to as nesting (e.g. nested conditionals, nested loops).',
        points: 10
      }
    ]
  },
  {
    id: 'homework-loops',
    title: 'For & While Loops Control',
    description: 'Understand loop ranges, skip patterns with continue, terminate patterns with break, and nested structures.',
    badgeId: 'badge-logic-guru',
    difficulty: 'Advanced',
    estimatedMinutes: 12,
    xpReward: 50,
    questions: [
      {
        id: 'loops-q1',
        question: 'What numbers will the Python expression `range(5, 20, 5)` generate when executed in a for loop?',
        type: 'multiple-choice',
        options: [
          '5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20',
          '5, 10, 15 - starts at 5, increments by 5, and stops before the end value 20.',
          '10, 15, 20'
        ],
        correctAnswer: 1,
        explanation: '`range(start, stop, step)` starts at `start` inclusive, increments by `step`, and ends right before `stop` (exclusive).',
        points: 10
      },
      {
        id: 'loops-q-blank-1',
        question: 'In a loop, what keyword skips the rest of the current iteration and jumps straight to the next cycle of the loop?',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: 'continue',
        explanation: 'The continue statement stops executing code in the current iteration and returns program flow to the loop header for the next iteration.',
        points: 10
      },
      {
        id: 'loops-q-drag-1',
        question: 'Complete the sentence about Python loop controls:',
        type: 'drag-drop',
        options: [],
        blankSentence: 'To write a loop with an empty body as a placeholder, we place the ______ statement inside.',
        dragOptions: ['break', 'continue', 'pass', 'return'],
        correctAnswer: 'pass',
        explanation: 'In Python, the `pass` statement is a null statement used to fill structural syntax blocks where code is required but no action is needed.',
        points: 10
      }
    ]
  },
  {
    id: 'homework-collections',
    title: 'Python Collections (Lists, Sets & Dicts)',
    description: 'Dive deep into list methods (append, pop, sort), set comparisons (intersection, union), and dictionary lookups.',
    badgeId: 'badge-collections-king',
    difficulty: 'Advanced',
    estimatedMinutes: 12,
    xpReward: 50,
    questions: [
      {
        id: 'coll-q1',
        question: 'Given the list `friends = ["Pema", "Wangmo", "Jigme"]`, what are the resulting items of the list after running `friends.append("Zangmo")` followed by `friends.insert(1, "Sonam")`?',
        type: 'multiple-choice',
        options: [
          '`["Pema", "Wangmo", "Jigme", "Zangmo", "Sonam"]`',
          '`["Pema", "Sonam", "Wangmo", "Jigme", "Zangmo"]` - append adds to the end, while insert places "Sonam" exactly at index 1.',
          '`["Sonam", "Pema", "Wangmo", "Jigme", "Zangmo"]`'
        ],
        correctAnswer: 1,
        explanation: '`append` mutates the list by appending to the end. `insert(1, ...)` places the new item at index 1, shifting subsequent elements to the right.',
        points: 10
      },
      {
        id: 'coll-q-blank-1',
        question: 'In Python, a collection that is ordered, immutable (cannot be altered after creation), and defined inside parentheses `()` is a ______.',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: 'tuple',
        explanation: 'A Tuple is an ordered, immutable collection type in Python commonly used to store constants.',
        points: 10
      },
      {
        id: 'coll-q-match-1',
        question: 'Match the Python collections with their characteristic brackets:',
        type: 'match-following',
        options: [],
        leftItems: ['List', 'Tuple', 'Set', 'Dictionary'],
        rightItems: ['Square brackets [ ]', 'Parentheses ( )', 'Curly brackets { } with lone elements', 'Curly brackets { } with key:value pairs'],
        correctAnswer: {
          'List': 'Square brackets [ ]',
          'Tuple': 'Parentheses ( )',
          'Set': 'Curly brackets { } with lone elements',
          'Dictionary': 'Curly brackets { } with key:value pairs'
        },
        explanation: 'Square brackets define lists, parentheses define tuples, curly braces represent sets, and key-value entries represent dictionaries.',
        points: 10
      }
    ]
  },
  {
    id: 'homework-functions',
    title: 'Python Functions & Scope rules',
    description: 'Review function definitions, parameter passing, return statements, global/local scopes, and recursive functions.',
    badgeId: 'badge-recursion-legend',
    difficulty: 'Advanced',
    estimatedMinutes: 12,
    xpReward: 50,
    questions: [
      {
        id: 'funcs-q1',
        question: 'In Python, what is the default scope of a variable created INSIDE a function body, and can it be accessed directly outside the function?',
        type: 'multiple-choice',
        options: [
          'Global scope, accessible everywhere.',
          'Local scope, restricted to the function. Attempting to print it outside causes a NameError.',
          'Infinite scope, stored in system BIOS.'
        ],
        correctAnswer: 1,
        explanation: 'Variables defined inside a function belong to that function’s local namespace. They are destroyed when the function terminates and cannot be accessed externally.',
        points: 10
      },
      {
        id: 'funcs-q2',
        question: 'Identify the Base Case and the Recursive Case in this standard Board-Exam factorial function:\n```python\ndef factorial(n):\n    if n == 0 or n == 1:\n        return 1\n    else:\n        return n * factorial(n - 1)\n```',
        type: 'multiple-choice',
        options: [
          'Base Case: `return n * factorial(n - 1)` | Recursive Case: `if n == 0`',
          'Base Case: `if n == 0 or n == 1` returning 1 (the termination check) | Recursive Case: returning `n * factorial(n - 1)` (which repeats with smaller n).',
          'This function has no base case.'
        ],
        correctAnswer: 1,
        explanation: 'The base case provides a direct return value for the smallest subproblem to end the recursion. The recursive case breaks the problem down into smaller self-calls.',
        points: 10
      },
      {
        id: 'funcs-q-blank-1',
        question: 'What is the specific keyword used to declare a custom user-defined function in Python?',
        type: 'fill-in-the-blank',
        options: [],
        correctAnswer: 'def',
        explanation: 'The `def` keyword starts a function header block in Python, followed by the function name and parameter list.',
        points: 10
      },
      {
        id: 'funcs-q-drag-1',
        question: 'Complete the sentence about recursive processes:',
        type: 'drag-drop',
        options: [],
        blankSentence: 'A recursive function must always have a ______ case to prevent infinite recursive loops.',
        dragOptions: ['iterative', 'base', 'local', 'terminator'],
        correctAnswer: 'base',
        explanation: 'The base case defines the stopping condition for a recursive function, preventing infinite calls and stack overflow errors.',
        points: 10
      }
    ]
  }
];
