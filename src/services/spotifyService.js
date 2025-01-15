import axios from "axios";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} from "../spotifyConfig";

export const getSpotifyAuthUrl = () => {
  return `https://accounts.spotify.com/authorize?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    SPOTIFY_REDIRECT_URI
  )}&scope=playlist-read-private playlist-modify-private playlist-modify-public user-read-private`;
};

export const ensureValidAccessToken = async () => {
  const accessToken = localStorage.getItem("spotify_access_token");

  if (!accessToken) {
    alert("Please log in to Spotify.");
    window.location.href = getSpotifyAuthUrl();
    return null;
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.status === 200) return accessToken;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("spotify_access_token");
      window.location.href = getSpotifyAuthUrl();
    }
  }
  return null;
};

export const createPlaylist = async (userId, playlistName) => {
  const accessToken = await ensureValidAccessToken();
  if (!accessToken) return null;

  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      { name: playlistName, public: false },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating playlist:", error.response?.data || error.message);
    return null;
  }
};

export const fetchUserPlaylists = async () => {
  const accessToken = await ensureValidAccessToken();
  if (!accessToken) return null;

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user playlists:", error.response?.data || error.message);
    return null;
  }
};
