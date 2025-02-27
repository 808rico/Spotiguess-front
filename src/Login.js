// src/Login.js
import React, { useState } from 'react';
import { Modal } from 'antd';

function Login() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Ouvre/ferme le Modal
  const showModal = () => setIsModalVisible(true);
  const handleModalClose = () => setIsModalVisible(false);

  // Construit l'URL d'autorisation Spotify (sans react-spotify-auth)
  const AUTH_URL = `
    https://accounts.spotify.com/authorize
    ?client_id=${process.env.REACT_APP_CLIENT_ID}
    &response_type=code
    &redirect_uri=${encodeURIComponent(process.env.REACT_APP_URL_CLIENT)}
    &scope=streaming%20user-read-email%20user-read-private%20user-library-read
    %20user-library-modify%20user-top-read%20user-read-playback-state%20user-modify-playback-state
  `.replace(/\s+/g, '');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        height: '100vh',
      }}
    >
      <h1 className="text-2xl font-bold mb-2">Welcome to Spotiguess</h1>
      <p style={{ marginBottom: '20px' }}>
        Sign in with your Spotify Premium account to use the app.
      </p>

      {/* Bouton de connexion vers Spotify */}
      <a
        href={AUTH_URL}
        style={{
          backgroundColor: '#1DB954',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '25px',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        Login with Spotify
      </a>

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

      {/* Modal avec informations de confidentialité */}
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

export default Login;
