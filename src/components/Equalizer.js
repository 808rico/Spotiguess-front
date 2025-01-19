import React, { useEffect, useState } from 'react';
import './Equalizer.css';

const BAR_COUNT = 6;
const MAX_HEIGHT = 100;
const UPDATE_INTERVAL = 10;
const WAVE_DURATION = 1;

function wave(t) {
  const cycle = t % WAVE_DURATION;

  if (cycle < 0.5) {
    const p = cycle / 0.5;
    return 1 + 99 * p;
  } else {
    const p = (cycle - 0.5) / 0.5;
    return 100 - 99 * p;
  }
}

const Equalizer = ({ isPlaying }) => {
  const [barHeights, setBarHeights] = useState(
    Array.from({ length: BAR_COUNT }, () => 2)
  );

  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalId;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setTime(t => t + UPDATE_INTERVAL / 1000);
      }, UPDATE_INTERVAL);
    } else {
      setBarHeights(Array.from({ length: BAR_COUNT }, () => 2));
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const newHeights = Array.from({ length: BAR_COUNT }, (_, i) => {
      const barDelay = i * 0.2;
      const currentTime = time + barDelay;
      return wave(currentTime);
    });

    setBarHeights(newHeights);
  }, [time, isPlaying]);

  return (
    <svg className="svgEqualizer" viewBox="0 0 250 100" xmlns="http://www.w3.org/2000/svg">
      {barHeights.map((height, i) => {
        const xPos = 10 + i * 42;
        const yPos = MAX_HEIGHT - height;

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
