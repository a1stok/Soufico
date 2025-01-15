import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { createPlaylist } from "../services/spotifyService";
import "./MovieDetailsPage.css";

function MovieDetailsPage() {
  const location = useLocation();
  const movie = location.state?.movie || null;

  const [playlistLink, setPlaylistLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("spotify_access_token") : null;
  const userProfile =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("spotify_user_profile"))
      : null;

  const handleCreatePlaylist = async () => {
    if (!accessToken) {
      alert("Please log in to Spotify first.");
      return;
    }

    setIsLoading(true);
    try {
      const playlist = await createPlaylist(
        accessToken,
        userProfile?.id,
        `${movie.title} Playlist`
      );

      if (!playlist) {
        alert("Failed to create playlist. Please try again.");
        return;
      }

      alert("Playlist created successfully!");
      setPlaylistLink(playlist.external_urls.spotify);
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Failed to create the playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkPlaylist = () => {
    const userInput = prompt("Paste your Spotify playlist link here:");
    if (userInput) {
      setPlaylistLink(userInput);
      alert("Playlist linked successfully!");
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
                src={playlistLink}
                width="100%"
                height="380"
                frameBorder="0"
                allow="encrypted-media"
                title="Spotify Playlist"
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
