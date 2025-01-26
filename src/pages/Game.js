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
import { PlayCircleOutlined, BulbOutlined, HeartOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';

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
  const [gameType, setGameType] = useState(null);
  const [isKeepPlayingLoading, setIsKeepPlayingLoading] = useState(false);
  const [countdown, setCountdown] = useState(15); // Compteur
  const [subtitle, setSubtitle] = useState("What's the song?"); // Texte dynamique


  // eslint-disable-next-line
  const [deviceId, setDeviceId] = useState('');
  // eslint-disable-next-line
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (accessToken) {
      axios
        .get(`${urlServer}/settings/game-mode`, { params: { accessToken } })
        .then((response) => {
          if (response.data && response.data.gameType) {
            setGameType(response.data.gameType);
          }
        })
        .catch((error) => {
          console.error("Error fetching game mode:", error);
          message.error("Error user settings");
        });
    }
  }, [urlServer, accessToken]);

  useEffect(() => {
    console.log("GameType:", gameType);
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
    // En mode "manual", on veut démarrer la lecture dès qu'on lance la game
    // En mode "auto", on laisse le useEffect gérer la lecture automatique
    if (gameType === "manual") {
      setIsPlaying(true);
    }
  };

  // Play / Pause (MANUAL)
  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
  };

  // Previous (MANUAL)
  const handlePreviousTrack = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  // Next (MANUAL)
  const handleNextTrack = () => {
    const nextIndex = currentSongIndex + 1;
    if (nextIndex < maxSongIndex && nextIndex < songUris.length) {
      setCurrentSongIndex(nextIndex);
      setIsPlaying(true);
    } else {
      // Fin de la playlist
      setIsPlaylistFinished(true);
      setShowPopupFinish(true);
      // Vérifie si on peut "rejouer" 10 de plus
      setIsReplayButtonVisible((songUris.length - maxSongIndex) >= 10);
    }
  };

  // Rejouer
  const onReplay = () => {
    setIsKeepPlayingLoading(true);
    axios
      .post(`${urlServer}/keep-playing`, {
        accessToken: accessToken,
        gameType: { type }
      })
      .then(() => {
        setMaxSongIndex(maxSongIndex + 10);
        setCurrentSongIndex(currentSongIndex + 1);
        setIsPlaylistFinished(false);
        setShowPopupFinish(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setShowPopupFinish(false);
          setShowPopupPay(true);
        } else {
          console.error('Error:', error.message);
          message.error('Error while trying to load more songs');
        }
      })
      .finally(() => {
        // On enlève le loader quoiqu'il arrive
        setIsKeepPlayingLoading(false);
      });
  };
  // ---------------------------------------------------------
  // AJOUT AUTO MODE : Gérer la lecture auto si gameType === "auto"
  // ---------------------------------------------------------
  // En haut de votre composant
 
  // etc.

  // ---------------------------------------------------------
  // AJOUT AUTO MODE : Gérer la lecture auto si gameType === "auto"
  // ---------------------------------------------------------
  useEffect(() => {
    // On veut déclencher toute la mécanique uniquement dans ces conditions
    if (
      gameType === 'auto' &&
      isGameStarted &&
      !isPlaylistFinished &&
      currentSongIndex < maxSongIndex
    ) {
      // On prépare plusieurs "timers" pour gérer les différentes phases
      let countdownInterval;
      let lastChanceTimer;
      let showResultTimer;
      let hideResultTimer;

      // Lancement de la lecture
      setIsPlaying(true);
      // Réinitialise le décompte
      setCountdown(15);
      // Sous-titre par défaut
      setSubtitle("What's the song?");
      // Pas de popup visible au départ
      setShowPopupResult(false);

      // 1) Gérer le décompte de 15s
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          // Si on atteint 1, on affiche "?" et on arrête le décompte
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return '?';
          }
          return prev - 1;
        });
      }, 1000);

      // 2) Au bout de 15s, on affiche "Last chance" (sans popup) pendant 3s
      lastChanceTimer = setTimeout(() => {
        // Stop le décompte si ce n'est pas déjà fait
        clearInterval(countdownInterval);
        // Met le sous-titre sur "Last chance"
        setSubtitle("Last chance");
        setCountdown('?')
        setIsPlaying(false);
        // On reste avec "?" + "Last chance" pendant 3s, donc pas de popup ici
        showResultTimer = setTimeout(() => {
          // 3) Après ces 3s, on affiche la popup du résultat pendant 5s
          setShowPopupResult(true);
          setIsPlaying(true);

          hideResultTimer = setTimeout(() => {
            // 4) Au bout de 5s, on masque la popup et on passe au morceau suivant
            setShowPopupResult(false);
            handleNextTrack();
          }, 5000);
        }, 2000);
      }, 15000);

      // Nettoyage : s’exécute si le composant est démonté
      // ou si les dépendances changent
      return () => {
        clearInterval(countdownInterval);
        clearTimeout(lastChanceTimer);
        clearTimeout(showResultTimer);
        clearTimeout(hideResultTimer);
      };
    }
  }, [
    gameType,
    isGameStarted,
    isPlaylistFinished,
    currentSongIndex,
    maxSongIndex
  ]);
  
  
  



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
            {input !== "Your Liked Songs" && (
              <h3 className="subTitle">{input}</h3>
            )}
            

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
            
            <h2 className="text-white mb-4 text-center text-l">
            {Icon && <Icon style={{ marginRight: 8 }} />} {input} {Icon && <Icon style={{ marginLeft: 8 }} />}
            </h2>

            {/* Séparateur */}
            <hr className="border-t border-white w-64 mb-4" />



            {/* Équalizer + Contrôles */}
            <div className="flex flex-col items-center justify-center">
              {gameType === "auto" && (
                <div className="game-timer text-center mb-6">
                  <h2 className="text-white font-bold text-3xl mb-2">{subtitle}</h2>
                  <div className="text-white font-black text-7xl">{countdown}</div>
                  <div className="flex justify-center items-center mt-4">
                    <Equalizer isPlaying={isPlaying} />
                  </div>
                </div>

              )}





              {/* 
                Si on est en mode MANUAL, on affiche les boutons 
                (en mode AUTO, on peut les cacher ou les laisser : au choix).
              */}
              {gameType === "manual" && (

                <>
                  <div className="flex justify-center items-center mb-6 my-6">
                    <Equalizer isPlaying={isPlaying} />
                  </div>


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
                </>
              )}

              {/* Bouton "Show Track" (possible en mode manuel) */}
              {gameType === "manual" && (
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
              )}
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
            isKeepPlayingLoading={isKeepPlayingLoading}
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
