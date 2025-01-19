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

import { FaPlay, FaPause, FaForward, FaBackward, FaEye } from 'react-icons/fa';

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const urlServer = process.env.REACT_APP_URL_SERVER;

function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, input, songUris } = location.state;

  const accessToken = Cookies.get("spotifyAuthToken");

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [maxSongIndex, setMaxSongIndex] = useState(10);
  const [isPlaylistFinished, setIsPlaylistFinished] = useState(false);
  const [isReplayButtonVisible, setIsReplayButtonVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [showPopupResult, setShowPopupResult] = useState(false);
  const [showPopupFinish, setShowPopupFinish] = useState(false);
  const [showPopupPay, setShowPopupPay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  // eslint-disable-next-line
  const [deviceId, setDeviceId] = useState('');
  // eslint-disable-next-line
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (accessToken && songUris[currentSongIndex]) {
      spotifyApi.setAccessToken(accessToken);

      spotifyApi
        .getTrack(songUris[currentSongIndex].split(":").pop())
        .then(data => {
          setCurrentTrack(data.body);
        })
        .catch(err => {
          console.error("Error retrieving track information: ", err.message);
        });
    }
  }, [currentSongIndex, accessToken, songUris]);

  const handlePreviousTrack = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(prevIndex => prevIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    const nextIndex = currentSongIndex + 1;
    if (nextIndex < maxSongIndex) {
      setCurrentSongIndex(nextIndex);
      setIsPlaying(true);
    } else {
      setIsReplayButtonVisible((songUris.length - maxSongIndex) >= 10);
      setIsPlaylistFinished(true);
      setShowPopupFinish(true);
    }
  };

  const handlePlayerStateChange = (state) => {
    if (state.status === 'READY') {
      setDeviceId(state.deviceId);
      setIsPlayerReady(true);
    }
  };

  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
  };

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
      .catch(error => {
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

        {/* Lecteur Spotify */}
        <Player
          accessToken={accessToken}
          callback={handlePlayerStateChange}
          trackUri={songUris[currentSongIndex]}
          play={isPlaying}
        />

        {/* Titre du jeu */}
        <h1 className="text-white font-bold mb-4 text-center text-2xl">
          {type}
        </h1>

        {/* Séparateur */}
        <hr className="border-t border-white w-64 mb-4" />

        {/* Sous-titre */}
        <h3 className="text-white font-medium mb-4 text-center text-lg">
          {input}
        </h3>

        {/* Wrapper principal (Equalizer + Contrôles) */}
        <div className="flex flex-col items-center justify-center">
          {/* Equalizer */}
          <div className="flex justify-center items-center mb-6 my-6">
          <Equalizer isPlaying={isPlaying} />

          </div>

          {/* Contrôles: Previous / Play-Pause / Next */}
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

        {/* PopUpResult */}
        {currentTrack && (
          <PopUpResult
            isVisible={showPopupResult}
            onClose={() => setShowPopupResult(false)}
            currentTrack={currentTrack}
            onNextTrack={handleNextTrack}
          />
        )}

        {/* PopUpFinish (si la playlist est finie) */}
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
