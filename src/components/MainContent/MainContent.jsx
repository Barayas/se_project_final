import React from "react";
import "./MainContent.css";

export default function MainContent({
  selectedGenre,
  setSelectedGenre,
  releases,
}) {
  // Always derive genres from the full dataset
  const allGenres = ["All", ...new Set(releases.map((a) => a.genre))];

  // Filter releases by selected genre
  const filteredReleases =
    selectedGenre === "All"
      ? releases
      : releases.filter(
          (album) =>
            album.genre &&
            album.genre.toLowerCase() === selectedGenre.toLowerCase()
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
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <section className="album-grid">
        {filteredReleases.length > 0 ? (
          filteredReleases.map((album) => (
            <article key={album.id} className="album-card">
              <img src={album.cover} alt={`${album.title} cover`} />
              <h4>{album.title}</h4>
              <p>{album.artist}</p>
              <span className="genre-tag">{album.genre}</span>
            </article>
          ))
        ) : (
          <p>No albums found for this genre.</p>
        )}
      </section>
    </main>
  );
}
