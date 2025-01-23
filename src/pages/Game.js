import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import PopUpResult from '../components/popUp/PopUpResult';
import PopUpFinish from '../components/popUp/PopUpFinish';
import Equalizer from "../components/Equalizer";
import Player from "../Player";
import Cookies from 'js-cookie';
import axios from 'axios';
import PopUpPay from "../components/popUp/PopUpPay";

// Icônes du nouveau code
import { FaPlay, FaPause, FaForward, FaBackward, FaEye } from 'react-icons/fa';

// Composants/Styles "ancienne" version
import { Divider, Button, message } from 'antd';
import { PlayCircleOutlined, BulbOutlined, HeartOutlined, UserOutlined,UnorderedListOutlined } from '@ant-design/icons';

import './Game.css'; // Vos anciennes classes CSS

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const urlServer = process.env.REACT_APP_URL_SERVER;

/**
 * Mapping des noms d'icônes (strings) vers les composants réels d'Ant Design
 * Ajoutez ici toutes les icônes dont vous avez besoin
 */
const iconMap = {
  BulbOutlined: BulbOutlined,
  HeartOutlined: HeartOutlined,
  UserOutlined: UserOutlined,
  UnorderedListOutlined: UnorderedListOutlined,
};

function Game() {
  const location = useLocation();
  const navigate = useNavigate();

  // On suppose que vous passez iconName via location.state
  const { type, iconName, input, songUris } = location.state;

  const accessToken = Cookies.get("spotifyAuthToken");

  // Récupération de l'icône
  const Icon = iconMap[iconName];

  // État de démarrage du jeu
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Lecture/Pause
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [maxSongIndex, setMaxSongIndex] = useState(10);
  const [isPlaylistFinished, setIsPlaylistFinished] = useState(false);
  const [isReplayButtonVisible, setIsReplayButtonVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [showPopupResult, setShowPopupResult] = useState(false);
  const [showPopupFinish, setShowPopupFinish] = useState(false);
  const [showPopupPay, setShowPopupPay] = useState(false);

  // eslint-disable-next-line
  const [deviceId, setDeviceId] = useState('');
  // eslint-disable-next-line
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (accessToken && songUris[currentSongIndex]) {
      spotifyApi.setAccessToken(accessToken);

      spotifyApi
        .getTrack(songUris[currentSongIndex].split(":").pop())
        .then((data) => {
          setCurrentTrack(data.body);
        })
        .catch((err) => {
          message.error("Error retrieving track information: " + err.message);
          console.error(err);
        });
    }
  }, [currentSongIndex, accessToken, songUris]);

  const handlePlayerStateChange = (state) => {
    if (state.status === 'READY') {
      setDeviceId(state.deviceId);
      setIsPlayerReady(true);
    }
  };

  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsPlaying(true);
  };

  // Play / Pause
  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
  };

  // Previous
  const handlePreviousTrack = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  // Next
  const handleNextTrack = () => {
    const nextIndex = currentSongIndex + 1;
    if (nextIndex < maxSongIndex) {
      setCurrentSongIndex(nextIndex);
      setIsPlaying(true);
    } else {
      // Fin de la playlist
      setIsReplayButtonVisible((songUris.length - maxSongIndex) >= 10);
      setIsPlaylistFinished(true);
      setShowPopupFinish(true);
    }
  };

  // Rejouer
  const onReplay = () => {
    axios
      .post(`${urlServer}/keep-playing`, {
        accessToken: accessToken,
        gameType: { type }
      })
      .then(() => {
        setMaxSongIndex(maxSongIndex + 10);
        setShowPopupFinish(false);
        setCurrentSongIndex(currentSongIndex + 1);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setShowPopupFinish(false);
          setShowPopupPay(true);
        } else {
          console.error('Error:', error.message);
        }
      });
  };

  return (
    <MainLayout>
      <div className="bg-black pt-6 min-h-screen flex flex-col items-center justify-start">

        {/* ÉCRAN DE DÉMARRAGE : même style qu'avant (si la partie n'est pas lancée) */}
        {!isGameStarted && (
          <div className="layoutWrapper">
            {/* Titre : on affiche l'icône si disponible */}
            <h1 className="title">
              {Icon && <Icon style={{ marginRight: 8 }} />}
              {type}
            </h1>
            <Divider
              className="divider"
              style={{ borderColor: 'white', width: '400px', margin: '12px 0' }}
            />
            <h3 className="subTitle">{input}</h3>

            <Button
              className="play-button"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleStartGame}
              size="large"
            >
              Play
            </Button>
          </div>
        )}

        {/* ÉCRAN DU JEU : nouveau style (si la partie est lancée) */}
        {isGameStarted && (
          <>
            {/* Player Spotify */}
            <Player
              accessToken={accessToken}
              callback={handlePlayerStateChange}
              trackUri={songUris[currentSongIndex]}
              play={isPlaying}
            />

            {/* Titre */}
            <h1 className="text-white font-bold mb-4 text-center text-2xl">
              {type}
            </h1>

            {/* Séparateur */}
            <hr className="border-t border-white w-64 mb-4" />

            {/* Sous-titre */}
            <h3 className="text-white font-medium mb-4 text-center text-lg">
              {input}
            </h3>

            {/* Équalizer + Contrôles */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex justify-center items-center mb-6 my-6">
                <Equalizer isPlaying={isPlaying} />
              </div>

              {/* Contrôles (précédent, play/pause, suivant) */}
              <div className="flex gap-6 my-4">
                <button
                  onClick={handlePreviousTrack}
                  disabled={currentSongIndex === 0}
                  className="w-16 h-16 flex justify-center items-center 
                             rounded-full bg-white text-black 
                             hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed 
                             transition-transform transform hover:scale-110"
                >
                  <FaBackward size={24} />
                </button>

                <button
                  onClick={handlePlayPauseClick}
                  className="w-16 h-16 flex justify-center items-center 
                             rounded-full bg-white text-black 
                             hover:bg-green-500 transition-transform transform hover:scale-110"
                >
                  {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="w-16 h-16 flex justify-center items-center 
                             rounded-full bg-white text-black 
                             hover:bg-green-500 transition-transform transform hover:scale-110"
                >
                  <FaForward size={24} />
                </button>
              </div>

              {/* Bouton "Show Track" */}
              <div className="mt-4">
                <button
                  onClick={() => setShowPopupResult(!showPopupResult)}
                  className="bg-green-500 text-black font-black px-6 py-3 rounded
                             hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <FaEye size={18} />
                  Show Track
                </button>
              </div>
            </div>
          </>
        )}

        {/* PopUpResult */}
        {currentTrack && (
          <PopUpResult
            isVisible={showPopupResult}
            onClose={() => setShowPopupResult(false)}
            currentTrack={currentTrack}
            onNextTrack={handleNextTrack}
          />
        )}

        {/* PopUpFinish */}
        {isPlaylistFinished && (
          <PopUpFinish
            isVisible={showPopupFinish}
            onClose={() => setShowPopupFinish(false)}
            isReplayButtonVisible={isReplayButtonVisible}
            onReplay={onReplay}
            onGoToHome={() => navigate('/')}
          />
        )}

        {/* PopUpPay */}
        <PopUpPay
          isVisible={showPopupPay}
          onClose={() => setShowPopupPay(false)}
        />
      </div>
    </MainLayout>
  );
}

export default Game;
