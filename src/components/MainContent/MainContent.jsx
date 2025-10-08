import { useState } from "react";
import mockReleases from "../../utils/mockReleases.js";
import "./MainContent.css";

export default function MainContent({ handleAddToPlaylist }) {
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Always show all available genres (including "All")
  const genres = ["All", ...new Set(mockReleases.map((a) => a.genre))];

  // Filter releases by selected genre
  const filteredReleases =
    selectedGenre === "All"
      ? mockReleases
      : mockReleases.filter(
          (album) => album.genre && album.genre === selectedGenre
        );

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
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="album-grid">
        {filteredReleases.map((album) => (
          <div key={album.id} className="album-card">
            <img
              src={album.cover}
              alt={album.title}
              onError={(e) => {
                e.target.src = "https://placehold.co/200x200?text=No+Image";
              }}
            />
            <h4>{album.title}</h4>
            <p>{album.artist}</p>
            <span className="genre-tag">{album.genre}</span>
            <button
              className="add-btn"
              onClick={() => handleAddToPlaylist(album)}
            >
              + Add to Playlist
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
