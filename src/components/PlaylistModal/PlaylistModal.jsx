import ModalWithForm from "../ModalWithForm/ModalWithForm";
import defaultCover from "../../assets/default-playlist.png";
import "./PlaylistModal.css";

export default function PlaylistModal({
  isOpen,
  onClose,
  playlist,
  handleDeletePlaylist,
}) {
  if (!playlist) return null; // Prevents errors if playlist data is missing

  return (
    <ModalWithForm
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

        {playlist.tracks && playlist.tracks.length > 0 ? (
          <div className="playlist-tracks">
            <h4>Tracks</h4>
            <ul>
              {playlist.tracks.map((track, index) => (
                <li key={index} className="track-item">
                  <span className="track-title">{track.title}</span>
                  <span className="track-artist">{track.artist}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="no-tracks">No tracks in this playlist yet.</p>
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
