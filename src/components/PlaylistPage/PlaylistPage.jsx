import "./PlaylistPage.css";

export default function PlaylistPage({ playlist, handleRemoveFromPlaylist }) {
  return (
    <main className="main-content">
      <div className="content-header">
        <h2>Your Playlist</h2>
      </div>

      {playlist.length === 0 ? (
        <p>No albums in your playlist yet. Go add some!</p>
      ) : (
        <div className="album-grid">
          {playlist.map((album) => (
            <div key={album.id} className="album-card">
              <img src={album.cover} alt={album.title} />
              <h4>{album.title}</h4>
              <p>{album.artist}</p>
              <span className="genre-tag">{album.genre}</span>
              <button
                className="remove-btn"
                onClick={() => handleRemoveFromPlaylist(album.id)}
              >
                - Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
