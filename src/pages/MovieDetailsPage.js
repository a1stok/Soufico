import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./MovieDetailsPage.css";

function MovieDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [playlistLink, setPlaylistLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!movie) {
      const fetchMovie = async () => {
        try {
          const response = await fetch(`/api/movies/${id}`);
          if (!response.ok) throw new Error("Failed to fetch movie details.");
          const data = await response.json();
          setMovie(data);
        } catch (error) {
          console.error("Error fetching movie:", error);
        }
      };
      fetchMovie();
    }
  }, [id, movie]);

  const handleCreatePlaylist = async () => {
    setIsLoading(true);
    try {
      alert("Create Playlist button clicked. Implement the logic.");
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
            <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
            <p><strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10</p>
            <p>{movie.overview}</p>
          </div>
        </div>
        <div className="spotify-section">
          {playlistLink ? (
            <div className="playlist-container">
              <h3>Spotify Playlist</h3>
              <iframe
                src={`https://open.spotify.com/embed/playlist/${playlistLink}`}
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
              <button className="action-button link-button" onClick={handleLinkPlaylist}>
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
