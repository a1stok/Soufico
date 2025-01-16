import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createPlaylist,
  ensureValidAccessToken,
} from "../services/spotifyService";
import {
  saveMoviePlaylist,
  fetchMoviePlaylistDetails,
} from "../services/userService";
import "./MovieDetailsPage.css";

function MovieDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie || null;

  const [playlistLink, setPlaylistLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userRating, setUserRating] = useState("");
  const [userComment, setUserComment] = useState("");

  useEffect(() => {
    const fetchUserProfileAndPlaylist = async () => {
      const accessToken = await ensureValidAccessToken();
      if (!accessToken) return;

      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);

          const userId = profile.id;
          const playlistDetails = await fetchMoviePlaylistDetails(
            userId,
            movie.id
          );
          if (playlistDetails) {
            setPlaylistLink(playlistDetails.playlistLink);
            setUserRating(playlistDetails.userRating || "");
            setUserComment(playlistDetails.userComment || "");
          }
        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile or playlist:", error);
      }
    };

    fetchUserProfileAndPlaylist();
  }, [movie?.id]);

  const handleCreatePlaylist = async () => {
    if (!userProfile) {
      alert("Please log in to Spotify first.");
      return;
    }

    if (playlistLink) {
      alert("A playlist is already associated with this movie.");
      return;
    }

    setIsLoading(true);
    try {
      const playlist = await createPlaylist(
        userProfile.id,
        `${movie.title} Playlist`
      );
      if (!playlist) {
        alert("Failed to create playlist. Please try again.");
        return;
      }
      setPlaylistLink(`https://open.spotify.com/embed/playlist/${playlist.id}`);
      alert("Playlist created successfully!");
    } catch (error) {
      console.error(
        "Error creating playlist:",
        error.response?.data || error.message
      );
      alert("Failed to create the playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToPlaylist = async () => {
    if (!playlistLink) {
      alert("Create or link a playlist first.");
      return;
    }
  
    if (userRating === "" || userComment === "") {
      alert("Please add a rating and comment.");
      return;
    }
  
    try {
      const userId = userProfile?.id;
      if (!userId) {
        alert("User ID is missing. Please log in.");
        return;
      }
  
      const existingPlaylist = await fetchMoviePlaylistDetails(userId, movie.id);
      if (existingPlaylist) {
        alert("A playlist for this movie already exists. You cannot save it again.");
        return;
      }
  
      await saveMoviePlaylist({
        userId,
        movie,
        playlistLink,
        userRating,
        userComment,
      });
  
      alert("Saved to your movie playlist!");
      navigate("/my-playlist");
    } catch (error) {
      console.error("Error saving movie playlist:", error);
      alert("Failed to save the movie playlist.");
    }
  };
  
  

  const handleLinkPlaylist = () => {
    if (playlistLink) {
      alert("A playlist is already associated with this movie.");
      return;
    }

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
      <div className="movie-details-layout">
        <div className="movie-description">
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
        <div className="movie-actions">
          <div className="rating-comment">
            <h3>Leave a Comment and Rating</h3>
            <textarea
              placeholder="Write your comment here..."
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
            ></textarea>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="Rating (0-10)"
              value={userRating}
              onChange={(e) => setUserRating(parseFloat(e.target.value))}
            />
          </div>
          <div className="playlist-section">
            {playlistLink ? (
              <>
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
              </>
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
          <button className="save-button" onClick={handleSaveToPlaylist}>
            Save to Your Movie Playlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
