import React, { useState, useEffect } from 'react';
import { Modal, Button, Radio,message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import MusicNote from '../../assets/MusicNote';
import './PopUpGameMode.css';
import axios from "axios";

const urlServer = process.env.REACT_APP_URL_SERVER;

function PopUpGameMode({ isVisible, onClose, gameMode, setGameMode, accessToken }) {
  const [selectedMode, setSelectedMode] = useState(gameMode);

  console.log("gameMode", gameMode);

  useEffect(() => {
    setSelectedMode(gameMode);
  }, [gameMode]);

  const handleModeChange = (e) => {
    setSelectedMode(e.target.value);
  };


  const handleSave = () => {
    axios.post(`${urlServer}/settings/game-mode`, {
      gameType: selectedMode,
      accessToken
    })
    .then(() => {
      message.success('Game mode updated');
      setGameMode(selectedMode); // 🔹 Mise à jour du state dans le parent
      onClose();
    })
    .catch((error) => {
      console.error("Error updating game mode:", error);
      message.error('Error updating game mode');
    });
  };

  const modalTitle = (
    <div className="modal-title centered-title">
      <MusicNote />
      <span className="modal-title-text">Switch Game Mode</span>
      <div className="close-icon-container" onClick={onClose}>
        <CloseCircleOutlined className="close-icon" />
      </div>
    </div>
  );

  return (
    <Modal
      className="pop-up-game-mode"
      title={modalTitle}
      open={isVisible}
      closable={false}
      onCancel={onClose}
      footer={null}
    >
      <div className="content-container">
        <div className="mode-selection">
          <Radio.Group
            onChange={handleModeChange}
            value={selectedMode}
            className="radio-group"
          >
            <Radio value="auto" className="radio-button">
              <strong>Auto</strong>
              <p className="description">It will play each song for 15s and go through the playlist automatically.</p>
            </Radio>
            <Radio value="manual" className="radio-button">
              <strong>Manual</strong>
              <p className="description">Take full control of the game. Decide when to Play, Pause and Skip each track.</p>
            </Radio>
          </Radio.Group>
        </div>
        <Button
          autoFocus
          className="save-button"
          onClick={handleSave}
          style={{ marginTop: 20 }}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}

export default PopUpGameMode;
