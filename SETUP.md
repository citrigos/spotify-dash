# Setup Instructions

This dashboard automatically fetches your Spotify data using GitHub Actions and deploys to GitHub Pages.

## Step 1: Get Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app (or use your existing app)
3. Note your **Client ID** and **Client Secret**
4. Add `http://127.0.0.1:3001/callback` to the Redirect URIs in your app settings

## Step 2: Get Your Refresh Token

You need to get a refresh token that GitHub Actions can use to fetch your data without requiring login.

1. Run the refresh token generator script:
```bash
SPOTIFY_CLIENT_ID=your_client_id SPOTIFY_CLIENT_SECRET=your_client_secret node scripts/get-refresh-token.js
```

2. This will open your browser - authorize the app
3. The refresh token will be displayed in your terminal
4. Copy the **refresh_token** for the next step

## Step 3: Add GitHub Secrets

1. Go to your GitHub repository settings
2. Navigate to **Settings > Secrets and variables > Actions**
3. Add the following secrets:
   - `SPOTIFY_CLIENT_ID`: Your Spotify Client ID
   - `SPOTIFY_CLIENT_SECRET`: Your Spotify Client Secret
   - `SPOTIFY_REFRESH_TOKEN`: The refresh token from Step 2

## Step 4: Enable GitHub Pages

1. Go to **Settings > Pages**
2. Under "Build and deployment":
   - Source: **GitHub Actions**
3. Save

## Step 5: Trigger the Workflow

1. Go to **Actions** tab
2. Click on "Update Spotify Data" workflow
3. Click "Run workflow" to fetch your data for the first time
4. Once complete, the "Deploy to GitHub Pages" workflow will run automatically

Your dashboard will be live at: `https://your-username.github.io/spotify-dash/`

## Automatic Updates

The GitHub Action runs every 6 hours to fetch fresh Spotify data. You can also manually trigger it from the Actions tab.

## Local Development

To run locally with your actual data:

1. Run the data fetch script:
```bash
SPOTIFY_CLIENT_ID=your_id SPOTIFY_CLIENT_SECRET=your_secret SPOTIFY_REFRESH_TOKEN=your_token node scripts/fetch-spotify-data.js
```

2. Start the dev server:
```bash
npm start
```

The app will read from the generated `src/data/spotify-data.json` file.
