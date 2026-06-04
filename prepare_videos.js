const fs = require('fs');
const path = require('path');

const srcDir = 'G:\\My Drive\\Antigravity Projects\\Paper 3 USA revision App';
const destDir = __dirname;
const videosDest = path.join(destDir, 'videos');

const credentialsMap = [
  { src: path.join(srcDir, 'client_secret.json'), dest: path.join(destDir, 'client_secret.json') },
  { src: path.join(srcDir, '.credentials', 'token.json'), dest: path.join(destDir, 'youtube_token.json') }
];

const videosMap = {
  "subtopic_1_1": "USA resources\\USA\\USA KT1.1 The position of Black Americans in the early 1950s\\A_Nation_Divided.mp4",
  "subtopic_1_2": "USA resources\\USA\\USA KT1.2 Developments in education\\Courtroom_to_Classroom.mp4",
  "subtopic_1_3": "USA resources\\USA\\USA KT1.3 The Montgomery Bus Boycott and its impact, 1955–60\\The_Montgomery_Bus_Boycott.mp4",
  "subtopic_1_4": "USA resources\\USA\\USA KT1.4 Opposition to the civil rights movement\\Opposition_to_Civil_Rights.mp4",
  "subtopic_2_1": "USA resources\\USA\\USA KT2.1 Progress and Developments, 1960–62\\Civil_Rights__1960-1962.mp4",
  "subtopic_2_2": "USA resources\\USA\\USA KT2.2 Peaceful protests and their impact, 1963–65\\Peaceful_Protest__1963-1965.mp4",
  "subtopic_2_3": "USA resources\\USA\\USA KT2.3 Malcolm X and Black Power, 1963–70\\Malcolm_X_&_Black_Power.mp4",
  "subtopic_2_4": "USA resources\\USA\\USA KT2.4 The civil rights movement, 1965–75\\Civil_Rights__1965-1975.mp4",
  "subtopic_3_1": "USA resources\\USA\\USA KT3.1 Reasons for US involvement in the conflict in Vietnam, 1954–63\\3.1 Vietnam__The_Early_Years.mp4",
  "subtopic_3_2": "USA resources\\USA\\USA KT3.2 Escalation of the conflict under Johnson\\3.2 2min vid Escalation_in_Vietnam.mp4",
  "subtopic_3_3": "USA resources\\USA\\USA KT3.3 The nature of the conflict in Vietnam, 1964–68\\3.3 2min vid The_Conflict_in_Vietnam.mp4",
  "subtopic_3_4": "USA resources\\USA\\OneDrive_1_25-02-2026\\High+Quality_2-0_Content_History_HIST_102_GCSEPod_History_102_001_The_Nixon_Doctrine_And_Vietnamisation.mp4",
  "subtopic_4_1": "USA resources\\USA\\USA KT3.3 The nature of the conflict in Vietnam, 1964–68\\The_Tet_Offensive.mp4",
  "subtopic_4_2": "USA resources\\USA\\OneDrive_1_25-02-2026\\High+Quality_2-0_Content_History_HIST_103_GCSEPod_History_103_001_My_Lai_Massacre_1968.mp4",
  "subtopic_4_3": "USA resources\\USA\\OneDrive_1_25-02-2026\\High+Quality_2-0_Content_History_HIST_104_GCSEPod_History_104_001_The_Peace_Process_And_The_End_Of_The_War.mp4",
  "subtopic_4_4": "USA resources\\USA\\OneDrive_1_25-02-2026\\High+Quality_2-0_Content_History_HIST_104_GCSEPod_History_104_002_Reasons_For_The_Failure_Of_The_USA_In_Vietnam.mp4"
};

async function run() {
  // Ensure videos dest exists
  if (!fs.existsSync(videosDest)) {
    fs.mkdirSync(videosDest, { recursive: true });
    console.log(`Created directory: ${videosDest}`);
  }

  // 1. Copy credentials
  console.log('--- Copying credentials ---');
  for (const item of credentialsMap) {
    if (fs.existsSync(item.src)) {
      fs.copyFileSync(item.src, item.dest);
      console.log(`Copied: ${item.src} -> ${item.dest}`);
    } else {
      console.warn(`WARNING: Credentials file not found at: ${item.src}`);
    }
  }

  // 2. Copy and rename videos
  console.log('\n--- Copying overview videos ---');
  for (const [subtopicId, relativePath] of Object.entries(videosMap)) {
    const fullSrc = path.join(srcDir, relativePath);
    const fullDest = path.join(videosDest, `${subtopicId}.mp4`);

    if (fs.existsSync(fullSrc)) {
      console.log(`Copying: ${fullSrc}\n     -> ${fullDest}`);
      fs.copyFileSync(fullSrc, fullDest);
      const sizeMb = (fs.statSync(fullDest).size / (1024 * 1024)).toFixed(2);
      console.log(`SUCCESS: Copied ${subtopicId}.mp4 (${sizeMb} MB)`);
    } else {
      console.error(`ERROR: Source video file not found at: ${fullSrc}`);
    }
  }

  console.log('\nDone preparing videos.');
}

run().catch(err => {
  console.error('Error preparing videos:', err);
});
