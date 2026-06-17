const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');
let extractedHtml = fs.readFileSync('extracted_individuals_html.txt', 'utf8');

if (!indexHtml.includes('id="view-individuals"')) {
    indexHtml = indexHtml.replace('<section class="content-view" id="view-map">', extractedHtml + '\n      <section class="content-view" id="view-map">');
    fs.writeFileSync('index.html', indexHtml, 'utf8');
    console.log("Successfully injected HTML for Key Individuals.");
} else {
    console.log("Already exists.");
}
