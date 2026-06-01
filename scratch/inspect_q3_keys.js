const fs = require('fs');
const content = fs.readFileSync('questions.js', 'utf8');
const start = content.indexOf('q3: {');
const end = content.indexOf('export const PAST_PAPERS_DATA');
const sect = content.substring(start, end);
console.log("=== Q3 Keys ===");
const keys = sect.match(/"[a-zA-Z0-9_]+":/g);
console.log(keys);
