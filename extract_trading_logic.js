const fs = require('fs');
const execSync = require('child_process').execSync;

let viewsJs = execSync('git show b6086ac:src/views.js').toString();

const startIdx = viewsJs.indexOf('export function renderTradingCardsView() {');
const endIdx = viewsJs.indexOf('window.renderTradingCardsView = renderTradingCardsView;');

if (startIdx > -1 && endIdx > -1) {
    fs.writeFileSync('extracted_trading_logic.js', viewsJs.substring(startIdx, endIdx), 'utf8');
    console.log("Extracted renderTradingCardsView.");
} else {
    console.log("Could not find boundaries.");
}
