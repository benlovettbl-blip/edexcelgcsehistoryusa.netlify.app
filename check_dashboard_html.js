const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<section class="content-view active" id="view-dashboard"[\s\S]*?<!-- Study Center Quick Navigation -->/i;
const match = regex.exec(html);
if (match) {
    console.log(match[0]);
}
