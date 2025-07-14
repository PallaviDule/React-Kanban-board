import { configureStore } from '@reduxjs/toolkit';
import columnsReducer from './columnsSlice';
import tasksReducer from './tasksSlice';
import modalReducer from './modalSlice';

export const store = configureStore({
  reducer: {
    columns: columnsReducer,
    tasks: tasksReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
