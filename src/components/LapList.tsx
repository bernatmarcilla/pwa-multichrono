import React, { useMemo } from 'react';
import { Lap } from '../types';
import LapItem from './LapItem';
import styles from './LapList.module.css';

interface Props {
  laps: Lap[];
}

function LapList({ laps }: Props) {
  if (laps.length === 0) return null;

  const fastestIdx = useMemo(() => {
    if (laps.length < 2) return -1;
    return laps.reduce((minI, l, i) => (l.lapTime < laps[minI].lapTime ? i : minI), 0);
  }, [laps]);

  const slowestIdx = useMemo(() => {
    if (laps.length < 2) return -1;
    return laps.reduce((maxI, l, i) => (l.lapTime > laps[maxI].lapTime ? i : maxI), 0);
  }, [laps]);

  const reversed = useMemo(() => [...laps].reverse(), [laps]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={`${styles.headerCell} ${styles.lapNum}`}>Lap</span>
        <span className={`${styles.headerCell} ${styles.lapTime}`}>Time</span>
        <span className={`${styles.headerCell} ${styles.delta}`}>Δ</span>
        <span className={`${styles.headerCell} ${styles.accumulated}`}>Total</span>
      </div>
      <div>
        {reversed.map((lap, index) => {
          const origIdx = laps.length - 1 - index;
          return (
            <LapItem
              key={lap.number}
              lap={lap}
              isFastest={origIdx === fastestIdx}
              isSlowest={origIdx === slowestIdx}
            />
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(LapList);