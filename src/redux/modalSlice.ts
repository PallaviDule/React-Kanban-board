import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task } from './tasksSlice';

interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  task: Task | null;
  columnId: string | null;
}

const initialState: ModalState = {
  isOpen: false,
  mode: 'add',
  task: null,
  columnId: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openAdd(state, action: PayloadAction<string>) {
      state.isOpen = true;
      state.mode = 'add';
      state.task = null;
      state.columnId = action.payload;
    },
    openEdit(state, action: PayloadAction<Task>) {
      state.isOpen = true;
      state.mode = 'edit';
      state.task = action.payload;
      state.columnId = null;
    },
    close(state) {
      state.isOpen = false;
      state.task = null;
      state.columnId = null;
    },
  },
});

export const { openAdd, openEdit, close } = modalSlice.actions;
export default modalSlice.reducer;
