import React from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "Indie",
    "Jazz",
    "Electronic",
    "R&B",
  ];
  return (
    <aside className="sidebar">
      <h3>Genres</h3>
      <ul>
        {genres.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
    </aside>
  );
}
