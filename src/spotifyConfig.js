export const SPOTIFY_CLIENT_ID = "d92a7f2077fc4808b52b7afb9938459e";

const HOSTNAME = window.location.hostname;

export const SPOTIFY_REDIRECT_URI =
  HOSTNAME === "soufico.onrender.com"
    ? "https://soufico.onrender.com/callback"
    : HOSTNAME === "flowershop-3e9f1.web.app"
    ? "https://flowershop-3e9f1.web.app/callback"
    : "http://localhost:3000/callback";

export const SPOTIFY_SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
];
