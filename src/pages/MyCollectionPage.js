import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUserMoviePlaylists } from "../services/userService";
import "./MyCollectionPage.css";

const MyCollectionPage = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await fetchUserMoviePlaylists("spotifyUser123"); // Replace with dynamic user ID
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="my-collection-page">
      <h1>My Movie Playlist</h1>
      {collections.length > 0 ? (
        <ul className="collection-list">
          {collections.map((item, index) => (
            <li key={index}>
              <Link to={`/movie/${item.movie.id}`} state={{ movie: item.movie }}>
                {item.movie.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No movies saved yet.</p>
      )}
    </div>
  );
};

export default MyCollectionPage;
