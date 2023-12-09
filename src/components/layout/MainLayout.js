// MainLayout.js
import React, { useState } from 'react';
import { Layout } from 'antd';
import { useMediaQuery } from 'react-responsive';
import Header from './Header';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 500 });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Layout>
      <Header toggleMenu={toggleMenu} />
      <Layout>
        {isDesktopOrLaptop ? (
          <DesktopMenu menuOpen={menuOpen} />
        ) : (
          <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
        )}
        <Content style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
          <div style={{ background: '#000000', padding: 24, maxWidth: '800px', width: '100%', margin: '0 auto' }} >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
