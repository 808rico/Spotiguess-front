import React, { useEffect, useState,useContext } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import { MenuOutlined } from '@ant-design/icons';
import './Header.css'; // Assurez-vous de créer ce fichier pour les styles
import useAuth from "../../UseAuth"



const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

function Header({ toggleMenu, code }) {
  
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    //spotifyApi.setAccessToken(accessToken);

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
      
      {profileImageUrl && <img src={profileImageUrl} alt="Photo de profil" className="profile-picture"/>}
    </header>
  );
}

export default Header;
