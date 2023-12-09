import React, { useState } from 'react';
import { Menu, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './MobileMenu.css'
import {
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  HomeOutlined,
  BulbOutlined,
  HeartOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';


const MobileMenu = ({ menuOpen, toggleMenu}) => {
  
  const [drawerVisible, setDrawerVisible] = useState(false);

  

  return (
    <Drawer
      title="Menu"
      placement="left"
      closable={true}
      onClose={toggleMenu}
      open={menuOpen}
      width={260}
    >
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
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
      </Menu>
    </Drawer>
  );
};

export default MobileMenu
