import { useState, useEffect } from "react";
import {
  getNewReleases,
  getArtistGenres,
  getAccessToken,
} from "../../utils/SpotifyApi";
import AlbumModal from "../AlbumModal/AlbumModal";
import "./MainContent.css";
import { getAlbumTracks } from "../../utils/SpotifyApi";

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
        const newReleases = await getNewReleases(20);
        const albums = newReleases.albums.items;

        // Collect all artist IDs
        const artistIds = albums.flatMap((album) =>
          album.artists.map((a) => a.id)
        );

        // Fetch genres for all artists
        const artistGenreMap = await getArtistGenres(artistIds);

        // Map Spotify data to your album shape
        const formatted = albums.map((album) => {
          const firstArtist = album.artists[0];
          const artistGenres = artistGenreMap[firstArtist.id] || [];
          return {
            id: album.id,
            title: album.name,
            artist: firstArtist.name,
            cover: album.images?.[0]?.url || "",
            release_date: album.release_date,
            genre: artistGenres[0] || "Unknown",
          };
        });

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
