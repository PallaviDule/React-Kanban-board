import React, { useState } from 'react';
import CommentItem from './CommentItem';
import { type Comment } from '../redux/tasksSlice';

type CommentsSectionProps = {
  comments?: Comment[];
  onAddComment: (comment: string) => void;
  onEditComment: (commentId: string, updatedText: string) => void;
  onDeleteComment: (commentId: string) => void;
};

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments = [],
  onAddComment,
  onEditComment,
  onDeleteComment,
}) => {
  const [newComment, setNewComment] = useState('');

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2">Comments</h3>

      {/* Input first */}
      <div className="mb-4">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border rounded px-3 py-2 w-full text-sm resize-none"
          rows={2}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (newComment.trim()) {
                onAddComment(newComment.trim());
                setNewComment('');
              }
            }}
            disabled={!newComment.trim()}
            className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            Add Comment
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="max-h-40 overflow-y-auto space-y-2 rounded-2xl bg-gray-50 p-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        ) : (
          [...comments]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // newest first
            .map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                onEditComment={onEditComment}
                onDeleteComment={onDeleteComment}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
