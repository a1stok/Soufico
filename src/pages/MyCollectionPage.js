import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUserMoviePlaylists } from "../services/userService";
import "./MyCollectionPage.css";

const MyCollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleUpdateCollection = async (updatedItem) => {
    try {
      const userId = localStorage.getItem("spotify_user_id");
      if (!userId) throw new Error("User ID is missing.");

      const response = await fetch(`/api/update-movie-playlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          movie: updatedItem.movie,
          userComment: updatedItem.userComment,
          userRating: updatedItem.userRating,
          playlistLink: updatedItem.playlistLink,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the movie playlist.");
      }

      const updatedCollections = collections.map((item) =>
        item.movie.id === updatedItem.movie.id
          ? { ...item, ...updatedItem }
          : item
      );
      setCollections(updatedCollections);
      alert("Movie playlist and details updated successfully!");
    } catch (error) {
      console.error("Error updating collection:", error);
      setError("Failed to update the movie playlist. Please try again.");
    }
  };

  if (loading) return <p>Loading your playlists...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="my-collection-page">
      <h1>My Movie Playlist</h1>
      {collections.length > 0 ? (
        <div className="collection-grid">
          {collections.map((item) => (
            <div key={item.movie.id} className="collection-card">
              <Link
                to={`/movie/${item.movie.id}`}
                state={{
                  movie: {
                    ...item.movie,
                    playlistLink: item.playlistLink,
                    userComment: item.userComment,
                    userRating: item.userRating,
                  },
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${item.movie.poster_path}`}
                  alt={item.movie.title}
                  className="movie-poster"
                />
                <div className="card-content">
                  <h3>{item.movie.title}</h3>
                  <p><strong>Comment:</strong> {item.userComment || "No comment yet."}</p>
                  <p><strong>Rating:</strong> {item.userRating || "Not rated yet."}</p>
                </div>
              </Link>
              <button
                className="update-button"
                onClick={() =>
                  handleUpdateCollection({
                    movie: item.movie,
                    userComment: prompt("Update your comment:", item.userComment) || item.userComment,
                    userRating: prompt("Update your rating (0-10):", item.userRating) || item.userRating,
                    playlistLink: item.playlistLink,
                  })
                }
              >
                Update Playlist & Review
              </button>
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
