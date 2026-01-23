# Quick Guide: Get Your Spotify Refresh Token

## Prerequisites
You already have:
- ✅ Client ID: `31f2bf04985b4181b630545ae8cdef29`
- ❓ Client Secret: (from your Spotify Developer Dashboard)

## Step-by-Step Instructions

### 1. Add Redirect URI to Spotify App

1. Go to your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/31f2bf04985b4181b630545ae8cdef29)
2. Click "Edit Settings"
3. Under "Redirect URIs", add: `http://127.0.0.1:3001/callback`
4. Click "Add" then "Save"

### 2. Get Your Client Secret

1. On the same Spotify app page, note your **Client Secret** (you may need to click "Show Client Secret")
2. Keep this secret - you'll need it in the next step

### 3. Run the Token Generator

In your terminal, run:

```bash
SPOTIFY_CLIENT_ID=31f2bf04985b4181b630545ae8cdef29 SPOTIFY_CLIENT_SECRET=your_client_secret_here node scripts/get-refresh-token.js
```

Replace `your_client_secret_here` with your actual Client Secret.

### 4. Authorize in Browser

1. Your browser will open automatically
2. Log in to Spotify if needed
3. Click "Agree" to authorize the app
4. You'll be redirected back to localhost

### 5. Copy Your Refresh Token

Your terminal will display:

```
✅ SUCCESS! Here is your refresh token:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AQD...your_long_refresh_token...xyz
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Copy this entire token!

### 6. Add Secrets to GitHub

1. Go to https://github.com/citrigos/spotify-dash/settings/secrets/actions
2. Click "New repository secret" and add these three secrets:

| Name | Value |
|------|-------|
| `SPOTIFY_CLIENT_ID` | `31f2bf04985b4181b630545ae8cdef29` |
| `SPOTIFY_CLIENT_SECRET` | Your Client Secret from Step 2 |
| `SPOTIFY_REFRESH_TOKEN` | The long token from Step 5 |

### 7. Enable GitHub Pages

1. Go to https://github.com/citrigos/spotify-dash/settings/pages
2. Under "Build and deployment", set Source to: **GitHub Actions**
3. Save

### 8. Trigger the Data Fetch

1. Go to https://github.com/citrigos/spotify-dash/actions
2. Click on "Update Spotify Data" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait for it to complete (about 1-2 minutes)
5. The "Deploy to GitHub Pages" workflow will run automatically

### 9. View Your Dashboard

Your live dashboard will be at:
**https://citrigos.github.io/spotify-dash/**

The data will automatically update every 6 hours!

## Troubleshooting

**Browser doesn't open?**
- Manually navigate to the URL printed in the terminal

**"Invalid client" error?**
- Double-check your Client Secret is correct

**No refresh token appears?**
- Make sure you clicked "Agree" in the browser
- Check that the redirect URI `http://127.0.0.1:3001/callback` is added to your Spotify app settings
