import React from 'react';
import { Modal, Button } from 'antd';
import MusicNote from '../assets/MusicNote';
import './PopUpFinish.css';
import { CloseCircleOutlined, SmileOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';

function PopUpFinish({ isVisible, onClose, onReplay, onGoToHome }) {
    return (
        <Modal
            className="pop-up-finish"
            title={<div className="modal-title-finish">


                <MusicNote />
                <span className="modal-title-text-finish">The end...</span>
                <div className='close-icon-container-finish' onClick={onClose}>
                    <CloseCircleOutlined className="close-icon-finish" /></div>
            </div>
            }
            open={isVisible}
            onCancel={onClose}
            footer={null}
            closable={false}
        >
            <div className="content-container-finish">
                <div className="text-container-finish" style={{ textAlign: 'center' }}>
                    <p>The blindtest is over.</p>
                    <p>What do you want to do next?</p>
                </div>
                <Button autoFocus className="main-menu-button" onClick={onGoToHome}>
                    Main menu
                </Button>
            </div>

        </Modal>
    );
}

export default PopUpFinish;