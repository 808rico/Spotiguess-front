import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import { Divider, message, Input, AutoComplete, Button } from "antd";
import {
  UserOutlined,
  RightOutlined,
  PlayCircleOutlined,
  SwapOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import './Artist.css'
import axios from "axios";
import ArtistSuggestion from "../components/suggestions/ArtistSuggestion";
import Cookies from 'js-cookie';
import PopUpPay from "../components/popUp/PopUpPay";
import PopUpGameMode from "../components/popUp/PopUpGameMode";

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const urlServer = process.env.REACT_APP_URL_SERVER;

function Artist() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = Cookies.get("spotifyAuthToken");

  // État pour le Game Mode (auto ou manual) et la popup de changement
  const [gameMode, setGameMode] = useState(null);
  const [showGameModePopup, setShowGameModePopup] = useState(false);

  // État pour l'artiste sélectionné
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [selectedArtistName, setSelectedArtistName] = useState('');
  const [selectedArtistImage, setSelectedArtistImage] = useState(null);

  // État pour l'AutoComplete
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  // État pour la popup Pay
  const [showPopupPay, setShowPopupPay] = useState(false);

  // Pour activer/désactiver le composant ArtistSuggestion
  const [suggestionEnabled, setSuggestionEnabled] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    // Récupère le game mode au chargement
    axios
      .get(`${urlServer}/settings/game-mode`, {
        params: { accessToken },
      })
      .then((response) => {
        if (response.data?.gameType) {
          setGameMode(response.data.gameType); // "auto" ou "manual"
        }
      })
      .catch((error) => {
        console.error("Error fetching game mode:", error);
        message.error("Error fetching game mode");
      });
  }, [accessToken]);

  // Recherche des artistes via l'API Spotify
  const handleSearch = (value) => {
    if (!value) {
      setOptions([]);
      return;
    }

    spotifyApi
      .searchArtists(value, { limit: 4 })
      .then((data) => {
        const artists = data.body.artists.items || [];
        const formattedResults = artists.map((artist) => ({
          value: artist.id, // stocke l'ID de l'artiste
          artistName: artist.name,
          artistImageUrl: artist.images[2]?.url || 'default_image_url',
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={artist.images[2]?.url || 'default_image_url'}
                alt={artist.name}
                style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 10 }}
              />
              {artist.name}
              <RightOutlined style={{ marginLeft: 'auto' }} />
            </div>
          ),
        }));
        setOptions(formattedResults);
      })
      .catch((err) => {
        console.error('Erreur lors de la recherche:', err);
      });
  };

  // Met à jour la valeur de l'input et lance la recherche
  const handleInputChange = (value) => {
    setInputValue(value);
    handleSearch(value);
  };

  // Sélection dans l'AutoComplete (mais ne lance pas directement la partie)
  const onSelect = (value, option) => {
    setSelectedArtistId(value);
    setSelectedArtistName(option.artistName);
    setSelectedArtistImage(option.artistImageUrl);
    setInputValue(option.artistName);
  };

  // Fonction pour effacer la sélection
  const handleClearSelection = () => {
    setSelectedArtistId(null);
    setSelectedArtistName('');
    setSelectedArtistImage(null);
    setInputValue('');
  };

  // Lance le jeu (appel au backend)
  const handleStartGame = async () => {
    if (!selectedArtistId) {
      message.warning('Please select an artist first!');
      return;
    }
    setLoading(true);
    setSuggestionEnabled(false);

    try {
      const response = await axios.post(`${urlServer}/artist`, {
        artistId: selectedArtistId,
        accessToken,
      });

      const trackUris = response.data; // Liste de URIs renvoyée par le serveur

      // Navigation vers la page de jeu
      navigate('/game', {
        state: {
          type: 'Artist',
          iconName: 'UserOutlined',
          input: selectedArtistName,
          songUris: trackUris,
        },
      });
    } catch (error) {
      console.log('Status code:', error?.response?.status);
      if (error?.response?.status === 400) {
        setShowPopupPay(true);
      } else {
        message.error("Error: " + error.message);
      }
    } finally {
      setLoading(false);
      setSuggestionEnabled(true);
    }
  };

  // Quand on choisit un artiste via ArtistSuggestion
  const handleSuggestionSelect = (suggestion) => {
    // suggestion = { id, name, imageUrl, ... }
    setSelectedArtistId(suggestion.id);
    setSelectedArtistName(suggestion.name);
    setSelectedArtistImage(suggestion.imageUrl || null);
    setInputValue(suggestion.name);
  };

  return (
    <MainLayout>
      <div style={{ background: '#000000', minHeight: 280, height: '100%' }}>
        <h1 className="text-white text-3xl font-bold mb-2">
          <UserOutlined style={{ fontSize: '25px', marginRight: '10px' }} />
          Artist
        </h1>
        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2 className="text-white text-xl mb-6 font-medium">Search for an artist.</h2>

        <div className="search-container" style={{ width: '100%' }}>
          <AutoComplete
            style={{ width: '100%' }}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            onChange={handleInputChange}
            value={inputValue}
          >
            <Input
              size="large"
              placeholder="Search for an artist"
              style={{ borderRadius: 10 }}
              prefix={
                selectedArtistId && selectedArtistImage ? (
                  <img
                    src={selectedArtistImage}
                    alt="artist"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      marginRight: 8
                    }}
                  />
                ) : null
              }
              suffix={
                selectedArtistId ? (
                  <CloseCircleOutlined
                    onClick={handleClearSelection}
                    style={{
                      cursor: 'pointer',
                      color: 'gray',
                      marginRight: 10,
                      fontSize: 18
                    }}
                  />
                ) : null
              }
            />
          </AutoComplete>
        </div>

        {/* Affichage du Game Mode + bouton Switch */}
        <div className="mt-6 text-white flex bg-slate-800 rounded-md p-2 justify-between items-center">
          <p className="text-base font-light ml-5 mr-2">
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
          onClick={handleStartGame}
          size="large"
          loading={loading}
          disabled={loading || !selectedArtistId}
          style={{ marginTop: '20px' }}
        >
          Start
        </Button>

        {/* PopUp pour changer le Game Mode */}
        <PopUpGameMode
          isVisible={showGameModePopup}
          onClose={() => setShowGameModePopup(false)}
          gameMode={gameMode}
          setGameMode={setGameMode}
          accessToken={accessToken}
        />

        {/* Suggestions d'artistes (si encore utilisé) */}
        <ArtistSuggestion
          enabled={suggestionEnabled}
          onSuggestionSelect={handleSuggestionSelect}
        />

        {/* Popup Pay si l'utilisateur atteint la limite */}
        <PopUpPay
          isVisible={showPopupPay}
          onClose={() => setShowPopupPay(false)}
        />
      </div>
    </MainLayout>
  );
}

export default Artist;
