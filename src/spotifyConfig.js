const HOSTNAME = window.location.hostname;

export const SPOTIFY_CLIENT_ID = "d92a7f2077fc4808b52b7afb9938459e";
export const SPOTIFY_SCOPES = ["playlist-modify-public", "playlist-modify-private"];

export const SPOTIFY_REDIRECT_URI =
  HOSTNAME === "soufico.onrender.com"
    ? "https://soufico.onrender.com/callback"
    : HOSTNAME === "flowershop-3e9f1.web.app"
    ? "https://flowershop-3e9f1.web.app/callback"
    : "http://localhost:3000/callback";
    import axios from "axios";
    import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES, SPOTIFY_REDIRECT_URI } from "../spotifyConfig";
    
    export const getSpotifyAuthUrl = () => {
      const scopes = SPOTIFY_SCOPES.join(" ");
      return `https://accounts.spotify.com/authorize?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        SPOTIFY_REDIRECT_URI
      )}&scope=${encodeURIComponent(scopes)}`;
    };
    
    export const createPlaylist = async (accessToken, userId, movieTitle) => {
      try {
        const playlistName = `${movieTitle} Playlist`;
        const response = await axios.post(
          `https://api.spotify.com/v1/users/${userId}/playlists`,
          { name: playlistName, public: false, description: `Playlist for the movie: ${movieTitle}` },
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
    
    export const linkExistingPlaylist = async (playlistId, userId, accessToken) => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error linking to existing playlist:", error.response?.data || error.message);
        return null;
      }
    };
    