# Refresh Button Setup Guide

This guide explains how to set up the refresh button that triggers the GitHub Actions workflow to update Spotify data.

## Prerequisites

- Node.js installed
- GitHub Personal Access Token with workflow permissions

## Setup Steps

### 1. Create a GitHub Personal Access Token

1. Go to GitHub Settings → [Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "Spotify Dashboard Refresh"
4. Select the following scope:
   - For **public repositories**: `public_repo`
   - For **private repositories**: `repo` (full control)
5. Click "Generate token"
6. **Copy the token immediately** (you won't be able to see it again)

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your GitHub token:
   ```
   GITHUB_TOKEN=ghp_your_token_here
   GITHUB_OWNER=citlalitrigos
   GITHUB_REPO=spotify-dashboard
   PORT=3001
   ```

3. Make sure `.env` is in your `.gitignore` (it should be by default)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

You have two options:

**Option A: Run both frontend and backend together (recommended)**
```bash
npm run dev
```
This will start:
- Backend server on http://localhost:3001
- React frontend on http://localhost:3000

**Option B: Run them separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm start
```

## How It Works

1. Click the refresh button (circular arrow icon) in the header
2. The frontend sends a POST request to the backend server
3. The backend uses GitHub's API to trigger the `update-spotify-data.yml` workflow
4. The workflow runs (takes about 1-2 minutes):
   - Fetches fresh data from Spotify API
   - Updates `src/data/spotify-data.json`
   - Commits and pushes the changes
5. The page automatically reloads after 90 seconds to show the new data

## Troubleshooting

### "GitHub token not configured" error
- Make sure you created the `.env` file with your `GITHUB_TOKEN`
- Restart the server after adding the token

### "Failed to trigger workflow" error
- Verify your GitHub token has the correct permissions
- Check that `GITHUB_OWNER` and `GITHUB_REPO` match your repository
- Ensure the workflow file is named `update-spotify-data.yml`

### Button doesn't work
- Make sure the backend server is running on port 3001
- Check the browser console for error messages
- Verify CORS is not blocking the request

### Workflow doesn't run
- Go to your GitHub repository → Actions tab
- Check if the workflow was triggered
- Review any error messages in the workflow logs

## Security Notes

- Never commit your `.env` file or GitHub token to version control
- The token grants access to your repository, so keep it secure
- You can revoke tokens anytime from GitHub settings
- Consider using a token with minimal required permissions

## API Endpoints

The backend server exposes these endpoints:

- `GET /health` - Health check endpoint
- `POST /api/refresh-spotify-data` - Triggers the GitHub Actions workflow

## Deployment

For production deployment (e.g., Railway, Render, Heroku):

1. Set the `GITHUB_TOKEN` as an environment variable in your hosting platform
2. Set `GITHUB_OWNER` and `GITHUB_REPO` environment variables
3. Deploy the server from the `server/` directory
4. Update the frontend API URL in `src/App.js` to point to your deployed server
