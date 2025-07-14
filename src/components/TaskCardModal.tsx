import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { type Comment } from '../redux/tasksSlice';
import TaskForm from './TaskForm';
import CommentsSection from './CommentsSection';

type TaskCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    title?: string;
    description?: string;
  };
  onSubmit: (data: { id?: string; title: string; description?: string }) => void;
  onAddComment: (comment: string) => void;
  onEditComment: (commentId: string, updatedText: string) => void;
  onDeleteComment: (commentId: string) => void;
  comments?: Comment[];
  mode: 'add' | 'edit';
};

const TaskCardModal: React.FC<TaskCardModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  onAddComment,
  onEditComment,
  onDeleteComment,
  comments,
  mode,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      id: initialData?.id,
      title: title.trim(),
      description: description.trim(),
    });

    if (mode === 'add') {
      setTitle('');
      setDescription('');
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">
          {mode === 'add' ? 'Add New Task' : 'Edit Task'}
        </h2>

        <TaskForm
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
        />

        {mode === 'edit' && (
          <CommentsSection
            comments={comments}
            onAddComment={onAddComment}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
          />
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            {mode === 'add' ? 'Add Task' : 'Update Task'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskCardModal;
