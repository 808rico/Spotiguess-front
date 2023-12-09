import React from 'react';
import { Card, Divider, Space } from 'antd';
import { BulbOutlined, HeartOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import './optionCard.css'; // Assurez-vous que le chemin d'importation est correct

function OptionCard({ title, Icon, description, onClick, isPopular }) {
  return (


      <Card 
        className="option-card" 
        onClick={onClick} 
        hoverable
      >
        <Card.Meta 
        avatar={<Icon className="option-icon" />} // Utilisez la classe pour l'icône
        title={<span className="option-title">{title}</span>} // Utilisez la classe pour le titre
      />
      <Divider style={{ borderColor: 'white', margin: '12px 0' }} />
      <span className="option-description">{description}</span> 
    </Card>

    
    
  );
}

export default OptionCard;
