// src/Login.js
import React from 'react';

function Login() {
  // Construit l'URL d'autorisation Spotify
  const AUTH_URL = `
    https://accounts.spotify.com/authorize
    ?client_id=${process.env.REACT_APP_CLIENT_ID}
    &response_type=code
    &redirect_uri=${encodeURIComponent(process.env.REACT_APP_URL_CLIENT)}
    &scope=streaming%20user-read-email%20user-read-private%20user-library-read
    %20user-library-modify%20user-top-read%20user-read-playback-state%20user-modify-playback-state
  `.replace(/\s+/g, ''); 
  // on retire les espaces éventuels pour avoir une URL propre
  
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#000',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h1>Welcome to Spotiguess</h1>
      <p>Please sign in with your Spotify Premium account to use the app.</p>
      <a 
        href={AUTH_URL}
        style={{
          backgroundColor: '#1DB954',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '20px',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        Login with Spotify
      </a>
    </div>
  );
}

export default Login;
