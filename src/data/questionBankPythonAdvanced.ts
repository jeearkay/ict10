import { InteractiveQuestion, createRandomizedMCQ } from './predefinedQuestions';

export const questionBankPythonAdvanced: Record<string, InteractiveQuestion[]> = {
  'python-lists': [
    createRandomizedMCQ(
      'python-lists-q1',
      'Which brackets are used to define a List in Python (e.g. fruits = ["Apple", "Mango"])?',
      'Square brackets []',
      ['Parentheses ()', 'Curly braces {}', 'Angle brackets <>'],
      'Python lists are enclosed in square brackets [].'
    ),
    {
      id: 'python-lists-q2',
      question: 'Fill in the blank: Are Python lists Mutable (modifiable) or Immutable? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Mutable',
      explanation: 'Lists are mutable; elements can be modified, added, or removed in place.'
    },
    {
      id: 'python-lists-q3',
      question: 'Select the index number:',
      type: 'drag-drop',
      blankSentence: 'The index number of the FIRST item in a Python list items = ["a", "b", "c"] is ______.',
      dragOptions: ['0', '1', '-1', 'first'],
      correctAnswer: '0',
      explanation: 'Python uses zero-based indexing.'
    },
    {
      id: 'python-lists-q4',
      question: 'Match the list property with its description:',
      type: 'match-following',
      leftItems: ['Ordered', 'Mutable', 'Heterogeneous', 'Indexed'],
      rightItems: ['Items maintain defined insertion order', 'Elements can be modified in place', 'Can store mixed data types (int, str, float)', 'Items are accessed via numerical position numbers'],
      correctAnswer: {
        'Ordered': 'Items maintain defined insertion order',
        'Mutable': 'Elements can be modified in place',
        'Heterogeneous': 'Can store mixed data types (int, str, float)',
        'Indexed': 'Items are accessed via numerical position numbers'
      },
      explanation: 'Core attributes of Python list data structures.'
    },
    createRandomizedMCQ(
      'python-lists-q5',
      'What will items[1] return for items = [10, 20, 30, 40]?',
      '20',
      ['10', '30', 'Error'],
      'Index 0 is 10; index 1 is 20.'
    ),
    createRandomizedMCQ(
      'python-lists-q6',
      'How do you access the LAST item of a list numbers = [5, 10, 15, 20] using negative indexing?',
      'numbers[-1]',
      ['numbers[0]', 'numbers[4]', 'numbers[-0]'],
      'Negative index -1 references the last element.'
    ),
    {
      id: 'python-lists-q7',
      question: 'Fill in the blank: What does len([1, 2, 3, 4, 5]) return? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '5',
      explanation: 'len() returns total count of elements.'
    },
    {
      id: 'python-lists-q8',
      question: 'Identify the slicing result:',
      type: 'drag-drop',
      blankSentence: 'For nums = [10, 20, 30, 40, 50], nums[1:3] returns list [20, ______].',
      dragOptions: ['30', '40', '10', '50'],
      correctAnswer: '30',
      explanation: 'Slicing [1:3] includes index 1 (20) and index 2 (30).'
    },
    {
      id: 'python-lists-q9',
      question: 'Match the list operation with its result for lst = [1, 2, 3]:',
      type: 'match-following',
      leftItems: ['lst + [4, 5]', 'lst * 2', '3 in lst', '9 in lst'],
      rightItems: ['[1, 2, 3, 4, 5] (Concatenation)', '[1, 2, 3, 1, 2, 3] (Repetition)', 'True (Membership)', 'False (Membership)'],
      correctAnswer: {
        'lst + [4, 5]': '[1, 2, 3, 4, 5] (Concatenation)',
        'lst * 2': '[1, 2, 3, 1, 2, 3] (Repetition)',
        '3 in lst': 'True (Membership)',
        '9 in lst': 'False (Membership)'
      },
      explanation: 'List operators.'
    },
    createRandomizedMCQ(
      'python-lists-q10',
      'What happens when you execute nums[0] = 99 on list nums = [1, 2, 3]?',
      'Replaces the first element in place so nums becomes [99, 2, 3].',
      ['Appends 99 to the end.', 'Causes TypeError.', 'Creates a new string.'],
      'Lists are mutable and allow direct index modification.'
    )
  ],

  'python-list-methods': [
    createRandomizedMCQ(
      'python-list-methods-q1',
      'Which list method appends a single new item to the END of a list in place?',
      'append()',
      ['insert()', 'extend()', 'add()'],
      'append(item) adds an element to the end of the list.'
    ),
    {
      id: 'python-list-methods-q2',
      question: 'Fill in the blank: The list method that inserts an element at a specific index position is ______(index, item).',
      type: 'fill-in-the-blank',
      correctAnswer: 'insert',
      explanation: 'insert(index, item) inserts element at index position.'
    },
    {
      id: 'python-list-methods-q3',
      question: 'Select the deletion method:',
      type: 'drag-drop',
      blankSentence: 'The list method that removes and returns the item at a specific index (or last item if unspecified) is ______()',
      dragOptions: ['pop', 'remove', 'clear', 'del'],
      correctAnswer: 'pop',
      explanation: 'pop([index]) removes and returns element.'
    },
    {
      id: 'python-list-methods-q4',
      question: 'Match the Python list method with its operation:',
      type: 'match-following',
      leftItems: ['lst.append(x)', 'lst.remove(x)', 'lst.sort()', 'lst.reverse()'],
      rightItems: ['Adds item x to the end', 'Removes the first occurrence of item x by value', 'Sorts elements in ascending order in place', 'Reverses element order in place'],
      correctAnswer: {
        'lst.append(x)': 'Adds item x to the end',
        'lst.remove(x)': 'Removes the first occurrence of item x by value',
        'lst.sort()': 'Sorts elements in ascending order in place',
        'lst.reverse()': 'Reverses element order in place'
      },
      explanation: 'Standard built-in list methods.'
    },
    createRandomizedMCQ(
      'python-list-methods-q5',
      'What is the difference between append() and extend() methods in Python lists?',
      'append() adds its argument as a single element, while extend() iterates over its argument adding each item individually.',
      ['append() works on floats; extend() works on strings.', 'They are identical.', 'extend() deletes elements.'],
      'append vs extend collection handling.'
    ),
    createRandomizedMCQ(
      'python-list-methods-q6',
      'What happens if you call nums.remove(99) when 99 is NOT present in list nums = [1, 2, 3]?',
      'Raises a ValueError (list.remove(x): x not in list)',
      ['Does nothing silently.', 'Removes index 0.', 'Returns None.'],
      'remove() raises ValueError if value is missing.'
    ),
    {
      id: 'python-list-methods-q7',
      question: 'Fill in the blank: To remove ALL elements from a list leaving it empty [], call lst.______().',
      type: 'fill-in-the-blank',
      correctAnswer: 'clear',
      explanation: 'clear() empties the list in place.'
    },
    {
      id: 'python-list-methods-q8',
      question: 'Identify the sorting argument:',
      type: 'drag-drop',
      blankSentence: 'To sort a list in DESCENDING order in place, call lst.sort(______=True).',
      dragOptions: ['reverse', 'descending', 'order', 'sort'],
      correctAnswer: 'reverse',
      explanation: 'sort(reverse=True) sorts descending.'
    },
    {
      id: 'python-list-methods-q9',
      question: 'Match the list method with its returned value:',
      type: 'match-following',
      leftItems: ['lst.index(x)', 'lst.count(x)', 'lst.pop()'],
      rightItems: ['Returns index position of first occurrence of x', 'Returns total count of occurrences of x in list', 'Returns the removed element'],
      correctAnswer: {
        'lst.index(x)': 'Returns index position of first occurrence of x',
        'lst.count(x)': 'Returns total count of occurrences of x in list',
        'lst.pop()': 'Returns the removed element'
      },
      explanation: 'Return behaviors of list methods.'
    },
    createRandomizedMCQ(
      'python-list-methods-q10',
      'Does calling lst.sort() return a new sorted list or modify the original list in place?',
      'Modifies the original list in place and returns None.',
      ['Returns a new sorted list.', 'Converts list to tuple.', 'Error'],
      'lst.sort() operates in place returning None.'
    )
  ],

  'python-tuples-sets': [
    createRandomizedMCQ(
      'python-tuples-sets-q1',
      'Which enclosing symbols are used to define a Tuple in Python (e.g. point = (10, 20))?',
      'Parentheses ()',
      ['Square brackets []', 'Curly braces {}', 'Angle brackets <>'],
      'Tuples use parentheses ().'
    ),
    {
      id: 'python-tuples-sets-q2',
      question: 'Fill in the blank: Are Python tuples Mutable or Immutable? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Immutable',
      explanation: 'Tuples are immutable; elements cannot be modified or re-assigned after creation.'
    },
    {
      id: 'python-tuples-sets-q3',
      question: 'Select the tuple syntax rule:',
      type: 'drag-drop',
      blankSentence: 'To create a tuple with a SINGLE element 10, you MUST include a trailing ______, writing t = (10,).',
      dragOptions: ['comma', 'colon', 'semicolon', 'period'],
      correctAnswer: 'comma',
      explanation: 'Single element tuple requires trailing comma (10,).'
    },
    {
      id: 'python-tuples-sets-q4',
      question: 'Match the collection with its immutability trait:',
      type: 'match-following',
      leftItems: ['List', 'Tuple', 'Set', 'String'],
      rightItems: ['Mutable (Ordered)', 'Immutable (Ordered)', 'Mutable (Unordered, Unique)', 'Immutable (Text Sequence)'],
      correctAnswer: {
        'List': 'Mutable (Ordered)',
        'Tuple': 'Immutable (Ordered)',
        'Set': 'Mutable (Unordered, Unique)',
        'String': 'Immutable (Text Sequence)'
      },
      explanation: 'Data structure mutability comparison.'
    },
    createRandomizedMCQ(
      'python-tuples-sets-q5',
      'Why are Tuples used instead of Lists for read-only data like GPS coordinates (27.47, 89.63)?',
      'Tuples protect data from accidental modification and process faster in memory.',
      ['Tuples can store more data.', 'Tuples do not use numbers.', 'Lists are forbidden on laptops.'],
      'Immutability guarantees data integrity and performance optimization.'
    ),
    createRandomizedMCQ(
      'python-tuples-sets-q6',
      'What happens if you attempt t = (1, 2, 3); t[0] = 99 in Python?',
      'Raises a TypeError (\'tuple\' object does not support item assignment)',
      ['Updates first element to 99.', 'Converts tuple to list.', 'Deletes tuple.'],
      'Tuples do not permit item assignment.'
    ),
    {
      id: 'python-tuples-sets-q7',
      question: 'Fill in the blank: Unpacking a tuple point = (5, 10) into variables x, y = point assigns x = ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '5',
      explanation: 'Tuple unpacking assigns elements sequentially.'
    },
    {
      id: 'python-tuples-sets-q8',
      question: 'Identify the conversion function:',
      type: 'drag-drop',
      blankSentence: 'To convert a list lst = [1, 2, 3] into an immutable tuple, call ______(lst).',
      dragOptions: ['tuple', 'list', 'set', 'dict'],
      correctAnswer: 'tuple',
      explanation: 'tuple() converts iterables to tuples.'
    },
    {
      id: 'python-tuples-sets-q9',
      question: 'Match the data type with its literal definition syntax:',
      type: 'match-following',
      leftItems: ['x = [1, 2]', 'x = (1, 2)', 'x = {1, 2}', 'x = {"a": 1}'],
      rightItems: ['List', 'Tuple', 'Set', 'Dictionary'],
      correctAnswer: {
        'x = [1, 2]': 'List',
        'x = (1, 2)': 'Tuple',
        'x = {1, 2}': 'Set',
        'x = {"a": 1}': 'Dictionary'
      },
      explanation: 'Literal syntax symbols for collection types.'
    },
    createRandomizedMCQ(
      'python-tuples-sets-q10',
      'What will type((10)) return versus type((10,))?',
      'type((10)) returns int; type((10,)) returns tuple.',
      ['Both return tuple.', 'Both return int.', 'Error'],
      'Parentheses without comma evaluate as grouping operator.'
    )
  ],

  'python-set-operations': [
    createRandomizedMCQ(
      'python-set-operations-q1',
      'What is the primary defining characteristic of a Set in Python (e.g. s = {1, 2, 3})?',
      'Unordered collection containing UNIQUE elements (automatically eliminates duplicates).',
      ['Ordered collection with duplicates allowed.', 'Key-value mapping.', 'Immutable list.'],
      'Sets store unique unordered elements.'
    ),
    {
      id: 'python-set-operations-q2',
      question: 'Fill in the blank: What will set([1, 2, 2, 3, 3, 3]) evaluate to? {1, 2, ______}.',
      type: 'fill-in-the-blank',
      correctAnswer: '3',
      explanation: 'set() automatically removes duplicate items.'
    },
    {
      id: 'python-set-operations-q3',
      question: 'Select the set operator:',
      type: 'drag-drop',
      blankSentence: 'The Union operation combining all elements from set A and set B uses the pipe operator A ______ B.',
      dragOptions: ['|', '&', '-', '^'],
      correctAnswer: '|',
      explanation: 'Pipe | operator performs set union.'
    },
    {
      id: 'python-set-operations-q4',
      question: 'Match the set mathematical operation with its symbol and meaning:',
      type: 'match-following',
      leftItems: ['Union (A | B)', 'Intersection (A & B)', 'Difference (A - B)', 'Symmetric Difference (A ^ B)'],
      rightItems: ['Combines all elements from both sets', 'Returns only elements present in BOTH sets', 'Returns elements in A but NOT in B', 'Returns elements in EITHER set but NOT in both'],
      correctAnswer: {
        'Union (A | B)': 'Combines all elements from both sets',
        'Intersection (A & B)': 'Returns only elements present in BOTH sets',
        'Difference (A - B)': 'Returns elements in A but NOT in B',
        'Symmetric Difference (A ^ B)': 'Returns elements in EITHER set but NOT in both'
      },
      explanation: 'Set theory operations in Python.'
    },
    createRandomizedMCQ(
      'python-set-operations-q5',
      'Given set A = {1, 2, 3} and set B = {2, 3, 4}, what is A & B (Intersection)?',
      '{2, 3}',
      ['{1, 2, 3, 4}', '{1}', '{4}'],
      'Intersection returns elements common to both sets ({2, 3}).'
    ),
    createRandomizedMCQ(
      'python-set-operations-q6',
      'Given set A = {1, 2, 3} and set B = {2, 3, 4}, what is A - B (Difference)?',
      '{1}',
      ['{4}', '{2, 3}', '{1, 4}'],
      'Difference A - B returns items in A that are not in B ({1}).'
    ),
    {
      id: 'python-set-operations-q7',
      question: 'Fill in the blank: To add a single element x to a set s in place, call s.______(x).',
      type: 'fill-in-the-blank',
      correctAnswer: 'add',
      explanation: 'add(x) adds element to set.'
    },
    {
      id: 'python-set-operations-q8',
      question: 'Identify the set creation method for empty set:',
      type: 'drag-drop',
      blankSentence: 'To create an EMPTY set in Python, you MUST use s = ______() because {} creates an empty dictionary.',
      dragOptions: ['set', 'dict', 'list', 'tuple'],
      correctAnswer: 'set',
      explanation: 'set() creates empty set; {} creates empty dictionary.'
    },
    {
      id: 'python-set-operations-q9',
      question: 'Match the set method with its behavior:',
      type: 'match-following',
      leftItems: ['s.add(x)', 's.remove(x)', 's.discard(x)'],
      rightItems: ['Inserts element x into set', 'Removes x; raises KeyError if x missing', 'Removes x; does NOT raise error if x missing'],
      correctAnswer: {
        's.add(x)': 'Inserts element x into set',
        's.remove(x)': 'Removes x; raises KeyError if x missing',
        's.discard(x)': 'Removes x; does NOT raise error if x missing'
      },
      explanation: 'Set modification methods.'
    },
    createRandomizedMCQ(
      'python-set-operations-q10',
      'Can you access set elements using index numbers like s[0]?',
      'No, sets are unordered and unindexed; indexing s[0] raises TypeError.',
      ['Yes, same as lists.', 'Yes, using negative index.', 'Only with numbers.'],
      'Sets do not support numerical indexing.'
    )
  ],

  'python-dictionaries': [
    createRandomizedMCQ(
      'python-dictionaries-q1',
      'What structure does a Dictionary store data in Python (e.g. student = {"name": "Karma", "age": 16})?',
      'Key-Value pairs',
      ['Single ordered items', 'Index-value pairs', 'Attribute-class pairs'],
      'Dictionaries map unique keys to values.'
    ),
    {
      id: 'python-dictionaries-q2',
      question: 'Fill in the blank: Dictionary keys MUST be immutable and ______, meaning no two keys in a dictionary can be identical.',
      type: 'fill-in-the-blank',
      correctAnswer: 'unique',
      explanation: 'Dictionary keys must be unique.'
    },
    {
      id: 'python-dictionaries-q3',
      question: 'Select the lookup syntax:',
      type: 'drag-drop',
      blankSentence: 'To retrieve the value for key "age" in dictionary student, write student[______].',
      dragOptions: ['"age"', '0', 'age', '1'],
      correctAnswer: '"age"',
      explanation: 'Lookup values via key in square brackets student["age"].'
    },
    {
      id: 'python-dictionaries-q4',
      question: 'Match the dictionary term with its property:',
      type: 'match-following',
      leftItems: ['Key', 'Value', 'Key-Value Pair', 'Mutable'],
      rightItems: ['Unique hashable identifier used for lookup', 'Data associated with a key (can be duplicate or any type)', 'Combined mapping unit inside dictionary', 'Dictionary contents can be modified/updated in place'],
      correctAnswer: {
        'Key': 'Unique hashable identifier used for lookup',
        'Value': 'Data associated with a key (can be duplicate or any type)',
        'Key-Value Pair': 'Combined mapping unit inside dictionary',
        'Mutable': 'Dictionary contents can be modified/updated in place'
      },
      explanation: 'Dictionary definitions.'
    },
    createRandomizedMCQ(
      'python-dictionaries-q5',
      'What happens if you assign d["age"] = 17 when key "age" ALREADY exists in dictionary d?',
      'Updates the existing value of key "age" to 17.',
      ['Creates a duplicate "age" key.', 'Raises KeyError.', 'Deletes key.'],
      'Assigning to existing key updates its value.'
    ),
    createRandomizedMCQ(
      'python-dictionaries-q6',
      'What happens if you attempt d["score"] when key "score" does NOT exist in dictionary d?',
      'Raises a KeyError: "score"',
      ['Returns None silently.', 'Creates key with 0.', 'Returns empty string.'],
      'Direct bracket lookup of missing key raises KeyError.'
    ),
    {
      id: 'python-dictionaries-q7',
      question: 'Fill in the blank: To safely lookup a dictionary key without crashing if missing, use d.______(key, default).',
      type: 'fill-in-the-blank',
      correctAnswer: 'get',
      explanation: 'get() returns default value if key missing.'
    },
    {
      id: 'python-dictionaries-q8',
      question: 'Identify the key type constraint:',
      type: 'drag-drop',
      blankSentence: 'Which of the following CANNOT be used as a dictionary key because it is mutable? A Python ______.',
      dragOptions: ['list', 'string', 'tuple', 'integer'],
      correctAnswer: 'list',
      explanation: 'Mutable types like lists cannot be dictionary keys.'
    },
    {
      id: 'python-dictionaries-q9',
      question: 'Match the dictionary access code with its return value for d = {"a": 10, "b": 20}:',
      type: 'match-following',
      leftItems: ['d["a"]', 'd.get("a")', 'd.get("c", 0)', 'len(d)'],
      rightItems: ['10', '10', '0 (Default value)', '2 (Count of key-value pairs)'],
      correctAnswer: {
        'd["a"]': '10',
        'd.get("a")': '10',
        'd.get("c", 0)': '0 (Default value)',
        'len(d)': '2 (Count of key-value pairs)'
      },
      explanation: 'Dictionary access functions.'
    },
    createRandomizedMCQ(
      'python-dictionaries-q10',
      'Can dictionary VALUES contain nested lists or other dictionaries?',
      'Yes, dictionary values can store any data type including lists, sets, and nested dicts.',
      ['No, values must be numbers.', 'No, nesting causes syntax error.', 'Only in Python 2.'],
      'Dictionary values support complex nested structures.'
    )
  ],

  'python-dict-methods': [
    createRandomizedMCQ(
      'python-dict-methods-q1',
      'Which dictionary method returns a view object containing all KEYS in the dictionary?',
      'keys()',
      ['values()', 'items()', 'get()'],
      'keys() returns dict_keys view.'
    ),
    {
      id: 'python-dict-methods-q2',
      question: 'Fill in the blank: The dictionary method that returns key-value pairs as (key, value) tuples is ______()',
      type: 'fill-in-the-blank',
      correctAnswer: 'items',
      explanation: 'items() returns (key, value) tuple view.'
    },
    {
      id: 'python-dict-methods-q3',
      question: 'Select the dict view method:',
      type: 'drag-drop',
      blankSentence: 'To retrieve only all data values without keys from dictionary d, call d.______().',
      dragOptions: ['values', 'keys', 'items', 'get'],
      correctAnswer: 'values',
      explanation: 'values() returns dict_values.'
    },
    {
      id: 'python-dict-methods-q4',
      question: 'Match the dictionary method with its action:',
      type: 'match-following',
      leftItems: ['d.keys()', 'd.values()', 'd.items()', 'd.pop(key)'],
      rightItems: ['Returns view of all keys', 'Returns view of all values', 'Returns view of (key, value) tuples', 'Removes key and returns its value'],
      correctAnswer: {
        'd.keys()': 'Returns view of all keys',
        'd.values()': 'Returns view of all values',
        'd.items()': 'Returns view of (key, value) tuples',
        'd.pop(key)': 'Removes key and returns its value'
      },
      explanation: 'Standard dictionary methods.'
    },
    createRandomizedMCQ(
      'python-dict-methods-q5',
      'How do you iterate through both keys AND values simultaneously in a for loop in Python?',
      'for k, v in d.items():',
      ['for k, v in d.keys():', 'for k, v in d.values():', 'for k, v in d:'],
      'd.items() unpacks key and value into k, v.'
    ),
    createRandomizedMCQ(
      'python-dict-methods-q6',
      'What dictionary method merges another dictionary dict2 into dict1 in place?',
      'dict1.update(dict2)',
      ['dict1.append(dict2)', 'dict1.extend(dict2)', 'dict1.add(dict2)'],
      'update() merges key-value pairs in place.'
    ),
    {
      id: 'python-dict-methods-q7',
      question: 'Fill in the blank: To clear all key-value pairs from dictionary d leaving it {}, call d.______().',
      type: 'fill-in-the-blank',
      correctAnswer: 'clear',
      explanation: 'clear() removes all key-value entries.'
    },
    {
      id: 'python-dict-methods-q8',
      question: 'Identify dictionary comprehension syntax:',
      type: 'drag-drop',
      blankSentence: '{x: x**2 for x in range(3)} generates dictionary {0: 0, 1: 1, 2: ______}.',
      dragOptions: ['4', '3', '9', '2'],
      correctAnswer: '4',
      explanation: 'Dictionary comprehension evaluates 2**2 = 4.'
    },
    {
      id: 'python-dict-methods-q9',
      question: 'Match the method with its removal behavior:',
      type: 'match-following',
      leftItems: ['d.pop(k)', 'd.popitem()', 'del d[k]'],
      rightItems: ['Removes specified key k and returns value', 'Removes and returns last inserted (key, value) pair', 'Deletes key k from dict without returning value'],
      correctAnswer: {
        'd.pop(k)': 'Removes specified key k and returns value',
        'd.popitem()': 'Removes and returns last inserted (key, value) pair',
        'del d[k]': 'Deletes key k from dict without returning value'
      },
      explanation: 'Dictionary deletion operations.'
    },
    createRandomizedMCQ(
      'python-dict-methods-q10',
      'What does "name" in d check in Python dictionaries?',
      'Checks if "name" exists as a KEY in dictionary d.',
      ['Checks if "name" exists as a VALUE.', 'Checks both key and value.', 'Error'],
      'in operator checks key membership in dictionaries.'
    )
  ],

  'python-user-functions': [
    createRandomizedMCQ(
      'python-user-functions-q1',
      'Which keyword is used to DEFINE a user-defined function in Python (e.g. def greet():)?',
      'def',
      ['function', 'define', 'func'],
      'def defines functions in Python.'
    ),
    {
      id: 'python-user-functions-q2',
      question: 'Fill in the blank: An optional string placed as the first line inside a function to document its purpose is a ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'docstring',
      explanation: 'Docstring """...""" documents function purpose.'
    },
    {
      id: 'python-user-functions-q3',
      question: 'Select the term:',
      type: 'drag-drop',
      blankSentence: 'Variables listed inside function definition header def add(a, b): are called ______.',
      dragOptions: ['parameters', 'arguments', 'constants', 'returns'],
      correctAnswer: 'parameters',
      explanation: 'Parameters are variables in function definition.'
    },
    {
      id: 'python-user-functions-q4',
      question: 'Match the function concept with its definition:',
      type: 'match-following',
      leftItems: ['Function Definition', 'Function Call', 'Parameter', 'Argument'],
      rightItems: ['Creating function code block using def', 'Executing function using name()', 'Variable name listed in def header', 'Actual value passed during function call'],
      correctAnswer: {
        'Function Definition': 'Creating function code block using def',
        'Function Call': 'Executing function using name()',
        'Parameter': 'Variable name listed in def header',
        'Argument': 'Actual value passed during function call'
      },
      explanation: 'Function terminology.'
    },
    createRandomizedMCQ(
      'python-user-functions-q5',
      'Why do programmers use Functions in software development?',
      'To promote Code Reusability, reduce repetition, and improve code organization.',
      ['To make programs run slower.', 'To make files larger.', 'Because Python forces function creation.'],
      'Functions structure modular, reusable code.'
    ),
    createRandomizedMCQ(
      'python-user-functions-q6',
      'How do you access the docstring documentation of a function greet in Python IDLE?',
      'greet.__doc__ or help(greet)',
      ['greet.doc()', 'print(greet)', 'doc(greet)'],
      '__doc__ attribute or help() displays docstrings.'
    ),
    {
      id: 'python-user-functions-q7',
      question: 'Fill in the blank: Executing a function by writing its name followed by parentheses like greet() is calling or ______ the function.',
      type: 'fill-in-the-blank',
      correctAnswer: 'invoking',
      explanation: 'Calling or invoking executes function code.'
    },
    {
      id: 'python-user-functions-q8',
      question: 'Identify the parameter count:',
      type: 'drag-drop',
      blankSentence: 'For def calc(x, y, z): return x+y+z, the function accepts ______ parameters.',
      dragOptions: ['3', '1', '2', '0'],
      correctAnswer: '3',
      explanation: 'Three parameters x, y, z.'
    },
    {
      id: 'python-user-functions-q9',
      question: 'Match the function header with its argument count when called:',
      type: 'match-following',
      leftItems: ['def f():', 'def f(a):', 'def f(a, b):'],
      rightItems: ['Requires 0 arguments', 'Requires 1 argument', 'Requires 2 arguments'],
      correctAnswer: {
        'def f():': 'Requires 0 arguments',
        'def f(a):': 'Requires 1 argument',
        'def f(a, b):': 'Requires 2 arguments'
      },
      explanation: 'Function parameters requirement.'
    },
    createRandomizedMCQ(
      'python-user-functions-q10',
      'What happens if a function definition is placed BELOW the line where it is called in Python script?',
      'Raises NameError because Python interprets script top-to-bottom and function is not yet defined.',
      ['Runs fine.', 'Warning only.', 'Auto fixes.'],
      'Functions must be defined before invocation.'
    )
  ],

  'python-argument-types': [
    createRandomizedMCQ(
      'python-argument-types-q1',
      'What are Default Arguments in Python function definitions (e.g. def greet(name="Student"):)?',
      'Parameters that assume a default value if no argument is passed during function call.',
      ['Arguments that cannot be changed.', 'Global variables.', 'Error handlers.'],
      'Default parameters provide fallback values.'
    ),
    {
      id: 'python-argument-types-q2',
      question: 'Fill in the blank: Passing arguments by explicitly specifying parameter names like greet(age=16, name="Karma") uses ______ arguments.',
      type: 'fill-in-the-blank',
      correctAnswer: 'keyword',
      explanation: 'Keyword arguments specify param=value.'
    },
    {
      id: 'python-argument-types-q3',
      question: 'Select the variable-length tuple symbol:',
      type: 'drag-drop',
      blankSentence: 'In def sum_all(*args):, the asterisk * packs arbitrary positional arguments into a ______ named args.',
      dragOptions: ['tuple', 'list', 'dict', 'set'],
      correctAnswer: 'tuple',
      explanation: '*args gathers extra positional arguments into a tuple.'
    },
    {
      id: 'python-argument-types-q4',
      question: 'Match the argument passing type with its syntax example:',
      type: 'match-following',
      leftItems: ['Positional Argument', 'Keyword Argument', 'Default Parameter', 'Arbitrary Keyword Args (**kwargs)'],
      rightItems: ['add(5, 10) (Matched by position order)', 'add(b=10, a=5) (Matched by parameter name)', 'def add(a, b=0): (b defaults to 0)', 'def show(**kwargs): (Packs into dictionary)'],
      correctAnswer: {
        'Positional Argument': 'add(5, 10) (Matched by position order)',
        'Keyword Argument': 'add(b=10, a=5) (Matched by parameter name)',
        'Default Parameter': 'def add(a, b=0): (b defaults to 0)',
        'Arbitrary Keyword Args (**kwargs)': 'def show(**kwargs): (Packs into dictionary)'
      },
      explanation: 'Python argument passing paradigms.'
    },
    createRandomizedMCQ(
      'python-argument-types-q5',
      'Can non-default parameters follow default parameters in function definition (e.g. def f(a=1, b):)?',
      'No! SyntaxError (non-default argument follows default argument).',
      ['Yes, allowed.', 'Yes, in Python 3.', 'Warning only.'],
      'Default parameters must come after positional parameters.'
    ),
    createRandomizedMCQ(
      'python-argument-types-q6',
      'What data structure does **kwargs pack arbitrary keyword arguments into?',
      'Dictionary',
      ['Tuple', 'List', 'Set'],
      '**kwargs gathers keyword arguments into a dictionary.'
    ),
    {
      id: 'python-argument-types-q7',
      question: 'Fill in the blank: Calling greet(name="Dorji") ignores default value and passes argument as a ______ argument.',
      type: 'fill-in-the-blank',
      correctAnswer: 'keyword',
      explanation: 'Keyword arguments pass name=value pairs.'
    },
    {
      id: 'python-argument-types-q8',
      question: 'Identify argument order requirement:',
      type: 'drag-drop',
      blankSentence: 'In function calls, positional arguments MUST appear ______ keyword arguments.',
      dragOptions: ['before', 'after', 'inside', 'without'],
      correctAnswer: 'before',
      explanation: 'Positional arguments must precede keyword arguments.'
    },
    {
      id: 'python-argument-types-q9',
      question: 'Match the special argument collector with its data structure:',
      type: 'match-following',
      leftItems: ['*args', '**kwargs'],
      rightItems: ['Packs extra positional arguments into a Tuple', 'Packs extra keyword arguments into a Dictionary'],
      correctAnswer: {
        '*args': 'Packs extra positional arguments into a Tuple',
        '**kwargs': 'Packs extra keyword arguments into a Dictionary'
      },
      explanation: 'Variable length arguments.'
    },
    createRandomizedMCQ(
      'python-argument-types-q10',
      'What gets printed by def add(a, b=5): return a+b followed by print(add(10))?',
      '15 (a=10, b defaults to 5)',
      ['10', '5', 'Error'],
      'Evaluates default parameter b=5 when omitted.'
    )
  ],

  'python-return-values': [
    createRandomizedMCQ(
      'python-return-values-q1',
      'Which keyword in Python terminates function execution and sends a calculated value back to the caller?',
      'return',
      ['output', 'send', 'yield'],
      'return statement passes result back to caller.'
    ),
    {
      id: 'python-return-values-q2',
      question: 'Fill in the blank: What value is returned by a Python function that lacks an explicit return statement? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'None',
      explanation: 'Functions without return statement implicitly return None.'
    },
    {
      id: 'python-return-values-q3',
      question: 'Select the returned structure:',
      type: 'drag-drop',
      blankSentence: 'When a function returns multiple comma-separated values like return x, y, Python bundles them into a ______.',
      dragOptions: ['tuple', 'list', 'dict', 'set'],
      correctAnswer: 'tuple',
      explanation: 'Multiple return values are packaged as a tuple.'
    },
    {
      id: 'python-return-values-q4',
      question: 'Match the return scenario with its resulting behavior:',
      type: 'match-following',
      leftItems: ['return x', 'return x, y', 'No return statement', 'Code line placed after return'],
      rightItems: ['Returns value x to caller', 'Returns values bundled as tuple (x, y)', 'Implicitly returns None', 'Unreachable code (never executes)'],
      correctAnswer: {
        'return x': 'Returns value x to caller',
        'return x, y': 'Returns values bundled as tuple (x, y)',
        'No return statement': 'Implicitly returns None',
        'Code line placed after return': 'Unreachable code (never executes)'
      },
      explanation: 'Return statement mechanics.'
    },
    createRandomizedMCQ(
      'python-return-values-q5',
      'What happens to statements placed directly AFTER a return line inside the same function block?',
      'They become unreachable dead code and never execute because return immediately exits the function.',
      ['They run normally.', 'They run first.', 'Causes error.'],
      'return exits function immediately.'
    ),
    createRandomizedMCQ(
      'python-return-values-q6',
      'How do you capture multiple return values return 10, 20 into separate variables?',
      'a, b = my_function()',
      ['a = my_function(10, 20)', 'a + b = my_function()', 'my_function(a, b)'],
      'Tuple unpacking assigns return values to variables a, b.'
    ),
    {
      id: 'python-return-values-q7',
      question: 'Fill in the blank: Is print() the same as return? No! print displays text to console while return passes data to ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'variables',
      explanation: 'return returns data to calling code/variables.'
    },
    {
      id: 'python-return-values-q8',
      question: 'Identify the return type:',
      type: 'drag-drop',
      blankSentence: 'For def is_even(n): return n % 2 == 0, calling is_even(4) returns a ______ value (True).',
      dragOptions: ['bool', 'int', 'str', 'float'],
      correctAnswer: 'bool',
      explanation: 'Equality comparison returns boolean True.'
    },
    {
      id: 'python-return-values-q9',
      question: 'Match the function with its returned result:',
      type: 'match-following',
      leftItems: ['def add(a, b): return a+b', 'def greet(): print("Hi")'],
      rightItems: ['Returns numeric sum', 'Returns None'],
      correctAnswer: {
        'def add(a, b): return a+b': 'Returns numeric sum',
        'def greet(): print("Hi")': 'Returns None'
      },
      explanation: 'Return vs side-effects.'
    },
    createRandomizedMCQ(
      'python-return-values-q10',
      'What is stored in x if x = print("Hello") is executed?',
      'x stores None (because print() returns None).',
      ['x stores "Hello".', 'x stores True.', 'Error'],
      'print() returns None.'
    )
  ],

  'python-scope-recursion': [
    createRandomizedMCQ(
      'python-scope-recursion-q1',
      'What is Variable Scope in Python?',
      'The region or boundary of a program where a specific variable is recognized and accessible.',
      ['The memory size of a variable.', 'The data type of a variable.', 'The speed of a loop.'],
      'Scope dictates variable visibility and lifetime.'
    ),
    {
      id: 'python-scope-recursion-q2',
      question: 'Fill in the blank: A variable created INSIDE a function body has ______ scope and cannot be accessed outside.',
      type: 'fill-in-the-blank',
      correctAnswer: 'local',
      explanation: 'Local variables exist only within their defining function.'
    },
    {
      id: 'python-scope-recursion-q3',
      question: 'Select the keyword:',
      type: 'drag-drop',
      blankSentence: 'To modify a Global variable inside a local function scope, declare it using the ______ keyword.',
      dragOptions: ['global', 'local', 'public', 'import'],
      correctAnswer: 'global',
      explanation: 'global keyword binds local scope to global variable.'
    },
    {
      id: 'python-scope-recursion-q4',
      question: 'Match the variable scope with its accessibility:',
      type: 'match-following',
      leftItems: ['Local Scope', 'Global Scope', 'LEGB Rule'],
      rightItems: ['Accessible only inside the function where created', 'Accessible throughout the entire script and functions', 'Python scope lookup order: Local -> Enclosing -> Global -> Built-in'],
      correctAnswer: {
        'Local Scope': 'Accessible only inside the function where created',
        'Global Scope': 'Accessible throughout the entire script and functions',
        'LEGB Rule': 'Python scope lookup order: Local -> Enclosing -> Global -> Built-in'
      },
      explanation: 'Python scope hierarchy.'
    },
    createRandomizedMCQ(
      'python-scope-recursion-q5',
      'What happens if you try to print(x) outside a function when x was created locally inside that function?',
      'Raises NameError: name \'x\' is not defined',
      ['Prints None', 'Prints 0', 'Prints empty string'],
      'Local variables are destroyed when function returns.'
    ),
    createRandomizedMCQ(
      'python-scope-recursion-q6',
      'What acronym represents Python’s variable scope lookup order?',
      'LEGB (Local, Enclosing, Global, Built-in)',
      ['BODMAS', 'HTML', 'ASCII'],
      'LEGB dictates variable resolution order.'
    ),
    {
      id: 'python-scope-recursion-q7',
      question: 'Fill in the blank: Global variables are created in the main body of the script outside all ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'functions',
      explanation: 'Global variables exist outside functions.'
    },
    {
      id: 'python-scope-recursion-q8',
      question: 'Identify local lifetime:',
      type: 'drag-drop',
      blankSentence: 'Local variables are created when function is called and destroyed when function ______.',
      dragOptions: ['returns', 'starts', 'imports', 'loops'],
      correctAnswer: 'returns',
      explanation: 'Local variables vanish upon function return.'
    },
    {
      id: 'python-scope-recursion-q9',
      question: 'Match the LEGB letter with its scope level:',
      type: 'match-following',
      leftItems: ['L', 'E', 'G', 'B'],
      rightItems: ['Local (Inside current function)', 'Enclosing (Enclosing outer function in nested functions)', 'Global (Top level script file)', 'Built-in (Python reserved names like len, range)'],
      correctAnswer: {
        'L': 'Local (Inside current function)',
        'E': 'Enclosing (Enclosing outer function in nested functions)',
        'G': 'Global (Top level script file)',
        'B': 'Built-in (Python reserved names like len, range)'
      },
      explanation: 'LEGB resolution steps.'
    },
    createRandomizedMCQ(
      'python-scope-recursion-q10',
      'What gets printed?\nx = 10\ndef f():\n    x = 20\nf()\nprint(x)',
      '10 (local x=20 inside function did not modify global x=10)',
      ['20', '30', 'Error'],
      'Without global keyword, local variable shadows global.'
    )
  ],

  'python-recursive-functions': [
    createRandomizedMCQ(
      'python-recursive-functions-q1',
      'What is a Recursive Function in programming?',
      'A function that calls ITSELF directly or indirectly to solve smaller sub-problems.',
      ['A function that never returns.', 'A function without parameters.', 'A function written in C.'],
      'Recursion occurs when a function invokes itself.'
    ),
    {
      id: 'python-recursive-functions-q2',
      question: 'Fill in the blank: The stopping condition in a recursive function that terminates recursion is the ______ Case.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Base',
      explanation: 'Base Case stops recursive calls and prevents infinite recursion stack overflow.'
    },
    {
      id: 'python-recursive-functions-q3',
      question: 'Select the recursion case:',
      type: 'drag-drop',
      blankSentence: 'The part of a recursive function that reduces the problem and calls itself is the ______ Case.',
      dragOptions: ['Recursive', 'Base', 'Loop', 'Final'],
      correctAnswer: 'Recursive',
      explanation: 'Recursive case reduces problem size towards base case.'
    },
    {
      id: 'python-recursive-functions-q4',
      question: 'Match the recursion component with its role:',
      type: 'match-following',
      leftItems: ['Base Case', 'Recursive Case', 'Call Stack', 'RecursionError'],
      rightItems: ['Stopping condition returning direct value without further recursive calls', 'Reduces problem size and calls function recursively', 'Memory stack tracking active recursive function calls', 'Exception raised when maximum recursion depth is exceeded'],
      correctAnswer: {
        'Base Case': 'Stopping condition returning direct value without further recursive calls',
        'Recursive Case': 'Reduces problem size and calls function recursively',
        'Call Stack': 'Memory stack tracking active recursive function calls',
        'RecursionError': 'Exception raised when maximum recursion depth is exceeded'
      },
      explanation: 'Recursion fundamentals.'
    },
    createRandomizedMCQ(
      'python-recursive-functions-q5',
      'What happens if a recursive function is missing a Base Case?',
      'It calls itself endlessly until Python raises a RecursionError (maximum recursion depth exceeded).',
      ['It runs once and returns 0.', 'It converts to a for loop.', 'Computer turns off.'],
      'Missing base case causes infinite stack overflow recursion.'
    ),
    createRandomizedMCQ(
      'python-recursive-functions-q6',
      'In calculating Factorial n! recursively (n * fact(n-1)), what is the Base Case?',
      'When n == 0 or n == 1, return 1',
      ['When n == 100', 'When n < 0, return n', 'When n == 2'],
      'Factorial 0! and 1! equal 1 (base case).'
    ),
    {
      id: 'python-recursive-functions-q7',
      question: 'Fill in the blank: What value does factorial(4) calculate? 4 * 3 * 2 * 1 = ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '24',
      explanation: '4! = 24.'
    },
    {
      id: 'python-recursive-functions-q8',
      question: 'Identify default recursion limit:',
      type: 'drag-drop',
      blankSentence: 'Python default maximum recursion depth limit is approximately ______ calls.',
      dragOptions: ['1000', '10', '100', '100000'],
      correctAnswer: '1000',
      explanation: 'sys.getrecursionlimit() defaults to ~1000.'
    },
    {
      id: 'python-recursive-functions-q9',
      question: 'Match the recursive step for factorial(3):',
      type: 'match-following',
      leftItems: ['factorial(3)', 'factorial(2)', 'factorial(1)'],
      rightItems: ['3 * factorial(2)', '2 * factorial(1)', '1 (Base Case)'],
      correctAnswer: {
        'factorial(3)': '3 * factorial(2)',
        'factorial(2)': '2 * factorial(1)',
        'factorial(1)': '1 (Base Case)'
      },
      explanation: 'Recursive call breakdown.'
    },
    createRandomizedMCQ(
      'python-recursive-functions-q10',
      'Why can iteration (loops) be preferred over recursion for simple tasks?',
      'Loops do not incur the memory overhead of multiple function call stack frames.',
      ['Loops are illegal in Python.', 'Recursion uses more paper.', 'Loops only work on strings.'],
      'Iteration uses constant memory without call stack overhead.'
    )
  ]
};
