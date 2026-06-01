const fs = require('fs');

console.log("=== VERIFYING DATABASE (questions.js) ===");
const questionsContent = fs.readFileSync('questions.js', 'utf8');

// 1. Check for any remaining [2[ or ]2] tags
const count2Start = (questionsContent.match(/\[2\[/g) || []).length;
const count2End = (questionsContent.match(/\]2\]/g) || []).length;

if (count2Start === 0 && count2End === 0) {
  console.log("✓ No [2[ or ]2] tags found in questions.js. All converted!");
} else {
  console.error(`✗ ERROR: Found ${count2Start} '[2[' and ${count2End} ']2]' instances in questions.js!`);
}

// 2. Check for key changes in modelc
const expectedKeywords = [
  "monumental and highly effective breakthroughs",
  "remarkable success",
  "the most important law passed by Congress",
  "bombing was failing to defeat the enemy",
  "confrontation and armed self-defence",
  "achieved a number of things",
  "commitment to non-violent direct action",
  "key turning point",
  "disastrous miscalculation",
  "fatal, decisive blow",
  "watershed moment",
  "huge victory for the civil rights movement",
  "self-defeating",
  "highly successful policy",
  "superior motivation and guerrilla tactics"
];

let foundAll = true;
for (const phrase of expectedKeywords) {
  const checkTag = `[1[${phrase}]1]`;
  if (questionsContent.includes(checkTag)) {
    console.log(`✓ Found expected highlighted phrase in modelc: ${checkTag}`);
  } else {
    console.error(`✗ ERROR: Could not find highlighted phrase in modelc: ${checkTag}`);
    foundAll = false;
  }
}

console.log("\n=== VERIFYING COMPILED APP (app.js) ===");
const appContent = fs.readFileSync('app.js', 'utf8');
const appCount2 = (appContent.match(/\[2\[/g) || []).length;
console.log(`Instances of '[2[' in app.js: ${appCount2}`);

if (appCount2 === 0) {
  console.log("✓ No [2[ tags found in app.js.");
} else {
  console.error(`✗ ERROR: Found [2[ in app.js!`);
}

console.log("\n=== VERIFYING BUILD DIST (dist/questions.js, dist/app.js) ===");
const distQuestionsContent = fs.readFileSync('dist/questions.js', 'utf8');
const distAppContent = fs.readFileSync('dist/app.js', 'utf8');

const distCount2 = (distQuestionsContent.match(/\[2\[/g) || []).length;
const distAppCount2 = (distAppContent.match(/\[2\[/g) || []).length;

if (distCount2 === 0 && distAppCount2 === 0) {
  console.log("✓ dist/ files are clean of [2[ tags.");
} else {
  console.error(`✗ ERROR: Found [2[ in dist/ files!`);
}

if (foundAll && count2Start === 0 && count2End === 0 && appCount2 === 0 && distCount2 === 0 && distAppCount2 === 0) {
  console.log("\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!");
} else {
  console.error("\nVERIFICATION FAILED!");
  process.exit(1);
}
