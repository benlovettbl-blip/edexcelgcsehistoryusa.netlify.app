const fs = require('fs');
const http = require('http');
const url = require('url');
const { exec } = require('child_process');
const { google } = require('googleapis');

const CLIENT_SECRET_FILE = 'client_secret.json';
const TOKEN_FILE = 'youtube_token.json';

const VIDEO_IDS = [
  'dKyYlye0c6Q', 'mI09vVUs0FQ', 'AiLWOcVNDEQ', 'qML-X9i7_3w',
  '8ufqX4wmvgc', 'xW9k63w-TRM', 'fX-zU1nl-zU', 'Fq8hWqOlF-A',
  'fVRaO3QW6fU', 'lYzopF_Tg7s', 'L21k5Bh_hHo', 'yTZzZlLoE84',
  'KYE62XVdcrY', '7qrPo5ASv-o', 'q69gxI2U9QE', 'KqsDh0eUc2M'
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
    const isAuthError = err.message.includes('insufficient') || 
                        err.code === 403 || 
                        err.code === 401 ||
                        err.code === 400 ||
                        err.message.includes('invalid_grant') ||
                        err.message.toLowerCase().includes('scope');
    if (isAuthError) {
      console.log('\nCurrent credentials are insufficient or expired. Requesting full YouTube scope...');
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
