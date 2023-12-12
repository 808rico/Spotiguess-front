import React from 'react';
import { Modal, Button } from 'antd';
import { ForwardOutlined } from '@ant-design/icons';

function PopUpResult({ isVisible, onClose, currentTrack, onNextTrack }) {
    const handleNextAndClose = () => {
        onClose();  // Fermer la fenêtre
        onNextTrack();  // Passer au morceau suivant
    };

    return (
        <Modal
            title="Current Track"
            open={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="next" icon={<ForwardOutlined />} onClick={handleNextAndClose}>
                    Next
                </Button>
            ]}
        >
            <p>{currentTrack.name} by {currentTrack.artists.map(artist => artist.name).join(", ")}</p>
            <img src={currentTrack.album.images[0].url} alt={currentTrack.name} />
            {/* Autres détails de la piste si nécessaire */}
        </Modal>
    );
}

export default PopUpResult;

