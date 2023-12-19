import { BrowserRouter as  Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AIGenerated from './pages/AIGenerated';

//import YourLikedSongs from './pages/YourLikedSongs';
//import Playlist from './pages/Playlist';
//import Artist from './pages/Artist';
import Game from './pages/Game';

/*
<Route path="/liked-songs" component={YourLikedSongs} />
          <Route path="/playlist" component={Playlist} />
          <Route path="/artist" component={Artist} />
               
*/
function Dashboard() {
  console.log('dashboard')
 



    return (
      
      <Routes>
          <Route path="/ai-generated" element={<AIGenerated/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/game" element={<Game/>} />
          
        </Routes>   
      
    );
  }

export default Dashboard;
