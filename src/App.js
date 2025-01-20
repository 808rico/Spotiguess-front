import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import './app.css';
import SpotifyWebApi from 'spotify-web-api-node';
import { SpotifyApiContext } from 'react-spotify-api';
import Cookies from 'js-cookie';
import { message, Modal } from 'antd'; // Import Modal from Ant Design
import { SpotifyAuth } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css';

import Feedback from 'feeder-react-feedback'; // Import Feedback component
import 'feeder-react-feedback/dist/feeder-react-feedback.css'; // Import stylesheet

function App() {
  const [token, setToken] = React.useState(Cookies.get('spotifyAuthToken'));
  const [isModalVisible, setIsModalVisible] = useState(false); // State for Modal visibility

  useEffect(() => {
    if (token) {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token);
      spotifyApi.getMe().then(data => {
        if (data.body.product !== 'premium') {
          message.error('You need a premium Spotify account to use this app');
          Cookies.remove('spotifyAuthToken');
          setToken(null);
        }
      }).catch(err => {
        console.error('Error fetching user data:', err);
      });
    }
  }, [token]);

  // Open and close modal handlers
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='app'>
      {token ? (
        <SpotifyApiContext.Provider value={token}>
          <Dashboard />
          <Feedback
            projectId="66008793f8e6de00023d2f8b"
            email={true}
            primaryColor="#222222"
          />
        </SpotifyApiContext.Provider>
      ) : (
        // Page de connexion
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <h1 className="text-2xl font-bold	mb-2">Welcome to Spotiguess</h1>
          <p style={{ marginBottom: '20px' }}>
            Sign in with your Spotify Premium account to use the app.
          </p>
          <SpotifyAuth
            redirectUri={process.env.REACT_APP_URL_CLIENT}
            clientID="80256b057e324c5f952f3577ff843c29"
            scopes={[
              'streaming',
              'user-read-email',
              'user-read-private',
              'user-library-read',
              'user-library-modify',
              'user-top-read',
              'user-read-playback-state',
              'user-modify-playback-state',
            ]}
            onAccessToken={(token) => setToken(token)}
          />
          <p style={{ marginTop: '20px', fontSize: '12px' }}>
            Your privacy is important to us.{' '}
            <button
              onClick={showModal}
              style={{
                background: 'none',
                color: '#1DB954',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '12px',
              }}
            >
              Learn more
            </button>
          </p>
        </div>
      )}

      {/* Modal with privacy information */}
      <Modal
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        style={{ textAlign: 'center', backgroundColor: '#000000' }}
        closeIcon={<span style={{ color: 'white' }}>×</span>}
      >
        <h3>Privacy Policy</h3>
        <p>
          We respect your privacy and take the protection of your data seriously.
          Spotiguess uses your Spotify account to provide personalized features.
          Your data is never shared with third parties without your consent.
        </p>
      </Modal>
    </div>
  );
}

export default App;
