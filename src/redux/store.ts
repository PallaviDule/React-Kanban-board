import { configureStore } from '@reduxjs/toolkit';
import columnsReducer from './columnsSlice';
import tasksReducer from './tasksSlice';
import modalReducer from './modalSlice';

const LOCAL_STORAGE_KEY = 'kanbanState';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return undefined; // no saved state, use defaults
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return undefined;
  }
};

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
};

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    columns: columnsReducer,
    tasks: tasksReducer,
    modal: modalReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
