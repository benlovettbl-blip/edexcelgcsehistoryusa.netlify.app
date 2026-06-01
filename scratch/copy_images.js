const fs = require('fs');
const path = require('path');

const srcFiles = {
  mlk: 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\647b312b-6ed3-4ff0-8837-e204b6f5134c\\mlk_boycott_speech_1780218140025.png',
  manifesto: 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\647b312b-6ed3-4ff0-8837-e204b6f5134c\\manifesto_signing_1780218154034.png',
  troops: 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\647b312b-6ed3-4ff0-8837-e204b6f5134c\\troops_bogged_down_1780218170485.png'
};

const destFiles = {
  mlk: 'c:\\Users\\fives\\.gemini\\antigravity\\scratch\\paper3_usa_recall_quizzes\\assets\\sources\\mlk-boycott-speech-1955.jpg',
  manifesto: 'c:\\Users\\fives\\.gemini\\antigravity\\scratch\\paper3_usa_recall_quizzes\\assets\\sources\\southern-manifesto-signing.jpg',
  troops: 'c:\\Users\\fives\\.gemini\\antigravity\\scratch\\paper3_usa_recall_quizzes\\assets\\sources\\us-troops-bogged-down.jpg'
};

console.log("Copying generated images...");
for (const [key, srcPath] of Object.entries(srcFiles)) {
  const destPath = destFiles[key];
  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Copied ${key} to ${destPath}`);
    } catch (err) {
      console.error(`❌ Failed to copy ${key}: ${err.message}`);
    }
  } else {
    console.error(`❌ Source file does not exist: ${srcPath}`);
  }
}
