import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({
  onOpenCreatePlaylist,
  spotifyUser,
  setSpotifyUser,
}) {
  const handleSpotifyLogin = () => {
    const backendUri = import.meta.env.VITE_BACKEND_URI;
    window.location.href = `${backendUri}/login`;
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    setSpotifyUser(null);
  };

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

        {spotifyUser ? (
          <div className="spotify-profile">
            {spotifyUser.images?.[0] && (
              <img
                src={spotifyUser.images[0].url}
                alt="Spotify Profile"
                className="spotify-avatar"
              />
            )}
            <span className="spotify-name">{spotifyUser.display_name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={handleSpotifyLogin}>
            Login with Spotify
          </button>
        )}
      </div>
    </header>
  );
}
