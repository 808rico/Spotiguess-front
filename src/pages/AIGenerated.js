import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';



function AIGenerated({ code }) {
    const navigate = useNavigate();
    const accessToken = UseAuth(code)
    spotifyApi.setAccessToken(accessToken)
  
    useEffect(() => {
      if (!accessToken) return
      spotifyApi.setAccessToken(accessToken)
    }, [accessToken])
  
  

    const isDesktopOrLaptop = useMediaQuery({ minWidth: 500 });
    console.log(isDesktopOrLaptop)
  
    const handleNavigate = (path) => {
      navigate(path);
    };
  
    return (
  
  
      <MainLayout>
        <div>Skurt34</div>
      </MainLayout>
    );
  };
  
  
  export default AIGenerated