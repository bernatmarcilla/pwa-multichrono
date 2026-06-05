import React from 'react';
import { useChronoContext } from '../context/ChronoContext';
import styles from './BottomBar.module.css';

function BottomBar() {
  const { dispatch, state } = useChronoContext();
  const { locked } = state;
  const hasChronos = state.chronos.length > 0;
  const ctrlDisabled = !hasChronos || locked;

  return (
    <div className={styles.bar}>
      <button
        className={`${styles.btn} ${ctrlDisabled ? styles.btnDisabled : ''}`}
        onClick={() => dispatch({ type: 'START_ALL' })}
        disabled={ctrlDisabled}
        aria-label="Start All"
      >
        <span className={styles.icon}>▶</span>
        <span className={styles.label}>Start All</span>
      </button>

      <button
        className={`${styles.btn} ${ctrlDisabled ? styles.btnDisabled : ''}`}
        onClick={() => dispatch({ type: 'STOP_ALL' })}
        disabled={ctrlDisabled}
        aria-label="Stop All"
      >
        <span className={styles.icon}>■</span>
        <span className={styles.label}>Stop All</span>
      </button>

      <button
        className={`${styles.btn} ${ctrlDisabled ? styles.btnDisabled : ''}`}
        onClick={() => dispatch({ type: 'LAP_ALL' })}
        disabled={ctrlDisabled}
        aria-label="Lap All"
      >
        <span className={styles.icon}>⏱</span>
        <span className={styles.label}>Lap All</span>
      </button>

      <button
        className={`${styles.btn} ${ctrlDisabled ? styles.btnDisabled : ''}`}
        onClick={() => dispatch({ type: 'RESET_ALL' })}
        disabled={ctrlDisabled}
        aria-label="Reset All"
      >
        <span className={styles.icon}>↺</span>
        <span className={styles.label}>Reset All</span>
      </button>

      <button
        className={`${styles.btn} ${locked ? styles.btnLocked : ''}`}
        onClick={() => dispatch({ type: 'TOGGLE_LOCK' })}
        aria-label={locked ? 'Unlock' : 'Lock'}
      >
        <span className={`${styles.icon} ${locked ? styles.iconLocked : ''}`}>🔒</span>
        <span className={`${styles.label} ${locked ? styles.labelLocked : ''}`}>
          {locked ? 'Locked' : 'Lock'}
        </span>
      </button>
    </div>
  );
}

export default React.memo(BottomBar);