import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import PopUpResult from '../components/popUp/PopUpResult';
import PopUpFinish from '../components/popUp/PopUpFinish';
import Equalizer from "../components/Equalizer";
import { Divider, message, Button } from "antd";
import { BackwardOutlined, PlayCircleOutlined, PauseCircleOutlined, ForwardOutlined, EyeOutlined } from '@ant-design/icons';
import './Game.css';
import Player from "../Player";
import Cookies from 'js-cookie';
import axios from 'axios';
import PopUpPay from "../components/popUp/PopUpPay";

const spotifyApi = new SpotifyWebApi({
    clientId: '80256b057e324c5f952f3577ff843c29',
});

const urlServer = process.env.REACT_APP_URL_SERVER;

function Game() {
    const location = useLocation();
    const navigate = useNavigate();
    const { type, iconName, input, songUris } = location.state;
    console.log("game");

    const accessToken = Cookies.get("spotifyAuthToken");
    const [isFirstPlayClicked, setIsFirstPlayClicked] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [maxSongIndex, setMaxSongIndex] = useState(10);
    const [isPlaylistFinished, setIsPlaylistFinished] = useState(false);
    const [isReplayButtonVisible, setIsReplayButtonVisible] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [showPopupResult, setShowPopupResult] = useState(false);
    const [showPopupFinish, setShowPopupFinish] = useState(false);
    const [showPopupPay, setShowPopupPay] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [deviceId, setDeviceId] = useState('');
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    useEffect(() => {
        console.log("useEffect");
        console.log(currentSongIndex);

        if (accessToken && songUris[currentSongIndex]) {
            spotifyApi.setAccessToken(accessToken);

            // Récupérer les infos du track actuel
            spotifyApi.getTrack(songUris[currentSongIndex].split(":").pop())
                .then(data => {
                    setCurrentTrack(data.body);
                })
                .catch(err => {
                    message.error("Error retrieving track information: " + err.message);
                    console.error(err);
                });
        }
    }, [currentSongIndex, accessToken, songUris]);

    

    const handlePreviousTrack = () => {
        if (currentSongIndex > 0) {
            setCurrentSongIndex(prevIndex => prevIndex - 1);
            setIsPlaying(true); // 🔥 Relance la musique après "Previous song"
        }
    };

    const handleNextTrack = () => {
        console.log("currentSongIndex", currentSongIndex);
        console.log("maxSongIndex", maxSongIndex);
        const nextIndex = currentSongIndex + 1;
    
        if (nextIndex < maxSongIndex) {
            setCurrentSongIndex(nextIndex);
            setIsPlaying(true); // 🔥 Redémarre la musique après "Next song"
        } else {
            setIsReplayButtonVisible((songUris.length - maxSongIndex) >= 10);
            setIsPlaylistFinished(true);
            setShowPopupFinish(true);
        }
    };
    

    const handlePlayerStateChange = (state) => {
        console.log(state);
        if (state.status === 'READY') {
            setDeviceId(state.deviceId);
            setIsPlayerReady(true);
        }
    };

    const handlePlayPauseClick = () => {
        setIsPlaying(!isPlaying);
    };

    const onReplay = () => {
        axios.post(`${urlServer}/keep-playing`, {
            accessToken: accessToken,
            gameType: { type }
        })
            .then(() => {
                setMaxSongIndex(maxSongIndex + 10);
                setShowPopupFinish(false);
                setCurrentSongIndex(currentSongIndex + 1);
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    setShowPopupFinish(false);
                    setShowPopupPay(true);
                } else {
                    console.error('Error:', error.message);
                    message.error('Error:' + error.message);
                }
            });
    };



    
    return (
        <MainLayout>
            <div className="layoutWrapper">
                <Player
                    accessToken={accessToken}
                    callback={handlePlayerStateChange}
                    trackUri={songUris[currentSongIndex]}
                    play={isPlaying}
                />
    
                <h1 className="title">{type}</h1>
                <Divider className="divider" style={{ borderColor: 'white', width: '400px', margin: '12px 0' }} />
                <h3 className="subTitle">{input}</h3>
    
                <div className="main-wrapper">
                    <div className="current-track-wrapper">
                        <div className="equalizer-wrapper">
                            <Equalizer />
                        </div>
    
                        {/* Boutons Previous, Play/Pause et Next en ligne */}
                        <div className="controls">
                            <Button
                                type="default"
                                icon={<BackwardOutlined />}
                                onClick={handlePreviousTrack}
                                disabled={currentSongIndex === 0}
                            />
                            <Button
                                type="default"
                                icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                                onClick={handlePlayPauseClick}
                            />
                            <Button
                                type="default"
                                icon={<ForwardOutlined />}
                                onClick={handleNextTrack}
                            />
                        </div>
    
                        {/* Bouton "Show Track" en dessous */}
                        <div className="show-button-container">
                            <Button
                                className="show-button"
                                type="default"
                                onClick={() => setShowPopupResult(!showPopupResult)}
                                icon={<EyeOutlined />}
                            >
                                Show Track
                            </Button>
                        </div>
                    </div>
                </div>
    
                {currentTrack && (
                    <PopUpResult
                        isVisible={showPopupResult}
                        onClose={() => setShowPopupResult(false)}
                        currentTrack={currentTrack}
                        onNextTrack={handleNextTrack}
                    />
                )}
    
                {isPlaylistFinished && (
                    <PopUpFinish
                        isVisible={showPopupFinish}
                        onClose={() => setShowPopupFinish(false)}
                        isReplayButtonVisible={isReplayButtonVisible}
                        onReplay={onReplay}
                        onGoToHome={() => navigate('/')}
                    />
                )}
    
                <PopUpPay isVisible={showPopupPay} onClose={() => setShowPopupPay(false)} />
            </div>
        </MainLayout>
    );
    

}

export default Game;
