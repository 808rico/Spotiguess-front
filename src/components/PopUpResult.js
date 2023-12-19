import React from 'react';
import { Modal, Button } from 'antd';
import {  CloseCircleOutlined } from '@ant-design/icons';
import MusicNote from '../assets/MusicNote';
import './PopUpResult.css';

function PopUpResult({ isVisible, onClose, currentTrack, onNextTrack }) {
    const handleNextAndClose = () => {
        onClose();  // Fermer la fenêtre
        onNextTrack();  // Passer au morceau suivant
    };

    return (
        <Modal
            className="pop-up-result"
            title={<div className="modal-title">

                
                <MusicNote />
                <span className="modal-title-text">Result</span>
                <div className='close-icon-container' onClick={onClose}>
                    <CloseCircleOutlined className="close-icon"  /></div>
                </div>
                }
            open={isVisible}
            onCancel={onClose}
            footer={null}
            closable={false}
        >
            <div className="content-container">
                <div className="result-container">
                    <img className='img-album' src={currentTrack.album.images[0].url} alt={currentTrack.name} />
                    <div className="track-details">
                        <p className="track-name">{currentTrack.name}</p>
                        <p className="track-artist">{currentTrack.artists.map(artist => artist.name).join(", ")}</p>
                        <p className="track-album">{currentTrack.album.name}</p>
                    </div>
                </div>
                <Button autoFocus  className="next-song-button" onClick={handleNextAndClose}>
                    Next song
                </Button>
            </div>
        </Modal>
    );
}

export default PopUpResult;
