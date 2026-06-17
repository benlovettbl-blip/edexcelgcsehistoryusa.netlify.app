const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');
let html = fs.readFileSync('extracted_trading_html.txt', 'utf8');

if (!indexHtml.includes('id="view-trading"')) {
    indexHtml = indexHtml.replace('<section class="content-view" id="view-map">', html + '\n      <section class="content-view" id="view-map">');
    fs.writeFileSync('index.html', indexHtml, 'utf8');
    console.log("Injected trading cards HTML.");
} else {
    console.log("Already exists.");
}
