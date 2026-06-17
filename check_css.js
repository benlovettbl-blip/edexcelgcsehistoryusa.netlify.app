const fs = require('fs');
const execSync = require('child_process').execSync;
const html = execSync('git show b6086ac:index.html').toString();

const regex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
    if (match[1].includes('individual')) {
        console.log("Found CSS related to individuals:", match[1]);
    }
}
