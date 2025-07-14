import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

type CommentItemProps = {
  comment: {
    id: string;
    text: string;
  };
  onEditComment: (commentId: string, updatedText: string) => void;
  onDeleteComment: (commentId: string) => void;
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, onEditComment, onDeleteComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  useEffect(() => {
    if (!isEditing) setEditText(comment.text);
  }, [comment.text, isEditing]);

  return isEditing ? (
    <div className="flex gap-2 items-start">
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="border rounded px-2 py-1 w-full text-sm resize-none"
        rows={2}
        autoFocus
      />
      <button
        type="button"
        onClick={() => {
          if (editText.trim()) {
            onEditComment(comment.id, editText.trim());
            setIsEditing(false);
          }
        }}
        className="text-sm px-2 py-1 bg-blue-500 text-white rounded flex items-center gap-1 hover:bg-blue-700"
        title="Save"
      >
        <CheckIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setIsEditing(false)}
        className="text-sm px-2 py-1 text-gray-500 flex items-center gap-1 hover:text-black hover:font-bold"
        title="Cancel"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  ) : (
    <div
      className="group flex justify-between items-center text-sm border-b py-1"
    >
      <span>{comment.text}</span>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-800 p-1 rounded"
          title="Edit comment"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDeleteComment(comment.id)}
          className="text-red-500 hover:text-red-700 p-1 rounded"
          title="Delete comment"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CommentItem;
