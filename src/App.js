import Login from './Login.js'
import React from 'react';
import Dashboard from './Dashboard.js'
import useAuth from './UseAuth.js';
import './app.css'
import { BrowserRouter as Router } from 'react-router-dom';


function App() {

  const code = new URLSearchParams(window.location.search).get('code');
  const accessToken =  useAuth(code);
  const script = document.createElement('script');
  script.src = 'https://sdk.scdn.co/spotify-player.js';
  script.async = true;
  document.body.appendChild(script);
  
  console.log('app')

  return (

    <Router>

        {accessToken ? <Dashboard accessToken={accessToken}/> : <Login />
        }

    </Router>


  );
}


export default App;
