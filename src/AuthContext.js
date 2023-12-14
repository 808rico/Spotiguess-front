import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import useAuth2 from './UseAuth';

export const AuthContext = createContext({
  accessToken: null,
  setAccessToken: () => {}
});

export const AuthProvider = ({ children }) => {
  const [code, setCode] = useState(new URLSearchParams(window.location.search).get('code'));
  const accessToken = useAuth2(code);
  console.log("authprovider")

  useEffect(() => {
    // Si besoin, ajoutez ici une logique pour gérer les changements de code
  }, [code]);

  return (
    <AuthContext.Provider value={{ accessToken, setCode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);