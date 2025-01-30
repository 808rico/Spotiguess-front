import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import { Divider, message, Button } from "antd";
import { PlayCircleOutlined, HeartOutlined, SwapOutlined } from '@ant-design/icons';
import './LikedSongs.css';
import axios from "axios";
import PopUpPay from "../components/popUp/PopUpPay";
import Cookies from 'js-cookie';
import PopUpGameMode from '../components/popUp/PopUpGameMode';

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const urlServer = process.env.REACT_APP_URL_SERVER;

function LikedSongs() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = Cookies.get("spotifyAuthToken");
  const [showPopupPay, setShowPopupPay] = useState(false);

  // État pour le Game Mode (auto ou manual) et la popup de changement
  const [gameMode, setGameMode] = useState(null);
  const [showGameModePopup, setShowGameModePopup] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    // Récupère le game mode au chargement (auto / manual)
    axios
      .get(`${urlServer}/settings/game-mode`, { params: { accessToken } })
      .then((response) => {
        if (response.data?.gameType) {
          setGameMode(response.data.gameType);
        }
      })
      .catch((error) => {
        console.error("Error fetching game mode:", error);
        message.error("Error fetching game mode");
      });
  }, [accessToken]);

  // Lance le jeu avec les Liked Songs
  const onPlayLikedSongs = () => {
    setLoading(true);

    axios
      .post(`${urlServer}/liked-songs`, { accessToken })
      .then((response) => {
        const songUris = response.data.map(song => song.uri);
        navigate('/game', {
          state: {
            type: 'Your Liked Songs',
            input: 'Your Liked Songs',
            iconName: 'HeartOutlined',
            songUris: songUris,
          },
        });
      })
      .catch(error => {
        if (error?.response?.status === 400) {
          setShowPopupPay(true); // Afficher la popup de paiement
        } else {
          message.error("Error: " + error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <MainLayout>
      <div style={{ background: '#000000', minHeight: 280, height: '100%' }}>
        <h1 className="text-white text-3xl font-bold mb-2">
          <HeartOutlined style={{ fontSize: '25px', marginRight: '10px' }} />
          Your liked songs
        </h1>
        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2 className="text-white text-xl mb-6 font-medium">
          Your saved songs will be randomly played.
        </h2>

        {/* Affichage du Game Mode + bouton Switch */}
        <div className="mt-6 text-white flex bg-slate-800 rounded-md p-2 justify-between items-center">
          <p className="text-base font-light ml-5">
            <span>Current Game Mode: </span>
            <span className="font-semibold text-green-600">
              {gameMode === "auto" ? "Auto" : gameMode === "manual" ? "Manual" : "loading..."}
            </span>
          </p>
          <button
            onClick={() => setShowGameModePopup(true)}
            className="bg-slate-900 px-4 py-1 hover:font-bold rounded-lg transition mr-5"
          >
            <SwapOutlined style={{ fontSize: '20px', paddingRight: '5px' }} />
            Switch
          </button>
        </div>

        {/* Bouton Play */}
        <Button
          className="play-button-liked"
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={onPlayLikedSongs}
          size="large"
          loading={loading}
          style={{ marginTop: '20px' }}
        >
          Play
        </Button>

        {/* Popup Pay si l'utilisateur dépasse la limite */}
        <PopUpPay
          isVisible={showPopupPay}
          onClose={() => setShowPopupPay(false)}
        />

        {/* Popup de changement de Game Mode */}
        <PopUpGameMode
          isVisible={showGameModePopup}
          onClose={() => setShowGameModePopup(false)}
          gameMode={gameMode}
          setGameMode={setGameMode}
          accessToken={accessToken}
        />
      </div>
    </MainLayout>
  );
}

export default LikedSongs;
