import axios from "axios";
import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES, SPOTIFY_REDIRECT_URI } from "../spotifyConfig";

export const getSpotifyAuthUrl = () => {
  const scopes = SPOTIFY_SCOPES.join(" ");
  return `https://accounts.spotify.com/authorize?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    SPOTIFY_REDIRECT_URI
  )}&scope=${encodeURIComponent(scopes)}`;
};

export const createPlaylist = async (accessToken, userId, playlistName) => {
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      { name: playlistName, public: false, description: `Generated Playlist: ${playlistName}` },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating playlist:", error.response?.data || error.message);
    return null;
  }
};

export const getSpotifyPlaylistUrl = (playlistId) => {
  if (!playlistId) return null;
  return `https://open.spotify.com/playlist/${playlistId}`;
};

export const linkExistingPlaylist = (playlistUrl) => {
  if (!playlistUrl) return null;
  try {
    const playlistId = new URL(playlistUrl).pathname.split("/").pop();
    return playlistId;
  } catch (error) {
    console.error("Invalid playlist URL:", error.message);
    return null;
  }
};

export const fetchPlaylistDetails = async (accessToken, playlistId) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist details:", error.response?.data || error.message);
    return null;
  }
};
