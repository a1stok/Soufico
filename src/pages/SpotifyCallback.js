import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
      navigate("/subscriptions");
    } else {
      console.error("Spotify login failed. Redirecting to login.");
      navigate("/login");
    }
  }, [navigate]);

  return <p>Processing Spotify Login...</p>;
};

export default SpotifyCallback;
