import { LESSONS_DATA } from '../src/lessons_data.js';
import { EXAM_SKILLS_DATA } from '../questions.js';

console.log('=== RUNNING PEEL VERIFICATION ===\n');

let totalErrors = 0;

function checkEssay(id, question, text) {
  if (!text) {
    console.error(`[ERROR] [${id}] Model answer is empty`);
    totalErrors++;
    return;
  }

  // Split by double newlines to check paragraphs
  const paragraphs = text.split('\n\n').map(p => p.trim()).filter(Boolean);

  if (paragraphs.length !== 3) {
    console.error(`[ERROR] [${id}] Expected exactly 3 paragraphs, got ${paragraphs.length}`);
    totalErrors++;
  }

  paragraphs.forEach((p, idx) => {
    const pLabel = `Paragraph ${idx + 1}`;
    
    // 1. Check Point (P): starts with "“" and ends with "”"
    // Wait, the Point should be at the start of the paragraph.
    // It is wrapped in curly quotes: “...”
    const pointMatch = p.match(/^“([^”]+)”/);
    if (!pointMatch) {
      console.error(`[ERROR] [${id}] [${pLabel}] Does not start with a Point wrapped in curly quotes “...”`);
      console.error(`Content: ${p.substring(0, 100)}...`);
      totalErrors++;
    }

    // 2. Check Evidence (E): contains [[...]]
    const evidenceMatches = p.match(/\[\[(.*?)\]\]/g);
    if (!evidenceMatches) {
      console.error(`[ERROR] [${id}] [${pLabel}] Does not contain any Evidence/Own Knowledge in double brackets [[...]]`);
      totalErrors++;
    }

    // 3. Check Link Back (L): ends with {{...}}
    const linkMatch = p.match(/\{\{([^}]+)\}\}$|\{\{([^}]+)\}\}\s*$/);
    if (!linkMatch) {
      console.error(`[ERROR] [${id}] [${pLabel}] Does not end with a Link Back in double braces {{...}}`);
      totalErrors++;
    } else {
      const linkText = (linkMatch[1] || linkMatch[2] || '').trim();
      if (!linkText.startsWith('Therefore')) {
        console.error(`[ERROR] [${id}] [${pLabel}] Link Back does not start with "Therefore". Found: "${linkText.substring(0, 30)}..."`);
        totalErrors++;
      }
    }

    // 4. Check for nested brackets/braces syntax errors or leaks
    const openBrackets = (p.match(/\[\[/g) || []).length;
    const closeBrackets = (p.match(/\]\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      console.error(`[ERROR] [${id}] [${pLabel}] Mismatched double brackets: [[ = ${openBrackets}, ]] = ${closeBrackets}`);
      totalErrors++;
    }

    const openBraces = (p.match(/\{\{/g) || []).length;
    const closeBraces = (p.match(/\}\}/g) || []).length;
    if (openBraces !== closeBraces) {
      console.error(`[ERROR] [${id}] [${pLabel}] Mismatched double braces: {{ = ${openBraces}, }} = ${closeBraces}`);
      totalErrors++;
    }
  });
}

// Check lessons data (subtopics ends in _2)
Object.entries(LESSONS_DATA).forEach(([k, v]) => {
  if (k.endsWith('_2') && v.questionVault && v.questionVault[0]) {
    const q = v.questionVault[0];
    checkEssay(k, q.question, q.answer);
  }
});

// Check exam data (EXAM_SKILLS_DATA.q2)
if (EXAM_SKILLS_DATA.q2) {
  Object.entries(EXAM_SKILLS_DATA.q2).forEach(([k, v]) => {
    checkEssay(k, v.question, v.model);
  });
}

console.log(`\nVerification Finished. Total Errors Found: ${totalErrors}`);

if (totalErrors > 0) {
  process.exit(1);
} else {
  console.log('SUCCESS! All Question 2 model answers are fully PEEL-compliant!');
}
