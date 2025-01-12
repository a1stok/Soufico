import React, { useState, useEffect } from "react";
import {
  getSpotifyAuthUrl,
  createPlaylist,
  searchTracksByGenre,
  addTracksToPlaylist,
  setPlaylistCoverImage,
} from "../services/spotifyService";
import { searchMovies, fetchGenresFromTMDb } from "../services/tmdbService";
import "./SubscriptionsPage.css";

import searchIcon from "../images/loop-icon.png";
import spotifyIcon from "../images/spotify-icon.png";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const SubscriptionsPage = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [playlistLink, setPlaylistLink] = useState("");
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("spotify_access_token") || "");
  const [tmdbGenres, setTmdbGenres] = useState({});

  useEffect(() => {
    const loadGenres = async () => {
      const genres = await fetchGenresFromTMDb();
      setTmdbGenres(genres);
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (token) {
      setAccessToken(token);
      localStorage.setItem("spotify_access_token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async (token) => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (accessToken) {
      fetchUserProfile(accessToken);
    }
  }, [accessToken]);

  const handleSpotifyLogin = () => {
    if (!accessToken) {
      window.location.href = getSpotifyAuthUrl();
    } else {
      alert("You are already logged in to Spotify.");
    }
  };

  const handleSpotifyLogout = () => {
    localStorage.removeItem("spotify_access_token");
    setAccessToken(null);
    setUserProfile(null);
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

  const handleCreatePlaylist = async (movie) => {
    try {
      if (!accessToken) {
        alert("Please log in to Spotify first.");
        return;
      }

      const playlist = await createPlaylist(
        accessToken,
        userProfile?.id,
        `Soundtrack for ${movie.title}`
      );

      if (!playlist) {
        alert("Failed to create playlist. Please try again.");
        return;
      }

      const genres = movie.genre_ids.map((id) => tmdbGenres[id]).filter(Boolean);

      if (genres.length === 0) {
        alert("No genres available for this movie to generate a playlist.");
        return;
      }

      const trackUris = await searchTracksByGenre(accessToken, genres);

      if (trackUris.length > 0) {
        await addTracksToPlaylist(accessToken, playlist.id, trackUris);
      }

      const moviePosterUrl = `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`;
      await setPlaylistCoverImage(accessToken, playlist.id, moviePosterUrl);

      alert("Playlist created successfully!");
      setPlaylistLink(playlist.external_urls.spotify);
    } catch (err) {
      console.error("Error creating playlist:", err);
      alert("An error occurred while creating the playlist.");
    }
  };

  return (
    <div className="subscriptions-page">
      <h1>Generate a Movie-Based Playlist</h1>

      <div className="search-section">
        <input
          type="text"
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
              <button onClick={() => handleCreatePlaylist(movie)}>Create Playlist</button>
            </div>
          </div>
        ))}
      </div>

      {playlistLink && (
        <div className="playlist-result">
          <a href={playlistLink} target="_blank" rel="noopener noreferrer">
            Open Your Playlist on Spotify
          </a>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
