import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createPlaylist, ensureValidAccessToken } from "../services/spotifyService";
import "./MovieDetailsPage.css";

function MovieDetailsPage() {
  const location = useLocation();
  const movie = location.state?.movie || null;

  const [playlistLink, setPlaylistLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = await ensureValidAccessToken();
      if (!accessToken) return;

      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCreatePlaylist = async () => {
    if (!userProfile) {
      alert("Please log in to Spotify first.");
      return;
    }

    setIsLoading(true);
    try {
      const playlist = await createPlaylist(userProfile.id, `${movie.title} Playlist`);
      if (!playlist) {
        alert("Failed to create playlist. Please try again.");
        return;
      }
      setPlaylistLink(`https://open.spotify.com/embed/playlist/${playlist.id}`);
      alert("Playlist created successfully!");
    } catch (error) {
      console.error("Error creating playlist:", error.response?.data || error.message);
      alert("Failed to create the playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkPlaylist = () => {
    const userInput = prompt("Paste your Spotify playlist link here:");
    try {
      const url = new URL(userInput);
      if (url.hostname !== "open.spotify.com") {
        alert("Invalid Spotify link. Please enter a valid playlist link.");
        return;
      }
      const playlistId = url.pathname.split("/").pop();
      setPlaylistLink(`https://open.spotify.com/embed/playlist/${playlistId}`);
      alert("Playlist linked successfully!");
    } catch (error) {
      alert("Invalid URL format. Please try again.");
    }
  };

  if (!movie) {
    return <p>No movie details available. Please go back and select a movie.</p>;
  }

  return (
    <div className="movie-details-page">
      <div className="movie-details-container">
        <div className="movie-card">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-poster"
          />
          <div className="movie-info">
            <h2>{movie.title}</h2>
            <p>
              <strong>Release Date:</strong>{" "}
              {new Date(movie.release_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
            </p>
            <p>{movie.overview}</p>
          </div>
        </div>
        <div className="spotify-section">
          {playlistLink ? (
            <div className="playlist-container">
              <h3>Spotify Playlist</h3>
              <iframe
                title="Spotify Embed: Recommendation Playlist"
                src={playlistLink}
                width="100%"
                height="360"
                style={{ borderRadius: "8px" }}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          ) : (
            <div className="playlist-actions">
              <button
                className="action-button create-button"
                onClick={handleCreatePlaylist}
                disabled={isLoading}
              >
                {isLoading ? "Creating Playlist..." : "Create Playlist"}
              </button>
              <button
                className="action-button link-button"
                onClick={handleLinkPlaylist}
              >
                Link Existing Playlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
