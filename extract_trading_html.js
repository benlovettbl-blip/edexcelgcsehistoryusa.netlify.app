const fs = require('fs');
const execSync = require('child_process').execSync;

let indexHtml = execSync('git show b6086ac:index.html').toString();

const startIdx = indexHtml.indexOf('<!-- TRADING CARDS VIEW -->');
const endIdx = indexHtml.indexOf('<!-- KEY INDIVIDUALS FLIP CARDS VIEW -->');

if (startIdx > -1 && endIdx > -1) {
    fs.writeFileSync('extracted_trading_html.txt', indexHtml.substring(startIdx, endIdx), 'utf8');
    console.log("Extracted HTML for Trading Cards.");
} else {
    console.log("Could not find bounds.", startIdx, endIdx);
}
