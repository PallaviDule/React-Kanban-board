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
    addTask: (state, action: PayloadAction<{ columnId: string; title: string, description?: string }>) => {
      state.tasks.push({
        id: `task-${Date.now()}`,
        title: action.payload.title,
        columnId: action.payload.columnId,
        description: action.payload.description
      });
    },
    editTask: (
        state,
        action: PayloadAction<{
            id: string;
            title: string;
            description?: string;
        }>
        ) => {
        const { id, title, description } = action.payload;
        const existingTask = state.tasks.find((task) => task.id === id);
        if (existingTask) {
            existingTask.title = title;
            existingTask.description = description;
        }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
        const taskId = action.payload;
        state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },
  },
});

export const { addTask, editTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
