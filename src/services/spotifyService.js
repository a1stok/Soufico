import axios from "axios";
import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES } from "../spotifyConfig";

const SPOTIFY_REDIRECT_URI = "https://flowershop-3e9f1.web.app/subscriptions";

export const getSpotifyAuthUrl = () => {
  const scopes = SPOTIFY_SCOPES.join(" ");
  return `https://accounts.spotify.com/authorize?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    SPOTIFY_REDIRECT_URI
  )}&scope=${encodeURIComponent(scopes)}`;
};

export const createPlaylist = async (accessToken, userId, name) => {
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      { name, public: false, description: `Generated playlist: ${name}` },
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

export const searchTracksByGenre = async (accessToken, genres) => {
  try {
    const tracks = [];
    for (const genre of genres) {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=genre:"${encodeURIComponent(
          genre
        )}"&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const trackUris = response.data.tracks.items.map((track) => track.uri);
      tracks.push(...trackUris);
    }
    return tracks.slice(0, 20);
  } catch (error) {
    console.error("Error searching tracks by genre:", error.response?.data || error.message);
    return [];
  }
};

export const addTracksToPlaylist = async (accessToken, playlistId, trackUris) => {
  try {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: trackUris },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error adding tracks to playlist:", error.response?.data || error.message);
  }
};

export const setPlaylistCoverImage = async (accessToken, playlistId, moviePosterUrl) => {
  try {
    const response = await fetch(moviePosterUrl);
    const blob = await response.blob();
    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    await axios.put(
      `https://api.spotify.com/v1/playlists/${playlistId}/images`,
      base64Image,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "image/jpeg",
        },
      }
    );
  } catch (error) {
    console.error("Error setting playlist cover image:", error.response?.data || error.message);
  }
};
