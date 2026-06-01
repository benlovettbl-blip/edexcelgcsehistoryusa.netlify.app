const fs = require('fs');
const content = fs.readFileSync('questions.js', 'utf8');

// Find all occurrences of q3b
const regex = /q3b:\s*\{([\s\S]*?)\}/g;
let match;
console.log("=== Q3B in questions.js ===");
while ((match = regex.exec(content)) !== null) {
  console.log(match[0]);
  console.log("------------------------------------");
}
