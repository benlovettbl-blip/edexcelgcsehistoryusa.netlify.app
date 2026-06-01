const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const { exec } = require('child_process');
const { google } = require('googleapis');

const CLIENT_SECRET_FILE = 'client_secret.json';
const TOKEN_FILE = 'youtube_token.json';
const QUESTIONS_FILE = 'questions.js';

async function main() {
  console.log('====================================================');
  console.log('   GCSE USA History Video Uploader to YouTube       ');
  console.log('====================================================\n');

  // 1. Check for client_secret.json
  if (!fs.existsSync(CLIENT_SECRET_FILE)) {
    console.error(`ERROR: "${CLIENT_SECRET_FILE}" not found in this folder.\n`);
    console.log('To set up YouTube uploads, please do the following:');
    console.log('1. Go to the Google Cloud Console: https://console.cloud.google.com/');
    console.log('2. Create a new project (e.g. "GCSE History App").');
    console.log('3. Search for and enable the "YouTube Data API v3".');
    console.log('4. Go to "APIs & Services" > "Credentials" and click "+ Create Credentials" > "OAuth client ID".');
    console.log('5. Select Application Type: "Web application".');
    console.log('6. Add Authorized Redirect URI: http://localhost:3000/oauth2callback');
    console.log('7. Click Create, then click "Download JSON" and save it as "client_secret.json" in this directory.');
    console.log('\nOnce you have downloaded client_secret.json, run this script again!');
    process.exit(1);
  }

  // 2. Load credentials
  let credentials;
  try {
    const content = fs.readFileSync(CLIENT_SECRET_FILE, 'utf8');
    const parsed = JSON.parse(content);
    credentials = parsed.web || parsed.installed;
    if (!credentials) {
      throw new Error('Invalid client_secret.json structure. Make sure it is downloaded directly from Google Cloud Console.');
    }
  } catch (err) {
    console.error('Failed to parse client_secret.json:', err.message);
    process.exit(1);
  }

  const { client_secret, client_id, redirect_uris } = credentials;
  const redirectUri = 'http://localhost:3000/oauth2callback';
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  // 3. Check for or request token
  if (fs.existsSync(TOKEN_FILE)) {
    console.log('Found existing credentials in', TOKEN_FILE);
    const token = fs.readFileSync(TOKEN_FILE, 'utf8');
    oAuth2Client.setCredentials(JSON.parse(token));
  } else {
    console.log('No token found. Starting OAuth authentication flow...');
    await getNewToken(oAuth2Client);
  }

  const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });

  // 4. Load questions.js and subtopics
  console.log('\nReading questions database...');
  let questionsContent = fs.readFileSync(QUESTIONS_FILE, 'utf8');
  
  const questionsModule = await import('./questions.js');
  const questionsData = questionsModule.QUIZ_DATA;

  const subtopicsToUpload = [];
  
  for (const topic of questionsData) {
    if (topic.subtopics) {
      for (const sub of topic.subtopics) {
        // If youtubeId ends in _yt or starts with subtopic_ or is missing, we need to upload
        const needsUpload = !sub.youtubeId || sub.youtubeId.endsWith('_yt') || sub.youtubeId.startsWith('subtopic_');
        if (needsUpload && sub.embedVideo) {
          // Check if local file exists
          const localPath = path.join(__dirname, 'videos', `${sub.id}.mp4`);
          if (fs.existsSync(localPath)) {
            subtopicsToUpload.push({
              id: sub.id,
              title: sub.title,
              localPath: localPath
            });
          } else {
            console.warn(`WARNING: Missing local video file for ${sub.id} at: ${localPath}`);
          }
        }
      }
    }
  }

  if (subtopicsToUpload.length === 0) {
    console.log('\nAll videos are already uploaded with valid YouTube IDs!');
    console.log('No new videos to upload.');
    process.exit(0);
  }

  console.log(`\nFound ${subtopicsToUpload.length} videos to upload in queue.`);
  console.log('Uploading in progress. Please do not close this window...\n');

  const youtubeIdsMap = {};

  for (let i = 0; i < subtopicsToUpload.length; i++) {
    const item = subtopicsToUpload[i];
    console.log(`[${i + 1}/${subtopicsToUpload.length}] Uploading: ${item.title}`);
    console.log(`   File: ${item.localPath} (${(fs.statSync(item.localPath).size / (1024 * 1024)).toFixed(2)} MB)...`);

    try {
      const res = await youtube.videos.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: item.title,
            description: `Revision video for GCSE History. ${item.title}. Option 33: The USA, 1954-75: Conflict at Home and Abroad.`,
            categoryId: '27' // Education category
          },
          status: {
            privacyStatus: 'unlisted', // Best for embedding inside apps
            selfDeclaredMadeForKids: false
          }
        },
        media: {
          body: fs.createReadStream(item.localPath)
        }
      });

      const videoId = res.data.id;
      console.log(`   SUCCESS! Video ID: ${videoId}\n`);
      youtubeIdsMap[item.id] = videoId;
    } catch (err) {
      console.error(`   FAILED to upload ${item.id}:`, err.message);
      console.log('Stopping queue to prevent half-finished mappings. Please fix the error and run again.\n');
      process.exit(1);
    }
  }

  // 5. Update questions.js file
  console.log('Updating questions.js database with new YouTube IDs...');
  let updatedQuestions = questionsContent;
  let replacementsCount = 0;
  for (const [subtopicId, ytId] of Object.entries(youtubeIdsMap)) {
    const placeholder = `${subtopicId}_yt`;
    if (updatedQuestions.includes(placeholder)) {
      updatedQuestions = updatedQuestions.split(placeholder).join(ytId);
      replacementsCount++;
    }
  }

  fs.writeFileSync(QUESTIONS_FILE, updatedQuestions, 'utf8');
  console.log(`Saved changes to ${QUESTIONS_FILE}. Mapped ${replacementsCount} placeholders to real YouTube IDs.`);

  // 6. Run rebuild
  console.log('\nRunning build to bundle updated assets...');
  exec('npm run build', (err, stdout, stderr) => {
    if (err) {
      console.error('Rebuild failed:', err.message);
    } else {
      console.log(stdout);
      console.log('Build completed successfully!');
      console.log('====================================================');
      console.log('   ALL VIDEOS SUCCESSFULLY UPLOADED & INTEGRATED!   ');
      console.log('====================================================\n');
    }
  });
}

function getNewToken(oAuth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube.upload'],
      prompt: 'consent'
    });

    const server = http.createServer(async (req, res) => {
      try {
        if (req.url.indexOf('/oauth2callback') > -1) {
          const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
          const code = qs.get('code');
          res.end('Authentication successful! You can close this tab and return to the terminal.');
          server.close();

          console.log('Callback received. Exchanging code for tokens...');
          const { tokens } = await oAuth2Client.getToken(code);
          oAuth2Client.setCredentials(tokens);
          
          fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens), 'utf8');
          console.log('Tokens saved to', TOKEN_FILE);
          resolve();
        }
      } catch (e) {
        res.end('Error parsing callback token.');
        reject(e);
      }
    }).listen(3000, () => {
      console.log('\n====================================================');
      console.log('1. A browser window should open to authenticate.');
      console.log('2. If it does not open, copy and paste this link into your browser:');
      console.log('  ', authUrl);
      console.log('====================================================\n');
      
      // Open default browser on Windows
      exec(`start "" "${authUrl}"`);
    });
  });
}

main().catch(err => {
  console.error('Unhandled error in script:', err);
});
