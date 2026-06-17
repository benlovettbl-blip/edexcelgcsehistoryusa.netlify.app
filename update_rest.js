const fs = require('fs');
let lessons = fs.readFileSync('src/lessons.js', 'utf8');
lessons = lessons.replace(/"orthodox":/g, '"traditional":');
lessons = lessons.replace(/"revisionist":/g, '"alternative":');
lessons = lessons.replace(/orthodox views/g, 'traditional views');
fs.writeFileSync('src/lessons.js', lessons, 'utf8');

let style = fs.readFileSync('style.css', 'utf8');
style = style.replace(/\.orthodox/g, '.traditional');
style = style.replace(/\.revisionist/g, '.alternative');
fs.writeFileSync('style.css', style, 'utf8');
console.log("Updated lessons.js and style.css");
