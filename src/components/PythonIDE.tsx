import React, { useState, useEffect, useRef } from 'react';
import { getStudentPythonPresets, subscribeToContentChanges } from '../lib/contentManager';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';

export const highlightPython = (codeText: string): string => {
  try {
    const grammar = Prism.languages.python || Prism.languages.clike;
    return Prism.highlight(codeText || '', grammar, 'python');
  } catch {
    return codeText;
  }
};
import {
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Terminal,
  FileCode,
  BookOpen,
  BookMarked,
  X,
  Bug,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Wand2
} from 'lucide-react';
import { PythonReference } from './PythonReference';

export interface CodeSuggestion {
  id: string;
  topicNumber: number;
  topicName: string;
  type: 'hint' | 'warning' | 'syntax' | 'best_practice';
  lineNumber?: number;
  message: string;
  snippet?: string;
}

export function analyzeCodeSuggestions(codeText: string): CodeSuggestion[] {
  const suggestions: CodeSuggestion[] = [];
  const lines = codeText.split('\n');

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const trimmed = lineText.trim();

    if (!trimmed) return;

    // Lint Warning: Missing colon in block statements
    if (/^(if|elif|else|for|while|def)\b/.test(trimmed) && !trimmed.endsWith(':') && !trimmed.startsWith('#')) {
      const keyword = trimmed.split(' ')[0];
      const topicNum = keyword === 'def' ? 35 : (keyword === 'for' || keyword === 'while' ? 25 : 20);
      const topicLabel = keyword === 'def' ? '35. Python Functions' : (keyword === 'for' || keyword === 'while' ? '25. Loops' : '20. Conditional Statements');
      suggestions.push({
        id: `missing-colon-${lineNum}`,
        topicNumber: topicNum,
        topicName: topicLabel,
        type: 'warning',
        lineNumber: lineNum,
        message: `Line ${lineNum}: Missing colon ':' at the end of '${keyword}' statement.`,
        snippet: lineText + ':'
      });
    }

    // Lint Warning: Single '=' inside if / elif condition
    if (/^(if|elif)\s+[^=]*=[^=]*/.test(trimmed) && !trimmed.includes('==') && !trimmed.includes('!=') && !trimmed.includes('>=') && !trimmed.includes('<=')) {
      suggestions.push({
        id: `assignment-in-if-${lineNum}`,
        topicNumber: 14,
        topicName: '13. Assignment vs 14. Comparison Operators',
        type: 'warning',
        lineNumber: lineNum,
        message: `Line ${lineNum}: Single '=' assigns values. Use '==' for equality comparison in conditional statements.`
      });
    }

    // Lint Warning: Lowercase boolean true/false
    if (/\b(true|false)\b/.test(trimmed) && !trimmed.startsWith('#')) {
      suggestions.push({
        id: `lowercase-bool-${lineNum}`,
        topicNumber: 34,
        topicName: '34. Boolean Data Types',
        type: 'warning',
        lineNumber: lineNum,
        message: `Line ${lineNum}: In Python, Boolean values are capitalized ('True' or 'False').`
      });
    }

    // Concept Hint: print() or input()
    if (trimmed.includes('input(') && !trimmed.startsWith('#')) {
      suggestions.push({
        id: `hint-input-${lineNum}`,
        topicNumber: 7,
        topicName: '7. Print() / Input Function & 17. Data Types',
        type: 'hint',
        lineNumber: lineNum,
        message: `input() returns a string (<str>). Wrap with int(input(...)) or float(input(...)) for math operations.`
      });
    } else if (trimmed.includes('print(') && !trimmed.startsWith('#')) {
      suggestions.push({
        id: `hint-print-${lineNum}`,
        topicNumber: 7,
        topicName: '7. Print() / Input Function',
        type: 'hint',
        lineNumber: lineNum,
        message: `f-string syntax print(f"Value: {var}") formats variables cleanly inside output strings.`
      });
    }

    // Concept Hint: Functions & Scope
    if (trimmed.startsWith('def ') && !trimmed.startsWith('#')) {
      suggestions.push({
        id: `hint-def-${lineNum}`,
        topicNumber: 35,
        topicName: '35. Python Functions & 36. Variable Scope',
        type: 'hint',
        lineNumber: lineNum,
        message: `Function parameters have local scope. Use 'return' statement to send results back.`
      });
    }

    // Concept Hint: Recursive Functions
    const funcMatch = trimmed.match(/^def\s+(\w+)\b/);
    if (funcMatch) {
      const funcName = funcMatch[1];
      const callsSelf = lines.some((l, i) => i > idx && l.includes(`${funcName}(`));
      if (callsSelf) {
        suggestions.push({
          id: `hint-recursion-${lineNum}`,
          topicNumber: 38,
          topicName: '38. Recursive Function',
          type: 'hint',
          lineNumber: lineNum,
          message: `Recursive function '${funcName}' detected. Ensure a stopping base case exists!`
        });
      }
    }

    // Concept Hint: Loop Controls
    if (/\b(break|continue|pass)\b/.test(trimmed) && !trimmed.startsWith('#')) {
      suggestions.push({
        id: `hint-loop-control-${lineNum}`,
        topicNumber: 28,
        topicName: '28. Break, Continue and Pass',
        type: 'syntax',
        lineNumber: lineNum,
        message: `'break' terminates loop, 'continue' skips iteration, 'pass' acts as a null statement.`
      });
    }

    // Concept Hint: Collections
    if (trimmed.includes('[') && trimmed.includes(']') && !trimmed.startsWith('#')) {
      suggestions.push({
        id: `hint-list-${lineNum}`,
        topicNumber: 30,
        topicName: '30. Python Lists',
        type: 'hint',
        lineNumber: lineNum,
        message: `Lists are ordered & mutable sequences. Indexing starts at 0.`
      });
    }
    if (trimmed.includes('{') && trimmed.includes('}') && trimmed.includes(':') && !trimmed.startsWith('#')) {
      suggestions.push({
        id: `hint-dict-${lineNum}`,
        topicNumber: 33,
        topicName: '33. Python Dictionary',
        type: 'hint',
        lineNumber: lineNum,
        message: `Dictionaries store key: value mappings. Use dict.keys() or dict.get().`
      });
    }

    // Concept Hint: Comments
    if (trimmed.startsWith('#')) {
      suggestions.push({
        id: `hint-comment-${lineNum}`,
        topicNumber: 9,
        topicName: '9. Python Comments',
        type: 'best_practice',
        lineNumber: lineNum,
        message: `Comments starting with # explain code logic and are ignored by interpreter.`
      });
    }
  });

  if (suggestions.length === 0) {
    suggestions.push({
      id: 'general-start',
      topicNumber: 6,
      topicName: '6. Python Introduction',
      type: 'best_practice',
      message: 'Write Python code! Suggestions and linting hints will appear live as you type.'
    });
  }

  return suggestions;
}

// Polyfills for common Python-like method names on JS prototypes
if (typeof window !== 'undefined') {
  if (!(String.prototype as any).lower) {
    Object.defineProperty(String.prototype, 'lower', {
      value: function () { return this.toLowerCase(); },
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
  if (!(String.prototype as any).upper) {
    Object.defineProperty(String.prototype, 'upper', {
      value: function () { return this.toUpperCase(); },
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
  if (!(String.prototype as any).strip) {
    Object.defineProperty(String.prototype, 'strip', {
      value: function () { return this.trim(); },
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
  if (!(Array.prototype as any).append) {
    Object.defineProperty(Array.prototype, 'append', {
      value: function (...args: any[]) { return this.push(...args); },
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
}

export function createPythonDict(obj: any): any {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj) || obj instanceof Set || obj instanceof Map) {
    return obj;
  }
  
  // Recursively wrap children if they are plain objects
  for (const k of Object.keys(obj)) {
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      obj[k] = createPythonDict(obj[k]);
    }
  }
  
  if (!Object.prototype.hasOwnProperty.call(obj, 'get')) {
    Object.defineProperty(obj, 'get', {
      value: function (key: string, defaultVal: any = null) {
        return this && Object.prototype.hasOwnProperty.call(this, key) && this[key] !== undefined ? this[key] : defaultVal;
      },
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
  if (!Object.prototype.hasOwnProperty.call(obj, 'keys')) {
    Object.defineProperty(obj, 'keys', {
      value: function () {
        return Object.keys(this).filter(k => typeof this[k] !== 'function');
      },
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
  if (!Object.prototype.hasOwnProperty.call(obj, 'values')) {
    Object.defineProperty(obj, 'values', {
      value: function () {
        return Object.values(this).filter(v => typeof v !== 'function');
      },
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
  if (!Object.prototype.hasOwnProperty.call(obj, 'items')) {
    Object.defineProperty(obj, 'items', {
      value: function () {
        return Object.keys(this).filter(k => typeof this[k] !== 'function').map(k => [k, this[k]]);
      },
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
  return obj;
}

export interface DebugStep {
  lineNumber: number;
  codeLine: string;
  explanation: string;
  variables: Record<string, any>;
  variableTypes: Record<string, string>;
  changedVars: string[];
  outputLogs: string[];
  requiresInput?: boolean;
}

function getIndent(line: string): number {
  let count = 0;
  for (const char of line) {
    if (char === ' ') count += 1;
    else if (char === '\t') count += 4;
    else break;
  }
  return count;
}

function cleanCondition(line: string, keyword: 'if' | 'elif' | 'while'): string {
  let trimmed = line.trim();
  // Strip inline comments first
  trimmed = trimmed.replace(/#.*$/, '').trim();
  // Remove keyword at start
  const regex = new RegExp('^' + keyword + '\\b');
  trimmed = trimmed.replace(regex, '').trim();
  // Remove trailing colon and any surrounding whitespace
  trimmed = trimmed.replace(/:\s*$/, '').trim();
  return trimmed;
}

function parseAssignment(line: string): { varName: string; expr: string } | null {
  let trimmed = line.trim();
  // Don't match control statements or commands
  if (/^(if|elif|else|while|for|def|return|print|import|from)\b/.test(trimmed)) {
    return null;
  }
  // Expand augmented assignments
  trimmed = trimmed.replace(/(\w+)\s*\+=\s*(.+)/s, '$1 = $1 + ($2)')
                   .replace(/(\w+)\s*-=\s*(.+)/s, '$1 = $1 - ($2)')
                   .replace(/(\w+)\s*\*=\s*(.+)/s, '$1 = $1 * ($2)')
                   .replace(/(\w+)\s*\/=\s*(.+)/s, '$1 = $1 / ($2)');

  // Match single assignment operator '=' that is not '==', '!=', '<=', '>='
  const match = trimmed.match(/^([^=!<>]+)=(?![=])([\s\S]+)$/);
  if (!match) return null;

  return {
    varName: match[1].trim(),
    expr: match[2].trim()
  };
}

function transformPythonTernary(expr: string): string {
  let current = expr;
  let match = current.match(/^([\s\S]+?)\s+\bif\b\s+([\s\S]+?)\s+\belse\b\s+([\s\S]+)$/);
  if (match) {
    const valTrue = transformPythonTernary(match[1]);
    const cond = transformPythonTernary(match[2]);
    const valFalse = transformPythonTernary(match[3]);
    return `((${cond}) ? (${valTrue}) : (${valFalse}))`;
  }
  return current;
}

export function evaluatePythonExpr(expr: string, scope: Record<string, any>, currentSimulatedInput = '7.0'): any {
  let jsExpr = transformPythonTernary(expr.trim())
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null')
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g, '||')
    .replace(/\bnot\b/g, '!')
    .replace(/\bis\s+not\b/g, '!==')
    .replace(/\bis\b/g, '===')
    .replace(/(\w+|\d+|\([^)]+\))\s*\/\/\s*(\w+|\d+|\([^)]+\))/g, 'Math.floor(($1) / ($2))')
    .replace(/\.lower\(\)/g, '.toLowerCase()')
    .replace(/\.upper\(\)/g, '.toUpperCase()')
    .replace(/\.strip\(\)/g, '.trim()')
    .replace(/\.split\(\)/g, '.split(/\\s+/)');

  const combined = {
    input: (p?: string) => currentSimulatedInput ?? '',
    len: (obj: any) => (Array.isArray(obj) || typeof obj === 'string' ? obj.length : (obj && typeof obj === 'object' ? Object.keys(obj).filter(k => typeof obj[k] !== 'function').length : 0)),
    int: (v: any) => {
      const trimmedVal = typeof v === 'string' ? v.trim() : v;
      const n = Number(trimmedVal);
      if (isNaN(n) || typeof v === 'object' || Array.isArray(v) || trimmedVal === '') {
        throw new Error(`ValueError: invalid literal for int() with base 10: '${v}'`);
      }
      return Math.trunc(n);
    },
    float: (v: any) => {
      const trimmedVal = typeof v === 'string' ? v.trim() : v;
      const n = Number(trimmedVal);
      if (isNaN(n) || typeof v === 'object' || Array.isArray(v) || trimmedVal === '') {
        throw new Error(`ValueError: could not convert string to float: '${v}'`);
      }
      return n;
    },
    str: (v: any) => String(v),
    list: (v: any) => (Array.isArray(v) ? v : Array.from(v || [])),
    tuple: (v: any) => (Array.isArray(v) ? v : Array.from(v || [])),
    set: (v: any) => new Set(Array.from(v || [])),
    dict: (v: any) => createPythonDict(typeof v === 'object' && v !== null ? v : {}),
    sum: (arr: number[]) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0),
    min: (...args: any[]) => (Array.isArray(args[0]) ? Math.min(...args[0]) : Math.min(...args)),
    max: (...args: any[]) => (Array.isArray(args[0]) ? Math.max(...args[0]) : Math.max(...args)),
    enumerate: (arr: any[], start = 0) => {
      if (!Array.isArray(arr)) return [];
      return arr.map((item, idx) => [idx + start, item]);
    },
    range: (...args: number[]) => {
      let start = 0, stop = 0, step = 1;
      if (args.length === 1) stop = args[0];
      else if (args.length === 2) { start = args[0]; stop = args[1]; }
      else if (args.length === 3) { start = args[0]; stop = args[1]; step = args[2]; }
      const res = [];
      for (let i = start; step > 0 ? i < stop : i > stop; i += step) res.push(i);
      return res;
    },
    math: {
      pi: Math.PI,
      e: Math.E,
      tau: 2 * Math.PI,
      inf: Infinity,
      nan: NaN,
      sqrt: Math.sqrt,
      abs: Math.abs,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      asin: Math.asin,
      acos: Math.acos,
      atan: Math.atan,
      atan2: Math.atan2,
      ceil: Math.ceil,
      floor: Math.floor,
      pow: Math.pow,
      log: Math.log,
      log10: Math.log10,
      log2: Math.log2,
      sinh: Math.sinh,
      cosh: Math.cosh,
      tanh: Math.tanh,
      degrees: (rad: number) => rad * (180 / Math.PI),
      radians: (deg: number) => deg * (Math.PI / 180),
      factorial: (n: number) => {
        if (n < 0) throw new Error("ValueError: factorial() not defined for negative values");
        let res = 1;
        if (Number.isInteger(n)) {
          for (let i = 2; i <= n; i++) res *= i;
        } else {
          throw new Error("ValueError: factorial() only accepts integral values");
        }
        return res;
      },
      gcd: (a: number, b: number) => {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
          const t = b;
          b = a % b;
          a = t;
        }
        return a;
      }
    },
    random: {
      random: () => Math.random(),
      randint: (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a,
      choice: (arr: any[]) => {
        if (!Array.isArray(arr) || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
      },
      randrange: (start: number, stop?: number, step = 1) => {
        let actualStart = 0;
        let actualStop = start;
        if (stop !== undefined) {
          actualStart = start;
          actualStop = stop;
        }
        const options = [];
        for (let i = actualStart; step > 0 ? i < actualStop : i > actualStop; i += step) {
          options.push(i);
        }
        if (options.length === 0) return null;
        return options[Math.floor(Math.random() * options.length)];
      },
      shuffle: (arr: any[]) => {
        if (!Array.isArray(arr)) return;
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      },
      sample: (population: any[], k: number) => {
        if (!Array.isArray(population) || k > population.length) {
          throw new Error("ValueError: Sample larger than population or is not an array");
        }
        const shuffled = [...population];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, k);
      }
    },
    abs: Math.abs,
    round: (n: number, d = 0) => Number(Number(n).toFixed(d)),
    type: (v: any) => typeof v,
    pyIn: (item: any, container: any) => {
      if (typeof container === 'string') return container.includes(String(item));
      if (Array.isArray(container)) return container.includes(item);
      if (container && typeof container === 'object') return item in container || Object.prototype.hasOwnProperty.call(container, item);
      return false;
    },
    ...scope,
  };

  const keys = Object.keys(combined);
  const values = Object.values(combined);

  try {
    const fn = new Function(...keys, `return (${jsExpr});`);
    const val = fn(...values);
    return createPythonDict(val);
  } catch (err: any) {
    if (err instanceof SyntaxError || err.message?.includes('Unexpected token')) {
      throw new Error(`SyntaxError: invalid syntax in '${expr}'`);
    }
    throw err;
  }
}

export function evalFStringPlaceholder(rawExpr: string, scope: Record<string, any>, currentSimulatedInput = '7.0'): string {
  let expr = rawExpr.trim();
  let formatSpec = '';

  const colonIdx = expr.lastIndexOf(':');
  if (colonIdx > 0 && !expr.includes('?') && !expr.includes('"') && !expr.includes("'")) {
    const spec = expr.substring(colonIdx + 1).trim();
    if (/^[.\d]*[f%dsgxeE]?$/.test(spec) || spec.includes('f') || spec.includes('%') || spec.includes('d')) {
      formatSpec = spec;
      expr = expr.substring(0, colonIdx).trim();
    }
  }

  const val = evaluatePythonExpr(expr, scope, currentSimulatedInput);

  if (typeof val === 'number') {
    if (formatSpec) {
      if (formatSpec.includes('%')) {
        const precMatch = formatSpec.match(/\.(\d+)%/);
        const prec = precMatch ? parseInt(precMatch[1], 10) : 2;
        return (val * 100).toFixed(prec) + '%';
      }
      const precMatch = formatSpec.match(/\.(\d+)f/);
      if (precMatch) {
        return val.toFixed(parseInt(precMatch[1], 10));
      }
      if (formatSpec.endsWith('f')) {
        return val.toFixed(2);
      }
      if (formatSpec.endsWith('d') || /^\d+d?$/.test(formatSpec)) {
        const widthMatch = formatSpec.match(/^0?(\d+)d?$/);
        if (widthMatch) {
          const width = parseInt(widthMatch[1], 10);
          return Math.round(val).toString().padStart(width, '0');
        }
      }
    }
  }

  if (typeof val === 'object' && val !== null) {
    return JSON.stringify(val);
  }
  return String(val);
}

export function parsePrintArguments(inner: string): string[] {
  const args: string[] = [];
  let current = '';
  let inDouble = false;
  let inSingle = false;
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      current += ch;
    } else if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      current += ch;
    } else if (!inDouble && !inSingle) {
      if (ch === '(') parenDepth++;
      else if (ch === ')') parenDepth--;
      else if (ch === '[') bracketDepth++;
      else if (ch === ']') bracketDepth--;
      else if (ch === '{') braceDepth++;
      else if (ch === '}') braceDepth--;

      if (ch === ',' && parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
        args.push(current.trim());
        current = '';
        continue;
      }
      current += ch;
    } else {
      current += ch;
    }
  }
  if (current.trim()) {
    args.push(current.trim());
  }
  return args;
}

export function formatPrintArg(arg: string, scope: Record<string, any>, currentSimulatedInput = '7.0'): string {
  const trimmed = arg.trim();
  if (trimmed.startsWith('f"') || trimmed.startsWith("f'")) {
    let template = trimmed.substring(2, trimmed.length - 1);
    return template.replace(/\{([^}]+)\}/g, (_, placeholder) => {
      return evalFStringPlaceholder(placeholder, scope, currentSimulatedInput);
    });
  } else if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.substring(1, trimmed.length - 1);
  } else {
    const val = evaluatePythonExpr(trimmed, scope, currentSimulatedInput);
    if (typeof val === 'object' && val !== null) {
      return JSON.stringify(val);
    }
    return String(val);
  }
}

export function getCompleteStatement(lines: string[], startIndex: number): { statement: string; endIndex: number } {
  let statement = '';
  let i = startIndex;
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;
  let inDouble = false;
  let inSingle = false;

  while (i < lines.length) {
    const line = lines[i];
    statement += (statement ? '\n' : '') + line;

    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"' && !inSingle) {
        if (j === 0 || line[j - 1] !== '\\') {
          inDouble = !inDouble;
        }
      } else if (ch === "'" && !inDouble) {
        if (j === 0 || line[j - 1] !== '\\') {
          inSingle = !inSingle;
        }
      } else if (!inDouble && !inSingle) {
        if (ch === '#') {
          break;
        }
        if (ch === '(') parenDepth++;
        else if (ch === ')') parenDepth--;
        else if (ch === '[') bracketDepth++;
        else if (ch === ']') bracketDepth--;
        else if (ch === '{') braceDepth++;
        else if (ch === '}') braceDepth--;
      }
    }

    if (parenDepth <= 0 && bracketDepth <= 0 && braceDepth <= 0) {
      break;
    }
    i++;
  }

  return {
    statement,
    endIndex: Math.min(i, lines.length - 1)
  };
}

export function getBlockLines(lines: string[], startIndex: number, defIndent: number): { bodyLines: string[], endIndex: number } {
  const bodyLines: string[] = [];
  let i = startIndex;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') {
      bodyLines.push(line);
      i++;
      continue;
    }
    const indent = getIndent(line);
    if (indent <= defIndent) {
      break;
    }
    bodyLines.push(line);
    i++;
  }
  return { bodyLines, endIndex: i - 1 };
}

export function generatePythonTrace(code: string, simulatedInput: string, userInputs: Record<number, string> = {}): DebugStep[] {
  const lines = code.split('\n');
  const steps: DebugStep[] = [];

  let currentVars: Record<string, any> = {};
  let currentTypes: Record<string, string> = {};
  let currentLogs: string[] = [];

  const getVarType = (val: any): string => {
    if (val === null || val === undefined) return 'None';
    if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'float';
    if (typeof val === 'boolean') return 'bool';
    if (typeof val === 'string') return 'str';
    if (Array.isArray(val)) return 'list';
    if (typeof val === 'object') return 'dict';
    return typeof val;
  };

  function executeTraceBlock(
    blockLines: string[],
    lineOffset: number
  ): { break?: boolean; continue?: boolean; returnVal?: any; hasReturned?: boolean } {
    let idx = 0;
    let localLastConditionMet = false;

    while (idx < blockLines.length && steps.length < 800) {
      const { statement, endIndex } = getCompleteStatement(blockLines, idx);
      const rawLine = blockLines[idx];
      const lineNum = lineOffset + idx + 1;
      const trimmed = statement.trim();
      const currentIndent = getIndent(rawLine);

      if (!trimmed || trimmed.startsWith('#')) {
        if (trimmed.startsWith('#')) {
          steps.push({
            lineNumber: lineNum,
            codeLine: rawLine,
            explanation: `Comment statement (#). Ignored by Python execution.`,
            variables: { ...currentVars },
            variableTypes: { ...currentTypes },
            changedVars: [],
            outputLogs: [...currentLogs]
          });
        }
        idx = endIndex + 1;
        continue;
      }

      if (currentIndent === getIndent(blockLines[0]) && !trimmed.startsWith('elif') && !trimmed.startsWith('else')) {
        localLastConditionMet = false;
      }

      if (trimmed === 'break') {
        steps.push({
          lineNumber: lineNum,
          codeLine: rawLine,
          explanation: 'Executing break statement: exiting loop.',
          variables: { ...currentVars },
          variableTypes: { ...currentTypes },
          changedVars: [],
          outputLogs: [...currentLogs]
        });
        idx = endIndex + 1;
        return { break: true };
      }

      if (trimmed === 'continue') {
        steps.push({
          lineNumber: lineNum,
          codeLine: rawLine,
          explanation: 'Executing continue statement: skipping to next iteration.',
          variables: { ...currentVars },
          variableTypes: { ...currentTypes },
          changedVars: [],
          outputLogs: [...currentLogs]
        });
        idx = endIndex + 1;
        return { continue: true };
      }

      if (trimmed.startsWith('return ') || trimmed === 'return') {
        const returnExpr = trimmed.startsWith('return ') ? trimmed.substring(7).trim() : '';
        let returnVal = null;
        if (returnExpr) {
          try {
            returnVal = evaluatePythonExpr(returnExpr, currentVars, simulatedInput);
          } catch {
            returnVal = returnExpr;
          }
        }
        steps.push({
          lineNumber: lineNum,
          codeLine: rawLine,
          explanation: `Returning value: ${JSON.stringify(returnVal)}`,
          variables: { ...currentVars },
          variableTypes: { ...currentTypes },
          changedVars: [],
          outputLogs: [...currentLogs]
        });
        idx = endIndex + 1;
        return { returnVal, hasReturned: true };
      }

      if (trimmed.startsWith('def ')) {
        const headerMatch = trimmed.match(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*:/);
        if (headerMatch) {
          const funcName = headerMatch[1];
          const paramsText = headerMatch[2].trim();
          const paramNames = paramsText ? paramsText.split(',').map(p => p.trim()) : [];
          const { bodyLines, endIndex: funcEndIndex } = getBlockLines(blockLines, idx + 1, currentIndent);

          currentVars[funcName] = (...args: any[]) => {
            paramNames.forEach((param, pIdx) => {
              currentVars[param] = args[pIdx];
              currentTypes[param] = getVarType(args[pIdx]);
            });
            const res = executeTraceBlock(bodyLines, lineOffset + idx + 1);
            return res.hasReturned ? res.returnVal : null;
          };
          currentTypes[funcName] = 'function';

          steps.push({
            lineNumber: lineNum,
            codeLine: rawLine,
            explanation: `Defined function '${funcName}' with parameters (${paramNames.join(', ')}).`,
            variables: { ...currentVars },
            variableTypes: { ...currentTypes },
            changedVars: [funcName],
            outputLogs: [...currentLogs]
          });

          idx = funcEndIndex + 1;
          continue;
        }
      }

      if (/^for\b/.test(trimmed)) {
        const match = trimmed.match(/^for\s+([a-zA-Z_0-9,\s]+)\s+in\s+([^:]+)\s*:/);
        if (match) {
          const varNamesText = match[1].trim();
          const iterableExpr = match[2].trim();
          const { bodyLines, endIndex: loopEndIndex } = getBlockLines(blockLines, idx + 1, currentIndent);

          let items: any[] = [];
          try {
            const iterable = evaluatePythonExpr(iterableExpr, currentVars, simulatedInput);
            if (Array.isArray(iterable) || typeof iterable === 'string') {
              items = Array.from(iterable);
            } else if (iterable && typeof iterable === 'object') {
              items = Object.keys(iterable);
            }
          } catch {
            items = [];
          }

          const loopVars = varNamesText.split(',').map(v => v.trim());

          steps.push({
            lineNumber: lineNum,
            codeLine: rawLine,
            explanation: `Entering for loop iterating over ${iterableExpr} (${items.length} items).`,
            variables: { ...currentVars },
            variableTypes: { ...currentTypes },
            changedVars: [],
            outputLogs: [...currentLogs]
          });

          for (const item of items) {
            if (steps.length > 800) break;

            if (loopVars.length === 1) {
              currentVars[loopVars[0]] = item;
              currentTypes[loopVars[0]] = getVarType(item);
            } else if (Array.isArray(item)) {
              loopVars.forEach((v, vIdx) => {
                currentVars[v] = item[vIdx];
                currentTypes[v] = getVarType(item[vIdx]);
              });
            }

            const res = executeTraceBlock(bodyLines, lineOffset + idx + 1);
            if (res.hasReturned) {
              idx = loopEndIndex + 1;
              return res;
            }
            if (res.break) break;
          }

          idx = loopEndIndex + 1;
          continue;
        }
      }

      if (/^while\b/.test(trimmed)) {
        const cond = cleanCondition(trimmed, 'while');
        const { bodyLines, endIndex: loopEndIndex } = getBlockLines(blockLines, idx + 1, currentIndent);

        steps.push({
          lineNumber: lineNum,
          codeLine: rawLine,
          explanation: `Entering while loop with condition (${cond}).`,
          variables: { ...currentVars },
          variableTypes: { ...currentTypes },
          changedVars: [],
          outputLogs: [...currentLogs]
        });

        let iteration = 0;
        while (iteration < 1000 && steps.length < 800) {
          let condVal = false;
          try {
            condVal = Boolean(evaluatePythonExpr(cond, currentVars, simulatedInput));
          } catch {
            break;
          }

          if (!condVal) break;
          iteration++;

          const res = executeTraceBlock(bodyLines, lineOffset + idx + 1);
          if (res.hasReturned) {
            idx = loopEndIndex + 1;
            return res;
          }
          if (res.break) break;
        }

        idx = loopEndIndex + 1;
        continue;
      }

      if (/^if\b/.test(trimmed)) {
        const ifCond = cleanCondition(trimmed, 'if');
        const resCond = Boolean(evaluatePythonExpr(ifCond, currentVars, simulatedInput));
        localLastConditionMet = resCond;

        steps.push({
          lineNumber: lineNum,
          codeLine: rawLine,
          explanation: `Evaluated condition (${ifCond}) -> ${resCond ? 'True' : 'False'}. ${resCond ? 'Taking branch.' : 'Condition false, skipping branch.'}`,
          variables: { ...currentVars },
          variableTypes: { ...currentTypes },
          changedVars: [],
          outputLogs: [...currentLogs]
        });

        const { bodyLines, endIndex: ifEndIndex } = getBlockLines(blockLines, idx + 1, currentIndent);

        if (resCond) {
          const res = executeTraceBlock(bodyLines, lineOffset + idx + 1);
          if (res.hasReturned || res.break || res.continue) {
            idx = ifEndIndex + 1;
            return res;
          }
        }

        idx = ifEndIndex + 1;
        continue;
      }

      if (/^elif\b/.test(trimmed)) {
        const { bodyLines, endIndex: elifEndIndex } = getBlockLines(blockLines, idx + 1, currentIndent);

        if (!localLastConditionMet) {
          const elifCond = cleanCondition(trimmed, 'elif');
          const resCond = Boolean(evaluatePythonExpr(elifCond, currentVars, simulatedInput));
          localLastConditionMet = resCond;

          steps.push({
            lineNumber: lineNum,
            codeLine: rawLine,
            explanation: `Evaluated elif condition (${elifCond}) -> ${resCond ? 'True' : 'False'}.`,
            variables: { ...currentVars },
            variableTypes: { ...currentTypes },
            changedVars: [],
            outputLogs: [...currentLogs]
          });

          if (resCond) {
            const res = executeTraceBlock(bodyLines, lineOffset + idx + 1);
            if (res.hasReturned || res.break || res.continue) {
              idx = elifEndIndex + 1;
              return res;
            }
          }
        } else {
          steps.push({
            lineNumber: lineNum,
            codeLine: rawLine,
            explanation: `Previous condition met. Skipping elif.`,
            variables: { ...currentVars },
            variableTypes: { ...currentTypes },
            changedVars: [],
            outputLogs: [...currentLogs]
          });
        }

        idx = elifEndIndex + 1;
        continue;
      }

      if (/^else\b/.test(trimmed)) {
        const { bodyLines, endIndex: elseEndIndex } = getBlockLines(blockLines, idx + 1, currentIndent);

        if (!localLastConditionMet) {
          localLastConditionMet = true;

          steps.push({
            lineNumber: lineNum,
            codeLine: rawLine,
            explanation: `Previous conditions were false. Entering else branch.`,
            variables: { ...currentVars },
            variableTypes: { ...currentTypes },
            changedVars: [],
            outputLogs: [...currentLogs]
          });

          const res = executeTraceBlock(bodyLines, lineOffset + idx + 1);
          if (res.hasReturned || res.break || res.continue) {
            idx = elseEndIndex + 1;
            return res;
          }
        } else {
          steps.push({
            lineNumber: lineNum,
            codeLine: rawLine,
            explanation: `Previous condition met. Skipping else.`,
            variables: { ...currentVars },
            variableTypes: { ...currentTypes },
            changedVars: [],
            outputLogs: [...currentLogs]
          });
        }

        idx = elseEndIndex + 1;
        continue;
      }

      if (trimmed.startsWith('print(') || trimmed.startsWith('print ')) {
        let inner = trimmed.substring(5).trim();
        if (inner.startsWith('(') && inner.endsWith(')')) {
          inner = inner.substring(1, inner.length - 1).trim();
        }
        const printArgs = parsePrintArguments(inner);
        const formattedArgs = printArgs.map(arg => formatPrintArg(arg, currentVars, simulatedInput));
        let printOutput = formattedArgs.join(' ');
        printOutput = printOutput.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        currentLogs.push(printOutput);

        steps.push({
          lineNumber: lineNum,
          codeLine: rawLine,
          explanation: `Executed print() statement. Output: "${printOutput}".`,
          variables: { ...currentVars },
          variableTypes: { ...currentTypes },
          changedVars: [],
          outputLogs: [...currentLogs]
        });

        idx = endIndex + 1;
        continue;
      }

      const assignment = parseAssignment(trimmed);
      if (assignment) {
        const { varName, expr } = assignment;
        let evaluatedVal: any;

        if (expr.includes('input(')) {
          const hasInput = userInputs[lineNum] !== undefined;
          let rawInputVal = hasInput ? userInputs[lineNum] : (simulatedInput || '7.0');
          evaluatedVal = evaluatePythonExpr(expr, currentVars, rawInputVal);
        } else {
          try {
            evaluatedVal = evaluatePythonExpr(expr, currentVars, simulatedInput);
          } catch {
            evaluatedVal = expr;
          }
        }

        currentVars[varName] = evaluatedVal;
        currentTypes[varName] = getVarType(evaluatedVal);

        steps.push({
          lineNumber: lineNum,
          codeLine: rawLine,
          explanation: `Assigned ${typeof evaluatedVal === 'string' ? `"${evaluatedVal}"` : JSON.stringify(evaluatedVal)} to '${varName}' (<${currentTypes[varName]}>).`,
          variables: { ...currentVars },
          variableTypes: { ...currentTypes },
          changedVars: [varName],
          outputLogs: [...currentLogs],
          requiresInput: expr.includes('input(') && userInputs[lineNum] === undefined
        });

        idx = endIndex + 1;
        continue;
      }

      // Standalone input call
      if ((trimmed.startsWith('input(') || trimmed.startsWith('input ')) && !parseAssignment(trimmed)) {
        idx = endIndex + 1;
        continue;
      }

      steps.push({
        lineNumber: lineNum,
        codeLine: rawLine,
        explanation: `Executing statement: ${trimmed}`,
        variables: { ...currentVars },
        variableTypes: { ...currentTypes },
        changedVars: [],
        outputLogs: [...currentLogs]
      });

      idx = endIndex + 1;
    }

    return {};
  }

  executeTraceBlock(lines, 0);

  if (steps.length === 0) {
    steps.push({
      lineNumber: 1,
      codeLine: '# Empty script',
      explanation: 'No executable code lines found.',
      variables: {},
      variableTypes: {},
      changedVars: [],
      outputLogs: []
    });
  }

  return steps;
}

const PRESET_EXAMPLES = [
  {
    title: '1. Cypress Tree Pattern',
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
    title: '2. Area of Circle & Input',
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
    title: '3. Leap Year & If-Else',
    code: `# Example 5: Check Leap Year in Bhutan
year = 2028

if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print(f"Year {year} is a LEAP YEAR! 🐉")
else:
    print(f"Year {year} is not a leap year.")`
  },
  {
    title: '4. Bhutanese Dishes & List Loops',
    code: `# Example 2 & 3: Bhutanese Menu Traversal
dishes = ["Ema Datshi", "Jasha Maroo", "Phaksha Paa", "Kewa Datshi"]

print("----- Karma Academy Canteen Menu -----")
for index, dish in enumerate(dishes, start=1):
    print(f"Dish {index}: {dish}")

print("\\nDishes count:", len(dishes))`
  },
  {
    title: '5. Dictionary Biodata',
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
    title: '6. Recursive Factorial Function',
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

interface PythonIDEProps {
  initialCode?: string;
  onSendToTutor?: (code: string) => void;
}

export const PythonIDE: React.FC<PythonIDEProps> = ({ initialCode, onSendToTutor }) => {
  const [presets, setPresets] = useState(() => getStudentPythonPresets());

  useEffect(() => {
    const unsubscribe = subscribeToContentChanges(() => {
      setPresets(getStudentPythonPresets());
    });
    return unsubscribe;
  }, []);

  const [code, setCode] = useState<string>(() => initialCode || getStudentPythonPresets()[0]?.code || '');

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);
  const [simulatedInput, setSimulatedInput] = useState<string>('7.0');
  const [output, setOutput] = useState<string>('Click "Run Code" to execute Python script...');
  const [outputLogs, setOutputLogs] = useState<string[]>(['>>> Python 3.12.4 Shell (Class 10 ICT)', '>>> Click "Run Code (F5)" to execute...']);
  const [waitingForInput, setWaitingForInput] = useState<boolean>(false);
  const [inputPromptText, setInputPromptText] = useState<string>('');
  const [consoleInputVal, setConsoleInputVal] = useState<string>('');
  const inputResolveRef = useRef<((val: string) => void) | null>(null);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showReferenceDrawer, setShowReferenceDrawer] = useState<boolean>(false);
  const [showSuggestionsOverlay, setShowSuggestionsOverlay] = useState<boolean>(true);

  // Computed Real-time Code Suggestions based on 38 authorized concepts
  const codeSuggestions = analyzeCodeSuggestions(code);

  // Debugger State
  const [isDebugging, setIsDebugging] = useState<boolean>(false);
  const [debugSteps, setDebugSteps] = useState<DebugStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});

  const consoleEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [outputLogs, output, waitingForInput, currentStepIdx, debugSteps]);

  const renderLogLine = (line: string, idx: number) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('>>>')) {
      return (
        <div key={idx} className="text-yellow-400/95 font-semibold flex items-center gap-2 text-xs py-1 tracking-wide">
          <span className="text-yellow-500 font-black">{">>>"}</span>
          <span>{trimmed.replace(/^>>>\s*/, '')}</span>
        </div>
      );
    }
    if (trimmed.startsWith('> ')) {
      return (
        <div key={idx} className="text-cyan-200 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-800/60 flex items-center gap-2 text-xs my-1 font-mono shadow-2xs">
          <span className="text-amber-400 font-black">❯</span>
          <span className="font-bold">{trimmed.replace(/^>\s*/, '')}</span>
        </div>
      );
    }
    if (trimmed.includes('Traceback') || trimmed.includes('Error:') || trimmed.includes('ValueError') || trimmed.includes('NameError')) {
      return (
        <div key={idx} className="text-rose-200 bg-rose-950/70 px-3 py-2 rounded-lg border border-rose-800 text-xs my-1.5 font-mono leading-relaxed shadow-xs">
          <span className="text-rose-400 font-bold">⚠ </span>
          <span>{trimmed}</span>
        </div>
      );
    }
    return (
      <div key={idx} className="text-emerald-300 font-mono text-xs py-0.5 flex items-start gap-2">
        <span className="text-emerald-600/70 select-none">│</span>
        <span className="whitespace-pre-wrap">{line}</span>
      </div>
    );
  };

  const handleStepChange = async (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= debugSteps.length) return;
    const step = debugSteps[targetIdx];

    if (step && step.requiresInput) {
      setCurrentStepIdx(targetIdx);
      let expr = step.codeLine.split('=')[1]?.trim() || step.codeLine;
      let promptMatch = expr.match(/input\s*\(\s*(['"])(.*?)\1\s*\)/);
      let promptMsg = promptMatch ? promptMatch[2] : 'Enter value: ';

      const updatedLogs = [...step.outputLogs, promptMsg];
      setOutputLogs(updatedLogs);
      setOutput(updatedLogs.join('\n'));

      setWaitingForInput(true);
      setInputPromptText(promptMsg);
      setConsoleInputVal('');

      const userInput = await new Promise<string>((resolve) => {
        inputResolveRef.current = resolve;
      });

      const nextUserInputs = { ...userInputs, [step.lineNumber]: userInput };
      setUserInputs(nextUserInputs);

      // Re-generate trace with the new user input!
      const newTrace = generatePythonTrace(code, simulatedInput, nextUserInputs);
      setDebugSteps(newTrace);

      const updatedStep = newTrace[targetIdx] || step;
      setCurrentStepIdx(targetIdx);
      setOutputLogs(updatedStep.outputLogs);
      setOutput(updatedStep.outputLogs.join('\n'));
      setWaitingForInput(false);
      return;
    }

    setCurrentStepIdx(targetIdx);
    if (debugSteps[targetIdx]) {
      setOutputLogs(debugSteps[targetIdx].outputLogs);
      setOutput(debugSteps[targetIdx].outputLogs.join('\n'));
    }
  };

  // Auto-play timer for debugger
  useEffect(() => {
    let timer: any;
    if (isDebugging && isAutoPlaying && !waitingForInput) {
      timer = setInterval(() => {
        if (currentStepIdx >= debugSteps.length - 1) {
          setIsAutoPlaying(false);
        } else {
          handleStepChange(currentStepIdx + 1);
        }
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isDebugging, isAutoPlaying, debugSteps.length, currentStepIdx, waitingForInput]);

  const handleStartDebug = () => {
    if (inputResolveRef.current) {
      inputResolveRef.current('');
      inputResolveRef.current = null;
    }
    setWaitingForInput(false);
    setConsoleInputVal('');
    setUserInputs({});
    const trace = generatePythonTrace(code, simulatedInput, {});
    setDebugSteps(trace);
    setIsDebugging(true);
    setIsAutoPlaying(false);
    if (trace.length > 0) {
      handleStepChange(0);
    } else {
      setCurrentStepIdx(0);
    }
  };

  const currentStep = isDebugging && debugSteps.length > 0 ? debugSteps[currentStepIdx] : null;

  const handleRun = async () => {
    setIsRunning(true);
    if (inputResolveRef.current) {
      inputResolveRef.current('');
      inputResolveRef.current = null;
    }
    setWaitingForInput(false);
    setConsoleInputVal('');
    setIsDebugging(false);

    const logs = ['>>> Python 3.12.4 Shell (Class 10 ICT)', '>>> Running main.py...'];
    setOutputLogs(logs);
    setOutput(logs.join('\n'));

    let vars: Record<string, any> = {};
    const lines = code.split('\n');

    async function executeRunBlock(
      bodyLines: string[]
    ): Promise<{ break?: boolean; continue?: boolean; returnVal?: any; hasReturned?: boolean }> {
      let j = 0;
      let localLastConditionMet = false;

      while (j < bodyLines.length) {
        const { statement: stmt, endIndex: stmtEndIdx } = getCompleteStatement(bodyLines, j);
        const rawStmtLine = bodyLines[j];
        const stmtTrimmed = stmt.trim();
        const stmtIndent = getIndent(rawStmtLine);

        if (!stmtTrimmed || stmtTrimmed.startsWith('#')) {
          j = stmtEndIdx + 1;
          continue;
        }

        if (stmtIndent === getIndent(bodyLines[0]) && !stmtTrimmed.startsWith('elif') && !stmtTrimmed.startsWith('else')) {
          localLastConditionMet = false;
        }

        if (stmtTrimmed === 'break') {
          return { break: true };
        }

        if (stmtTrimmed === 'continue') {
          return { continue: true };
        }

        if (stmtTrimmed.startsWith('return ') || stmtTrimmed === 'return') {
          const returnExpr = stmtTrimmed.startsWith('return ') ? stmtTrimmed.substring(7).trim() : '';
          const returnVal = returnExpr ? evaluatePythonExpr(returnExpr, vars, simulatedInput) : null;
          return { returnVal, hasReturned: true };
        }

        // def function statement
        if (stmtTrimmed.startsWith('def ')) {
          const headerMatch = stmtTrimmed.match(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*:/);
          if (headerMatch) {
            const funcName = headerMatch[1];
            const paramsText = headerMatch[2].trim();
            const paramNames = paramsText ? paramsText.split(',').map(p => p.trim()) : [];
            const { bodyLines: fnBody, endIndex: fnEndIdx } = getBlockLines(bodyLines, j + 1, stmtIndent);

            vars[funcName] = (...args: any[]) => {
              const prevVars = { ...vars };
              paramNames.forEach((p, idx) => { vars[p] = args[idx]; });
              let retVal: any = null;
              let fj = 0;
              let fCondMet = false;
              while (fj < fnBody.length) {
                const { statement: fStmt, endIndex: fEnd } = getCompleteStatement(fnBody, fj);
                const fRaw = fnBody[fj];
                const fTrim = fStmt.trim();
                const fIndent = getIndent(fRaw);

                if (!fTrim || fTrim.startsWith('#')) { fj = fEnd + 1; continue; }
                if (fIndent === getIndent(fnBody[0]) && !fTrim.startsWith('elif') && !fTrim.startsWith('else')) fCondMet = false;

                if (fTrim.startsWith('return ') || fTrim === 'return') {
                  const rExpr = fTrim.startsWith('return ') ? fTrim.substring(7).trim() : '';
                  retVal = rExpr ? evaluatePythonExpr(rExpr, vars, simulatedInput) : null;
                  break;
                }
                if (fTrim.startsWith('print(') || fTrim.startsWith('print ')) {
                  let inner = fTrim.substring(5).trim();
                  if (inner.startsWith('(') && inner.endsWith(')')) inner = inner.substring(1, inner.length - 1).trim();
                  const pArgs = parsePrintArguments(inner);
                  const fArgs = pArgs.map(arg => formatPrintArg(arg, vars, simulatedInput));
                  logs.push(fArgs.join(' ').replace(/\\n/g, '\n').replace(/\\t/g, '\t'));
                  fj = fEnd + 1;
                  continue;
                }
                const assign = parseAssignment(fTrim);
                if (assign) {
                  try { vars[assign.varName] = evaluatePythonExpr(assign.expr, vars, simulatedInput); }
                  catch { vars[assign.varName] = assign.expr; }
                  fj = fEnd + 1;
                  continue;
                }
                try { evaluatePythonExpr(fTrim, vars, simulatedInput); } catch {}
                fj = fEnd + 1;
              }
              Object.assign(vars, prevVars);
              return retVal;
            };

            j = fnEndIdx + 1;
            continue;
          }
        }

        // for loop
        if (/^for\b/.test(stmtTrimmed)) {
          const match = stmtTrimmed.match(/^for\s+([a-zA-Z_0-9,\s]+)\s+in\s+([^:]+)\s*:/);
          if (match) {
            const varNamesText = match[1].trim();
            const iterableExpr = match[2].trim();
            const { bodyLines: loopBody, endIndex: loopEndIdx } = getBlockLines(bodyLines, j + 1, stmtIndent);

            try {
              const iterable = evaluatePythonExpr(iterableExpr, vars, simulatedInput);
              const loopVars = varNamesText.split(',').map(v => v.trim());
              let items: any[] = [];
              if (iterable && (Array.isArray(iterable) || typeof iterable === 'string' || iterable instanceof Set || iterable instanceof Map)) {
                items = Array.from(iterable);
              } else if (iterable && typeof iterable === 'object') {
                items = Object.keys(iterable);
              }

              for (const item of items) {
                if (loopVars.length > 1 && Array.isArray(item)) {
                  loopVars.forEach((v, idx) => { vars[v] = item[idx]; });
                } else {
                  vars[loopVars[0]] = item;
                }
                const res = await executeRunBlock(loopBody);
                if (res.hasReturned) return res;
                if (res.break) break;
              }
            } catch (err: any) {
              logs.push(`TypeError: ${err.message}`);
            }

            j = loopEndIdx + 1;
            continue;
          }
        }

        // while loop
        if (/^while\b/.test(stmtTrimmed)) {
          const cond = cleanCondition(stmtTrimmed, 'while');
          const { bodyLines: loopBody, endIndex: loopEndIdx } = getBlockLines(bodyLines, j + 1, stmtIndent);

          let iteration = 0;
          try {
            while (iteration < 1000) {
              let condVal = false;
              try {
                condVal = Boolean(evaluatePythonExpr(cond, vars, simulatedInput));
              } catch {
                break;
              }
              if (!condVal) break;
              iteration++;

              const res = await executeRunBlock(loopBody);
              if (res.hasReturned) return res;
              if (res.break) break;
            }
          } catch (err: any) {
            logs.push(`Error in while loop: ${err.message}`);
          }

          j = loopEndIdx + 1;
          continue;
        }

        // if statement
        if (/^if\b/.test(stmtTrimmed)) {
          const ifCond = cleanCondition(stmtTrimmed, 'if');
          const resCond = Boolean(evaluatePythonExpr(ifCond, vars, simulatedInput));
          localLastConditionMet = resCond;
          const { bodyLines: ifBody, endIndex: ifEndIdx } = getBlockLines(bodyLines, j + 1, stmtIndent);

          if (resCond) {
            const res = await executeRunBlock(ifBody);
            if (res.hasReturned || res.break || res.continue) return res;
          }

          j = ifEndIdx + 1;
          continue;
        }

        // elif statement
        if (/^elif\b/.test(stmtTrimmed)) {
          const { bodyLines: elifBody, endIndex: elifEndIdx } = getBlockLines(bodyLines, j + 1, stmtIndent);
          if (!localLastConditionMet) {
            const elifCond = cleanCondition(stmtTrimmed, 'elif');
            const resCond = Boolean(evaluatePythonExpr(elifCond, vars, simulatedInput));
            localLastConditionMet = resCond;
            if (resCond) {
              const res = await executeRunBlock(elifBody);
              if (res.hasReturned || res.break || res.continue) return res;
            }
          }
          j = elifEndIdx + 1;
          continue;
        }

        // else statement
        if (/^else\b/.test(stmtTrimmed)) {
          const { bodyLines: elseBody, endIndex: elseEndIdx } = getBlockLines(bodyLines, j + 1, stmtIndent);
          if (!localLastConditionMet) {
            localLastConditionMet = true;
            const res = await executeRunBlock(elseBody);
            if (res.hasReturned || res.break || res.continue) return res;
          }
          j = elseEndIdx + 1;
          continue;
        }

        // standalone input(...) statement
        if ((stmtTrimmed.startsWith('input(') || stmtTrimmed.startsWith('input ')) && !parseAssignment(stmtTrimmed)) {
          let promptMatch = stmtTrimmed.match(/input\s*\(\s*(['"])(.*?)\1\s*\)/);
          let promptMsg = promptMatch ? promptMatch[2] : 'Enter value: ';

          logs.push(promptMsg);
          setOutputLogs([...logs]);
          setOutput(logs.join('\n'));

          setWaitingForInput(true);
          setInputPromptText(promptMsg);
          setConsoleInputVal('');

          const userInput = await new Promise<string>((resolve) => {
            inputResolveRef.current = resolve;
          });

          logs.push(`> ${userInput}`);
          setOutputLogs([...logs]);
          setOutput(logs.join('\n'));
          setWaitingForInput(false);
          j = stmtEndIdx + 1;
          continue;
        }

        // print statement
        if (stmtTrimmed.startsWith('print(') || stmtTrimmed.startsWith('print ')) {
          let inner = stmtTrimmed.substring(5).trim();
          if (inner.startsWith('(') && inner.endsWith(')')) {
            inner = inner.substring(1, inner.length - 1).trim();
          }

          let userInputForPrint = simulatedInput;
          if (inner.includes('input(')) {
            let promptMatch = inner.match(/input\s*\(\s*(['"])(.*?)\1\s*\)/);
            let promptMsg = promptMatch ? promptMatch[2] : 'Enter value: ';

            logs.push(promptMsg);
            setOutputLogs([...logs]);
            setOutput(logs.join('\n'));

            setWaitingForInput(true);
            setInputPromptText(promptMsg);
            setConsoleInputVal('');

            userInputForPrint = await new Promise<string>((resolve) => {
              inputResolveRef.current = resolve;
            });

            logs.push(`> ${userInputForPrint}`);
            setOutputLogs([...logs]);
            setOutput(logs.join('\n'));
            setWaitingForInput(false);
          }

          const args = parsePrintArguments(inner);
          const formattedArgs = args.map(arg => formatPrintArg(arg, vars, userInputForPrint));
          let printOutput = formattedArgs.join(' ');
          printOutput = printOutput.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
          logs.push(printOutput);
          setOutputLogs([...logs]);
          setOutput(logs.join('\n'));
          j = stmtEndIdx + 1;
          await new Promise(r => setTimeout(r, 10));
          continue;
        }

        // assignment statement
        const assignment = parseAssignment(stmtTrimmed);
        if (assignment) {
          const { varName, expr } = assignment;

          if (expr.includes('input(')) {
            let promptMatch = expr.match(/input\s*\(\s*(['"])(.*?)\1\s*\)/);
            let promptMsg = promptMatch ? promptMatch[2] : 'Enter value: ';

            logs.push(promptMsg);
            setOutputLogs([...logs]);
            setOutput(logs.join('\n'));

            setWaitingForInput(true);
            setInputPromptText(promptMsg);
            setConsoleInputVal('');

            const userInput = await new Promise<string>((resolve) => {
              inputResolveRef.current = resolve;
            });

            logs.push(`> ${userInput}`);
            setOutputLogs([...logs]);
            setOutput(logs.join('\n'));
            setWaitingForInput(false);

            const evaluatedVal = evaluatePythonExpr(expr, vars, userInput);
            vars[varName] = evaluatedVal;
            j = stmtEndIdx + 1;
            continue;
          } else {
            let evaluatedVal: any;
            try {
              evaluatedVal = evaluatePythonExpr(expr, vars, simulatedInput);
            } catch {
              evaluatedVal = expr;
            }
            vars[varName] = evaluatedVal;
            j = stmtEndIdx + 1;
            continue;
          }
        }

        // General expression statement
        try {
          evaluatePythonExpr(stmtTrimmed, vars, simulatedInput);
        } catch {
          // ignore
        }

        j = stmtEndIdx + 1;
      }

      return {};
    }

    try {
      await executeRunBlock(lines);
    } catch (err: any) {
      let errMessage = err.message || String(err);
      if (errMessage.includes('is not defined')) {
        const match = errMessage.match(/['"]?([a-zA-Z_][a-zA-Z0-9_]*)['"]?\s+is not defined/);
        const varName = match ? match[1] : 'variable';
        errMessage = `NameError: name '${varName}' is not defined`;
      }
      logs.push('Traceback (most recent call last):');
      logs.push(errMessage);
    }

    setOutputLogs([...logs]);
    setOutput(logs.join('\n'));
    setIsRunning(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = code.split('\n');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header toolbar */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-950 px-5 py-3 text-white flex flex-wrap items-center justify-between gap-3 border-b border-amber-700/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-yellow-500/20 rounded-xl text-yellow-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-yellow-300 font-serif">Class 10 Python Script Playground (.py)</h2>
              <p className="text-xs text-amber-200/80">Interactive Code Editor & IDLE Execution Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowSuggestionsOverlay(!showSuggestionsOverlay)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm border ${
                showSuggestionsOverlay
                  ? 'bg-yellow-500 text-amber-950 border-yellow-300 font-black'
                  : 'bg-slate-800 text-amber-200 border-slate-700'
              }`}
              title="Toggle Real-Time Code Suggestions & Linter Overlay"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Suggestions ({codeSuggestions.length})</span>
            </button>

            <button
              onClick={handleStartDebug}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm border ${
                isDebugging
                  ? 'bg-[#FFCC33] text-[#1A1A1A] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/50 text-emerald-300'
              }`}
              title="Step through code execution line-by-line and inspect variable values"
            >
              <Bug className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isDebugging ? 'Debugging Active' : 'Step-by-Step Debugger'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-800/60 hover:bg-amber-700/80 rounded-lg text-xs font-semibold text-amber-100 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-amber-950 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-amber-950" />
              <span>{isRunning ? 'Executing...' : 'Run Code (F5)'}</span>
            </button>
          </div>
        </div>

        {/* STEP-BY-STEP DEBUGGER CONTROL BAR */}
        {isDebugging && (
          <div className="bg-[#1A1A1A] border-b-4 border-[#FFCC33] p-3 text-amber-100 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#6D071A] text-amber-200 border border-[#FFCC33] font-black text-xs rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                <Bug className="w-3.5 h-3.5 text-[#FFCC33]" /> Debugger Active
              </span>
              <span className="text-xs font-mono font-bold text-amber-200 bg-slate-800 px-2 py-1 rounded">
                Step {currentStepIdx + 1} of {debugSteps.length} (Line {currentStep?.lineNumber || 1})
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleStepChange(0)}
                disabled={currentStepIdx === 0}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer"
                title="Jump to First Line"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleStepChange(Math.max(0, currentStepIdx - 1))}
                disabled={currentStepIdx === 0}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev Line
              </button>

              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="px-3 py-1.5 bg-[#FFCC33] text-[#1A1A1A] hover:bg-[#ffe066] rounded-lg text-xs font-black cursor-pointer flex items-center gap-1 shadow-sm"
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-[#1A1A1A]" />}
                <span>{isAutoPlaying ? 'Pause' : 'Auto Step'}</span>
              </button>

              <button
                onClick={() => handleStepChange(Math.min(debugSteps.length - 1, currentStepIdx + 1))}
                disabled={currentStepIdx >= debugSteps.length - 1}
                className="px-3 py-1.5 bg-[#FFCC33] text-[#1A1A1A] hover:bg-[#ffe066] rounded-lg text-xs font-black disabled:opacity-40 cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span>Next Line</span> <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleStepChange(debugSteps.length - 1)}
                disabled={currentStepIdx >= debugSteps.length - 1}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer"
                title="Jump to Last Line"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsDebugging(false);
                  setIsAutoPlaying(false);
                }}
                className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer ml-2"
              >
                Exit Debugger
              </button>
            </div>
          </div>
        )}

        {/* Example Selector dropdown */}
        <div className="bg-amber-50 dark:bg-slate-800/80 border-b border-amber-200 dark:border-slate-700 px-4 py-2.5 flex items-center gap-3">
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200 whitespace-nowrap flex items-center gap-1.5 shrink-0">
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Curriculum Presets:
          </span>
          <select
            onChange={(e) => {
              const idx = Number(e.target.value);
              if (!isNaN(idx) && presets[idx]) {
                setCode(presets[idx].code);
                setIsDebugging(false);
              }
            }}
            defaultValue="0"
            className="w-full sm:w-auto min-w-[280px] bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-600/60 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-amber-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {presets.map((ex, idx) => (
              <option key={idx} value={idx}>
                {ex.title}
              </option>
            ))}
          </select>
        </div>

        {/* IDE Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-amber-200 dark:divide-slate-800">
          {/* Code Editor / Line Debugger */}
          <div className="lg:col-span-7 p-4 bg-slate-950 text-emerald-400 font-mono text-xs sm:text-sm flex flex-col min-h-[420px]">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2 pb-2 border-b border-slate-800 font-sans">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <FileCode className="w-3.5 h-3.5 text-yellow-500" /> main.py
              </span>
              <div className="flex items-center gap-2">
                {isDebugging ? (
                  <span className="bg-[#FFCC33] text-[#1A1A1A] font-black text-[10px] px-2 py-0.5 rounded uppercase">
                    Line Stepper Highlighting Active
                  </span>
                ) : (
                  <span>Python 3.12 (Class 10 ICT)</span>
                )}
              </div>
            </div>

            {isDebugging ? (
              /* Step-by-Step Highlighted Code View */
              <div className="font-mono text-xs sm:text-sm space-y-1 overflow-y-auto max-h-[380px] pr-2 pt-1">
                {codeLines.map((lineText, lIdx) => {
                  const lineNum = lIdx + 1;
                  const isCurrentLine = currentStep && currentStep.lineNumber === lineNum;

                  return (
                    <div
                      key={lIdx}
                      onClick={() => {
                        const matchIdx = debugSteps.findIndex(s => s.lineNumber === lineNum);
                        if (matchIdx !== -1) setCurrentStepIdx(matchIdx);
                      }}
                      className={`flex items-start px-2 py-1 rounded transition-all cursor-pointer ${
                        isCurrentLine
                          ? 'bg-[#FFCC33]/25 text-[#FFCC33] border-l-4 border-[#FFCC33] font-bold shadow-xs'
                          : 'hover:bg-slate-900 text-slate-200'
                      }`}
                    >
                      <span className="w-8 shrink-0 text-slate-500 text-right pr-3 select-none text-xs font-mono">
                        {lineNum}
                      </span>
                      <span
                        className="flex-1 whitespace-pre-wrap font-mono"
                        dangerouslySetInnerHTML={{ __html: highlightPython(lineText || ' ') }}
                      />
                      {isCurrentLine && (
                        <span className="text-[10px] bg-[#FFCC33] text-[#1A1A1A] font-black px-1.5 py-0.5 rounded ml-2 shrink-0 animate-pulse">
                          ▶ Stepping
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Standard Prism Syntax Highlighted Code Editor */
              <div className="flex flex-1 min-h-[300px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs sm:text-sm relative shadow-inner">
                {/* Line Number Gutter */}
                <div className="py-3 px-2 text-right select-none bg-slate-900/80 border-r border-slate-800 text-slate-500 font-mono text-xs flex flex-col min-w-[2.75rem] shrink-0">
                  {code.split('\n').map((_, i) => (
                    <div key={i} className="leading-[1.6]">
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* React Simple Code Editor with Prism Python Grammar */}
                <div className="flex-1 overflow-auto bg-slate-950">
                  <Editor
                    value={code}
                    onValueChange={(newCode) => setCode(newCode)}
                    highlight={highlightPython}
                    padding={12}
                    className="prism-code-editor text-slate-100 min-h-[280px]"
                    style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                    placeholder="# Write Python code here..."
                  />
                </div>
              </div>
            )}

            {/* REAL-TIME CODE SUGGESTIONS & LINTER OVERLAY */}
            {showSuggestionsOverlay && (
              <div className="mt-3 bg-slate-900/95 border-2 border-amber-500/50 rounded-xl p-3 font-sans shadow-xl animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-yellow-400 animate-spin" /> Code Suggestion & Concept Linter ({codeSuggestions.length})
                  </span>
                  <button
                    onClick={() => setShowSuggestionsOverlay(false)}
                    className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 cursor-pointer"
                  >
                    Hide
                  </button>
                </div>

                <div className="mt-2 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {codeSuggestions.map((s) => (
                    <div
                      key={s.id}
                      className={`p-2 rounded-lg text-xs flex items-start justify-between gap-2 border ${
                        s.type === 'warning'
                          ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                          : s.type === 'syntax'
                          ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                          : 'bg-slate-950 border-slate-800 text-emerald-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {s.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        ) : s.type === 'syntax' ? (
                          <Wand2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-bold text-[10px] uppercase text-amber-300 tracking-wider">
                            {s.topicName}
                          </div>
                          <div className="text-xs font-mono mt-0.5">{s.message}</div>
                        </div>
                      </div>
                      {s.snippet && s.lineNumber && (
                        <button
                          onClick={() => {
                            const lines = code.split('\n');
                            if (s.lineNumber && s.lineNumber <= lines.length) {
                              lines[s.lineNumber - 1] = s.snippet!;
                              setCode(lines.join('\n'));
                            }
                          }}
                          className="px-2 py-1 bg-[#FFCC33] text-[#1A1A1A] hover:bg-amber-300 font-black text-[10px] rounded shrink-0 cursor-pointer shadow-2xs"
                        >
                          Fix Code
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Console / Variable Inspector Panel */}
          <div className="lg:col-span-5 bg-slate-900 text-slate-100 p-4 font-mono text-xs flex flex-col justify-between min-h-[420px]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2 pb-2 border-b border-slate-800 font-sans">
                <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                  <Terminal className="w-3.5 h-3.5" /> IDLE Console Output (&gt;&gt;&gt;)
                </span>
                <button
                  onClick={() => {
                    setOutput('>>> Python Shell cleared.');
                    setOutputLogs(['>>> Python Shell cleared.']);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Clear Shell"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Output Logs */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono leading-relaxed overflow-y-auto max-h-[380px] min-h-[220px] shadow-inner space-y-1">
                {isDebugging && currentStep
                  ? (outputLogs.length > 0 
                      ? outputLogs.map((l, i) => renderLogLine(l, i))
                      : <div className="text-amber-300 text-xs font-mono">{">>>"} [Execution paused at line {currentStep.lineNumber}]</div>)
                  : outputLogs.map((l, i) => renderLogLine(l, i))}
                <div ref={consoleEndRef} />
              </div>

              {/* INTERACTIVE INPUT PROMPT WHEN INPUT() IS REACHED */}
              {waitingForInput && (
                <div className="mt-3 p-3 bg-slate-950 border-2 border-amber-400 rounded-xl space-y-2 animate-[bounce_0.5s_ease-out_1]">
                  <div className="text-amber-300 font-bold text-xs flex items-center gap-1.5 font-sans">
                    <Terminal className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span>Input Required: {inputPromptText}</span>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (inputResolveRef.current) {
                        const val = consoleInputVal;
                        inputResolveRef.current(val);
                        inputResolveRef.current = null;
                        setConsoleInputVal('');
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-emerald-400 font-mono font-bold">&gt;&gt;</span>
                    <input
                      type="text"
                      value={consoleInputVal}
                      onChange={(e) => setConsoleInputVal(e.target.value)}
                      placeholder="Type your input here and press Enter..."
                      autoFocus
                      className="flex-1 bg-slate-900 border border-amber-400 text-emerald-300 px-3 py-1.5 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono shadow-inner"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#FFCC33] text-[#1A1A1A] font-black text-xs rounded hover:bg-yellow-400 cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      Enter ↵
                    </button>
                  </form>
                </div>
              )}

              {/* LIVE VARIABLE WATCH BOX WHEN DEBUGGING */}
              {isDebugging && (
                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-amber-500/30 font-sans space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Variable State Inspector
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Line {currentStep?.lineNumber || 1}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead>
                        <tr className="text-slate-400 text-[9px] uppercase border-b border-slate-800">
                          <th className="pb-1">Variable</th>
                          <th className="pb-1">Type</th>
                          <th className="pb-1">Value</th>
                          <th className="pb-1 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentStep && Object.keys(currentStep.variables).length > 0 ? (
                          Object.entries(currentStep.variables).map(([vName, vVal]) => {
                            const isModified = currentStep.changedVars.includes(vName);
                            const vType = currentStep.variableTypes[vName] || typeof vVal;

                            return (
                              <tr
                                key={vName}
                                className={`border-b border-slate-900 ${
                                  isModified ? 'bg-amber-500/20 text-amber-200 font-bold' : 'text-slate-300'
                                }`}
                              >
                                <td className="py-1 text-amber-300 font-bold">{vName}</td>
                                <td className="py-1 text-emerald-400 font-mono text-[10px]">&lt;{vType}&gt;</td>
                                <td className="py-1 text-slate-100 font-mono">
                                  {typeof vVal === 'object' ? JSON.stringify(vVal) : String(vVal)}
                                </td>
                                <td className="py-1 text-right">
                                  {isModified ? (
                                    <span className="bg-[#FFCC33] text-[#1A1A1A] text-[8px] font-black px-1 rounded uppercase">
                                      Updated
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 text-[9px]">Scope</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-2 text-center text-slate-500 italic text-[10px]">
                              No variables initialized in scope yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Line Explanation */}
                  {currentStep && (
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-200/90 leading-relaxed font-sans">
                      <span className="text-amber-400 font-bold">Line Logic: </span>
                      <span>{currentStep.explanation}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-sans flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Use <b>Step-by-Step Debugger</b> to pause and trace line execution!</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
