const fs = require('fs');
const path = require('path');

function extractYearData(year) {
    const qFile = `scratch/${year}_que.txt`;
    const mFile = `scratch/${year}_rms.txt`;
    
    if (!fs.existsSync(qFile) || !fs.existsSync(mFile)) {
        return `Files missing for ${year}`;
    }
    
    const qContent = fs.readFileSync(qFile, 'utf8');
    const mContent = fs.readFileSync(mFile, 'utf8');
    
    return `
=========================================
YEAR: ${year}
=========================================

--- QUESTION PAPER ---
${qContent.substring(0, 1000)}
... [TRUNCATED] ...
${qContent.substring(qContent.length - 3000)}

--- MARK SCHEME ---
${mContent.substring(0, 1500)}
... [TRUNCATED] ...
${mContent.substring(mContent.length - 4000)}
`;
}

let output = '';
for (const y of ['2022', '2023', '2024', '2025']) {
    output += extractYearData(y);
}

fs.writeFileSync('scratch/all_papers_details.txt', output, 'utf8');
console.log("Compiled details to scratch/all_papers_details.txt");
