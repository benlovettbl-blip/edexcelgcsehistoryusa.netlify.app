import { state } from './state.js';
import { QUIZ_DATA, EXAM_SKILLS_DATA } from '../questions.js';
import { AudioEngine } from './audio.js';
import { switchView } from './navigation.js';
import { setMastered, toggleBookmark } from './storage.js';
import { Confetti } from './confetti.js';
import { LESSONS_DATA } from './lessons_data.js';
import { MASTERY_DATA } from './mastery_data.js';
import { DECISIONS_DATA } from './decisions_data.js';
import { MINDMAP_DATA } from './mindmap_data.js';
import { getImageWebLink } from './image_links.js';
import { TABOO_CARDS } from './taboo_data.js';
import { KEY_TOPICS_OVERVIEWS } from './key_topics_data.js';

// --- Google Sheets Leaderboard Configuration ---
// If empty, the leaderboard will automatically fall back to browser localStorage.
// To share scores class-wide, paste your deployed Google Apps Script Web App URL below:
export const GOOGLE_SHEET_WEBAPP_URL = "";

// --- Dynamic Renders ---

// 1. Sidebar sub-topic items
function renderSidebarNav() {
  const container = document.getElementById('topics-nav-list');
  container.innerHTML = '';
  
  QUIZ_DATA.forEach(topic => {
    const section = document.createElement('div');
    section.style.marginBottom = '6px';
    
    const header = document.createElement('div');
    header.className = 'nav-section-header';
    header.setAttribute('data-topic-id', topic.id);
    header.style.padding = '8px 10px';
    header.style.margin = '4px 0';
    header.style.display = 'flex';
    header.style.flexDirection = 'column';
    header.style.gap = '2px';
    header.style.cursor = 'pointer';
    header.style.borderRadius = 'var(--border-radius-md)';
    header.style.transition = 'all var(--transition-fast)';
    
    if (state.selectedKeyTopicId === topic.id) {
      header.classList.add('active');
    }
    
    const numSpan = document.createElement('span');
    numSpan.className = 'nav-section-num';
    numSpan.style.fontFamily = 'var(--font-heading)';
    numSpan.style.fontSize = '0.62rem';
    numSpan.style.fontWeight = '700';
    numSpan.style.textTransform = 'uppercase';
    numSpan.style.color = 'var(--primary)';
    numSpan.style.letterSpacing = '0.5px';
    numSpan.textContent = topic.title.split(':')[0] || 'Key Topic';
    
    const descSpan = document.createElement('span');
    descSpan.className = 'nav-section-desc';
    descSpan.style.fontSize = '0.72rem';
    descSpan.style.fontWeight = '600';
    descSpan.style.color = 'var(--text-muted)';
    descSpan.style.lineHeight = '1.3';
    descSpan.textContent = topic.title.split(':').slice(1).join(':').trim() || '';
    
    header.appendChild(numSpan);
    header.appendChild(descSpan);
    
    header.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('key-topic', topic.id);
    });
    
    section.appendChild(header);
    
    topic.subtopics.forEach(sub => {
      const a = document.createElement('a');
      a.className = 'nav-item';
      a.id = `nav-subtopic-${sub.id}`;
      a.title = sub.title; // hover tooltip showing full title
      
      const numCode = sub.title.match(/Topic\s(\d\.\d)/);
      const shortName = numCode ? numCode[1] : sub.title;
      const subDescText = sub.title.split(':').slice(1).join(':').trim() || '';
      
      // Calculate individual subtopic progress
      const subQuestions = state.allQuestions.filter(q => q.subtopicId === sub.id);
      const mastered = subQuestions.filter(q => state.mastery[q.id]);
      const pct = subQuestions.length > 0 ? Math.round((mastered.length / subQuestions.length) * 100) : 0;
      
      a.innerHTML = `
        <span class="nav-item-content" style="flex-shrink: 0;">
          ${shortName}
        </span>
        <span class="nav-item-desc" style="flex: 1; min-width: 0; margin: 0 8px; font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; opacity: 0.8;">
          ${subDescText}
        </span>
        <span class="nav-item-progress" id="nav-pct-${sub.id}" style="flex-shrink: 0;">${pct}%</span>
      `;
      
      a.addEventListener('click', () => {
        AudioEngine.play('click');
        switchView('subtopic', sub.id);
      });
      
      section.appendChild(a);
    });
    
    container.appendChild(section);
  });
  
  updateBookmarksUI();
}

function updateBookmarksUI() {
  const badge = document.getElementById('bookmarks-count-badge');
  if (badge) badge.textContent = state.bookmarks.length;
  
  const sideCount = document.getElementById('bookmarks-count-display');
  if (sideCount) sideCount.textContent = `${state.bookmarks.length} card${state.bookmarks.length === 1 ? '' : 's'} bookmarked`;
}

// 2. Global statistics calculation
function updateGlobalStats() {
  const total = state.allQuestions.length;
  const totalMastered = state.allQuestions.filter(q => state.mastery[q.id]).length;
  const overallPct = total > 0 ? Math.round((totalMastered / total) * 100) : 0;
  
  // Standard Recall
  const standardQuestions = state.allQuestions.filter(q => q.type === 'standard');
  const standardMastered = standardQuestions.filter(q => state.mastery[q.id]).length;
  const standardPct = standardQuestions.length > 0 ? Math.round((standardMastered / standardQuestions.length) * 100) : 0;
  
  // Top Tier Trivia
  const depthQuestions = state.allQuestions.filter(q => q.type === 'depth');
  const depthMastered = depthQuestions.filter(q => state.mastery[q.id]).length;
  const depthPct = depthQuestions.length > 0 ? Math.round((depthMastered / depthQuestions.length) * 100) : 0;
  
  // Update DOM values
  document.getElementById('stat-overall-progress').textContent = `${overallPct}%`;
  document.getElementById('stat-overall-progress-bar').style.width = `${overallPct}%`;
  document.getElementById('stat-overall-fraction').textContent = `${totalMastered} / ${total}`;
  
  document.getElementById('stat-standard-progress').textContent = `${standardPct}%`;
  document.getElementById('stat-standard-progress-bar').style.width = `${standardPct}%`;
  document.getElementById('stat-standard-fraction').textContent = `${standardMastered} / ${standardQuestions.length}`;
  
  document.getElementById('stat-depth-progress').textContent = `${depthPct}%`;
  document.getElementById('stat-depth-progress-bar').style.width = `${depthPct}%`;
  document.getElementById('stat-depth-fraction').textContent = `${depthMastered} / ${depthQuestions.length}`;
  
  // Update sidebar subtopic nav percentages
  QUIZ_DATA.forEach(topic => {
    topic.subtopics.forEach(sub => {
      const subQuestions = state.allQuestions.filter(q => q.subtopicId === sub.id);
      const mastered = subQuestions.filter(q => state.mastery[q.id]);
      const pct = subQuestions.length > 0 ? Math.round((mastered.length / subQuestions.length) * 100) : 0;
      
      const badge = document.getElementById(`nav-pct-${sub.id}`);
      if (badge) badge.textContent = `${pct}%`;
    });
  });
}

// 3. Render Dashboard list
function renderDashboard() {
  const container = document.getElementById('dashboard-topics-list');
  container.innerHTML = '';
  
  QUIZ_DATA.forEach(topic => {
    const card = document.createElement('div');
    card.className = 'topic-list-card';
    
    // Topic header progress
    const topicQuestions = state.allQuestions.filter(q => q.topicId === topic.id);
    const mastered = topicQuestions.filter(q => state.mastery[q.id]);
    const pct = topicQuestions.length > 0 ? Math.round((mastered.length / topicQuestions.length) * 100) : 0;
    
    let subtopicsHTML = '';
    topic.subtopics.forEach(sub => {
      const subQs = state.allQuestions.filter(q => q.subtopicId === sub.id);
      const subMastered = subQs.filter(q => state.mastery[q.id]).length;
      const subPct = subQs.length > 0 ? Math.round((subMastered / subQs.length) * 100) : 0;
      
      subtopicsHTML += `
        <div style="margin-top: 10px; padding-left: 12px; border-left: 2px solid var(--border-glass);">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
            <span style="color: var(--text-main); font-weight: 500;">${sub.title.replace(/^Topic \d\.\d:\s*/, "")}</span>
            <span style="color: var(--primary); font-weight: 600;">${subMastered}/${subQs.length} Secured</span>
          </div>
          <div class="topic-list-progress-bar" style="height: 3px;">
            <div class="topic-list-progress-fill" style="width: ${subPct}%;"></div>
          </div>
        </div>
      `;
    });
    
    card.innerHTML = `
      <div class="topic-list-info">
        <span class="topic-list-name" style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700;">${topic.title}</span>
        <span class="nav-item-progress" style="font-size: 0.8rem;">${pct}% Secured</span>
      </div>
      <div class="topic-list-progress-bar">
        <div class="topic-list-progress-fill" style="width: ${pct}%;"></div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${subtopicsHTML}
      </div>
    `;
    
    // Clicking anywhere on topic card takes user to the first subtopic of that topic
    card.addEventListener('click', (e) => {
      // Don't trigger if click was inside interactive elements
      if (e.target.closest('a') || e.target.closest('button')) return;
      AudioEngine.play('click');
      switchView('subtopic', topic.subtopics[0].id);
    });
    
    container.appendChild(card);
  });
}


function highlightCausalConnectives(text) {
  if (!text) return "";
  return text.replace(/\b(As\s+a\s+result|Consequently|This\s+led\s+to|led\s+directly\s+to|leading\s+directly\s+to|One\s+consequence\s+was|Because)\b/gi, '<strong>$1</strong>');
}

function renderGamesView() {
  const causalSelect = document.getElementById('causal-game-topic-select');
  if (!causalSelect) return;

  // 1. Setup Causal Game subtopics list if not already populated
  if (causalSelect.children.length <= 1) {
    let optionsHtml = '<option value="" disabled selected>-- Select a Topic --</option>';
    QUIZ_DATA.forEach(topic => {
      topic.subtopics.forEach(sub => {
        if (LESSONS_DATA[sub.id] && LESSONS_DATA[sub.id].causalLinks) {
          const numCode = sub.title.match(/Topic\s(\d\.\d)/);
          const name = numCode ? `Topic ${numCode[1]}: ${sub.title.replace(/^Topic \d\.\d:\s*/, "")}` : sub.title;
          optionsHtml += `<option value="${sub.id}">${name}</option>`;
        }
      });
    });
    causalSelect.innerHTML = optionsHtml;

    causalSelect.addEventListener('change', (e) => {
      AudioEngine.play('click');
      playCausalGame(e.target.value);
    });
  }

  // 1b. Bind Chronology Game topic select if not already bound
  const chronoSelect = document.getElementById('chrono-game-topic-select');
  if (chronoSelect && !chronoSelect.dataset.bound) {
    chronoSelect.dataset.bound = "true";
    chronoSelect.addEventListener('change', () => {
      AudioEngine.play('click');
      initChronologyGame();
    });
  }

  // 2. Setup game tab switching
  const tabCausal = document.getElementById('btn-tab-game-causal');
  const tabChronology = document.getElementById('btn-tab-game-chronology');
  const tabMastery = document.getElementById('btn-tab-game-mastery');
  const tabDecisions = document.getElementById('btn-tab-game-decisions');
  const tabMindMap = document.getElementById('btn-tab-game-mindmap');
  const tabTaboo = document.getElementById('btn-tab-game-taboo');
  const paneCausal = document.getElementById('game-causal-container');
  const paneChronology = document.getElementById('game-chronology-container');
  const paneMastery = document.getElementById('game-mastery-container');
  const paneDecisions = document.getElementById('game-decisions-container');
  const paneMindMap = document.getElementById('game-mindmap-container');
  const paneTaboo = document.getElementById('game-taboo-container');

  if (tabCausal && tabChronology && tabMastery && tabDecisions && tabMindMap && tabTaboo && 
      paneCausal && paneChronology && paneMastery && paneDecisions && paneMindMap && paneTaboo) {
    const showCausal = () => {
      tabCausal.classList.add('active');
      tabCausal.style.borderColor = 'var(--primary)';
      tabCausal.style.color = 'var(--primary)';
      tabCausal.style.background = 'rgba(59, 130, 246, 0.1)';

      [tabChronology, tabMastery, tabDecisions, tabMindMap, tabTaboo].forEach(t => {
        t.classList.remove('active');
        t.style.borderColor = 'var(--border-glass)';
        t.style.color = 'var(--text-muted)';
        t.style.background = 'rgba(255,255,255,0.03)';
      });

      paneCausal.style.display = 'block';
      paneChronology.style.display = 'none';
      paneMastery.style.display = 'none';
      paneDecisions.style.display = 'none';
      paneMindMap.style.display = 'none';
      paneTaboo.style.display = 'none';
    };

    const showChronology = () => {
      tabChronology.classList.add('active');
      tabChronology.style.borderColor = 'var(--primary)';
      tabChronology.style.color = 'var(--primary)';
      tabChronology.style.background = 'rgba(59, 130, 246, 0.1)';

      [tabCausal, tabMastery, tabDecisions, tabMindMap, tabTaboo].forEach(t => {
        t.classList.remove('active');
        t.style.borderColor = 'var(--border-glass)';
        t.style.color = 'var(--text-muted)';
        t.style.background = 'rgba(255,255,255,0.03)';
      });

      paneCausal.style.display = 'none';
      paneChronology.style.display = 'block';
      paneMastery.style.display = 'none';
      paneDecisions.style.display = 'none';
      paneMindMap.style.display = 'none';
      paneTaboo.style.display = 'none';
      
      initChronologyGame();
    };

    const showMastery = () => {
      tabMastery.classList.add('active');
      tabMastery.style.borderColor = 'var(--primary)';
      tabMastery.style.color = 'var(--primary)';
      tabMastery.style.background = 'rgba(59, 130, 246, 0.1)';

      [tabCausal, tabChronology, tabDecisions, tabMindMap, tabTaboo].forEach(t => {
        t.classList.remove('active');
        t.style.borderColor = 'var(--border-glass)';
        t.style.color = 'var(--text-muted)';
        t.style.background = 'rgba(255,255,255,0.03)';
      });

      paneCausal.style.display = 'none';
      paneChronology.style.display = 'none';
      paneMastery.style.display = 'block';
      paneDecisions.style.display = 'none';
      paneMindMap.style.display = 'none';
      paneTaboo.style.display = 'none';

      initMasteryMatchGame();
    };

    const showDecisions = () => {
      tabDecisions.classList.add('active');
      tabDecisions.style.borderColor = 'var(--primary)';
      tabDecisions.style.color = 'var(--primary)';
      tabDecisions.style.background = 'rgba(59, 130, 246, 0.1)';

      [tabCausal, tabChronology, tabMastery, tabMindMap, tabTaboo].forEach(t => {
        t.classList.remove('active');
        t.style.borderColor = 'var(--border-glass)';
        t.style.color = 'var(--text-muted)';
        t.style.background = 'rgba(255,255,255,0.03)';
      });

      paneCausal.style.display = 'none';
      paneChronology.style.display = 'none';
      paneMastery.style.display = 'none';
      paneDecisions.style.display = 'block';
      paneMindMap.style.display = 'none';
      paneTaboo.style.display = 'none';

      initDecisionsGame();
    };

    const showMindMap = () => {
      tabMindMap.classList.add('active');
      tabMindMap.style.borderColor = 'var(--primary)';
      tabMindMap.style.color = 'var(--primary)';
      tabMindMap.style.background = 'rgba(59, 130, 246, 0.1)';

      [tabCausal, tabChronology, tabMastery, tabDecisions, tabTaboo].forEach(t => {
        t.classList.remove('active');
        t.style.borderColor = 'var(--border-glass)';
        t.style.color = 'var(--text-muted)';
        t.style.background = 'rgba(255,255,255,0.03)';
      });

      paneCausal.style.display = 'none';
      paneChronology.style.display = 'none';
      paneMastery.style.display = 'none';
      paneDecisions.style.display = 'none';
      paneMindMap.style.display = 'block';
      paneTaboo.style.display = 'none';

      initMindMapGame();
    };

    const showTaboo = () => {
      tabTaboo.classList.add('active');
      tabTaboo.style.borderColor = 'var(--primary)';
      tabTaboo.style.color = 'var(--primary)';
      tabTaboo.style.background = 'rgba(59, 130, 246, 0.1)';

      [tabCausal, tabChronology, tabMastery, tabDecisions, tabMindMap].forEach(t => {
        t.classList.remove('active');
        t.style.borderColor = 'var(--border-glass)';
        t.style.color = 'var(--text-muted)';
        t.style.background = 'rgba(255,255,255,0.03)';
      });

      paneCausal.style.display = 'none';
      paneChronology.style.display = 'none';
      paneMastery.style.display = 'none';
      paneDecisions.style.display = 'none';
      paneMindMap.style.display = 'none';
      paneTaboo.style.display = 'block';

      initTabooGame();
    };

    tabCausal.addEventListener('click', () => {
      AudioEngine.play('click');
      showCausal();
    });

    tabChronology.addEventListener('click', () => {
      AudioEngine.play('click');
      showChronology();
    });

    tabMastery.addEventListener('click', () => {
      AudioEngine.play('click');
      showMastery();
    });

    tabDecisions.addEventListener('click', () => {
      AudioEngine.play('click');
      showDecisions();
    });

    tabMindMap.addEventListener('click', () => {
      AudioEngine.play('click');
      showMindMap();
    });

    tabTaboo.addEventListener('click', () => {
      AudioEngine.play('click');
      showTaboo();
    });
  }
}

function playCausalGame(subtopicId) {
  const container = document.getElementById('causal-game-play-area');
  if (!container) return;

  const data = LESSONS_DATA[subtopicId];
  if (!data || !data.causalLinks) return;

  const causalLinks = data.causalLinks;
  const totalFactors = causalLinks.factors.length;
  const linkedFactors = new Set();
  const pooledLinks = causalLinks.factors.map(factor => factor.linkageText);

  let factorsHtml = '';
  causalLinks.factors.forEach((f, idx) => {
    const correctIdx = pooledLinks.indexOf(f.linkageText);
    const optionsMarkup = pooledLinks.map((linkText, lIdx) => {
      return `<option value="${lIdx}">${linkText}</option>`;
    }).join('');

    factorsHtml += `
      <div class="causal-factor-card" id="causal-game-factor-card-${f.id}" style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); margin-bottom: 16px; transition: all 0.3s;">
        <div class="causal-factor-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-weight: 600; font-size: 0.95rem; color: var(--text-main);">Factor ${idx + 1}: ${f.title}</span>
          <span class="causal-status-badge" id="causal-game-status-${f.id}" style="font-size: 0.7rem; font-weight: 700; padding: 4px 8px; border-radius: 4px; background: rgba(239, 68, 68, 0.1); color: #f87171;">UNLINKED</span>
        </div>
        <div class="causal-select-wrapper" id="causal-game-select-wrapper-${f.id}">
          <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 6px;">Select the correct analytical consequence / evidence link:</label>
          <select class="causal-select" id="causal-game-select-${f.id}" data-factor-id="${f.id}" data-correct="${correctIdx}" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); border-radius: 4px; color: var(--text-main); font-size: 0.88rem; outline: none; cursor: pointer;">
            <option value="" disabled selected>-- Match the consequence link --</option>
            ${optionsMarkup}
          </select>
        </div>
        <div class="causal-link-result" id="causal-game-result-${f.id}" style="display: none; margin-top: 10px; padding: 10px; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; border-radius: 0 4px 4px 0; font-size: 0.88rem; color: #a7f3d0; line-height: 1.4;">
          <strong>✓ Consequence Link:</strong> ${f.linkageText}
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="causal-connector-container" style="background: var(--bg-card); padding: 24px; border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); box-shadow: var(--shadow-md);">
      <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-top: 0; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-link" style="color: var(--primary);"></i> Causal Link Builder
      </h3>
      <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 16px 0;">
        Paper 3 causation essays require you to link specific factors to their historical consequences. Select the correct link for each factor.
      </p>
      <div class="causal-question" style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); padding: 16px; border-radius: var(--border-radius-sm); margin-bottom: 20px; font-size: 0.92rem; line-height: 1.5; color: var(--text-main);">
        <strong style="color: var(--primary);">Essay Question:</strong> ${causalLinks.question}
      </div>
      <div class="causal-factors-grid">
        ${factorsHtml}
      </div>
      <div class="causal-success-panel" id="causal-game-success-panel" style="display: none; text-align: center; margin-top: 24px; padding: 24px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--border-radius-md); transition: all 0.3s;">
        <h4 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 700; color: #34d399; margin: 0 0 8px 0; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i class="fa-solid fa-trophy"></i> Causation Mastered!
        </h4>
        <p style="font-size: 0.92rem; line-height: 1.5; color: #a7f3d0; margin: 0;">${causalLinks.successText}</p>
      </div>
    </div>
  `;

  causalLinks.factors.forEach(f => {
    const select = document.getElementById(`causal-game-select-${f.id}`);
    if (select) {
      select.addEventListener('change', (e) => {
        const selectedVal = parseInt(e.target.value);
        const correctVal = parseInt(select.getAttribute('data-correct'));
        const card = document.getElementById(`causal-game-factor-card-${f.id}`);
        const status = document.getElementById(`causal-game-status-${f.id}`);
        const result = document.getElementById(`causal-game-result-${f.id}`);
        const wrapper = document.getElementById(`causal-game-select-wrapper-${f.id}`);

        if (selectedVal === correctVal) {
          AudioEngine.play('success');
          card.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          card.style.background = 'rgba(16, 185, 129, 0.03)';
          status.textContent = "LINKED!";
          status.style.background = 'rgba(16, 185, 129, 0.15)';
          status.style.color = '#34d399';
          wrapper.style.display = 'none';
          result.style.display = 'block';
          linkedFactors.add(f.id);

          if (linkedFactors.size === totalFactors) {
            AudioEngine.play('cheer');
            Confetti.spawn();
            const panel = document.getElementById('causal-game-success-panel');
            if (panel) panel.style.display = 'block';
          }
        } else {
          AudioEngine.play('fail');
          card.style.transform = 'translateX(-6px)';
          setTimeout(() => card.style.transform = 'translateX(6px)', 60);
          setTimeout(() => card.style.transform = 'translateX(-4px)', 120);
          setTimeout(() => card.style.transform = 'translateX(4px)', 180);
          setTimeout(() => card.style.transform = 'translateX(0)', 240);
          select.value = "";
        }
      });
    }
  });
}

const CHRONOLOGY_EVENTS = {
  "topic_1": [
    {
      id: "chrono_t1_1",
      year: 1954,
      answer: "Brown v. Board of Education Ruling",
      question: "The US Supreme Court rules that racial segregation in public schools is unconstitutional, overturning Plessy v. Ferguson."
    },
    {
      id: "chrono_t1_2",
      year: 1955,
      answer: "Murder of Emmett Till",
      question: "A 14-year-old Black youth from Chicago is brutally lynched in Mississippi, galvanizing the civil rights movement after an open-casket funeral."
    },
    {
      id: "chrono_t1_3",
      year: 1955,
      answer: "Arrest of Rosa Parks",
      question: "A civil rights activist refuses to surrender her seat to a white passenger on a Montgomery bus, sparking the bus boycott."
    },
    {
      id: "chrono_t1_4",
      year: 1956,
      answer: "Browder v. Gayle Decision",
      question: "The Supreme Court affirms that segregation on public buses is unconstitutional, ending the Montgomery Bus Boycott."
    },
    {
      id: "chrono_t1_5",
      year: 1957,
      answer: "Establishment of the SCLC",
      question: "Martin Luther King Jr. and other ministers form the Southern Christian Leadership Conference to coordinate non-violent protests."
    },
    {
      id: "chrono_t1_6",
      year: 1957,
      answer: "Little Rock High Desegregation",
      question: "President Eisenhower sends the 101st Airborne Division to protect nine Black students integrating Central High School against state defiance."
    },
    {
      id: "chrono_t1_7",
      year: 1957,
      answer: "Civil Rights Act of 1957",
      question: "The first federal civil rights legislation since Reconstruction is signed by President Eisenhower, focusing on voting rights protections."
    },
    {
      id: "chrono_t1_8",
      year: 1960,
      answer: "Greensboro Lunch Counter Sit-in",
      question: "Four Black college students sit at a segregated lunch counter in North Carolina, launching a wave of non-violent sit-ins across the South."
    },
    {
      id: "chrono_t1_9",
      year: 1960,
      answer: "Founding of the SNCC",
      question: "The Student Nonviolent Coordinating Committee is established to organize student-led protests, including sit-ins and voter drives."
    }
  ],
  "topic_2": [
    {
      id: "chrono_t2_1",
      year: 1961,
      answer: "Launch of the Freedom Rides",
      question: "CORE activists board interstate buses into the deep South to test supreme court rulings outlawing segregation in transit terminals."
    },
    {
      id: "chrono_t2_2",
      year: 1962,
      answer: "Integration of the University of Mississippi",
      question: "James Meredith becomes the first Black student to enroll at 'Ole Miss' under the protection of 30,000 federal troops and marshals after riots."
    },
    {
      id: "chrono_t2_3",
      year: 1963,
      answer: "Birmingham Campaign & Children's Crusade",
      question: "Civil rights campaigners face police dogs and high-pressure fire hoses deployed by Bull Connor during marches in Alabama."
    },
    {
      id: "chrono_t2_4",
      year: 1963,
      answer: "March on Washington",
      question: "Over 250,000 demonstrators gather at the Lincoln Memorial, where Dr. King delivers his famous 'I Have a Dream' speech."
    },
    {
      id: "chrono_t2_5",
      year: 1964,
      answer: "Civil Rights Act of 1964",
      question: "President Johnson signs landmark legislation outlawing discrimination based on race, color, religion, sex, or national origin in public accommodations."
    },
    {
      id: "chrono_t2_6",
      year: 1965,
      answer: "Selma to Montgomery Marches",
      question: "Protesters are violently beaten by state troopers on the Edmund Pettus Bridge on 'Bloody Sunday' during a march for voting rights."
    },
    {
      id: "chrono_t2_7",
      year: 1965,
      answer: "Voting Rights Act of 1965",
      question: "President Johnson signs legislation banning literacy tests and placing Southern voter registration under federal supervision."
    },
    {
      id: "chrono_t2_8",
      year: 1966,
      answer: "Founding of the Black Panther Party",
      question: "Huey P. Newton and Bobby Seale establish a revolutionary socialist organization in Oakland to patrol Black neighborhoods and counter police brutality."
    },
    {
      id: "chrono_t2_9",
      year: 1968,
      answer: "Assassination of Martin Luther King Jr.",
      question: "The preeminent leader of the non-violent civil rights movement is shot dead in Memphis, Tennessee, triggering nationwide urban riots."
    }
  ],
  "topic_3": [
    {
      id: "chrono_t3_1",
      year: 1954,
      answer: "Signing of the Geneva Accords",
      question: "France agrees to withdraw from Indochina, temporarily dividing Vietnam at the 17th parallel pending national elections."
    },
    {
      id: "chrono_t3_2",
      year: 1962,
      answer: "Inception of the Strategic Hamlet Program",
      question: "The US and South Vietnamese governments begin forcibly relocating peasants into fortified villages to isolate them from Vietcong influence."
    },
    {
      id: "chrono_t3_3",
      year: 1963,
      answer: "Overthrow of Ngo Dinh Diem",
      question: "The unpopular South Vietnamese President is deposed and executed in a military coup tacitly approved by the Kennedy administration."
    },
    {
      id: "chrono_t3_4",
      year: 1964,
      answer: "Gulf of Tonkin Incident",
      question: "US Navy destroyers are allegedly attacked by North Vietnamese torpedo boats in international waters, sparking direct US intervention."
    },
    {
      id: "chrono_t3_5",
      year: 1964,
      answer: "Gulf of Tonkin Resolution",
      question: "The US Congress grants President Johnson near-unlimited authority to take all necessary measures to repel armed attacks in Southeast Asia."
    },
    {
      id: "chrono_t3_6",
      year: 1965,
      answer: "Launch of Operation Rolling Thunder",
      question: "The US military begins a sustained, three-year aerial bombardment campaign against North Vietnam and the Ho Chi Minh Trail."
    },
    {
      id: "chrono_t3_7",
      year: 1965,
      answer: "US Combat Troops Land at Da Nang",
      question: "Two battalions of US Marines land in South Vietnam, marking the transition from advisory assistance to direct ground combat operations."
    },
    {
      id: "chrono_t3_8",
      year: 1965,
      answer: "Battle of Ia Drang Valley",
      question: "The first major head-to-head engagement between the regular US Army (1st Cavalry Division) and the North Vietnamese Army."
    },
    {
      id: "chrono_t3_9",
      year: 1968,
      answer: "Launch of the Tet Offensive",
      question: "The Vietcong and North Vietnamese launch a massive coordinated surprise assault on over 100 cities and military targets during the lunar new year."
    },
    {
      id: "chrono_t3_10",
      year: 1968,
      answer: "My Lai Massacre",
      question: "US soldiers of Charlie Company murder hundreds of unarmed South Vietnamese civilians in a small hamlet, which is later exposed to the public."
    }
  ],
  "topic_4": [
    {
      id: "chrono_t4_1",
      year: 1967,
      answer: "Pentagon Anti-War Protest",
      question: "Over 50,000 anti-war demonstrators march on the Pentagon, where activists famously place flowers into the barrels of military police rifles."
    },
    {
      id: "chrono_t4_2",
      year: 1969,
      answer: "Announcement of Vietnamization",
      question: "President Nixon outlines his strategy to gradually withdraw US ground troops while shifting combat responsibilities to South Vietnamese forces."
    },
    {
      id: "chrono_t4_3",
      year: 1969,
      answer: "Nixon's 'Silent Majority' Speech",
      question: "The President appeals directly to patriotic Americans who support the war effort but do not actively protest, calling on them to stand firm."
    },
    {
      id: "chrono_t4_4",
      year: 1969,
      answer: "First Televised Draft Lottery",
      question: "The Selective Service System draws capsules containing birthdays to determine the order of call-up for military service, provoking outrage."
    },
    {
      id: "chrono_t4_5",
      year: 1970,
      answer: "Invasion of Cambodia",
      question: "US and South Vietnamese forces cross the border to destroy Vietcong sanctuaries and supply lines, escalating anti-war protests."
    },
    {
      id: "chrono_t4_6",
      year: 1970,
      answer: "Kent State Shootings",
      question: "Ohio National Guardsmen open fire on students protesting the Cambodian campaign, killing four and wounding nine."
    },
    {
      id: "chrono_t4_7",
      year: 1970,
      answer: "Hard Hat Riots in New York City",
      question: "Hundreds of construction workers attack student anti-war demonstrators and storm City Hall, demanding flags be raised."
    },
    {
      id: "chrono_t4_8",
      year: 1971,
      answer: "Invasion of Laos (Operation Lam Son 719)",
      question: "South Vietnamese forces, backed by US air power, launch an offensive into Laos to disrupt the Ho Chi Minh Trail, resulting in a disastrous retreat."
    },
    {
      id: "chrono_t4_9",
      year: 1973,
      answer: "Signing of the Paris Peace Accords",
      question: "The United States, North Vietnam, South Vietnam, and the Vietcong sign an agreement establishing a ceasefire and US troop withdrawal."
    },
    {
      id: "chrono_t4_10",
      year: 1975,
      answer: "The Fall of Saigon",
      question: "North Vietnamese troops capture the South Vietnamese capital, forcing the final evacuation of US embassy personnel and reunifying Vietnam."
    }
  ],
  "subtopic_1_1": [
    { id: "chrono_s11_1", year: 1942, answer: "Founding of CORE", question: "The Congress of Racial Equality is established in Chicago to advocate non-violent direct action against racial discrimination." },
    { id: "chrono_s11_2", year: 1948, answer: "Executive Order 9981 Signed", question: "President Harry S. Truman signs an executive order desegregating the United States Armed Forces." },
    { id: "chrono_s11_3", year: 1950, answer: "Sweatt v. Painter Ruling", question: "The Supreme Court rules that Texas must admit a Black student to its law school, striking a blow to segregated higher education." },
    { id: "chrono_s11_4", year: 1951, answer: "NAACP School Lawsuits Initiated", question: "The NAACP begins coordinating local legal challenges to segregated public schools, leading up to the Brown v. Board cases." },
    { id: "chrono_s11_5", year: 1955, answer: "Murder of Emmett Till", question: "A 14-year-old Black youth from Chicago is brutally lynched in Mississippi, galvanizing the civil rights movement after an open-casket funeral." }
  ],
  "subtopic_1_2": [
    { id: "chrono_s12_1", year: 1954, answer: "Warren Court Brown Ruling", question: "Chief Justice Earl Warren leads the landmark unanimous school desegregation ruling." },
    { id: "chrono_s12_2", year: 1955, answer: "Brown II Decision", question: "The Supreme Court orders school desegregation to proceed 'with all deliberate speed'." },
    { id: "chrono_s12_3", year: 1956, answer: "Southern Manifesto Signed", question: "101 Southern congressmen pledge to resist school integration by all legal means." },
    { id: "chrono_s12_4", year: 1957, answer: "Governor Faubus Intervenes", question: "Faubus deploys the Arkansas National Guard to block the Little Rock Nine." },
    { id: "chrono_s12_5", year: 1957, answer: "101st Airborne Deployed", question: "President Eisenhower sends elite federal troops to protect the Little Rock Nine." }
  ],
  "subtopic_1_3": [
    { id: "chrono_s13_1", year: 1955, answer: "Arrest of Rosa Parks", question: "Rosa Parks defies bus segregation laws in Montgomery, Alabama." },
    { id: "chrono_s13_2", year: 1955, answer: "MIA Formed", question: "The Montgomery Improvement Association is created and elects Martin Luther King Jr." },
    { id: "chrono_s13_3", year: 1956, answer: "MLK Home Bombed", question: "Dr. King's home is targeted by segregationist bombers during the height of the protest." },
    { id: "chrono_s13_4", year: 1956, answer: "MIA Leaders Arrested", question: "Over 80 boycott organizers are arrested under a 1921 anti-conspiracy law." },
    { id: "chrono_s13_5", year: 1956, answer: "Buses Integrated in Montgomery", question: "Federal integration orders take effect, officially ending the 381-day boycott." }
  ],
  "subtopic_1_4": [
    { id: "chrono_s14_1", year: 1954, answer: "First Citizens' Council Formed", question: "White Citizens' Councils are established in Mississippi to oppose integration." },
    { id: "chrono_s14_2", year: 1956, answer: "Southern Manifesto Published", question: "Dixiecrats issue a manifesto accusing the Supreme Court of abusing judicial power." },
    { id: "chrono_s14_3", year: 1956, answer: "KKK Night Rider Attacks", question: "The Ku Klux Klan bombs houses and churches of civil rights leaders in Alabama." },
    { id: "chrono_s14_4", year: 1957, answer: "Faubus Defies Court Order", question: "The Arkansas Governor actively rebels against federal authority at Central High." },
    { id: "chrono_s14_5", year: 1958, answer: "Little Rock Schools Closed", question: "Governor Faubus shuts down all high schools in the city to prevent integration." }
  ],
  "subtopic_2_1": [
    { id: "chrono_s21_1", year: 1960, answer: "Greensboro Sit-ins Begin", question: "Four Black students sit at a Woolworth's lunch counter, launching mass sit-ins." },
    { id: "chrono_s21_2", year: 1960, answer: "SNCC Established", question: "The Student Nonviolent Coordinating Committee is formed at Shaw University." },
    { id: "chrono_s21_3", year: 1961, answer: "CORE Freedom Rides Launched", question: "Civil rights activists ride interstate buses into the Deep South to test desegregation." },
    { id: "chrono_s21_4", year: 1961, answer: "ICC Segregation Ban", question: "Interstate Commerce Commission outlaws segregation in all interstate transit facilities." },
    { id: "chrono_s21_5", year: 1962, answer: "James Meredith Enrolls", question: "Meredith integrates the University of Mississippi backed by 30,000 federal forces." }
  ],
  "subtopic_2_2": [
    { id: "chrono_s22_1", year: 1963, answer: "Birmingham Children's Crusade", question: "Bull Connor uses police dogs and fire hoses against young demonstrators in Alabama." },
    { id: "chrono_s22_2", year: 1963, answer: "March on Washington", question: "250,000 gather to demand civil rights legislation; MLK delivers famous speech." },
    { id: "chrono_s22_3", year: 1964, answer: "Civil Rights Act Signed", question: "President Lyndon B. Johnson signs the landmark Civil Rights Act of 1964." },
    { id: "chrono_s22_4", year: 1965, answer: "Bloody Sunday in Selma", question: "State troopers brutally beat voting rights marchers on Edmund Pettus Bridge." },
    { id: "chrono_s22_5", year: 1965, answer: "Voting Rights Act Passed", question: "LBJ signs legislation outlawing literacy tests and placing registration under federal oversight." }
  ],
  "subtopic_2_3": [
    { id: "chrono_s23_1", year: 1952, answer: "Malcolm X Released", question: "Malcolm Little is released from prison and becomes a leading Nation of Islam minister." },
    { id: "chrono_s23_2", year: 1964, answer: "OAAU Founded", question: "Malcolm X splits from NOI and establishes the Organization of Afro-American Unity." },
    { id: "chrono_s23_3", year: 1965, answer: "Assassination of Malcolm X", question: "The civil rights leader is shot dead while addressing a rally in Harlem." },
    { id: "chrono_s23_4", year: 1966, answer: "Black Power Slogan Coined", question: "Stokely Carmichael popularizes the slogan 'Black Power' during the Meredith March." },
    { id: "chrono_s23_5", year: 1966, answer: "Black Panthers Founded", question: "Huey Newton and Bobby Seale form the Black Panther Party for Self-Defense." }
  ],
  "subtopic_2_4": [
    { id: "chrono_s24_1", year: 1965, answer: "Watts Riots in Los Angeles", question: "Massive urban riots break out after a controversial traffic arrest of a Black motorist." },
    { id: "chrono_s24_2", year: 1967, answer: "Detroit Riots Erupt", question: "Racial tension and police raids trigger violent unrest requiring federal troops." },
    { id: "chrono_s24_3", year: 1967, answer: "Kerner Commission Appointed", question: "President Johnson establishes a commission to investigate causes of urban riots." },
    { id: "chrono_s24_4", year: 1968, answer: "Kerner Report Published", question: "The report blames white racism for creating 'two societies, separate and unequal'." },
    { id: "chrono_s24_5", year: 1968, answer: "Fair Housing Act Passed", question: "Congress passes the Civil Rights Act of 1968, banning housing discrimination." }
  ],
  "subtopic_3_1": [
    { id: "chrono_s31_1", year: 1954, answer: "Geneva Accords Division", question: "Vietnam is divided at the 17th parallel pending national elections." },
    { id: "chrono_s31_2", year: 1955, answer: "Diem Becomes President", question: "Ngo Dinh Diem declares South Vietnam a republic after a rigged referendum." },
    { id: "chrono_s31_3", year: 1956, answer: "Reunification Elections Cancelled", question: "South Vietnam refuses to participate in scheduled national elections, freezing division." },
    { id: "chrono_s31_4", year: 1960, answer: "Vietcong (NLF) Formed", question: "Communist forces in South Vietnam establish the National Liberation Front." },
    { id: "chrono_s31_5", year: 1963, answer: "Buddhist Monk Protest", question: "Thich Quang Duc burns himself to death in Saigon protesting Buddhist persecution." }
  ],
  "subtopic_3_2": [
    { id: "chrono_s32_1", year: 1963, answer: "Assassination of Ngo Dinh Diem", question: "South Vietnamese generals execute President Diem in a coup backed by the US." },
    { id: "chrono_s32_2", year: 1964, answer: "USS Maddox Engagement", question: "North Vietnamese torpedo boats allegedly clash with US destroyers in Gulf of Tonkin." },
    { id: "chrono_s32_3", year: 1964, answer: "Gulf of Tonkin Resolution", question: "US Congress grants LBJ power to launch direct military operations without formal war declaration." },
    { id: "chrono_s32_4", year: 1965, answer: "Operation Rolling Thunder Launches", question: "The US military begins a sustained aerial bombing campaign against North Vietnam." },
    { id: "chrono_s32_5", year: 1965, answer: "Combat Troops Land at Da Nang", question: "The first US ground combat troops are deployed to defend American military bases." }
  ],
  "subtopic_3_3": [
    { id: "chrono_s33_1", year: 1962, answer: "Operation Ranch Hand Inception", question: "US military begins defoliant spraying (Agent Orange) to clear South Vietnamese jungles." },
    { id: "chrono_s33_2", year: 1965, answer: "Battle of Ia Drang Valley", question: "US airmobile troops clash with regular NVA forces in the first major battle." },
    { id: "chrono_s33_3", year: 1967, answer: "McNamara Line Construction", question: "US builds electronic barrier and sensor system to track troop infiltration." },
    { id: "chrono_s33_4", year: 1968, answer: "Tet Offensive Launched", question: "Vietcong and NVA launch massive surprise attack on Southern cities during lunar holiday." },
    { id: "chrono_s33_5", year: 1968, answer: "My Lai Massacre Occurs", question: "US combat soldiers kill over 500 unarmed South Vietnamese civilians in search-and-destroy." }
  ],
  "subtopic_3_4": [
    { id: "chrono_s34_1", year: 1969, answer: "Vietnamization Announced", question: "Nixon outlines plan to gradually withdraw US troops and train ARVN to fight." },
    { id: "chrono_s34_2", year: 1969, answer: "Silent Majority Appeal", question: "Nixon delivers speech seeking support from patriotic working-class Americans." },
    { id: "chrono_s34_3", year: 1970, answer: "Invasion of Cambodia Ordered", question: "US and ARVN troops invade Cambodia to destroy communist supply bases." },
    { id: "chrono_s34_4", year: 1971, answer: "Invasion of Laos Defeat", question: "ARVN forces invade Laos (Operation Lam Son 719) but suffer disastrous retreat." },
    { id: "chrono_s34_5", year: 1972, answer: "Operation Linebacker II", question: "US launches intense 'Christmas Bombing' campaign against Hanoi and Haiphong." }
  ],
  "subtopic_4_1": [
    { id: "chrono_s41_1", year: 1967, answer: "Pentagon March Protests", question: "Anti-war demonstrators storm the Pentagon in a massive display of civil disobedience." },
    { id: "chrono_s41_2", year: 1969, answer: "Seymour Hersh Exposes My Lai", question: "An investigative reporter exposes the 1968 My Lai massacre, shocking the public." },
    { id: "chrono_s41_3", year: 1969, answer: "Mobilization Day Protest", question: "250,000 demonstrators march on Washington in the largest anti-war rally in history." },
    { id: "chrono_s41_4", year: 1970, answer: "Invasion of Cambodia Expansion", question: "Nixon expands military operations into Cambodia, triggering campus strikes." },
    { id: "chrono_s41_5", year: 1970, answer: "Kent State University Shootings", question: "Ohio National Guardsmen fire on anti-war student protesters, killing four." }
  ],
  "subtopic_4_2": [
    { id: "chrono_s42_1", year: 1968, answer: "Nixon Wins on Law and Order", question: "Nixon wins election by appealing to Americans fatigued by anti-war protests." },
    { id: "chrono_s42_2", year: 1969, answer: "Silent Majority Mobilization", question: "Nixon rallies the conservative electorate to support his gradual withdrawal plan." },
    { id: "chrono_s42_3", year: 1970, answer: "Hard Hat Riots NYC", question: "Construction workers storm anti-war rallies, demonstrating pro-war working-class backlash." },
    { id: "chrono_s42_4", year: 1971, answer: "Pentagon Papers Leaked", question: "Daniel Ellsberg leaks documents exposing governmental lies about Vietnam history." },
    { id: "chrono_s42_5", year: 1972, answer: "Landslide Re-election of Nixon", question: "Nixon defeats anti-war candidate McGovern in a historic electoral college victory." }
  ],
  "subtopic_4_3": [
    { id: "chrono_s43_1", year: 1968, answer: "Paris Peace Talks Begin", question: "Preliminary negotiations begin between US and North Vietnam representatives." },
    { id: "chrono_s43_2", year: 1972, answer: "Kissinger 'Peace is at Hand'", question: "Henry Kissinger announces diplomatic breakthrough prior to presidential election." },
    { id: "chrono_s43_3", year: 1973, answer: "Paris Peace Accords Signed", question: "Ceasefire agreement signed, mandating withdrawal of all remaining US combat forces." },
    { id: "chrono_s43_4", year: 1974, answer: "Resignation of Nixon", question: "Watergate scandal forces Nixon to resign, weakening congressional funding support." },
    { id: "chrono_s43_5", year: 1975, answer: "Fall of Saigon", question: "NVA troops capture South Vietnamese capital, reunifying the nation under communism." }
  ],
  "subtopic_4_4": [
    { id: "chrono_s44_1", year: 1959, answer: "Ho Chi Minh Trail Construction", question: "North Vietnam begins building jungle supply routes through Laos and Cambodia." },
    { id: "chrono_s44_2", year: 1961, answer: "US Advisors Increased", question: "President Kennedy boosts military advisors in Saigon to fight guerrilla tactics." },
    { id: "chrono_s44_3", year: 1965, answer: "Rolling Thunder Failure", question: "Systematic bombing fails to break Hanoi's commitment to supply Vietcong forces." },
    { id: "chrono_s44_4", year: 1968, answer: "Tet Offensive Turning Point", question: "Surprise attacks shatter US confidence and convince public the war is unwinnable." },
    { id: "chrono_s44_5", year: 1971, answer: "Laos Invasion Failure", question: "ARVN failure in Operation Lam Son 719 proves Vietnamization is not working." }
  ]
};

let chronoState = {
  selectedEvents: [],
  shuffledEvents: [],
  placedEvents: [null, null, null, null, null],
  score: 0,
  hasChecked: false
};

function initChronologyGame() {
  const container = document.getElementById('chronology-game-play-area');
  if (!container) return;

  const topicSelect = document.getElementById('chrono-game-topic-select');
  const topicId = topicSelect ? topicSelect.value : 'topic_1';
  
  const pool = CHRONOLOGY_EVENTS[topicId] || CHRONOLOGY_EVENTS["topic_1"];

  // Randomly select 5 unique events
  const selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);

  // Sort them chronologically to get the correct sequence
  chronoState.selectedEvents = [...selected].sort((a, b) => a.year - b.year);
  
  // Shuffle events for option cards
  chronoState.shuffledEvents = [...selected].sort(() => 0.5 - Math.random());
  chronoState.placedEvents = [null, null, null, null, null];
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
        <div class="chrono-slot filled" id="chrono-slot-${idx}" data-index="${idx}">
          <span class="chrono-slot-label">Step ${idx + 1}</span>
          <div class="chrono-card-content">
            <strong>${placedEvent.answer}</strong>
            <p>${placedEvent.question}</p>
          </div>
        </div>
      `;
    } else {
      slotsHtml += `
        <div class="chrono-slot" id="chrono-slot-${idx}" data-index="${idx}">
          <span class="chrono-slot-label">Step ${idx + 1}</span>
          <div class="chrono-slot-placeholder-text">Empty Slot</div>
        </div>
      `;
    }
  });

  // Generate Shuffled Option Cards HTML
  let optionsHtml = chronoState.shuffledEvents.map((q) => {
    const isPlaced = chronoState.placedEvents.some(p => p && p.id === q.id);
    const cleanId = `chrono-opt-${q.id}`;
    return `
      <div class="chrono-option-card ${isPlaced ? 'placed' : ''}" id="${cleanId}" data-qid="${q.id}">
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
          <i class="fa-solid fa-hourglass-half" style="color: var(--primary);"></i> Chronology Challenge
        </h3>
        <span style="font-weight: 700; font-size: 0.95rem; color: var(--success);" id="chrono-score-display">Score: ${chronoState.score}</span>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 20px 0;">
        Paper 3 requires solid chronological reasoning. Tap option cards below to place them in the timeline. Tapping a placed event removes it back to the options. Arrange all 5 in the correct chronological sequence (earliest to latest) and verify!
      </p>

      <!-- Chronology slots panel (Top viewport) -->
      <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Chronology Timeline</div>
      <div class="chrono-slots-container">
        ${slotsHtml}
      </div>

      <!-- Success panel placed right underneath the timeline slots -->
      <div class="causal-success-panel" id="chrono-success-panel" style="display: none; text-align: center; margin-top: 16px; padding: 20px; background: rgba(16, 185, 129, 0.05); border: 1px solid var(--success); border-radius: var(--border-radius-md);">
        <h4 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--success); margin: 0 0 8px 0; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i class="fa-solid fa-medal"></i> Chronology Mastered!
        </h4>
        <p style="font-size: 0.9rem; line-height: 1.5; color: var(--text-main); margin-bottom: 16px;">
          Outstanding work! You successfully ordered all 5 milestones in their correct chronological sequence.
        </p>
        <div id="chrono-narrative-container" style="margin-bottom: 20px;"></div>
        <button class="btn-primary" id="btn-chrono-play-again" style="padding: 10px 20px; font-weight: 600; font-size: 0.9rem; border-radius: 4px; cursor: pointer;">
          <i class="fa-solid fa-rotate-right"></i> Play Again (New Events)
        </button>
      </div>

      <div id="chrono-play-controls-area">
        <!-- Shuffled event cards shelf (Bottom viewport) -->
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Timeline Event Options</div>
        <div class="chrono-options-container">
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

  bindChronologyEvents();
}

function bindChronologyEvents() {
  const container = document.getElementById('game-chronology-container');
  if (!container) return;

  // Shelf cards
  container.querySelectorAll('.chrono-option-card').forEach(card => {
    card.addEventListener('click', () => {
      if (chronoState.hasChecked) return;
      
      const qid = card.getAttribute('data-qid');
      const eventObj = chronoState.shuffledEvents.find(e => e.id === qid);
      if (!eventObj) return;

      // Find first empty slot
      const emptyIdx = chronoState.placedEvents.indexOf(null);
      if (emptyIdx > -1) {
        AudioEngine.play('click');
        chronoState.placedEvents[emptyIdx] = eventObj;
        renderChronologyGameUI();
      }
    });
  });

  // Placed slots
  container.querySelectorAll('.chrono-slot.filled').forEach(slot => {
    slot.addEventListener('click', () => {
      const idx = parseInt(slot.getAttribute('data-index'));
      
      AudioEngine.play('click');
      chronoState.placedEvents[idx] = null;
      chronoState.hasChecked = false; // Reset checked status
      renderChronologyGameUI();
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
      chronoState.placedEvents = [null, null, null, null, null];
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
    } else if (idx === 3) {
      return `next, in <strong>${e.year}</strong>, the <strong>${ansText}</strong> happened (${qText})`;
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
  return `Consider the timing of **${expectedEvent.answer}**. It belongs in the sequence at **Step ${firstWrongIdx + 1}**! Check your order and try again.`;
}

function verifyChronologySequence() {
  const container = document.getElementById('chronology-game-play-area');
  if (!container) return;

  chronoState.hasChecked = true;
  let allCorrect = true;

  // Check sequence correctness
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

  if (allCorrect) {
    AudioEngine.play('cheer');
    if (typeof Confetti !== 'undefined' && typeof Confetti.spawn === 'function') {
      Confetti.spawn(100);
    }
    
    chronoState.score += 20;
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

    const successPanel = document.getElementById('chrono-success-panel');
    if (successPanel) {
      successPanel.style.display = 'block';
    }

    const narrativeContainer = document.getElementById('chrono-narrative-container');
    if (narrativeContainer) {
      narrativeContainer.innerHTML = generateChronoNarrativeParagraph(chronoState.placedEvents);
    }

    const feedbackMsg = document.getElementById('chrono-feedback-message');
    if (feedbackMsg) {
      feedbackMsg.style.display = 'none';
    }
    
    const checkBtn = document.getElementById('btn-chrono-check');
    if (checkBtn) checkBtn.style.display = 'none';

    const playControls = document.getElementById('chrono-play-controls-area');
    if (playControls) playControls.style.display = 'none';
  } else {
    AudioEngine.play('failure');
    chronoState.score = Math.max(0, chronoState.score - 5);
    const scoreDisplay = document.getElementById('chrono-score-display');
    if (scoreDisplay) scoreDisplay.textContent = `Score: ${chronoState.score}`;

    const feedbackMsg = document.getElementById('chrono-feedback-message');
    if (feedbackMsg) {
      feedbackMsg.style.display = 'block';
      feedbackMsg.style.background = 'rgba(239, 68, 68, 0.1)';
      feedbackMsg.style.color = 'var(--accent)';
      feedbackMsg.style.borderLeft = '3px solid var(--accent)';
      feedbackMsg.innerHTML = `<i class="fa-solid fa-lightbulb"></i> ${getChronologyClue()}`;
    }
  }
}

// 8. Exam Skills Practice View (SPA Integration)
// 8. Exam Skills Practice View (SPA Integration)
function renderExamSkillsView() {
  // Q1 reset
  const q1Select = document.getElementById('q1-topic-select');
  if (q1Select) q1Select.value = "";
  document.getElementById('q1-source-card').style.display = 'none';
  document.getElementById('q1-question-card').style.display = 'none';
  document.getElementById('q1-input-area').style.display = 'none';
  document.getElementById('q1-clue-box').style.display = 'none';
  document.getElementById('q1-answer-box').style.display = 'none';
  const q1Feedback = document.getElementById('q1-mcq-feedback');
  if (q1Feedback) {
    q1Feedback.style.display = 'none';
    q1Feedback.textContent = '';
  }
  const q1Choices = document.getElementById('q1-mcq-choices');
  if (q1Choices) q1Choices.innerHTML = '';
  for (let i = 1; i <= 2; i++) {
    const chk = document.getElementById(`chk-q1-rubric-${i}`);
    if (chk) chk.checked = false;
  }

  // Q2 reset
  const q2Select = document.getElementById('q2-topic-select');
  if (q2Select) q2Select.value = "";
  document.getElementById('q2-question-card').style.display = 'none';
  document.getElementById('q2-input-area').style.display = 'none';
  document.getElementById('q2-clue-box').style.display = 'none';
  document.getElementById('q2-answer-box').style.display = 'none';
  document.getElementById('draft-feedback-q2').style.display = 'none';
  document.getElementById('q2-user-answer').value = "";
  const knowledgeContainer = document.getElementById('q2-knowledge-keywords');
  const connectiveContainer = document.getElementById('q2-connective-keywords');
  if (knowledgeContainer) knowledgeContainer.innerHTML = '';
  if (connectiveContainer) connectiveContainer.innerHTML = '';
  const keywordsBox = document.getElementById('q2-keywords-box');
  if (keywordsBox) keywordsBox.style.display = 'none';
  for (let i = 1; i <= 3; i++) {
    const chk = document.getElementById(`chk-q2-rubric-${i}`);
    if (chk) chk.checked = false;
  }

  // Q3 reset (combined suite)
  const q3Select = document.getElementById('q3-topic-select');
  if (q3Select) q3Select.value = "";
  const materialsContainer = document.getElementById('q3-materials-container');
  if (materialsContainer) materialsContainer.style.display = 'none';
  const q3InputArea = document.getElementById('q3-input-area');
  if (q3InputArea) q3InputArea.style.display = 'none';

  document.getElementById('q3a-user-answer').value = "";
  document.getElementById('q3b-user-answer').value = "";
  document.getElementById('q3c-user-answer').value = "";
  document.getElementById('q3d-user-answer').value = "";

  document.getElementById('q3a-clue-box').style.display = 'none';
  document.getElementById('q3a-answer-box').style.display = 'none';
  document.getElementById('draft-feedback-q3a').style.display = 'none';

  document.getElementById('q3b-answer-box').style.display = 'none';
  document.getElementById('q3c-answer-box').style.display = 'none';
  document.getElementById('q3d-clue-box').style.display = 'none';
  document.getElementById('q3d-answer-box').style.display = 'none';
  document.getElementById('draft-feedback-q3d').style.display = 'none';

  for (let i = 1; i <= 4; i++) {
    const chka = document.getElementById(`chk-q3a-rubric-${i}`);
    if (chka) chka.checked = false;
    const chkd = document.getElementById(`chk-q3d-rubric-${i}`);
    if (chkd) chkd.checked = false;
  }

  // Tab activation
  document.querySelectorAll('.exam-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-panel') === 'q1') {
      btn.classList.add('active');
      btn.style.background = 'rgba(255, 255, 255, 0.05)';
      btn.style.color = 'var(--text-main)';
    } else {
      btn.classList.remove('active');
      btn.style.background = 'transparent';
      btn.style.borderColor = 'transparent';
      btn.style.color = 'var(--text-muted)';
    }
  });

  document.querySelectorAll('.exam-panel-content').forEach(p => {
    if (p.id === 'panel-q1') {
      p.style.display = 'block';
    } else {
      p.style.display = 'none';
    }
  });
}

export let activeClassicFilter = 'all';
export function setActiveClassicFilter(val) {
  activeClassicFilter = val;
}

function renderClassicView() {
  const container = document.getElementById('classic-list-container');
  container.innerHTML = '';
  
  const subtopicId = state.selectedSubtopicId;
  let questions = state.allQuestions.filter(q => q.subtopicId === subtopicId);
  
  // Filter questions
  if (activeClassicFilter === 'standard') {
    questions = questions.filter(q => q.type === 'standard');
  } else if (activeClassicFilter === 'depth') {
    questions = questions.filter(q => q.type === 'depth');
  } else if (activeClassicFilter === 'unmastered') {
    questions = questions.filter(q => !state.mastery[q.id]);
  }
  
  // Update count display
  document.getElementById('subtopic-count-display').textContent = `${questions.length} question${questions.length === 1 ? '' : 's'} displayed`;
  
  if (questions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-box-open"></i>
        <h3>No Questions Found</h3>
        <p>Try changing your filter settings or complete more study cards to populate this list.</p>
      </div>
    `;
    return;
  }
  
  questions.forEach((q, idx) => {
    const isMastered = !!state.mastery[q.id];
    const isBookmarked = state.bookmarks.includes(q.id);
    
    const details = document.createElement('details');
    details.className = 'quiz-card-details';
    details.id = `accordion-${q.id}`;
        details.innerHTML = `
      <summary class="quiz-card-summary">
        <div class="summary-content">
          <span class="summary-num">${idx + 1}</span>
          <span class="summary-text">${q.question}</span>
        </div>
        <div class="summary-badges">
          <span class="badge ${q.type === 'standard' ? 'badge-standard' : 'badge-depth'}">${q.type === 'standard' ? 'Standard' : 'Top Tier Trivia'}</span>
          <span class="badge badge-year">${q.year}</span>
          <div class="mastery-checkbox-container ${isMastered ? 'mastered' : ''}" data-qid="${q.id}" title="Mark as Mastered">
            <i class="fa-solid fa-check"></i>
          </div>
          <i class="fa-solid fa-chevron-down summary-arrow"></i>
        </div>
      </summary>
      <div class="details-content">
        <div class="answer-header">
          <i class="fa-solid fa-circle-check"></i> Correct Key Term / Answer
        </div>
        <div class="answer-value">${q.answer}</div>
        <div class="explanation-value">${q.explanation}</div>
      </div>
    `;
    const checkBtn = details.querySelector('.mastery-checkbox-container');
    checkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nextState = !checkBtn.classList.contains('mastered');
      setMastered(q.id, nextState);
      checkBtn.classList.toggle('mastered', nextState);
      
      // Update checkmark UI inside
      if (nextState) {
        AudioEngine.play('success');
      } else {
        AudioEngine.play('click');
      }
    });

    details.addEventListener('toggle', () => {
      if (details.open) {
        AudioEngine.play('flip');
      }
    });
    
    container.appendChild(details);
  });
}

export function formatSubtopicIdToKT(subtopicId) {
  if (!subtopicId) return '';
  const match = subtopicId.match(/subtopic_(\d+)_(\d+)/);
  return match ? `KT ${match[1]}.${match[2]}` : '';
}

// 5. Flashcard View logic
function startFlashcardSession(subtopicId) {
  const questions = state.allQuestions.filter(q => q.subtopicId === subtopicId);
  
  // Shuffle cards for study session
  state.flashcardSession.deck = [...questions].sort(() => Math.random() - 0.5);
  state.flashcardSession.activeIndex = 0;
  state.flashcardSession.originalLength = questions.length;
  state.flashcardSession.masteredCount = 0;
  
  renderFlashcard();
}

function generateReinforcementMCQ(q) {
  // Determine if answer is too long for a clean prompt
  const wordCount = q.answer.split(/\s+/).length;
  const useExplanation = wordCount > 5 || Math.random() < 0.5;

  let pool = state.allQuestions.filter(other => other.subtopicId === q.subtopicId && other.id !== q.id);
  // Fallback to topic level if subtopic pool is too small
  if (pool.length < 3) {
    pool = state.allQuestions.filter(other => other.topicId === q.topicId && other.id !== q.id);
  }

  let correctText = '';
  let distractors = [];
  let prompt = '';

  if (useExplanation) {
    prompt = `Select the correct historical context/detail associated with <strong>${q.answer}</strong>:`;
    correctText = q.explanation;
    // Get unique explanations as distractors
    const uniqueExps = [...new Set(pool.map(other => other.explanation).filter(e => e !== correctText))];
    distractors = uniqueExps.slice(0, 3);
    // If not enough unique explanations, fallback to general ones
    while (distractors.length < 3) {
      distractors.push("Alternative historical context overview for Paper 3 studies.");
    }
  } else {
    prompt = `Which historical question/definition is answered by <strong>'${q.answer}'</strong>?`;
    correctText = q.question;
    const uniqueQs = [...new Set(pool.map(other => other.question).filter(qst => qst !== correctText))];
    distractors = uniqueQs.slice(0, 3);
    while (distractors.length < 3) {
      distractors.push("Alternative lesson question and check of key facts.");
    }
  }

  // Combine and shuffle
  const options = [correctText, ...distractors].sort(() => Math.random() - 0.5);
  const correctIndex = options.indexOf(correctText);

  return {
    prompt,
    options,
    correctIndex,
    explanation: q.explanation
  };
}

function renderMCQReinforce(mcq) {
  const container = document.getElementById('flashcard-reinforce-options');
  container.innerHTML = '';
  
  mcq.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'flashcard-mcq-option';
    btn.innerHTML = opt;
    btn.style.width = '100%';
    btn.style.textAlign = 'left';
    btn.style.padding = '8px 12px';
    btn.style.fontSize = '0.75rem';
    btn.style.lineHeight = '1.3';
    btn.style.borderRadius = 'var(--border-radius-sm)';
    btn.style.border = '1px solid var(--border-glass)';
    btn.style.background = 'rgba(255, 255, 255, 0.03)';
    btn.style.color = 'var(--text-main)';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'all var(--transition-fast)';
    
    btn.addEventListener('click', () => {
      handleReinforceAnswer(idx, btn);
    });
    
    container.appendChild(btn);
  });
}

function handleReinforceAnswer(selectedIndex, clickedBtn) {
  const session = state.flashcardSession;
  const mcq = session.reinforceQuestion;
  const q = session.deck[session.activeIndex];
  const cardEl = document.getElementById('flashcard-card');
  
  // Disable all options
  const optionBtns = document.querySelectorAll('.flashcard-mcq-option');
  optionBtns.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
  });

  const isCorrect = selectedIndex === mcq.correctIndex;
  
  if (isCorrect) {
    AudioEngine.play('success');
    clickedBtn.classList.add('correct');
    
    setMastered(q.id, true);
    session.masteredCount++;
    
    setTimeout(() => {
      cardEl.classList.add('swipe-right');
      setTimeout(() => {
        session.activeIndex++;
        renderFlashcard();
      }, 300);
    }, 1200);
  } else {
    AudioEngine.play('fail');
    clickedBtn.classList.add('incorrect');
    
    // Highlight the correct one in green
    optionBtns.forEach((btn, idx) => {
      if (idx === mcq.correctIndex) {
        btn.classList.add('correct');
      }
    });
    
    setMastered(q.id, false);
    
    setTimeout(() => {
      cardEl.classList.add('swipe-left');
      setTimeout(() => {
        session.deck.push(q);
        session.activeIndex++;
        renderFlashcard();
      }, 300);
    }, 2200);
  }
}

function renderFlashcard() {
  const deck = state.flashcardSession.deck;
  const idx = state.flashcardSession.activeIndex;
  
  // Update progress headers
  document.getElementById('flashcard-counter-text').textContent = `Card ${idx + 1} of ${deck.length}`;
  const masteryPct = deck.length > 0 ? Math.round((state.flashcardSession.masteredCount / state.flashcardSession.originalLength) * 100) : 0;
  document.getElementById('flashcard-mastery-text').textContent = `${masteryPct}% resolved this session`;
  document.getElementById('flashcard-progress-bar-fill').style.width = `${Math.min(100, Math.round(((idx) / deck.length) * 100))}%`;
  
  if (idx >= deck.length) {
    // Finished session
    showFlashcardCompletion();
    return;
  }
  
  // Reset Reinforcing State for new card!
  state.flashcardSession.reinforcing = false;
  state.flashcardSession.reinforceQuestion = null;
  document.getElementById('flashcard-back-standard-body').style.display = 'flex';
  document.getElementById('flashcard-back-reinforce-body').style.display = 'none';

  const q = deck[idx];
  const isBookmarked = state.bookmarks.includes(q.id);
  
  // Render Front & Back Content
  const frontBadge = document.getElementById('card-front-badge');
  frontBadge.textContent = q.type === 'standard' ? 'Standard' : 'Top Tier Trivia';
  frontBadge.className = `badge ${q.type === 'standard' ? 'badge-standard' : 'badge-depth'}`;
  
  const backBadge = document.getElementById('card-back-badge');
  backBadge.textContent = q.type === 'standard' ? 'Standard' : 'Top Tier Trivia';
  backBadge.className = `badge ${q.type === 'standard' ? 'badge-standard' : 'badge-depth'}`;
  
  document.getElementById('card-front-question').textContent = q.question;
  document.getElementById('card-back-answer').textContent = q.answer;
  document.getElementById('card-back-explanation').textContent = q.explanation;
  
  const ktLabel = formatSubtopicIdToKT(q.subtopicId);
  document.getElementById('card-front-topic-indicator').textContent = ktLabel;
  document.getElementById('card-back-topic-indicator').textContent = ktLabel;
  
  // Set bookmark states on flashcard faces
  const frontBkmk = document.getElementById('card-front-bookmark');
  const backBkmk = document.getElementById('card-back-bookmark');
  
  [frontBkmk, backBkmk].forEach(b => {
    b.setAttribute('data-qid', q.id);
    b.className = `bookmark-icon-container ${isBookmarked ? 'bookmarked' : ''}`;
    b.querySelector('i').className = isBookmarked ? 'fa-solid fa-star' : 'fa-regular fa-star';
  });

  // Ensure card is unflipped
  const cardEl = document.getElementById('flashcard-card');
  cardEl.classList.remove('flipped');
  cardEl.className = 'flashcard-card'; // Clear swipe animations
  
  // Reset buttons
  document.getElementById('btn-flashcard-reveal').style.display = 'flex';
  document.getElementById('flashcard-self-grade-actions').style.display = 'none';
}

function handleFlashcardGrade(correct) {
  if (state.flashcardSession.activeIndex >= state.flashcardSession.deck.length) return;
  
  const cardEl = document.getElementById('flashcard-card');
  if (cardEl.classList.contains('swipe-right') || cardEl.classList.contains('swipe-left')) return;
  
  const deck = state.flashcardSession.deck;
  const idx = state.flashcardSession.activeIndex;
  const q = deck[idx];
  
  if (correct) {
    AudioEngine.play('success');
    setMastered(q.id, true);
    state.flashcardSession.masteredCount++;
    
    cardEl.classList.add('swipe-right');
    setTimeout(() => {
      state.flashcardSession.activeIndex++;
      renderFlashcard();
    }, 300);
  } else {
    setMastered(q.id, false);
    AudioEngine.play('fail');
    
    // Spaced Repetition: Push card to end of deck to challenge student again!
    cardEl.classList.add('swipe-left');
    setTimeout(() => {
      // Push back to deck
      state.flashcardSession.deck.push(q);
      state.flashcardSession.activeIndex++;
      renderFlashcard();
    }, 300);
  }
}

function showFlashcardCompletion() {
  AudioEngine.play('cheer');
  Confetti.spawn(100);
  
  const container = document.getElementById('view-flashcards');
  container.innerHTML = `
    <div class="empty-state" style="padding: 60px 20px;">
      <div class="results-grade-circle" style="width: 90px; height: 90px; font-size: 2.2rem; margin: 0 auto 20px; animation: pulse 2s infinite;">
        <i class="fa-solid fa-flag-checkered" style="color: var(--text-inverse);"></i>
      </div>
      <h3>Study Deck Resolved!</h3>
      <p>Excellent active recall training. You finished all flashcards in this subtopic.</p>
      <div style="display: flex; gap: 16px; margin-top: 24px; justify-content: center; width: 100%; max-width: 400px; margin-left: auto; margin-right: auto;">
        <button class="btn-secondary" id="btn-fc-restart">Study Again</button>
        <button class="btn-primary" id="btn-fc-finish">Return Dashboard</button>
      </div>
    </div>
  `;
  
  document.getElementById('btn-fc-restart').addEventListener('click', () => {
    AudioEngine.play('click');
    // Restore normal structure first
    restoreFlashcardSkeleton();
    startFlashcardSession(state.selectedSubtopicId);
  });
  
  document.getElementById('btn-fc-finish').addEventListener('click', () => {
    AudioEngine.play('click');
    restoreFlashcardSkeleton();
    switchView('dashboard');
  });
}

function restoreFlashcardSkeleton() {
  const container = document.getElementById('view-flashcards');
  container.innerHTML = `
    <div class="flashcard-view-container">
      <div class="flashcard-progress-header">
        <span id="flashcard-counter-text">Card 1 of 15</span>
        <span id="flashcard-mastery-text">0% resolved this session</span>
      </div>
      <div class="flashcard-progress-bar">
        <div class="flashcard-progress-fill" id="flashcard-progress-bar-fill"></div>
      </div>
      <div class="flashcard-stage" id="flashcard-stage">
        <div class="flashcard-card" id="flashcard-card">
          <div class="flashcard-face flashcard-front">
            <div class="card-top">
              <span class="badge" id="card-front-badge">Standard</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="card-topic-indicator" id="card-front-topic-indicator" style="font-size: 0.82rem; font-weight: 700; color: var(--primary);"></span>
                <span class="bookmark-icon-container" id="card-front-bookmark"><i class="fa-regular fa-star"></i></span>
              </div>
            </div>
            <div class="card-body"><h3 class="card-question" id="card-front-question"></h3></div>
            <div class="card-bottom"><i class="fa-solid fa-rotate"></i> Click card to flip and reveal answer</div>
          </div>
          <div class="flashcard-face flashcard-back">
            <div class="card-top">
              <span class="badge badge-standard" id="card-back-badge">Standard</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="card-topic-indicator" id="card-back-topic-indicator" style="font-size: 0.82rem; font-weight: 700; color: var(--primary);"></span>
                <span class="bookmark-icon-container" id="card-back-bookmark"><i class="fa-regular fa-star"></i></span>
              </div>
            </div>
            <div class="card-body">
              <span class="card-answer-label">Correct Answer</span>
              <h2 class="card-answer-text" id="card-back-answer"></h2>
              <p class="card-explanation-text" id="card-back-explanation"></p>
            </div>
            <div class="card-bottom"><i class="fa-solid fa-rotate"></i> Click card to flip back</div>
          </div>
        </div>
      </div>
      <div class="flashcard-controls">
        <button class="btn-secondary" id="btn-flashcard-reveal"><i class="fa-solid fa-rotate"></i> Flip Card</button>
        <div id="flashcard-self-grade-actions" style="display: none; width: 100%; gap: 16px;">
          <button class="btn-incorrect" id="btn-flashcard-incorrect"><i class="fa-solid fa-xmark"></i> Study Again</button>
          <button class="btn-correct" id="btn-flashcard-correct"><i class="fa-solid fa-check"></i> Got It!</button>
        </div>
      </div>
    </div>
  `;
  
  // Re-attach card flip listener
  document.getElementById('flashcard-stage').addEventListener('click', flipFlashcard);
  document.getElementById('btn-flashcard-reveal').addEventListener('click', flipFlashcard);
  document.getElementById('btn-flashcard-incorrect').addEventListener('click', () => handleFlashcardGrade(false));
  document.getElementById('btn-flashcard-correct').addEventListener('click', () => handleFlashcardGrade(true));
  
  const bkmks = [document.getElementById('card-front-bookmark'), document.getElementById('card-back-bookmark')];
  bkmks.forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBookmark(b.getAttribute('data-qid'));
    });
  });
}

function flipFlashcard() {
  const card = document.getElementById('flashcard-card');
  card.classList.toggle('flipped');
  AudioEngine.play('flip');
  
  const isFlipped = card.classList.contains('flipped');
  const revealBtn = document.getElementById('btn-flashcard-reveal');
  const actionBtns = document.getElementById('flashcard-self-grade-actions');
  
  if (isFlipped) {
    revealBtn.style.display = 'none';
    actionBtns.style.display = 'flex';
  } else {
    revealBtn.style.display = 'flex';
    actionBtns.style.display = 'none';
  }
}

const TIMELINE_IMAGES = [
  {
    keywords: ["brown v. board", "earl warren", "board of education", "unanimity strategy", "overturned plessy"],
    image: "assets/sources/warren-court-1954.jpg",
    provenance: "A formal group portrait of the members of the Warren Court, the Supreme Court of the United States, taken in Washington D.C., 1954."
  },
  {
    keywords: ["little rock nine", "central high school", "faubus", "elizabeth eckford", " Arkansas National Guard"],
    image: "assets/sources/little-rock-nine-1957.jpg",
    provenance: "A photograph of the Little Rock Nine walking to Central High School under guard, September 1957."
  },
  {
    keywords: ["101st airborne", "airborne division", "central high guard", "federalized the arkansas"],
    image: "assets/sources/airborne-little-rock-patrol.jpg",
    provenance: "Members of the 101st Airborne Division standing guard outside Central High School, September 1957."
  },
  {
    keywords: ["rosa parks fingerprint", "parks booking", "parks arrest", "arrest of rosa parks"],
    image: "assets/sources/rosa-parks-fingerprint.jpg",
    provenance: "Rosa Parks being fingerprinted in Montgomery, Alabama, after defying segregation laws, 22 February 1956."
  },
  {
    keywords: ["mlk boycott speech", "boycott speech 1955", "grassroots non-violent unity"],
    image: "assets/sources/mlk-boycott-speech-1955.jpg",
    provenance: "Martin Luther King Jr. speaking to a crowd of boycotters, demonstrating the grassroots non-violent unity of the Montgomery movement."
  },
  {
    keywords: ["southern manifesto", "manifesto signing", "strom thurmond"],
    image: "assets/sources/southern-manifesto-signing.jpg",
    provenance: "Southern politicians signing the Southern Manifesto to coordinate opposition and resist federal desegregation mandates."
  },
  {
    keywords: ["ku klux klan march", "kkk march", "robes and hoods"],
    image: "assets/sources/kkk-march-washington-1926.jpg",
    provenance: "A Ku Klux Klan parade demonstrating the public presence of white supremacist groups, 1957."
  },
  {
    keywords: ["greensboro sit-in", "woolworth's lunch counter", "greensboro lunch counter"],
    image: "assets/sources/greensboro-sit-in-counter.jpg",
    provenance: "A photograph of the original Greensboro Woolworth's lunch counter, now preserved as an exhibit at the Smithsonian National Museum of American History."
  },
  {
    keywords: ["freedom riders bus", "bus firebombed", "greyhound bus burning", "bus wreckage"],
    image: "assets/sources/freedom-riders-bus-wreckage.jpg",
    provenance: "Smoking wreckage of a Greyhound bus carrying Freedom Riders firebombed in Anniston, Alabama, 14 May 1961."
  },
  {
    keywords: ["james meredith walking", "meredith university of mississippi", "integration of ole miss"],
    image: "assets/sources/james-meredith-walking.jpg",
    provenance: "James Meredith under heavy US Marshal escort during the integration of the University of Mississippi, October 1962."
  },
  {
    keywords: ["police dog attacking", "dog attack birmingham", "bull connor dogs"],
    image: "assets/sources/birmingham-protests-dogs-1963.jpg",
    provenance: "A police dog attacking a civil rights demonstrator during the Birmingham campaign, May 1963."
  },
  {
    keywords: ["dream speech", "i have a dream", "lincoln memorial crowd"],
    image: "assets/sources/mlk-dream-speech-1963.jpg",
    provenance: "Dr. King speaking to the massive crowd at the Lincoln Memorial during the March on Washington, 28 August 1963."
  },
  {
    keywords: ["signing voting rights", "johnson presenting signing pen"],
    image: "assets/sources/lbj-signing-voting-rights-1965.jpg",
    provenance: "President Lyndon B. Johnson presenting a signing pen to Martin Luther King Jr. at the passage of the Voting Rights Act, 6 August 1965."
  },
  {
    keywords: ["malcolm x holding newspaper", "advocating self-defense and black nationalism"],
    image: "assets/sources/malcolm-x-newspaper.jpg",
    provenance: "Malcolm X advocating self-defense and Black nationalism, 1964."
  },
  {
    keywords: ["black panther party marching", "panthers in uniform", "panthers oakland"],
    image: "assets/sources/black-panthers-marching.jpg",
    provenance: "Members of the Black Panther Party marching in uniform, Oakland, California, 1968."
  },
  {
    keywords: ["detroit riot guard", "detroit urban rebellion"],
    image: "assets/sources/detroit-riot-guard-1967.jpg",
    provenance: "National Guard troops deployed to restore order during the 1967 Detroit urban rebellion."
  },
  {
    keywords: ["poor peoples campaign", "resurrection city 1968"],
    image: "assets/sources/poor-peoples-campaign-1968.jpg",
    provenance: "Demonstrators gather in Washington D.C. for the Poor People's Campaign following the assassination of MLK, May 1968."
  },
  {
    keywords: ["buddhist monks protesting", "buddhist crisis saigon", "self-immolation"],
    image: "assets/sources/buddhist-protests-1963.jpg",
    provenance: "Buddhist monks protesting in Saigon during the 1963 Buddhist Crisis."
  },
  {
    keywords: ["uss maddox", "maddox destroyer", "gulf of tonkin incident"],
    image: "assets/sources/uss-maddox.jpg",
    provenance: "The USS Maddox, the destroyer involved in the Gulf of Tonkin incidents in August 1964."
  },
  {
    keywords: ["marines landing", "da nang beach", "ground combat troops landing"],
    image: "assets/sources/marines-landing-danang.jpg",
    provenance: "The first official US ground combat troops landing at Da Nang, 8 March 1965."
  },
  {
    keywords: ["wades through a stream", "Duc Pho stream", "machine gunner wades"],
    image: "assets/sources/us-soldier-patrolling-swamp.jpg",
    provenance: "Company E, 3rd Battalion, 7th Infantry machine gunner wades through a stream during a combat patrol in Duc Pho, 1967."
  },
  {
    keywords: ["agent orange spraying", "C-123 aircraft", "spraying agent orange"],
    image: "assets/sources/agent-orange-spraying-c123.jpg",
    provenance: "US C-123 aircraft spraying Agent Orange defoliant over South Vietnamese forests, 1966."
  },
  {
    keywords: ["president richard nixon visiting", "nixon visiting troops", "vietnamization policy"],
    image: "assets/sources/nixon-visiting-troops.jpg",
    provenance: "President Richard Nixon visiting US troops in South Vietnam, July 1969."
  },
  {
    keywords: ["cambodia incursion", "arvn troops advancing", "cambodia invasion"],
    image: "assets/sources/arvn-troops-combat.jpg",
    provenance: "South Vietnamese ARVN troops advancing during the Cambodia incursion, May 1970."
  },
  {
    keywords: ["draft lottery drawing", "first televised draft lottery"],
    image: "assets/sources/vietnam-draft-lottery.jpg",
    provenance: "Selective Service officials drawing capsules during the first televised draft lottery, 1 December 1969."
  },
  {
    keywords: ["kent state shootings", "national guard at kent state", "kent state university may 1970"],
    image: "assets/sources/kent-state-protests-1970.jpg",
    provenance: "Student demonstrators facing the National Guard at Kent State University, May 1970."
  },
  {
    keywords: ["demonstrators marching near the pentagon", "pentagon in washington", "anti-war protest pentagon"],
    image: "assets/sources/antiwar-pentagon-protest-1967.jpg",
    provenance: "Anti-war demonstrators facing military police outside the Pentagon, October 1967."
  },
  {
    keywords: ["pro-war demonstrators", "silent majority speaks", "silent majority rally"],
    image: "assets/sources/pro-war-rally-nyc.jpg",
    provenance: "Pro-war demonstrators marching in support of Nixon's Vietnam policies, 1970."
  },
  {
    keywords: ["hard hat riots", "construction workers marching", "hard-hat riot"],
    image: "assets/sources/hard-hat-riot-1970.jpg",
    provenance: "Construction workers marching in support of the government during the Hard Hat Riots, May 1970."
  },
  {
    keywords: ["signing of the paris peace", "paris peace accords signing"],
    image: "assets/sources/paris-peace-accords-signing.jpg",
    provenance: "The formal signing ceremony of the Paris Peace Accords, 27 January 1973."
  },
  {
    keywords: ["evacuation of the us embassy", "saigon embassy evacuation", "roof adjacent to the us embassy"],
    image: "assets/sources/saigon-embassy-evacuation.jpg",
    provenance: "Evacuation of American personnel and South Vietnamese refugees from Saigon, 29 April 1975."
  },
  {
    keywords: ["vietnam veterans against the war", "vvaw protesting", "throwing away their combat medals"],
    image: "assets/sources/vvaw-veterans-protest.jpg",
    provenance: "Vietnam veterans protesting against the war by throwing away their combat medals at the Capitol, 1971."
  }
];
const KEY_FIGURES_BIO = {
  "dwight d. eisenhower": {
    name: "Dwight D. Eisenhower",
    role: "34th President of the United States (1953–1961)",
    bio: "General and WWII hero who served as Republican President. He sent the 101st Airborne Division to Little Rock in 1957 to enforce desegregation and signed the Civil Rights Acts of 1957 and 1960. He supported the Diem regime in Vietnam, initiating the military advisory role to block communism.",
    image: "assets/sources/portraits/eisenhower.jpg"
  },
  "eisenhower": {
    name: "Dwight D. Eisenhower",
    role: "34th President of the United States (1953–1961)",
    bio: "General and WWII hero who served as Republican President. He sent the 101st Airborne Division to Little Rock in 1957 to enforce desegregation and signed the Civil Rights Acts of 1957 and 1960. He supported the Diem regime in Vietnam, initiating the military advisory role to block communism.",
    image: "assets/sources/portraits/eisenhower.jpg"
  },
  "john f. kennedy": {
    name: "John F. Kennedy (JFK)",
    role: "35th President of the United States (1961–1963)",
    bio: "Democratic President who championed the 'New Frontier.' He was forced to send US Marshals to protect Freedom Riders and integrate universities. In Vietnam, he increased US advisors to over 16,000 and authorized the Strategic Hamlet Program, before his assassination in November 1963.",
    image: "assets/sources/portraits/kennedy.jpg"
  },
  "kennedy": {
    name: "John F. Kennedy (JFK)",
    role: "35th President of the United States (1961–1963)",
    bio: "Democratic President who championed the 'New Frontier.' He was forced to send US Marshals to protect Freedom Riders and integrate universities. In Vietnam, he increased US advisors to over 16,000 and authorized the Strategic Hamlet Program, before his assassination in November 1963.",
    image: "assets/sources/portraits/kennedy.jpg"
  },
  "lyndon b. johnson": {
    name: "Lyndon B. Johnson (LBJ)",
    role: "36th President of the United States (1963–1969)",
    bio: "Succeeded JFK and pushed through the Civil Rights Act of 1964 and Voting Rights Act of 1965. He escalated the Vietnam War following the Gulf of Tonkin Incident in 1964, deploying combat troops and launching Operation Rolling Thunder, but declined to run for re-election in 1968 due to anti-war protests.",
    image: "assets/sources/portraits/johnson.jpg"
  },
  "johnson": {
    name: "Lyndon B. Johnson (LBJ)",
    role: "36th President of the United States (1963–1969)",
    bio: "Succeeded JFK and pushed through the Civil Rights Act of 1964 and Voting Rights Act of 1965. He escalated the Vietnam War following the Gulf of Tonkin Incident in 1964, deploying combat troops and launching Operation Rolling Thunder, but declined to run for re-election in 1968 due to anti-war protests.",
    image: "assets/sources/portraits/johnson.jpg"
  },
  "richard nixon": {
    name: "Richard Nixon",
    role: "37th President of the United States (1969–1974)",
    bio: "Republican President who introduced the policy of 'Vietnamization' to withdraw US combat troops while equipping ARVN forces. He expanded the war by bombing Laos and Cambodia, appealed to the 'Silent Majority' to counter anti-war protests, and signed the Paris Peace Accords in 1973.",
    image: "assets/sources/portraits/nixon.jpg"
  },
  "nixon": {
    name: "Richard Nixon",
    role: "37th President of the United States (1969–1974)",
    bio: "Republican President who introduced the policy of 'Vietnamization' to withdraw US combat troops while equipping ARVN forces. He expanded the war by bombing Laos and Cambodia, appealed to the 'Silent Majority' to counter anti-war protests, and signed the Paris Peace Accords in 1973.",
    image: "assets/sources/portraits/nixon.jpg"
  },
  "martin luther king": {
    name: "Martin Luther King Jr. (MLK)",
    role: "Civil Rights Leader & President of SCLC",
    bio: "Baptist minister who emerged as the primary leader of the Montgomery Bus Boycott, founded the Southern Christian Leadership Conference (SCLC), and championed non-violent direct action. He delivered his famous 'I Have a Dream' speech at the 1963 March on Washington and campaigned until his assassination in 1968.",
    image: "assets/sources/portraits/mlk.jpg"
  },
  "mlk": {
    name: "Martin Luther King Jr. (MLK)",
    role: "Civil Rights Leader & President of SCLC",
    bio: "Baptist minister who emerged as the primary leader of the Montgomery Bus Boycott, founded the Southern Christian Leadership Conference (SCLC), and championed non-violent direct action. He delivered his famous 'I Have a Dream' speech at the 1963 March on Washington and campaigned until his assassination in 1968.",
    image: "assets/sources/portraits/mlk.jpg"
  },
  "malcolm x": {
    name: "Malcolm X",
    role: "Black Nationalist & Human Rights Activist",
    bio: "A radical campaigner and prominent figure in the Nation of Islam who initially rejected integration and advocated for Black separatism and self-defense 'by any means necessary'. He later changed his views to work with other civil rights groups before being assassinated in 1965.",
    image: "assets/sources/portraits/malcolm_x.jpg"
  },
  "ngo dinh diem": {
    name: "Ngo Dinh Diem",
    role: "President of South Vietnam (1955–1963)",
    bio: "Strongly anti-communist Catholic leader of South Vietnam supported by the US. His nepotism, discrimination against the Buddhist majority, and failure to defeat Vietcong guerrillas led to widespread protests and his assassination in a US-backed coup in November 1963.",
    image: "assets/sources/portraits/diem.jpg"
  },
  "diem": {
    name: "Ngo Dinh Diem",
    role: "President of South Vietnam (1955–1963)",
    bio: "Strongly anti-communist Catholic leader of South Vietnam supported by the US. His nepotism, discrimination against the Buddhist majority, and failure to defeat Vietcong guerrillas led to widespread protests and his assassination in a US-backed coup in November 1963.",
    image: "assets/sources/portraits/diem.jpg"
  },
  "rosa parks": {
    name: "Rosa Parks",
    role: "Civil Rights Activist & NAACP Secretary",
    bio: "A respected NAACP member whose refusal to give up her bus seat to a white passenger in 1955 sparked the 381-day Montgomery Bus Boycott.",
    image: "assets/sources/portraits/rosa_parks.jpg"
  },
  "james meredith": {
    name: "James Meredith",
    role: "First Black Student at Ole Miss",
    bio: "The first Black student to enroll at the segregated University of Mississippi (Ole Miss) in 1962, a milestone that required 30,000 federal troops to suppress violent riots.",
    image: "assets/sources/portraits/james_meredith.jpg"
  },
  "earl warren": {
    name: "Chief Justice Earl Warren",
    role: "Chief Justice of the US Supreme Court (1953–1969)",
    bio: "Led the Supreme Court during a period of landmark rulings. He orchestrated the unanimous 9-0 decision in Brown v. Board of Education (1954), outlawing school segregation, and oversaw decisions expanding civil liberties and voter rights.",
    image: "assets/sources/portraits/earl_warren.jpg"
  },
  "william westmoreland": {
    name: "General William Westmoreland",
    role: "Commander of US Military Forces in Vietnam (1964–1968)",
    bio: "General who directed US combat operations. He championed a war of attrition, utilizing 'Search and Destroy' missions, heavy artillery, and body counts. His reassignment occurred after the Tet Offensive of 1968 shattered public faith in victory.",
    image: "assets/sources/portraits/westmoreland.jpg"
  },
  "westmoreland": {
    name: "General William Westmoreland",
    role: "Commander of US Military Forces in Vietnam (1964–1968)",
    bio: "General who directed US combat operations. He championed a war of attrition, utilizing 'Search and Destroy' missions, heavy artillery, and body counts. His reassignment occurred after the Tet Offensive of 1968 shattered public faith in victory.",
    image: "assets/sources/portraits/westmoreland.jpg"
  },
  "henry kissinger": {
    name: "Henry Kissinger",
    role: "US National Security Advisor & Secretary of State",
    bio: "Diplomat who co-negotiated the Paris Peace Accords in 1973 with North Vietnam's Lê Đức Thọ, for which he won the Nobel Peace Prize. He shaped Nixon's policies of détente, the secret bombing of Cambodia, and the 'decent interval' strategy.",
    image: "assets/sources/portraits/kissinger.jpg"
  },
  "kissinger": {
    name: "Henry Kissinger",
    role: "US National Security Advisor & Secretary of State",
    bio: "Diplomat who co-negotiated the Paris Peace Accords in 1973 with North Vietnam's Lê Đức Thọ, for which he won the Nobel Peace Prize. He shaped Nixon's policies of détente, the secret bombing of Cambodia, and the 'decent interval' strategy.",
    image: "assets/sources/portraits/kissinger.jpg"
  },
  "ho chi minh": {
    name: "Ho Chi Minh",
    role: "President of North Vietnam & Revolutionary Leader",
    bio: "Vietnamese nationalist and communist leader who led the struggle for independence against French colonial forces (winning at Dien Bien Phu) and later directed the war against South Vietnam and the US to unify the nation.",
    image: "assets/sources/portraits/ho_chi_minh.jpg"
  },
  "linda brown": {
    name: "Linda Brown",
    role: "Civil Rights Activist & Student",
    bio: "A young Black student whose desire to attend her local white-only school led to the landmark 1954 Brown v. Topeka Supreme Court case, which ruled that segregated education was unconstitutional.",
    image: "assets/sources/portraits/linda_brown.jpg"
  },
  "emmett till": {
    name: "Emmett Till",
    role: "Civil Rights Catalyst",
    bio: "A 14-year-old boy brutally murdered in Mississippi in 1955. The acquittal of his killers by an all-white jury and his mother's decision to have an open-casket funeral highlighted the extreme violence of white supremacy.",
    image: "assets/sources/portraits/emmett_till.jpg"
  },
  "stokely carmichael": {
    name: "Stokely Carmichael",
    role: "Chairman of SNCC & Black Power Activist",
    bio: "Chairman of the Student Nonviolent Coordinating Committee (SNCC) who popularized the 'Black Power' slogan, rejected white assistance in the movement, and later joined the Black Panthers.",
    image: "assets/sources/portraits/stokely_carmichael.jpg"
  },
  "carmichael": {
    name: "Stokely Carmichael",
    role: "Chairman of SNCC & Black Power Activist",
    bio: "Chairman of the Student Nonviolent Coordinating Committee (SNCC) who popularized the 'Black Power' slogan, rejected white assistance in the movement, and later joined the Black Panthers.",
    image: "assets/sources/portraits/stokely_carmichael.jpg"
  },
  "thurgood marshall": {
    name: "Thurgood Marshall",
    role: "NAACP Lead Counsel & Supreme Court Justice",
    bio: "First Black Supreme Court Justice. As an NAACP lawyer, he successfully argued the historic Brown v. Board of Education (1954) case before the Supreme Court, dismantling the 'separate but equal' doctrine.",
    image: "assets/sources/portraits/thurgood_marshall.jpg"
  },
  "marshall": {
    name: "Thurgood Marshall",
    role: "NAACP Lead Counsel & Supreme Court Justice",
    bio: "First Black Supreme Court Justice. As an NAACP lawyer, he successfully argued the historic Brown v. Board of Education (1954) case before the Supreme Court, dismantling the 'separate but equal' doctrine.",
    image: "assets/sources/portraits/thurgood_marshall.jpg"
  },
  "huey p. newton": {
    name: "Huey P. Newton",
    role: "Co-Founder of the Black Panther Party",
    bio: "Co-founder of the militant Black Panther Party in 1966, which monitored police brutality and provided community aid like breakfast clubs while advocating for a socialist society.",
    image: "assets/sources/portraits/huey_newton.jpg"
  },
  "huey newton": {
    name: "Huey P. Newton",
    role: "Co-Founder of the Black Panther Party",
    bio: "Co-founder of the militant Black Panther Party in 1966, which monitored police brutality and provided community aid like breakfast clubs while advocating for a socialist society.",
    image: "assets/sources/portraits/huey_newton.jpg"
  },
  "bobby seale": {
    name: "Bobby Seale",
    role: "Co-Founder of the Black Panther Party",
    bio: "Co-founder of the militant Black Panther Party in 1966, which monitored police brutality and provided community aid like breakfast clubs while advocating for a socialist society.",
    image: "assets/sources/portraits/bobby_seale.jpg"
  },
  "seale": {
    name: "Bobby Seale",
    role: "Co-Founder of the Black Panther Party",
    bio: "Co-founder of the militant Black Panther Party in 1966, which monitored police brutality and provided community aid like breakfast clubs while advocating for a socialist society.",
    image: "assets/sources/portraits/bobby_seale.jpg"
  },
  "james farmer": {
    name: "James Farmer",
    role: "Co-Founder and Director of CORE",
    bio: "Civil rights activist and leader of the Congress of Racial Equality (CORE) who organized the Freedom Rides in 1961 to challenge segregation on interstate buses.",
    image: "assets/sources/portraits/james_farmer.jpg"
  },
  "jo ann robinson": {
    name: "Jo Ann Robinson",
    role: "Civil Rights Activist & Educator",
    bio: "Activist and member of the Women's Political Council (WPC) who printed and distributed thousands of leaflets calling for the Montgomery Bus Boycott following Rosa Parks' arrest.",
    image: "assets/sources/portraits/jo_ann_robinson.jpg"
  },
  "bull connor": {
    name: "Eugene 'Bull' Connor",
    role: "Birmingham Commissioner of Public Safety",
    bio: "Commissioner of Public Safety in Birmingham, Alabama, who used fire hoses and police dogs against nonviolent civil rights marchers, including children, in 1963.",
    image: "assets/sources/portraits/bull_connor.jpg"
  },
  "connor": {
    name: "Eugene 'Bull' Connor",
    role: "Birmingham Commissioner of Public Safety",
    bio: "Commissioner of Public Safety in Birmingham, Alabama, who used fire hoses and police dogs against nonviolent civil rights marchers, including children, in 1963.",
    image: "assets/sources/portraits/bull_connor.jpg"
  },
  "orval faubus": {
    name: "Orval Faubus",
    role: "Governor of Arkansas",
    bio: "Governor of Arkansas who used the National Guard to block the Little Rock Nine from entering Central High School in 1957.",
    image: "assets/sources/portraits/orval_faubus.jpg"
  },
  "faubus": {
    name: "Orval Faubus",
    role: "Governor of Arkansas",
    bio: "Governor of Arkansas who used the National Guard to block the Little Rock Nine from entering Central High School in 1957.",
    image: "assets/sources/portraits/orval_faubus.jpg"
  },
  "freedom summer workers": {
    name: "Freedom Summer Workers",
    role: "Civil Rights Activists",
    bio: "Activists (such as James Chaney, Andrew Goodman, and Michael Schwerner) murdered by the KKK in Mississippi in 1964 during a campaign to register Black voters.",
    image: "assets/sources/portraits/freedom_summer.jpg"
  },
  "freedom summer": {
    name: "Freedom Summer Workers",
    role: "Civil Rights Activists",
    bio: "Activists (such as James Chaney, Andrew Goodman, and Michael Schwerner) murdered by the KKK in Mississippi in 1964 during a campaign to register Black voters.",
    image: "assets/sources/portraits/freedom_summer.jpg"
  },
  "john carlos": {
    name: "John Carlos",
    role: "Olympic Athlete & Protester",
    bio: "Black American athlete who staged a silent protest against racial discrimination at the 1968 Olympics by raising a black-gloved fist during the medal ceremony.",
    image: "assets/sources/portraits/smith_carlos.jpg"
  },
  "tommie smith": {
    name: "Tommie Smith",
    role: "Olympic Athlete & Protester",
    bio: "Black American athlete who staged a silent protest against racial discrimination at the 1968 Olympics by raising a black-gloved fist during the medal ceremony.",
    image: "assets/sources/portraits/smith_carlos.jpg"
  },
  "eldridge cleaver": {
    name: "Eldridge Cleaver",
    role: "Black Panther Minister of Information",
    bio: "Early leader and Minister of Information for the Black Panthers, known for writing the book 'Soul on Ice'.",
    image: "assets/sources/portraits/eldridge_cleaver.jpg"
  },
  "cleaver": {
    name: "Eldridge Cleaver",
    role: "Black Panther Minister of Information",
    bio: "Early leader and Minister of Information for the Black Panthers, known for writing the book 'Soul on Ice'.",
    image: "assets/sources/portraits/eldridge_cleaver.jpg"
  },
  "jesse jackson": {
    name: "Jesse Jackson",
    role: "SCLC Activist & Politician",
    bio: "SCLC activist who worked alongside Martin Luther King Jr., founded Operation PUSH, and later ran for President.",
    image: "assets/sources/portraits/jesse_jackson.jpg"
  },
  "general giap": {
    name: "General Vo Nguyen Giap",
    role: "Commander of North Vietnamese PAVN Forces",
    bio: "Commander of the North Vietnamese forces (PAVN) who defeated the French at Dien Bien Phu and directed operations against South Vietnam and the US.",
    image: "assets/sources/portraits/general_giap.jpg"
  },
  "giap": {
    name: "General Vo Nguyen Giap",
    role: "Commander of North Vietnamese PAVN Forces",
    bio: "Commander of the North Vietnamese forces (PAVN) who defeated the French at Dien Bien Phu and directed operations against South Vietnam and the US.",
    image: "assets/sources/portraits/general_giap.jpg"
  },
  "william calley": {
    name: "William Calley",
    role: "US Army Lieutenant",
    bio: "US Army lieutenant convicted of murder for ordering the My Lai Massacre in March 1968, in which hundreds of Vietnamese civilians were killed.",
    image: "assets/sources/portraits/william_calley.jpg"
  },
  "calley": {
    name: "William Calley",
    role: "US Army Lieutenant",
    bio: "US Army lieutenant convicted of murder for ordering the My Lai Massacre in March 1968, in which hundreds of Vietnamese civilians were killed.",
    image: "assets/sources/portraits/william_calley.jpg"
  },
  "le duc tho": {
    name: "Le Duc Tho",
    role: "North Vietnamese Diplomat",
    bio: "North Vietnamese diplomat who negotiated the 1973 Paris Peace Accords with Henry Kissinger.",
    image: "assets/sources/portraits/le_duc_tho.jpg"
  },
  "nguyen van thieu": {
    name: "Nguyen Van Thieu",
    role: "President of South Vietnam (1967–1975)",
    bio: "President of South Vietnam from 1967 to 1975, who opposed the Paris Peace Accords and resigned shortly before the fall of Saigon.",
    image: "assets/sources/portraits/nguyen_van_thieu.jpg"
  },
  "thieu": {
    name: "Nguyen Van Thieu",
    role: "President of South Vietnam (1967–1975)",
    bio: "President of South Vietnam from 1967 to 1975, who opposed the Paris Peace Accords and resigned shortly before the fall of Saigon.",
    image: "assets/sources/portraits/nguyen_van_thieu.jpg"
  },
  "thich quang duc": {
    name: "Thich Quang Duc",
    role: "Buddhist Monk",
    bio: "Vietnamese Mahayana Buddhist monk who burned himself to death at a busy Saigon road intersection in 1963 to protest the persecution of Buddhists by Ngo Dinh Diem's regime.",
    image: "assets/sources/portraits/thich_quang_duc.jpg"
  },
  "bao dai": {
    name: "Emperor Bao Dai",
    role: "Last Emperor of Vietnam",
    bio: "The last emperor of Vietnam, who was appointed Chief of State of the State of Vietnam under the French and later deposed by Ngo Dinh Diem in a rigged referendum.",
    image: "assets/sources/portraits/bao_dai.jpg"
  },
  "creighton abrams": {
    name: "General Creighton Abrams",
    role: "Commander of US Forces in Vietnam (1968–1972)",
    bio: "US General who succeeded William Westmoreland as commander of US military forces in Vietnam in 1968, shifting strategy towards 'One War' to secure rural areas.",
    image: "assets/sources/portraits/creighton_abrams.jpg"
  },
  "abrams": {
    name: "General Creighton Abrams",
    role: "Commander of US Forces in Vietnam (1968–1972)",
    bio: "US General who succeeded William Westmoreland as commander of US military forces in Vietnam in 1968, shifting strategy towards 'One War' to secure rural areas.",
    image: "assets/sources/portraits/creighton_abrams.jpg"
  },
  "norodom sihanouk": {
    name: "Norodom Sihanouk",
    role: "King/Prince of Cambodia",
    bio: "King/Prince of Cambodia who maintained Cambodian neutrality during the Vietnam War, was overthrown by Lon Nol in 1970, and allied with the Khmer Rouge.",
    image: "assets/sources/portraits/norodom_sihanouk.jpg"
  },
  "sihanouk": {
    name: "Norodom Sihanouk",
    role: "King/Prince of Cambodia",
    bio: "King/Prince of Cambodia who maintained Cambodian neutrality during the Vietnam War, was overthrown by Lon Nol in 1970, and allied with the Khmer Rouge.",
    image: "assets/sources/portraits/norodom_sihanouk.jpg"
  },
  "lon nol": {
    name: "Lon Nol",
    role: "President of the Khmer Republic",
    bio: "General who led the 1970 coup overthrowing Norodom Sihanouk, establishing the Khmer Republic, and aligning Cambodia with the United States.",
    image: "assets/sources/portraits/lon_nol.jpg"
  },
  "pol pot": {
    name: "Pol Pot",
    role: "Leader of the Khmer Rouge",
    bio: "Leader of the radical communist Khmer Rouge faction in Cambodia, responsible for the societal holocaust known as the 'Killing Fields'.",
    image: "assets/sources/portraits/pol_pot.jpg"
  },
  "harry s. truman": {
    name: "Harry S. Truman",
    role: "33rd President of the United States (1945–1953)",
    bio: "Initiated the Cold War policy of containment (the Truman Doctrine) and provided billions of dollars in military aid to help the French fight the Vietminh in Indochina.",
    image: "assets/sources/portraits/truman.jpg"
  },
  "truman": {
    name: "Harry S. Truman",
    role: "33rd President of the United States (1945–1953)",
    bio: "Initiated the Cold War policy of containment (the Truman Doctrine) and provided billions of dollars in military aid to help the French fight the Vietminh in Indochina.",
    image: "assets/sources/portraits/truman.jpg"
  },
  "gerald ford": {
    name: "Gerald Ford",
    role: "38th President of the United States (1974–1977)",
    bio: "Succeeded Nixon following his resignation, overseeing the final collapse of South Vietnam and the evacuation of Saigon in 1975 after Congress refused to provide further military assistance.",
    image: "assets/sources/portraits/ford.jpg"
  },
  "ford": {
    name: "Gerald Ford",
    role: "38th President of the United States (1974–1977)",
    bio: "Succeeded Nixon following his resignation, overseeing the final collapse of South Vietnam and the evacuation of Saigon in 1975 after Congress refused to provide further military assistance.",
    image: "assets/sources/portraits/ford.jpg"
  }
};

function showFigureBioModal(figureKey) {
  const figure = KEY_FIGURES_BIO[figureKey];
  if (!figure) return;

  AudioEngine.play('flip');

  let modal = document.getElementById('timeline-bio-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'timeline-bio-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px; box-sizing: border-box;';
    document.body.appendChild(modal);
  }

  // Parse initials from name
  const parenMatch = figure.name.match(/\(([^)]+)\)/);
  let initials = '';
  if (parenMatch) {
    initials = parenMatch[1].toUpperCase();
  } else {
    const cleanName = figure.name.replace(/Jr\.|Chief Justice|General|Dr\./gi, '').trim();
    const parts = cleanName.split(/\s+/).filter(p => p.length > 0);
    if (parts.length >= 3) {
      initials = (parts[0][0] + parts[1][0] + parts[2][0]).toUpperCase();
    } else if (parts.length === 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1) {
      initials = parts[0].substring(0, 2).toUpperCase();
    }
  }
  initials = initials.substring(0, 3);

  modal.innerHTML = `
    <div class="bio-modal-card" style="background: var(--bg-sidebar); border: 2px solid var(--accent); border-radius: var(--border-radius-lg); width: 100%; max-width: 480px; padding: 24px; box-shadow: var(--shadow-lg); animation: scaleIn 0.3s ease-out; position: relative; color: var(--text-main); box-sizing: border-box;">
      <button id="btn-close-bio-modal" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; transition: color 0.2s;"><i class="fa-solid fa-xmark"></i></button>
      
      <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
        <div style="width: 70px; height: 70px; border-radius: 50%; border: 2px solid var(--accent); flex-shrink: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; background: var(--gradient-primary); box-shadow: var(--shadow-sm);">
          ${figure.image ? `
            <img src="${figure.image}" alt="${figure.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <span style="display: none; font-size: 1.4rem; font-weight: 800; color: #fff; font-family: var(--font-heading); text-shadow: 0 1px 3px rgba(0,0,0,0.3);">${initials}</span>
          ` : `
            <span style="font-size: 1.4rem; font-weight: 800; color: #fff; font-family: var(--font-heading); text-shadow: 0 1px 3px rgba(0,0,0,0.3);">${initials}</span>
          `}
        </div>
        <div>
          <h3 style="margin: 0; font-family: var(--font-heading); color: var(--text-main); font-size: 1.25rem; font-weight: 700; letter-spacing: -0.2px;">${figure.name}</h3>
          <span style="font-size: 0.82rem; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; margin-top: 2px;">${figure.role}</span>
        </div>
      </div>
      
      <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-main); margin-bottom: 24px; border-top: 1px solid var(--border-glass); padding-top: 16px; box-sizing: border-box;">
        <strong style="color: var(--accent); display: block; margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">GCSE Biography & Significance:</strong>
        <p style="margin: 0; font-style: normal; color: var(--text-main); font-weight: 400; line-height: 1.6;">${figure.bio}</p>
      </div>
      
      <button id="btn-ok-bio-modal" class="mastery-btn" style="width: 100%; justify-content: center; background: var(--gradient-primary); border: none; color: white; padding: 12px; font-weight: bold; border-radius: var(--border-radius-sm); cursor: pointer; transition: transform 0.2s, opacity 0.2s;">Got it!</button>
    </div>
  `;

  if (!document.getElementById('bio-modal-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'bio-modal-styles';
    styleEl.textContent = `
      @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      #btn-close-bio-modal:hover {
        color: var(--accent) !important;
      }
      #btn-ok-bio-modal:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
    `;
    document.head.appendChild(styleEl);
  }

  modal.style.display = 'flex';

  const close = () => {
    modal.style.display = 'none';
  };

  document.getElementById('btn-close-bio-modal').addEventListener('click', close);
  document.getElementById('btn-ok-bio-modal').addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
}

// 6. Timeline View Assembly
function renderTimelineView() {
  const wrapper = document.getElementById('timeline-items-wrapper');
  wrapper.innerHTML = '';
  
  const eraFilter = document.getElementById('timeline-era-select').value;
  const searchInput = document.getElementById('timeline-search-input');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  let questions = [...state.allQuestions];
  
  if (eraFilter !== 'all') {
    questions = questions.filter(q => q.topicId === eraFilter);
  }
  
  if (query) {
    questions = questions.filter(q => {
      return (
        q.question.toLowerCase().includes(query) ||
        q.answer.toLowerCase().includes(query) ||
        (q.explanation && q.explanation.toLowerCase().includes(query)) ||
        String(q.year).includes(query)
      );
    });
  }
  
  const peopleToggle = document.getElementById('timeline-people-toggle');
  const peopleOnly = peopleToggle && peopleToggle.classList.contains('active');
  if (peopleOnly) {
    const figureKeys = Object.keys(KEY_FIGURES_BIO);
    questions = questions.filter(q => {
      const textToSearch = `${q.question} ${q.answer} ${q.explanation || ''}`.toLowerCase();
      return figureKeys.some(key => textToSearch.includes(key));
    });
  }
  
  // Sort chronologically by year ascending
  questions.sort((a, b) => a.year - b.year);
  
  // Reset matched status of timeline images to prevent duplication
  TIMELINE_IMAGES.forEach(ti => ti.used = false);
  
  document.getElementById('timeline-count-display').textContent = `${questions.length} chronological milestones mapped`;
  
  if (questions.length === 0) {
    wrapper.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-timeline"></i>
        <h3>No milestones found</h3>
      </div>
    `;
    return;
  }
  
  questions.forEach(q => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    
    let topicName = "Key Topic 1";
    if (q.topicId === 'topic_2') topicName = "Key Topic 2";
    if (q.topicId === 'topic_3') topicName = "Key Topic 3";
    if (q.topicId === 'topic_4') topicName = "Key Topic 4";

    const textToSearch = `${q.question} ${q.answer} ${q.explanation || ''}`.toLowerCase();
    
    // Check for timeline visual source
    let visualHtml = '';
    const matchedImg = TIMELINE_IMAGES.find(ti => !ti.used && ti.keywords.some(kw => textToSearch.includes(kw)));
    if (matchedImg) {
      matchedImg.used = true;
      visualHtml = `
        <div class="timeline-image-wrapper" style="margin-top: 10px; margin-bottom: 8px; border-radius: var(--border-radius-sm); overflow: hidden; background: #000; max-height: 200px; display: flex; align-items: center; justify-content: center;">
          <img src="${matchedImg.image}" alt="Visual Source" style="max-width: 100%; max-height: 200px; object-fit: contain; opacity: 0.9;">
        </div>
        <div class="timeline-image-provenance" style="font-size: 0.75rem; color: #cbd5e1; font-weight: 500; background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); padding: 8px 10px; border-radius: 4px; margin-bottom: 10px; line-height: 1.4; box-sizing: border-box;">
          <strong style="color: inherit;">Source Provenance:</strong> ${matchedImg.provenance}
        </div>
      `;
    }

    // Check for key figures
    let figureButtonsHtml = '';
    const figureKeys = Object.keys(KEY_FIGURES_BIO);
    const matchedFigures = new Set();
    
    figureKeys.forEach(key => {
      if (textToSearch.includes(key)) {
        matchedFigures.add(KEY_FIGURES_BIO[key].name);
      }
    });

    let buttons = '';
    let keyFigureIndicator = '';
    if (matchedFigures.size > 0) {
      buttons = Array.from(matchedFigures).map(name => {
        const key = figureKeys.find(k => KEY_FIGURES_BIO[k].name === name);
        return `<button class="timeline-bio-btn" data-figure="${key}" style="margin-right: 6px; margin-top: 6px; padding: 4px 10px; font-size: 0.72rem; border-radius: 12px; background: rgba(245, 158, 11, 0.1); border: 1px solid var(--accent); color: var(--accent); font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-user-graduate"></i> Figure: ${name}</button>`;
      }).join('');
      keyFigureIndicator = `<span class="timeline-badge-keyfigure"><i class="fa-solid fa-user-graduate"></i> Key Figure: ${Array.from(matchedFigures).join(', ')}</span>`;
    }
    
    const lessonButton = `<button class="timeline-lesson-btn" data-subtopic="${q.subtopicId}" style="margin-right: 6px; margin-top: 6px; padding: 4px 10px; font-size: 0.72rem; border-radius: 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid var(--primary); color: var(--primary); font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-book-open"></i> Go to Lesson</button>`;
    const combinedButtonsHtml = `<div class="timeline-buttons-row" style="margin-top: 8px; display: flex; flex-wrap: wrap;">${lessonButton}${buttons}</div>`;
    
    item.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-year">${q.year}</div>
      <div class="timeline-content-card" style="cursor: pointer;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
          <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px;">
            <span>${topicName}</span>
            ${keyFigureIndicator}
          </span>
          <span class="badge ${q.type === 'standard' ? 'badge-standard' : 'badge-depth'}">${q.type === 'standard' ? 'Standard' : 'Top Tier Trivia'}</span>
        </div>
        <div class="timeline-q-title" style="font-weight: bold; line-height: 1.4;">${q.question}</div>
        
        <div class="timeline-reveal-panel">
          ${visualHtml}
          <div class="timeline-a-box" style="margin-top: 8px;">
            <div class="timeline-a-text" style="color: var(--primary); font-weight: bold;">${q.answer}</div>
            <p class="timeline-exp" style="margin-top: 4px; font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">${q.explanation}</p>
          </div>
        </div>
        ${combinedButtonsHtml}
      </div>
    `;
    
    const card = item.querySelector('.timeline-content-card');
    card.addEventListener('click', (e) => {
      if (e.target.closest('.timeline-bio-btn') || e.target.closest('.timeline-lesson-btn')) return;
      AudioEngine.play('click');
      card.classList.toggle('revealed');
    });

    const bioBtns = item.querySelectorAll('.timeline-bio-btn');
    bioBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const figKey = btn.getAttribute('data-figure');
        showFigureBioModal(figKey);
      });
    });

    const lessonBtns = item.querySelectorAll('.timeline-lesson-btn');
    lessonBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        AudioEngine.play('click');
        const subtopicId = btn.getAttribute('data-subtopic');
        switchView('subtopic', subtopicId);
      });
    });
    
    wrapper.appendChild(item);
  });

  // Wrap all timeline images in links to open in a new tab for high-res inspection
  wrapper.querySelectorAll('img').forEach(img => {
    if (img.parentElement.tagName !== 'A') {
      const webUrl = getImageWebLink(img.getAttribute('src'), img.getAttribute('alt'));
      const link = document.createElement('a');
      link.href = webUrl;
      link.target = '_blank';
      link.style.display = 'block';
      link.style.cursor = 'zoom-in';
      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
    }
  });
}


function evaluateStudentAnswer(type, questionObj, userAnswer) {
  const cleanAns = (userAnswer || "").trim().toLowerCase();
  const wordCount = cleanAns.split(/\s+/).filter(w => w.length > 0).length;
  
  let scoreRules = [false, false, false, false];
  let feedbackHtml = "";

  const localExtractKeywords = (text) => {
    if (!text) return [];
    const regex = /[A-Z][a-z]+/g;
    const candidates = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      const term = match[0].trim();
      if (!candidates.includes(term)) {
        candidates.push(term);
      }
    }
    const stopWords = ['One', 'This', 'The', 'Following', 'Point', 'It', 'By', 'In', 'Explain', 'Both', 'To', 'USA', 'US', 'Vietnam', 'American', 'Black', 'White', 'Southern', 'North', 'South', 'Vietcong', 'President', 'Court', 'Source', 'Sources', 'Interpretation', 'Interpretations', 'History', 'Historian'];
    return candidates.filter(term => !stopWords.includes(term)).slice(0, 5);
  };

  if (type === 'q1') {
    // Q1 is now MCQ checkboxes evaluated directly in the layout click handler.
    // This is a fallback to avoid errors.
    scoreRules[0] = true;
    scoreRules[1] = true;
    feedbackHtml = `<span style="color: var(--success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Correct!</span> both inferences are supported.`;
  } else if (type === 'q2') {
    // Q2 causation essay
    const paragraphs = (userAnswer || "").split(/\n+/).map(p => p.trim()).filter(p => p.length > 20);
    const keywords = questionObj.knowledgeWords || questionObj.keywords || [];
    const matchedKeywords = keywords.filter(kw => cleanAns.includes(kw.toLowerCase()));
    
    let connectives = ["because", "led to", "resulted in", "caused", "consequently", "therefore", "as a result", "due to", "this meant that"];
    if (questionObj.connectiveWords && questionObj.connectiveWords.length > 0) {
      connectives = questionObj.connectiveWords;
    }
    const matchedConnectives = connectives.filter(c => cleanAns.includes(c.toLowerCase()));

    scoreRules[0] = paragraphs.length >= 3;
    scoreRules[1] = matchedKeywords.length >= 3 || wordCount >= 100;
    scoreRules[2] = matchedConnectives.length >= 2;

    const missed = [];
    if (!scoreRules[0]) missed.push("Structure your essay into at least 3 distinct paragraphs, explaining separate causes.");
    if (!scoreRules[1]) missed.push("Incorporate more precise own knowledge and historical facts beyond the stimulus points.");
    if (!scoreRules[2]) missed.push("Use causal connectives (e.g., 'as a result', 'consequently', 'led to') to show clear analysis.");

    if (missed.length === 0) {
      feedbackHtml = `<span style="color: var(--success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Outstanding Causation Essay!</span> Well structured, analytical, and highly detailed.`;
    } else {
      feedbackHtml = `<strong style="color: var(--accent); display: block; margin-bottom: 6px;"><i class="fa-solid fa-triangle-exclamation"></i> Examiner Feedback & Recommendations:</strong>
      <ul style="margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px;">
        ${missed.map(m => `<li>${m}</li>`).join('')}
      </ul>`;
    }
  } else if (type === 'q3a') {
    // Q3a Source Utility
    const mentionsB = cleanAns.includes("source b");
    const mentionsC = cleanAns.includes("source c");
    
    const provenanceTerms = ["provenance", "purpose", "written by", "reliable", "unreliable", "limitation", "bias", "useful because", "origin", "context"];
    const matchedProv = provenanceTerms.filter(pt => cleanAns.includes(pt));

    const judgementTerms = ["useful", "utility", "valuable", "enquiry", "judgment", "judgement", "extent"];
    const matchedJudgement = judgementTerms.filter(jt => cleanAns.includes(jt));

    const keywords = localExtractKeywords(questionObj.modela || "");
    const matchedKeywords = keywords.filter(kw => cleanAns.includes(kw.toLowerCase()));

    scoreRules[0] = mentionsB && mentionsC;
    scoreRules[1] = matchedProv.length >= 2;
    scoreRules[2] = matchedKeywords.length >= 2 || wordCount >= 80;
    scoreRules[3] = matchedJudgement.length >= 1;

    const missed = [];
    if (!scoreRules[0]) missed.push("Make sure you evaluate both Source B and Source C separately.");
    if (!scoreRules[1]) missed.push("Explicitly evaluate the provenance (who, when, why, reliability/limitations) of both sources.");
    if (!scoreRules[2]) missed.push("Inject specific own knowledge to verify the accuracy or context of the sources.");
    if (!scoreRules[3]) missed.push("Ensure you make a clear judgement on how useful the sources are for the specific enquiry.");

    if (missed.length === 0) {
      feedbackHtml = `<span style="color: var(--success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Highly Useful Analysis!</span> You balanced content, context, and provenance.`;
    } else {
      feedbackHtml = `<strong style="color: var(--accent); display: block; margin-bottom: 6px;"><i class="fa-solid fa-triangle-exclamation"></i> Examiner Feedback & Recommendations:</strong>
      <ul style="margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px;">
        ${missed.map(m => `<li>${m}</li>`).join('')}
      </ul>`;
    }
  } else if (type === 'q3d') {
    // Q3d essay
    const mentionsInt1 = cleanAns.includes("interpretation 1") || cleanAns.includes("int 1") || cleanAns.includes("levy");
    const mentionsInt2 = cleanAns.includes("interpretation 2") || cleanAns.includes("int 2") || cleanAns.includes("zinn");

    const debateTerms = ["agree", "disagree", "however", "on the other hand", "although", "while", "contrast", "alternative"];
    const matchedDebate = debateTerms.filter(dt => cleanAns.includes(dt));

    const judgementTerms = ["overall", "conclusion", "conclude", "judgement", "judgment", "extent"];
    const matchedJudgement = judgementTerms.filter(jt => cleanAns.includes(jt));

    const keywords = localExtractKeywords(questionObj.modeld || "");
    const matchedKeywords = keywords.filter(kw => cleanAns.includes(kw.toLowerCase()));

    scoreRules[0] = mentionsInt1 && mentionsInt2;
    scoreRules[1] = matchedKeywords.length >= 2 || wordCount >= 120;
    scoreRules[2] = matchedDebate.length >= 2;
    scoreRules[3] = matchedJudgement.length >= 1;

    const missed = [];
    if (!scoreRules[0]) missed.push("You must address and compare the arguments of BOTH Interpretation 1 and Interpretation 2.");
    if (!scoreRules[1]) missed.push("Support your arguments with detailed own historical knowledge.");
    if (!scoreRules[2]) missed.push("Structure your essay into a balanced debate, presenting points to both agree and disagree.");
    if (!scoreRules[3]) missed.push("Conclude with a clear, justified judgment of how far you agree with the focus interpretation.");

    if (missed.length === 0) {
      feedbackHtml = `<span style="color: var(--success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Masterful Evaluation!</span> Your essay is balanced, detailed, and culminates in a supported judgement.`;
    } else {
      feedbackHtml = `<strong style="color: var(--accent); display: block; margin-bottom: 6px;"><i class="fa-solid fa-triangle-exclamation"></i> Examiner Feedback & Recommendations:</strong>
      <ul style="margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px;">
        ${missed.map(m => `<li>${m}</li>`).join('')}
      </ul>`;
    }
  }

  return { scores: scoreRules, feedback: feedbackHtml, keywords: questionObj.keywords || [], matchedKeywords: [] };
}

// 7. Bookmarks Deck Rendering
function renderBookmarksView() {
  const container = document.getElementById('bookmarks-list-container');
  container.innerHTML = '';
  
  const bookmarkedQs = state.allQuestions.filter(q => state.bookmarks.includes(q.id));
  
  if (bookmarkedQs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-star" style="color: var(--scrollbar-thumb);"></i>
        <h3>No bookmarked cards</h3>
        <p>Click the star icon in Accordions or Flashcards to compile a custom deck of hard questions here.</p>
      </div>
    `;
    return;
  }
  
  bookmarkedQs.forEach((q, idx) => {
    const isMastered = !!state.mastery[q.id];
    
    const details = document.createElement('details');
    details.className = 'quiz-card-details';
    
    details.innerHTML = `
      <summary class="quiz-card-summary">
        <div class="summary-content">
          <span class="summary-num">${idx + 1}</span>
          <span class="summary-text">${q.question}</span>
        </div>
        <div class="summary-badges">
          <span class="badge ${q.type === 'standard' ? 'badge-standard' : 'badge-depth'}">${q.type === 'standard' ? 'Standard' : 'Top Tier Trivia'}</span>
          <span class="badge badge-year">${q.year}</span>
          <div class="bookmark-icon-container bookmarked" data-qid="${q.id}" title="Remove Bookmark">
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="mastery-checkbox-container ${isMastered ? 'mastered' : ''}" data-qid="${q.id}" title="Mark as Mastered">
            <i class="fa-solid fa-check"></i>
          </div>
          <i class="fa-solid fa-chevron-down summary-arrow"></i>
        </div>
      </summary>
      <div class="details-content">
        <div class="answer-header">
          <i class="fa-solid fa-circle-check"></i> Correct Key Term
        </div>
        <div class="answer-value">${q.answer}</div>
        <div class="explanation-value">${q.explanation}</div>
      </div>
    `;
    
    details.querySelector('.bookmark-icon-container').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBookmark(q.id);
      renderBookmarksView(); // Refresh layout immediately
    });
    
    const checkBtn = details.querySelector('.mastery-checkbox-container');
    checkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nextState = !checkBtn.classList.contains('mastered');
      setMastered(q.id, nextState);
      checkBtn.classList.toggle('mastered', nextState);
      if (nextState) AudioEngine.play('success');
      else AudioEngine.play('click');
    });

    details.addEventListener('toggle', () => {
      if (details.open) {
        AudioEngine.play('flip');
      }
    });
    
    container.appendChild(details);
  });
}

// --- Mastery Match Game Implementation ---

// Spaced Repetition Storage Helpers
function getMissedTerms() {
  try {
    const list = localStorage.getItem('antigravity_mastery_missed_terms');
    return list ? JSON.parse(list) : [];
  } catch (e) {
    return [];
  }
}

function recordMissedTerm(term) {
  try {
    const list = getMissedTerms();
    if (!list.includes(term)) {
      list.push(term);
      localStorage.setItem('antigravity_mastery_missed_terms', JSON.stringify(list));
    }
  } catch (e) {}
}

function resolveMissedTerm(term) {
  try {
    let list = getMissedTerms();
    list = list.filter(t => t !== term);
    localStorage.setItem('antigravity_mastery_missed_terms', JSON.stringify(list));
  } catch (e) {}
}

// Gameplay State
let masteryState = {
  unitId: null,
  items: [],
  selectedTermCard: null,
  selectedDefCard: null,
  score: 0,
  timerVal: 60,
  timerInterval: null,
  isSpeedRun: false,
  matchedCount: 0
};

function getHighScores(unitId) {
  const key = `mastery_highscores_${unitId}`;
  let scores = localStorage.getItem(key);
  if (!scores) {
    scores = [
      { name: "Alex", yearGroup: "Year 9", score: 45, date: "2026-05-28" },
      { name: "Sarah", yearGroup: "Year 10", score: 40, date: "2026-05-29" },
      { name: "James", yearGroup: "Year 8", score: 35, date: "2026-05-27" },
      { name: "Emily", yearGroup: "Year 11", score: 25, date: "2026-05-29" },
      { name: "Thomas", yearGroup: "Year 7", score: 15, date: "2026-05-26" }
    ];
    localStorage.setItem(key, JSON.stringify(scores));
  } else {
    scores = JSON.parse(scores);
  }
  return scores.sort((a, b) => b.score - a.score).slice(0, 5);
}

function saveHighScoreLocal(unitId, name, yearGroup, score) {
  const scores = getHighScores(unitId);
  const dateStr = new Date().toISOString().split('T')[0];
  scores.push({ name: name || "Anonymous", yearGroup: yearGroup || "", score: score, date: dateStr });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem(`mastery_highscores_${unitId}`, JSON.stringify(scores.slice(0, 5)));
}

function renderMasteryLeaderboard(unitId) {
  const container = document.getElementById('mastery-leaderboard-container');
  if (!container) return;

  const localScores = getHighScores(unitId);
  renderTable(localScores);

  if (GOOGLE_SHEET_WEBAPP_URL) {
    fetch(`${GOOGLE_SHEET_WEBAPP_URL}?type=mastery&unitId=${unitId}`)
      .then(res => res.json())
      .then(scores => {
        if (Array.isArray(scores)) {
          renderTable(scores);
        }
      })
      .catch(err => console.error("Error loading remote mastery leaderboard:", err));
  }

  function renderTable(scoresList) {
    let rowsHtml = scoresList.map((s, idx) => {
      let medal = '';
      if (idx === 0) medal = '🥇 ';
      else if (idx === 1) medal = '🥈 ';
      else if (idx === 2) medal = '🥉 ';
      
      const yrText = s.yearGroup ? ` <span style="font-size: 0.72rem; color: var(--text-muted);">(${s.yearGroup})</span>` : '';
      return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.82rem;">
          <td style="padding: 8px 4px; font-weight: bold; color: var(--primary);">${medal}${idx + 1}</td>
          <td style="padding: 8px 4px; color: var(--text-main);">${s.name}${yrText}</td>
          <td style="padding: 8px 4px; font-weight: 700; color: var(--success); text-align: right;">${s.score} pts</td>
          <td style="padding: 8px 4px; color: var(--text-muted); text-align: right; font-size: 0.72rem;">${s.date}</td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-glass);">
        <h4 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin: 0 0 12px 0; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-ranking-star" style="color: var(--accent);"></i> Top High Scores (Unit Leaderboard)
        </h4>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-glass); color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">
              <th style="padding: 4px; font-weight: 600;">Rank</th>
              <th style="padding: 4px; font-weight: 600;">Student</th>
              <th style="padding: 4px; font-weight: 600; text-align: right;">Score</th>
              <th style="padding: 4px; font-weight: 600; text-align: right;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }
}

function renderResultsLeaderboard(unitId) {
  const container = document.getElementById('mastery-results-leaderboard');
  if (!container) return;
  
  const localScores = getHighScores(unitId);
  renderResults(localScores);

  if (GOOGLE_SHEET_WEBAPP_URL) {
    fetch(`${GOOGLE_SHEET_WEBAPP_URL}?type=mastery&unitId=${unitId}`)
      .then(res => res.json())
      .then(scores => {
        if (Array.isArray(scores)) {
          renderResults(scores);
        }
      })
      .catch(err => console.error("Error loading remote mastery results leaderboard:", err));
  }

  function renderResults(scoresList) {
    let rowsHtml = scoresList.map((s, idx) => {
      let medal = '';
      if (idx === 0) medal = '🥇 ';
      else if (idx === 1) medal = '🥈 ';
      else if (idx === 2) medal = '🥉 ';
      const yrText = s.yearGroup ? ` <span style="font-size: 0.72rem; color: var(--text-muted);">(${s.yearGroup})</span>` : '';
      return `
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
          <span style="color: var(--primary); font-weight: bold;">${medal}${idx + 1}. ${s.name}${yrText}</span>
          <span style="color: var(--success); font-weight: 700;">${s.score} pts</span>
        </div>
      `;
    }).join('');
    container.innerHTML = `
      <h4 style="font-family: var(--font-heading); font-size: 0.88rem; margin: 12px 0 8px; color: var(--text-main); text-align: left;">
        <i class="fa-solid fa-ranking-star" style="color: var(--accent);"></i> Leaderboard Rankings:
      </h4>
      <div style="text-align: left; background: rgba(0,0,0,0.1); padding: 8px 12px; border-radius: 4px; border: 1px solid var(--border-glass);">
        ${rowsHtml}
      </div>
    `;
  }
}

// --- Decision Simulator Game ---
function initDecisionsGame() {
  const container = document.getElementById('decisions-game-play-area');
  if (!container) return;

  const hotlineGames = DECISIONS_DATA.filter(g => g.series === "Presidential Hotline");
  const tacticsGames = DECISIONS_DATA.filter(g => g.series === "Perspectives & Tactics");

  const makeCard = (g) => `
    <div class="decision-card" id="dec-card-${g.id}">
      <div class="decision-card-header">
        <span class="decision-card-topic">${g.topic}</span>
        <i class="${g.icon}" style="font-size: 1.1rem; color: var(--primary);"></i>
      </div>
      <h4 class="decision-card-title">${g.title}</h4>
      <div class="decision-card-role"><strong>Role:</strong> ${g.role}</div>
      <p style="font-size: 0.8rem; line-height: 1.4; color: var(--text-muted); margin: 6px 0 0 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
        ${g.crisis}
      </p>
    </div>
  `;

  container.innerHTML = `
    <div class="causal-connector-container" style="background: var(--bg-card); padding: 24px; border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); box-shadow: var(--shadow-md); margin-bottom: 24px;">
      <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-top: 0; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-phone-volume" style="color: var(--primary);"></i> Decision Simulator
      </h3>
      <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 20px 0;">
        Put yourself in the shoes of historical figures. Face critical crises and decide which path to take!
      </p>
      
      <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: var(--accent); margin: 20px 0 10px 0;">
        📞 The 'Presidential Hotline' Series
      </h4>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 12px 0;">Oval Office decisions during major civil rights and Cold War turning points.</p>
      <div class="decisions-grid" style="margin-bottom: 30px;">
        ${hotlineGames.map(makeCard).join('')}
      </div>

      <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: var(--secondary); margin: 20px 0 10px 0;">
        🪖 The 'Perspectives & Tactics' Series
      </h4>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 12px 0;">Tactical choices on the ground, guerrilla warfare dilemmas, and media exposure debates.</p>
      <div class="decisions-grid">
        ${tacticsGames.map(makeCard).join('')}
      </div>
    </div>
  `;

  DECISIONS_DATA.forEach(g => {
    const card = document.getElementById(`dec-card-${g.id}`);
    if (card) {
      card.addEventListener('click', () => {
        AudioEngine.play('click');
        playDecisionsScenario(g.id);
      });
    }
  });
}

function playDecisionsScenario(gameId) {
  const container = document.getElementById('decisions-game-play-area');
  if (!container) return;

  const g = DECISIONS_DATA.find(x => x.id === gameId);
  if (!g) return;

  container.innerHTML = `
    <div class="decision-play-pane">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">
        <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--primary); letter-spacing: 0.5px;">Phase 1: Initial Response</span>
        <button class="btn-secondary" id="btn-dec-back" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 4px;">
          <i class="fa-solid fa-arrow-left"></i> Scenario Menu
        </button>
      </div>

      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 10px 0 0 0;">
        ${g.title}
      </h2>
      
      <div class="decision-role-banner">
        <strong>Active Role:</strong> ${g.role}
      </div>

      <div class="decision-crisis-box">
        <h4 style="font-family: var(--font-heading); font-size: 1rem; font-weight: 700; color: var(--accent); margin-top: 0; margin-bottom: 8px;">
          🚨 THE CRISIS:
        </h4>
        ${g.crisis}
      </div>

      <div style="margin-top: 10px;">
        <h4 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 12px;">
          Select Your Response:
        </h4>
        <div class="decision-options-container">
          <button class="btn-decision" id="btn-dec-choice-a">
            <span class="btn-decision-label">Choice A</span>
            <span>${g.phase1.choiceA.text}</span>
          </button>
          <button class="btn-decision" id="btn-dec-choice-b">
            <span class="btn-decision-label">Choice B</span>
            <span>${g.phase1.choiceB.text}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-dec-back').addEventListener('click', () => {
    AudioEngine.play('click');
    initDecisionsGame();
  });

  document.getElementById('btn-dec-choice-a').addEventListener('click', () => {
    AudioEngine.play('click');
    playDecisionsPhase2(gameId, 'A');
  });

  document.getElementById('btn-dec-choice-b').addEventListener('click', () => {
    AudioEngine.play('click');
    playDecisionsPhase2(gameId, 'B');
  });
}

function playDecisionsPhase2(gameId, choiceLetter) {
  const container = document.getElementById('decisions-game-play-area');
  if (!container) return;

  const g = DECISIONS_DATA.find(x => x.id === gameId);
  if (!g) return;

  const selectedChoice = choiceLetter === 'A' ? g.phase1.choiceA : g.phase1.choiceB;

  container.innerHTML = `
    <div class="decision-play-pane">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">
        <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--primary); letter-spacing: 0.5px;">Phase 2: The Fallout</span>
        <button class="btn-secondary" id="btn-dec-back" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 4px;">
          <i class="fa-solid fa-arrow-left"></i> Scenario Menu
        </button>
      </div>

      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 10px 0 0 0;">
        ${g.title}
      </h2>
      
      <div class="decision-role-banner">
        <strong>Active Role:</strong> ${g.role}
      </div>

      <div style="background: rgba(0,0,0,0.12); border: 1px solid var(--border-glass); padding: 12px; border-radius: var(--border-radius-sm); font-size: 0.88rem; color: var(--text-muted); line-height: 1.45;">
        <strong>Your Choice:</strong> ${selectedChoice.text}
      </div>

      <div class="decision-crisis-box" style="border-left-color: var(--secondary);">
        <h4 style="font-family: var(--font-heading); font-size: 1rem; font-weight: 700; color: var(--secondary); margin-top: 0; margin-bottom: 8px;">
          🌪️ THE FALLOUT:
        </h4>
        ${selectedChoice.fallout}
      </div>

      <div style="margin-top: 10px;">
        <h4 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 12px;">
          Select Your Next Step:
        </h4>
        <div class="decision-options-container">
          <button class="btn-decision" id="btn-dec-subchoice-1">
            <span class="btn-decision-label">Choice ${choiceLetter}1</span>
            <span>${selectedChoice.choice1.text}</span>
          </button>
          <button class="btn-decision" id="btn-dec-subchoice-2">
            <span class="btn-decision-label">Choice ${choiceLetter}2</span>
            <span>${selectedChoice.choice2.text}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-dec-back').addEventListener('click', () => {
    AudioEngine.play('click');
    initDecisionsGame();
  });

  document.getElementById('btn-dec-subchoice-1').addEventListener('click', () => {
    playDecisionsPhase3(gameId, choiceLetter, '1');
  });

  document.getElementById('btn-dec-subchoice-2').addEventListener('click', () => {
    playDecisionsPhase3(gameId, choiceLetter, '2');
  });
}

function playDecisionsPhase3(gameId, choiceLetter, subChoice) {
  const container = document.getElementById('decisions-game-play-area');
  if (!container) return;

  const g = DECISIONS_DATA.find(x => x.id === gameId);
  if (!g) return;

  const selectedChoice = choiceLetter === 'A' ? g.phase1.choiceA : g.phase1.choiceB;
  const finalChoice = subChoice === '1' ? selectedChoice.choice1 : selectedChoice.choice2;

  if (finalChoice.isHistorical) {
    AudioEngine.play('success');
    Confetti.spawn(60);
  } else {
    AudioEngine.play('fail');
  }

  const bgCol = finalChoice.isHistorical ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)';
  const borderCol = finalChoice.isHistorical ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)';
  const pillCol = finalChoice.isHistorical ? 'var(--success)' : 'var(--accent)';
  const pillText = finalChoice.isHistorical ? '✅ ACTUAL HISTORY' : '❌ ALTERNATE HISTORY';

  container.innerHTML = `
    <div class="decision-play-pane" style="background: ${bgCol}; border-color: ${borderCol};">
      <div style="border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
        <span class="decision-outcome-pill" style="background: ${pillCol}; color: #fff; margin: 0; font-weight: 800; font-size: 0.75rem; letter-spacing: 0.5px; border-radius: 4px; padding: 4px 8px;">
          ${pillText}
        </span>
        <span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Role: ${g.role}</span>
      </div>

      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin-top: 10px; margin-bottom: 6px;">
        ${g.title}
      </h2>

      <div style="background: rgba(0,0,0,0.12); border: 1px solid var(--border-glass); padding: 14px; border-radius: var(--border-radius-sm); font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; display: flex; flex-direction: column; gap: 8px;">
        <div><strong>Phase 1 Decision:</strong> ${selectedChoice.text}</div>
        <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;"><strong>Phase 2 Response:</strong> ${finalChoice.text}</div>
      </div>

      <div class="decision-consequence-card" style="border: 1px solid ${borderCol}; background: rgba(0,0,0,0.18); margin: 0; padding: 20px;">
        <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: ${finalChoice.isHistorical ? 'var(--success)' : 'var(--accent)'}; margin-top: 0; margin-bottom: 8px;">
          <i class="${finalChoice.isHistorical ? 'fa-solid fa-circle-check' : 'fa-solid fa-code-fork'}"></i> The Final Verdict:
        </h4>
        <p style="font-size: 0.98rem; line-height: 1.6; color: var(--text-main); margin: 0;">
          ${finalChoice.verdict}
        </p>
      </div>

      <div style="display: flex; gap: 12px; justify-content: center; border-top: 1px solid var(--border-glass); padding-top: 18px;">
        <button class="btn-secondary" id="btn-dec-menu" style="padding: 10px 20px; font-weight: 600; font-size: 0.9rem; border-radius: 4px; cursor: pointer;">
          <i class="fa-solid fa-rotate-left"></i> Scenario Menu
        </button>
        <button class="btn-primary" id="btn-dec-retry" style="padding: 10px 20px; font-weight: 600; font-size: 0.9rem; border-radius: 4px; cursor: pointer;">
          <i class="fa-solid fa-rotate-right"></i> Try Alternative Path
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-dec-menu').addEventListener('click', () => {
    AudioEngine.play('click');
    initDecisionsGame();
  });

  document.getElementById('btn-dec-retry').addEventListener('click', () => {
    AudioEngine.play('click');
    playDecisionsScenario(gameId);
  });
}

function initMasteryMatchGame() {
  const container = document.getElementById('mastery-game-play-area');
  if (!container) return;

  let optionsHtml = '';
  Object.keys(MASTERY_DATA).forEach(unitId => {
    optionsHtml += `<option value="${unitId}">${MASTERY_DATA[unitId].title}</option>`;
  });

  container.innerHTML = `
    <div class="causal-connector-container" style="background: var(--bg-card); padding: 24px; border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); box-shadow: var(--shadow-md);">
      <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-top: 0; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-trophy" style="color: var(--primary);"></i> Mastery Match
      </h3>
      <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 20px 0;">
        Match specification-level terms to their definitions. Correct pairings trigger a quick "Defend" bonus question!
      </p>

      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
        <div class="form-group" style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted);">Select Topic Unit</label>
          <select class="select-input" id="mastery-setup-unit" style="width: 100%; padding: 12px 16px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); color: var(--text-main); font-size: 0.95rem; outline: none; cursor: pointer;">
            ${optionsHtml}
          </select>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; padding: 10px 0;">
          <input type="checkbox" id="mastery-setup-speedrun" checked style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary);">
          <label for="mastery-setup-speedrun" style="font-size: 0.88rem; font-weight: 500; cursor: pointer; color: var(--text-main);">
            Enable Speed Run Mode (60-second Timer)
          </label>
        </div>
      </div>

      <button class="btn-primary" id="btn-mastery-start" style="width: 100%; padding: 12px; font-weight: 700; font-size: 1rem; border-radius: var(--border-radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <i class="fa-solid fa-play"></i> Start Matching
      </button>

      <!-- Leaderboard Container -->
      <div id="mastery-leaderboard-container"></div>
    </div>
  `;

  const unitSelect = document.getElementById('mastery-setup-unit');
  if (unitSelect) {
    renderMasteryLeaderboard(unitSelect.value);
    unitSelect.addEventListener('change', () => {
      renderMasteryLeaderboard(unitSelect.value);
    });
  }

  document.getElementById('btn-mastery-start').addEventListener('click', () => {
    AudioEngine.play('click');
    const unitId = document.getElementById('mastery-setup-unit').value;
    const isSpeedRun = document.getElementById('mastery-setup-speedrun').checked;
    startMasteryMatch(unitId, isSpeedRun);
  });
}

function startMasteryMatch(unitId, isSpeedRun) {
  const container = document.getElementById('mastery-game-play-area');
  if (!container) return;

  const data = MASTERY_DATA[unitId];
  if (!data) return;

  // Clear any existing intervals
  if (masteryState.timerInterval) clearInterval(masteryState.timerInterval);

  // Setup state
  masteryState.unitId = unitId;
  masteryState.score = 0;
  masteryState.isSpeedRun = isSpeedRun;
  masteryState.timerVal = 60;
  masteryState.matchedCount = 0;
  masteryState.selectedTermCard = null;
  masteryState.selectedDefCard = null;

  // Spaced Repetition: Sort items so that missed terms appear first
  const missed = getMissedTerms();
  const allItems = [...data.items];
  allItems.sort((a, b) => {
    const aMissed = missed.includes(a.term) ? 1 : 0;
    const bMissed = missed.includes(b.term) ? 1 : 0;
    return bMissed - aMissed; // missed items first
  });

  // Pull top 5 items for this round
  const roundItems = allItems.slice(0, 5);
  masteryState.items = roundItems;

  // Shuffle terms and definitions separately
  const shuffledTerms = [...roundItems].sort(() => Math.random() - 0.5);
  const shuffledDefs = [...roundItems].sort(() => Math.random() - 0.5);

  let timerHtml = '';
  if (isSpeedRun) {
    timerHtml = `
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 6px;">
          <span>Time Remaining</span>
          <span id="mastery-timer-text">60s</span>
        </div>
        <div style="height: 6px; background: rgba(255, 255, 255, 0.05); border-radius: 3px; overflow: hidden;">
          <div id="mastery-timer-fill" style="height: 100%; width: 100%; background: var(--gradient-main); transition: width 1s linear;"></div>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="causal-connector-container" style="background: var(--bg-card); padding: 24px; border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); box-shadow: var(--shadow-md);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--primary); letter-spacing: 0.5px;">Mastery Match: ${data.title}</span>
        <span style="font-weight: 700; font-size: 0.95rem; color: var(--success);" id="mastery-score-display">Score: 0</span>
      </div>

      ${timerHtml}

      <div class="mastery-match-grid">
        <!-- Terms Column -->
        <div class="mastery-column">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Terms</div>
          ${shuffledTerms.map(item => `
            <div class="mastery-match-card" data-type="term" data-term="${item.term}" id="mastery-term-${item.term.replace(/\s+/g, '-').replace(/[^\w-]/g, '')}">
              ${item.term}
            </div>
          `).join('')}
        </div>

        <!-- Definitions Column -->
        <div class="mastery-column">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Definitions</div>
          ${shuffledDefs.map(item => `
            <div class="mastery-match-card" data-type="def" data-def="${item.definition}" id="mastery-def-${item.term.replace(/\s+/g, '-').replace(/[^\w-]/g, '')}">
              ${item.definition}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <!-- Modal Container for Defend Popups -->
    <div id="mastery-defend-overlay" class="defend-overlay" style="display: none;"></div>
  `;

  // Bind Card Click Events
  container.querySelectorAll('.mastery-match-card').forEach(card => {
    card.addEventListener('click', () => {
      handleMasteryCardClick(card);
    });
  });

  // Start Timer if enabled
  if (isSpeedRun) {
    masteryState.timerInterval = setInterval(() => {
      masteryState.timerVal--;
      const text = document.getElementById('mastery-timer-text');
      const fill = document.getElementById('mastery-timer-fill');
      if (text) text.textContent = `${masteryState.timerVal}s`;
      if (fill) fill.style.width = `${(masteryState.timerVal / 60) * 100}%`;

      if (masteryState.timerVal <= 0) {
        clearInterval(masteryState.timerInterval);
        endMasteryGame(false); // Time out
      }
    }, 1000);
  }
}

function handleMasteryCardClick(card) {
  if (card.classList.contains('matched')) return;

  AudioEngine.play('click');
  const type = card.getAttribute('data-type');

  if (type === 'term') {
    // Deselect previous
    if (masteryState.selectedTermCard) {
      masteryState.selectedTermCard.classList.remove('selected');
    }
    
    if (masteryState.selectedTermCard === card) {
      // Toggle off
      masteryState.selectedTermCard = null;
    } else {
      masteryState.selectedTermCard = card;
      card.classList.add('selected');
    }
  } else {
    // Deselect previous
    if (masteryState.selectedDefCard) {
      masteryState.selectedDefCard.classList.remove('selected');
    }

    if (masteryState.selectedDefCard === card) {
      // Toggle off
      masteryState.selectedDefCard = null;
    } else {
      masteryState.selectedDefCard = card;
      card.classList.add('selected');
    }
  }

  // Attempt Pairing
  if (masteryState.selectedTermCard && masteryState.selectedDefCard) {
    const selectedTerm = masteryState.selectedTermCard.getAttribute('data-term');
    const selectedDef = masteryState.selectedDefCard.getAttribute('data-def');

    // Find the item matching this term
    const matchedItem = masteryState.items.find(item => item.term === selectedTerm);

    if (matchedItem && matchedItem.definition === selectedDef) {
      // SUCCESS!
      const termCard = masteryState.selectedTermCard;
      const defCard = masteryState.selectedDefCard;
      
      termCard.classList.remove('selected');
      defCard.classList.remove('selected');
      
      termCard.classList.add('matched');
      defCard.classList.add('matched');

      // Clear selection variables
      masteryState.selectedTermCard = null;
      masteryState.selectedDefCard = null;

      // Trigger "Defend" Twist
      triggerDefendTwist(matchedItem, termCard, defCard);
    } else {
      // FAIL!
      AudioEngine.play('fail');
      
      // Spaced Repetition tracking
      recordMissedTerm(selectedTerm);
      if (matchedItem) {
        recordMissedTerm(matchedItem.term);
      }

      const termCard = masteryState.selectedTermCard;
      const defCard = masteryState.selectedDefCard;

      termCard.classList.remove('selected');
      defCard.classList.remove('selected');
      
      // Shake animation
      [termCard, defCard].forEach(c => {
        c.style.transform = 'translateX(-6px)';
        setTimeout(() => c.style.transform = 'translateX(6px)', 60);
        setTimeout(() => c.style.transform = 'translateX(-4px)', 120);
        setTimeout(() => c.style.transform = 'translateX(4px)', 180);
        setTimeout(() => c.style.transform = 'translateX(0)', 240);
      });

      masteryState.selectedTermCard = null;
      masteryState.selectedDefCard = null;
    }
  }
}

function triggerDefendTwist(item, termCard, defCard) {
  const overlay = document.getElementById('mastery-defend-overlay');
  if (!overlay) return;

  // Shuffle defend options
  const shuffledOptions = [...item.defendOptions].sort(() => Math.random() - 0.5);

  overlay.innerHTML = `
    <div class="defend-content">
      <div class="defend-header">
        <i class="fa-solid fa-shield-halved"></i> DEFEND YOUR MATCH!
      </div>
      <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
        Match confirmed: <strong>${item.term}</strong>
      </div>
      <div class="defend-question">${item.defendQuestion}</div>
      <div class="defend-options-list">
        ${shuffledOptions.map(opt => `
          <button class="defend-option-btn" data-value="${opt}">${opt}</button>
        `).join('')}
      </div>
    </div>
  `;

  overlay.style.display = 'flex';

  overlay.querySelectorAll('.defend-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedVal = btn.getAttribute('data-value');
      const correctVal = item.defendAnswer;

      // Disable all buttons immediately
      overlay.querySelectorAll('.defend-option-btn').forEach(b => b.disabled = true);

      if (selectedVal === correctVal) {
        AudioEngine.play('success');
        btn.classList.add('correct');
        masteryState.score += 10;
        document.getElementById('mastery-score-display').textContent = `Score: ${masteryState.score}`;
        
        // Remove from missed list
        resolveMissedTerm(item.term);

        setTimeout(() => {
          overlay.style.display = 'none';
          checkMasteryRoundStatus();
        }, 1000);
      } else {
        AudioEngine.play('fail');
        btn.classList.add('incorrect');
        
        // Highlight correct option
        overlay.querySelectorAll('.defend-option-btn').forEach(b => {
          if (b.getAttribute('data-value') === correctVal) {
            b.classList.add('correct');
          }
        });

        // Penalize score
        masteryState.score = Math.max(0, masteryState.score - 5);
        document.getElementById('mastery-score-display').textContent = `Score: ${masteryState.score}`;
        recordMissedTerm(item.term);

        setTimeout(() => {
          overlay.style.display = 'none';
          checkMasteryRoundStatus();
        }, 1800);
      }
    });
  });
}

function checkMasteryRoundStatus() {
  masteryState.matchedCount++;
  if (masteryState.matchedCount === 5) {
    if (masteryState.timerInterval) clearInterval(masteryState.timerInterval);
    endMasteryGame(true); // Completed successfully!
  }
}

function endMasteryGame(success) {
  const container = document.getElementById('mastery-game-play-area');
  if (!container) return;

  if (success) {
    AudioEngine.play('cheer');
    Confetti.spawn(100);
  } else {
    AudioEngine.play('fail');
  }

  // Calculate final performance grade
  let grade = "Novice";
  let gradeColor = "var(--text-muted)";
  if (masteryState.score >= 40) {
    grade = "Historical Master";
    gradeColor = "var(--success)";
  } else if (masteryState.score >= 25) {
    grade = "Scholar";
    gradeColor = "var(--primary)";
  }

  container.innerHTML = `
    <div class="causal-connector-container" style="background: var(--bg-card); padding: 32px; border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); box-shadow: var(--shadow-md); text-align: center;">
      <div class="results-grade-circle" style="width: 80px; height: 80px; font-size: 2.2rem; margin: 0 auto 20px; background: ${success ? 'var(--success-glow)' : 'var(--accent-glow)'}; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid ${success ? 'var(--success)' : 'var(--accent)'};">
        <i class="${success ? 'fa-solid fa-trophy' : 'fa-solid fa-hourglass-end'}" style="color: ${success ? 'var(--success)' : 'var(--accent)'};"></i>
      </div>

      <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
        ${success ? 'Mastery Match Completed!' : 'Speed Run Timed Out!'}
      </h3>
      <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 24px 0;">
        ${success ? 'Excellent job! You successfully matched all specification terms and defended your pairings.' : 'Time ran out before you could match and defend all active key terms.'}
      </p>

      <div style="display: grid; grid-template-columns: 1fr; gap: 16px; margin: 0 auto 24px; max-width: 180px;">
        <div style="background: rgba(0,0,0,0.15); padding: 12px; border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm);">
          <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 4px;">Rank</span>
          <span style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: ${gradeColor}; line-height: 1.5;">${grade}</span>
        </div>
      </div>


      <!-- High Score Input Box -->
      <div id="mastery-highscore-input-box" style="margin-bottom: 24px; padding: 16px; background: rgba(0,0,0,0.15); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); max-width: 380px; margin-left: auto; margin-right: auto; text-align: center;">
        <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 12px;">Save your score to the topic leaderboard!</label>
        <div style="display: flex; gap: 8px; justify-content: center; align-items: center; flex-wrap: wrap;">
          <input type="text" id="mastery-highscore-initials" placeholder="AAA" maxlength="3" style="padding: 8px; font-size: 0.85rem; border: 1px solid var(--border-glass); border-radius: 4px; background: rgba(0,0,0,0.3); color: var(--text-main); width: 68px; text-align: center; text-transform: uppercase; outline: none;" required>
          
          <select id="mastery-highscore-year" style="padding: 8px; font-size: 0.85rem; border: 1px solid var(--border-glass); border-radius: 4px; background: rgba(0,0,0,0.3); color: var(--text-main); outline: none; cursor: pointer;" required>
            <option value="" disabled selected>Year</option>
            <option value="Year 7">Year 7</option>
            <option value="Year 8">Year 8</option>
            <option value="Year 9">Year 9</option>
            <option value="Year 10">Year 10</option>
            <option value="Year 11">Year 11</option>
          </select>
          
          <button class="btn-primary" id="btn-submit-highscore" style="padding: 8px 16px; font-size: 0.85rem; border-radius: 4px;">Submit</button>
        </div>
      </div>
      
      <!-- Results Leaderboard Rankings -->
      <div id="mastery-results-leaderboard" style="max-width: 360px; margin: 0 auto 24px;"></div>

      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn-secondary" id="btn-mastery-return" style="padding: 10px 20px; font-weight: 600; font-size: 0.9rem; border-radius: 4px; cursor: pointer;">
          <i class="fa-solid fa-rotate-left"></i> Setup Screen
        </button>
        <button class="btn-primary" id="btn-mastery-play-again" style="padding: 10px 20px; font-weight: 600; font-size: 0.9rem; border-radius: 4px; cursor: pointer;">
          <i class="fa-solid fa-rotate-right"></i> Play Again (Same Topic)
        </button>
      </div>
    </div>
  `;

  // Render leaderboard on results immediately
  renderResultsLeaderboard(masteryState.unitId);

  const submitBtn = document.getElementById('btn-submit-highscore');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const initialsInput = document.getElementById('mastery-highscore-initials');
      const yearInput = document.getElementById('mastery-highscore-year');
      
      let initials = initialsInput ? initialsInput.value.trim().toUpperCase() : "";
      let yearGroup = yearInput ? yearInput.value : "";
      
      if (initials.length !== 3 || !/^[A-Z]{3}$/.test(initials)) {
        alert("Please enter exactly 3 letters for your initials (e.g. ABC).");
        return;
      }
      if (!yearGroup) {
        alert("Please select your Year Group.");
        return;
      }
      
      const name = initials;
      saveHighScoreLocal(masteryState.unitId, name, yearGroup, masteryState.score);
      AudioEngine.play('success');
      
      if (GOOGLE_SHEET_WEBAPP_URL) {
        const payload = {
          type: "mastery",
          unitId: masteryState.unitId,
          name: name,
          yearGroup: yearGroup,
          score: masteryState.score,
          date: new Date().toISOString().split('T')[0]
        };
        
        fetch(GOOGLE_SHEET_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }).catch(err => console.error("Error saving remote mastery score:", err));
      }
      
      const inputBox = document.getElementById('mastery-highscore-input-box');
      if (inputBox) inputBox.style.display = 'none';
      
      renderResultsLeaderboard(masteryState.unitId);
      renderMasteryLeaderboard(masteryState.unitId);
    });
  }

  document.getElementById('btn-mastery-return').addEventListener('click', () => {
    AudioEngine.play('click');
    initMasteryMatchGame();
  });

  document.getElementById('btn-mastery-play-again').addEventListener('click', () => {
    AudioEngine.play('click');
    startMasteryMatch(masteryState.unitId, masteryState.isSpeedRun);
  });
}

// --- Concept Connector Game State ---
let mindmapState = {
  subtopicId: null,
  nodes: [],
  shuffledNodes: [],
  placedCount: 0,
  score: 0,
  timerVal: 60,
  timerInterval: null,
  isSpeedRun: false
};

// Spaced Repetition / Highscore Helpers for Concept Connector
function getMindMapHighScores(subtopicId) {
  const key = `mindmap_highscores_${subtopicId}`;
  let scores = localStorage.getItem(key);
  if (!scores) {
    scores = [
      { name: "Alex", yearGroup: "Year 9", score: 45, date: "2026-05-28" },
      { name: "Sarah", yearGroup: "Year 10", score: 40, date: "2026-05-29" },
      { name: "James", yearGroup: "Year 8", score: 35, date: "2026-05-27" },
      { name: "Emily", yearGroup: "Year 11", score: 25, date: "2026-05-29" },
      { name: "Thomas", yearGroup: "Year 7", score: 15, date: "2026-05-26" }
    ];
    localStorage.setItem(key, JSON.stringify(scores));
  } else {
    scores = JSON.parse(scores);
  }
  return scores.sort((a, b) => b.score - a.score).slice(0, 5);
}

function saveMindMapHighScoreLocal(subtopicId, name, yearGroup, score) {
  const scores = getMindMapHighScores(subtopicId);
  const dateStr = new Date().toISOString().split('T')[0];
  scores.push({ name: name || "Anonymous", yearGroup: yearGroup || "", score: score, date: dateStr });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem(`mindmap_highscores_${subtopicId}`, JSON.stringify(scores.slice(0, 5)));
}

function renderMindMapLeaderboard(subtopicId) {
  const container = document.getElementById('mindmap-leaderboard-container');
  if (!container) return;

  const localScores = getMindMapHighScores(subtopicId);
  renderTable(localScores);

  if (GOOGLE_SHEET_WEBAPP_URL) {
    fetch(`${GOOGLE_SHEET_WEBAPP_URL}?type=mindmap&subtopicId=${subtopicId}`)
      .then(res => res.json())
      .then(scores => {
        if (Array.isArray(scores)) {
          renderTable(scores);
        }
      })
      .catch(err => console.error("Error loading remote mindmap leaderboard:", err));
  }

  function renderTable(scoresList) {
    let rowsHtml = scoresList.map((s, idx) => {
      let medal = '';
      if (idx === 0) medal = '🥇 ';
      else if (idx === 1) medal = '🥈 ';
      else if (idx === 2) medal = '🥉 ';
      
      const yrText = s.yearGroup ? ` <span style="font-size: 0.72rem; color: var(--text-muted);">(${s.yearGroup})</span>` : '';
      return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.82rem;">
          <td style="padding: 8px 4px; font-weight: bold; color: var(--primary);">${medal}${idx + 1}</td>
          <td style="padding: 8px 4px; color: var(--text-main);">${s.name}${yrText}</td>
          <td style="padding: 8px 4px; font-weight: 700; color: var(--success); text-align: right;">${s.score} pts</td>
          <td style="padding: 8px 4px; color: var(--text-muted); text-align: right; font-size: 0.72rem;">${s.date}</td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-glass);">
        <h4 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin: 0 0 12px 0; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-ranking-star" style="color: var(--accent);"></i> Top High Scores (Topic Leaderboard)
        </h4>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-glass); color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">
              <th style="padding: 4px; font-weight: 600;">Rank</th>
              <th style="padding: 4px; font-weight: 600;">Student</th>
              <th style="padding: 4px; font-weight: 600; text-align: right;">Score</th>
              <th style="padding: 4px; font-weight: 600; text-align: right;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }
}

function renderMindMapResultsLeaderboard(subtopicId) {
  const container = document.getElementById('mindmap-results-leaderboard');
  if (!container) return;
  
  const localScores = getMindMapHighScores(subtopicId);
  renderResults(localScores);

  if (GOOGLE_SHEET_WEBAPP_URL) {
    fetch(`${GOOGLE_SHEET_WEBAPP_URL}?type=mindmap&subtopicId=${subtopicId}`)
      .then(res => res.json())
      .then(scores => {
        if (Array.isArray(scores)) {
          renderResults(scores);
        }
      })
      .catch(err => console.error("Error loading remote mindmap results leaderboard:", err));
  }

  function renderResults(scoresList) {
    let rowsHtml = scoresList.map((s, idx) => {
      let medal = '';
      if (idx === 0) medal = '🥇 ';
      else if (idx === 1) medal = '🥈 ';
      else if (idx === 2) medal = '🥉 ';
      const yrText = s.yearGroup ? ` <span style="font-size: 0.72rem; color: var(--text-muted);">(${s.yearGroup})</span>` : '';
      return `
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
          <span style="color: var(--primary); font-weight: bold;">${medal}${idx + 1}. ${s.name}${yrText}</span>
          <span style="color: var(--success); font-weight: 700;">${s.score} pts</span>
        </div>
      `;
    }).join('');
    container.innerHTML = `
      <h4 style="font-family: var(--font-heading); font-size: 0.88rem; margin: 12px 0 8px; color: var(--text-main); text-align: left;">
        <i class="fa-solid fa-ranking-star" style="color: var(--accent);"></i> Leaderboard Rankings:
      </h4>
      <div style="text-align: left; background: rgba(0,0,0,0.1); padding: 8px 12px; border-radius: 4px; border: 1px solid var(--border-glass);">
        ${rowsHtml}
      </div>
    `;
  }
}

function initMindMapGame() {
  const container = document.getElementById('mindmap-game-play-area');
  if (!container) return;

  let optionsHtml = '';
  Object.keys(MINDMAP_DATA).forEach(subtopicId => {
    const match = subtopicId.match(/subtopic_(\d)_(\d)/);
    let friendlyName = MINDMAP_DATA[subtopicId].title;
    if (friendlyName.length > 55) {
      friendlyName = friendlyName.slice(0, 52) + "...";
    }
    if (match) {
      friendlyName = `Topic ${match[1]}.${match[2]}: ${friendlyName}`;
    }
    optionsHtml += `<option value="${subtopicId}">${friendlyName}</option>`;
  });

  container.innerHTML = `
    <div class="causal-connector-container" style="background: var(--bg-card); padding: 24px; border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); box-shadow: var(--shadow-md);">
      <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-top: 0; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-network-wired" style="color: var(--primary);"></i> Concept Connector
      </h3>
      <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 20px 0;">
        Reassemble the historical cause-and-effect flowcharts in chronological sequence. Tap options from the bottom card shelf to assign them into place!
      </p>

      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
        <div class="form-group" style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted);">Select Flowchart Topic</label>
          <select class="select-input" id="mindmap-setup-topic" style="width: 100%; padding: 12px 16px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); color: var(--text-main); font-size: 0.95rem; outline: none; cursor: pointer;">
            ${optionsHtml}
          </select>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; padding: 10px 0;">
          <input type="checkbox" id="mindmap-setup-speedrun" checked style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary);">
          <label for="mindmap-setup-speedrun" style="font-size: 0.88rem; font-weight: 500; cursor: pointer; color: var(--text-main);">
            Enable Speed Run Mode (60-second Timer)
          </label>
        </div>
      </div>

      <button class="btn-primary" id="btn-mindmap-start" style="width: 100%; padding: 12px; font-weight: 700; font-size: 1rem; border-radius: var(--border-radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <i class="fa-solid fa-play"></i> Start Linking
      </button>

      <!-- Leaderboard Container -->
      <div id="mindmap-leaderboard-container"></div>
    </div>
  `;

  const topicSelect = document.getElementById('mindmap-setup-topic');
  if (topicSelect) {
    renderMindMapLeaderboard(topicSelect.value);
    topicSelect.addEventListener('change', () => {
      renderMindMapLeaderboard(topicSelect.value);
    });
  }

  document.getElementById('btn-mindmap-start').addEventListener('click', () => {
    AudioEngine.play('click');
    const subtopicId = document.getElementById('mindmap-setup-topic').value;
    const isSpeedRun = document.getElementById('mindmap-setup-speedrun').checked;
    startMindMapGame(subtopicId, isSpeedRun);
  });
}

function startMindMapGame(subtopicId, isSpeedRun) {
  const container = document.getElementById('mindmap-game-play-area');
  if (!container) return;

  const data = MINDMAP_DATA[subtopicId];
  if (!data) return;

  // Clear any existing intervals
  if (mindmapState.timerInterval) clearInterval(mindmapState.timerInterval);

  // Setup state
  mindmapState.subtopicId = subtopicId;
  mindmapState.score = 0;
  mindmapState.isSpeedRun = isSpeedRun;
  mindmapState.timerVal = 60;
  mindmapState.placedCount = 0;
  mindmapState.nodes = [...data.nodes];
  
  // Shuffle option cards
  mindmapState.shuffledNodes = [...data.nodes].sort(() => Math.random() - 0.5);

  let timerHtml = '';
  if (isSpeedRun) {
    timerHtml = `
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 6px;">
          <span>Time Remaining</span>
          <span id="mindmap-timer-text">60s</span>
        </div>
        <div style="height: 6px; background: rgba(255, 255, 255, 0.05); border-radius: 3px; overflow: hidden;">
          <div id="mindmap-timer-fill" style="height: 100%; width: 100%; background: var(--gradient-main); transition: width 1s linear;"></div>
        </div>
      </div>
    `;
  }

  // Create slot and arrow HTML
  let slotsHtml = '';
  mindmapState.nodes.forEach((nodeText, idx) => {
    if (idx > 0) {
      slotsHtml += `
        <div class="mindmap-arrow" id="mindmap-arrow-${idx}" style="opacity: 0.15; transition: opacity 0.3s ease;">
          <i class="fa-solid fa-arrow-right horizontal-arrow"></i>
          <i class="fa-solid fa-arrow-down vertical-arrow"></i>
        </div>
      `;
    }
    slotsHtml += `
      <div class="mindmap-slot ${idx === 0 ? 'active-target' : ''}" id="mindmap-slot-${idx}" data-index="${idx}">
        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Step ${idx + 1}</span>
      </div>
    `;
  });

  // Create shuffled option cards HTML (for bottom third)
  let optionsHtml = mindmapState.shuffledNodes.map((nodeText, idx) => {
    const safeId = `mindmap-opt-${idx}`;
    return `
      <div class="mindmap-option-card" id="${safeId}" data-text="${nodeText.replace(/"/g, '&quot;')}">
        ${nodeText}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="causal-connector-container" style="background: var(--bg-card); padding: 24px; border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); box-shadow: var(--shadow-md);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--primary); letter-spacing: 0.5px;">Concept Connector: ${data.title}</span>
        <span style="font-weight: 700; font-size: 0.95rem; color: var(--success);" id="mindmap-score-display">Score: 0</span>
      </div>

      ${timerHtml}

      <!-- Flowchart slots panel (Top viewport) -->
      <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Flowchart Chain</div>
      <div class="mindmap-slots-container">
        ${slotsHtml}
      </div>

      <!-- Shuffled option cards shelf (Bottom viewport, lower third for thumb ergonomics) -->
      <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Card Options Shelf (Tap correct event in sequence)</div>
      <div class="mindmap-options-container">
        ${optionsHtml}
      </div>
    </div>
  `;

  // Start timer if speedrun is active
  if (isSpeedRun) {
    mindmapState.timerInterval = setInterval(() => {
      mindmapState.timerVal--;
      const text = document.getElementById('mindmap-timer-text');
      const fill = document.getElementById('mindmap-timer-fill');
      if (text) text.textContent = `${mindmapState.timerVal}s`;
      if (fill) fill.style.width = `${(mindmapState.timerVal / 60) * 100}%`;

      if (mindmapState.timerVal <= 0) {
        clearInterval(mindmapState.timerInterval);
        endMindMapGame(false);
      }
    }, 1000);
  }

  // Bind option card click handlers
  container.querySelectorAll('.mindmap-option-card').forEach(card => {
    card.addEventListener('click', () => {
      handleMindMapCardClick(card);
    });
  });
}

function handleMindMapCardClick(card) {
  if (card.classList.contains('correct-placed') || card.classList.contains('incorrect')) return;

  const text = card.getAttribute('data-text');
  
  const nextExpectedIndex = mindmapState.placedCount;
  const expectedText = mindmapState.nodes[nextExpectedIndex];

  if (text === expectedText) {
    AudioEngine.play('success');
    
    mindmapState.score += 10;
    const scoreDisplay = document.getElementById('mindmap-score-display');
    if (scoreDisplay) scoreDisplay.textContent = `Score: ${mindmapState.score}`;

    card.classList.add('correct-placed');

    const slot = document.getElementById(`mindmap-slot-${nextExpectedIndex}`);
    if (slot) {
      slot.classList.remove('active-target');
      slot.classList.add('filled');
      slot.innerHTML = `
        <div style="font-family: var(--font-heading); font-weight: 700; color: var(--primary); margin-bottom: 4px; font-size: 0.72rem;">STEP ${nextExpectedIndex + 1}</div>
        <div style="font-size: 0.82rem; line-height: 1.3;">${text}</div>
      `;
    }

    if (nextExpectedIndex > 0) {
      const arrow = document.getElementById(`mindmap-arrow-${nextExpectedIndex}`);
      if (arrow) arrow.style.opacity = '1';
    }

    mindmapState.placedCount++;

    if (mindmapState.placedCount < mindmapState.nodes.length) {
      const nextSlot = document.getElementById(`mindmap-slot-${mindmapState.placedCount}`);
      if (nextSlot) nextSlot.classList.add('active-target');
    } else {
      if (mindmapState.timerInterval) clearInterval(mindmapState.timerInterval);
      setTimeout(() => endMindMapGame(true), 600);
    }
  } else {
    AudioEngine.play('fail');
    
    mindmapState.score = Math.max(0, mindmapState.score - 5);
    const scoreDisplay = document.getElementById('mindmap-score-display');
    if (scoreDisplay) scoreDisplay.textContent = `Score: ${mindmapState.score}`;

    card.classList.add('incorrect');
    setTimeout(() => {
      card.classList.remove('incorrect');
    }, 450);
  }
}

function endMindMapGame(success) {
  const container = document.getElementById('mindmap-game-play-area');
  if (!container) return;

  if (success) {
    AudioEngine.play('cheer');
    Confetti.spawn(100);
  } else {
    AudioEngine.play('fail');
  }

  let grade = "Novice";
  let gradeColor = "var(--text-muted)";
  if (mindmapState.score >= 40) {
    grade = "Historical Master";
    gradeColor = "var(--success)";
  } else if (mindmapState.score >= 25) {
    grade = "Scholar";
    gradeColor = "var(--primary)";
  }

  container.innerHTML = `
    <div class="causal-connector-container" style="background: var(--bg-card); padding: 32px; border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); box-shadow: var(--shadow-md); text-align: center;">
      <div class="results-grade-circle" style="width: 80px; height: 80px; font-size: 2.2rem; margin: 0 auto 20px; background: ${success ? 'var(--success-glow)' : 'var(--accent-glow)'}; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid ${success ? 'var(--success)' : 'var(--accent)'};">
        <i class="${success ? 'fa-solid fa-trophy' : 'fa-solid fa-hourglass-end'}" style="color: ${success ? 'var(--success)' : 'var(--accent)'};"></i>
      </div>

      <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
        ${success ? 'Flowchart Sequenced Successfully!' : 'Speed Run Timed Out!'}
      </h3>
      <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 24px 0;">
        ${success ? 'Outstanding! You correctly connected the cause-and-effect mind map nodes in historical order.' : 'Time ran out before you could sequence the flowchart. Keep reviewing your key topics!'}
      </p>

      <div style="display: grid; grid-template-columns: 1fr; gap: 16px; margin: 0 auto 24px; max-width: 180px;">
        <div style="background: rgba(0,0,0,0.15); padding: 12px; border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm);">
          <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 4px;">Rank</span>
          <span style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: ${gradeColor}; line-height: 1.5;">${grade}</span>
        </div>
      </div>


      <!-- High Score Input Box -->
      <div id="mindmap-highscore-input-box" style="margin-bottom: 24px; padding: 16px; background: rgba(0,0,0,0.15); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); max-width: 380px; margin-left: auto; margin-right: auto; text-align: center;">
        <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 12px;">Save your score to the topic leaderboard!</label>
        <div style="display: flex; gap: 8px; justify-content: center; align-items: center; flex-wrap: wrap;">
          <input type="text" id="mindmap-highscore-initials" placeholder="AAA" maxlength="3" style="padding: 8px; font-size: 0.85rem; border: 1px solid var(--border-glass); border-radius: 4px; background: rgba(0,0,0,0.3); color: var(--text-main); width: 68px; text-align: center; text-transform: uppercase; outline: none;" required>
          
          <select id="mindmap-highscore-year" style="padding: 8px; font-size: 0.85rem; border: 1px solid var(--border-glass); border-radius: 4px; background: rgba(0,0,0,0.3); color: var(--text-main); outline: none; cursor: pointer;" required>
            <option value="" disabled selected>Year</option>
            <option value="Year 7">Year 7</option>
            <option value="Year 8">Year 8</option>
            <option value="Year 9">Year 9</option>
            <option value="Year 10">Year 10</option>
            <option value="Year 11">Year 11</option>
          </select>
          
          <button class="btn-primary" id="btn-submit-mindmap-highscore" style="padding: 8px 16px; font-size: 0.85rem; border-radius: 4px;">Submit</button>
        </div>
      </div>
      
      <!-- Results Leaderboard Rankings -->
      <div id="mindmap-results-leaderboard" style="max-width: 360px; margin: 0 auto 24px;"></div>

      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn-secondary" id="btn-mindmap-return" style="padding: 10px 20px; font-weight: 600; font-size: 0.9rem; border-radius: 4px; cursor: pointer;">
          <i class="fa-solid fa-rotate-left"></i> Setup Screen
        </button>
        <button class="btn-primary" id="btn-mindmap-play-again" style="padding: 10px 20px; font-weight: 600; font-size: 0.9rem; border-radius: 4px; cursor: pointer;">
          <i class="fa-solid fa-rotate-right"></i> Play Again (Same Topic)
        </button>
      </div>
    </div>
  `;

  renderMindMapResultsLeaderboard(mindmapState.subtopicId);

  const submitBtn = document.getElementById('btn-submit-mindmap-highscore');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const initialsInput = document.getElementById('mindmap-highscore-initials');
      const yearInput = document.getElementById('mindmap-highscore-year');
      
      let initials = initialsInput ? initialsInput.value.trim().toUpperCase() : "";
      let yearGroup = yearInput ? yearInput.value : "";
      
      if (initials.length !== 3 || !/^[A-Z]{3}$/.test(initials)) {
        alert("Please enter exactly 3 letters for your initials (e.g. ABC).");
        return;
      }
      if (!yearGroup) {
        alert("Please select your Year Group.");
        return;
      }
      
      const name = initials;
      saveMindMapHighScoreLocal(mindmapState.subtopicId, name, yearGroup, mindmapState.score);
      AudioEngine.play('success');
      
      if (GOOGLE_SHEET_WEBAPP_URL) {
        const payload = {
          type: "mindmap",
          subtopicId: mindmapState.subtopicId,
          name: name,
          yearGroup: yearGroup,
          score: mindmapState.score,
          date: new Date().toISOString().split('T')[0]
        };
        
        fetch(GOOGLE_SHEET_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }).catch(err => console.error("Error saving remote mindmap score:", err));
      }
      
      const inputBox = document.getElementById('mindmap-highscore-input-box');
      if (inputBox) inputBox.style.display = 'none';
      
      renderMindMapResultsLeaderboard(mindmapState.subtopicId);
    });
  }

  document.getElementById('btn-mindmap-return').addEventListener('click', () => {
    AudioEngine.play('click');
    initMindMapGame();
  });

  document.getElementById('btn-mindmap-play-again').addEventListener('click', () => {
    AudioEngine.play('click');
    startMindMapGame(mindmapState.subtopicId, mindmapState.isSpeedRun);
  });
}

// Spaced Repetition / Highscore Helpers for Exam/Recall Challenge
function getExamHighScores(scope) {
  const key = `exam_highscores_${scope}`;
  let scores = localStorage.getItem(key);
  if (!scores) return [];
  try {
    return JSON.parse(scores);
  } catch (e) {
    return [];
  }
}

function saveExamHighScoreLocal(scope, name, yearGroup, score) {
  const scores = getExamHighScores(scope);
  scores.push({
    name: name,
    yearGroup: yearGroup,
    score: score,
    date: new Date().toISOString().split('T')[0]
  });
  scores.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  localStorage.setItem(`exam_highscores_${scope}`, JSON.stringify(scores.slice(0, 5)));
}

function renderExamResultsLeaderboard(scope) {
  const container = document.getElementById('exam-results-leaderboard');
  if (!container) return;

  const localScores = getExamHighScores(scope);
  renderResults(localScores);

  if (GOOGLE_SHEET_WEBAPP_URL) {
    fetch(`${GOOGLE_SHEET_WEBAPP_URL}?type=exam&subtopicId=${scope}`)
      .then(res => res.json())
      .then(scores => {
        if (Array.isArray(scores)) {
          renderResults(scores);
        }
      })
      .catch(err => console.error("Error loading remote exam results leaderboard:", err));
  }

  function renderResults(scoresList) {
    let rowsHtml = scoresList.map((s, idx) => {
      let medal = '';
      if (idx === 0) medal = '🥇 ';
      else if (idx === 1) medal = '🥈 ';
      else if (idx === 2) medal = '🥉 ';
      const yrText = s.yearGroup ? ` <span style="font-size: 0.72rem; color: var(--text-muted);">(${s.yearGroup})</span>` : '';
      return `
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
          <span style="color: var(--primary); font-weight: bold;">${medal}${idx + 1}. ${s.name}${yrText}</span>
          <span style="color: var(--success); font-weight: 700;">${s.score} pts</span>
        </div>
      `;
    }).join('');
    container.innerHTML = `
      <h4 style="font-family: var(--font-heading); font-size: 0.88rem; margin: 12px 0 8px; color: var(--text-main); text-align: left;">
        <i class="fa-solid fa-ranking-star" style="color: var(--accent);"></i> Leaderboard Rankings:
      </h4>
      <div style="text-align: left; background: rgba(0,0,0,0.1); padding: 8px 12px; border-radius: 4px; border: 1px solid var(--border-glass);">
        ${rowsHtml || '<div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 4px 0;">No scores submitted yet. Be the first!</div>'}
      </div>
    `;
  }
}

function initExamLeaderboard(scope, pct) {
  const points = Math.round(pct * 10);
  
  // Show input form
  const inputBox = document.getElementById('exam-highscore-input-box');
  if (inputBox) {
    inputBox.style.display = 'block';
  }

  // Clear previous inputs
  const initialsInput = document.getElementById('exam-highscore-initials');
  const yearInput = document.getElementById('exam-highscore-year');
  if (initialsInput) {
    initialsInput.value = '';
  }
  if (yearInput) {
    yearInput.selectedIndex = 0;
  }

  // Render leaderboard on results immediately
  renderExamResultsLeaderboard(scope);

  const submitBtn = document.getElementById('btn-submit-exam-highscore');
  if (submitBtn) {
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

    newSubmitBtn.addEventListener('click', () => {
      const initials = (initialsInput.value || '').trim().toUpperCase();
      const yearGroup = yearInput.value;

      if (!/^[A-Z]{3}$/.test(initials)) {
        alert("Please enter exactly 3 uppercase letters for your initials.");
        return;
      }
      if (!yearGroup) {
        alert("Please select your Year Group.");
        return;
      }

      saveExamHighScoreLocal(scope, initials, yearGroup, points);
      AudioEngine.play('success');

      if (GOOGLE_SHEET_WEBAPP_URL) {
        const payload = {
          type: "exam",
          subtopicId: scope,
          name: initials,
          yearGroup: yearGroup,
          score: points,
          date: new Date().toISOString().split('T')[0]
        };

        fetch(GOOGLE_SHEET_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }).catch(err => console.error("Error saving remote exam score:", err));
      }

      if (inputBox) inputBox.style.display = 'none';
      renderExamResultsLeaderboard(scope);
    });
  }
}

// ==========================================
// --- Taboo Cards Revision Game Logic ---
// ==========================================

let tabooState = {
  teams: [],
  currentTeamIndex: 0,
  currentRound: 1,
  totalRounds: 3,
  timeLimit: 60,
  timeLeft: 60,
  timerInterval: null,
  activeCategories: [],
  cardsPool: [],
  currentCardIndex: 0,
  currentCard: null,
  turnScore: 0,
  turnLogs: []
};

function tabooShuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initTabooGame() {
  const container = document.getElementById('taboo-game-play-area');
  if (!container) return;

  // Clear any running timers
  if (tabooState.timerInterval) {
    clearInterval(tabooState.timerInterval);
    tabooState.timerInterval = null;
  }

  // Render Setup Panel
  container.innerHTML = `
    <div class="taboo-setup-container" style="max-width: 600px; margin: 0 auto;">
      <div class="taboo-setup-section">
        <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; margin-top: 0; margin-bottom: 12px; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-gear" style="color: var(--primary);"></i> Game Settings
        </h3>
        
        <!-- Number of Teams -->
        <div class="form-group" style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
          <label class="taboo-team-label">Number of Teams</label>
          <select id="taboo-setup-team-count" class="select-input" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); border-radius: 4px; color: var(--text-main); font-size: 0.9rem; outline: none; cursor: pointer;">
            <option value="2" selected>2 Teams</option>
            <option value="3">3 Teams</option>
            <option value="4">4 Teams</option>
            <option value="5">5 Teams</option>
            <option value="6">6 Teams</option>
          </select>
        </div>

        <!-- Team Names Grid -->
        <div class="form-group" style="margin-bottom: 16px;">
          <label class="taboo-team-label">Team Names</label>
          <div id="taboo-setup-teams-list" class="taboo-teams-grid">
            <!-- Populated dynamically -->
          </div>
        </div>

        <!-- Turn Duration & Rounds -->
        <div style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
          <div class="form-group" style="flex: 1; min-width: 120px; display: flex; flex-direction: column; gap: 6px;">
            <label class="taboo-team-label">Time Limit per Turn</label>
            <select id="taboo-setup-time-limit" class="select-input" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); border-radius: 4px; color: var(--text-main); font-size: 0.9rem; outline: none; cursor: pointer;">
              <option value="30">30 Seconds</option>
              <option value="45">45 Seconds</option>
              <option value="60" selected>60 Seconds</option>
              <option value="90">90 Seconds</option>
              <option value="120">120 Seconds</option>
            </select>
          </div>
          <div class="form-group" style="flex: 1; min-width: 120px; display: flex; flex-direction: column; gap: 6px;">
            <label class="taboo-team-label">Number of Rounds</label>
            <select id="taboo-setup-rounds" class="select-input" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); border-radius: 4px; color: var(--text-main); font-size: 0.9rem; outline: none; cursor: pointer;">
              <option value="1">1 Round</option>
              <option value="2">2 Rounds</option>
              <option value="3" selected>3 Rounds</option>
              <option value="4">4 Rounds</option>
              <option value="5">5 Rounds</option>
            </select>
          </div>
        </div>

        <!-- Category Select -->
        <div class="form-group" style="margin-bottom: 24px;">
          <label class="taboo-team-label">Select Categories</label>
          <div class="taboo-categories-list">
            <label class="taboo-category-checkbox-wrapper">
              <input type="checkbox" name="taboo-category" value="People" checked>
              <span>People</span>
            </label>
            <label class="taboo-category-checkbox-wrapper">
              <input type="checkbox" name="taboo-category" value="Places" checked>
              <span>Places</span>
            </label>
            <label class="taboo-category-checkbox-wrapper">
              <input type="checkbox" name="taboo-category" value="Things" checked>
              <span>Things (Concepts & Laws)</span>
            </label>
            <label class="taboo-category-checkbox-wrapper">
              <input type="checkbox" name="taboo-category" value="Events" checked>
              <span>Events</span>
            </label>
          </div>
        </div>

        <button id="btn-taboo-start" class="btn-primary" style="width: 100%; padding: 12px; font-weight: 700; font-size: 1rem; border-radius: 4px; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i class="fa-solid fa-circle-play"></i> Start Taboo Game
        </button>
      </div>
    </div>
  `;

  const teamCountSelect = document.getElementById('taboo-setup-team-count');
  const teamsListContainer = document.getElementById('taboo-setup-teams-list');

  const updateTeamFields = () => {
    const count = parseInt(teamCountSelect.value);
    let fieldsHtml = '';
    for (let i = 1; i <= count; i++) {
      fieldsHtml += `
        <div class="taboo-team-field">
          <label class="taboo-team-label" style="font-size: 0.65rem;">Team ${i} Name</label>
          <input type="text" class="taboo-input taboo-team-name-input" value="Team ${i}" data-index="${i-1}">
        </div>
      `;
    }
    teamsListContainer.innerHTML = fieldsHtml;
  };

  teamCountSelect.addEventListener('change', () => {
    AudioEngine.play('click');
    updateTeamFields();
  });

  // Initial fill
  updateTeamFields();

  document.getElementById('btn-taboo-start').addEventListener('click', () => {
    AudioEngine.play('click');
    startTabooGame();
  });
}

function startTabooGame() {
  const teamCountSelect = document.getElementById('taboo-setup-team-count');
  if (!teamCountSelect) return;
  const timeLimitSelect = document.getElementById('taboo-setup-time-limit');
  const roundsSelect = document.getElementById('taboo-setup-rounds');
  
  const timeLimit = parseInt(timeLimitSelect.value);
  const totalRounds = parseInt(roundsSelect.value);
  
  // Collect team names
  const teamInputs = document.querySelectorAll('.taboo-team-name-input');
  const teams = [];
  teamInputs.forEach(input => {
    teams.push({
      name: input.value.trim() || `Team ${parseInt(input.dataset.index) + 1}`,
      score: 0
    });
  });

  // Collect active categories
  const categoryCheckboxes = document.querySelectorAll('input[name="taboo-category"]:checked');
  const activeCategories = Array.from(categoryCheckboxes).map(cb => cb.value);

  if (activeCategories.length === 0) {
    alert("Please select at least one category to play.");
    return;
  }

  // Compile cards pool
  let rawPool = [];
  activeCategories.forEach(cat => {
    if (TABOO_CARDS[cat]) {
      const cards = TABOO_CARDS[cat].map(card => ({ ...card, category: cat }));
      rawPool = rawPool.concat(cards);
    }
  });

  if (rawPool.length === 0) {
    alert("No taboo cards found in the selected categories.");
    return;
  }

  // Setup state
  tabooState.teams = teams;
  tabooState.currentTeamIndex = 0;
  tabooState.currentRound = 1;
  tabooState.totalRounds = totalRounds;
  tabooState.timeLimit = timeLimit;
  tabooState.activeCategories = activeCategories;
  
  // Shuffle cards
  tabooState.cardsPool = tabooShuffleArray(rawPool);
  tabooState.currentCardIndex = 0;

  renderTabooTurnTransition();
}

function renderTabooTurnTransition() {
  const container = document.getElementById('taboo-game-play-area');
  if (!container) return;

  const currentTeam = tabooState.teams[tabooState.currentTeamIndex];

  // Render Scoreboard
  let scoreboardRowsHtml = tabooState.teams.map((t, idx) => {
    const isCurrent = idx === tabooState.currentTeamIndex;
    return `
      <tr class="${isCurrent ? 'current-team' : ''}" style="${isCurrent ? 'font-weight: bold; border-left: 3px solid var(--primary);' : ''}">
        <td>${t.name} ${isCurrent ? ' <span style="font-size: 0.7rem; background: var(--primary); color: black; padding: 2px 6px; border-radius: 4px; font-weight: bold;">UP NEXT</span>' : ''}</td>
        <td style="text-align: right; font-weight: 700;">${t.score} pts</td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="taboo-setup-container" style="max-width: 600px; margin: 0 auto; text-align: center;">
      <div class="taboo-setup-section" style="padding: 30px;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">
          Round ${tabooState.currentRound} of ${tabooState.totalRounds}
        </span>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0 0 16px 0;">
          ${currentTeam.name}'s Turn
        </h2>
        
        <div class="info-alert" style="margin-bottom: 24px; padding: 14px 16px; background: rgba(56, 189, 248, 0.08); border-left: 4px solid var(--primary); text-align: left; border-radius: 4px;">
          <p style="margin: 0; font-size: 0.88rem; line-height: 1.5; color: var(--text-muted);">
            <strong>Guesser:</strong> Sit with your back to the screen.<br>
            <strong>Team Members:</strong> Face the screen and describe the target words. Do NOT use the target word or any of the 5 listed Taboo words!
          </p>
        </div>

        <button id="btn-taboo-start-turn" class="btn-primary" style="width: 100%; padding: 14px; font-weight: 700; font-size: 1.05rem; border-radius: 4px; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 24px;">
          <i class="fa-solid fa-play"></i> Start Turn (${tabooState.timeLimit}s)
        </button>

        <div style="border-top: 1px solid var(--border-glass); padding-top: 20px; text-align: left;">
          <h4 style="margin: 0 0 12px 0; font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Current Standings</h4>
          <table class="taboo-scoreboard-table">
            <thead>
              <tr>
                <th>Team</th>
                <th style="text-align: right;">Total Score</th>
              </tr>
            </thead>
            <tbody>
              ${scoreboardRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-taboo-start-turn').addEventListener('click', () => {
    AudioEngine.play('click');
    startTabooTurn();
  });
}

function startTabooTurn() {
  tabooState.turnScore = 0;
  tabooState.timeLeft = tabooState.timeLimit;
  tabooState.turnLogs = [];
  
  // Render active play screen skeleton
  renderTabooPlayScreen();

  // Draw first card
  drawNextTabooCard();

  // Start timer interval
  const timerBadge = document.getElementById('taboo-timer');
  tabooState.timerInterval = setInterval(() => {
    tabooState.timeLeft--;
    if (timerBadge) {
      timerBadge.textContent = `${tabooState.timeLeft}s`;
      if (tabooState.timeLeft <= 10) {
        timerBadge.classList.add('flashing');
      }
    }

    if (tabooState.timeLeft <= 0) {
      handleTabooTimerEnd();
    }
  }, 1000);
}

function renderTabooPlayScreen() {
  const container = document.getElementById('taboo-game-play-area');
  if (!container) return;

  const currentTeam = tabooState.teams[tabooState.currentTeamIndex];

  container.innerHTML = `
    <div class="taboo-play-wrapper">
      
      <!-- Top Stats Bar -->
      <div class="taboo-timer-container">
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: bold; display: block;">Team Playing</span>
          <strong style="color: var(--primary); font-size: 1rem;">${currentTeam.name}</strong>
        </div>
        <div style="text-align: center;">
          <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: bold; display: block;">Turn Score</span>
          <strong id="taboo-turn-score" style="color: var(--success); font-size: 1.1rem;">0</strong>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: bold; display: block;">Time Left</span>
          <div id="taboo-timer" class="taboo-timer-badge">${tabooState.timeLeft}s</div>
        </div>
      </div>

      <!-- Taboo Card Area -->
      <div id="taboo-card-container" style="width: 100%; display: flex; justify-content: center;">
        <!-- Card gets injected here -->
      </div>

      <!-- Controls -->
      <div style="display: flex; gap: 16px; width: 100%; max-width: 500px; margin-top: 10px;">
        <button id="btn-taboo-skip" class="taboo-btn-red">
          <i class="fa-solid fa-ban"></i> Taboo / Skip (0)
        </button>
        <button id="btn-taboo-correct" class="taboo-btn-green">
          <i class="fa-solid fa-circle-check"></i> Correct (+1)
        </button>
      </div>

      <button id="btn-taboo-end-early" class="btn-secondary" style="margin-top: 16px; padding: 8px 16px; font-size: 0.8rem; font-weight: 600;">
        <i class="fa-solid fa-square-minus"></i> End Turn Early
      </button>

    </div>
  `;

  document.getElementById('btn-taboo-correct').addEventListener('click', () => {
    AudioEngine.play('success');
    recordCardResult(true);
    drawNextTabooCard();
  });

  document.getElementById('btn-taboo-skip').addEventListener('click', () => {
    AudioEngine.play('fail');
    recordCardResult(false);
    drawNextTabooCard();
  });

  document.getElementById('btn-taboo-end-early').addEventListener('click', () => {
    AudioEngine.play('click');
    handleTabooTimerEnd();
  });
}

function recordCardResult(isCorrect) {
  if (!tabooState.currentCard) return;

  if (isCorrect) {
    tabooState.turnScore++;
    document.getElementById('taboo-turn-score').textContent = tabooState.turnScore;
  }

  tabooState.turnLogs.push({
    target: tabooState.currentCard.target,
    status: isCorrect ? 'correct' : 'skip'
  });
}

function drawNextTabooCard() {
  const cardContainer = document.getElementById('taboo-card-container');
  if (!cardContainer) return;

  // Check if we ran out of cards, if so recycle and reshuffle
  if (tabooState.currentCardIndex >= tabooState.cardsPool.length) {
    let rawPool = [];
    tabooState.activeCategories.forEach(cat => {
      if (TABOO_CARDS[cat]) {
        rawPool = rawPool.concat(TABOO_CARDS[cat].map(c => ({ ...c, category: cat })));
      }
    });
    tabooState.cardsPool = tabooShuffleArray(rawPool);
    tabooState.currentCardIndex = 0;
  }

  const card = tabooState.cardsPool[tabooState.currentCardIndex];
  tabooState.currentCard = card;
  tabooState.currentCardIndex++;

  const listItemsHtml = card.taboo.map(word => `
    <div class="taboo-forbidden-word-box">${word}</div>
  `).join('');

  cardContainer.innerHTML = `
    <div class="taboo-game-card glowing">
      <span class="taboo-card-category-badge">${card.category}</span>
      <h2 class="taboo-card-target-word">${card.target}</h2>
      
      <div class="taboo-card-forbidden-section">
        <span class="taboo-forbidden-title">🚫 Forbidden Taboo Words:</span>
        <div class="taboo-forbidden-words-container">
          ${listItemsHtml}
        </div>
      </div>
    </div>
  `;
}

function handleTabooTimerEnd() {
  if (tabooState.timerInterval) {
    clearInterval(tabooState.timerInterval);
    tabooState.timerInterval = null;
  }

  // Save score to active team
  const currentTeam = tabooState.teams[tabooState.currentTeamIndex];
  currentTeam.score += tabooState.turnScore;

  // Render Turn Summary Screen
  const container = document.getElementById('taboo-game-play-area');
  if (!container) return;

  let logsHtml = tabooState.turnLogs.map(log => `
    <div style="display: flex; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 0.88rem;">
      <span style="color: #fff; font-weight: 500;">${log.target}</span>
      <span style="font-weight: 700; color: ${log.status === 'correct' ? 'var(--success)' : 'var(--accent)'}; font-size: 0.75rem; text-transform: uppercase;">
        ${log.status === 'correct' ? '✓ Correct' : '✗ Skipped'}
      </span>
    </div>
  `).join('');

  if (tabooState.turnLogs.length === 0) {
    logsHtml = `<p style="margin: 0; text-align: center; font-size: 0.88rem; color: var(--text-muted); padding: 12px 0;">No words played this turn.</p>`;
  }

  container.innerHTML = `
    <div class="taboo-setup-container" style="max-width: 600px; margin: 0 auto; text-align: center;">
      <div class="taboo-setup-section" style="padding: 30px;">
        <span style="font-size: 2.5rem; color: var(--success); display: block; margin-bottom: 12px;">⏰</span>
        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #fff; margin: 0 0 8px 0;">Turn Completed!</h2>
        <p style="margin: 0 0 24px 0; color: var(--text-muted); font-size: 0.95rem;">
          <strong>${currentTeam.name}</strong> scored <strong style="color: var(--success); font-size: 1.15rem;">+${tabooState.turnScore}</strong> points this round.
        </p>

        <!-- Turn Log -->
        <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--border-glass); border-radius: 4px; padding: 14px; text-align: left; margin-bottom: 24px; max-height: 200px; overflow-y: auto;">
          <h4 style="margin: 0 0 10px 0; font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Round Log</h4>
          ${logsHtml}
        </div>

        <button id="btn-taboo-next-turn" class="btn-primary" style="width: 100%; padding: 14px; font-weight: 700; font-size: 1.05rem; border-radius: 4px; display: flex; align-items: center; justify-content: center; gap: 8px;">
          Continue <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-taboo-next-turn').addEventListener('click', () => {
    AudioEngine.play('click');
    progressTabooGame();
  });
}

function progressTabooGame() {
  // Move to next team
  tabooState.currentTeamIndex++;
  
  // Check if round is complete (i.e. all teams have played)
  if (tabooState.currentTeamIndex >= tabooState.teams.length) {
    tabooState.currentTeamIndex = 0;
    tabooState.currentRound++;
  }

  // Check if game is complete (all rounds completed)
  if (tabooState.currentRound > tabooState.totalRounds) {
    endTabooGame();
  } else {
    renderTabooTurnTransition();
  }
}

function endTabooGame() {
  const container = document.getElementById('taboo-game-play-area');
  if (!container) return;

  // Play cheer audio
  AudioEngine.play('cheer');

  // Trigger confetti
  Confetti.trigger();

  // Find winner(s)
  let maxScore = -1;
  tabooState.teams.forEach(t => {
    if (t.score > maxScore) maxScore = t.score;
  });

  const winners = tabooState.teams.filter(t => t.score === maxScore);
  let winMessage = "";
  if (winners.length === 1) {
    winMessage = `<strong style="color: var(--primary); font-size: 1.5rem;">👑 ${winners[0].name} Wins!</strong>`;
  } else {
    winMessage = `<strong style="color: var(--primary); font-size: 1.4rem;">🤝 It's a Tie between: ${winners.map(w => w.name).join(', ')}!</strong>`;
  }

  // Scoreboard rows sorted descending
  const sortedTeams = [...tabooState.teams].sort((a, b) => b.score - a.score);
  let scoreboardRowsHtml = sortedTeams.map((t, idx) => {
    const isWinner = t.score === maxScore;
    return `
      <tr style="${isWinner ? 'font-weight: bold; background: rgba(16, 185, 129, 0.05);' : ''}">
        <td>
          <span style="font-weight: bold; margin-right: 12px; color: var(--text-muted); font-size: 0.85rem;">#${idx + 1}</span>
          ${t.name} ${isWinner ? ' 🏆' : ''}
        </td>
        <td style="text-align: right; font-weight: 700; color: ${isWinner ? 'var(--success)' : ''};">${t.score} pts</td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="taboo-setup-container" style="max-width: 600px; margin: 0 auto; text-align: center;">
      <div class="taboo-setup-section" style="padding: 40px 30px;">
        <span style="font-size: 3.5rem; display: block; margin-bottom: 12px;">🏆</span>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0 0 12px 0;">Taboo Revision Completed!</h2>
        
        <div style="margin-bottom: 28px; padding: 14px 20px; background: rgba(56, 189, 248, 0.05); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); display: inline-block;">
          ${winMessage}
        </div>

        <div style="text-align: left; margin-bottom: 28px;">
          <h4 style="margin: 0 0 12px 0; font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Final Results</h4>
          <table class="taboo-scoreboard-table">
            <thead>
              <tr>
                <th>Team</th>
                <th style="text-align: right;">Final Score</th>
              </tr>
            </thead>
            <tbody>
              ${scoreboardRowsHtml}
            </tbody>
          </table>
        </div>

        <button id="btn-taboo-reset" class="btn-primary" style="width: 100%; padding: 14px; font-weight: 700; font-size: 1.05rem; border-radius: 4px; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i class="fa-solid fa-rotate-left"></i> Play Again
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-taboo-reset').addEventListener('click', () => {
    AudioEngine.play('click');
    initTabooGame();
  });
}

function renderKeyTopicOverview(topicId) {
  const data = KEY_TOPICS_OVERVIEWS[topicId];
  if (!data) return;

  const container = document.getElementById('key-topic-content-container');
  if (!container) return;

  // Calculate Key Topic Progress
  const quizTopic = QUIZ_DATA.find(t => t.id === topicId);
  const subtopics = quizTopic ? quizTopic.subtopics : [];
  
  let totalQs = 0;
  let totalMastered = 0;
  subtopics.forEach(sub => {
    const subQs = state.allQuestions.filter(q => q.subtopicId === sub.id);
    totalQs += subQs.length;
    totalMastered += subQs.filter(q => state.mastery[q.id]).length;
  });
  const overallPct = totalQs > 0 ? Math.round((totalMastered / totalQs) * 100) : 0;

  // Build Subtopics Portal HTML
  let subtopicsHtml = '';
  subtopics.forEach(sub => {
    const subQs = state.allQuestions.filter(q => q.subtopicId === sub.id);
    const subMastered = subQs.filter(q => state.mastery[q.id]).length;
    const pct = subQs.length > 0 ? Math.round((subMastered / subQs.length) * 100) : 0;
    const cleanTitle = sub.title.replace(/^Topic \d\.\d:\s*/, "");
    const subNum = sub.title.match(/Topic\s(\d\.\d)/)?.[1] || "";
    
    subtopicsHtml += `
      <div class="key-topic-subtopic-card" style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); padding: 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; transition: all var(--transition-normal); cursor: pointer;" onclick="window.switchView('subtopic', '${sub.id}')">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; color: var(--primary); letter-spacing: 0.5px;">LESSON ${subNum}</span>
            <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted);">${pct}% Mastered</span>
          </div>
          <h3 style="font-size: 0.95rem; font-weight: 600; margin: 0; line-height: 1.3; color: var(--text-main);">${cleanTitle}</h3>
        </div>
        <div style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 600; color: var(--primary); align-self: flex-end;">
          Study Lesson <i class="fa-solid fa-arrow-right"></i>
        </div>
      </div>
    `;
  });

  if (data.timeline) {
    // Overhauled Key Topic Overview (generalized for all topics)
    // Build Timeline Nodes HTML
    let timelineNodesHtml = '';
    data.timeline.forEach((event, idx) => {
      timelineNodesHtml += `
        <div class="timeline-node-item" data-event-index="${idx}" style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div class="timeline-node-circle" style="width: 20px; height: 20px; border-radius: 50%; background: var(--bg-card); border: 3px solid var(--primary); box-shadow: var(--shadow-sm); transition: all var(--transition-fast); display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 0.5rem;">
            <i class="fa-solid fa-circle" style="opacity: 0; transition: opacity var(--transition-fast);"></i>
          </div>
          <div class="timeline-node-label" style="margin-top: 8px; text-align: center; display: flex; flex-direction: column; align-items: center;">
            <span class="timeline-node-year" style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; color: var(--primary);">${event.year}</span>
            <span class="timeline-node-title" style="font-size: 0.72rem; color: var(--text-muted); max-width: 110px; line-height: 1.2; font-weight: 600;">${event.title}</span>
          </div>
        </div>
      `;
    });

    // Build Sliders HTML
    let slidersHtml = '';
    data.sliders.forEach(slider => {
      slidersHtml += `
        <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); padding: 14px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid ${slider.icon}" style="color: var(--primary); font-size: 0.9rem;"></i> ${slider.label}
            </span>
            <span id="slider-badge-${slider.id}" style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; color: var(--primary);">50%</span>
          </div>
          <input type="range" class="key-topic-slider" id="input-slider-${slider.id}" min="0" max="100" value="50" style="width: 100%; cursor: pointer;">
          <div id="slider-tip-${slider.id}" style="font-size: 0.78rem; line-height: 1.4; color: var(--text-muted); min-height: 38px; border-top: 1px dashed var(--border-glass); padding-top: 6px; margin-top: 4px;">
            <!-- Injected by dynamic logic -->
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <!-- Top Progress Banner -->
      <div style="background: var(--gradient-hero); padding: 24px; border-radius: var(--border-radius-md); border: 1px solid var(--border-glass); margin-bottom: 24px; box-shadow: var(--shadow-md); position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 12px;">
        <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; color: var(--text-main); margin: 0; line-height: 1.3;">
          ${data.title}
        </h2>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Key Topic Progress: ${overallPct}% Complete</span>
          <div style="background: rgba(255,255,255,0.05); border-radius: 12px; height: 10px; width: 150px; overflow: hidden;">
            <div style="background: var(--gradient-main); height: 100%; width: ${overallPct}%;"></div>
          </div>
        </div>
      </div>

      <!-- Historical Context Overview (Full Width) -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); padding: 20px; box-shadow: var(--shadow-sm); margin-bottom: 24px;">
        <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-book-open"></i> Historical Context Overview
        </h3>
        <p style="font-size: 0.92rem; line-height: 1.6; color: var(--text-muted); margin: 0; text-align: justify;">
          ${data.overview}
        </p>
      </div>

      <!-- Component A: Responsive timeline (Full Width) -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); padding: 24px 30px; box-shadow: var(--shadow-sm); position: relative; margin-bottom: 24px;">
        <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-timeline"></i> Mental Map Timeline, ${data.title.split(', ').pop()}
        </h3>
        <div class="key-topic-timeline" style="position: relative; margin: 30px 0;">
          ${timelineNodesHtml}
        </div>
        <div style="text-align: center; font-size: 0.72rem; color: var(--text-muted); margin-top: 12px; border-top: 1px dashed var(--border-glass); padding-top: 8px;">
          <i class="fa-solid fa-circle-info"></i> Click or tap any year to reveal historical details & sources.
        </div>
      </div>

      <!-- Lower Content Columns -->
      <div class="key-topic-columns" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; align-items: start;">
        <!-- Left Column: Key Topic Lessons -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-graduation-cap"></i> Key Topic Lessons
            </h3>
            <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
              ${subtopicsHtml}
            </div>
          </div>
        </div>

        <!-- Right Column: Revision Flashcards & Sliders -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Component B: Dynamic Flashcard Revision Widget -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); padding: 20px; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-layer-group"></i> Key Topic Revision Flashcards
            </h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 16px 0; line-height: 1.4;">
              Toggle subtopics to customize your study pool, click the card to flip, and test your mastery:
            </p>
            <div id="overview-subtopic-toggles" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;"></div>
            <div id="overview-flashcard-stage-container"></div>
          </div>

          <!-- Component C: Weighing Sliders -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); padding: 20px; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-sliders"></i> Analytical Weighting: What Drove Progress?
            </h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 16px 0; line-height: 1.4;">
              Adjust the sliders below to weigh the relative influence of these historical factors. Drag any slider to review its context tip:
            </p>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${slidersHtml}
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Modal Overlay (glassmorphism details card) -->
      <div id="timeline-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
        <div id="timeline-modal-content" style="background: var(--bg-card); border: 1px solid var(--border-active); border-radius: var(--border-radius-md); padding: 24px; max-width: 500px; width: 90%; box-shadow: var(--shadow-lg); position: relative; transform: scale(0.9); transition: transform 0.3s ease; display: flex; flex-direction: column; gap: 16px;">
          <button id="btn-timeline-modal-close" style="position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 1.2rem; color: var(--text-muted); cursor: pointer; transition: color var(--transition-fast);"><i class="fa-solid fa-xmark"></i></button>
          <div>
            <span id="timeline-modal-year" style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; color: var(--primary); letter-spacing: 0.5px; text-transform: uppercase;">1954</span>
            <h3 id="timeline-modal-title" style="margin: 4px 0 0 0; font-size: 1.2rem; font-weight: 600; color: var(--text-main); line-height: 1.3;">Brown v. Board of Education</h3>
          </div>
          <ul id="timeline-modal-bullets" style="padding-left: 20px; font-size: 0.85rem; line-height: 1.5; color: var(--text-normal); margin: 0; display: flex; flex-direction: column; gap: 8px;"></ul>
          <div style="background: rgba(230, 92, 0, 0.05); border-left: 3px solid var(--primary); padding: 12px; border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0; font-size: 0.82rem; line-height: 1.4; color: var(--text-muted); font-style: italic;">
            "<span id="timeline-modal-quote"></span>"
            <div id="timeline-modal-author" style="text-align: right; font-size: 0.72rem; font-weight: 600; margin-top: 6px; font-style: normal; color: var(--text-normal);"></div>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); border-top: 1px dashed var(--border-glass); padding-top: 10px;">
            <strong>Key Figures:</strong> <span id="timeline-modal-figures" style="color: var(--text-normal); font-weight: 600;"></span>
          </div>
        </div>
      </div>
    `;

    // Modal logic
    const overlay = document.getElementById('timeline-modal-overlay');
    const modalContent = document.getElementById('timeline-modal-content');
    const closeBtn = document.getElementById('btn-timeline-modal-close');
    const nodes = container.querySelectorAll('.timeline-node-item');

    function openModal(idx) {
      const event = data.timeline[idx];
      if (!event) return;
      AudioEngine.play('click');
      
      document.getElementById('timeline-modal-year').textContent = event.year;
      document.getElementById('timeline-modal-title').textContent = event.title;
      document.getElementById('timeline-modal-quote').textContent = event.quote;
      document.getElementById('timeline-modal-author').textContent = event.author;
      document.getElementById('timeline-modal-figures').textContent = event.figures.join(', ');
      
      const bulletsUl = document.getElementById('timeline-modal-bullets');
      bulletsUl.innerHTML = '';
      event.bullets.forEach(b => {
        const li = document.createElement('li');
        li.textContent = b;
        bulletsUl.appendChild(li);
      });
      
      overlay.style.display = 'flex';
      setTimeout(() => {
        overlay.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
      }, 20);
    }

    function closeModal() {
      overlay.style.opacity = '0';
      modalContent.style.transform = 'scale(0.9)';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    }

    nodes.forEach(n => {
      n.addEventListener('click', () => {
        const idx = parseInt(n.getAttribute('data-event-index'));
        openModal(idx);
      });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Overview Flashcard Session Logic
    let activeSubtopicIds = subtopics.map(sub => sub.id);
    let currentQuestion = null;
    let reinforcing = false;
    let reinforceMcq = null;

    function getFilteredPool() {
      return state.allQuestions.filter(q => activeSubtopicIds.includes(q.subtopicId));
    }

    function selectNewRandomCard() {
      const pool = getFilteredPool();
      if (pool.length === 0) {
        currentQuestion = null;
        return;
      }
      let nextQ = currentQuestion;
      let attempts = 0;
      while ((nextQ === currentQuestion || !nextQ) && attempts < 10 && pool.length > 1) {
        nextQ = pool[Math.floor(Math.random() * pool.length)];
        attempts++;
      }
      if (pool.length === 1 || attempts >= 10) {
        nextQ = pool[Math.floor(Math.random() * pool.length)];
      }
      currentQuestion = nextQ;
      reinforcing = false;
      reinforceMcq = null;
    }

    function renderToggles() {
      const togglesContainer = document.getElementById('overview-subtopic-toggles');
      if (!togglesContainer) return;
      togglesContainer.innerHTML = '';
      
      subtopics.forEach(sub => {
        const subNum = sub.title.match(/Topic\s(\d\.\d)/)?.[1] || sub.title;
        const isActive = activeSubtopicIds.includes(sub.id);
        
        const btn = document.createElement('button');
        btn.className = `btn-subtopic-toggle ${isActive ? 'active' : ''}`;
        btn.textContent = `Lesson ${subNum}`;
        btn.title = sub.title.replace(/^Topic \d\.\d:\s*/, "");
        
        btn.style.padding = '6px 12px';
        btn.style.fontSize = '0.8rem';
        btn.style.borderRadius = '20px';
        btn.style.fontWeight = '600';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all var(--transition-fast)';
        btn.style.border = isActive ? '1px solid var(--primary)' : '1px solid var(--border-glass)';
        btn.style.background = isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)';
        btn.style.color = isActive ? '#fff' : 'var(--text-muted)';
        
        btn.addEventListener('click', () => {
          AudioEngine.play('click');
          if (isActive) {
            if (activeSubtopicIds.length > 1) {
              activeSubtopicIds = activeSubtopicIds.filter(id => id !== sub.id);
            } else {
              btn.style.animation = 'shake 0.4s ease-in-out';
              setTimeout(() => btn.style.animation = '', 400);
              return;
            }
          } else {
            activeSubtopicIds.push(sub.id);
          }
          renderToggles();
          selectNewRandomCard();
          renderCard();
        });
        togglesContainer.appendChild(btn);
      });
    }

    function handleOverviewMcqSelection(selectedIndex, clickedBtn, reinforceContainer, cardEl, q) {
      const optionBtns = reinforceContainer.querySelectorAll('.overview-mcq-option');
      optionBtns.forEach(btn => {
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
      });

      const isCorrect = selectedIndex === reinforceMcq.correctIndex;
      
      if (isCorrect) {
        AudioEngine.play('success');
        clickedBtn.classList.add('correct');
        setMastered(q.id, true);
        
        setTimeout(() => {
          cardEl.className = 'flashcard-card flipped swipe-right';
          setTimeout(() => {
            selectNewRandomCard();
            renderCard();
          }, 300);
        }, 1200);
      } else {
        AudioEngine.play('fail');
        clickedBtn.classList.add('incorrect');
        
        optionBtns.forEach((btn, idx) => {
          if (idx === reinforceMcq.correctIndex) {
            btn.classList.add('correct');
          }
        });
        setMastered(q.id, false);
        
        setTimeout(() => {
          cardEl.className = 'flashcard-card flipped swipe-left';
          setTimeout(() => {
            selectNewRandomCard();
            renderCard();
          }, 300);
        }, 2200);
      }
    }

    function renderCard() {
      const stageContainer = document.getElementById('overview-flashcard-stage-container');
      if (!stageContainer) return;
      
      if (!currentQuestion) {
        stageContainer.innerHTML = `
          <div style="background: rgba(255,255,255,0.01); border: 1px dashed var(--border-glass); border-radius: var(--border-radius-md); padding: 40px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
            <i class="fa-solid fa-face-frown" style="font-size: 2rem; color: var(--primary); margin-bottom: 12px; display: block;"></i>
            No flashcards available. Please enable at least one subtopic lesson.
          </div>
        `;
        return;
      }

      const q = currentQuestion;
      const isBookmarked = state.bookmarks.includes(q.id);
      const ktLabel = formatSubtopicIdToKT(q.subtopicId);

      let mcqOptionsHtml = '';
      if (reinforcing && reinforceMcq) {
        reinforceMcq.options.forEach((opt, idx) => {
          mcqOptionsHtml += `
            <button class="overview-mcq-option" data-index="${idx}" style="width: 100%; text-align: left; padding: 8px 12px; font-size: 0.75rem; line-height: 1.3; border-radius: var(--border-radius-sm); border: 1px solid var(--border-glass); background: rgba(255,255,255,0.03); color: var(--text-main); cursor: pointer; transition: all var(--transition-fast);">
              ${opt}
            </button>
          `;
        });
      }

      stageContainer.innerHTML = `
        <div class="overview-flashcard-stage" style="perspective: 1000px; position: relative; width: 100%; height: 380px; margin-bottom: 16px;">
          <div class="flashcard-card" id="overview-flashcard-card" style="cursor: pointer; position: absolute; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-lg);">
            <!-- Front Face -->
            <div class="flashcard-face flashcard-front" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: var(--border-radius-lg); border: 1px solid var(--border-glass); padding: 20px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; background-color: var(--bg-card); background-image: radial-gradient(circle at 10% 20%, rgba(168, 85, 247, 0.05) 0%, transparent 40%);">
              <div class="card-top" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span class="badge ${q.type === 'standard' ? 'badge-standard' : 'badge-depth'}">${q.type === 'standard' ? 'Standard' : 'Top Tier Trivia'}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 0.82rem; font-weight: 700; color: var(--primary);">${ktLabel}</span>
                  <span class="bookmark-icon-container ${isBookmarked ? 'bookmarked' : ''}" data-qid="${q.id}" style="cursor: pointer;"><i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-star" style="color: var(--primary);"></i></span>
                </div>
              </div>
              <div class="card-body" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 10px 0;">
                <h3 class="card-question" style="font-size: 0.95rem; font-weight: 600; line-height: 1.4; text-align: center; margin: 0; color: var(--text-main); max-width: 90%;">${q.question}</h3>
              </div>
              <div class="card-bottom" style="text-align: center; font-size: 0.72rem; color: var(--text-muted); font-weight: 500;"><i class="fa-solid fa-rotate"></i> Click card to flip and reveal answer</div>
            </div>
            <!-- Back Face -->
            <div class="flashcard-face flashcard-back" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: var(--border-radius-lg); border: 1px solid var(--border-active); padding: 20px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; background-color: var(--bg-card-hover); background-image: radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 40%); transform: rotateY(180deg);">
              <div class="card-top" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span class="badge ${q.type === 'standard' ? 'badge-standard' : 'badge-depth'}">${q.type === 'standard' ? 'Standard' : 'Top Tier Trivia'}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 0.82rem; font-weight: 700; color: var(--primary);">${ktLabel}</span>
                  <span class="bookmark-icon-container ${isBookmarked ? 'bookmarked' : ''}" data-qid="${q.id}" style="cursor: pointer;"><i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-star" style="color: var(--primary);"></i></span>
                </div>
              </div>
              
              <!-- Standard back body (Question detail) -->
              <div id="overview-flashcard-back-standard-body" style="display: ${reinforcing ? 'none' : 'flex'}; flex-direction: column; flex: 1; padding: 10px 0; overflow-y: auto; text-align: center; justify-content: center; gap: 4px;">
                <span class="card-answer-label" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 700; margin-bottom: 2px;">Correct Answer</span>
                <h2 class="card-answer-text" style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin: 0 0 6px 0; line-height: 1.2;">${q.answer}</h2>
                <p class="card-explanation-text" style="font-size: 0.78rem; line-height: 1.45; color: var(--text-muted); margin: 0; max-height: 160px; overflow-y: auto;">${q.explanation}</p>
              </div>

              <!-- MCQ reinforce back body -->
              <div id="overview-flashcard-back-reinforce-body" style="display: ${reinforcing ? 'flex' : 'none'}; flex-direction: column; flex: 1; padding: 8px 0; text-align: center; justify-content: center; gap: 6px; overflow-y: auto;">
                <span class="card-answer-label" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--primary); font-weight: 700;">🧠 Double-Check Understanding</span>
                <h4 id="overview-flashcard-reinforce-question" style="font-size: 0.78rem; font-weight: 600; line-height: 1.3; margin: 0 0 6px 0; color: var(--text-main);">${reinforceMcq ? reinforceMcq.prompt : ''}</h4>
                <div id="overview-flashcard-reinforce-options" style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
                  ${mcqOptionsHtml}
                </div>
              </div>
              
              <div class="card-bottom" style="text-align: center; font-size: 0.72rem; color: var(--text-muted); font-weight: 500;"><i class="fa-solid fa-rotate"></i> Click card to flip back</div>
            </div>
          </div>
        </div>
        
        <div class="overview-flashcard-controls" style="display: flex; justify-content: center; gap: 12px; margin-top: 12px; height: 38px; align-items: center;">
          <button class="btn-secondary" id="overview-btn-flashcard-reveal" style="padding: 8px 16px; font-size: 0.82rem; border-radius: 4px; font-weight: 600; cursor: pointer; transition: all var(--transition-fast); display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-rotate"></i> Flip Card
          </button>
          <div id="overview-flashcard-self-grade-actions" style="display: none; width: 100%; gap: 12px; justify-content: center;">
            <button class="btn-incorrect" id="overview-btn-flashcard-incorrect" style="padding: 8px 14px; font-size: 0.8rem; border-radius: 4px; font-weight: 600; cursor: pointer; transition: all var(--transition-fast); display: flex; align-items: center; gap: 6px; border: 1px solid var(--danger); background: rgba(239, 68, 68, 0.05); color: var(--danger);">
              <i class="fa-solid fa-xmark"></i> Study Again
            </button>
            <button class="btn-correct" id="overview-btn-flashcard-correct" style="padding: 8px 14px; font-size: 0.8rem; border-radius: 4px; font-weight: 600; cursor: pointer; transition: all var(--transition-fast); display: flex; align-items: center; gap: 6px; border: 1px solid var(--success); background: rgba(16, 185, 129, 0.05); color: var(--success);">
              <i class="fa-solid fa-check"></i> Got It!
            </button>
          </div>
        </div>
      `;

      const cardEl = document.getElementById('overview-flashcard-card');
      const revealBtn = document.getElementById('overview-btn-flashcard-reveal');
      const gradeActions = document.getElementById('overview-flashcard-self-grade-actions');

      cardEl.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('.bookmark-icon-container')) {
          return;
        }
        if (reinforcing) {
          cardEl.style.animation = 'shake 0.4s ease-in-out';
          setTimeout(() => cardEl.style.animation = '', 400);
          return;
        }
        cardEl.classList.toggle('flipped');
        AudioEngine.play('flip');
        updateControlsVisibility();
      });

      revealBtn.addEventListener('click', () => {
        cardEl.classList.add('flipped');
        AudioEngine.play('flip');
        updateControlsVisibility();
      });

      function updateControlsVisibility() {
        const isFlipped = cardEl.classList.contains('flipped');
        if (isFlipped && !reinforcing) {
          revealBtn.style.display = 'none';
          gradeActions.style.display = 'flex';
        } else if (reinforcing) {
          revealBtn.style.display = 'none';
          gradeActions.style.display = 'none';
        } else {
          revealBtn.style.display = 'flex';
          gradeActions.style.display = 'none';
        }
      }

      updateControlsVisibility();

      document.getElementById('overview-btn-flashcard-incorrect').addEventListener('click', () => {
        AudioEngine.play('fail');
        setMastered(q.id, false);
        cardEl.className = 'flashcard-card flipped swipe-left';
        setTimeout(() => {
          selectNewRandomCard();
          renderCard();
        }, 300);
      });

      document.getElementById('overview-btn-flashcard-correct').addEventListener('click', () => {
        AudioEngine.play('success');
        setMastered(q.id, true);
        cardEl.className = 'flashcard-card flipped swipe-right';
        setTimeout(() => {
          selectNewRandomCard();
          renderCard();
        }, 300);
      });

      // Attach bookmarks listeners
      const bkmkBtns = stageContainer.querySelectorAll('.bookmark-icon-container');
      bkmkBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const qid = btn.getAttribute('data-qid');
          toggleBookmark(qid);
          const isNowBookmarked = state.bookmarks.includes(qid);
          bkmkBtns.forEach(b => {
            b.className = `bookmark-icon-container ${isNowBookmarked ? 'bookmarked' : ''}`;
            b.querySelector('i').className = isNowBookmarked ? 'fa-solid fa-star' : 'fa-regular fa-star';
          });
        });
      });
    }

    selectNewRandomCard();
    renderToggles();
    renderCard();

    // Weighing sliders logic
    data.sliders.forEach(slider => {
      const input = document.getElementById(`input-slider-${slider.id}`);
      const badge = document.getElementById(`slider-badge-${slider.id}`);
      
      const updateFn = (value) => {
        badge.textContent = `${value}%`;
        
        // Choose context tip index
        let tipIdx = 0;
        if (value > 33 && value <= 66) tipIdx = 1;
        else if (value > 66) tipIdx = 2;
        
        const tipContainer = document.getElementById(`slider-tip-${slider.id}`);
        if (tipContainer) {
          tipContainer.innerHTML = `<strong>Analysis (${value}%):</strong> ${slider.tips[tipIdx]}`;
        }
      };

      // Initial update
      updateFn(50);

      input.addEventListener('input', (e) => {
        updateFn(e.target.value);
      });
    });
  }
}

export {
  renderSidebarNav,
  updateBookmarksUI,
  updateGlobalStats,
  renderDashboard,
  highlightCausalConnectives,
  renderGamesView,
  renderExamSkillsView,
  renderClassicView,
  startFlashcardSession,
  renderFlashcard,
  handleFlashcardGrade,
  showFlashcardCompletion,
  restoreFlashcardSkeleton,
  flipFlashcard,
  renderTimelineView,
  evaluateStudentAnswer,
  renderBookmarksView,
  initMasteryMatchGame,
  initDecisionsGame,
  initMindMapGame,
  initExamLeaderboard,
  initTabooGame,
  renderKeyTopicOverview
};



