import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Comment = {
  id: string;
  text: string;
  createdAt: string;
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  comments?: Comment[];
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
moveTaskToColumn: (state, action) => {
  const { taskId, toColumnId, beforeTaskId } = action.payload;
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  // Remove task from current position
  state.tasks = state.tasks.filter(t => t.id !== taskId);

  task.columnId = toColumnId;

  // Find insertion index in new column
  const columnTasks = state.tasks.filter(t => t.columnId === toColumnId);
  let insertIndex = state.tasks.length; // default append at end

  if (beforeTaskId) {
    const beforeIndex = state.tasks.findIndex(t => t.id === beforeTaskId);
    insertIndex = beforeIndex === -1 ? state.tasks.length : beforeIndex;
  }

  // Insert task at calculated index
  state.tasks.splice(insertIndex, 0, task);
},

reorderTasks: (state, action) => {
  const { columnId, activeId, overId } = action.payload;

  const columnTasks = state.tasks.filter(t => t.columnId === columnId);

  const oldIndex = columnTasks.findIndex(t => t.id === activeId);
  const newIndex = columnTasks.findIndex(t => t.id === overId);
  if (oldIndex === -1 || newIndex === -1) return;

  // Remove active task from array
  const [removed] = columnTasks.splice(oldIndex, 1);
  // Insert at new position
  columnTasks.splice(newIndex, 0, removed);

  // Rebuild state.tasks with updated order for this column
  const otherTasks = state.tasks.filter(t => t.columnId !== columnId);
  state.tasks = [...otherTasks, ...columnTasks];
},

    addCommentToTask: (state, action: PayloadAction<{ taskId: string; comment: Comment }>) => {
      const { taskId, comment } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.comments = task.comments || [];
        task.comments.push(comment);
      }
    },
    editComment: (
      state,
      action: PayloadAction<{
        taskId: string;
        commentId: string;
        updatedText: string;
      }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task && task.comments) {
        const comment = task.comments.find((c) => c.id === action.payload.commentId);
        if (comment) {
          comment.text = action.payload.updatedText;
        }
      }
    },

    deleteComment: (
      state,
      action: PayloadAction<{ taskId: string; commentId: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task && task.comments) {
        task.comments = task.comments.filter((c) => c.id !== action.payload.commentId);
      }
    },
      },
});

export const { addTask, editTask, deleteTask, reorderTasks,moveTaskToColumn, addCommentToTask, editComment, deleteComment } = tasksSlice.actions;
export default tasksSlice.reducer;
