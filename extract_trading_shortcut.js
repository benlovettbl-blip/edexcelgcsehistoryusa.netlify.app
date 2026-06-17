const fs = require('fs');
const execSync = require('child_process').execSync;

let indexHtml = execSync('git show b6086ac:index.html').toString();

const startIdx = indexHtml.indexOf('<div class="shortcut-card" id="shortcut-trading"');
const endIdx = indexHtml.indexOf('</div>', startIdx + 50) + 6;

if (startIdx > -1 && endIdx > -1) {
    fs.writeFileSync('extracted_trading_shortcut.txt', indexHtml.substring(startIdx, endIdx), 'utf8');
    console.log("Extracted shortcut for Trading Cards.");
} else {
    console.log("Could not find bounds.", startIdx, endIdx);
}
