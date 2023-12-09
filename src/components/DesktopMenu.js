import React from 'react';
import { Layout, Menu } from 'antd';
import { PieChartOutlined, DesktopOutlined, ContainerOutlined } from '@ant-design/icons';
import './DesktopMenu.css'
import {
  HomeOutlined,
  BulbOutlined,
  HeartOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const DesktopMenu = ({ menuOpen }) => {
  return (
    <Sider 
    collapsible={false}
     collapsed={!menuOpen}
     style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
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
    </Sider>
  );
};

export default DesktopMenu;