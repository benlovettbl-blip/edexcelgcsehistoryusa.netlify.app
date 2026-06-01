import { LESSONS_DATA } from './lessons_data.js';
import { state } from './state.js';
import { switchView } from './navigation.js';
import { renderSidebarNav, updateGlobalStats } from './views.js';
import { saveProgress } from './storage.js';
import { AudioEngine } from './audio.js';
import { Confetti } from './confetti.js';
import { QUIZ_DATA } from '../questions.js';
import { highlightModelQuotes } from './layout.js';
import { SPOT_THE_FLAW_DATA } from './spot_the_flaw_data.js';
import { VIDEOS_DATA } from './videos_data.js';
import { HOMEWORK_QUESTIONS } from './homework_data.js';

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

function applyGlossaryTooltips(text) {
  if (!text) return '';
  let parsedText = text;
  
  const sortedTerms = Object.keys(GLOSSARY_DB).sort((a, b) => b.length - a.length);
  
  for (const term of sortedTerms) {
    const definition = GLOSSARY_DB[term].replace(/"/g, '&quot;');
    const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(<[^>]*>)|\\b(${escapedTerm})(s|d|ly|dness)?\\b`, 'gi');
    
    parsedText = parsedText.replace(regex, (match, isTag, word, suffix) => {
      if (isTag) return match;
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

export function renderMasteryView(subtopicId) {
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
            <i class="fa-solid fa-graduation-cap"></i> Scholarly Perspective (Expand for Depth)
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
    let disagreeSourceCard = '';
    
    // Choose appropriate historiographical debate label based on subtopic ID
    if (subtopicId.startsWith('subtopic_1') || subtopicId.startsWith('subtopic_2')) {
      historiographicalSubtitle = `
        <div style="margin-top: 6px; display: flex; gap: 8px; flex-wrap: wrap;">
          <span class="historiographical-label top-down">Top-Down Legalistic</span>
          <span class="historiographical-label bottom-up">Bottom-Up Grassroots</span>
        </div>
      `;
      disagreeSourceCard = `
        <div class="disagree-analysis-card">
          <div class="disagree-analysis-title">
            <i class="fa-solid fa-code-branch"></i> Why Historians Disagree: Source Selection Analysis
          </div>
          <div class="disagree-analysis-body">
            <p style="margin-bottom: 8px;">Historians of the Civil Rights era reach conflicting interpretations because they select and prioritize different primary sources:</p>
            <ul style="margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 8px;">
              <li>
                <strong>Presidential Papers & court rulings (Top-Down):</strong> Historians prioritizing Eisenhower's transcripts or Supreme Court decrees conclude that change was driven by constitutional authority and institutional reforms.
              </li>
              <li>
                <strong>Oral Histories & Local records (Bottom-Up):</strong> Historians prioritizing SNCC field reports, church diaries, or Rosa Parks' notes conclude that the federal government only acted when forced by grassroots mobilization and disruption.
              </li>
            </ul>
          </div>
        </div>
      `;
    } else {
      historiographicalSubtitle = `
        <div style="margin-top: 6px; display: flex; gap: 8px; flex-wrap: wrap;">
          <span class="historiographical-label orthodox">Orthodox Interpretation</span>
          <span class="historiographical-label revisionist">Revisionist Interpretation</span>
        </div>
      `;
      disagreeSourceCard = `
        <div class="disagree-analysis-card">
          <div class="disagree-analysis-title">
            <i class="fa-solid fa-code-branch"></i> Why Historians Disagree: Source Selection Analysis
          </div>
          <div class="disagree-analysis-body">
            <p style="margin-bottom: 8px;">Historians of the Vietnam War period disagree due to their methodological frameworks and source preferences:</p>
            <ul style="margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 8px;">
              <li>
                <strong>Orthodox Historians (National Security Archives):</strong> Prioritizing Pentagon planning files and US military reports, they conclude the war was an inevitable tragedy of Cold War containment policy and military overreach.
              </li>
              <li>
                <strong>Revisionist/Vietnamese Sources (Local Accounts):</strong> Prioritizing translated NLF/PAVN diaries, local guerrilla interviews, and rural intelligence reports, they argue the US failed primarily because it ignored the nationalist, anti-colonial nature of the Vietnamese struggle.
              </li>
            </ul>
          </div>
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
      ${disagreeSourceCard}
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
      <div class="causal-connector-container" style="max-width: 800px; margin: 0 auto 24px auto;">
        <h3 class="causal-title"><i class="fa-solid fa-link" style="color: var(--primary);"></i> Causal Link Builder</h3>
        <p class="chain-instruction" style="margin-bottom: 12px; font-size: 0.85rem; color: var(--text-muted);">Paper 3 essays require linking factors to their historical effects. Match each causal factor to its correct analytical consequence link!</p>
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
    `;
  }

  // Generate Knowledge Check HTML
  let kcQuestionsHtml = '';
  data.knowledgeCheck.forEach((q, index) => {
    kcQuestionsHtml += `
      <div class="quiz-question-item">
        <div class="quiz-question-text">${index + 1}. ${q.question}</div>
        <div class="quiz-answer-text" id="ans-${index + 1}">Answer: ${q.answer}</div>
      </div>
    `;
  });

  let kcHtml = '';
  if (data.knowledgeCheck.length > 0) {
    kcHtml = `
      <div class="mastery-card" id="mastery-quiz-card" style="max-width: 800px; margin: 0 auto 24px auto;">
        <h3 class="mastery-card-title">Knowledge Check</h3>
        <div class="mastery-card-body">
          <p style="font-style: italic; margin-top: 0; margin-bottom: 20px; color: var(--text-muted);">
            Test your memory on the exact facts examiners are looking for!
          </p>
          
          <div class="quiz-questions-list">
            ${kcQuestionsHtml}
          </div>
        </div>
      </div>
    `;
  }

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

  // Generate Deep Thinking HTML
  let deepThinkingHtml = '';
  if (data.deepThinkingQuestions && data.deepThinkingQuestions.length > 0) {
    let dtQuestionsMarkup = '';
    data.deepThinkingQuestions.forEach((q, idx) => {
      const savedVal = state.deepThinkingAnswers[q.id] || '';
      dtQuestionsMarkup += `
        <div class="deep-thinking-question-card" style="margin-bottom: 24px; padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <strong style="color: var(--accent); font-size: 0.95rem;">Question ${idx + 1}: ${q.question}</strong>
            <span class="dt-save-status" id="dt-save-status-${q.id}" style="font-size: 0.7rem; color: var(--success); opacity: 0.8; display: ${savedVal ? 'inline' : 'none'};"><i class="fa-solid fa-cloud-arrow-up"></i> Draft Saved</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; font-style: italic;">
            <i class="fa-solid fa-lightbulb" style="color: var(--primary);"></i> Hint: ${q.hint}
          </div>
          <textarea class="deep-thinking-textarea" data-q-id="${q.id}" placeholder="Type your reflection here to develop your historical analysis..." style="width: 100%; height: 100px; padding: 10px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); color: var(--text-base); font-size: 0.9rem; resize: vertical; margin-bottom: 12px; line-height: 1.45; font-family: inherit;">${savedVal}</textarea>
          <div class="dt-guide-section" style="margin-top: 10px;">
            <button class="mastery-btn dt-guide-btn" data-q-id="${q.id}" style="max-width: fit-content; padding: 8px 16px; font-size: 0.85rem; border-radius: 20px; background: rgba(255, 255, 255, 0.05); color: var(--text-base); border: 1px solid var(--border-glass); font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-graduation-cap"></i> Reveal Teacher Evaluation Guide
            </button>
            <div class="dt-guide-content" id="dt-guide-content-${q.id}" style="display: none; margin-top: 12px; padding: 12px; background: rgba(234, 179, 8, 0.05); border-left: 4px solid var(--warning); border-radius: var(--border-radius-sm); font-size: 0.88rem; line-height: 1.45; color: var(--text-muted);">
              <strong style="color: var(--warning); display: block; margin-bottom: 4px;">Self-Evaluation Criteria:</strong>
              ${q.teacherGuide}
            </div>
          </div>
        </div>
      `;
    });

    deepThinkingHtml = `
      <div class="mastery-card deep-thinking-card" style="max-width: 800px; margin: 0 auto 24px auto;">
        <h3 class="mastery-card-title"><i class="fa-solid fa-brain" style="color: var(--accent);"></i> Deep Reflection & Pedagogy Prompts</h3>
        <div class="mastery-card-body">
          <p style="font-style: italic; margin-top: 0; margin-bottom: 20px; color: var(--text-muted);">
            GCSE top marks require deep thinking. Formulate your answers to these conceptual prompts, then check them against the teacher response guides.
          </p>
          ${dtQuestionsMarkup}
        </div>
      </div>
    `;
  }

  let doNowHtml = '';
  if (data.doNowStarter) {
    const dn = data.doNowStarter;
    let prevLessonLinkHtml = '';
    if (dn.prevSubtopicId && dn.prevSubtopicTitle) {
      prevLessonLinkHtml = `
        <div style="margin-bottom: 14px; font-size: 0.88rem;">
          <i class="fa-solid fa-arrow-left" style="color: var(--primary);"></i> 
          Prior Topic Retrieval: 
          <button class="do-now-prev-link-btn" data-prev-id="${dn.prevSubtopicId}" style="background: none; border: none; color: var(--primary); font-weight: 700; text-decoration: underline; cursor: pointer; padding: 0; font-size: 0.88rem;">
            ${dn.prevSubtopicTitle}
          </button>
        </div>
      `;
    } else {
      prevLessonLinkHtml = `
        <div style="margin-bottom: 14px; font-size: 0.88rem; color: var(--accent); font-weight: 700;">
          <i class="fa-solid fa-star"></i> Course Introduction Retrieval
        </div>
      `;
    }

    const keywordsHtml = dn.keywords.map(kw => `
      <span class="do-now-keyword" style="display: inline-block; padding: 4px 10px; font-size: 0.72rem; font-weight: 600; border-radius: 12px; background: rgba(59, 130, 246, 0.08); border: 1px solid var(--border-glass); color: var(--primary); margin-right: 6px; margin-bottom: 6px;">
        ${kw}
      </span>
    `).join('');

    // Spot the Flaw HTML preparation
    let spotTheFlawHtml = '';
    const flawData = SPOT_THE_FLAW_DATA[subtopicId];
    if (flawData) {
      spotTheFlawHtml = `
        <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; border-bottom: 1px solid var(--border-glass); padding-bottom: 4px; display: flex; align-items: center; gap: 4px;">
          <span>🔍 Spot the Flaw: 12-Mark Plan</span>
        </div>
        <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-main); line-height: 1.25; margin-top: 2px;">
          <strong>Exam Q:</strong> ${flawData.exam_question}
        </div>
        <p style="font-size: 0.68rem; color: var(--text-muted); margin: 0; font-style: italic; line-height: 1.2;">
          Find the paragraph reason that is chronologically or historically flawed:
        </p>
        <div class="flaw-options-list" style="display: flex; flex-direction: column; gap: 4px; padding-right: 2px; margin-top: 2px;">
          ${flawData.options.map(opt => `
            <button class="flaw-option-btn" data-letter="${opt.letter}" data-correct="${opt.is_correct_flaw}" style="display: flex; align-items: flex-start; text-align: left; gap: 6px; width: 100%; padding: 4px 6px; font-size: 0.72rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-glass); background: rgba(255, 255, 255, 0.02); color: var(--text-main); cursor: pointer; font-family: inherit; line-height: 1.2; transition: all 0.2s;">
              <strong style="color: var(--primary);">${opt.letter}:</strong>
              <span>${opt.text}</span>
            </button>
          `).join('')}
        </div>
        <div class="flaw-feedback-box" style="display: none; font-size: 0.7rem; line-height: 1.3; padding: 4px 8px; border-radius: var(--border-radius-sm); font-weight: 600; margin-top: 2px;">
        </div>
      `;
    }

    doNowHtml = `
      <div class="mastery-card do-now-card" style="max-width: 800px; margin: 18px auto 24px auto; border-top: 4px solid var(--accent); position: relative; padding: 24px; overflow: visible !important;">
        <div style="position: absolute; top: -12px; left: 16px; background: var(--accent); color: #000; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; padding: 3px 10px; border-radius: 12px; letter-spacing: 0.8px; box-shadow: var(--shadow-sm); z-index: 10;">
          ⚡ DO NOW starter (5-10 MINS)
        </div>
        
        <div class="mastery-card-body" style="padding-top: 8px; margin: 0;">
          ${prevLessonLinkHtml}
          
          <div class="do-now-split-container" style="display: flex; gap: 24px; flex-wrap: wrap;">
            
            <!-- Left Side: Visual Source & See-Think-Wonder & Keyword Bank -->
            <div class="do-now-left-col" style="flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 12px;">
              <div>
                <div style="background: #000; border-radius: var(--border-radius-sm); overflow: hidden; padding: 8px; border: 1px solid var(--border-glass); text-align: center;">
                  <img src="${dn.image}" alt="Starter Image" style="max-width: 100%; max-height: 170px; object-fit: contain; border-radius: var(--border-radius-sm);">
                  <div class="do-now-provenance-box" style="font-size: 0.72rem; color: #f8fafc; font-weight: 500; font-style: normal; margin-top: 8px; text-align: left; background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); padding: 8px 10px; border-radius: var(--border-radius-sm); line-height: 1.4;">
                    <strong style="color: #cbd5e1;">Source Provenance:</strong> ${dn.provenance}
                  </div>
                </div>
                
                <!-- See Think Wonder Prompt Box -->
                <div style="background: rgba(245, 158, 11, 0.04); border: 1px dashed rgba(245, 158, 11, 0.2); padding: 10px; border-radius: var(--border-radius-sm); font-size: 0.78rem; line-height: 1.35; margin-top: 10px;">
                  <strong style="color: var(--accent); display: block; margin-bottom: 4px; font-size: 0.8rem;"><i class="fa-solid fa-lightbulb"></i> Inference: See, Think, Wonder</strong>
                  <ul style="margin: 0; padding-left: 14px; color: var(--text-muted); display: flex; flex-direction: column; gap: 2px;">
                    <li><strong>See:</strong> ${dn.seeThinkWonder.see}</li>
                    <li><strong>Think:</strong> ${dn.seeThinkWonder.think}</li>
                    <li><strong>Wonder:</strong> ${dn.seeThinkWonder.wonder}</li>
                  </ul>
                </div>
              </div>

              <!-- Keyword Bank -->
              <div style="margin-top: 10px; border-top: 1px solid var(--border-glass); padding-top: 10px;">
                <strong style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 6px;">🔑 Retrieval Keyword Bank:</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${keywordsHtml}
                </div>
              </div>
            </div>
            
            <!-- Right Side: Three-Tiered Cognitive Challenge & Spot the Flaw -->
            <div class="do-now-right-col" style="flex: 1.2; min-width: 300px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; border-bottom: 1px solid var(--border-glass); padding-bottom: 4px; margin-bottom: 2px;">
                  Three-Tiered Challenge
                </div>
                
                <!-- Bronze Recall -->
                <div style="position: relative; padding-left: 32px;">
                  <div style="position: absolute; top: 0; left: 0; width: 22px; height: 22px; border-radius: 50%; background: #cd7f32; color: #000; font-weight: 800; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">🥉</div>
                  <strong style="color: #d97706; font-size: 0.8rem; display: block; margin-bottom: 1px;">Bronze Challenge (Recall - Last Lesson)</strong>
                  <p style="margin: 0; font-size: 0.82rem; line-height: 1.35; color: var(--text-base);">${dn.bronze}</p>
                </div>
                
                <!-- Silver Analyze -->
                <div style="position: relative; padding-left: 32px;">
                  <div style="position: absolute; top: 0; left: 0; width: 22px; height: 22px; border-radius: 50%; background: #c0c0c0; color: #000; font-weight: 800; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">🥈</div>
                  <strong style="color: #94a3b8; font-size: 0.8rem; display: block; margin-bottom: 1px;">Silver Challenge (Analyze - Source Inference)</strong>
                  <p style="margin: 0; font-size: 0.82rem; line-height: 1.35; color: var(--text-base);">${dn.silver}</p>
                </div>
                
                <!-- Gold Evaluate -->
                <div style="position: relative; padding-left: 32px;">
                  <div style="position: absolute; top: 0; left: 0; width: 22px; height: 22px; border-radius: 50%; background: #ffd700; color: #000; font-weight: 800; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">🥇</div>
                  <strong style="color: #fbbf24; font-size: 0.8rem; display: block; margin-bottom: 1px;">Gold Challenge (Evaluate - Synoptic Link)</strong>
                  <p style="margin: 0; font-size: 0.82rem; line-height: 1.35; color: var(--text-base);">${dn.gold}</p>
                </div>
              </div>

              <!-- Spot the Flaw: Placed directly underneath the Gold Challenge box -->
              <div id="spot-the-flaw-widget" style="margin-top: 10px; border-top: 1px solid var(--border-glass); padding-top: 10px; display: flex; flex-direction: column; gap: 6px;">
                ${spotTheFlawHtml}
              </div>
            </div>
            
          </div>
          
          <!-- Bottom Section: Reveal Do Now Answers Button Row -->
          <div style="margin-top: 16px; border-top: 1px solid var(--border-glass); padding-top: 16px;">
            <button class="mastery-btn do-now-reveal-btn" style="background: rgba(245, 158, 11, 0.1); border: 1px solid var(--accent); color: var(--accent); font-weight: bold; font-size: 0.82rem; padding: 8px 16px; border-radius: 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-graduation-cap"></i> Reveal Do Now Guide Answers
            </button>
            
            <!-- Hidden structured responses drawer -->
            <div class="do-now-answers-drawer" style="display: none; margin-top: 16px; padding: 16px; background: rgba(34, 197, 94, 0.04); border-left: 4px solid var(--success); border-radius: var(--border-radius-sm); border-top: 1px solid var(--border-glass); border-right: 1px solid var(--border-glass); border-bottom: 1px solid var(--border-glass);">
              <h4 style="margin: 0 0 12px 0; color: var(--success); font-size: 0.95rem; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-circle-check"></i> Starter Evaluation Guide:</h4>
              <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.88rem; line-height: 1.45;">
                <div>
                  <strong style="color: #d97706; display: block; font-size: 0.82rem;">🥉 Bronze Answer Recall:</strong>
                  <p style="margin: 4px 0 0 0; color: var(--text-muted);">${dn.bronzeAnswer}</p>
                </div>
                <div>
                  <strong style="color: #94a3b8; display: block; font-size: 0.82rem;">🥈 Silver Answer Analysis:</strong>
                  <p style="margin: 4px 0 0 0; color: var(--text-muted);">${dn.silverAnswer}</p>
                </div>
                <div>
                  <strong style="color: #fbbf24; display: block; font-size: 0.82rem;">🥇 Gold Answer Evaluation:</strong>
                  <p style="margin: 4px 0 0 0; color: var(--text-muted);">${dn.goldAnswer}</p>
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

  let hwHtml = '';
  const hwQuestions = HOMEWORK_QUESTIONS[subtopicId];
  if (hwQuestions && hwQuestions.length > 0) {
    const questionsListMarkup = hwQuestions.map(q => `
      <li style="margin-bottom: 12px; padding-left: 4px; border-bottom: 1px dashed rgba(255,255,255,0.03); padding-bottom: 12px;">
        ${applyGlossaryTooltips(q)}
      </li>
    `).join('');
    
    hwHtml = `
      <div class="mastery-card homework-questions-card" style="max-width: 800px; margin: 0 auto 24px auto; border-left: 4px solid var(--primary); background: rgba(0, 0, 0, 0.15);">
        <h3 class="mastery-card-title"><i class="fa-solid fa-file-pen" style="color: var(--primary);"></i> Classwork & Homework Questions</h3>
        <div class="mastery-card-body" style="padding-top: 6px;">
          <p style="font-style: italic; margin-top: 0; margin-bottom: 16px; color: var(--text-muted); font-size: 0.85rem;">
            Answer the following questions in class or for homework to test your understanding of this topic:
          </p>
          <ol style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 4px; line-height: 1.45; font-size: 0.95rem; color: var(--text-main);">
            ${questionsListMarkup}
          </ol>
        </div>
      </div>
    `;
  }

  let learningObjectivesHtml = '';
  if (data.specPoints && data.specPoints.length > 0) {
    const listItems = data.specPoints.map((point, index) => {
      const objId = `spec_obj_${subtopicId}_${index}`;
      const isChecked = !!(state.specObjectives && state.specObjectives[objId]);
      const textStyle = isChecked ? 'text-decoration: line-through; color: var(--text-muted);' : 'color: var(--text-base);';
      return `
        <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.92rem; line-height: 1.45; border-bottom: 1px dashed rgba(255,255,255,0.03); padding-bottom: 8px;">
          <input type="checkbox" class="objective-checkbox" data-objective-id="${objId}" style="margin-top: 3px; cursor: pointer; width: 16px; height: 16px;" ${isChecked ? 'checked' : ''}>
          <span class="objective-text" style="${textStyle} cursor: pointer;">${applyGlossaryTooltips(point)}</span>
        </li>
      `;
    }).join('');

    learningObjectivesHtml = `
      <div class="mastery-card learning-objectives-card" style="max-width: 800px; margin: 0 auto 24px auto; border-left: 4px solid var(--success); background: rgba(34, 197, 94, 0.02);">
        <h3 class="mastery-card-title" style="border-bottom: 1px solid var(--border-glass); padding-bottom: 8px; font-size: 1rem; color: var(--success); display: flex; align-items: center; gap: 8px; margin: 0 0 12px 0;">
          <i class="fa-solid fa-circle-check"></i> What will you master today?
        </h3>
        <div class="mastery-card-body" style="padding-top: 4px;">
          <ul class="learning-objectives-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
            ${listItems}
          </ul>
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
      <p class="mastery-header-intro" style="margin-bottom: ${videoHtml ? '16px' : '0'};">
        ${applyGlossaryTooltips(data.headerIntro)}
      </p>
      ${videoHtml}
    </div>

    ${learningObjectivesHtml}

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
    
    ${kcHtml}
    
    ${summaryCorrectionHtml}
    
    ${causalHtml}
    
    ${impHtml}
    
    ${vaultHtml}
    
    ${howUsefulHtml}
    
    ${deepThinkingHtml}
    
    ${hwHtml}

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

  // Individual quiz question click to toggle answer reveal
  const questionsList = container.querySelector('.quiz-questions-list');
  if (questionsList) {
    questionsList.addEventListener('click', (e) => {
      const item = e.target.closest('.quiz-question-item');
      if (item) {
        AudioEngine.play('click');
        item.classList.toggle('revealed');
      }
    });
  }

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
    }
  }

  // Deep Thinking Prompts Event Listeners
  if (data.deepThinkingQuestions && data.deepThinkingQuestions.length > 0) {
    const dtCard = container.querySelector('.deep-thinking-card');
    if (dtCard) {
      // Auto-save input
      const textareas = dtCard.querySelectorAll('.deep-thinking-textarea');
      textareas.forEach(textarea => {
        const qId = textarea.getAttribute('data-q-id');
        const saveStatus = document.getElementById(`dt-save-status-${qId}`);
        
        // Debounce saving slightly
        let saveTimeout;
        textarea.addEventListener('input', () => {
          if (saveTimeout) clearTimeout(saveTimeout);
          
          if (saveStatus) {
            saveStatus.style.display = 'inline';
            saveStatus.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...`;
            saveStatus.style.color = 'var(--text-muted)';
          }

          saveTimeout = setTimeout(() => {
            state.deepThinkingAnswers[qId] = textarea.value;
            saveProgress();
            if (saveStatus) {
              saveStatus.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Draft Saved`;
              saveStatus.style.color = 'var(--success)';
            }
          }, 800);
        });
      });

      // Reveal Teacher Guide
      const guideBtns = dtCard.querySelectorAll('.dt-guide-btn');
      guideBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          AudioEngine.play('click');
          const qId = btn.getAttribute('data-q-id');
          const guideContent = document.getElementById(`dt-guide-content-${qId}`);
          if (guideContent) {
            const isHidden = guideContent.style.display === 'none';
            if (isHidden) {
              guideContent.style.display = 'block';
              btn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> Hide Evaluation Guide`;
              guideContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
              guideContent.style.display = 'none';
              btn.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Reveal Teacher Evaluation Guide`;
            }
          }
        });
      });
    }
  }

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

    // Bind Spot the Flaw Option Click Listeners
    const flawWidget = doNowCard.querySelector('#spot-the-flaw-widget');
    if (flawWidget) {
      const optionBtns = flawWidget.querySelectorAll('.flaw-option-btn');
      const feedbackBox = flawWidget.querySelector('.flaw-feedback-box');
      
      optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const isCorrect = btn.getAttribute('data-correct') === 'true';
          const letter = btn.getAttribute('data-letter');
          
          if (isCorrect) {
            AudioEngine.play('success');
            
            // Highlight the correct flaw in green
            btn.style.background = 'rgba(16, 185, 129, 0.15)';
            btn.style.borderColor = 'var(--success)';
            btn.style.fontWeight = '700';
            
            // Disable all buttons
            optionBtns.forEach(b => {
              b.disabled = true;
              b.style.cursor = 'default';
              if (b !== btn) {
                b.style.opacity = '0.5';
              }
            });
            
            // Show success feedback
            feedbackBox.style.display = 'block';
            feedbackBox.style.background = 'rgba(16, 185, 129, 0.1)';
            feedbackBox.style.color = 'var(--success)';
            feedbackBox.style.borderLeft = '3px solid var(--success)';
            feedbackBox.textContent = flawData.feedback;
            
            // Spawn Confetti if available
            if (typeof Confetti !== 'undefined' && typeof Confetti.spawn === 'function') {
              Confetti.spawn(40);
            }
          } else {
            AudioEngine.play('fail');
            
            // Highlight the incorrect guess in red
            btn.style.background = 'rgba(239, 68, 68, 0.15)';
            btn.style.borderColor = 'var(--accent)';
            
            // Show failure feedback
            feedbackBox.style.display = 'block';
            feedbackBox.style.background = 'rgba(239, 68, 68, 0.1)';
            feedbackBox.style.color = 'var(--accent)';
            feedbackBox.style.borderLeft = '3px solid var(--accent)';
            feedbackBox.textContent = `Incorrect. Option ${letter} is historically accurate, structurally sound, and highly valid. Try again!`;
          }
        });
      });
    }
  }

  // Bind Learning Objectives Checkboxes
  const objectiveCheckboxes = container.querySelectorAll('.objective-checkbox');
  objectiveCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const objId = cb.getAttribute('data-objective-id');
      const isChecked = cb.checked;
      
      // Update state
      if (!state.specObjectives) state.specObjectives = {};
      state.specObjectives[objId] = isChecked;
      
      // Save progress
      saveProgress();
      
      // Visual feedback: toggle line-through on sibling text span
      const textSpan = cb.nextElementSibling;
      if (textSpan) {
        if (isChecked) {
          textSpan.style.textDecoration = 'line-through';
          textSpan.style.color = 'var(--text-muted)';
        } else {
          textSpan.style.textDecoration = 'none';
          textSpan.style.color = 'var(--text-base)';
        }
      }
      
      // Play sound
      AudioEngine.play('click');
    });
  });

  const objectiveTexts = container.querySelectorAll('.objective-text');
  objectiveTexts.forEach(txt => {
    txt.addEventListener('click', (e) => {
      const cb = txt.previousElementSibling;
      if (cb && cb.type === 'checkbox') {
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
      }
    });
  });

  // Formatting vault answers
  formatVaultImportanceAnswers(container);
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