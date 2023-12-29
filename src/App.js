import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
//import { useNavigate } from 'react-router-dom';
import useAuth from './UseAuth'; // Assurez-vous que le chemin d'importation est correct
import Dashboard from './Dashboard';
//import Login from './Login';
import './app.css'



function App() {
  const code = new URLSearchParams(window.location.search).get('code');
  //const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useAuth(code);
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    if (!code && !accessToken) {
      window.location.assign('https://spotiguess.com'); // Redirection hors de l'app React
    }
    if (accessToken) {
      setLoading(false);
    }
  }, [code, accessToken]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (accessToken) {
    return <Dashboard accessToken={accessToken} />;
  } else {
    //return <Login />;
    window.location.assign('https://spotiguess.com')
    
  }
}



export default App;
