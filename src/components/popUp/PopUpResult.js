import React from 'react';
import { Modal, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import MusicNote from '../../assets/MusicNote';
import './PopUpResult.css';

function PopUpResult({
  isVisible,
  onClose,
  currentTrack,
  onNextTrack,
  // Ajout d’une prop pour connaître le mode
  gameType,
  // Si tu veux afficher « X seconds », il te faut un compte à rebours
  nextSongCountdown
}) {
  // On réagit au clic sur le bouton en mode manuel
  const handleNextAndClose = () => {
    onClose();      // Fermer la fenêtre
    onNextTrack();  // Passer au morceau suivant
  };

  // Titre de la modal : on retire la croix si on est en mode auto
  const modalTitle = (
    <div className="modal-title">
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
      // onCancel est appelé quand on clique à l'extérieur ou sur la croix
      // En mode auto, on force closable à false pour ne pas pouvoir fermer la popup manuellement
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

        {/* On affiche soit le bouton (mode manuel), soit un texte (mode auto) */}
        {gameType === 'auto' ? (
          <div style={{ marginTop: '20px', color: 'white', fontWeight: 'bold' }}>
            Next song in {nextSongCountdown} seconds...
          </div>
        ) : (
          <Button
            autoFocus
            className="next-song-button"
            onClick={handleNextAndClose}
          >
            Next song
          </Button>
        )}
      </div>
    </Modal>
  );
}

export default PopUpResult;
