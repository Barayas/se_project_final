import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({ onOpenCreatePlaylist }) {
  return (
    <header className="header">
      <h1 className="logo">NextTrack</h1>
      <nav className="nav">
        <Link to="/">New Releases</Link>
        <Link to="/playlists">Playlists</Link>
      </nav>
      <div className="header-actions">
        <button className="create-playlist-btn" onClick={onOpenCreatePlaylist}>
          + Create Playlist
        </button>
        <button className="login-btn">Login with Spotify</button>
      </div>
    </header>
  );
}
