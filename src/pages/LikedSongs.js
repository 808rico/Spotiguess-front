import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
//import { useMediaQuery } from 'react-responsive';
import { Divider, message, Button } from "antd";
import { PlayCircleOutlined, HeartOutlined } from '@ant-design/icons';
import './LikedSongs.css'
import axios from "axios";
import PopUpPay from "../components/popUp/PopUpPay";
import Cookies from 'js-cookie';

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const urlServer = process.env.REACT_APP_URL_SERVER;


//const urlServer = 'http://localhost:3001'; // Ou 'https://spotiguess-server-4a46bc45d48c.herokuapp.com'


function LikedSongs() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = Cookies.get("spotifyAuthToken")
  const [showPopupPay, setShowPopupPay] = useState(false);
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
          console.log('Status code:', error.response.status); // Affiche le code de statut de l'erreur
          if (error.response.status === 400) {
              setShowPopupPay(true); // Afficher la popup pour le code 400
          }
          else{
            message.error("Error:" + error.message);
          }
        })
        .finally(() => {
            setLoading(false); // Désactive le loader
        });
  };





  return (


    <MainLayout>
      <div style={{ background: '#000000',  minHeight: 280, height: '100%' }}>
        <h1><HeartOutlined style={{ fontSize: '25px', marginRight: '10px' }} />Your liked songs</h1>
        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2>Hit play.</h2>
        <p className="paragraph-liked-songs">
          15 songs of your liked playlist will be randomly selected. </p>
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
        <PopUpPay isVisible={showPopupPay} onClose={() => setShowPopupPay(false)}/>
      </div>
    </MainLayout>
  );
};


export default LikedSongs