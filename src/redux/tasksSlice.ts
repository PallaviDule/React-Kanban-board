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
    reorderTasks: (
      state,
      action: PayloadAction<{
        columnId: string;
        activeId: string;
        overId: string;
      }>
    ) => {
      const { columnId, activeId, overId } = action.payload;

      const columnTasks = state.tasks.filter(t => t.columnId === columnId);

      const oldIndex = columnTasks.findIndex(task => task.id === activeId);
      const newIndex = columnTasks.findIndex(task => task.id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      const idsInColumn = columnTasks.map(t => t.id);

      const reorderedIds = [...idsInColumn];
      const [moved] = reorderedIds.splice(oldIndex, 1);
      reorderedIds.splice(newIndex, 0, moved);

      // Apply new order to tasks in state
      const reorderedTasks = reorderedIds.map(id =>
        state.tasks.find(t => t.id === id)!
      );

      const otherTasks = state.tasks.filter(t => t.columnId !== columnId);
      state.tasks = [...otherTasks, ...reorderedTasks];
    },
    moveTaskToColumn: (
      state,
      action: PayloadAction<{
        taskId: string;
        toColumnId: string;
      }>
    ) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.columnId = action.payload.toColumnId;
      }
    },

  },
});

export const { addTask, editTask, deleteTask, reorderTasks,moveTaskToColumn } = tasksSlice.actions;
export default tasksSlice.reducer;
