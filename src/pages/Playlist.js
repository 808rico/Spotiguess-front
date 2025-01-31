import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import { Divider, message, Input, AutoComplete, Button } from "antd";
import {
  UnorderedListOutlined,
  RightOutlined,
  SwapOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import axios from "axios";
import Cookies from 'js-cookie';
import PopUpPay from "../components/popUp/PopUpPay";
import PopUpGameMode from "../components/popUp/PopUpGameMode";
import PlaylistSuggestion from "../components/suggestions/PlaylistSuggestion";
import './Playlist.css';

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const urlServer = process.env.REACT_APP_URL_SERVER;

function Playlist() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = Cookies.get("spotifyAuthToken");
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [showPopupPay, setShowPopupPay] = useState(false);

  const [gameMode, setGameMode] = useState(null);
  const [showGameModePopup, setShowGameModePopup] = useState(false);

  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState('');
  const [selectedPlaylistImage, setSelectedPlaylistImage] = useState(null);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    // Récupère le game mode au chargement
    axios.get(`${urlServer}/settings/game-mode`, {
      params: { accessToken }
    })
      .then(response => {
        if (response.data?.gameType) {
          setGameMode(response.data.gameType); // "auto" ou "manual"
        }
      })
      .catch(error => {
        console.error("Error fetching game mode:", error);
        message.error("Error fetching game mode");
      });
  }, [accessToken]);

  // Recherche dans l'API Spotify
  const handleSearch = (value) => {
    if (!value) {
      setOptions([]);
      return;
    }
    spotifyApi.searchPlaylists(value, { limit: 4 })
      .then(data => {
        const playlists = data.body.playlists.items;
        const formattedResults = playlists.map(playlist => ({
          value: playlist.name,  // Utilisé comme texte dans l'AutoComplete
          playlistId: playlist.id,
          playlistImage: playlist.images[0]?.url || 'default_image_url',
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={playlist.images[0]?.url || 'default_image_url'}
                alt={playlist.name}
                style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 10 }}
              />
              {playlist.name}
              <RightOutlined style={{ marginLeft: 'auto' }} />
            </div>
          )
        }));
        setOptions(formattedResults);
      })
      .catch(err => {
        console.error('Erreur lors de la recherche:', err);
      });
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    handleSearch(value);
  };

  // Sélection dans l'AutoComplete
  const onSelect = (value, option) => {
    setSelectedPlaylistId(option.playlistId);
    setSelectedPlaylistName(value);
    setSelectedPlaylistImage(option.playlistImage);
    setInputValue(value);
  };

  // Clique sur la croix => on efface tout
  const handleClearSelection = () => {
    setSelectedPlaylistId(null);
    setSelectedPlaylistName('');
    setSelectedPlaylistImage(null);
    setInputValue('');
  };

  // Lance le jeu
  const handleStartGame = async () => {
    if (!selectedPlaylistId) {
      message.warning('Please select a playlist first!');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${urlServer}/playlist`, {
        playlistId: selectedPlaylistId,
        accessToken
      });
      const selectedTracks = response.data;
      navigate('/game', {
        state: {
          type: 'Playlist',
          iconName: 'UnorderedListOutlined',
          input: selectedPlaylistName,
          songUris: selectedTracks,
        },
      });
    } catch (error) {
      if (error?.response?.status === 400) {
        setShowPopupPay(true);
      } else {
        message.error("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ background: '#000', minHeight: 280, height: '100%' }}>
        <h1 className="text-white text-3xl font-bold mb-2">
          <UnorderedListOutlined style={{ fontSize: '25px', marginRight: '10px' }} />
          Playlist
        </h1>

        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2 className="text-white text-xl mb-6 font-medium">Search for a playlist.</h2>

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
              placeholder="Search for a playlist"
              style={{ borderRadius: 10 }}
              // image (prefix) si une playlist est sélectionnée
              prefix={
                selectedPlaylistId && selectedPlaylistImage ? (
                  <img
                    src={selectedPlaylistImage}
                    alt="playlist"
                    style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
                  />
                ) : null
              }
              // petite croix pour annuler la sélection
              suffix={
                selectedPlaylistId ? (
                  <CloseCircleOutlined
                    onClick={handleClearSelection}
                    style={{ cursor: 'pointer', color: 'gray', marginRight: 10, fontSize: 18 }}
                  />
                ) : null
              }
            />
          </AutoComplete>
        </div>

        {/* Current Game Mode Display + Switch Button */}
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
          disabled={loading || !selectedPlaylistId}

        >
          Start
        </Button>

        <PopUpGameMode
          isVisible={showGameModePopup}
          onClose={() => setShowGameModePopup(false)}
          gameMode={gameMode}
          setGameMode={setGameMode}
          accessToken={accessToken}
        />

        <PlaylistSuggestion
          enabled={true}
          onSuggestionSelect={(playlist) => {
            setSelectedPlaylistId(playlist.id);
            setSelectedPlaylistName(playlist.name);
            const imageUrl = playlist.images?.[0]?.url || "default_image_url";
            setSelectedPlaylistImage(imageUrl);

            setInputValue(playlist.name);
          }}
        />

        <PopUpPay
          isVisible={showPopupPay}
          onClose={() => setShowPopupPay(false)}
        />
      </div>
    </MainLayout>
  );
}

export default Playlist;
