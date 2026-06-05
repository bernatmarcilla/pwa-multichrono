import React, { useCallback, useRef, useState } from 'react';
import { useChronoContext } from '../context/ChronoContext';
import { Chronometer } from '../types';
import { formatTime } from '../utils/time';
import ChronoControls from './ChronoControls';
import LapList from './LapList';
import styles from './ChronoItem.module.css';

const DELETE_WIDTH = 80;
const THRESHOLD = DELETE_WIDTH / 2;

interface Props {
  chrono: Chronometer;
}

function ChronoItem({ chrono }: Props) {
  const { dispatch, getDisplayElapsed, state } = useChronoContext();
  const locked = state.locked;
  const [collapsed, setCollapsed] = useState(false);

  const displayMs = getDisplayElapsed(chrono);

  // Swipe-to-delete state
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isOpen = useRef(false);
  const isDragging = useRef(false);
  const directionLocked = useRef<'h' | 'v' | null>(null);

  const snapTo = useCallback((toValue: number, animated = true) => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = animated ? 'transform 0.2s ease-out' : 'none';
    card.style.transform = `translateX(${toValue}px)`;
    isOpen.current = toValue < 0;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (locked) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = false;
      directionLocked.current = null;
      const card = cardRef.current;
      if (card) card.style.transition = 'none';
    },
    [locked],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (locked) return;
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;

      if (!directionLocked.current) {
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
        directionLocked.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }

      if (directionLocked.current === 'v') return;

      // Horizontal drag — prevent scroll
      e.preventDefault();
      isDragging.current = true;

      const base = isOpen.current ? -DELETE_WIDTH : 0;
      const next = Math.min(0, Math.max(-DELETE_WIDTH, base + dx));
      const card = cardRef.current;
      if (card) card.style.transform = `translateX(${next}px)`;
    },
    [locked],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const base = isOpen.current ? -DELETE_WIDTH : 0;
      const projected = base + dx;
      snapTo(projected < -THRESHOLD ? -DELETE_WIDTH : 0);
      isDragging.current = false;
    },
    [snapTo],
  );

  const handleStartStop = useCallback(() => {
    snapTo(0);
    dispatch(
      chrono.isRunning
        ? { type: 'STOP', payload: { id: chrono.id } }
        : { type: 'START', payload: { id: chrono.id } },
    );
  }, [dispatch, chrono.id, chrono.isRunning, snapTo]);

  const handleLap = useCallback(() => {
    dispatch({ type: 'LAP', payload: { id: chrono.id } });
  }, [dispatch, chrono.id]);

  const handleClear = useCallback(() => {
    dispatch({ type: 'CLEAR', payload: { id: chrono.id } });
  }, [dispatch, chrono.id]);

  const handleDelete = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.transition = 'transform 0.2s ease-out';
      card.style.transform = `translateX(-${DELETE_WIDTH * 2}px)`;
    }
    setTimeout(() => {
      dispatch({ type: 'REMOVE_CHRONO', payload: { id: chrono.id } });
    }, 200);
  }, [dispatch, chrono.id]);

  const toggleCollapsed = useCallback(() => {
    if (chrono.laps.length > 0) setCollapsed(v => !v);
  }, [chrono.laps.length]);

  return (
    <div className={styles.wrapper}>
      {/* Delete reveal area */}
      <div className={styles.deleteArea}>
        <button className={styles.deleteBtn} onClick={handleDelete} aria-label="Delete">
          🗑
          <span className={styles.deleteLabel}>Delete</span>
        </button>
      </div>

      {/* Swipeable card */}
      <div
        ref={cardRef}
        className={styles.card}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => snapTo(0)}
      >
        {/* Name + timer row */}
        <div className={styles.topRow}>
          <button
            className={styles.infoBlock}
            onClick={toggleCollapsed}
            style={{ cursor: chrono.laps.length > 0 ? 'pointer' : 'default' }}
          >
            <div className={styles.nameRow}>
              <span className={styles.name}>{chrono.name}</span>
              {chrono.laps.length > 0 && (
                <span className={styles.chevron}>{collapsed ? '▶' : '▼'}</span>
              )}
            </div>
            <span
              className={`${styles.timer} tabular ${chrono.isRunning ? styles.timerRunning : ''}`}
            >
              {formatTime(displayMs)}
            </span>
          </button>
          <ChronoControls
            isRunning={chrono.isRunning}
            hasTime={displayMs > 0}
            disabled={locked}
            onStartStop={handleStartStop}
            onLap={handleLap}
            onClear={handleClear}
          />
        </div>

        {/* Lap toggle hint */}
        {chrono.laps.length > 0 && (
          <button className={styles.lapToggleHint} onClick={toggleCollapsed}>
            <span className={styles.lapToggleText}>
              {collapsed
                ? `▶  ${chrono.laps.length} lap${chrono.laps.length > 1 ? 's' : ''} — tap to expand`
                : '▼  tap to collapse'}
            </span>
          </button>
        )}

        {!collapsed && <LapList laps={chrono.laps} />}
      </div>
    </div>
  );
}

export default React.memo(ChronoItem);