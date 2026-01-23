const http = require('http');
const url = require('url');
const { exec } = require('child_process');

// You'll need to update these with your actual values
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const PORT = 8888;

const scopes = [
  'user-read-recently-played',
  'user-top-read',
  'user-read-playback-state',
  'user-read-currently-playing'
];

const authUrl = `https://accounts.spotify.com/authorize?` +
  `client_id=${CLIENT_ID}&` +
  `response_type=code&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `scope=${encodeURIComponent(scopes.join(' '))}`;

console.log('\n🎵 Spotify Refresh Token Generator\n');
console.log('Step 1: Opening browser for Spotify authorization...\n');

// Create server to handle callback
const server = http.createServer(async (req, res) => {
  const queryData = url.parse(req.url, true).query;

  if (queryData.code) {
    console.log('✓ Authorization code received!\n');

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: queryData.code,
          redirect_uri: REDIRECT_URI
        })
      });

      const tokens = await tokenResponse.json();

      if (tokens.refresh_token) {
        console.log('✅ SUCCESS! Here is your refresh token:\n');
        console.log('━'.repeat(60));
        console.log(tokens.refresh_token);
        console.log('━'.repeat(60));
        console.log('\n📋 Copy the token above and add it to your GitHub repository secrets as:');
        console.log('   SPOTIFY_REFRESH_TOKEN\n');
        console.log('Also add these secrets:');
        console.log(`   SPOTIFY_CLIENT_ID: ${CLIENT_ID}`);
        console.log(`   SPOTIFY_CLIENT_SECRET: ${CLIENT_SECRET}\n`);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: Arial; padding: 50px; text-align: center;">
              <h1 style="color: #1DB954;">✅ Success!</h1>
              <p>Your refresh token has been generated.</p>
              <p>Check your terminal for the token.</p>
              <p style="color: #666; margin-top: 40px;">You can close this window.</p>
            </body>
          </html>
        `);
      } else {
        throw new Error('No refresh token received');
      }
    } catch (error) {
      console.error('❌ Error getting tokens:', error.message);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1 style="color: red;">❌ Error</h1>
            <p>Failed to get refresh token. Check your terminal for details.</p>
          </body>
        </html>
      `);
    }

    setTimeout(() => {
      server.close();
      process.exit(0);
    }, 1000);
  } else if (queryData.error) {
    console.error('❌ Authorization failed:', queryData.error);
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <body style="font-family: Arial; padding: 50px; text-align: center;">
          <h1 style="color: red;">❌ Authorization Failed</h1>
          <p>${queryData.error}</p>
        </body>
      </html>
    `);
    setTimeout(() => {
      server.close();
      process.exit(1);
    }, 1000);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}\n`);
  console.log('Opening browser...\n');

  // Open browser based on platform
  const command = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${command} "${authUrl}"`);
});
