import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import {
  addTask,
  editTask,
  addCommentToTask,
  editComment,
  deleteComment,
} from '../redux/tasksSlice';
import { close } from '../redux/modalSlice';
import type { RootState } from '../redux/store';
import TaskCardModal from './TaskCardModal';

const TaskController: React.FC = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const modal = useSelector((state: RootState) => state.modal);
    const { isOpen, mode, task, columnId } = modal;

    const currentTask = task?.id ? tasks.find((t) => t.id === task.id) : null;

    const handleAddTask = (title: string, description: string) => {
        if (!columnId) return;
        dispatch(addTask({ columnId, title, description }));
        dispatch(close()); // ✅ close modal
    };

    const handleEditTask = (id: string, title: string, description: string) => {
        dispatch(editTask({ id, title, description }));
        dispatch(close()); // ✅ close modal
    };

    const handleAddComment = (text: string) => {
        if (!task) return;
        dispatch(
        addCommentToTask({
            taskId: task.id,
            comment: { id: uuid(), text, createdAt: new Date().toISOString() },
        })
        );
    };

    const handleEditComment = (commentId: string, updatedText: string) => {
        if (!task) return;
        dispatch(editComment({ taskId: task.id, commentId, updatedText }));
    };

    const handleDeleteComment = (commentId: string) => {
        if (!task) return;
        dispatch(deleteComment({ taskId: task.id, commentId }));
    };

    return (
        <TaskCardModal
            isOpen={isOpen}
            onClose={() => dispatch(close())} // ✅ FIXED HERE
            mode={mode}
            initialData={
                task
                ? { id: task.id, title: task.title, description: task.description }
                : undefined
            }
            comments={currentTask?.comments || []}
            onSubmit={({ id, title, description }) => {
                if (mode === 'add') handleAddTask(title, description);
                else if (mode === 'edit' && id) handleEditTask(id, title, description);
            }}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
        />
    );
};

export default TaskController;
