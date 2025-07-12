import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
}

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ columnId: string; title: string }>) => {
      state.tasks.push({
        id: `task-${Date.now()}`,
        title: action.payload.title,
        columnId: action.payload.columnId,
      });
    },
    // We’ll add edit/delete/move later
  },
});

export const { addTask } = tasksSlice.actions;
export default tasksSlice.reducer;
