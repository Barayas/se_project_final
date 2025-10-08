import React, { useState } from "react";
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
import mockReleases from "../../utils/mockReleases";
import "./App.css";

function Layout({ selectedGenre, setSelectedGenre }) {
  const location = useLocation();

  const showSidebar = location.pathname !== "/"; // hide on home route

  return (
    <div className="app">
      <Header
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />
      <div className="layout">
        {showSidebar && <Sidebar />}
        <MainContent
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          releases={mockReleases}
        />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  const [selectedGenre, setSelectedGenre] = useState("All");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
            />
          }
        />
        <Route
          path="/playlists"
          element={
            <Layout
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
            />
          }
        />
        {/* add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
