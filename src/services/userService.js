import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://soufico.onrender.com/api/users"
    : "https://flowershop-3e9f1.web.app/api/users";

const logError = (message, error) => {
  console.error(message, error.response?.data || error.message);
};

export const saveMoviePlaylist = async ({ userId, movie, playlistLink, userRating = null, userComment = "" }) => {
  try {
    if (!userId || !movie || !playlistLink) {
      throw new Error("Required parameters missing for saving playlist.");
    }
    const response = await axios.post(`${BASE_URL}/save-movie-playlist`, {
      userId,
      movie,
      playlistLink,
      userRating,
      userComment,
    });
    return response.data;
  } catch (error) {
    logError("Error saving movie playlist:", error);
    throw error;
  }
};

export const fetchUserMoviePlaylists = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required to fetch playlists.");
    }
    const response = await axios.get(`${BASE_URL}/fetch-movie-playlists/${userId}`);
    return response.data;
  } catch (error) {
    logError(`Error fetching playlists for user ${userId}:`, error);
    throw error;
  }
};

export const fetchMoviePlaylistDetails = async (userId, movieId) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie-playlists/${userId}/${movieId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movie playlist details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  };
  
  

export const rateMovie = async ({ userId, movieId, userRating, userComment }) => {
  try {
    if (!userId || !movieId || userRating == null || userComment == null) {
      throw new Error("Required parameters missing for rating movie.");
    }
    const response = await axios.post(`${BASE_URL}/rate-movie`, {
      userId,
      movieId,
      userRating,
      userComment,
    });
    return response.data;
  } catch (error) {
    logError("Error rating movie:", error);
    throw error;
  }
};

export const fetchMovieCommentsAndRatings = async (userId, movieId) => {
  try {
    if (!userId || !movieId) {
      throw new Error("Both userId and movieId are required.");
    }
    const response = await axios.get(`${BASE_URL}/fetch-comments/${userId}/${movieId}`);
    if (!response || !response.data) {
      throw new Error("Invalid response from server.");
    }
    return response.data;
  } catch (error) {
    logError("Error fetching comments and ratings:", error);
    throw error;
  }
};
