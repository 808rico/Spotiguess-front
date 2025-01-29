import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
//import { useMediaQuery } from 'react-responsive';
import { Divider, message, Input, AutoComplete } from "antd";
import { UnorderedListOutlined, RightOutlined, SwapOutlined } from '@ant-design/icons';
import './Playlist.css'
import axios from "axios";
import PlaylistSuggestion from "../components/suggestions/PlaylistSuggestion";
import Cookies from 'js-cookie';
import PopUpPay from "../components/popUp/PopUpPay";
import PopUpGameMode from "../components/popUp/PopUpGameMode";

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const urlServer = process.env.REACT_APP_URL_SERVER;


//const urlServer = 'http://localhost:3001'; // Ou 'https://spotiguess-server-4a46bc45d48c.herokuapp.com'


function Playlist() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = Cookies.get("spotifyAuthToken")
  spotifyApi.setAccessToken(accessToken);
  //const isDesktopOrLaptop = useMediaQuery({ minWidth: 700 });
  const [inputValue, setInputValue] = useState('');
  const [suggestionEnabled, setSuggestionEnabled] = useState(true);
  const [showPopupPay, setShowPopupPay] = useState(false);
  const [gameMode, setGameMode] = useState(null); // Default game mode
  const [showGameModePopup, setShowGameModePopup] = useState(false); // Popup state

  const handleInputChange = value => {
    setInputValue(value);
    handleSearch(value);
  };


  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken)

    // 🔹 GET Game Mode au chargement
    axios.get(`${urlServer}/settings/game-mode`, {
      params: { accessToken }
    })
      .then((response) => {
        if (response.data && response.data.gameType) {
          setGameMode(response.data.gameType); // "auto" ou "manual"
        }
      })
      .catch((error) => {
        console.error("Error fetching game mode:", error);
        message.error("Error fetching game mode");
      });

  }, [accessToken]);



  const [options, setOptions] = useState([]);

  const handleSuggestionSelect = (suggestion) => {
    const value = { playlistName: suggestion.name };
    setInputValue(value);
    onSelect(suggestion.id, value);

  };

  const handleSearch = value => {
    if (!value) {
      setOptions([]);
      return;
    }

    // Rechercher des artistes avec l'API Spotify
    spotifyApi.searchPlaylists(value, { limit: 4 })
      .then(data => {
        // Formater les résultats de la recherche pour AutoComplete
        console.log(data.body)
        const playlists = data.body.playlists.items;
        const formattedResults = playlists.map(playlist => ({
          value: playlist.id,
          playlistName: playlist.name,
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={playlist.images[0]?.url || 'default_image_url'} // Utilisez l'image de l'artiste ou une image par défaut
                alt={playlist.name}
                style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
              />
              {playlist.name}
              <RightOutlined style={{ marginLeft: 'auto' }} />
            </div>
          ),
        }));
        setOptions([])
        setOptions(formattedResults);
      })
      .catch(err => {
        console.error('Erreur lors de la recherche:', err);
      });
  };

  const onSelect = async (value, option) => {
    console.log('onSelect', value);
    setInputValue(option.playlistName);
    setLoading(true); // Start the loader
    setSuggestionEnabled(false); // Disable the suggestion button

    try {
      // Assurez-vous d'avoir l'access token disponible ici


      // Envoyez l'ID de la playlist et l'access token à votre backend
      const response = await axios.post(`${urlServer}/playlist`, {
        playlistId: value,
        accessToken: accessToken // Inclure l'access token ici
      });

      const selectedTracks = response.data; // Supposons que la réponse contient directement les URIs sélectionnés

      // Navigate to the game page
      navigate('/game', {
        state: {
          type: 'Playlist',
          iconName: 'UnorderedListOutlined',
          input: option.playlistName, // Name of the playlist
          songUris: selectedTracks // List of selected URIs
        }
      });

    } catch (error) {

      console.log('Status code:', error.response.status); // Affiche le code de statut de l'erreur
      if (error.response.status === 400) {
        setShowPopupPay(true); // Afficher la popup pour le code 400
      }
      else {
        message.error("Error:" + error.message);
      }

      setSuggestionEnabled(true)
    } finally {
      setLoading(false);
      setSuggestionEnabled(true) // Stop the loader
    }
  };




  return (


    <MainLayout>
      <div style={{ background: '#000000', minHeight: 280, height: '100%' }}>
        <h1 className="text-white text-3xl font-bold mb-2"><UnorderedListOutlined style={{ fontSize: '25px', marginRight: '10px' }} />Playlist</h1>
        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2 className="text-white text-xl mb-6 font-medium">Search for a playlist.</h2>



        <div className="search-container" style={{ width: '100%' }}>
          <AutoComplete
            //popupMatchSelectWidth={252}
            style={{ width: '100%' }}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            onChange={handleInputChange}
            value={inputValue}
          >
            <Input.Search loading={loading} size="large" placeholder="Search for a playlist" enterButton />
          </AutoComplete>
        </div>


        {/* Current Game Mode Display + Button to Open Popup */}
        <div className="mt-6 text-white flex bg-slate-800 rounded-md p-2 justify-between items-center">
          <p className="text-base font-light  ml-5 justify-center">
            <span >Current Game Mode:</span> <span className="font-semibold text-green-600">{gameMode === "auto" ? "Auto" : gameMode === "manual" ? "Manual" : "loading..."}
            </span>
          </p>
          <button
            onClick={() => setShowGameModePopup(true)}
            className=" bg-slate-900 px-4 py-1  hover:font-bold rounded-lg transition mr-5 "
          >
            <SwapOutlined style={{ fontSize: '20px', paddingRight: '5px' }} />
            Switch
          </button>
        </div>

        <PopUpGameMode
          isVisible={showGameModePopup}
          onClose={() => setShowGameModePopup(false)}
          gameMode={gameMode}
          setGameMode={setGameMode}
          accessToken={accessToken}
        />

        

        <PlaylistSuggestion enabled={suggestionEnabled} onSuggestionSelect={handleSuggestionSelect} />

        <PopUpPay isVisible={showPopupPay} onClose={() => setShowPopupPay(false)} />

      </div>
    </MainLayout>
  );
};


export default Playlist