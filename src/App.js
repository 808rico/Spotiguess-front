// src/App.js
import React from 'react';
import useAuth from './useAuth';
import Login from './Login';
import Dashboard from './Dashboard';
import './app.css';

function App() {
  // Chercher le paramètre 'code' dans l'URL
  const code = new URLSearchParams(window.location.search).get('code');
  // useAuth gère l'obtention et le refresh du token
  const accessToken = useAuth(code);

  // Si on a un accessToken, on affiche le Dashboard
  // Sinon on reste sur la page de Login
  return accessToken ? (
    <Dashboard accessToken={accessToken} />
  ) : (
    <Login />
  );
}

export default App;
