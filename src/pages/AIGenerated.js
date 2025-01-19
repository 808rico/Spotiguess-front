import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import { useMediaQuery } from 'react-responsive';
import { Divider, Input, message } from "antd";
import { PlayCircleOutlined, BulbOutlined, LoadingOutlined } from '@ant-design/icons';
import './AIGenerated.css'
import AISuggestion from "../components/suggestions/AiSuggestion";
import PopUpPay from "../components/popUp/PopUpPay";
import Cookies from "js-cookie";


const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const { Search } = Input;


//const urlServer = 'http://localhost:3001'; // Ou 'https://spotiguess-server-4a46bc45d48c.herokuapp.com'

const urlServer = process.env.REACT_APP_URL_SERVER;


function AIGenerated() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = Cookies.get("spotifyAuthToken");
  spotifyApi.setAccessToken(accessToken);
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 700 });
  const [searchValue, setSearchValue] = useState('');
  const [suggestionEnabled, setSuggestionEnabled] = useState(true);
  const [showPopupPay, setShowPopupPay] = useState(false);

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])


  const onSearch = (value = searchValue) => {
    setSuggestionEnabled(false);
    setLoading(true); // Active le loader
    axios.post(`${urlServer}/ai-generated`, {
      spotifyAccessToken: accessToken,
      preferences: value
    })
    .then(response => {
        // Gérer la réponse réussie ici
        console.log(response);
        navigate('/game', { state: { type: 'AI Generated', iconName: 'BulbOutlined', input: value, songUris: response.data.songUris } });
    })
    .catch(error => {
        // Gérer les réponses d'erreur ici
        if (error.response) {
            console.log('Status code:', error.response.status); // Affiche le code de statut de l'erreur
            if (error.response.status === 400) {
                setShowPopupPay(true); // Afficher la popup pour le code 400
            }
        } else {
            // Erreur produite dans la mise en place de la requête
            console.error('Error:', error.message);
            message.error('Error:' + error.message);
        }
        
        setSuggestionEnabled(true);
    })
    .finally(() => {
        setLoading(false); // Désactive le loader une fois la requête terminée
        setSuggestionEnabled(true);
    });
};
  const handleSuggestionSelect = (suggestion) => {
    const value = `${suggestion.title} ${suggestion.subtitle}`;
    setSearchValue(value);
    onSearch(value);
  };





  return (


    <MainLayout>
      <div style={{ background: '#000000', minHeight: 280, height: '100%' }}>
        <h1 className="text-white text-3xl font-bold mb-2" ><BulbOutlined style={{ fontSize: '25px', marginRight: '10px' }} />AI Generated</h1>
        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2 className="text-white text-xl mb-6 font-medium">Ask ChatGPT to generate your playlist.</h2>

        <div className="search-container" >
          <Search
            placeholder="Top 80s songs in the US..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            enterButton={
              loading ? (
                <LoadingOutlined />
              ) : isDesktopOrLaptop ? (
                <>
                  <PlayCircleOutlined /> <b>Generate songs</b>
                </>
              ) : (
                <PlayCircleOutlined />
              )
            }
            size="large"
            onSearch={onSearch}

          />
        </div>

        <AISuggestion onSuggestionSelect={handleSuggestionSelect} enabled={suggestionEnabled} />

        <PopUpPay isVisible={showPopupPay} onClose={() => setShowPopupPay(false)}/>
      </div>
    </MainLayout>
  );
};


export default AIGenerated