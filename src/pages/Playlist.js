import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
//import { useMediaQuery } from 'react-responsive';
import { Divider, message, Input, AutoComplete } from "antd";
import { UnorderedListOutlined,  RightOutlined } from '@ant-design/icons';
import './Playlist.css'

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
});




//const urlServer = 'http://localhost:3001'; // Ou 'https://spotiguess-server-4a46bc45d48c.herokuapp.com'


function Playlist() {
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
    try {
      // Get playlist
      const playlistData = await spotifyApi.getPlaylist(value);
      console.log(playlistData)

      const { body: { total } } = await spotifyApi.getPlaylistTracks(value, { limit: 1 });
    let allTracks = [];
    for (let offset = 0; offset < total; offset += 50) {
      const { body: { items } } = await spotifyApi.getPlaylistTracks(value, { limit: 50, offset });
      allTracks = [...allTracks, ...items];
    }
      
    // Mélanger les pistes et sélectionner les 20 premières URIs
    const shuffledTracks = allTracks.sort(() => 0.5 - Math.random());
    const selectedTracks = shuffledTracks.slice(0, 20).map(track => track.track.uri);
      // Navigate to the game page
      navigate('/game', {
        state: {
          type: 'Playlist',
          iconName: 'BulbOutlined',
          input: option.playlistName, // Name of the artist
          songUris: selectedTracks // List of selected URIs
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
      <div style={{ background: '#000000', padding: 24, minHeight: 280, height: '100%' }}>
        <h1><UnorderedListOutlined style={{ fontSize: '25px', marginRight: '10px' }} />Playlist</h1>
        <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
        <h2>How it works?</h2>
        <p>
          👉🏻<b>Search a playlist:</b> <br />Use the search bar below to find a playlist on Spotify. It can be a playlist that you  or someone else created. </p>
        <p>
          👉🏻 <b>Hit Play.</b> <br />
          15 songs from the playlist will be randomly selected.
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
            <Input.Search loading={loading} size="large" placeholder="Search for a playlist" enterButton />
          </AutoComplete>
        </div>



      </div>
    </MainLayout>
  );
};


export default Playlist