import React, {useState, useEffect} from 'react';
import Dashboard from './Dashboard';
import './app.css';
import SpotifyWebApi from 'spotify-web-api-node';
import { SpotifyApiContext } from 'react-spotify-api'
import Cookies from 'js-cookie'
import { message } from 'antd';
import { SpotifyAuth } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css'
/*
import Login from './Login';
import { Spin } from 'antd'; // Importer le composant Spin d'Ant Design
import { useNavigate } from 'react-router-dom';

*/


function App() {
  //const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const [token, setToken] = React.useState(Cookies.get("spotifyAuthToken"))
  console.log(token)


  const spotifyApi = new SpotifyWebApi();

  useEffect(() => {
    if (token) {
      spotifyApi.setAccessToken(token);
      spotifyApi.getMe().then(data => {
        if (data.body.product !== 'premium') {
          message.error('You need a premium Spotify account to use this app');
          Cookies.remove("spotifyAuthToken");
          setToken(null);
          // Supprimez le token ou déconnectez l'utilisateur ici
        }
        // Autres traitements si l'utilisateur est premium
      }).catch(err => {
        console.error('Error fetching user data:', err);
      });
    }
  }, [token]);

  /*
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
    
    );
  }*/

  //console.log('accessToken', accessToken);

  //return accessToken && isPremium ? <Dashboard accessToken={accessToken} /> : <Login />;

  

  return (
    <div className='app'>
      {token ? (
        <SpotifyApiContext.Provider value={token}>


          <Dashboard />

        </SpotifyApiContext.Provider>
      ) : (
        // Display the login page
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <SpotifyAuth
            redirectUri={process.env.REACT_APP_URL_CLIENT}
            clientID='80256b057e324c5f952f3577ff843c29'
            scopes={['streaming', 'user-read-email', 'user-read-private', 'user-library-read', 'user-library-modify', 'user-top-read', 'user-read-playback-state', 'user-modify-playback-state']}
            onAccessToken={(token) => setToken(token)}
          />
        </div>
      )}
    </div>
  )



}

export default App;
