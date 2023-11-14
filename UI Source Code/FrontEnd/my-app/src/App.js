import React from 'react';
import './App.css';
import {  BrowserRouter as Router,Routes , Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";


import PlayerList from './Components/PlayerList';
import PlayerEdit from './Components/PlayerEdit';
import PlayerView from './Components/PlayerView';
import CreatePlayer from './Components/createPlayer';

function App() {

  return (
    <div>
  
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to={"/players"} className="nav-link">
            Players
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/createPlayer"} className="nav-link">
            Create Player
          </Link>
        </li>
      </div>
    </nav>
    <div className="container mt-3">
      <Routes>
        <Route exact path="/" element={<PlayerList />} />
        <Route exact path="/players" element={<PlayerList />} />
        <Route path="/playerEdit" element={< PlayerEdit />} />
        <Route path="/playerView" element={< PlayerView />} />
        <Route path="/createPlayer" element={< CreatePlayer />} />
      </Routes>
    </div>
  
  </div>
  );
}

export default App;