import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./AlbumModal.css";

export default function AlbumModal({
  album,
  onClose,
  playlists = [],
  onAddToPlaylist,
}) {
  const [activeSong, setActiveSong] = useState(null); // Which song’s add menu is open
  const [showPlaylistPopup, setShowPlaylistPopup] = useState(false);

  // Helper: Convert milliseconds to mm:ss
  const formatDuration = (ms) => {
    if (!ms) return "–:–";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleAddAlbumToPlaylist = (playlist) => {
    album.tracks.forEach((track) => {
      onAddToPlaylist(album, playlist, track.name);
    });
    setShowPlaylistPopup(false);
  };

  const handleAddSongToPlaylist = (playlist, song) => {
    onAddToPlaylist(album, playlist, song.name);
    setActiveSong(null);
  };

  return (
    <ModalWithForm
      isOpen={!!album}
      onClose={onClose}
      title={album?.title || "Album"}
      showSubmit={false}
    >
      <div className="album-modal">
        {/* Album Info Section */}
        <div className="album-info">
          <img src={album.cover} alt={album.title} className="album-cover" />
          <div className="album-meta">
            <h3>{album.title}</h3>
            <p className="album-artist">{album.artist}</p>
            {album.genre && <span className="album-genre">{album.genre}</span>}
          </div>
        </div>

        {/* Add Album Button */}
        <div className="album-actions">
          <button
            className="add-album-btn"
            onClick={() => setShowPlaylistPopup(!showPlaylistPopup)}
          >
            + Add Album to Playlist
          </button>

          {showPlaylistPopup && (
            <div className="album-popup">
              {playlists.length > 0 ? (
                playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleAddAlbumToPlaylist(pl)}
                  >
                    {pl.name}
                  </button>
                ))
              ) : (
                <p>No playlists yet</p>
              )}
            </div>
          )}
        </div>

        {/* Tracklist Section */}
        <div className="tracklist">
          <h4>Tracks</h4>
          {album.tracks && album.tracks.length > 0 ? (
            <ul>
              {album.tracks.map((track, i) => (
                <li key={i} className="track-row">
                  <span className="track-number">{i + 1}</span>
                  <span className="track-title">{track.name}</span>
                  <span className="track-duration">
                    {formatDuration(track.duration_ms)}
                  </span>

                  <div className="track-actions">
                    <button
                      className="add-btn"
                      onClick={() =>
                        setActiveSong(activeSong === track ? null : track)
                      }
                    >
                      + Add
                    </button>

                    {activeSong === track && (
                      <div className="playlist-popup">
                        {playlists.length > 0 ? (
                          playlists.map((pl) => (
                            <button
                              key={pl.id}
                              onClick={() => handleAddSongToPlaylist(pl, track)}
                            >
                              {pl.name}
                            </button>
                          ))
                        ) : (
                          <p>No playlists yet</p>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-tracks">No tracks available.</p>
          )}
        </div>
      </div>
    </ModalWithForm>
  );
}
