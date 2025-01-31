import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import { Divider, Input, message, Button } from "antd";
import {
  PlayCircleOutlined,
  BulbOutlined,
  LoadingOutlined,
  SwapOutlined
} from '@ant-design/icons';
import './AIGenerated.css';
import AISuggestion from "../components/suggestions/AiSuggestion";
import PopUpPay from "../components/popUp/PopUpPay";
import PopUpGameMode from "../components/popUp/PopUpGameMode";
import Cookies from "js-cookie";

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const urlServer = process.env.REACT_APP_URL_SERVER;

function AIGenerated() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const accessToken = Cookies.get("spotifyAuthToken");
  spotifyApi.setAccessToken(accessToken);

  // Texte tapé par l'utilisateur (ou inséré via suggestion)
  const [searchValue, setSearchValue] = useState('');

  // Popup Pay si l'utilisateur dépasse la limite
  const [showPopupPay, setShowPopupPay] = useState(false);

  // Pour activer/désactiver le composant AISuggestion
  const [suggestionEnabled, setSuggestionEnabled] = useState(true);

  // Game Mode (auto ou manual) et popup de changement
  const [gameMode, setGameMode] = useState(null);
  const [showGameModePopup, setShowGameModePopup] = useState(false);

  // Récupération du token Spotify
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    // Récupère le game mode au chargement, comme dans Artist/Playlist
    axios
      .get(`${urlServer}/settings/game-mode`, {
        params: { accessToken },
      })
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

  // Lance la génération AI et démarre la partie
  const handleStartGame = () => {
    if (!searchValue) {
      message.warning("Please enter something first!");
      return;
    }

    setSuggestionEnabled(false);
    setLoading(true);

    axios
      .post(`${urlServer}/ai-generated`, {
        spotifyAccessToken: accessToken,
        preferences: searchValue,
      })
      .then((response) => {
        // Navigate vers la page de jeu avec les URIs renvoyées
        navigate('/game', {
          state: {
            type: 'AI Generated',
            iconName: 'BulbOutlined',
            input: searchValue,
            songUris: response.data.songUris,
          },
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log('Status code:', error.response.status);
          if (error.response.status === 400) {
            setShowPopupPay(true); // Afficher la popup pour le code 400
          }
        } else {
          console.error('Error:', error.message);
          message.error('Error: ' + error.message);
        }
      })
      .finally(() => {
        setLoading(false);
        setSuggestionEnabled(true);
      });
  };

  // Quand on choisit une suggestion AI
  const handleSuggestionSelect = (suggestion) => {
    // suggestion = { title, subtitle, ... }
    const value = `${suggestion.title} ${suggestion.subtitle}`;
    setSearchValue(value);
  };

  return (
    <MainLayout>
      <div style={{ background: '#000000', minHeight: 280, height: '100%' }}>
        <h1 className="text-white text-3xl font-bold mb-2">
          <BulbOutlined style={{ fontSize: '25px', marginRight: '10px' }} />
          AI Generated
        </h1>
        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2 className="text-white text-xl mb-6 font-medium">
          Ask ChatGPT to generate your playlist.
        </h2>

        {/* Champ de texte pour les préférences AI */}
        <div className="search-container">
          <Input
            size="large"
            placeholder="Top 80s songs in the US..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ borderRadius: 10 }}
          />
        </div>

        {/* Affichage du Game Mode + bouton Switch */}
        <div className="mt-6 text-white flex bg-slate-800 rounded-md p-2 justify-between items-center">
          <p className="text-base font-light ml-5 mr-2">
            <span>Current Game Mode: </span>
            <span className="font-semibold text-green-600">
              {gameMode === "auto"
                ? "Auto"
                : gameMode === "manual"
                ? "Manual"
                : "loading..."}
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

        {/* Bouton "Start" pour lancer le jeu */}
        <Button
          className="play-button-liked"
          type="primary"
          icon={loading ? <LoadingOutlined /> : <PlayCircleOutlined />}
          onClick={handleStartGame}
          size="large"
          loading={loading}
          disabled={loading || !searchValue}
          style={{ marginTop: '20px' }}
        >
          Start
        </Button>

        {/* Suggestions AI */}
        <AISuggestion
          onSuggestionSelect={handleSuggestionSelect}
          enabled={suggestionEnabled}
        />

        {/* Popup changement de Game Mode */}
        <PopUpGameMode
          isVisible={showGameModePopup}
          onClose={() => setShowGameModePopup(false)}
          gameMode={gameMode}
          setGameMode={setGameMode}
          accessToken={accessToken}
        />

        {/* Popup Pay si l'utilisateur dépasse la limite */}
        <PopUpPay
          isVisible={showPopupPay}
          onClose={() => setShowPopupPay(false)}
        />
      </div>
    </MainLayout>
  );
}

export default AIGenerated;
