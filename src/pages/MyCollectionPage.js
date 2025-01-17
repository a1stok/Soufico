import React, { useEffect, useState } from "react";
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

  if (loading) return <p>Loading your playlists...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="my-collection-page">
      <h1>My Movie Playlist</h1>
      <div className="user-info">
        <img
          src={localStorage.getItem("user_photo")}
          alt="User Avatar"
          className="user-avatar"
        />
        <h2>{localStorage.getItem("user_name") || "User"}</h2>
      </div>
      {selectedMovie ? (
        <div className="movie-details">
          <img
            src={`https://image.tmdb.org/t/p/w500${selectedMovie.movie.poster_path}`}
            alt={selectedMovie.movie.title}
            className="movie-poster-large"
          />
          <div className="details-content">
            <h2>{selectedMovie.movie.title}</h2>
            <p><strong>Description:</strong> {selectedMovie.movie.overview}</p>
            <p><strong>Personal Rating:</strong> {selectedMovie.userRating || "Not rated yet."}</p>
            <p><strong>Your Comment:</strong> {selectedMovie.userComment || "No comment yet."}</p>
            <div className="edit-section">
              <label>Update Rating:</label>
              <input
                type="number"
                min="0"
                max="10"
                value={selectedMovie.userRating || ""}
                onChange={(e) =>
                  setSelectedMovie((prev) => ({ ...prev, userRating: e.target.value }))
                }
              />
              <label>Update Comment:</label>
              <textarea
                value={selectedMovie.userComment || ""}
                onChange={(e) =>
                  setSelectedMovie((prev) => ({ ...prev, userComment: e.target.value }))
                }
              />
              <label>Update Playlist Link:</label>
              <input
                type="text"
                value={selectedMovie.playlistLink || ""}
                onChange={(e) =>
                  setSelectedMovie((prev) => ({ ...prev, playlistLink: e.target.value }))
                }
              />
              <button
                onClick={() => handleEditMovieDetails(selectedMovie)}
                className="save-button"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedMovie(null)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : collections.length > 0 ? (
        <div className="collection-grid">
          {collections.map((item) => (
            <div
              key={item.movie.id}
              className="collection-card"
              onClick={() => setSelectedMovie(item)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${item.movie.poster_path}`}
                alt={item.movie.title}
                className="movie-poster"
              />
              <div className="card-content">
                <h3>{item.movie.title}</h3>
                <p><strong>Rating:</strong> {item.userRating || "Not rated yet."}</p>
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
