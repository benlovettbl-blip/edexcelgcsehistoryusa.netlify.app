const fs = require('fs');

function inspectAllQ3() {
    const content = fs.readFileSync('scratch/2025_que.txt', 'utf8');
    const lines = content.split('\n');
    console.log("=== 2025 LINES 450 to 550 ===");
    for (let i = 450; i < 550; i++) {
        if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
    }
}

inspectAllQ3();
