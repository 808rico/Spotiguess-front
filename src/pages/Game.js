import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import PopUpResult from '../components/PopUpResult'
import PopUpFinish from '../components/PopUpFinish'
import Equalizer from "../components/Equalizer";
import { Divider, message } from "antd";
import { useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { PlayCircleOutlined, ForwardOutlined, BulbOutlined, EyeOutlined } from '@ant-design/icons';
//import { PlayCircleOutlined, BulbOutlined,LoadingOutlined } from '@ant-design/icons';
import './Game.css'
import Player from "../Player";

const iconMap = {
    BulbOutlined: BulbOutlined,
    // Ajoutez d'autres icônes ici si nécessaire
};

const spotifyApi = new SpotifyWebApi({
    clientId: '80256b057e324c5f952f3577ff843c29',
});




function Game() {



    const location = useLocation();
    const navigate = useNavigate();
    const { type, iconName, input, songUris } = location.state;
    console.log("game");
    // eslint-disable-next-line
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'))
    const [isFirstPlayClicked, setIsFirstPlayClicked] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [isPlaylistFinished, setIsPlaylistFinished] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [showPopupResult, setShowPopupResult] = useState(false);
    const [showPopupFinish, setShowPopupFinish] = useState(false);
    // eslint-disable-next-line
    const [player, setPlayer] = useState(undefined);
    const [isLoadingPlay, setIsLoadingPlay] = useState(true);
    const [deviceId, setDeviceId] = useState('');
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [offset, setOffset] = useState(0);

    const Icon = iconMap[iconName];

    const togglePopupResult = () => {
        setShowPopupResult(!showPopupResult);
    };

    const togglePopupFinish = () => {
        setShowPopupFinish(!showPopupFinish);
    };

    const handleNextTrack = () => {
        const nextIndex = currentSongIndex + 1;


        if (nextIndex < songUris.length) {

            //setOffset(random_position_ms);


            spotifyApi.setAccessToken(accessToken);
            const random_position_ms = Math.floor(Math.random() * 30001);
            // Demander à l'API de Spotify de jouer la chanson
            spotifyApi.play({

                uris: [songUris[nextIndex]],
                position_ms: random_position_ms
            }).then(() => {
                console.log("Playback started");
                setCurrentSongIndex(nextIndex);
            }).catch(err => {
                message.error("Error in starting playback: " + err.message);
                console.error("Error in starting playback", err);
            });
            

        } else {

            setIsPlaylistFinished(true);
            togglePopupFinish(); // Toutes les chansons ont été jouées
        }
    };


    const handlePlayerStateChange = (state) => {
        console.log(state);
        if (state.deviceId) {
            setDeviceId(state.deviceId);
            setIsPlayerReady(true);
            setIsLoadingPlay(false);
        }
    };

    const handlePlayClick = () => {

        console.log("isPlayerReady", isPlayerReady);
        console.log("deviceId", deviceId);
        setIsFirstPlayClicked(true)
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
        console.log("useEffect");
        console.log(currentSongIndex)

        if ( accessToken && songUris[currentSongIndex]) {


            
            spotifyApi.setAccessToken(accessToken);
            
            // Demander à l'API de Spotify de jouer la chanson
            spotifyApi.getTrack(songUris[currentSongIndex].substring(songUris[currentSongIndex].lastIndexOf(":") + 1))
                .then(function (data) {
                    setCurrentTrack(data.body);

                }, function (err) {
                    message.error("Error retrieving track information: " + err.message);
                    console.error(err);
                });
        }
    }, [currentSongIndex, accessToken, songUris]);








    return (
        <>



            <MainLayout>
                <div className="layoutWrapper" >

                    <Player
                        accessToken={accessToken}
                        callback={handlePlayerStateChange}
                        trackUri={songUris[0]}
                        play={isFirstPlayClicked} />

                    <h1 className="title"> {Icon && <Icon />} {type}</h1>
                    <Divider
                        className="divider"
                        style={{ borderColor: 'white', width: '400px', margin: '12px 0' }} />
                    <h3 className="subTitle"> <i>Your input:  </i> {input}</h3>

                    <div className="main-wrapper">
                        {!isFirstPlayClicked && (
                            <Button
                                className="play-button"
                                type="primary"
                                icon={<PlayCircleOutlined />}
                                onClick={handlePlayClick}
                                size="large"
                                loading={isLoadingPlay}
                            >

                                Play
                            </Button>
                        )}
                        {isFirstPlayClicked && (
                            <div className="current-track-wrapper">
                                <div className="equalizer-wrapper">
                                    <Equalizer />
                                </div>

                                <div className="next-show-button">

                                    <Button
                                        className="next-button"
                                        type="default"
                                        icon={<ForwardOutlined />}
                                        onClick={() => { handleNextTrack() }}>
                                        Next song
                                    </Button>


                                    <Button
                                        className="show-button"
                                        type="default"
                                        onClick={togglePopupResult}
                                        icon={<EyeOutlined />}
                                    >
                                        Show Track
                                    </Button>
                                </div>
                            </div>
                        )}



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

        </>);
};


export default Game