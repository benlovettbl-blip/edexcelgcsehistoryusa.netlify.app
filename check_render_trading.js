const fs = require('fs');
let code = fs.readFileSync('src/views.js', 'utf8');

const regex = /function renderTradingCardsView\(\) \{([\s\S]*?)\}/;
const match = regex.exec(code);
if (match) {
    console.log(match[0].substring(0, 500));
} else {
    console.log("Not found.");
}
