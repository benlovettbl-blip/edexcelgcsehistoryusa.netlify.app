import { LESSONS_DATA } from './lessons_data.js';
import { QUIZ_DATA } from '../questions.js';
import { switchView } from './navigation.js';
import { state } from './state.js';

let searchDatabase = [];
let chatHistory = [];

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
  <br><br>
  <em>Tip: If you add your Gemini API key via the settings gear (⚙️), I can use AI to answer custom history questions beyond the app!</em>
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
      Timings: Q1 5 minutes, Q2 18 minutes, Q3a 15 minutes, Q3b 5 minutes, Q3c 5 minutes, Q3d 25 minutes.
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

// Format markdown-like text to clean HTML
function formatMessageText(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
}

// Send user query to Gemini API
async function fetchGeminiResponse(apiKey, userInput, localContext) {
  const systemInstruction = `You are a strict, helpful AI history tutor for Edexcel GCSE History, Paper 3: Modern Depth Study - USA (1954-75).
Your task is to answer the student's question accurately, concisely, and at a GCSE level (appropriate for 14-16 year olds).
Rules:
- Keep the response short (strictly under 100 words).
- Focus strictly on historical facts relevant to the Edexcel GCSE USA specification.
- If the question is outside the scope of the Edexcel USA (1954-75) specification, politely guide the student back to the history course.
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

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    const aiText = data.candidates[0].content.parts[0].text.trim();
    
    // Save AI response to chat history thread
    chatHistory.push({
      role: "model",
      parts: [{ text: aiText }]
    });

    return aiText;
  } else {
    throw new Error("No response content from Gemini.");
  }
}

// Append a new bubble to the chat container
function appendBubble(sender, contentText, subtopicLink = null) {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = `chatbot-bubble ${sender}`;
  bubble.innerHTML = formatMessageText(contentText);

  if (subtopicLink) {
    const linkBtn = document.createElement('button');
    linkBtn.className = 'chatbot-jump-link';
    linkBtn.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Study: ${subtopicLink.cleanTitle}`;
    linkBtn.setAttribute('data-subtopic-id', subtopicLink.id);
    bubble.appendChild(linkBtn);
  }

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
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
        <button class="chatbot-action-btn" id="chatbot-settings-toggle" title="Gemini API Key Settings">
          <i class="fa-solid fa-gear"></i>
        </button>
        <button class="chatbot-action-btn" id="chatbot-close-btn" title="Close Chat">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <!-- API Key settings panel -->
    <div class="chatbot-settings-panel" id="chatbot-settings-panel">
      <div class="chatbot-settings-label">Gemini API Key Setup</div>
      <div class="chatbot-settings-input-row">
        <input type="password" class="chatbot-input" id="chatbot-api-key-input" placeholder="${apiKey ? '••••••••••••••••••••' : 'Enter Gemini API Key...'}" />
        <button class="chatbot-send-btn" id="chatbot-save-key-btn" title="Save Key">
          <i class="fa-solid fa-check"></i>
        </button>
      </div>
      <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 4px; line-height: 1.3;">
        Your key is stored strictly on your device. Get a free API key at 
        <a href="https://aistudio.google.com/" target="_blank" style="color: var(--primary); text-decoration: underline;">Google AI Studio</a>.
      </div>
    </div>

    <!-- Messages Container -->
    <div class="chatbot-messages" id="chatbot-messages">
      <div class="chatbot-bubble assistant">
        ${WELCOME_HTML}
      </div>
    </div>

    <!-- Footer Input Area -->
    <div class="chatbot-input-row">
      <input type="text" class="chatbot-input" id="chatbot-user-input" placeholder="Ask a question..." autocomplete="off" />
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

  // Load key input state
  if (apiKey) {
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
  toggleSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
  });

  // 3. Save API Key
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

  // 4. Close Chat Button
  closeBtn.addEventListener('click', () => {
    fab.classList.remove('active');
    windowEl.classList.remove('active');
  });

  // 5. Clear Chat Thread
  clearBtn.addEventListener('click', () => {
    chatHistory = [];
    messagesContainer.innerHTML = `<div class="chatbot-bubble assistant">${WELCOME_HTML}</div>`;
    appendBubble('system', 'Chat history cleared.');
  });

  // 6. In-app navigation links & Suggestion Prompt Chips (Event delegation)
  messagesContainer.addEventListener('click', (e) => {
    // Jump to lesson link clicks
    const jumpLink = e.target.closest('.chatbot-jump-link');
    if (jumpLink) {
      const subtopicId = jumpLink.getAttribute('data-subtopic-id');
      if (subtopicId) {
        if (subtopicId === 'exam_technique') {
          switchView('exam-skills');
          const btn = document.querySelector('.exam-tab-btn[data-panel="technique"]');
          if (btn) btn.click();
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
    }
  });

  // Handle message sending pipeline
  async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // Display user text
    appendBubble('user', text);
    userInput.value = '';

    // Step 1: Perform local app database match search
    const localMatches = searchLocalApp(text);
    const bestMatch = localMatches[0];

    // If matching exam technique, navigate automatically!
    if (bestMatch && bestMatch.id === 'exam_technique') {
      appendBubble('assistant', 'Opening the **Exam Technique Guide** for you now...');
      setTimeout(() => {
        switchView('exam-skills');
        const btn = document.querySelector('.exam-tab-btn[data-panel="technique"]');
        if (btn) btn.click();
        
        // Hide window on mobile to avoid screen crowding
        if (window.innerWidth <= 480) {
          fab.classList.remove('active');
          windowEl.classList.remove('active');
        }
      }, 700);
      return;
    }

    // If API Key is present, leverage Gemini AI
    if (apiKey) {
      appendThinkingBubble();
      try {
        const responseText = await fetchGeminiResponse(apiKey, text, bestMatch);
        removeThinkingBubble();
        
        // Show AI response along with a direct jump link if a relevant local topic matched
        appendBubble('assistant', responseText, bestMatch);
      } catch (err) {
        removeThinkingBubble();
        appendBubble('system', `API Error: ${err.message}. Please double-check your Gemini API key settings.`);
      }
    } else {
      // Local Database fallback mode
      if (bestMatch) {
        const fallbackText = getLocalStaticResponse(bestMatch, text);
        appendBubble('assistant', fallbackText, bestMatch);
      } else {
        appendBubble('assistant', `I couldn't find a direct match for that in the course content. To draw answers from the wider internet, please enter your Gemini API Key in the settings (click the ⚙️ gear icon).`);
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
