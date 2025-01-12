import axios from "axios";

const TMDB_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzlhZTU5NDYzYmMyMWFkYjhkZDBmMjdiNTc1MjA2ZCIsIm5iZiI6MTczNjEwNTAzMi44ODIsInN1YiI6IjY3N2FkYzQ4ZjZiYzk3MTZlODcyN2NlMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._Mqkc4Mm2gwHC8O5PLuL9dgrNcx6IGjc6Ytv_xShcck";

export const searchMovies = async (query) => {
  try {
    const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
      params: {
        query,
      },
    });
    return response.data.results; 
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

export const fetchGenresFromTMDb = async () => {
  try {
    const response = await axios.get("https://api.themoviedb.org/3/genre/movie/list", {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    });
    return response.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name; 
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching genres from TMDb:", error);
    return {};
  }
};
