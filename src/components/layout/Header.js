import React, { useEffect, useState, useRef } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import { MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import './Header.css';

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

function Header({ toggleMenu }) {
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [showLogout, setShowLogout] = useState(false);

  // On garde une référence pour stocker le timer (pour clearTimeout si besoin)
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getMe()
      .then((data) => {
        if (data.body.images && data.body.images.length > 0) {
          setProfileImageUrl(data.body.images[0].url);
        }
      })
      .catch((err) => {
        console.error('An error occurred while fetching user data:', err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    window.location = '/';
  };

  // Quand la souris entre dans la zone .profile-container :
  // - on annule le timer de disparition
  // - on rend le bouton visible
  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowLogout(true);
  };

  // Quand la souris quitte la zone .profile-container :
  // - on déclenche un timer de 3s avant de masquer le bouton
  // - si l’utilisateur revient avant la fin du timer, on annule
  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowLogout(false);
    }, 700);
  };

  return (
    <header className="header">
      <button onClick={toggleMenu} className="menu-icon">
        <MenuOutlined />
      </button>

      <div 
        className="profile-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            alt="profil"
            className="profile-picture"
          />
        )}

        {showLogout && (
          <button className="logout-button" onClick={handleLogout}>
            <LogoutOutlined className="logout-icon" />
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
