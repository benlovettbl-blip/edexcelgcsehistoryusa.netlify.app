const fs = require('fs');
const path = require('path');
const vm = require('vm');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("\n[Error] GEMINI_API_KEY environment variable is not defined.");
  console.log("Please run this script with your Gemini API key:");
  console.log("  cmd.exe /c \"set GEMINI_API_KEY=AIzaSy... && node bulk_generate_distractors.js\"");
  console.log("  Or in PowerShell:");
  console.log("  $env:GEMINI_API_KEY=\"AIzaSy...\"; node bulk_generate_distractors.js\n");
  process.exit(1);
}

const SYSTEM_PROMPT = `You are an expert educational assessment designer. Your task is to review, modify, or generate multiple-choice questions (MCQs) to ensure that the incorrect options (distractors) are highly plausible, high-quality, and free of "dead giveaways."
Follow these strict formatting and structural rules for every question:

1. Grammatical Parallelism (Crucial)
* Matching Structure: Every option must grammatically match the question stem and the correct answer perfectly.
* If the correct answer starts with a specific part of speech (e.g., an infinitive verb "To analyze...", a gerund "Analyzing...", a preposition "Because of..."), all distractors must start with that exact same part of speech.
* If the correct answer is a complete sentence, all options must be complete sentences.

2. Content Plausibility & Domain Homogeneity
* No Outliers: Distractors must belong to the exact same context, era, theme, or chapter as the correct answer. Do not pull famously distinct historical events, unrelated definitions, or random fragments to fill space.
* Misconceptions over Non-sequiturs: Base incorrect options on common logical errors, related but incorrect concepts, or plausible-sounding falsehoods within the domain.

3. Symmetry of Length and Detail
* Uniform Length: Keep all options roughly the same length. Avoid the "long correct answer" bias where the right answer is highly detailed and the wrong answers are short and vague.
* Consistent Tone: Maintain the exact same academic, professional, or technical tone across all options.

4. No Clues or Cue Words
* Do not use absolute terms (e.g., "always," "never") in distractors if the correct answer uses nuanced language.
* Ensure that no single option stands out visually or grammatically from the other three.`;

function callGemini(question, correctAnswer, currentDistractors) {
  const userPrompt = `Review the following multiple-choice question. Keep the question stem and the correct answer exactly as they are, but rewrite the incorrect distractors to strictly follow the system rules for parallelism, plausibility, and uniform length. Return your response ONLY as a JSON array of three strings: ["distractor1", "distractor2", "distractor3"]. Do not include any markdown or code blocks.
* Question Stem: ${question}
* Correct Answer: ${correctAnswer}
* Current Distractors to Fix: ${JSON.stringify(currentDistractors)}`;

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`API Error (Status ${res.statusCode}): ${body}`));
        }
        try {
          const parsed = JSON.parse(body);
          if (!parsed.candidates || !parsed.candidates[0] || !parsed.candidates[0].content) {
            return reject(new Error(`Invalid response structure: ${body}`));
          }
          const responseText = parsed.candidates[0].content.parts[0].text;
          const distractors = JSON.parse(responseText.trim());
          if (Array.isArray(distractors) && distractors.length === 3) {
            resolve(distractors);
          } else {
            reject(new Error(`Response is not an array of 3 strings: ${responseText}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse API response: ${e.message}\nResponse body: ${body}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

// Local smart distractor generator for bootstrapping
function isTitleCase(str) {
  const words = str.split(/\s+/);
  if (words.length === 0 || str === "") return false;
  const lowerConjs = ["of", "the", "in", "and", "to", "for", "a", "an", "but", "or", "by", "from", "on", "with", "at", "de", "von"];
  return words.every((word, idx) => {
    if (word === "") return true;
    const firstChar = word[0];
    if (idx === 0) {
      return firstChar === firstChar.toUpperCase() && /[a-zA-Z]/.test(firstChar);
    }
    if (lowerConjs.includes(word.toLowerCase())) return true;
    return firstChar === firstChar.toUpperCase() && /[a-zA-Z]/.test(firstChar);
  });
}

function getWordCount(str) {
  return str.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function generateSmartDistractors(correctText, pool, questionText) {
  const correct = correctText.trim();
  const lowerCorrect = correct.toLowerCase();

  // 1. Year Match
  const yearRegex = /^\d{4}$/;
  if (yearRegex.test(correct)) {
    const yearVal = parseInt(correct, 10);
    let poolYears = pool.filter(ans => yearRegex.test(ans)).map(ans => parseInt(ans, 10)).filter(y => y !== yearVal);
    poolYears = Array.from(new Set(poolYears));
    if (poolYears.length >= 3) {
      poolYears.sort((a, b) => Math.abs(a - yearVal) - Math.abs(b - yearVal));
      return poolYears.slice(0, 3).map(y => String(y));
    }
    return [String(yearVal - 2), String(yearVal + 3), String(yearVal - 5)];
  }

  // 2. Percentage Match
  const pctRegex = /^(\d+(?:\.\d+)?)\s*%$/;
  if (pctRegex.test(correct)) {
    const match = correct.match(pctRegex);
    const val = parseFloat(match[1]);
    const isInteger = !correct.includes('.');
    const pctChar = correct.includes(' ') ? ' %' : '%';
    return [
      (isInteger ? Math.round(val - 10) : (val - 10.5).toFixed(1)) + pctChar,
      (isInteger ? Math.round(val + 5) : (val + 5.2).toFixed(1)) + pctChar,
      (isInteger ? Math.round(val - 15) : (val - 15.1).toFixed(1)) + pctChar
    ];
  }

  // 3. Simple Number
  const rawDigitsRegex = /^\d+$/;
  if (rawDigitsRegex.test(correct)) {
    const val = parseInt(correct, 10);
    return [String(Math.round(val * 0.7)), String(Math.round(val * 1.3)), String(Math.round(val * 1.5))];
  }

  // 4. Proper Nouns / Title Case
  const isCorrectTitleCase = isTitleCase(correct);
  const correctWordCount = getWordCount(correct);
  const uniquePool = Array.from(new Set(pool.filter(ans => ans.toLowerCase() !== lowerCorrect)));
  
  const scoredPool = uniquePool.map(ans => {
    let score = 0;
    const wordCount = getWordCount(ans);
    const isAnsTitleCase = isTitleCase(ans);
    if (isCorrectTitleCase === isAnsTitleCase) score += 8;
    if (correctWordCount === wordCount) score += 10;
    else if (Math.abs(correctWordCount - wordCount) === 1) score += 5;
    return { original: ans, score: score };
  });

  scoredPool.sort((a, b) => b.score - a.score);
  return scoredPool.slice(0, 3).map(item => item.original);
}

// MAIN EXECUTION FLOW
const filePath = path.join(__dirname, 'questions.js');
console.log("Loading database from:", filePath);
let fileContent = fs.readFileSync(filePath, 'utf8');

// Parse quiz data using VM sandbox
let contentWithoutExports = fileContent.replace(/\bexport\s+/g, '');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(contentWithoutExports, sandbox);
const QUIZ_DATA = sandbox.QUIZ_DATA;

if (!QUIZ_DATA || !Array.isArray(QUIZ_DATA)) {
  console.error("Error: Could not load QUIZ_DATA array from questions.js");
  process.exit(1);
}

// Gather all answers for the bootstrap pool
const allAnswers = [];
QUIZ_DATA.forEach(topic => {
  if (!topic.subtopics) return;
  topic.subtopics.forEach(subtopic => {
    const questions = [...(subtopic.standard || []), ...(subtopic.depth || [])];
    questions.forEach(q => {
      if (q.answer) allAnswers.push(q.answer.trim());
    });
  });
});

async function run() {
  console.log("\nStarting AI Distractor Generation...");
  console.log("This will call the Gemini API to clean and harden distractors.");
  
  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let topic of QUIZ_DATA) {
    if (!topic.subtopics) continue;
    console.log(`\nProcessing Topic: ${topic.title}`);
    
    for (let subtopic of topic.subtopics) {
      console.log(`  Subtopic: ${subtopic.title}`);
      const questions = [...(subtopic.standard || []), ...(subtopic.depth || [])];
      
      for (let q of questions) {
        if (q.distractors && q.distractors.length === 3) {
          skippedCount++;
          continue;
        }
        
        console.log(`    -> Question [${q.id}]: "${q.question.substring(0, 60)}..."`);
        const bootstrapWrong = generateSmartDistractors(q.answer, allAnswers, q.question);
        
        try {
          // Wait 1.2s to respect API rate limits (Gemini free tier allows 15 RPM)
          await new Promise(r => setTimeout(r, 1200));
          
          const aiDistractors = await callGemini(q.question, q.answer, bootstrapWrong);
          q.distractors = aiDistractors;
          processedCount++;
          console.log(`       [Success] Distractors: ${JSON.stringify(aiDistractors)}`);
        } catch (err) {
          errorCount++;
          console.error(`       [Error] Failed to generate distractors:`, err.message);
          // Fall back to bootstrap wrong answers so it is populated
          q.distractors = bootstrapWrong;
        }
      }
    }
  }

  console.log("\nRe-writing questions.js database...");
  const updatedContent = `export const QUIZ_DATA = ${JSON.stringify(QUIZ_DATA, null, 2)};\n`;
  fs.writeFileSync(filePath, updatedContent, 'utf8');

  console.log("\nExecution completed!");
  console.log(`- Distractors generated/updated: ${processedCount}`);
  console.log(`- Questions skipped (already populated): ${skippedCount}`);
  console.log(`- Failed API attempts: ${errorCount}`);
  console.log("Done.");
}

run().catch(console.error);
