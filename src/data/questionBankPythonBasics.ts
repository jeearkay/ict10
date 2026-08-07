import { InteractiveQuestion, createRandomizedMCQ } from './predefinedQuestions';

export const questionBankPythonBasics: Record<string, InteractiveQuestion[]> = {
  'python-intro-idle': [
    createRandomizedMCQ(
      'python-intro-idle-q1',
      'Who created the Python programming language in 1991, naming it after "Monty Python’s Flying Circus"?',
      'Guido van Rossum',
      ['James Gosling', 'Dennis Ritchie', 'Bjarne Stroustrup'],
      'Guido van Rossum created Python in 1991.'
    ),
    {
      id: 'python-intro-idle-q2',
      question: 'Fill in the blank: Python files created in Script Mode are saved with the file extension ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '.py',
      explanation: 'Python source code files use the .py file extension.'
    },
    {
      id: 'python-intro-idle-q3',
      question: 'Identify the Python execution mode:',
      type: 'drag-drop',
      blankSentence: 'In Python IDLE, the environment showing the interactive prompt >>> where commands execute immediately is ______ Mode.',
      dragOptions: ['Interactive', 'Script', 'Compiled', 'Binary'],
      correctAnswer: 'Interactive',
      explanation: 'Interactive Mode (Python Shell with >>>) executes code line-by-line immediately.'
    },
    {
      id: 'python-intro-idle-q4',
      question: 'Match the Python mode with its primary feature:',
      type: 'match-following',
      leftItems: ['Interactive Mode (Shell)', 'Script Mode (Editor)', 'High-Level Language', 'Interpreted Language'],
      rightItems: ['Executes single commands immediately after typing', 'Saves multi-line code into .py files for re-running', 'Human-readable syntax close to natural English', 'Executes code line-by-line without explicit pre-compilation'],
      correctAnswer: {
        'Interactive Mode (Shell)': 'Executes single commands immediately after typing',
        'Script Mode (Editor)': 'Saves multi-line code into .py files for re-running',
        'High-Level Language': 'Human-readable syntax close to natural English',
        'Interpreted Language': 'Executes code line-by-line without explicit pre-compilation'
      },
      explanation: 'Core attributes of Python programming environment.'
    },
    createRandomizedMCQ(
      'python-intro-idle-q5',
      'What keyboard shortcut in Python IDLE Script Editor runs the current code module?',
      'F5',
      ['Ctrl + C', 'F1', 'F12'],
      'Pressing F5 in IDLE runs the active script.'
    ),
    createRandomizedMCQ(
      'python-intro-idle-q6',
      'Why is Python classified as a "High-Level Language"?',
      'Because its syntax uses simple, human-readable English-like words rather than binary machine code.',
      ['Because it only runs on high mountain altitudes in Bhutan.', 'Because it requires 100GB of RAM.', 'Because it was invented by high school students.'],
      'High-level languages abstract away computer hardware details with clean syntax.'
    ),
    {
      id: 'python-intro-idle-q7',
      question: 'Fill in the blank: What stands for Integrated Development and Learning Environment in Python? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'IDLE',
      explanation: 'IDLE stands for Integrated Development and Learning Environment.'
    },
    {
      id: 'python-intro-idle-q8',
      question: 'Select the prompt symbol:',
      type: 'drag-drop',
      blankSentence: 'The standard primary prompt symbol displayed in the Python Interactive Shell is ______.',
      dragOptions: ['>>>', '$$$', '===', '###'],
      correctAnswer: '>>>',
      explanation: '>>> is the primary command prompt in the Python shell.'
    },
    {
      id: 'python-intro-idle-q9',
      question: 'Match the Python feature with its definition:',
      type: 'match-following',
      leftItems: ['Cross-Platform', 'Dynamically Typed', 'Open Source'],
      rightItems: ['Runs on Windows, macOS, Linux, and Raspberry Pi', 'Variable data types are detected automatically without declaration', 'Free to download, modify, and distribute worldwide'],
      correctAnswer: {
        'Cross-Platform': 'Runs on Windows, macOS, Linux, and Raspberry Pi',
        'Dynamically Typed': 'Variable data types are detected automatically without declaration',
        'Open Source': 'Free to download, modify, and distribute worldwide'
      },
      explanation: 'Core characteristics of the Python language.'
    },
    createRandomizedMCQ(
      'python-intro-idle-q10',
      'What happens when you close Python IDLE Interactive Shell without saving your commands?',
      'All typed commands and variable values are erased from memory and lost.',
      ['IDLE automatically saves them to a .py file.', 'IDLE prints them on paper.', 'IDLE emails them to your teacher.'],
      'Interactive Shell does not persist code; scripts must be saved in .py files.'
    )
  ],

  'print-input-escape': [
    createRandomizedMCQ(
      'print-input-escape-q1',
      'What data type does the input() function return in Python by default?',
      'str (String)',
      ['int (Integer)', 'float (Floating point)', 'bool (Boolean)'],
      'input() always returns user input as a text string.'
    ),
    {
      id: 'print-input-escape-q2',
      question: 'Fill in the blank: To convert user text input from input() into an integer for math, use the typecasting function ______().',
      type: 'fill-in-the-blank',
      correctAnswer: 'int',
      explanation: 'int(input()) converts user string input into an integer number.'
    },
    {
      id: 'print-input-escape-q3',
      question: 'Select the escape sequence:',
      type: 'drag-drop',
      blankSentence: 'The escape sequence character in Python used to insert a new line break inside a string is \\______.',
      dragOptions: ['n', 't', '\\', '"'],
      correctAnswer: 'n',
      explanation: '\\n inserts a newline character.'
    },
    {
      id: 'print-input-escape-q4',
      question: 'Match the escape sequence with its visual output:',
      type: 'match-following',
      leftItems: ['\\n', '\\t', '\\\\', '\\"'],
      rightItems: ['Newline (moves to next line)', 'Horizontal Tab (inserts tab spacing)', 'Literal Backslash character', 'Literal Double Quote character'],
      correctAnswer: {
        '\\n': 'Newline (moves to next line)',
        '\\t': 'Horizontal Tab (inserts tab spacing)',
        '\\\\': 'Literal Backslash character',
        '\\"': 'Literal Double Quote character'
      },
      explanation: 'Standard Python escape sequences.'
    },
    createRandomizedMCQ(
      'print-input-escape-q5',
      'What will print("Kuzu", "Zangpo", sep="-") output to the Python console?',
      'Kuzu-Zangpo',
      ['Kuzu Zangpo', 'Kuzu\nZangpo', 'Kuzu-Zangpo-'],
      'The sep parameter specifies the separator between printed items.'
    ),
    createRandomizedMCQ(
      'print-input-escape-q6',
      'How do you prevent print("Hello") from automatically adding a newline at the end in Python?',
      'Use the end parameter: print("Hello", end="")',
      ['Use sep=""', 'Use print("\\nHello")', 'Use input("Hello")'],
      'Setting end="" overrides the default end="\\n" behavior.'
    ),
    {
      id: 'print-input-escape-q7',
      question: 'Fill in the blank: What is the output of print("Bhutan\\tICT")? Bhutan ______ ICT.',
      type: 'fill-in-the-blank',
      correctAnswer: '    ',
      explanation: '\\t inserts tab whitespace between text.'
    },
    {
      id: 'print-input-escape-q8',
      question: 'Identify the typecasting function:',
      type: 'drag-drop',
      blankSentence: 'To convert input for a decimal mark like 85.5 into a float number, use the function ______().',
      dragOptions: ['float', 'int', 'str', 'bool'],
      correctAnswer: 'float',
      explanation: 'float() converts strings or numbers into floating-point decimals.'
    },
    {
      id: 'print-input-escape-q9',
      question: 'Match the code snippet with its console output:',
      type: 'match-following',
      leftItems: ['print("A\\nB")', 'print("A\\tB")', 'print("A", "B", sep="*")', 'print("A", "B", end="!")'],
      rightItems: ['A on line 1, B on line 2', 'A and B separated by tab', 'A*B', 'A B!'],
      correctAnswer: {
        'print("A\\nB")': 'A on line 1, B on line 2',
        'print("A\\tB")': 'A and B separated by tab',
        'print("A", "B", sep="*")': 'A*B',
        'print("A", "B", end="!")': 'A B!'
      },
      explanation: 'Evaluates print() arguments and escape sequences.'
    },
    createRandomizedMCQ(
      'print-input-escape-q10',
      'What error occurs if a user types "twenty" when code executes age = int(input("Age: "))?',
      'ValueError (invalid literal for int() with base 10: "twenty")',
      ['SyntaxError', 'ZeroDivisionError', 'NameError'],
      'Converting non-numeric strings to int causes a ValueError at runtime.'
    )
  ],

  'python-string-formatting': [
    createRandomizedMCQ(
      'python-string-formatting-q1',
      'Which character prefix is placed before quotation marks to create an f-string in Python (e.g. f"Hello {name}")?',
      'f or F',
      ['$', '%', '&'],
      'f-strings begin with the prefix f or F.'
    ),
    {
      id: 'python-string-formatting-q2',
      question: 'Fill in the blank: Inside an f-string, variable names and expressions are enclosed in ______ braces like {variable}.',
      type: 'fill-in-the-blank',
      correctAnswer: 'curly',
      explanation: 'Curly braces {} evaluate variables and expressions inside f-strings.'
    },
    {
      id: 'python-string-formatting-q3',
      question: 'Select the formatting expression:',
      type: 'drag-drop',
      blankSentence: 'If name = "Karma" and score = 95, f"Student {name} scored {score}%" evaluates to "Student ______ scored 95%".',
      dragOptions: ['Karma', 'name', '{name}', 'score'],
      correctAnswer: 'Karma',
      explanation: 'f-strings replace {name} with its value "Karma".'
    },
    {
      id: 'python-string-formatting-q4',
      question: 'Match the string formatting method with its syntax style:',
      type: 'match-following',
      leftItems: ['Formatted String Literal (f-string)', 'str.format() method', '%-formatting (Legacy)'],
      rightItems: ['f"Name: {name}"', '"Name: {}".format(name)', '"Name: %s" % name'],
      correctAnswer: {
        'Formatted String Literal (f-string)': 'f"Name: {name}"',
        'str.format() method': '"Name: {}".format(name)',
        '%-formatting (Legacy)': '"Name: %s" % name'
      },
      explanation: 'Three string formatting paradigms in Python history.'
    },
    createRandomizedMCQ(
      'python-string-formatting-q5',
      'What will f"Price: {100 * 1.05:.2f}" output in Python?',
      'Price: 105.00',
      ['Price: 105', 'Price: {100 * 1.05}', 'Price: 105.0'],
      'Evaluates expression 105 and formats to 2 decimal places (.2f).'
    ),
    createRandomizedMCQ(
      'python-string-formatting-q6',
      'Why are f-strings preferred over old %-formatting or .format() in modern Python 3.6+ code?',
      'They are concise, easier to read, and evaluate expressions faster at runtime.',
      ['Because f-strings do not require quotation marks.', 'Because f-strings work on floppy disks.', 'Because old methods were banned by law.'],
      'f-strings provide superior readability and execution performance.'
    ),
    {
      id: 'python-string-formatting-q7',
      question: 'Fill in the blank: To round a float number x to 3 decimal places in an f-string, write f"{x:______f}".',
      type: 'fill-in-the-blank',
      correctAnswer: '.3',
      explanation: ':.3f formats a float value to 3 decimal places.'
    },
    {
      id: 'python-string-formatting-q8',
      question: 'Identify the evaluation result:',
      type: 'drag-drop',
      blankSentence: 'In f"Math: {5 + 5}", the expression inside curly braces evaluates to the number ______.',
      dragOptions: ['10', '5 + 5', '55', 'Error'],
      correctAnswer: '10',
      explanation: 'Expressions inside f-string braces evaluate math operators.'
    },
    {
      id: 'python-string-formatting-q9',
      question: 'Match the f-string format specifier with its output for num = 12.3456:',
      type: 'match-following',
      leftItems: ['f"{num:.1f}"', 'f"{num:.2f}"', 'f"{num:.0f}"'],
      rightItems: ['12.3', '12.35', '12'],
      correctAnswer: {
        'f"{num:.1f}"': '12.3',
        'f"{num:.2f}"': '12.35',
        'f"{num:.0f}"': '12'
      },
      explanation: 'Float precision rounding specifiers.'
    },
    createRandomizedMCQ(
      'python-string-formatting-q10',
      'What output is produced by print(f"{2026} ICT")?',
      '2026 ICT',
      ['{2026} ICT', 'f"2026 ICT"', 'Error'],
      'f-strings evaluate literal numbers inside braces.'
    )
  ],

  'python-error-types': [
    createRandomizedMCQ(
      'python-error-types-q1',
      'What type of error occurs when you forget a closing parenthesis or colon in Python code (e.g. print("Hello")?',
      'SyntaxError',
      ['RuntimeError', 'LogicalError', 'ZeroDivisionError'],
      'SyntaxError occurs when code violates Python grammatical rules and fails parsing.'
    ),
    {
      id: 'python-error-types-q2',
      question: 'Fill in the blank: An error that occurs while the program is RUNNING (such as dividing by zero) is a ______ Error.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Runtime',
      explanation: 'Runtime errors crash a running program.'
    },
    {
      id: 'python-error-types-q3',
      question: 'Select the error category:',
      type: 'drag-drop',
      blankSentence: 'When a script runs smoothly without crashing but produces INCORRECT calculated output due to faulty math logic, it has a ______ Error.',
      dragOptions: ['Logical', 'Syntax', 'Runtime', 'Indentation'],
      correctAnswer: 'Logical',
      explanation: 'Logical errors yield wrong answers without causing crash errors.'
    },
    {
      id: 'python-error-types-q4',
      question: 'Match the error type with its real-world Python example:',
      type: 'match-following',
      leftItems: ['SyntaxError', 'ZeroDivisionError (Runtime)', 'NameError (Runtime)', 'Logical Error'],
      rightItems: ['if x == 5 (Missing colon at end of if statement)', 'x = 10 / 0 (Attempting to divide by zero)', 'print(age) when variable "age" was never declared', 'Calculating rectangle area using Length + Width instead of Length * Width'],
      correctAnswer: {
        'SyntaxError': 'if x == 5 (Missing colon at end of if statement)',
        'ZeroDivisionError (Runtime)': 'x = 10 / 0 (Attempting to divide by zero)',
        'NameError (Runtime)': 'print(age) when variable "age" was never declared',
        'Logical Error': 'Calculating rectangle area using Length + Width instead of Length * Width'
      },
      explanation: 'Primary Python error categories and examples.'
    },
    createRandomizedMCQ(
      'python-error-types-q5',
      'Which error is hardest for programmers to find and fix, and why?',
      'Logical Error, because Python gives no error message or line number since the code runs fine.',
      ['SyntaxError, because it deletes the file.', 'ZeroDivisionError, because computers explode.', 'TypeError, because it converts text to audio.'],
      'Logical errors provide no automated error stack trace.'
    ),
    createRandomizedMCQ(
      'python-error-types-q6',
      'What Python error is raised by the expression "Score: " + 95?',
      'TypeError (can only concatenate str to str, not "int")',
      ['ZeroDivisionError', 'SyntaxError', 'IndentationError'],
      'Combining string and integer without str() causes a TypeError.'
    ),
    {
      id: 'python-error-types-q7',
      question: 'Fill in the blank: Incorrect indentation in a Python loop or function causes an ______ Error.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Indentation',
      explanation: 'Python uses indentation levels for block scope; incorrect spacing causes IndentationError.'
    },
    {
      id: 'python-error-types-q8',
      question: 'Identify the error type:',
      type: 'drag-drop',
      blankSentence: 'Typos in variable names like declared "total" but printing "totall" cause a ______ Error.',
      dragOptions: ['Name', 'Syntax', 'ZeroDivision', 'Logic'],
      correctAnswer: 'Name',
      explanation: 'Referencing undefined variable names raises NameError.'
    },
    {
      id: 'python-error-types-q9',
      question: 'Match the runtime error exception name with its cause:',
      type: 'match-following',
      leftItems: ['ZeroDivisionError', 'ValueError', 'IndexError'],
      rightItems: ['Dividing a number by 0', 'Passing inappropriate value to function e.g. int("abc")', 'Accessing list index beyond available length e.g. my_list[99]'],
      correctAnswer: {
        'ZeroDivisionError': 'Dividing a number by 0',
        'ValueError': 'Passing inappropriate value to function e.g. int("abc")',
        'IndexError': 'Accessing list index beyond available length e.g. my_list[99]'
      },
      explanation: 'Common runtime exception causes.'
    },
    createRandomizedMCQ(
      'python-error-types-q10',
      'How does Python IDLE help you spot Syntax Errors before running your script?',
      'By highlighting invalid code lines in red and displaying a alert box pointing out the parsing error.',
      ['By deleting the file.', 'By shutting down the computer.', 'By changing the font size to 1pt.'],
      'IDLE identifies syntax errors with red highlighting and descriptive popups.'
    )
  ],

  'python-string-methods': [
    createRandomizedMCQ(
      'python-string-methods-q1',
      'What built-in function returns the total number of characters in a string e.g. len("Bhutan")?',
      'len()',
      ['count()', 'size()', 'length()'],
      'len(string) returns character length.'
    ),
    {
      id: 'python-string-methods-q2',
      question: 'Fill in the blank: What string slicing syntax extracts the first 3 characters of text = "Bhutan"? text[:______].',
      type: 'fill-in-the-blank',
      correctAnswer: '3',
      explanation: 'text[:3] extracts indices 0, 1, 2 ("Bhu").'
    },
    {
      id: 'python-string-methods-q3',
      question: 'Select the string method:',
      type: 'drag-drop',
      blankSentence: 'To convert text = "hello" to uppercase "HELLO", use the method text.______().',
      dragOptions: ['upper', 'lower', 'strip', 'title'],
      correctAnswer: 'upper',
      explanation: 'upper() returns an uppercase copy of the string.'
    },
    {
      id: 'python-string-methods-q4',
      question: 'Match the Python string method with its action:',
      type: 'match-following',
      leftItems: ['text.upper()', 'text.lower()', 'text.strip()', 'text.replace("a", "b")'],
      rightItems: ['Converts all characters to uppercase', 'Converts all characters to lowercase', 'Removes leading and trailing whitespace', 'Replaces occurrences of "a" with "b"'],
      correctAnswer: {
        'text.upper()': 'Converts all characters to uppercase',
        'text.lower()': 'Converts all characters to lowercase',
        'text.strip()': 'Removes leading and trailing whitespace',
        'text.replace("a", "b")': 'Replaces occurrences of "a" with "b"'
      },
      explanation: 'Standard string manipulation methods.'
    },
    createRandomizedMCQ(
      'python-string-methods-q5',
      'What will " Thimphu ".strip() return in Python?',
      '"Thimphu" (removes surrounding whitespace)',
      ['"Thimphu "', '" Thimphu"', '"THIMPHU"'],
      'strip() removes leading and trailing spaces.'
    ),
    createRandomizedMCQ(
      'python-string-methods-q6',
      'What index represents the LAST character of any non-empty string in Python slicing?',
      '-1',
      ['0', '1', '100'],
      'Negative indexing -1 accesses the final character.'
    ),
    {
      id: 'python-string-methods-q7',
      question: 'Fill in the blank: What does "Python".find("th") return? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '2',
      explanation: '"Py" is 0,1; "th" starts at index 2.'
    },
    {
      id: 'python-string-methods-q8',
      question: 'Identify the string split method:',
      type: 'drag-drop',
      blankSentence: 'To split a sentence string into a list of words separated by spaces, call sentence.______().',
      dragOptions: ['split', 'join', 'slice', 'cut'],
      correctAnswer: 'split',
      explanation: 'split() breaks strings into a list of substrings.'
    },
    {
      id: 'python-string-methods-q9',
      question: 'Match the slicing expression for word = "PARO" with its result:',
      type: 'match-following',
      leftItems: ['word[0]', 'word[-1]', 'word[1:3]', 'word[::-1]'],
      rightItems: ['"P"', '"O"', '"AR"', '"ORAP" (Reversed string)'],
      correctAnswer: {
        'word[0]': '"P"',
        'word[-1]': '"O"',
        'word[1:3]': '"AR"',
        'word[::-1]': '"ORAP" (Reversed string)'
      },
      explanation: 'String indexing and step slicing results.'
    },
    createRandomizedMCQ(
      'python-string-methods-q10',
      'Are Python strings Mutable (modifiable in place) or Immutable (cannot be changed in place)?',
      'Immutable (methods like upper() return a new string rather than modifying the original in memory).',
      ['Mutable', 'Dynamic', 'Volatile'],
      'Strings are immutable data structures in Python.'
    )
  ],

  'python-variables-operators': [
    createRandomizedMCQ(
      'python-variables-operators-q1',
      'Which of the following is a VALID variable name in Python?',
      'student_score',
      ['1st_student', 'student-score', 'class'],
      'Variable names can contain letters, numbers, and underscores, but cannot start with numbers or use reserved keywords/hyphens.'
    ),
    {
      id: 'python-variables-operators-q2',
      question: 'Fill in the blank: What function returns the data type of a variable in Python? ______().',
      type: 'fill-in-the-blank',
      correctAnswer: 'type',
      explanation: 'type(var) inspects and returns data type class.'
    },
    {
      id: 'python-variables-operators-q3',
      question: 'Select the data type name:',
      type: 'drag-drop',
      blankSentence: 'Whole numbers without decimal points like 25 belong to the ______ data type in Python.',
      dragOptions: ['int', 'float', 'str', 'bool'],
      correctAnswer: 'int',
      explanation: 'int represents integer numbers.'
    },
    {
      id: 'python-variables-operators-q4',
      question: 'Match the Python value with its data type class:',
      type: 'match-following',
      leftItems: ['42', '3.14', '"Bhutan"', 'True'],
      rightItems: ['int (Integer)', 'float (Floating Point)', 'str (String)', 'bool (Boolean)'],
      correctAnswer: {
        '42': 'int (Integer)',
        '3.14': 'float (Floating Point)',
        '"Bhutan"': 'str (String)',
        'True': 'bool (Boolean)'
      },
      explanation: 'Core primitive data types in Python.'
    },
    createRandomizedMCQ(
      'python-variables-operators-q5',
      'Why is 2nd_place an INVALID variable identifier in Python?',
      'Because variable names cannot begin with a numerical digit.',
      ['Because it contains an underscore.', 'Because variable names must be uppercase.', 'Because Python forbids numbers.'],
      'Python identifier rules prohibit starting with a digit.'
    ),
    createRandomizedMCQ(
      'python-variables-operators-q6',
      'Is variable casing in Python case-sensitive (e.g. Score vs score)?',
      'Yes! Score and score are treated as two completely separate variables in memory.',
      ['No, casing is ignored.', 'No, unless using floats.', 'Only inside loops.'],
      'Python is strictly case-sensitive.'
    ),
    {
      id: 'python-variables-operators-q7',
      question: 'Fill in the blank: Reserved words in Python that cannot be used as variable names (like if, for, while) are called ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'keywords',
      explanation: 'Reserved keywords are part of language syntax and cannot be assigned as variable names.'
    },
    {
      id: 'python-variables-operators-q8',
      question: 'Identify the assignment statement:',
      type: 'drag-drop',
      blankSentence: 'To assign the value 10 to variable x in Python, write x ______ 10.',
      dragOptions: ['=', '==', ':=', '->'],
      correctAnswer: '=',
      explanation: 'Single equal sign = is the assignment operator.'
    },
    {
      id: 'python-variables-operators-q9',
      question: 'Match the invalid variable name with the rule it breaks:',
      type: 'match-following',
      leftItems: ['3d_model', 'user-name', 'for'],
      rightItems: ['Starts with a number digit', 'Contains forbidden hyphen symbol', 'Uses a reserved Python keyword'],
      correctAnswer: {
        '3d_model': 'Starts with a number digit',
        'user-name': 'Contains forbidden hyphen symbol',
        'for': 'Uses a reserved Python keyword'
      },
      explanation: 'Identifier syntax rules.'
    },
    createRandomizedMCQ(
      'python-variables-operators-q10',
      'What happens when you reassign x = 5 and then x = "Hello" in Python?',
      'Python dynamically updates x data type from int to str without error.',
      ['Python crashes with a TypeError.', 'x keeps the value 5 forever.', 'Python deletes the variable.'],
      'Python supports dynamic typing.'
    )
  ],

  'python-arithmetic-modulo': [
    createRandomizedMCQ(
      'python-arithmetic-modulo-q1',
      'What operator calculates the Modulo (remainder of division) in Python?',
      '% (Percent sign)',
      ['// (Double slash)', '/ (Single slash)', '** (Double asterisk)'],
      'Modulo operator % calculates division remainder e.g. 10 % 3 = 1.'
    ),
    {
      id: 'python-arithmetic-modulo-q2',
      question: 'Fill in the blank: What does Floor Division 17 // 5 return in Python? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '3',
      explanation: '17 // 5 performs floor division returning integer 3.'
    },
    {
      id: 'python-arithmetic-modulo-q3',
      question: 'Select the exponentiation operator:',
      type: 'drag-drop',
      blankSentence: 'To calculate 2 raised to the power of 3 (2³) in Python, write 2 ______ 3.',
      dragOptions: ['**', '^', '*', '//'],
      correctAnswer: '**',
      explanation: '** represents exponentiation (power).'
    },
    {
      id: 'python-arithmetic-modulo-q4',
      question: 'Match the arithmetic operator with its calculated output for 10 and 3:',
      type: 'match-following',
      leftItems: ['10 / 3', '10 // 3', '10 % 3', '10 ** 3'],
      rightItems: ['3.3333... (Float Division)', '3 (Integer Floor Division)', '1 (Modulo Remainder)', '1000 (Exponentiation)'],
      correctAnswer: {
        '10 / 3': '3.3333... (Float Division)',
        '10 // 3': '3 (Integer Floor Division)',
        '10 % 3': '1 (Modulo Remainder)',
        '10 ** 3': '1000 (Exponentiation)'
      },
      explanation: 'Evaluates Python arithmetic operators.'
    },
    createRandomizedMCQ(
      'python-arithmetic-modulo-q5',
      'How do you check if an integer variable num is EVEN in Python?',
      'num % 2 == 0',
      ['num // 2 == 1', 'num / 2 == 0', 'num ** 2 == 0'],
      'If num % 2 equals 0, the number divides evenly by 2 with no remainder.'
    ),
    createRandomizedMCQ(
      'python-arithmetic-modulo-q6',
      'What is the result of 2 + 3 * 4 following Python operator precedence (PEMDAS/BODMAS)?',
      '14 (multiplication before addition)',
      ['20', '24', '10'],
      'Multiplication * has higher precedence than addition +.'
    ),
    {
      id: 'python-arithmetic-modulo-q7',
      question: 'Fill in the blank: What does float division 10 / 2 return in Python 3? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '5.0',
      explanation: 'Single slash / always returns a float (5.0).'
    },
    {
      id: 'python-arithmetic-modulo-q8',
      question: 'Identify the augmented assignment operator:',
      type: 'drag-drop',
      blankSentence: 'The shortcut syntax for x = x + 5 in Python is x ______ 5.',
      dragOptions: ['+=', '==', '=+', '++'],
      correctAnswer: '+=',
      explanation: '+= is the addition assignment shortcut.'
    },
    {
      id: 'python-arithmetic-modulo-q9',
      question: 'Match the arithmetic expression with its output:',
      type: 'match-following',
      leftItems: ['15 % 4', '15 // 4', '2 ** 4', '15 - 4 * 2'],
      rightItems: ['3', '3', '16', '7'],
      correctAnswer: {
        '15 % 4': '3',
        '15 // 4': '3',
        '2 ** 4': '16',
        '15 - 4 * 2': '7'
      },
      explanation: 'Evaluates arithmetic equations.'
    },
    createRandomizedMCQ(
      'python-arithmetic-modulo-q10',
      'What will x %= 3 do if x = 11 initially?',
      'Reassigns x to 2 (11 % 3 = 2).',
      ['Reassigns x to 3.', 'Reassigns x to 3.66.', 'Error'],
      'Modulo assignment shortcut.'
    )
  ],

  'python-comparison-logical': [
    createRandomizedMCQ(
      'python-comparison-logical-q1',
      'What operator checks EQUALITY between two values in Python (e.g. x equals y)?',
      '== (Double equal sign)',
      ['= (Single equal sign)', '!=', '<>'],
      '== checks equality; single = assigns variables.'
    ),
    {
      id: 'python-comparison-logical-q2',
      question: 'Fill in the blank: What comparison operator means "Not equal to" in Python? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '!=',
      explanation: '!= represents not equal.'
    },
    {
      id: 'python-comparison-logical-q3',
      question: 'Select the membership operator:',
      type: 'drag-drop',
      blankSentence: 'To check if letter "a" exists inside string "Bhutan", use the membership expression "a" ______ "Bhutan".',
      dragOptions: ['in', 'is', '==', 'and'],
      correctAnswer: 'in',
      explanation: 'in checks item membership in sequences.'
    },
    {
      id: 'python-comparison-logical-q4',
      question: 'Match the logical operator with its boolean truth rule:',
      type: 'match-following',
      leftItems: ['and', 'or', 'not'],
      rightItems: ['Returns True only if BOTH conditions are True', 'Returns True if AT LEAST ONE condition is True', 'Inverts boolean state (True becomes False)'],
      correctAnswer: {
        'and': 'Returns True only if BOTH conditions are True',
        'or': 'Returns True if AT LEAST ONE condition is True',
        'not': 'Inverts boolean state (True becomes False)'
      },
      explanation: 'Logical boolean operators.'
    },
    createRandomizedMCQ(
      'python-comparison-logical-q5',
      'What is the difference between equality == and identity operator is in Python?',
      '== compares value equality, while is compares object memory address identity.',
      ['== is for strings, is is for floats.', 'They are identical.', 'is is used in C++ only.'],
      '== checks values; is checks object memory identities.'
    ),
    createRandomizedMCQ(
      'python-comparison-logical-q6',
      'What will evaluate to for expression: (5 > 3) and (10 < 20)?',
      'True',
      ['False', 'None', 'Error'],
      'Both 5>3 (True) and 10<20 (True) evaluate to True.'
    ),
    {
      id: 'python-comparison-logical-q7',
      question: 'Fill in the blank: What does not (10 == 10) return in Python? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'False',
      explanation: '10==10 is True; not True returns False.'
    },
    {
      id: 'python-comparison-logical-q8',
      question: 'Identify the membership expression:',
      type: 'drag-drop',
      blankSentence: 'To verify if 5 is NOT in list numbers = [1, 2, 3], write 5 ______ numbers.',
      dragOptions: ['not in', 'is not', '!=', 'out'],
      correctAnswer: 'not in',
      explanation: 'not in checks non-membership.'
    },
    {
      id: 'python-comparison-logical-q9',
      question: 'Match the expression with its evaluated boolean value:',
      type: 'match-following',
      leftItems: ['10 >= 10', '10 > 10', '"a" in "apple"', '"z" in "apple"'],
      rightItems: ['True', 'False', 'True', 'False'],
      correctAnswer: {
        '10 >= 10': 'True',
        '10 > 10': 'False',
        '"a" in "apple"': 'True',
        '"z" in "apple"': 'False'
      },
      explanation: 'Boolean evaluations.'
    },
    createRandomizedMCQ(
      'python-comparison-logical-q10',
      'What result is produced by True or False and False following logical operator precedence?',
      'True (and evaluates first: False and False -> False; then True or False -> True)',
      ['False', 'None', 'Error'],
      'and precedence is higher than or.'
    )
  ],

  'python-conditionals': [
    createRandomizedMCQ(
      'python-conditionals-q1',
      'Which keyword introduces additional conditional branches after an initial if statement in Python?',
      'elif',
      ['else if', 'elseif', 'then'],
      'elif (short for else if) tests additional conditional branches.'
    ),
    {
      id: 'python-conditionals-q2',
      question: 'Fill in the blank: What character MUST terminate every if, elif, and else statement line in Python? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: ':',
      explanation: 'Colons : mark the end of conditional header lines.'
    },
    {
      id: 'python-conditionals-q3',
      question: 'Select the conditional component:',
      type: 'drag-drop',
      blankSentence: 'The final catch-all branch that executes when all previous if and elif conditions fail is the ______ block.',
      dragOptions: ['else', 'elif', 'finally', 'default'],
      correctAnswer: 'else',
      explanation: 'else executes when no preceding conditions match.'
    },
    {
      id: 'python-conditionals-q4',
      question: 'Match the conditional structure with its usage:',
      type: 'match-following',
      leftItems: ['if statement', 'if-else statement', 'if-elif-else ladder', 'Nested if statement'],
      rightItems: ['Tests a single condition', 'Tests binary condition (choice between two options)', 'Tests multiple sequential conditions in order', 'An if statement placed inside another if statement block'],
      correctAnswer: {
        'if statement': 'Tests a single condition',
        'if-else statement': 'Tests binary condition (choice between two options)',
        'if-elif-else ladder': 'Tests multiple sequential conditions in order',
        'Nested if statement': 'An if statement placed inside another if statement block'
      },
      explanation: 'Control flow structures.'
    },
    createRandomizedMCQ(
      'python-conditionals-q5',
      'How does Python determine which code statements belong inside an if block?',
      'By statement Indentation levels (4 spaces or 1 tab).',
      ['By curly braces {}', 'By END IF keywords', 'By parenthesis ()'],
      'Python uses indentation levels for block scoping.'
    ),
    createRandomizedMCQ(
      'python-conditionals-q6',
      'Given mark = 75, what gets printed?\nif mark >= 80:\n    print("A")\nelif mark >= 70:\n    print("B")\nelse:\n    print("C")',
      'B',
      ['A', 'C', 'A and B'],
      '75 >= 80 is False, 75 >= 70 is True, so prints "B" and exits the ladder.'
    ),
    {
      id: 'python-conditionals-q7',
      question: 'Fill in the blank: What happens if mark = 95 in the previous code? It prints "______".',
      type: 'fill-in-the-blank',
      correctAnswer: 'A',
      explanation: '95 >= 80 is True, so prints "A".'
    },
    {
      id: 'python-conditionals-q8',
      question: 'Identify the missing element:',
      type: 'drag-drop',
      blankSentence: 'In Python, writing if x = 5: instead of if x == 5: causes a ______Error.',
      dragOptions: ['Syntax', 'Runtime', 'Logical', 'Type'],
      correctAnswer: 'Syntax',
      explanation: 'Using assignment = inside if conditions causes SyntaxError.'
    },
    {
      id: 'python-conditionals-q9',
      question: 'Match the ternary conditional expression syntax with its equivalent logic:',
      type: 'match-following',
      leftItems: ['status = "Pass" if mark >= 40 else "Fail"'],
      rightItems: ['Assigns "Pass" if mark is 40 or higher, otherwise "Fail"'],
      correctAnswer: {
        'status = "Pass" if mark >= 40 else "Fail"': 'Assigns "Pass" if mark is 40 or higher, otherwise "Fail"'
      },
      explanation: 'Python ternary conditional expression.'
    },
    createRandomizedMCQ(
      'python-conditionals-q10',
      'In an if-elif-else ladder, how many elif blocks are executed if both the first and second elif conditions evaluate to True?',
      'Only the FIRST matching elif block executes; Python skips all subsequent branches.',
      ['Both blocks execute.', 'None execute.', 'Python throws an error.'],
      'Python exits conditional ladders immediately after executing the first matching branch.'
    )
  ],

  'python-loops-control': [
    createRandomizedMCQ(
      'python-loops-control-q1',
      'What type of loop is used in Python when you know in advance how many times you want to iterate over a sequence?',
      'for loop',
      ['while loop', 'do-while loop', 'repeat loop'],
      'for loops perform definite iteration over sequences.'
    ),
    {
      id: 'python-loops-control-q2',
      question: 'Fill in the blank: What sequence of numbers does range(5) generate? 0, 1, 2, 3, ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '4',
      explanation: 'range(5) generates numbers from 0 up to 4 (exclusive of 5).'
    },
    {
      id: 'python-loops-control-q3',
      question: 'Select the range arguments:',
      type: 'drag-drop',
      blankSentence: 'In range(2, 10, 2), 2 is start, 10 is stop, and 2 is the ______ value.',
      dragOptions: ['step', 'limit', 'count', 'index'],
      correctAnswer: 'step',
      explanation: 'range(start, stop, step).'
    },
    {
      id: 'python-loops-control-q4',
      question: 'Match the range() call with its generated number sequence:',
      type: 'match-following',
      leftItems: ['range(3)', 'range(1, 4)', 'range(0, 6, 2)', 'range(3, 0, -1)'],
      rightItems: ['0, 1, 2', '1, 2, 3', '0, 2, 4', '3, 2, 1'],
      correctAnswer: {
        'range(3)': '0, 1, 2',
        'range(1, 4)': '1, 2, 3',
        'range(0, 6, 2)': '0, 2, 4',
        'range(3, 0, -1)': '3, 2, 1'
      },
      explanation: 'range() function outputs.'
    },
    createRandomizedMCQ(
      'python-loops-control-q5',
      'How many times will print("Hello") execute in: for i in range(1, 6): print("Hello")?',
      '5 times (for i = 1, 2, 3, 4, 5)',
      ['6 times', '4 times', '1 time'],
      'range(1, 6) runs for 5 numbers: 1, 2, 3, 4, 5.'
    ),
    createRandomizedMCQ(
      'python-loops-control-q6',
      'What gets printed by: for char in "Paro": print(char, end="-")?',
      'P-a-r-o-',
      ['Paro', 'P a r o', 'Error'],
      'Iterating strings yields individual characters.'
    ),
    {
      id: 'python-loops-control-q7',
      question: 'Fill in the blank: The built-in range function range(start, stop) excludes the ______ value.',
      type: 'fill-in-the-blank',
      correctAnswer: 'stop',
      explanation: 'range is stop-exclusive.'
    },
    {
      id: 'python-loops-control-q8',
      question: 'Identify the loop variable:',
      type: 'drag-drop',
      blankSentence: 'In for x in [10, 20, 30]: print(x), x is the loop ______ variable.',
      dragOptions: ['iterator', 'constant', 'method', 'class'],
      correctAnswer: 'iterator',
      explanation: 'x receives sequence items on each iteration.'
    },
    {
      id: 'python-loops-control-q9',
      question: 'Match the sequence with its iteration count:',
      type: 'match-following',
      leftItems: ['range(10)', 'range(5, 10)', '"Bhutan"'],
      rightItems: ['10 iterations', '5 iterations', '6 iterations (length of string)'],
      correctAnswer: {
        'range(10)': '10 iterations',
        'range(5, 10)': '5 iterations',
        '"Bhutan"': '6 iterations (length of string)'
      },
      explanation: 'Sequence iteration counts.'
    },
    createRandomizedMCQ(
      'python-loops-control-q10',
      'Can a for loop iterate backwards using a negative step e.g. range(10, 0, -1)?',
      'Yes, negative step decrements the loop variable.',
      ['No, loops only count upwards.', 'No, negative range is illegal.', 'Only with floats.'],
      'Negative step enables reverse counting.'
    )
  ],

  'python-while-loops': [
    createRandomizedMCQ(
      'python-while-loops-q1',
      'What type of iteration does a while loop perform in Python?',
      'Indefinite iteration (repeats as long as a specified boolean condition remains True).',
      ['Definite iteration', 'Static iteration', 'Single iteration'],
      'while loops perform indefinite conditional iteration.'
    ),
    {
      id: 'python-while-loops-q2',
      question: 'Fill in the blank: A while loop that never terminates because its condition is always True is an ______ loop.',
      type: 'fill-in-the-blank',
      correctAnswer: 'infinite',
      explanation: 'Infinite loops run endlessly until interrupted.'
    },
    {
      id: 'python-while-loops-q3',
      question: 'Select the loop requirement:',
      type: 'drag-drop',
      blankSentence: 'To prevent an infinite loop, statement inside the loop body must update the loop ______ variable.',
      dragOptions: ['control', 'constant', 'import', 'module'],
      correctAnswer: 'control',
      explanation: 'Updating control variables eventually makes loop condition False.'
    },
    {
      id: 'python-while-loops-q4',
      question: 'Match the while loop component with its role:',
      type: 'match-following',
      leftItems: ['Initialization (count = 1)', 'Condition (count <= 5)', 'Body (print(count))', 'Update (count += 1)'],
      rightItems: ['Sets up initial control variable value before loop starts', 'Evaluated before every iteration to check if loop continues', 'Statements executed repeatedly during each iteration', 'Modifies control variable so loop eventually terminates'],
      correctAnswer: {
        'Initialization (count = 1)': 'Sets up initial control variable value before loop starts',
        'Condition (count <= 5)': 'Evaluated before every iteration to check if loop continues',
        'Body (print(count))': 'Statements executed repeatedly during each iteration',
        'Update (count += 1)': 'Modifies control variable so loop eventually terminates'
      },
      explanation: 'Four core components of a healthy while loop.'
    },
    createRandomizedMCQ(
      'python-while-loops-q5',
      'What key combination forcefully stops an infinite while loop running in Python IDLE terminal?',
      'Ctrl + C',
      ['Ctrl + Z', 'Alt + F4', 'F5'],
      'Ctrl + C sends a KeyboardInterrupt signal.'
    ),
    createRandomizedMCQ(
      'python-while-loops-q6',
      'How many times will this execute?\nx = 5\nwhile x > 0:\n    x -= 2',
      '3 times (x becomes 3, 1, then -1 and loop terminates)',
      ['5 times', '2 times', 'Infinite'],
      '5->3->1->-1 (3 iterations).'
    ),
    {
      id: 'python-while-loops-q7',
      question: 'Fill in the blank: What is the final value of x after loop ends in previous code? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '-1',
      explanation: 'When x becomes -1, -1 > 0 is False.'
    },
    {
      id: 'python-while-loops-q8',
      question: 'Identify the condition outcome:',
      type: 'drag-drop',
      blankSentence: 'If while loop condition evaluates to False on the very first attempt, the loop body runs ______ times.',
      dragOptions: ['0', '1', 'infinite', '10'],
      correctAnswer: '0',
      explanation: 'Initial False condition skips loop body completely.'
    },
    {
      id: 'python-while-loops-q9',
      question: 'Match the loop structure with its best fit scenario:',
      type: 'match-following',
      leftItems: ['for loop', 'while loop'],
      rightItems: ['Iterating through 100 student records in a list', 'Prompting user to re-enter password until correct'],
      correctAnswer: {
        'for loop': 'Iterating through 100 student records in a list',
        'while loop': 'Prompting user to re-enter password until correct'
      },
      explanation: 'Iterative use-case selection.'
    },
    createRandomizedMCQ(
      'python-while-loops-q10',
      'What happens if you omit count += 1 in count = 1; while count <= 5: print(count)?',
      'The loop becomes infinite printing 1 forever because count never increases.',
      ['Runs 5 times', 'Error immediately', 'Runs 0 times'],
      'Omitting update statement causes infinite loops.'
    )
  ],

  'python-loop-break-continue': [
    createRandomizedMCQ(
      'python-loop-break-continue-q1',
      'Which loop control statement immediately TERMINATES the loop and jumps code execution outside?',
      'break',
      ['continue', 'pass', 'return'],
      'break exits the active loop immediately.'
    ),
    {
      id: 'python-loop-break-continue-q2',
      question: 'Fill in the blank: What statement skips the remaining code in the CURRENT iteration and jumps to the NEXT iteration? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'continue',
      explanation: 'continue skips current iteration remainder and advances to next iteration.'
    },
    {
      id: 'python-loop-break-continue-q3',
      question: 'Select the placeholder keyword:',
      type: 'drag-drop',
      blankSentence: 'The null statement in Python used as a placeholder inside empty loops or functions is ______.',
      dragOptions: ['pass', 'break', 'continue', 'null'],
      correctAnswer: 'pass',
      explanation: 'pass is a no-op placeholder.'
    },
    {
      id: 'python-loop-break-continue-q4',
      question: 'Match the loop statement with its action:',
      type: 'match-following',
      leftItems: ['break', 'continue', 'pass'],
      rightItems: ['Exits the loop entirely immediately', 'Skips rest of current iteration and moves to next', 'Placeholder doing nothing (no-operation)'],
      correctAnswer: {
        'break': 'Exits the loop entirely immediately',
        'continue': 'Skips rest of current iteration and moves to next',
        'pass': 'Placeholder doing nothing (no-operation)'
      },
      explanation: 'Loop control keywords.'
    },
    createRandomizedMCQ(
      'python-loop-break-continue-q5',
      'What numbers get printed by: for i in range(1, 6):\n    if i == 3:\n        break\n    print(i)?',
      '1, 2',
      ['1, 2, 3', '1, 2, 4, 5', '3, 4, 5'],
      'When i reaches 3, break terminates loop before printing 3.'
    ),
    createRandomizedMCQ(
      'python-loop-break-continue-q6',
      'What numbers get printed by: for i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)?',
      '1, 2, 4, 5 (skips 3)',
      ['1, 2', '3', '1, 2, 3, 4, 5'],
      'When i equals 3, continue skips printing 3 and advances to 4.'
    ),
    {
      id: 'python-loop-break-continue-q7',
      question: 'Fill in the blank: What is a loop inside another loop called? A ______ loop.',
      type: 'fill-in-the-blank',
      correctAnswer: 'nested',
      explanation: 'Nested loops place an inner loop inside an outer loop.'
    },
    {
      id: 'python-loop-break-continue-q8',
      question: 'Identify the iteration count for nested loops:',
      type: 'drag-drop',
      blankSentence: 'If outer loop runs 3 times and inner loop runs 4 times, inner loop body executes ______ times in total.',
      dragOptions: ['12', '7', '4', '3'],
      correctAnswer: '12',
      explanation: 'Total iterations = outer * inner (3 * 4 = 12).'
    },
    {
      id: 'python-loop-break-continue-q9',
      question: 'Match the loop control keyword with its scenario:',
      type: 'match-following',
      leftItems: ['break', 'continue', 'pass'],
      rightItems: ['Stop searching list once target item is found', 'Skip printing negative numbers in dataset', 'Keep empty function definition without syntax error'],
      correctAnswer: {
        'break': 'Stop searching list once target item is found',
        'continue': 'Skip printing negative numbers in dataset',
        'pass': 'Keep empty function definition without syntax error'
      },
      explanation: 'Practical usage scenarios.'
    },
    createRandomizedMCQ(
      'python-loop-break-continue-q10',
      'Does executing break inside an INNER nested loop break out of the OUTER loop too?',
      'No, break only terminates the immediate inner loop containing it.',
      ['Yes, it breaks both loops.', 'Yes, it exits Python.', 'Error'],
      'break statement only exits its immediate enclosing loop.'
    )
  ]
};
