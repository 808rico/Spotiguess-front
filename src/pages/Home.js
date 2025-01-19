import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { message } from 'antd';
import MainLayout from '../components/layout/MainLayout';
import OptionCard from '../components/optionCard';
import { BulbOutlined, HeartOutlined, UnorderedListOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { FaHome } from 'react-icons/fa';





function Home() {
  const navigate = useNavigate();
  console.log("home");


  const location = useLocation();


  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    // Extraire les paramètres de requête de l'URL
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get('payment');

    if (paymentStatus === 'success') {
      // Afficher le message de succès

      message.success('Thank you for your purchase !');

      // Supprimer le session_id de l'URL
      queryParams.delete('payment');
      navigate({
        pathname: location.pathname,
        search: queryParams.toString()
      }, { replace: true });
    }

    if (paymentStatus === 'cancel') {
      // Afficher le message d'erreur
      message.error('Your payment has been cancelled.');

      // Supprimer le session_id de l'URL
      queryParams.delete('payment');
      navigate({
        pathname: location.pathname,
        search: queryParams.toString()
      }, { replace: true });
    }
    // Le comportement normal de la page continue ici
  }, [location, navigate]);

  return (


    <MainLayout>
      <div className="bg-black min-h-screen p-6">
        <div className="flex items-center gap-2 text-white mb-2">
          <FaHome size={28} className="text-white" /> {/* Icône Home en vert */}
          <h1 className="text-3xl font-bold">Home</h1>
        </div>
        <h2 className="text-white text-xl mb-6 font-medium">
          Select the type of music quiz you want to play.
        </h2>
        <div className="options-container" >
          <OptionCard
            title="AI Generated"
            Icon={BulbOutlined}
            description="Use the power of GPT to create meaningful quiz based on your current desire."
            onClick={() => handleNavigate('/ai-generated')}
            isPopular={true}
          />
          <OptionCard
            title="Your liked songs"
            Icon={HeartOutlined}
            description="All your liked songs in a music quiz."
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
            description="Choose an artist and guess their songs, from their top hit to the hidden title."
            onClick={() => handleNavigate('/artist')}
          />
        </div>
      </div>
    </MainLayout>
  );
};


export default Home