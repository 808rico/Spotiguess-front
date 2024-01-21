import { useState, useEffect } from "react"
import axios from "axios"

//const urlServer = 'http://localhost:3001'; // Ou 'https://spotiguess-server-4a46bc45d48c.herokuapp.com'
const urlServer =  process.env.REACT_APP_URL_SERVER;

const isTokenExpired = (expiresIn) => {
  const currentTime = new Date().getTime();
  const expiryTime = new Date(expiresIn).getTime();
  return currentTime > expiryTime;
};

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  const [expiresIn, setExpiresIn] = useState(localStorage.getItem('expires_in'));

  useEffect(() => {
    if (accessToken && isTokenExpired(expiresIn)) {
      console.log('useEffect1')
      setAccessToken(null);
      setRefreshToken(null);
      setExpiresIn(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('expires_in');
    }
  }, [accessToken, expiresIn]);

  useEffect(() => {
    if (!code) return
    console.log('useEffect2')
    axios
      .post(`${urlServer}/login`, {
        code,
      })
      .then(res => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        localStorage.setItem('access_token', res.data.accessToken);
        localStorage.setItem('refresh_token', res.data.refreshToken);
        localStorage.setItem('expires_in', res.data.expiresIn);
        setExpiresIn(res.data.expiresIn)
        window.history.pushState({}, null, "/")
      })
      .catch(() => {
        //window.location = "/"
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    console.log('useEffect3')
    const interval = setInterval(() => {
      axios
        .post(`${urlServer}/refresh`, {
          refreshToken,
        })
        .then(res => {
          setAccessToken(res.data.accessToken)
          setExpiresIn(res.data.expiresIn)
          localStorage.setItem('access_token', res.data.accessToken);
          localStorage.setItem('expires_in', res.data.expiresIn);
        })
        .catch(() => {
          window.location = "/"
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}




