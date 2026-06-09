import { state } from './state.js';
import { saveProgress } from './storage.js';
import { AudioEngine } from './audio.js';
import { getKeywordsForQuestion, highlightModelQuotes } from './layout.js';
import { PAST_PAPERS_DATA, EXAM_SKILLS_DATA } from '../questions.js';

// --- Past Exam Papers Engine ---

export function updateDraftFeedback(qId, value, questionObj) {
  const badge = document.getElementById(`feedback-badge-${qId}`);
  const fill = document.getElementById(`feedback-fill-${qId}`);
  const connTags = document.getElementById(`connective-tags-${qId}`);
  const keyTags = document.getElementById(`keyword-tags-${qId}`);
  const keyRow = document.getElementById(`keyword-feedback-row-${qId}`);
  
  if (!badge || !fill) return;
  
  const text = (value || '').toLowerCase().trim();
  
  // Causal/analytical connectives check
  const connectives = ["because", "as a result", "led to", "resulted in", "provoked", "consequently", "enabled", "intensified", "forced", "therefore", "agree", "disagree", "however", "on the other hand"];
  const matchedConnectives = connectives.filter(c => text.includes(c));
  
  // Keywords check using helper
  const keywords = getKeywordsForQuestion(questionObj);
  const matchedKeywords = keywords.filter(k => text.includes(k.toLowerCase()));
  
  // Scoring
  const connectivesScore = Math.min(50, matchedConnectives.length * 10);
  const keywordsScore = keywords.length > 0 ? Math.min(50, matchedKeywords.length * (50 / keywords.length)) : 50;
  const totalScore = Math.round(connectivesScore + keywordsScore);
  
  // Update progress bar
  fill.style.width = `${totalScore}%`;
  
  // Update status badge
  badge.className = "feedback-badge";
  if (totalScore <= 20) {
    badge.textContent = "Structure: Drafting";
  } else if (totalScore <= 50) {
    badge.textContent = "Structure: Developing";
    badge.classList.add('status-developing');
  } else if (totalScore <= 80) {
    badge.textContent = "Structure: Strong";
    badge.classList.add('status-strong');
  } else {
    badge.textContent = "Structure: Exam-Ready";
    badge.classList.add('status-outstanding');
  }
  
  // Render connectives pills
  if (connTags) {
    connTags.innerHTML = connectives.map(c => {
      const matched = matchedConnectives.includes(c);
      return `<span class="feedback-tag ${matched ? 'matched' : ''}">${matched ? '✔ ' : ''}${c}</span>`;
    }).join('');
  }
  
  // Render keywords pills
  if (keywords.length > 0) {
    if (keyRow) keyRow.style.display = 'block';
    if (keyTags) {
      keyTags.innerHTML = keywords.map(k => {
        const matched = matchedKeywords.includes(k);
        return `<span class="feedback-tag ${matched ? 'matched' : ''}">${matched ? '✔ ' : ''}${k}</span>`;
      }).join('');
    }
  } else {
    if (keyRow) keyRow.style.display = 'none';
  }
}

export function renderPastPapersView() {
  const container = document.getElementById('past-paper-sheet-container');
  if (state.pastPaperSession.activePaperId) {
    renderExamSheet();
    if (container) container.style.display = 'block';
  } else {
    if (container) container.style.display = 'none';
  }
}

export function startPastPaper(paperId) {
  const paper = PAST_PAPERS_DATA.find(p => p.id === paperId);
  if (!paper) return;

  state.pastPaperSession.activePaperId = paperId;
  state.pastPaperSession.activePaperData = paper;
  if (!state.pastPaperSession.answers[paperId]) {
    state.pastPaperSession.answers[paperId] = {};
  }
  
  renderExamSheet();
  const sheetContainer = document.getElementById('past-paper-sheet-container');
  if (sheetContainer) sheetContainer.style.display = 'block';
}

export function generateMockExam() {
  // Sample random Q1 from EXAM_SKILLS_DATA.q1
  const q1Keys = Object.keys(EXAM_SKILLS_DATA.q1);
  const randomQ1Key = q1Keys[Math.floor(Math.random() * q1Keys.length)];
  const selectedQ1 = EXAM_SKILLS_DATA.q1[randomQ1Key];

  // Sample random Q2 from EXAM_SKILLS_DATA.q2
  const q2Keys = Object.keys(EXAM_SKILLS_DATA.q2);
  const randomQ2Key = q2Keys[Math.floor(Math.random() * q2Keys.length)];
  const selectedQ2 = EXAM_SKILLS_DATA.q2[randomQ2Key];

  // Sample random Q3 from EXAM_SKILLS_DATA.q3
  const q3Keys = Object.keys(EXAM_SKILLS_DATA.q3);
  const randomQ3Key = q3Keys[Math.floor(Math.random() * q3Keys.length)];
  const selectedQ3 = EXAM_SKILLS_DATA.q3[randomQ3Key];

  const paper = {
    id: "mock_random_" + Date.now(),
    title: "Random Mock Exam (Paper 3)",
    year: "Mock",
    enquiryTopic: selectedQ3.questiona.replace("How useful are Sources B and C for an enquiry into ", "").replace("?", ""),
    sourceA: selectedQ1.sourceA,
    sourceB: selectedQ3.sourceB,
    sourceC: selectedQ3.sourceC,
    interpretation1: selectedQ3.interpretation1,
    interpretation2: selectedQ3.interpretation2,
    q1: {
      id: selectedQ1.id,
      question: selectedQ1.question + " (4 marks)",
      clue: selectedQ1.clue,
      model: selectedQ1.model
    },
    q2: {
      id: selectedQ2.id,
      question: selectedQ2.question + " (12 marks)",
      stimulus: [selectedQ2.stimulus1, selectedQ2.stimulus2],
      clue: selectedQ2.clue,
      model: selectedQ2.model
    },
    q3a: {
      id: selectedQ3.id + "_a",
      question: selectedQ3.questiona + " (8 marks)",
      clue: selectedQ3.cluea,
      model: selectedQ3.modela
    },
    q3b: {
      id: selectedQ3.id + "_b",
      question: selectedQ3.questionb + " (4 marks)",
      clue: selectedQ3.clueb,
      model: selectedQ3.modelb
    },
    q3c: {
      id: selectedQ3.id + "_c",
      question: selectedQ3.questionc + " (4 marks)",
      clue: selectedQ3.cluec,
      model: selectedQ3.modelc
    },
    q3d: {
      id: selectedQ3.id + "_d",
      question: selectedQ3.questiond + " (16 marks)",
      clue: selectedQ3.clued,
      model: selectedQ3.modeld
    }
  };

  state.pastPaperSession.activePaperId = paper.id;
  state.pastPaperSession.activePaperData = paper;
  state.pastPaperSession.answers[paper.id] = {};

  renderExamSheet();
  const sheetContainer = document.getElementById('past-paper-sheet-container');
  if (sheetContainer) sheetContainer.style.display = 'block';
}

export function togglePastClue(qId) {
  const box = document.getElementById(`past-clue-box-${qId}`);
  if (!box) return;
  const isHidden = box.style.display === 'none';
  box.style.display = isHidden ? 'block' : 'none';
  AudioEngine.play(isHidden ? 'flip' : 'click');
}

export function togglePastAnswer(qId) {
  const box = document.getElementById(`past-answer-box-${qId}`);
  if (!box) return;
  const isHidden = box.style.display === 'none';
  box.style.display = isHidden ? 'block' : 'none';
  AudioEngine.play(isHidden ? 'success' : 'click');
}

export function togglePastQuestionComplete(qId, checked) {
  const session = state.pastPaperSession;
  if (checked) {
    if (!session.completedQuestions.includes(qId)) {
      session.completedQuestions.push(qId);
      AudioEngine.play('success');
    }
  } else {
    const idx = session.completedQuestions.indexOf(qId);
    if (idx > -1) {
      session.completedQuestions.splice(idx, 1);
      AudioEngine.play('click');
    }
  }
  saveProgress();
}

export function renderExamSheet() {
  const session = state.pastPaperSession;
  const paper = session.activePaperData;
  const container = document.getElementById('past-paper-sheet-container');
  if (!paper || !container) return;

  const questionsList = [
    paper.id + '_q1',
    paper.id + '_q2',
    paper.id + '_q3a',
    paper.id + '_q3b',
    paper.id + '_q3c',
    paper.id + '_q3d'
  ];

  const completedCount = questionsList.filter(id => session.completedQuestions.includes(id)).length;
  const pct = questionsList.length > 0 ? Math.round((completedCount / questionsList.length) * 100) : 0;

  let html = `
    <div class="exam-sheet">
      <div class="exam-sheet-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; border-bottom: 1px solid var(--border-glass); padding-bottom: 15px;">
        <div>
          <h3 style="margin: 0; font-family: var(--font-heading); color: var(--text-main); font-size: 1.4rem;">${paper.title}</h3>
          <div class="exam-metadata" style="margin-top: 6px; display: flex; gap: 16px; font-size: 0.82rem; color: var(--text-muted);">
            <span><i class="fa-solid fa-calendar"></i> Year: ${paper.year}</span>
            <span><i class="fa-solid fa-clock"></i> Duration: 1h 30m</span>
            <span><i class="fa-solid fa-check-double"></i> Complete: ${completedCount}/${questionsList.length} (${pct}%)</span>
          </div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button class="btn-secondary btn-blue-variant" id="btn-copy-exam-clean" style="height: 36px; box-sizing: border-box;">
            <i class="fa-solid fa-copy"></i> Copy Clean Exam
          </button>
          <button class="btn-secondary btn-green-variant" id="btn-copy-exam-answers" style="height: 36px; box-sizing: border-box;">
            <i class="fa-solid fa-copy"></i> Copy with Answers
          </button>
          <div style="display: flex; align-items: center; gap: 6px; margin-left: auto;">
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; white-space: nowrap;">Print Mode:</span>
            <select class="select-input" id="print-exam-mode" style="padding: 6px 10px; font-size: 0.8rem; background: rgba(0,0,0,0.25); border: 1px solid var(--border-glass); color: var(--text-main); border-radius: 4px; outline: none; cursor: pointer; height: 36px; box-sizing: border-box;">
              <option value="clean">Clean Student Paper</option>
              <option value="model">With Model Answers</option>
              <option value="written">With My Written Answers</option>
            </select>
          </div>
          <button class="btn-primary" id="btn-print-exam-sheet" style="background: #10b981; border: none; color: white; cursor: pointer; display: flex; align-items: center; gap: 6px; height: 36px; padding: 6px 12px; box-sizing: border-box;">
            <i class="fa-solid fa-print"></i> Print / PDF
          </button>
          <button class="btn-secondary" id="btn-word-exam-sheet" style="border-color: #f59e0b; color: #f59e0b; background: transparent; cursor: pointer; display: flex; align-items: center; gap: 6px; height: 36px; padding: 6px 12px; box-sizing: border-box;">
            <i class="fa-solid fa-file-word"></i> Export Word
          </button>
        </div>
      </div>
  `;

  // Section 1: Q1
  html += `
    <div class="exam-sheet-section">
      <h4>Section A: Source Inference (Q1 - 4 marks)</h4>
      ${paper.sourceA ? `
        <div class="skills-source-card" style="padding: 20px; background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); margin-bottom: 24px; position: relative;">
          <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--primary);"></div>
          <span class="badge" style="background: var(--primary-glow); color: var(--primary); padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; display: inline-block; margin-bottom: 8px;">SOURCE A</span>
          <p style="font-size: 0.82rem; font-weight: bold; color: var(--text-main); margin-bottom: 10px; line-height: 1.4;">${paper.sourceA.provenance}</p>
          ${paper.sourceA.image ? `
            <img src="${paper.sourceA.image}" alt="${paper.sourceA.provenance}" class="exam-source-img" />
          ` : ''}
          <div style="font-size: 0.95rem; font-style: italic; line-height: 1.6; color: var(--text-muted); border-left: 2px solid var(--border-glass); padding-left: 12px; margin-top: 10px;">${paper.sourceA.content}</div>
        </div>
      ` : ''}
      ${renderPastQuestionMarkup(paper.id + '_q1', paper.q1.question, paper.q1.clue, paper.q1.model, 4)}
    </div>
  `;

  // Section 2: Q2
  html += `
    <div class="exam-sheet-section" style="margin-top: 32px;">
      <h4>Section B: Causation Essay (Q2 - 12 marks)</h4>
      ${renderPastQuestionMarkup(paper.id + '_q2', paper.q2.question, paper.q2.clue, paper.q2.model, 12, paper.q2.stimulus)}
    </div>
  `;

  // Section 3: Q3a
  html += `
    <div class="exam-sheet-section" style="margin-top: 32px;">
      <h4>Section C: Source Utility (Q3a - 8 marks)</h4>
      ${paper.sourceB && paper.sourceC ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px; margin-bottom: 24px;">
          <div class="skills-source-card" style="padding: 16px; background: rgba(0, 0, 0, 0.12); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--primary);"></div>
            <span class="badge" style="background: var(--primary-glow); color: var(--primary); padding: 2px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display: inline-block;">SOURCE B</span>
            <p style="font-size: 0.8rem; font-weight: bold; color: var(--text-main); margin-bottom: 8px; line-height: 1.35;">${paper.sourceB.provenance}</p>
            ${paper.sourceB.image ? `
              <img src="${paper.sourceB.image}" alt="${paper.sourceB.provenance}" class="exam-source-img" />
            ` : ''}
            <p style="font-size: 0.88rem; font-style: italic; line-height: 1.5; color: var(--text-muted); margin: 0;">${paper.sourceB.content}</p>
          </div>
          <div class="skills-source-card" style="padding: 16px; background: rgba(0, 0, 0, 0.12); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--primary);"></div>
            <span class="badge" style="background: var(--primary-glow); color: var(--primary); padding: 2px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display: inline-block;">SOURCE C</span>
            <p style="font-size: 0.8rem; font-weight: bold; color: var(--text-main); margin-bottom: 8px; line-height: 1.35;">${paper.sourceC.provenance}</p>
            ${paper.sourceC.image ? `
              <img src="${paper.sourceC.image}" alt="${paper.sourceC.provenance}" class="exam-source-img" />
            ` : ''}
            <p style="font-size: 0.88rem; font-style: italic; line-height: 1.5; color: var(--text-muted); margin: 0;">${paper.sourceC.content}</p>
          </div>
        </div>
      ` : ''}
      ${renderPastQuestionMarkup(paper.id + '_q3a', paper.q3a.question, paper.q3a.clue, paper.q3a.model, 8)}
    </div>
  `;

  // Section 4: Q3bcd
  html += `
    <div class="exam-sheet-section" style="margin-top: 32px;">
      <h4>Section D: Interpretations Suite (Q3b-d - 24 marks total)</h4>
      
      ${paper.sourceB && paper.sourceC ? `
        <strong style="display: block; margin-top: 20px; margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Sources B & C:</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <div class="skills-source-card" style="padding: 16px; background: rgba(0, 0, 0, 0.12); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--primary);"></div>
            <span class="badge" style="background: var(--primary-glow); color: var(--primary); padding: 2px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display: inline-block;">SOURCE B</span>
            <p style="font-size: 0.8rem; font-weight: bold; color: var(--text-main); margin-bottom: 8px; line-height: 1.35;">${paper.sourceB.provenance}</p>
            ${paper.sourceB.image ? `
              <img src="${paper.sourceB.image}" alt="${paper.sourceB.provenance}" class="exam-source-img" />
            ` : ''}
            <p style="font-size: 0.88rem; font-style: italic; line-height: 1.5; color: var(--text-muted); margin: 0;">${paper.sourceB.content}</p>
          </div>
          <div class="skills-source-card" style="padding: 16px; background: rgba(0, 0, 0, 0.12); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--primary);"></div>
            <span class="badge" style="background: var(--primary-glow); color: var(--primary); padding: 2px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display: inline-block;">SOURCE C</span>
            <p style="font-size: 0.8rem; font-weight: bold; color: var(--text-main); margin-bottom: 8px; line-height: 1.35;">${paper.sourceC.provenance}</p>
            ${paper.sourceC.image ? `
              <img src="${paper.sourceC.image}" alt="${paper.sourceC.provenance}" class="exam-source-img" />
            ` : ''}
            <p style="font-size: 0.88rem; font-style: italic; line-height: 1.5; color: var(--text-muted); margin: 0;">${paper.sourceC.content}</p>
          </div>
        </div>
      ` : ''}

      ${paper.interpretation1 && paper.interpretation2 ? `
        <strong style="display: block; margin-top: 20px; margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Interpretations 1 & 2:</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <div class="skills-source-card" style="padding: 16px; background: rgba(0, 0, 0, 0.12); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--secondary);"></div>
            <span class="badge" style="background: var(--secondary-glow); color: var(--secondary); padding: 2px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display: inline-block;">INTERPRETATION 1</span>
            <p style="font-size: 0.8rem; font-weight: bold; color: var(--text-main); margin-bottom: 8px; line-height: 1.35;">${paper.interpretation1.author}</p>
            <p style="font-size: 0.88rem; font-style: italic; line-height: 1.5; color: var(--text-muted); margin: 0;">${paper.interpretation1.content}</p>
          </div>
          <div class="skills-source-card" style="padding: 16px; background: rgba(0, 0, 0, 0.12); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--secondary);"></div>
            <span class="badge" style="background: var(--secondary-glow); color: var(--secondary); padding: 2px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display: inline-block;">INTERPRETATION 2</span>
            <p style="font-size: 0.8rem; font-weight: bold; color: var(--text-main); margin-bottom: 8px; line-height: 1.35;">${paper.interpretation2.author}</p>
            <p style="font-size: 0.88rem; font-style: italic; line-height: 1.5; color: var(--text-muted); margin: 0;">${paper.interpretation2.content}</p>
          </div>
        </div>
      ` : ''}

      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${renderPastQuestionMarkup(paper.id + '_q3b', paper.q3b.question, paper.q3b.clue, paper.q3b.model, 4)}
        ${renderPastQuestionMarkup(paper.id + '_q3c', paper.q3c.question, paper.q3c.clue, paper.q3c.model, 4)}
        ${renderPastQuestionMarkup(paper.id + '_q3d', paper.q3d.question, paper.q3d.clue, paper.q3d.model, "16 + 4 SPaG")}
      </div>
    </div>
  `;

  html += `
      <div style="display: flex; justify-content: flex-end; margin-top: 32px;">
        <button class="btn-secondary" id="btn-close-exam-sheet" style="font-weight: 600;">
          Close Paper & Save Draft
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  questionsList.forEach(qId => {
    let qObj = null;
    if (qId === paper.id + '_q1') qObj = paper.q1;
    else if (qId === paper.id + '_q2') qObj = paper.q2;
    else if (qId === paper.id + '_q3a') qObj = paper.q3a;
    else if (qId === paper.id + '_q3b') qObj = paper.q3b;
    else if (qId === paper.id + '_q3c') qObj = paper.q3c;
    else if (qId === paper.id + '_q3d') qObj = paper.q3d;

    const textarea = document.getElementById(`past-textarea-${qId}`);
    if (textarea && qObj) {
      if (qId.endsWith('_q1') && !session.answers[paper.id][qId]) {
        session.answers[paper.id][qId] = "Inference 1: \nQuote 1: \n\nInference 2: \nQuote 2: ";
      }
      textarea.value = session.answers[paper.id][qId] || '';
      updateDraftFeedback(qId, textarea.value, qObj);
      textarea.addEventListener('input', (e) => {
        session.answers[paper.id][qId] = e.target.value;
        updateDraftFeedback(qId, e.target.value, qObj);
        saveProgress();
      });
    }

    const chk = document.getElementById(`past-chk-${qId}`);
    if (chk) {
      chk.checked = session.completedQuestions.includes(qId);
      chk.addEventListener('change', (e) => {
        togglePastQuestionComplete(qId, e.target.checked);
        renderExamSheetStats();
      });
    }

    const btnClue = document.getElementById(`past-btn-clue-${qId}`);
    if (btnClue) {
      btnClue.addEventListener('click', () => togglePastClue(qId));
    }

    const btnScaffold = document.getElementById(`past-btn-scaffold-${qId}`);
    if (btnScaffold) {
      btnScaffold.addEventListener('click', () => {
        const box = document.getElementById(`past-scaffold-box-${qId}`);
        if (box) {
          const isHidden = box.style.display === 'none';
          box.style.display = isHidden ? 'block' : 'none';
          AudioEngine.play(isHidden ? 'flip' : 'click');
        }
      });
    }

    const scaffoldBox = document.getElementById(`past-scaffold-box-${qId}`);
    if (scaffoldBox) {
      const starterBtns = scaffoldBox.querySelectorAll('.scaffold-starter-btn');
      starterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const starterText = btn.getAttribute('data-starter');
          const textarea = document.getElementById(`past-textarea-${qId}`);
          if (textarea) {
            AudioEngine.play('success');
            
            // Append or insert at cursor
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            const originalVal = textarea.value;
            
            let insertStr = starterText;
            if (startPos > 0 && originalVal[startPos - 1] !== ' ' && originalVal[startPos - 1] !== '\n') {
              insertStr = ' ' + insertStr;
            }
            
            textarea.value = originalVal.substring(0, startPos) + insertStr + originalVal.substring(endPos);
            textarea.focus();
            
            const newCursorPos = startPos + insertStr.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            
            // Trigger input event to update feedback
            const event = new Event('input', { bubbles: true });
            textarea.dispatchEvent(event);
          }
        });
      });
    }

    const btnCheck = document.getElementById(`past-btn-check-${qId}`);
    if (btnCheck) {
      btnCheck.addEventListener('click', () => togglePastAnswer(qId));
    }
  });

  const closeBtn = document.getElementById('btn-close-exam-sheet');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      AudioEngine.play('click');
      state.pastPaperSession.activePaperId = null;
      state.pastPaperSession.activePaperData = null;
      container.style.display = 'none';
      const selectEl = document.getElementById('past-paper-select');
      if (selectEl) selectEl.value = '';
    });
  }

  const handleCopyAction = (btnEl, includeAnswers) => {
    let text = `${paper.title.toUpperCase()}\n`;
    text += `Option 33: The USA, 1954-75: Conflict at Home and Abroad\n`;
    text += `========================================================================\n\n`;

    const cleanBrackets = (str) => (str || '')
      .replace(/\[\[/g, '')
      .replace(/\]\]/g, '')
      .replace(/\{\{/g, '')
      .replace(/\}\}/g, '')
      .replace(/\[1\[/g, '')
      .replace(/\]1\]/g, '')
      .replace(/\[2\[/g, '')
      .replace(/\]2\]/g, '');

    text += `SECTION A: SOURCE INFERENCE\n`;
    text += `-------------------------------------------\n`;
    if (paper.sourceA) {
      text += `SOURCE A:\n`;
      text += `Provenance: ${paper.sourceA.provenance}\n`;
      text += `"${paper.sourceA.content}"\n\n`;
    }
    text += `Question 1: ${paper.q1.question.replace(/\(\d+\s*marks?\)/gi, '').trim()} (4 Marks)\n\n`;
    if (includeAnswers) {
      text += `MODEL ANSWER:\n${cleanBrackets(paper.q1.model)}\n\n`;
    }

    text += `SECTION B: CAUSATION ESSAY\n`;
    text += `-------------------------------------------\n`;
    text += `Question 2: ${paper.q2.question.replace(/\(\d+\s*marks?\)/gi, '').trim()} (12 Marks)\n`;
    if (paper.q2.stimulus && paper.q2.stimulus.length > 0) {
      text += `You may use the following in your answer:\n`;
      paper.q2.stimulus.forEach(s => {
        text += ` - ${s}\n`;
      });
      text += `You must also use information of your own.\n`;
    }
    text += `\n`;
    if (includeAnswers) {
      text += `MODEL ANSWER:\n${cleanBrackets(paper.q2.model)}\n\n`;
    }

    text += `SECTION C: SOURCES & INTERPRETATIONS ENQUIRY\n`;
    text += `-------------------------------------------\n`;
    text += `Enquiry Focus: ${paper.enquiryTopic || ''}\n\n`;
    if (paper.sourceB) {
      text += `SOURCE B:\n`;
      text += `Provenance: ${paper.sourceB.provenance}\n`;
      text += `"${paper.sourceB.content}"\n\n`;
    }
    if (paper.sourceC) {
      text += `SOURCE C:\n`;
      text += `Provenance: ${paper.sourceC.provenance}\n`;
      text += `"${paper.sourceC.content}"\n\n`;
    }
    text += `Question 3a: ${paper.q3a.question.replace(/\(\d+\s*marks?\)/gi, '').trim()} (8 Marks)\n\n`;
    if (includeAnswers) {
      text += `MODEL ANSWER:\n${cleanBrackets(paper.q3a.model)}\n\n`;
    }

    if (paper.interpretation1) {
      text += `INTERPRETATION 1:\n`;
      text += `Author/Provenance: ${paper.interpretation1.author || ''}\n`;
      text += `"${paper.interpretation1.content}"\n\n`;
    }
    if (paper.interpretation2) {
      text += `INTERPRETATION 2:\n`;
      text += `Author/Provenance: ${paper.interpretation2.author || ''}\n`;
      text += `"${paper.interpretation2.content}"\n\n`;
    }

    text += `Question 3b: ${paper.q3b.question.replace(/\(\d+\s*marks?\)/gi, '').trim()} (4 Marks)\n\n`;
    if (includeAnswers) {
      text += `MODEL ANSWER:\n${cleanBrackets(paper.q3b.model)}\n\n`;
    }
    text += `Question 3c: ${paper.q3c.question.replace(/\(\d+\s*marks?\)/gi, '').trim()} (4 Marks)\n\n`;
    if (includeAnswers) {
      text += `MODEL ANSWER:\n${cleanBrackets(paper.q3c.model)}\n\n`;
    }
    text += `Question 3d: ${paper.q3d.question.replace(/\(\d+\s*marks?\)/gi, '').trim()} (16 + 4 SPaG Marks)\n`;
    text += `Explain your answer, using both interpretations, and your knowledge of the historical context.\n`;
    if (includeAnswers) {
      text += `\nMODEL ANSWER:\n${cleanBrackets(paper.q3d.model)}\n`;
    }

    navigator.clipboard.writeText(text).then(() => {
      AudioEngine.play('success');
      const originalHTML = btnEl.innerHTML;
      const originalBorder = btnEl.style.borderColor;
      const originalColor = btnEl.style.color;

      btnEl.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
      btnEl.style.borderColor = 'rgba(16, 185, 129, 0.6)';
      btnEl.style.color = '#10b981';

      setTimeout(() => {
        btnEl.innerHTML = originalHTML;
        btnEl.style.borderColor = originalBorder;
        btnEl.style.color = originalColor;
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy: ", err);
      alert("Exam text copied to clipboard!\n\n" + text);
    });
  };

  const btnCopyClean = document.getElementById('btn-copy-exam-clean');
  if (btnCopyClean) {
    btnCopyClean.addEventListener('click', () => handleCopyAction(btnCopyClean, false));
  }

  const btnCopyAnswers = document.getElementById('btn-copy-exam-answers');
  if (btnCopyAnswers) {
    btnCopyAnswers.addEventListener('click', () => handleCopyAction(btnCopyAnswers, true));
  }

  const btnPrintSheet = document.getElementById('btn-print-exam-sheet');
  if (btnPrintSheet) {
    btnPrintSheet.addEventListener('click', () => {
      AudioEngine.play('click');
      const mode = document.getElementById('print-exam-mode').value;
      
      let html = generatePastPaperHtml(paper, mode);
      
      const bodyStart = html.indexOf('<body>');
      const bodyEnd = html.lastIndexOf('</body>');
      let cleanHtml = html;
      if (bodyStart !== -1 && bodyEnd !== -1) {
        cleanHtml = html.substring(bodyStart + 6, bodyEnd);
      }
      
      const printArea = document.getElementById('print-area');
      if (printArea) {
        printArea.innerHTML = cleanHtml;
        window.print();
      } else {
        alert("Print error: #print-area element not found in DOM.");
      }
    });
  }

  const btnWordSheet = document.getElementById('btn-word-exam-sheet');
  if (btnWordSheet) {
    btnWordSheet.addEventListener('click', () => {
      AudioEngine.play('click');
      const mode = document.getElementById('print-exam-mode').value;
      const filename = `${paper.title.replace(/\s+/g, '_')}_${mode}.doc`;
      const html = generatePastPaperHtml(paper, mode);
      downloadHtmlAsWord(filename, html);
      AudioEngine.play('success');
    });
  }
}

export function renderPastQuestionMarkup(qId, questionText, clue, modelAnswer, marks, stimulus = null) {
  let stimulusHTML = '';
  if (stimulus && stimulus.length > 0) {
    stimulusHTML = `
      <div class="stimulus-container">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); display: flex; align-items: center;">Stimulus:</span>
        ${stimulus.map(s => `<span class="stimulus-item">${s}</span>`).join('')}
      </div>
    `;
  }

  // Clean trailing marks suffix e.g. (16 marks) from question title
  const cleanQuestionText = questionText.replace(/\(\d+\s*marks?\)/gi, '').trim();

  // Appending the official instruction line for Q3 questions
  let instructionHTML = '';
  if (qId.endsWith('_q3a')) {
    instructionHTML = `
      <p class="exam-question-instructions" style="font-style: italic; font-size: 0.88rem; color: var(--text-muted); margin-top: 6px; margin-bottom: 0; line-height: 1.4;">
        Explain your answer, using Sources B and C and your own knowledge of the historical context.
      </p>
    `;
  } else if (qId.endsWith('_q3b')) {
    instructionHTML = `
      <p class="exam-question-instructions" style="font-style: italic; font-size: 0.88rem; color: var(--text-muted); margin-top: 6px; margin-bottom: 0; line-height: 1.4;">
        Explain your answer, using details from both interpretations.
      </p>
    `;
  } else if (qId.endsWith('_q3c')) {
    instructionHTML = `
      <p class="exam-question-instructions" style="font-style: italic; font-size: 0.88rem; color: var(--text-muted); margin-top: 6px; margin-bottom: 0; line-height: 1.4;">
        Explain your answer, using both interpretations and written sources.
      </p>
    `;
  } else if (qId.endsWith('_q3d')) {
    instructionHTML = `
      <p class="exam-question-instructions" style="font-style: italic; font-size: 0.88rem; color: var(--text-muted); margin-top: 6px; margin-bottom: 0; line-height: 1.4;">
        Explain your answer, using both interpretations and your own knowledge of the historical context.
      </p>
    `;
  }

  // Determine if this is a Q3b, c, or d question to render the scaffold button and panel
  let scaffoldBtn = '';
  let scaffoldBoxHTML = '';
  
  if (qId.endsWith('_q3b') || qId.endsWith('_q3c') || qId.endsWith('_q3d')) {
    scaffoldBtn = `
      <button class="btn-secondary btn-blue-variant" id="past-btn-scaffold-${qId}" style="flex: 1; min-width: 130px;">
        <i class="fa-solid fa-pen-fancy"></i> Writing Scaffold
      </button>
    `;

    let formula = '';
    let starters = [];
    if (qId.endsWith('_q3b')) {
      formula = "<strong>Q3b Main Difference (4 Marks) Formula:</strong><br>1. State the main difference in their overall view.<br>2. Quote/detail from Interpretation 1.<br>3. Quote/detail from Interpretation 2.";
      starters = [
        "The main difference is that Interpretation 1 argues that...",
        "This is shown when Interpretation 1 states...",
        "In contrast, Interpretation 2 suggests that...",
        "This is shown when Interpretation 2 states..."
      ];
    } else if (qId.endsWith('_q3c')) {
      formula = "<strong>Q3c Reason for Difference (4 Marks) Formula (Crucial for Full Marks):</strong><br>1. State that the interpretations differ because they used different sources (Interpretation 1 uses Source B, whereas Interpretation 2 uses Source C).<br>2. Quote Interpretation 1 AND Source B to show how they support each other.<br>3. Quote Interpretation 2 AND Source C to show how they support each other.<br><em>*Note: You MUST quote both interpretations and both sources to get full marks!</em>";
      starters = [
        "The interpretations differ because the historians have used different sources: Interpretation 1 has used Source B, whereas Interpretation 2 has used Source C.",
        "Interpretation 1 argues that '[quote Interpretation 1]', which is supported by Source B stating '[quote Source B]'.",
        "In contrast, Interpretation 2 argues that '[quote Interpretation 2]', which is supported by Source C stating '[quote Source C]'."
      ];
    } else if (qId.endsWith('_q3d')) {
      formula = "<strong>Q3d Evaluation Essay (16+4 Marks) Formula:</strong><br>1. Support Interpretation 2 using your own knowledge (PEEL paragraph).<br>2. Support Interpretation 1 using your own knowledge (PEEL paragraph).<br>3. Conclude with a clear judgment explaining which interpretation is more convincing.";
      starters = [
        "I agree with Interpretation 2 to a large extent because...",
        "My own knowledge confirms that...",
        "This supports Interpretation 2's view that...",
        "However, Interpretation 1 is also valid in highlighting that...",
        "For example, I know that...",
        "Overall, I find Interpretation 2 more convincing because..."
      ];
    }

    scaffoldBoxHTML = `
      <div class="past-scaffold-box" id="past-scaffold-box-${qId}" style="display: none; margin-top: 15px; padding: 15px; background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: var(--border-radius-sm);">
        <p style="font-size: 0.88rem; color: var(--text-main); margin-top: 0; margin-bottom: 12px; line-height: 1.45;">${formula}</p>
        <div style="font-size: 0.85rem; font-weight: bold; margin-bottom: 8px; color: var(--primary);">Click to insert sentence starters:</div>
        <div class="scaffold-starters" style="display: flex; flex-direction: column; gap: 8px;">
          ${starters.map(starter => `
            <button class="scaffold-starter-btn" data-starter="${starter}">
              <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> ${starter}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  const isQ3b = qId.endsWith('_q3b');
  const isQ3c = qId.endsWith('_q3c');
  const isQ3d = qId.endsWith('_q3d');
  const isQ2 = qId.includes('_q2') || qId.includes('q2_');
  let legendHTML = '';
  if (isQ3b) {
    legendHTML = `
      <div class="model-answer-key">
        <span class="model-key-title">Key:</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #3b82f6;"></span> Interpretation Quotes</span>
      </div>
    `;
  } else if (isQ3c) {
    legendHTML = `
      <div class="model-answer-key">
        <span class="model-key-title">Key:</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #f97316;"></span> Source Quotes</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #3b82f6;"></span> Interpretation Quotes</span>
      </div>
    `;
  } else if (isQ3d) {
    legendHTML = `
      <div class="model-answer-key">
        <span class="model-key-title">Key:</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #3b82f6;"></span> Interpretation Quotes</span>
        <span class="model-key-item"><span class="model-key-dot" style="border-bottom: 2px dotted #10b981; border-radius: 0; width: 12px; height: 4px; margin-top: -4px; background: transparent;"></span> Contextual Knowledge</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #a855f7;"></span> Judgment</span>
      </div>
    `;
  } else if (isQ2) {
    legendHTML = `
      <div class="model-answer-key">
        <span class="model-key-title">Key:</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #f97316;"></span> Point</span>
        <span class="model-key-item"><span class="model-key-dot" style="border-bottom: 2px dotted #10b981; border-radius: 0; width: 12px; height: 4px; margin-top: -4px; background: transparent;"></span> Own Knowledge</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #a855f7;"></span> Therefore Link Back</span>
      </div>
    `;
  } else {
    // Q3a (Source Utility)
    legendHTML = `
      <div class="model-answer-key">
        <span class="model-key-title">Key:</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #f97316;"></span> Source Quotes</span>
        <span class="model-key-item"><span class="model-key-dot" style="border-bottom: 2px dotted #10b981; border-radius: 0; width: 12px; height: 4px; margin-top: -4px; background: transparent;"></span> Contextual Knowledge</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #a855f7;"></span> Provenance</span>
      </div>
    `;
  }

  return `
    <div class="exam-question-block" id="exam-q-block-${qId}">
      <div class="exam-question-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
        <div style="flex: 1;">
          <h5 class="exam-question-title" style="margin: 0; font-size: 1.05rem; line-height: 1.4;">${cleanQuestionText}</h5>
          ${instructionHTML}
        </div>
        <span class="exam-question-marks" style="flex-shrink: 0; background: var(--primary-glow); color: var(--primary); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">${marks} Marks</span>
      </div>
      ${stimulusHTML}
      <textarea class="exam-textarea" id="past-textarea-${qId}" placeholder="Draft your answer here..." style="min-height: 120px;"></textarea>
      
      <!-- Live feedback card -->
      <div class="draft-feedback-card" id="draft-feedback-${qId}">
        <div class="feedback-stats">
          <div class="feedback-badge" id="feedback-badge-${qId}">Structure: Drafting</div>
          <div class="feedback-progress-bar">
            <div class="feedback-progress-fill" id="feedback-fill-${qId}" style="width: 0%;"></div>
          </div>
        </div>
        <div class="feedback-checklist">
          <div class="feedback-item">
            <strong>Connectives checklist:</strong>
            <div class="feedback-tags" id="connective-tags-${qId}"></div>
          </div>
          <div class="feedback-item" id="keyword-feedback-row-${qId}">
            <strong>${isQ2 ? 'Historical Knowledge Words' : 'Key Terms'}:</strong>
            <div class="feedback-tags" id="keyword-tags-${qId}"></div>
          </div>
        </div>
      </div>

      <div class="exam-sheet-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn-secondary" id="past-btn-clue-${qId}" style="flex: 1; min-width: 130px; font-size: 0.85rem; padding: 8px 12px;">
          <i class="fa-solid fa-lightbulb"></i> Educator Clue
        </button>
        ${scaffoldBtn}
        <button class="btn-primary" id="past-btn-check-${qId}" style="flex: 2; min-width: 180px; font-size: 0.85rem; padding: 8px 12px;">
          <i class="fa-solid fa-clipboard-check"></i> Self-Check Answer
        </button>
      </div>

      <div class="past-clue-box" id="past-clue-box-${qId}" style="display: none;">
        <strong>Clue:</strong> ${clue}
      </div>

      ${scaffoldBoxHTML}

      <div class="past-model-answer" id="past-answer-box-${qId}" style="display: none;">
        <div class="past-model-answer-title"><i class="fa-solid fa-star"></i> Level 3/4 Model Answer</div>
        <div class="past-model-answer-content" style="white-space: pre-line;">${highlightModelQuotes(modelAnswer)}</div>
        ${legendHTML}
      </div>

      <label class="completion-check-row">
        <input type="checkbox" id="past-chk-${qId}">
        Mark this question as complete
      </label>
    </div>
  `;
}

export function renderExamSheetStats() {
  const session = state.pastPaperSession;
  const paper = session.activePaperData;
  if (!paper) return;

  const questionsList = [
    paper.id + '_q1',
    paper.id + '_q2',
    paper.id + '_q3a',
    paper.id + '_q3b',
    paper.id + '_q3c',
    paper.id + '_q3d'
  ];

  const completedCount = questionsList.filter(id => session.completedQuestions.includes(id)).length;
  const pct = questionsList.length > 0 ? Math.round((completedCount / questionsList.length) * 100) : 0;

  const metaEl = document.querySelector('.exam-sheet-header .exam-metadata');
  if (metaEl) {
    metaEl.innerHTML = `
      <span><i class="fa-solid fa-calendar"></i> Year: ${paper.year}</span>
      <span><i class="fa-solid fa-clock"></i> Duration: 1h 30m</span>
      <span><i class="fa-solid fa-check-double"></i> Complete: ${completedCount}/${questionsList.length} (${pct}%)</span>
    `;
  }
}

export function renderQuestionContent(qId, marks, questionText, stimulusHtml, modelAnswerText, studentAnswerText, printMode, numLines) {
  let contentHtml = '';
  
  if (printMode === 'model') {
    contentHtml = `
      <div class="answer-text-box">
        <div class="model-answer-title"><i class="fa-solid fa-star"></i> Level 3/4 Model Answer:</div>
        <div>${modelAnswerText}</div>
      </div>
    `;
  } else if (printMode === 'written') {
    contentHtml = `
      <div class="answer-text-box">
        <div style="font-weight: bold; margin-bottom: 6px; color: #1e3a8a;">Student Response:</div>
        <div>${studentAnswerText || '(No response provided)'}</div>
      </div>
    `;
  } else {
    contentHtml = `
      <div style="margin-top: 15px;">
        ${Array(numLines).fill('<div class="dotted-writing-line"></div>').join('')}
      </div>
    `;
  }

  return `
    <div class="edexcel-question-container">
      <div class="edexcel-question-header">
        <span class="edexcel-question-marks">(${marks} marks)</span>
        <span>${questionText}</span>
      </div>
      ${stimulusHtml || ''}
      ${contentHtml}
    </div>
  `;
}

export function generatePastPaperHtml(paper, printMode) {
  const session = state.pastPaperSession;
  const answers = session.answers[paper.id] || {};
  
  const cleanBrackets = (str) => (str || '')
    .replace(/\[\[/g, '')
    .replace(/\]\]/g, '')
    .replace(/\{\{/g, '')
    .replace(/\}\}/g, '')
    .replace(/\[1\[/g, '')
    .replace(/\]1\]/g, '')
    .replace(/\[2\[/g, '')
    .replace(/\]2\]/g, '');

  let q2StimulusHtml = '';
  if (paper.q2.stimulus && paper.q2.stimulus.length > 0) {
    q2StimulusHtml = `
      <div class="edexcel-stimulus-box">
        You may use the following in your answer:
        <ul style="margin: 5px 0 0 0; padding-left: 20px;">
          ${paper.q2.stimulus.map(s => `<li>${s}</li>`).join('')}
        </ul>
        <div style="margin-top: 4px;">You must also use information of your own.</div>
      </div>
    `;
  }

  let q1Content = '';
  if (printMode === 'model') {
    q1Content = `
      <div class="answer-text-box">
        <div class="model-answer-title"><i class="fa-solid fa-star"></i> Level 4 Model Answer:</div>
        <div>${cleanBrackets(paper.q1.model)}</div>
      </div>
    `;
  } else if (printMode === 'written') {
    const studentAns = answers[paper.id + '_q1'] || '';
    q1Content = `
      <div class="answer-text-box">
        <div style="font-weight: bold; margin-bottom: 6px; color: #1e3a8a;">Student Response:</div>
        <div>${cleanBrackets(studentAns) || '(No response provided)'}</div>
      </div>
    `;
  } else {
    q1Content = `
      <div style="margin-top: 15px; line-height: 2.2;">
        <strong>(i) Inference 1</strong>
        <div class="dotted-writing-line"></div>
        <div style="height: 10px;"></div>
        <strong>Details to support Inference 1:</strong>
        <div class="dotted-writing-line"></div>
        <div class="dotted-writing-line"></div>
        <div style="height: 20px;"></div>
        <strong>(ii) Inference 2</strong>
        <div class="dotted-writing-line"></div>
        <div style="height: 10px;"></div>
        <strong>Details to support Inference 2:</strong>
        <div class="dotted-writing-line"></div>
        <div class="dotted-writing-line"></div>
      </div>
    `;
  }

  let html = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${paper.title} - Pearson Edexcel GCSE</title>
  <style>
    @page {
      size: 21cm 29.7cm; /* A4 */
      margin: 1.5cm 2cm 1.5cm 2cm;
      mso-page-orientation: portrait;
    }
    body {
      font-family: Arial, sans-serif;
      font-size: 10pt;
      color: #000000;
      line-height: 1.4;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .print-page {
      page-break-after: always;
      clear: both;
      box-sizing: border-box;
      position: relative;
      background: #ffffff;
    }
    .print-page-last {
      page-break-after: avoid;
      clear: both;
      box-sizing: border-box;
      position: relative;
      background: #ffffff;
    }
    @media screen {
      body {
        background-color: #f3f4f6;
        padding: 20px 0;
      }
      .print-page, .print-page-last {
        width: 21cm;
        min-height: 29.7cm;
        margin: 0 auto 20px auto;
        padding: 1.5cm 2cm;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid #e5e7eb;
        border-radius: 4px;
      }
    }
    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
      }
      .print-page, .print-page-last {
        width: 100% !important;
        min-height: 27.7cm !important;
        padding: 0 !important;
        margin: 0 !important;
      }
    }
    /* Edexcel specific styling */
    .edexcel-header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .edexcel-header-table td {
      border: 1.5px solid #000000;
      padding: 8px 12px;
      font-size: 9pt;
      vertical-align: top;
    }
    .edexcel-candidate-label {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 7.5pt;
      display: block;
      margin-bottom: 4px;
      color: #000000;
    }
    .edexcel-title-block {
      text-align: center;
      margin: 20px 0;
    }
    .edexcel-title-pearson {
      font-size: 13pt;
      font-weight: bold;
      display: block;
      margin-bottom: 4px;
    }
    .edexcel-title-main {
      font-size: 16pt;
      font-weight: 800;
      display: block;
      margin-bottom: 8px;
    }
    .edexcel-paper-details {
      font-size: 11pt;
      font-weight: bold;
      border-top: 2px solid #000000;
      border-bottom: 2px solid #000000;
      padding: 8px 0;
      margin: 12px 0;
      text-align: center;
    }
    .edexcel-meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 10pt;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .edexcel-instruction-box {
      border: 1.8px solid #000000;
      padding: 10px 14px;
      margin-bottom: 12px;
      font-size: 9pt;
    }
    .edexcel-instruction-title {
      font-weight: bold;
      text-transform: uppercase;
      display: block;
      margin-bottom: 4px;
      border-bottom: 1px solid #000000;
      padding-bottom: 2px;
    }
    .edexcel-double-line {
      border-top: 1px solid #000;
      border-bottom: 3px double #000;
      height: 4px;
      margin: 20px 0;
      clear: both;
    }
    .edexcel-section-title {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 12px;
      border-bottom: 2px solid #000000;
      padding-bottom: 3px;
      text-align: left;
    }
    .edexcel-question-container {
      margin-bottom: 20px;
      text-align: left;
    }
    .edexcel-question-header {
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 10px;
      line-height: 1.45;
      text-align: left;
    }
    .edexcel-question-marks {
      font-weight: bold;
      font-size: 10.5pt;
      float: right;
    }
    .edexcel-stimulus-box {
      border: 1px solid #000000;
      padding: 8px 12px;
      margin: 10px 0 15px 0;
      background: #ffffff;
      font-size: 9.5pt;
      text-align: left;
    }
    .dotted-writing-line {
      border-bottom: 1px dashed #6b7280;
      height: 26px;
      width: 100%;
    }
    .source-box {
      border: 1.5px solid #000000;
      padding: 12px;
      margin-bottom: 15px;
      background: #ffffff;
      text-align: left;
    }
    .source-provenance {
      font-weight: bold;
      font-size: 9.5pt;
      margin-bottom: 6px;
      line-height: 1.35;
      color: #000000;
    }
    .source-text {
      font-family: 'Times New Roman', Times, serif;
      font-size: 10.5pt;
      font-style: italic;
      line-height: 1.45;
      color: #000000;
    }
    .answer-text-box {
      border: 1px solid #000000;
      padding: 12px;
      margin-top: 10px;
      background: #f9fafb;
      font-size: 10pt;
      line-height: 1.5;
      white-space: pre-wrap;
      text-align: left;
      color: #000000;
    }
    .model-answer-title {
      font-weight: bold;
      color: #16a34a;
      margin-bottom: 6px;
      font-size: 9.5pt;
    }
    .footer-note {
      position: absolute;
      bottom: 0.5cm;
      left: 0;
      right: 0;
      font-size: 8pt;
      color: #555555;
      text-align: center;
      border-top: 1px solid #cccccc;
      padding-top: 4px;
    }
  </style>
</head>
<body>
  <!-- PAGE 1: COVER PAGE -->
  <div class="print-page">
    <table class="edexcel-header-table">
      <tr>
        <td style="width: 50%;">
          <span class="edexcel-candidate-label">Candidate Name</span>
          <div style="height: 25px;"></div>
        </td>
        <td style="width: 25%;">
          <span class="edexcel-candidate-label">Center Number</span>
          <div style="height: 25px;"></div>
        </td>
        <td style="width: 25%;">
          <span class="edexcel-candidate-label">Candidate Number</span>
          <div style="height: 25px;"></div>
        </td>
      </tr>
    </table>

    <div class="edexcel-title-block">
      <span class="edexcel-title-pearson">Pearson Edexcel GCSE (9-1)</span>
      <div style="height: 2px; background: #000; margin: 8px 0;"></div>
      <span class="edexcel-title-main">History</span>
      <span style="font-size: 11.5pt; font-weight: bold; display: block; margin-top: 4px;">Paper 3: Modern depth study</span>
      <span style="font-size: 10.5pt; display: block; margin-top: 2px;">Option 33: The USA, 1954-75: Conflict at Home and Abroad</span>
    </div>

    <div class="edexcel-paper-details">
      Paper Reference: 1HI0/33
    </div>

    <div class="edexcel-meta-row">
      <span>Time: 1 hour 30 minutes</span>
      <span>Total Marks: 52</span>
    </div>

    <div class="edexcel-instruction-box">
      <span class="edexcel-instruction-title">Instructions</span>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Use black ink or ball-point pen.</li>
        <li>Fill in the boxes at the top of this page with your name, centre number and candidate number.</li>
        <li>Answer all questions.</li>
        <li>Answer the questions in the spaces provided - there may be more space than you need.</li>
      </ul>
    </div>

    <div class="edexcel-instruction-box">
      <span class="edexcel-instruction-title">Information</span>
      <ul style="margin: 0; padding-left: 20px;">
        <li>The total mark for this paper is 52.</li>
        <li>The marks for each question are shown in brackets - use this as a guide as to how much time to spend on each question.</li>
        <li>The marks for spelling, punctuation and grammar (SPaG) are included in the mark for Question 3d.</li>
      </ul>
    </div>

    <div class="edexcel-instruction-box">
      <span class="edexcel-instruction-title">Advice</span>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Read each question carefully before you start to answer it.</li>
        <li>Try to answer every question.</li>
        <li>Check your answers if you have time at the end.</li>
      </ul>
    </div>

    <div class="edexcel-double-line"></div>
    <div class="footer-note">Pearson Edexcel GCSE History &bull; Paper 3: USA, 1954-75 &bull; Page 1</div>
  </div>

  <!-- PAGE 2: Q1 SOURCE INFERENCE -->
  <div class="print-page">
    <div class="edexcel-section-title">Section A</div>
    
    <div class="edexcel-question-container">
      <div class="edexcel-question-header">
        <span class="edexcel-question-marks">(4 marks)</span>
        <span>1. Give two inferences you can make from Source A.</span>
      </div>
      
      ${paper.sourceA ? `
        <div class="source-box">
          <strong>Source A</strong>
          <div class="source-provenance">${paper.sourceA.provenance}</div>
          <div class="source-text">"${paper.sourceA.content}"</div>
        </div>
      ` : ''}

      ${q1Content}
    </div>

    <div class="footer-note">Pearson Edexcel GCSE History &bull; Paper 3: USA, 1954-75 &bull; Page 2</div>
  </div>

  <!-- PAGE 3: Q2 CAUSATION ESSAY -->
  <div class="print-page">
    <div class="edexcel-section-title">Section B</div>
    
    ${renderQuestionContent(
      paper.id + '_q2',
      12,
      `2. ${paper.q2.question.replace(/\(\d+\s*marks?\)/gi, '').trim()}`,
      q2StimulusHtml,
      cleanBrackets(paper.q2.model),
      cleanBrackets(answers[paper.id + '_q2'] || ''),
      printMode,
      20
    )}

    <div class="footer-note">Pearson Edexcel GCSE History &bull; Paper 3: USA, 1954-75 &bull; Page 3</div>
  </div>

  <!-- PAGE 4: SOURCES BOOKLET (SECTION C) -->
  <div class="print-page">
    <div class="edexcel-section-title">Section C: Sources Booklet</div>
    <p style="font-style: italic; margin-bottom: 20px;">Sources B and C for use with Section C.</p>

    ${paper.sourceB ? `
      <div class="source-box" style="margin-bottom: 25px;">
        <strong>Source B</strong>
        <div class="source-provenance">${paper.sourceB.provenance}</div>
        <div class="source-text">"${paper.sourceB.content}"</div>
      </div>
    ` : ''}

    ${paper.sourceC ? `
      <div class="source-box">
        <strong>Source C</strong>
        <div class="source-provenance">${paper.sourceC.provenance}</div>
        <div class="source-text">"${paper.sourceC.content}"</div>
      </div>
    ` : ''}

    <div class="footer-note">Pearson Edexcel GCSE History &bull; Paper 3: USA, 1954-75 &bull; Page 4</div>
  </div>

  <!-- PAGE 5: INTERPRETATIONS BOOKLET (SECTION C) -->
  <div class="print-page">
    <div class="edexcel-section-title">Section C: Interpretations Booklet</div>
    <p style="font-style: italic; margin-bottom: 20px;">Interpretations 1 and 2 for use with Question 3.</p>

    ${paper.interpretation1 ? `
      <div class="source-box" style="margin-bottom: 25px;">
        <strong>Interpretation 1</strong>
        <div class="source-provenance">From ${paper.interpretation1.author}</div>
        <div class="source-text">"${paper.interpretation1.content}"</div>
      </div>
    ` : ''}

    ${paper.interpretation2 ? `
      <div class="source-box">
        <strong>Interpretation 2</strong>
        <div class="source-provenance">From ${paper.interpretation2.author}</div>
        <div class="source-text">"${paper.interpretation2.content}"</div>
      </div>
    ` : ''}

    <div class="footer-note">Pearson Edexcel GCSE History &bull; Paper 3: USA, 1954-75 &bull; Page 5</div>
  </div>

  <!-- PAGE 6: QUESTION 3A -->
  <div class="print-page">
    <div class="edexcel-section-title">Section C: Question 3</div>
    
    ${renderQuestionContent(
      paper.id + '_q3a',
      8,
      `3a. ${paper.q3a.question.replace(/\(\d+\s*marks?\)/gi, '').trim()}`,
      `<p style="font-style: italic; font-size: 9.5pt; color: #4b5563; margin-top: 6px; margin-bottom: 10px;">
         Explain your answer, using Sources B and C and your own knowledge of the historical context.
       </p>`,
      cleanBrackets(paper.q3a.model),
      cleanBrackets(answers[paper.id + '_q3a'] || ''),
      printMode,
      16
    )}

    <div class="footer-note">Pearson Edexcel GCSE History &bull; Paper 3: USA, 1954-75 &bull; Page 6</div>
  </div>

  <!-- PAGE 7: QUESTION 3B -->
  <div class="print-page">
    ${renderQuestionContent(
      paper.id + '_q3b',
      4,
      `3b. ${paper.q3b.question.replace(/\(\d+\s*marks?\)/gi, '').trim()}`,
      `<p style="font-style: italic; font-size: 9.5pt; color: #4b5563; margin-top: 6px; margin-bottom: 10px;">
         Explain your answer, using details from both interpretations.
       </p>`,
      cleanBrackets(paper.q3b.model),
      cleanBrackets(answers[paper.id + '_q3b'] || ''),
      printMode,
      10
    )}

    <div class="footer-note">Pearson Edexcel GCSE History &bull; Paper 3: USA, 1954-75 &bull; Page 7</div>
  </div>

  <!-- PAGE 8: QUESTION 3C -->
  <div class="print-page">
    ${renderQuestionContent(
      paper.id + '_q3c',
      4,
      `3c. ${paper.q3c.question.replace(/\(\d+\s*marks?\)/gi, '').trim()}`,
      `<p style="font-style: italic; font-size: 9.5pt; color: #4b5563; margin-top: 6px; margin-bottom: 10px;">
         Explain your answer, using both interpretations and written sources.
       </p>`,
      cleanBrackets(paper.q3c.model),
      cleanBrackets(answers[paper.id + '_q3c'] || ''),
      printMode,
      10
    )}

    <div class="footer-note">Pearson Edexcel GCSE History &bull; Paper 3: USA, 1954-75 &bull; Page 8</div>
  </div>

  <!-- PAGE 9: QUESTION 3D -->
  <div class="print-page-last">
    ${renderQuestionContent(
      paper.id + '_q3d',
      20,
      `3d. ${paper.q3d.question.replace(/\(\d+\s*marks?\)/gi, '').trim()}`,
      `<p style="font-style: italic; font-size: 9.5pt; color: #4b5563; margin-top: 6px; margin-bottom: 10px;">
         Explain your answer, using both interpretations and your own knowledge of the historical context. (16 marks for response + 4 marks for SPaG)
       </p>`,
      cleanBrackets(paper.q3d.model),
      cleanBrackets(answers[paper.id + '_q3d'] || ''),
      printMode,
      25
    )}

    <div class="footer-note">Pearson Edexcel GCSE History &bull; Paper 3: USA, 1954-75 &bull; Page 9</div>
  </div>
</body>
</html>`;

  return html;
}

export function downloadHtmlAsWord(filename, htmlContent) {
  let processedHtml = htmlContent;
  
  // Inject inline page breaks and other word formatting fixes in htmlContent
  processedHtml = processedHtml.replace(/class="print-page"/g, 'class="print-page" style="page-break-after: always; mso-special-character: line-break; clear: both;"');
  processedHtml = processedHtml.replace(/class="print-page-last"/g, 'class="print-page-last" style="page-break-after: avoid; clear: both;"');

  let finalHtml = '';
  const trimmed = processedHtml.trim().toLowerCase();
  
  if (trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html')) {
    finalHtml = '\ufeff' + processedHtml;
  } else {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <title>Export HTML to Word</title>
    <!--[if gte mso 9]>
    <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
      @page {
        size: 21cm 29.7cm; /* A4 */
        margin: 2cm 2cm 2cm 2cm;
        mso-page-orientation: portrait;
      }
      body {
        font-family: 'Arial', sans-serif;
        font-size: 11pt;
        color: #000000;
        line-height: 1.5;
      }
      .print-page {
        page-break-after: always;
        clear: both;
      }
      .edexcel-header-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .edexcel-header-table td {
        border: 1.5px solid #000000;
        padding: 8px 12px;
        font-size: 9pt;
        vertical-align: top;
      }
      .edexcel-candidate-label {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 7.5pt;
        display: block;
        margin-bottom: 4px;
      }
      .edexcel-title-block {
        text-align: center;
        margin: 30px 0 20px 0;
      }
      .edexcel-title-pearson {
        font-size: 14pt;
        font-weight: bold;
        display: block;
        margin-bottom: 4px;
      }
      .edexcel-title-main {
        font-size: 18pt;
        font-weight: 800;
        display: block;
        margin-bottom: 12px;
      }
      .edexcel-paper-details {
        font-size: 11pt;
        font-weight: bold;
        border-top: 2px solid #000000;
        border-bottom: 2px solid #000000;
        padding: 10px 0;
        margin: 15px 0;
        text-align: center;
      }
      .edexcel-meta-row {
        display: flex;
        justify-content: space-between;
        font-size: 10pt;
        font-weight: bold;
        margin-bottom: 25px;
      }
      .edexcel-instruction-box {
        border: 2px solid #000000;
        padding: 15px;
        margin-bottom: 20px;
        font-size: 9.5pt;
        text-align: left;
      }
      .edexcel-instruction-title {
        font-weight: bold;
        text-transform: uppercase;
        display: block;
        margin-bottom: 6px;
        border-bottom: 1px solid #000000;
        padding-bottom: 2px;
      }
      .edexcel-double-line {
        border-top: 1px solid #000;
        border-bottom: 3px double #000;
        height: 4px;
        margin: 30px 0 20px 0;
      }
      .edexcel-section-title {
        font-size: 14pt;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 15px;
      }
      .edexcel-question-container {
        margin-bottom: 30px;
      }
      .edexcel-question-header {
        font-weight: bold;
        font-size: 11.5pt;
        margin-bottom: 12px;
        line-height: 1.4;
      }
      .edexcel-question-marks {
        font-weight: bold;
        font-size: 11pt;
        float: right;
      }
      .edexcel-stimulus-box {
        border: 1px solid #000000;
        padding: 10px 15px;
        margin: 10px 0 20px 0;
        background: #ffffff;
        font-size: 10.5pt;
      }
      .edexcel-stimulus-item {
        font-weight: bold;
        border: 1.5px solid #000000;
        padding: 6px 20px;
        margin: 0 10px;
        display: inline-block;
      }
      .edexcel-writing-line {
        border-bottom: 1px dashed #777777;
        height: 32px;
        width: 100%;
      }
      /* Answers styling */
      .model-answer-section {
        background: #f9fafb;
        border-left: 3px solid #10b981;
        padding: 12px;
        margin-top: 10px;
        font-size: 10pt;
      }
    </style>
  </head>
  <body>
    ${processedHtml}
  </body>
  </html>`;
    finalHtml = '\ufeff' + header;
  }

  const blob = new Blob([finalHtml], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.doc') ? filename : filename + '.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function initBulkWorkbookCreator() {
  const btnPrint = document.getElementById('btn-bulk-workbook-print');
  const btnWord = document.getElementById('btn-bulk-workbook-word');

  if (btnPrint) {
    btnPrint.addEventListener('click', async () => {
      const style = document.getElementById('bulk-workbook-style').value;
      const density = document.getElementById('bulk-workbook-density').value;
      const answers = document.getElementById('bulk-workbook-answers').value;
      
      AudioEngine.play('click');
      
      let html = await window.generateBulkWorkbookHtml(style, density, answers === 'yes');
      
      const bodyStart = html.indexOf('<body>');
      const bodyEnd = html.lastIndexOf('</body>');
      let cleanHtml = html;
      if (bodyStart !== -1 && bodyEnd !== -1) {
        cleanHtml = html.substring(bodyStart + 6, bodyEnd);
      }
      
      const printArea = document.getElementById('print-area');
      if (printArea) {
        printArea.innerHTML = cleanHtml;
        window.print();
      } else {
        alert("Print error: #print-area element not found in DOM.");
      }
    });
  }

  if (btnWord) {
    btnWord.addEventListener('click', async () => {
      const style = document.getElementById('bulk-workbook-style').value;
      const density = document.getElementById('bulk-workbook-density').value;
      const answers = document.getElementById('bulk-workbook-answers').value;
      
      AudioEngine.play('click');
      
      const html = await window.generateBulkWorkbookHtml(style, density, answers === 'yes');
      const styleLabel = style.charAt(0).toUpperCase() + style.slice(1);
      
      downloadHtmlAsWord(`Course_Worksheet_Pack_All_Lessons_${styleLabel}.doc`, html);
      AudioEngine.play('success');
    });
  }
}