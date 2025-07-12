import React, { useEffect, useState } from 'react';
import Modal from './Modal';

type TaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        id?: string;
        title?: string;
        description?: string;
    };
    onSubmit: (data: { id?: string; title: string; description?: string }) => void;
    mode: 'add' | 'edit';
};

const TaskCardModal: React.FC<TaskModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSubmit,
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
  } , [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
        onSubmit({
            id: initialData?.id,
            title: title.trim(),
            description: description.trim(),
        });
        setTitle('');
        setDescription('');
        onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">{mode === 'add' ? 'Add New Task' : 'Edit Task'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border rounded px-3 py-2"
            autoFocus
        />
        <textarea
            placeholder="Task Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="border rounded px-3 py-2 resize-none"
        />
        <div className="flex justify-end gap-2">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
            >
                {mode === 'add' ? 'Add Task' : 'Update Task'}
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskCardModal;
