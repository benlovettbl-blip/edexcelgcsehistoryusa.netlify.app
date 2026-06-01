const fs = require('fs');
const content = fs.readFileSync('questions.js', 'utf8');
const idx = content.indexOf('export const PAST_PAPERS_DATA');
const sect = content.substring(idx);
console.log("=== PAST_PAPERS_DATA ===");
console.log(sect.substring(0, 1000));
const matches = sect.match(/id:\s*"[a-zA-Z0-9_]+"/g);
console.log("Paper IDs found:", matches);
