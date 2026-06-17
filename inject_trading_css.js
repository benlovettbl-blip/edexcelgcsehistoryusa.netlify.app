const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');
let extractedCss = fs.readFileSync('extracted_trading_css.txt', 'utf8');

if (!css.includes('.scumbag-card-container')) {
    // extractedCss includes `<style id="...">` and `</style>`. Let's strip those.
    let cleanCss = extractedCss.replace(/<style[^>]*>/, '').replace(/<\/style>/, '');
    css += '\n\n/* TRADING CARDS CSS */\n' + cleanCss;
    fs.writeFileSync('style.css', css, 'utf8');
    console.log("Injected CSS.");
} else {
    console.log("Already exists.");
}
