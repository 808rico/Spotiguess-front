import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
//import { useNavigate } from 'react-router-dom';
import useAuth from './UseAuth'; // Assurez-vous que le chemin d'importation est correct
import Dashboard from './Dashboard';
//import Login from './Login';
import './app.css'



function App() {
  const code = new URLSearchParams(window.location.search).get('code');
  const [loading, setLoading] = useState(true);
  useAuth(code);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    // Écouter les changements de l'accessToken dans le local storage
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('access_token');
      setAccessToken(updatedToken);
      setLoading(!updatedToken);
    };

    // Ajouter un écouteur sur le local storage
    window.addEventListener('storage', handleStorageChange);

    // Redirection si le code et l'accessToken sont absents
    if (!code && !accessToken) {
      window.location.assign('https://spotiguess.com'); // Redirection hors de l'app React
    } else {
      setLoading(false);
    }

    // Nettoyage de l'écouteur
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [code, accessToken]);

  // Si le chargement est en cours, afficher le loader
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Afficher le Dashboard si un accessToken est présent, sinon rediriger
  return accessToken ? <Dashboard accessToken={accessToken} /> : window.location.assign('https://spotiguess.com');
}




export default App;
