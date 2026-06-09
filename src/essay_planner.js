import { state } from './state.js';
import { AudioEngine } from './audio.js';
import { Confetti } from './confetti.js';
import { addXp } from './views.js';

// --- Essay Prompts & PEEL Paragraph Database ---
export const PLANNER_PROMPTS = {
  prompt_boycott: {
    title: "1.3: Explain why the Montgomery Bus Boycott was successful (1955-56)",
    sentences: [
      { type: "P", text: "One major reason for the boycott's success was the highly organized coordination of the community, led by the Montgomery Improvement Association (MIA)." },
      { type: "E", text: "Under the leadership of Martin Luther King Jr., the MIA established an intricate carpool network of over 300 vehicles, transporting boycotters daily and keeping bus revenue down by 65% for 381 days." },
      { type: "EL", text: "This extensive organization sustained the boycott over a long duration, forcing the bus company into financial crisis and drawing national media attention that pressurized the city." },
      { type: "L", text: "Consequently, the community's disciplined organization and economic pressure directly resulted in the boycott successfully achieving desegregation on buses." }
    ],
    vocab: [
      { word: "Montgomery Improvement Association (MIA)", synonyms: ["mia", "montgomery improvement association"] },
      { word: "Martin Luther King Jr.", synonyms: ["martin luther king", "mlk", "king jr"] },
      { word: "381 days", synonyms: ["381 days", "381-day"] },
      { word: "Browder v. Gayle", synonyms: ["browder v. gayle", "browder v gayle", "browder"] }
    ]
  },
  prompt_little_rock: {
    title: "1.2: Explain why the integration of Little Rock High School was significant (1957)",
    sentences: [
      { type: "P", text: "The integration of Little Rock Central High School was significant because it forced direct federal intervention to enforce desegregation in the face of local state resistance." },
      { type: "E", text: "Governor Orval Faubus used the Arkansas National Guard to block the Little Rock Nine, which compelled President Eisenhower to send 1,200 soldiers of the 101st Airborne Division to escort the students." },
      { type: "EL", text: "This demonstrated that the federal government was prepared to deploy armed forces to support civil rights, establishing federal supremacy over states' rights in constitutional matters." },
      { type: "L", text: "Thus, the events at Little Rock were a landmark because they proved federal law would be actively enforced against segregationist state governments." }
    ],
    vocab: [
      { word: "Little Rock Nine", synonyms: ["little rock nine", "nine black students"] },
      { word: "Orval Faubus", synonyms: ["faubus", "orval faubus"] },
      { word: "101st Airborne Division", synonyms: ["101st airborne", "airborne division", "101st"] },
      { word: "Dwight Eisenhower", synonyms: ["eisenhower", "president eisenhower", "dwight"] }
    ]
  },
  prompt_vietnam_involvement: {
    title: "3.2: Explain why the US became increasingly involved in Vietnam under President Johnson (1964-65)",
    sentences: [
      { type: "P", text: "A primary cause of increased US involvement in Vietnam was the Gulf of Tonkin incident, which President Johnson used to gain congressional authorization for direct military operations." },
      { type: "E", text: "In August 1964, following alleged attacks on the USS Maddox, Congress passed the Gulf of Tonkin Resolution, giving Johnson power to take 'all necessary measures,' leading to Operation Rolling Thunder in 1965." },
      { type: "EL", text: "This resolution bypassed formal declarations of war, allowing the rapid deployment of combat troops to protect South Vietnam from a communist takeover, escalating commitment." },
      { type: "L", text: "Ultimately, the Gulf of Tonkin incident was the key turning point that justified and enabled the massive escalation of US military involvement." }
    ],
    vocab: [
      { word: "Gulf of Tonkin Resolution", synonyms: ["gulf of tonkin resolution", "tonkin resolution"] },
      { word: "USS Maddox", synonyms: ["maddox", "uss maddox"] },
      { word: "Operation Rolling Thunder", synonyms: ["rolling thunder", "operation rolling thunder"] },
      { word: "Lyndon B. Johnson", synonyms: ["johnson", "lbj", "president johnson"] }
    ]
  },
  prompt_vietnam_protest: {
    title: "4.1: Explain why the anti-war movement grew so rapidly in the USA in the late 1960s",
    sentences: [
      { type: "P", text: "One key cause of the rapid growth of the anti-war movement was the introduction of the draft system, which forced young Americans to fight in an increasingly unpopular conflict." },
      { type: "E", text: "Between 1965 and 1969, over 2 million young men were conscripted through the draft, leading to widespread draft-card burning and protests at universities like Kent State." },
      { type: "EL", text: "Because the draft disproportionately affected working-class and minority students who had no voting rights, it energized the youth movement and generated deep resentment." },
      { type: "L", text: "Therefore, the direct personal threat of the military draft was a major catalyst that mobilized public opposition and expanded the anti-war protests." }
    ],
    vocab: [
      { word: "Kent State", synonyms: ["kent state", "kent state university"] },
      { word: "Draft system / Conscription", synonyms: ["draft", "conscription", "draft-card"] },
      { word: "Draft-card burning", synonyms: ["draft-card burning", "burning draft cards", "burn their draft"] },
      { word: "Working-class / Minorities", synonyms: ["working class", "working-class", "minorities", "african americans"] }
    ]
  }
};

let activePrompt = null;
let activePromptId = "";
let selectedSentenceText = "";
let selectedSentenceType = "";
let selectedSentenceEl = null;
let bucketAnswers = { P: false, E: false, EL: false, L: false };

export function initEssayPlanner() {
  const promptSelect = document.getElementById('planner-prompt-select');
  if (!promptSelect) return;

  promptSelect.addEventListener('change', (e) => {
    loadEssayPrompt(e.target.value);
  });

  // Bind Buckets
  const buckets = ['p', 'e', 'el', 'l'];
  buckets.forEach(bId => {
    const bucket = document.getElementById(`bucket-${bId}`);
    if (bucket) {
      bucket.addEventListener('click', () => {
        handleBucketPlacement(bucket);
      });
    }
  });

  // Real-time draft vocab checker
  const draftArea = document.getElementById('planner-essay-draft');
  if (draftArea) {
    draftArea.addEventListener('input', () => {
      updateVocabChecklist(draftArea.value);
    });
  }

  // Bind Evaluate Button
  const evaluateBtn = document.getElementById('btn-planner-evaluate');
  if (evaluateBtn) {
    evaluateBtn.addEventListener('click', () => {
      evaluateEssayDraft();
    });
  }
}

function loadEssayPrompt(promptId) {
  const prompt = PLANNER_PROMPTS[promptId];
  if (!prompt) return;

  activePrompt = prompt;
  activePromptId = promptId;
  selectedSentenceText = "";
  selectedSentenceType = "";
  selectedSentenceEl = null;
  bucketAnswers = { P: false, E: false, EL: false, L: false };

  // Show Workspace, reset inputs & feedback
  document.getElementById('planner-workspace').style.display = 'block';
  document.getElementById('planner-draft-section').style.display = 'none';
  document.getElementById('planner-evaluation-results').style.display = 'none';
  
  const draftArea = document.getElementById('planner-essay-draft');
  if (draftArea) draftArea.value = "";

  // Reset Buckets UI
  const buckets = ['p', 'e', 'el', 'l'];
  buckets.forEach(bId => {
    const bucket = document.getElementById(`bucket-${bId}`);
    const status = bucket.querySelector('.peel-bucket-status');
    const content = bucket.querySelector('.peel-bucket-content');
    
    bucket.style.borderColor = 'var(--border-glass)';
    bucket.style.background = 'rgba(0,0,0,0.05)';
    bucket.style.pointerEvents = 'auto';
    status.textContent = "UNRESOLVED";
    status.style.color = 'var(--text-muted)';
    
    if (bId === 'p') content.textContent = "Click a sentence above, then click here to place it...";
    if (bId === 'e') content.textContent = "Click a sentence above, then click here to place it...";
    if (bId === 'el') content.textContent = "Click a sentence above, then click here to place it...";
    if (bId === 'l') content.textContent = "Click a sentence above, then click here to place it...";
  });

  // Populate Scrambled Sentences
  const scrambledList = document.getElementById('planner-scrambled-list');
  scrambledList.innerHTML = '';
  
  // Shuffle copy of sentences
  const shuffled = [...prompt.sentences].sort(() => Math.random() - 0.5);
  shuffled.forEach((s, idx) => {
    const card = document.createElement('div');
    card.className = 'topic-list-card';
    card.style.margin = '0';
    card.style.padding = '12px 16px';
    card.style.fontSize = '0.88rem';
    card.style.lineHeight = '1.4';
    card.style.textAlign = 'left';
    card.textContent = s.text;
    card.setAttribute('data-type', s.type);
    
    card.addEventListener('click', () => {
      // Clear old selection
      const activeCard = scrambledList.querySelector('.topic-list-card.active-card');
      if (activeCard) {
        activeCard.classList.remove('active-card');
        activeCard.style.borderColor = 'var(--border-glass)';
        activeCard.style.background = 'var(--bg-card)';
      }
      
      // Select new card
      card.classList.add('active-card');
      card.style.borderColor = 'var(--primary)';
      card.style.background = 'var(--primary-glow)';
      
      selectedSentenceText = s.text;
      selectedSentenceType = s.type;
      selectedSentenceEl = card;
      AudioEngine.play('click');
    });
    
    scrambledList.appendChild(card);
  });
}

function handleBucketPlacement(bucket) {
  if (!selectedSentenceText || !selectedSentenceEl) {
    AudioEngine.play('click');
    alert("Please select a sentence card above first, then click on the target PEEL bucket!");
    return;
  }

  const expectedType = bucket.getAttribute('data-type');
  if (selectedSentenceType === expectedType) {
    // Correct Match
    AudioEngine.play('success');
    
    const content = bucket.querySelector('.peel-bucket-content');
    const status = bucket.querySelector('.peel-bucket-status');
    
    content.textContent = selectedSentenceText;
    bucket.style.borderColor = 'var(--success)';
    bucket.style.background = 'rgba(34, 197, 94, 0.05)';
    bucket.style.pointerEvents = 'none'; // Lock bucket
    status.textContent = "CORRECT!";
    status.style.color = 'var(--success)';
    
    bucketAnswers[expectedType] = true;
    selectedSentenceEl.remove();
    
    // Clear selection
    selectedSentenceText = "";
    selectedSentenceType = "";
    selectedSentenceEl = null;
    
    // Check if step 1 is fully resolved
    checkStep1Completion();
  } else {
    // Incorrect Match
    AudioEngine.play('fail');
    
    bucket.classList.add('shake');
    setTimeout(() => {
      bucket.classList.remove('shake');
    }, 450);
    
    const friendlyName = expectedType === 'P' ? 'Point' : (expectedType === 'E' ? 'Evidence' : (expectedType === 'EL' ? 'Explanation' : 'Link'));
    alert(`Historically or structurally incorrect! This sentence is not the [${friendlyName}]. Look at structural connectives or specific evidence indicators.`);
  }
}

function checkStep1Completion() {
  const allSorted = Object.values(bucketAnswers).every(v => v === true);
  if (allSorted) {
    AudioEngine.play('cheer');
    Confetti.spawn(80);
    addXp(10); // +10 XP for Step 1 Sorter Completion

    // Assemble default sorted model essay draft
    const sortedSentences = ['P', 'E', 'EL', 'L'].map(type => {
      return activePrompt.sentences.find(s => s.type === type).text;
    });
    
    const draftArea = document.getElementById('planner-essay-draft');
    if (draftArea) {
      draftArea.value = sortedSentences.join("\n\n");
    }

    // Populate vocab checklist
    const checklist = document.getElementById('planner-vocab-checklist');
    checklist.innerHTML = activePrompt.vocab.map((v, idx) => `
      <div class="vocab-checklist-item" id="vocab-item-${idx}" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); font-size: 0.82rem; color: var(--text-normal); transition: all 0.2s;">
        <i class="fa-regular fa-square" style="font-size: 1.1rem; color: var(--text-muted);"></i>
        <strong>${v.word}</strong>
      </div>
    `).join('');

    // Display draft area
    document.getElementById('planner-draft-section').style.display = 'block';
    
    // Initialize real-time checker
    updateVocabChecklist(draftArea ? draftArea.value : "");
    
    setTimeout(() => {
      document.getElementById('planner-draft-section').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
  }
}

function updateVocabChecklist(text) {
  if (!activePrompt) return;

  const textLower = text.toLowerCase();
  activePrompt.vocab.forEach((v, idx) => {
    const el = document.getElementById(`vocab-item-${idx}`);
    if (!el) return;

    const matched = v.synonyms.some(syn => textLower.includes(syn));
    const checkbox = el.querySelector('i');
    
    if (matched) {
      el.style.background = 'rgba(34, 197, 94, 0.05)';
      el.style.borderColor = 'var(--success)';
      el.style.color = 'var(--success)';
      checkbox.className = 'fa-solid fa-square-check';
      checkbox.style.color = 'var(--success)';
    } else {
      el.style.background = 'rgba(255,255,255,0.02)';
      el.style.borderColor = 'var(--border-glass)';
      el.style.color = 'var(--text-normal)';
      checkbox.className = 'fa-regular fa-square';
      checkbox.style.color = 'var(--text-muted)';
    }
  });
}

function evaluateEssayDraft() {
  const draftArea = document.getElementById('planner-essay-draft');
  if (!draftArea || !activePrompt) return;

  const text = draftArea.value.trim();
  const textLower = text.toLowerCase();

  // Validate minimum word length
  if (text.split(/\s+/).filter(w => w.length > 0).length < 40) {
    AudioEngine.play('click');
    alert("Your paragraph draft seems too short! A strong GCSE analytical PEEL paragraph should contain at least 40 words to elaborate on evidence and explanation.");
    return;
  }

  // Count matches in checklist
  let matchedCount = 0;
  activePrompt.vocab.forEach(v => {
    if (v.synonyms.some(syn => textLower.includes(syn))) {
      matchedCount++;
    }
  });

  // Calculate grade
  let grade = "Apprentice";
  let gradeTitle = "Scholar (Grade 4/5 Equivalent)";
  let gradeColor = "var(--text-muted)";
  let feedback = "";
  
  if (matchedCount === 4) {
    grade = "Master";
    gradeTitle = "Master (Grade 9 Equivalent)";
    gradeColor = "var(--success)";
    feedback = `🎉 <strong>Exceptional analytical draft!</strong> You successfully integrated all four essential historical terms and maintained the strict PEEL structure. Your response shows deep conceptual knowledge and is fully aligned with Grade 9 Edexcel requirements. Keep up this standard of high-impact historical writing!`;
    AudioEngine.play('cheer');
    Confetti.spawn(100);
    addXp(15); // Total 25 XP awarded for full essay planner success
  } else if (matchedCount === 3) {
    grade = "Expert";
    gradeTitle = "Expert (Grade 7/8 Equivalent)";
    gradeColor = "var(--primary)";
    feedback = `👍 <strong>Excellent PEEL paragraph!</strong> You integrated three key vocabulary terms, providing solid historical detail. To push this to a Grade 9 (Master), ensure you reference the final keyword in your explanation or link phase to maximize credit for specialized factual knowledge.`;
    AudioEngine.play('success');
    addXp(5); // Small bump
  } else if (matchedCount === 2) {
    grade = "Scholar";
    gradeTitle = "Scholar (Grade 5/6 Equivalent)";
    gradeColor = "var(--secondary)";
    feedback = `📈 <strong>Good start, but needs more historical detail.</strong> Your paragraph structure is clear, but integrating only two key terms limits your evidence marks. Try to expand your evidence section with specific facts, such as names or statistics shown in the checklist.`;
    AudioEngine.play('success');
  } else {
    grade = "Apprentice";
    gradeTitle = "Apprentice (Below Grade 4)";
    gradeColor = "var(--accent)";
    feedback = `⚠️ <strong>Needs revision and more factual depth.</strong> Make sure your paragraph follows the PEEL structure. Point, Evidence, Explanation, and Link are all required. Make sure to check the checklist and write about the specific details listed there to support your causation argument.`;
    AudioEngine.play('fail');
  }

  // Display results
  const resultsEl = document.getElementById('planner-evaluation-results');
  const gradeCircle = document.getElementById('planner-results-grade-circle');
  const gradeTitleEl = document.getElementById('planner-results-grade-title');
  const feedbackEl = document.getElementById('planner-results-feedback');

  gradeCircle.textContent = grade;
  gradeCircle.style.borderColor = gradeColor;
  gradeCircle.style.color = gradeColor;
  gradeTitleEl.textContent = gradeTitle;
  feedbackEl.innerHTML = feedback;

  resultsEl.style.display = 'block';
  
  setTimeout(() => {
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 200);
}
