import React, { useEffect, useState } from 'react';
import './Equalizer.css';

const BAR_COUNT = 6;      // Nombre de barres
const MAX_HEIGHT = 100;   // Hauteur max (px)
const UPDATE_INTERVAL = 10; // Intervalle en ms pour incrémenter le temps
const WAVE_DURATION = 1;  // Durée d'un cycle en secondes (0 -> 1)

function wave(t) {
  /**
   * Fonction de forme d'onde qui:
   * - Monte de 1 à 100% sur la première moitié du cycle [0..0.5]
   * - Redescend de 100% à 1 sur la seconde moitié [0.5..1]
   *
   * t est un temps en "secondes" fractionnaires (0..1..2..).
   * On se base sur t % 1 pour avoir un cycle.
   */
  const cycle = t % WAVE_DURATION; // dans [0..1)

  if (cycle < 0.5) {
    // Montée
    const p = cycle / 0.5; // 0..1
    return 1 + 99 * p;     // de 1px à 100px
  } else {
    // Descente
    const p = (cycle - 0.5) / 0.5; // 0..1
    return 100 - 99 * p;           // de 100px à 1px
  }
}

const Equalizer = ({ isPlaying }) => {
  // BarHeights : tableau de hauteurs (nb : BAR_COUNT)
  const [barHeights, setBarHeights] = useState(
    Array.from({ length: BAR_COUNT }, () => 2) // Au départ, 2px
  );

  // time : avance seulement quand isPlaying = true
  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalId;

    if (isPlaying) {
      // Relance la "danse" : on incrémente time à intervalles réguliers
      intervalId = setInterval(() => {
        setTime(t => t + UPDATE_INTERVAL / 1000); 
        // / 1000 pour convertir ms -> secondes
      }, UPDATE_INTERVAL);
    } else {
      // Musique stoppée -> on "descend" les barres à 2px
      setBarHeights(Array.from({ length: BAR_COUNT }, () => 2));
      // Réinitialise éventuellement le time si vous voulez
      // setTime(0);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying]);

  // Chaque fois que time change, on recalcule barHeights si isPlaying
  useEffect(() => {
    if (!isPlaying) return; // Pas besoin de calculer si on est arrêté

    const newHeights = Array.from({ length: BAR_COUNT }, (_, i) => {
      // Décalage pour la barre i
      const barDelay = i * 0.2; // 0.2s de phase par barre (ajustez à votre goût)
      const currentTime = time + barDelay; // Temps effectif pour la barre i

      // Calcule la hauteur via la fonction wave
      return wave(currentTime);
    });

    setBarHeights(newHeights);
  }, [time, isPlaying]);

  return (
    <svg className="svgEqualizer" viewBox="0 0 250 100" xmlns="http://www.w3.org/2000/svg">
      {barHeights.map((height, i) => {
        // Calcule la position Y, le SVG allant de 0 en haut à 100 en bas
        const xPos = 10 + i * 42;  // Espace horizontal
        const yPos = MAX_HEIGHT - height; // "height" part du bas

        return (
          <rect
            key={i}
            className="bar"
            x={xPos}
            y={yPos}
            width="25"
            height={height}
          />
        );
      })}
    </svg>
  );
};

export default Equalizer;
