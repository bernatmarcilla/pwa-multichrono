import { useState } from 'react';
import { useChronoContext } from '../context/ChronoContext';
import { exportAndShare } from '../utils/exportShare';
import AddChronoModal from '../components/AddChronoModal';
import BottomBar from '../components/BottomBar';
import ChronoItem from '../components/ChronoItem';
import styles from './HomeScreen.module.css';

function HomeScreen() {
  const { state, dispatch, getDisplayElapsed } = useChronoContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleAdd = (name: string) => {
    dispatch({ type: 'ADD_CHRONO', payload: { name } });
    setModalVisible(false);
  };

  const handleExport = async () => {
    if (exporting || !state.chronos.length) return;
    setExporting(true);
    try {
      await exportAndShare(state.chronos, getDisplayElapsed);
    } catch {
      // share API rejected (user cancelled is not an error we surface)
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={styles.safe}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>MultiChrono</h1>
        {state.locked && <span className={styles.lockedIcon}>🔒</span>}

        <button
          className={`${styles.exportBtn} ${(!state.chronos.length || exporting) ? styles.exportBtnDisabled : ''}`}
          onClick={handleExport}
          disabled={!state.chronos.length || exporting}
          aria-label="Share / Export"
        >
          <span className={styles.shareIcon}>↑</span>
        </button>

        <button
          className={`${styles.addBtn} ${state.locked ? styles.addBtnDisabled : ''}`}
          onClick={() => setModalVisible(true)}
          disabled={state.locked}
        >
          + Add
        </button>
      </header>

      {/* Chrono list */}
      <main className={styles.main}>
        {state.chronos.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>⏱</span>
            <p className={styles.emptyTitle}>No chronometers yet</p>
            <p className={styles.emptySubtitle}>Tap "+ Add" to create your first one</p>
          </div>
        ) : (
          <div className={styles.list}>
            {state.chronos.map(chrono => (
              <ChronoItem key={chrono.id} chrono={chrono} />
            ))}
          </div>
        )}
      </main>

      <BottomBar />

      <AddChronoModal
        visible={modalVisible}
        onConfirm={handleAdd}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
}

export default HomeScreen;