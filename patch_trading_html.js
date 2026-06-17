const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

if (indexHtml.includes('id="view-trading" style="display: none;"')) {
    indexHtml = indexHtml.replace('id="view-trading" style="display: none;"', 'id="view-trading"');
    fs.writeFileSync('index.html', indexHtml, 'utf8');
    console.log("Removed inline display: none from view-trading.");
} else {
    console.log("Not found.");
}
