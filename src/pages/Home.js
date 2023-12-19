import React from "react";
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import OptionCard from '../components/optionCard';
import { BulbOutlined, HeartOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';






function Home() {
  const navigate = useNavigate();
  console.log("home");

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