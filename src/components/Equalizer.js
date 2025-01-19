import React from 'react';
import './Equalizer.css';

const Equalizer = ({ isPlaying }) => (
  <svg className="svgEqualizer" viewBox="0 0 250 100" xmlns="http://www.w3.org/2000/svg">
    {/* Chaque barre utilise une classe conditionnelle barPlaying ou barPaused */}
    <rect className={`bar ${isPlaying ? 'barPlaying delay1' : 'barPaused'}`} x="10"  y="99" height="1"></rect>
    <rect className={`bar ${isPlaying ? 'barPlaying delay2' : 'barPaused'}`} x="52"  y="99" height="1"></rect>
    <rect className={`bar ${isPlaying ? 'barPlaying delay3' : 'barPaused'}`} x="94"  y="99" height="1"></rect>
    <rect className={`bar ${isPlaying ? 'barPlaying delay4' : 'barPaused'}`} x="136" y="99" height="1"></rect>
    <rect className={`bar ${isPlaying ? 'barPlaying delay5' : 'barPaused'}`} x="178" y="99" height="1"></rect>
    <rect className={`bar ${isPlaying ? 'barPlaying delay6' : 'barPaused'}`} x="220" y="99" height="1"></rect>
  </svg>
);

export default Equalizer;
