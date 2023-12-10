import Login from './Login.js'
import Dashboard from './Dashboard.js'
import useAuth from './UseAuth.js';
import './app.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';


function App() {
  const code = new URLSearchParams(window.location.search).get('code');
  const accessToken = useAuth(code);

  return (
    <Router>
      {accessToken ? <Dashboard /> : <Login />}
    </Router>
  );
}


export default App;
