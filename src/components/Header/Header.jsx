import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <h1 className="logo">NextTrack</h1>
      <nav className="nav">
        <a href="#">New Releases</a>
        <a href="#">Playlists</a>
      </nav>
      <button className="login-btn">Login with Spotify</button>
    </header>
  );
}
