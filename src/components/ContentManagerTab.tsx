import React, { useState, useEffect } from 'react';
import { QuestModule, QuestLevel, PythonPreset, ExcelTemplate, FlowchartTemplate } from '../types';
import { InteractiveQuestion } from '../data/predefinedQuestions';
import { TriviaQuestion } from '../data/triviaData';
import { HomeworkSheet, HomeworkQuestion } from '../data/homeworkData';
import { ExamPrepQuestion, TracingProblem, TracingStep } from '../data/examData';
import { ICTGlossaryTerm } from '../lib/ictGlossary';
import { CMSMarkdownEditor } from './CMSMarkdownEditor';
import {
  getMergedSyllabusModules,
  saveSyllabusModules,
  resetSyllabusModulesToDefault,
  getMergedQuestionsForLevel,
  saveQuestionsForLevel,
  resetQuestionsToDefault,
  getMergedTriviaQuestions,
  saveTriviaQuestions,
  resetTriviaQuestionsToDefault,
  getMergedHomeworkSheets,
  saveHomeworkSheets,
  resetHomeworkSheetsToDefault,
  getMergedExamQuestions,
  saveExamQuestions,
  getMergedTracingProblems,
  saveTracingProblems,
  resetExamPrepToDefault,
  getMergedGlossaryTerms,
  saveGlossaryTerms,
  resetGlossaryTermsToDefault,
  getMergedPythonPresets,
  savePythonPresets,
  resetPythonPresetsToDefault,
  getMergedExcelTemplates,
  saveExcelTemplates,
  resetExcelTemplatesToDefault,
  getMergedFlowcharts,
  saveFlowcharts,
  resetFlowchartsToDefault,
  subscribeToContentChanges,
  getMergedQuestionsMap,
  getCMSVersionHistory,
  recordCMSVersionSnapshot,
  revertToCMSVersion,
  deleteCMSVersionEntry,
  clearCMSVersionHistory,
  CMSVersionEntry,
  CMSContentType
} from '../lib/contentManager';
import {
  BookOpen, Edit3, Plus, Trash2, Save, RefreshCw, Download, Upload,
  CheckCircle2, Sparkles, HelpCircle, Layers, FileText, Code, Check, AlertCircle,
  History, GraduationCap, BookMarked, Cpu, MessageSquareCode,
  RotateCcw, Eye, Clock, User, X, Search, Filter, ShieldAlert, ArrowRight, Archive, AlertTriangle, Camera, GitBranch
} from 'lucide-react';

type CmsTab = 'chapters' | 'homework' | 'trivia' | 'examprep' | 'glossary' | 'python_presets' | 'excel_templates' | 'flowcharts';

export const ContentManagerTab: React.FC = () => {
  const [activeCmsTab, setActiveCmsTab] = useState<CmsTab>('chapters');

  // ==========================================
  // 1. CHAPTERS & LEVEL QUESTIONS STATE
  // ==========================================
  const [modules, setModules] = useState<QuestModule[]>(() => getMergedSyllabusModules());
  const [selectedModuleId, setSelectedModuleId] = useState<string>('cloud-services');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('cloud-types');
  const [editingLevel, setEditingLevel] = useState<QuestLevel | null>(null);
  const [keyConceptsList, setKeyConceptsList] = useState<string[]>([]);
  const [levelQuestions, setLevelQuestions] = useState<InteractiveQuestion[]>([]);

  // Modals for Chapters
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [newTopicModuleId, setNewTopicModuleId] = useState<string>('cloud-services');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicSummary, setNewTopicSummary] = useState('');
  const [newTopicBhutanAnalogy, setNewTopicBhutanAnalogy] = useState('');

  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterIcon, setNewChapterIcon] = useState('💻');
  const [newChapterRegion, setNewChapterRegion] = useState('Thimphu TechPark');

  // ==========================================
  // 2. HOMEWORK SHEETS STATE
  // ==========================================
  const [homeworkSheets, setHomeworkSheets] = useState<HomeworkSheet[]>(() => getMergedHomeworkSheets());
  const [selectedSheetId, setSelectedSheetId] = useState<string>(() => getMergedHomeworkSheets()[0]?.id || 'sheet-1');
  const [editingSheet, setEditingSheet] = useState<HomeworkSheet | null>(null);

  // ==========================================
  // 3. TRIVIA QUESTIONS STATE
  // ==========================================
  const [triviaQuestions, setTriviaQuestions] = useState<TriviaQuestion[]>(() => getMergedTriviaQuestions());
  const [selectedTriviaCategory, setSelectedTriviaCategory] = useState<string>('All');
  const [selectedTriviaId, setSelectedTriviaId] = useState<number | string>(() => getMergedTriviaQuestions()[0]?.id || 1);

  // ==========================================
  // 4. EXAM PREP & TRACING STATE
  // ==========================================
  const [examSubTab, setExamSubTab] = useState<'mcq' | 'tracing'>('mcq');
  const [examQuestions, setExamQuestions] = useState<ExamPrepQuestion[]>(() => getMergedExamQuestions());
  const [selectedExamQId, setSelectedExamQId] = useState<number | string>(() => getMergedExamQuestions()[0]?.id || 1);

  const [tracingProblems, setTracingProblems] = useState<TracingProblem[]>(() => getMergedTracingProblems());
  const [selectedTracingId, setSelectedTracingId] = useState<string>(() => getMergedTracingProblems()[0]?.id || 'trace-1');

  // ==========================================
  // 5. ICT GLOSSARY STATE
  // ==========================================
  const [glossaryTerms, setGlossaryTerms] = useState<ICTGlossaryTerm[]>(() => getMergedGlossaryTerms());
  const [selectedGlossaryCategory, setSelectedGlossaryCategory] = useState<string>('All');
  const [selectedGlossaryTermId, setSelectedGlossaryTermId] = useState<string>(() => getMergedGlossaryTerms()[0]?.id || 'cloud-computing');
  const [glossarySearch, setGlossarySearch] = useState<string>('');

  // ==========================================
  // 7. PYTHON IDE PRESETS STATE
  // ==========================================
  const [pythonPresets, setPythonPresets] = useState<PythonPreset[]>(() => getMergedPythonPresets());
  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => getMergedPythonPresets()[0]?.id || 'preset-cypress');

  // ==========================================
  // 8. EXCEL LAB TEMPLATES STATE
  // ==========================================
  const [excelTemplates, setExcelTemplates] = useState<ExcelTemplate[]>(() => getMergedExcelTemplates());
  const [selectedExcelTemplateId, setSelectedExcelTemplateId] = useState<string>(() => getMergedExcelTemplates()[0]?.id || 'stationery');

  // ==========================================
  // 9. FLOWCHART LAB TEMPLATES STATE
  // ==========================================
  const [flowcharts, setFlowcharts] = useState<FlowchartTemplate[]>(() => getMergedFlowcharts());
  const [selectedFlowchartId, setSelectedFlowchartId] = useState<string>(() => getMergedFlowcharts()[0]?.id || 'bhutan_voting');

  // ==========================================
  // 6. VERSION HISTORY ENGINE STATE
  // ==========================================
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<CMSContentType | 'all'>('all');
  const [historySearch, setHistorySearch] = useState('');
  const [previewVersion, setPreviewVersion] = useState<CMSVersionEntry | null>(null);
  const [showRevertConfirmModal, setShowRevertConfirmModal] = useState(false);
  const [targetRevertVersion, setTargetRevertVersion] = useState<CMSVersionEntry | null>(null);

  const [showManualSnapshotModal, setShowManualSnapshotModal] = useState(false);
  const [manualSnapshotNote, setManualSnapshotNote] = useState('');

  // Status feedback banners
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const triggerSaveBanner = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 3500);
  };

  const handleConfirmRevert = (version: CMSVersionEntry) => {
    const result = revertToCMSVersion(version.id);
    if (result.success) {
      triggerSaveBanner(`Restored content version: "${result.label}"! Auto-backup created.`);
      setShowRevertConfirmModal(false);
      setTargetRevertVersion(null);
      setPreviewVersion(null);

      // Force refresh of state
      setModules(getMergedSyllabusModules());
      setHomeworkSheets(getMergedHomeworkSheets());
      setTriviaQuestions(getMergedTriviaQuestions());
      setExamQuestions(getMergedExamQuestions());
      setTracingProblems(getMergedTracingProblems());
      setGlossaryTerms(getMergedGlossaryTerms());
      setPythonPresets(getMergedPythonPresets());
      setExcelTemplates(getMergedExcelTemplates());
      if (selectedLevelId) {
        const reloaded = getMergedQuestionsForLevel(selectedLevelId, undefined, false);
        setLevelQuestions(reloaded);
      }
    } else {
      alert(`Revert failed: ${result.label}`);
    }
  };

  const handleCreateManualSnapshot = () => {
    if (!manualSnapshotNote.trim()) {
      alert('Please enter a note for this version snapshot.');
      return;
    }
    let currentData: any = null;
    let targetType: CMSContentType = 'syllabus';

    if (activeCmsTab === 'chapters') {
      currentData = modules;
      targetType = 'syllabus';
    } else if (activeCmsTab === 'homework') {
      currentData = homeworkSheets;
      targetType = 'homework';
    } else if (activeCmsTab === 'trivia') {
      currentData = triviaQuestions;
      targetType = 'trivia';
    } else if (activeCmsTab === 'examprep') {
      currentData = examSubTab === 'mcq' ? examQuestions : tracingProblems;
      targetType = examSubTab === 'mcq' ? 'examprep' : 'tracing';
    } else if (activeCmsTab === 'glossary') {
      currentData = glossaryTerms;
      targetType = 'glossary';
    } else if (activeCmsTab === 'python_presets') {
      currentData = pythonPresets;
      targetType = 'python_presets';
    } else if (activeCmsTab === 'excel_templates') {
      currentData = excelTemplates;
      targetType = 'excel_templates';
    } else if (activeCmsTab === 'flowcharts') {
      currentData = flowcharts;
      targetType = 'flowcharts';
    }

    recordCMSVersionSnapshot(targetType, manualSnapshotNote.trim(), currentData, 'Teacher (Manual Snapshot)');
    triggerSaveBanner(`Manual version snapshot created: "${manualSnapshotNote.trim()}"`);
    setManualSnapshotNote('');
    setShowManualSnapshotModal(false);
  };

  // Live subscription for external changes
  useEffect(() => {
    const unsub = subscribeToContentChanges(() => {
      setModules(getMergedSyllabusModules());
      setHomeworkSheets(getMergedHomeworkSheets());
      setTriviaQuestions(getMergedTriviaQuestions());
      setExamQuestions(getMergedExamQuestions());
      setTracingProblems(getMergedTracingProblems());
      setGlossaryTerms(getMergedGlossaryTerms());
      setPythonPresets(getMergedPythonPresets());
      setExcelTemplates(getMergedExcelTemplates());
      setFlowcharts(getMergedFlowcharts());
    });
    return () => unsub();
  }, []);

  // Sync Level Selection
  useEffect(() => {
    const activeModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
    if (activeModule) {
      const activeLevel = activeModule.levels.find((l) => l.id === selectedLevelId) || activeModule.levels[0];
      if (activeLevel) {
        setEditingLevel({ ...activeLevel });
        setKeyConceptsList([...activeLevel.keyConcepts]);
        setSelectedLevelId(activeLevel.id);
      }
    }
  }, [selectedModuleId, selectedLevelId, modules]);

  // Sync Level Practice Questions
  useEffect(() => {
    if (selectedLevelId) {
      const loaded = getMergedQuestionsForLevel(selectedLevelId, editingLevel || undefined, false);
      setLevelQuestions(loaded ? [...loaded] : []);
    }
  }, [selectedLevelId]);

  // Sync Homework Sheet Selection
  useEffect(() => {
    const current = homeworkSheets.find((s) => s.id === selectedSheetId) || homeworkSheets[0];
    if (current) {
      setEditingSheet(JSON.parse(JSON.stringify(current)));
    }
  }, [selectedSheetId, homeworkSheets]);

  // ==========================================
  // HANDLERS: 1. CHAPTERS & LEVEL QUESTIONS
  // ==========================================
  const handleSaveTopic = () => {
    if (!editingLevel) return;
    const activeModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
    if (!activeModule) return;

    const updatedLevels = activeModule.levels.map((lvl) => {
      if (lvl.id === editingLevel.id) {
        return {
          ...editingLevel,
          keyConcepts: keyConceptsList.filter((k) => k.trim() !== '')
        };
      }
      return lvl;
    });

    const updatedModules = modules.map((m) => {
      if (m.id === activeModule.id) {
        return { ...m, levels: updatedLevels };
      }
      return m;
    });

    setModules(updatedModules);
    saveSyllabusModules(updatedModules);
    triggerSaveBanner('Topic details and key concepts saved successfully!');
  };

  const handleSaveLevelQuestions = () => {
    if (!selectedLevelId) return;
    saveQuestionsForLevel(selectedLevelId, levelQuestions);
    triggerSaveBanner('Level practice MCQs saved successfully!');
  };

  const handleAddLevelQuestion = () => {
    const newQ: InteractiveQuestion = {
      id: `${selectedLevelId}-q${Date.now()}`,
      question: 'Enter question text here...',
      type: 'multiple-choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'Explanation for why Option A is correct.'
    };
    setLevelQuestions([...levelQuestions, newQ]);
  };

  const handleDeleteLevelQuestion = (id: string) => {
    setLevelQuestions(levelQuestions.filter((q) => q.id !== id));
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;

    const targetMod = modules.find((m) => m.id === newTopicModuleId) || modules[0];
    if (!targetMod) return;

    const newLevelId = `${targetMod.id}-level-${targetMod.levels.length + 1}-${Date.now().toString().slice(-4)}`;
    const newLvl: QuestLevel = {
      id: newLevelId,
      levelNumber: targetMod.levels.length + 1,
      title: newTopicTitle.trim(),
      pageNo: 1,
      summary: newTopicSummary.trim() || 'Summary of the new topic.',
      keyConcepts: ['Key concept 1', 'Key concept 2'],
      bhutanAnalogy: newTopicBhutanAnalogy.trim() || 'Local Bhutanese context example.',
      exerciseQuestion: 'What is the primary application of this concept?',
      xpReward: 50
    };

    const updatedMods = modules.map((m) => {
      if (m.id === targetMod.id) {
        return { ...m, levels: [...m.levels, newLvl] };
      }
      return m;
    });

    setModules(updatedMods);
    saveSyllabusModules(updatedMods);
    setSelectedModuleId(targetMod.id);
    setSelectedLevelId(newLevelId);
    setShowAddTopicModal(false);
    setNewTopicTitle('');
    setNewTopicSummary('');
    setNewTopicBhutanAnalogy('');
    triggerSaveBanner('New Topic created successfully!');
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    const newModId = `chapter-${modules.length + 1}-${Date.now().toString().slice(-4)}`;
    const firstLevelId = `${newModId}-level-1`;

    const newMod: QuestModule = {
      id: newModId,
      chapterNumber: modules.length + 1,
      title: newChapterTitle.trim(),
      icon: newChapterIcon || '💻',
      description: `Guide to ${newChapterTitle.trim()}.`,
      bhutanRegion: newChapterRegion.trim() || 'Thimphu TechPark',
      levels: [
        {
          id: firstLevelId,
          levelNumber: 1,
          title: `Intro to ${newChapterTitle.trim()}`,
          pageNo: 1,
          summary: `Overview of ${newChapterTitle.trim()}.`,
          keyConcepts: ['Key concept 1', 'Key concept 2'],
          bhutanAnalogy: 'Local Bhutanese example.',
          exerciseQuestion: 'What is the main takeaway?',
          xpReward: 50
        }
      ]
    };

    const updatedMods = [...modules, newMod];
    setModules(updatedMods);
    saveSyllabusModules(updatedMods);
    setSelectedModuleId(newModId);
    setSelectedLevelId(firstLevelId);
    setShowAddChapterModal(false);
    setNewChapterTitle('');
    triggerSaveBanner('New Chapter created successfully!');
  };

  // ==========================================
  // HANDLERS: 2. HOMEWORK SHEETS
  // ==========================================
  const handleSaveHomeworkSheet = () => {
    if (!editingSheet) return;
    const updated = homeworkSheets.map((s) => (s.id === editingSheet.id ? editingSheet : s));
    setHomeworkSheets(updated);
    saveHomeworkSheets(updated);
    triggerSaveBanner(`Homework Sheet "${editingSheet.title}" saved successfully!`);
  };

  const handleAddHomeworkQuestion = () => {
    if (!editingSheet) return;
    const newQ: HomeworkQuestion = {
      id: `hwq-${Date.now()}`,
      question: 'Enter new homework task or question...',
      type: 'multiple-choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'Step-by-step solution breakdown.',
      points: 10
    };

    setEditingSheet({
      ...editingSheet,
      questions: [...editingSheet.questions, newQ]
    });
  };

  const handleDeleteHomeworkQuestion = (qId: string) => {
    if (!editingSheet) return;
    setEditingSheet({
      ...editingSheet,
      questions: editingSheet.questions.filter((q) => q.id !== qId)
    });
  };

  const handleAddHomeworkSheet = () => {
    const newId = `sheet-${homeworkSheets.length + 1}-${Date.now().toString().slice(-4)}`;
    const newSheet: HomeworkSheet = {
      id: newId,
      title: 'New Custom Homework Sheet',
      description: 'Practice tasks for Class 10 ICT students.',
      difficulty: 'Intermediate',
      estimatedMinutes: 10,
      xpReward: 100,
      questions: [
        {
          id: `hwq-init-${Date.now()}`,
          question: 'What is the function of print() in Python?',
          type: 'multiple-choice',
          options: ['Outputs text to console', 'Calculates square root', 'Saves file', 'Deletes variable'],
          correctAnswer: 0,
          explanation: 'print() displays the given arguments to standard output.',
          points: 10
        }
      ]
    };

    const updated = [...homeworkSheets, newSheet];
    setHomeworkSheets(updated);
    saveHomeworkSheets(updated);
    setSelectedSheetId(newId);
    triggerSaveBanner('New Homework Sheet added!');
  };

  // ==========================================
  // HANDLERS: 3. BHUTAN TECH TRIVIA
  // ==========================================
  const handleSaveTriviaQuestions = () => {
    saveTriviaQuestions(triviaQuestions);
    triggerSaveBanner('Bhutan Tech History Trivia questions saved successfully!');
  };

  const handleAddTriviaQuestion = () => {
    const newId = Date.now();
    const newQ: TriviaQuestion = {
      id: newId,
      category: 'Pioneer Era',
      yearMilestone: '2025',
      question: 'Enter new Bhutan Tech Trivia question...',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'Historical context explanation.',
      culturalContext: 'Significance for Bhutanese citizens.'
    };
    const updated = [...triviaQuestions, newQ];
    setTriviaQuestions(updated);
    setSelectedTriviaId(newId);
  };

  const handleDeleteTriviaQuestion = (id: number | string) => {
    const updated = triviaQuestions.filter((q) => q.id !== id);
    setTriviaQuestions(updated);
    if (selectedTriviaId === id && updated[0]) {
      setSelectedTriviaId(updated[0].id);
    }
  };

  // ==========================================
  // HANDLERS: 4. EXAM PREP & TRACING
  // ==========================================
  const handleSaveExamQuestions = () => {
    saveExamQuestions(examQuestions);
    triggerSaveBanner('BCSEA Mock Exam Questions saved successfully!');
  };

  const handleAddExamQuestion = () => {
    const newId = Date.now();
    const newQ: ExamPrepQuestion = {
      id: newId,
      chapter: 'Python Programming',
      question: 'Enter BCSEA mock exam question text...',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0,
      explanation: 'Detailed answer explanation for students.'
    };
    const updated = [...examQuestions, newQ];
    setExamQuestions(updated);
    setSelectedExamQId(newId);
  };

  const handleDeleteExamQuestion = (id: number | string) => {
    const updated = examQuestions.filter((q) => q.id !== id);
    setExamQuestions(updated);
    if (selectedExamQId === id && updated[0]) {
      setSelectedExamQId(updated[0].id);
    }
  };

  const handleSaveTracingProblems = () => {
    saveTracingProblems(tracingProblems);
    triggerSaveBanner('Code Tracing Dry-Run problems saved successfully!');
  };

  const handleAddTracingProblem = () => {
    const newId = `trace-${Date.now().toString().slice(-4)}`;
    const newProblem: TracingProblem = {
      id: newId,
      title: 'New Code Tracing Problem',
      code: ['x = 0', 'for i in range(3):', '    x = x + i', 'print(x)'],
      description: 'Trace variable x across loop iterations.',
      expectedTable: [
        { step: 1, iVal: '0', varState: 'x = 0', condition: '0 < 3 (True)', output: '-' },
        { step: 2, iVal: '1', varState: 'x = 1', condition: '1 < 3 (True)', output: '-' },
        { step: 3, iVal: '2', varState: 'x = 3', condition: '2 < 3 (True)', output: '3' }
      ],
      explanation: 'Loop iterates i = 0, 1, 2. Final x value printed is 3.'
    };
    const updated = [...tracingProblems, newProblem];
    setTracingProblems(updated);
    setSelectedTracingId(newId);
  };

  const handleDeleteTracingProblem = (id: string) => {
    const updated = tracingProblems.filter((p) => p.id !== id);
    setTracingProblems(updated);
    if (selectedTracingId === id && updated[0]) {
      setSelectedTracingId(updated[0].id);
    }
  };

  // ==========================================
  // HANDLERS: 5. ICT GLOSSARY
  // ==========================================
  const handleSaveGlossaryTerms = () => {
    saveGlossaryTerms(glossaryTerms);
    triggerSaveBanner('ICT Glossary Dictionary terms saved successfully!');
  };

  const handleAddGlossaryTerm = () => {
    const newId = `term-${Date.now().toString().slice(-4)}`;
    const newTerm: ICTGlossaryTerm = {
      id: newId,
      term: 'New ICT Term',
      category: 'Python',
      dzongkha: 'གསར་པ།',
      phonetic: 'Sarpa',
      simplifiedDefinition: 'Clear plain english definition of the ICT concept.',
      bhutanContext: 'Relatable everyday Bhutanese analogy.',
      exampleCode: '# Example code snippet\n',
      keywords: ['python', 'concept']
    };
    const updated = [newTerm, ...glossaryTerms];
    setGlossaryTerms(updated);
    setSelectedGlossaryTermId(newId);
  };

  const handleDeleteGlossaryTerm = (id: string) => {
    const updated = glossaryTerms.filter((t) => t.id !== id);
    setGlossaryTerms(updated);
    if (selectedGlossaryTermId === id && updated[0]) {
      setSelectedGlossaryTermId(updated[0].id);
    }
  };

  // ==========================================
  // GLOBAL BACKUP EXPORT / IMPORT / RESET
  // ==========================================
  const handleExportFullBackup = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      modules,
      questionsMap: getMergedQuestionsMap(),
      homeworkSheets,
      triviaQuestions,
      examQuestions,
      tracingProblems,
      glossaryTerms
    };
    const jsonStr = JSON.stringify(fullBackup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guna_ict_full_curriculum_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFullBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.modules && Array.isArray(parsed.modules)) {
          setModules(parsed.modules);
          saveSyllabusModules(parsed.modules);
        }
        if (parsed.homeworkSheets && Array.isArray(parsed.homeworkSheets)) {
          setHomeworkSheets(parsed.homeworkSheets);
          saveHomeworkSheets(parsed.homeworkSheets);
        }
        if (parsed.triviaQuestions && Array.isArray(parsed.triviaQuestions)) {
          setTriviaQuestions(parsed.triviaQuestions);
          saveTriviaQuestions(parsed.triviaQuestions);
        }
        if (parsed.examQuestions && Array.isArray(parsed.examQuestions)) {
          setExamQuestions(parsed.examQuestions);
          saveExamQuestions(parsed.examQuestions);
        }
        if (parsed.tracingProblems && Array.isArray(parsed.tracingProblems)) {
          setTracingProblems(parsed.tracingProblems);
          saveTracingProblems(parsed.tracingProblems);
        }
        if (parsed.glossaryTerms && Array.isArray(parsed.glossaryTerms)) {
          setGlossaryTerms(parsed.glossaryTerms);
          saveGlossaryTerms(parsed.glossaryTerms);
        }
        triggerSaveBanner('Full Backup imported and applied successfully!');
      } catch (err) {
        alert('Failed to parse JSON backup file. Please check file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetAllToDefaults = () => {
    if (
      window.confirm(
        'Are you sure you want to reset ALL platform content (Chapters, MCQs, Homework, Trivia, Exam Prep, Glossary) back to default textbook content? All custom edits will be reverted.'
      )
    ) {
      resetSyllabusModulesToDefault();
      resetQuestionsToDefault();
      resetHomeworkSheetsToDefault();
      resetTriviaQuestionsToDefault();
      resetExamPrepToDefault();
      resetGlossaryTermsToDefault();

      setModules(getMergedSyllabusModules());
      setHomeworkSheets(getMergedHomeworkSheets());
      setTriviaQuestions(getMergedTriviaQuestions());
      setExamQuestions(getMergedExamQuestions());
      setTracingProblems(getMergedTracingProblems());
      setGlossaryTerms(getMergedGlossaryTerms());

      triggerSaveBanner('Reverted ALL content back to default textbook standards.');
    }
  };

  const currentTriviaQ = triviaQuestions.find((q) => q.id === selectedTriviaId) || triviaQuestions[0];
  const currentExamQ = examQuestions.find((q) => q.id === selectedExamQId) || examQuestions[0];
  const currentTracingProblem = tracingProblems.find((p) => p.id === selectedTracingId) || tracingProblems[0];
  const currentGlossaryTerm = glossaryTerms.find((t) => t.id === selectedGlossaryTermId) || glossaryTerms[0];

  return (
    <div className="space-y-6">
      {/* Save Notification Banner */}
      {saveBanner && (
        <div className="p-4 bg-emerald-600 text-white font-black text-sm rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-yellow-300" />
            <span>{saveBanner}</span>
          </div>
          <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded uppercase">Saved to Local & Cloud</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-[#6D071A] to-amber-900 border-4 border-[#1A1A1A] rounded-3xl text-white shadow-[6px_6px_0px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFCC33] text-[#1A1A1A] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-[#1A1A1A]">
              <Edit3 className="w-3.5 h-3.5" /> Full-Platform Content CMS
            </span>
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
              Class 10 ICT Teacher Suite
            </span>
          </div>
          <h2 className="text-2xl font-black font-serif text-yellow-300 mt-1">
            ✏️ Platform Content & Curriculum CMS
          </h2>
          <p className="text-xs text-amber-200/90 font-medium max-w-2xl mt-1">
            Manage, edit, add, or update content across all menus in Guna ICT Quest: Syllabus Chapters, Homework Sheets, Tech History Trivia, BCSEA Exam Prep, and ICT Glossary terms.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-3 py-2 bg-[#FFCC33] text-[#1A1A1A] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] hover:bg-yellow-400 cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#1A1A1A]"
          >
            <History className="w-4 h-4 text-[#6D071A]" /> Version History ({getCMSVersionHistory('all').length})
          </button>

          <button
            onClick={() => setShowManualSnapshotModal(true)}
            className="px-3 py-2 bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-emerald-900 hover:bg-emerald-600 cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#1A1A1A]"
          >
            <Camera className="w-4 h-4 text-yellow-300" /> Save Snapshot
          </button>

          <button
            onClick={handleExportFullBackup}
            className="px-3 py-2 bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-slate-700 hover:bg-slate-700 cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#1A1A1A]"
          >
            <Download className="w-4 h-4 text-amber-300" /> Export Backup
          </button>

          <label className="px-3 py-2 bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-slate-700 hover:bg-slate-700 cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#1A1A1A]">
            <Upload className="w-4 h-4 text-emerald-400" /> Import JSON
            <input type="file" accept=".json" onChange={handleImportFullBackup} className="hidden" />
          </label>

          <button
            onClick={handleResetAllToDefaults}
            className="px-3 py-2 bg-rose-900/80 text-rose-200 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-rose-800 hover:bg-rose-800 cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#1A1A1A]"
          >
            <RefreshCw className="w-4 h-4" /> Reset All Defaults
          </button>
        </div>
      </div>

      {/* Main CMS Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-4 border-[#1A1A1A] pb-3">
        <button
          onClick={() => setActiveCmsTab('chapters')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] flex items-center gap-2 cursor-pointer transition-all ${
            activeCmsTab === 'chapters'
              ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] scale-105'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-amber-50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#6D071A]" /> 1. Chapters & Level MCQs
        </button>

        <button
          onClick={() => setActiveCmsTab('homework')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] flex items-center gap-2 cursor-pointer transition-all ${
            activeCmsTab === 'homework'
              ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] scale-105'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-amber-50'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" /> 2. Homework Sheets ({homeworkSheets.length})
        </button>

        <button
          onClick={() => setActiveCmsTab('trivia')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] flex items-center gap-2 cursor-pointer transition-all ${
            activeCmsTab === 'trivia'
              ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] scale-105'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-amber-50'
          }`}
        >
          <History className="w-4 h-4 text-amber-600" /> 3. Bhutan Tech Trivia ({triviaQuestions.length})
        </button>

        <button
          onClick={() => setActiveCmsTab('examprep')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] flex items-center gap-2 cursor-pointer transition-all ${
            activeCmsTab === 'examprep'
              ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] scale-105'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-amber-50'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-purple-600" /> 4. BCSEA Exam Prep & Tracing
        </button>

        <button
          onClick={() => setActiveCmsTab('glossary')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] flex items-center gap-2 cursor-pointer transition-all ${
            activeCmsTab === 'glossary'
              ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] scale-105'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-amber-50'
          }`}
        >
          <BookMarked className="w-4 h-4 text-emerald-600" /> 5. ICT Glossary Terms ({glossaryTerms.length})
        </button>

        <button
          onClick={() => setActiveCmsTab('python_presets')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] flex items-center gap-2 cursor-pointer transition-all ${
            activeCmsTab === 'python_presets'
              ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] scale-105'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-amber-50'
          }`}
        >
          <Code className="w-4 h-4 text-rose-600" /> 6. Python Presets ({pythonPresets.length})
        </button>

        <button
          onClick={() => setActiveCmsTab('excel_templates')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] flex items-center gap-2 cursor-pointer transition-all ${
            activeCmsTab === 'excel_templates'
              ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] scale-105'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-amber-50'
          }`}
        >
          <Layers className="w-4 h-4 text-[#6D071A]" /> 7. Excel Templates ({excelTemplates.length})
        </button>

        <button
          onClick={() => setActiveCmsTab('flowcharts')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] flex items-center gap-2 cursor-pointer transition-all ${
            activeCmsTab === 'flowcharts'
              ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] scale-105'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-amber-50'
          }`}
        >
          <GitBranch className="w-4 h-4 text-amber-600" /> 8. Flowcharts ({flowcharts.length})
        </button>
      </div>

      {/* ========================================== */}
      {/* SUB-TAB 1: CHAPTERS & LEVEL PRACTICE MCQS */}
      {/* ========================================== */}
      {activeCmsTab === 'chapters' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-amber-50 dark:bg-slate-800 p-4 rounded-2xl border-2 border-[#1A1A1A]">
            <div className="text-xs font-bold text-gray-700 dark:text-slate-300">
              Editing Class 10 Syllabus Chapters, Topic Summaries & Level Practice Questions (Quest Trail).
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddTopicModal(true)}
                className="px-3 py-1.5 bg-[#FFCC33] text-[#1A1A1A] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Topic
              </button>
              <button
                onClick={() => setShowAddChapterModal(true)}
                className="px-3 py-1.5 bg-amber-200 text-[#1A1A1A] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] cursor-pointer flex items-center gap-1"
              >
                <Layers className="w-4 h-4" /> Add Chapter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Selection */}
            <div className="lg:col-span-4 bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-5 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
              <h3 className="text-sm font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2 border-b-2 border-amber-200 pb-2">
                <BookOpen className="w-4 h-4" /> Select Chapter & Topic
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-gray-700 dark:text-slate-300">Chapter / Unit:</label>
                <select
                  value={selectedModuleId}
                  onChange={(e) => {
                    const modId = e.target.value;
                    setSelectedModuleId(modId);
                    const targetMod = modules.find((m) => m.id === modId);
                    if (targetMod && targetMod.levels[0]) {
                      setSelectedLevelId(targetMod.levels[0].id);
                    }
                  }}
                  className="w-full bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-white p-2.5 rounded-xl border-2 border-[#1A1A1A] font-extrabold text-xs"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      Chapter {m.chapterNumber}: {m.title} ({m.levels.length} Topics)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-gray-700 dark:text-slate-300">Topic / Level:</label>
                <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                  {modules
                    .find((m) => m.id === selectedModuleId)
                    ?.levels.map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => setSelectedLevelId(lvl.id)}
                        className={`w-full text-left p-3 rounded-2xl border-2 border-[#1A1A1A] text-xs font-black flex items-center justify-between cursor-pointer transition-all ${
                          selectedLevelId === lvl.id
                            ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                            : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-amber-50'
                        }`}
                      >
                        <span className="truncate">
                          L{lvl.levelNumber}. {lvl.title}
                        </span>
                        <span className="text-[10px] bg-[#6D071A] text-white px-2 py-0.5 rounded-full uppercase">
                          Pg {lvl.pageNo}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Right Editor */}
            <div className="lg:col-span-8 space-y-6">
              {editingLevel && (
                <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-6 space-y-5 shadow-[6px_6px_0px_0px_#1A1A1A]">
                  <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3">
                    <h3 className="text-base font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                      <Edit3 className="w-5 h-5" /> Topic Content Editor: {editingLevel.title}
                    </h3>
                    <button
                      onClick={handleSaveTopic}
                      className="px-4 py-2 bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:bg-emerald-500 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" /> Save Topic Content
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Topic Title:</label>
                      <input
                        type="text"
                        value={editingLevel.title}
                        onChange={(e) => setEditingLevel({ ...editingLevel, title: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Textbook Page Number:</label>
                      <input
                        type="number"
                        value={editingLevel.pageNo}
                        onChange={(e) => setEditingLevel({ ...editingLevel, pageNo: Number(e.target.value) || 1 })}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Status:</label>
                      <select
                        value={editingLevel.status || 'published'}
                        onChange={(e) => setEditingLevel({ ...editingLevel, status: e.target.value as 'published' | 'draft' })}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      >
                        <option value="published">🟢 Published</option>
                        <option value="draft">🟡 Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <CMSMarkdownEditor
                      label="Topic Summary"
                      value={editingLevel.summary}
                      onChange={(val) => setEditingLevel({ ...editingLevel, summary: val })}
                      rows={3}
                      helpText="Supports rich text, bold/italic, bullet points, and line breaks."
                      onSave={handleSaveTopic}
                    />
                  </div>

                  <div className="space-y-1">
                    <CMSMarkdownEditor
                      label="Bhutanese Analogy / Real-World Context"
                      value={editingLevel.bhutanAnalogy}
                      onChange={(val) => setEditingLevel({ ...editingLevel, bhutanAnalogy: val })}
                      rows={2}
                      helpText="Contextualizes technical concepts with Bhutanese cultural examples."
                      onSave={handleSaveTopic}
                    />
                  </div>

                  <div className="space-y-1">
                    <CMSMarkdownEditor
                      label="Sample Code / Formula"
                      value={editingLevel.sampleCodeOrFormula || ''}
                      onChange={(val) => setEditingLevel({ ...editingLevel, sampleCodeOrFormula: val })}
                      rows={3}
                      helpText="Preserves Python indentation, tabs, and line breaks for code snippets."
                      onSave={handleSaveTopic}
                    />
                  </div>

                  <div className="space-y-1">
                    <CMSMarkdownEditor
                      label="Exercise / Interactive Question"
                      value={editingLevel.exerciseQuestion || ''}
                      onChange={(val) => setEditingLevel({ ...editingLevel, exerciseQuestion: val })}
                      rows={2}
                      helpText="Interactive question or prompt presented to students in this level."
                      onSave={handleSaveTopic}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Core Syllabus Concepts:</label>
                      <button
                        onClick={() => setKeyConceptsList([...keyConceptsList, 'New concept point'])}
                        className="text-[11px] font-black text-[#6D071A] dark:text-yellow-400 underline cursor-pointer"
                      >
                        + Add Bullet Point
                      </button>
                    </div>
                    {keyConceptsList.map((kc, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={kc}
                          onChange={(e) => {
                            const updated = [...keyConceptsList];
                            updated[idx] = e.target.value;
                            setKeyConceptsList(updated);
                          }}
                          className="flex-1 bg-white dark:bg-slate-800 p-2 rounded-xl border-2 border-[#1A1A1A] font-medium text-xs"
                        />
                        <button
                          onClick={() => setKeyConceptsList(keyConceptsList.filter((_, i) => i !== idx))}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Level MCQs Section */}
                  <div className="pt-6 border-t-2 border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" /> Level MCQs ({levelQuestions.length})
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddLevelQuestion}
                          className="px-3 py-1.5 bg-[#FFCC33] text-[#1A1A1A] text-xs font-black uppercase rounded-xl border-2 border-[#1A1A1A] cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Question
                        </button>
                        <button
                          onClick={handleSaveLevelQuestions}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-black uppercase rounded-xl border-2 border-[#1A1A1A] cursor-pointer flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Questions
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {levelQuestions.map((q, qIdx) => (
                        <div key={q.id} className="p-4 bg-white dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-[#6D071A] dark:text-yellow-300">Question #{qIdx + 1}</span>
                            <button
                              onClick={() => handleDeleteLevelQuestion(q.id)}
                              className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>

                          <CMSMarkdownEditor
                            label="Question Prompt (supports code & formatting)"
                            value={q.question}
                            onChange={(val) => {
                              const updated = [...levelQuestions];
                              updated[qIdx].question = val;
                              setLevelQuestions(updated);
                            }}
                            rows={2}
                            onSave={handleSaveLevelQuestions}
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-gray-500">Question Type:</label>
                              <select
                                value={q.type || 'multiple-choice'}
                                onChange={(e) => {
                                  const updated = [...levelQuestions];
                                  const newType = e.target.value as any;
                                  updated[qIdx].type = newType;
                                  // initialize sensible defaults to prevent crashes
                                  if (newType === 'multiple-choice') {
                                    updated[qIdx].options = updated[qIdx].options || ['Option A', 'Option B', 'Option C', 'Option D'];
                                    updated[qIdx].correctAnswer = typeof updated[qIdx].correctAnswer === 'number' ? updated[qIdx].correctAnswer : 0;
                                  } else if (newType === 'fill-in-the-blank') {
                                    updated[qIdx].blankSentence = updated[qIdx].blankSentence || updated[qIdx].question || 'Python uses ______ to output text.';
                                    updated[qIdx].correctAnswer = typeof updated[qIdx].correctAnswer === 'string' ? updated[qIdx].correctAnswer : 'print';
                                  } else if (newType === 'drag-drop') {
                                    updated[qIdx].blankSentence = updated[qIdx].blankSentence || updated[qIdx].question || 'Python is ______ than assembly.';
                                    updated[qIdx].dragOptions = updated[qIdx].dragOptions || ['easier', 'harder', 'same'];
                                    updated[qIdx].correctAnswer = typeof updated[qIdx].correctAnswer === 'string' ? updated[qIdx].correctAnswer : 'easier';
                                  } else if (newType === 'match-following') {
                                    updated[qIdx].leftItems = updated[qIdx].leftItems || ['Concept A', 'Concept B'];
                                    updated[qIdx].rightItems = updated[qIdx].rightItems || ['Definition A', 'Definition B'];
                                    updated[qIdx].correctAnswer = typeof updated[qIdx].correctAnswer === 'object' && updated[qIdx].correctAnswer !== null ? updated[qIdx].correctAnswer : { 'Concept A': 'Definition A', 'Concept B': 'Definition B' };
                                  }
                                  setLevelQuestions(updated);
                                }}
                                className="w-full bg-white dark:bg-slate-900 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                              >
                                <option value="multiple-choice">📝 Multiple Choice</option>
                                <option value="fill-in-the-blank">✏️ Fill in the Blank</option>
                                <option value="drag-drop">🪣 Drag-Drop (Bucket Fill)</option>
                                <option value="match-following">🔗 Match Following</option>
                              </select>
                            </div>
                          </div>

                          {/* Render based on selected Type */}
                          {(q.type === 'multiple-choice' || !q.type) && (
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500">MCQ Options (Check radio for correct answer):</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {(q.options || ['Option A', 'Option B', 'Option C', 'Option D']).map((opt, optIdx) => (
                                  <div key={optIdx} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`correct-${q.id}`}
                                      checked={Number(q.correctAnswer) === optIdx}
                                      onChange={() => {
                                        const updated = [...levelQuestions];
                                        updated[qIdx].correctAnswer = optIdx;
                                        setLevelQuestions(updated);
                                      }}
                                    />
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => {
                                        const updated = [...levelQuestions];
                                        if (!updated[qIdx].options) {
                                          updated[qIdx].options = ['Option A', 'Option B', 'Option C', 'Option D'];
                                        }
                                        updated[qIdx].options[optIdx] = e.target.value;
                                        setLevelQuestions(updated);
                                      }}
                                      className={`flex-1 p-2 rounded-xl border-2 font-medium text-xs ${
                                        Number(q.correctAnswer) === optIdx ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-gray-300 bg-white dark:bg-slate-900'
                                      }`}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {q.type === 'fill-in-the-blank' && (
                            <div className="space-y-3 bg-yellow-50/20 dark:bg-slate-900/40 p-3.5 rounded-2xl border-2 border-dashed border-amber-300">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400">Sentence with blank space (use 6 underscores: ______):</label>
                                <input
                                  type="text"
                                  value={q.blankSentence || ''}
                                  onChange={(e) => {
                                    const updated = [...levelQuestions];
                                    updated[qIdx].blankSentence = e.target.value;
                                    setLevelQuestions(updated);
                                  }}
                                  placeholder="e.g., Python uses the ______ function to output text."
                                  className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-300 font-bold text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400">Correct Answer Word (case-insensitive):</label>
                                <input
                                  type="text"
                                  value={typeof q.correctAnswer === 'string' ? q.correctAnswer : ''}
                                  onChange={(e) => {
                                    const updated = [...levelQuestions];
                                    updated[qIdx].correctAnswer = e.target.value;
                                    setLevelQuestions(updated);
                                  }}
                                  placeholder="e.g., print"
                                  className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border-2 border-emerald-500 font-bold text-xs"
                                />
                              </div>
                            </div>
                          )}

                          {q.type === 'drag-drop' && (
                            <div className="space-y-3 bg-blue-50/20 dark:bg-slate-900/40 p-3.5 rounded-2xl border-2 border-dashed border-blue-300">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-blue-800 dark:text-blue-400">Sentence with blank space (use 6 underscores: ______):</label>
                                <input
                                  type="text"
                                  value={q.blankSentence || ''}
                                  onChange={(e) => {
                                    const updated = [...levelQuestions];
                                    updated[qIdx].blankSentence = e.target.value;
                                    setLevelQuestions(updated);
                                  }}
                                  placeholder="e.g., An ______ loop runs forever if the condition is never false."
                                  className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-300 font-bold text-xs"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-blue-800 dark:text-blue-400">Drag Options / Pill Choices (Click to edit text, click × to delete):</label>
                                <div className="flex flex-wrap gap-2.5 p-3 bg-white dark:bg-slate-900 rounded-2xl border-2 border-gray-200">
                                  {(q.dragOptions || []).map((opt: string, optIdx: number) => (
                                    <div key={optIdx} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFCC33]/15 text-[#1A1A1A] dark:text-yellow-300 rounded-full border-2 border-[#1A1A1A] text-xs font-black shadow-[2px_2px_0px_0px_#1A1A1A] transition-all">
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                          const updated = [...levelQuestions];
                                          const newOpts = [...(updated[qIdx].dragOptions || [])];
                                          newOpts[optIdx] = e.target.value;
                                          updated[qIdx].dragOptions = newOpts;
                                          setLevelQuestions(updated);
                                        }}
                                        className="bg-transparent border-none outline-none text-xs font-black w-24 p-0 focus:ring-0 text-[#1A1A1A] dark:text-yellow-300"
                                        placeholder="Pill text"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [...levelQuestions];
                                          const newOpts = (updated[qIdx].dragOptions || []).filter((_, idx) => idx !== optIdx);
                                          updated[qIdx].dragOptions = newOpts;
                                          if (updated[qIdx].correctAnswer === opt) {
                                            updated[qIdx].correctAnswer = newOpts[0] || '';
                                          }
                                          setLevelQuestions(updated);
                                        }}
                                        className="text-rose-600 hover:text-rose-800 font-black cursor-pointer text-sm ml-0.5"
                                        title="Delete option"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...levelQuestions];
                                      const newOpts = [...(updated[qIdx].dragOptions || []), 'New Option'];
                                      updated[qIdx].dragOptions = newOpts;
                                      setLevelQuestions(updated);
                                    }}
                                    className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border-2 border-dashed border-emerald-500 hover:bg-emerald-500/20 text-xs font-bold cursor-pointer flex items-center gap-1"
                                  >
                                    <span>+ Add Choice</span>
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400">Correct Option matching the blank:</label>
                                <select
                                  value={typeof q.correctAnswer === 'string' ? q.correctAnswer : ''}
                                  onChange={(e) => {
                                    const updated = [...levelQuestions];
                                    updated[qIdx].correctAnswer = e.target.value;
                                    setLevelQuestions(updated);
                                  }}
                                  className="w-full bg-white dark:bg-slate-900 p-2.5 rounded-xl border-2 border-emerald-500 font-bold text-xs"
                                >
                                  <option value="">-- Select Correct Option --</option>
                                  {(q.dragOptions || []).map((opt, oIdx) => (
                                    <option key={oIdx} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}

                          {q.type === 'match-following' && (
                            <div className="space-y-3 bg-purple-50/20 dark:bg-slate-900/40 p-4 rounded-2xl border-2 border-dashed border-purple-300">
                              <div className="flex items-center justify-between border-b border-purple-300/40 pb-2">
                                <span className="text-[11px] font-black uppercase text-purple-800 dark:text-purple-400">Match the Following Pairs (Row-by-Row):</span>
                                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 italic">Matched pairs are defined side-by-side, shuffled for students</span>
                              </div>

                              <div className="space-y-2.5">
                                <div className="grid grid-cols-12 gap-2 text-[10px] font-black uppercase text-purple-700 dark:text-purple-300">
                                  <div className="col-span-5">Term / Concept (Left)</div>
                                  <div className="col-span-1 text-center"></div>
                                  <div className="col-span-5">Matching Definition (Right)</div>
                                  <div className="col-span-1 text-right">Delete</div>
                                </div>

                                {((q.leftItems && q.leftItems.length > 0) ? q.leftItems : ['Concept A', 'Concept B']).map((leftIt: string, liIdx: number) => {
                                  const currentLeftItems = q.leftItems && q.leftItems.length > 0 ? q.leftItems : ['Concept A', 'Concept B'];
                                  const currentRightItems = q.rightItems && q.rightItems.length > 0 ? q.rightItems : ['Definition A', 'Definition B'];
                                  const rightVal = currentRightItems[liIdx] !== undefined ? currentRightItems[liIdx] : '';
                                  return (
                                    <div key={liIdx} className="grid grid-cols-12 gap-2 items-center">
                                      <div className="col-span-5">
                                        <input
                                          type="text"
                                          value={leftIt}
                                          onChange={(e) => {
                                            const updated = [...levelQuestions];
                                            const newLeftItems = [...(updated[qIdx].leftItems && updated[qIdx].leftItems.length > 0 ? updated[qIdx].leftItems : ['Concept A', 'Concept B'])];
                                            const newRightItems = [...(updated[qIdx].rightItems && updated[qIdx].rightItems.length > 0 ? updated[qIdx].rightItems : ['Definition A', 'Definition B'])];

                                            newLeftItems[liIdx] = e.target.value;
                                            updated[qIdx].leftItems = newLeftItems;
                                            updated[qIdx].rightItems = newRightItems;

                                            // Rebuild the correct match map directly so leftItems[idx] matches rightItems[idx]
                                            const currentMap: Record<string, string> = {};
                                            newLeftItems.forEach((leftVal, idx) => {
                                              currentMap[leftVal] = newRightItems[idx] || '';
                                            });
                                            updated[qIdx].correctAnswer = currentMap;

                                            setLevelQuestions(updated);
                                          }}
                                          placeholder="e.g., list"
                                          className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-300 font-bold text-xs text-[#1a1a1a] dark:text-slate-100"
                                        />
                                      </div>

                                      <div className="col-span-1 text-center font-black text-gray-400 text-sm">→</div>

                                      <div className="col-span-5">
                                        <input
                                          type="text"
                                          value={rightVal}
                                          onChange={(e) => {
                                            const updated = [...levelQuestions];
                                            const newLeftItems = [...(updated[qIdx].leftItems && updated[qIdx].leftItems.length > 0 ? updated[qIdx].leftItems : ['Concept A', 'Concept B'])];
                                            const newRightItems = [...(updated[qIdx].rightItems && updated[qIdx].rightItems.length > 0 ? updated[qIdx].rightItems : ['Definition A', 'Definition B'])];

                                            newRightItems[liIdx] = e.target.value;
                                            updated[qIdx].leftItems = newLeftItems;
                                            updated[qIdx].rightItems = newRightItems;

                                            // Rebuild the correct match map directly so leftItems[idx] matches rightItems[idx]
                                            const currentMap: Record<string, string> = {};
                                            newLeftItems.forEach((leftVal, idx) => {
                                              currentMap[leftVal] = newRightItems[idx] || '';
                                            });
                                            updated[qIdx].correctAnswer = currentMap;

                                            setLevelQuestions(updated);
                                          }}
                                          placeholder="e.g., mutable list"
                                          className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-300 font-bold text-xs text-[#1a1a1a] dark:text-slate-100"
                                        />
                                      </div>

                                      <div className="col-span-1 text-right">
                                        <button
                                          type="button"
                                          disabled={currentLeftItems.length <= 2}
                                          onClick={() => {
                                            const updated = [...levelQuestions];
                                            const currentL = updated[qIdx].leftItems && updated[qIdx].leftItems.length > 0 ? updated[qIdx].leftItems : ['Concept A', 'Concept B'];
                                            const currentR = updated[qIdx].rightItems && updated[qIdx].rightItems.length > 0 ? updated[qIdx].rightItems : ['Definition A', 'Definition B'];
                                            
                                            const newLeftItems = currentL.filter((_, idx) => idx !== liIdx);
                                            const newRightItems = currentR.filter((_, idx) => idx !== liIdx);

                                            updated[qIdx].leftItems = newLeftItems;
                                            updated[qIdx].rightItems = newRightItems;

                                            const currentMap: Record<string, string> = {};
                                            newLeftItems.forEach((it, idx) => {
                                              currentMap[it] = newRightItems[idx] || '';
                                            });
                                            updated[qIdx].correctAnswer = currentMap;

                                            setLevelQuestions(updated);
                                          }}
                                          className="p-1 text-rose-600 hover:text-rose-800 disabled:opacity-30 cursor-pointer font-bold text-xs"
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...levelQuestions];
                                  const currentLeftLen = (updated[qIdx].leftItems || []).length;
                                  const newLeftItems = [...(updated[qIdx].leftItems || []), `Concept ${currentLeftLen + 1}`];
                                  const newRightItems = [...(updated[qIdx].rightItems || []), `Definition ${currentLeftLen + 1}`];

                                  updated[qIdx].leftItems = newLeftItems;
                                  updated[qIdx].rightItems = newRightItems;

                                  const currentMap = (updated[qIdx].correctAnswer && typeof updated[qIdx].correctAnswer === 'object') ? { ...updated[qIdx].correctAnswer } : {};
                                  currentMap[newLeftItems[newLeftItems.length - 1]] = newRightItems[newRightItems.length - 1];
                                  updated[qIdx].correctAnswer = currentMap;

                                  setLevelQuestions(updated);
                                }}
                                className="px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl border-2 border-dashed border-purple-500 hover:bg-purple-500/20 text-xs font-black cursor-pointer flex items-center gap-1 mt-2"
                              >
                                <span>+ Add Matching Pair</span>
                              </button>
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500">Explanation for the Correct Answer:</label>
                            <input
                              type="text"
                              placeholder="Explanation..."
                              value={q.explanation || ''}
                              onChange={(e) => {
                                const updated = [...levelQuestions];
                                updated[qIdx].explanation = e.target.value;
                                setLevelQuestions(updated);
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border-2 border-gray-200 text-xs font-medium text-gray-800 dark:text-slate-200"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 2: HOMEWORK & QUEST SHEETS         */}
      {/* ========================================== */}
      {activeCmsTab === 'homework' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Homework List */}
          <div className="lg:col-span-4 bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-5 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2">
              <h3 className="text-sm font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> Homework Sheets
              </h3>
              <button
                onClick={handleAddHomeworkSheet}
                className="px-2.5 py-1 bg-[#FFCC33] text-[#1A1A1A] text-[11px] font-black uppercase rounded-lg border border-[#1A1A1A] cursor-pointer"
              >
                + New Sheet
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {(homeworkSheets || []).map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSheetId(s.id)}
                  className={`w-full text-left p-3 rounded-2xl border-2 border-[#1A1A1A] text-xs font-black flex items-center justify-between cursor-pointer transition-all ${
                    selectedSheetId === s.id
                      ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                      : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-amber-50'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div>
                      Sheet #{idx + 1}: {s.title}
                    </div>
                    <div className="text-[10px] font-semibold text-gray-500 truncate">{s.questions.length} Questions • {s.estimatedMinutes} mins</div>
                  </div>
                  <span className="text-[10px] bg-[#6D071A] text-white px-2 py-0.5 rounded-full uppercase shrink-0">
                    {s.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Sheet Content Editor */}
          <div className="lg:col-span-8 space-y-6">
            {editingSheet && (
              <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-6 space-y-5 shadow-[6px_6px_0px_0px_#1A1A1A]">
                <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3">
                  <h3 className="text-base font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                    <Edit3 className="w-5 h-5" /> Sheet Editor: {editingSheet.title}
                  </h3>
                  <button
                    onClick={handleSaveHomeworkSheet}
                    className="px-4 py-2 bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:bg-emerald-500 cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save Homework Sheet
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Sheet Title:</label>
                    <input
                      type="text"
                      value={editingSheet.title}
                      onChange={(e) => setEditingSheet({ ...editingSheet, title: e.target.value })}
                      className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Difficulty:</label>
                    <select
                      value={editingSheet.difficulty}
                      onChange={(e) => setEditingSheet({ ...editingSheet, difficulty: e.target.value as any })}
                      className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Status:</label>
                    <select
                      value={editingSheet.status || 'published'}
                      onChange={(e) => setEditingSheet({ ...editingSheet, status: e.target.value as 'published' | 'draft' })}
                      className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                    >
                      <option value="published">🟢 Published</option>
                      <option value="draft">🟡 Draft</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Description:</label>
                  <textarea
                    rows={2}
                    value={editingSheet.description}
                    onChange={(e) => setEditingSheet({ ...editingSheet, description: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-medium text-xs"
                  />
                </div>

                {/* Questions list for Homework Sheet */}
                <div className="pt-4 border-t-2 border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider">
                      Sheet Questions ({editingSheet.questions.length})
                    </h4>
                    <button
                      onClick={handleAddHomeworkQuestion}
                      className="px-3 py-1.5 bg-[#FFCC33] text-[#1A1A1A] text-xs font-black uppercase rounded-xl border-2 border-[#1A1A1A] cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Task Question
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {(editingSheet.questions || []).map((hq, hqIdx) => (
                      <div key={hq.id} className="p-4 bg-white dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-[#6D071A] dark:text-yellow-300">Question #{hqIdx + 1}</span>
                          <button
                            onClick={() => handleDeleteHomeworkQuestion(hq.id)}
                            className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-600 dark:text-slate-400">Question Text:</label>
                          <textarea
                            rows={2}
                            value={hq.question}
                            onChange={(e) => {
                              const updatedQs = [...editingSheet.questions];
                              updatedQs[hqIdx].question = e.target.value;
                              setEditingSheet({ ...editingSheet, questions: updatedQs });
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border-2 border-gray-300 font-bold text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500">Question Type:</label>
                            <select
                              value={hq.type || 'multiple-choice'}
                              onChange={(e) => {
                                const updatedQs = [...editingSheet.questions];
                                const newType = e.target.value as any;
                                updatedQs[hqIdx].type = newType;
                                // Set defaults
                                if (newType === 'multiple-choice') {
                                  updatedQs[hqIdx].options = updatedQs[hqIdx].options || ['Option A', 'Option B', 'Option C', 'Option D'];
                                  updatedQs[hqIdx].correctAnswer = typeof updatedQs[hqIdx].correctAnswer === 'number' ? updatedQs[hqIdx].correctAnswer : 0;
                                } else if (newType === 'fill-in-the-blank') {
                                  updatedQs[hqIdx].blankSentence = updatedQs[hqIdx].blankSentence || updatedQs[hqIdx].question || 'Python uses ______ to output text.';
                                  updatedQs[hqIdx].correctAnswer = typeof updatedQs[hqIdx].correctAnswer === 'string' ? updatedQs[hqIdx].correctAnswer : 'print';
                                } else if (newType === 'drag-drop') {
                                  updatedQs[hqIdx].blankSentence = updatedQs[hqIdx].blankSentence || updatedQs[hqIdx].question || 'Python is ______ than assembly.';
                                  updatedQs[hqIdx].dragOptions = updatedQs[hqIdx].dragOptions || ['easier', 'harder', 'same'];
                                  updatedQs[hqIdx].correctAnswer = typeof updatedQs[hqIdx].correctAnswer === 'string' ? updatedQs[hqIdx].correctAnswer : 'easier';
                                } else if (newType === 'match-following') {
                                  updatedQs[hqIdx].leftItems = updatedQs[hqIdx].leftItems || ['Concept A', 'Concept B'];
                                  updatedQs[hqIdx].rightItems = updatedQs[hqIdx].rightItems || ['Definition A', 'Definition B'];
                                  updatedQs[hqIdx].correctAnswer = typeof updatedQs[hqIdx].correctAnswer === 'object' && updatedQs[hqIdx].correctAnswer !== null ? updatedQs[hqIdx].correctAnswer : { 'Concept A': 'Definition A', 'Concept B': 'Definition B' };
                                }
                                setEditingSheet({ ...editingSheet, questions: updatedQs });
                              }}
                              className="w-full bg-white dark:bg-slate-900 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                            >
                              <option value="multiple-choice">📝 Multiple Choice</option>
                              <option value="fill-in-the-blank">✏️ Fill in the Blank</option>
                              <option value="drag-drop">🪣 Drag-Drop (Bucket Fill)</option>
                              <option value="match-following">🔗 Match Following</option>
                            </select>
                          </div>
                        </div>

                        {/* MCQ Options */}
                        {(hq.type === 'multiple-choice' || !hq.type) && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500">MCQ Options (Check radio for correct answer):</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(hq.options || ['Option A', 'Option B', 'Option C', 'Option D']).map((opt, optIdx) => (
                                <div key={optIdx} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`hw-correct-${hq.id}`}
                                    checked={Number(hq.correctAnswer) === optIdx}
                                    onChange={() => {
                                      const updatedQs = [...editingSheet.questions];
                                      updatedQs[hqIdx].correctAnswer = optIdx;
                                      setEditingSheet({ ...editingSheet, questions: updatedQs });
                                    }}
                                  />
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const updatedQs = [...editingSheet.questions];
                                      if (!updatedQs[hqIdx].options) {
                                        updatedQs[hqIdx].options = ['Option A', 'Option B', 'Option C', 'Option D'];
                                      }
                                      updatedQs[hqIdx].options[optIdx] = e.target.value;
                                      setEditingSheet({ ...editingSheet, questions: updatedQs });
                                    }}
                                    className={`flex-1 p-2 rounded-xl border-2 font-medium text-xs ${
                                      Number(hq.correctAnswer) === optIdx ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-gray-300 bg-white dark:bg-slate-900'
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {hq.type === 'fill-in-the-blank' && (
                          <div className="space-y-3 bg-yellow-50/20 dark:bg-slate-900/40 p-3.5 rounded-2xl border-2 border-dashed border-amber-300">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400">Sentence with blank space (use 6 underscores: ______):</label>
                              <input
                                type="text"
                                value={hq.blankSentence || ''}
                                onChange={(e) => {
                                  const updatedQs = [...editingSheet.questions];
                                  updatedQs[hqIdx].blankSentence = e.target.value;
                                  setEditingSheet({ ...editingSheet, questions: updatedQs });
                                }}
                                placeholder="e.g., Python uses the ______ function to output text."
                                className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-300 font-bold text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400">Correct Answer Word (case-insensitive):</label>
                              <input
                                type="text"
                                value={typeof hq.correctAnswer === 'string' ? hq.correctAnswer : ''}
                                onChange={(e) => {
                                  const updatedQs = [...editingSheet.questions];
                                  updatedQs[hqIdx].correctAnswer = e.target.value;
                                  setEditingSheet({ ...editingSheet, questions: updatedQs });
                                }}
                                placeholder="e.g., print"
                                className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border-2 border-emerald-500 font-bold text-xs"
                              />
                            </div>
                          </div>
                        )}

                        {hq.type === 'drag-drop' && (
                          <div className="space-y-4 bg-blue-50/20 dark:bg-slate-900/40 p-4 rounded-2xl border-2 border-dashed border-blue-300">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-blue-800 dark:text-blue-400">Sentence with blank space (use 6 underscores: ______):</label>
                              <input
                                type="text"
                                value={hq.blankSentence || ''}
                                onChange={(e) => {
                                  const updatedQs = [...editingSheet.questions];
                                  updatedQs[hqIdx].blankSentence = e.target.value;
                                  setEditingSheet({ ...editingSheet, questions: updatedQs });
                                }}
                                placeholder="e.g., An ______ loop runs forever if the condition is never false."
                                className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-300 font-bold text-xs text-[#1a1a1a] dark:text-slate-100"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-blue-800 dark:text-blue-400">Drag Options / Pill Choices (Click to edit text, click × to delete):</label>
                              <div className="flex flex-wrap gap-2.5 p-3 bg-white dark:bg-slate-900 rounded-2xl border-2 border-gray-200">
                                {(hq.dragOptions || []).map((opt: string, optIdx: number) => (
                                  <div key={optIdx} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFCC33]/15 text-[#1A1A1A] dark:text-yellow-300 rounded-full border-2 border-[#1A1A1A] text-xs font-black shadow-[2px_2px_0px_0px_#1A1A1A] transition-all">
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => {
                                        const updatedQs = [...editingSheet.questions];
                                        const newOpts = [...(updatedQs[hqIdx].dragOptions || [])];
                                        newOpts[optIdx] = e.target.value;
                                        updatedQs[hqIdx].dragOptions = newOpts;
                                        setEditingSheet({ ...editingSheet, questions: updatedQs });
                                      }}
                                      className="bg-transparent border-none outline-none text-xs font-black w-24 p-0 focus:ring-0 text-[#1A1A1A] dark:text-yellow-300"
                                      placeholder="Pill text"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedQs = [...editingSheet.questions];
                                        const newOpts = (updatedQs[hqIdx].dragOptions || []).filter((_, idx) => idx !== optIdx);
                                        updatedQs[hqIdx].dragOptions = newOpts;
                                        if (updatedQs[hqIdx].correctAnswer === opt) {
                                          updatedQs[hqIdx].correctAnswer = newOpts[0] || '';
                                        }
                                        setEditingSheet({ ...editingSheet, questions: updatedQs });
                                      }}
                                      className="text-rose-600 hover:text-rose-800 font-black cursor-pointer text-sm ml-0.5"
                                      title="Delete option"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedQs = [...editingSheet.questions];
                                    const newOpts = [...(updatedQs[hqIdx].dragOptions || []), 'New Option'];
                                    updatedQs[hqIdx].dragOptions = newOpts;
                                    setEditingSheet({ ...editingSheet, questions: updatedQs });
                                  }}
                                  className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border-2 border-dashed border-emerald-500 hover:bg-emerald-500/20 text-xs font-bold cursor-pointer flex items-center gap-1"
                                >
                                  <span>+ Add Choice</span>
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400">Correct Option matching the blank:</label>
                              <select
                                value={typeof hq.correctAnswer === 'string' ? hq.correctAnswer : ''}
                                onChange={(e) => {
                                  const updatedQs = [...editingSheet.questions];
                                  updatedQs[hqIdx].correctAnswer = e.target.value;
                                  setEditingSheet({ ...editingSheet, questions: updatedQs });
                                }}
                                className="w-full bg-white dark:bg-slate-900 p-2.5 rounded-xl border-2 border-emerald-500 font-bold text-xs"
                              >
                                <option value="">-- Select Correct Option --</option>
                                {(hq.dragOptions || []).map((opt, oIdx) => (
                                  <option key={oIdx} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {hq.type === 'match-following' && (
                          <div className="space-y-3 bg-purple-50/20 dark:bg-slate-900/40 p-4 rounded-2xl border-2 border-dashed border-purple-300">
                            <div className="flex items-center justify-between border-b border-purple-300/40 pb-2">
                              <span className="text-[11px] font-black uppercase text-purple-800 dark:text-purple-400">Match the Following Pairs (Row-by-Row):</span>
                              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 italic">Matched pairs are defined side-by-side, shuffled for students</span>
                            </div>

                            <div className="space-y-2.5">
                              <div className="grid grid-cols-12 gap-2 text-[10px] font-black uppercase text-purple-700 dark:text-purple-300">
                                <div className="col-span-5">Term / Concept (Left)</div>
                                <div className="col-span-1 text-center"></div>
                                <div className="col-span-5">Matching Definition (Right)</div>
                                <div className="col-span-1 text-right">Delete</div>
                              </div>

                              {((hq.leftItems && hq.leftItems.length > 0) ? hq.leftItems : ['Concept A', 'Concept B']).map((leftIt: string, liIdx: number) => {
                                const currentLeftItems = hq.leftItems && hq.leftItems.length > 0 ? hq.leftItems : ['Concept A', 'Concept B'];
                                const currentRightItems = hq.rightItems && hq.rightItems.length > 0 ? hq.rightItems : ['Definition A', 'Definition B'];
                                const rightVal = currentRightItems[liIdx] !== undefined ? currentRightItems[liIdx] : '';
                                return (
                                  <div key={liIdx} className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-5">
                                      <input
                                        type="text"
                                        value={leftIt}
                                        onChange={(e) => {
                                          const updatedQs = [...editingSheet.questions];
                                          const newLeftItems = [...(updatedQs[hqIdx].leftItems && updatedQs[hqIdx].leftItems.length > 0 ? updatedQs[hqIdx].leftItems : ['Concept A', 'Concept B'])];
                                          const newRightItems = [...(updatedQs[hqIdx].rightItems && updatedQs[hqIdx].rightItems.length > 0 ? updatedQs[hqIdx].rightItems : ['Definition A', 'Definition B'])];

                                          newLeftItems[liIdx] = e.target.value;
                                          updatedQs[hqIdx].leftItems = newLeftItems;
                                          updatedQs[hqIdx].rightItems = newRightItems;

                                          // Rebuild correct map side-by-side
                                          const currentMap: Record<string, string> = {};
                                          newLeftItems.forEach((leftVal, idx) => {
                                            currentMap[leftVal] = newRightItems[idx] || '';
                                          });
                                          updatedQs[hqIdx].correctAnswer = currentMap;

                                          setEditingSheet({ ...editingSheet, questions: updatedQs });
                                        }}
                                        placeholder="e.g., list"
                                        className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-300 font-bold text-xs text-[#1a1a1a] dark:text-slate-100"
                                      />
                                    </div>

                                    <div className="col-span-1 text-center font-black text-gray-400 text-sm">→</div>

                                    <div className="col-span-5">
                                      <input
                                        type="text"
                                        value={rightVal}
                                        onChange={(e) => {
                                          const updatedQs = [...editingSheet.questions];
                                          const newLeftItems = [...(updatedQs[hqIdx].leftItems && updatedQs[hqIdx].leftItems.length > 0 ? updatedQs[hqIdx].leftItems : ['Concept A', 'Concept B'])];
                                          const newRightItems = [...(updatedQs[hqIdx].rightItems && updatedQs[hqIdx].rightItems.length > 0 ? updatedQs[hqIdx].rightItems : ['Definition A', 'Definition B'])];

                                          newRightItems[liIdx] = e.target.value;
                                          updatedQs[hqIdx].leftItems = newLeftItems;
                                          updatedQs[hqIdx].rightItems = newRightItems;

                                          // Rebuild correct map side-by-side
                                          const currentMap: Record<string, string> = {};
                                          newLeftItems.forEach((leftVal, idx) => {
                                            currentMap[leftVal] = newRightItems[idx] || '';
                                          });
                                          updatedQs[hqIdx].correctAnswer = currentMap;

                                          setEditingSheet({ ...editingSheet, questions: updatedQs });
                                        }}
                                        placeholder="e.g., mutable list"
                                        className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-300 font-bold text-xs text-[#1a1a1a] dark:text-slate-100"
                                      />
                                    </div>

                                    <div className="col-span-1 text-right">
                                      <button
                                        type="button"
                                        disabled={currentLeftItems.length <= 2}
                                        onClick={() => {
                                          const updatedQs = [...editingSheet.questions];
                                          const currentL = updatedQs[hqIdx].leftItems && updatedQs[hqIdx].leftItems.length > 0 ? updatedQs[hqIdx].leftItems : ['Concept A', 'Concept B'];
                                          const currentR = updatedQs[hqIdx].rightItems && updatedQs[hqIdx].rightItems.length > 0 ? updatedQs[hqIdx].rightItems : ['Definition A', 'Definition B'];

                                          const newLeftItems = currentL.filter((_, idx) => idx !== liIdx);
                                          const newRightItems = currentR.filter((_, idx) => idx !== liIdx);

                                          updatedQs[hqIdx].leftItems = newLeftItems;
                                          updatedQs[hqIdx].rightItems = newRightItems;

                                          const currentMap: Record<string, string> = {};
                                          newLeftItems.forEach((it, idx) => {
                                            currentMap[it] = newRightItems[idx] || '';
                                          });
                                          updatedQs[hqIdx].correctAnswer = currentMap;

                                          setEditingSheet({ ...editingSheet, questions: updatedQs });
                                        }}
                                        className="p-1 text-rose-600 hover:text-rose-800 disabled:opacity-30 cursor-pointer font-bold text-xs"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const updatedQs = [...editingSheet.questions];
                                const currentLeftLen = (updatedQs[hqIdx].leftItems || []).length;
                                const newLeftItems = [...(updatedQs[hqIdx].leftItems || []), `Concept ${currentLeftLen + 1}`];
                                const newRightItems = [...(updatedQs[hqIdx].rightItems || []), `Definition ${currentLeftLen + 1}`];

                                updatedQs[hqIdx].leftItems = newLeftItems;
                                updatedQs[hqIdx].rightItems = newRightItems;

                                const currentMap = (updatedQs[hqIdx].correctAnswer && typeof updatedQs[hqIdx].correctAnswer === 'object') ? { ...updatedQs[hqIdx].correctAnswer } : {};
                                currentMap[newLeftItems[newLeftItems.length - 1]] = newRightItems[newRightItems.length - 1];
                                updatedQs[hqIdx].correctAnswer = currentMap;

                                setEditingSheet({ ...editingSheet, questions: updatedQs });
                              }}
                              className="px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl border-2 border-dashed border-purple-500 hover:bg-purple-500/20 text-xs font-black cursor-pointer flex items-center gap-1 mt-2"
                            >
                              <span>+ Add Matching Pair</span>
                            </button>
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-500">Solution Explanation:</label>
                          <input
                            type="text"
                            value={hq.explanation || ''}
                            onChange={(e) => {
                              const updatedQs = [...editingSheet.questions];
                              updatedQs[hqIdx].explanation = e.target.value;
                              setEditingSheet({ ...editingSheet, questions: updatedQs });
                            }}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-gray-200 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 3: BHUTAN TECH TRIVIA QUESTIONS     */}
      {/* ========================================== */}
      {activeCmsTab === 'trivia' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-5 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2">
              <h3 className="text-sm font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4" /> Trivia Questions
              </h3>
              <button
                onClick={handleAddTriviaQuestion}
                className="px-2.5 py-1 bg-[#FFCC33] text-[#1A1A1A] text-[11px] font-black uppercase rounded-lg border border-[#1A1A1A] cursor-pointer"
              >
                + Add Trivia
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-gray-700 dark:text-slate-300">Category Filter:</label>
              <select
                value={selectedTriviaCategory}
                onChange={(e) => setSelectedTriviaCategory(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 p-2 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
              >
                <option value="All">All Categories</option>
                <option value="Pioneer Era">Pioneer Era</option>
                <option value="National Projects">National Projects</option>
                <option value="Digital Identity & Future">Digital Identity & Future</option>
                <option value="Dzongkha Tech">Dzongkha Tech</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {triviaQuestions
                .filter((q) => selectedTriviaCategory === 'All' || q.category === selectedTriviaCategory)
                .map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedTriviaId(q.id)}
                    className={`w-full text-left p-3 rounded-2xl border-2 border-[#1A1A1A] text-xs font-black flex items-center justify-between cursor-pointer transition-all ${
                      selectedTriviaId === q.id
                        ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                        : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{q.question}</div>
                      <div className="text-[10px] font-semibold text-gray-500">{q.category} • {q.yearMilestone || 'Milestone'}</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {currentTriviaQ && (
              <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-6 space-y-5 shadow-[6px_6px_0px_0px_#1A1A1A]">
                <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3">
                  <h3 className="text-base font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                    <Edit3 className="w-5 h-5" /> Trivia Question Editor
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteTriviaQuestion(currentTriviaQ.id)}
                      className="px-3 py-1.5 bg-rose-600 text-white font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                    <button
                      onClick={handleSaveTriviaQuestions}
                      className="px-4 py-2 bg-emerald-600 text-white font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:bg-emerald-500 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" /> Save All Trivia
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Category:</label>
                    <select
                      value={currentTriviaQ.category}
                      onChange={(e) => {
                        const updated = triviaQuestions.map((q) => (q.id === currentTriviaQ.id ? { ...q, category: e.target.value as any } : q));
                        setTriviaQuestions(updated);
                      }}
                      className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                    >
                      <option value="Pioneer Era">Pioneer Era</option>
                      <option value="National Projects">National Projects</option>
                      <option value="Digital Identity & Future">Digital Identity & Future</option>
                      <option value="Dzongkha Tech">Dzongkha Tech</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Year / Milestone:</label>
                    <input
                      type="text"
                      value={currentTriviaQ.yearMilestone || ''}
                      onChange={(e) => {
                        const updated = triviaQuestions.map((q) => (q.id === currentTriviaQ.id ? { ...q, yearMilestone: e.target.value } : q));
                        setTriviaQuestions(updated);
                      }}
                      className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Status:</label>
                    <select
                      value={currentTriviaQ.status || 'published'}
                      onChange={(e) => {
                        const updated = triviaQuestions.map((q) => (q.id === currentTriviaQ.id ? { ...q, status: e.target.value as any } : q));
                        setTriviaQuestions(updated);
                      }}
                      className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                    >
                      <option value="published">🟢 Published</option>
                      <option value="draft">🟡 Draft</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Trivia Question Prompt:</label>
                  <textarea
                    rows={2}
                    value={currentTriviaQ.question}
                    onChange={(e) => {
                      const updated = triviaQuestions.map((q) => (q.id === currentTriviaQ.id ? { ...q, question: e.target.value } : q));
                      setTriviaQuestions(updated);
                    }}
                    className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Multiple Choice Options:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentTriviaQ.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`triv-corr-${currentTriviaQ.id}`}
                          checked={currentTriviaQ.correctAnswer === optIdx}
                          onChange={() => {
                            const updated = triviaQuestions.map((q) => (q.id === currentTriviaQ.id ? { ...q, correctAnswer: optIdx } : q));
                            setTriviaQuestions(updated);
                          }}
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = triviaQuestions.map((q) => {
                              if (q.id === currentTriviaQ.id) {
                                const newOpts = [...q.options];
                                newOpts[optIdx] = e.target.value;
                                return { ...q, options: newOpts };
                              }
                              return q;
                            });
                            setTriviaQuestions(updated);
                          }}
                          className={`flex-1 p-2 rounded-xl border-2 font-medium text-xs ${
                            currentTriviaQ.correctAnswer === optIdx ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-white'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Explanation:</label>
                  <textarea
                    rows={2}
                    value={currentTriviaQ.explanation}
                    onChange={(e) => {
                      const updated = triviaQuestions.map((q) => (q.id === currentTriviaQ.id ? { ...q, explanation: e.target.value } : q));
                      setTriviaQuestions(updated);
                    }}
                    className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-medium text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Cultural & Historical Significance Context:</label>
                  <textarea
                    rows={2}
                    value={currentTriviaQ.culturalContext || ''}
                    onChange={(e) => {
                      const updated = triviaQuestions.map((q) => (q.id === currentTriviaQ.id ? { ...q, culturalContext: e.target.value } : q));
                      setTriviaQuestions(updated);
                    }}
                    className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-medium text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 4: BCSEA EXAM PREP & CODE TRACING  */}
      {/* ========================================== */}
      {activeCmsTab === 'examprep' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-gray-300 pb-3">
            <button
              onClick={() => setExamSubTab('mcq')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A1A1A] cursor-pointer ${
                examSubTab === 'mcq' ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]' : 'bg-white text-gray-700'
              }`}
            >
              Mock Board Exam Questions ({examQuestions.length})
            </button>
            <button
              onClick={() => setExamSubTab('tracing')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A1A1A] cursor-pointer ${
                examSubTab === 'tracing' ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]' : 'bg-white text-gray-700'
              }`}
            >
              Code Tracing Dry-Run Tables ({tracingProblems.length})
            </button>
          </div>

          {examSubTab === 'mcq' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-5 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
                <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2">
                  <h3 className="text-sm font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Exam Questions
                  </h3>
                  <button
                    onClick={handleAddExamQuestion}
                    className="px-2.5 py-1 bg-[#FFCC33] text-[#1A1A1A] text-[11px] font-black uppercase rounded-lg border border-[#1A1A1A] cursor-pointer"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                  {examQuestions.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedExamQId(q.id)}
                      className={`w-full text-left p-3 rounded-2xl border-2 border-[#1A1A1A] text-xs font-black flex items-center justify-between cursor-pointer transition-all ${
                        selectedExamQId === q.id
                          ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                          : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate">{q.question}</div>
                        <div className="text-[10px] font-semibold text-gray-500">{q.chapter}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                {currentExamQ && (
                  <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-6 space-y-5 shadow-[6px_6px_0px_0px_#1A1A1A]">
                    <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3">
                      <h3 className="text-base font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                        <Edit3 className="w-5 h-5" /> BCSEA Board Question Editor
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteExamQuestion(currentExamQ.id)}
                          className="px-3 py-1.5 bg-rose-600 text-white font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                        <button
                          onClick={handleSaveExamQuestions}
                          className="px-4 py-2 bg-emerald-600 text-white font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:bg-emerald-500 cursor-pointer flex items-center gap-1.5"
                        >
                          <Save className="w-4 h-4" /> Save Exam Questions
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Syllabus Chapter / Category:</label>
                        <input
                          type="text"
                          value={currentExamQ.chapter}
                          onChange={(e) => {
                            const updated = examQuestions.map((q) => (q.id === currentExamQ.id ? { ...q, chapter: e.target.value } : q));
                            setExamQuestions(updated);
                          }}
                          className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Status:</label>
                        <select
                          value={currentExamQ.status || 'published'}
                          onChange={(e) => {
                            const updated = examQuestions.map((q) => (q.id === currentExamQ.id ? { ...q, status: e.target.value as any } : q));
                            setExamQuestions(updated);
                          }}
                          className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                        >
                          <option value="published">🟢 Published</option>
                          <option value="draft">🟡 Draft</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Question Text:</label>
                      <textarea
                        rows={2}
                        value={currentExamQ.question}
                        onChange={(e) => {
                          const updated = examQuestions.map((q) => (q.id === currentExamQ.id ? { ...q, question: e.target.value } : q));
                          setExamQuestions(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Multiple Choice Options:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentExamQ.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`ex-corr-${currentExamQ.id}`}
                              checked={currentExamQ.correctAnswer === optIdx}
                              onChange={() => {
                                const updated = examQuestions.map((q) => (q.id === currentExamQ.id ? { ...q, correctAnswer: optIdx } : q));
                                setExamQuestions(updated);
                              }}
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const updated = examQuestions.map((q) => {
                                  if (q.id === currentExamQ.id) {
                                    const newOpts = [...q.options];
                                    newOpts[optIdx] = e.target.value;
                                    return { ...q, options: newOpts };
                                  }
                                  return q;
                                });
                                setExamQuestions(updated);
                              }}
                              className={`flex-1 p-2 rounded-xl border-2 font-medium text-xs ${
                                currentExamQ.correctAnswer === optIdx ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-white'
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Explanation:</label>
                      <textarea
                        rows={2}
                        value={currentExamQ.explanation}
                        onChange={(e) => {
                          const updated = examQuestions.map((q) => (q.id === currentExamQ.id ? { ...q, explanation: e.target.value } : q));
                          setExamQuestions(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-medium text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-5 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
                <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2">
                  <h3 className="text-sm font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                    <Code className="w-4 h-4" /> Tracing Problems
                  </h3>
                  <button
                    onClick={handleAddTracingProblem}
                    className="px-2.5 py-1 bg-[#FFCC33] text-[#1A1A1A] text-[11px] font-black uppercase rounded-lg border border-[#1A1A1A] cursor-pointer"
                  >
                    + Add Problem
                  </button>
                </div>

                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                  {tracingProblems.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedTracingId(p.id)}
                      className={`w-full text-left p-3 rounded-2xl border-2 border-[#1A1A1A] text-xs font-black flex items-center justify-between cursor-pointer transition-all ${
                        selectedTracingId === p.id
                          ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                          : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate">{p.title}</div>
                        <div className="text-[10px] font-semibold text-gray-500">{p.expectedTable.length} Dry-run Steps</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                {currentTracingProblem && (
                  <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-6 space-y-5 shadow-[6px_6px_0px_0px_#1A1A1A]">
                    <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3">
                      <h3 className="text-base font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                        <Edit3 className="w-5 h-5" /> Tracing Problem Editor
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteTracingProblem(currentTracingProblem.id)}
                          className="px-3 py-1.5 bg-rose-600 text-white font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                        <button
                          onClick={handleSaveTracingProblems}
                          className="px-4 py-2 bg-emerald-600 text-white font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:bg-emerald-500 cursor-pointer flex items-center gap-1.5"
                        >
                          <Save className="w-4 h-4" /> Save Tracing Problems
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Problem Title:</label>
                      <input
                        type="text"
                        value={currentTracingProblem.title}
                        onChange={(e) => {
                          const updated = tracingProblems.map((p) => (p.id === currentTracingProblem.id ? { ...p, title: e.target.value } : p));
                          setTracingProblems(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Python Code snippet (one line per line):</label>
                      <textarea
                        rows={4}
                        value={currentTracingProblem.code.join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n');
                          const updated = tracingProblems.map((p) => (p.id === currentTracingProblem.id ? { ...p, code: lines } : p));
                          setTracingProblems(updated);
                        }}
                        className="w-full bg-slate-900 text-emerald-400 font-mono p-3 rounded-xl border-2 border-[#1A1A1A] text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Explanation:</label>
                      <textarea
                        rows={2}
                        value={currentTracingProblem.explanation}
                        onChange={(e) => {
                          const updated = tracingProblems.map((p) => (p.id === currentTracingProblem.id ? { ...p, explanation: e.target.value } : p));
                          setTracingProblems(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-medium text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 5: ICT GLOSSARY DICTIONARY TERMS  */}
      {/* ========================================== */}
      {activeCmsTab === 'glossary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-5 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2">
              <h3 className="text-sm font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                <BookMarked className="w-4 h-4" /> Glossary Terms
              </h3>
              <button
                onClick={handleAddGlossaryTerm}
                className="px-2.5 py-1 bg-[#FFCC33] text-[#1A1A1A] text-[11px] font-black uppercase rounded-lg border border-[#1A1A1A] cursor-pointer"
              >
                + Add Term
              </button>
            </div>

            <input
              type="text"
              placeholder="Search terms..."
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 p-2 rounded-xl border-2 border-[#1A1A1A] text-xs font-medium"
            />

            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {glossaryTerms
                .filter((t) => t.term.toLowerCase().includes(glossarySearch.toLowerCase()) || t.category.toLowerCase().includes(glossarySearch.toLowerCase()))
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedGlossaryTermId(t.id)}
                    className={`w-full text-left p-3 rounded-2xl border-2 border-[#1A1A1A] text-xs font-black flex items-center justify-between cursor-pointer transition-all ${
                      selectedGlossaryTermId === t.id
                        ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                        : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate font-bold">{t.term} ({t.dzongkha})</div>
                      <div className="text-[10px] font-semibold text-gray-500">{t.category}</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {currentGlossaryTerm && (
              <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-6 space-y-5 shadow-[6px_6px_0px_0px_#1A1A1A]">
                <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3">
                  <h3 className="text-base font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                    <Edit3 className="w-5 h-5" /> Term Editor: {currentGlossaryTerm.term}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteGlossaryTerm(currentGlossaryTerm.id)}
                      className="px-3 py-1.5 bg-rose-600 text-white font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                    <button
                      onClick={handleSaveGlossaryTerms}
                      className="px-4 py-2 bg-emerald-600 text-white font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:bg-emerald-500 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" /> Save All Glossary
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">English Term:</label>
                    <input
                      type="text"
                      value={currentGlossaryTerm.term}
                      onChange={(e) => {
                        const updated = glossaryTerms.map((t) => (t.id === currentGlossaryTerm.id ? { ...t, term: e.target.value } : t));
                        setGlossaryTerms(updated);
                      }}
                      className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Dzongkha Term:</label>
                    <input
                      type="text"
                      value={currentGlossaryTerm.dzongkha}
                      onChange={(e) => {
                        const updated = glossaryTerms.map((t) => (t.id === currentGlossaryTerm.id ? { ...t, dzongkha: e.target.value } : t));
                        setGlossaryTerms(updated);
                      }}
                      className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Category:</label>
                      <select
                        value={currentGlossaryTerm.category}
                        onChange={(e) => {
                          const updated = glossaryTerms.map((t) => (t.id === currentGlossaryTerm.id ? { ...t, category: e.target.value as any } : t));
                          setGlossaryTerms(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      >
                        <option value="Python">Python</option>
                        <option value="Algorithms">Algorithms</option>
                        <option value="Cloud & Workspace">Cloud & Workspace</option>
                        <option value="Copyright & Ethics">Copyright & Ethics</option>
                        <option value="Excel & Data">Excel & Data</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Status:</label>
                      <select
                        value={currentGlossaryTerm.status || 'published'}
                        onChange={(e) => {
                          const updated = glossaryTerms.map((t) => (t.id === currentGlossaryTerm.id ? { ...t, status: e.target.value as any } : t));
                          setGlossaryTerms(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      >
                        <option value="published">🟢 Published</option>
                        <option value="draft">🟡 Draft</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Simplified Definition:</label>
                  <textarea
                    rows={2}
                    value={currentGlossaryTerm.simplifiedDefinition}
                    onChange={(e) => {
                      const updated = glossaryTerms.map((t) => (t.id === currentGlossaryTerm.id ? { ...t, simplifiedDefinition: e.target.value } : t));
                      setGlossaryTerms(updated);
                    }}
                    className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-medium text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Bhutanese Context / Analogy:</label>
                  <textarea
                    rows={2}
                    value={currentGlossaryTerm.bhutanContext}
                    onChange={(e) => {
                      const updated = glossaryTerms.map((t) => (t.id === currentGlossaryTerm.id ? { ...t, bhutanContext: e.target.value } : t));
                      setGlossaryTerms(updated);
                    }}
                    className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-medium text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Code Snippet Example:</label>
                  <textarea
                    rows={3}
                    value={currentGlossaryTerm.exampleCode || ''}
                    onChange={(e) => {
                      const updated = glossaryTerms.map((t) => (t.id === currentGlossaryTerm.id ? { ...t, exampleCode: e.target.value } : t));
                      setGlossaryTerms(updated);
                    }}
                    className="w-full bg-slate-900 text-emerald-400 font-mono p-2.5 rounded-xl border-2 border-[#1A1A1A] text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 6: PYTHON PRESETS                  */}
      {/* ========================================== */}
      {activeCmsTab === 'python_presets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-5 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2">
              <h3 className="text-sm font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4" /> Python Presets
              </h3>
              <button
                onClick={() => {
                  const newPreset: PythonPreset = {
                    id: `preset-${Date.now()}`,
                    title: 'New Python Preset',
                    subtitle: 'New exercise description',
                    instructions: 'Enter instructions here...',
                    code: '# Write starting code here\nprint("Hello World")\n',
                    solution: '# Write complete solution code here\nprint("Hello World")\n'
                  };
                  const updated = [...pythonPresets, newPreset];
                  setPythonPresets(updated);
                  savePythonPresets(updated);
                  setSelectedPresetId(newPreset.id);
                  recordCMSVersionSnapshot('python_presets', `Added Python preset "${newPreset.title}"`, updated, 'Teacher');
                  triggerSaveBanner('New Python Preset created!');
                }}
                className="px-2.5 py-1 bg-[#FFCC33] text-[#1A1A1A] text-[11px] font-black uppercase rounded-lg border border-[#1A1A1A] cursor-pointer"
              >
                + Add Preset
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {pythonPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    selectedPresetId === preset.id
                      ? 'bg-amber-100 dark:bg-slate-800 border-[#6D071A] dark:border-yellow-400'
                      : 'bg-white dark:bg-slate-950 border-[#1A1A1A] hover:bg-amber-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-slate-800 dark:text-slate-100 truncate">{preset.title}</p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">{preset.subtitle}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pythonPresets.length <= 1) {
                        alert('You must keep at least one preset.');
                        return;
                      }
                      if (window.confirm(`Are you sure you want to delete the preset "${preset.title}"?`)) {
                        const updated = pythonPresets.filter((p) => p.id !== preset.id);
                        setPythonPresets(updated);
                        savePythonPresets(updated);
                        if (selectedPresetId === preset.id) {
                          setSelectedPresetId(updated[0].id);
                        }
                        recordCMSVersionSnapshot('python_presets', `Deleted Python preset "${preset.title}"`, updated, 'Teacher');
                        triggerSaveBanner('Python Preset deleted.');
                      }
                    }}
                    className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {(() => {
              const currentPreset = pythonPresets.find((p) => p.id === selectedPresetId) || pythonPresets[0];
              if (!currentPreset) {
                return (
                  <div className="bg-white dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-8 text-center text-xs text-gray-500">
                    No preset selected or available. Click "+ Add Preset" to create one.
                  </div>
                );
              }
              return (
                <div className="bg-white dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-6 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
                  <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-slate-800 pb-3">
                    <h3 className="font-black text-xs text-gray-900 dark:text-slate-100 uppercase tracking-wide">
                      Edit Preset: <span className="text-[#6D071A] dark:text-yellow-400">{currentPreset.title}</span>
                    </h3>
                    <button
                      onClick={() => {
                        savePythonPresets(pythonPresets);
                        recordCMSVersionSnapshot('python_presets', `Updated preset "${currentPreset.title}"`, pythonPresets, 'Teacher');
                        triggerSaveBanner('Python Presets saved and synchronized successfully!');
                      }}
                      className="px-4 py-2 bg-[#6D071A] text-yellow-300 font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" /> Save Presets
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Preset Title:</label>
                      <input
                        type="text"
                        value={currentPreset.title}
                        onChange={(e) => {
                          const updated = pythonPresets.map((p) => (p.id === currentPreset.id ? { ...p, title: e.target.value } : p));
                          setPythonPresets(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Description / Subtitle:</label>
                      <input
                        type="text"
                        value={currentPreset.subtitle}
                        onChange={(e) => {
                          const updated = pythonPresets.map((p) => (p.id === currentPreset.id ? { ...p, subtitle: e.target.value } : p));
                          setPythonPresets(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Instructions (Supports HTML or Plaintext):</label>
                    <textarea
                      rows={3}
                      value={currentPreset.instructions}
                      onChange={(e) => {
                        const updated = pythonPresets.map((p) => (p.id === currentPreset.id ? { ...p, instructions: e.target.value } : p));
                        setPythonPresets(updated);
                      }}
                      className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Initial Starting Code:</label>
                      <textarea
                        rows={10}
                        value={currentPreset.code}
                        onChange={(e) => {
                          const updated = pythonPresets.map((p) => (p.id === currentPreset.id ? { ...p, code: e.target.value } : p));
                          setPythonPresets(updated);
                        }}
                        className="w-full bg-slate-950 text-emerald-400 font-mono p-3 rounded-xl border-2 border-[#1A1A1A] text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Solution Reference Code:</label>
                      <textarea
                        rows={10}
                        value={currentPreset.solution || ''}
                        onChange={(e) => {
                          const updated = pythonPresets.map((p) => (p.id === currentPreset.id ? { ...p, solution: e.target.value } : p));
                          setPythonPresets(updated);
                        }}
                        className="w-full bg-slate-950 text-amber-400 font-mono p-3 rounded-xl border-2 border-[#1A1A1A] text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 7: EXCEL TEMPLATES                 */}
      {/* ========================================== */}
      {activeCmsTab === 'excel_templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-5 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2">
              <h3 className="text-sm font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" /> Excel Templates
              </h3>
              <button
                onClick={() => {
                  const newTemplate: ExcelTemplate = {
                    id: `sheet-${Date.now()}`,
                    name: 'New Practical Sheet',
                    subtitle: 'New worksheet description',
                    cols: ['A', 'B', 'C', 'D'],
                    rows: [1, 2, 3, 4, 5],
                    cells: {
                      A1: 'Item', B1: 'Price', C1: 'Qty', D1: 'Total',
                      A2: 'Pen', B2: '20', C2: '5', D2: '=B2*C2'
                    },
                    defaultChart: 'column'
                  };
                  const updated = [...excelTemplates, newTemplate];
                  setExcelTemplates(updated);
                  saveExcelTemplates(updated);
                  setSelectedExcelTemplateId(newTemplate.id);
                  recordCMSVersionSnapshot('excel_templates', `Added Excel template "${newTemplate.name}"`, updated, 'Teacher');
                  triggerSaveBanner('New Excel Template created!');
                }}
                className="px-2.5 py-1 bg-[#FFCC33] text-[#1A1A1A] text-[11px] font-black uppercase rounded-lg border border-[#1A1A1A] cursor-pointer"
              >
                + Add Sheet
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {excelTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedExcelTemplateId(tmpl.id)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    selectedExcelTemplateId === tmpl.id
                      ? 'bg-amber-100 dark:bg-slate-800 border-[#6D071A] dark:border-yellow-400'
                      : 'bg-white dark:bg-slate-950 border-[#1A1A1A] hover:bg-amber-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-slate-800 dark:text-slate-100 truncate">{tmpl.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">{tmpl.subtitle}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (excelTemplates.length <= 1) {
                        alert('You must keep at least one worksheet.');
                        return;
                      }
                      if (window.confirm(`Are you sure you want to delete the worksheet template "${tmpl.name}"?`)) {
                        const updated = excelTemplates.filter((t) => t.id !== tmpl.id);
                        setExcelTemplates(updated);
                        saveExcelTemplates(updated);
                        if (selectedExcelTemplateId === tmpl.id) {
                          setSelectedExcelTemplateId(updated[0].id);
                        }
                        recordCMSVersionSnapshot('excel_templates', `Deleted Excel template "${tmpl.name}"`, updated, 'Teacher');
                        triggerSaveBanner('Excel Template deleted.');
                      }
                    }}
                    className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {(() => {
              const currentTmpl = excelTemplates.find((t) => t.id === selectedExcelTemplateId) || excelTemplates[0];
              if (!currentTmpl) {
                return (
                  <div className="bg-white dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-8 text-center text-xs text-gray-500">
                    No sheet template selected or available. Click "+ Add Sheet" to create one.
                  </div>
                );
              }
              return (
                <div className="bg-white dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-6 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
                  <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-slate-800 pb-3">
                    <h3 className="font-black text-xs text-gray-900 dark:text-slate-100 uppercase tracking-wide">
                      Edit Sheet: <span className="text-[#6D071A] dark:text-yellow-400">{currentTmpl.name}</span>
                    </h3>
                    <button
                      onClick={() => {
                        saveExcelTemplates(excelTemplates);
                        recordCMSVersionSnapshot('excel_templates', `Updated sheet template "${currentTmpl.name}"`, excelTemplates, 'Teacher');
                        triggerSaveBanner('Excel Templates saved and synchronized successfully!');
                      }}
                      className="px-4 py-2 bg-[#6D071A] text-yellow-300 font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" /> Save Sheets
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Sheet Name:</label>
                      <input
                        type="text"
                        value={currentTmpl.name}
                        onChange={(e) => {
                          const updated = excelTemplates.map((t) => (t.id === currentTmpl.id ? { ...t, name: e.target.value } : t));
                          setExcelTemplates(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Subtitle / Curricular Context:</label>
                      <input
                        type="text"
                        value={currentTmpl.subtitle}
                        onChange={(e) => {
                          const updated = excelTemplates.map((t) => (t.id === currentTmpl.id ? { ...t, subtitle: e.target.value } : t));
                          setExcelTemplates(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Columns (A,B,C...):</label>
                      <input
                        type="text"
                        value={currentTmpl.cols.join(',')}
                        onChange={(e) => {
                          const colsArray = e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
                          const updated = excelTemplates.map((t) => (t.id === currentTmpl.id ? { ...t, cols: colsArray } : t));
                          setExcelTemplates(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Rows (1,2,3...):</label>
                      <input
                        type="text"
                        value={currentTmpl.rows.join(',')}
                        onChange={(e) => {
                          const rowsArray = e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
                          const updated = excelTemplates.map((t) => (t.id === currentTmpl.id ? { ...t, rows: rowsArray } : t));
                          setExcelTemplates(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Default Chart Type:</label>
                      <select
                        value={currentTmpl.defaultChart}
                        onChange={(e) => {
                          const val = e.target.value as 'column' | 'bar' | 'pie' | 'line';
                          const updated = excelTemplates.map((t) => (t.id === currentTmpl.id ? { ...t, defaultChart: val } : t));
                          setExcelTemplates(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      >
                        <option value="column">Column Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="pie">Pie Chart</option>
                        <option value="line">Line Chart</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Sheet Grid Cell Data (JSON Format):</label>
                      <span className="text-[10px] text-gray-500 font-mono">Keys must be UPPERCASE (e.g. A1, B2)</span>
                    </div>
                    <textarea
                      rows={12}
                      value={JSON.stringify(currentTmpl.cells, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          const updated = excelTemplates.map((t) => (t.id === currentTmpl.id ? { ...t, cells: parsed } : t));
                          setExcelTemplates(updated);
                        } catch (err) {
                          // Allow editing broken JSON in-place, but don't crash
                        }
                      }}
                      className="w-full bg-slate-950 text-emerald-400 font-mono p-3 rounded-xl border-2 border-[#1A1A1A] text-xs leading-relaxed"
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 8: FLOWCHARTS                      */}
      {/* ========================================== */}
      {activeCmsTab === 'flowcharts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-5 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2">
              <h3 className="text-sm font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                <GitBranch className="w-4 h-4" /> Flowchart Diagrams
              </h3>
              <button
                onClick={() => {
                  const newTemplate: FlowchartTemplate = {
                    id: `flowchart-${Date.now()}`,
                    title: 'New Customized Algorithm Flowchart',
                    category: 'Class activity / Custom logic flow',
                    description: 'Analyze this custom flowchart step-by-step and write the Python equivalent.',
                    explanation: 'This custom flowchart tests conditional routing rules.',
                    mermaidCode: `graph TD
A([Start]) --> B[Input value]
B --> C{Is value > 10?}
C -- Yes --> D[Print 'Greater']
C -- No --> E[Print 'Smaller']
D --> F([End])
E --> F`,
                    pythonCode: `val = int(input("Enter value: "))
if val > 10:
    print("Greater")
else:
    print("Smaller")`,
                    nodes: []
                  };
                  const updated = [...flowcharts, newTemplate];
                  setFlowcharts(updated);
                  saveFlowcharts(updated);
                  setSelectedFlowchartId(newTemplate.id);
                  recordCMSVersionSnapshot('flowcharts', `Added Flowchart template "${newTemplate.title}"`, updated, 'Teacher');
                  triggerSaveBanner('New Flowchart Template created!');
                }}
                className="px-2.5 py-1 bg-[#FFCC33] text-[#1A1A1A] text-[11px] font-black uppercase rounded-lg border border-[#1A1A1A] cursor-pointer"
              >
                + Add Flowchart
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {flowcharts.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedFlowchartId(tmpl.id)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    selectedFlowchartId === tmpl.id
                      ? 'bg-amber-100 dark:bg-slate-800 border-[#6D071A] dark:border-yellow-400'
                      : 'bg-white dark:bg-slate-950 border-[#1A1A1A] hover:bg-amber-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-slate-800 dark:text-slate-100 truncate">{tmpl.title}</p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">{tmpl.category}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (flowcharts.length <= 1) {
                        alert('You must keep at least one flowchart.');
                        return;
                      }
                      if (window.confirm(`Are you sure you want to delete the flowchart template "${tmpl.title}"?`)) {
                        const updated = flowcharts.filter((t) => t.id !== tmpl.id);
                        setFlowcharts(updated);
                        saveFlowcharts(updated);
                        if (selectedFlowchartId === tmpl.id) {
                          setSelectedFlowchartId(updated[0].id);
                        }
                        recordCMSVersionSnapshot('flowcharts', `Deleted Flowchart template "${tmpl.title}"`, updated, 'Teacher');
                        triggerSaveBanner('Flowchart Template deleted.');
                      }
                    }}
                    className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {(() => {
              const currentTmpl = flowcharts.find((t) => t.id === selectedFlowchartId) || flowcharts[0];
              if (!currentTmpl) {
                return (
                  <div className="bg-white dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-8 text-center text-xs text-gray-500">
                    No flowchart template selected or available. Click "+ Add Flowchart" to create one.
                  </div>
                );
              }
              return (
                <div className="bg-white dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl p-6 space-y-4 shadow-[6px_6px_0px_0px_#1A1A1A]">
                  <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-slate-800 pb-3">
                    <h3 className="font-black text-xs text-gray-900 dark:text-slate-100 uppercase tracking-wide">
                      Edit Flowchart: <span className="text-[#6D071A] dark:text-yellow-400">{currentTmpl.title}</span>
                    </h3>
                    <button
                      onClick={() => {
                        saveFlowcharts(flowcharts);
                        recordCMSVersionSnapshot('flowcharts', `Updated flowchart template "${currentTmpl.title}"`, flowcharts, 'Teacher');
                        triggerSaveBanner('Flowchart templates saved and synchronized successfully!');
                      }}
                      className="px-4 py-2 bg-[#6D071A] text-yellow-300 font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" /> Save Flowcharts
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Title:</label>
                      <input
                        type="text"
                        value={currentTmpl.title}
                        onChange={(e) => {
                          const updated = flowcharts.map((t) => (t.id === currentTmpl.id ? { ...t, title: e.target.value } : t));
                          setFlowcharts(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Category:</label>
                      <input
                        type="text"
                        value={currentTmpl.category}
                        onChange={(e) => {
                          const updated = flowcharts.map((t) => (t.id === currentTmpl.id ? { ...t, category: e.target.value } : t));
                          setFlowcharts(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Description / Instructions:</label>
                    <textarea
                      rows={2}
                      value={currentTmpl.description}
                      onChange={(e) => {
                        const updated = flowcharts.map((t) => (t.id === currentTmpl.id ? { ...t, description: e.target.value } : t));
                        setFlowcharts(updated);
                      }}
                      className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Explanation / Walkthrough:</label>
                    <textarea
                      rows={2}
                      value={currentTmpl.explanation}
                      onChange={(e) => {
                        const updated = flowcharts.map((t) => (t.id === currentTmpl.id ? { ...t, explanation: e.target.value } : t));
                        setFlowcharts(updated);
                      }}
                      className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Mermaid Graph Syntax:</label>
                      <textarea
                        rows={10}
                        value={currentTmpl.mermaidCode}
                        onChange={(e) => {
                          const updated = flowcharts.map((t) => (t.id === currentTmpl.id ? { ...t, mermaidCode: e.target.value } : t));
                          setFlowcharts(updated);
                        }}
                        className="w-full bg-slate-950 text-sky-400 font-mono p-3 rounded-xl border-2 border-[#1A1A1A] text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Solution Reference Python Code:</label>
                      <textarea
                        rows={10}
                        value={currentTmpl.pythonCode || ''}
                        onChange={(e) => {
                          const updated = flowcharts.map((t) => (t.id === currentTmpl.id ? { ...t, pythonCode: e.target.value } : t));
                          setFlowcharts(updated);
                        }}
                        className="w-full bg-slate-950 text-emerald-400 font-mono p-3 rounded-xl border-2 border-[#1A1A1A] text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-[8px_8px_0px_0px_#1A1A1A]">
            <h3 className="text-lg font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add New Topic
            </h3>

            <form onSubmit={handleCreateTopic} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Select Parent Chapter:</label>
                <select
                  value={newTopicModuleId}
                  onChange={(e) => setNewTopicModuleId(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      Chapter {m.chapterNumber}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Topic Title:</label>
                <input
                  type="text"
                  required
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="e.g. Introduction to Quantum Computing"
                  className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Summary:</label>
                <textarea
                  rows={2}
                  value={newTopicSummary}
                  onChange={(e) => setNewTopicSummary(e.target.value)}
                  placeholder="Core concepts explained..."
                  className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-medium text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Bhutanese Analogy:</label>
                <textarea
                  rows={2}
                  value={newTopicBhutanAnalogy}
                  onChange={(e) => setNewTopicBhutanAnalogy(e.target.value)}
                  placeholder="Local Bhutan context example..."
                  className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-medium text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FFCC33] text-[#1A1A1A] font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Chapter Modal */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-[8px_8px_0px_0px_#1A1A1A]">
            <h3 className="text-lg font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-5 h-5" /> Add New Chapter
            </h3>

            <form onSubmit={handleCreateChapter} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Chapter Title:</label>
                <input
                  type="text"
                  required
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Robotics"
                  className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Icon Emoji:</label>
                  <input
                    type="text"
                    value={newChapterIcon}
                    onChange={(e) => setNewChapterIcon(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Bhutan Region Theme:</label>
                  <input
                    type="text"
                    value={newChapterRegion}
                    onChange={(e) => setNewChapterRegion(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapterModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-300 text-[#1A1A1A] font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]"
                >
                  Create Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* VERSION HISTORY MODAL                      */}
      {/* ========================================== */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col p-6 shadow-[10px_10px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-300 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#FFCC33] text-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wide">
                    CMS Content Version History & Revert Engine
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-slate-400 font-medium">
                    Inspect previous snapshots of syllabus, questions, homework, and terms. Revert anytime with automatic safe backups.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-2 bg-gray-200 dark:bg-slate-800 hover:bg-rose-100 text-gray-800 dark:text-slate-200 rounded-xl border-2 border-[#1A1A1A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search version history by label or author..."
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-xl font-bold text-xs"
                />
              </div>

              <div>
                <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value as any)}
                  className="w-full py-2.5 px-3 bg-white dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-xl font-bold text-xs"
                >
                  <option value="all">All Content Types</option>
                  <option value="syllabus">Syllabus Chapters</option>
                  <option value="questions">Practice Questions</option>
                  <option value="homework">Homework Sheets</option>
                  <option value="trivia">Trivia Questions</option>
                  <option value="examprep">BCSEA Exam Prep</option>
                  <option value="tracing">Code Tracing</option>
                  <option value="glossary">ICT Glossary</option>
                </select>
              </div>
            </div>

            {/* Version List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {getCMSVersionHistory(historyFilter)
                .filter((item) => {
                  if (!historySearch.trim()) return true;
                  const q = historySearch.toLowerCase();
                  return item.label.toLowerCase().includes(q) || item.author.toLowerCase().includes(q) || item.contentType.toLowerCase().includes(q);
                })
                .map((ver, idx) => (
                  <div
                    key={ver.id}
                    className="p-4 bg-white dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-2xl shadow-[3px_3px_0px_0px_#1A1A1A] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-amber-50/50 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-[#6D071A] text-white text-[10px] font-black uppercase rounded-md tracking-wider">
                          {ver.contentType}
                        </span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase rounded-md">
                            Current Active
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(ver.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-gray-900 dark:text-slate-100">{ver.label}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {ver.author}</span>
                        <span>•</span>
                        <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[11px]">{ver.itemCount} items</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => setPreviewVersion(ver)}
                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black uppercase rounded-xl border-2 border-[#1A1A1A] hover:bg-slate-300 cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>

                      <button
                        onClick={() => {
                          setTargetRevertVersion(ver);
                          setShowRevertConfirmModal(true);
                        }}
                        className="px-3 py-1.5 bg-[#FFCC33] text-[#1A1A1A] text-xs font-black uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-yellow-400 cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#6D071A]" /> Revert To This
                      </button>

                      {idx !== 0 && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this version snapshot from history?')) {
                              deleteCMSVersionEntry(ver.id);
                              triggerSaveBanner('Version snapshot deleted from history.');
                            }
                          }}
                          className="p-1.5 bg-rose-100 text-rose-700 rounded-xl border-2 border-rose-300 hover:bg-rose-200 cursor-pointer"
                          title="Delete Version Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-4 mt-4 border-t-2 border-gray-300 dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all version history snapshots?')) {
                    clearCMSVersionHistory('all');
                    triggerSaveBanner('All version history cleared.');
                  }
                }}
                className="px-3 py-2 bg-rose-100 text-rose-800 font-black text-xs uppercase rounded-xl border-2 border-rose-300 hover:bg-rose-200 cursor-pointer"
              >
                Clear All History
              </button>

              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-5 py-2 bg-slate-800 text-white font-black text-xs uppercase rounded-xl border-2 border-slate-700 cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MANUAL SNAPSHOT CREATION MODAL             */}
      {/* ========================================== */}
      {showManualSnapshotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-[8px_8px_0px_0px_#1A1A1A]">
            <h3 className="text-lg font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wide flex items-center gap-2">
              <Camera className="w-5 h-5" /> Take CMS Version Snapshot
            </h3>
            <p className="text-xs text-gray-600 dark:text-slate-400 font-medium">
              Create a manual backup checkpoint for the current tab (<span className="font-bold uppercase text-[#6D071A]">{activeCmsTab}</span>) so you can safely restore it later if needed.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-700 dark:text-slate-300">Version Label / Note:</label>
              <input
                type="text"
                value={manualSnapshotNote}
                onChange={(e) => setManualSnapshotNote(e.target.value)}
                placeholder="e.g. Before classroom quiz on Python loops"
                className="w-full bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-[#1A1A1A] font-bold text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowManualSnapshotModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateManualSnapshot}
                className="px-4 py-2 bg-emerald-600 text-white font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]"
              >
                Save Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* VERSION INSPECT / PREVIEW MODAL            */}
      {/* ========================================== */}
      {previewVersion && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col p-6 space-y-4 shadow-[8px_8px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-gray-300 dark:border-slate-700">
              <div>
                <span className="text-[10px] bg-[#6D071A] text-white px-2 py-0.5 rounded uppercase font-bold">{previewVersion.contentType}</span>
                <h3 className="text-base font-black text-gray-900 dark:text-slate-100 mt-1">{previewVersion.label}</h3>
                <p className="text-[11px] text-gray-500 font-mono">Timestamp: {new Date(previewVersion.timestamp).toLocaleString()} • Author: {previewVersion.author}</p>
              </div>
              <button
                onClick={() => setPreviewVersion(null)}
                className="p-2 bg-gray-200 dark:bg-slate-800 rounded-xl border-2 border-[#1A1A1A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-2xl border-2 border-[#1A1A1A] max-h-96">
              <pre>{JSON.stringify(previewVersion.data, null, 2)}</pre>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-bold text-gray-600 dark:text-slate-400">Total items: {previewVersion.itemCount}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewVersion(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const ver = previewVersion;
                    setPreviewVersion(false as any);
                    setTargetRevertVersion(ver);
                    setShowRevertConfirmModal(true);
                  }}
                  className="px-4 py-2 bg-[#FFCC33] text-[#1A1A1A] font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]"
                >
                  Revert To This Version
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* REVERT CONFIRMATION MODAL                  */}
      {/* ========================================== */}
      {showRevertConfirmModal && targetRevertVersion && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#1A1A1A] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-[8px_8px_0px_0px_#1A1A1A]">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-3 bg-amber-100 rounded-2xl border-2 border-[#1A1A1A]">
                <ShieldAlert className="w-6 h-6 text-[#6D071A]" />
              </div>
              <h3 className="text-lg font-black text-[#6D071A] dark:text-yellow-400 uppercase tracking-wide">
                Confirm Content Revert
              </h3>
            </div>

            <p className="text-xs text-gray-700 dark:text-slate-300 font-medium leading-relaxed">
              Are you sure you want to revert <span className="font-bold uppercase text-[#6D071A]">{targetRevertVersion.contentType}</span> to version:
            </p>

            <div className="p-3 bg-white dark:bg-slate-800 border-2 border-[#1A1A1A] rounded-xl font-bold text-xs text-gray-900 dark:text-slate-100">
              "{targetRevertVersion.label}" ({new Date(targetRevertVersion.timestamp).toLocaleString()})
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-300 rounded-xl text-xs text-blue-900 dark:text-blue-200 font-medium flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
              <span>An automatic backup snapshot of your current state will be saved instantly before reverting, so no work is ever lost.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowRevertConfirmModal(false);
                  setTargetRevertVersion(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmRevert(targetRevertVersion)}
                className="px-4 py-2 bg-[#6D071A] text-yellow-300 font-black text-xs uppercase rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]"
              >
                Yes, Revert Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
