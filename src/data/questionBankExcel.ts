import { InteractiveQuestion, createRandomizedMCQ } from './predefinedQuestions';

export const questionBankExcel: Record<string, InteractiveQuestion[]> = {
  'excel-basics': [
    createRandomizedMCQ(
      'excel-basics-q1',
      'What is the intersection of a column and a row in a Microsoft Excel spreadsheet called?',
      'Cell',
      ['Grid', 'Block', 'Box', 'Section'],
      'A cell is formed at the intersection of a column and a row (e.g., cell B5).'
    ),
    {
      id: 'excel-basics-q2',
      question: 'Fill in the blank: Standard Microsoft Excel workbook files are saved with the file extension ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '.xlsx',
      explanation: 'Modern Excel files use the .xlsx file extension (or .xls in older versions).'
    },
    {
      id: 'excel-basics-q3',
      question: 'Select the Excel interface component:',
      type: 'drag-drop',
      blankSentence: 'The box located next to the formula bar that displays the cell reference of the active cell is the ______ Box.',
      dragOptions: ['Name', 'Title', 'Status', 'Search'],
      correctAnswer: 'Name',
      explanation: 'The Name Box displays the active cell coordinate (e.g. A1).'
    },
    {
      id: 'excel-basics-q4',
      question: 'Match the keyboard shortcut with its Excel navigation action:',
      type: 'match-following',
      leftItems: ['Tab', 'Enter', 'Alt + Enter', 'Ctrl + Home'],
      rightItems: ['Move to the next column cell', 'Move to the next row cell below', 'Insert a new line inside the same cell', 'Move immediately to cell A1'],
      correctAnswer: {
        'Tab': 'Move to the next column cell',
        'Enter': 'Move to the next row cell below',
        'Alt + Enter': 'Insert a new line inside the same cell',
        'Ctrl + Home': 'Move immediately to cell A1'
      },
      explanation: 'Core keyboard navigation shortcuts in Excel.'
    },
    createRandomizedMCQ(
      'excel-basics-q5',
      'By default, how many Worksheets are contained in a newly created Excel Workbook?',
      '3 Worksheets (Sheet1, Sheet2, Sheet3)',
      ['1 Worksheet', '5 Worksheets', '10 Worksheets'],
      'Standard Excel workbooks default to 3 worksheets.'
    ),
    createRandomizedMCQ(
      'excel-basics-q6',
      'How are Columns and Rows identified in Microsoft Excel?',
      'Columns are identified by Alphabetical Letters (A, B, C...) and Rows by Numbers (1, 2, 3...).',
      ['Columns are Numbers and Rows are Letters.', 'Both Columns and Rows are Letters.', 'Both Columns and Rows are Numbers.'],
      'Excel uses letters for columns (A to XFD) and numbers for rows (1 to 1,048,576).'
    ),
    {
      id: 'excel-basics-q7',
      question: 'Fill in the blank: The active cell in an Excel spreadsheet is recognized by its thick black ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'outline',
      explanation: 'The active cell is highlighted with a thick black outline box.'
    },
    {
      id: 'excel-basics-q8',
      question: 'Identify the ribbon component:',
      type: 'drag-drop',
      blankSentence: 'The strip of buttons, tabs, and icons above the worksheet grid introduced in Excel 2007 is the ______.',
      dragOptions: ['Ribbon', 'Status Bar', 'Scroll Bar', 'Taskbar'],
      correctAnswer: 'Ribbon',
      explanation: 'The Ribbon replaced older dropdown menus starting in Excel 2007.'
    },
    {
      id: 'excel-basics-q9',
      question: 'Match the spreadsheet software with its provider/suite:',
      type: 'match-following',
      leftItems: ['Microsoft Excel', 'Google Sheets', 'Numbers', 'Calc'],
      rightItems: ['Microsoft Office Suite', 'Google Workspace (Cloud-based)', 'Apple Mac/iOS Suite', 'LibreOffice / OpenOffice Suite'],
      correctAnswer: {
        'Microsoft Excel': 'Microsoft Office Suite',
        'Google Sheets': 'Google Workspace (Cloud-based)',
        'Numbers': 'Apple Mac/iOS Suite',
        'Calc': 'LibreOffice / OpenOffice Suite'
      },
      explanation: 'Major spreadsheet applications and their software suites.'
    },
    createRandomizedMCQ(
      'excel-basics-q10',
      'What is the AutoFill tool in Microsoft Excel?',
      'A feature that automatically fills a series of cells with data based on a detected pattern or sequence.',
      ['A tool that formats disk drives automatically.', 'A feature that translates Dzongkha to English.', 'A macro that prints paper copies.'],
      'AutoFill extends series like numbers, dates, and days of the week based on patterns.'
    )
  ],

  'excel-formulas-references': [
    createRandomizedMCQ(
      'excel-formulas-references-q1',
      'What character MUST every formula in Microsoft Excel begin with?',
      'Equal sign (=)',
      ['Plus sign (+)', 'Dollar sign ($)', 'Asterisk (*)'],
      'Excel formulas must always begin with an equal sign (=) so Excel evaluates them as calculations.'
    ),
    {
      id: 'excel-formulas-references-q2',
      question: 'Fill in the blank: To lock both the column and row in a cell reference so it does not change when copied, insert a ______ sign before both (e.g. $B$5).',
      type: 'fill-in-the-blank',
      correctAnswer: '$',
      explanation: 'Dollar signs ($) lock column and row references in absolute cell addresses.'
    },
    {
      id: 'excel-formulas-references-q3',
      question: 'Select the reference type:',
      type: 'drag-drop',
      blankSentence: 'A cell reference like =A1*B1 that automatically adjusts row and column numbers when copied to other cells is a ______ reference.',
      dragOptions: ['Relative', 'Absolute', 'Mixed', '3D'],
      correctAnswer: 'Relative',
      explanation: 'Relative references adjust dynamically based on relative cell offsets.'
    },
    {
      id: 'excel-formulas-references-q4',
      question: 'Match the cell reference format with its behavior when copied:',
      type: 'match-following',
      leftItems: ['A1', '$A$1', '$A1', 'A$1'],
      rightItems: ['Relative: Both column and row change', 'Absolute: Both column and row stay locked', 'Mixed: Column A is locked, row changes', 'Mixed: Row 1 is locked, column changes'],
      correctAnswer: {
        'A1': 'Relative: Both column and row change',
        '$A$1': 'Absolute: Both column and row stay locked',
        '$A1': 'Mixed: Column A is locked, row changes',
        'A$1': 'Mixed: Row 1 is locked, column changes'
      },
      explanation: 'Dollar signs determine whether column letters or row numbers remain fixed.'
    },
    createRandomizedMCQ(
      'excel-formulas-references-q5',
      'If cell C1 contains the formula =A1*B1*$B$5, and you copy C1 down to cell C2, what formula will appear in cell C2?',
      '=A2*B2*$B$5',
      ['=A1*B1*$B$5', '=A2*B2*$B$6', '=$A$1*$B$1*$B$5'],
      'Relative references A1 and B1 adjust to A2 and B2, while absolute reference $B$5 remains locked.'
    ),
    createRandomizedMCQ(
      'excel-formulas-references-q6',
      'What operator symbol is used in Excel formulas to perform Multiplication?',
      'Asterisk (*)',
      ['Forward slash (/)', 'Caret (^)', 'Plus (+)'],
      'Multiplication uses asterisk (*), division uses forward slash (/), exponentiation uses caret (^).'
    ),
    {
      id: 'excel-formulas-references-q7',
      question: 'Fill in the blank: The tiny square handle at the bottom right corner of an active cell used to drag and copy formulas is the Fill ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Handle',
      explanation: 'The Fill Handle is the tiny plus-shaped icon used to drag and copy formulas or series.'
    },
    {
      id: 'excel-formulas-references-q8',
      question: 'Identify the arithmetic operator:',
      type: 'drag-drop',
      blankSentence: 'To divide cell C2 by cell D2 in Excel, enter the formula =C2 ______ D2.',
      dragOptions: ['/', '*', '-', '+'],
      correctAnswer: '/',
      explanation: 'Forward slash (/) represents division in Excel.'
    },
    {
      id: 'excel-formulas-references-q9',
      question: 'Match the formula with its calculated result if Price=30 (C2) and Qty=2 (D2):',
      type: 'match-following',
      leftItems: ['=C2*D2', '=C2+D2', '=C2-D2', '=C2/D2'],
      rightItems: ['60', '32', '28', '15'],
      correctAnswer: {
        '=C2*D2': '60',
        '=C2+D2': '32',
        '=C2-D2': '28',
        '=C2/D2': '15'
      },
      explanation: 'Evaluates basic Excel arithmetic formulas using C2=30 and D2=2.'
    },
    createRandomizedMCQ(
      'excel-formulas-references-q10',
      'Why is an absolute reference ($B$5) essential when calculating tax or commission for 100 items against a single tax rate in cell B5?',
      'Because dragging the formula down ensures every item continues multiplying against cell B5 rather than empty cells B6, B7, B8.',
      ['Because Excel crashes without dollar signs.', 'Because absolute references double the calculated price.', 'Because relative references delete the worksheet.'],
      'Locking tax rate cells with absolute references prevents formula drift during autofill.'
    )
  ],

  'excel-functions-validation': [
    createRandomizedMCQ(
      'excel-functions-validation-q1',
      'Which Excel function calculates the arithmetic average of numbers in a cell range like =AVERAGE(B2:B15)?',
      'AVERAGE',
      ['SUM', 'MEDIAN', 'COUNT'],
      '=AVERAGE(range) calculates the arithmetic mean of numeric cell values.'
    ),
    {
      id: 'excel-functions-validation-q2',
      question: 'Fill in the blank: The Excel function that counts only the number of cells in a range that contain NUMBERS is ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'COUNT',
      explanation: 'COUNT counts numeric cells; COUNTA counts all non-empty cells.'
    },
    {
      id: 'excel-functions-validation-q3',
      question: 'Select the statistical function:',
      type: 'drag-drop',
      blankSentence: 'To find the largest numerical mark in a student result list from D4 to D8, use the formula =______ (D4:D8).',
      dragOptions: ['MAX', 'MIN', 'SUM', 'AVERAGE'],
      correctAnswer: 'MAX',
      explanation: 'MAX returns the highest numerical value in a range.'
    },
    {
      id: 'excel-functions-validation-q4',
      question: 'Match the built-in Excel function with its purpose:',
      type: 'match-following',
      leftItems: ['SUM(A1:A10)', 'MIN(C1:C5)', 'COUNTA(A1:A10)', 'TODAY()'],
      rightItems: ['Adds all numbers in cells A1 to A10', 'Returns the smallest value in cells C1 to C5', 'Counts all non-empty cells in range A1 to A10', 'Returns the current system date'],
      correctAnswer: {
        'SUM(A1:A10)': 'Adds all numbers in cells A1 to A10',
        'MIN(C1:C5)': 'Returns the smallest value in cells C1 to C5',
        'COUNTA(A1:A10)': 'Counts all non-empty cells in range A1 to A10',
        'TODAY()': 'Returns the current system date'
      },
      explanation: 'Standard Excel mathematical, statistical, and date functions.'
    },
    createRandomizedMCQ(
      'excel-functions-validation-q5',
      'What are the 3 tabs available in the Excel Data Validation dialog box?',
      'Settings, Input Message, and Error Alert',
      ['General, Alignment, and Font', 'Home, Insert, and Page Layout', 'Data, Filter, and Sort'],
      'Data Validation dialog contains Settings (criteria), Input Message (guidance), and Error Alert (warning style).'
    ),
    createRandomizedMCQ(
      'excel-functions-validation-q6',
      'How can a teacher prevent data entry errors by ensuring marks entered in a column are whole numbers between 0 and 100?',
      'Set Data Validation rule to Whole Number with criteria Between 0 and 100.',
      ['Apply bold formatting to the column.', 'Use the SUM function on column A.', 'Sort the column from Z to A.'],
      'Data validation rules restrict allowed cell inputs to specific ranges or data types.'
    ),
    {
      id: 'excel-functions-validation-q7',
      question: 'Fill in the blank: The three Error Alert styles in Excel Data Validation are Stop, Warning, and ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Information',
      explanation: 'Data validation error alert styles: Stop (blocks input), Warning (asks confirmation), Information (notifies user).'
    },
    {
      id: 'excel-functions-validation-q8',
      question: 'Identify the text function:',
      type: 'drag-drop',
      blankSentence: 'To convert lowercase text in cell A1 to all uppercase letters, use the formula =______(A1).',
      dragOptions: ['UPPER', 'LOWER', 'CONCATENATE', 'PROPER'],
      correctAnswer: 'UPPER',
      explanation: 'UPPER converts string text to uppercase.'
    },
    {
      id: 'excel-functions-validation-q9',
      question: 'Match the Data Validation Allow option with its restriction:',
      type: 'match-following',
      leftItems: ['Whole Number', 'Decimal', 'List', 'Text Length'],
      rightItems: ['Restricts input to integers only', 'Allows numbers with decimal points', 'Restricts input to items from a predefined dropdown menu', 'Restricts input to a specific character count'],
      correctAnswer: {
        'Whole Number': 'Restricts input to integers only',
        'Decimal': 'Allows numbers with decimal points',
        'List': 'Restricts input to items from a predefined dropdown menu',
        'Text Length': 'Restricts input to a specific character count'
      },
      explanation: 'Data validation options in the Settings tab.'
    },
    createRandomizedMCQ(
      'excel-functions-validation-q10',
      'What function joins multiple text strings into a single text string (e.g. joining First Name and Last Name)?',
      'CONCATENATE (or CONCAT)',
      ['SUM', 'VLOOKUP', 'AVERAGEIF'],
      'CONCATENATE combines multiple text strings into one continuous string.'
    )
  ],

  'excel-logical-if': [
    createRandomizedMCQ(
      'excel-logical-if-q1',
      'What is the basic syntax of the IF function in Microsoft Excel?',
      '=IF(logical_test, value_if_true, value_if_false)',
      ['=IF(value_if_true, value_if_false, logical_test)', '=IF(logical_test, sum, count)', '=IF(range, criteria)'],
      'The IF function checks a logical condition, returning one value if true and another if false.'
    ),
    {
      id: 'excel-logical-if-q2',
      question: 'Fill in the blank: The logical comparison operator in Excel that means "Not equal to" is ______.',
      type: 'fill-in-the-blank',
      correctAnswer: '<>',
      explanation: 'Excel uses <> for "not equal to".'
    },
    {
      id: 'excel-logical-if-q3',
      question: 'Select the logical function:',
      type: 'drag-drop',
      blankSentence: 'The logical function that returns TRUE only if ALL specified conditions are true is =______(cond1, cond2).',
      dragOptions: ['AND', 'OR', 'NOT', 'IF'],
      correctAnswer: 'AND',
      explanation: 'AND returns TRUE only when every logical argument evaluates to true.'
    },
    {
      id: 'excel-logical-if-q4',
      question: 'Match the logical function with its truth condition:',
      type: 'match-following',
      leftItems: ['AND(cond1, cond2)', 'OR(cond1, cond2)', 'NOT(cond)'],
      rightItems: ['Returns TRUE if ALL conditions are true', 'Returns TRUE if AT LEAST ONE condition is true', 'Reverses the logical value (TRUE becomes FALSE)'],
      correctAnswer: {
        'AND(cond1, cond2)': 'Returns TRUE if ALL conditions are true',
        'OR(cond1, cond2)': 'Returns TRUE if AT LEAST ONE condition is true',
        'NOT(cond)': 'Reverses the logical value (TRUE becomes FALSE)'
      },
      explanation: 'Core logical functions in Excel.'
    },
    createRandomizedMCQ(
      'excel-logical-if-q5',
      'What will the formula =IF(A1>=40, "Pass", "Fail") return if cell A1 contains the score 65?',
      'Pass',
      ['Fail', 'TRUE', 'ERROR'],
      'Since 65 >= 40 is True, the formula returns the value_if_true string "Pass".'
    ),
    createRandomizedMCQ(
      'excel-logical-if-q6',
      'What result will the formula =AND(10>5, 20>5, 30>5) evaluate to?',
      'TRUE',
      ['FALSE', '10', '60'],
      'Since all three conditions (10>5, 20>5, 30>5) are true, AND returns TRUE.'
    ),
    {
      id: 'excel-logical-if-q7',
      question: 'Fill in the blank: What will =OR(15>10, 3<5, 8=10) evaluate to? ______.',
      type: 'fill-in-the-blank',
      correctAnswer: 'TRUE',
      explanation: 'OR returns TRUE if at least one condition is true (15>10 is true).'
    },
    {
      id: 'excel-logical-if-q8',
      question: 'Identify the comparison operator:',
      type: 'drag-drop',
      blankSentence: 'The logical operator symbol for "Greater than or equal to" in Excel formulas is ______.',
      dragOptions: ['>=', '<=', '<>', '=='],
      correctAnswer: '>=',
      explanation: '>= represents greater than or equal to.'
    },
    {
      id: 'excel-logical-if-q9',
      question: 'Match the Excel logical comparison statement with its evaluated result:',
      type: 'match-following',
      leftItems: ['1=1', '1=2', '"Hello" <> "Goodbye"', '5>6'],
      rightItems: ['TRUE', 'FALSE', 'TRUE', 'FALSE'],
      correctAnswer: {
        '1=1': 'TRUE',
        '1=2': 'FALSE',
        '"Hello" <> "Goodbye"': 'TRUE',
        '5>6': 'FALSE'
      },
      explanation: 'Logical evaluations in Excel.'
    },
    createRandomizedMCQ(
      'excel-logical-if-q10',
      'How can a teacher combine IF and AND functions to grant "Distinction" only if Math >= 80 AND English >= 80?',
      '=IF(AND(Math>=80, English>=80), "Distinction", "Regular")',
      ['=IF(OR(Math>=80, English>=80), "Distinction")', '=AND(IF(Math>=80), "Distinction")', '=IF(Math+English=160)'],
      'Nesting AND inside IF evaluates both subject grade conditions together.'
    )
  ],

  'excel-data-sorting-filtering': [
    createRandomizedMCQ(
      'excel-data-sorting-filtering-q1',
      'What is the difference between Sorting and Filtering data in Microsoft Excel?',
      'Sorting arranges rows in ascending or descending order, while Filtering temporarily hides rows that do not meet criteria.',
      ['Sorting deletes rows permanently, while Filtering prints them.', 'Sorting works on text only, while Filtering works on numbers only.', 'They are identical features.'],
      'Sorting changes row order (A-Z/0-9), whereas Filtering hides non-matching rows.'
    ),
    {
      id: 'excel-data-sorting-filtering-q2',
      question: 'Fill in the blank: To enable or disable drop-down filter arrows on header cells, go to the Data tab and click the ______ icon.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Filter',
      explanation: 'The Filter button on the Data tab toggles header filter dropdown arrows.'
    },
    {
      id: 'excel-data-sorting-filtering-q3',
      question: 'Select the sort order:',
      type: 'drag-drop',
      blankSentence: 'Arranging student names alphabetically from A to Z or numbers from smallest to largest is ______ sort order.',
      dragOptions: ['ascending', 'descending', 'random', 'custom'],
      correctAnswer: 'ascending',
      explanation: 'Ascending order sorts A to Z or 0 to 9.'
    },
    {
      id: 'excel-data-sorting-filtering-q4',
      question: 'Match the sorting/filtering task with its Excel command:',
      type: 'match-following',
      leftItems: ['Sort A to Z', 'Sort Z to A', 'Clear Filter', 'Custom Filter'],
      rightItems: ['Ascending order sort', 'Descending order sort', 'Restore all hidden rows', 'Filter rows based on specific numerical conditions (>40)'],
      correctAnswer: {
        'Sort A to Z': 'Ascending order sort',
        'Sort Z to A': 'Descending order sort',
        'Clear Filter': 'Restore all hidden rows',
        'Custom Filter': 'Filter rows based on specific numerical conditions (>40)'
      },
      explanation: 'Common Data tab commands for sorting and filtering.'
    },
    createRandomizedMCQ(
      'excel-data-sorting-filtering-q5',
      'How does Conditional Formatting enhance a Class 10 student mark sheet in Excel?',
      'It automatically changes cell background colors (e.g. highlighting marks below 40 in red) based on rules.',
      ['It deletes failing student records.', 'It calculates total marks using Python.', 'It locks the workbook with a password.'],
      'Conditional formatting formats cells dynamically based on specified criteria.'
    ),
    createRandomizedMCQ(
      'excel-data-sorting-filtering-q6',
      'Which Conditional Formatting option allows adding colored bar indicators directly inside numeric cells?',
      'Data Bars',
      ['Icon Sets', 'Color Scales', 'Highlight Cells Rules'],
      'Data Bars render visual horizontal bars inside cells proportional to numbers.'
    ),
    {
      id: 'excel-data-sorting-filtering-q7',
      question: 'Fill in the blank: Sorting numbers from highest score to lowest score is arranging data in ______ order.',
      type: 'fill-in-the-blank',
      correctAnswer: 'descending',
      explanation: 'Descending order sorts from largest to smallest.'
    },
    {
      id: 'excel-data-sorting-filtering-q8',
      question: 'Identify the ribbon path:',
      type: 'drag-drop',
      blankSentence: 'To apply Conditional Formatting rules, go to Home Tab > Styles Group > ______ Formatting dropdown.',
      dragOptions: ['Conditional', 'Data', 'Format', 'Table'],
      correctAnswer: 'Conditional',
      explanation: 'Conditional Formatting is located in the Styles group on the Home tab.'
    },
    {
      id: 'excel-data-sorting-filtering-q9',
      question: 'Match the Conditional Formatting option with its visual effect:',
      type: 'match-following',
      leftItems: ['Highlight Cells Rules', 'Color Scales', 'Icon Sets'],
      rightItems: ['Fills red color for cells < 40', 'Applies gradient shading based on low-to-high values', 'Displays traffic light icons (green, yellow, red) inside cells'],
      correctAnswer: {
        'Highlight Cells Rules': 'Fills red color for cells < 40',
        'Color Scales': 'Applies gradient shading based on low-to-high values',
        'Icon Sets': 'Displays traffic light icons (green, yellow, red) inside cells'
      },
      explanation: 'Conditional formatting visual formatting tools.'
    },
    createRandomizedMCQ(
      'excel-data-sorting-filtering-q10',
      'Does filtering rows in Excel delete the hidden data permanently?',
      'No, filtering only temporarily hides rows that do not match the criteria; data is restored when clearing the filter.',
      ['Yes, hidden rows are erased.', 'Yes, unless saved as PDF.', 'Yes, if the file is closed.'],
      'Filtering hides non-matching rows without destroying data.'
    )
  ],

  'excel-charts-visualization': [
    createRandomizedMCQ(
      'excel-charts-visualization-q1',
      'Which chart type in Excel uses vertical columns to compare values across different categories?',
      'Column Chart',
      ['Bar Chart', 'Pie Chart', 'Line Chart'],
      'Column charts display vertical bars for comparing categorical data.'
    ),
    {
      id: 'excel-charts-visualization-q2',
      question: 'Fill in the blank: A circular chart in Excel that displays proportions or percentages of a whole is a ______ chart.',
      type: 'fill-in-the-blank',
      correctAnswer: 'Pie',
      explanation: 'Pie charts display relative percentage slices of a whole 100% total.'
    },
    {
      id: 'excel-charts-visualization-q3',
      question: 'Identify the chart element:',
      type: 'drag-drop',
      blankSentence: 'The box in an Excel chart that identifies data series colors or categories is the ______.',
      dragOptions: ['Legend', 'Title', 'Trendline', 'Axis'],
      correctAnswer: 'Legend',
      explanation: 'The Legend identifies color keys and data series.'
    },
    {
      id: 'excel-charts-visualization-q4',
      question: 'Match the chart type with its best visualization purpose:',
      type: 'match-following',
      leftItems: ['Column Chart', 'Bar Chart', 'Line Chart', 'Pie Chart'],
      rightItems: ['Comparing values across categories using vertical columns', 'Comparing values across categories using horizontal bars', 'Visualizing continuous data trends over time', 'Showing percentage proportions of a single whole'],
      correctAnswer: {
        'Column Chart': 'Comparing values across categories using vertical columns',
        'Bar Chart': 'Comparing values across categories using horizontal bars',
        'Line Chart': 'Visualizing continuous data trends over time',
        'Pie Chart': 'Showing percentage proportions of a single whole'
      },
      explanation: 'Standard Excel chart types and their visualization objectives.'
    },
    createRandomizedMCQ(
      'excel-charts-visualization-q5',
      'Where do you go in the Excel Ribbon to insert a new Chart into your worksheet?',
      'Insert Tab > Charts Group',
      ['Home Tab > Styles Group', 'Data Tab > Sort Group', 'Review Tab > Proofing Group'],
      'Charts are inserted via the Charts group on the Insert tab.'
    ),
    createRandomizedMCQ(
      'excel-charts-visualization-q6',
      'What are Data Labels on an Excel chart?',
      'Values displayed directly on or above individual chart bars or data points.',
      ['The title of the entire workbook file.', 'The font name used in axis titles.', 'The column letters A, B, C.'],
      'Data labels display exact numerical values directly on chart bars/points.'
    ),
    {
      id: 'excel-charts-visualization-q7',
      question: 'Fill in the blank: The horizontal axis of a standard 2D chart is the X-axis (Category axis), while the vertical axis is the ______-axis (Value axis).',
      type: 'fill-in-the-blank',
      correctAnswer: 'Y',
      explanation: 'Vertical value axis is the Y-axis.'
    },
    {
      id: 'excel-charts-visualization-q8',
      question: 'Select the trend element:',
      type: 'drag-drop',
      blankSentence: 'A line added to a chart representing the general direction or pattern of data points over time is a ______.',
      dragOptions: ['Trendline', 'Gridline', 'Legend', 'Border'],
      correctAnswer: 'Trendline',
      explanation: 'Trendlines illustrate data direction and forecasting patterns.'
    },
    {
      id: 'excel-charts-visualization-q9',
      question: 'Match the chart element with its definition:',
      type: 'match-following',
      leftItems: ['Chart Title', 'Gridlines', 'Axis Titles', 'Data Table'],
      rightItems: ['Descriptive title for the whole chart', 'Horizontal/vertical background lines aiding value estimation', 'Labels describing X and Y axis measurements', 'A table showing underlying numerical data below the chart'],
      correctAnswer: {
        'Chart Title': 'Descriptive title for the whole chart',
        'Gridlines': 'Horizontal/vertical background lines aiding value estimation',
        'Axis Titles': 'Labels describing X and Y axis measurements',
        'Data Table': 'A table showing underlying numerical data below the chart'
      },
      explanation: 'Essential chart elements in Excel.'
    },
    createRandomizedMCQ(
      'excel-charts-visualization-q10',
      'Why is a Line Chart ideal for tracking temperature changes in Paro over 7 days?',
      'Because line charts connect data points to clearly show continuous trends and fluctuations over time.',
      ['Because line charts calculate percentages automatically.', 'Because line charts do not use X or Y axes.', 'Because line charts require no numbers.'],
      'Line charts are designed for tracking continuous variables over time.'
    )
  ],

  'excel-vlookup-summary': [
    createRandomizedMCQ(
      'excel-vlookup-query-q1',
      'What does the VLOOKUP function stand for in Microsoft Excel?',
      'Vertical Lookup (searches for a value in the first column of a table and returns a value in the same row)',
      ['Variable Lookup', 'Virtual Lookup', 'Vector Lookup'],
      'VLOOKUP performs a Vertical Lookup down the first column of a table.'
    ),
    {
      id: 'excel-vlookup-summary-q2',
      question: 'Fill in the blank: In =VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]), setting range_lookup to FALSE enforces an ______ match.',
      type: 'fill-in-the-blank',
      correctAnswer: 'exact',
      explanation: 'FALSE (or 0) specifies an exact match lookup.'
    },
    {
      id: 'excel-vlookup-summary-q3',
      question: 'Select the statistical summary function:',
      type: 'drag-drop',
      blankSentence: 'To calculate the average of cells in range A1:A10 that satisfy a specific condition (>5), use =______(A1:A10, ">5").',
      dragOptions: ['AVERAGEIF', 'COUNTIF', 'SUMIF', 'VLOOKUP'],
      correctAnswer: 'AVERAGEIF',
      explanation: 'AVERAGEIF calculates the average for cells meeting a criterion.'
    },
    {
      id: 'excel-vlookup-summary-q4',
      question: 'Match the advanced summary function with its operation:',
      type: 'match-following',
      leftItems: ['COUNTIF(range, criteria)', 'COUNTIFS(range1, crit1, range2, crit2)', 'AVERAGEIF(range, criteria)', 'VLOOKUP(val, table, col, FALSE)'],
      rightItems: ['Counts cells meeting a single condition', 'Counts cells meeting multiple criteria simultaneously', 'Calculates mean average of cells meeting a condition', 'Vertical search returning matching row data'],
      correctAnswer: {
        'COUNTIF(range, criteria)': 'Counts cells meeting a single condition',
        'COUNTIFS(range1, crit1, range2, crit2)': 'Counts cells meeting multiple criteria simultaneously',
        'AVERAGEIF(range, criteria)': 'Calculates mean average of cells meeting a condition',
        'VLOOKUP(val, table, col, FALSE)': 'Vertical search returning matching row data'
      },
      explanation: 'Advanced Excel analysis and lookup functions.'
    },
    createRandomizedMCQ(
      'excel-vlookup-summary-q5',
      'What powerful Excel tool allows summarizing, analyzing, exploring, and presenting large data tables interactively?',
      'PivotTable',
      ['Data Validation', 'AutoFill', 'Spell Check'],
      'PivotTables summarize and analyze large datasets dynamically.'
    ),
    createRandomizedMCQ(
      'excel-vlookup-summary-q6',
      'In the formula =VLOOKUP(A1, B1:C10, 2, FALSE), what does the number "2" represent?',
      'Column Index Number: Return the value from the 2nd column of the table range B1:C10.',
      ['Look up 2 values.', 'Multiply result by 2.', 'Search row number 2.'],
      'The 3rd argument (col_index_num) specifies which column of the table contains the return value.'
    ),
    {
      id: 'excel-vlookup-summary-q7',
      question: 'Fill in the blank: The statistical function that returns the middle value in a set of ordered numbers is =______(A1:A10).',
      type: 'fill-in-the-blank',
      correctAnswer: 'MEDIAN',
      explanation: 'MEDIAN returns the middle numerical value in a sorted dataset.'
    },
    {
      id: 'excel-vlookup-summary-q8',
      question: 'Identify the ranking function:',
      type: 'drag-drop',
      blankSentence: 'To determine student class rank based on marks in range A1:A10, use the formula =______(A1, A1:A10).',
      dragOptions: ['RANK', 'MODE', 'COUNT', 'VLOOKUP'],
      correctAnswer: 'RANK',
      explanation: 'RANK evaluates the numerical position of a value within a list.'
    },
    {
      id: 'excel-vlookup-summary-q9',
      question: 'Match the summary function with its calculated value:',
      type: 'match-following',
      leftItems: ['MEDIAN', 'MODE', 'RANK'],
      rightItems: ['Middle value in a set of numbers', 'Most frequently occurring value in a set', 'Relative position/rank of a number in a list'],
      correctAnswer: {
        'MEDIAN': 'Middle value in a set of numbers',
        'MODE': 'Most frequently occurring value in a set',
        'RANK': 'Relative position/rank of a number in a list'
      },
      explanation: 'Statistical measure functions.'
    },
    createRandomizedMCQ(
      'excel-vlookup-summary-q10',
      'Why does VLOOKUP return a #N/A error if the lookup_value is not found in the first column of the table range?',
      'Because exact match (FALSE) was requested and no matching record exists in column 1.',
      ['Because Excel lost internet connectivity.', 'Because the cell font is set to red.', 'Because formulas cannot search numbers.'],
      '#N/A indicates that the lookup value was not found in the search column.'
    )
  ]
};
