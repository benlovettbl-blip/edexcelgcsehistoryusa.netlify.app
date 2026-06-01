const fs = require('fs');
const content = fs.readFileSync('questions.js', 'utf8');
const q2Start = content.indexOf('q2: {');
const q2End = content.indexOf('q3: {');
console.log("=== Q2 Section ===");
console.log(content.substring(q2Start, q2Start + 2000));
console.log("=== End Q2 Section ===");
console.log(content.substring(q2End - 1000, q2End + 200));
