import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteColumn, renameColumn } from '../redux/columnsSlice';
import { deleteTask } from '../redux/tasksSlice';
import SortableTaskCard from './SortableTaskCard';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '../redux/tasksSlice';
import type { Column } from '../redux/columnsSlice';
import { useDroppable } from '@dnd-kit/core';

type ColumnProps = {
  column: Column;
  tasks: Task[];
  onAddTaskClick: () => void;
  onEditTaskClick: (task: Task) => void;
  draggingTaskId: string;
};

const ColumnCard: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTaskClick,
  onEditTaskClick,
  draggingTaskId,
}) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const { setNodeRef } = useDroppable({
    id: column.id, // important: this id must match what you're checking in handleDragEnd
  });

  const handleRename = () => {
    if (editTitle.trim()) {
      dispatch(renameColumn({ id: column.id, newTitle: editTitle.trim() }));
    }
    setIsEditing(false);
  };

  return (
    <div
      className="bg-gray-100 rounded-md p-4 min-w-[250px] flex-shrink-0 flex flex-col"
      id={column.id} 
      style={{ minHeight: '150px' }}
      ref={setNodeRef}
    >
      <div className="flex justify-between items-start mb-2">
        {isEditing ? (
          <input
            autoFocus
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="font-semibold text-lg px-1 py-0.5 rounded border w-full mr-2"
          />
        ) : (
          <h2 className="font-semibold text-lg" onDoubleClick={() => setIsEditing(true)}>
            {column.title}
          </h2>
        )}

        <div className="flex gap-2 ml-2">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)}>
              <PencilIcon className="w-4 h-4 text-gray-500 hover:text-blue-600" />
            </button>
          )}
          <button onClick={() => dispatch(deleteColumn(column.id))}>
            <TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-600" />
          </button>
        </div>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.length === 0 && (
          <div className="flex-grow flex items-center justify-center text-gray-400 italic">
          </div>
        )}
        {tasks.map(task => (
          <SortableTaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTaskClick(task)}
            onDelete={() => dispatch(deleteTask(task.id))}
            draggingTaskId={draggingTaskId}
          />
        ))}
      </SortableContext>

      <button
        onClick={onAddTaskClick}
        className="mt-2 text-xs text-blue-600 hover:underline text-left"
      >
        + Add Task
      </button>
    </div>
  );
};

export default ColumnCard;
