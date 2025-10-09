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
import mockReleases from "../../utils/mockReleases";
import "./App.css";

function Layout({
  selectedGenre,
  setSelectedGenre,
  handleAddToPlaylist,
  handleRemoveFromPlaylist,
  playlists,
  onOpenCreatePlaylist,
  onOpenPlaylistModal,
}) {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";

  return (
    <div className="app">
      <Header onOpenCreatePlaylist={onOpenCreatePlaylist} />
      <div className="layout">
        {showSidebar && <Sidebar />}
        <Routes>
          <Route
            path="/"
            element={
              <MainContent
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                releases={mockReleases}
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
              />
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem("nexttrack_playlists");
    return saved ? JSON.parse(saved) : [];
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Persist playlists in localStorage
  useEffect(() => {
    localStorage.setItem("nexttrack_playlists", JSON.stringify(playlists));
  }, [playlists]);

  const handleCreatePlaylist = ({ name, description, cover }) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      description,
      albums: [],
      songs: [],
      cover: cover || null,
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const handleAddToPlaylist = (album, playlist, track) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlist.id) {
          const newSong = {
            title: track,
            artist: album.artist,
            album: album.title,
            cover: album.cover,
          };

          // Prevent duplicate songs
          const exists = p.songs?.some(
            (s) =>
              s.title === newSong.title &&
              s.artist === newSong.artist &&
              s.album === newSong.album
          );

          return {
            ...p,
            songs: exists ? p.songs : [...(p.songs || []), newSong],
          };
        }
        return p;
      })
    );
  };

  const handleRemoveFromPlaylist = (playlistId) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  };

  const handleOpenPlaylistModal = (playlist) => {
    setSelectedPlaylist(playlist);
    setShowPlaylistModal(true);
  };

  const handleDeletePlaylist = (id) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    setShowPlaylistModal(false);
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
      />

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePlaylist}
        />
      )}

      {/* Playlist Info Modal */}
      {showPlaylistModal && selectedPlaylist && (
        <PlaylistModal
          isOpen={showPlaylistModal}
          onClose={() => setShowPlaylistModal(false)}
          playlist={selectedPlaylist}
          handleDeletePlaylist={handleDeletePlaylist}
        />
      )}
    </Router>
  );
}

export default App;
