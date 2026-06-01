const fs = require('fs');

const years = ['2022', '2023', '2024', '2025'];
let outText = '';

for (const y of years) {
    const qContent = fs.readFileSync(`scratch/${y}_que.txt`, 'utf8');
    const mContent = fs.readFileSync(`scratch/${y}_rms.txt`, 'utf8');
    
    outText += `\n========================================================================\n`;
    outText += `YEAR: ${y}\n`;
    outText += `========================================================================\n`;
    
    // Find Q1 Source
    const sourceAMatch = qContent.match(/Source A:\s*([\s\S]*?)(?=\r?\n\r?\n|\r?\n\d|\r?\nCentre|\r?\n\*|\r?\n\s*[1-3]\s+Give|\r?\n\s*[1-3]\s*Give)/i);
    outText += "Source A Info:\n";
    if (sourceAMatch) {
        outText += sourceAMatch[1].trim() + "\n";
    } else {
        outText += "Not found automatically\n";
    }
    
    // Find Q1 Question
    const q1Match = qContent.match(/\d\s+Give\s+two\s+things[\s\S]*?marks\)/i) || qContent.match(/\d\s+Give\s+two\s+things[\s\S]*?(?=\r?\n\r?\n|\r?\n\d|\r?\n\*)/i);
    outText += "Q1 Question:\n";
    if (q1Match) {
        outText += q1Match[0].trim().replace(/\s+/g, ' ') + "\n";
    }
    
    // Find Q2 Question and Stimulus
    const q2Match = qContent.match(/Explain why[\s\S]*?You must also use/i);
    outText += "Q2 Question and Stimulus:\n";
    if (q2Match) {
        outText += q2Match[0].trim().replace(/\s+/g, ' ') + "\n";
    } else {
        // Try alternate match
        const q2Alt = qContent.match(/2\s*\(a\)\s*Explain why[\s\S]*?(?=\r?\nSECTION B|\r?\n3\s+\(a\))/i);
        if (q2Alt) {
            outText += q2Alt[0].trim().replace(/\s+/g, ' ') + "\n";
        }
    }
    
    // Find Source B and C
    const sourceBMatch = qContent.match(/Source B:\s*([\s\S]*?)(?=Source C:)/i);
    const sourceCMatch = qContent.match(/Source C:\s*([\s\S]*?)(?=Interpretation 1:)/i);
    outText += "Source B:\n";
    if (sourceBMatch) outText += sourceBMatch[1].trim() + "\n";
    outText += "Source C:\n";
    if (sourceCMatch) outText += sourceCMatch[1].trim() + "\n";
    
    // Find Interpretations
    const int1Match = qContent.match(/Interpretation 1:\s*([\s\S]*?)(?=Interpretation 2:)/i);
    const int2Match = qContent.match(/Interpretation 2:\s*([\s\S]*?)(?=\r?\n\r?\n|\r?\n\d|\r?\n\*|\r?\nBLANK PAGE|\r?\nAcknowledgements)/i);
    outText += "Interpretation 1:\n";
    if (int1Match) outText += int1Match[1].trim() + "\n";
    outText += "Interpretation 2:\n";
    if (int2Match) outText += int2Match[1].trim() + "\n";
    
    // Find Q3 Questions
    const q3aMatch = qContent.match(/3\s*\(a\)[\s\S]*?\(8\)/i);
    const q3bMatch = qContent.match(/\(b\)[\s\S]*?\(4\)/i);
    const q3cMatch = qContent.match(/\(c\)[\s\S]*?\(4\)/i);
    const q3dMatch = qContent.match(/\(d\)[\s\S]*?\(16\)/i);
    
    outText += "Q3a:\n";
    if (q3aMatch) outText += q3aMatch[0].trim().replace(/\s+/g, ' ') + "\n";
    outText += "Q3b:\n";
    if (q3bMatch) outText += q3bMatch[0].trim().replace(/\s+/g, ' ') + "\n";
    outText += "Q3c:\n";
    if (q3cMatch) outText += q3cMatch[0].trim().replace(/\s+/g, ' ') + "\n";
    outText += "Q3d:\n";
    if (q3dMatch) outText += q3dMatch[0].trim().replace(/\s+/g, ' ') + "\n";
}

fs.writeFileSync('scratch/extracted_clean_details.txt', outText, 'utf8');
console.log("Successfully wrote extracted details to scratch/extracted_clean_details.txt");
