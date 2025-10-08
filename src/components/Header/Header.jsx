import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <h1 className="logo">NextTrack</h1>

      <nav className="nav">
        <Link
          to="/"
          className={`nav-link ${
            location.pathname === "/" ? "nav-link--active" : ""
          }`}
        >
          New Releases
        </Link>

        <Link
          to="/playlists"
          className={`nav-link ${
            location.pathname === "/playlists" ? "nav-link--active" : ""
          }`}
        >
          Playlists
        </Link>
      </nav>

      <button className="login-btn">Login with Spotify</button>
    </header>
  );
}
