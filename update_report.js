const fs = require('fs');

let analysis = fs.readFileSync('C:\\Users\\fives\\.gemini\\antigravity\\brain\\64e7abdd-b49b-4734-ab5c-04d1694afb55\\analysis_results.md', 'utf8');
analysis = analysis.replace(/“Write a narrative account analyzing…”/g, '“How useful are Sources B and C for an enquiry into…”');
fs.writeFileSync('C:\\Users\\fives\\.gemini\\antigravity\\brain\\64e7abdd-b49b-4734-ab5c-04d1694afb55\\analysis_results.md', analysis, 'utf8');

console.log("Fixed analysis report.");
