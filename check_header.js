const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /<body[^>]*>([\s\S]*?)<main/i;
const match = regex.exec(html);
if (match) {
    console.log(match[1].substring(0, 1000));
} else {
    console.log("No match found between body and main");
}
