const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

if (!css.includes('.individual-card.flipped')) {
    css += `\n\n.individual-card.flipped {\n  transform: rotateY(180deg);\n}\n`;
    fs.writeFileSync('style.css', css, 'utf8');
    console.log("Injected CSS.");
} else {
    console.log("Already exists.");
}
