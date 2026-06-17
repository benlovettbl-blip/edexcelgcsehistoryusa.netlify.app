const fs = require('fs');
const execSync = require('child_process').execSync;

let indexHtml = execSync('git show b6086ac:index.html').toString();

const startIdx = indexHtml.indexOf('<style id="trading-cards-style">');
const endIdx = indexHtml.indexOf('</style>', startIdx) + 8;

if (startIdx > -1 && endIdx > -1) {
    fs.writeFileSync('extracted_trading_css.txt', indexHtml.substring(startIdx, endIdx), 'utf8');
    console.log("Extracted CSS for Trading Cards.");
} else {
    console.log("Could not find bounds.", startIdx, endIdx);
}
