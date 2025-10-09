import ModalWithForm from "../ModalWithForm/ModalWithForm";
import defaultCover from "../../assets/default-playlist.png";
import "./PlaylistModal.css";

export default function PlaylistModal({
  isOpen,
  onClose,
  playlist,
  handleDeletePlaylist,
}) {
  if (!playlist) return null;

  const hasAlbums = playlist.albums && playlist.albums.length > 0;
  const hasSongs = playlist.songs && playlist.songs.length > 0;

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

        {/* Albums Section */}
        {hasAlbums && (
          <div className="playlist-albums">
            <h4>Albums</h4>
            <ul className="album-list">
              {playlist.albums.map((album) => (
                <li key={album.id} className="album-item">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="album-thumb"
                  />
                  <div className="album-info">
                    <span className="album-title">{album.title}</span>
                    <span className="album-artist">{album.artist}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Songs Section */}
        {hasSongs && (
          <div className="playlist-songs">
            <h4>Songs</h4>
            <ul className="song-list">
              {playlist.songs.map((song, index) => (
                <li key={index} className="song-item">
                  <span className="song-title">{song.title}</span>
                  <span className="song-artist">{song.artist}</span>
                  {song.album && (
                    <span className="song-album">({song.album})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!hasAlbums && !hasSongs && (
          <p className="no-tracks">No albums or songs in this playlist yet.</p>
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
