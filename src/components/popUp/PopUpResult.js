import React, { useState, useEffect} from 'react';
import { Modal, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import MusicNote from '../../assets/MusicNote';
import './PopUpResult.css';

function PopUpResult({
  isVisible,
  onClose,
  currentTrack,
  onNextTrack,
  gameType,
  nextSongCountdown,
  onCancelAutoClose
}) {
  // Pour basculer l’affichage après clic sur "Keep playing"
  const [showManualButton, setShowManualButton] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowManualButton(false);
    }
  }, [isVisible]);

  const handleNextAndClose = () => {

    onClose();
    onNextTrack();

  };

  // Quand on clique sur "Keep playing"
  const handleKeepPlayingClick = () => {
    
    onCancelAutoClose();
    setShowManualButton(true);
  };

  // En mode auto, on cache la croix de fermeture
  const modalTitle = (
    <div className={`modal-title ${gameType === 'auto' ? 'centered-title' : ''}`}>
      <MusicNote />
      <span className="modal-title-text">Result</span>
      {gameType !== 'auto' && (
        <div className='close-icon-container' onClick={onClose}>
          <CloseCircleOutlined className="close-icon" />
        </div>
      )}
    </div>
  );

  return (
    <Modal
      className="pop-up-result"
      title={modalTitle}
      open={isVisible}
      closable={gameType !== 'auto'}
      onCancel={gameType !== 'auto' ? onClose : undefined}
      footer={null}
    >
      <div className="content-container">
        <div className="result-container">
          <img
            className="img-album"
            src={currentTrack.album.images[0].url}
            alt={currentTrack.name}
          />
          <div className="track-details">
            <p className="track-name">{currentTrack.name}</p>
            <p className="track-artist">
              {currentTrack.artists.map((artist) => artist.name).join(', ')}
            </p>
            <p className="track-album">
              {currentTrack.album.name} - {currentTrack.album.release_date.split('-')[0]}
            </p>
          </div>
        </div>

        {/* MODE AUTO */}
        {gameType === 'auto' && (
          <>
            {/* Si on n’a pas encore cliqué sur "Keep playing" */}
            {!showManualButton && (
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <div
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    marginBottom: 8,
                  }}
                >
                  Next song in {nextSongCountdown} seconds...
                </div>
                <div
                  style={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    color: '#1ED760',
                    fontWeight: 'bold',
                  }}
                  onClick={handleKeepPlayingClick}
                >
                  Keep playing
                </div>
              </div>
            )}

            {/* Si on a cliqué sur "Keep playing", on affiche le bouton "Next song" */}
            {showManualButton && (
              <Button
                autoFocus
                className="next-song-button"
                onClick={handleNextAndClose}
                style={{ marginTop: 20 }}
              >
                Next song
              </Button>
            )}
          </>
        )}

        {/* MODE MANUEL */}
        {gameType !== 'auto' && (
          <Button
            autoFocus
            className="next-song-button"
            onClick={handleNextAndClose}
            style={{ marginTop: 20 }}
          >
            Next song
          </Button>
        )}
      </div>
    </Modal>
  );
}

export default PopUpResult;
