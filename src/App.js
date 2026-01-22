import './App.css';

function App() {
  return (
    <div className="App">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <div className="logo-container">
              <div className="logo-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" stroke="#1DB954" strokeWidth="2"/>
                  <path d="M8 9.5C8 8.67157 8.67157 8 9.5 8H14.5C15.3284 8 16 8.67157 16 9.5V14.5C16 15.3284 15.3284 16 14.5 16H9.5C8.67157 16 8 15.3284 8 14.5V9.5Z" fill="#8B5CF6"/>
                </svg>
              </div>
              <div className="logo-text-group">
                <h1 className="logo-text">Lali's Spotify Dash</h1>
                <p className="header-subtitle">
                  UI built with <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="inline-link">React</a> • Data from <a href="https://developer.spotify.com/documentation/web-api" target="_blank" rel="noopener noreferrer" className="inline-link">Spotify API</a> • Last updated: Jan 22, 2026
                </p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <a
              href="https://github.com/citrigos/spotify-dash"
              target="_blank"
              rel="noopener noreferrer"
              className="github-icon-link"
              aria-label="View on GitHub"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </header>

        <main className="dashboard-main">
          <a
            href="https://open.spotify.com/search/Lover%2C%20You%20Should%27ve%20Come%20Over%20Jeff%20Buckley"
            target="_blank"
            rel="noopener noreferrer"
            className="recent-track"
          >
            <div className="recent-track-label">Last played</div>
            <div className="recent-track-info">
              <div className="recent-track-details">
                <div className="recent-track-name">Lover, You Should've Come Over</div>
                <div className="recent-track-artist">Jeff Buckley</div>
              </div>
              <div className="recent-track-time">2 hours ago</div>
            </div>
            <div className="play-hint">Click to play on Spotify</div>
          </a>

          <div className="stats-section">
            <h2 className="section-title">Last 30 Days</h2>
            <div className="stats-grid">
              <div className="stat-card purple">
                <div className="stat-icon">🎵</div>
                <div className="stat-content">
                  <h3 className="stat-value">847</h3>
                  <p className="stat-label">Tracks Played</p>
                </div>
              </div>

              <div className="stat-card silver">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <h3 className="stat-value">43hrs</h3>
                  <p className="stat-label">Listening Time</p>
                </div>
              </div>

              <div className="stat-card green">
                <div className="stat-icon">🎤</div>
                <div className="stat-content">
                  <h3 className="stat-value">156</h3>
                  <p className="stat-label">Unique Artists</p>
                </div>
              </div>

              <div className="stat-card dark">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3 className="stat-value">28/day</h3>
                  <p className="stat-label">Daily Average</p>
                </div>
              </div>

              <div className="stat-card purple-alt">
                <div className="stat-icon">🔁</div>
                <div className="stat-content">
                  <h3 className="stat-value">73%</h3>
                  <p className="stat-label">Repeat Rate</p>
                </div>
              </div>

              <div className="stat-card green-alt">
                <div className="stat-icon">🌙</div>
                <div className="stat-content">
                  <h3 className="stat-value">11pm</h3>
                  <p className="stat-label">Peak Hour</p>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;
