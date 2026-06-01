const fs = require('fs');
const code = fs.readFileSync('questions.js', 'utf8');

// Parse the export const PAST_PAPERS_DATA line by line or dynamically
const { PAST_PAPERS_DATA } = require('./questions.js');

PAST_PAPERS_DATA.forEach(paper => {
  console.log(`Paper: ${paper.id}`);
  if (paper.q3a) {
    console.log(`  q3a.model length: ${paper.q3a.model ? paper.q3a.model.length : 0}`);
  }
});
