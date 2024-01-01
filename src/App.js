import React, { useEffect } from 'react';
import useAuth from './UseAuth';
import Dashboard from './Dashboard';
import Login from './Login';
import './app.css';

function App() {
  const code = new URLSearchParams(window.location.search).get('code');
  const accessToken = useAuth(code); // utilisez le hook pour obtenir l'access token

  useEffect(() => {
    // Supprimez la vérification du code car useAuth s'en occupe
    if (!accessToken) {
      // Si pas de token, rediriger vers Login
      // Vous pouvez implémenter une logique pour vérifier l'expiration du token ici
    }
  }, [accessToken]);

  // Gestion du rendu conditionnel
  if (!accessToken) {
    return <Login />;
  } else {
    return <Dashboard accessToken={accessToken} />;
  }
}

export default App;
