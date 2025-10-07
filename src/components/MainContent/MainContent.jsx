import React, { useState } from "react";
import mockReleases from "../../utils/mockReleases.js";
import "./MainContent.css";

export default function MainContent() {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const filteredReleases =
    selectedGenre === "All"
      ? mockReleases
      : mockReleases.filter((album) => album.genre === selectedGenre);

  const genres = ["All", ...new Set(mockReleases.map((a) => a.genre))];

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>New Releases</h2>
        <select
          className="genre-filter"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <div className="album-grid">
        {filteredReleases.map((album) => (
          <div key={album.id} className="album-card">
            <img src={album.cover} alt={album.title} />
            <h4>{album.title}</h4>
            <p>{album.artist}</p>
            <span className="genre-tag">{album.genre}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
