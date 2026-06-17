const fs = require('fs');
const execSync = require('child_process').execSync;

let content = execSync('git show b6086ac:src/trading_cards_data.js');
fs.writeFileSync('src/trading_cards_data.js', content, 'utf8');
console.log("Extracted trading_cards_data.js cleanly.");
