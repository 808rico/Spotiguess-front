import Login from './Login.js'
import Dashboard from './Dashboard'
import './app.css'


const code = new URLSearchParams(window.location.search).get('code')


function App() { 
  return ( code ? <Dashboard code={code}/> : < Login />
  
  );
}

export default App;
