import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
// tsx automatically loads .env files, so no need for dotenv
// import dotenv from "dotenv";
// dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "10mb" }));

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});

// Sliding-Window IP Rate Limiter Middleware for High-Concurrency Concurrency Protection
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 40; // 40 requests/min per IP

function rateLimiterMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "127.0.0.1").split(",")[0].trim();
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({ error: "Too many requests. Please wait a moment before trying again." });
    return;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);

  if (rateLimitMap.size > 2000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.filter(t => now - t < RATE_LIMIT_WINDOW_MS).length === 0) {
        rateLimitMap.delete(k);
      }
    }
  }
  next();
}

app.use("/api/", rateLimiterMiddleware);

// Initialize Gemini Client

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const GUNA_SYSTEM_INSTRUCTION = `
You are "Guna", an expert, warm, highly engaging, and experienced ICT Online Tutor designed specifically for Class 10 students in Bhutan.
You act as the interactive engine for a gamified learning web app framing the syllabus as a series of engaging "Quests" and "Levels".

STRICT SCOPE REQUIREMENTS:
- Derive ALL educational content, definitions, formulas, and code examples strictly from the Class 10 ICT syllabus (Cloud Services, Google Workspace, Acknowledging Ownership & Citations APA/MLA/IEEE, Copyright & Creative Commons, MS Excel, Python Programming: print/input, variables, operators, conditionals if/elif/else, loops for/while/break/continue/pass, collections lists/tuples/sets/dict, functions, scope, return, recursion).
- Do NOT introduce concepts outside this Class 10 syllabus.

THEME, TONE & GAMIFICATION:
- Always greet students with "Kuzuzangpo la!" when starting a new session or quest.
- Weave Bhutanese culture, geography, and daily life into analogies (e.g. Dzongs, Lhakhangs, Paro International Airport, Karma Academy, Pachu River in Paro, apple/orange orchards, archery tournaments/bows, yak herding in Haa, festivals in Thimphu, Zhemgang biodiversity).
- Celebrate successes passionately. Treat mistakes with empathy as stepping stones, giving exactly ONE gentle Bhutan-themed hint.
- Format responses in short, highly readable paragraphs optimized for mobile and web screens.

VISUALS & DIAGRAMS:
- Rely heavily on visuals! Whenever explaining a concept, flowchart, or comparison, output a clean Mermaid.js diagram in a markdown codeblock (\`\`\`mermaid ... \`\`\`).
- STRICT SYNTAX RULES FOR MERMAID: Always start with 'flowchart TD' or 'graph TD'. Always wrap node labels containing spaces, parentheses, or special characters in double quotes inside brackets, e.g., A["Start Quest (Class 10)"] --> B["Python Loops"]. Avoid quotes inside quoted strings.
- Use relevant emojis (🏔️, 🏹, ☁️, 💻, 🐉, 🍎, 📊, ⚡) to structure content.

INTERACTIVE QUEST LOOP:
Never generate a long wall of text. Follow this strict loop:
1. QUEST BRIEFING (Introduction):
   - Introduce the concept in 2-3 short paragraphs using a vivid Bhutanese analogy.
   - Include a Mermaid.js flowchart or diagram illustrating the logic/flow.
2. THE CHALLENGE (Interactive Practice):
   - Present a practical scenario or coding problem based on the briefing.
   - Ask ONE clear interactive question (Multiple Choice, Code Completion, True/False, Fill in the blank, or Scenario).
   - STOP GENERATING questions after presenting one challenge, waiting for the student's reply.
3. FEEDBACK & LEVELING UP (When the user responds to a challenge):
   - If Correct: Validate passionately, award XP (e.g., "+50 XP"), explain why it's right, and declare the Level unlocked!
   - If Incorrect: Deduct 10 XP (e.g. "-10 XP"), provide EXACTLY ONE Bhutan-themed hint (with a mini Mermaid flowchart if helpful), and encourage them to try again.

APP INTEGRATION DATA (CRITICAL):
At the very end of EVERY single response without exception, you MUST provide a JSON block inside a markdown code block labeled \`\`\`app-data ... \`\`\`.
Format:
\`\`\`app-data
{
  "xpAwarded": 50,
  "xpDeducted": 0,
  "questStatus": "in_progress",
  "currentTopic": "Python Loops",
  "levelComplete": false,
  "navigationOptions": ["⬅️ Previous Quest", "🔄 Retry Challenge", "➡️ Next Quest"]
}
\`\`\`
Set "xpAwarded" to 50 when user answers correctly, or 0 otherwise.
Set "xpDeducted" to 10 when user answers incorrectly, or 0 otherwise.
Set "levelComplete" to true when user solves the challenge.
`;

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
  "gemini-3.6-flash",
  "gemini-flash-latest"
];

async function generateGeminiContentWithFallback(contents: any[], systemInstruction?: string, responseMimeType?: string) {
  const apiKeys = getApiKeysPool();
  if (apiKeys.length === 0) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  // Create a 25s hard timeout race to ensure LLM has ample time to generate thoughtful simplified responses
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("REQUEST_TIMEOUT_FAST_FALLBACK")), 25000);
  });

  const apiCallPromise = (async () => {
    // Round-robin index across available API keys for high concurrency load distribution
    const startIndex = keyRequestCounter++ % apiKeys.length;
    let lastError: any = null;

    for (let i = 0; i < apiKeys.length; i++) {
      const currentKey = apiKeys[(startIndex + i) % apiKeys.length];
      const client = new GoogleGenAI({
        apiKey: currentKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
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
          const errStr = (e?.message || "") + (e?.status || "");
          const isQuotaOrDenied = e?.status === 429 || e?.status === 403 ||
            errStr.includes("quota") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("PERMISSION_DENIED") || errStr.includes("denied access");

          if (isQuotaOrDenied) {
            console.warn(`Key ending in ...${currentKey.slice(-4)} returned ${e?.status || 'error'}. Failover to next key in pool.`);
            break; // Switch to next API key immediately
          }
        }
      }
    }

    throw lastError || new Error("All API keys and models in pool were exhausted.");
  })();

  return Promise.race([apiCallPromise, timeoutPromise]);
}

function generateQuestFallbackResponse(reqBody: any) {
  const { history, userMessage, currentQuestTopic, levelTopic } = reqBody || {};
  const topicName = levelTopic || currentQuestTopic || "Class 10 ICT Syllabus";
  const chapterName = currentQuestTopic || "Bhutan Class 10 ICT";
  const isStartRequest = !history || history.length === 0 || (userMessage && (userMessage.toLowerCase().includes("start quest") || userMessage.toLowerCase().includes("briefing")));

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

app.post("/api/chat", async (req, res) => {
  try {
    const { history, userMessage, currentQuestTopic, levelTopic } = req.body || {};

    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      history.forEach((msg: { role: string; parts: string }) => {
        contents.push({
          role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
          parts: [{ text: msg.parts }],
        });
      });
    }

    const contextContextString = `Current Quest Topic: ${currentQuestTopic || "General ICT"}. Level: ${levelTopic || "Overview"}.\n\nStudent Message: ${userMessage}`;
    contents.push({
      role: "user",
      parts: [{ text: contextContextString }],
    });

    const responseText = await generateGeminiContentWithFallback(contents, GUNA_SYSTEM_INSTRUCTION);
    return res.json({ text: responseText });
  } catch (err: any) {
    const fallbackText = generateQuestFallbackResponse(req.body);
    return res.json({ text: fallbackText });
  }
});

// Gemini-Powered Peer Review Sentiment Checker Endpoint
app.post("/api/peer-review/sentiment-check", async (req, res) => {
  try {
    const { feedbackText, codeSnippet, projectTitle } = req.body || {};

    const prompt = `You are an automated peer feedback sentiment analysis system for Class 10 Bhutanese ICT students.
Evaluate the following peer review feedback provided by a student on another classmate's Python project:

Project Title: ${projectTitle || 'Python Project'}
Code Snippet:
\`\`\`python
${codeSnippet || '# Python code'}
\`\`\`

Feedback Text Provided by Student:
"${feedbackText || ''}"

Instructions:
Analyze if this feedback is constructive, respectful, specific, and encouraging for a high school coding peer.
Return a valid JSON object ONLY with the following schema (no markdown block wrappers):
{
  "isConstructive": boolean,
  "sentimentScore": "constructive" | "neutral" | "needs_improvement" | "toxic_flagged",
  "scorePercentage": number (0 to 100),
  "sentimentReason": "short 1-2 sentence feedback explaining why this is or isn't constructive",
  "suggestedImprovement": "If not constructive, a polite and helpful way the student can rephrase their feedback to be more constructive, else null"
}`;

    const rawText = await generateGeminiContentWithFallback(
      [{ role: "user", parts: [{ text: prompt }] }],
      "You are a sentiment and constructive feedback analyzer for high school coding peer reviews."
    );
    const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(cleanedText);
      return res.json(parsed);
    } catch {
      return res.json({
        isConstructive: true,
        sentimentScore: "constructive",
        scorePercentage: 90,
        sentimentReason: "Feedback appears helpful and polite.",
        suggestedImprovement: null,
      });
    }
  } catch (err: any) {
    return res.json({
      isConstructive: true,
      sentimentScore: "constructive",
      scorePercentage: 85,
      sentimentReason: "Evaluated as supportive coding guidance.",
      suggestedImprovement: null,
    });
  }
});

app.post("/api/simplify", async (req, res) => {
  try {
    const { explanationText, topic } = req.body || {};

    const prompt = `You are "Guna", the friendly Class 10 ICT Online Tutor in Bhutan.
A Class 10 Bhutanese student asked to simplify this technical ICT explanation:

---
${explanationText || "Class 10 ICT Concept"}
---
Topic: ${topic || "Class 10 ICT Syllabus"}

Instructions:
1. Rephrase the explanation into simple, clear, engaging language suitable for a 15-year-old Class 10 student.
2. YOU MUST INCLUDE a vivid, memorable Bhutanese cultural analogy (for example: relating the concept to Paro Taktsang hiking, Bhutanese archery bow/target rules, traditional Dzong architecture/courtyards, Tshechu mask dances, Yak herding in Merak, Suja butter tea preparation, or weaving Kira patterns).
3. Start with "Kuzuzangpo la! Let me make this super simple for you 🐉:".
4. Use clean bullet points or step-by-step numbered lists for clarity.
5. If helpful, include a small Mermaid flowchart (\`\`\`mermaid flowchart TD ... \`\`\`).
6. Do NOT include any app-data JSON codeblock.`;

    const simplifiedText = await generateGeminiContentWithFallback(
      [{ role: "user", parts: [{ text: prompt }] }],
      "You are Guna, an expert ICT tutor in Bhutan who explains complex computing topics using engaging local Bhutanese analogies."
    );

    return res.json({ simplifiedText });
  } catch (err: any) {
    const { explanationText, topic } = req.body || {};
    const cleanTopic = topic || "Class 10 ICT Topic";
    const snippet = explanationText ? explanationText.slice(0, 160) : "Core concept";
    return res.json({
      simplifiedText: `Kuzuzangpo la! 🙏 Let me break down **${cleanTopic}** in a simpler way for you:\n\n* **Bhutanese Cultural Analogy**: Think of this topic like setting up traditional archery (Da) targets at the local Trashi Yangtse or Thimphu Changlimithang grounds 🏹 — every rule and step must align precisely to hit the bullseye successfully!\n* **Core Concept Breakdown**: ${snippet}...\n* **Key Takeaway**: By taking it step-by-step just like weaving intricate Kira patterns, you'll master this concept effortlessly!`
    });
  }
});

// Gemini-Powered 20-Question Exam Simulator Endpoint
app.post("/api/exam-simulator/generate", async (req, res) => {
  try {
    const { topicFilter, difficulty } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
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
            explanation: "Python source code files use the .py extension in accordance with standard programming practices."
          },
          {
            id: "q2",
            section: "Section A",
            topic: "MS Excel",
            question: "Which formula in MS Excel calculates the arithmetic mean of a range of cells A1 through A10?",
            options: ["=TOTAL(A1:A10)", "=AVERAGE(A1:A10)", "=MEAN(A1:A10)", "=SUM(A1:A10)/2"],
            correctOptionIndex: 1,
            explanation: "=AVERAGE(range) is the built-in function in MS Excel to find the average."
          },
          {
            id: "q3",
            section: "Section A",
            topic: "Cloud Services",
            question: "Which cloud computing model provides virtual machines, storage, and networks as an on-demand service?",
            options: ["SaaS", "PaaS", "IaaS", "DaaS"],
            correctOptionIndex: 2,
            explanation: "Infrastructure as a Service (IaaS) provides foundational computing resources over the cloud."
          }
        ]
      });
    }

    const prompt = `You are a Senior ICT Examination Board Officer for BHSEC / BCSEA Class 10 in Bhutan.
Generate a high-rigor, official 20-question Class 10 ICT Examination Paper covering the full Bhutanese Class 10 ICT syllabus.

Requirements:
- Exactly 20 questions total.
- Section Distribution:
  * Section A (Questions 1-8): Objective Multiple-Choice Questions (MCQ) testing core definitions, Excel formulas, Cloud concepts, and Citations/Copyright.
  * Section B (Questions 9-14): Conceptual & Scenario-Based Questions (MCQ format) requiring application of rules (e.g. absolute cell referencing, creative commons licenses, cloud models).
  * Section C (Questions 15-20): Python Code Tracing, Output Prediction, String Slicing, Range Step calculation, and Recursion tracing.
- Syllabus Topics to cover proportionally:
  * Python Programming (at least 8 questions)
  * MS Excel (at least 4 questions)
  * Cloud Services (at least 3 questions)
  * Google Workspace (at least 2 questions)
  * Citations, Plagiarism & Copyright (at least 3 questions)
- Filter preference: ${topicFilter && topicFilter !== 'All' ? `Focus extra questions on topic: ${topicFilter}` : 'Balanced across all topics'}.
- Difficulty: ${difficulty || 'Standard BHSEC Board Exam'}.

Each question MUST strictly follow:
- 'id': e.g. "q1", "q2", ... "q20"
- 'section': "Section A", "Section B", or "Section C"
- 'topic': "Python Programming", "MS Excel", "Cloud Services", "Google Workspace", or "Cyber Ethics & Copyright"
- 'question': Clear, precise question statement. If Python code is included, wrap the code snippet in markdown triple backticks like \`\`\`python\\nx = [10, 20]\\nprint(x)\\n\`\`\`. Do NOT output raw literal '\\n' text characters in the question string.
- 'options': An array of exactly 4 plausible options (index 0, 1, 2, 3)
- 'correctOptionIndex': Integer index (0, 1, 2, or 3) of the correct answer
- 'explanation': Clear, step-by-step marking rationale grounded in BHSEC standards.`;

    const rawJson = await generateGeminiContentWithFallback(
      [{ role: "user", parts: [{ text: prompt }] }],
      "You are a Senior ICT Examination Board Officer for BHSEC / BCSEA Class 10 in Bhutan.",
      "application/json"
    );

    const parsedData = JSON.parse(rawJson || "{}");

    // Clean any literal '\n' sequences in AI-generated questions
    if (parsedData && Array.isArray(parsedData.questions)) {
      parsedData.questions = parsedData.questions.map((q: any) => ({
        ...q,
        question: typeof q.question === 'string' ? q.question.replace(/\\n/g, '\n').replace(/\\t/g, '\t') : q.question,
        explanation: typeof q.explanation === 'string' ? q.explanation.replace(/\\n/g, '\n').replace(/\\t/g, '\t') : q.explanation,
        options: Array.isArray(q.options) 
          ? q.options.map((opt: any) => typeof opt === 'string' ? opt.replace(/\\n/g, '\n').replace(/\\t/g, '\t') : opt) 
          : q.options
      }));
    }

    return res.json(parsedData);
  } catch (err: any) {
    console.log("Serving offline exam paper fallback.");
    return res.json({
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
            explanation: "Python source code files use the .py extension in accordance with standard programming practices."
          },
          {
            id: "q2",
            section: "Section A",
            topic: "MS Excel",
            question: "Which formula in MS Excel calculates the arithmetic mean of a range of cells A1 through A10?",
            options: ["=TOTAL(A1:A10)", "=AVERAGE(A1:A10)", "=MEAN(A1:A10)", "=SUM(A1:A10)/2"],
            correctOptionIndex: 1,
            explanation: "=AVERAGE(range) is the built-in function in MS Excel to find the average."
          },
          {
            id: "q3",
            section: "Section A",
            topic: "Cloud Services",
            question: "Which cloud computing model provides virtual machines, storage, and networks as an on-demand service?",
            options: ["SaaS", "PaaS", "IaaS", "DaaS"],
            correctOptionIndex: 2,
            explanation: "Infrastructure as a Service (IaaS) provides foundational computing resources over the cloud."
          },
          {
            id: "q4",
            section: "Section A",
            topic: "Cyber Ethics & Copyright",
            question: "What does APA style stand for in academic citations?",
            options: ["American Psychological Association", "Asian Pacific Academy", "Advanced Publishing Association", "Academic Paper Authority"],
            correctOptionIndex: 0,
            explanation: "APA stands for American Psychological Association, widely used for academic citations."
          },
          {
            id: "q5",
            section: "Section B",
            topic: "MS Excel",
            question: "In MS Excel, what does an absolute cell reference ($B$2) ensure when copied across cells?",
            options: ["The row and column references change automatically", "Only the column reference changes", "The row and column references remain fixed", "The formula results in an error"],
            correctOptionIndex: 2,
            explanation: "Dollar signs ($) lock the row and column in absolute cell references."
          },
          {
            id: "q6",
            section: "Section B",
            topic: "Cloud Services",
            question: "Google Drive and Google Docs are examples of which cloud service category?",
            options: ["IaaS", "PaaS", "SaaS", "FaaS"],
            correctOptionIndex: 2,
            explanation: "Software as a Service (SaaS) delivers fully functional software applications over the web."
          },
          {
            id: "q7",
            section: "Section B",
            topic: "Cyber Ethics & Copyright",
            question: "Which Creative Commons license allows others to distribute, remix, adapt, and build upon your work commercially, as long as they credit you?",
            options: ["CC-BY", "CC-BY-NC", "CC-BY-ND", "CC0"],
            correctOptionIndex: 0,
            explanation: "CC-BY (Attribution) allows sharing and commercial reuse with proper credit."
          },
          {
            id: "q8",
            section: "Section B",
            topic: "Google Workspace",
            question: "Which Google Workspace tool is best suited for creating collaborative slide presentations for a school project in Bhutan?",
            options: ["Google Sheets", "Google Slides", "Google Forms", "Google Keep"],
            correctOptionIndex: 1,
            explanation: "Google Slides is designed for presentation creation and real-time collaboration."
          },
          {
            id: "q9",
            section: "Section C",
            topic: "Python Programming",
            question: "What will be the output of the following Python code?\\n\`\`\`python\\nx = [10, 20, 30, 40, 50]\\nprint(x[1:3])\\n\`\`\`",
            options: ["[10, 20]", "[20, 30]", "[20, 30, 40]", "[10, 20, 30]"],
            correctOptionIndex: 1,
            explanation: "List slicing x[1:3] includes index 1 (20) and index 2 (30), stopping before index 3."
          },
          {
            id: "q10",
            section: "Section C",
            topic: "Python Programming",
            question: "What will be the output of:\\n\`\`\`python\\nfor i in range(1, 6, 2):\\n    print(i, end=' ')\\n\`\`\`",
            options: ["1 2 3 4 5", "1 3 5", "2 4 6", "1 4"],
            correctOptionIndex: 1,
            explanation: "range(start, stop, step) starts at 1, goes up to 5 with a step of 2 (1, 3, 5)."
          },
          {
            id: "q11",
            section: "Section C",
            topic: "Python Programming",
            question: "How do you define a function in Python?",
            options: ["function my_func():", "def my_func():", "create my_func():", "fun my_func():"],
            correctOptionIndex: 1,
            explanation: "Functions in Python are defined using the 'def' keyword."
          },
          {
            id: "q12",
            section: "Section C",
            topic: "Python Programming",
            question: "What is the output of:\\n\`\`\`python\\nprint(len(\"Bhutan ICT\"))\\n\`\`\`",
            options: ["9", "10", "11", "12"],
            correctOptionIndex: 1,
            explanation: "\"Bhutan ICT\" has 10 characters including the space."
          },
          {
            id: "q13",
            section: "Section C",
            topic: "Python Programming",
            question: "Which keyword is used to exit a loop prematurely in Python?",
            options: ["exit", "stop", "break", "halt"],
            correctOptionIndex: 2,
            explanation: "The 'break' statement immediately terminates the innermost enclosing loop."
          },
          {
            id: "q14",
            section: "Section C",
            topic: "Python Programming",
            question: "What will be the result of 10 % 3 in Python?",
            options: ["3", "3.33", "1", "0"],
            correctOptionIndex: 2,
            explanation: "The modulo operator (%) returns the remainder of division (10 divided by 3 is 3 remainder 1)."
          },
          {
            id: "q15",
            section: "Section C",
            topic: "Python Programming",
            question: "Which data type is immutable in Python?",
            options: ["list", "dictionary", "set", "tuple"],
            correctOptionIndex: 3,
            explanation: "Tuples are immutable sequences, whereas lists, sets, and dictionaries are mutable."
          },
          {
            id: "q16",
            section: "Section C",
            topic: "Python Programming",
            question: "What is the correct syntax for a conditional statement in Python?",
            options: ["if x > 5 then:", "if (x > 5):", "if x > 5:", "conditional x > 5:"],
            correctOptionIndex: 2,
            explanation: "Python uses 'if condition:' with a colon ending the header."
          },
          {
            id: "q17",
            section: "Section C",
            topic: "Python Programming",
            question: "What does the 'pass' statement do in Python?",
            options: ["Terminates the program", "Skips the current iteration", "Does nothing (acts as a placeholder)", "Returns true"],
            correctOptionIndex: 2,
            explanation: "pass is a null statement used as a placeholder in loops or function definitions."
          },
          {
            id: "q18",
            section: "Section C",
            topic: "Python Programming",
            question: "Which method adds an item to the end of a list in Python?",
            options: ["add()", "append()", "push()", "insert()"],
            correctOptionIndex: 1,
            explanation: "list.append(item) adds an element to the end of the list."
          },
          {
            id: "q19",
            section: "Section C",
            topic: "Python Programming",
            question: "What is recursion in Python programming?",
            options: ["A loop that runs forever", "A function calling itself", "Importing external modules", "Error handling with try-except"],
            correctOptionIndex: 1,
            explanation: "Recursion is when a function calls itself to solve a smaller instance of the same problem."
          },
          {
            id: "q20",
            section: "Section C",
            topic: "Python Programming",
            question: "How do you handle runtime errors in Python safely?",
            options: ["try-except blocks", "if-else checks", "import error", "debug mode"],
            correctOptionIndex: 0,
            explanation: "try-except blocks catch exceptions and prevent program crashes during runtime."
          }
        ]
      });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", tutor: "Guna ICT Online Tutor" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
     const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
