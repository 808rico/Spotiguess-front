import React, { useEffect, useState, useRef } from 'react';
import useAuth from './UseAuth';
import Dashboard from './Dashboard';
import Login from './Login';
import { Spin } from 'antd'; // Importer le composant Spin d'Ant Design
import './app.css';
import SpotifyWebApi from 'spotify-web-api-node';
import { message } from 'antd';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const accessToken = useAuth(new URLSearchParams(window.location.search).get('code'));
  const spotifyApi = useRef(new SpotifyWebApi());

  useEffect(() => {
    if (accessToken) {
      spotifyApi.current.setAccessToken(accessToken);
      spotifyApi.current.getMe().then(data => {

        if (data.body.product !== 'premium') {
          message.error('You need a premium Spotify account to use this app');
        }

        setIsPremium(data.body.product === 'premium');
        setIsLoading(false);
      }).catch((err) => {
        message.error('An error occured while trying to get your Spotify account type', err);
        setIsPremium(false);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [accessToken]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
    
    );
  }

  return accessToken && isPremium ? <Dashboard accessToken={accessToken} /> : <Login />;
}

export default App;
