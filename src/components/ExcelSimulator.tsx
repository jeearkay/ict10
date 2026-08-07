import React, { useState, useEffect, useRef } from 'react';
import { getStudentExcelTemplates, subscribeToContentChanges } from '../lib/contentManager';
import { 
  Table, 
  FunctionSquare, 
  BarChart2, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpDown, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Calculator,
  Search,
  Zap,
  Info,
  Layers,
  Plus,
  Trash2,
  Lock,
  Download,
  ShieldCheck,
  X,
  Play,
  RotateCcw,
  Check,
  Calendar,
  Grid,
  Copy,
  Edit3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LabelList
} from 'recharts';
import { EXCEL_FUNCTIONS_CATALOG, evaluateCell, shiftFormula, validateCellFormula, getFormulaSuggestions, applyFormulaSuggestion, ExcelFunctionDoc } from '../lib/excelEngine';

interface SheetTemplate {
  id: string;
  name: string;
  subtitle: string;
  cols: string[];
  rows: number[];
  cells: Record<string, string>;
  defaultChart: 'column' | 'bar' | 'pie' | 'line';
}

const TEMPLATES: SheetTemplate[] = [
  {
    id: 'stationery',
    name: 'Stationery Store & Sales Invoice',
    subtitle: 'Page 35, 38, 39: Relative (=C2*D2) & Absolute Reference ($F$2 Tax)',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    rows: [1, 2, 3, 4, 5, 6, 7, 8],
    defaultChart: 'column',
    cells: {
      A1: 'SL', B1: 'Item Name', C1: 'Price (Nu)', D1: 'Qty', E1: 'Subtotal', F1: 'Tax Rate', G1: 'Total Cost',
      A2: '1', B2: 'Pen', C2: '30', D2: '2', E2: '=C2*D2', F2: '0.07', G2: '=E2*(1+$F$2)',
      A3: '2', B3: 'Pencil', C3: '5', D3: '3', E3: '=C3*D3', F3: '', G3: '=E3*(1+$F$2)',
      A4: '3', B4: 'Ruler', C4: '40', D4: '2', E4: '=C4*D4', F4: '', G4: '=E4*(1+$F$2)',
      A5: '4', B5: 'Sharpener', C5: '20', D5: '1', E5: '=C5*D5', F5: '', G5: '=E5*(1+$F$2)',
      A6: '5', B6: 'Notebook', C6: '70', D6: '2', E6: '=C6*D6', F6: '', G6: '=E6*(1+$F$2)',
      A7: 'Total', B7: '', C7: '=SUM(C2:C6)', D7: '=SUM(D2:D6)', E7: '=SUM(E2:E6)', F7: '', G7: '=SUM(G2:G6)',
      A8: 'Average', B8: '', C8: '=AVERAGE(C2:C6)', D8: '=AVERAGE(D2:D6)', E8: '', F8: '', G8: '=AVERAGE(G2:G6)'
    }
  },
  {
    id: 'marksheet',
    name: 'Class 10 Examination Marksheet & Rank Analysis',
    subtitle: 'Page 37, 44, 46: SUM, AVERAGE, IF, RANK, MAX, MIN & COUNTIF',
    cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    rows: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    defaultChart: 'bar',
    cells: {
      A1: 'Roll', B1: 'Student Name', C1: 'English', D1: 'Dzongkha', E1: 'Math', F1: 'ICT', G1: 'Total', H1: 'Percentage', I1: 'Result', J1: 'Rank',
      A2: '101', B2: 'Tenzin Norbu', C2: '85', D2: '78', E2: '92', F2: '95', G2: '=SUM(C2:F2)', H2: '=AVERAGE(C2:F2)', I2: '=IF(H2>=40, "PASS", "FAIL")', J2: '=RANK(G2, G2:G6)',
      A3: '102', B3: 'Pema Dechen', C3: '62', D3: '70', E3: '58', F3: '80', G3: '=SUM(C3:F3)', H3: '=AVERAGE(C3:F3)', I3: '=IF(H3>=40, "PASS", "FAIL")', J3: '=RANK(G3, G2:G6)',
      A4: '103', B4: 'Dorji Gyeltshen', C4: '35', D4: '38', E4: '32', F4: '39', G4: '=SUM(C4:F4)', H4: '=AVERAGE(C4:F4)', I4: '=IF(H4>=40, "PASS", "FAIL")', J4: '=RANK(G4, G2:G6)',
      A5: '104', B5: 'Sonam Choden', C5: '90', D5: '88', E5: '95', F5: '98', G5: '=SUM(C5:F5)', H5: '=AVERAGE(C5:F5)', I5: '=IF(H5>=40, "PASS", "FAIL")', J5: '=RANK(G5, G2:G6)',
      A6: '105', B6: 'Karma Wangdi', C6: '75', D6: '82', E6: '68', F6: '88', G6: '=SUM(C6:F6)', H6: '=AVERAGE(C6:F6)', I6: '=IF(H6>=40, "PASS", "FAIL")', J6: '=RANK(G6, G2:G6)',
      A7: 'Class High', B7: '', C7: '=MAX(C2:C6)', D7: '=MAX(D2:D6)', E7: '=MAX(E2:E6)', F7: '=MAX(F2:F6)', G7: '', H7: '', I7: '', J7: '',
      A8: 'Class Low', B8: '', C8: '=MIN(C2:C6)', D8: '=MIN(D2:D6)', E8: '=MIN(E2:E6)', F8: '=MIN(F2:F6)', G8: '', H8: '', I8: '', J8: '',
      A9: 'Passed Count', B9: '', C9: '=COUNTIF(C2:C6, ">=40")', D9: '=COUNTIF(D2:D6, ">=40")', E9: '=COUNTIF(E2:E6, ">=40")', F9: '=COUNTIF(F2:F6, ">=40")', G9: '', H9: '', I9: '', J9: ''
    }
  },
  {
    id: 'commission',
    name: 'Sales Outlets & Commission Calculator',
    subtitle: 'Page 44-45: IF Condition with Absolute Reference ($G$6)',
    cols: ['A', 'B', 'C', 'D', 'E'],
    rows: [1, 2, 3, 4, 5, 6, 7],
    defaultChart: 'column',
    cells: {
      A1: 'Sales Outlet', B1: 'Sales (Nu)', C1: 'Target (Nu)', D1: 'Comm Rate', E1: 'Commission (Nu)',
      A2: 'Thimphu Main', B2: '30000', C2: '20000', D2: '=IF(B2>=C2, "30%", "1%")', E2: '=IF(B2>=C2, B2*0.3, B2*0.01)',
      A3: 'Paro Branch', B3: '19999', C3: '20000', D3: '=IF(B3>=C3, "30%", "1%")', E3: '=IF(B3>=C3, B3*0.3, B3*0.01)',
      A4: 'Punakha Hub', B4: '25000', C4: '20000', D4: '=IF(B4>=C4, "30%", "1%")', E4: '=IF(B4>=C4, B4*0.3, B4*0.01)',
      A5: 'Phuntsholing', B5: '33300', C5: '20000', D5: '=IF(B5>=C5, "30%", "1%")', E5: '=IF(B5>=C5, B5*0.3, B5*0.01)',
      A6: 'Total Sales', B6: '=SUM(B2:B5)', C6: '', D6: 'Total Comm', E6: '=SUM(E2:E5)',
      A7: 'Qualified Count', B7: '=COUNTIF(B2:B5, ">=20000")', C7: '', D7: 'High Comm Count', E7: '=COUNTIFS(B2:B5, ">=25000", E2:E5, ">=7000")'
    }
  },
  {
    id: 'master_functions',
    name: 'Master Excel Functions Showcase (All 22 Functions)',
    subtitle: 'Interactive Testing Ground for Every Function in Class 10 Syllabus',
    cols: ['A', 'B', 'C', 'D'],
    rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    defaultChart: 'line',
    cells: {
      A1: 'Function', B1: 'Input Data / Parameters', C1: 'Excel Formula', D1: 'Evaluated Result',
      A2: 'SUM', B2: '10, 20, 30', C2: '=SUM(10, 20, 30)', D2: '=SUM(10, 20, 30)',
      A3: 'AVERAGE', B3: '10, 20, 30', C3: '=AVERAGE(10, 20, 30)', D3: '=AVERAGE(10, 20, 30)',
      A4: 'MIN', B4: '5, 12, 100', C4: '=MIN(5, 12, 100)', D4: '=MIN(5, 12, 100)',
      A5: 'MAX', B5: '5, 12, 100', C5: '=MAX(5, 12, 100)', D5: '=MAX(5, 12, 100)',
      A6: 'COUNT', B6: '1, 2, "Pen", 4', C6: '=COUNT(1, 2, 4)', D6: '=COUNT(1, 2, 4)',
      A7: 'COUNTA', B7: 'A1:D6 Filled Cells', C7: '=COUNTA(A1:D6)', D7: '=COUNTA(A1:D6)',
      A8: 'MEDIAN', B8: '10, 20, 30, 40, 50', C8: '=MEDIAN(10, 20, 30, 40, 50)', D8: '=MEDIAN(10, 20, 30, 40, 50)',
      A9: 'MODE', B9: '2, 3, 2, 1, 2', C9: '=MODE(2, 3, 2, 1, 2)', D9: '=MODE(2, 3, 2, 1, 2)',
      A10: 'RANK', B10: 'Rank 80 in [50, 80, 90]', C10: '=RANK(80, B2:B6)', D10: '=RANK(80, B2:B6)',
      A11: 'IF', B11: 'Condition 10 > 5', C11: '=IF(10>5, "Pass", "Fail")', D11: '=IF(10>5, "Pass", "Fail")',
      A12: 'AND', B12: '10>5 AND 20>10', C12: '=AND(10>5, 20>10)', D12: '=AND(10>5, 20>10)',
      A13: 'OR', B13: '10>5 OR 5>100', C13: '=OR(10>5, 5>100)', D13: '=OR(10>5, 5>100)',
      A14: 'NOT', B14: 'Invert 5 > 10', C14: '=NOT(5>10)', D14: '=NOT(5>10)',
      A15: 'LOWER', B15: '"BHUTAN ICT"', C15: '=LOWER("BHUTAN ICT")', D15: '=LOWER("BHUTAN ICT")',
      A16: 'UPPER', B16: '"karma academy"', C16: '=UPPER("karma academy")', D16: '=UPPER("karma academy")',
      A17: 'CONCATENATE', B17: '"Bhutan" + " " + "2026"', C17: '=CONCATENATE("Bhutan", " ", "2026")', D17: '=CONCATENATE("Bhutan", " ", "2026")',
      A18: 'DATE', B18: 'Year 2026, Month 7, Day 28', C18: '=DATE(2026, 7, 28)', D18: '=DATE(2026, 7, 28)',
      A19: 'TODAY', B19: 'System Date', C19: '=TODAY()', D19: '=TODAY()',
      A20: 'NOW', B20: 'System Timestamp', C20: '=NOW()', D20: '=NOW()',
      A21: 'VLOOKUP', B21: 'Find Roll 101 Name', C21: '=VLOOKUP(101, A2:B6, 2, FALSE)', D21: '=VLOOKUP(101, A2:B6, 2, FALSE)'
    }
  }
];

export const ExcelSimulator: React.FC = () => {
  const [templates, setTemplates] = useState(() => getStudentExcelTemplates());

  useEffect(() => {
    const unsubscribe = subscribeToContentChanges(() => {
      setTemplates(getStudentExcelTemplates());
    });
    return unsubscribe;
  }, []);

  // Navigation & Active View
  const [activeTab, setActiveTab] = useState<'spreadsheet' | 'reference' | 'exercises'>('spreadsheet');
  const [ribbonTab, setRibbonTab] = useState<'home' | 'insert' | 'formulas' | 'data'>('home');

  // Active Template / Sheet
  const [currentTemplateId, setCurrentTemplateId] = useState<string>(() => getStudentExcelTemplates()[0]?.id || 'stationery');
  const currentTemplate = templates.find((t) => t.id === currentTemplateId) || templates[0] || getStudentExcelTemplates()[0];

  // Grid Cells State & In-Cell Editing
  const [cells, setCells] = useState<Record<string, string>>(currentTemplate.cells);
  const [dynamicRows, setDynamicRows] = useState<number[]>(currentTemplate.rows);
  const [activeCell, setActiveCell] = useState<string>('E2');
  const [formulaInput, setFormulaInput] = useState<string>('=C2*D2');
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [suggestIndex, setSuggestIndex] = useState<number>(0);
  const [formulaBarSuggestIndex, setFormulaBarSuggestIndex] = useState<number>(0);
  const [autofillNotice, setAutofillNotice] = useState<string | null>(null);
  const cellInputRef = useRef<HTMLInputElement | null>(null);

  // Chart & Styling Options
  const [selectedChart, setSelectedChart] = useState<'column' | 'bar' | 'pie' | 'line'>(currentTemplate.defaultChart);
  const [enableConditionalFormatting, setConditionalFormatting] = useState<boolean>(true);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  // Reference Catalog Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Data Validation Modal
  const [showDataValidationModal, setShowDataValidationModal] = useState<boolean>(false);
  const [validationMin, setValidationMin] = useState<number>(0);
  const [validationMax, setValidationMax] = useState<number>(100);
  const [validationErrorMessage, setValidationErrorMessage] = useState<string | null>(null);

  // Sync cell data when template changes
  useEffect(() => {
    setCells(currentTemplate.cells);
    setDynamicRows(currentTemplate.rows);
    const defaultCell = currentTemplate.cols.includes('E') ? 'E2' : 'D2';
    setActiveCell(defaultCell);
    setFormulaInput(currentTemplate.cells[defaultCell] || '');
    setSelectedChart(currentTemplate.defaultChart);
    setEditingCell(null);
    setAutofillNotice(null);
  }, [currentTemplateId]);

  // Focus inline cell editor when active
  useEffect(() => {
    if (editingCell && cellInputRef.current) {
      cellInputRef.current.focus();
      cellInputRef.current.select();
    }
  }, [editingCell]);

  // Handle Cell Click: Select cell and switch directly to inline editing
  const handleCellClick = (cellKey: string) => {
    setActiveCell(cellKey);
    const rawVal = cells[cellKey] || '';
    setFormulaInput(rawVal);
    setEditingCell(cellKey);
    setEditValue(rawVal);
  };

  // Start direct in-cell editing
  const handleCellDoubleClick = (cellKey: string) => {
    setActiveCell(cellKey);
    setEditingCell(cellKey);
    setEditValue(cells[cellKey] || '');
  };

  // Commit in-cell edit and optionally navigate
  const handleCommitCellEdit = (cellKey: string, newValue: string, nextDirection?: 'down' | 'right') => {
    setCells((prev) => ({
      ...prev,
      [cellKey]: newValue
    }));
    setFormulaInput(newValue);
    setEditingCell(null);

    if (nextDirection) {
      const match = cellKey.match(/([A-Z]+)(\d+)/);
      if (match) {
        const col = match[1];
        const row = parseInt(match[2], 10);
        if (nextDirection === 'down') {
          const nextRow = row + 1;
          const nextKey = `${col}${nextRow}`;
          if (dynamicRows.includes(nextRow)) {
            setActiveCell(nextKey);
            setFormulaInput(cells[nextKey] || '');
          }
        } else if (nextDirection === 'right') {
          const colCode = col.charCodeAt(0) + 1;
          if (colCode <= 90) { // 'Z'
            const nextCol = String.fromCharCode(colCode);
            const nextKey = `${nextCol}${row}`;
            if (currentTemplate.cols.includes(nextCol)) {
              setActiveCell(nextKey);
              setFormulaInput(cells[nextKey] || '');
            }
          }
        }
      }
    }
  };

  // Auto-Fill column down logic (Excel Fill Handle feature)
  const handleAutoFillColumn = () => {
    if (!activeCell) return;
    const match = activeCell.match(/([A-Z]+)(\d+)/);
    if (!match) return;

    const col = match[1];
    const startRow = parseInt(match[2], 10);
    const sourceFormula = cells[activeCell] || '';

    if (!sourceFormula) return;

    const newCells = { ...cells };
    let count = 0;

    for (const r of dynamicRows) {
      if (r > startRow) {
        const cellA = (cells[`A${r}`] || '').toLowerCase();
        const cellB = (cells[`B${r}`] || '').toLowerCase();
        if (cellA.includes('total') || cellA.includes('average') || cellB.includes('total') || cellB.includes('average')) {
          break;
        }

        const rowOffset = r - startRow;
        const shifted = shiftFormula(sourceFormula, rowOffset, 0);
        const targetKey = `${col}${r}`;
        newCells[targetKey] = shifted;
        count++;
      }
    }

    setCells(newCells);
    setAutofillNotice(`✨ Auto-filled formula down column ${col} for ${count} cell(s)!`);
    setTimeout(() => setAutofillNotice(null), 4000);
  };

  // Add new row to dynamic grid
  const handleAddRow = () => {
    const lastRow = dynamicRows.length > 0 ? Math.max(...dynamicRows) : 1;
    const newRow = lastRow + 1;
    setDynamicRows((prev) => [...prev, newRow]);
    const prevValA = cells[`A${lastRow}`];
    if (prevValA && !isNaN(parseInt(prevValA, 10))) {
      setCells((prev) => ({
        ...prev,
        [`A${newRow}`]: String(parseInt(prevValA, 10) + 1)
      }));
    }
  };

  // Delete last row from dynamic grid
  const handleDeleteRow = () => {
    if (dynamicRows.length <= 2) return;
    const lastRow = Math.max(...dynamicRows);
    setDynamicRows((prev) => prev.filter((r) => r !== lastRow));
    setCells((prev) => {
      const updated = { ...prev };
      currentTemplate.cols.forEach((col) => {
        delete updated[`${col}${lastRow}`];
      });
      return updated;
    });
  };

  // Handle formula change from formula bar or cell editor
  const handleFormulaChange = (val: string) => {
    setFormulaInput(val);
    if (editingCell) {
      setEditValue(val);
    }
    setCells((prev) => ({
      ...prev,
      [activeCell]: val
    }));
  };

  // Check Data Validation rule on value input
  const validateCellValue = (val: string): boolean => {
    const num = parseFloat(val);
    if (!isNaN(num) && (num < validationMin || num > validationMax)) {
      return false;
    }
    return true;
  };

  // Insert formula from Catalog directly into Active Cell
  const insertFunctionToCell = (formulaExample: string) => {
    setFormulaInput(formulaExample);
    setCells((prev) => ({
      ...prev,
      [activeCell]: formulaExample
    }));
    setActiveTab('spreadsheet');
  };

  // Detect which Excel Function is used in active cell to show explanation
  const getActiveCellFunctionDoc = (): ExcelFunctionDoc | null => {
    const raw = cells[activeCell] || '';
    if (!raw.startsWith('=')) return null;

    const match = raw.match(/=([A-Z]+)/i);
    if (!match) return null;

    const fnName = match[1].toUpperCase();
    return EXCEL_FUNCTIONS_CATALOG.find((f) => f.name === fnName) || null;
  };

  const activeDoc = getActiveCellFunctionDoc();

  // Function Catalog Search Filter
  const categories = ['All', ...Array.from(new Set(EXCEL_FUNCTIONS_CATALOG.map((f) => f.category)))];
  const filteredFunctions = EXCEL_FUNCTIONS_CATALOG.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.syntax.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Quick Status Bar Statistics for current column
  const activeCol = activeCell.replace(/\d+/g, '');
  const colValues = currentTemplate.rows
    .map((r) => evaluateCell(`${activeCol}${r}`, cells))
    .map((v) => parseFloat(v))
    .filter((n) => !isNaN(n));

  const statsSum = colValues.reduce((a, b) => a + b, 0);
  const statsAvg = colValues.length > 0 ? (statsSum / colValues.length).toFixed(2) : '0';
  const statsCount = colValues.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner Navigation Header */}
      <div className="bg-[#FDFCF0] dark:bg-slate-900 border-3 border-[#1A1A1A] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#1A1A1A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#6D071A] text-[#FFCC33] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-[#1A1A1A]">
              Kingdom of Bhutan • ICT Class 10 Syllabus
            </span>
            <span className="bg-[#FFCC33] text-[#1A1A1A] text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-[#1A1A1A]">
              Chapter 5 Lab
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-amber-100 font-serif flex items-center gap-2">
            <Calculator className="w-7 h-7 text-[#FFCC33]" /> Interactive MS Excel Practical Lab
          </h2>
          <p className="text-xs font-semibold text-gray-600 dark:text-slate-300">
            Real formula bar view (`fx`), live multi-cell evaluator, 22 built-in functions, data validation & dynamic charts!
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl border-2 border-[#1A1A1A]">
          <button
            onClick={() => setActiveTab('spreadsheet')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'spreadsheet'
                ? 'bg-[#FFCC33] text-[#1A1A1A] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-amber-50'
            }`}
          >
            <Grid className="w-4 h-4 text-[#6D071A]" /> Live Spreadsheet
          </button>

          <button
            onClick={() => setActiveTab('reference')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'reference'
                ? 'bg-[#FFCC33] text-[#1A1A1A] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-amber-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#6D071A]" /> All 22 Functions Guide
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'exercises'
                ? 'bg-[#FFCC33] text-[#1A1A1A] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-amber-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#6D071A]" /> Practice Exercises
          </button>
        </div>
      </div>

      {/* SPREADSHEET LIVE LAB VIEW */}
      {activeTab === 'spreadsheet' && (
        <div className="bg-white dark:bg-slate-900 border-3 border-[#1A1A1A] rounded-3xl shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden space-y-0">
          {/* Worksheet Scenario Selector Dropdown Bar */}
          <div className="bg-amber-50 dark:bg-slate-800 p-4 border-b-2 border-[#1A1A1A] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#6D071A] dark:text-amber-400" />
              <span className="text-xs font-black uppercase text-[#1A1A1A] dark:text-amber-200">
                Select Curriculum Practical Sheet:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setCurrentTemplateId(tmpl.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                    currentTemplateId === tmpl.id
                      ? 'bg-[#6D071A] text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                      : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700 hover:bg-amber-100'
                  }`}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Microsoft Excel Ribbon Header Tabs */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-3 border-b-2 border-[#1A1A1A] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {(['home', 'insert', 'formulas', 'data'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setRibbonTab(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                    ribbonTab === t
                      ? 'bg-[#FFCC33] text-[#1A1A1A] border border-[#1A1A1A]'
                      : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-100'
                  }`}
                >
                  {t} Tab
                </button>
              ))}
            </div>

            {/* Ribbon Sub-controls */}
            <div className="flex items-center gap-3">
              {ribbonTab === 'home' && (
                <div className="flex flex-wrap items-center gap-2 bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/60 text-xs">
                  <button
                    onClick={() => setIsBold(!isBold)}
                    className={`px-2 py-0.5 rounded font-black border cursor-pointer ${
                      isBold ? 'bg-[#FFCC33] text-[#1A1A1A]' : 'text-emerald-100 border-transparent'
                    }`}
                  >
                    B
                  </button>
                  <button
                    onClick={() => setIsItalic(!isItalic)}
                    className={`px-2 py-0.5 rounded italic font-bold border cursor-pointer ${
                      isItalic ? 'bg-[#FFCC33] text-[#1A1A1A]' : 'text-emerald-100 border-transparent'
                    }`}
                  >
                    I
                  </button>
                  <div className="h-4 w-px bg-emerald-700" />
                  <button
                    onClick={() => setConditionalFormatting(!enableConditionalFormatting)}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded font-black text-[11px] cursor-pointer ${
                      enableConditionalFormatting
                        ? 'bg-amber-400 text-[#1A1A1A]'
                        : 'bg-emerald-900 text-emerald-200'
                    }`}
                  >
                    <Filter className="w-3 h-3" /> Conditional Format (&lt;40 Red)
                  </button>
                  <div className="h-4 w-px bg-emerald-700" />
                  <button
                    onClick={handleAddRow}
                    className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold text-[11px] cursor-pointer border border-emerald-500"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                  <button
                    onClick={handleDeleteRow}
                    className="flex items-center gap-1 px-2.5 py-0.5 bg-red-800 hover:bg-red-700 text-white rounded font-bold text-[11px] cursor-pointer border border-red-600"
                  >
                    <Trash2 className="w-3 h-3" /> Delete Row
                  </button>
                </div>
              )}

              {ribbonTab === 'insert' && (
                <div className="flex items-center gap-2 bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/60 text-xs">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase">Insert Chart:</span>
                  <select
                    value={selectedChart}
                    onChange={(e) => setSelectedChart(e.target.value as any)}
                    className="bg-slate-900 border border-emerald-500 text-amber-300 text-xs rounded-lg px-2 py-1 font-bold focus:outline-none"
                  >
                    <option value="column">📊 Column Chart</option>
                    <option value="bar">📊 Bar Chart</option>
                    <option value="pie">🥧 Pie Chart</option>
                    <option value="line">📈 Line Chart</option>
                  </select>
                </div>
              )}

              {ribbonTab === 'formulas' && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[10px] font-black uppercase text-amber-300">Formulas:</span>
                  <button
                    onClick={handleAutoFillColumn}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#FFCC33] hover:bg-amber-400 text-[#1A1A1A] rounded font-black text-[11px] border border-[#1A1A1A] cursor-pointer"
                    title="Auto-fill active formula down all rows in this column"
                  >
                    <Zap className="w-3.5 h-3.5" /> Auto-Fill Down Column
                  </button>
                  <div className="h-4 w-px bg-emerald-700" />
                  <button
                    onClick={() => handleFormulaChange(`=SUM(C2:C6)`)}
                    className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-mono text-[11px] border border-emerald-500 cursor-pointer"
                  >
                    =SUM()
                  </button>
                  <button
                    onClick={() => handleFormulaChange(`=AVERAGE(C2:C6)`)}
                    className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-mono text-[11px] border border-emerald-500 cursor-pointer"
                  >
                    =AVERAGE()
                  </button>
                  <button
                    onClick={() => handleFormulaChange(`=IF(C2>=40, "PASS", "FAIL")`)}
                    className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-mono text-[11px] border border-emerald-500 cursor-pointer"
                  >
                    =IF()
                  </button>
                </div>
              )}

              {ribbonTab === 'data' && (
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setShowDataValidationModal(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-400 text-[#1A1A1A] rounded-lg font-black text-xs cursor-pointer border border-[#1A1A1A]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Data Validation Rules
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AUTOFILL NOTIFICATION BANNER */}
          {autofillNotice && (
            <div className="bg-[#FFCC33] text-[#1A1A1A] px-4 py-2 font-black text-xs flex items-center justify-between border-b-2 border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6D071A]" />
                <span>{autofillNotice}</span>
              </div>
              <button
                onClick={() => setAutofillNotice(null)}
                className="text-[#1A1A1A] hover:bg-amber-400 px-1.5 py-0.5 rounded font-black text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* REAL EXCEL FORMULA BAR (`fx`) & Name Box */}
          <div className="bg-slate-100 dark:bg-slate-800 border-b-2 border-[#1A1A1A] px-4 py-2 flex flex-wrap items-center gap-3 font-mono">
            {/* Active Cell Name Box */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border-2 border-[#1A1A1A] rounded-xl px-3 py-1 font-black text-xs text-[#1A1A1A] dark:text-amber-300 shadow-[2px_2px_0px_0px_#1A1A1A]">
              <Grid className="w-3.5 h-3.5 text-[#6D071A]" />
              <span>{activeCell}</span>
            </div>

            {/* Function symbol `fx` */}
            <div className="text-[#6D071A] dark:text-amber-400 font-black italic flex items-center gap-1 text-sm">
              <FunctionSquare className="w-5 h-5 text-[#6D071A] dark:text-amber-400" /> fx
            </div>

            {/* Live Formula Input Field with Auto-Suggest */}
            <div className="relative flex-1 min-w-[220px]">
              <input
                type="text"
                value={formulaInput}
                onChange={(e) => {
                  handleFormulaChange(e.target.value);
                  setFormulaBarSuggestIndex(0);
                }}
                onKeyDown={(e) => {
                  const fbSuggestions = getFormulaSuggestions(formulaInput);
                  if (fbSuggestions.length > 0) {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setFormulaBarSuggestIndex((prev) => (prev + 1) % fbSuggestions.length);
                      return;
                    }
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setFormulaBarSuggestIndex((prev) => (prev - 1 + fbSuggestions.length) % fbSuggestions.length);
                      return;
                    }
                    if (e.key === 'Tab' || (e.key === 'Enter' && formulaInput.match(/=[A-Za-z0-9_]+$/))) {
                      e.preventDefault();
                      const chosen = fbSuggestions[formulaBarSuggestIndex] || fbSuggestions[0];
                      if (chosen) {
                        const completed = applyFormulaSuggestion(formulaInput, chosen.name);
                        handleFormulaChange(completed);
                        setFormulaBarSuggestIndex(0);
                      }
                      return;
                    }
                  }
                }}
                className="w-full bg-white dark:bg-slate-900 border-2 border-[#1A1A1A] rounded-xl px-3 py-1.5 text-xs font-black text-[#1A1A1A] dark:text-amber-200 focus:outline-none focus:ring-2 focus:ring-[#FFCC33] font-mono shadow-[2px_2px_0px_0px_#1A1A1A]"
                placeholder="Type formula starting with = (e.g. =SUM(C2:C6) or =10/0 or =IF(C2>=40, 'PASS', 'FAIL'))"
              />

              {/* Formula Bar Auto-Suggest Dropdown */}
              {(() => {
                const fbSuggestions = getFormulaSuggestions(formulaInput);
                if (fbSuggestions.length === 0) return null;
                return (
                  <div 
                    className="absolute left-0 top-full mt-1 w-72 md:w-80 bg-slate-900 border-2 border-[#1A1A1A] rounded-xl shadow-2xl z-50 overflow-hidden text-xs text-white"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="bg-[#6D071A] dark:bg-amber-700 px-3 py-1 text-[10px] font-black uppercase text-amber-300 flex items-center justify-between border-b border-slate-700">
                      <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-yellow-300" /> Formula Auto-Suggest</span>
                      <span className="text-[9px] opacity-80 font-normal">Press Tab / Enter</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-800 font-mono">
                      {fbSuggestions.map((fn, idx) => {
                        const isSelected = idx === formulaBarSuggestIndex;
                        return (
                          <button
                            key={fn.name}
                            type="button"
                            onClick={() => {
                              const completed = applyFormulaSuggestion(formulaInput, fn.name);
                              handleFormulaChange(completed);
                              setFormulaBarSuggestIndex(0);
                            }}
                            className={`w-full text-left px-3 py-2 transition-colors cursor-pointer flex flex-col gap-0.5 ${
                              isSelected
                                ? 'bg-amber-300 text-slate-950 font-bold shadow-inner'
                                : 'hover:bg-slate-800 text-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-black text-xs ${
                                  isSelected ? 'text-slate-950' : 'text-amber-300'
                                }`}
                              >
                                {fn.name}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-sans font-bold ${
                                  isSelected
                                    ? 'bg-slate-950 text-amber-300 border border-slate-800'
                                    : 'bg-slate-800 text-amber-200 border border-slate-700'
                                }`}
                              >
                                {fn.category}
                              </span>
                            </div>
                            <div
                              className={`text-[10px] font-mono ${
                                isSelected ? 'text-slate-900 font-bold' : 'text-amber-100/90 font-medium'
                              }`}
                            >
                              {fn.syntax}
                            </div>
                            <div
                              className={`text-[10px] font-sans line-clamp-1 ${
                                isSelected ? 'text-slate-800 font-semibold' : 'text-slate-300'
                              }`}
                            >
                              {fn.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Formula Validation Feedback Badge */}
            {(() => {
              const validation = validateCellFormula(activeCell, formulaInput, cells);
              if (!validation.isValid && validation.error) {
                return (
                  <div 
                    className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white border-2 border-red-900 rounded-xl text-xs font-black animate-pulse shadow-[2px_2px_0px_0px_#1A1A1A]"
                    title={validation.error.message}
                  >
                    <AlertCircle className="w-4 h-4 text-yellow-300 shrink-0" />
                    <span>{validation.error.code}: {validation.error.message}</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* SPREADSHEET GRID TABLE */}
          <div className="p-4 overflow-x-auto bg-slate-50 dark:bg-slate-950">
            <table 
              role="grid" 
              aria-label="Class 10 ICT Excel Interactive Simulator Grid"
              className="w-full border-collapse border-2 border-[#1A1A1A] dark:border-slate-700 text-xs font-sans select-none"
            >
              <thead>
                <tr className="bg-amber-200 dark:bg-slate-800 text-[#1A1A1A] dark:text-yellow-300 font-black">
                  <th role="columnheader" className="border-2 border-[#1A1A1A] dark:border-slate-700 p-2 w-12 text-center bg-amber-300 dark:bg-slate-900 text-[#1A1A1A] dark:text-yellow-300 font-black">
                    #
                  </th>
                  {currentTemplate.cols.map((col) => (
                    <th
                      key={col}
                      role="columnheader"
                      aria-label={`Column ${col}`}
                      className="border-2 border-[#1A1A1A] dark:border-slate-700 p-2 text-center min-w-[110px] bg-amber-200 dark:bg-slate-800 text-[#1A1A1A] dark:text-yellow-300 font-extrabold uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {dynamicRows.map((row) => (
                  <tr key={row}>
                    {/* Row Header Number */}
                    <td 
                      role="rowheader" 
                      aria-label={`Row ${row}`}
                      className="border-2 border-[#1A1A1A] dark:border-slate-700 p-2 text-center font-black bg-amber-100 dark:bg-slate-800 text-[#1A1A1A] dark:text-amber-200"
                    >
                      {row}
                    </td>

                    {currentTemplate.cols.map((col) => {
                      const key = `${col}${row}`;
                      const isActive = activeCell === key;
                      const isEditing = editingCell === key;
                      const rawFormula = cells[key] || '';
                      const evaluatedVal = evaluateCell(key, cells);
                      const numVal = parseFloat(evaluatedVal);
                      const isErrorCell = evaluatedVal.startsWith('#');
                      const cellValidation = isErrorCell ? validateCellFormula(key, rawFormula || evaluatedVal, cells) : null;

                      // Conditional formatting rule: highlight numerical values < 40 in red if enabled
                      const isHighlightedRed =
                        enableConditionalFormatting &&
                        row > 1 &&
                        !rawFormula.startsWith('SL') &&
                        !isNaN(numVal) &&
                        numVal < 40;

                      // Highlight PASS / FAIL
                      const isPass = evaluatedVal === 'PASS';
                      const isFail = evaluatedVal === 'FAIL';

                      return (
                        <td
                          key={key}
                          role="gridcell"
                          aria-selected={isActive}
                          aria-label={`Cell ${key}, value: ${evaluatedVal || 'empty'}`}
                          title={isErrorCell && cellValidation?.error ? cellValidation.error.message : `Cell ${key}: ${evaluatedVal}`}
                          onClick={() => handleCellClick(key)}
                          onDoubleClick={() => handleCellDoubleClick(key)}
                          className={`border-2 border-slate-300 dark:border-slate-700 p-1 text-left cursor-pointer transition-all relative font-mono text-xs ${
                            isActive
                              ? 'ring-3 ring-[#6D071A] dark:ring-[#FFCC33] bg-amber-100 dark:bg-amber-950/80 z-10 font-black border-[#1A1A1A]'
                              : isErrorCell
                              ? 'bg-red-200 dark:bg-red-950 text-red-800 dark:text-red-200 font-extrabold border-red-500'
                              : isHighlightedRed
                              ? 'bg-red-100 dark:bg-red-950/80 text-red-900 dark:text-red-200 font-bold border-red-300'
                              : isPass
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-black'
                              : isFail
                              ? 'bg-red-200 dark:bg-red-950 text-red-900 dark:text-red-300 font-black'
                              : row === 1
                              ? 'bg-amber-50 dark:bg-slate-800 font-black text-[#1A1A1A] dark:text-amber-200'
                              : 'bg-white dark:bg-slate-900 hover:bg-amber-50/50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          {isEditing ? (
                            <div className="relative w-full">
                              <input
                                ref={cellInputRef}
                                type="text"
                                value={editValue}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditValue(val);
                                  setFormulaInput(val);
                                  setSuggestIndex(0);
                                }}
                                onBlur={() => handleCommitCellEdit(key, editValue)}
                                onKeyDown={(e) => {
                                  const suggestions = getFormulaSuggestions(editValue);
                                  if (suggestions.length > 0) {
                                    if (e.key === 'ArrowDown') {
                                      e.preventDefault();
                                      setSuggestIndex((prev) => (prev + 1) % suggestions.length);
                                      return;
                                    }
                                    if (e.key === 'ArrowUp') {
                                      e.preventDefault();
                                      setSuggestIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
                                      return;
                                    }
                                    if (e.key === 'Tab' || (e.key === 'Enter' && editValue.match(/=[A-Za-z0-9_]+$/))) {
                                      e.preventDefault();
                                      const chosen = suggestions[suggestIndex] || suggestions[0];
                                      if (chosen) {
                                        const completed = applyFormulaSuggestion(editValue, chosen.name);
                                        setEditValue(completed);
                                        setFormulaInput(completed);
                                        setSuggestIndex(0);
                                      }
                                      return;
                                    }
                                  }

                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCommitCellEdit(key, editValue, 'down');
                                  } else if (e.key === 'Tab') {
                                    e.preventDefault();
                                    handleCommitCellEdit(key, editValue, 'right');
                                  } else if (e.key === 'Escape') {
                                    setEditingCell(null);
                                  }
                                }}
                                className="w-full bg-yellow-100 dark:bg-slate-800 border-2 border-[#6D071A] text-[#1A1A1A] dark:text-amber-200 text-xs font-black px-1.5 py-1 rounded focus:outline-none font-mono"
                              />

                              {/* In-Cell Auto-Suggest Dropdown */}
                              {(() => {
                                const suggestions = getFormulaSuggestions(editValue);
                                if (suggestions.length === 0) return null;
                                return (
                                  <div 
                                    className="absolute left-0 top-full mt-1 w-64 md:w-72 bg-slate-900 border-2 border-[#1A1A1A] rounded-xl shadow-2xl z-50 overflow-hidden text-xs text-white"
                                    onMouseDown={(e) => e.preventDefault()}
                                  >
                                    <div className="bg-[#6D071A] dark:bg-amber-700 px-2.5 py-1 text-[10px] font-black uppercase text-amber-300 flex items-center justify-between border-b border-slate-700">
                                      <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-yellow-300" /> Function Auto-Suggest</span>
                                      <span className="text-[9px] opacity-80 font-normal">Tab / Enter</span>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto divide-y divide-slate-800 font-mono">
                                      {suggestions.map((fn, idx) => {
                                        const isSelected = idx === suggestIndex;
                                        return (
                                          <button
                                            key={fn.name}
                                            type="button"
                                            onClick={() => {
                                              const completed = applyFormulaSuggestion(editValue, fn.name);
                                              setEditValue(completed);
                                              setFormulaInput(completed);
                                              setSuggestIndex(0);
                                              if (cellInputRef.current) cellInputRef.current.focus();
                                            }}
                                            className={`w-full text-left px-2.5 py-1.5 transition-colors cursor-pointer flex flex-col gap-0.5 ${
                                              isSelected
                                                ? 'bg-amber-300 text-slate-950 font-bold shadow-inner'
                                                : 'hover:bg-slate-800 text-slate-100'
                                            }`}
                                          >
                                            <div className="flex items-center justify-between">
                                              <span
                                                className={`font-black text-xs ${
                                                  isSelected ? 'text-slate-950' : 'text-amber-300'
                                                }`}
                                              >
                                                {fn.name}
                                              </span>
                                              <span
                                                className={`text-[9px] px-1 py-0.5 rounded font-sans font-bold ${
                                                  isSelected
                                                    ? 'bg-slate-950 text-amber-300 border border-slate-800'
                                                    : 'bg-slate-800 text-amber-200 border border-slate-700'
                                                }`}
                                              >
                                                {fn.category}
                                              </span>
                                            </div>
                                            <div
                                              className={`text-[10px] font-mono truncate ${
                                                isSelected ? 'text-slate-900 font-bold' : 'text-amber-100/90 font-medium'
                                              }`}
                                            >
                                              {fn.syntax}
                                            </div>
                                            <div
                                              className={`text-[10px] font-sans line-clamp-1 ${
                                                isSelected ? 'text-slate-800 font-semibold' : 'text-slate-300'
                                              }`}
                                            >
                                              {fn.description}
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          ) : (
                            <div className={`px-1.5 py-1 truncate flex items-center justify-between gap-1 ${isBold ? 'font-black' : ''} ${isItalic ? 'italic' : ''}`}>
                              <span className="truncate">{evaluatedVal}</span>
                              {isErrorCell && <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />}
                            </div>
                          )}

                          {/* Excel Fill Handle indicator on active cell */}
                          {isActive && !isEditing && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAutoFillColumn();
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                handleAutoFillColumn();
                              }}
                              className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#6D071A] dark:bg-[#FFCC33] border border-black cursor-se-resize shadow-md hover:scale-125 transition-transform"
                              title="Excel Fill Handle: Click or double-click to auto-fill formula down column!"
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ACTIVE CELL FORMULA EXPLANATION CARD */}
          <div className="bg-amber-50/80 dark:bg-slate-800 p-4 border-t-2 border-[#1A1A1A] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#6D071A] dark:text-amber-400" />
                <span className="text-xs font-black uppercase text-[#1A1A1A] dark:text-amber-200">
                  Active Cell ({activeCell}) Inspection & Explanation
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold">
                <span className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-gray-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  Raw Entry: <strong className="text-[#6D071A] dark:text-amber-300">{cells[activeCell] || '(Empty)'}</strong>
                </span>
                <span className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-gray-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  Evaluated Result: <strong className="text-emerald-700 dark:text-emerald-400">{evaluateCell(activeCell, cells) || '(Empty)'}</strong>
                </span>
              </div>
            </div>

            {activeDoc ? (
              <div className="bg-white dark:bg-slate-900 border-2 border-[#1A1A1A] rounded-2xl p-4 shadow-[3px_3px_0px_0px_#1A1A1A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase bg-[#6D071A] text-[#FFCC33] px-2 py-0.5 rounded border border-[#1A1A1A]">
                    {activeDoc.category} Function • Curriculum Page {activeDoc.pdfPage}
                  </span>
                  <span className="font-mono text-xs font-black text-amber-600 dark:text-amber-300">
                    Syntax: {activeDoc.syntax}
                  </span>
                </div>

                <div className="font-serif font-black text-sm text-[#1A1A1A] dark:text-amber-100 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500" /> Function Explanation: ={activeDoc.name}()
                </div>

                <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed font-medium">
                  {activeDoc.explanation}
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-600 dark:text-slate-400 italic">
                Click any cell containing a formula (e.g. =SUM, =AVERAGE, =IF, =RANK) to inspect its plain-English syllabus explanation!
              </p>
            )}
          </div>

          {/* DYNAMIC REAL EXCEL RECHARTS SECTION */}
          <div className="p-5 bg-white dark:bg-slate-900 border-t-2 border-[#1A1A1A] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-black text-[#1A1A1A] dark:text-amber-200 font-serif flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#6D071A] dark:text-amber-400" /> Real Excel Chart Generator
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-gray-600 dark:text-slate-400">Chart Type:</span>
                <select
                  value={selectedChart}
                  onChange={(e) => setSelectedChart(e.target.value as any)}
                  className="bg-amber-50 dark:bg-slate-800 border-2 border-[#1A1A1A] text-[#1A1A1A] dark:text-amber-300 rounded-xl px-3 py-1 font-black focus:outline-none cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A]"
                >
                  <option value="column">📊 Column Chart (Vertical Bars)</option>
                  <option value="bar">📊 Bar Chart (Horizontal Bars)</option>
                  <option value="pie">🥧 Pie Chart (Proportions)</option>
                  <option value="line">📈 Line Chart (Trends)</option>
                </select>
              </div>
            </div>

            {/* Recharts Render Canvas Container */}
            <div className="bg-amber-50/40 dark:bg-slate-800/40 border-2 border-[#1A1A1A] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#1A1A1A] min-h-[22rem]">
              {(() => {
                const chartDataRows = dynamicRows.filter((r) => {
                  if (r === 1) return false;
                  const cellA = (cells[`A${r}`] || '').toLowerCase();
                  const cellB = (cells[`B${r}`] || '').toLowerCase();
                  if (cellA.includes('total') || cellA.includes('average') || cellA.includes('class') || cellA.includes('passed') || cellA.includes('high') || cellA.includes('low')) return false;
                  if (cellB.includes('total') || cellB.includes('average')) return false;
                  return true;
                });

                const chartData = chartDataRows.map((r) => {
                  const nameLabel = evaluateCell(`B${r}`, cells) || evaluateCell(`A${r}`, cells) || `Row ${r}`;
                  const rowObj: Record<string, any> = { name: nameLabel };

                  currentTemplate.cols.forEach((col) => {
                    const headerName = cells[`${col}1`] || `Col ${col}`;
                    const rawVal = evaluateCell(`${col}${r}`, cells);
                    const num = parseFloat(rawVal);
                    rowObj[col] = !isNaN(num) ? num : 0;
                    rowObj[headerName] = !isNaN(num) ? num : 0;
                  });

                  return rowObj;
                });

                const metricCols = currentTemplate.cols.filter((col) => {
                  if (col === 'A' || col === 'B') return false;
                  return chartDataRows.some((r) => !isNaN(parseFloat(evaluateCell(`${col}${r}`, cells))));
                });

                const primaryMetricCol = metricCols[0] || 'C';
                const primaryHeader = cells[`${primaryMetricCol}1`] || `Col ${primaryMetricCol}`;
                const CHART_COLORS = ['#2F5597', '#ED7D31', '#008080', '#D97706', '#6D071A', '#5B9BD5', '#70AD47', '#9E480E'];

                if (selectedChart === 'column') {
                  return (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={chartData} margin={{ top: 25, right: 30, left: 10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                        <XAxis dataKey="name" stroke="#1e293b" tick={{ fontSize: 11, fontWeight: 800 }} />
                        <YAxis stroke="#1e293b" tick={{ fontSize: 11, fontWeight: 800 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontWeight: 'bold' }}
                          itemStyle={{ color: '#FFCC33' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 'bold' }} />
                        {metricCols.slice(0, 3).map((col, idx) => {
                          const h = cells[`${col}1`] || `Col ${col}`;
                          return (
                            <Bar key={col} dataKey={h} fill={CHART_COLORS[idx % CHART_COLORS.length]} radius={[6, 6, 0, 0]}>
                              <LabelList dataKey={h} position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#1e293b' }} />
                            </Bar>
                          );
                        })}
                      </BarChart>
                    </ResponsiveContainer>
                  );
                }

                if (selectedChart === 'bar') {
                  return (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 40, left: 30, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                        <XAxis type="number" stroke="#1e293b" tick={{ fontSize: 11, fontWeight: 800 }} />
                        <YAxis dataKey="name" type="category" stroke="#1e293b" tick={{ fontSize: 11, fontWeight: 800 }} width={100} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 'bold' }} />
                        {metricCols.slice(0, 2).map((col, idx) => {
                          const h = cells[`${col}1`] || `Col ${col}`;
                          return (
                            <Bar key={col} dataKey={h} fill={CHART_COLORS[idx % CHART_COLORS.length]} radius={[0, 6, 6, 0]}>
                              <LabelList dataKey={h} position="right" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#1e293b' }} />
                            </Bar>
                          );
                        })}
                      </BarChart>
                    </ResponsiveContainer>
                  );
                }

                if (selectedChart === 'line') {
                  return (
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart data={chartData} margin={{ top: 25, right: 30, left: 10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                        <XAxis dataKey="name" stroke="#1e293b" tick={{ fontSize: 11, fontWeight: 800 }} />
                        <YAxis stroke="#1e293b" tick={{ fontSize: 11, fontWeight: 800 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 'bold' }} />
                        {metricCols.slice(0, 3).map((col, idx) => {
                          const h = cells[`${col}1`] || `Col ${col}`;
                          return (
                            <Line
                              key={col}
                              type="monotone"
                              dataKey={h}
                              stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                              strokeWidth={3}
                              dot={{ r: 5, fill: CHART_COLORS[idx % CHART_COLORS.length] }}
                            >
                              <LabelList dataKey={h} position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#1e293b' }} />
                            </Line>
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  );
                }

                if (selectedChart === 'pie') {
                  return (
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 'bold' }} />
                        <Pie
                          data={chartData}
                          dataKey={primaryHeader}
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => `${entry.name}: ${entry[primaryHeader] || 0}`}
                        >
                          {chartData.map((_, idx) => (
                            <Cell key={`pie-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} stroke="#1A1A1A" strokeWidth={1.5} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  );
                }

                return null;
              })()}
            </div>
          </div>

          {/* QUICK STATUS BAR */}
          <div className="bg-slate-200 dark:bg-slate-800 border-t-2 border-[#1A1A1A] px-4 py-2 flex flex-wrap items-center justify-between text-xs font-mono text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-3">
              <span className="bg-[#6D071A] text-white px-2 py-0.5 rounded font-black text-[10px] border border-black uppercase">
                READY
              </span>
              <span>Sheet: <strong className="text-[#6D071A] dark:text-amber-300">{currentTemplate.name}</strong></span>
            </div>

            <div className="flex items-center gap-4 text-xs font-black">
              <span>Col ({activeCol}) Avg: <strong className="text-emerald-700 dark:text-emerald-300">{statsAvg}</strong></span>
              <span>Count: <strong className="text-amber-700 dark:text-amber-300">{statsCount}</strong></span>
              <span>Sum: <strong className="text-[#6D071A] dark:text-amber-300">{statsSum.toFixed(2)}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* REFERENCE CATALOG TAB (ALL 22 FUNCTIONS) */}
      {activeTab === 'reference' && (
        <div className="bg-white dark:bg-slate-900 border-3 border-[#1A1A1A] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-gray-200 dark:border-slate-800 pb-5">
            <div>
              <h3 className="text-2xl font-black text-[#1A1A1A] dark:text-amber-100 font-serif flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-[#FFCC33]" /> Class 10 ICT Excel Functions Dictionary
              </h3>
              <p className="text-xs font-semibold text-gray-600 dark:text-slate-300 mt-1">
                Every required function from Class 10 Bhutan ICT syllabus with syntax, explanations & 1-click insertion!
              </p>
            </div>

            {/* Search & Category Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search function (e.g. SUM, VLOOKUP)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-xl text-xs font-bold text-[#1A1A1A] dark:text-white focus:outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-50 dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-xl px-3 py-2 text-xs font-black text-[#1A1A1A] dark:text-amber-300 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat} Category</option>
                ))}
              </select>
            </div>
          </div>

          {/* Functions Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFunctions.map((fn, idx) => (
              <div
                key={idx}
                className="bg-amber-50/50 dark:bg-slate-800/50 border-3 border-[#1A1A1A] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase bg-[#6D071A] text-[#FFCC33] px-2.5 py-1 rounded-md border border-[#1A1A1A]">
                      {fn.category}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 font-mono">
                      Page {fn.pdfPage}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-black text-lg text-[#1A1A1A] dark:text-amber-100 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" /> ={fn.name}()
                    </h4>
                    <div className="font-mono text-xs font-black text-[#6D071A] dark:text-amber-300 bg-amber-200/80 dark:bg-amber-950 px-3 py-1 rounded-lg mt-1.5 border border-amber-300 inline-block">
                      {fn.syntax}
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed font-medium">
                    {fn.description}
                  </p>

                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-[11px] font-medium text-gray-600 dark:text-slate-300">
                    <strong className="text-[#1A1A1A] dark:text-amber-200">Explanation:</strong> {fn.explanation}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t-2 border-gray-200 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-gray-600 dark:text-slate-400">
                    <strong className="text-[#1A1A1A] dark:text-white">Example Formula:</strong>{' '}
                    <code className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-gray-300 font-mono text-[#6D071A] dark:text-amber-300">
                      {fn.exampleFormula}
                    </code>
                  </div>

                  <button
                    onClick={() => insertFunctionToCell(fn.exampleFormula)}
                    className="w-full py-2 bg-[#FFCC33] hover:bg-amber-400 text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#6D071A]" /> Insert Formula Into Cell ({activeCell})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRACTICE EXERCISES TAB */}
      {activeTab === 'exercises' && (
        <div className="bg-white dark:bg-slate-900 border-3 border-[#1A1A1A] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-6">
          <div className="border-b-2 border-gray-200 dark:border-slate-800 pb-4">
            <h3 className="text-2xl font-black text-[#1A1A1A] dark:text-amber-100 font-serif flex items-center gap-2">
              <CheckCircle2 className="w-7 h-7 text-[#FFCC33]" /> Chapter 5 Practical Exercises & Solutions
            </h3>
            <p className="text-xs font-semibold text-gray-600 dark:text-slate-300 mt-1">
              Official Class 10 Bhutan ICT practical exercises with 1-click loading.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'stationery',
                title: 'Exercise 1: Stationery Cost & Absolute Reference ($F$2) (p. 35, 38)',
                desc: 'Create an Excel sheet with Sl (A1), Name (B1), Price (C1), Qty (D1), and Total (E1). In cell E2, enter formula =C2*D2*(1+$F$2) with 7% tax locked at F2.',
                formula: '=C2*D2*(1+$F$2)',
                status: 'Interactive in Live Lab'
              },
              {
                id: 'marksheet',
                title: 'Exercise 2: Class Marksheet, Rank & Pass/Fail IF Statement (p. 37, 44, 46)',
                desc: 'Calculate Total (=SUM), Percentage (=AVERAGE), Result (=IF(H2>=40, "PASS", "FAIL")), and Class Rank (=RANK(G2, G2:G6)).',
                formula: '=IF(H2>=40, "PASS", "FAIL")',
                status: 'Interactive in Live Lab'
              },
              {
                id: 'commission',
                title: 'Exercise 3: Sales Outlet Commission Rate (p. 44)',
                desc: 'Calculate the commission rate for each sales outlet based on sales target ($G$6 = 20,000). If sales >= threshold, 30% commission, otherwise 1%.',
                formula: '=IF(B2>=C2, B2*0.3, B2*0.01)',
                status: 'Interactive in Live Lab'
              },
              {
                id: 'master_functions',
                title: 'Exercise 4: All 22 Functions Master Laboratory (p. 36, 45, 46)',
                desc: 'Complete reference playground demonstrating SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, COUNTIF, COUNTIFS, AVERAGEIF, MEDIAN, MODE, RANK, IF, AND, OR, NOT, LOWER, UPPER, CONCATENATE, DATE, TODAY, NOW, VLOOKUP.',
                formula: '=VLOOKUP(101, A2:B6, 2, FALSE)',
                status: 'Interactive in Live Lab'
              }
            ].map((ex) => (
              <div
                key={ex.id}
                className="bg-gray-50 dark:bg-slate-800 border-3 border-[#1A1A1A] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-[#6D071A] text-white px-2 py-0.5 rounded border border-[#1A1A1A]">
                      Exercise
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      {ex.status}
                    </span>
                  </div>
                  <h4 className="font-serif font-black text-sm text-[#1A1A1A] dark:text-amber-200">{ex.title}</h4>
                  <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed font-medium">{ex.desc}</p>
                  <div className="font-mono text-xs font-bold text-[#6D071A] dark:text-amber-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border-2 border-[#1A1A1A] inline-block shadow-[2px_2px_0px_0px_#1A1A1A]">
                    Key Formula: {ex.formula}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentTemplateId(ex.id);
                    setActiveTab('spreadsheet');
                  }}
                  className="px-4 py-2.5 bg-[#FFCC33] hover:bg-amber-400 text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer whitespace-nowrap"
                >
                  Load Exercise Sheet
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DATA VALIDATION CONFIGURATOR MODAL */}
      {showDataValidationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-[10px_10px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between border-b-2 border-amber-200 dark:border-slate-800 pb-3">
              <h3 className="font-serif font-black text-lg text-[#1A1A1A] dark:text-amber-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#6D071A]" /> Excel Data Validation (p. 39-40)
              </h3>
              <button
                onClick={() => setShowDataValidationModal(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full cursor-pointer border border-[#1A1A1A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-gray-800 dark:text-slate-200">
              <p className="text-xs text-gray-600 dark:text-slate-300">
                Set data validation criteria to restrict cell inputs to whole numbers between specified minimum and maximum limits.
              </p>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase">Validation Criteria:</label>
                <select className="w-full p-2 bg-white dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-xl text-xs font-bold">
                  <option>Whole Number (Integer)</option>
                  <option>Decimal</option>
                  <option>List</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase">Minimum:</label>
                  <input
                    type="number"
                    value={validationMin}
                    onChange={(e) => setValidationMin(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-xl font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase">Maximum:</label>
                  <input
                    type="number"
                    value={validationMax}
                    onChange={(e) => setValidationMax(parseInt(e.target.value) || 100)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="bg-amber-100 dark:bg-slate-800 p-3 rounded-xl border border-[#1A1A1A] text-[11px]">
                <strong>Input Message:</strong> "Enter valid student marks between {validationMin} and {validationMax}"
              </div>
            </div>

            <button
              onClick={() => {
                setShowDataValidationModal(false);
              }}
              className="w-full py-3 bg-[#FFCC33] hover:bg-amber-400 text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer"
            >
              Apply Validation Rule
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
