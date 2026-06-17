const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<header class="main-header">[\s\S]*?<\/header>/i;
const match = regex.exec(html);
if (match) {
    console.log(match[0]);
}
