// src/UseAuth.js
import { useState, useEffect } from 'react';
import axios from 'axios';


const urlServer = process.env.REACT_APP_URL_SERVER;

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  // Au montage, si on n'a pas de code,
  // on tente de lire un éventuel token stocké
  useEffect(() => {
    if (!code) {
      const storedAccessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');
      const storedExpiresIn = localStorage.getItem('expires_in');

      if (storedAccessToken && storedRefreshToken && storedExpiresIn) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setExpiresIn(parseInt(storedExpiresIn, 10));
      }
    }
  }, [code]);

  // 1) Obtenir un token initial depuis votre serveur, si un code est présent
  useEffect(() => {
    if (!code) return;
    axios
      .post(`${urlServer}/login`, { code })
      .then(res => {
        const { accessToken, refreshToken, expiresIn } = res.data;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setExpiresIn(expiresIn);

        // Stockage local pour persister la session
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('expires_in', String(expiresIn));

        // Nettoie l'URL (retire ?code=...)
        window.history.pushState({}, null, '/');
      })
      .catch(() => {
        window.location = '/';
      });
  }, [code]);

  // 2) Rafraîchir le token automatiquement
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post(`${urlServer}/refresh`, { refreshToken })
        .then(res => {
          const { accessToken, expiresIn } = res.data;
          setAccessToken(accessToken);
          setExpiresIn(expiresIn);

          // MAJ localStorage
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('expires_in', String(expiresIn));

        })
        .catch(() => {
          window.location = '/';
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Si l'onglet redevient visible, on tente un refresh
      if (!document.hidden) {
        if (refreshToken) {
          // Tenter un refresh
          axios
            .post(`${urlServer}/refresh`, { refreshToken })
            .then(res => {
              setAccessToken(res.data.accessToken);
              setExpiresIn(res.data.expiresIn);

              localStorage.setItem("access_token", res.data.accessToken);
              localStorage.setItem("expires_in", String(res.data.expiresIn));
            })
            .catch(() => {
              window.location = "/";
            });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshToken]);


  return accessToken;
}
