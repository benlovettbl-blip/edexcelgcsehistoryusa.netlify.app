const fs = require('fs');

let lessons = fs.readFileSync('src/lessons_data.js', 'utf8');
lessons = lessons.replace(/Orthodox historians/g, "Traditional historians");
lessons = lessons.replace(/orthodox historians/g, "traditional historians");
lessons = lessons.replace(/revisionist military historians/g, "alternative military historians");
lessons = lessons.replace(/non-violent orthodoxy/g, "traditional non-violent approach");
fs.writeFileSync('src/lessons_data.js', lessons, 'utf8');

let views = fs.readFileSync('src/views.js', 'utf8');
views = views.replace(/orthodox vs revisionist/g, "traditional vs alternative interpretations");
fs.writeFileSync('src/views.js', views, 'utf8');

let analysis = fs.readFileSync('../brain/64e7abdd-b49b-4734-ab5c-04d1694afb55/analysis_results.md', 'utf8');
// Fix narrative account part
analysis = analysis.replace('“Write a narrative account analyzing…” [8 marks]', '“How useful are Sources B and C for an enquiry into…” [8 marks]');
analysis = analysis.replace('“Write a narrative account analyzing…”', '“How useful are Sources B and C for an enquiry into…”');
fs.writeFileSync('../brain/64e7abdd-b49b-4734-ab5c-04d1694afb55/analysis_results.md', analysis, 'utf8');

console.log("Updated terminology and fixed analysis report.");
