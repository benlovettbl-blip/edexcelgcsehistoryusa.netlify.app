const fs = require('fs');
const code = fs.readFileSync('extracted_active_figures.js', 'utf8');
const match = code.match(/key: "(.*?)"/g);
console.log("Keys in activeFigures:", match);

const views = fs.readFileSync('src/views.js', 'utf8');
const bioMatch = views.match(/"(.*?)"\s*:\s*\{\s*name:/g);
console.log("Keys in KEY_FIGURES_BIO:", bioMatch);
