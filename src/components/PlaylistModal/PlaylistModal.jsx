import ModalWithForm from "../ModalWithForm/ModalWithForm";
import defaultCover from "../../assets/default-playlist.png";
import "./PlaylistModal.css";

export default function PlaylistModal({
  isOpen,
  onClose,
  playlist,
  handleDeletePlaylist,
  onRemoveSong,
}) {
  if (!playlist) return null;

  const hasSongs = playlist.songs && playlist.songs.length > 0;

  return (
    <ModalWithForm
      showSubmit={false}
      isOpen={isOpen}
      onClose={onClose}
      title={playlist.name || "Untitled Playlist"}
    >
      <div className="playlist-modal">
        <img
          src={playlist.cover || defaultCover}
          alt={playlist.name}
          className="playlist-modal-cover"
        />

        {playlist.description && (
          <p className="playlist-modal-description">{playlist.description}</p>
        )}

        {/* Songs Section */}
        {hasSongs && (
          <div className="playlist-songs">
            <h4>Songs</h4>
            <ul className="song-list">
              {playlist.songs.map((song, index) => (
                <li key={index} className="song-item">
                  <div className="song-info">
                    <span className="song-title">{song.title}</span>
                    <span className="song-artist">{song.artist}</span>
                    {song.album && (
                      <span className="song-album">({song.album})</span>
                    )}
                  </div>
                  <button
                    className="remove-song-btn"
                    onClick={() => onRemoveSong(playlist.id, song)}
                    title="Remove song from playlist"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!hasSongs && (
          <p className="no-tracks">No songs in this playlist yet.</p>
        )}

        <button
          className="delete-playlist-btn"
          onClick={() => handleDeletePlaylist(playlist.id)}
        >
          Delete Playlist
        </button>
      </div>
    </ModalWithForm>
  );
}
