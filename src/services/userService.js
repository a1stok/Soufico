import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://soufico.onrender.com/api/users"
    : "https://flowershop-3e9f1.web.app/api/users";

export const saveMoviePlaylist = async ({ userId, movie, playlistLink }) => {
  try {
    const response = await axios.post(`${BASE_URL}/save-movie-playlist`, {
      userId,
      movie,
      playlistLink,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving movie playlist:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchUserMoviePlaylists = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-movie-playlists/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie playlists:", error.response?.data || error.message);
    throw error;
  }
};

export const rateMovie = async ({ userId, movieId, userRating, userComment }) => {
  try {
    const response = await axios.post(`${BASE_URL}/rate-movie`, {
      userId,
      movieId,
      userRating,
      userComment,
    });
    return response.data;
  } catch (error) {
    console.error("Error rating movie:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchMovieCommentsAndRatings = async (userId, movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-comments/${userId}/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments and ratings:", error.response?.data || error.message);
    throw error;
  }
};
