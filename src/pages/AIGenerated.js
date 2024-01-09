import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import { useMediaQuery } from 'react-responsive';
import { Divider, Input, message } from "antd";
import { PlayCircleOutlined, BulbOutlined,LoadingOutlined } from '@ant-design/icons';
import './AIGenerated.css'
import AISuggestion from "../components/suggestions/AiSuggestion";

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const { Search } = Input;


//const urlServer = 'http://localhost:3001'; // Ou 'https://spotiguess-server-4a46bc45d48c.herokuapp.com'

const urlServer = process.env.REACT_APP_URL_SERVER;


function AIGenerated() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access_token')
  spotifyApi.setAccessToken(accessToken);
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 700 });
  const [searchValue, setSearchValue] = useState('');
  const [suggestionEnabled, setSuggestionEnabled] = useState(true);

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])


  const onSearch = (value = searchValue) => {
    setSuggestionEnabled(false);
    setLoading(true); // Active le loader
    axios.post(`${urlServer}/ai-generated`, { 
      spotifyAccessToken: accessToken,
      preferences: value })
      .then(response => {
        console.log(response)
        navigate('/game', { state: { type: 'AI Generated',iconName: 'BulbOutlined', input: value, songUris: response.data.songUris } });
        // Traitez la réponse ici, par exemple en mettant à jour l'état avec les données reçues
      })
      .catch(error => {
        // Gérez l'erreur ici
        message.error('Error:' + error.message)
        console.error('Erreur lors de la requête:', error);
        setSuggestionEnabled(true);
      })
      .finally(() => {
        setLoading(false);
        setSuggestionEnabled(true);
         // Désactive le loader une fois la requête terminée
      });
  };

  const handleSuggestionSelect = (suggestion) => {
    const value = `${suggestion.title} ${suggestion.subtitle}`;
    setSearchValue(value);
    onSearch(value);
  };



  

  return (


    <MainLayout>
      <div style={{ background: '#000000', padding: 24, minHeight: 280, height: '100%' }}>
        <h1><BulbOutlined style={{ fontSize: '25px', marginRight: '10px' }} />AI Generated</h1>
        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2>Ask ChatGPT to generate the your playlist.</h2>
        
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

        <AISuggestion onSuggestionSelect={handleSuggestionSelect}  enabled={suggestionEnabled}/>
      </div>
    </MainLayout>
  );
};


export default AIGenerated