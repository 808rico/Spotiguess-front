import React from 'react';
import { Modal, Button } from 'antd';
import { SmileOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';

function PopUpFinish({ isVisible, onClose, onReplay, onGoToHome }) {
    return (
        <Modal
            title={<><SmileOutlined /> The end...</>}
            open={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="home" icon={<HomeOutlined />} onClick={onGoToHome}>
                    Main Menu
                </Button>,
                <Button key="replay" icon={<ReloadOutlined />} onClick={onReplay}>
                    Replay
                </Button>
            ]}
        >
            <div style={{ textAlign: 'center' }}>
                <p>The blindtest is over.</p>
                <p>What do you want to do next?</p>
            </div>
        </Modal>
    );
}

export default PopUpFinish;