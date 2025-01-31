import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AIGenerated from './pages/AIGenerated';
import LikedSongs from './pages/LikedSongs';
import Playlist from './pages/Playlist';
import Artist from './pages/Artist';
import Game from './pages/Game';
import Settings from './pages/Settings';

function Dashboard() {
  console.log('dashboard')
  window.history.pushState("", document.title, window.location.pathname + window.location.search);




  return (

    <BrowserRouter>
      <Routes>
        <Route path="/ai-generated" element={<AIGenerated />} />
        <Route path="/liked-songs" element={<LikedSongs />} />
        <Route path="/artist" element={<Artist />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Dashboard;
