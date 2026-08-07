export interface ICTGlossaryTerm {
  id: string;
  term: string;
  dzongkha: string;
  phonetic: string;
  category: 'Python' | 'Algorithms' | 'Cloud & Workspace' | 'Copyright & Ethics' | 'Excel & Data';
  simplifiedDefinition: string;
  bhutanContext: string;
  exampleCode: string;
  keywords: string[];
  status?: 'published' | 'draft';
}

export const ICT_GLOSSARY_TERMS: ICTGlossaryTerm[] = [
  {
    id: 'variable',
    term: 'Variable',
    dzongkha: 'འགྱུར་ཅན།',
    phonetic: 'Gyur-chen',
    category: 'Python',
    simplifiedDefinition: 'A named container in computer memory that holds data values which can change during program execution.',
    bhutanContext: 'In Class 10 ICT, variables store student details like dzongkha_marks = 85 or school = "Motithang Higher Secondary School".',
    exampleCode: `student_name = "Tashi Wangmo"\nscore = 92\npassed = True\nprint(f"{student_name} scored {score}%")`,
    keywords: ['variable', 'variables', 'assign', 'assignment', 'memory', 'store', 'container']
  },
  {
    id: 'datatype',
    term: 'Data Type',
    dzongkha: 'གནས་སྡུད་རིགས།',
    phonetic: 'Nedue Rig',
    category: 'Python',
    simplifiedDefinition: 'The classification of data telling Python what kind of value a variable holds (e.g. integer, decimal, text, boolean).',
    bhutanContext: 'Used when declaring Bhutanese population numbers (int), Thimphu temperature (float), or student names (str).',
    exampleCode: `age = 16          # int (whole number)\nheight = 165.5    # float (decimal)\nname = "Karma"    # str (string text)\nis_passed = True  # bool (boolean)`,
    keywords: ['data type', 'datatype', 'int', 'float', 'str', 'string', 'bool', 'type']
  },
  {
    id: 'conditional',
    term: 'Conditional Statement (If-Else)',
    dzongkha: 'གནས་སྟངས་རྩིས་ཞིབ།',
    phonetic: 'Netshang Tsi-zhib',
    category: 'Python',
    simplifiedDefinition: 'A decision-making structure that executes specific code blocks only if a given condition evaluates to True or False.',
    bhutanContext: 'Checking Bhutan BCSEA exam grades: IF marks >= 40 THEN print("Passed Class 10 ICT") ELSE print("Needs Re-assessment").',
    exampleCode: `ict_score = 78\nif ict_score >= 80:\n    print("Grade A - Excellent!")\nelif ict_score >= 40:\n    print("Passed")\nelse:\n    print("Failed")`,
    keywords: ['conditional', 'conditionals', 'if', 'else', 'elif', 'decision', 'branching']
  },
  {
    id: 'loop',
    term: 'Loop (Iteration)',
    dzongkha: 'སྐྱར་འཁོར།',
    phonetic: 'Kyarkhor',
    category: 'Python',
    simplifiedDefinition: 'A control structure that repeats a block of code multiple times until a stopping condition is met (FOR and WHILE loops).',
    bhutanContext: 'Iterating through a list of all 20 Dzongkhags in Bhutan to calculate regional ICT statistics.',
    exampleCode: `dzongkhags = ["Thimphu", "Paro", "Punakha", "Bumthang"]\nfor place in dzongkhags:\n    print(f"Checking ICT lab status in {place}...")`,
    keywords: ['loop', 'loops', 'iteration', 'for', 'while', 'repeat', 'iterating']
  },
  {
    id: 'function',
    term: 'Function',
    dzongkha: 'ལས་ཐབས།',
    phonetic: 'Lethab',
    category: 'Python',
    simplifiedDefinition: 'A named, reusable block of code that performs a specific task when called, optionally taking inputs (parameters) and returning a output.',
    bhutanContext: 'Creating a custom function calculate_gnh_index() or convert_ngultrum_to_usd() in Class 10 projects.',
    exampleCode: `def convert_nu_to_usd(nu_amount):\n    usd_rate = 83.5\n    return round(nu_amount / usd_rate, 2)\n\nprint("Nu 5000 =", convert_nu_to_usd(5000), "USD")`,
    keywords: ['function', 'functions', 'def', 'return', 'parameter', 'argument', 'method']
  },
  {
    id: 'list',
    term: 'List (Array)',
    dzongkha: 'ཐོ་ཡིག',
    phonetic: 'Thoyig',
    category: 'Python',
    simplifiedDefinition: 'An ordered, mutable collection of items enclosed in square brackets [] that can hold multiple values under one variable.',
    bhutanContext: 'Storing a list of Class 10 subjects: ["ICT", "Dzongkha", "English", "Mathematics", "Science"].',
    exampleCode: `subjects = ["ICT", "Dzongkha", "English", "Maths"]\nsubjects.append("History")\nprint("First subject:", subjects[0])  # ICT\nprint("Total subjects:", len(subjects))`,
    keywords: ['list', 'lists', 'array', 'append', 'index', 'element', 'collection']
  },
  {
    id: 'dictionary',
    term: 'Dictionary',
    dzongkha: 'ཚིག་མཛོད།',
    phonetic: 'Tsigdzod',
    category: 'Python',
    simplifiedDefinition: 'An unordered collection of key-value pairs written inside curly braces {} used to store structured records.',
    bhutanContext: 'Storing a Bhutanese student profile with keys like "cid", "name", "dzongkhag", and "ict_mark".',
    exampleCode: `student = {\n    "cid": "11501002345",\n    "name": "Pema Choden",\n    "dzongkhag": "Bumthang",\n    "score": 88\n}\nprint(student["name"], "from", student["dzongkhag"])`,
    keywords: ['dictionary', 'dictionaries', 'dict', 'key', 'value', 'hashmap', 'lookup']
  },
  {
    id: 'algorithm',
    term: 'Algorithm',
    dzongkha: 'རྩིས་ཐབས།',
    phonetic: 'Tsithab',
    category: 'Algorithms',
    simplifiedDefinition: 'A clear, step-by-step set of logical rules or instructions designed to solve a specific problem or complete a computation.',
    bhutanContext: 'Step-by-step recipe to prepare Bhutanese Suja (Butter Tea) or the logic to calculate school merit rank.',
    exampleCode: `# Algorithm to find Highest Mark in Class:\n# 1. Start with max_mark = 0\n# 2. For each student mark in class list:\n# 3.   If mark > max_mark then max_mark = mark\n# 4. Return max_mark`,
    keywords: ['algorithm', 'algorithms', 'step-by-step', 'flowchart', 'pseudocode', 'logic']
  },
  {
    id: 'syntax_error',
    term: 'Syntax Error',
    dzongkha: 'བརྡ་སྦྱོར་ནོར་འཁྲུལ།',
    phonetic: 'Dashor Nortrul',
    category: 'Python',
    simplifiedDefinition: 'An error caused by breaking Python syntax rules (like a typo or missing symbol) preventing the code from compiling or running.',
    bhutanContext: 'Common in Class 10 when students forget a colon (:) after an if statement or leave quotes unclosed.',
    exampleCode: `# INCORRECT (SyntaxError - missing colon):\n# if age >= 18\n#     print("Eligible")\n\n# CORRECT:\nif age >= 18:\n    print("Eligible to vote in Bhutan")`,
    keywords: ['syntax', 'syntax error', 'error', 'bug', 'colon', 'typo', 'indentation error']
  },
  {
    id: 'indentation',
    term: 'Indentation',
    dzongkha: 'ཁེ་སྐྱེད་ཚད་གཞི།',
    phonetic: 'Kheyey Tshadzhi',
    category: 'Python',
    simplifiedDefinition: 'Spaces at the beginning of a code line used in Python to define code blocks inside loops, functions, and conditionals.',
    bhutanContext: 'In Python, 4 spaces are required inside functions or loops. Missing indentation causes an IndentationError.',
    exampleCode: `def welcome_student():\n    # 4 spaces indentation required here:\n    print("Kuzuzangpo la!")\n    print("Welcome to Class 10 ICT Lab")`,
    keywords: ['indentation', 'indent', 'spaces', 'tab', 'block', 'scope']
  },
  {
    id: 'boolean',
    term: 'Boolean',
    dzongkha: 'བདེན་མེད་རྩིས་རིག',
    phonetic: 'Denme Tsirig',
    category: 'Python',
    simplifiedDefinition: 'A data type that can only have one of two possible values: True or False.',
    bhutanContext: 'Checking citizen status: is_bhutanese = True or has_access_to_e_learning = True.',
    exampleCode: `is_bhutanese = True\nhas_passed_ict = False\n\nif is_bhutanese and not has_passed_ict:\n    print("Retake ICT practical exam")`,
    keywords: ['boolean', 'bool', 'true', 'false', 'flag', 'binary logic']
  },
  {
    id: 'recursion',
    term: 'Recursion',
    dzongkha: 'རང་འཁོར་ལས་ཐབས།',
    phonetic: 'Rangkhor Lethab',
    category: 'Algorithms',
    simplifiedDefinition: 'A programming technique where a function calls itself directly or indirectly to solve smaller instances of the same problem.',
    bhutanContext: 'Calculating factorial numbers or traversing family ancestry trees in Bhutanese historical records.',
    exampleCode: `def factorial(n):\n    if n == 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint("5! =", factorial(5))  # Output: 120`,
    keywords: ['recursion', 'recursive', 'base case', 'self calling', 'factorial']
  },
  {
    id: 'cloud_services',
    term: 'Cloud Services (IaaS, PaaS, SaaS)',
    dzongkha: 'སྤྲིན་ཕུང་ ཞབས་ཏོག',
    phonetic: 'Trinpung Zhabtog',
    category: 'Cloud & Workspace',
    simplifiedDefinition: 'Computing services like servers, storage, networking, and software delivered on-demand over the internet.',
    bhutanContext: 'Ministry of Education storing e-Learning learning materials on Google Drive / Cloud so students across Bhutan can access them anytime.',
    exampleCode: `IaaS: Infrastructure (Virtual Machines, Storage)\nPaaS: Platform for Developers\nSaaS: Software apps (Google Docs, Gmail, Sheets)`,
    keywords: ['cloud', 'iaas', 'paas', 'saas', 'cloud computing', 'google drive', 'server']
  },
  {
    id: 'google_workspace',
    term: 'Google Workspace & Co-Authoring',
    dzongkha: 'གུ་གལ་ ལས་ཡུལ།',
    phonetic: 'Gugal Layul',
    category: 'Cloud & Workspace',
    simplifiedDefinition: 'A suite of cloud productivity tools (Docs, Sheets, Slides, Forms) enabling real-time collaboration and auto-saving.',
    bhutanContext: 'Class 10 students co-authoring group project reports in Google Docs simultaneously during ICT lab.',
    exampleCode: `Features: Real-time co-authoring, version history, comment suggestions, permission control (Viewer, Commenter, Editor).`,
    keywords: ['google workspace', 'docs', 'sheets', 'slides', 'co-authoring', 'collaboration']
  },
  {
    id: 'copyright_citations',
    term: 'Copyright, Citations & Ethics',
    dzongkha: 'པར་དབང་དང་ ཁུངས་གཏུགས།',
    phonetic: 'Parwang dang Khungtug',
    category: 'Copyright & Ethics',
    simplifiedDefinition: 'Legal rights protecting creators of digital content and rules for properly acknowledging ownership (APA, MLA) to prevent plagiarism.',
    bhutanContext: 'Following Bhutan Intellectual Property Law and citing online sources when preparing Class 10 research papers.',
    exampleCode: `APA Citation Format:\nAuthor, A. A. (Year). Title of work. Publisher / URL.\nExample: Ministry of Education. (2026). Class 10 ICT Curriculum Guide.`,
    keywords: ['copyright', 'citation', 'plagiarism', 'fair use', 'creative commons', 'ownership']
  },
  {
    id: 'spreadsheet',
    term: 'Spreadsheet (MS Excel / Sheets)',
    dzongkha: 'ཤོག་ཁྲམ།',
    phonetic: 'Shokthram',
    category: 'Excel & Data',
    simplifiedDefinition: 'An interactive grid software of rows and columns used to organize data, perform automated mathematical formulas, and plot charts.',
    bhutanContext: 'Teachers calculating student term averages across Dzongkha, ICT, English, and Science subjects.',
    exampleCode: `=SUM(B2:B30)      # Calculates total marks\n=AVERAGE(C2:C30)  # Finds average score\n=IF(D2>=40, "Pass", "Fail")`,
    keywords: ['spreadsheet', 'excel', 'sheets', 'formula', 'cell', 'row', 'column', 'sum', 'average']
  },
  {
    id: 'vlookup',
    term: 'VLOOKUP / XLOOKUP',
    dzongkha: 'འཚོལ་ཞིབ་ལས་ཐབས།',
    phonetic: 'Tsholzhib Lethab',
    category: 'Excel & Data',
    simplifiedDefinition: 'Excel functions used to search for a specific lookup value in a table column and retrieve matching information from another column.',
    bhutanContext: 'Looking up a student CID in an Excel master sheet to automatically display their exam roll number and school.',
    exampleCode: `=VLOOKUP("11501001234", A2:E100, 3, FALSE)\n# Searches CID in col A and returns Name from col 3`,
    keywords: ['vlookup', 'xlookup', 'lookup', 'excel formula', 'search cell', 'reference']
  },
  {
    id: 'cybersecurity',
    term: 'Cybersecurity & Phishing',
    dzongkha: 'ཡོངས་འབྲེལ་སྲུང་སྐྱོབ།',
    phonetic: 'Yongdrel Sungkyob',
    category: 'Copyright & Ethics',
    simplifiedDefinition: 'The practice of protecting digital devices, networks, and personal privacy from unauthorized access and online scams.',
    bhutanContext: 'Following Bhutan Cyber Security Guidelines: keeping passwords confidential, avoiding public Wi-Fi risks, and avoiding fake BoB SMS.',
    exampleCode: `# Security Best Practices:\n# 1. Use 12+ character mixed passwords (e.g. Thimphu@2026!)\n# 2. Enable Two-Factor Authentication (2FA)\n# 3. Never share OTP codes or CID details online`,
    keywords: ['cybersecurity', 'cyber', 'security', 'privacy', 'ethics', 'password', 'phishing']
  },
  {
    id: 'flowchart',
    term: 'Flowchart',
    dzongkha: 'བྱ་རིམ་དཔེ་རིས།',
    phonetic: 'Jarim Peri',
    category: 'Algorithms',
    simplifiedDefinition: 'A visual diagram representing an algorithm or step-by-step process using standard geometric shapes (ovals, rectangles, diamonds, parallelograms).',
    bhutanContext: 'Class 10 ICT Chapter 3 requires students to draw flowcharts before writing Python programs for BCSEA exam questions.',
    exampleCode: `[Start Oval] -> [Input Mark Parallelogram] -> <Is Mark >= 40? Diamond> -> (Yes: Print Pass) / (No: Print Fail) -> [End Oval]`,
    keywords: ['flowchart', 'diagram', 'algorithm', 'decision', 'process', 'oval', 'diamond', 'rectangle']
  },
  {
    id: 'pseudocode',
    term: 'Pseudocode',
    dzongkha: 'བརྡ་རྩིས་ཚིག་ཡིག',
    phonetic: 'Datsi Tsigyig',
    category: 'Algorithms',
    simplifiedDefinition: 'An informal, plain-English outline of a computer algorithm that skips strict syntax rules to plan program logic easily.',
    bhutanContext: 'Used in Class 10 Bhutan ICT curriculum guides to map logic before coding in Python.',
    exampleCode: `BEGIN\n  INPUT score\n  IF score >= 40 THEN\n    PRINT "Pass Class 10 ICT"\n  ELSE\n    PRINT "Fail"\n  ENDIF\nEND`,
    keywords: ['pseudocode', 'logic outline', 'algorithm', 'plan', 'begin', 'input', 'endif']
  },
  {
    id: 'database',
    term: 'Database & SQL',
    dzongkha: 'གནས་སྡུད་མཛོད།',
    phonetic: 'Nedue Dzod',
    category: 'Cloud & Workspace',
    simplifiedDefinition: 'An organized collection of structured data stored electronically in a computer system for fast querying, filtering, and retrieval.',
    bhutanContext: 'Centralized databases used by the Ministry of Education for storing student marks and school enrollment across Bhutan.',
    exampleCode: `SELECT student_name, ict_mark FROM class_10_results WHERE ict_mark >= 80 ORDER BY ict_mark DESC;`,
    keywords: ['database', 'db', 'sql', 'query', 'table', 'record', 'select', 'where']
  },
  {
    id: 'parameter',
    term: 'Function Parameter & Argument',
    dzongkha: 'ལས་ཐབས་ཚད་གཞི།',
    phonetic: 'Lethab Tshadzhi',
    category: 'Python',
    simplifiedDefinition: 'Parameters are variables listed in a function definition; arguments are the actual values passed into the function when called.',
    bhutanContext: 'Passing student names and scores into custom reporting functions in Python.',
    exampleCode: `def print_report(student_name, mark):  # student_name & mark are parameters\n    print(f"Student: {student_name}, Mark: {mark}")\n\nprint_report("Sangay", 88)  # "Sangay" & 88 are arguments`,
    keywords: ['parameter', 'parameters', 'argument', 'arguments', 'pass value', 'def']
  },
  {
    id: 'cyber_ethics',
    term: 'Netiquette & Digital Citizenship',
    dzongkha: 'ཡོངས་འབྲེལ་ཀུན་སྤྱོད།',
    phonetic: 'Yongdrel Kunchod',
    category: 'Copyright & Ethics',
    simplifiedDefinition: 'The code of respectful, ethical, and responsible conduct expected from users when communicating on the internet and digital platforms.',
    bhutanContext: 'Promoting GNH (Gross National Happiness) values online: kindness, respectful debate, avoiding cyberbullying and fake news.',
    exampleCode: `# Netiquette Rules:\n# 1. Be polite in online study forums\n# 2. Never share unverified rumors\n# 3. Respect copyright and credit creators`,
    keywords: ['netiquette', 'ethics', 'digital citizenship', 'gnh', 'online behavior', 'respect']
  }
];

export function findGlossaryTerm(searchQuery: string): ICTGlossaryTerm | undefined {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return undefined;

  return ICT_GLOSSARY_TERMS.find((t) => {
    if (t.id.toLowerCase() === query) return true;
    if (t.term.toLowerCase() === query) return true;
    return t.keywords.some((k) => k.toLowerCase() === query || query.includes(k.toLowerCase()));
  });
}
