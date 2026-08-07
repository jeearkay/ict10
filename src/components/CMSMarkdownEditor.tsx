import React, { useState, useRef } from 'react';
import { Bold, Italic, Code, List, ListOrdered, Eye, Edit3, Heading1, Heading2, HelpCircle, Save } from 'lucide-react';
import { CodeFormattedText } from './CodeFormattedText';

interface CMSMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  helpText?: string;
  className?: string;
  onSave?: () => void;
}

export const CMSMarkdownEditor: React.FC<CMSMarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter content here...',
  rows = 4,
  label,
  helpText,
  className = '',
  onSave
}) => {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + prefix + defaultText + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = prefix + selectedText + suffix;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300 tracking-wider">
            {label}
          </label>
          <div className="flex items-center gap-1 bg-gray-200 dark:bg-slate-800 p-0.5 rounded-lg border border-[#1A1A1A]">
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`px-2 py-0.5 text-[11px] font-black uppercase rounded flex items-center gap-1 cursor-pointer transition-colors ${
                mode === 'edit' ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-sm' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
              }`}
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`px-2 py-0.5 text-[11px] font-black uppercase rounded flex items-center gap-1 cursor-pointer transition-colors ${
                mode === 'preview' ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-sm' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
              }`}
            >
              <Eye className="w-3 h-3" /> Preview
            </button>
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                className="px-2 py-0.5 text-[11px] font-black uppercase rounded flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-all border border-emerald-700 shadow-sm"
              >
                <Save className="w-3 h-3" /> Save
              </button>
            )}
          </div>
        </div>
      )}

      {/* Formatting Toolbar */}
      {mode === 'edit' && (
        <div className="flex flex-wrap items-center gap-1 p-1 bg-gray-100 dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-t-xl text-xs">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**', 'bold text')}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded border border-transparent hover:border-[#1A1A1A] text-gray-700 dark:text-slate-200 cursor-pointer"
            title="Bold (**text**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*', 'italic text')}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded border border-transparent hover:border-[#1A1A1A] text-gray-700 dark:text-slate-200 cursor-pointer"
            title="Italic (*text*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-0.5" />
          <button
            type="button"
            onClick={() => insertFormatting('```python\n', '\n```', '# Python code block\nprint("Hello Bhutan")')}
            className="px-2 py-1 hover:bg-white dark:hover:bg-slate-700 rounded border border-transparent hover:border-[#1A1A1A] text-gray-700 dark:text-slate-200 cursor-pointer font-bold text-[11px] flex items-center gap-1 bg-amber-100/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200"
            title="Python Code Block"
          >
            <Code className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> Code Block
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('`', '`', 'code')}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded border border-transparent hover:border-[#1A1A1A] text-gray-700 dark:text-slate-200 cursor-pointer font-mono text-[11px]"
            title="Inline Code (`code`)"
          >
            `code`
          </button>
          <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-0.5" />
          <button
            type="button"
            onClick={() => insertFormatting('- ', '', 'Bullet list item')}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded border border-transparent hover:border-[#1A1A1A] text-gray-700 dark:text-slate-200 cursor-pointer"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('1. ', '', 'Numbered list item')}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded border border-transparent hover:border-[#1A1A1A] text-gray-700 dark:text-slate-200 cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-0.5" />
          <button
            type="button"
            onClick={() => insertFormatting('### ', '', 'Heading')}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded border border-transparent hover:border-[#1A1A1A] text-gray-700 dark:text-slate-200 cursor-pointer font-bold"
            title="Heading 3"
          >
            H3
          </button>
        </div>
      )}

      {/* Editor or Preview Pane */}
      {mode === 'edit' ? (
        <textarea
          ref={textareaRef}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-white dark:bg-slate-800 p-3 rounded-b-xl border-2 border-[#1A1A1A] font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
        />
      ) : (
        <div className="w-full min-h-[100px] bg-white dark:bg-slate-800 p-3 rounded-xl border-2 border-[#1A1A1A] font-sans text-xs leading-relaxed overflow-y-auto max-h-60">
          {value ? (
            <CodeFormattedText text={value} />
          ) : (
            <span className="text-gray-400 italic">No content to preview.</span>
          )}
        </div>
      )}

      {helpText && (
        <p className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1 font-medium">
          <HelpCircle className="w-3 h-3 text-[#6D071A]" /> {helpText}
        </p>
      )}
    </div>
  );
};
