// useAuth.js (exemple simplifié)
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const urlServer = process.env.REACT_APP_URL_SERVER;

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  // 1) Obtenir un token initial depuis votre serveur
  useEffect(() => {
    if (!code) return;
    axios
      .post(`${urlServer}/login`, { code })
      .then(res => {
        const { accessToken, refreshToken, expiresIn } = res.data;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setExpiresIn(expiresIn);

        // MISE À JOUR DU COOKIE ICI
        Cookies.set('spotifyAuthToken', accessToken, {
          // éventuellement quelques options
          expires: 1, // 1 jour, par exemple
          secure: true, // si vous êtes en https
          sameSite: 'strict',
        });

        // Nettoie l'URL (retire ?code=...)
        window.history.pushState({}, null, '/');
      })
      .catch(() => {
        window.location = '/';
      });
  }, [code]);

  // 2) Rafraîchir le token
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post(`${urlServer}/refresh`, { refreshToken })
        .then(res => {
          const { accessToken, expiresIn } = res.data;
          setAccessToken(accessToken);
          setExpiresIn(expiresIn);

          // MISE À JOUR DU COOKIE ICI AUSSI
          Cookies.set('spotifyAuthToken', accessToken, {
            expires: 1,
            secure: true,
            sameSite: 'strict',
          });
        })
        .catch(() => {
          window.location = '/';
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
