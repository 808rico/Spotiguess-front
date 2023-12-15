import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import PopUpResult from '../components/PopUpResult'
import { useMediaQuery } from 'react-responsive';
import { Divider, Input } from "antd";
import { useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { PlayCircleOutlined, ForwardOutlined } from '@ant-design/icons';
//import { PlayCircleOutlined, BulbOutlined,LoadingOutlined } from '@ant-design/icons';
//import './AIGenerated.css'

const spotifyApi = new SpotifyWebApi({
    clientId: '80256b057e324c5f952f3577ff843c29',
});



const urlServer = 'http://localhost:3001'; // Ou 'https://blindtest-spotify-v1.herokuapp.com'




function Game() {
    const location = useLocation();
    const { type, input, songUris } = location.state;
    console.log("game");
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'))
    const [isFirstPlayClicked, setIsFirstPlayClicked] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [deviceId, setDeviceId] = useState(undefined);
    console.log(deviceId);

    
    

    const handleNextTrack = () => {
        player && player.nextTrack();
        setCurrentTrack(SpotifyWebApi.getMyCurrentPlayingTrack());
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handlePlayClick = () => {
        setIsFirstPlayClicked(true);
        spotifyApi.play({ uris: songUris });
        
    };

    useEffect(() => {
        if (deviceId && player){
            spotifyApi.transferMyPlayback([deviceId], { play: false });
            console.log("transfer");
        }
    } ,
         [deviceId]);

         useEffect(() => {
            if (accessToken) {
                spotifyApi.setAccessToken(accessToken);
        
                const script = document.createElement('script');
                script.src = 'https://sdk.scdn.co/spotify-player.js';
                script.async = true;
                document.body.appendChild(script);
        
                let player; // Déclaration locale du player
        
                window.onSpotifyWebPlaybackSDKReady = () => {
                    player = new window.Spotify.Player({
                        name: 'Your Web Player',
                        getOAuthToken: cb => { cb(accessToken); }
                    });
        
                    setPlayer(player);
        
                    player.addListener('ready', ({ device_id }) => {
                        setDeviceId(device_id);
                        console.log('Ready with Device ID', device_id);
                    });
        
                    player.connect();
                };
        
                // Fonction de nettoyage
                return () => {
                    if (player) {
                        player.disconnect();
                        console.log('Player disconnected');
                    }
                };
            }
        }, [accessToken]);
        



    



    

    

    return (


        <MainLayout>
            <div style={{ background: '#000000', padding: 24, minHeight: 280, height: '100%' }}>
                <h1>Game</h1>
                <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
                <h2>{input}</h2>

                <div className="main-wrapper">
                    {!isFirstPlayClicked && (
                        <Button
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            onClick={handlePlayClick}>
                            Play
                        </Button>
                    )}

                    <Button
                        type="default"
                        icon={<ForwardOutlined />}
                        onClick={() => { player && player.nextTrack() }}>
                        Next
                    </Button>

                    <Button
                        type="default"
                        onClick={togglePopup}>
                        Show Current Track
                    </Button>

                    {currentTrack && (
                        <PopUpResult
                            isVisible={showPopup}
                            onClose={togglePopup}
                            currentTrack={currentTrack}
                            onNextTrack={handleNextTrack}
                        />
                    )}
                </div>

            </div>
        </MainLayout>
    );
};


export default Game