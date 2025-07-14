import { useState } from 'react';
import type { Task } from '../redux/tasksSlice';

export const useTaskModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [task, setTask] = useState<Task | null>(null);
  const [columnId, setColumnId] = useState<string | null>(null);

  const openAdd = (colId: string) => {
      console.log('Opening modal for new task in column:', colId);
    setTask(null);
    setMode('add');
    setColumnId(colId);
    setIsOpen(true);
  };

  const openEdit = (task: Task) => {
    setTask(task);
    setMode('edit');
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTask(null);
    setColumnId(null);
  };

  return { isOpen, mode, task, columnId, openAdd, openEdit, close };
};
