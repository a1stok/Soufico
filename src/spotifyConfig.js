const HOSTNAME = window.location.hostname;

export const SPOTIFY_CLIENT_ID = "d92a7f2077fc4808b52b7afb9938459e";
export const SPOTIFY_CLIENT_SECRET = "d206c0bbe9474edcb28741f3e09fe3dc";

export const SPOTIFY_REDIRECT_URI =
  HOSTNAME === "localhost"
    ? "http://localhost:3000/callback"
    : HOSTNAME === "soufico.onrender.com"
    ? "https://soufico.onrender.com/callback"
    : "https://flowershop-3e9f1.web.app/callback";

export const SPOTIFY_SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private"
];

export const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
  SPOTIFY_REDIRECT_URI
)}&scope=${encodeURIComponent(SPOTIFY_SCOPES.join(" "))}`;
