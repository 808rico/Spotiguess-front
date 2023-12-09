import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useMediaQuery } from 'react-responsive';
import MainLayout from '../components/layout/MainLayout';
import OptionCard from '../components/optionCard';
import { BulbOutlined, HeartOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import UseAuth from "../UseAuth";
import SpotifyWebApi from "spotify-web-api-node"



const { Content } = Layout;

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
})




function Home({ code }) {
  const navigate = useNavigate();
  const accessToken = UseAuth(code)
  spotifyApi.setAccessToken(accessToken)

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])


  const isDesktopOrLaptop = useMediaQuery({ minWidth: 500 });
  console.log(isDesktopOrLaptop)

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (


    <MainLayout>
      <div style={{ background: '#000000', padding: 24, minHeight: 280, height: '100%' }}>
        <h1>Home</h1>
        <h2>Select the type of music blind test you want to play.</h2>
        <div className="options-container" >
          <OptionCard 
            title="AI Generated" 
            Icon={BulbOutlined} 
            description="Use the power of GPT to create meaningful blind test based on your current desire."
            onClick={() => handleNavigate('/ai-generated')}
            isPopular={true}
          />
          <OptionCard 
            title="Your liked songs" 
            Icon={HeartOutlined} 
            description="All your liked songs in a music blind test. It's not the moment to lose to your friend."
            onClick={() => handleNavigate('/liked-songs')}
          />
          <OptionCard 
            title="Playlist" 
            Icon={UnorderedListOutlined} 
            description="Choose from the millions of playlists available, it can be yours or one created by someone else."
            onClick={() => handleNavigate('/playlist')}
            isPopular={true}
          />
          <OptionCard 
            title="Artist" 
            Icon={UserOutlined} 
            description="Choose an artist and guess his songs, from his top hit to the hidden title."
            onClick={() => handleNavigate('/artist')}
          />
        </div>
      </div>
    </MainLayout>
  );
};


export default Home