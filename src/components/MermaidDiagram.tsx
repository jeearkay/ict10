import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

let diagramIdCounter = 0;

// Helper to sanitize common AI mermaid diagram syntax issues
function sanitizeMermaidChart(rawChart: string): string {
  let cleaned = rawChart.trim();

  // Strip accidental markdown fence blocks
  cleaned = cleaned.replace(/^```mermaid/i, '').replace(/```$/g, '').trim();

  // Ensure diagram has a valid header
  const knownHeaders = [
    'flowchart', 'graph', 'sequencediagram', 'classdiagram', 
    'statediagram', 'erdiagram', 'gantt', 'pie', 'mindmap', 
    'gitgraph', 'timeline', 'architecture'
  ];
  const firstLine = cleaned.split('\n')[0].trim().toLowerCase();
  const hasHeader = knownHeaders.some((h) => firstLine.startsWith(h));

  if (!hasHeader) {
    cleaned = `flowchart TD\n${cleaned}`;
  }

  // Auto-wrap unquoted node labels with parentheses or brackets in double quotes
  // e.g. A[Calculate (Class 10)] -> A["Calculate (Class 10)"]
  cleaned = cleaned.replace(/\[\s*([^"\]\n]*?\([\s\S]*?\)[^"\]\n]*?)\s*\]/g, '["$1"]');

  return cleaned;
}

// Purge any orphan error elements inserted directly into document.body by Mermaid v11
function purgeMermaidErrorElements() {
  try {
    // Remove any DOM elements with IDs starting with 'dmermaid' or containing error text
    const errorNodes = document.querySelectorAll('div[id^="dmermaid"], svg[id^="dmermaid"], #dmermaid-chart, div:has(> #mermaid-error-svg)');
    errorNodes.forEach((node) => node.remove());

    // Search body direct children for error elements
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach((child) => {
      if (
        (child.id && child.id.startsWith('d')) &&
        child.innerHTML &&
        (child.innerHTML.includes('Syntax error in text') || child.innerHTML.includes('mermaid version'))
      ) {
        child.remove();
      }
    });
  } catch (e) {
    // Ignore DOM cleanup errors
  }
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<boolean>(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'sans-serif',
      suppressErrorRendering: true, // Prevents Mermaid from injecting error divs into document body
    });

    let isMounted = true;
    const uniqueId = `mermaid-chart-${++diagramIdCounter}-${Date.now()}`;

    const renderChart = async () => {
      try {
        setRenderError(false);
        const cleanChart = sanitizeMermaidChart(chart);
        if (!cleanChart) return;

        // Pre-validate diagram syntax with mermaid.parse
        try {
          const isValid = await mermaid.parse(cleanChart, { suppressErrors: true });
          if (!isValid) {
            if (isMounted) setRenderError(true);
            purgeMermaidErrorElements();
            return;
          }
        } catch (parseErr) {
          if (isMounted) setRenderError(true);
          purgeMermaidErrorElements();
          return;
        }

        const { svg } = await mermaid.render(uniqueId, cleanChart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        console.warn('Mermaid render error caught:', err);
        if (isMounted) {
          setRenderError(true);
        }
        purgeMermaidErrorElements();
      }
    };

    renderChart();

    return () => {
      isMounted = false;
      purgeMermaidErrorElements();
      const orphan = document.getElementById(uniqueId);
      if (orphan) {
        orphan.remove();
      }
    };
  }, [chart]);

  if (renderError) {
    // Process chart into clean readable steps as fallback
    const lines = chart
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('graph') && !l.startsWith('flowchart'));

    return (
      <div className={`my-3 p-4 bg-[#6D071A]/10 dark:bg-amber-950/30 border-2 border-[#6D071A]/30 dark:border-amber-700/50 rounded-2xl text-xs space-y-2 ${className}`}>
        <div className="font-serif font-black flex items-center gap-1.5 text-[#6D071A] dark:text-yellow-400">
          <span>📊</span> Concept Flow & Process Steps:
        </div>
        <div className="space-y-1.5 font-sans font-medium text-slate-800 dark:text-amber-100">
          {lines.length > 0 ? (
            lines.slice(0, 8).map((line, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-amber-200 dark:border-slate-700">
                <span className="w-5 h-5 rounded-full bg-[#FFCC33] text-[#1A1A1A] font-black text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate">{line.replace(/-->/g, '➔').replace(/["'\[\]\{\}]/g, '')}</span>
              </div>
            ))
          ) : (
            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl font-mono text-[11px]">
              {chart}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-container my-3 p-3 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 rounded-xl shadow-xs overflow-x-auto flex justify-center items-center min-h-[100px] ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
