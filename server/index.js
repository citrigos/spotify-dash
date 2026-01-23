const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Trigger GitHub Actions workflow
app.post('/api/refresh-spotify-data', async (req, res) => {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER || 'citlalitrigos'; // Update with your GitHub username
    const repo = process.env.GITHUB_REPO || 'spotify-dashboard'; // Update with your repo name

    if (!githubToken) {
      return res.status(500).json({
        error: 'GitHub token not configured',
        message: 'Please set GITHUB_TOKEN in your .env file'
      });
    }

    // Trigger the workflow using GitHub Actions API
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/update-spotify-data.yml/dispatches`,
      { ref: 'main' },
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Workflow triggered successfully');
    res.json({
      success: true,
      message: 'Spotify data refresh initiated. This may take 1-2 minutes to complete.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error triggering workflow:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to trigger workflow',
      message: error.response?.data?.message || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
