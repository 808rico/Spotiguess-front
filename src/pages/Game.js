import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import { useMediaQuery } from 'react-responsive';
import { Divider, Input } from "antd";
import { useLocation } from 'react-router-dom';
//import { PlayCircleOutlined, BulbOutlined,LoadingOutlined } from '@ant-design/icons';
//import './AIGenerated.css'

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});



const urlServer = 'http://localhost:3001'; // Ou 'https://blindtest-spotify-v1.herokuapp.com'




function Game() {
    const location = useLocation();
  const { type, input, songIds } = location.state;

  console.log(input)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access_token')
  spotifyApi.setAccessToken(accessToken);
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 700 });

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])


  const handleNavigate = (path) => {
    navigate(path);
  };

  return (


    <MainLayout>
      <div style={{ background: '#000000', padding: 24, minHeight: 280, height: '100%' }}>
        <h1>Game</h1>
        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2>How it works?</h2>
        
      </div>
    </MainLayout>
  );
};


export default Game