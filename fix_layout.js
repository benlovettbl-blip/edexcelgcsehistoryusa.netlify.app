const fs = require('fs');
let js = fs.readFileSync('src/layout.js', 'utf8');

js = js.replace(/document\.getElementById\('nav-bookmarks'\)\.addEventListener\([\s\S]*?\}\);/g, '');
js = js.replace(/document\.getElementById\('shortcut-bookmarks'\)\.addEventListener\([\s\S]*?\}\);/g, '');

fs.writeFileSync('src/layout.js', js, 'utf8');
console.log("Removed bookmarks listeners from layout.js");
