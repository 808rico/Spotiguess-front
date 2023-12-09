import Login from './Login.js'
import Dashboard from './pages/Home.js'
import './app.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const code = new URLSearchParams(window.location.search).get('code')


function App() { 
  
  return (
    <Router>
    {code ? <Dashboard code={code}/> : < Login />}
  </Router>
  );
  
}

export default App;
