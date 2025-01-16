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
        setLoading(true);
        setError("");
        const userId = "spotifyUser123"; // Replace this with dynamic user ID if available
        const data = await fetchUserMoviePlaylists(userId);
        console.log("Fetched collections:", data); // Debugging log
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

  return (
    <div className="my-collection-page">
      <h1>My Movie Playlist</h1>
      {loading ? (
        <p>Loading your playlists...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : collections.length > 0 ? (
        <ul className="collection-list">
          {collections.map((item, index) => (
            <li key={index} className="collection-item">
              <Link
                to={`/movie/${item.movie.id}`}
                state={{ movie: item.movie }}
                className="movie-link"
              >
                <div className="movie-item">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${item.movie.poster_path}`}
                    alt={item.movie.title}
                    className="movie-poster"
                  />
                  <div className="movie-info">
                    <h3>{item.movie.title}</h3>
                    <p>{item.movie.release_date}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No movies saved yet. Start adding movies to your playlist!</p>
      )}
    </div>
  );
};

export default MyCollectionPage;
