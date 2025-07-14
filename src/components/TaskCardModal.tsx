import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { type Comment } from '../redux/tasksSlice';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

type TaskModalProps = {
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

const TaskCardModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  onAddComment,
  onEditComment,
  onDeleteComment,
  mode,
  comments,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newComment, setNewComment] = useState('');

  // For editing comments
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
    setEditingCommentId(null);
    setEditingText('');
    setNewComment('');
  }, [initialData, isOpen]);

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
      <h2 className="text-xl font-semibold mb-4">
        {mode === 'add' ? 'Add New Task' : 'Edit Task'}
      </h2>
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

        {mode === 'edit' && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold mb-1">Comments</h3>

            <div className="max-h-40 overflow-y-auto space-y-1 border rounded bg-gray-50 p-2">
              {comments && comments.length > 0 ? (
                comments.map((c) =>
                  editingCommentId === c.id ? (
                    <div key={c.id} className="flex gap-2 items-start">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="border rounded px-2 py-1 w-full text-sm resize-none"
                        rows={2}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editingText.trim()) {
                            onEditComment(c.id, editingText.trim());
                            setEditingCommentId(null);
                          }
                        }}
                        className="text-sm px-2 py-1 bg-green-500 text-white rounded flex items-center gap-1"
                        title="Save"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCommentId(null)}
                        className="text-sm px-2 py-1 text-gray-500 flex items-center gap-1"
                        title="Cancel"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      key={c.id}
                      className="group flex justify-between items-center text-sm border-b py-1"
                    >
                      <span>{c.text}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCommentId(c.id);
                            setEditingText(c.text);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="Edit comment"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteComment(c.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded"
                          title="Delete comment"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              )}
            </div>

            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mt-2 border rounded px-3 py-1 w-full text-sm resize-none"
              rows={2}
            />
            <button
              type="button"
              className="text-sm px-3 py-1 bg-blue-500 text-white rounded mt-1"
              disabled={!newComment.trim()}
              onClick={() => {
                if (newComment.trim()) {
                  onAddComment(newComment.trim());
                  setNewComment('');
                }
              }}
            >
              Add Comment
            </button>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
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
