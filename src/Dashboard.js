import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AIGenerated from './pages/AIGenerated';



import LikedSongs from './pages/LikedSongs';
//import Playlist from './pages/Playlist';
//import Artist from './pages/Artist';
import Game from './pages/Game';

/*
<Route path="/liked-songs" component={YourLikedSongs} />
          <Route path="/playlist" component={Playlist} />
          <Route path="/artist" component={Artist} />
               

                <Routes>
          <Route path="/ai-generated" element={<AIGenerated/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/game" element={<Game/>} />
          
        </Routes>
*/
function Dashboard() {
  console.log('dashboard')




  return (

    <BrowserRouter>
      <Routes>
        <Route path="/ai-generated" element={<AIGenerated />} />
        <Route path="/liked-songs" element={<LikedSongs />} />
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Dashboard;
