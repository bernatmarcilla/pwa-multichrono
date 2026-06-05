import React from 'react';
import { Lap } from '../types';
import { formatDelta, formatTime } from '../utils/time';
import styles from './LapItem.module.css';

interface Props {
  lap: Lap;
  isFastest: boolean;
  isSlowest: boolean;
}

function LapItem({ lap, isFastest, isSlowest }: Props) {
  const deltaClass =
    lap.number === 1
      ? styles.deltaNeutral
      : lap.delta < 0
      ? styles.deltaFast
      : lap.delta > 0
      ? styles.deltaSlow
      : styles.deltaNeutral;

  const rowClass = [
    styles.row,
    isFastest ? styles.fastest : isSlowest ? styles.slowest : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rowClass}>
      <span className={`${styles.cell} ${styles.lapNum}`}>#{lap.number}</span>
      <span className={`${styles.cell} ${styles.lapTime} tabular`}>{formatTime(lap.lapTime)}</span>
      <span className={`${styles.cell} ${styles.delta} tabular ${deltaClass}`}>
        {lap.number === 1 ? '—' : formatDelta(lap.delta)}
      </span>
      <span className={`${styles.cell} ${styles.accumulated} tabular`}>{formatTime(lap.accumulated)}</span>
    </div>
  );
}

export default React.memo(LapItem);