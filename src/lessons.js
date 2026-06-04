import { LESSONS_DATA } from './lessons_data.js';
import { state } from './state.js';
import { switchView } from './navigation.js';
import { renderSidebarNav, updateGlobalStats } from './views.js';
import { saveProgress } from './storage.js';
import { AudioEngine } from './audio.js';
import { Confetti } from './confetti.js';
import { QUIZ_DATA } from '../questions.js';
import { highlightModelQuotes } from './layout.js';
import { VIDEOS_DATA } from './videos_data.js';
import { HOMEWORK_QUESTIONS } from './homework_data.js';
import { getImageWebLink } from './image_links.js';
import { SPEC_CHECKLIST_DATA } from './spec_checklist_data.js';
import { WRAPUP_DATA } from './wrapup_data.js';

const GLOSSARY_DB = {
  "segregation": "The legally or socially enforced separation of different racial groups in public spaces, housing, or education.",
  "desegregation": "The process of ending the separation of racial groups, particularly in schools, transport, and public spaces.",
  "unconstitutional": "Not in accordance with a country's constitution, meaning it is legally invalid and void.",
  "constitution": "The supreme set of laws governing a nation, defining the powers of government and the rights of citizens.",
  "jurisdiction": "The official power to make legal decisions and judgments over a specific area or group of people.",
  "provocation": "An action or speech that deliberately makes someone annoyed or angry, often to elicit a hostile response.",
  "provenance": "The origin, background, context, and history of a source (who made it, when, where, and why).",
  "grassroots": "Local or community-level activism and organization, driven by ordinary citizens rather than political leaders.",
  "attrition": "A strategy of wearing down an opponent's strength and resources over time through continuous pressure.",
  "historiography": "The study of how history is written, focusing on different interpretations and perspectives of historians over time.",
  "orthodox": "The traditional, widely accepted historical interpretation of an event.",
  "revisionist": "A historical interpretation that challenges and revises traditional, orthodox views with new evidence or perspectives.",
  "litigation": "The process of taking legal action through the courts to enforce rights or resolve disputes.",
  "disenfranchisement": "The revocation of the right of suffrage (the right to vote) of a person or group of people.",
  "disfranchisement": "The revocation of the right of suffrage (the right to vote) of a person or group of people.",
  "integration": "The free association of people from all racial groups in public facilities, schools, and communities.",
  "boycott": "A punitive ban on relations with a product, organization, or country, as a form of protest.",
  "federalised": "Placing state forces or organizations under the direct command of the national (federal) government.",
  "federalized": "Placing state forces or organizations under the direct command of the national (federal) government.",
  "non-violence": "The practice of achieving social or political goals through peaceful protest and civil disobedience without physical force.",
  "non-violent": "The practice of achieving social or political goals through peaceful protest and civil disobedience without physical force.",
  "sovereignty": "The supreme authority and self-governing power of a state or territory.",
  "credibility": "The quality of being trusted and believed in as a source of historical evidence."
};

let highlightedKeywords = new Set();

function applyGlossaryTooltips(text) {
  if (!text) return '';
  let parsedText = text;
  
  const sortedTerms = Object.keys(GLOSSARY_DB).sort((a, b) => b.length - a.length);
  
  for (const term of sortedTerms) {
    const termLower = term.toLowerCase();
    
    // Skip if this keyword was already highlighted in this lesson
    if (highlightedKeywords.has(termLower)) {
      continue;
    }
    
    const definition = GLOSSARY_DB[term].replace(/"/g, '&quot;');
    const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(<[^>]*>)|\\b(${escapedTerm})(s|d|ly|dness)?\\b`, 'gi');
    
    let replacedOnce = false;
    parsedText = parsedText.replace(regex, (match, isTag, word, suffix) => {
      if (isTag) return match;
      if (replacedOnce || highlightedKeywords.has(termLower)) return match;
      
      replacedOnce = true;
      highlightedKeywords.add(termLower);
      const fullWord = suffix ? word + suffix : word;
      return `<span class="glossary-term" data-definition="${definition}">${fullWord}</span>`;
    });
  }
  
  return parsedText;
}

function parseSummaryCorrectionText(text) {
  if (!text) return '';
  return text.replace(/\[\[(.*?)\]\]/g, (match, content) => {
    if (content.includes('->')) {
      const [wrong, right] = content.split('->').map(s => s.trim());
      return `<span class="summary-wrong-word" data-correct="${right}" data-wrong="${wrong}">${wrong}</span>`;
    } else {
      return content.trim();
    }
  });
}

function getVaultLegendHTML(subtopicId) {
  if (!subtopicId) return '';
  if (subtopicId.endsWith('_2')) {
    return `
      <div class="model-answer-key" style="margin-top: 12px; border: 1px solid rgba(16, 185, 129, 0.2); background: rgba(0, 0, 0, 0.2);">
        <span class="model-key-title">Key:</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #f97316;"></span> Point</span>
        <span class="model-key-item"><span class="model-key-dot" style="border-bottom: 2px dotted #10b981; border-radius: 0; width: 12px; height: 4px; margin-top: -4px; background: transparent;"></span> Own Knowledge</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #a855f7;"></span> Therefore Link Back</span>
      </div>
    `;
  } else if (subtopicId.endsWith('_3')) {
    return `
      <div class="model-answer-key" style="margin-top: 12px; border: 1px solid rgba(16, 185, 129, 0.2); background: rgba(0, 0, 0, 0.2);">
        <span class="model-key-title">Key:</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #f97316;"></span> Source Quotes</span>
        <span class="model-key-item"><span class="model-key-dot" style="border-bottom: 2px dotted #10b981; border-radius: 0; width: 12px; height: 4px; margin-top: -4px; background: transparent;"></span> Contextual Knowledge</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #a855f7;"></span> Provenance</span>
      </div>
    `;
  } else if (subtopicId.endsWith('_1')) {
    return `
      <div class="model-answer-key" style="margin-top: 12px; border: 1px solid rgba(16, 185, 129, 0.2); background: rgba(0, 0, 0, 0.2);">
        <span class="model-key-title">Key:</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #f97316;"></span> Source Quotes</span>
        <span class="model-key-item"><span class="model-key-dot" style="border-bottom: 2px dotted #10b981; border-radius: 0; width: 12px; height: 4px; margin-top: -4px; background: transparent;"></span> Own Knowledge</span>
      </div>
    `;
  } else if (subtopicId.endsWith('_4')) {
    return `
      <div class="model-answer-key" style="margin-top: 12px; border: 1px solid rgba(16, 185, 129, 0.2); background: rgba(0, 0, 0, 0.2);">
        <span class="model-key-title">Key:</span>
        <span class="model-key-item"><span class="model-key-dot" style="background-color: #3b82f6;"></span> Interpretation Quotes</span>
        <span class="model-key-item"><span class="model-key-dot" style="border-bottom: 2px dotted #10b981; border-radius: 0; width: 12px; height: 4px; margin-top: -4px; background: transparent;"></span> Contextual Knowledge</span>
      </div>
    `;
  }
  return '';
}

export function renderSpecChecklistCard(subtopicId, checklist) {
  if (!checklist || checklist.length === 0) return '';
  
  let checkedStates = {};
  try {
    const saved = localStorage.getItem('edexcel_spec_checklist');
    if (saved) {
      checkedStates = JSON.parse(saved);
    }
  } catch (e) {
    console.error(e);
  }

  const itemsHtml = checklist.map((item, idx) => {
    const key = `${subtopicId}_${idx}`;
    const isChecked = checkedStates[key] || false;
    
    const keyFactsHtml = item.keyFacts.map(fact => `
      <li style="margin-bottom: 8px; font-size: 0.88rem; line-height: 1.5; color: var(--text-muted); position: relative; padding-left: 18px; list-style-type: none;">
        <span style="position: absolute; left: 0; top: 0; color: var(--primary); font-size: 1.1rem; line-height: 1;">&bull;</span>
        ${applyGlossaryTooltips(fact)}
      </li>
    `).join('');

    return `
      <div class="spec-checklist-item ${isChecked ? 'checked' : ''}" data-key="${key}">
        <div class="spec-checklist-main" style="display: flex; align-items: flex-start; gap: 12px; width: 100%;">
          <div class="spec-checklist-checkbox">
            <i class="fa-solid fa-check"></i>
          </div>
          <div class="spec-checklist-text" style="font-weight: 600; font-size: 0.95rem; color: var(--text-main);">${applyGlossaryTooltips(item.point)}</div>
        </div>
        <div class="spec-checklist-expansion">
          <ul style="margin: 0; padding: 0;">
            ${keyFactsHtml}
          </ul>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="spec-checklist-card" style="max-width: 800px; margin: 0 auto 24px auto;">
      <h4 class="spec-checklist-title" style="display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-clipboard-list" style="color: var(--primary);"></i> Official Spec Checklist: Topic study goals
      </h4>
      <p class="spec-checklist-subtitle" style="margin-top: 6px; font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
        Tick each official Edexcel specification point to expand the key facts you need for the exam:
      </p>
      <div class="spec-checklist-items">
        ${itemsHtml}
      </div>
    </div>
  `;
}

export function renderMasteryView(subtopicId) {
  highlightedKeywords.clear();
  const container = document.getElementById('mastery-content-container');
  if (!container) return;

  const data = LESSONS_DATA[subtopicId];

  if (!data) {
    container.innerHTML = `
      <div class="mastery-card" style="text-align: center; padding: 40px;">
        <i class="fa-solid fa-person-digging" style="font-size: 3rem; color: var(--primary); margin-bottom: 20px;"></i>
        <h3 class="mastery-card-title" style="border: none;">Lessons In Development</h3>
        <p class="mastery-card-body" style="color: var(--text-muted);">
          Lesson content is currently being drafted for this Key Topic. 
          Please navigate to <strong>Topic 1.1: Position of Black Americans & Brown v. Board</strong> or <strong>Topic 3.1: Reasons for US Involvement & Diem</strong> in the sidebar to test the active prototypes!
        </p>
      </div>
    `;
    return;
  }

  // Generate Steps HTML
  let stepsHtml = '';
  data.steps.forEach((step, index) => {
    let scholarlyHtml = '';
    if (step.scholarlyDepth) {
      let scholarlyImgHtml = '';
      if (step.scholarlyDepth.image) {
        let provenanceHtml = '';
        if (step.scholarlyDepth.imageProvenance) {
          provenanceHtml = `
            <div class="scholarly-image-provenance" style="font-size: 0.8rem; color: #cbd5e1; margin-top: 8px; font-weight: 500; line-height: 1.4; max-width: 600px; margin-left: auto; margin-right: auto; text-align: center; background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); padding: 8px 12px; border-radius: 4px; box-sizing: border-box;">
              <strong style="color: inherit;">Provenance:</strong> ${step.scholarlyDepth.imageProvenance}
            </div>
          `;
        }
        scholarlyImgHtml = `
          <div class="scholarly-image-wrapper" style="margin-bottom: 16px; text-align: center;">
            <img src="${step.scholarlyDepth.image}" alt="${step.scholarlyDepth.imageAlt || 'Scholarly Source'}" class="scholarly-source-img" style="max-width: 100%; max-height: 300px; object-fit: contain; border-radius: var(--border-radius-sm); border: 1px solid var(--border-glass); box-shadow: var(--shadow-sm);">
            ${provenanceHtml}
          </div>
        `;
      }
      let scholarlySourceHtml = '';
      if (step.scholarlyDepth.vietnameseSource) {
        const vs = step.scholarlyDepth.vietnameseSource;
        scholarlySourceHtml = `
          <div class="scholarly-vietnamese-source" style="margin-top: 16px; padding: 14px; background: rgba(0, 0, 0, 0.2); border-left: 4px solid var(--accent); border-radius: var(--border-radius-sm);">
            <strong style="display: block; margin-bottom: 6px; color: var(--accent); font-size: 0.85rem; text-transform: uppercase;">
              <i class="fa-solid fa-language"></i> Authentic Perspective: ${vs.perspective}
            </strong>
            <p class="vietnamese-text" style="font-family: inherit; font-size: 0.9rem; color: var(--text-base); margin: 0 0 8px 0; font-style: normal; line-height: 1.4;">
              "${vs.originalText}"
            </p>
            <p class="english-translation" style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 8px 0; font-style: italic; line-height: 1.4; border-top: 1px dashed var(--border-glass); padding-top: 8px;">
              <strong style="color: inherit;">Translation:</strong> "${vs.translation}"
            </p>
            <p class="source-analysis" style="font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.45;">
              <strong style="color: inherit;">Historical Context:</strong> ${vs.analysis}
            </p>
          </div>
        `;
      }

      scholarlyHtml = `
        <details class="scholarly-extension" style="margin-top: 16px;">
          <summary class="scholarly-summary">
            <i class="fa-solid fa-graduation-cap"></i> Scholarly Perspective - Expand for depth
          </summary>
          <div class="scholarly-content" style="margin-top: 12px; font-size: 0.88rem; line-height: 1.5; color: var(--text-muted);">
            ${scholarlyImgHtml}
            <strong style="display: block; margin-bottom: 6px; color: var(--primary); font-size: 0.95rem;">${step.scholarlyDepth.title}</strong>
            <p style="margin: 0 0 12px 0; font-style: italic;">${applyGlossaryTooltips(step.scholarlyDepth.body)}</p>
            ${scholarlySourceHtml}
          </div>
        </details>
      `;
    }

    let bridgeHtml = '';
    const yearMatch = step.title.match(/\b(19\d{2})\b/);
    if (yearMatch) {
      const stepYear = yearMatch[1];
      bridgeHtml = `
        <div style="margin-top: 10px; margin-bottom: 4px;">
          <button class="timeline-bridge-btn" data-year="${stepYear}" style="background: none; border: none; color: var(--primary); font-size: 0.8rem; cursor: pointer; text-decoration: underline; padding: 0; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-timeline"></i> View ${stepYear} in Timeline</button>
        </div>
      `;
    }

    const audioBtnHtml = `
      <button class="btn-audio-read" title="Read Step Aloud" style="margin-left: 8px;">
        <i class="fa-solid fa-volume-high"></i>
      </button>
    `;

    if (step.isSplit) {
      stepsHtml += `
        <div class="mastery-card" style="max-width: 800px; margin: 0 auto 20px auto;">
          <h3 class="mastery-card-title" style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <span>${step.title}</span>
            ${audioBtnHtml}
          </h3>
          <div class="mastery-split-layout">
            ${applyGlossaryTooltips(step.bodyHtml)}
          </div>
          ${bridgeHtml}
          ${scholarlyHtml}
        </div>
      `;
    } else {
      stepsHtml += `
        <div class="mastery-card" style="max-width: 800px; margin: 0 auto 20px auto;">
          <h3 class="mastery-card-title" style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <span>${step.title}</span>
            ${audioBtnHtml}
          </h3>
          <div class="mastery-card-body card-content">
            ${applyGlossaryTooltips(step.bodyHtml)}
          </div>
          ${bridgeHtml}
          ${scholarlyHtml}
        </div>
      `;
    }
  });

  // Generate Dual Perspective slider HTML
  let dualHtml = '';
  if (data.dualPerspective) {
    let historiographicalSubtitle = '';
    
    // Choose appropriate historiographical debate label based on subtopic ID (Orthodox/Revisionist removed as requested)
    if (subtopicId.startsWith('subtopic_1') || subtopicId.startsWith('subtopic_2')) {
      historiographicalSubtitle = `
        <div style="margin-top: 6px; display: flex; gap: 8px; flex-wrap: wrap;">
          <span class="historiographical-label top-down">Top-Down Legalistic</span>
          <span class="historiographical-label bottom-up">Bottom-Up Grassroots</span>
        </div>
      `;
    }

    dualHtml = `
      <div class="dual-perspective-card left-active"
           data-left-headline="${data.dualPerspective.leftHeadline}"
           data-left-text="${data.dualPerspective.leftText}"
           data-right-headline="${data.dualPerspective.rightHeadline}"
           data-right-text="${data.dualPerspective.rightText}"
           style="max-width: 800px; margin: 0 auto 20px auto;">
        <h3 class="dual-perspective-neutral-title">${data.dualPerspective.neutralTitle}</h3>
        ${historiographicalSubtitle}
        <div class="dual-perspective-narrative-box" style="margin-top: 14px;">
          <h4 class="dual-perspective-headline">${data.dualPerspective.leftHeadline}</h4>
          <p class="dual-perspective-text">${data.dualPerspective.leftText}</p>
        </div>
        <div class="dual-perspective-slider-row">
          <span class="perspective-label label-left active">${data.dualPerspective.leftLabel || 'Perspective A'}</span>
          <div class="slider-wrapper">
            <input type="range" class="perspective-range-slider" min="0" max="100" value="0">
          </div>
          <span class="perspective-label label-right">${data.dualPerspective.rightLabel || 'Perspective B'}</span>
        </div>
        ${data.dualPerspective.tipHtml || ''}
      </div>
    `;
  }

  // Generate Causal Link Builder block (replaces narrative chain)
  let causalHtml = '';
  if (data.causalLinks) {
    let factorsHtml = '';
    const pooledLinks = data.causalLinks.factors.map(factor => factor.linkageText);
    
    data.causalLinks.factors.forEach((f, idx) => {
      const correctIdx = pooledLinks.indexOf(f.linkageText);
      const optionsMarkup = pooledLinks.map((linkText, lIdx) => {
        return `<option value="${lIdx}">${linkText}</option>`;
      }).join('');
      
      factorsHtml += `
        <div class="causal-factor-card" id="causal-factor-card-${f.id}">
          <div class="causal-factor-header">
            <span>Factor ${idx + 1}: ${f.title}</span>
            <span class="causal-status-badge" id="causal-status-${f.id}">UNLINKED</span>
          </div>
          <div class="causal-select-wrapper" id="causal-select-wrapper-${f.id}">
            <label style="font-size: 0.75rem; color: var(--text-muted);">Select the correct analytical consequence / evidence link:</label>
            <select class="causal-select" id="causal-select-${f.id}" data-factor-id="${f.id}" data-correct="${correctIdx}">
              <option value="" disabled selected>-- Match the consequence link --</option>
              ${optionsMarkup}
            </select>
          </div>
          <div class="causal-link-result" id="causal-result-${f.id}">
            <strong>✓ Consequence Link:</strong> ${f.linkageText}
          </div>
        </div>
      `;
    });
    
    causalHtml = `
      <style>
        details.causal-details summary::-webkit-details-marker {
          display: none;
        }
        details.causal-details[open] .causal-toggle-icon {
          transform: rotate(180deg);
        }
      </style>
      <div class="causal-connector-container" style="max-width: 800px; margin: 0 auto 24px auto; padding: 0;">
        <details class="causal-details" style="width: 100%; padding: 20px; box-sizing: border-box;">
          <summary class="causal-title" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-weight: 700; user-select: none; outline: none; list-style: none; cursor: pointer; margin: 0;">
            <span style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-link" style="color: var(--primary);"></i> Causal Link Builder</span>
            <i class="fa-solid fa-chevron-down causal-toggle-icon" style="transition: transform 0.2s; font-size: 0.95rem; color: var(--text-muted);"></i>
          </summary>
          <div class="causal-expanded-content" style="margin-top: 16px;">
            <p class="chain-instruction" style="margin-bottom: 12px; font-size: 0.85rem; color: var(--text-muted); line-height: 1.45;">Paper 3 essays require linking factors to their historical effects. Match each causal factor to its correct analytical consequence link!</p>
            <div class="causal-question">
              <strong>Essay Question:</strong> ${data.causalLinks.question}
            </div>
            <div class="causal-factors-grid">
              ${factorsHtml}
            </div>
            <div class="causal-success-panel" id="causal-success-panel">
              <h4><i class="fa-solid fa-trophy"></i> Causation Mastered!</h4>
              <p id="causal-success-text">${data.causalLinks.successText}</p>
            </div>
          </div>
        </details>
      </div>
    `;
  }

  // Generate Knowledge Check HTML (Disabled)
  let kcHtml = '';

  // Generate Importance Analyser HTML
  let impHtml = '';
  if (data.importanceAnalyser) {
    impHtml = `
      <div class="mastery-card" style="max-width: 800px; margin: 0 auto 24px auto;">
        <h3 class="mastery-card-title">🔍 8-Mark Skill: The Importance Analyser</h3>
        <p style="font-style: italic; margin-top: 0; margin-bottom: 20px; color: var(--text-muted);">
          Click the card below to flip it and view the examiner's model analysis.
        </p>
        
        <div class="importance-flip-card" id="importance-analyser-card">
          <div class="importance-card-inner">
            <div class="importance-card-front">
              <i class="fa-solid fa-rotate" style="font-size: 2rem; color: var(--primary); margin-bottom: 12px;"></i>
              <strong>Question:</strong> ${data.importanceAnalyser.question}
              <span style="font-size: 0.8rem; color: var(--text-muted); margin-top: 12px;">(Click Card to Flip)</span>
            </div>
            <div class="importance-card-back">
              <strong>Examiner Analysis:</strong> ${data.importanceAnalyser.answer}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Generate Question Vault HTML
  let vaultItemsHtml = '';
  data.questionVault.forEach((q, index) => {
    let sourcesHtml = '';
    if (q.sourceB && q.sourceC) {
      sourcesHtml = `
        <div class="vault-sources-comparison" style="display: flex; gap: 16px; margin-bottom: 12px; flex-wrap: wrap;">
          <div class="skills-source-card" style="flex: 1; min-width: 250px; padding: 12px; background: rgba(0, 0, 0, 0.1); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--primary);"></div>
            <strong style="font-size: 0.75rem; color: var(--primary); text-transform: uppercase; display: block; margin-bottom: 4px;">Source B</strong>
            <p style="font-style: italic; font-size: 0.85rem; line-height: 1.45; color: var(--text-muted); margin: 0;">${q.sourceB}</p>
          </div>
          <div class="skills-source-card" style="flex: 1; min-width: 250px; padding: 12px; background: rgba(0, 0, 0, 0.1); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--primary);"></div>
            <strong style="font-size: 0.75rem; color: var(--primary); text-transform: uppercase; display: block; margin-bottom: 4px;">Source C</strong>
            <p style="font-style: italic; font-size: 0.85rem; line-height: 1.45; color: var(--text-muted); margin: 0;">${q.sourceC}</p>
          </div>
        </div>
      `;
    } else if (q.sourceA) {
      sourcesHtml = `
        <div class="vault-sources-comparison" style="margin-bottom: 12px;">
          <div class="skills-source-card" style="padding: 12px; background: rgba(0, 0, 0, 0.1); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--primary);"></div>
            <strong style="font-size: 0.75rem; color: var(--primary); text-transform: uppercase; display: block; margin-bottom: 4px;">Source A</strong>
            <p style="font-style: italic; font-size: 0.85rem; line-height: 1.45; color: var(--text-muted); margin: 0;">${q.sourceA}</p>
          </div>
        </div>
      `;
    }

    if (q.interpretation1 && q.interpretation2) {
      sourcesHtml += `
        <div class="vault-interpretations-comparison" style="display: flex; gap: 16px; margin-bottom: 12px; flex-wrap: wrap;">
          <div class="skills-source-card" style="flex: 1; min-width: 250px; padding: 12px; background: rgba(0, 0, 0, 0.1); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--secondary);"></div>
            <strong style="font-size: 0.75rem; color: var(--secondary); text-transform: uppercase; display: block; margin-bottom: 4px;">Interpretation 1</strong>
            <p style="font-style: italic; font-size: 0.85rem; line-height: 1.45; color: var(--text-muted); margin: 0;">${q.interpretation1}</p>
          </div>
          <div class="skills-source-card" style="flex: 1; min-width: 250px; padding: 12px; background: rgba(0, 0, 0, 0.1); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--secondary);"></div>
            <strong style="font-size: 0.75rem; color: var(--secondary); text-transform: uppercase; display: block; margin-bottom: 4px;">Interpretation 2</strong>
            <p style="font-style: italic; font-size: 0.85rem; line-height: 1.45; color: var(--text-muted); margin: 0;">${q.interpretation2}</p>
          </div>
        </div>
      `;
    }

    let answerHtml = '';
    if (q.options && q.correctIndices) {
      answerHtml = `
        <div class="interactive-vault-q1" data-vault-idx="${index}" style="margin-top: 10px;">
          <p style="font-weight: bold; margin-bottom: 8px;">Select the TWO correct inferences that can be made from the source:</p>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
            ${q.options.map((opt, oIdx) => `
              <label style="display: flex; align-items: flex-start; gap: 8px; cursor: pointer; padding: 8px; border-radius: var(--border-radius-sm); background: rgba(255, 255, 255, 0.02); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'">
                <input type="checkbox" class="vault-q1-option" data-idx="${oIdx}" style="margin-top: 3px;">
                <span style="font-size: 0.9rem;">${opt}</span>
              </label>
            `).join('')}
          </div>
          <button class="mastery-btn vault-q1-check-btn" style="max-width: fit-content; padding: 8px 16px; font-size: 0.85rem; border-radius: 20px; background: var(--gradient-primary); color: white; border: none; font-weight: bold; cursor: pointer;">Check Inferences</button>
          <div class="vault-q1-feedback" style="display: none; margin-top: 12px; padding: 10px 14px; border-radius: var(--border-radius-sm); font-size: 0.9rem; font-weight: bold;"></div>
          
          <div class="vault-q1-model-answer" style="display: none; margin-top: 16px; border-top: 1px dashed var(--border-glass); padding-top: 12px;">
            <strong style="display: block; margin-bottom: 6px; color: var(--primary);">Model Response Blueprint (4 Marks):</strong>
            <div style="white-space: pre-line; color: var(--text-muted); font-size: 0.9rem;">${highlightModelQuotes(q.answer)}</div>
            ${getVaultLegendHTML(data.id)}
          </div>
        </div>
      `;
    } else {
      let clueBtnHtml = '';
      let clueContentHtml = '';
      if (q.clue) {
        clueBtnHtml = `
          <button class="mastery-btn vault-clue-btn" data-vault-idx="${index}" style="max-width: fit-content; padding: 8px 16px; font-size: 0.85rem; border-radius: 20px; background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-lightbulb"></i> Educator Clue
          </button>
        `;
        clueContentHtml = `
          <div class="vault-clue-content" style="display: none; margin-top: 12px; padding: 12px; background: rgba(245, 158, 11, 0.05); border-left: 4px solid #f59e0b; border-radius: var(--border-radius-sm); font-size: 0.88rem; line-height: 1.45; color: var(--text-base);">
            <strong>Educator Clue/Pointers:</strong><br>${q.clue}
          </div>
        `;
      }

      answerHtml = `
        <div class="vault-model-answer-section" style="margin-top: 14px; border-top: 1px dashed var(--border-glass); padding-top: 12px;">
          <div style="display: flex; gap: 10px; align-items: center; margin-top: 8px; flex-wrap: wrap;">
            ${clueBtnHtml}
            <button class="mastery-btn vault-reveal-btn" data-vault-idx="${index}" style="max-width: fit-content; padding: 8px 16px; font-size: 0.85rem; border-radius: 20px; background: rgba(255, 255, 255, 0.05); color: var(--text-base); border: 1px solid var(--border-glass); font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-eye"></i> Compare with Model Answer
            </button>
          </div>
          ${clueContentHtml}
          <div class="vault-model-answer-content" style="display: none; margin-top: 12px; padding: 12px; background: rgba(34, 197, 94, 0.05); border-left: 4px solid var(--success); border-radius: var(--border-radius-sm); font-size: 0.9rem; line-height: 1.5; color: var(--text-muted); white-space: pre-line;">
            <strong style="display: block; margin-bottom: 8px; color: var(--primary); font-size: 0.95rem; font-style: normal; white-space: normal;">Model Response Blueprint (${q.question.toLowerCase().includes('12 marks') ? '12 Marks' : 'Model Answer'}):</strong>
            ${q.question.toLowerCase().includes('12 marks') ? `
              <div style="margin-bottom: 12px; padding: 10px; background: rgba(59, 130, 246, 0.08); border-left: 4px solid var(--primary); border-radius: var(--border-radius-sm); font-size: 0.85rem; color: var(--text-base); font-weight: 500; line-height: 1.45; font-style: normal; white-space: normal;">
                <strong style="color: var(--primary); display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                  <i class="fa-solid fa-graduation-cap"></i> Edexcel 12-Mark Causation Formula:
                </strong>
                To achieve full marks, write <strong>three analytical paragraphs</strong>, incorporating the <strong>two provided bullet points</strong> plus your own specific <strong>OOK (Own Knowledge)</strong>.
              </div>
            ` : ''}
            ${highlightModelQuotes(q.answer)}
            ${getVaultLegendHTML(data.id)}
          </div>
        </div>
      `;
    }

    let stimulusHtml = '';
    if (q.stimulus1 && q.stimulus2) {
      stimulusHtml = `
        <div class="stimulus-container" style="display: flex; gap: 10px; margin-top: 6px; margin-bottom: 12px; align-items: center; flex-wrap: wrap;">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Stimulus:</span>
          <span class="stimulus-item" style="background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border-glass); padding: 4px 10px; border-radius: 4px; font-size: 0.82rem; color: var(--text-base); font-weight: 500;">${q.stimulus1}</span>
          <span class="stimulus-item" style="background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border-glass); padding: 4px 10px; border-radius: 4px; font-size: 0.82rem; color: var(--text-base); font-weight: 500;">${q.stimulus2}</span>
        </div>
      `;
    }

    vaultItemsHtml += `
      <div class="vault-item">
        <button class="vault-question-btn" data-vault-idx="${index}">
          <span>${q.question}</span>
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div class="vault-answer-panel">
          ${stimulusHtml}
          ${sourcesHtml}
          ${answerHtml}
        </div>
      </div>
    `;
  });

  let vaultHtml = '';
  if (data.questionVault.length > 0) {
    vaultHtml = `
      <div class="exam-question-vault" style="max-width: 800px; margin: 0 auto 24px auto;">
        <h3 class="mastery-card-title" style="border: none; margin-bottom: 6px;">📝 Test Your Knowledge (Exam Question Vault)</h3>
        <p style="font-style: italic; margin-top: 0; margin-bottom: 16px; color: var(--text-muted);">
          Click each question to view the model response blueprint.
        </p>
        <div class="vault-items">
          ${vaultItemsHtml}
        </div>
      </div>
    `;
  }

  // Generate Summary Spotter HTML
  let summaryCorrectionHtml = '';
  if (data.summaryCorrection && data.summaryCorrection.text) {
    const parsedText = parseSummaryCorrectionText(data.summaryCorrection.text);
    summaryCorrectionHtml = `
      <div class="mastery-card" id="summary-correction-card" style="max-width: 800px; margin: 0 auto 24px auto;">
        <h3 class="mastery-card-title"><i class="fa-solid fa-pen-nib" style="color: var(--accent);"></i> Topic Summary: Spot the Errors!</h3>
        <div class="mastery-card-body">
          <p style="font-style: italic; margin-top: 0; margin-bottom: 20px; color: var(--text-muted);">
            Some facts in the summary below are incorrect. Click on the wrong words to correct them!
          </p>
          <div class="summary-correction-paragraph" style="line-height: 1.8; font-size: 1.05rem;">
            ${parsedText}
          </div>
          
          <div class="summary-success-panel" id="summary-success-panel" style="display: none; margin-top: 20px; padding: 15px; background: rgba(34, 197, 94, 0.1); border-left: 4px solid var(--success); border-radius: var(--border-radius-sm); text-align: center;">
            <h4 style="color: var(--success); margin: 0 0 5px 0;"><i class="fa-solid fa-circle-check"></i> Summary Perfected!</h4>
            <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);">You have successfully corrected all the errors in the topic summary!</p>
          </div>
        </div>
      </div>
    `;
  }

  // Generate How Useful Analyser HTML
  let howUsefulHtml = '';
  if (data.howUsefulAnalyser) {
    const hu = data.howUsefulAnalyser;
    howUsefulHtml = `
      <div class="mastery-card how-useful-card" style="max-width: 800px; margin: 0 auto 24px auto;">
        <h3 class="mastery-card-title"><i class="fa-solid fa-images" style="color: var(--primary);"></i> Exam Skill: The "How Useful" Analyser</h3>
        <div class="mastery-card-body">
          <p class="hu-question" style="font-weight: bold; font-size: 1.05rem; margin-bottom: 16px; border-left: 4px solid var(--primary); padding-left: 12px; line-height: 1.4;">
            ${hu.question}
          </p>

          <div class="hu-sources-wrapper" style="display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
            <!-- Source D -->
            <div class="hu-source-box" style="flex: 1; min-width: 280px; background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); padding: 12px; display: flex; flex-direction: column;">
              <strong style="color: var(--primary); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px; display: block;">Source D</strong>
              <div class="hu-image-container" style="text-align: center; margin-bottom: 10px; background: #000; border-radius: var(--border-radius-sm); overflow: hidden; height: 200px; display: flex; align-items: center; justify-content: center;">
                <img src="${hu.sourceD.image}" alt="Source D" class="hu-source-img" style="max-width: 100%; max-height: 100%; object-fit: contain; cursor: pointer; transition: transform 0.2s;" onclick="this.style.transform = this.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)'; this.style.zIndex = this.style.transform === 'scale(1.5)' ? '10' : '1'; this.style.position = this.style.transform === 'scale(1.5)' ? 'relative' : 'static';">
              </div>
              <span class="hu-caption" style="font-size: 0.75rem; color: var(--text-muted); display: block; text-align: center; margin-bottom: 8px; font-style: italic; line-height: 1.3;">
                ${hu.sourceD.caption}
              </span>
              <div class="hu-provenance" style="font-size: 0.82rem; line-height: 1.4; border-top: 1px solid var(--border-glass); padding-top: 8px; color: var(--text-base); flex-grow: 1;">
                <strong>Provenance:</strong> ${hu.sourceD.provenance}
              </div>
            </div>

            <!-- Source E -->
            <div class="hu-source-box" style="flex: 1; min-width: 280px; background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); padding: 12px; display: flex; flex-direction: column;">
              <strong style="color: var(--primary); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px; display: block;">Source E</strong>
              <div class="hu-image-container" style="text-align: center; margin-bottom: 10px; background: #000; border-radius: var(--border-radius-sm); overflow: hidden; height: 200px; display: flex; align-items: center; justify-content: center;">
                <img src="${hu.sourceE.image}" alt="Source E" class="hu-source-img" style="max-width: 100%; max-height: 100%; object-fit: contain; cursor: pointer; transition: transform 0.2s;" onclick="this.style.transform = this.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)'; this.style.zIndex = this.style.transform === 'scale(1.5)' ? '10' : '1'; this.style.position = this.style.transform === 'scale(1.5)' ? 'relative' : 'static';">
              </div>
              <span class="hu-caption" style="font-size: 0.75rem; color: var(--text-muted); display: block; text-align: center; margin-bottom: 8px; font-style: italic; line-height: 1.3;">
                ${hu.sourceE.caption}
              </span>
              <div class="hu-provenance" style="font-size: 0.82rem; line-height: 1.4; border-top: 1px solid var(--border-glass); padding-top: 8px; color: var(--text-base); flex-grow: 1;">
                <strong>Provenance:</strong> ${hu.sourceE.provenance}
              </div>
            </div>
          </div>

          <!-- Analytical Scaffolding Tabs -->
          <div class="hu-scaffolding" style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); margin-bottom: 20px; overflow: hidden;">
            <div class="hu-tab-bar" style="display: flex; background: rgba(0, 0, 0, 0.2); border-bottom: 1px solid var(--border-glass);">
              <button class="hu-tab-btn active" data-tab="content" style="flex: 1; padding: 10px 12px; background: none; border: none; color: var(--text-muted); font-size: 0.8rem; font-weight: bold; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s;">1. Content Analysis</button>
              <button class="hu-tab-btn" data-tab="provenance" style="flex: 1; padding: 10px 12px; background: none; border: none; color: var(--text-muted); font-size: 0.8rem; font-weight: bold; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s;">2. Provenance & Purpose</button>
              <button class="hu-tab-btn" data-tab="context" style="flex: 1; padding: 10px 12px; background: none; border: none; color: var(--text-muted); font-size: 0.8rem; font-weight: bold; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s;">3. Contextual Knowledge</button>
            </div>
            <div class="hu-tab-panels" style="padding: 14px; font-size: 0.88rem; line-height: 1.5;">
              <div class="hu-tab-panel active" id="panel-content">
                <p style="margin: 0 0 10px 0;"><strong style="color: var(--primary);">Source D Content:</strong> ${hu.sourceD.content}</p>
                <p style="margin: 0;"><strong style="color: var(--primary);">Source E Content:</strong> ${hu.sourceE.content}</p>
              </div>
              <div class="hu-tab-panel" id="panel-provenance" style="display: none;">
                <p style="margin: 0 0 10px 0;"><strong style="color: var(--secondary);">Evaluating Provenance (NOP - Nature, Origin, Purpose):</strong></p>
                <p style="margin: 0 0 8px 0;"><strong>Source D:</strong> How does its nature as a photo/cartoon, its origin (who created it and when), and its purpose affect how useful it is for this enquiry?</p>
                <p style="margin: 0;"><strong>Source E:</strong> Contrast its origin and purpose with Source D. Why was it created, and what are its limitations or strengths?</p>
              </div>
              <div class="hu-tab-panel" id="panel-context" style="display: none;">
                <p style="margin: 0 0 10px 0;"><strong style="color: var(--accent);">Contextual Knowledge Checklist:</strong></p>
                <p style="margin: 0;">What facts about this period can you use to test the accuracy or typicality of these sources? Consider key events, laws, and dates from the lesson text above to support your evaluation.</p>
              </div>
            </div>
          </div>

          <!-- Student Draft Response Area -->
          <div class="hu-draft-section" style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
              <strong style="color: var(--primary); font-size: 0.95rem;">Your Draft Response:</strong>
              <span class="hu-save-status" id="hu-save-status-${subtopicId}" style="font-size: 0.7rem; color: var(--success); opacity: 0.8; display: ${state.howUsefulAnswers && state.howUsefulAnswers[subtopicId] ? 'inline' : 'none'};"><i class="fa-solid fa-cloud-arrow-up"></i> Draft Saved</span>
            </div>
            
            <!-- Sentence Starter Dropdown -->
            <div style="margin-bottom: 10px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <label for="sentence-starter-${subtopicId}" style="font-size: 0.82rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
                <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary);"></i> Sentence Starters:
              </label>
              <select id="sentence-starter-${subtopicId}" class="hu-starter-select" style="flex: 1; min-width: 220px; padding: 6px 10px; background: rgba(0, 0, 0, 0.25); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); color: var(--text-main); font-size: 0.82rem; cursor: pointer; outline: none; transition: border-color var(--transition-fast);">
                <option value="" disabled selected>-- Select a sentence starter to insert --</option>
                <option value="Source D is useful because it shows...">"Source D is useful because it shows..."</option>
                <option value="Source D is useful because the provenance reveals...">"Source D is useful because the provenance reveals..."</option>
                <option value="This is supported by my own knowledge that...">"This is supported by my own knowledge that..."</option>
                <option value="However, the utility of Source D is limited by...">"However, the utility of Source D is limited by..."</option>
                <option value="Similarly, Source E is useful because...">"Similarly, Source E is useful because..."</option>
                <option value="Source E is useful because the provenance reveals...">"Source E is useful because the provenance reveals..."</option>
                <option value="However, the utility of Source E is limited by...">"However, the utility of Source E is limited by..."</option>
                <option value="In conclusion, both sources are highly useful because...">"In conclusion, both sources are highly useful because..."</option>
              </select>
            </div>

            <textarea class="hu-textarea" data-subtopic-id="${subtopicId}" placeholder="Draft your 8-mark source evaluation here (analyze Content, NOP/Provenance, and Contextual Knowledge for both sources)..." style="width: 100%; height: 120px; padding: 10px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); color: var(--text-base); font-size: 0.9rem; resize: vertical; line-height: 1.45; font-family: inherit; margin-bottom: 6px;">${state.howUsefulAnswers && state.howUsefulAnswers[subtopicId] ? state.howUsefulAnswers[subtopicId] : ''}</textarea>
          </div>

          <!-- Model Answer Reveal -->
          <div class="hu-model-answer-section">
            <button class="mastery-btn hu-reveal-btn" style="width: 100%; justify-content: center; background: var(--gradient-primary); border: none; color: white; padding: 12px; font-weight: bold; border-radius: var(--border-radius-sm); cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-eye"></i> Compare with Examiner Model Answer
            </button>
            <div class="hu-model-answer-content" style="display: none; margin-top: 14px; padding: 16px; background: rgba(34, 197, 94, 0.05); border-left: 4px solid var(--success); border-radius: var(--border-radius-sm);">
              <h4 style="margin: 0 0 10px 0; color: var(--success); font-size: 0.95rem;"><i class="fa-solid fa-circle-check"></i> Examiner Model Answer (8 Marks):</h4>
              <p style="margin: 0; font-size: 0.9rem; line-height: 1.5; color: var(--text-muted); white-space: pre-line;">${highlightModelQuotes(hu.modelAnswer)}</p>
              <div class="model-answer-key" style="margin-top: 12px; border: 1px solid rgba(16, 185, 129, 0.2); background: rgba(0, 0, 0, 0.2);">
                <span class="model-key-title">Key:</span>
                <span class="model-key-item"><span class="model-key-dot" style="background-color: #f97316;"></span> Source Quotes</span>
                <span class="model-key-item"><span class="model-key-dot" style="border-bottom: 2px dotted #10b981; border-radius: 0; width: 12px; height: 4px; margin-top: -4px; background: transparent;"></span> Contextual Knowledge</span>
                <span class="model-key-item"><span class="model-key-dot" style="background-color: #a855f7;"></span> Provenance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Generate Deep Thinking HTML (Disabled)
  let deepThinkingHtml = '';

  let doNowHtml = '';
  if (data.doNowStarter) {
    const dn = data.doNowStarter;
    let prevLessonLinkHtml = '';
    if (dn.prevSubtopicId && dn.prevSubtopicTitle) {
      prevLessonLinkHtml = `
        <div style="margin-bottom: 14px; font-size: 0.88rem; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-arrow-left" style="color: var(--primary);"></i> 
          <span style="color: var(--text-muted);">Prior Topic Retrieval:</span> 
          <button class="do-now-prev-link-btn" data-prev-id="${dn.prevSubtopicId}" style="background: none; border: none; color: var(--primary); font-weight: 700; text-decoration: underline; cursor: pointer; padding: 0; font-size: 0.88rem;">
            ${dn.prevSubtopicTitle}
          </button>
        </div>
      `;
    }

    const enquiryText = dn.enquiry || 'segregation and discrimination in the Southern states in the 1950s';
    const howUsefulBoxHtml = `
      <div style="margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); padding: 12px 16px; border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm); width: 100%; box-sizing: border-box;">
        <div style="font-size: 0.88rem; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 8px; flex: 1; min-width: 250px;">
          <i class="fa-solid fa-circle-question" style="color: var(--accent);"></i>
          <span>How useful is this source for an enquiry into ${enquiryText}?</span>
        </div>
        <div class="do-now-checkboxes" style="display: flex; gap: 14px; align-items: center;">
          <label style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 800; color: var(--text-main); cursor: pointer; user-select: none;" title="Content Analysis (what the source shows)">
            <input type="checkbox" class="do-now-cb" style="width: 15px; height: 15px; cursor: pointer; accent-color: var(--accent);"> C
          </label>
          <label style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 800; color: var(--text-main); cursor: pointer; user-select: none;" title="Provenance (Nature, Origin, Purpose)">
            <input type="checkbox" class="do-now-cb" style="width: 15px; height: 15px; cursor: pointer; accent-color: var(--accent);"> NOP
          </label>
          <label style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 800; color: var(--text-main); cursor: pointer; user-select: none;" title="Own Knowledge (historical context)">
            <input type="checkbox" class="do-now-cb" style="width: 15px; height: 15px; cursor: pointer; accent-color: var(--accent);"> OK
          </label>
        </div>
      </div>
    `;

    let doNowPrototypesHtml = '';
    if (subtopicId === 'subtopic_1_1') {
      doNowPrototypesHtml = `
        <div id="do-now-drafting-container" style="display: none; flex-direction: column; gap: 10px; margin-bottom: 18px; padding: 14px; border: 1px dashed var(--border-glass); border-radius: var(--border-radius-md); background: rgba(255,255,255,0.01);">
          <strong style="font-size: 0.82rem; color: var(--accent); text-transform: uppercase; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-pen-to-square"></i> Drafting Assistant</strong>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: none;" id="textarea-wrap-c">
              <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 3px; font-weight: 700;">Content Analysis (C):</label>
              <textarea id="draft-c" placeholder="Describe what you see in the Jim Crow sign that is useful..." style="width: 100%; height: 50px; background: rgba(0,0,0,0.25); border: 1px solid var(--border-glass); border-radius: 4px; padding: 6px 8px; color: var(--text-main); font-size: 0.82rem; font-family: inherit; resize: none; outline: none;"></textarea>
            </div>
            <div style="display: none;" id="textarea-wrap-nop">
              <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 3px; font-weight: 700;">Provenance Analysis (NOP):</label>
              <textarea id="draft-nop" placeholder="Explain how the nature (public sign) and timing (circa 1950s) impact its utility..." style="width: 100%; height: 50px; background: rgba(0,0,0,0.25); border: 1px solid var(--border-glass); border-radius: 4px; padding: 6px 8px; color: var(--text-main); font-size: 0.82rem; font-family: inherit; resize: none; outline: none;"></textarea>
            </div>
            <div style="display: none;" id="textarea-wrap-ok">
              <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 3px; font-weight: 700;">Own Knowledge (OK):</label>
              <textarea id="draft-ok" placeholder="Introduce one fact from your own knowledge about Jim Crow laws..." style="width: 100%; height: 50px; background: rgba(0,0,0,0.25); border: 1px solid var(--border-glass); border-radius: 4px; padding: 6px 8px; color: var(--text-main); font-size: 0.82rem; font-family: inherit; resize: none; outline: none;"></textarea>
            </div>
          </div>
          <button id="compile-draft-btn" class="mastery-btn" style="background: var(--accent); color: #000; font-size: 0.8rem; font-weight: 800; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer; margin-top: 4px; align-self: flex-start; display: none;">Compile & Compare Draft</button>
          <div id="compiled-draft-display" style="display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--border-glass);">
            <div style="font-weight: 700; font-size: 0.82rem; color: var(--accent);">Your Compiled Answer:</div>
            <p id="compiled-draft-text" style="margin: 0; font-size: 0.85rem; line-height: 1.45; color: var(--text-base); background: rgba(255,255,255,0.02); padding: 8px; border-radius: 4px; border: 1px solid var(--border-glass);"></p>
            <div style="font-weight: 700; font-size: 0.82rem; color: var(--success); margin-top: 6px;">Smithsonian Exhibit Model Answer:</div>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.45; color: var(--text-muted); background: rgba(16, 185, 129, 0.03); padding: 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.15);">Source E is highly useful for demonstrating the systemic, official nature of segregation in public facilities in the 1950s. The photograph shows a wooden sign reading "COLORED WAITING ROOM" hanging above a public entrance. This content's utility is supported by my knowledge that Jim Crow laws in the Southern states officially enforced segregation in transit, waiting rooms, and restaurants, creating separate and unequal conditions. The provenance, taken in the Southern United States in the early 1950s, makes the source extremely useful because it provides direct, unedited evidence of segregation infrastructure, though it fails to document the personal experiences of Black passengers who suffered under it.</p>
          </div>
        </div>
      `;
    } else if (subtopicId === 'subtopic_1_2') {
      doNowPrototypesHtml = `
        <div id="provenance-explanation-card" style="display: none; margin-bottom: 12px; background: rgba(245, 158, 11, 0.05); border: 1px dashed rgba(245, 158, 11, 0.3); padding: 12px; border-radius: var(--border-radius-md); font-size: 0.82rem; line-height: 1.45; text-align: left;">
          <strong style="color: var(--accent); display: block; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 4px;"><i class="fa-solid fa-scroll"></i> Provenance Insight (NOP)</strong>
          <span>As an official Supreme Court group portrait, it is a highly reliable record of the bench's composition in 1954 under Earl Warren. However, it is a posed photograph designed to project unity and authority, concealing the fierce private debates and compromise leading up to the unanimous 9-0 ruling.</span>
        </div>
        <div id="context-clues-card" style="display: none; margin-bottom: 12px; background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); padding: 12px; border-radius: var(--border-radius-md); font-size: 0.82rem; line-height: 1.45; text-align: left;">
          <strong style="color: var(--primary); display: block; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 4px;"><i class="fa-solid fa-brain"></i> Historical Context Clues (OK)</strong>
          <ul style="margin: 4px 0 0 0; padding-left: 16px; color: #cbd5e1; display: flex; flex-direction: column; gap: 4px;">
            <li><strong>Brown v. Board of Education (1954)</strong> overturned the 1896 Plessy v. Ferguson decision.</li>
            <li><strong>Chief Justice Earl Warren</strong> led the court and worked tirelessly to ensure a 9-0 decision to present a solid federal front against resistance.</li>
          </ul>
        </div>
      `;
    } else if (subtopicId === 'subtopic_1_3') {
      doNowPrototypesHtml = `
        <div id="do-now-quiz-overlay" style="display: none; flex-direction: column; gap: 8px; margin-bottom: 18px; background: rgba(0, 0, 0, 0.45); border: 1px solid var(--border-glass); border-left: 4px solid var(--accent); padding: 12px 14px; border-radius: var(--border-radius-md);">
          <div style="font-weight: 800; font-size: 0.82rem; color: var(--accent); display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-circle-question"></i> Quiz Challenge: Verify your checkbox!
          </div>
          <div id="quiz-question-text" style="font-size: 0.88rem; color: var(--text-main); margin-top: 4px; font-weight: 600;">Question text...</div>
          <div id="quiz-options-container" style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
            <!-- Options will be rendered dynamically -->
          </div>
        </div>
      `;
    } else if (subtopicId === 'subtopic_1_4') {
      doNowPrototypesHtml = `
        <div id="do-now-lens-container" style="display: none; flex-direction: column; gap: 10px; margin-bottom: 18px; padding: 14px; border: 1px dashed var(--border-glass); border-radius: var(--border-radius-md); background: rgba(255,255,255,0.01);">
          <strong style="font-size: 0.82rem; color: var(--accent); text-transform: uppercase; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-magnifying-glass"></i> Examiner's Lens (Rosa Parks bus photo)</strong>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Checking the boxes highlights how the answer evaluates that skill: <span style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; padding: 1px 4px; border-radius: 2px; font-weight: bold;">C</span>, <span style="background: rgba(168, 85, 247, 0.15); color: #c084fc; padding: 1px 4px; border-radius: 2px; font-weight: bold;">NOP</span>, <span style="background: rgba(34, 197, 94, 0.15); color: #4ade80; padding: 1px 4px; border-radius: 2px; font-weight: bold;">OK</span>.</p>
          <div id="lens-model-answer" style="font-size: 0.85rem; line-height: 1.5; color: var(--text-muted); padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-glass); background: rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 10px;">
            <p style="margin: 0;"><span class="lens-part lens-c" style="transition: all 0.3s; padding: 2px; border-radius: 2px;">Source A is highly useful for showing the success and social impact of the Montgomery Bus Boycott. The photograph shows Rosa Parks sitting in the front seats of a city bus (previously reserved for white passengers only) and a white man sitting peacefully behind her.</span></p>
            
            <p style="margin: 0;"><span class="lens-part lens-ok" style="transition: all 0.3s; padding: 2px; border-radius: 2px;">This content's utility is supported by my knowledge that after a 381-day boycott, the Supreme Court ruled in Browder v. Gayle that transit segregation was unconstitutional, and this photograph documents the successful enforcement of that ruling.</span></p>
            
            <p style="margin: 0;"><span class="lens-part lens-nop" style="transition: all 0.3s; padding: 2px; border-radius: 2px;">The provenance of December 1956 makes it extremely useful as it captures the immediate aftermath of the legal victory when integration took effect. However, it is slightly less useful because it was a staged publicity photo taken by the press to project peace, hiding the fact that integration was met with sniper attacks and the bombing of Black churches.</span></p>
          </div>
        </div>
      `;
    }

    let accessibilityHtml = '';
    if (dn.visualDetails) {
      accessibilityHtml = `
        <div class="do-now-accessibility-box" style="margin-top: 10px; background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); padding: 10px 12px; border-radius: var(--border-radius-sm); font-size: 0.82rem; text-align: left; line-height: 1.45;">
          <details style="cursor: pointer;">
            <summary style="font-weight: 800; color: var(--primary); display: flex; align-items: center; gap: 4px; user-select: none;">
              <i class="fa-solid fa-eye" style="color: var(--primary);"></i> Source Accessibility Guide (Key Details)
            </summary>
            <div style="margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--primary); color: var(--text-base); font-style: normal;">
              ${dn.visualDetails}
            </div>
          </details>
        </div>
      `;
    }

    const keywordsHtml = dn.keywords.map(kw => `
      <span class="do-now-keyword" style="display: inline-block; padding: 4px 10px; font-size: 0.72rem; font-weight: 600; border-radius: 12px; background: rgba(59, 130, 246, 0.08); border: 1px solid var(--border-glass); color: var(--primary); margin-right: 6px; margin-bottom: 6px;">
        ${kw}
      </span>
    `).join('');

    doNowHtml = `
      <div class="mastery-card do-now-card" style="max-width: 800px; margin: 24px auto 32px auto; background: var(--bg-card); border: 1px solid var(--border-glass); border-left: 5px solid var(--accent); border-radius: var(--border-radius-lg); position: relative; padding: 24px; box-shadow: var(--shadow-md); overflow: visible !important;">
        <div style="position: absolute; top: -14px; left: 20px; background: var(--accent); color: #000; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.8px; box-shadow: var(--shadow-sm); z-index: 10;">
          ⚡ DO NOW starter (5-10 MINS)
        </div>
        
        <div class="mastery-card-body" style="padding-top: 8px; margin: 0;">
          ${prevLessonLinkHtml}
          ${howUsefulBoxHtml}
          ${doNowPrototypesHtml}
          
          <div class="do-now-split-container" style="display: flex; gap: 24px; flex-wrap: wrap; margin-top: 8px;">
            
            <!-- Left Side: Visual Source & See-Think-Wonder & Keyword Bank -->
            <div class="do-now-left-col" style="flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 14px;">
              <div>
                <div style="background: #000; border-radius: var(--border-radius-md); overflow: hidden; padding: 8px; border: 1px solid var(--border-glass); text-align: center; box-shadow: var(--shadow-sm);">
                  <div style="position: relative; display: inline-block; max-width: 100%;">
                    <img id="do-now-court-img" src="${dn.image}" alt="Starter Image" style="max-width: 100%; max-height: 180px; object-fit: contain; border-radius: var(--border-radius-sm);">
                    ${subtopicId === 'subtopic_1_2' ? `
                    <style>
                      @keyframes pulse-glow {
                        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
                        70% { transform: scale(1.15); box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
                        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
                      }
                      @keyframes pulse-border {
                        0% { border-color: rgba(245, 158, 11, 0.3); }
                        50% { border-color: rgba(245, 158, 11, 0.8); }
                        100% { border-color: rgba(245, 158, 11, 0.3); }
                      }
                    </style>
                    <div id="do-now-hotspots-container" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                      <button class="hotspot-dot" data-title="Chief Justice Earl Warren" data-desc="Warren led the Supreme Court from 1953 to 1969 and fought to ensure the Brown v. Board decision was a unanimous 9-0 to prevent legal loopholes." style="position: absolute; top: 38%; left: 47%; width: 16px; height: 16px; border-radius: 50%; background: #fbbf24; border: 2px solid #fff; cursor: pointer; box-shadow: var(--shadow-md); animation: pulse-glow 2s infinite; padding: 0; outline: none; z-index: 15;"></button>
                      <button class="hotspot-dot" data-title="Federal Judges (Unanimous Front)" data-desc="The other eight justices in formal black robes. Their unified stance represented institutional federal authority overriding Southern segregation laws." style="position: absolute; top: 48%; left: 22%; width: 16px; height: 16px; border-radius: 50%; background: #fbbf24; border: 2px solid #fff; cursor: pointer; box-shadow: var(--shadow-md); animation: pulse-glow 2s infinite; padding: 0; outline: none; z-index: 15;"></button>
                    </div>
                    ` : ''}
                  </div>
                  ${subtopicId === 'subtopic_1_2' ? `
                  <div id="hotspot-tooltip-card" style="display: none; margin-top: 10px; background: rgba(0, 0, 0, 0.4); border: 1px solid var(--border-glass); padding: 8px 12px; border-radius: 4px; font-size: 0.8rem; line-height: 1.45; text-align: left; box-shadow: var(--shadow-sm);">
                    <strong style="color: var(--accent); display: block; font-size: 0.75rem; text-transform: uppercase;" id="hotspot-title">Hotspot Detail</strong>
                    <span id="hotspot-desc" style="color: #cbd5e1;">Click a yellow hotspot dot on the image to inspect Content details...</span>
                  </div>
                  ` : ''}
                  <div class="do-now-provenance-box" style="font-size: 0.75rem; color: #e2e8f0; font-weight: 500; font-style: normal; margin-top: 8px; text-align: left; background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); padding: 8px 12px; border-radius: var(--border-radius-sm); line-height: 1.45;">
                    <strong style="color: #94a3b8; text-transform: uppercase; font-size: 0.68rem; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Source Provenance</strong> ${dn.provenance}
                  </div>
                </div>
                ${accessibilityHtml}

                
                <!-- See Think Wonder Prompt Box -->
                <div style="background: rgba(245, 158, 11, 0.03); border: 1px solid rgba(245, 158, 11, 0.15); padding: 14px; border-radius: var(--border-radius-md); font-size: 0.82rem; margin-top: 14px; box-shadow: var(--shadow-sm);">
                  <strong style="color: var(--accent); display: flex; align-items: center; gap: 6px; margin-bottom: 10px; font-size: 0.88rem;">
                    <i class="fa-solid fa-compass" style="animation: spin 10s linear infinite;"></i> Inquiry: See, Think, Wonder
                  </strong>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; gap: 8px; align-items: flex-start;">
                      <span style="background: rgba(245, 158, 11, 0.12); color: var(--accent); font-weight: 700; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; margin-top: 1px; flex-shrink: 0; min-width: 48px; text-align: center;">See</span>
                      <span style="color: var(--text-base); line-height: 1.4;">${dn.seeThinkWonder.see}</span>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: flex-start;">
                      <span style="background: rgba(245, 158, 11, 0.12); color: var(--accent); font-weight: 700; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; margin-top: 1px; flex-shrink: 0; min-width: 48px; text-align: center;">Think</span>
                      <span style="color: var(--text-base); line-height: 1.4;">${dn.seeThinkWonder.think}</span>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: flex-start;">
                      <span style="background: rgba(245, 158, 11, 0.12); color: var(--accent); font-weight: 700; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; margin-top: 1px; flex-shrink: 0; min-width: 48px; text-align: center;">Wonder</span>
                      <span style="color: var(--text-base); line-height: 1.4;">${dn.seeThinkWonder.wonder}</span>
                    </div>
                  </div>
                </div>
              </div>
 
              <!-- Keyword Bank -->
              <div style="margin-top: 8px; border-top: 1px solid var(--border-glass); padding-top: 14px;">
                <strong style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 8px; letter-spacing: 0.5px;">🔑 Retrieval Keyword Bank:</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  ${keywordsHtml}
                </div>
              </div>
            </div>
            
            <!-- Right Side: Three-Tiered Cognitive Challenge -->
            <div class="do-now-right-col" style="flex: 1.2; min-width: 300px; display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; border-bottom: 1px solid var(--border-glass); padding-bottom: 6px; letter-spacing: 0.5px; margin-bottom: 2px;">
                  🏆 Three-Tiered Challenge
                </div>
                
                <!-- Bronze Recall -->
                <div style="position: relative; padding: 12px 14px 12px 46px; background: rgba(205, 127, 50, 0.02); border: 1px solid rgba(205, 127, 50, 0.12); border-left: 4px solid #cd7f32; border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm);">
                  <div style="position: absolute; top: 12px; left: 12px; width: 22px; height: 22px; border-radius: 50%; background: #cd7f32; color: #000; font-weight: 800; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">🥉</div>
                  <strong style="color: #d97706; font-size: 0.82rem; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px;">Bronze Challenge (Recall - Last Lesson)</strong>
                  <p style="margin: 0; font-size: 0.88rem; line-height: 1.45; color: var(--text-main);">${dn.bronze}</p>
                </div>
                
                <!-- Silver Analyze -->
                <div style="position: relative; padding: 12px 14px 12px 46px; background: rgba(161, 161, 170, 0.02); border: 1px solid rgba(161, 161, 170, 0.12); border-left: 4px solid #a1a1aa; border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm);">
                  <div style="position: absolute; top: 12px; left: 12px; width: 22px; height: 22px; border-radius: 50%; background: #a1a1aa; color: #000; font-weight: 800; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">🥈</div>
                  <strong style="color: #cbd5e1; font-size: 0.82rem; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px;">Silver Challenge (Analyze - Source Inference)</strong>
                  <p style="margin: 0; font-size: 0.88rem; line-height: 1.45; color: var(--text-main);">${dn.silver}</p>
                </div>
                
                <!-- Gold Evaluate -->
                <div style="position: relative; padding: 12px 14px 12px 46px; background: rgba(251, 191, 36, 0.02); border: 1px solid rgba(251, 191, 36, 0.12); border-left: 4px solid #fbbf24; border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm);">
                  <div style="position: absolute; top: 12px; left: 12px; width: 22px; height: 22px; border-radius: 50%; background: #ffd700; color: #000; font-weight: 800; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">🥇</div>
                  <strong style="color: #fbbf24; font-size: 0.82rem; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px;">Gold Challenge (Evaluate - Synoptic Link)</strong>
                  <p style="margin: 0; font-size: 0.88rem; line-height: 1.45; color: var(--text-main);">${dn.gold}</p>
                </div>
              </div>
            </div>
            
          </div>
          
          <!-- Bottom Section: Reveal Do Now Answers Button Row -->
          <div style="margin-top: 20px; border-top: 1px solid var(--border-glass); padding-top: 16px; display: flex; flex-direction: column; gap: 14px;">
            <button class="mastery-btn do-now-reveal-btn" style="background: rgba(245, 158, 11, 0.1); border: 1px solid var(--accent); color: var(--accent); font-weight: bold; font-size: 0.82rem; padding: 8px 18px; border-radius: 20px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; width: fit-content;">
              <i class="fa-solid fa-graduation-cap"></i> Reveal Do Now Guide Answers
            </button>
            
            <!-- Hidden structured responses drawer -->
            <div class="do-now-answers-drawer" style="display: none; padding: 16px; background: rgba(34, 197, 94, 0.02); border: 1px solid var(--border-glass); border-left: 4px solid var(--success); border-radius: var(--border-radius-md);">
              <h4 style="margin: 0 0 14px 0; color: var(--success); font-size: 0.95rem; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-circle-check"></i> Starter Evaluation Guide:</h4>
              <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.88rem; line-height: 1.5;">
                <div style="padding: 10px 12px; background: rgba(205, 127, 50, 0.04); border-left: 3px solid #cd7f32; border-radius: 4px;">
                  <strong style="color: #cd7f32; display: block; font-size: 0.82rem; margin-bottom: 2px;">🥉 Bronze Answer Recall:</strong>
                  <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem;">${dn.bronzeAnswer}</p>
                </div>
                <div style="padding: 10px 12px; background: rgba(161, 161, 170, 0.04); border-left: 3px solid #a1a1aa; border-radius: 4px;">
                  <strong style="color: #cbd5e1; display: block; font-size: 0.82rem; margin-bottom: 2px;">🥈 Silver Answer Analysis:</strong>
                  <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem;">${dn.silverAnswer}</p>
                </div>
                <div style="padding: 10px 12px; background: rgba(251, 191, 36, 0.04); border-left: 3px solid #fbbf24; border-radius: 4px;">
                  <strong style="color: #fbbf24; display: block; font-size: 0.82rem; margin-bottom: 2px;">🥇 Gold Answer Evaluation:</strong>
                  <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem;">${dn.goldAnswer}</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    `;
  }

  const video = VIDEOS_DATA[subtopicId];
  let videoHtml = '';
  if (video) {
    const cleanDuration = video.duration.startsWith('0') ? video.duration.slice(1) : video.duration;
    const questionsList = video.questions.map(q => `<li>${q}</li>`).join('');
    
    videoHtml = `
      <div class="lesson-video-wrapper" style="margin-top: 14px; border-top: 1px dashed var(--border-glass); padding-top: 12px;">
        <p style="font-size: 0.88rem; line-height: 1.5; color: var(--text-main); margin: 0 0 10px 0;">
          <i class="fa-brands fa-youtube" style="color: #ef4444; font-size: 1.1rem; margin-right: 6px; vertical-align: middle;"></i>
          Watch this YouTube video on "${data.headerTitle.split(':').pop().trim()}" by ${video.production_source}: 
          <a href="${video.youtube_url}" target="_blank" style="color: var(--primary); font-weight: bold; text-decoration: underline; transition: color var(--transition-fast);" onmouseover="this.style.color='var(--primary-hover)'" onmouseout="this.style.color='var(--primary)'">
            "${video.video_title}"
          </a> (${cleanDuration} mins).
        </p>
        
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); padding: 10px 14px;">
          <strong style="font-size: 0.75rem; color: var(--accent); display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
            <i class="fa-solid fa-clipboard-question"></i> Video Study Questions:
          </strong>
          <ul style="margin: 0; padding-left: 20px; font-size: 0.8rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px; line-height: 1.45;">
            ${questionsList}
          </ul>
        </div>
      </div>
    `;
  }

  let lessonWrapUpHtml = '';
  const wuChallenge = WRAPUP_DATA[subtopicId];
  if (wuChallenge) {
    const factCardsHtml = wuChallenge.facts.map(f => `
      <div class="wrapup-fact-card" draggable="true" data-fact-id="${f.id}">
        ${f.text}
      </div>
    `).join('');

    const bucketsHtml = wuChallenge.categories.map(cat => `
      <div class="wrapup-bucket" data-category="${cat}">
        <strong style="color: var(--accent); font-size: 0.88rem; display: block; border-bottom: 1px solid var(--border-glass); padding-bottom: 6px; margin-bottom: 4px;">
          ${cat}
        </strong>
        <div class="wrapup-bucket-slots"></div>
      </div>
    `).join('');

    lessonWrapUpHtml = `
      <style>
        .wrapup-fact-card {
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          border-radius: 6px;
          font-size: 0.82rem;
          line-height: 1.45;
          color: var(--text-base);
          cursor: grab;
          user-select: none;
          transition: all 0.2s;
        }
        .wrapup-fact-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--primary);
        }
        .wrapup-fact-card.selected {
          border-color: var(--accent);
          background: rgba(245, 158, 11, 0.08);
        }
        .wrapup-fact-card.dragging {
          opacity: 0.4;
        }
        .wrapup-bucket {
          flex: 1;
          min-width: 260px;
          background: rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border-glass);
          border-radius: 6px;
          padding: 14px;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .wrapup-bucket.drag-over {
          border-color: var(--accent);
          background: rgba(255, 255, 255, 0.02);
        }
        .wrapup-bucket-slots {
          min-height: 100px;
          border: 2px dashed rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: rgba(0, 0, 0, 0.08);
          transition: background 0.2s;
        }
        .wrapup-bucket.drag-over .wrapup-bucket-slots {
          background: rgba(245, 158, 11, 0.02);
          border-color: rgba(245, 158, 11, 0.3);
        }
      </style>
      <div class="mastery-card lesson-wrap-up-card" style="max-width: 800px; margin: 0 auto 24px auto; border-left: 4px solid var(--accent); background: rgba(249, 115, 22, 0.02);">
        <h3 class="mastery-card-title" style="display: flex; justify-content: space-between; align-items: center; gap: 10px; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px; font-size: 1rem; color: var(--accent); margin: 0 0 12px 0;">
          <span><i class="fa-solid fa-graduation-cap"></i> Lesson Wrap-up: Historiographical Decider</span>
        </h3>
        <div class="mastery-card-body" style="padding-top: 4px;">
          <p style="font-style: italic; color: var(--text-muted); font-size: 0.82rem; margin-top: 0; margin-bottom: 16px; line-height: 1.45;">
            <strong>Depth of Knowledge Challenge:</strong> Drag and drop the advanced facts below into their correct analytical categories (or click a card to select it, then click a target category to place it).
          </p>
          
          <!-- Draggable Fact Cards -->
          <div class="wrapup-cards-pool" style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
            ${factCardsHtml}
          </div>
          
          <!-- Category Buckets -->
          <div class="wrapup-buckets-container" style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 14px;">
            ${bucketsHtml}
          </div>
          
          <!-- Success Feedback Drawer -->
          <div class="wrapup-success-drawer" style="display: none; padding: 14px; background: rgba(16, 185, 129, 0.04); border-left: 4px solid var(--success); border-radius: var(--border-radius-sm); margin-top: 14px;">
            <h4 style="margin: 0 0 8px 0; color: var(--success); font-size: 0.9rem; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-circle-check"></i> Depth of Knowledge Mastered!
            </h4>
            <div class="wrapup-explanations-list" style="font-size: 0.8rem; line-height: 1.45; color: var(--text-muted); display: flex; flex-direction: column; gap: 8px;">
              <!-- Explanations will be appended here -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  let hwHtml = '';
  const hwQuestions = HOMEWORK_QUESTIONS[subtopicId];
  if (hwQuestions && hwQuestions.length > 0) {
    const questionsListMarkup = hwQuestions.map((q, idx) => {
      const badgeClass = `badge-${q.type.toLowerCase().replace(/\s/g, '')}`;
      return `
        <div class="journey-step-card" data-step="${idx}">
          <div class="journey-step-header">
            <div class="journey-step-left">
              <div class="journey-step-circle">Q${idx + 1}</div>
              <span class="journey-level-badge ${badgeClass}">Level ${q.level}: ${q.type}</span>
            </div>
            <div class="journey-step-right">
              <i class="fa-solid fa-chevron-down journey-toggle-icon"></i>
            </div>
          </div>
          <p class="journey-step-question">${applyGlossaryTooltips(q.question)}</p>
          <div class="journey-answer-guide">
            <span class="journey-answer-title">🛡️ Answer Guide:</span>
            <p class="journey-answer-text">${applyGlossaryTooltips(q.answer)}</p>
          </div>
        </div>
      `;
    }).join('');
    
    hwHtml = `
      <div class="mastery-card homework-questions-card" style="max-width: 800px; margin: 0 auto 24px auto; border-left: 4px solid var(--primary); background: rgba(0, 0, 0, 0.15);">
        <h3 class="mastery-card-title"><i class="fa-solid fa-shield-halved" style="color: var(--primary);"></i> 🛡️ 10-Step Unit Mastery Journey</h3>
        <div class="mastery-card-body" style="padding-top: 6px;">
          <p style="font-style: italic; margin-top: 0; margin-bottom: 20px; color: var(--text-muted); font-size: 0.85rem;">
            Missed this lesson or need a thorough refresh? Click through these 10 structured questions (ranging from basic recall to expert challenge) to master the unit!
          </p>
          <div class="mastery-journey-container">
            ${questionsListMarkup}
          </div>
        </div>
      </div>
    `;
  }



  let mapHtml = '';
  if (data.mapConfig) {
    mapHtml = `
      <div class="mastery-card lesson-map-card" style="max-width: 800px; margin: 0 auto 24px auto; border-left: 4px solid var(--primary); background: rgba(0, 0, 0, 0.15);">
        <h3 class="mastery-card-title" style="display: flex; align-items: center; gap: 8px; font-size: 1rem; color: var(--primary); margin: 0 0 12px 0; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">
          <span><i class="fa-solid fa-map-location-dot"></i> Interactive Lesson Map: ${data.mapConfig.title}</span>
        </h3>
        <div class="mastery-card-body" style="padding-top: 4px;">
          <p style="margin-top: 0; margin-bottom: 16px; font-style: italic; color: var(--text-muted); font-size: 0.85rem;">
            Click on the pulsing markers to explore the locations where these historic events unfolded. Use the controls to zoom.
          </p>
          <div class="map-wrapper" style="position: relative; width: 100%; border-radius: var(--border-radius-md); overflow: hidden;">
            <div id="leaflet-map-${subtopicId}" style="width: 100%; height: 350px; background: #111; z-index: 1;"></div>
          </div>
          <div class="map-significance-box" id="map-significance-${subtopicId}" style="margin-top: 14px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); padding: 12px 14px; font-size: 0.9rem; line-height: 1.45; border-left: 3px solid var(--accent); transition: all 0.2s;">
            <strong>Map Notes:</strong> ${applyGlossaryTooltips(data.mapConfig.description)}
          </div>
        </div>
      </div>
    `;
  }

  // Set the container innerHTML
  container.innerHTML = `
    ${doNowHtml}
    
    <!-- Header Card -->
    <div class="mastery-header-card" style="max-width: 800px; margin: 0 auto 24px auto;">
      <h2 class="mastery-header-title" style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
        <span>${data.headerTitle}</span>
        <button class="btn-audio-read" data-text-selector=".mastery-header-intro" title="Read Introduction Aloud">
          <i class="fa-solid fa-volume-high"></i>
        </button>
      </h2>
      <p class="mastery-header-intro" style="margin-bottom: 16px;">
        ${applyGlossaryTooltips(data.headerIntro)}
      </p>
      ${renderSpecChecklistCard(subtopicId, SPEC_CHECKLIST_DATA[subtopicId])}
      ${videoHtml}
    </div>

    ${mapHtml}

    <!-- Interactive Legend and Switch -->
    <div class="mastery-controls" style="max-width: 800px; margin: 0 auto 20px auto;">
      <div class="legend-box">
        <span class="legend-highlight">Process Word</span> Legend: Underlined process words show cause and effect—use these in your exam answers!
      </div>
      <label class="toggle-wrapper" id="mastery-toggle-wrapper">
        <span>🧠 Hard Mode (Hide Key Facts)</span>
        <div class="toggle-switch">
          <input type="checkbox" id="mastery-hard-mode-toggle">
          <span class="toggle-slider"></span>
        </div>
      </label>
    </div>

    ${stepsHtml}
    
    ${dualHtml}
    
    ${lessonWrapUpHtml}
    
    ${kcHtml}
    
    ${summaryCorrectionHtml}
    
    ${hwHtml}
    
    ${causalHtml}
    
    ${impHtml}
    
    ${vaultHtml}
    
    ${howUsefulHtml}
    
    ${deepThinkingHtml}

    <!-- Mastery Progress Button -->
    <div style="max-width: 800px; margin: 0 auto 40px auto; padding: 0 10px;">
      <button class="mastery-btn mastery-btn-success" id="btn-mark-mastery-mastered">
        ✓ Mark Topic ${subtopicId.replace('subtopic_', '').replace('_', '.')} as Mastered
      </button>
    </div>
  `;



  // Bind Audio Assist TTS buttons
  const audioButtons = container.querySelectorAll('.btn-audio-read');
  audioButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Get text to read
      let textToRead = '';
      const selector = btn.getAttribute('data-text-selector');
      if (selector) {
        const parent = btn.closest('.mastery-header-card, .mastery-card');
        const targetEl = parent ? parent.querySelector(selector) : document.querySelector(selector);
        if (targetEl) {
          textToRead = targetEl.innerText;
        }
      } else {
        // Default to card body
        const card = btn.closest('.mastery-card');
        if (card) {
          const body = card.querySelector('.mastery-card-body, .mastery-split-layout');
          if (body) textToRead = body.innerText;
        }
      }
      
      if (!textToRead) return;
      
      // Toggle if already speaking
      if (btn.classList.contains('speaking')) {
        AudioEngine.stopSpeaking();
        btn.classList.remove('speaking');
        btn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
        return;
      }
      
      // Stop others and reset icons
      audioButtons.forEach(b => {
        b.classList.remove('speaking');
        b.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
      });
      
      AudioEngine.speak(
        textToRead,
        () => { // onstart
          btn.classList.add('speaking');
          btn.innerHTML = `<i class="fa-solid fa-circle-stop"></i>`;
        },
        () => { // onend
          btn.classList.remove('speaking');
          btn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
        },
        () => { // onerror
          btn.classList.remove('speaking');
          btn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
        }
      );
    });
  });

  // Bind Summary Spot-the-Errors Clicks
  const summaryCard = document.getElementById('summary-correction-card');
  if (summaryCard) {
    const wrongWords = summaryCard.querySelectorAll('.summary-wrong-word');
    wrongWords.forEach(wordSpan => {
      wordSpan.addEventListener('click', () => {
        if (wordSpan.classList.contains('corrected')) return;

        // Play success sound
        AudioEngine.play('success');

        // Swap the word
        const correctWord = wordSpan.getAttribute('data-correct');
        wordSpan.textContent = correctWord;
        wordSpan.classList.add('corrected');

        // Check if all are corrected
        const allCorrected = Array.from(wrongWords).every(span => span.classList.contains('corrected'));
        if (allCorrected) {
          AudioEngine.play('cheer');
          const successPanel = document.getElementById('summary-success-panel');
          if (successPanel) {
            successPanel.style.display = 'block';
            successPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          if (typeof Confetti !== 'undefined' && typeof Confetti.spawn === 'function') {
            Confetti.spawn(80);
          }
        }
      });
    });
  }

  // Bind Hard Mode Toggle
  const hardModeToggle = document.getElementById('mastery-hard-mode-toggle');
  if (hardModeToggle) {
    hardModeToggle.addEventListener('change', () => {
      AudioEngine.play('click');
      const isHard = hardModeToggle.checked;
      if (isHard) {
        container.classList.add('hard-mode-active');
      } else {
        container.classList.remove('hard-mode-active');
      }
      setupHardModeKeywords(container);
    });
  }

  // Bind keyword reveal clicks on hard-mode-blank
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('hard-mode-blank')) {
      const strongEl = e.target;
      if (container.classList.contains('hard-mode-active')) {
        AudioEngine.play('success');
        strongEl.classList.toggle('revealed');
      }
    }
  });

  // Individual quiz question click to toggle answer reveal (Disabled)

  // Interactive Map Toggle with Fallbacks
  const btnPartition = document.getElementById('btn-map-partition');
  const btnBorders = document.getElementById('btn-map-borders');
  const mapImg = document.getElementById('map-image-placeholder');

  if (mapImg && btnPartition && btnBorders) {
    const map1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><rect x="0" y="0" width="100" height="120" fill="#f8fafc" /><path d="M 40,5 L 55,5 L 62,35 L 75,60 L 68,90 L 52,112 L 44,115 L 43,90 L 41,70 L 32,50 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5" /><path d="M 40,5 L 55,5 L 60,20 L 44,20 Z" fill="#ffedd5" stroke="#f97316" stroke-width="0.5" /><path d="M 41,20 L 48,20 L 48,60 L 41,70 L 32,50 Z" fill="#ffedd5" stroke="#f97316" stroke-width="0.5" /><path d="M 41,70 L 50,70 L 52,112 L 44,115 L 43,90 Z" fill="#ffedd5" stroke="#f97316" stroke-width="0.5" /><path d="M 48,20 L 62,35 L 75,60 L 58,60 L 48,45 Z" fill="#dcfce7" stroke="#22c55e" stroke-width="0.5" /><path d="M 58,60 L 75,60 L 68,90 L 50,70 Z" fill="#dcfce7" stroke="#22c55e" stroke-width="0.5" /><circle cx="51" cy="58" r="4" fill="#ef4444" stroke="#ffffff" stroke-width="1" /><text x="58" y="60" font-family="sans-serif" font-size="5" font-weight="bold" fill="#ef4444">UN Zone</text><text x="10" y="15" font-family="sans-serif" font-size="6" font-weight="bold" fill="#f97316">Jewish State</text><text x="10" y="23" font-family="sans-serif" font-size="6" font-weight="bold" fill="#22c55e">Arab State</text><text x="35" y="112" font-family="sans-serif" font-size="5" fill="#94a3b8">1947 Plan</text></svg>`;
    const map2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><rect x="0" y="0" width="100" height="120" fill="#f8fafc" /><path d="M 40,5 L 55,5 L 62,35 L 75,60 L 68,90 L 52,112 L 44,115 L 43,90 L 41,70 L 32,50 Z" fill="#ffedd5" stroke="#f97316" stroke-width="1.5" /><path d="M 46,35 L 60,35 L 70,60 L 65,80 L 52,75 L 46,55 Z" fill="#dcfce7" stroke="#22c55e" stroke-width="1" stroke-dasharray="2,2" /><text x="50" y="55" font-family="sans-serif" font-size="5" font-weight="bold" fill="#166534">West Bank</text><text x="50" y="61" font-family="sans-serif" font-size="4" fill="#166534">(Jordan)</text><path d="M 32,50 L 37,50 L 40,65 L 35,65 Z" fill="#fef9c3" stroke="#eab308" stroke-width="1" stroke-dasharray="2,2" /><text x="21" y="62" font-family="sans-serif" font-size="4" font-weight="bold" fill="#854d0e">Gaza</text><circle cx="48" cy="53" r="2.5" fill="#ef4444" stroke="#ffffff" stroke-width="0.5" /><text x="10" y="15" font-family="sans-serif" font-size="6" font-weight="bold" fill="#f97316">Israel</text><text x="35" y="112" font-family="sans-serif" font-size="5" fill="#94a3b8">1949 Armistice</text></svg>`;

    const map1DataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(map1Svg)));
    const map2DataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(map2Svg)));

    const handleImgError = () => {
      if (mapImg.src.includes('map_1947.png')) {
        mapImg.src = map1DataUrl;
      } else if (mapImg.src.includes('map_1949.png')) {
        mapImg.src = map2DataUrl;
      }
    };

    mapImg.addEventListener('error', handleImgError);

    if (mapImg.complete && mapImg.naturalWidth === 0) {
      handleImgError();
    }

    btnPartition.addEventListener('click', () => {
      AudioEngine.play('click');
      btnPartition.classList.add('active');
      btnBorders.classList.remove('active');
      mapImg.src = "assets/map_1947.png";
      setTimeout(() => {
        if (mapImg.naturalWidth === 0) {
          mapImg.src = map1DataUrl;
        }
      }, 60);
    });

    btnBorders.addEventListener('click', () => {
      AudioEngine.play('click');
      btnBorders.classList.add('active');
      btnPartition.classList.remove('active');
      mapImg.src = "assets/map_1949.png";
      setTimeout(() => {
        if (mapImg.naturalWidth === 0) {
          mapImg.src = map2DataUrl;
        }
      }, 60);
    });
  }

  // Causal Link Builder Game Logic
  if (data.causalLinks) {
    const totalFactors = data.causalLinks.factors.length;
    const linkedFactors = new Set();
    
    data.causalLinks.factors.forEach(f => {
      const select = document.getElementById(`causal-select-${f.id}`);
      if (select) {
        select.addEventListener('change', (e) => {
          const selectedVal = parseInt(e.target.value);
          const correctVal = parseInt(select.getAttribute('data-correct'));
          const card = document.getElementById(`causal-factor-card-${f.id}`);
          const status = document.getElementById(`causal-status-${f.id}`);
          
          if (selectedVal === correctVal) {
            AudioEngine.play('success');
            card.classList.add('linked');
            status.textContent = "LINKED!";
            select.disabled = true;
            linkedFactors.add(f.id);
            
            // Check if all are linked
            if (linkedFactors.size === totalFactors) {
              AudioEngine.play('cheer');
              const successPanel = document.getElementById('causal-success-panel');
              if (successPanel) {
                successPanel.style.display = 'block';
                successPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
              if (typeof Confetti !== 'undefined' && typeof Confetti.spawn === 'function') {
                Confetti.spawn(80);
              }
            }
          } else {
            AudioEngine.play('fail');
            alert("Incorrect consequence link! That statement is historically inaccurate or matches a different cause. Try again!");
            select.value = ""; // Reset dropdown
          }
        });
      }
    });
  }

  // Bind Dual Perspective Sliders
  const sliderCards = container.querySelectorAll('.dual-perspective-card');
  sliderCards.forEach(card => {
    const slider = card.querySelector('.perspective-range-slider');
    const labelLeft = card.querySelector('.perspective-label.label-left');
    const labelRight = card.querySelector('.perspective-label.label-right');
    const headline = card.querySelector('.dual-perspective-headline');
    const text = card.querySelector('.dual-perspective-text');

    if (!slider || !labelLeft || !labelRight || !headline || !text) return;

    // Inject visual hint dynamically
    const sliderRow = card.querySelector('.dual-perspective-slider-row');
    if (sliderRow && !card.querySelector('.slider-hint')) {
      const hint = document.createElement('div');
      hint.className = 'slider-hint';
      hint.style.cssText = 'text-align: center; font-size: 0.7rem; color: var(--text-muted); margin-top: 8px; font-style: italic; display: flex; align-items: center; justify-content: center; gap: 4px; opacity: 0.8;';
      hint.innerHTML = `<i class="fa-solid fa-arrows-left-right"></i> Drag slider or click labels to compare perspectives`;
      sliderRow.after(hint);
    }

    const leftHeadline = card.getAttribute('data-left-headline');
    const leftText = card.getAttribute('data-left-text');
    const rightHeadline = card.getAttribute('data-right-headline');
    const rightText = card.getAttribute('data-right-text');

    let currentPerspective = 'left';

    slider.addEventListener('input', () => {
      const val = parseInt(slider.value);
      const isRight = val >= 50;
      const newPerspective = isRight ? 'right' : 'left';

      if (newPerspective !== currentPerspective) {
        AudioEngine.play('click');
        currentPerspective = newPerspective;

        const narrativeBox = card.querySelector('.dual-perspective-narrative-box');
        if (narrativeBox) {
          narrativeBox.classList.remove('perspective-fade');
          void narrativeBox.offsetWidth;
          narrativeBox.classList.add('perspective-fade');
        }

        if (isRight) {
          card.classList.remove('left-active');
          card.classList.add('right-active');
          labelLeft.classList.remove('active');
          labelRight.classList.add('active');
          headline.innerText = rightHeadline;
          text.innerText = rightText;
        } else {
          card.classList.remove('right-active');
          card.classList.add('left-active');
          labelRight.classList.remove('active');
          labelLeft.classList.add('active');
          headline.innerText = leftHeadline;
          text.innerText = leftText;
        }
      }
    });

    labelLeft.addEventListener('click', () => {
      if (slider.value != 0) {
        slider.value = 0;
        slider.dispatchEvent(new Event('input'));
      }
    });

    labelRight.addEventListener('click', () => {
      if (slider.value != 100) {
        slider.value = 100;
        slider.dispatchEvent(new Event('input'));
      }
    });
  });

  // Importance Analyser Flip Card Listener
  const flipCard = document.getElementById('importance-analyser-card');
  if (flipCard) {
    flipCard.addEventListener('click', () => {
      AudioEngine.play('flip');
      flipCard.classList.toggle('flipped');
    });
  }

  // Homework Journey Step Card Accordion Toggles
  const journeyCards = container.querySelectorAll('.journey-step-card');
  journeyCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't toggle accordion if clicking on a glossary term
      if (e.target.classList.contains('glossary-term')) {
        return;
      }
      
      AudioEngine.play('click');
      const isActive = card.classList.contains('active');
      
      // Close all step cards in this container
      journeyCards.forEach(c => c.classList.remove('active'));
      
      if (!isActive) {
        card.classList.add('active');
      }
    });
  });

  // Exam Question Vault Accordion Toggles
  const vaultQuestionBtns = container.querySelectorAll('.vault-question-btn');
  vaultQuestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.play('click');
      const panel = btn.nextElementSibling;
      const isVisible = panel.classList.contains('active');
      
      // Close all panels
      container.querySelectorAll('.vault-answer-panel').forEach(p => p.classList.remove('active'));
      container.querySelectorAll('.vault-question-btn i').forEach(icon => {
        icon.className = 'fa-solid fa-chevron-down';
      });

      if (!isVisible) {
        panel.classList.add('active');
        btn.querySelector('i').className = 'fa-solid fa-chevron-up';
      }
    });
  });

  // Vault Written Reveal Buttons
  const vaultRevealBtns = container.querySelectorAll('.vault-reveal-btn');
  vaultRevealBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.play('flip');
      const section = btn.closest('.vault-model-answer-section');
      const content = section.querySelector('.vault-model-answer-content');
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? 'block' : 'none';
      btn.innerHTML = isHidden ? '<i class="fa-solid fa-eye-slash"></i> Hide Model Answer' : '<i class="fa-solid fa-eye"></i> Compare with Model Answer';
    });
  });

  // Vault Written Clue Buttons
  const vaultClueBtns = container.querySelectorAll('.vault-clue-btn');
  vaultClueBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.play('click');
      const section = btn.closest('.vault-model-answer-section');
      const clueContent = section.querySelector('.vault-clue-content');
      const isHidden = clueContent.style.display === 'none';
      clueContent.style.display = isHidden ? 'block' : 'none';
      btn.innerHTML = isHidden ? '<i class="fa-solid fa-lightbulb"></i> Hide Clue' : '<i class="fa-solid fa-lightbulb"></i> Educator Clue';
    });
  });

  // Q1 Interactive Vault Checks
  const q1InteractiveContainers = container.querySelectorAll('.interactive-vault-q1');
  q1InteractiveContainers.forEach(q1Div => {
    const vaultIdx = parseInt(q1Div.getAttribute('data-vault-idx'));
    const qData = data.questionVault[vaultIdx];
    const checkBtn = q1Div.querySelector('.vault-q1-check-btn');
    const feedbackDiv = q1Div.querySelector('.vault-q1-feedback');
    const modelAnsDiv = q1Div.querySelector('.vault-q1-model-answer');
    const checkboxes = q1Div.querySelectorAll('.vault-q1-option');

    checkBtn.addEventListener('click', () => {
      const selectedIndices = [];
      checkboxes.forEach(cb => {
        if (cb.checked) {
          selectedIndices.push(parseInt(cb.getAttribute('data-idx')));
        }
      });

      if (selectedIndices.length !== 2) {
        AudioEngine.play('fail');
        feedbackDiv.style.display = 'block';
        feedbackDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        feedbackDiv.style.color = '#ef4444';
        feedbackDiv.style.borderLeft = '4px solid #ef4444';
        feedbackDiv.style.padding = '10px 14px';
        feedbackDiv.textContent = '⚠️ Please select exactly TWO inferences.';
        return;
      }

      const correctIndices = qData.correctIndices;
      const isCorrect = selectedIndices.every(idx => correctIndices.includes(idx)) &&
                        correctIndices.every(idx => selectedIndices.includes(idx));

      feedbackDiv.style.display = 'block';
      modelAnsDiv.style.display = 'block';
      feedbackDiv.style.padding = '10px 14px';

      if (isCorrect) {
        AudioEngine.play('success');
        feedbackDiv.style.background = 'rgba(34, 197, 94, 0.1)';
        feedbackDiv.style.color = '#22c55e';
        feedbackDiv.style.borderLeft = '4px solid #22c55e';
        feedbackDiv.textContent = '🎉 Correct! Both inferences are supported by the source details.';
      } else {
        AudioEngine.play('fail');
        feedbackDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        feedbackDiv.style.color = '#ef4444';
        feedbackDiv.style.borderLeft = '4px solid #ef4444';
        feedbackDiv.textContent = '❌ Incorrect. Some selected inferences are incorrect or not supported.';
      }

      checkboxes.forEach(cb => {
        const idx = parseInt(cb.getAttribute('data-idx'));
        const label = cb.parentElement;
        if (correctIndices.includes(idx)) {
          label.style.background = 'rgba(34, 197, 94, 0.15)';
          label.style.borderLeft = '3px solid #22c55e';
          label.style.paddingLeft = '5px';
        } else if (cb.checked) {
          label.style.background = 'rgba(239, 68, 68, 0.15)';
          label.style.borderLeft = '3px solid #ef4444';
          label.style.paddingLeft = '5px';
        } else {
          label.style.background = 'rgba(255, 255, 255, 0.02)';
          label.style.borderLeft = 'none';
          label.style.paddingLeft = '8px';
        }
      });
    });
  });

  // Initialize Leaflet Map
  if (data.mapConfig && window.L) {
    setTimeout(() => {
      initializeLeafletMap(subtopicId, data.mapConfig);
    }, 100);
  }

  // How Useful Analyser Event Listeners
  if (data.howUsefulAnalyser) {
    const huCard = container.querySelector('.how-useful-card');
    if (huCard) {
      // Tab Switching
      const tabBtns = huCard.querySelectorAll('.hu-tab-btn');
      const panels = huCard.querySelectorAll('.hu-tab-panel');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          AudioEngine.play('click');
          const targetTab = btn.getAttribute('data-tab');
          
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          // Style active tab border-bottom
          tabBtns.forEach(b => {
            b.style.borderBottom = '2px solid transparent';
            b.style.color = 'var(--text-muted)';
          });
          btn.style.borderBottom = '2px solid var(--primary)';
          btn.style.color = 'var(--text-base)';

          panels.forEach(p => {
            if (p.id === `panel-${targetTab}`) {
              p.style.display = 'block';
            } else {
              p.style.display = 'none';
            }
          });
        });
      });

      // Model Answer Reveal
      const revealBtn = huCard.querySelector('.hu-reveal-btn');
      const modelContent = huCard.querySelector('.hu-model-answer-content');
      if (revealBtn && modelContent) {
        revealBtn.addEventListener('click', () => {
          AudioEngine.play('flip');
          const isHidden = modelContent.style.display === 'none';
          if (isHidden) {
            modelContent.style.display = 'block';
            revealBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> Hide Examiner Model Answer`;
            modelContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            modelContent.style.display = 'none';
            revealBtn.innerHTML = `<i class="fa-solid fa-eye"></i> Compare with Examiner Model Answer`;
          }
        });
      }

      // Debounced auto-save for Draft Response text area
      const textarea = huCard.querySelector('.hu-textarea');
      if (textarea) {
        const subId = textarea.getAttribute('data-subtopic-id');
        const saveStatus = document.getElementById(`hu-save-status-${subId}`);
        let saveTimeout;
        textarea.addEventListener('input', () => {
          if (saveTimeout) clearTimeout(saveTimeout);
          
          if (saveStatus) {
            saveStatus.style.display = 'inline';
            saveStatus.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...`;
          }
          
          saveTimeout = setTimeout(() => {
            if (!state.howUsefulAnswers) state.howUsefulAnswers = {};
            state.howUsefulAnswers[subId] = textarea.value;
            saveProgress();
            
            if (saveStatus) {
              saveStatus.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Draft Saved`;
            }
          }, 800);
        });

        // Bind sentence starters dropdown
        const starterSelect = huCard.querySelector('.hu-starter-select');
        if (starterSelect) {
          starterSelect.addEventListener('change', () => {
            const starterText = starterSelect.value;
            if (!starterText) return;
            
            AudioEngine.play('click');
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            const originalText = textarea.value;
            
            if (startPos !== undefined) {
              textarea.value = originalText.substring(0, startPos) + starterText + originalText.substring(endPos);
              textarea.selectionStart = textarea.selectionEnd = startPos + starterText.length;
            } else {
              textarea.value += starterText;
            }
            
            starterSelect.value = '';
            textarea.focus();
            
            // Trigger auto-save
            textarea.dispatchEvent(new Event('input'));
          });
        }
      }
    }
  }

  // Deep Thinking Prompts Event Listeners (Disabled)

  // Bind Timeline Bridge Buttons
  const bridgeBtns = container.querySelectorAll('.timeline-bridge-btn');
  bridgeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.play('click');
      const year = btn.getAttribute('data-year');
      
      // Go to timeline view
      switchView('timeline');
      
      // Filter timeline
      const eraSelect = document.getElementById('timeline-era-select');
      if (eraSelect) {
        eraSelect.value = 'all';
        eraSelect.dispatchEvent(new Event('change'));
      }
      
      const searchInput = document.getElementById('timeline-search-input');
      if (searchInput) {
        searchInput.value = year;
        searchInput.dispatchEvent(new Event('input'));
      }
      
      // Highlight search field temporarily for the pupil
      if (searchInput) {
        searchInput.focus();
        searchInput.style.outline = '2px solid var(--accent)';
        setTimeout(() => {
          searchInput.style.outline = 'none';
        }, 1500);
      }
    });
  });

  // Mark Mastery button
  const btnMark = document.getElementById('btn-mark-mastery-mastered');
  if (btnMark) {
    btnMark.addEventListener('click', () => {
      AudioEngine.play('cheer');
      btnMark.classList.add('clicked');
      btnMark.disabled = true;
      btnMark.innerText = "Mastered! Returning to Menu...";
      
      // Update local storage / state mastery records
      QUIZ_DATA.forEach(topic => {
        topic.subtopics.forEach(sub => {
          if (sub.id === subtopicId) {
            const subQuestions = state.allQuestions.filter(q => q.subtopicId === sub.id);
            subQuestions.forEach(q => {
              state.mastery[q.id] = true;
            });
          }
        });
      });
      saveProgress();
      renderSidebarNav();
      updateGlobalStats();

      setTimeout(() => {
        switchView('dashboard');
      }, 1500);
    });
  }

  // Bind Do Now Starter Events
  const doNowCard = container.querySelector('.do-now-card');
  if (doNowCard) {
    const prevLink = doNowCard.querySelector('.do-now-prev-link-btn');
    if (prevLink) {
      prevLink.addEventListener('click', () => {
        AudioEngine.play('click');
        const prevId = prevLink.getAttribute('data-prev-id');
        switchView('subtopic', prevId);
      });
    }

    const revealAnswersBtn = doNowCard.querySelector('.do-now-reveal-btn');
    if (revealAnswersBtn) {
      revealAnswersBtn.addEventListener('click', () => {
        AudioEngine.play('click');
        const drawer = doNowCard.querySelector('.do-now-answers-drawer');
        if (drawer) {
          const isHidden = drawer.style.display === 'none' || !drawer.style.display;
          if (isHidden) {
            drawer.style.display = 'block';
            revealAnswersBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> Hide Do Now Answers`;
          } else {
            drawer.style.display = 'none';
            revealAnswersBtn.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Reveal Do Now Guide Answers`;
          }
        }
      });
    }

    // Bind Do Now source evaluation checkboxes
    const doNowCbs = doNowCard.querySelectorAll('.do-now-cb');
    doNowCbs.forEach(cb => {
      cb.addEventListener('change', () => {
        // Skip default sound for 1.3 since quiz triggers its own sounds
        if (subtopicId !== 'subtopic_1_3') {
          AudioEngine.play('click');
        }
        const allChecked = Array.from(doNowCbs).every(c => c.checked);
        const parentContainer = cb.closest('.do-now-checkboxes').parentElement;
        if (allChecked) {
          AudioEngine.play('success');
          if (parentContainer) {
            parentContainer.style.borderColor = '#10b981';
            parentContainer.style.background = 'rgba(16, 185, 129, 0.08)';
          }
        } else {
          if (parentContainer) {
            parentContainer.style.borderColor = 'rgba(245, 158, 11, 0.2)';
            parentContainer.style.background = 'rgba(245, 158, 11, 0.05)';
          }
        }
      });
    });

    // Subtopic 1.1: Interactive Drafting Assistant
    if (subtopicId === 'subtopic_1_1') {
      const draftingContainer = doNowCard.querySelector('#do-now-drafting-container');
      const wrapC = doNowCard.querySelector('#textarea-wrap-c');
      const wrapNop = doNowCard.querySelector('#textarea-wrap-nop');
      const wrapOk = doNowCard.querySelector('#textarea-wrap-ok');
      const txtC = doNowCard.querySelector('#draft-c');
      const txtNop = doNowCard.querySelector('#draft-nop');
      const txtOk = doNowCard.querySelector('#draft-ok');
      const compileBtn = doNowCard.querySelector('#compile-draft-btn');
      const displayDiv = doNowCard.querySelector('#compiled-draft-display');
      const compiledText = doNowCard.querySelector('#compiled-draft-text');

      const updateDraftingAssistant = () => {
        const anyChecked = Array.from(doNowCbs).some(c => c.checked);
        if (draftingContainer) {
          draftingContainer.style.display = anyChecked ? 'flex' : 'none';
        }
        if (wrapC) wrapC.style.display = doNowCbs[0].checked ? 'block' : 'none';
        if (wrapNop) wrapNop.style.display = doNowCbs[1].checked ? 'block' : 'none';
        if (wrapOk) wrapOk.style.display = doNowCbs[2].checked ? 'block' : 'none';

        const allChecked = Array.from(doNowCbs).every(c => c.checked);
        const hasC = txtC && txtC.value.trim().length > 0;
        const hasNop = txtNop && txtNop.value.trim().length > 0;
        const hasOk = txtOk && txtOk.value.trim().length > 0;

        if (compileBtn) {
          compileBtn.style.display = (allChecked && hasC && hasNop && hasOk) ? 'block' : 'none';
        }
      };

      doNowCbs.forEach(cb => {
        cb.addEventListener('change', updateDraftingAssistant);
      });

      [txtC, txtNop, txtOk].forEach(txt => {
        if (txt) {
          txt.addEventListener('input', updateDraftingAssistant);
        }
      });

      if (compileBtn) {
        compileBtn.addEventListener('click', () => {
          AudioEngine.play('success');
          const valC = txtC ? txtC.value.trim() : '';
          const valNop = txtNop ? txtNop.value.trim() : '';
          const valOk = txtOk ? txtOk.value.trim() : '';
          
          if (compiledText) {
            compiledText.innerHTML = `<strong>Content (C):</strong> ${valC}<br><br><strong>Provenance (NOP):</strong> ${valNop}<br><br><strong>Own Knowledge (OK):</strong> ${valOk}`;
          }
          if (displayDiv) {
            displayDiv.style.display = 'flex';
          }
          if (typeof Confetti !== 'undefined' && typeof Confetti.spawn === 'function') {
            Confetti.spawn(50);
          }
        });
      }
    }

    // Subtopic 1.2: Hotspots & Context Overlays
    if (subtopicId === 'subtopic_1_2') {
      const hotspotsContainer = doNowCard.querySelector('#do-now-hotspots-container');
      const tooltipCard = doNowCard.querySelector('#hotspot-tooltip-card');
      const provBox = doNowCard.querySelector('.do-now-provenance-box');
      const provExplanation = doNowCard.querySelector('#provenance-explanation-card');
      const contextClues = doNowCard.querySelector('#context-clues-card');

      doNowCbs[0].addEventListener('change', () => {
        const isChecked = doNowCbs[0].checked;
        if (hotspotsContainer) hotspotsContainer.style.display = isChecked ? 'block' : 'none';
        if (tooltipCard) {
          tooltipCard.style.display = isChecked ? 'block' : 'none';
          if (!isChecked) {
            const tTitle = doNowCard.querySelector('#hotspot-title');
            const tDesc = doNowCard.querySelector('#hotspot-desc');
            if (tTitle) tTitle.textContent = "Hotspot Detail";
            if (tDesc) tDesc.textContent = "Click a yellow hotspot dot on the image to inspect Content details...";
          }
        }
      });

      const dots = doNowCard.querySelectorAll('.hotspot-dot');
      dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          AudioEngine.play('click');
          const title = dot.getAttribute('data-title');
          const desc = dot.getAttribute('data-desc');
          const tTitle = doNowCard.querySelector('#hotspot-title');
          const tDesc = doNowCard.querySelector('#hotspot-desc');
          if (tTitle) tTitle.textContent = title;
          if (tDesc) tDesc.textContent = desc;
        });
      });

      doNowCbs[1].addEventListener('change', () => {
        const isChecked = doNowCbs[1].checked;
        if (provBox) {
          if (isChecked) {
            provBox.style.animation = 'pulse-border 2s infinite';
            provBox.style.borderWidth = '2px';
          } else {
            provBox.style.animation = 'none';
            provBox.style.borderWidth = '1px';
          }
        }
        if (provExplanation) {
          provExplanation.style.display = isChecked ? 'block' : 'none';
        }
      });

      doNowCbs[2].addEventListener('change', () => {
        const isChecked = doNowCbs[2].checked;
        if (contextClues) {
          contextClues.style.display = isChecked ? 'block' : 'none';
        }
      });
    }

    // Subtopic 1.3: Mini-Challenge Popups
    if (subtopicId === 'subtopic_1_3') {
      const quizOverlay = doNowCard.querySelector('#do-now-quiz-overlay');
      const quizQuestionText = doNowCard.querySelector('#quiz-question-text');
      const quizOptionsContainer = doNowCard.querySelector('#quiz-options-container');

      const quizzes = {
        0: {
          type: 'C',
          question: "What does the protester's sign claim about integration?",
          options: [
            { text: "Integration is a communist plot and is being forced by a dictator", correct: true },
            { text: "Integration is supported by the Southern governors", correct: false },
            { text: "Integration is a democratic reform that will help everyone", correct: false }
          ]
        },
        1: {
          type: 'NOP',
          question: "Why is the timing of this photo (September 1957) highly useful for historians?",
          options: [
            { text: "It captures the peak of white resistance during the Little Rock Nine integration crisis", correct: true },
            { text: "It was taken before Brown v. Board of Education was decided", correct: false },
            { text: "It shows the immediate response to the Civil Rights Act of 1964", correct: false }
          ]
        },
        2: {
          type: 'OK',
          question: "Which historical fact explains why federal troops were deployed to Central High School?",
          options: [
            { text: "Governor Orval Faubus used the state National Guard to block the Black students, forcing Eisenhower to send the 101st Airborne", correct: true },
            { text: "Martin Luther King Jr. requested federal troops to guard the marchers", correct: false },
            { text: "The local school board requested army protection for the school buildings", correct: false }
          ]
        }
      };

      const triggerQuiz = (cb, idx) => {
        const quiz = quizzes[idx];
        if (!quiz) return;

        if (quizQuestionText) {
          quizQuestionText.innerHTML = `<span style="color: var(--accent);">[Challenge ${quiz.type}]</span> ${quiz.question}`;
        }
        if (quizOptionsContainer) {
          quizOptionsContainer.innerHTML = '';
          quiz.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerHTML = opt.text;
            btn.style.width = '100%';
            btn.style.padding = '8px 12px';
            btn.style.background = 'rgba(255, 255, 255, 0.05)';
            btn.style.border = '1px solid var(--border-glass)';
            btn.style.borderRadius = '4px';
            btn.style.color = 'var(--text-base)';
            btn.style.textAlign = 'left';
            btn.style.fontSize = '0.82rem';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'all 0.2s';
            btn.style.marginBottom = '6px';
            
            btn.addEventListener('mouseenter', () => {
              btn.style.background = 'rgba(255, 255, 255, 0.1)';
              btn.style.borderColor = 'var(--accent)';
            });
            btn.addEventListener('mouseleave', () => {
              btn.style.background = 'rgba(255, 255, 255, 0.05)';
              btn.style.borderColor = 'var(--border-glass)';
            });

            btn.addEventListener('click', (e) => {
              e.preventDefault();
              if (opt.correct) {
                AudioEngine.play('success');
                btn.style.background = 'rgba(16, 185, 129, 0.2)';
                btn.style.borderColor = '#10b981';
                btn.style.color = '#10b981';
                
                cb.dataset.unlocked = "true";
                cb.checked = true;
                
                // Dispatch change event to update outer styling
                cb.dispatchEvent(new Event('change'));

                setTimeout(() => {
                  if (quizOverlay) quizOverlay.style.display = 'none';
                }, 800);
              } else {
                AudioEngine.play('error');
                btn.style.background = 'rgba(239, 68, 68, 0.2)';
                btn.style.borderColor = '#ef4444';
                btn.style.color = '#ef4444';
                
                btn.style.transform = 'translateX(5px)';
                setTimeout(() => { btn.style.transform = 'none'; }, 100);
              }
            });
            quizOptionsContainer.appendChild(btn);
          });
        }
        if (quizOverlay) {
          quizOverlay.style.display = 'flex';
        }
      };

      doNowCbs.forEach((cb, idx) => {
        cb.addEventListener('click', (e) => {
          if (cb.dataset.unlocked !== "true") {
            e.preventDefault();
            triggerQuiz(cb, idx);
          }
        });
        cb.addEventListener('change', () => {
          if (!cb.checked) {
            cb.dataset.unlocked = "false";
          }
        });
      });
    }

    // Subtopic 1.4: Examiner's Lens
    if (subtopicId === 'subtopic_1_4') {
      const lensContainer = doNowCard.querySelector('#do-now-lens-container');
      if (lensContainer) {
        lensContainer.style.display = 'flex';
      }
      const lensC = doNowCard.querySelector('.lens-c');
      const lensNop = doNowCard.querySelector('.lens-nop');
      const lensOk = doNowCard.querySelector('.lens-ok');

      const updateLensHighlighting = () => {
        if (lensC) {
          if (doNowCbs[0].checked) {
            lensC.style.background = 'rgba(59, 130, 246, 0.25)';
            lensC.style.color = '#60a5fa';
            lensC.style.fontWeight = 'bold';
          } else {
            lensC.style.background = 'transparent';
            lensC.style.color = 'inherit';
            lensC.style.fontWeight = 'normal';
          }
        }
        if (lensNop) {
          if (doNowCbs[1].checked) {
            lensNop.style.background = 'rgba(168, 85, 247, 0.25)';
            lensNop.style.color = '#c084fc';
            lensNop.style.fontWeight = 'bold';
          } else {
            lensNop.style.background = 'transparent';
            lensNop.style.color = 'inherit';
            lensNop.style.fontWeight = 'normal';
          }
        }
        if (lensOk) {
          if (doNowCbs[2].checked) {
            lensOk.style.background = 'rgba(34, 197, 94, 0.25)';
            lensOk.style.color = '#4ade80';
            lensOk.style.fontWeight = 'bold';
          } else {
            lensOk.style.background = 'transparent';
            lensOk.style.color = 'inherit';
            lensOk.style.fontWeight = 'normal';
          }
        }
      };

      doNowCbs.forEach(cb => {
        cb.addEventListener('change', updateLensHighlighting);
      });
    }
  }

  // Bind Specification Checklist click listeners
  const checklistItems = container.querySelectorAll('.spec-checklist-item');
  checklistItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.spec-checklist-expansion')) {
        return;
      }
      AudioEngine.play('click');
      const key = item.getAttribute('data-key');
      const isChecked = item.classList.contains('checked');
      
      if (isChecked) {
        item.classList.remove('checked');
      } else {
        item.classList.add('checked');
      }

      // Save to localStorage
      try {
        let checkedStates = {};
        const saved = localStorage.getItem('edexcel_spec_checklist');
        if (saved) {
          checkedStates = JSON.parse(saved);
        }
        checkedStates[key] = !isChecked;
        localStorage.setItem('edexcel_spec_checklist', JSON.stringify(checkedStates));
      } catch (e) {
        console.error(e);
      }
    });
  });

  // Formatting vault answers
  formatVaultImportanceAnswers(container);

  // Set up Lesson Wrap-up interactive sorting challenge
  setupWrapUpChallenge(container, subtopicId);

  // Wrap all images in links for high-res inspection
  wrapImagesInLinks(container);
}

function setupWrapUpChallenge(container, subtopicId) {
  const wrapUpCard = container.querySelector('.lesson-wrap-up-card');
  if (!wrapUpCard) return;

  const challenge = WRAPUP_DATA[subtopicId];
  if (!challenge) return;

  const cards = Array.from(wrapUpCard.querySelectorAll('.wrapup-fact-card'));
  const buckets = Array.from(wrapUpCard.querySelectorAll('.wrapup-bucket'));
  const pool = wrapUpCard.querySelector('.wrapup-cards-pool');
  const successDrawer = wrapUpCard.querySelector('.wrapup-success-drawer');
  const explanationsList = wrapUpCard.querySelector('.wrapup-explanations-list');

  let selectedCard = null;
  const placements = {}; // factId -> category name

  const checkVictory = () => {
    let allCorrect = true;
    challenge.facts.forEach(f => {
      if (placements[f.id] !== f.correctCategory) {
        allCorrect = false;
      }
    });

    if (allCorrect && Object.keys(placements).length === challenge.facts.length) {
      AudioEngine.play('cheer');
      if (successDrawer) {
        successDrawer.style.display = 'block';
        if (explanationsList) {
          explanationsList.innerHTML = challenge.facts.map(f => `
            <div style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 4px; margin-bottom: 8px; text-align: left;">
              <strong style="color: var(--success); display: block; margin-bottom: 2px; font-size: 0.82rem;">✓ ${f.correctCategory}:</strong>
              <span style="color: var(--text-base); font-size: 0.82rem; line-height: 1.45;">${f.text}</span>
              <p style="margin: 6px 0 0 0; font-style: italic; color: var(--text-muted); font-size: 0.78rem; border-top: 1px dashed var(--border-glass); padding-top: 4px;">${f.feedback}</p>
            </div>
          `).join('');
        }
        successDrawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (typeof Confetti !== 'undefined' && typeof Confetti.spawn === 'function') {
        Confetti.spawn(50);
      }
    }
  };

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', card.getAttribute('data-fact-id'));
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      AudioEngine.play('click');
      if (selectedCard === card) {
        card.classList.remove('selected');
        selectedCard = null;
      } else {
        if (selectedCard) {
          selectedCard.classList.remove('selected');
        }
        selectedCard = card;
        card.classList.add('selected');
      }
    });
  });

  buckets.forEach(bucket => {
    const slots = bucket.querySelector('.wrapup-bucket-slots');
    const category = bucket.getAttribute('data-category');

    bucket.addEventListener('dragover', (e) => {
      e.preventDefault();
      bucket.classList.add('drag-over');
    });

    bucket.addEventListener('dragleave', () => {
      bucket.classList.remove('drag-over');
    });

    bucket.addEventListener('drop', (e) => {
      e.preventDefault();
      bucket.classList.remove('drag-over');
      const factId = e.dataTransfer.getData('text/plain');
      const card = wrapUpCard.querySelector(`[data-fact-id="${factId}"]`);
      if (card && slots) {
        AudioEngine.play('click');
        slots.appendChild(card);
        placements[factId] = category;
        checkVictory();
      }
    });

    bucket.addEventListener('click', () => {
      if (selectedCard && slots) {
        const factId = selectedCard.getAttribute('data-fact-id');
        slots.appendChild(selectedCard);
        placements[factId] = category;
        selectedCard.classList.remove('selected');
        selectedCard = null;
        checkVictory();
      }
    });
  });

  if (pool) {
    pool.addEventListener('click', () => {
      if (selectedCard) {
        const factId = selectedCard.getAttribute('data-fact-id');
        pool.appendChild(selectedCard);
        placements[factId] = null;
        selectedCard.classList.remove('selected');
        selectedCard = null;
      }
    });

    pool.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    pool.addEventListener('drop', (e) => {
      e.preventDefault();
      const factId = e.dataTransfer.getData('text/plain');
      const card = wrapUpCard.querySelector(`[data-fact-id="${factId}"]`);
      if (card) {
        AudioEngine.play('click');
        pool.appendChild(card);
        placements[factId] = null;
      }
    });
  }
}

function blankFirstWord(block) {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while (node = walker.nextNode()) {
    const parent = node.parentNode;
    if (parent.tagName === 'STRONG' || parent.tagName === 'A' || parent.tagName === 'BUTTON' || parent.tagName === 'H1' || parent.tagName === 'H2' || parent.tagName === 'H3' || parent.tagName === 'H4' || parent.tagName === 'STYLE' || parent.tagName === 'SCRIPT') {
      continue;
    }
    const text = node.nodeValue;
    const yearMatch = text.match(/\b(19\d{2})\b/);
    if (yearMatch) {
      const matchText = yearMatch[1];
      const index = text.indexOf(matchText);
      const beforeText = text.substring(0, index);
      const afterText = text.substring(index + matchText.length);
      const beforeNode = document.createTextNode(beforeText);
      const strongNode = document.createElement('strong');
      strongNode.className = 'hard-mode-blank';
      strongNode.textContent = matchText;
      const afterNode = document.createTextNode(afterText);
      parent.insertBefore(beforeNode, node);
      parent.insertBefore(strongNode, node);
      parent.insertBefore(afterNode, node);
      parent.removeChild(node);
      return true;
    }
  }

  walker.currentNode = block;
  while (node = walker.nextNode()) {
    const parent = node.parentNode;
    if (parent.tagName === 'STRONG' || parent.tagName === 'A' || parent.tagName === 'BUTTON' || parent.tagName === 'H1' || parent.tagName === 'H2' || parent.tagName === 'H3' || parent.tagName === 'H4' || parent.tagName === 'STYLE' || parent.tagName === 'SCRIPT') {
      continue;
    }
    const text = node.nodeValue;
    const regex = /\b([A-Z][A-Za-z0-9\-]+(?:\s+[A-Z][A-Za-z0-9\-]+)*)\b/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const matchText = match[1];
      const matchIndex = match.index;
      const isStart = (matchIndex === 0 && node === block.firstChild);
      const commonStartWords = ['In', 'The', 'Following', 'When', 'To', 'They', 'This', 'Our', 'He', 'She', 'It', 'A', 'An', 'And', 'But', 'For', 'As', 'At', 'By', 'Of', 'On', 'With'];
      if (isStart && commonStartWords.includes(matchText)) {
        continue;
      }
      const beforeText = text.substring(0, matchIndex);
      const afterText = text.substring(matchIndex + matchText.length);
      const beforeNode = document.createTextNode(beforeText);
      const strongNode = document.createElement('strong');
      strongNode.className = 'hard-mode-blank';
      strongNode.textContent = matchText;
      const afterNode = document.createTextNode(afterText);
      parent.insertBefore(beforeNode, node);
      parent.insertBefore(strongNode, node);
      parent.insertBefore(afterNode, node);
      parent.removeChild(node);
      return true;
    }
  }

  walker.currentNode = block;
  while (node = walker.nextNode()) {
    const parent = node.parentNode;
    if (parent.tagName === 'STRONG' || parent.tagName === 'A' || parent.tagName === 'BUTTON' || parent.tagName === 'H1' || parent.tagName === 'H2' || parent.tagName === 'H3' || parent.tagName === 'H4' || parent.tagName === 'STYLE' || parent.tagName === 'SCRIPT') {
      continue;
    }
    const text = node.nodeValue;
    const match = text.match(/\b([a-zA-Z]{6,})\b/);
    if (match) {
      const matchText = match[1];
      const index = text.indexOf(matchText);
      const beforeText = text.substring(0, index);
      const afterText = text.substring(index + matchText.length);
      const beforeNode = document.createTextNode(beforeText);
      const strongNode = document.createElement('strong');
      strongNode.className = 'hard-mode-blank';
      strongNode.textContent = matchText;
      const afterNode = document.createTextNode(afterText);
      parent.insertBefore(beforeNode, node);
      parent.insertBefore(strongNode, node);
      parent.insertBefore(afterNode, node);
      parent.removeChild(node);
      return true;
    }
  }
  return false;
}

export function setupHardModeKeywords(container) {
  const blocks = container.querySelectorAll('.card-content li, .card-content p, .mastery-card-body li, .mastery-card-body p');
  blocks.forEach(block => {
    const strongs = Array.from(block.querySelectorAll('strong'));
    let keywordCount = 0;
    
    strongs.forEach(strong => {
      const text = strong.textContent.trim();
      const nextSibling = strong.nextSibling;
      const nextText = nextSibling && nextSibling.nodeType === 3 ? nextSibling.textContent.trim() : '';
      
      const isBeforeColon = text.endsWith(':') || nextText.startsWith(':');
      
      if (isBeforeColon) {
        strong.classList.remove('hard-mode-blank');
      } else {
        if (keywordCount < 1) {
          strong.classList.add('hard-mode-blank');
          keywordCount++;
        } else {
          strong.classList.remove('hard-mode-blank');
        }
      }
    });

    // If no strong tag was blanked, dynamically find a word in the text nodes to blank out
    if (keywordCount === 0) {
      blankFirstWord(block);
    }
  });
}

export function formatVaultImportanceAnswers(container) {
  const vaultItems = container.querySelectorAll('.vault-item');
  vaultItems.forEach(item => {
    const questionSpan = item.querySelector('.vault-question-btn span');
    if (!questionSpan) return;
    
    const questionText = questionSpan.textContent || '';
    if (questionText.toLowerCase().includes('explain the importance')) {
      const panel = item.querySelector('.vault-answer-panel');
      if (!panel) return;
      
      let html = panel.innerHTML;
      html = html.replace(/<strong>Importance Analysis:<\/strong>/i, '').trim();
      html = html.replace(/Importance Analysis:/i, '').trim();
      
      const sentences = html.replace(/([\.\?])\s+(?=[A-Z])/g, '$1|').split('|');
      if (sentences.length >= 2) {
        const reason1 = sentences[0];
        const reason2 = sentences.slice(1).join(' ');
        
        panel.innerHTML = `
          <div class="model-answer-split">
            <p style="margin: 0 0 10px 0; line-height: 1.45;"><strong>Reason 1:</strong> ${reason1}</p>
            <p style="margin: 0; line-height: 1.45;"><strong>Reason 2:</strong> ${reason2}</p>
          </div>
        `;
      }
    }
  });
}

function wrapImagesInLinks(container) {
  if (!container) return;
  container.querySelectorAll('img').forEach(img => {
    // Exclude layout helper elements, specific keys, small icons
    if (img.closest('.model-answer-key') || img.closest('.objective-checkbox') || img.classList.contains('model-key-dot') || img.style.width === '16px') return;
    
    // Check if already wrapped in anchor
    if (img.parentElement.tagName !== 'A') {
      const webUrl = getImageWebLink(img.getAttribute('src'), img.getAttribute('alt'));
      const link = document.createElement('a');
      link.href = webUrl;
      link.target = '_blank';
      link.style.display = 'block';
      link.style.cursor = 'zoom-in';
      link.className = 'img-zoom-link';
      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
    }
  });
}

function initializeLeafletMap(subtopicId, mapConfig) {
  const mapContainer = document.getElementById(`leaflet-map-${subtopicId}`);
  if (!mapContainer) return;
  
  if (mapContainer._leaflet_id) {
    return; // Already initialized
  }
  
  const isUsa = mapConfig.type === 'usa';
  const pointsDb = isUsa ? {
    "topeka": { name: "Topeka, KS", coords: [39.0473, -95.6752] },
    "oakland": { name: "Oakland, CA", coords: [37.8044, -122.2712] },
    "losangeles": { name: "Los Angeles, CA", coords: [34.0522, -118.2437] },
    "chicago": { name: "Chicago, IL", coords: [41.8781, -87.6298] },
    "detroit": { name: "Detroit, MI", coords: [42.3314, -83.0458] },
    "memphis": { name: "Memphis, TN", coords: [35.1495, -90.0490] },
    "littlerock": { name: "Little Rock, AR", coords: [34.7465, -92.2896] },
    "oxford": { name: "Oxford, MS (Ole Miss)", coords: [34.3662, -89.5380] },
    "jackson": { name: "Jackson, MS", coords: [32.2988, -90.1848] },
    "birmingham": { name: "Birmingham, AL", coords: [33.5186, -86.8104] },
    "anniston": { name: "Anniston, AL", coords: [33.6598, -85.8316] },
    "selma": { name: "Selma, AL", coords: [32.4074, -87.0211] },
    "montgomery": { name: "Montgomery, AL", coords: [32.3668, -86.3000] },
    "washington": { name: "Washington D.C.", coords: [38.9072, -77.0369] },
    "greensboro": { name: "Greensboro, NC", coords: [36.0726, -79.7920] },
    "newyork": { name: "New York City, NY", coords: [40.7128, -74.0060] }
  } : {
    "hanoi": { name: "Hanoi", coords: [21.0285, 105.8542] },
    "tonkin": { name: "Gulf of Tonkin", coords: [19.5000, 107.5000] },
    "parallel17": { name: "17th Parallel DMZ", coords: [17.0000, 107.0000] },
    "khesanh": { name: "Khe Sanh", coords: [16.6341, 106.7262] },
    "hue": { name: "Hue", coords: [16.4637, 107.5908] },
    "danang": { name: "Da Nang", coords: [16.0544, 108.2022] },
    "saigon": { name: "Saigon", coords: [10.8231, 106.6297] },
    "laos": { name: "Laos (Trail)", coords: [16.7000, 106.2000] },
    "cambodia": { name: "Cambodia (Sanctuaries)", coords: [12.0000, 104.5000] }
  };

  // Determine initial center and zoom
  let center = isUsa ? [37.8, -96.0] : [16.0, 106.0];
  let zoom = isUsa ? 4 : 5;
  
  if (subtopicId === "subtopic_1_2") {
    center = [34.7465, -92.2896];
    zoom = 6;
  } else if (subtopicId === "subtopic_1_3") {
    center = [32.3668, -86.3000];
    zoom = 7;
  }
  
  const map = window.L.map(mapContainer, {
    center: center,
    zoom: zoom,
    zoomControl: true,
    attributionControl: false
  });
  
  window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18
  }).addTo(map);
  
  const createMarkerIcon = (isActive) => {
    const size = isActive ? 14 : 9;
    const color = isActive ? 'var(--primary)' : '#475569';
    const borderColor = isActive ? '#fff' : 'rgba(255,255,255,0.4)';
    const shadow = isActive ? 'box-shadow: 0 0 8px var(--primary);' : '';
    const pulseHtml = isActive ? `<div class="hotspot-pulse" style="width: 14px; height: 14px; border: 2px solid var(--primary); border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: hotspot-ping 2s infinite ease-in-out; pointer-events: none;"></div>` : '';
    
    return window.L.divIcon({
      html: `
        <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
          ${pulseHtml}
          <div style="width: ${size}px; height: ${size}px; border-radius: 50%; background: ${color}; border: 2px solid ${borderColor}; ${shadow}"></div>
        </div>
      `,
      className: 'custom-leaflet-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  const significanceBox = document.getElementById(`map-significance-${subtopicId}`);
  
  for (const pid in pointsDb) {
    const pt = pointsDb[pid];
    const isHighlighted = mapConfig.highlightedPoints.includes(pid);
    const sigObj = mapConfig.points && mapConfig.points[pid];
    const significanceText = sigObj ? sigObj.text : pt.name;
    const cleanName = sigObj ? sigObj.title : pt.name;
    
    const icon = createMarkerIcon(isHighlighted);
    const marker = window.L.marker(pt.coords, { icon: icon }).addTo(map);
    
    marker.bindTooltip(cleanName, {
      permanent: isHighlighted,
      direction: 'top',
      offset: [0, -10],
      className: isHighlighted ? 'leaflet-tooltip-active' : 'leaflet-tooltip-inactive'
    });
    
    marker.on('click', () => {
      AudioEngine.play('click');
      if (significanceBox) {
        significanceBox.style.borderColor = 'var(--accent)';
        significanceBox.style.background = 'rgba(249, 115, 22, 0.05)';
        significanceBox.innerHTML = `<strong>📍 ${cleanName}:</strong> ${applyGlossaryTooltips(significanceText)}`;
      }
      map.panTo(pt.coords);
    });
  }
  
  if (mapConfig.drawRoute && mapConfig.drawRoute.length > 0) {
    const routeCoords = mapConfig.drawRoute.map(pid => {
      const pt = pointsDb[pid];
      return pt ? pt.coords : null;
    }).filter(c => c !== null);
    
    const isTrail = mapConfig.drawRoute.includes('laos') && mapConfig.drawRoute.includes('cambodia');
    const color = isTrail ? 'var(--accent)' : 'var(--primary)';
    
    window.L.polyline(routeCoords, {
      color: color,
      weight: 3,
      dashArray: '5, 5',
      opacity: 0.85
    }).addTo(map);
  }
  
  if (!isUsa) {
    window.L.polyline([[17.0, 104.5], [17.0, 108.5]], {
      color: 'var(--accent)',
      weight: 2,
      dashArray: '3, 6',
      opacity: 0.7
    }).addTo(map);
  }
}