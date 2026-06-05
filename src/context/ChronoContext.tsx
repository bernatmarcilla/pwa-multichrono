import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useReducer,
} from 'react';
import { AppAction, AppState, Chronometer } from '../types';
import { initialState, reducer } from './reducer';

const STORAGE_KEY = 'multichrono_state';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return JSON.parse(raw) as AppState;
  } catch {
    return initialState;
  }
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or private mode — ignore
  }
}

interface ChronoContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getDisplayElapsed: (chrono: Chronometer) => number;
}

const ChronoContext = createContext<ChronoContextValue | null>(null);

export function ChronoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist to localStorage on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Single shared interval — only alive when ≥1 chrono is running
  useEffect(() => {
    const anyRunning = state.chronos.some(c => c.isRunning);

    if (anyRunning && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK', payload: { now: Date.now() } });
      }, 100);
    }

    if (!anyRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [state.chronos]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getDisplayElapsed = useCallback((chrono: Chronometer): number => {
    if (chrono.isRunning && chrono.startedAt !== null) {
      return chrono.elapsed + (Date.now() - chrono.startedAt);
    }
    return chrono.elapsed;
  }, []);

  return (
    <ChronoContext.Provider value={{ state, dispatch, getDisplayElapsed }}>
      {children}
    </ChronoContext.Provider>
  );
}

export function useChronoContext(): ChronoContextValue {
  const ctx = useContext(ChronoContext);
  if (!ctx) throw new Error('useChronoContext must be used inside ChronoProvider');
  return ctx;
}