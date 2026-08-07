export interface ExcelFunctionDoc {
  name: string;
  category: 'Math & Stat' | 'Counting' | 'Logical' | 'Text' | 'Date & Time' | 'Lookup';
  syntax: string;
  description: string;
  pdfPage: number;
  exampleFormula: string;
  exampleResult: string;
  explanation: string;
}

export const EXCEL_FUNCTIONS_CATALOG: ExcelFunctionDoc[] = [
  {
    name: 'SUM',
    category: 'Math & Stat',
    syntax: '=SUM(range_or_values)',
    description: 'Adds all numbers in a range of cells or specific values together.',
    pdfPage: 36,
    exampleFormula: '=SUM(C2:C6)',
    exampleResult: '165',
    explanation: 'Calculates the grand total by summing every numeric value between cell C2 and cell C6.'
  },
  {
    name: 'AVERAGE',
    category: 'Math & Stat',
    syntax: '=AVERAGE(range_or_values)',
    description: 'Calculates the arithmetic mean of a range of numerical values.',
    pdfPage: 36,
    exampleFormula: '=AVERAGE(C2:C6)',
    exampleResult: '33.00',
    explanation: 'Takes the sum of values in C2:C6 and divides it by the total count of numbers in that range.'
  },
  {
    name: 'MIN',
    category: 'Math & Stat',
    syntax: '=MIN(range_or_values)',
    description: 'Returns the smallest numerical value from a range or list of numbers.',
    pdfPage: 36,
    exampleFormula: '=MIN(C2:C6)',
    exampleResult: '5',
    explanation: 'Scans the cells C2 through C6 and identifies the minimum value (e.g., Nu. 5 for Pencil).'
  },
  {
    name: 'MAX',
    category: 'Math & Stat',
    syntax: '=MAX(range_or_values)',
    description: 'Returns the largest numerical value from a range or list of numbers.',
    pdfPage: 36,
    exampleFormula: '=MAX(C2:C6)',
    exampleResult: '70',
    explanation: 'Scans the cells C2 through C6 and finds the maximum value (e.g., Nu. 70 for Notebook).'
  },
  {
    name: 'COUNT',
    category: 'Math & Stat',
    syntax: '=COUNT(range)',
    description: 'Counts the number of cells in a range that contain numerical values.',
    pdfPage: 36,
    exampleFormula: '=COUNT(C2:C6)',
    exampleResult: '5',
    explanation: 'Ignores empty cells and text labels, counting only cells containing numbers.'
  },
  {
    name: 'COUNTA',
    category: 'Counting',
    syntax: '=COUNTA(range)',
    description: 'Counts the number of non-empty cells in a range (text, numbers, booleans).',
    pdfPage: 46,
    exampleFormula: '=COUNTA(B2:B6)',
    exampleResult: '5',
    explanation: 'Counts all filled entries in column B, useful for total item or student records.'
  },
  {
    name: 'COUNTIF',
    category: 'Counting',
    syntax: '=COUNTIF(range, criteria)',
    description: 'Counts cells within a range that meet a specific single condition.',
    pdfPage: 46,
    exampleFormula: '=COUNTIF(C2:C6, ">20")',
    exampleResult: '3',
    explanation: 'Checks cells C2:C6 and counts how many cells have a price strictly greater than Nu. 20.'
  },
  {
    name: 'COUNTIFS',
    category: 'Counting',
    syntax: '=COUNTIFS(range1, criteria1, range2, criteria2)',
    description: 'Counts cells that meet multiple criteria across corresponding ranges.',
    pdfPage: 46,
    exampleFormula: '=COUNTIFS(C2:C6, ">10", D2:D6, ">=2")',
    exampleResult: '3',
    explanation: 'Counts rows where the Price (col C) is > 10 AND the Quantity (col D) is >= 2.'
  },
  {
    name: 'AVERAGEIF',
    category: 'Math & Stat',
    syntax: '=AVERAGEIF(range, criteria)',
    description: 'Calculates the average (mean) of cells that meet a specified condition.',
    pdfPage: 46,
    exampleFormula: '=AVERAGEIF(C2:C6, ">20")',
    exampleResult: '46.67',
    explanation: 'Filters C2:C6 for values > 20 (30, 40, 70) and calculates their mean (140 / 3 = 46.67).'
  },
  {
    name: 'MEDIAN',
    category: 'Math & Stat',
    syntax: '=MEDIAN(range)',
    description: 'Returns the median (exact middle value) in a set of sorted numbers.',
    pdfPage: 46,
    exampleFormula: '=MEDIAN(C2:C6)',
    exampleResult: '30',
    explanation: 'Sorts [5, 20, 30, 40, 70] and selects the middle number (30).'
  },
  {
    name: 'MODE',
    category: 'Math & Stat',
    syntax: '=MODE(range)',
    description: 'Returns the most frequently occurring value in a range of numbers.',
    pdfPage: 46,
    exampleFormula: '=MODE(D2:D6)',
    exampleResult: '2',
    explanation: 'Scans quantity entries [2, 3, 2, 1, 2] and identifies 2 as the most frequent quantity.'
  },
  {
    name: 'RANK',
    category: 'Math & Stat',
    syntax: '=RANK(number, range)',
    description: 'Returns the rank/position of a number in a list relative to other values.',
    pdfPage: 46,
    exampleFormula: '=RANK(C2, C2:C6)',
    exampleResult: '3',
    explanation: 'Ranks cell C2 (30) within list [30, 5, 40, 20, 70], placing it 3rd highest.'
  },
  {
    name: 'IF',
    category: 'Logical',
    syntax: '=IF(logical_test, value_if_true, value_if_false)',
    description: 'Evaluates a logical comparison and returns one value if True, another if False.',
    pdfPage: 36,
    exampleFormula: '=IF(C2>=40, "Expensive", "Affordable")',
    exampleResult: 'Affordable',
    explanation: 'If Price in C2 (30) is >= 40 returns "Expensive", otherwise returns "Affordable".'
  },
  {
    name: 'AND',
    category: 'Logical',
    syntax: '=AND(condition1, condition2, ...)',
    description: 'Returns TRUE if all specified logical conditions are met, otherwise FALSE.',
    pdfPage: 45,
    exampleFormula: '=AND(C2>10, D2>=2)',
    exampleResult: 'TRUE',
    explanation: 'Checks if C2 (30 > 10) AND D2 (2 >= 2) are both true. Result is TRUE.'
  },
  {
    name: 'OR',
    category: 'Logical',
    syntax: '=OR(condition1, condition2, ...)',
    description: 'Returns TRUE if at least one specified condition is met, otherwise FALSE.',
    pdfPage: 45,
    exampleFormula: '=OR(C2>50, D2>2)',
    exampleResult: 'FALSE',
    explanation: 'Checks if C2 > 50 or D2 > 2. Neither is true for row 2, so returns FALSE.'
  },
  {
    name: 'NOT',
    category: 'Logical',
    syntax: '=NOT(logical_expression)',
    description: 'Reverses the boolean logic of its argument (TRUE becomes FALSE, FALSE becomes TRUE).',
    pdfPage: 45,
    exampleFormula: '=NOT(C2<10)',
    exampleResult: 'TRUE',
    explanation: 'Since C2 < 10 is FALSE, NOT(FALSE) inverts the result to TRUE.'
  },
  {
    name: 'LOWER',
    category: 'Text',
    syntax: '=LOWER(text_or_cell)',
    description: 'Converts all letters in a text string or cell to lowercase.',
    pdfPage: 36,
    exampleFormula: '=LOWER(B2)',
    exampleResult: 'pen',
    explanation: 'Converts "Pen" in cell B2 into lowercase "pen".'
  },
  {
    name: 'UPPER',
    category: 'Text',
    syntax: '=UPPER(text_or_cell)',
    description: 'Converts all letters in a text string or cell to uppercase.',
    pdfPage: 36,
    exampleFormula: '=UPPER(B2)',
    exampleResult: 'PEN',
    explanation: 'Converts "Pen" in cell B2 into uppercase "PEN".'
  },
  {
    name: 'CONCATENATE',
    category: 'Text',
    syntax: '=CONCATENATE(text1, text2, ...)',
    description: 'Joins two or more text strings or cell values into a single text string.',
    pdfPage: 36,
    exampleFormula: '=CONCATENATE(B2, " - Nu.", C2)',
    exampleResult: 'Pen - Nu.30',
    explanation: 'Combines item name "Pen", text separator " - Nu.", and price "30" into one string.'
  },
  {
    name: 'DATE',
    category: 'Date & Time',
    syntax: '=DATE(year, month, day)',
    description: 'Returns a formatted date string from individual year, month, and day inputs.',
    pdfPage: 36,
    exampleFormula: '=DATE(2026, 7, 28)',
    exampleResult: '2026-07-28',
    explanation: 'Constructs a valid ISO date string from numeric parameters (2026, 7, 28).'
  },
  {
    name: 'TODAY',
    category: 'Date & Time',
    syntax: '=TODAY()',
    description: 'Returns the current system date without time.',
    pdfPage: 36,
    exampleFormula: '=TODAY()',
    exampleResult: '2026-07-28',
    explanation: 'Dynamically fetches today\'s date formatted as YYYY-MM-DD.'
  },
  {
    name: 'NOW',
    category: 'Date & Time',
    syntax: '=NOW()',
    description: 'Returns the current system date and time stamp.',
    pdfPage: 36,
    exampleFormula: '=NOW()',
    exampleResult: '2026-07-28 07:08',
    explanation: 'Dynamically fetches current date and timestamp.'
  },
  {
    name: 'VLOOKUP',
    category: 'Lookup',
    syntax: '=VLOOKUP(lookup_value, table_array, col_index, [range_lookup])',
    description: 'Searches for a value in the 1st column of a table and returns a value in the same row from a specified column.',
    pdfPage: 46,
    exampleFormula: '=VLOOKUP(1, A2:E6, 2, FALSE)',
    exampleResult: 'Pen',
    explanation: 'Searches for ID "1" in column A (A2:E6) and returns the matching value from the 2nd column ("Pen").'
  }
];

// Expand range like "C2:C6" or "$C$2:$C$6" into list of cell keys
export function expandCellRange(rangeStr: string): string[] {
  const clean = rangeStr.replace(/\$/g, '').trim().toUpperCase();
  if (!clean.includes(':')) return [clean];

  const parts = clean.split(':');
  if (parts.length !== 2) return [clean];

  const match1 = parts[0].match(/([A-Z]+)(\d+)/);
  const match2 = parts[1].match(/([A-Z]+)(\d+)/);
  if (!match1 || !match2) return [clean];

  const col1Code = match1[1].charCodeAt(0);
  const row1 = parseInt(match1[2], 10);
  const col2Code = match2[1].charCodeAt(0);
  const row2 = parseInt(match2[2], 10);

  const startCol = Math.min(col1Code, col2Code);
  const endCol = Math.max(col1Code, col2Code);
  const startRow = Math.min(row1, row2);
  const endRow = Math.max(row1, row2);

  const keys: string[] = [];
  for (let c = startCol; c <= endCol; c++) {
    for (let r = startRow; r <= endRow; r++) {
      keys.push(`${String.fromCharCode(c)}${r}`);
    }
  }
  return keys;
}

// Evaluate a criterion like ">30", "<=10", "Pass", or "30"
export function testCriteria(val: any, criteriaRaw: string): boolean {
  if (criteriaRaw === undefined || criteriaRaw === null) return false;
  const crit = String(criteriaRaw).trim();
  const numVal = parseFloat(val);

  if (crit.startsWith('>=')) {
    const target = parseFloat(crit.substring(2).replace(/"/g, ''));
    return !isNaN(numVal) && numVal >= target;
  }
  if (crit.startsWith('<=')) {
    const target = parseFloat(crit.substring(2).replace(/"/g, ''));
    return !isNaN(numVal) && numVal <= target;
  }
  if (crit.startsWith('>')) {
    const target = parseFloat(crit.substring(1).replace(/"/g, ''));
    return !isNaN(numVal) && numVal > target;
  }
  if (crit.startsWith('<')) {
    const target = parseFloat(crit.substring(1).replace(/"/g, ''));
    return !isNaN(numVal) && numVal < target;
  }
  if (crit.startsWith('<>') || crit.startsWith('!=')) {
    const target = crit.substring(2).replace(/"/g, '');
    return String(val).toUpperCase() !== target.toUpperCase();
  }
  if (crit.startsWith('=')) {
    const target = crit.substring(1).replace(/"/g, '');
    return String(val).toUpperCase() === target.toUpperCase();
  }

  const cleanCrit = crit.replace(/"/g, '');
  return String(val).toUpperCase() === cleanCrit.toUpperCase();
}

// Evaluate individual cell value recursively
export function evaluateCell(
  cellKey: string,
  cells: Record<string, string>,
  visited: Set<string> = new Set()
): string {
  const raw = cells[cellKey];
  if (raw === undefined || raw === null || raw === '') return '';

  if (!raw.startsWith('=')) return raw;

  // Cycle detection
  if (visited.has(cellKey)) return '#CIRCULAR!';
  visited.add(cellKey);

  const formula = raw.substring(1).trim();
  const res = parseAndExecuteFormula(formula, cells, visited);
  return res;
}

// Helper to resolve cell key or literal value
function resolveToken(token: string, cells: Record<string, string>, visited: Set<string>): any {
  let clean = token.trim();
  if (clean.startsWith('"') && clean.endsWith('"')) {
    return clean.slice(1, -1);
  }
  if (clean.startsWith("'") && clean.endsWith("'")) {
    return clean.slice(1, -1);
  }
  const cellRef = clean.replace(/\$/g, '').toUpperCase();
  if (/^[A-Z]+\d+$/.test(cellRef)) {
    const evaluated = evaluateCell(cellRef, cells, new Set(visited));
    if (typeof evaluated === 'string' && evaluated.startsWith('#')) {
      return evaluated;
    }
    const num = parseFloat(evaluated);
    return isNaN(num) ? evaluated : num;
  }
  const num = parseFloat(clean);
  return isNaN(num) ? clean : num;
}

// Extract arguments inside top-level parentheses
function parseArgs(argsStr: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let inQuotes = false;
  let current = '';

  for (let i = 0; i < argsStr.length; i++) {
    const char = argsStr[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === '(' && !inQuotes) {
      depth++;
      current += char;
    } else if (char === ')' && !inQuotes) {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0 && !inQuotes) {
      args.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    args.push(current.trim());
  }
  return args;
}

const KNOWN_FUNCTIONS = new Set([
  'SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT', 'COUNTA', 'COUNTIF', 'COUNTIFS',
  'AVERAGEIF', 'MEDIAN', 'MODE', 'RANK', 'IF', 'AND', 'OR', 'NOT',
  'LOWER', 'UPPER', 'CONCATENATE', 'CONCAT', 'DATE', 'TODAY', 'NOW', 'VLOOKUP'
]);

// Main Formula Parser & Evaluator
export function parseAndExecuteFormula(
  formula: string,
  cells: Record<string, string>,
  visited: Set<string> = new Set()
): string {
  try {
    const upper = formula.toUpperCase();

    // 1. Check for function calls like FUNC(...)
    const fnMatch = formula.match(/^([A-Z0-9_]+)\((.*)\)$/i);
    if (fnMatch) {
      const fnName = fnMatch[1].toUpperCase();
      const rawArgs = fnMatch[2];
      const parsedArgs = parseArgs(rawArgs);

      if (!KNOWN_FUNCTIONS.has(fnName)) {
        return '#NAME?';
      }

      // --- SUM ---
      if (fnName === 'SUM') {
        let sum = 0;
        for (const arg of parsedArgs) {
          const rangeKeys = expandCellRange(arg);
          for (const k of rangeKeys) {
            const v = resolveToken(k, cells, visited);
            if (typeof v === 'string' && v.startsWith('#')) return v;
            const n = typeof v === 'number' ? v : parseFloat(v);
            if (!isNaN(n)) sum += n;
          }
        }
        return String(sum);
      }

      // --- AVERAGE ---
      if (fnName === 'AVERAGE') {
        let sum = 0;
        let count = 0;
        for (const arg of parsedArgs) {
          const rangeKeys = expandCellRange(arg);
          for (const k of rangeKeys) {
            const v = resolveToken(k, cells, visited);
            if (typeof v === 'string' && v.startsWith('#')) return v;
            const n = typeof v === 'number' ? v : parseFloat(v);
            if (!isNaN(n)) {
              sum += n;
              count++;
            }
          }
        }
        return count === 0 ? '#DIV/0!' : (sum / count).toFixed(2);
      }

      // --- MIN ---
      if (fnName === 'MIN') {
        let minVal: number | null = null;
        for (const arg of parsedArgs) {
          const rangeKeys = expandCellRange(arg);
          for (const k of rangeKeys) {
            const v = resolveToken(k, cells, visited);
            if (typeof v === 'string' && v.startsWith('#')) return v;
            const n = typeof v === 'number' ? v : parseFloat(v);
            if (!isNaN(n)) {
              if (minVal === null || n < minVal) minVal = n;
            }
          }
        }
        return minVal !== null ? String(minVal) : '0';
      }

      // --- MAX ---
      if (fnName === 'MAX') {
        let maxVal: number | null = null;
        for (const arg of parsedArgs) {
          const rangeKeys = expandCellRange(arg);
          for (const k of rangeKeys) {
            const v = resolveToken(k, cells, visited);
            if (typeof v === 'string' && v.startsWith('#')) return v;
            const n = typeof v === 'number' ? v : parseFloat(v);
            if (!isNaN(n)) {
              if (maxVal === null || n > maxVal) maxVal = n;
            }
          }
        }
        return maxVal !== null ? String(maxVal) : '0';
      }

      // --- COUNT ---
      if (fnName === 'COUNT') {
        let count = 0;
        for (const arg of parsedArgs) {
          const rangeKeys = expandCellRange(arg);
          for (const k of rangeKeys) {
            const v = resolveToken(k, cells, visited);
            if (typeof v === 'string' && v.startsWith('#')) return v;
            const n = typeof v === 'number' ? v : parseFloat(v);
            if (!isNaN(n)) count++;
          }
        }
        return String(count);
      }

      // --- COUNTA ---
      if (fnName === 'COUNTA') {
        let count = 0;
        for (const arg of parsedArgs) {
          const rangeKeys = expandCellRange(arg);
          for (const k of rangeKeys) {
            const v = resolveToken(k, cells, visited);
            if (typeof v === 'string' && v.startsWith('#')) return v;
            if (v !== '' && v !== null && v !== undefined) count++;
          }
        }
        return String(count);
      }

      // --- COUNTIF ---
      if (fnName === 'COUNTIF') {
        if (parsedArgs.length < 2) return '#ARG_ERR!';
        const rangeKeys = expandCellRange(parsedArgs[0]);
        const critRaw = resolveToken(parsedArgs[1], cells, visited);
        if (typeof critRaw === 'string' && critRaw.startsWith('#')) return critRaw;
        let count = 0;
        for (const k of rangeKeys) {
          const v = resolveToken(k, cells, visited);
          if (typeof v === 'string' && v.startsWith('#')) return v;
          if (testCriteria(v, String(critRaw))) count++;
        }
        return String(count);
      }

      // --- COUNTIFS ---
      if (fnName === 'COUNTIFS') {
        if (parsedArgs.length < 4 || parsedArgs.length % 2 !== 0) return '#ARG_ERR!';
        const r1Keys = expandCellRange(parsedArgs[0]);
        const crit1 = resolveToken(parsedArgs[1], cells, visited);
        const r2Keys = expandCellRange(parsedArgs[2]);
        const crit2 = resolveToken(parsedArgs[3], cells, visited);

        if (typeof crit1 === 'string' && crit1.startsWith('#')) return crit1;
        if (typeof crit2 === 'string' && crit2.startsWith('#')) return crit2;

        let count = 0;
        const len = Math.min(r1Keys.length, r2Keys.length);
        for (let i = 0; i < len; i++) {
          const v1 = resolveToken(r1Keys[i], cells, visited);
          const v2 = resolveToken(r2Keys[i], cells, visited);
          if (typeof v1 === 'string' && v1.startsWith('#')) return v1;
          if (typeof v2 === 'string' && v2.startsWith('#')) return v2;
          if (testCriteria(v1, String(crit1)) && testCriteria(v2, String(crit2))) {
            count++;
          }
        }
        return String(count);
      }

      // --- AVERAGEIF ---
      if (fnName === 'AVERAGEIF') {
        if (parsedArgs.length < 2) return '#ARG_ERR!';
        const rangeKeys = expandCellRange(parsedArgs[0]);
        const critRaw = resolveToken(parsedArgs[1], cells, visited);
        if (typeof critRaw === 'string' && critRaw.startsWith('#')) return critRaw;
        let sum = 0;
        let count = 0;
        for (const k of rangeKeys) {
          const v = resolveToken(k, cells, visited);
          if (typeof v === 'string' && v.startsWith('#')) return v;
          if (testCriteria(v, String(critRaw))) {
            const n = typeof v === 'number' ? v : parseFloat(v);
            if (!isNaN(n)) {
              sum += n;
              count++;
            }
          }
        }
        return count === 0 ? '#DIV/0!' : (sum / count).toFixed(2);
      }

      // --- MEDIAN ---
      if (fnName === 'MEDIAN') {
        const nums: number[] = [];
        for (const arg of parsedArgs) {
          const rangeKeys = expandCellRange(arg);
          for (const k of rangeKeys) {
            const v = resolveToken(k, cells, visited);
            if (typeof v === 'string' && v.startsWith('#')) return v;
            const n = typeof v === 'number' ? v : parseFloat(v);
            if (!isNaN(n)) nums.push(n);
          }
        }
        if (nums.length === 0) return '0';
        nums.sort((a, b) => a - b);
        const mid = Math.floor(nums.length / 2);
        if (nums.length % 2 === 0) {
          return String((nums[mid - 1] + nums[mid]) / 2);
        }
        return String(nums[mid]);
      }

      // --- MODE ---
      if (fnName === 'MODE') {
        const freq: Record<string, number> = {};
        let maxCount = 0;
        let modeVal: string = 'N/A';

        for (const arg of parsedArgs) {
          const rangeKeys = expandCellRange(arg);
          for (const k of rangeKeys) {
            const v = resolveToken(k, cells, visited);
            if (typeof v === 'string' && v.startsWith('#')) return v;
            const n = typeof v === 'number' ? v : parseFloat(v);
            if (!isNaN(n)) {
              const strKey = String(n);
              freq[strKey] = (freq[strKey] || 0) + 1;
              if (freq[strKey] > maxCount) {
                maxCount = freq[strKey];
                modeVal = strKey;
              }
            }
          }
        }
        return modeVal;
      }

      // --- RANK ---
      if (fnName === 'RANK') {
        if (parsedArgs.length < 2) return '#ARG_ERR!';
        const numToRankVal = resolveToken(parsedArgs[0], cells, visited);
        if (typeof numToRankVal === 'string' && numToRankVal.startsWith('#')) return numToRankVal;
        const numToRank = parseFloat(numToRankVal);
        const rangeKeys = expandCellRange(parsedArgs[1]);
        const allNums: number[] = [];

        for (const k of rangeKeys) {
          const v = resolveToken(k, cells, visited);
          if (typeof v === 'string' && v.startsWith('#')) return v;
          const n = typeof v === 'number' ? v : parseFloat(v);
          if (!isNaN(n)) allNums.push(n);
        }

        if (isNaN(numToRank) || allNums.length === 0) return 'N/A';
        // Descending order rank
        allNums.sort((a, b) => b - a);
        const rank = allNums.indexOf(numToRank) + 1;
        return rank > 0 ? String(rank) : 'N/A';
      }

      // --- IF ---
      if (fnName === 'IF') {
        if (parsedArgs.length < 2) return '#ARG_ERR!';
        const condExpr = parsedArgs[0];
        const valTrue = resolveToken(parsedArgs[1], cells, visited);
        if (typeof valTrue === 'string' && valTrue.startsWith('#')) return valTrue;
        const valFalse = parsedArgs.length > 2 ? resolveToken(parsedArgs[2], cells, visited) : '';
        if (typeof valFalse === 'string' && valFalse.startsWith('#')) return valFalse;

        const condResult = evaluateCondition(condExpr, cells, visited);
        return condResult ? String(valTrue) : String(valFalse);
      }

      // --- AND ---
      if (fnName === 'AND') {
        for (const arg of parsedArgs) {
          const res = evaluateCondition(arg, cells, visited);
          if (!res) return 'FALSE';
        }
        return 'TRUE';
      }

      // --- OR ---
      if (fnName === 'OR') {
        for (const arg of parsedArgs) {
          const res = evaluateCondition(arg, cells, visited);
          if (res) return 'TRUE';
        }
        return 'FALSE';
      }

      // --- NOT ---
      if (fnName === 'NOT') {
        const res = evaluateCondition(parsedArgs[0] || 'FALSE', cells, visited);
        return res ? 'FALSE' : 'TRUE';
      }

      // --- LOWER ---
      if (fnName === 'LOWER') {
        const val = resolveToken(parsedArgs[0] || '', cells, visited);
        if (typeof val === 'string' && val.startsWith('#')) return val;
        return String(val).toLowerCase();
      }

      // --- UPPER ---
      if (fnName === 'UPPER') {
        const val = resolveToken(parsedArgs[0] || '', cells, visited);
        if (typeof val === 'string' && val.startsWith('#')) return val;
        return String(val).toUpperCase();
      }

      // --- CONCATENATE / CONCAT ---
      if (fnName === 'CONCATENATE' || fnName === 'CONCAT') {
        let res = '';
        for (const arg of parsedArgs) {
          const val = resolveToken(arg, cells, visited);
          if (typeof val === 'string' && val.startsWith('#')) return val;
          res += String(val);
        }
        return res;
      }

      // --- DATE ---
      if (fnName === 'DATE') {
        if (parsedArgs.length < 3) return '#ARG_ERR!';
        const y = resolveToken(parsedArgs[0], cells, visited);
        const m = String(resolveToken(parsedArgs[1], cells, visited)).padStart(2, '0');
        const d = String(resolveToken(parsedArgs[2], cells, visited)).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }

      // --- TODAY ---
      if (fnName === 'TODAY') {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }

      // --- NOW ---
      if (fnName === 'NOW') {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}`;
      }

      // --- VLOOKUP ---
      if (fnName === 'VLOOKUP') {
        if (parsedArgs.length < 3) return '#N/A';
        const targetVal = resolveToken(parsedArgs[0], cells, visited);
        if (typeof targetVal === 'string' && targetVal.startsWith('#')) return targetVal;
        const tableRange = expandCellRange(parsedArgs[1]);
        const colIdx = parseInt(resolveToken(parsedArgs[2], cells, visited), 10);

        if (tableRange.length === 0 || isNaN(colIdx) || colIdx < 1) return '#N/A';

        // Reconstruct table grid from expanded cell range
        const startCell = tableRange[0];
        const endCell = tableRange[tableRange.length - 1];

        const matchStart = startCell.match(/([A-Z]+)(\d+)/);
        const matchEnd = endCell.match(/([A-Z]+)(\d+)/);
        if (!matchStart || !matchEnd) return '#N/A';

        const startColCode = matchStart[1].charCodeAt(0);
        const startRow = parseInt(matchStart[2], 10);
        const endRow = parseInt(matchEnd[2], 10);

        // Target col key for result
        const targetColCode = startColCode + colIdx - 1;
        const targetColChar = String.fromCharCode(targetColCode);
        const keyColChar = String.fromCharCode(startColCode);

        for (let r = startRow; r <= endRow; r++) {
          const keyCell = `${keyColChar}${r}`;
          const valInKeyCell = resolveToken(keyCell, cells, visited);

          if (String(valInKeyCell).toUpperCase() === String(targetVal).toUpperCase()) {
            const resultCellKey = `${targetColChar}${r}`;
            const resVal = resolveToken(resultCellKey, cells, visited);
            return String(resVal);
          }
        }
        return '#N/A';
      }
    }

    // 2. Expression Evaluation (e.g. C2*D2*$F$2, C2+D2, 10-3, 20/5, C2*0.3)
    return evaluateArithmeticExpression(formula, cells, visited);
  } catch (e) {
    return '#VALUE!';
  }
}

// Evaluate conditional statements like "C2>=40", "C2='Yes'", "C2>10"
function evaluateCondition(condExpr: string, cells: Record<string, string>, visited: Set<string>): boolean {
  const opMatch = condExpr.match(/(>=|<=|<>|!=|>|<|=)/);
  if (!opMatch) {
    const val = resolveToken(condExpr, cells, visited);
    return Boolean(val) && val !== 'FALSE' && val !== '0' && val !== 0;
  }

  const op = opMatch[1];
  const parts = condExpr.split(op);
  const left = resolveToken(parts[0], cells, visited);
  const right = resolveToken(parts[1], cells, visited);

  const numLeft = parseFloat(left);
  const numRight = parseFloat(right);

  const bothNums = !isNaN(numLeft) && !isNaN(numRight);

  if (op === '>=') return bothNums ? numLeft >= numRight : String(left) >= String(right);
  if (op === '<=') return bothNums ? numLeft <= numRight : String(left) <= String(right);
  if (op === '>') return bothNums ? numLeft > numRight  : String(left) > String(right);
  if (op === '<') return bothNums ? numLeft < numRight  : String(left) < String(right);
  if (op === '<=' || op === '!=') return String(left).toUpperCase() !== String(right).toUpperCase();
  if (op === '=') return String(left).toUpperCase() === String(right).toUpperCase();

  return false;
}

// Simple arithmetic expression evaluator (+, -, *, /) with cell substitution
function evaluateArithmeticExpression(expr: string, cells: Record<string, string>, visited: Set<string>): string {
  let cellError: string | null = null;

  // Replace cell references with evaluated numbers
  let replaced = expr.replace(/(\$?[A-Z]+\$?\d+)/gi, (match) => {
    const cellKey = match.replace(/\$/g, '').toUpperCase();
    const val = resolveToken(cellKey, cells, visited);
    if (typeof val === 'string' && val.startsWith('#')) {
      cellError = val;
      return '0';
    }
    const n = typeof val === 'number' ? val : parseFloat(val);
    return isNaN(n) ? '0' : String(n);
  });

  if (cellError) return cellError;

  // Sanitize for basic math characters only
  if (/^[0-9+*\/\-().\s]+$/.test(replaced)) {
    try {
      // Check division by 0 pattern explicitly (e.g. /0 or / 0)
      if (/\/[\s]*0(?![0-9.])/g.test(replaced)) {
        return '#DIV/0!';
      }

      // Safe numeric eval
      const fn = new Function(`return (${replaced});`);
      const res = fn();
      if (typeof res === 'number') {
        if (!isFinite(res) || isNaN(res)) {
          return '#DIV/0!';
        }
        return Number.isInteger(res) ? String(res) : res.toFixed(2);
      }
      return String(res);
    } catch {
      return '#VALUE!';
    }
  }

  return expr;
}

export interface FormulaValidationError {
  code: '#DIV/0!' | '#CIRCULAR!' | '#NAME?' | '#VALUE!' | '#REF!' | '#N/A' | '#ARG_ERR!';
  message: string;
}

export interface FormulaValidationResult {
  isValid: boolean;
  evaluatedValue: string;
  error: FormulaValidationError | null;
}

/**
 * Validate formula for errors like division by zero, circular references, unknown functions, or syntax issues.
 */
export function validateCellFormula(
  cellKey: string,
  formulaInput: string,
  cells: Record<string, string>
): FormulaValidationResult {
  if (!formulaInput.startsWith('=')) {
    return {
      isValid: true,
      evaluatedValue: formulaInput,
      error: null
    };
  }

  const tempCells = { ...cells, [cellKey]: formulaInput };
  const evaluatedValue = evaluateCell(cellKey, tempCells);

  if (evaluatedValue.startsWith('#')) {
    let message = 'Formula error detected.';
    if (evaluatedValue === '#DIV/0!') {
      message = 'Division by zero error (#DIV/0!): Formula attempts to divide by 0 or an empty cell.';
    } else if (evaluatedValue === '#CIRCULAR!') {
      message = `Circular reference error (#CIRCULAR!): Cell ${cellKey} directly or indirectly references itself.`;
    } else if (evaluatedValue === '#NAME?') {
      message = 'Invalid function name (#NAME?): Formula contains an unrecognized function.';
    } else if (evaluatedValue === '#VALUE!') {
      message = 'Value error (#VALUE!): Incorrect data type or invalid arithmetic syntax.';
    } else if (evaluatedValue === '#REF!') {
      message = 'Reference error (#REF!): Invalid or out-of-bounds cell reference.';
    } else if (evaluatedValue === '#N/A') {
      message = 'Value not available (#N/A): Target lookup value could not be found.';
    } else if (evaluatedValue === '#ARG_ERR!') {
      message = 'Argument error (#ARG_ERR!): Missing or invalid parameters in formula function.';
    }

    return {
      isValid: false,
      evaluatedValue,
      error: {
        code: evaluatedValue as any,
        message
      }
    };
  }

  return {
    isValid: true,
    evaluatedValue,
    error: null
  };
}

/**
 * Shift cell references in a formula by rowOffset and colOffset.
 * Respects absolute references ($A$1, $A1, A$1).
 */
export function shiftFormula(formula: string, rowOffset: number, colOffset: number): string {
  if (!formula.startsWith('=')) {
    // If it's a numeric value, auto-increment numbers when dragged down if part of a sequence
    const num = parseFloat(formula);
    if (!isNaN(num) && rowOffset > 0) {
      return String(num + rowOffset);
    }
    return formula;
  }

  return '=' + formula.slice(1).replace(/(\$?([A-Z]+))(\$?(\d+))/gi, (match, colPart, colLetters, rowPart, rowDigits) => {
    let newCol = colLetters.toUpperCase();
    let newRow = parseInt(rowDigits, 10);

    // If colPart does NOT start with $, shift column
    if (!colPart.startsWith('$') && colOffset !== 0) {
      const colCode = colLetters.toUpperCase().charCodeAt(0) + colOffset;
      if (colCode >= 65 && colCode <= 90) {
        newCol = String.fromCharCode(colCode);
      }
    }

    // If rowPart does NOT start with $, shift row
    if (!rowPart.startsWith('$') && rowOffset !== 0) {
      newRow = Math.max(1, newRow + rowOffset);
    }

    const finalCol = colPart.startsWith('$') ? `$${newCol}` : newCol;
    const finalRow = rowPart.startsWith('$') ? `$${newRow}` : newRow;

    return `${finalCol}${finalRow}`;
  });
}

/**
 * Auto-suggest function catalog entries based on what the user is typing after '='
 */
export function getFormulaSuggestions(val: string): ExcelFunctionDoc[] {
  if (!val || !val.startsWith('=')) return [];
  const trimmed = val.trim();
  if (trimmed.endsWith('(')) return [];

  const match = val.match(/([A-Za-z0-9_]+)$/);
  if (!match) {
    if (trimmed.endsWith('=')) {
      return EXCEL_FUNCTIONS_CATALOG.filter((f) =>
        ['SUM', 'AVERAGE', 'COUNT', 'MIN', 'MAX', 'IF', 'VLOOKUP', 'COUNTA'].includes(f.name)
      );
    }
    return [];
  }

  const query = match[1].toUpperCase();
  return EXCEL_FUNCTIONS_CATALOG.filter((f) => f.name.startsWith(query));
}

/**
 * Apply selected function suggestion to formula string
 */
export function applyFormulaSuggestion(currentVal: string, fnName: string): string {
  const match = currentVal.match(/([A-Za-z0-9_]+)$/);
  const queryLen = match ? match[1].length : 0;
  return currentVal.substring(0, currentVal.length - queryLen) + fnName + '(';
}

