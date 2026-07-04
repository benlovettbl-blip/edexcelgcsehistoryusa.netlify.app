import { CHRONOLOGY_EVENTS, addXp } from './views.js';
import { state } from './state.js';
import { AudioEngine } from './audio.js';
import { Confetti } from './confetti.js';
import { switchView } from './navigation.js';

let chronoState = {
  selectedEvents: [],   // 4 selected events sorted chronologically (earliest to latest)
  shuffledEvents: [],   // 4 selected events scrambled
  placedEvents: [null, null, null, null], // 4 slots
  selectedCardId: null, // For mobile tap-to-place
  hasChecked: false,
  score: 0
};

export function initChronologyGame() {
  const container = document.getElementById('chronology-game-play-area');
  if (!container) return;

  const topicSelect = document.getElementById('chrono-game-topic-select');
  const topicId = topicSelect ? topicSelect.value : 'topic_1';
  
  const pool = CHRONOLOGY_EVENTS[topicId] || CHRONOLOGY_EVENTS["topic_1"];

  // Randomly select 4 unique events (Sequence Challenger specifies 4)
  const selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, 4);

  // Sort them chronologically to get the correct sequence
  chronoState.selectedEvents = [...selected].sort((a, b) => a.year - b.year);
  
  // Shuffle events for option cards
  chronoState.shuffledEvents = [...selected].sort(() => 0.5 - Math.random());
  chronoState.placedEvents = [null, null, null, null];
  chronoState.selectedCardId = null;
  chronoState.hasChecked = false;

  renderChronologyGameUI();
}

function renderChronologyGameUI() {
  const container = document.getElementById('chronology-game-play-area');
  if (!container) return;

  // Generate Slots HTML
  let slotsHtml = '';
  chronoState.placedEvents.forEach((placedEvent, idx) => {
    if (idx > 0) {
      slotsHtml += `
        <div class="mindmap-arrow" id="chrono-arrow-${idx}" style="opacity: 0.25; display: flex; align-items: center; justify-content: center;">
          <i class="fa-solid fa-arrow-right horizontal-arrow" style="color: var(--primary); font-size: 1.1rem;"></i>
          <i class="fa-solid fa-arrow-down vertical-arrow" style="color: var(--primary); font-size: 1.1rem; margin: 4px 0;"></i>
        </div>
      `;
    }
    
    if (placedEvent) {
      slotsHtml += `
        <div class="chrono-slot filled" id="chrono-slot-${idx}" data-index="${idx}" dropzone="true">
          <span class="chrono-slot-label">Step ${idx + 1}</span>
          <div class="chrono-card-content" draggable="true" data-qid="${placedEvent.id}">
            <strong>${placedEvent.answer}</strong>
            <p>${placedEvent.question}</p>
          </div>
        </div>
      `;
    } else {
      slotsHtml += `
        <div class="chrono-slot" id="chrono-slot-${idx}" data-index="${idx}" dropzone="true">
          <span class="chrono-slot-label">Step ${idx + 1}</span>
          <div class="chrono-slot-placeholder-text">Drop Event Here</div>
        </div>
      `;
    }
  });

  // Generate Shuffled Option Cards HTML
  let optionsHtml = chronoState.shuffledEvents.map((q) => {
    const isPlaced = chronoState.placedEvents.some(p => p && p.id === q.id);
    const cleanId = `chrono-opt-${q.id}`;
    return `
      <div class="chrono-option-card ${isPlaced ? 'placed' : ''}" id="${cleanId}" data-qid="${q.id}" draggable="true">
        <strong style="color: var(--primary); font-size: 0.88rem; display: block; margin-bottom: 2px; line-height: 1.25;">${q.answer}</strong>
        <p style="font-size: 0.72rem; line-height: 1.35; color: var(--text-muted); margin: 0; font-style: italic;">Clue: ${q.question}</p>
      </div>
    `;
  }).join('');

  const isAllFilled = chronoState.placedEvents.every(p => p !== null);

  container.innerHTML = `
    <div class="causal-connector-container" style="background: var(--bg-card); padding: 24px; border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); box-shadow: var(--shadow-md);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin: 0; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-hourglass-half" style="color: var(--primary);"></i> Sequence Challenger
        </h3>
        <span style="font-weight: 700; font-size: 0.95rem; color: var(--success);" id="chrono-score-display">Score: ${chronoState.score}</span>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 20px 0;">
        GCSE Paper 3 requires clear chronological analysis. Drag and drop the cards below into the correct sequence (earliest to latest), or tap a card and tap a slot to place it.
      </p>

      <!-- Chronology slots panel (Top viewport) -->
      <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Chronology Timeline</div>
      <div class="chrono-slots-container" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
        ${slotsHtml}
      </div>

      <!-- Success panel -->
      <div class="causal-success-panel" id="chrono-success-panel" style="display: none; text-align: center; margin-top: 16px; padding: 20px; background: rgba(16, 185, 129, 0.05); border: 1px solid var(--success); border-radius: var(--border-radius-md);">
        <h4 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--success); margin: 0 0 8px 0; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i class="fa-solid fa-medal"></i> Chronology Mastered!
        </h4>
        <p style="font-size: 0.9rem; line-height: 1.5; color: var(--text-main); margin-bottom: 16px;">
          Outstanding work! You successfully ordered all 4 milestones in their correct chronological sequence.
        </p>
        <div id="chrono-narrative-container" style="margin-bottom: 20px;"></div>
        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 16px; flex-wrap: wrap;">
          <button class="btn-primary" id="btn-chrono-play-again" style="padding: 10px 20px; font-weight: 600; font-size: 0.9rem; border-radius: 4px; cursor: pointer;">
            <i class="fa-solid fa-rotate-right"></i> Play Again (New Events)
          </button>
          <button class="btn-secondary" id="btn-chrono-go-dashboard" style="padding: 10px 20px; font-weight: 600; font-size: 0.9rem; border-radius: 4px; cursor: pointer;">
            <i class="fa-solid fa-house"></i> Return to Dashboard
          </button>
        </div>
      </div>

      <div id="chrono-play-controls-area">
        <!-- Shuffled event cards shelf (Bottom viewport) -->
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Timeline Event Options</div>
        <div class="chrono-options-container" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
          ${optionsHtml}
        </div>

        <!-- Clue Feedback box -->
        <div id="chrono-feedback-message" style="display: none; font-size: 0.82rem; line-height: 1.45; padding: 10px 14px; border-radius: var(--border-radius-sm); margin-top: 16px; font-weight: 600; text-align: center;"></div>

        <!-- Action buttons -->
        <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: center; align-items: center; flex-wrap: wrap;">
          <button class="btn-primary" id="btn-chrono-check" ${isAllFilled ? '' : 'disabled'} style="padding: 10px 20px; font-weight: 600; font-size: 0.9rem; border-radius: 4px; cursor: ${isAllFilled ? 'pointer' : 'not-allowed'}; opacity: ${isAllFilled ? '1' : '0.5'}; display: ${chronoState.hasChecked ? 'none' : 'inline-flex'}; align-items: center; gap: 6px;">
            <i class="fa-solid fa-clipboard-check"></i> Verify Sequence
          </button>
          <button class="btn-secondary" id="btn-chrono-reset" style="padding: 10px 20px; font-weight: 600; font-size: 0.9rem; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-arrow-rotate-left"></i> Clear All
          </button>
        </div>
      </div>
    </div>
  `;

  // Inject styling overrides if not already in style.css
  addGameStylesIfMissing();

  bindSequenceChallengerEvents();
}

function addGameStylesIfMissing() {
  if (document.getElementById('chrono-game-styles')) return;
  const style = document.createElement('style');
  style.id = 'chrono-game-styles';
  style.innerHTML = `
    .chrono-slots-container {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 12px !important;
    }
    .chrono-options-container {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 12px !important;
    }
    @media (max-width: 768px) {
      .chrono-slots-container, .chrono-options-container {
        grid-template-columns: 1fr !important;
      }
    }
    .chrono-slot {
      border: 2px dashed var(--border-glass);
      border-radius: var(--border-radius-sm);
      min-height: 100px;
      padding: 10px;
      background: rgba(255,255,255,0.01);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.2s;
    }
    .chrono-slot.filled {
      border-style: solid;
      background: rgba(255,255,255,0.03);
      cursor: pointer;
    }
    .chrono-slot-label {
      position: absolute;
      top: 4px;
      left: 6px;
      font-size: 0.6rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
    }
    .chrono-slot-placeholder-text {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .chrono-card-content strong {
      font-size: 0.82rem;
      color: var(--primary);
      display: block;
      margin-bottom: 2px;
      text-align: center;
    }
    .chrono-card-content p {
      font-size: 0.68rem;
      margin: 0;
      color: var(--text-muted);
      text-align: center;
      line-height: 1.3;
    }
    .chrono-option-card {
      border: 1px solid var(--border-glass);
      border-radius: var(--border-radius-sm);
      padding: 12px;
      background: var(--bg-card);
      cursor: grab;
      transition: all 0.2s;
    }
    .chrono-option-card:hover {
      border-color: var(--border-active);
      transform: translateY(-2px);
    }
    .chrono-option-card.placed {
      opacity: 0.3;
      pointer-events: none;
    }
    .chrono-option-card.selected-tap {
      border-color: var(--primary) !important;
      background: rgba(56, 189, 248, 0.08) !important;
    }
    .chrono-slot.correct {
      border-color: var(--success) !important;
      background: rgba(16, 185, 129, 0.05) !important;
    }
    .chrono-slot.incorrect {
      border-color: var(--accent) !important;
      background: rgba(244, 63, 94, 0.05) !important;
      animation: shake 0.4s ease-in-out;
    }
    .chrono-slot-year-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 800;
      color: #fff;
      background: var(--success);
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
      text-align: center;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);
}

function bindSequenceChallengerEvents() {
  const container = document.getElementById('game-chronology-container');
  if (!container) return;

  // Drag & Drop events
  const optionCards = container.querySelectorAll('.chrono-option-card:not(.placed)');
  const slots = container.querySelectorAll('.chrono-slot');

  optionCards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      if (chronoState.hasChecked) return;
      e.dataTransfer.setData('text/plain', card.getAttribute('data-qid'));
      card.style.opacity = '0.5';
    });
    
    card.addEventListener('dragend', () => {
      card.style.opacity = '';
    });

    // Tap-to-select fallback (mobile friendly)
    card.addEventListener('click', (e) => {
      if (chronoState.hasChecked) return;
      AudioEngine.play('click');
      const qid = card.getAttribute('data-qid');
      
      if (chronoState.selectedCardId === qid) {
        chronoState.selectedCardId = null;
        card.classList.remove('selected-tap');
      } else {
        container.querySelectorAll('.chrono-option-card').forEach(c => c.classList.remove('selected-tap'));
        chronoState.selectedCardId = qid;
        card.classList.add('selected-tap');
      }
    });
  });

  slots.forEach(slot => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (chronoState.hasChecked) return;
      slot.style.background = 'rgba(56, 189, 248, 0.05)';
    });

    slot.addEventListener('dragleave', () => {
      slot.style.background = '';
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.style.background = '';
      if (chronoState.hasChecked) return;

      const qid = e.dataTransfer.getData('text/plain');
      const eventObj = chronoState.shuffledEvents.find(ev => ev.id === qid);
      if (!eventObj) return;

      const slotIdx = parseInt(slot.getAttribute('data-index'));
      AudioEngine.play('click');

      const existingIdx = chronoState.placedEvents.findIndex(p => p && p.id === qid);
      if (existingIdx > -1) {
        chronoState.placedEvents[existingIdx] = null;
      }

      chronoState.placedEvents[slotIdx] = eventObj;
      renderChronologyGameUI();
    });

    slot.addEventListener('click', () => {
      if (chronoState.hasChecked) return;
      const slotIdx = parseInt(slot.getAttribute('data-index'));

      if (chronoState.selectedCardId) {
        const qid = chronoState.selectedCardId;
        const eventObj = chronoState.shuffledEvents.find(ev => ev.id === qid);
        if (!eventObj) return;

        AudioEngine.play('click');
        
        const existingIdx = chronoState.placedEvents.findIndex(p => p && p.id === qid);
        if (existingIdx > -1) {
          chronoState.placedEvents[existingIdx] = null;
        }

        chronoState.placedEvents[slotIdx] = eventObj;
        chronoState.selectedCardId = null;
        renderChronologyGameUI();
      } else if (chronoState.placedEvents[slotIdx]) {
        AudioEngine.play('click');
        chronoState.placedEvents[slotIdx] = null;
        renderChronologyGameUI();
      }
    });
  });

  // Check button
  const checkBtn = document.getElementById('btn-chrono-check');
  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      verifyChronologySequence();
    });
  }

  // Reset button
  const resetBtn = document.getElementById('btn-chrono-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      AudioEngine.play('click');
      chronoState.placedEvents = [null, null, null, null];
      chronoState.selectedCardId = null;
      chronoState.hasChecked = false;
      renderChronologyGameUI();
    });
  }

  // Success panel Play Again button
  const playAgainBtn = document.getElementById('btn-chrono-play-again');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      AudioEngine.play('click');
      initChronologyGame();
    });
  }

  const goDashboardBtn = document.getElementById('btn-chrono-go-dashboard');
  if (goDashboardBtn) {
    goDashboardBtn.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('dashboard');
    });
  }
}

function verifyChronologySequence() {
  const container = document.getElementById('chronology-game-play-area');
  if (!container) return;

  chronoState.hasChecked = true;
  let allCorrect = true;

  chronoState.placedEvents.forEach((event, idx) => {
    const expectedEvent = chronoState.selectedEvents[idx];
    const slot = document.getElementById(`chrono-slot-${idx}`);
    if (!slot) return;

    if (event && event.id === expectedEvent.id) {
      slot.classList.remove('incorrect');
      slot.classList.add('correct');
    } else {
      slot.classList.remove('correct');
      slot.classList.add('incorrect');
      allCorrect = false;
    }
  });

  const feedbackMsg = document.getElementById('chrono-feedback-message');

  if (allCorrect) {
    AudioEngine.play('cheer');
    if (typeof Confetti !== 'undefined' && typeof Confetti.spawn === 'function') {
      Confetti.spawn(100);
    }
    
    chronoState.score += 20;
    addXp(15);
    const scoreDisplay = document.getElementById('chrono-score-display');
    if (scoreDisplay) scoreDisplay.textContent = `Score: ${chronoState.score}`;

    // Reveal years in slots
    chronoState.placedEvents.forEach((event, idx) => {
      const slot = document.getElementById(`chrono-slot-${idx}`);
      if (slot) {
        const content = slot.querySelector('.chrono-card-content');
        if (content) {
          content.innerHTML = `
            <div class="chrono-slot-year-badge">${event.year}</div>
            <strong>${event.answer}</strong>
            <p>${event.question}</p>
          `;
        }
      }
    });

    if (feedbackMsg) feedbackMsg.style.display = 'none';

    // Generate and show narrative
    const narrativeContainer = document.getElementById('chrono-narrative-container');
    if (narrativeContainer) {
      narrativeContainer.innerHTML = generateChronoNarrativeParagraph(chronoState.placedEvents);
    }

    const successPanel = document.getElementById('chrono-success-panel');
    if (successPanel) {
      successPanel.style.display = 'block';
    }
    
    const controlsArea = document.getElementById('chrono-play-controls-area');
    if (controlsArea) {
      controlsArea.style.display = 'none';
    }
  } else {
    AudioEngine.play('fail');
    addXp(3);
    if (feedbackMsg) {
      feedbackMsg.style.color = 'var(--accent)';
      feedbackMsg.style.background = 'rgba(244, 63, 94, 0.08)';
      feedbackMsg.innerHTML = getChronologyClue();
      feedbackMsg.style.display = 'block';
    }
    
    setTimeout(() => {
      chronoState.placedEvents.forEach((event, idx) => {
        const expectedEvent = chronoState.selectedEvents[idx];
        if (!event || event.id !== expectedEvent.id) {
          chronoState.placedEvents[idx] = null;
        }
      });
      chronoState.hasChecked = false;
      renderChronologyGameUI();
    }, 1500);
  }
}

function getChronologyClue() {
  const incorrectIndices = [];
  chronoState.placedEvents.forEach((event, idx) => {
    const expectedEvent = chronoState.selectedEvents[idx];
    if (!event || event.id !== expectedEvent.id) {
      incorrectIndices.push(idx);
    }
  });

  if (incorrectIndices.length === 0) return "";

  const firstWrongIdx = incorrectIndices[0];
  const expectedEvent = chronoState.selectedEvents[firstWrongIdx];
  return `<i class="fa-solid fa-lightbulb"></i> Clue: Consider the timing of <strong>${expectedEvent.answer}</strong>. It occurred earlier in the sequence!`;
}

function generateChronoNarrativeParagraph(events) {
  const parts = events.map((e, idx) => {
    const qText = e.question.trim();
    const ansText = e.answer.trim();
    
    if (idx === 0) {
      return `In <strong>${e.year}</strong>, the <strong>${ansText}</strong> occurred (${qText})`;
    } else if (idx === 1) {
      return `this was followed in <strong>${e.year}</strong> by the <strong>${ansText}</strong> (${qText})`;
    } else if (idx === 2) {
      return `subsequently, in <strong>${e.year}</strong>, the <strong>${ansText}</strong> took place (${qText})`;
    } else {
      return `and finally, in <strong>${e.year}</strong>, this story culminated in the <strong>${ansText}</strong> (${qText})`;
    }
  });

  let narrative = parts.join("; ");
  narrative = narrative.charAt(0).toUpperCase() + narrative.slice(1);
  if (!narrative.endsWith('.')) {
    narrative += '.';
  }

  return `
    <div style="text-align: left; background: rgba(16, 185, 129, 0.05); border-left: 4px solid var(--success); padding: 14px 18px; border-radius: var(--border-radius-sm); margin-top: 16px;">
      <strong style="color: var(--success); display: block; margin-bottom: 6px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
        <i class="fa-solid fa-book-open"></i> Historical Narrative:
      </strong>
      <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-main); margin: 0; font-style: italic;">
        ${narrative}
      </p>
    </div>
  `;
}
