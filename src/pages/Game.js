import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import PopUpResult from '../components/PopUpResult'
import PopUpFinish from '../components/PopUpFinish'
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
    const navigate = useNavigate();
    const { type, input, songUris } = location.state;
    console.log("game");
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'))
    const [isFirstPlayClicked, setIsFirstPlayClicked] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [isPlaylistFinished, setIsPlaylistFinished] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [showPopupResult, setShowPopupResult] = useState(false);
    const [showPopupFinish, setShowPopupFinish] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [deviceId, setDeviceId] = useState(undefined);
    

    const togglePopupResult = () => {
        setShowPopupResult(!showPopupResult);
    };

    const togglePopupFinish = () => {
        setShowPopupFinish(!showPopupFinish);
    };

    const handleNextTrack = () => {
        const nextIndex = currentSongIndex + 1;

        if (nextIndex < songUris.length) {
            spotifyApi.play({ uris: [songUris[nextIndex]] });

            spotifyApi.getTrack(songUris[nextIndex].substring(songUris[nextIndex].lastIndexOf(":") + 1))
            .then(function (data) {
                setCurrentTrack(data.body);
                
            }, function (err) {
                console.error(err);
            });


            setCurrentSongIndex(nextIndex);
            
        } else {
            
            setIsPlaylistFinished(true);
            togglePopupFinish(); // Toutes les chansons ont été jouées
        }
    };



    const handlePlayClick = () => {
        setIsFirstPlayClicked(true);
        spotifyApi.getTrack(songUris[0].substring(songUris[0].lastIndexOf(":") + 1))
            .then(function (data) {
                setCurrentTrack(data.body);
                console.log("Track information", data.body);
            }, function (err) {
                console.error(err);
            });

        setCurrentSongIndex(0);

    };

    const onGoToHome = () => {
        navigate('/');
    };

    // Fonction pour rejouer le blindtest
    const onReplay = () => {
        // Vous pouvez remettre à zéro l'état du jeu ou effectuer toute autre logique nécessaire pour recommencer
        setShowPopupFinish(false);
        // Ajoutez ici la logique pour redémarrer le jeu
    };


    useEffect(() => {
        if (accessToken && songUris[currentSongIndex]) {
            spotifyApi.setAccessToken(accessToken);
    
            // Demander à l'API de Spotify de jouer la chanson
            spotifyApi.play({
                uris: [songUris[currentSongIndex]],
                position_ms: 0  // Commencer la lecture au début de la chanson
            }).then(() => {
                console.log("Playback started");
            }).catch(err => {
                console.error("Error in starting playback", err);
            });
        }
    }, [currentSongIndex, accessToken, songUris]);

    useEffect(() => {
        if (deviceId && player) {
            spotifyApi.transferMyPlayback([deviceId], { play: false })
                .then(() => console.log("Playback transferred"))
                .catch(err => console.error("Error in transferring playback", err));

        }
    },
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
                    name: 'Spotiguess',
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
                        onClick={() => { handleNextTrack() }}>
                        Next
                    </Button>

                    <Button
                        type="default"
                        onClick={togglePopupResult}>
                        Show Current Track
                    </Button>

                    {currentTrack && (
                        <PopUpResult
                            isVisible={showPopupResult}
                            onClose={togglePopupResult}
                            currentTrack={currentTrack}
                            onNextTrack={handleNextTrack}
                        />
                    )}

                    {isPlaylistFinished && <PopUpFinish
                        isVisible={showPopupFinish}
                        onClose={() => setShowPopupFinish(false)}
                        onReplay={onReplay}
                        onGoToHome={onGoToHome}
                    />}
                </div>

            </div>
        </MainLayout>
    );
};


export default Game