import React, { useState } from 'react';
import CommentItem from '../column/CommentItem';
import { addCommentToTask, deleteComment, editComment, type Comment } from '../../redux/tasksSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { v4 as uuid } from 'uuid';

type CommentsSectionProps = {
  comments?: Comment[];
};

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments = [],
}) => {
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();
  const {task} = useSelector((state: RootState) => state.modal);

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
    <div>
      <h3 className="text-sm font-semibold mb-2">Comments</h3>
      <div className="mb-4">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full text-sm resize-none"
          rows={2}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (newComment.trim()) {
                handleAddComment(newComment.trim());
                setNewComment('');
              }
            }}
            disabled={!newComment.trim()}
            className="px-1 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-800 transition disabled:opacity-50"
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
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
