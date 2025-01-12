import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1); 
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
  
    if (accessToken) {
      console.log("Spotify access token retrieved:", accessToken); 
      localStorage.setItem("spotify_access_token", accessToken); 
      navigate("/subscriptions"); 
      console.error("No access token found.");
      alert("Spotify login failed. Please try again.");
      navigate("/subscriptions"); 
    }
  }, [navigate]);
  

  return (
    <div>
      <p>Processing Spotify Login...</p>
    </div>
  );
};

export default SpotifyCallback;
