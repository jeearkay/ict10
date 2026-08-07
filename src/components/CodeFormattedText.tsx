import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { highlightPython } from './PythonIDE';

export interface CodeFormattedTextProps {
  text: string;
  className?: string;
  defaultFontClass?: string;
}

const CodeBlock = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="my-2 bg-[#100C0D] border-2 border-amber-400/30 rounded-xl p-3.5 shadow-inner text-left overflow-x-auto relative group">
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-amber-950/50 hover:bg-amber-900 rounded-lg text-amber-200 transition-colors opacity-0 group-hover:opacity-100"
        title="Copy to clipboard"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className="font-mono text-xs sm:text-sm text-amber-200 whitespace-pre leading-relaxed m-0 p-0">
        <code dangerouslySetInnerHTML={{ __html: highlightPython(content) }} />
      </pre>
    </div>
  );
};

function preprocessText(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // 1. Unescape literal '\n', '\t', '\r' if present as text characters
  if (text.includes('\\n') || text.includes('\\t') || text.includes('\\r')) {
    text = text
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '');
  }

  // 2. If text already contains code block backticks ```, return as is
  if (text.includes('```')) {
    return text.trim();
  }

  // 3. Otherwise, check if lines look like code and separate question text from code lines
  const lines = text.split('\n');
  if (lines.length <= 1) {
    return text.trim();
  }

  const isCodeLine = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed) return false;

    // Direct code patterns
    const codeKeywords = /^(def\b|for\b|while\b|if\b|elif\b|else:|return\b|import\b|from\b|class\b|try:|except|raise\b|pass\b|break\b|continue\b)/;
    const codeFunctions = /\b(print|len|range|type|int|float|str|list|dict|set|tuple|append|extend|pop|push|input)\s*\(/;
    const isIndented = /^(  |\t)/.test(line);
    const isVariableAssign = /^[a-zA-Z_]\w*\s*=\s*.+/.test(trimmed);

    if (codeKeywords.test(trimmed)) return true;
    if (codeFunctions.test(trimmed)) return true;
    if (isIndented) return true;
    if (isVariableAssign) return true;

    return false;
  };

  const resultBlocks: string[] = [];
  let currentCodeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isCodeLine(line)) {
      currentCodeLines.push(line);
    } else {
      if (currentCodeLines.length > 0) {
        resultBlocks.push('```python\n' + currentCodeLines.join('\n') + '\n```');
        currentCodeLines = [];
      }
      resultBlocks.push(line);
    }
  }

  if (currentCodeLines.length > 0) {
    resultBlocks.push('```python\n' + currentCodeLines.join('\n') + '\n```');
  }

  return resultBlocks.join('\n').trim();
}

export const CodeFormattedText: React.FC<CodeFormattedTextProps> = ({ 
  text, 
  className = '',
  defaultFontClass = ''
}) => {
  if (!text) return null;

  const processedText = preprocessText(text);

  const parts: React.ReactNode[] = [];
  // Regex to match:
  // 1. Triple backticks: ```code```
  // 2. Single backticks: `code`
  // 3. Parenthesized math: ($formula$)
  // 4. Standard math: $formula$
  const regex = /```(?:[a-zA-Z]+)?\n?([\s\S]*?)```|`([^`]+)`|\(\$([^)]+?)\$\)|\$([^$]+?)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(processedText)) !== null) {
    const matchIndex = match.index;
    
    // Push normal text before the match
    if (matchIndex > lastIndex) {
      const normalChunk = processedText.substring(lastIndex, matchIndex);
      if (normalChunk) {
        parts.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {normalChunk}
          </span>
        );
      }
    }

    if (match[1] !== undefined) {
      // Triple backticks block code
      const codeContent = match[1].trim();
      parts.push(
        <CodeBlock key={`block-${matchIndex}`} content={codeContent} />
      );
    } else if (match[2] !== undefined) {
      // Single backticks inline code
      const codeContent = match[2];
      parts.push(
        <code key={`inline-${matchIndex}`} className="px-1.5 py-0.5 mx-0.5 bg-amber-50 dark:bg-slate-800 border border-amber-300 dark:border-slate-700 rounded-md text-[#6D071A] dark:text-amber-300 font-mono text-xs font-black select-all inline-block whitespace-pre-wrap">
          {codeContent}
        </code>
      );
    } else if (match[3] !== undefined || match[4] !== undefined) {
      // Math formula
      const formulaContent = match[3] !== undefined ? match[3] : match[4];
      parts.push(
        <span key={`formula-${matchIndex}`} className="px-2 py-0.5 mx-1 bg-amber-50 border border-amber-300 text-[#6D071A] font-serif italic font-extrabold text-sm sm:text-base rounded-lg shadow-sm inline-block select-all whitespace-pre-wrap">
          {formulaContent}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Push remaining normal text
  if (lastIndex < processedText.length) {
    const remainingChunk = processedText.substring(lastIndex);
    if (remainingChunk) {
      parts.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {remainingChunk}
        </span>
      );
    }
  }

  return (
    <div className={`whitespace-pre-wrap leading-relaxed ${defaultFontClass} ${className}`}>
      {parts}
    </div>
  );
};

