import { QuestLevel } from '../types';
import { randomizeQuestions } from '../lib/questionRandomizer';
import { questionBankCloud } from './questionBankCloud';
import { questionBankEthics } from './questionBankEthics';
import { questionBankExcel } from './questionBankExcel';
import { questionBankPythonBasics } from './questionBankPythonBasics';
import { questionBankPythonAdvanced } from './questionBankPythonAdvanced';

export interface InteractiveQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'match-following' | 'drag-drop';
  options?: string[]; // for multiple choice
  correctAnswer: any; // index (number) for MC, string for blank/drag-drop, Record<string, string> for match-following
  explanation: string;
  blankSentence?: string; // for fill-in-the-blank/drag-drop
  dragOptions?: string[]; // for drag-drop
  leftItems?: string[]; // for match-following
  rightItems?: string[]; // for match-following
  status?: 'published' | 'draft';
}

// Helper to randomize/shuffle MCQ options and return correct index
export function createRandomizedMCQ(
  id: string,
  question: string,
  correctOption: string,
  distractors: string[],
  explanation: string
): InteractiveQuestion {
  const allOpts = [correctOption, ...distractors];
  const shuffled = [...allOpts].sort(() => Math.random() - 0.5);
  const newIndex = shuffled.indexOf(correctOption);
  return {
    id,
    question,
    type: 'multiple-choice',
    options: shuffled,
    correctAnswer: newIndex,
    explanation,
  };
}

// Comprehensive explicit question bank for all 52 BHSEC ICT-10 topics (10+ questions each)
export const EXPLICIT_QUESTIONS: Record<string, InteractiveQuestion[]> = {
  ...questionBankCloud,
  ...questionBankEthics,
  ...questionBankExcel,
  ...questionBankPythonBasics,
  ...questionBankPythonAdvanced,
};

// Fallback generator if a levelId is somehow not found
export const getQuestionsForLevel = (
  levelId: string,
  levelData?: QuestLevel
): InteractiveQuestion[] => {
  if (EXPLICIT_QUESTIONS[levelId] && EXPLICIT_QUESTIONS[levelId].length > 0) {
    return randomizeQuestions(EXPLICIT_QUESTIONS[levelId]);
  }

  if (!levelData) {
    return [];
  }

  const title = levelData.title || 'ICT Concept';
  const summary = levelData.summary || 'Understand fundamental ICT principles and practical applications.';
  const analogy = (levelData as any).analogy || 'Like learning a fundamental skill in daily life.';

  const qPrompt = levelData.exerciseQuestion || `What is the primary objective of ${title}?`;
  const keyConcepts = levelData.keyConcepts || [summary];
  const concept1 = keyConcepts[0] || summary;
  const blankKey = concept1.split(' ')[0]?.replace(/[^a-zA-Z]/g, '') || 'Concept';

  const generated: InteractiveQuestion[] = [
    createRandomizedMCQ(
      `${levelId}-gen-q1`,
      qPrompt,
      `Apply core principle: ${summary.slice(0, 70)}`,
      [
        'Rely exclusively on unverified manual calculations.',
        'Ignore digital security and ICT standards.',
        'Bypass syntax checking and interpreter validation.'
      ],
      `The correct approach aligns with the core learning objective: ${summary}`
    ),
    {
      id: `${levelId}-gen-q2`,
      question: `Fill in the blank:`,
      type: 'fill-in-the-blank',
      blankSentence: concept1.replace(new RegExp(`\\b${blankKey}\\b`, 'i'), '______'),
      correctAnswer: blankKey,
      explanation: `Reference concept: "${concept1}"`
    },
    {
      id: `${levelId}-gen-q3`,
      question: `Complete the contextual statement:`,
      type: 'drag-drop',
      blankSentence: `${analogy.slice(0, 50)} are examples of ______ tools in modern computing.`,
      dragOptions: [title.split(' ')[0] || 'Computing', 'Cloud Storage', 'Python Shell'],
      correctAnswer: title.split(' ')[0] || 'Computing',
      explanation: `Contextualizing technical topics with practical analogies makes learning intuitive.`
    },
    {
      id: `${levelId}-gen-q4`,
      question: `Match each element to its descriptor for ${title}:`,
      type: 'match-following',
      leftItems: ['Topic Title', 'Core Summary', 'Practical Analogy'],
      rightItems: [title, summary.slice(0, 40) + '...', analogy.slice(0, 40) + '...'],
      correctAnswer: {
        'Topic Title': title,
        'Core Summary': summary.slice(0, 40) + '...',
        'Practical Analogy': analogy.slice(0, 40) + '...'
      },
      explanation: `This matches syllabus components to their precise definitions.`
    },
    createRandomizedMCQ(
      `${levelId}-gen-q5`,
      `Which of the following is considered best practice when working with "${title}"?`,
      'Following proper syntax rules, structured documentation, and rigorous testing.',
      ['Writing infinite loops without termination conditions.', 'Ignoring compiler error messages.', 'Hardcoding arbitrary values without variables.'],
      'Good programming practices require structured code, proper debugging, and clean syntax.'
    ),
    createRandomizedMCQ(
      `${levelId}-gen-q6`,
      `How does mastering "${title}" benefit students in real-world professional applications?`,
      'It empowers automation, efficient data processing, and robust problem-solving.',
      ['It restricts computers to offline standalone single-use tasks.', 'It eliminates the need for logical reasoning.', 'It prevents software collaboration.'],
      'Digital literacy and programming empower students to solve complex real-world challenges.'
    ),
    {
      id: `${levelId}-gen-7`,
      question: `Fill in the blank for IT terminology:`,
      type: 'fill-in-the-blank',
      blankSentence: `When implementing ${title}, developers rely on ______ structures to maintain clean code.`,
      correctAnswer: 'modular',
      explanation: 'Modular structures and functions promote code reusability and maintainability.'
    },
    {
      id: `${levelId}-gen-q8`,
      question: `Categorize this study principle:`,
      type: 'drag-drop',
      blankSentence: `The practice of finding and correcting errors in code related to ${title} is called ______.`,
      dragOptions: ['Debugging', 'Compilation', 'Formatting'],
      correctAnswer: 'Debugging',
      explanation: 'Debugging is the essential process of identifying and fixing bugs or syntax errors.'
    },
    {
      id: `${levelId}-gen-q9`,
      question: `Match the ICT term with its role in ${title}:`,
      type: 'match-following',
      leftItems: ['Syntax', 'Variable', 'Output'],
      rightItems: ['Grammar rules of language', 'Container for storing data', 'Displayed result in console'],
      correctAnswer: {
        'Syntax': 'Grammar rules of language',
        'Variable': 'Container for storing data',
        'Output': 'Displayed result in console'
      },
      explanation: 'Syntax defines rules; Variables store data; Output displays results.'
    },
    createRandomizedMCQ(
      `${levelId}-gen-q10`,
      `Why is understanding "${title}" important in modern computing?`,
      'It forms the foundational stepping stone for advanced software engineering and digital citizenship.',
      ['It is solely meant for memorization without practical application.', 'It has no relevance in practical computing.', 'It replaces all hardware requirements.'],
      'This bridges foundational theory with practical digital skills.'
    )
  ];

  return randomizeQuestions(generated);
};
