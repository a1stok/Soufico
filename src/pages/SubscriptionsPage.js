import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSpotifyAuthUrl,
  ensureValidAccessToken,
  fetchUserPlaylists,
} from "../services/spotifyService";
import { searchMovies } from "../services/tmdbService";
import "./SubscriptionsPage.css";

import searchIcon from "../images/loop-icon.png";
import spotifyIcon from "../images/spotify-icon.png";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const SubscriptionsPage = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfileAndPlaylists = async () => {
      const accessToken = await ensureValidAccessToken();
      if (!accessToken) return;

      try {
        // Fetch User Profile
        const profileResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserProfile(profileData);

          // Fetch User Playlists
          const playlistsData = await fetchUserPlaylists();
          setPlaylists(playlistsData?.items || []);
        } else {
          console.error("Failed to fetch user profile:", profileResponse.statusText);
          setError("Failed to load profile. Please try logging in again.");
        }
      } catch (err) {
        console.error("Error fetching user profile or playlists:", err);
        setError("An error occurred. Please try logging in again.");
      }
    };

    fetchUserProfileAndPlaylists();
  }, []);

  const handleSpotifyLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  const handleSpotifyLogout = () => {
    localStorage.removeItem("spotify_access_token");
    setUserProfile(null);
    setPlaylists([]);
    alert("Logged out of Spotify.");
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    try {
      const results = await searchMovies(query);

      const filteredMovies = results
        .filter(
          (movie) =>
            movie.poster_path &&
            movie.release_date &&
            movie.vote_count > 25 &&
            movie.overview
        )
        .sort((a, b) => b.vote_count - a.vote_count);

      if (filteredMovies.length === 0) {
        setError("No suitable movies found. Try another name.");
      } else {
        setMovies(filteredMovies);
        setError("");
      }
    } catch (err) {
      setError("Failed to search movies. Please try again.");
      console.error("Error searching movies:", err);
    }
  };

  const handleMovieSelection = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <div className="subscriptions-page">
      <h1>Generate a Movie-Based Playlist</h1>

      <div className="search-section">
        <input
          type="text"
          className="styled-input"
          placeholder="Enter a movie name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="button-group">
          <button className="search-button" onClick={handleSearch}>
            <img src={searchIcon} alt="Search Icon" className="button-icon" />
            Search Movies
          </button>
          {userProfile ? (
            <button className="logout-button" onClick={handleSpotifyLogout}>
              <img src={spotifyIcon} alt="Spotify Icon" className="button-icon" />
              Log Out of Spotify
            </button>
          ) : (
            <button className="spotify-button" onClick={handleSpotifyLogin}>
              <img src={spotifyIcon} alt="Spotify Icon" className="button-icon" />
              Log in to Spotify
            </button>
          )}
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="movie-results">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>Release Date: {new Date(movie.release_date).toLocaleDateString()}</p>
              <p>Rating: {movie.vote_average.toFixed(1)}/10</p>
              <p className="movie-description">{movie.overview}</p>
              <button onClick={() => handleMovieSelection(movie)}>Choose Movie</button>
            </div>
          </div>
        ))}
      </div>

      {userProfile && playlists.length > 0 && (
        <div className="playlists-section">
          <h2>Your Spotify Playlists</h2>
          <ul className="playlist-list">
            {playlists.map((playlist) => (
              <li key={playlist.id} className="playlist-item">
                <a
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {playlist.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
