export type Language = 'en' | 'dz';

export interface TranslationSet {
  // App & Navigation
  appTitle: string;
  appSubtitle: string;
  questsTrail: string;
  gunaTutor: string;
  pythonIde: string;
  pythonRef: string;
  excelSimulator: string;
  cloudLab: string;
  workspaceLab: string;
  examPrep: string;
  bhutanTrivia: string;
  curriculum: string;
  leaderboard: string;
  studyRoom: string;
  teacherPortal: string;
  studentProfile: string;

  // Status & Badges
  online: string;
  offlineMode: string;
  streak: string;
  points: string;
  level: string;

  // Common Actions & Instructions
  startQuest: string;
  runCode: string;
  submitAnswer: string;
  askGuna: string;
  simplify: string;
  searchSyllabus: string;
  tryAgain: string;
  nextQuestion: string;
  viewResults: string;
  explanation: string;

  // Language Toggle
  languageName: string;
  switchLanguage: string;
}

export const TRANSLATIONS: Record<Language, TranslationSet> = {
  en: {
    appTitle: 'Bhutan Class 10 ICT Quest',
    appSubtitle: 'Interactive Curriculum Quest & AI Tutor',
    questsTrail: 'Quests Trail',
    gunaTutor: 'Guna AI Tutor',
    pythonIde: 'Python IDE',
    pythonRef: 'Python Reference',
    excelSimulator: 'Excel Spreadsheet',
    cloudLab: 'Cloud Services Lab',
    workspaceLab: 'Google Workspace Lab',
    examPrep: 'Exam Prep Suite',
    bhutanTrivia: 'Bhutan Tech History',
    curriculum: 'Curriculum Handbook',
    leaderboard: 'Class Leaderboard',
    studyRoom: 'Live Study Room',
    teacherPortal: 'Teacher Portal',
    studentProfile: 'Student Profile',

    online: 'Online',
    offlineMode: 'Offline Mode (Cached)',
    streak: 'Streak',
    points: 'Points',
    level: 'Level',

    startQuest: 'Start Quest',
    runCode: 'Run Code',
    submitAnswer: 'Submit Answer',
    askGuna: 'Ask Guna AI',
    simplify: 'Simplify',
    searchSyllabus: 'Search Syllabus',
    tryAgain: 'Try Again',
    nextQuestion: 'Next Question',
    viewResults: 'View Results',
    explanation: 'Explanation',

    languageName: 'English',
    switchLanguage: 'Switch to Dzongkha (རྫོང་ཁ།)'
  },
  dz: {
    appTitle: 'འབྲུག་རྒྱལ་ཁབ་ འཛིན་གྲྭ་ ༡༠ པའི་  ICT རིག་རྩལ་ འགྲན་བསྡུར།',
    appSubtitle: 'སློབ་ཚན་ རིག་རྩལ་ དང་ ཨེ་ཨཱའི་ སློབ་དཔོན།',
    questsTrail: 'རིག་རྩལ་ རྒྱུད་ལམ།',
    gunaTutor: 'གུ་ནཱ་ ཨེ་ཨཱའི་ སློབ་དཔོན།',
    pythonIde: 'པཱའི་ཐོན་ ལས་རིམ་ སྦྱོང་བརྡར།',
    pythonRef: 'པཱའི་ཐོན་ ཁུངས་གཏུགས།',
    excelSimulator: 'ཤོག་ཁྲམ་ སྦྱོང་བརྡར།',
    cloudLab: 'སྤྲིན་ཕུང་ ཞབས་ཏོག་ སྦྱོང་བརྡར།',
    workspaceLab: 'གུ་གལ་ ལས་ཡུལ་ སྦྱོང་བརྡར།',
    examPrep: 'རྒྱུགས་སྤྲོད་ གྲ་སྒྲིག',
    bhutanTrivia: 'འབྲུག་གི་ འཕྲུལ་རིག་ བྱུང་རབས།',
    curriculum: 'སློབ་ཚན་ ལག་དེབ།',
    leaderboard: 'འཛིན་གྲྭའི་ ཨང་རིམ།',
    studyRoom: 'གསོན་པོའི་ སློབ་སྦྱོང་ ཁང་མིག',
    teacherPortal: 'སློབ་དཔོན་ སྒོ་ར།',
    studentProfile: 'སློབ་ཕྲུག་ ངོ་སྤྲོད།',

    online: 'དྲ་ཐོག',
    offlineMode: 'དྲ་མེད་ ཐབས་ལམ།',
    streak: 'རྒྱུན་མཐུད་ ཉིན་གྲངས།',
    points: 'ཐོབ་སྐར།',
    level: 'རིམ་པ།',

    startQuest: 'རིག་རྩལ་ འགོ་བཙུགས།',
    runCode: 'ལས་རིམ་ འགོ་བཙུགས།',
    submitAnswer: 'ལན་ ཕུལ།',
    askGuna: 'གུ་ནཱ་ ལུ་དྲིས།',
    simplify: 'འཇམ་སམ་ བཟོ།',
    searchSyllabus: 'སློབ་ཚན་ ཚོལ།',
    tryAgain: 'ལོག་སྟེ་ འབད།',
    nextQuestion: 'ཤུལ་མའི་ དྲི་བ།',
    viewResults: 'གྲུབ་འབྲས་ ལྟ།',
    explanation: 'གསལ་བཤད།',

    languageName: 'རྫོང་ཁ།',
    switchLanguage: 'Switch to English (🇬🇧)'
  }
};
