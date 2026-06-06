import { LESSONS_DATA } from './lessons_data.js';
import { QUIZ_DATA } from '../questions.js';
import { switchView } from './navigation.js';
import { state } from './state.js';
import { SPEC_CHECKLIST_DATA } from './spec_checklist_data.js';
import { addXp } from './views.js';

let searchDatabase = [];
let chatHistory = [];

let quizState = {
  isActive: false,
  questions: [],
  currentIndex: 0,
  score: 0,
  answersShuffled: []
};

let gradingState = {
  isActive: false
};

const examinerSystemInstruction = `You are a strict, professional GCSE History Examiner for Edexcel Paper 3 USA. 
Your task is to grade the student's PEEL paragraph contribution to a 12-mark or 16-mark essay.
Grade the paragraph out of 4 marks:
- 1 mark for a clear Point.
- 1 mark for precise historical Evidence (specific years, names, numbers, events).
- 1 mark for clear Explanation of HOW/WHY the evidence supports the point.
- 1 mark for a Link sentence connecting back to the essay topic/question.

Structure your response strictly as follows:
**GCSE Examiner Grade:** [Score]/4

- **Point (P):** [Evaluation of whether they have a clear point/topic sentence]
- **Evidence (E):** [Evaluation of their facts/dates/specific details]
- **Explanation (E):** [Evaluation of their explanation connecting facts to the point]
- **Link (L):** [Evaluation of their concluding sentence connecting to the question]

**WWW (What Went Well):** [Encouraging feedback highlighting a strong area]
**EBI (Even Better If):** [One specific actionable improvement]

Keep feedback concise, professional, encouraging, and under 150 words.`;

const SEARCH_ALIASES = {
  "mlk": "martin luther king jr leader civil rights non violence",
  "sclc": "southern christian leadership conference mlk church pastors",
  "sncc": "student nonviolent coordinating committee sit ins students john lewis",
  "core": "congress of racial equality freedom rides sit ins jim crow",
  "naacp": "national association for the advancement of colored people thurgood marshall litigation",
  "little rock 9": "little rock nine central high school integration faubus eisenhower 1957",
  "little rock": "little rock nine central high school integration faubus eisenhower 1957",
  "vietnam war": "vietnam escalation gulf of tonkin saigon tet offensive draft my lai",
  "vietnam": "vietnam escalation gulf of tonkin saigon tet offensive draft my lai",
  "bus boycott": "montgomery bus boycott rosa parks mlk 1955 browder v gayle",
  "emmett till": "murder lynching of emmett till milam bryant 1955 open casket",
  "brown case": "brown board of education topeka 1954 separate but equal unconstitutional",
  "brown v topeka": "brown board of education topeka 1954 separate but equal unconstitutional",
  "black panthers": "black panther party bobby seale huey newton ten point program",
  "malcolm x": "nation of islam malcolm x self defense",
  "selma": "selma march voting rights act 1965 bloody sunday sheriff clark",
  "voting rights": "voting rights act 1965 literacy tests poll taxes",
  "civil rights act": "civil rights act 1964 1957 1960",
  "freedom rides": "freedom riders 1961 core sncc james farmer",
  "sit ins": "greensboro lunch counter sit ins 1960 woolworths counter",
  "tet offensive": "tet offensive 1968 north vietnamese surprise attack media impact",
  "my lai": "my lai massacre 1968 calley search and destroy atrocities",
  "watergate": "watergate scandal nixon bugging cover up resignation 1974",
  "hard hat": "hard hat riots 1970 construction workers anti war protest",
  "exam technique": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "question technique": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "essay writing": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "12 marker": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "16 marker": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "peel": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "source utility": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "q1": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "q2": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "q3": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "q3a": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "q3b": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "q3c": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "q3d": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "technique": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "writing frame": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3",
  "writing frames": "exam technique guide marks timings writing frame structure peel source utility comparison interpretation essay paper 3 Q1 Q2 Q3"
};

const WELCOME_HTML = `
  Hi! I am your AI history tutor. Ask me any question about the <strong>Edexcel GCSE USA (1954–75)</strong> course.
  <div class="chatbot-chips-container">
    <button class="chatbot-chip-btn" data-query="Why was Brown v. Topeka a turning point for desegregation?">
      💡 Why was Brown v. Topeka a turning point?
    </button>
    <button class="chatbot-chip-btn" data-query="Explain the 1957 integration crisis at Little Rock.">
      💡 Explain the 1957 Little Rock crisis
    </button>
    <button class="chatbot-chip-btn" data-query="What was the impact of the Gulf of Tonkin incident?">
      💡 What was the Gulf of Tonkin incident?
    </button>
  </div>
`;

// Expand search queries using syllabus synonyms
function expandQuerySynonyms(query) {
  let expanded = query.toLowerCase();
  Object.keys(SEARCH_ALIASES).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    if (regex.test(expanded)) {
      expanded += " " + SEARCH_ALIASES[key];
    }
  });
  return expanded;
}

// Prepare the text index for local search
function buildSearchDatabase() {
  if (searchDatabase.length > 0) return;

  const subtopicMap = new Map();

  // 1. Gather titles and questions from QUIZ_DATA
  QUIZ_DATA.forEach(topic => {
    if (topic.subtopics) {
      topic.subtopics.forEach(sub => {
        subtopicMap.set(sub.id, {
          id: sub.id,
          title: sub.title,
          quizQuestions: [...(sub.standard || []), ...(sub.depth || [])]
        });
      });
    }
  });

  // 2. Combine lessons data and quiz data into search text blobs
  Object.keys(LESSONS_DATA).forEach(subtopicId => {
    const lesson = LESSONS_DATA[subtopicId];
    const quizSub = subtopicMap.get(subtopicId);
    const title = quizSub ? quizSub.title : (lesson.headerTitle || subtopicId);

    let contentParts = [];

    if (lesson.headerTitle) contentParts.push(lesson.headerTitle);
    if (lesson.headerIntro) contentParts.push(lesson.headerIntro);

    if (lesson.steps) {
      lesson.steps.forEach(step => {
        if (step.title) contentParts.push(step.title);
        if (step.bodyHtml) {
          const plainText = step.bodyHtml.replace(/<[^>]*>/g, ' ');
          contentParts.push(plainText);
        }
        if (step.scholarlyDepth) {
          if (step.scholarlyDepth.title) contentParts.push(step.scholarlyDepth.title);
          if (step.scholarlyDepth.body) contentParts.push(step.scholarlyDepth.body);
        }
      });
    }

    if (lesson.dualPerspective) {
      const dp = lesson.dualPerspective;
      if (dp.neutralTitle) contentParts.push(dp.neutralTitle);
      if (dp.leftHeadline) contentParts.push(dp.leftHeadline);
      if (dp.leftText) contentParts.push(dp.leftText);
      if (dp.rightHeadline) contentParts.push(dp.rightHeadline);
      if (dp.rightText) contentParts.push(dp.rightText);
    }

    if (lesson.causalLinks) {
      const cl = lesson.causalLinks;
      if (cl.question) contentParts.push(cl.question);
      if (cl.successText) contentParts.push(cl.successText);
      if (cl.factors) {
        cl.factors.forEach(f => {
          if (f.title) contentParts.push(f.title);
          if (f.linkageText) contentParts.push(f.linkageText);
          if (f.options) contentParts.push(f.options.join(' '));
        });
      }
    }

    if (lesson.knowledgeCheck) {
      lesson.knowledgeCheck.forEach(kc => {
        if (kc.question) contentParts.push(kc.question);
        if (kc.answer) contentParts.push(kc.answer);
      });
    }

    if (lesson.questionVault) {
      lesson.questionVault.forEach(qv => {
        if (qv.question) contentParts.push(qv.question);
        if (qv.sourceA) contentParts.push(qv.sourceA);
        if (qv.answer) contentParts.push(qv.answer);
      });
    }

    if (lesson.summaryCorrection && lesson.summaryCorrection.text) {
      contentParts.push(lesson.summaryCorrection.text.replace(/\[\[(.*?)\]\]/g, '$1'));
    }

    if (lesson.howUsefulAnalyser) {
      const hua = lesson.howUsefulAnalyser;
      if (hua.question) contentParts.push(hua.question);
      if (hua.modelAnswer) contentParts.push(hua.modelAnswer);
    }

    if (lesson.deepThinkingQuestions) {
      lesson.deepThinkingQuestions.forEach(dt => {
        if (dt.question) contentParts.push(dt.question);
        if (dt.hint) contentParts.push(dt.hint);
        if (dt.teacherGuide) contentParts.push(dt.teacherGuide);
      });
    }

    if (quizSub && quizSub.quizQuestions) {
      quizSub.quizQuestions.forEach(q => {
        if (q.question) contentParts.push(q.question);
        if (q.answer) contentParts.push(q.answer);
        if (q.explanation) contentParts.push(q.explanation);
        if (q.distractors) contentParts.push(q.distractors.join(' '));
      });
    }

    searchDatabase.push({
      id: subtopicId,
      title: title,
      cleanTitle: title.replace(/^Topic \d\.\d:\s*/, ""),
      fullText: contentParts.join('\n\n')
    });
  });

  // Push exam technique guide
  searchDatabase.push({
    id: "exam_technique",
    title: "Exam Technique Guide",
    cleanTitle: "Exam Technique Guide",
    fullText: `
      Edexcel GCSE History Paper 3 Exam Question Technique Guide
      Questions: Q1 Source Inference, Q2 Causation Essay, Q3a Source Utility, Q3b Interpretation Difference, Q3c Interpretation Disagreement Reason, Q3d Interpretation Evaluation
      Marks: Q1 4 marks, Q2 12 marks, Q3a 8 marks, Q3b 4 marks, Q3c 4 marks, Q3d 16 marks + 4 SPaG marks.
      Timings: Q1 5 minutes, Q2 20 minutes, Q3a 15 minutes, Q3b 5 minutes, Q3c 5 minutes, Q3d 35 minutes.
      Structure, templates, writing frames, PEEL paragraphs, sources utility content nature origin purpose NOP, interpretations difference reason.
    `
  });
}

// Compute keyword relevance match score using whole words and filtering stop words
function getSearchScore(queryText, textBlob) {
  const query = queryText.toLowerCase().trim();
  if (!query) return 0;

  const stopWords = new Set([
    "the", "and", "a", "in", "of", "to", "for", "is", "on", "that", "by", "this", "with", "from", "at", "an", "was", "were", 
    "who", "what", "why", "how", "when", "about", "are", "but", "not", "you", "your", "can", "have", "has", "had",
    "it", "he", "we", "me", "my", "so", "if", "or", "no", "do", "up", "go", "as", "am", "be", "do", "did", "does", "get"
  ]);
  const terms = query.split(/\s+/)
    .map(t => t.replace(/[^a-z0-9]/g, ''))
    .filter(t => t.length >= 2 && !stopWords.has(t));

  if (terms.length === 0) {
    return 0;
  }

  let score = 0;
  const lowerBlob = textBlob.toLowerCase();

  // Substring phrase match bonus
  if (lowerBlob.includes(query)) {
    score += 50;
  }

  // Word overlap matching (whole words only to avoid matching word parts)
  terms.forEach(term => {
    const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'g');
    const matches = lowerBlob.match(regex);
    if (matches) {
      score += matches.length * 6;
    }
  });

  return score;
}

// Search app local database with synonym expansion
function searchLocalApp(query) {
  buildSearchDatabase();

  const expandedQuery = expandQuerySynonyms(query);
  const results = [];
  searchDatabase.forEach(item => {
    const score = getSearchScore(expandedQuery, item.fullText);
    if (score > 12) { // Increased threshold to filter out weak matches
      results.push({
        id: item.id,
        title: item.title,
        cleanTitle: item.cleanTitle,
        score: score,
        fullText: item.fullText
      });
    }
  });

  results.sort((a, b) => b.score - a.score);
  return results;
}

// Extract a matching question/answer or paragraph for local fallback when API key is missing
function getLocalStaticResponse(bestMatch, query) {
  if (bestMatch.id === 'exam_technique') {
    return `Here is the **Edexcel Paper 3 Exam Technique Guide**! It covers all question types in this specification (Q1, Q2, and Q3 a-d), with exact marks, suggested timings, writing frames, and examiner secrets. Click the button below to open the guide!`;
  }

  const expandedQuery = expandQuerySynonyms(query);
  const queryTerms = expandedQuery.toLowerCase().split(/\s+/).map(t => t.replace(/[^a-z0-9]/g, '')).filter(t => t.length > 2);
  const lesson = LESSONS_DATA[bestMatch.id];
  let bestFact = "";
  let bestFactScore = 0;

  const checkFact = (text) => {
    if (!text) return;
    let score = 0;
    const lowerText = text.toLowerCase();
    queryTerms.forEach(term => {
      if (lowerText.includes(term)) score += 2;
    });
    if (score > bestFactScore) {
      bestFactScore = score;
      bestFact = text;
    }
  };

  // Inspect paragraph contents
  if (lesson && lesson.steps) {
    lesson.steps.forEach(step => {
      if (step.bodyHtml) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = step.bodyHtml;
        const paragraphs = Array.from(tempDiv.querySelectorAll('p, li')).map(el => el.textContent.trim());
        paragraphs.forEach(p => checkFact(p));
      }
      if (step.scholarlyDepth && step.scholarlyDepth.body) {
        checkFact(step.scholarlyDepth.body);
      }
    });
  }

  // Inspect quiz questions
  const quizSub = QUIZ_DATA.flatMap(t => t.subtopics || []).find(sub => sub.id === bestMatch.id);
  if (quizSub) {
    const qList = [...(quizSub.standard || []), ...(quizSub.depth || [])];
    qList.forEach(q => {
      let score = 0;
      const combined = `${q.question} ${q.answer} ${q.explanation}`.toLowerCase();
      queryTerms.forEach(term => {
        if (combined.includes(term)) score += 2;
      });
      if (score > bestFactScore) {
        bestFactScore = score;
        bestFact = `**Question:** ${q.question}\n**Answer:** ${q.answer}\n*Explanation:* ${q.explanation}`;
      }
    });
  }

  if (bestFactScore >= 2 && bestFact) {
    return `I found this matching fact in the lesson **${bestMatch.cleanTitle}**:\n\n${bestFact}`;
  }

  return `I found matching lesson content for **${bestMatch.cleanTitle}** in the course materials. Click below to jump directly to this lesson!`;
}

// Format markdown-like text to clean HTML (including tables and lists)
function formatMessageText(text) {
  if (!text) return "";
  
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 1. Parse tables (Markdown pipe tables)
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table class="chatbot-table">';
      }
      
      // Skip alignment row (e.g. |---|---|)
      if (line.includes('---') || line.includes(':---')) {
        continue;
      }
      
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      tableHtml += '<tr>';
      cells.forEach(cell => {
        const isHeader = !tableHtml.includes('<td>') && !tableHtml.includes('</th>');
        const tag = isHeader ? 'th' : 'td';
        tableHtml += `<${tag}>${cell}</${tag}>`;
      });
      tableHtml += '</tr>';
      lines[i] = '';
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</table>';
        lines[i] = tableHtml + '\n' + lines[i];
      }
    }
  }
  
  if (inTable) {
    tableHtml += '</table>';
    lines.push(tableHtml);
  }
  
  html = lines.filter(l => l !== '').join('\n');

  // 2. Parse bullet list items
  html = html.replace(/^(?:\*|-)\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>');

  // 3. Format basic markdown elements
  html = html
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");

  return html;
}

// Send user query to Gemini API (Proxy by default, local key fallback)
async function fetchGeminiResponse(localApiKey, userInput, localContext, customSystemInstruction = null) {
  const systemInstruction = customSystemInstruction || `You are a strict, helpful AI history tutor for Edexcel GCSE History, Paper 3: Modern Depth Study - USA (1954-75).
Your task is to answer the student's question accurately, concisely, and at a GCSE level (appropriate for 14-16 year olds).
Rules:
- Keep the response short (strictly under 100 words).
- Focus strictly on historical facts relevant to the Edexcel GCSE USA specification.
- If the question is outside the scope of the Edexcel USA (1954-75) specification, do NOT simply refuse to answer or say it's off-topic. Instead, creatively find a historical bridge or connection back to the course material (e.g., connecting WWI/WWII to the Double V Campaign or cold war origins, sports to Muhammad Ali's draft resistance or 1968 Olympics Black Power salute, or music to 1960s anti-war protest culture) and guide them back to this USA Paper 3 syllabus.
- State precise years, names, acts, and numbers (e.g. 1954 Brown v. Topeka, 1957 Little Rock Nine, 1964 Civil Rights Act, 1965 Voting Rights Act, etc.).
- If local app context is provided, prioritize using it to answer the question.`;

  // Prepend context to user input if available
  let userText = userInput;
  if (localContext) {
    userText = `[App Course Content Context: Use this info if helpful]\n${localContext.fullText.substring(0, 3000)}\n\nUser Question: ${userInput}`;
  }

  // Update AI-facing history thread
  chatHistory.push({
    role: "user",
    parts: [{ text: userText }]
  });

  // Limit chat history length to stay within standard token limits
  if (chatHistory.length > 8) {
    chatHistory = chatHistory.slice(-8);
  }

  const requestBody = {
    contents: chatHistory,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 250
    }
  };

  // Try the Netlify serverless proxy first
  try {
    const response = await fetch(`/.netlify/functions/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const aiText = data.candidates[0].content.parts[0].text.trim();
      chatHistory.push({
        role: "model",
        parts: [{ text: aiText }]
      });
      return aiText;
    } else {
      const isUnconfigured = !response.ok && (
        (data.error && data.error.message && data.error.message.includes("GEMINI_API_KEY")) ||
        response.status === 500
      );
      if (isUnconfigured && localApiKey) {
        return await fetchDirectGemini(localApiKey, requestBody);
      }
      throw new Error(data.error?.message || `Proxy error ${response.status}`);
    }
  } catch (proxyError) {
    if (localApiKey) {
      try {
        return await fetchDirectGemini(localApiKey, requestBody);
      } catch (directError) {
        throw new Error(`Proxy error (${proxyError.message}) and fallback failed: ${directError.message}`);
      }
    }
    throw proxyError;
  }
}

async function fetchDirectGemini(apiKey, requestBody) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  if (response.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    const aiText = data.candidates[0].content.parts[0].text.trim();
    chatHistory.push({
      role: "model",
      parts: [{ text: aiText }]
    });
    return aiText;
  } else {
    throw new Error(data.error?.message || `Direct API error ${response.status}`);
  }
}

// Append a new bubble to the chat container
function appendBubble(sender, contentText, subtopicLink = null, isHtml = false) {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = `chatbot-bubble ${sender}`;
  bubble.innerHTML = isHtml ? contentText : formatMessageText(contentText);

  if (subtopicLink) {
    const linkBtn = document.createElement('button');
    linkBtn.className = 'chatbot-jump-link';
    linkBtn.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Study: ${subtopicLink.cleanTitle}`;
    linkBtn.setAttribute('data-subtopic-id', subtopicLink.id);
    bubble.appendChild(linkBtn);
  }

  // Add TTS button for assistant and system bubbles
  if (sender === 'assistant' || sender === 'system') {
    const ttsBtn = document.createElement('button');
    ttsBtn.className = 'chatbot-tts-btn';
    ttsBtn.title = 'Listen to response';
    ttsBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    bubble.appendChild(ttsBtn);
  }

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;

  // Save to history (skip system messages to keep history clean for API calls)
  if (sender === 'user' || sender === 'assistant') {
    const isAlreadyInHistory = chatHistory.some(h => h.parts?.[0]?.text === contentText);
    if (!isAlreadyInHistory) {
      chatHistory.push({
        role: sender === 'user' ? 'user' : 'model',
        parts: [{ text: contentText }]
      });
      saveHistoryToLocalStorage();
    }
  }
}

// Render dynamic thinking dots bubble
function appendThinkingBubble() {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = 'chatbot-bubble assistant';
  bubble.id = 'chatbot-thinking';
  bubble.innerHTML = `Thinking<span class="chatbot-loading-dots"><span>.</span><span>.</span><span>.</span></span>`;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function removeThinkingBubble() {
  const el = document.getElementById('chatbot-thinking');
  if (el) el.remove();
}

// Core Chatbot Initialization
export function initChatbot() {
  // Inject custom stylesheet for solid styling, quick chips, and animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes chatbotPulse {
      0% { opacity: 0.2; }
      50% { opacity: 1; }
      100% { opacity: 0.2; }
    }
    .chatbot-loading-dots span {
      animation: chatbotPulse 1.4s infinite both;
      font-weight: bold;
      display: inline-block;
      width: 4px;
      text-align: center;
    }
    .chatbot-loading-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .chatbot-loading-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }

    /* CSS Overrides for Solid theme-matching readability */
    .chatbot-window {
      background: var(--bg-sidebar) !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      border: 1px solid var(--border-active) !important;
    }
    .chatbot-bubble.assistant {
      background: rgba(255, 255, 255, 0.05) !important;
      color: var(--text-main) !important;
      border: 1px solid var(--border-glass) !important;
    }
    [data-theme="desert"] .chatbot-bubble.assistant {
      background: rgba(0, 0, 0, 0.04) !important;
      color: var(--text-main) !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
    }
    .chatbot-bubble.user {
      color: #ffffff !important;
    }

    /* Suggested Chips styling */
    .chatbot-chips-container {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .chatbot-chip-btn {
      background: rgba(59, 130, 246, 0.08);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 8px;
      color: #60a5fa;
      padding: 8px 12px;
      font-size: 0.78rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: all var(--transition-fast);
      outline: none;
      font-family: inherit;
    }
    .chatbot-chip-btn:hover {
      background: rgba(59, 130, 246, 0.16);
      border-color: #3b82f6;
      color: #ffffff;
      transform: translateY(-1px);
    }
    [data-theme="desert"] .chatbot-chip-btn {
      background: rgba(194, 65, 12, 0.06);
      border-color: rgba(194, 65, 12, 0.15);
      color: #c2410c;
    }
    [data-theme="desert"] .chatbot-chip-btn:hover {
      background: rgba(194, 65, 12, 0.12);
      border-color: #c2410c;
      color: #c2410c;
    }

    /* Quiz styling */
    .chatbot-quiz-options {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 8px;
    }
    .chatbot-quiz-option-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      border-radius: 6px;
      color: var(--text-main);
      padding: 8px 10px;
      font-size: 0.78rem;
      text-align: left;
      cursor: pointer;
      transition: all var(--transition-fast);
      outline: none;
      font-family: inherit;
    }
    .chatbot-quiz-option-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--primary);
    }
    .chatbot-quiz-option-btn.correct {
      background: rgba(16, 185, 129, 0.25) !important;
      border-color: #10b981 !important;
      color: #34d399 !important;
      font-weight: 600;
    }
    .chatbot-quiz-option-btn.incorrect {
      background: rgba(239, 68, 68, 0.25) !important;
      border-color: #ef4444 !important;
      color: #f87171 !important;
    }
    .chatbot-quiz-next-btn {
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: background var(--transition-fast);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
    }
    .chatbot-quiz-next-btn:hover {
      background: var(--primary-light);
    }

    /* Unit & Subtopic Selection Chips */
    .chatbot-unit-chip-btn, .chatbot-subtopic-chip-btn {
      background: rgba(139, 92, 246, 0.08);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 8px;
      color: #a78bfa;
      padding: 8px 12px;
      font-size: 0.78rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: all var(--transition-fast);
      outline: none;
      font-family: inherit;
    }
    .chatbot-unit-chip-btn:hover, .chatbot-subtopic-chip-btn:hover {
      background: rgba(139, 92, 246, 0.16);
      border-color: #8b5cf6;
      color: #ffffff;
      transform: translateY(-1px);
    }

    /* Checklist Styling */
    .chatbot-checklist-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
      text-align: left;
    }
    .chatbot-checklist-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-glass);
      border-radius: 8px;
      padding: 10px;
    }
    .chatbot-checklist-label {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.8rem;
    }
    .chatbot-spec-checkbox {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    .chatbot-checkbox-custom {
      height: 16px;
      width: 16px;
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--border-glass);
      border-radius: 4px;
      display: inline-block;
      position: relative;
      flex-shrink: 0;
      margin-top: 2px;
      transition: all var(--transition-fast);
    }
    .chatbot-spec-checkbox:checked ~ .chatbot-checkbox-custom {
      background-color: var(--primary);
      border-color: var(--primary);
    }
    .chatbot-checkbox-custom:after {
      content: "";
      position: absolute;
      display: none;
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    .chatbot-spec-checkbox:checked ~ .chatbot-checkbox-custom:after {
      display: block;
    }
    .chatbot-checklist-point-text {
      color: var(--text-main);
    }
    .chatbot-spec-checkbox:checked ~ .chatbot-checklist-point-text {
      text-decoration: line-through;
      color: var(--text-muted);
    }
    .chatbot-checklist-facts {
      margin-top: 6px;
      margin-left: 24px;
      padding-left: 0;
      list-style-type: none;
      font-size: 0.75rem;
      color: var(--text-muted);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .chatbot-checklist-facts li {
      position: relative;
      padding-left: 10px;
    }
    .chatbot-checklist-facts li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--primary);
    }

    /* TTS Button styling */
    .chatbot-tts-btn {
      position: absolute;
      bottom: -6px;
      right: -6px;
      background: var(--bg-sidebar);
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      transition: all var(--transition-fast);
          }
    .chatbot-tts-btn:hover {
      color: var(--text-main);
      border-color: var(--primary);
      transform: scale(1.1);
    }
    .chatbot-tts-btn.speaking {
      color: var(--accent);
      border-color: var(--accent);
      animation: chatbotPulse 1s infinite alternate;
    }
    .chatbot-bubble.assistant, .chatbot-bubble.system {
      position: relative;
    }

    /* Voice mic styling */
    .chatbot-mic-btn {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
      border: 1px solid var(--border-glass);
      border-radius: 4px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }
    .chatbot-mic-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-main);
      border-color: var(--primary);
    }
    .chatbot-mic-btn.recording {
      background: rgba(239, 68, 68, 0.25) !important;
      color: #f87171 !important;
      border-color: #ef4444 !important;
      animation: chatbotPulse 1s infinite alternate;
    }

    /* Command Toolbar styling */
    .chatbot-command-row {
      padding: 8px 16px;
      display: flex;
      gap: 8px;
      border-top: 1px solid var(--border-glass);
      background: rgba(0, 0, 0, 0.15);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .chatbot-command-row::-webkit-scrollbar {
      display: none;
    }
    .chatbot-cmd-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      border-radius: 20px;
      color: var(--text-muted);
      padding: 4px 10px;
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      font-family: inherit;
    }
    .chatbot-cmd-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-main);
      border-color: var(--primary);
    }

    /* Table styling */
    .chatbot-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      margin-bottom: 8px;
      font-size: 0.76rem;
    }
    .chatbot-table th, .chatbot-table td {
      border: 1px solid var(--border-glass);
      padding: 6px 8px;
      text-align: left;
    }
    .chatbot-table th {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-main);
      font-weight: 700;
    }
    .chatbot-table tr:nth-child(even) {
      background: rgba(255, 255, 255, 0.02);
    }
  `;
  document.head.appendChild(style);

  // Check for existing API key
  let apiKey = localStorage.getItem('gemini_api_key') || '';

  // Render FAB and window markup
  const fab = document.createElement('div');
  fab.className = 'chatbot-fab';
  fab.id = 'chatbot-fab';
  fab.title = 'Ask GCSE History AI Tutor';
  fab.innerHTML = '<i class="fa-solid fa-comment-dots"></i>';

  const windowEl = document.createElement('div');
  windowEl.className = 'chatbot-window';
  windowEl.id = 'chatbot-window';
  windowEl.innerHTML = `
    <div class="chatbot-header">
      <div class="chatbot-title">
        <i class="fa-solid fa-robot"></i> GCSE History AI Tutor
      </div>
      <div class="chatbot-actions">
        <button class="chatbot-action-btn" id="chatbot-clear-btn" title="Clear Chat Thread">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <button class="chatbot-action-btn" id="chatbot-close-btn" title="Close Chat">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <!-- Messages Container -->
    <div class="chatbot-messages" id="chatbot-messages">
      <div class="chatbot-bubble assistant">
        ${WELCOME_HTML}
      </div>
    </div>

    <!-- Command Toolbar -->
    <div class="chatbot-command-row">
      <button class="chatbot-cmd-btn" data-cmd="quiz"><i class="fa-solid fa-gamepad"></i> Quiz</button>
      <button class="chatbot-cmd-btn" data-cmd="grade"><i class="fa-solid fa-marker"></i> Grade PEEL</button>
      <button class="chatbot-cmd-btn" data-cmd="checklist"><i class="fa-solid fa-list-check"></i> Checklist</button>
      <button class="chatbot-cmd-btn" data-cmd="clear"><i class="fa-solid fa-trash-can"></i> Clear</button>
    </div>

    <!-- Footer Input Area -->
    <div class="chatbot-input-row">
      <input type="text" class="chatbot-input" id="chatbot-user-input" placeholder="Ask a question..." autocomplete="off" />
      <button class="chatbot-mic-btn" id="chatbot-mic-btn" title="Voice Input (Speech-to-Text)" style="display: none;">
        <i class="fa-solid fa-microphone"></i>
      </button>
      <button class="chatbot-send-btn" id="chatbot-send-btn" title="Send Message">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(windowEl);

  const toggleSettingsBtn = document.getElementById('chatbot-settings-toggle');
  const clearBtn = document.getElementById('chatbot-clear-btn');
  const settingsPanel = document.getElementById('chatbot-settings-panel');
  const apiKeyInput = document.getElementById('chatbot-api-key-input');
  const saveKeyBtn = document.getElementById('chatbot-save-key-btn');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const userInput = document.getElementById('chatbot-user-input');
  const sendBtn = document.getElementById('chatbot-send-btn');
  const messagesContainer = document.getElementById('chatbot-messages');
  const micBtn = document.getElementById('chatbot-mic-btn');
  const commandRow = document.querySelector('.chatbot-command-row');

  // Load persistent history
  loadAndRenderHistory();

  // Speech Recognition Binding
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening = false;
  
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  }

  if (recognition && micBtn) {
    micBtn.style.display = 'flex';
    
    micBtn.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });

    recognition.onstart = () => {
      isListening = true;
      micBtn.classList.add('recording');
      userInput.placeholder = "Listening...";
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      userInput.value = transcript;
    };

    recognition.onend = () => {
      isListening = false;
      micBtn.classList.remove('recording');
      userInput.placeholder = "Ask a question...";
    };

    recognition.onerror = () => {
      isListening = false;
      micBtn.classList.remove('recording');
      userInput.placeholder = "Ask a question...";
    };
  }

  // Command Row Click Handler
  if (commandRow) {
    commandRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.chatbot-cmd-btn');
      if (!btn) return;
      
      const cmd = btn.getAttribute('data-cmd');
      if (cmd === 'quiz') {
        startChatbotQuiz();
      } else if (cmd === 'grade') {
        gradingState.isActive = true;
        appendBubble('assistant', 'I am ready to grade your paragraph! Please paste your essay paragraph or outline below, and I will critique it against GCSE PEEL criteria.');
      } else if (cmd === 'checklist') {
        handleSpecChecklistQuery("");
      } else if (cmd === 'clear') {
        chatHistory = [];
        localStorage.removeItem('chatbot_history');
        messagesContainer.innerHTML = `<div class="chatbot-bubble assistant">${WELCOME_HTML}</div>`;
        appendBubble('system', 'Chat history cleared.');
      }
    });
  }

  // Active Lesson Context Listener
  window.addEventListener('appViewChanged', (e) => {
    const detail = e.detail;
    if (detail.view === 'subtopic' && detail.subtopicId) {
      updateChatbotSuggestionsForSubtopic(detail.subtopicId);
    }
  });

  // Load key input state
  if (apiKey && apiKeyInput) {
    apiKeyInput.value = apiKey;
  }

  // 1. FAB Open/Close Toggle
  fab.addEventListener('click', () => {
    fab.classList.toggle('active');
    windowEl.classList.toggle('active');
    if (windowEl.classList.contains('active')) {
      userInput.focus();
    }
  });

  // 2. Settings Toggle
  if (toggleSettingsBtn && settingsPanel) {
    toggleSettingsBtn.addEventListener('click', () => {
      settingsPanel.classList.toggle('active');
    });
  }

  // 3. Save API Key
  if (saveKeyBtn && apiKeyInput && settingsPanel) {
    saveKeyBtn.addEventListener('click', () => {
      const value = apiKeyInput.value.trim();
      if (value) {
        apiKey = value;
        localStorage.setItem('gemini_api_key', apiKey);
        settingsPanel.classList.remove('active');
        appendBubble('system', 'API Key saved successfully! AI mode is active.');
      } else {
        apiKey = '';
        localStorage.removeItem('gemini_api_key');
        appendBubble('system', 'API Key cleared. Switched back to app-only local database mode.');
      }
    });
  }

  // 4. Close Chat Button
  closeBtn.addEventListener('click', () => {
    fab.classList.remove('active');
    windowEl.classList.remove('active');
  });

  // 5. Clear Chat Thread
  clearBtn.addEventListener('click', () => {
    chatHistory = [];
    localStorage.removeItem('chatbot_history');
    messagesContainer.innerHTML = `<div class="chatbot-bubble assistant">${WELCOME_HTML}</div>`;
    appendBubble('system', 'Chat history cleared.');
  });

  // 6. In-app navigation links, Suggestion Prompt Chips & new interactive features (Event delegation)
  messagesContainer.addEventListener('click', (e) => {
    // Jump to lesson link clicks
    const jumpLink = e.target.closest('.chatbot-jump-link');
    if (jumpLink) {
      const subtopicId = jumpLink.getAttribute('data-subtopic-id');
      if (subtopicId) {
        if (subtopicId === 'exam_technique') {
          switchView('exam-hub', 'technique');
        } else {
          state.currentMode = 'lessons';
          switchView('subtopic', subtopicId);
        }
        if (window.innerWidth <= 480) {
          fab.classList.remove('active');
          windowEl.classList.remove('active');
        }
      }
      return;
    }

    // Suggestion chips clicks
    const chipBtn = e.target.closest('.chatbot-chip-btn');
    if (chipBtn) {
      const query = chipBtn.getAttribute('data-query');
      if (query) {
        userInput.value = query;
        handleSend();
      }
      return;
    }

    // Quiz Option Clicks
    const optionBtn = e.target.closest('.chatbot-quiz-option-btn');
    if (optionBtn) {
      if (!quizState.isActive) return;
      const index = parseInt(optionBtn.getAttribute('data-choice-index'), 10);
      evaluateQuizChoice(index, optionBtn);
      return;
    }

    // Quiz Next Clicks
    const nextBtn = e.target.closest('.chatbot-quiz-next-btn');
    if (nextBtn) {
      if (!quizState.isActive) return;
      quizState.currentIndex++;
      if (quizState.currentIndex < quizState.questions.length) {
        presentQuizQuestion();
      } else {
        const percent = Math.round((quizState.score / quizState.questions.length) * 100);
        let feedback = `🏆 **Quiz Complete!**\n\nYou scored **${quizState.score} out of ${quizState.questions.length}** (${percent}%).\n\n`;
        if (percent === 100) feedback += "Sensational! You are an expert examiner. 🌟";
        else if (percent >= 80) feedback += "Excellent job! You have a strong grasp of Paper 3 details. 🎓";
        else if (percent >= 50) feedback += "Good effort. Review the study materials and try again to master it! 📖";
        else feedback += "Keep studying! Try searching for terms like 'Little Rock' or 'Montgomery' to build your knowledge. 📚";
        
        appendBubble('assistant', feedback);
        quizState.isActive = false;
        addXp(15);
      }
      return;
    }

    // Unit selection chips
    const unitChip = e.target.closest('.chatbot-unit-chip-btn');
    if (unitChip) {
      const unit = unitChip.getAttribute('data-unit');
      let subtopicsHtml = `**Unit ${unit} Topics:**\nSelect a topic checklist to view:\n\n`;
      subtopicsHtml += `<div class="chatbot-chips-container">`;
      for (let t = 1; t <= 4; t++) {
        const subtopicId = `subtopic_${unit}_${t}`;
        const lesson = LESSONS_DATA[subtopicId];
        const title = lesson ? lesson.headerTitle.replace(/^Topic \d\.\d:\s*/, "") : `Topic ${unit}.${t}`;
        subtopicsHtml += `<button class="chatbot-subtopic-chip-btn" data-subtopic-id="${subtopicId}">Topic ${unit}.${t}: ${title}</button>`;
      }
      subtopicsHtml += `</div>`;
      appendBubble('assistant', subtopicsHtml, null, true);
      return;
    }

    // Subtopic checklist chips
    const subtopicChip = e.target.closest('.chatbot-subtopic-chip-btn');
    if (subtopicChip) {
      const subtopicId = subtopicChip.getAttribute('data-subtopic-id');
      if (SPEC_CHECKLIST_DATA[subtopicId]) {
        const checklistHtml = getChecklistHTML(subtopicId);
        appendBubble('assistant', checklistHtml, null, true);
      }
      return;
    }

    // TTS button click
    const ttsBtn = e.target.closest('.chatbot-tts-btn');
    if (ttsBtn) {
      handleTTS(ttsBtn);
      return;
    }
  });

  // Handle message sending pipeline
  async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // Display user text
    appendBubble('user', text);
    userInput.value = '';

    // Intercept if Quiz Mode is active
    if (quizState.isActive) {
      handleQuizAnswerInput(text);
      return;
    }

    // Intercept if Essay Grading Mode is active
    if (gradingState.isActive) {
      await handleGradingInput(text);
      return;
    }

    // Regular question or query
    addXp(5);

    // Check for interactive feature triggers
    const lowerText = text.toLowerCase();
    
    // 1. Trivia Quiz trigger
    if (/\b(quiz|trivia|test me|start quiz|play quiz)\b/.test(lowerText)) {
      startChatbotQuiz();
      return;
    }

    // 2. Grade My Paragraph trigger
    if (/\b(grade my paragraph|grade my essay|critique my paragraph|peel grade|grade essay|mark my essay)\b/.test(lowerText)) {
      const matchText = text.replace(/^(grade my paragraph|grade my essay|critique my paragraph|peel grade|grade essay|mark my essay)\s*:?\s*/i, "").trim();
      if (matchText.length > 5) {
        await handleGradingInput(matchText);
      } else {
        gradingState.isActive = true;
        appendBubble('assistant', 'I am ready to grade your paragraph! Please paste your essay paragraph or outline below, and I will critique it against GCSE PEEL criteria.');
      }
      return;
    }

    // 3. Spec Checklist trigger
    if (/\b(spec|specification|checklist|syllabus|what is on the test|requirements|what is on the exam)\b/.test(lowerText)) {
      handleSpecChecklistQuery(text);
      return;
    }

    // Default search
    const localMatches = searchLocalApp(text);
    const bestMatch = localMatches[0];

    // Determine match strength
    const isStrongMatch = bestMatch && bestMatch.score >= 35;
    const isMediumMatch = bestMatch && bestMatch.score >= 20;

    // If matching exam technique, navigate automatically!
    if (bestMatch && bestMatch.id === 'exam_technique' && bestMatch.score >= 25) {
      appendBubble('assistant', 'Opening the **Exam Technique Guide** for you now...');
      setTimeout(() => {
        switchView('exam-hub', 'technique');
        
        // Hide window on mobile to avoid screen crowding
        if (window.innerWidth <= 480) {
          fab.classList.remove('active');
          windowEl.classList.remove('active');
        }
      }, 700);
      return;
    }

    // Connect to AI Proxy with key fallback, or local search fallback
    appendThinkingBubble();
    try {
      // Only pass context to the AI if it is at least a medium match (score >= 20)
      const aiContext = isMediumMatch ? bestMatch : null;
      const responseText = await fetchGeminiResponse(apiKey, text, aiContext);
      removeThinkingBubble();
      
      // Only attach study jump button if it is a strong match (score >= 35)
      const bubbleLink = isStrongMatch ? bestMatch : null;
      appendBubble('assistant', responseText, bubbleLink);
    } catch (err) {
      removeThinkingBubble();
      if (isMediumMatch) {
        const fallbackText = getLocalStaticResponse(bestMatch, text);
        appendBubble('assistant', `*Offline Mode (AI unavailable: ${err.message})*\n\n${fallbackText}`, isStrongMatch ? bestMatch : null);
      } else {
        appendBubble('assistant', `I couldn't contact the AI tutor (${err.message}).\n\nPlease ask a history question about the Edexcel USA (1954–75) course.`);
      }
    }
  }

  // 7. Action Bindings
  sendBtn.addEventListener('click', handleSend);
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  });
}

// --- Quiz Helper Functions ---
function startChatbotQuiz() {
  const allQuestions = [];
  QUIZ_DATA.forEach(topic => {
    if (topic.subtopics) {
      topic.subtopics.forEach(sub => {
        const subQuestions = [...(sub.standard || []), ...(sub.depth || [])];
        subQuestions.forEach(q => {
          allQuestions.push({
            id: q.id,
            question: q.question,
            answer: q.answer,
            explanation: q.explanation || "",
            distractors: q.distractors || [],
            subtopicTitle: sub.title,
            subtopicId: sub.id
          });
        });
      });
    }
  });

  if (allQuestions.length === 0) {
    appendBubble('assistant', 'Sorry, I could not load any quiz questions at the moment.');
    return;
  }

  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  quizState.isActive = true;
  quizState.questions = shuffled.slice(0, 5);
  quizState.currentIndex = 0;
  quizState.score = 0;

  appendBubble('assistant', '🎓 **GCSE History Recall Trivia Quiz!**\n\nLet\'s test your knowledge on Paper 3 USA History. I have prepared 5 questions for you. Good luck! Let\'s start with Question 1.');
  
  presentQuizQuestion();
}

function presentQuizQuestion() {
  const q = quizState.questions[quizState.currentIndex];
  const choices = [q.answer, ...q.distractors];
  choices.sort(() => Math.random() - 0.5);
  quizState.answersShuffled = choices;

  let bubbleContent = `**Question ${quizState.currentIndex + 1} of 5:**\n${q.question}\n\n`;
  bubbleContent += `<div class="chatbot-quiz-options">`;
  choices.forEach((choice, index) => {
    const optionLetter = String.fromCharCode(65 + index);
    bubbleContent += `
      <button class="chatbot-quiz-option-btn" data-choice-text="${choice.replace(/"/g, '&quot;')}" data-choice-index="${index}">
        <strong>${optionLetter}:</strong> ${choice}
      </button>
    `;
  });
  bubbleContent += `</div>`;
  
  appendBubble('assistant', bubbleContent, null, true);
}

function handleQuizAnswerInput(text) {
  const lowerText = text.toLowerCase().trim();
  if (lowerText === 'exit' || lowerText === 'stop' || lowerText === 'quit') {
    quizState.isActive = false;
    appendBubble('assistant', 'Quiz stopped. Let me know if you want to play again!');
    return;
  }

  const choices = quizState.answersShuffled;
  let selectedIndex = -1;
  if (lowerText === 'a' || lowerText === '1') selectedIndex = 0;
  else if (lowerText === 'b' || lowerText === '2') selectedIndex = 1;
  else if (lowerText === 'c' || lowerText === '3') selectedIndex = 2;
  else if (lowerText === 'd' || lowerText === '4') selectedIndex = 3;
  else {
    selectedIndex = choices.findIndex(c => c.toLowerCase().trim() === lowerText);
  }

  if (selectedIndex === -1) {
    appendBubble('assistant', 'Please select one of the options by clicking a button, or typing A, B, C, or D. (Type "exit" to quit).');
    return;
  }

  evaluateQuizChoice(selectedIndex);
}

function evaluateQuizChoice(selectedIndex, clickedBtn = null) {
  const q = quizState.questions[quizState.currentIndex];
  const choices = quizState.answersShuffled;
  const selectedText = choices[selectedIndex];
  const correctText = q.answer;
  const isCorrect = selectedText === correctText;

  if (isCorrect) {
    quizState.score++;
    addXp(5);
  } else {
    addXp(2);
  }

  const messagesContainer = document.getElementById('chatbot-messages');
  const allOptionBtns = messagesContainer.querySelectorAll('.chatbot-quiz-option-btn');
  const currentOptionsContainer = clickedBtn ? clickedBtn.parentElement : null;
  const btnsToUpdate = currentOptionsContainer 
    ? currentOptionsContainer.querySelectorAll('.chatbot-quiz-option-btn')
    : Array.from(allOptionBtns).slice(-4);

  btnsToUpdate.forEach((btn, idx) => {
    btn.disabled = true;
    const btnText = choices[idx];
    if (btnText === correctText) {
      btn.classList.add('correct');
    } else if (btnText === selectedText && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });

  let feedback = isCorrect 
    ? `✅ **Correct!**\n\n` 
    : `❌ **Incorrect.** The correct answer was: **${correctText}**.\n\n`;
  if (q.explanation) {
    feedback += `*Explanation:* ${q.explanation}`;
  }

  const isLast = quizState.currentIndex === quizState.questions.length - 1;
  const nextBtnText = isLast ? "Finish Quiz" : "Next Question";
  feedback += `\n\n<button class="chatbot-quiz-next-btn">${nextBtnText} <i class="fa-solid fa-arrow-right"></i></button>`;

  appendBubble('assistant', feedback, null, true);
}

// --- Essay Examiner Helper Functions ---
async function handleGradingInput(text) {
  gradingState.isActive = false;
  const apiKey = localStorage.getItem('gemini_api_key') || '';
  
  appendThinkingBubble();
  try {
    const responseText = await fetchGeminiResponse(apiKey, text, null, examinerSystemInstruction);
    removeThinkingBubble();
    appendBubble('assistant', responseText);
    addXp(10);
  } catch (err) {
    removeThinkingBubble();
    const fallbackText = gradeParagraphLocally(text);
    appendBubble('assistant', fallbackText);
    addXp(10);
  }
}

function gradeParagraphLocally(text) {
  const lowerText = text.toLowerCase();
  
  const pointConnectives = ["firstly", "the main reason", "one factor", "initially", "primarily", "to begin", "one key cause"];
  const hasPoint = pointConnectives.some(c => lowerText.includes(c)) || text.split('.').length > 1;
  
  const evidenceKeywords = [
    "195", "196", "197", "little rock", "boycott", "rosa parks", "mlk", "king", "till", "faubus", "eisenhower", "kennedy", "johnson", "nixon", "vietnam", "tonkin", "tet", "my lai", "brown v", "segregation", "sit-in", "birmingham", "selma", "vietcong"
  ];
  const foundEvidence = evidenceKeywords.filter(k => lowerText.includes(k));
  const hasEvidence = foundEvidence.length >= 1;
  
  const explanationConnectives = ["because", "this meant that", "consequently", "therefore", "as a result", "due to", "led to", "this showed"];
  const hasExplanation = explanationConnectives.some(c => lowerText.includes(c));
  
  const linkKeywords = ["therefore", "consequently", "link", "shows that", "shows why", "resulted in", "thus"];
  const hasLink = linkKeywords.some(c => lowerText.includes(c)) && text.trim().endsWith('.');
  
  let score = 0;
  if (hasPoint) score++;
  if (hasEvidence) score++;
  if (hasExplanation) score++;
  if (hasLink) score++;
  
  let feedback = `📊 **GCSE Examiner Grade (Offline Heuristic Check):** **${score}/4**\n\n`;
  
  feedback += `* **Point (P):** ${hasPoint ? "✅ Detected a topic sentence or structured starting sentence." : "❌ Try to start with a clear point connective like 'First, one main cause was...'."}\n`;
  feedback += `* **Evidence (E):** ${hasEvidence ? `✅ Detected historical evidence. (Matched terms: ${foundEvidence.join(", ")})` : "❌ No specific dates, years (e.g. 1954, 1957) or key figures detected."}\n`;
  feedback += `* **Explanation (E):** ${hasExplanation ? "✅ Explanatory connectives detected." : "❌ Try to explain *why* this matters using words like 'consequently', 'this meant that' or 'as a result'."}\n`;
  feedback += `* **Link (L):** ${hasLink ? "✅ Clear link words found connecting back." : "❌ End your paragraph with a linking sentence returning to the question topic."}\n\n`;
  
  feedback += `**WWW (What Went Well):** `;
  if (score === 4) {
    feedback += "Excellent! Your paragraph follows the PEEL structure perfectly with specific history facts.";
  } else if (hasEvidence && hasExplanation) {
    feedback += "You support your argument with good factual evidence and explain the consequence clearly.";
  } else if (hasEvidence) {
    feedback += "You included good factual evidence (names or years) in your response.";
  } else if (hasExplanation) {
    feedback += "You used strong explanatory connectives to explain your reasoning.";
  } else {
    feedback += "You have attempted to write a structured paragraph.";
  }
  
  feedback += `\n**EBI (Even Better If):** `;
  if (score === 4) {
    feedback += "Try to practice writing under timed conditions (about 5 minutes per PEEL paragraph in the exam).";
  } else if (!hasEvidence) {
    feedback += "Include specific facts, dates (e.g., 1954 Brown case, 1964 Civil Rights Act) to secure knowledge marks.";
  } else if (!hasExplanation) {
    feedback += "Expand on your evidence by explaining *how* it answers the question using words like 'this meant that'.";
  } else if (!hasLink) {
    feedback += "Add a final sentence linking directly back to the question using 'Therefore, this shows that...'.";
  } else {
    feedback += "Ensure you have all four PEEL elements: Point, Evidence, Explanation, and Link.";
  }
  
  return feedback;
}

// --- Specification Checklist Helper Functions ---
function getChecklistHTML(subtopicId) {
  const data = SPEC_CHECKLIST_DATA[subtopicId];
  if (!data) return "Checklist data not found.";
  
  const lesson = LESSONS_DATA[subtopicId];
  const title = lesson ? lesson.headerTitle : subtopicId;
  
  let html = `📋 **Edexcel Specification Checklist:**\n**${title}**\n\n`;
  html += `<div class="chatbot-checklist-container">`;
  data.forEach((item, index) => {
    const uniqueId = `cb-${subtopicId}-${index}`;
    html += `
      <div class="chatbot-checklist-item">
        <label class="chatbot-checklist-label">
          <input type="checkbox" id="${uniqueId}" class="chatbot-spec-checkbox" />
          <span class="chatbot-checkbox-custom"></span>
          <span class="chatbot-checklist-point-text">${item.point}</span>
        </label>
        <ul class="chatbot-checklist-facts">
    `;
    item.keyFacts.forEach(fact => {
      html += `<li>${fact}</li>`;
    });
    html += `
        </ul>
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

function handleSpecChecklistQuery(queryText) {
  const match = queryText.match(/\b([1-4])\.([1-4])\b/);
  if (match) {
    const unit = match[1];
    const topic = match[2];
    const subtopicId = `subtopic_${unit}_${topic}`;
    if (SPEC_CHECKLIST_DATA[subtopicId]) {
      const checklistHtml = getChecklistHTML(subtopicId);
      appendBubble('assistant', checklistHtml, null, true);
      return;
    }
  }

  const activeSubtopicId = state.selectedSubtopicId;
  if (activeSubtopicId && SPEC_CHECKLIST_DATA[activeSubtopicId]) {
    const checklistHtml = getChecklistHTML(activeSubtopicId);
    appendBubble('assistant', `Showing specification checklist for your active topic:\n\n${checklistHtml}`, null, true);
    return;
  }

  let menuHtml = `📋 **Edexcel GCSE History Specification Checklist**\n\nSelect a Unit to view its topics and syllabus requirements:`;
  menuHtml += `<div class="chatbot-chips-container">
    <button class="chatbot-unit-chip-btn" data-unit="1">Unit 1: Civil Rights, 1954–60</button>
    <button class="chatbot-unit-chip-btn" data-unit="2">Unit 2: Civil Rights, 1960–75</button>
    <button class="chatbot-unit-chip-btn" data-unit="3">Unit 3: US Involvement in Vietnam, 1954–69</button>
    <button class="chatbot-unit-chip-btn" data-unit="4">Unit 4: US Decline in Vietnam, 1969–75</button>
  </div>`;
  appendBubble('assistant', menuHtml, null, true);
}

// --- Text-to-Speech Helper Functions ---
let currentUtterance = null;
let currentTTSBtn = null;

function handleTTS(btn) {
  const bubble = btn.closest('.chatbot-bubble');
  if (!bubble) return;

  const clone = bubble.cloneNode(true);
  const tts = clone.querySelector('.chatbot-tts-btn');
  if (tts) tts.remove();
  const jump = clone.querySelector('.chatbot-jump-link');
  if (jump) jump.remove();
  const nextBtn = clone.querySelector('.chatbot-quiz-next-btn');
  if (nextBtn) nextBtn.remove();
  const optionBtns = clone.querySelectorAll('.chatbot-quiz-option-btn');
  optionBtns.forEach(el => el.remove());
  const chips = clone.querySelector('.chatbot-chips-container');
  if (chips) chips.remove();
  const checkboxes = clone.querySelectorAll('.chatbot-spec-checkbox');
  checkboxes.forEach(el => el.remove());
  
  const rawText = clone.innerText.trim();

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (currentTTSBtn === btn) {
      btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      btn.classList.remove('speaking');
      currentTTSBtn = null;
      return;
    }
  }

  if (currentTTSBtn) {
    currentTTSBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    currentTTSBtn.classList.remove('speaking');
  }

  currentTTSBtn = btn;
  btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  btn.classList.add('speaking');

  const utterance = new SpeechSynthesisUtterance(rawText);
  const voices = window.speechSynthesis.getVoices();
  
  // Search for custom/personal system voice profiles
  const customVoice = voices.find(v => {
    const name = v.name.toLowerCase();
    return name.includes('personal') || name.includes('custom') || name.includes('cloned') || name.includes('user') || name.includes('self');
  });

  const englishVoice = customVoice || voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft')));
  if (englishVoice) {
    utterance.voice = englishVoice;
  }
  utterance.rate = 1.05;

  utterance.onend = () => {
    btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    btn.classList.remove('speaking');
    if (currentTTSBtn === btn) {
      currentTTSBtn = null;
    }
  };

  utterance.onerror = () => {
    btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    btn.classList.remove('speaking');
    if (currentTTSBtn === btn) {
      currentTTSBtn = null;
    }
  };

  window.speechSynthesis.speak(utterance);
}

// --- Persistence Helpers ---
function saveHistoryToLocalStorage() {
  if (chatHistory.length > 15) {
    chatHistory = chatHistory.slice(-15);
  }
  localStorage.setItem('chatbot_history', JSON.stringify(chatHistory));
}

function loadAndRenderHistory() {
  const savedHistory = localStorage.getItem('chatbot_history');
  if (savedHistory) {
    try {
      chatHistory = JSON.parse(savedHistory);
    } catch(e) {
      chatHistory = [];
    }
  }

  const messagesContainer = document.getElementById('chatbot-messages');
  if (!messagesContainer) return;

  // Render
  if (chatHistory.length > 0) {
    messagesContainer.innerHTML = '';
    chatHistory.forEach(msg => {
      const sender = msg.role === 'user' ? 'user' : 'assistant';
      const text = msg.parts?.[0]?.text || '';
      if (text.startsWith('[App Course Content Context:')) {
        const parts = text.split('\n\nUser Question: ');
        const userQuestion = parts.length > 1 ? parts[1] : 'Factual inquiry';
        appendBubble('user', userQuestion);
      } else {
        const isHtml = text.includes('<div') || text.includes('<button') || text.includes('<table') || text.includes('<ul>');
        appendBubble(sender, text, null, isHtml);
      }
    });
  }
}

// --- Active Subtopic Suggestion Helper ---
function updateChatbotSuggestionsForSubtopic(subtopicId) {
  let subtopicObj = null;
  QUIZ_DATA.forEach(topic => {
    if (topic.subtopics) {
      const found = topic.subtopics.find(s => s.id === subtopicId);
      if (found) subtopicObj = found;
    }
  });

  const lesson = LESSONS_DATA[subtopicId];
  const title = subtopicObj ? subtopicObj.title : (lesson ? lesson.headerTitle : 'this topic');
  const cleanTitle = title.replace(/^Topic \d\.\d:\s*/, "");

  const questions = subtopicObj ? [...(subtopicObj.standard || []), ...(subtopicObj.depth || [])] : [];
  if (questions.length === 0) return;

  const shuffled = questions.sort(() => Math.random() - 0.5);
  const selectedQ = shuffled.slice(0, 2);

  let hintHtml = `📚 **Active Study Topic:** *${cleanTitle}*\nHere are some questions you can ask me about this lesson:`;
  hintHtml += `<div class="chatbot-chips-container">`;
  selectedQ.forEach(q => {
    hintHtml += `
      <button class="chatbot-chip-btn" data-query="${q.question.replace(/"/g, '&quot;')}">
        💡 ${q.question}
      </button>
    `;
  });
  hintHtml += `</div>`;

  const lastHistoryMsg = chatHistory[chatHistory.length - 1];
  const isSameSubtopic = lastHistoryMsg && lastHistoryMsg.parts?.[0]?.text.includes(cleanTitle);
  if (!isSameSubtopic) {
    appendBubble('assistant', hintHtml, null, true);
  }
}
