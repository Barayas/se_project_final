import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./AlbumModal.css";

export default function AlbumModal({ album, onClose, onAddToPlaylist }) {
  if (!album) return null;

  const handleSubmit = () => {
    onAddToPlaylist(album);
    onClose();
  };

  return (
    <ModalWithForm
      title={album.title}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText="Add to Playlist"
    >
      <div className="album-modal-content">
        <img
          src={album.cover}
          alt={album.title}
          className="album-modal-cover"
        />

        <h3>{album.artist}</h3>
        <p className="album-genre">{album.genre}</p>

        {/* Only render audio if a preview exists */}
        {album.previewUrl ? (
          <audio controls className="album-audio-preview">
            <source src={album.previewUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p className="no-preview">No preview available</p>
        )}
      </div>
    </ModalWithForm>
  );
}
