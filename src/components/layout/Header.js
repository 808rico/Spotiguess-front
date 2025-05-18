import React, { useEffect, useState, useRef } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import { MenuOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';          // ⬅️  Ant Design Avatar
import './Header.css';

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

function Header({ toggleMenu }) {
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getMe()
      .then(({ body }) => {
        if (body.images?.length) {
          setProfileImageUrl(body.images[0].url);
        }
      })
      .catch((err) =>
        console.error('An error occurred while fetching user data:', err)
      );
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    window.location = '/';
  };

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowLogout(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => setShowLogout(false), 700);
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
        {/* Avatar automatically shows the UserOutlined icon
            when `src` is empty or fails to load */}
        <Avatar
          src={profileImageUrl || null}      // null = “no image”
          icon={<UserOutlined />}            // fallback icon
          size={40}                          // tweak as needed
          className="profile-picture"
        />

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
