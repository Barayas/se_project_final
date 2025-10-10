import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({ onOpenCreatePlaylist }) {
  const handleSpotifyLogin = async () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const scope =
      "user-read-private user-read-email playlist-modify-public playlist-modify-private";

    // Generate a code verifier and challenge for PKCE
    const generateRandomString = (length) => {
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((x) => possible[x % possible.length])
        .join("");
    };

    const base64encode = (str) =>
      btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const codeVerifier = generateRandomString(128);
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    const codeChallenge = base64encode(digest);

    localStorage.setItem("code_verifier", codeVerifier);

    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}`;

    window.location.href = authUrl;
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
        <button className="login-btn" onClick={handleSpotifyLogin}>
          Login with Spotify
        </button>
      </div>
    </header>
  );
}
