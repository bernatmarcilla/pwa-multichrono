import React, { useEffect, useRef, useState } from 'react';
import styles from './AddChronoModal.module.css';

interface Props {
  visible: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

function AddChronoModal({ visible, onConfirm, onCancel }: Props) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) {
      // Small delay so the modal animation completes before focus
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      setName('');
    }
  }, [visible]);

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
    setName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm();
    if (e.key === 'Escape') onCancel();
  };

  if (!visible) return null;

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.dialog}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="New Chronometer"
      >
        <h2 className={styles.title}>New Chronometer</h2>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="Name (e.g. Alice)"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={30}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`${styles.btnAdd} ${!name.trim() ? styles.btnAddDisabled : ''}`}
            onClick={handleConfirm}
            disabled={!name.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddChronoModal;