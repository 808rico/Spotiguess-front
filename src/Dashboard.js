import React, { useEffect, useState } from "react";
import { Layout } from 'antd';
import { useMediaQuery } from 'react-responsive';

import UseAuth from "./UseAuth";
import SpotifyWebApi from "spotify-web-api-node"
import Header from './components/Header'
import DesktopMenu from './components/DesktopMenu'
import MobileMenu from './components/MobileMenu'


const { Content } = Layout;

const spotifyApi = new SpotifyWebApi({
  clientId: '80256b057e324c5f952f3577ff843c29',
})




function Dashboard({ code }) {
  const accessToken = UseAuth(code)
  spotifyApi.setAccessToken(accessToken)


  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 500 });
  console.log(isDesktopOrLaptop)

  return (


    <Layout>
      <Header toggleMenu={toggleMenu} />

      <Layout>
        {isDesktopOrLaptop ? <DesktopMenu menuOpen={menuOpen} /> : <MobileMenu menuOpen={menuOpen } toggleMenu={toggleMenu}/>}

        <Content style={{ backgroundColor: '000000', minHeight: '100vh' }}>
          <div style={{ background: '#000000', padding: 24, minHeight: 280, height: '100%' }} >

          </div>
        </Content>
      </Layout>
    </Layout>
  );
};


export default Dashboard