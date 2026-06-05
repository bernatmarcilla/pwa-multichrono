export interface Lap {
  number: number;
  lapTime: number;
  delta: number;
  accumulated: number;
}

export interface Chronometer {
  id: string;
  name: string;
  isRunning: boolean;
  elapsed: number;
  startedAt: number | null;
  laps: Lap[];
}

export interface AppState {
  chronos: Chronometer[];
  locked: boolean;
}

export type AppAction =
  | { type: 'ADD_CHRONO'; payload: { name: string } }
  | { type: 'REMOVE_CHRONO'; payload: { id: string } }
  | { type: 'START'; payload: { id: string } }
  | { type: 'STOP'; payload: { id: string } }
  | { type: 'LAP'; payload: { id: string } }
  | { type: 'CLEAR'; payload: { id: string } }
  | { type: 'START_ALL' }
  | { type: 'STOP_ALL' }
  | { type: 'RESET_ALL' }
  | { type: 'LAP_ALL' }
  | { type: 'TOGGLE_LOCK' }
  | { type: 'TICK'; payload: { now: number } };