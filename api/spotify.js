// Vercel Serverless Function - Fetches fresh Spotify data on every request
// This runs on Vercel's edge, keeping your credentials secure

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return res.status(500).json({ error: 'Missing Spotify credentials in environment variables' });
  }

  try {
    // Get fresh access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to refresh access token');
    }

    const { access_token } = await tokenResponse.json();

    // Fetch all Spotify data in parallel
    const headers = { Authorization: `Bearer ${access_token}` };

    const [recentlyPlayed, topArtists, topTracks] = await Promise.all([
      fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', { headers }).then(r => r.json()),
      fetch('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term', { headers }).then(r => r.json()),
      fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term', { headers }).then(r => r.json()),
    ]);

    // Process recent tracks
    const recentTracks = recentlyPlayed.items.slice(0, 4).map(item => ({
      name: item.track.name,
      artist: item.track.artists[0].name,
      playedAt: item.played_at,
      url: item.track.external_urls.spotify,
    }));

    // Calculate stats
    const stats = calculateStats(recentlyPlayed.items, topArtists.items || [], topTracks.items || []);

    const data = {
      lastUpdated: new Date().toISOString(),
      recentTracks,
      stats,
    };

    // Cache for 60 seconds to avoid rate limiting, but still fresh on each visit
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Spotify API error:', error);
    return res.status(500).json({ error: 'Failed to fetch Spotify data', details: error.message });
  }
}

function calculateStats(recentTracks, topArtists, topTracks) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const last30Days = recentTracks.filter(item =>
    new Date(item.played_at) > thirtyDaysAgo
  );

  const tracksPlayed = last30Days.length;
  const listeningMinutes = tracksPlayed * 3.5;
  const listeningHours = Math.round(listeningMinutes / 60);

  const uniqueArtists = new Set(last30Days.map(item => item.track.artists[0].id)).size;
  const topArtist = topArtists.length > 0 ? topArtists[0].name : 'N/A';
  const dailyAverage = Math.round(tracksPlayed / 30);

  // Most played track
  const trackCounts = {};
  last30Days.forEach(item => {
    const trackId = item.track.id;
    trackCounts[trackId] = trackCounts[trackId] || { count: 0, name: item.track.name };
    trackCounts[trackId].count++;
  });

  const mostPlayed = Object.values(trackCounts).sort((a, b) => b.count - a.count)[0];
  const repeatRate = mostPlayed ? Math.round((mostPlayed.count / tracksPlayed) * 100) : 0;

  // Peak listening hour
  const hourCounts = new Array(24).fill(0);
  last30Days.forEach(item => {
    const hour = new Date(item.played_at).getHours();
    hourCounts[hour]++;
  });
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  const peakHourFormatted = peakHour > 12 ? `${peakHour - 12}pm` : peakHour === 0 ? '12am' : `${peakHour}am`;

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
