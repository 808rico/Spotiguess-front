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
    console.log(songUris);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token')
    spotifyApi.setAccessToken(accessToken);
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 700 });
    const [isFirstPlayClicked, setIsFirstPlayClicked] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const handleNextTrack = () => {
        player && player.nextTrack();
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handlePlayClick = () => {
        setIsFirstPlayClicked(true);
        playTracks(songUris);
    };


    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    const [player, setPlayer] = useState(undefined);

    function transferPlaybackToDevice(deviceId) {
        fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ device_ids: [deviceId], play: false })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Playback transferred to device');
                } else {
                    console.error('Error transferring playback', response);
                }
            })
            .catch(error => console.error('Error transferring playback', error));
    }




    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(accessToken); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                transferPlaybackToDevice(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ({ device_id }) => {
                player.getCurrentState().then(state => {
                    if (!state) {
                        console.error('User is not playing music through the Web Playback SDK');
                        return;
                    }

                    var current_track = state.track_window.current_track;
                    //var next_track = state.track_window.next_tracks[0];
                    setCurrentTrack(current_track)

                });

                console.log('player_state_changed', device_id);
            });

            player.connect();
        };
    }, [accessToken]);

    function playTracks(uris) {
        fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uris: uris })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Playback started');
                } else {
                    console.error('Error starting playback', response);
                }
            })
            .catch(error => console.error('Error starting playback', error));
    }

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