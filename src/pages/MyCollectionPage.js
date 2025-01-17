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

  if (loading) return <p>Loading your playlists...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="my-collection-page">
      <h1>My Movie Playlist</h1>
      {collections.length > 0 ? (
        <div className="collection-grid">
          {collections.map((item) => (
            <Link
              to={`/movie/${item.movie.id}`}
              state={{ movie: { ...item.movie, playlistLink: item.playlistLink, userComment: item.userComment, userRating: item.userRating } }}
              key={item.movie.id}
              className="collection-card"
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
