const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const scopes = [
  "user-read-recently-played",
  "user-top-read",
  "user-read-playback-state",
  "user-read-currently-playing"
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

export const setToken = (token) => {
  localStorage.setItem("spotify_token", token);
};

export const getToken = () => {
  return localStorage.getItem("spotify_token");
};

export const removeToken = () => {
  localStorage.removeItem("spotify_token");
};
