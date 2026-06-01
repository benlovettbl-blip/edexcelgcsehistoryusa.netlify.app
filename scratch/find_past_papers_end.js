const fs = require('fs');
const content = fs.readFileSync('questions.js', 'utf8');

// Find the index of the start of the mock exam dynamic registration
const idx = content.indexOf('// Dynamically register the mock exams');
console.log("Marker index:", idx);
if (idx !== -1) {
  // Print 500 characters before the marker
  console.log("=== 500 CHARS BEFORE MARKER ===");
  console.log(content.substring(idx - 500, idx));
}
