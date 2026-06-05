import React from 'react';
import styles from './ChronoControls.module.css';

interface Props {
  isRunning: boolean;
  hasTime: boolean;
  disabled: boolean;
  onStartStop: () => void;
  onLap: () => void;
  onClear: () => void;
}

function ChronoControls({ isRunning, hasTime, disabled, onStartStop, onLap, onClear }: Props) {
  const lapDisabled = disabled || !isRunning;
  const clearDisabled = disabled || (!hasTime && !isRunning);

  return (
    <div className={styles.row}>
      <button
        className={`${styles.iconBtn} ${clearDisabled ? styles.btnDisabled : ''}`}
        onClick={onClear}
        disabled={clearDisabled}
        aria-label="Reset"
      >
        ↺
      </button>

      <button
        className={`${styles.lapBtn} ${lapDisabled ? styles.btnDisabled : ''}`}
        onClick={onLap}
        disabled={lapDisabled}
        aria-label="Lap"
      >
        Lap
      </button>

      <button
        className={`${styles.startStopBtn} ${isRunning ? styles.btnStop : styles.btnStart} ${disabled ? styles.btnDisabled : ''}`}
        onClick={onStartStop}
        disabled={disabled}
        aria-label={isRunning ? 'Stop' : 'Start'}
      >
        {isRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}

export default React.memo(ChronoControls);