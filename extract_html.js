const fs = require('fs');
const execSync = require('child_process').execSync;

let indexHtml = execSync('git show b6086ac:index.html').toString();

const startIdx = indexHtml.indexOf('<!-- KEY INDIVIDUALS FLIP CARDS VIEW -->');
const endIdx = indexHtml.indexOf('<section class="content-view" id="view-map">');

if (startIdx > -1 && endIdx > -1) {
    fs.writeFileSync('extracted_individuals_html.txt', indexHtml.substring(startIdx, endIdx), 'utf8');
    console.log("Extracted HTML for Key Individuals.");
} else {
    console.log("Could not find bounds.");
}
