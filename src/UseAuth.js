import { useEffect, useState } from 'react';
import axios from 'axios';

const urlServer = 'http://localhost:3001'; // Ou 'https://blindtest-spotify-v1.herokuapp.com'

function useAuth(code) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
    const [expiresIn, setExpiresIn] = useState();

    useEffect(() => {
        if (!code) return;
        axios.post(`${urlServer}/login`, { code })
            .then(res => {
                setAccessToken(res.data.accessToken);
                setRefreshToken(res.data.refreshToken);
                setExpiresIn(res.data.expiresIn);
                localStorage.setItem('access_token', res.data.accessToken);
                localStorage.setItem('refresh_token', res.data.refreshToken);
                window.history.pushState({}, null, '/');
            })
            .catch(() => {
                window.location = '/';
            });
    }, [code]);

    useEffect(() => {
        if (!refreshToken || !expiresIn) return;

        const interval = setInterval(() => {
            axios.post(`${urlServer}/refresh`, { refreshToken })
                .then(res => {
                    setAccessToken(res.data.accessToken);
                    setExpiresIn(res.data.expiresIn);
                    localStorage.setItem('access_token', res.data.accessToken);
                })
                .catch(() => {
                    window.location = '/';
                });
        }, (expiresIn - 60) * 1000);

        return () => clearInterval(interval);
    }, [refreshToken, expiresIn]);

    return accessToken;
}

export default useAuth;
