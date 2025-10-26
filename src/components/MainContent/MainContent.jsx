import { useState, useEffect } from "react";
import {
  getNewReleases,
  getAlbumTracks,
  getAccessToken,
} from "../../utils/SpotifyApi";
import AlbumModal from "../AlbumModal/AlbumModal";
import "./MainContent.css";

export default function MainContent({
  selectedGenre,
  setSelectedGenre,
  playlists,
  handleAddToPlaylist,
}) {
  const [releases, setReleases] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAlbumClick = async (album) => {
    try {
      const tracks = await getAlbumTracks(album.id);
      setSelectedAlbum({ ...album, tracks });
    } catch (err) {
      console.error("Error fetching album tracks:", err);
      setSelectedAlbum({ ...album, tracks: [] });
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      console.warn("No Spotify token — showing no releases.");
      setLoading(false);
      return;
    }

    const fetchReleases = async () => {
      try {
        setLoading(true);
        const albums = await getNewReleases(20);

        const formatted = albums.map((album) => ({
          id: album.id,
          title: album.title,
          artist: album.artist,
          cover: album.cover,
          release_date: album.release_date,
          genre: album.genre || "Unknown",
          tracks: album.tracks || [],
        }));

        setReleases(formatted);
      } catch (err) {
        console.error("Error fetching Spotify new releases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  const genres = ["All", ...new Set(releases.map((a) => a.genre))];
  const filteredReleases =
    selectedGenre === "All"
      ? releases
      : releases.filter((album) => album.genre === selectedGenre);

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

      {loading ? (
        <p style={{ color: "white" }}>Loading new releases...</p>
      ) : (
        <div className="album-grid">
          {filteredReleases.map((album) => (
            <div
              key={album.id}
              className="album-card"
              onClick={() => handleAlbumClick(album)}
            >
              <img src={album.cover} alt={album.title} />
              <h4>{album.title}</h4>
              <p>{album.artist}</p>
              <span className="genre-tag">{album.genre}</span>
            </div>
          ))}
        </div>
      )}

      {selectedAlbum && (
        <AlbumModal
          album={selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
          onAddToPlaylist={handleAddToPlaylist}
          playlists={playlists}
        />
      )}
    </main>
  );
}
