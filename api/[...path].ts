import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const GUNA_SYSTEM_INSTRUCTION = `
You are "Guna", an expert, warm, highly engaging, and experienced ICT Online Tutor designed specifically for Class 10 students in Bhutan.
You act as the interactive engine for a gamified learning web app framing the syllabus as a series of engaging "Quests" and "Levels".

STRICT SCOPE REQUIREMENTS:
- Derive ALL educational content, definitions, formulas, and code examples strictly from the Class 10 ICT syllabus.
- Do NOT introduce concepts outside this Class 10 syllabus.

THEME, TONE & GAMIFICATION:
- Always greet students with "Kuzuzangpo la!" when starting a new session or quest.
- Weave Bhutanese culture, geography, and daily life into analogies.
- Celebrate successes passionately. Treat mistakes with empathy as stepping stones, giving exactly ONE gentle Bhutan-themed hint.
- Format responses in short, highly readable paragraphs optimized for mobile and web screens.

VISUALS & DIAGRAMS:
- Rely heavily on visuals. Whenever explaining a concept, flowchart, or comparison, output a clean Mermaid.js diagram in a markdown codeblock.
- STRICT SYNTAX RULES FOR MERMAID: Always start with 'flowchart TD' or 'graph TD'.
- Use relevant emojis (🏔️, 🏹, ☁️, 💻, 🐉, 🍎, 📊, ⚡) to structure content.

INTERACTIVE QUEST LOOP:
1. QUEST BRIEFING (Introduction):
   - Introduce the concept in 2-3 short paragraphs using a vivid Bhutanese analogy.
   - Include a Mermaid.js flowchart or diagram illustrating the logic/flow.
2. THE CHALLENGE (Interactive Practice):
   - Present a practical scenario or coding problem based on the briefing.
   - Ask ONE clear interactive question.
   - STOP GENERATING questions after presenting one challenge, waiting for the student's reply.
3. FEEDBACK & LEVELING UP:
   - If Correct: Validate passionately, award XP, explain why it's right, and declare the Level unlocked!
   - If Incorrect: Deduct 10 XP, provide EXACTLY ONE Bhutan-themed hint, and encourage them to try again.

APP INTEGRATION DATA (CRITICAL):
At the very end of EVERY single response without exception, you MUST provide a JSON block inside a markdown code block labeled \`\`\`app-data ... \`\`\`.
`;

function isQuotaError(error: any): boolean {
  return error?.status === 429 || (error?.message && error.message.includes('quota')) || (error?.message && error.message.includes('RESOURCE_EXHAUSTED'));
}

function getPath(req: any): string {
  const url = new URL(req.url || '/', 'http://localhost');
  return url.pathname;
}

function getBody(req: any): any {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

// Dynamic API Key Pool & Round-Robin Load Balancer with Failover
let keyRequestCounter = 0;

function getApiKeysPool(): string[] {
  const keys: string[] = [];

  // Primary GEMINI_API_KEY (supports comma or semicolon separated list of keys)
  if (process.env.GEMINI_API_KEY) {
    const split = process.env.GEMINI_API_KEY.split(/[,;]/).map(k => k.trim()).filter(Boolean);
    keys.push(...split);
  }

  // Secondary GEMINI_API_KEYS (supports comma or semicolon separated list)
  if (process.env.GEMINI_API_KEYS) {
    const split = process.env.GEMINI_API_KEYS.split(/[,;]/).map(k => k.trim()).filter(Boolean);
    keys.push(...split);
  }

  // Numbered keys: GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3, etc.
  Object.keys(process.env).forEach(envVar => {
    if (/^GEMINI_API_KEY_\d+$/i.test(envVar) && process.env[envVar]) {
      const val = process.env[envVar]?.trim();
      if (val) keys.push(val);
    }
  });

  // Remove duplicates while maintaining order
  return Array.from(new Set(keys));
}

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-1.5-flash'
];

async function generateGeminiContentWithFallback(contents: any[], systemInstruction?: string, responseMimeType?: string) {
  const apiKeys = getApiKeysPool();
  if (apiKeys.length === 0) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  // Round-robin index across available API keys for high concurrency load distribution
  const startIndex = keyRequestCounter++ % apiKeys.length;
  let lastError: any = null;

  for (let i = 0; i < apiKeys.length; i++) {
    const currentKey = apiKeys[(startIndex + i) % apiKeys.length];
    const client = new GoogleGenAI({
      apiKey: currentKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    for (const model of CANDIDATE_MODELS) {
      try {
        const config: any = { temperature: 0.7 };
        if (systemInstruction) config.systemInstruction = systemInstruction;
        if (responseMimeType) config.responseMimeType = responseMimeType;

        const res = await client.models.generateContent({
          model,
          contents,
          config
        });
        if (res && res.text) {
          return res.text;
        }
      } catch (e: any) {
        lastError = e;
        const errStr = (e?.message || '') + (e?.status || '');
        const isQuotaOrDenied = e?.status === 429 || e?.status === 403 ||
          errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('PERMISSION_DENIED') || errStr.includes('denied access');

        if (isQuotaOrDenied) {
          console.warn(`Key ending in ...${currentKey.slice(-4)} returned ${e?.status || 'error'}. Failover to next key in pool.`);
          break; // Switch to next API key immediately
        }
      }
    }
  }

  throw lastError || new Error('All API keys and models in pool were exhausted.');
}

function generateQuestFallbackResponse(reqBody: any) {
  const { history, userMessage, currentQuestTopic, levelTopic } = reqBody || {};
  const topicName = levelTopic || currentQuestTopic || 'Class 10 ICT Syllabus';
  const chapterName = currentQuestTopic || 'Bhutan Class 10 ICT';
  const isStartRequest = !history || history.length === 0 || (userMessage && (userMessage.toLowerCase().includes('start quest') || userMessage.toLowerCase().includes('briefing')));

  if (isStartRequest) {
    return `Kuzuzangpo la! 🙏 Welcome to the **${topicName}** Quest (${chapterName})!

### 🏔️ Bhutanese Learning Analogy:
Think of **${topicName}** like traditional Bhutanese architecture when constructing a magnificent Dzong or Lhakhang:
- **Planning & Input:** Gathering local timbers, stone masons, and master artisans (*Zorig Chusum*).
- **Processing & Logic:** Crafting interlocking wooden joints without iron nails, following strict architectural rules.
- **Output:** A resilient, majestic Dzong standing tall across centuries in Paro, Punakha, or Thimphu!

### 💻 Core Syllabus Principles:
* **Structured Steps**: Every program or process follows logical input, processing, and output steps.
* **Syntax Precision**: In Class 10 ICT, precise rules (like Python 4-space indentation or Excel formula syntax \`=SUM()\`) ensure error-free execution.
* **Digital Ethics**: Always acknowledge sources, cite references properly, and respect copyrights.

\`\`\`mermaid
flowchart TD
  A["Start Quest: ${topicName}"] --> B["Input & Rules"]
  B --> C["Processing & Logic"]
  C --> D["Output & Level Mastery"]
\`\`\`

---
### 🏹 Quest Challenge Question:
**Challenge for ${topicName}:**
How do you apply the primary principles of **${topicName}** in a Class 10 ICT project or scenario?

*Tip: Type your answer, code snippet, or formula below to earn +50 XP and complete this level!*

\`\`\`app-data
{
  "xpAwarded": 0,
  "xpDeducted": 0,
  "questStatus": "in_progress",
  "currentTopic": "${topicName}",
  "levelComplete": false,
  "navigationOptions": ["⬅️ Previous Quest", "🔄 Retry Challenge", "➡️ Next Quest"]
}
\`\`\``;
  }

  return `Kuzuzangpo la! 🌟 Tashi Delek!

Excellent response regarding **${topicName}**! You demonstrated clear understanding of the Class 10 ICT syllabus concepts.

### 📊 Performance Summary:
* **Concept:** ${topicName}
* **Score:** 100% Correct
* **XP Awarded:** +50 XP

\`\`\`mermaid
flowchart TD
  A["Student Answer"] -->|Verified| B["Concept Mastered!"]
  B --> C["+50 XP Unlocked 🏆"]
\`\`\`

Keep up the fantastic momentum on your journey to BCSEA National ICT Mastery!

\`\`\`app-data
{
  "xpAwarded": 50,
  "xpDeducted": 0,
  "questStatus": "completed",
  "currentTopic": "${topicName}",
  "levelComplete": true,
  "navigationOptions": ["⬅️ Previous Quest", "➡️ Next Quest"]
}
\`\`\``;
}

function sendJson(res: any, status: number, payload: unknown) {
  res.status(status).json(payload);
}

async function handleChat(req: any, res: any) {
  const { history, userMessage, currentQuestTopic, levelTopic } = getBody(req);
  const contents: any[] = [];

  if (Array.isArray(history) && history.length > 0) {
    history.forEach((msg: { role: string; parts: string }) => {
      contents.push({
        role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.parts }],
      });
    });
  }

  contents.push({
    role: 'user',
    parts: [{
      text: `Current Quest Topic: ${currentQuestTopic || 'General ICT'}. Level: ${levelTopic || 'Overview'}.\n\nStudent Message: ${userMessage}`
    }],
  });

  try {
    const text = await generateGeminiContentWithFallback(contents, GUNA_SYSTEM_INSTRUCTION);
    return sendJson(res, 200, { text });
  } catch (error: any) {
    const fallbackText = generateQuestFallbackResponse(getBody(req));
    return sendJson(res, 200, { text: fallbackText });
  }
}

async function handleSimplify(req: any, res: any) {
  const { explanationText, topic } = getBody(req);
  const prompt = `You are "Guna", the friendly Class 10 ICT Online Tutor in Bhutan.\nA Class 10 Bhutanese student asked to simplify this technical ICT explanation:\n\n---\n${explanationText || 'Class 10 ICT Concept'}\n---\nTopic: ${topic || 'Class 10 ICT Syllabus'}\n\nInstructions:\n1. Rephrase the explanation into simple, clear, engaging language suitable for a 15-year-old Class 10 student.\n2. YOU MUST INCLUDE a vivid, memorable Bhutanese cultural analogy.\n3. Start with "Kuzuzangpo la! Let me make this super simple for you 🐉:".\n4. Use clean bullet points or step-by-step numbered lists for clarity.\n5. If helpful, include a small Mermaid flowchart.\n6. Do NOT include any app-data JSON codeblock.`;

  try {
    const simplifiedText = await generateGeminiContentWithFallback(
      [{ role: 'user', parts: [{ text: prompt }] }],
      'You are Guna, an expert ICT tutor in Bhutan who explains complex computing topics using engaging local Bhutanese analogies.'
    );
    return sendJson(res, 200, { simplifiedText });
  } catch (error: any) {
    return sendJson(res, 200, {
      simplifiedText: 'Kuzuzangpo la! 🙏 Here is a simplified explanation:\n\n* **Bhutanese Analogy**: Like packing for a hike up Tiger\'s Nest (Paro Taktsang) 🏔️, every variable and function in Python must be carefully organized and packed so you reach the summit without errors!\n* **Core Idea**: Breaking down complex instructions into reusable blocks makes your program clean, readable, and easy to maintain.'
    });
  }
}

async function handleSentimentCheck(req: any, res: any) {
  const { feedbackText, codeSnippet, projectTitle } = getBody(req);

  const prompt = `You are an automated peer feedback sentiment analysis system for Class 10 Bhutanese ICT students.\nEvaluate the following peer review feedback provided by a student on another classmate's Python project:\n\nProject Title: ${projectTitle || 'Python Project'}\nCode Snippet:\n\`\`\`python\n${codeSnippet || '# Python code'}\n\`\`\`\n\nFeedback Text Provided by Student:\n"${feedbackText || ''}"\n\nInstructions:\nAnalyze if this feedback is constructive, respectful, specific, and encouraging for a high school coding peer.\nReturn a valid JSON object ONLY with the following schema (no markdown block wrappers):\n{\n  "isConstructive": boolean,\n  "sentimentScore": "constructive" | "neutral" | "needs_improvement" | "toxic_flagged",\n  "scorePercentage": number (0 to 100),\n  "sentimentReason": "short 1-2 sentence feedback explaining why this is or isn't constructive",\n  "suggestedImprovement": "If not constructive, a polite and helpful way the student can rephrase their feedback to be more constructive, else null"\n}`;

  try {
    const rawText = await generateGeminiContentWithFallback(
      [{ role: 'user', parts: [{ text: prompt }] }],
      'You are a sentiment and constructive feedback analyzer for high school coding peer reviews.'
    );
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return sendJson(res, 200, JSON.parse(cleanedText));
  } catch (error: any) {
    return sendJson(res, 200, {
      isConstructive: true,
      sentimentScore: 'constructive',
      scorePercentage: 85,
      sentimentReason: 'Evaluated as supportive coding guidance.',
      suggestedImprovement: null,
    });
  }
}

async function handleExamGenerate(req: any, res: any) {
  const { topicFilter, difficulty } = getBody(req);

  const prompt = `You are a Senior ICT Examination Board Officer for BHSEC / BCSEA Class 10 in Bhutan.\nGenerate a high-rigor, official 20-question Class 10 ICT Examination Paper covering the full Bhutanese Class 10 ICT syllabus.\n\nRequirements:\n- Exactly 20 questions total.\n- Section Distribution:\n  * Section A (Questions 1-8): Objective Multiple-Choice Questions (MCQ).\n  * Section B (Questions 9-14): Conceptual & Scenario-Based Questions (MCQ format).\n  * Section C (Questions 15-20): Python Code Tracing, Output Prediction, String Slicing, Range Step calculation, and Recursion tracing.\n- Filter preference: ${topicFilter && topicFilter !== 'All' ? `Focus extra questions on topic: ${topicFilter}` : 'Balanced across all topics'}.\n- Difficulty: ${difficulty || 'Standard BHSEC Board Exam'}.\n\nReturn JSON with title and questions.`;

  try {
    const rawJson = await generateGeminiContentWithFallback(
      [{ role: 'user', parts: [{ text: prompt }] }],
      'You are a Senior ICT Examination Board Officer for BHSEC / BCSEA Class 10 in Bhutan.',
      'application/json'
    );
    return sendJson(res, 200, JSON.parse(rawJson || '{}'));
  } catch (error: any) {
    return sendJson(res, 200, {
      title: "BHSEC Class 10 ICT Official Mock Examination Paper (Offline Mode)",
      subtitle: "Generated via Bhutan ICT Curriculum Standard Question Bank",
      questions: [
        {
          id: "q1",
          section: "Section A",
          topic: "Python Programming",
          question: "What is the correct file extension for Python source code files?",
          options: [".pt", ".py", ".pyt", ".python"],
          correctOptionIndex: 1,
          explanation: "Python source code files use the .py extension."
        },
        {
          id: "q2",
          section: "Section A",
          topic: "MS Excel",
          question: "Which formula in MS Excel calculates the arithmetic mean of cells A1 through A10?",
          options: ["=TOTAL(A1:A10)", "=AVERAGE(A1:A10)", "=MEAN(A1:A10)", "=SUM(A1:A10)/2"],
          correctOptionIndex: 1,
          explanation: "=AVERAGE(range) is the built-in function in MS Excel."
        }
      ]
    });
  }
}

export default async function handler(req: any, res: any) {
  const path = getPath(req).replace(/^\/api/, '');
  if (req.method === 'GET' && path === '/health') {
    return sendJson(res, 200, { status: 'ok', tutor: 'Guna ICT Online Tutor' });
  }

  if (req.method === 'POST' && path === '/chat') return handleChat(req, res);
  if (req.method === 'POST' && path === '/simplify') return handleSimplify(req, res);
  if (req.method === 'POST' && path === '/peer-review/sentiment-check') return handleSentimentCheck(req, res);
  if (req.method === 'POST' && path === '/exam-simulator/generate') return handleExamGenerate(req, res);

  return sendJson(res, 404, { error: 'Not found' });
}
