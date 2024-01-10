import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
//import { useMediaQuery } from 'react-responsive';
import { Divider, message, Input, AutoComplete } from "antd";
import {  RightOutlined, UserOutlined } from '@ant-design/icons';
import './Artist.css'
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});

const urlServer = process.env.REACT_APP_URL_SERVER;
//const urlServer = 'http://localhost:3001'; // Ou 'https://spotiguess-server-4a46bc45d48c.herokuapp.com'


function Artist() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access_token')
  spotifyApi.setAccessToken(accessToken);
  //const isDesktopOrLaptop = useMediaQuery({ minWidth: 700 });
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = value => {
    setInputValue(value);
    handleSearch(value);
  };

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])


  

  


  const [options, setOptions] = useState([]);


  const handleSearch = value => {
    if (!value) {
      setOptions([]);
      return;
    }



    // Rechercher des artistes avec l'API Spotify
    spotifyApi.searchArtists(value, { limit: 4 })
      .then(data => {
        // Formater les résultats de la recherche pour AutoComplete
        const artists = data.body.artists.items;
        const formattedResults = artists.map(artist => ({
          value: artist.id,
          artistName: artist.name,
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={artist.images[2]?.url || 'default_image_url'} // Utilisez l'image de l'artiste ou une image par défaut
                alt={artist.name}
                style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
              />
              {artist.name}
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
    setInputValue(option.artistName);
    setLoading(true); // Start the loader

    try {
      // Get artist's albums
      const trackUris = await axios.post(`${urlServer}/artist`, {
        artistId: value,
        accessToken: accessToken // Inclure l'access token ici
      });

      console.log(trackUris.data)

      // Navigate to the game page
      navigate('/game', {
        state: {
          type: 'Artist',
          iconName: 'BulbOutlined',
          input: option.artistName, // Name of the artist
          songUris: trackUris.data // List of selected URIs
        }
      });
    } catch (error) {
      message.error(error.message); // Display error message
      console.error(error);
    } finally {
      setLoading(false); // Stop the loader
    }
  };




  return (


    <MainLayout>
      <div style={{ background: '#000000',  minHeight: 280, height: '100%' }}>
        <h1><UserOutlined style={{ fontSize: '25px', marginRight: '10px' }} />Artist</h1>
        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2>How it works?</h2>
        <p>
          👉🏻<b>Search an artist.</b> <br />Use the search bar below to find an artist on Spotify. </p>
        <p>
          👉🏻 <b>Hit Play.</b> <br />
          15 songs from his discography will be randomly selected.
        </p>
        <p>
          👉🏻 <b>Play.</b><br />
          Alone or with your friends and family, try to guess the song and yell when you got it.
        </p>



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
            <Input.Search loading={loading} size="large" placeholder="Search for an artist" enterButton />
          </AutoComplete>
        </div>



      </div>
    </MainLayout>
  );
};


export default Artist