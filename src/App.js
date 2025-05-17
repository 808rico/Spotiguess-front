import './app.css'
import React, { useEffect } from 'react';
import { message } from 'antd';

import SpotifyWebApi from 'spotify-web-api-node';

import useAuth from './UseAuth';  // votre hook qui gère /login & /refresh
import Login from './Login';
import Dashboard from './Dashboard';
import Feedback from 'feeder-react-feedback'; // Import Feedback component
import 'feeder-react-feedback/dist/feeder-react-feedback.css'; // Import stylesheet


function App() {
  // Récupère le code dans l’URL
  const code = new URLSearchParams(window.location.search).get('code');
  // useAuth gère l’obtention et le refresh du token
  const accessToken = useAuth(code);

  // 1. Dès qu’on a un accessToken, on vérifie si le compte est Premium
  useEffect(() => {
    if (!accessToken) return; // pas encore connecté

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(accessToken);

    spotifyApi
      .getMe()
      .then(data => {
        if (data.body.product !== 'premium') {
          message.error('You need a Premium Spotify account to use this app');
          // On supprime le cookie s’il existe
          
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Puis on redirige vers la page de login
          window.location.href = '/';
        }
      })
      .catch(err => {
        console.error('Error checking user data:', err);
      });
  }, [accessToken]);

  // 2. Si on n’a pas de token, on affiche la page de login
  //    Sinon on affiche le dashboard
  return accessToken ? (
    <div className='app'>
      <Dashboard accessToken={accessToken} />
      <Feedback
        projectId="66008793f8e6de00023d2f8b"
        email={true}
        primaryColor="#222222"
      />
    </div>


  ) : (
    <Login />
  );
}

export default App;
