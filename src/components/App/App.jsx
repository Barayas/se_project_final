import { useState } from "react";

import React from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import MainContent from "../MainContent/MainContent";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="layout">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default App;
