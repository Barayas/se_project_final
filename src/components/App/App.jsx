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
import mockReleases from "../../utils/mockReleases";
import "./App.css";

function Layout({
  selectedGenre,
  setSelectedGenre,
  handleAddToPlaylist,
  handleRemoveFromPlaylist,
  playlist,
}) {
  const location = useLocation();
  const showSidebar = location.pathname !== "/"; // hide sidebar on home

  return (
    <div className="app">
      <Header
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
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
                releases={mockReleases}
                handleAddToPlaylist={handleAddToPlaylist}
              />
            }
          />
          <Route
            path="/playlists"
            element={
              <PlaylistPage
                playlist={playlist}
                handleRemoveFromPlaylist={handleRemoveFromPlaylist}
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
  const [playlist, setPlaylist] = useState(() => {
    // ✅ Load from localStorage on startup
    const saved = localStorage.getItem("nexttrack_playlist");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Save to localStorage whenever playlist changes
  useEffect(() => {
    localStorage.setItem("nexttrack_playlist", JSON.stringify(playlist));
  }, [playlist]);

  const handleAddToPlaylist = (album) => {
    setPlaylist((prev) => {
      if (prev.find((a) => a.id === album.id)) return prev; // avoid duplicates
      return [...prev, album];
    });
  };

  const handleRemoveFromPlaylist = (albumId) => {
    setPlaylist((prev) => prev.filter((a) => a.id !== albumId));
  };

  return (
    <Router>
      <Layout
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        handleAddToPlaylist={handleAddToPlaylist}
        handleRemoveFromPlaylist={handleRemoveFromPlaylist}
        playlist={playlist}
      />
    </Router>
  );
}

export default App;
