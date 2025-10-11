import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import MainContent from "../MainContent/MainContent";
import Footer from "../Footer/Footer";
import PlaylistPage from "../PlaylistPage/PlaylistPage";
import CreatePlaylistModal from "../CreatePlaylistModal/CreatePlaylistModal";
import PlaylistModal from "../PlaylistModal/PlaylistModal";
import SpotifyCallback from "../SpotifyCallback/SpotifyCallback";
import "./App.css";
import {
  getUserPlaylists,
  createPlaylist as spotifyCreatePlaylist,
  addTracksToPlaylist as spotifyAddTracksToPlaylist,
  getPlaylistTracks,
  deleteTrackFromPlaylist,
} from "../../utils/SpotifyApi";

function Layout({
  selectedGenre,
  setSelectedGenre,
  handleAddToPlaylist,
  handleRemoveFromPlaylist,
  playlists,
  onOpenCreatePlaylist,
  onOpenPlaylistModal,
  spotifyUser,
  setSpotifyUser,
  fetchSpotifyPlaylists,
}) {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";
  return (
    <div className="app">
      <Header
        onOpenCreatePlaylist={onOpenCreatePlaylist}
        spotifyUser={spotifyUser}
        setSpotifyUser={setSpotifyUser}
      />
      <div className="layout">
        {showSidebar && <Sidebar />}
        <Routes>
          <Route
            path="/"
            element={
              <MainContent
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                playlists={playlists}
                handleAddToPlaylist={handleAddToPlaylist}
              />
            }
          />
          <Route
            path="/playlists"
            element={
              <PlaylistPage
                playlists={playlists}
                handleRemoveFromPlaylist={handleRemoveFromPlaylist}
                onOpenPlaylistModal={onOpenPlaylistModal}
                onRefresh={fetchSpotifyPlaylists}
              />
            }
          />
          <Route
            path="/callback"
            element={<SpotifyCallback setSpotifyUser={setSpotifyUser} />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem("spotify_playlists")) || []
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [spotifyUser, setSpotifyUser] = useState(
    JSON.parse(localStorage.getItem("spotify_user")) || null
  );

  const fetchSpotifyPlaylists = async () => {
    if (!spotifyUser) {
      setPlaylists([]);
      localStorage.removeItem("spotify_playlists");
      return;
    }
    try {
      const data = await getUserPlaylists(50);
      const items = data?.items || [];

      const mapped = await Promise.all(
        items.map(async (p) => {
          let songs = [];
          try {
            const tracks = await getPlaylistTracks(p.id);
            songs = tracks;
          } catch (err) {
            console.warn(`Failed to load songs for ${p.name}:`, err);
          }

          return {
            id: p.id,
            name: p.name,
            description: p.description,
            songs,
            cover: p.images?.[0]?.url || null,
            raw: p,
          };
        })
      );

      setPlaylists(mapped);
      localStorage.setItem("spotify_playlists", JSON.stringify(mapped));
    } catch (err) {
      console.error("Failed to fetch Spotify playlists:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("spotify_user", JSON.stringify(spotifyUser));
    if (spotifyUser) fetchSpotifyPlaylists();
    else {
      setPlaylists([]);
      localStorage.removeItem("spotify_playlists");
    }
  }, [spotifyUser]);

  useEffect(() => {
    if (spotifyUser) fetchSpotifyPlaylists();
  }, []);

  const handleCreatePlaylist = async ({ name, description, cover }) => {
    if (!spotifyUser) {
      alert("Error: please sign in to Spotify to create playlists.");
      return;
    }
    try {
      const newPlaylist = await spotifyCreatePlaylist(
        spotifyUser.id,
        name,
        description,
        false
      );
      const newEntry = {
        id: newPlaylist.id,
        name: newPlaylist.name,
        description: newPlaylist.description,
        albums: [],
        songs: [],
        cover: newPlaylist.images?.[0]?.url || cover || null,
      };
      setPlaylists((prev) => {
        const updated = [newEntry, ...prev];
        localStorage.setItem("spotify_playlists", JSON.stringify(updated));
        return updated;
      });
      setShowCreateModal(false);
      setTimeout(fetchSpotifyPlaylists, 5000);
    } catch (err) {
      console.error("Error creating Spotify playlist:", err);
      alert("Failed to create playlist on Spotify. See console for details.");
    }
  };

  const handleAddToPlaylist = async (album, playlist, track) => {
    if (!spotifyUser) {
      alert("Error: please sign in to Spotify to add songs.");
      return;
    }
    if (!playlist || !playlist.id) {
      alert("Please select a Spotify playlist.");
      return;
    }
    try {
      let uris = [];
      if (Array.isArray(track)) {
        uris = track.map((t) => `spotify:track:${t.id}`);
      } else if (typeof track === "object" && track?.id) {
        uris = [`spotify:track:${track.id}`];
      } else {
        const found = (album.tracks || []).find(
          (t) => t.name === track || t.name === track.name
        );
        if (found && found.id) {
          uris = [`spotify:track:${found.id}`];
        } else {
          alert("Can't add this track to Spotify: missing track id.");
          return;
        }
      }
      await spotifyAddTracksToPlaylist(playlist.id, uris);
      await fetchSpotifyPlaylists();
      alert("Added to playlist on Spotify!");
    } catch (err) {
      console.error("Error adding tracks to Spotify playlist:", err);
      alert(
        "Failed to add tracks to Spotify playlist. See console for details."
      );
    }
  };

  const handleRemoveFromPlaylist = (playlistId) => {
    setPlaylists((prev) => {
      const updated = prev.filter((p) => p.id !== playlistId);
      localStorage.setItem("spotify_playlists", JSON.stringify(updated));
      return updated;
    });
  };

  const handleOpenPlaylistModal = (playlist) => {
    setSelectedPlaylist(playlist);
    setShowPlaylistModal(true);
  };

  const handleDeletePlaylist = (id) => {
    handleRemoveFromPlaylist(id);
    setShowPlaylistModal(false);
  };

  const handleRemoveSong = async (playlistId, song) => {
    if (!spotifyUser) {
      alert("Please sign in to Spotify first.");
      return;
    }
    try {
      await deleteTrackFromPlaylist(playlistId, song.uri);
      alert(`Removed ${song.title} from playlist.`);
      await fetchSpotifyPlaylists();
    } catch (err) {
      console.error("Failed to remove song:", err);
      alert("Failed to remove song from playlist.");
    }
  };

  return (
    <Router>
      <Layout
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        handleAddToPlaylist={handleAddToPlaylist}
        handleRemoveFromPlaylist={handleRemoveFromPlaylist}
        playlists={playlists}
        onOpenCreatePlaylist={() => setShowCreateModal(true)}
        onOpenPlaylistModal={handleOpenPlaylistModal}
        spotifyUser={spotifyUser}
        setSpotifyUser={setSpotifyUser}
        fetchSpotifyPlaylists={fetchSpotifyPlaylists}
      />
      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePlaylist}
          spotifyUser={spotifyUser}
        />
      )}
      {showPlaylistModal && selectedPlaylist && (
        <PlaylistModal
          isOpen={showPlaylistModal}
          onClose={() => setShowPlaylistModal(false)}
          playlist={selectedPlaylist}
          handleDeletePlaylist={handleDeletePlaylist}
          onRemoveSong={handleRemoveSong}
        />
      )}
    </Router>
  );
}

export default App;
