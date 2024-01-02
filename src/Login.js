import React from 'react'
import { Button } from 'antd';
import './Login.css';

const urlClient = process.env.REACT_APP_URL_CLIENT

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=80256b057e324c5f952f3577ff843c29&response_type=code&redirect_uri=${urlClient}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`


function Login() {
    return (
        <div className='login-container'>
            <div className='logo-section'>
                <img src='/logo.png' alt='Logo' className='logo' />
            </div>
            <div className='button-section'>
                <Button type="primary" className="btn-login" href={AUTH_URL}>
                    Se connecter avec Spotify
                </Button>
            </div>
        </div>
    );
}

export default Login