import { AppAction, AppState, Chronometer, Lap } from '../types';
import { generateId } from '../utils/time';

export const initialState: AppState = {
  chronos: [],
  locked: false,
};

function computeElapsed(chrono: Chronometer, now: number): number {
  if (chrono.isRunning && chrono.startedAt !== null) {
    return chrono.elapsed + (now - chrono.startedAt);
  }
  return chrono.elapsed;
}

function lapChrono(chrono: Chronometer, now: number): Chronometer {
  const totalElapsed = computeElapsed(chrono, now);
  const prevAccumulated =
    chrono.laps.length > 0 ? chrono.laps[chrono.laps.length - 1].accumulated : 0;
  const lapTime = totalElapsed - prevAccumulated;
  const prevLapTime =
    chrono.laps.length > 0 ? chrono.laps[chrono.laps.length - 1].lapTime : 0;
  const delta = chrono.laps.length === 0 ? 0 : lapTime - prevLapTime;

  const newLap: Lap = {
    number: chrono.laps.length + 1,
    lapTime,
    delta,
    accumulated: totalElapsed,
  };

  return {
    ...chrono,
    elapsed: totalElapsed,
    startedAt: chrono.isRunning ? now : chrono.startedAt,
    laps: [...chrono.laps, newLap],
  };
}

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_CHRONO': {
      const newChrono: Chronometer = {
        id: generateId(),
        name: action.payload.name,
        isRunning: false,
        elapsed: 0,
        startedAt: null,
        laps: [],
      };
      return { ...state, chronos: [...state.chronos, newChrono] };
    }

    case 'REMOVE_CHRONO':
      return {
        ...state,
        chronos: state.chronos.filter(c => c.id !== action.payload.id),
      };

    case 'START': {
      const now = Date.now();
      return {
        ...state,
        chronos: state.chronos.map(c =>
          c.id === action.payload.id && !c.isRunning
            ? { ...c, isRunning: true, startedAt: now }
            : c,
        ),
      };
    }

    case 'STOP': {
      const now = Date.now();
      return {
        ...state,
        chronos: state.chronos.map(c =>
          c.id === action.payload.id && c.isRunning
            ? { ...c, isRunning: false, elapsed: c.elapsed + (now - c.startedAt!), startedAt: null }
            : c,
        ),
      };
    }

    case 'LAP': {
      const now = Date.now();
      return {
        ...state,
        chronos: state.chronos.map(c =>
          c.id === action.payload.id ? lapChrono(c, now) : c,
        ),
      };
    }

    case 'CLEAR':
      return {
        ...state,
        chronos: state.chronos.map(c =>
          c.id === action.payload.id
            ? { ...c, isRunning: false, elapsed: 0, startedAt: null, laps: [] }
            : c,
        ),
      };

    case 'START_ALL': {
      const now = Date.now();
      return {
        ...state,
        chronos: state.chronos.map(c =>
          !c.isRunning ? { ...c, isRunning: true, startedAt: now } : c,
        ),
      };
    }

    case 'STOP_ALL': {
      const now = Date.now();
      return {
        ...state,
        chronos: state.chronos.map(c =>
          c.isRunning
            ? { ...c, isRunning: false, elapsed: c.elapsed + (now - c.startedAt!), startedAt: null }
            : c,
        ),
      };
    }

    case 'RESET_ALL':
      return {
        ...state,
        chronos: state.chronos.map(c => ({
          ...c,
          isRunning: false,
          elapsed: 0,
          startedAt: null,
          laps: [],
        })),
      };

    case 'LAP_ALL': {
      const now = Date.now();
      return {
        ...state,
        chronos: state.chronos.map(c => lapChrono(c, now)),
      };
    }

    case 'TOGGLE_LOCK':
      return { ...state, locked: !state.locked };

    case 'TICK': {
      const hasRunning = state.chronos.some(c => c.isRunning);
      if (!hasRunning) return state;
      return {
        ...state,
        chronos: state.chronos.map(c => (c.isRunning ? { ...c } : c)),
      };
    }

    default:
      return state;
  }
}