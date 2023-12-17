import React from 'react';
import './Equalizer.css'; // Assurez-vous que le chemin d'accès est correct

const Equalizer = () => (
    <svg className= "svgEqualizer" viewBox="0 0 250 100" xmlns="http://www.w3.org/2000/svg">
        <rect className="bar" x="10" y="99"  height="1"></rect>
        <rect className="bar" x="52" y="99"  height="1"></rect>
        <rect className="bar" x="94" y="99"  height="1"></rect>
        <rect className="bar" x="136" y="99"  height="1"></rect>
        <rect className="bar" x="178" y="99"  height="1"></rect>
        <rect className="bar" x="220" y="99"  height="1"></rect>
    </svg>
);

export default Equalizer;
