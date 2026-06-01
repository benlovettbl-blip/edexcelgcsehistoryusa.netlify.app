const fs = require('fs');
const http = require('http');
const url = require('url');
const { exec } = require('child_process');
const { google } = require('googleapis');

const CLIENT_SECRET_FILE = 'client_secret.json';
const TOKEN_FILE = 'youtube_token.json';

const VIDEO_IDS = [
  'qui3PrFBKeo', 'IrEAKGcOLLI', 'TeZYmbdSDSo', '0GHTzCXSIVY',
  'v3Hv5oaqVI8', '-96L7OowcLk', 'MbTGxzAwYRY', 'TNcj1yGz5bQ',
  'xq2ExDeu1N8', 'c--krABWVnk', 'yjuL5sPSuNA', 'CQZrwd2Lzeo',
  'ZQGAiaS7W6s', 'G77FIuQyZlI', 'Hizq4lyFnVU', 'Lb21pTRkUsg'
];

async function main() {
  console.log('====================================================');
  console.log('   GCSE USA History YouTube Video Deleter           ');
  console.log('====================================================\n');

  if (!fs.existsSync(CLIENT_SECRET_FILE)) {
    console.error(`ERROR: client_secret.json not found.`);
    process.exit(1);
  }

  // Load credentials
  const content = fs.readFileSync(CLIENT_SECRET_FILE, 'utf8');
  const parsed = JSON.parse(content);
  const credentials = parsed.web || parsed.installed;
  const { client_secret, client_id } = credentials;
  const redirectUri = 'http://localhost:3000/oauth2callback';
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  if (!fs.existsSync(TOKEN_FILE)) {
    console.error('ERROR: youtube_token.json not found.');
    process.exit(1);
  }

  const token = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  oAuth2Client.setCredentials(token);

  // Try to delete using current credentials
  try {
    await deleteVideos(oAuth2Client);
  } catch (err) {
    if (err.message.includes('insufficient') || err.code === 403 || err.message.toLowerCase().includes('scope')) {
      console.log('\nCurrent scope is insufficient to delete videos. Requesting full YouTube scope...');
      await getNewToken(oAuth2Client);
      await deleteVideos(oAuth2Client);
    } else {
      console.error('Error during deletion:', err);
    }
  }
}

async function deleteVideos(auth) {
  const youtube = google.youtube({ version: 'v3', auth });

  console.log(`Starting deletion of ${VIDEO_IDS.length} videos from YouTube...`);
  for (let i = 0; i < VIDEO_IDS.length; i++) {
    const videoId = VIDEO_IDS[i];
    console.log(`[${i + 1}/${VIDEO_IDS.length}] Deleting video ID: ${videoId}...`);
    try {
      await youtube.videos.delete({
        id: videoId
      });
      console.log(`   SUCCESS: Deleted video ${videoId}`);
    } catch (err) {
      if (err.code === 404) {
        console.log(`   INFO: Video ${videoId} already deleted or not found.`);
      } else {
        throw err;
      }
    }
  }
  console.log('\nAll deletions completed successfully.');
}

function getNewToken(oAuth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube'], // Full YouTube scope
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
          console.log('Tokens updated and saved to', TOKEN_FILE);
          resolve();
        }
      } catch (e) {
        res.end('Error parsing callback token.');
        reject(e);
      }
    }).listen(3000, () => {
      console.log('\n====================================================');
      console.log('1. A browser window should open to authorize.');
      console.log('2. If it does not open, copy and paste this link:');
      console.log('  ', authUrl);
      console.log('====================================================\n');
      exec(`start "" "${authUrl}"`);
    });
  });
}

main().catch(err => {
  console.error('Fatal error:', err.message);
});
