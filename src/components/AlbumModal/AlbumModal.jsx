import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./AlbumModal.css";

export default function AlbumModal({
  album,
  onClose,
  playlists = [],
  onAddToPlaylist,
}) {
  const [activeSong, setActiveSong] = useState(null); // which song’s add menu is open

  const handleAddToPlaylist = (playlist, song) => {
    onAddToPlaylist(album, playlist, song);
    setActiveSong(null);
  };

  return (
    <ModalWithForm
      isOpen={!!album}
      onClose={onClose}
      title={album?.title || "Album"}
    >
      <div className="album-modal">
        <div className="album-info">
          <img src={album.cover} alt={album.title} className="album-cover" />
          <div className="album-meta">
            <h3>{album.title}</h3>
            <p className="album-artist">{album.artist}</p>
            <span className="album-genre">{album.genre}</span>
          </div>
        </div>

        <div className="tracklist">
          <h4>Tracks</h4>
          {album.tracks && album.tracks.length > 0 ? (
            <ul>
              {album.tracks.map((track, i) => (
                <li key={i} className="track-row">
                  <span>{track}</span>
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
                              onClick={() => handleAddToPlaylist(pl, track)}
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
