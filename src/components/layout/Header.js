import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import { MenuOutlined } from '@ant-design/icons';
import './Header.css'; // Assurez-vous de créer ce fichier pour les styles
import Cookies from 'js-cookie';




const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

function Header({ toggleMenu, code }) {
  
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    const accessToken = Cookies.get("spotifyAuthToken")
    spotifyApi.setAccessToken(accessToken);

    spotifyApi.getMe()
      .then(function(data) {
        if (data.body.images.length > 0) {
          setProfileImageUrl(data.body.images[0].url);
        }
      }, function(err) {
        console.error('Un error occured', err);
      });
  }, []);

  return (
    <header className="header">
      <button onClick={toggleMenu} className="menu-icon">
        <MenuOutlined />
      </button>
      
      {profileImageUrl && <img src={profileImageUrl} alt="profil" className="profile-picture"/>}
    </header>
  );
}

export default Header;
