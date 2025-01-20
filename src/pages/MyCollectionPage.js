import React, { useState, useEffect } from "react";
import "./MyCollectionPage.css";
import { fetchUserMoviePlaylists } from "../services/userService";

const MyCollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const userId = localStorage.getItem("spotify_user_id");
        if (!userId) throw new Error("User ID is missing.");

        const data = await fetchUserMoviePlaylists(userId);
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError("Failed to fetch collections. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleEditMovieDetails = (updatedItem) => {
    setCollections((prev) =>
      prev.map((item) =>
        item.movie.id === updatedItem.movie.id ? { ...item, ...updatedItem } : item
      )
    );
    setSelectedMovie(null);
  };

  const handleChangeRating = () => {
    const newRating = parseFloat(
      prompt("Enter your new rating (0-10 in increments of 0.5):", selectedMovie.userRating || "")
    );

    if (newRating >= 0 && newRating <= 10 && newRating % 0.5 === 0) {
      setSelectedMovie((prev) => ({ ...prev, userRating: newRating }));
    } else {
      alert("Invalid rating! Please enter a value between 0 and 10 in increments of 0.5.");
    }
  };

  const handleChangeComment = () => {
    const newComment = prompt("Enter your new comment:", selectedMovie.userComment || "");
    if (newComment !== null) {
      setSelectedMovie((prev) => ({ ...prev, userComment: newComment }));
    }
  };

  if (loading) return <p>Loading your playlists...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="my-collection-page">
      <h1>My Movie Playlist</h1>
      <div className="user-info">
        <div className="user-profile">
          <img
            src={localStorage.getItem("user_photo") || "default-avatar.png"}
            alt="User Avatar"
            className="user-avatar"
          />
          <h2>{localStorage.getItem("user_name") || "User"}</h2>
        </div>
      </div>
      {selectedMovie ? (
        <div className="movie-details">
          <div className="movie-details-layout">
            <div className="movie-poster-section">
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.movie.poster_path}`}
                alt={selectedMovie.movie.title}
                className="movie-poster-large"
              />
            </div>
            <div className="spotify-playlist-section">
              {selectedMovie.playlistLink ? (
                <iframe
                  title="Spotify Playlist"
                  src={selectedMovie.playlistLink}
                  width="300"
                  height="300"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                ></iframe>
              ) : (
                <p>No playlist linked to this movie yet.</p>
              )}
            </div>
          </div>
          <div className="details-content">
            <h2>{selectedMovie.movie.title}</h2>
            <p><strong>Description:</strong> {selectedMovie.movie.overview}</p>
            <p><strong>Personal Rating:</strong> {selectedMovie.userRating || "Not rated yet."}</p>
            <p>
              <strong>Your Comment:</strong>{" "}
              {selectedMovie.userComment.length > 100
                ? `${selectedMovie.userComment.slice(0, 100)}...`
                : selectedMovie.userComment || "No comment yet."}
            </p>
            <div className="action-buttons">
              <button onClick={handleChangeRating} className="action-button">
                Change Your Rating
              </button>
              <button onClick={handleChangeComment} className="action-button">
                Change Your Comment
              </button>
            </div>
            <div className="edit-section">
              <label>Update Playlist Link:</label>
              <input
                type="text"
                value={selectedMovie.playlistLink || ""}
                onChange={(e) =>
                  setSelectedMovie((prev) => ({ ...prev, playlistLink: e.target.value }))
                }
              />
              <div className="action-buttons">
                <button
                  onClick={() => handleEditMovieDetails(selectedMovie)}
                  className="action-button save-button"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="action-button cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : collections.length > 0 ? (
        <div className="collection-grid">
          {collections.map((item) => (
            <div
              key={item.movie.id}
              className="collection-card large-card"
              onClick={() => setSelectedMovie(item)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${item.movie.poster_path}`}
                alt={item.movie.title}
                className="movie-poster-large"
              />
              <div className="movie-info">
                <h3>{item.movie.title}</h3>
                <p><strong>Rating:</strong> {item.userRating || "Not rated yet."}</p>
                <p>
                  <strong>Review:</strong>{" "}
                  {item.userComment.length > 50
                    ? `${item.userComment.slice(0, 50)}...`
                    : item.userComment || "No review yet."}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-playlists">
          <h2>Your Spotify Playlists</h2>
          <p>You don't have any playlists yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyCollectionPage;
