const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Spotify API credentials from environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    }
  );
  return response.data.access_token;
}

async function fetchSpotifyData(accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // Fetch recently played tracks
    const recentlyPlayed = await axios.get(
      'https://api.spotify.com/v1/me/player/recently-played?limit=50',
      { headers }
    );

    // Fetch top artists (last 4 weeks)
    const topArtists = await axios.get(
      'https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term',
      { headers }
    );

    // Fetch top tracks (last 4 weeks)
    const topTracks = await axios.get(
      'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term',
      { headers }
    );

    // Process the data
    const recentTrack = recentlyPlayed.data.items[0];
    const data = {
      lastUpdated: new Date().toISOString(),
      recentTrack: {
        name: recentTrack.track.name,
        artist: recentTrack.track.artists[0].name,
        playedAt: recentTrack.played_at,
        url: recentTrack.track.external_urls.spotify,
      },
      stats: calculateStats(recentlyPlayed.data.items, topArtists.data.items, topTracks.data.items),
    };

    return data;
  } catch (error) {
    console.error('Error fetching Spotify data:', error.response?.data || error.message);
    throw error;
  }
}

function calculateStats(recentTracks, topArtists, topTracks) {
  // Calculate listening statistics
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const last30Days = recentTracks.filter(item =>
    new Date(item.played_at) > thirtyDaysAgo
  );

  // Total tracks played in last 30 days
  const tracksPlayed = last30Days.length;

  // Calculate listening time (average 3.5 minutes per track)
  const listeningMinutes = tracksPlayed * 3.5;
  const listeningHours = Math.round(listeningMinutes / 60);

  // Unique artists
  const uniqueArtists = new Set(last30Days.map(item => item.track.artists[0].id)).size;

  // Top artist
  const topArtist = topArtists.length > 0 ? topArtists[0].name : 'N/A';

  // Daily average
  const dailyAverage = Math.round(tracksPlayed / 30);

  // Calculate most played track
  const trackCounts = {};
  last30Days.forEach(item => {
    const trackId = item.track.id;
    trackCounts[trackId] = trackCounts[trackId] || { count: 0, name: item.track.name };
    trackCounts[trackId].count++;
  });

  const mostPlayed = Object.values(trackCounts).sort((a, b) => b.count - a.count)[0];
  const repeatRate = mostPlayed ? Math.round((mostPlayed.count / tracksPlayed) * 100) : 0;

  // Calculate peak listening hour
  const hourCounts = new Array(24).fill(0);
  last30Days.forEach(item => {
    const hour = new Date(item.played_at).getHours();
    hourCounts[hour]++;
  });
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  const peakHourFormatted = peakHour > 12 ? `${peakHour - 12}pm` : `${peakHour}am`;

  return {
    tracksPlayed,
    listeningHours,
    uniqueArtists,
    topArtist,
    dailyAverage,
    repeatRate,
    mostPlayedTrack: mostPlayed?.name || 'N/A',
    mostPlayedCount: mostPlayed?.count || 0,
    peakHour: peakHourFormatted,
  };
}

async function main() {
  try {
    console.log('Fetching Spotify data...');
    const accessToken = await getAccessToken();
    const data = await fetchSpotifyData(accessToken);

    // Save to file
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, 'spotify-data.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log('Spotify data saved successfully!');
    console.log(`Last track: ${data.recentTrack.name} by ${data.recentTrack.artist}`);
  } catch (error) {
    console.error('Failed to fetch Spotify data:', error.message);
    process.exit(1);
  }
}

main();
