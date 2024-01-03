import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
//import { useMediaQuery } from 'react-responsive';
import { Divider, message, Button } from "antd";
import { PlayCircleOutlined, HeartOutlined } from '@ant-design/icons';
import './LikedSongs.css'
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const urlServer = process.env.REACT_APP_URL_SERVER;


//const urlServer = 'http://localhost:3001'; // Ou 'https://spotiguess-server-4a46bc45d48c.herokuapp.com'


function LikedSongs() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access_token')
  spotifyApi.setAccessToken(accessToken);


  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])


  const onPlayLikedSongs = () => {
    setLoading(true); // Active le loader

    axios.post(`${urlServer}/liked-songs`, { accessToken: accessToken })
        .then((response) => {
          const songUris = response.data.map(song => song.uri)
          console.log(songUris)
            navigate('/game', {
                state: {
                    type: 'Your Liked Songs',
                    iconName: 'HeartOutlined',
                    songUris: songUris
                }
            });
        })
        .catch(error => {
            message.error('Error: ' + error.message);
            console.error('Erreur lors de la récupération des chansons:', error);
        })
        .finally(() => {
            setLoading(false); // Désactive le loader
        });
  };





  return (


    <MainLayout>
      <div style={{ background: '#000000', padding: 24, minHeight: 280, height: '100%' }}>
        <h1><HeartOutlined style={{ fontSize: '25px', marginRight: '10px' }} />Your liked songs</h1>
        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2>How it works?</h2>
        <p>
          👉🏻<b>Hit play:</b> <br />15 songs of your liked playlist will be randomly selected. </p>

        <p>
          👉🏻 <b>Play.</b><br />
          Alone or with your friends and family, try to guess the song and yell when you got it.
        </p>
        <div className="search-container" >


          <Button
            className="play-button-liked"
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={onPlayLikedSongs}
            size="large"
            loading={loading}>

            Play
          </Button>


        </div>
      </div>
    </MainLayout>
  );
};


export default LikedSongs