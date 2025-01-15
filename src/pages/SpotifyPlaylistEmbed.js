import React from "react";

const SpotifyPlaylistEmbed = ({ playlistId }) => {
  if (!playlistId) {
    return <p>No playlist available to display.</p>;
  }

  return (
    <div className="spotify-embed">
      <iframe
        title="Spotify Playlist"
        src={`https://open.spotify.com/embed/playlist/${playlistId}`}
        width="300"
        height="380"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style={{ borderRadius: "12px" }}
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default SpotifyPlaylistEmbed;
