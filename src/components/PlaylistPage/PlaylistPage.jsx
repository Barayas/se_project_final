import "./PlaylistPage.css";
import defaultCover from "../../assets/default-playlist.png";

export default function PlaylistPage({
  playlists,
  handleRemoveFromPlaylist,
  onOpenPlaylistModal,
  onRefresh,
}) {
  if (!playlists) playlists = [];

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>Your Playlists</h2>
        <button className="refresh-btn" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {playlists.length === 0 ? (
        <p>No playlists yet. Click “Create Playlist” to make one!</p>
      ) : (
        <div className="playlist-grid">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              className="playlist-card"
              onClick={() => onOpenPlaylistModal(pl)}
            >
              <img
                src={pl.cover || defaultCover}
                alt={pl.name}
                className="playlist-cover"
              />
              <div className="playlist-info">
                <h3 className="playlist-title">{pl.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
