import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTask,
  editTask,
  type Type,
  type Priority,
} from '../../redux/tasksSlice';
import { close } from '../../redux/modalSlice';
import type { RootState } from '../../redux/store';
import TaskCardModal from './TaskCardModal';

const TaskController: React.FC = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const modal = useSelector((state: RootState) => state.modal);
    const { isOpen, mode, task, columnId } = modal;

    const currentTask = task?.id ? tasks.find((t) => t.id === task.id) : null;

    const handleAddTask = (title: string, description: string | undefined, type: Type, priority: Priority) => {
        if (!columnId) return;
        dispatch(addTask({ columnId, title, description, type, priority}));
        dispatch(close());
    };

    const handleEditTask = (id: string, title: string, description: string, type: Type, priority: Priority) => {
        dispatch(editTask({ id, title, description, type, priority }));
        dispatch(close());
    };

    const initialData = task ? { 
        id: task.id, 
        title: task.title, 
        description: task.description,
        type: task.type,
        priority: task.priority
        }: undefined

    return (
        <TaskCardModal
            isOpen={isOpen}
            onClose={() => dispatch(close())}
            mode={mode}
            initialData ={initialData}
            comments={currentTask?.comments || []}
            onSubmit={({ id, title, description, type, priority }) => {
                if (mode === 'add') handleAddTask(title, description, type, priority);
                else if (mode === 'edit' && id) handleEditTask(id, title, description, type, priority);
            }}
        />
    );
};

export default TaskController;
