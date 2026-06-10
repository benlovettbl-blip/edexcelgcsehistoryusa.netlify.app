import { LESSONS_DATA } from './lessons_data.js';
import { state } from './state.js';
import { switchView } from './navigation.js';
import { renderSidebarNav, updateGlobalStats, openVideoModal, addXp } from './views.js';
import { saveProgress } from './storage.js';
import { downloadHtmlAsWord } from './past_papers.js';
import { WORKBOOK_DATA } from './workbook_data.js';
import { PEEL_DATA } from './peel_data.js';
import { CORE_QUESTIONS_DATA } from './core_questions_data.js';

const viewedSlides = new Set();
let activeWorkbookSubtopicId = null;
let workbookDataModule = null;
import { AudioEngine } from './audio.js';
import { Confetti } from './confetti.js';
import { QUIZ_DATA, PAST_PAPERS_DATA } from '../questions.js';
import { highlightModelQuotes, getKeywordsForQuestion } from './layout.js';
import { VIDEOS_DATA } from './videos_data.js';
import { HOMEWORK_QUESTIONS } from './homework_data.js';
import { getImageWebLink } from './image_links.js';
import { SPEC_CHECKLIST_DATA } from './spec_checklist_data.js';
import { WRAPUP_DATA } from './wrapup_data.js';
import { 
  updateDraftFeedback, 
  togglePastClue, 
  togglePastAnswer, 
  togglePastQuestionComplete, 
  renderPastQuestionMarkup 
} from './past_papers.js';

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

function injectScaffoldingIntoMindMap(bodyHtml, subtopicId) {
  return bodyHtml;
}

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
  let errorIndex = 0;
  return text.replace(/\[\[(.*?)\]\]/g, (match, content) => {
    if (content.includes('->')) {
      errorIndex++;
      const [wrong, right] = content.split('->').map(s => s.trim());
      return `<span class="summary-wrong-word" data-correct="${right}" data-wrong="${wrong}">${wrong}<sup style="font-size: 0.75rem; font-weight: bold; color: var(--accent); margin-left: 2px; vertical-align: super; pointer-events: none;">${errorIndex}</sup></span>`;
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

const SUBTOPIC_EXAM_MAPPING = {
  "subtopic_1_1": [
    { paperId: "2018_summer_usa", qType: "q1", label: "Source Inference (Q1)", yearLabel: "2018" },
    { paperId: "2018_summer_usa", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "2018" },
    { paperId: "2018_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2018" },
    { paperId: "2018_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2018" },
    { paperId: "2018_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2018" },
    { paperId: "2018_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2018" }
  ],
  "subtopic_1_2": [
    { paperId: "2019_summer_usa", qType: "q1", label: "Source Inference (Q1)", yearLabel: "2019" },
    { paperId: "mock_exam_3", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "Best Guess Mock 3" },
    { paperId: "mock_exam_4", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "Best Guess Mock 4" },
    { paperId: "mock_exam_4", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "Best Guess Mock 4" },
    { paperId: "mock_exam_4", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "Best Guess Mock 4" },
    { paperId: "mock_exam_4", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "Best Guess Mock 4" }
  ],
  "subtopic_1_3": [
    { paperId: "mock_exam_3", qType: "q1", label: "Source Inference (Q1)", yearLabel: "Best Guess Mock 3" },
    { paperId: "mock_exam_3", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "Best Guess Mock 3" },
    { paperId: "mock_exam_3", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "Best Guess Mock 3" },
    { paperId: "mock_exam_3", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "Best Guess Mock 3" },
    { paperId: "mock_exam_3", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "Best Guess Mock 3" },
    { paperId: "2025_summer_usa", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "2025" }
  ],
  "subtopic_1_4": [
    { paperId: "2020_summer_usa", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "2020" },
    { paperId: "mock_exam_10", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "Best Guess Mock 10" },
    { paperId: "mock_exam_10", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "Best Guess Mock 10" },
    { paperId: "mock_exam_10", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "Best Guess Mock 10" },
    { paperId: "mock_exam_10", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "Best Guess Mock 10" }
  ],
  "subtopic_2_1": [
    { paperId: "mock_exam_8", qType: "q1", label: "Source Inference (Q1)", yearLabel: "Best Guess Mock 8" },
    { paperId: "mock_exam_8", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "Best Guess Mock 8" },
    { paperId: "mock_exam_8", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "Best Guess Mock 8" },
    { paperId: "mock_exam_8", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "Best Guess Mock 8" },
    { paperId: "mock_exam_8", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "Best Guess Mock 8" },
    { paperId: "mock_exam_8", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "Best Guess Mock 8" },
    { paperId: "2023_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2023" },
    { paperId: "2023_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2023" },
    { paperId: "2023_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2023" },
    { paperId: "2023_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2023" },
    { paperId: "2024_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2024" },
    { paperId: "2024_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2024" },
    { paperId: "2024_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2024" },
    { paperId: "2024_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2024" }
  ],
  "subtopic_2_2": [
    { paperId: "mock_exam_9", qType: "q1", label: "Source Inference (Q1)", yearLabel: "Best Guess Mock 9" },
    { paperId: "mock_exam_9", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "Best Guess Mock 9" },
    { paperId: "mock_exam_9", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "Best Guess Mock 9" },
    { paperId: "mock_exam_9", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "Best Guess Mock 9" },
    { paperId: "mock_exam_9", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "Best Guess Mock 9" },
    { paperId: "mock_exam_9", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "Best Guess Mock 9" },
    { paperId: "2019_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2019" },
    { paperId: "2019_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2019" },
    { paperId: "2019_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2019" },
    { paperId: "2019_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2019" },
    { paperId: "mock_exam_8", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "Best Guess Mock 8" },
    { paperId: "mock_exam_8", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "Best Guess Mock 8" },
    { paperId: "mock_exam_8", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "Best Guess Mock 8" },
    { paperId: "mock_exam_8", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "Best Guess Mock 8" },
    { paperId: "mock_exam_8", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "Best Guess Mock 8" },
    { paperId: "2020_summer_usa", qType: "q1", label: "Source Inference (Q1)", yearLabel: "2020" },
    { paperId: "2023_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2023" },
    { paperId: "2023_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2023" },
    { paperId: "2023_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2023" },
    { paperId: "2023_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2023" },
    { paperId: "2024_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2024" },
    { paperId: "2024_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2024" },
    { paperId: "2024_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2024" },
    { paperId: "2024_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2024" }
  ],
  "subtopic_2_3": [
    { paperId: "mock_exam_1", qType: "q1", label: "Source Inference (Q1)", yearLabel: "Best Guess Mock 1" },
    { paperId: "mock_exam_1", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "Best Guess Mock 1" },
    { paperId: "2022_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2022" },
    { paperId: "2022_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2022" },
    { paperId: "2022_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2022" },
    { paperId: "2022_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2022" }
  ],
  "subtopic_2_4": [
    { paperId: "mock_exam_1", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "Best Guess Mock 1" },
    { paperId: "mock_exam_1", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "Best Guess Mock 1" },
    { paperId: "mock_exam_1", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "Best Guess Mock 1" },
    { paperId: "mock_exam_1", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "Best Guess Mock 1" },
    { paperId: "mock_exam_1", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "Best Guess Mock 1" },
    { paperId: "2022_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2022" },
    { paperId: "2022_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2022" },
    { paperId: "2022_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2022" },
    { paperId: "2022_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2022" }
  ],
  "subtopic_3_1": [
    { paperId: "2023_summer_usa", qType: "q1", label: "Source Inference (Q1)", yearLabel: "2023" },
    { paperId: "2024_summer_usa", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "2024" },
    { paperId: "2025_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2025" },
    { paperId: "2025_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2025" },
    { paperId: "2025_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2025" },
    { paperId: "2025_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2025" }
  ],
  "subtopic_3_2": [
    { paperId: "2025_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2025" },
    { paperId: "2025_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2025" },
    { paperId: "2025_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2025" },
    { paperId: "2025_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2025" }
  ],
  "subtopic_3_3": [
    { paperId: "2022_summer_usa", qType: "q1", label: "Source Inference (Q1)", yearLabel: "2022" },
    { paperId: "2025_summer_usa", qType: "q1", label: "Source Inference (Q1)", yearLabel: "2025" },
    { paperId: "mock_exam_5", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "Best Guess Mock 5" },
    { paperId: "mock_exam_5", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "Best Guess Mock 5" },
    { paperId: "mock_exam_5", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "Best Guess Mock 5" },
    { paperId: "mock_exam_5", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "Best Guess Mock 5" },
    { paperId: "mock_exam_5", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "Best Guess Mock 5" }
  ],
  "subtopic_3_4": [
    { paperId: "2019_summer_usa", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "2019" },
    { paperId: "2023_summer_usa", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "2023" },
    { paperId: "2020_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2020" },
    { paperId: "2020_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2020" },
    { paperId: "2020_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2020" },
    { paperId: "2020_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2020" }
  ],
  "subtopic_4_1": [
    { paperId: "mock_exam_2", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "Best Guess Mock 2" },
    { paperId: "mock_exam_2", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "Best Guess Mock 2" },
    { paperId: "mock_exam_2", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "Best Guess Mock 2" },
    { paperId: "mock_exam_2", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "Best Guess Mock 2" },
    { paperId: "mock_exam_2", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "Best Guess Mock 2" },
    { paperId: "2022_summer_usa", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "2022" }
  ],
  "subtopic_4_2": [
    { paperId: "mock_exam_2", qType: "q1", label: "Source Inference (Q1)", yearLabel: "Best Guess Mock 2" },
    { paperId: "mock_exam_2", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "Best Guess Mock 2" },
    { paperId: "mock_exam_2", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "Best Guess Mock 2" },
    { paperId: "mock_exam_2", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "Best Guess Mock 2" },
    { paperId: "mock_exam_2", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "Best Guess Mock 2" },
    { paperId: "mock_exam_2", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "Best Guess Mock 2" },
    { paperId: "2022_summer_usa", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "2022" }
  ],
  "subtopic_4_3": [
    { paperId: "2023_summer_usa", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "2023" },
    { paperId: "2019_summer_usa", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "2019" },
    { paperId: "2020_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2020" },
    { paperId: "2020_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2020" },
    { paperId: "2020_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2020" },
    { paperId: "2020_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2020" }
  ],
  "subtopic_4_4": [
    { paperId: "2024_summer_usa", qType: "q2", label: "Causation Essay (Q2)", yearLabel: "2024" },
    { paperId: "2020_summer_usa", qType: "q3a", label: "Source Utility (Q3a)", yearLabel: "2020" },
    { paperId: "2020_summer_usa", qType: "q3b", label: "Interpretations Difference (Q3b)", yearLabel: "2020" },
    { paperId: "2020_summer_usa", qType: "q3c", label: "Interpretations Difference Reason (Q3c)", yearLabel: "2020" },
    { paperId: "2020_summer_usa", qType: "q3d", label: "Interpretations Evaluation (Q3d)", yearLabel: "2020" }
  ]
};

function groupMappedExams(mappedExams) {
  if (!mappedExams) return [];
  const processed = [];
  const q3Groups = {}; // paperId -> list of items

  mappedExams.forEach(item => {
    if (item.qType && item.qType.startsWith('q3')) {
      if (!q3Groups[item.paperId]) {
        q3Groups[item.paperId] = [];
      }
      q3Groups[item.paperId].push(item);
    } else {
      processed.push(item);
    }
  });

  // Now process q3Groups
  Object.keys(q3Groups).forEach(paperId => {
    const groupItems = q3Groups[paperId];
    if (groupItems.length > 0) {
      // Sort them in alphabetical order of qType to ensure order is q3a, q3b, q3c, q3d
      groupItems.sort((a, b) => a.qType.localeCompare(b.qType));
      
      const firstItem = groupItems[0];
      processed.push({
        paperId: paperId,
        qType: 'q3_suite',
        label: 'Section B Enquiry Suite (Q3a-d)',
        yearLabel: firstItem.yearLabel,
        items: groupItems
      });
    }
  });

  return processed;
}

function bindEmbeddedExamQuestionListeners(container, qId, qObj, paperId) {
  try {
    const textarea = container.querySelector(`#past-textarea-${qId}`);
    if (textarea && qObj) {
      if (!state.pastPaperSession) {
        state.pastPaperSession = { answers: {}, completedQuestions: [] };
      }
      if (!state.pastPaperSession.answers) {
        state.pastPaperSession.answers = {};
      }
      if (!state.pastPaperSession.answers[paperId]) {
        state.pastPaperSession.answers[paperId] = {};
      }
      if (qId.endsWith('_q1') && !state.pastPaperSession.answers[paperId][qId]) {
        state.pastPaperSession.answers[paperId][qId] = "Inference 1: \nQuote 1: \n\nInference 2: \nQuote 2: ";
      }
      textarea.value = state.pastPaperSession.answers[paperId][qId] || '';
      try {
        updateDraftFeedback(qId, textarea.value, qObj);
      } catch (err) {
        console.error("Error in updateDraftFeedback:", err);
      }
      textarea.addEventListener('input', (e) => {
        try {
          state.pastPaperSession.answers[paperId][qId] = e.target.value;
          updateDraftFeedback(qId, e.target.value, qObj);
          saveProgress();
        } catch (err) {
          console.error("Error in input listener:", err);
        }
      });
    }
  } catch (err) {
    console.error("Error in textarea setup:", err);
  }

  try {
    const chk = container.querySelector(`#past-chk-${qId}`);
    if (chk) {
      chk.checked = state.pastPaperSession && state.pastPaperSession.completedQuestions && state.pastPaperSession.completedQuestions.includes(qId);
      chk.addEventListener('change', (e) => {
        try {
          togglePastQuestionComplete(qId, e.target.checked);
        } catch (err) {
          console.error("Error in checkbox change listener:", err);
        }
      });
    }
  } catch (err) {
    console.error("Error in checkbox setup:", err);
  }

  try {
    const btnClue = container.querySelector(`#past-btn-clue-${qId}`);
    if (btnClue) {
      btnClue.addEventListener('click', () => {
        try {
          const box = container.querySelector(`#past-clue-box-${qId}`);
          if (box) {
            const isHidden = box.style.display === 'none';
            box.style.display = isHidden ? 'block' : 'none';
            AudioEngine.play(isHidden ? 'flip' : 'click');
          }
        } catch (err) {
          console.error("Error in clue click listener:", err);
        }
      });
    }
  } catch (err) {
    console.error("Error in clue button setup:", err);
  }

  try {
    const btnScaffold = container.querySelector(`#past-btn-scaffold-${qId}`);
    if (btnScaffold) {
      btnScaffold.addEventListener('click', () => {
        try {
          const box = container.querySelector(`#past-scaffold-box-${qId}`);
          if (box) {
            const isHidden = box.style.display === 'none';
            box.style.display = isHidden ? 'block' : 'none';
            AudioEngine.play(isHidden ? 'flip' : 'click');
          }
        } catch (err) {
          console.error("Error in scaffold click listener:", err);
        }
      });
    }
  } catch (err) {
    console.error("Error in scaffold button setup:", err);
  }

  try {
    const scaffoldBox = container.querySelector(`#past-scaffold-box-${qId}`);
    if (scaffoldBox) {
      const starterBtns = scaffoldBox.querySelectorAll('.scaffold-starter-btn');
      starterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          try {
            const starterText = btn.getAttribute('data-starter');
            const textarea = container.querySelector(`#past-textarea-${qId}`);
            if (textarea) {
              AudioEngine.play('success');
              
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
              
              const event = new Event('input', { bubbles: true });
              textarea.dispatchEvent(event);
            }
          } catch (err) {
            console.error("Error in starter button click listener:", err);
          }
        });
      });
    }
  } catch (err) {
    console.error("Error in scaffold box setup:", err);
  }

  try {
    const btnCheck = container.querySelector(`#past-btn-check-${qId}`);
    if (btnCheck) {
      btnCheck.addEventListener('click', () => {
        try {
          const box = container.querySelector(`#past-answer-box-${qId}`);
          if (box) {
            const isHidden = box.style.display === 'none';
            box.style.display = isHidden ? 'block' : 'none';
            AudioEngine.play(isHidden ? 'success' : 'click');
          }
        } catch (err) {
          console.error("Error in check button click listener:", err);
        }
      });
    }
  } catch (err) {
    console.error("Error in check button setup:", err);
  }
}

function getStandardQuestionsForSubtopic(subtopicId) {
  for (const topic of QUIZ_DATA) {
    const sub = topic.subtopics.find(s => s.id === subtopicId);
    if (sub) {
      return sub.standard || [];
    }
  }
  return [];
}

function deterministicShuffle(array, seedString) {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.abs((hash + i) % (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

function renderStepKnowledgeCheck(stepIndex, subtopicId) {
  // --- Task Variation 2: Linking/Matching Boxes (Step 2 / Index 1) ---
  const causalLinks = LESSONS_DATA[subtopicId]?.causalLinks;
  if (stepIndex === 1 && causalLinks && causalLinks.factors && causalLinks.factors.length > 0) {
    const factors = causalLinks.factors;
    const effects = factors.map((f, idx) => ({ id: f.id, text: f.linkageText || f.options[0], originalIndex: idx }));
    const shuffledEffects = deterministicShuffle(effects, subtopicId + "_linking");

    let factorsHtml = factors.map((f, idx) => `
      <button class="linking-box-item cause-box" data-factor-id="${f.id}" data-correct-idx="${idx}" style="width: 100%; text-align: left; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
        <strong style="color: var(--secondary); flex-shrink: 0;"><i class="fa-solid fa-circle-question"></i></strong>
        <span style="flex-grow: 1;">${f.title}</span>
      </button>
    `).join('');

    let effectsHtml = shuffledEffects.map((e) => `
      <button class="linking-box-item effect-box" data-effect-id="${e.id}" data-original-idx="${e.originalIndex}" style="width: 100%; text-align: left; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
        <strong style="color: var(--text-muted); flex-shrink: 0;"><i class="fa-solid fa-circle-question"></i></strong>
        <span style="flex-grow: 1;">${e.text}</span>
      </button>
    `).join('');

    return `
      <div class="core-step-quiz core-step-linking" id="step-linking-${subtopicId}" style="margin-top: 20px; padding: 16px; background: rgba(6, 182, 212, 0.05); border: 1px solid var(--border-glass); border-left: 4px solid var(--secondary); border-radius: var(--border-radius-sm); box-sizing: border-box; text-align: left;">
        <h4 style="margin: 0 0 8px 0; color: var(--secondary); font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-link"></i> Check Your Understanding: Link Cause to Consequence
        </h4>
        <p style="margin: 0 0 16px 0; font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">
          Click a <strong>Cause</strong> on the left, then click its matching <strong>Consequence</strong> on the right.
        </p>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px;">
            ${factorsHtml}
          </div>
          <div style="flex: 1; min-width: 250px;">
            ${effectsHtml}
          </div>
        </div>
        <div class="linking-success-feedback" style="display: none; margin-top: 14px; padding: 10px 12px; background: rgba(16, 185, 129, 0.05); border-left: 3px solid var(--success); border-radius: 4px; font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">
          <strong style="color: var(--success); display: block; margin-bottom: 2px;">Causal Connections Complete! +5 XP</strong>
          ${causalLinks.successText || "Fantastic job linking causes to their historical effects!"}
        </div>
      </div>
    `;
  }

  // --- Task Variation 3: Chronological Ordering (Step 3 / Index 2) ---
  const timeline = (WORKBOOK_DATA[subtopicId] && WORKBOOK_DATA[subtopicId].timeline) || [];
  if (stepIndex === 2 && timeline.length >= 3) {
    const originalEvents = timeline.slice(0, 3).map((t, idx) => ({ ...t, originalIndex: idx }));
    const shuffledEvents = deterministicShuffle(originalEvents, subtopicId + "_ordering");

    let eventsHtml = shuffledEvents.map((ev) => `
      <button class="ordering-item" data-original-idx="${ev.originalIndex}" style="width: 100%; text-align: left; margin-bottom: 8px; display: flex; align-items: center; gap: 12px;">
        <span class="ordering-badge">?</span>
        <span style="flex-grow: 1; display: inline-flex; flex-wrap: wrap; align-items: center;">
          <span class="reveal-date" style="display: none; color: var(--accent); font-weight: 700; margin-right: 6px; font-size: 0.85rem;">[${ev.date}]</span>
          <span class="event-desc" style="line-height: 1.35;">${ev.desc}</span>
        </span>
      </button>
    `).join('');

    return `
      <div class="core-step-quiz core-step-ordering" id="step-ordering-${subtopicId}" style="margin-top: 20px; padding: 16px; background: rgba(244, 63, 94, 0.05); border: 1px solid var(--border-glass); border-left: 4px solid var(--accent); border-radius: var(--border-radius-sm); box-sizing: border-box; text-align: left;">
        <h4 style="margin: 0 0 8px 0; color: var(--accent); font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-clock-rotate-left"></i> Check Your Understanding: Chronological Ordering
        </h4>
        <p style="margin: 0 0 16px 0; font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">
          Click the historical events below in their correct chronological order (from earliest to latest).
        </p>
        <div class="ordering-container">
          ${eventsHtml}
        </div>
        <div class="ordering-success-feedback" style="display: none; margin-top: 14px; padding: 10px 12px; background: rgba(16, 185, 129, 0.05); border-left: 3px solid var(--success); border-radius: 4px; font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">
          <strong style="color: var(--success); display: block; margin-bottom: 2px;">Chronological Sequence Correct! +5 XP</strong>
          Excellent! You have placed all key subtopic events in their correct historical sequence.
        </div>
      </div>
    `;
  }

  // --- Task Variation 1: Standard Multiple Choice Questions (Step 1 / Index 0 or fallback) ---
  const standardQuestions = getStandardQuestionsForSubtopic(subtopicId);
  if (standardQuestions.length === 0) return '';
  
  const totalSteps = LESSONS_DATA[subtopicId].steps.length;
  const numQ = Math.min(3, Math.ceil(standardQuestions.length / totalSteps));
  const startIdx = stepIndex * numQ;
  const stepQuestions = standardQuestions.slice(startIdx, Math.min(startIdx + numQ, standardQuestions.length));
  
  if (stepQuestions.length === 0) return '';
  
  let html = `
    <div class="core-step-quiz" style="margin-top: 20px; padding: 16px; background: rgba(205, 127, 50, 0.05); border: 1px solid var(--border-glass); border-left: 4px solid var(--primary); border-radius: var(--border-radius-sm); box-sizing: border-box; text-align: left;">
      <h4 style="margin: 0 0 12px 0; color: var(--primary); font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-circle-question"></i> Check Your Understanding
      </h4>
      <div style="display: flex; flex-direction: column; gap: 16px;">
  `;
  
  stepQuestions.forEach((q, qIdx) => {
    const options = [q.answer, ...(q.distractors || [])];
    
    // Deterministic shuffle
    let hash = 0;
    for (let i = 0; i < q.id.length; i++) {
      hash = q.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const shuffledOptions = [...options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.abs((hash + i) % (i + 1));
      const temp = shuffledOptions[i];
      shuffledOptions[i] = shuffledOptions[j];
      shuffledOptions[j] = temp;
    }
    
    const optionsHtml = shuffledOptions.map(opt => {
      const isCorrect = (opt === q.answer);
      return `
        <button class="core-quiz-option-btn" 
                data-question-id="${q.id}" 
                data-is-correct="${isCorrect}" 
                style="width: 100%; text-align: left; padding: 10px 14px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); color: var(--text-main); font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all var(--transition-fast); display: flex; align-items: center; gap: 10px; outline: none; margin: 0; box-sizing: border-box;">
          <span class="option-icon" style="min-width: 16px; height: 16px; border: 2px solid var(--text-muted); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; color: transparent; font-weight: 800; box-sizing: border-box;"></span>
          <span style="flex-grow: 1; line-height: 1.3;">${opt}</span>
        </button>
      `;
    }).join('');
    
    html += `
      <div class="core-quiz-question-block" data-q-id="${q.id}" style="display: flex; flex-direction: column; gap: 8px;">
        <div style="font-size: 0.88rem; font-weight: 600; color: var(--text-main); line-height: 1.4;">
          ${qIdx + 1}. ${q.question}
        </div>
        <div class="core-quiz-options" style="display: flex; flex-direction: column; gap: 8px;">
          ${optionsHtml}
        </div>
        <div class="core-quiz-feedback" style="display: none; padding: 10px 12px; background: rgba(16, 185, 129, 0.05); border-left: 3px solid var(--success); border-radius: 4px; font-size: 0.8rem; line-height: 1.45; color: var(--text-muted); box-sizing: border-box; margin-top: 4px;">
          <strong style="color: var(--success); display: block; margin-bottom: 2px;">Correct! Explanation:</strong>
          ${q.explanation}
        </div>
      </div>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  return html;
}

function renderCorePeelBuilder(subtopicId) {
  const peel = PEEL_DATA[subtopicId];
  if (!peel) return '';

  const cards = [
    { type: 'point', text: peel.point },
    { type: 'evidence', text: peel.evidence },
    { type: 'explanation', text: peel.explanation },
    { type: 'link', text: peel.link }
  ];

  const shuffledCards = [...cards].sort(() => Math.random() - 0.5);

  const cardsHtml = shuffledCards.map(c => `
    <button class="peel-card-item" data-type="${c.type}" style="width: 100%; text-align: left; display: flex; align-items: flex-start; gap: 10px;">
      <i class="fa-solid fa-hand-pointer" style="color: var(--text-muted); margin-top: 3px; flex-shrink: 0;"></i>
      <span class="peel-card-text" style="flex-grow: 1;">${c.text}</span>
    </button>
  `).join('');

  return `
    <div class="mastery-card core-peel-builder-card" style="max-width: 800px; margin: 0 auto 24px auto;">
      <h3 class="mastery-card-title" style="display: flex; justify-content: space-between; align-items: center; gap: 10px; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px; font-size: 1rem; color: var(--primary); margin: 0 0 12px 0;">
        <span><i class="fa-solid fa-pen-fancy"></i> End of Lesson: PEEL Paragraph Builder</span>
      </h3>
      <div class="mastery-card-body" style="padding-top: 4px; text-align: left;">
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0; margin-bottom: 16px; line-height: 1.45;">
          Paper 3 questions require writing structured PEEL paragraphs (Point, Evidence, Explanation, Link). Click the sentences below in the correct logical order to construct your explanation paragraph!
        </p>
        
        <div style="background: rgba(var(--primary-rgb), 0.05); padding: 12px 14px; border-left: 3px solid var(--primary); border-radius: 4px; margin-bottom: 20px; font-size: 0.95rem; font-weight: bold; line-height: 1.4;">
          Question: ${peel.question}
        </div>

        <h4 style="margin: 0 0 10px 0; font-size: 0.82rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Sentence Bank (Click in PEEL order)</h4>
        <div class="peel-cards-pool" style="margin-bottom: 20px;">
          ${cardsHtml}
        </div>

        <h4 style="margin: 20px 0 10px 0; font-size: 0.82rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Your Paragraph Assembly</h4>
        <div class="peel-assembly-area">
          <div class="peel-slot peel-slot-placeholder" data-index="0">[ 1. Make your Point (P) ]</div>
          <div class="peel-slot peel-slot-placeholder" data-index="1">[ 2. Provide your Evidence (E) ]</div>
          <div class="peel-slot peel-slot-placeholder" data-index="2">[ 3. Explain your Evidence (E) ]</div>
          <div class="peel-slot peel-slot-placeholder" data-index="3">[ 4. Link back to the Question (L) ]</div>
        </div>

        <div class="peel-hint-box" style="display: none; padding: 10px 12px; background: rgba(244, 63, 94, 0.05); border-left: 3px solid var(--accent); border-radius: 4px; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px; line-height: 1.45;"></div>

        <!-- Success Panel -->
        <div class="peel-success-drawer" style="display: none; padding: 16px; background: rgba(16, 185, 129, 0.04); border-left: 4px solid var(--success); border-radius: var(--border-radius-sm); margin-top: 16px;">
          <h4 style="margin: 0 0 8px 0; color: var(--success); font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-circle-check"></i> Paragraph Completed! +10 XP
          </h4>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0; margin-bottom: 12px; line-height: 1.45;">
            Excellent work! You have successfully built a full PEEL paragraph. Notice how each sentence serves a specific purpose in building a high-scoring analytical response:
          </p>
          <div style="font-size: 0.78rem; line-height: 1.45; color: var(--text-muted); border-top: 1px dashed var(--border-glass); padding-top: 10px; display: flex; flex-direction: column; gap: 6px;">
            <p style="margin: 0;"><strong>Point:</strong> Starts your paragraph by directly answering the question with a clear factor.</p>
            <p style="margin: 0;"><strong>Evidence:</strong> Adds specific dates, details, or statistics to back up your point.</p>
            <p style="margin: 0;"><strong>Explanation:</strong> Explains exactly how/why your evidence answers the question (focus on consequence).</p>
            <p style="margin: 0;"><strong>Link:</strong> Ties the explanation back to the question to show structural coherence.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindCoreStepInteractiveTasks(container, subtopicId) {
  // 1. Linking Boxes Binding
  const linkingContainer = container.querySelector(`#step-linking-${subtopicId}`);
  if (linkingContainer) {
    let selectedCause = null;
    const causeButtons = linkingContainer.querySelectorAll('.cause-box');
    const effectButtons = linkingContainer.querySelectorAll('.effect-box');
    const successFeedback = linkingContainer.querySelector('.linking-success-feedback');
    let linkedCount = 0;

    causeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('linked')) return;
        AudioEngine.play('click');

        causeButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedCause = btn;
      });
    });

    effectButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('linked') || !selectedCause) return;

        const causeId = selectedCause.getAttribute('data-factor-id');
        const effectId = btn.getAttribute('data-effect-id');

        if (causeId === effectId) {
          // Correct match!
          AudioEngine.play('success');
          btn.classList.add('linked');
          selectedCause.classList.add('linked');
          btn.style.cursor = 'default';
          selectedCause.style.cursor = 'default';
          
          const causeCheckIcon = selectedCause.querySelector('strong');
          if (causeCheckIcon) causeCheckIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
          const effectCheckIcon = btn.querySelector('strong');
          if (effectCheckIcon) effectCheckIcon.innerHTML = '<i class="fa-solid fa-check"></i>';

          causeButtons.forEach(b => b.classList.remove('selected'));
          selectedCause = null;
          linkedCount++;
          addXp(2);

          if (linkedCount === causeButtons.length) {
            AudioEngine.play('cheer');
            if (successFeedback) successFeedback.style.display = 'block';
            addXp(5);
            if (typeof Confetti !== 'undefined' && typeof Confetti.spawn === 'function') {
              Confetti.spawn(30);
            }
          }
        } else {
          // Mismatch!
          AudioEngine.play('error');
          btn.style.borderColor = 'var(--accent)';
          btn.style.background = 'rgba(244, 63, 94, 0.1)';
          selectedCause.style.borderColor = 'var(--accent)';
          selectedCause.style.background = 'rgba(244, 63, 94, 0.1)';

          const prevBtn = btn;
          const prevCause = selectedCause;
          causeButtons.forEach(b => b.classList.remove('selected'));
          selectedCause = null;

          setTimeout(() => {
            if (!prevBtn.classList.contains('linked')) {
              prevBtn.style.borderColor = 'var(--border-glass)';
              prevBtn.style.background = 'rgba(255, 255, 255, 0.02)';
            }
            if (!prevCause.classList.contains('linked')) {
              prevCause.style.borderColor = 'var(--border-glass)';
              prevCause.style.background = 'rgba(255, 255, 255, 0.02)';
            }
          }, 600);
        }
      });
    });
  }

  // 2. Chronological Ordering Binding
  const orderingContainer = container.querySelector(`#step-ordering-${subtopicId}`);
  if (orderingContainer) {
    const items = Array.from(orderingContainer.querySelectorAll('.ordering-item'));
    const successFeedback = orderingContainer.querySelector('.ordering-success-feedback');
    let currentStep = 0;

    items.forEach(item => {
      item.addEventListener('click', () => {
        if (item.classList.contains('ordered')) return;

        const originalIdx = parseInt(item.getAttribute('data-original-idx'));

        if (originalIdx === currentStep) {
          // Correct!
          AudioEngine.play('success');
          item.classList.add('ordered');
          item.querySelector('.ordering-badge').textContent = currentStep + 1;
          
          // Reveal the date
          const dateEl = item.querySelector('.reveal-date');
          if (dateEl) {
            dateEl.style.display = 'inline-block';
          }

          currentStep++;
          addXp(2);

          if (currentStep === items.length) {
            AudioEngine.play('cheer');
            if (successFeedback) successFeedback.style.display = 'block';
            addXp(5);
            if (typeof Confetti !== 'undefined' && typeof Confetti.spawn === 'function') {
              Confetti.spawn(30);
            }
          }
        } else {
          // Wrong selection!
          AudioEngine.play('error');
          item.classList.add('incorrect');
          setTimeout(() => {
            item.classList.remove('incorrect');
          }, 500);

          // Reset progress
          currentStep = 0;
          items.forEach(el => {
            el.classList.remove('ordered');
            el.querySelector('.ordering-badge').textContent = '?';
            
            // Hide the date again
            const dateEl = el.querySelector('.reveal-date');
            if (dateEl) {
              dateEl.style.display = 'none';
            }
          });
        }
      });
    });
  }
}

function bindCorePeelBuilder(container, subtopicId) {
  const peelCard = container.querySelector(`.core-peel-builder-card`);
  if (!peelCard) return;

  const cardItems = peelCard.querySelectorAll('.peel-card-item');
  const slots = peelCard.querySelectorAll('.peel-slot');
  const hintBox = peelCard.querySelector('.peel-hint-box');
  const successDrawer = peelCard.querySelector('.peel-success-drawer');

  const expectedTypes = ['point', 'evidence', 'explanation', 'link'];
  let placedCount = 0;

  const hints = {
    'point': 'Start by choosing the sentence that directly introduces the main answer to the question (P).',
    'evidence': 'Look for a sentence containing specific dates, figures, or historical events to support the point (E).',
    'explanation': 'Choose the sentence that explains the consequence of the evidence. It often starts with "As a result" or "This meant that" (E).',
    'link': 'Choose the final sentence that sums up the paragraph and links back to the main essay question (L).'
  };

  cardItems.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('placed')) return;

      const cardType = card.getAttribute('data-type');
      const expectedType = expectedTypes[placedCount];

      if (cardType === expectedType) {
        // Correct next sentence in PEEL sequence!
        AudioEngine.play('success');
        card.classList.add('placed');
        
        const slot = slots[placedCount];
        slot.innerHTML = `
          <span class="peel-tag ${cardType}">${cardType}</span>
          <span style="font-weight: 500; font-size: 0.9rem;">${card.querySelector('.peel-card-text').textContent}</span>
        `;
        slot.className = `peel-slot peel-slot-filled`;
        
        placedCount++;
        addXp(2);
        
        if (hintBox) {
          hintBox.style.display = 'none';
          hintBox.textContent = '';
        }

        if (placedCount === 4) {
          // Completed the paragraph!
          AudioEngine.play('cheer');
          addXp(10);
          if (successDrawer) {
            successDrawer.style.display = 'block';
            successDrawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          if (typeof Confetti !== 'undefined' && typeof Confetti.spawn === 'function') {
            Confetti.spawn(50);
          }
        }
      } else {
        // Incorrect sentence click!
        AudioEngine.play('error');
        card.classList.add('incorrect');
        setTimeout(() => {
          card.classList.remove('incorrect');
        }, 500);

        if (hintBox) {
          hintBox.style.display = 'block';
          hintBox.innerHTML = `
            <i class="fa-solid fa-lightbulb" style="color: var(--accent); margin-right: 6px;"></i>
            <strong>Not quite!</strong> ${hints[expectedType]}
          `;
        }
      }
    });
  });
}

function renderCoreScaffoldQuestions(subtopicId) {
  const qList = CORE_QUESTIONS_DATA[subtopicId];
  if (!qList || qList.length === 0) return '';

  let qBlocksHtml = qList.map((item, qIdx) => {
    return `
      <div class="core-scaffold-q-block" style="margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--border-glass); display: flex; flex-direction: column; gap: 4px;">
        <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-main); line-height: 1.4;">
          Q${qIdx + 1}: ${item.q}
        </div>
        <div style="font-size: 0.82rem; color: var(--text-muted); font-style: italic; display: flex; align-items: baseline; gap: 6px;">
          <span style="color: var(--primary); font-weight: bold; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.3px; flex-shrink: 0;">Sentence starter:</span>
          <span>"${item.starter}"</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="mastery-card core-scaffold-questions-card" style="max-width: 800px; margin: 24px auto 20px auto; padding: 20px; background: rgba(59, 130, 246, 0.02); border: 1px solid var(--border-glass); border-left: 5px solid var(--primary); border-radius: var(--border-radius-sm); text-align: left; box-sizing: border-box;">
      <h4 style="margin: 0 0 10px 0; color: var(--primary); font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-graduation-cap"></i> Lesson Study Support: 5 Key Comprehension Questions
      </h4>
      <p style="margin: 0 0 16px 0; font-size: 0.82rem; color: var(--text-muted); line-height: 1.45;">
        Write the answers to these comprehension questions in your study notebook, using the sentence starters to help structure your response.
      </p>
      <div class="core-scaffold-questions-list" style="display: flex; flex-direction: column;">
        ${qBlocksHtml}
      </div>
    </div>
  `;
}

function bindCoreScaffoldQuestions(container, subtopicId) {
  // No-op as textareas and save buttons have been removed
}

export async function renderMasteryView(subtopicId) {
  highlightedKeywords.clear();
  viewedSlides.clear();
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

  const isCoreMode = (state.studyLevel === 'core');
  const isCore = state.studyLevel === 'core';
  
  if (isCoreMode) {
    container.classList.add('core-mode-active');
  } else {
    container.classList.remove('core-mode-active');
  }

  const levelSelectorHtml = `
    <div class="study-level-selector" style="display: flex; background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-glass); padding: 4px; border-radius: 20px; width: fit-content; margin: 0 auto 24px auto; gap: 4px; box-shadow: var(--shadow-sm); position: relative; z-index: 10;">
      <button class="level-toggle-btn ${isCore ? 'active' : ''}" data-level="core" style="border: none; background: ${isCore ? 'var(--primary)' : 'transparent'}; color: ${isCore ? 'var(--text-inverse)' : 'var(--text-muted)'}; font-weight: 700; font-size: 0.82rem; padding: 8px 18px; border-radius: 16px; cursor: pointer; transition: all var(--transition-fast); display: inline-flex; align-items: center; gap: 6px; box-shadow: ${isCore ? 'var(--shadow-primary)' : 'none'};">
        <i class="fa-solid fa-graduation-cap"></i> Core Lesson
      </button>
      <button class="level-toggle-btn ${!isCore ? 'active' : ''}" data-level="mastery" style="border: none; background: ${!isCore ? 'var(--primary)' : 'transparent'}; color: ${!isCore ? 'var(--text-inverse)' : 'var(--text-muted)'}; font-weight: 700; font-size: 0.82rem; padding: 8px 18px; border-radius: 16px; cursor: pointer; transition: all var(--transition-fast); display: inline-flex; align-items: center; gap: 6px; box-shadow: ${!isCore ? 'var(--shadow-primary)' : 'none'};">
        <i class="fa-solid fa-trophy"></i> Mastery
      </button>
    </div>
  `;

  let coreSupportHtml = '';
  if (isCoreMode) {
    let vocabListHtml = '';
    let timelineListHtml = '';
    try {
      const wbData = WORKBOOK_DATA[subtopicId];
      if (wbData) {
        if (wbData.vocabulary && wbData.vocabulary.length > 0) {
          const vocabItems = wbData.vocabulary.map(v => `
            <li><strong>${v.term}:</strong> ${v.definition}</li>
          `).join('');
          vocabListHtml = `
            <div class="mastery-card core-vocab-card" style="margin: 0; padding: 20px; border-left: 4px solid var(--secondary); background: rgba(6, 182, 212, 0.02); text-align: left;">
              <h4 style="margin: 0 0 12px 0; font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: var(--secondary); display: flex; align-items: center; gap: 8px; justify-content: flex-start;">
                <i class="fa-solid fa-key"></i> Key Vocabulary Definitions
              </h4>
              <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem; line-height: 1.45;">
                ${vocabItems}
              </ul>
            </div>
          `;
        }
        if (wbData.timeline && wbData.timeline.length > 0) {
          const timelineItems = wbData.timeline.map(t => `
            <div style="position: relative;">
              <span style="position: absolute; left: -19px; top: 3px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.25);"></span>
              <strong style="color: var(--accent);">${t.date}:</strong> ${t.desc}
            </div>
          `).join('');
          timelineListHtml = `
            <div class="mastery-card core-timeline-card" style="margin: 0; padding: 20px; border-left: 4px solid var(--accent); background: rgba(244, 63, 94, 0.02); text-align: left;">
              <h4 style="margin: 0 0 12px 0; font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 8px; justify-content: flex-start;">
                <i class="fa-solid fa-clock-rotate-left"></i> Core Timeline
              </h4>
              <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.88rem; line-height: 1.4; position: relative; padding-left: 14px; border-left: 2px solid var(--border-glass);">
                ${timelineItems}
              </div>
            </div>
          `;
        }
      }
    } catch (e) {
      console.error("Failed to load core support workbook data:", e);
    }
    coreSupportHtml = `
      <div class="core-support-container" style="max-width: 800px; margin: 0 auto 24px auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        ${vocabListHtml}
        ${timelineListHtml}
      </div>
    `;
  }

  // Generate Steps HTML
  let stepsHtml = '';
  const halfPoint = Math.ceil(data.steps.length / 2);
  data.steps.forEach((step, index) => {
    let scholarlyHtml = '';
    if (step.scholarlyDepth && !isCoreMode) {
      let scholarlyImgHtml = '';
      if (step.scholarlyDepth.image) {
        let provenanceHtml = '';
        if (step.scholarlyDepth.imageProvenance) {
          provenanceHtml = `
            <div class="scholarly-image-provenance" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px; font-weight: 500; line-height: 1.4; max-width: 600px; margin-left: auto; margin-right: auto; text-align: center; background: var(--bg-card); border: 1px solid var(--border-glass); padding: 8px 12px; border-radius: 4px; box-sizing: border-box;">
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
            <i class="fa-solid fa-graduation-cap"></i> ${step.scholarlyDepth.title} (Click to expand)
          </summary>
          <div class="scholarly-content" style="margin-top: 12px; font-size: 0.88rem; line-height: 1.5; color: var(--text-muted);">
            ${scholarlyImgHtml}
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

    const stepQuizHtml = isCoreMode ? renderStepKnowledgeCheck(index, subtopicId) : '';

    if (step.isSplit) {
      let finalBodyHtml = applyGlossaryTooltips(injectScaffoldingIntoMindMap(step.bodyHtml, subtopicId));
      if (isCoreMode && stepQuizHtml) {
        const lastDivIdx = finalBodyHtml.lastIndexOf('</div>');
        if (lastDivIdx !== -1) {
          finalBodyHtml = finalBodyHtml.substring(0, lastDivIdx) + stepQuizHtml + finalBodyHtml.substring(lastDivIdx);
        }
      }

      stepsHtml += `
        <div class="mastery-card" style="max-width: 800px; margin: 0 auto 20px auto;">
          <h3 class="mastery-card-title" style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <span>${step.title}</span>
            ${audioBtnHtml}
          </h3>
          <div class="mastery-split-layout">
            ${finalBodyHtml}
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
            ${applyGlossaryTooltips(injectScaffoldingIntoMindMap(step.bodyHtml, subtopicId))}
          </div>
          ${bridgeHtml}
          ${scholarlyHtml}
          ${stepQuizHtml}
        </div>
      `;
    }

    // Insert Lived Experience discussion card half-way through the lesson
    if (index + 1 === halfPoint && data.livedExperience) {
      const le = data.livedExperience;
      const discussionPromptText = isCoreMode && le.coreDiscussionQuestion 
        ? le.coreDiscussionQuestion 
        : (isCoreMode 
            ? `Read ${le.witness || 'the witness'}'s account. Find one detail that shows the impact of this historical situation, and explain why it was significant or how it made people feel.` 
            : le.discussionQuestion);

      let hasSourceA = false;
      if (data.steps) {
        data.steps.forEach(step => {
          if (step.bodyHtml && /source\s+a\b/i.test(step.bodyHtml)) {
            hasSourceA = true;
          }
        });
      }
      const sourceLabel = hasSourceA ? 'Source B' : 'Source A';

      stepsHtml += `
        <div class="mastery-card lived-experience-card" style="max-width: 800px; margin: 0 auto 20px auto; border-left: 6px solid var(--accent);">
          <h3 class="mastery-card-title" style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <span style="color: var(--accent);"><i class="fa-solid fa-comments"></i> Mid-Lesson Class Discussion: Lived Experience</span>
            <button class="btn-audio-read" title="Read Source Aloud" style="margin-left: 8px;">
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </h3>
          <div class="mastery-card-body card-content">
            <div class="source-provenance" style="font-size: 0.85rem; font-style: italic; color: var(--text-muted); margin-bottom: 12px; line-height: 1.4;">
              <strong>${sourceLabel}:</strong> ${le.witness} - ${le.context}
            </div>
            <blockquote class="source-quote" style="font-size: 1.05rem; font-style: italic; border-left: 3px solid var(--accent); padding-left: 16px; margin: 0 0 20px 0; color: var(--text-main); line-height: 1.55; font-family: Georgia, 'Times New Roman', serif;">
              "${le.quote}"
            </blockquote>
            <div class="discussion-prompt" style="background: var(--accent-glow); border: 1px dashed var(--accent); border-radius: var(--border-radius-sm); padding: 16px; margin-top: 16px; box-sizing: border-box;">
              <h4 style="margin: 0 0 8px 0; color: var(--accent); display: flex; align-items: center; gap: 8px; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px; font-family: var(--font-heading); font-weight: 700;">
                <i class="fa-solid fa-circle-question"></i> Class Discussion Prompt
              </h4>
              <p style="margin: 0; font-size: 0.95rem; line-height: 1.5; color: var(--text-main); font-weight: 500;">
                ${discussionPromptText}
              </p>
            </div>
          </div>
        </div>
      `;
    }
  });

  if (isCoreMode) {
    stepsHtml += renderCoreScaffoldQuestions(subtopicId);
  }

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
            <strong><i class="fa-solid fa-check" style="color: var(--success);"></i> Consequence Link:</strong> ${f.linkageText}
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
      <div class="mastery-card importance-analyser-wrapper-card" style="max-width: 800px; margin: 0 auto 24px auto;">
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

  // Generate Question Vault HTML (Removed per user request)
  let vaultHtml = '';

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

  // Generate How Useful Analyser or unified Paper 3 Suite HTML
  let howUsefulHtml = '';
  if (!isCoreMode) {
  if (data.paper3Suite) {
    const suite = data.paper3Suite;
    howUsefulHtml = `
      <style>
        details.how-useful-details summary::-webkit-details-marker {
          display: none;
        }
        details.how-useful-details[open] .how-useful-toggle-icon {
          transform: rotate(180deg);
        }
        .paper3-sources-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .paper3-interpretations-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        @media (max-width: 768px) {
          .paper3-sources-grid, .paper3-interpretations-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      <div class="mastery-card how-useful-card" style="max-width: 800px; margin: 0 auto 24px auto; padding: 0;">
        <details class="how-useful-details" open style="width: 100%; padding: 28px; box-sizing: border-box;">
          <summary class="how-useful-summary" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-weight: 700; user-select: none; outline: none; list-style: none; cursor: pointer; margin: 0; font-size: 1.15rem; color: var(--text-main);">
            <span style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-file-lines" style="color: var(--primary);"></i> ${suite.title}</span>
            <i class="fa-solid fa-chevron-down how-useful-toggle-icon" style="transition: transform 0.2s; font-size: 0.95rem; color: var(--text-muted);"></i>
          </summary>
          <div class="how-useful-expanded-content" style="margin-top: 16px;">
            <div class="mastery-card-body" style="font-size: 0.95rem;">
              <p style="margin-bottom: 16px; font-size: 0.9rem; color: var(--text-muted); line-height: 1.45;">
                In Paper 3 Section B, you will be given a set of sources and interpretations that work together. You are required to answer <strong>Questions 3a to 3d</strong> based on this material.
              </p>

              <!-- Questions List -->
              <div class="paper3-questions-block" style="margin-bottom: 20px; padding: 14px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm);">
                <strong style="display: block; margin-bottom: 10px; color: var(--primary); font-size: 0.9rem;"><i class="fa-solid fa-circle-question"></i> Exam Question Set:</strong>
                <ol style="margin: 0; padding-left: 20px; font-size: 0.88rem; line-height: 1.5; color: var(--text-base); display: flex; flex-direction: column; gap: 8px;">
                  <li><strong>Q3a (8 marks):</strong> ${suite.questions.q3a}</li>
                  <li><strong>Q3b (4 marks):</strong> ${suite.questions.q3b}</li>
                  <li><strong>Q3c (4 marks):</strong> ${suite.questions.q3c}</li>
                  <li><strong>Q3d (16 marks + 4 SPaG):</strong> ${suite.questions.q3d}</li>
                </ol>
              </div>

              <!-- Sources Block -->
              <strong style="display: block; margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Sources for Q3a & Q3c:</strong>
              <div class="paper3-sources-grid">
                <div class="skills-source-card" style="padding: 12px; background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative; display: flex; flex-direction: column; gap: 8px;">
                  <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--primary);"></div>
                  <strong style="font-size: 0.75rem; color: var(--primary); text-transform: uppercase;">Source B</strong>
                  <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; border-bottom: 1px dashed var(--border-glass); padding-bottom: 6px;">
                    <strong>Provenance:</strong> ${suite.sourceB.provenance}
                  </div>
                  <p style="font-style: italic; font-size: 0.85rem; line-height: 1.45; color: var(--text-base); margin: 0;">${suite.sourceB.content}</p>
                </div>
                <div class="skills-source-card" style="padding: 12px; background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative; display: flex; flex-direction: column; gap: 8px;">
                  <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--primary);"></div>
                  <strong style="font-size: 0.75rem; color: var(--primary); text-transform: uppercase;">Source C</strong>
                  <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; border-bottom: 1px dashed var(--border-glass); padding-bottom: 6px;">
                    <strong>Provenance:</strong> ${suite.sourceC.provenance}
                  </div>
                  <p style="font-style: italic; font-size: 0.85rem; line-height: 1.45; color: var(--text-base); margin: 0;">${suite.sourceC.content}</p>
                </div>
              </div>

              <!-- Interpretations Block -->
              <strong style="display: block; margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Interpretations for Q3b, Q3c & Q3d:</strong>
              <div class="paper3-interpretations-grid">
                <div class="skills-source-card" style="padding: 12px; background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative; display: flex; flex-direction: column; gap: 8px;">
                  <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--secondary);"></div>
                  <strong style="font-size: 0.75rem; color: var(--secondary); text-transform: uppercase;">Interpretation 1</strong>
                  <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; border-bottom: 1px dashed var(--border-glass); padding-bottom: 6px;">
                    <strong>Provenance:</strong> ${suite.interpretation1.provenance}
                  </div>
                  <p style="font-style: italic; font-size: 0.85rem; line-height: 1.45; color: var(--text-base); margin: 0;">${suite.interpretation1.content}</p>
                </div>
                <div class="skills-source-card" style="padding: 12px; background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative; display: flex; flex-direction: column; gap: 8px;">
                  <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--secondary);"></div>
                  <strong style="font-size: 0.75rem; color: var(--secondary); text-transform: uppercase;">Interpretation 2</strong>
                  <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; border-bottom: 1px dashed var(--border-glass); padding-bottom: 6px;">
                    <strong>Provenance:</strong> ${suite.interpretation2.provenance}
                  </div>
                  <p style="font-style: italic; font-size: 0.85rem; line-height: 1.45; color: var(--text-base); margin: 0;">${suite.interpretation2.content}</p>
                </div>
              </div>

              <!-- Student Draft Response Area -->
              <div class="hu-draft-section" style="margin-bottom: 16px; margin-top: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                  <strong style="color: var(--primary); font-size: 0.95rem;">Your Draft Response (Write answers to Q3a-d below):</strong>
                  <span class="hu-save-status" id="hu-save-status-${subtopicId}" style="font-size: 0.7rem; color: var(--success); opacity: 0.8; display: ${state.howUsefulAnswers && state.howUsefulAnswers[subtopicId] ? 'inline' : 'none'};"><i class="fa-solid fa-cloud-arrow-up"></i> Draft Saved</span>
                </div>
                
                <!-- Sentence Starters Dropdown -->
                <div style="margin-bottom: 10px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                  <label for="sentence-starter-${subtopicId}" style="font-size: 0.82rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
                    <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary);"></i> Sentence Starters:
                  </label>
                  <select id="sentence-starter-${subtopicId}" class="hu-starter-select" style="flex: 1; min-width: 220px; padding: 6px 10px; background: rgba(0, 0, 0, 0.25); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); color: var(--text-main); font-size: 0.82rem; cursor: pointer; outline: none; transition: border-color var(--transition-fast);">
                    <option value="" disabled selected>-- Select a sentence starter to insert --</option>
                    ${suite.sentenceStarters.map(st => `<option value="${st.value}">${st.label}</option>`).join('')}
                  </select>
                </div>

                <textarea class="hu-textarea" data-subtopic-id="${subtopicId}" placeholder="Draft your answers to Questions 3a, 3b, 3c, and 3d here. For example:\n\n[Q3a Draft]\n...\n\n[Q3b Draft]\n..." style="width: 100%; height: 250px; padding: 10px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); color: var(--text-base); font-size: 0.9rem; resize: vertical; line-height: 1.45; font-family: inherit; margin-bottom: 6px;">${state.howUsefulAnswers && state.howUsefulAnswers[subtopicId] ? state.howUsefulAnswers[subtopicId] : ''}</textarea>
              </div>

              <!-- Model Answer Reveal -->
              <div class="hu-model-answer-section" style="margin-top: 20px;">
                <button class="mastery-btn hu-reveal-btn" style="width: 100%; justify-content: center; background: var(--gradient-primary); border: none; color: white; padding: 12px; font-weight: bold; border-radius: var(--border-radius-sm); cursor: pointer; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-eye"></i> Compare with Examiner Model Answers
                </button>
                <div class="hu-model-answer-content" style="display: none; margin-top: 14px; padding: 16px; background: rgba(34, 197, 94, 0.05); border-left: 4px solid var(--success); border-radius: var(--border-radius-sm);">
                  <h4 style="margin: 0 0 10px 0; color: var(--success); font-size: 0.95rem;"><i class="fa-solid fa-circle-check"></i> Examiner Model Answer (Q3a to Q3d):</h4>
                  <div style="font-size: 0.9rem; line-height: 1.5; color: var(--text-muted); white-space: pre-line;">${highlightModelQuotes(suite.modelAnswer)}</div>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    `;
  } else if (data.howUsefulAnalyser) {
    const hu = data.howUsefulAnalyser;
    howUsefulHtml = `
      <style>
        details.how-useful-details summary::-webkit-details-marker {
          display: none;
        }
        details.how-useful-details[open] .how-useful-toggle-icon {
          transform: rotate(180deg);
        }
      </style>
      <div class="mastery-card how-useful-card" style="max-width: 800px; margin: 0 auto 24px auto; padding: 0;">
        <details class="how-useful-details" style="width: 100%; padding: 28px; box-sizing: border-box;">
          <summary class="how-useful-summary" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-weight: 700; user-select: none; outline: none; list-style: none; cursor: pointer; margin: 0; font-size: 1.15rem; color: var(--text-main);">
            <span style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-images" style="color: var(--primary);"></i> Exam Skill: The "How Useful" Analyser</span>
            <i class="fa-solid fa-chevron-down how-useful-toggle-icon" style="transition: transform 0.2s; font-size: 0.95rem; color: var(--text-muted);"></i>
          </summary>
          <div class="how-useful-expanded-content" style="margin-top: 16px;">
            <div class="mastery-card-body" style="font-size: 0.95rem;">
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
        </details>
      </div>
    `;
  }
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
          <ul style="margin: 4px 0 0 0; padding-left: 16px; color: var(--text-main); display: flex; flex-direction: column; gap: 4px;">
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
      <div class="mastery-card do-now-card" style="max-width: 800px; margin: 12px auto 24px auto; background: var(--bg-card); border: 1px solid var(--border-glass); border-left: 5px solid var(--accent); border-radius: var(--border-radius-lg); position: relative; padding: 16px 24px; box-shadow: var(--shadow-md); overflow: visible !important;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: var(--font-heading); outline: none; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-glass);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="background: var(--accent); color: #000; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.8px; box-shadow: var(--shadow-sm); display: inline-flex; align-items: center; gap: 4px;">
              ⚡ DO NOW starter <span style="font-size: 0.65rem; opacity: 0.75; font-weight: 700;">(5-10 MINS)</span>
            </span>
          </div>
        </div>
        
        <div class="mastery-card-body" style="padding-top: 0; margin: 0;">
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
                  <div id="hotspot-tooltip-card" style="display: none; margin-top: 10px; background: var(--bg-card); border: 1px solid var(--border-glass); padding: 8px 12px; border-radius: 4px; font-size: 0.8rem; line-height: 1.45; text-align: left; box-shadow: var(--shadow-sm);">
                    <strong style="color: var(--accent); display: block; font-size: 0.75rem; text-transform: uppercase;" id="hotspot-title">Hotspot Detail</strong>
                    <span id="hotspot-desc" style="color: var(--text-main);">Click a yellow hotspot dot on the image to inspect Content details...</span>
                  </div>
                  ` : ''}
                  <div class="do-now-provenance-box" style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500; font-style: normal; margin-top: 8px; text-align: left; background: var(--bg-card); border: 1px solid var(--border-glass); padding: 8px 12px; border-radius: var(--border-radius-sm); line-height: 1.45;">
                    <strong style="color: var(--primary); text-transform: uppercase; font-size: 0.68rem; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Source Provenance</strong> ${dn.provenance}
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
                  <strong style="color: var(--color-bronze); font-size: 0.82rem; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px;">Bronze Challenge (Recall - Last Lesson)</strong>
                  <p style="margin: 0; font-size: 0.88rem; line-height: 1.45; color: var(--text-main);">${dn.bronze}</p>
                </div>
                
                <!-- Silver Analyze -->
                <div style="position: relative; padding: 12px 14px 12px 46px; background: rgba(161, 161, 170, 0.02); border: 1px solid rgba(161, 161, 170, 0.12); border-left: 4px solid #a1a1aa; border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm);">
                  <div style="position: absolute; top: 12px; left: 12px; width: 22px; height: 22px; border-radius: 50%; background: #a1a1aa; color: #000; font-weight: 800; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">🥈</div>
                  <strong style="color: var(--color-silver); font-size: 0.82rem; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px;">Silver Challenge (Analyze - Source Inference)</strong>
                  <p style="margin: 0; font-size: 0.88rem; line-height: 1.45; color: var(--text-main);">${dn.silver}</p>
                </div>
                
                <!-- Gold Evaluate -->
                <div style="position: relative; padding: 12px 14px 12px 46px; background: rgba(251, 191, 36, 0.02); border: 1px solid rgba(251, 191, 36, 0.12); border-left: 4px solid #fbbf24; border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm);">
                  <div style="position: absolute; top: 12px; left: 12px; width: 22px; height: 22px; border-radius: 50%; background: #ffd700; color: #000; font-weight: 800; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">🥇</div>
                  <strong style="color: var(--color-gold); font-size: 0.82rem; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px;">Gold Challenge (Evaluate - Synoptic Link)</strong>
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
                  <strong style="color: var(--color-bronze); display: block; font-size: 0.82rem; margin-bottom: 2px;">🥉 Bronze Answer Recall:</strong>
                  <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem;">${dn.bronzeAnswer}</p>
                </div>
                <div style="padding: 10px 12px; background: rgba(161, 161, 170, 0.04); border-left: 3px solid #a1a1aa; border-radius: 4px;">
                  <strong style="color: var(--color-silver); display: block; font-size: 0.82rem; margin-bottom: 2px;">🥈 Silver Answer Analysis:</strong>
                  <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem;">${dn.silverAnswer}</p>
                </div>
                <div style="padding: 10px 12px; background: rgba(251, 191, 36, 0.04); border-left: 3px solid #fbbf24; border-radius: 4px;">
                  <strong style="color: var(--color-gold); display: block; font-size: 0.82rem; margin-bottom: 2px;">🥇 Gold Answer Evaluation:</strong>
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
    const questionsList = video.questions.map(q => `<li>${q}</li>`).join('');
    
    let primaryHtml = '';
    if (video.primary) {
      const cleanDuration = video.primary.duration.startsWith('0') ? video.primary.duration.slice(1) : video.primary.duration;
      primaryHtml = `
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
          <span style="font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent); background: var(--accent-glow); border: 1px solid rgba(244, 63, 94, 0.2); padding: 2px 6px; border-radius: 4px; font-family: var(--font-heading); white-space: nowrap;">2-Minute AI Overview</span>
          <p style="font-size: 0.88rem; line-height: 1.5; color: var(--text-main); margin: 0; flex: 1; min-width: 250px;">
            <i class="fa-brands fa-youtube" style="color: #ef4444; font-size: 1.05rem; margin-right: 4px; vertical-align: middle;"></i>
            Watch the 2-minute summary: 
            <a href="${video.primary.youtube_url}" class="lesson-video-link" data-url="${video.primary.youtube_url}" data-title="${video.primary.video_title.replace(/"/g, '&quot;')}" style="color: var(--primary); font-weight: bold; text-decoration: underline; transition: color var(--transition-fast);" onmouseover="this.style.color='var(--primary-hover)'" onmouseout="this.style.color='var(--primary)'">
              "${video.primary.video_title}"
            </a> (${cleanDuration} mins).
          </p>
        </div>
      `;
    }

    let secondaryHtml = '';
    if (video.secondary) {
      const cleanDuration = video.secondary.duration.startsWith('0') ? video.secondary.duration.slice(1) : video.secondary.duration;
      secondaryHtml = `
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span style="font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--primary); background: var(--primary-glow); border: 1px solid rgba(168, 85, 247, 0.2); padding: 2px 6px; border-radius: 4px; font-family: var(--font-heading); white-space: nowrap;">Deconstruct Deep Dive</span>
          <p style="font-size: 0.88rem; line-height: 1.5; color: var(--text-main); margin: 0; flex: 1; min-width: 250px;">
            <i class="fa-brands fa-youtube" style="color: #ef4444; font-size: 1.05rem; margin-right: 4px; vertical-align: middle;"></i>
            Study video: 
            <a href="${video.secondary.youtube_url}" class="lesson-video-link" data-url="${video.secondary.youtube_url}" data-title="${video.secondary.video_title.replace(/"/g, '&quot;')}" style="color: var(--primary); font-weight: bold; text-decoration: underline; transition: color var(--transition-fast);" onmouseover="this.style.color='var(--primary-hover)'" onmouseout="this.style.color='var(--primary)'">
              "${video.secondary.video_title}"
            </a> (${cleanDuration} mins) by ${video.secondary.production_source}.
          </p>
        </div>
      `;
    }

    videoHtml = `
      <div class="lesson-video-wrapper" style="margin-top: 14px; border-top: 1px dashed var(--border-glass); padding-top: 12px; display: flex; flex-direction: column; gap: 10px;">
        ${primaryHtml}
        ${secondaryHtml}
        
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
  if (isCoreMode) {
    lessonWrapUpHtml = renderCorePeelBuilder(subtopicId);
  } else {
    const wuChallenge = WRAPUP_DATA[subtopicId];
    if (wuChallenge) {
    const factCardsHtml = wuChallenge.facts.map(f => `
      <div class="wrapup-fact-card" draggable="true" data-fact-id="${f.id}">
        <i class="fa-solid fa-grip-vertical" style="color: var(--text-muted); cursor: grab; margin-top: 2px; flex-shrink: 0;"></i>
        <span class="wrapup-fact-text">${f.text}</span>
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
        .wrapup-cards-pool {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        .wrapup-fact-card {
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          font-size: 0.8rem;
          line-height: 1.45;
          color: var(--text-base);
          cursor: grab;
          user-select: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: flex-start;
          gap: 8px;
          box-shadow: var(--shadow-sm);
          box-sizing: border-box;
          min-height: 90px;
        }
        .wrapup-fact-card:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .wrapup-fact-card.selected {
          border-color: var(--accent);
          background: rgba(245, 158, 11, 0.08);
          box-shadow: 0 0 0 2px var(--accent);
        }
        .wrapup-fact-card.dragging {
          opacity: 0.4;
          transform: scale(0.95);
        }
        .wrapup-bucket {
          flex: 1;
          min-width: 280px;
          background: rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: var(--shadow-sm);
        }
        .wrapup-bucket.drag-over {
          border-color: var(--accent);
          background: rgba(245, 158, 11, 0.03);
          box-shadow: var(--shadow-md);
        }
        .wrapup-bucket-slots {
          min-height: 120px;
          border: 2px dashed rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: rgba(0, 0, 0, 0.08);
          transition: background 0.2s;
        }
        .wrapup-bucket.drag-over .wrapup-bucket-slots {
          background: rgba(245, 158, 11, 0.02);
          border-color: rgba(245, 158, 11, 0.3);
        }
        .wrapup-bucket-slots .wrapup-fact-card {
          min-height: auto;
          box-shadow: none;
          background: rgba(255, 255, 255, 0.01);
          transform: none;
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
          <div class="wrapup-cards-pool">
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
  }

  let hwHtml = '';
  const hwQuestions = HOMEWORK_QUESTIONS[subtopicId];
  if (hwQuestions && hwQuestions.length > 0) {
    const stepNodesHtml = hwQuestions.map((q, idx) => `
      <div class="journey-step-node ${idx === 0 ? 'active' : ''}" data-step-index="${idx}" style="position: relative; z-index: 2; width: 26px; height: 26px; border-radius: 50%; background: var(--bg-card); border: 2px solid ${idx === 0 ? 'var(--primary)' : 'var(--border-glass)'}; color: ${idx === 0 ? 'var(--primary)' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.2s;">
        ${idx + 1}
      </div>
    `).join('');

    const stepCardsHtml = hwQuestions.map((q, idx) => {
      const badgeClass = `badge-${q.type.toLowerCase().replace(/\s/g, '')}`;
      return `
        <div class="journey-paginated-card ${idx === 0 ? 'active' : ''}" data-step-index="${idx}" style="${idx === 0 ? 'display: block;' : 'display: none;'} background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border-glass); border-radius: var(--border-radius-md); padding: 16px; min-height: 140px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span class="journey-level-badge ${badgeClass}">Level ${q.level}: ${q.type}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="journey-tts-btn" data-step="${idx}" title="Read Question & Answer Guide Aloud" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; font-size: 0.9rem; transition: color var(--transition-fast);"><i class="fa-solid fa-volume-high"></i></button>
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Step ${idx + 1} of 10</span>
            </div>
          </div>
          <p style="margin: 0 0 12px 0; font-size: 0.92rem; font-weight: 500; color: var(--text-main); line-height: 1.45;">
            ${applyGlossaryTooltips(q.question)}
          </p>
          <div class="journey-answer-guide" style="max-height: 0; overflow: hidden; transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1); padding: 0 12px; background: rgba(0, 0, 0, 0.2); border-left: 3px solid var(--primary); border-radius: 0 3px 3px 0;">
            <span class="journey-answer-title" style="font-size: 0.72rem; font-weight: bold; text-transform: uppercase; color: var(--primary); margin-bottom: 4px; display: block; padding-top: 8px;">🛡️ Answer Guide:</span>
            <p class="journey-answer-text" style="margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; padding-bottom: 8px;">
              ${applyGlossaryTooltips(q.answer)}
            </p>
          </div>
        </div>
      `;
    }).join('');

    hwHtml = `
      <div class="mastery-card homework-questions-card" style="max-width: 800px; margin: 0 auto 24px auto; border-left: 4px solid var(--primary); background: rgba(0, 0, 0, 0.15);">
        <h3 class="mastery-card-title"><i class="fa-solid fa-shield-halved" style="color: var(--primary);"></i> 🛡️ 10-Step Unit Mastery Journey</h3>
        <div class="mastery-card-body" style="padding-top: 6px;">
          <p style="font-style: italic; margin-top: 0; margin-bottom: 20px; color: var(--text-muted); font-size: 0.82rem;">
            Missed this lesson or need a thorough refresh? Work through these 10 structured steps (from basic recall to expert challenge) to master this unit!
          </p>
          
          <!-- Step Indicator Navigation Bar -->
          <div class="mastery-journey-steps-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: relative; padding: 0 4px;">
            <div class="steps-bar-line" style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: var(--border-glass); z-index: 1; transform: translateY(-50%);"></div>
            ${stepNodesHtml}
          </div>

          <!-- Active Step Card Content -->
          <div class="mastery-journey-content-wrapper" style="position: relative; z-index: 2;">
            ${stepCardsHtml}
          </div>

          <!-- Action Navigation Buttons -->
          <div class="mastery-journey-actions" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; border-top: 1px solid var(--border-glass); padding-top: 14px;">
            <button class="mastery-btn journey-prev-btn" style="padding: 6px 14px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-glass); color: var(--text-muted); cursor: not-allowed; border-radius: 4px; opacity: 0.5;" disabled>
              <i class="fa-solid fa-arrow-left"></i> Previous
            </button>
            <button class="mastery-btn journey-reveal-answer-btn" style="padding: 6px 14px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; background: rgba(56, 189, 248, 0.1); border: 1px solid var(--primary); color: var(--primary); cursor: pointer; border-radius: 4px;">
              <i class="fa-solid fa-eye"></i> Reveal Answer
            </button>
            <button class="mastery-btn journey-next-btn" style="padding: 6px 14px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; background: rgba(56, 189, 248, 0.2); border: 1px solid var(--primary); color: #fff; cursor: pointer; border-radius: 4px;">
              Next <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <!-- Keyboard Shortcuts Info -->
          <div class="desktop-only lesson-keyboard-help" style="margin-top: 12px; text-align: center; font-size: 0.68rem; color: var(--text-muted); opacity: 0.75; display: flex; justify-content: center; gap: 10px; width: 100%;">
            <span><kbd style="background: rgba(255,255,255,0.08); padding: 1px 4px; border-radius: 3px; border: 1px solid var(--border-glass);">← / →</kbd> Prev/Next</span>
            <span><kbd style="background: rgba(255,255,255,0.08); padding: 1px 4px; border-radius: 3px; border: 1px solid var(--border-glass);">Space</kbd> Reveal Answer</span>
            <span><kbd style="background: rgba(255,255,255,0.08); padding: 1px 4px; border-radius: 3px; border: 1px solid var(--border-glass);">1-0</kbd> Jump to Step</span>
          </div>
        </div>
      </div>
    `;
  }



  let mapHtml = '';
  if (data.mapConfig) {
    mapHtml = `
      <div class="mastery-card lesson-map-card collapsed" style="max-width: 800px; margin: 0 auto 24px auto; border-left: 4px solid var(--primary); background: rgba(0, 0, 0, 0.15);">
        <h3 class="mastery-card-title lesson-map-toggle-header" style="display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 1rem; color: var(--primary); margin: 0; padding: 12px 16px; cursor: pointer; user-select: none; transition: background 0.2s;">
          <span style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-map-location-dot"></i> Interactive Lesson Map: ${data.mapConfig.title}</span>
          <span class="map-toggle-icon" style="transition: transform 0.3s; display: inline-block;"><i class="fa-solid fa-chevron-down"></i></span>
        </h3>
        <div class="mastery-card-body lesson-map-body" style="padding: 16px; padding-top: 4px; display: none;">
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

  // Generate Embedded Exam Questions HTML
  let embeddedExamsHtml = '';
  const mappedExams = SUBTOPIC_EXAM_MAPPING[subtopicId];
  if (mappedExams && mappedExams.length > 0) {
    let dropdownsMarkup = '';
    const processedMappedExams = groupMappedExams(mappedExams);
    processedMappedExams.forEach(item => {
      const paper = PAST_PAPERS_DATA.find(p => p.id === item.paperId);
      if (!paper) return;
      
      if (item.qType === 'q3_suite') {
        // Display both sources and both interpretations once and once only
        let sourcesHtml = '';
        if (paper.sourceB && paper.sourceC && paper.interpretation1 && paper.interpretation2) {
          sourcesHtml = `
            <strong style="display: block; margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Sources B & C:</strong>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 14px; margin-bottom: 24px;">
              <div class="skills-source-card" style="padding: 16px; background: rgba(0, 0, 0, 0.12); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
                <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--primary);"></div>
                <span class="badge" style="background: var(--primary-glow); color: var(--primary); padding: 2px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display: inline-block;">SOURCE B</span>
                <p style="font-size: 0.8rem; font-weight: bold; color: var(--text-main); margin-bottom: 8px; line-height: 1.35;">${paper.sourceB.provenance}</p>
                ${paper.sourceB.image ? `
                  <img src="${paper.sourceB.image}" alt="${paper.sourceB.provenance}" class="exam-source-img" style="max-width: 100%; max-height: 150px; object-fit: contain; margin-bottom: 8px; border-radius: 4px;" />
                ` : ''}
                <p style="font-size: 0.88rem; font-style: italic; line-height: 1.5; color: var(--text-muted); margin: 0;">${paper.sourceB.content}</p>
              </div>
              <div class="skills-source-card" style="padding: 16px; background: rgba(0, 0, 0, 0.12); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
                <div style="position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--primary);"></div>
                <span class="badge" style="background: var(--primary-glow); color: var(--primary); padding: 2px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display: inline-block;">SOURCE C</span>
                <p style="font-size: 0.8rem; font-weight: bold; color: var(--text-main); margin-bottom: 8px; line-height: 1.35;">${paper.sourceC.provenance}</p>
                ${paper.sourceC.image ? `
                  <img src="${paper.sourceC.image}" alt="${paper.sourceC.provenance}" class="exam-source-img" style="max-width: 100%; max-height: 150px; object-fit: contain; margin-bottom: 8px; border-radius: 4px;" />
                ` : ''}
                <p style="font-size: 0.88rem; font-style: italic; line-height: 1.5; color: var(--text-muted); margin: 0;">${paper.sourceC.content}</p>
              </div>
            </div>
            <strong style="display: block; margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Interpretations 1 & 2:</strong>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 14px; margin-bottom: 24px;">
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
          `;
        }

        const qId = `${paper.id}_q3_suite`;

        // Questions list HTML
        let questionsListHTML = `
          <div style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px;">
        `;
        if (paper.q3a) {
          questionsListHTML += `
            <div style="border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">
              <span style="font-weight: bold; color: var(--primary);">Question 3a (8 Marks):</span>
              <span style="color: var(--text-main); font-size: 0.95rem;">${paper.q3a.question.replace(/\(8\s*marks?\)/gi, '').trim()}</span>
              <p style="font-style: italic; font-size: 0.82rem; color: var(--text-muted); margin-top: 4px; margin-bottom: 0;">
                Explain your answer, using Sources B and C and your own knowledge of the historical context.
              </p>
            </div>
          `;
        }
        if (paper.q3b) {
          questionsListHTML += `
            <div style="border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">
              <span style="font-weight: bold; color: var(--primary);">Question 3b (4 Marks):</span>
              <span style="color: var(--text-main); font-size: 0.95rem;">${paper.q3b.question.replace(/\(4\s*marks?\)/gi, '').trim()}</span>
              <p style="font-style: italic; font-size: 0.82rem; color: var(--text-muted); margin-top: 4px; margin-bottom: 0;">
                Explain your answer, using details from both interpretations.
              </p>
            </div>
          `;
        }
        if (paper.q3c) {
          questionsListHTML += `
            <div style="border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">
              <span style="font-weight: bold; color: var(--primary);">Question 3c (4 Marks):</span>
              <span style="color: var(--text-main); font-size: 0.95rem;">${paper.q3c.question.replace(/\(4\s*marks?\)/gi, '').trim()}</span>
              <p style="font-style: italic; font-size: 0.82rem; color: var(--text-muted); margin-top: 4px; margin-bottom: 0;">
                Explain your answer, using both interpretations and written sources.
              </p>
            </div>
          `;
        }
        if (paper.q3d) {
          questionsListHTML += `
            <div>
              <span style="font-weight: bold; color: var(--primary);">Question 3d (16 + 4 SPaG Marks):</span>
              <span style="color: var(--text-main); font-size: 0.95rem;">${paper.q3d.question.replace(/\(16\s*marks?\)/gi, '').replace(/\(16\+4\s*marks?\)/gi, '').trim()}</span>
              <p style="font-style: italic; font-size: 0.82rem; color: var(--text-muted); margin-top: 4px; margin-bottom: 0;">
                Explain your answer, using both interpretations and your own knowledge of the historical context.
              </p>
            </div>
          `;
        }
        questionsListHTML += `</div>`;

        // Scaffold templates
        const scaffoldBtn = `
          <button class="btn-secondary btn-blue-variant" id="past-btn-scaffold-${qId}" style="flex: 1; min-width: 130px; font-size: 0.85rem; padding: 8px 12px;">
            <i class="fa-solid fa-pen-fancy"></i> Writing Scaffolds
          </button>
        `;

        const scaffoldBoxHTML = `
          <div class="past-scaffold-box" id="past-scaffold-box-${qId}" style="display: none; margin-top: 15px; padding: 15px; background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: var(--border-radius-sm);">
            <div style="margin-bottom: 16px;">
              <strong>Q3b Main Difference (4 Marks) Formula:</strong><br>1. State the main difference in their overall view.<br>2. Quote/detail from Interpretation 1.<br>3. Quote/detail from Interpretation 2.
              <div class="scaffold-starters" style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                <button class="scaffold-starter-btn" data-starter="The main difference is that Interpretation 1 argues that...">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> The main difference is that Interpretation 1 argues that...
                </button>
                <button class="scaffold-starter-btn" data-starter="This is shown when Interpretation 1 states...">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> This is shown when Interpretation 1 states...
                </button>
                <button class="scaffold-starter-btn" data-starter="In contrast, Interpretation 2 suggests that...">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> In contrast, Interpretation 2 suggests that...
                </button>
                <button class="scaffold-starter-btn" data-starter="This is shown when Interpretation 2 states...">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> This is shown when Interpretation 2 states...
                </button>
              </div>
            </div>
            <div style="margin-bottom: 16px; border-top: 1px solid var(--border-glass); padding-top: 16px;">
              <strong>Q3c Reason for Difference (4 Marks) Formula (Crucial for Full Marks):</strong><br>1. State that the interpretations differ because they used different sources (Interpretation 1 uses Source B, whereas Interpretation 2 uses Source C).<br>2. Quote Interpretation 1 AND Source B to show how they support each other.<br>3. Quote Interpretation 2 AND Source C to show how they support each other.<br><em>*Note: You MUST quote both interpretations and both sources to get full marks!</em>
              <div class="scaffold-starters" style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                <button class="scaffold-starter-btn" data-starter="The interpretations differ because the historians have used different sources: Interpretation 1 has used Source B, whereas Interpretation 2 has used Source C.">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> The interpretations differ because they used different sources...
                </button>
                <button class="scaffold-starter-btn" data-starter="Interpretation 1 argues that '[quote Interpretation 1]', which is supported by Source B stating '[quote Source B]'.">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> Interpretation 1 argues that... supported by Source B...
                </button>
                <button class="scaffold-starter-btn" data-starter="In contrast, Interpretation 2 argues that '[quote Interpretation 2]', which is supported by Source C stating '[quote Source C]'.">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> In contrast, Interpretation 2 argues that... supported by Source C...
                </button>
              </div>
            </div>
            <div style="border-top: 1px solid var(--border-glass); padding-top: 16px;">
              <strong>Q3d Evaluation Essay (16+4 Marks) Formula:</strong><br>1. Support Interpretation 2 using own knowledge.<br>2. Support Interpretation 1 using own knowledge.<br>3. Conclude with judgment.
              <div class="scaffold-starters" style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                <button class="scaffold-starter-btn" data-starter="I agree with Interpretation 2 to a large extent because...">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> I agree with Interpretation 2 to a large extent because...
                </button>
                <button class="scaffold-starter-btn" data-starter="My own knowledge confirms that...">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> My own knowledge confirms that...
                </button>
                <button class="scaffold-starter-btn" data-starter="This supports Interpretation 2's view that...">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> This supports Interpretation 2's view that...
                </button>
                <button class="scaffold-starter-btn" data-starter="However, Interpretation 1 is also valid in highlighting that...">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> However, Interpretation 1 is also valid in highlighting that...
                </button>
                <button class="scaffold-starter-btn" data-starter="Overall, I find Interpretation 2 more convincing because...">
                  <i class="fa-solid fa-plus" style="margin-right: 6px; font-size: 0.75rem;"></i> Overall, I find Interpretation 2 more convincing because...
                </button>
              </div>
            </div>
          </div>
        `;

        const questionMarkup = `
          <div class="exam-question-block" id="exam-q-block-${qId}">
            <div class="exam-question-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 12px;">
              <div style="flex: 1;">
                <h5 class="exam-question-title" style="margin: 0; font-size: 1.05rem; line-height: 1.4;">Section B Enquiry Questions (Q3a-d)</h5>
              </div>
              <span class="exam-question-marks" style="flex-shrink: 0; background: var(--primary-glow); color: var(--primary); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">32 Marks Total</span>
            </div>

            ${questionsListHTML}

            <textarea class="exam-textarea" id="past-textarea-${qId}" placeholder="Draft your answers for Q3a, Q3b, Q3c, and Q3d here..." style="min-height: 250px;"></textarea>

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
                  <strong>Key Terms:</strong>
                  <div class="feedback-tags" id="keyword-tags-${qId}"></div>
                </div>
              </div>
            </div>

            <div class="exam-sheet-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="btn-secondary" id="past-btn-clue-${qId}" style="flex: 1; min-width: 130px; font-size: 0.85rem; padding: 8px 12px;">
                <i class="fa-solid fa-lightbulb"></i> Educator Clues
              </button>
              ${scaffoldBtn}
              <button class="btn-primary" id="past-btn-check-${qId}" style="flex: 2; min-width: 180px; font-size: 0.85rem; padding: 8px 12px;">
                <i class="fa-solid fa-clipboard-check"></i> Self-Check Answers
              </button>
            </div>

            <div class="past-clue-box" id="past-clue-box-${qId}" style="display: none; padding: 12px; background: rgba(255,255,255,0.03); border-radius: var(--border-radius-sm); border: 1px dashed var(--border-glass); margin-top: 15px;">
              <div style="margin-bottom: 8px;"><strong>Q3a Clue (Source Utility):</strong> ${paper.q3a.clue}</div>
              <div style="margin-bottom: 8px;"><strong>Q3b Clue (Interpretations Difference):</strong> ${paper.q3b.clue}</div>
              <div style="margin-bottom: 8px;"><strong>Q3c Clue (Interpretations Difference Reason):</strong> ${paper.q3c.clue}</div>
              <div><strong>Q3d Clue (Interpretations Evaluation):</strong> ${paper.q3d.clue}</div>
            </div>

            ${scaffoldBoxHTML}

            <div class="past-model-answer" id="past-answer-box-${qId}" style="display: none; margin-top: 15px; padding: 15px; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--border-radius-sm);">
              <div class="past-model-answer-title" style="font-weight: 700; color: #10b981; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-star"></i> Level 3/4 Model Answers Suite
              </div>
              
              <div style="margin-bottom: 16px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">
                <strong style="color: var(--primary); display: block; margin-bottom: 6px;">Q3a Model Answer (Source Utility):</strong>
                <div class="past-model-answer-content" style="white-space: pre-line; line-height: 1.5; font-size: 0.9rem;">${highlightModelQuotes(paper.q3a.model)}</div>
                <div class="model-answer-key" style="margin-top: 8px;">
                  <span class="model-key-title">Key:</span>
                  <span class="model-key-item"><span class="model-key-dot" style="background-color: #f97316;"></span> Source Quotes</span>
                  <span class="model-key-item"><span class="model-key-dot" style="border-bottom: 2px dotted #10b981; border-radius: 0; width: 12px; height: 4px; margin-top: -4px; background: transparent;"></span> Contextual Knowledge</span>
                  <span class="model-key-item"><span class="model-key-dot" style="background-color: #a855f7;"></span> Provenance</span>
                </div>
              </div>

              <div style="margin-bottom: 16px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">
                <strong style="color: var(--primary); display: block; margin-bottom: 6px;">Q3b Model Answer (Interpretations Difference):</strong>
                <div class="past-model-answer-content" style="white-space: pre-line; line-height: 1.5; font-size: 0.9rem;">${highlightModelQuotes(paper.q3b.model)}</div>
                <div class="model-answer-key" style="margin-top: 8px;">
                  <span class="model-key-title">Key:</span>
                  <span class="model-key-item"><span class="model-key-dot" style="background-color: #3b82f6;"></span> Interpretation Quotes</span>
                </div>
              </div>

              <div style="margin-bottom: 16px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">
                <strong style="color: var(--primary); display: block; margin-bottom: 6px;">Q3c Model Answer (Interpretations Difference Reason):</strong>
                <div class="past-model-answer-content" style="white-space: pre-line; line-height: 1.5; font-size: 0.9rem;">${highlightModelQuotes(paper.q3c.model)}</div>
                <div class="model-answer-key" style="margin-top: 8px;">
                  <span class="model-key-title">Key:</span>
                  <span class="model-key-item"><span class="model-key-dot" style="background-color: #f97316;"></span> Source Quotes</span>
                  <span class="model-key-item"><span class="model-key-dot" style="background-color: #3b82f6;"></span> Interpretation Quotes</span>
                </div>
              </div>

              <div>
                <strong style="color: var(--primary); display: block; margin-bottom: 6px;">Q3d Model Answer (Interpretations Evaluation):</strong>
                <div class="past-model-answer-content" style="white-space: pre-line; line-height: 1.5; font-size: 0.9rem;">${highlightModelQuotes(paper.q3d.model)}</div>
                <div class="model-answer-key" style="margin-top: 8px;">
                  <span class="model-key-title">Key:</span>
                  <span class="model-key-item"><span class="model-key-dot" style="background-color: #3b82f6;"></span> Interpretation Quotes</span>
                  <span class="model-key-item"><span class="model-key-dot" style="border-bottom: 2px dotted #10b981; border-radius: 0; width: 12px; height: 4px; margin-top: -4px; background: transparent;"></span> Contextual Knowledge</span>
                  <span class="model-key-item"><span class="model-key-dot" style="background-color: #a855f7;"></span> Judgment</span>
                </div>
              </div>
            </div>

            <label class="completion-check-row">
              <input type="checkbox" id="past-chk-${qId}">
              Mark this question suite as complete
            </label>
          </div>
        `;

        dropdownsMarkup += `
          <div class="mastery-card lesson-exam-practice-card" style="max-width: 800px; margin: 0 auto 24px auto; padding: 0;">
            <details class="lesson-exam-details" style="width: 100%; padding: 24px; box-sizing: border-box;">
              <summary class="lesson-exam-summary" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-weight: 700; user-select: none; outline: none; list-style: none; cursor: pointer; margin: 0; font-size: 1.1rem; color: var(--text-main);">
                <span style="display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-graduation-cap" style="color: var(--primary);"></i>
                  Exam Practice (${item.yearLabel}): ${item.label}
                </span>
                <i class="fa-solid fa-chevron-down lesson-exam-toggle-icon" style="transition: transform 0.2s; font-size: 0.95rem; color: var(--text-muted);"></i>
              </summary>
              <div class="lesson-exam-expanded-content" style="margin-top: 16px;">
                ${sourcesHtml}
                ${questionMarkup}
              </div>
            </details>
          </div>
        `;
      } else {
        const qObj = paper[item.qType];
        if (!qObj) return;

        // Clean trailing marks suffix from question title
        const cleanQuestionText = qObj.question.replace(/\(\d+\s*marks?\)/gi, '').trim();

        // Render sources if any
        let sourcesHtml = '';
        if (item.qType === 'q1' && paper.sourceA) {
          sourcesHtml = `
            <div class="skills-source-card" style="padding: 20px; background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); margin-bottom: 24px; position: relative;">
              <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--primary);"></div>
              <span class="badge" style="background: var(--primary-glow); color: var(--primary); padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; display: inline-block; margin-bottom: 8px;">SOURCE A</span>
              ${paper.sourceA.image ? `
                <div class="source-split-container">
                  <div class="source-image-column">
                    <img src="${paper.sourceA.image}" alt="${paper.sourceA.provenance}" class="exam-source-img" style="max-width: 100%; max-height: 250px; object-fit: contain; border-radius: 4px;" />
                  </div>
                  <div class="source-text-column">
                    <p style="font-size: 0.82rem; font-weight: bold; color: var(--text-main); margin: 0 0 10px 0; line-height: 1.4;"><strong>Provenance:</strong> ${paper.sourceA.provenance}</p>
                    <div style="font-size: 0.95rem; font-style: italic; line-height: 1.6; color: var(--text-muted); border-left: 2px solid var(--border-glass); padding-left: 12px;">${paper.sourceA.content}</div>
                  </div>
                </div>
              ` : `
                <p style="font-size: 0.82rem; font-weight: bold; color: var(--text-main); margin-bottom: 10px; line-height: 1.4;">${paper.sourceA.provenance}</p>
                <div style="font-size: 0.95rem; font-style: italic; line-height: 1.6; color: var(--text-muted); border-left: 2px solid var(--border-glass); padding-left: 12px; margin-top: 10px;">${paper.sourceA.content}</div>
              `}
            </div>
          `;
        }

        const qId = `${paper.id}_${item.qType}`;
        const marks = item.qType === 'q1' ? '4' : (item.qType === 'q2' ? '12' : (item.qType === 'q3a' ? '8' : (item.qType === 'q3b' ? '4' : (item.qType === 'q3c' ? '4' : '16 + 4 SPaG'))));
        const stimulus = item.qType === 'q2' ? qObj.stimulus : null;
        const questionMarkup = renderPastQuestionMarkup(qId, qObj.question, qObj.clue, qObj.model, marks, stimulus);

        // Label with year or mock in brackets
        const yearOrMockLabel = item.yearLabel;

        dropdownsMarkup += `
          <div class="mastery-card lesson-exam-practice-card" style="max-width: 800px; margin: 0 auto 24px auto; padding: 0;">
            <details class="lesson-exam-details" style="width: 100%; padding: 24px; box-sizing: border-box;">
              <summary class="lesson-exam-summary" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-weight: 700; user-select: none; outline: none; list-style: none; cursor: pointer; margin: 0; font-size: 1.1rem; color: var(--text-main);">
                <span style="display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-graduation-cap" style="color: var(--primary);"></i>
                  Exam Practice (${yearOrMockLabel}): ${item.label} - ${cleanQuestionText}
                </span>
                <i class="fa-solid fa-chevron-down lesson-exam-toggle-icon" style="transition: transform 0.2s; font-size: 0.95rem; color: var(--text-muted);"></i>
              </summary>
              <div class="lesson-exam-expanded-content" style="margin-top: 16px;">
                ${sourcesHtml}
                ${questionMarkup}
              </div>
            </details>
          </div>
        `;
      }
    });


    embeddedExamsHtml = `
      <style>
        details.lesson-exam-details summary::-webkit-details-marker {
          display: none;
        }
        details.lesson-exam-details[open] .lesson-exam-toggle-icon {
          transform: rotate(180deg);
        }
      </style>
      <div class="lesson-embedded-exams-container" style="margin-top: 24px;">
        <h4 style="max-width: 800px; margin: 0 auto 16px auto; font-family: var(--font-heading); color: var(--text-main); font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-pen-fancy" style="color: var(--primary);"></i> Exam Practice Vault
        </h4>
        ${dropdownsMarkup}
      </div>
    `;
  }

  let wrappedDoNowHtml = '';
  if (doNowHtml) {
    wrappedDoNowHtml = `
      <div class="do-now-collapsible-wrapper" style="max-width: 800px; margin: 18px auto 24px auto;">
        <div class="do-now-toggle-header" style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all var(--transition-fast); user-select: none;">
          <span style="font-family: var(--font-heading); font-size: 0.88rem; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-bolt"></i> Do Now Task (Click to Reveal)
          </span>
          <i class="fa-solid fa-chevron-down" style="color: var(--text-muted); font-size: 0.8rem; transition: transform 0.2s;"></i>
        </div>
        <div class="do-now-content-wrapper" style="display: none; margin-top: 12px;">
          ${doNowHtml}
        </div>
      </div>
    `;
  }

  const masteredBtnLabel = isCoreMode 
    ? `<i class="fa-solid fa-check"></i> Mark Topic ${subtopicId.replace('subtopic_', '').replace('_', '.')} as Completed` 
    : `<i class="fa-solid fa-check"></i> Mark Topic ${subtopicId.replace('subtopic_', '').replace('_', '.')} as Mastered`;

  // Set the container innerHTML
  container.innerHTML = `
    ${wrappedDoNowHtml}
    ${levelSelectorHtml}
    
    <!-- Header Card -->
    <div class="mastery-header-card" style="max-width: 800px; margin: 0 auto 24px auto;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 12px; flex-wrap: wrap;">
        <h2 class="mastery-header-title" style="margin: 0; flex: 1; min-width: 250px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
          <span>${data.headerTitle}</span>
          <button class="btn-audio-read" data-text-selector=".mastery-header-intro" title="Read Introduction Aloud">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </h2>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          ${subtopicId ? `
          <button class="mastery-btn print-workbook-btn" data-subtopic="${subtopicId}" style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #10b981; font-weight: bold; font-size: 0.8rem; padding: 6px 12px; border-radius: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; margin-top: 4px;">
            <i class="fa-solid fa-print"></i> Print Lesson Workbook
          </button>
          <button class="mastery-btn view-worksheet-page-btn" data-subtopic="${subtopicId}" style="background: rgba(249, 115, 22, 0.1); border: 1px solid #f97316; color: #f97316; font-weight: bold; font-size: 0.8rem; padding: 6px 12px; border-radius: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; margin-top: 4px;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Lesson Worksheet Page
          </button>
          ` : ''}
        </div>
      </div>
      <p class="mastery-header-intro" style="margin-bottom: 16px;">
        ${applyGlossaryTooltips(data.headerIntro)}
      </p>
      ${renderSpecChecklistCard(subtopicId, SPEC_CHECKLIST_DATA[subtopicId])}
      ${videoHtml}
    </div>

    ${coreSupportHtml}

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
    <div class="mastered-button-wrapper" style="max-width: 800px; margin: 0 auto 40px auto; padding: 0 10px;">
      <button class="mastery-btn mastery-btn-success" id="btn-mark-mastery-mastered">
        ${masteredBtnLabel}
      </button>
    </div>

    ${embeddedExamsHtml}
  `;

  // Level Switcher Toggle (bound early to prevent any subsequent errors from blocking mode switches)
  container.querySelectorAll('.level-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const level = btn.getAttribute('data-level');
      AudioEngine.play('click');
      state.studyLevel = level;
      renderMasteryView(subtopicId);
    });
  });

  // Collapsible Lesson Map
  const mapToggleHeader = container.querySelector('.lesson-map-toggle-header');
  const mapBody = container.querySelector('.lesson-map-body');
  const mapToggleIcon = container.querySelector('.map-toggle-icon');
  if (mapToggleHeader && mapBody) {
    mapToggleHeader.addEventListener('click', () => {
      AudioEngine.play('click');
      const isCollapsed = mapBody.style.display === 'none' || mapBody.style.display === '';
      if (isCollapsed) {
        mapBody.style.display = 'block';
        if (mapToggleIcon) {
          mapToggleIcon.style.transform = 'rotate(180deg)';
        }
        // Recalculate map container sizes
        setTimeout(() => {
          if (window.activeLeafletMaps && window.activeLeafletMaps[subtopicId]) {
            window.activeLeafletMaps[subtopicId].invalidateSize();
          }
          window.dispatchEvent(new Event('resize'));
        }, 150);
      } else {
        mapBody.style.display = 'none';
        if (mapToggleIcon) {
          mapToggleIcon.style.transform = 'rotate(0deg)';
        }
      }
    });
  }

  // Pull revision/mind-map task boxes out of split layouts to span full-width
  container.querySelectorAll('.mastery-split-layout').forEach(splitLayout => {
    const taskBox = splitLayout.querySelector('.revision-task-box, .mind-map-task-box');
    if (taskBox) {
      splitLayout.parentNode.insertBefore(taskBox, splitLayout.nextSibling);
      taskBox.style.width = '100%';
      taskBox.style.boxSizing = 'border-box';
      taskBox.style.marginTop = '20px';
    }
  });

  // Bind Core Step Quiz Option Buttons
  container.querySelectorAll('.core-quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const questionBlock = btn.closest('.core-quiz-question-block');
      if (!questionBlock) return;
      
      const isCorrect = btn.getAttribute('data-is-correct') === 'true';
      const allButtons = questionBlock.querySelectorAll('.core-quiz-option-btn');
      
      if (isCorrect) {
        AudioEngine.play('success');
        
        btn.style.borderColor = 'var(--success)';
        btn.style.background = 'rgba(16, 185, 129, 0.1)';
        const icon = btn.querySelector('.option-icon');
        if (icon) {
          icon.style.borderColor = 'var(--success)';
          icon.style.background = 'var(--success)';
          icon.style.color = '#fff';
          icon.innerHTML = '<i class="fa-solid fa-check"></i>';
        }
        
        allButtons.forEach(b => {
          b.disabled = true;
          b.style.cursor = 'not-allowed';
          b.style.opacity = '0.6';
        });
        btn.style.opacity = '1';
        
        const feedback = questionBlock.querySelector('.core-quiz-feedback');
        if (feedback) {
          feedback.style.display = 'block';
        }
        
        addXp(2);
      } else {
        AudioEngine.play('error');
        
        btn.style.borderColor = 'var(--accent)';
        btn.style.background = 'rgba(244, 63, 94, 0.1)';
        const icon = btn.querySelector('.option-icon');
        if (icon) {
          icon.style.borderColor = 'var(--accent)';
          icon.style.background = 'var(--accent)';
          icon.style.color = '#000';
          icon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        }
        
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.6';
      }
    });
  });

  // Bind Core Mode Interactive Tasks & PEEL Builder
  bindCoreStepInteractiveTasks(container, subtopicId);
  bindCorePeelBuilder(container, subtopicId);
  bindCoreScaffoldQuestions(container, subtopicId);

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
        addXp(2);

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
              addXp(15);
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
        if (!card.classList.contains('perspective-explored')) {
          card.classList.add('perspective-explored');
          addXp(3);
        }

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
      if (!flipCard.classList.contains('card-flipped-once')) {
        flipCard.classList.add('card-flipped-once');
        addXp(3);
      }
    });
  }

  // Homework Journey Step Paginated Switcher
  const stepsContainer = container.querySelector('.homework-questions-card');
  if (stepsContainer) {
    let currentStep = 0;
    const stepNodes = stepsContainer.querySelectorAll('.journey-step-node');
    const stepCards = stepsContainer.querySelectorAll('.journey-paginated-card');
    const prevBtn = stepsContainer.querySelector('.journey-prev-btn');
    const nextBtn = stepsContainer.querySelector('.journey-next-btn');
    const revealBtn = stepsContainer.querySelector('.journey-reveal-answer-btn');

    function updateStepUI(index) {
      currentStep = index;
      AudioEngine.play('click');

      // Award XP for viewing the slide for the first time
      const slideKey = `${state.selectedSubtopicId || 'unknown'}_${index}`;
      if (!viewedSlides.has(slideKey)) {
        viewedSlides.add(slideKey);
        addXp(5);
      }

      // Update nodes
      stepNodes.forEach((node, idx) => {
        node.classList.remove('active');
        node.style.borderColor = 'var(--border-glass)';
        node.style.color = 'var(--text-muted)';
        node.style.background = 'var(--bg-card)';
        
        if (idx === currentStep) {
          node.classList.add('active');
          node.style.borderColor = 'var(--primary)';
          node.style.color = 'var(--primary)';
          node.style.background = 'rgba(56, 189, 248, 0.08)';
        } else if (idx < currentStep) {
          // Completed steps colored slightly
          node.style.borderColor = 'var(--success)';
          node.style.color = 'var(--success)';
          node.style.background = 'rgba(34, 197, 94, 0.05)';
        }
      });

      // Update cards
      stepCards.forEach((card, idx) => {
        if (idx === currentStep) {
          card.style.display = 'block';
          // Keep answer hidden initially when switching to a new step
          const answerGuide = card.querySelector('.journey-answer-guide');
          if (answerGuide) {
            answerGuide.style.maxHeight = '0px';
            answerGuide.style.paddingTop = '0px';
            answerGuide.style.paddingBottom = '0px';
          }
        } else {
          card.style.display = 'none';
        }
      });

      // Update buttons
      if (currentStep === 0) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
      } else {
        prevBtn.disabled = false;
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
      }

      if (currentStep === stepCards.length - 1) {
        nextBtn.innerHTML = 'Finish <i class="fa-solid fa-circle-check" style="margin-left: 4px; color: var(--success);"></i>';
      } else {
        nextBtn.innerHTML = 'Next <i class="fa-solid fa-arrow-right"></i>';
      }
      
      revealBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Reveal Answer';
      revealBtn.style.background = 'rgba(56, 189, 248, 0.1)';
      revealBtn.style.color = 'var(--primary)';
      revealBtn.style.borderColor = 'var(--primary)';
    }

    // Bind Node Clicks
    stepNodes.forEach((node, idx) => {
      node.addEventListener('click', () => updateStepUI(idx));
    });

    // Bind Prev/Next Clicks
    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        updateStepUI(currentStep - 1);
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentStep < stepCards.length - 1) {
        updateStepUI(currentStep + 1);
      } else {
        AudioEngine.play('success');
        alert("🎉 Congratulations! You have completed the 10-Step Unit Mastery Journey!");
      }
    });

    // Bind Reveal Click
    revealBtn.addEventListener('click', () => {
      const activeCard = stepCards[currentStep];
      const answerGuide = activeCard.querySelector('.journey-answer-guide');
      if (answerGuide) {
        const isRevealed = answerGuide.style.maxHeight && answerGuide.style.maxHeight !== '0px';
        if (isRevealed) {
          AudioEngine.play('click');
          answerGuide.style.maxHeight = '0px';
          revealBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Reveal Answer';
        } else {
          AudioEngine.play('success');
          answerGuide.style.maxHeight = '1000px';
          revealBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Answer';
        }
      }
    });

    // Bind TTS Button Click
    const ttsButtons = stepsContainer.querySelectorAll('.journey-tts-btn');
    ttsButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        AudioEngine.play('click');
        
        const idx = parseInt(btn.getAttribute('data-step'));
        const q = hwQuestions[idx];
        if (q) {
          // Check if answer is currently revealed
          const activeCard = stepCards[idx];
          const answerGuide = activeCard.querySelector('.journey-answer-guide');
          const isAnswerRevealed = answerGuide && answerGuide.style.maxHeight && answerGuide.style.maxHeight !== '0px';
          
          const textToSpeak = isAnswerRevealed 
            ? `${q.question}. Answer Guide: ${q.answer}`
            : q.question;
            
          btn.style.color = 'var(--primary)';
          AudioEngine.speak(textToSpeak,
            () => {
              btn.innerHTML = '<i class="fa-solid fa-volume-high fa-beat"></i>';
            },
            () => {
              btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
              btn.style.color = '';
            },
            () => {
              btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
              btn.style.color = '';
            }
          );
        }
      });
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

  // Initialize Leaflet Map
  if (data.mapConfig && window.L) {
    setTimeout(() => {
      initializeLeafletMap(subtopicId, data.mapConfig);
    }, 100);
  }

  // How Useful Analyser Event Listeners
  if (data.howUsefulAnalyser || data.paper3Suite) {
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
            if (!revealBtn.classList.contains('answer-revealed-once')) {
              revealBtn.classList.add('answer-revealed-once');
              addXp(5);
            }
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
            if (textarea.value.length > 20 && !textarea.classList.contains('draft-xp-awarded')) {
              textarea.classList.add('draft-xp-awarded');
              addXp(10);
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

  // Bind Video Link Event to open in Video Modal
  const videoLinks = container.querySelectorAll('.lesson-video-link');
  videoLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      AudioEngine.play('click');
      const url = link.getAttribute('data-url');
      const title = link.getAttribute('data-title');
      openVideoModal(url, title);
    });
  });

  // Mark Mastery button
  const btnMark = document.getElementById('btn-mark-mastery-mastered');
  if (btnMark) {
    btnMark.addEventListener('click', () => {
      AudioEngine.play('cheer');
      btnMark.classList.add('clicked');
      btnMark.disabled = true;
      btnMark.innerText = isCoreMode ? "Completed! Returning to Menu..." : "Mastered! Returning to Menu...";
      
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
            if (!revealAnswersBtn.classList.contains('revealed-once')) {
              revealAnswersBtn.classList.add('revealed-once');
              addXp(3);
            }
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
          addXp(5);
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
        addXp(3);
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

  // Bind Embedded Exam Question Listeners
  const processedMappedExams = groupMappedExams(mappedExams);
  if (processedMappedExams && processedMappedExams.length > 0) {
    processedMappedExams.forEach(item => {
      const paper = PAST_PAPERS_DATA.find(p => p.id === item.paperId);
      if (!paper) return;
      
      if (item.qType === 'q3_suite') {
        const qId = `${paper.id}_q3_suite`;
        const uniqueKeywords = [
          ...new Set([
            ...(paper.q3a ? getKeywordsForQuestion(paper.q3a) : []),
            ...(paper.q3b ? getKeywordsForQuestion(paper.q3b) : []),
            ...(paper.q3c ? getKeywordsForQuestion(paper.q3c) : []),
            ...(paper.q3d ? getKeywordsForQuestion(paper.q3d) : [])
          ])
        ];
        const suiteQObj = { keywords: uniqueKeywords };
        bindEmbeddedExamQuestionListeners(container, qId, suiteQObj, paper.id);
      } else {
        const qObj = paper[item.qType];
        if (!qObj) return;
        const qId = `${paper.id}_${item.qType}`;
        bindEmbeddedExamQuestionListeners(container, qId, qObj, paper.id);
      }
    });
  }
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
      addXp(15);
      if (successDrawer) {
        successDrawer.style.display = 'block';
        if (explanationsList) {
          explanationsList.innerHTML = challenge.facts.map(f => `
            <div style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 4px; margin-bottom: 8px; text-align: left;">
              <strong style="color: var(--success); display: block; margin-bottom: 2px; font-size: 0.82rem;"><i class="fa-solid fa-check"></i> ${f.correctCategory}:</strong>
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

  // Collapsible Do Now
  const doNowHeader = container.querySelector('.do-now-toggle-header');
  if (doNowHeader) {
    doNowHeader.addEventListener('click', () => {
      const content = container.querySelector('.do-now-content-wrapper');
      const icon = doNowHeader.querySelector('i.fa-chevron-down, i.fa-chevron-up');
      if (content) {
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        AudioEngine.play('click');
        if (icon) {
          icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    });
  }

  // Print Workbook modal trigger
  const printWorkbookBtn = container.querySelector('.print-workbook-btn');
  if (printWorkbookBtn) {
    printWorkbookBtn.addEventListener('click', () => {
      AudioEngine.play('click');
      const subtopic = printWorkbookBtn.getAttribute('data-subtopic');
      openWorkbookModal(subtopic);
    });
  }

  // View Worksheet Page button click listener
  const viewWorksheetPageBtn = container.querySelector('.view-worksheet-page-btn');
  if (viewWorksheetPageBtn) {
    viewWorksheetPageBtn.addEventListener('click', () => {
      AudioEngine.play('click');
      const subtopic = viewWorksheetPageBtn.getAttribute('data-subtopic');
      const html = generateWorkbookHtml(subtopic, 'booklet', 'standard', false);
      const newWin = window.open();
      if (newWin) {
        newWin.document.write(html);
        newWin.document.close();
      } else {
        alert("Pop-up blocker prevented opening the worksheet page. Please allow popups for this site.");
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
  
  window.activeLeafletMaps = window.activeLeafletMaps || {};
  window.activeLeafletMaps[subtopicId] = map;
  
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

activeWorkbookSubtopicId = 'subtopic_1_1';

export function openWorkbookModal(subtopicId) {
  activeWorkbookSubtopicId = subtopicId;
  const modal = document.getElementById('lesson-workbook-modal');
  if (modal) {
    modal.style.display = 'flex';
  }

  // Populate dynamic exam questions list if available
  const listContainer = document.getElementById('workbook-exam-questions-list');
  if (listContainer) {
    const questions = LESSONS_DATA[subtopicId]?.questionVault || [];
    listContainer.innerHTML = questions.map((q, idx) => {
      const qText = q.question;
      let badgeColor = '#3b82f6';
      let styleLabel = 'Consequence';
      if (qText.toLowerCase().includes('importance')) {
        badgeColor = '#f59e0b';
        styleLabel = 'Importance';
      } else if (qText.toLowerCase().includes('narrative')) {
        badgeColor = '#10b981';
        styleLabel = 'Narrative';
      }
      return `
        <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.82rem; color: var(--text-main); cursor: pointer; line-height: 1.35; padding: 4px 0;">
          <input type="checkbox" class="workbook-question-checkbox" value="${idx}" checked style="margin-top: 2px; cursor: pointer;">
          <div>
            <span style="display: inline-block; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; color: #fff; background: ${badgeColor}; padding: 1px 5px; border-radius: 4px; margin-right: 4px;">${styleLabel}</span>
            <span>${qText}</span>
          </div>
        </label>
      `;
    }).join('');
  }

  // Set initial visibility of questions selector
  const styleSelect = document.getElementById('workbook-creator-style');
  const wrapper = document.getElementById('workbook-exam-questions-selector-wrapper');
  if (styleSelect && wrapper) {
    wrapper.style.display = styleSelect.value === 'exam' ? 'flex' : 'none';
  }
}

export function initWorkbookCreator() {
  const modal = document.getElementById('lesson-workbook-modal');
  const btnClose = document.getElementById('btn-workbook-creator-close');
  const btnPrint = document.getElementById('btn-workbook-print');
  const btnWord = document.getElementById('btn-workbook-export-word');
  const styleSelect = document.getElementById('workbook-creator-style');
  const wrapper = document.getElementById('workbook-exam-questions-selector-wrapper');

  if (styleSelect) {
    styleSelect.addEventListener('change', () => {
      if (styleSelect.value === 'exam') {
        if (wrapper) wrapper.style.display = 'flex';
      } else {
        if (wrapper) wrapper.style.display = 'none';
      }
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.style.display = 'none';
      AudioEngine.play('click');
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      const style = document.getElementById('workbook-creator-style').value;
      const density = document.getElementById('workbook-creator-density').value;
      const answers = document.getElementById('workbook-creator-answers').value;
      
      let selectedIndices = [];
      if (style === 'exam') {
        const checkboxes = document.querySelectorAll('.workbook-question-checkbox:checked');
        selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.value));
        if (selectedIndices.length === 0) {
          alert("Please select at least one exam question to include in your practice pack.");
          return;
        }
      }

      AudioEngine.play('click');

      const html = generateWorkbookHtml(activeWorkbookSubtopicId, style, density, answers === 'yes', selectedIndices);
      
      const printArea = document.getElementById('print-area');
      if (printArea) {
        printArea.innerHTML = html;
      }
      
      AudioEngine.play('success');
      window.print();
    });
  }

  if (btnWord) {
    btnWord.addEventListener('click', () => {
      const style = document.getElementById('workbook-creator-style').value;
      const density = document.getElementById('workbook-creator-density').value;
      const answers = document.getElementById('workbook-creator-answers').value;
      
      let selectedIndices = [];
      if (style === 'exam') {
        const checkboxes = document.querySelectorAll('.workbook-question-checkbox:checked');
        selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.value));
        if (selectedIndices.length === 0) {
          alert("Please select at least one exam question to include in your practice pack.");
          return;
        }
      }

      const html = generateWorkbookHtml(activeWorkbookSubtopicId, style, density, answers === 'yes', selectedIndices);
      const styleLabel = style.charAt(0).toUpperCase() + style.slice(1);
      downloadHtmlAsWord(`Lesson_Workbook_${activeWorkbookSubtopicId.replace('subtopic_', '')}_${styleLabel}.doc`, html);
      AudioEngine.play('success');
    });
  }
}

function generateWorkbookHtml(subtopicId, style, density, includeAnswers, selectedIndices = []) {
  const data = WORKBOOK_DATA[subtopicId];
  if (!data) {
    return `<html><body><h3>Workbook pack not available for subtopic: ${subtopicId}</h3></body></html>`;
  }
  const topicName = subtopicId.replace('subtopic_', '').replace('_', '.');

  const specList = SPEC_CHECKLIST_DATA[subtopicId] || [];

  const specBoxHtml = specList.length > 0 ? `
    <div class="spec-box" style="border: 1px solid #d1d5db; padding: 6px 10px; margin-bottom: 10px; font-size: 7.5pt; background: #f9fafb; border-radius: 4px; line-height: 1.3; box-sizing: border-box; text-align: left;">
      <strong style="text-transform: uppercase; font-size: 8pt; color: #111827; display: block; margin-bottom: 3px;">📋 Curriculum Specification Checklist (Pearson Edexcel)</strong>
      <ul style="margin: 0; padding-left: 0; list-style: none;">
        ${specList.map(item => `
          <li style="margin: 0 0 3px 0; padding: 0; display: flex; align-items: flex-start; gap: 6px;">
            <span style="display: inline-block; min-width: 10px; width: 10px; height: 10px; border: 1px solid #4b5563; border-radius: 2px; margin-top: 1.5px; box-sizing: border-box;"></span>
            <span>${item.point}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  ` : '';

  if (style === 'booklet') {
    const narrativeHtml = data.narrative.map(sec => `
      <div class="sub-title">${sec.title}</div>
      ${sec.paragraphs.map(p => `<p>${p}</p>`).join('')}
    `).join('');

    const vocabHtml = data.vocabulary.map(item => `
      <div class="vocab-item"><strong>${item.term}</strong>: ${item.definition}</div>
    `).join('');

    const timelineVerticalHtml = data.timeline.map(item => `
      <div class="timeline-vertical-card" style="padding: 2.5px 4px; background: #ffffff; border: 1px solid #e5e7eb; border-left: 2.5px solid #f43f5e; margin-bottom: 3.5px; box-sizing: border-box;">
        <div style="font-weight: bold; font-size: 7pt; color: #f43f5e;">${item.date}</div>
        <div style="font-size: 6.5pt; line-height: 1.15; color: #374151; margin-top: 1px;">${item.desc}</div>
      </div>
    `).join('');

    const comprehensionHtml = data.comprehensionCheck.map((q, idx) => `
      <div class="question-block" style="padding: 3px 5px; margin-bottom: 3px;">
        <span class="question-title" style="font-size: 8pt; line-height: 1.2;">${q.title}</span>
        <span class="scaffold-tip" style="font-size: 6.8pt; color: #4b5563; margin-top: 1px;">${q.scaffold}</span>
      </div>
    `).join('');

    const matrixHeaders = data.causationMatrix.columns.map((col, idx) => `
      <th class="matrix-header" style="width: ${idx === 0 ? '70%' : '30%'};">${col}</th>
    `).join('');
    
    let matrixRowsHtml = '';
    (data.causationMatrix.factors || []).forEach(factor => {
      matrixRowsHtml += `
        <tr>
          <td class="matrix-cell" style="padding: 4px 6px; font-size: 7.5pt; text-align: left; font-weight: bold; height: 26px; box-sizing: border-box;">${factor}</td>
          <td class="matrix-cell" style="height: 26px; box-sizing: border-box;"></td>
        </tr>
      `;
    });
    
    // Shuffling consequences for matching activity
    const consequences = [...(data.causationMatrix.factBank || [])];
    if (consequences.length > 1) {
      const last = consequences.pop();
      consequences.unshift(last);
    }
    const factBankText = consequences.map((fact, idx) => `(${idx + 1}) ${fact}`).join(' • ');

    const matrixHtml = `
      <table class="matrix-table">
        <tr>${matrixHeaders}</tr>
        ${matrixRowsHtml}
      </table>
    `;


    let sourcesTable = '';
    if (data.sources && data.sources.length > 0) {
      sourcesTable += `<table style="width: 100%; border-collapse: collapse; margin-bottom: 3px;">`;
      for (let i = 0; i < data.sources.length; i += 2) {
        sourcesTable += `<tr>`;
        const s1 = data.sources[i];
        sourcesTable += `
          <td style="width: 50%; padding-right: 4px; padding-bottom: 4px; vertical-align: top;">
            <div class="source-box">
              <strong>${s1.id}: ${s1.title}</strong>
              <p style="font-family: 'Times New Roman', Times, serif; font-size: 7.5pt; margin: 2px 0 0 0; line-height: 1.2;">
                "${s1.text}"
              </p>
            </div>
          </td>
        `;
        const s2 = data.sources[i + 1];
        if (s2) {
          sourcesTable += `
            <td style="width: 50%; padding-left: 4px; padding-bottom: 4px; vertical-align: top;">
              <div class="source-box">
                <strong>${s2.id}: ${s2.title}</strong>
                <p style="font-family: 'Times New Roman', Times, serif; font-size: 7.5pt; margin: 2px 0 0 0; line-height: 1.2;">
                  "${s2.text}"
                </p>
              </div>
            </td>
          `;
        } else {
          sourcesTable += `<td style="width: 50%;"></td>`;
        }
        sourcesTable += `</tr>`;
      }
      sourcesTable += `</table>`;
    }

    // Exam Questions rendering (inference question with empty templates + Causation Why question with stimulus points)
    const inferenceQuestion = data.examPractice.questions.find(q => q.title.toLowerCase().includes("infer") || q.title.toLowerCase().includes("inference"));
    
    let inferenceHtml = '';
    if (inferenceQuestion) {
      inferenceHtml = `
        <div style="margin-bottom: 4px; border: 1px solid #e5e7eb; padding: 4px; border-radius: 4px; background: #ffffff; box-sizing: border-box;">
          <span style="font-weight: bold; font-size: 8pt; color: #111827; display: block;">Question 1 [4 Marks]:</span>
          <span style="display: block; font-size: 7.5pt; font-weight: bold; margin-top: 1px; line-height: 1.25; color: #374151;">${inferenceQuestion.title}</span>
          ${inferenceQuestion.sourceA ? `
            <div style="font-family: 'Times New Roman', Times, serif; font-size: 7.2pt; border-left: 2px solid #6b7280; padding-left: 5px; margin: 2px 0; background: #f9fafb; font-style: italic; line-height: 1.15; color: #4b5563;">
              "${inferenceQuestion.sourceA}"
            </div>` : ''}
          <div style="margin-top: 4px; font-size: 7pt; line-height: 1.45;">
            <strong>Inference 1:</strong> <span style="border-bottom: 1px dotted #9ca3af; display: inline-block; width: 75%;">&nbsp;</span><br>
            <strong>Details:</strong> <span style="border-bottom: 1px dotted #9ca3af; display: inline-block; width: 79%;">&nbsp;</span><br>
            <strong>Inference 2:</strong> <span style="border-bottom: 1px dotted #9ca3af; display: inline-block; width: 75%;">&nbsp;</span><br>
            <strong>Details:</strong> <span style="border-bottom: 1px dotted #9ca3af; display: inline-block; width: 79%;">&nbsp;</span>
          </div>
        </div>
      `;
    }

    const whyStimulus = (data.causationMatrix.factors || []).slice(0, 2);
    const whyHtml = `
      <div style="margin-bottom: 2px; border: 1px solid #e5e7eb; padding: 4px; border-radius: 4px; background: #ffffff; box-sizing: border-box;">
        <span style="font-weight: bold; font-size: 8pt; color: #111827; display: block;">Question 2 [12 Marks]:</span>
        <span style="display: block; font-size: 7.5pt; font-weight: bold; margin-top: 1px; line-height: 1.25; color: #374151;">
          ${data.causalQuestion || "Explain why this topic developed during this period."}
        </span>
        <div style="font-size: 6.5pt; color: #4b5563; line-height: 1.25; border-left: 2px solid #d1d5db; padding-left: 6px; margin-left: 2px; margin-top: 3px; background: #f9fafb; padding-top: 2px; padding-bottom: 2px; box-sizing: border-box;">
          You may use the following in your answer:<br>
          ${whyStimulus.map(s => `• ${s}<br>`).join('')}
          • You must also use information of your own.
        </div>
      </div>
    `;
    
    const examQuestionsHtml = inferenceHtml + whyHtml;

    // Comprehensive word bank containing all glossary terms for the lesson
    const examWordBankText = data.vocabulary.map(v => v.term).join(' • ');

    const quizItemsHtml = data.peerQuiz.map(item => `
      <li style="margin: 0 0 1.5px 0; padding: 0;">${item.q}</li>
    `).join('');

    const mindMapBranchesHtml = data.mindMap.branches.map(br => `
      <div class="map-branch-item" style="padding: 1px 3px; margin-bottom: 1.5px; border-left-width: 2px;">
        <strong style="font-size: 7.2pt;">${br.title}</strong>
        <div class="keyword-pill-box" style="margin-top: 0.5px; font-size: 6.5pt;">🔑 ${br.keywords.join(' • ')}</div>
      </div>
    `).join('');

    const mindMapIdeas = (data.vocabulary || []).map(v => v.term).concat((data.timeline || []).slice(0, 2).map(t => t.date)).slice(0, 6);
    const mindMapScaffoldingHtml = `
      <div class="mind-map-wordbank" style="margin-top: 4px; padding: 3px 5px; background: #f0fdf4; border: 1px dashed #bbf7d0; border-radius: 4px; font-size: 6.2pt; line-height: 1.25; text-align: left; box-sizing: border-box;">
        <strong>💡 Mind Map Word Bank:</strong> Use these ideas to connect your branches: 
        <span style="color: #4b5563;">${mindMapIdeas.join(' • ')}</span>
      </div>
    `;

    // Generate Page 3 Teacher Answer Key if includeAnswers is checked
    let teacherAnswersHtml = '';
    if (includeAnswers) {
      const comprehensionAnswersHtml = data.comprehensionCheck.map(q => `
        <div style="margin-bottom: 4px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 2px;">
          <span style="font-weight: bold; font-size: 7.5pt; display: block; color: #1f2937;">${q.title}</span>
          <span style="font-size: 7pt; display: block; color: #16a34a; font-style: italic; margin-top: 1px;">
            <strong>Answer Guide:</strong> ${q.answer || "Write detailed response using step facts."}
          </span>
        </div>
      `).join('');

      let inferenceAnsHtml = '';
      if (inferenceQuestion) {
        inferenceAnsHtml = `
          <div style="margin-bottom: 4px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 2px;">
            <span style="font-weight: bold; font-size: 7.5pt; display: block; color: #1f2937;">${inferenceQuestion.title} [4 Marks]</span>
            <span style="font-size: 7pt; display: block; color: #16a34a; font-style: italic; margin-top: 1px; line-height: 1.25;">
              <strong>Model Answer:</strong><br>${inferenceQuestion.text}
            </span>
          </div>
        `;
      }
      
      const causalAnsHtml = `
        <div style="margin-bottom: 4px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 2px;">
          <span style="font-weight: bold; font-size: 7.5pt; display: block; color: #1f2937;">${data.causalQuestion || "Explain why... (12 marks)"}</span>
          <span style="font-size: 7pt; display: block; color: #16a34a; font-style: italic; margin-top: 1px; line-height: 1.25;">
            <strong>Suggested Essay Content:</strong> Students should structure their response in three paragraphs using the stimulus factors. They must analyze cause-and-effect links using connection words (e.g. 'This led to', 'As a result') and bring in own knowledge (e.g. specific dates/figures from the steps).
          </span>
        </div>
      `;

      const quizAnswersHtml = data.peerQuiz.map((item, idx) => `
        <li style="margin: 0 0 1.5px 0; padding: 0;">
          <strong>Q:</strong> ${item.q}<br>
          <strong style="color: #16a34a;">A:</strong> ${item.a}
        </li>
      `).join('');

      teacherAnswersHtml = `
        <div class="print-page-last" style="page-break-before: always; margin-top: 15px; position: relative;">
          <h2 class="main-title">Teacher Answer Key &bull; Topic ${topicName}</h2>
          
          <div class="section-title" style="margin-top: 5px; margin-bottom: 2px;">Section 3: Comprehension Check Answers</div>
          <div style="background: #f0fdf4; border-left: 3px solid #16a34a; padding: 5px; border-radius: 4px; margin-bottom: 4px; box-sizing: border-box;">
            ${comprehensionAnswersHtml}
          </div>
          
          <div class="section-title" style="margin-top: 5px; margin-bottom: 2px;">Section 6: Exam Practice Model Answers</div>
          <div style="background: #f0fdf4; border-left: 3px solid #16a34a; padding: 5px; border-radius: 4px; margin-bottom: 4px; box-sizing: border-box;">
            ${inferenceAnsHtml}
            ${causalAnsHtml}
            <div style="margin-top: 4px; border-top: 1px dashed #e5e7eb; padding-top: 4px;">
              <strong style="font-size: 7.5pt; display: block; color: #1f2937;">Synthesis Model (Causation Essay):</strong>
              <span style="font-size: 7pt; display: block; color: #16a34a; font-style: italic; margin-top: 1px; line-height: 1.25;">
                ${data.examPractice.synthesisModel}
              </span>
            </div>
          </div>
          
          <div class="section-title" style="margin-top: 5px; margin-bottom: 2px;">Section 7: Quick-Fire Quiz Answer Key</div>
          <div style="background: #f0fdf4; border-left: 3px solid #16a34a; padding: 5px; border-radius: 4px; box-sizing: border-box;">
            <ol class="quiz-list" style="margin: 0; padding-left: 14px; font-size: 7pt; line-height: 1.2;">
              ${quizAnswersHtml}
            </ol>
          </div>
          
          <div class="footer-note">Teacher Answer Key &bull; Page 3</div>
        </div>
      `;
    }

    return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>GCSE History Lesson Resource - ${data.title}</title>
  <style>
    @page {
      size: 21cm 29.7cm; /* A4 */
      margin: 0.8cm 1.0cm 0.8cm 1.0cm;
      mso-page-orientation: portrait;
    }
    body {
      font-family: 'Arial', sans-serif;
      font-size: 9.5pt;
      color: #1f2937;
      line-height: 1.3;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .print-page, .print-page-last {
      clear: both;
      box-sizing: border-box;
      position: relative;
      background: #ffffff;
    }
    .print-page {
      page-break-after: always;
    }
    .print-page-last {
      page-break-after: avoid;
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
        padding: 0.8cm 1.0cm;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid #e5e7eb;
        border-radius: 4px;
      }
    }
    @media print {
      body {
        background: #ffffff !important;
        color: #1f2937 !important;
        font-size: 9.5pt !important;
        line-height: 1.3 !important;
      }
      .print-page, .print-page-last {
        width: 100% !important;
        min-height: 27.7cm !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
      }
    }
    
    .main-title {
      font-size: 13pt;
      font-weight: 800;
      border-bottom: 2px solid #111827;
      padding-bottom: 3px;
      margin-top: 0;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #111827;
    }
    .section-title {
      font-size: 9.2pt;
      font-weight: bold;
      text-transform: uppercase;
      color: #111827;
      border-bottom: 1.5px solid #4b5563;
      padding-bottom: 1px;
      margin-top: 5px;
      margin-bottom: 2px;
    }
    .sub-title {
      font-size: 8.2pt;
      font-weight: bold;
      color: #111827;
      margin-top: 4px;
      margin-bottom: 1px;
    }
    
    .narrative-layout {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
    }
    .narrative-text {
      width: 70%;
      padding-right: 10px;
      vertical-align: top;
      text-align: justify;
      font-size: 8pt;
      line-height: 1.25;
    }
    .narrative-text p {
      margin: 0 0 2px 0;
    }
    .side-panel {
      width: 30%;
      padding-left: 8px;
      border-left: 1px solid #d1d5db;
      vertical-align: top;
    }
    
    .spec-box {
      border: 1px solid #d1d5db;
      padding: 4px 6px;
      margin-bottom: 4px;
      background: #f9fafb;
      font-size: 7.5pt;
      line-height: 1.15;
    }
    .spec-box ul {
      margin: 1px 0 0 0;
      padding-left: 12px;
    }
    .active-reading-box {
      border: 1px solid #d1d5db;
      padding: 4px 6px;
      background: #f3f4f6;
      margin-bottom: 4px;
      font-size: 7.5pt;
      line-height: 1.15;
    }
    .vocab-box {
      background: #f9fafb;
      padding: 4px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
    }
    .vocab-box h4 {
      font-size: 7.2pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 0;
      margin-bottom: 2px;
      border-bottom: 1px solid #9ca3af;
      padding-bottom: 1px;
    }
    .vocab-item {
      font-size: 6.8pt;
      line-height: 1.15;
      margin-bottom: 2px;
    }
    .source-box {
      border-left: 3px solid #4b5563;
      background: #f9fafb;
      padding: 4px 6px;
      font-size: 7.2pt;
      margin-bottom: 3px;
      box-sizing: border-box;
      height: 100%;
    }
    
    .timeline-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
    }
    .timeline-card {
      border: 1px solid #d1d5db;
      padding: 3px 4px;
      width: 22%;
      vertical-align: top;
      background: #f9fafb;
    }
    .timeline-date {
      font-weight: bold;
      font-size: 7.2pt;
      text-transform: uppercase;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 2px;
      padding-bottom: 1px;
    }
    .timeline-desc {
      font-size: 6.8pt;
      line-height: 1.15;
    }
    
    .question-block {
      margin-bottom: 3px;
      padding: 4px 6px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
    }
    .question-title {
      font-size: 8.2pt;
      font-weight: bold;
      display: block;
      margin-bottom: 1px;
    }
    .scaffold-tip {
      font-size: 6.8pt;
      color: #4b5563;
      font-style: italic;
      display: block;
      margin-bottom: 1px;
    }
    .stretch-challenge {
      font-size: 6.8pt;
      color: #b45309;
      font-weight: bold;
      display: block;
      margin-top: 1px;
    }
    
    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
    }
    .matrix-header {
      font-weight: bold;
      font-size: 7.2pt;
      text-transform: uppercase;
      text-align: center;
      background-color: #f3f4f6;
      border: 1px solid #9ca3af;
      padding: 2px;
    }
    .matrix-cell {
      border: 1px solid #9ca3af;
      padding: 3px;
      min-height: 30px;
      vertical-align: top;
      font-size: 6.8pt;
      color: #9ca3af;
      font-style: italic;
    }
    
    .framework-container {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 3px;
      font-size: 6.8pt;
      background: #f9fafb;
      border: 1px solid #d1d5db;
      border-radius: 4px;
    }
    .framework-column {
      vertical-align: top;
      padding: 4px;
    }

    .retention-box {
      border: 1.5px solid #111827;
      background: #ffffff;
      border-radius: 4px;
      margin-top: 3px;
      padding: 3px 6px;
    }
    .retention-header {
      font-weight: bold;
      font-size: 8.2pt;
      color: #111827;
      text-transform: uppercase;
      border-bottom: 1.5px solid #111827;
      padding-bottom: 1px;
      margin-bottom: 2px;
    }
    .split-layout {
      width: 100%;
      border-collapse: collapse;
    }
    .split-col-left {
      width: 50%;
      border-right: 1px dashed #d1d5db;
      padding-right: 8px;
      vertical-align: top;
    }
    .split-col-right {
      width: 50%;
      padding-left: 8px;
      vertical-align: top;
    }
    .quiz-title-box {
      font-weight: bold;
      font-size: 7.2pt;
      text-transform: uppercase;
      color: #4b5563;
      margin-bottom: 2px;
    }
    .quiz-list {
      margin: 0;
      padding-left: 14px;
      font-size: 7.2pt;
      line-height: 1.15;
    }
    .quiz-list li {
      margin-bottom: 1px;
    }
    .map-blueprint {
      font-size: 7pt;
      line-height: 1.15;
    }
    .map-branch-item {
      margin-bottom: 2px;
      background: #f9fafb;
      padding: 2px 4px;
      border-left: 2px solid #b45309;
    }
    .map-branch-item strong {
      color: #111827;
      display: block;
    }
    .keyword-pill-box {
      margin-top: 2px;
      font-style: italic;
      color: #4b5563;
    }
    
    .footer-note {
      font-size: 7pt;
      color: #6b7280;
      text-align: center;
      border-top: 1px solid #e5e7eb;
      padding-top: 2px;
      margin-top: 5px;
      clear: both;
    }
    @media screen {
      .footer-note {
        position: absolute;
        bottom: 0.8cm;
        left: 1.0cm;
        right: 1.0cm;
        margin-top: 0;
      }
    }
    @media print {
      .footer-note {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin-top: 0;
      }
    }
  </style>
</head>
<body>

  <!-- PAGE 1: NARRATIVE & TIMELINE -->
  <div class="print-page">
    <h2 class="main-title">Topic ${topicName}: ${data.title}</h2>
    ${specBoxHtml}

    <div class="active-reading-box">
      <strong>✍️ Active Reading Focus:</strong> ${data.activeReadingFocus}
    </div>

    <div class="section-title" style="margin-top: 5px; margin-bottom: 3px;">Section 1: Historical Narrative & Core Knowledge</div>
    
    <table class="narrative-layout">
      <tr>
        <td class="narrative-text">
          ${narrativeHtml}
        </td>
        <td class="side-panel">
          <div class="vocab-box">
            <h4>Vocabulary Focus</h4>
            ${vocabHtml}
          </div>
          <div class="timeline-box" style="margin-top: 6px; background: #f9fafb; padding: 4px; border: 1px solid #e5e7eb; border-radius: 4px;">
            <h4 style="font-size: 7.2pt; font-weight: bold; text-transform: uppercase; margin-top: 0; margin-bottom: 2px; border-bottom: 1px solid #9ca3af; padding-bottom: 1px;">Section 2: Timeline</h4>
            <p style="font-size: 6.2pt; color: #4b5563; margin: 0 0 3px 0; font-style: italic; line-height: 1.1;">
              In your book, choose any two events below and write a cause-and-effect link.
            </p>
            <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 2px;">
              ${timelineVerticalHtml}
            </div>
          </div>
        </td>
      </tr>
    </table>

    <div class="footer-note">Page 1</div>
  </div>

  <!-- PAGE 2: ANALYTICAL TASKS & ASSESSMENT PREP -->
  <div class="${includeAnswers ? 'print-page' : 'print-page-last'}">
    <div class="section-title" style="margin-top: 0; margin-bottom: 3px;">Section 3: Comprehension Check (AO1)</div>

    ${comprehensionHtml}

    <div class="section-title" style="margin-top: 6px; margin-bottom: 3px;">Section 4: Causation Matrix (Analytical Essay Prep)</div>
    <p style="font-size: 7.5pt; color: #4b5563; margin: 0 0 3px 0; font-style: italic;">
      <strong>Task:</strong> In your exercise book, match each Historical Cause / Factor to its correct Result / Consequence from the Fact Bank below (write the numbers 1-3). Then, write a short explanation of which cause you think was the most important.
    </p>
    
    <div style="border: 1px dashed #9ca3af; padding: 3px 6px; font-size: 7pt; background: #f9fafb; line-height: 1.25; border-radius: 4px; margin-bottom: 3px;">
      <strong>Fact Bank:</strong> ${factBankText}
    </div>

    ${matrixHtml}

    <div class="section-title" style="margin-top: 6px; margin-bottom: 3px;">Section 5: Historical Sources & Evidence (AO3)</div>
    <p style="font-size: 7.5pt; color: #4b5563; margin: 0 0 3px 0; font-style: italic;">Analyze the conflicting viewpoints surrounding the topic using the evidence below.</p>
    
    ${sourcesTable}

    <div class="question-block" style="margin-bottom: 4px; padding: 4px 6px; border-left: 3px solid #10b981; box-sizing: border-box;">
      <span class="question-title" style="font-size: 8pt; color: #0f766e;">Source Utility Question (Answer in your exercise book):</span>
      <span style="font-size: 7.5pt; line-height: 1.35; display: block; font-weight: bold; margin-top: 2px;">
        ${data.sourcesQuestion || "How useful are Sources D and E for an enquiry into this period? (8 marks)"}
      </span>
    </div>

    <div class="section-title" style="margin-top: 6px; margin-bottom: 3px;">Section 6: Exam Practice & Higher Tier Synthesis</div>
    
    <table class="framework-container" style="margin-bottom: 0;">
      <tr>
        <td class="framework-column" style="width: 52%; padding-right: 6px; border-right: 1px solid #e5e7eb;">
          <strong>📝 Exam Practice Questions (Answer in your exercise book):</strong>
          <div style="margin-top: 3px;">
            ${examQuestionsHtml}
          </div>
        </td>
        <td class="framework-column" style="width: 48%; padding-left: 6px;">
          <strong>🏆 Exam Word Bank &amp; Writing Support:</strong>
          <div style="margin-top: 2px; font-size: 7pt; line-height: 1.25;">
            <strong>Word Bank:</strong> ${examWordBankText}
          </div>
        </td>
      </tr>
    </table>

    <div class="retention-box">
      <div class="retention-header">🧠 Section 7: Knowledge Retention &amp; Synoptic Revision Guide</div>
      <table class="split-layout">
        <tr>
          <td class="split-col-left">
            <div class="quiz-title-box">⚡ Quick-Fire Peer-To-Peer Quiz</div>
            <ol class="quiz-list" style="margin: 0; padding-left: 14px;">
              ${quizItemsHtml}
            </ol>
          </td>
          
          <td class="split-col-right">
            <div class="quiz-title-box">🗺️ Mind Map</div>
            <div class="map-blueprint">
              <p style="margin: 0 0 4px 0; font-style: italic; color: #4b5563;">In your book, construct a central node titled <strong>"${data.mindMap.centralNode}"</strong> and link these three core analytical branches using the keywords:</p>
              
              ${mindMapBranchesHtml}
              ${mindMapScaffoldingHtml}
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div class="footer-note">Page 2</div>
  </div>
  ${teacherAnswersHtml}
</body>
</html>`;
  }

  let html = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>GCSE History Lesson Resource - Workbook</title>
  <style>
    @page {
      size: 21cm 29.7cm; /* A4 */
      margin: 1.0cm;
      mso-page-orientation: portrait;
    }
    body {
      font-family: 'Arial', sans-serif;
      font-size: 9.5pt;
      color: #1f2937;
      line-height: 1.4;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .print-page, .print-page-last {
      clear: both;
      box-sizing: border-box;
      position: relative;
      background: #ffffff;
    }
    .print-page {
      page-break-after: always;
    }
    .print-page-last {
      page-break-after: avoid;
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
        padding: 1.0cm;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid #e5e7eb;
        border-radius: 4px;
      }
    }
    @media print {
      body {
        background: #ffffff !important;
        color: #1f2937 !important;
        font-size: 9.5pt !important;
        line-height: 1.4 !important;
      }
      .print-page, .print-page-last {
        width: 100% !important;
        min-height: 27.2cm !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
      }
    }
    .main-title {
      font-size: 13.5pt;
      font-weight: 800;
      border-bottom: 2px solid #111827;
      padding-bottom: 3px;
      margin-top: 0;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #111827;
    }
    .sub-title {
      font-size: 8.5pt;
      font-weight: bold;
      color: #111827;
      margin-top: 6px;
      margin-bottom: 2px;
    }
    .dotted-writing-line {
      border-bottom: 1px dashed #9ca3af;
      height: 28px;
      margin-bottom: 4px;
    }
    .footer-note {
      font-size: 7pt;
      color: #6b7280;
      text-align: center;
      border-top: 1px solid #e5e7eb;
      padding-top: 2px;
      margin-top: 15px;
      clear: both;
    }
    @media screen {
      .footer-note {
        position: absolute;
        bottom: 1.0cm;
        left: 1.0cm;
        right: 1.0cm;
        margin-top: 0;
      }
    }
    @media print {
      .footer-note {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin-top: 0;
      }
    }
    /* Cornell grid styles */
    .print-cornell-grid {
      display: table;
      width: 100%;
      border: 1.5px solid #111827;
      margin-top: 10px;
      box-sizing: border-box;
    }
    .print-cornell-row {
      display: table-row;
    }
    .print-cornell-cues {
      display: table-cell;
      width: 30%;
      border-right: 1.5px solid #111827;
      border-bottom: 1.5px solid #111827;
      padding: 10px;
      vertical-align: top;
      font-size: 8pt;
      font-weight: bold;
      background: #f9fafb;
    }
    .print-cornell-notes {
      display: table-cell;
      width: 70%;
      border-bottom: 1.5px solid #111827;
      padding: 10px;
      vertical-align: top;
      background: #ffffff;
    }
    .print-cornell-summary-row {
      display: table-row;
    }
    .print-cornell-summary-cell {
      display: table-cell;
      colspan: 2;
      padding: 10px;
      vertical-align: top;
      background: #f9fafb;
      font-size: 8.5pt;
    }
    /* Flowchart styles */
    .flowchart-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 15px;
    }
    .flowchart-box {
      border: 1.5px solid #111827;
      padding: 8px;
      width: 22%;
      vertical-align: top;
      background: #ffffff;
      font-size: 8pt;
    }
    .flowchart-arrow {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      width: 4%;
      vertical-align: middle;
      color: #4b5563;
    }
    /* Vocabulary Match-up styles */
    .vocab-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      margin-bottom: 10px;
    }
    .vocab-th {
      font-weight: bold;
      font-size: 7.5pt;
      text-transform: uppercase;
      background-color: #f3f4f6;
      border: 1px solid #9ca3af;
      padding: 4px 6px;
      text-align: left;
    }
    .vocab-td {
      border: 1px solid #9ca3af;
      padding: 5px 6px;
      font-size: 7.5pt;
      vertical-align: middle;
    }
    /* Exam Rubric styles */
    .rubric-box {
      border: 1px solid #111827;
      background: #f9fafb;
      padding: 8px;
      margin-top: 15px;
      font-size: 8pt;
    }
    @media screen {
      body {
        background-color: #f3f4f6;
        padding: 20px 0;
      }
      .print-page, .print-page-last {
        background: #ffffff;
        width: 21cm;
        min-height: 29.7cm;
        margin: 0 auto 20px auto;
        padding: 1.0cm;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        box-sizing: border-box;
      }
    }
  </style>
</head>
<body>
`;

  if (style === 'cloze') {
    const scrambledWordBank = [...data.cloze.wordBank].sort(() => Math.random() - 0.5);
    const wordBank = scrambledWordBank.join(' | ');
    
    const fill = (word) => {
      if (includeAnswers) {
        return `<span style="font-weight: bold; text-decoration: underline; color: #16a34a;">${word}</span>`;
      } else {
        return `<strong>____________________</strong>`;
      }
    };

    const parseClozeText = (text) => {
      return text.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
        return fill(p1);
      });
    };

    const clozeSectionsHtml = data.cloze.sections.map(sec => `
      <h3 class="sub-title">${sec.title}</h3>
      <p>
        ${parseClozeText(sec.text)}
      </p>
    `).join('');

    html += `
      <div class="print-page-last">
        <h2 class="main-title">Guided Cloze Review &bull; Topic ${topicName}: ${data.title}</h2>
        ${specBoxHtml}
        <div style="border: 1px solid #111827; padding: 10px; margin-bottom: 15px; font-size: 9pt; background: #f9fafb;">
          <strong>Instructions:</strong> Read the passage below and fill in the blanks using the terms from the Word Bank at the bottom.
        </div>
        
        <div style="font-size: 10pt; line-height: 1.8; text-align: justify;">
          ${clozeSectionsHtml}
        </div>

        <div style="border: 1.5px solid #111827; padding: 12px; margin-top: 30px; background: #f9fafb; border-radius: 4px;">
          <strong style="display: block; margin-bottom: 6px; text-transform: uppercase; font-size: 8.5pt;">Word Bank</strong>
          <div style="font-size: 8.5pt; line-height: 1.5; text-align: center; font-style: italic;">
            ${wordBank}
          </div>
        </div>
        
        <div class="footer-note">GCSE History Workbook &bull; Guided Cloze Review &bull; Page 1 of 1</div>
      </div>
    `;

  } else if (style === 'cornell') {
    const linesCount = density === 'compact' ? 5 : 8;
    const makeDottedLines = (count) => Array(count).fill('<div class="dotted-writing-line"></div>').join('');
    
    const fillNote = (ans) => {
      if (includeAnswers) {
        return `<div style="font-size: 9.5pt; color: #16a34a; font-style: italic; padding: 5px 0;"><strong>Model Notes:</strong> ${ans}</div>`;
      } else {
        return makeDottedLines(linesCount);
      }
    };

    const cues = data.cornell.cues;
    const page1Cues = cues.slice(0, 3);
    const page2Cues = cues.slice(3);

    const renderCueRow = (cue) => `
      <tr class="print-cornell-row">
        <td class="print-cornell-cues" style="width: 30%; border-right: 1.5px solid #111827; border-bottom: 1.5px solid #111827; padding: 10px; vertical-align: top; font-size: 8pt; font-weight: bold; background: #f9fafb;">
          ${cue.title}<br><br>
          <span style="font-size: 7.5pt; font-weight: normal; color: #4b5563;">
            ${cue.subCues.map(sc => `${sc}`).join('<br>')}
          </span>
        </td>
        <td class="print-cornell-notes" style="width: 70%; border-bottom: 1.5px solid #111827; padding: 10px; vertical-align: top; background: #ffffff;">
          ${fillNote(cue.modelNotes)}
        </td>
      </tr>
    `;

    html += `
      <div class="print-page">
        <h2 class="main-title">Cornell Notes &bull; Topic ${topicName}: ${data.title}</h2>
        ${specBoxHtml}
        <div style="border: 1px solid #111827; padding: 10px; margin-bottom: 10px; font-size: 8.5pt; background: #f9fafb;">
          <strong>Methodology:</strong> Use the left-hand column cues to guide your note-taking on the historical narrative. Re-read sections 1-3 to extract precise dates, groups, and motivations.
        </div>

        <table class="print-cornell-grid" style="width: 100%; border-collapse: collapse; border: 1.5px solid #111827; margin-top: 10px; box-sizing: border-box;">
          <tbody>
            ${page1Cues.map(renderCueRow).join('')}
          </tbody>
        </table>
        
        <div class="footer-note">GCSE History Workbook &bull; Cornell Notes &bull; Page 1 of 2</div>
      </div>

      <div class="print-page-last">
        <table class="print-cornell-grid" style="width: 100%; border-collapse: collapse; border: 1.5px solid #111827; margin-top: 10px; box-sizing: border-box;">
          <tbody>
            ${page2Cues.map(renderCueRow).join('')}
            <tr class="print-cornell-summary-row">
              <td class="print-cornell-summary-cell" colspan="2" style="padding: 10px; vertical-align: top; background: #f9fafb; font-size: 8.5pt; border-top: 1.5px solid #111827;">
                <strong>Synthesis Summary:</strong> ${data.cornell.synthesis.prompt}
                ${includeAnswers ? `
                  <div style="font-size: 9.5pt; color: #16a34a; font-style: italic; margin-top: 8px;">
                    <strong>Model Synthesis:</strong> ${data.cornell.synthesis.modelAnswer}
                  </div>
                ` : makeDottedLines(6)}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="footer-note">GCSE History Workbook &bull; Cornell Notes &bull; Page 2 of 2</div>
      </div>
    `;

  } else if (style === 'organizer') {
    const flowchartLines = density === 'compact' ? 3 : 5;
    const makeDottedLines = (count) => Array(count).fill('<div class="dotted-writing-line"></div>').join('');
    
    const fillBox = (ans) => {
      if (includeAnswers) {
        return `<div style="font-size: 8pt; color: #16a34a; font-style: italic; line-height: 1.4;"><strong>Key Points:</strong> ${ans}</div>`;
      } else {
        return makeDottedLines(flowchartLines);
      }
    };

    const boxes = data.organizer.boxes;
    const vocabMatch = data.organizer.vocabMatch;

    const flowchartCells = [];
    boxes.forEach((box, idx) => {
      flowchartCells.push(`
        <td class="flowchart-box">
          <div style="font-weight: bold; font-size: 8.5pt; text-transform: uppercase; border-bottom: 1px solid #111827; margin-bottom: 6px; padding-bottom: 2px;">
            ${box.title}
          </div>
          ${fillBox(box.modelNotes)}
        </td>
      `);
      if (idx < boxes.length - 1) {
        flowchartCells.push(`<td class="flowchart-arrow">➔</td>`);
      }
    });

    const sortedDefs = [...vocabMatch].sort((a, b) => a.match.localeCompare(b.match));
    const vocabRows = vocabMatch.map((item, idx) => `
      <tr>
        <td class="vocab-td"><strong>${item.term}</strong></td>
        <td class="vocab-td" style="text-align: center; font-weight: bold; color: #16a34a;">${includeAnswers ? item.match : ""}</td>
        <td class="vocab-td">${sortedDefs[idx].match}. ${sortedDefs[idx].definition}</td>
      </tr>
    `).join('');

    html += `
      <div class="print-page-last">
        <h2 class="main-title">Graphic Organizer &bull; Topic ${topicName}: ${data.title}</h2>
        ${specBoxHtml}
        <div style="border: 1px solid #111827; padding: 10px; margin-bottom: 10px; font-size: 8.5pt; background: #f9fafb;">
          <strong>Task 1: Causal Flowchart.</strong> In the boxes below, record the key causes, actions, and consequences for each turning point, tracing the chronology of the developments.
        </div>

        <table class="flowchart-table">
          <tr>
            ${flowchartCells.join('')}
          </tr>
        </table>

        <div class="section-title">Task 2: Key Vocabulary Match-Up</div>
        <table class="vocab-table">
          <thead>
            <tr>
              <th class="vocab-th" style="width: 25%;">Historical Term</th>
              <th class="vocab-th" style="width: 15%; text-align: center;">Your Match</th>
              <th class="vocab-th" style="width: 60%;">Definition / Significance</th>
            </tr>
          </thead>
          <tbody>
            ${vocabRows}
          </tbody>
        </table>

        <div class="footer-note">GCSE History Workbook &bull; Graphic Organizer &bull; Page 1 of 1</div>
      </div>
    `;

  } else if (style === 'exam') {
    const questionsData = LESSONS_DATA[subtopicId]?.questionVault || [];
    
    selectedIndices.forEach((idx, qNum) => {
      const qObj = questionsData[idx];
      if (!qObj) return;
      
      const qText = qObj.question;
      const qAnswer = qObj.answer;

      let marks = 8;
      if (qText.toLowerCase().includes('4 marks') || qText.toLowerCase().includes('(4)')) {
        marks = 4;
      }
      
      let linesCount = marks === 4 ? 6 : 12;
      if (density === 'compact') {
        linesCount = marks === 4 ? 4 : 8;
      }

      let rubricHtml = '';
      const qTextLower = qText.toLowerCase();
      if (qTextLower.includes('consequence')) {
        rubricHtml = `
          <strong style="text-transform: uppercase; display: block; margin-bottom: 4px; color: #111827; font-size: 8.5pt;">Consequence Rubric (4/8 Marks)</strong>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] <strong>Point:</strong> Clearly state one consequence of the event [1-2 Marks]</label>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] <strong>Detail:</strong> Support with specific historical details (dates/names/key terms) [1-2 Marks]</label>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] <strong>Explanation:</strong> Explain exactly how the consequence resulted from the event [2-4 Marks]</label>
        `;
      } else if (qTextLower.includes('narrative')) {
        rubricHtml = `
          <strong style="text-transform: uppercase; display: block; margin-bottom: 4px; color: #111827; font-size: 8.5pt;">Narrative Account Rubric (8 Marks)</strong>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] <strong>Sequence:</strong> Structure the account in clear chronological order (Beginning &rarr; Middle &rarr; End) [2 Marks]</label>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] <strong>Linkage:</strong> Use connection words (e.g. 'This led to', 'As a direct result') to link events [2 Marks]</label>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] <strong>Knowledge:</strong> Support with precise historical details (dates, names, key terms) [2 Marks]</label>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] <strong>Analysis:</strong> Explain how the chain of events led to the final outcome [2 Marks]</label>
        `;
      } else if (qTextLower.includes('importance')) {
        rubricHtml = `
          <strong style="text-transform: uppercase; display: block; margin-bottom: 4px; color: #111827; font-size: 8.5pt;">Importance Rubric (8 Marks)</strong>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] <strong>Significance:</strong> State why the event is important for the specified development [2 Marks]</label>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] <strong>Before/After:</strong> Explain the 'before' and 'after' state to show the change/significance [2 Marks]</label>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] <strong>Knowledge:</strong> Support with precise historical facts (dates, names, events) [2 Marks]</label>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] <strong>Explanation:</strong> Link the event directly to its impact on the specified outcome [2 Marks]</label>
        `;
      } else {
        rubricHtml = `
          <strong style="text-transform: uppercase; display: block; margin-bottom: 4px; color: #111827; font-size: 8.5pt;">Self-Evaluation Rubric</strong>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] Answered in full, grammatically correct sentences.</label>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] Included specific historical details (dates, names, events).</label>
          <label style="display: block; margin-bottom: 4px;"><input type="checkbox"> [ ] Explained the connection between cause and consequence or narrative progression.</label>
        `;
      }
      
      const isQuestionLast = qNum === selectedIndices.length - 1 && !includeAnswers;
      const firstPageSpecHtml = qNum === 0 ? specBoxHtml : '';
      html += `
        <div class="${isQuestionLast ? 'print-page-last' : 'print-page'}">
          <div class="main-title">GCSE Exam Practice &bull; Topic ${topicName}: ${data.title}</div>
          ${firstPageSpecHtml}
          <div style="font-size: 11pt; font-weight: bold; margin-bottom: 15px; border-bottom: 1.5px solid #111827; padding-bottom: 4px;">
            Question ${qNum + 1} [${marks} Marks]
          </div>
          
          <p style="font-size: 11pt; font-weight: bold; margin-bottom: 12px; line-height: 1.45;">
            ${qText}
          </p>

          <div style="margin-top: 15px;">
            ${Array(linesCount).fill('<div class="dotted-writing-line"></div>').join('')}
          </div>

          <div class="rubric-box">
            ${rubricHtml}
          </div>

          <div class="footer-note">GCSE History Workbook &bull; Exam Practice &bull; Page ${qNum + 1}</div>
        </div>
      `;
      
      if (includeAnswers) {
        const isAnswerLast = qNum === selectedIndices.length - 1;
        html += `
          <div class="${isAnswerLast ? 'print-page-last' : 'print-page'}">
            <div class="main-title">Teacher Answer Key &bull; Topic ${topicName}: Model Answer</div>
            <div style="font-size: 11pt; font-weight: bold; margin-bottom: 15px; border-bottom: 1.5px solid #111827; padding-bottom: 4px;">
              Model Answer for Question ${qNum + 1} [${marks} Marks]
            </div>
            
            <p style="font-size: 10pt; font-weight: bold; margin-bottom: 10px; font-style: italic; color: #4b5563;">
              Question: ${qText}
            </p>

            <div style="border-left: 3px solid #16a34a; background: #f0fdf4; padding: 12px; font-size: 10pt; line-height: 1.6; text-align: justify; margin-top: 15px;">
              ${qAnswer}
            </div>
            
            <div class="footer-note">GCSE History Workbook &bull; Exam Practice Answer Key &bull; Page ${qNum + 1}</div>
          </div>
        `;
      }
    });
  }

  html += `
</body>
</html>
  `;
  return html;
}

export function generateBulkWorkbookHtml(style, density, includeAnswers) {
  const subtopicIds = [
    'subtopic_1_1', 'subtopic_1_2', 'subtopic_1_3', 'subtopic_1_4',
    'subtopic_2_1', 'subtopic_2_2', 'subtopic_2_3', 'subtopic_2_4',
    'subtopic_3_1', 'subtopic_3_2', 'subtopic_3_3', 'subtopic_3_4',
    'subtopic_4_1', 'subtopic_4_2', 'subtopic_4_3', 'subtopic_4_4'
  ];

  let combinedBodyContent = '';
  let documentHeader = '';
  
  for (let index = 0; index < subtopicIds.length; index++) {
    const subId = subtopicIds[index];
    let selectedIndices = [];
    if (style === 'exam') {
      const questionsData = LESSONS_DATA[subId]?.questionVault || [];
      selectedIndices = questionsData.map((_, idx) => idx);
    }

    const html = generateWorkbookHtml(subId, style, density, includeAnswers, selectedIndices);
    
    const bodyStartIdx = html.indexOf('<body>');
    const bodyEndIdx = html.lastIndexOf('</body>');
    if (bodyStartIdx !== -1 && bodyEndIdx !== -1) {
      let bodyContent = html.substring(bodyStartIdx + 6, bodyEndIdx).trim();
      
      // Convert all print-page-last to print-page to force page break, except for the last lesson
      if (index < subtopicIds.length - 1) {
        bodyContent = bodyContent.replace(/class="print-page-last"/g, 'class="print-page"');
      }
      
      combinedBodyContent += `\n<!-- LESSON ${subId} -->\n` + bodyContent;
    }
    
    if (index === 0) {
      documentHeader = html.substring(0, bodyStartIdx + 6);
    }
  }

  return documentHeader + combinedBodyContent + '\n</body>\n</html>';
}

window.generateWorkbookHtml = generateWorkbookHtml;
window.generateBulkWorkbookHtml = generateBulkWorkbookHtml;