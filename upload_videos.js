const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const { exec } = require('child_process');
const { google } = require('googleapis');

const CLIENT_SECRET_FILE = 'client_secret.json';
const TOKEN_FILE = 'youtube_token.json';
const VIDEOS_DATA_FILE = path.join(__dirname, 'src', 'videos_data.js');

async function main() {
  console.log('====================================================');
  console.log('   GCSE USA History Video Uploader to YouTube       ');
  console.log('====================================================\n');

  // 1. Check for client_secret.json
  if (!fs.existsSync(CLIENT_SECRET_FILE)) {
    console.error(`ERROR: "${CLIENT_SECRET_FILE}" not found in this folder.\n`);
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

  const { client_secret, client_id } = credentials;
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

  // 4. Load src/videos_data.js
  console.log('\nReading src/videos_data.js database...');
  const videosDataContent = fs.readFileSync(VIDEOS_DATA_FILE, 'utf8');
  
  // Find JSON inside export statement
  const jsonStartIndex = videosDataContent.indexOf('{');
  const jsonEndIndex = videosDataContent.lastIndexOf('}') + 1;
  if (jsonStartIndex === -1 || jsonEndIndex === -1) {
    console.error('ERROR: Could not parse json out of src/videos_data.js');
    process.exit(1);
  }
  
  const jsonText = videosDataContent.substring(jsonStartIndex, jsonEndIndex);
  const videosData = JSON.parse(jsonText);

  const subtopicsToUpload = [];
  
  for (const subtopicId of Object.keys(videosData)) {
    const localPath = path.join(__dirname, 'videos', `${subtopicId}.mp4`);
    if (fs.existsSync(localPath)) {
      subtopicsToUpload.push({
        id: subtopicId,
        title: videosData[subtopicId].primary.video_title,
        localPath: localPath
      });
    } else {
      console.warn(`WARNING: Local video file not found for ${subtopicId} at: ${localPath}`);
    }
  }

  if (subtopicsToUpload.length === 0) {
    console.log('\nNo videos to upload. Make sure .mp4 files are in /videos/');
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

  // 5. Update videosData and save back to src/videos_data.js
  console.log('Updating src/videos_data.js database with new YouTube IDs...');
  for (const [subtopicId, ytId] of Object.entries(youtubeIdsMap)) {
    if (videosData[subtopicId] && videosData[subtopicId].primary) {
      videosData[subtopicId].primary.youtube_url = `https://www.youtube.com/watch?v=${ytId}`;
    }
  }

  const updatedContent = `export const VIDEOS_DATA = ${JSON.stringify(videosData, null, 2)};\n`;
  fs.writeFileSync(VIDEOS_DATA_FILE, updatedContent, 'utf8');
  console.log(`Saved changes to ${VIDEOS_DATA_FILE}. Mapped ${Object.keys(youtubeIdsMap).length} subtopics to real YouTube IDs.`);

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
      
      exec(`start "" "${authUrl}"`);
    });
  });
}

main().catch(err => {
  console.error('Unhandled error in script:', err);
});
