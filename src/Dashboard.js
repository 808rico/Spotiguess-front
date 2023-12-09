import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { useNavigate } from 'react-router-dom';
import AIGenerated from './pages/AIGenerated';
//import YourLikedSongs from './pages/YourLikedSongs';
//import Playlist from './pages/Playlist';
//import Artist from './pages/Artist';
//import GamePage from './pages/GamePage';
/*

        
        

*/
function Dashboard() {
    const navigate = useNavigate();
    return (
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-generated" component={<AIGenerated/>} />
          <Route path="/liked-songs" component={YourLikedSongs} />
          <Route path="/playlist" component={Playlist} />
          <Route path="/artist" component={Artist} />
          <Route path="/game" component={GamePage} />
        </Routes>
      
    );
  }

export default Dashboard;
