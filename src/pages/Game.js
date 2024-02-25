import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import MainLayout from '../components/layout/MainLayout';
import PopUpResult from '../components/popUp/PopUpResult'
import PopUpFinish from '../components/popUp/PopUpFinish'
import Equalizer from "../components/Equalizer";
import { Divider, message } from "antd";
import { Button } from 'antd';
import { PlayCircleOutlined, ForwardOutlined, BulbOutlined, EyeOutlined } from '@ant-design/icons';
//import { PlayCircleOutlined, BulbOutlined,LoadingOutlined } from '@ant-design/icons';
import './Game.css'
import Player from "../Player";
import Cookies from 'js-cookie';
import axios from 'axios'
import PopUpPay from "../components/popUp/PopUpPay";




const iconMap = {
    BulbOutlined: BulbOutlined,
    // Ajoutez d'autres icônes ici si nécessaire
};

const spotifyApi = new SpotifyWebApi({
    clientId: '80256b057e324c5f952f3577ff843c29',
});


const urlServer = process.env.REACT_APP_URL_SERVER;

function Game() {



    const location = useLocation();
    const navigate = useNavigate();
    const { type, iconName, input, songUris } = location.state;
    console.log("game");
    // eslint-disable-next-line
    const accessToken = Cookies.get("spotifyAuthToken");
    const [isFirstPlayClicked, setIsFirstPlayClicked] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [maxSongIndex, setMaxSongIndex] = useState(10);
    const [isPlaylistFinished, setIsPlaylistFinished] = useState(false);
    const [isReplayButtonVisible,setIsReplayButtonVisible] = useState(false)
    const [currentTrack, setCurrentTrack] = useState(null);
    const [showPopupResult, setShowPopupResult] = useState(false);
    const [showPopupFinish, setShowPopupFinish] = useState(false);
    const [showPopupPay, setShowPopupPay] = useState(false);
    // eslint-disable-next-line
    const [player, setPlayer] = useState(undefined);
    const [isLoadingPlay, setIsLoadingPlay] = useState(true);
    const [deviceId, setDeviceId] = useState('');
    const [isPlayerReady, setIsPlayerReady] = useState(false);



    const Icon = iconMap[iconName];

    const togglePopupResult = () => {
        setShowPopupResult(!showPopupResult);
    };

    const togglePopupFinish = () => {
        setShowPopupFinish(!showPopupFinish);
    };

    const handleNextTrack = () => {
        console.log("currentSongIndex", currentSongIndex)
        console.log("maxSongIndex", maxSongIndex)
        const nextIndex = currentSongIndex + 1;



        if (nextIndex < maxSongIndex) {

            setCurrentSongIndex(nextIndex);

            //setOffset(random_position_ms);

            /*
            spotifyApi.setAccessToken(accessToken);
            const random_position_ms = Math.floor(Math.random() * 30001);
            // Demander à l'API de Spotify de jouer la chanson
            spotifyApi.play({

                uris: [songUris[nextIndex]],
                position_ms: random_position_ms
            }).then(() => {
                console.log("Playback started");
                
            }).catch(err => {
                message.error("Error in starting playback: " + err.message);
                console.error("Error in starting playback", err);
            });*/


        } else {
            if ((songUris.length- maxSongIndex) >= 10){
                setIsReplayButtonVisible(true)
            }
            else{
                setIsReplayButtonVisible(false)
            }
            setIsPlaylistFinished(true);
            togglePopupFinish(); // Toutes les chansons ont été jouées
        }
    };


    const handlePlayerStateChange = (state) => {
        console.log(state);
        if (state.status === 'READY') {
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

        // Ajoutez ici la logique pour redémarrer le jeu


        axios.post(`${urlServer}/keep-playing`, {
            accessToken: accessToken,
            gameType: { type }
        })
            .then(response => {

                setMaxSongIndex(maxSongIndex + 10)
                setShowPopupFinish(false);
                setCurrentSongIndex(currentSongIndex +1 );
                console.log(response);

            })
            .catch(error => {
                // Gérer les réponses d'erreur ici
                if (error.response) {
                    console.log('Status code:', error.response.status); // Affiche le code de statut de l'erreur
                    if (error.response.status === 400) {
                        setShowPopupFinish(false);
                        setShowPopupPay(true); // Afficher la popup pour le code 400
                    }
                } else {
                    // Erreur produite dans la mise en place de la requête
                    console.error('Error:', error.message);
                    message.error('Error:' + error.message);
                }

            })



    };


    useEffect(() => {
        console.log("useEffect");
        console.log(currentSongIndex)

        if (accessToken && songUris[currentSongIndex]) {



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
                        trackUri={songUris[currentSongIndex]}
                        play={isFirstPlayClicked} />

                    <h1 className="title"> {Icon && <Icon />} {type}</h1>
                    <Divider
                        className="divider"
                        style={{ borderColor: 'white', width: '400px', margin: '12px 0' }} />
                    <h3 className="subTitle">  {input}</h3>

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
                            isReplayButtonVisible={isReplayButtonVisible}
                            onReplay={onReplay}
                            onGoToHome={onGoToHome}
                        />}

                        <PopUpPay isVisible={showPopupPay} onClose={() => setShowPopupPay(false)} />
                    </div>

                </div>
            </MainLayout>

        </>);
};


export default Game