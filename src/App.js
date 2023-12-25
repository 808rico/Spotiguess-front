import Login from './Login.js'
import React from 'react';
import Dashboard from './Dashboard.js'
import useAuth from './UseAuth.js';
import './app.css'



function App() {

  const code = new URLSearchParams(window.location.search).get('code');
  console.log(code)
  const accessToken =  useAuth(code);
console.log(accessToken)
  const script = document.createElement('script');
  script.src = 'https://sdk.scdn.co/spotify-player.js';
  script.async = true;
  document.body.appendChild(script);
  
  console.log('app')

  if (accessToken) {
    return(

        <Dashboard accessToken={accessToken}/>
      )
  }

  else{
    return(
        <Login />
)
  }
}


export default App;
