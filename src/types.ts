export interface AppData {
  xpAwarded: number;
  xpDeducted: number;
  questStatus: 'not_started' | 'in_progress' | 'completed';
  currentTopic: string;
  levelComplete: boolean;
  navigationOptions?: string[];
  briefingData?: {
    chapterNumber: number;
    chapterTitle: string;
    levelNumber: number;
    levelTitle: string;
    analogy: string;
    keyConcepts: string[];
    mermaid: string;
    question: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  appData?: AppData;
  isStreaming?: boolean;
  simplifiedText?: string;
}

export interface QuestLevel {
  id: string;
  levelNumber: number;
  title: string;
  pageNo: number;
  summary: string;
  keyConcepts: string[];
  bhutanAnalogy: string;
  exerciseQuestion: string;
  sampleCodeOrFormula?: string;
  mermaidDiagram?: string;
  xpReward: number;
  status?: 'published' | 'draft';
}

export interface QuestModule {
  id: string;
  title: string;
  chapterNumber: number;
  icon: string;
  description: string;
  bhutanRegion: string;
  levels: QuestLevel[];
  status?: 'published' | 'draft';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  criteria?: string;
}

export interface QuestChallenge {
  id: string;
  challengerUid: string;
  challengerName: string;
  challengerSchool: string;
  challengerClass: string;
  opponentUid: string;
  opponentName: string;
  opponentSchool?: string;
  opponentClass?: string;
  targetType: 'quest' | 'python_lab';
  targetId: string; // e.g. 'cloud-types' or 'preset-factorial'
  targetTitle: string;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  challengerTimeSeconds?: number;
  opponentTimeSeconds?: number;
  challengerScore?: number;
  opponentScore?: number;
  winnerUid?: string;
  winnerName?: string;
  createdAt: number;
  completedAt?: number;
}

export interface UserStats {
  studentName: string;
  schoolName: string;
  classSection: string;
  totalXp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLevels: string[];
  unlockedBadges: string[];
  badgeUnlockDates?: Record<string, string>;
  notes: Record<string, string>;
}

export type ActiveTab =
  | 'map'
  | 'tutor'
  | 'python'
  | 'pythonref'
  | 'pythonvisualizer'
  | 'excel'
  | 'flowcharts'
  | 'examprep'
  | 'curriculum'
  | 'teacher'
  | 'profile'
  | 'leaderboard'
  | 'bhutantrivia'
  | 'gnhedtech'
  | 'glossary'
  | 'homework'
  | 'homework-cloud'
  | 'homework-workspace'
  | 'homework-copyright'
  | 'homework-python-basics'
  | 'homework-operators'
  | 'homework-strings'
  | 'homework-conditionals'
  | 'homework-nested'
  | 'homework-loops'
  | 'homework-collections'
  | 'homework-functions';

export interface PythonPreset {
  id: string;
  title: string;
  subtitle?: string;
  instructions?: string;
  code: string;
  solution?: string;
  status?: 'published' | 'draft';
}

export interface ExcelTemplate {
  id: string;
  name: string;
  subtitle: string;
  cols: string[];
  rows: number[];
  cells: Record<string, string>;
  defaultChart: 'column' | 'bar' | 'pie' | 'line';
  status?: 'published' | 'draft';
}

export interface FlowchartNode {
  id: string;
  type: 'start' | 'input' | 'process' | 'decision' | 'output' | 'end';
  text: string;
  variableName?: string;
  condition?: string;
  trueOutcome?: string;
  falseOutcome?: string;
}

export interface FlowchartTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  explanation: string;
  mermaidCode: string;
  nodes: FlowchartNode[];
  pythonCode: string;
  evaluateTrace?: (inputVal: string) => string[];
  status?: 'published' | 'draft';
}

