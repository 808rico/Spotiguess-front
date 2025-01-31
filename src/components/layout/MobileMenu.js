import React from 'react';
import { Menu, Drawer } from 'antd';

import { useNavigate, useLocation } from 'react-router-dom';
import './MobileMenu.css'
import {

  HomeOutlined,
  BulbOutlined,
  HeartOutlined,
  UnorderedListOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';


const MobileMenu = ({ menuOpen, toggleMenu}) => {
  

  const navigate = useNavigate();
  const location = useLocation();

  // Cette fonction détermine quel élément du menu doit être sélectionné en fonction du chemin actuel
  const getSelectedKeys = () => {
    const path = location.pathname;
    switch (path) {
      case '/': return ['1'];
      case '/ai-generated': return ['2'];
      case '/liked-songs': return ['3'];
      case '/playlist': return ['4'];
      case '/artist': return ['5'];
      case '/setings': return ['6'];
      default: return [];
    }
  };

  // Navigue vers l'URL correspondant à la clé de l'élément du menu
  const handleMenuClick = (e) => {
    switch (e.key) {
      case '1': navigate('/'); break;
      case '2': navigate('/ai-generated'); break;
      case '3': navigate('/liked-songs'); break;
      case '4': navigate('/playlist'); break;
      case '5': navigate('/artist'); break;
      case '6': navigate('/settings'); break;
      default: break;
    }
  };

  

  return (
    <Drawer
      title="Menu"
      placement="left"
      closable={true}
      onClose={toggleMenu}
      open={menuOpen}
      width={260}
    >
      <Menu theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        selectedKeys={getSelectedKeys()}
        onClick={handleMenuClick}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<BulbOutlined />}>
          AI Generated
        </Menu.Item>
        <Menu.Item key="3" icon={<HeartOutlined />}>
          Your liked songs
        </Menu.Item>
        <Menu.Item key="4" icon={<UnorderedListOutlined />}>
          Playlist
        </Menu.Item>
        <Menu.Item key="5" icon={<UserOutlined />}>
          Artist
        </Menu.Item>
        <Menu.Item key="6" icon={<SettingOutlined />}>
          Settings
        </Menu.Item>
      </Menu>
    </Drawer>
  );
};

export default MobileMenu
